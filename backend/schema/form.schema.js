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
                required: true,
            },
            label: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                enum: [
                    "text", "radio", "checkbox", "select", "number", "date", 
                    "phone", "email", "rating", "image", "video", "gif", "button"
                ],
                required: true,
            },
            placeholder: {
                type: String,
            },
            required: {
                type: Boolean,
                default: false,
            },
            options: [
                {
                    value: {
                        type: String,
                        required: function () {
                            return this.type === "radio" || this.type === "select" || this.type === "checkbox";
                        },
                    },
                    label: {
                        type: String,
                        required: function () {
                            return this.type === "radio" || this.type === "select" || this.type === "checkbox";
                        },
                    },
                },
            ],
            min: {
                type: Number,
                required: function () {
                    return this.type === "number" || this.type === "rating";
                },
            },
            max: {
                type: Number,
                required: function () {
                    return this.type === "number" || this.type === "rating";
                },
            },
            fileType: {
                type: String,
                enum: ["image/png", "image/jpeg", "image/gif", "video/mp4", "video/mkv"],
                required: function () {
                    return this.type === "image" || this.type === "video" || this.type === "gif";
                },
            },
            button_action: {
                type: String,
                enum: ["submit", "reset"],
                required: function () {
                    return this.type === "button";
                },
            },
        },
    ],
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Form", formSchema);
