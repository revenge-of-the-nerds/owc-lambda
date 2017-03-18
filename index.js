'use strict';

var http = require('http');
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
  
  
  
    // callback(null, response);
  // }

  

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
