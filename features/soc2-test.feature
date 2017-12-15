@SOC2
Feature: API Traffic should flow over HTTPS and not through HTTP protocol

Scenario: Check whether the API Traffic for NWC Workflow flows through HTTPS only
  When I GET the "https://nxttst01apiwus01.management.azure-api.net/apis/591a6d5824fcb5c66ea972b4?api-version=2016-10-10"
  Then the http status should be 200
   And the $.protocols[0] should equal "https"

Scenario: Check whether the API Traffic for NWC Workflow flows not through HTTP only
  When I GET the "http://us.nintex.io/workflows/v1/designs"
  Then the http status should be 200