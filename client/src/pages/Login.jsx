import "../styles/Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData,setFormData] = useState({
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

      const res = await api.post(
  "/auth/login",
  formData
);

console.log(res.data);

login(res.data);

navigate("/");


    }
    catch(err){

      setError(
        err.response?.data?.message ||
        "Login failed"
      );

    }
    finally{

      setLoading(false);

    }

  };


  return (

    <div className="login-page">


      <div className="login-left">

        <h1>
          Blog<span>Sphere</span>
        </h1>

        <p>
          Write. Share. Inspire.
          <br/>
          Join our creative blogging community.
        </p>

        <div className="login-animation">
          ✍️📚✨
        </div>

      </div>



      <div className="login-card">


        <h2>
          Welcome Back 👋
        </h2>

        <p>
          Login to continue
        </p>


        {
          error &&
          <div className="login-error">
            {error}
          </div>
        }



        <form onSubmit={handleSubmit}>


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
              "Logging in..."
              :
              "Login 🚀"
            }

          </button>


        </form>



        <p className="signup-text">

          Don't have account?

          <Link to="/register">
            Create Account
          </Link>

        </p>


      </div>


    </div>

  );

};


export default Login;