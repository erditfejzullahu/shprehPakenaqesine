import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ResendVerificationLink = () => {
const router = useRouter();
  const [countdown, setCountdown] = useState(60);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="resend-verification">
      <button
        onClick={() => router.replace('/api/emailVerification/resend')}
        disabled={isDisabled}
        type='button'
        className={`${isDisabled ? 'disabled' : 'cursor-pointer underline'} text-sm text-indigo-600`}
      >
        {isDisabled ? `Ridërgo brenda ${countdown} sekondave` : 'Ridërgo linkun verifikues'}
      </button>

    </div>
  );
};

export default ResendVerificationLink;