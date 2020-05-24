"use strict";

let abilities, glitches, areas;
let items = [
    "deku-stick",
    "deku-nut",
    "bomb",
    "bow",
    "arrow-fire",
    "din's-fire",
    "slingshot",
    "ocarina",
    "bombchu",
    "hookshot",
    "longshot",
    "arrow-ice",
    "farore's-wind",
    "boomerang",
    "lens-of-truth",
    "bean",
    "hammer",
    "arrow-light",
    "nayru's-love",
    "bottle",
    "ruto's-letter",
    "blue-fire",
    "weird-egg",
    "skull-mask",
    "mask-of-truth",
    "claim-check",
    "sword-kokiri",
    "sword-master",
    "sword-biggoron",
    "magic",
    "wallet-adult",
    "wallet-giant",
    "strength-bracelet",
    "strength-gauntlet-silver",
    "strength-gauntlet-gold",
    "shield-deku",
    "shield-hylian",
    "shield-mirror",
    "scale-silver",
    "scale-gold",
    "gerudo-card",
    "tunic-goron",
    "tunic-zora",
    "boots-iron",
    "boots-hover",
    "skulltula-10",
    "skulltula-20",
    "skulltula-30",
    "skulltula-40",
    "skulltula-50",
    "skulltula-100",
    "triforce",
    "song-zelda",
    "song-epona",
    "song-saria",
    "song-sun",
    "song-time",
    "song-storm",
    "song-minuet",
    "song-bolero",
    "song-serenade",
    "song-requiem",
    "song-nocturne",
    "song-prelude",
    "medallion-emerald",
    "medallion-ruby",
    "medallion-sapphire",
    "medallion-forest",
    "medallion-fire",
    "medallion-water",
    "medallion-spirit",
    "medallion-shadow",
    "key",
    "clear-deku",
    "clear-water"
];
let settings = [
    "bombchu-in-logic",
    "enter-zora's-domain-chicken",
    "enter-zora's-domain-hover"
];
let other = ["impossible"];

function CreateDropDown(dropDownContainer, name, timeField) {
    let element = document.createElement("div");
    element.className = "drop-down drop-down-data";
    // element.id = idPrefix + name.split(' ').join('-');
    element.dataset["invalidCount"] = "0";
    let timeString =
        typeof timeField === "string" ?
        `
        <p class="drop-down-data">Time: ${timeField}</p>
    ` :
        "";
    element.innerHTML = `
        <div class="flex">
            <h2>${name}</h2>
            <i class="fa fa-caret-down fa-2x" area-hidden="true"></i>
        </div>
        ${timeString}
    `;

    dropDownContainer.appendChild(element);
    return element;
}

function CreateDropDownData(dataContainer, logicString) {
    dataContainer.innerHTML = `
        <p>${logicString}</p>
    `;
}

function IncreaseInvalidCount(containers) {
    containers.forEach((container) => {
        container.dataset.invalidCount =
            parseInt(container.dataset.invalidCount) + 1;
    });
}

function CheckArrayForStrings(containers, array) {
    if (!Array.isArray(array)) {
        IncreaseInvalidCount(containers);
    } else {
        for (let i = 0; i < array.length; i++) {
            if (typeof array[i] !== "string") {
                IncreaseInvalidCount(containers);
            }
        }
    }
}

function CreateLogicContainer(containers, logicContainer, logic, name) {
    let logicElementContainer = CreateDropDown(logicContainer, name);
    let logicElement = CreateDropDownData(logicElementContainer, logic);

    let subContainers = containers.concat([
        logicElementContainer,
        logicElement,
    ]);
    if (!logic.glitches || !logic.abilities || !logic.items) {
        IncreaseInvalidCount(subContainers);
    }
    if (logic.glitches) {
        CheckArrayForStrings(subContainers, logic.glitches);
    }
    if (logic.abilities) {
        CheckArrayForStrings(subContainers, logic.abilities);
    }
    if (logic.items) {
        CheckArrayForStrings(subContainers, logic.items);
    }
}

function AndOr(containers, logic, layerNum) {
    if (!Array.isArray(logic)) {
        IncreaseInvalidCount(containers);
        return;
    }

    let logicString = "";
    for (let i = 0; i < logic.length; i++) {
        const subLogic = Object.entries(logic[i])[0];
        const func = LOGIC_TYPE_TO_FUNCTION[subLogic[0]];
        if (typeof func !== "function") {
            IncreaseInvalidCount(containers);
            logicString += "&emsp;".repeat(layerNum + 1) + "Invalid logic type: " + subLogic[0] + '<br>';
        } else {
            logicString += func(containers, subLogic[1], layerNum + 1);
        }
    }
    return logicString;
}

function And(containers, logic, layerNum = 0) {
    let beforeString = "&emsp;".repeat(layerNum) + "And: {<br>";
    let middleString = AndOr(containers, logic, layerNum);
    let afterString = "&emsp;".repeat(layerNum) + "}<br>";
    return beforeString + middleString + afterString;
}

function Or(containers, logic, layerNum = 0) {
    let beforeString = "&emsp;".repeat(layerNum) + "Or: {<br>";
    let middleString = AndOr(containers, logic, layerNum);
    let afterString = "&emsp;".repeat(layerNum) + "}<br>";
    return beforeString + middleString + afterString;
}

function Ability(containers, ability, layerNum = 0) {
    if (typeof ability !== "string") {
        IncreaseInvalidCount(containers);
        return "&emsp;".repeat(layerNum) + "Ability: Not String<br>";
    } else if (!abilities.includes(ability)) {
        IncreaseInvalidCount(containers);
        return "&emsp;".repeat(layerNum) + `Ability: ${ability} - Does not exist<br>`;
    }

    return "&emsp;".repeat(layerNum) + `Ability: ${ability}<br>`;
}

function Glitch(containers, glitch, layerNum = 0) {
    if (typeof glitch !== "string") {
        IncreaseInvalidCount(containers);
        return "&emsp;".repeat(layerNum) + "Glitch: Not string<br>";
    } else if (!glitches.includes(glitch)) {
        IncreaseInvalidCount(containers);
        return "&emsp;".repeat(layerNum) + `Glitch: ${glitch} - Does not exist<br>`;
    }

    return "&emsp;".repeat(layerNum) + `Glitch: ${glitch}<br>`;
}

function Item(containers, item, layerNum = 0) {
    if (typeof item !== "string") {
        if (
            Array.isArray(item) &&
            item[0] === "key" &&
            typeof item[1] === "string" &&
            typeof item[2] === "number"
        ) {
            return "&emsp;".repeat(layerNum) + `Item: key-${item[1]} (${item[2]})<br>`;
        } else {
            IncreaseInvalidCount(containers);
            return "&emsp;".repeat(layerNum) + "Item: Invalid<br>";
        }
    } else if (!items.includes(item)) {
        IncreaseInvalidCount(containers);
        return "&emsp;".repeat(layerNum) + `Item: ${item} - Does not exist<br>`;
    }

    return "&emsp;".repeat(layerNum) + `Item: ${item}<br>`;
}

function Setting(containers, setting, layerNum = 0) {
    if (typeof setting !== "string") {
        IncreaseInvalidCount(containers);
        return "&emsp;".repeat(layerNum) + `Setting: Not String<br>`
    } else if (!settings.includes(setting)) {
        IncreaseInvalidCount(containers);
        return "&emsp;".repeat(layerNum) + `Setting: ${setting} - Does not exist<br>`;
    }

    return "&emsp;".repeat(layerNum) + `Setting: ${setting}<br>`;
}

function Other(containers, other, layerNum = 0) {
    if (typeof other !== "string") {
        IncreaseInvalidCount(containers);
        return "&emsp;".repeat(layerNum) + `Other: Not string<br>`;
    }

    return "&emsp;".repeat(layerNum) + `Other: ${other}<br>`;
}

const LOGIC_TYPE_TO_FUNCTION = {
    AND: And,
    OR: Or,
    ABILITY: Ability,
    GLITCH: Glitch,
    ITEM: Item,
    SETTING: Setting,
    OTHER: Other
};
Object.freeze(LOGIC_TYPE_TO_FUNCTION);

function LogicCheck(containers, logic) {
    let logicString = "No Requirements";
    let dataContainer = document.createElement("div");
    dataContainer.dataset["invalidCount"] = 0;

    if (logic.length > 0) {
        logic = logic[0];
        if (!(logic[0] in LOGIC_TYPE_TO_FUNCTION)) {
            IncreaseInvalidCount(containers.concat(dataContainer));
            logicString = "Invalid logic type: " + logic[0];
        } else {
            logicString = LOGIC_TYPE_TO_FUNCTION[logic[0]](
                containers.concat(dataContainer),
                logic[1]
            );
        }
    }

    dataContainer.className = "drop-down-data";
    CreateDropDownData(dataContainer, logicString);
    return dataContainer;
}

var StartValidation = function () {
    console.log("Starting Validation");

    // Glitches
    let glitchesContainer = document.getElementById("glitches");
    if (!glitchesContainer) {
        console.error("ERROR: Element with id 'glitches' not found");
    } else {
        Object.keys(glitchLogic).forEach((glitch) => {
            let glitchElement = CreateDropDown(glitchesContainer, glitch);
            let singleGlitchLogic = glitchLogic[glitch];

            if (typeof singleGlitchLogic !== "object") {
                IncreaseInvalidCount([glitchesContainer, glitchElement]);
            } else {
                let dataContainer = LogicCheck([glitchesContainer, glitchElement], Object.entries(singleGlitchLogic));
                glitchElement.append(dataContainer);
            }
        });
    }

    // Abilities
    let abilitiesContainer = document.getElementById("abilities");
    if (!abilitiesContainer) {
        console.error("ERROR: Element with id 'abilities' not found");
    } else {
        Object.keys(abilityLogic).forEach((ability) => {
            let abilityElement = CreateDropDown(abilitiesContainer, ability);
            let singleAbilityLogic = abilityLogic[ability];

            if (typeof singleAbilityLogic !== "object") {
                IncreaseInvalidCount([abilitiesContainer, abilityElement]);
            } else {
                let dataContainer = LogicCheck([abilitiesContainer, abilityElement], Object.entries(singleAbilityLogic));
                abilityElement.append(dataContainer);
            }
        });
    }

    // Areas
    let areasContainer = document.getElementById("areas");
    if (!areasContainer) {
        console.error("ERROR: Element with id 'areas' not found");
    } else {
        Object.keys(areaLogic).forEach((area) => {
            let areaElement = CreateDropDown(areasContainer, area);
            let singleAreaLogic = areaLogic[area];

            if (typeof singleAreaLogic.child !== "object" || typeof singleAreaLogic.adult !== "object") {
                IncreaseInvalidCount([areasContainer, areaElement]);
            } else {
                let childElement = CreateDropDown(areaElement, "Child");
                let childLogic = Object.entries(singleAreaLogic.child);
                let dataContainer = LogicCheck(
                    [areasContainer, areaElement, childElement],
                    childLogic
                );
                childElement.append(dataContainer);

                let adultElement = CreateDropDown(areaElement, "Adult");
                let adultLogic = Object.entries(singleAreaLogic.adult);
                dataContainer = LogicCheck(
                    [areasContainer, areaElement, adultElement],
                    adultLogic
                );
                adultElement.append(dataContainer);
            }
        });
    }

    // Chests
    let chestsContainer = document.getElementById("chests");
    if (!chestsContainer) {
        console.error("ERROR: Element with id 'chests' not found");
    } else {
        Object.keys(chestLogic).forEach((areaName) => {
            let chestContainer = CreateDropDown(chestsContainer, areaName);
            let chestArea = chestLogic[areaName];

            Object.keys(chestArea).forEach((chestName) => {
                let singleChestLogic = chestArea[chestName];

                let chestElement = CreateDropDown(
                    chestContainer,
                    chestName,
                    singleChestLogic.time
                );
                if (!singleChestLogic.time) {
                    IncreaseInvalidCount([
                        chestsContainer,
                        chestContainer,
                        chestElement,
                    ]);
                }

                if (typeof singleChestLogic.child !== "object" || typeof singleChestLogic.adult !== "object") {
                    IncreaseInvalidCount([
                        chestsContainer,
                        chestContainer,
                        chestElement,
                    ]);
                } else {
                    let childElement = CreateDropDown(chestElement, "Child");
                    let childLogic = Object.entries(singleChestLogic.child);
                    let dataContainer = LogicCheck(
                        [chestsContainer, chestContainer, chestElement, childElement],
                        childLogic
                    );
                    childElement.append(dataContainer);

                    let adultElement = CreateDropDown(chestElement, "Adult");
                    let adultLogic = Object.entries(singleChestLogic.adult);
                    dataContainer = LogicCheck(
                        [chestsContainer, chestContainer, chestElement, adultElement],
                        adultLogic
                    );
                    adultElement.append(dataContainer);
                }
            });
        });
    }

    let zIndex = -1;
    document.querySelectorAll(".drop-down").forEach((element) => {
        element.style["z-index"] = zIndex;
        element.dataset.closed = true;
        zIndex--;
    });

    document.querySelectorAll("i").forEach((icon) => {
        icon.onclick = () => {
            let dropDown = icon.closest(".drop-down");
            let closed = dropDown.dataset.closed;
            if (closed !== "true" && closed !== "false") {
                console.error("ERROR: Invalid closed value: " + closed);
            }
            dropDown.dataset.closed = closed === "false";
        };
    });

    console.log("Finished Validation");
};

let Init = async function () {
    function wait() {
        if (
            typeof abilityLogic !== "undefined" &&
            typeof areaLogic !== "undefined" &&
            typeof chestLogic !== "undefined" &&
            typeof glitchLogic !== "undefined"
        ) {
            abilities = Object.keys(abilityLogic);
            glitches = Object.keys(glitchLogic);
            areas = Object.keys(areaLogic);
            StartValidation();
        } else {
            console.log("waiting...");
            setTimeout(wait, 10);
        }
    }
    setTimeout(wait, 50);
};
Init();