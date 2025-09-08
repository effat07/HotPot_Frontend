import { useState } from "react";

export default function FilterBar({ onFilter }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApply = (e) => {
    e.preventDefault();
    onFilter({ search, category, minPrice, maxPrice });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    onFilter({});
  };

  return (
    <div className="card p-3 mb-3 shadow-sm">
      <form className="row g-2" onSubmit={handleApply}>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Main Course">Main Course</option>
            <option value="Starters">Starters</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button type="submit" className="btn btn-warning w-100">Apply</button>
          <button type="button" className="btn btn-secondary w-100" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
}
