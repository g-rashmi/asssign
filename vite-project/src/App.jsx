import { useEffect, useState } from "react";
import Login from "./components/Login";
 
import Productlist from "./components/p";
``;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
function App() {
  const [user,setuser]=useState(null);
  const [load,setload]=useState(true);
  useEffect(()=>{ 
const fn=onAuthStateChanged(auth,(u)=>{
setuser(u);
setload(false);
return ()=>fn();
})
  },[])
  if(load){<div>loading ... </div>}
  return (
    <div>
      <Router>
          

        <Routes>
          <Route path="/" element={!user?<Login />:<Navigate to="/products"/>}></Route>
          <Route path="/products" element={ user? <Productlist />:<Navigate to="/"/>}></Route>
        </Routes>``
      </Router>
    </div>
  );
}

export default App;