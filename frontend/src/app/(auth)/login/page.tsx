'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaFacebook, FaHeart, FaUser, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './loginPage.css'; // 我們會稍後創建這個CSS文件

export default function LoginPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 這裡處理登入邏輯
    console.log('登入資訊:', { username, password });
    router.push('/home');
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} 登入`);
    // 這裡處理社交登入邏輯
    router.push('/home');
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