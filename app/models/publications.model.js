import { model, Schema, Types } from "mongoose";

const PublicationSchema = new Schema(
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
    publication_image: {
      type: String,
      required:false
    },
    publication_type:{
      type: String,
      enum: ["proyecto", "sugerencia"],
    }
  },
);

export const PublicationModel = model("Publication", PublicationSchema);
