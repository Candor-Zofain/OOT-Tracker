var chestAreaLogic;

function Error(str) {
    console.error('ERROR: ' + str);
}

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

let Init = function () {
    GetChestLogic(function (response) {
        chestAreaLogic = JSON.parse(response);
    });
};
Init();