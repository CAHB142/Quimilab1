import {  createContext, useContext, useState, useEffect } from "react";
import {getFirestore, collection, getDocs, deleteDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import {app} from "../app/firebase";

export const AuthContextPruebas = createContext()

export const useAuthPruebas = () =>{
    const context = useContext(AuthContextPruebas)
    return context;
}
const db = getFirestore(app);

export function AuthProviderPruebas({children}) {
    const [pruebas, setPruebas] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState({});

    useEffect(()=>{
        getData()
    }, [])

    const getData = async ()=>{
        try{
            const querySnapshot = await getDocs(collection(db, "pruebasEnsayos")); 
            const dataDB = querySnapshot.docs.map(doc =>{
                return{
                    id: doc.id, 
                    ...doc.data()
                }
            })
            setPruebas(dataDB)
        }catch (error){
            console.log(error);
            setError(error.message);
        }
    }

    const addData = async (nombre,CentroCostos,tipoActividad) =>{
        try{
            const newDoc = {
                nombre:nombre,
                CentroCostos:CentroCostos,
                tipoActividad:tipoActividad,
            }
            const docRef = doc(collection(db, "pruebasEnsayos"));
            await setDoc(docRef, newDoc).then(doc => {
                console.log(doc)
                getData()
            })
            }catch(error){
                setError(error.message);
            }
    }

    const deleteData = async (pruebasid) =>{
        try{
            setLoading (prev =>({
                ...prev, deleteData:true
            }));
            const docRef = doc(db, "pruebasEnsayos", pruebasid);
            await deleteDoc (docRef)
            setPruebas(pruebas.filter(item =>  item.id !== pruebasid))
            }catch(error){
                setError(error.message);
            }finally{
                setLoading (prev =>({
                    ...prev, deleteData:true
                }));
            } 
    }

    const updateData = async(pruebasid, newNombre,newCentroCostos,newTipoActividad)=>{
        try{
            const docRef = doc(db, "pruebasEnsayos", pruebasid);
            await updateDoc (docRef, {
                nombre:newNombre,
                CentroCostos:newCentroCostos,
                tipoActividad:newTipoActividad
            }).then(doc => {
                console.log(doc)
                getData()
            })
            }catch(error){
                setError(error.message);
            }
    }

    return(
        <AuthContextPruebas.Provider value ={{
        pruebas,
        loading,
        error,
        addData,
        getData,
        deleteData,
        updateData
        }}>
            {children}
        </AuthContextPruebas.Provider>
    ) 

}