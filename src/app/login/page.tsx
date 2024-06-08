'use client';
import { EB_Garamond, Satisfy, Permanent_Marker, Libre_Franklin, Poppins } from 'next/font/google';
import { CSSProperties, useEffect, useState } from 'react';
import Link from 'next/link';
import bg from '/public/black-calendar-on-texture-background-600nw-1741834784.webp';
import {
  Entry_row,
  Result,
  getToken,
  isLegalEmail,
  isLegalPassword,
  setToken,
} from '../../../public/my_stuff';
import { tryLogIn } from '../../../public/db';
import { Option, UserSingUpData } from '../../../public/db_types';
import { useRouter } from 'next/navigation';

const font = Poppins({
  subsets: ['latin'],
  weight: '400',
});

export default function Login() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [status, setStatus] = useState('');
  const router = useRouter();
  useEffect(() => {
    const token = getToken();
    if (token.hasSome()) {
      router.push('/calendar');
    }
  }, []);
  async function logInButtonOnClick() {
    if (!isLegalEmail(email)) {
      setStatus('Email is invalid!');
      return;
    }
    if (!isLegalPassword(password)) {
      setStatus('Password is invalid!');
      return;
    }
    const userData: UserSingUpData = {
      Email: email,
      Password: password,
    };
    const result: Result<string, string> = new Result(await tryLogIn(userData));
    if (result.isError()) {
      setStatus(result.getError());
      return;
    }
    setToken(result.unpackValue());
    router.push('/calendar');
    window.location.reload();
  }

  return (
    <div style={{
      backgroundImage: `url(${bg.src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '100%',
      width: '100%'
    }}>
      <div
        className={font.className + ' centered'}>
        <h1 className="hello whiteColor">Teiler</h1>
        <Entry_row
          value={email}
          valueSetter={setEmail}
          entry_name="Email"
          entry_id="email"
          margin_bottom="10px"
        />

        <Entry_row
          value={password}
          valueSetter={setPassword}
          entry_name="Password"
          entry_id="password"
          margin_bottom="10px"
        />
        <Link className="button forgot" href="/login/forgot_password">
          Forgot password
        </Link>
        <br />
        <label className="errorColor">{status}</label>
        <br />
        <button
          className="button"
          style={{ width: '300px', fontSize: '42px' }}
          onClick={logInButtonOnClick}
        >
          Log in
        </button>
        <br />
        <label className='whiteColor'>Don&apos;t have an account?</label>
        <br />
        <Link className="Sign" href="/singup">
          Sign up
        </Link>
      </div>
    </div>
  );
}
