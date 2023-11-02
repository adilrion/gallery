import { useGallery } from "../../contexts/galleryContext/GalleryContext"
import Layout from "../../layout/Layout"

export const Home = () => {

  const { data } = useGallery();


  return (
      <Layout>
          

      <div>Home { data}</div>

    </Layout>
    
    
  )
}
