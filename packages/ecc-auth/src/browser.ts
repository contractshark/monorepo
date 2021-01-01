import {
  privateKeyVerify,
  publicKeyCreate,
  ecdsaSign,
  ecdsaVerify,
} from "secp256k1";
import { Keys, Signature } from "./types";

export async function isSignatureValid(
  signature: Uint8Array,
  message: Uint8Array,
  publicKey: Uint8Array
): Promise<boolean> {
  return ecdsaVerify(signature, message, publicKey);
}

export async function isSignatureValidHex(
  signatureHex: string,
  messageHex: string,
  publicKeyHex: string
): Promise<boolean> {
  return isSignatureValid(
    fromHex(signatureHex),
    fromHex(messageHex),
    fromHex(publicKeyHex)
  );
}

export async function validateRequestSignature(
  signatureHex: string,
  method: string,
  path: string,
  timestamp: string,
  body: string | Uint8Array | void,
  publicKeyHex: string
): Promise<void> {
  const parts: string[] = [method.toUpperCase(), path, timestamp];

  if (body) {
    if (typeof body === "string") {
      parts.push(await sha256string(body));
    } else if (body instanceof Uint8Array) {
      parts.push(await sha256(body));
    }
  }

  const payload = new TextEncoder().encode(parts.join(""));
  const hashBuffer = await crypto.subtle.digest("SHA-256", payload);

  const isValid = isSignatureValid(
    fromHex(signatureHex),
    new Uint8Array(hashBuffer),
    fromHex(publicKeyHex)
  );

  if (!isValid) {
    throw new Error("Invalid signature");
  }
}

export function generateKeyPair(): Keys {
  let privateKey = new Uint8Array(32);
  let retries = 0;

  // Generate a private key until valid
  do {
    crypto.getRandomValues(privateKey);
    retries++;
  } while (!privateKeyVerify(privateKey) && retries < 10);

  if (!privateKeyVerify(privateKey)) {
    throw new Error("Could not create private key");
  }

  return {
    publicKey: publicKeyCreate(privateKey),
    privateKey: privateKey,
  };
}

export async function getRequestSignature(
  method: string,
  path: string,
  timestamp: string,
  body: string | Uint8Array | void,
  privatekey: Uint8Array
): Promise<Signature> {
  const parts: string[] = [method.toUpperCase(), path, timestamp];

  if (body) {
    if (typeof body === "string") {
      parts.push(await sha256string(body));
    } else if (body instanceof Uint8Array) {
      parts.push(await sha256(body));
    }
  }

  return signString(parts.join(""), privatekey);
}

export function fromHex(hexString: string) {
  return new Uint8Array(
    hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
}

export function toHex(bytes: Uint8Array): string {
  const hashArray = Array.from(bytes); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

export async function signString(
  message: string,
  key: Uint8Array
): Promise<Signature> {
  const payload = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", payload);
  const ret = ecdsaSign(new Uint8Array(hashBuffer), key, {});
  return ret;
}

export async function signUint8Array(
  payload: Uint8Array,
  key: Uint8Array
): Promise<Signature> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", payload);
  const ret = ecdsaSign(new Uint8Array(hashBuffer), key, {});
  return ret;
}

export async function sha256string(message: string): Promise<string> {
  const payload = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", payload); // hash the message
  return toHex(new Uint8Array(hashBuffer)); // convert buffer to byte array
}

export async function sha256(payload: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", payload); // hash the message
  return toHex(new Uint8Array(hashBuffer));
}
