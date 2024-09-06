const crypto = require('crypto-js');

const secretKey = Buffer.from("RklUQU9JU3k=", 'base64').toString();
const secretIv = Buffer.from("NTM2NzM4NjI=", 'base64').toString();

function encryptData(data) {
    const keyHex = crypto.enc.Utf8.parse(secretKey);
    const ivHex = crypto.enc.Utf8.parse(secretIv);
    const encrypted = crypto.DES.encrypt(crypto.enc.Utf8.parse(data), keyHex, {
        iv: ivHex,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(crypto.enc.Hex).toUpperCase();
}

module.exports = (req, res) => {
    if (req.method === 'POST') {
        const { machineCode } = req.body;
        if (!machineCode) {
            return res.status(400).json({ error: 'Machine code is required' });
        }
        const licenseKey = encryptData(machineCode);
        res.status(200).json({ licenseKey });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
