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

