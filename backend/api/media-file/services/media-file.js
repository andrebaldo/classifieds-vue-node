"use strict";
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const sharp = require("sharp");
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async uploadFiles(files) {
    cloudinary.config({
      cloud_name: strapi.config.CLOUDINARY_CLOUD,
      api_key: strapi.config.CLOUDINARY_API_KEY,
      api_secret: strapi.config.CLOUDINARY_API_SECRET,
    });

    let uploads = [];
    for (const file of files) {
      try {
        let outputFile = file.tmpPath + "temp";
        let f = await sharp(file.tmpPath)
          .resize({ width: 600 })
          .toFile(outputFile);

        let uploadedFile = await cloudinary.uploader.upload(
          outputFile,
          { folder: `manxads/` },
          function (err, image) {
            console.log();
            console.log("** File Upload");
            if (err) {
              console.warn(err);
            }
            console.log(
              "* public_id for the uploaded image is generated by Cloudinary's service."
            );
            console.log("* " + image.public_id);
            console.log("* " + image.url);
            fs.unlinkSync(file.tmpPath);
          }
        );
        uploads.push({ name: file.name, url: uploadedFile.url });
      } catch (error) {
        fs.unlinkSync(file.tmpPath);
        console.error(error);
      }
    }

    return uploads;
  },

};
