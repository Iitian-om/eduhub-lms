import mongoose from 'mongoose';

const searchQuerySchema = new mongoose.Schema({
    query: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow anonymous searches
    },
    filters: {
        maxPrice: Number,
        platforms: [String],
        level: String,
        maxDuration: Number,
        language: String
    },
    results: {
        totalFound: {
            type: Number,
            default: 0
        },
        platforms: [{
            platform: String,
            count: Number
        }]
    },
    userAgent: {
        type: String
    },
    ipAddress: {
        type: String
    },
    searchTime: {
        type: Number, // Time taken for search in milliseconds
        default: 0
    },
    clickedCourses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ExternalCourse'
        },
        clickedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isSuccessful: {
        type: Boolean,
        default: true
    },
    errorMessage: {
        type: String
    }
}, {
    timestamps: true
});

// Index for analytics
searchQuerySchema.index({ query: 'text' });
searchQuerySchema.index({ userId: 1, createdAt: -1 });
searchQuerySchema.index({ createdAt: -1 });
searchQuerySchema.index({ 'results.totalFound': -1 });

// Static method to get popular searches
searchQuerySchema.statics.getPopularSearches = function(limit = 10) {
    return this.aggregate([
        {
            $group: {
                _id: '$query',
                count: { $sum: 1 },
                avgResults: { $avg: '$results.totalFound' }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: limit
        }
    ]);
};

// Static method to get search analytics by user
searchQuerySchema.statics.getUserSearchHistory = function(userId, limit = 20) {
    return this.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('clickedCourses.courseId', 'title platform');
};

// Static method to get search trends
searchQuerySchema.statics.getSearchTrends = function(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    query: '$query'
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.date': -1, count: -1 }
        }
    ]);
};

// Static method to get platform usage statistics
searchQuerySchema.statics.getPlatformStats = function(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $unwind: '$results.platforms'
        },
        {
            $group: {
                _id: '$results.platforms.platform',
                totalSearches: { $sum: 1 },
                totalCourses: { $sum: '$results.platforms.count' },
                avgCoursesPerSearch: { $avg: '$results.platforms.count' }
            }
        },
        {
            $sort: { totalSearches: -1 }
        }
    ]);
};

const SearchQuery = mongoose.model('SearchQuery', searchQuerySchema);

export default SearchQuery; 