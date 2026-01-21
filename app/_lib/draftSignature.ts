import crypto from "crypto"

// const SECRET = process.env.DRAFT_SIGNING_SECRET;
const SECRET = '126716b35ce1e77bfaff6f266bd56a5d6e45fd4db576b76b45688b518e652b94fa244a8c01e4effc8bbdcf8ec7a3b05fcee75da57c85b2c33bee20a9aa400960'

export function signDraft(draft: unknown): string {
    return crypto.createHmac("sha256", SECRET).update(JSON.stringify(draft)).digest("hex")
}

export function verifyDraft(draft:unknown, signature:string):boolean {
    const expected = signDraft(draft);
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}