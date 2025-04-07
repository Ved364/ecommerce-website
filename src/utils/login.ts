export const setLoggedInUser = (loggedInUser: string) => {
  return localStorage.setItem("loggedInUser", loggedInUser);
};

export const getLoggedInUser = () => {
  return localStorage.getItem("loggedInUser");
};

export const removeLoggedInUser = () => {
  return localStorage.removeItem("loggedInUser");
};
