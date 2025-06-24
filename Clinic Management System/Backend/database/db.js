import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `Connected to database host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(
      `Internal server error occured while connecting to database: ${error.message}`
    );
  }
};

export { connectDB };
