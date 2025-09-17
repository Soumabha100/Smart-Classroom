// File: server/checkModels.js
require('dotenv').config();

async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in your .env file.");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  console.log("Fetching available models for your API key...");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();

    console.log("\n✅ Success! Here are the models you can use:");
    data.models.forEach(model => {
      // We only care about models that can generate text content
      if (model.supportedGenerationMethods.includes('generateContent')) {
        console.log(`- ${model.name} (Display Name: ${model.displayName})`);
      }
    });

    console.log("\nACTION: Copy one of the model names above (e.g., 'models/gemini-pro') and paste it into your aiController.js file.");

  } catch (error) {
    console.error("\n❌ Failed to list models:", error.message);
    console.error("\nPlease check that your API key is correct and that the 'Generative Language API' is enabled in your Google Cloud project.");
  }
}

listAvailableModels();