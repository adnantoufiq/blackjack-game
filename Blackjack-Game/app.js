let blackJackGames={
    'you':{'scoreSpan':'#your-blackjack-result','div':'#your-box','score':0},
    'dealer':{'scoreSpan':'#dealer-blackjack-result','div':'#dealer-box','score':0},
    'cards':['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardsMap':{'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'K':10, 'J':10, 'Q':10, 'A':[1,11]},
    'wins': 0,
    'losses': 0,
    'draws' : 0,
    'isStand': false,
    'turnsOver': false,
}

const YOU=blackJackGames['you'];
const DEALER=blackJackGames['dealer'];
const hitSound=new Audio('./sounds/swish.m4a');
const winSound=new Audio('./sounds/cash.mp3');
const lossSound=new Audio('./sounds/aww.mp3');



document.querySelector('#blackjack-hit-button').addEventListener('click', blackJackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click',dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackJackDel);

function blackJackHit()
{   
    if(blackJackGames['isStand'] === false)
     {
        let card=randomCard();
        console.log(card);
        showCard(card,YOU);
        
        
        updateScore(card,YOU);
        showScore(YOU);
     }    
    
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function dealerLogic(){

    blackJackGames['isStand'] = true;

    while(DEALER['score'] < 16 && blackJackGames['isStand'] === true)
    {
        let card= randomCard();
        console.log(card);
        showCard(card,DEALER);
        
        updateScore(card,DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

     
    blackJackGames['turnsOver'] = true;
    showResult(computeWinner());
    
    

}

function randomCard()
{
    let randomIndex=Math.floor(Math.random()*13);
    return blackJackGames['cards'][randomIndex];
}

function showCard( card,activePlayer)
{
    if(activePlayer['score']<=21){
        let cardImage=document.createElement('img');
        cardImage.src=`images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage).width="80";
        hitSound.play();
    }
}

function blackJackDel()
{

    if(blackJackGames['turnsOver'] === true)
    {
        blackJackGames['isStand'] = false;

        let yourImages=document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages=document.querySelector('#dealer-box').querySelectorAll('img');
    
        for(i=0;i<yourImages.length;i++){yourImages[i].remove()};

        for(i=0;i<dealerImages.length;i++){dealerImages[i].remove()};

        YOU['score'] = 0;

        DEALER['score'] = 0;

        
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#your-blackjack-result').style.color = '#ffffff';
        document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackJackGames['turnsOver'] = true;
    }
   
}

function updateScore( card,activePlayer)
{
    if (card === 'A')
    {

    
    //if adding 11 kepps me below 21, add 11,otherwise add 1;

        if (activePlayer['score'] + blackJackGames['cardsMap'][card][1]<=21)
        {

            activePlayer['score'] += blackJackGames['cardsMap'][card][1];
        }else
        {
            activePlayer['score'] += blackJackGames['cardsMap'][card][0];
        }

    } else{

    activePlayer['score'] += blackJackGames['cardsMap'][card];
    }

}


function showScore(activePlayer)
{
    if(activePlayer['score']>21)
    {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }else{
    
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    
    }
}


//compute winner and return who just win
//update the wins, losses, draws
function computeWinner()
{
    let winner;
    if(YOU['score']<=21){
        
        //higher score than dealer or when dealer busts you'r
        if(YOU['score'] > DEALER['score'] || (DEALER['score']>21)) {
            
            blackJackGames['wins'] ++;
            winner=YOU

        }else if(YOU['score'] < DEALER['score']){
            
            blackJackGames['losses'] ++;
            winner=DEALER;

        }else if(YOU['score'] === DEALER['score']){
            blackJackGames['draws'] ++;
           
        }
        //when user busts but dealer doesn,t
    }else if(YOU['score']>21 && DEALER['score']<=21){

            blackJackGames['losses'] ++;
            winner=DEALER;
        //when you adn the dealer busts
    } else if(YOU['score']>21 && DEALER['score']>21){
            blackJackGames['draws'] ++;
            
    }

    
    console.log('Winner is ', winner);
    return winner;
}

function showResult(winner)
{
    if(blackJackGames['turnsOver'] === true)
    {
        if(winner === YOU)
        {
            document.querySelector('#wins').textContent = blackJackGames['wins'];
            message= 'You Won!';
            messageColor= 'green';
            winSound.play();
        } else if(winner === DEALER)
        {
            document.querySelector('#losses').textContent = blackJackGames['losses'];
            message = 'You Lost!';
            messageColor = 'red';
            lossSound.play();
        } else
        {
            document.querySelector('#draws').textContent = blackJackGames['draws'];
            message = 'You Drew!';
            messageColor = 'black';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;

    }
}