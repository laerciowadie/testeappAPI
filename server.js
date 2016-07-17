// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');


//Connect to the cluster
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'twitterapp'});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/topfiveusers', function (req, res){
	var list = [];
	client.execute("SELECT username, userfollowers FROM topfiveusers", function (err, result) {
           if (!err){
               if ( result.rows.length > 0 ) {
                   var topUsers = result.rows;
		   i = 0;
		   for(var obj in topUsers){
			var user = topUsers[obj];
		   	list[i] = user;
			i++;
		   }
                   
               } else {
                   msg = "No results";
               }
           }else{
		msg = "tem erro: "+err;
	   }
	   res.json({users: list});
       });
});


router.get('/resumebytag', function (req, res){
	var list = [];
        client.execute("SELECT hashtag, count FROM resumebytag", function (err, result) {
           if (!err){
               if ( result.rows.length > 0 ) {
                   var resumeByTag = result.rows;
		   i = 0;
               	   for(var obj in resumeByTag){
		   	var tag = resumeByTag[obj];
			list[i] = tag;
			i++;
		   }
	       } else {
                   console.log("No results");
               }
           }
	   res.json({hashtags: list});
       });
});


router.get('/resumebydayhour', function (req, res){
        var list = [];
        client.execute("SELECT dayhour, count FROM resumebydayhour", function (err, result) {
           if (!err){
               if ( result.rows.length > 0 ) {
                   var resumeByDayHour = result.rows;
                   i = 0;
                   for(var obj in resumeByDayHour){
                        var dayhour = resumeByDayHour[obj];
                        list[i] = dayhour;
                        i++;
                   }
               } else {
                   console.log("No results");
               }
           }
           res.json({dayhours: list});
       });
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


