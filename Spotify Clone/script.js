let currentSong=new Audio();
let songs;
let currFolder;

function extractFileName(fullSrc) {
    return decodeURIComponent(fullSrc.split("/").slice(-1)[0]);
}


async function getsongs(folder) {
    currFolder=folder
    let a = await fetch(`http://127.0.0.1:5501/Spotify%20Clone/songs/${folder}/`)

    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response

    let ul = div.querySelector('#files')
    let as = ul.querySelectorAll('a')
    songs = []
    Array.from(as).forEach((element, index, array) => {
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`/songs/${folder}/`)[1]))
        }
    })

    let songUL = document.querySelector(".songList").getElementsByTagName('ul')[0]  
    songUL.innerHTML=""

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`
    }


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener('click', (element) => {
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())
            play.src = "img/pause.svg"
        })
    })

return songs

}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
 
const playMusic = (track,pause=false) => {
    currentSong.src=`/Spotify%20Clone/songs/${currFolder}/${encodeURIComponent(track)}`

    if(!pause){
        currentSong.play().catch(error => {
            console.error("Error playing the song: ", error); 
            play.src = "img/pause.svg"
        });
    }
   

    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00:00/00:00"
};


async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5501/Spotify%20Clone/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    
    let ul = div.querySelector('#files')
    let as = ul.querySelectorAll('a')
    let cardContainer = document.querySelector(".cardContainer")

    let array=Array.from(as);


        for(let element of array){
            if (element.href.includes("/songs")) {   
                let folder=element.href.split("/").slice(-1)[0]
                let a = await fetch(`http://127.0.0.1:5501/Spotify%20Clone/songs/${folder}/info.json`)
                let response = await a.json()

                cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                            stroke-linejoin="round" />
                    </svg>
                </div>
    
                <img src="/Spotify%20Clone/songs/${folder}/cover.jpg" alt="">
                <div class="content">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
                </div>
            </div>`
    
            }
    }

    Array.from(document.getElementsByClassName('card')).forEach(e=>{
        e.addEventListener('click',async item=>{
            songs=await getsongs(item.currentTarget.dataset.folder)
            playMusic(songs[0])
           play.src = "img/pause.svg"
        })
    })
}


async function main() {
    await getsongs("Rock")
    playMusic(songs[0],true)

    displayAlbums()

    // Adding event listener to play
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

  // Now adding event listner to seekbaar 
    document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
})

   // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
    console.log("hamburger clicked")
    document.querySelector(".left").style.left = "0"
    document.querySelector(".left>.close>img").style.cursor = "pointer"

})

// Add an event listener for close button
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
})
  

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")

        let index = songs.indexOf(extractFileName(currentSong.src))
        if ((index - 1) >= 0) {
            play.src = "img/pause.svg"
            playMusic(songs[index - 1])
        }
        else{
             playMusic(songs[songs.length-1])
            play.src = "img/pause.svg"
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")
        let index = songs.indexOf(extractFileName(currentSong.src))
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
            play.src = "img/pause.svg"

        }
        else{
            playMusic(songs[0])
            play.src = "img/pause.svg"
        }
    })


    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}

main()
