const player = (name, marker, madeMove)=>{
    this.name = name
    this.marker = marker
    this.madeMove = madeMove

    return {name, marker, madeMove}
}
const playerOne = player("john", "X", false)
const playerTwo = player("Mike", "O", false)

const placeMarker = (mark, arr, pos)=>{
    if (arr[pos] === ""){
        arr[pos]=mark 
    }
    return arr
    
}

const createGameBoard = (()=>{
    this.gameboardArr = ["","","","","","","","",""]
    return {gameboardArr}
})

const board = createGameBoard()

const play = (players, arr, pos)=>{
     placeMarker(players.marker, arr.gameboardArr, pos)
}

const interface = ((arr, players,)=>{
    const array = arr.gameboardArr
    const mainContainer = document.querySelector(".main-container")
    
    let i = 0
    while (i< array.length){
        const tile = document.createElement("div")
        tile.textContent = array[i]
        tile.className="tile"
        tile.id = i
        tile.addEventListener(`click`, (e)=>{
            let place=e.target.id
            play(players, arr, place)
            while (mainContainer.firstChild)mainContainer.removeChild(mainContainer.firstChild)
            game(playerOne, playerTwo, board)
        })
        mainContainer.appendChild(tile)
        i++
    }
   
})

const game = (player1, player2, board)=>{
    if (player1.madeMove == false){
        interface(board, player1)
        player1.madeMove = true
        player2.madeMove = false
    }
    else {
          interface(board, player2)
          player1.madeMove = false
          player2.madeMove = true
    }
    return {player1, player2}
}

game(playerOne, playerTwo, board)






