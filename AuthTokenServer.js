/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Jim Awe		2014
// Updated by Denis Grigor	2016
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////

var https = require("https");
var express = require("express");
var credentials = require("./credentials").credentials;

var app = express();

// Call the Autodesk authentication API to get a token based on client_id and client_secret.
// When a response is received, it is forwarded to the browser-based app that called for a token.

function getAuthCode(mainResponse, baseUrl, clientId, clientSecret) {
	var dataString = "client_id=" + clientId + "&client_secret=" + clientSecret + "&grant_type=client_credentials";

    var headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };

	var options = {
  		host: baseUrl,
  		port: 443,
  		path: "/authentication/v1/authenticate",
  		method: "POST",
  		headers: headers
	};

	var req = https.request(options, function(res) {
  		res.setEncoding("utf8");
  		var responseString = "";

  		res.on("data", function (data) {
    		responseString += data;
  		});

  		res.on("end", function() {
            console.log(responseString);
            mainResponse.setHeader('Content-Type', 'application/json');
            mainResponse.setHeader('Access-Control-Allow-Origin', '*');
            mainResponse.send(responseString);  // forward our response onto the original call from the browser app
    	});
    });

    req.write(dataString);
    req.end();
}

// these are the URLs the browser based app will send to get the token. You may have several environments and you
// can send one appropriate for the given environment.
// If you only have keys for the PRODUCTION environment, then just replace them in credentials.js file,
// otherwise you can specify different credential files or several credentials in the same file.

app.get("/auth", function(req, res) {
    console.log("AuthTokenServer: getting PRODUCTION token...");
        // ***** PUT YOUR PRODUCTION KEYS INTO CREDENTIALS.JS FILE *****
    getAuthCode(res, "developer.api.autodesk.com", credentials.client_id, credentials.client_secret);
});

//TIP: If you have several environments, you can set here the route for other environment like below:
// app.get("/auth-stg", function(req, res) {
//     console.log("AuthTokenServer: getting STAGING token...");
//         // ***** PUT YOUR STAGING KEYS HERE *****
//     getAuthCode(res, "developer-stg.api.autodesk.com", credentials.client_id, credentials.client_secret);
// });

// test route to make sure everything is working
app.get("/", function(req, res) {
    res.send("I'm alive!");
});

var listener = app.listen(process.env.PORT || 5000, function(){
	console.log("Server started on port "+ listener.address().port);
});

