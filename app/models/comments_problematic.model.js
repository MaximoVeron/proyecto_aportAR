import { model, Schema, Types } from "mongoose";

const CommentsProblematicSchema = new Schema({
  author: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  problematic: {
    type: Types.ObjectId,
    ref: "Problematic",
    required: true,
  },
});

export const CommentProblematicModel = model(
  "ProblematicComment",
  CommentsProblematicSchema
);
