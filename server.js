// server.js

var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');


//CONECTANDO AO CASSANDRA
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'twitterapp'});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        

var router = express.Router();              

router.get('/', function(req, res) {
    res.json({ message: 'API REST em NodeJs....!' });   
});

//GET para os 5 usuarios com mais seguidores
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
             msg = "Sem resultado";
         }
     }else{
		    msg = "tem erro: "+err;
	   }
     res.json({users: list});
  });
});

//GET para listagem de quantidade por tag
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
             msg = "Sem resultado";
            }
        }else{
            msg = "tem erro: "+err;
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
               msg = "Sem resultado";
              }
          }else{
              msg = "tem erro: "+err;
          }
          res.json({dayhours: list});
     });
});

app.use('/api', router);


app.listen(port);


