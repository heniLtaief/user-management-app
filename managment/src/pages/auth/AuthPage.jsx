import { useAuthForm } from "../../hooks/useAuthForm";
import AuthLayout from "../../layout/AuthLayout";
import AuthForm from "./AuthForm";

const AuthPage = ({ mode = "login" }) => {
  const { formData, errors, handleInputChange, handleSubmit, isLoading } =
    useAuthForm(mode);

  return (
    <AuthLayout mode={mode}>
      <AuthForm
        mode={mode}
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
};

export default AuthPage;
