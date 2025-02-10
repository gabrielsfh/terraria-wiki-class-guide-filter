// ==UserScript==
// @name         Hide Specific Guide Class Setups For Terraria Wiki
// @namespace    http://tampermonkey.net/
// @version      0.1
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

                // Loops to hide until endgame
                for (let i = 0; i < 9; i++) {
                    divs[position].style.display = checkbox.checked ? "none" : "";
                    position += 5;  
                }
                
            }
        });
        
    }
    

    // Function to toggle all checkboxes
    function toggleAll(state) {
        document.querySelectorAll(".class-toggle").forEach(checkbox => {
            checkbox.checked = state;
        });
        toggleDivs();
    }

    // Add the checkboxes after Contents
    function addCheckboxes() {
        let headline = document.querySelector("h2 span#Pre-Bosses");
        if (headline) {
            let container = document.createElement("div");
            container.style.marginBottom = "10px";

            let names = ["Melee", "Ranged", "Magic", "Summoning", "Mixed"];
            names.forEach((name, index) => {
                let label = document.createElement("label");
                label.style.marginRight = "10px";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "class-toggle";
                checkbox.addEventListener("change", toggleDivs);

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` Hide ${name}`));
                container.appendChild(label);
            });

            // Add Enable/Disable All checkboxes
            let enableAll = document.createElement("button");
            enableAll.innerText = "Enable All";
            enableAll.style.marginLeft = "10px";
            enableAll.addEventListener("click", () => toggleAll(false));

            let disableAll = document.createElement("button");
            disableAll.innerText = "Disable All";
            disableAll.style.marginLeft = "10px";
            disableAll.addEventListener("click", () => toggleAll(true));

            container.appendChild(enableAll);
            container.appendChild(disableAll);

            headline.parentElement.parentElement.insertBefore(container, headline.parentElement);
        }
    }

    // Wait for the page to load before adding checkboxes
    window.addEventListener("load", addCheckboxes);
})();
