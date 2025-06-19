import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Nav.css"; 

function Navbar() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const logout = () => {
    auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="navbar">
      <div className="user-info">
        <img src={user.photoURL} alt="User" className="user-image" />
        <div className="user-details" style={{display:"flex"}}>
          <h2>{user.displayName}</h2>
          <p>{user.email}</p>
        </div>
      </div>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
