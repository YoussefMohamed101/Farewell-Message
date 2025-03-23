const express = require('express');
const path = require('path');
const otpRouter = require('./routes/otpRoutes');
const { PORT } = require('./config/env');
const fs = require("fs");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public/

// Routes
app.use('/otp', otpRouter);

// File path for notes storage
const notesFile = path.join(__dirname, "notes.json");

// Load existing notes or initialize empty array
let notes = [];
if (fs.existsSync(notesFile)) {
    try {
        const data = fs.readFileSync(notesFile, "utf8");
        notes = JSON.parse(data);
    } catch (err) {
        console.error("Error loading notes.json:", err);
        notes = [];
    }
} else {
    fs.writeFileSync(notesFile, JSON.stringify(notes));
}

// Endpoint to add a note with persistence
app.post("/notes", (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Note required!" });

    const newNote = { message, timestamp: Date.now() };
    notes.push(newNote);

    // Save to notes.json
    try {
        fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
        console.log("Notes updated:", notes);
        res.json({ success: true, message: "Note added anonymously!" });
    } catch (err) {
        console.error("Error saving notes:", err);
        res.status(500).json({ success: false, message: "Error saving note!" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});