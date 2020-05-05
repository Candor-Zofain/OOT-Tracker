function CheckForLogic() {
    if (!chestAreaLogic) {
        setTimeout(CheckForLogic, 10);
    } else {
        InitLogic();
    }
};
setTimeout(CheckForLogic, 10);

let chestListElement = document.getElementById('chest-list');

function CreateChestAreaLine(chestLinesElement, area) {
    let div = document.createElement('div');
    div.className = "chest-line";

    let h2 = document.createElement('h2');
    h2.innerText = area;

    if (area === '(back)') {
        div.onclick = GoToAreaList;
    } else {
        div.onclick = () => {
            GoToChestList(area)
        };
    }

    div.appendChild(h2);
    chestLinesElement.appendChild(div);
}

function CreateChestLine(areaChestLinesElement, chestName, chest) {
    let div = document.createElement('div');
    div.className = "chest-line";

    let h2 = document.createElement('h2');
    h2.innerText = chestName;

    div.appendChild(h2);
    areaChestLinesElement.appendChild(div);
}

function GoToAreaList() {
    chestListElement.getElementsByClassName('header')[0].innerHTML = `
        <h1>Hyrule</h1>
    `;

    let chestLinesElement = document.getElementById('chest-lines');
    chestLinesElement.innerHTML = '';
    Object.keys(chestAreaLogic.chests).forEach(area => {
        CreateChestAreaLine(chestLinesElement, area);
    });
}

function GoToChestList(area) {
    chestListElement.getElementsByClassName('header')[0].innerHTML = `
        <h1>${area}</h1>
    `;

    let chestLinesElement = document.getElementById('chest-lines');
    chestLinesElement.innerHTML = '';
    CreateChestAreaLine(chestLinesElement, '(back)');

    let chests = chestAreaLogic.chests[area];
    Object.keys(chests).forEach(chestName => {
        let chest = chests[chestName];
        CreateChestLine(chestLinesElement, chestName, chest);
    })
}

let InitLogic = function () {
    // console.log(chestAreaLogic);
    GoToAreaList();
};