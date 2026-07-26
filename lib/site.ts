export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.behindthetechz.live"
).replace(/\/+$/, "");

export const AUTHOR_CONFIG = {
  name: "Rahat Hossain Himel",
  avatar: process.env.NEXT_PUBLIC_AUTHOR_AVATAR || "/himel-avatar.jpg",
  role: "Software & System Architect",
  bio: "Writing about AI engineering, system boundaries, and software architecture.",
} as const;
