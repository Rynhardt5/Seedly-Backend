require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");
const userRoutes = require("./routes/userRoutes");
const seedRoutes = require("./routes/seedRoutes");
const imageRoutes = require("./routes/imageRoutes");
const HttpError = require("./utils/HttpError");
const handleError = require("./utils/handleError");
const app = express();

// START MONGODB CONNECTION
require("./config/mongodb");

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
//setting middleware
app.use(express.static("public"));

app.use("/uploads", express.static(__dirname + "/uploads"));

// ROUTES
app.use("/users", userRoutes);
app.use("/seeds", seedRoutes);
app.use("/images", imageRoutes);

// HANDLE ERRORS PASSED THROUGH NEXT
app.use(handleError);

// IF A ROUTE ISN'T FOUND
app.use((req, res, next) => {
  throw new HttpError("Could not find this route.", 404);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port:${PORT}`));
