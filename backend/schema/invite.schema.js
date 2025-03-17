const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
    email: { type: String, required: true },
    workplaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workplace", required: true },
    invitedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invite", inviteSchema);
