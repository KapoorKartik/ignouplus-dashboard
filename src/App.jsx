import { useState } from "react";
// import './App.css'
import { Dashboard } from "./components/Dashboard";

function App() {
  if (import.meta.env.MODE !== "import.meta.env.MODE"){
    console.log = console.error = console.warn = () => {};
  }

  return (
    <>
      <Dashboard />
    </>
  );
}

export default App;
