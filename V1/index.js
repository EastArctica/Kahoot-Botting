// V1
const corsProxy = require("cors-anywhere");
const RandomNames = require('random-name')
const { Session, Adapters, Events } = require('kahoot-api')

// Client Variables
var UserCount = 2000;
var PinCode = 9719736;

// Create the Cors Server
const corsServer = corsProxy.createServer({
    originWhitelist: []
});
corsServer.listen(3000, "localhost", function() {
    console.log(`Cors Anywhere service started.`);
});
var Waited = false;


function AddBot(Pin, Username, CurrentI) {
    setTimeout(async function() {
        var session = new Session(Pin, "http://localhost:3000/")
        session.openSocket()
            .then(socket => {
                const player = new Adapters.Player(socket);
                player.join(Username)
                    .then(() => {
                        console.log('Joined with: ' + Username);
                        player.on('player', msg => {
                            // console.log(msg)
                            // Question Asked
                            if (msg.data.id == 2) {
                                if (Waited) {
                                    // The Players have already waited 250 MS, Let them all run
                                    var AnswerNumber = Math.floor(Math.random() * Math.floor(4))
                                    console.log("Answering With: " + AnswerNumber)
                                    player.answer(AnswerNumber);
                                } else {
                                    // The Players have not waited 250 MS, force one to wait
                                    setTimeout(function() {
                                        var AnswerNumber = Math.floor(Math.random() * Math.floor(4))
                                        console.log("Answering With: " + AnswerNumber)
                                        player.answer(AnswerNumber);
                                        Waited = true
                                    }, 550);
                                }
                            }
                            // Question Finished
                            if (msg.data.id == 8) {
                                Waited = false
                            }
                            if (msg.data.id == 10) {
                                console.log(Username + " Has been kicked from the game")
                            }
                        });
                    });
            });
    }, 50 * CurrentI);
}

for (i = 0; i < UserCount; i++) {
	var Name = RandomNames.first() + RandomNames.last()
	if (Name.length > 15) {
		Name = Name.slice(0,15)
	}
	var TotalUpperCase = 0
	for (f = 0; f < Name.length; f++) {
		if (Name[f].toUpperCase() == Name[f]) {
			TotalUpperCase = TotalUpperCase+1
		}
	}
	if (TotalUpperCase > 2) {
		var Name = RandomNames.first() + RandomNames.last()
		if (Name.length > 15) {
				Name.slice(0,15)
		}
		var TotalUpperCase = 0
		for (f = 0; f < Name.length; f++) {
			if (Name[f].toUpperCase() == Name[f]) {
				TotalUpperCase = TotalUpperCase+1
			}
		}
		if (TotalUpperCase > 2) {
			console.log(Name + " Is Gonna get banned")
		}
	}
	
	AddBot(PinCode, Name, i)
}