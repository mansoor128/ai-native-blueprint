import { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { listFavorites } from "./api";
import HomePage from "./pages/HomePage";
import MyListPage from "./pages/MyListPage";

export default function App() {
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const refreshFavorites = useCallback(async () => {
    try {
      const data = await listFavorites();
      setFavoriteIds(new Set(data.map((item) => item.movieId)));
    } catch {
      setFavoriteIds(new Set());
    }
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  return (
    <div className="shell">
      <nav className="top-nav">
        <Link to="/" className="brand">
          ReelList
        </Link>
        <div className="nav-links">
          <Link to="/">Browse</Link>
          <Link to="/my-list">My List</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage favoriteIds={favoriteIds} />} />
        <Route
          path="/my-list"
          element={<MyListPage onChanged={refreshFavorites} />}
        />
      </Routes>
    </div>
  );
}
