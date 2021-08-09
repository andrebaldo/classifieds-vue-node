
'use strict'
//require('array.prototype.flatmap').shim();
var serverAddress = process.env.ELASTIC_SEARCH_SERVER;
const { Client } = require('@elastic/elasticsearch');
serverAddress = 'https://k8ncd4jumi:8xumci5b2z@automanx-4465441662.eu-central-1.bonsaisearch.net';
const client = new Client({ node: serverAddress });

module.exports = {

    async createIndexBulk(indexName, data, createIndexIfNotExists) {

        if (createIndexIfNotExists) {
            await client.indices.create({
                index: indexName,
            }, { ignore: [400] })
        }

        let mapped = data.map((d) => {

            if (!d.Title) {
                strapi.log.debug(`Item without title going into search index id:${d._id}`);
            }else{
                strapi.log.debug(`Item going into search index id:${d._id} Title:${d.Title}`);
            }

            return {
                id: d.id,
                index: indexName,
                body: {
                    title: d.Title,
                    description: d.Description,
                    date: d.SourceUrl ? d.SourceCreatedAt : d.createdAt,
                }
            }
        });

        const body = mapped.flatMap(doc => [{ index: { _index: indexName } }, doc]);
        return client.bulk({ refresh: true, body });
    },
    searchIndex(index, stringTerms) {
        return client.search({
            index: index,
            body: {
                "query": {
                    "query_string": {
                        "query": stringTerms
                    }
                }
            }
        });
    },

    async deleteAllIndex(index) {
        return client.indices.exists({ index: index });
    },

    async upsertAdvertisementIndex(data) {

        const adIndex = 'advertisement';

        if (!data._id)
            return;

        let existentDoc = await client.search({
            index: adIndex,
            body: {
                "query": {
                    "bool": {
                        "must": [
                            { "match": { "_id": data.id } }
                        ]
                    }
                }
            }
        });
        let theBody = {
            id: data.id,
            index: adIndex,
            body: {
                doc: {
                    title: data.Title,
                    description: data.Description
                }
            }
        };

        if (existentDoc.body.hits.total.value === 1) {

            let update = await client.update(theBody).catch((error) => {

                console.log(error);
            });
        } else {
            let create = await client.create(theBody).catch((error) => {

                console.log(error);
            });
        }
    }
};
