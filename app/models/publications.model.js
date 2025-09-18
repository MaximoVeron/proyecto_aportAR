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
    },
    content: {
      type: String,
      required: false,
    },
    publication_image: {
      type: String,
      required: false,
    },
    publication_type: {
      type: String,
      enum: ["proyecto", "sugerencia", "problematica"],
      required: true,
    },
    status: {
      enum: ["in_progress", "resolved"],
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const PublicationModel = model("Publication", PublicationSchema);
