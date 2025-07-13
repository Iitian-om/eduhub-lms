import mongoose from 'mongoose';

const externalCourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    instructor: {
        type: String,
        trim: true
    },
    institution: {
        type: String,
        trim: true
    },
    platform: {
        type: String,
        required: true,
        enum: ['edX', 'GeeksforGeeks', 'SWAYAM', 'Coursera', 'Udemy']
    },
    source: {
        type: String,
        required: true
    },
    price: {
        type: String,
        default: 'Free'
    },
    rating: {
        type: String,
        default: 'N/A'
    },
    duration: {
        type: String,
        default: 'N/A'
    },
    level: {
        type: String,
        default: 'Beginner'
    },
    language: {
        type: String,
        default: 'English'
    },
    image: {
        type: String
    },
    link: {
        type: String,
        required: true
    },
    category: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    enrollment: {
        type: String,
        default: 'N/A'
    },
    startDate: {
        type: String,
        default: 'N/A'
    },
    searchQuery: {
        type: String,
        trim: true
    },
    scrapedAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    viewCount: {
        type: Number,
        default: 0
    },
    favoriteCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient searching
externalCourseSchema.index({ title: 'text', description: 'text', tags: 'text' });
externalCourseSchema.index({ platform: 1, category: 1 });
externalCourseSchema.index({ scrapedAt: -1 });

// Method to update view count
externalCourseSchema.methods.incrementViewCount = function() {
    this.viewCount += 1;
    return this.save();
};

// Method to update favorite count
externalCourseSchema.methods.incrementFavoriteCount = function() {
    this.favoriteCount += 1;
    return this.save();
};

// Static method to find courses by search query
externalCourseSchema.statics.findBySearchQuery = function(query, limit = 10) {
    return this.find({
        $text: { $search: query },
        isActive: true
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);
};

// Static method to find popular courses
externalCourseSchema.statics.findPopular = function(limit = 10) {
    return this.find({ isActive: true })
        .sort({ viewCount: -1, favoriteCount: -1 })
        .limit(limit);
};

// Static method to find courses by platform
externalCourseSchema.statics.findByPlatform = function(platform, limit = 10) {
    return this.find({ platform, isActive: true })
        .sort({ scrapedAt: -1 })
        .limit(limit);
};

const ExternalCourse = mongoose.model('ExternalCourse', externalCourseSchema);

export default ExternalCourse; 