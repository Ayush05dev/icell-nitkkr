// Certificate Controller
import * as authModel from "../models/authModel.js";
import {
  generateMemberCertificateHTML,
  generateMemberCertificateSVG,
} from "../utils/certificateService.js";

/**
 * Generate and download member certificate as SVG
 */
export async function downloadMemberCertificate(req, res) {
  try {
    const userId = req.user.userId;
    const user = await authModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const svgCertificate = generateMemberCertificateSVG(
      user.name,
      user.branch || "N/A",
      user.year || "N/A"
    );

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="icell-membership-certificate-${user.name.replace(
        /\s+/g,
        "-"
      )}.svg"`
    );

    res.send(svgCertificate);
  } catch (error) {
    console.error("Certificate download error:", error);
    res.status(500).json({ error: "Failed to generate certificate" });
  }
}

/**
 * Get certificate as HTML for preview/printing
 */
export async function previewMemberCertificate(req, res) {
  try {
    const userId = req.user.userId;
    const user = await authModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const htmlCertificate = generateMemberCertificateHTML(
      user.name,
      user.branch || "N/A",
      user.year || "N/A"
    );

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(htmlCertificate);
  } catch (error) {
    console.error("Certificate preview error:", error);
    res.status(500).json({ error: "Failed to generate certificate" });
  }
}

/**
 * Get certificate info
 */
export async function getCertificateInfo(req, res) {
  try {
    const userId = req.user.userId;
    const user = await authModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      available: true,
      certificateType: "Member Certificate",
      userName: user.name,
      branch: user.branch || "N/A",
      year: user.year || "N/A",
      downloadUrl: "/api/certificate/download",
      previewUrl: "/api/certificate/preview",
    });
  } catch (error) {
    console.error("Certificate info error:", error);
    res.status(500).json({ error: "Failed to get certificate info" });
  }
}
