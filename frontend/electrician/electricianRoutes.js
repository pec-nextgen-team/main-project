const express = require("express");
const multer = require("multer");
const router = express.Router();
const electricianController = require("../controllers/electricianController");
const leaveController = require("../controllers/leaveController");
// const { requireAuth, requireRole } = require("../middleware/auth");

const upload = multer({ storage: multer.memoryStorage() });

// Mount in server.js with: app.use("/api/electricians", electricianRoutes);

router.get("/summary", electricianController.summary);
router.get("/export", electricianController.exportCsv);
router.post("/import", upload.single("file"), electricianController.importCsv);
router.patch("/bulk-status", electricianController.bulkUpdateStatus);

router.get("/", electricianController.list);
router.post("/", electricianController.create);
router.get("/:id", electricianController.getById);
router.put("/:id", electricianController.update);
router.patch("/:id/status", electricianController.updateStatus);
router.delete("/:id", /* requireRole("HEAD", "ADMIN"), */ electricianController.remove);

router.get("/:id/leave-balance", leaveController.leaveBalance);

module.exports = router;
