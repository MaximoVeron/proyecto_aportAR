import { model, Schema } from "mongoose";

const StrikeSchema = new Schema({
  report_user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  publication_user: {
    type: Types.ObjectId,
    ref: "Publications",
    required: true,
    unique: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

export const StrikeModel = model("Strikes", StrikeSchema);
