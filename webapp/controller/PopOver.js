sap.ui.define([
		'com/sap/pool-ui/controller/MessageMapping',
		'sap/m/MessageItem',
		'sap/m/MessageView',
		'sap/m/Dialog',
		'sap/m/Bar',
		'sap/m/Text',
		'sap/m/Button',
		'sap/ui/model/json/JSONModel',
	],
	function(MessageMapping,MessageItem,MessageView,Dialog,Bar,Text,Button,JSONModel){
		"use strict";
		
		var PopOver = {
			
			popOver : function(oView,oType,index) {
			var that = oView;
			var oMessage = new Array();
			for(var i=0;i<index.length;i++) {
				oMessage.push(oType === 'Success' ? MessageMapping.oSuccessMessage[index[i]] : MessageMapping.oErrorMessage[index[i]]);
			}
			console.log(oMessage);
			var oMessageTemplate = new MessageItem({
				type: '{type}',
				title: '{title}',
				description: '{description}',
				subtitle: '{subtitle}',
				counter: '{counter}',
				markupDescription: '{markupDescription}'
			});

			var aMockMessages = oMessage;
			console.log(aMockMessages);
			var oModel = new JSONModel();

			oModel.setData(aMockMessages);

			oView.oMessageView = new MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: "/",
					template: oMessageTemplate
				}
			});

			var oBackButton = new Button({
					icon: sap.ui.core.IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						oView.oMessageView.navigateBack();
						this.setVisible(false);
					}
				});



			oView.oMessageView.setModel(oModel);

			oView.oDialog = new Dialog({
				resizable: true,
				content: oView.oMessageView,
				state: oType,
				beginButton: new Button({
					press: function () {
						this.getParent().close();
					},
					text: "Close"
				}),
				customHeader: new Bar({
					contentMiddle: [
						new Text({ text: oType})
					],
					contentLeft: [oBackButton]
				}),
				contentHeight: "300px",
				contentWidth: "500px",
				verticalScrolling: false
			});
			
			oView.oMessageView.navigateBack();
			oView.oDialog.open();
		}
		};
		return PopOver;
	}
);