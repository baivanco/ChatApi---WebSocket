const express = require("express");
const ws = require("nodejs-websocket");
const myParser = require("body-parser");
const handlers = require("./handlers/chat");
var MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "mongodb://127.0.0.1:27017",
  {
    useNewUrlParser: true
  },
  (err, client) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Connected To DB");
    }
    var db = client.db("chat");
    var messagesCollection = db.collection("messages");
    var usersCollection = db.collection("chatUsers");

    var server = ws
      .createServer(function(conn) {
        console.log("New Connection");
        conn.on("text", function(str) {
          var msg = JSON.parse(str);
          switch (msg.type) {
            case "register":
              messagesCollection
                .find()
                .sort({
                  _id: 1
                })
                .toArray(function(err, res) {
                  if (err) {
                    throw err;
                  } else {
                    JSON.stringify(res);
                    for (let i in res) {
                      var timeCheck = new Date();
                      timeCheck = timeCheck.getTime();
                      if (res[i].date > timeCheck - 600000) {
                        conn.sendText(res[i].user + " : " + res[i].text);
                      }
                    }
                  }
                });

              conn.nickname = msg.message;
              server.connections.forEach(function(c) {
                c.sendText(msg.message + " has entered the chat");
              });

              usersCollection.insertOne(
                {
                  user: conn.nickname
                },
                (err, res) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log("New User Added To DB");
                  }
                }
              );
              break;

            case "text":
              var time = new Date();

              messagesCollection.insertOne(
                {
                  user: conn.nickname,
                  text: msg.message,
                  date: time.getTime()
                },
                function(err, res) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("New Message Inserted In DB");
                  }
                }
              );

              server.connections.forEach(function(c) {
                c.sendText(conn.nickname + ":" + msg.message);
              });
              break;
          }
        });
        conn.on("close", function(code, reason) {
          console.log("Connection Closed");
        });

        conn.on("error", function(err) {
          console.error(err);
        });
      })
      .listen(8081);
  }
);

var app = express();
app.use(express.static("public"));
app.use(myParser.json());

app.listen(8080, err => {
  if (err) {
    console.error(err);
  }
  return console.log("Server Started On Port : 8080");
});
