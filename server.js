const express = require("express"); 
const fs = require("fs"); 
const path = require("path"); 
const database = require("./db/db.json"); 
const uniqid = require("uniqid"); 

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true })); 
app.use(express.static("public")); 

app.get("/api/notes", (req, res) => {
    res.json(database); 
}); 

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);  

app.delete('/api/notes/:id', (req, res) => {
  for (i = 0; i < database.length; i++) {
    if (req.params.id === database[i].id) {
      database.splice(i, 1);
      console.log(database);
      fs.writeFile(`./db/db.json`, JSON.stringify(database), (err) =>
        err ? console.error(err) : console.log( "Responce has been removed.")
      );
      res.send("removed");
      return;
    }
  }
});

app.post("/api/notes", (req, res) => {
  const { title, text, id} = req.body;
  
  if( title && text) {
    const newResponce = {
      title, 
      text, 
      id: uniqid()};
      database.push(newResponce)
      
      fs.writeFile(`./db/db.json`, JSON.stringify(database), (err) =>
      err ?
      console.error(err) 
      : console.log(`${newResponce.title} has been written to JSON file`)
      ); 
      
      res.status(200).json(database);
    } else {
      res.status(400).json('Error in posting notes');
    }
  });
  
  
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
  

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
