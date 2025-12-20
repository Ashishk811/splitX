import { useState } from "react";
import { api } from "../api";
import { setToken } from "../auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthPage() {
  const nav = useNavigate();

  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);

  async function doSignup() {
    let d = await api("/api/users/signup", "POST", signup);
    toast.success(d.message || "Signup successful!");
    setMode("login");
  }

  async function doLogin() {
    let d = await api("/api/users/login", "POST", login);
    if (d.token) {
      setToken(d.token);
      toast.success("Welcome!");
      nav("/dashboard");
    } else toast.error("Invalid login");
  }

  return (
    <div className="page d-flex justify-content-center align-items-center">
      <div className="card p-5" style={{ width: 400 }}>
        <h2 className="text-neon mb-4">
          {mode === "login" ? "🔐 Login" : "📝 Signup"}
        </h2>

        {mode === "signup" ? (
          <>
            <input
              className="form-control neon-placeholder mb-3"
              placeholder="Enter Name"
              value={signup.name}
              onChange={(e) => setSignup({ ...signup, name: e.target.value })}
            />
            <input
              className="form-control neon-placeholder mb-3"
              placeholder="Enter Email"
              value={signup.email}
              onChange={(e) => setSignup({ ...signup, email: e.target.value })}
            />
            <input
              className="form-control neon-placeholder mb-3"
              placeholder="Enter Phone"
              value={signup.phone}
              onChange={(e) => setSignup({ ...signup, phone: e.target.value })}
            />

            <div className="input-group mb-4">
              <input
                type={showPass ? "text" : "password"}
                className="form-control neon-placeholder"
                placeholder="Create Password"
                value={signup.password}
                onChange={(e) =>
                  setSignup({ ...signup, password: e.target.value })
                }
              />
              <span
                className="input-group-text neon-placeholder"
                role="button"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="btn btn-success w-100 mb-3" onClick={doSignup}>
              Sign Up
            </button>

            <div className="text-muted">
              Already have an account?{" "}
              <span
                className="text-neon"
                role="button"
                onClick={() => setMode("login")}
              >
                Login here
              </span>
            </div>
          </>
        ) : (
          <>
            <input
              className="form-control neon-placeholder mb-3"
              placeholder="Enter Email"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />

            <div className="input-group mb-4">
              <input
                type={showPass ? "text" : "password"}
                className="form-control neon-placeholder"
                placeholder="Enter Password"
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
              />
              <span
                className="input-group-text neon-placeholder"
                role="button"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="btn btn-primary w-100 mb-3" onClick={doLogin}>
              Login
            </button>

            <div className="text-muted">
              New user?{" "}
              <span
                className="text-neon"
                role="button"
                onClick={() => setMode("signup")}
              >
                Signup here
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
