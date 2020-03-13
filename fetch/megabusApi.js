/*jshint esversion:6 */
const { net } = require("electron");



const httpsGet = (host, path) => {
     return new Promise((resolve, reject)=> {

        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: host,
            path: path
        });
        
        request.on("response", (response) => {
            var body = [];
            response.on("data", (chunk) => {
                body.push(chunk);
            });
            response.on("error", () => {
                reject();
            });
            response.on("end", () => {
                resolve(JSON.parse(body.join("")));
            });
            return body;
        });
        request.end();
    }).then((body) => {
        return body;
    });

};

exports.httpsGet = httpsGet;