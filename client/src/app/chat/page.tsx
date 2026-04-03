"use client";

import Loading from '@/components/Loading';
import { useAppData } from '@/context/appContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const Chat = () => {

  const { loading, isAuth } = useAppData();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  if (loading) return <Loading />

  return (
    <div>
      Chat
    </div>
  )
}

export default Chat
