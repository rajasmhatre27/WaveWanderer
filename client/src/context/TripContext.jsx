import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Context (Khaali Dabba) Banana
const TripContext = createContext();

// 2. Provider (Dabbe ko Data se bharne wala) Banana
export const TripProvider = ({ children }) => {
  // Yeh wahi logic hai jo humne pehle page mein likha tha, bas ab yahaan shift kar diya
  const [tripItems, setTripItems] = useState(() => {
    const saved = localStorage.getItem("my_trip_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // LocalStorage mein save karne ka logic
  useEffect(() => {
    localStorage.setItem("my_trip_cart", JSON.stringify(tripItems));
  }, [tripItems]);

  // Item add karne ka function
  const addToTrip = (place) => {
    // Check karo ki item pehle se toh nahi hai
    const exists = tripItems.find((item) => item.place_id === place.place_id);
    if (!exists) {
      setTripItems([...tripItems, place]);
    }
  };

  // Item remove karne ka function
  const removeFromTrip = (placeId) => {
    setTripItems(tripItems.filter((item) => item.place_id !== placeId));
  };

  // 3. Value Object: Jo data hum sabko dena chahte hain
  const value = {
    tripItems,
    addToTrip,
    removeFromTrip,
    tripCount: tripItems.length, // Count bhi bhej dete hain taaki Navbar ko aasaani ho
  };

  // 4. Provider ko return karo
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

// 5. Custom Hook (Taaki hum aasaani se use kar sakein)
export const useTrip = () => {
  return useContext(TripContext);
};
