require 'json'

Given /a torrent with the name "([^\"]+)"( and a download rate of "([^\"]+)" B\/s)?$/ do |name, has_download_rate, download_rate|
  file_path = File.dirname(__FILE__) + '/../support/plural.json'
  File.open(file_path, 'w') do |f|
    f << '{"arguments": {"torrents":  [{"id":  4, "name": "' + name + '", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": ' + (has_download_rate ? download_rate : '0') + ',"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987}]}}'
  end
end

Given /the torrent "([^\"]+)" has more info like the download directory which is "([^\"]+)"/ do |name, download_dir|
  file_path = File.dirname(__FILE__) + '/../support/singular.json'
  File.open(file_path, 'w') do |f|
    f << '{"arguments": {"torrents": [{"id":  4, "name": "' + name + '", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": 0,"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987, "downloadDir": "' + download_dir + '", "creator": "chaot", "hashString": "83ui72GYAYDg27ghg22e22e4235215", "comment": "", "isPrivate": true, "downloadedEver": 50, "haveString": "", "errorString": "", "peersGettingFromUs": 0, "peersSendingToUs": 0, "files": [], "pieceCount": 20, "pieceSize": 5}]}}'
  end
end

Given /a torrent with the tracker "([^\"]+)" a last announce timestamp of "(\d+)" and a next announce in 30 minutes/ do |url, last_announce_timestamp|
  file_path = File.dirname(__FILE__) + '/../support/plural.json'
  File.open(file_path, 'w') {|f| f << '{"arguments": {"torrents": [{"id":  1, "name": "test", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": 0,"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987}]}}' }
  next_announce_timestamp = (Time.now.to_i + 1800).to_s
  file_path = File.dirname(__FILE__) + '/../support/singular.json'
  File.open(file_path, 'w') {|f| f << '{"arguments": {"torrents": [{"id":  1, "name": "test", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": 0,"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987, "downloadDir": "/downloads", "creator": "chaot", "hashString": "83ui72GYAYDg27ghg22e22e4235215", "comment": "", "isPrivate": true, "downloadedEver": 50, "haveString": "", "errorString": "", "peersGettingFromUs": 0, "peersSendingToUs": 0, "files": [], "pieceCount": 20, "pieceSize": 5, "trackerStats": [{"lastAnnounceTime": "' + last_announce_timestamp + '", "host": "' + url + '", "nextAnnounceTime": "' + next_announce_timestamp + '", "lastScrapeTime": "12345678", "seederCount": 0, "leecherCount": 0, "downloadCount": 1}]}]}}' }
end

Given /three torrents with the names "([^\"]+)" and the (download rates|stati|date added|left until done|ids) "([^\"]+)"/ do |names_string, attribute, attribute_string|
  names = names_string.split(',')
  attributes = attribute_string.split(',')
  torrents = []

  case(attribute)
  when 'stati'
    names.each_with_index do |name , i|
      torrents.push({"id" =>  i, "name" => name.strip, "status" => attributes[i].to_i, "totalSize" => 100, "sizeWhenDone" => 100, "leftUntilDone" => 50, "eta" => 0, "uploadedEver" => 0, "uploadRatio" => 0, "rateDownload" => 0,"rateUpload" => 0, "metadataPercentComplete" => 1, "addedDate" => 27762987})
    end
  when 'download rates'
    names.each_with_index do |name , i|
      torrents.push({"id" =>  i, "name" => name.strip, "status" => 4, "totalSize" => 100, "sizeWhenDone" => 100, "leftUntilDone" => 50, "eta" => 0, "uploadedEver" => 0, "uploadRatio" => 0, "rateDownload" => attributes[i].to_i, "rateUpload" => 0, "metadataPercentComplete" => 1, "addedDate" => 27762987})
    end
  when 'date added'
    names.each_with_index do |name , i|
      torrents.push({"id" =>  i, "name" => name.strip, "status" => 4, "totalSize" => 100, "sizeWhenDone" => 100, "leftUntilDone" => 50, "eta" => 0, "uploadedEver" => 0, "uploadRatio" => 0, "rateDownload" => 0, "rateUpload" => 0, "metadataPercentComplete" => 1, "addedDate" => attributes[i].to_i})
    end
  when 'left until done'
    names.each_with_index do |name , i|
      torrents.push({"id" =>  i, "name" => name.strip, "status" => 4, "totalSize" => 100, "sizeWhenDone" => 100, "leftUntilDone" => attributes[i].to_i, "eta" => 0, "uploadedEver" => 0, "uploadRatio" => 0, "rateDownload" => 0, "rateUpload" => 0, "metadataPercentComplete" => 1, "addedDate" => 27762987})
    end
  when 'ids'
    names.each_with_index do |name , i|
      torrents.push({"id" =>  attributes[i].to_i, "name" => name.strip, "status" => 4, "totalSize" => 100, "sizeWhenDone" => 100, "leftUntilDone" => 50, "eta" => 0, "uploadedEver" => 0, "uploadRatio" => 0, "rateDownload" => 0, "rateUpload" => 0, "metadataPercentComplete" => 1, "addedDate" => 27762987})
    end
  end
  
  file_path = File.dirname(__FILE__) + '/../support/plural.json'
  File.open(file_path, 'w') do |f|
    f << {"arguments" => {"torrents" => torrents}}.to_json
  end
end

When /^I click on the torrent$/ do
  $browser.li(:id, '4').click
end

When /^I double click on the torrent$/ do
  $browser.li(:id, '4').double_click
end

Then /the torrent should be highlighted/ do
  $browser.li(:id, '4').attribute_value(:class).should include('active')
end

When /I double click on the torrent "([^\"]+)"/ do |id|
  $browser.li(:id, id).double_click
end

When /I click on the torrent "([^\"]+)"/ do |id|
  $browser.li(:id, id).click
end

Then /I should see a countdown time of about 30 minutes/ do
  $browser.div(:text, /(29|30) min, (\d+) sec/)
end