/*global QUnit*/

sap.ui.define([
	"com/sap/pool-ui/controller/login.controller"
], function (Controller) {
	"use strict";

	QUnit.module("login Controller");

	QUnit.test("I should test the login controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});