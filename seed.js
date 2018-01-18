var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");

var data = [
	{  	name: "Blossom Park", 
		image: "https://farm5.staticflickr.com/4470/36723988354_ee2085f197.jpg", 
		description: "Attractive park land with blossom trees everywhere. Good facilities and acres of ground......................."	
	},
	{  	name: "Riverside", 
		image: "https://farm1.staticflickr.com/97/216334734_12c2572fec.jpg", 
		description: "This is a huge river meadow, nice but can get very wet when it rains and the water rises. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."	
	},
	{  	name: "Granite Hill", 
		image: "https://parksaustralia.gov.au/img/kakadu/campgrounds-malabanjbanjdju-2-credit-parks-australia-t.jpg", 
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."	
	}
];





function seedDB(){

// Drop DB content
 	Campground.remove({}, function(err){
 		if (err) {
 			console.log(err);
 		} else {
 			console.log("removed DB contents");
 			// create included as call back to ensure it runs after remove	

 			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
				 	if (err){
				 		console.log("Error occured " + err);
				 	} else {
				 		console.log("Added Campground ");
				 			// Create comments
			 			Comment.create(
			 				{ 
			 					text: "This place is great", 
			 					author: "Homer"
			 				}, function(err, comment) { 
			 					if (err) {
			 						console.log(err);
			 					} else {
			 						console.log("Comment added");
									campground.comments.push(comment._id);
									campground.save(function(err,data){
										if (err) {
											console.log(err);
										} else {
											console.log("Comment added to campground");
										}
									});
			 					}			 					
			 			}); // Comment create
					} // Else
	 			}); // Campground create
			});  //For each
 		} //else
 	}); //Campground remove
} // function seedDB










module.exports = seedDB;


