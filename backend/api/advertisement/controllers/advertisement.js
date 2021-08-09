"use strict";
const { sanitizeEntity } = require('strapi-utils');
const {axios} = require('axios');

var moment = require('moment');
var geoip = require('geoip-lite');
const elasticsearchModule = require('../../../nonStrapiCode/elasticSearchService');

const meaningCloudClassifier = require('../../../nonStrapiCode/meaningCloudClassifier')


/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

var createFeedElastiSearchIndices = async function () {
  // Get all the advertisements from the database
  let total = await strapi.services.advertisement.count();
  //568 / 100 
  let chunkSize = 100;
  let times = total / chunkSize;
  let lastChunk = total % chunkSize;
  let advertisements = [];

  for (let i = 0; i < times; i++) {
    if (i < times - 1)
      advertisements = await strapi.services.advertisement.find({ _limit: 100, _start: i * chunkSize });
    else
      advertisements = await strapi.services.advertisement.find({ _limit: lastChunk, _start: i * chunkSize });

    await elasticsearchModule.createIndexBulk("advertisement", advertisements, i === 0);

  }
  return "ok";
  //return ctx.response;
};

module.exports = {
  async searchVehicleRegistration(ctx) {
    let registration = ctx.params.vehicleRegistration.substring(0, 9);
    let result = strapi.services["car-advertisement"].getVehicleRegistrationDetails(registration);
    if (result) {
      return result;
    } else {
      ctx.response.status = 404;
      return {
        message:
          "Vehicle registration not found, please fill out the form manually.",
        status: 404,
      };
    }
  },
  async updateCategory(ctx) {
    let foundEntity = await strapi.services.advertisement.findOne({
      _id: ctx.request.body._id,
    });

    if (foundEntity !== null) {
      if(!foundEntity.advertisement_category){
        let savedEntity = await strapi.services.advertisement.update(
          { _id: ctx.request.body._id },
          { advertisement_category: ctx.request.body.advertisement_category }
        );
        return ctx.send(savedEntity);
      }
    }

    return ctx.send({});
  },
  async upinsert(ctx) {
    let savedEntity;
    // User can't set the status
    ctx.request.body.Status = "Published";
    if (
      typeof ctx.request.body._id !== "undefined" &&
      ctx.request.body._id !== null &&
      ctx.request.body._id.length > 0
    ) {
      let foundEntity = await strapi.services.advertisement.findOne({
        _id: ctx.request.body._id,
      });

      if (foundEntity !== null) {

        let userAdvertisers = await strapi.services.advertiser.find({ user: ctx.state.user });
        let advertiserId = typeof ctx.request.body.advertiser === "object" ? ctx.request.body.advertiser._id : ctx.request.body.advertiser;
        let seletctedAdvertiser = userAdvertisers.filter(a => a.id === advertiserId);

        if (seletctedAdvertiser.length === 0) {
          return ctx.response.status = 404;
        }

        savedEntity = await strapi.services.advertisement.update(
          { _id: ctx.request.body._id },
          ctx.request.body
        );
      } else {
        savedEntity = await strapi.services.advertisement.create(
          ctx.request.body
        );
      }
    } else {
      savedEntity = await strapi.services.advertisement.create(
        ctx.request.body
      );
    }

    //elasticsearchModule.upsertAdvertisementIndex(savedEntity);

    return ctx.send(savedEntity);
  },
  async find(ctx) {
    //Limit the results by country
    var geo = geoip.lookup(ctx.request.header["x-forwarded-for"]);
    let permitedCountriesConfig = await strapi.services["app-configuration"].findOne({ Key: "permitedCountries" });
    if (permitedCountriesConfig && permitedCountriesConfig.Value) {
      let permitedCountries = JSON.parse(permitedCountriesConfig.Value);
      if (Array.isArray(permitedCountries)) {
        if (ctx.request.hostname !== "localhost" && (geo === null || !permitedCountries.includes(geo.country))) {
          strapi.log.debug(`Request denied by country ${geo.country}`);
          ctx.request.query.SourceUrl = { $exists: false };
        }
      }
    }


    if (ctx.state.user) {
      if (ctx.request.query.Status === undefined) {
        ctx.request.query.Status = { $in: ["Deleted", "WaitingPublication", "Published"] };
      }
    } else {
      ctx.request.query.Status = "Published";
    }

    // // Elastic search
    // let idsFound = [];
    // if (typeof ctx.request.query.searchTerm !== "undefined" && ctx.request.query.searchTerm.trim().length > 0) {
    //   let elasticFoundItems = await elasticsearchModule.searchIndex("advertisement", ctx.request.query.searchTerm);
    //   if (elasticFoundItems && elasticFoundItems.body.hits.total.value > 0) {
    //     idsFound = elasticFoundItems.body.hits.hits.map(doc => doc._source.id);
    //   }
    //   // filter the ids found by elasticSearch
    //   ctx.request.query.id = { $in: idsFound };
    // }
    // delete (ctx.request.query.searchTerm);


    if (ctx.request.query.searchTerm) {

      let searchTerm = ctx.request.query.searchTerm.trim();
      if (searchTerm.length === 24) { // tests for ids
        ctx.request.query.id = searchTerm;
      } else {
        var regexSearch = new RegExp(searchTerm, "gi");
        var idsFound = await strapi.query('advertisement').model.find({
          $or: [
            { $text: { $search: searchTerm } },
            { 'Title': regexSearch }
          ]
        }, ["id"]);

        ctx.request.query.id = { $in: idsFound };
      }
    }
    delete (ctx.request.query.searchTerm);


    let foundItems = [];

    if (ctx.request.query.advertisement_category_in && ctx.request.query.advertisement_category_in.find(c => c === "uncategorised")) {
      delete ctx.request.query.advertisement_category_in;
      ctx.request.query.advertisement_category_null = true;
      foundItems = await strapi.query('advertisement').find(ctx.request.query, ['advertiser', 'media_files', 'car_advertisement'])
    } else {
      foundItems = await strapi.query('advertisement').find(ctx.request.query, ['advertiser', 'media_files', 'car_advertisement']);
    }

    let fullAds = foundItems.map(entity => {
      const r = sanitizeEntity(entity, {
        model: strapi.models.advertisement,
      });

      if (r.SourceUrl) {
        r.createdAt = r.SourceCreatedAt;
      }

      r.media_files = r.media_files.sort((a, b) => a.DisplayOrder - b.DisplayOrder);

      return r;
    });

    for (const entity of fullAds) {
      if (Array.isArray(entity.advertiser.media_files) && entity.advertiser.media_files.length > 0) {

        let firstFile = await strapi.services["media-file"].findOne({ _id: entity.advertiser.media_files[0] });
        if (firstFile) {
          entity.advertiser.media_files[0] = { url: firstFile.url };
        }
      }
    }

    function removeFieldsFromObject(plainData, fields) {

      if (typeof plainData !== "object") {
        return;
      }

      Object.keys(plainData).reduce((acc, key) => {
        if (plainData[key] !== null) {
          if (Array.isArray(plainData[key])) {
            removeFieldsFromObject(plainData[key], fields)
          } else {
            for (const f of fields) {
              if (plainData[key].hasOwnProperty(f)) {
                delete plainData[key][f];
              }
            }
            if (typeof plainData[key] === "object") {
              removeFieldsFromObject(plainData[key], fields);
            }
          }
          return acc;
        }

      }, {});

    }

    let ttt = removeFieldsFromObject(fullAds, ["updatedAt", "__v"]);

    return fullAds
    //return await strapi.services.advertisement.find(ctx.request.query, ["media_files", "advertiser", "advertiser.media_files"]);
  },
  async upsertBulk(ctx) {


    let advertisements = ctx.request.body;

    // Get advertiser
    let botUser = await strapi.plugins["users-permissions"].services.user.fetch({ email: "bot@automanx.com" });
    if (!botUser) {
      botUser = await strapi.plugins["users-permissions"].services.user.add({
        email: "bot@automanx.com",
        username: "bot",
        password: "tatu galinha 23",
        provider: "local"
      });
    }

    // Create profile
    let advertiser = await strapi.services.advertiser.findOne({
      user: botUser
    });
    if (!advertiser) {
      advertiser = await strapi.services.advertiser.create({
        DisplayName: "Auto Bot",
        user: botUser
      });
    }    

    //let fileStreamCounter = 0;
    for (const ad of advertisements) {

      // Clear price to get only numbers
      let price = !ad.price ? null : ad.price.replace(/[^0-9]/g, "");
      //console.log(price);
      if (price === "" || price === null)
        price = null;
      else
        price = parseFloat(price);
      let postDate = null;
      if (ad.postedAt) {

        postDate = moment(ad.postedAt).add(8, 'hours').format();

      }

      let adModel = {
        Title: ad.title ? ad.title.trim() : null,
        Description: ad.desc ? ad.desc.trim() : null,
        Price: price,
        SourceUrl: ad.permalink ? ad.permalink.trim() : null,
        SourceCreatedAt: postDate,
        createdAt: postDate ? postDate : null,
        Status: "Published",
        advertiser: advertiser,
      }

      if (!adModel.Title && !adModel.Description || !adModel.SourceUrl || !ad.pictures || ad.pictures.length === 0) {
        strapi.log.info(`Invalid ad:${ad.permalink}`);
        continue;
      }

      if (adModel.Title !== null && typeof adModel.Title !== "undefined" && (adModel.Title.toLowerCase().indexOf("wanted") >= 0 || adModel.Title.toLowerCase().indexOf("looking") >= 0)) {
        strapi.log.info(`Invalid ad permalink:${ad.permalink}`);
        continue;
      }
      let existent = await strapi.services.advertisement.findOne(
        { $or: [{ SourceUrl: adModel.SourceUrl }, { Description: adModel.Description, Title: adModel.Title }] }
      );

      var classificationResult = await meaningCloudClassifier.tryToGetCategoryByDescription(adModel.Description);
      if (existent) {

        
        //adModel.id = existent.id;
        //adModel._id = existent._id;
        existent.Title = adModel.Title;
        existent.Description = adModel.Description;
        //await strapi.services.advertisement.update(adModel);
        strapi.log.info(`Updating ad Title:${adModel.Title} Description:${adModel.Description}`);
        await strapi.services.advertisement.update({ _id: existent.id }, existent);
        continue;
      }
      let foundItem = await strapi.services.advertisement.findOne(
        { SourceUrl: adModel.SourceUrl }
      );
      if (foundItem) {
        let soldRegex = new RegExp("SOLD", "gim");
        if (adModel.Title.search(soldRegex) > -1) {
          foundItem.Status = "DeletedForever";
          
          await strapi.services.advertisement.update({ _id: foundItem.id }, foundItem);
          continue;
        }

        let pedingRegex = new RegExp("\(PENDING\)", "gim");
        if (adModel.Title.search(pedingRegex) > -1) {
          foundItem.Status = "DeletedForever";
          
          await strapi.services.advertisement.update({ _id: foundItem.id }, foundItem);
          continue;
        }
      }

      // Save main advertisement
      strapi.log.info(`Creating ad Title:${adModel.Title} Description:${adModel.Description}`);
      let savedEntity = await strapi.services.advertisement.create(
        adModel
      );

      if (savedEntity) {
        //Save pictures
        let savedFiles = [];
        for (const file of ad.pictures) {
          // Save files links on db
          savedFiles.push(
            await strapi.services["media-file"].create({
              name: "",
              url: file,
            })
          );

        }

        let ref = "advertisement", fieldName = "media_files";
        let refId = savedEntity._id;
        var entityFound = await strapi.services[ref].findOne({ _id: refId });
        if (entityFound) {
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

    return ctx.response;
  },
  async deleteAll(ctx) {
    var deletedCount = await strapi.services.advertisement.deleteAllInvalidAds();
  },
  async createAvertisementIndex(ctx) {
    try {
      await elasticsearchModule.deleteAllIndex("advertisement");
    } catch (error) {

    }

    await createFeedElastiSearchIndices();
    return "ok";
    //return ctx.response;
  },
  async autocompleteTitle(ctx) {
    //Limit the results by country
    var geo = geoip.lookup(ctx.request.header["x-forwarded-for"]);

    let permitedCountries = ["IM", "UK"];
    if (ctx.request.hostname !== "localhost" && (geo === null || !permitedCountries.includes(geo.country))) {
      strapi.log.debug(`Request denied by country ${geo.country}`);
      ctx.request.query.SourceUrl = { $exists: false };
    }


    if (ctx.request.query.searchTerm) {
      var itemsFound = await strapi.query('advertisement').find({
        'Title_contains': ctx.request.query.searchTerm.trim(),
        "_limit": 10
      });

      return itemsFound;
    }

    return [];
  }

  // async searchAdvertisements(ctx) {

  //   let foundItems = await searchIndex("advertisement", ctx.request.body.searchTerm);
  //   if (foundItems && foundItems.body.hits.total.value > 0) {
  //     let idsFound = foundItems.body.hits.hits.map(doc => doc._source.id);
  //     return strapi.services.advertisement.find({ id: { $in: idsFound } });
  //   }
  //   return {};
  // }
};