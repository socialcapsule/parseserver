// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'hHYLeAzeslXXfyi5eRuk',
  masterKey: process.env.MASTER_KEY || 'UeUiyLviH8Ejb4lsLWz1', //Add your master key here. Keep it secret!
  clientKey: process.env.CLIENT_KEY || '8EV6rAgdJBwJcxeq3ULl', // Add your client key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
 emailAdapter: {
 module: 'parse-server-simple-mailgun-adapter',
 options: {
 fromAddress: process.env.EMAIL_FROM || "email-from@socialcapsule.com",
 domain: process.env.MAILGUN_DOMAIN || "example.com",
 apiKey: process.env.MAILGUN_API_KEY || "key-b3a8487041c3ea3bcbc6a57031504773",
 // Verification email subject
 verificationSubject: 'Please verify your e-mail for %socialcapsule%',
 // Verification email body
 verificationBody: 'Hi,\n\nYou are being asked to confirm the e-mail address %email% with %appname%\n\nClick here to confirm it:\n%link%',

// Password reset email subject
 passwordResetSubject: 'Password Reset Request for %socialcapsule%',
 // Password reset email body
 passwordResetBody: 'Hi,\n\nYou requested a password reset for %appname%.\n\nClick here to reset it:\n%link%',
 //OPTIONAL (will send HTML version of email):
 passwordResetBodyHTML: "<!--DOCTYPE html>........"
 }
 }
  
  
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// var server = ParseServer({
// //... your other configurations
// // here the configuration for email begins
// verifyUserEmails: true,  //depends on your needs, you can set it to false 
// emailVerifyTokenValidityDuration: 2 * 60 * 60, // in seconds (2 hours = 7200 seconds)
// preventLoginWithUnverifiedEmail: false, // defaults to false

// publicServerURL: 'https://capsulesocial.herokuapp.com/parse',
//  // Your apps name. This will appear in the subject and body of the emails that are sent.
// appName: 'socialcapsule',

// // The email adapter
// emailAdapter: {
// module: 'parse-server-simple-mailgun-adapter',
// options: {
//   // The address that your emails come from
//   fromAddress: 'parse@example.com',
//   // Your domain from mailgun.com
//   domain: 'example.com',
//   // Your API key from mailgun.com
//   apiKey: 'key-b3a8487041c3ea3bcbc6a57031504773',
//     }
//   }
// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
