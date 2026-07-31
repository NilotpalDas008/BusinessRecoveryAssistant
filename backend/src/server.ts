import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import businessOwnerRoutes from "./routes/businessOwner.routes";
import dashboardRoutes from "./routes/dashboard.routes";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// API Routes
app.use("/api/business-owner", businessOwnerRoutes);
app.use("/dashboard", dashboardRoutes);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start Server with error handling for EADDRINUSE
const startServer = (port: number) => {
  const server = app.listen(port, () => {
    console.log(`[Express] Server is running on http://localhost:${port}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[Express] Port ${port} is already in use.`);
      const nextPort = port + 1;
      console.log(`[Express] Attempting to start on port ${nextPort} instead...`);
      setTimeout(() => startServer(nextPort), 500);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
};

// Start with desired port
startServer(PORT);
