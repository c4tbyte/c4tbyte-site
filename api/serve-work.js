import { getManifest as getAirtableManifest } from "../sync/airtable/read.js";
import { getManifest as getCloudinaryManifest } from "../sync/cloudinary/read.js";

function slugify(name) {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function handler(req, res) {
  try {
    const [airtable, cloudinaryData] = await Promise.all([
      getAirtableManifest(),
      getCloudinaryManifest(),
    ]);

    const mediaBySlug = cloudinaryData.mediaBySlug || {};
    const defaultMedia = mediaBySlug.default || {};

    const items = (airtable.items || []).map((item) => {
      const slug = slugify(item.name);
      const media = mediaBySlug[slug] || {};

      return {
        ...item,
        preview: {
          background: media.background || defaultMedia.background || "",
          desktop: media.desktop || "",
          mobile: media.mobile || "",
        },
      };
    });

    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.status(200).json({
      generatedAt: airtable.generatedAt,
      items,
    });
  } catch (err) {
    console.error("[api/serve-work] failed:", err);
    return res.status(500).json({ error: "Failed to load work items" });
  }
}