// COMMANDS
// concert-this / spotify-this-song / movie-this / do-what-it-says

require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const inquirer = require("inquirer");
const bandsintown = require("bandsintown")("codingbootcamp");

//var spotify = new Spotify(keys.spotify);

inquirer.prompt([{
        type: "list",
        name: "command",
        message: "What would are you looking to do?",
        choices: ["Find a band's upcoming shows", "Find a song's details", "Find a movie's details", "Find out something new"]
    },
    {
        name: "subject",
        message: "Which one?"
    }
]).then(function (answers) {
    let selectedCommand = answers.command
    let selectedSubject = answers.subject
    console.log("-----------------------------------")
    console.log(selectedCommand+":");
    switch (selectedCommand) {
        case "Find a band's upcoming shows":
            selectedCommand = "concert-this"
            console.log(selectedSubject)
            axios.get("https://rest.bandsintown.com/artists/" + selectedSubject + "/events?app_id=codingbootcamp").then(response => {
                    for (var i = 0; i < 3; i++) {
                        console.log("------------------")
                        console.log("Venue: " + response.data[i].venue.name)
                        console.log("City: " + response.data[i].venue.city)
                        // console.log("Time: " + moment(response.data[i].datetime).format("MM/DD/YYYY"))
                        console.log("Time: " + response.data[i].datetime)
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        console.log("We cant find anything for your search")
                    } else if (error.request) {
                        console.log("We cant find anything for your search")
                    } else {
                        console.log("We cant find anything for your search")
                    }
                    console.log("We cant find anything for your search")
                })
            break;
        case "Find a song's details":
            selectedCommand = "spotify-this-song"
            console.log(selectedCommand + " " + selectedSubject)
            break;
        case "Find a movie's details":
            selectedCommand = "movie-this"
            // axios.get("http://www.omdbapi.com/?t=avatar")
            console.log(selectedCommand + " " + selectedSubject)
            break;
        case "Find out something new":
            selectedCommand = "do-what-it-says"
            console.log(selectedCommand + " " + selectedSubject)
            break;
        default:
            console.log("Whomp Whomp.... You manged to break the app!")
            break;
    }
});