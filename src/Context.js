import React, { useContext, useState, useEffect } from "react"
import { iconsData } from "../src/Desktop/icons-data"

const url = "https://api.npoint.io/ad5ab4de7dbf6595e1e2"
const AppContext = React.createContext()
const AppProvider = ({ children }) => {
  //  states Declartion

  const [isLoading, setIsLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const [isSidebar, setIsSidebar] = useState(false)
  const [taskparicons, setTaskparicons] = useState([])
  const [isPortfolioActive, setIsPortfolioActive] = useState(false)
  const [isPersonalActive, setIsPersonalActive] = useState(false)
  const [isContactActive, setIsContactActive] = useState(false)
  const [isSkillsActive, setIsSkillsActive] = useState(false)
  const [isFindActive, setIsFindActive] = useState(false)
  const [isSubmenuActive, setIsSubmenuActive] = useState(false)
  const [location, setLocation] = useState({})
  const [submenu, setSubmenu] = useState({ title: "", img: "" })
  const [data, setData] = useState([])
  const [filtredData, setFiltredData] = useState([])
  //// filter states
  let allProjectsTags = []
  let uniqueTages = []
  const [selectedTags, setSelectedTags] = useState([])

  // fetch portfolio data
  const fetchData = async () => {
    const respons = await fetch(url)
    const portfolioData = await respons.json()
    setData(portfolioData)
    setFiltredData(portfolioData)
  }

  useEffect(() => {
    fetchData()
    window.addEventListener("load", function () {
      setIsLoading(false)
    })
  }, [])
  // close all windows
  const setAllToFalse = () => {
    setIsPortfolioActive(false)
    setIsPersonalActive(false)
    setIsContactActive(false)
    setIsSkillsActive(false)
    setIsFindActive(false)
  }
  // add icon from desktop to taskbar
  const IconShow = (id, title, icon) => {
    const addicon = { id, title, icon }
    setTaskparicons([...taskparicons, addicon])
  }

  // open windows
  const windowOpen = (id) => {
    if (id === 1 && !isPortfolioActive) {
      setIsPortfolioActive(true)
    }
    if (id === 2 && !isPersonalActive) {
      setIsPersonalActive(true)
    }
    if (id === 3 && !isContactActive) {
      setIsContactActive(true)
    }
    if (id === 4 && !isSkillsActive) {
      setIsSkillsActive(true)
    }
    if (id === 5 && !isFindActive) {
      setIsFindActive(true)
    }
  }

  // set window active from taskbar
  const activeFromTaskBar = (id) => {
    if (id === 1) {
      setAllToFalse()
      setIsPortfolioActive(!isPortfolioActive)
    }
    if (id === 2) {
      setAllToFalse()
      setIsPersonalActive(!isPersonalActive)
    }
    if (id === 3) {
      setAllToFalse()
      setIsContactActive(!isContactActive)
    }
    if (id === 4) {
      setAllToFalse()
      setIsSkillsActive(!isSkillsActive)
    }
    if (id === 5) {
      setAllToFalse()
      setIsFindActive(!isFindActive)
    }
  }

  //  close windows from submenu
  const closeFromSubmenu = (id) => {
    if (id === 1) {
      setIsPortfolioActive(false)
      const close2 = taskparicons.filter((filtericon) => filtericon.id !== 1)
      setTaskparicons(close2)
      setIsSubmenuActive(false)
    }
    if (id === 2) {
      setIsPersonalActive(false)
      const close3 = taskparicons.filter((filtericon) => filtericon.id !== 2)
      setTaskparicons(close3)
      setIsSubmenuActive(false)
    }
    if (id === 3) {
      setIsContactActive(false)
      const close4 = taskparicons.filter((filtericon) => filtericon.id !== 3)
      setTaskparicons(close4)
      setIsSubmenuActive(false)
    }
    if (id === 4) {
      setIsSkillsActive(false)
      const close5 = taskparicons.filter((filtericon) => filtericon.id !== 4)
      setTaskparicons(close5)
      setIsSubmenuActive(false)
    }
    if (id === 5) {
      setIsFindActive(false)
      const close6 = taskparicons.filter((filtericon) => filtericon.id !== 5)
      setTaskparicons(close6)
      setIsSubmenuActive(false)
    }
  }

  // get unique taskbar icons

  const result = []
  const map = new Map()
  for (const item of taskparicons) {
    if (!map.has(item.id)) {
      map.set(item.id, true) // set any value to Map
      result.push({
        id: item.id,
        title: item.title,
        icon: item.icon,
      })
    }
  }

  //  submenu data

  const openSubmenu = (text, coord) => {
    setLocation(coord)
    const submenuDetails = iconsData.find((menu) => menu.title === text)
    setSubmenu(submenuDetails)
    setIsSubmenuActive(true)
  }

  // useEffect(()=>{
  //  setTimeout(()=>{
  //    setIsLoading(false)
  //  },3000)
  // },[])
  /// fetch all tags

  data.map((project) => {
    allProjectsTags.push(...project.tags)
    return allProjectsTags
  })

  uniqueTages = [...new Set(allProjectsTags)]

  let filtringData = () => {
    let tempData = data
    tempData = tempData.filter((project) => {
      return selectedTags.every((tag) => project.tags.includes(tag))
    })
    setFiltredData(tempData)
  }
  useEffect(() => {
    filtringData()
  }, [selectedTags])

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isLogin,
        setIsLogin,
        isSidebar,
        setIsSidebar,
        taskparicons,
        setTaskparicons,
        isPortfolioActive,
        setIsPortfolioActive,
        isPersonalActive,
        setIsPersonalActive,
        isContactActive,
        setIsContactActive,
        isSkillsActive,
        setIsSkillsActive,
        isFindActive,
        setIsFindActive,
        result,
        activeFromTaskBar,
        windowOpen,
        IconShow,
        isSubmenuActive,
        setIsSubmenuActive,
        openSubmenu,
        location,
        submenu,
        closeFromSubmenu,
        data,
        filtredData,
        uniqueTages,
        selectedTags,
        setSelectedTags,
        filtringData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useGlopalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
