import { Button } from "@material-tailwind/react";
import {  useState } from "react";
import { firebaseStorage } from "../../firebase/firebaseStorage";
import {UseGallery} from '../../contexts/galleryContext/GalleryContext'

const GIndex = () => {

  const [selectedFile, setSelectedFile] = useState(null);

  const { data } = UseGallery();
  console.log(data)

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };



  

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const downloadURL = await firebaseStorage.uploadImage(selectedFile);
        // You can use the downloadURL as needed, e.g., save it in a database or display it.
        console.log('File uploaded, download URL:', downloadURL);
      } catch (error) {
        // Handle any upload errors
        console.error('Upload error:', error);
      }
    }
  };




  return (
    <section>

      


      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />

          <Button variant="outlined" onClick={handleUpload}>Upload</Button>
        </label>


      </div> 


    </section>
  )
}

export default GIndex