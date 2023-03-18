import React, { useState } from "react";
import { app } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Swal from "sweetalert2";



const auth = getAuth(app);

export const Login = () => {
  const [registro, setRegistro] = useState(false);
  const [error, setError] = useState();

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contraseña = e.target.contraseña.value;

    if (registro) {
      try {
        await createUserWithEmailAndPassword(auth, correo, contraseña);
      } catch (error) {
        console.log(error.code);
        if (error.code === "auth/weak-password") {
          setError(
            Swal.fire(
              "auth/weak-password",
              "very short password, must have more than 6 characters",
              "warning"
            )
          );
        }
        if (error.code === "auth/email-already-in-use") {
          setError(
            Swal.fire(
              "auth/email-already-in-use",
              "the added email is already in use",
              "warning"
            )
          );
        }
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, contraseña);
      } catch (error) {
        console.log(error.code);
        if (error.code === "auth/wrong-password") {
          Swal.fire("auth/wrong-password", "Incorrect password", "error");
        }
        if (error.code === "auth/user-not-found") {
          setError(
            Swal.fire(
              "auth/user-not-found",
              "email not found, check again, or create an account",
              "error"
            )
          );
        }
      }
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark" data-testid="barra-nav">
        <a className="navbar-brand" data-testid="palabra">
          Notes Blog
        </a>
        <form className="form-inline">
          <button
            className="btn btn-outline-primary my-2 my-sm-0"
            onClick={(e) => {
              e.preventDefault();
              setRegistro(!registro);
            }}
            data-testid="boton"
          >
            {registro
              ? "do you already have an account? login"
              : "You do not have an account? Signup"}
          </button>
        </form>
      </nav>

      {/* formulario */}

      <div className="container">
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="form-group">
                <h1 id="login">{registro ? "Signup" : " Login"}</h1>
                <form onSubmit={handlerSubmit} data-testid="formulario">
                  <label htmlFor="email" id="correos" data-testid="palabra2">
                    Email:
                  </label>
                  <br />
                  <input
                    className="form-control text-center"
                    type="email"
                    placeholder="Email"
                    id="email"
                    required
                  />
                  <br />
                  <label htmlFor="password" id="contra">
                    Password:
                  </label>
                  <br />
                  <input
                    className="form-control text-center"
                    type="password"
                    placeholder="*******"
                    id="contraseña"
                    required
                  />
                  <br />
                  <button className="btn btn-primary">
                    {registro ? "Create Account" : "login"}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    </div>
  );
};
