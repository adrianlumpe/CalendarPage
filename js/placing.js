var eventArray;
var events;
var container = document.getElementById('event-container');

addEvents();
placeEvents();

function createArray() {
    function el(starth, startmin, endh, endmin, name, dataevent) {
        this.starthour = starth;
        this.startminute = startmin;
        this.endhour = endh;
        this.endmin = endmin;
        this.name = name;
        this.dataevent = dataevent;
    }

    eventArray = [
        new el(12, 30, 15, 15, 'Rowing', 'event-1'),
        new el(15, 30, 16, 30, 'Yoga', 'event-2')
    ];
}


function addEvents() {
    createArray();
    for (var i = 0; i < eventArray.length; i++) {
        var li = document.createElement('li');

        li.setAttribute('class', 'single-event');
        //li.setAttribute('start', eventArray[i].start);
        //li.setAttribute('end', eventArray[i].end);
        li.setAttribute('data-event', eventArray[i].dataevent);
        li.innerHTML = '<em class="event-name">' + eventArray[i].name + '</em>';
        container.appendChild(li);
    }

    events = document.getElementsByClassName('single-event');
    //console.dir(events);
    //console.dir(eventArray);


    //console.log('this happens.')

}

function placeEvents() {
    for (var i = 0; i < events.length; i++) {
        var topoffset = (eventArray[i].starthour - 9) * 100 + eventArray[i].startminute * 100/60 - 1;
        var elemheight = ((eventArray[i].endhour * 60 + eventArray[i].endmin) - (eventArray[i].starthour*60 + eventArray[i].startminute))*100/60
        events[i].style.top = topoffset + 'px';
        events[i].style.height = elemheight + 'px';
    }
}
