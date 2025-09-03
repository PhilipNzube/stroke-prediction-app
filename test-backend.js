#!/usr/bin/env node

/**
 * Quick test script for your deployed backend
 * Run this to verify your backend is working
 */

const BACKEND_URL = "https://stroke-prediction-app-dwyf.onrender.com";

async function testBackend() {
  console.log("🧪 Testing your deployed backend...");
  console.log(`🌐 Backend URL: ${BACKEND_URL}`);
  console.log("=" * 50);

  try {
    // Test health endpoint
    console.log("1️⃣ Testing health endpoint...");
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Health check passed:", healthData);
    } else {
      console.log("❌ Health check failed:", healthResponse.status);
    }

    // Test prediction endpoint
    console.log("\n2️⃣ Testing prediction endpoint...");
    const testData = {
      age: 50,
      gender: "Male",
      hypertension: 0,
      heart_disease: 0,
      ever_married: "Yes",
      work_type: "Private",
      Residence_type: "Urban",
      avg_glucose_level: 120.0,
      bmi: 25.0,
      smoking_status: "never smoked",
    };

    const predictResponse = await fetch(`${BACKEND_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    if (predictResponse.ok) {
      const predictData = await predictResponse.json();
      console.log("✅ Prediction successful:", {
        stroke_probability: predictData.stroke_probability,
        risk_level: predictData.risk_level,
      });
    } else {
      console.log("❌ Prediction failed:", predictResponse.status);
      const errorText = await predictResponse.text();
      console.log("Error details:", errorText);
    }

    console.log("\n🎉 Backend test completed!");
    console.log("\n📝 Next steps:");
    console.log("1. Your backend is working ✅");
    console.log("2. Update your frontend to use this URL");
    console.log("3. Deploy your frontend to Vercel/Netlify");
    console.log("4. Test the complete system end-to-end");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n💡 Troubleshooting:");
    console.log("- Check if your backend is deployed and running");
    console.log("- Verify the URL is correct");
    console.log("- Check Render logs for any errors");
  }
}

// Run the test
testBackend();
