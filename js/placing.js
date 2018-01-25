var eventArray = [];
var events;
var container = document.getElementById('event-container');

//********************************************************************


var CLIENT_ID = '114325445334423435672';
var API_KEY = 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCg+KKMlK6O1EaT\\nlnyPA0AKDFHdtMZYwivRLiugmmdB23oKmSjeGTMNQ4blw3XgWmGRR4TnRnLjV2VI\\n61k3EOr4eDh6h7i3eUo5+U7vVriHhpftCVGOWj2q9KCynT3hy0ezbYEksV+hU7Hn\\nCSke+KDhBK4Qljki09FB01YyODpaqrjeLwz7Wdc5BYoDRkl5ipDZD4knzhpHQlu5\\nrmcA3wHqqQqTMACWQAoGZAgfgZcN5YiGyZRmUSA5bpe5lWF8F6sld+wVhosPQFi/\\nzUdXD3HkLdVQsyVEhN7r2Hu6nyC0+T1CouZMQ8zM4keWCvqsFo8EYRGmdBPPpWez\\nax5kfMxLAgMBAAECggEAFizfv7wafASpoFqtLXUbf7GIyaEbaKN/Lnb3faLSXL6O\\nhnfpAF0PrQvDa/2hodbxn/ZD9ym7rq6d07jQS9y3HKRQgNjCTUxBOdFVhXU4leWo\\nd6K+qydVXYALxJoS1KXmFRrIcrSYtvx1Ap3pc0x5upCkJhbRJ4dvSWvYG7JRSlII\\nb9vSFMQ90D0wFh0pXtCv4EMnXptD1qLNE0CXYR9KdXJTEP8JJyHV71Hj14zgDI4u\\npePlJKbkms1/xEPKTqkslcBmOqM+gwun/GQfc0xvZCZwIwSOYsPO4DLr7kh4jFyX\\ntx8S3lc1XTNo+8pmdKx5MdE1KYF5xXFQrdcoJXOvYQKBgQDaygO+4a3A5+fmkGNM\\nPXqWgDu7xyFLSbvlJV7uM1vjoROujEWk+96ObPfi/Is5tm1LHcafAeY1vo/OcMhg\\nQQ0I6ucxY3gl+d6IXML9+fQWtmDgo7h2DvVz03u+c5yH8XRhpF+tmUDoRCJ+8/fc\\n6Yfcmt7qk9Lvg7ftf03jfO8UkQKBgQC8WUEEdGZOuuPXZXe3n5GNCglzhHXOSMVt\\n6Rx/7ZTv7yVhOc9jSFSnqKnhD+zW1NccTHr07E3YN+lKNm4EhDjYfkS86mdIusXo\\nKoQJ69THi5XhwmL7cnsFsmSxrJ+rmKktvi/iL3DrTxTEtuLNLpLg2YTT+zfl/j3Q\\nRqnCPGgRGwKBgAQAtCbW3CXuWDjIpXhsm4SLXgxmbT6CX9SmZWE4QVMdzE1iNZf6\\nH609Yx+c/TMWGlPIfKzGDR8omFrvh0rzhbiHC6nEpxsSwjZ+c/bPjt6ngYg6lpJa\\nXbU7xkTKuq9mBHoQ1stHRX+6V2M5NWyuPRUVJEToZXCKWWAX9yXVUE5xAoGABZTH\nfnBMj8yt77YMBB7wWzOO8CNeskwpvYYI2CmcHjgB7Y2e/ZwpFgbDce3c4MjRzv7d\nLeDKtbuCaDaQsAWTAadMNiTkBp2yO5z26KxaU8dpG5V9BWJxDswoe7NXz+foK3jV\nRmiNeguP2/xnYBkfNRZ8/yMUlvYfsspFQYI0uz0CgYEAzYRauy86MTJ2rNnwalgI\nSsYizlhEOVf7KzJVaNleEwKiYD5bHS4k/NbMphOGRO93dI7WuLCLZogLegRoWuz7\nBwjOe+oubrYy5NYDM2Bx18mIdXT5ABZF7t92dIUuOTu4Ng/TqwL1KNy3K/tQCXzV\nG0id8C+1a+pfEutKBMms7Yk=';

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

            addEvents();
            placeEvents();
            setOcc();
            addAndPlaceRedBar();
        }
    });

}

function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

//*****************************************************************