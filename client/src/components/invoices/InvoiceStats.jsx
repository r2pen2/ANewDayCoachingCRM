
import { Progress, Box, Text, Group, Paper, SimpleGrid, rem, NumberFormatter } from '@mantine/core';
import { IconArrowUpRight, IconCreditCardPay, IconDeviceAnalytics } from '@tabler/icons-react';
import IconButton from '../IconButton';

const data = [
  { label: 'Mobile', count: '204,001', part: 59, color: '#47d6ab' },
  { label: 'Desktop', count: '121,017', part: 35, color: '#03141a' },
  { label: 'Tablet', count: '31,118', part: 6, color: '#4fcdf7' },
];

export function InvoiceStats({invoices}) {
  const segments = data.map((segment) => (
    <Progress.Section value={segment.part} color={segment.color} key={segment.color}>
      {segment.part > 10 && <Progress.Label>{segment.part}%</Progress.Label>}
    </Progress.Section>
  ));

  const descriptions = data.map((stat) => (
    <Box key={stat.label} style={{ borderBottomColor: stat.color }} className="invoice-stat-stat">
      <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
        {stat.label}
      </Text>

      <Group justify="space-between" align="flex-end" gap={0}>
        <Text fw={700}>{stat.count}</Text>
        <Text c={stat.color} fw={700} size="sm" className='invoice-stat-stat-count'>
          {stat.part}%
        </Text>
      </Group>
    </Box>
  ));

  /** Get the total balance of all unpaid invoices minus those that are pending */
  function getBalance() { return invoices.filter(i => !i.paid && !i.paidAt).reduce((acc, i) => acc + parseInt(i.amount), 0); }

  function hasUnpaidInvoices() {
    return invoices.filter(i =>!i.paid &&!i.paidAt).length > 0;
  }

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Group align="flex-end" gap="xs">
          <Text fz="xl" fw={700}>
            <NumberFormatter value={getBalance()} prefix='$' />
          </Text>
        </Group>
        <IconDeviceAnalytics size="1.4rem" className="invoice-stat-icon" stroke={1.5} />
      </Group>

      <Text c="dimmed">
        Is your current balance. { hasUnpaidInvoices() && "You can pay by clicking" } {hasUnpaidInvoices() && <IconButton label={"Pay Invoice"} icon={<IconCreditCardPay />} /> }
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