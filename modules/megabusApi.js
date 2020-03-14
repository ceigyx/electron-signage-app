/*jshint esversion:6 */
const { net } = require("electron");

const apiRequest = (path) => {
    return new Promise((resolve, reject) => {
        const request = net.request({
            method: "GET",
            protocol: "https:",
        hostname: "ca.megabus.com",
        path: "/journey-planner/api/" + path
    });
    request.on("error", (error) => {
        reject(error);
    });

    request.on("aborted", () => {
        reject("Request aborted");
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
        return apiRequest("origin-cities");
    },

    destinationCities : function(origin) {
        return apiRequest("destination-cities?originCityId="+origin);
    },

    schedule: function(origin, destination) {
        return apiRequest("schedule/"+origin+"/"+destination);
    },

    journey: function(journeyId) {
        return apiRequest("itinerary?journeyId="+journeyId);
    }
};

exports.megabusApi = megabusApi;