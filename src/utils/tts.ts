import { createHash, createVerify } from 'crypto';
import { readFileSync } from 'fs';

export default function verifySignatureByPublicKey(
  data: string,
  signature: string,
  publicKeyPath: string
): boolean {
  try {
    // Load your public key
    const publicKey = readFileSync(publicKeyPath, 'utf8');

    // Create MD5 hash of the data
    const eventDataHash = createHash('md5').update(data).digest('hex');

    // Verify the signature
    const verifier = createVerify('RSA-SHA256');
    verifier.update(eventDataHash);
    return verifier.verify(publicKey, Buffer.from(signature, 'hex'));
  } catch (e) {
    console.error(e);
    return false;
  }
}
