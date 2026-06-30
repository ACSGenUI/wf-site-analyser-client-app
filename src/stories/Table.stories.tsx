import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';

const meta = {
  title: 'Design System/Table',
  component: Table,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = [
  { key: 'url', header: 'Page URL' },
  { key: 'score', header: 'Score' },
  { key: 'status', header: 'Status' },
  { key: 'components', header: 'Components' },
];

const rows = [
  {
    url: 'https://example.com/home',
    score: '92',
    status: <Badge variant="success">Pass</Badge>,
    components: '34',
  },
  {
    url: 'https://example.com/about',
    score: '74',
    status: <Badge variant="warning">Review</Badge>,
    components: '21',
  },
  {
    url: 'https://example.com/contact',
    score: '41',
    status: <Badge variant="error">Fail</Badge>,
    components: '12',
  },
];

export const Default: Story = {
  args: { columns, rows },
};

export const Empty: Story = {
  args: { columns, rows: [], emptyMessage: 'No pages analysed yet.' },
};

export const SingleColumn: Story = {
  args: {
    columns: [{ key: 'url', header: 'Discovered URL' }],
    rows: [
      { url: 'https://example.com' },
      { url: 'https://example.com/blog' },
      { url: 'https://example.com/docs' },
    ],
  },
};
