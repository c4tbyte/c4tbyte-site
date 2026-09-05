import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT_FOLDER = "work-previews";

function slugFromPublicId(publicId) {
  // "work-previews/armageddon-records/preview" -> "armageddon-records"
  const parts = publicId.split("/");
  return parts.length >= 2 ? parts[1] : null;
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
  const latestBySlug = {};

  for (const resource of all) {
    const slug = slugFromPublicId(resource.public_id);
    if (!slug) continue;

    const existing = latestBySlug[slug];
    if (!existing || new Date(resource.created_at) > new Date(existing.created_at)) {
      latestBySlug[slug] = {
        url: resource.secure_url,
        created_at: resource.created_at,
      };
    }
  }

  const mediaBySlug = {};
  for (const [slug, data] of Object.entries(latestBySlug)) {
    mediaBySlug[slug] = data.url;
  }

  return {
    generatedAt: new Date().toISOString(),
    mediaBySlug,
  };
}