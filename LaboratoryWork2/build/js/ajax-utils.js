"use strict";
(function (global) {
    const ajaxUtils = {
        sendGetRequest: {}
    };
    function getRequestObject() {
        if (global.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
        else {
            global.alert("Error");
            return null;
        }
    }
    ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
        let request = getRequestObject();
        if (request === null)
            throw new Error("помилка");
        request.onreadystatechange = function () {
            handleResponse(request, responseHandler, isJsonResponse);
        };
        request.open("GET", requestUrl, true);
        request.send(null);
        return true;
    };
    function handleResponse(request, responseHandler, isJsonResponse) {
        if (request.readyState == 4) {
            if (request.status == 200) {
                if (isJsonResponse == undefined) {
                    isJsonResponse = true;
                }
                if (isJsonResponse) {
                    responseHandler(JSON.parse(request.responseText));
                }
                else {
                    responseHandler(request.responseText);
                }
            }
            else {
                console.error("Помилка запиту:", request.status, request.responseText);
            }
        }
    }
    global.$ajaxUtils = ajaxUtils;
})(window);
