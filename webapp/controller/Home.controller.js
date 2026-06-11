sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("distributor.controller.Home", {
        onInit: function () {
            // Register globally so native HTML onclick handlers can reach it
            if (!window.homeApp) {
                window.homeApp = this;
            }

            this.getView().addEventDelegate({
                onAfterRendering: function () {
                    // Fix SAPUI5 lowercasing viewBox in SVG elements which breaks scaling
                    var svgs = document.querySelectorAll('svg[viewbox]');
                    svgs.forEach(function(svg) {
                        var vb = svg.getAttribute('viewbox');
                        if (vb) {
                            svg.removeAttribute('viewbox');
                            svg.setAttribute('viewBox', vb);
                        }
                    });
                }
            });
        },

        onDistributorChange: function (oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            this.getView().getModel().setProperty("/selectedDistributor", sKey);
            this._updateMetrics(sKey);
        },

        _updateMetrics: function (sDistributor) {
            var oModel = this.getView().getModel();
            var oData = oModel.getData();
            // In a real app, this would fetch from backend or a DB object
            // Here, we have the mock DB in the model itself if we put it there,
            // or we just define it in the controller.
            // But let's assume the data is already bound properly if we structure our JSON correctly.
            // Wait, our JSON data currently only has 'activeSaudaMetrics' for 'All Distributor' statically.
            // I need to fetch the mock db. Let's do it simply here for demonstration:
            var saudaMetricsDb = {
                'All Distributor': { target: 42.5, achievement: 20.43, weekData: [ { week: 'Week 1', target: 10.63, achievement: 7.88 }, { week: 'Week 2', target: 10.63, achievement: 5.26 }, { week: 'Week 3', target: 10.63, achievement: 4.09 }, { week: 'Week 4', target: 10.63, achievement: 3.21 } ], expired: '66,506.0', nearExpired: '3.0', todaysRate: 'Rs. 1,15,200', pendingSauda: '2,268.486', overDue: '96,25,087.08', tomorrowDue: '1,52,60,561.00' },
                'Swati Enterprises': { target: 15.0, achievement: 12.5, weekData: [ { week: 'Week 1', target: 3.75, achievement: 4.2 }, { week: 'Week 2', target: 3.75, achievement: 3.8 }, { week: 'Week 3', target: 3.75, achievement: 2.5 }, { week: 'Week 4', target: 3.75, achievement: 2.0 } ], expired: '12,450.0', nearExpired: '1.2', todaysRate: 'Rs. 1,14,800', pendingSauda: '540.35', overDue: '23,10,450.00', tomorrowDue: '42,50,000.00' },
                'Shrikrishna Traders': { target: 12.5, achievement: 5.26, weekData: [ { week: 'Week 1', target: 3.12, achievement: 2.1 }, { week: 'Week 2', target: 3.12, achievement: 1.5 }, { week: 'Week 3', target: 3.12, achievement: 1.0 }, { week: 'Week 4', target: 3.12, achievement: 0.66 } ], expired: '34,220.0', nearExpired: '0.8', todaysRate: 'Rs. 1,15,600', pendingSauda: '920.12', overDue: '45,60,110.00', tomorrowDue: '78,10,000.00' },
                'Kailash Distributors': { target: 15.0, achievement: 2.67, weekData: [ { week: 'Week 1', target: 3.75, achievement: 1.58 }, { week: 'Week 2', target: 3.75, achievement: 0.96 }, { week: 'Week 3', target: 3.75, achievement: 0.13 }, { week: 'Week 4', target: 3.75, achievement: 0.0 } ], expired: '19,836.0', nearExpired: '1.0', todaysRate: 'Rs. 1,15,000', pendingSauda: '808.01', overDue: '27,54,527.08', tomorrowDue: '32,00,561.00' }
            };
            var metrics = saudaMetricsDb[sDistributor] || saudaMetricsDb['All Distributor'];
            oModel.setProperty("/activeSaudaMetrics", metrics);
            oModel.refresh(true);
        },

        setSaudaSalesTab: function (sTab) {
            this.getView().getModel().setProperty("/selectedSaudaSalesTab", sTab);
        },

        setTimeframe: function (sTimeframe) {
            this.getView().getModel().setProperty("/selectedTimeframe", sTimeframe);
        },

        formatSaudaSalesTabs: function (sSelectedTab) {
            var saudaClass = sSelectedTab === 'Sauda' ? 'bg-gradient-to-r from-[#f37a20] to-[#fab915] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800 bg-transparent';
            var salesClass = sSelectedTab === 'Sales' ? 'bg-gradient-to-r from-[#f37a20] to-[#fab915] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800 bg-transparent';
            
            return '<div class="flex w-full">' +
                   '<button onclick="window.homeApp.setSaudaSalesTab(\'Sauda\')" class="flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ' + saudaClass + '">Sauda</button>' +
                   '<button onclick="window.homeApp.setSaudaSalesTab(\'Sales\')" class="flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ' + salesClass + '">Sales</button>' +
                   '</div>';
        },

        formatTimeframeFilters: function (sSelectedTimeframe) {
            var mtdClass = sSelectedTimeframe === 'MTD' ? 'bg-white text-[#f37a20] shadow-2xs font-bold' : 'text-slate-500 font-medium hover:text-slate-800';
            var qtdClass = sSelectedTimeframe === 'QTD' ? 'bg-white text-[#f37a20] shadow-2xs font-bold' : 'text-slate-500 font-medium hover:text-slate-800';
            var ytdClass = sSelectedTimeframe === 'YTD' ? 'bg-white text-[#f37a20] shadow-2xs font-bold' : 'text-slate-500 font-medium hover:text-slate-800';

            return '<div class="flex gap-1">' +
                   '<button onclick="window.homeApp.setTimeframe(\'MTD\')" class="px-2.5 py-1 text-[10px] rounded-md transition-all ' + mtdClass + '">MTD</button>' +
                   '<button onclick="window.homeApp.setTimeframe(\'QTD\')" class="px-2.5 py-1 text-[10px] rounded-md transition-all ' + qtdClass + '">QTD</button>' +
                   '<button onclick="window.homeApp.setTimeframe(\'YTD\')" class="px-2.5 py-1 text-[10px] rounded-md transition-all ' + ytdClass + '">YTD</button>' +
                   '</div>';
        },

        formatProgressBarWidth: function (activeSaudaMetrics) {
            if (!activeSaudaMetrics) return "0%";
            var percent = (activeSaudaMetrics.achievement / activeSaudaMetrics.target) * 100;
            percent = Math.min(100, Math.max(5, percent));
            return percent + "%";
        },

        formatWeeklyChart: function (activeSaudaMetrics) {
            if (!activeSaudaMetrics || !activeSaudaMetrics.weekData) return "<div class='hidden'></div>";
            var weekData = activeSaudaMetrics.weekData;
            
            var maxVal = 0;
            weekData.forEach(function(d) {
                if (d.target > maxVal) maxVal = d.target;
                if (d.achievement > maxVal) maxVal = d.achievement;
            });

            function getBarHeight(val, maxVal) {
                if (!maxVal) return 0;
                var heightPercent = (val / maxVal) * 100;
                return Math.min(100, Math.max(3, heightPercent));
            }

            var html = '<div class="w-full flex justify-between px-1 h-full z-10">';
            weekData.forEach(function(data) {
                var targetHeight = getBarHeight(data.target, maxVal);
                var achieveHeight = getBarHeight(data.achievement, maxVal);
                html += '<div class="flex flex-col items-center justify-end h-full gap-2 w-10">';
                html += '  <div class="flex items-end justify-center gap-1 w-full h-full pb-1">';
                html += '    <div class="w-3 bg-[#0ca2db] rounded-t-sm transition-all duration-500" style="height: ' + targetHeight + '%;"></div>';
                html += '    <div class="w-3 bg-gradient-to-t from-[#85c441] to-[#a2d867] rounded-t-sm shadow-sm transition-all duration-500" style="height: ' + achieveHeight + '%;"></div>';
                html += '  </div>';
                html += '  <span class="text-[9px] font-bold text-slate-400">' + data.week + '</span>';
                html += '</div>';
            });
            html += '</div>';
            return html;
        },

        openTodayRateCalculator: function () {
            // Implementation of modal opening logic or navigate to another view
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: "Today's Rate Calculator",
                message: "The average book rate for today stands at Rs. 1,15,200/MT. Simulate order margins dynamically below:",
                type: 'todays_rate_calc'
            });
        },

        openExpiredContracts: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: "Expired Contracts",
                message: "",
                type: 'expired_contracts'
            });
        },

        openNearExpiredContracts: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: "Near Expired Contracts",
                message: "",
                type: 'near_expired_contracts'
            });
        },

        openPendingSauda: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: "Pending Sauda",
                message: "",
                type: 'pending_sauda'
            });
        },

        openOverduePayments: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: "Overdue Payments",
                message: "",
                type: 'overdue_payments'
            });
        },

        openTomorrowDue: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: "Tomorrow's Incoming Dues",
                message: "",
                type: 'tomorrow_due'
            });
        },

        navToLedger: function () {
            this.getView().getModel().setProperty("/ledgerSource", "home");
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("ledger");
        },

        initiateCall: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/activeModal", {
                title: "Outgoing VoIP Call",
                message: "Dialing register distributor number for \"" + oModel.getProperty("/selectedDistributor") + "\"... Ensure headset or phone audio output is synced."
            });
        }
    });
});
