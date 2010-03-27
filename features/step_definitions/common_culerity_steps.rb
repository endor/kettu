require 'culerity'

When /I press "(.*)"/ do |button|
  button = [$browser.button(:text, button), $browser.button(:id, button)].find(&:exist?)
  button.click
  When 'I wait for the AJAX call to finish'
end

When /I click "(.*)"/ do |link|
  When "I follow \"#{link}\""
end

When /I follow "(.*)"/ do |link|
  _link = [[:text, /^#{Regexp.escape(link)}$/], [:id, link], [:title, link]].map{|args| $browser.link(*args)}.find{|__link| __link.exist?}
  raise "link \"#{link}\" not found" unless _link
  _link.click
  When 'I wait for the AJAX call to finish'
end

When /I follow \/(.*)\// do |link|
  $browser.link(:text, /#{link}/).click
  When 'I wait for the AJAX call to finish'
end

When /I fill in "(.*)" with "(.*)"/ do |field, value|
  find_by_label_or_id(:text_field, field).set value
end

When /I attach "(.*)" to "(.*)"/ do |value, field|
  $browser.file_field(:id, find_label(field).for).set(value)
end

When /I check "(.*)"/ do |field|
  find_by_label_or_id(:check_box, field).set true
end

def find_by_label_or_id(element, field)
  begin
    $browser.send(element, :id, find_label(/#{field}/).for)
  rescue #Celerity::Exception::UnknownObjectException
    $browser.send element, :id, field
  end
end

When /^I uncheck "(.*)"$/ do |field|
  $browser.check_box(:id, find_label(field).for).set(false)
end

When /^I select "([^"]+)" from "([^"]+)"$/ do |value, field|
  find_by_label_or_id(:select_list, field).select value
end

When /^I select "([^\"]*)"$/ do |value|
  $browser.option(:text => value).select
end

When /I choose "(.*)"/ do |field|
  $browser.radio(:id, find_label(field).for).set(true)
end

When /I go to the (.+)/ do |path|
  $browser.goto host + path_to(path)
  When 'I wait for the AJAX call to finish'
end

When /^I wait for the AJAX call to finish$/ do
  # puts 'waiting for the AJAX call ...'
  $browser.wait_while do
    begin
      count = $browser.execute_script("window.running_ajax_calls").to_i
      count.to_i > 0
    rescue => e
      if e.message.include?('HtmlunitCorejsJavascript::Undefined')
        raise "For 'I wait for the AJAX call to finish' to work please include culerity.js after including jQuery. If you don't use jQuery please rewrite culerity.js accordingly."
      else
        raise(e)
      end
    end
  end
  sleep 0.5
end

When /^I visit "([^\"]+)"$/ do |url|
  $browser.goto host + url
end

Then /^I should see "([^\"]*)"$/ do |text|
  Then "I should see /#{Regexp.escape(text)}/"
end

Then /^I should see \/(.*)\/$/ do |text|
  # if we simply check for the browser.html content we don't find content that has been added dynamically, e.g. after an ajax call
  div = $browser.div(:text, /#{text}/)
  begin
    div.html
  rescue
    raise("div with '#{text}' not found")
  end
end

Then /I should not see "(.*)"/ do |text|  
  div_nil = false 
  if ($browser.div(:text, /#{text}/) rescue nil)
    div_nil = true 
  else 
    if $browser.div(:text, /#{text}/).style.match(/-9999px/)
      div_nil = true
    end
  end
  div_nil.should be_true
end

Then /I should see the text "(.*)"/ do |text|
  $browser.html.should include(text)
end

Then /I should not see the text "(.*)"/ do |text|
  $browser.html.should_not include(text)
end

Then /I should see no link "([^\"]+)"/ do |text|
  $browser.link(:text => text).should_not exist
end

Then /I should not find the page "([^\"]+)"/ do |url|
  no_exception = false
  begin
    $browser.goto host + url
    no_exception = true
  rescue => e
    e.message.should =~ /404/
  end
  no_exception.should be_false
end

Then /^"([^\"]*)" should be chosen$/ do |field|
  find_by_label_or_id(:radio, field).should be_checked
end

Then /^"([^\"]*)" should be checked$/ do |field|
  find_by_label_or_id(:check_box, field).should be_checked
end

Then /^"([^\"]*)" should not be checked$/ do |field|
  find_by_label_or_id(:check_box, field).should_not be_checked
end

Then /^"([^\"]*)" should be selected$/ do |selection|
  $browser.option(:text => selection).should be_selected
end

When 'show response' do
  p $browser.url
  open_response_in_browser
end


def find_label(text)
  $browser.label :text, text
end

def open_response_in_browser
  tmp_file = '/tmp/culerity_results.html'
  FileUtils.rm_f tmp_file
  File.open(tmp_file, 'w') do |f|
    f << $browser.div(:id, 'container').html
  end
  `open #{tmp_file}`
end