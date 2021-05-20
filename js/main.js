// Declarations for our song values
let song;
let playSong;

// Spotify Client Credentials
const clientId = 'YOUR-CLIENT-ID';
const clientSecret = 'YOUR-CLIENT-SECRET';

// Function to get token from Spotify
const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    // console.log(result);
    const data = await result.json();
    console.log(data);
    return data.access_token;
}

// const _getToken2 = () => {
//     fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
//         },
//         body: 'grant_type=client_credentials'
//     }).then(result => result.json())
//     .then(data => console.log(data))
// }


/**
 * @param track
 * @param artist
 * 
 * Function gets song from Spotify using the track and artist as query params
 * and returns the song's preview_url
 */
const searchSong = async(track, artist) => {
    // Get Token
    let token = await _getToken();

    // Set up info for request
    let headers = new Headers([
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
        ['Authorization', `Bearer ${token}`]
    ])

    let request = new Request(`https://api.spotify.com/v1/search?q=${track},${artist}&type=track,artist&limit=5`, {
        method: 'GET',
        headers: headers
    });

    // Make the request to Spotify
    let result = await fetch(request);

    let response = await result.json();
    console.log(response);
    
    // Grab song preview_url from response
    let song = response.tracks.items[0].preview_url;
    return song;
}

/**
 * @param url
 * 
 * url = song preview_url
 * 
 * Function will return an audio clip from the preview_url
 */
const songSnippet = (url) => {
    playSong = new Audio(url);
    return playSong.play();
}

/**
 * NO PARAMS
 * 
 * Function returns event to stop song snipped
 */
const stopSnippet = () => {
    playSong.pause();
}

/**
 * @param figId
 * 
 * Function to trigger getting song from spotify and then playing song
 */
const clickedEvent = async (figId) => {
    // Get image tag from figId
    let image = document.getElementById(figId).children[0];
    let songInfo = image.alt;
    let track = songInfo.split(' - ')[0];
    let artist = songInfo.split(' - ')[1];
    console.log(track,artist);

    let song = await searchSong(track, artist);

    if (playSong){
        stopSnippet();
    }
    songSnippet(song);
}