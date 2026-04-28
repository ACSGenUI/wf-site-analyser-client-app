import React from 'react';

export function App(): React.ReactElement {
  return (
    <div id="app-root" className="flex h-screen w-screen flex-col bg-neutral-950 text-white">
      <main className="flex flex-1 items-center justify-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          WF Site Analyser
        </h1>
      </main>
    </div>
  );
}

export default App;
