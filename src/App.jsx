import { ChevronFirst, ChevronLast, Pause, Play, Regex } from 'lucide-react'
import './App.css'
import { useEffect, useState } from 'react'
import ReactPlayer from "react-player"
import data from './data.json'

function App() {

  const [playing, setPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [durationTime, setDurationTime] = useState(0)

  const [darkMode, setDarkmode] = useState(true)

  const [currentSong, setCurrentSong] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState(data)
  const [filaSongs, setFilaSongs] = useState([])


  const handleClick = () => {
    setPlaying(!playing)
  }

  const addFila = (video) => {
    setSearch("")
    setFilaSongs(prev => [...prev, video])
  }

  useEffect(() => {
    if (filaSongs.length > 0) {
      setCurrentSong(filaSongs[currentIndex])
    }
  }, [currentIndex, filaSongs])

  const searchData = () => {
    const searchedData = []

    data.forEach((item) => {
      if (item.titulo.match(new RegExp(search, 'gi'))) {
        searchedData.push(item)
      }
    })

    return searchedData
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    const searchedData = searchData()

    setSearchResult(searchedData)
  }




  return (
    <main className={`${darkMode && 'darkmode'}`}>
      <div>
        <h1>radio player tauz - deluxe</h1>
        <input checked={darkMode} type="checkbox" name="" id="" onChange={(e) => setDarkmode(e.target.checked)} />
        <p className='codigo-fonte'>codigo fonte: https://github.com/sopahaha/radio-tauz-deluxe</p>

        {currentSong && (
          <div>
            <div className='video-container'>
              <ReactPlayer volume={1} playing={playing} src={`https://www.youtube.com/watch?v=${currentSong.id}`} onTimeUpdate={(e) => setCurrentTime(e.target.api.getCurrentTime())} onDurationChange={(e) => setDurationTime(e.target.api.getDuration())} />
            </div>
            <img className='capa-playing' src={currentSong.capa} alt="" />
            <div className='container-progress'>
              <div className='progress' style={{ width: `${(100 * currentTime) / durationTime}%` }}></div>
            </div>
            <p>{Math.trunc((currentTime.toFixed(0)) / 60)}:{(currentTime.toFixed(0)) % 60}</p>
            <div>
              <button disabled={currentIndex <= 0} onClick={
                () => {
                  if (currentIndex <= 0) return
                  setCurrentIndex(prev => prev - 1)
                  setCurrentTime(0)
                }
              }>
                <ChevronFirst />
              </button>
              <button onClick={handleClick}>
                {playing ? <Pause /> : <Play />}
              </button>
              <button disabled={filaSongs.length === currentIndex + 1} onClick={
                () => {
                  if (filaSongs.length === currentIndex + 1) return
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
      </div>


      <div>

        {
          searchResult.length > 0 && (
            <div>
              <h2>pesquisa</h2>
              <div className='list-container'>
                {searchResult.map((item) => (
                  <div className='card-serach-result' onClick={() => { addFila(item) }} key={item.id}>
                    <img className='capa-preview' src={item.capa} alt="" />
                    <div>
                      <p>{item.titulo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        {
          filaSongs.length > 0 && (
            <div>
              <h2>playlist</h2>
              <div className='list-container'>
                {filaSongs.map((item, index) => (
                  <div key={item.id} className='card-serach-result' onClick={() => setCurrentIndex(index)}>
                    <img className='capa-preview' src={item.capa} alt="" />
                    <div>
                      <p>{item.titulo}</p>
                      <p>{item.canal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div>

      {/* <div>
        <p>
          {formatTwoDigits(Math.trunc(currentTime / 60))}:{formatTwoDigits((currentTime % 60).toFixed(0))} / {formatTwoDigits(Math.trunc(durationTime / 60))}:{formatTwoDigits(durationTime % 60)}
        </p>
      </div>

 */}
    </main>

  )
}

export default App
