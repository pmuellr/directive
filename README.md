<style>
pre {
    background-color: #EEE;
    margin-left:      2em;
    padding:          0.5em;
}
</style>

curb
=================================

Patrick Mueller  
[pmuellr@gmail.com](mailto:pmuellr@gmail.com)

Summary
-------

`curb` is a code templating system based on the 
recognition that most programs tend to be structured as a set
of blocks of the form:

* comment
* definition
* body

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

With `curb`, you use a standard format to write your 
comments, definitions, and bodies.  Definitions are actually
called *directives*.  