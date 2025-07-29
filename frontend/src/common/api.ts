import axiosInstance from "./axio";


export const getInterestCategories = async () => { 
  try {
    const response = await axiosInstance.get('/personal/interest-groups/');
    const data = response.data; // 這裡就是你要的資料
    return data
  } catch (error) {
    console.error('取得使用者資料失敗', error);
  }
}