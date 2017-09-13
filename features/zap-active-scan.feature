@ZAPTest @Security
Feature: Application should not be vulnerable to Security Issues

Background: 
    Given a new scanning session
    And a scanner with all policies disabled
    And the navigation and spider status is reset

Scenario Outline: Check for Security vulnerabilities by running scan for <Policy>
  Given I have loaded the web application
    And all existing alerts are deleted
   Then the application is spidered
    And the "<Policy>" policy is enabled with "Low" threshold and "High" attack strength
   When the active scanner is run
   Then no higher risk vulnerabilities should be present

Examples:
    | Policy                      |
    | SQL Injection               |
    | Cross Site Scripting        |
    | Path Traversal              |
    | Remote File Inclusion       |
    | Server Side Include         |
    | Server Side Code Injection  |
    | Remote OS Command Injection |
    | CRLF Injection              |
    | External Redirect           |
    | Source Code Disclosure      |
    | Shell Shock                 |
    | LDAP Injection              |
    | XPATH Injection             |
    | XML External Entity         |
    | Padding Oracle              |
    | Insecure HTTP Methods       |
