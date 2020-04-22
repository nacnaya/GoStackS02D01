const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(req, res, next){
  const {id} = req.params;

  if(!isUuid(id)){
      return res.status(400).json({ error: 'Invalid repositorie ID.'});
  }

  return next();
}

app.use('/repositories/:id', validateId);



app.get("/repositories", (req, res) => {
    const {title} = req.query;
    const result = title
    ? repositories.filter(repo => repo.title.includes(title))
    : repositories;

    return res.json(result);
});

app.post("/repositories", (req, res) => {
  const {title , url , techs} = req.body;
  const repositorie = {id: uuid(),  title, url, techs, likes: 0};

  repositories.push(repositorie);
  return res.json(repositorie);

});

app.put("/repositories/:id", (req, res) => {
  const {id} = req.params;  
  const {title, url , techs} = req.body;

  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if(repoIndex < 0){
    return res.status(400).json({error: 'Repositorie not found'});
  }

  repositories[repoIndex].title = title;
  repositories[repoIndex].url = url;
  repositories[repoIndex].techs = techs;

  return res.json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (req, res) => {
    const {id} = req.params;

    const repoIndex = repositories.findIndex(repo => repo.id == id);

    if(repoIndex < 0){
        return response.status(400).json({error: 'Repositorie not found'});
    }

    repositories.splice(repoIndex, 1);

    return res.status(204).send();
  
});

app.post("/repositories/:id/like", (req, res) => {
  const {id} = req.params;  

  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if(repoIndex < 0){
    return res.status(400).json({error: 'Repositorie not found'});
  }
  let likes = repositories[repoIndex].likes;
  repositories[repoIndex].likes = likes+1;

  return res.json(repositories[repoIndex]);
  
});

module.exports = app;
