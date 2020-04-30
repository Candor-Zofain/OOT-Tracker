function CheckForLogic() {
    if (!chestAreaLogic) {
        setTimeout(CheckForLogic, 10);
    } else {
        InitLogic();
    }
};
setTimeout(CheckForLogic, 10);

let InitLogic = function () {
    console.log('logic loaded');
};