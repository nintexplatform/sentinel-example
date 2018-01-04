@SOC2
Feature: API Traffic should flow over HTTPS. If it over HTTP, it should get re-directed to HTTPS

Scenario: Check whether the API Traffic for NWC Workflow gets re-directed to HTTPS when request contains HTTP protocol
  When I GET the "http://nxttst01apiwus01.azure-api.net/workflows/v1/designs/published"
  Then the http status should be 301

Scenario: Check whether the API Traffic for NWC Workflow flows through HTTPS protocol
  When I GET the "https://nxttst01apiwus01.azure-api.net/workflows/v1/designs/published"
  # Expect 401 Error Azure APIM/Internal services
  Then the http status should be 401

Scenario: Check whether the API Traffic for ZINC gets re-directed to HTTPS when request contains HTTP protocol
  When I GET the "http://tstznc01srvwebwus01.azurewebsites.net/api/v1/form/Definition/415041b2-5677-48e4-83ef-e98bf32db079"
  Then the http status should be 301

Scenario: Check whether the API Traffic for ZINC flows through HTTPS protocol
  When I GET the "https://tstznc01srvwebwus01.azurewebsites.net/api/v1/form/Definition/415041b2-5677-48e4-83ef-e98bf32db079"
  # Expect 401 Error Azure APIM/Internal services
  Then the http status should be 401