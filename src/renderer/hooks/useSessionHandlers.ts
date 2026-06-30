import { useSessionStore } from '../store/sessionStore';

export function useSessionHandlers() {
  const { mode, userId, profile, syncStatus } = useSessionStore();
  const userIdSnippet = userId ? userId.slice(0, 8) : null;

  function handleSignOut(): void {
    window.api['auth:signOut']()
      .then(() => {
        useSessionStore.setState({ mode: 'guest', userId: null, createdAt: null, profile: null });
      })
      .catch(() => {});
  }

  function handleSwitchAccount(): void {
    window.api['auth:switchAccount']().catch(() => {});
  }

  return { mode, userId, userIdSnippet, profile, syncStatus, handleSignOut, handleSwitchAccount };
}
