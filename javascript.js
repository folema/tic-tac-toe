
const player = (name, marker)=>{
    this.name = name
    this.marker = marker
    return {name, marker}
}
const playerOne = player("john", "X")
const playerTwo = player("Mike", "O")

const placeMarker = (mark, arr)=>{ 
    arr.push(mark)
    console.log(arr)
    return arr
}

const createGameBoard = (()=>{
    this.gameboardArr = ["","","","","","","","",""]
    return {gameboardArr}
})
const board = createGameBoard()

const play = (player, arr)=>{
     placeMarker(player.marker, arr.gameboardArr)
}











