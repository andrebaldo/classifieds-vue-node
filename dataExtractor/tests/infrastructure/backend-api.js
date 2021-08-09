const request = require('request');
const prod = true;

module.exports = {
    // Function for downloading file using HTTP.get
    sendDataToServer : async function (data) {
        return new Promise((resolve, reject) => {
            let url = "http://localhost:1337/advertisements/upsertBulk";
            if (prod) {
                url = 'https://automanxbe.herokuapp.com/advertisements/upsertBulk';
            }


            if (Array.isArray(data)) {
                data = data.filter(p => p.postedAt);
            }

            request.post({
                headers: { 'content-type': 'application/json' },
                url: url,
                body: JSON.stringify(data)
            }, function (error, response, body) {
                console.log(error);
                //console.log(response);
                //console.log(body);
            });
        });
    }
}