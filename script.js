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
  const dropdowns = document.querySelectorAll(".toggle-dropdown-btn");

  function updateAccess() {
    checkboxes.forEach((checkbox, i) => {
      if (i > 0 && !checkboxes[i - 1].checked) {
        checkbox.disabled = true;
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

    dropdowns.forEach((dropdown, i) => {
      if (i > 0 && !checkboxes[i - 1].checked) {
        dropdown.disabled = true;
        dropdown.style.opacity = "0.5";
      } else {
        dropdown.disabled = false;
        dropdown.style.opacity = "1";
      }
    });
  }

  checkboxes.forEach((checkbox, index) => {
    const savedState = localStorage.getItem(`checkbox-${index}`);
    if (savedState === "checked") {
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", function () {
      if (this.checked) {
        localStorage.setItem(`checkbox-${index}`, "checked");
        updateAccess();
      } else {
        if (checkboxes[index + 1] && checkboxes[index + 1].checked) {
          this.checked = true;
          showPopup("You cannot uncheck this after progressing!");
        } else {
          localStorage.setItem(`checkbox-${index}`, "unchecked");
          updateAccess();
        }
      }
    });
  });

  function showPopup(message) {
    let popup = document.createElement("div");
    popup.className = "popup-message";
    popup.innerText = message;
    document.body.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 3000);
  }

  updateAccess();
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
