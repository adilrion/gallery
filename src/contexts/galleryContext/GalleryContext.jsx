import { createContext, useContext, useEffect, useState } from "react";
import { firebaseStorage } from "../../firebase/firebaseStorage";


const gContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useGallery = () => {
    return useContext(gContext)
}


// eslint-disable-next-line react/prop-types
export const GProvider = ({ children }) => {

    const [data, setData] = useState([]); // Initialize with your initial data
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        firebaseStorage.fetchImages()
            .then((imageArray) => {
                setData(imageArray);
            })
            .catch((error) => {
                console.error("Error fetching images:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);



    return (
        <gContext.Provider value={{ data, loading, setData }}>
            {children}
        </gContext.Provider>
    )
}

