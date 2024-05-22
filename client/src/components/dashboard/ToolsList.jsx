// Library Imports
import { Carousel } from "@mantine/carousel";
import { Loader, Paper, Tooltip } from "@mantine/core";
import React from "react";
import { IconStar } from "@tabler/icons-react";
// API Imports
import { Tool } from "../../api/db/dbTool.ts";
// Component Imports
import { CurrentUserContext } from "../../App.jsx";
// Style Imports
import "../../assets/style/tools.css";

/** Render a list of tools in a Carousel */
export const ToolsList = () => {

  /** Get currentUser from react context */
  const {currentUser} = React.useContext(CurrentUserContext);

  /** Every tool that belongs to this user */
  const tools = Object.values(currentUser.tools);
  return [
    <h3 style={{marginTop: "2rem"}} key='tools-header'>My Tools</h3>,
    <Carousel
      key="tools-carousel"
      slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
      slideGap={{ base: 0, sm: 'md' }} 
      withIndicators
      loop
      withControls={false}
      dragFree
      className="indicator-container"
    >
      {tools.map((tool, index) => <ToolCard currentUser={currentUser} key={index} tool={tool} />)}
    </Carousel>
  ]
}

/** Render a single tool in a Carousel */
const ToolCard = ({tool, currentUser}) => {

  /** Get the label for the favorite button */
  function getLabel() { return (tool.starred ? "Unfavorite" : "Favorite") + ` "${tool.title}"` }

  /** Whether we are loading the "favorite" action */
  const [loading, setLoading] = React.useState(false);

  /** Style for the paper component dependant on whether it's "favorited" or not */
  const paperStyle = { marginRight: "1rem", filter: tool.starred ? "drop-shadow(0 0 0.5rem gold)" : "none" }

  /** Star icon button that only displays if not loading */
  const Star = () => {
    if (loading) { return; }
    return (
      <Tooltip label={getLabel()} onClick={() => {Tool.star(tool.id, currentUser.id); setLoading(true)}}>
        <IconStar className='favorite-button' fill={tool.starred ? "gold" : "transparent"} stroke={tool.starred ? "gold" : "black"} />
      </Tooltip>
    )
  }

  return (
    <Carousel.Slide style={{marginTop: "1rem", marginBottom: "1rem"}}>
      <Paper withBorder className={"p-2 h-100"} style={paperStyle}>
        <div className="d-flex justify-content-between">
          <strong>{tool.title}</strong>
          <Star />
          { loading && <Loader size={"1.25rem"}/> }
        </div>
        <p>{tool.description}</p>
      </Paper>
    </Carousel.Slide>
  )
}