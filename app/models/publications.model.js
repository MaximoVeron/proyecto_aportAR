import { model, Schema, Types } from "mongoose";

const PublicationSchema = new Schema(
  {
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
      trim: true,
    },
    content: {
      type: String,
      required: false,
      maxlength: 500,
      trim: true,
    },
    publication_image: {
      type: String,
      required: false,
    },
    publication_type: {
      type: String,
      enum: ["proyecto", "sugerencia", "problematica"],
      default: "sugerencia",
      required: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "resolved"],
      required: false,
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

export const PublicationModel = model("Publication", PublicationSchema);
