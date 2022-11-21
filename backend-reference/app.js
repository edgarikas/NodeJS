const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Connection to DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => console.log('Server running on port:' + PORT));
  })
  .catch((e) => console.log(e));

const { User, Movie, Order } = require('./models');

// Routes
// -- POST /api/users/signup    |   User signup (creates new user)
app.post('/api/users/signup', async (req, res) => {
  const newUserData = req.body;
  try {
    const isUserExist = await User.findOne({ email: newUserData.email });

    if (!isUserExist) {
      const newUser = new User(newUserData);

      const createdUser = await newUser.save();

      res.json({
        message: 'User created',
        user: createdUser,
      });
    } else {
      res.json({ message: 'User with given email already exists' });
    }
  } catch (error) {
    console.log(error);
  }
});

// -- POST /api/users/login     |   User login (connects existing user)
app.post('/api/users/login', async (req, res) => {
  const userData = req.body;

  try {
    const user = await User.findOne(userData);

    if (user) {
      res.json({ message: 'User founded', user });
    } else {
      res.json({ message: 'User with given email and password not found' });
    }
  } catch (error) {
    console.log(error);
  }
});

// -- POST /api/movies          |   Movie creation (creates new movie)
app.post('/api/movies', async (req, res) => {
  const { userId, movie_name, movie_category, movie_rent_price, is_available } =
    req.body;

  const newMovie = {
    user_id: userId,
    movie_name,
    movie_category,
    movie_rent_price,
    is_available,
  };

  try {
    const movie = new Movie(newMovie);

    await movie.save();

    res.json({ message: 'Movie added' });
  } catch (error) {
    console.log(error);
  }
});

// -- GET /api/movies           |   Movie listing (retrieving all movies)
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});

    const availableMovies = [...movies]
      .map((movie) => {
        const normalizedMovie = movie.toObject();

        normalizedMovie.userId = normalizedMovie.user_id.toString();
        delete normalizedMovie.user_id;

        return normalizedMovie;
      })
      .filter((movie) => movie.is_available);

    res.json(availableMovies);
  } catch (error) {
    console.log(error);
  }
});

// -- GET /api/users/:id         |   User information (retrieving user information and his movies and orders)
app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    const allMovies = await Movie.find({});
    const userMovies = allMovies
      .filter((movie) => movie.user_id.toString() === userId)
      .map((movie) => ({
        ...movie.toObject(),
        userId: movie.user_id.toString(),
      }));

    const orders = await Order.find({ user_id: userId });

    const ordersWithMoviesData = [...orders].reduce((total, order) => {
      let newOrder;

      allMovies.forEach((movie) => {
        if (order.movie_id.toString() === movie._id.toString()) {
          newOrder = {
            movieOwnerId: movie._id.toString(),
            movie_name: movie.movie_name,
            movie_category: movie.movie_category,
            movie_rent_price: movie.movie_rent_price,
            return_days: order.return_days,
          };
        }
      });

      total.push(newOrder);

      return total;
    }, []);

    res.json({
      ...user.toObject(),
      movies: userMovies,
      orders: ordersWithMoviesData,
    });
  } catch (error) {
    console.log(error);
  }
});

// -- PUT /api/movies/:id       |   Movie update and order creation
app.put('/api/movies/:id', async (req, res) => {
  const userId = req.params.id;
  const orderData = req.body;

  try {
    const movie = await Movie.findOne({
      user_id: orderData.movieOwnerId,
      movie_name: orderData.movie_name,
    });
    console.log(movie);

    await Movie.findByIdAndUpdate(movie._id, { is_available: false });

    const newOrder = {
      movie_id: movie._id,
      user_id: userId,
      return_days: 30,
    };

    const order = new Order(newOrder);

    await order.save();

    res.json({ message: 'Movie rented' });
  } catch (error) {
    console.log(error);
  }
});
