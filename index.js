/**
 * NPM Module dependencies.
 */
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

///POST METHOD

app.post("/updateMealOrderStatus", async (req, res) => {
  if (req.body.ticketId) {
    try {
      var config = {
        method: "post",
        url: process.env.REACT_APP_ARANGO_URL_READ,
        headers: { "Content-Type": "application/json" },
        data: {
          db_name: process.env.REACT_APP_DB,
          entity: process.env.REACT_APP_MEAL_ORDER_ENTITY,
          filter: `${process.env.REACT_APP_MEAL_ORDER_ENTITY}.ticketId=='${req.body.ticketId}'`,
          return_fields: process.env.REACT_APP_MEAL_ORDER_ENTITY,
        },
      };

      axios(config)
        .then(function (response) {
          axios({
            method: "POST",
            url: process.env.REACT_APP_ARANGO_URL_UPSERT,
            headers: { "Content-Type": "application/json" },
            data: [
              {
                db_name: process.env.REACT_APP_DB,
                entity: process.env.REACT_APP_MEAL_ORDER_ENTITY,
                filter: { _id: response.data.result?.[0]._id },
                doc: {
                  activestatus: false,
                },
              },
            ],
          })
            .then((resp1) => res.status(200).json({ response: resp1.data }))
            .catch((err) =>
              res
                .status(400)
                .json({ error: true, message: "Please Check the payload" })
            );
        })
        .catch(function (error) {
          console.error(error);
        });

      //   res.status(300).json({ response: data.data.result });
    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(400);
  }
});
app.listen(process.env.PORT || 3009, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
