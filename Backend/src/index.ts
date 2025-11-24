import cors from "cors"
import authRouter from "./routes/auth.routes"
import postRoute from "./routes/postRoute"
import dotenv from "dotenv"
import express, { Application, Request, Response } from "express"

import mongoose from "mongoose"

dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
)

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/post", postRoute)

app.use(cors({origin:"*"}))

app.get("/",(req: Request, res: Response) =>{
    res.send("Hello TS Express")
}) 

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected")
  })
  .catch((err) => {
    console.error(`DB connection fail: ${err}`)
    process.exit(1)
  })

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on ${SERVER_PORT}`)
})
