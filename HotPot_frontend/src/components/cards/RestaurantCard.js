
const RestaurantCard = ({ restaurant }) => (
  <div
    className="card shadow-sm h-100"
    style={{ borderRadius: "1rem", border: "none" }}
  >
    <div className="card-body">
      <h5
        className="card-title"
        style={{ color: "#FFC107", fontWeight: "bold" }}
      >
        {restaurant.name}
      </h5>
      <p className="card-text text-muted">{restaurant.location}</p>
      <a
        href={`/restaurants/${restaurant.id}`}
        className="btn btn-warning"
        style={{ color: "#fff", fontWeight: "bold" }}
      >
        View Details
      </a>
    </div>
  </div>
);

export default RestaurantCard;
