// Generate AES-GCM 256-bit key and return it as a hex string
async function generateKey2() {
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  
    // Convert the key to an ArrayBuffer
    const keyBuffer = await window.crypto.subtle.exportKey("raw", key);
  
    // Convert the ArrayBuffer to a hexadecimal string
    const keyHex = Array.from(new Uint8Array(keyBuffer))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  
    return keyHex.toUpperCase();
  }
    
 
 async function encryptWithAESGCM(keyHex, plainText) {
    const keyData = hexStringToUint8Array(keyHex);
    const iv = crypto.getRandomValues(new Uint8Array(16));
  
    const importedKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
  
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      importedKey,
      strToUint8Array(plainText)
    );
  
    const cipherText = arrayBufferToHexString(encryptedData);
    const ivHex = arrayBufferToHexString(iv);

    return { cipherText, ivHex };
  }

  // Helper functions

function hexStringToUint8Array(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  }
  
  function strToUint8Array(str) {
    return new TextEncoder().encode(str);
  }
  
  function arrayBufferToHexString(buffer) {
    return Array.prototype.map
      .call(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }


  async function decrypt2(cipherText, hexKey, hexIv) {
    const key = await crypto.subtle.importKey(
      "raw",
      hexToUint8Array(hexKey),
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
  
    const iv = hexToUint8Array(hexIv);
    const encryptedData = hexToUint8Array(cipherText);
  
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encryptedData
    );
  
    const decodedText = new TextDecoder().decode(decryptedData);
  
    return decodedText;
  }

  // Function to convert a hex string to a Uint8Array
function hexToUint8Array(hexString) {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return bytes;
  }


    // Example usage
    async function executeTest() {

        debugger;
        
        const keyHex = await generateKey();
        console.log("Generated key:", keyHex);
        const message = "Hola Felipin :)!";
        console.log("Message:", message);
    
        
        encryptWithAESGCM(keyHex, message)
        .then(({ cipherText, ivHex }) => {
        console.log({ cipherText, ivHex });

        return decrypt2(cipherText, keyHex, ivHex);
        })
        .then(decryptedMessage => {
        console.log('Decrypted Message:', decryptedMessage);
        })
        .catch(error => {
        console.error('Encryption Error:', error);
        });
        
    }

   
  