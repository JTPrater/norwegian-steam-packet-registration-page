// Passenger List JavaScript - Norwegian Steam Packet Company

class PassengerList {
  constructor() {
    this.passengers = [];
    this.filteredPassengers = [];
    this.init();
  }
  init() {
    // Wait for Firebase to be available, then load passengers
    this.waitForFirebase();
    this.setupEventListeners();
  }

  // Wait for Firebase to be available
  waitForFirebase() {
    if (window.FirebaseService) {
      this.loadPassengers();
    } else {
      // Check again in 100ms
      setTimeout(() => this.waitForFirebase(), 100);
    }
  }

  // Load passengers from Firebase
  loadPassengers() {
    try {
      if (!window.FirebaseService) {
        console.error("Firebase service not available");
        return;
      }

      // Set up real-time listener for passengers
      window.FirebaseService.onPassengersChange((passengers) => {
        this.passengers = passengers;
        this.filteredPassengers = [...this.passengers];
        this.displayPassengers();
      });
    } catch (error) {
      console.error("Error loading passengers:", error);
      this.passengers = [];
      this.filteredPassengers = [];
      this.displayPassengers();
    }
  }

  // Setup event listeners
  setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const genderFilter = document.getElementById("genderFilter");
    const clearFiltersBtn = document.getElementById("clearFilters");

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener("input", () => this.handleSearch());
    }
    if (searchBtn) {
      searchBtn.addEventListener("click", () => this.handleSearch());
    }

    // Filter functionality
    if (genderFilter) {
      genderFilter.addEventListener("change", () => this.handleFilter());
    }

    // Clear filters
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => this.clearFilters());
    } // Refresh button (Firebase updates automatically, but keep for manual refresh)
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        // Firebase automatically updates, but this can force a re-render
        this.handleSearch();
      });
    }
  }

  // Handle search functionality
  handleSearch() {
    const searchInput = document.getElementById("searchInput");
    const genderFilter = document.getElementById("genderFilter");

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const genderFilterValue = genderFilter ? genderFilter.value : "";

    this.filteredPassengers = this.passengers.filter((passenger) => {
      const nameMatch =
        passenger.forename.toLowerCase().includes(searchTerm) ||
        passenger.surname.toLowerCase().includes(searchTerm) ||
        (passenger.title && passenger.title.toLowerCase().includes(searchTerm));

      const genderMatch =
        !genderFilterValue || passenger.gender === genderFilterValue;

      return nameMatch && genderMatch;
    });

    this.displayPassengers();
  }

  // Handle filter functionality
  handleFilter() {
    this.handleSearch(); // Reuse search logic which includes filters
  }

  // Clear all filters
  clearFilters() {
    const searchInput = document.getElementById("searchInput");
    const genderFilter = document.getElementById("genderFilter");

    if (searchInput) searchInput.value = "";
    if (genderFilter) genderFilter.value = "";

    this.filteredPassengers = [...this.passengers];
    this.displayPassengers();
  }
  // Display passengers in the table
  displayPassengers() {
    const tableBody = document.getElementById("passengerTableBody");
    const passengerCount = document.getElementById("passengerCount");
    const noPassengersDiv = document.getElementById("noPassengers");
    const tableContainer = document.querySelector(".passenger-table-container");

    // Update passenger count
    if (passengerCount) {
      passengerCount.textContent = this.filteredPassengers.length;
    }

    // Clear existing table content
    if (tableBody) {
      tableBody.innerHTML = "";
    }

    if (this.filteredPassengers.length === 0) {
      if (tableContainer) tableContainer.style.display = "none";
      if (noPassengersDiv) noPassengersDiv.style.display = "block";
      return;
    }

    if (tableContainer) tableContainer.style.display = "block";
    if (noPassengersDiv) noPassengersDiv.style.display = "none";

    // Sort passengers by registration date (newest first)
    const sortedPassengers = this.filteredPassengers.sort(
      (a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)
    );

    // Create table rows
    sortedPassengers.forEach((passenger) => {
      const row = this.createPassengerRow(passenger);
      if (tableBody) {
        tableBody.appendChild(row);
      }
    });
  }

  // Create a table row for a passenger
  createPassengerRow(passenger) {
    const row = document.createElement("tr");

    // Avatar cell
    const avatarCell = document.createElement("td");
    avatarCell.className = "avatar-cell";
    const avatarImg = document.createElement("img");
    avatarImg.src = passenger.avatar || "/standard_male.png";
    avatarImg.alt = "Passenger Avatar";
    avatarImg.className = "avatar-img";
    avatarCell.appendChild(avatarImg);

    // Title cell
    const titleCell = document.createElement("td");
    titleCell.textContent = passenger.title || "-";

    // Name cell
    const nameCell = document.createElement("td");
    nameCell.textContent = `${passenger.forename} ${passenger.surname}`;

    // Gender cell
    const genderCell = document.createElement("td");
    genderCell.textContent = passenger.gender.toUpperCase();

    // Date of birth cell
    const dobCell = document.createElement("td");
    dobCell.textContent = `${passenger.dob_month}/${passenger.dob_day}/${passenger.dob_year}`;

    // Luggage cell
    const luggageCell = document.createElement("td");
    luggageCell.className = "luggage-list";
    const luggageItems = [
      passenger.luggage1,
      passenger.luggage2,
      passenger.luggage3,
      passenger.luggage4,
      passenger.luggage5,
    ].filter((item) => item && item.trim() !== "");

    if (luggageItems.length > 0) {
      luggageItems.forEach((item) => {
        const span = document.createElement("span");
        span.className = "luggage-item";
        span.textContent = item;
        luggageCell.appendChild(span);
      });
    } else {
      luggageCell.textContent = "No luggage";
    }

    // Registration date cell
    const regDateCell = document.createElement("td");
    const regDate = new Date(passenger.registrationDate);
    regDateCell.textContent = regDate.toLocaleDateString();

    // Append all cells to row
    row.appendChild(avatarCell);
    row.appendChild(titleCell);
    row.appendChild(nameCell);
    row.appendChild(genderCell);
    row.appendChild(dobCell);
    row.appendChild(luggageCell);
    row.appendChild(regDateCell);

    return row;
  }

  // Method to delete a passenger (for admin use)
  async deletePassenger(passengerId) {
    try {
      const response = await fetch(`/api/passengers/${passengerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Reload the passenger list
        await this.loadPassengers();
      } else {
        console.error("Failed to delete passenger");
      }
    } catch (error) {
      console.error("Error deleting passenger:", error);
    }
  }
}

// Initialize the passenger list when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new PassengerList();
});
