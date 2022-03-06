import React, { useEffect } from "react"
import "./filters.style.css"
import SingleFilter from "./SingleFilter"
import { useGlopalContext } from "../../../Context"
const Allfilters = () => {
  const { uniqueTages } = useGlopalContext()

  return (
    <section className='filter_container'>
      {uniqueTages.map((tag, index) => {
        return <SingleFilter key={index} tag={tag} />
      })}
    </section>
  )
}

export default Allfilters
