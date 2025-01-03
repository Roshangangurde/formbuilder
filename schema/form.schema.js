const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
    form_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fields: [
        {
            field_id: {
                type: String,
            },
            label: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                enum: ["text", "radio", "checkbox", "select", "number", "date"],
                required: true,
            },
            required: {
                type: Boolean,
                default: false,
            },
            options: [
                {
                    value: {
                        type: String,
                        required: true,
                    },
                    label: {
                        type: String,
                        required: true,
                    },
                },
            ],
        },
    ],
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Form", formSchema);
