function rangePercentage(input, range_min, range_max, range_2ndMax) {

    var percentage = ((input - range_min) * 100) / (range_max - range_min);

    if (percentage > 100) {

        if (typeof range_2ndMax !== 'undefined') {
            percentage = ((range_2ndMax - input) * 100) / (range_2ndMax - range_max);
            if (percentage < 0) {
                percentage = 0;
            }
        } else {
            percentage = 100;
        }

    } else if (percentage < 0) {
        percentage = 0;
    }

    return percentage;
}

console.log(rangePercentage(0.9, 0.3, 1.0, 5.0))