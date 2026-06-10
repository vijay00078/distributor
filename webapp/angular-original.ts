import { Component, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces for rich mock data
interface SaudaData {
  target: number;
  achievement: number;
  weekData: { week: string; target: number; achievement: number }[];
  expired: string;
  nearExpired: string;
  todaysRate: string;
  pendingSauda: string;
  overDue: string;
  tomorrowDue: string;
}

interface CustomerLedgerItem {
  name: string;
  outstanding: number;
  location: string;
}

interface BookedSaudaItem {
  id: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  product: string;
}

interface DistributorBooking {
  name: string;
  location: string;
  pin: string;
  bookings: BookedSaudaItem[];
  expanded: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-900 flex justify-center items-center p-0 md:p-4 font-sans text-slate-800">
      
      <!-- Simulated Phone Container for desktop viewports, fluid full screen on mobile -->
      <div class="relative w-full max-w-md h-screen md:h-[840px] bg-[#f5f6f8] rounded-none md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col border-4 border-slate-950">
        
        <!-- TOP PHYSICAL CAMERA NOTCH / SPEAKER (hidden on absolute mobile screen widths) -->
        <div class="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-950 rounded-b-2xl z-50 justify-center items-start pt-1">
          <div class="w-12 h-1 bg-slate-800 rounded-full"></div>
          <div class="w-2.5 h-2.5 bg-slate-900 rounded-full ml-3 border border-slate-800"></div>
        </div>

        <!-- SIMULATED STATUS BAR -->
        <div class="bg-[#fcf7f2] px-6 pt-3 pb-1 flex justify-between items-center text-xs font-semibold text-slate-700 z-40 shrink-0">
          <span>{{ currentTime() }}</span>
          <div class="flex items-center gap-1.5">
            <!-- Signal Bars -->
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3c-1.2 0-2.4.2-3.6.7L18.7 14c.4-1.2.7-2.4.7-3.6 0-4.1-3.3-7.4-7.4-7.4zm-7.3 5.5C4.2 9.7 4 10.9 4 12.1c0 4.1 3.3 7.4 7.4 7.4 1.2 0 2.4-.2 3.6-.7L4.7 8.5z"/>
            </svg>
            <span>5G</span>
            <!-- Battery Icon -->
            <div class="flex items-center border border-slate-700 rounded px-0.5 py-0.2">
              <div class="h-2.5 w-5 bg-slate-700 rounded-xs flex items-center justify-start">
                <div class="h-full w-[85%] bg-slate-700 rounded-xs"></div>
              </div>
            </div>
            <span>85%</span>
          </div>
        </div>

        <!-- BRAND MAIN BACKGROUND ARCH DESIGN OVERLAY -->
        <div class="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#fcebd9] to-[#ffffff] rounded-b-[40px] -z-10"></div>

        <!-- APP HEADER SECTION -->
        <div class="px-5 py-3 flex justify-between items-center bg-transparent shrink-0">
          <!-- Swirl Handshake Logo -->
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f37a20] via-[#f7941d] to-[#fab915] p-0.5 shadow-md flex items-center justify-center animate-spin-slow">
              <div class="w-full h-full rounded-full bg-white flex items-center justify-center p-1.5 overflow-hidden relative">
                <!-- Swirling paths inside the logo -->
                <svg viewBox="0 0 100 100" class="w-full h-full fill-[#f37a20]">
                  <path d="M50,0 C63.8,0 76.3,5.6 85.4,14.6 L71.2,28.8 C65.8,23.4 58.3,20 50,20 C33.4,20 20,33.4 20,50 C20,66.6 33.4,80 50,80 C58.3,80 65.8,76.6 71.2,71.2 L85.4,85.4 C76.3,94.4 63.8,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z" />
                  <!-- Handshake outline icon in center -->
                  <path d="M42,45 C39.5,45 37,47.5 37,50 C37,52.5 39.5,55 42,55 L48,55 C48,55 53,50 56,53 C59,56 55,62 55,62 L48,62 C43,62 38,58 35,55 L28,62 L22,56 L29,49 C33,45 37,45 42,45 Z" fill="#eb3330" opacity="0.85"/>
                </svg>
              </div>
            </div>
            
            <!-- User Welcome Details -->
            <div class="flex flex-col">
              <div class="flex items-center gap-1">
                <!-- Default Avatar Silhoutte -->
                <div class="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
                  <svg class="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 leading-tight">Rohan Shelar</h4>
                  <p class="text-[9px] text-slate-500 font-medium">Jun 08, 2026 | 05:24 PM</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Notification Bell -->
          <button class="relative w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-orange-50 transition-colors">
            <svg class="w-5 h-5 text-[#f37a20]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>

        <!-- MAIN SCROLLABLE APP BODY -->
        <div class="flex-1 overflow-y-auto px-4 pb-20 scrollbar-none">
          
          <!-- SUB PAGE 1: LEDGER VIEW -->
          @if (currentPage() === 'ledger') {
            <div class="pt-2 animate-fade-in">
              <!-- Back header -->
              <div class="flex items-center gap-3 mb-4">
                <button (click)="navigateToPage('main')" class="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h2 class="text-lg font-bold text-slate-900">Customer Ledger</h2>
              </div>

              <!-- Outstanding Banner Graphic (Matches image (6).png) -->
              <div class="relative bg-gradient-to-r from-[#eef7ec] to-[#e4f3de] rounded-2xl p-4 mb-5 border border-emerald-100 shadow-sm flex items-center gap-4 overflow-hidden">
                <div class="absolute -right-6 -bottom-6 opacity-10">
                  <svg class="w-32 h-32 text-emerald-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                
                <!-- Custom Money Bag Illustration -->
                <div class="w-16 h-16 shrink-0 relative flex items-center justify-center">
                  <svg class="w-full h-full text-emerald-600" fill="currentColor" viewBox="0 0 64 64">
                    <!-- Money bag silhouette -->
                    <path d="M32 6C24.3 6 18 12.3 18 20c0 4.1 1.8 7.8 4.7 10.4C14.7 34.6 10 42.7 10 52c0 3.3 2.7 6 6 6h32c3.3 0 6-2.7 6-6 0-9.3-4.7-17.4-12.7-21.6 2.9-2.6 4.7-6.3 4.7-10.4 0-7.7-6.3-14-14-14zm0 8c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z" />
                    <!-- Rupee sign inside bag -->
                    <text x="32" y="47" font-size="18" font-weight="bold" fill="white" text-anchor="middle">₹</text>
                  </svg>
                </div>

                <div>
                  <span class="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">Outstanding Balance</span>
                  <span class="text-xl font-black text-[#eb3330]">Rs. 14,33,44,655.16</span>
                  <div class="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Refreshes every 30 mins
                  </div>
                </div>
              </div>

              <!-- Search Bar -->
              <div class="relative mb-4">
                <input 
                  type="text" 
                  [ngModel]="ledgerSearchText()"
                  (ngModelChange)="ledgerSearchText.set($event)"
                  placeholder="Search Swati Enterprises, Shrikrishna, Kailash..."
                  class="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f37a20] focus:border-transparent transition-all shadow-sm"
                />
                <svg class="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                @if (ledgerSearchText()) {
                  <button (click)="ledgerSearchText.set('')" class="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                }
              </div>

              <!-- Ledger Item Lists matching image (6).png -->
              <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
                @for (item of filteredLedger(); track item.name) {
                  <div (click)="selectLedgerCustomer(item)" class="p-4 flex justify-between items-center hover:bg-slate-50 active:bg-orange-50 transition-all cursor-pointer">
                    <div class="flex flex-col pr-3">
                      <span class="text-sm font-bold text-slate-800 leading-snug">{{ item.name }}</span>
                      <span class="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <svg class="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {{ item.location }}
                      </span>
                    </div>
                    <div class="text-right shrink-0">
                      <span class="text-xs font-bold text-[#eb3330] block">Rs. {{ formatCurrency(item.outstanding) }}</span>
                      <span class="text-[9px] text-orange-500 font-semibold bg-orange-50 px-1.5 py-0.5 rounded-full mt-1 inline-block">Tap to View Ledger</span>
                    </div>
                  </div>
                } @empty {
                  <div class="p-8 text-center text-slate-400 text-sm">
                    No customers found matching "{{ ledgerSearchText() }}"
                  </div>
                }
              </div>
            </div>
          }

          <!-- SUB PAGE 2: BOOKED SAUDA STATUS VIEW -->
          @else if (currentPage() === 'booked-sauda') {
            <div class="pt-2 animate-fade-in">
              <!-- Back header -->
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-3">
                  <button (click)="navigateToPage('main')" class="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <h2 class="text-lg font-bold text-slate-900">Booked Sauda Status</h2>
                </div>
                <!-- Filter icon -->
                <button (click)="toggleSaudaFilter()" class="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 text-slate-600 transition-colors">
                  <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                  </svg>
                </button>
              </div>

              <!-- Collapsible Lists matching image.jpeg -->
              <div class="space-y-3">
                @for (dist of bookingsList(); track dist.name) {
                  <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200">
                    <!-- Dist header -->
                    <div (click)="toggleDistributorAccordion(dist)" class="p-4 flex justify-between items-center cursor-pointer select-none hover:bg-slate-50">
                      <div class="flex items-start gap-2.5">
                        <div class="mt-1 shrink-0 text-[#f37a20]">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 class="font-bold text-slate-800 text-sm leading-tight">{{ dist.name }}</h4>
                          <span class="text-[11px] text-slate-500 leading-normal block mt-1">
                            {{ dist.location }}-{{ dist.pin }}
                          </span>
                        </div>
                      </div>
                      
                      <!-- Arrow Down/Up -->
                      <div class="text-slate-400">
                        @if (dist.expanded) {
                          <svg class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        } @else {
                          <svg class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        }
                      </div>
                    </div>

                    <!-- Inner Accordion content -->
                    @if (dist.expanded) {
                      <div class="bg-slate-50 px-4 py-3 border-t border-slate-100 space-y-3 divide-y divide-slate-200">
                        @for (booking of dist.bookings; track booking.id) {
                          <div class="pt-3 first:pt-0">
                            <!-- Booking main row -->
                            <div class="flex justify-between items-center mb-1">
                              <span class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <span class="text-[#f37a20]">#</span>{{ booking.id }}
                              </span>
                              
                              <!-- Approved badge Capsule -->
                              <span class="bg-[#eef7ec] text-[#0e984a] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                ✔ {{ booking.status }}
                              </span>
                            </div>

                            <div class="flex justify-between items-center">
                              <!-- Date -->
                              <span class="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                                <svg class="w-3.5 h-3.5 text-[#fab915]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                {{ booking.date }}
                              </span>
                              
                              <!-- Product Description Box -->
                              <span class="text-[10px] bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-700 tracking-wide uppercase shadow-2xs">
                                {{ booking.product }}
                              </span>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <!-- SUB PAGE 3: UPDATES VIEW -->
          @else if (currentPage() === 'updates') {
            <div class="pt-2 animate-fade-in">
              <!-- Back header -->
              <div class="flex items-center gap-3 mb-4">
                <button (click)="navigateToPage('main')" class="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h2 class="text-lg font-bold text-slate-900">Updates</h2>
              </div>

              <!-- Latest Updates Cards (Matches shared image (3).jpeg) -->
              <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
                <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Latest Updates</h3>
                
                <!-- Slide/Carousel card simulation of oil products -->
                <div class="bg-[#f2faf7] rounded-xl p-3 border border-emerald-50 mb-3 flex flex-col items-center">
                  <div class="flex justify-center items-end gap-1.5 py-4 h-32 w-full">
                    <!-- Fortune Soya -->
                    <div class="w-10 h-24 bg-green-100 rounded-md border-2 border-emerald-600 flex flex-col justify-between items-center p-1 shadow-sm relative transition-all hover:scale-105">
                      <span class="text-[6px] font-black text-emerald-800 uppercase leading-none text-center">Fortune</span>
                      <div class="w-full h-10 bg-emerald-500 rounded flex items-center justify-center text-white text-[7px] font-bold">SOYA</div>
                      <span class="text-[5px] text-slate-500">Chunx</span>
                    </div>
                    <!-- Fortune Mustard -->
                    <div class="w-12 h-26 bg-yellow-100 rounded-md border-2 border-yellow-600 flex flex-col justify-between items-center p-1.5 shadow-sm relative transition-all hover:scale-105">
                      <span class="text-[7px] font-black text-amber-800 uppercase leading-none">Fortune</span>
                      <div class="w-full h-11 bg-amber-500 rounded flex items-center justify-center text-white text-[7px] font-bold">KACHI</div>
                      <span class="text-[5px] text-slate-500">Mustard</span>
                    </div>
                    <!-- Fortune Soya Oil Jug -->
                    <div class="w-16 h-28 bg-[#fdf3e2] rounded-lg border-2 border-[#f37a20] flex flex-col justify-between items-center p-1.5 shadow-md relative transition-all hover:scale-105">
                      <div class="absolute -top-1 left-2 w-3 h-1.5 bg-[#f37a20] rounded-sm"></div>
                      <span class="text-[8px] font-black text-[#f37a20] uppercase leading-none mt-1">Fortune</span>
                      <div class="w-full h-12 bg-[#fab915] rounded flex flex-col items-center justify-center text-white p-0.5">
                        <span class="text-[7px] font-bold">RICE</span>
                        <span class="text-[5px] font-semibold leading-none">BRAN HEALTH</span>
                      </div>
                      <span class="text-[6px] text-slate-500 font-bold">1 Litre Jug</span>
                    </div>
                    <!-- Fortune Vivo -->
                    <div class="w-12 h-26 bg-sky-100 rounded-md border-2 border-sky-600 flex flex-col justify-between items-center p-1.5 shadow-sm relative transition-all hover:scale-105">
                      <span class="text-[7px] font-black text-sky-800 uppercase leading-none">Fortune</span>
                      <div class="w-full h-11 bg-sky-500 rounded flex items-center justify-center text-white text-[7px] font-bold">VIVO</div>
                      <span class="text-[5px] text-slate-500">Diabetes</span>
                    </div>
                    <!-- Fortune Besan -->
                    <div class="w-10 h-24 bg-amber-50 rounded-md border-2 border-amber-400 flex flex-col justify-between items-center p-1 shadow-sm relative transition-all hover:scale-105">
                      <span class="text-[6px] font-black text-amber-700 uppercase leading-none">Fortune</span>
                      <div class="w-full h-10 bg-amber-300 rounded flex items-center justify-center text-white text-[7px] font-bold">BESAN</div>
                      <span class="text-[5px] text-slate-500">Gram</span>
                    </div>
                  </div>
                  
                  <!-- Carousel Dots -->
                  <div class="flex gap-1 justify-center mt-2">
                    <span class="w-3 h-1.5 rounded-full bg-[#f37a20]"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  </div>
                </div>
              </div>

              <!-- Updates Navigation list -->
              <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
                <!-- Item 1 -->
                <div (click)="showUpdateMessage('Feedback Request')" class="p-4 flex justify-between items-center hover:bg-slate-50 active:bg-orange-50 transition-colors cursor-pointer">
                  <span class="text-sm font-bold text-slate-800">Feedback Request</span>
                  <svg class="w-5 h-5 text-[#f37a20]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>

                <!-- Item 2 -->
                <div (click)="showUpdateMessage('Survey')" class="p-4 flex justify-between items-center hover:bg-slate-50 active:bg-orange-50 transition-colors cursor-pointer">
                  <span class="text-sm font-bold text-slate-800">Survey</span>
                  <svg class="w-5 h-5 text-[#f37a20]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>

                <!-- Item 3 -->
                <div (click)="showUpdateMessage('Special Information / Notice')" class="p-4 flex justify-between items-center hover:bg-slate-50 active:bg-orange-50 transition-colors cursor-pointer">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-slate-800">Special Information / Notice</span>
                    <!-- Red notice indicator -->
                    <span class="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">1</span>
                  </div>
                  <svg class="w-5 h-5 text-[#f37a20]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
          }

          <!-- MAIN VIEWS DEPENDING ON BOTTOM NAV TAB -->
          @else {
            
            <!-- HOME TAB VIEW -->
            @if (selectedNavTab() === 'home') {
              <div class="pt-2 space-y-4 animate-fade-in">
                
                <!-- Distributor Filter Dropdown -->
                <div class="relative bg-white rounded-xl border border-slate-200 px-4 py-2 mt-2 shadow-2xs hover:border-[#f37a20] transition-colors">
                  <span class="absolute -top-2 left-3 bg-[#ffffff] px-1 text-[10px] text-[#f37a20] font-bold tracking-wider">Distributor Name</span>
                  <select 
                    [ngModel]="selectedDistributor()" 
                    (ngModelChange)="onDistributorChange($event)"
                    class="w-full bg-transparent text-sm font-bold text-slate-800 outline-none pr-8 cursor-pointer py-1.5"
                  >
                    @for (dist of distributorList; track dist) {
                      <option [value]="dist">{{ dist }}</option>
                    }
                  </select>
                </div>

                <!-- Sauda & Sales Tabs (Pills) -->
                <div class="flex bg-white p-1 rounded-2xl shadow-3xs border border-slate-100">
                  <button 
                    (click)="selectedSaudaSalesTab.set('Sauda')"
                    [class]="selectedSaudaSalesTab() === 'Sauda' ? 'bg-gradient-to-r from-[#f37a20] to-[#fab915] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800 bg-transparent'"
                    class="flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300"
                  >
                    Sauda
                  </button>
                  <button 
                    (click)="selectedSaudaSalesTab.set('Sales')"
                    [class]="selectedSaudaSalesTab() === 'Sales' ? 'bg-gradient-to-r from-[#f37a20] to-[#fab915] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800 bg-transparent'"
                    class="flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300"
                  >
                    Sales
                  </button>
                </div>

                <!-- Target and Achievement Progress Panel -->
                <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 relative overflow-hidden">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall {{ selectedSaudaSalesTab() }}</span>
                        <span class="text-xs text-slate-400 font-medium">({{ selectedDistributor() === 'All Distributor' ? 'Total' : 'Unit' }})</span>
                      </div>
                      <div class="flex items-baseline gap-2 mt-1">
                        <span class="text-lg font-black text-[#f37a20]">
                          {{ activeSaudaMetrics().achievement }} {{ selectedSaudaSalesTab() === 'Sauda' ? 'MT' : 'L' }}
                        </span>
                        <span class="text-xs text-slate-500 font-bold">
                          / {{ activeSaudaMetrics().target }} {{ selectedSaudaSalesTab() === 'Sauda' ? 'MT' : 'L' }} Target
                        </span>
                      </div>
                    </div>

                    <!-- MTD / QTD / YTD Filters -->
                    <div class="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      @for (tf of ['MTD', 'QTD', 'YTD']; track tf) {
                        <button 
                          (click)="selectedTimeframe.set(tf)"
                          [class]="selectedTimeframe() === tf ? 'bg-white text-[#f37a20] shadow-2xs font-bold' : 'text-slate-500 font-medium hover:text-slate-800'"
                          class="px-2.5 py-1 text-[10px] rounded-md transition-all"
                        >
                          {{ tf }}
                        </button>
                      }
                    </div>
                  </div>

                  <!-- Dynamic Progress bar -->
                  <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5">
                    <div 
                      [style.width.%]="progressBarWidth()" 
                      class="h-full bg-gradient-to-r from-[#fab915] to-[#f37a20] rounded-full transition-all duration-500"
                    ></div>
                  </div>

                  <!-- Interactive SVG Weekly bar charts (Week 1 to Week 4) -->
                  <div class="relative mt-2">
                    <div class="flex justify-between items-end h-32 pt-4 relative">
                      <!-- Grid horizontal helper lines -->
                      <div class="absolute inset-x-0 bottom-0 border-b border-slate-100 w-full"></div>
                      <div class="absolute inset-x-0 bottom-8 border-b border-slate-100 w-full"></div>
                      <div class="absolute inset-x-0 bottom-16 border-b border-slate-100 w-full"></div>
                      <div class="absolute inset-x-0 bottom-24 border-b border-slate-100 w-full"></div>

                      @for (w of activeSaudaMetrics().weekData; track w.week; let idx = $index) {
                        <div class="flex flex-col items-center flex-1 z-10">
                          <div class="flex gap-1.5 items-end justify-center w-full h-24">
                            <!-- Target Bar -->
                            <div class="group relative w-3.5 bg-[#0ca2db] rounded-t-xs hover:brightness-105 transition-all cursor-pointer"
                                 [style.height.%]="getBarHeight(w.target, activeSaudaMetrics().target / 2)">
                              <!-- Value tooltip on hover -->
                              <span class="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow">
                                {{ w.target }}
                              </span>
                            </div>

                            <!-- Achievement Bar -->
                            <div class="group relative w-3.5 bg-[#85c441] rounded-t-xs hover:brightness-105 transition-all cursor-pointer"
                                 [style.height.%]="getBarHeight(w.achievement, activeSaudaMetrics().target / 2)">
                              <span class="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow">
                                {{ w.achievement }}
                              </span>
                            </div>
                          </div>
                          <!-- Week label -->
                          <span class="text-[10px] font-bold text-slate-500 mt-2">{{ w.week }}</span>
                        </div>
                      }
                    </div>

                    <!-- Chart Legend (matches image (1).jpeg) -->
                    <div class="flex justify-center items-center gap-6 mt-4 pt-3 border-t border-slate-50">
                      <div class="flex items-center gap-2">
                        <span class="w-3.5 h-3.5 bg-[#0ca2db] rounded-sm"></span>
                        <span class="text-[11px] font-bold text-slate-600">Target</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="w-3.5 h-3.5 bg-[#85c441] rounded-sm"></span>
                        <span class="text-[11px] font-bold text-slate-600">Achievement</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pending Sauda / Expired Section Layout -->
                <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4">
                  <div class="flex justify-between items-center pb-2 border-b border-slate-50">
                    <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Expired & Near Expired</h3>
                    <span class="text-[10px] text-slate-400 font-bold">Real-time stats</span>
                  </div>

                  <!-- Grid of summary cards (matching beautiful asymmetric leaf-corner designs from image (5).png and image (4).png) -->
                  <div class="grid grid-cols-2 gap-3">
                    
                    <!-- Expired Card (Red with alarm clock) -->
                    <div class="bg-[#eb3330] rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] p-3.5 text-white shadow-sm flex flex-col justify-between h-24 hover:scale-[1.02] transition-transform cursor-pointer">
                      <div class="flex justify-between items-start">
                        <span class="text-[14px] font-bold tracking-wide">21.14 MT</span>
                        <!-- Custom Alarm warning SVG -->
                        <div class="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <span class="text-[10px] font-medium opacity-90 block">Expired</span>
                      </div>
                    </div>

                    <!-- Near Expired Card (Orange with clock) -->
                    <div class="bg-[#f49326] rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] p-3.5 text-white shadow-sm flex flex-col justify-between h-24 hover:scale-[1.02] transition-transform cursor-pointer">
                      <div class="flex justify-between items-start">
                        <span class="text-[14px] font-bold tracking-wide">168.776 MT</span>
                        <!-- Custom Alarm Warning Clock -->
                        <div class="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <span class="text-[10px] font-medium opacity-90 block">Near Expired</span>
                      </div>
                    </div>

                    <!-- Today's Rate Card (Teal/Blue with Rupee icon) -->
                    <div (click)="openTodayRateCalculator()" class="bg-[#0598d1] rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] p-3.5 text-white shadow-sm flex flex-col justify-between h-24 hover:scale-[1.02] transition-transform cursor-pointer">
                      <div class="flex justify-between items-start">
                        <span class="text-[14px] font-bold tracking-wide">Today's Rate</span>
                        <!-- Rupee Symbol badge -->
                        <div class="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center font-bold text-sm text-white">
                          ₹
                        </div>
                      </div>
                      <div>
                        <span class="text-[10px] font-medium opacity-90 block">Average Book Rate</span>
                      </div>
                    </div>

                    <!-- Pending Sauda Card (Gold/Yellow with clock) -->
                    <div class="bg-[#e7a726] rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] p-3.5 text-white shadow-sm flex flex-col justify-between h-24 hover:scale-[1.02] transition-transform cursor-pointer">
                      <div class="flex justify-between items-start">
                        <span class="text-[14px] font-bold tracking-wide">2268.486 MT</span>
                        <!-- Pending Clock SVG -->
                        <div class="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <span class="text-[10px] font-medium opacity-90 block">Pending Sauda</span>
                      </div>
                    </div>

                    <!-- Over Due Card (Red with alarm clock) - matches image (5).png -->
                    <div class="bg-[#eb3330] rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] p-3.5 text-white shadow-sm flex flex-col justify-between h-24 hover:scale-[1.02] transition-transform cursor-pointer">
                      <div class="flex justify-between items-start">
                        <span class="text-[10px] font-medium opacity-90 block">Over Due</span>
                        <div class="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center font-bold text-xs text-white">
                          ₹
                        </div>
                      </div>
                      <div>
                        <h4 class="text-[13px] font-black tracking-tight">₹ 9625087.08</h4>
                      </div>
                    </div>

                    <!-- Tomorrow Due Card (Orange with clock) - matches image (5).png -->
                    <div class="bg-[#f49326] rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] p-3.5 text-white shadow-sm flex flex-col justify-between h-24 hover:scale-[1.02] transition-transform cursor-pointer">
                      <div class="flex justify-between items-start">
                        <span class="text-[10px] font-medium opacity-90 block">Tomorrow Due</span>
                        <div class="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center font-bold text-xs text-white">
                          ₹
                        </div>
                      </div>
                      <div>
                        <h4 class="text-[13px] font-black tracking-tight">₹ 15260561.00</h4>
                      </div>
                    </div>

                  </div>
                </div>

                <!-- Quick Nav Links: Customer Ledger and Call to Customer -->
                <div class="space-y-2.5">
                  <div 
                    (click)="navigateToPage('ledger')"
                    class="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs hover:border-[#f37a20] transition-all flex justify-between items-center cursor-pointer group"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#f37a20]">
                        <!-- Ledger Doc Icon -->
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <span class="text-sm font-bold text-slate-800">Customer Ledger</span>
                    </div>
                    <svg class="w-5 h-5 text-[#f37a20] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>

                  <div 
                    (click)="initiateCall()"
                    class="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs hover:border-[#f37a20] transition-all flex justify-between items-center cursor-pointer group"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <!-- Phone Call Icon -->
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.161-4.138-6.963-6.963l1.302-.97c.36-.271.525-.733.417-1.173L6.963 3.107a1.248 1.248 0 00-1.173-.935H3.107a2.25 2.25 0 00-2.25 2.25v2.25z" />
                        </svg>
                      </div>
                      <span class="text-sm font-bold text-slate-800">Call to Customer</span>
                    </div>
                    <svg class="w-5 h-5 text-[#f37a20] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>

              </div>
            }

            <!-- SAUDA ACTION PANEL TAB (Matches shared image (2).jpeg) -->
            @if (selectedNavTab() === 'sauda') {
              <div class="pt-2 space-y-4 animate-fade-in">
                <!-- Heading Details -->
                <div class="flex justify-between items-center mt-2">
                  <h2 class="text-lg font-extrabold text-slate-900 uppercase tracking-wide">Sauda Overview</h2>
                  <span class="text-xs bg-orange-50 text-[#f37a20] font-bold px-2.5 py-1 rounded-full border border-orange-100">Pending</span>
                </div>

                <!-- Visual Graph displaying pending Saudas by days (Matches shared image (2).jpeg) -->
                <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pending Days Distribution (MT)</h3>
                  
                  <div class="flex justify-between items-end h-40 pt-6 px-2 relative">
                    <!-- Helper lines -->
                    <div class="absolute inset-x-0 bottom-0 border-b border-slate-100 w-full"></div>
                    <div class="absolute inset-x-0 bottom-10 border-b border-slate-100 w-full"></div>
                    <div class="absolute inset-x-0 bottom-20 border-b border-slate-100 w-full"></div>
                    <div class="absolute inset-x-0 bottom-30 border-b border-slate-100 w-full"></div>

                    <!-- 0-10 Days (0 value) -->
                    <div class="flex flex-col items-center flex-1">
                      <div class="text-[10px] font-bold text-slate-400 mb-1">0</div>
                      <div class="w-8 bg-[#fab915] rounded-t opacity-10" style="height: 2px"></div>
                      <span class="text-[10px] font-bold text-slate-600 mt-2">0-10</span>
                    </div>

                    <!-- 11-20 Days (0 value) -->
                    <div class="flex flex-col items-center flex-1">
                      <div class="text-[10px] font-bold text-slate-400 mb-1">0</div>
                      <div class="w-8 bg-[#fab915] rounded-t opacity-10" style="height: 2px"></div>
                      <span class="text-[10px] font-bold text-slate-600 mt-2">11-20</span>
                    </div>

                    <!-- 21-30 Days (approx 1,800 MT value) -->
                    <div class="flex flex-col items-center flex-1">
                      <div class="text-[10px] font-bold text-slate-800 mb-1">1,820</div>
                      <div class="w-8 bg-[#fab915] rounded-t-sm shadow-2xs transition-all hover:brightness-105 duration-300" style="height: 38%"></div>
                      <span class="text-[10px] font-bold text-slate-600 mt-2">21-30</span>
                    </div>

                    <!-- >30 Days (approx 5,200 MT value) -->
                    <div class="flex flex-col items-center flex-1">
                      <div class="text-[10px] font-bold text-slate-800 mb-1">5,268</div>
                      <div class="w-8 bg-[#fab915] rounded-t-sm shadow-xs transition-all hover:brightness-105 duration-300 animate-pulse-slow" style="height: 85%"></div>
                      <span class="text-[10px] font-bold text-slate-600 mt-2">>30</span>
                    </div>
                  </div>
                </div>

                <!-- Action Tiles Matrix (Exact replica from shared image (2).jpeg with updated leaf tile borders) -->
                <div class="grid grid-cols-2 gap-3.5">
                  
                  <!-- Tile 1: Sauda Extension (Green) -->
                  <button (click)="openQuickAction('Sauda Extension')" class="bg-[#0e984a] text-white p-4 rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] shadow-sm text-left flex flex-col justify-between h-28 hover:brightness-105 active:scale-95 transition-all">
                    <div class="flex justify-between items-start w-full">
                      <!-- Dynamic Expand Frame Icon -->
                      <svg class="w-8 h-8 text-white/90" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
                      </svg>
                    </div>
                    <span class="text-sm font-bold leading-snug">Sauda Extension</span>
                  </button>

                  <!-- Tile 2: Booked Sauda (Blue) -> Navigates to Booked Sauda page -->
                  <button (click)="navigateToPage('booked-sauda')" class="bg-[#0a7fb0] text-white p-4 rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] shadow-sm text-left flex flex-col justify-between h-28 hover:brightness-105 active:scale-95 transition-all">
                    <div class="flex justify-between items-start w-full">
                      <!-- Book Check Icon -->
                      <svg class="w-8 h-8 text-white/90" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.375m0-10.5h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6a2.25 2.25 0 012.25-2.25h5.25m4.5 0V3m0 2.25V18" />
                      </svg>
                    </div>
                    <span class="text-sm font-bold leading-snug">Booked Sauda</span>
                  </button>

                  <!-- Tile 3: Price Discovery (Cyan/Light Blue) -->
                  <button (click)="openQuickAction('Price Discovery')" class="bg-[#009bde] text-white p-4 rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] shadow-sm text-left flex flex-col justify-between h-28 hover:brightness-105 active:scale-95 transition-all">
                    <div class="flex justify-between items-start w-full">
                      <!-- Price Search Magnifier -->
                      <svg class="w-8 h-8 text-white/90" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM12 7v6m-3-3h6" />
                      </svg>
                    </div>
                    <span class="text-sm font-bold leading-snug">Price Discovery</span>
                  </button>

                  <!-- Tile 4: Limit Enhance (Dark Indigo) -->
                  <button (click)="openQuickAction('Limit Enhance')" class="bg-[#2f2d7a] text-white p-4 rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] shadow-sm text-left flex flex-col justify-between h-28 hover:brightness-105 active:scale-95 transition-all">
                    <div class="flex justify-between items-start w-full">
                      <!-- Up Upload Doc Icon -->
                      <svg class="w-8 h-8 text-white/90" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v12m0-12l3.75 3.75M12 9L8.25 12.75M19.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5" />
                      </svg>
                    </div>
                    <span class="text-sm font-bold leading-snug">Limit Enhance</span>
                  </button>

                  <!-- Tile 5: Sales Order (Yellow) -->
                  <button (click)="openQuickAction('Sales Order')" class="bg-[#fab915] text-slate-900 p-4 rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] shadow-sm text-left flex flex-col justify-between h-28 hover:brightness-105 active:scale-95 transition-all">
                    <div class="flex justify-between items-start w-full">
                      <!-- Delivery Truck SVG -->
                      <svg class="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.02M15 18.75a1.5 1.5 0 11-3 0m3 0H9" />
                      </svg>
                    </div>
                    <span class="text-sm font-black leading-snug text-slate-900">Sales Order</span>
                  </button>

                  <!-- Tile 6: Sauda Approval (Burgundy with Float Button) -->
                  <button (click)="openSaudaApprovalWizard()" class="bg-[#941b55] text-white p-4 rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] shadow-sm text-left flex flex-col justify-between h-28 relative overflow-hidden hover:brightness-105 active:scale-95 transition-all">
                    <div class="flex justify-between items-start w-full">
                      <!-- Handshake or Checklist Doc Icon -->
                      <svg class="w-8 h-8 text-white/90" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5a3.375 3.375 0 003.375 3.375h1.5" />
                      </svg>
                    </div>
                    <span class="text-sm font-bold leading-snug">Sauda Approval</span>
                    <!-- Plus Icon Badge simulated from image (2).jpeg -->
                    <div class="absolute -bottom-1 -right-1 w-10 h-10 bg-red-500 rounded-tl-2xl flex items-center justify-center font-bold text-lg text-white shadow">
                      +
                    </div>
                  </button>

                </div>
              </div>
            }

            <!-- SALES TAB VIEW -->
            @if (selectedNavTab() === 'sales') {
              <div class="pt-2 space-y-4 animate-fade-in">
                <div class="flex justify-between items-center mt-2">
                  <h2 class="text-lg font-extrabold text-slate-900 uppercase tracking-wide">Sales Analytics</h2>
                  <span class="text-xs bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-full border border-emerald-100">Live</span>
                </div>

                <!-- Interactive Sales Metrics card -->
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Sales Volume</span>
                      <h3 class="text-2xl font-black text-slate-800 mt-1">1,248.80 L</h3>
                    </div>
                    <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">↑ 14.2% MoM</span>
                  </div>

                  <!-- Mini Chart -->
                  <div class="h-28 flex items-end justify-between gap-1 px-1">
                    @for (val of [30, 45, 35, 60, 75, 55, 90, 80, 110]; track $index) {
                      <div class="w-full bg-slate-100 rounded-sm overflow-hidden h-full flex items-end">
                        <div class="bg-gradient-to-t from-[#f37a20] to-[#fab915] w-full rounded-t-xs" [style.height.%]="val"></div>
                      </div>
                    }
                  </div>
                  <div class="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider px-1">
                    <span>Oct 25</span>
                    <span>Dec 25</span>
                    <span>Feb 26</span>
                    <span>Apr 26</span>
                    <span>Jun 26</span>
                  </div>
                </div>

                <!-- Segment Sales distribution -->
                <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Sales by Product Family</h3>
                  
                  <div class="space-y-2.5">
                    <!-- Soya Oil -->
                    <div>
                      <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Soya Bean Edible Oil</span>
                        <span>42% (524.5 L)</span>
                      </div>
                      <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div class="h-full bg-orange-500 rounded-full" style="width: 42%"></div>
                      </div>
                    </div>
                    <!-- Mustard Oil -->
                    <div>
                      <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Kachi Ghani Mustard Oil</span>
                        <span>28% (349.6 L)</span>
                      </div>
                      <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div class="h-full bg-yellow-500 rounded-full" style="width: 28%"></div>
                      </div>
                    </div>
                    <!-- Soya Chunks -->
                    <div>
                      <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Fortune Soya Chunks</span>
                        <span>18% (224.8 L)</span>
                      </div>
                      <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" style="width: 18%"></div>
                      </div>
                    </div>
                    <!-- Besan & Others -->
                    <div>
                      <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Gram Besan & Others</span>
                        <span>12% (149.9 L)</span>
                      </div>
                      <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div class="h-full bg-sky-500 rounded-full" style="width: 12%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- STP (Straight Through Processing / Routing) VIEW -->
            @if (selectedNavTab() === 'stp') {
              <div class="pt-2 space-y-4 animate-fade-in">
                <div class="flex justify-between items-center mt-2">
                  <h2 class="text-lg font-extrabold text-slate-900 uppercase tracking-wide">STP Console</h2>
                  <span class="text-xs bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-full border border-indigo-100">STP Active</span>
                </div>

                <!-- Simulated Pipeline Progress -->
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                  <div class="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed font-medium">
                    Straight Through Processing (STP) automates booking allocations directly to plants. View pipeline queues below:
                  </div>

                  <div class="space-y-4">
                    <!-- Queue 1 -->
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0">
                      <div>
                        <h4 class="text-xs font-bold text-slate-800">Sauda #00014911 -> Plant Allocation</h4>
                        <span class="text-[9px] text-slate-400 font-medium">Allocated: Visakhapatnam Port Terminal</span>
                      </div>
                      <span class="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">Completed</span>
                    </div>

                    <!-- Queue 2 -->
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0">
                      <div>
                        <h4 class="text-xs font-bold text-slate-800">Sauda #00014912 -> Quality Release</h4>
                        <span class="text-[9px] text-slate-400 font-medium">Release Code: SP-SOYA-4912</span>
                      </div>
                      <span class="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">Completed</span>
                    </div>

                    <!-- Queue 3 -->
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0">
                      <div>
                        <h4 class="text-xs font-bold text-slate-800">Sauda #119 -> Credit Limit Lock</h4>
                        <span class="text-[9px] text-slate-400 font-medium">Enhancement check in progress</span>
                      </div>
                      <span class="bg-[#fab915]/10 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">Processing</span>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- MORE / UTILITIES TAB VIEW -->
            @if (selectedNavTab() === 'more') {
              <div class="pt-2 space-y-4 animate-fade-in">
                <div class="flex items-center justify-between mt-2 mb-3">
                  <h2 class="text-lg font-extrabold text-slate-900 uppercase tracking-wide">More Options</h2>
                  <span class="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">v2.4.6</span>
                </div>

                <!-- Quick list links of extra pages -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
                  
                  <!-- Link to Customer Ledger -->
                  <div (click)="navigateToPage('ledger')" class="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-orange-50 transition-colors cursor-pointer group">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-orange-100 text-[#f37a20] flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <span class="text-sm font-bold text-slate-800">Customer Ledger Screen</span>
                    </div>
                    <svg class="w-5 h-5 text-slate-400 group-hover:text-[#f37a20] transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>

                  <!-- Link to Updates Page -->
                  <div (click)="navigateToPage('updates')" class="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-orange-50 transition-colors cursor-pointer group">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.357.205a1.125 1.125 0 01-1.4-.205l-1.917-1.916m3.15-3.178c.09-.347.137-.708.137-1.08 0-.372-.047-.733-.137-1.08m0 2.16a24.718 24.718 0 014.29 4.29m-4.29-6.45c1.402-1.402 3.15-2.5 5.08-3.18a.375.375 0 01.442.176l.162.325a1.125 1.125 0 01-.153 1.256l-1.464 1.464" />
                        </svg>
                      </div>
                      <span class="text-sm font-bold text-slate-800">Interactive Product Updates</span>
                    </div>
                    <svg class="w-5 h-5 text-slate-400 group-hover:text-[#f37a20] transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>

                  <!-- Share App -->
                  <div (click)="showSystemNotice('App Sharer', 'Generating your personalized distributor invite code...')" class="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-orange-50 transition-colors cursor-pointer group">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l5.303-3.181m0 0a2.25 2.25 0 102.822-2.824m-2.822 4.13a2.25 2.25 0 11-2.83-2.503m4.733 5.41a2.25 2.25 0 111.453 3.472m-1.453-3.472l-5.303 3.181" />
                        </svg>
                      </div>
                      <span class="text-sm font-bold text-slate-800">Invite Sub-Dealers</span>
                    </div>
                    <svg class="w-5 h-5 text-slate-400 group-hover:text-[#f37a20] transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>

                  <!-- App Preferences -->
                  <div (click)="showSystemNotice('Preferences', 'Toggle app settings or dark themes in upcoming version!')" class="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-orange-50 transition-colors cursor-pointer group">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span class="text-sm font-bold text-slate-800">Portal Settings</span>
                    </div>
                    <svg class="w-5 h-5 text-slate-400 group-hover:text-[#f37a20] transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            }

          }

        </div>

        <!-- STICKY BOTTOM NAVIGATION BAR (Matches design language of screenshots) -->
        <div class="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex justify-around items-center px-2 py-1 shadow-lg z-50 shrink-0">
          
          <!-- Tab 1: Home -->
          <button 
            (click)="selectNavTab('home')"
            [class]="selectedNavTab() === 'home' && currentPage() === 'main' ? 'text-[#f37a20] scale-110' : 'text-slate-400 hover:text-slate-600'"
            class="flex flex-col items-center justify-center flex-1 transition-all"
          >
            <!-- Home Icon (Matches footer) -->
            <svg class="w-5 h-5 mb-0.5 stroke-current" fill="none" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span class="text-[9px] font-bold">Home</span>
          </button>

          <!-- Tab 2: Sauda -->
          <button 
            (click)="selectNavTab('sauda')"
            [class]="selectedNavTab() === 'sauda' && currentPage() === 'main' ? 'text-[#f37a20] scale-110' : 'text-slate-400 hover:text-slate-600'"
            class="flex flex-col items-center justify-center flex-1 transition-all"
          >
            <!-- Handshake Icon -->
            <svg class="w-5 h-5 mb-0.5 stroke-current" fill="none" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <span class="text-[9px] font-bold">Sauda</span>
          </button>

          <!-- Tab 3: Sales -->
          <button 
            (click)="selectNavTab('sales')"
            [class]="selectedNavTab() === 'sales' && currentPage() === 'main' ? 'text-[#f37a20] scale-110' : 'text-slate-400 hover:text-slate-600'"
            class="flex flex-col items-center justify-center flex-1 transition-all"
          >
            <!-- Rupee Growth / Trend Up -->
            <svg class="w-5 h-5 mb-0.5 stroke-current" fill="none" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.5 4.5L21.75 7.5M21.75 7.5V12m0-4.5H17.25" />
            </svg>
            <span class="text-[9px] font-bold">Sales</span>
          </button>

          <!-- Tab 4: STP -->
          <button 
            (click)="selectNavTab('stp')"
            [class]="selectedNavTab() === 'stp' && currentPage() === 'main' ? 'text-[#f37a20] scale-110' : 'text-slate-400 hover:text-slate-600'"
            class="flex flex-col items-center justify-center flex-1 transition-all"
          >
            <!-- Map Card Routing / STP -->
            <svg class="w-5 h-5 mb-0.5 stroke-current" fill="none" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.375m0-10.5h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6a2.25 2.25 0 012.25-2.25h5.25m4.5 0V3m0 2.25V18" />
            </svg>
            <span class="text-[9px] font-bold">STP</span>
          </button>

          <!-- Tab 5: More -->
          <button 
            (click)="selectNavTab('more')"
            [class]="selectedNavTab() === 'more' || currentPage() !== 'main' ? 'text-[#f37a20] scale-110' : 'text-slate-400 hover:text-slate-600'"
            class="flex flex-col items-center justify-center flex-1 transition-all"
          >
            <!-- Three dots Menu -->
            <svg class="w-5 h-5 mb-0.5 stroke-current" fill="none" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span class="text-[9px] font-bold">More</span>
          </button>

        </div>

      </div>

      <!-- CUSTOM INTERACTIVE MODALS -->
      @if (activeModal()) {
        <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div class="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 relative animate-scale-up">
            
            <!-- Modal Title Header -->
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#f37a20]">
                <!-- Custom Info Badge -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <h3 class="text-base font-black text-slate-900">{{ activeModal()?.title }}</h3>
            </div>

            <!-- Modal Content Area -->
            <div class="text-xs text-slate-600 leading-relaxed mb-6 space-y-3">
              <p>{{ activeModal()?.message }}</p>
              
              <!-- Ledger Specific Info inside Modal -->
              @if (activeModal()?.type === 'ledger_detail') {
                <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 mt-2">
                  <div class="flex justify-between">
                    <span class="font-bold text-slate-400">Owner Name:</span>
                    <span class="font-bold text-slate-800">Swati Gupta</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold text-slate-400">Total Outstanding:</span>
                    <span class="font-black text-red-600">Rs. {{ formatCurrency(activeModal()?.data?.outstanding) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold text-slate-400">Overdue Days:</span>
                    <span class="font-bold text-orange-600">45 Days</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold text-slate-400">Credit Limit Status:</span>
                    <span class="font-bold text-emerald-600">Healthy</span>
                  </div>
                </div>
              }

              <!-- Today's Rate Calculator specific info -->
              @if (activeModal()?.type === 'todays_rate_calc') {
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3 mt-2">
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulated Booking Quantity (MT)</label>
                    <input 
                      type="number" 
                      [(ngModel)]="simulatedQty" 
                      class="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 mt-1 focus:ring-1 focus:ring-[#f37a20] focus:outline-none"
                    />
                  </div>
                  <div class="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span class="font-bold text-slate-500">Calculated Value (INR):</span>
                    <span class="font-black text-[#f37a20]">₹ {{ formatCurrency(simulatedQty() * 11520) }}</span>
                  </div>
                </div>
              }

              <!-- Sauda Approval Creation Form -->
              @if (activeModal()?.type === 'sauda_approval_wizard') {
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3 mt-2">
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Distributor</label>
                    <select [(ngModel)]="newSaudaDist" class="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs mt-1">
                      <option value="Adithi Trading">Adithi Trading</option>
                      <option value="RAJ SALES">RAJ SALES</option>
                      <option value="AADINATH TRENDING COMPANY">AADINATH TRENDING COMPANY</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Segment</label>
                    <select [(ngModel)]="newSaudaProd" class="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs mt-1">
                      <option value="SOYA BEAN OIL (1 SKU)">SOYA BEAN OIL</option>
                      <option value="MUSTARD OIL (2 SKU)">MUSTARD OIL</option>
                      <option value="FORTUNE BESAN (1 SKU)">FORTUNE BESAN</option>
                    </select>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity (MT)</label>
                      <input type="number" [(ngModel)]="newSaudaQty" class="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs mt-1"/>
                    </div>
                    <div>
                      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking Date</label>
                      <input type="text" [(ngModel)]="newSaudaDate" placeholder="11-08-2022" class="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs mt-1"/>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Modal Action Buttons -->
            <div class="flex gap-3">
              @if (activeModal()?.type === 'sauda_approval_wizard') {
                <button 
                  (click)="submitNewSauda()" 
                  class="flex-1 py-2.5 bg-gradient-to-r from-[#f37a20] to-[#fab915] text-white rounded-xl text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  Confirm & Submit
                </button>
              }
              <button 
                (click)="closeModal()" 
                class="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 active:scale-95 transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .scrollbar-none::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-none {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .animate-spin-slow {
      animation: spin 16s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-scale-up {
      animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.92); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-pulse-slow {
      animation: pulseSlow 3s ease-in-out infinite;
    }
    @keyframes pulseSlow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.85; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
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
}