import React, { useState, useEffect } from "react"
import { FaCheck } from "react-icons/fa"
import "./filters.style.css"
import { useGlopalContext } from "../../../Context"
const SingleFilter = ({ tag }) => {
  const [isChecked, setIsChecked] = useState(false)
  const { selectedTags, setSelectedTags, filtringData } = useGlopalContext()
  const filterHandller = (tag) => {
    setIsChecked(!isChecked)
    let tempTags = selectedTags
    if (tempTags.find((item) => item === tag)) {
      tempTags = tempTags.filter((currtag) => currtag !== tag)
      setSelectedTags(tempTags)
    } else {
      tempTags.push(tag)
      setSelectedTags(tempTags)
    }
  }

  return (
    <button onClick={() => filterHandller(tag)} className='filter_btn'>
      <div className='filter_btn_details'>
        <span>{tag}</span>
        {isChecked && (
          <span>
            {" "}
            <FaCheck />
          </span>
        )}
      </div>
    </button>
  )
}

export default SingleFilter
