const mongoose = require("mongoose");

async function connectDB() {
  const localUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fitness";
  try {
    await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("✓ MongoDB connected successfully to local instance");
  } catch (error) {
    console.log("✗ Local MongoDB connection failed. Starting in-memory MongoDB server...");
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      // Use version 4.4.24 which is much smaller (approx 60-70MB) than 8.0+ (780MB)
      const mongoServer = await MongoMemoryServer.create({
        binary: {
          version: "4.4.24"
        }
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✓ Connected to in-memory MongoDB successfully: ${mongoUri}`);
    } catch (memError) {
      console.error("✗ In-memory MongoDB failed to start:", memError.message);
      process.exit(1);
    }
  }
}

module.exports = { connectDB };
