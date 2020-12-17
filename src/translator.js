/**
 * Translator
 * super simple translation handling. Manages strings mapped by labels
 * for easy translations.
 */

define([
    'sprintf-js'
], function( sprintfjs ) {

    var p = Translator.prototype;

    /**
     *
     * @constructor
     * @param textbooklet
     */
    function Translator( textbooklet ) {
        this.textbooklet = textbooklet;
        this.locale = "";
        this.variables = {};
        this.variableRegex = /(\{\$[a-zA-Z0-9_-]+\})/g;
    }


    /**
     *
     * @param {json} b
     */
    p.setBooklet = function( b ) {
        this.textbooklet = b;
    }


    /**
     *
     * @param {string} l
     */
    p.setLocale = function( l ) {
        this.locale = l;
    }


    /**
     *
     * @returns {string|string|*}
     */
    p.getLocale = function( ) {
        return this.locale;
    }


    /**
     * define a variable that will be replaced with value
     * if it occurs in the text. In Text the variable is
     * marked like: {$key}.
     *
     * @param key
     * @param value
     */
    p.setVariable = function( key, value ) {
        this.variables[key] = value;
    }


    /**
     * get the value of a variable.
     * @param key
     * @returns {*}
     */
    p.getVariable = function( key ) {
        return this.variables[key];
    }


    /**
     * set a new label in the textbooklet (or override an existing one)
     * this lets you dynamically set or cahnge labels
     * @param labelId
     * @param value
     * @param locale
     */
    p.setLabel = function( labelId, value, locale ) {
        if( !this.textbooklet ) this.textbooklet = {};
        if( !this.textbooklet[locale] ) this.textbooklet[locale] = {};

        this.textbooklet[locale][labelId] = value;
    }

    /**
     * create an JS-object that contains all labels of the soucreLanguage.
     * If the targetLanguage already exists, only the missing labels are added.
     * The resulting object can be pasted into the textbooklet.
     * @param sourceLanguage
     * @param targetLanguage
     */
    p.exportTranslation = function ( sourceLanguage, targetLanguage) {
        var sourceBooklet = this.textbooklet[sourceLanguage];
        var targetBooklet = this.textbooklet[targetLanguage];
        var resultingBooklet = {};

        for (var label in sourceBooklet) {
            if( targetBooklet && targetBooklet[label] ) resultingBooklet[label] = targetBooklet[label];
            else {
                resultingBooklet[label] = "translate to "+targetLanguage+": "+sourceBooklet[label];
            }
        }
        return resultingBooklet;
    }


    p._replaceVariables = function( inputTxt ) {
        var result = inputTxt;
        var variableKey = "";
        var m = inputTxt.match(this.variableRegex);
        if(m) {
            for (var i = 0, len = m.length; i < len; i++) {
                variableKey = m[i].substring(2, m[i].length-1);
                var value = this.getVariable(variableKey);
                if( value ) {
                    result = result.replace(m[i], value);
                } else {
                    console.warn("variable with key "+variableKey+" was not found");
                }
            }
        }
        return result;
    }


    /**
     * translate
     * return the textstring of the given id.
     * if nothing is found the id itself is returned
     * @param labelId
     * @returns {*}
     */
    p.translate = function( labelId, values ) {
        var result  = labelId;
        var bo      = this.locale != "" ? this.textbooklet[this.locale] : this.textbooklet;
        if(!bo) {
            console.warn( "Locale "+this.locale+" is not defined in textbooklet" );
            return labelId;
        }

        if( bo[labelId] ){
            result = bo[labelId];
            result = this._replaceVariables(result);

            if(Array.isArray(values)) {
                result = sprintfjs.vsprintf(result, values);
            }

            if(typeof values === 'object') {
                result = sprintfjs.sprintf(result, values);
            }


        } else {
            // console.warn( "No text found for "+labelId );
        }
        return result;
    }


    return Translator;

});