var app = require('express').createServer();
var mongodb = require('mongodb');
var jade = require('jade');

function getTweets(res)
{
	var server = new mongodb.Server("127.0.0.1", 27017, {});
	new mongodb.Db('twitterarchive', server, {}).open(function (error, client) {
	if (error) throw error;
	var collection = new mongodb.Collection(client, 'archive');
	collection.find({},{'from_user':1,'created_at':1,'text':1},{sort:[['created_at','desc']]}, function(err,cursor) {
	//collection.find({},{sort:[['created_at','desc']]}, function(err,cursor) {
		cursor.toArray(function(err, items) {
		//console.log(items[0]);
		//console.log(items[1]);
		buildPage(res,items);
		})
	})
})

}

function buildPage(res,items)
{
	res.render('index.jade', {tweets:items, pageTitle:'Your Personal Twitter Archive'});
	//console.log(items[0]); // Show top entry
}

app.set ('view engine', 'jade');


app.get('/', function(req, res){
		getTweets(res);
});

app.get('*', function(req, res){
  res.send('Page not found, should be a 404 here');
});

app.listen(3000);
