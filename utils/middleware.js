const User = require("../models/user");
const { response } = require("../app");
const logger = require("./logger");
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
  logger.info("Method", request.method);
  logger.info("Path", request.path);
  logger.info("body", request.body);
  logger.info("---");
  next();
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    const token = authorization.substring(7);
    request.token = token;
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    request.user = null;
  } else {
    const decodeToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodeToken.id) {
      request.user = null;
    } else {
      request.user = await User.findById(decodeToken.id);
    }
  }
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
