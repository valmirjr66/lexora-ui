import { Button, Input, InputLabel } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import { TypeAnimation } from "react-type-animation";
import useToaster from "../hooks/useToaster";
import loadingIcon from "../imgs/loading.gif";
import httpCallers from "../service";

export default function Login(props: { shouldShowSignup?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  const navigate = useNavigate();

  const { triggerToast } = useToaster({ type: "error" });

  const submitCallback = (event: SyntheticEvent<any>) => {
    event.preventDefault();
    setAuthenticating(true);

    async function validateCredentials() {
      try {
        const { data } = await httpCallers.post("users/authenticate", {
          email,
          password,
        });

        localStorage.setItem("userId", data.id);

        navigate("/dashboard");
      } catch (err) {
        setEmail("");
        setPassword("");

        triggerToast(
          err.response?.data?.message ||
            "An error occurred while logging in. Please try again."
        );
      } finally {
        setAuthenticating(false);
      }
    }

    validateCredentials();
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      navigate(`/dashboard`);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <main className="loginWrapper">
        {
          <p>
            <TypeAnimation
              sequence={[
                "I'm here to help you transcribe interviews effortlessly",
                5000,
                "I'm here to help you manage interview scripts seamlessly",
                5000,
                "I'm here to help you organize interview notes efficiently",
                5000,
                "I'm here to help you streamline your interview workflow",
                5000,
              ]}
              speed={70}
              wrapper="span"
              repeat={Infinity}
            />
          </p>
        }
        <form className="loginContainer" onSubmit={submitCallback}>
          <div className="fieldWrapper">
            <InputLabel htmlFor="email" style={{ width: 100 }}>
              E-mail
            </InputLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={authenticating}
              fullWidth
              style={{ padding: "0px 8px" }}
            />
          </div>
          <div className="fieldWrapper">
            <InputLabel htmlFor="password" style={{ width: 125 }}>
              Password
            </InputLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={authenticating}
              fullWidth
              style={{ padding: "0px 8px" }}
            />
          </div>
          {authenticating ? (
            <img src={loadingIcon} width={30} />
          ) : (
            <Button
              type="submit"
              disabled={!email || !password}
              variant="contained"
            >
              Login
            </Button>
          )}
          {props.shouldShowSignup && (
            <div
              style={{
                marginTop: 16,
                fontSize: 12,
                width: "100%",
                textAlign: "center",
              }}
            >
              <hr style={{ width: "100%" }} />
              <span>No account?</span> <Link to="/signup">Click here!</Link>
            </div>
          )}
        </form>
      </main>
    </>
  );
}
