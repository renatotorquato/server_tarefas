require("dotenv").config();

const express = require("express");
const App = express();
const mysql = require("mysql2");
const cors = require("cors");

const db = mysql.createPool({
  //Variaveis de anbiente com dados do banco de dados.
  host: process.env.HOST_EVE,
  port: process.env.PORT_EVE,
  user: process.env.USER_EVE,
  password: process.env.PASSWORD_EVE,
  database: process.env.DATABASE_EVE,
});

App.use(cors());
App.use(express.json());

//Para salvar todos dados
App.post("/register", async (req, res) => {
  const { name } = req.body;
  const { date } = req.body;
  const { details } = req.body;
  const status_task = "Aberta";

  let sqlInsert =
    "INSERT INTO tarefas.tbtarefas(nome,data,detalhes,status_task) VALUES(?,?,?,?)";

  db.query(sqlInsert, [name, date, details, status_task], (err, result) => {
    if (err) {
      console.log("Erro ao inserir os dados: " + err);
    }
  });
});

App.delete("/delete", (req, res) => {
  const { cod_task } = req.body;
  let sqlDelet = "DELETE FROM tbtarefa WHERE cod_task = ?";

  db.query(sqlDelet, [cod_task], (err, result) => {
    if (err) console.log("Erro ao deletar " + err);
    else res.send(result);
  });
});

App.put("/edit", (req, res) => {
  const { name } = req.body;
  const { date } = req.body;
  const { details } = req.body;
  const { cod_task } = req.body;
  let sqlEdit =
    "UPDATE tbtarefa SET nome = ?,data = ?,detalhes = ? WHERE cod_task = ?";

  db.query(sqlEdit, [name, date, details, cod_task], (err, result) => {
    if (err) {
      console.log("Erro ao editar " + err);
    } else res.send(result);
  });
});

App.put("/complete", (req, res) => {
  const { cod_task } = req.body;
  const status_task = "Concluída";

  let sqlComplet = "UPDATE tbtarefas SET status_task = ? WHERE cod_task = ?";

  db.query(sqlComplet, [status_task, cod_task], (err, result) => {
    if (err) {
      console.log("Erro ao editar " + err);
    } else res.send(result);
  });
});

//Para pegar todos dados armazenados
App.get("/getTaskCompleted", (req, res) => {
  let SQL = "SELECT * FROM tarefas.tbtarefas WHERE status_task = 'Concluída';";

  db.query(SQL, (err, result) => {
    if (err) console.log("Erro ao pegar os dados: " + err);
    else res.send(result);
  });
});

App.get("/getTaskOpen", (req, res) => {
  let SQL = "SELECT * FROM tarefas.tbtarefas WHERE status_task <> 'Concluída';";

  //Esta queri busca todas as tarefas.
  let SQL2 = "SELECT * FROM tarefas.tbtarefas;";

  db.query(SQL, (err, result) => {
    if (err) console.log("Erro ao pegar os dados: " + err);
    else res.send(result);
  });
});

App.listen(3001, () => {
  console.log("rodando servidor");
});
