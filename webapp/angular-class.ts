
  // Current dynamic local time format matching exact screenshot dates
  currentTime = signal<string>('05:24 PM');

  // Interactive Signals for UI Navigation/Layout routing
  selectedDistributor = signal<string>('All Distributor');
  selectedSaudaSalesTab = signal<'Sauda' | 'Sales'>('Sauda');
  selectedTimeframe = signal<string>('MTD');
  selectedNavTab = signal<string>('home');
  currentPage = signal<'main' | 'ledger' | 'booked-sauda' | 'updates'>('main');

  // Input states for ledger search and mock calculators
  ledgerSearchText = signal<string>('');
  simulatedQty = signal<number>(15);
  
  // New Sauda creation variables
  newSaudaDist = 'Adithi Trading';
  newSaudaProd = 'SOYA BEAN OIL (1 SKU)';
  newSaudaQty = 10;
  newSaudaDate = '08-06-2026';

  // Modal active tracker
  activeModal = signal<{
    title: string;
    message: string;
    type?: string;
    data?: any;
  } | null>(null);

  // List of distributors
  distributorList = [
    'All Distributor',
    'Adithi Trading',
    'RAJ SALES',
    'AADINATH TRENDING COMPANY'
  ];

  // Raw mock database for the reactive dashboards based on distributor name
  private saudaMetricsDb: Record<string, SaudaData> = {
    'All Distributor': {
      target: 42.5,
      achievement: 20.43,
      weekData: [
        { week: 'Week 1', target: 10.63, achievement: 7.88 },
        { week: 'Week 2', target: 10.63, achievement: 5.26 },
        { week: 'Week 3', target: 10.63, achievement: 4.09 },
        { week: 'Week 4', target: 10.63, achievement: 3.21 }
      ],
      expired: '66,506.0',
      nearExpired: '3.0',
      todaysRate: 'Rs. 1,15,200',
      pendingSauda: '2,268.486',
      overDue: '96,25,087.08',
      tomorrowDue: '1,52,60,561.00'
    },
    'Adithi Trading': {
      target: 15.0,
      achievement: 12.5,
      weekData: [
        { week: 'Week 1', target: 3.75, achievement: 4.2 },
        { week: 'Week 2', target: 3.75, achievement: 3.8 },
        { week: 'Week 3', target: 3.75, achievement: 2.5 },
        { week: 'Week 4', target: 3.75, achievement: 2.0 }
      ],
      expired: '12,450.0',
      nearExpired: '1.2',
      todaysRate: 'Rs. 1,14,800',
      pendingSauda: '540.35',
      overDue: '23,10,450.00',
      tomorrowDue: '42,50,000.00'
    },
    'RAJ SALES': {
      target: 12.5,
      achievement: 5.26,
      weekData: [
        { week: 'Week 1', target: 3.12, achievement: 2.1 },
        { week: 'Week 2', target: 3.12, achievement: 1.5 },
        { week: 'Week 3', target: 3.12, achievement: 1.0 },
        { week: 'Week 4', target: 3.12, achievement: 0.66 }
      ],
      expired: '34,220.0',
      nearExpired: '0.8',
      todaysRate: 'Rs. 1,15,600',
      pendingSauda: '920.12',
      overDue: '45,60,110.00',
      tomorrowDue: '78,10,000.00'
    },
    'AADINATH TRENDING COMPANY': {
      target: 15.0,
      achievement: 2.67,
      weekData: [
        { week: 'Week 1', target: 3.75, achievement: 1.58 },
        { week: 'Week 2', target: 3.75, achievement: 0.96 },
        { week: 'Week 3', target: 3.75, achievement: 0.13 },
        { week: 'Week 4', target: 3.75, achievement: 0.0 }
      ],
      expired: '19,836.0',
      nearExpired: '1.0',
      todaysRate: 'Rs. 1,15,000',
      pendingSauda: '808.01',
      overDue: '27,54,527.08',
      tomorrowDue: '32,00,561.00'
    }
  };

  // Outstanding customers ledger (Matches screenshot names)
  ledgerList = signal<CustomerLedgerItem[]>([
    { name: 'SWATI ENTERPRISES', outstanding: 33032736.95, location: 'Visakhapatnam-Andhra Pradesh' },
    { name: 'Shrikrishnashraya Trading company', outstanding: 28880379.77, location: 'Guntur-Andhra Pradesh' },
    { name: 'Kailash Kirana stores', outstanding: 13841956.08, location: 'Vijayawada-Andhra Pradesh' },
    { name: 'Jaiswal Agencies', outstanding: 13671388.79, location: 'Visakhapatnam-Andhra Pradesh' },
    { name: 'Madhavlal Jankilal trading pvt ltd', outstanding: 11848838.13, location: 'Nellore-Andhra Pradesh' },
    { name: 'KHANANI PROVISION', outstanding: 10855503.94, location: 'Tirupati-Andhra Pradesh' },
    { name: 'Rameshwarlal Biharilal agrawal', outstanding: 6915994.00, location: 'Visakhapatnam-Andhra Pradesh' },
    { name: 'Chandumal Bhagwandas', outstanding: 6070019.79, location: 'Kakinada-Andhra Pradesh' },
    { name: 'Prakash Sales', outstanding: 4602658.22, location: 'Anantapur-Andhra Pradesh' },
    { name: 'Iqbal Kirana stores', outstanding: 3936407.14, location: 'Kurnool-Andhra Pradesh' }
  ]);

  // Booked saudas listing (matches image.jpeg)
  bookingsList = signal<DistributorBooking[]>([
    {
      name: 'Adithi Trading',
      location: 'Visakhapatnam-Andhra Pradesh',
      pin: '211345',
      expanded: false,
      bookings: [
        { id: '00014890', date: '08-08-2022', status: 'Approved', product: 'MUSTARD OIL (2 SKU)' }
      ]
    },
    {
      name: 'RAJ SALES',
      location: 'Visakhapatnam-Andhra Pradesh',
      pin: '2112934',
      expanded: false,
      bookings: [
        { id: '00014902', date: '10-08-2022', status: 'Approved', product: 'SOYA BEAN OIL (1 SKU)' }
      ]
    },
    {
      name: 'AADINATH TRENDING COMPANY',
      location: 'Visakhapatnam-Andhra Pradesh',
      pin: '2112932',
      expanded: true,
      bookings: [
        { id: '00014911', date: '11-08-2022', status: 'Approved', product: 'SOYA BEAN OIL (1 SKU)' },
        { id: '00014912', date: '11-08-2022', status: 'Approved', product: 'SOYA BEAN OIL (1 SKU)' },
        { id: '119', date: '16-08-2022', status: 'Approved', product: 'SOYA BEAN OIL (1 SKU)' }
      ]
    }
  ]);

  // Computed signals
  activeSaudaMetrics = computed(() => {
    const active = this.selectedDistributor();
    return this.saudaMetricsDb[active] || this.saudaMetricsDb['All Distributor'];
  });

  progressBarWidth = computed(() => {
    const metrics = this.activeSaudaMetrics();
    const percent = (metrics.achievement / metrics.target) * 100;
    return Math.min(100, Math.max(5, percent));
  });

  filteredLedger = computed(() => {
    const query = this.ledgerSearchText().toLowerCase().trim();
    if (!query) return this.ledgerList();
    return this.ledgerList().filter(
      item => 
        item.name.toLowerCase().includes(query) || 
        item.location.toLowerCase().includes(query)
    );
  });

  constructor() {
    // Dynamic system clock simulator
    effect(() => {
      const updateClock = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const hoursStr = hours.toString().padStart(2, '0');
        this.currentTime.set(`${hoursStr}:${minutes} ${ampm}`);
      };
      
      // Initial tick and start interval
      updateClock();
      const intervalId = setInterval(updateClock, 30000);
      return () => clearInterval(intervalId);
    });
  }

  // Distributor Selection trigger to update live values
  onDistributorChange(newVal: string) {
    this.selectedDistributor.set(newVal);
  }

  // Page Routing Handlers
  navigateToPage(page: 'main' | 'ledger' | 'booked-sauda' | 'updates') {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectNavTab(tab: string) {
    this.selectedNavTab.set(tab);
    this.currentPage.set('main'); // Always reset sub-page stack when changing tabs
  }

  // Accordion utility
  toggleDistributorAccordion(dist: DistributorBooking) {
    dist.expanded = !dist.expanded;
  }

  // Chart rendering math helper
  getBarHeight(val: number, maxVal: number): number {
    if (!maxVal) return 0;
    const heightPercent = (val / maxVal) * 100;
    return Math.min(100, Math.max(3, heightPercent));
  }

  // Format outstanding ledger currencies elegantly
  formatCurrency(amount: number): string {
    if (amount === undefined || amount === null) return '0.00';
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Quick action modals
  openQuickAction(action: string) {
    this.activeModal.set({
      title: `${action} Request`,
      message: `Your process queue for "${action}" has been successfully initiated. System allocation engines are matching rates for ${this.selectedDistributor()}.`
    });
  }

  openTodayRateCalculator() {
    this.simulatedQty.set(15); // Reset
    this.activeModal.set({
      title: "Today's Rate Calculator",
      message: `The average book rate for today stands at Rs. 1,15,200/MT. Simulate order margins dynamically below:`,
      type: 'todays_rate_calc'
    });
  }

  openSaudaApprovalWizard() {
    this.activeModal.set({
      title: "New Sauda Authorization",
      message: "Create a fast allocation request directly below. Submitting will register a pending approval into the system ledger.",
      type: 'sauda_approval_wizard'
    });
  }

  submitNewSauda() {
    // Inject the new Sauda dynamically into our reactive signals database
    const newList = [...this.bookingsList()];
    const targetDist = newList.find(d => d.name === this.newSaudaDist);
    if (targetDist) {
      targetDist.bookings.unshift({
        id: (Math.floor(Math.random() * 90000) + 10000).toString(),
        date: this.newSaudaDate,
        status: 'Approved',
        product: this.newSaudaProd
      });
      targetDist.expanded = true;
      this.bookingsList.set(newList);
    }
    
    this.closeModal();
    this.navigateToPage('booked-sauda');
    
    // Briefly alert confirmation via visual notification notice
    setTimeout(() => {
      this.activeModal.set({
        title: "Booking Authenticated!",
        message: `Successfully booked Sauda for ${this.newSaudaDist} product: ${this.newSaudaProd}. Pipeline code was auto-generated.`
      });
    }, 400);
  }

  selectLedgerCustomer(customer: CustomerLedgerItem) {
    this.activeModal.set({
      title: customer.name,
      message: `Ledger summary for unit branch in ${customer.location}. Balance reflects total unadjusted invoices.`,
      type: 'ledger_detail',
      data: customer
    });
  }

  showUpdateMessage(title: string) {
    this.activeModal.set({
      title: title,
      message: `You tapped on "${title}". This triggers your designated surveyor feedback portal where you can enter ratings, review upcoming products or report transit issues directly to the mill manager.`
    });
  }

  showSystemNotice(title: string, message: string) {
    this.activeModal.set({
      title,
      message
    });
  }

  toggleSaudaFilter() {
    this.activeModal.set({
      title: "Filter Bookings",
      message: "You can filter by Approved, Processing, or Pending status. All records are currently auto-synced with Visakhapatnam regional offices."
    });
  }

  initiateCall() {
    this.activeModal.set({
      title: "Outgoing VoIP Call",
      message: `Dialing register distributor number for "${this.selectedDistributor()}"... Ensure headset or phone audio output is synced.`
    });
  }

  closeModal() {
    this.activeModal.set(null);
  }

