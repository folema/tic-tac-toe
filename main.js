const pubSub = (()=>{
    const publications = []
    const subscribers = []

    const publish = (publicationName, ...data)=>{
        publications.push({publicationName, data})
        emit(publicationName, data)
    }

    const sub = (pubName, subName)=>{
        subscribers.push({pubName, subName})
    }
    const emit = (input, data)=>{
        for (let i = 0; i<subscribers.length; i++){
            if (subscribers[i].pubName== input){
                let fire = subscribers[i]
                fire.subName(data)
            }
        }
    }
    return {publish, emit, sub}
})()

const createPlayer = (name, mark, isAI)=> {return {name, mark, isAI}}

//Start- screen
const playerRegistration = (()=>{
    const page = document.querySelector(".page") 
    const regform = document.createElement("div")
    regform.className = "regform"
    regform.textContent = "Please enter player names"
    const player1Name = document.createElement("input")
    player1Name.placeholder = ("Player 1")
    player1Name.id = "player1"
    player1Name.className = "name-input"
    regform.appendChild(player1Name)
    const player2Name = document.createElement("input")
    player2Name.placeholder = ("Player 2")
    player2Name.id = "player2"
    player2Name.className = "name-input"
    regform.appendChild(player2Name)
    const button = document.createElement("button")
    button.textContent = "Start game"
    button.className = "register-button"
    button.addEventListener("click", ()=>events.registerPlayers())
    regform.appendChild(button)
    const onePlayer = document.createElement("button")
    onePlayer.textContent = "Single player"
    onePlayer.addEventListener("click", ()=>events.singlePlayer())
    page.appendChild(onePlayer)
    page.appendChild(regform)
})()
//functions used in the register form
const events = (()=>{
    const player1Name = document.getElementById("player1")
    const player2Name = document.getElementById("player2")
    
    const registerPlayers = ()=>{
        if (player1Name.value.length<1 || player2Name.value.length<1)alert("Please enter player names")
        else{
        let player1 = createPlayer(player1Name.value, "X", false)
        let player2 = createPlayer(player2Name.value, "O", false)
        pubSub.publish("registerPlayers", player1, player2)
        }
        return {player1, player2}
    }
    const singlePlayer = ()=>{
        if ( player1Name.value.length<1 && player2Name.value.length<1)alert("Please enter a name for the single player")
        else if (player1Name.value.length<1 && player2Name.value.length<1)alert("Please enter only one name for single player mode")
        else if ( player1Name.value.length>1 && player2Name.value.length<1){
            console.log("test")
             const player1 = createPlayer(player1Name.value, "X", false)
             const player2 = createPlayer("Computer", "O", true)
             pubSub.publish("registerPlayers", player1, player2)
        }
        else if( player2Name>1 && player1Name<1){
             const player1 = createPlayer("Computer", "X", true)
             const player2 = createPlayer(player2Name.value, "O", false)
             pubSub.publish("registerPlayers", player1, player2)
        }
        return {player1, player2}
        
    }
    return {registerPlayers, singlePlayer}
})()

//Game UI
const game = (()=>{
    const page = document.querySelector(".page")
    const mainContainer = document.createElement("div")
    const title = document.querySelector("h1")
    const displayTurn = document.createElement("div")
    const makeGameBoard = ()=>{
        while (page.firstChild)page.removeChild(page.firstChild)
        page.appendChild(title)
        displayTurn.className = "displayTurn"
        page.appendChild(displayTurn)
        mainContainer.className = "main-container"
        page.appendChild(mainContainer)
        let i = 0
        while(i<gameControl.gameArray.length){
            let tile = document.createElement("div")
            tile.className = "tile"
            tile.id = i
            tile.textContent = ""
            tile.addEventListener("click",(e)=>{
                gameControl.tileClick(e)
            })
            mainContainer.appendChild(tile)
            i++
        } 
        pubSub.publish("makeGameboard") 
    }
    const resetTile = ()=>{
        let tile = document.querySelectorAll(".tile")
        tile.forEach(tile=>tile.textContent="")
    }
    const updateTile = (data)=>{
        let mark = data[0]
        let pos = data[1].join("")
        let tile = document.getElementById(pos)
        tile.textContent = mark
    }
    const gameOver = (winner)=>{
        page.removeChild(displayTurn)
        while (mainContainer.firstChild)mainContainer.removeChild(mainContainer.firstChild)
        let gameWinner = winner[0]
        let message = document.createElement("div")
        message.className= "win"
        if (gameWinner.name ==="draw"){
        message.textContent = "Game over. It is a draw"
        }
        else{
        message.textContent = `Game over. The Winner is ${gameWinner.name}`
        }
        page.appendChild(message)
        let newGame = document.createElement("button")
        newGame.textContent = "Re-match"
        newGame.addEventListener("click", ()=>{
            pubSub.publish("newGame")
        })
        page.appendChild(newGame)
    }
    pubSub.sub("splitPlayers",makeGameBoard)
    pubSub.sub("updateArr", updateTile)
    pubSub.sub("checkWinner", gameOver)
    return {makeGameBoard, resetTile}
})()

//Game logics
const gameControl = (()=>{
    let gameArray = ["","","","","","","","",""]
    let player1={}
    let player2={}
    let playerTurn = player1.mark
    const splitPlayers = (players)=>{
        player1 = players[0]
        player2 = players[1]
        console.log(player1, player2)
        pubSub.publish("splitPlayers", player1)
        return{player1, player2}  
    }
    const displayTurnName = ()=>{
        let displayTurn = document.querySelector(".displayTurn")
        displayTurn.textContent = `${player1.name}, make your move!`
    }
    const tileClick = (e)=>{
        pubSub.publish("tileClick", e.target.id)
    }
    const turn = (arrpos)=>{
        let displayTurn = document.querySelector(".displayTurn")
        if (!gameArray.includes("X"))playerTurn = player1.mark
        if (playerTurn==player1.mark){
            displayTurn.textContent = `${player2.name}, make your move!`
            pubSub.publish("turn", arrpos)
            playerTurn = player2.mark
            return
        }
        if (playerTurn == player2.mark){
            displayTurn.textContent = `${player1.name}, make your move!`
            pubSub.publish("turn", arrpos)
            playerTurn = player1.mark
            return
        }
        return playerTurn
    }
    const checkArr = (arrpos)=>{
        if (gameArray[arrpos] ==="")pubSub.publish("checkArr",arrpos)
    }
    const updateArr = (arrpos)=>{
        gameArray[arrpos] = playerTurn 
        pubSub.publish("updateArr", playerTurn, arrpos)
    }
    const checkWinner = ()=>{
        const winArr = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]
        for (let win of winArr) {
            if(gameArray[win[0]]==playerTurn && gameArray[win[1]]== playerTurn && gameArray[win[2]]== playerTurn){
                if (playerTurn === player1.mark) pubSub.publish("checkWinner", player1)
                if (playerTurn === player2.mark) pubSub.publish("checkWinner", player2)
            }
        }
        let count = 0
                    gameArray.map(value=>{  
                    if (value == "X" || value == "O") count++
                    if (count===9) {
                        let player3 = {name: "draw"}
                        pubSub.publish("checkWinner", player3)}
                },0)   
    }
    const reMatch = ()=>{
        gameArray = ["","","","","","","","",""]
        game.makeGameBoard()
        return gameArray
    }
    pubSub.sub("makeGameboard", displayTurnName)
    pubSub.sub("registerPlayers", splitPlayers)
    pubSub.sub("tileClick", checkArr)
    pubSub.sub("checkArr", turn)
    pubSub.sub("turn", updateArr)
    pubSub.sub("updateArr", checkWinner)
    pubSub.sub("newGame", reMatch)
    return {tileClick, splitPlayers, gameArray}
})()

//ai section
const ai = (()=>{
    let choiceNumb = ""
    const getChoices = ()=>{
        let tile = document.querySelectorAll(".tile")
        let aiArr = Array.from(tile)
        let choices = aiArr.filter(element=>element.textContent=="")
        let choice = choices[Math.floor(Math.random()*choices.length)]
        let id = choice.id
        pubSub.publish("tileClick", id)
        return {id}
        
    }
    const placeMarker = (input)=>{
        let tile = document.getElementById(input)
        tile.textContent = "P"
    }
    return {getChoices, placeMarker}
})()