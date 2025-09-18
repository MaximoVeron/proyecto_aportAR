import { model, Schema, Types } from "mongoose";

const PublicationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["in_progress", "resolved"],
    default: "in_progress",
  },
});

export const ProblematicModel = model("Problematic", ProblematicSchema);
