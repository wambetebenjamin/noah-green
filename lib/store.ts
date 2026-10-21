export interface PickupLine {
  code: string;
  kg: number;
}

export interface PickupRecord {
  ref: string;
  email: string;
  name: string;
  phone: string;
  accountType: "household" | "business";
  materials: PickupLine[];
  date: string;
  slot: string;
  zone: string;
  address: string;
  gateNotes: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  estimatedPoints: number;
}

export interface RedemptionRecord {
  id: string;
  email: string;
  rewardType: "mpesa" | "partner" | "tree";
  points: number;
  createdAt: string;
  detail: string;
}

export interface UserRecord {
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
}

/**
 * Storage layer. Uses Vercel KV when KV_REST_API_URL and KV_REST_API_TOKEN
 * are configured, otherwise falls back to an in process Map so the platform
 * stays fully functional in local development and CI.
 */
interface StoreShape {
  pickups: Record<string, PickupRecord>;
  redemptions: RedemptionRecord[];
  users: Record<string, UserRecord>;
}

const globalStore = globalThis as unknown as {
  __noahGreenMemory?: StoreShape;
};

function memory(): StoreShape {
  if (!globalStore.__noahGreenMemory) {
    globalStore.__noahGreenMemory = { pickups: {}, redemptions: [], users: {} };
  }
  return globalStore.__noahGreenMemory;
}

function kvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
}

const KV_KEY = "noah-green:store:v1";

async function kvRead(): Promise<StoreShape> {
  const { kv } = await import("@vercel/kv");
  const existing = await kv.get<StoreShape>(KV_KEY);
  return existing || { pickups: {}, redemptions: [], users: {} };
}

async function kvWrite(store: StoreShape): Promise<void> {
  const { kv } = await import("@vercel/kv");
  await kv.set(KV_KEY, store);
}

async function read(): Promise<StoreShape> {
  if (kvConfigured()) {
    try {
      return await kvRead();
    } catch {
      return memory();
    }
  }
  return memory();
}

async function write(store: StoreShape): Promise<void> {
  if (kvConfigured()) {
    try {
      await kvWrite(store);
      return;
    } catch {
      /* fall through to memory */
    }
  }
  globalStore.__noahGreenMemory = store;
}

export function makeRef(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `NG-${out}`;
}

export async function savePickup(pickup: PickupRecord): Promise<void> {
  const store = await read();
  store.pickups[pickup.ref] = pickup;
  await write(store);
}

export async function getPickup(ref: string): Promise<PickupRecord | null> {
  const store = await read();
  return store.pickups[ref] || null;
}

export async function listPickups(email: string): Promise<PickupRecord[]> {
  const store = await read();
  return Object.values(store.pickups)
    .filter((p) => p.email.toLowerCase() === email.toLowerCase())
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function cancelPickup(
  ref: string,
  email: string
): Promise<boolean> {
  const store = await read();
  const pickup = store.pickups[ref];
  if (!pickup || pickup.email.toLowerCase() !== email.toLowerCase()) {
    return false;
  }
  if (pickup.status !== "scheduled") return false;
  pickup.status = "cancelled";
  await write(store);
  return true;
}

export async function addRedemption(r: RedemptionRecord): Promise<void> {
  const store = await read();
  store.redemptions.unshift(r);
  await write(store);
}

export async function listRedemptions(
  email: string
): Promise<RedemptionRecord[]> {
  const store = await read();
  return store.redemptions.filter(
    (r) => r.email.toLowerCase() === email.toLowerCase()
  );
}

export async function getUser(email: string): Promise<UserRecord | null> {
  const store = await read();
  return store.users[email.toLowerCase()] || null;
}

export async function createUser(user: UserRecord): Promise<boolean> {
  const store = await read();
  const key = user.email.toLowerCase();
  if (store.users[key]) return false;
  store.users[key] = user;
  await write(store);
  return true;
}
