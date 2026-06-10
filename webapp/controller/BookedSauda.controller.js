sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("distributor.controller.BookedSauda", {
        onInit: function () {
            if (!window.bookedSaudaApp) {
                window.bookedSaudaApp = this;
            }
        },

        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("home");
            this.getView().getModel().setProperty("/selectedNavTab", "home");
        },

        toggleSaudaFilter: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: "Filter Bookings",
                message: "You can filter by Approved, Processing, or Pending status. All records are currently auto-synced with Visakhapatnam regional offices."
            });
        },

        formatBookingsList: function (aBookings) {
            if (!aBookings) return "";

            var html = '<div>';
            var viewId = this.getView().getId();
            aBookings.forEach(function(dist, index) {
                var onClickStr = "window.bookedSaudaApp.toggleAccordion(" + index + ")";

                html += '<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 mb-3">';
                html += '  <div onclick="' + onClickStr + '" class="p-4 flex justify-between items-center cursor-pointer select-none hover:bg-slate-50">';
                html += '    <div class="flex items-start gap-2.5">';
                html += '      <div class="mt-1 shrink-0 text-[#f37a20]">';
                html += '        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">';
                html += '          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />';
                html += '          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />';
                html += '        </svg>';
                html += '      </div>';
                html += '      <div>';
                html += '        <h4 class="font-bold text-slate-800 text-sm leading-tight">' + dist.name + '</h4>';
                html += '        <span class="text-[11px] text-slate-500 leading-normal block mt-1">' + dist.location + '-' + dist.pin + '</span>';
                html += '      </div>';
                html += '    </div>';
                html += '    <div class="text-slate-400">';
                if (dist.expanded) {
                    html += '<svg class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>';
                } else {
                    html += '<svg class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>';
                }
                html += '    </div>';
                html += '  </div>';

                if (dist.expanded) {
                    html += '  <div class="bg-slate-50 px-4 py-3 border-t border-slate-100 space-y-3 divide-y divide-slate-200">';
                    dist.bookings.forEach(function(booking) {
                        html += '    <div class="pt-3 first:pt-0">';
                        html += '      <div class="flex justify-between items-center mb-1">';
                        html += '        <span class="text-xs font-bold text-slate-900 flex items-center gap-1.5"><span class="text-[#f37a20]">#</span>' + booking.id + '</span>';
                        html += '        <span class="bg-[#eef7ec] text-[#0e984a] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">';
                        html += '          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>✔ ' + booking.status;
                        html += '        </span>';
                        html += '      </div>';
                        html += '      <div class="flex justify-between items-center">';
                        html += '        <span class="text-[10px] text-slate-500 font-semibold flex items-center gap-1">';
                        html += '          <svg class="w-3.5 h-3.5 text-[#fab915]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>';
                        html += '          ' + booking.date;
                        html += '        </span>';
                        html += '        <span class="text-[10px] bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-700 tracking-wide uppercase shadow-2xs">' + booking.product + '</span>';
                        html += '      </div>';
                        html += '    </div>';
                    });
                    html += '  </div>';
                }
                html += '</div>';
            });
            html += '</div>';
            return html;
        },

        toggleAccordion: function (index) {
            var oModel = this.getView().getModel();
            var aBookings = oModel.getProperty("/bookingsList");
            if (aBookings && aBookings[index]) {
                var wasExpanded = aBookings[index].expanded;
                
                // Close all accordions
                aBookings.forEach(function(b) {
                    b.expanded = false;
                });

                // Toggle the clicked one
                aBookings[index].expanded = !wasExpanded;
                
                oModel.setProperty("/bookingsList", aBookings);
                oModel.refresh(true);
            }
        }
    });
});
