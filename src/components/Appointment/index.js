import React, { useState, useEffect } from "react";
import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";

import Show from "components/Appointment/Show";

import Empty from "components/Appointment/Empty";

import Form from "components/Appointment/Form";

import useVisualMode from "hooks/useVisualMode";

import Status from "components/Appointment/Status";

import Confirm from "components/Appointment/Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";


export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const [interview, setInterview] = useState(props.interview);

  const onAdd = () => {
    transition(CREATE);
  };

  const edit = () => {
    transition(EDIT);
  };

  const update = (name, interviewer) => {
    transition(SAVING);
    const newInterview = {
      student: name,
      interviewer: interviewer,
    };
    props.bookInterview(props.id, newInterview).then(() => {
    transition(SHOW);
  });
  };

  function save(name, interviewer) {
       transition(SAVING);
       const interview = {
      student: name,
      interviewer: interviewer,
    };
   
    props.bookInterview(props.id, interview).then((res) => transition(SHOW));
  }

  const onDelete = () => {
    transition(CONFIRM);
    transition(DELETING);
    props.cancelInterview(props.id).then(res => {
    transition(EMPTY);
  })
};

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);

 


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewer={props.interviewer}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
        onConfirm={onDelete}
        onCancel={back}
        message="Are you sure you would like to delete?"
        />
      )}
      {mode === EDIT && (
        <Form
          defaultName={interview.student}
          defaultInterviewer={interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={update}
        />
      )}

    </article>
  );
}
