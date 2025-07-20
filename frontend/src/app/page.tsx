import { redirect } from 'next/navigation';

export default function Home() {
  // 服務器端重定向
  redirect('/login');
  
  // 客戶端組件不會執行到這裡
  return null;
}