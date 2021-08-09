'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {

    async deleteCasade(adToDelete) {

        //let adToDelete = await strapi.services.advertisement.findOne({ _id: id });
        if (adToDelete) {
            for (const media of adToDelete.media_files) {
                await strapi.services["media-file"].delete({_id:media});
            }
            strapi.services.advertisement.delete(adToDelete);
            return true;
        }
        return false;
    },
    async deleteAllRobotAds() {
        let adsToDelete = await strapi.services.advertisement.find({ "SourceUrl": { $ne: null } });
        for (const iterator of adsToDelete) {
            strapi.services.advertisement.deleteCasade(iterator);
        }
    },
    async deleteAllInvalidAds() {

        const adsToDelete = await strapi.query('advertisement').model.find(
            { Title: null, Description: null }
        );
        for (const iterator of adsToDelete) {
            strapi.services.advertisement.deleteCasade(iterator);
        }

        return adsToDelete.length;
    }

};
