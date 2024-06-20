import { ScrollArea } from "@mantine/core";

export const CRMScrollContainer = (props) => (
  <ScrollArea h={props.height ? props.height : 600} onScrollPositionChange={({y}) => props.setScrolled(y !== 0)}>
    {props.children}
  </ScrollArea>
)