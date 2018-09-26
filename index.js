
/**
* pilotfreight api client
**/
var RestClient = require('node-rest-client').Client;
var extend = require('extend');
var util = require('util');
var parser = require('xml2js');

function PilotFreight(args) {
  var $scope = this;
  var defaults = {
      imperial: true, // for inches/lbs, false for metric cm/kgs
      currency: 'USD',
      language: 'en-US',
      environment: 'dev',
      user: '',
      password: '',
      locationId: '',
      addressId: '',
	  controlStation: '',
	  tariffHeaderId: '',
	  apiKey: '',
      debug: false,
      pretty: false,
      user_agent: 'thneed | foo'
    };
	
	// key: value
  $scope.service_types = {	};

  $scope.config = function(args) {
    $scope.options = extend(defaults, args);
    return $scope;
  };

  
  function buildTrackingRequest(data, options, resource, callback) {
	  var httpClient = new RestClient();
	  var endpointUrl = resource.url;
	  // prep the tracking data
	  var trackingXml = '<?xml version="1.0" encoding="utf-8"?><PilotTrackingRequest><Validation><UserID>' + $scope.options.user + '</UserID><Password>' + $scope.options.password + '</Password></Validation><APIVersion>' + resource.apiVersion + '</APIVersion>';
	  
	  // then based on the tracking numbers in the data
	  for (var i = 0; i < data['trackingNumbers'].length; i++)
	  {
		  trackingXml += "<TrackingNumber>" + data['trackingNumbers'][i] + "</TrackingNumber>";
	  }
	  trackingXml += "</PilotTrackingRequest>";
	  console.log("tracking xml : " + trackingXml);
	  
	  var args = {
		  data: trackingXml,
		  headers: { "Content-Type": "application/xml" }
	  }
	  
	  /////////////
	  // then make the restful call
	  ////////////
	  httpClient.post(endpointUrl, args, function(respObj, respString) {
		  if (respObj !== undefined) {
		  	parser.parseString(respObj.toString(), function (err, result) {
		  		return callback(err, result);
		  	})
		  }
		  
	  });
  }
  
  function handleTrackingResponse(res, callback) {
    return callback(null, res);
  }
  
  var resources = {
    track: {f: buildTrackingRequest, r: handleTrackingResponse, url: 'https://www.pilotssl.com/pilotdetailpartnertracking.aspx', apiVersion: 1},
  };

  function buildResourceFunction(i, resources) {
    return function(data, options, callback) {
      if(!callback) {
        callback = options;
        options = undefined;
      }

      resources[i].f(data, options, resources[i], function(err, res) {
        if(err) {
          return callback(err, null);
        }
        resources[i].r(res, callback);
      });
    }
  }

  for(var i in resources) {
    $scope[i] = buildResourceFunction(i, resources);
  }

  return $scope.config(args);
}

module.exports = PilotFreight;