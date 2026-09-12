/* =====================================
   GET ELEMENTS
===================================== */

const app =
    document.getElementById("app");

const powerBtn =
    document.getElementById("powerBtn");

const status =
    document.getElementById("status");

const overlay =
    document.getElementById("overlay");

const payScreen =
    document.getElementById("payScreen");

const paying =
    document.getElementById("paying");

const reveal =
    document.getElementById("reveal");

const payBtn =
    document.getElementById("payBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const payOptions =
    document.querySelectorAll(".pay-opt");


/* =====================================
   TORCH STATE
===================================== */

let isOn = false;


/* =====================================
   SCREEN WAKE LOCK
===================================== */

let wakeLock = null;


/* =====================================
   DEFAULT PAYMENT METHOD
===================================== */

payOptions[0].classList.add(
    "selected"
);


/* =====================================
   PAYMENT METHOD SELECTION
===================================== */

payOptions.forEach(function (option) {

    option.addEventListener(

        "click",

        function () {

            payOptions.forEach(function (item) {

                item.classList.remove(
                    "selected"
                );

            });

            option.classList.add(
                "selected"
            );

        }

    );

});


/* =====================================
   ENTER FULLSCREEN
===================================== */

async function enterFullscreen() {

    try {

        if (!document.fullscreenElement) {

            await document.documentElement.requestFullscreen();

        }

    }

    catch (error) {

        console.log(
            "Fullscreen was denied or is unavailable."
        );

    }

}


/* =====================================
   EXIT FULLSCREEN
===================================== */

async function exitFullscreen() {

    try {

        if (document.fullscreenElement) {

            await document.exitFullscreen();

        }

    }

    catch (error) {

        console.log(
            "Could not exit fullscreen."
        );

    }

}


/* =====================================
   REQUEST SCREEN WAKE LOCK
===================================== */

async function requestWakeLock() {

    try {

        if ("wakeLock" in navigator) {

            wakeLock =
                await navigator.wakeLock.request(
                    "screen"
                );

        }

    }

    catch (error) {

        console.log(
            "Wake Lock is unavailable."
        );

    }

}


/* =====================================
   RELEASE SCREEN WAKE LOCK
===================================== */

async function releaseWakeLock() {

    if (wakeLock !== null) {

        try {

            await wakeLock.release();

        }

        catch (error) {

            console.log(
                "Could not release Wake Lock."
            );

        }

        wakeLock = null;

    }

}


/* =====================================
   TURN FLASHLIGHT ON
===================================== */

async function turnOnFlashlight() {

    isOn = true;

    app.classList.add(
        "on"
    );

    status.textContent =
        "TAP TO TURN OFF";


    await enterFullscreen();

    await requestWakeLock();

}


/* =====================================
   TURN FLASHLIGHT OFF
===================================== */

async function turnOffFlashlight() {

    isOn = false;

    app.classList.remove(
        "on"
    );

    status.textContent =
        "TAP TO IGNITE";


    await releaseWakeLock();

    await exitFullscreen();

}


/* =====================================
   POWER BUTTON
===================================== */

powerBtn.addEventListener(

    "click",

    async function () {

        if (isOn === false) {

            await turnOnFlashlight();

        }

        else {

            showPaymentPopup();

        }

    }

);


/* =====================================
   SHOW PAYMENT POPUP
===================================== */

function showPaymentPopup() {

    payScreen.style.display =
        "block";

    paying.style.display =
        "none";

    reveal.style.display =
        "none";

    overlay.classList.add(
        "show"
    );

}


/* =====================================
   HIDE PAYMENT POPUP
===================================== */

function hidePopup() {

    overlay.classList.remove(
        "show"
    );

}


/* =====================================
   FAKE PAYMENT
===================================== */

payBtn.addEventListener(

    "click",

    function () {

        payScreen.style.display =
            "none";

        paying.style.display =
            "block";


        setTimeout(

            function () {

                paying.style.display =
                    "none";

                reveal.style.display =
                    "block";

            },

            1500

        );

    }

);


/* =====================================
   CANCEL PAYMENT

   IMPORTANT:

   Cancel only closes the popup.

   The flashlight remains ON.
   The white screen remains ON.
   Fullscreen remains active.
   Wake Lock remains active.
===================================== */

cancelBtn.addEventListener(

    "click",

    function () {

        hidePopup();

    }

);


/* =====================================
   WAKE LOCK RECOVERY
===================================== */

document.addEventListener(

    "visibilitychange",

    async function () {

        if (

            isOn === true &&

            document.visibilityState ===
            "visible"

        ) {

            await requestWakeLock();

        }

    }

);