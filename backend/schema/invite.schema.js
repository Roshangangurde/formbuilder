const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    invitedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invite", inviteSchema);
