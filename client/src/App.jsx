import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Header from '../components/Header';
import Home from '../pages/Home';
import Register from "../pages/Register";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </Router>
  );
}

export default App;
