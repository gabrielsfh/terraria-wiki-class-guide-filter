// ==UserScript==
// @name         Hide Specific Guide Class Setups For Terraria Wiki
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Hides elements when specific checkboxes are toggled
// @author       gabrielsfh
// @match        https://terraria.wiki.gg/wiki/Guide:Class_setups
// @grant        GM_addStyle
// ==/UserScript==

(function () {

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

    // Toggle all checkboxes when button is clicked
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
            container.className = "container";

            let names = ["Melee", "Ranged", "Magic", "Summoning", "Mixed"];
            names.forEach((name, index) => {
                let label = document.createElement("label");
                label.className = "label";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "class-toggle";
                checkbox.checked = true;
                checkbox.addEventListener("change", toggleDivs);

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(`${name}`));
                container.appendChild(label);
            });

            // Add renable all checkboxes button
            let enableAll = document.createElement("button");
            enableAll.innerText = "Renable All";

            enableAll.addEventListener("click", () => toggleAll(true));
            container.appendChild(enableAll);

            headline.parentElement.parentElement.insertBefore(container, headline.parentElement);
          
            enableAll.classList.add('enableAll');

            // Load saved checkbox state after adding checkboxes
            loadCheckboxState();
        }
    }

    // All the CSS
    GM_addStyle(`
        .enableAll {
            border: 2px solid #eae3d1;
            text-decoration: none;
            color: #eae3d1;
            background-color: #5a433a;
            transition: all 0.3s ease;
            padding: 5px 10px;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
            cursor: pointer;
        }

        .enableAll:hover {
            background-color: #6b4f44;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }

        .enableAll:active {
            background-color: #8b6e5f; /* Active state color */
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.2); /* Optional */
        }

        .class-toggle {
            margin-right: 5px;
            accent-color: #9FECF0;
            background-color: #5e3333;
        }

        .label {
            margin-right: 10px;
        }

        .div {
            margin-bottom: 1px;
        }
    `);

    // Wait for the page to load before adding checkboxes
    window.addEventListener("load", addCheckboxes);
})();
