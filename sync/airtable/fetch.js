const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = "Work";

async function getAirtableRows() {
  let rows = [];
  let offset;
  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`);
    url.searchParams.set("view", "Grid view");
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    });
    if (!res.ok) {
      throw new Error(`Airtable fetch failed: ${res.status}`);
    }
    const json = await res.json();
    rows = rows.concat(json.records);
    offset = json.offset;
  } while (offset);
  return rows;
}

export async function buildManifest() {
  const rows = await getAirtableRows();
  const items = [];

  for (const row of rows) {
    const name = row.fields?.Name;
    if (!name) continue;

    items.push({
      name,
      type: row.fields?.Type || "",
      role: row.fields?.Role || "",
      description: row.fields?.Description || "",
      content: row.fields?.Content || "",
      stack: row.fields?.Stack || [],
      implementations: row.fields?.Implementations || [],
      previewMedia: row.fields?.["Preview Media"] || "",
      color: row.fields?.Color || "",
      tintColor: row.fields?.["Tint Color"] || "",
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    items,
  };
}