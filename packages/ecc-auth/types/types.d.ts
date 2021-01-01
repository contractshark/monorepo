export type Keys = {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
};

export type Signature = {
  signature: Uint8Array;
  recid: number;
};
