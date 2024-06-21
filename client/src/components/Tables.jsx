import { ScrollArea, Text } from "@mantine/core";

export const CRMScrollContainer = (props) => (
  <ScrollArea h={props.height ? props.height : 600} onScrollPositionChange={({y}) => props.setScrolled(y !== 0)}>
    {props.children}
  </ScrollArea>
)

export const TableEmptyNotif = ({empty}) => {
  if (!empty) { return; }
  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100">
      <Text>Nothing to see here!</Text>
    </div>
  )
}