/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["distributor/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
