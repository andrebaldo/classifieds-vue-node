const fs = require("fs");
const { createApolloFetch } = require("apollo-fetch");

const importDataFromFiles = async function() {
  var Makes;

  Makes = JSON.parse(fs.readFileSync("./database_seed/Makes.json", "utf8"));
  models = JSON.parse(fs.readFileSync("./database_seed/models.json", "utf8"));
  let allMakesTransformed = [];
  Makes.forEach(element => {
    let MakeModels = models.filter(model => {
      return model.MakeId === element.MakeId;
    });

    let mod = MakeModels.map(m => {
      return { Name: m.ModelName, ModelId: m.ModeId };
    });
    allMakesTransformed.push({
      MakeId: element.MakeId,
      Name: element.Name,
      car_models: mod
    });
  });

  return allMakesTransformed;
};

const importFromThirdPart = async function() {
  const fetch = createApolloFetch({
    uri: "https://www.autotrader.co.uk/at-graphql"
  });
  let allMakesTransformed = [];
  const channels = [
    "cars"
    // "vans",
    // "bikes",
    // "motorhomes",
    // "caravans",
    // "trucks",
    // "farm",
    // "plant"
  ];
  //modelsList(make:"IVECO", channel:cars)
  try {
    for (const channel of channels) {
      let q1 = `query {vehicle{makesList(channel:${channel})}}`;
      const makes = await fetch({
        query: q1
      }).catch(err => {
        console.error(err);
      });
      let tet = "";

      for (const make of makes.data.vehicle.makesList) {
        let q = `query{vehicle{modelsList(make:"${make}", channel:cars)}}`;
        const models = await fetch({
          query: q
        }).catch(err => {
          console.error(err);
        });
        if (models.data === null) {
          continue;
        }
        let mod = models.data.vehicle.modelsList.map(m => {
          return {
            Name: m,
            ModelId: m.replace(/\s/g, "")
          };
        });
        console.log(`Importing make ${make}`);
        allMakesTransformed.push({
          MakeId: make.replace(/\s/g, ""),
          Name: make,
          car_models: mod
        });
      }
    }

    return allMakesTransformed;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { importDataFromFiles, importFromThirdPart };
