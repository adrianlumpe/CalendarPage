

var eventArray;
var events;
var container = document.getElementById('event-container');

addEvents();

function createArray() {
    function el(start, end, name, dataevent) {
        this.start = start;
        this.end = end;
        this.name = name;
        this.dataevent = dataevent;
    }

    eventArray = [
        new el('12:30', '13:30', 'Rowing', 'event-1'),
        new el('15:30', '16:30', 'Yoga', 'event-2')
    ];
}



function addEvents() {
    createArray();
    container.innerHTML += '<span></span>';
    for(var i = 0; i < eventArray.length; i++){
        var li = document.createElement('li');
        console.dir(eventArray[i]);
        li.setAttribute('class', 'single-event');
        li.setAttribute('start', eventArray[i].start);
        li.setAttribute('end', eventArray[i].end);
        li.setAttribute('data-event', eventArray[i].dataevent);
        li.innerHTML = '<em class="event-name">' + eventArray[i].name + '</em>';
        container.appendChild(li);
        container.innerHTML += '<div></div>';
    }
    container.innerHTML += 'lel';
    console.log('this happens.')

}

//function placeEvents(){
//    container.innerHTML += 'HDHDHD';
//}



