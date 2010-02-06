require 'rubygems'
require 'culerity'
require 'cucumber/formatter/unicode'
require 'json'

Symbol.class_eval do
  def to_proc
    Proc.new{|object| object.send(self)}
  end
end unless :symbol.respond_to?(:to_proc)

def change_port(old_port, new_port)
  file_path = File.dirname(__FILE__) + '/../../js/rpc.js'
  content = File.read(file_path)
  File.open(file_path, 'w') do |f|
    f << content.sub(old_port.to_s, new_port.to_s)
  end
end

Before do
  $data_file = File.dirname(__FILE__) + '/data.json'
  File.open($data_file, 'w') {|f| f << '' }
  change_port(9091, 4567)
  $testapp = IO.popen("/usr/bin/env ruby #{File.dirname(__FILE__) + '/testapp.rb'} 2>/dev/null 1>/dev/null", 'r+')
  $server ||= Culerity::run_server
  $browser = Culerity::RemoteBrowserProxy.new $server, {:browser => :firefox, :javascript_exceptions => true, :resynchronize => false, :status_code_exceptions => true}
  $browser.log_level = :warning
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
  Process.kill(6, $testapp.pid.to_i) if $testapp
  change_port(4567, 9091)
  File.delete($data_file) if $data_file
end
