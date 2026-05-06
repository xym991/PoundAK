import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes/index.js";
import TestRunner from "./testRunner.js";

const app = express();
const port = process.env.PORT || 8080;
const testRunner = new TestRunner();
app.use(express.static("public"));

// Middleware
app.use(bodyParser.json());

// CORS configuration to allow all requests, including Overwolf apps
app.use(
  cors({
    origin: true, // Allows any origin, including Overwolf apps
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "*",
    credentials: true,
  })
);

// Manually add headers in case some browsers require it
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// MongoDB connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
testRunner
  .runAll()
  .then(() => {
    console.log("All tests completed");
  })
  .catch((err) => {
    console.error("Error running tests:", err);
  });

// Use routes
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
