
function init() {
    document.getElementById("diamond").src = "../cards/club.svg";
}

function random(from,to){
    return Math.floor(Math.random() * to) + from;
}

class Card{
    constructor(suit,rank) {
        this.suit = suit
        this.rank = rank
    }
}

class Deck{
    constructor(){
        this.deck = []
        this.makeCards()
    }
    makeCards(){
        let suit = ["h","d","c","s"]
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
    dealFlop(){
        this.deck.popTopCard()
        let i = 0
        while(i < 3){
            this.community.push(this.deck.getTopCard())
            this.deck.popTopCard()
            i++
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
    nextTurn(){

    }
    dealTurn(){
        this.deck.popTopCard()
        this.community.push(this.deck.getTopCard())
        this.deck.popTopCard()
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
game.addPlayer(new Player("Ivan",100))
game.addPlayer(new Player("David",100))
game.deck.shuffle()
game.dealCards()
game.printGame()