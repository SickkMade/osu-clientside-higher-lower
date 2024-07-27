function submitForm(button) {
    const scores = {
        top: JSON.parse(localStorage.getItem('top')).playcount,
        bottom: JSON.parse(localStorage.getItem('bottom')).playcount
    };

    const isValid = scores[button] < scores[button === 'top' ? 'bottom' : 'top'];

    return isValid ? succeed() : fail();
}

function fail(){
    localStorage.removeItem('top')
    localStorage.removeItem('bottom')
    localStorage.setItem('score', 0)
    animationController()
    setTimeout(() => {
        window.location.replace('/fail.html')
    }, 1000)
}

function succeed(){
    let score = parseInt(localStorage.getItem('score'))
    let maxScore = parseInt(localStorage.getItem('maxScore'))
    localStorage.setItem('score', ++score)
    localStorage.setItem('maxScore', Math.max(score, maxScore))
    
    localStorage.setItem('top', localStorage.getItem('bottom'))
    localStorage.removeItem('bottom')
    animationController()
    setTimeout(() => {
        getData()
    }, 1000)
    
}

function animationController(){
    document.querySelector('#clickers').classList.add('invis')
    document.querySelector('#bottomPlayCount').classList.remove('invis')
    setTimeout(() => {
        document.querySelector('#clickers').classList.remove('invis')
        document.querySelector('#bottomPlayCount').classList.add('invis')
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