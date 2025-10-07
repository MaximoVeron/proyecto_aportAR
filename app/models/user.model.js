import { model, Schema, Types } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      biography: {
        type: String,
        required: false,
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "mod", "profesor"],
      default: "user",
    },
    career: {
      type: String,
      required: true,
      enum: [
        "software",
        "mecatronica",
        "telecomunicaciones",
        "quimica industrial",
      ],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

export const UserModel = model("User", UserSchema);
