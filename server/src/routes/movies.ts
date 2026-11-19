import { Router } from "express";
import {FindByID, Movie, SearchMovies} from "../services/tmdb"
import {pool} from "../db";
import {isAuth} from "./auth"

const router = Router();

router.get("/trending/:mediaType/:timeWindow", async (req, res) => {
    const { mediaType, timeWindow } = req.params;

    if (mediaType !== 'movie' && mediaType !== 'tv') {
        return res.status(400).json({ error: 'type must be movie or tv' });
    }
    if (timeWindow !== 'day' && timeWindow !== 'week') {
        return res.status(400).json({ error: 'window must be day or week' });
    }

    try{
        res.json({results: await Movie(mediaType, timeWindow)});
    }catch(e){
        console.error(e);
        res.status(502).json({ error: 'Movie service unavailable' });
    }
})

router.get("/search", async (req, res) => {
    const query = req.query.q;

    if (typeof query !== "string" || !query.trim()) {
        return res.status(400).json({ error: "q is required" });
    }
    if(query === ''){
        return res.status(400).json({ error: "query must be provided" });
    }

    try{
        res.json({results: await SearchMovies(query)})
    }catch{
        res.status(201).json({ error: 'Search results not found' });
    }
})

router.get("/:type/:id", async (req, res) => {
    const { type, id } = req.params;

    if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ error: 'type must be movie or tv' });
    }

    if (typeof type !== "string" || !id.trim()) {
        return res.status(400).json({ error: "id is required" });
    }
    try{
        res.json({results: await FindByID(id, type) });
    }catch(e){
        console.error(e);
    }
})



router.post("/favorite", isAuth, async (req, res) => {
    const {type, id } = req.body;
    const user = res.locals.user.id;

    if(!user) return res.status(400).json({ error: 'user must be provided' });

    if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ error: 'type must be movie or tv' });
    }

    try{
        await pool.query(`
        INSERT INTO favorites (id, tmdb_id,media_type)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
        `, [user, id, type]);

        res.status(200).json({ ok: true });
    }catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Server error" });
    }
})

router.get("/favorites", isAuth, async (req, res) => {
    const user = res.locals.user.id;

    if(user){
            const data = await pool.query(`
            SELECT * FROM favorites WHERE id = $1`, [user])

            if(data.rows.length > 0){
                const dataMovies = await Promise.all(
                    data.rows.map(item => FindByID(item.tmdb_id, item.media_type))
                )

                res.status(200).json({movies: dataMovies});
            }else {
                res.status(201).json({movies: data.rows[0], error: "No movies found"});
            }
    }else{
        res.status(400).json({ error: 'email is required' })
    }
})

router.delete("/favorite/:type/:id", isAuth, async (req, res) => {
    const {type, id } = req.params;

    const user = res.locals.user.id;
    if(!user) return res.status(400).json({ error: 'user must be provided' });

    if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ error: 'type must be movie or tv' });
    }

    await pool.query(
        `
            DELETE FROM favorites
            WHERE id = $1
           AND tmdb_id = $2
           AND media_type = $3`,
        [user, String(id), type]
    );

    res.status(200).json({ ok: true });

})


export default router;
