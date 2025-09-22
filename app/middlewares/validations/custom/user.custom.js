import { UserModel } from "../../../models/user.model.js";

export const emailExist = async (email) => {
  const user = await UserModel.findOne({
    email: email.trim().toLowerCase(),
  });
  if (user) {
    throw new Error("Email already in use");
  }
  return true;
};

export const updateEmailExist = async (email, { req }) => {
  const user = await UserModel.findOne({
    email: email.trim().toLowerCase(),
  });
  if (user && user.id !== req.params.id) {
    throw new Error("Email already in use");
  }
  return true;
};

export const userExist = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return true;
};
