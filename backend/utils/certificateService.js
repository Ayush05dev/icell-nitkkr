// Certificate Service - Generate PDF certificates for members
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Escape HTML/XML special characters
 */
function escapeXML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate a Member Certificate as HTML that can be printed to PDF
 */
export function generateMemberCertificateHTML(userName, branch, year) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const certificateHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iCell Member Certificate</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Georgia', serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f5f5f5;
            padding: 20px;
        }
        .certificate {
            width: 900px;
            height: 600px;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 3px solid #fbbf24;
            border-radius: 10px;
            padding: 60px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .certificate::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .certificate-content {
            position: relative;
            z-index: 1;
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .header {
            margin-bottom: 20px;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        
        .badge-text {
            color: #fbbf24;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 3px;
            margin-top: 5px;
        }
        
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #ffffff;
            margin: 30px 0;
            letter-spacing: 2px;
        }
        
        .description {
            color: #d1d5db;
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 30px;
            font-style: italic;
        }
        
        .recipient {
            background: rgba(251, 191, 36, 0.1);
            border-bottom: 2px solid #fbbf24;
            padding: 20px 0;
            margin: 30px 0;
        }
        
        .recipient-label {
            color: #9ca3af;
            font-size: 12px;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        
        .recipient-name {
            font-size: 24px;
            font-weight: bold;
            color: #fbbf24;
            margin-bottom: 10px;
        }
        
        .recipient-details {
            color: #d1d5db;
            font-size: 12px;
        }
        
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
        }
        
        .signature-block {
            text-align: center;
            flex: 1;
        }
        
        .signature-line {
            border-top: 2px solid #fbbf24;
            width: 100px;
            margin: 40px auto 10px;
        }
        
        .signature-title {
            color: #d1d5db;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1px;
        }
        
        .date {
            color: #9ca3af;
            font-size: 11px;
            margin-top: 20px;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .certificate {
                width: 100%;
                height: auto;
                aspect-ratio: 1.5 / 1;
                box-shadow: none;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="certificate-content">
            <div class="header">
                <div class="logo">ICell</div>
                <div class="badge-text">INNOVATION CENTER FOR ENTREPRENEURSHIP &amp; LEADERSHIP</div>
            </div>
            
            <div class="title">CERTIFICATE OF MEMBERSHIP</div>
            
            <div class="description">
                This certificate is proudly presented to a valued member of ICell,<br/>
                recognizing their commitment to innovation and excellence.
            </div>
            
            <div class="recipient">
                <div class="recipient-label">AWARDED TO</div>
                <div class="recipient-name">${escapeXML(userName)}</div>
                <div class="recipient-details">
                    <div>Branch: ${escapeXML(branch)} | Year: ${escapeXML(
    year
  )}</div>
                </div>
            </div>
            
            <div class="footer">
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <div class="signature-title">Director, ICell</div>
                </div>
                <div class="date">
                    Issued on: ${dateStr}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `;

  return certificateHTML;
}

/**
 * Generate certificate as SVG for direct download
 */
export function generateMemberCertificateSVG(userName, branch, year) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const svgWidth = 1200;
  const svgHeight = 800;

  // Escape user inputs for safe XML/SVG rendering
  const safeName = escapeXML(userName);
  const safeBranch = escapeXML(branch);
  const safeYear = escapeXML(year);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d2d2d;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="url(#bgGradient)"/>
  
  <!-- Border -->
  <rect x="30" y="30" width="${svgWidth - 60}" height="${
    svgHeight - 60
  }" fill="none" stroke="#fbbf24" stroke-width="3" rx="15"/>
  
  <!-- Decorative corners -->
  <circle cx="60" cy="60" r="8" fill="#fbbf24" opacity="0.3"/>
  <circle cx="${svgWidth - 60}" cy="60" r="8" fill="#fbbf24" opacity="0.3"/>
  <circle cx="60" cy="${svgHeight - 60}" r="8" fill="#fbbf24" opacity="0.3"/>
  <circle cx="${svgWidth - 60}" cy="${
    svgHeight - 60
  }" r="8" fill="#fbbf24" opacity="0.3"/>
  
  <!-- Logo -->
  <text x="${
    svgWidth / 2
  }" y="120" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="url(#goldGradient)" text-anchor="middle" letter-spacing="3">ICell</text>
  
  <!-- Badge text -->
  <text x="${
    svgWidth / 2
  }" y="155" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#fbbf24" text-anchor="middle" letter-spacing="4">INNOVATION CENTER FOR ENTREPRENEURSHIP</text>
  
  <!-- Title -->
  <text x="${
    svgWidth / 2
  }" y="220" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">CERTIFICATE OF MEMBERSHIP</text>
  
  <!-- Description -->
  <text x="${
    svgWidth / 2
  }" y="280" font-family="Georgia, serif" font-size="16" fill="#d1d5db" text-anchor="middle">This certificate is proudly presented to a valued member of ICell,</text>
  <text x="${
    svgWidth / 2
  }" y="310" font-family="Georgia, serif" font-size="16" fill="#d1d5db" text-anchor="middle">recognizing their commitment to innovation and excellence.</text>
  
  <!-- Recipient section background -->
  <rect x="150" y="340" width="${
    svgWidth - 300
  }" height="120" fill="#fbbf24" opacity="0.1" rx="5"/>
  <line x1="150" y1="465" x2="${
    svgWidth - 150
  }" y2="465" stroke="#fbbf24" stroke-width="2"/>
  
  <!-- Recipient label -->
  <text x="${
    svgWidth / 2
  }" y="365" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#9ca3af" text-anchor="middle" letter-spacing="2">AWARDED TO</text>
  
  <!-- Recipient name -->
  <text x="${
    svgWidth / 2
  }" y="410" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#fbbf24" text-anchor="middle">${safeName}</text>
  
  <!-- Details -->
  <text x="${
    svgWidth / 2
  }" y="445" font-family="Georgia, serif" font-size="13" fill="#d1d5db" text-anchor="middle">Branch: ${safeBranch} | Year: ${safeYear}</text>
  
  <!-- Signature line -->
  <line x1="250" y1="550" x2="350" y2="550" stroke="#fbbf24" stroke-width="2"/>
  <text x="300" y="570" font-family="Georgia, serif" font-size="12" font-weight="bold" fill="#d1d5db" text-anchor="middle" letter-spacing="1">Director, ICell</text>
  
  <!-- Date -->
  <text x="${
    svgWidth - 250
  }" y="580" font-family="Georgia, serif" font-size="13" fill="#9ca3af" text-anchor="middle">Issued on: ${dateStr}</text>
</svg>`;
}

/**
 * Generate Post Holder Certificate as HTML
 */
export function generatePostHolderCertificateHTML(
  userName,
  branch,
  year,
  position
) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iCell Post Holder Certificate</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f5f5f5;
            padding: 20px;
        }
        .certificate {
            width: 900px;
            height: 600px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 3px solid #e94560;
            border-radius: 10px;
            padding: 60px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }
        .certificate-content {
            position: relative;
            z-index: 1;
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #e94560;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        .badge-text {
            color: #e94560;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 3px;
            margin-top: 5px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #ffffff;
            margin: 30px 0;
            letter-spacing: 2px;
        }
        .position {
            font-size: 20px;
            font-weight: bold;
            color: #e94560;
            margin: 10px 0;
        }
        .recipient-name {
            font-size: 24px;
            font-weight: bold;
            color: #e94560;
            margin-bottom: 10px;
        }
        .recipient-details {
            color: #d1d5db;
            font-size: 12px;
        }
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
        }
        .signature-line {
            border-top: 2px solid #e94560;
            width: 100px;
            margin: 40px auto 10px;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="certificate-content">
            <div class="header">
                <div class="logo">ICell</div>
                <div class="badge-text">OFFICIAL POST HOLDER</div>
            </div>
            <div class="title">CERTIFICATE OF APPOINTMENT</div>
            <p style="color: #d1d5db; font-size: 13px; line-height: 1.6; margin-bottom: 30px; font-style: italic;">
                This certificate is proudly presented for the position of
            </p>
            <div class="position">${escapeXML(position)}</div>
            <div class="recipient">
                <div style="color: #9ca3af; font-size: 12px; letter-spacing: 1px; margin-bottom: 8px;">AWARDED TO</div>
                <div class="recipient-name">${escapeXML(userName)}</div>
                <div class="recipient-details">
                    <div>Branch: ${escapeXML(branch)} | Year: ${escapeXML(
    year
  )}</div>
                </div>
            </div>
            <div class="footer">
                <div style="text-align: center; flex: 1;">
                    <div class="signature-line"></div>
                    <div style="color: #d1d5db; font-size: 11px; font-weight: bold;">Director, ICell</div>
                </div>
                <div style="color: #9ca3af; font-size: 11px;">Issued on: ${dateStr}</div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Generate Post Holder Certificate as SVG
 */
export function generatePostHolderCertificateSVG(
  userName,
  branch,
  year,
  position
) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const svgWidth = 1200;
  const svgHeight = 800;

  const safeName = escapeXML(userName);
  const safeBranch = escapeXML(branch);
  const safeYear = escapeXML(year);
  const safePosition = escapeXML(position);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${svgWidth}" height="${svgHeight}" fill="url(#bgGradient2)"/>
  <rect x="30" y="30" width="${svgWidth - 60}" height="${
    svgHeight - 60
  }" fill="none" stroke="#e94560" stroke-width="3" rx="15"/>
  
  <circle cx="60" cy="60" r="8" fill="#e94560" opacity="0.3"/>
  <circle cx="${svgWidth - 60}" cy="60" r="8" fill="#e94560" opacity="0.3"/>
  <circle cx="60" cy="${svgHeight - 60}" r="8" fill="#e94560" opacity="0.3"/>
  <circle cx="${svgWidth - 60}" cy="${
    svgHeight - 60
  }" r="8" fill="#e94560" opacity="0.3"/>
  
  <text x="${
    svgWidth / 2
  }" y="120" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#e94560" text-anchor="middle" letter-spacing="3">ICell</text>
  <text x="${
    svgWidth / 2
  }" y="155" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#e94560" text-anchor="middle" letter-spacing="4">OFFICIAL POST HOLDER</text>
  
  <text x="${
    svgWidth / 2
  }" y="220" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">CERTIFICATE OF APPOINTMENT</text>
  
  <text x="${
    svgWidth / 2
  }" y="280" font-family="Georgia, serif" font-size="16" fill="#d1d5db" text-anchor="middle">This certificate is proudly presented for the position of</text>
  
  <text x="${
    svgWidth / 2
  }" y="330" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#e94560" text-anchor="middle">${safePosition}</text>
  
  <rect x="150" y="360" width="${
    svgWidth - 300
  }" height="100" fill="#e94560" opacity="0.1" rx="5"/>
  <line x1="150" y1="475" x2="${
    svgWidth - 150
  }" y2="475" stroke="#e94560" stroke-width="2"/>
  
  <text x="${
    svgWidth / 2
  }" y="385" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#9ca3af" text-anchor="middle" letter-spacing="2">AWARDED TO</text>
  <text x="${
    svgWidth / 2
  }" y="425" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#e94560" text-anchor="middle">${safeName}</text>
  <text x="${
    svgWidth / 2
  }" y="460" font-family="Georgia, serif" font-size="13" fill="#d1d5db" text-anchor="middle">Branch: ${safeBranch} | Year: ${safeYear}</text>
  
  <line x1="250" y1="550" x2="350" y2="550" stroke="#e94560" stroke-width="2"/>
  <text x="300" y="570" font-family="Georgia, serif" font-size="12" font-weight="bold" fill="#d1d5db" text-anchor="middle" letter-spacing="1">Director, ICell</text>
  
  <text x="${
    svgWidth - 250
  }" y="580" font-family="Georgia, serif" font-size="13" fill="#9ca3af" text-anchor="middle">Issued on: ${dateStr}</text>
</svg>`;
}

/**
 * Generate Event Achievement Certificate as HTML
 */
export function generateEventCertificateHTML(
  userName,
  branch,
  year,
  achievement
) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iCell Achievement Certificate</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f5f5f5;
            padding: 20px;
        }
        .certificate {
            width: 900px;
            height: 600px;
            background: linear-gradient(135deg, #1a2e3e 0%, #0d1b2a 100%);
            border: 3px solid #06b6d4;
            border-radius: 10px;
            padding: 60px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }
        .certificate-content {
            position: relative;
            z-index: 1;
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #06b6d4;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        .badge-text {
            color: #06b6d4;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 3px;
            margin-top: 5px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #ffffff;
            margin: 30px 0;
            letter-spacing: 2px;
        }
        .achievement {
            font-size: 20px;
            font-weight: bold;
            color: #06b6d4;
            margin: 15px 0;
            font-style: italic;
        }
        .recipient-name {
            font-size: 24px;
            font-weight: bold;
            color: #06b6d4;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="certificate-content">
            <div class="header">
                <div class="logo">ICell</div>
                <div class="badge-text">ACHIEVEMENT AWARD</div>
            </div>
            <div class="title">CERTIFICATE OF ACHIEVEMENT</div>
            <p style="color: #d1d5db; font-size: 13px; margin-bottom: 10px;">This certificate is proudly awarded for</p>
            <div class="achievement">${escapeXML(achievement)}</div>
            <div style="background: rgba(6, 182, 212, 0.1); border-bottom: 2px solid #06b6d4; padding: 20px 0; margin: 20px 0;">
                <div style="color: #9ca3af; font-size: 12px; letter-spacing: 1px; margin-bottom: 8px;">AWARDED TO</div>
                <div class="recipient-name">${escapeXML(userName)}</div>
                <div style="color: #d1d5db; font-size: 12px;">Branch: ${escapeXML(
                  branch
                )} | Year: ${escapeXML(year)}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px;">
                <div style="text-align: center; flex: 1;">
                    <div style="border-top: 2px solid #06b6d4; width: 100px; margin: 40px auto 10px;"></div>
                    <div style="color: #d1d5db; font-size: 11px; font-weight: bold;">Director, ICell</div>
                </div>
                <div style="color: #9ca3af; font-size: 11px;">Issued on: ${dateStr}</div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Generate Event Achievement Certificate as SVG
 */
export function generateEventCertificateSVG(
  userName,
  branch,
  year,
  achievement
) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const svgWidth = 1200;
  const svgHeight = 800;

  const safeName = escapeXML(userName);
  const safeBranch = escapeXML(branch);
  const safeYear = escapeXML(year);
  const safeAchievement = escapeXML(achievement);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a2e3e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0d1b2a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${svgWidth}" height="${svgHeight}" fill="url(#bgGradient3)"/>
  <rect x="30" y="30" width="${svgWidth - 60}" height="${
    svgHeight - 60
  }" fill="none" stroke="#06b6d4" stroke-width="3" rx="15"/>
  
  <circle cx="60" cy="60" r="8" fill="#06b6d4" opacity="0.3"/>
  <circle cx="${svgWidth - 60}" cy="60" r="8" fill="#06b6d4" opacity="0.3"/>
  <circle cx="60" cy="${svgHeight - 60}" r="8" fill="#06b6d4" opacity="0.3"/>
  <circle cx="${svgWidth - 60}" cy="${
    svgHeight - 60
  }" r="8" fill="#06b6d4" opacity="0.3"/>
  
  <text x="${
    svgWidth / 2
  }" y="120" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#06b6d4" text-anchor="middle" letter-spacing="3">ICell</text>
  <text x="${
    svgWidth / 2
  }" y="155" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#06b6d4" text-anchor="middle" letter-spacing="4">ACHIEVEMENT AWARD</text>
  
  <text x="${
    svgWidth / 2
  }" y="220" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle">CERTIFICATE OF ACHIEVEMENT</text>
  
  <text x="${
    svgWidth / 2
  }" y="280" font-family="Georgia, serif" font-size="16" fill="#d1d5db" text-anchor="middle">This certificate is proudly awarded for</text>
  <text x="${
    svgWidth / 2
  }" y="320" font-family="Georgia, serif" font-size="24" font-weight="bold" fill="#06b6d4" text-anchor="middle" font-style="italic">${safeAchievement}</text>
  
  <rect x="150" y="350" width="${
    svgWidth - 300
  }" height="110" fill="#06b6d4" opacity="0.1" rx="5"/>
  <line x1="150" y1="470" x2="${
    svgWidth - 150
  }" y2="470" stroke="#06b6d4" stroke-width="2"/>
  
  <text x="${
    svgWidth / 2
  }" y="375" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#9ca3af" text-anchor="middle" letter-spacing="2">AWARDED TO</text>
  <text x="${
    svgWidth / 2
  }" y="420" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#06b6d4" text-anchor="middle">${safeName}</text>
  <text x="${
    svgWidth / 2
  }" y="455" font-family="Georgia, serif" font-size="13" fill="#d1d5db" text-anchor="middle">Branch: ${safeBranch} | Year: ${safeYear}</text>
  
  <line x1="250" y1="550" x2="350" y2="550" stroke="#06b6d4" stroke-width="2"/>
  <text x="300" y="570" font-family="Georgia, serif" font-size="12" font-weight="bold" fill="#d1d5db" text-anchor="middle">Director, ICell</text>
  
  <text x="${
    svgWidth - 250
  }" y="580" font-family="Georgia, serif" font-size="13" fill="#9ca3af" text-anchor="middle">Issued on: ${dateStr}</text>
</svg>`;
}
