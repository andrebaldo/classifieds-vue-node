'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const request = require("request-promise");
const cheerio = require("cheerio");

const fields = [
    { fieldOrigin: "Make", fieldDest: "Make" },
    { fieldOrigin: "Model", fieldDest: "Model" },
    { fieldOrigin: "Model Variant", fieldDest: "ModelVariant" },
    { fieldOrigin: "Category", fieldDest: "Category" },
    { fieldOrigin: "Colour", fieldDest: "Colour" },
    { fieldOrigin: "Cubic Capacity (cc)", fieldDest: "EngineCC" },
    { fieldOrigin: "Fuel", fieldDest: "Fuel" },
    {
        fieldOrigin: "Date of First Registration",
        fieldDest: "DateOfFirstRegistration",
        fieldType: "Date",
    },
    {
        fieldOrigin: "Previous Registration Number (UK only)",
        fieldDest: "UKRegistration",
    },
    {
        fieldOrigin: "Date of First Registration on IOM",
        fieldDest: "DateFirstRegistrationIOM",
        fieldType: "Date",
    },
    { fieldOrigin: "Wheel Plan", fieldDest: "WheelPlan" },
    {
        fieldOrigin: "Status of Vehicle Licence (Tax)",
        fieldDest: "LicenceStatus",
    },
    {
        fieldOrigin: "Expiry Date of Vehicle Licence (Tax)",
        fieldDest: "LicenceExpiresOn",
        fieldType: "Date",
    },
];

module.exports = {
    async getVehicleRegistrationDetails(registration) {
        const result = await request.get(
            `https://services.gov.im/vehicles-driving/vehicle-search/results?RegMarkNo=${registration}`
        );
        const $ = cheerio.load(result);
        let vehicleData = {};
        $("body > div > div > table > tbody > tr").each((index, element) => {
            let field = fields.filter((item) => {
                return (
                    item.fieldOrigin.toLowerCase() ===
                    $(element).children("th").text().toLowerCase()
                );
            });
            if (field.length === 1) {
                if (typeof field[0].fieldType !== "undefined") {
                    switch (field[0].fieldType) {
                        case "Date":
                            let dateString = $(element).children("td").text();
                            const dateArray = dateString.split("/");
                            if (dateArray.length === 3) {
                                vehicleData[
                                    field[0].fieldDest
                                ] = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`; //new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`).toISOString();
                            } else {
                                vehicleData[field[0].fieldDest] = null;
                            }
                            break;

                        default:
                            break;
                    }
                } else {
                    vehicleData[field[0].fieldDest] = $(element).children("td").text();
                }
            }
        });
        if (typeof vehicleData.Make !== "undefined") {
            vehicleData.Registration = registration;
            var regexMake = new RegExp(vehicleData.Make, "i");
            const Make = await strapi.services.carmake.findOne({
                Name: { $regex: regexMake },
            });
            if (typeof Make !== "undefined") {
                const model = Make.carmodels.filter(
                    (m) => m.Name.toLowerCase() === vehicleData.Model.toLowerCase()
                );
                if (model.length === 0) {
                    const savedModel = await strapi.services.carmodel.create({
                        ModelId: vehicleData.Model,
                        Name: vehicleData.Model,
                    });
                    Make.carmodels.push(savedModel);
                    strapi.services.carmake.update({ _id: Make._id }, Make);
                }
            }
            return vehicleData;
        } else {
            return null;
        }
    }
};
