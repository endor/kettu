Feature: Settings
  In order to customize transmission to my needs
  As a user
  I want to change settings
  
  Scenario: Toggle turtle mode
    When I go to the start page
      And I follow "Enable Turtle Mode"
    Then there should be a request to set "alt-speed-enabled" to "true"
    When I follow "Disable Turtle Mode"
    Then there should be a request to set "alt-speed-enabled" to "false"
  
  

  
