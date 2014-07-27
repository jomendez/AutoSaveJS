var dataService = function () {
    var $errorModal = $("#errorModal"); //This is the ID of the bootstrap modal popup

    //Sends data to server via a post request.  Sends to a Web API.
    var post = function (url, data) {
        var options = {
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
        };
        return sendRequest(url, options, data);
    }

    //Performs a get request
    var get = function (url, data) {
        var options = {
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
        };
        return sendRequest(url, options, data);
    };

    var del = function (url, data) {
        var options = {
            type: 'DELETE',
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
        };
        return sendRequest(url, options, data);
    }

    //Fetches/pushes data to any code behind method decorated with [WebMethod] and set as static.
    var codeBehind = function (url, data) {
        //Separates the weird stuff you have to do to fetch data from a code behind.
        var optionsForCodeBehind = {
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
        };

        optionsForCodeBehind.url = url;
        if (data) optionsForCodeBehind.data = JSON.stringify(data);
        return $.ajax(optionsForCodeBehind);
    }

    function sendRequest(url, options, data) {
        var isErrorLogRequest = !!(options.isErrorLogRequest);

        if (!url) {
            throw ('Argument "url" is required');
        }

        if (!options) {
            throw ('Argument "options" is required');
        }

        options.url = url;

        if (data) {
            options.data = data;
        }

        var defferred = $.ajax(options);
        var successfulRequest = true;
        defferred.fail(function (response) {
            successfulRequest = false;
            handleRequestFailure(response, isErrorLogRequest);
        });

        //if request was successful, reset auth timeout.
        //this part is in case you implemet authorization for the web APIs, to extend the Authorization time
        if (successfulRequest) {
            var isInitialized = false;//this is mock up, you need to change this fro you own code
            if (isInitialized) {
                restartAuthTimeout();//this are custom methods
            }
        }

        return defferred;
    }

    function handleRequestFailure(response, isErrorLogRequest) {
        switch (response.status) {
            //Not Authorized
            case 401:
                handleAuthTimeout();
                break;
                //Bad Gateway (usually bad connection)
            case 502:
                showError(response, function () {
                    redirectToLogin();
                });
                break;
            default:
                showError(response, function () {
                    redirectToLogin();
                });

                //Only log error if the request wasn't to log an error.  Prevents infinite loop of error logging.
                if (!isErrorLogRequest) {
                    logError(response);
                }

                break;
        }
    };

    //this conform the bootstrap popup contain
    function showError(response, onOkClicked) {
        //create a detailed error message and show error
        var technicalError = createErrorMessage(response);
        var technicalErrorElement = '<small>' + technicalError + '</small>';

        var $errorBody = $errorModal.find('.modal-body');
        $errorBody.append(technicalErrorElement);
        $errorModal.modal("show");

        //handle "close" button click
        $('#closeModal').bind('click.requestError', function () {
            $("#errorModal").modal("hide");
            $('#closeModal').unbind('click.requestError');
            onOkClicked();//callback
        });
    }

    function createErrorMessage(response) {
        var errorMessage = 'Technical Details:'
            + '  Status: ' + response.status.toString()
            + '  Status Text: ' + response.statusText
            + '  Response Text: ' + response.responseText;

        return errorMessage;
    }

    function logError(response) {
        var error = createErrorMessage(response);

        //sendRequest('api/Notification/logJsError', { type: 'POST', isErrorLogRequest: true }, { error: error });
    }

    function redirectToLogin() {
        //here you should call the code that log you out
        window.location.href = "Login.aspx";
    }

    return {//revealed pattern
        post: post,
        get: get,
        del: del,
        codeBehind: codeBehind
    }
}();



/*
//example of use
var db = dataService;
var api = '/api/employee/';
var data = {};
db.post(api + 'getPage', data).done(function (data) {
   
    if (data) {
       //if data is reeturned from the web api
    }

});
*/

/*
This code is a wrap layer useful for capture and display errors early when you work with web apis, and something fails in the AJAX call, and also to extend the auth time
every time an AJAX call is made, you can use it as boilerplate to build your own. This class used the revealed pattern.
The libraries needed for this class to work correctly are JQuery and Bootstrap.

//example of modal popup (you have to include a reference to bootstrap library)
 <div id="errorModal" class="modal hide fade" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h3 id="H8">Error</h3>
                </div>
                <div class="modal-body">
                    <p>
                        Oooops... Something went wrong
                    </p>
                    <small class="error-technical-details"></small>
                </div>
                <div class="modal-footer">
                    <button id="logYouOutByJsError" class="btn btn-danger" data-dismiss="modal" aria-hidden="true">Accept</button>
                </div>
            </div>
*/
