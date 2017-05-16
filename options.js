// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Grays out or [whatever the opposite of graying out is called] the option
  field.
*/
var station;

function ghost(isDeactivated) {
    options.style.color = isDeactivated ? 'graytext' : 'black';
                                                // The label color.
    options.frequency.disabled = isDeactivated; // The control manipulability.
}

function saveToStorage() {
    chrome.storage.local.set({ "phasersTo": "awesome" }, function(){
        //  Data's been saved boys and girls, go on home
    });
}

function getFromStorage() {
    chrome.storage.local.get(/* String or Array */["phasersTo"], function(items){
        //  items = [ { "phasersTo": "awesome" } ]
        console.log("getFromStorage() " + JSON.stringify(items));
    });
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
    getFromStorage('key');
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
            saveToStorage({
              'station_name': ui.item.station.name,
              'station_id': station
            });
            //refresh();
        }
    });
});
