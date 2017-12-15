/* eslint
   new-cap: 0,
   func-names: 0,
   prefer-arrow-callback: 0,
   max-len: 0,
*/
'use strict';

const jsonPath = require('JSONPath').eval;
const assert = require('assert');

const RestStepsWrapper = function () {

    this.When(/^I GET the "([^"]+)"$/, async function (urlpath) {
        const token = 'SharedAccessSignature 58ac24368d560a006b030003&201801030618&vza3SxXFcFFt+SPFBjEB8goDyNYWcKmdrHaS0LlMGAg+TLRFmKPnogMCbDz9i3hfvuSDse24ueWNjLvnfCYHCQ==';
        await this.sendRequest('GET', urlpath, token);
    });

    function sendRequest (operation, path, validHeader, requestBody){
            requestInfo = {
                url: path,
                json: requestBody,
                method: operation,
                headers: validHeader,
          }
        return new Promise((resolve, reject) => {
            logger.log(requestInfo.url);
            request(requestInfo, (error, response) => {
                if (error) {
                    reject(new Error(`Error on ${operation} request to ${uri} : ${error.message}`));
                    return;
                }
                logger.log(response.statusCode);
                logger.log(JSON.stringify(response.body, null, 2));
                self.lastResponse = response;
                resolve(response);
            });
        });
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

    // Check if the HTTP status code is same as the expected
    this.Then(/^the http status should be (\d+)$/, function (status) {
        if (!assertResponse(this.restutil.lastResponse)) { return; }
        if (this.restutil.lastResponse.statusCode != status) {
            assert(false, `The last http response did not have the expected status, expected ${status} but got ${this.restutil.lastResponse.statusCode}`);
        } else {
            assert(true);
        }
    });
};

module.exports = RestStepsWrapper;