// ==UserScript==
// @name         Hide Specific Guide Class Setups For Terraria Wiki
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hides elements when specific checkboxes are toggled
// @author       gabrielsfh
// @match        https://terraria.wiki.gg/wiki/Guide:Class_setups
// @grant        none
// ==/UserScript==

(function() {

    // Toggles the visibility of a specific class
    function toggleDivs() {
        let checkboxes = document.querySelectorAll(".class-toggle");
        let divs = document.querySelectorAll(".infocard.clearfix.guide-class-setups");

        checkboxes.forEach((checkbox, index) => {
            if (divs[index]) {
                let position = index;

                // Loops to show/hide a specific class
                for (let i = 0; i < 9; i++) {
                    divs[position].style.display = checkbox.checked ? "" : "none";
                    position += 5;
                }
            }
        });

        // Save checkbox state to localStorage
        saveCheckboxState();
    }

    // Function to toggle all checkboxes
    function toggleAll(state) {
        document.querySelectorAll(".class-toggle").forEach(checkbox => {
            checkbox.checked = state;
        });
        toggleDivs();
    }

    // Save the state of checkboxes to localStorage
    function saveCheckboxState() {
        let checkboxStates = {};
        document.querySelectorAll(".class-toggle").forEach((checkbox, index) => {
            checkboxStates[index] = checkbox.checked;
        });
        localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
    }

    // Load saved checkbox states from localStorage
    function loadCheckboxState() {
        let savedStates = localStorage.getItem("checkboxStates");
        if (savedStates) {
            savedStates = JSON.parse(savedStates);
            document.querySelectorAll(".class-toggle").forEach((checkbox, index) => {
                if (savedStates[index] !== undefined) {
                    checkbox.checked = savedStates[index];
                }
            });

            // Apply the saved states
            toggleDivs();
        }
    }

    // Add the checkboxes after Contents
    function addCheckboxes() {
        let headline = document.querySelector("h2 span#Pre-Bosses");
        if (headline) {
            let container = document.createElement("div");
            container.style.marginBottom = "1px";

            let names = ["Melee", "Ranged", "Magic", "Summoning", "Mixed"];
            names.forEach((name, index) => {
                let label = document.createElement("label");
                label.style.marginRight = "10px";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "class-toggle";
                checkbox.checked = true;
                checkbox.addEventListener("change", toggleDivs);

                checkbox.style.marginRight = "5px";



                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(`${name}`));
                container.appendChild(label);
            });

            // Add renable all checkboxes
            let enableAll = document.createElement("button");
            enableAll.innerText = "Renable All";

            enableAll.addEventListener("click", () => toggleAll(true));
            container.appendChild(enableAll);

            headline.parentElement.parentElement.insertBefore(container, headline.parentElement);
            
            enableAll.style.borderColor="#EAE3D1";
            enableAll.style.textDecoration="#EAE3D1";
            enableAll.style.color="#EAE3D1";
            enableAll.style.backgroundColor="#5a433a";

            // Load saved checkbox state after adding checkboxes
            loadCheckboxState();
        }
    }

    // Wait for the page to load before adding checkboxes
    window.addEventListener("load", addCheckboxes);
})();
