import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Page not found",
    });
});

export default router;