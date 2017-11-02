function calcStrFromMin(minutes) {
    if (parseInt(minutes) === 1440) { return '23:59'; }
    var hours = Math.floor(minutes / 60);
    minutes = minutes - (hours * 60);

    if (hours.toString().length == 1) hours = '0' + hours;
    if (minutes.toString().length == 1) minutes = '0' + minutes;  
    return hours + ':' + minutes;
}

function getLabelPath(name) {
    var imagesPath = 'images/labels/';
    switch (localStorage.location) {
        case 'Zürich-ZVV':
            imagesPath = imagesPath + 'zvv/';
            break;
        case 'Basel-BVB':
        case 'Bern-Bern-Mobil':
        default:
            imagesPath = '';
            break;
    }
    var icon = 'images/48.png';
    if (name.startsWith('T')) {
        icon = imagesPath + name.replace(' ', '') + '.png';
    }
    return icon;
}

function cmpDestinations(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    if (a.to < b.to)
        return -1;
    if (a.to > b.to)
        return 1;
    return 0;
}

function loadDestinationsFromStorage() {
    return JSON.parse(localStorage.destinations).sort(cmpDestinations);
}

function saveDestinationsToStorage(destinations) {
    localStorage.destinations = JSON.stringify(destinations);
}

function isDestinationActive(destinations, name, to) {
    var result = $.grep(destinations, function(e) { return (e.name === name && e.to === to); });

    if (result.length === 1) {
        return result[0].isActive;
    }
    return false;
}

function getIsFiltered() {
    return (localStorage.isFiltered === 'true');
}

function setIsFiltered(isFiltered) {
    localStorage.isFiltered = isFiltered;
}