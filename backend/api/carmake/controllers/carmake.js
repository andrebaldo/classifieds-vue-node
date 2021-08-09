"use strict";
const importer = require("../../../database_seed/databaseImport");

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async importMakersAndModels() {
    strapi.services.carmake.importMakersAndModels();
  },
  async findMakeAndModel(ctx) {
    return strapi.services.carmake.findMakeAndModel(ctx.request.query);
  }
};
