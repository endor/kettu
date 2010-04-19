Feature: Torrent info
  In order to evaluate the current state of a torrent
  As a user
  I want to see more information about the torrent

  Scenario: double clicking on a torrent opens info
    Given a torrent with the name "Mutant Ninja Turtles" and the download directory "/downloads"
    When I go to the start page
      And I wait for the AJAX call to finish
      And I double click on the torrent "1"
      And I wait for the AJAX call to finish
    Then I should see "/downloads"
    When I double click on the torrent
    Then I should not see "/downloads"
    
  Scenario: clicking on inspector opens info
    Given a torrent with the name "Mutant Ninja Turtles" and the download directory "/downloads"
    When I go to the start page
      And I wait for the AJAX call to finish
      And I click on the torrent "1"
      And I follow "Inspector"
      And I wait for the AJAX call to finish
    Then I should see "/downloads"
    When I follow "Inspector"
    Then I should not see "/downloads"
    
  Scenario: inspector cannot show unselected torrents
    Given a torrent with the name "Mutant Ninja Turtles" and the download directory "/downloads"
    When I go to the start page
      And I wait for the AJAX call to finish
      And I follow "Inspector"
      And I wait for the AJAX call to finish
    Then I should see "You have not selected any torrents to inspect."

  Scenario: double clicking on a torrent and then single clicking on another one updates info
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the ids "1, 2, 3"
      And the torrent "Mutant Ninja Turtles" has more info like the download directory which is "/downloads"
    When I go to the start page
      And I wait for the AJAX call to finish
      And I double click on the torrent "1"
      And I wait for the AJAX call to finish
      And the torrent "Donald Duck" has more info like the download directory which is "/my_torrents"
      And I click on the torrent "2"
      And I wait for the AJAX call to finish
    Then I should see "/my_torrents"  
  
  Scenario: info displays tracker information
    Given a torrent with the tracker "my.tracker.com:1234" a last announce timestamp of "1266830556" and a next announce in 30 minutes
    When I go to the start page
      And I wait for the AJAX call to finish
      And I double click on the torrent "1"
      And I wait for the AJAX call to finish
      And I follow "Trackers"
    Then I should see "my.tracker.com:1234"
      And I should see a formatted time for the timestamp
      And I should see a countdown time of about 30 minutes

  Scenario: info displays file information
    Given a torrent with the file "README.md" which has a size of 12 bytes and has already downloaded 6 bytes and is not wanted and another file "INSTALL.md"
    When I go to the start page
      And I wait for the AJAX call to finish
      And I double click on the torrent "1"
      And I wait for the AJAX call to finish
      And I follow "Files"
    Then I should see "12 bytes"
      And I should see "50%"
      And "file_0" should not be checked
  
  Scenario: info displays peer information
    Given a torrent with a peer with IP "1.2.3.4" and client name "Transmission Rocks"
    When I go to the start page
      And I wait for the AJAX call to finish
      And I double click on the torrent "1"
      And I wait for the AJAX call to finish
      And I follow "Peers"
    Then I should see "1.2.3.4"
      And I should see "Transmission Rocks"

  Scenario: info updates itself
    Given a torrent with a peer with IP "1.2.3.4" and client name "Transmission Rocks"
    When I go to the start page
      And I wait for the AJAX call to finish
      And I double click on the torrent "1"
      And I wait for the AJAX call to finish
      And I follow "Peers"
    Then I should see "1.2.3.4"
    When there is new data for the torrent with new IP "6.7.8.9" and new client name "Elephant"
      And I wait for "3"s
    Then I should see "6.7.8.9"
      And I should see "Elephant"
      And I should not see "1.2.3.4"
      And I should not see "Transmission Rocks"