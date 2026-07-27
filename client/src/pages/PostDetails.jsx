import "../styles/PostDetails.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const PostDetails = () => {

  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);


  // Fetch Single Post

  const fetchPost = async () => {

    try {

      setLoading(true);

      const res = await api.get(`/posts/${id}`);

      setPost(res.data.post);

      setLikes(res.data.post.likes?.length || 0);

      setComments(
        res.data.post.comments || []
      );


      // Related Posts

      const related = await api.get("/posts");

      setRelatedPosts(
        related.data.posts
        ?.filter(
          item => item._id !== id
        )
        .slice(0,3)
        || []
      );


    } catch(error){

      console.log(error);

    } finally {

      setLoading(false);

    }

  };


  useEffect(()=>{

    fetchPost();

  },[id]);



  // Like Button

  const handleLike = () => {

    setLiked(!liked);

    setLikes(
      liked ? likes - 1 : likes + 1
    );

  };



  // Comment Submit

  const handleComment = (e)=>{

    e.preventDefault();


    if(!comment.trim())
      return;


    const newComment = {

      user:
      user?.name || "Guest",

      text:comment,

      date:
      new Date()
      .toLocaleDateString()

    };


    setComments([
      ...comments,
      newComment
    ]);

    setComment("");

  };



  if(loading){

    return (

      <div className="loading">

        Loading article...

      </div>

    );

  }


  if(!post){

    return (

      <div className="empty-state">

        <h3>
          Post Not Found 😔
        </h3>

      </div>

    );

  }


  return (

    <div className="post-details-page">


      {/* BACK BUTTON */}

      <div className="back-wrapper">

        <Link
          to="/"
          className="back-btn"
        >

          ← Back To Blogs

        </Link>

      </div>



      {/* HERO */}

      <section className="post-hero">


        <div className="post-hero-overlay">


          <div className="post-category">

            ✨ Featured Article

          </div>


          <h1>

            {post.title}

          </h1>


          <div className="post-info">


            <span>

              👤 {post.author?.name || "Unknown"}

            </span>


            <span>

              📅 {
                new Date(
                  post.createdAt
                )
                .toDateString()

              }

            </span>


            <span>

              ⏱ {post.readTime || 1} min read

            </span>


          </div>


        </div>


      </section>
      {/* MAIN ARTICLE */}

      <main className="article-container">


        {/* COVER IMAGE */}

        <div className="article-cover">

          {post.coverImage ? (

            <img
              src={`http://localhost:5000${post.coverImage}`}
              alt={post.title}
            />

          ) : (

            <div className="cover-placeholder">

              📖 BlogSphere

            </div>

          )}

        </div>




        {/* AUTHOR CARD */}

        <div className="author-card">


          <div className="author-avatar">

            {
              post.author?.name
              ?.charAt(0)
              ?.toUpperCase()
              ||
              "U"
            }

          </div>


          <div>

            <h3>

              {post.author?.name || "Unknown"}

            </h3>


            <p>

              Blog Author ✍️

            </p>


          </div>


        </div>




        {/* CONTENT */}

        <article className="article-content">


          <p>

            {post.content}

          </p>


        </article>





        {/* TAGS */}

        {

          post.tags?.length > 0 && (

            <div className="article-tags">


              <h3>
                Topics
              </h3>


              <div className="tags-wrapper">


                {

                  post.tags.map(
                    (tag,index)=>(

                    <span
                      key={index}
                      className="tag"
                    >

                      #{tag}

                    </span>

                    )

                  )

                }


              </div>


            </div>

          )

        }







        {/* LIKE + SHARE */}

        <div className="interaction-section">


          <button

            className={
              liked
              ?
              "like-btn liked"
              :
              "like-btn"
            }

            onClick={handleLike}

          >

            ❤️ {likes}

          </button>





          <div className="share-buttons">


            <button>

              🔗 Share

            </button>


            <button>

              🐦 Twitter

            </button>


            <button>

              💼 LinkedIn

            </button>


          </div>


        </div>





        {/* COMMENTS */}


        <section className="comments-section">


          <h2>

            💬 Comments

          </h2>




          <form
            onSubmit={handleComment}
            className="comment-form"
          >


            <input

              type="text"

              placeholder="Write your comment..."

              value={comment}

              onChange={
                (e)=>
                setComment(e.target.value)
              }

            />


            <button>

              Post

            </button>


          </form>





          <div className="comments-list">


            {

              comments.length === 0 ?

              (

                <p className="no-comments">

                  No comments yet. Be the first!

                </p>

              )

              :

              (

                comments.map(
                  (item,index)=>(


                  <div
                    key={index}
                    className="comment-card"
                  >


                    <div className="comment-user">


                      <strong>

                        👤 {item.user}

                      </strong>


                      <span>

                        {item.date}

                      </span>


                    </div>



                    <p>

                      {item.text}

                    </p>


                  </div>


                  )

                )

              )

            }


          </div>


        </section>
      {/* RELATED POSTS */}

      <section className="related-section">


        <h2>

          ✨ Related Articles

        </h2>



        <div className="related-grid">


          {
            relatedPosts.map((item)=>(


              <article
                key={item._id}
                className="related-card"
              >


                {
                  item.coverImage ? (

                    <img
                      src={`http://localhost:5000${item.coverImage}`}
                      alt={item.title}
                    />

                  )

                  :

                  (

                    <div className="related-placeholder">

                      📖

                    </div>

                  )

                }



                <div className="related-content">


                  <h3>

                    {item.title}

                  </h3>


                  <p>

                    {
                      item.excerpt ||
                      item.content?.substring(0,100)
                    }

                    ...

                  </p>



                  <Link

                    to={`/posts/${item._id}`}

                    className="related-btn"

                  >

                    Read More →

                  </Link>


                </div>


              </article>


            ))

          }


        </div>


      </section>




      </main>



      {/* FOOTER */}


      <footer className="post-footer">


        <h2>

          BlogSphere

        </h2>


        <p>

          Share knowledge. Inspire people. Build community.

        </p>


        <span>

          © 2026 BlogSphere

        </span>


      </footer>



    </div>

  );

};


export default PostDetails;