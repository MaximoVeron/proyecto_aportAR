import { Router } from "express";
import {
  createPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
} from "../controllers/publication.controller.js";
import {
  createPublicationValidation,
  updatePublicationValidation,
  publicationIdValidation,
} from "../middlewares/validations/publication.validation.js";
import { applyValidations } from "../middlewares/applyValidation.js";

const publicationRouter = Router();

publicationRouter.post(
  "/publications",
  applyValidations,
  createPublicationValidation,
  createPublication
);

publicationRouter.get("/publications", getPublications);

publicationRouter.get(
  "/publications/:id",
  publicationIdValidation,
  applyValidations,
  getPublicationById
);

publicationRouter.put(
  "/publications/:id",
  publicationIdValidation,
  updatePublicationValidation,
  applyValidations,
  updatePublication
);

publicationRouter.delete(
  "/publications/:id",
  publicationIdValidation,
  applyValidations,
  deletePublication
);

export default publicationRouter;
