import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import Input from '../Common/Input';
import Button from '../Common/Button';

const SignupPage = ({ setPage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Full name is required.';
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setPage('login');
        setErrors({});
      } else {
        setErrors({ general: data.error || 'Signup failed.' });
      }
    } catch (error) {
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthLayout
      title="Create an Account"
      footerText="Already have an account?"
      footerLinkText="Log in"
      onFooterLinkClick={() => setPage('login')}
    >
      {errors.general && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{errors.general}</p>}
      <form onSubmit={handleSignup} className="space-y-4">
        <Input id="name" name="name" type="text" label="Full Name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} error={errors.name} autoComplete="name" />
        <Input id="email" name="email" type="email" label="Email Address" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
        <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} autoComplete="new-password" />
        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;