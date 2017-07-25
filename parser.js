//var http = require("follow-redirects").http;
var https = require('https');
var cheerio = require("cheerio");
var esprima = require("esprima")
var async = require("async")
//var distance = require("./distance")

function start(param, response) {
	params = split(param);
	var keyword = params.length == 2 ? false : true;

	var openrice = "www.openrice.com";
	var agent = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13";

	var base = "/zh/hongkong/restaurants";
//	var suffix = "&z=10&wxh=5x5&currentlocation=1";
//	var queryurl = "cuisineId=2009&districtId=2008";
	var queryurl = "";
	

/*
	if(!keyword) {
		// only x and y
		queryurl = base + "x=" + params[0][1] + "&y=" + params[1][1] + suffix;
	} else {
		// x, y, keyword
		queryurl = base + "x=" + params[0][1] + "&y=" + params[1][1] + suffix + "&inputstrwhat=" + params[2][1];
	}
*/

	queryurl = encodeURI(base + param);

	console.log("queryurl="+queryurl);
	var options = {
		host: openrice,
		headers: {"User-Agent": agent },
		path: queryurl
	}
	
	https.get(options, function(result) {
		result.setEncoding('utf-8');
		var data = "";
		result.on("data", function(chunk) {
			data += chunk;
		});

		result.on("end", function() {
			var $ = cheerio.load(data);
			//console.log($.html());

			var res_arr = [];

			//console.log($('h2[class=title-name]').html());
			//var title = $('h2').filter('.title-name').attr('class');
			$('h2[class=title-name]').each(function(i, elem){
				//console.log($(this).html());
				//title = $(this).text()
				title = $(this).children().text();
				link = decodeURI($(this).children().attr('href'));
				console.log(title);	
				console.log(link);
				res_arr.push({'title': title, 'link': link});
			});
			
			response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
//			response.write(JSON.stringify(res_arr));
			response.write(res_arr[0].title+","+res_arr[0].link));
			response.end();

/*			
			$("title-wrapper").each(function() {
				console.log("title-wrapper")
				var link = $(this).children(".ib").children(".sr1_poi_title").children(".sr1_title");
				var text = link.text();
				var href = link.attr("href");
				
				var img = $(this).children(".sr1_content").children(".PR10").children(".rel_pos").children("a").children(".sr1_doorphoto");
				var src = img.attr("style");
				src = src.substring(15, src.length-2);

				var add = $(this).children(".sr1_content").children("div.FL").children("div.sr1_data").children("div.ML5").first().text()
				var address = add.replace(/(<([^>]+)>)/ig,"").substring(2, add.length-20);

				res_arr.push({ 'name': text, 'link': href, 'img': src, 'address': address });
			});

			async.each(res_arr, function(restaurant, callback) {
				href = restaurant.link;
				var option = {
					host: openrice,
					headers: {"User-Agent": agent },
					path: href
				}

				https.get(option, function(result) {
					var data = ""
					result.on("data", function(chunk){
						data += chunk;
					});

					result.on("end", function() {
						var $$ = cheerio.load(data);

						restaurant.score = parseFloat($$(".rest_overall_score").children("span").text());

						var coords = esprima.parse($$(".pg_main > script").first().text());
						restaurant.x = coords.body[0].expression.right.value;
						restaurant.y = coords.body[1].expression.right.value;

						restaurant.distance = distance.calculateDistance(params[0][1], params[1][1], restaurant.x, restaurant.y, 4);

						callback();
					});
				});
			}, function (err) {
				if(err) return next(err);

				response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
				response.write(JSON.stringify(res_arr));
				response.end();
			});
*/
		});
	});
}

function split(param) {
	param = param.substring(1);
	var params = [];
	var regex = /^x\=22\.[0-9]*\&y\=11[3-4]\.[0-9]*$/;
	var regex2 = /^x\=22\.[0-9]*\&y\=11[3-4]\.[0-9]*\&keyword\=([A-Za-z ]|%20)*$/

	if(regex.test(param)) {
		params = param.toString().split("&");
		params[0] = params[0].toString().split("=");
		params[1] = params[1].toString().split("=");
	} else if(regex2.test(param)) {
		params = param.toString().split("&");
		params[0] = params[0].toString().split("=");
		params[1] = params[1].toString().split("=");
		params[2] = params[2].toString().split("=");
	}

	return params;
}

exports.start = start;
