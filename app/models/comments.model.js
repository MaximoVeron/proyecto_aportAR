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
      required: true,
    },
    publicacion: {
      type: Types.ObjectId,
      ref: "Publication",
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const CommentsModel = model("Comments", CommentsSchema);
