import React from 'react'
import { Link } from 'gatsby'

const AllTagsIndex = ({ data, pageContext }) => {
  const { tags } = pageContext
  return (
    <div>
      <h1>List of tags!</h1>
      <div>
        <ul>
          {tags.map((tagName, index) => {
            return (
              <li key={index}>
                <Link to={`/tags/${tagName}`}>{tagName}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default AllTagsIndex
