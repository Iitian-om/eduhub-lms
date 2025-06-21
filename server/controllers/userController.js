export const getUserProfile = (req, res) => {
    res.status(200).json({
        success: true,
        message: "User profile data",
        data: {
            name: "Test User",
            email: "test@example.com"
        }
    });
}; 