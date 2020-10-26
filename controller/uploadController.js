"use strict";

var fs = require("fs");
var multer = require("multer");
var sharp = require("sharp");
var AppError = require("../utils/appError");
var catchAsync = require("../utils/catchAsync");
var DB = require("../utils/config");
var { v4: uuidv4 } = require("uuid");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.upload_photo = upload.single("photo"); // name of req property

exports.resize_photo = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(
      new AppError("Image not found. Please upload an image now!", 400)
    );
  } else {
    req.file.extension = req.file.mimetype.split("/")[1];
    req.file.filename = `smorfarm-upload-${uuidv4()}-${Date.now()}.${req.file.extension}`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .jpeg({ quality: 90, force: false })
      .png({ quality: 90, force: false })
      .toFile(`public/img/${req.file.filename}`);

    next();
  }
});

exports.upload_to_DB = catchAsync(async (req, res, next) => {
  // Uploads a local file to the bucket
  let image = await DB.bucket.upload(`public/img/${req.file.filename}`, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    public: true,
    resumable: false,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    destination: `${req.file.filename}`,
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: "public, max-age=31536000",
    },
  });
  //console.log(image);
  if (image) {
    let image_url = `https://storage.googleapis.com/${image[0].metadata.bucket}/${image[0].metadata.name}`;
    // delete locally saved file
    fs.unlink(`public/img/${req.file.filename}`, function (err) {
      if (err) {
        throw err;
      }
      //console.log("Successfully deleted file");
    });
    res.status(201).json({
      status: true,
      data: {
        image_url,
      },
    });
  } else {
    // delete locally saved file
    fs.unlink(`public/img/${req.file.filename}`, function (err) {
      if (err) {
        throw err;
      }
      //console.log("Successfully deleted file");
    });
    return next(new AppError("Failed to upload image. Please try again.", 400));
  }
});

exports.delete_from_DB = catchAsync(async (req, res, next) => {
    // Deletes the file from the bucket
    let filename = req.query.filename;
    let image = await DB.bucket.file(filename).delete();
    if (image) {
      res.status(200).json({
        status: true,
        message: 'Image successfully deleted'
      })
    } else {
      res.status(400).json({
        status: false,
        message: 'Failed to successfully delete image'
      })
    }
})
