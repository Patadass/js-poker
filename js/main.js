function init() {
    const floor = document.createElement("div")
    floor.id = "floor";
    document.body.appendChild(floor)
    addPlayer("ivan",100)
    addPlayer("david",100)
}

function addPlayer(name, chips){
    game.addPlayer(new Player(name, chips))
    let n = game.players.length - 1
    let player = document.createElement("div")
    let innerName = document.createElement("div")
    let innerChips = document.createElement("div")
    let card = document.createElement("div")
    let suit = document.createElement("div")
    let img = document.createElement("img")
    let number = document.createElement("div")
    player.classList.add("player")
    innerName.classList.add("player-name")
    innerName.textContent = name
    innerChips.classList.add("player-chips")
    innerChips.textContent = "chips: " + chips
    card.classList.add("card")
    suit.classList.add("suit")
    number.classList.add("number")
    number.innerHTML = "0"
    img.src = "../cards/club.svg"
    document.getElementById("floor").appendChild(player)
    player.appendChild(innerName)
    player.appendChild(innerChips)
    player.appendChild(card)
    card.appendChild(suit)
    suit.appendChild(img)
    card.appendChild(number)
    card = document.createElement("div")
    suit = document.createElement("div")
    img = document.createElement("img")
    number = document.createElement("div")
    card.classList.add("card")
    suit.classList.add("suit")
    number.classList.add("number")
    number.innerHTML = "0"
    img.src = "../cards/club.svg"
    player.appendChild(card)
    card.appendChild(suit)
    suit.appendChild(img)
    card.appendChild(number)

    let btn = document.createElement("button")
    btn.textContent = "Check"
    btn.addEventListener("click", () => {
        console.log(game.players[n].name)
    })
    player.appendChild(btn)
}

function displayCommunityFlop(){
    const innerCommunity = document.getElementById("community")
    for(let i in game.community){
        let card = document.createElement("div")
        let suit = document.createElement("div")
        let img = document.createElement("img")
        let number = document.createElement("div")
        card.classList.add("card")
        suit.classList.add("suit")
        number.classList.add("number")
        number.innerHTML = game.community[i].getRank()
        img.src = "../cards/"+game.community[i].getSuit()+".svg"
        innerCommunity.appendChild(card)
        card.appendChild(suit)
        suit.appendChild(img)
        card.appendChild(number)
    }
}
function displayCommunityTurn(i){//i is 3 for Turn and 4 for river
    const innerCommunity = document.getElementById("community")
    let card = document.createElement("div")
    let suit = document.createElement("div")
    let img = document.createElement("img")
    let number = document.createElement("div")
    card.classList.add("card")
    suit.classList.add("suit")
    number.classList.add("number")
    number.innerHTML = game.community[i].getRank()
    img.src = "../cards/"+game.community[i].getSuit()+".svg"
    innerCommunity.appendChild(card)
    card.appendChild(suit)
    suit.appendChild(img)
    card.appendChild(number)
}

function flush(){
    let innerCommunity = document.getElementById("community")
    innerCommunity.removeChild(innerCommunity.firstChild)
}

function random(from,to){
    return Math.floor(Math.random() * to) + from;
}

class Card{
    constructor(suit,rank) {
        this.suit = suit
        this.rank = rank
    }
    getRank(){
        return this.rank
    }
    getSuit(){
        return this.suit
    }
}

class Deck{
    constructor(){
        this.deck = []
        this.makeCards()
    }
    makeCards(){
        let suit = ["heart","diamond","club","spade"]
        let j = 1
        let i = 0
        let k = 0
        while(i < 52){
            this.deck[i] = new Card(suit.at(k),j)
            if(j%13 === 0){
                j = 0
                k++
            }
            j++
            i++
        }
    }
    printCards(){
        for(let i in this.deck){
            console.log(this.deck[i].suit,this.deck[i].rank)
        }
    }
    shuffle(){
        for (let i in this.deck){
            let s  = random(0,this.deck.length)
            let ph = this.deck[s]
            this.deck[s] = this.deck[i];
            this.deck[i] = ph
        }
    }
    getTopCard(){
        return this.deck[this.deck.length-1]
    }
    popTopCard(){
        this.deck.splice(this.deck.length-1,1)
    }
}

class Player{
    constructor(name = "",chips = 0){
        this.name = name
        this.chips = chips
        this.cards = []
        this.bigBlind = false
        this.smallBlind = false
    }
    addCard(card){
        this.cards.push(card)
    }
    resetCards(){
        this.cards = []
    }
    makeBB(){
        this.bigBlind = true
        this.smallBlind = false
    }
    makeSB(){
        this.smallBlind = true
        this.bigBlind = false
    }
}

class Poker{
    constructor(){
        this.deck = new Deck()
        this.players = []
        this.community = []
        this.minBet = 15
        this.pot = 0
        this.currentBet = 0
        this.position = 0
    }
    addPlayer(player){
        this.players.push(player)
    }
    printPlayers(){
        for(let i in this.players){
            console.log(this.players[i])
        }
    }
    dealCards(){
        for(let i in this.players){
            this.players[i].addCard(this.deck.getTopCard())
            this.deck.popTopCard()
        }
        for(let i in this.players){
            this.players[i].addCard(this.deck.getTopCard())
            this.deck.popTopCard()
        }
    }

    bet(bet){
        if(this.players[this.position].chips < bet){
            return false;
        }
        this.players[this.position].chips -= bet
        this.pot += bet
        this.currentBet = bet
        return true
    }
    raise(bet){
        if(bet < this.currentBet*2 || this.players[this.position].chips < bet){
            return false;
        }
        this.players[this.position].chip -= bet
        this.pot += bet
        this.currentBet = bet
        return true
    }
    nextDeal(){

    }
    dealCommunityFlop(){
        this.deck.popTopCard()
        let i = 0
        while(i < 3){
            this.community.push(this.deck.getTopCard())
            this.deck.popTopCard()
            i++
        }
        displayCommunityFlop()
    }
    dealCommunityTurn(){
        this.deck.popTopCard()
        this.community.push(this.deck.getTopCard())
        this.deck.popTopCard()
        displayCommunityTurn(3)
    }
    dealCommunityRiver(){
        this.deck.popTopCard()
        this.community.push(this.deck.getTopCard())
        this.deck.popTopCard()
        displayCommunityTurn(4)
    }
    printGame() {
        for (let i in this.players) {
            console.log(this.players[i].name,this.players[i].chips, this.players[i].cards[0], this.players[i].cards[1])
        }
        for(let i in this.community){
            console.log(this.community[i].suit, this.community[i].rank)
        }
        console.log(this.pot)
    }
}
game = new Poker()
//game.addPlayer(new Player("Ivan",100))
//game.addPlayer(new Player("David",100))
game.deck.shuffle()
game.dealCards()
game.printGame()


