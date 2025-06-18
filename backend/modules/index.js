import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialect: "postgres", 
  logging: false,
});

const Product = sequelize.define("Product", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

const Review = sequelize.define("Review", {
  productId: {
    type: Sequelize.INTEGER,
    references: {
      model: Product,
      key: "id",
    },
    allowNull: false,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
  },
});

Product.hasMany(Review, { foreignKey: "productId" });
Review.belongsTo(Product, { foreignKey: "productId" });

const db = {
  sequelize,
  Product,
  Review,
};

export default db;
