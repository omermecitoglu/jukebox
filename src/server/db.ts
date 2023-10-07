import "server-only";
import { type RedisClientType, createClient } from "redis";

async function callClient(operation: (client: RedisClientType) => Promise<unknown>) {
  const client = createClient();
  client.on("error", err => console.error("Redis Client Error", err));
  await client.connect();
  await operation(client as RedisClientType);
  await client.disconnect();
}

export async function getRecords(...args: string[]) {
  const results: Record<string, string | undefined> = {};
  await callClient(async (client) => {
    for (const key of args) {
      results[key] = await client.get(key) ?? "";
    }
  });
  return results;
}

export function setRecords(records: Record<string, string>) {
  return callClient(async (client) => {
    for (const [key, value] of Object.entries(records)) {
      await client.set(key, value);
    }
  });
}

export function saveRecord(key: string, value: string) {
  return callClient(client => client.set(key, value));
}
