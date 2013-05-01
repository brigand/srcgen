SrcGen
======

Generate computer source code in a variety of languages.  SrcGen is a frame work that allows easy, customizable,
generators to be written in minutes.  Look at [js/app.js] for an example generator.

### Getting Started

The skeleton of a generator looks like this:

    function MyGenerator() {
        var self = this;
        sg.init(self);

        self.blocks = [];
    }

At the end of the file, you need to apply it to the HTML (this is because we use Knockout.JS).


    var app = new MyGenerator();
    ko.applyBindings(app);

### Blocks

Everything is built on `blocks`.  They are small JavaScript objects telling SrcGen how to generate code, and what
information the user needs to provide.

Let's say our generator is creating JavaScript code, and we're building a `console.log` block.  We want it to have
multiple options for the severity, and to show a custom message.

    {
        text: "log",
        inputs: {
            type: ["log", "warn", "error"],
            msg: "this is a log message"
        },
        template: 'console.<%= type() %>("<%= msg() %>");'
    }

Let's break down this object:

 - **text**: the name for the button (the user sees it in the block-list)
 - **inputs**:
   - these are the data you would like the user to fill in
   - the value for each is the
 - **template**: this can be an underscore.js template or a function that returns the code when called
   - if you use a function; `this` is the brick and the first parameter is the ViewModel (e.g. an instance of `MyGenerator`)

Wondering about why our template uses `type()` and `msg()` instead of `type` and `msg`?  That's because KnockoutJS wraps our variables in
