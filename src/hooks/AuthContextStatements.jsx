import { createContext, useContext, useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  Timestamp,
  writeBatch,
  query,
  where,
  getDoc,
  getCountFromServer
} from "firebase/firestore";
import { app } from "../app/firebase";
import { async } from "@firebase/util";
import { useAuth } from "../context/AuthContext";

export const authcontext = createContext();

export const useAuthStatement = () => {
  const context = useContext(authcontext);
  return context;
};

const db = getFirestore(app);

export function AuthProviderDeclaraciones({ children }) {

  const { usere } = useAuth()
  const [statements, setStatements] = useState([]);
  const [statementsByEtapa, setStatementByEtapa] = useState([]);
  const [corrientes, setCorrientes] = useState([])
  const [corriente, setCorriente] = useState([])
  const [error, setError] = useState();
  const [waste, setWaste] = useState([]);
  const [loading, setLoading] = useState({});
  const batch = writeBatch(db);

  useEffect(() => {
    getWaste()
  }, []);

  const getStatements = async (uid, rol) => {
    let querySnapshot = ""

    try {
      if (rol === "Generador") {
        const q = query(collection(db, "declaraciones"), where("id_generador", "==", uid));
        querySnapshot = await getDocs(q)
      } else {
        querySnapshot = await getDocs(collection(db, "declaraciones"));
      }

      const dataDB = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("DATADB", dataDB);
      dataDB.map((item, index) => {
        const id = item.id
        const filteredWaste = waste.filter((item) => item.id.includes(id));
        dataDB[index].residuos = filteredWaste
      })
      setStatements(dataDB);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const getStatementsByEtapa = async (etapa) => {
    //getWaste()
    setStatementByEtapa(...[]);
    try {
      const q = query(collection(db, "declaraciones"), where("etapa", "==", etapa));
      const querySnapshot = await getDocs(q)
      // const dataDB = querySnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // dataDB.map((item, index) => {
      //   const id = item.id
      //   const filteredWaste = waste.filter((item) => item.id.includes(id));
      //   dataDB[index].residuos = filteredWaste
      // })
      const promises = querySnapshot.docs.map(async (doc) => {
        const id = doc.id;
        const itemData = doc.data();
        const filteredWaste = waste.filter((item) => item.id.includes(id)); // Implementa getFilteredWaste según tus necesidades
        return {
          id,
          ...itemData,
          residuos: filteredWaste,
        };
      });
      const dataDB = await Promise.all(promises)
      console.log(dataDB);
      setStatementByEtapa(dataDB);

    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }

  const getStatementsByUSer = async (id) => {
    try {
      const q = query(collection(db, "declaraciones"), where("id_generador", "==", id));
      const querySnapshot = await getDocs(q)
      const dataDB = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStatements(dataDB);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }

  const addStatements = async (data) => {
    try {
      console.log("ADD STATEMENT:");
      console.log(data.residuos);
      const docRef = doc(collection(db, "declaraciones"));
      const dataRes = data.residuos.map((item,index)=>({id:docRef.id+index, ...item }))
      const arrResiduos = data.residuos.map((item,index)=>(item))
      
      let arr = []

      const newDoc = {
        etapa: 1,
        id_generador: data.idGenerador,
        id_laboratorio: data.laboratorio,
        responsableEntrega: data.responsableEntrega,
        fecha_creacion: Timestamp.fromDate(new Date(data.fechaCreacion)),
        fecha_revision: null,
        fecha_recepcion: null,
        residuos: data.residuos.map((item, index) => (docRef.id + index)),
        fecha_verificacion: null,
        fecha_finalizacion: null,
      };

      const newDocCopy = {
        id: docRef.id,
        etapa: 1,
        id_generador: data.idGenerador,
        id_laboratorio: data.laboratorio,
        responsableEntrega: data.responsableEntrega,
        fecha_creacion: Timestamp.fromDate(new Date(data.fechaCreacion)),
        fecha_revision: null,
        fecha_recepcion: null,
        residuos: dataRes,
        fecha_verificacion: null,
        fecha_finalizacion: null,
      }

      console.log("newDocCopy\n", newDocCopy);
      // newDoc.residuos.map((item, index) => {
      //   // arr.push({id: docRef.id + index, ...item})
      //   //newDocCopy.residuos[index] = {...newDocCopy.residuos[index], id: docRef.id + index}
      //   newDoc.residuos[index] = docRef.id + index
      //   const array = [...arrResiduos];
      //   array[index].id_declaracion = docRef.id;
      //   array[index].comentario_revision = "";
      //   array[index].comentario_recepcion = "";
      //   array[index].revisado = null;
      //   array[index].recibido = null;
      //   array[index].tratamiento = "";
      //   array[index].destino = "";
      // });


      await setDoc(docRef, newDoc).then(async (doc) => {
        console.log("newCopu\n", newDocCopy);
        await addWaste(docRef.id, arrResiduos);
        console.log("EXITOSOO");
        setStatements([...statements, newDocCopy])
        
        // getWaste()
        // getStatements(usere.id, usere.rol)
      });
      //await addWaste(newDoc.residuos, docRef);
    } catch (error) {
      setError(error.message);
    }
  };

  const addWaste = async (idDeclaracion, r) => {
    console.log("TODO MEEELOO")
    try {
      const collectionRef = collection(db, "residuos");
      let res = []
      for (let index = 0; index < r.length; index++) {
        const docRef = doc(collectionRef, idDeclaracion + index);
        const newRes = {
          ...r[index],
          id_declaracion: idDeclaracion,
          comentario_revision: "",
          comentario_recepcion: "",
          revisado: null,
          recibido: null,
          tratamiento: "",
          destino: ""
        }
        await setDoc(docRef, newRes)
        res.push({id: idDeclaracion + index, ...newRes})
        if(index == r.length-1){
          setWaste([...waste, ...res])
        }
      }
      // getWaste()
      // getStatements(usere.id, usere.rol)
    } catch (error) {
      setError(error.message);
    }
  };

  const updateStatement = () => {
    try {

    } catch (error) { }
  };

  const deleteStatement = async (statement) => {
    try {
      console.log("RESIUDOOOOS\n", statement.residuos);
      const res = statement.residuos.map((item, index) => item.id)
      const docRef = doc(db, "declaraciones", statement.id);
      await deleteDoc(docRef).then(async (doc) => {
        await deleteWaste(res)
      })
      setStatements(statements.filter(item => item.id !== statement.id))
    } catch (error) {
      setError(error.message);
    }
  };

  const getWaste = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "residuos"));
      const dataDB = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setWaste(dataDB);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }

  };

  const updateWaste = async (data) => {
    const documentRef = doc(db, "residuos", data.id);

    try {
      await updateDoc(documentRef, data);
      console.log('Documento actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el documento:', error);
    }
  }

  const deleteWaste = async (res) => {
    console.log(res);
    try {
      for (let index = 0; index < res.length; index++) {
        const docRef = doc(db, "residuos", res[index]);
        await deleteDoc(docRef)
        setWaste(waste.filter(item => item.id !== res[index]))
      }
    } catch (error) {

    }
  }

  const getCorrientes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "corrientes"));
      const dataDB = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(dataDB);

      setCorrientes(dataDB.sort((a, b) => a.tipo - b.tipo));
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const getCorrienteById = async (id) => {
    try {
      const q = doc(db, "corrientes", id);
      const querySnapshot = await getDoc(q)
      const dataDB = querySnapshot.data()
      console.log(dataDB);
      setCorriente(dataDB)
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }

  return (
    <authcontext.Provider value={{ getStatements, statements, addStatements, addWaste, updateWaste, getWaste, waste, deleteStatement, getStatementsByEtapa, statementsByEtapa, getCorrientes, corrientes, corriente, getCorrienteById, getStatementsByUSer }}>
      {children}
    </authcontext.Provider>
  );
}

/*

const addStatements2 = async (data) => {

    try {
      console.log("ADD STATEMENT:");
      console.log(data.residuos);
      const newDoc = {
        etapa: 1,
        id_generador: data.idGenerador,
        id_laboratorio: data.laboratorio,
        fecha_creacion: Timestamp.fromDate(new Date(data.fechaCreacion)),
        fecha_recepcion: null,
        residuos: data.residuos,
        fecha_verificacion: null,
        fecha_finalizacion: null,
      };
      //const docRef = await addDoc(collection(db, "declaraciones"), newDoc)
      const docRef = doc(collection(db, "declaraciones"));

      newDoc.residuos.map((item, index) => {
        const array = [...newDoc.residuos];
        array[index].id_declaracion = docRef.id;
        array[index].comentario_revision = "";
        array[index].comentario_recepcion = "";
        array[index].revisado = null;
        array[index].recibido = null;
      });

      console.log(newDoc);
      console.log("REFERENCIA: ", docRef.id);

      await setDoc(docRef, newDoc).then((doc) => {
        addWaste(newDoc.residuos);
        console.log("EXITOSOO");
      });
      //await addWaste(newDoc.residuos, docRef);
    } catch (error) {
      setError(error.message);
    }
  };

const addWaste2 = async (r) => {
    try {
      const collectionRef = collection(db, "residuos");

      r.forEach((documento, index) => {
        const docRef = doc(collectionRef, documento.id_declaracion + index);
        batch.set(docRef, { documento });
      });

      batch.commit().then(() => {
        alert("EXITOSO");
        getStatements();
      })
        .catch((error) => {
          console.error("Error al guardar en la base de datos:", error);
        });
    } catch (error) {
      setError(error.message);
    }
  };
*/