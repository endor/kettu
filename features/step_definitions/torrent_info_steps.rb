Given /a torrent with the tracker "([^\"]+)" a last announce timestamp of "(\d+)" and a next announce in 30 minutes/ do |url, last_announce_timestamp|
  Given 'a torrent'
  next_announce_timestamp = (Time.now.to_i + 1800).to_s
  file_path = File.dirname(__FILE__) + '/../support/singular.json'
  File.open(file_path, 'w') {|f| f << '{"arguments": {"torrents": [{"id":  1, "name": "test", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": 0,"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987, "downloadDir": "/downloads", "creator": "chaot", "hashString": "83ui72GYAYDg27ghg22e22e4235215", "comment": "", "isPrivate": true, "downloadedEver": 50, "haveString": "", "errorString": "", "peersGettingFromUs": 0, "peersSendingToUs": 0, "files": [], "pieceCount": 20, "pieceSize": 5, "trackerStats": [{"lastAnnounceTime": "' + last_announce_timestamp + '", "host": "' + url + '", "nextAnnounceTime": "' + next_announce_timestamp + '", "lastScrapeTime": "12345678", "seederCount": 0, "leecherCount": 0, "downloadCount": 1}]}]}}' }
end

Given /a torrent with the file "([^\"]+)" which has a size of (\d+) bytes and has already downloaded (\d+) bytes/ do |file_name, size, already_downloaded|
  Given 'a torrent'
  file_path = File.dirname(__FILE__) + '/../support/singular.json'
  File.open(file_path, 'w') {|f| f << '{"arguments": {"torrents": [{"id":  1, "name": "test", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": 0,"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987, "downloadDir": "/downloads", "creator": "chaot", "hashString": "83ui72GYAYDg27ghg22e22e4235215", "comment": "", "isPrivate": true, "downloadedEver": 50, "haveString": "", "errorString": "", "peersGettingFromUs": 0, "peersSendingToUs": 0, "files": [], "pieceCount": 20, "pieceSize": 5, "files": [{"key": "1", "bytesCompleted": "' + already_downloaded + '", "length": "' + size + '", "name": "' + file_name + '"}]}]}}' }
end

Given /a torrent with a peer with IP "([^\"]+)" and client name "([^\"]+)"/ do |ip, client_name|
  Given 'a torrent'
  file_path = File.dirname(__FILE__) + '/../support/singular.json'
  File.open(file_path, 'w') {|f| f << '{"arguments": {"torrents": [{"id":  1, "name": "test", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": 0,"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987, "downloadDir": "/downloads", "creator": "chaot", "hashString": "83ui72GYAYDg27ghg22e22e4235215", "comment": "", "isPrivate": true, "downloadedEver": 50, "haveString": "", "errorString": "", "peersGettingFromUs": 0, "peersSendingToUs": 0, "files": [], "pieceCount": 20, "pieceSize": 5, "peers": [{"address": "' + ip + '", "clientName": "' + client_name + '", "rateToClient": 0, "rateToPeer": 0, "progress": 0}]}]}}' }
end

Given /^a torrent$/ do
  file_path = File.dirname(__FILE__) + '/../support/plural.json'
  File.open(file_path, 'w') {|f| f << '{"arguments": {"torrents": [{"id":  1, "name": "test", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": 0,"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987}]}}' }  
end

When /there is new data for the torrent with new IP "([^\"]+)" and new client name "([^\"]+)"/ do |ip, client_name|
  file_path = File.dirname(__FILE__) + '/../support/singular.json'
  File.open(file_path, 'w') {|f| f << '{"arguments": {"torrents": [{"id":  1, "name": "test", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": 0,"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987, "downloadDir": "/downloads", "creator": "chaot", "hashString": "83ui72GYAYDg27ghg22e22e4235215", "comment": "", "isPrivate": true, "downloadedEver": 50, "haveString": "", "errorString": "", "peersGettingFromUs": 0, "peersSendingToUs": 0, "files": [], "pieceCount": 20, "pieceSize": 5, "peers": [{"address": "' + ip + '", "clientName": "' + client_name + '", "rateToClient": 0, "rateToPeer": 0, "progress": 0}]}]}}' }
end

Then /I should see a countdown time of about 30 minutes/ do
  $browser.div(:text, /(29|30) min, (\d+) sec/).should be_exist
end

Then /I should see a formatted time for the timestamp/ do
  time = Time.at(1266830556).strftime("%m/%e/%Y %k:%M").sub(/^0/, '')
  $browser.div(:text, /#{time}/).should be_exist
end
