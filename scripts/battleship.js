let view = {
    displayMessage: function(msg) {
        document.getElementById("messageArea").innerHTML = msg;
    },
    displayHit: function(location) {
        document.getElementById(location).setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        document.getElementById(location).setAttribute("class", "miss");
    }
};

let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [{locations: ["", "", ""], hits: ["","",""]},
            {locations: ["", "", ""], hits: ["","",""]},
            {locations: ["", "", ""], hits: ["","",""]}],
    
    fire: function(location) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(location);
            if (index >= 0) {
                if(ship.hits[index] !== "hit") {
                    ship.hits[index] = "hit";
                    if (this.isSunk(ship)) {
                        this.shipsSunk++;
                    }
                }
                view.displayMessage("Hit");
                view.displayHit(location);
                
                return true;
            }
        }

        // if fire is miss
        view.displayMessage("You missed.");
        view.displayMiss(location);
        return false;
    },
    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    generateShipLocations:function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip:function() {
        let locations = [];
        let row, col;

        // 0 is horizontal, 1 is vertical
        let direction = Math.floor(Math.random() * 2);

        if (direction === 0) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        for (let i = 0; i < this.shipLength; i++) {
            let index;
            if (direction === 0) {
                index = row + "" + (col + i);
            } else {
                index = (row + i) + "" + col;
            }
            locations.push(index);
        }
        return locations;
    },
    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                let index = ship.locations.indexOf(locations[j]);
                if (index >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

let controller = {
    guesses: 0,

    processingGuess: function(guess) {
        let location = this.parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(`You sank all the ships with ${this.guesses} guesses. Congrats!`);
                document.getElementById("inputText").disabled = true;
                document.getElementById("fireButton").disabled = true;

            }
        }
    },
    parseGuess: function(guess) {
        let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
        if (guess.length !== 2) {
            alert("Opps, please enter a letter followed by a number");
        } else {
            let firstChar = guess.charAt(0);
            let row = alphabet.indexOf(firstChar); // number
            let col = guess.charAt(1); // string
            if (row === -1) {
                alert("404 Not Found Location :)");
            } else if (isNaN(col) || col === " " || col < 0 || col >= model.boardSize) {
                alert("Oops, that's off the board!");
            } else {
                return row + col;
            }
        }
        return null;
    }
}

function handleFireButton() {
    let inputText = document.getElementById("inputText");
    console.log(inputText.value);
    controller.processingGuess(inputText.value);
    inputText.value = "";
}

function handleInputPress(e) {
    if (e.keyCode === 13) {
        document.getElementById("fireButton").click();
        return false;
    }
}

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    let inputText = document.getElementById("inputText");
    inputText.onkeypress = handleInputPress;

    model.generateShipLocations();
}

window.onload = init;