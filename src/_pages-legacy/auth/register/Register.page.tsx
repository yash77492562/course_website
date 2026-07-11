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
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(5, 13, 31, 0.85)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(14, 165, 233, 0.12)',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 5vw'
        }}
      >
        <Link 
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          <span 
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '17px',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '0.3px'
            }}
          >
            Riva Data
          </span>
        </Link>
      </nav>

      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '88px 20px 20px',
          background: 'linear-gradient(160deg, #050d1f 0%, #0b1a35 60%, #0a2240 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <div 
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '8%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
            pointerEvents: 'none'
          }}
        />

        {/* Main card container — single column on phones, two columns from md up */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            width: '100%',
            maxWidth: '1000px',
            background: 'rgba(17, 34, 64, 0.95)',
            borderRadius: '24px',
            border: '1px solid rgba(14, 165, 233, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            animation: 'slideUp 0.6s ease-out'
          }}
        >
          {/* Left side - Course promotion (hidden on phones) */}
          <div
            className="hidden md:flex flex-col justify-center"
            style={{
              padding: '60px 50px',
              background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(6,182,212,0.15) 100%)',
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div 
                style={{
                  fontSize: '48px',
                  marginBottom: '24px',
                  animation: 'bounce 2s ease-in-out infinite'
                }}
              >
                🚀
              </div>
              <h2 
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: '16px',
                  lineHeight: '1.2',
                  letterSpacing: '-0.5px'
                }}
              >
                Begin Your Career Transformation
              </h2>
              <p 
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6',
                  marginBottom: '32px'
                }}
              >
                Join thousands of learners advancing their careers with industry-leading courses and expert mentorship.
              </p>

              {/* Feature list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: '✓', text: 'Expert-led courses' },
                  { icon: '✓', text: 'Hands-on projects' },
                  { icon: '✓', text: 'Career support' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      animation: `fadeInLeft 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div 
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#ffffff'
                      }}
                    >
                      {item.icon}
                    </div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px' }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Register form */}
          <div 
            style={{
              padding: '60px 50px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ marginBottom: '32px' }}>
              <h1 
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: '8px',
                  letterSpacing: '-0.5px'
                }}
              >
                Create Your Account
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '15px' }}>
                Already have an account?{' '}
                <Link 
                  href="/login"
                  style={{
                    color: '#0ea5e9',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#06b6d4'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0ea5e9'}
                >
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div 
                style={{
                  marginBottom: '20px',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  animation: 'shake 0.5s ease-in-out'
                }}
              >
                <p style={{ fontSize: '14px', color: '#ef4444', margin: 0 }}>{error}</p>
              </div>
            )}

            <RegisterForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        </div>

        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }

          @media (max-width: 768px) {
            div[style*="gridTemplateColumns"] {
              grid-template-columns: 1fr !important;
            }
            div[style*="padding: 60px 50px"] {
              padding: 40px 30px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
