import { useState } from "react";
import FilterBar from "../../components/search/FilterBar";
import MenuCard from "../../components/cards/MenuCard";
const dummyMenus = [
  { id: 1, name: "Paneer Butter Masala", category: "Main Course", price: 250, description: "Creamy tomato gravy with paneer" },
  { id: 2, name: "Chicken Biryani", category: "Main Course", price: 300, description: "Fragrant rice with chicken" },
  { id: 3, name: "Spring Rolls", category: "Starters", price: 120, description: "Crispy veggie rolls" },
  { id: 4, name: "Gulab Jamun", category: "Desserts", price: 90, description: "Sweet dumplings in sugar syrup" },
];

export default function MenuPage() {
  const [menus, setMenus] = useState(dummyMenus);

  const handleFilter = ({ search, category, minPrice, maxPrice }) => {
    let filtered = [...dummyMenus];

    if (search) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter(m => m.category === category);
    }
    if (minPrice) {
      filtered = filtered.filter(m => m.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(m => m.price <= parseInt(maxPrice));
    }

    setMenus(filtered);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3">Our Menu</h3>
      <FilterBar onFilter={handleFilter} />

      <div className="row g-3">
        {menus.length > 0 ? (
          menus.map(menu => (
            <div className="col-md-3" key={menu.id}>
              <MenuCard menu={menu} />
            </div>
          ))
        ) : (
          <div className="text-center text-muted">No items found</div>
        )}
      </div>
    </div>
  );
}
