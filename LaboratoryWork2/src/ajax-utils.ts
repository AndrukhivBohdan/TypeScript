(function(global:Window & typeof globalThis ){
    const ajaxUtils = {
        sendGetRequest:{}
    };

    function getRequestObject(){
        if(global.XMLHttpRequest){
            return new XMLHttpRequest();
        }else{
            global.alert("Error");
            return null;
        }
    }

    ajaxUtils.sendGetRequest= function(requestUrl:URL,responseHandler:any,isJsonResponse:boolean):boolean{
        let request = getRequestObject();
        if(request === null) throw new Error("помилка");
        request.onreadystatechange = function(){
            handleResponse(request, responseHandler, isJsonResponse);
        }
        request.open("GET", requestUrl, true);
        request.send(null);
        return true;
    }
    function handleResponse(request: XMLHttpRequest, responseHandler:any, isJsonResponse:boolean){
        if(request.readyState == 4){
            if(request.status == 200){
                if(isJsonResponse == undefined){
                    isJsonResponse = true;
                }
                if(isJsonResponse){
                    responseHandler(JSON.parse(request.responseText));
                }else{
                    responseHandler(request.responseText);
                }
            }else{
                console.error("Помилка запиту:", request.status, request.responseText)
            }
        }
    }
    (global as any).$ajaxUtils = ajaxUtils;
})(window)