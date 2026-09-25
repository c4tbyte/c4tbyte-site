import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT_FOLDER = "work-previews";
const KNOWN_SLOTS = ["background", "desktop", "mobile"];

function getFolderParts(resource) {
  const folderPath =
    resource.folder || resource.public_id.split("/").slice(0, -1).join("/");
  return folderPath.split("/").filter(Boolean);
}

function getSlot(resource) {
  const raw = resource.display_name || resource.public_id.split("/").pop();
  return (raw || "").toLowerCase().trim();
}

async function listResources(resourceType) {
  const result = await cloudinary.api.resources({
    type: "upload",
    resource_type: resourceType,
    prefix: `${ROOT_FOLDER}/`,
    max_results: 500,
    tags: true,
  });
  return result.resources || [];
}

export async function buildManifest() {
  const [videos, images] = await Promise.all([
    listResources("video"),
    listResources("image"),
  ]);

  const all = [...videos, ...images];
  const latestSlots = {}; // key: "slug:slot" -> { url, created_at }
  const galleryItems = {}; // key: slug -> [{ url, created_at }]

  for (const resource of all) {
    const parts = getFolderParts(resource);
    // parts[0] = "work-previews", parts[1] = slug, parts[2] (optional) = "gallery"
    if (parts.length < 2) continue;
    const slug = parts[1];

    const isInGalleryFolder = parts.length >= 3 && parts[2].toLowerCase() === "gallery";

    if (isInGalleryFolder) {
      if (!galleryItems[slug]) galleryItems[slug] = [];
      const tags = (resource.tags || []).map((t) => t.toLowerCase());
      galleryItems[slug].push({
        url: resource.secure_url,
        created_at: resource.created_at,
        featured: tags.includes("featured"),
      });
      continue;
    }

    const slot = getSlot(resource);
    if (!KNOWN_SLOTS.includes(slot)) continue;

    const key = `${slug}:${slot}`;
    const existing = latestSlots[key];
    if (!existing || new Date(resource.created_at) > new Date(existing.created_at)) {
      latestSlots[key] = { url: resource.secure_url, created_at: resource.created_at };
    }
  }

  const mediaBySlug = {};

  for (const [key, data] of Object.entries(latestSlots)) {
    const [slug, slot] = key.split(":");
    if (!mediaBySlug[slug]) mediaBySlug[slug] = {};
    mediaBySlug[slug][slot] = data.url;
  }

  for (const [slug, items] of Object.entries(galleryItems)) {
    if (!mediaBySlug[slug]) mediaBySlug[slug] = {};
    mediaBySlug[slug].gallery = items
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(a.created_at) - new Date(b.created_at);
      })
      .map((item) => item.url);
  }

  return {
    generatedAt: new Date().toISOString(),
    mediaBySlug,
  };
}