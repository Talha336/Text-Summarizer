const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Ensure JSON parsing middleware is enabled

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Summarization API! Use the /summarize endpoint.");
});

// Summarization Route
app.post("/summarize", async (req, res) => {
    console.log("Request Body:", req.body); // Log incoming body for debugging

    const { text } = req.body; // Extract 'text' field from request body

    if (!text) {
        return res.status(400).json({ error: "Text input is required." });
    }

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );

        const summary = response.data[0]?.summary_text || "No summary generated.";
        res.json({ summary });
    } catch (error) {
        console.error("Error from Hugging Face API:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch summary. Please try again later." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
