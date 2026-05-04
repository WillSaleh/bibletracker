// Login Page

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register, login } from '@/lib/api'

export default function Home() {
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showLoginPassword, setShowLoginPassword] = useState(false)

    async function handleRegister() {
        setLoading(true)
        setError('')
        try {
            await register(name, email, password)
            await login(email, password)
            router.push('/dashboard')
        } catch (err) {
            setError('Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    async function handleLogin() {
        setLoading(true)
        setError('')
        try {
            await login(loginEmail, loginPassword)
            router.push('/dashboard')
        } catch (err) {
            setError('Invalid email or password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // UI code
    return (
    <main className="h-screen bg-[#f5f0eb] overflow-hidden flex items-center justify-center px-6">
      
      <div className="w-full max-w-5xl">
      
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-widest text-[#c1440e] font-semibold mb-2">
            Build Habits · Grow Faith
          </p>
          <h1 className="text-4xl font-serif text-[#1a2e1a] mb-2">
            Track your reading. <span className="text-[#c1440e] italic">Nourish</span> your soul.
          </h1>
          <p className="text-sm text-[#5a6b5a] max-w-md mx-auto">
            Stay consistent with God's Word and watch your faith grow — one day at a time.
          </p>
        </div>

        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 mb-4">

          {/* Register card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
            <h2 className="text-lg font-semibold text-[#1a2e1a] mb-0.5 text-center">Create your account</h2>
            <p className="text-xs text-[#5a6b5a] mb-4 text-center">Start your journey today.</p>

            {/* Name input */}
            <div className="relative mb-2.5">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1a2e1a] placeholder-gray-400"
              />
            </div>

            {/* Email input */}
            <div className="relative mb-2.5">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1a2e1a] placeholder-gray-400"
              />
            </div>

            {/* Password input */}
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1a2e1a] placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{cursor:'pointer'}}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              style={{cursor:'pointer'}}
              className="w-full bg-[#1a2e1a] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#2d4a2d] transition-colors disabled:opacity-50 mt-auto"
            >
              Create account
            </button>
          </div>

          {/* Login card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
            <h2 className="text-lg font-semibold text-[#1a2e1a] mb-0.5 text-center">Welcome back</h2>
            <p className="text-xs text-[#5a6b5a] mb-4 text-center">Log in to your account.</p>

            {/* Email input */}
            <div className="relative mb-2.5">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <input
                type="email"
                placeholder="Email address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1a2e1a] placeholder-gray-400"
              />
            </div>

            {/* Password input */}
            <div className="relative mb-3">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm text-gray-800 outline-none focus:border-[#1a2e1a] placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                style={{cursor:'pointer'}}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showLoginPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex-1" />    
            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-xs text-[#5a6b5a] cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <button className="text-xs text-[#c1440e] hover:underline" style={{cursor:'pointer'}}>
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{cursor:'pointer'}}
              className="w-full border border-[#c1440e] text-[#c1440e] rounded-lg py-2.5 text-sm font-medium hover:bg-[#c1440e] hover:text-white transition-colors disabled:opacity-50 mt-auto"
            >
              Log in
            </button>
          </div>
        </div>

        {/* Scripture banner */}
        <div className="bg-[#ede8e0] rounded-2xl py-5 px-8 text-center mb-4">
          <p className="text-base text-[#1a2e1a] mb-1" style={{ fontFamily: 'var(--font-lora)', fontStyle: 'italic' }}>
            "Your word is a lamp to my feet and a light to my path."
          </p>
          <p className="text-xs font-semibold tracking-widest text-[#c1440e]">PSALM 119:105</p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { 
              title: 'Secure & Private', 
              desc: 'JWT auth, end-to-end',
              icon: (
                <svg className="w-5 h-5 text-[#5a6b5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              )
            },
            { 
              title: 'Track & Reflect', 
              desc: 'Notes, moods, prayer',
              icon: (
                <svg className="w-5 h-5 text-[#5a6b5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              )
            },
            { 
              title: 'Insights', 
              desc: 'Stay motivated',
              icon: (
                <svg className="w-5 h-5 text-[#5a6b5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              )
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-5 text-center shadow-sm">
              <div className="flex justify-center mb-2">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <p className="font-medium text-[#1a2e1a] text-sm mb-0.5">{item.title}</p>
              <p className="text-xs text-[#5a6b5a]">{item.desc}</p>
            </div>
          ))}
        </div>
      
      </div>

        </main>
    )
}


