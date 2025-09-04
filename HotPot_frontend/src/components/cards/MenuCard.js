
const MenuCard = ({ menu }) => (
  <div
    className="card h-100 shadow-sm"
    style={{ borderRadius: "1rem", border: "none" }}
  >
    <div className="card-body">
      <h6
        className="card-title"
        style={{ color: "#FFC107", fontWeight: "bold" }}
      >
        {menu.name}
      </h6>
      <p className="card-text text-muted mb-2">
        {menu.category} • ₹{menu.price}
      </p>
      <span
        className={`badge ${
          menu.dietaryInfo === "VEG"
            ? "bg-success"
            : menu.dietaryInfo === "VEGAN"
            ? "bg-info"
            : "bg-danger"
        }`}
        style={{ fontSize: "0.9em" }}
      >
        {menu.dietaryInfo}
      </span>
    </div>
  </div>
);

export default MenuCard;
