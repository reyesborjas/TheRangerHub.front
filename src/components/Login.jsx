import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import "../styles/Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center">Login to Ranger</h2>
        <p className="text-center text-muted">
          Only login via email, Google, or Facebook is supported.
        </p>

        <form>
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input type="text" placeholder="Phone number / email address" />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input type="password" placeholder="Password" />
          </div>

          <div className="terms">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              I confirm that I have read, consent and agree to 
              <a href="#"> Terms of Use</a> and <a href="#">Privacy Policy</a>.
            </label>
          </div>

          <button className="btn btn-login">Log In</button>

          <div className="extra-links">
            <Link to="#">Forgot password?</Link>
            <Link to="/signup">Sign up</Link> {/* REDIRECCIONA AL SIGN UP */}
          </div>

          <div className="separator"><span>OR</span></div>

          <div className="social-login">
            <button className="btn btn-google">
              <FontAwesomeIcon icon={faGoogle} /> Log in with Google
            </button>
            <button className="btn btn-facebook">
              <FontAwesomeIcon icon={faFacebook} /> Log in with Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;