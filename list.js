// Passenger List JavaScript - Norwegian Steam Packet Company

// Secure hash function for IP validation
async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

class PassengerList {
  constructor() {
    this.passengers = [];
    this.filteredPassengers = [];
    this.isAdmin = false;
    this.adminIP = ""; // Will be set to your IP
    this.init();
  }

  init() {
    // Check admin status first
    this.checkAdminStatus();
    // Wait for Firebase to be available, then load passengers
    this.waitForFirebase();
    this.setupEventListeners();
  } // Check if current user is admin based on IP
  async checkAdminStatus() {
    try {
      // Hash-based admin verification (secure)
      const allowedAdminHashes = [
        "e4c570bef2b98009bd67ee6a3dd95e3d0b8ba251e7510d84f6dbf25421f65d3d", // Your IP hash
        "12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0", // localhost hash
        "eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3", // IPv6 localhost hash
      ];

      // Check if we're running locally first
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "::1";

      if (isLocalhost) {
        console.log("🏠 Running on localhost - Admin access granted");
        this.isAdmin = true;
        this.activateAdminMode();
        return;
      }

      // If not localhost, check public IP
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const userIP = data.ip; // Hash the IP for secure comparison
      const ipHash = await hashString(userIP);
      console.log("🔐 IP verification complete");

      // Check if user IP hash is in admin list
      this.isAdmin = allowedAdminHashes.includes(ipHash);

      if (this.isAdmin) {
        console.log("🔑 Admin access granted based on IP");
        this.activateAdminMode();
      } else {
        console.log("👤 Regular user access");
      }
    } catch (error) {
      console.error("Could not verify IP:", error);
      this.isAdmin = false;
    }
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
      } // Set up real-time listener for passengers
      window.FirebaseService.onPassengersChange((passengers) => {
        console.log(
          "🔍 Debug - Received passengers from Firebase:",
          passengers
        );
        console.log("🔍 Debug - Number of passengers:", passengers.length);
        if (passengers.length > 0) {
          console.log("🔍 Debug - First passenger structure:", passengers[0]);
        }

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
    }

    // Refresh button
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.handleSearch();
      });    }
  }

  // Activate admin mode
  activateAdminMode() {
    document.body.classList.add("admin-mode");
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) {
      adminPanel.style.display = "block";
    }

    // Re-render passengers to show delete buttons
    this.displayPassengers();

    console.log("Admin mode activated");
  }

  // Exit admin mode
  exitAdminMode() {
    document.body.classList.remove("admin-mode");
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) {
      adminPanel.style.display = "none";
    }

    // Re-render passengers to hide delete buttons
    this.displayPassengers();

    console.log("Admin mode deactivated");
  }

  // Check if admin mode is active
  isAdminMode() {
    return document.body.classList.contains("admin-mode");
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
    } // Registration date cell
    const regDateCell = document.createElement("td");
    const regDate = new Date(passenger.registrationDate);
    regDateCell.textContent = regDate.toLocaleDateString();

    // Actions cell (admin only)
    const actionsCell = document.createElement("td");
    actionsCell.className = "actions-cell admin-only";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "🗑️ Delete";
    deleteBtn.title = "Delete this passenger";
    deleteBtn.onclick = () => this.confirmDeletePassenger(passenger);

    actionsCell.appendChild(deleteBtn);

    // Append all cells to row
    row.appendChild(avatarCell);
    row.appendChild(titleCell);
    row.appendChild(nameCell);
    row.appendChild(genderCell);
    row.appendChild(dobCell);
    row.appendChild(luggageCell);
    row.appendChild(regDateCell);
    row.appendChild(actionsCell);

    return row;
  }

  // Confirm passenger deletion with dialog (admin only)
  confirmDeletePassenger(passenger) {
    if (!this.isAdminMode()) {
      console.error("Delete attempted without admin privileges");
      return;
    }

    const passengerName = `${passenger.forename} ${passenger.surname}`;
    const confirmed = confirm(
      `⚠️ ADMIN ACTION ⚠️\n\nAre you sure you want to delete passenger "${passengerName}"?\n\nThis action cannot be undone and will permanently remove this passenger from the manifest.`
    );

    if (confirmed) {
      this.deletePassenger(passenger);
    }
  } // Delete a passenger (admin only)
  async deletePassenger(passenger) {
    if (!this.isAdminMode()) {
      console.error("Delete attempted without admin privileges");
      alert("Access denied. Admin privileges required.");
      return;
    }

    // Debug logging
    console.log("🔍 Debug - Attempting to delete passenger:", passenger);
    console.log("🔍 Debug - Passenger firebaseKey:", passenger.firebaseKey);
    console.log("🔍 Debug - Passenger ID:", passenger.id);

    // Validation checks
    if (!passenger) {
      console.error("❌ No passenger object provided");
      alert("Error: No passenger data provided.");
      return;
    }

    if (!passenger.firebaseKey && !passenger.id) {
      console.error("❌ Passenger has no firebaseKey or ID");
      alert("Error: Cannot delete passenger - missing identifier.");
      return;
    }

    try {
      let result;

      // Try to delete using Firebase key first (more efficient)
      if (passenger.firebaseKey && passenger.firebaseKey.trim() !== "") {
        console.log(
          "🔍 Debug - Using firebaseKey for deletion:",
          passenger.firebaseKey
        );
        result = await window.FirebaseService.removePassenger(
          passenger.firebaseKey
        );
      } else if (passenger.id && passenger.id.trim() !== "") {
        console.log(
          "🔍 Debug - Using ID for deletion (fallback):",
          passenger.id
        );
        // Fallback to ID-based deletion
        result = await window.FirebaseService.removePassengerById(passenger.id);
      } else {
        console.error("❌ Invalid firebaseKey and ID");
        alert("Error: Cannot delete passenger - invalid identifier.");
        return;
      }

      console.log("🔍 Debug - Delete result:", result);

      if (result && result.success) {
        console.log("✅ Passenger deleted successfully by admin");
        const passengerName = `${passenger.forename} ${passenger.surname}`;
        console.log(`✅ Deleted: ${passengerName}`);
        // The real-time listener will automatically update the display
      } else {
        console.error(
          "❌ Failed to delete passenger:",
          result?.error || "Unknown error"
        );
        alert(
          `Failed to delete passenger: ${result?.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("💥 Error deleting passenger:", error);
      alert(`An error occurred while deleting the passenger: ${error.message}`);
    }
  }
}

// Initialize the passenger list when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new PassengerList();
});
