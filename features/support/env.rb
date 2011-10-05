require 'rubygems'
require File.dirname(__FILE__) + '/testapp'

require 'cucumber/formatter/unicode'
require 'cucumber/web/tableish'
require 'capybara/cucumber'
require 'capybara/session'

Capybara.default_driver = :selenium
Capybara.app = Sinatra::Application

Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, :browser => :chrome)
end

Before do
  FileUtils.rm_rf(File.dirname(__FILE__) + '/../fixtures')
end

def patiently(&block)
  cycles = 0
  begin
    yield
  rescue  => e
    cycles += 1
    sleep 0.1
    if cycles < 10
      retry 
    else
      raise e
    end
  end
end