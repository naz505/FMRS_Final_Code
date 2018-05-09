module.exports = function(app, dbconn){
    
        /**
	   * This method deletes a specific item from the inventory in the database
	   * 
	   */
        app.post('/delete_item', (request, response) => {
	    var z = JSON.stringify(request.body.id);  
	    var query_string1 = "DELETE FROM `fmrs`.`Inventory_item` WHERE `Inventory_item`.`id` = " + z;
	    var query_string2 = "DELETE FROM `fmrs`.`Inventory_Item_Linking` WHERE `Inventory_Item_Linking`.`id_num` = " + z;

            dbconn.query(query_string2, function(err,rows){
                if (err) throw err;
                });

	    dbconn.query(query_string1, function(err,rows){
		if (err) throw err;
		});
	    response.send(request.body); 
	})

        
        /**
	   * This method creates a new inventory item based on input from the user
	   * 
	   */
        app.post('/create_item', (request, response) => {
	    var a = JSON.stringify(request.body.name);
	    var b = JSON.stringify(request.body.id);
	    var c = JSON.stringify(request.body.desc);
	    var d = JSON.stringify(request.body.cat);
	    var query_string2 = 'INSERT INTO `fmrs`.`Inventory_item` (`inventory_name`, `description`, `categories`, `id`, `checked_in`, `image_url`) VALUES (' + a + ', ' + c + ', '+d+', '+b+', \"in\", \"urlHolder\");';
	    console.log(query_string2); 
	    dbconn.query(query_string2, function(err,rows){	
			if (err) throw err;
		});
	    response.send(request.body); 	    
	})

        
        /**
	   * This method allows a user to make a request for an item, by requesting the item they add it to their cart, they still have to submit the cart before the administrator will see their request
	   *
	   */
        app.post('/request_item', (request, response) => {
	    var date0 = JSON.stringify(request.body.start_date);
	    var date1 = JSON.stringify(request.body.end_date);
	    var userID = JSON.stringify(request.body.user_id);
	    var item_ID = JSON.stringify(request.body.item_id);
	    var prim_key = JSON.stringify(request.body.prim_key);
	    var query_string = "INSERT INTO `fmrs`.`Cart` (`user_Id`, `begin_date`, `end_date`, `inventory_id`, `checked_out`, `checked_out_approval`, `primary_key`) VALUES (" + userID + ", " + date0 + ", " + date1 + ", " + item_ID+", '0', '0', " + prim_key + ")";
	    console.log(query_string);
	    dbconn.query(query_string, function(err,rows){
		if (err) throw err;
		});
	    response.send(request.body);	    
	})


         /**
	   * This method allows an admin to check out an item to a student. 
	   *
	   * Author: Duncan Botti 
	   */
        app.post('/admin_request_item', (request, response) => {
	    var date0 = JSON.stringify(request.body.start_date);
	    var date1 = JSON.stringify(request.body.end_date);
	    var userID = JSON.stringify(request.body.user_id);
	    var item_ID = JSON.stringify(request.body.item_id);
	    var prim_key = JSON.stringify(request.body.prim_key);
	    var query_string = "INSERT INTO `fmrs`.`Cart` (`user_Id`, `begin_date`, `end_date`, `inventory_id`, `checked_out`, `checked_out_approval`, `primary_key`) VALUES (" + userID + ", " + date0 + ", " + date1 + ", " + item_ID+", '1', '1', " + prim_key + ")";
	    console.log(query_string);
	    dbconn.query(query_string, function(err,rows){
		if (err) throw err;
		});
	    response.send(request.body);	    
	})

        
        /**
	   * This method updates an item from the inventory in the database
	   *
	   */
    
        app.post('/edit_item', (request, response) => {
	    var a = JSON.stringify(request.body.name);
	    var b = JSON.stringify(request.body.id);
	    var c = JSON.stringify(request.body.desc);
	    var d = JSON.stringify(request.body.cat); 
	    var query_string3 = "UPDATE `fmrs`.`Inventory_item` SET `inventory_name` =" + a + ", description =" + c + ", categories =" + d + " WHERE `Inventory_item`.`id` =" + b;
	    console.log(query_string3); 
	    dbconn.query(query_string3, function(err,rows){
		if (err) throw err;
		});

	    var item_link_one = JSON.stringify(request.body.item_link_one);
            var item_link_two = JSON.stringify(request.body.item_link_two);
            var item_link_three = JSON.stringify(request.body.item_link_three);

            var query_string4 = "UPDATE `fmrs`.`Inventory_Item_Linking` SET `id_link_one` =" + item_link_one + ", `id_link_two` = "+ item_link_two +", `id_link_three` = "+ item_link_three  +", description =" + c + " WHERE `Inventory_Item_Linking`.`id_num` =" + b;
            console.log(query_string3);
            dbconn.query(query_string3, function(err,rows){
                if (err) throw err;
                });
	    response.send(request.body); 
	})
   
    
        /**
	   * This method submits the cart of the user_id so that the administrator can see it for approval 
	   * 
	   */
    app.post('/submit_cart', (request, response) => {
	    var b = JSON.stringify(request.body.user_id);
	
	    // Call to db procedure Submit_Cart
	    var query_string = 'CALL `Submit_Cart`('+b+')';
	    dbconn.query(query_string, function(err,rows){
		if (err) throw err;
		});		
	    response.send(request.body); 
	})

        
        /**
	   * This method deletes the request from a users cart 
	   *
	   */
     app.post('/delete_cart_req', (request, response) => {
	    var b = JSON.stringify(request.body.req_id);
	    var query_string = "DELETE FROM `fmrs`.`Cart` WHERE `Cart`.`primary_key` =" +b;
	    dbconn.query(query_string, function(err,rows){
		if (err) throw err;
		});		
	    response.send(request.body); 
	})
        
        /**
	   * This method allows the system administrator to approve a users request for inventory
	   *
	   * Author: Duncan Botti 
	   */
    app.post('/approve_request', (request, response) => {
	    var b = JSON.stringify(request.body.id);
	    var query_string3 = "UPDATE `fmrs`.`Cart` SET `checked_out_approval` = '1'  WHERE `Cart`.`primary_key` = " + b;
	   dbconn.query(query_string3, function(err,rows){
		if (err) throw err;
		});
	    response.send(request.body); 
	})

        /**
	   * This method switches an item from being registed as out of the store room to as being in the store room 
	   *
	   */
    app.post('/check_in_item', (request, response) => {	
	    var b = JSON.stringify(request.body.id);
	    var query_string3 = "UPDATE `fmrs`.`Inventory_item` SET `checked_in` = 'in' WHERE `Inventory_item`.`id` =" + b;
	    dbconn.query(query_string3, function(err,rows){
		if (err) throw err;
		});
	    var z = JSON.stringify(request.body.primary_key);
	    var query_string1 = "DELETE FROM `fmrs`.`Cart` WHERE `Cart`.`primary_key` = " + z;
	    dbconn.query(query_string1, function(err,rows){
		if (err) throw err;
		});
	    response.send(request.body); 
	})

        
        /**
	   * This method switches an item from being registed as in the store room to as being out of the store room 
	   *
	   * Author: Duncan Botti 
	   */
    app.post('/check_out_item', (request, response) => {
	    var b = JSON.stringify(request.body.id);
	    var query_string3 = "UPDATE `fmrs`.`Inventory_item` SET `checked_in` = 'out' WHERE `Inventory_item`.`id` =" + b;
	    console.log(query_string3); 
	
	    dbconn.query(query_string3, function(err,rows){
		if (err) throw err;
		});
		
	    response.send(request.body); 
	})

         
        /**
	   * This method builds the links between item_details
	   *
	   * 
	   */
    app.post('/create_item_links', (request, response) => {
	    console.log("i made it into creating item link");
	    var id_num = JSON.stringify(request.body.id_num);
	    var id_link_one = JSON.stringify(request.body.id_link_one);
	    var id_link_two = JSON.stringify(request.body.id_link_two);
	    var id_link_three = JSON.stringify(request.body.id_link_three);
	
	    // Call to db procedure "Link_Items" which links the three (or whatever number of 
	    // inventory items are provided to it
	    //
	    var query_string = 'CALL `Link_Items`('+id_num+', '+id_link_one+', '+id_link_two+', '+id_link_three+')';
	    console.log(query_string);
	    dbconn.query(query_string, function(err,rows){
		if (err) throw err;
		});		
	    response.send(request.body); 
	})
}
