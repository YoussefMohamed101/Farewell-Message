const apiUrl = "/otp";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateBinaryHex() {
    const chars = "01 0x1A 0xFF 0x90 0xCC 0xEE 0x7F 0xAB 0x12".split(" ");
    const bg = document.getElementById("binary-bg");
    const width = Math.ceil(window.innerWidth / 20);
    const height = Math.ceil(window.innerHeight / 20);
    let text = "";
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            text += chars[Math.floor(Math.random() * chars.length)] + " ";
        }
        text += "\n";
    }
    
    bg.innerText = text;
}

function updateBinaryHex() {
    generateBinaryHex();
    setTimeout(updateBinaryHex, 200);
}

// Placeholder sticker + text pairs (replace with yours)
const stickers = [
    { image: "stickers/sticker1.png", text: "" },
    { image: "stickers/sticker2.png", text: "" },
    { image: "stickers/sticker3.png", text: "7byby tslm" },
    { image: "stickers/sticker4.png", text: "" },
    { image: "stickers/sticker5.png", text: "tslm ya kbeer" },
    { image: "stickers/sticker6.png", text: "" },
    { image: "stickers/sticker7.png", text: "" },
    { image: "stickers/sticker8.png", text: "5od 4wayet faka" },
    { image: "stickers/sticker9.png", text: "" }
];

async function sendOTP() {
    const phone = document.getElementById("phone").value;
    const status = document.getElementById("status");
    const spinner = document.getElementById("spinner");

    if (!phone) {
        status.innerText = "Please enter a phone number!";
        return;
    }

    status.innerText = "Sending OTP...";
    spinner.classList.remove("hidden");
    try {
        const response = await fetch(`${apiUrl}/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone })
        });

        await delay(1000);
        const result = await response.json();
        spinner.classList.add("hidden");
        status.innerText = result.message;
        if (result.success) {
            localStorage.setItem("phone", phone);
            window.location.href = "verify.html";
        }
    } catch (error) {
        spinner.classList.add("hidden");
        status.innerText = "Error sending OTP!";
    }
}

async function verifyOTP() {
    const otp = document.getElementById("otp").value;
    const phone = localStorage.getItem("phone");
    const status = document.getElementById("status");
    const spinner = document.getElementById("spinner");

    if (!otp || !phone) {
        status.innerText = "Please enter OTP and phone number!";
        return;
    }

    status.innerText = "Verifying...";
    spinner.classList.remove("hidden");
    try {
        const response = await fetch(`${apiUrl}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, otp })
        });

        await delay(1000);
        const result = await response.json();
        spinner.classList.add("hidden");
        status.innerText = result.success ? "✅ Verified successfully!" : "❌ Verification failed!";
        if (result.success) {
            localStorage.setItem("message", result.message);
            window.location.href = "message.html";
        }
    } catch (error) {
        spinner.classList.add("hidden");
        status.innerText = "Error verifying OTP!";
    }
}

async function resendOTP() {
    const phone = localStorage.getItem("phone");
    const status = document.getElementById("status");
    const spinner = document.getElementById("spinner");

    if (!phone) {
        status.innerText = "Please go back and enter a phone number!";
        return;
    }

    status.innerText = "Resending OTP...";
    spinner.classList.remove("hidden");
    try {
        const response = await fetch(`${apiUrl}/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone })
        });

        await delay(1000);
        const result = await response.json();
        spinner.classList.add("hidden");
        status.innerText = result.message;
        if (!result.success) {
            console.error("Resend failed:", result.message);
        }
    } catch (error) {
        spinner.classList.add("hidden");
        status.innerText = "Error resending OTP!";
    }
}

function displayMessage() {
    const message = localStorage.getItem("message");
    const messageEl = document.getElementById("message");
    if (message) {
        messageEl.innerText = message;
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.6 },
            colors: ["#1e90ff", "#00cc99"]
        });
    } else {
        messageEl.innerText = "No message available!";
    }
}

function restart() {
    localStorage.clear();
    window.location.href = "index.html";
}

async function submitNote() {
    const note = document.getElementById("note").value;
    const status = document.getElementById("status");
    const spinner = document.getElementById("spinner");

    if (!note) {
        status.innerText = "Please enter a note!";
        return;
    }

    status.innerText = "Submitting note...";
    spinner.classList.remove("hidden");
    try {
        const response = await fetch(`/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: note })
        });

        await delay(1000);
        const result = await response.json();
        spinner.classList.add("hidden");
        if (result.success) {
            window.location.href = "thankyou.html";
        } else {
            status.innerText = result.message;
        }
    } catch (error) {
        spinner.classList.add("hidden");
        status.innerText = "Error submitting note!";
    }
}

function displayThankYouSticker() {
    const sticker = stickers[Math.round(Math.random() * stickers.length)];
    document.getElementById("sticker-image").src = sticker.image;
    document.getElementById("sticker-text").innerText = sticker.text;
}

function toggleTheme() {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    document.getElementById("theme-switch").checked = isLight;
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        document.querySelectorAll("#theme-switch").forEach(el => el.checked = true);
    }
    if (window.location.pathname.includes("message.html")) displayMessage();
    if (window.location.pathname.includes("thankyou.html")) displayThankYouSticker();
    generateBinaryHex();
    updateBinaryHex();
});