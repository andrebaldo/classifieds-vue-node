'use strict';
const lodash = require("lodash")
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    async create(ctx) {
        let data = ctx.request.body;
        if (!data.ad_id || !data.sender_id || !data.message)
            return;

        // Check of the user exists
        let user = await strapi.plugins['users-permissions'].services.user.fetch({ _id: data.sender_id });
        if (!user)
            return;

        let ad = await strapi.services.advertisement.findOne({ _id: data.ad_id });
        if (!ad)
            return;
        
        let adUser = await strapi.plugins['users-permissions'].services.user.fetch({ _id: ad.advertiser.user._id });
        
        let emailTemplate = await strapi.services["email-template"].findOne({ Name: 'user-to-user-message-mail' });

        lodash.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
        let compiled = lodash.template(emailTemplate.HtmlTemplate);
        

        let templateObject = {
            adTitle:ad.Title,
            adLink:data.link,
            senderEmail:user.email,
            senderMessage:data.message
        }



        await strapi.plugins['email'].services.email.send({
            to: adUser.email,
            from: user.email,
            subject: ad.Title,
            html: compiled(templateObject),
        });

        let message = {
            Message : compiled(templateObject),
            SenderEmail : user.email,
            AdvertiserEmail: adUser.email,
        }

        return await strapi.services["message-advertisement"].create(message);
    }

};
