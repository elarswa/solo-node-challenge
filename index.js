const express = require('express');
const axios = require('axios').default;
const _ = require('lodash');

const app = express();
var peopleArray = [];
var planetsArray = [];

app.get('/', (req, res) => {
    res.send("<h1>Eric's Solo Node-Exercise</h1><p>Try testing '/people', '/planets'</p>");
});

app.get('/people', (req, res) => {
    /* if we already loaded the info, don't reload */
    if (peopleArray.length !== 0) {
        handleSort(req, res);
    } else {
        new Promise((resolve, reject) => {
            console.log("Sending People Request");
            /*initial url*/
            getPeople('https://swapi.dev/api/people/?search=', [], resolve, reject);

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

app.get('/planets', (req, res) => {
    /* if we already loaded the info, don't reload */
    if (planetsArray.length !== 0) {
        res.send(planetsArray);
    } else {
        new Promise((resolve, reject) => {
            if (peopleArray.length !== 0) {
                resolve();
            } else {
                console.log("Sending People Request");
                // load people
                getPeople('https://swapi.dev/api/people/?search=', [], resolve, reject);
            }
        }).then(() => {
            console.log("Sending Planet Request");
            /*initial url*/
            return new Promise((resolve, reject) => {
                getPlanets('https://swapi.dev/api/planets/?search=', [], resolve, reject);
            });
        }).then(result => {
            // if there is a result, it's an error: see function getPeople
            if (result) {
                res.send(result);
            } else {
                modifyResidents();
                res.send(planetsArray.sort((a, b) => {
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
    planetsArray.forEach((planet, p_index) => {
        planetsArray[p_index].residents.forEach((url, index) => {
            planetsArray[p_index].residents[index] = getNameFromURL(url);
        });
    });
}

function handleSort(req, res) {
    if (req.query.sortBy === "name") {
        res.send(_.sortBy(peopleArray, (o) => { return o.name }));
    }
    else if (req.query.sortBy === "height") {
        res.send(_.sortBy(peopleArray, (o) => { return o.height }));
    }
    else if (req.query.sortBy === "mass") {
        res.send(_.sortBy(peopleArray, (o) => { return o.mass }));
    } else {
        res.send(peopleArray);
    }
}

function getPeople(url, people, resolve, reject) {
    axios.get(url).then((res) => {
        if (res.status === 200) {
            people = people.concat(res.data.results);
            if (res.data.next !== null) {
                getPeople(res.data.next, people, resolve, reject);
            } else {
                peopleArray = people;
                resolve();
            }
        }
        else {
            /* bad status*/
            reject("Error Status code: " + resp.statusCode);
        }
    });
}

function getPlanets(url, planets, resolve, reject) {
    axios.get(url).then((res) => {
        if (res.status === 200) {
            planets = planets.concat(res.data.results);
            if (res.data.next !== null) {
                getPlanets(res.data.next, planets, resolve, reject);
            } else {
                planetsArray = planets;
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
    let person = _.find(peopleArray, (o) => {
        return o.url === url;
    })
    return person.name;

}

const server = app.listen(3000, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
});
