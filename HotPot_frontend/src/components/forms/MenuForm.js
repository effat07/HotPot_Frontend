import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuService from "../../services/MenuService";
import RestaurantService from "../../services/RestaurantService";
import OwnerNavbar from "../layout/OwnerNavbar";
import { AuthContext } from "../../context/AuthContext";

export default function MenuForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { user, loading: authLoading } = useContext(AuthContext);

    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);

    const ownerId = user?.userId;
    const role = user?.role;

   
    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!ownerId || role !== "RESTAURANT") {
            setError("Only restaurant owners can manage menu items.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await RestaurantService.getRestaurantsByOwner(ownerId);
                const data = Array.isArray(res.data) ? res.data : [res.data];

                if (data.length > 0) {
                    setRestaurant(data[0]);

                    if (isEdit) {
                        const menuRes = await MenuService.getMenuById(id);
                        const menu = menuRes.data;
                        setFormData({
                            name: menu.name || "",
                            description: menu.description || "",
                            category: menu.category || "",
                            dietaryInfo: menu.dietaryInfo || "VEG",
                            taste: menu.taste || "MILD",
                            availabilitySlot: menu.availabilitySlot || "LUNCH",
                            nutritionCalories: menu.nutritionCalories ?? "",
                            nutritionProtein: menu.nutritionProtein ?? "",
                            nutritionCarbs: menu.nutritionCarbs ?? "",
                            nutritionFat: menu.nutritionFat ?? "",
                            price: menu.price ?? "",
                            inStock: menu.inStock ?? true,
                        });
                    }
                } else {
                    setError("No restaurant found for this owner. Please create one first.");
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load menu details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ownerId, role, id, isEdit, authLoading]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        dietaryInfo: "VEG",
        taste: "MILD",
        availabilitySlot: "LUNCH",
        nutritionCalories: "",
        nutritionProtein: "",
        nutritionCarbs: "",
        nutritionFat: "",
        price: "",
        inStock: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!restaurant) {
            setError("Restaurant details not loaded.");
            return;
        }
        
        const menuPayload = {
            menuId: isEdit ? parseInt(id) : null,
            restaurantId: restaurant.restaurantId,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            dietaryInfo: formData.dietaryInfo,
            taste: formData.taste,
            availabilitySlot: formData.availabilitySlot,
            nutritionCalories: formData.nutritionCalories ? parseInt(formData.nutritionCalories) : null,
            nutritionProtein: formData.nutritionProtein ? parseInt(formData.nutritionProtein) : null,
            nutritionCarbs: formData.nutritionCarbs ? parseInt(formData.nutritionCarbs) : null,
            nutritionFat: formData.nutritionFat ? parseInt(formData.nutritionFat) : null,
            price: parseFloat(formData.price),
            inStock: formData.inStock,
            image: null,
        };
        
        let request;

        if (imageFile) {
            const formDataObj = new FormData();
            formDataObj.append("menu", new Blob([JSON.stringify(menuPayload)], { type: "application/json" }));
            formDataObj.append("image", imageFile);
            request = isEdit
                ? MenuService.updateMenuWithImage(formDataObj)
                : MenuService.createMenuWithImage(formDataObj);
        } else {
            request = isEdit
                ? MenuService.updateMenu(menuPayload)
                : MenuService.createMenu(menuPayload);
        }
        
        request
            .then(() => navigate("/MenuPage"))
            .catch((err) => {
                console.error("Menu save error:", err.response?.data || err.message);
                setError("Failed to save menu item. " + (err.response?.data?.message || ""));
            });
    };
    
    if (loading || authLoading) {
        return (
            <>
                <OwnerNavbar />
                <div className="container my-5 text-center">
                    <p className="text-muted">Loading...</p>
                </div>
            </>
        );
    }
    
    if (error) {
        return (
            <>
                <OwnerNavbar />
                <div className="container my-5 text-center">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </>
        );
    }

    if (!restaurant) {
        return (
            <>
                <OwnerNavbar  />
                <div className="container my-5 text-center">
                    <div className="alert alert-info">
                        You need to create your restaurant first before adding menu items.
                    </div>
                </div>
            </>
        );
    }
    
    return (
        <>
            <OwnerNavbar  />
            <div className="container my-5">
                <button className="btn btn-warning me-2" onClick={() => navigate(-1)}>&larr;</button>
                <h2 className="text-center fw-bold mb-4" style={{ color: "#FFC107" }}>
                    {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
                </h2>
                <form className="card p-4 shadow" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            required
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Category</label>
                            <input
                                type="text"
                                name="category"
                                className="form-control"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Price (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                className="form-control"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Dietary Info</label>
                            <select
                                name="dietaryInfo"
                                className="form-select"
                                value={formData.dietaryInfo}
                                onChange={handleChange}
                            >
                                <option value="VEG">Veg</option>
                                <option value="NON_VEG">Non-Veg</option>
                                <option value="VEGAN">Vegan</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Taste</label>
                            <select
                                name="taste"
                                className="form-select"
                                value={formData.taste}
                                onChange={handleChange}
                            >
                                <option value="MILD">Mild</option>
                                <option value="SPICY">Spicy</option>
                                <option value="SWEET">Sweet</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Availability Slot</label>
                            <select
                                name="availabilitySlot"
                                className="form-select"
                                value={formData.availabilitySlot}
                                onChange={handleChange}
                            >
                                <option value="BREAKFAST">Breakfast</option>
                                <option value="LUNCH">Lunch</option>
                                <option value="DINNER">Dinner</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        {["nutritionCalories", "nutritionProtein", "nutritionCarbs", "nutritionFat"].map((field, idx) => (
                            <div className="col-md-3 mb-3" key={idx}>
                                <label className="form-label fw-bold">
                                    {field.replace("nutrition", "")}
                                </label>
                                <input
                                    type="number"
                                    name={field}
                                    className="form-control"
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            name="inStock"
                            className="form-check-input"
                            checked={formData.inStock}
                            onChange={handleChange}
                        />
                        <label className="form-check-label">In Stock</label>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Upload Image</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-warning fw-bold w-100">
                        {isEdit ? "Update Menu Item" : "Save Menu Item"}
                    </button>
                </form>
            </div>
        </>
    );
}