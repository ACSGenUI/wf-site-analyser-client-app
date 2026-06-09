import React from 'react';

export function SignInPage(): React.ReactElement {
  return (
    <div
      data-testid="sign-in-page"
      className="flex h-screen items-center justify-center bg-neutral-950 text-white"
    >
      <h1 className="text-2xl font-semibold">Sign In</h1>
    </div>
  );
}

export default SignInPage;
