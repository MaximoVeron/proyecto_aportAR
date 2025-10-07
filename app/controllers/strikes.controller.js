import { StrikeModel } from "../models/strikes.model.js";
import { matchedData } from "express-validator";

export const createStrike = async (req, res) => {
  try {
    const validatedData = matchedData(req);
    const newStrike = new StrikeModel(validatedData);
    await newStrike.save();
    return res.status(201).json(newStrike);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear el strike" });
  }
};

export const getStrikes = async (req, res) => {
  try {
    const strikes = await StrikeModel.find({ is_deleted: false });
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
    if (!strike) {
      return res.status(404).json({ msg: "Strike no encontrado" });
    }
    return res.status(200).json(strike);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al obtener el strike" });
  }
};

export const updateStrike = async (req, res) => {
  try {
    const validatedData = matchedData(req);
    const updatedStrike = await StrikeModel.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      validatedData,
      { new: true }
    );
    if (!updatedStrike) {
      return res.status(404).json({ msg: "Strike no encontrado" });
    }
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
