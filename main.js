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
    const singlePlayer = document.createElement("button")
    const twoPlayer = document.createElement("button")
    const player1Name = document.createElement("input")
    const player2Name = document.createElement("input")
    const button = document.createElement("button")
    const onePlayer = document.createElement("button")
    const modeSelector = document.createElement("div")
    const markX = document.createElement("button")
    const markO = document.createElement("button")
    regform.className = "regform"
    singlePlayer.textContent = "Single player"
    singlePlayer.addEventListener("click", ()=> singlePlayerForm())
    regform.appendChild(singlePlayer)
    twoPlayer.textContent = "Two players"
    twoPlayer.addEventListener("click", ()=> twoPlayerForm())
    regform.appendChild(twoPlayer)
    page.appendChild(regform)

    const twoPlayerForm = ()=>{
        while (regform.firstChild) regform.removeChild(regform.firstChild)
        regform.textContent = "Please enter player names"
        player1Name.placeholder = ("Player 1")
        player1Name.id = "player1"
        player1Name.className = "name-input"
        regform.appendChild(player1Name)
        player2Name.placeholder = ("Player 2")
        player2Name.id = "player2"
        player2Name.className = "name-input"
        regform.appendChild(player2Name)
        button.textContent = "Start game"
        button.className = "register-button"
        button.addEventListener("click", ()=>events.registerPlayers(player1Name.value,player2Name.value))
        regform.appendChild(button)
    }
    
    const singlePlayerForm = ()=>{
        while (regform.firstChild) regform.removeChild(regform.firstChild)
        player1Name.placeholder = ("Player name")
        regform.appendChild(player1Name)
        modeSelector.textContent = "Play as:"
        markX.textContent ="X"
        markX.addEventListener("click", ()=> events.singlePlayer(player1Name.value, "X"))
        modeSelector.appendChild(markX)
        markO.textContent = "O"
        markO.addEventListener("click",()=> events.singlePlayer(player1Name.value, "O"))
        modeSelector.appendChild(markO)
        regform.appendChild(modeSelector)
        

    }
    
    
    
    
    

    
})()
//functions used in the register form
const events = (()=>{
    const player1Name = document.getElementById("player1")
    const player2Name = document.getElementById("player2")
    
    const registerPlayers = (name1, name2)=>{
        if (name1.length<1 || name2.length<1)alert("Please enter player names")
        else{
        let player1 = createPlayer(name1, "X", false)
        let player2 = createPlayer(name2, "O", false)
        pubSub.publish("registerPlayers", player1, player2)
        }
        
    }
    const singlePlayer = (name, mark)=>{
        if ( name.length<1) alert("Please enter Player Name")
        else if ( name.length>1){
             if (mark[0] === "X"){
                const player1 = createPlayer(name, "X", false)
                const player2 = createPlayer("Computer", "O", true)
                pubSub.publish("registerPlayers", player1, player2)
            }
            else if (mark[0]=== "O"){
                const player1 = createPlayer("Computer", "X", true)
                const player2 = createPlayer(name, "O", false)
                pubSub.publish("registerPlayers", player1, player2)
            }
        }
          
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
        let mark = data[0].mark
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
        pubSub.publish("splitPlayers", player1)
        return{player1, player2, }  
    }

    const displayTurnName = ()=>{
        let displayTurn = document.querySelector(".displayTurn")
        displayTurn.textContent = `${player1.name}, make your move!`
        if (player1.isAI != true)return
        if (player1.isAI = true){
            pubSub.publish("aiMove")
            return
        }
    }

    const tileClick = (e)=>{
        pubSub.publish("tileClick", e.target.id)
    }

    const turn = (arrpos)=>{
        let displayTurn = document.querySelector(".displayTurn")
        if (!gameArray.includes("X"))playerTurn = player1.mark
        if (playerTurn==player1.mark){
            displayTurn.textContent = `${player2.name}, make your move!`
            pubSub.publish("turn", arrpos, player1)
            playerTurn = player2.mark
            return {playerTurn}
        }
        if (playerTurn == player2.mark){
            displayTurn.textContent = `${player1.name}, make your move!`
            pubSub.publish("turn", arrpos, player2)
            playerTurn = player1.mark
            return {playerTurn}
        }   
    }

    const checkArr = (arrpos)=>{
        if (gameArray[arrpos] ==="")pubSub.publish("checkArr",arrpos)
    }

    const updateArr = (data)=>{
        this. arrpos = data[0]
        this.player = data[1]
        gameArray[arrpos] = player.mark
        pubSub.publish("updateArr", player, arrpos)
        pubSub.publish("checkTurn", player)
    }

    const checkAiTurn = (data)=>{
        if (data[0].isAI === false && player1.isAI ==true || data[0].isAI === false && player2.isAI ==true) pubSub.publish("aiMove")  
    }

    const checkWinner = (data)=>{
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
        //check for winner
        for (let win of winArr) {
            if(gameArray[win[0]]==data[0].mark && gameArray[win[1]]== data[0].mark && gameArray[win[2]]== data[0].mark){
                pubSub.publish("checkWinner", data[0])
                
            }
        }
        //check for draw  
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

    pubSub.sub("checkTurn", checkAiTurn)
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
    let id = ""
    const getChoices = ()=>{
        let tile = document.querySelectorAll(".tile")
        let aiArr = Array.from(tile)
        let choices = aiArr.filter(element=>element.textContent=="")
        let choice = choices[Math.floor(Math.random()*choices.length)]
        id = choice.id
        pubSub.publish("tileClick", id)
        return       
    }
    const myTimeout = ()=>{
        setTimeout(getChoices, 1000)
    }
    pubSub.sub("aiMove", myTimeout)
    return {getChoices}
})()