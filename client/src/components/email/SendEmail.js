import React, { useState } from "react";
import { connect } from "react-redux";
import Checkbox from "../resusable-components/Checkbox";
import {
  FormContainer,
  InputContainer,
  Input,
  FormButton,
  TextArea
} from "../resusable-components/styledComponents";

const SendEmail = ({ hasResume, sendEmailSubmitHandler, closeModal }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [withResume, setWithResume] = useState(false);

  const submitHandler = e => {
    e.preventDefault();
    sendEmailSubmitHandler({ subject, message, withResume });
    setSubject("");
    setMessage("");
  };

  return (
    <div className="send-email-container">
      <FormContainer className="send-email-form" onSubmit={submitHandler}>
        <InputContainer>
          <p>Subject:</p>
          <Input
            required
            type="text"
            name="subject"
            value={subject}
            onChange={e => {
              setSubject(e.target.value);
            }}
          />

          <p>Message:</p>
          <TextArea
            required
            name="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            id=""
            cols="30"
            rows="10"
          />

          {hasResume && (
            <Checkbox
              text="Attach Resume?"
              clickHandler={() => setWithResume(!withResume)}
              checked={withResume}
            />
          )}
        </InputContainer>

        <div className="modal-buttons">
          <FormButton type="submit">Submit</FormButton>
          <FormButton onClick={closeModal}>Close</FormButton>
        </div>
      </FormContainer>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    hasResume: state.auth.currentUser.resume
  };
};

export default connect(mapStateToProps)(SendEmail);
