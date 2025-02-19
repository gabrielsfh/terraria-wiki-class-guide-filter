// ==UserScript==
// @name         Terraria Wiki Class Setup Guide Filter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  You are able to hide all the classes you dont want to see in terraria wiki class setups
// @author       gabrielsfh
// @match        https://terraria.wiki.gg/wiki/Guide:Class_setups
// @grant        GM_addStyle
// ==/UserScript==

(function () {

    // Toggles the visibility of a specific class
    function toggleDivs() {
        let checkboxes = document.querySelectorAll(".class-toggle");
        let divs = document.querySelectorAll(".infocard.clearfix.guide-class-setups");

        // Gets the amount of checkboxes toggled
        let checkedCount = [...checkboxes].filter(cb => cb.checked).length;

        // Prevents the only toggled checkbox to be disabled when it's clicked at it
        if (checkedCount === 0) {
            this.checked = true;
            return;
        }

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

        saveCheckboxState();
    }

    // Toggle all checkboxes when button is clicked
    function toggleAll(state) {
        document.querySelectorAll(".class-toggle").forEach(checkbox => {
            checkbox.checked = state;
        });
        toggleDivs();
    }

    // Saves the order of the toggled checkboxes to localStorage
    function saveCheckboxState() {
        let checkboxStates = {};
        document.querySelectorAll(".class-toggle").forEach((checkbox, index) => {
            checkboxStates[index] = checkbox.checked;
        });
        localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
    }

    // Load saved checkbox order from localStorage
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
    if (!headline) return;

    let paragraph = headline.closest("h2").nextElementSibling;
    while (paragraph && paragraph.tagName !== "P") {
        paragraph = paragraph.nextElementSibling;
    }

    if (!paragraph) return;

    let container = document.createElement("div");
    let checkboxes = document.createElement("div");

    container.className = "container";
    checkboxes.className = "checkboxes";

    let names = ["Melee", "Ranged", "Magic", "Summoning", "Mixed"];
    names.forEach((name) => {
        let label = document.createElement("label");
        label.className = "label";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "class-toggle";
        checkbox.checked = true;
        checkbox.addEventListener("change", toggleDivs);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`${name}`));
        checkboxes.appendChild(label);
        container.appendChild(checkboxes);
    });

    // Add renable all checkboxes button
    let enableAll = document.createElement("button");
    let buttonContainer = document.createElement("div");

    enableAll.innerText = "Renable All";
    enableAll.addEventListener("click", () => toggleAll(true));

    container.appendChild(buttonContainer);
    buttonContainer.appendChild(enableAll);

    paragraph.parentNode.insertBefore(container, paragraph.nextSibling);

    enableAll.classList.add("enableAll");
    buttonContainer.classList.add("buttonContainer");

    // Load saved checkbox state after adding checkboxes
    loadCheckboxState();
}


    // All the CSS
    GM_addStyle(`
        .container {
            display: flex;
            padding-bottom: 10px;
            padding-top: 10px;
        }

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

        @media (max-width: 492px) {
            .container {
                flex-direction: column;
            }

            .checkboxes {
                margin: 0 auto;
                width: fit-content;
            }

            .buttonContainer {
                margin: 0 auto;
                width: fit-content;
            }

            .enableAll {
                padding: 5px 150px;
            }
        }

        @media (max-width: 400px) {
            .container {
                flex-direction: row;
            }
            
            .buttonContainer {
                margin: auto;
               
            }

            .checkboxes {
                display: flex;
                flex-direction: column;
            }

            .enableAll {
                padding: 5px 10px;
            }

        }
    `);

    // Wait for the page to load before adding checkboxes
    window.addEventListener("load", addCheckboxes);
})();
