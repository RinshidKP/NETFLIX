import React, { useEffect ,useState} from 'react'
import axios from '../../Axios'

import Youtube from 'react-youtube'
import { API_KEY, imageUrl } from '../../Constants/Constants'
import "./RowPost.css"
import toast, {Toaster} from 'react-hot-toast'
function RowPost(props) {
const[pop,setPop] = useState(false);
const [urlId,setUrlId] = useState('')
const [movies,setMovies] = useState([])
const [prevToastId, setPrevToastId] = useState(null);
useEffect(() => {
axios.get(props.url)
.then((response)=>{
setMovies(response.data.results)
})
.catch((error)=>{
alert('Network Error')
})
},[])

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

const handleMovie = (id) => {

axios.get(`/movie/${id}/videos?api_key=${API_KEY}`).then((response)=>{
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
const closeVideo=()=>{
setPop(false)
}

return (
<div className='row'>
  <h2>{props.title}</h2>
  <div className="posters">
    { movies.map(( obj)=>
    <img key={obj.id} onClick={()=> handleMovie(obj.id)} className={props.isSmall ? 'smallPoster' :'poster'} src={`${imageUrl+obj.backdrop_path}`} alt="poster" />
    ) }
  </div>

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

export default RowPost