const mongoose = require('mongoose')

const adoptionSchema = new mongoose.Schema({
	"dogName": String,
	"breed": String,
	"gender": String,
	"age": Number,
	"color": String,
	"health": String,
	"state": String,
	"city":String,
	"targetClass": String,
	"isGoodWith":[{
		"otherDogs": Boolean,
		"otherCats": Boolean,
    "Childrens": Boolean
	}],
    "otherDetails": String,
    "PostTime": Date,
		"Status": String,
		"AdoptionTime": Date,
		"AdoptedBy": String,
		"AdoptionCity": String,
})

module.exports = mongoose.model('dogAdoption', adoptionSchema)
