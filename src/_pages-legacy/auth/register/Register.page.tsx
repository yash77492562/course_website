'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';
import { RegisterForm } from '@/components/features/RegisterForm/RegisterForm';
import type { RegisterRequest } from '@/types/auth/auth.types';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: RegisterRequest) => {
    setError('');
    setIsSubmitting(true);

    try {
      await register(data);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
        <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(14,165,233,0.15)_0%,transparent_70%)] [animation:float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[15%] right-[8%] w-[250px] h-[250px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_70%)] [animation:float_8s_ease-in-out_infinite_reverse]" />

        {/* Main card container — single column on phones, two columns from md up */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-[1000px] bg-background rounded-[24px] border border-border backdrop-blur-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden [animation:slideUp_0.6s_ease-out]">
          
          {/* Left side - Course promotion (hidden on phones) */}
          <div className="hidden md:flex flex-col justify-center p-[40px_30px] md:p-[60px_50px] relative bg-muted">
            <div className="relative z-10">
              <div className="text-[48px] mb-6 [animation:bounce_2s_ease-in-out_infinite]">
                🚀
              </div>
              <h2 className="font-sans text-[32px] font-bold text-foreground mb-4 leading-[1.2] tracking-[-0.5px]">
                Begin Your Career Transformation
              </h2>
              <p className="text-[16px] text-foreground/70 leading-[1.6] mb-8">
                Join thousands of learners advancing their careers with industry-leading courses and expert mentorship.
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
                    className="flex items-center gap-3"
                    style={{ animation: `fadeInLeft 0.6s ease-out ${index * 0.1}s both` }}
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

          {/* Right side - Register form */}
          <div className="flex flex-col justify-center p-[40px_30px] md:p-[60px_50px]">
            <div className="mb-8">
              <h1 className="font-sans text-[28px] font-bold text-foreground mb-2 tracking-[-0.5px]">
                Create Your Account
              </h1>
              <p className="text-foreground/60 text-[15px]">
                Already have an account?{' '}
                <Link 
                  href="/login"
                  className="text-sky-500 no-underline font-semibold transition-colors duration-200 hover:text-cyan-500"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 py-[14px] px-4 rounded-[10px] bg-red-500/10 border border-red-500/30 [animation:shake_0.5s_ease-in-out]">
                <p className="text-[14px] text-red-500 m-0">{error}</p>
              </div>
            )}

            <RegisterForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        </div>

        <style jsx>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
        `}</style>
      </div>
    </>
  );
}
