// components/Gallery.js
import { useState } from "react";
import { Button, Spinner } from "@material-tailwind/react";
import { firebaseStorage } from "../../firebase/firebaseStorage";
import { useGallery } from '../../contexts/galleryContext/GalleryContext';
import './GStyle.css'

const GIndex = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});
  const { data, loading, setData } = useGallery();

  const numberOfSelectedImages = Object.entries(selectedImages).length;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleToggleImageSelection = (e, imageName) => {
    setSelectedImages((prevSelectedImages) => {
     
      const newSelectedImages = { ...prevSelectedImages };

    
      if (e.target.checked) {
        newSelectedImages[imageName] = true;
      } else {
       
        delete newSelectedImages[imageName];
      }

      return newSelectedImages;
    });
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
        setSelectedImages({})
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
    <section className="bg-white rounded-xl">
    
      <div className="w-full flex justify-between items-center px-6 py-4 border-b-2">
        {
          numberOfSelectedImages <= 0 ? (<p className="text-[22px] font-bold">Gallery</p>) : (<div className="flex gap-3 text-[22px] font-bold">
            <input
              type="checkbox"
              checked={true}
              className="w-[22px]"
              readOnly
            />
            <p>{numberOfSelectedImages} File Selected</p>
          </div>)
        }


        {
          numberOfSelectedImages > 0 && (
             <button className="capitalize text-red-600 font-semibold" onClick={handleDelete}>
          Delete files
        </button>
          )
        }

       
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-[25px] p-6">
        {data.map((image, index) => (
          <div key={index} className="col-span-1 border border-gray-500 rounded-xl overflow-hidden  relative first:col-span-2 first:row-span-2 bg-effect">
            <div className="absolute top-0 left-0 w-full h-full 
            ">

            </div>
            <img className="w-full h-full aspect-square" src={image.url} alt={image.name} />
            <input
              type="checkbox"
              checked={selectedImages[image.name] || false}
              onChange={(e) => handleToggleImageSelection(e, image.name)}
              className="absolute top-2 left-2 z-50 w-[22px] h-[22px]"
            />
          
          </div>
        ))}
        <div className="flex items-center justify-center w-full ">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-xl cursor-pointer  hover:bg-[#2f2f2f3f]  w-full h-full ">
            <div className="flex flex-col items-center justify-center ">
              <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center"><span className="font-semibold  w-full">Click to upload</span> or drag and drop</p>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, or GIF (MAX. 800x400px)</p> */}
            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
            <Button variant="outlined" onClick={handleUpload}>Upload</Button>
          </label>
        </div>
      </div>




    </section>
  );
};

export default GIndex;
