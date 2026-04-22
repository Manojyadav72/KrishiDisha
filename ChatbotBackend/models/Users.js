import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "Farmer" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  farmerId: {
    type: String,
    default: () => "FD" + Math.floor(10000 + Math.random() * 90000)
  },
  photo: { type: String, default: "" }
});

export default mongoose.model("User", userSchema);