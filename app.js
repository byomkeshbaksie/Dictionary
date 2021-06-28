let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '659480d0-21c0-4d15-ba41-8bb20e160de1';
let notfound = document.querySelector('.not_found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');


searchBtn.addEventListener('click', function(e){
    e.preventDefault();
    //clear data
    audioBox.innerText ='';
    notfound.innerText ='';
    defBox.innerText ='';
    //get input data
    let word = input.value;

    //call API get data
    if (word === ''){
        alert('Word is required');
        return;
    } 

    getData(word);
})

async function getData(word){
    loading.style.display = 'block';
    //Ajax call
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);
    const data = await response.json();

    //if empty result
    if (!data.length){
        loading.style.display = 'none';
        notfound.innerText = 'No result found';
        return;
    }

    //if result is suggestions
    if (typeof data[0] === 'string'){
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?'
        notfound.appendChild(heading);
        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;
            notfound.appendChild(suggestion);
       })
        return;
}

    //Result found
    loading.style.display = 'none';
    let definition = data[0].shortdef[0];
    defBox.innerText = definition;

    //Sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if(soundName){
        renderSound(soundName);
    }

    console.log(data);
}

function renderSound(soundName) {
    // https://media.merriam-webster.com/soundc11
    let subfolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}