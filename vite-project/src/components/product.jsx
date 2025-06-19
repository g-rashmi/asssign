import React, { useState, useEffect } from "react";
import axios from "axios";

function Product({ item }) {
  const [review, setreview] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, sethover] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [image,setimage]=useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/feed?productId=${item.id}`
        );
        console.log(res.data);
        setFeedbacks(res.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    console.log(feedbacks);

    fetchFeedbacks();
  }, [item.id,submitted]);

  useEffect(() => {
    const checkSubmitted = async () => {
      if (user?.email) {
        const res = await axios.get(`http://localhost:4000/check-feedback`, {
          params: {
            email: user.email,
            productId: item.id,
          },
        });
        if (res.data.exists) {
          setSubmitted(true);
        }
      }
    };
    checkSubmitted();
  }, [item.id, user?.email]);

  const handleSubmit = async () => {
    if (!user || (!review && rating === 0)) {
      alert("Please login and provide at least rating or review.");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api", {
        email: user.email,
        productId: item.id,
        rating,
        review,
        image,
      });

      alert("Feedback submitted successfully!");
      setSubmitted(true);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <div className="card" style={{ width: "18rem" }}>
        <img
          src={item.image}
          className="card-img-top"
          alt={item.name}
          style={{ height: "212px" }}
        />
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text">{item.description}</p>

          <textarea
            className="form-control"
            placeholder="Write your feedback"
            onChange={(e) => setreview(e.target.value)}
            value={review}
            disabled={submitted}
          ></textarea>
  <input
            type="file"
          
              disabled={submitted}
            onChange={(e)=>{ 
 const file = e.target.files[0];
  if (!file) return;

  

  const reader = new FileReader();
  reader.onloadend = () => {
    setimage(reader.result); 
  };
  reader.readAsDataURL(file);

              
            }}
                 className="form-control mt-2"
          />
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  fontSize: "20px",
                  cursor: !submitted ? "pointer" : "default",
                  color: star <= (hover || rating) ? "#ffc107" : "#e4e5e9",
                }}
                onClick={() => !submitted && setRating(star)}
                onMouseEnter={() => !submitted && sethover(star)}
                onMouseLeave={() => !submitted && sethover(0)}
              >
                ★
              </span>
            ))}
          </div>

          <button
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={submitted}
          >
            {submitted ? "Submitted" : "Submit Review"}
          </button>

          <div style={{ marginTop: "10px", textAlign: "left" }}>
            <h6>Feedbacks:</h6>
            {feedbacks.length === 0 ? (
              <p>No reviews yet</p>
            ) : (
              feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  style={{ borderTop: "1px solid #ccc", paddingTop: "5px" }}
                >
                  <strong>{fb.email}</strong>
                  <br />
                  {fb.rating && (
                    <span style={{ color: "#ffc107" }}>
                      {"★".repeat(fb.rating)}
                      {"☆".repeat(5 - fb.rating)}
                    </span>
                  )}
                  <br />
                  {fb.review && <p>{fb.review}</p>}
                  {fb.image&&<img src={fb.image} alt="Review" 
    style={{ width: "100%", maxHeight: "200px", objectFit: "contain", marginTop: "5px" }}/>}
                </div>

                
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
