document.addEventListener("DOMContentLoaded", () => {
  const avatarUploadInput = document.getElementById("avatarUpload");
  const characterDisplayImage = document.getElementById(
    "characterDisplayImage"
  );
  const characterImagePlaceholder = document.querySelector(
    ".character-image-placeholder"
  );
  const uploadPictureButton = document.querySelector(
    '.icon-btn[aria-label="Upload picture"]'
  );
  const resetButton = document.querySelector(".reset-btn");

  // Trigger file input when "Upload picture" button is clicked
  if (uploadPictureButton) {
    uploadPictureButton.addEventListener("click", () => {
      if (avatarUploadInput) {
        avatarUploadInput.click();
      }
    });
  }

  // Handle avatar image selection
  if (avatarUploadInput) {
    avatarUploadInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (characterDisplayImage) {
            characterDisplayImage.src = e.target.result;
            characterDisplayImage.style.display = "block"; // Show the image
          }
          if (characterImagePlaceholder) {
            // Optionally hide the placeholder SVG background or text
            characterImagePlaceholder.style.backgroundImage = "none";
            // If you have text inside placeholder, hide it too
            // const placeholderText = characterImagePlaceholder.querySelector('text');
            // if (placeholderText) placeholderText.style.display = 'none';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
  // Handle reset button
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      if (characterDisplayImage) {
        characterDisplayImage.src = "standard_male.png";
        characterDisplayImage.style.display = "block"; // Show the default image
      }
      if (avatarUploadInput) {
        avatarUploadInput.value = ""; // Clear the file input
      }
    });
  } // Handle form submission
  const characterForm = document.querySelector(".character-form");
  if (characterForm) {
    characterForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent actual submission

      try {
        // Wait for Firebase to be available
        if (!window.FirebaseService) {
          alert("Firebase is loading, please try again in a moment.");
          return;
        }

        // Gather form data
        const formData = new FormData(characterForm);
        const passengerData = {};

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
          passengerData[key] = value;
        }

        // Get avatar file if one was uploaded
        const avatarFile = avatarUploadInput.files[0];

        // Submit to Firebase
        const result = await window.FirebaseService.addPassenger(
          passengerData,
          avatarFile
        );

        if (result.success) {
          // Show success message
          alert(
            "Registration successful! Welcome aboard the Norwegian Steam Packet Company vessel!"
          );

          // Reset form
          characterForm.reset();

          // Reset avatar
          if (characterDisplayImage) {
            characterDisplayImage.src = "standard_male.png";
            characterDisplayImage.style.display = "block";
          }
          if (avatarUploadInput) {
            avatarUploadInput.value = "";
          }

          // Optionally redirect to passenger list
          // window.location.href = 'list.html';
        } else {
          alert("Registration failed: " + (result.error || "Unknown error"));
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert(
          "Registration failed: Please check your internet connection and try again."
        );
      }
    });
  }
});
