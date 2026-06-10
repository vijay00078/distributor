sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("distributor.controller.Sauda", {
        onInit: function () {
            if (!window.saudaApp) {
                window.saudaApp = this;
            }
        },
        openQuickAction: function (sAction) {
            var oModel = this.getView().getModel();
            var oEvent = arguments[0];
            if (typeof sAction !== "string" && oEvent && oEvent.getSource) {
                // Determine action by the custom data or just hardcode it for each call
                // But we used press=".openQuickAction('action')" passing string won't work perfectly in UI5 XML without expression binding, 
                // wait, in UI5 1.56+ you can pass parameters to event handlers: press=".openQuickAction('Sauda Master')"
                // If the parameter is string, sAction is the string.
            }
            
            var dist = oModel.getProperty("/selectedDistributor") || "your distributor";
            oModel.setProperty("/activeModal", {
                title: sAction + " Request",
                message: 'Your process queue for "' + sAction + '" has been successfully initiated. System allocation engines are matching rates for ' + dist + '.'
            });
        },

        navToBookedSauda: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("bookedsauda");
        },

        openSaudaApprovalWizard: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: "New Sauda Authorization",
                message: "Create a fast allocation request directly below. Submitting will register a pending approval into the system ledger.",
                type: 'sauda_approval_wizard'
            });
        }
    });
});
