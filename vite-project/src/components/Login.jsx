import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { Box, Button, Typography, Avatar } from "@mui/material";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
const [load,setload]=useState(false);
  const handleGoogle = async (e) => {
    e.preventDefault();
if(load)return ;
setload(true);
    try {
      const provider = new GoogleAuthProvider();
       await signInWithPopup(auth, provider);
      navigate("/products");
    } catch (error) {
      console.error(error);
      setload(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        
        alignItems: "center",
        justifyContent: "center",
        background: "#3A3F58",
        padding: 2,
        boxSizing: "border-box",  overflowY: "hidden",
        overflowX:"hidden"
      }}
    >
      <Button
        onClick={handleGoogle}
        variant="contained"
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px 24px",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          color: "#0b131b",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            backgroundColor: "#f5f5f5",
          },
          textTransform: "none",
          width: { xs: "90%", sm: "320px" },  
          maxWidth: "400px",                
          mx: "auto",                      
        }}
      >
        <Avatar
          src="https://freelogopng.com/images/all_img/1657955079google-icon-png.png"
          sx={{ width: 28, height: 28, mr: 2 }}
          variant="square"
        />
        <Typography
          sx={{
            overflowY: "hidden",
        overflowX:"hidden",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #0b131b, #010f1b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "1rem", sm: "1.2rem" },
            whiteSpace: "nowrap",
          }}
        >
          Login with Google
        </Typography>
      </Button>
    </Box>
  );
}

export default Login;
