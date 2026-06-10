sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("distributor.controller.Ledger", {
        onInit: function () {
            if (!window.ledgerApp) {
                window.ledgerApp = this;
            }

            this.getView().addEventDelegate({
                onAfterRendering: function () {
                    var domRef = this.getView().getDomRef();
                    if (domRef) {
                        var domEl = domRef.querySelector('input[placeholder*="Search Swati"]');
                        if (domEl && !domEl._hasInputListener) {
                            domEl.addEventListener("input", function(e) {
                                window.ledgerApp.onSearchHtml(e.target.value);
                            });
                            domEl._hasInputListener = true;
                        }
                    }
                }.bind(this)
            });
        },

        onNavBack: function () {
            var oModel = this.getView().getModel();
            var sSource = oModel.getProperty("/ledgerSource") || "home";
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo(sSource);
            oModel.setProperty("/selectedNavTab", sSource);
        },

        onSearchHtml: function (val) {
            this.getView().getModel().setProperty("/ledgerSearchText", val);
        },

        clearSearch: function() {
            this.getView().getModel().setProperty("/ledgerSearchText", "");
            var domRef = this.getView().getDomRef();
            if (domRef) {
                var domEl = domRef.querySelector('input[placeholder*="Search Swati"]');
                if (domEl) {
                    domEl.value = "";
                }
            }
        },

        formatClearButton: function (sSearchText) {
            if (sSearchText) {
                return '<button onclick="window.ledgerApp.clearSearch()" class="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">' +
                       '  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">' +
                       '    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />' +
                       '  </svg>' +
                       '</button>';
            }
            return '<div style="display:none;"></div>';
        },

        formatLedgerList: function (aLedgerData, sSearchText) {
            if (!aLedgerData) return "";

            var query = (sSearchText || "").toLowerCase().trim();
            var filtered = aLedgerData;

            if (query) {
                filtered = aLedgerData.filter(function(item) {
                    return item.name.toLowerCase().indexOf(query) !== -1 ||
                           item.location.toLowerCase().indexOf(query) !== -1;
                });
            }

            if (filtered.length === 0) {
                return '<div class="p-8 text-center text-slate-400 text-sm">No customers found matching "' + sSearchText + '"</div>';
            }

            var html = '<div>';
            filtered.forEach(function(item) {
                var amt = item.outstanding.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                
                // Note: to implement click, we can attach event listeners post-rendering or use inline onClick with a global window ref.
                // Since this is UI5, inline onclick reaching back to controller is messy.
                // A better approach is rendering buttons or firing events from DOM.
                // For demonstration, we'll just log or use sap.ui.getCore().byId(...) if we have a stable ID, 
                // but since it's inside raw HTML, we might just leave the layout styling visually intact.
                var onClickStr = "window.ledgerApp.onItemClick('" + item.name.replace(/'/g, "\\'") + "')";

                html += '<div onclick="' + onClickStr + '" class="p-4 flex justify-between items-center hover:bg-slate-50 active:bg-orange-50 transition-all cursor-pointer">';
                html += '  <div class="flex flex-col pr-3">';
                html += '    <span class="text-sm font-bold text-slate-800 leading-snug">' + item.name + '</span>';
                html += '    <span class="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">';
                html += '      <svg class="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">';
                html += '        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />';
                html += '        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />';
                html += '      </svg>' + item.location;
                html += '    </span>';
                html += '  </div>';
                html += '  <div class="text-right shrink-0">';
                html += '    <span class="text-xs font-bold text-[#eb3330] block">Rs. ' + amt + '</span>';
                html += '    <span class="text-[9px] text-orange-500 font-semibold bg-orange-50 px-1.5 py-0.5 rounded-full mt-1 inline-block">Tap to View Ledger</span>';
                html += '  </div>';
                html += '</div>';
            }.bind(this));
            html += '</div>';

            return html;
        },

        onItemClick: function(sName) {
            var oModel = this.getView().getModel();
            var aLedger = oModel.getProperty("/ledgerData") || [];
            var item = aLedger.find(function(i) { return i.name === sName; });
            if (item) {
                oModel.setProperty("/activeModal", {
                    title: item.name,
                    message: "Ledger summary for unit branch in " + item.location + ". Balance reflects total unadjusted invoices.",
                    type: 'ledger_detail',
                    data: item
                });
            }
        }
    });
});
