require 'rubygems'
require 'sinatra'
require 'json'

set :static, true
set :public_folder, File.dirname(__FILE__) + '/../'

get '/' do
  File.read(File.join(File.dirname(__FILE__), 'index.html'))
end