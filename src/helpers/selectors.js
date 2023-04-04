export function getAppointmentsForDay(state, day) {
  const dayObj = state.days.find((dayObj) => dayObj.name === day);
  if (!dayObj) {
    return [];
  }
  const appointments = dayObj.appointments.map((id) => state.appointments[id]);
  return appointments;
}

export function getInterviewersForDay(state, name) {
  const dayObj = state.days.find((dayObj) => dayObj.name === name);
  if (!dayObj || !Array.isArray(dayObj.interviewers)) {
    return [];
  }
  const interviewersFromDays = dayObj.interviewers;
  let interviewObj = [];

  for (let interviewer of interviewersFromDays) {
    interviewObj.push(state.interviewers[interviewer]);
  }
  return interviewObj;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewObj = {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer],
  };
  return interviewObj;
}
