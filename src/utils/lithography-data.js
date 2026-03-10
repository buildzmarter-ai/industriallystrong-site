export const lithographyModel = {

wallPlugPower:100,

electricalToOptical:0.30,

opticalConditioning:0.75,

beamDelivery:0.70,

resistDose:0.02,

calculatePowerAtWafer(){

return this.wallPlugPower *
this.electricalToOptical *
this.opticalConditioning *
this.beamDelivery;

},

calculateAreaRate(){

return this.calculatePowerAtWafer() / this.resistDose;

}

}
