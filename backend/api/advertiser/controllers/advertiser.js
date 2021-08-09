'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    async saveUserProfile(ctx) {

        const user = await strapi.plugins['users-permissions'].services.user.fetch({ _id: ctx.request.body.userId });
        if (user) {
            let entity;
            if (typeof user.advertisers !== 'undefined' && user.advertisers.length > 0) {
                entity = await strapi.services.advertiser.update(
                    user.advertisers[0],
                    ctx.request.body
                );
            } else {
                entity = await strapi.services.advertiser.create(ctx.request.body);
                user.advertisers.push(entity);
                await strapi.plugins['users-permissions'].services.user.edit({ id: user.id }, { advertisers: user.advertisers });
            }
            return sanitizeEntity(entity, { model: strapi.models.advertiser });
        } else {
            throw new Error('Cannot find the specified user.');
        }
    },
    async loadUserProfile(ctx) {
        const user = await strapi.plugins['users-permissions'].services.user.fetch({ _id: ctx.params.userId });
        if (user && user.advertisers && user.advertisers.length > 0) {
            return await strapi.query("advertiser").findOne({ _id: user.advertisers[0]._id }, ["media_files"]);
        } else {
            return ctx.send(null);
        }
    }

};
