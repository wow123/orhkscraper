//var http = require("follow-redirects").http;
var https = require('https');
var cheerio = require("cheerio");
var esprima = require("esprima")
//var distance = require("./distance")
var cuisines = ["1001^chiu chow","1002^guangdong","1005^Hakka","1008^Sichuan","1009^taiwanese","1010^beijing","1011^shanghai","1999^chinese","2001^korean","2002^vietnamese","2004^thai", "2009^japanese","2024^malaysian","2999^asian","3006^italian","4001^american"];

var dishes = ["1001^hotpot","1003^bakery","1004^noodle","1005^Ramen","1014^dessert","1018^congee","1019^bbq","1020^chinese bbq","1022^pizza","1032^buffet","1036^dim sum","1039^Wonton","1039^Dumpling","1202^sweet soup"];

var districts = ["-9151^cyberport","-9008^knutsford terrace","-9007^lan kwai fong","1002^the peak","1003^central","1007^shek o","1008^western district","1009^sai wan ho","1010^stanley","1011^admiralty","1012^aberdeen","1013^chai wan","1014^quarry bay","1015^repulse bay","1016^deep water bay","1017^happy valley","1018^shau kei wan","1019^causeway bay","1020^ap lei chau","1021^po fu lam","1022^wanchai","1023^tai koo","1023^tai koo shing","1023^tai koo place","1025^tai hang","1026^tin hau","1027^wong chuk hang","1999^Hong Kong","1999^hk","1999^hkg","2001^kowloon city","2002^kowloon tong","2003^kowloon bay","2004^to kwa wan","2005^tai kok tsui","2006^ngau tau kok","2007^shek kip mei","2008^tsim sha tsui","2009^ho man tin","2010^mong kok","2011^yau ma tei","2012^yau tong","2013^cheung sha wan","2015^hung hum","2016^lai chi kok","2019^sham shui po","2020^wong tai sin","2021^tsz wan shan","2022^san po kong","2024^lam tin","2026^kwun tong","2027^diamond hill","2028^jordan","2029^price edward","2030^lok fu","2031^mei foo","2032^choi hung","2999^kowloon","2999^all kowloon","3001^sheung shui","3002^tai po","3003^yuen long","3004^tin shui wai","3005^tuen mun","3006^sai kung","3007^sha tin","3008^fanling","3009^ma on shan","3010^sham tseng","3011^lo wu","3012^tai wai","3013^fo tan","3014^tai wo","3015^kwai fong","3016^lau fau shan","3017^tsing yi","3018^tsuen wan","3019^kwai chung","3020^tseung kwan o","3021^lok ma chau","3022^ma wan","3999^new territories","4001^lantau island","4002^chek lap kok","4003^ping chau","4004^cheung chau","4005^lamma island","4006^discovery bay","4010^tai o","4999^outlying island"];

var priceRanges = ["1","2", "3", "4", "5", "6"];
var FBParamType = ["food", "location", "pricerange"]; //Must in lowercase
var ORParamType = ["cuisineId", "dishId", "districtId", "priceRangeId"];
var missingKeyPara = true;

function start(param, response) {
	var unwanted = "FeatureItem";
	var resultLimit = 2;
	var openrice = "www.openrice.com";
	var agent = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13";

	var base = "/zh/hongkong/restaurants";
	var ORParams = split(param);
	console.log("param=", param);
	console.log("ORParams=", ORParams);
	
	if (missingKeyPara) {
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
	param = decodeURI(param.substring(1));
	var ORParams = "";
	var params = [];
	params = param.toString().split("&");
	missingKeyPara = true;
	var cnt = 0;
	for (var i in params) {
		params[i] = params[i].toString().split("=");
		if (FBParamType.indexOf(params[i][0].toLowerCase()) > -1) {
			var resParam = checkParam(params[i][0], params[i][1], false);
			if (!resParam) {
				// Remove all space and check again
				resParam = checkParam(params[i][0], params[i][1].replace(/\s/g, ""), true);
			}
			if (resParam) {
				ORParams += (cnt == 0 ? "?" : "&") + resParam;	
				cnt++;
			}
		}
	}
	
	//console.log("ORParams:", ORParams);
	return ORParams;
}

function checkParam(paramType, paramValue, noSpace) {
	//If noSpace=true, remove all space before comparison
	var resParam = "";

	if (paramType=="food") {
		for (var i in cuisines) {
			var cuisine = cuisines[i].toString().split("^");
			if (noSpace) cuisine[1] = cuisine[1].replace(/\s/g, "");
			if (cuisine[1].toLowerCase().indexOf(paramValue.toLowerCase()) > -1) {
				//console.log("cusine matched="+cuisine);
				resParam = ORParamType[0]+"="+cuisine[0];
				missingKeyPara = false;
				break;
			}
		}
		if (missingKeyPara) {
			for (var i in dishes) {
				var dish = dishes[i].toString().split("^");
				if (noSpace) dish[1] = dish[1].replace(/\s/g, "");
				if (dish[1].toLowerCase().indexOf(paramValue.toLowerCase()) > -1) {
					//console.log("dishes matched="+dish);
					resParam = ORParamType[1]+"="+dish[0];
					missingKeyPara = false;
					break;
				}
			}
		}
	} else if (paramType=="location") {
		//console.log("paramValue=",paramValue);
		for (var i in districts) {
			var district = districts[i].toString().split("^");
			//console.log("district=",district);
			if (noSpace) district[1] = district[1].replace(/\s/g, "");
			if (district[1].toLowerCase().indexOf(paramValue.toLowerCase()) > -1) {
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
