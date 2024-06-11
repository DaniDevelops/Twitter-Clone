import mongoose from "mongoose";

async function connectMongoDb() {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDb server: ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

export default connectMongoDb;
