var app = require('express').createServer();
var Db = require('mongodb').Db,
	connect = require('mongodb').connect;
var jade = require('jade');
var sys = require('sys'),
    async = require('async'),
    rest = require('restler');


var env;

var username="ewantoo";
if(undefined===process.env.VCAP_SERVICES){
	var mongourl = "mongo://127.0.0.1:27017/twitterarchive";	
}
else
{
	env =JSON.parse(process.env.VCAP_SERVICES);
	var mongo = env['mongodb-1.8'][0]['credentials'];
	var mongourl = "mongo://" + mongo.username + ":" + mongo.password + "@" + mongo.hostname + ":" + mongo.port + "/" + mongo.db + "?auto_reconnect=true";
	//console.log (env);
}


console.log(mongourl);

var port = Number(process.env.VCAP_APP_PORT || 3000),
    host = process.env.VCAP_APP_HOST || 'localhost';


function getTweets(res)
{

	//console.log(mongourl);
	connect(mongourl, function (error, client) {

	if (error) throw error;
	client.collection('archive', function (err,collection) {
		if (err) throw err;
		collection.find({},{'id_str':1,'from_user':1,'created_at':1,'text':1},{sort:[['created_at','desc']]}, function(err,cursor) {
			//console.log(cursor);
			if (err) throw err;
			cursor.toArray(function(err, items) {
				if (err) throw err;
				//console.log(items[0]);
				//console.log(items[1]);
				buildPage(res,items);
				client.close();
			})
		})
	})
})


}

function buildPage(res,items)
{
	var pagetitle=username+'\'s personal Twitter archive'
	//res.render('index.jade', {tweets:items, pageTitle:'Your Personal Twitter Archive'});
	res.render('index.jade', {tweets:items, pageTitle:pagetitle});
	//console.log(items[0]); // Show top entry
}

app.set ('view engine', 'jade');


app.get('/', function(req, res){
		getTweets(res);
});

app.get('*', function(req, res){
  res.send('Page not found, should be a 404 here');
});


function printTweet(tweetdata) {
    connect(mongourl, function (error, client) {
    	if (error) throw error;
    	client.collection('archive', function (err,collection) {
        	if (err) throw err;
			//console.log([tweetdata][0]); //Output logged data to console
			var d1 = new Date([tweetdata][0]['created_at']);
			[tweetdata][0]['created_at']=d1;
			//console.log([tweetdata][0]['created_at']); //Output logged data to console
			//console.log([tweetdata][0]); //Output logged data to console
			//collection.insert([tweetdata][0],function(err) {
    		collection.update([tweetdata][0],[tweetdata][0],{upsert:true}, function(err) {
    			if (err)
				{
					console.warn(err.message);
					console.log('Error :'+[tweetdata][0]); //Output logged data to console
					client.close();
				}
				else
				{
					//console.log([tweetdata][0]); //Output logged data to console
					client.close();
				}
  			});
		});
	})
}


function launchCollect() {
	rest.get('http://search.twitter.com/search.json?q='+username, {  headers: { 'User-Agent': 'Personal Twitter Archive', 'Referer': 'https://github.com/ewanleith/Personal-Twitter-Archive' }}).on('complete', function(data,response) {
		if (response.statusCode == 200)
		{
			async.forEach(data['results'], printTweet, function(err) { })
		}
	}).on('error', function(err) {
		console.warn(err);
	});



	rest.get('http://search.twitter.com/search.json?q=+from%3A'+username, {  headers: { 'User-Agent': 'Personal Twitter Archive', 'Referer': 'https://github.com/ewanleith/Personal-Twitter-Archive' }}).on('complete', function(data,response) {
		if (response.statusCode == 200)
		{
			async.forEach(data['results'], printTweet, function(err) { })
		}
	}).on('error', function(err) {
        console.warn(err);
    });

    //console.log('Looping'); //Output logged data to console

}

setInterval(launchCollect, 300000);
//setInterval(launchCollect, 60000);
app.listen(port);
