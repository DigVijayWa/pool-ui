sap.ui.define([
	'sap/m/MessageToast'
	],function(MessageToast) {
	"use strict";
	var PostData ={
		postData : function(type,userData,subType) {
   				var cloud = 'https://spring-application-pool-api.cfapps.sap.hana.ondemand.com/api/';
   				var local = 'http://10.52.108.210:8080/api/'
			    var BaseURL = local;

			    var authentication_url = 'auth/';

			    //type
			    var signup = 'signup';
			    var signin = 'signin';
			    var game_object = 'game-object';
			    var building = 'building';
			    var user = 'user';
			    var match = 'match';
			    var mail = 'mail';

			    console.log('accessing :'+BaseURL+type+'/'+subType+userData);

			    //subtype
			    var pool_table_get_all_available = 'get-all-available/'; //input startTime
			    var pool_table_get_specific_available = 'get-specific-available/' //input buildingId,floorNo,startTime
			    var pool_table_book_pool_table = 'book-pool-table/' //userId,poolId,startTime
			    
			    var building_floor_count = 'floor-count/'; //input buildingId
			    var building_list = 'building-list/';      //no input

			    var user_find_by_name = 'by-user-name/'; //username as input
			    var user_all_users = 'all-users/';		//no input
			    var user_booked_pool_tables = 'get-booked-pool-tables-for-user/'; //username as input

			    var match_display_all = 'display-all/';	//userName as input
			    var match_add_winner = 'add-winner/'; //matchId, userId, winnerTeam.
			    var match_get_specific = 'get-specific/'; //matchId
			    var match_create_match = 'create-match/' // matchType, matchDate, teamOne, teamTwo
			    
			    var mail_send_mail = 'send-mail/'	//"teamOne","teamTwo",new Date(),"poolTableName","buildingName","floorNo","matchType","timeSlot"
 
			    function urlResolver(){
			      
			      var url = '';
			        switch(type) {

			            case game_object : 
			                              switch(subType) {
			                                        case pool_table_get_all_available :  
			                                                                                url=type+'/'+subType+userData.startTime+'/'+userData.bookingDate; 
			                                                                                break;
			                                        case pool_table_get_specific_available :
			                                                                                url=type+'/'+subType
			                                                                                +userData.buildingId+'/'+userData.floorNo+'/'+userData.startTime;
			                                                                                break;
			                                        case pool_table_book_pool_table : 
			                                                                                url=type+'/'+subType
			                                                                                +userData.userId+'/'+userData.poolId+'/'+userData.startTime+'/'+userData.bookingDate;
			                                                                                break; 

			                                        default : url = 'default';
			                              }
			                              break;
			            case building : 
			                            switch(subType) {
			                                        case building_floor_count : 
			                                                                      url = type+'/'+subType+userData.buildingId;
			                                                                      break;
			                                        case building_list : 
			                                                                      url = type+'/'+subType;
			                                                                      break;
			                                        default : url = 'default';

			                            }
			                            break;
			            case user : 
			            			   switch(subType) {
			            			   		case user_find_by_name :
			                          											 url = type+'/'+subType+userData.userName;
			                          											 break;
			                          		case user_all_users : 				
			                          											 url = type+'/'+subType;
			                          											 break;
			                          		case user_booked_pool_tables : 		
			                          											 url = type+'/'+subType+userData.userName;
			                          											 break;

			                          		default : url = 'default';
			                          	}
			                          break;

			            case match : 
			            			  switch(subType) {
			            			   		case match_display_all :
			                          											 url = type+'/'+subType+userData.userName;
			                          											 break;
			                          		case match_add_winner : 				
			                          											 url = type+'/'+subType+userData.matchId+'/'+userData.userName+'/'+userData.winnerTeam;
			                          											 break;
			                          		case match_get_specific : 				
			                          											 url = type+'/'+subType+userData.matchId;
			                          											 break;
			                          		case match_create_match : 				
			                          											 url = type+'/'+subType+userData.matchType+'/'+userData.matchDate+'/'+userData.teamOne+'/'+userData.teamTwo;
			                          											 break;
			                          		
			                          		
			                          		default : url = 'default';
			                          	}
			            			  break;
			           case mail : 
			           				 switch(subType) {
		            			   			case mail_send_mail :
		                          											 url = type+'/'+subType+userData.teamOne+'/'+userData.teamTwo+'/'+userData.bookingDate+'/'+userData.poolTableName
		                          													+'/'+userData.buildingName+'/'+userData.floorNo+'/'+userData.matchType+'/'+userData.timeSlot;
		                          											 break;
			                          		
			                          		
			                          		default : url = 'default';
			                          	}
			            			  break;
			                              
			            default : url = 'default';
			          }
			        return url;
			    }


			    switch(type) {

			        case signin : 
			        case signup :  return new Promise((resolve, reject) =>{
									
									try{
				                      jQuery.ajax({
				                      	  url : BaseURL+authentication_url+type,
				                          type: 'POST',
				                          crossDomain: true,
				                          contentType : 'application/json',
				                          data: JSON.stringify(userData),
				                          success: function(data, textStatus, jqXHR) {
											MessageToast.show('Success');
											data.success = true;
											console.log(data);
											resolve(data);
				                          },
				                          error: function(err) {
				                          	console.log('here');
				                          	reject(err);
				                          }
				                      }
				                   );
								}catch(err) {
									console.log('here');
									console.log(err);
									reject(err)
								}
				                   
				                   
			                   });

			        case game_object : 
			        case user : 
			        case building :
			        case match : 
			        case mail :
			                      return new Promise((resolve, reject) =>{
			    
			                      jQuery.ajax({
			                      	  url: BaseURL+urlResolver(),
			                      	  dataType: 'json',
			                          method: 'GET',
			                          crossDomain: true,
			                          headers: {
			                                'Content-Type': 'application/json',
			                                'Authorization': userData.tokenType + ' ' +userData.accessToken
			                          },
			                          success: function(data,textStatus, jqXHR) {
			                          	resolve(data);
			                          },
			                          error: function(err) {
			                          	reject(err)
			                          }
			                       });

			              
			                    });

			    }
   
			}
	}; 
	return PostData;
});