import { useEffect, useState } from "react";
import Login from "./components/Login";
import Productlist from "./components/p";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { back_url } from "./b";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import {axios} from "axios"
function App() {
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(true);
const [serverWaking, setServerWaking] = useState(true);

useEffect(() => {
  const pingServer = async () => {
    try {
      await axios.get(`${back_url}/healthz`);
    } catch (error) {
      console.error("server is starting ..wait...");
      console.log(error);
    } finally {
      setServerWaking(false);
    }
  };
  pingServer();
}, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoad(false);
    });
    return () => unsubscribe();
  }, []);

  if (load||serverWaking) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
}


  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Navigate to="/products" />} />
        <Route path="/products" element={user ? <Productlist /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
