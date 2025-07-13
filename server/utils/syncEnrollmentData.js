import { connectDB } from "./db.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import dotenv from "dotenv";

dotenv.config();

const syncEnrollmentData = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Get all users with enrollments
    const users = await User.find({ Courses_Enrolled_In: { $exists: true, $ne: [] } });
    
    if (users.length === 0) {
      console.log("No users with enrollments found!");
      process.exit(0);
    }

    console.log(`Found ${users.length} users with enrollments. Syncing data...`);

    let totalEnrollments = 0;
    let syncedEnrollments = 0;

    for (const user of users) {
      console.log(`\nProcessing user: ${user.name} (${user.email})`);
      console.log(`Enrolled in ${user.Courses_Enrolled_In.length} courses`);

      for (const courseId of user.Courses_Enrolled_In) {
        totalEnrollments++;
        
        try {
          const course = await Course.findById(courseId);
          if (!course) {
            console.log(`⚠️  Course ${courseId} not found, skipping...`);
            continue;
          }

          // Check if user is already in course's enrolledStudents
          if (!course.enrolledStudents.includes(user._id)) {
            course.enrolledStudents.push(user._id);
            await course.save();
            syncedEnrollments++;
            console.log(`✅ Added user to course: ${course.title}`);
          } else {
            console.log(`ℹ️  User already in course: ${course.title}`);
          }
        } catch (error) {
          console.log(`❌ Error processing course ${courseId}:`, error.message);
        }
      }
    }

    console.log(`\n🎉 Sync completed!`);
    console.log(`Total enrollments processed: ${totalEnrollments}`);
    console.log(`New enrollments synced: ${syncedEnrollments}`);

    // Also check for orphaned enrollments in Course model
    console.log(`\nChecking for orphaned enrollments in Course model...`);
    const courses = await Course.find({ enrolledStudents: { $exists: true, $ne: [] } });
    
    let orphanedEnrollments = 0;
    for (const course of courses) {
      for (const userId of course.enrolledStudents) {
        const user = await User.findById(userId);
        if (!user || !user.Courses_Enrolled_In.includes(course._id)) {
          // Remove orphaned enrollment
          course.enrolledStudents = course.enrolledStudents.filter(id => id.toString() !== userId.toString());
          await course.save();
          orphanedEnrollments++;
          console.log(`🧹 Removed orphaned enrollment: User ${userId} from course ${course.title}`);
        }
      }
    }

    console.log(`Orphaned enrollments cleaned: ${orphanedEnrollments}`);
    process.exit(0);
  } catch (error) {
    console.error("Error syncing enrollment data:", error);
    process.exit(1);
  }
};

// Run the sync
syncEnrollmentData(); 