import { Router } from "express";
import { getElectricians } from "../controllers/ticketController.js";

const router = Router();

router.get("/electricians", getElectricians);

export default router;