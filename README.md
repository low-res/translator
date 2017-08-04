# translator
VERY basic translator. Takes label_id, returns String

Takes a simple booklet in the form 

<pre> 
var booklet = {
    "de": {
        "label1":"Text für Label1",
        "label2":"Text for {$someVariable}"
    },
    "en": {
        "label1":"Text for label1",
        "label2":"Text for {$someVariable}"
} 
</pre>

and returns the correct string based on the given label.

##  Example:

`var translator =  new Translator();
translator.setBooklet( booklet );
translator.setLocale('de');
console.log( translator.translate('label1') );
`

will output `Text für Label1`

You can also set variables that will be replaced on the fly (continuing the above exampel):

`translator.setLocale('en');
translator.setVariable("someVariable","Variable Value");
console.log( translator.translate('label2') );
`

will output `Text for Variable Value`