sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("distributor.controller.App", {
        onInit: function () {
            // Set up a clock to update time periodically, matching the Angular logic
            this._updateClock();
            this._clockInterval = setInterval(this._updateClock.bind(this), 30000);
        },

        _updateClock: function () {
            var oModel = this.getOwnerComponent().getModel();
            if (!oModel) return;

            var now = new Date();
            var hours = now.getHours();
            var minutes = now.getMinutes().toString().padStart(2, '0');
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            var hoursStr = hours.toString().padStart(2, '0');
            oModel.setProperty("/currentTime", hoursStr + ":" + minutes + " " + ampm);
        },

        onExit: function () {
            if (this._clockInterval) {
                clearInterval(this._clockInterval);
            }
        },

        _navToTab: function(sTabName) {
            var oModel = this.getOwnerComponent().getModel();
            oModel.setProperty("/selectedNavTab", sTabName);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo(sTabName);
        },

        onNavToHome: function() { this._navToTab("home"); },
        onNavToSauda: function() { this._navToTab("sauda"); },
        onNavToSales: function() { this._navToTab("sales"); },
        onNavToStp: function() { this._navToTab("stp"); },
        onNavToMore: function() { this._navToTab("more"); },

        formatBottomNav: function (sSelectedTab) {
            // Register globally so onclick can reach it
            if (!window.distApp) {
                window.distApp = this;
            }

            var homeClass = sSelectedTab === 'home' ? 'text-[#f37a20] scale-110' : 'text-slate-400 hover:text-slate-600';
            var saudaClass = sSelectedTab === 'sauda' ? 'text-[#f37a20] scale-110' : 'text-slate-400 hover:text-slate-600';
            var salesClass = sSelectedTab === 'sales' ? 'text-[#f37a20] scale-110' : 'text-slate-400 hover:text-slate-600';
            var stpClass = sSelectedTab === 'stp' ? 'text-[#f37a20] scale-110' : 'text-slate-400 hover:text-slate-600';
            var moreClass = sSelectedTab === 'more' ? 'text-[#f37a20] scale-110' : 'text-slate-400 hover:text-slate-600';

            return '<div class="flex justify-around items-center w-full">' +
                   '<button onclick="window.distApp.onNavToHome()" class="flex flex-col items-center justify-center flex-1 transition-all ' + homeClass + '">' +
                   '  <svg class="w-5 h-5 mb-0.5 stroke-current" fill="none" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>' +
                   '  <span class="text-[9px] font-bold">Home</span>' +
                   '</button>' +
                   '<button onclick="window.distApp.onNavToSauda()" class="flex flex-col items-center justify-center flex-1 transition-all ' + saudaClass + '">' +
                   '  <svg class="w-5 h-5 mb-0.5 stroke-current" fill="none" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>' +
                   '  <span class="text-[9px] font-bold">Sauda</span>' +
                   '</button>' +
                   '<button onclick="window.distApp.onNavToSales()" class="flex flex-col items-center justify-center flex-1 transition-all ' + salesClass + '">' +
                   '  <svg class="w-5 h-5 mb-0.5 stroke-current" fill="none" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.5 4.5L21.75 7.5M21.75 7.5V12m0-4.5H17.25" /></svg>' +
                   '  <span class="text-[9px] font-bold">Sales</span>' +
                   '</button>' +
                   '<button onclick="window.distApp.onNavToStp()" class="flex flex-col items-center justify-center flex-1 transition-all ' + stpClass + '">' +
                   '  <svg class="w-5 h-5 mb-0.5 stroke-current" fill="none" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.375m0-10.5h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6a2.25 2.25 0 012.25-2.25h5.25m4.5 0V3m0 2.25V18" /></svg>' +
                   '  <span class="text-[9px] font-bold">STP</span>' +
                   '</button>' +
                   '<button onclick="window.distApp.onNavToMore()" class="flex flex-col items-center justify-center flex-1 transition-all ' + moreClass + '">' +
                   '  <svg class="w-5 h-5 mb-0.5 stroke-current" fill="none" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>' +
                   '  <span class="text-[9px] font-bold">More</span>' +
                   '</button>' +
                   '</div>';
        },

        closeModal: function () {
            this.getOwnerComponent().getModel().setProperty("/activeModal", null);
        },

        submitNewSauda: function () {
            var oModel = this.getOwnerComponent().getModel();
            this.closeModal();
            setTimeout(function() {
                oModel.setProperty("/activeModal", {
                    title: "Booking Authenticated!",
                    message: "Successfully booked Sauda for selected product. Pipeline code was auto-generated."
                });
            }, 400);
        },

        formatModal: function (oActiveModal) {
            if (!oActiveModal) {
                return "<div style=\"display:none;\"></div>";
            }

            var title = oActiveModal.title || "";
            var message = oActiveModal.message || "";
            
            // Format dynamic content based on type (simpler than angular for notices, just text)
            var contentHtml = "";
            if (oActiveModal.type === 'todays_rate_calc') {
                contentHtml = '<div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3 mt-2">' +
                              '  <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulated Booking Quantity (MT)</label>' +
                              '  <input type="number" value="15" class="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 mt-1 focus:ring-1 focus:ring-[#f37a20] focus:outline-none" readonly /></div>' +
                              '  <div class="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">' +
                              '    <span class="font-bold text-slate-500">Calculated Value (INR):</span>' +
                              '    <span class="font-black text-[#f37a20]">₹ 17,28,000.00</span>' +
                              '  </div>' +
                              '</div>';
            } else if (oActiveModal.type === 'ledger_detail') {
                var formatCurrency = function(amount) {
                    if (amount === undefined || amount === null) return '0.00';
                    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                };
                contentHtml = '<div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 mt-2">' +
                              '  <div class="flex justify-between">' +
                              '    <span class="font-bold text-slate-400">Owner Name:</span>' +
                              '    <span class="font-bold text-slate-800">Swati Gupta</span>' +
                              '  </div>' +
                              '  <div class="flex justify-between">' +
                              '    <span class="font-bold text-slate-400">Total Outstanding:</span>' +
                              '    <span class="font-black text-red-600">Rs. ' + formatCurrency(oActiveModal.data && oActiveModal.data.outstanding) + '</span>' +
                              '  </div>' +
                              '  <div class="flex justify-between">' +
                              '    <span class="font-bold text-slate-400">Overdue Days:</span>' +
                              '    <span class="font-bold text-orange-600">45 Days</span>' +
                              '  </div>' +
                              '  <div class="flex justify-between">' +
                              '    <span class="font-bold text-slate-400">Credit Limit Status:</span>' +
                              '    <span class="font-bold text-emerald-600">Healthy</span>' +
                              '  </div>' +
                              '</div>';
            } else if (oActiveModal.type === 'sauda_approval_wizard') {
                contentHtml = '<div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3 mt-2">' +
                              '  <div>' +
                              '    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Distributor</label>' +
                              '    <select class="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs mt-1">' +
                              '      <option value="Adithi Trading">Adithi Trading</option>' +
                              '      <option value="RAJ SALES">RAJ SALES</option>' +
                              '      <option value="AADINATH TRENDING COMPANY">AADINATH TRENDING COMPANY</option>' +
                              '    </select>' +
                              '  </div>' +
                              '  <div>' +
                              '    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Segment</label>' +
                              '    <select class="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs mt-1">' +
                              '      <option value="SOYA BEAN OIL (1 SKU)">SOYA BEAN OIL</option>' +
                              '      <option value="MUSTARD OIL (2 SKU)">MUSTARD OIL</option>' +
                              '      <option value="FORTUNE BESAN (1 SKU)">FORTUNE BESAN</option>' +
                              '    </select>' +
                              '  </div>' +
                              '  <div class="grid grid-cols-2 gap-2">' +
                              '    <div>' +
                              '      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity (MT)</label>' +
                              '      <input type="number" value="10" class="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs mt-1"/>' +
                              '    </div>' +
                              '    <div>' +
                              '      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking Date</label>' +
                              '      <input type="text" value="08-06-2026" placeholder="11-08-2022" class="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs mt-1"/>' +
                              '    </div>' +
                              '  </div>' +
                              '</div>';
            }

            var buttonsHtml = '';
            if (oActiveModal.type === 'sauda_approval_wizard') {
                buttonsHtml = '<button onclick="window.distApp.submitNewSauda()" class="flex-1 py-2.5 bg-gradient-to-r from-[#f37a20] to-[#fab915] text-white rounded-xl text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all">Confirm & Submit</button>';
            }

            return '<div class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">' +
                   '  <div class="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 relative animate-scale-up">' +
                   '    <div class="flex items-center gap-3 mb-4">' +
                   '      <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#f37a20]">' +
                   '        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">' +
                   '          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />' +
                   '        </svg>' +
                   '      </div>' +
                   '      <h3 class="text-base font-black text-slate-900">' + title + '</h3>' +
                   '    </div>' +
                   '    <div class="text-xs text-slate-600 leading-relaxed mb-6 space-y-3">' +
                   '      <p>' + message + '</p>' +
                   contentHtml +
                   '    </div>' +
                   '    <div class="flex gap-3">' +
                   buttonsHtml +
                   '      <button onclick="window.distApp.closeModal()" class="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 active:scale-95 transition-all">Close</button>' +
                   '    </div>' +
                   '  </div>' +
                   '</div>';
        }
    });
});