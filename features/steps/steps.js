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

    // Check if a certain property of the response is equal to something
    this.Then(/^(?:the )?([\w_.$\[\]]+) should equal "([^"]+)"$/, function (key, expectedValue, callback) {
        if (!assertPropertyIs(lastResponse, key, expectedValue, callback)) { return; }
        callback();
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

  function assertResponse(lastResponse) {
    if (!lastResponse) {
        logger.error('No request has been made until now.');
        return false;
    }
    return true;
  };

  function assertPropertyIs(lastResponse, key, expectedValue, callback) {
    const value = assertPropertyExists(lastResponse, key, expectedValue, callback);
    if (!value) { return false; }
    if (value !== expectedValue) {
        callback.fail(`The last response did not have the expected content in property ${key} Got:${value}. Expected it to contain:${expectedValue}`);
        return false;
    }
    return true;
}

function assertPropertyContains(lastResponse, key, expectedValue, callback) {
    const value = assertPropertyExists(lastResponse, key, expectedValue, callback);
    if (!value) { return false; }
    if (value.indexOf(expectedValue) === -1) {
        callback.fail(`The last response did not have the expected content in property ${key} Got:${value}. Expected it to contain:${expectedValue}`);
        return false;
    }
    return true;
}

function assertPropertyExists(lastResponse, key, expectedValue, callback) {
  const object = assertValidJson(lastResponse, callback);
  if (!object) { return null; }
  let property;
  if (key.indexOf('$.') !== 0 && key.indexOf('$[') !== 0) {
      property = object[key];
  } else {
      const matches = jsonPath(object, key);
      if (matches.length === 0) {
          callback.fail(`The last response did not have the property: ${key} Expected it to be ${expectedValue}`);
          return null;
      } else if (matches.length > 1) {
          callback.fail(`JSONPath expression ${key} returned more than one match in object: ${JSON.stringify(object)}`);
          return null;
      }
      property = matches[0];
  }
  if (property == null) {
      callback.fail(`The last response did not have the property ${key} Expected it to be ${expectedValue}`);
      return null;
  }
  return property;
}

function assertResponse(lastResponse) {
  if (!lastResponse) {
      logger.error('No request has been made until now.');
      return false;
  }
  return true;
}

function assertBody(lastResponse, callback) {
  if (!assertResponse(lastResponse, callback)) { return false; }
  if (!lastResponse.body) {
      callback.fail(new Error('The response to the last request had no body.'));
      return null;
  }
  return lastResponse.body;
}

function assertValidJson(lastResponse, callback) {
  const body = assertBody(lastResponse, callback);
  if (!body) { return null; }
  try {
      return JSON.parse(body);
  } catch (e) {
      callback.fail(
      new Error('The body of the last response was not valid JSON.'));
      return null;
  }
}


};

module.exports = RestStepsWrapper;