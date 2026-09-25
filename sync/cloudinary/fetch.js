import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT_FOLDER = "work-previews";

function getFolderParts(resource) {
  const folderPath =
    resource.asset_folder ||
    resource.folder ||
    resource.public_id.split("/").slice(0, -1).join("/");
  return folderPath.split("/").filter(Boolean);
}

function getSlot(resource) {
  const raw = resource.display_name || resource.public_id.split("/").pop();
  return (raw || "").toLowerCase().trim();
}

async function listResources(resourceType) {
  const result = await cloudinary.search
    .expression(`resource_type:${resourceType} AND asset_folder:${ROOT_FOLDER}/*`)
    .with_field("tags")
    .max_results(500)
    .execute();
  return result.resources || [];
}

export async function buildManifest() {
  const [videos, images] = await Promise.all([
    listResources("video"),
    listResources("image"),
  ]);

  const all = [...videos, ...images];
  const galleryItems = {};   // slug -> [{ url, created_at, featured }]
  const portfolioAssets = {}; // slug -> { slotName: url }

  for (const resource of all) {
    const parts = getFolderParts(resource);
    // parts[0] = "work-previews", parts[1] = slug, parts[2] = "gallery" | "portfolio"
    if (parts.length < 3) continue;
    const slug = parts[1];
    const section = parts[2].toLowerCase();

    if (section === "gallery") {
      if (!galleryItems[slug]) galleryItems[slug] = [];
      const tags = (resource.tags || []).map((t) => t.toLowerCase());
      galleryItems[slug].push({
        url: resource.secure_url,
        created_at: resource.created_at,
        featured: tags.includes("featured"),
      });
      continue;
    }

    if (section === "portfolio") {
      // Open-ended: whatever the file is named becomes its slot key,
      // so new customization assets don't require code changes later.
      const slot = getSlot(resource);
      if (!slot) continue;
      if (!portfolioAssets[slug]) portfolioAssets[slug] = {};

      const existing = portfolioAssets[slug][`__meta_${slot}`];
      if (!existing || new Date(resource.created_at) > new Date(existing.created_at)) {
        portfolioAssets[slug][slot] = resource.secure_url;
        portfolioAssets[slug][`__meta_${slot}`] = { created_at: resource.created_at };
      }
      continue;
    }
  }

  const mediaBySlug = {};

  for (const [slug, items] of Object.entries(galleryItems)) {
    if (!mediaBySlug[slug]) mediaBySlug[slug] = {};

    const sorted = items.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(a.created_at) - new Date(b.created_at);
    });

    mediaBySlug[slug].gallery = sorted.map((item) => item.url);
    const featuredItem = sorted.find((item) => item.featured);
    mediaBySlug[slug].featured = featuredItem ? featuredItem.url : "";
  }

  for (const [slug, assets] of Object.entries(portfolioAssets)) {
    if (!mediaBySlug[slug]) mediaBySlug[slug] = {};
    // Strip internal __meta_ tracking keys before exposing
    const clean = {};
    for (const [key, value] of Object.entries(assets)) {
      if (!key.startsWith("__meta_")) clean[key] = value;
    }
    mediaBySlug[slug].portfolio = clean;
  }

  return {
    generatedAt: new Date().toISOString(),
    mediaBySlug,
  };
}