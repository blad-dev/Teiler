import { Poppins } from "next/font/google";
import Link from "next/link";
import bg from '/public/black-calendar-on-texture-background-600nw-1741834784.webp';
const font = Poppins({
  subsets: ['latin'],
  weight: '400',
});
export default function ConfirmEmail(){
  return (
    <div style={{
      backgroundImage: `url(${bg.src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '100%',
      width: '100%'
    }}>
      <div className={font.className + ' centered'}>
        <h1 className="hello">Teiler</h1>
       
        <label>Confirm your email to proceed!</label>
        <br/>
        <Link className="Sign" href="/login">
          Log in
        </Link>
      </div>
    </div>
  );
}