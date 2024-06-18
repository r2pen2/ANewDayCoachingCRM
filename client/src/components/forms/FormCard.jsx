import { Card, Text, Group, Badge, Center, Button, Progress, Loader } from '@mantine/core';
import { IconCode } from '@tabler/icons-react';
import { pendingColor, unpaidColor } from '../../tabs/Invoices';
import { hostname } from '../../api/db/dbManager.ts';

const startedColor = pendingColor
const completedColor = null
const incompleteColor = unpaidColor

export function FormCard({form}) {

  function getBadgeColor() {
    if (!form.completed) {
      if (form.started) {
        return startedColor
      }
      return incompleteColor
    }
    return completedColor;
  }

  function getBadgeText() {
    if (!form.completed) {
      if (form.started) {
        return "Started"
      }
      return "Not Started"
    }
    return "Complete";
  }

  function getProressValue() {
    if (form.completed) {
      return 100
    }
    if (form.started) {
      return 50
    }
    return 0
  }

  const FormIcon = () => {
    switch (form.formId) {
      case "webhookTestForm":
        return <IconCode color="#868e96"/>;
      case "parentGuardianForm":
        return <IconCode color="#868e96"/>;
      default:
        return null;
    }
  }

  function openForm() {
    window.open(form.assignedLink, "_blank")
    fetch(hostname + "/forms/started", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({formId: form.formId, userId: form.assignedTo})})
  }

  return (
    <Card withBorder padding="lg" className="card-bg-1 justify-content-between" radius="md" style={{minHeight: "100%"}}>
      
      <Card.Section className="form-card-section">
        <div className="d-flex align-item-center justify-content-between">      
          <FormIcon />
          <Badge color={getBadgeColor()}>{getBadgeText()}</Badge>
        </div>
        <div>
          <Text fz="lg" fw={500} mt="md">
            {form.formTitle}
          </Text>
          <Text fz="sm" c="dimmed" mt={5}>
            {form.formDescription}
          </Text>
        </div>
      </Card.Section>



      <Card.Section className="form-card-section">
        <Progress value={getProressValue()} className="mb-2" animated={form.started} color={form.started ? startedColor : null} />
        <Group gap={30}>
          <div>
            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
              {form.minuteEstimate}
            </Text>
            <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
              minutes
            </Text>
          </div>

          <Button color={form.started ? startedColor : null} radius="xl" style={{ flex: 1 }} onClick={openForm}>
            {form.started ? "Resume" : "Start Now"}
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}