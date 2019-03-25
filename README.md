# pilotfreight-nodejs
Node.js library for Pilot Freight API. For now, it only contains Track method, but will have additional ones in the future.

## Installation

Install using npm. However, for now, you need to do it by adding the repository directly to your package.json file.

```
"pilotfreight-nodejs": "josh8k/pilotfreight-nodejs"
```

npm can find it on Github. But in the future, this will be added to packagist for easier install.

## Methods

- Track

Future methods:
- Rating
- Shipment
- Void
- ShipmentDocument

## Examples
```
var PilotApi = require('pilotfreight-nodejs');

// get user name and password from appropriate config store
var config = {user: 'username', 'password': 'pwd'};

// instantiate the api
var pilot = new PilotApi({user: config['user'], password: config['password']});

// include the tracking number
var trackingNumber = '082079648';

// then call the track method
pilot.track({
	trackingNumbers: [trackingNumber]
}, function(err, response) {
	if (err)
	{
		console.log("There was an error..." + JSON.stringify(err));
	}
	else
	{
		// otherwise proceed to parse the response variable
	}
});
```

## Todo
1. More Documentation
2. More Examples
3. Better Error Handling
4. More Methods

Last Update: 3-15-2019