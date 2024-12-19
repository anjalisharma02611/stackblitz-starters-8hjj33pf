let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: "./bd4/database.sqlite",
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {

  let query = " SELECT * from restaurants";
  let result = await db.all(query, []);
  return { restaurants: result };
}

app.get("/restaurants", async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    console.log(result);
    console.log(result.restaurants.length)
    if (result.restaurants.length == 0) {
     return res.status(404).json({ message: "No Restaurants Found" })
    }
    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json({ error: ex })
  }

})

async function fetchRestaurantsById(id) {
  let query = "select * from restaurants where id =?";
  let result = await db.all(query, [id]);
  return { restaurants: result }
}

app.get("/restaurants/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchRestaurantsById(id);
    if (result.restaurants.length == 0) {
     return res.status(404).json({ message: "No Restaurants Found" })
    }
    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json({ error: ex })
  }
})

async function fetchRestaurantsByCuisine(cuisine) {
  let query = "select * from restaurants where cuisine = ?";
  let result = await db.all(query, [cuisine]);
  return { restaurants: result };
}

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let result = await fetchRestaurantsByCuisine(cuisine);
    if (result.restaurants.length == 0) {
      return res.status(404).json({ message: "No Restaurants Found" })
    }
    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json({ error: ex })
  }

})

// http://localhost:3000/restaurants/filter?isVeg=true&hasOutdoorSeating=true&isLuxury=false

async function fetchRestaurantsByFilter(isVeg,hasOutdoorSeating ,isLuxury) {
  let query = "select * from restaurants where isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ? ";
  let result = await db.all(query,[isVeg,hasOutdoorSeating ,isLuxury]);
  return { restaurants: result };
}

app.get("/restaurants/filter", async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    
    let result = await fetchRestaurantsByFilter(isVeg,hasOutdoorSeating ,isLuxury);
    if (result.restaurants.length == 0) {
      return res.status(404).json({ message: "No Restaurants Found" })
    }
    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json({ error: ex })
  }

})


async function sortByRating() {
  let query = "select * from restaurants ORDER BY rating DESC";
  let result = await db.all(query,[]);
  return { restaurants: result };
}

app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    let result = await sortByRating();
    if (result.restaurants.length == 0) {
     return  res.status(404).json({ message: "No Restaurants Found" })
    }
    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json({ error: ex })
  }

})


async function fetchAllDishes() {
  let query = "select * from dishes";
  let result = await db.all(query,[]);
  return { dishes: result };
}

app.get("/dishes", async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.dishes.length == 0) {
      return res.status(404).json({ message: "No Dishes Found" })
    }
    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json({ error: ex })
  }

})


async function fetchDishesById(id) {
  let query = "select * from dishes where id =?";
  let result = await db.all(query, [id]);
  return { dishes: result }
}

app.get("/dishes/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchDishesById(id);
    if (result.dishes.length == 0) {
      return res.status(404).json({ message: "No Dishes Found" })
    }
    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json({ error: ex })
  }
})

async function fetchDishesByFilter(isVeg) {
  let query = "select * from dishes where isVeg =?";
  let result = await db.all(query, [isVeg]);
  return { dishes: result };
}

app.get("/dishes/filter/", async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let result = await fetchDishesByFilter(isVeg);
    if (result.dishes.length == 0) {
      return res.status(404).json({ message: "No Dishes Found" })
    }
    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json({ error: ex })
  }

})



async function sortDishesByPrice() {
  let query = "select * from dishes order by price";
  let result = await db.all(query, []);
  return { dishes: result };
}

app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    let result = await sortDishesByPrice();
    if (result.dishes.length == 0) {
      return res.status(404).json({ message: "No Dishes Found" })
    }
    res.status(200).json(result);
  } catch (ex) {
    res.status(500).json({ error: ex })
  }

})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));