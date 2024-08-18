import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import JSConfetti from "js-confetti";
import Fuse from 'fuse.js'

function ProductAddition() {
  // Initial state for products, categories, and markets
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const markets = [
    {
      id: "m0",
      name: "Jumbo",
    },
    {
      id: "m1",
      name: "Albert Heijn",
    },
    {
      id: "m2",
      name: "Krudivat",
    },
    {
      id: "m3",
      name: "Ethos",
    },
    {
      id: "m4",
      name: "Gamma",
    },
  ];

  const categories = [
    {
      id: "c0",
      name: "Electronic",
    },
    {
      id: "c1",
      name: "Butcher",
    },
    {
      id: "c2",
      name: "Toy",
    },
    {
      id: "c3",
      name: "Bakery",
    },
    {
      id: "c4",
      name: "Grocery",
    },
  ];

  //Handle Filtering State

  const [filteredShopId, setFilteredShopId] = useState("");
  const [filteredCategoryId, setFilteredCategoryId] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [filteredName, setFilteredName] = useState("");

  //Use the filteredProducts constant to filter the products based on the applied filters.
  const filteredProducts =
    (() => {
      return products.filter((product) => {
        const matchShop = filteredShopId
          ? product.shopId === filteredShopId
          : true;
        const matchCategory = filteredCategoryId
          ? product.categoryId === filteredCategoryId
          : true;
        const matchStatus =
          filteredStatus === "all"
            ? true
            : filteredStatus === "bought"
            ? product.isBought
            : !product.isBought;
        const matchName = filteredName
          ? fuzzySearch(product.name, filteredName)
          : true;

        return matchShop && matchCategory && matchStatus && matchName;
      });
    },
    [
      filteredShopId,
      filteredCategoryId,
      filteredStatus,
      filteredName,
      products,
    ]);

  //Implement Fuzzy Search
  const Fuse = (productName, searchText) => {
    return productName.toLowerCase().includes(searchText.toLowerCase());
  };

  // Confetti
  const jsConfetti = new JSConfetti();

  // Utility function to generate a random ID
  const generateRandomId = () => {
    return "id-" + Math.random().toString(36).substring(2, 11);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (productName && selectedMarket && selectedCategory) {
      const newProduct = {
        id: generateRandomId(),
        name: productName,
        market: selectedMarket,
        category: selectedCategory,
        isBought: false,
      };

      // Add the new product to the products state
      setProducts([...products, newProduct]);

      // Clear the form inputs
      setProductName("");
      setSelectedMarket("");
      setSelectedCategory("");
    } else {
      alert("Please fill in all fields.");
    }
  };
  // Handle delete byId;
  const deleteById = (id) => {
    if (window.confirm("Are you sure you want to delete this item?"))
      setProducts((products) => {
        return products.filter((item) => item.id !== id);
      });
  };

  return (
    <div>
      <div>
        <h2>Filtered Products</h2>
        <div className="filter-box">
          <select
            onChange={(e) => setFilteredShopId(e.target.value)}
            value={filteredShopId}
          >
            <option value="">Select Market</option>
            {/* Populate options dynamically */}
          </select>

          <select
            onChange={(e) => setFilteredCategoryId(e.target.value)}
            value={filteredCategoryId}
          >
            <option value="">Select Category</option>
            {/* Populate options dynamically */}
          </select>
          <div>
          <p>Buying Status:</p>
            <label>
              <input
                type="radio"
                name="status"
                value="bought"
                checked={filteredStatus === "bought"}
                onChange={() => setFilteredStatus("bought")}
              />
              Bought
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="notBought"
                checked={filteredStatus === "notBought"}
                onChange={() => setFilteredStatus("notBought")}
              />
              Not Bought
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="all"
                checked={filteredStatus === "all"}
                onChange={() => setFilteredStatus("all")}
              />
              All
            </label>
          </div>
          <p>Product Name Text Input:</p>
          <input
            type="text"
            placeholder="Product name"
            value={filteredName}
            onChange={(e) => setFilteredName(e.target.value)}
          />
        </div>
      </div>

      <br />
      <br />
      <br />

      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label>Market:</label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
          >
            <option value="">Select Market</option>
            {markets.map((market) => (
              <option key={market.id} value={market.id}>
                {market.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Add Product</button>
      </form>

      <h3>Products List</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.market} - {product.category}
          </li>
        ))}
      </ul>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product Table</th>
            <th>Delete Products</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td
                style={{
                  textDecoration: product.isBought ? "line-through" : "none",
                  cursor: "pointer",
                }}
                key={product.id}
                onClick={() => {
                  const initalEveryProductIsBought = products.every(
                    (product) => product.isBought === true
                  );

                  let replacedProducts = products.map((productItem) => {
                    if (productItem.id === product.id) {
                      productItem.isBought = true;
                    }
                    return productItem;
                  });
                  setProducts(replacedProducts);

                  if (
                    !initalEveryProductIsBought &&
                    products.every((product) => product.isBought === true)
                  ) {
                    alert("Shopping completed!");
                    jsConfetti.addConfetti();
                  }
                }}
              >
                {product.name}
              </td>
              <td>
                <Button
                  onClick={() => deleteById(product.id)}
                  variant="success"
                >
                  Delete Product
                </Button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ProductAddition;
