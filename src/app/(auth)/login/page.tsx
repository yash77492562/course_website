import { Suspense } from 'react';
import LoginPage from '@/_pages-legacy/auth/login/Login.page';

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <LoginPage />
    </Suspense>
  );
}
