import crypto from "crypto"

const SECRET = process.env.DRAFT_SIGNING_SECRET;

export function signDraft(draft: unknown): string {
    return crypto.createHmac("sha256", SECRET).update(JSON.stringify(draft)).digest("hex")
}

export function verifyDraft(draft:unknown, signature:string):boolean {
    const expected = signDraft(draft);
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}