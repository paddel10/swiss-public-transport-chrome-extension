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
    var notifyFrom = moment(calcStrFromMin(localStorage.notifyFrom), 'HH:mm');
    var notifyTo = moment(calcStrFromMin(localStorage.notifyTo), 'HH:mm');
    if (localStorage.station_id && now.isSameOrAfter(notifyFrom) && now.isSameOrBefore(notifyTo)) {
        var datetime = moment().add(localStorage.notifyDelta, 'minutes').format('YYYY-MM-DD HH:mm');
        $.get('http://transport.opendata.ch/v1/stationboard', {id: localStorage.station_id, datetime: datetime, limit: 15}, function(data) {
            $(data.stationboard).each(function () {
                var prognosis, departure, delay, name;
                departure = moment(this.stop.departure);
                name = this.category + this.number;
                var isActive = updateDestination(this.to, name);
                if (moment().add(localStorage.notifyDelta, 'minutes').format('HH:mm') !== departure.format('HH:mm') ||
                    isActive === false) {
                    return;
                }
                if (this.stop.prognosis.departure) {
                    prognosis = moment(this.stop.prognosis.departure);
                    delay = (prognosis.valueOf() - departure.valueOf()) / 60000;
                } else {
                    // departure.format('HH:mm');
                }
                show(name, this.to, departure, delay);
            });
        }, 'json');
    }
    // schedule a repeat
    setTimeout(refreshTransportData, refreshDelay);
}

function updateDestination(to, name) {
    var found = false;
    var isActive = false;
    var destinations = JSON.parse(localStorage.destinations);
    $.each(destinations, function(index, value) {
       if (value.to === to && value.name === name) {
           found = true;
           isActive = value.isActive;
           return false;
       }
    });
    if (!found) {
        isActive = true;
        destinations.push({'to': to, 'isActive': isActive, 'name': name});
    }
    localStorage.destinations = JSON.stringify(destinations);
    return isActive;
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
    localStorage.destinations = JSON.stringify([]);
}
// Test for notification support.
if (window.Notification) {
    refreshTransportData();
}
