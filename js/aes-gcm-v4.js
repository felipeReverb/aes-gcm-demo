
  async function generateKey() {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    return key;
  }

  // Function to generate a random 128-bit IV (Initialization Vector)
  function generateIV() {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    return iv;
  }

  // Function to convert an ArrayBuffer to a hexadecimal string
  function arrayBufferToHex(buffer) {
    const hexCodes = [];
    const view = new Uint8Array(buffer);
    for (let i = 0; i < view.length; i++) {
      const value = view[i];
      const stringValue = value.toString(16);
      const paddedValue = ('00' + stringValue).slice(-2);
      hexCodes.push(paddedValue);
    }
    return hexCodes.join('');
  }

  // Function to convert a hexadecimal string to an ArrayBuffer
  function hexToArrayBuffer(hexString) {
    const matchedPairs = hexString.match(/[\da-f]{2}/gi);
    const byteNumbers = matchedPairs.map((pair) => parseInt(pair, 16));
    const buffer = new Uint8Array(byteNumbers);
    return buffer;
  }

  // Function to convert an ArrayBuffer to a Base64 string
  function arrayBufferToBase64(buffer) {
    const base64Codes = [];
    const view = new Uint8Array(buffer);
    for (let i = 0; i < view.length; i++) {
      base64Codes.push(String.fromCharCode(view[i]));
    }
    return btoa(base64Codes.join(''));
  }

  // Function to convert a Base64 string to an ArrayBuffer
  function base64ToArrayBuffer(base64String) {
    const binaryString = atob(base64String);
    const byteNumbers = new Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteNumbers[i] = binaryString.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  }

  // Encryption function
  async function encryptData(data, key, iv) {
    const encodedData = new TextEncoder().encode(data);
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encodedData
    );
    return arrayBufferToBase64(encryptedData);
  }

  // Decryption function
  async function decryptData(encryptedData, key, iv) {
    const encodedEncryptedData = base64ToArrayBuffer(encryptedData);
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encodedEncryptedData
    );
    return new TextDecoder().decode(decryptedData);
  }

  // Generate a random key and IV
  async function generateRandomKeyAndIV() {
    const key = await generateKey();
    const iv = generateIV();
    return { key, iv };
  }

async function executeTest3() {
  
  const { key, iv } = await generateRandomKeyAndIV();
  const keyHex = arrayBufferToHex(await window.crypto.subtle.exportKey('raw', key));
  console.log('Key:', keyHex);
  console.log('IV:', arrayBufferToHex(iv));

  const data = 'Hola guapo  que crees??!!';

  const encryptedData = await encryptData(data, key, iv);
  console.log('Encrypted Data:', encryptedData);

  const decryptedData = await decryptData(encryptedData, key, iv);
  console.log('Decrypted Data:', decryptedData);
}
