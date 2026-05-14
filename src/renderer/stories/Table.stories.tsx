import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

const blockColumns = [
  { key: 'id', header: 'ID', width: '120px' },
  { key: 'blockType', header: 'Block Type' },
  { key: 'attributes', header: 'Attributes' },
  { key: 'action', header: 'Action', width: '80px' },
];

const blockRows = [
  {
    id: '#BLOCK_01',
    blockType: <Badge variant="info">Hero Section</Badge>,
    attributes: 'H1, Button, Background Video',
    action: <Button variant="ghost">View</Button>,
  },
  {
    id: '#BLOCK_02',
    blockType: <Badge variant="success">Feature Grid</Badge>,
    attributes: 'Cards (3), Icons, Text Links',
    action: <Button variant="ghost">View</Button>,
  },
  {
    id: '#BLOCK_03',
    blockType: <Badge variant="warning">Pricing Table</Badge>,
    attributes: 'Tiers (3), CTAs, Features',
    action: <Button variant="ghost">View</Button>,
  },
];

const meta: Meta<typeof Table> = {
  title: 'Design System/Table',
  component: Table,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  args: {
    columns: blockColumns,
    rows: blockRows,
  },
};

export const Empty: Story = {
  args: {
    columns: blockColumns,
    rows: [],
    emptyMessage: 'No blocks detected. Run an analysis to get started.',
  },
};

export const SimpleData: Story = {
  args: {
    columns: [
      { key: 'path', header: 'Page Path' },
      { key: 'type', header: 'Type', width: '100px' },
      { key: 'status', header: 'Status', width: '120px' },
    ],
    rows: [
      { path: '/pricing-tiers/enterprise-solutions', type: 'Page', status: <Badge variant="success">Scanned</Badge> },
      { path: '/assets/v3/core-bundle.min.js', type: 'Resource', status: <Badge variant="warning">Processing</Badge> },
      { path: '/blog/top-10-performance-metrics', type: 'Page', status: <Badge variant="success">Scanned</Badge> },
    ],
  },
};
