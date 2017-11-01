function show(from, to, departure, delay) {
    var notifyFrom = moment(calcStrFromMin(localStorage.notifyFrom), 'HH:mm');
    if (delay) {
        delay = ' (delayed ' + delay + ' minutes)';
    } else {
        delay = '';
    }

    var icon = getLabelPath(from);

    new Notification(departure.format('HH:mm'), {
      icon: icon,
      body: from + ' to ' + to + ' is leaving ' + moment().to(departure) + delay
    });
}

var refreshDelay = 60000;

function refreshTransportData() {
    var now = moment();
    var departures = [];
    var notifyFrom = moment(calcStrFromMin(localStorage.notifyFrom), 'HH:mm');
    var notifyTo = moment(calcStrFromMin(localStorage.notifyTo), 'HH:mm');
    if (localStorage.station_id && now.isSameOrAfter(notifyFrom) && now.isSameOrBefore(notifyTo)) {
        var datetime = moment().add(localStorage.notifyDelta, 'minutes').format('YYYY-MM-DD HH:mm');
        $.get('http://transport.opendata.ch/v1/stationboard', {id: localStorage.station_id, datetime: datetime, limit: 15}, function(data) {
            var destinations = loadDestinationsFromStorage();
            $(data.stationboard).each(function () {
                var prognosis, departure, delay, name;
                departure = moment(this.stop.departure);
                name = this.category;
				if (!this.number.startsWith(name)) {
					name += this.number;
				}
                if (this.stop.prognosis.departure) {
                    prognosis = moment(this.stop.prognosis.departure);
                    delay = (prognosis.valueOf() - departure.valueOf()) / 60000;
                } else {
                    // departure.format('HH:mm');
                }
				departures.push({'name': name, 'to': this.to, 'time': departure.format('HH:mm'), 'delay': delay});
				destinations = setDestination(destinations, name, this.to);
                var isActive = isDestinationActive(destinations, name, this.to);
                if (moment().add(localStorage.notifyDelta, 'minutes').format('HH:mm') === departure.format('HH:mm') &&
                    isActive === true) {
                    show(name, this.to, departure, delay);
                }
            });
            saveDestinationsToStorage(destinations);
            localStorage.departures = JSON.stringify(departures);
            chrome.runtime.sendMessage({'text': UPDATE_DEPARTURES});
        }, 'json');
    }
    // schedule a repeat
    setTimeout(refreshTransportData, refreshDelay);
}

function setDestination(destinations, name, to) {
    var result = $.grep(destinations, function(e) { return (e.name === name && e.to === to); });

    if (result.length === 0) {
        destinations.push({'to': to, 'isActive': false, 'name': name});
    }
    
    return destinations;
}

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
    localStorage.station_name = '';
    localStorage.station_id = 0;
    localStorage.notifyFrom = 0;
    localStorage.notifyTo = 1400;
    localStorage.notifyDelta = 5;
    localStorage.isInitialized = true;
}

if (!localStorage.destinations) {
    saveDestinationsToStorage([]);
}
if (!localStorage.departures) {
    localStorage.departures = JSON.stringify([]);
}
if (!localStorage.isFiltered) {
    localStorage.isFiltered = false;
}
// Test for notification support.
if (window.Notification) {
    refreshTransportData();
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    switch (message.text) {
        case GET_DEPARTURES:
            refreshTransportData();
            break;
        default:
            break;
    }
});

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({ url: 'options.html' });
});
