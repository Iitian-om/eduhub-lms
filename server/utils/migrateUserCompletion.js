import { connectDB } from "./db.js";
import { User } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const migrateUserCompletion = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Find all users that don't have the new completion fields
    const users = await User.find({
      $or: [
        { Courses_Completed: { $exists: false } },
        { CourseProgress: { $exists: false } }
      ]
    });

    if (users.length === 0) {
      console.log("All users already have completion tracking fields!");
      process.exit(0);
    }

    console.log(`Found ${users.length} users to migrate. Adding completion tracking fields...`);

    for (const user of users) {
      // Add missing fields with default values
      if (!user.Courses_Completed) {
        user.Courses_Completed = [];
      }
      
      if (!user.CourseProgress) {
        user.CourseProgress = new Map();
      }

      await user.save();
      console.log(`✅ Migrated user: ${user.name} (${user.email})`);
    }

    console.log("🎉 Successfully migrated all users!");
    process.exit(0);
  } catch (error) {
    console.error("Error migrating users:", error);
    process.exit(1);
  }
};

// Run the migration
migrateUserCompletion(); 