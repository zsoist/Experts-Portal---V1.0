import { createHmac, timingSafeEqual } from "node:crypto";

export function buildPersonaSignature(secret: string, payload: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyPersonaSignature(input: {
  secret: string;
  payload: string;
  signatureHeader?: string;
}) {
  if (!input.signatureHeader) {
    return false;
  }

  const expected = buildPersonaSignature(input.secret, input.payload);
  const received = input.signatureHeader.replace("sha256=", "");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}
