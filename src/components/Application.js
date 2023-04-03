import React, { useState, useEffect } from "react";

import "components/Application.scss";

import DayList from "components/DayList";

import Appointment from "components/Appointment";

import { getAppointmentsForDay, getInterview } from "helpers/selectors";

import axios from "axios";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });



  const appointments = getAppointmentsForDay(state, state.day);

     const setDay = (day) => setState({ ...state, day });

  // const setDays = days => setState(prev => ({ ...prev, days }));

  useEffect(() => {
    const daysUrl = "http://localhost:8001/api/days";
    const appointmentsUrl = "http://localhost:8001/api/appointments";
    const interviewersUrl = "http://localhost:8001/api/interviewers";
    Promise.all([
      axios.get(daysUrl),
      axios.get(appointmentsUrl),
      axios.get(interviewersUrl),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

   const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
  return (
    <Appointment
      key={appointment.id}
      {...appointment}
      interview={interview}
    />
  );
});

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
