const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require('lodash');
const cache = require('../cache');

router.get('/planets', (req, res) => {
    /* if we already loaded the info, don't reload */
    if (cache.planetsArray.length !== 0) {
        res.send(cache.planetsArray);
    } else {
        let p1 = new Promise((resolve, reject) => {
            if (cache.peopleArray.length !== 0) {
                resolve();
            } else {
                console.log("Sending People Request");
                // load people
                getPeople('https://swapi.dev/api/people/?search=', [], resolve, reject);
            }
        });
        let p2 = new Promise((resolve, reject) => {
            console.log("Sending Planet Request");
            /*initial url*/
            getPlanets('https://swapi.dev/api/planets/?search=', [], resolve, reject);

        });
        Promise.all([p1, p2])
        .then(results => {
            // if there is a result, it's an error: see function getPeople
            if (results[0] || results[1]) {
                res.send(result);
            } else {
                modifyResidents();
                res.send(cache.planetsArray.sort((a, b) => {
                    let aName = a.name.toUpperCase();
                    let bName = b.name.toUpperCase();
                    if (aName < bName) return -1;
                    if (aName > bName) return 1;
                    return 0;
                }));
            }

        }).catch(error => {
            res.send(error);
        });
    }
});

function modifyResidents() {
    cache.planetsArray.forEach((planet, p_index) => {
        cache.planetsArray[p_index].residents.forEach((url, index) => {
            cache.planetsArray[p_index].residents[index] = getNameFromURL(url);
        });
    });
}



function getPlanets(url, planets, resolve, reject) {
    axios.get(url).then((res) => {
        if (res.status === 200) {
            planets = planets.concat(res.data.results);
            if (res.data.next !== null) {
                getPlanets(res.data.next, planets, resolve, reject);
            } else {
                cache.planetsArray = planets;
                resolve();
            }
        }
        else {
            /* bad status*/
            reject("Error Status code: " + resp.statusCode);
        }
    });
}

function getNameFromURL(url) {
    //load people before calling
    let person = _.find(cache.peopleArray, (o) => {
        return o.url === url;
    })
    return person.name;

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
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = router;