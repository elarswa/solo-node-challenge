class Cache {
    constructor() {
        if (!Cache.instance){
          this.peopleArray = [];
        this.planetsArray = [];  
        Cache.instance = this;
        }
        return Cache.instance;
    }
}
const instance = new Cache();
module.exports = instance;