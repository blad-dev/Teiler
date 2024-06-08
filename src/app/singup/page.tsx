'use client';
import { EB_Garamond, Satisfy, Permanent_Marker, Libre_Franklin, Poppins } from 'next/font/google';
import { CSSProperties, useState } from 'react';
import bg from '/public/black-calendar-on-texture-background-600nw-1741834784.webp';
import {
  Entry_row,
  Result,
  ResultData,
  isLegalEmail,
  isLegalPassword,
} from '../../../public/my_stuff';
import { UserSingUpData } from '../../../public/db_types';
import { trySingUpUser } from '../../../public/db';
import ConfirmEmail from './confirmEmailToProceed/page';
import { useRouter } from 'next/navigation';

const font = Poppins({
  subsets: ['latin'],
  weight: '400',
});

export default function SingUp() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [passwordRepeat, setPasswordRepeat] = useState('');
  let [status, setStatus] = useState('');
  let router = useRouter();
  async function singUpButtonOnClick() {
    if (!isLegalEmail(email)) {
      setStatus('Email is invalid!');
      return;
    }
    if (!isLegalPassword(password)) {
      setStatus('Password is invalid!');
      return;
    }
    if (password !== passwordRepeat) {
      setStatus('Passwords are different!');
      return;
    }
    const userData: UserSingUpData = {
      Email: email,
      Password: password,
    };
    const result: Result<null, string> = new Result(await trySingUpUser(userData));
    if (result.isError()) {
      setStatus(result.getError());
      return;
    }
    router.push('/singup/confirmEmailToProceed');
    setStatus('User is added, you will be redirected soon');
  }
  return (
    <div style={{
      backgroundImage: `url(${bg.src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '100%',
      width: '100%'
    }}>
      <div className={font.className + ' centered'}>
        <h1 className="hello whiteColor">Teiler</h1>
        <Entry_row
          valueSetter={setEmail}
          entry_name="Email"
          entry_id="email"
          margin_bottom="10px"
        />

        <Entry_row
          valueSetter={setPassword}
          entry_name="Password"
          entry_id="password"
          margin_bottom="10px"
        />

        <Entry_row
          valueSetter={setPasswordRepeat}
          entry_name="Repeat password"
          entry_id="password2"
          margin_bottom="10px"
        />
        <label className="errorColor">{status}</label>
        <br />
        <button
          className="button"
          style={{ width: '300px', fontSize: '42px' }}
          onClick={singUpButtonOnClick}
        >
          Sing up
        </button>
      </div>
    </div>
  );
}
