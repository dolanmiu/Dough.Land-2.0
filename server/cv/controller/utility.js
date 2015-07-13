/*globals exports, require */

function getMonthFromInt(value) {
    'use strict';

    switch (value) {
    case 1:
        return 'Jan';
    case 2:
        return 'Feb';
    case 3:
        return 'Mar';
    case 4:
        return 'Apr';
    case 5:
        return 'May';
    case 6:
        return 'Jun';
    case 7:
        return 'Jul';
    case 8:
        return 'Aug';
    case 9:
        return 'Sept';
    case 10:
        return 'Oct';
    case 11:
        return 'Nov';
    case 12:
        return 'Dec';
    }
}

exports.createPositionDateText = function (startDate, endDate, isCurrent) {
    'use strict';

    var startDateText, endDateText;

    startDateText = getMonthFromInt(startDate.month) + '. ' + startDate.year;

    if (isCurrent) {
        endDateText = 'Present';
    } else {
        endDateText = getMonthFromInt(endDate.month) + '. ' + endDate.year;
    }
    return startDateText + ' - ' + endDateText;
};

exports.splitParagraphTextIntoBullets = function (paragraph) {
    'use strict';
    
    return paragraph.split('\n\n');
};