import React , {useState} from 'react'
import {useGlopalContext} from '../../Context'
import { FaRegWindowRestore , FaTimes  ,FaLinkedin , FaRegEnvelope , FaPhoneAlt , FaFacebook , FaGithub} from "react-icons/fa";
import contactImage from '../../Images/MyPersonalImage.webp'
import './style.css'
const Contactme = () => {
 const {isContactActive ,setIsContactActive ,taskparicons , setTaskparicons} = useGlopalContext()
//  get contact values 
 const [name , setName] = useState('')
 const [email , setEmail] = useState('')
 const [message , setMessage] = useState('')

//  close window function
 const closeContactlWindow = ()=>{
  const close = taskparicons.filter((filtericon)=> filtericon.id !== 3) 
  setTaskparicons(close)
  setIsContactActive(false)
 }
// handle submit 
 const handleSubmit = (e)=>{
   e.preventDefault()
   setName('')
   setEmail('')
   setMessage('')
   alert('Thanks For your Message')
 }

 return (
  <div className={`${isContactActive ? 'window-container skills-window active':'window-container'}`}>
    {/* start window header  */}
   <div className="header"> 
   <div className="headerbuttons">
    <button className=' heder-icon'  onClick={()=>setIsContactActive(false)}><FaRegWindowRestore/></button>
   <button className=' heder-icon'onClick={()=>closeContactlWindow()}><FaTimes/></button>
   </div>
   </div>
   {/* End window header  */}

   {/* start portfolio header  */}
   <div className="portfolio-header">
     <h2>Contact Me</h2>
     <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fillOpacity="1" d="M0,32L60,48C120,64,240,96,360,106.7C480,117,600,107,720,90.7C840,75,960,53,1080,53.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
    </div>
    {/* end portfolio header  */}
    {/* start contact   */}
    <div className="contact-me-container">
      <div className="contact-image-container">
          <img src={contactImage} alt="Mostafa Tarek" />
      </div>
      <div className="contact-data-container">
        <div className="emailphone">
           <p className='single-detail-item'><FaRegEnvelope className='detailsIcon '/> mostafatarekaioup@gmail.com</p>
           <p className='single-detail-item'> <FaPhoneAlt className='detailsIcon'/> +201094855028</p> 
        </div>
        <div className="more-info">
          <h3 className='contact-line'>Social Media</h3>
          <div className="infoline"></div>
        </div>
        <div className="contact-social-links">
          <ul>
            <li><a href="https://www.facebook.com/mostafatarekaioup/" target='facebook'><FaFacebook/></a></li>
            <li><a href="https://github.com/MostafaTarekAioup" target='github'><FaGithub/></a></li>
            <li><a href="https://www.linkedin.com/in/mostafa-tarek-050936193/" target='linkedin'><FaLinkedin/></a></li> 
          </ul>
        </div>

        <div className="more-info">
          <h3 className='contact-line'>Send Me a Message</h3>
          <div className="infoline"></div>
        </div>
      <div className="contact-form-container">
        <form action="Post" onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="Client Name" id="client" value={name} onChange={(e)=> setName(e.target.value)} aria-details='Client Name' placeholder='Name' required/>
            <input type="email" name="Client Name" id="Email" value={email} onChange={(e)=> setEmail(e.target.value)} aria-details='Client Email' placeholder='Email' required/>
          </div>
           <div className="text-area">
            <textarea value={message}  onChange={(e)=> setMessage(e.target.value)} id="message" name="message" rows="6" cols="50" required>

            </textarea>
            
          </div>
          <div className="submit-button">
            {/* <input  type="submit" value='Send Message' /> */}
            <button className='submit' type='submit'>Send Message</button>
          </div>
        </form>
      </div>
      </div>
    </div>
    {/* end contact   */}
    <br />
    <br />
    <br /><br />
  </div>
 )
}

export default Contactme
