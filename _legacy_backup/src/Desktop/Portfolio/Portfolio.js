import React from "react"
import { useGlopalContext } from "../../Context"
import { FaRegWindowRestore, FaTimes } from "react-icons/fa"
import Allfilters from "./PortfolioFilters/Allfilters"
import "./style.css"
const Portfolio = () => {
  const {
    setIsPortfolioActive,
    isPortfolioActive,
    taskparicons,
    setTaskparicons,
    filtredData,
  } = useGlopalContext()
  const closePortfoliolWindow = () => {
    const close = taskparicons.filter((filtericon) => filtericon.id !== 1)
    setTaskparicons(close)
    setIsPortfolioActive(false)
  }

  const reverseProjects = [...filtredData].reverse()

  return (
    <div
      className={`${
        isPortfolioActive ? "window-container active" : "window-container"
      }`}
    >
      <div className='header'>
        <div className='headerbuttons'>
          <button
            className=' heder-icon'
            onClick={() => setIsPortfolioActive(false)}
          >
            <FaRegWindowRestore />
          </button>
          <button
            className=' heder-icon'
            onClick={() => closePortfoliolWindow()}
          >
            <FaTimes />
          </button>
        </div>
      </div>
      {/* /////////// Header End ////////////////// */}

      {/* //////////// Portfolio Start ////////////// */}

      <div className='portfolio-container'>
        {/* header  */}
        <div className='portfolio-header'>
          <h2>Portfolio</h2>
          <svg
            className='waves'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 320'
          >
            <path
              fill='#0099ff'
              fillOpacity='1'
              d='M0,32L60,48C120,64,240,96,360,106.7C480,117,600,107,720,90.7C840,75,960,53,1080,53.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'
            ></path>
          </svg>
        </div>
        {/* header End  */}
        {/* filters start  */}
        <Allfilters />
        {/* filters End  */}
        <div className='content'>
          {reverseProjects.map((project) => {
            const { id, title, img, link } = project
            return (
              <div className='project-container' key={id}>
                <a className='project-link' href={link} target={title}>
                  <div className='project'>
                    <img src={img} alt={title} />
                    <footer id='project-id'>
                      <p>{title}</p>
                    </footer>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
        {filtredData.length === 0 && (
          <p className='filter_msg'>No Projects matchs your tags</p>
        )}
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  )
}

export default Portfolio
