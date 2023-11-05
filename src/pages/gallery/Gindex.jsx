import { useState } from 'react';
import { Button, Progress, Spinner } from '@material-tailwind/react';
import { firebaseStorage } from '../../firebase/firebaseStorage';
import { useGallery } from '../../contexts/galleryContext/GalleryContext';
import './GStyle.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const GIndex = () => {
  const { data, loading, setData } = useGallery();

  const [selectedImages, setSelectedImages] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); 


  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImagePreview(null);
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
        setImagePreview(null)
      } catch (error) {
        // console.error('Upload error:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (Object.keys(selectedImages).length > 0) {
      try {
        const deletePromises = Object.keys(selectedImages).map((imageName) =>
          firebaseStorage.deleteImage(imageName)
        );
        await Promise.all(deletePromises);
        setSelectedImages({});
        const updatedData = await firebaseStorage.fetchImages();
        setData(updatedData);
      } catch (error) {
        // console.error('Delete error:', error);
      }
    }
  };

  const onDragEnd = (result) => {

    const { source, destination, type } = result;
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'group') {
      const items = [...data];
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      return setData(items);

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
        {Object.keys(selectedImages).length <= 0 ? (
          <p className="text-[22px] font-bold">Gallery</p>
        ) : (
          <div className="flex gap-3 text-[22px] font-bold">
            <input
              type="checkbox"
              checked={true}
              className="w-[22px]"
              readOnly
            />
            <p>{Object.keys(selectedImages).length} File Selected</p>
          </div>
        )}
        {Object.keys(selectedImages).length > 0 && (
          <button className="capitalize text-red-600 font-semibold" onClick={handleDelete}>
            Delete files
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="characters" type='group'>
          {(provided) => (
            <div id='characters' className="characters grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[25px] p-6" {...provided.droppableProps} ref={provided.innerRef}>
              {data.map((image, index) => (
                <Draggable draggableId={image?.name} key={image?.name} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
                      className="col-span-1 border border-gray-500 rounded-xl overflow-hidden relative first:col-span-2 first:row-span-2 bg-effect"
                      draggable
                    >
                      <img
                        className="w-full h-full aspect-square"
                        src={image.url}
                        alt={image.name}
                      />
                      <input
                        type="checkbox"
                        checked={selectedImages[image.name] || false}
                        onChange={(e) => handleToggleImageSelection(e, image.name)}
                        className="absolute top-2 left-2 z-50 w-[22px] h-[22px]"
                      />
                    </div>
                  )}

                </Draggable>

              ))}

              {provided.placeholder}
              <div className="flex items-center justify-center w-full min-h-[213px] relative">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-[#2f2f2f3f] w-full h-full ">
                  <div className="flex flex-col items-center justify-center ">
                    <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center"><span className="font-semibold  w-full">Click to upload</span> or drag and drop</p>

                  </div>
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />




                </label>
                {imagePreview && (
                  <div className="absolute top-0 left-0">
                    <img
                      className="w-full h-full aspect-square border-2 border-gray-300 border-dashed rounded-xl"
                      src={imagePreview}

                    />
                    <div className='flex justify-center gap-2 absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4'>
                      <Button variant='filled' color='red' onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button variant="outlined" onClick={handleUpload}>Upload</Button>
                    </div>
                    {
                      // firebaseStorage.progress > 0 ? (
                        <p className='absolute right-2 bottom-2'>{firebaseStorage?.progress} </p>
                      // ): (null)
                    }
                  
                  </div>
                )}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>


    </section>
  );
};

export default GIndex;
