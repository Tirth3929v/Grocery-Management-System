import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import Input from '../Common/Input';
import Button from '../Common/Button';

const LoginPage = ({ setPage, setLoggedInUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setLoggedInUser(data.user);
        setPage(data.user.role === 'admin' ? 'admin' : 'home');
        setErrors({});
      } else {
        setErrors({ general: data.error || 'Invalid email or password.' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login to Team-18 Store"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      onFooterLinkClick={() => setPage('signup')}
    >
      {errors.general && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{errors.general}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <Input id="email" name="email" type="email" label="Email Address" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
        <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} autoComplete="current-password" />
        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;