import React from "react";

// SOS Official Icons - From Brand Guidelines
export const SOSIcons = {
  // Symbol Icon - Plant/Growth
  Plant: ({ size = 64, color = "#00abec" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      {/* Hands holding plant */}
      <path d="M20 70 Q15 60 20 50 Q25 45 30 50 L35 55 Q30 60 30 70 L30 85 Q30 90 25 90 L20 90 Q15 90 15 85 L15 80 Q15 75 20 70" />
      <path d="M80 70 Q85 60 80 50 Q75 45 70 50 L65 55 Q70 60 70 70 L70 85 Q70 90 75 90 L80 90 Q85 90 85 85 L85 80 Q85 75 80 70" />
      {/* Plant stem */}
      <rect x="47" y="40" width="6" height="35" rx="3" />
      {/* Leaves */}
      <ellipse cx="35" cy="35" rx="15" ry="20" transform="rotate(-20 35 35)" />
      <ellipse cx="65" cy="30" rx="12" ry="18" transform="rotate(15 65 30)" />
    </svg>
  ),

  // People Icon - Family
  Family: ({ size = 64, color = "#00abec" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      {/* Adult 1 */}
      <circle cx="30" cy="20" r="8" />
      <path d="M20 32 Q20 28 25 28 L35 28 Q40 28 40 32 L40 50 Q40 55 35 55 L25 55 Q20 55 20 50 Z" />
      <path
        d="M15 35 L10 45"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M45 35 L50 45"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Adult 2 */}
      <circle cx="70" cy="20" r="8" />
      <path d="M60 32 Q60 28 65 28 L75 28 Q80 28 80 32 L80 50 Q80 55 75 55 L65 55 Q60 55 60 50 Z" />
      <path
        d="M55 35 L50 45"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M85 35 L90 45"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Child 1 */}
      <circle cx="20" cy="55" r="5" />
      <path d="M15 62 Q15 60 18 60 L22 60 Q25 60 25 62 L25 75 Q25 78 22 78 L18 78 Q15 78 15 75 Z" />

      {/* Child 2 */}
      <circle cx="50" cy="60" r="5" />
      <path d="M45 67 Q45 65 48 65 L52 65 Q55 65 55 67 L55 80 Q55 83 52 83 L48 83 Q45 83 45 80 Z" />

      {/* Child 3 */}
      <circle cx="80" cy="55" r="5" />
      <path d="M75 62 Q75 60 78 60 L82 60 Q85 60 85 62 L85 75 Q85 78 82 78 L78 78 Q75 78 75 75 Z" />
    </svg>
  ),

  // Village/Home icon - SOS Village
  Village: ({ size = 64, color = "#00abec" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      {/* House shape */}
      <path d="M50 5 L90 40 L90 95 L55 95 L55 65 L45 65 L45 95 L10 95 L10 40 Z" />
      {/* Heart inside */}
      <path
        d="M50 55 Q45 45 35 45 Q25 45 25 55 Q25 70 50 85 Q75 70 75 55 Q75 45 65 45 Q55 45 50 55"
        fill="white"
      />
    </svg>
  ),

  // Dark blue village
  VillageDark: ({ size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="#1c325d">
      <path d="M50 5 L90 40 L90 95 L55 95 L55 65 L45 65 L45 95 L10 95 L10 40 Z" />
      <path
        d="M50 55 Q45 45 35 45 Q25 45 25 55 Q25 70 50 85 Q75 70 75 55 Q75 45 65 45 Q55 45 50 55"
        fill="white"
      />
    </svg>
  ),

  // White village
  VillageWhite: ({ size = 64 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="white">
      <path d="M50 5 L90 40 L90 95 L55 95 L55 65 L45 65 L45 95 L10 95 L10 40 Z" />
      <path
        d="M50 55 Q45 45 35 45 Q25 45 25 55 Q25 70 50 85 Q75 70 75 55 Q75 45 65 45 Q55 45 50 55"
        fill="#00abec"
      />
    </svg>
  ),

  // Heart icon
  Heart: ({ size = 24, color = "#de5a6c" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),

  // Shield/Protection icon
  Shield: ({ size = 64, color = "#1c325d" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      <path d="M50 5 L90 20 Q90 60 50 95 Q10 60 10 20 L50 5" />
      <path
        d="M50 25 L50 75 M35 40 L50 25 L65 40"
        stroke="white"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Document/Report icon
  Document: ({ size = 64, color = "#00abec" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      <rect x="20" y="10" width="60" height="80" rx="5" />
      <line
        x1="35"
        y1="30"
        x2="65"
        y2="30"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="45"
        x2="65"
        y2="45"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="60"
        x2="55"
        y2="60"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="70" cy="75" r="12" fill="#de5a6c" />
      <path
        d="M66 75 L70 79 L76 71"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Notification/Bell icon
  Notification: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),

  // User/Person icon
  User: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),

  // Upload icon
  Upload: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),

  // Search icon
  Search: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),

  // Check/Done icon
  Check: ({ size = 24, color = "#4ECDC4" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),

  // Alert/Warning icon
  Alert: ({ size = 24, color = "#FFB347" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),

  // Danger/Error icon
  Danger: ({ size = 24, color = "#de5a6c" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),

  // Close/X icon
  Close: ({ size = 24, color = "#6b7280" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),

  // Save icon
  Save: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17,21 17,13 7,13 7,21" />
      <polyline points="7,3 7,8 15,8" />
    </svg>
  ),

  // Edit/Pen icon
  Edit: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),

  // Image/Picture icon
  Image: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21,15 16,10 5,21" />
    </svg>
  ),

  // Audio/Music icon
  Audio: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),

  // Video/Film icon
  Video: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23,7 16,12 23,17 23,7" />
      <rect x="2" y="5" width="14" height="14" rx="2" ry="2" />
    </svg>
  ),

  // File icon
  File: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13,2 13,9 20,9" />
    </svg>
  ),

  // Folder icon
  Folder: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),

  // Paperclip/Attachment icon
  Paperclip: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),

  // ArrowUp icon
  ArrowUp: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5,12 12,5 19,12" />
    </svg>
  ),

  // ArrowDown icon
  ArrowDown: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19,12 12,19 5,12" />
    </svg>
  ),

  // ArrowRight icon
  ArrowRight: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  ),

  // Calendar icon
  Calendar: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),

  // Clock/Time icon
  Clock: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),

  // Lightbulb/Idea icon
  Lightbulb: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  ),

  // Info/Information icon
  Info: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),

  // Scales/Balance icon
  Scales: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M5 9l2-4 2 4c-1.1 2-3.9 2-5 0z" />
      <path d="M17 9l2-4 2 4c-1.1 2-3.9 2-5 0z" />
      <line x1="5" y1="21" x2="19" y2="21" />
    </svg>
  ),

  // Tag/Label icon
  Tag: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),

  // Trash/Delete icon
  Trash: ({ size = 24, color = "#de5a6c" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),

  // Users/People icon
  Users: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),

  // Clipboard icon
  Clipboard: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),

  // Writing/Notes icon
  Writing: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),

  // Send/Upload out icon
  Send: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22,2 15,22 11,13 2,9 22,2" />
    </svg>
  ),

  // Circle Critical (Red)
  CircleCritical: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#de5a6c" />
    </svg>
  ),

  // Circle Medium (Yellow/Orange)
  CircleMedium: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#f59e0b" />
    </svg>
  ),

  // Circle Low (Green - using teal from palette)
  CircleLow: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#84ccf1" />
    </svg>
  ),

  // CheckCircle (for completed status)
  CheckCircle: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
  ),

  // XCircle (for error/reject)
  XCircle: ({ size = 24, color = "#de5a6c" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),

  // Download icon
  Download: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),

  // Plus/Add icon
  Plus: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),

  // Minus icon
  Minus: ({ size = 24, color = "#00abec" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

export default SOSIcons;
