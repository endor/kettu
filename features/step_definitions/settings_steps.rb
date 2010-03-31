Then /there should be a request to set "([^\"]+)" to "([^\"]+)"/ do |setting, value|
  File.read(File.dirname(__FILE__) + '/../support/last_request.json').should include(%Q{"#{setting}":#{value}})
end