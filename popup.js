$(document).ready(function() {

    $('#filteredCheck').prop('checked', getIsFiltered());

    updateDepartures();

    $('#filteredCheck').on('click', function() {
        setIsFiltered(this.checked);
        updateDepartures();
    });

    function updateDepartures() {
        var departures = JSON.parse(localStorage.departures);
        $('#departureTable > tbody').html('');
        var isFiltered = getIsFiltered();
        $.each(departures, function(index, departure) {
            if (!isFiltered || (isFiltered && isDepartureActive(departure.name, departure.to))) {

                var name = getLabelPath(departure.name);
                var delay = '';
                if (departure.delay) {
                    delay = ' (' + departure.delay + ')';
                }
                $('#departureTable > tbody').append('' +
                        '<tr>' +
                        '<td>' +
                        '   <img src="' + name + '">' +
                        '</td>' +
                        '<td>' +
                        departure.time +
                        '</td>' +
                        '<td>' +
                        delay +
                        '</td>' +
                        '<td>' +
                        departure.name +
                        '</td>' +
                        '<td>' +
                        departure.to +
                        '</td>' +
                        '</tr>');
                if (0 === departures.length) {
                    $('#departureTable > tbody').append('' +
                        '<tr><td>' +
                        'currently no next departures' +
                        '</td></tr>');
                }
            }
        });
    }

    function isDepartureActive(name, to) {
        var isActive = false;
        var destinations = loadDestinationsFromStorage();
        $.each(destinations, function(index, value) {
            if (value.to === to && value.name === name) {
                isActive = value.isActive;
                return false;
            }
        });
        return isActive;
    }
});