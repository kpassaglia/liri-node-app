// COMMANDS
// concert-this / spotify-this-song / movie-this / do-what-it-says

require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const inquirer = require("inquirer");
const moment = require('moment');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
var fs = require('fs');
let selectedCommand = "";
let selectedSubject = "";
//const bandsintown = require("bandsintown")("codingbootcamp");

inquirer.prompt([{
        type: "list",
        name: "command",
        message: "What would are you looking to do?",
        choices: ["Find a band's upcoming shows", "Find a song's details", "Find a movie's details", "Find out something new"]
    },
    {
        name: "subject",
        message: "Which one? (Unless you are looking for something random.  Hit Enter to see what you get!)"
    }
]).then(function (answers) {
    selectedCommand = answers.command
    selectedSubject = answers.subject

    function initAPI() {
        console.log("-----------------------------------");
        console.log(selectedCommand + ":");

        switch (selectedCommand) {
            case "Find a band's upcoming shows":
                console.log(selectedSubject)
                axios.get("https://rest.bandsintown.com/artists/" + selectedSubject + "/events?app_id=codingbootcamp").then(response => {
                        for (var i = 0; i < 3; i++) {
                            console.log("------------------")
                            console.log("Venue: " + response.data[i].venue.name)
                            console.log("City: " + response.data[i].venue.city)
                            console.log("Time: " + moment(response.data[i].datetime).format("MM/DD/YYYY"))
                            console.log("------------------")
                        }
                    })
                    .catch((error) => {
                        if (error.response) {
                            console.log("We cant find anything for your search")
                        } else if (error.request) {
                            console.log("Something went wrong with your request, please try again")
                        } else {
                            console.log("I dont know...this is a wierd one")
                        }
                    })
                break;
            case "Find a song's details":
                console.log(selectedSubject)
                if (selectedSubject === "") {
                    selectedSubject = "The Sign ace of base"
                }
                spotify.search({
                    type: 'track',
                    query: selectedSubject
                }, function (error, data) {
                    if (error) {
                        console.log('Error occurred: ' + error);
                    } else {
                        for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
                            if (i === 0) {
                                console.log("------------------")
                                console.log("Artist(s): " + data.tracks.items[0].artists[i].name);
                            } else {
                                console.log("------------------")
                                console.log(" " + data.tracks.items[0].artists[i].name);
                            }
                        }
                        console.log("Song: " + data.tracks.items[0].name);
                        console.log("Preview Link: " + data.tracks.items[0].preview_url);
                        console.log("Album: " + data.tracks.items[0].album.name);
                        console.log("------------------")
                    }
                });
                break;
            case "Find a movie's details":
                if (selectedSubject === "") {
                    selectedSubject = "Mr. Nobody"
                }
                console.log(selectedSubject);
                axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + selectedSubject).then(response => {
                        console.log("------------------")
                        console.log("Title: " + response.data.Title)
                        console.log("Released: " + moment(response.data.Released, "DD MMM YYYY").format("MM/DD/YYYY"))
                        console.log("IMDB Rating: " + response.data.Ratings[0].Value)
                        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
                        console.log("Production Location: " + response.data.Country)
                        console.log("Language: " + response.data.Language)
                        console.log("Plot: " + response.data.Plot)
                        console.log("Actors: " + response.data.Actors)
                        console.log("------------------")
                    })
                    .catch((error) => {
                        if (error.response) {
                            console.log("We cant find anything for your search")
                        } else if (error.request) {
                            console.log("Something went wrong with your request, please try again")
                        } else {
                            console.log("I dont know...this is a wierd one")
                        }
                    });
                break;
                // case "Find out something new":


                //     break;
            default:
                console.log("Whomp Whomp.... You manged to break the app![Commands for API Calls]")
                break;
        }
    }
    if (selectedCommand === "Find out something new") {
        fs.readFile("random.txt", "utf8", function (error, data) {
            var randomData = data.split(",")
            switch (randomData[0]) {
                case 'concert-this':
                    selectedCommand = "Find a band's upcoming shows";
                    break;
                case 'spotify-this-song':
                    selectedCommand = "Find a song's details";
                    break;
                case 'movie-this':
                    selectedCommand = "Find a movie's details";
                    break;
                default:
                    console.log("Whomp Whomp.... You manged to break the app! [Random File]")
                    break;
            }
            selectedSubject = randomData[1]
            initAPI();
        })
    } else {

        initAPI();
    }
});