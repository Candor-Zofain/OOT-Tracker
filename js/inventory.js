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

const IMAGES = {
    "ocarina": [
        'Fairy',
        'Fairy',
        'of Time'
    ],
    "_shot": [
        'Hookshot',
        'Hookshot',
        'Longshot'
    ],
    "scale": [
        'Silver',
        'Silver',
        'Gold'
    ],
    "bottle": [
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
    ],
    "quest_child": [
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
    ],
    "quest_adult": [
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
    ],
    "strength": [
        'Goron Bracelet',
        'Goron Bracelet',
        'Gauntlets Silver',
        'Gauntlets Golden'
    ],
    "wallet": [
        "Default",
        "Default",
        "Adult's",
        "Giant's",
        "Giant's"
    ],
    "magic": [
        'Small',
        'Small',
        'Large'
    ],
    "dungeon": [
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
    ]
};
Object.freeze(IMAGES);

const DUNGEON_AVAIL = Array.from({
    length: IMAGES.dungeon.length - 1
}, (_, index) => index + 1);

const MAX_ITEM_VALUES = {
    "deku-stick": 3,
    "deku-nut": 3,
    "bomb": 3,
    "bow": 3,
    "slingshot": 3,
    "ocarina": IMAGES.ocarina.length - 1,
    "_shot": IMAGES._shot.length - 1,
    "bean": 10,
    "bottle-1": IMAGES.bottle.length - 1,
    "bottle-2": IMAGES.bottle.length - 1,
    "bottle-3": IMAGES.bottle.length - 1,
    "bottle-4": IMAGES.bottle.length - 1,
    "quest-child": IMAGES.quest_child.length - 1,
    "quest-adult": IMAGES.quest_adult.length - 1,
    "strength": IMAGES.strength.length - 1,
    "scale": IMAGES.scale.length - 1,
    "wallet": IMAGES.wallet.length - 1,
    "magic": IMAGES.magic.length - 1,
    "triforce": 100,
    "skulltula": 100,
    "ice-trap": 100,
    "key-forest-small": 5,
    "key-fire-small": 8,
    "key-water-small": 6,
    "key-spirit-small": 5,
    "key-shadow-small": 5,
    "key-gtg-small": 9,
    "key-gf-small": 4,
    "key-ganon-small": 2,
    "key-botw-small": 3
};
// Object.freeze(MAX_ITEM_VALUES);

const DEFAULT_COLOR = "white";
const MAX_COLOR = "lime";

function mod(num, mod) {
    return ((num % mod) + mod) % mod;
}

// let itemLabelStyle;
// Array.from(document.styleSheets).forEach(styleSheet => {
//     if (styleSheet.href.includes('inventory.css')) {
//         Array.from(styleSheet.rules).forEach(rule => {
//             if (rule.selectorText === ".item-label") {
//                 itemLabelStyle = rule;
//             }
//         });
//     }
// });
// const ResizeFunc = function (event) {
//     let inventory = event[0].target;
//     itemLabelStyle.style.fontSize = inventory.clientWidth / 18 + "px";
// }
// new ResizeObserver(ResizeFunc).observe(document.querySelector("#inventory"));

const UpdateLabel = function (item, itemIdSplits, itemId, value) {
    let count;
    if (itemIdSplits[0] === 'deku' || itemIdSplits[0] === 'bomb' || itemIdSplits[0] === 'bow' || itemIdSplits[0] === 'slingshot') {
        count = item.parentElement.querySelector('.count')
        count.innerText = NUMS[itemId][value];
        if (value === MAX_ITEM_VALUES[itemId]) {
            count.style.color = MAX_COLOR;
        } else {
            count.style.color = DEFAULT_COLOR;
        }
    } else if (itemIdSplits[0] === 'wallet') {
        count = item.parentElement.querySelector('.count')
        count.innerText = NUMS[itemId][value];
        if (value >= MAX_ITEM_VALUES[itemId] - 1) {
            count.style.color = MAX_COLOR;
        } else {
            count.style.color = DEFAULT_COLOR;
        }
    } else if (itemIdSplits[0] === 'bean' || itemIdSplits[0] === 'triforce' || itemIdSplits[0] === 'skulltula' || (itemIdSplits[0] === 'key' && itemIdSplits[2] === 'small')) {
        count = item.parentElement.querySelector('.count')
        count.innerText = value;
        if (value === MAX_ITEM_VALUES[itemId]) {
            count.style.color = MAX_COLOR;
        } else {
            count.style.color = DEFAULT_COLOR;
        }
    } else if (itemIdSplits[0] === 'ice') {
        count = item.parentElement.querySelector('.count');
        count.innerText = value;
    }
}

document.querySelector("#inventory").oncontextmenu = () => {
    return false;
};
document.querySelectorAll("img").forEach(img => {
    img.draggable = false;
});

let rowNum = 1;
let rows = document.querySelectorAll('#inventory tr');
for (let i = 0; i < rows.length; i++) {
    rows[i].id = 'row-' + rowNum;
    rowNum++;
}

document.querySelectorAll("img").forEach(item => {
    let itemIdSplits = item.id.split('-');
    if (itemIdSplits[0] === "dungeon") {
        itemValues[itemIdSplits[1] + '-medallion'] = 0;
    }
    let value = 0;
    if (itemIdSplits[0] === "wallet" || (itemIdSplits[0] === 'dungeon' && itemIdSplits[1] === 'free')) {
        value = 1;
    }
    itemValues[itemIdSplits.join('-')] = value;

    // Left Click Functionality
    item.onclick = function (event) {
        let item = event.currentTarget;
        let itemIdSplits = item.id.split('-');
        let itemId = item.id;

        let maxValue = MAX_ITEM_VALUES[itemId] || 1;
        let value = mod(parseInt(item.dataset.value) + 1, maxValue + 1);

        switch (itemIdSplits[0]) {
            case 'ocarina':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Ocarina ${IMAGES.ocarina[value]}.png`;
                break;
            case '_shot':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Shot ${IMAGES._shot[value]}.png`;
                break;
            case 'bottle':
                item.src = `img/Bottle ${IMAGES.bottle[value]}.png`;
                break;
            case 'quest':
                if (itemIdSplits[1] === "child") {
                    item.src = `img/Child ${IMAGES.quest_child[value]}.png`;
                } else {
                    item.src = `img/Adult ${IMAGES.quest_adult[value]}.png`;
                }
                break;
            case 'strength':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Strength ${IMAGES.strength[value]}.png`;
                break;
            case 'scale':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Scale ${IMAGES.scale[value]}.png`;
                break;
            case 'wallet':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Wallet ${IMAGES.wallet[value]}.png`;
                break;
            case 'magic':
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                item.src = `img/Magic ${IMAGES.magic[value]}.png`;
                break;
            case 'dungeon':
                if (itemId === "dungeon-free") {
                    return;
                }
                break;
            case 'tunic':
            case 'boots':
                if (itemIdSplits[1] === 'kokiri') {
                    return;
                }
                break;
            case 'go':
                return;
                break;
            default:
                value = Math.min(parseInt(item.dataset.value) + 1, maxValue);
                break;
        }

        itemValues[itemId] = item.dataset.value = value;

        UpdateLabel(item, itemIdSplits, itemId, value);
    };

    // Right Click Functionality
    item.oncontextmenu = function (event) {
        let item = event.currentTarget;
        let itemIdSplits = item.id.split('-');
        let itemId = item.id;

        let maxValue = MAX_ITEM_VALUES[itemId] || 1;
        let value = mod(parseInt(item.dataset.value) - 1, maxValue + 1);

        switch (itemIdSplits[0]) {
            case 'ocarina':
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                item.src = `img/Ocarina ${IMAGES.ocarina[value]}.png`;
                break;
            case '_shot':
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                item.src = `img/Shot ${IMAGES._shot[value]}.png`;
                break;
            case 'bottle':
                item.src = `img/Bottle ${IMAGES.bottle[value]}.png`;
                break;
            case 'quest':
                if (itemIdSplits[1] === "child") {
                    item.src = `img/Child ${IMAGES.quest_child[value]}.png`;
                } else {
                    item.src = `img/Adult ${IMAGES.quest_adult[value]}.png`;
                }
                break;
            case 'strength':
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                item.src = `img/Strength ${IMAGES.strength[value]}.png`;
                break;
            case 'scale':
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                item.src = `img/Scale ${IMAGES.scale[value]}.png`;
                break;
            case 'wallet':
                value = Math.max(parseInt(item.dataset.value) - 1, 1);
                item.src = `img/Wallet ${IMAGES.wallet[value]}.png`;
                break;
            case 'magic':
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                item.src = `img/Magic ${IMAGES.magic[value]}.png`;
                break;
            case "dungeon":
                value = item.dataset.value;
                let dungeonStr = itemIdSplits[1] + '-medallion';
                let prevMedallionValue = itemValues[dungeonStr];
                let medallionValue = mod(prevMedallionValue + 1, IMAGES.dungeon.length);

                // Prevent duplicate stone/medallions
                while (medallionValue != 0 && !DUNGEON_AVAIL.includes(medallionValue)) {
                    medallionValue = mod(medallionValue + 1, IMAGES.dungeon.length);
                }
                if (prevMedallionValue != 0) {
                    DUNGEON_AVAIL.push(prevMedallionValue);
                }
                if (medallionValue != 0) {
                    DUNGEON_AVAIL.splice(DUNGEON_AVAIL.indexOf(medallionValue), 1);
                }

                itemValues[dungeonStr] = medallionValue;
                item.src = `img/Dungeon ${IMAGES.dungeon[medallionValue]}.png`;
                break;
            case 'tunic':
            case 'boots':
                if (itemIdSplits[1] === 'kokiri') {
                    return;
                }
                break;
            case 'go':
                return;
                break;
            default:
                value = Math.max(parseInt(item.dataset.value) - 1, 0);
                break;
        }

        itemValues[itemId] = item.dataset.value = value;

        UpdateLabel(item, itemIdSplits, itemId, value);

        return false;
    };
});