'use strict';

var http = require('http');
var cheerio = require('cheerio')
var url = 'http://ws.petango.com/webservices/adoptablesearch/wsAdoptableAnimals.aspx?species=Cat&sex=A&agegroup=All&onhold=A&orderby=ID&colnum=3&AuthKey=srx1fd0hqaa8hw78rv752eypne2t6bykvf0u8do2b2hvkkvrf7'

module.exports.handler = (event, context, callback) => {
  
  // const response = {
  //   statusCode: 200,
    
    
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     input: event,
  //   }),
  
  // };
  
  http.get(url, function(res){
    var body = '';  
    res.on('data', function(data){
      body += data;
    });

    res.on('end', function(){
      console.log('Works?');
      callback(null, body);
    });  
    
    res.on('error', function(e){
      console.log("Didn't work");
      context.done(null, 'FAILURE');
    })
  
  })
  
var Pet = function(petCell){
  var $petCell = $(petCell);
  this.id = $petCell.find(".list-animal-id").text(),
  this.image_url = $petCell.find(".list-animal-photo").attr("src"),
  this.name = $petCell.find(".list-animal-name").text(),
  this.species = $petCell.find(".list-anima-species").text(),
  this.sex = $petCell.find(".list-animal-sexSN").text(),
  this.breed = $petCell.find(".list-animal-breed").text(),
  this.age = $petCell.find(".list-animal-age").text();
}
  
function parsePets(body){
  var $ = cheerio.load(body)
  var petCells = $('td').toArray();
  petArray = petCells.map(function(obj){ return new Pet(obj);});
  return JSON.stringify(petArray);
}



    // callback(null, response);
  // }

  

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
