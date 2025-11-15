import mongoose from "mongoose";

const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    console.error(`MONGODB_URI is not defined in environment variables.`);
    process.exit(1);
  }
  try {
    const connectionInstance = await mongoose.connect(dbUri);
    console.log(
      `Database Connected! \nHost: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
