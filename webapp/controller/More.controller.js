sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("distributor.controller.More", {
        onInit: function () {
            if (!window.moreApp) {
                window.moreApp = this;
            }
        },

        navToLedger: function () {
            this.getView().getModel().setProperty("/ledgerSource", "more");
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("ledger");
        },

        navToUpdates: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("updates");
        },

        showSystemNotice: function (sTitle, sMessage) {
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: sTitle,
                message: sMessage
            });
        }
    });
});
