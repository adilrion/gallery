// components/Gallery.js
import { useState } from "react";
import { Button, Spinner } from "@material-tailwind/react";
import { firebaseStorage } from "../../firebase/firebaseStorage";
import { useGallery } from '../../contexts/galleryContext/GalleryContext';

const GIndex = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});
  const { data, loading, setData } = useGallery();

  const numberOfSelectedImages = Object.entries(selectedImages).length;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleToggleImageSelection = (imageName) => {
    setSelectedImages((prevSelectedImages) => ({
      ...prevSelectedImages,
      [imageName]: !prevSelectedImages[imageName],
    }));
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const downloadURL = await firebaseStorage.uploadImage(selectedFile);
        const updatedData = await firebaseStorage.fetchImages();
        setData(updatedData);
        console.log('File uploaded, download URL:', downloadURL);
        setSelectedFile(null);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (numberOfSelectedImages > 0) {
      try {
        const deletePromises = Object.keys(selectedImages).map((imageName) =>
          firebaseStorage.deleteImage(imageName)
        );
        await Promise.all(deletePromises);
        console.log('Files deleted.');
        const updatedData = await firebaseStorage.fetchImages();
        setData(updatedData);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <Spinner color="blue" />
      </div>
    );
  }

  return (
    <section>
      <div>
        <p>Selected: {numberOfSelectedImages}</p>
      </div>

      <div className="grid grid-cols-5 gap-10">
        {data.map((image, index) => (
          <div key={index} className="col-span-1 border-gray-900 border rounded-full">
            <img src={image.url} alt={image.name} />
            <input
              type="checkbox"
              checked={selectedImages[image.name] || false}
              onChange={() => handleToggleImageSelection(image.name)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover.bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
          <Button variant="outlined" onClick={handleUpload}>Upload</Button>
        </label>
      </div>

      <Button variant="outlined" onClick={handleDelete}>
        Delete
      </Button>
    </section>
  );
};

export default GIndex;
