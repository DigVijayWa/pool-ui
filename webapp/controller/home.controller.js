sap.ui.define([
		'jquery.sap.global',
		'sap/m/ObjectIdentifier',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/odata/ODataModel',
		'sap/ui/model/json/JSONModel',
		'sap/m/MessageToast',
		'sap/ui/core/UIComponent',
		'com/sap/pool-ui/controller/PostData',
		'com/sap/pool-ui/controller/PopOver'
	], function(jQuery, ObjectIdentifier, Controller, ODataModel, JSONModel, MessageToast,UIComponent,PostData,PopOver) {
	"use strict";
	var toggle = false;

	var FacetFilterController = Controller.extend("com.sap.pool-ui.controller.home", {
		onInit : function() {
			this._wizard = this.byId("CreateProductWizard");
			this.session = new jQuery.sap.storage.Storage();
			
			if(this.session.get('accessToken') == null) {
				
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("login");
				return;
			}
			this.userName =this.session.get('userName');
			this.accessToken = this.session.get('accessToken');	
			this.tokenType =  this.session.get('tokenType');
			
			var oData = {
				"selectedTimeSlot": "8",
				"timeCollection": [
					{
						"timeId": "8",
						"time": "8 AM - 9 AM"
					},
					{
						"timeId": "9",
						"time": "9 AM -10 AM"
					},
					{
						"timeId": "10",
						"time": "10 AM-11 AM"
					},
					{
						"timeId": "11",
						"time": "11 AM - 12 PM"
					},
					{
						"timeId": "12",
						"time": "12 PM - 1 PM"
					},
					{
						"timeId": "1",
						"time": "1 PM - 2 PM"
					},
					{
						"timeId": "2",
						"time": "2 PM - 3 PM"
					},
					{
						"timeId": "3",
						"time": "3 PM - 4 PM"
					},
					{
						"timeId": "4",
						"time": "4 PM - 5 PM"
					}
				],
				"Editable": true,
				"Enabled": true
			};
			
			//this._profile = sap.ui.xmlview("com.UI5.pool.project.view.profile", this);
			//this.getSplitAppObj().addDependent(this._profile);
			this.countMatches=0;
			var oModel = new JSONModel(oData);
			this.buildingList = {};
			this.quickMatchObject = {};
			this.customMatchObject = {};
			this.customPageIndex = 0;
			this.getView().setModel(oModel, "quickMatch");
			this.setUserData();
			this.fetchBookedPoolTables();
			this.fetchMatches();
			
			this.countMatches = 0;
			this.winMatch = 0;
			
			//setting up the profile 
			var oUserData = this.session.get('userData');
			oUserData = JSON.parse(oUserData);

			oUserData={
				"name" : "I353455",
				"firstName" : "Digvijay",
				"lastName" : "Wadkar"	
			};
			var avatarOData = {
				"url" : "http://avatars.wdf.sap.corp:1080/avatar/"+	oUserData.name+"?s=94",
				"userName" : ''+this.userName, 
				"firstName" : ''+oUserData.firstName,
				"lastName" : ''+oUserData.lastName
			};
			console.log(avatarOData);
			var oAvModel = new JSONModel(avatarOData);
			this.getView().setModel(oAvModel,"avatar");
			
			var jsonProfile = this.session.get('userProfile');
			jsonProfile = JSON.parse(jsonProfile);
			//jsonProfile.countMatches = this.countMatches;
			console.log(jsonProfile);
			var oProfileModel = new JSONModel(jsonProfile);
			this.getView().setModel(oProfileModel,'profileModel');
		},
		onPressAvatar : function() {
			console.log('press');
			console.log(this.byId('av').getSrc());       	
		},
		fetchMatches : function() {
			this.byId('panel3').setBusy(true);
			var dataBody = {
				'userName' : this.userName,
				'accessToken' : this.accessToken,
				'tokenType' : this.tokenType
			};
			PostData.postData('match',dataBody,'display-all/').then(result=>{
				console.log(result);
				this.countMatches = result.length;
				var data =  {
					'results' : result
				};
				var oModel = new JSONModel(data);
				this.getView().setModel(oModel,'matchData');
				this.byId('panel3').setBusy(false);
			});
		},
		fetchBookedPoolTables : function() {
			this.byId('panel4').setBusy(true);
			var dataBody = {
				'userName' : this.userName,
				'accessToken' : this.accessToken,
				'tokenType' : this.tokenType
			};
			PostData.postData('user',dataBody,'get-booked-pool-tables-for-user/').then(result=>{
				console.log(result);
				var data =  {
					'results' : result
				};
				this.byId('panel4').setBusy(false);
				var oModel = new JSONModel(data);
				this.getView().setModel(oModel,'matchData_1');
			});
		},
		onIconTabTap : function(event) {
			//this.fetchBookedPoolTables();
			var matchType = event.getSource().getSelectedKey();

			if(matchType === 'pool') {
				this.fetchBookedPoolTables();

			}else if(matchType === 'match') {
				this.fetchMatches();
			}
		},
		onMatchTap : function() {
			this.fetchMatches();
			console.log("pressed");	
		},
		onPoolRecordTap: function(oEvent) {
			var oEventId = oEvent.getSource().getId();
			oEventId = oEventId.substring(oEventId.lastIndexOf('-')+1,oEventId.length);
			var oModel,timeSlot;
			if(this.currPage === 'quickMatch') {			
				//setting the model for the fragment to use
				oModel =  this.getView().getModel("poolTableData");
				timeSlot = this.getView().byId('input-a').getSelectedKey();
				this.quickMatchObject = {
					'results' : oModel.oData.results[oEventId],
					'timeSlot' : timeSlot
				};
				
			}
			var data ={ 
				'results' : oModel.oData.results[oEventId],
				'timeSlot' : timeSlot+'-'+eval(timeSlot+" + 1")
			};
			console.log(data);
			this.getView().setModel(new JSONModel(data),'confirmModel');
			this.onOpenDialogConfirm();

		},
		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
			this.currPage = this.getSplitAppObj().getCurrentPage().getId();
			this.currPage = this.currPage.substring(this.currPage.lastIndexOf('-')+1,this.currPage.length);
		},
		onViewTap : function(oEvent) {
			console.log();
			var startTime;
			var oPanel;
			var date;
			if(this.currPage === 'quickMatch'){
				startTime = this.getView().byId('input-a').getSelectedItem().mProperties.key;
				oPanel = this.byId("panel1");
				date = eval(new Date().getMonth()+" + 1")+"-"+new Date().getDate()+"-"+eval("1900 + "+new Date().getYear());

			}else if(this.currPage === 'customMatch'){
				startTime = this.getView().byId('input-d').getSelectedItem().mProperties.key;
				oPanel = this.byId("panel2");
				date = this.byId('input-h').getValue();
				if(date === null) {
					this.byId('input-h').setValueState(sap.ui.core.ValueState.Error);
					return;
				}
				this.byId('input-h').setValueState(sap.ui.core.ValueState.None);
			}
			var dataBody = {
				'gameObjectClass' : 'snooker',
				'startTime' : startTime,
				'bookingDate' : date,
				'accessToken' : this.accessToken,
				'tokenType' : this.tokenType
			};
			oPanel.setBusy(true);
			this.fetchPoolTableData('get-all-available/',dataBody,oPanel);

		},
		timeSlotValidation : function() {
			console.log(this.getView().byId('input-f').getTokens().length);
			
			var matchType = this.getView().getModel('userData').oData.matchType;
			console.log(this.selected);
			if(!this.selected || this.byId('input-h').getValue() === null) {
				
				this._wizard.invalidateStep(this.byId('poolTableSelection'));
				return;
			}
			else {
				this._wizard.validateStep(this.byId('poolTableSelection'));
			}
		},
		onConfirm : function() {

			///here we may have to write the code for the creating the match.
			var dataBody;
			var dataB;
			var type;
			var oPanel;
			if(this.currPage === 'quickMatch') {
				oPanel = this.byId('panel1');
				dataBody = {
					'gameObjectClass' : 'snooker',
					'poolId' : this.quickMatchObject.results.poolId,
					'startTime' : this.quickMatchObject.timeSlot,
					'userId' : this.userId,
					'bookingDate' : '08-29-2019',
					'accessToken' : this.accessToken,
					'tokenType' : this.tokenType
				};
				dataB = {
					'gameObjectClass' : 'snooker',
					'startTime' : this.getView().byId('input-a').getSelectedItem().mProperties.key,
					'bookingDate' : '08-29-2019',
					'accessToken' : this.accessToken,
					'tokenType' : this.tokenType
				};
				type = 'get-all-available/';

			}

			PostData.postData('pool-table',dataBody,'book-pool-table/').then(result=>{
				if(result.message != 'CREATE_FAILURE') {
					this.fetchPoolTableData(type,dataB,oPanel);
					PopOver.popOver(this,"Success", 1);
					//MessageToast.show("POOL TABLE BOOKED");
				}
				else {
					var index = new Array();
					index.push(3);
					PopOver.popOver(this,"Error", index);
					//MessageToast.show("BOOKING FAILED");
				}
			});
			this.onCloseDialogConfirm();
		},
		fetchPoolTableData : function(type,data,oPanel) {
			
			PostData.postData('game-object',data,type).then(result=>{
				//console.log(result.success);
				//console.log(result);
				var resultData = {
					'results' : result
				};
				//console.log(resultData);
				var oModel = new JSONModel(resultData);
				console.log(this.currPage);
				if(this.currPage === 'quickMatch'){
					this.getView().setModel(oModel,'poolTableData');
					oPanel.setBusy(false);
				}
				else{
					this.getView().setModel(oModel,'poolTableData_1');
					oPanel.setBusy(false);
				}
			});
		},
		onCancelConfirm : function() {
			this.onCloseDialogConfirm();
		},
		playerValidation : function() {
			console.log(this.getView().byId('input-f').getTokens().length);
			var matchType = this.getView().getModel('userData').oData.matchType;

			if(matchType === 'SINGLE' && this.getView().byId('input-f').getTokens().length === 1) {
				
				this._wizard.validateStep(this.byId('matchPlayerSelection'));
			}
			else if(matchType === 'DOUBLE' && this.getView().byId('input-f').getTokens().length === 3) {
				this._wizard.validateStep(this.byId('matchPlayerSelection'));
			}else {
				this._wizard.invalidateStep(this.byId('matchPlayerSelection'));
			}
		},
		onChangeMatchType : function() {
			var oModel = this.getView().getModel('userData');
			console.log(oModel.oData.matchType);
			if(oModel.oData.matchType=== 'SINGLE') {
				oModel.oData.playerCount = 1;
			} else if(oModel.oData.matchType === 'DOUBLE') {
				oModel.oData.playerCount = 3;
				console.log("Here");
			}
			this.playerValidation();
		},
		onCloseDialogConfirm: function () {
			if (this.oDialogConfirm) {
				this.oDialogConfirm.destroy(true);
			}
		},
		setUserData : function() {
	      var data = {
		    "userName" : this.userName,
	        "accessToken" : this.accessToken,
	        "tokenType" : this.tokenType
     	  }; 

     	  PostData.postData('user',data,'all-users/').then(result => {
     	  		var resultData = {
     	  			users : result,
     	  			matchType : 'SINGLE',
     	  			playerCount : 1
     	  		};
     	  		console.log(result);
     	  		var jsonModel = new JSONModel(resultData);
     	  		this.getView().setModel(jsonModel,'userData');

     	  		console.log(this.getView().getModel('userData'));
     	  		//find out the userId for the current user.
     	  		for(var i=0; i<result.length; i++) {
     	  			
     	  			if(result[i].userName === this.userName) {
     	  				this.userId = result[i].userId;
     	  				console.log('hello');
    					this.session.put('userProfile',JSON.stringify(result[i]));
     	  				break;
     	  			}
     	  		}
     	  });
	     
		},
		onOpenDialogConfirm: function () {
			var oView = this.getView();
			this.oDialogConfirm = oView.byId("confirmDialog");
			// create dialog lazily
			if (!this.oDialogConfirm) {
				// create dialog via fragment factory
				this.oDialogConfirm = sap.ui.xmlfragment(oView.getId(), "com.sap.pool-ui.fragment.confirm", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.oDialogConfirm);
			}
			this.oDialogConfirm.open();
		},
		getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				console.log("split app not found.");
			}
			return result;
		},
		wizardCompletedHandler : function() {
			//set the model according to the inputs and open up the dialog.
			var matchType = this.getView().getModel('userData').oData.matchType;
			console.log(this.getView().byId('input-f').getTokens());
			var token = this.getView().byId('input-f').getTokens();
			var members = [];
			for(var i=0;i<token.length;i++) {
				members.push({'name' : token[i].mProperties.text,'email' : token[i].mProperties.key});
			}
			console.log(members);
				var dataBody = {
					'results' : this.getView().getModel('poolTableData_1').oData.results[this.customPageIndex],
					'timeSlot' : this.getView().byId('input-d').getSelectedKey(),
					'matchType' : matchType,
					'date' : this.getView().byId('input-h').getValue(),
					'members' : members
				};
				console.log(dataBody);
			var oModel = new JSONModel(dataBody);
			this.getView().setModel(oModel,'customModel');
			this.onOpenDialogCustom();
		},
		onOpenDialogCustom : function() {
			var oView = this.getView();
			this.oDialogCustom = oView.byId("customDialog");
			// create dialog lazily
			if (!this.oDialogCustom) {
				// create dialog via fragment factory
				this.oDialogCustom = sap.ui.xmlfragment(oView.getId(), "com.sap.pool-ui.fragment.custom", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.oDialogCustom);
			}
			this.oDialogCustom.open();
		},
		onSelectPool : function(event) {
			
			var eventId = event.getSource().getId();
			eventId = eventId.substring(eventId.lastIndexOf('-')+1,eventId.length);
			console.log(eventId);
			this.customPageIndex = eventId;
			this.selected = true;
			this.timeSlotValidation();
		},
		onConfirmCustom : function() {
			//on confirm create match + book the pool table for the same.

			var oPanel;
			// booking the pool table
			 if(this.currPage === 'customMatch') {
				oPanel = this.byId('panel2');
				var dataBody = {
					'poolId' : this.getView().getModel('customModel').oData.results.poolId,
					'startTime' : this.getView().byId('input-d').getSelectedKey(),
					'userId' : this.userId,
					'bookingDate' : this.byId('input-h').getValue(),
					'accessToken' : this.accessToken,
					'tokenType' : this.tokenType
				};
				PostData.postData('pool-table',dataBody,'book-pool-table/').then(result=>{
				if(result.message != 'CREATE_FAILURE') {
					//this.fetchPoolTableData(type,dataB,oPanel);
					// only now you can create the match...
					var teamOne = ""+this.userName;
					var teamTwo = "";
					var matchType = this.getView().getModel('userData').oData.matchType;
					var matchDate = this.byId('input-h').getValue();
					var tokens = this.getView().byId('input-f').getTokens();
					console.log(matchDate);
					for(var i=0; i<tokens.length; i++) {
						
						if(i%2 === 0) {
							teamTwo = teamTwo + tokens[i].mProperties.text;
						}
						else {
							teamOne = teamOne + ',' + tokens[i].mProperties.text;
						}
						if(i != 0) {
							teamTwo = teamTwo + ',';
						}
					}
					var dataB = {
						'teamOne' : teamOne,
						'teamTwo' : teamTwo,
						'matchType' : matchType,
						'matchDate' : matchDate,
						'bookingDate' : matchDate,
						'poolTableName' : this.getView().getModel('customModel').oData.results.poolName,
						'buildingName' : this.getView().getModel('customModel').oData.results.buildingName,
						'floorNo' : this.getView().getModel('customModel').oData.results.floorNo,
						'timeSlot' : this.getView().getModel('customModel').oData.timeSlot,
						'accessToken' : this.accessToken,
						'tokenType' : this.tokenType
					};
					PostData.postData('match',dataB,'create-match/').then(dataResult=>{
						
						//MessageToast.show("Match created");
						
							PostData.postData('mail',dataB,'send-mail/').then(dataResult=>{
								var index = new Array();
								index.push(1);
								index.push(2);
								index.push(3);
								PopOver.popOver(this,"Success",index);
							});
						
						
					});
					
					
				
					//MessageToast.show("POOL TABLE BOOKED");
				}
				else {
					var index = new Array();
					index.push(3);
					PopOver.popOver(this,"Error", index);
					//MessageToast.show("BOOKING FAILED");
				}
			});
				this.onCloseDialogCustom();
			}
		
		},
		onCloseDialogCustom : function() {
			if (this.oDialogCustom) {
				this.oDialogCustom.destroy(true);
			}
		},
		onCancelConfirmCustom : function() {
			this.onCloseDialogCustom();
		},
		onChangeDate : function(event) {
			this.timeSlotValidation();
		},
		onLogout : function() {
			this.session.removeAll();
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("login");
			return;
		}

	});

	return FacetFilterController;

}, /* bExport= */ true);
