const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const util = require('util'); // For promisify
require('dotenv').config();

const execPromise = util.promisify(exec);

// Initialize Gemini API with your API key (store in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to escape LaTeX special characters
const escapeLatex = (str) => {
  return str
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\~{}')
    .replace(/\^/g, '\\^{}')
    .replace(/\\/g, '\\textbackslash{}');
};

// Helper to check if latexmk is available
const checkLatexmk = async (options) => {
  try {
    await execPromise('latexmk -version', options);
  } catch (error) {
    throw new Error('latexmk not found in PATH. Ensure MacTeX is installed and PATH includes /Library/TeX/texbin. Run "latexmk -version" in terminal to verify.');
  }
};

// Controller for monthly report with PDF generation
const getMonthlyReport = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing or invalid!' });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token!' });
    }

    const { month } = req.query; // Expect month as query param (0-11)
    if (month === undefined || isNaN(month) || month < 0 || month > 11) {
      return res.status(400).json({ error: 'Invalid month. Use 0-11 (0 = January, 11 = December)' });
    }

    const User = require('../models/user.js'); // Adjust path as needed
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Token does not contain userId' });
    }
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Aggregate monthly data
    const monthLog = user.foodLogs.monthlyLogs.find(log => log.month === parseInt(month));
    if (!monthLog || !monthLog.dailyEntries.length) {
      return res.status(200).json({ message: 'No data for report' });
    }

    const totalCalories = monthLog.dailyEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const totalProtein = monthLog.dailyEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
    const totalCarbs = monthLog.dailyEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
    const totalFats = monthLog.dailyEntries.reduce((sum, entry) => sum + (entry.fats || 0), 0);
    const daysLogged = monthLog.dailyEntries.length;

    // Prepare prompt for Gemini
    const prompt = `
      Based on the following monthly food log data, provide a brief health report overview, recommendations, and highlight high and low consumptions:
      - Total Calories: ${totalCalories}
      - Total Protein: ${totalProtein}g
      - Total Carbs: ${totalCarbs}g
      - Total Fats: ${totalFats}g
      - Days Logged: ${daysLogged}
      Assume average daily needs are ~2000 calories, 50g protein, 250g carbs, and 70g fats for a general adult. Adjust recommendations accordingly.
      Return a JSON object with:
      {
        "overview": "string",
        "recommendations": "string",
        "highConsumption": "string",
        "lowConsumption": "string"
      }
    `;

    let report = {
      overview: `Monthly summary for ${daysLogged} days: Total calories ${totalCalories}, protein ${totalProtein}g, carbs ${totalCarbs}g, fats ${totalFats}g.`,
      recommendations: 'Maintain balanced intake; consult a professional for personalized advice.',
      highConsumption: 'No specific high areas noted.',
      lowConsumption: 'No specific low areas noted.'
    }; // Fallback if Gemini fails

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().replace(/```json\n|```/g, '').trim();
      report = JSON.parse(text);
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      // Proceed with fallback report
    }

    // Calculate macro percentages for pie chart (based on caloric contribution)
    const proteinCals = totalProtein * 4;
    const carbsCals = totalCarbs * 4;
    const fatsCals = totalFats * 9;
    const proteinPct = totalCalories > 0 ? Math.round((proteinCals / totalCalories) * 100) : 0;
    const carbsPct = totalCalories > 0 ? Math.round((carbsCals / totalCalories) * 100) : 0;
    const fatsPct = totalCalories > 0 ? Math.round((fatsCals / totalCalories) * 100) : 0;

    // Prepare LaTeX content with pie chart (using pgf-pie) and line chart (using pgfplots)
    const latexContent = `
\\documentclass{article}
\\usepackage{pgfplots}
\\usepackage{pgf-pie}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\pgfplotsset{compat=1.18}

\\begin{document}

\\section*{Monthly Health Report - Month ${parseInt(month) + 1}}

\\textbf{Overview:} ${escapeLatex(report.overview)}\\\\

\\textbf{Recommendations:} ${escapeLatex(report.recommendations)}\\\\

\\textbf{High Consumption:} ${escapeLatex(report.highConsumption)}\\\\

\\textbf{Low Consumption:} ${escapeLatex(report.lowConsumption)}\\\\

\\subsection*{Macronutrient Distribution (Pie Chart)}
\\begin{tikzpicture}
  \\pie[color={blue!50, green!50, red!50}, radius=3, text=legend]{${proteinPct}/Protein, ${carbsPct}/Carbs, ${fatsPct}/Fats}
\\end{tikzpicture}

\\subsection*{Daily Calorie Intake (Line Chart)}
\\begin{tikzpicture}
  \\begin{axis}[xlabel=Day, ylabel=Calories, grid=major]
    \\addplot coordinates {
      ${monthLog.dailyEntries.map((entry, index) => `(${index + 1}, ${entry.calories || 0})`).join('\n      ')}
    };
  \\end{axis}
\\end{tikzpicture}

\\end{document}
    `;

    // Write LaTeX to a temporary file
    const fs = require('fs');
    const fsPromises = fs.promises;
    const tempFile = `report_${userId}_${month}.tex`;
    await fsPromises.writeFile(tempFile, latexContent);

    // Set exec options with explicit PATH
    const texPath = '/Library/TeX/texbin';
    const options = {
      env: {
        ...process.env,
        PATH: `${texPath}:${process.env.PATH || ''}`
      }
    };

    // Check latexmk first
    await checkLatexmk(options);

    // Compile LaTeX to PDF
    await execPromise(`latexmk -pdf ${tempFile}`, options);

    // Send the PDF as a response
    const pdfPath = tempFile.replace('.tex', '.pdf');
    res.setHeader('Content-Disposition', `attachment; filename="monthly_report_${parseInt(month) + 1}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');

    const pdfStream = fs.createReadStream(pdfPath);
    pdfStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).json({ error: 'Failed to send PDF', details: err.message });
    });
    pdfStream.pipe(res);

    // Clean up temporary files after response is finished
    res.on('finish', async () => {
      try {
        await execPromise(`latexmk -c ${tempFile}`, options);
        await fsPromises.unlink(tempFile);
        await fsPromises.unlink(pdfPath);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    });
  } catch (error) {
    console.error('Error in getMonthlyReport:', error);
    res.status(500).json({
      error: 'Failed to generate monthly report',
      details: error.message,
    });
  }
};

module.exports = { getMonthlyReport };