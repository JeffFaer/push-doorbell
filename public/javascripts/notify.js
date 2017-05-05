'use-strict';

maybeNotify = function(notify) {
    isBefore = function(hour1, minute1, hour2, minute2) {
        if (hour1 < hour2) {
            return true;
        } else if (hour1 == hour2) {
            return minute1 < minute2;
        }

        return false;
    };
    inInterval = function(startHour, startMinute, endHour, endMinute, hour,
            minute) {
        var afterStart = isBefore(startHour, startMinute, hour, minute);
        var beforeEnd = isBefore(hour, minute, endHour, endMinute);

        if (isBefore(endHour, endMinute, startHour, startMinute)) {
            return afterStart || beforeEnd;
        }

        return afterStart && beforeEnd;
    };

    fetch('/prefs').then(function(response) {
        if (response.ok) {
            return response.json();
        }

        throw "Could not get preferences: "
            + `(${response.status}) ${response.statusText}`
    })
    .then(function(prefs) {
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();

        var startTimes = prefs.quietTimeStart.split(':');
        var startHour = parseInt(startTimes[0]);
        var startMinute = parseInt(startTimes[1]);

        var endTimes = prefs.quietTimeEnd.split(':');
        var endHour = parseInt(endTimes[0]);
        var endMinute = parseInt(endTimes[1]);

        if (inInterval(startHour, startMinute, endHour, endMinute, hour,
                    minute)) {
            throw 'Quiet time!'
        }

        return notify();
    })
    .catch(function(e) {
        console.log('Not notifying.', e);
    });
};
