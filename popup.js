$(document).ready(function() {

    updateDepartures();

    $('#filteredCheck').on('click', function() {
        localStorage.isFiltered = this.checked;
        updateDepartures();
    });

    function updateDepartures() {
        debugger;
        console.log("called");
        var departures = JSON.parse(localStorage.departures);
        $('#departureTable > tbody').html('');
        $.each(departures, function(index, departure) {
            if ( !localStorage.isFiltered || (localStorage.isFiltered && departure.)) {
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
            }
        });
    }
});