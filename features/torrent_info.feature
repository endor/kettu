Feature: Torrent info
  In order to evaluate the current state of a torrent
  As a user
  I want to see more information about the torrent

  Scenario: double clicking on a torrent opens info
    Given a torrent with the name "Mutant Ninja Turtles"
      And the torrent "Mutant Ninja Turtles" has more info like the download directory which is "/downloads"
    When I go to the start page
      And I wait for the AJAX call to finish
      And I double click on the torrent
      And I wait for the AJAX call to finish
    Then I should see "/downloads"
    When I double click on the torrent
    Then I should not see "/downloads"
    
  Scenario: double clicking on a torrent and then single clicking on another one updates info
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the ids "1, 2, 3"
      And the torrent "Mutant Ninja Turtles" has more info like the download directory which is "/downloads"
    When I go to the start page
      And I double click on the torrent "1"
      And the torrent "Donald Duck" has more info like the download directory which is "/my_torrents"
      And I click on the torrent "2"
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
    Given a torrent with the file "README.md" which has a size of 12 bytes and has already downloaded 6 bytes
    When I go to the start page
      And I wait for the AJAX call to finish
      And I double click on the torrent "1"
      And I wait for the AJAX call to finish
      And I follow "Files"
    Then I should see "12 bytes"
      And I should see "50%"
  