async function importKey3(keyHex) {
    const keyBytes = new Uint8Array(keyHex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    }));
  
    return await window.crypto.subtle.importKey(
      'raw',
      keyBytes,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );
  }
  async function encrypt3(key, plaintext, aad) {
    const encodedPlaintext = new TextEncoder().encode(plaintext);
  
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        additionalData: new TextEncoder().encode(aad),
        tagLength: 128
      },
      key,
      encodedPlaintext
    );
  
    const encodedCiphertext = window.btoa(String.fromCharCode.apply(null, new Uint8Array(ciphertext)));
  
    return { iv, ciphertext: encodedCiphertext };
  }
  
  async function decrypt3(key, ciphertext, aad, iv) {
    const decodedCiphertext = new Uint8Array(Array.prototype.map.call(window.atob(ciphertext), function (c) {
      return c.charCodeAt(0);
    }));
  
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        additionalData: new TextEncoder().encode(aad),
        tagLength: 128
      },
      key,
      decodedCiphertext
    );
  
    const decryptedPlaintext = new TextDecoder().decode(decryptedData);
  
    return decryptedPlaintext;
  }
  
  async function executeTest2() {
    const keyHex = '081A11AF0EFB095D86F7FA2B31F34625E9F10D39BBC7DEA16B86FE2FB17CBE23';
    const key = await importKey3(keyHex);
  
    const aad = '01959EC87A3E6A704D411F611D76851E';
    const plaintext = 'This is the secret message.';
  
    const { iv, ciphertext } = await encrypt3(key, plaintext, aad);
    const decryptedPlaintext = await decrypt3   (key, ciphertext, aad, iv);
  
    console.log('Plaintext:', plaintext);
    console.log('Ciphertext (Base64):', ciphertext);
    console.log('Decrypted:', decryptedPlaintext);
  }
  