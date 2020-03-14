/*jshint esversion:6 */
const { net } = require("electron");

const apiRequest = (path) => {
    return new Promise((resolve, reject) => {
        const request = net.request({
            method: "GET",
            protocol: "https:",
        hostname: "ca.megabus.com",
        path: path
    });
    
    request.on("response", (response) => {
        var body = [];
        response.on("data", (chunk) => {
            body.push(chunk);
        });
        response.on("error", () => {
            reject("Network Error");
        });
        response.on("aborted", () => {
            reject("Connection aborted");
        });
        response.on("end", () => {
            resolve(JSON.parse(body.join("")));
        });
    });
    
    request.end();
    });
};

const megabusApi = {
    originCities : function() {
        return apiRequest("/journey-planner/api/origin-cities");
    },

    destinationCities : function(origin) {
        return apiRequest("/journey-planner/api/destination-cities?originCityId="+origin);
    },

    schedule: function(origin, destination) {
        return apiRequest("/journey-planner/api/schedule/"+origin+"/"+destination);
    },

    journey: function(journeyId) {
        return apiRequest("/journey-planner/api/itinerary?journeyId="+journeyId);
    }
};




// const httpsGet = (host, path) => {
//      return new Promise((resolve, reject)=> {

//         const request = net.request({
//             method: 'GET',
//             protocol: 'https:',
//             hostname: host,
//             path: path
//         });
        
        // request.on("response", (response) => {
        //     var body = [];
        //     response.on("data", (chunk) => {
        //         body.push(chunk);
        //     });
        //     response.on("error", () => {
        //         reject();
        //     });
        //     response.on("end", () => {
        //         resolve(JSON.parse(body.join("")));
        //     });
//             return body;
//         });
//         request.end();
//     }).then((body) => {
//         return body;
//     });

// };

exports.megabusApi = megabusApi;