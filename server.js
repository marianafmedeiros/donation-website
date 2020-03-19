
// configure server
const express = require("express")
const server = express()


//configure server to present static archives
server.use(express.static("public"))

//enable form body

server.use(express.urlencoded({extended: true}))


//configure database conection

const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'donate'
})



// configure template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true

})


// configure page views
server.get('/', function(req, res) {
  db.query('SELECT * FROM donors ORDER BY id DESC LIMIT 4;', function(err, result){
    if (err) return res.send("erro no banco de dados")
    const donors = result.rows

    return res.render("index.html", {donors})

  })
})

server.post("/", function(req,res){
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood
  
  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.")
  }


  const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1,$2,$3)
  `
  const values = [name, email, blood]

  db.query(query, values, function (err) {
    if (err) return res.send("erro no banco de dados")

    return res.redirect("/")
  })

  
})


server.listen(3001, function(){
  console.log("server is running")
})