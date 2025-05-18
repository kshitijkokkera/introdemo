// -----------------------------------------------------------------------------
// notification.js (Ideally in its own file: src/components/Notification.js or similar)
// -----------------------------------------------------------------------------
// import React from 'react'; // Not strictly needed if no JSX is used, but good practice

const NotificationComponent = ({ message, type }) => {
  if (message === null || message === undefined || message === "") {
    return null;
  }

  const baseStyle = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  const successStyle = {
    ...baseStyle,
    color: 'green',
    borderColor: 'green',
  };

  const errorStyle = {
    ...baseStyle,
    color: 'red',
    borderColor: 'red',
  };

  const infoStyle = {
    ...baseStyle,
    color: 'blue',
    borderColor: 'blue',
  };

  let styleToUse = baseStyle;
  if (type === 'success') {
    styleToUse = successStyle;
  } else if (type === 'error') {
    styleToUse = errorStyle;
  } else if (type === 'info') {
    styleToUse = infoStyle;
  }


  return (
    <div style={styleToUse}>
      {message}
    </div>
  );
};

export default NotificationComponent; // Use this if in its own file

