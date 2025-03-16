import './App.css';
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Upload from "./pages/Upload.tsx";

function App() {
    return (
        <Router>
            <nav className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between">
                    <Link to="/" className="font-bold">
                        Cloud Drive
                    </Link>
                    <Link to="/upload" className="hover:underline">
                        Upload
                    </Link>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upload" element={<Upload />} />
            </Routes>
        </Router>
    );
}

export default App;