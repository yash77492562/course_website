'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';
import { LoginForm } from '@/components/features/LoginForm/LoginForm';
import type { LoginRequest } from '@/types/auth/auth.types';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (credentials: LoginRequest) => {
    setError('');
    setIsSubmitting(true);

    try {
      await login(credentials);
      
      const redirect = searchParams?.get('redirect') || '/';
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Simple navbar with logo only */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/90 backdrop-blur-[18px] border-b border-border h-[68px] flex items-center px-[5vw]">
        <Link href="/" className="flex flex-col items-center justify-center no-underline gap-0">
          <span className="font-bold text-slate-900 text-[18px] tracking-[0.3px] font-display leading-[1.1]">
            Riva Data
          </span>
          <span className="font-sans font-semibold text-primary text-[10px] tracking-[0.25em] uppercase leading-none pl-[1px]">
            Academy
          </span>
        </Link>
      </nav>

      <div className="min-h-screen flex items-center justify-center pt-[88px] px-5 pb-5 relative overflow-hidden bg-background">
        {/* Animated background elements */}
        <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(14,165,233,0.15)_0%,transparent_70%)] animate-float" />
        <div className="absolute bottom-[15%] right-[8%] w-[250px] h-[250px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_70%)] animate-floatReverse" />

        {/* Main card container — single column on phones, two columns from md up */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-[1000px] bg-background rounded-[24px] border border-border backdrop-blur-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-slideUp">
          
          {/* Left side - Course promotion (hidden on phones to keep the form front-and-center) */}
          <div className="hidden md:flex flex-col justify-center p-[40px_30px] md:p-[60px_50px] relative bg-muted">
            <div className="relative z-10">
              <div className="text-[48px] mb-6 animate-bounceCustom">
                📚
              </div>
              <h2 className="font-display text-[32px] font-bold text-foreground mb-4 leading-[1.2] tracking-[-0.5px]">
                Start Your Learning Journey
              </h2>
              <p className="text-[16px] text-foreground/70 leading-[1.6] mb-8">
                Access world-class courses in data analytics, programming, and more. Build skills that matter.
              </p>

              {/* Feature list */}
              <div className="flex flex-col gap-4">
                {[
                  { icon: '✓', text: 'Expert-led courses' },
                  { icon: '✓', text: 'Hands-on projects' },
                  { icon: '✓', text: 'Career support' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 animate-fadeInLeft"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary hover:bg-primary/90 shadow-sm flex items-center justify-center text-[12px] font-bold text-foreground">
                      {item.icon}
                    </div>
                    <span className="text-foreground/85 text-[15px]">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex flex-col justify-center p-[40px_30px] md:p-[60px_50px]">
            <div className="mb-8">
              <h1 className="font-display text-[28px] font-bold text-foreground mb-2 tracking-[-0.5px]">
                Welcome Back
              </h1>
              <p className="text-foreground/60 text-[15px]">
                Don't have an account?{' '}
                <Link 
                  href="/register"
                  className="text-sky-500 no-underline font-semibold transition-colors duration-200 hover:text-cyan-500"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 py-[14px] px-4 rounded-[10px] bg-red-500/10 border border-red-500/30 animate-shake">
                <p className="text-[14px] text-red-500 m-0">{error}</p>
              </div>
            )}

            <LoginForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        </div>

        
      </div>
    </>
  );
}
