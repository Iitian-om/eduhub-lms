// Migration script to update existing profile pictures from local paths to Cloudinary URLs
import { connectDB } from "./db.js";
import { User } from "../models/User.js";

const migrateProfilePictures = async () => {
    try {
        await connectDB();
        
        // Find all users with local profile picture paths
        const users = await User.find({
            profile_picture: { $regex: /^\/uploads\/profilePics\// }
        });
        
        console.log(`Found ${users.length} users with local profile picture paths`);
        
        // Update each user to remove the profile picture (they can re-upload)
        for (const user of users) {
            await User.findByIdAndUpdate(user._id, {
                profile_picture: ""
            });
            console.log(`Updated user: ${user.name} (${user.email})`);
        }
        
        console.log("Migration completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrateProfilePictures();