import React from 'react'
import {useGlopalContext} from '../../Context'
import Fullscreen from 'react-leaflet-fullscreen-plugin';
import { FaRegWindowRestore , FaTimes} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup , LayersControl  , Circle } from 'react-leaflet'
import './style.css'

const FindMe = () => {
 const {isFindActive ,setIsFindActive ,taskparicons , setTaskparicons} = useGlopalContext()

 const closeFindmelWindow = ()=>{
  const close = taskparicons.filter((filtericon)=> filtericon.id !== 5) 
  setTaskparicons(close)
  setIsFindActive(false)
 }
 const options = {
    position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, default topleft
    title: 'Show me the fullscreen !', // change the title of the button, default Full Screen
    titleCancel: 'Exit fullscreen mode', // change the title of the button when fullscreen is on, default Exit Full Screen
    content: null, // change the content of the button, can be HTML, default null
    forceSeparateButton: true, // force separate button to detach from zoom buttons, default false
    forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
    fullscreenElement: false, // Dom element to render in full screen, false by default, fallback to map._container
  };
  const fillBlueOptions = { fillColor: 'blue' }
  const redOptions = { fillColor: 'red' }
 return (
  <div className={`${isFindActive ? 'window-container skills-window active':'window-container'}`}>
   <div className="header"> 
   <div className="headerbuttons">
    <button className=' heder-icon'  onClick={()=>setIsFindActive(false)}><FaRegWindowRestore/></button>
   <button className=' heder-icon'onClick={()=>closeFindmelWindow()}><FaTimes/></button>
   </div>
   </div>
   <div className="portfolio-header">
     <h2>Find Me</h2>
     <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fillOpacity="1" d="M0,32L60,48C120,64,240,96,360,106.7C480,117,600,107,720,90.7C840,75,960,53,1080,53.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
    </div>
     <div className="map-container">
          <MapContainer center={[30.044420, 31.235712]} zoom={10} scrollWheelZoom={true}>
     <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="Open Street Map">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Satalite Map">
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      </LayersControl.BaseLayer>  
    </LayersControl>
    
   <Circle center={[30.044420, 31.235712]} pathOptions={fillBlueOptions} radius={20000} />
   <Circle center={[30.4748187, 31.4994567]} pathOptions={redOptions} radius={300} />
   <Circle center={[30.5852132,31.4994808]} pathOptions={fillBlueOptions} radius={10000} />
   <Circle center={[30.3062216,31.742574]} pathOptions={fillBlueOptions} radius={10000} />
      <Marker position={[30.044420, 31.235712]}>
      <Popup>
        I Can Work in Cairo <br/><br/>
        <div className="popup-image-container">
          <img className='popubImage' src="https://images.kidzapp.com/media/CACHE/images/venues/b6380a06-56bf-11e9-b41b-960e731c160b/e37b6dbcc6fd5e39139aeeb4f4ca8b44.jpg"  alt="Zagazig" /> 
        </div>
      </Popup>
      </Marker>
     <Marker position={[30.5852132,31.4994808]}>
      <Popup>
        I can work in Zagazig <br/><br/>
        <div className="popup-image-container">
          <img className='popubImage' src="https://i.pinimg.com/originals/95/70/47/957047ca36228305c5c5f3c8127455da.png"  alt="Zagazig" /> 
        </div>
      </Popup>
      </Marker>
      <Marker position={[30.3062216,31.742574]}>
      <Popup>
        I can work in 10'th of Ramadan <br/><br/>
        <div className="popup-image-container">
          <img className='popubImage' src="https://media.gemini.media/img/large/2019/10/16/2019_10_16_9_29_39_560.jpg"  alt="Zagazig" /> 
        </div>
      </Popup>
      </Marker>
      <Marker position={[30.4748187, 31.4994567]}>
      <Popup>
        Here I Live
      </Popup>
      </Marker>

    <Fullscreen
        eventHandlers={{
          // enterFullscreen: (event) => console.log('entered fullscreen', event),
          // exitFullscreen: (event) => console.log('exited fullscreen', event),
        }}
        {...options}
      />
      
    </MapContainer>
     </div>
  </div>
 )
}

export default FindMe
