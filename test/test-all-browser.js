require.dir = "../"

var tester = require("test/test-all")

var results = tester.results

var html = ""

html += printResults(results.errored, "#F00", "with errors",
    function(result) { return ": " + result.error + ": " + result.message }
)

html += printResults(results.failed, "#CC0", "with failures",
    function(result) { return ": " + result.message }
)

html += printResults(results.passed, "#0A0", "that passed",
    function(result) { return ""}
)

document.getElementById("results").innerHTML = html

//-----------------------------------------------------------------------------
function printResults(resultList, color, label, resultLabeller) {
    if (!resultList.length) return ""
    
    var html = "<div style='color:" + color + "'><h2>tests " + label + "</h2>\n<ul>\n"
    
    resultList.forEach(function(result) {
        var message = result.suiteName + ":" + result.funcName
        message += resultLabeller(result)
        
        html += "<li>" + escapeHTML(message) + "\n"
    })
    
    if (!resultList.length) {
        html += "<li>none\n"
    }
    
    return html + "</ul>\n</div>\n"
}

//-----------------------------------------------------------------------------
function escapeHTML(string) {
    return string.
        replace("&", "&amp;").
        replace("<", "&lt;").
        replace(">", "&gt;")
}