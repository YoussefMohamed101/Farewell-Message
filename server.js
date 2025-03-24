const express = require("express");
const admin = require("firebase-admin");
const {FIREBASE_SERVICE_ACCOUNT} = require('./config/env');

// Initialize Firebase Admin SDK first
let serviceAccount;
try {
    serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
    console.log("Firebase service account loaded successfully");
} catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", error.message);
    throw new Error("Invalid Firebase service account JSON");
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
console.log("Firebase Admin SDK initialized");

const path = require("path");
const otpRouter = require("./routes/otpRoutes");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Mount OTP routes
app.use("/otp", otpRouter);

// Firestore collection for notes
const notesCollection = admin.firestore().collection("notes");

// Endpoint to add a note with Firebase persistence
app.post("/notes", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Note required!" });

    const newNote = { message, timestamp: Date.now() };

    try {
        await notesCollection.add(newNote);
        console.log("Note added:", newNote);
        res.json({ success: true, message: "Note added anonymously!" });
    } catch (err) {
        console.error("Error saving note:", err);
        res.status(500).json({ success: false, message: "Error saving note!" });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});