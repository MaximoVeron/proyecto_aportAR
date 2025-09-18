import { model, Schema, Types } from "mongoose";

const CommentsSchema = new Schema(
  {
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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const CommentsModel = model("Comments", CommentsSchema);
