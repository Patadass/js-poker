
function random(from,to){
    return Math.floor(Math.random() * (to - from) + from);
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
    }//TODO: add this
}
class Poker{
    constructor(){
        this.deck = new Deck()
    }
}
deck = new Deck()
deck.shuffle()
deck.printCards()