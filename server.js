const express = require("express");
const admin = require("firebase-admin");
const path = require("path");
const otpRouter = require("./routes/otpRoutes");

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); // Set in Render
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Mount OTP routes
app.use("/otp", otpRouter);

// Firestore collection for notes
const notesCollection = admin.firestore().collection("notes");

// Endpoint to add a note with Firebase persistence
app.post("/otp/notes/add", async (req, res) => { // Adjusted to match client-side fetch
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