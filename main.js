define(function(require, exports, module) {
    "use strict";

    // Brackets modules
    var EditorManager = brackets.getModule("editor/EditorManager"),
        AppInit = brackets.getModule("utils/AppInit"),
        MainViewManager = brackets.getModule("view/MainViewManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

    var tagRegExp = new RegExp(/^[a-z\-]+[1-6]*$/);

    var overlay = {
        token: function(stream/*, state*/) {
            var arr;
            arr = stream.match(/<(\/|)([a-z\-]+[1-6]*)(|(.*?)[^?%\-$])>/);
            if (arr && tagRegExp.test(arr[2])) {
                return "dreamweaver-cakephp-tag-" + arr[2].toUpperCase();
            }
            while (stream.next() != null && !stream.match(/<(\/|)|(\/|)>/, false)) {}
            return null;
        }
    };
	
	function getValsWrappedIn(str, vars) {
		var rg = new RegExp("(\\$starthack|\\$" + vars + "|\\$endhack)","g"); 
		return str.match(rg);
	}

    function tag_color_change() {        
        var cmVariables = document.getElementById("editor-holder").querySelectorAll(".cm-variable, .cm-variable-1, .cm-variable-2, .cm-variable-3");
		
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
			"remove",
			"save", 
			"saveField", 
			"saveAssociated",		
			"setDataSource",
			"setSource", 
			"validate",
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
		
		var controllerMethods = [
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
		var controllerMethodsRegExp = new RegExp("(startControllerMethodes|" + controllerMethods.join('|') + "|endControllerMethods)","g");
		
		var controllerCallbacks = [
			"__construct",
			"initialize",
			"startup",
			"beforeFilter",
			"beforeRender",
			"afterFilter"
		];
        var controllerCallbacksRegExp = new RegExp("(startControllerCallbacks|" + controllerCallbacks.join('|') + "|endControllerCallbacks)","g");
		
		var others = [
			"controller",
			"request",
			"Auth",
			"error",
			"success"
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
			"Json",
			"Account",
			"Logged",
			"Activity",
			"Application",
			"Emojione"
		];
        var componentsRegExp = new RegExp("(startOthers|" + components.join('|') + "|endOthers)","g");

        Array.prototype.forEach.call(cmVariables, function(elm) {
            var html = elm.innerHTML;
		
            html = html.replace(/^(#|\.)/, "");

            if (modelPropertiesRegExp.test(html)) {
                var variable = html.replace("$", "");
                elm.classList.add("cm-dreamweaver-cakephp-model-properties-" + variable);
            }		
		
            if (modelMethodsRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-model-methods-" + html);
            }
			
			if (modelCallbacksRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-model-callbacks-" + html);
            }
			
			if (controllerMethodsRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-controller-methods-" + html);
            }
			
			if (controllerCallbacksRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-controller-callbacks-" + html);
            }
			
			if (componentsRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-components-" + html);
            }
			
			if (othersRegExp.test(html)) {
                elm.classList.add("cm-dreamweaver-cakephp-others-" + html);
            }
        });
        
    }

    function updateUI() {
        var editor = EditorManager.getCurrentFullEditor();
        if(!editor){
            return;
        }
        var cm = editor._codeMirror;
        cm.removeOverlay(overlay);
        cm.addOverlay(overlay);
        cm.on("update", tag_color_change);
    }

    // Initialize extension
    AppInit.appReady(function() {
        MainViewManager.on("currentFileChange", updateUI);
        ExtensionUtils.loadStyleSheet(module, "main.less");
    });
});