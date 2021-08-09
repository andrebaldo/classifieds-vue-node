'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {


      async saveUserProfile(params, data) {
        const entry = await strapi.query('advertiser').update(params, data);
    
        if (files) {
          // automatically uploads the files based on the entry and the model
          await strapi.entityService.uploadFiles(entry, files, {
            model: strapi.models.restaurant,
          });
          return this.findOne({ id: entry.id });
        }
    
        return entry;
      },
};
