/* eslint
   new-cap: 0,
   func-names: 0,
   prefer-arrow-callback: 0,
   max-len: 0,
*/
'use strict';

const jsonPath = require('JSONPath').eval;
const assert = require('assert');
const request = require('request');

const RestStepsWrapper = function () {
    let lastResponse = null;

    this.When(/^I GET the "([^"]+)"$/, async function (urlpath) {
        const token = 'SharedAccessSignature 58ac24368d560a006b030003&201801030618&vza3SxXFcFFt+SPFBjEB8goDyNYWcKmdrHaS0LlMGAg+TLRFmKPnogMCbDz9i3hfvuSDse24ueWNjLvnfCYHCQ==';
        lastResponse = await sendRequest('GET', urlpath, setHeaderWithAuthToken(token));
    });

    function sendRequest (operation, path, validHeader, requestBody){
          const requestInfo = {
                url: path,
                json: requestBody,
                method: operation,
                headers: validHeader,
          }
        return new Promise((resolve, reject) => {
          console.log(requestInfo.url);
            request(requestInfo, (error, response) => {
                if (error) {
                    reject(new Error(`Error on ${operation} request to ${uri} : ${error.message}`));
                    return;
                }
                console.log(response.statusCode);
                console.log(JSON.stringify(response.body, null, 2));
                resolve(response);
            });
        });
    }

    // Check if the HTTP status code is same as the expected
    this.Then(/^the http status should be (\d+)$/, function (status) {
        if (!assertResponse(lastResponse)) { return; }
        if (lastResponse.statusCode != status) {
            assert(false, `The last http response did not have the expected status, expected ${status} but got ${lastResponse.statusCode}`);
        } else {
            assert(true);
        }
    });

    function setHeaderWithAuthToken (token) {
      return {
          'Content-Type': 'application/json',
          Connection: 'keep-alive',
          'Cache-Control': 'max-age=0',
          'If-Modified-Since': 0,
          Authorization: `${token}`,
      };
  };
};

module.exports = RestStepsWrapper;