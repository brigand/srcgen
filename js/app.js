function MyGenerator() {
    var self = this;
    sg.init(self);

    self.blocks = [
        {
            text: "alert",
            inputs: {
                text: ""
            },
            template: 'alert("<%= text() %>");'
        },
        {
            text: "set",
            inputs: {
                variable: "MyVar",
                value: '"My String Value"'
            },
            template: "<%= variable() %> = <%= value() %>;"
        },
        {
            text: "log",
            inputs: {
                type: ["log", "warn", "error"],
                msg: "this is a log message"
            },
            template: 'console.<%= type() %>("<%= msg() %>");'
        },
        {
            text: "jQuery fade in",
            inputs: {
                selector: "div.classname#id",
                slow: false
            },
            template: '$("<%= selector() %>").fadein(<%= slow() ? \'"slow"\' : "" %>);'
        }
    ];
}

var app = new MyGenerator();
ko.applyBindings(app);


// Decay extra letters in the title
$('.decay').animate({'font-size': 0}, 3000);