import { Router } from "express";
import userRouter from "./user.routes.js";
import strikeRouter from "./strikes.routes.js";
import commentRouter from "./comments.routes.js";
import publicationRouter from "./publication.routes.js";
import authRouter from "./auth.routes.js";

const router = Router();
router.use(authRouter);
router.use(userRouter);
router.use(strikeRouter);
router.use(commentRouter);
router.use(publicationRouter);

export default router;
