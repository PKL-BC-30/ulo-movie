import { createSignal, onMount } from 'solid-js';
import './popupTrailer.css';

const PopupTrailer = (props) => {
    const [isPopupVisiblePlus, setIsPopupVisiblePlus] = createSignal(false);
    const [isPopupVisibleLike, setIsPopupVisibleLike] = createSignal(false);
    const [isPlusActive, setIsPlusActive] = createSignal(false);
    const [isLikeActive, setIsLikeActive] = createSignal(false);
    const [isVolumeMuted, setIsVolumeMuted] = createSignal(false);
    const [isVideoPause, setIsVideoPause] = createSignal(false);
    const [isVideoVisible, setIsVideoVisible] = createSignal(false);
    const [isVideoLoaded, setIsVideoLoaded] = createSignal(false);
    const [currentTime, setCurrentTime] = createSignal(0);
    const [duration, setDuration] = createSignal(0);
    const [isExpanded, setIsExpanded] = createSignal(false);
    let videoRef;
    let progressBarRef;
    let isDragging = false;

     // Fungsi untuk menutup popup
     const handleClose = () => {
        if (props.onClose) {
            props.onClose(); // Panggil fungsi onClose yang dikirim dari parent (Beranda-Dekstop.tsx)
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded());
    };

    const handlePlusClick = () => {
        setIsPlusActive(!isPlusActive());
    };

    const handleLikeClick = () => {
        setIsLikeActive(!isLikeActive());
    };

    const handleVolumeClick = () => {
        if (videoRef) {
            videoRef.muted = !videoRef.muted;
            setIsVolumeMuted(!isVolumeMuted());
        }
    };

    const handlePauseClick = () => {
        if (videoRef) {
            if (videoRef.paused) {
                videoRef.play()
                    .then(() => {
                        setIsVideoPause(false);
                    })
                    .catch((error) => {
                        console.error("Error playing video:", error);
                    });
            } else {
                videoRef.pause();
                setIsVideoPause(true);
            }
        }
    };

    const updateProgressPosition = (event) => {
        if (!progressBarRef) return;
        
        const rect = progressBarRef.getBoundingClientRect();
        const pos = (event.clientX - rect.left) / rect.width;
        const newTime = pos * duration();
        
        if (newTime >= 0 && newTime <= duration()) {
            videoRef.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    // Handle mouse down on progress bar
    const handleProgressMouseDown = (event) => {
        isDragging = true;
        updateProgressPosition(event);
    };

    // Handle mouse move while dragging
    const handleProgressMouseMove = (event) => {
        if (isDragging) {
            updateProgressPosition(event);
        }
    };

    // Handle mouse up anywhere in the document
    const handleProgressMouseUp = () => {
        isDragging = false;
    };

    onMount(() => {
        // Add global mouse event listeners
        document.addEventListener('mousemove', handleProgressMouseMove);
        document.addEventListener('mouseup', handleProgressMouseUp);

        if (videoRef) {
            videoRef.muted = isVolumeMuted();
        }

        setTimeout(() => {
            setIsVideoVisible(true);
            if (videoRef && !isVideoPause()) {
                videoRef.play()
                    .catch((error) => {
                        console.error("Error auto-playing video:", error);
                    });
            }
        }, 2000);

        // Cleanup event listeners
        return () => {
            document.removeEventListener('mousemove', handleProgressMouseMove);
            document.removeEventListener('mouseup', handleProgressMouseUp);
        };
    });

    const setupVideoEvents = (element) => {
        if (element) {
            videoRef = element;
            
            // Handle video load events
            videoRef.addEventListener('loadedmetadata', () => {
                setDuration(videoRef.duration);
            });

            videoRef.addEventListener('canplay', () => {
                if (!isVideoLoaded()) {
                    setIsVideoLoaded(true);
                    if (!isVideoPause()) {
                        videoRef.play()
                            .catch((error) => {
                                console.error("Error auto-playing video:", error);
                            });
                    }
                }
            });

            videoRef.addEventListener('timeupdate', () => {
                setCurrentTime(videoRef.currentTime);
            });

            videoRef.addEventListener('ended', () => {
                setIsVideoPause(true);
            });

            videoRef.addEventListener('error', (e) => {
                console.error("Video error:", e);
            });
        }
    };

    // Calculate progress bar width based on current time
    const getProgressWidth = () => {
        if (duration() === 0) return '0';
        const progress = (currentTime() / duration()) * 200; // 200px is max width
        return `${progress}px`;
    };

    return (
        <div class='popup-overlay'>
            <div class='popup-scroll'>
                <div class='popup-content' style={{ height: isExpanded() ? '3650px' : '2425px' }}>
                    <img src="src/ULO/Trailer/assets/close.svg" alt="close" class='closeIcon' onClick={handleClose} />
                    {isVideoVisible() ? (
                        <video
                            ref={setupVideoEvents}
                            src="src/ULO/Trailer/assets/videoTrailer.mp4"
                            autoplay
                            muted={isVolumeMuted()} // Sesuaikan dengan kondisi volume
                            controls={false}
                            class={`video-player ${isVideoLoaded() ? 'fade-in' : ''}`}
                        />
                    ) : (
                        <img src="src/ULO/Trailer/assets/thumbnail.svg" alt="Thumbnail" class={`thumbnail ${isVideoVisible() ? 'fade-out' : ''}`} />
                    )}
                    <div class='gradasi'></div>
                    <div class='content1'>
                        <div class='kiri'>
                            <div class='kategori'>
                                <p class='kategoriDeskripsi'>PETUALANGAN</p>
                                <div class='batas'></div>
                                <p class='kategoriDeskripsi'>LAGA</p>
                                <div class='batas'></div>
                                <p class='kategoriDeskripsi'>GANGSTER</p>
                            </div>
                            <h1 class='judulTrailer'>Extraction 2</h1>
                            <div class='aksi'>
                                <button class='aksi1'>
                                    <p class='textPutar'>Putar Sekarang</p>
                                    <img src="src/ULO/Trailer/assets/play.svg" alt="Putar Sekarang" class='playButton' />
                                </button>
                                <button 
                                    class='aksi2'
                                    onClick={handlePlusClick} 
                                    onMouseEnter={() => setIsPopupVisiblePlus(true)}
                                    onMouseLeave={() => setIsPopupVisiblePlus(false)}
                                >
                                    <img 
                                        src={isPlusActive() 
                                            ? "src/ULO/Trailer/assets/check.svg" 
                                            : "src/ULO/Trailer/assets/plus.svg"} 
                                        alt={isPlusActive() 
                                            ? "Tambah Daftar Active" 
                                            : "Tambah Daftar"} 
                                        class='plusButton' 
                                    />
                                    {isPopupVisiblePlus() && (
                                        <div class='popup-tambah-daftar'>
                                            <img src="src/ULO/Trailer/assets/tambahDaftar.svg" alt="Tambah Daftar Popup" class='tambahDaftar' />
                                        </div>
                                    )}
                                </button>
                                <button
                                    class='aksi3' 
                                    onClick={handleLikeClick}
                                    onMouseEnter={() => setIsPopupVisibleLike(true)}
                                    onMouseLeave={() => setIsPopupVisibleLike(false)}
                                >
                                    <img 
                                        src={isLikeActive() 
                                            ? "src/ULO/Trailer/assets/likeActive.svg" 
                                            : "src/ULO/Trailer/assets/like.svg"} 
                                        alt={isLikeActive() 
                                            ? "Like Film Active" 
                                            : "Like Film"} 
                                        class='likeButton' 
                                    />
                                    {isPopupVisibleLike() && (
                                        <div class='popup-liked'>
                                            <img src="src/ULO/Trailer/assets/sayaSuka.svg" alt="Liked Popup" class='sayaSuka' />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div class='kanan'>
                            <div onClick={handleVolumeClick}>
                                <img 
                                    src={isVolumeMuted() 
                                        ? "src/ULO/Trailer/assets/suaraMati.svg" 
                                        : "src/ULO/Trailer/assets/suaraNyala.svg"} 
                                    alt={isVolumeMuted() 
                                        ? "Suara Mati" 
                                        : "Suara Nyala"} 
                                    class='suara' 
                                />
                            </div>
                            <div class='controlVideo'>
                                <div onClick={handlePauseClick}>
                                    <img 
                                        src={isVideoPause() 
                                            ? "src/ULO/Trailer/assets/playVideo.svg" 
                                            : "src/ULO/Trailer/assets/pauseVideo.svg"} 
                                        alt={isVideoPause() 
                                            ? "Suara Mati" 
                                            : "Suara Nyala"} 
                                        class='pauseVideo' 
                                    />
                                </div>
                                <div 
                                    class='durasiVideo' 
                                    ref={progressBarRef} 
                                    onMouseDown={handleProgressMouseDown}
                                >
                                    <div class='durasiTotal'></div>
                                    <div 
                                        class='durasiActive' 
                                        style={{ width: getProgressWidth() }}
                                    ></div>
                                </div>
                                <p class='keteranganAngka'>03:39</p>
                            </div>
                        </div>
                    </div>
                    <div class='content2'>
                        <div class='kiri2'>
                            <div class='informasi1'>
                                <p class='tanggalRilis'>2023 2h 3min</p>
                                <img src="src/ULO/Trailer/assets/hdJudul.svg" alt="HD Judul" class='hdJudul' />
                                <img src="src/ULO/Trailer/assets/audioJudul.svg" alt="Audio Judul" class='audioJudul' />
                            </div>
                            <div class='informasi2'>
                                <img src="src/ULO/Trailer/assets/18Judul.svg" alt="18 Judul" class='judul18' />
                                <p class='kekerasan'>Kekerasan, Kata-Kata Kasar</p>
                            </div>
                            <p class='deskripsiFilm'>Kali ini dirinya ditugaskan untuk menyelamatkan sebuah keluarga <br />gangster Georgia yang keji nan kejam. Misinya adalah menyelamatkan <br />semua anggota keluarga tersebut dari penjara tempat mereka ditahan. <br />Lantas, berhasilkah Tyler menyelesaikan misi tersebut?</p>
                        </div>
                        <div class='kanan2'>
                            <div class="sectionTrailer">
                                <span class="label">Pemeran:</span>
                                <span class="value">
                                Chris Hemsworth, Golshifteh Farahani, Tornike Gogrichiani, Adam Bessa, Daniel Bernhardt, Tinatin Dalakishvili, <em>lainnya</em>
                                </span>
                            </div>

                            <div class="sectionTrailer">
                                <span class="label">Genre:</span>
                                <span class="value">Film Laga & Petualangan, Film Amerika</span>
                            </div>

                            <div class="sectionTrailer">
                                <span class="label">Film ini:</span>
                                <span class="value">Penuh Ledakan, Kasar dan Brutal</span>
                            </div>
                        </div>
                    </div>
                    <div class='content3'>
                        <div class='judulKoleksi'>
                            <img src="src/ULO/Trailer/assets/koleksi.svg" alt="Koleksi" class='koleksiIcon' />
                            <h2 class='textKoleksi'>Koleksi Extraction</h2>
                        </div>
                        <div class='card-container'>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/koleksi1.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2020</p>
                                <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                            </div>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/koleksi2.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Kembali dari ambang kematian, <br />Tyler Rake, prajurit komando <br />yang amat lihai, melakukan misi <br />berbahaya lagi: menyelamatkan <br />keluarga gangster keji yang <br />sedang ditawan.</p>
                            </div>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/koleksi3.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Kembali dari ambang kematian, <br />Tyler Rake, prajurit komando <br />yang amat lihai, melakukan misi <br />berbahaya lagi: menyelamatkan <br />keluarga gangster keji yang <br />sedang ditawan.</p>
                            </div>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/koleksi4.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Kembali dari ambang kematian, <br />Tyler Rake, prajurit komando <br />yang amat lihai, melakukan misi <br />berbahaya lagi: menyelamatkan <br />keluarga gangster keji yang <br />sedang ditawan.</p>
                            </div>
                        </div>
                    </div>
                    <div class='content4'>
                        <h1 class='textLainnya'>Lainnya Seperti Ini</h1>
                        <div class='card-container1'>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/lainnya1.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                            </div>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/lainnya2.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                            </div>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/lainnya3.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                            </div>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/lainnya4.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                            </div>
                        </div>
                        <div class='card-container2'>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/lainnya5.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                            </div>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/lainnya6.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                            </div>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/lainnya7.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                            </div>
                            <div class='card'>
                                <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                <img src="src/ULO/Trailer/assets/lainnya8.svg" alt="Koleksi Image" class='koleksiImage' />
                                <div class='spesifikasi'>
                                    <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                    <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                    <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                </div>
                                <p class='tahun'>2023</p>
                                <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                            </div>
                        </div>
                        {isExpanded() && (
                            <>
                            <div class='card-container3'>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya9.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya10.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya11.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya12.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                            </div>
                            <div class='card-container4'>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya13.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya14.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya15.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya16.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                            </div>
                            <div class='card-container5'>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya17.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya18.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya19.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                                <div class='card'>
                                    <img src="src/ULO/Trailer/assets/playFilm.svg" alt="Play Film" class='playFilm' />
                                    <img src="src/ULO/Trailer/assets/lainnya20.svg" alt="Koleksi Image" class='koleksiImage' />
                                    <div class='spesifikasi'>
                                        <img src="src/ULO/Trailer/assets/18Koleksi.svg" alt="18 Koleksi" class='koleksi18' />
                                        <img src="src/ULO/Trailer/assets/hdKoleksi.svg" alt="HD Koleksi" class='hdKoleksi' />
                                        <img src="src/ULO/Trailer/assets/audioKoleksi.svg" alt="Audio Koleksi" class='audioKoleksi' />
                                    </div>
                                    <p class='tahun'>2023</p>
                                    <p class='deskripsiKoleksi'>Misi baru pembunuh bayaran <br />tangguh ini menjadi pencarian <br />jati diri demi bertahan hidup saat <br />ia diutus ke Bangladesh untuk <br />menyelamatkan putra bandar <br />narkoba yang diculik.</p>
                                </div>
                            </div>
                            </>
                        )}
                        <div class='pembatasLainnya' style={{ "margin-top": isExpanded() ? '0px' : '-100px' }}>
                            <div class='garisPembatas'></div>
                            <img 
                                src="src/ULO/Trailer/assets/arrowDown.svg" 
                                alt="Arrow Down" 
                                class='arrowDown'
                                style={{ transform: isExpanded() ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                onClick={toggleExpand}
                            />
                        </div>
                    </div>
                    <div class='content5' style={{ "margin-top": isExpanded() ? '150px' : '50px' }}>
                        <h1 class='textTentang'>Tentang Extraction 2</h1>
                        <div class='kiri3'>
                            <div class="sectionTentang">
                                <span class="title">Sutradara:</span>
                                <span class="isi">Sam Hargrave</span>
                            </div>

                            <div class="sectionTentang">
                                <span class="title">Pemeran:</span>
                                <span class="isi">Chris Hemsworth, Golshifteh Farahani, Tornike Gogrichiani, Adam Bessa, Daniel Bernhardt, Tinatin Dalakishvili</span>
                            </div>

                            <div class="sectionTentang">
                                <span class="title">Penulis:</span>
                                <span class="isi">Joe Russo</span>
                            </div>

                            <div class="sectionTentang">
                                <span class="title">Genre:</span>
                                <span class="isi">Film Laga & Petualangan, Film Amerika</span>
                            </div>

                            <div class="sectionTentang">
                                <span class="title">Film ini:</span>
                                <span class="isi">Penuh Ledakan, Kasar dan Brutal</span>
                            </div>

                            <div class="sectionRating">
                                <span class="title">Rating usia:</span>
                                <img src="src/ULO/Trailer/assets/18Tentang.svg" alt="18 Tentang" class='tentang18' />
                                <span class="isi">Kekerasan, Kata-Kata Kasar, Sesuai untuk yang berusia 18 tahun ke atas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupTrailer;