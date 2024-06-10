// Library Imports
import { Carousel } from "@mantine/carousel";
import { Loader, Paper, Spoiler, Tooltip } from "@mantine/core";
import React from "react";
import { IconStar } from "@tabler/icons-react";
// API Imports
import { Tool } from "../../api/db/dbTool.ts";
// Component Imports
import { CurrentUserContext } from "../../App.jsx";
// Style Imports
import "../../assets/style/tools.css";
import DashboardSectionHeader from "./DashboardSectionHeader.jsx";

/** Render a list of tools in a Carousel */
export const ToolsList = () => {

  /** Get currentUser from react context */
  const {currentUser} = React.useContext(CurrentUserContext);

  /** Every tool that belongs to this user */
  const tools = Object.values(currentUser.tools);
  
  const ToolDisplay = () => tools.sort((a, b) => a.title.localeCompare(b.title)).map((tool, index) => <ToolCard currentUser={currentUser} key={index} tool={tool} />)

  return [
    <div className="container-fluid" key="tools-display">
      <div className="row">
        <DashboardSectionHeader key='tools-header'>My Tools</DashboardSectionHeader>
        <Spoiler maxHeight={180} showLabel="See All Tools" hideLabel="Collapse">
          <div className="container-fluid">
            <div className="row">
              <ToolDisplay />
            </div>
          </div>
        </Spoiler>
      </div>
    </div>
  ]
}

/** Render a single tool in a Carousel */
const ToolCard = ({tool, currentUser}) => {

  /** Get the label for the favorite button */
  function getLabel() { return (tool.starred ? "Unfavorite" : "Favorite") + ` "${tool.title}"` }

  /** Whether we are loading the "favorite" action */
  const [loading, setLoading] = React.useState(false);

  /** Style for the paper component dependant on whether it's "favorited" or not */
  const paperStyle = { marginRight: "1rem", border: tool.starred ? "1px solid gold" : null }

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
    <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-2">
      <Paper withBorder className={"p-2 h-100"} style={paperStyle}>
        <div className="d-flex justify-content-between">
          <strong>{tool.title}</strong>
          <Star />
          { loading && <Loader size={"1.25rem"}/> }
        </div>
        <p>{tool.description}</p>
      </Paper>
    </div>
  )
}