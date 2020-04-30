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

function CreateDropDown(dropDownContainer, name) {
    let element = document.createElement('div');
    element.className = 'drop-down drop-down-data';
    // element.id = idPrefix + name.split(' ').join('-');
    element.dataset['invalidCount'] = "0";
    element.innerHTML = `
        <div class="flex">
            <h2>${name}</h2>
            <i class="fa fa-caret-down fa-2x" area-hidden="true"></i>
        </div>
    `;

    dropDownContainer.appendChild(element);
    return element;
}

function CreateDropDownData(dropDownContainer, logic) {
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

function CreateLogicContianer(containers, logicContainer, logic, name) {
    let logicElementContainer = CreateDropDown(logicContainer, name);
    let logicElement = CreateDropDownData(logicElementContainer, logic);

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
    Object.keys(chestAreaLogic.abilities).forEach(ability => {
        // Not implemented yet
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
        let childElement = CreateDropDown(areaElement, 'Child');
        areaLogic.child.forEach((logic, index) => {
            // name = 'Child ' + index
            CreateLogicContianer([areasContainer, areaElement, childElement], childElement, logic, 'Child ' + index);
        });

        let adultElement = CreateDropDown(areaElement, 'Adult');
        areaLogic.adult.forEach((logic, index) => {
            // name = 'Child ' + index
            CreateLogicContianer([areasContainer, areaElement, adultElement], adultElement, logic, 'Adult ' + index);
        });
    })

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