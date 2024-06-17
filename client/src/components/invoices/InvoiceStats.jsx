
import { Progress, Box, Text, Group, Paper, SimpleGrid, rem, NumberFormatter } from '@mantine/core';
import { IconCoin, IconCreditCardPay, IconDeviceAnalytics, IconPercentage, IconReceipt, IconReceipt2 } from '@tabler/icons-react';
import { lateColor, pendingColor, unpaidColor } from '../../tabs/Invoices';


export function InvoiceStats({invoices}) {

  const paidUp = getBalance() === 0 && getPendingBalance() === 0;

  const data = [
    { label: paidUp ? 'All paid up!' : "", count: paidUp ? `100%` : "", part: paidUp ? 100 : 0, color: '#74b496' },
    { label: 'Late Unpaid', count: `${getLateBalance()}`, part: getLateBalance() * 100 / getUnpaidBalance(), color: lateColor },
    { label: 'Unpaid', count: `${getBalance() - getLateBalance()}`, part: (getBalance() - getLateBalance()) * 100 / getUnpaidBalance(), color: unpaidColor },
    { label: 'Pending', count: `${getPendingBalance()}`, part: getPendingBalance() * 100 / getUnpaidBalance(), color: pendingColor },
  ];

  const segments = data.map((segment) => (
    <Progress.Section value={segment.part} color={segment.color} key={segment.color}>
      {segment.part > 0 && <Progress.Label><NumberFormatter prefix='$' value={segment.count} /></Progress.Label>}
    </Progress.Section>
  ));

  const descriptions = data.map((stat) => {
    if (stat.part === 0) { return null; }
    return (
      <Box key={stat.label} style={{ borderBottomColor: stat.color }} className="invoice-stat-stat">
        <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
          {stat.label}
        </Text>
  
        <Group className="gap-2" align="flex-end" gap={0}>
          <Text c={stat.color} fw={700}><NumberFormatter prefix='$' value={stat.count} /></Text>
        </Group>
      </Box>
    )
  });

  /** Get the total balance of all unpaid invoices minus those that are pending */
  function getBalance() { return invoices.filter(i => !i.paid && !i.paidAt).reduce((acc, i) => acc + parseInt(i.amount), 0); }
  /** Get the total balance of all unpaid invoices that are late minus those that are pending */
  function getLateBalance() { return invoices.filter(i => !i.paid && !i.paidAt && new Date(i.dueAt) < Date.now()).reduce((acc, i) => acc + parseInt(i.amount), 0); }
  /** Get the total balance of all unpaid invoices */  
  function getUnpaidBalance() { return invoices.filter(i => !i.paid).reduce((acc, i) => acc + parseInt(i.amount), 0); }
  /** Get the total balance of all pending invoices */
  function getPendingBalance() { return invoices.filter(i => !i.paid && i.paidAt).reduce((acc, i) => acc + parseInt(i.amount), 0); }
  

  function hasUnpaidInvoices() {
    return invoices.filter(i =>!i.paid &&!i.paidAt).length > 0;
  }

  function hasPendingInvoices() {
    return invoices.filter(i => i.limbo !== null).length > 0;
  }

  function getUnpaidMessage() {
    if (!hasUnpaidInvoices()) { return; }
    return <span>You can pay by clicking the <IconCreditCardPay /> button next to an invoice.</span>
  }

  function getPendingMessage() {
    if (hasPendingInvoices()) { return; }
    return "Pending invoices do not count towards your balance."
  }

  function getLateMessage() {
    if (hasPendingInvoices()) { return; }
    return <span>You have some <strong style={{color: "#fa5252"}}>late</strong> payments.</span>
  }

  return (
    <Paper withBorder className="p-3" style={{maxWidth: 500}}>
      <Group justify="space-between">
        <Group align="flex-end" gap="xs">
          <Text fz="xl" fw={700}>
            <NumberFormatter value={getBalance()} prefix='$' />
          </Text>
        </Group>
        <IconReceipt2 size="1.4rem" className="invoice-stat-icon" stroke={1.5} />
      </Group>

      <Text c="dimmed">
        Is your current balance. { getUnpaidMessage() } { getPendingMessage() } { getLateMessage()  }
      </Text>

      <Progress.Root size={34} classNames="invoice-stat-progress-label" mt={40}>
        {segments}
      </Progress.Root>
      <SimpleGrid cols={{ base: 1, xs: 3 }} mt="xl">
        {descriptions}
      </SimpleGrid>
    </Paper>
  );
}