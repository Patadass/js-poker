function init() {
    addPlayer("ivan",100)
    addPlayer("david",100)
}

function makeInnerCard(rank, suit){
    let card = document.createElement("div")
    let innerSuit = document.createElement("div")
    let img = document.createElement("img")
    let number = document.createElement("div")
    card.classList.add("card")
    innerSuit.classList.add("suit")
    number.classList.add("number")
    number.innerHTML = rank
    if(suit.length > 0){
        img.src = "../cards/"+suit+".svg"
    }
    card.appendChild(innerSuit)
    innerSuit.appendChild(img)
    card.appendChild(number)
    return card
}

function changeInnerCard(card, rank, suit){
    let innerSuit = card.getElementsByClassName("suit")[0]
    innerSuit.firstChild.src = "../cards/"+suit+".svg"
    card.getElementsByClassName("number")[0].innerHTML = rank
}

function refreshInnerPlayers(){
    for(let i in game.players){
        let innerPlayer = document.getElementsByClassName("player")[i]
        if(game.players[i].cards[0] === undefined){
            changeInnerCard(innerPlayer.getElementsByClassName("card")[0], null, "")
        }else{
            changeInnerCard(innerPlayer.getElementsByClassName("card")[0], game.players[i].cards[0].rank, game.players[i].cards[0].suit)
        }
        if(game.players[i].cards[1] === undefined){
            changeInnerCard(innerPlayer.getElementsByClassName("card")[1], null, "")
        }else{
            changeInnerCard(innerPlayer.getElementsByClassName("card")[1], game.players[i].cards[1].rank, game.players[i].cards[1].suit)
        }
        innerPlayer.getElementsByClassName("player-chips")[0].innerHTML = "chips: " + game.players[i].chips
        innerPlayer.getElementsByClassName("player-bet")[0].innerHTML = "bet: " +  game.players[i].curentBet
        let name = game.players[i].name
        if(game.players[i].smallBlindBool){
            name += " SB"
        }
        if(game.players[i].bigBlindBool){
            name += " BB"
        }
        innerPlayer.getElementsByClassName("player-name")[0].innerHTML = name
        if(game.players[i].action){
            innerPlayer.getElementsByClassName("player-button-check")[0].disabled = false
            innerPlayer.getElementsByClassName("player-button-bet")[0].disabled = false
            innerPlayer.getElementsByClassName("player-button-fold")[0].disabled = false
            if(game.players[i].curentBet < game.currentBet){
                innerPlayer.getElementsByClassName("player-button-check")[0].textContent = "Call"
                innerPlayer.getElementsByClassName("player-button-bet")[0].textContent = "Raise"
            }
            if(game.players[i].curentBet === game.currentBet){
                innerPlayer.getElementsByClassName("player-button-check")[0].textContent = "Check"
                innerPlayer.getElementsByClassName("player-button-bet")[0].textContent = "Bet"
            }
        }
    }
}

function refreshInnerPot(){
    let pot = document.getElementById("pot")
    pot.getElementsByClassName("pot-chips")[0].innerHTML = game.pot
}

function addPlayer(name, chips){
    game.addPlayer(new Player(name, chips))
    let n = game.players.length - 1
    let player = document.createElement("div")
    let innerName = document.createElement("div")
    let innerChips = document.createElement("div")
    let innerBet = document.createElement("div")
    player.classList.add("player")
    innerName.classList.add("player-name")
    innerName.textContent = name
    if(game.players.at(game.players.length-1).smallBlindBool){
        innerName.textContent += " SB"
    }
    if(game.players.at(game.players.length-1).bigBlindBool){
        innerName.textContent += " BB"
    }
    innerChips.classList.add("player-chips")
    innerChips.textContent = "chips: " + chips
    innerBet.classList.add("player-bet")
    innerBet.textContent = "bet: " + game.players[game.players.length-1].curentBet
    document.getElementById("floor").appendChild(player)
    player.appendChild(innerName)
    player.appendChild(innerChips)
    player.appendChild(innerBet)
    player.appendChild(makeInnerCard(null, ""))
    player.appendChild(makeInnerCard(null, ""))
    let buttonCheck = document.createElement("button")
    buttonCheck.classList.add("player-button-check")
    buttonCheck.disabled = true
    buttonCheck.textContent = "Check"
    buttonCheck.addEventListener("click", () => {
        console.log(game.players[n].name)
    })
    player.appendChild(buttonCheck)
    let buttonBet = document.createElement("button")
    buttonBet.classList.add("player-button-bet")
    buttonBet.disabled = true
    buttonBet.textContent = "Bet"
    let isRange = false
    buttonBet.addEventListener("click", () => {
        if(!isRange){
            player.removeChild(player.getElementsByClassName("player-button-fold")[0])
            isRange = true
            let rangeInput = document.createElement("input")
            rangeInput.classList.add("player-range-input")
            rangeInput.type = "range"
            rangeInput.min = "0"//TODO:Maybe dont allow to bet less than min bet
            rangeInput.max = game.players[game.players.length-1].chips.toString()
            rangeInput.step = "1"
            rangeInput.value = "0"
            player.appendChild(rangeInput)
            rangeInput.addEventListener("input", () => {
                player.getElementsByClassName("player-button-bet")[0].textContent = rangeInput.value
            })
            return;
        }
        if(isRange){
            let rangeInput = player.getElementsByClassName("player-range-input")[0]
            let value = rangeInput.value
            player.removeChild(player.getElementsByClassName("player-range-input")[0])
            player.appendChild(buttonFold)
            if(value > 0){
                game.bet(parseInt(value))
            }
            isRange = false
        }
    })
    player.appendChild(buttonBet)
    let buttonFold = document.createElement("button")
    buttonFold.classList.add("player-button-fold")
    buttonFold.disabled = true
    buttonFold.textContent = "Fold"
    buttonFold.addEventListener("click", () => {
        console.log(game.players[n].name)
    })
    player.appendChild(buttonFold)
}

function displayCommunityFlop(){
    const innerCommunity = document.getElementById("community")
    for(let i in game.community){
        innerCommunity.appendChild(makeInnerCard(game.community[i].getRank(), game.community[i].getSuit()))
    }
}

function displayCommunityTurn(i){//i is 3 for Turn and 4 for river
    const innerCommunity = document.getElementById("community")
    innerCommunity.appendChild(makeInnerCard(game.community[i].getRank(),game.community[i].getSuit()))
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
        this.deck = []
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
        this.bigBlindBool = false
        this.smallBlindBool = false
        this.action = false
        this.curentBet = 0
    }
    addCard(card){
        this.cards.push(card)
    }
    resetCards(){
        this.cards = []
    }
    makeBB(){
        this.bigBlindBool = true
        this.smallBlindBool = false
    }
    makeSB(){
        this.smallBlindBool = true
        this.bigBlindBool = false
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
        if(this.players.length === 0){
            player.smallBlindBool = true
        }
        if(this.players.length === 1){
            player.bigBlindBool = true
        }
        this.players.push(player)
    }
    printPlayers(){
        for(let i in this.players){
            console.log(this.players[i])
        }
    }
    nextPosition(){
        if(this.position >= this.players.length-1){
            this.position = 0;
        }else{
            this.position++;
        }
    }
    prevPosition(){
        if(this.position < 0){
            this.position = this.players.length - 1;
        }else{
            this.position--;
        }
    }
    dealCards(startPos){
        let phPos = startPos
        for(let i in this.players){
            if(phPos >= this.players.length){
                phPos = 0
            }
            this.players[phPos].addCard(this.deck.getTopCard())
            this.deck.popTopCard()
            refreshInnerPlayers()
            phPos++
        }
        phPos = startPos
        for(let i in this.players){
            if(phPos >= this.players.length){
                phPos = 0
            }
            this.players[phPos].addCard(this.deck.getTopCard())
            this.deck.popTopCard()
            refreshInnerPlayers()
            phPos++
        }
    }

    bet(bet){
        if(this.players[this.position].chips < bet){
            return false;
        }
        this.players[this.position].chips -= bet
        this.pot += bet
        this.currentBet = bet
        this.players[this.position].curentBet += bet
        refreshInnerPlayers()
        refreshInnerPot()
        return true
    }
    raise(bet){
        if(bet < this.currentBet*2 || this.players[this.position].chips < bet){
            return false;
        }
        this.players[this.position].chip -= bet
        this.pot += bet
        this.currentBet = bet
        this.players[this.position].curentBet = bet
        return true
    }
    call(){
        this.players[this.position].chips -= this.currentBet - this.players[this.position].curentBet
        this.pot += this.currentBet - this.players[this.position].curentBet
        this.players[this.position].curentBet = this.currentBet - this.players[this.position].curentBet
    }

    nextDeal(){
        this.deck.makeCards()
        this.deck.shuffle()
        let startPos = 0
        while(!this.players[startPos].smallBlindBool){
            startPos++
        }
        this.position = startPos
        this.dealCards(this.position)
        this.bet(this.minBet)
        this.nextPosition()
        this.bet(2*this.minBet)
        this.position = startPos
        this.players[this.position].action = true
        refreshInnerPlayers()
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



