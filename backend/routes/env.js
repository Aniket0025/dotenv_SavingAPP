const {Router} = require("express");
const {EnvVarModel} = require("../db");
const {userMiddleware} = require("../middleware/user");
const { encrypt, decrypt, tryDecryptMaybePlain } = require("../utils/cryptoUtil"); // 👈 import

const envRouter = Router();
envRouter.use(userMiddleware);

// ✅ GET - decrypt before sending
envRouter.get("/", async function(req, res) {
    try {
        const userId = req.user.id;
        const items = await EnvVarModel.find({ userId }).select("key value createdAt updatedAt");

        const decryptedItems = items.map(item => ({
            key: item.key,
            value: tryDecryptMaybePlain(item.value),  // 👈 decrypt with fallback
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }));

        return res.json({ message: "Items fetched successfully", items: decryptedItems });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ DELETE - remove a key
envRouter.delete("/:key", async (req, res) => {
    try {
        const userId = req.user.id;
        const { key } = req.params;

        const result = await EnvVarModel.findOneAndDelete({ userId, key });
        if (!result) return res.status(404).json({ message: "Key not found" });

        return res.json({ message: "Deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = { envRouter };
// ✅ POST - encrypt before saving
envRouter.post("/", async function(req, res) {
    try {
        const userId = req.user.id;
        const {key, value} = req.body;
        if (!key || !value) {
            return res.status(400).json({ message: "Key and value are required" });
        }

        const encryptedValue = encrypt(value);

        const doc = await EnvVarModel.findOneAndUpdate(
            { userId, key },
            { $set: { value: encryptedValue } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({ message: "Saved", env: { key: doc.key, value } });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ PUT - encrypt before update
envRouter.put("/:key", async (req, res) => {
    try {
        const userId = req.user.id;
        const { key } = req.params;
        const { value } = req.body;

        if (!value) return res.status(400).json({ message: "value is required" });

        const encryptedValue = encrypt(value);

        const doc = await EnvVarModel.findOneAndUpdate(
            { userId, key },
            { $set: { value: encryptedValue } },
            { new: true }
        );

        if (!doc) return res.status(404).json({ message: "Key not found" });

        return res.json({ message: "Updated", env: { key: doc.key, value } });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
