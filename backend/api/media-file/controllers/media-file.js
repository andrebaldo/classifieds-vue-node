"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async upload(ctx) {
    const uploadService = strapi.plugins.upload.services.upload;
    const config = await uploadService.getConfig();
    const { refId, ref, fieldName, filesToEdit } = ctx.request.body || {};
    const { files = null } = ctx.request.files || null;
    let resultFiles = [];
    if (files !== null || (Array.isArray(files) && files.length > 0)) {
      // Transform stream files to buffer
      const buffers = await uploadService.bufferize(files);
      const enhancedFiles = buffers.map((file) => {
        if (file.size > config.sizeLimit) {
          return ctx.badRequest(null, [
            {
              messages: [
                {
                  id: "Upload.status.sizeLimit",
                  message: `${file.name} file is bigger than limit size!`,
                  values: { file: file.name },
                },
              ],
            },
          ]);
        }
        return file;
      });

      // Something is wrong (size limit)...
      if (ctx.status === 400) {
        return;
      }
      const uploadedFiles = await strapi.services["media-file"].uploadFiles(
        enhancedFiles
      );
      resultFiles.push(uploadedFiles);
      let savedFiles = [];
      for (const file of uploadedFiles) {
        savedFiles.push(
          await strapi.services["media-file"].create({
            name: file.name,
            url: file.url,
          })
        );
      }

      if (
        typeof ref !== "undefined" &&
        typeof refId !== "undefined" &&
        typeof fieldName !== "undefined"
      ) {
        var entityFound = await strapi.services[ref].findOne({ _id: refId });
        if (entityFound) {
          //entityFound[fieldName] = savedFiles;
          let updateObject = {};
          if (Array.isArray(entityFound[fieldName])) {
            updateObject[fieldName] = entityFound[fieldName];
            for (const file of savedFiles) {
              updateObject[fieldName].push(file);
            }
          } else {
            updateObject[fieldName] = savedFiles;
          }

          let saved = await strapi.services[ref].update(
            { _id: refId },
            updateObject
          );
        }
      }
    }
    let editFilesArray = [];
    if (filesToEdit) {
      editFilesArray = JSON.parse(filesToEdit);
      resultFiles.push(editFilesArray);
    }
    if (Array.isArray(editFilesArray) && editFilesArray.length > 0) {
      for (const f of editFilesArray) {
        strapi.services["media-file"].update({ _id: f._id }, { DisplayOrder: f.DisplayOrder });
      }
    }
    
    ctx.response.status = 202;
    ctx.send(editFilesArray);
  },
};
