'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { FaHeart, FaCamera, FaVenus, FaMars, FaTransgender, FaBirthdayCake } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { GiSwordWound, GiMagicSwirl, GiJourney } from 'react-icons/gi';
import './profile.css'
import axiosInstance from '@/common/axio';
import { getInterestCategories } from '@/common/api';

// 星座資料
const zodiacSigns = [
  { name: "摩羯座", icon: "♑", dateRange: "12/22 - 1/19" },
  { name: "水瓶座", icon: "♒", dateRange: "1/20 - 2/18" },
  { name: "雙魚座", icon: "♓", dateRange: "2/19 - 3/20" },
  { name: "白羊座", icon: "♈", dateRange: "3/21 - 4/19" },
  { name: "金牛座", icon: "♉", dateRange: "4/20 - 5/20" },
  { name: "雙子座", icon: "♊", dateRange: "5/21 - 6/20" },
  { name: "巨蟹座", icon: "♋", dateRange: "6/21 - 7/22" },
  { name: "獅子座", icon: "♌", dateRange: "7/23 - 8/22" },
  { name: "處女座", icon: "♍", dateRange: "8/23 - 9/22" },
  { name: "天秤座", icon: "♎", dateRange: "9/23 - 10/22" },
  { name: "天蠍座", icon: "♏", dateRange: "10/23 - 11/21" },
  { name: "射手座", icon: "♐", dateRange: "11/22 - 12/21" }
];

// 興趣標籤的類型定義

interface InterestSubcategory {
  id: number;
  name: string;
}

interface InterestCategory {
  id: number; // 將 id 類型調整為 number
  name: string;
  subcategories: InterestSubcategory[]; // subcategories 現在是一個物件陣列
}


export default function Profile() {
  // 狀態管理
  const [photos, setPhotos] = useState<File[]>([]);
  const [nickname, setNickname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [zodiac, setZodiac] = useState<{name: string, icon: string} | null>(null);
  const [gender, setGender] = useState('');
  const [preference, setPreference] = useState('');
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [interestCategories, setInterestCategories] = useState<InterestCategory[]>([]);
  
  const uploadPhoto = async (photo: File) => {
    const formData = new FormData();
    formData.append('photo', photo);

    const response = await axiosInstance.post('/personal/upload-photo/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.photo_url; // 後端回傳圖片網址
};


  // 根據生日計算星座
  useEffect(() => {
    if (birthday) {
      const date = new Date(birthday);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      let sign = null;
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sign = zodiacSigns[1];
      else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) sign = zodiacSigns[2];
      else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sign = zodiacSigns[3];
      else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sign = zodiacSigns[4];
      else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sign = zodiacSigns[5];
      else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sign = zodiacSigns[6];
      else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sign = zodiacSigns[7];
      else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sign = zodiacSigns[8];
      else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sign = zodiacSigns[9];
      else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sign = zodiacSigns[10];
      else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sign = zodiacSigns[11];
      else sign = zodiacSigns[0];
      
      setZodiac(sign);
    } else {
      setZodiac(null);
    }
  }, [birthday]);

  // 處理照片上傳
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).slice(0, 5 - photos.length);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  // 移除照片
  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  // 觸發文件選擇
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 處理年齡範圍變化
  const handleAgeRangeChange = (index: number, value: number) => {
    const newRange = [...ageRange];
    newRange[index] = value;
    
    // 確保最小值不高於最大值-1
    if (index === 0 && newRange[0] >= newRange[1]) {
      newRange[1] = Math.min(newRange[0] + 1, 99);
    }
    // 確保最大值不低於最小值+1
    else if (index === 1 && newRange[1] <= newRange[0]) {
      newRange[0] = Math.max(newRange[1] - 1, 18);
    }
    
    setAgeRange(newRange);
  };

  // 處理興趣大類選擇
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // 處理興趣子類選擇
  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(item => item !== subcategory)
        : [...prev, subcategory]
    );
  };

  // 提交表單
  const handleSubmit = async () => {
    try {

      // 建立資料 JSON
      const payload = {
        nickname,
        birthday,
        zodiac,
        gender,
        preference,
        ageRange,
        interests: selectedSubcategories,
        bio,
      };

      const response = await axiosInstance.post('/personal/profile/', payload);
      console.log('資料儲存成功:', response.data);

      // 上傳所有照片，取得 URL
      const photoUrls = await Promise.all(
        photos.map(photo => uploadPhoto(photo))
      );



    } catch (error) {
      console.error('上傳或儲存失敗:', error);
    }
  };

  useEffect(() => {
    const fetchInterestCategoriesData = async () => {
      try {
        const data = await getInterestCategories(); // 等待 Promise 解析
        setInterestCategories(data);
      } catch (error) {
        console.error("Error fetching interest categories:", error);
        // 可以選擇在這裡設定一個錯誤狀態或顯示錯誤訊息給使用者
      }
    };

    fetchInterestCategoriesData(); // 呼叫非同步函式
  }, []);


  return (
    <div className="profile-edit-container">
      <div className="profile-edit-form">
        <div className="logo-small">
          <FaHeart className="heart-icon" />
          <h1>設定個人檔案</h1>
        </div>

        {/* 照片上傳區 */}
        <div className="form-section">
          <h2>你的照片</h2>
          <p>上傳1-5張照片來展示你的個性</p>
          <div className="photo-upload-container">
            {photos.map((photo, index) => (
              <div key={index} className="photo-preview">
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt={`上傳的照片 ${index + 1}`} 
                />
                <button 
                  className="remove-photo-btn"
                  onClick={() => removePhoto(index)}
                >
                  <IoMdClose />
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <div 
                className="photo-upload-btn"
                onClick={triggerFileInput}
              >
                <FaCamera />
                <span>添加照片</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 基本資料 */}
        <div className="form-section">
          <h2>基本資料</h2>
          
          <div className="input-group">
            <label>暱稱</label>
            <input
              type="text"
              placeholder="輸入你的暱稱"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>
              生日
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            {zodiac && (
              <div className="zodiac-display">
                <span className="zodiac-icon">{zodiac.icon}</span>
                <span>{zodiac.name}</span>
              </div>
            )}
          </div>
          
          <div className="radio-group">
            <h3>性別</h3>
            <div className="radio-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={gender === 'M'}
                  onChange={() => setGender('M')}
                />
                <span className="radio-custom">
                  <FaMars /> 男性
                </span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={gender === 'F'}
                  onChange={() => setGender('F')}
                />
                <span className="radio-custom">
                  <FaVenus /> 女性
                </span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === 'other'}
                  onChange={() => setGender('other')}
                />
                <span className="radio-custom">
                  <FaTransgender /> 其他
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 交友偏好 */}
        <div className="form-section">
        <h2>交友偏好</h2>
        
        <div className="radio-group">
            <h3>交友傾向</h3>
            <div className="radio-options">
            <label>
                <input
                type="radio"
                name="preference"
                value="M"
                checked={preference === 'M'}
                onChange={() => setPreference('M')}
                />
                <span className="radio-custom">男性</span>
            </label>
            <label>
                <input
                type="radio"
                name="preference"
                value="F"
                checked={preference === 'F'}
                onChange={() => setPreference('F')}
                />
                <span className="radio-custom">女性</span>
            </label>
            <label>
                <input
                type="radio"
                name="preference"
                value="O"
                checked={preference === 'O'}
                onChange={() => setPreference('O')}
                />
                <span className="radio-custom">其他</span>
            </label>
            </div>
        </div>
        
        <div className="range-group">
            <h3>交友年齡範圍</h3>
            <div className="range-slider">
            <span>{ageRange[0]}</span>
            <input
                type="range"
                min="18"
                max="98"
                value={ageRange[0]}
                onChange={(e) => handleAgeRangeChange(0, parseInt(e.target.value))}
            />
            <span>至</span>
            <input
                type="range"
                min={ageRange[0] + 1}
                max="99"
                value={ageRange[1]}
                onChange={(e) => handleAgeRangeChange(1, parseInt(e.target.value))}
            />
            <span>{ageRange[1]}</span>
            </div>
        </div>
        </div>
        {/* 興趣標籤 */}
        <div className="form-section">
          <h2>興趣標籤</h2>
          <p>選擇你的興趣，幫助我們找到更適合你的夥伴</p>
          
          <div className="interest-categories">
            <h3>興趣大類 (可多選)</h3>
            <div className="category-tags">
              {interestCategories.map(category => (
                <button
                  key={category.id}
                  className={`category-tag ${selectedCategories.includes(category.id) ? 'active' : ''}`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {selectedCategories.length > 0 && (
            <div className="interest-subcategories">
              <h3>興趣子類 (可多選)</h3>
              <div className="subcategory-tags">
                {interestCategories
                  .filter(cat => selectedCategories.includes(cat.id))
                  .flatMap(cat => cat.subcategories)
                  .map(sub => (
                  <button
                    key={sub.id} // **將 key 從 `sub` 改為 `sub.id`**
                    className={`subcategory-tag ${selectedSubcategories.includes(sub.id) ? 'active' : ''}`}
                    onClick={() => toggleSubcategory(sub.id)}
                  >
                    {sub.name}
                  </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* 自我介紹 */}
        <div className="form-section">
          <h2>自我介紹</h2>
          <textarea
            placeholder="告訴大家關於你的事情..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
          />
        </div>

        {/* 提交按鈕 */}
        <button 
          className="submit-button"
          onClick={handleSubmit}
        >
          <GiJourney className="journey-icon" />
          <GiMagicSwirl className="magic-icon" />
          <GiSwordWound className="sword-icon" />
          保存並開始奇幻旅程
        </button>
      </div>
    </div>
  );
}