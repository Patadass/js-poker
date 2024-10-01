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
}
deck = new Deck()
deck.printCards()