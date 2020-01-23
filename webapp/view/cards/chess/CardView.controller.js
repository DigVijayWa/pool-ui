sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.sap.pool-ui.view.cards.chess.CardView", {

		onInit: function () {
			var mapImageUrl = sap.ui.require.toUrl("com/sap/pool-ui/model/chess.jpg");
			this.getView().setModel(new JSONModel({ mapImageUrl: mapImageUrl }));
		}

	});
});