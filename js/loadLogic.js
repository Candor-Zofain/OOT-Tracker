var abilityLogic, areaLogic, chestLogic, glitchLogic;

function Error(str) {
    console.error("ERROR: " + str);
}

function GetLogic(file, callback) {
    var xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");
    xobj.open("GET", file, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

(async function () {
    GetLogic("/json/abilityRequirements.json", function (response) {
        abilityLogic = JSON.parse(response);
    });
    GetLogic("/json/areaRequirements.json", function (response) {
        areaLogic = JSON.parse(response);
    });
    GetLogic("/json/chestRequirements.json", function (response) {
        chestLogic = JSON.parse(response);
    });
    GetLogic("/json/glitchRequirements.json", function (response) {
        glitchLogic = JSON.parse(response);
    });
})();
