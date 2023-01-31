const player = (name, marker)=>{
    this.name = name
    this.marker = marker
    let madeMove = false
    return {name, marker, madeMove}
}

const init = (()=>{   
    const gameboardArr = ["","","","","","","","",""]
    const mainContainer = document.querySelector(".main-container")
    const playerReg = ()=>{
        mainContainer.textContent ="Please enter player names"
        let playerOneName = document.createElement("input")
        playerOneName.placeholder ="Player one"
        mainContainer.appendChild(playerOneName)
        let playerTwoName = document.createElement("input")
        playerTwoName.placeholder = "Player Two"
        mainContainer.appendChild(playerTwoName)
        let createPlayers = document.createElement("button")
        createPlayers.textContent = "Start game"
        createPlayers.addEventListener("click", ()=>{
            let player1 = player(playerOneName.value, "X")
            let player2 = player(playerTwoName.value, "O")
            interface(player1, player2)
            })
        mainContainer.appendChild(createPlayers) 
    }
    const interface = (player1, player2)=>{
        while (mainContainer.firstChild)mainContainer.removeChild(mainContainer.firstChild)
        mainContainer.textContent=""
        let i = 0
        while (i< gameboardArr.length){
            let tile = document. createElement ("div")
            tile.textContent = gameboardArr[i]
            tile.className = "tile"
            tile.id = i
            tile.addEventListener(`click`, (e)=>{
                let pos = e.target.id
                play(pos, player1, player2)
            })
            mainContainer.appendChild(tile)
            i++
        }
    }
    const play = (pos, player1, player2)=>{
        console.log(player1)
        console.log(player2)
        if (player1.madeMove == false){
            placeMarker(player1, pos)
            player2.madeMove = false  
        }
        else if(player1.madeMove == true) {
              placeMarker(player2, pos)
              player1.madeMove = false     
        }
    }
    const placeMarker = (player, pos)=>{  
        if (gameboardArr[pos] === ""){
            gameboardArr[pos]=player.marker 
            let tile = document.getElementById(pos)
            tile.textContent = gameboardArr[pos]  
            checkWinner(player)
            player.madeMove = true  
        }
        else player.madeMove = false   
    }
    const checkWinner = (player)=>{
        if (gameboardArr[0]==player.marker && gameboardArr[1]==player.marker && gameboardArr[2]==player.marker)gameOver(player)
        if (gameboardArr[3]==player.marker && gameboardArr[4]==player.marker && gameboardArr[5]==player.marker)gameOver(player)
        if (gameboardArr[6]==player.marker && gameboardArr[7]==player.marker && gameboardArr[8]==player.marker)gameOver(player)
        if (gameboardArr[0]==player.marker && gameboardArr[3]==player.marker && gameboardArr[6]==player.marker)gameOver(player)
        if (gameboardArr[1]==player.marker && gameboardArr[4]==player.marker && gameboardArr[7]==player.marker)gameOver(player)
        if (gameboardArr[2]==player.marker && gameboardArr[5]==player.marker && gameboardArr[8]==player.marker)gameOver(player)
        if (gameboardArr[0]==player.marker && gameboardArr[4]==player.marker && gameboardArr[8]==player.marker)gameOver(player)
        if (gameboardArr[2]==player.marker && gameboardArr[4]==player.marker && gameboardArr[6]==player.marker)gameOver(player)
        let count= 0
        gameboardArr.map(value=>{
            
            if (value == "X" || value == "O") count++
            if (count===9) tie()
        },0)
    }
    const gameOver = (player)=>{
        while (mainContainer.firstChild)mainContainer.removeChild(mainContainer.firstChild)
        mainContainer.textContent = `${player.name} wins!`
    }
    const tie = ()=>{
        while (mainContainer.firstChild)mainContainer.removeChild(mainContainer.firstChild)
        mainContainer.textContent = "It is a tie"
    }
    return {playerReg}
})();

init.playerReg()
