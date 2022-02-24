import mongoose from "mongoose";
var Schema = mongoose.Schema;

const chipSchema = new Schema({
  key: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  username: {
    type: String,
    required: false,
    max: 255,
    min: 6,
  },
  email: {
    type: String,
    required: false,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: false,
    max: 255,
    min: 6,
  },
  lastConnection: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.chips || mongoose.model("chips", chipSchema);
