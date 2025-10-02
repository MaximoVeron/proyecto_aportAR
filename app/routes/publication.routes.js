import { Router } from "express";
import {
  createPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
} from "../controllers/publication.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { responsibleMiddleware } from "../middlewares/responsible.middleware.js";

const publicationRouter = Router();

publicationRouter.post("/publications", createPublication);

publicationRouter.get("/publications", getPublications); // Público - para ver publicaciones

publicationRouter.get("/publications/:id", getPublicationById); // Público - para ver una publicación

publicationRouter.put("/publications/:id", authMiddleware, updatePublication);

publicationRouter.delete(
  "/publications/:id",
  authMiddleware,
  deletePublication
);

export default publicationRouter;
