import {  createContext, useContext, useState, useEffect } from "react";
import {getFirestore, collection, getDocs, deleteDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import {app} from "../app/firebase";

export const AuthContextBolsaReactivos = createContext()

export const useAuthBolsaReactivo = () =>{
    const context = useContext(AuthContextBolsaReactivos)
    return context;
}
const db = getFirestore(app);

export function AuthProviderBolsaReactivo({children}) {
    const [bolsaReactivos, setBolsaReactivos] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState({});

    useEffect(()=>{
        getData()
    }, [])

    const getData = async ()=>{
        try{
            const querySnapshot = await getDocs(collection(db, "BolsaReactivos")); 
            const dataDB = querySnapshot.docs.map(doc =>{
                return{
                    id: doc.id, 
                    ...doc.data()
                }
            })
            setBolsaReactivos(dataDB)
        }catch (error){
            console.log(error);
            setError(error.message);
        }
    }

    const addData = async (fechaRegistro, nombre,cantidad,responsable,telefono,lugar,estado) =>{
        try{
            const newDoc = {
                fechaRegistro:fechaRegistro,
                nomReactivo:nombre,
                cantidad:cantidad,
                responsable:responsable,
                telefono:telefono,
                lugar:lugar,
                estado:estado
            }
            const docRef = doc(collection(db, "BolsaReactivos"));
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
            const docRef = doc(db, "BolsaReactivos", bolsaReactivoId);
            await deleteDoc (docRef)
            setBolsaReactivos(bolsaReactivos.filter(item =>  item.id !== bolsaReactivoId))
            }catch(error){
                setError(error.message);
            }finally{
                setLoading (prev =>({
                    ...prev, deleteData:true
                }));
            } 
    }

    const updateEstado = async(bolsaReactivoId, estado) =>{
        try{
            const docRef = doc(db, "BolsaReactivos", bolsaReactivoId)
            await updateDoc(docRef,{
                estado:estado
            }).then(doc=>{
                getData() 
            })

        }catch(error){
            console.log("no registro")
        }
    }

    const updateData = async(bolsaReactivoId,fechaRegistro, nombre,cantidad,responsable,telefono,lugar,estado )=>{
        try{
            const docRef = doc(db, "BolsaReactivos", bolsaReactivoId);
            await updateDoc (docRef, {
                fechaRegistro:fechaRegistro,
                nomReactivo:nombre,
                cantidad:cantidad,
                responsable:responsable,
                telefono:telefono,
                lugar:lugar,
                estado:estado
            }).then(doc => {
                console.log(doc)
                getData()
            })
            }catch(error){
                setError(error.message);
            }
    }

    return(
        <AuthContextBolsaReactivos.Provider value ={{
        bolsaReactivos,
        loading,
        error,
        addData,
        getData,
        deleteData,
        updateEstado,
        updateData
        }}>
            {children}
        </AuthContextBolsaReactivos.Provider>
    ) 

}