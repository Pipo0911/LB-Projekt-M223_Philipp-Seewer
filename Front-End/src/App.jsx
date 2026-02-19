import { Routes, Route } from "react-router-dom";
import Layout from "./ui/Layout";
import Home from "./pages/Home";
import Games from "./pages/Games";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </Layout>
  );
}