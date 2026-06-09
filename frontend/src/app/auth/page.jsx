"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthPage() {
  const [view, setView] = useState('login'); // 'login', 'register', 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login, register, verifyOtp } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setView('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name || 'Developer', email, password);
      setView('login');
      alert('Registration successful! Please login.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop text-on-surface antialiased overflow-hidden relative">
      {/* Ambient Glow Behind Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-inverse-primary rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
      
      <main className="w-full max-w-[440px] relative z-10">
        {/* Auth Card */}
        <div className="bg-surface-container/80 backdrop-blur-2xl rounded-xl border border-white/10 shadow-2xl p-stack-lg relative overflow-hidden">
          
          {/* Card Header */}
          <div className="text-center mb-stack-lg flex flex-col items-center">
            <div className="w-12 h-12 bg-surface-container-highest rounded-xl border border-white/10 flex items-center justify-center mb-stack-sm shadow-sm">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>link</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">ShortLink Pro</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-unit">Developer Analytics Platform</p>
          </div>

          {error && <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm text-center">{error}</div>}

          {view === 'otp' ? (
            <form onSubmit={handleVerifyOtp} className="space-y-stack-md transition-all duration-300 relative">
               <div className="space-y-stack-sm">
                <label className="font-label-sm text-label-sm text-outline-variant block">ENTER OTP</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" style={{fontSize: '20px'}}>lock_clock</span>
                  <input 
                    type="text" 
                    required 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456" 
                    className="input-premium w-full bg-surface-container-lowest border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/50 transition-all duration-200 text-center tracking-[0.5em]" 
                  />
                </div>
              </div>
              <button disabled={loading} type="submit" className="btn-primary w-full mt-stack-md py-3 rounded-xl bg-gradient-to-r from-inverse-primary to-primary-container font-label-md text-label-md text-white border border-white/10 flex items-center justify-center space-x-2 transition-all duration-300">
                <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
                {!loading && <span className="material-symbols-outlined" style={{fontSize: '18px'}}>arrow_forward</span>}
              </button>
            </form>
          ) : (
            <>
              {/* Custom Tabs (Toggle) */}
              <div className="flex p-1 bg-surface-container-highest rounded-xl mb-stack-lg border border-white/5 relative">
                <div 
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface-container-lowest rounded-xl border border-white/10 shadow-sm transition-all duration-300 ease-in-out" 
                  style={{ left: view === 'login' ? '4px' : 'calc(50% + 0px)' }}
                ></div>
                <button 
                  type="button"
                  onClick={() => { setView('login'); setError(''); }}
                  className={`flex-1 relative z-10 py-2 text-center font-label-md text-label-md transition-colors ${view === 'login' ? 'text-on-surface' : 'text-on-surface-variant'}`}
                >
                  Sign In
                </button>
                <button 
                  type="button"
                  onClick={() => { setView('register'); setError(''); }}
                  className={`flex-1 relative z-10 py-2 text-center font-label-md text-label-md transition-colors ${view === 'register' ? 'text-on-surface' : 'text-on-surface-variant'}`}
                >
                  Register
                </button>
              </div>

              {view === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-stack-md transition-all duration-300 relative">
                  <div className="space-y-stack-sm">
                    <label className="font-label-sm text-label-sm text-outline-variant block">EMAIL ADDRESS</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" style={{fontSize: '20px'}}>mail</span>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dev@example.com" className="input-premium w-full bg-surface-container-lowest border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/50 transition-all duration-200" />
                    </div>
                  </div>
                  <div className="space-y-stack-sm">
                    <label className="font-label-sm text-label-sm text-outline-variant block">PASSWORD</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" style={{fontSize: '20px'}}>lock</span>
                      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-premium w-full bg-surface-container-lowest border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/50 transition-all duration-200" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-unit">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <div className="relative w-4 h-4 rounded border border-outline-variant bg-surface-container-lowest flex items-center justify-center group-hover:border-primary transition-colors">
                        <input type="checkbox" className="peer sr-only" />
                        <span className="material-symbols-outlined opacity-0 peer-checked:opacity-100 text-primary transition-opacity" style={{fontSize: '14px', fontVariationSettings: "'FILL' 1"}}>check</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
                    </label>
                    <a href="#" className="font-body-sm text-body-sm text-primary hover:text-primary-fixed transition-colors">Forgot password?</a>
                  </div>
                  <button disabled={loading} type="submit" className="btn-primary w-full mt-stack-md py-3 rounded-xl bg-gradient-to-r from-inverse-primary to-primary-container font-label-md text-label-md text-white border border-white/10 flex items-center justify-center space-x-2 transition-all duration-300">
                    <span>{loading ? 'Sending...' : 'Login'}</span>
                    {!loading && <span className="material-symbols-outlined" style={{fontSize: '18px'}}>arrow_forward</span>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-stack-md transition-all duration-300 relative">
                  <div className="space-y-stack-sm">
                    <label className="font-label-sm text-label-sm text-outline-variant block">NAME</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" style={{fontSize: '20px'}}>person</span>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-premium w-full bg-surface-container-lowest border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/50 transition-all duration-200" />
                    </div>
                  </div>
                  <div className="space-y-stack-sm">
                    <label className="font-label-sm text-label-sm text-outline-variant block">WORK EMAIL</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" style={{fontSize: '20px'}}>mail</span>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dev@company.com" className="input-premium w-full bg-surface-container-lowest border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/50 transition-all duration-200" />
                    </div>
                  </div>
                  <div className="space-y-stack-sm">
                    <label className="font-label-sm text-label-sm text-outline-variant block">CREATE PASSWORD</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" style={{fontSize: '20px'}}>key</span>
                      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" className="input-premium w-full bg-surface-container-lowest border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/50 transition-all duration-200" />
                    </div>
                  </div>
                  <div className="space-y-stack-sm">
                    <label className="font-label-sm text-label-sm text-outline-variant block">CONFIRM PASSWORD</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" style={{fontSize: '20px'}}>password</span>
                      <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="input-premium w-full bg-surface-container-lowest border border-white/10 rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant/50 transition-all duration-200" />
                    </div>
                  </div>
                  <button disabled={loading} type="submit" className="btn-primary w-full mt-stack-lg py-3 rounded-xl bg-gradient-to-r from-inverse-primary to-primary-container font-label-md text-label-md text-white border border-white/10 flex items-center justify-center space-x-2 transition-all duration-300">
                    <span>{loading ? 'Registering...' : 'Create Account'}</span>
                    {!loading && <span className="material-symbols-outlined" style={{fontSize: '18px'}}>bolt</span>}
                  </button>
                </form>
              )}
            </>
          )}

        </div>

        {/* Subtle Footer Links */}
        <div className="mt-stack-md text-center">
          <p className="font-body-sm text-body-sm text-outline-variant">
            Protected by reCAPTCHA and subject to the <br />
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a> and <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
