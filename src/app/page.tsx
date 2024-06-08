'use client';
import { EB_Garamond, Satisfy, Permanent_Marker, Libre_Franklin, Poppins } from 'next/font/google';
import { CSSProperties, useState } from 'react';
import Login from './login/page';
import SingUp from './singup/page';
import ForgotPassword from './login/forgot_password/page';
import CalendarSpace from './calendar/page';
import { getToken } from '../../public/my_stuff';
import {useRouter} from 'next/navigation';
export default function Home() {
  const token = getToken();
  const router = useRouter();
  if (token.isNone()) {
    router.push('/login');
  } else {
    router.push('/calendar');
  }
  return <></>;
}