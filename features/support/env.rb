require 'rubygems'
require 'json'
require 'capybara/cucumber'
require File.dirname(__FILE__) + '/testapp'
require 'test/unit'
require 'test/unit/assertions'
include Test::Unit::Assertions

Capybara.app = Sinatra::Application
Capybara.javascript_driver = :selenium
Capybara.default_driver = :selenium

Symbol.class_eval do
  def to_proc
    Proc.new{|object| object.send(self)}
  end
end unless :symbol.respond_to?(:to_proc)

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