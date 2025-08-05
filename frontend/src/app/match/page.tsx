'use client';
import React, { useState, useEffect } from 'react';
import { FaHeart, FaTimes, FaArrowLeft, FaArrowRight, FaVenus, FaMars, FaTransgender, FaSignOutAlt, FaUser, FaCog, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { GiSwordWound, GiMagicSwirl, GiJourney } from 'react-icons/gi';
import './match.css';
import axiosInstance from '@/common/axio';

export default function Match() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [startX, setStartX] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const fetchMatchData = async () => {
        try {
        const response = await axiosInstance.get('/personal/match/');
        setProfiles(response.data);
        } catch (error) {
        console.error('獲取配對資料失敗:', error);
        // 可以在這裡設置錯誤狀態或顯示錯誤訊息
        }
  };
  // 模擬資料載入
    useEffect(() => {


    fetchMatchData();
    }, []);

    const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
        // 傳送 refresh token 給後端登出
        await axiosInstance.post('/authen/logout/', {
        refresh: refreshToken,
        });

        // 清除 localStorage token
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // 跳轉到登入頁
        router.push('/login');
    } catch (error) {
        console.error('登出失敗:', error);
    }
    };


  // 計算年齡
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // 滑動手勢處理
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!startX) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    if (diff > 50) {
      setSwipeDirection('right');
    } else if (diff < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (swipeDirection === 'right') {
      handleLike();
    } else if (swipeDirection === 'left') {
      handleDislike();
    }
    setSwipeDirection(null);
    setStartX(0);
  };

  // 喜歡/配對
  const handleLike = () => {
    console.log('喜歡:', profiles[currentIndex].nickname);
    // 這裡可以加入API呼叫
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 沒有更多配對了
      setCurrentIndex(0);
    }
  };

  // 不喜歡
  const handleDislike = () => {
    console.log('不喜歡:', profiles[currentIndex].nickname);
    // 這裡可以加入API呼叫
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 沒有更多配對了
      setCurrentIndex(0);
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>正在尋找適合的配對...</p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  const age = calculateAge(currentProfile.birthday);

  return (
    <div className="app-container">
      {/* 側邊導航欄 */}
      <div 
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="sidebar-header">
          <div className="user-avatar">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/media/profile_photos/default_avatar.jpg`} 
              alt="用戶頭像"
            />
          </div>
          {sidebarOpen && <span className="username">我的個人檔案</span>}
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <a href="/match" className="nav-link">
                <FaHome className="nav-icon" />
                {sidebarOpen && <span>首頁</span>}
              </a>
            </li>
            <li>
              <a href="/profile" className="nav-link">
                <FaUser className="nav-icon" />
                {sidebarOpen && <span>個人資料</span>}
              </a>
            </li>
            <li>
              <a href="/settings" className="nav-link">
                <FaCog className="nav-icon" />
                {sidebarOpen && <span>設定</span>}
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            {sidebarOpen && <span>登出</span>}
          </button>
        </div>
      </div>

      {/* 主內容區域 */}
      <div className="main-content">
        {profiles.length === 0 ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>正在尋找適合的配對...</p>
          </div>
        ) : (
		<div className="match-container">
		  <div 
			className={`profile-card ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		  >
			<div className="pic-block">
			  <div className="photo-container">
				<img
				src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${currentProfile.photos[0]}`}
				alt={currentProfile.nickname}
				/>
			  </div>
			  <div className="photo-nav">
				<button className="nav-btn prev-btn">
				  <FaArrowLeft />
				</button>
				<button className="nav-btn next-btn">
				  <FaArrowRight />
				</button>
			  </div>
			</div>
			
			<div className="content">
			  <div className="name-content">
				<h2>{currentProfile.nickname}, {age}</h2>
				<span className="gender-icon">
				  {currentProfile.gender === 'M' ? <FaMars /> : 
				   currentProfile.gender === 'F' ? <FaVenus /> : <FaTransgender />}
				</span>
			  </div>
			  
			  <div className="interest-content">
				{currentProfile.interests.slice(0, 5).map((interest, index) => (
				  <span key={index} className="interest-tag">{interest}</span>
				))}
			  </div>
			  
			  <div className="intro">
				<p>{currentProfile.bio}</p>
			  </div>
			</div>
		  </div>
		  
		  <div className="action-buttons">
			<button className="dislike-btn" onClick={handleDislike}>
			  <FaTimes />
			</button>
			<button className="like-btn" onClick={handleLike}>
			  <FaHeart />
			</button>
		  </div>
		  
		  <div className="match-footer">
			<GiJourney className="journey-icon" />
			<GiMagicSwirl className="magic-icon" />
			<GiSwordWound className="sword-icon" />
			<p>滑動卡片或點擊按鈕來配對</p>
		  </div>
		</div>
        )}
      </div>
    </div>
  );
    
    
  
}