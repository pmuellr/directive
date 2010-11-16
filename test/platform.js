//-----------------------------------------------------------------------------
// The MIT License
// 
// Copyright (c) 2010 Patrick Mueller
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//-----------------------------------------------------------------------------

//------------------------------------------------------------------------------
// defines:
//
// platform.readFile(fileName):
//    reads the "file" and returns contents as string
//
// platform.log(message):
//    writes a message to the standard output location
//------------------------------------------------------------------------------

// are we running in a browser?
var inBrowser = (typeof window != "undefined")

// are we running in a node.js?
var inNode = false

if (!inBrowser) {
    try {
       require("fs")
       inNode = true
    }
    catch(e) {
    }
}

// not in a supported platform
if (!inBrowser && !inNode) {
    throw new Error("unsupported platform")    
}

// definitions for browser
if (inBrowser) {

    exports.readFile = function(fileName) {
        var xhr = new XMLHttpRequest()
        xhr.open("GET", fileName, false)
        xhr.send()
        return xhr.responseText
    }
    
    exports.log = function(message) {
        console.log(message)
    }
}

// definitions for node.js
if (inNode) {
    
    var fs = require("fs")
    
    exports.readFile = function(fileName) {
        return fs.readFileSync(fileName, "utf8")
    }
    
    exports.log = function(message) {
        console.log(message)
    }
}
