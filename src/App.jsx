import { ChevronFirst, ChevronLast, Pause, Play } from 'lucide-react'
import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactPlayer from "react-player"

const musicas = [
  'IfXZWup8LMs',
  'LDsGMiv2NQw',
  '9hI3iWRWABA',
  'drqwogSEgTo',
]

function App() {

  const [playing, setPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [durationTime, setDurationTime] = useState(0)

  const [currentSong, setCurrentSong] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filaSongs, setFilaSongs] = useState([])

  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])


  const handleClick = () => {

    setPlaying(!playing)
  }

  function formatTwoDigits(num) {
    return String(num).padStart(2, '0');
  }

  const addFila = (video) => {
    setSearch("")
    setSearchResult([])
    setFilaSongs(prev => [...prev, video])
  }

  const fetchData = async () => {
    const api_key = import.meta.env.VITE_GOOGLE_API_KEY
    let items
    await axios.get(`https://www.googleapis.com/youtube/v3/search/?key=${api_key}&part=snippet&q=youtu.be/${search} rap`).then((res) => {
      items = res.data.items
    })
    return items
  }

  useEffect(() => {
    if (filaSongs.length > 0) {
      setCurrentSong(filaSongs[currentIndex])
    }
  }, [currentIndex, filaSongs])

  const handleSearch = async () => {
    const response = await fetchData()

    const raps = []

    response.forEach(video => {
      const tituloVideo = video.snippet.title
      if (tituloVideo.match(/tauz/i)) {
        raps.push({
          id: video.id.videoId,
          canal: video.snippet.channelTitle,
          titulo: video.snippet.title,
          capa: video.snippet.thumbnails.high.url,
        })
      }
    });

    if (raps.length > 0) {
      setSearchResult(raps)
    } else {
      console.log('Não foram encontrados nenhum rap do tauz')
    }

    // console.log(response)
  }


  return (
    <>
      <h1>radio player tauz - deluxe</h1>

      {currentSong && (
        <div>
          <div className='video-container'>
            <ReactPlayer volume={1} playing={playing} src={`https://www.youtube.com/watch?v=${currentSong.id}`} onTimeUpdate={(e) => setCurrentTime(e.target.api.getCurrentTime().toFixed(0))} />
          </div>
          <img className='capa-playing' src={currentSong.capa} alt="" />
          <p>{Math.trunc(currentTime / 60)}:{currentTime % 60}</p>
          <div>
            <button onClick={
              () => {
                setCurrentIndex(prev => prev - 1)
                setCurrentTime(0)
              }
            }>
              <ChevronFirst />
            </button>
            <button onClick={handleClick}>
              {playing ? <Pause /> : <Play />}
            </button>
            <button onClick={
              () => {
                setCurrentIndex(prev => prev + 1)
                setCurrentTime(0)
              }
            }>
              <ChevronLast />
            </button>
          </div>
        </div>
      )
      }


      <div>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={handleSearch}>pesquianr</button>
      </div>

      <div>
        <h2>pesquisa</h2>
        {searchResult.length > 0 && searchResult.map((item) => (
          <div className='card-serach-result' onClick={() => { addFila(item) }} key={item.id}>
            <img className='capa-preview' src={item.capa} alt="" />
            <div>
              <p>{item.titulo}</p>
              <p>{item.canal}</p>
            </div>
          </div>
        ))}
      </div>

      {
        filaSongs.length > 0 && (
          <div>
            <h2>playlist</h2>
            {filaSongs.map((item,index) => (
              <div key={item.id} className='card-serach-result' onClick={()=>setCurrentIndex(index)}>
                <img className='capa-preview' src={item.capa} alt="" />
                <div>
                  <p>{item.titulo}</p>
                  <p>{item.canal}</p>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {/* <div>
        <p>
          {formatTwoDigits(Math.trunc(currentTime / 60))}:{formatTwoDigits((currentTime % 60).toFixed(0))} / {formatTwoDigits(Math.trunc(durationTime / 60))}:{formatTwoDigits(durationTime % 60)}
        </p>
      </div>

 */}
    </>

  )
}

export default App
