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
        <h2 className="text-center">Iniciar sesión como Ranger</h2>
        <p className="text-center text-muted">
        Solo se admite el inicio de sesión por correo electrónico o Google.
        </p>

        <form>
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input type="text" placeholder="Teléfono / Email " />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input type="password" placeholder="Contraseña" />
          </div>

          <div className="terms">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
            Confirmo que he leído, doy mi consentimiento y acepto los 
              <a href="#"> Términos de Uso</a> y la <a href="#">Política de privacidad</a>.
            </label>
          </div>

          <button className="btn btn-login">Inciar Sesión</button>

          <div className="extra-links">
            <Link to="#">Olvidaste tu contraseña?</Link>
            <Link to="/signup">Regístrate</Link> {/* REDIRECCIONA AL SIGN UP */}
          </div>

          <div className="separator"><span></span></div>

          <div className="social-login">
            <button className="btn btn-google">
              <FontAwesomeIcon icon={faGoogle} /> Inicia sesión con Google
            </button>
           {/* <button className="btn btn-facebook">
              <FontAwesomeIcon icon={faFacebook} /> Log in with Facebook
            </button>*/}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;