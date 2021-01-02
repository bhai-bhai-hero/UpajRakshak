const mongoose=require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema= mongoose.Schema;


const companySchema= new Schema({
      ownername:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
	  },
	 
         coldstoragenam:{
            type: String,
            required: true
           },
		 DOB:{
            type : String,
            required: true 
         },
         telnum:{
             type: Number,
             required: true
         },
         email:{
             type: String,
             required: false
         },
         registration_no:{
             type: String,
             required: true
         },

       category: {
        type: String,
        required: true
    },
      
       price_per_kg: {
        type: Currency,
        required: true,
        min: 0
    },
        state:{
            type: String,
            required: true
        },
        District:{
            type: String,
            required: true
        },
        Block:{
            type: String,
            required: true
        }

		 },
		 {
		 timestamp : true
		 });
		 var companies =mongoose.model('Company',companySchema);
		 module.exports = companies ;