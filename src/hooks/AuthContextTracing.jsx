import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { app } from "../app/firebase";
import { useAuthStatement } from "./AuthContextStatements";

export const authcontext = createContext();

export const useAuthTracing = () => {
  const context = useContext(authcontext);
  return context;
};

const db = getFirestore(app);

export function AuthProviderTracing({ children }) {
  const [statements, setStatements] = useState([]);
  const [error, setError] = useState();
  const [waste, setWaste] = useState([]);
  const [revisionesResiduos, setRevisionesResiduos] = useState([]);
  const [recepcionesResiduos, setRecepcionesResiduos] = useState([]);
  const [loading, setLoading] = useState({});
  const batch = writeBatch(db);
  const { getStatementsByEtapa, updateWaste, getWaste } = useAuthStatement();

  useEffect(() => {
    //getStatements();
  }, []);

  const pruebaRecepcion = async (data, fecha, etapa, idEvent) => {
    console.log("ENTREEE");
    try {
      const newReception = {
        id_declaracion: data.id,
        id_event_verificacion: idEvent
      }
      const docRef = doc(collection(db, "recepcionResiduos"))
      await setDoc(docRef, newReception).then(doc => {
        console.log(doc);
        console.log("SDSDDDDDDDDD\n", recepcionesResiduos);
        const rev = {
          id: docRef.id,
          id_declaracion: data.id,
          id_event_verificacion: idEvent
        }
        setRecepcionesResiduos([...recepcionesResiduos, rev])
        getRecepcionResiduos()
        // console.log(revisionesResiduos[0].id_event_verificacion);
      });

      const newDoc = {
        etapa: 4,
        fecha_recepcion: Timestamp.fromDate(new Date(fecha))
      }
      const documentRef = doc(db, "declaraciones", data.id);
      await updateDoc(documentRef, newDoc).then(doc => {
        getStatementsByEtapa(etapa)
      })

    } catch (error) {
      console.log(error);
    }
  }

  const addVerification = async (data) => {

    const newDoc = {
      etapa: data.etapa + 1,
      fecha_verificacion: Timestamp.fromDate(new Date())
    };

    const documentRef = doc(db, "declaraciones", data.idDeclaracion);

    await updateDoc(documentRef, newDoc).then(async (doc) => {
      console.log("UPDATE DECLARACIÓN EXITOSOO");
      await updateWasteVerification(data.residuos)
      getStatementsByEtapa(data.etapa)
    });
  }

  const addReception = async (data) => {

    const newDoc = {
      etapa: data.etapa + 1,
      fecha_recepcion: Timestamp.fromDate(new Date()),
      fecha_finalizacion: Timestamp.fromDate(new Date())
    };

    const documentRef = doc(db, "declaraciones", data.idDeclaracion);

    await updateDoc(documentRef, newDoc).then(async (doc) => {
      console.log("UPDATE DECLARACIÓN EXITOSOO");
      await updateWasteReception(data.residuos)
      getStatementsByEtapa(data.etapa)
    });
  }

  const updateWasteVerification = async (arrWaste) => {

    arrWaste.map((item) => {
      const newDoc = {
        cantidadGenerada: item.cantidadGenerada,
        destino: item.destino,
        tratamiento: item.tratamiento,
        corriente: item.corriente,
        comentario_revision: item.comentario_revision,
        revisado: item.revisado,
      };

      const documentRef = doc(db, "residuos", item.idResiduo);
      updateDoc(documentRef, newDoc).then((doc) => {
        console.log("UPDATE RESIDUO EXITOSOO");
        getWaste()
      });
    })
  }

  const updateWasteReception = async (arrWaste) => {

    arrWaste.map((item) => {
      const newDoc = {
        cantidadGenerada: item.cantidadGenerada,
        destino: item.destino,
        tratamiento: item.tratamiento,
        corriente: item.corriente,
        comentario_recepcion: item.comentario_recepcion,
        recibido: item.recibido,
      };

      const documentRef = doc(db, "residuos", item.idResiduo);
      updateDoc(documentRef, newDoc).then((doc) => {
        getWaste()
      });
    })
  }

  const addVerificationSchedule = async (id, idEvent) => {
    try {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaa");
      // const newDoc = {
      //   id_declaracion: data.idDeclaracion,
      //   id_residuo: data.idResiduo,
      //   cantidadGenerada: data.cantidadGenerada,
      //   destino: data.destino,
      //   tratamiento: data.tratamiento,
      //   recepcion: Timestamp.fromDate(new Date(data.fechaRevision)),
      //   corriente: data.corriente,
      //   comentarios: data.comentarios,
      //   revisado: data.revisado
      // };
      const newDoc = {
        id_declaracion: id,
        id_event_verificacion: idEvent
      }
      const docRef = doc(collection(db, "revisionResiduos"))
      await setDoc(docRef, newDoc).then(doc => {
        console.log(doc);
        console.log("SDSDDDDDDDDD\n", revisionesResiduos);
        const rev = {
          id: docRef.id,
          id_declaracion: id,
          id_event_verificacion: idEvent
        }
        setRevisionesResiduos([...revisionesResiduos, rev])
        // console.log(revisionesResiduos[0].id_event_verificacion);
      });

      // const documentRef = doc(db, "residuos", data.idResiduo);


      // await updateDoc(documentRef, { cantidadGenerada: data.cantidadGenerada }).then((doc) => {
      //   console.log("UPDATE EXITOSOO");
      // });


    } catch (error) {
      setError(error.message)
    }

  }

  const addReceptionSchedule = async (id, idEvent) => {
    try {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaa");
      // const newDoc = {
      //   id_declaracion: data.idDeclaracion,
      //   id_residuo: data.idResiduo,
      //   cantidadGenerada: data.cantidadGenerada,
      //   destino: data.destino,
      //   tratamiento: data.tratamiento,
      //   recepcion: Timestamp.fromDate(new Date(data.fechaRevision)),
      //   corriente: data.corriente,
      //   comentarios: data.comentarios,
      //   revisado: data.revisado
      // };
      const newDoc = {
        id_declaracion: id,
        id_event_verificacion: idEvent
      }
      const docRef = doc(collection(db, "recepcionResiduos"))
      await setDoc(docRef, newDoc).then(doc => {
        console.log(doc);
        console.log("SDSDDDDDDDDD\n", recepcionesResiduos);
        const rev = {
          id: docRef.id,
          id_declaracion: id,
          id_event_verificacion: idEvent
        }
        setRecepcionesResiduos([...recepcionesResiduos, rev])
        getRecepcionResiduos()
        // console.log(revisionesResiduos[0].id_event_verificacion);
      });

      // const documentRef = doc(db, "residuos", data.idResiduo);


      // await updateDoc(documentRef, { cantidadGenerada: data.cantidadGenerada }).then((doc) => {
      //   console.log("UPDATE EXITOSOO");
      // });


    } catch (error) {
      setError(error.message)
    }

  }

  const updateFechaVerificacion = async (id, etapa, fechaVerificacion, idEvent) => {

    try {
      const docRef = doc(db, "declaraciones", id);
      await updateDoc(docRef, {
        etapa: etapa,
        fecha_verificacion: Timestamp.fromDate(new Date(fechaVerificacion))
      }).then(async (doc) => {
        await addVerificationSchedule(id, idEvent)
        getStatementsByEtapa(etapa - 1)
      })
    } catch (error) {
      setError(error.message);
    }
  };

  const updateFechaRecepcion = async (id, etapa, fechaRecepcion, idEvent) => {

    try {
      const docRef = doc(db, "declaraciones", id);
      await updateDoc(docRef, {
        etapa: etapa,
        fecha_recepcion: Timestamp.fromDate(new Date(fechaRecepcion))
      }).then(async (doc) => {
        await addReceptionSchedule(id, idEvent)
        getStatementsByEtapa(etapa - 1)
      })
    } catch (error) {
      setError(error.message);
    }
  };

  const getRevisionResiduos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "revisionResiduos"));
      const dataDB = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setRevisionesResiduos(dataDB);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }

  const getRecepcionResiduos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recepcionResiduos"));
      const dataDB = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setRecepcionesResiduos(dataDB);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }

  const cancelarEvento = async (idDeclaracion, idRevision, etapa, idEvent) => {
    try {
      const docRef = doc(db, "declaraciones", idDeclaracion);
      let docRefRe = ''
      let newDoc = {}

      if (etapa == 2) {
        docRefRe = doc(db, "revisionResiduos", idRevision);
        newDoc = {
          etapa: etapa - 1,
          fecha_verificacion: null
        }
      }
      else {
        docRefRe = doc(db, "recepcionResiduos", idRevision);
        newDoc = {
          etapa: etapa - 1,
          fecha_recepcion: null
        }
      }
      //const docRefRev = doc(db, "revisionResiduos", statement.id);
      //const q = query(collection(db, "revisionResiduos"), where("id_event_verificacion", "==", idEvent));
      await updateDoc(docRef, newDoc).then(async (doc) => {
        await deleteDoc(docRefRe).then(async (doc) => {
          if (etapa == 2) {
            console.log("revisivión eliminada");
            setRevisionesResiduos(revisionesResiduos.filter(item => item.id_event_verificacion !== revisionesResiduos.id_event_verificacion))
          } else {
            console.log("recepción eliminada");
            setRecepcionesResiduos(recepcionesResiduos.filter(item => item.id_event_verificacion !== recepcionesResiduos.id_event_verificacion))
          }
          getStatementsByEtapa(etapa)
        })
      })
    } catch (error) {
      setError(error.message);
    }
  }

  const multipleReception = async (data) => {
    for (let i = 0; i < data.length; i++) {
      
      const decRef = doc(db, "declaraciones", data[i].id);
      batch.update(decRef, { etapa: 5, fecha_recepcion: Timestamp.fromDate(new Date())})

      for (let j = 0; j < data[i].residuos.length; j++) {
        const id = data[i].residuos[j].id
        const ref = doc(db, "residuos", id);
        batch.update(ref, { recibido: true })
      }
    }

    await batch.commit().then(res => {
      getStatementsByEtapa(4)
      getWaste()
    })
  }

  return (
    <authcontext.Provider value={{
      statements, addVerificationSchedule, addVerification, addReception, addReceptionSchedule,
      updateFechaVerificacion, updateFechaRecepcion, getRevisionResiduos,
      getRecepcionResiduos, revisionesResiduos, recepcionesResiduos, cancelarEvento, pruebaRecepcion,
      multipleReception
    }}>
      {children}
    </authcontext.Provider>
  );
}

// const addCorrientes = async (index) => {
//   try {
//     //const docRef = await addDoc(collection(db, "declaraciones"), newDoc)
//     const docRef = doc(collection(db, "corrientes"));

//       await setDoc(docRef, corrientes[index]).then((doc) => {
//         console.log("EXITOSOO");
//       });

//   } catch (error) {
//     setError(error.message);
//   }
// };

/*
const corrientes = [
  {
    tipo: 1,
    clasificacionBasilea: 'A4130',
    clasfRes11642002: 'Reactivos',
    proceso: 'Aprovechamiento',
    descripcionProceso: 'Lavado y trituración y posterior entrega a gestor para fundición y reutilización.'
  },
  {
    tipo: 2,
    clasificacionBasilea: 'A4130',
    clasfRes11642002: 'Reactivos',
    proceso: 'Aprovechamiento',
    descripcionProceso: 'Lavado y trituración y posterior entrega a gestor para fundición y reutilización.'
  },
  {
    tipo: 3,
    clasificacionBasilea: 'Y29',
    clasfRes11642002: 'Metales pesados',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 4,
    clasificacionBasilea: 'Y29',
    clasfRes11642002: 'Metales pesados',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 5,
    clasificacionBasilea: 'A1010',
    clasfRes11642002: 'Metales pesados',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 6,
    clasificacionBasilea: 'A1010',
    clasfRes11642002: 'Metales pesados',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 7,
    clasificacionBasilea: 'Y13',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 8,
    clasificacionBasilea: 'Y15',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 9,
    clasificacionBasilea: 'Y40',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición por proceso de incineración o celda de seguridad.'
  },
  {
    tipo: 10,
    clasificacionBasilea: 'Y45',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición por proceso de incineración o celda de seguridad según composición química.'
  },
  {
    tipo: 11,
    clasificacionBasilea: 'A2',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 12,
    clasificacionBasilea: 'A3',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 13,
    clasificacionBasilea: 'A4140',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 14,
    clasificacionBasilea: 'Y15',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 15,
    clasificacionBasilea: 'A3170',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición por proceso de incineración o celda de seguridad según composición química.'
  },
  {
    tipo: 16,
    clasificacionBasilea: 'Y45',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición por proceso de incineración o celda de seguridad según composición química.'
  },
  {
    tipo: 17,
    clasificacionBasilea: 'Y4',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 18,
    clasificacionBasilea: 'Y29',
    clasfRes11642002: 'Metales pesados',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 19,
    clasificacionBasilea: 'B3010',
    clasfRes11642002: 'Metales pesados',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 20,
    clasificacionBasilea: 'A1010',
    clasfRes11642002: 'Metales pesados',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 21,
    clasificacionBasilea: 'A4050',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 22,
    clasificacionBasilea: 'Y34',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de neutralización e incineración.'
  },
  {
    tipo: 23,
    clasificacionBasilea: 'Y34',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de neutralización e incineración.'
  },
  {
    tipo: 24,
    clasificacionBasilea: 'Y34',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de neutralización e incineración.'
  },
  {
    tipo: 25,
    clasificacionBasilea: 'Y34',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de neutralización e incineración.'
  },
  {
    tipo: 26,
    clasificacionBasilea: 'Y35',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de neutralización y celda de seguridad.'
  },
  {
    tipo: 27,
    clasificacionBasilea: 'Y35',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de neutralización e incineración.'
  },
  {
    tipo: 28,
    clasificacionBasilea: 'Y35',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 29,
    clasificacionBasilea: 'Y34',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 30,
    clasificacionBasilea: 'Y35',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 31,
    clasificacionBasilea: 'A1180',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 32,
    clasificacionBasilea: 'Y42',
    clasfRes11642002: 'Reactivos',
    proceso: 'Aprovechamiento',
    descripcionProceso: 'Entrega a gestor para destilación y aprovechamiento.'
  },
  {
    tipo: 33,
    clasificacionBasilea: 'Y3',
    clasfRes11642002: 'Fármacos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 34,
    clasificacionBasilea: 'Y42',
    clasfRes11642002: 'Reactivos',
    proceso: 'Aprovechamiento',
    descripcionProceso: 'Entrega a gestor para destilación y aprovechamiento.'
  },
  {
    tipo: 35,
    clasificacionBasilea: 'Y45',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 36,
    clasificacionBasilea: 'A3',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 37,
    clasificacionBasilea: 'Y9',
    clasfRes11642002: 'Aceites usados',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 38,
    clasificacionBasilea: 'A3',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 39,
    clasificacionBasilea: 'Y9',
    clasfRes11642002: 'Aceites usados',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 40,
    clasificacionBasilea: 'Y9',
    clasfRes11642002: 'Aceites usados',
    proceso: 'Aprovechamiento y/o valorización',
    descripcionProceso: 'Venta a gestor para proceso de aprovechamiento.'
  },
  {
    tipo: 

41,
    clasificacionBasilea: 'Y9',
    clasfRes11642002: 'Aceites usados',
    proceso: 'Aprovechamiento y/o valorización',
    descripcionProceso: 'Venta a gestor para proceso de aprovechamiento.'
  },
  {
    tipo: 42,
    clasificacionBasilea: 'Y9',
    clasfRes11642002: 'Aceites usados',
    proceso: 'Aprovechamiento y/o valorización',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 43,
    clasificacionBasilea: 'A2',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para proceso de incineración.'
  },
  {
    tipo: 44,
    clasificacionBasilea: 'Y16',
    clasfRes11642002: 'Reactivos',
    proceso: 'Aprovechamiento',
    descripcionProceso: 'Entrega a gestor para destilación y aprovechamiento.'
  },
  {
    tipo: 45,
    clasificacionBasilea: 'Y16',
    clasfRes11642002: 'Reactivos',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para disposición en celda de seguridad.'
  },
  {
    tipo: 46,
    clasificacionBasilea: 'Y9',
    clasfRes11642002: 'Reactivos',
    proceso: 'Aprovechamiento y/o valorización',
    descripcionProceso: 'Venta a gestor para proceso de aprovechamiento.'
  },
  {
    tipo: 47,
    clasificacionBasilea: 'A4130',
    clasfRes11642002: 'Contenedores presurizados',
    proceso: 'Disposición final',
    descripcionProceso: 'Entrega a gestor para destrucción según NTC3264.'
  }
];
*/