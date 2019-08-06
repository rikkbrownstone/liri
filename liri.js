require("dotenv").config(); //correct

var keys = require("./keys.js"); //correct

var axios = require("axios");

var Spotify = require("node-spotify-api"); 

var spotify = new Spotify(keys.spotify); 

var fs = require("fs");


var moment = require("moment");
moment().format();


var liriApp = process.argv[2];// for switch statment

var artist = process.argv.slice(3).join(" "); //To send the song/movie/concert to their respective functions

UserInputs(liriApp, artist);


//create a switch for  * `concert-this`* `spotify-this-song` * `movie-this`* `do-what-it-says`

UserInputs(liriApp, artist);

fs.appendFile('random.txt', liriApp + artist + " , ", function (err) {
    if (err) throw err;
 });


//FUNCTIONS
function UserInputs (liriApp, artist){
    switch (liriApp) {
    case "concert-this":
        concertThis(artist);
        break;
    case "spotify-this-song":
        spotifyThis(artist);
        break;
    case "movie-this":
        movieThis(artist);
        break;
    case "do-what-it-says":
        doThis();
        break;
    default: 
        console.log("Invalid Option. ")
    }
}

//create a function for concertThis(); use the parameter artist to send song/ movies to their respective function
 function concertThis(artist){
 axios.get("https://rest.bandsintown.com/artists/"  + artist + "/events?app_id=codingbootcamp").then(
   function(response){
       console.log(response.data);
       for(var i = 0; i < response.data; i++){

       var concertTime = response.data[i].concertTime;
       var concertArr = concertTime.split(" ");

      var scheduleResults = "\nVenueName: " + response.data[i].venue.name +
                             "\nVenueLocation: " + response.data[i].venue.city +
                             "\nVenueTime :" + moment(concertArr[i], "MM-DD-YYYY"); 

       console.log(scheduleResults);                      

       }
    }
 ).catch(function(error){
    if(error){
        console.log("this is error")
    }
 });
  };



//inside the function use axios get the complete url and api including keys
function movieThis(artist){

    if(!artist){
        artist = "mr nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + artist + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
        console.log(response.data);
            var movieResults = 
                "--------------------------------------------------------------------" +
                    "\nMovie Title: " + response.data.Title + 
                    "\nYear of Release: " + response.data.Year +
                    "\nIMDB Rating: " + response.data.imdbRating +
                     "\nRotten Tomatoes Rating: " + response.data.Ratings[0].Value +
                    "\nCountry Produced: " + response.data.Country +
                    "\nLanguage: " + response.data.Language +
                    "\nPlot: " + response.data.Plot +
                    "\nActors/Actresses: " + response.data.Actors;
            console.log(movieResults);

            
    })
    .catch(function (error) {
        console.log(error);
    });
    
}




 function spotifyThis(artist){

    if(!artist){
        artist = "I want it that way";
    }
    spotify.search({ type: 'track', query: artist })
    .then(function(response) {
        for (var i = 0; i < 5; i++) {
            var spotifyResults = 
                "--------------------------------------------------------------------" +
                   "\nArtist(s): " + response.tracks.items[i].artists[0].name + 
                   "\nSong Name: " + response.tracks.items[i].name +
                   "\nAlbum Name: " + response.tracks.items[i].album.name +
                   "\nPreview Link: " + response.tracks.items[i].preview_url;

                  
                    
        console.log(spotifyResults);
         }
 })
   .catch(function(err) {
        console.log(err);
     });
 }







function doThis() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        var dataArr = data.split(",");
        UserInputs(dataArr[0])
        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
    });
}