Feature: sort and filter torrents
  In order to have a better overview
  As a user
  I want to sort and filter torrents
  
  Scenario: filter torrents
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the stati "4, 8, 16"
    When I go to the start page
      And I follow "Downloading"
    Then I should see "Mutant Ninja Turtles"
      But I should not see "Donald Duck"
      And I should not see "Saber Riders"
    When I follow "Seeding"
    Then I should see "Donald Duck"
      But I should not see "Mutant Ninja Turtles"
      And I should not see "Saber Riders"
    When I follow "Paused"
    Then I should see "Saber Riders"
      But I should not see "Mutant Ninja Turtles"
      And I should not see "Donald Duck"
    When I follow "All"
    Then I should see "Mutant Ninja Turtles"
      And I should see "Donald Duck"
      And I should see "Saber Riders"
    When I go to the paused filtered torrents page
    Then I should see "Saber Riders"
      But I should not see "Mutant Ninja Turtles"
    When I follow "Enable Compact View"
    Then I should see "Saber Riders"
      But I should not see "Mutant Ninja Turtles"    

  Scenario: sort torrents by name
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the stati "4, 8, 16"
    When I go to the name sorted torrents page
    Then I should see "Donald Duck" before "Mutant Ninja Turtles"
      And I should see "Mutant Ninja Turtles" before "Saber Riders"

  Scenario: sort torrents by status
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the stati "8, 16, 4"
    When I go to the state sorted torrents page
    Then I should see "Saber Riders" before "Mutant Ninja Turtles"
      And I should see "Mutant Ninja Turtles" before "Donald Duck"

  Scenario: sort torrents by activity
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the download rates "16000, 8000, 4000"
    When I go to the activity sorted torrents page
    Then I should see "Saber Riders" before "Donald Duck"
      And I should see "Donald Duck" before "Mutant Ninja Turtles"
  
  Scenario: sort torrents by age
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the date added "87742, 84253, 81181"
    When I go to the age sorted torrents page
    Then I should see "Mutant Ninja Turtles" before "Donald Duck"
      And I should see "Donald Duck" before "Saber Riders"

  Scenario: sort torrents by progress
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the left until done "8, 4, 16"
    When I go to the progress sorted torrents page
    Then I should see "Saber Riders" before "Mutant Ninja Turtles"
      And I should see "Mutant Ninja Turtles" before "Donald Duck"

  Scenario: sort torrents by queue
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the ids "1, 2, 3"
    When I go to the queue sorted torrents page
    Then I should see "Mutant Ninja Turtles" before "Donald Duck"
      And I should see "Donald Duck" before "Saber Riders"
      
  Scenario: filter and sort at the same time
    Given three torrents with the names "Mutant Ninja Turtles, Donald Duck, Saber Riders" and the stati "4, 4, 16"
    When I go to the name sorted torrents page
      And I follow "Downloading"
    Then I should see "Donald Duck" before "Mutant Ninja Turtles"
      And I should not see "Saber Riders"
    
  
  