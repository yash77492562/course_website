'use client';

import { useState } from 'react';
import { Input } from '@/ui/Input/Input';
import type { RegisterRequest } from '@/types/auth/auth.types';

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => Promise<void>;
  isLoading?: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterRequest>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<RegisterRequest> = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validate()) return;

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="firstName"
          name="firstName"
          type="text"
          label="First name"
          placeholder="John"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          disabled={isLoading}
          autoComplete="given-name"
          required
        />

        <Input
          id="lastName"
          name="lastName"
          type="text"
          label="Last name"
          placeholder="Doe"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          disabled={isLoading}
          autoComplete="family-name"
          required
        />
      </div>

      <Input
        id="email"
        name="email"
        type="email"
        label="Email address"
        placeholder="john@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isLoading}
        autoComplete="email"
        required
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="At least 8 characters"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        disabled={isLoading}
        autoComplete="new-password"
        required
      />

      <Input
        id="phone"
        name="phone"
        type="tel"
        label="Phone (optional)"
        placeholder="+44 1234 567890"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        disabled={isLoading}
        autoComplete="tel"
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full h-[52px] shadow-sm rounded-lg text-white text-[16px] font-semibold transition-all duration-200 mt-2 ${
          isLoading
            ? 'bg-primary/50 cursor-not-allowed'
            : 'bg-primary cursor-pointer hover:bg-primary/90 hover:-translate-y-0.5 active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account...
          </span>
        ) : (
          'Create account'
        )}
      </button>
    </form>
  );
}
