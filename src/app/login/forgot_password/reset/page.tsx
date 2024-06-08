'use client';
import { EB_Garamond, Satisfy, Permanent_Marker, Libre_Franklin, Poppins } from 'next/font/google';
import { CSSProperties, useState } from 'react';
import Link from 'next/link';
import { Entry_row, Result } from '../../../../../public/my_stuff';
import { useSearchParams } from 'next/navigation';
import { resetPassword } from '../../../../../public/db';
import { useRouter } from 'next/navigation';
import bg from '/public/black-calendar-on-texture-background-600nw-1741834784.webp';

const font = Poppins({
  subsets: ['latin'],
  weight: '400',
});

export default function ForgotPassword() {
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();
  async function reset() {
    const resetToken = searchParams.get('resetToken');
    if (resetToken === null) {
      setStatus('Invalid link!');
      return;
    }
    const result = new Result(await resetPassword(resetToken, newPassword));
    if (result.isError()) {
      setStatus(result.getError());
      return;
    }
    router.push('/login');
  }
  return (
    <div
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100%',
        width: '100%',
      }}
    >
      <div className={font.className + ' centered'}>
        <h1 className="hello">Teiler</h1>
        <Entry_row
          valueSetter={setNewPassword}
          entry_name="The new password"
          entry_id="email"
          margin_bottom="10px"
        />
        <label className="errorColor">{status}</label>
        <br />
        <button
          onClick={() => reset()}
          className="button"
          style={{ width: '300px', fontSize: '30px' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
