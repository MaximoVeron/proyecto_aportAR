import { model, Schema, Types } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin","mod","profesor"],
      default: "user",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
);

export const UserModel = model("User", UserSchema);
