import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
