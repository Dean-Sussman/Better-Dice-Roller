'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function rollDice(agent){

    var diceTotal = 0;
    var finalTotal = 0;
    
	for(var j = 0; j < agent.parameters.amount.length; j++){
      
		var diceSize = parseInt(agent.parameters.dice[j]);
    	var numDice = parseInt(agent.parameters.amount[j]);
     	var test = false;
      
    	for(var i = 0; i < numDice; i++){
          
			var roll = Math.floor(Math.random() * diceSize);
        	var returnValue = roll + 1;
        	diceTotal += returnValue;
          
          	if(test){
        		agent.add(`You rolled ${returnValue} on d${diceSize} number ${i + 1}.`);
            }
          
        }
      
        if(agent.parameters.modifier.length == agent.parameters.dice.length){
        	agent.add(`Your d${diceSize} total is ${diceTotal + parseInt(agent.parameters.modifier[j])}.`);
        }else{
        	agent.add(`Your d${diceSize} total is ${diceTotal}.`);
        }
      
		finalTotal += diceTotal;
        diceTotal = 0;
    }
   
    if(agent.parameters.dice.length > 1){
	    if(agent.parameters.modifier.length == 1){
    		finalTotal += parseInt(agent.parameters.modifier[0]);
    		agent.add(`Your total is ${finalTotal}.`);
  	  	}else{
    		agent.add(`Your total is ${finalTotal}.`);
  	 	}
    }
  }

	function playAudio(agent) {
		let text_to_speech = '<speak>' + '<audio src="https://actions.google.com/sounds/v1/impacts/marble_drop_and_roll.ogg"></audio>. ' + '</speak>';
		agent.tell(text_to_speech);
	}
  
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Roll', rollDice);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
