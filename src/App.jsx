import { useState, useEffect } from "react" 


const NavBar = ({movies, setMovies, setClickedMovie}) =>{
  const API_KEY = import.meta.env.VITE_API_KEY

  const handleSubmitMovie = e => {
    e.preventDefault()
    const {searchMovie} = e.target.elements

    if (searchMovie.value.length < 2) {
      return
    }

    fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}&s=${searchMovie.value}`)
      .then(response => response.json())
      .then(data => setMovies(data.Search.map(datas => ({
        id: datas.imdbID,
        title: datas.Title ,
        year: datas.Year,
        poster: datas.Poster,
      }))))

      setClickedMovie(null)
  }
  

  return(
    <div className="w-5/6 m-auto text-center mt-5 border p-4 bg-gray-500 rounded-md flex justify-center">
    <form onSubmit={handleSubmitMovie}>         
        <input 
        name="searchMovie"
        type="text" 
        placeholder="Buscar..." 
        className="border rounded-md px-5 py-1 text-sm outline-none mr-8"
      />
    </form>
    <p className="text-zinc-50">{movies.length} filmes encontrados</p>
    </div>
  )
}

const App = () => {
const [movies, setMovies] = useState([])
const [watchedMovie, setWatchedMovie] = useState([])
const [clickedMovie, setClickedMovie] = useState(null)


const API_KEY = import.meta.env.VITE_API_KEY

const getTotalTime = watchedMovie => 
  watchedMovie?.reduce((acc, item) => acc + +item.runTime.split(' ')[0], 0)

const handleDeleteMovie = movieID => setWatchedMovie(prev => prev.filter(p => p.id !== movieID) )

const clickedOnMovie = (movieID) =>{
  
    if(clickedMovie?.id === movieID.id){
      setClickedMovie(null)
      return
    }

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieID.id}`)
     .then(response => response.json())
    .then(data => setClickedMovie({
      id : data.imdbID,
      title : data.Title,
      year : data.Year,
      release : data.Release,
      runTime : data.Runtime,
      gender: data.Genre,
      writerTo : data.Writer,
      actors : data.Actors,
      plot: data.Plot,
      poster : data.Poster,
      ratings : data.imdbRating
    }) )
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
      fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}&s=minions`)
    .then(response => response.json())
    .then(data => setMovies(data.Search.map(movie =>({
      id:movie.imdbID,
      title:movie.Title ,
      year:movie.Year,
      poster:movie.Poster,
    }))))    
},[])

  return (
    <main>
      <NavBar movies={movies} setMovies={setMovies} setClickedMovie={setWatchedMovie}/>
      {/* <div className="w-5/6 m-auto text-center mt-5 border p-4 bg-gray-500 rounded-md flex justify-center">
      <form onSubmit={handleSubmitMovie}>         
          <input 
          name="searchMovie"
          type="text" 
          placeholder="Buscar..." 
          className="border rounded-md px-5 py-1 text-sm outline-none mr-8"
        />
      </form>
      <p className="text-zinc-50">{movies.length} filmes encontrados</p>
      </div> */}
   
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
                  <div className="w-3/5 flex gap-4 items-center border-2" >
                        <div className="w-22 mb-4" key={m.id}>
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
                        <div className="mt-4">
                          <span className={`${m.ratings <= 4 ? "bg-red-400 p-1 rounded-md" :" bg-lime-400 p-1 rounded-md"} mr-3`}>Nota {m.ratings}</span>
                          <span>Minha nota {m.userRatting}</span>
                        </div>
                      <div>
                       <button 
                          onClick={() => handleDeleteMovie(m.id)}
                        
                          className="border p-1 px-5 rounded-md bg-red-50 mt-4 border-hidden outline-none"
                          >deletar
                          </button>
                      </div>
                      </div>
                      
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