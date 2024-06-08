'use client';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { deleteToken, getToken, setToken } from '../../../public/my_stuff';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CalendarIcon, ExitIcon, EditIcon, DeleteIcon } from '../../../public/icons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { Combobox } from 'react-widgets';
import 'reactjs-popup/dist/index.css';
import 'react-widgets/styles.css';
import Popup from 'reactjs-popup';
import { EventAddData } from '../../../public/db_types';
import {
  addEvent,
  getAllDates,
  Event,
  getAllEvents,
  deleteEvent,
  editEvent,
} from '../../../public/db';
import { Result } from '../../../public/my_stuff';
import router from 'next/router';
function SideBar() {
  let [collapsed, setCollapsed] = useState(true);
  function onExit() {
    deleteToken();
  }
  return (
    <>
      <div style={{ display: 'flex', height: '100%', direction: 'ltr' }}>
        <Sidebar
          collapsedWidth="60px"
          rootStyles={{}}
          onMouseEnter={() => {
            setCollapsed(false);
          }}
          onMouseLeave={() => {
            setCollapsed(true);
          }}
          collapsed={collapsed}
        >
          <Menu
            style={{
              height: '90%',
            }}
            menuItemStyles={{
              button: {
                [`&.active`]: {
                  backgroundColor: '#13395e',
                  color: '#b6c8d9',
                },
              },
            }}
          >
            <MenuItem icon={<CalendarIcon />} component={<Link href="/calendar" />}>
              {' '}
              Calendar
            </MenuItem>
          </Menu>
          <Menu
            style={{
              display: 'flex',
              flexDirection: 'row',
              height: '10%',
              alignItems: 'flex-end',
              width: '270px',
            }}
          >
            <MenuItem
              style={{ width: '270px' }}
              icon={<ExitIcon />}
              onClick={onExit}
              component={<Link href="/login" />}
            >
              {' '}
              Exit
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
    </>
  );
}

function AddEventComponent({
  close,
  getDatesTable,
  selectedDate,
}: {
  close: any;
  getDatesTable: any;
  selectedDate: Date;
}) {
  let [name, setName] = useState('');
  let [description, setDescription] = useState('');
  let [date, setDate] = useState(
    selectedDate === undefined ? '' : selectedDate.toISOString().split('T')[0]
  );
  let [status, setStatus] = useState('');
  const router = useRouter();
  async function addButton(close: any) {
    const event: EventAddData = {
      name: name,
      description: description,
      date: date,
    };
    const token = getToken();
    if (token.isNone()) {
      deleteToken();
      router.push('/login');
    }
    const result = new Result(await addEvent(token.unpackValue(), event));
    if (result.isError()) {
      const error = result.getError();
      if (error === 'NoToken') {
        deleteToken();
        router.push('/login');
      }
      setStatus(error);
      return;
    }
    getDatesTable();
    return close();
  }
  return (
    <>
      <div style={{ ...LinesStyle, alignItems: 'flex-start' }}>
        <div style={RowsStyle}>
          <label style={{ minWidth: '150px' }}>Назва події: </label>
          <input
            style={{
              borderWidth: '3px',
              width: '100%',
              margin: '3px',
            }}
            onChange={(me) => setName(me.target.value)}
          ></input>
        </div>
        <div style={RowsStyle}>
          <label style={{ minWidth: '150px' }}>Опис події: </label>
          <input
            style={{
              borderWidth: '3px',
              width: '100%',
              margin: '3px',
            }}
            onChange={(me) => setDescription(me.target.value)}
          ></input>
        </div>
        <div style={RowsStyle}>
          <label style={{ minWidth: '150px' }}>Дата: </label>
          <input
            style={{
              borderWidth: '3px',
              width: '100%',
              margin: '3px',
            }}
            onChange={(me) => setDate(me.target.value)}
            defaultValue={date}
          ></input>
        </div>

        <div style={{ ...RowsStyle, justifyContent: 'center' }}>
          <label className="errorColor">{status}</label>
        </div>
        <div style={{ ...RowsStyle, justifyContent: 'center' }}>
          <button onClick={() => addButton(close)} className="button">
            Add
          </button>
        </div>
      </div>
    </>
  );
}
function EditEventComponent({
  close,
  getDatesTable,
  eventInfo,
}: {
  close: any;
  getDatesTable: any;
  eventInfo: EventAddData;
}) {
  let [name, setName] = useState(eventInfo.name);
  let [description, setDescription] = useState(eventInfo.description);
  let [date, setDate] = useState(eventInfo.date);
  let [status, setStatus] = useState('');
  const router = useRouter();
  async function changeButton(close: any) {
    const event: EventAddData = {
      name: name,
      description: description,
      date: date,
    };
    const token = getToken();
    if (token.isNone()) {
      deleteToken();
      router.push('/login');
    }
    const result = new Result(await editEvent(token.unpackValue(), eventInfo, event));
    if (result.isError()) {
      const error = result.getError();
      if (error === 'NoToken') {
        deleteToken();
        router.push('/login');
      }
      setStatus(error);
      return;
    }
    getDatesTable();
    return close();
  }
  return (
    <>
      <div style={{ ...LinesStyle, alignItems: 'flex-start' }}>
        <div style={RowsStyle}>
          <label style={{ minWidth: '150px' }}>Назва події: </label>
          <input
            style={{
              borderWidth: '3px',
              width: '100%',
              margin: '3px',
            }}
            onChange={(me) => setName(me.target.value)}
            defaultValue={name}
          ></input>
        </div>
        <div style={RowsStyle}>
          <label style={{ minWidth: '150px' }}>Опис події: </label>
          <input
            style={{
              borderWidth: '3px',
              width: '100%',
              margin: '3px',
            }}
            onChange={(me) => setDescription(me.target.value)}
            defaultValue={description}
          ></input>
        </div>
        <div style={RowsStyle}>
          <label style={{ minWidth: '150px' }}>Дата: </label>
          <input
            style={{
              borderWidth: '3px',
              width: '100%',
              margin: '3px',
            }}
            onChange={(me) => setDate(me.target.value)}
            defaultValue={date}
          ></input>
        </div>

        <div style={{ ...RowsStyle, justifyContent: 'center' }}>
          <label className="errorColor">{status}</label>
        </div>
        <div style={{ ...RowsStyle, justifyContent: 'center' }}>
          <button onClick={() => changeButton(close)} className="button">
            Edit
          </button>
        </div>
      </div>
    </>
  );
}

const RowsStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  gap: '10px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
};
const LinesStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: 'auto',
  alignItems: 'center',
};
function SearchBar({
  setTimeFrame,
  setName,
  setDescription,
}: {
  setTimeFrame: any;
  setName: any;
  setDescription: any;
}) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          gap: '20px',
        }}
      >
        <div style={{ ...LinesStyle }}>
          <label>Pick the time frame:</label>
          <Combobox
            onChange={(value) => setTimeFrame(value)}
            defaultValue="All"
            data={['Decade', 'Year', 'Month', 'All']}
          />
        </div>
        <div style={{ ...LinesStyle }}>
          <label>The name: </label>
          <input
            style={{
              borderWidth: '3px',
              borderColor: '#ababab',
              borderRadius: '7px',
              padding: '5px',
            }}
            onChange={(me) => setName(me.target.value)}
          />
        </div>
        <div style={{ ...LinesStyle, width: '100%' }}>
          <label>The description: </label>
          <input
            style={{
              width: '100%',
              borderWidth: '3px',
              borderColor: '#ababab',
              borderRadius: '7px',
              padding: '5px',
            }}
            onChange={(me) => setDescription(me.target.value)}
          />
        </div>
      </div>
    </>
  );
}
const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  overflow-y: scroll;
  margin: 20px;
`;
const ListItem = styled.li`
  margin-bottom: 10px;
  height: 150px;
  font-size: 28px;
  color: #333;
  border-width: 4px;
`;

const Button = styled.a`
  line-height: 2;
  height: 5rem;
  text-decoration: none;
  display: inline-flex;
  color: #ffffff;
  background-color: #ff813f;
  border-radius: 5px;
  border: 1px solid transparent;
  padding: 0.7rem 1rem 0.7rem 1rem;
  font-size: 2rem;
  letter-spacing: 0.6px;
  box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5);
  transition: 0.3s all linear;
  font-family: cursive;
  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
    box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5);
    opacity: 0.85;
    color: #ffffff;
  }
`;

const Image = styled.img`
  height: 34px;
  width: 35px;
  margin-bottom: 1px;
  box-shadow: none;
  border: none;
  vertical-align: middle;
`;

const Text = styled.span`
  margin-left: 15px;
  font-size: 26px;
  vertical-align: middle;
`;

function Coffee() {
  return (
    <Button target="_blank" href="https://buymeacoffee.com/teiler">
      <Image
        src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
        alt="Buy me a coffee"
      />
      <Text>Buy me a coffee</Text>
    </Button>
  );
}
export default function CalendarSpace() {
  const [nameSearch, setNameSearch] = useState('');
  const [descriptionSearch, setDescriptionSearch] = useState('');
  const [dates, setDates] = useState<Date[]>([]);
  const [timeFrame, setTimeFrame] = useState('All');
  const [eventsList, setEventsList] = useState<EventAddData[]>([]);
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentMonth, setCurrentMonth] = useState(6);
  let selectedDate = useRef<Date>();
  const router = useRouter();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    const token = getToken();
    if (token.isNone()) {
      router.push('/login');
    }
    getDatesTable();
  }, []);
  async function deleteButton(index: number) {
    const token = getToken();
    if (token.isNone()) {
      deleteToken();
      router.push('/login');
      return;
    }
    let event = eventsList[index];
    event.date = event.date.substring(0, 10);
    const result = new Result(await deleteEvent(token.unpackValue(), event));
    if (result.isError()) {
      alert(result.getError());
    }
    getDatesTable();
  }
  async function getDatesTable() {
    const token = getToken();
    if (token.isNone()) {
      deleteToken();
      router.push('/login');
      return;
    }
    const datesList = new Result(await getAllDates(token.unpackValue()));
    if (datesList.isError()) {
      const error = datesList.getError();
      if (error === 'NoToken') {
        deleteToken();
        router.push('/login');
        return;
      }
      alert(error);
      return;
    }
    setDates(datesList.unpackValue());
    const events = new Result(await getAllEvents(token.unpackValue()));
    if (events.isError()) {
      const error = events.getError();
      if (error === 'NoToken') {
        deleteToken();
        router.push('/login');
        return;
      }
      alert(error);
      return;
    }
    setEventsList(events.unpackValue());
  }
  return (
    <>
      <div
        style={{
          height: '98%',
          width: '99%',
          display: 'flex',
        }}
      >
        <SideBar />
        <div
          style={{
            height: '100px',
            width: '500px',
            border: '0px',
            margin: '10px',
          }}
        >
          <Calendar
            minDetail="decade"
            onClickDay={(date) => {
              const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
              selectedDate.current = new Date(date.getTime() + oneDayInMilliseconds);
            }}
            tileContent={({ activeStartDate, date, view }) => {
              if (view === 'month' && date.getDate() === 15) {
                setCurrentMonth(date.getMonth());
                setCurrentYear(date.getFullYear());
              }
              if (view !== 'month') {
                setCurrentMonth(date.getMonth());
                setCurrentYear(date.getFullYear());
              }
              let fit;
              if (view === 'month') {
                fit = (dateFirst: Date, dateSecond: Date) => {
                  return (
                    dateFirst.getDate() === dateSecond.getDate() &&
                    dateFirst.getMonth() === dateSecond.getMonth() &&
                    dateFirst.getFullYear() === dateSecond.getFullYear()
                  );
                };
              } else if (view === 'year') {
                fit = (dateFirst: Date, dateSecond: Date) => {
                  return (
                    dateFirst.getMonth() === dateSecond.getMonth() &&
                    dateFirst.getFullYear() === dateSecond.getFullYear()
                  );
                };
              } else if (view === 'decade') {
                fit = (dateFirst: Date, dateSecond: Date) => {
                  return dateFirst.getFullYear() === dateSecond.getFullYear();
                };
              } else return;
              for (let i = 0; i < dates.length; ++i) {
                const datesDate = dates[i];

                if (fit(date, datesDate)) return <p>*</p>;
              }
              return;
            }}
          />
          <div
            style={{
              height: '80%',
              width: '80%',
              display: 'flex',
              margin: '10px',
            }}
          >
            <Coffee />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            margin: '10px',
            flexDirection: 'column',
          }}
        >
          <SearchBar
            setTimeFrame={setTimeFrame}
            setName={setNameSearch}
            setDescription={setDescriptionSearch}
          />
          <ListContainer>
            {eventsList.map((event, index) => {
              const date = new Date(event.date);
              if (timeFrame === 'Year' && date.getFullYear() !== currentYear) {
                return;
              }
              if (
                timeFrame === 'Month' &&
                (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear)
              ) {
                return;
              }
              if (
                timeFrame === 'Decade' &&
                Math.floor(date.getFullYear() / 10) !== Math.floor((currentYear - 1) / 10)
              ) {
                return;
              }
              if (!event.name.toLocaleLowerCase().includes(nameSearch.toLocaleLowerCase()) || !event.description.toLocaleLowerCase().includes(descriptionSearch.toLocaleLowerCase()))
                return;
              return (
                <ListItem style={{ display: 'flex', width: '100%' }} key={index}>
                  <label style={{ height: '100%', width: '18%' }} className="coolLavel">
                    {event.name}
                  </label>
                  <label style={{ height: '100%', width: '44%' }} className="coolLavel">
                    {event.description}
                  </label>
                  <label style={{ height: '100%' }} className="coolLavel">
                    {event.date}
                  </label>

                  <Popup
                    contentStyle={{ width: '90%', height: '46%' }}
                    modal
                    nested
                    trigger={
                      <button
                        style={{
                          borderWidth: '2px',
                          borderColor: 'black',
                          textAlign: 'center',
                          display: 'inline-block',
                          width: '5.5%',
                        }}
                      >
                        {' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <EditIcon size={30} />{' '}
                        </div>
                      </button>
                    }
                    position="right center"
                  >
                    {(close) => (
                      <div className="modal">
                        <div className="content">
                          <EditEventComponent
                            eventInfo={eventsList[index]}
                            close={close}
                            getDatesTable={getDatesTable}
                          ></EditEventComponent>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <button
                            style={{ width: '100%', fontSize: '28px' }}
                            className="button"
                            onClick={() => close()}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </Popup>
                  <button
                    onClick={() => deleteButton(index)}
                    style={{
                      borderWidth: '2px',
                      borderColor: 'black',
                      alignItems: 'center',
                      display: 'inline-block',
                      width: '5.5%',
                    }}
                  >
                    {' '}
                    <div
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <DeleteIcon size={30} />{' '}
                    </div>
                  </button>
                </ListItem>
              );
            })}
          </ListContainer>
          <Popup
            contentStyle={{ width: '90%', height: '46%' }}
            modal
            nested
            trigger={<button className="button"> Add a date </button>}
            position="right center"
          >
            {(close) => (
              <div className="modal">
                <div className="content">
                  <AddEventComponent
                    selectedDate={selectedDate.current}
                    close={close}
                    getDatesTable={getDatesTable}
                  ></AddEventComponent>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <button
                    style={{ width: '100%', fontSize: '28px' }}
                    className="button"
                    onClick={() => close()}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </Popup>
        </div>
      </div>
    </>
  );
}
