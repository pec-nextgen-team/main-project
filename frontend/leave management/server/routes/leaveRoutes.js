const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
// const { requireAuth, requireRole } = require("../middleware/auth");

// Mount in server.js with: app.use("/api/leaves", leaveRoutes);

router.get("/summary", leaveController.summary);
router.get("/export", leaveController.exportCsv);

router.get("/", leaveController.list);
router.post("/", leaveController.create);
router.get("/:id", leaveController.getById);
router.put("/:id", leaveController.update);
router.delete("/:id", leaveController.cancel);

router.patch("/:id/approve", /* requireRole("HEAD", "ADMIN"), */ leaveController.approve);
router.patch("/:id/reject", /* requireRole("HEAD", "ADMIN"), */ leaveController.reject);

module.exports = router;

// In a separate electricianRoutes.js (or here, adjust the mount path):
//   router.get("/:id/leave-balance", leaveController.leaveBalance);
