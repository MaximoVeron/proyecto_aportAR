import { model, Schema, Types } from "mongoose";

const StrikeSchema = new Schema(
  {
    report_user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    publication_user: {
      type: Types.ObjectId,
      ref: "Publication",
      required: true,
      unique: true,
    },
    reason: {
      type: String,
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

export const StrikeModel = model("Strikes", StrikeSchema);
