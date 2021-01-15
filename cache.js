class Cache {
    constructor() {
        if (!Cache.instance){
          this.peopleArray = [];
        this.planetsArray = [];  
        Cache.instance = this;
        }
        return Cache.instance;
    }
    setTime(time) { // call after sending axios request to erase cache on timeout
      setTimeout((() => {
        this.peopleArray = [];
        this.planetsArray = [];
      }), time)
    }
}
const instance = new Cache();
module.exports = instance;