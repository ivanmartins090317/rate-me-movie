import { useState, useEffect } from "react" 

const App = () => {
const [movies, setMovies] = useState([])
const [watchedMovie, setWatchedMovie] = useState([])
const [clickedMovie, setClickedMovie] = useState(null)


console.log(import.meta.env.VITE_API_KEY)
const getTotalTime = watchedMovie => 
  watchedMovie?.reduce((acc, item) => acc + +item.runTime.split(' ')[0], 0)

const handleDeleteMovie = movieID => setWatchedMovie(prev => prev.filter(p => p.id !== movieID) )

const clickedOnMovie = (movie) => setClickedMovie(prev =>
  prev?.id === movie.id ? null : movie)

  const handleSubmitMovie = e => {
    e.preventDefault()
    const {valueMovie} = e.target.elements

    if (valueMovie.length < 2) {
      return
    }

    fetch('')
}
// CRIAR HANDLESUBMIT PARA PEGAR VALOR DO FORM E INSERIR MOVIES A LISTA DE FAVORITOS

const handleSubmit = e => setWatchedMovie(prev =>{
  e.preventDefault()
  const {ratting} = e.target.elements
  setWatchedMovie( [...prev, {...clickedMovie, userRatting : ratting.value}])
  setClickedMovie(null)
}

  
)



useEffect(() =>{  
      fetch(`https://raw.githubusercontent.com/ivanmartins090317/seed-movies/main/list`)
    .then(response => response.json())
    .then(data => setMovies(data.map(movie =>({
      id : movie.imdbID,
      title : movie.Title,
      year : movie.Year,
      release : movie.Release,
      runTime : movie.Runtime,
      gender: movie.Genre,
      writerTo : movie.Writer,
      actors : movie.Actors,
      plot: movie.Plot,
      poster : movie.Poster,
      ratings : movie.imdbRating
    }))))    
},[])

  return (
    <main>
      <div className="w-5/6 m-auto text-center mt-5 border p-4 bg-gray-500 rounded-md">
      <form onSubmit={handleSubmitMovie}>         
          <input 
          name="searchMovie"
          type="text" 
          placeholder="Buscar..." 
          className="border rounded-md px-5 py-1 text-sm outline-none "
        />
      </form>
      </div>
   
      <div>
        <div className="mt-8 flex w-full ">

        <div className="w-4/12 m-40 mt-4 ">

      {
          movies.map(movie =>
            <div key={movie.id} className="text-center  " > 
              <ul 
                onClick={() => clickedOnMovie(movie)}
                className="flex items-center gap-2 object-cover mb-4">
                <li>
                  <img className="w-16 " src={movie.poster} alt={movie.title} />
                </li>
                <span className="inline-flex items-center text-bold rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{movie.title}</span>
                <li className="underline">{movie.year}</li>
              </ul>
            </div>
          )
        }
        </div>
       
    
        {
          clickedMovie ?(
               <div className="mt-5">
                <img className="w-16" src={clickedMovie.poster} alt={clickedMovie.title} />
                <div className="">
                  <h3 className="font-bold mb-">{clickedMovie.title}</h3>
                  <span>{clickedMovie.year}-</span>
                  <span>{clickedMovie.runTime}</span>
                  <p>{clickedMovie.actors}</p>
                  <span></span>
                </div>
                <div>
                  <p className="text-sm w-1/3 mt-4">{clickedMovie.plot}</p>
                </div>

                {/* nota do filme e inserir filme como favorito */}
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <select name="ratting" default={1}>
                     { Array.from({length: 10}, (_, id) =>
                      <option key={id} value={id + 1}>{id + 1}</option>
                    )}
                    </select>
                    <button 
                      className="border bg-lime-200 rounded-md p-2 px-4 mt-2 ml-2"
                    >+ adicionar filme</button>
                  </form>
                 
                </div>
               </div>
          ) 
          : (

            <div className="w-4/5">
            {/* HISTORICO DE FILMES  */}
            <div className="border w-3/5 mb-5 bg-slate-300 h-20 p-4 rounded-md" >
              <h3 className="font-bold">Histórico</h3>
              <div>
                <span>{watchedMovie?.length} {watchedMovie?.length <= 1 ? "Filme" : "Filmes"}</span>
                <span>🕧 {getTotalTime(watchedMovie)} minutes</span>
              </div>
            </div>
            {/* LISTA DE FAVORITOS */}
            <div className="flex flex-col ">
              {
              watchedMovie && (

                watchedMovie.map(m =>(
                  <div key={m.id}>
                  <div className="flex gap-4 items-center" >
                        <div className="w-16 mb-4" key={m.id}>
                          <img src={m.poster} alt="" />
                      </div>
                    <div >
                        <div>
                          <h3 className="font-bold">{m.title}</h3>
                        </div>
                        <div>

                        <span>Ano {m.year}/</span>
                        <span>Tipo {m.gender}/</span>
                        <span>Dur. {m.runTime}</span>
                        </div>
                        <div >
                          <span className={`${m.ratings <= 4 ? "bg-red-400 p-1 rounded-md" :" bg-lime-400 p-1 rounded-md"} mr-3`}>Nota {m.ratings}</span>
                          <span>Minha nota {m.userRatting}</span>
                        </div>
                      </div>
                       <button 
                   onClick={() => handleDeleteMovie(m.id)}
                 
                   className="border p-1 px-2 rounded-full bg-orange-300"
                  >x
                  </button>
                      
                  </div>
              
            
                  </div>
                )
                  
                )
              )
              }
              </div>
            </div>
          )
        }
    
 
        </div>

      </div>
    
        
    </main>
  )
}

export { App } 