const Alert = ({ message }) => {
  if (message) {
    alert(message);
  }
  return null;
};

export default Alert;