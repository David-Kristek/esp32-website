import mongoose from "mongoose";
var Schema = mongoose.Schema;

const measurementSchema = new Schema(
  {
    chipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chips",
    },
    data: [{
        time: {
            hour: Number, 
            minute: Number,
            second: Number
        }, 
        temperature: Number, 
        senzors: {
            humidity: Number, 
            brightness: Number
        }, 
        heatingOn: Boolean,
    }]
  },
  { timestamps: true }
);

export default mongoose.models.chips ||
  mongoose.model("measurement", measurementSchema);
