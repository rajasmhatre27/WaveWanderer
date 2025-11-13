import React from "react";
// 1. Apni nayi Routes file ko import karo
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

// (Hum agle step mein Navbar aur Footer banakar yahaan import karenge)
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Page ka main content yahaan load hoga */}
      <main className="grow">
        <AppRoutes /> {/* <-- Saara URL logic ab yeh file sambhalegi */}
      </main>

      {/* <Footer />  <-- Yahaan hamara Footer aayega (har page par dikhega) */}
    </div>
  );
};

export default App;
