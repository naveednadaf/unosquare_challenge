const { v4: uuid } = require("uuid");

const words = ["Banana", "Canine", "Unosquare", "Airport"];
const games = {};

const retrieveWord = () => words[Math.floor(Math.random(words.length - 1))];

const clearUnmaskedWord = (game) => {
    const withoutUnmasked = { 
        ...game,
    };
    delete withoutUnmasked.unmaskedWord;
    return withoutUnmasked;
}

function createGame(req, res) {
  const newGameWord = retrieveWord();
  const newGameId = uuid();
  const newGame = {
    word: newGameWord.replaceAll(/[a-zA-Z0-9]/g, "_ "),
    incorrectGuesses: [],
    remainingGuesses: 6,
    unmaskedWord: newGameWord,
    status: "in progress",
  };

  games[newGameId] = newGame;

  res.send(newGameId);
}

function getGame(req, res) { 
    const { gameId } = req.params;
    if (!gameId) return res.sendStatus(404);

    var game = games[gameId];
    if (!game) {
        return res.sendStatus(404); 
    }

    res.status(200).json(clearUnmaskedWord(game));
}

function createGuess(req, res) { 
    const { gameId } = req.params;
    const { letter } = req.body;
    const uppercaseLetter = letter.toUpperCase();

    if (!gameId) return res.status(404).json({
        Message:"Invalid Game id"
    });

    var game = games[gameId];
    if (!game) return res.status(404).json({
        Message:"Invalid Game"
    }); 

    if (!letter || letter.length != 1) {
        return res.status(400).json({
            Message: "Guess must be supplied with 1 letter"
        })
    }
    const newGameWord = game.unmaskedWord.toUpperCase();
    const newWordArray = game.word.split(" ");
  
    if (newGameWord.includes(uppercaseLetter)) {
      const updatedWordArray = newWordArray.map((char, index) =>
        newGameWord[index] === uppercaseLetter ? uppercaseLetter : char
      );
      game.word = updatedWordArray.join(" ");
    } else {
      game.incorrectGuesses.push(uppercaseLetter);
      game.remainingGuesses--;
    }
  
    if (!game.word.includes("_")) {
      game.status = "won";
      game.remainingGuesses = 0;
      game.word = newGameWord;
    } else if (game.remainingGuesses === 0) {
      game.status = "lost";
      game.remainingGuesses = 0;
      game.word = newGameWord;
    }
    res.status(200).json(clearUnmaskedWord(game));

    return res.status(200).json(clearUnmaskedWord(game));
}

function deleteGame(req, res){
    const {gameId} =req.params;
    if(!gameId) return res.status(404).json({
        Message : "Not a game id "
    });
    if(games[gameId]){
        delete games[gameId];
        return res.status(200).json({
            Message : "Game Deleted!"
        });
    }else{
        return res.status(404).json({
            Message : "Invalid Game id"
        });
    }
}
module.exports = {
    createGame,
    getGame,
    createGuess,
    deleteGame,
  };