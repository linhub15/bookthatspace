import { getEnv } from "../utils.ts";

interface Hash {
  hash: (value: string) => Promise<string>;
}

class Hasher implements Hash {
  #salt: string;

  constructor() {
    this.#salt = getEnv("HASH_SALT");
  }

  async hash(value: string) {
    const message = new TextEncoder().encode(value.concat(this.#salt));
    const hashBuffer = await crypto.subtle.digest("SHA-256", message);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  }
}

export const hasher = new Hasher();
