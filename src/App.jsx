import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import PostPage from "./pages/PostPage";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/place/:placeId" element={<PostPage />} />
            </Routes>
        </Router>
    );
}

export default App;
