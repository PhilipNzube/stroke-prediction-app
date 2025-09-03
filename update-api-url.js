#!/usr/bin/env node

/**
 * Quick script to update your production API URL
 * Run this after you deploy your backend to Render
 */

const fs = require("fs");
const path = require("path");

// Your Render backend URL (replace with your actual URL)
const PRODUCTION_URL = "https://your-backend-name.onrender.com";

// Path to the API config file
const configPath = path.join(__dirname, "src", "config", "api.js");

try {
  // Read the current config
  let configContent = fs.readFileSync(configPath, "utf8");

  // Replace the placeholder URL
  configContent = configContent.replace(
    /baseURL: 'https:\/\/your-backend-name\.onrender\.com'/,
    `baseURL: '${PRODUCTION_URL}'`
  );

  // Write the updated config
  fs.writeFileSync(configPath, configContent, "utf8");

  console.log("✅ API URL updated successfully!");
  console.log(`🌐 Production URL: ${PRODUCTION_URL}`);
  console.log("🚀 Your frontend is now connected to your deployed backend!");
} catch (error) {
  console.error("❌ Error updating API URL:", error.message);
  console.log("\n📝 Manual update required:");
  console.log(`1. Open: src/config/api.js`);
  console.log(`2. Change: 'https://your-backend-name.onrender.com'`);
  console.log(`3. To: '${PRODUCTION_URL}'`);
}
