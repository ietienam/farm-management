"use strict";

var multer = require("multer");
var sharp = require("sharp");
var AppError = require("../utils/appError");
var catchAsync = require("../utils/catchAsync");
var DB = require("../utils/config");
var { v4: uuidv4 } = require("uuid");
var stream = require("stream");

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
  //console.log(req.file);
  if (!req.file) {
    return next(
      new AppError("Image not found. Please upload an image now!", 400)
    );
  } else {
    req.file.extension = req.file.mimetype.split("/")[1];
    req.file.filename = `smorfarm-upload-${uuidv4()}-${Date.now()}.${
      req.file.extension
    }`;

    req.image_buffer = await sharp(req.file.buffer)
      .resize(500, 500)
      .jpeg({ quality: 90, force: false })
      .png({ quality: 90, force: false })
      .toBuffer();

    next();
  }
});

exports.upload_to_DB = catchAsync(async (req, res, next) => {
  // cheeck if the image buffer is stored from previous middleware
  if (req.image_buffer) {
    // upload photo and return url
    let upload = await new Promise((resolve, reject) => {
      var bufferStream = new stream.PassThrough();
      bufferStream.end(new Buffer.from(req.image_buffer));
      // save file to bucket
      let file = DB.bucket.file(req.file.filename);
      let contentType = req.file.mimetype;
      bufferStream
        .pipe(
          file.createWriteStream({
            resumable: false,
            gzip: true,
            public: true,
            metadata: {
              contentType,
            },
          })
        )
        .on("error", (err) => {
          console.log(err);
          reject(`Unable to upload image, something went wrong`);
        })
        .on("finish", function () {
          // The file upload is complete.
          const publicUrl = `https://storage.googleapis.com/${file.metadata.bucket}/${file.metadata.name}`;
          resolve(publicUrl);
        });
    });
    res.status(201).json({
      status: true,
      data: {
        image_url: upload,
      },
    });
  } else {
    return next(new AppError("Failed to upload image. Please try again!", 400));
  }
});

exports.delete_from_DB = catchAsync(async (req, res, next) => {
  // Deletes the file from the bucket
  let filename = req.query.filename;
  let image = await DB.bucket.file(filename).delete();
  if (image) {
    res.status(200).json({
      status: true,
      message: "Image successfully deleted",
    });
  } else {
    return next(new AppError("Failed to successfully delete image", 400));
  }
});
