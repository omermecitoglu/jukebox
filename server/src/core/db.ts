import { createClient } from "redis";

export async function getRecords(...args: string[]) {
  const client = createClient();
  client.on("error", err => console.error("Redis Client Error", err));
  await client.connect();
  const results: Record<string, string | undefined> = {};
  for (const key of args) {
    results[key] = await client.get(key) ?? "";
  }
  await client.disconnect();
  return results;
}

export async function setRecords(records: Record<string, string>) {
  const client = createClient();
  client.on("error", err => console.error("Redis Client Error", err));
  await client.connect();
  for (const [key, value] of Object.entries(records)) {
    await client.set(key, value);
  }
  await client.disconnect();
}

export async function saveRecord(key: string, value: string) {
  const client = createClient();
  client.on("error", err => console.error("Redis Client Error", err));
  await client.connect();
  await client.set(key, value),
  await client.disconnect();
}
