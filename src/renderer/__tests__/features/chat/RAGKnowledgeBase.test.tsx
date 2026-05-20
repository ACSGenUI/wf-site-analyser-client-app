/**
 * SA-805: RAG Knowledge Base Generation
 *
 * Tests the knowledge base build process: triggering build via IPC, progress
 * indicator, "RAG ACTIVE" status update on completion, and error handling.
 *
 * Test File: src/renderer/__tests__/features/chat/RAGKnowledgeBase.test.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { RAGStatusBadge } from '@/features/chat/RAGStatusBadge';
import { useRAGStore } from '@/store/ragStore';

describe('SA-805 – RAG Knowledge Base Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useRAGStore.setState({ status: 'idle', progress: 0 });
  });

  // TC-01: Build triggered via IPC after analysis completes
  it('TC-01: IPC rag:buildKnowledgeBase is called when analysis finishes', async () => {
    const store = useRAGStore.getState();
    await store.buildKnowledgeBase('analysis-123');
    expect(window.api['rag:buildKnowledgeBase']).toHaveBeenCalledWith('analysis-123');
  });

  // TC-02: Building status shown
  it('TC-02: "Building knowledge base" status is shown while RAG is being built', async () => {
    vi.mocked(window.api['rag:buildKnowledgeBase']).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ready: true }), 1000)),
    );
    useRAGStore.setState({ status: 'building', progress: 40 });
    render(<RAGStatusBadge analysisId="analysis-123" />);
    expect(screen.getByText(/building|preparing/i)).toBeInTheDocument();
  });

  // TC-03: RAG ACTIVE shown on success
  it('TC-03: "RAG ACTIVE" badge appears once knowledge base is ready', async () => {
    vi.mocked(window.api['rag:buildKnowledgeBase']).mockResolvedValue({ ready: true });
    useRAGStore.setState({ status: 'ready', progress: 100 });
    render(<RAGStatusBadge analysisId="analysis-123" />);
    await waitFor(() => {
      expect(screen.getByText(/rag active/i)).toBeInTheDocument();
    });
  });

  // TC-04: Error state shows retry
  it('TC-04: build failure shows error message with a retry button', () => {
    useRAGStore.setState({ status: 'error', progress: 0 });
    render(<RAGStatusBadge analysisId="analysis-123" />);
    expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  // TC-05: Idle state shows "Not ready"
  it('TC-05: idle state badge shows "not ready" or a neutral indicator', () => {
    useRAGStore.setState({ status: 'idle', progress: 0 });
    render(<RAGStatusBadge analysisId="analysis-123" />);
    expect(screen.getByText(/not ready|inactive|idle/i)).toBeInTheDocument();
  });
});
