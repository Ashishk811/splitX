import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";


const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();
  const navigate = useNavigate();
  

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:5000/api/user/verify/${param.id}/${param.token}`;
        const { data } = await axios.get(url);
        console.log(data);
        setValidUrl(true);

        // Auto redirect after 3 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);

      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param, navigate]);

  return (
    <div>
      {validUrl ? (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f6fff8",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <style>{`
        .checkmark {
          width: 100px;
          height: 100px;
          stroke-width: 3;
          stroke: #4caf50;
          stroke-miterlimit: 10;
          animation: scaleUp 0.3s ease-in-out;
        }
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 3;
          stroke: #4caf50;
          fill: none;
          animation: strokeCircle 0.6s forwards;
        }
        .checkmark-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke-width: 3;
          stroke: #4caf50;
          fill: none;
          animation: strokeCheck 0.4s 0.6s forwards;
        }
        @keyframes strokeCircle {
          100% { stroke-dashoffset: 0; }
        }
        @keyframes strokeCheck {
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scaleUp {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .login-btn {
          background: #4caf50;
          color: white;
          padding: 10px 20px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s ease-in-out;
        }
        .login-btn:hover {
          background: #43a047;
        }
      `}</style>

          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14 27l7 7 16-16"
            />
          </svg>

          <h1 style={{ marginTop: "20px", color: "#333" }}>
            Email verified successfully 🎉
          </h1>

          <p style={{ marginTop: "5px", color: "#777" }}>
            Redirecting you to dashboard...
          </p>

          <Link to="/dashboard">
            <button className="login-btn" style={{ marginTop: "15px" }}>
              Go Now
            </button>
          </Link>
        </div>
      ) : (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff0f0",
            fontFamily: "Arial, sans-serif",
            color: "#c0392b",
          }}
        >
          <h1>❌ 404 Not Found</h1>
          <p>Invalid or expired verification link</p>

          <Link to="/login">
            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#c0392b",
                color: "white",
                borderRadius: "50px",
                border: "none",
              }}
            >
              Back to Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmailVerify;
