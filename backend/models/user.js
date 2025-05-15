import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false, // Exclude password in queries by default
        },
    },
    { timestamps: true } 
);

userSchema.pre("save", async function (next) {
    console.log(" pre-save hook running...");
    if (!this.isModified("password")){
        console.log(" Password not modified. Skipping hashing."); 
        return next(); 
    }
    
    console.log(" Password modified. Hashing...");
    this.password = await bcrypt.hash(this.password, 10);
    next();
});



userSchema.methods.comparePassword = async function (enteredPassword) {
    console.log(" Entered Password:", enteredPassword);
    console.log(" Stored Hashed Password:", this.password);

    const match = await bcrypt.compare(enteredPassword, this.password);
    console.log(" bcrypt.compare result:", match);
    
    console.log(" Entered Password:", enteredPassword);
    console.log(" Stored Hashed Password:", this.password);
    console.log(" bcrypt.compare result:", match);

    return match;
};




userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const User = mongoose.model("User", userSchema);
export default User;
