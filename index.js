'use strict';

var http = require('http');
var cheerio = require('cheerio')
var url = 'http://ws.petango.com/webservices/adoptablesearch/wsAdoptableAnimals.aspx?species=Cat&sex=A&agegroup=All&onhold=A&orderby=ID&colnum=3&AuthKey=srx1fd0hqaa8hw78rv752eypne2t6bykvf0u8do2b2hvkkvrf7';

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
  return {
    statusCode: 200,
    headers: { contentType: "application/json" },
    body: JSON.stringify(petArray)
  };
}

module.exports.handler = (event, context, callback) => {
  
  http.get(url, function(res){
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
