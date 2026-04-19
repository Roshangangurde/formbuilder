import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
    form_name: { type: String, required: true },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    folder: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Folder", 
      default: null 
  },
    sharedWith: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            role: { type: String, enum: ['View', 'Edit'], default: 'View' }
        }
    ],
    darkMode: { type: Boolean, default: false },
    theme: { type: String, enum: ['classic', 'warm', 'minimal'], default: 'classic' },
    fields: [
        {
            id: { type: String, required: true },
            type: { type: String, required: true },
            category: { type: String, enum: ["bubble", "input"], required: true },
            label: { type: String, required: true },
            value: { type: String, default: "" },
            url: { type: String, default: "" },
            placeholder: { type: String, default: "" },
            required: { type: Boolean, default: false },
            options: [{ type: String }],
        }
    ],
    views: { type: Number, default: 0 },
    starts: { type: Number, default: 0 },
    submissions: [{
        status: {
          type: String,
          enum: ['viewed', 'started', 'completed'],
          default: 'completed'
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        responses: {
          type: Object, 
          required: true
        }
      }]
    }
);
FormSchema.index({ owner: 1 });
FormSchema.index({ createdAt: -1 });

const Form = mongoose.model("Form", FormSchema);
export default Form;
