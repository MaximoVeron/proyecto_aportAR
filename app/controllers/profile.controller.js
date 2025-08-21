import { ProfileModel } from "../models/profile.model.js";
import UserModel from "../models/user.models.js";

export const createProfile = async (req, res) => {
  try {
    const { user_id, bio, avatar_url } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "El usuario es obligatorio" });
    }

    const profile = await ProfileModel.create({ user_id, bio, avatar_url });
    return res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear el perfil" });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await ProfileModel.findAll({
      include: {
        model: UserModel,
        as: "user",
        attributes: ["id", "username", "email"],
      },
    });
    return res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los perfiles" });
  }
};
