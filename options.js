// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Grays out or [whatever the opposite of graying out is called] the option
  field.
*/

$(document).ready(function() {
    $('#station').val(localStorage.station_name);
    $('#notifyFrom').val(calcStrFromMin(localStorage.notifyFrom));
    $('#notifyTo').val(calcStrFromMin(localStorage.notifyTo));
    $('#notifyDelta').val(localStorage.notifyDelta);

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
            localStorage.station_name = ui.item.station.name;
            localStorage.station_id = station
        }
    });

    $("#notifyDelta").on('keyup keydown change', function() {
        localStorage.notifyDelta = $(this).val();
    });
    
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 1440,
        step: 15,
        values: [ localStorage.notifyFrom, localStorage.notifyTo ],
        slide: function(event, ui) {
            localStorage.notifyFrom = ui.values[0];
            localStorage.notifyTo = ui.values[1];
            var notifyFrom = calcStrFromMin(ui.values[0]);
            var notifyTo = calcStrFromMin(ui.values[1]);
            $('#notifyFrom').val(notifyFrom);
            $('#notifyTo').val(notifyTo);
        }
		});
});
