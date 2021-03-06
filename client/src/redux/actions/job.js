export const getJobs = jobs => {
  return {
    type: "GET_JOBS",
    payload: jobs
  };
};

export const hasJobs = () => {
  return {
    type: "HAS_JOBS"
  };
};

export const newJob = job => {
  return {
    type: "NEW_JOB",
    payload: job
  };
};

export const currentJob = id => {
  return {
    type: "CURRENT_JOB",
    payload: id
  };
};

export const refreshCurrentJob = job => {
  return {
    type: "REFRESH_CURRENT_JOB",
    payload: job
  };
};

export const updateJob = job => {
  return {
    type: "UPDATE_JOB",
    payload: job
  };
};

export const deleteJob = job => {
  return {
    type: "DELETE_JOB",
    payload: job
  };
};

export const removeCurrentJob = () => {
  return {
    type: "REMOVE_CURRENT_JOB"
  };
};

export const getProgressInfo = info => {
  return {
    type: "GET_PROGRESS_INFO",
    payload: info
  };
};
