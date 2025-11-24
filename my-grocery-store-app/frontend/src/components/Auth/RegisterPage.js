import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Optional, if using React Router
import Card from '../Common/Card';
import Button from '../Common/Button';
import Input from '../Common/Input';

const RegisterPage = ({ setPage, onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onRegister(name, email, password);
    if (success) {
      setPage('home');
    } else {
      setError('Registration failed. Email may already exist.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            type="text"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error && error.includes('name') ? error : ''}
          />
          <Input
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error && error.includes('email') ? error : ''}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error && error.includes('password') ? error : ''}
          />
          <Button type="submit" className="w-full">
            Register
          </Button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <p className="text-center text-slate-600">
            Already have an account?{' '}
            <button onClick={() => setPage('login')} className="text-green-600 hover:underline">
              Login
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;