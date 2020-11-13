const mongoose = require('mongoose')

const adoptionSchema = new mongoose.Schema({
	"dogName": String,
	"breed": String,
	"gender": String,
	"age": String,
	"color": String,
	"health": String,
	"state": String,
	"city": String,
  "image":
  {
      "data": Buffer,
      "contentType": String,
  },
    "otherDetails": String,
    "PostTime": Date,
		"Status": String,
		"AdoptionTime": Date,
		"AdoptedBy": String,
		"AdoptionCity": String,
});


module.exports = mongoose.model('dogAdoption', adoptionSchema)
