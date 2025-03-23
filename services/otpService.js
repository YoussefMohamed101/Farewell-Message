const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data.json');

const loadData = () => {
    if (!fs.existsSync(dataFilePath)) return {};
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
};

const saveData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

const generateOTP = () => {
    const words = ["APPLE", "TIGER", "BLUE", "GREEN", "LION", "BANANA"];
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    const number = Math.floor(10 + Math.random() * 90);
    return `${word1}-${number}-${word2}`;
};

const storeOTP = (phone, deviceId) => {
    const data = loadData();
    if (!data[phone]) return null;

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    data[phone] = {
        ...data[phone],
        otp,
        expires_at: expiresAt,
        device_id: deviceId
    };
    saveData(data);
    return otp;
};

const verifyOTP = (phone, inputOtp, deviceId) => {
    const data = loadData();
    if (!data[phone]) return { success: false, message: "رقم الهاتف غير مسجل" };

    const { otp, expires_at, device_id, message } = data[phone];

    if (new Date() > new Date(expires_at)) {
        delete data[phone].otp;
        delete data[phone].expires_at;
        saveData(data);
        return { success: false, message: "انتهت صلاحية رمز التحقق" };
    }

    if (otp !== inputOtp) {
        return { success: false, message: "رمز التحقق غير صحيح" };
    }

    if (device_id && device_id !== deviceId) {
        return { success: false, message: "رمز التحقق غير صالح لهذا الجهاز" };
    }

    delete data[phone].otp; // Clear OTP after use
    delete data[phone].expires_at;
    saveData(data);
    return { success: true, message }; // Always return the stored message
};

module.exports = { storeOTP, verifyOTP };