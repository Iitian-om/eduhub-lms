import mongoose from "mongoose";

const coursesThumbSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true,
    unique: true, // One thumbnail per course
  },
  image: {
    type: Buffer,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

export const CoursesThumb = mongoose.model("courses_thumb", coursesThumbSchema); 