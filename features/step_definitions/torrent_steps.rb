Given /a torrent with the name "([^\"]+)"/ do |name|
  file_path = File.dirname(__FILE__) + '/../support/data.json'
  File.open(file_path, 'w') do |f|
    f << '{"arguments": {"torrents":  [{"id":  4, "name": "' + name + '", "status": 4, "totalSize": 100, "sizeWhenDone": 100,"leftUntilDone": 50, "eta": 0, "uploadedEver": 0, "uploadRatio": 0, "rateDownload": 0,"rateUpload": 0, "metadataPercentComplete": 1, "addedDate": 27762987}]}}'
  end
end

When /I click on the torrent/ do
  $browser.li(:id, '4').click
end

Then /the torrent should be highlighted/ do
  $browser.li(:id, '4').attribute_value(:class).should include('active')
end
