import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";

import connectDB from "./db/db.js";

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`The server is listening at http://localhost:${port}`);
    });
    server.on("error", (err) => {
      console.error(`Server error: ${err.message}`);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error(
      `The MongoDB database connection failed. The error is : ${error.message}`
    );
    process.exit(1);
  });
