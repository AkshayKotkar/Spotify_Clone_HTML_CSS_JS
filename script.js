console.log("Let Hello Javascript")

async function getsongs(){
   let a = await fetch("http://127.0.0.1:5501/songs/")
   let response = await a.text();
   let div = document.createElement("div")
   div.innerHTML = response
   let as = div.getElementsByTagName("a")
   let songs = []
   for (let index = 0; index < as.length; index++) {
    const element = as[index];
    let href = element.getAttribute("href");
        if (href.endsWith("mp3")) {
            href = href.split("/").pop().replace("(PaglaSongs).mp3","").replaceAll("-"," ")
            songs.push(href);
    }
   }
   return songs
}

async function main() {
    let songs = await getsongs();
    console.log(songs);

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
        <img src="music.svg" alt="Music" class="invert">
        <div class="info">
            <div> ${song}</div>
        </div>
        <img src="play.svg" alt="Play" class="invert">
    </li>`;
    }

    if (songs.length > 0) {
        var audio = new Audio(songs[0]);
        audio.play();
    } else {
        console.log("No songs found.");
    }
}

main()