module.exports = function () {
  this.Given(/^I have loaded the web application$/, { timeout: 10000 }, async function () {
    return await this.driver.get('http://nodegoat:4000');
  });

  this.Given(/^I have loaded the web application with "([^"]+)"$/, { timeout: 10000 }, async function (url) {
    return await this.driver.get(url);
  });
};