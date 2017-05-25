function calcStrFromMin(minutes) {
    if (parseInt(minutes) === 1440) { return '23:59'; }
    var hours = Math.floor(minutes / 60);
    minutes = minutes - (hours * 60);

    if (hours.toString().length == 1) hours = '0' + hours;
    if (minutes.toString().length == 1) minutes = '0' + minutes;  
    return hours + ':' + minutes;
}