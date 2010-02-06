require 'rubygems'
require 'sinatra'
require 'json'

set :static, true
set :public, File.dirname(__FILE__) + '/../../'

get '/' do
  redirect "/index.html"
end

post '/transmission/rpc' do
  content_type :json
  File.read(File.dirname(__FILE__) + '/data.json')
end