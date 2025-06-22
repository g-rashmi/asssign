import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { Box, Button, Typography, Avatar } from "@mui/material";

function Login() {
  const navigate = useNavigate();

  const handleGoogle = async (e) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem(
        "user",
        JSON.stringify({
          googleId: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
        })
      );

      navigate("/products");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        padding: 2,
      }}
    >
      <Button
        onClick={handleGoogle}
        variant="contained"
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          color: "#0b131b",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            backgroundColor: "#f5f5f5",
          },
          textTransform: "none",
          minWidth: { xs: "80%", sm: "auto" },
        }}
      >
        <Avatar
          src="https://freelogopng.com/images/all_img/1657955079google-icon-png.png"
          sx={{ width: 28, height: 28, mr: 1 }}
        />
        <Typography
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(90deg, #0b131b, #010f1b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "1rem", sm: "1.2rem" },
          }}
        >
          Login with Google
        </Typography>
      </Button>
    </Box>
  );
}

export default Login;
