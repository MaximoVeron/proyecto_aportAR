import { model, Schema, Types } from "mongoose";

const ComentsSchema = new Schema({
  author: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  publicacion: {
    type: Types.ObjectId,
    ref: "Publications",
    required: true,
  },
});

export const ComentsModel = model("Coments", ComentsSchema);
