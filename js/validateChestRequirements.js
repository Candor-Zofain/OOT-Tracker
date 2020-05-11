let chestAreaLogic;

async function GetChestLogic(callback) {
    var xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/chestRequirements.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function CreateDropDown(dropDownContainer, name, timeField) {
    let element = document.createElement('div');
    element.className = 'drop-down drop-down-data';
    // element.id = idPrefix + name.split(' ').join('-');
    element.dataset['invalidCount'] = "0";
    let timeString = typeof timeField === 'string' ? `
        <p>Time: ${timeField}</p>
    ` : '';
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

function CreateChestAreaData(dropDownContainer, logic) {
    let element = document.createElement('div');
    element.className = 'drop-down-data';
    // element.id = idPrefix + name;
    element.dataset['invalidCount'] = "0";

    let glitches = Array.isArray(logic.glitches) ? logic.glitches.join(', ') : 'invalid';
    let abilities = Array.isArray(logic.abilities) ? logic.abilities.join(', ') : 'invalid';
    let items = Array.isArray(logic.items) ? logic.items.join(', ') : 'invalid';

    element.innerHTML = `
        <p>Glitches: ${glitches}<br>Abilites: ${abilities}<br>Items: ${items}</p>
    `

    dropDownContainer.appendChild(element);
    return element;
}

function CreateAbilityData(dropDownContainer, logic) {
    let element = document.createElement('div');
    element.className = 'drop-down-data';
    element.dataset['invalidCount'] = "0";

    let settings = Array.isArray(logic.settings) ? logic.settings.join(', ') : 'invalid';
    let abilities = Array.isArray(logic.abilities) ? logic.abilities.join(', ') : 'invalid';
    let itemSets = '';
    if (Array.isArray(logic['item-sets'])) {
        logic['item-sets'].forEach(itemSet => {
            if (Array.isArray(itemSet)) {
                itemSets += '<br>&emsp;' + itemSet.join(', ');
            } else {
                itemSets += '<br>&emsp;invalid';
            }
        });
    } else {
        itemSets = 'invalid';
    }


    element.innerHTML = `
        <p>Settings: ${settings}<br>Abilities: ${abilities}<br>Item Sets: ${itemSets}</p>
    `;

    dropDownContainer.appendChild(element);
    return element;
}

function IncreaseInvalidCount(containers) {
    containers.forEach(container => {
        container.dataset.invalidCount = parseInt(container.dataset.invalidCount) + 1;
    });
}

function CheckArrayForStrings(containers, array) {
    if (!Array.isArray(array)) {
        IncreaseInvalidCount(containers);
    } else {
        for (let i = 0; i < array.length; i++) {
            if (typeof (array[i]) !== 'string') {
                IncreaseInvalidCount(containers);
            }
        }
    }
}

function CreateLogicContainer(containers, logicContainer, logic, name) {
    let logicElementContainer = CreateDropDown(logicContainer, name);
    let logicElement = CreateChestAreaData(logicElementContainer, logic);

    let subContainers = containers.concat([logicElementContainer, logicElement]);
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

StartValidation = function () {
    console.log('Starting Validation');
    console.log(chestAreaLogic);

    // Abilities
    let abilitiesContainer = document.getElementById('abilities');
    Object.keys(chestAreaLogic.abilities).forEach(ability => {
        let abilityElement = CreateDropDown(abilitiesContainer, ability);

        let logic = chestAreaLogic.abilities[ability];

        if (!Array.isArray(logic.settings) || !Array.isArray(logic.abilities) || !Array.isArray(logic["item-sets"])) {
            IncreaseInvalidCount([abilitiesContainer, abilityElement]);
            return;
        }

        let abilityDataElement = CreateAbilityData(abilityElement, logic);

        let containers = [abilitiesContainer, abilityElement, abilityDataElement];
        if (!logic.settings || !logic.abilities || !logic['item-sets']) {
            IncreaseInvalidCount(containers);
        }
        if (logic.settings) {
            CheckArrayForStrings(containers, logic.settings);
        }
        if (logic.abilities) {
            CheckArrayForStrings(containers, logic.abilities);
        }
        if (logic["item-sets"]) {
            if (Array.isArray(logic["item-sets"])) {
                logic["item-sets"].forEach(itemSet => {
                    CheckArrayForStrings(containers, itemSet);
                });
            } else {
                IncreaseInvalidCount(containers);
            }
        }
    });

    // Areas
    let areasContainer = document.getElementById('areas');
    if (!areasContainer) {
        console.error("ERROR: Element with id 'areas' not found");
        return;
    }
    Object.keys(chestAreaLogic.areas).forEach(area => {
        let areaElement = CreateDropDown(areasContainer, area);

        let areaLogic = chestAreaLogic.areas[area];

        if (!Array.isArray(areaLogic.child) || !Array.isArray(areaLogic.adult)) {
            IncreaseInvalidCount([areasContainer, areaElement]);
            return;
        }

        let childElement = CreateDropDown(areaElement, 'Child');
        areaLogic.child.forEach((logic, index) => {
            // name = 'Child ' + index
            CreateLogicContainer([areasContainer, areaElement, childElement], childElement, logic, 'Child ' + index);
        });

        let adultElement = CreateDropDown(areaElement, 'Adult');
        areaLogic.adult.forEach((logic, index) => {
            // name = 'Child ' + index
            CreateLogicContainer([areasContainer, areaElement, adultElement], adultElement, logic, 'Adult ' + index);
        });
    })

    // Chests
    let chestsContainer = document.getElementById('chests');
    if (!chestsContainer) {
        console.error("ERROR: Element with id 'chests' not found");
        return;
    }
    Object.keys(chestAreaLogic.chests).forEach(chestAreaName => {
        let chestAreaContainer = CreateDropDown(chestsContainer, chestAreaName);

        let chestArea = chestAreaLogic.chests[chestAreaName];
        Object.keys(chestArea).forEach(chestName => {
            let chestLogic = chestArea[chestName];

            let chestElement = CreateDropDown(chestAreaContainer, chestName, chestLogic.time);
            if (!chestLogic.time) {
                IncreaseInvalidCount([chestsContainer, chestAreaContainer, chestElement]);
            }

            if (typeof chestLogic.logic !== "object" || !Array.isArray(chestLogic.logic.child) || !Array.isArray(chestLogic.logic.adult)) {
                IncreaseInvalidCount([chestsContainer, chestAreaContainer, chestElement]);
                return;
            }

            let childElement = CreateDropDown(chestElement, 'Child');
            chestLogic.logic.child.forEach((logic, index) => {
                CreateLogicContainer([chestsContainer, chestAreaContainer, chestElement, childElement], childElement, logic, 'Child ' + index);
            });

            let adultElement = CreateDropDown(chestElement, 'Adult');
            chestLogic.logic.adult.forEach((logic, index) => {
                CreateLogicContainer([chestsContainer, chestAreaContainer, chestElement, adultElement], adultElement, logic, 'Adult ' + index);
            });
        });
    });

    let zIndex = -1;
    document.querySelectorAll('.drop-down').forEach(element => {
        element.style["z-index"] = zIndex;
        element.dataset.closed = true;
        zIndex--;
    });

    document.querySelectorAll('i').forEach(icon => {
        icon.onclick = () => {
            let dropDown = icon.closest('.drop-down');
            let closed = dropDown.dataset.closed;
            if (closed !== 'true' && closed !== 'false') {
                console.error('ERROR: Invalid closed value: ' + closed);
            }
            dropDown.dataset.closed = (closed === 'false');
        }
    });
};

let Init = function () {
    GetChestLogic(function (response) {
        chestAreaLogic = JSON.parse(response);
        StartValidation();
    });
};
Init();