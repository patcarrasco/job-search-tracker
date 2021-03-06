import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import NewEmployee from "../employees/NewEmployee";
import Table from "../employees/Table";
import AddEmail from "../email/AddEmail";
import Email from "../email/Email";
import Modal from "../layout/Modal";
import SmallModal from "../layout/SmallModal";
import UpdateResponse from "../employees/UpdateResponse";
import Loading from "../layout/Loading";
import Job from "./Job";
import { currentJob, removeCurrentJob } from "../../redux/actions/job";
import {
  currentEmployee,
  removeCurrentEmployee,
  removeEmployees
} from "../../redux/actions/employee";

import { getJobByIdThunk, deleteJobThunk } from "../../redux/thunks/job";
import {
  getEmployeesThunk,
  updateEmployeeThunk,
  newEmployeeThunk
} from "../../redux/thunks/employee";
import { sendNewGmailThunk } from "../../redux/thunks/email";
import { readAllTemplatesThunk } from "../../redux/thunks/template";
import styled from "styled-components";
import {
  HeaderContainer,
  TableButton
} from "../resusable-components/styledComponents";
import DeleteJob from "./DeleteJob";

const JobContainer = ({
  job,
  employees,
  match,
  templates,
  history,
  getJobByIdThunk,
  getEmployeesThunk,
  removeEmployees,
  removeCurrentJob,
  currentEmployeeId,
  currentEmployee,
  removeCurrentEmployee,
  readAllTemplatesThunk,
  newEmployeeThunk,
  updateEmployeeThunk,
  sendNewGmailThunk,
  deleteJobThunk
}) => {
  const [newEmployeeForm, setNewEmployeeForm] = useState(false);
  const [addEmailForm, setAddEmailForm] = useState(false);
  const [sendEmailForm, setSendEmailForm] = useState(false);
  const [stateEmployeeId, setEmployeeId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [responseModal, setResponseModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (employees.length === 0 && Object.keys(job).length === 0) {
      const jobId = match.params.id;
      getJobByIdThunk(jobId);
      getEmployeesThunk(jobId);
    }

    return () => {
      removeEmployees();
      removeCurrentJob();
    };
  }, []);

  const newEmployeeFormHandler = () => {
    setNewEmployeeForm(!newEmployeeForm);
    setShowModal(true);
  };

  const addEmailButtonClickHandler = employeeId => {
    currentEmployee(employeeId);
    setAddEmailForm(true);
    setEmployeeId(employeeId);
    setShowModal(true);
  };

  const sendEmailButtonClickHandler = employeeId => {
    currentEmployee(employeeId);
    if (templates.length === 0) {
      readAllTemplatesThunk();
    }
    setSendEmailForm(true);
    setEmployeeId(employeeId);
    setShowModal(true);
  };

  const newEmployeeSubmitHandler = employee => {
    setNewEmployeeForm(false);
    setShowModal(false);
    // return props.newEmployeeThunk(employee, job._id);
    newEmployeeThunk(employee, job._id);
  };

  const updateEmployeeSubmitHandler = updates => {
    removeCurrentEmployee();
    updateEmployeeThunk(job._id, stateEmployeeId, updates);

    setNewEmployeeForm(false);
    setAddEmailForm(false);
    setSendEmailForm(false);
    setEmployeeId("");
    setShowModal(false);
  };

  const sendEmailSubmitHandler = emailObj => {
    removeCurrentEmployee();
    sendNewGmailThunk(stateEmployeeId, emailObj);
    setNewEmployeeForm(false);
    setAddEmailForm(false);
    setSendEmailForm(false);
    setEmployeeId("");
    setShowModal(false);
  };

  const closeModal = () => {
    removeCurrentEmployee();
    setShowModal(false);
    setAddEmailForm(false);
    setSendEmailForm(false);
    setNewEmployeeForm(false);
    setEmployeeId("");
    setResponseModal(false);
    setDeleteModal(false);
  };

  const showResponseModal = employeeId => {
    currentEmployee(employeeId);
    setResponseModal(true);
  };

  const responseSubmitHandler = () => {
    updateEmployeeThunk(job._id, currentEmployeeId, { response: true });
    closeModal();
  };

  const deleteHandler = () => {
    deleteJobThunk(job._id);
    closeModal();
    history.push("/dashboard");
  };

  const componentPassToModal = () => {
    if (
      newEmployeeForm === true &&
      addEmailForm === false &&
      sendEmailForm === false
    ) {
      return (
        <NewEmployee
          submitHandler={newEmployeeSubmitHandler}
          closeModal={closeModal}
        />
      );
    } else if (
      newEmployeeForm === false &&
      addEmailForm === true &&
      sendEmailForm === false
    ) {
      return (
        <AddEmail
          closeModal={closeModal}
          updateEmployeeSubmitHandler={updateEmployeeSubmitHandler}
        />
      );
    } else if (
      newEmployeeForm === false &&
      addEmailForm === false &&
      sendEmailForm === true
    ) {
      return (
        <Email
          closeModal={closeModal}
          sendEmailSubmitHandler={sendEmailSubmitHandler}
        />
      );
    }
  };

  // debugger;

  if (Object.keys(job).length === 0 && employees.length === 0) {
    return <Loading />;
  }

  return (
    <div>
      <HeaderContainer>
        <h1>{job.company}</h1>
      </HeaderContainer>

      <PageContainer>
        <Job job={job} />
        <TableDiv>
          <AddFlex>
            <TableButton onClick={newEmployeeFormHandler}>
              Add Employee
            </TableButton>
          </AddFlex>

          {employees.length > 0 && (
            <Table
              employees={employees}
              jobId={job._id}
              addEmailButtonClickHandler={addEmailButtonClickHandler}
              sendEmailButtonClickHandler={sendEmailButtonClickHandler}
              showSmallModal={showResponseModal}
            />
          )}

          <AddFlex>
            <DeleteButton onClick={() => setDeleteModal(true)}>
              Delete Job?
            </DeleteButton>
          </AddFlex>
        </TableDiv>
      </PageContainer>
      <Modal
        closeModal={closeModal}
        show={showModal}
        component={componentPassToModal()}
      />

      {responseModal && (
        <SmallModal
          closeModal={closeModal}
          show={responseModal}
          component={
            <UpdateResponse
              _id={job._id}
              closeModal={closeModal}
              submitHandler={responseSubmitHandler}
            />
          }
        />
      )}

      {deleteModal && (
        <SmallModal
          closeModal={closeModal}
          show={deleteModal}
          component={
            <DeleteJob
              _id={job._id}
              job={job}
              closeModal={closeModal}
              submitHandler={deleteHandler}
            />
          }
        />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    job: state.job.currentJob,
    employees: state.employee.employees,
    currentEmployeeId: state.employee.currentEmployee._id,
    templates: state.template.templates
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getEmployeesThunk: jobId => dispatch(getEmployeesThunk(jobId)),
    currentJob: jobId => dispatch(currentJob(jobId)),
    getJobByIdThunk: jobId => dispatch(getJobByIdThunk(jobId)),
    newEmployeeThunk: (employee, jobId) =>
      dispatch(newEmployeeThunk(employee, jobId)),
    updateEmployeeThunk: (jobId, employeeId, updates) =>
      dispatch(updateEmployeeThunk(jobId, employeeId, updates)),
    currentEmployee: employeeId => dispatch(currentEmployee(employeeId)),
    removeCurrentEmployee: () => dispatch(removeCurrentEmployee()),
    sendNewGmailThunk: (employeeId, emailObj) =>
      dispatch(sendNewGmailThunk(employeeId, emailObj)),
    removeEmployees: () => dispatch(removeEmployees()),
    removeCurrentJob: () => dispatch(removeCurrentJob()),
    readAllTemplatesThunk: () => dispatch(readAllTemplatesThunk()),
    deleteJobThunk: jobId => dispatch(deleteJobThunk(jobId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobContainer);

const AddFlex = styled.div`
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  flex-direction: row;
  justify-content: center;
`;

const DeleteButton = styled(TableButton)`
  background-color: red;
  :hover {
    box-shadow: 0;
    background-color: #edadad;
  }
`;

const TableDiv = styled.div``;

const PageContainer = styled.div`
  margin-top: 2em;
  display: grid;
  grid-template-columns: 1fr 6fr 1fr;
`;
