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

  async function importHexKey(hexKey) {
    const keyData = hexToArrayBuffer(hexKey);
  
    const importedKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  
    return importedKey;
  }
  
  function hexToArrayBuffer(hexString) {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      const byte = parseInt(hexString.substr(i, 2), 16);
      bytes[i / 2] = byte;
    }
    return bytes.buffer;
  }

//-----------------------| INPUTS LOGIC|-----------------------//

async function generateAndSetKey(){
    const key = await generateKey();
    const keyHex = arrayBufferToHex(await window.crypto.subtle.exportKey('raw', key));

    const keyInput = document.getElementById("key");
    keyInput.value = keyHex;

    console.log("Generated Key: ", keyHex);
}

async function generateAndSetIV(){
    const iv = generateIV();
    const ivHex = arrayBufferToHex(iv);

    const ivInput = document.getElementById("iv");
    ivInput.value = ivHex;

    console.log("Generated IV: ", ivHex);
}

async function encryptInput() {

    if (document.getElementById("originalString").value == "" || document.getElementById("key").value == "" || document.getElementById("iv").value == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a valid string to encrypt or/and a key',
            })
        return;
    }

    try {
        const originalString = document.getElementById("originalString").value;
        const key = document.getElementById("key").value;
        const iv = document.getElementById("iv").value;

       if (key.length != 64) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid key',
                })
            return;
        }

        const cryptoKey = await importHexKey(key);
        const encryptedData = await encryptData(originalString, cryptoKey, hexToArrayBuffer(iv));        
        console.log('Encrypted Data:', encryptedData);

        focusResult("1");
        document.getElementById("encryptedText").value = encryptedData;

    }
    catch (error) {
        console.error("Encryption error: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Encryption error: ' + error,
            })
    }

}

async function decryptInput() {

    if (document.getElementById("encryptedText2").value == "" || document.getElementById("key2").value == "" || document.getElementById("authenticationTag2").value == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a string to decrypt /  key / authentication tag',
            })
        return;
    }

    try {

        const ciphertext = document.getElementById("encryptedText2").value;
        const key = document.getElementById("key2").value;
        const iv = document.getElementById("authenticationTag2").value;

        if (key.length != 64) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid key',
                })
            return;
        }
        const cryptoKey = await importHexKey(key);
        const encryptedData = await decryptData(ciphertext, cryptoKey, hexToArrayBuffer(iv));
        focusResult("2");
        document.getElementById("decryptedText").value = encryptedData;
    }
    catch (error) {
        console.error("Decryption error: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Decryption error: ' + error,
            })
    }
}


function focusResult( typeResult) {
   
    if (typeResult == "1") {

    const resultDiv = document.getElementById("resultDiv");
    resultDiv.style.border = "1px solid #08f888";
    
    setTimeout(function () {
        resultDiv.style.border = "1px solid #ccc";
    }, 3000);

    } else if (typeResult == "2") {
        const resultDiv2 = document.getElementById("resultDiv2");
        resultDiv2.style.border = "1px solid #08f888";
        
        setTimeout(function () {
            resultDiv2.style.border = "1px solid #ccc";
        }, 3000);
    }

}