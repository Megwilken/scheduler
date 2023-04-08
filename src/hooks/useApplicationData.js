import { useState, useEffect } from "react";
import axios from "axios";
import {
  getAppointmentsForDay,
  getInterviewersForDay,
} from "helpers/selectors";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

  const setDay = (day) => setState({ ...state, day });

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

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    setState({ ...state, appointments });
    return axios.put(
      `http://localhost:8001/api/appointments/${id}`,
      { interview })
    .then(() => {
      const newDays = updateSpots(state.day, state.days, appointments);
      setState({ ...state, appointments, days: newDays });
    }); 
  }

  const cancelInterview = (id, interview) => {
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`, { data: interview })
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: null,
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };
        const newDays = updateSpots(state.day, state.days, appointments);
        setState({ ...state, appointments, days: newDays });
      })
      .catch((error) => {
        setState({ ...state, error: error.message });
        throw error;
      });
  };

  const updateSpots = (day, days, appointments) => {
    const dayObj = days.find((dayObj) => dayObj.name === day);
    const appointmentsForDay = dayObj.appointments.map(
      (id) => appointments[id]
    );
    const spots = appointmentsForDay.filter(
      (appointment) => appointment.interview === null
    ).length;
    const newDay = { ...dayObj, spots };
    const newDays = days.map((day) => {
      if (day.name === newDay.name) {
        return newDay;
      }
      return day;
    });
    return newDays;
  };


  return { state, setDay, bookInterview, cancelInterview, dailyAppointments, interviewers, updateSpots };
}
