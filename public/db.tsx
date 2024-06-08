'use server';
import mariadb from 'mariadb';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import {
  ForeignKey,
  AutoIncrement,
  DataType,
  Column,
  Model,
  Sequelize,
  Table,
  NotNull,
} from 'sequelize-typescript';
import { EventAddData, EventData, UserData, UserSingUpData } from './db_types';
import {
  Option,
  OptionData,
  OptionNone,
  OptionSome,
  ResultData,
  ResultError,
  ResultOK,
  isLegalDate,
  isLegalEmail,
  isLegalPassword,
} from './my_stuff';
import { Mode } from 'fs';
import { where } from 'sequelize';

const sequelize = new Sequelize({
  database: 'Teiler_calendar',
  dialect: 'mariadb',
  dialectModule: mariadb,
  host: 'localhost',
  username: 'root',
  password: 'fsdjn204tmc49maf1t',
});

@Table({
  timestamps: false,
})
class User extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  ID: number;
  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  Email: string;
  @NotNull
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  EmailConfirmed: boolean;
  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  Password_hash: string;
}

@Table({
  timestamps: false,
})
class UserPreference extends Model {
  @AutoIncrement
  @Column({ type: DataType.INTEGER, primaryKey: true })
  ID: number;
  @NotNull
  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => User)
  UserID: number;
  @NotNull
  @Column({ type: DataType.ENUM('Small', 'Medium', 'Big'), allowNull: false })
  SizeOfUI: string;
  @NotNull
  @Column({ type: DataType.ENUM('Light', 'Dark'), allowNull: false })
  Theme: string;
  @NotNull
  @Column({ type: DataType.ENUM('DMY', 'YMD', 'MDY'), allowNull: false })
  DateFormat: string;
  @NotNull
  @Column({ type: DataType.ENUM('12', '24'), allowNull: false })
  TimeFormat: string;
}
@Table({
  timestamps: false,
})
class Event extends Model {
  @AutoIncrement
  @Column({ type: DataType.INTEGER, primaryKey: true })
  ID: number;
  @ForeignKey(() => User)
  @NotNull
  @Column({ type: DataType.INTEGER, allowNull: false })
  UserID: number;
  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  NameOfEvent: string;
  @NotNull
  @Column({ type: DataType.TEXT, allowNull: false })
  Description: string;
  @NotNull
  @Column({ type: DataType.DATEONLY, allowNull: false })
  BeginingDate: string;
  //@NotNull
  @Column({ type: DataType.TIME, allowNull: true })
  BeginingTime: string;
  //@NotNull
  @Column({ type: DataType.TIME, allowNull: true })
  EndTime: string;
  //@NotNull
  @Column({ type: DataType.ENUM('Once', 'EveryWeak', 'EveryMonth', 'EveryYear'), allowNull: true })
  EventType: string;
  //@NotNull
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  AlarmEmail: boolean = false;
  //@NotNull
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  AlarmPushNotification: boolean = false;
}
let isInited: boolean = false;
let secret: string = '';
let transporter: nodemailer.Transporter;
async function tryInit() {
  if (isInited) return;
  try {
    await sequelize.authenticate();
    await sequelize.addModels([User, UserPreference, Event]);
    secret = loadOrGenerateRandomSecret();
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'teiler.calendar.official@gmail.com',
        pass: 'cwmt weha xfsd yref',
      },
    });
  } catch (error) {
    console.error(error);
  }
  isInited = true;
}
async function getHash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
async function isUserEmailUnique(email: string): Promise<boolean> {
  const result = await User.findOne({ where: { Email: email } });
  return result !== null;
}
async function getByEmail(email: string): Promise<Option<User>> {
  const result = await User.findOne({ where: { Email: email } });
  if (result !== null) {
    return new Option(OptionSome(result));
  }
  return new Option(OptionNone());
}
function loadOrGenerateRandomSecret(): string {
  try {
    let secret = fs.readFileSync('./secret.txt', 'utf-8');
    return secret;
  } catch (error) {
    console.error(error);
    secret = crypto.randomBytes(128).toString('hex');
    fs.writeFileSync('./secret.txt', secret);
    return secret;
  }
}

export async function trySingUpUser(userData: UserSingUpData): Promise<ResultData<null, string>> {
  try {
    await tryInit();
    if (!isLegalEmail(userData.Email)) return ResultError('The email is invalid');
    if (!isLegalPassword(userData.Password)) return ResultError('The password is invalid');
    const PasswordHash: string = await getHash(userData.Password);
    if (await isUserEmailUnique(userData.Email)) {
      return ResultError('The email is already taken!');
    }
    if (transporter === null) return ResultError('Service is not working right now!');
    const mailOptions = {
      from: 'teiler.calendar.official@gmail.com',
      to: userData.Email,
      subject: 'Successful registration',
      text: `
Hello dear new user,
Your registration is successful!

Best wishes,
Teiler calendar Team`,
    };
    try {
      transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
      return ResultError('Email is invalid or an error occured!');
    }

    await User.create({
      Email: userData.Email,
      EmailConfirmed: false,
      Password_hash: PasswordHash,
    });
    return ResultOK(null);
  } catch (error) {
    console.error('EEROROROROROROROR');
    console.error(error);
    return ResultError('An error occured!');
  }
}
export async function tryLogIn(userData: UserSingUpData): Promise<ResultData<string, string>> {
  try {
    await tryInit();
    if (!isLegalEmail(userData.Email)) return ResultError('The email is invalid');
    if (!isLegalPassword(userData.Password)) return ResultError('The password is invalid');
    const UserOption = await getByEmail(userData.Email);
    if (UserOption.isNone()) {
      return ResultError('No such user!');
    }
    const user = UserOption.unpackValue();
    if (await bcrypt.compare(userData.Password, user.Password_hash)) {
      const info = {
        sub: user.ID,
      };
      const token = jwt.sign(info, secret);
      console.log(secret);
      return ResultOK(token);
    } else {
      return ResultError('Incorrect password!');
    }
  } catch (error) {
    console.error('EEROROROROROROROR');
    console.error(error);
    return ResultError('An error occured!');
  }
}

export async function addEvent(
  token: string,
  event: EventAddData
): Promise<ResultData<string, string>> {
  try {
    await tryInit();
    let userInfo;
    try {
      userInfo = jwt.verify(token, secret);
    } catch (error) {
      return ResultError('NoToken');
    }
    if (!isLegalDate(event.date)) return ResultError('The date format is invalid!');
    if (event.name === null || event.name === undefined || event.name === '') return ResultError('The name of event is invalid!');
    if (event.description === null || event.description === undefined || event.description === '') return ResultError('The description of event is invalid!');
    const one = await Event.findOne({
      where: {
        UserID: userInfo.sub,
        NameOfEvent: event.name,
        Description: event.description,
        BeginingDate: event.date,
      },
    });
    if (one !== null) {
      return ResultError('Such event already exists!');
    }
    Event.create({
      UserID: userInfo.sub,
      NameOfEvent: event.name,
      Description: event.description,
      BeginingDate: event.date,
    });
    return ResultOK('');
  } catch (error) {
    console.error('EEROROROROROROROR');
    console.error(error);
    return ResultError('An error occured!');
  }
}
export async function getAllDates(token: string): Promise<ResultData<Date[], string>> {
  try {
    await tryInit();
    let userInfo;
    try {
      userInfo = jwt.verify(token, secret);
    } catch (error) {
      return ResultError('NoToken');
    }
    let objects = await Event.findAll({
      where: {
        UserID: userInfo.sub,
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('BeginingDate')), 'BeginingDate']],
    });
    return ResultOK(objects.map((object) => new Date(object.BeginingDate)));
  } catch (error) {
    console.error('EEROROROROROROROR');
    console.error(error);
    return ResultError('An error occured!');
  }
}
export async function getAllEvents(token: string): Promise<ResultData<EventAddData[], string>> {
  try {
    await tryInit();
    let userInfo;
    try {
      userInfo = jwt.verify(token, secret);
    } catch (error) {
      return ResultError('NoToken');
    }
    let objects = await Event.findAll({
      where: {
        UserID: userInfo.sub,
      },
      order: [['BeginingDate', 'ASC']],
    });
    return ResultOK(
      objects.map((object) => {
        return {
          name: object.NameOfEvent,
          description: object.Description,
          date: object.BeginingDate,
        };
      })
    );
  } catch (error) {
    console.error('EEROROROROROROROR');
    console.error(error);
    return ResultError('An error occured!');
  }
}
export async function deleteEvent(
  token: string,
  event: EventAddData
): Promise<ResultData<string, string>> {
  try {
    await tryInit();
    let userInfo;
    try {
      userInfo = jwt.verify(token, secret);
    } catch (error) {
      return ResultError('NoToken');
    }
    console.log(event.date);
    Event.destroy({
      where: {
        NameOfEvent: event.name,
        Description: event.description,
        BeginingDate: event.date,
      },
    });
    return ResultOK('OK');
  } catch (error) {
    console.error('EEROROROROROROROR');
    console.error(error);
    return ResultError('An error occured!');
  }
}

export async function editEvent(
  token: string,
  eventOld: EventAddData,
  eventNew: EventAddData
): Promise<ResultData<string, string>> {
  try {
    await tryInit();
    let userInfo;
    try {
      userInfo = jwt.verify(token, secret);
    } catch (error) {
      return ResultError('NoToken');
    }
    if (!isLegalDate(eventNew.date) || !isLegalDate(eventOld.date))
      return ResultError('The date format is invalid!');
    if (eventNew.name === null || eventNew.name === undefined || eventNew.name === '') return ResultError('The name of event is invalid!');
    if (eventNew.description === null || eventNew.description === undefined || eventNew.description === '') return ResultError('The description of event is invalid!');
    const ifExists = await Event.findOne({
      where: {
        UserID: userInfo.sub,
        NameOfEvent: eventNew.name,
        Description: eventNew.description,
        BeginingDate: eventNew.date,
      },
    });
    if (ifExists !== null) return ResultError('Such event already exists!');
    let one = await Event.update(
      {
        NameOfEvent: eventNew.name,
        Description: eventNew.description,
        BeginingDate: eventNew.date,
      },
      {
        where: {
          UserID: userInfo.sub,
          NameOfEvent: eventOld.name,
          Description: eventOld.description,
          BeginingDate: eventOld.date,
        },
      }
    );
    if (one === null) {
      return ResultError('No such event!');
    }
    return ResultOK('');
  } catch (error) {
    console.error('EEROROROROROROROR');
    console.error(error);
    return ResultError('An error occured!');
  }
}
export async function sendResetLink(email: string): Promise<ResultData<string, string>> {
  try {
    await tryInit();
    if (!await isUserEmailUnique(email)) {
      return ResultError('No such email!');
    }
    const info = {
      email: email,
    };
    const resetToken = jwt.sign(info, secret, { expiresIn: '1h' });
    const link = `http://localhost:3000/login/forgot_password/reset?resetToken=${resetToken}`;
    if (transporter === null) return ResultError('Service is not working right now!');
    const mailOptions = {
      from: 'teiler.calendar.official@gmail.com',
      to: email,
      subject: 'Reset password',
      text: `
Hello dear new user,
Your reset link: ${link}

Ignore this email if you didn't trigger the email

Best wishes,
Teiler calendar Team`,
    };
    try {
      transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
      return ResultError('Email is invalid or an error occured!');
    }  
    return ResultOK('OK');
  } catch (error) {
    console.error(error);
    return ResultError('An error occured!');
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<ResultData<string, string>> {
  try {
    await tryInit();
    if (!isLegalPassword(newPassword)) return ResultError('The password is invalid');
    let data;
    try{
      data = await jwt.verify(token, secret);
    }
    catch(error){
      console.error(error);
      return ResultError('Invalid link!');
    }
    console.log(data);
    await User.update({
      Password_hash: await getHash(newPassword),
    },{
      where:{
        Email: data.email,
      }
    })
    return ResultOK('OK');
  } catch (error) {
    console.error(error);
    return ResultError('An error occured!');
  }
}