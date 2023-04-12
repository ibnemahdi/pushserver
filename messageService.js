const https = require('https');
const { google } = require('googleapis');
var meme = require('./memes');
const { faker } = require('@faker-js/faker');


//Project id here
const PROJECT_ID = 'gppushtest-e4aaf'; 
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

function getAccessToken() {
    return new Promise(function(resolve, reject) {
      //Service Account private key file
      const key = require('./serviceaccount.json'); 
      const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        SCOPES,
        null
      );
      jwtClient.authorize(function(err, tokens) {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
  }
  module.exports= {
    sendFcmMessage: function(token, type, delay=0) {
        getAccessToken().then(function(accessToken) {
          const options = {
            hostname: HOST,
            path: PATH,
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          }; 
          let message = {};
          if(type === 'meme'){
            message = buildMemeMessage(token);
          }else{
              message = buildCommonMessage(token);
          }
          const request = https.request(options, function(resp) {
            resp.setEncoding('utf8');
            resp.on('data', function(data) {
              console.log('Message sent to Firebase for delivery, response:');
              console.log(data);
            });
          });
      
          request.on('error', function(err) {
            console.log('Unable to send message to Firebase');
            console.log(err);
          });
      
          request.write(JSON.stringify(message));
          request.end();
        });
      }
    }
  


  function buildMemeMessage(token){
    var memepic = meme.memes()[Math.floor(Math.random()*meme.memes().length)];
    const customData = 
    {
        "messageType":"meme"
    }
    return {
      'message': {
        'token': token,
        'notification': {
          'title': 'Meme Notification',
          'body': 'Do you like the meme?, Press [like 👍] otherwise press [dislike 👎]',
          'image': memepic,
          },
          'data':customData,
          'webpush':{
            "notification":{
                "actions":[
                {
                  "action": "like-action",
                  "title": "like 👍",
                  "type": "button"
                },
                {
                  "action": "dislike-action",
                  "title": "dislike 👎",
                  "type": "button"
                },
                ]

          }
      }
    }
    }


  }
  function buildCommonMessage(token) {

  const name =   faker.name.fullName();
  const orderId = faker.address.zipCode('####');
  const customData = 
  {
       "messageType":"order",
       "order":orderId,
       "assigned_by":name
  }

    return {
      'message': {
        'token': token,
        
        'notification': {
          'title': 'A new Order has been assigned to you',
          'body': `${name} from ${faker.name.jobArea()} assigned a new order:${orderId}, Job location is ${faker.address.streetAddress()}. Please email him ${faker.internet.email()} in case of any questions.`,
          },
          'data':customData
          
    }
    }
  }

  function delay(t, v) {
    return new Promise(resolve => setTimeout(resolve, t, v));
}

  //const commonMessage = buildCommonMessage();
  //console.log('FCM request body for message using common notification object:');
  ///console.log(JSON.stringify(commonMessage, null, 2));
  //sendFcmMessage(buildCommonMessage());
  //console.log(this.sendFcmMessage("cvQw1_cvAC8JrikfkHiNDw:APA91bGnfSd08rbTD-s4IXY06EIDIoTcQVdDgk6tfBWky1zdu1aq6jEDe8VNXgCSUaQpH0d5PPRU-WrhJc_1Tu34XCUKRMVrBxU3I1rf3bwQ7nqj1ZZg_alrcatF4ZwPiSsN_Dh2h6if","meme"));
  //return delay(1000).then(function() {
  //  return   sendFcmMessage(buildCommonMessage());
//});

  