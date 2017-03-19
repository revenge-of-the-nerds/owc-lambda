'use strict';

var http = require('http');
var cheerio = require('cheerio');
var baseUrl = "http://ws.petango.com/webservices/adoptablesearch/wsAdoptableAnimalDetails.aspx?id="
var url = {
  cats: 'http://ws.petango.com/webservices/adoptablesearch/wsAdoptableAnimals.aspx?species=Cat&sex=A&agegroup=All&onhold=A&orderby=ID&colnum=3&AuthKey=srx1fd0hqaa8hw78rv752eypne2t6bykvf0u8do2b2hvkkvrf7',
  dogs: 'http://ws.petango.com/webservices/adoptablesearch/wsAdoptableAnimals.aspx?species=Dog&sex=A&agegroup=All&onhold=A&orderby=ID&colnum=3&AuthKey=srx1fd0hqaa8hw78rv752eypne2t6bykvf0u8do2b2hvkkvrf7'
}

var Pet = function(petCell, $){
  var $petCell = $(petCell);
  this.id = $petCell.find(".list-animal-id").text(),
  this.image_url = $petCell.find(".list-animal-photo").attr("src"),
  this.name = $petCell.find(".list-animal-name").text(),
  this.species = $petCell.find(".list-anima-species").text(),
  this.sex = $petCell.find(".list-animal-sexSN").text(),
  this.breed = $petCell.find(".list-animal-breed").text(),
  this.age = $petCell.find(".list-animal-age").text();
}

var parseDetails = function($){
  var name = $("#lbName").text()

  if ($("#ImageAltered").attr("src") == "images/GreenCheck.JPG") {
    var spayedNeutered = "true"
  } else {
    var spayedNeutered = "false"
  }

  if ($("ImageNoKids").attr("src") == "images/GreenCheck.JPG") {
    var noKids = "true"
  } else {
    var spayedNeutered = "false"
  }


  var $plPhotos = $("#plPhotos").find("a").not("#lnkVideo")
  var photosArray = [];
  for (var i = 0; i < $plPhotos.length; i ++) {
    var img = $($plPhotos[i])
    photosArray.push(img.attr("href"))
  }


  return {
    name: $("#lbName").text(),
    id: $("#lblID").text(),
    breed: $("#lbBreed").text(),
    age: $("#lbAge").text(),
    sex: $("#lbSex").text(),
    size: $("#lblSize").text(),
    color: $("#lblColor").text(),
    spayedNeutered: spayedNeutered,
    declawed: $("#lbDeclawed").text(),
    housetrained: $("#lbHousetrained").text(),
    noKids: noKids,
    intakeDate: $("#lblIntakeDate").text(),
    apotionPrice: $("#lbPrice").text(),
    story: $("#lbDescription").text(),
    images: photosArray,
    video: $("#lnkVideo").attr("href")
  };
}
  
function parsePets(body, $){
  var petCells = $('td').toArray();
  var petArray = petCells.map(function(obj){ return new Pet(obj, $);});
  if (petArray.length == 0 || petArray == undefined || petArray[0] == undefined || petArray[0].id == undefined || petArray[0].id == ""){
    return {
      statusCode: 200,
      headers: { 'contentType' : "application/json", 'Access-Control-Allow-Origin': '*' },
      body: body
    };
  } else {
    return {
      statusCode: 200,
      headers: { 'contentType' : "application/json", 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({type: "json" ,response:petArray})
    };
  }
}


module.exports.handler = (event, context, callback) => {

  var eventPath = event.path
  console.log(event)
  var route = eventPath.substring(6, 10);
  var petId = eventPath.substring(11, eventPath.length);

  if (petId.length < 2) {
    http.get(url[route], function(res){
      var body = '';  
      res.on('data', function(data){
        body += data;
      });

      res.on('end', function(){
        var $ = cheerio.load(body)
        console.log('Works?');
        var response = parsePets(body, $);
        callback(null, response);
      });  
      
      res.on('error', function(e){
        console.log("Didn't work");
        context.done(null, 'FAILURE');
      })
    
    })
  } else {
    console.log(baseUrl.concat(petId));
    http.get(baseUrl.concat(petId), function(res){
      var body = '';  
      res.on('data', function(data){
        body += data;
      });

      res.on('end', function(){
        var $ = cheerio.load(body)
        console.log('Works?');
        var details = parseDetails($);
        console.log(details)
        var response = {
          statusCode: 200,
          headers: { 'contentType' : "application/json", 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({type: "json", response: details})
        }
        callback(null, response);
      });  
      
      res.on('error', function(e){
        console.log("Didn't work");
        context.done(null, 'FAILURE');
      })
    
    })
  }
};
