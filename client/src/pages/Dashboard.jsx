import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";


const Dashboard = () => {

  const { user } = useAuth();

  const [posts,setPosts] = useState([]);
  const [loading,setLoading] = useState(true);



  const fetchPosts = async()=>{

    try{

      const res = await api.get("/posts");

      const myPosts =
      res.data.posts.filter(
        post =>
        post.author?._id === user?._id
      );

      setPosts(myPosts);

    }
    catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  };



  useEffect(()=>{

    fetchPosts();

  },[]);




  return (

    <div className="dashboard-page">



      <section className="dashboard-header">


        <h1>
          Welcome, {user?.name} 👋
        </h1>


        <p>
          Manage your blogs and track your content.
        </p>


        <Link
          to="/create-post"
          className="create-btn"
        >

          ✍ Create New Post

        </Link>


      </section>





      <section className="dashboard-stats">


        <div className="dash-card">

          <h2>
            {posts.length}
          </h2>

          <p>
            Total Posts
          </p>

        </div>



        <div className="dash-card">

          <h2>
            ❤️
          </h2>

          <p>
            Engagement
          </p>

        </div>



        <div className="dash-card">

          <h2>
            🚀
          </h2>

          <p>
            Creator
          </p>

        </div>


      </section>





      <section className="my-posts">


        <h2>
          My Articles 📚
        </h2>



        {
          loading ?

          <p className="loading">
            Loading...
          </p>


          :

          posts.length === 0 ?

          (

            <div className="empty-dashboard">

              <h3>
                No posts yet 😔
              </h3>

              <Link to="/create-post">
                Start Writing
              </Link>

            </div>

          )


          :

          (

          <div className="dashboard-grid">


          {
            posts.map(post=>(

              <div
                className="dashboard-post"
                key={post._id}
              >


                {
                  post.coverImage ?

                  <img
                    src={`http://localhost:5000${post.coverImage}`}
                    alt={post.title}
                  />

                  :

                  <div className="dash-placeholder">
                    📖
                  </div>

                }



                <div className="dash-content">


                  <h3>
                    {post.title}
                  </h3>


                  <p>
                    {
                    post.content?.substring(0,100)
                    }...
                  </p>



                  <Link
                    to={`/posts/${post._id}`}
                  >

                    View Article →

                  </Link>


                </div>


              </div>


            ))
          }


          </div>

          )

        }


      </section>



    </div>

  );

};


export default Dashboard;