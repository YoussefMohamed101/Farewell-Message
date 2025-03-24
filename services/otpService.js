const admin = require("firebase-admin");
const firestore = admin.firestore();
const otpCollection = firestore.collection("otp_users");

const generateOTP = () => {
    const words = ["APPLE", "TIGER", "BLUE", "GREEN", "LION", "BANANA"];
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    const number = Math.floor(10 + Math.random() * 90);
    return `${word1}-${number}-${word2}`;
};

const storeOTP = async (phone, deviceId) => {
    const docRef = otpCollection.doc(phone);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const data = {
        ...doc.data(),
        otp,
        expires_at: expiresAt,
        device_id: deviceId
    };

    await docRef.set(data);
    return otp;
};

const verifyOTP = async (phone, inputOtp, deviceId) => {
    const docRef = otpCollection.doc(phone);
    const doc = await docRef.get();

    if (!doc.exists) return { success: false, message: "رقم الهاتف غير مسجل" };

    const { otp, expires_at, device_id, message } = doc.data();

    if (new Date() > new Date(expires_at)) {
        await docRef.update({ otp: admin.firestore.FieldValue.delete(), expires_at: admin.firestore.FieldValue.delete() });
        return { success: false, message: "انتهت صلاحية رمز التحقق" };
    }

    if (otp !== inputOtp) {
        return { success: false, message: "رمز التحقق غير صحيح" };
    }

    if (device_id && device_id !== deviceId) {
        return { success: false, message: "رمز التحقق غير صالح لهذا الجهاز" };
    }

    await docRef.update({ otp: admin.firestore.FieldValue.delete(), expires_at: admin.firestore.FieldValue.delete() });
    return { success: true, message };
};

module.exports = { storeOTP, verifyOTP };