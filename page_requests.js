module.exports = function(app,dbconn){

	// Some documentation written & some code written in various parts, not all or necessarily the majority but 
	// some parts of this page by Andrew Nyhus

	// =============================================================
      
	app.get('/', (request, response) => {
	               

			//console.log("request.headers: " + JSON.stringify(request.headers));

			var temp =  [];
	                dbconn.query('SELECT * FROM Inventory_item', function(err, rows){
                            if(err) throw err;
                            for(i = 0; i < rows.length; i++){
				var x = {};
				x['id_num'] = rows[i]['id'];
				x['image_url'] = "static/images/camera1.bmp";
				x['name'] = rows[i]['inventory_name'];
				x['description'] = rows[i]['description']
				x['reserve_status'] = rows[i]['checked_in'];
				temp.push(x);
                            }
		            return temp;
			});
			

		        // =============================================================
		        // This is an example of how we render a web template from (~/view/...hbs)
		        // passing in an argument 'inventory_items' (assigned to a value equal to the temp array,
		        // previously manipulated by a database query response, asking for 
		        // all Inventory_item (s)) to the home.hbs (Handlebars Template file in path: FMRS_Senior-Design/views/home.hbs) - Andrew N. (Documentation note only, the route handler + query block 
		        // created by Duncan)
        		// =============================================================
			response.render('home', {
				inventory_items: temp,
			})          
    	})	
        // =============================================================


        // =============================================================

        /**
	   * This page shows the user the cart associated to their Bucknell Account 
	   *
	   *
	   * Author: Duncan Botti 
	 */
	app.get('/user/:user_id/cart/', (request, response) => {

	    var temp2 = [];

	    // Call to db procedure "get_cart"
	    // returning inventory items that are currently stored in the cart 
	    // of the user whose user is user_id. - Andrew N. (Documentation note only, the route handler + query block 
	    // created by Duncan)
	    //
	    var query_string = 'CALL `get_cart`("'+ request.params['user_id'] +'")' ;

	    dbconn.query('CALL `get_cart`("'+ request.params['user_id'] +'")',function(err,rows){
	    var c = {};
			for(i = 0; i < rows[0].length; i++){
			     if (rows[0][i]['checked_out'] == 0){
				var c = {};
				c['image_url'] = "/static/images/camera1.bmp";
				c['req_id'] = rows[0][i]['primary_key'];
				c['id_num'] = rows[0][i]['inventory_id'];
				c['reservation_start'] = rows[0][i]['begin_date'];
				c['reservation_end'] = rows[0][i]['end_date'];
				c['checked_out_approval'] = rows[0][i]['checked_out_approval'];
				c['user_id'] = rows[0][i]['user_Id'];
				c['checked_out'] = rows[0][i]['checked_out'];
				c['name'] = rows[0][i]['inventory_name'];
				c['description'] = rows[0][i]['description'];
				temp2.push(c);
			     }
                            }
		return temp2; 
 	    });
	    	response.render('cart',{
			cart_items: temp2,
		        user_id: [request.params['user_id']],
		})
	})
        // =============================================================

        // =============================================================
        
        /**
	   * This method renders the page to allow users to add an item to their cart 
	   *
	   *
	   * Author: Duncan Botti 
	 */
	app.get('/add_item_to_cart/:itemId/', (request, response) => {

	    var item_id = request.params['itemId'];
	
	    var query_string = 'SELECT * FROM Inventory_item WHERE id="' + request.params['itemId']  + '";';
	    
	    /**
	      * Call to db procedure "Get_Linked_Items" to get the linked items for a user with user id = user_id
	      * & an item linked to the linked items with the id itemId
	      *- Andrew N. (Documentation note only, route handler + query block 
              * created by Duncan)
	      */
	    var query_string2 = 'CALL `Get_Linked_Items`("' + item_id + '");';
	    var temp = [];
	    var temp2 = [];

	                dbconn.query(query_string, function(err, rows){
                            if(err) throw err;
			    for(i = 0; i < rows.length; i++){
                                var x = {};
                                x['id_num'] = rows[i]['id'];
                                x['image_url'] = "/static/images/camera1.bmp";
                                x['name'] = rows[i]['inventory_name'];
                                x['description'] = rows[i]['description']
                                x['reserve_status'] = rows[i]['checked_in'];
				x['user_id'] = request.params['user_id'];
			    	temp.push(x);
			    }
				return temp;
			});

                       dbconn.query(query_string2,function(err,rows){
                            if (err) throw err;
                            //console.log("this is happening");
                            //console.log("rows"+rows[0]);
                            for(i = 0; i < 3; i++){
                                var x = {};
                                x['id_num'] = rows[0][i]['id'];
                                x['name'] = rows[0][i]['inventory_name'];
				console.log(temp2); 
                                temp2.push(x);
                            }
                           return temp2;
                           });

                        response.render('add_item_to_cart', {
                                inventory_items:temp,
                                linked_item:temp2,
                                helpers:{ json: function(context){return JSON.stringify(context);} },

                        })

    

	})

    /**
	   * This method renders the page that shows the information about the item associated to the itemID in the url
	   *
	   *
	 */
	app.get('/item_detail/:itemId/', (request, response) => {
	    var user_id = request.params['itemId'];
	    var query_string = 'SELECT * FROM Inventory_item WHERE id="' + request.params['itemId']  + '";';

	    console.log(query_string);
	    var query_string2= 'CALL `Get_Linked_Items`("' + user_id +'");';
	    console.log(query_string2);
	    var temp = [];
	    var temp2 = [];
	                dbconn.query(query_string, function(err, rows){
                            if(err) throw err;
			    for(i = 0; i < rows.length; i++){
                                var x = {};
                                x['id_num'] = rows[i]['id'];
                                x['image_url'] = "/static/images/camera1.bmp";
                                x['name'] = rows[i]['inventory_name'];
                                x['description'] = rows[i]['description']
                                x['reserve_status'] = rows[i]['checked_in'];
			    	temp.push(x);
			    }
				return temp;
			});

	                dbconn.query(query_string2,function(err,rows){
			    if (err) throw err;
			    for(i = 0; i < 3; i++){
				var x = {};
				x['id_num'] = rows[0][i]['id'];
				x['name'] = rows[0][i]['inventory_name'];
				temp2.push(x);
			    }
			    return temp2;
			});
                        response.render('item_detail', {
				inventory_items:temp,
			        linked_item:temp2,
                        })

	})

         /**
	   * This method has the server render the page that helps the System Administrator Check out inventory to students 
	   *
	   *
	   * Author: Duncan Botti 
	 */

    app.get('/admin/check_out_item/:itemId/', (request, response) => {

    	var user_id = request.params['itemId'];
	    var query_string = 'SELECT * FROM Inventory_item WHERE id="' + user_id  + '";';
	    var temp = [];

	    // See note in add_item_to_cart query 
	    var query_string2 = 'CALL `Get_Linked_Items`("' + user_id +'");';
	    var temp2 = [];
	                dbconn.query(query_string, function(err, rows){
                            if(err) throw err;
			    for(i = 0; i < rows.length; i++){
                                var x = {};
                                x['id_num'] = rows[i]['id'];
                                x['image_url'] = "static/images/camera1.bmp";
                                x['name'] = rows[i]['inventory_name'];
                                x['description'] = rows[i]['description']
                                x['reserve_status'] = rows[i]['checked_in'];
			    	temp.push(x);
			    }
				return temp;
			});


	                dbconn.query(query_string2,function(err,rows){
			    if (err) throw err;
			    console.log("this is happening");
			    console.log("rows"+rows[0]);
			    for(i = 0; i < 3; i++){
				var x = {};
				x['id_num'] = rows[0][i]['id'];
				x['name'] = rows[0][i]['inventory_name'];
				console.log(x);
				temp2.push(x);
			    }
			    return temp2;
			});


                        response.render('check_out_item', {
			        		inventory_items:temp,
			        		linked_item:temp2,
			        
			    helpers:{ json: function(context){return JSON.stringify(context);} },
                        })

	})
        // =============================================================
    
        /**
	   * This method has the server render the page that shows the System administrator an editing page for item associated to item_id 
	   *
	   *
	 */

    app.get('/admin/edit_item/:itemId/', (request, response) => {

	    var query_string = 'SELECT * FROM Inventory_item WHERE id="' + request.params['itemId']  + '";';

	    var temp = [];

	                dbconn.query(query_string, function(err, rows){
                            if(err) throw err;
			    for(i = 0; i < rows.length; i++){
                                var x = {};
                                x['id_num'] = rows[i]['id'];
                                x['image_url'] = "static/images/camera1.bmp";
                                x['name'] = rows[i]['inventory_name'];
                                x['description'] = rows[i]['description'];
				x['category'] = rows[i]['categories'];
                                x['reserve_status'] = rows[i]['checked_in'];
			    	temp.push(x);
			    }
				return temp;
			});

            var query_string_linked = 'SELECT * FROM Inventory_Item_Linking WHERE id_num="' + request.params['itemId']  + '";';

	    temp3 = [];
                        dbconn.query(query_string_linked, function(err, rows){
                            if(err) throw err;
                            for(i = 0; i < rows.length; i++){
                     		var x ={};
                                x['item_link_1'] = rows[i]['id_link_one'];         
				x['item_link_2'] = rows[i]['id_link_two'];
				x['item_link_3'] = rows[i]['id_link_three'];
	  			temp3.push(x);
			     }
			    console.log(temp3);
			      return temp3;
                        });


            var categories_query_string = 'SELECT * FROM `Categories`'; 
            var temp_categories = [];

                        dbconn.query(categories_query_string, function(err, rows){
                            if(err) throw err;
                            for(i = 0; i < rows.length; i++){
                                var x = {};
                                x['cat_id'] = rows[i]['category_id'];
                                x['name'] = rows[i]['Name'];
                                temp_categories.push(x);
                            }
                                return temp_categories;
                        });

	                console.log(temp_categories);

	                response.render('edit_item', {
			        inventory_items:temp, 
			        categories: temp_categories,
			        item_link: temp3, 
                        })

	})
        // =============================================================
    
        
        /**
	   * page shows the system administrator the page that helps them build a new item 
	   *
	   *
	   * Author: Duncan Botti 
	 */
        app.get('/admin/new_item', (request, response) => {
	    var query_string = 'SELECT * FROM `Categories`';
	    var temp = [];
	                dbconn.query(query_string, function(err, rows){
                            if(err) throw err;
			    for(i = 0; i < rows.length; i++){
                                var x = {};
                                x['cat_id'] = rows[i]['category_id'];
                                x['name'] = rows[i]['Name'];
			    	temp.push(x);
			    }
				return temp;
			});
			response.render('new_item', {
			    categories: temp,
			})
	})
        // =============================================================


        // =============================================================

        
        /**
	   * This method has the server render the page that shows anyone the inventory of the department
	   *
	   *
	   * Author: Duncan Botti 
	 */
	app.get('/browse_inventory', (request, response) => {
			var temp =  [];
	                dbconn.query('SELECT * FROM Inventory_item', function(err, rows){
                            if(err) throw err;
                            for(i = 0; i < rows.length; i++){
				var x = {};
				x['id_num'] = rows[i]['id'];
				x['image_url'] = rows[i]['image_url'];
				x['name'] = rows[i]['inventory_name'];
				x['category'] = rows[i]['categories'];
				x['description'] = rows[i]['description']
				x['reserve_status'] = rows[i]['checked_in'];
				temp.push(x);
                            }
			
		            return temp;
			});
	                response.render('browse_inventory', {
			        inventory_items: temp,
                                user_data: request.headers,
				helpers:{ json: function(context){return JSON.stringify(context);} },
			})
	               
	})
        // =============================================================


        // =============================================================
        
        /**
	   * This method has the server render the page that show the user the status of their requests and item reservations
	   *
	   *
	   * Author: Duncan Botti 
	 */
	app.get('/user/:user_id/', (request, response) => {

	    var temp2 = [];

	    // get_cart db procedure call
	    dbconn.query('CALL `get_cart`("'+ request.params['user_id'] +'")',function(err,rows){
	    var c = {};
			for(i = 0; i < rows[0].length; i++){
			    
			     if (rows[0][i]['checked_out'] == 1){
				var c = {};
				c['image_url'] = "/static/images/camera1.bmp";
				c['req_id'] = rows[0][i]['primary_key'];
				c['id_num'] = rows[0][i]['inventory_id'];
				c['reservation_start'] = rows[0][i]['begin_date'];
				c['reservation_end'] = rows[0][i]['end_date'];
				c['checked_out_approval'] = rows[0][i]['checked_out_approval'];
				c['user_id'] = rows[0][i]['user_Id'];
				c['checked_out'] = rows[0][i]['checked_out'];
				c['name'] = rows[0][i]['inventory_name'];
				c['description'] = rows[0][i]['description'];
				temp2.push(c);
			     }
                            }
		return temp2; 
 	    });
		response.render('profile', {
		    user_id:request.params['user_id'],
		    request_items: temp2,			
		})	
	})
        // =============================================================


        // =============================================================

        
        /**
	   * This method has the server render the page that allows the system adminstrator to perform necessary functions 
	   *
	   *
	 */
	app.get('/admin', (request, response) => {
	    if(request.headers.username != undefined && request.headers.username != ""/*== "ajn008" || "dan014"*/){
	    var temp =  [];
	    dbconn.query('SELECT * FROM Inventory_item', function(err, rows){
                            if(err) throw err;
                            for(i = 0; i < rows.length; i++){
				var x = {};
				x['id_num'] = rows[i]['id'];
				x['image_url'] = "static/images/camera1.bmp";
				x['name'] = rows[i]['inventory_name'];
				x['description'] = rows[i]['description']
				x['reserve_status'] = rows[i]['checked_in'];
				temp.push(x);
                            }
		            return temp;
			});
	    var temp2 = [];

	    // Call to db procedure "Join_Cart_And_Inventory_Item
	    dbconn.query('CALL `Join_Cart_And_Inventory_Item`()',function(err,rows){
			var c = {};
			for(i = 0; i < rows[0].length; i++){			    
			     if (rows[0][i]['checked_out'] == 1){//this should be a ==1 so that only carts submitted show up
				
				var c = {};
				c['image_url'] = "/static/images/camera1.bmp";
				c['req_id'] = rows[0][i]['primary_key'];
				c['id_num'] = rows[0][i]['inventory_id'];
				c['reservation_start'] = rows[0][i]['begin_date'];
				c['reservation_end'] = rows[0][i]['end_date'];
				c['checked_out_approval'] = rows[0][i]['checked_out_approval'];
				c['user_id'] = rows[0][i]['user_Id'];
				c['checked_out'] = rows[0][i]['checked_out'];
				c['name'] = rows[0][i]['inventory_name'];
				 c['description'] = rows[0][i]['description'];
				 c['inventory_in'] = rows[0][i]['checked_in'];
				temp2.push(c);
			     }
                            }
		return temp2; 
 	    });
		response.render('admin', {
		    inventory_items: temp,
		    request_items: temp2, 
		    
		})
	}else{
		response.render('home', {
                                user_data: request.headers,
                                helpers:{ json: function(context){return JSON.stringify(context);} },		    
		})

	}

	})

	// Requests to this url are set by the Bucknell 
	// Enterprise Apache Server to not force unauthenticated users to authenticate.
	// This url is for the purpose of displaying public information about the studio
	// Please talk to Jeremy Dreese or ECST before changing this route - (Documenation Note by Andrew N) 
        app.get('/suiteInfoPage', (request, response) => {


		response.render('suiteInfoPage', {	
		})
	})

        // =============================================================

}
