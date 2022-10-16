const url =
	"https://raw.githubusercontent.com/Galtrips/Bomb-Party/main/words.json";

let json;
let interval;
let markingIntervalID;

let passedPlayer;
let player;

let used = [];
let activated = true;
let selfTurn;

fetch(url)
	.then((res) => res.json())
	.then(async (out) => {
		json = out;

		console.log("Loaded json with " + json["length"] + " words");
		selfTurn = document.querySelector(".selfTurn");

		if (!selfTurn) {
			let intervalID = setInterval(function () {
				console.log("Waiting for the start of the game ...");
				selfTurn = document.querySelector(".selfTurn");
				if (selfTurn) {
					console.log("Game location found ✅");
					clearInterval(intervalID);
					start(selfTurn.children[0].children[0]);
				}
			}, 1000);
		} else {
			start(selfTurn.children[0].children[0]);
		}
	});

function start(input) {
	interval = setInterval(function () {
		player = document.querySelector("span.player").innerHTML;
		if (activated === true) {
			let text = document.querySelector(".syllable").innerHTML;

			let foundWord;
			for (let word of json) {
				if (word.label.includes(text) && !used[word.label]) {
					console.log("found word: " + word.label);
					foundWord = word.label;
					break;
				}
			}

			if (foundWord) {
				if (player != passedPlayer) {
					marking(input, foundWord);
					passedPlayer = player;
				}

				document.body.addEventListener("keyup", function (event) {
					if (event.key === "Enter") {
						event.preventDefault();
						used[foundWord] = true;
						clearInterval(interval);
						start(input);
					}
				});
			} else {
				console.log("Not Found");
			}
		}
	}, 250);
}

let error = false;

function marking(input, foundWord) {
	if (markingIntervalID) {
		clearInterval(markingIntervalID);
		markingIntervalID = undefined;
	}
	input.value = " ";
	let eventKey = new Event("input", {
		bubbles: true,
		cancelable: true,
	});

	markingIntervalID = setInterval(function () {
		let lengthValue = input.value.trim().length;
		let lengthFoundingWord = foundWord.trim().length;

		if (error == false) {
			if (lengthValue == 0) {
				input.value = foundWord[0];
				input.dispatchEvent(eventKey);
			} else if (lengthFoundingWord <= lengthValue) {
				if (foundWord != input.value) {
					input.value = foundWord;
					input.dispatchEvent(eventKey);
				}
				clearInterval(markingIntervalID);
				markingIntervalID = undefined;

				used[foundWord] = true;
				selfTurn.children[0].dispatchEvent(
					new Event("submit", {
						bubbles: true,
						cancelable: true,
					})
				);
			} else {
				input.value += foundWord[lengthValue];
				input.dispatchEvent(eventKey);
			}
		}

		if (
			lengthValue != 0 &&
			input.value[lengthValue - 1] != foundWord[lengthValue - 1]
		) {
			input.value = input.value.slice(0, -1);
			input.dispatchEvent(eventKey);
			lengthValue = input.value.trim().length;
			error = false;
		}

		let random = Math.floor(Math.random() * 100);
		if (random < 12 && input.value != foundWord) {
			let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			let char = alphabet[Math.floor(Math.random() * 25 + 1)];
			input.value += char;
			input.dispatchEvent(eventKey);
			error = true;
		}
	}, 130);
}
