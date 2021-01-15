const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require('lodash');
const cache = require('../cache');

router.get('/people', (req, res) => {
    /* if we already loaded the info, don't reload */
    if (cache.peopleArray.length !== 0) {
        handleSort(req, res);
    } else {
        new Promise((resolve, reject) => {
            console.log("Sending People Request");
            /*initial url*/
            getPeople('https://swapi.dev/api/people/?search=', [], resolve, reject);
            cache.setTime(60000); // 1 min timeout

        }).then(result => {
            // if there is a result, it's an error: see function getPeople
            if (result) {
                res.send(result);
            } else {
                handleSort(req, res);
            }

        }).catch(error => {
            res.send(error);
        });
    }
});


function handleSort(req, res) {
    if (req.query.sortBy === "name") {
        res.send(_.sortBy(cache.peopleArray, (o) => { return o.name; }));
    }
    else if (req.query.sortBy === "height") {
        res.send(_.sortBy(cache.peopleArray, (o) => { return parseInt(o.height); }));
    }
    else if (req.query.sortBy === "mass") {
        res.send(_.sortBy(cache.peopleArray, (o) => { return parseInt(o.mass.replace(/,/g, '')); }));
    } else {
        res.send(cache.peopleArray);
    }
}

function getPeople(url, people, resolve, reject) {
    axios.get(url).then((res) => {
        if (res.status === 200) {
            people = people.concat(res.data.results);
            if (res.data.next !== null) {
                getPeople(res.data.next, people, resolve, reject);
            } else {
                cache.peopleArray = people;
                resolve();
            }
        }
        else {
            /* bad status*/
            reject("Error Status code: " + resp.statusCode);
        }
    });
}

module.exports = router;