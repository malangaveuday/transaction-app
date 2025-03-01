import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

UserSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id; // Copy _id to id
        delete ret._id;   // Remove _id
        return ret;
    }
});

UserSchema.index({ firstname: "text", lastname: "text" });

export const User = mongoose.model("User", UserSchema);