import { PublicationModel } from "../../../models/publications.model.js";

export const publicationExist = async (id) => {
  const publication = await PublicationModel.findById(id);
  if (!publication) {
    throw new Error("Publication not found");
  }
  return true;
};
