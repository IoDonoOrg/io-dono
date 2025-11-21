import { useState } from "react";

export function useAddress() {
  const [addressData, setAddressData] = useState({
    street: "",
    civicNumber: "",
    comune: "",
    province: "TN",
  });

  // 1. State keeps the "Error" suffix
  const [addressErrors, setAddressErrors] = useState({
    streetError: "",
    civicNumberError: "",
    comuneError: "",
    provinceError: "",
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));

    if (addressErrors[name]) {
      setAddressErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateAddress = () => {
    const newErrors = {};
    let isValid = true;

    if (!addressData.street.trim()) {
      newErrors.streetError = "Obbligatorio";
      isValid = false;
    }
    if (!addressData.civicNumber.trim()) {
      newErrors.civicNumberError = "!";
      isValid = false;
    }
    if (!addressData.comune.trim()) {
      newErrors.comuneError = "Obbligatorio";
      isValid = false;
    }

    setAddressErrors(newErrors);
    return isValid;
  };

  return {
    addressData,
    addressErrors,
    handleAddressChange,
    validateAddress,
  };
}