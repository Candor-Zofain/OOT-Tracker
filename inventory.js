const itemValues = {};

const NUMS = {
    'deku-stick': [0, 10, 20, 30],
    'deku-nut': [0, 20, 30, 40],
    'bomb': [0, 20, 30, 40],
    'bow': [0, 30, 40, 50],
    'slingshot': [0, 30, 40, 50],
    'wallet': [0, 99, 200, 500, 999]
};
Object.freeze(NUMS);

const OCARINA = [
    'Fairy',
    'Fairy',
    'of Time'
];
Object.freeze(OCARINA);

const _SHOT = [
    'Hookshot',
    'Hookshot',
    'Longshot'
];
Object.freeze(_SHOT);

const SCALE = [
    'Silver',
    'Silver',
    'Gold'
];
Object.freeze(SCALE);

const BOTTLE = [
    'Empty',
    'Empty',
    'Bug',
    'Fish',
    'Poe',
    'Big Poe',
    'Blue Fire',
    'Milk (Half)',
    'Milk',
    'Red Potion',
    'Green Potion',
    'Blue Potion',
    'Fairy',
    "Ruto's Letter"
];
Object.freeze(BOTTLE);

const QUEST_CHILD = [
    'Weird Egg',
    'Weird Egg',
    'Cucco',
    "Zelda's Letter",
    'Keaton Mask',
    'SOLD OUT',
    'Skull Mask',
    'SOLD OUT',
    'Spooky Mask',
    'SOLD OUT',
    'Bunny Hood',
    'SOLD OUT',
    'Mask of Truth'
];
Object.freeze(QUEST_CHILD);

const QUEST_ADULT = [
    'Egg Cojiro',
    'Egg Cojiro',
    'Pocket Cucco',
    'Cojiro',
    'Odd Mushroom',
    "Poacher's Saw",
    'Broken Sword',
    'Prescription',
    'Eyeball Frog',
    'Eyedrops',
    'Claim Check'
];
Object.freeze(QUEST_ADULT);

const STRENGTH = [
    'Goron Bracelet',
    'Goron Bracelet',
    'Gauntlets Silver',
    'Gauntlets Golden'
];
Object.freeze(STRENGTH);

const WALLET = [
    "Default",
    "Default",
    "Adult's",
    "Giant's",
    "Giant's"
];
Object.freeze(WALLET);

const MAGIC = [
    'Small',
    'Small',
    'Large'
];
Object.freeze(MAGIC);

const DUNGEON = [
    'Unknown',
    'Emerald',
    'Ruby',
    'Sapphire',
    'Light',
    'Forest',
    'Fire',
    'Water',
    'Spirit',
    'Shadow'
];
Object.freeze(DUNGEON);
const DUNGEON_AVAIL = Array.from({ length: DUNGEON.length - 1 }, (_, index) => index + 1);

const MAX_ITEM_VALUES = {
    "deku-stick": 3,
    "deku-nut": 3,
    "bomb": 3,
    "bow": 3,
    "slingshot": 3,
    "ocarina": OCARINA.length - 1,
    "_shot": _SHOT.length - 1,
    "magic-beans": 10,
    "bottle": BOTTLE.length - 1,
    "quest-child": QUEST_CHILD.length - 1,
    "quest-adult": QUEST_ADULT.length - 1,
    "strength": STRENGTH.length - 1,
    "scale": SCALE.length - 1,
    "wallet": WALLET.length - 1,
    "magic": MAGIC.length - 1,
    "triforce": 100,
    "skulltula": 100
};
Object.freeze(MAX_ITEM_VALUES);

function mod (num, mod) {
    return ((num % mod) + mod) % mod;
}

const ResizeFunc = function (event) {
    let inventory = event[0].target;
    let textStyle;
    Array.from(document.styleSheets[0].rules).forEach(rule => {
        if (rule.selectorText === ".item-label") {
            textStyle = rule;
        }
    });
    textStyle.style.fontSize = inventory.clientWidth / 18 + "px";
}
new ResizeObserver(ResizeFunc).observe(document.querySelector("#inventory"));

const UpdateLabel = function (item, itemType, value) {
    switch (itemType) {
        case 'deku-stick':
        case 'deku-nut':
        case 'bomb':
        case 'bow':
        case 'slingshot':
        case 'wallet':
            item.parentElement.querySelector('.count').innerText = NUMS[itemType][value];
            break;
        case 'magic-beans':
        case 'triforce':
        case 'skulltula':
            item.parentElement.querySelector('.count').innerText = value;
            break;
        default:
            break;
    }
}

document.querySelector("#inventory").oncontextmenu = () => { return false };
document.querySelectorAll("img").forEach(img => {
    img.draggable = false;
});

document.querySelectorAll("img").forEach(item => {
    let itemType = item.dataset.item;
    if (itemType === "bottle") {
        itemType = "bottle-" + item.dataset.bottle;
    }
    if (itemType === "dungeon") {
        itemType = "dungeon-" + item.dataset.dungeon;
        itemValues[itemType + '-medallion'] = 0;
    }
    let value = 0;
    switch (itemType) {
        case "wallet":
        case "dungeon-free":
            value = 1;
            break;
        default:
            break;
    }
    itemValues[itemType] = value;

    // Left Click Functionality
    item.onclick = function (event) {
        let item = event.currentTarget;
        let itemType = item.dataset.item;
        let itemName = itemType;

        if (itemType === "bottle") {
            itemName = "bottle-" + item.dataset.bottle;
        }
        if (itemType === "dungeon") {
            itemName = "dungeon-" + item.dataset.dungeon;
        }

        let maxValue = MAX_ITEM_VALUES[itemType] || 1;
        let value = mod(parseInt(item.dataset.value) + 1, maxValue + 1);

        switch (itemType) {
            case 'ocarina':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Ocarina ${OCARINA[value]}.png`;
                break;
            case '_shot':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Shot ${_SHOT[value]}.png`;
                break;
            case 'bottle':
                item.src = `img/Bottle ${BOTTLE[value]}.png`;
                break;
            case 'quest-child':
                item.src = `img/Child ${QUEST_CHILD[value]}.png`;
                break;
            case 'quest-adult':
                item.src = `img/Adult ${QUEST_ADULT[value]}.png`;
                break;
            case 'strength':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Strength ${STRENGTH[value]}.png`;
                break;
            case 'scale':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Scale ${SCALE[value]}.png`;
                break;
            case 'wallet':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Wallet ${WALLET[value]}.png`;
                break;
            case 'magic':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Magic ${MAGIC[value]}.png`;
                break;
            case 'dungeon':
                if (itemName === "dungeon-free") {
                    value = 1;
                }
                break;
            default:
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                break;
        }

        itemValues[itemName] = item.dataset.value = value;

        UpdateLabel(item, itemType, value);
    };

    // Right Click Functionality
    item.oncontextmenu = function (event) {
        let item = event.currentTarget;
        let itemType = item.dataset.item;
        let itemName = itemType;

        if (itemType === "bottle") {
            itemName = "bottle-" + item.dataset.bottle;
        }
        if (itemType === "dungeon") {
            itemName = "dungeon-" + item.dataset.dungeon;
        }

        let maxValue = MAX_ITEM_VALUES[itemType] || 1;
        let value = mod(parseInt(item.dataset.value) - 1, maxValue + 1);

        switch (itemType) {
            case 'ocarina':
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                item.src = `img/Ocarina ${OCARINA[value]}.png`;
                break;
            case '_shot':
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                item.src = `img/Shot ${_SHOT[value]}.png`;
                break;
            case 'bottle':
                item.src = `img/Bottle ${BOTTLE[value]}.png`;
                break;
            case 'quest-child':
                item.src = `img/Child ${QUEST_CHILD[value]}.png`;
                break;
            case 'quest-adult':
                item.src = `img/Adult ${QUEST_ADULT[value]}.png`;
                break;
            case 'strength':
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                item.src = `img/Strength ${STRENGTH[value]}.png`;
                break;
            case 'scale':
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                item.src = `img/Scale ${SCALE[value]}.png`;
                break;
            case 'wallet':
                value = Math.max(parseInt(item.dataset.value) - 1, 1);
                item.src = `img/Wallet ${WALLET[value]}.png`;
                break;
            case 'magic':
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                item.src = `img/Magic ${MAGIC[value]}.png`;
                break;
            case "dungeon":
                value = item.dataset.value;
                let dungeonStr = itemName + '-medallion';
                let prevMedallionValue = itemValues[dungeonStr];
                let medallionValue = mod(prevMedallionValue + 1, DUNGEON.length);

                // Prevent duplicate stone/medallions
                while (medallionValue != 0 && !DUNGEON_AVAIL.includes(medallionValue)) {
                    medallionValue = mod(medallionValue + 1, DUNGEON.length);
                }
                if (prevMedallionValue != 0) {
                    DUNGEON_AVAIL.push(prevMedallionValue);
                }
                if (medallionValue != 0) {
                    DUNGEON_AVAIL.splice(DUNGEON_AVAIL.indexOf(medallionValue), 1);
                }

                itemValues[dungeonStr] = medallionValue;
                item.src = `img/Dungeon ${DUNGEON[medallionValue]}.png`;
                break;
            default:
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                break;
        }

        itemValues[itemName] = item.dataset.value = value;

        UpdateLabel(item, itemType, value);

        return false;
    };
});