"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  upinsert: async (ctx) => {
    let savedEntity;
    var b = ctx.request.body;
    if (!b.DateOfFirstRegistration) delete b.DateOfFirstRegistration;
    if (!b.DateFirstRegistrationIOM) delete b.DateFirstRegistrationIOM;
    if (!b.LicenceExpiresOn) delete b.LicenceExpiresOn;

    if (typeof ctx.request.body._id !== "undefined" && ctx.request.body._id.length > 0) {
      savedEntity = await strapi.services["car-advertisement"].update(
        { _id: ctx.request.body._id },
        ctx.request.body
      );
    } else {
      savedEntity = await strapi.services["car-advertisement"].create(
        ctx.request.body
      );
    }
    return ctx.send(savedEntity);
  },
};
