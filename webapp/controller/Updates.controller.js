sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("distributor.controller.Updates", {
        onInit: function () {
            if (!window.updatesApp) {
                window.updatesApp = this;
            }
        },

        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("home");
            this.getView().getModel().setProperty("/selectedNavTab", "home");
        },

        showUpdateMessage: function (sTopic) {
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: sTopic,
                message: 'You tapped on "' + sTopic + '". This triggers your designated surveyor feedback portal where you can enter ratings, review upcoming products or report transit issues directly to the mill manager.'
            });
        }
    });
});
