import React from "react";
import SignupForm from "../../components/forms/SignupForm";

const SignupPage = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(120deg, #fffbe6 0%, #fff 100%)",
    }}
  >
    <SignupForm />
  </div>
);

export default SignupPage;
