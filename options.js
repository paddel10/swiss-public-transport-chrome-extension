// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Grays out or [whatever the opposite of graying out is called] the option
  field.
*/
var station;
var refreshDelay = 60000;
var notifyFrom = moment().set('hour', 17).set('minute', 0);
var notifyTo = moment().set('hour', 19).set('minute', 40);
var notifyDelta = 3;

function ghost(isDeactivated) {
    options.style.color = isDeactivated ? 'graytext' : 'black';
                                                // The label color.
    options.frequency.disabled = isDeactivated; // The control manipulability.
}

function saveStationToStorage(obj) {
    // chrome.storage.local.set({ "phasersTo": "awesome" }, function(){
    chrome.storage.local.set(obj, function(){
        //  Data's been saved boys and girls, go on home
    });
}

function getStationFromStorage(key) {
    // chrome.storage.local.get(/* String or Array */["phasersTo"], function(items){
    chrome.storage.local.get(/* String or Array */[ key ], function(items){
        //  items = [ { "phasersTo": "awesome" } ]
        station = items.station.station_id;
        $('#station').val(items.station.station_name);
        console.log("getStationFromStorage() " + JSON.stringify(items));
    });
}

function refreshTransportData() {
    var now = moment();
    if (station && now.isSameOrAfter(notifyFrom) && now.isSameOrBefore(notifyTo)) {
        $.get('http://transport.opendata.ch/v1/stationboard', {id: station, limit: 15}, function(data) {
            $('#stationboard tbody').empty();
            $(data.stationboard).each(function () {
                var prognosis, departure, delay;
                var line = '<tr>';
                departure = moment(this.stop.departure);
                if (moment().add(notifyDelta, 'minutes').format('HH:mm') !== departure.format('HH:mm')) {
                    return;
                }
                line += '<td>';
                if (this.stop.prognosis.departure) {
                    prognosis = moment(this.stop.prognosis.departure);
                    delay = (prognosis.valueOf() - departure.valueOf()) / 60000;
                    line += departure.format('HH:mm') + ' <strong>+' + delay + ' min</strong>';
                } else {
                    line += departure.format('HH:mm');
                }
                line += '</td><td>' + this.name + '</td><td>' + this.to + '</td></tr>';
                $('#stationboard tbody').append(line);
            });
        }, 'json');
    }
    // schedule a repeat
    setTimeout(refresh, refreshDelay);
}

window.addEventListener('load', function() {
  // Initialize the option controls.
    options.isActivated.checked = JSON.parse(localStorage.isActivated);
                                           // The display activation.
    options.frequency.value = localStorage.frequency;
                                           // The display frequency, in minutes.

    if (!options.isActivated.checked) { ghost(true); }

    // Set the display activation and frequency.
    options.isActivated.onchange = function() {
        localStorage.isActivated = options.isActivated.checked;
        ghost(!options.isActivated.checked);
    };

    options.frequency.onchange = function() {
        localStorage.frequency = options.frequency.value;
    };
});

$(document).ready(function() {
    getStationFromStorage('station');
    $('#station').autocomplete({
        source: function (request, response) {
            $.get('http://transport.opendata.ch/v1/locations',
                {query: request.term, type: 'station'},
                function(data) {
                    response($.map(data.stations, function(station) {
                        return {
                            label: station.name,
                            station: station
                        }
                    }));
                },
                'json'
            );
        },
        select: function (event, ui) {
            station = ui.item.station.id;
            saveStationToStorage({ 'station' : {
              'station_name': ui.item.station.name,
              'station_id': station
            }});
            //refresh();
        }
    });
});
