var eventArray = [];
var events;
var container = document.getElementById('event-container');

//********************************************************************


var CLIENT_ID = '546406238697-jfa2r91nieo8sq1aagr3dmnirqt74mmv.apps.googleusercontent.com';
var API_KEY = 'AIzaSyB01CIeKocaGnaZVcHM2gZ_zhYFF7t6z_c';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
//********************************************************************


function addAndPlaceRedBar() {
    var bar = document.createElement('div');
    bar.setAttribute('class', 'redbar');

    var d = new Date();
    var os = (d.getHours()-9)*100 + d.getMinutes()*100/60 - 2;
    bar.style.top = os + 'px';
    container.appendChild(bar);
}

function el(starth, startmin, endh, endmin, name, dataevent) {
    this.starthour = starth;
    this.startminute = startmin;
    this.endhour = endh;
    this.endmin = endmin;
    this.name = name;
    this.dataevent = dataevent;
}

function setOcc() {
    var topdiv = document.getElementsByClassName('top-info');
    console.dir(topdiv);
    if(activeEvent()){
        topdiv[0].style.backgroundColor = '#2d7215';
    } else{
        topdiv[0].childNodes[0].innerHTML += '<span class="occ"> (aktuell besetzt)</span>';
        topdiv[0].style.backgroundColor = '#8e1318';
    }
}

function activeEvent(){
    for (var i = 0; i < eventArray.length; i++) {
        var c = new Date();
        var cmid = c.getHours()*60 + c.getMinutes(); // current minutes into day
        var esmid = eventArray[i].starthour*60 + eventArray[i].startminute;
        var eemid = eventArray[i].endhour*60 + eventArray[i].endmin;
        if(cmid > esmid && cmid < eemid){
            return false;
        }
    }
    return true;
}


function addEvents() {

    for (var i = 0; i < eventArray.length; i++) {
        var li = document.createElement('li');

        li.setAttribute('class', 'single-event');
        //li.setAttribute('start', eventArray[i].start);
        //li.setAttribute('end', eventArray[i].end);
        li.setAttribute('data-event', eventArray[i].dataevent);
        li.innerHTML += '<span class="event-date">' + ('0' + eventArray[i].starthour).slice(-2) + ':' + ('0' + eventArray[i].startminute).slice(-2) + ' - ' + ('0' + eventArray[i].endhour).slice(-2) + ':' + ('0' + eventArray[i].endmin).slice(-2) + '</span>';
        li.innerHTML += '<em class="event-name">' + eventArray[i].name + '</em>';
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


//************************* API functions *************************

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    var events;
    var da_midn = new Date();
    da_midn.setHours(0);
    var da = new Date();
    da.setDate(da.getDate() + 1);
    da.setHours(0);
    console.log(da);
    gapi.client.calendar.events.list({
        //'calendarId': '4ft.de_3338363435393232383037@resource.calendar.google.com',
        'calendarId': '4ft.de_3935373337323934323134@resource.calendar.google.com',
        'timeMin': (da_midn.toISOString()),
        'timeMax': da.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        events = response.result.items;

        if (events.length >= 0) {
            for (var i = 0; i < events.length; i++) {
                var ev = events[i];
                var d_start = parseISOString(ev.start.dateTime);
                var d_end = parseISOString(ev.end.dateTime);

                eventArray.push(new el(d_start.getHours(), d_start.getMinutes(), d_end.getHours(), d_end.getMinutes(), ev.summary, 'event-1'));
            }
            addAndPlaceRedBar();
            addEvents();
            placeEvents();
            setOcc();
        }
    });

}

function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

//*****************************************************************