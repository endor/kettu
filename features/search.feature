Feature: Search
  In order to quickly find a torrent
  As a user
  I want to be able to search for it

  Scenario: search by name
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the stati "4, 8, 16"
    When I go to the start page
      And I fill in "search" with "Mu"
    Then I should see a torrent "Mutant Ninja Turtles"
      But I should not see a torrent "Donald Duck"
      And I should not see a torrent "Saber Riders"
      
  Scenario: search by tracker
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the trackers "MyFirstTracker, MySecondTracker, MyThirdTracker"
    When I go to the start page
      And I fill in "search" with "Second"
    Then I should see a torrent "Donald Duck"
      But I should not see a torrent "Mutant Ninja Turtles"
      And I should not see a torrent "Saber Riders"
  
  
  