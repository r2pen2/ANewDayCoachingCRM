import { Anchor, Breadcrumbs } from "@mantine/core";

export function CRMBreadcrumbs({items}) {
  return <Breadcrumbs>{items.map((item, index) => (
    <Anchor className="mb-2" href={item.href} key={index}>
      {item.title}
    </Anchor>
  ))}</Breadcrumbs>
}