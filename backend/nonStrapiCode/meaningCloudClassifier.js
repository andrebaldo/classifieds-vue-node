
var https = require('follow-redirects').https;
var fs = require('fs');
const meaningcloudKey = process.env.MEANING_CLOUD_KEY || '551b3e22f669e3228ae12c5322c7235f';
const meaningCloudClassifierModel = 'ItemsForSale_en';


var tryToGetCategoryByDescription = function (description) {

    return new Promise(function (resolve, reject) {
        var options = {
            'method': 'POST',
            'hostname': 'api.meaningcloud.com',
            'path': `/class-2.0?key=${meaningcloudKey}&txt=${encodeURIComponent(description)}&model=${meaningCloudClassifierModel}`,
            'headers': {
            },
            'maxRedirects': 20
        };

        var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                var result = Buffer.from(body);
                if(result){
                    resolve(result.toString('utf-8'));
                }else{
                    resolve();
                }
                
            });

            res.on("error", function (error) {
                reject(error);
            });
        });

        req.end();

    });
}

module.exports = { tryToGetCategoryByDescription };
