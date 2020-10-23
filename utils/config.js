var Admin = require("firebase-admin");
var path = require("path");
var googleStorage = require("@google-cloud/storage");
var serviceAccount = require("../serviceAccountKey.json");

Admin.initializeApp({
  credential: Admin.credential.cert(serviceAccount),
  databaseURL: "https://mini-netflix-33f78.firebaseio.com",
});

const storage = new googleStorage.Storage({
  projectId: "mini-netflix-33f78",
  keyFilename: path.join(__dirname, "../serviceAccountKey.json"),
});

const bucket = storage.bucket("mini-netflix-33f78.appspot.com");

module.exports = {
  bucket
};
