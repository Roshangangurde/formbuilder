const mongoose = require("mongoose");

const InviteSchema = new mongoose.Schema({
    email: { type: String, required: false,unique: false }, // ✅ Ensure email is required
    formId: { type: String, required: true, unique: true },
    link: { type: String, required: true },
    permission: { type: String, enum: ["view", "edit"], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Invite", InviteSchema);
