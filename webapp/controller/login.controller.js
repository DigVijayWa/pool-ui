sap.ui.define([
		'jquery.sap.global',
		'sap/m/ObjectIdentifier',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/odata/ODataModel',
		'sap/ui/model/json/JSONModel',
		'sap/m/MessageToast',
		'sap/ui/core/UIComponent',
		'sap/ui/model/SimpleType',
		'sap/ui/model/ValidateException',
		'com/sap/pool-ui/controller/PostData',
		'com/sap/pool-ui/controller/PopOver'
	], function(jQuery, ObjectIdentifier, Controller, ODataModel, JSONModel, MessageToast,UIComponent,SimpleType,ValidateException,PostData,PopOver) {
	"use strict";
	var toggle = false;

	var FacetFilterController = Controller.extend("com.sap.pool-ui.controller.login", {
		onInit : function() {
			this.byId('customLoginPage').addStyleClass('loginClass');
			this.byId('main').addStyleClass('mainClass');
			this.session = new jQuery.sap.storage.Storage();
			if(this.session.get('accessToken') != null) {
				
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("home");
			}
			
			var oView = this.getView();
			var signup = this.getView().byId("signup");
			signup.setVisible(false);
			//this.attachGlobalFunctionToWindow();
			console.log(window);
			var data = {
				name : '',
				password : '',
				userNameState : sap.ui.core.ValueState.None,
				passwordState : sap.ui.core.ValueState.None
			};

			var oModel = new JSONModel(data);
			this.getView().setModel(oModel,'login');

			//attaching the validation code for the login controls

			sap.ui.getCore().getMessageManager().registerObject(oView.byId("uid"), true);
			sap.ui.getCore().getMessageManager().registerObject(oView.byId("pasw"), true);

			
				data = {
				name : '',
				password : '',
				passwordConfirm : '',
				email : '',
				userNameState : sap.ui.core.ValueState.None,
				passwordState : sap.ui.core.ValueState.None,
				emailState : sap.ui.core.ValueState.None,
				passwordConfirmState : sap.ui.core.ValueState.None
			};

			oModel = new JSONModel(data);
			this.getView().setModel(oModel,'signup');

			//attaching the validation code for the singup controls
			sap.ui.getCore().getMessageManager().registerObject(oView.byId("sign_uname"), true);
			sap.ui.getCore().getMessageManager().registerObject(oView.byId("sign_uemail"), true);
			sap.ui.getCore().getMessageManager().registerObject(oView.byId("sign_upasw"), true);
			
			
			//extracting the Inumber for the user photo.
			var that = this;
			jQuery.ajax({
                      	  url : '/services/userapi/currentUser ',
                         
                      method: 'GET',
                      crossDomain: true,
                      headers: {
                            'Content-Type': 'application/json'
                      },
                      success: function(data,textStatus, jqXHR) {
                      	console.log(data);
                      	var stringData = JSON.stringify(data);
                      	that.session.put('userData',stringData);
                      },
                      error: function(err) {
                      	console.log(err)
                      }
				 
             });
              console.log('session');
              var session = new jQuery.sap.storage.Storage()
              session.put('user','inumber');
              session = new jQuery.sap.storage.Storage()
              console.log(session.get('user'));
			
		},
		onLoginTap : function() {
			var signin = this.getView().byId("signin");
			var signup = this.getView().byId("signup");

			this.getView().byId('loginButton').setType(sap.m.ButtonType.Emphasized);
			this.getView().byId('signupButton').setType(sap.m.ButtonType.Transparent);

			if(toggle) {
				signin.setVisible(true);
				signup.setVisible(false);
			}
			toggle = false;
		},
		onSubmitTap : function() {
			var oView = this.getView();
			var aInputs = [];
			var bValidationError = false;


			if(toggle) { //page is in signup form.


				//validation code is here
				
				if(!this.validatePassword(this.byId('sign_upasw').getValue()) 
				|| !this.validateUserName(this.byId('sign_uname').getValue())
				|| !this.validateEmail(this.byId('sign_uemail').getValue())
				|| !this.validatePasswordConfirm()){
					return;
				}
				
				var dataBody = {
					'userName' : oView.byId('sign_uname').getValue(),
					'userId' : this.generateUserId(),
					'userEmail' : oView.byId('sign_uemail').getValue(),
					'password' : oView.byId('sign_upasw').getValue()
				};
			
				PostData.postData('signup',dataBody).then(result=>{
					if(result.success === true) { 
						console.log(result);
						var index = new Array();
		 				index.push(0);
						PopOver.popOver(this,"Success", index);
					}
		 		}).catch(error=>{
		 			var index = new Array();
		 			index.push(1);
						PopOver.popOver(this,"Error", index);
		 		});
			}
			else {		// page is in signin form.
				this.byId("pasw").setValueState(sap.ui.core.ValueState.None);
				if(!this.validatePassword(this.byId('pasw').getValue()) || !this.validateUserName(this.byId('uid').getValue())){
					return;
				}
				var dataBody = {
					
					'userName' : oView.byId('uid').getValue(),
					'password' : oView.byId('pasw').getValue()
				};
				PostData.postData('signin',dataBody).then(result=>{
					if(result.success === true) { 
						console.log(result);
						
						this.session.put('userName',oView.byId('uid').getValue());
						this.session.put('accessToken',result.accessToken);
						this.session.put('tokenType',result.tokenType);
						
							var oRouter = UIComponent.getRouterFor(this);
							oRouter.navTo("land");
					}	
		 		}).catch(error=>{
		 			var index = new Array();
		 			index.push(0);
						PopOver.popOver(this,"Error", index);
		 		});
			}
		},
		onChangeUserName : function() {
			if(!this.validateUserName(this.byId('uid').getValue())) {
				this.getView().getModel('login').setProperty('/userNameState',sap.ui.core.ValueState.Error);
				console.log(this.getView().getModel('login'));
				return;
			}
			this.getView().getModel('login').setProperty('/userNameState',sap.ui.core.ValueState.None);
		},
		onChangeSignUserName : function() {
			if(!this.validateUserName(this.byId('sign_uname').getValue())) {
				this.getView().getModel('signup').setProperty('/userNameState',sap.ui.core.ValueState.Error);
				console.log(this.getView().getModel('login'));
				return;
			}
			this.getView().getModel('signup').setProperty('/userNameState',sap.ui.core.ValueState.None);
		},
		onChangeSignPassword : function() {
			if(!this.validatePassword(this.byId('sign_upasw').getValue())) {
				this.getView().getModel('signup').setProperty('/passwordState',sap.ui.core.ValueState.Error);
				console.log(this.getView().getModel('signup'));
				return;
			}
			this.getView().getModel('signup').setProperty('/passwordState',sap.ui.core.ValueState.None);
		},
		onChangeSignUserEmail : function() {
			if(!this.validateEmail(this.byId('sign_uemail').getValue())) {
				this.getView().getModel('signup').setProperty('/emailState',sap.ui.core.ValueState.Error);
				console.log(this.getView().getModel('signup'));
				return;
			}
			this.getView().getModel('signup').setProperty('/emailState',sap.ui.core.ValueState.None);
		},
		onChangeSignPasswordConfirm : function() {
			if(!this.validatePasswordConfirm()) {
				this.getView().getModel('signup').setProperty('/passwordConfirmState',sap.ui.core.ValueState.Error);
				console.log(this.getView().getModel('signup'));
				return;
			}
			this.getView().getModel('signup').setProperty('/passwordConfirmState',sap.ui.core.ValueState.None);
		},
		onChangePassword : function() {
			if(!this.validatePassword(this.byId('pasw').getValue())) {
				this.getView().getModel('login').setProperty('/passwordState',sap.ui.core.ValueState.Error);
				console.log(this.getView().getModel('login'));
				return;
			}
			this.getView().getModel('login').setProperty('/passwordState',sap.ui.core.ValueState.None);
		},
		onSignupTap : function() {

			var signin = this.getView().byId("signin");
			var signup = this.getView().byId("signup");

			this.getView().byId('signupButton').setType(sap.m.ButtonType.Emphasized);
			this.getView().byId('loginButton').setType(sap.m.ButtonType.Transparent);

			if(!toggle) {
				signin.setVisible(false);
				signup.setVisible(true);
			}
			toggle = true;
		},
		generateUserId : function() {
			return Math.floor(Math.random()*1000000)+1000000;
		},
		validateUserName : function(oValue) {
			var reg = /^[a-zA-Z\-]+$/;
			if(oValue.length < 3 || oValue.length > 15) {
				return false;
			}
			if(!oValue.match(reg)) { 
				return false;
			}
			return true;
			
		},	
		validatePasswordConfirm : function() {
			if(this.byId('sign_upasw').getValue() === this.byId('sign_upasw_confirm').getValue()) {
				return true;
			}
			return false;
		},
		validateEmail : function(oValue) {
			var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!oValue.match(reg)) { 
				return false;
			}
			return true;
		},
		validatePassword : function(oValue) {

			var reg = "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})";
			if(!oValue.match(reg)) { 
				return false;
			}
			return true;
		}
	});

	return FacetFilterController;

}, /* bExport= */ true);
