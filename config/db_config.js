    import mongoose from 'mongoose';
    import dotenv from 'dotenv';




    dotenv.config(); // Load environment variables

    const connectDB = async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URI, {

            });
            console.log(`MongoDB connected: ${conn.connection.host}`);
        } catch (error) {
            console.error('MongoDB connection error:', error.message);
            process.exit(1); // Exit process on failure
        }
    };

    export default connectDB;
