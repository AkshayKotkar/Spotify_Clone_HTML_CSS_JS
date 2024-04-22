console.log("Let Hello Javascript")

// Seconds time convert into Minutes
function sectomin(seconds){
    const minutes = Math.floor(seconds / 60);
    const remminutes = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2,"0");
    const formattedSeconds = String(remminutes).padStart(2,"0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Function for fetch the songs from directory.
async function getsongs(){
   let a = await fetch("http://127.0.0.1:5501/songs/")
   let response = await a.text();
   let div = document.createElement("div")
   div.innerHTML = response
   let as = div.getElementsByTagName("a")
   let songs = []
   for (let index = 0; index < as.length; index++) {
    const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
    }
   }
   return songs
}

let currentsongs = new Audio();

const playMusic = (track, pause = false)=>{
    // let audio = new Audio("/songs/" + track)
    currentsongs.src = "/songs/" + track
    if(!pause){
        currentsongs.play()
        play.src = "SVG/pause.svg"
    }
    document.querySelector(".songname").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    let songs = await getsongs();
    // show fisrt song
    playMusic(songs[0],true)
    // Show all song in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
        <img src="SVG/music.svg" alt="Music" class="invert">
        <div class="info">
            <div> ${song.replaceAll("%20"," ")}</div>
        </div>
        <img src="SVG/play.svg" alt="Play" class="invert">
    </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    // Attach an Event listener to play, next, previous
    play.addEventListener("click", ()=>{
        if(currentsongs.paused){
            currentsongs.play()
            play.src = "SVG/pause.svg"
        }
        else{
            currentsongs.pause()
            play.src = "SVG/play.svg"
        }
    })

    // Time update event
    currentsongs.addEventListener("timeupdate", ()=>{
        console.log(currentsongs.currentTime, currentsongs.duration);
        document.querySelector(".songtime").innerHTML = `${sectomin(currentsongs.currentTime)}/${sectomin(currentsongs.duration)}`;
        document.querySelector(".circle").style.left = (currentsongs.currentTime / currentsongs.duration) * 100 + "%";
    })

    // Add Event listener to seekbar for backword and forword song
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let seekpct = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left =  seekpct + "%";
        currentsongs.currentTime = (currentsongs.duration * seekpct) / 100;
    })
}

main()