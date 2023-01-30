const player = (name, marker, madeMove, winArr)=>{
    this.name = name
    this.marker = marker
    this.madeMove = madeMove
    this.winArr = winArr

    return {name, marker, madeMove, winArr}
}
const playerOne = player("john", "X", false, "XXX")
const playerTwo = player("Mike", "O", false, "OOO")

const placeMarker = (players, arr, pos)=>{
    if (arr[pos] === ""){
        arr[pos]=players.marker 
        checkWinner(arr, players)
    }
    else {
        interface(arr, players)
    }
    return {arr, players} 
}

const checkWinner= (arr, players)=>{
    let win = []
    let winner = false
    
       win.push(arr[0],arr[1],arr[2])
            if(win.join("")===players.winArr) winner = true 
            else win =[]
    
    
        win.push(arr[3],arr[4],arr[5])
            if(win.join("")===players.winArr) winner = true
            else win = []
    
    
        win.push(arr[6],arr[7],arr[8])
            if(win.join("")===players.winArr) winner = true
            else win = []
    
    
        win.push(arr[0],arr[4],arr[8])
            if(win.join("")===players.winArr) winner = true
            else win = []
    
    
        win.push(arr[2],arr[4],arr[6])
            if(win.join("")===players.winArr) winner = true
            else win = []
    
    
        win.push(arr[0],arr[3],arr[6])
            if(win.join("")===players.winArr) winner = true
            else win = []
    
    
        win.push(arr[1],arr[4],arr[7])
            if(win.join("")===players.winArr) winner = true
            else win = []
    
    
        win.push(arr[2],arr[5],arr[8])
            if(win.join("")===players.winArr) winner = true
            else win = []
    
    
        if (winner === true) gameOver(players)
        else return
    
}

const createGameBoard = (()=>{
    this.gameboardArr = ["","","","","","","","",""]
    return {gameboardArr}
})

const board = createGameBoard()

const play = (players, arr, pos)=>{
    let mainContainer = document.querySelector(".main-container")
     placeMarker(players, arr.gameboardArr, pos)
     while (mainContainer.firstChild)mainContainer.removeChild(mainContainer.firstChild)

}

const interface = (arr, players)=>{
    const array = arr.gameboardArr
    let mainContainer = document.querySelector(".main-container")
    let i = 0
    while (i< array.length){
        const tile = document.createElement("div")
        tile.textContent = array[i]
        tile.className="tile"
        tile.id = i
        tile.addEventListener(`click`, (e)=>{
            let pos=e.target.id
            play(players, arr, pos)
        })
        mainContainer.appendChild(tile)
        i++
    }
}

const game = (player1, player2, board)=>{
    if (player1.madeMove == false){
        interface(board, player1)
        player1.madeMove = true
        player2.madeMove = false
    }
    else if(player1.madeMove == true) {
          interface(board, player2)
          player1.madeMove = false
          player2.madeMove = true
    }
    return {player1, player2}
}

const gameOver = (players)=>{
    let container = document.querySelector(".main-container")
    while (container.firstChild)container.removeChild(container.firstChild)
    
}

game(playerOne, playerTwo, board)