sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/format/DateFormat',
	'sap/m/MessageToast'
], function(jQuery,Controller, JSONModel, DateFormat, MessageToast) {

		"use strict";

		var land = Controller.extend("com.sap.pool-ui.controller.land", {

			onInit : function() {
				var pool = sap.ui.require.toUrl("com/sap/pool-ui/view/cards/pool/manifest.json"),
				carrom = sap.ui.require.toUrl("com/sap/pool-ui/view/cards/carrom/manifest.json"),
				chess = sap.ui.require.toUrl("com/sap/pool-ui/view/cards/chess/manifest.json"),
				fooseball = sap.ui.require.toUrl("com/sap/pool-ui/view/cards/fooseball/manifest.json");

				this.getView().setModel(new JSONModel({
				pool: pool,
				carrom : carrom,
				chess : chess,
				fooseball : fooseball
			}));
			},
			onAction : function() {

			}

		});

		return land;
});