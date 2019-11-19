import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { newJobThunk } from "../../redux/thunks/job";
import { FormContainer, Input } from "../styled-components/styledComponents";

class CreateJob extends Component {
  state = {
    company: "",
    website: "",
    link: "",
    linkedIn: ""
  };

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitHandler = e => {
    e.preventDefault();

    this.props.newJobThunk(this.state);
    this.setState({ company: "", website: "", link: "", linkedIn: "" });
    return this.props.history.push("/jobs");
  };

  render() {
    return (
      <div>
        <FormContainer onSubmit={this.submitHandler}>
          <p>Company Name:</p>
          <Input
            type="text"
            name="company"
            value={this.state.company}
            onChange={this.changeHandler}
          />
          <p>Company Website:</p>
          <Input
            type="text"
            name="website"
            value={this.state.website}
            onChange={this.changeHandler}
          />
          <p>Link to Job Description:</p>
          <Input
            type="text"
            name="link"
            value={this.state.link}
            onChange={this.changeHandler}
          />
          <p>LinkedIn Page:</p>
          <Input
            type="text"
            name="linkedIn"
            value={this.state.linkedIn}
            onChange={this.changeHandler}
          />
          <button type="submit">Submit</button>
        </FormContainer>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    newJobThunk: jobObj => dispatch(newJobThunk(jobObj))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(CreateJob));
