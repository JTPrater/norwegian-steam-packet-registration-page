// Firebase Configuration for Norwegian Steam Packet Company
// Replace with your actual Firebase config when you create a project

const firebaseConfig = {
  apiKey: "AIzaSyDgpTjJaI0wN__o02k4rQQJOepj_-OeH-M",
  authDomain: "norwegian-steam-packet.firebaseapp.com",
  databaseURL: "https://norwegian-steam-packet-default-rtdb.firebaseio.com",
  projectId: "norwegian-steam-packet",
  storageBucket: "norwegian-steam-packet.firebasestorage.app",
  messagingSenderId: "646556470294",
  appId: "1:646556470294:web:7311878d50967335ef3937",
  measurementId: "G-3FV48WCXBG",
};

// Initialize Firebase when script loads
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

console.log("Firebase initialized successfully");

// Firebase service functions
window.FirebaseService = {
  // Add a new passenger
  async addPassenger(passengerData, avatarFile = null) {
    try {
      let avatarURL = "standard_male.png";

      // Upload avatar if provided
      if (avatarFile) {
        const timestamp = Date.now();
        const storageRef = storage.ref(
          `avatars/${timestamp}_${avatarFile.name}`
        );
        const snapshot = await storageRef.put(avatarFile);
        avatarURL = await snapshot.ref.getDownloadURL();
      }

      // Add passenger data with avatar URL
      const passengersRef = database.ref("passengers");
      const newPassengerData = {
        ...passengerData,
        avatar: avatarURL,
        registrationDate: new Date().toISOString(),
        id: Date.now().toString(),
      };

      await passengersRef.push(newPassengerData);
      return { success: true, data: newPassengerData };
    } catch (error) {
      console.error("Error adding passenger:", error);
      return { success: false, error: error.message };
    }
  },
  // Get all passengers with real-time updates
  onPassengersChange(callback) {
    const passengersRef = database.ref("passengers");
    const listener = passengersRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const passengers = data
        ? Object.keys(data).map((key) => ({
            ...data[key],
            firebaseKey: key, // Add Firebase key for deletion
          }))
        : [];
      callback(passengers);
    });

    return listener;
  },

  // Remove a passenger by Firebase key (Admin only)
  async removePassenger(firebaseKey) {
    try {
      const passengerRef = database.ref(`passengers/${firebaseKey}`);
      await passengerRef.remove();
      return { success: true };
    } catch (error) {
      console.error("Error removing passenger:", error);
      return { success: false, error: error.message };
    }
  },

  // Remove a passenger by their ID (Admin only)
  async removePassengerById(passengerId) {
    try {
      const passengersRef = database.ref("passengers");
      const snapshot = await passengersRef
        .orderByChild("id")
        .equalTo(passengerId)
        .once("value");
      const data = snapshot.val();

      if (data) {
        const firebaseKey = Object.keys(data)[0];
        await this.removePassenger(firebaseKey);
        return { success: true };
      } else {
        return { success: false, error: "Passenger not found" };
      }
    } catch (error) {
      console.error("Error removing passenger by ID:", error);
      return { success: false, error: error.message };
    }
  },
};
