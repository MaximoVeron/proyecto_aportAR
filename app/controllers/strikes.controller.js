import { StrikeModel } from "../models/strikes.model.js";

export const createStrike = async (req, res) => {
  try {
    const newStrike = new StrikeModel(req.body);
    await newStrike.save();
    return res.status(201).json(newStrike);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear el strike" });
  }
};

export const getStrikes = async (req, res) => {
  try {
    const strikes = await StrikeModel.find();
    return res.status(200).json(strikes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener los strikes" });
  }
};

export const getStrikeById = async (req, res) => {
  try {
    const strike = await StrikeModel.findOne({
      _id: req.params.id,
      is_deleted: false,
    });
    return res.status(200).json(strike);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el strike" });
  }
};

export const updateStrike = async (req, res) => {
  try {
    const updatedStrike = await StrikeModel.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedStrike);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar el strike" });
  }
};

export const deleteStrike = async (req, res) => {
  try {
    await StrikeModel.findByIdAndUpdate(req.params.id, {
      is_deleted: true,
    });
    return res.status(200).json({ msg: "Strike eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al eliminar el strike" });
  }
};
