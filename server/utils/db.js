// This file is used to connect to the MongoDB database.
import mongoose from "mongoose"; //(ODM: Object Data Model) library to interact with MongoDB

export const connectDB = async () => {
    try {
        // Connect to the MongoDB database
        const { connection } = await mongoose.connect(process.env.MONGO_URI, //Destructuring lets you do it in a single, concise step. You are essentially telling JavaScript: "I know the object returned by mongoose.connect has a property named connection. Please create a new constant called connection and assign the value of that property to it."
            {
                dbName: "EduHub_LMS", 
            }
        );
        console.log(`MongoDB Connected with host of the connected MongoDB instance: ${connection.host}`);

        
    } catch (error) {
        // If the connection is successful, the code will continue to the next line. If not, the code will exit with a status code of 1.
        console.log("MongoDB connection error:", error);
        process.exit(1);
    }
}; 