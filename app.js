const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API GET

app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT
    movie_name
    FROM 
    movie;`;
  const movieArray = await db.all(getMovieQuery);
  response.send(
    movieArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
  //response.send(movieArray.map((eachMovie) => ans(eachMovie)));
  //response.send(moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
});

//API POST

/*app.post("/movies/", async (request, response => {
    const movieDetails = request.body;
    const {directorId, movieName, leadActor} = movieDetails;
    const addMovieQuery = `
    INSERT INTO 
    movie (director_id, movie_name, lead_actor)
    VALUES
    (
        ${directorId},
        '${movieName}',
        '${leadActor}'
    );`;
    const dbResponse = await db.run(addMovieQuery);
    response.send("Movie Successfully Added");
}));*/

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  /*const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;*/
  const addMovieQuery = `
    INSERT INTO
    movie (director_id, movie_name, lead_actor)
    VALUES
    (
         ${directorId},
        '${movieName}',
        '${leadActor}' 
    );`;
  const dbResponse = await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

//API GET
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT 
    *
    FROM 
    movie
    WHERE 
    movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});

//API PUT

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
  UPDATE movie
            SET
              director_id = ${directorId},
              movie_name = '${movieName}',
              lead_actor = '${leadActor}'
            WHERE movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM 
    movie 
    WHERE 
    movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//API GET DIRECTORS

app.get("/directors/", async (request, response) => {
  const getMovieQuery = `
    SELECT
    *
    FROM 
    director;`;
  const directorArray = await db.all(getMovieQuery);
  const ans = (dbObject) => {
    return {
      directorId: dbObject.director_id,
      directorName: dbObject.director_name,
    };
  };
  response.send(directorArray.map((eachMovie) => ans(eachMovie)));
});

//API GET FOR DIRECTORS AND MOVIE

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { movieId } = request.params;
  const getDirectorsMovieQuery = `
    SELECT 
    *
    FROM 
    movie
    WHERE
    director_id = ${directorId}`;
  const movieArray = await db.all(getDirectorsMovieQuery);
  response.send(movieArray);
});
module.exports = app;
