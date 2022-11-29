import React, { useState } from 'react'
import { useGlopalContext } from '../../Context'
import {
  FaRegWindowRestore,
  FaTimes,
  FaAngleDoubleRight,
  FaAngleDown,
  FaAngleUp,
  FaAward,
  FaGraduationCap,
} from 'react-icons/fa'
import './style.css'
import myImage from '../../Images/MyPersonalImage.webp'
import myCv from '../../Images/Mostafa-Tarek-Front-End-React.pdf'
const Personal = () => {
  const {
    isPersonalActive,
    setIsPersonalActive,
    taskparicons,
    setTaskparicons,
  } = useGlopalContext()
  const [isBioActive, setIsBioActive] = useState(false)

  const closePersonalWindow = () => {
    const close = taskparicons.filter((filtericon) => filtericon.id !== 2)
    setTaskparicons(close)
    setIsPersonalActive(false)
  }
  return (
    <div
      className={`${
        isPersonalActive ? 'window-container active' : 'window-container'
      }`}
    >
      <div className='header'>
        <div className='headerbuttons'>
          <button
            className=' heder-icon'
            onClick={() => setIsPersonalActive(false)}
          >
            <FaRegWindowRestore />
          </button>
          <button className=' heder-icon' onClick={() => closePersonalWindow()}>
            <FaTimes />
          </button>
        </div>
      </div>
      <div className='personal-content'>
        <div className='introduce-container'>
          <div className='information'>
            <h2>Hi There</h2>
            <h3>Iam Mostafa Tarek </h3>
            <div className='jop-wrapper'>
              <div className='jop j1'> a Front-End Developer</div>
              <div className='jop j2'> a React Developer</div>
              <div className='jop j3'> a Web Designer</div>
              <div className='jop j4'> a Freelancer</div>
            </div>
          </div>
        </div>

        {/* /////////////////////// */}

        <div className='apout-me-container'>
          <div className='personal-image-container'>
            <div className='myImage'>
              <img src={myImage} alt='Mostafa Tarek' />
            </div>
          </div>
          <div className='myPersonalInfo'>
            <div className='fullName'>
              <h2>Mostafa tarek mostafa</h2>
              <h3>Front-End React Developer</h3>
              <div className='biography'>
                <h4
                  className='show-bio'
                  onClick={() => setIsBioActive(!isBioActive)}
                >
                  My Bio
                  {!isBioActive ? (
                    <FaAngleDown className='arrow' />
                  ) : (
                    <FaAngleUp className='arrow' />
                  )}
                </h4>
                <p
                  className={`${isBioActive ? 'active-bio' : ' bio-details '}`}
                >
                  front-end-developer (ReactJS), 1 year of experience Working on
                  multinational company using React/Next.JS . optimizing web
                  design for smartphones. balance functional design with
                  esthetic design. use a variety of accent languages to write
                  web pages. and I keep my skills updated and learning Modern
                  technologies to make the website more interactive with users.
                </p>
              </div>
              <div className='more-info'>
                <h3>More apout me</h3>
                <div className='infoline'></div>
              </div>
              <div className='moreDetails'>
                <p>
                  <FaAngleDoubleRight className='detailsIcon' /> Birthday : 11 /
                  11 /1996
                </p>
                <p>
                  <FaAngleDoubleRight className='detailsIcon' /> Age : 26
                </p>
                <p>
                  <FaAngleDoubleRight className='detailsIcon' /> Degree :
                  Computer Science
                </p>
                <p>
                  <FaAngleDoubleRight className='detailsIcon' /> Phone :
                  01094855028
                </p>
                <p>
                  <FaAngleDoubleRight className='detailsIcon' /> Experience : 1
                  Year
                </p>
                <p>
                  <FaAngleDoubleRight className='detailsIcon' /> Graduation year
                  : 8 / 2020
                </p>
                <p>
                  <FaAngleDoubleRight className='detailsIcon' /> Military
                  Service: exempt
                </p>
                <p>
                  <FaAngleDoubleRight className='detailsIcon' /> City : Cairo ,
                  Egypt
                </p>
              </div>
              <div className='more-info'>
                <h3>Courses & Education </h3>
                <div className='infoline'></div>
              </div>
              <div className='time-line-container'>
                <div className=' course first-course'>
                  <div className='first-icon course-icon'>
                    <FaGraduationCap />
                  </div>
                  <h3>Computer Science</h3>
                  <h4>2015-2020</h4>
                  <p>
                    Faculity of Science Zagaig University Computer Science
                    Department
                  </p>
                  <h4>Courses</h4>
                  <div className='moreDetails'>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> database
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> artificial
                      intelligence
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> algorithm
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> computer
                      network
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> operating
                      system
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> c++
                      programming
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> wireless
                      network
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> formal
                      language
                    </p>
                  </div>
                </div>

                <div className=' course first-course'>
                  <div className='  course-icon'>
                    <FaAward />
                  </div>
                  <h3>Udacity Nanodegree</h3>
                  <h4>7-2019 / 9-2019</h4>
                  <p>Front-End Web Developer Nanodegree</p>
                  <p>
                    <a
                      className='certificate'
                      href='https://confirm.udacity.com/R4EJP6MK'
                      target='Udacity'
                    >
                      Certificate
                    </a>
                  </p>
                  <h4>Courses</h4>
                  <div className='moreDetails'>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Html
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Css
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Responsive
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Markdown
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Javascript
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Js Dom
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Js OOP
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Web
                      Accessibility
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Js Design
                      Pattern
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Js Promises
                    </p>
                    <p>
                      <FaAngleDoubleRight className='detailsIcon' /> Service
                      Worker
                    </p>
                  </div>
                </div>

                <div className='cv-download'>
                  <a href={myCv} download='Mostafa Tarek React Developer'>
                    <button className='cv-button'>Download My CV</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  )
}

export default Personal
