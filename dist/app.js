import express, {} from "express";
import cors from 'cors';
import { prisma } from "./app/lib/prisma.js";
const app = express();
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/specialty", async (req, res) => {
    const specialty = await prisma.specialty.findMany();
    res.status(201).json({
        success: true,
        message: "Api is working",
        data: specialty
    });
});
// app.all("/api/auth/*splat", toNodeHandler(auth));
// app.use("/posts", postRouter);
// app.use("/comments", commentRouter)
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
// app.use(notFound)
// app.use(errorHandler)
export default app;
//# sourceMappingURL=app.js.map