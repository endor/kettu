Feature: Search
  In order to quickly find a torrent
  As a user
  I want to be able to search for it

  Scenario: search by name
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the stati "4, 8, 16"
    When I go to the start page
      And I fill in "search" with "Mu"
    Then I should see "Mutant Ninja Turtles"
      But I should not see "Donald Duck"
      And I should not see "Saber Riders"