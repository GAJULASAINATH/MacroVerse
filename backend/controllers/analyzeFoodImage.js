const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API with your API key (store in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Controller to analyze food image
const analyzeFoodImage = async (req, res) => {
  try {
    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Use Gemini 2.5 Pro model (free tier, supports images)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    // Define prompt for nutrient analysis
    const prompt = `
      Analyze the food in this image and estimate its macro and micro nutrients.
      Return a JSON object with the following structure:
      {
        "macros": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number
        },
        "micros": {
          "vitaminA": "string",
          "vitaminC": "string",
          "iron": "string",
          "calcium": "string"
        }
      }
    `;

    // Send image and prompt to Gemini API
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype, // e.g., 'image/jpeg'
        },
      },
    ]);

    // Parse the response
    const response = await result.response;
    let jsonOutput;
    try {
      // Extract JSON from response (Gemini wraps JSON in markdown, so clean it)
      const text = response.text().replace(/```json\n|```/g, '');
      jsonOutput = JSON.parse(text);
    } catch (parseError) {
      return res.status(500).json({ error: 'Failed to parse Gemini response', details: parseError.message });
    }

    // Return the nutrient data
    res.status(200).json(jsonOutput);
  } catch (error) {
    // Handle API errors (e.g., rate limits, invalid key)
    res.status(500).json({
      error: 'Failed to analyze food image',
      details: error.message,
    });
  }
};

module.exports = { analyzeFoodImage };