require 'json'

Given /a torrent with the name "([^\"]+)"/ do |name|
  file_path = File.dirname(__FILE__) + '/../support/data.json'
  File.open(file_path, 'w') do |f|
    f << '{"arguments": {"torrents":  [{"id":  4, "name": "' + name + '", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": 0,"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987}]}}'
  end
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
  
  file_path = File.dirname(__FILE__) + '/../support/data.json'
  File.open(file_path, 'w') do |f|
    f << {"arguments" => {"torrents" => torrents}}.to_json
  end
end

When /I click on the torrent/ do
  $browser.li(:id, '4').click
end

Then /the torrent should be highlighted/ do
  $browser.li(:id, '4').attribute_value(:class).should include('active')
end
