const mongoose = require("mongoose");
const Invite = require("./schema/invite.schema"); // Adjust path as needed

mongoose.connect("mongodb://localhost:27017/myDatabase", { useNewUrlParser: true, useUnifiedTopology: true });

async function checkInvite(email) {
    const invite = await Invite.findOne({ email });
    if (invite) {
        console.log("Invite found:", invite);
    } else {
        console.log("No invite found for this email.");
    }
    mongoose.connection.close();
}

checkInvite("kk@gmail.com");
