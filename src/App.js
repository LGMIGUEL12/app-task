import React, { useState } from "react";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { app } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(app);

function App() {
  const [usuario, setUsuario] = useState(null);

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      setUsuario(usuarioFirebase);
    } else {
      setUsuario(null);
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        {usuario ? <Home correoUsuario={usuario.email} /> : <Login />}
      </header>
    </div>
  );
}

export default App;