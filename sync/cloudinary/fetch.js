import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT_FOLDER = "work-previews";
const KNOWN_SLOTS = ["background", "desktop", "mobile"];

function getSlug(resource) {
  // Prefer the explicit "folder" field (reliable in Dynamic Folder Mode);
  // fall back to parsing it out of public_id otherwise.
  const folderPath =
    resource.folder || resource.public_id.split("/").slice(0, -1).join("/");
  const parts = folderPath.split("/").filter(Boolean);
  // parts[0] should be "work-previews", parts[1] is the project slug
  return parts.length >= 2 ? parts[1] : null;
}

function getSlot(resource) {
  // Prefer display_name (what you see/edit in the Cloudinary UI).
  // Falls back to the public_id's last segment if display_name isn't present
  // (e.g. Fixed Folder Mode accounts, or older assets).
  const raw = resource.display_name || resource.public_id.split("/").pop();
  return (raw || "").toLowerCase().trim();
}

async function listResources(resourceType) {
  const result = await cloudinary.api.resources({
    type: "upload",
    resource_type: resourceType,
    prefix: `${ROOT_FOLDER}/`,
    max_results: 500,
  });
  return result.resources || [];
}

export async function buildManifest() {
  const [videos, images] = await Promise.all([
    listResources("video"),
    listResources("image"),
  ]);

  const all = [...videos, ...images];
  const latest = {}; // key: "slug:slot" -> { url, created_at }

  for (const resource of all) {
    const slug = getSlug(resource);
    const slot = getSlot(resource);
    if (!slug || !KNOWN_SLOTS.includes(slot)) continue;

    const key = `${slug}:${slot}`;
    const existing = latest[key];
    if (!existing || new Date(resource.created_at) > new Date(existing.created_at)) {
      latest[key] = { url: resource.secure_url, created_at: resource.created_at };
    }
  }

  const mediaBySlug = {};
  for (const [key, data] of Object.entries(latest)) {
    const [slug, slot] = key.split(":");
    if (!mediaBySlug[slug]) mediaBySlug[slug] = {};
    mediaBySlug[slug][slot] = data.url;
  }

  return {
    generatedAt: new Date().toISOString(),
    mediaBySlug,
  };
}