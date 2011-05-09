// Personal Twitter Archive Gathered
// Created by Ewan Leith

var sys = require('sys'),
	async = require('async'),
    rest = require('restler');

var mongodb = require('mongodb');

var username="ewantoo";

function printTweet(tweetdata) {
	var server = new mongodb.Server("127.0.0.1", 27017, {});
	new mongodb.Db('twitterarchive', server, {}).open(function (error, client) {
  	if (error) throw error;
  	var collection = new mongodb.Collection(client, 'archive');
	//console.log([tweetdata][0]); //Output logged data to console
	var d1 = new Date([tweetdata][0]['created_at']);
	[tweetdata][0]['created_at']=d1;
	//console.log([tweetdata][0]['created_at']); //Output logged data to console
	//collection.insert([tweetdata][0],function(err) {
    collection.update([tweetdata][0],[tweetdata][0],{upsert:true}, function(err) {
    if (err)
	{
		console.warn(err.message);
		console.log('Error :'+[tweetdata][0]); //Output logged data to console
		server.close();
	}
	else
	{
		//console.log([tweetdata][0]); //Output logged data to console
		server.close();
	}
  	});
});


}


function launchCollect() {
	rest.get('http://search.twitter.com/search.json?q='+username, {  headers: { 'User-Agent': 'Personal Twitter Archive', 'Referer': 'https://github.com/ewanleith/Personal-Twitter-Archive' }}).on('success', function(data) {
		async.forEach(data['results'], printTweet, function(err) {
		});
	});
	rest.get('http://search.twitter.com/search.json?q=+from%3A'+username, {  headers: { 'User-Agent': 'Personal Twitter Archive', 'Referer': 'https://github.com/ewanleith/Personal-Twitter-Archive' }}).on('success', function(data) {
		async.forEach(data['results'], printTweet, function(err) {
		});
	});
	//setTimeout(launchCollect, 60000);
    console.log('Looping'); //Output logged data to console

}

setInterval(launchCollect, 60000);
