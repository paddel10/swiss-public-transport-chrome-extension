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
    $('#location').val(localStorage.location ? localStorage.location : 'none');

    populateDestinationsList();

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        switch (message.text) {
            case UPDATE_DEPARTURES:
                populateDestinationsList();
                break;
            default:
                break;
        }
    });

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
            localStorage.station_id = ui.item.station.id;
            clearDestinations();
            chrome.runtime.sendMessage({text: GET_DEPARTURES});
        }
    });

    $("#notifyDelta").on('keyup keydown change', function() {
        localStorage.notifyDelta = $(this).val();
    });

    $('#location').on('change', function() {
        localStorage.location = this.value;
        populateDestinationsList();
    });

    $('#reloadAllDest').on('click', function() {
        populateDestinationsList();
    });

    $('#selectAllDest').on('click', function() {
        $('[id^=destinationCheck]').prop('checked', true);
        var destinations = loadDestinationsFromStorage();
        destinations = $.map(destinations, function (value) {
            value.isActive = true;
            return value;
        });
        saveDestinationsToStorage(destinations);
    });

    $('#deselectAllDest').on('click', function() {
        $('[id^=destinationCheck]').prop('checked', false);
        var destinations = loadDestinationsFromStorage();
        destinations = $.map(destinations, function (value) {
            value.isActive = false;
            return value;
        });
        saveDestinationsToStorage(destinations);
    });

    $('#clearAllDest').on('click', function() {
        clearDestinations();
    });

    $("#slider-range").slider({
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

    function clearDestinations() {
        $('#departureTable > tbody').html('');
        $('#destinationsCheckB').empty();
        $('#noDest').show();
        saveDestinationsToStorage([]);
    }

    function populateDestinationsList() {
        $('#destinationsCheckB').empty();
        $('#destinationsCheckB').hide();
        $('#noDest').hide();
        $('#departureDiv').hide();
        var destinations = loadDestinationsFromStorage();
        if (destinations.length) {
            $('#destinationsCheckB').show();
            $('#departureDiv').show();
            $.each(destinations, function(index, value) {
                addDestination(value.name, value.to, value.isActive);
            });
        } else {
            $('#noDest').show();
        }
    }

    function addDestination(name, to, isActive) {
        var container = $('#destinationsCheckB');
        var inputs = container.find('input');
        var id = 0;
        if (inputs) {
            id = inputs.length + 1;
        }
        id = 'destinationCheck' + id;
        var div = $('<div />', { style: 'display:table;width:auto;display: inline-block;' });
        var li = $('<li />', { class: 'checkbox' });

        $('<img />', { style: 'pull-left; margin-right:10px;', src: getLabelPath(name) }).appendTo(li);
        $('<input />', { style: 'padding-left:5px;margin:0;vertical-align:middle;position: relative;', type: 'checkbox', id: id, value: name, to: to, checked: isActive }).appendTo(li);
        $('<label />', { 'for': 'destinationCheck' + id, text: name + ' to ' + to, style: 'display:inline-block;' }).appendTo(li);
        div.appendTo(li);
        li.appendTo(container);
        $('#' + id).on('click', function() {
            updateDestination($(this).attr('value'), $(this).attr('to'), this.checked);
        });
    }

    function updateDestination(name, to, isActive) {
        var destinations = loadDestinationsFromStorage();
        destinations = $.map(destinations, function (value) {
            if (value.to === to && value.name === name) {
                value.isActive = isActive;
            }
            return value;
        });
        saveDestinationsToStorage(destinations);
    }
});
