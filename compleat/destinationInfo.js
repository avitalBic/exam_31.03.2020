
class destinationInfo{

    constructor(locationA,locationB,km,counterAB,counterBA)
    {
        locationA = this.locationA;
        locationB = this.locationB;
        km = this.km;
        counterAB = this.counterAB;
        counterBA = this.counterBA;
    }

    // -- updateCounter -- 
    updateCounter(source,destination)
    {
        if (this.locationA == source)
            this.counterAB += 1;
        else
            this.counterBA += 1;
    }

    // -- findKm --
   findKm(city1,city2)
    {
        fun(city1).then(
            (object1) =>{
                fun(city2).then((object2) =>{
                    console.log("aaaa: "+ object1.lat 
                    + " " + object1.lon +" " +object2.lat+ " "+ object2.lon)
                    
                // get distance
                let a = geolib.getPreciseDistance(
                    { latitude: object1.lat, longitude: object1.lon },
                    { latitude: object2.lat, longitude: object2.lon }
                    );
                    console.log(a);
                    const km = geolib.convertDistance(a, 'km'); // convert to km
                    console.log(km)
                // }      
                })
        } );
    }
    
}
module.exports = destinationInfo;