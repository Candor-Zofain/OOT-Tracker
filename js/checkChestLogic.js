function CheckForLogic() {
    if (!chestAreaLogic) {
        setTimeout(CheckForLogic, 10);
    } else {
        InitLogic();
    }
};
setTimeout(CheckForLogic, 10);

let chestListElement = document.getElementById('chest-list');
const logicStatus = {};

function UpdateHeaderStatus(headerElement, status) {
    let time = chestListElement.dataset.time;
    if (time === 'child') {
        headerElement.dataset.status = status.childStatus;
    } else if (time === 'adult') {
        headerElement.dataset.status = status.adultStatus
    } else if (time === 'anyTime') {
        headerElement.dataset.status = Math.max(status.childStatus, status.adultStatus);
    } else {
        console.error('Unknown time: ' + time);
    }
}

function CreateChestAreaLine(chestLinesElement, areaName) {
    let div = document.createElement('div');
    div.className = "chest-line";
    div.dataset.area = areaName;

    let h2 = document.createElement('h2');
    h2.innerText = areaName;

    // Go to new list
    if (areaName === '(back)') {
        div.onclick = GoToAreaList;
    } else {
        div.onclick = () => {
            GoToChestList(areaName)
        };
        UpdateHeaderStatus(h2, logicStatus[areaName]);
    }

    div.appendChild(h2);
    chestLinesElement.appendChild(div);
    return h2;
}

function CreateChestLine(areaChestLinesElement, areaName, chestName) {
    let div = document.createElement('div');
    div.className = "chest-line";
    div.dataset.chest = chestName;

    let h2 = document.createElement('h2');
    h2.innerText = chestName;

    let areaStatus = logicStatus[areaName];

    div.onclick = () => {
        h2.dataset.status = areaStatus.chests[chestName].childStatus = areaStatus.chests[chestName].adultStatus = 4;
        UpdateAreaStatus(areaName);
        UpdateHeaderStatus(chestListElement.querySelector('.header h1'), areaStatus);
    };

    div.oncontextmenu = () => {
        areaStatus.chests[chestName].childStatus = areaStatus.chests[chestName].adultStatus = 0;
        CheckChestStatus(areaName, chestName);
        UpdateHeaderStatus(h2, areaStatus.chests[chestName]);

        areaStatus.childStatus = areaStatus.adultStatus = 0;
        UpdateAreaStatus(areaName);
        UpdateHeaderStatus(chestListElement.querySelector('.header h1'), areaStatus);

        return false;
    };

    UpdateHeaderStatus(h2, areaStatus.chests[chestName]);

    div.appendChild(h2);
    areaChestLinesElement.appendChild(div);
}

function GoToAreaList() {
    chestListElement.getElementsByClassName('header')[0].innerHTML = `
        <h1>Hyrule</h1>
    `;

    let chestLinesElement = document.getElementById('chest-lines');
    chestLinesElement.innerHTML = '';
    Object.keys(chestAreaLogic.areas).forEach(area => {
        CreateChestAreaLine(chestLinesElement, area);
    });
}

function GoToChestList(areaName) {
    let h1 = document.createElement('h1');
    h1.innerText = areaName;
    UpdateHeaderStatus(h1, logicStatus[areaName]);

    chestListElement.getElementsByClassName('header')[0].innerHTML = h1.outerHTML;

    let chestLinesElement = document.getElementById('chest-lines');
    chestLinesElement.innerHTML = '';
    CreateChestAreaLine(chestLinesElement, '(back)');

    Object.keys(chestAreaLogic.chests[areaName]).forEach(chestName => {
        CreateChestLine(chestLinesElement, areaName, chestName);
    })
}

function CheckGlitch(glitchName) {
    return 3;
}

function CheckAbility(abilityName) {
    let ability = chestAreaLogic.abilities[abilityName];

    console.warn('Settings check not implemented');
    for (let i = 0; i < ability.settings.length; i++) {
        // Settings check
    }

    for (let i = 0; i < ability["item-sets"].length; i++) {
        let itemSet = ability["item-sets"][i];
        let haveAllItems = true;
        for (let j = 0; j < itemSet.length; j++) {
            if (!CheckItem(itemSet[j])) {
                haveAllItems = false;
                break;
            }
        }
        if (haveAllItems) return true;
    }

    for (let i = 0; i < ability.abilities.length; i++) {
        let subAbility = ability.abilities[i];
        if (CheckAbility(subAbility)) {
            return true;
        }
    }

    return false;
}

function CheckItem(itemName, lowestValue = 1) {
    let curValue = itemValues[itemName];
    return curValue >= lowestValue;
}

function CheckLogic(logic) {
    let status = 3; // Only decreases

    // Check glitches
    if (logic.glitches.length !== 0) {
        status = 2;
        for (let i = 0; i < logic.glitches.length; i++) {
            let glitchStatus = CheckGlitch(logic.glitches[i]);
            if (glitchStatus < status) {
                status = glitchStatus;
                if (status === 0) {
                    return 0;
                }
            }
        }
    }

    for (let i = 0; i < logic.abilities.length; i++) {
        let abilityStatus = CheckAbility(logic.abilities[i]);
        if (abilityStatus < status) {
            status = abilityStatus;
            if (status === 0) {
                return 0;
            }
        }
    }

    for (let i = 0; i < logic.items.length; i++) {
        let itemStatus = CheckItem(logic.items[i]);
        if (itemStatus < status) {
            status = itemStatus;
            if (status === 0) {
                return 0;
            }
        }
    }

    return status;
}

function CheckChestStatus(areaName, chestName) {
    let chestStatus = logicStatus[areaName].chests[chestName];
    if (chestStatus.adultStatus === 4) return 4;

    let chestLogic = chestAreaLogic.chests[areaName][chestName].logic;
    let childStatus = 0; // Only increases
    for (let i = 0; i < chestLogic.child.length; i++) {
        let status = CheckLogic(chestLogic.child[i]);
        if (status > childStatus) {
            childStatus = status;
            if (childStatus === 3) {
                break;
            }
        }
    }
    chestStatus.childStatus = childStatus;

    let adultStatus = 0; // Only increases
    for (let i = 0; i < chestLogic.adult.length; i++) {
        let status = CheckLogic(chestLogic.adult[i]);
        if (status > adultStatus) {
            adultStatus = status;
            if (adultStatus === 3) {
                break;
            }
        }
    }
    chestStatus.adultStatus = adultStatus;
};

function UpdateAreaStatus(areaName) {
    let areaStatus = logicStatus[areaName];
    if (areaStatus.adultStatus === 4) return 4;

    let allChestsOpened = true;
    let chestNames = Object.keys(areaStatus.chests);
    let time = chestListElement.dataset.time;
    for (let i = 0; i < chestNames.length; i++) {
        if (
            (time === 'child' && areaStatus.chests[chestNames[i]].childStatus !== 4) ||
            (time === 'adult' && areaStatus.chests[chestNames[i]].adultStatus !== 4) ||
            (time === 'anyTime' && Math.max(areaStatus.chests[chestNames[i]].childStatus, areaStatus.chests[chestNames[i]].adultStatus) !== 4)
        ) {
            allChestsOpened = false;
            break;
        }
    }
    if (allChestsOpened) {
        areaStatus.childStatus = areaStatus.adultStatus = 4;
        return;
    }

    let areaLogic = chestAreaLogic.areas[areaName];
    let childStatus = 0; // Only increases
    for (let i = 0; i < areaLogic.child.length; i++) {
        let status = CheckLogic(areaLogic.child[i]);
        if (status > childStatus) {
            childStatus = status;
            if (childStatus === 3) {
                break;
            }
        }
    }
    areaStatus.childStatus = childStatus;

    let adultStatus = 0; // Only increases
    for (let i = 0; i < areaLogic.adult.length; i++) {
        let status = CheckLogic(areaLogic.adult[i]);
        if (status > adultStatus) {
            adultStatus = status;
            if (adultStatus === 3) {
                break;
            }
        }
    }
    areaStatus.adultStatus = adultStatus;
}

let InitLogic = function () {
    // console.log(chestAreaLogic);

    Object.keys(chestAreaLogic.areas).forEach(areaName => {
        logicStatus[areaName] = {
            childStatus: 0,
            adultStatus: 0,
            chests: {}
        };

        if (typeof chestAreaLogic.chests[areaName] === 'undefined') {
            console.error('ERROR: No chests for area: ' + areaName);
            return;
        }

        Object.keys(chestAreaLogic.chests[areaName]).forEach(chestName => {
            logicStatus[areaName].chests[chestName] = {
                childStatus: 0,
                adultStatus: 0
            };

            CheckChestStatus(areaName, chestName);
        });

        UpdateAreaStatus(areaName);
    });

    GoToAreaList();
};