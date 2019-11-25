define(function(require, exports, module) {
    "use strict";

    // Brackets modules
    var EditorManager = brackets.getModule("editor/EditorManager"),
        AppInit = brackets.getModule("utils/AppInit"),
        MainViewManager = brackets.getModule("view/MainViewManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    
    var tagRegExp = new RegExp(/^[a-z\-]+[1-6]*$/);

    var modelProperties = [
        "actsAs",
        "belongsTo", 
        "hasAndBelongsToMany",
        "hasMany", 
        "hasOne",
        "validate", 
        "validationErrors", 			
        "recursive", 
        "cacheQueries", 
        "name",
        "id", 
        "primaryKey", 
        "displayField",			
        "useTable",
        "useDbConfig", 
        "_tableInfo"
    ];
    var modelPropertiesRegExp = new RegExp("(\\$startModelProperties|\\$" + modelProperties.join('|\\$') + "|\\$endModelProperties)","g");

    var modelMethods = [
        "bindModel",
        "unbindModel",
        "loadModel",
        "create", 
        "clear",
        "set",
        "delete",
        "deleteAll",
        "updateAll",
        "escapeField", 
        "execute",
        "exists", 
        "find", 			
        "findAll", 
        "findAllThreaded", 
        "findCount",
        "findNeighbours", 
        "generateList", 
        "getAffectedRows",			
        "getColumnType",
        "getColumnTypes", 
        "getDisplayField",			
        "getId", 
        "getNumRows", 
        "hasAny",
        "hasField", 
        "invalidate", 
        "invalidFields",			
        "isForeignKey",
        "loadInfo",			
        "query", 
        "read", 
        "write",
        "remove",
        "save", 
        "saveField", 
        "saveAssociated",		
        "setDataSource",
        "setSource", 
        "validate",
        "validateData",
        "validateFields",
        "validates"
    ];
    var modelMethodsRegExp = new RegExp("(startModelMethodes|" + modelMethods.join('|') + "|endModelMethods)","g");

    var modelCallbacks = [
        "beforeSave",
        "afterSave",
        "beforeDelete",
        "afterDelete",
        "beforeFind",
        "afterFind",
        "beforeValidate",
        "afterValidate",
        "onError"
    ];
    var modelCallbacksRegExp = new RegExp("(startModelCallbacks|" + modelCallbacks.join('|') + "|endModelCallbacks)","g");

    var ctrlMethods = [
        "cleanUpFields",
        "constructClasses",
        "flash",
        "FlashOut", 
        "generateFieldNames",
        "PostConditions",
        "redirect",
        "referer",
        "render", 
        "element",
        "autoRender", 
        "viewClass",
        "viewPath"
    ];
    var ctrlMethodsRegExp = new RegExp("(startCtrlMethodes|" + ctrlMethods.join('|') + "|endCtrlMethods)","g");

    var ctrlCallbacks = [
        "__construct",
        "initialize",
        "startup",
        "beforeFilter",
        "beforeRender",
        "afterFilter"
    ];
    var ctrlCallbacksRegExp = new RegExp("(startCtrlCallbacks|" + ctrlCallbacks.join('|') + "|endCtrlCallbacks)","g");

    var others = [
        "controller",
        "request",
        "Auth",
        "allow", 
        "deny", 
        "error",
        "success",
        "this"
    ];
    var othersRegExp = new RegExp("(startOthers|" + others.join('|') + "|endOthers)","g");

    var components = [
        "Acl",
        "Auth",
        "Cookie",
        "Session",
        "Flash",			
        "Paginator",
        "Email",
        "RequestHandler",
        "Security",
        "Mail", // Start add your own components below
        "Pagination",
        "Json",
        "Account",
        "Logged",
        "Activity",
        "Application",
        "Emojione",
        "Bot",
        "Firebase",
        "Verification",
        "Password",
        "Node",
        "Token",
        "Integer",
        "Widget"
    ];
    var componentsRegExp = new RegExp("(startOthers|" + components.join('|') + "|endOthers)","g");

    // Dirty method to avoid running when its not necessary.
    var ignore = [
        "ignore",
        "ignoreClasses",
        "html",
        "elm",
        "cm",
        "cmMode",
        "variable",
        "cmVariables",
        "RegExp",
        "components",
        "Array",
        "console",
        "EditorManager",
        "editor",
        "MODES",
        "overlay",
        "tag_color_change",
        "AppInit",
        "MainViewManager",
        "updateUI",
        "ExtensionUtils",
        "module",
        "modelPropertiesRegExp",
        "modelMethodsRegExp",
        "modelCallbacksRegExp",
        "ctrlMethodsRegExp",
        "ctrlCallbacksRegExp",
        "componentsRegExp",
        "othersRegExp"
    ];

    var ignoreClasses = [
        "cm-jquery",
        "cm-angular",
        "cm-javascript"           
    ];

    function tag_color_change() {        
        var cmVariables = document.getElementById("editor-holder").querySelectorAll(".cm-variable:not(.cm-cakephp), .cm-variable-1:not(.cm-cakephp), .cm-variable-2:not(.cm-cakephp), .cm-variable-3:not(.cm-cakephp)");

        Array.prototype.forEach.call(cmVariables, function(elm) {
            var html = elm.innerHTML;
            html = html.replace(/^(#|\.)/, "");
            html = html.replace(/['"]+/g, "");
            
            // Dirty method to avoid running when its not necessary.
            if (ignore.indexOf(html) !== -1) {  
                return;
            }
            
            // Dirty method to avoid running when its not necessary.
            if (ignoreClasses.indexOf(elm.classList) !== -1) {  
                return;
            }
            
            if (modelPropertiesRegExp.test(html)) {
                var variable = html.replace("$", "");
                elm.classList.add("cm-dreamweaver-cakephp-model-properties-" + variable, "cm-cakephp");
            } 
            else if (modelMethodsRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-model-methods-" + html, "cm-cakephp");
            } 
            else if (modelCallbacksRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-model-callbacks-" + html, "cm-cakephp");
            }			
			else if (ctrlMethodsRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-controller-methods-" + html, "cm-cakephp");
            }			
			else if (ctrlCallbacksRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-controller-callbacks-" + html, "cm-cakephp");
            }			
			else if (componentsRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-components-" + html, "cm-cakephp");
            }            
            else if (othersRegExp.test(html)) {
                var variable = html.replace("this", "string-this").replace("$", "");
                elm.classList.add("cm-dreamweaver-cakephp-others-" + variable, "cm-cakephp");
            } else if (othersRegExp.test(html.replace("$", ""))) {
                // Another dirty hack to make it workable...
                var variable = html.replace("this", "string-this").replace("$", "");
                elm.classList.add("cm-dreamweaver-cakephp-others-" + variable, "cm-cakephp"); 
            }
        });
        
    }

    // Constants
    var MODES = ["php", "text/x-brackets-php", "application/x-httpd-php"];
    function updateUI() {
        var editor = EditorManager.getCurrentFullEditor();
        if(!editor){
            return;
        }
        
        var cm = editor._codeMirror,
            cmMode;

        // Only apply the overlay in a mode that *might* contain Javascript
        cmMode = cm.options.mode;

        if ((typeof cmMode) !== "string") {
            cmMode = cm.options.mode.name;
        }

        if (MODES.indexOf(cmMode) !== -1) {
            cm.on("update", tag_color_change);
        }
    }

    // Initialize extension
    AppInit.appReady(function() {
        MainViewManager.on("currentFileChange", updateUI);
        ExtensionUtils.loadStyleSheet(module, "main.less");
    });
});