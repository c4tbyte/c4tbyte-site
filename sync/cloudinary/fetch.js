import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT_FOLDER = "work-previews";
const KNOWN_SLOTS = ["background", "desktop", "mobile"];

function parsePublicId(publicId) {
  // "work-previews/armageddon-records/desktop" -> { slug: "armageddon-records", slot: "desktop" }
  const parts = publicId.split("/");
  if (parts.length < 3) return null;
  const slug = parts[1];
  const filename = parts[parts.length - 1].toLowerCase();
  if (!KNOWN_SLOTS.includes(filename)) return null;
  return { slug, slot: filename };
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
    const parsed = parsePublicId(resource.public_id);
    if (!parsed) continue;

    const key = `${parsed.slug}:${parsed.slot}`;
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