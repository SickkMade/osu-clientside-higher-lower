const endGameTimeout = 3500;

function submitForm(button) {
    const scores = {
        top: JSON.parse(localStorage.getItem('top')).playcount,
        bottom: JSON.parse(localStorage.getItem('bottom')).playcount
    };

    const isValid = scores[button] <= scores[button === 'top' ? 'bottom' : 'top'];

    return isValid ? succeed() : fail();
}

function increaseNumber(displayElement, max){
    const duration = 1000;
    const startTime = performance.now();

        function update(){
            const currentTime = performance.now();
            const elapsed = currentTime - startTime + 500
            if(elapsed < duration){
                const currentValue = max * (elapsed/duration)
    
                displayElement.textContent = currentValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                requestAnimationFrame(update)
            } else {
                displayElement.textContent = max.toLocaleString()
            }
        }
    update()
    displayElement.textContent = max
}

function fail(){
    localStorage.removeItem('top')
    localStorage.removeItem('bottom')
    localStorage.setItem('score', 0)
    animationController()

    const vs = document.querySelector('.vs');

    setTimeout(()=>{
        vs.classList.add('playPassAnimation')
        vs.classList.add('red')
        setTimeout(() => {
            vs.classList.remove('playPassAnimation')
            vs.classList.remove('red')
        }, endGameTimeout - 1000)
    }, 1000)
    setTimeout(() => {
        window.location.href = './fail.html'; 
    }, endGameTimeout)
}

function succeed(){
    let score = parseInt(localStorage.getItem('score'))
    let maxScore = parseInt(localStorage.getItem('maxScore'))
    localStorage.setItem('score', ++score)
    localStorage.setItem('maxScore', Math.max(score, maxScore))

    //EWWWWWW GROSS CODE yet i write it %-%
    let scoreElement = document.querySelector('#score')
    let maxScoreElement = document.querySelector('#maxScore')

    scoreElement.addEventListener('animationend', () => {
        scoreElement.classList.remove('shake')
    })
    maxScoreElement.addEventListener('animationend', () => {
        scoreElement.classList.remove('shake')
    })

    const vs = document.querySelector('.vs');

    setTimeout(()=>{
        vs.classList.add('playPassAnimation')
        vs.classList.add('green')
        setTimeout(() => {
            vs.classList.remove('playPassAnimation')
            vs.classList.remove('green')
        }, endGameTimeout - 1000)
    }, 1000)
    
    localStorage.setItem('top', localStorage.getItem('bottom'))
    localStorage.removeItem('bottom')
    animationController()
    setTimeout(() => {
        getData()
        scoreElement.classList.add('shake')
    
        if(score>maxScore){
            maxScoreElement.classList.add('shake')
        }
    }, endGameTimeout)
    
}

function animationController(){
    const clickers = document.querySelector('#clickers')
    const bottomPlayCount = document.querySelector('#bottomPlayCount')
    const bottomPlayCountSpan = bottomPlayCount.querySelector('span')
    
    clickers.classList.add('invis')
    bottomPlayCount.classList.remove('invis')

    //inc number
    increaseNumber(bottomPlayCountSpan, parseInt(bottomPlayCountSpan.textContent.replace(/,/g, '')))

    setTimeout(() => {
        clickers.classList.remove('invis')
        bottomPlayCount.classList.add('invis')
    }, endGameTimeout);
}

function firstVisit(){
    if(!localStorage.getItem('score')){
        localStorage.setItem('score', 0)
        localStorage.setItem('maxScore', 0)
    }
    getData()
}

function randomNumber(max){
    return Math.floor(Math.random() * max)
}

async function getData(){
    try{
        //get data and populate localStorage, if empty
        if(!localStorage.getItem('top')){
            const result = await fetch('mapData.json')
            const data = await result.json()
            localStorage.setItem('top', JSON.stringify(data[randomNumber(1000)]))
        }
        if(!localStorage.getItem('bottom')){
            const result = await fetch('mapData.json')
            const data = await result.json()
            localStorage.setItem('bottom', JSON.stringify(data[randomNumber(1000)]))
        }


        populateDataField('#clickers', JSON.parse(localStorage.getItem('bottom')))
        populateDataField('#top', JSON.parse(localStorage.getItem('top')))
        populateDataField('#bottom', JSON.parse(localStorage.getItem('bottom')))
    } catch(e){
        console.error(e)
    }
}  

function populateDataField(parentId, data){
    const parent = document.querySelector(parentId)
    const dataFields = parent.querySelectorAll('[data-field]')
    for(let i = 0; i < dataFields.length; i++){
        //this will be mapper or cover etc
        const attribute = dataFields[i].getAttribute('data-field') 

        //jr dev ass code :sob: i can just do an obj or map buuuut oh well
        if(attribute === 'cover') dataFields[i].src = data['cover']
        else if(attribute === 'playCount') dataFields[i].textContent = data['playcount'].toLocaleString();
        else if(attribute === 'title')dataFields[i].textContent = data['title']
        else if(attribute === 'mapper')dataFields[i].textContent = data['creator']
        else if(attribute === 'audio')dataFields[i].src = data['audio']
        else if(attribute === 'score')dataFields[i].textContent = localStorage.getItem('score')
        else if(attribute === 'maxScore')dataFields[i].textContent = localStorage.getItem('maxScore')
        else if(attribute === 'maplink')dataFields[i].href = data['maplink']
    }
}

firstVisit()

// more normal js donw here who be coding up there :sob:

document.querySelectorAll('.playButton').forEach(button => {
    button.addEventListener('click', () => {
        const audio = button.parentElement.querySelector('audio')
        if(audio.paused)audio.play()
        else audio.pause()
    })
})