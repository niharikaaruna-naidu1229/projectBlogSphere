import "../styles/CreatePost.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/CreatePost.css";


const CreatePost = () => {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    title:"",
    content:"",
    tags:""
  });

  const [image,setImage] = useState(null);
  const [preview,setPreview] = useState("");
  const [loading,setLoading] = useState(false);



  const handleChange=(e)=>{

    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });

  };



  const handleImage=(e)=>{

    const file=e.target.files[0];

    setImage(file);

    if(file){

      setPreview(
        URL.createObjectURL(file)
      );

    }

  };



  const handleSubmit=async(e)=>{

    e.preventDefault();


    try{

      setLoading(true);


      const data=new FormData();

      data.append(
        "title",
        formData.title
      );

      data.append(
        "content",
        formData.content
      );


      data.append(
        "tags",
        formData.tags
      );


      if(image){

        data.append(
          "coverImage",
          image
        );

      }



      await api.post(
        "/posts",
        data,
        {
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }
      );


      navigate("/dashboard");


    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  };



  return (

    <div className="create-page">


      <div className="create-container">


        <h1>
          ✍ Create New Blog
        </h1>

        <p>
          Share your thoughts with the world.
        </p>




        <form
          onSubmit={handleSubmit}
          className="create-form"
        >



          <input

            type="text"

            name="title"

            placeholder="Blog title"

            value={formData.title}

            onChange={handleChange}

            required

          />




          <textarea

            name="content"

            placeholder="Write your article..."

            rows="10"

            value={formData.content}

            onChange={handleChange}

            required

          />




          <input

            type="text"

            name="tags"

            placeholder="Tags (react,node,mongodb)"

            value={formData.tags}

            onChange={handleChange}

          />





          <label className="upload-box">


            {
              preview ?

              <img
                src={preview}
                alt="preview"
              />

              :

              <>
              🖼️
              <span>
                Upload Cover Image
              </span>
              </>
            }



            <input

              type="file"

              onChange={handleImage}

              hidden

            />


          </label>





          <button>

            {
              loading
              ?
              "Publishing..."
              :
              "Publish Blog 🚀"
            }

          </button>




        </form>


      </div>


    </div>

  );

};


export default CreatePost;