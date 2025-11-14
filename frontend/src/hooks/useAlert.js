import { useState } from 'react';

export const useAlert = (initialState = {
  open: false,
  message: "",
  severity: "success"
}) => {
  const [alertData, setAlertData] = useState(initialState);

  const showAlert = (message, severity = "success") => {
    setAlertData({
      open: true,
      message,
      severity,
    });
  };

  const alertSuccess = (message) => showAlert(message, "success");
  const alertError = (message) => showAlert(message, "error");
  const alertWarning = (message) => showAlert(message, "warning");
  const alertInfo = (message) => showAlert(message, "info");

  const hideAlert = () => {
    setAlertData((prev) => ({ ...prev, open: false }));
  };

  return {
    alertData,
    showAlert,
    alertSuccess,
    alertError,
    alertWarning,
    alertInfo,
    hideAlert,
  };
};
