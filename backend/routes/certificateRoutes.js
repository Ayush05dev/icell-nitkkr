import { Router } from "express";
import {
  downloadMemberCertificate,
  previewMemberCertificate,
  getCertificateInfo,
} from "../controllers/certificateController.js";
import verifyUser from "../middleware/authMiddleware.js";

const router = Router();

// All certificate routes require authentication
router.get("/info", verifyUser, getCertificateInfo);
router.get("/download", verifyUser, downloadMemberCertificate);
router.get("/preview", verifyUser, previewMemberCertificate);

export default router;
