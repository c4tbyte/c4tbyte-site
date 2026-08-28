import { getManifest } from "../sync/airtable/read.js";

export default async function handler(req, res) {
  try {
    const manifest = await getManifest();
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.status(200).json(manifest);
  } catch (err) {
    console.error("[api/serve-airtable] failed:", err);
    return res.status(500).json({ error: "Failed to load work items" });
  }
}