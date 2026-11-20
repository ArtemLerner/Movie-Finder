import { Router } from "express";
import {FindByID, getAllMovies, Movie, SearchMovies} from "../services/tmdb"
import {pool} from "../db";
import {isAuth} from "../middleware/isAuth";
import {validate} from "../middleware/validate";
import {allParams, detailsParams, favoriteBody, searchQuery, trendingParams} from "../schemas"

const router = Router();

router.get("/trending/:mediaType/:timeWindow"
    ,validate("params", trendingParams)
    , async (_req, res) => {

    const { mediaType, timeWindow } = res.locals.params;

    try{
        res.json({results: await Movie(mediaType, timeWindow)});
    }catch(e){
        console.error(e);
        res.status(502).json({ error: 'Movie service unavailable' });
    }
})

router.get("/search",
    validate("query", searchQuery)
    ,async (_req, res) => {
    const query = res.locals.query.q;

    try{
        res.json({results: await SearchMovies(query)})
    }catch{
        res.status(201).json({ error: 'Search results not found' });
    }
})

router.get("/all/:mediaType",
    validate("params", allParams)
    ,async (_req, res) => {
    const { mediaType }= res.locals.params;

    try{
        res.json({results: await getAllMovies(mediaType)});
    }catch (e){
        res.status(500).json({ error: 'error getting movies list:' + e });
    }
})

router.get("/:type/:id"
    ,validate("params", detailsParams)
    , async (_req, res) => {

    const { type, id } = res.locals.params;

    try{
        res.json({results: await FindByID(id, type) });
    }catch(e){
        console.error(e);
    }
})



router.post("/favorite"
    , validate("body", favoriteBody)
    ,isAuth, async (_req, res) => {
    const {type, id } = res.locals.body;

    const user = res.locals.user.id;

    if(!user) return res.status(400).json({ error: 'user must be provided' });

    try{
        await pool.query(`
        INSERT INTO favorites (id, tmdb_id,media_type)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
        `, [user, id, type]);

        return res.status(200).json({ ok: true });
    }catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Server error" });
    }
})

router.get("/favorites", isAuth, async (req, res) => {
    const user = res.locals.user.id;

    if(user){
            try{
                const data = await pool.query(`
                SELECT * FROM favorites WHERE id = $1`, [user])

                if(data.rows.length > 0){
                    const dataMovies = await Promise.all(
                        data.rows.map(item => FindByID(item.tmdb_id, item.media_type))
                    )

                    return res.status(200).json({movies: dataMovies});

                }else {
                    return res.status(201).json({movies: data.rows[0], error: "No movies found"});
                }
            }catch(e){
                return res.status(400).json({ error: "Server error:" + e });
            }
    }else {
        return res.status(404).json({ error: "No user found" });
    }
})

router.delete("/favorite/:type/:id"
    ,validate("params", detailsParams)
    , isAuth, async (_req, res) => {

    const {type, id } = res.locals.params;

    const user = res.locals.user.id;

    if(!user) return res.status(400).json({ error: 'user must be provided' });

    try {
        await pool.query(
            `
            DELETE FROM favorites
            WHERE id = $1
           AND tmdb_id = $2
           AND media_type = $3`,
            [user, String(id), type]
        );

        return res.status(200).json({ ok: true });
    }catch(e){
        return res.status(400).json({ error: "Server error:" + e });
    }
})


export default router;
