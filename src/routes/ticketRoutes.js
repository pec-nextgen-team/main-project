import { Router } from "express";

import {
  openTicket,
  getElectricians,
  assignElectrician
} from "../controllers/ticketController.js";

const router = Router();

// Open an approved complaint as a ticket
router.post("/open/:complaintId", openTicket);

// Assign an electrician to a ticket
router.patch("/:id/assign-electrician", assignElectrician);

export default router;