require 'timeout'
require 'rubygems'
require 'culerity'
require 'cucumber/formatter/unicode'
require 'json'

Symbol.class_eval do
  def to_proc
    Proc.new{|object| object.send(self)}
  end
end unless :symbol.respond_to?(:to_proc)

Before do
  $testapp = IO.popen("/usr/bin/env ruby #{File.dirname(__FILE__) + '/testapp.rb'} 2>/dev/null 1>/dev/null", 'r+')
  $server ||= Culerity::run_server
  $browser = Culerity::RemoteBrowserProxy.new $server, {:browser => :firefox, :javascript_exceptions => true, :resynchronize => false, :status_code_exceptions => true}
  $browser.log_level = :warning
  Dir.glob(File.dirname(__FILE__) + '/*.json').each {|f| File.delete(f)}
end

def host
  'http://localhost:4567'
end

def app
  'kettu'
end

at_exit do
  $browser.exit if $browser
  $server.close if $server
  Process.kill(9, $testapp.pid.to_i) if $testapp # see why ruby process is still running
  Dir.glob(File.dirname(__FILE__) + '/*.json').each {|f| File.delete(f)}
end
