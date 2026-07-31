import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI;

    if (!connStr) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error: any) {
    console.error("[MongoDB] Connection error:", error?.message || error);
    if (
      error?.code === "ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR" ||
      error?.message?.includes("tlsv1 alert internal error")
    ) {
      console.warn(
        "[MongoDB Atlas Hint] Your current IP address is likely blocked by MongoDB Atlas Network Access list. Please add your current IP or allow access from anywhere (0.0.0.0/0) in MongoDB Atlas -> Network Access."
      );
    }
  }
};


