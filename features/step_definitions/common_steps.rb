Then /^I should see "([^\"]*)" before "([^\"]*)"$/ do |first, second|
  div = $browser.div('container')
  unless div.html.match(/#{first}.*#{second}/im) 
    raise("#{first} can't be found before #{second}") 
  end
end

When /I wait for "(\d)"s/ do |seconds|
  sleep seconds.to_i
end