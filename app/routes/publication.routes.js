import { Router } from "express";
import {
  createPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
} from "../controllers/publications.controller.js";

const publicationRouter = Router();

publicationRouter.post("/publications", createPublication);
publicationRouter.get("/publications", getPublications);
publicationRouter.get("/publications/:id", getPublicationById);
publicationRouter.put("/publications/:id", updatePublication);
publicationRouter.delete("/publications/:id", deletePublication);

export default publicationRouter;
