// const express = require("express");
// we changed in package.json type to module so can't use const express instead use import express

// API DOCS
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from 'swagger-jsdoc';
// Normal Packages
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import 'express-async-errors';

// Securty Packages
import halmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db.js';
import jobRoutes from './routes/jobsRoutes.js';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

// Dotenv Config
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(halmet());
app.use(xss());
app.use(mongoSanitize());

// PORT
const PORT = process.env.PORT;

// Swagger API Config
// Swagger API Options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Job Portal Application',
            description: 'NodeJS ExpressJS Job Portal Application'
        },
        servers: [
            {
                url: "https://job-portal-rest-api.onrender.com"
            }
        ]
    },
    apis: ['./routes/*.js'],
};

const spec = swaggerDoc(options)
// Db Connect
connectDB();

// validation middleware
app.use(errorMiddleware)

// Route
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);

// homeRoute Root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.brightMagenta.bgGreen.bold);
})
