import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SplashPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex items-center gap-4 justify-center bg-gray-900 text-white">
      <img src="/logo.png" alt="Logo" className="w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-center">Talkify</h1>
    </div>
  )
}

export default SplashPage
