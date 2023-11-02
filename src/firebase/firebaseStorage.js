import { getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { App } from "../config/firebase/firebase.config";

const storage = getStorage(App);

const uploadImage = async (file) => {



    try {
      
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: "image/jpeg",
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const now = new Date();
        const dateString = now.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).replace(/\//g, '-')

        const storagePath = `task/${file.name} - ${dateString}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case "storage/unauthorized":
                        // User doesn't have permission to access the object
                        console.log(error)
                        break;
                    case "storage/canceled":
                        // User canceled the upload
                        console.log(error);
                        break;

                    // ...

                    case "storage/unknown":
                        console.log(error);
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", uploadTask);
                    return downloadURL;
                });
            }
        );
    } catch (error) {
        console.log(error);
    }
};



export const fetchImages = async () => {
    try {
        const listRef = ref(storage, "task");
        const result = await listAll(listRef);

        const imagePromises = result.items.map(async (imageRef) => {
            const downloadURL = await getDownloadURL(imageRef);
            return { name: imageRef.name, url: downloadURL };
        });

        return Promise.all(imagePromises);
    } catch (error) {
        console.error("Error listing images:", error);
        throw error;
    }
};



export const firebaseStorage = {
    storage,
    uploadImage,
    fetchImages,
};
