document.addEventListener('DOMContentLoaded', function() {
  // Navigation and slider functionality (if any existing code is present)
  const navItems = document.querySelectorAll('.nav-item');
  const slidingLine = document.querySelector('.sliding-line');
  const currentPage = window.location.pathname.split('/').pop();

  // Set active class based on current page
  navItems.forEach(item => {
    if (item.href.endsWith(currentPage)) {
      item.classList.add('active');
    }
  });

  function updateSliderPosition() {
    const activeItem = document.querySelector('.nav-item.active');
    if (!activeItem) return;
    
    const itemRect = activeItem.getBoundingClientRect();
    const containerRect = document.querySelector('.nav-items').getBoundingClientRect();
    
    slidingLine.style.width = `${itemRect.width}px`;
    slidingLine.style.left = `${itemRect.left - containerRect.left}px`;
  }

  // Initialize slider position
  updateSliderPosition();

  // Handle window resize
  window.addEventListener('resize', updateSliderPosition);

  // Smooth navigation: clicking a nav item updates the active class and redirects.
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      updateSliderPosition();
      window.location.href = this.href;
    });
  });

  // Dropdown toggle for Playlist nav:
  // When the Playlist nav item is clicked, it ALWAYS toggles the dropdown.
  document.querySelectorAll('.custom-dropdown .dropdown-toggle').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();        // Prevent default link behavior
      e.stopPropagation();       // Stop the click from bubbling up (which would trigger the document click)
      const menu = this.nextElementSibling;
      // Toggle the dropdown menu display
      if (menu.style.display === 'block') {
        menu.style.display = 'none';
      } else {
        menu.style.display = 'block';
      }
    });
  });

  // Close the dropdown when clicking anywhere outside the dropdown container.
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.custom-dropdown .dropdown-menu').forEach(menu => {
      if (!menu.parentElement.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', function() {
  // Playlist Dropdown Toggle: always toggle on click
  const playlistToggle = document.querySelector('.custom-dropdown .dropdown-toggle');
  if (playlistToggle) {
    playlistToggle.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent any default link action
      e.stopPropagation(); // Stop event bubbling so it doesn't immediately trigger the document click handler
      const dropdownMenu = this.nextElementSibling;
      if (dropdownMenu) {
        // Toggle display
        dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
      }
    });
  }

  // Close dropdown if clicking outside the Playlist nav
  document.addEventListener('click', function(e) {
    const dropdownMenu = document.querySelector('.custom-dropdown .dropdown-menu');
    const playlistToggle = document.querySelector('.custom-dropdown .dropdown-toggle');
    // If the click target is not within the Playlist nav or its dropdown, hide the dropdown
    if (dropdownMenu && playlistToggle &&
        !playlistToggle.contains(e.target) &&
        !dropdownMenu.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });
});


// 
document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(".access-checkbox");
  const buttons = document.querySelectorAll(".watch-now-btn");

  // 1. Disable all except the first checkbox/button on initial load if there's no saved state.
  checkboxes.forEach((checkbox, index) => {
    // Read saved state from localStorage
    const savedState = localStorage.getItem(`checkbox-${index}`);

    // If no saved state, disable all except index 0
    if (savedState === null) {
      checkbox.disabled = (index !== 0);
      checkbox.checked = false;
      localStorage.setItem(`checkbox-${index}`, "unchecked");
    } else {
      // If we do have a saved state, apply it (checked/unchecked).
      checkbox.checked = (savedState === "checked");
    }
  });

  // Same for buttons
  buttons.forEach((btn, index) => {
    btn.disabled = (index !== 0);
    btn.style.opacity = btn.disabled ? "0.5" : "1";
  });

  // 2. Run updateAccess() once to enable any subsequent boxes
  //    if the previous ones are checked from a prior session.
  updateAccess();

  // 3. Listen for checkbox changes
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        // If user checks this box, store state, then refresh
        localStorage.setItem(`checkbox-${index}`, "checked");
        // Refresh the page to re-run updateAccess logic on load
        location.reload();
      } else {
        // If user tries to uncheck, see if the next box is already checked
        if (checkboxes[index + 1] && checkboxes[index + 1].checked) {
          // Block them from unchecking
          this.checked = true;
          showPopup("You cannot uncheck this after progressing!");
        } else {
          localStorage.setItem(`checkbox-${index}`, "unchecked");
          // Refresh the page after unchecking
          location.reload();
        }
      }
    });
  });

  // 4. Prevent clicks on locked buttons
  buttons.forEach((button, index) => {
    button.addEventListener("click", function (event) {
      // If there's a "previous" checkbox that isn’t checked, block click
      if (index > 0 && !checkboxes[index - 1].checked) {
        event.preventDefault();
        showPopup("You need to complete the previous section first!");
      }
    });
  });

  // This function re-checks which items to disable/enable
  function updateAccess() {
    checkboxes.forEach((checkbox, i) => {
      // If the previous box isn't checked, disable this one
      if (i > 0 && !checkboxes[i - 1].checked) {
        checkbox.disabled = true;
        checkbox.checked = false;
        localStorage.setItem(`checkbox-${i}`, "unchecked");
      } else {
        checkbox.disabled = false;
      }
    });

    buttons.forEach((btn, i) => {
      if (i > 0 && !checkboxes[i - 1].checked) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
      } else {
        btn.disabled = false;
        btn.style.opacity = "1";
      }
    });
  }

  // Simple popup
  function showPopup(message) {
    let popup = document.createElement("div");
    popup.className = "popup-message";
    popup.innerText = message;
    document.body.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 3000);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const restartButton = document.querySelector(".dropdown-item[href='#']");
  const checkboxes = document.querySelectorAll(".access-checkbox");

  if (restartButton) {
      restartButton.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent default link behavior

          const confirmRestart = confirm("Are you sure you want to restart the course? This will reset all progress.");
          if (confirmRestart) {
              checkboxes.forEach((checkbox, index) => {
                  checkbox.checked = false;
                  localStorage.setItem(`checkbox-${index}`, "unchecked");
              });

              alert("Course progress has been reset!");
              location.reload(); // Reload the page to reflect changes
          }
      });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const restartButton = document.querySelector(".dropdown-item[href='#']");
  const checkboxes = document.querySelectorAll(".access-checkbox");

  if (restartButton) {
      restartButton.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent default link behavior

          const confirmRestart = confirm("Are you sure you want to restart the course? This will reset all progress.");
          if (confirmRestart) {
              checkboxes.forEach((checkbox, index) => {
                  checkbox.checked = false;
                  localStorage.setItem(`checkbox-${index}`, "unchecked");

                  // Update text beside checkbox
                  updateCheckboxLabel(checkbox, false);
              });

              alert("Course progress has been reset!");
              location.reload(); // Reload the page to reflect changes
          }
      });
  }

  function updateCheckboxLabel(checkbox, isChecked) {
      const label = checkbox.closest("label").querySelector(".checkbox__label");
      if (label) {
          label.textContent = isChecked ? "Completed" : "Not Completed";
      }
  }

  // Load checkbox state from localStorage
  checkboxes.forEach((checkbox, index) => {
      const savedState = localStorage.getItem(`checkbox-${index}`);
      checkbox.checked = savedState === "checked";

      // Update label on load
      updateCheckboxLabel(checkbox, checkbox.checked);

      checkbox.addEventListener("change", function () {
          if (this.checked) {
              localStorage.setItem(`checkbox-${index}`, "checked");
          } else {
              localStorage.setItem(`checkbox-${index}`, "unchecked");
          }

          updateCheckboxLabel(this, this.checked);
      });
  });
});
