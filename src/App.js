import React from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="banner">
        <div className="banner-content">
          <h1>NEW COLLECTIONS</h1>
          <p>20% OFF</p>
          <button>SHOP NOW</button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9"
          alt="Banner"
          className="banner-img"
        />
      </header>
      <section className="category-row">
        <span>Shop by Category</span>
        <div className="categories">
          <div>Women</div>
          <div>Men</div>
          <div>Teens</div>
          <div>Kids</div>
          <div>Baby</div>
        </div>
      </section>
      <main>
        <RegisterForm />
        <LoginForm />
      </main>
    </div>
  );
}

export default App;
