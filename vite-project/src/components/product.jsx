import React, { useState, useEffect } from "react";
import axios from "axios";
import { back_url } from "../b.js";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Rating,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Grid,
  Avatar,
} from "@mui/material";

function Product({ item }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState("");
  const [mostf, setMostf] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${back_url}/feed?productId=${item.id}`);
        setFeedbacks(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchMostfreq = async () => {
      try {
        const res = await axios.get(`${back_url}/mfreq?productId=${item.id}`);
        setMostf(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMostfreq();
    fetchFeedbacks();
  }, [item.id, submitted]);

  useEffect(() => {
    const checkSubmitted = async () => {
      if (user?.email) {
        const res = await axios.get(`${back_url}/check-feedback`, {
          params: { email: user.email, productId: item.id },
        });
        if (res.data.exists) setSubmitted(true);
      }
    };
    checkSubmitted();
  }, [item.id, user?.email]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async () => {
    if (!user || (!review && rating === 0)) {
      alert("Provide at least a rating or review.");
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

  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        my: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardMedia
        component="img"
        height="212"
        image={item.image}
        alt={item.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {item.description}
        </Typography>

        <TextField
          label="Your feedback"
          variant="outlined"
          fullWidth
          multiline
          minRows={2}
          disabled={submitted}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          sx={{ mb: 2 }}
        />

        <input
          type="file"
          disabled={submitted}
          onChange={async (e) => {
            if (e.target.files.length > 0) {
              const f =URL.createObjectURL(e.target.files[0]);
              setImage(f);
            }
          }}
          className="form-control mb-3"
        />

        <Box mb={2}>
          <Rating
            value={rating}
            readOnly={submitted}
            onChange={(_, newValue) => setRating(newValue)}
          />
        </Box>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#3A3F58" }}
          onClick={handleSubmit}
          fullWidth
          disabled={submitted}
        >
          {submitted ? "Submitted" : "Submit Review"}
        </Button>

        {mostf.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary"></Typography>
            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
              {mostf.map((word) => (
                <Chip
                  key={word}
                  label={word}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Feedbacks
        </Typography>
        {loading ? (
          <CircularProgress size={24} />
        ) : feedbacks.length === 0 ? (
          <Typography variant="body2">No reviews yet</Typography>
        ) : (
          feedbacks.map((fb) => (
            <Box key={fb.id} mb={2} borderBottom="1px solid #ccc" pb={1}>
              <Typography variant="body2" fontWeight="bold">
                {fb.email}
              </Typography>
              {fb.rating > 0 && (
                <Rating value={fb.rating} readOnly size="small" />
              )}
              {fb.review && (
                <Typography variant="body2" mt={0.5}>
                  {fb.review}
                </Typography>
              )}
              {fb.image && (
                <Box mt={1} sx={{ borderRadius: 1, overflow: "hidden" }}>
                  <img
                    src={fb.image}
                    alt="Review"
                    accept="image/*"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default Product;
