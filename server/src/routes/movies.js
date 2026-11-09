import { Router } from "express";
import { Movie, SearchMovies } from "../services/tmdb";
const router = Router();
router.get("/trending/:mediaType/:timeWindow", async (req, res) => {
    const { mediaType, timeWindow } = req.params;
    if (mediaType !== 'movie' && mediaType !== 'tv') {
        return res.status(400).json({ error: 'type must be movie or tv' });
    }
    if (timeWindow !== 'day' && timeWindow !== 'week') {
        return res.status(400).json({ error: 'window must be day or week' });
    }
    try {
        res.json({ results: await Movie(mediaType, timeWindow) });
    }
    catch (e) {
        console.error(e);
        res.status(502).json({ error: 'Movie service unavailable' });
    }
});
router.get("/search", async (req, res) => {
    const query = req.query.q;
    if (typeof query !== "string" || !query.trim()) {
        return res.status(400).json({ error: "q is required" });
    }
    try {
        res.json({ results: await SearchMovies(query) });
    }
    catch (error) {
        console.error(error);
    }
});
export default router;
