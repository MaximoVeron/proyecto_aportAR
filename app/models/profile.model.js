import { model, Schema, Types } from "mongoose";

const ProfileSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      unique: true,
    },
    last_name: {
      type: String,
      required: true,
      unique: true,
    },
    biography: {
      type: String,
      required: false,
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      sparse: true,
    },
  },
  {
    versionKey: false,
  }
);

export const ProfileModel = model("Profile", ProfileSchema);
