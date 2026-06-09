import React from 'react';

export function ForceUpdatePage(): React.ReactElement {
  return (
    <div
      data-testid="force-update-page"
      className="flex h-screen flex-col items-center justify-center bg-neutral-950 text-white"
    >
      <h1 className="text-2xl font-semibold">Update Required</h1>
      <p className="mt-2 text-neutral-400">
        A mandatory update is required to continue using this app.
      </p>
    </div>
  );
}

export default ForceUpdatePage;
