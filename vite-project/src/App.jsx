import Login from "./components/Login";

import Productlist from "./components/p";
``;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/products" element={<Productlist />}></Route>
        </Routes>``
      </Router>
    </div>
  );
}

export default App;