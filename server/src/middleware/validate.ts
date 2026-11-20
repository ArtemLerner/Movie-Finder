import type { RequestHandler} from "express";
import type { ZodType } from "zod";

type Src = "body" | "params" | "query";


export const validate =
    (src: Src, schema: ZodType): RequestHandler =>
        (req, res, next) => {
            const r = schema.safeParse(req[src]);
            if (!r.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    issues: r.error.issues
                        .map(i => (
                            {path: i.path.join("."),
                                message: i.message})),
                });
            }
            res.locals[src] = r.data;
            next();
        }

