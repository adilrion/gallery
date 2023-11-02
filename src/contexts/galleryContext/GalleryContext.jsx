import { createContext, useContext, useEffect, useState } from "react";
import { firebaseStorage } from "../../firebase/firebaseStorage";
import { getDownloadURL, listAll, ref } from "firebase/storage";


const gContext = createContext();



// eslint-disable-next-line react/prop-types
export const GProvider = ({ children }) => {

    const [data, setData] = useState([]); // Initialize with your initial data






    const updateData = (newData) => {
        setData(newData);
    };




    useEffect(() => {
        const getImages = async () => {
            try {
                const listRef = ref(firebaseStorage.storage, "task");
                const result = await listAll(listRef);

                const imagePromises = result.items.map(async (imageRef) => {
                    const downloadURL = await getDownloadURL(imageRef);
                    return { name: imageRef.name, url: downloadURL };
                });

                const imageArray = await Promise.all(imagePromises);
                console.log(imageArray)

            } catch (error) {
                console.error("Error listing images:", error);
                throw error;
            }
        };

        // Call getImages to load images
        getImages();
    }, []); // 




    return (
        <gContext.Provider value={{ data, updateData }}>
            {children}
        </gContext.Provider>
    )
}

export const UseGallery = () => {
    return useContext(gContext)
}