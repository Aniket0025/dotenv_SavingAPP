const {Router} = require("express");
const {EnvVarModel} = require("../db");
const {userMiddleware} = require("../middleware/user");

const envRouter = Router();

envRouter.use(userMiddleware);

envRouter.get("/",async function(req, res) {
    try{
        const userId = req.user.id;
        const items = await EnvVarModel.find({
            userId:userId
        }).select("key value createdAt updatedAt");
        return res.json({
            message:"Items fetched successfully",
            items:items
        })
    } catch(err) {
        return res.status(500).json({message:"Internal server error"})
    }

});

envRouter.post("/",async function(req, res) {
    try{
        const userId = req.user.id;
        const {key, value} = req.body;
        if(!key || !value) {
            return res.status(400).json({message:"Key and value are required"})
        }
        const doc = await EnvVarModel.findOneAndUpdate(
            {userId, key},
            {$set:{value}},
            {upsert:true, new:true, setDefaultsOnInsert:true}
        )
        return res.status(200).json({ message: "Saved", env: { key: doc.key, value: doc.value } });
    }
    catch(error){
        if(error.code === 11000) {
            return res.status(409).json({ message: "Duplicate key" });
        }
        return res.status(500).json({message:"Internal server error"})
    }
});

envRouter.put("/:key", async (req, res) => {
    try {
        const userId = req.user.id;
        const { key } = req.params;
        const { value } = req.body;
        if (!value) {
            return res.status(400).json({ message: "value is required" });
        }

        const doc = await EnvVarModel.findOneAndUpdate(
            { userId, key },
            { $set: { value } },
            { new: true }
        );

        if (!doc) {
            return res.status(404).json({ message: "Key not found" });
        }

        return res.json({ message: "Updated", env: { key: doc.key, value: doc.value } });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

envRouter.delete("/:key", async (req, res) => {
    try {
        const userId = req.user.id;
        const { key } = req.params;

        const result = await EnvVarModel.findOneAndDelete({ userId, key });
        if (!result) {
            return res.status(404).json({ message: "Key not found" });
        }

        return res.json({ message: "Deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = { envRouter };
