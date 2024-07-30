$(document).ready(function() {
    $('select').formSelect();
});

const facebookBtn = document.querySelector(".facebook-btn");
const twitterBtn = document.querySelector(".twitter-btn");
const redditBtn = document.querySelector(".reddit-btn");

document.getElementById("memeButton").addEventListener("click", function(event) {
    event.preventDefault();
    async function fetchDataFromApi(url) {
        try {
            let response = await fetch(url);
            let results = await response.json();
            if (results.nsfw) {
                return fetchDataFromApi(url); 
            } else {
                return results; 
            }
        } catch (error) {
            console.error("Error fetching meme:", error);
        }
    }
    fetchDataFromApi('https://meme-api.com/gimme').then((data) => {
        var memeLink = data.url;
        document.getElementById("joke1").innerHTML = `<img src="${memeLink}" class="mx-auto rounded"/>`;
        document.getElementById("joke2").innerHTML = "";
        localStorage.setItem("setup", "");
        localStorage.setItem("delivery", "");
        localStorage.setItem("joke", "");
        localStorage.setItem("memePic", memeLink);
    });
});

document.getElementById("jokeButton").addEventListener("click", function(event) {
    event.preventDefault();
    var requestUrl = "https://v2.jokeapi.dev/joke/"
    var ourFilter = $("#filters").val();
    var category = $("#categories").val();

    if (category.length > 0) {
        requestUrl = requestUrl + category;
    } else {
        requestUrl = requestUrl + "Any";
    }
    if (ourFilter.length > 0) {
        requestUrl = requestUrl + "?blacklistFlags=" + ourFilter;
    }

    function getRandomJoke() {
        fetch(requestUrl).then(function(response) {
            if (!response.ok) {
                document.getElementById("joke1").innerText = "There was an error retrieving the joke.";
                document.getElementById("joke2").innerHTML = "";
            }
            return response.json();
        }).then(function(data) {
            console.log(data);
            if (data.type == "twopart") {
                var jokeSetup = data.setup;
                var jokeDelivery = data.delivery;
                document.getElementById("joke1").innerText = jokeSetup;
                document.getElementById("joke2").innerText = jokeDelivery;
                localStorage.setItem("setup", jokeSetup);
                localStorage.setItem("delivery", jokeDelivery);
                localStorage.setItem("joke", "");
                localStorage.setItem("memePic", "");
            } else {
                var oneLineJoke = data.joke;
                document.getElementById("joke1").innerText = oneLineJoke;
                document.getElementById("joke2").innerHTML = "";
                localStorage.clear();
                localStorage.setItem("setup", "");
                localStorage.setItem("delivery", "");
                localStorage.setItem("joke", oneLineJoke);
                localStorage.setItem("memePic", "");
            }
            return;
        });
    }
    getRandomJoke();
});

lastGeneratedJoke();
share();

function lastGeneratedJoke() {
    let lineOne = localStorage.getItem("setup");
    let lineTwo = localStorage.getItem("delivery");
    let oneLiner = localStorage.getItem("joke");
    let meme = localStorage.getItem("memePic");

    if (lineOne && lineTwo) {
        document.getElementById("joke1").textContent = lineOne;
        document.getElementById("joke2").textContent = lineTwo;
    } else if (oneLiner) {
        document.getElementById("joke1").innerText = oneLiner;
        document.getElementById("joke2").innerHTML = "";
    } else {
        document.getElementById("joke1").innerHTML = `<img src="${meme}" class="mx-auto rounded"/>`;
        document.getElementById("joke2").innerHTML = "";
    }
}

function share() {
    var jokeOutput = localStorage.getItem("setup");
    var jokeOutput2 = localStorage.getItem("delivery");
    var jokeOutput3 = localStorage.getItem("joke");
    var jokeOutput4 = localStorage.getItem("memePic");
    let postURL = encodeURI(document.location.href);
    let postTitle = encodeURI(jokeOutput + " " + jokeOutput2 + jokeOutput3 + jokeOutput4);

    facebookBtn.setAttribute("href", `https://www.facebook.com/sharer/sharer.php?u=${postURL}`);
    twitterBtn.setAttribute("href", `https://twitter.com/share?url=${postURL}&text=${postTitle}`);
    redditBtn.setAttribute("href", `https://reddit.com/submit?url=${postURL}&title=${postTitle}`);
}

const modalTriggers = document.querySelectorAll('.modal-trigger');
const modalClose = document.querySelector('.modal-close');
const modal = document.querySelector('#demo-modal');

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
});



document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById("themeToggle");

    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark-mode", currentTheme === "dark");
    document.body.classList.toggle("light-mode", currentTheme === "light");

    // Change the button text based on the current theme
    themeToggle.textContent = currentTheme === "dark" ? "☀" : "🌑";

    // Event listener for the theme toggle button
    themeToggle.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        document.body.classList.toggle("light-mode");

        // Get the updated theme
        const updatedTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";

        // Change the button text based on the updated theme
        themeToggle.textContent = updatedTheme === "dark" ? "☀" : "🌑";

        // Save the user's preference in local storage
        localStorage.setItem("theme", updatedTheme);
    });
});
