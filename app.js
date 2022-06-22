const express = require("express");
const body_parser = require("body-parser");
const https_request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(body_parser.urlencoded({ extended: true }));

app.listen(3000, function () {
  console.log("Server is up and running on port 3000");
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/signup.html");
});

client.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});

const run = async () => {
  const response = await client.lists.getAllLists();
};

run();

app.post("/", function (req, res) {
  const list_id = process.env.LIST_ID;
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;
  const email = req.body.email;

  console.log("First name: " + f_name);
  console.log("Last name: " + l_name);
  console.log("Email: " + email);
  //   res.send("Your data is succesfully posted!");

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: f_name,
          LNAME: l_name,
        },
      },
    ],
  };

  const json_data = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/" + list_id;
  const options = {
    method: "POST",
    auth: process.env.AUTH,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      // console.log(JSON.parse(data));
    });
  });
  request.write(json_data);
  request.end();
});

app.post("/failure", function (request, response) {
  response.redirect("/");
});
