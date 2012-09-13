require 'rubygems'
require 'sinatra'
require 'json'

set :static, true
set :public_folder, File.dirname(__FILE__) + '/../../'

get '/' do
  File.read(File.join(File.dirname(__FILE__) + '/../../', 'index.html'))
end

post '/transmission/rpc' do
  content_type :json

  # do not log recurring requests
  unless params.to_s.match(/torrent\-get/)
    File.open(File.dirname(__FILE__) + '/../support/last_request.json', 'w') do |f|
      f << params.to_s
    end
  end

  file_name = params.keys.first.match(/ids/) ? "singular" : "plural"
  File.read(File.dirname(__FILE__) + "/#{file_name}.json")
end