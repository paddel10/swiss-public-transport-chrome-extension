function show(from, to, departure, delay) {
    var notifyFrom = moment(calcStrFromMin(localStorage.notifyFrom), 'HH:mm');
    if (delay) {
        delay = ' (delayed ' + delay + ' minutes)';
    } else {
        delay = '';
    }
    new Notification(departure.format('HH:mm'), {
      icon: '48.png',
      body: from + ' to ' + to + ' is leaving ' + moment().to(departure) + delay
    });
}

var refreshDelay = 60000;

function refreshTransportData() {
    var now = moment();
    var notifyFrom = moment(calcStrFromMin(localStorage.notifyFrom), 'HH:mm');
    var notifyTo = moment(calcStrFromMin(localStorage.notifyTo), 'HH:mm');
    if (localStorage.station_id && now.isSameOrAfter(notifyFrom) && now.isSameOrBefore(notifyTo)) {
        $.get('http://transport.opendata.ch/v1/stationboard', {id: localStorage.station_id, limit: 15}, function(data) {
            $(data.stationboard).each(function () {
                var prognosis, departure, delay;
                departure = moment(this.stop.departure);
                if (moment().add(localStorage.notifyDelta, 'minutes').format('HH:mm') !== departure.format('HH:mm')) {
                    return;
                }
                if (this.stop.prognosis.departure) {
                    prognosis = moment(this.stop.prognosis.departure);
                    delay = (prognosis.valueOf() - departure.valueOf()) / 60000;
                } else {
                    // departure.format('HH:mm');
                }
                show(this.name, this.to, departure, delay);
            });
        }, 'json');
    }
    // schedule a repeat
    setTimeout(refreshTransportData, refreshDelay);
}

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
    localStorage.station_name = '';
    localStorage.station_id = 0;
    localStorage.notifyFrom = 0;
    localStorage.notifyTo = 1400;
    localStorage.notifyDelta = 0;
    localStorage.isInitialized = true;
}

// Test for notification support.
if (window.Notification) {
    refreshTransportData();
}
