import { useState } from "react";
import API from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const sendOtp = async () => {
    try {
      if (!email.trim()) {
        alert("Please enter email");
        return;
      }

      const res = await API.post("/forgot-password/send-otp", {
        email: email.trim()
      });

      alert(res.data);
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      alert("Email not found or OTP send failed");
    }
  };

  const verifyOtp = async () => {
    try {
      if (!otp.trim()) {
        alert("Please enter OTP");
        return;
      }

      const res = await API.post("/forgot-password/verify-otp", {
        email: email.trim(),
        otp: otp.trim()
      });

      alert(res.data);

      if (res.data.toLowerCase().includes("verified")) {
        setOtpVerified(true);
      }
    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
    }
  };

  const resetPassword = async () => {
    try {
      if (!newPassword.trim()) {
        alert("Please enter new password");
        return;
      }

      const res = await API.post("/forgot-password/reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim()
      });

      alert(res.data);

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Password Reset Failed");
    }
  };

  return (
    <div className="container">
      <h1> Forgot Password</h1>

      <input
        type="email"
        placeholder="Enter registered email"
        value={email}
        disabled={otpSent}
        onChange={(e) => setEmail(e.target.value)}
      />

      {!otpSent && (
        <button onClick={sendOtp}>
          Send OTP
        </button>
      )}

      {otpSent && !otpVerified && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button onClick={verifyOtp}>
            Verify OTP
          </button>

          <button
            style={{ marginLeft: "10px", background: "#64748b" }}
            onClick={() => {
              setOtpSent(false);
              setOtp("");
            }}
          >
            Change Email
          </button>
        </>
      )}

      {otpVerified && (
        <>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button onClick={resetPassword}>
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;