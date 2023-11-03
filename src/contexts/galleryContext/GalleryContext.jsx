// context/GalleryContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { firebaseStorage } from "../../firebase/firebaseStorage";


const GalleryContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useGallery = () => useContext(GalleryContext);

// eslint-disable-next-line react/prop-types
export const GProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const images = await firebaseStorage.fetchImages();
                setData(images);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <GalleryContext.Provider value={{ data, loading, setData }}>
            {children}
        </GalleryContext.Provider>
    );
};
