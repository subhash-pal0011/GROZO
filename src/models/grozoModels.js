import mongoose from "mongoose";

const grozoSchema = new mongoose.Schema({
       name: {
              type: String,
              required: true,
       },
       types: {
              type: String,
              enum: [
                     "fruits",
                     "vegetables",
                     "dairy",
                     "bakery",
                     "snacks",
                     "grains",
                     "pulses",
                     "spices",
                     "oils",
                     "meat",
                     "seafood",
                     "frozen_food",
                     "instant_food",
                     "organic",
                     "household",
                     "personal_care",
                     "baby_care"
              ],
              required: true
       },
       price:{
              type:Number,
              required:true
       },
       unit:{
              type:String, // kg, liter, piece
              required:true
       },
       image:{
              type:String,
              required:true
       }
},{timestamps:true})

const Grozo = mongoose.model.Grozo || mongoose.model("Grozo" , grozoSchema)
export default Grozo