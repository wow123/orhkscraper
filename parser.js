//var http = require("follow-redirects").http;
var https = require('https');
var cheerio = require("cheerio");
var esprima = require("esprima")
//var distance = require("./distance")
	var cuisines = ["1011^shanghai", "2001^korean", "2004^thai", "2009^japanese", "2010^mongkok"];
	var dishes = ["1001^hotpot", "1014^dessert", "1019^bbq", "1032^buffet"];
	var districts = ["1003^central","1012^aberdeen", "1019^causeway bay", "1022^wanchai"];
	var priceRanges = ["1","2", "3", "4", "5", "6"];
	var FBParamType = ["food", "location", "pricerange"]; //Must in lowercase
	var ORParamType = ["cuisineId", "dishId", "districtId", "priceRangeId"];

function start(param, response) {
	var unwanted = "FeatureItem";
	var resultLimit = 2;
	var openrice = "www.openrice.com";
	var agent = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13";

	var base = "/zh/hongkong/restaurants";
	var ORParams = split(param);
	console.log("param=", param);
	console.log("ORParams=", ORParams);
	
	if (!ORParams) {
				response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
				response.write("[]");
				response.end();
	} else {
		var queryurl = encodeURI(base + ORParams);
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

				var cnt = 0;
				$('h2[class=title-name]').each(function(i, elem){
					//console.log($(this).html());
					//title = $(this).text()
					if ($(this).html().indexOf(unwanted) == -1) {
						title = $(this).children().text();
						link = decodeURI($(this).children().attr('href'));
						//console.log(title);	
						//console.log(link);
						if (cnt < resultLimit) {
							res_arr.push({'title': title, 'link': link});
							cnt++;
						}
					}
				});
			
				response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
				response.write(JSON.stringify(res_arr));
				response.end();
			});
		});
	}
	
}

function split(param) {
	param = param.substring(1);
	var ORParams = "";
	var params = [];
	params = param.toString().split("&");
	var cnt = 0;
	for (var i in params) {
		params[i] = params[i].toString().split("=");
		if (FBParamType.indexOf(params[i][0].toLowerCase()) > -1) {
			var resParam = checkParam(params[i][0], params[i][1]);
			if (resParam.length > 0) {
				ORParams += (cnt == 0 ? "?" : "&") + resParam;	
				cnt++;
			}
		}
	}
	
	//console.log("ORParams:", ORParams);
	return ORParams;
}

function checkParam(paramType, paramValue) {
	var resParam = "";
	var found = false;

	if (paramType=="food") {
		for (var i in cuisines) {
			var cuisine = cuisines[i].toString().split("^");
			if (cuisine[1].indexOf(paramValue.toLowerCase()) > -1) {
				//console.log("cusine matched="+cuisine);
				resParam = ORParamType[0]+"="+cuisine[0];
				found = true;
				break;
			}
		}
		if (!found) {
			for (var i in dishes) {
				var dish = dishes[i].toString().split("^");
				if (dish[1].indexOf(paramValue.toLowerCase()) > -1) {
					//console.log("dishes matched="+dish);
					resParam = ORParamType[1]+"="+dish[0];
					break;
				}
			}
		}
	} else if (paramType=="location") {
		for (var i in districts) {
			var district = districts[i].toString().split("^");
			if (district[1].indexOf(paramValue.toLowerCase()) > -1) {
				//console.log("district matched="+district);
				resParam = ORParamType[2]+"="+district[0];
				break;
			}
		}
	} else if (paramType=="priceRange") {
		if (priceRanges.indexOf(paramValue) > -1) {
			resParam = ORParamType[3]+"="+paramValue;
		}
	}
	//console.log("resParam:", resParam);
	return resParam;
}

exports.start = start;
