// test.js
// On importe compactDecrypt et non plus jwtDecrypt
import { SignJWT, CompactEncrypt, compactDecrypt, jwtVerify } from 'jose';

const SIGNATURE_SECRET_TEST = new TextEncoder().encode('thisIsMySuperSecretSignatureKey123');
const ENCRYPTION_SECRET_TEST = new TextEncoder().encode('azertyuiopqsdfghjklmwxcvbn123456');

// --- 1. FONCTION DE CRÉATION (INCHANGÉE, ELLE ÉTAIT CORRECTE) ---
async function createToken() {
  console.log('--- ÉTAPE 1: CRÉATION DU TOKEN ---');
  const payload = { user: { id: 123, name: 'Test User' } };
  
  const signedJwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SIGNATURE_SECRET_TEST);
  console.log('JWS interne créé.');

  const jwePayload = { payload: signedJwt };
  const plaintextToEncrypt = new TextEncoder().encode(JSON.stringify(jwePayload));

  const jwe = await new CompactEncrypt(plaintextToEncrypt)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(ENCRYPTION_SECRET_TEST);

  console.log('JWE externe créé avec CompactEncrypt.');
  return jwe;
}

// --- 2. FONCTION DE VÉRIFICATION (AVEC LA CORRECTION FINALE) ---
async function verifyToken(token) {
    console.log('\n--- ÉTAPE 2: VÉRIFICATION DU TOKEN ---');
    console.log('Token reçu pour vérification:', token);
    try {
        // **LA CORRECTION FINALE EST ICI : On utilise compactDecrypt**
        const { plaintext } = await compactDecrypt(token, ENCRYPTION_SECRET_TEST);

        console.log('\n✅ SUCCÈS : Déchiffrement réussi !');
        const decryptedJson = new TextDecoder().decode(plaintext);
        console.log('Payload déchiffré (JSON brut):', decryptedJson);
        
        const internalPayloadObject = JSON.parse(decryptedJson);
        const signedJwt = internalPayloadObject.payload;

        const { payload } = await jwtVerify(
            signedJwt,
            SIGNATURE_SECRET_TEST,
            { algorithms: ['HS256'] }
        );
        
        console.log('\n✅ SUCCÈS : Vérification du JWS interne réussie !');
        console.log('Payload final extrait:', payload);
        return payload.user;

    } catch (error) {
        console.error('\n❌ ERREUR LORS DE LA VÉRIFICATION:');
        console.error('Nom:', error.name);
        console.error('Code:', error.code);
        console.error('Message:', error.message);
    }
}

// --- 3. EXÉCUTION DU TEST ---
async function runTest() {
  const myToken = await createToken();
  await verifyToken(myToken);
}

runTest();