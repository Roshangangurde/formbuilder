const mongoose = require("mongoose");

const TypebotSchema = new mongoose.Schema({
    form_name: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Typebot", TypebotSchema);
