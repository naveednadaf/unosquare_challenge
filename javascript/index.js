const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { json, urlencoded } = require("body-parser");
const gamesController = require("./controllers/game");

const app = express();
app.use(cors());
app.use(json());
app.use(morgan("tiny"));
app.use(urlencoded({ extended: true }));

app.post("/games", gamesController.createGame);
app.get("/games/:gameId", gamesController.getGame);
app.post("/games/:gameId/guesses", gamesController.createGuess);

app.listen(4567);

app.get('/', (req, res) => {
    const game = gamesController.createGame(req, res); // Invoke the createGame function
    res.send(game); // Send the result of createGame as the response
});

  