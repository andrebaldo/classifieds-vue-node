"use strict";
const {
  importFromThirdPart,
} = require("../../../database_seed/databaseImport");
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async importMakersAndModels() {
    let data = await importFromThirdPart();
    for (let i = 0; i < data.length; i++) {
      const maker = data[i];

      let models = [];
      for (let j = 0; j < maker.car_models.length; j++) {
        const model = maker.car_models[j];
        if (model.Name.trim().length > 0 && model.ModelId.trim().length > 0) {
          var savedModel = await strapi.services.carmodel.create(model);
          models.push(savedModel);
        }
      }
      maker.carmodels = models;
      await strapi.services.carmake.create(maker);
    }

    return "ok";
  },
  async findMakeAndModel(query) {
    var regexMake = new RegExp(query.Name, "i");
    var regexModel = new RegExp(query.ModelName, "i");
    const maker = await strapi.services.carmake.findOne({
      Name: { $regex: regexMake },
    });

    if (maker) {
      let models = maker.carmodels.filter((m) => {
        return m.Name.match(regexModel) !== null;
      });
      maker.carmodels = models;
    }

    return maker;
  },
};
