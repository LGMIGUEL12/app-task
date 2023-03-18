import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

export const Home = ({ correoUsuario }) => {
  const valorInicial = {
    titulo: "",
    descripcion: "",
  };
  //    variables de estado
  const [user, setUser] = useState(valorInicial);
  const [lista, setLista] = useState([]);
  const [subId, setSubId] = useState("");

  //  funcion para capturar inputs
  const capturarInputs = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  //  funcion para guardar o actualizar datos
  const guardarDatos = async (e) => {
    e.preventDefault();
    // console.log(user);

    if (subId === "") {
      try {
        await addDoc(collection(db, `${correoUsuario}`), {
          ...user,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      await setDoc(doc(db, `${correoUsuario}`, subId), { ...user });
    }

    setUser({ ...valorInicial });
    setSubId("");
    getLista();
  };

  const getLista = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, `${correoUsuario}`));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setLista(docs);
    } catch (error) {
      console.log(error);
    }
  };
  //  funcion para renderixar lista de usuarios
  useEffect(() => {
    getLista();
  }, []);

  //  funcion eliminar tarea
  const deleteUser = async (id) => {
    await deleteDoc(doc(db, `${correoUsuario}`, id));
    getLista();
  };

  const getOne = async (id) => {
    try {
      const docRef = doc(db, `${correoUsuario}`, id);
      const docSnap = await getDoc(docRef);
      setUser(docSnap.data());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (subId !== "") {
      getOne(subId);
    }
  }, [subId]);

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand" data-testid="palabra">
          Notes Blog
        </a>
        <div className="navbar-brand">
          <i className="material-icons">account_circle</i>
          <strong>{correoUsuario}</strong>
        </div>
        <form className="form-inline">
          <button
            className="btn btn-outline-primary my-2 my-sm-0"
            onClick={() => {
              signOut(auth);
            }}
          >
            Sign Out
          </button>
        </form>
      </nav>
      <br />
      <div className="container" data-testid="creador-tareas">
        <div className="row">
          <div className="  col-md-3">
            <h3 id="titulo" data-testid="palabra2">
              Create Task
            </h3>
            <form onSubmit={guardarDatos}>
              <label id="titulo2">Task Title:</label>
              <br />
              <input
                className="form-control"
                type="text"
                placeholder="task name"
                name="titulo"
                onChange={capturarInputs}
                value={user.titulo}
              />
              <br />
              <label id="descripcion">Task Description:</label>
              <br />
              <textarea
                rows="4"
                className="form-control"
                type="text"
                placeholder="What should you do?"
                name="descripcion"
                onChange={capturarInputs}
                value={user.descripcion}
              />
              <br />
              <button className="btn btn-primary">
                {subId === "" ? "Save" : "To Update"}
              </button>
            </form>
          </div>
          <div className="col-md-3"></div>
          <div className="col-md-5" data-testid="mostrar-tareas">
            <h1 className="text-center">
              <u id="tareas">Task To Do</u>
            </h1>
            <div className="container card">
              <div className="card-body">
                {lista.map((list) => (
                  <div key={list.id}>
                    <h2 id="titu">{list.titulo}</h2>
                    <p id="descrip"> {list.descripcion}</p>
                    <div>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setSubId(list.id);
                        }}
                        data-testid="boton"
                      >
                        <i className="material-icons">edit</i>
                      </button>
                      <button
                        className="btn btn-secondary m-1"
                        onClick={() => {
                          deleteUser(list.id);
                        }}
                        data-testid="boton"
                      >
                        <i className="material-icons">delete</i>
                      </button>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
