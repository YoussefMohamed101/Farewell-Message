require('dotenv').config();

module.exports = {
    GATEWAY_URL: process.env.GATEWAY_URL,
    GATEWAY_USERNAME: process.env.GATEWAY_USERNAME,
    GATEWAY_PASSWORD: process.env.GATEWAY_PASSWORD,
    PORT: process.env.PORT || 3000,
    DEFAULT_DEVICE_ID: process.env.DEFAULT_DEVICE_ID || "DeviceXYZ",
    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT
};