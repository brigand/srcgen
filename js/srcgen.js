(function (window) {
    var sg = window.sg = window.sg || {};
    var self;

    var rletter = function () {
        var n = Math.floor(Math.random() * 26) + 97; // 97 is charcode of "a"
        return String.fromCharCode(n);
    }

    var rletters = function (len) {
        var s = '';

        for (var i = 0; i < len; i++) {
            s += rletter();
        }

        return s;
    }

    sg.template = function (template, data) {
        data.template_func = data.template_func || _.template(template);
        return data.template_func(data);
    };

    sg.init = function (viewmodel) {
        // Load the view model into these functions
        self = viewmodel;

        self.activeItem = ko.observable();
        self.items = ko.observableArray([]);

        self.addItem = _.bind(sg.addItem, self);
        self.activateItem = _.bind(sg.activateItem, self);

        self.viewing_code = ko.observable(false);
        self.toggle_viewing_code = function () {
            var new_value = self.viewing_code() ? false : true;
            self.viewing_code(new_value);
            if (new_value == true) {
                self.compile();
            }
        };

        self.code = ko.observable('');

        self.compile = function () {
            var code = _.map(self.items(), function (item) {
                var data = _.defaults(item.hash, item.block);
                return sg.template(item.block.template, data);
            }).join('\n');

            self.code(code);
        }
    }

    sg.addItem = function (block, event) {
        // Set self to the view model bound to this method
        var item = [];
        var hash = {};

        _.each(block.inputs, function (def, name) {
            var observable, // observable of input's value
                input_type, // e.g. <input type="{{input_type}}">
                tag = 'input';

            // Set properties based on object type
            // These are used when rendering the input types
            switch (typeof def) {
                case "string":
                    observable = ko.observable(def);
                    input_type = 'text';
                    break;
                case "number":
                    observable = ko.observable(def);
                    input_type = 'number';
                    break;
                case "boolean":
                    observable = ko.observable(def);
                    observable.toggle = function(){
                        observable( observable() ? false: true);
                    };
                    tag = "button";
                    break;
                case "object":
                    if (_.isArray(def)) {
                        observable = ko.observableArray(def);
                        tag = 'select';
                    }
                    else {
                        console.error("Error in", block);
                        console.error("Input", {name:def}, "is a non-array object");
                        throw new Error();
                    }
                    break;
                default:
                    console.error("Error in", block);
                    console.error("Input", {name:def}, "is an unrecognized object of type", typeof def);
                    throw new Error();
            }

            // Store this for the templates
            hash[name] = observable;

            item.push({
                value:observable,
                input_type:input_type,
                tag:tag,
                id:rletters(12),
                name:name,
                def: def
            });


        });

        item.name = ko.computed(function () {
            var text = '';

            // Try to grab the first set setting
            // it helps the user remember what is what
            _.some(item, function (inp) {
                text = inp.value();

                // exclude empty strings
                // allow all true values and the boolean false
                if (text || text === false) {
                    return true; // short circut
                }
            });
            return block.text + " " + text;
        });

        item.hash = hash;
        item.block = block;
        self.items.push(item);


        // Activate the newly created block
        sg.activateItem.call(self, item);
    }

    sg.activateItem = function (block, event) {
        // Set self to the view model bound to this method
        var self = this;

        self.activeItem(block);
    }
})(window);