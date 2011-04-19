Then /^I should see "([^\"]*)" before "([^\"]*)"$/ do |first, second|
  unless page.body.match(/#{first}.*#{second}/im) 
    raise("#{first} can't be found before #{second}") 
  end
end

When /I wait for "(\d)"s/ do |seconds|
  sleep seconds.to_i
end

Then /I should see a button "([^\"]*)"/ do |text|
  xpath = "//button[contains(., '#{text}')] | //input[@value='#{text}']"
  assert page.has_xpath?(xpath) && locate(xpath).visible?
end

Then /I should not see a button "([^\"]*)"/ do |text|
  xpath = "//button[contains(., '#{text}')] | //input[@value='#{text}']"
  assert (page.has_no_xpath?(xpath) || !locate(xpath).visible?)
end

Then /I should not see a link "([^\"]*)"/ do |text|
  assert page.has_no_xpath?("//a[contains(., '#{text}')]")
end

Then /I should see a link "([^\"]*)"/ do |text|
  assert page.has_xpath?("//a[contains(., '#{text}')]")
end

Then /I should see a password field "(\w+)"/ do |id|
  assert page.has_xpath?("//input[@id='#{id}'][@type='password']")
end

Then /^the button "([^\"]*)" should be disabled$/ do |value|
  assert page.has_xpath?("//input[@type='submit'][@value='#{value}'][@disabled]")
end

Then /I should be on the (.+)/ do |path|
  assert page.current_url.match(/#{Regexp.escape path_to(path)}/)
end

Then /"([^\"]+)" should be visible/ do |text|
  assert locate("//*[contains(., '#{text}')]").text.include?(text)
end

Then /"([^\"]+)" should be hidden/ do |text|
  assert !locate("//*[contains(., '#{text}')]").text.include?(text)
end

Then /^the link "([^\"]*)" should have the class "([^\"]*)"$/ do |title, css_class|
  assert page.has_xpath?("//a[@title='#{title}'][contains(@class, '#{css_class}')]")
end

Then /^the link "([^\"]*)" should not have the class "([^\"]*)"$/ do |title, css_class|
  assert page.has_no_xpath?("//a[@title='#{title}'][contains(@class, '#{css_class}')]")
end

When /^I wait for the AJAX call to finish$/ do
  sleep 1
end