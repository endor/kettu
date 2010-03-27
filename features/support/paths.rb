module NavigationHelpers
  def path_to(page_name)
    case page_name
    when /start page/
      "/"
    when /paused filtered torrents page/
      "/index.html#/torrents?filter=paused"
    when /state sorted torrents page/
      "/index.html#/torrents?sort=state"
    when /name sorted torrents page/
      "/index.html#/torrents?sort=name"
    when /activity sorted torrents page/
      "/index.html#/torrents?sort=activity"
    when /age sorted torrents page/
      "/index.html#/torrents?sort=age"
    when /progress sorted torrents page/
      "/index.html#/torrents?sort=progress"
    when /queue sorted torrents page/
      "/index.html#/torrents?sort=queue"
    else
      raise "Can't find mapping from \"#{page_name}\" to a path."
    end
  end
end

World(NavigationHelpers)