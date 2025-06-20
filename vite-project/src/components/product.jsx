import React, { useState, useEffect } from "react";
import axios from "axios";
import { back_url } from "../b.js";

function Product({ item }) {
  const [review, setreview] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, sethover] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [image, setimage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${back_url}/feed?productId=${item.id}`);
        console.log(res.data);
        setFeedbacks(res.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    console.log(feedbacks);

    fetchFeedbacks();
  }, [item.id, submitted]);

  useEffect(() => {
    const checkSubmitted = async () => {
      if (user?.email) {
        const res = await axios.get(`${back_url}/check-feedback`, {
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
      alert("provide at least rating or review.");
      return;
    }

    try {
      await axios.post(`${back_url}/api`, {
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
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject; 
      
    });
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
            accept="image/*"
            disabled={submitted}
            onChange={async (e) => {
              const f = await toBase64(e.target.files[0]);
              setimage(f);
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

                  {fb.rating > 0 && (
                    <span style={{ color: "#ffc107" }}>
                      {"★".repeat(fb.rating)}
                      {"☆".repeat(5 - fb.rating)}
                    </span>
                  )}
                  <br />
                  {fb.review && <p>{fb.review}</p>}
                  { console.log(fb.image) }
                  {fb.image != "" && (
                    
                    <img
                      src={fb.image}
                      alt="Review"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "contain",
                        marginTop: "5px",
                      }}
                    />
                  )}
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
