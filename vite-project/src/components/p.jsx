// Productlist.jsx

import { product } from "../config";
import Navbar from "./Nav";
import Product from "./product";

function Productlist() {
 

  

  return (
    <div>
<div><Navbar/></div>
    
      <h1 className="container">Product List</h1>

      <div
        style={{
          display: "flex",
          gap: "30px",
          margin: "40px",
          textAlign: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {product.map((item) => {
         

          return (
            <div key={item.id}>
              <Product item={item} />
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Productlist;
