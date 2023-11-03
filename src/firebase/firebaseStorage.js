// firebase/firebaseStorage.js
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    listAll,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { App } from "../config/firebase/firebase.config";

const storage = getStorage(App);

const uploadImage = async (file) => {
    try {
        const metadata = {
            contentType: "image/jpeg",
        };

        const now = new Date();
        const dateString = now
            .toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
            .replace(/\//g, "-");

        const storagePath = `task/${file.name} - ${dateString}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        uploadTask.on("state_changed", (snapshot) => {
            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
        });

        const uploadSnapshot = await uploadTask;

        const downloadURL = await getDownloadURL(uploadSnapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};

const fetchImages = async () => {
    const listRef = ref(storage, "task");
    const result = await listAll(listRef);
    const imagePromises = result.items.map(async (imageRef) => {
        const downloadURL = await getDownloadURL(imageRef);
        return { name: imageRef.name, url: downloadURL };
    });
    return Promise.all(imagePromises);
};

const deleteImage = async (imageName) => {
    const imageRef = ref(storage, `task/${imageName}`);
    await deleteObject(imageRef);
};

export const firebaseStorage = {
    storage,
    uploadImage,
    fetchImages,
    deleteImage,
};
