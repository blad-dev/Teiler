import { Dispatch, SetStateAction } from 'react';

type valueSetterType = Dispatch<SetStateAction<string>> | ((value: string) => void);
export function Entry_row({
  entry_name,
  entry_id,
  value = '',
  valueSetter = (value: string): void => {},
  margin_bottom = '0px',
}: {
  entry_name: string;
  entry_id: string;
  value?: string;
  valueSetter?: valueSetterType;
  margin_bottom?: string;
}) {
  const style = {
    marginBottom: margin_bottom,
  };
  return (
    <>
      <label className="entryLabel whiteColor" style={{ textAlign: 'center' }}>
        {entry_name}:
      </label>
      <div style={style}>
        <input
          className="entry centered"
          id={entry_id}
          width={100}
          defaultValue={value}
          onChange={(me) => valueSetter(me.target.value)}
        />
      </div>
    </>
  );
}
function matchesFully(string: string, regex: RegExp): boolean {
  const match = string.match(regex);
  return match !== null && match.length === 1 && match[0] === string;
}

export function isLegalEmail(email: string): boolean {
  const validEmailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  return matchesFully(email, validEmailRegex);
}
export function isLegalDate(date: string): boolean{
  const validDateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}$/g);
  return matchesFully(date, validDateRegex);
}
export function isLegalTime(time: string): boolean{
  const validTimeRegex = new RegExp(/^\d{2}-\d{2}-\d{2}$/g);
  return matchesFully(time, validTimeRegex);
}
function hasLowerCase(string: string) {
  return string.toUpperCase() !== string;
}
function hasUpperCase(string: string) {
  return string.toLowerCase() !== string;
}
export function isLegalPassword(password: string): boolean {
  const specialSymbolsRegex = new RegExp(/[~`¿¡!#$%\^&*€£@+÷=\-\[\]\\';,/{}\(\)|\\":<>\?\.\_]/g);
  const digitsSymbolsRegex = new RegExp(/\d/g);
  const theWholeWordSymbolsRegex = new RegExp(
    /^[~`¿¡!#$%\^&*€£@+÷=\-\[\]\\';,/{}\(\)|\\":<>\?\.\_0-9A-Za-z]+$/g
  );
  return (
    password.length >= 8 &&
    matchesFully(password, theWholeWordSymbolsRegex) &&
    specialSymbolsRegex.test(password) &&
    digitsSymbolsRegex.test(password) &&
    hasLowerCase(password) &&
    hasUpperCase(password)
  );
}
const enum Status {
  OK,
  ERROR,
}
export type ResultData<T, E = Error> =
  | { status: Status.OK; value: T }
  | { status: Status.ERROR; error: E };
export class Result<T, E = Error> {
  private data: ResultData<T, E>;
  public constructor(data: ResultData<T, E>) {
    this.data = data;
  }
  public isOk(): boolean {
    return this.data.status === Status.OK && this.data.value !== undefined;
  }
  public isError(): boolean {
    return this.data.status === Status.ERROR || this.data.value === undefined;
  }
  public unpackValue(): T {
    if (this.data.status === Status.ERROR) {
      throw new Error(`Trying to get value when the status is error! Error: ${this.data.error}`);
    }
    if (this.data.value === undefined) {
      throw new Error(`Trying to get value when the value is undefined!`);
    }
    return this.data.value;
  }
  public getError(): E {
    if (this.data.status === Status.OK) {
      throw new Error(`Trying to get value when the status is ok! Value: ${this.data.value}`);
    }
    if (this.data.error === undefined) {
      throw new Error(`Trying to get value when the error is undefined!`);
    }
    return this.data.error;
  }
}
export function ResultError<T, E>(error: E): ResultData<T, E> {
  return {
    status: Status.ERROR,
    error: error,
  };
}
export function ResultOK<T, E>(value: T): ResultData<T, E> {
  return {
    status: Status.OK,
    value: value,
  };
}

const enum StatusOption {
  SOME,
  NONE,
}

export type OptionData<T> = { status: StatusOption.SOME; value: T } | { status: StatusOption.NONE };
export class Option<T> {
  private data: OptionData<T>;
  public constructor(data: OptionData<T>) {
    this.data = data;
  }
  public hasSome(): boolean {
    return this.data.status === StatusOption.SOME;
  }
  public isNone(): boolean {
    return this.data.status === StatusOption.NONE;
  }
  public unpackValue(): T {
    if (this.data.status === StatusOption.NONE) {
      throw new Error(`Trying to get value when the status is none!`);
    }
    return this.data.value;
  }
}
export function OptionSome<T>(value: T): OptionData<T> {
  return {
    status: StatusOption.SOME,
    value: value,
  };
}
export function OptionNone<T>(): OptionData<T> {
  return {
    status: StatusOption.NONE,
  };
}

export function setToken(userToken: string | null): void {
  window.localStorage.setItem('token', JSON.stringify(userToken));
}
export function deleteToken(): void {
  window.localStorage.removeItem('token');
}
export function getToken(): Option<string> {
  const tokenString: string | null = window.localStorage.getItem('token');
  if (tokenString === null) return new Option(OptionNone());
  const userToken: string = JSON.parse(tokenString);
  return new Option(OptionSome(userToken));
}
