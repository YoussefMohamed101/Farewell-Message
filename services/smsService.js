const axios = require('axios');
const { storeOTP } = require('./otpService');
const { GATEWAY_URL, GATEWAY_USERNAME, GATEWAY_PASSWORD } = require('../config/env');

const sendSMS = async (toNumber) => {
    const otp = await storeOTP(toNumber, "DeviceXYZ");

    const messageText = `${otp}`;
    console.log(`🔹 جاري إرسال OTP: ${otp} إلى ${toNumber}`);

    try {
        const auth = Buffer.from(`${GATEWAY_USERNAME}:${GATEWAY_PASSWORD}`).toString('base64');
        const response = await axios.post(
            `${GATEWAY_URL}/3rdparty/v1/message`,
            {
                message: messageText,
                phoneNumbers: ['+2'+toNumber]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${auth}`
                }
            }
        );
        console.log("✅ تم إرسال الرسالة بنجاح:", response.data);
    } catch (error) {
        console.error("❌ خطأ في إرسال الرسالة:", error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = { sendSMS };