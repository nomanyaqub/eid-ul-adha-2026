async function init() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();

    renderHero(data.hero);
    renderPredefinedBundles(data.predefinedBundles);
    // If families list is empty, show not available message and hide search/browse
    if (!data.families || data.families.length === 0) {
      // Hide search and chips
      const searchField = document.getElementById("family-search");
      const chips = document.getElementById("quick-search-chips");
      const familiesList = document.getElementById("families-list");
      const infoContainer = document.getElementById("search-info-container");
      // Hide search icon in search field
      const searchIcon = document.querySelector(
        "#families .material-symbols-outlined.text-stone-400",
      );
      if (searchIcon) searchIcon.style.display = "none";
      if (searchField) searchField.style.display = "none";
      if (chips) chips.style.display = "none";
      if (familiesList) familiesList.style.display = "none";
      // Hide the instruction text
      const instructionText = document.querySelector(
        "#families .text-stone-600.mt-6.text-lg",
      );
      if (instructionText) instructionText.style.display = "none";
      if (infoContainer) {
        infoContainer.innerHTML = `<div class="text-center py-12 animate-in fade-in zoom-in duration-500">
          <div class="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-stone-300 text-4xl">search_off</span>
          </div>
          <h3 class="text-xl font-bold text-stone-800">Not available yet</h3>
          <p class="text-stone-500 mt-2">Will be available once bundles are published and assigned to the families.</p>
        </div>`;
      }
    } else {
      renderFamilies(
        data.families,
        data.predefinedBundles,
        data.supportingItems,
        data.essentialsBoxes,
      );
      renderQuickSearch(data.families);
    }
    renderMenu(data.menu);
    renderLogistics(data.logistics);
    renderVolunteers(data.volunteers);
    renderParking(data.parking, data.hero.location);
    renderFAQs(data.faqs);

    // Start Countdown
    // startCountdown(data.hero.calendar.start);

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const closeMenuBtn = document.getElementById("close-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    const toggleMenu = () => {
      mobileMenu.classList.toggle("translate-x-full");
      document.body.classList.toggle("overflow-hidden");
    };

    mobileMenuBtn.addEventListener("click", toggleMenu);
    closeMenuBtn.addEventListener("click", toggleMenu);
    mobileLinks.forEach((link) => link.addEventListener("click", toggleMenu));

    // Calendar functionality
    const calendarBtn = document.getElementById("calendar-btn");
    // Hide menu links if flags are false
    if (data.showBundlesSection === false) {
      document
        .querySelectorAll('a[href="#predefined-bundles"]')
        .forEach((el) => (el.style.display = "none"));
    }
    if (data.showFamiliesSection === false) {
      document
        .querySelectorAll('a[href="#families"]')
        .forEach((el) => (el.style.display = "none"));
    }

    // Hide or render Bundles section
    const bundlesSection = document.getElementById("predefined-bundles");
    if (bundlesSection && data.showBundlesSection === false) {
      bundlesSection.style.display = "none";
    } else if (data.showBundlesSection !== false) {
      renderPredefinedBundles(data.predefinedBundles);
    }

    // Hide or render Families section
    const familiesSection = document.getElementById("families");
    if (familiesSection && data.showFamiliesSection === false) {
      familiesSection.style.display = "none";
    } else if (data.showFamiliesSection !== false) {
      // If families list is empty, show not available message and hide search/browse
      if (!data.families || data.families.length === 0) {
        const searchField = document.getElementById("family-search");
        const chips = document.getElementById("quick-search-chips");
        const familiesList = document.getElementById("families-list");
        const infoContainer = document.getElementById("search-info-container");
        const searchIcon = document.querySelector(
          "#families .material-symbols-outlined.text-stone-400",
        );
        if (searchIcon) searchIcon.style.display = "none";
        if (searchField) searchField.style.display = "none";
        if (chips) chips.style.display = "none";
        if (familiesList) familiesList.style.display = "none";
        const instructionText = document.querySelector(
          "#families .text-stone-600.mt-6.text-lg",
        );
        if (instructionText) instructionText.style.display = "none";
        if (infoContainer) {
          infoContainer.innerHTML = `<div class="text-center py-12 animate-in fade-in zoom-in duration-500">
                  <div class="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-stone-300 text-4xl">search_off</span>
                  </div>
                  <h3 class="text-xl font-bold text-stone-800">Not available yet</h3>
                  <p class="text-stone-500 mt-2">Will be available once bundles are published and assigned to the families.</p>
                </div>`;
        }
      } else {
        renderFamilies(
          data.families,
          data.predefinedBundles,
          data.supportingItems,
          data.essentialsBoxes,
        );
        renderQuickSearch(data.families);
      }
    }
    const calendarMenu = document.getElementById("calendar-menu");
    const downloadIcsBtn = document.getElementById("download-ics");
    const openGCalBtn = document.getElementById("open-gcal");

    calendarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      calendarMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      calendarMenu.classList.add("hidden");
    });

    const formatGDate = (dateStr) => {
      return new Date(dateStr).toISOString().replace(/-|:|\.\d+/g, "");
    };

    downloadIcsBtn.addEventListener("click", () => {
      const { start, end, title, description, location } = data.hero.calendar;
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Modern Artisan//Eid BBQ//EN",
        "BEGIN:VEVENT",
        `DTSTART:${formatGDate(start)}`,
        `DTEND:${formatGDate(end)}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\n");

      const blob = new Blob([icsContent], {
        type: "text/calendar;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "eid-bbq-festival.ics");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    openGCalBtn.addEventListener("click", () => {
      const { start, end, title, description, location } = data.hero.calendar;
      const gCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGDate(start)}/${formatGDate(end)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
      window.open(gCalUrl, "_blank");
    });

    // Search functionality
    const familySearch = document.getElementById("family-search");
    const familiesList = document.getElementById("families-list");
    const bundlesPlaceholder = document.getElementById("bundles-placeholder");
    const infoContainer = document.getElementById("search-info-container");

    familySearch.addEventListener("input", (e) => {
      const search = e.target.value.toLowerCase();
      const families = document.querySelectorAll(".family-card");
      let visibleCount = 0;

      if (search.length === 0) {
        familiesList.classList.add("hidden");
        bundlesPlaceholder.classList.remove("hidden");
        infoContainer.innerHTML = "";
        return;
      }

      familiesList.classList.remove("hidden");
      bundlesPlaceholder.classList.add("hidden");

      families.forEach((card) => {
        const family = card.dataset.family.toLowerCase();
        if (family.includes(search)) {
          card.style.display = "block";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      // Update search info
      if (visibleCount > 0) {
        infoContainer.innerHTML = `
                    <div class="flex items-center justify-between mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <p class="text-stone-500 font-medium">
                            Found <span class="text-[#b71029] font-bold">${visibleCount}</span> matching ${visibleCount === 1 ? "family" : "families"}
                        </p>
                        <button id="clear-search" class="text-sm font-bold text-[#b71029] hover:underline flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">close</span>
                            Clear Search
                        </button>
                    </div>
                `;
        document
          .getElementById("clear-search")
          .addEventListener("click", () => {
            familySearch.value = "";
            familySearch.dispatchEvent(new Event("input"));
          });
      } else {
        infoContainer.innerHTML = `
                    <div class="text-center py-12 animate-in fade-in zoom-in duration-500">
                        <div class="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="material-symbols-outlined text-stone-300 text-4xl">search_off</span>
                        </div>
                        <h3 class="text-xl font-bold text-stone-800">No matching families found</h3>
                        <p class="text-stone-500 mt-2">We couldn't find anything for "<span class="text-[#b71029] font-semibold">${e.target.value}</span>"</p>
                        <button id="reset-search" class="mt-6 px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-bold hover:bg-stone-800 transition-colors">
                            View All Families
                        </button>
                    </div>
                `;
        document
          .getElementById("reset-search")
          .addEventListener("click", () => {
            document.getElementById("show-all-btn").click();
          });
      }
    });
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function renderHero(hero) {
  const container = document.getElementById("hero-content");
  container.innerHTML = `
        <div class="z-10 text-center lg:text-left">
            <span class="inline-block px-4 py-1 rounded-full bg-[#8cf5e4] text-[#005c53] text-xs md:text-sm font-bold mb-4 uppercase tracking-widest">
                ${hero.subtitle}
            </span>
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-[#b71029] font-headline leading-none mb-6">
                Eid Family <br />
                <span class="text-[#00675d]">BBQ</span>
            </h1>
            <div class="w-24 md:w-32 h-2 chamakpatti-border mb-8 mx-auto lg:mx-0"></div>
            
            <!-- Eid Day Banner -->
            <div class="inline-flex items-center gap-3 bg-gradient-to-r from-[#00675d] to-[#008f7a] text-white px-5 py-3 rounded-xl mb-8 shadow-lg shadow-[#00675d]/20 mx-auto lg:mx-0">
                <span class="material-symbols-outlined text-[#8cf5e4] text-2xl">celebration</span>
                <div>
                    <!-- <p class="text-[10px] uppercase font-bold tracking-widest text-[#8cf5e4]/80">First Day of Eid</p> -->
                    <p class="text-lg font-black tracking-wide">First Day of Eid</p>
                </div>
            </div>

            <!-- Countdown Timer -->
            <!--
            <div id="countdown" class="flex justify-center lg:justify-start gap-4 mb-10">
                <div class="flex flex-col items-center bg-white/50 backdrop-blur-sm border border-stone-200 rounded-2xl p-3 min-w-[70px] md:min-w-[80px] shadow-sm">
                    <span id="days" class="text-2xl md:text-3xl font-black text-[#b71029]">00</span>
                    <span class="text-[10px] uppercase font-bold tracking-widest text-stone-400">Days</span>
                </div>
                <div class="flex flex-col items-center bg-white/50 backdrop-blur-sm border border-stone-200 rounded-2xl p-3 min-w-[70px] md:min-w-[80px] shadow-sm">
                    <span id="hours" class="text-2xl md:text-3xl font-black text-[#b71029]">00</span>
                    <span class="text-[10px] uppercase font-bold tracking-widest text-stone-400">Hours</span>
                </div>
                <div class="flex flex-col items-center bg-white/50 backdrop-blur-sm border border-stone-200 rounded-2xl p-3 min-w-[70px] md:min-w-[80px] shadow-sm">
                    <span id="minutes" class="text-2xl md:text-3xl font-black text-[#b71029]">00</span>
                    <span class="text-[10px] uppercase font-bold tracking-widest text-stone-400">Minutes</span>
                </div>
            </div>
            -->

            <p class="text-base md:text-xl text-stone-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                ${hero.description}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10 text-left">
                <div class="flex items-center gap-4 p-4 rounded-xl bg-[#f2f1ec] border border-stone-200">
                    <span class="material-symbols-outlined text-[#b71029] text-2xl md:text-3xl">calendar_today</span>
                    <div>
                        <p class="text-[10px] md:text-xs uppercase font-bold tracking-widest text-stone-400">Date & Time</p>
                        <p class="font-bold text-sm md:text-base">${hero.date}</p>
                    </div>
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hero.location)}" target="_blank" class="flex items-center gap-4 p-4 rounded-xl bg-[#f2f1ec] border border-stone-200 group cursor-pointer hover:bg-[#8cf5e4] transition-colors no-underline">
                    <span class="material-symbols-outlined text-[#b71029] text-2xl md:text-3xl group-hover:text-[#00675d]">location_on</span>
                    <div>
                        <p class="text-[10px] md:text-xs uppercase font-bold tracking-widest text-stone-400">Location</p>
                        <p class="font-bold text-sm md:text-base text-stone-900">${hero.location}</p>
                    </div>
                </a>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
                <a href="#families" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#b71029] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#b71029]/20 hover:scale-105 transition-transform no-underline">
                    <span>Find Your Bundle</span>
                    <span class="material-symbols-outlined">inventory_2</span>
                </a>
                
                <div class="relative inline-block w-full sm:w-auto">
                    <button id="calendar-btn" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00675d] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#00675d]/20 hover:scale-105 transition-transform">
                        <span>Add to Calendar</span>
                        <span class="material-symbols-outlined">calendar_add_on</span>
                    </button>
                    <div id="calendar-menu" class="hidden absolute left-0 bottom-full sm:bottom-auto sm:top-full mt-2 mb-2 sm:mb-0 w-full sm:w-56 bg-white rounded-xl shadow-2xl border border-stone-100 z-50 overflow-hidden">
                        <button id="download-ics" class="w-full text-left px-4 py-4 text-sm hover:bg-stone-50 flex items-center gap-3 transition-colors">
                            <span class="material-symbols-outlined text-[#8a4b11]">download</span>
                            <span class="font-bold text-stone-700">Apple / Outlook (.ics)</span>
                        </button>
                        <button id="open-gcal" class="w-full text-left px-4 py-4 text-sm hover:bg-stone-50 border-t border-stone-50 flex items-center gap-3 transition-colors">
                            <span class="material-symbols-outlined text-[#00675d]">event</span>
                            <span class="font-bold text-stone-700">Google Calendar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Desktop Image (Visible only on large screens) -->
        <div class="hidden lg:block relative">
            <div class="absolute -top-12 -right-12 w-64 h-64 bg-[#8cf5e4]/30 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-[#ff7576]/30 rounded-full blur-3xl"></div>
            <div class="relative rounded-2xl overflow-hidden border-8 border-white shadow-2xl rotate-2">
                <img class="w-full aspect-[4/5] object-cover" src="${hero.image}" alt="Festival BBQ" referrerPolicy="no-referrer">
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div class="absolute -top-8 -left-8 w-24 h-24 bg-[#ffab69] rounded-full flex items-center justify-center border-4 border-white shadow-xl -rotate-12 z-20">
                <span class="material-symbols-outlined text-4xl text-[#5d2e00]">eco</span>
            </div>
        </div>
    `;
}

function renderQuickSearch(families) {
  const container = document.getElementById("quick-search-chips");
  // Get a few unique family names for chips
  const sampleFamilies = families
    .slice(0, 4)
    .map((f) => f.familyName.split(" ")[0]);

  container.innerHTML = `
        ${sampleFamilies
          .map(
            (name) => `
            <button class="quick-chip px-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-medium text-stone-600 hover:border-[#b71029] hover:text-[#b71029] transition-all shadow-sm">
                ${name}
            </button>
        `,
          )
          .join("")}
        <button id="show-all-btn" class="px-4 py-2 bg-stone-900 text-white rounded-full text-sm font-bold hover:bg-stone-800 transition-all shadow-md">
            Browse All
        </button>
    `;

  document.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const searchInput = document.getElementById("family-search");
      searchInput.value = chip.innerText.trim();
      searchInput.dispatchEvent(new Event("input"));
    });
  });

  document.getElementById("show-all-btn").addEventListener("click", () => {
    const searchInput = document.getElementById("family-search");
    const familiesList = document.getElementById("families-list");
    const bundlesPlaceholder = document.getElementById("bundles-placeholder");
    const families = document.querySelectorAll(".family-card");

    searchInput.value = "";
    bundlesPlaceholder.classList.add("hidden");
    familiesList.classList.remove("hidden");
    families.forEach((card) => (card.style.display = "block"));

    const infoContainer = document.getElementById("search-info-container");
    infoContainer.innerHTML = `
            <div class="flex items-center justify-between mb-6">
                <p class="text-stone-500 font-medium italic">Showing all families</p>
                <button id="clear-all" class="text-sm font-bold text-[#b71029] hover:underline flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">close</span>
                    Hide All
                </button>
            </div>
        `;
    document.getElementById("clear-all").addEventListener("click", () => {
      searchInput.dispatchEvent(new Event("input"));
    });
  });
}

function renderPredefinedBundles(bundles) {
  const container = document.getElementById("predefined-bundles-content");
  container.innerHTML = bundles
    .map(
      (bundle) => `
        <div class="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 hover:border-[#b71029]/20 transition-all group">
            <div class="w-12 h-12 rounded-2xl bg-[#b71029]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-[#b71029]">inventory_2</span>
            </div>
            <h3 class="text-2xl font-black font-headline text-stone-900 mb-4">${bundle.bundleName}</h3>
            <div class="space-y-3">
                ${bundle.items
                  .map(
                    (item) => `
                    <div class="flex items-center justify-between text-stone-600">
                        <span class="font-medium">${item.name}</span>
                        <span class="font-bold text-[#00675d]">x${item.qty}</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `,
    )
    .join("");
}

function renderFamilies(families, bundles, supportingItems, essentialsBoxes) {
  const container = document.getElementById("families-list");
  container.innerHTML = families
    .map((family) => {
      const bundle = bundles.find((b) => b.id === family.bundleId);
      const familySupportingItems = family.supportingItemIds.map((id) =>
        supportingItems.find((si) => si.id === id),
      );
      const familyEssentials = (family.essentialsBoxIds || []).map((id) => ({
        id,
        items: essentialsBoxes[id] || [],
      }));
      const familyId = `family-${family.familyName.replace(/\s+/g, "-").toLowerCase()}`;

      return `
            <div id="${familyId}" class="family-card bg-white rounded-3xl shadow-md shadow-black/5 overflow-hidden transition-all border border-transparent hover:border-[#b71029]/10 p-8" data-family="${family.familyName}">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-6">
                        <div class="w-16 h-16 rounded-2xl flex items-center justify-center border-b-4 ${getColorClass(family.familyName.toLowerCase(), "bg-border")}">
                            <span class="material-symbols-outlined text-3xl ${getColorClass(family.familyName.toLowerCase(), "text")}">${family.type}</span>
                        </div>
                        <div>
                            <h3 class="text-2xl font-black font-headline text-stone-900">${family.familyName}</h3>
                            <p class="text-[#8a4b11] font-bold">${bundle ? bundle.bundleName : "No Bundle Selected"}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <button onclick="printFamilyCard('${familyId}')" class="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-[#b71029] hover:text-white transition-all shadow-sm" title="Print or Save as PDF">
                            <span class="material-symbols-outlined text-xl">print</span>
                        </button>
                        <div class="text-xs uppercase tracking-widest text-stone-400 text-right hidden sm:block">
                            <p class="font-bold">Last Updated</p>
                            <p>${family.lastUpdated}</p>
                        </div>
                    </div>
                </div>
                
                <div class="h-px w-full bg-stone-100 mb-6"></div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 class="text-sm uppercase tracking-widest font-bold text-stone-400 mb-4">Bundle Items</h4>
                        <div class="grid grid-cols-1 gap-3">
                            ${
                              bundle
                                ? bundle.items
                                    .map(
                                      (item) => `
                                <div class="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                                    <span class="font-medium">${item.name}</span>
                                    <span class="font-bold text-[#00675d]">x${item.qty}</span>
                                </div>
                            `,
                                    )
                                    .join("")
                                : "<p>No items</p>"
                            }
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-sm uppercase tracking-widest font-bold text-stone-400 mb-4">Supporting Items (Bringing)</h4>
                        <div class="flex flex-wrap gap-2">
                            ${familySupportingItems
                              .map(
                                (item) => `
                                <span class="px-4 py-2 bg-[#8cf5e4]/20 text-[#00675d] rounded-full text-sm font-bold border border-[#8cf5e4]/30">
                                    ${item ? item.name : "Unknown Item"}
                                </span>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                </div>

                ${
                  familyEssentials.length > 0
                    ? `
                    <div class="pt-6 border-t border-stone-100">
                        <h4 class="text-sm uppercase tracking-widest font-bold text-stone-400 mb-4">Assigned Essentials</h4>
                        <div class="space-y-4">
                            ${familyEssentials
                              .map(
                                (box) => `
                                <div class="rounded-2xl border-2 border-dashed border-[#ffab69]/30 bg-[#ffab69]/5 overflow-hidden">
                                    <div class="px-4 py-2 bg-[#ffab69]/10 border-b border-[#ffab69]/20 flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <span class="material-symbols-outlined text-[#8a4b11] text-lg">inventory_2</span>
                                            <span class="text-xs font-black uppercase tracking-widest text-[#8a4b11]">${box.id} Kit</span>
                                        </div>
                                        <span class="text-[10px] font-bold text-[#8a4b11]/60 uppercase tracking-tighter">Checklist</span>
                                    </div>
                                    <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                        ${box.items
                                          .map(
                                            (item) => `
                                            <div class="flex items-center gap-3 group/item">
                                                <span class="material-symbols-outlined text-[#8a4b11] text-xl flex-shrink-0 print:hidden">check_circle</span>
                                                <div class="w-5 h-5 border-2 border-stone-400 rounded flex-shrink-0 hidden print:block"></div>
                                                <div class="flex items-baseline gap-2 overflow-hidden">
                                                    <span class="text-sm font-bold text-stone-700 truncate">${item.name}</span>
                                                    ${item.quantity ? `<span class="text-[10px] font-black text-[#00675d] uppercase tracking-widest whitespace-nowrap">(${item.quantity})</span>` : ""}
                                                </div>
                                            </div>
                                        `,
                                          )
                                          .join("")}
                                    </div>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        `;
    })
    .join("");
}

window.printFamilyCard = function (cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  const printWindow = window.open("", "_blank");
  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("");
      } catch (e) {
        return "";
      }
    })
    .join("");

  printWindow.document.write(`
        <html>
            <head>
                <title>Print Family Assignment</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                <style>
                    ${styles}
                    body { padding: 40px; background: white !important; }
                    .family-card { border: 1px solid #eee !important; box-shadow: none !important; }
                    button { display: none !important; }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="max-w-2xl mx-auto">
                    ${card.outerHTML}
                </div>
                <script>
                    window.onload = () => {
                        window.print();
                        window.close();
                    };
                </script>
            </body>
        </html>
    `);
  printWindow.document.close();
};

function renderMenu(menu) {
  const container = document.getElementById("menu-content");
  container.innerHTML = menu
    .map(
      (section) => `
        <div class="space-y-8 flex flex-col">
            <div class="relative mb-6">
                <img class="w-full h-48 object-cover rounded-2xl shadow-lg border-2 ${getBorderColor(section.color)}" src="${section.image}" alt="${section.category}" referrerPolicy="no-referrer">
            </div>
            <h3 class="text-2xl font-black font-headline flex items-center gap-3 ${getTextColor(section.color)}">
                ${section.id}. ${section.category}
                <div class="flex-grow h-1 chamakpatti-border opacity-40"></div>
            </h3>
            <div class="space-y-6">
                ${section.items
                  .map(
                    (item) => `
                    <div class="flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${getHoverBgColor(section.color)} group cursor-default">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${getBgColor(section.color)}">
                            <span class="material-symbols-outlined text-xl">${item.icon}</span>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold mb-1">${item.name}</h4>
                            <p class="text-sm text-stone-500 leading-relaxed">${item.description}</p>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `,
    )
    .join("");
}

function renderLogistics(logistics) {
  const container = document.getElementById("logistics-content");
  container.innerHTML = `
        <div class="bg-white p-8 md:p-12 rounded-3xl shadow-sm relative overflow-hidden border border-stone-200 w-full">
            <div class="absolute top-0 right-0 p-8">
                <span class="material-symbols-outlined text-9xl text-stone-100">inventory</span>
            </div>
            <div class="relative z-10">
                <h2 class="text-4xl font-black font-headline mb-12 flex items-center gap-4">
                    <span class="material-symbols-outlined text-[#b71029] text-5xl">outdoor_grill</span>
                    Grill & Logistics
                </h2>
                
                <div class="grid lg:grid-cols-2 gap-12 mb-12">
                    <!-- Timeline (Left) -->
                    <div class="space-y-8">
                        <h3 class="text-2xl font-black font-headline text-[#b71029] mb-6 flex items-center gap-3">
                            <span class="material-symbols-outlined">schedule</span>
                            The Plan
                        </h3>
                        <div class="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                            ${logistics.timeline
                              .map(
                                (item) => `
                                <div class="relative">
                                    <div class="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-[#b71029] border-4 border-white shadow-sm z-10"></div>
                                    <div class="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                                        <span class="text-sm font-black text-[#b71029] uppercase tracking-widest whitespace-nowrap">${item.time}</span>
                                        <h4 class="text-xl font-bold text-stone-900">${item.event}</h4>
                                    </div>
                                    <p class="text-stone-500 mt-1 leading-relaxed">${item.details}</p>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>

                    <!-- Equipment & Details (Right) -->
                    <div class="space-y-6">
                        <div class="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                            <h4 class="text-xl font-bold text-[#b71029] mb-4 flex items-center gap-3">
                                <span class="material-symbols-outlined">oven_gen</span>
                                On-Site Equipment
                            </h4>
                            <p class="text-stone-600 leading-relaxed">${logistics.equipment}</p>
                        </div>
                        
                        ${logistics.additionalDetails
                          .map((detail) => {
                            const icon = detail.title
                              .toLowerCase()
                              .includes("safety")
                              ? "medical_services"
                              : "recycling";
                            return `
                                <div class="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                                    <h4 class="text-xl font-bold text-[#b71029] mb-4 flex items-center gap-3">
                                        <span class="material-symbols-outlined">${icon}</span>
                                        ${detail.title}
                                    </h4>
                                    <p class="text-stone-600 leading-relaxed">${detail.desc}</p>
                                </div>
                            `;
                          })
                          .join("")}
                    </div>
                </div>

                <!-- Pro Tip (Full Width Bottom) -->
                <div class="p-8 bg-[#8cf5e4]/20 rounded-2xl border-2 border-dashed border-[#8cf5e4]/30 relative overflow-hidden group">
                    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <span class="material-symbols-outlined text-9xl text-[#00675d]">lightbulb</span>
                    </div>
                    <div class="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div class="w-16 h-16 rounded-full bg-[#8cf5e4] flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span class="material-symbols-outlined text-[#00675d] text-3xl">tips_and_updates</span>
                        </div>
                        <div>
                            <h5 class="font-black text-[#00675d] mb-1 uppercase tracking-widest text-sm">Community Pro Tip</h5>
                            <p class="text-[#005c53] text-lg font-medium leading-relaxed italic">"${logistics.proTip}"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderVolunteers(volunteers) {
  const container = document.getElementById("volunteer-content");
  container.innerHTML = volunteers
    .map(
      (team) => `
        <div class="flex flex-col">
            <h3 class="text-xl font-black font-headline flex items-center gap-3 mb-2 ${getTextColor(team.color)}">
                ${team.id}. ${team.team}
                <div class="flex-grow h-1 chamakpatti-border opacity-40"></div>
            </h3>
            <p class="text-stone-500 mb-4 italic">${team.expectation || ""}</p>
            <div class="space-y-2">
                ${team.members
                  .map(
                    (member) => `
                    <div class="px-4 py-2 rounded-xl transition-all duration-300 hover:translate-x-1 ${getHoverBgColor(team.color)} cursor-default">
                        <span class="font-bold text-stone-700">${member}</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `,
    )
    .join("");
}

function renderParking(parking, location) {
  const container = document.getElementById("parking-content");
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  container.innerHTML = `
        <div class="grid lg:grid-cols-2 gap-16 items-center">
            <div class="relative order-2 lg:order-1">
                <div class="relative rounded-[2.5rem] overflow-hidden border-[12px] border-white/5 shadow-2xl bg-stone-800">
                    <iframe 
                        src="${mapUrl}" 
                        class="w-full aspect-[1.2/1] border-0 opacity-80 grayscale invert contrast-125" 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                    <!-- <div class="absolute top-6 left-6 bg-[#b71029] text-white text-xs font-black px-4 py-2 uppercase tracking-widest rounded-sm shadow-lg">
                        EVENT LOCATION
                    </div>
                    -->
                </div>
                <div class="absolute -inset-10 bg-[#b71029]/20 blur-[100px] rounded-full -z-10 opacity-30"></div>
            </div>
            <div class="space-y-12 order-1 lg:order-2">
                <header>
                    <h2 class="font-headline font-black text-6xl md:text-7xl uppercase leading-none mb-4 tracking-tighter">
                        ARRIVAL & <br />
                        <span class="text-[#ffab69]">PARKING</span>
                    </h2>
                    <div class="w-24 h-2 bg-[#b71029]"></div>
                </header>
                <div class="space-y-10">
                    <div class="flex gap-6 items-start group">
                        <div class="w-16 h-16 flex-shrink-0 bg-[#3F51B5] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span class="font-black text-2xl">P</span>
                        </div>
                        <div class="space-y-2">
                            <h4 class="font-headline font-bold text-2xl uppercase tracking-tight text-white">Main Lot</h4>
                            <p class="text-white/60 text-lg leading-relaxed max-w-md">${parking.mainLot}</p>
                        </div>
                    </div>
                    <div class="flex gap-6 items-start group">
                        <div class="w-16 h-16 flex-shrink-0 bg-[#b71029] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span class="material-symbols-outlined text-3xl">directions_walk</span>
                        </div>
                        <div class="space-y-2">
                            <h4 class="font-headline font-bold text-2xl uppercase tracking-tight text-white">Walking Path</h4>
                            <p class="text-white/60 text-lg leading-relaxed max-w-md">${parking.walkingPath}</p>
                        </div>
                    </div>
                </div>
                <div class="pt-4">
                    <a href="${directionsUrl}" target="_blank" class="inline-flex items-center gap-4 bg-white text-[#121212] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#ffab69] transition-all duration-300 transform hover:-translate-y-1 shadow-xl group no-underline">
                        <span class="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">map</span>
                        OPEN IN GOOGLE MAPS
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Helper functions for dynamic classes
function getColorClass(name, type) {
  if (name.includes("ahmed"))
    return type === "bg-border"
      ? "bg-[#b71029]/5 border-[#b71029]"
      : "text-[#b71029]";
  if (name.includes("khan"))
    return type === "bg-border"
      ? "bg-[#00675d]/5 border-[#00675d]"
      : "text-[#00675d]";
  return type === "bg-border"
    ? "bg-[#8a4b11]/5 border-[#8a4b11]"
    : "text-[#8a4b11]";
}

function getBorderColor(color) {
  if (color === "primary") return "border-[#b71029]";
  if (color === "secondary") return "border-[#00675d]";
  return "border-[#8a4b11]";
}

function getTextColor(color) {
  if (color === "primary") return "text-[#b71029]";
  if (color === "secondary") return "text-[#00675d]";
  return "text-[#8a4b11]";
}

function getBgColor(color) {
  if (color === "primary") return "bg-[#b71029]/10 text-[#b71029]";
  if (color === "secondary") return "bg-[#00675d]/10 text-[#00675d]";
  return "bg-[#8a4b11]/10 text-[#8a4b11]";
}

function getHoverBgColor(color) {
  if (color === "primary") return "hover:bg-[#b71029]/5";
  if (color === "secondary") return "hover:bg-[#00675d]/5";
  return "hover:bg-[#8a4b11]/5";
}

function renderFAQs(faqs) {
  const container = document.getElementById("faq-list");
  container.innerHTML = faqs
    .map(
      (faq) => `
        <details class="group bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden transition-all hover:shadow-md">
            <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 class="text-lg font-bold text-stone-800 pr-8">${faq.question}</h3>
                <span class="material-symbols-outlined text-[#b71029] group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div class="px-6 pb-6 text-stone-600 leading-relaxed border-t border-stone-50 pt-4">
                ${faq.answer}
            </div>
        </details>
    `,
    )
    .join("");
}

function startCountdown(targetDate) {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");

  const update = () => {
    const now = new Date().getTime();
    const distance = new Date(targetDate).getTime() - now;

    if (distance < 0) {
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minutesEl.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    daysEl.innerText = days.toString().padStart(2, "0");
    hoursEl.innerText = hours.toString().padStart(2, "0");
    minutesEl.innerText = minutes.toString().padStart(2, "0");
  };

  update();
  setInterval(update, 60000); // Update every minute
}

init();
