import type { Request, Response, NextFunction, RequestHandler } from "express";
import { validateRequestSignature } from "./node";

export type MiddlewareOptions = {
  // Perform extra validations here, or use the public key to hydrate the req.context
  validateSignature(
    req: Request,
    signature: string,
    publicKeyHex: string
  ): boolean;
};

function singleHeaderOrQuery(req: Request, name: string): string | null {
  const header = req.header(name);
  if (header) return header;
  const qs = req.query[name];
  if (typeof qs == "string") return qs;
  return null;
}

const ctxSymbol = Symbol("context");

export type Ctx = {
  publicKey: string;
};

export type Context = Partial<Ctx>;

export function getContext<T extends Context>(req: Request): T {
  const t = req as any;
  return (t[ctxSymbol] = t[ctxSymbol] || {});
}

export function requireSignature(
  options: Partial<MiddlewareOptions> = {}
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    let bodyChunks: Buffer[] = [];
    let size = 0;

    req.on("data", function (chunk) {
      bodyChunks.push(chunk);
      size += chunk.length;

      if (size >= 5 * 1024 * 1024) {
        req.socket.destroy();
        console.error("Had to destroy the socket due large payload");
      }
    });

    req.on("end", async function () {
      if (bodyChunks.length) {
        req.body = Buffer.concat(bodyChunks);
      }

      const timestamp = singleHeaderOrQuery(req, "x-timestamp");
      const identity = singleHeaderOrQuery(req, "x-identity");
      const signature = singleHeaderOrQuery(req, "x-signature");

      try {
        if (!signature || !timestamp || !identity) {
          throw new Error("Missing signature");
        }

        validateRequestSignature(
          signature,
          req.method.toUpperCase(),
          req.originalUrl,
          timestamp,
          req.body,
          identity
        );

        if (req.header("content-type") == "application/json") {
          const body = req.body as Buffer | void;
          if (body) {
            req.body = JSON.parse(body.toString());
          }
        }

        if (options.validateSignature) {
          options.validateSignature(req, signature, identity);
        }

        getContext(req).publicKey = identity;

        next();
      } catch (e) {
        next(e);
      }
    });
  };
}
