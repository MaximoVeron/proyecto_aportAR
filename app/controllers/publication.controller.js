import { PublicationModel } from "../models/publications.model.js";

export const createProfile = async (req, res) => {
  try {
    const newProfile = new ProfileModel(req.body);
    await newProfile.save();
    return res.status(201).json(newProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear el perfil" });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const profiles = await ProfileModel.find();
    return res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener los perfiles" });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({
      _id: req.params.id,
      is_deleted: false,
    });
    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el perfil" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar el perfil" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await ProfileModel.findByIdAndUpdate(req.params.id, {
      is_deleted: true,
    });
    return res.status(200).json({ msg: "Perfil eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al eliminar el perfil" });
  }
};
