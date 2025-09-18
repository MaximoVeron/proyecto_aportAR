import { Router } from "express";
import userRouter from "./user.routes.js";
import strikeRouter from "./routes/strikes.routes.js";
import profileRouter from "./profile.routes.js";
import commentRouter from "./comments.routes.js";
import publicationRouter from "./publication.routes.js";

const router = Router();
router.use(userRouter);
router.use(strikeRouter);
router.use(profileRouter);
router.use(commentRouter);
router.use(publicationRouter);

export default router;
