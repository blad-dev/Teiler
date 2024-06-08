export const enum SizeOfUI {
  Small = 'Small',
  Medium = 'Medium',
  Big = 'Big',
}
export const enum Theme {
  Light = 'Light',
  Dark = 'Dark',
}
export const enum DateFormat {
  DMY = 'DMY',
  YMD = 'YMD',
  MDY = 'MDY',
}
export const enum TimeFormat {
  T12 = '12',
  T24 = '24',
}
export const enum EventType {
  Once = 'Once',
  EveryWeak = 'EveryWeak',
  EveryMonth = 'EveryMonth',
  EveryYear = 'EveryYear',
}
export class Time {
  private hours: number = 0;
  private minutes: number = 0;
  private seconds: number = 0;
  public constructor(hours: number = 0, minutes: number = 0, seconds: number = 0) {
    this.setHours(hours);
    this.setMinutes(minutes);
    this.setSeconds(seconds);
  }
  private isNumberValid(num: number): boolean {
    return num % 1 === 0;
  }
  public setHours(hours: number): void {
    if (!this.isNumberValid(hours)) {
      throw new EvalError('Hours are invalid!');
    }
    if (hours < 0 || hours >= 24) {
      throw new RangeError('Hours are out of range!');
    }
    this.hours = hours;
  }
  public setMinutes(minutes: number): void {
    if (!this.isNumberValid(minutes)) {
      throw new EvalError('Minutes are invalid!');
    }
    if (minutes < 0 || minutes >= 60) {
      throw new RangeError('Minutes are out of range!');
    }
    this.minutes = minutes;
  }
  public setSeconds(seconds: number): void {
    if (!this.isNumberValid(seconds)) {
      throw new EvalError('Seconds are invalid!');
    }
    if (seconds < 0 || seconds >= 60) {
      throw new RangeError('Seconds are out of range!');
    }
    this.seconds = seconds;
  }
  public getHours(): number {
    return this.hours;
  }
  public getMinutes(): number {
    return this.minutes;
  }
  public getSeconds(): number {
    return this.seconds;
  }
  public toString(): string {
    const pipe = (num: number): string => num.toString().padStart(2, '0');
    const hours = pipe(this.hours);
    const minutes = pipe(this.minutes);
    const seconds = pipe(this.seconds);
    return `${hours}:${minutes}:${seconds}`;
  }
  public fromString(str: string): void {
    const words: string[] = str.split(':');
    if (words.length !== 3) {
      throw new Error('Invalid format, too many arguments!');
    }
    this.setHours(Number(words[0]));
    this.setMinutes(Number(words[1]));
    this.setSeconds(Number(words[2]));
  }
}

export interface UserSingUpData {
  Email: string;
  Password: string;
}
export interface EventAddData {
  name: string;
  description: string;
  date: string;
}
export interface UserData {
  ID: number;
  Email: string;
  Password_hash: string;
}
export interface UserPreferencesData {
  ID: number;
  UserID: number;
  SizeOfUI: SizeOfUI;
  Theme: Theme;
  DateFormat: DateFormat;
  TimeFormat: TimeFormat;
}
export interface EventData {
  ID: number;
  UserID: number;
  NameOfEvent: string;
  Description: string;
  BeginingDate: Date;
  BeginingTime: Time;
  EndTime: Time;
  EventType: EventType;
  AlarmEmail: boolean;
  AlarmPushNotification: boolean;
}