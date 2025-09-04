import LoginForm from "../../components/forms/LoginForm";

const LoginPage = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(120deg, #fffbe6 0%, #fff 100%)",
    }}
  >
    <LoginForm />
  </div>
);

export default LoginPage;
