//var http = require("follow-redirects").http;
var https = require('https');
var cheerio = require("cheerio");
var esprima = require("esprima");
//var distance = require("./distance");
var cuisines = require("./cuisines");
var dishes = require("./dishes");
var districts = require("./districts");

var priceRanges = ["1", "2", "3", "4", "5", "6"];
var FBParamType = ["food", "location", "pricerange"]; //Must be in lowercase
var ORParamType = ["cuisineId", "dishId", "districtId", "priceRangeId"];
var missingKeyParam = true;  //Key params are cuisineId, dishId

function start(param, response) {
	var agent = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13";
  var unwanted = "FeatureItem";
  var resultLimit = 2;
  var openrice = "www.openrice.com";
  var base = "/zh/hongkong/restaurants";
  var ORParams = split(param);
  console.log("param=", param);
  console.log("ORParams=", ORParams);

  if (missingKeyParam) {
		//Return nothing if key parameter is missing
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });
    response.write("[]");
    response.end();

  } else {
		//Scrape openrice if key parameter exists
    var queryurl = encodeURI(base + ORParams);
    console.log("queryurl=" + queryurl);
    var options = {
      host: openrice,
      headers: {
        "User-Agent": agent
      },
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
				//Look for <h2 class="title-name"> which marks the search results
        $('h2[class=title-name]').each(function(i, elem) {
          //console.log($(this).html());
          //title = $(this).text()
          if ($(this).html().indexOf(unwanted) == -1) {
            title = $(this).children().text();
            link = decodeURI($(this).children().attr('href'));
            //console.log(title);
            //console.log(link);
						//Only get the top <resultLimit> number of restaurants
            if (cnt < resultLimit) {
              res_arr.push({
                'title': title,
                'link': link
              });
              cnt++;
            }
          }
        });

        response.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8"
        });
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
  missingKeyParam = true;
  var cnt = 0;
  for (var i in params) {
    params[i] = params[i].toString().split("="); //split param name & value
    if (FBParamType.indexOf(params[i][0].toLowerCase()) > -1) {
      var resParam = checkParam(params[i][0], params[i][1], false);
      if (!resParam) {
        //Remove all space and check again
        resParam = checkParam(params[i][0], params[i][1].replace(/\s/g, ""), true);
      }
      if (resParam) {
				//Concate the result param together
        ORParams += (cnt == 0 ? "?" : "&") + resParam;
        cnt++;
      }
    }
  }

  //console.log("ORParams:", ORParams);
  return ORParams;
}

function checkParam(paramType, paramValue, noSpace) {
	//Check if the raw param (eg. Hotpot) matched with any openrice param and
	//get the openrice code (eg. "1001" for hotpot).
	//The openrice param name and value will be return (eg. dishId=1001).
  //If noSpace=true, remove all space before comparison
  var resParam = "";

  if (paramType == "food") {
    for (var i in cuisines) {
      var cuisine = cuisines[i].toString().split("^");
      if (noSpace) cuisine[1] = cuisine[1].replace(/\s/g, "");
      if (cuisine[1].toLowerCase().indexOf(paramValue.toLowerCase()) > -1) {
        //console.log("cusine matched="+cuisine);
        resParam = ORParamType[0] + "=" + cuisine[0];
        missingKeyParam = false;
        break;
      }
    }
    if (missingKeyParam) {
      for (var i in dishes) {
        var dish = dishes[i].toString().split("^");
        if (noSpace) dish[1] = dish[1].replace(/\s/g, "");
        if (dish[1].toLowerCase().indexOf(paramValue.toLowerCase()) > -1) {
          //console.log("dishes matched="+dish);
          resParam = ORParamType[1] + "=" + dish[0];
          missingKeyParam = false;
          break;
        }
      }
    }
  } else if (paramType == "location") {
    //console.log("paramValue=",paramValue);
    for (var i in districts) {
      var district = districts[i].toString().split("^");
      //console.log("district=",district);
      if (noSpace) district[1] = district[1].replace(/\s/g, "");
      if (district[1].toLowerCase().indexOf(paramValue.toLowerCase()) > -1) {
        //console.log("district matched="+district);
        resParam = ORParamType[2] + "=" + district[0];
        break;
      }
    }
  } else if (paramType == "priceRange") {
    if (priceRanges.indexOf(paramValue) > -1) {
      resParam = ORParamType[3] + "=" + paramValue;
    }
  }
  //console.log("resParam:", resParam);
  return resParam;
}

exports.start = start;
