'use strict';

var http = require('http');
var cheerio = require('cheerio');
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

  var route = event.path.substring(6,10);

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
};
