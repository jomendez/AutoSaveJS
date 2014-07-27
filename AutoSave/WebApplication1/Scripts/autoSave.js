'use strict'

var autoSaveComments = function (selector, options) {
    var obj = {};
    var db = dataService;

    var init = function () {
        checkConstraints();

        //if saveUrl doesn't have a / on the end, add one
        if (options.saveUrl && options.saveUrl[options.saveUrl.length - 1] !== '/') {
            options.saveUrl += '/';
        }

        setEvents();
    };

    var checkConstraints = function () {
        throwIfUndefined(options, 'option');
        throwIfUndefined(options.savingText, 'savingText');
        throwIfUndefined(options.savedText, 'savedText');
        throwIfUndefined(options.label, '.label');


        if (typeof options.saveFunc != 'function' && typeof options.saveUrl == 'undefined') {
            throw ('options.saveFunc must be a function or options.saveUrl must be set');
        }

        if (options.saveFunc && options.saveUrl) {
            throw ('options.saveFunc and options.saveUrl cannot both be set');
        }
    };

    var setEvents = function () {
        var keyUpTimeout = null;

        //on blur, save manager monitor overall comments
        $(document).on('blur', selector, function (e) {
            var $this = $(this);

            //clear timeout created from keyup delay event handler
            if (keyUpTimeout !== null) {
                clearTimeout(keyUpTimeout);
            }

            var id = 1; //selectedId();

            save($this, id);
        });

        //on keyup, save manager monitor overall comments after a two second pause from typing
        $(document).on('keyup', selector, function (e) {
            var $this = $(this);

            showFeedbackText(options.label, options.savingText);

            //clear timeout set from last keyup
            if (keyUpTimeout !== null) {
                clearTimeout(keyUpTimeout);
            }

            //get the if, if necessary
            var id = 1; //selectedId();

            keyUpTimeout = setTimeout(function () {
                save($this, id);
            }, 2000);

        });

    };


    var save = function ($element, id) {
        if ($element.length !== 1) {
            throw ('$element must have a length of 1');
        }

        //if a save function has been set, call it instead of this "default" save function
        if (options.saveFunc) {
            options.saveFunc($element, function () {
                showFeedbackText(options.label, options.savedText);
            })
            return;
        }

        var comments = $element.val();

       
        //save
        db.post(options.saveUrl, "{ textToSave: '"+ comments +"'}")
            .done(function (data) {
                showFeedbackText(options.label, options.savedText);
            });
    };

    var showFeedbackText = function ($element, text) {
        $element = $($element);
        if ($element.length !== 1) {
            throw ('$element must have a length of 1');
        }
        var savedText = text;
        $element.html(savedText);
    };


    //var showSaving = function ($element) {
    //    $element = $($element);
    //    if ($element.length !== 1) {
    //        throw ('$element must have a length of 1');
    //    }
    //    var savingText = options.savingText;
    //        $element.html(savingText);
        
    //};

    var throwIfUndefined = function (val, name) {
        if (typeof val === 'undefined') {
            throw ('Object "' + name + '" must be defined');
        }
    }

    obj.hideSaved = function (defaultText) {
      
        $(selector).html(defaultText);
    };

    obj.val = function (val) {
        if (typeof val != 'undefined') {
            $(selector).val(val);
        }

        return $(selector).val();
    };

    init();

    return obj;
};

//How to set html elements to "autosave"
$(function () {
    //Example of comments using web api Url
    var Comments = autoSaveComments('#commentsTA',
        {
            saveUrl: 'api/Savetext/AutoSaveText',
            savingText: 'Saving...',
            savedText: 'Saved!',
            label: '.label'
        }
    );
   

    //Example of comments using a callback function
    //var CommentsWithFunc = autoSaveComments('#commentsTA',
    //    {
    //        saveFunc: function (parameter1, parameter2) {
    //           //do something E.g. Implement a web API call
    //        },
    //    savingText: 'Saving...',
    //    savedText: 'Saved!',
    //    label: '.label'
    //    }
    //);

});



