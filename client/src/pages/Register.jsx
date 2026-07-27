import "../styles/Register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Register.css";

const Register = () => {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:""
  });

  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);


  const handleChange = (e)=>{

    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });

  };


  const handleSubmit = async(e)=>{

    e.preventDefault();

    try{

      setLoading(true);
      setError("");

      await api.post(
        "/auth/register",
        formData
      );


      navigate("/login");


    }
    catch(err){

      setError(
        err.response?.data?.message ||
        "Registration failed"
      );

    }
    finally{

      setLoading(false);

    }

  };


  return (

    <div className="register-page">


      <div className="register-card">


        <h1>
          Create Account 🚀
        </h1>


        <p>
          Join BlogSphere community
        </p>


        {
          error &&
          <div className="register-error">
            {error}
          </div>
        }



        <form onSubmit={handleSubmit}>


          <input

            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required

          />


          <input

            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required

          />



          <input

            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required

          />



          <button>

          {
            loading
            ?
            "Creating..."
            :
            "Create Account ✨"
          }

          </button>


        </form>



        <p className="login-link">

          Already have account?

          <Link to="/login">
            Login
          </Link>

        </p>


      </div>



    </div>

  );

};


export default Register;