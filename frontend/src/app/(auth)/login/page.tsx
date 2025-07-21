'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaFacebook, FaHeart, FaUser, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './loginPage.css';

export default function LoginPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  console.log("Google client ID:", clientId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
    }
  }, [clientId]);

  const handleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    try {
      const res = await fetch('http://localhost:8000/authen/login/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('access_token', data.access);
        router.push('/home');
      } else {
        console.error('後端驗證失敗', data);
        alert('Google 登入失敗');
      }
    } catch (err) {
      console.error('登入錯誤:', err);
      alert('登入錯誤，請稍後再試');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('登入資訊:', { username, password });
    router.push('/home');
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      window.google?.accounts.id.prompt(); // 觸發 Google 登入彈窗
    } else {
      console.log(`${provider} 登入（尚未實作）`);
    }
  };

  return (
    <div className="login-container">
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            className="intro-animation"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="logo-container">
              <motion.div
                className="heart-icon"
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FaHeart />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Matching Party
              </motion.h1>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="login-form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="logo-small">
              <FaHeart />
              <span>Matching Party</span>
            </div>
            
            <h2>登入你的帳號</h2>
            <p>開始你的配對旅程</p>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="使用者名稱"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="login-button">
                登入
              </button>
            </form>
            
            <div className="divider">
              <span>或</span>
            </div>
            
            <div className="social-login">
              <button
                type="button"
                className="social-button google"
                onClick={() => handleSocialLogin('Google')}
              >
                <FaGoogle />
                <span>使用 Google 登入</span>
              </button>
              
              <button
                type="button"
                className="social-button facebook"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <FaFacebook />
                <span>使用 Facebook 登入</span>
              </button>
            </div>
            
            <div className="register-link">
              還沒有帳號? <button onClick={() => router.push('/register')}>立即註冊</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}