/**
 * 1. Render songs
 * 2. Scroll top 
 * 3. Play / pause / seek 
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */
    const Player_Storage_Key = 'thanhlearntech player'

    const $ = document.querySelector.bind(document)
    const cd = $('.cd')
    const heading = $('header h2')
    const cdThumb = $('.cd-thumb')
    const audio = $('#audio')
    const playBtn = $('.btn-toggle-play')
    const player = $('.player')
    const progress = $('.progress')
    const nextBtn = $('.btn-next')
    const prevBtn = $('.btn-prev')
    const randomBtn = $('.btn-random')
    const repeatBtn = $('.btn-repeat')
    const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(Player_Storage_Key)) || {},
    songs: [
        {
            name: 'Fractures',
            singer: 'Illenium',
            path: './MusicFolder/Illenium - Fractures (Feat. Nevve).mp3',
            image: './MusicFolder/T.png'
        },
        {
            name: 'Homesick',
            singer: 'MitiS',
            path: './MusicFolder/MitiS - Homesick (Lyrics) feat. SOUNDR.mp3',
            image: './MusicFolder/T.png'
        },
        {
            name: 'Homesick',
            singer: 'MitiS',
            path: './MusicFolder/MitiS - Homesick (Lyrics) feat. SOUNDR.mp3',
            image: './MusicFolder/T.png'
        },
        {
            name: 'Mine',
            singer: 'Phoebe Ryan',
            path: './MusicFolder/Phoebe Ryan - Mine (Illenium Remix).mp3',
            image: './MusicFolder/T.png'
        },
        {
            name: 'Unbroken',
            singer: 'LOCKBOX',
            path: './MusicFolder/Unbroken (LOCKBOX Remix).mp3',
            image: './MusicFolder/T.png'
        },
        {
            name: 'Unbroken',
            singer: 'LOCKBOX',
            path: './MusicFolder/Unbroken (LOCKBOX Remix).mp3',
            image: './MusicFolder/T.png'
        },
        
    ],
    setconfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(Player_Storage_Key, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = app.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index='${index}'>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="musicbox">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const cdWidthd = cd.offsetWidth

        //handle CD roate
        const cdThumbAnimate = cdThumb.animate ([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })

        // handle zoom in/out cd image
        document.onscroll = function() {
           const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidthd - scrollTop

            // console.log(newCdWidth);
            cd.style.width = newCdWidth > 0 ?  newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidthd
        }

        //handle when click play
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()
            } else {
                app.render()
                audio.play()
            }
            
        },

        //when song is played
            audio.onplay = function() {
                app.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
        },
        //when song is paused
            audio.onpause = function() {
                app.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

        //when song - play time updates
        audio.ontimeupdate = function() {
            if (audio.duration) {
            const progressPercentage = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercentage
            }
        }

        //handle when song is playing
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //handle when clicked next song 
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }
        
        //handle when clicked prev song
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.prevSong()
            }
            
            audio.play()
            app.render()
        }

        // handle random song 
        randomBtn.onclick = function(e) {
            app.isRandom = !app.isRandom
            app.setconfig('isRandom', app.isRandom)
            randomBtn.classList.toggle('active', app.isRandom)
           
        }


        //handle repeat song 
        repeatBtn.onclick = function(e) {
            app.isRepeat = !app.isRepeat
            app.setconfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', this.isRepeat)
        }

        //handle next song when audio ended
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        //handle when clicked on music playlist
        playlist.onclick = function(e) {

            const songNode = e.target.closest('.song:not(.active)')
            const songOption = e.target.closest('.option')
            
            if(songNode || songOption) {
                
                //handle when clicked on the song
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }
                
                //handle when clicked on the song option
                if (songOption) {

                }

            }
        } 
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        // console.log(heading, cdThumb, audio);
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },

    //next song 
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        } 
        this.loadCurrentSong()
    },

    // prev song 
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        } 
        this.loadCurrentSong()
    },

    // random song 
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
            
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    
    
    start: function() {
        //assign configuration to config
        this.loadConfig()

        //define properties for object 
        this.defineProperties()
        
        //listen to all the dom events 
        this.handleEvents()

        //load the first song into UI when the app runs
        this.loadCurrentSong()

        //Render playlist 
        this.render()

        // show the initial state of the button repeat and random
        repeatBtn.classList.toggle('active', app.isRepeat)
        randomBtn.classList.toggle('active', app.isRandom)
    }
}

app.start()