import "../css/SearchServices.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchServices() {

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {

    if (keyword.trim() === "") {
      navigate("/services");
    } else {
      navigate(`/services?search=${keyword}`);
    }

  };

  return (

    <section className="search-services">

      <h2>🔍 Search Government Services</h2>

      <p>
        Search for government services like Aadhaar, Passport,
        Driving License, Income Certificate and many more.
      </p>

      <div className="search-box">

        <input
          type="text"
          value={keyword}
          placeholder="Search Government Service..."
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button onClick={handleSearch}>
          Search
        </button>

      </div>

    </section>

  );
}

export default SearchServices;