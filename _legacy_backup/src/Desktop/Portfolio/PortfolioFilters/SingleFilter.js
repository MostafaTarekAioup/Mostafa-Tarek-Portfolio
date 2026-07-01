import React, { useState } from "react"
import { FaCheck } from "react-icons/fa"
import "./filters.style.css"
import { useGlopalContext } from "../../../Context"
const SingleFilter = ({ tag }) => {
  const [isChecked, setIsChecked] = useState(false)
  const { selectedTags, setSelectedTags, filtringData } = useGlopalContext()
  const filterHandller = (tag) => {
    setIsChecked(!isChecked)
    let tempTags = selectedTags
    let foundTag = tempTags.find((item) => item === tag)
    if (foundTag) {
      tempTags = tempTags.filter((currtag) => currtag !== tag)
      setSelectedTags(tempTags)
    }
    if (!foundTag) {
      tempTags.push(tag)
      setSelectedTags(tempTags)
    }
    filtringData()
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
