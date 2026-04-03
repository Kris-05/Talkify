import Loading from '@/components/Loading';
import VerifyOTP from '@/components/verifyOTP';
import React, { Suspense } from 'react'

const verifyWrapper = () => {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyOTP />
    </Suspense>
  )
}

export default verifyWrapper;