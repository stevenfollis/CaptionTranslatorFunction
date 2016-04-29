// Dependencies
var request = require('request');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var builder = new xml2js.Builder();

// Configure Bing Translate
var bt = require('./node_modules/bing-translate/lib/bing-translate.js').init({
  client_id: process.env.BING_TRANSLATE_API_CLIENT_ID,
  client_secret: process.env.BING_TRANSLATE_API_CLIENT_SECRET
});

// Define a variable to hold the parsed XML
var parsedXml;

module.exports = function (context, data) {

  context.log('Webhook was triggered!');

  // TODO: Make this dyanamic. Currently a hard coded, publically accessible blob for use as an example
  var url = 'https://sfcaptioner.blob.core.windows.net/asset-f3f2ebd4-2dd7-40e0-9d21-4ec4f9136811/DataIsTheNewElectricity.mp4.ttml';

  // 1. Get the file from the URL
  getFile(url, function (originalXml) {

    context.log('1. Received file');

    // 2. Parse the XML into JSON and retrieve the phrases
    parseXml(originalXml, function (phrases) {

      context.log('2. Parsed XML into phrases');

      // 3. Translate phrases via the Bing Translate API
      translatePhrases(phrases, function (translatedPhrases) {

        context.log('3. Translated phrases');

        // 4. Create new TTML file
        updateXml(translatedPhrases, function (newXml) {

          context.log('4. Generated new XML');

          // 5. Export the new XML to the output binding
          context.done(null, {
            outputBlob: newXml
          });

        });

      });

    });

  });

  function getFile(url, callback) {

    // Use the request library to retrieve the file
    request(url, function (error, response, body) {

      callback(body);

    });

  }

  function parseXml(xml, callback) {

    // Parse XML file into an object
    parser.parseString(xml, function (error, result) {

      if (!error) {

        // Store the XML
        parsedXml = result;

        // Pull phrases out of the parsed object
        var phrases = parsedXml.tt.body[0].div[0].p;

        // Pass phrases for processing
        callback(phrases);

      }
      else {
        context.log('Failed to parse the XML File: ' + error);
        context.done(error);
      }

    });

  }

  function translatePhrases(phrases, callback) {

    // Define variables to hold translated value & a counter
    var translatedValues = [];
    var counter = 0;

    // Loop through each phrase
    phrases.forEach(function (phrase, i) {

      // Translate the text value
      bt.translate(phrase._, 'en', 'es', function (err, res) {

        // Override the English text
        phrase._ = res.translated_text;

        // Store the translated text in its same index spot
        translatedValues[i] = phrase;

        // Check if translations are finished
        counter += 1;
        if (counter === phrases.length) {

          // Return translated values when loop is finished
          callback(translatedValues);

        }

      });

    });

  }

  function updateXml(translatedPhrases, callback) {

    // Update the original XML with the new values
    parsedXml.tt.body[0].div[0].p = translatedPhrases;

    // Build from object back to XML
    var newXml = builder.buildObject(parsedXml);

    callback(newXml);

  }

};