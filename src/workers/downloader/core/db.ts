import Redis from "ioredis";
import connection from "./connection";

const redis = new Redis(connection.port, connection.host);

export async function getRecord<T = string>(key: string): Promise<T | null> {
  const result = await redis.get(key);
  try {
    return JSON.parse(result as string);
  } catch {
    return result as T;
  }
}

export function saveRecord(key: string, value: unknown) {
  return redis.set(key, typeof value === "string" ? value : JSON.stringify(value));
}

export function addToList(listName: string, value: string) {
  return redis.sadd(listName, [value]);
}
