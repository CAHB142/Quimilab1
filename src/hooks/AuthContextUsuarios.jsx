import { createContext, useContext, useState, useEffect } from "react";
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc, updateDoc, query, where, getDoc } from "firebase/firestore";
import { app } from "../app/firebase";
import { auth } from "../app/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const AuthContext = createContext()

export const useAuth = () =>{
    const context = useContext(AuthContext)
    return context;
}
const db = getFirestore(app);

export function AuthProviderUsuarios({ children }) {

    const [usuarioRegistrados, setUsuariosRegistrados] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState({});
    const [user, setUser] = useState();

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "usuarios"));
            const dataDB = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            console.log(dataDB);
            setUsuariosRegistrados(dataDB)
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }

    const getUserById = async (id) => {
        try {
            const docRef = doc(db, 'usuarios', id);
            const documentSnapshot = await getDoc(docRef);
            console.log("loooooog")
            console.log(documentSnapshot.data());
            if (documentSnapshot.exists()) {
                setUser(documentSnapshot.data());
              } else {
                console.log('El documento no existe');
              }
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }

    const registro  = async (email, password , Nombre, Apellidos, tipoDocumento, NumDocumento, Telefono, Cargo, Rol, AsigLaboratorio) =>{
        const infoUsuario = await createUserWithEmailAndPassword(auth, email, password);
        const newDoc = {
            nombre: Nombre,
            apellidos: Apellidos,
            tipoDocumento: tipoDocumento,
            numDocumento: NumDocumento,
            telefono: Telefono,
            email: email, 
            cargo:Cargo, 
            rol:Rol,
            asigLaboratorios:AsigLaboratorio
        }
        const docuRef = doc(db, `usuarios/${infoUsuario.user.uid}`);
        await setDoc(docuRef, newDoc).then(doc => {
            console.log(doc)
            getData()
        });
    }

    const deleteData = async (usuriosid) => {
        try {
            setLoading(prev => ({
                ...prev, deleteData: true
            }));
            const docRef = doc(db, "usuarios", usuriosid);
            await deleteDoc(docRef)
            setUsuariosRegistrados(usuarioRegistrados.filter(item => item.id !== usuriosid))
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(prev => ({
                ...prev, deleteData: true
            }));
        }
    }

    const updateData = async(usuariosid,Nombre,Apellidos,TipoDocumentoUsu,Documento,Telefono,Email,Cargo, Rol,AsigLaboratorio)=>{
        try{
            const docRef = doc(db, "usuarios", usuariosid);
            await updateDoc(docRef, {
                nombre: Nombre,
                apellidos: Apellidos,
                tipoDocumento: TipoDocumentoUsu,
                numDocumento: Documento,
                telefono: Telefono,
                email: Email, 
                cargo:Cargo, 
                rol:Rol,
                asigLaboratorios:AsigLaboratorio

            }).then(doc => {
                console.log(doc)
                getData()
            })
        } catch (error) {
            setError(error.message);
        }
    }

    const uploadAsigLab = async (usuariosid, AsigLaboratorio) => {
        try {
            const docRef = doc(db, "usuarios", usuariosid);
            await updateDoc(docRef, {
                asigLaboratorios: AsigLaboratorio

            }).then(doc => {
                console.log(doc)
                getData()
            })
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <AuthContext.Provider value={{
            usuarioRegistrados,
            loading,
            error,
            registro,
            getData,
            deleteData,
            updateData,
            uploadAsigLab,
            getUserById,
            user
        }}>
            {children}
        </AuthContext.Provider>
    )
}