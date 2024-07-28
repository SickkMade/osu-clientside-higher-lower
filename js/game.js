function submitForm(button) {
    const scores = {
        top: JSON.parse(localStorage.getItem('top')).playcount,
        bottom: JSON.parse(localStorage.getItem('bottom')).playcount
    };

    const isValid = scores[button] <= scores[button === 'top' ? 'bottom' : 'top'];

    return isValid ? succeed() : fail();
}

function increaseNumber(displayElement, max){
    const duration = 500;
    const startTime = performance.now();

        function update(){
            const currentTime = performance.now();
            const elapsed = currentTime - startTime
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
    setTimeout(() => {
        window.location.href = './fail.html'; 
    }, 1000)
}

function succeed(){
    let score = parseInt(localStorage.getItem('score'))
    let maxScore = parseInt(localStorage.getItem('maxScore'))
    localStorage.setItem('score', ++score)
    localStorage.setItem('maxScore', Math.max(score, maxScore))

    document.querySelectorAll('.score').forEach(score => {
        score.classList.add('shake')
        setTimeout(()=>{
            score.classList.remove('shake')
        }, 300)
    })
    
    localStorage.setItem('top', localStorage.getItem('bottom'))
    localStorage.removeItem('bottom')
    animationController()
    setTimeout(() => {
        getData()
    }, 1000)
    
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
    }, 1000);
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
        else if(attribute === 'audio')dataFields[i].textContent = data['audio']
        else if(attribute === 'score')dataFields[i].textContent = localStorage.getItem('score')
        else if(attribute === 'maxScore')dataFields[i].textContent = localStorage.getItem('maxScore')
    }
}

firstVisit()