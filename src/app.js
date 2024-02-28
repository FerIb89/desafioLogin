import express from "express"
import viewRouter from "./routes/view.router.js"
import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/carts.router.js"
import {__dirname} from "./utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

import sessionsRouter from "./routes/sessions.js";//////////////////////
import viewsRouter from "./routes/views.js";///////////////////////////


import connectToDB from "./config/configServer.js"

//socketservers
import socketProducts from "./listeners/socketProducts.js"
import socketChatServer from "./listeners/socketChatServer.js"
const app=express()
const PORT=process.env.PORT||8080;

//let mongoBase = 'mongodb+srv://lstucchi:tGrjLHdnChKYsgoN@cluster0.s4wk2id.mongodb.net/login?retryWrites=true&w=majority'

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))

app.engine("handlebars",handlebars.engine())
app.set('view engine', 'handlebars');
app.set("views",__dirname+"/views")

///////////////////////////////////
// app.use(session({
//     store:MongoStore.create({
//         mongoUrl:mongoBase,
//         ttl:15,
//     }),
//     secret:"secretCode",
//     resave:true,
//     saveUninitialized:true
// }))
///////////////////


app.use("/api/sessions", sessionsRouter);////////////
app.use("/", viewsRouter);///////////////////////////

app.use(cookieParser());//////////////////

app.use("/api",productRouter)
app.use("/api",cartRouter)
app.use("/",viewRouter)


const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}\nAcceder a:`);
        console.log(`\t1). http://localhost:${PORT}/`)
        console.log(`\t2). http://localhost:${PORT}/realtimeproducts`);
        console.log(`\t3). http://localhost:${PORT}/cart/65c28522c1483aaada1fb25c`);

    }
    catch (err) {
        console.log(err);
    }
});
connectToDB()
const socketServer= new Server(httpServer)


socketProducts(socketServer)
socketChatServer(socketServer)