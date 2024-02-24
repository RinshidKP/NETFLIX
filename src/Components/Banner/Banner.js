import React,{useEffect, useState} from 'react'
import { API_KEY,imageUrl } from '../../Constants/Constants'
import "./Banner.css"
import axios from '../../Axios'
import toast, {Toaster} from 'react-hot-toast'
import Youtube from 'react-youtube'

const Banner = () => {
const [prevToastId, setPrevToastId] = useState(null);
const [movie, setMovie] = useState()
const[pop,setPop] = useState(false);
const [urlId,setUrlId] = useState('')
useEffect(() => {
const randomIndex = Math.floor(Math.random() * 20);
axios.get(`trending/all/week?api_key=${API_KEY}&language=en-US`)
.then(
(response)=>{
console.log(response.data.results[randomIndex])
setMovie(response.data.results[randomIndex])
})
}, [])
const handleTrailer = () =>{
console.log(movie);
axios.get(`/movie/${movie.id}/videos?api_key=${API_KEY}`).then((response)=>{
if(response.data.results.length!==0){
setUrlId(response.data.results[0])
setPop(true);
}else{
showToast();
}
})
.catch((err)=>{
showToast();
})
}
const showToast = () =>{
if(prevToastId){
toast.dismiss(prevToastId);
}
const newToastId = toast.error('No trailer available', {
duration: 3000,
});
setPrevToastId(newToastId);
}
const opts = {
height: '390',
width: '100%',
playerVars: {
// https://developers.google.com/youtube/player_parameters
autoplay: 1,
}
}
const closeVideo=()=>{
setPop(false)
}
return (

<div style={{backgroundImage: `url(${movie ? imageUrl+movie.backdrop_path:""})`}} className='banner'>
  <div className='content'>
    <h1 className='title'> {movie?movie.title:""} </h1>
    <div className='banner_buttons'>
      <button onClick={(handleTrailer)} className='button'>Play</button>
      <button className='button'>My list</button>
    </div>
    <h1 className='description'>{movie ? movie.overview : ""}</h1>
  </div>
  <div className="fade_bottom"></div>
  { pop &&

  <div className="video-popup">
    <button className="close-button" onClick={closeVideo}>
      X
    </button>
    <div className="video-content">

      { urlId &&
      <Youtube opts={opts} videoId={urlId.key} /> }
      <h2 className='video-title'>{urlId.name}</h2>

    </div>
  </div>}
  <Toaster />
</div>
)
}

export default Banner