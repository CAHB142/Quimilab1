import {  createContext, useContext, useState, useEffect } from "react";
import {getFirestore, collection, getDocs, deleteDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import {app} from "../app/firebase";

export const AuthContextRequest = createContext()

export const useAuthRequest = () =>{
    const context = useContext(AuthContextRequest)
    return context;
}

const db = getFirestore(app);

export function AuthProviderRequest({children}) {
    const [solicitudes, setSolicitudes] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState({});

    useEffect(()=>{
        getData()
    }, [])

    const getData = async ()=>{
        try{
            const querySnapshot = await getDocs(collection(db, "Solicitud")); 
            const dataDB = querySnapshot.docs.map(doc =>{
                return{
                    id: doc.id, 
                    ...doc.data()
                }
            })
            setSolicitudes(dataDB)
        }catch (error){
            console.log(error);
            setError(error.message);
        }
    }

    const addDataRequest = async (fechaRegistroSolicitud, nombreReactivoSolicitud,cantidadSolicitud,responsableSolicitud,telefonoSolicitud,lugarSolicitud) =>{
        try{
            const newDoc = {
                fechaRegistroSolicitud:fechaRegistroSolicitud,
                nombreReactivoSolicitud:nombreReactivoSolicitud,
                cantidadSolicitud:cantidadSolicitud,
                responsableSolicitud:responsableSolicitud,
                telefonoSolicitud:telefonoSolicitud,
                lugarSolicitud:lugarSolicitud
            }
            const docRef = doc(collection(db, "Solicitud"));
            await setDoc(docRef, newDoc).then(doc => {
                console.log(doc)
                getData()
            })
        }catch(error){
            setError(error.message);
        }
    }

    const deleteData = async (bolsaReactivoId) =>{
        try{
            setLoading (prev =>({
                ...prev, deleteData:true
            }));
            const docRef = doc(db, "Solicitud", bolsaReactivoId);
            await deleteDoc (docRef)
            setSolicitudes(solicitudes.filter(item =>  item.id !== bolsaReactivoId))
            }catch(error){
                setError(error.message);
            }finally{
                setLoading (prev =>({
                    ...prev, deleteData:true
                }));
            } 
    }

    return(
        <AuthContextRequest.Provider value ={{
        solicitudes,
        loading,
        error,
        addDataRequest,
        getData,
        deleteData,
        }}>
            {children}
        </AuthContextRequest.Provider>
    ) 



}