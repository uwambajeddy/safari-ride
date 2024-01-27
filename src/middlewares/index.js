import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import favicon from "serve-favicon";
import requestMethods from "./requestMethods.js";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

export default (app) => {
  // if (process.env.NODE_ENV === "development") {
  //   app.use(morgan("dev"));
  // }
  app.use(requestMethods);
  app.use(compression());
  app.use(favicon("public/favicon.ico"));
  app.use(express.static("public"));
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
};
