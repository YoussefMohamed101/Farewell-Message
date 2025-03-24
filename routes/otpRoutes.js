const express = require('express');
const { storeOTP, verifyOTP } = require('../services/otpService');
const { sendSMS } = require('../services/smsService');
const { DEFAULT_DEVICE_ID } = require('../config/env');
const router = express.Router();

router.post('/send', async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ success: false, message: "يرجى إدخال رقم الهاتف" });
    }

    try {
        await sendSMS(phone);
        res.json({ success: true, message: "تم إرسال رمز التحقق بنجاح!" });
    } catch (error) {
        console.error("❌ خطأ أثناء إرسال الـ SMS:", error.message);
        res.status(500).json({ success: false, message: "حدث خطأ أثناء إرسال الرسالة" });
    }
});

router.post('/verify', async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: "يرجى إدخال رقم الهاتف ورمز التحقق" });
    }

    const result = await verifyOTP(phone, otp, DEFAULT_DEVICE_ID);
    res.json(result);
});

module.exports = router;