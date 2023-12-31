import "server-only";
import { type RedisClientType, createClient } from "redis";

async function callClient<T>(operation: (client: RedisClientType) => Promise<T>) {
  const host = process.env.REDIS_HOST || "localhost";
  const port = parseInt(process.env.REDIS_PORT!) || 6379;
  const client = createClient({ url: `redis://${host}:${port}` });
  client.on("error", err => console.error("Redis Client Error", err));
  await client.connect();
  const result = await operation(client as RedisClientType);
  await client.disconnect();
  return result;
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

export function getSet(key: string) {
  return callClient(client => client.sMembers(key));
}

export function isInList(value: string, setName: string) {
  return callClient(client => client.sIsMember(setName, value));
}
