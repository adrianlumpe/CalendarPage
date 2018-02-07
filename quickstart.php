<?php
require_once __DIR__ . '/vendor/autoload.php';

class Event
{
    public $starth, $startm;
    public $endh, $endm;
    public $name;
}

$events;

putenv('GOOGLE_APPLICATION_CREDENTIALS=tesst.json');


define('APPLICATION_NAME', 'Google Calendar API PHP Quickstart');
define('CREDENTIALS_PATH', '~/.credentials/calendar-php-quickstart.json');
define('CLIENT_SECRET_PATH', __DIR__ . '/client_secret.json');
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-php-quickstart.json
define('SCOPES', implode(' ', array(
        Google_Service_Calendar::CALENDAR_READONLY)
));


/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient() {
    $client = new Google_Client();
    $client->useApplicationDefaultCredentials();
    $client->setApplicationName(APPLICATION_NAME);
    $client->setScopes(SCOPES);
    $client->setAuthConfig(CLIENT_SECRET_PATH);
    $client->setAccessType('offline');

    // Load previously authorized credentials from a file.
    $credentialsPath = expandHomeDirectory(CREDENTIALS_PATH);
    if (file_exists($credentialsPath)) {
        $accessToken = json_decode(file_get_contents($credentialsPath), true);
    } else {
        // Request authorization from the user.
        $authUrl = $client->createAuthUrl();
        printf("Open the following link in your browser:\n%s\n", $authUrl);
        print 'Enter verification code: ';
        $authCode = trim(fgets(STDIN));

        // Exchange authorization code for an access token.
        $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);

        // Store the credentials to disk.
        if(!file_exists(dirname($credentialsPath))) {
            mkdir(dirname($credentialsPath), 0700, true);
        }
        file_put_contents($credentialsPath, json_encode($accessToken));
        printf("Credentials saved to %s\n", $credentialsPath);
    }
    $client->setAccessToken($accessToken);

    // Refresh the token if it's expired.
    if ($client->isAccessTokenExpired()) {
        $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        file_put_contents($credentialsPath, json_encode($client->getAccessToken()));
    }
    return $client;
}

/**
 * Expands the home directory alias '~' to the full path.
 * @param string $path the path to expand.
 * @return string the expanded path.
 */
function expandHomeDirectory($path) {
    $homeDirectory = getenv('HOME');
    if (empty($homeDirectory)) {
        $homeDirectory = getenv('HOMEDRIVE') . getenv('HOMEPATH');
    }
    return str_replace('~', realpath($homeDirectory), $path);
}

// Get the API client and construct the service object.
$client = getClient();
$service = new Google_Service_Calendar($client);

// Print the next 10 events on the user's calendar.
$calendarId = '4ft.de_arjfo6n942gusvbcjbjg87r93c@group.calendar.google.com';
$v = new DateTime();
$m = new DateTime();
$v->setTime(0,0,0);
$m->setTime(0,0,0);
$m->modify('+1 day');

$events = array();


$optParams = array(
    'maxResults' => 10,
    'orderBy' => 'startTime',
    'singleEvents' => TRUE,
    'timeMin' => $v->format('c'),
    'timeMax' => $m->format('c')

);
$results = $service->events->listEvents($calendarId, $optParams);

if (count($results->getItems()) == 0) {
    print "No upcoming events found.\n";
} else {
    //print "Upcoming events:\n";
    foreach ($results->getItems() as $event) {
        $start = new DateTime($event->start->dateTime);
        $end = new DateTime($event->end->dateTime);
        if (empty($start)) {
            $start = $event->start->date;
        }
        //printf("%s (%s)\n", $event->getSummary(), $start);

        $ev = new Event;
        $ev->starth = $start->format('H');
        $ev->startm = $start->format('i');
        $ev->endh = $end->format('H');
        $ev->endm = $end->format('i');
        $ev->name = $event->getSummary();
        $events[] = $ev;
    }
    setOccupied($events);
    echo '<ul id="event-container">';
    addAndPlaceRedBar();
    for($i=0; $i < count($events); $i++) {
        $timestring = $events[$i]->starth . ':' . $events[$i]->startm . ' - ' . $events[$i]->endh . ':' . $events[$i]->endm;
        $topoffset = ($events[$i]->starth -9) * 100 + $events[$i]->startm * 100/60 - 1;
        $add_txt = '<li class="single-event" data-event="event-1" style="top: ' . $topoffset . 'px"><span class="event-date">' . $timestring . '</span><em class="event-name">' . $events[$i]->name . '</em></li>';
        echo $add_txt;
    }
}

function addAndPlaceRedBar(){
    $offset = (date('H') - 8) * 100 + date('i') * 100/60 - 1;
    echo '<div class="redbar" style="top: ' . $offset . 'px"></div>';
}

function setOccupied($events){
    if(activeEvent($events)){
        $col = '#8e1318';
    } else{
        $col = '#2d7215';
    }
    echo '<div class="top-info" style="background-color: ' . $col . '"><span>&#8592; Houston</span></div>';
}

function activeEvent($events){
    for($i=0; $i < count($events); $i++) {
        echo $events[$i]->name;
    }
    return true;
}