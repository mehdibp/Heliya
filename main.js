const API_KEY = "QJIaF28DR5Vxw9RRodeRJujQhvYlurjKz4miNh0b";
const URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

fetch(URL)
    .then(response => response.json())
    .then(data => { document.getElementById("apod-header").style.backgroundImage = `url(${data.url})`; })
    .catch(err => console.error("Error retrieving APOD:", err));


