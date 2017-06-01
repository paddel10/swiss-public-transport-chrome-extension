# Swiss Public Transport Departure Chrome Extension
This extension for Google Chrome Browser alerts the user when a train, tram or bus departs from a station.

The user pre-selects the departure station, the time range in which the notification should be displayed and the number of minutes prior to the departure when the alert should be displayed. Transport data is retrieved and processed every minute from <a href="https://transport.opendata.ch/">https://transport.opendata.ch</a>. Please note that the author of this extension is not responsible if you miss your public transportation.

The extension is also available in the Google Chrome Webstore: https://chrome.google.com/webstore/detail/swiss-public-transport-de/himldllpdlkcdemakpcogfkoighmfpgi

# Localization
(TBD) The user may select the location of the station to get localized notifications such as displaying the line number instead of the generic icon.

# Limitations - things to do
- if location is selected not every transport has it's own label
- no transportation filter yet
- limit notification to one direction
- limit notification to one line

# Links
- Notification: https://developer.chrome.com/extensions/samples
- Stationboard: https://transport.opendata.ch/examples/stationboard.html


# License

MIT license, see [LICENSE](LICENSE)
