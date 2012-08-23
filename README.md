directive
=================================

Patrick Mueller  
[pmuellr@gmail.com](mailto:pmuellr@gmail.com)

[![build status](https://secure.travis-ci.org/pmuellr/directive.png)](http://travis-ci.org/pmuellr/directive)

Summary
-------

`directive` is a code parsing system based on the 
recognition that most programs tend to be structured as a set
of blocks of the form:

*   comment
*   definition
*   body

For example:

    /** 
     * this is a comment
     */
    myFunction(arg1, arg2)
    {
       for (something) { somethingElse() }
    }

In that example, you have a comment, followed by the definition
of the `myFunction` procedure, followed by the body of the
procedure.

With `directive`, you use a standard format to write your 
comments, definitions, and bodies.  Definitions are actually
called *directives*.  

Parsing Rules
-------------

The parsing rules are line based, so things like multi-line comments and
multi-line expressions are not directly handled by the system.

The basic rules for the different parts of a directive are:

*   comment

    A comment block begins with a line that contains a / or # character
    in column one.  It continues until a directive.
    
*   directive

    A directive is a single line which begins with an alphabetic
    character, $ or @.

*   body

    A body block begins after a directive, and continues to a comment
    or directive.  Every line of a body (except empty lines) must begin 
    with at least one white-space character.


API
---

To use `directive`, you must first create a `DirectiveReader` with the
constructor

    DirectiveReader(source, fileName, lineNumber)
    
`source` is the source file containing the directives, `fileName` is the name
of the file, and `lineNumber` is the line the source starts at (for embedded
directives in other files).

With the resulting `DirectiveReader` object, you can invoke the method

    directiveReader.process(handler)
    
`handler` is an object containing functions that are called back at various
times during the processing.  Methods which must be implemented in this
object include:

*   `processDirective(event)`

*   `fileBegin(event)` 

*   `fileEnd(event)`

See the examples for the actual data passed in the events.

In addition, you can provide functions of the form:

    handleDirective_[directiveName]
    
where `[directiveName]` is a specific directive that you want to handle.
Rather than invoking the `processDirective` method for this directive, the
specified `handleDirective_[directiveName]` method will be invoked instead.

Examples
--------

See the test cases for examples.  In particular, the files in the test/test-files
directory contain sample inputs with the list of events that are generated for
that input, so you can see exactly what gets generated.