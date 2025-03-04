import {  createContext, useContext, useState, useEffect } from "react";
import {getFirestore, collection, getDocs, deleteDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import {app} from "../app/firebase";

export const AuthContextInventarios = createContext()

export const useAuthInventarios = () =>{
    const context = useContext(AuthContextInventarios)
    return context;
}
const db = getFirestore(app);

export function AuthProviderInventarios({children}) {
    const [inventarios, setInventarios] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState({});

    useEffect(()=>{
        getData()
    }, [])


    const getData = async ()=>{
        try{
            const querySnapshot = await getDocs(collection(db, "inventario")); 
            const dataDB = querySnapshot.docs.map(doc =>{
                return{
                    id: doc.id, 
                    ...doc.data()
                }
            })
            //console.log(dataDB)
            setInventarios(dataDB)
        }catch (error){
            console.log(error);
            setError(error.message);
        }
    }

    const addInv = async (codigo,seccion,nombreReactivo, concentracion, cantidadReactivo, marca,capacidadRecipiente,tipoRecipiente,fechaVencimiento,fechaAdquisicion,etiquetaSGA,almacenamiento) =>{
        try{
            const newDoc = {
                codigo:codigo,
                seccion:seccion,
                nombreReactivo:nombreReactivo,
                concentracion:concentracion,
                cantidadReactivo: cantidadReactivo,
                marca:marca,
                capacidadRecipiente: capacidadRecipiente,
                tipoRecipiente:tipoRecipiente,
                fechaVencimiento:fechaVencimiento,
                fechaAdquisicion:fechaAdquisicion,
                etiquetaSGA:etiquetaSGA,
                almacenamiento:almacenamiento,
                }
            const docRef = doc(collection(db, "inventario"));
            await setDoc(docRef, newDoc).then(doc => {
                console.log(doc)
                getData()
            })
        }catch(error){
            setError(error.message);
        }
    }

    const deleteData = async (inventariosid) =>{
        try{
            setLoading (prev =>({
                ...prev, deleteData:true
            }));
            const docRef = doc(db, "inventario", inventariosid);
            await deleteDoc (docRef)
            setInventarios(inventarios.filter(item =>  item.id !== inventariosid))
            }catch(error){
                setError(error.message);
            }finally{
                setLoading (prev =>({
                    ...prev, deleteData:true
                }));
            } 
    }


    const updateData = async(inventariosid,codigo,seccion,nombreReactivo,concentracion, cantidadReactivo,marca,capacidadRecipiente,tipoRecipiente,fechaVencimiento,fechaAdquisicion,etiquetaSGA,almacenamiento)=>{
        try{
            const docRef = doc(db, "inventario", inventariosid);
            await updateDoc (docRef, {
                codigo:codigo,
                seccion:seccion,
                nombreReactivo:nombreReactivo,
                concentracion:concentracion,
                cantidadReactivo: cantidadReactivo,
                marca:marca,
                capacidadRecipiente: capacidadRecipiente,
                tipoRecipiente:tipoRecipiente,
                fechaVencimiento:fechaVencimiento,
                fechaAdquisicion:fechaAdquisicion,
                etiquetaSGA:etiquetaSGA,
                almacenamiento:almacenamiento,

            }).then(doc => {
                console.log(doc)
                getData()
            })
            }catch(error){
                setError(error.message);
            }
    }

    return(
        <AuthContextInventarios.Provider value ={{
        inventarios,
        loading,
        error,
        addInv,
        getData,
        deleteData,
        updateData,
        }}>
            {children}
        </AuthContextInventarios.Provider>
    ) 

}