import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());// para que express entienda los JSON

// la conexión a la base de datos
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "likeme",
    password: "12251225",
    port: 5432,
});

app.get("/posts", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posts");
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener los posts", error);
        res.status(500).json({ message: "Error al obtener los posts" });
    }
});

app.post("/posts", async (req, res) => {
    const { titulo, img, descripcion } = req.body;
    try {
        const query = "INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3) RETURNING *";
        const values = [titulo, img, descripcion];
        const result = await pool.query(query, values);
        console.log("Post creado:", result.rows[0]); // imprime el post creado
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error al crear el post", error);
        res.status(500).json({ message: "Error al crear el post" });
    }
});

// Ruta para eliminar un post
app.delete("/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM posts WHERE id = $1", [id]);
        res.status(200).json({ message: "Post eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el post", error);
        res.status(500).json({ message: "Error al eliminar el post" });
    }
});

// Ruta para dar like a un post
app.put("/posts/like/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("UPDATE posts SET likes = likes + 1 WHERE id = $1", [id]);
        res.status(200).json({ message: "Like agregado correctamente" });
    } catch (error) {
        console.error("Error al dar like al post", error);
        res.status(500).json({ message: "Error al dar like al post" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
