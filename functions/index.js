const functions = require("firebase-functions");
const crypto = require('crypto');
const {generateKeyPairSync} =crypto;
const { faker } = require('@faker-js/faker');
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
exports.Genkey = functions.https.onCall((data, context) => {
    functions.logger.info("Genkey logs!", {structuredData: true});
    try{

        const { publicKey, privateKey } = generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
              type: "pkcs1",
              format: "pem",
            },
            privateKeyEncoding: {
              type: "pkcs1",
              format: "pem",
            },
          });
          console.log("successfully generated key ");
          return {publicKey ,privateKey}
        
        }catch(err){
        console.log(err)
        return {"error":err}
        }
  });

exports.GenAESkey = functions.https.onCall((data, context) => {
    functions.logger.info("Genkey logs!", {structuredData: true});
    try{

      var sharedSecret = crypto.randomBytes(8); // 128-bits === 16-bytes

      var textSecret = sharedSecret.toString('hex');
          return {"AES":textSecret}
        
        }catch(err){
        console.log(err)
        return {"error":err}
        }
  });



  exports.EncrypGroupKeys = functions.https.onCall(async (data, context) => { // this function takes the participants object and their pk and encrypt the aes key for each one of them and returns it as an object
    functions.logger.info("Genkey logs!", {structuredData: true});
    try{
      const {roomAESkey,participants} =data //participants is the map object from the selected participants in creategroup and the aes key
      const Aeskeys = {}
      const success=  await Promise.all(Array.from(participants.values()).map(async (user)=>{
        const encryptedAESkey = await EncryptAESkey(user.RSApublicKey ,roomAESkey )
        Aeskeys[user.email] = encryptedAESkey
        })
      )
      if(success){
        return Aeskeys
      }
      

        
        }catch(err){
        console.log(err)
        return {"error":err}
        }
  });




  async function EncryptAESkey(contactedUserPK,roomAESkey){//function to encrypt the AES key using RSA
  
    const encryptedAESkey = await new Promise((resolve,reject)=>{
      try{
  
        const data = roomAESkey
        const publicKey = contactedUserPK
        console.log('printing the public key :')
        console.log(publicKey)
        const encryptedData = crypto.publicEncrypt(
          {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          // We convert the data string to a buffer using `Buffer.from`
          Buffer.from(data)
        );
        
        // The encrypted data is in the form of bytes, so we print it in base64 format
        // so that it's displayed in a more readable form
        //console.log("encypted data: ", encryptedData.toString("base64")); 
  
           const encryptedAESkey = encryptedData.toString("base64")// that string represent the encrypted data we save in the database
           console.log("successfully encrypted the key")
           
           resolve(encryptedAESkey)
      }catch(err){
        console.log('encryption failed')
        reject(err);
      }
  
  
  
    })
  
    return encryptedAESkey
  
  }