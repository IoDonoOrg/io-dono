import { TextField, Button, Box } from "@mui/material";

import PasswordField from "src/components/form/PasswordField";
import PhoneField from "src/components/form/PhoneField";
import AddressFields from "src/components/form/AddressFields";
import OpeningHoursField from "src/components/form/OpeningHoursField";
import { useRegistration } from "src/hooks/useRegistration";
import { DONOR_TYPE, USER_ROLE } from "src/utils/constants";

/**
 * RegistrationForm è un componente generico usato sia nella pagina di registrazione
 * che nel dialogo di creazione associazione
 */
function RegistrationForm({
  alertSuccess,
  alertError,
  onSubmitSuccess,
  // formId è usato per collegare un bottone di submit esterno al form, ad esempio quello definito in CreateAssocDialog
  formId = "registration-form",
  submitLabel = "Registrati",
  userType,
}) {
  const {
    formData,
    formErrors,
    handleInputChange,
    handleSubmit,
    isGoogleMode,
  } = useRegistration(alertSuccess, alertError, userType);

  const handleFormSubmit = async (e) => {
    const success = await handleSubmit(e);
    if (success) onSubmitSuccess?.();
  };

  const handleNameLabel = (user) => {
    if (
      user.category === USER_ROLE.DONOR &&
      user.donatorType === DONOR_TYPE.PRIVATE
    )
      return "Nome *";
    if (
      user.category === USER_ROLE.DONOR &&
      user.donatorType === DONOR_TYPE.COMMERCIAL
    )
      return "Nome attività commerciale *";
    return "Nome associazione *";
  };

  return (
    <form
      id={formId}
      className="flex flex-col gap-3"
      onSubmit={handleFormSubmit}
    >
      <Box className="flex gap-2 pt-2">
        <TextField
          fullWidth
          label={handleNameLabel(formData.user)}
          placeholder={
            formData.user.category === USER_ROLE.DONOR &&
            formData.user.donatorType === DONOR_TYPE.PRIVATE
              ? "Mario"
              : "Mulino Bianco"
          }
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={!!formErrors.name}
          helperText={formErrors.name}
          size="small"
        />
        {formData.user.category === USER_ROLE.DONOR &&
          formData.user.donatorType === DONOR_TYPE.PRIVATE && (
            <TextField
              fullWidth
              label="Cognome *"
              placeholder="Rossi"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
              size="small"
            />
          )}
      </Box>

      {!isGoogleMode && (
        <TextField
          fullWidth
          label="Email *"
          placeholder="mariorossi@gmail.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={!!formErrors.email}
          helperText={formErrors.email}
          size="small"
        />
      )}

      {!isGoogleMode && (
        <Box className="flex flex-row gap-2 pt-2 pb-2">
          <PasswordField
            passwordValue={formData.password}
            onPasswordChange={(val) => handleInputChange("password", val)}
            error={!!formErrors.password}
            errorText={formErrors.password}
            label="Password *"
            size="small"
          />
          <PasswordField
            passwordValue={formData.confirmPassword}
            onPasswordChange={(val) =>
              handleInputChange("confirmPassword", val)
            }
            error={!!formErrors.confirmPassword}
            errorText={formErrors.confirmPassword}
            label="Conferma password *"
            size="small"
          />
        </Box>
      )}

      <PhoneField
        value={formData.phone}
        onChange={(val) => handleInputChange("phone", val)}
        error={!!formErrors.phone}
        helperText={formErrors.phone}
        size="small"
        label="Cellulare *"
      />

      <AddressFields
        fieldName="Indirizzo"
        value={formData.address}
        onChange={(val) => handleInputChange("address", val)}
        errors={formErrors.address}
      />

      {formData.user.donatorType === DONOR_TYPE.COMMERCIAL && (
        <OpeningHoursField
          value={formData.openingHours}
          errors={formErrors.openingHours}
          fieldName="L'orario di apertura"
          onChange={(val) => handleInputChange("openingHours", val)}
        />
      )}

      {submitLabel && (
        <Button color="primary" type="submit" size="large" variant="contained">
          {submitLabel}
        </Button>
      )}
    </form>
  );
}

export default RegistrationForm;
