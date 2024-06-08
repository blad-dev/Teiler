import Image from 'next/image';
export interface IconProps extends React.SVGAttributes<HTMLOrSVGElement> {
  size?: number;
}
export const CalendarIcon: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <Image
      width={size}
      height={size}
      src="/calendar-small-icon-1863x2048-ves2yjyu.png"
      alt="calendar icon"
    />
  );
};
export const ExitIcon: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <Image
      width={size}
      height={size}
      src="/transparent-exit-icon-essential-compilation-icon-5dcf167af14cb7.9746600315738527949884.jpg"
      alt="exit icon"
    />
  );
};
export const DeleteIcon: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <Image width={size} height={size} src="/delete-icon-1864x2048-bp2i0gor.png" alt="exit icon" />
  );
};
export const EditIcon: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <Image
      width={size}
      height={size}
      src="/Edit_icon_(the_Noun_Project_30184).svg.png"
      alt="exit icon"
    />
  );
};
