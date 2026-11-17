import { Router } from "express";
import {FindByID, Movie, SearchMovies} from "../services/tmdb"
import {pool} from "../db";

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

    try{
        res.json({results: await SearchMovies(query)})
    }catch (error){
        console.error(error);
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

    res.json({results: await FindByID(id, type) });
})

router.post("/favorite", async (req, res) => {
    const {emailUser, type, id } = req.body;

    if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ error: 'type must be movie or tv' });
    }

    const resPool = await pool.query(
        `
        INSERT INTO favorites (id, tmdb_id,media_type)
        SELECT id, $2, $3 FROM users WHERE email = $1
        `, [emailUser, id, type])

    if(resPool.rowCount === 0){
        res.status(400).json({ error: 'email is required' })
    }
})




router.post("/get-favorite", async (req, res) => {
    const { email } = req.body;

    const user = await pool.query(`
    SELECT id FROM users WHERE email = $1`, [email])

    if(user.rows[0] !== 0){

        const userID = user.rows[0]?.id
    //     TODO
    //      parse all favorite table for ID user where EMAIL = email
            const data = await pool.query(`
            SELECT * FROM favorites WHERE id = $1`, [userID])

            if(data.rows.length > 0){
                res.status(200).json({movies: data.rows})
            }
    }
})




export default router;
