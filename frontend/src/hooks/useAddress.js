import { useState } from "react";
import { validateAddress } from "src/utils/validation";

export function useAddress() {
  const [addressData, setAddressData] = useState({
    street: "",
    civicNumber: "",
    comune: "",
    province: "TN",
  });

  const [addressErrors, setAddressErrors] = useState({
    street: "",
    civicNumber: "",
    comune: "",
    province: "",
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));

    if (addressErrors[name]) {
      setAddressErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const isAddressValid = () => {
    const errors = validateAddress(addressData);

    setAddressErrors(errors);

    console.log(errors)

    if (!!errors.street || !!errors.civicNumber || !!errors.comune || !!errors.province)
      return false;
    else
      return true;
  };

  return {
    addressData,
    addressErrors,
    handleAddressChange,
    isAddressValid,
  };
}