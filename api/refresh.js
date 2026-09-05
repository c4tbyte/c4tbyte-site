import { put } from "@vercel/blob";
import { buildManifest as buildAirtableManifest } from "../sync/airtable/fetch.js";
import { buildManifest as buildCloudinaryManifest } from "../sync/cloudinary/fetch.js";

const SOURCES = [
  {
    name: "airtable",
    blobPath: "airtable-manifest.json",
    build: buildAirtableManifest,
  },
  {
    name: "cloudinary",
    blobPath: "cloudinary-manifest.json",
    build: buildCloudinaryManifest,
  },
];

async function refreshOne(source) {
  try {
    const manifest = await source.build();
    await put(source.blobPath, JSON.stringify(manifest), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    console.log(`[refresh] ${source.name} ok`);
    return { ok: true, generatedAt: manifest.generatedAt };
  } catch (err) {
    console.error(`[refresh] ${source.name} failed:`, err);
    return { ok: false, error: err.message };
  }
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManual = req.query.secret === process.env.CRON_SECRET;
  if (!isCron && !isManual) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const results = {};
  for (const source of SOURCES) {
    results[source.name] = await refreshOne(source);
  }
  return res.status(200).json(results);
}