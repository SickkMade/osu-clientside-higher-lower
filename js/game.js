function submitForm(button){
    alert(button)
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

        if(attribute === 'cover') dataFields[i].src = data['cover']
        else if(attribute === 'playCount') dataFields[i].textContent = data['playcount'].toLocaleString();
        else if(attribute === 'title')dataFields[i].textContent = data['title']
        else if(attribute === 'mapper')dataFields[i].textContent = data['creator']
        else if(attribute === 'audio')dataFields[i].textContent = data['audio']
    }
}

getData()