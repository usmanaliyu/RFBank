/*! jQuery Validation Plugin - v1.16.0 - 12/2/2016
 * http://jqueryvalidation.org/
 * Copyright (c) 2016 Jörn Zaefferer; Licensed MIT */
!function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function(a) {
    a.extend(a.fn, {
        validate: function(b) {
            if (!this.length)
                return void (b && b.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
            var c = a.data(this[0], "validator");
            return c ? c : (this.attr("novalidate", "novalidate"),
            c = new a.validator(b,this[0]),
            a.data(this[0], "validator", c),
            c.settings.onsubmit && (this.on("click.validate", ":submit", function(b) {
                c.settings.submitHandler && (c.submitButton = b.target),
                a(this).hasClass("cancel") && (c.cancelSubmit = !0),
                void 0 !== a(this).attr("formnovalidate") && (c.cancelSubmit = !0)
            }),
            this.on("submit.validate", function(b) {
                function d() {
                    var d, e;
                    return !c.settings.submitHandler || (c.submitButton && (d = a("<input type='hidden'/>").attr("name", c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)),
                    e = c.settings.submitHandler.call(c, c.currentForm, b),
                    c.submitButton && d.remove(),
                    void 0 !== e && e)
                }
                return c.settings.debug && b.preventDefault(),
                c.cancelSubmit ? (c.cancelSubmit = !1,
                d()) : c.form() ? c.pendingRequest ? (c.formSubmitted = !0,
                !1) : d() : (c.focusInvalid(),
                !1)
            })),
            c)
        },
        valid: function() {
            var b, c, d;
            return a(this[0]).is("form") ? b = this.validate().form() : (d = [],
            b = !0,
            c = a(this[0].form).validate(),
            this.each(function() {
                b = c.element(this) && b,
                b || (d = d.concat(c.errorList))
            }),
            c.errorList = d),
            b
        },
        rules: function(b, c) {
            var d, e, f, g, h, i, j = this[0];
            if (null != j && null != j.form) {
                if (b)
                    switch (d = a.data(j.form, "validator").settings,
                    e = d.rules,
                    f = a.validator.staticRules(j),
                    b) {
                    case "add":
                        a.extend(f, a.validator.normalizeRule(c)),
                        delete f.messages,
                        e[j.name] = f,
                        c.messages && (d.messages[j.name] = a.extend(d.messages[j.name], c.messages));
                        break;
                    case "remove":
                        return c ? (i = {},
                        a.each(c.split(/\s/), function(b, c) {
                            i[c] = f[c],
                            delete f[c],
                            "required" === c && a(j).removeAttr("aria-required")
                        }),
                        i) : (delete e[j.name],
                        f)
                    }
                return g = a.validator.normalizeRules(a.extend({}, a.validator.classRules(j), a.validator.attributeRules(j), a.validator.dataRules(j), a.validator.staticRules(j)), j),
                g.required && (h = g.required,
                delete g.required,
                g = a.extend({
                    required: h
                }, g),
                a(j).attr("aria-required", "true")),
                g.remote && (h = g.remote,
                delete g.remote,
                g = a.extend(g, {
                    remote: h
                })),
                g
            }
        }
    }),
    a.extend(a.expr.pseudos || a.expr[":"], {
        blank: function(b) {
            return !a.trim("" + a(b).val())
        },
        filled: function(b) {
            var c = a(b).val();
            return null !== c && !!a.trim("" + c)
        },
        unchecked: function(b) {
            return !a(b).prop("checked")
        }
    }),
    a.validator = function(b, c) {
        this.settings = a.extend(!0, {}, a.validator.defaults, b),
        this.currentForm = c,
        this.init()
    }
    ,
    a.validator.format = function(b, c) {
        return 1 === arguments.length ? function() {
            var c = a.makeArray(arguments);
            return c.unshift(b),
            a.validator.format.apply(this, c)
        }
        : void 0 === c ? b : (arguments.length > 2 && c.constructor !== Array && (c = a.makeArray(arguments).slice(1)),
        c.constructor !== Array && (c = [c]),
        a.each(c, function(a, c) {
            b = b.replace(new RegExp("\\{" + a + "\\}","g"), function() {
                return c
            })
        }),
        b)
    }
    ,
    a.extend(a.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            pendingClass: "pending",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: !1,
            focusInvalid: !0,
            errorContainer: a([]),
            errorLabelContainer: a([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function(a) {
                this.lastActive = a,
                this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass),
                this.hideThese(this.errorsFor(a)))
            },
            onfocusout: function(a) {
                this.checkable(a) || !(a.name in this.submitted) && this.optional(a) || this.element(a)
            },
            onkeyup: function(b, c) {
                var d = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
                9 === c.which && "" === this.elementValue(b) || a.inArray(c.keyCode, d) !== -1 || (b.name in this.submitted || b.name in this.invalid) && this.element(b)
            },
            onclick: function(a) {
                a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode)
            },
            highlight: function(b, c, d) {
                "radio" === b.type ? this.findByName(b.name).addClass(c).removeClass(d) : a(b).addClass(c).removeClass(d)
            },
            unhighlight: function(b, c, d) {
                "radio" === b.type ? this.findByName(b.name).removeClass(c).addClass(d) : a(b).removeClass(c).addClass(d)
            }
        },
        setDefaults: function(b) {
            a.extend(a.validator.defaults, b)
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            maxlength: a.validator.format("Please enter no more than {0} characters."),
            minlength: a.validator.format("Please enter at least {0} characters."),
            rangelength: a.validator.format("Please enter a value between {0} and {1} characters long."),
            range: a.validator.format("Please enter a value between {0} and {1}."),
            max: a.validator.format("Please enter a value less than or equal to {0}."),
            min: a.validator.format("Please enter a value greater than or equal to {0}."),
            step: a.validator.format("Please enter a multiple of {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function() {
                function b(b) {
                    !this.form && this.hasAttribute("contenteditable") && (this.form = a(this).closest("form")[0]);
                    var c = a.data(this.form, "validator")
                      , d = "on" + b.type.replace(/^validate/, "")
                      , e = c.settings;
                    e[d] && !a(this).is(e.ignore) && e[d].call(c, this, b)
                }
                this.labelContainer = a(this.settings.errorLabelContainer),
                this.errorContext = this.labelContainer.length && this.labelContainer || a(this.currentForm),
                this.containers = a(this.settings.errorContainer).add(this.settings.errorLabelContainer),
                this.submitted = {},
                this.valueCache = {},
                this.pendingRequest = 0,
                this.pending = {},
                this.invalid = {},
                this.reset();
                var c, d = this.groups = {};
                a.each(this.settings.groups, function(b, c) {
                    "string" == typeof c && (c = c.split(/\s/)),
                    a.each(c, function(a, c) {
                        d[c] = b
                    })
                }),
                c = this.settings.rules,
                a.each(c, function(b, d) {
                    c[b] = a.validator.normalizeRule(d)
                }),
                a(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']", b).on("click.validate", "select, option, [type='radio'], [type='checkbox']", b),
                this.settings.invalidHandler && a(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler),
                a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
            },
            form: function() {
                return this.checkForm(),
                a.extend(this.submitted, this.errorMap),
                this.invalid = a.extend({}, this.errorMap),
                this.valid() || a(this.currentForm).triggerHandler("invalid-form", [this]),
                this.showErrors(),
                this.valid()
            },
            checkForm: function() {
                this.prepareForm();
                for (var a = 0, b = this.currentElements = this.elements(); b[a]; a++)
                    this.check(b[a]);
                return this.valid()
            },
            element: function(b) {
                var c, d, e = this.clean(b), f = this.validationTargetFor(e), g = this, h = !0;
                return void 0 === f ? delete this.invalid[e.name] : (this.prepareElement(f),
                this.currentElements = a(f),
                d = this.groups[f.name],
                d && a.each(this.groups, function(a, b) {
                    b === d && a !== f.name && (e = g.validationTargetFor(g.clean(g.findByName(a))),
                    e && e.name in g.invalid && (g.currentElements.push(e),
                    h = g.check(e) && h))
                }),
                c = this.check(f) !== !1,
                h = h && c,
                c ? this.invalid[f.name] = !1 : this.invalid[f.name] = !0,
                this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)),
                this.showErrors(),
                a(b).attr("aria-invalid", !c)),
                h
            },
            showErrors: function(b) {
                if (b) {
                    var c = this;
                    a.extend(this.errorMap, b),
                    this.errorList = a.map(this.errorMap, function(a, b) {
                        return {
                            message: a,
                            element: c.findByName(b)[0]
                        }
                    }),
                    this.successList = a.grep(this.successList, function(a) {
                        return !(a.name in b)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function() {
                a.fn.resetForm && a(this.currentForm).resetForm(),
                this.invalid = {},
                this.submitted = {},
                this.prepareForm(),
                this.hideErrors();
                var b = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                this.resetElements(b)
            },
            resetElements: function(a) {
                var b;
                if (this.settings.unhighlight)
                    for (b = 0; a[b]; b++)
                        this.settings.unhighlight.call(this, a[b], this.settings.errorClass, ""),
                        this.findByName(a[b].name).removeClass(this.settings.validClass);
                else
                    a.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid)
            },
            objectLength: function(a) {
                var b, c = 0;
                for (b in a)
                    a[b] && c++;
                return c
            },
            hideErrors: function() {
                this.hideThese(this.toHide)
            },
            hideThese: function(a) {
                a.not(this.containers).text(""),
                this.addWrapper(a).hide()
            },
            valid: function() {
                return 0 === this.size()
            },
            size: function() {
                return this.errorList.length
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid)
                    try {
                        a(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                    } catch (b) {}
            },
            findLastActive: function() {
                var b = this.lastActive;
                return b && 1 === a.grep(this.errorList, function(a) {
                    return a.element.name === b.name
                }).length && b
            },
            elements: function() {
                var b = this
                  , c = {};
                return a(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function() {
                    var d = this.name || a(this).attr("name");
                    return !d && b.settings.debug && window.console && console.error("%o has no name assigned", this),
                    this.hasAttribute("contenteditable") && (this.form = a(this).closest("form")[0]),
                    !(d in c || !b.objectLength(a(this).rules())) && (c[d] = !0,
                    !0)
                })
            },
            clean: function(b) {
                return a(b)[0]
            },
            errors: function() {
                var b = this.settings.errorClass.split(" ").join(".");
                return a(this.settings.errorElement + "." + b, this.errorContext)
            },
            resetInternals: function() {
                this.successList = [],
                this.errorList = [],
                this.errorMap = {},
                this.toShow = a([]),
                this.toHide = a([])
            },
            reset: function() {
                this.resetInternals(),
                this.currentElements = a([])
            },
            prepareForm: function() {
                this.reset(),
                this.toHide = this.errors().add(this.containers)
            },
            prepareElement: function(a) {
                this.reset(),
                this.toHide = this.errorsFor(a)
            },
            elementValue: function(b) {
                var c, d, e = a(b), f = b.type;
                return "radio" === f || "checkbox" === f ? this.findByName(b.name).filter(":checked").val() : "number" === f && "undefined" != typeof b.validity ? b.validity.badInput ? "NaN" : e.val() : (c = b.hasAttribute("contenteditable") ? e.text() : e.val(),
                "file" === f ? "C:\\fakepath\\" === c.substr(0, 12) ? c.substr(12) : (d = c.lastIndexOf("/"),
                d >= 0 ? c.substr(d + 1) : (d = c.lastIndexOf("\\"),
                d >= 0 ? c.substr(d + 1) : c)) : "string" == typeof c ? c.replace(/\r/g, "") : c)
            },
            check: function(b) {
                b = this.validationTargetFor(this.clean(b));
                var c, d, e, f = a(b).rules(), g = a.map(f, function(a, b) {
                    return b
                }).length, h = !1, i = this.elementValue(b);
                if ("function" == typeof f.normalizer) {
                    if (i = f.normalizer.call(b, i),
                    "string" != typeof i)
                        throw new TypeError("The normalizer should return a string value.");
                    delete f.normalizer
                }
                for (d in f) {
                    e = {
                        method: d,
                        parameters: f[d]
                    };
                    try {
                        if (c = a.validator.methods[d].call(this, i, b, e.parameters),
                        "dependency-mismatch" === c && 1 === g) {
                            h = !0;
                            continue
                        }
                        if (h = !1,
                        "pending" === c)
                            return void (this.toHide = this.toHide.not(this.errorsFor(b)));
                        if (!c)
                            return this.formatAndAdd(b, e),
                            !1
                    } catch (j) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + b.id + ", check the '" + e.method + "' method.", j),
                        j instanceof TypeError && (j.message += ".  Exception occurred when checking element " + b.id + ", check the '" + e.method + "' method."),
                        j
                    }
                }
                if (!h)
                    return this.objectLength(f) && this.successList.push(b),
                    !0
            },
            customDataMessage: function(b, c) {
                return a(b).data("msg" + c.charAt(0).toUpperCase() + c.substring(1).toLowerCase()) || a(b).data("msg")
            },
            customMessage: function(a, b) {
                var c = this.settings.messages[a];
                return c && (c.constructor === String ? c : c[b])
            },
            findDefined: function() {
                for (var a = 0; a < arguments.length; a++)
                    if (void 0 !== arguments[a])
                        return arguments[a]
            },
            defaultMessage: function(b, c) {
                "string" == typeof c && (c = {
                    method: c
                });
                var d = this.findDefined(this.customMessage(b.name, c.method), this.customDataMessage(b, c.method), !this.settings.ignoreTitle && b.title || void 0, a.validator.messages[c.method], "<strong>Warning: No message defined for " + b.name + "</strong>")
                  , e = /\$?\{(\d+)\}/g;
                return "function" == typeof d ? d = d.call(this, c.parameters, b) : e.test(d) && (d = a.validator.format(d.replace(e, "{$1}"), c.parameters)),
                d
            },
            formatAndAdd: function(a, b) {
                var c = this.defaultMessage(a, b);
                this.errorList.push({
                    message: c,
                    element: a,
                    method: b.method
                }),
                this.errorMap[a.name] = c,
                this.submitted[a.name] = c
            },
            addWrapper: function(a) {
                return this.settings.wrapper && (a = a.add(a.parent(this.settings.wrapper))),
                a
            },
            defaultShowErrors: function() {
                var a, b, c;
                for (a = 0; this.errorList[a]; a++)
                    c = this.errorList[a],
                    this.settings.highlight && this.settings.highlight.call(this, c.element, this.settings.errorClass, this.settings.validClass),
                    this.showLabel(c.element, c.message);
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)),
                this.settings.success)
                    for (a = 0; this.successList[a]; a++)
                        this.showLabel(this.successList[a]);
                if (this.settings.unhighlight)
                    for (a = 0,
                    b = this.validElements(); b[a]; a++)
                        this.settings.unhighlight.call(this, b[a], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow),
                this.hideErrors(),
                this.addWrapper(this.toShow).show()
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements())
            },
            invalidElements: function() {
                return a(this.errorList).map(function() {
                    return this.element
                })
            },
            showLabel: function(b, c) {
                var d, e, f, g, h = this.errorsFor(b), i = this.idOrName(b), j = a(b).attr("aria-describedby");
                h.length ? (h.removeClass(this.settings.validClass).addClass(this.settings.errorClass),
                h.html(c)) : (h = a("<" + this.settings.errorElement + ">").attr("id", i + "-error").addClass(this.settings.errorClass).html(c || ""),
                d = h,
                this.settings.wrapper && (d = h.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()),
                this.labelContainer.length ? this.labelContainer.append(d) : this.settings.errorPlacement ? this.settings.errorPlacement.call(this, d, a(b)) : d.insertAfter(b),
                h.is("label") ? h.attr("for", i) : 0 === h.parents("label[for='" + this.escapeCssMeta(i) + "']").length && (f = h.attr("id"),
                j ? j.match(new RegExp("\\b" + this.escapeCssMeta(f) + "\\b")) || (j += " " + f) : j = f,
                a(b).attr("aria-describedby", j),
                e = this.groups[b.name],
                e && (g = this,
                a.each(g.groups, function(b, c) {
                    c === e && a("[name='" + g.escapeCssMeta(b) + "']", g.currentForm).attr("aria-describedby", h.attr("id"))
                })))),
                !c && this.settings.success && (h.text(""),
                "string" == typeof this.settings.success ? h.addClass(this.settings.success) : this.settings.success(h, b)),
                this.toShow = this.toShow.add(h)
            },
            errorsFor: function(b) {
                var c = this.escapeCssMeta(this.idOrName(b))
                  , d = a(b).attr("aria-describedby")
                  , e = "label[for='" + c + "'], label[for='" + c + "'] *";
                return d && (e = e + ", #" + this.escapeCssMeta(d).replace(/\s+/g, ", #")),
                this.errors().filter(e)
            },
            escapeCssMeta: function(a) {
                return a.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1")
            },
            idOrName: function(a) {
                return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
            },
            validationTargetFor: function(b) {
                return this.checkable(b) && (b = this.findByName(b.name)),
                a(b).not(this.settings.ignore)[0]
            },
            checkable: function(a) {
                return /radio|checkbox/i.test(a.type)
            },
            findByName: function(b) {
                return a(this.currentForm).find("[name='" + this.escapeCssMeta(b) + "']")
            },
            getLength: function(b, c) {
                switch (c.nodeName.toLowerCase()) {
                case "select":
                    return a("option:selected", c).length;
                case "input":
                    if (this.checkable(c))
                        return this.findByName(c.name).filter(":checked").length
                }
                return b.length
            },
            depend: function(a, b) {
                return !this.dependTypes[typeof a] || this.dependTypes[typeof a](a, b)
            },
            dependTypes: {
                "boolean": function(a) {
                    return a
                },
                string: function(b, c) {
                    return !!a(b, c.form).length
                },
                "function": function(a, b) {
                    return a(b)
                }
            },
            optional: function(b) {
                var c = this.elementValue(b);
                return !a.validator.methods.required.call(this, c, b) && "dependency-mismatch"
            },
            startRequest: function(b) {
                this.pending[b.name] || (this.pendingRequest++,
                a(b).addClass(this.settings.pendingClass),
                this.pending[b.name] = !0)
            },
            stopRequest: function(b, c) {
                this.pendingRequest--,
                this.pendingRequest < 0 && (this.pendingRequest = 0),
                delete this.pending[b.name],
                a(b).removeClass(this.settings.pendingClass),
                c && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (a(this.currentForm).submit(),
                this.formSubmitted = !1) : !c && 0 === this.pendingRequest && this.formSubmitted && (a(this.currentForm).triggerHandler("invalid-form", [this]),
                this.formSubmitted = !1)
            },
            previousValue: function(b, c) {
                return c = "string" == typeof c && c || "remote",
                a.data(b, "previousValue") || a.data(b, "previousValue", {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(b, {
                        method: c
                    })
                })
            },
            destroy: function() {
                this.resetForm(),
                a(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur")
            }
        },
        classRuleSettings: {
            required: {
                required: !0
            },
            email: {
                email: !0
            },
            url: {
                url: !0
            },
            date: {
                date: !0
            },
            dateISO: {
                dateISO: !0
            },
            number: {
                number: !0
            },
            digits: {
                digits: !0
            },
            creditcard: {
                creditcard: !0
            }
        },
        addClassRules: function(b, c) {
            b.constructor === String ? this.classRuleSettings[b] = c : a.extend(this.classRuleSettings, b)
        },
        classRules: function(b) {
            var c = {}
              , d = a(b).attr("class");
            return d && a.each(d.split(" "), function() {
                this in a.validator.classRuleSettings && a.extend(c, a.validator.classRuleSettings[this])
            }),
            c
        },
        normalizeAttributeRule: function(a, b, c, d) {
            /min|max|step/.test(c) && (null === b || /number|range|text/.test(b)) && (d = Number(d),
            isNaN(d) && (d = void 0)),
            d || 0 === d ? a[c] = d : b === c && "range" !== b && (a[c] = !0)
        },
        attributeRules: function(b) {
            var c, d, e = {}, f = a(b), g = b.getAttribute("type");
            for (c in a.validator.methods)
                "required" === c ? (d = b.getAttribute(c),
                "" === d && (d = !0),
                d = !!d) : d = f.attr(c),
                this.normalizeAttributeRule(e, g, c, d);
            return e.maxlength && /-1|2147483647|524288/.test(e.maxlength) && delete e.maxlength,
            e
        },
        dataRules: function(b) {
            var c, d, e = {}, f = a(b), g = b.getAttribute("type");
            for (c in a.validator.methods)
                d = f.data("rule" + c.charAt(0).toUpperCase() + c.substring(1).toLowerCase()),
                this.normalizeAttributeRule(e, g, c, d);
            return e
        },
        staticRules: function(b) {
            var c = {}
              , d = a.data(b.form, "validator");
            return d.settings.rules && (c = a.validator.normalizeRule(d.settings.rules[b.name]) || {}),
            c
        },
        normalizeRules: function(b, c) {
            return a.each(b, function(d, e) {
                if (e === !1)
                    return void delete b[d];
                if (e.param || e.depends) {
                    var f = !0;
                    switch (typeof e.depends) {
                    case "string":
                        f = !!a(e.depends, c.form).length;
                        break;
                    case "function":
                        f = e.depends.call(c, c)
                    }
                    f ? b[d] = void 0 === e.param || e.param : (a.data(c.form, "validator").resetElements(a(c)),
                    delete b[d])
                }
            }),
            a.each(b, function(d, e) {
                b[d] = a.isFunction(e) && "normalizer" !== d ? e(c) : e
            }),
            a.each(["minlength", "maxlength"], function() {
                b[this] && (b[this] = Number(b[this]))
            }),
            a.each(["rangelength", "range"], function() {
                var c;
                b[this] && (a.isArray(b[this]) ? b[this] = [Number(b[this][0]), Number(b[this][1])] : "string" == typeof b[this] && (c = b[this].replace(/[\[\]]/g, "").split(/[\s,]+/),
                b[this] = [Number(c[0]), Number(c[1])]))
            }),
            a.validator.autoCreateRanges && (null != b.min && null != b.max && (b.range = [b.min, b.max],
            delete b.min,
            delete b.max),
            null != b.minlength && null != b.maxlength && (b.rangelength = [b.minlength, b.maxlength],
            delete b.minlength,
            delete b.maxlength)),
            b
        },
        normalizeRule: function(b) {
            if ("string" == typeof b) {
                var c = {};
                a.each(b.split(/\s/), function() {
                    c[this] = !0
                }),
                b = c
            }
            return b
        },
        addMethod: function(b, c, d) {
            a.validator.methods[b] = c,
            a.validator.messages[b] = void 0 !== d ? d : a.validator.messages[b],
            c.length < 3 && a.validator.addClassRules(b, a.validator.normalizeRule(b))
        },
        methods: {
            required: function(b, c, d) {
                if (!this.depend(d, c))
                    return "dependency-mismatch";
                if ("select" === c.nodeName.toLowerCase()) {
                    var e = a(c).val();
                    return e && e.length > 0
                }
                return this.checkable(c) ? this.getLength(b, c) > 0 : b.length > 0
            },
            email: function(a, b) {
                return this.optional(b) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)
            },
            url: function(a, b) {
                return this.optional(b) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(a)
            },
            date: function(a, b) {
                return this.optional(b) || !/Invalid|NaN/.test(new Date(a).toString())
            },
            dateISO: function(a, b) {
                return this.optional(b) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)
            },
            number: function(a, b) {
                return this.optional(b) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)
            },
            digits: function(a, b) {
                return this.optional(b) || /^\d+$/.test(a)
            },
            minlength: function(b, c, d) {
                var e = a.isArray(b) ? b.length : this.getLength(b, c);
                return this.optional(c) || e >= d
            },
            maxlength: function(b, c, d) {
                var e = a.isArray(b) ? b.length : this.getLength(b, c);
                return this.optional(c) || e <= d
            },
            rangelength: function(b, c, d) {
                var e = a.isArray(b) ? b.length : this.getLength(b, c);
                return this.optional(c) || e >= d[0] && e <= d[1]
            },
            min: function(a, b, c) {
                return this.optional(b) || a >= c
            },
            max: function(a, b, c) {
                return this.optional(b) || a <= c
            },
            range: function(a, b, c) {
                return this.optional(b) || a >= c[0] && a <= c[1]
            },
            step: function(b, c, d) {
                var e, f = a(c).attr("type"), g = "Step attribute on input type " + f + " is not supported.", h = ["text", "number", "range"], i = new RegExp("\\b" + f + "\\b"), j = f && !i.test(h.join()), k = function(a) {
                    var b = ("" + a).match(/(?:\.(\d+))?$/);
                    return b && b[1] ? b[1].length : 0
                }, l = function(a) {
                    return Math.round(a * Math.pow(10, e))
                }, m = !0;
                if (j)
                    throw new Error(g);
                return e = k(d),
                (k(b) > e || l(b) % l(d) !== 0) && (m = !1),
                this.optional(c) || m
            },
            equalTo: function(b, c, d) {
                var e = a(d);
                return this.settings.onfocusout && e.not(".validate-equalTo-blur").length && e.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function() {
                    a(c).valid()
                }),
                b === e.val()
            },
            remote: function(b, c, d, e) {
                if (this.optional(c))
                    return "dependency-mismatch";
                e = "string" == typeof e && e || "remote";
                var f, g, h, i = this.previousValue(c, e);
                return this.settings.messages[c.name] || (this.settings.messages[c.name] = {}),
                i.originalMessage = i.originalMessage || this.settings.messages[c.name][e],
                this.settings.messages[c.name][e] = i.message,
                d = "string" == typeof d && {
                    url: d
                } || d,
                h = a.param(a.extend({
                    data: b
                }, d.data)),
                i.old === h ? i.valid : (i.old = h,
                f = this,
                this.startRequest(c),
                g = {},
                g[c.name] = b,
                a.ajax(a.extend(!0, {
                    mode: "abort",
                    port: "validate" + c.name,
                    dataType: "json",
                    data: g,
                    context: f.currentForm,
                    success: function(a) {
                        var d, g, h, j = a === !0 || "true" === a;
                        f.settings.messages[c.name][e] = i.originalMessage,
                        j ? (h = f.formSubmitted,
                        f.resetInternals(),
                        f.toHide = f.errorsFor(c),
                        f.formSubmitted = h,
                        f.successList.push(c),
                        f.invalid[c.name] = !1,
                        f.showErrors()) : (d = {},
                        g = a || f.defaultMessage(c, {
                            method: e,
                            parameters: b
                        }),
                        d[c.name] = i.message = g,
                        f.invalid[c.name] = !0,
                        f.showErrors(d)),
                        i.valid = j,
                        f.stopRequest(c, j)
                    }
                }, d)),
                "pending")
            }
        }
    });
    var b, c = {};
    return a.ajaxPrefilter ? a.ajaxPrefilter(function(a, b, d) {
        var e = a.port;
        "abort" === a.mode && (c[e] && c[e].abort(),
        c[e] = d)
    }) : (b = a.ajax,
    a.ajax = function(d) {
        var e = ("mode"in d ? d : a.ajaxSettings).mode
          , f = ("port"in d ? d : a.ajaxSettings).port;
        return "abort" === e ? (c[f] && c[f].abort(),
        c[f] = b.apply(this, arguments),
        c[f]) : b.apply(this, arguments)
    }
    ),
    a
});
window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = function(e, t) {
    t = t || window;
    for (var o = 0; o < this.length; o++)
        e.call(t, this[o], o, this)
}
),
Element.prototype.matches || (Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(e) {
    for (var t = (this.document || this.ownerDocument).querySelectorAll(e), o = t.length; 0 <= --o && t.item(o) !== this; )
        ;
    return -1 < o
}
),
Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector),
Element.prototype.closest || (Element.prototype.closest = function(e) {
    var t = this;
    do {
        if (t.matches(e))
            return t;
        t = t.parentElement || t.parentNode
    } while (null !== t && 1 === t.nodeType);
    return null
}
),
[Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function(e) {
    e.hasOwnProperty("prepend") || Object.defineProperty(e, "prepend", {
        configurable: !0,
        enumerable: !0,
        writable: !0,
        value: function() {
            var e = Array.prototype.slice.call(arguments)
              , o = document.createDocumentFragment();
            e.forEach(function(e) {
                var t = e instanceof Node;
                o.appendChild(t ? e : document.createTextNode(String(e)))
            }),
            this.insertBefore(o, this.firstChild)
        }
    })
}),
[Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function(e) {
    e.hasOwnProperty("append") || Object.defineProperty(e, "append", {
        configurable: !0,
        enumerable: !0,
        writable: !0,
        value: function() {
            var e = Array.prototype.slice.call(arguments)
              , o = document.createDocumentFragment();
            e.forEach(function(e) {
                var t = e instanceof Node;
                o.appendChild(t ? e : document.createTextNode(String(e)))
            }),
            this.appendChild(o)
        }
    })
}),
[Element.prototype, CharacterData.prototype, DocumentType.prototype].forEach(function(e) {
    e.hasOwnProperty("before") || Object.defineProperty(e, "before", {
        configurable: !0,
        enumerable: !0,
        writable: !0,
        value: function() {
            var e = Array.prototype.slice.call(arguments)
              , o = document.createDocumentFragment();
            e.forEach(function(e) {
                var t = e instanceof Node;
                o.appendChild(t ? e : document.createTextNode(String(e)))
            }),
            this.parentNode.insertBefore(o, this)
        }
    })
}),
[Element.prototype, CharacterData.prototype, DocumentType.prototype].forEach(function(e) {
    e.hasOwnProperty("remove") || Object.defineProperty(e, "remove", {
        configurable: !0,
        enumerable: !0,
        writable: !0,
        value: function() {
            null !== this.parentNode && this.parentNode.removeChild(this)
        }
    })
});
!function(e) {
    var t = {};
    function n(i) {
        if (t[i])
            return t[i].exports;
        var s = t[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return e[i].call(s.exports, s, s.exports, n),
        s.l = !0,
        s.exports
    }
    n.m = e,
    n.c = t,
    n.d = function(e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
        })
    }
    ,
    n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    n.t = function(e, t) {
        if (1 & t && (e = n(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var i = Object.create(null);
        if (n.r(i),
        Object.defineProperty(i, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var s in e)
                n.d(i, s, function(t) {
                    return e[t]
                }
                .bind(null, s));
        return i
    }
    ,
    n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return n.d(t, "a", t),
        t
    }
    ,
    n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    n.p = "",
    n(n.s = 1)
}([function(e) {
    e.exports = JSON.parse('{"a":"8.5.20"}')
}
, function(e, t, n) {
    "use strict";
    n.r(t);
    var i = n(0)
      , s = {
        hooks: {},
        extensions: [],
        wrappers: [],
        navbar: {
            add: !0,
            sticky: !0,
            title: "Menu",
            titleLink: "parent"
        },
        onClick: {
            close: null,
            preventDefault: null,
            setSelected: !0
        },
        slidingSubmenus: !0
    }
      , a = {
        classNames: {
            inset: "Inset",
            nolistview: "NoListview",
            nopanel: "NoPanel",
            panel: "Panel",
            selected: "Selected",
            vertical: "Vertical"
        },
        language: null,
        openingInterval: 25,
        panelNodetype: ["ul", "ol", "div"],
        transitionDuration: 400
    };
    function o(e, t) {
        for (var n in "object" != r(e) && (e = {}),
        "object" != r(t) && (t = {}),
        t)
            t.hasOwnProperty(n) && (void 0 === e[n] ? e[n] = t[n] : "object" == r(e[n]) && o(e[n], t[n]));
        return e
    }
    function r(e) {
        return {}.toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }
    function c(e, t, n) {
        if ("function" == typeof t) {
            var i = t.call(e);
            if (void 0 !== i)
                return i
        }
        return null !== t && "function" != typeof t && void 0 !== t || void 0 === n ? t : n
    }
    function m(e, t, n) {
        var i = !1
          , s = function(n) {
            void 0 !== n && n.target !== e || (i || (e.removeEventListener("transitionend", s),
            e.removeEventListener("webkitTransitionEnd", s),
            t.call(e)),
            i = !0)
        };
        e.addEventListener("transitionend", s),
        e.addEventListener("webkitTransitionEnd", s),
        setTimeout(s, 1.1 * n)
    }
    function l() {
        return "mm-" + d++
    }
    var d = 0;
    function p(e) {
        return "mm-" == e.slice(0, 3) ? e.slice(3) : e
    }
    var u = {};
    function f(e, t) {
        void 0 === u[t] && (u[t] = {}),
        o(u[t], e)
    }
    var h = {
        Menu: "منو"
    }
      , v = {
        Menu: "Menü"
    }
      , b = {
        Menu: "Меню"
    };
    function g(e) {
        var t = e.split(".")
          , n = document.createElement(t.shift());
        return t.forEach((function(e) {
            n.classList.add(e)
        }
        )),
        n
    }
    function _(e, t) {
        return Array.prototype.slice.call(e.querySelectorAll(t))
    }
    function y(e, t) {
        var n = Array.prototype.slice.call(e.children);
        return t ? n.filter((function(e) {
            return e.matches(t)
        }
        )) : n
    }
    function L(e, t) {
        for (var n = [], i = e.parentElement; i; )
            n.push(i),
            i = i.parentElement;
        return t ? n.filter((function(e) {
            return e.matches(t)
        }
        )) : n
    }
    function w(e) {
        return e.filter((function(e) {
            return !e.matches(".mm-hidden")
        }
        ))
    }
    function E(e) {
        var t = [];
        return w(e).forEach((function(e) {
            t.push.apply(t, y(e, "a.mm-listitem__text"))
        }
        )),
        t.filter((function(e) {
            return !e.matches(".mm-btn_next")
        }
        ))
    }
    function x(e, t, n) {
        e.matches("." + t) && (e.classList.remove(t),
        e.classList.add(n))
    }
    var P = {};
    function k(e, t, n) {
        "number" == typeof e && (e = "(min-width: " + e + "px)"),
        P[e] = P[e] || [],
        P[e].push({
            yes: t,
            no: n
        })
    }
    function S(e, t) {
        for (var n = t.matches ? "yes" : "no", i = 0; i < P[e].length; i++)
            P[e][i][n]()
    }
    f({
        Menu: "Menu"
    }, "nl"),
    f(h, "fa"),
    f(v, "de"),
    f(b, "ru");
    var M = function() {
        function e(t, n, i) {
            return this.opts = o(n, e.options),
            this.conf = o(i, e.configs),
            this._api = ["bind", "initPanel", "initListview", "openPanel", "closePanel", "closeAllPanels", "setSelected"],
            this.node = {},
            this.vars = {},
            this.hook = {},
            this.clck = [],
            this.node.menu = "string" == typeof t ? document.querySelector(t) : t,
            "function" == typeof this._deprecatedWarnings && this._deprecatedWarnings(),
            this._initWrappers(),
            this._initAddons(),
            this._initExtensions(),
            this._initHooks(),
            this._initAPI(),
            this._initMenu(),
            this._initPanels(),
            this._initOpened(),
            this._initAnchors(),
            function() {
                var e = function(e) {
                    var t = window.matchMedia(e);
                    S(e, t),
                    t.onchange = function(n) {
                        S(e, t)
                    }
                };
                for (var t in P)
                    e(t)
            }(),
            this
        }
        return e.prototype.openPanel = function(e, t) {
            var n = this;
            if (this.trigger("openPanel:before", [e]),
            e && (e.matches(".mm-panel") || (e = e.closest(".mm-panel")),
            e)) {
                if ("boolean" != typeof t && (t = !0),
                e.parentElement.matches(".mm-listitem_vertical")) {
                    L(e, ".mm-listitem_vertical").forEach((function(e) {
                        e.classList.add("mm-listitem_opened"),
                        y(e, ".mm-panel").forEach((function(e) {
                            e.classList.remove("mm-hidden")
                        }
                        ))
                    }
                    ));
                    var i = L(e, ".mm-panel").filter((function(e) {
                        return !e.parentElement.matches(".mm-listitem_vertical")
                    }
                    ));
                    this.trigger("openPanel:start", [e]),
                    i.length && this.openPanel(i[0]),
                    this.trigger("openPanel:finish", [e])
                } else {
                    if (e.matches(".mm-panel_opened"))
                        return;
                    var s = y(this.node.pnls, ".mm-panel")
                      , a = y(this.node.pnls, ".mm-panel_opened")[0];
                    s.filter((function(t) {
                        return t !== e
                    }
                    )).forEach((function(e) {
                        e.classList.remove("mm-panel_opened-parent")
                    }
                    ));
                    for (var o = e.mmParent; o; )
                        (o = o.closest(".mm-panel")) && (o.parentElement.matches(".mm-listitem_vertical") || o.classList.add("mm-panel_opened-parent"),
                        o = o.mmParent);
                    s.forEach((function(e) {
                        e.classList.remove("mm-panel_highest")
                    }
                    )),
                    s.filter((function(e) {
                        return e !== a
                    }
                    )).filter((function(t) {
                        return t !== e
                    }
                    )).forEach((function(e) {
                        e.classList.add("mm-hidden")
                    }
                    )),
                    e.classList.remove("mm-hidden");
                    var r = function() {
                        a && a.classList.remove("mm-panel_opened"),
                        e.classList.add("mm-panel_opened"),
                        e.matches(".mm-panel_opened-parent") ? (a && a.classList.add("mm-panel_highest"),
                        e.classList.remove("mm-panel_opened-parent")) : (a && a.classList.add("mm-panel_opened-parent"),
                        e.classList.add("mm-panel_highest")),
                        n.trigger("openPanel:start", [e])
                    }
                      , c = function() {
                        a && (a.classList.remove("mm-panel_highest"),
                        a.classList.add("mm-hidden")),
                        e.classList.remove("mm-panel_highest"),
                        n.trigger("openPanel:finish", [e])
                    };
                    t && !e.matches(".mm-panel_noanimation") ? setTimeout((function() {
                        m(e, (function() {
                            c()
                        }
                        ), n.conf.transitionDuration),
                        r()
                    }
                    ), this.conf.openingInterval) : (r(),
                    c())
                }
                this.trigger("openPanel:after", [e])
            }
        }
        ,
        e.prototype.closePanel = function(e) {
            this.trigger("closePanel:before", [e]);
            var t = e.parentElement;
            t.matches(".mm-listitem_vertical") && (t.classList.remove("mm-listitem_opened"),
            e.classList.add("mm-hidden"),
            this.trigger("closePanel", [e])),
            this.trigger("closePanel:after", [e])
        }
        ,
        e.prototype.closeAllPanels = function(e) {
            this.trigger("closeAllPanels:before"),
            this.node.pnls.querySelectorAll(".mm-listitem").forEach((function(e) {
                e.classList.remove("mm-listitem_selected"),
                e.classList.remove("mm-listitem_opened")
            }
            ));
            var t = y(this.node.pnls, ".mm-panel")
              , n = e || t[0];
            y(this.node.pnls, ".mm-panel").forEach((function(e) {
                e !== n && (e.classList.remove("mm-panel_opened"),
                e.classList.remove("mm-panel_opened-parent"),
                e.classList.remove("mm-panel_highest"),
                e.classList.add("mm-hidden"))
            }
            )),
            this.openPanel(n, !1),
            this.trigger("closeAllPanels:after")
        }
        ,
        e.prototype.togglePanel = function(e) {
            var t = e.parentElement;
            t.matches(".mm-listitem_vertical") && this[t.matches(".mm-listitem_opened") ? "closePanel" : "openPanel"](e)
        }
        ,
        e.prototype.setSelected = function(e) {
            this.trigger("setSelected:before", [e]),
            _(this.node.menu, ".mm-listitem_selected").forEach((function(e) {
                e.classList.remove("mm-listitem_selected")
            }
            )),
            e.classList.add("mm-listitem_selected"),
            this.trigger("setSelected:after", [e])
        }
        ,
        e.prototype.bind = function(e, t) {
            this.hook[e] = this.hook[e] || [],
            this.hook[e].push(t)
        }
        ,
        e.prototype.trigger = function(e, t) {
            if (this.hook[e])
                for (var n = 0, i = this.hook[e].length; n < i; n++)
                    this.hook[e][n].apply(this, t)
        }
        ,
        e.prototype._initAPI = function() {
            var e = this
              , t = this;
            this.API = {},
            this._api.forEach((function(n) {
                e.API[n] = function() {
                    var e = t[n].apply(t, arguments);
                    return void 0 === e ? t.API : e
                }
            }
            )),
            this.node.menu.mmApi = this.API
        }
        ,
        e.prototype._initHooks = function() {
            for (var e in this.opts.hooks)
                this.bind(e, this.opts.hooks[e])
        }
        ,
        e.prototype._initWrappers = function() {
            this.trigger("initWrappers:before");
            for (var t = 0; t < this.opts.wrappers.length; t++) {
                var n = e.wrappers[this.opts.wrappers[t]];
                "function" == typeof n && n.call(this)
            }
            this.trigger("initWrappers:after")
        }
        ,
        e.prototype._initAddons = function() {
            for (var t in this.trigger("initAddons:before"),
            e.addons)
                e.addons[t].call(this);
            this.trigger("initAddons:after")
        }
        ,
        e.prototype._initExtensions = function() {
            var e = this;
            this.trigger("initExtensions:before"),
            "array" == r(this.opts.extensions) && (this.opts.extensions = {
                all: this.opts.extensions
            }),
            Object.keys(this.opts.extensions).forEach((function(t) {
                var n = e.opts.extensions[t].map((function(e) {
                    return "mm-menu_" + e
                }
                ));
                n.length && k(t, (function() {
                    n.forEach((function(t) {
                        e.node.menu.classList.add(t)
                    }
                    ))
                }
                ), (function() {
                    n.forEach((function(t) {
                        e.node.menu.classList.remove(t)
                    }
                    ))
                }
                ))
            }
            )),
            this.trigger("initExtensions:after")
        }
        ,
        e.prototype._initMenu = function() {
            var e = this;
            this.trigger("initMenu:before"),
            this.node.wrpr = this.node.wrpr || this.node.menu.parentElement,
            this.node.wrpr.classList.add("mm-wrapper"),
            this.node.menu.id = this.node.menu.id || l();
            var t = g("div.mm-panels");
            y(this.node.menu).forEach((function(n) {
                e.conf.panelNodetype.indexOf(n.nodeName.toLowerCase()) > -1 && t.append(n)
            }
            )),
            this.node.menu.append(t),
            this.node.pnls = t,
            this.node.menu.classList.add("mm-menu"),
            this.trigger("initMenu:after")
        }
        ,
        e.prototype._initPanels = function() {
            var e = this;
            this.trigger("initPanels:before"),
            this.clck.push((function(t, n) {
                if (n.inMenu) {
                    var i = t.getAttribute("href");
                    if (i && i.length > 1 && "#" == i.slice(0, 1))
                        try {
                            var s = _(e.node.menu, i)[0];
                            if (s && s.matches(".mm-panel"))
                                return t.parentElement.matches(".mm-listitem_vertical") ? e.togglePanel(s) : e.openPanel(s),
                                !0
                        } catch (e) {}
                }
            }
            )),
            y(this.node.pnls).forEach((function(t) {
                e.initPanel(t)
            }
            )),
            this.trigger("initPanels:after")
        }
        ,
        e.prototype.initPanel = function(e) {
            var t = this
              , n = this.conf.panelNodetype.join(", ");
            if (e.matches(n) && (e.matches(".mm-panel") || (e = this._initPanel(e)),
            e)) {
                var i = [];
                i.push.apply(i, y(e, "." + this.conf.classNames.panel)),
                y(e, ".mm-listview").forEach((function(e) {
                    y(e, ".mm-listitem").forEach((function(e) {
                        i.push.apply(i, y(e, n))
                    }
                    ))
                }
                )),
                i.forEach((function(e) {
                    t.initPanel(e)
                }
                ))
            }
        }
        ,
        e.prototype._initPanel = function(e) {
            var t = this;
            if (this.trigger("initPanel:before", [e]),
            x(e, this.conf.classNames.panel, "mm-panel"),
            x(e, this.conf.classNames.nopanel, "mm-nopanel"),
            x(e, this.conf.classNames.inset, "mm-listview_inset"),
            e.matches(".mm-listview_inset") && e.classList.add("mm-nopanel"),
            e.matches(".mm-nopanel"))
                return null;
            var n = e.id || l()
              , i = e.matches("." + this.conf.classNames.vertical) || !this.opts.slidingSubmenus;
            if (e.classList.remove(this.conf.classNames.vertical),
            e.matches("ul, ol")) {
                e.removeAttribute("id");
                var s = g("div");
                e.before(s),
                s.append(e),
                e = s
            }
            e.id = n,
            e.classList.add("mm-panel"),
            e.classList.add("mm-hidden");
            var a = [e.parentElement].filter((function(e) {
                return e.matches("li")
            }
            ))[0];
            if (i ? a && a.classList.add("mm-listitem_vertical") : this.node.pnls.append(e),
            a && (a.mmChild = e,
            e.mmParent = a,
            a && a.matches(".mm-listitem") && !y(a, ".mm-btn").length)) {
                var o = y(a, ".mm-listitem__text")[0];
                if (o) {
                    var r = g("a.mm-btn.mm-btn_next.mm-listitem__btn");
                    r.setAttribute("href", "#" + e.id),
                    o.matches("span") ? (r.classList.add("mm-listitem__text"),
                    r.innerHTML = o.innerHTML,
                    a.insertBefore(r, o.nextElementSibling),
                    o.remove()) : a.insertBefore(r, y(a, ".mm-panel")[0])
                }
            }
            return this._initNavbar(e),
            y(e, "ul, ol").forEach((function(e) {
                t.initListview(e)
            }
            )),
            this.trigger("initPanel:after", [e]),
            e
        }
        ,
        e.prototype._initNavbar = function(e) {
            if (this.trigger("initNavbar:before", [e]),
            !y(e, ".mm-navbar").length) {
                var t = null
                  , n = null;
                if (e.getAttribute("data-mm-parent") ? n = _(this.node.pnls, e.getAttribute("data-mm-parent"))[0] : (t = e.mmParent) && (n = t.closest(".mm-panel")),
                !t || !t.matches(".mm-listitem_vertical")) {
                    var i = g("div.mm-navbar");
                    if (this.opts.navbar.add ? this.opts.navbar.sticky && i.classList.add("mm-navbar_sticky") : i.classList.add("mm-hidden"),
                    n) {
                        var s = g("a.mm-btn.mm-btn_prev.mm-navbar__btn");
                        s.setAttribute("href", "#" + n.id),
                        i.append(s)
                    }
                    var a = null;
                    t ? a = y(t, ".mm-listitem__text")[0] : n && (a = _(n, 'a[href="#' + e.id + '"]')[0]);
                    var o = g("a.mm-navbar__title")
                      , r = g("span");
                    switch (o.append(r),
                    r.innerHTML = e.getAttribute("data-mm-title") || (a ? a.textContent : "") || this.i18n(this.opts.navbar.title) || this.i18n("Menu"),
                    this.opts.navbar.titleLink) {
                    case "anchor":
                        a && o.setAttribute("href", a.getAttribute("href"));
                        break;
                    case "parent":
                        n && o.setAttribute("href", "#" + n.id)
                    }
                    i.append(o),
                    e.prepend(i),
                    this.trigger("initNavbar:after", [e])
                }
            }
        }
        ,
        e.prototype.initListview = function(e) {
            var t = this;
            this.trigger("initListview:before", [e]),
            x(e, this.conf.classNames.nolistview, "mm-nolistview"),
            e.matches(".mm-nolistview") || (e.classList.add("mm-listview"),
            y(e).forEach((function(e) {
                e.classList.add("mm-listitem"),
                x(e, t.conf.classNames.selected, "mm-listitem_selected"),
                y(e, "a, span").forEach((function(e) {
                    e.matches(".mm-btn") || e.classList.add("mm-listitem__text")
                }
                ))
            }
            ))),
            this.trigger("initListview:after", [e])
        }
        ,
        e.prototype._initOpened = function() {
            this.trigger("initOpened:before");
            var e = this.node.pnls.querySelectorAll(".mm-listitem_selected")
              , t = null;
            e.forEach((function(e) {
                t = e,
                e.classList.remove("mm-listitem_selected")
            }
            )),
            t && t.classList.add("mm-listitem_selected");
            var n = t ? t.closest(".mm-panel") : y(this.node.pnls, ".mm-panel")[0];
            this.openPanel(n, !1),
            this.trigger("initOpened:after")
        }
        ,
        e.prototype._initAnchors = function() {
            var e = this;
            this.trigger("initAnchors:before"),
            document.addEventListener("click", (function(t) {
                var n = t.target.closest("a[href]");
                if (n) {
                    for (var i = {
                        inMenu: n.closest(".mm-menu") === e.node.menu,
                        inListview: n.matches(".mm-listitem > a"),
                        toExternal: n.matches('[rel="external"]') || n.matches('[target="_blank"]')
                    }, s = {
                        close: null,
                        setSelected: null,
                        preventDefault: "#" == n.getAttribute("href").slice(0, 1)
                    }, a = 0; a < e.clck.length; a++) {
                        var m = e.clck[a].call(e, n, i);
                        if (m) {
                            if ("boolean" == typeof m)
                                return void t.preventDefault();
                            "object" == r(m) && (s = o(m, s))
                        }
                    }
                    i.inMenu && i.inListview && !i.toExternal && (c(n, e.opts.onClick.setSelected, s.setSelected) && e.setSelected(n.parentElement),
                    c(n, e.opts.onClick.preventDefault, s.preventDefault) && t.preventDefault(),
                    c(n, e.opts.onClick.close, s.close) && e.opts.offCanvas && "function" == typeof e.close && e.close())
                }
            }
            ), !0),
            this.trigger("initAnchors:after")
        }
        ,
        e.prototype.i18n = function(e) {
            return function(e, t) {
                return "string" == typeof t && void 0 !== u[t] && u[t][e] || e
            }(e, this.conf.language)
        }
        ,
        e.version = i.a,
        e.options = s,
        e.configs = a,
        e.addons = {},
        e.wrappers = {},
        e.node = {},
        e.vars = {},
        e
    }()
      , A = {
        blockUI: !0,
        moveBackground: !0
    };
    var T = {
        clone: !1,
        menu: {
            insertMethod: "prepend",
            insertSelector: "body"
        },
        page: {
            nodetype: "div",
            selector: null,
            noSelector: []
        }
    };
    function C(e) {
        return e ? e.charAt(0).toUpperCase() + e.slice(1) : ""
    }
    function N(e, t, n) {
        var i = t.split(".");
        e[t = "mmEvent" + C(i[0]) + C(i[1])] = e[t] || [],
        e[t].push(n),
        e.addEventListener(i[0], n)
    }
    function H(e, t) {
        var n = t.split(".");
        t = "mmEvent" + C(n[0]) + C(n[1]),
        (e[t] || []).forEach((function(t) {
            e.removeEventListener(n[0], t)
        }
        ))
    }
    M.options.offCanvas = A,
    M.configs.offCanvas = T;
    M.prototype.open = function() {
        var e = this;
        this.trigger("open:before"),
        this.vars.opened || (this._openSetup(),
        setTimeout((function() {
            e._openStart()
        }
        ), this.conf.openingInterval),
        this.trigger("open:after"))
    }
    ,
    M.prototype._openSetup = function() {
        var e = this
          , t = this.opts.offCanvas;
        this.closeAllOthers(),
        function(e, t, n) {
            var i = t.split(".");
            (e[t = "mmEvent" + C(i[0]) + C(i[1])] || []).forEach((function(e) {
                e(n || {})
            }
            ))
        }(window, "resize.page", {
            force: !0
        });
        var n = ["mm-wrapper_opened"];
        t.blockUI && n.push("mm-wrapper_blocking"),
        "modal" == t.blockUI && n.push("mm-wrapper_modal"),
        t.moveBackground && n.push("mm-wrapper_background"),
        n.forEach((function(t) {
            e.node.wrpr.classList.add(t)
        }
        )),
        setTimeout((function() {
            e.vars.opened = !0
        }
        ), this.conf.openingInterval),
        this.node.menu.classList.add("mm-menu_opened")
    }
    ,
    M.prototype._openStart = function() {
        var e = this;
        m(M.node.page, (function() {
            e.trigger("open:finish")
        }
        ), this.conf.transitionDuration),
        this.trigger("open:start"),
        this.node.wrpr.classList.add("mm-wrapper_opening")
    }
    ,
    M.prototype.close = function() {
        var e = this;
        this.trigger("close:before"),
        this.vars.opened && (m(M.node.page, (function() {
            e.node.menu.classList.remove("mm-menu_opened");
            ["mm-wrapper_opened", "mm-wrapper_blocking", "mm-wrapper_modal", "mm-wrapper_background"].forEach((function(t) {
                e.node.wrpr.classList.remove(t)
            }
            )),
            e.vars.opened = !1,
            e.trigger("close:finish")
        }
        ), this.conf.transitionDuration),
        this.trigger("close:start"),
        this.node.wrpr.classList.remove("mm-wrapper_opening"),
        this.trigger("close:after"))
    }
    ,
    M.prototype.closeAllOthers = function() {
        var e = this;
        _(document.body, ".mm-menu_offcanvas").forEach((function(t) {
            if (t !== e.node.menu) {
                var n = t.mmApi;
                n && n.close && n.close()
            }
        }
        ))
    }
    ,
    M.prototype.setPage = function(e) {
        this.trigger("setPage:before", [e]);
        var t = this.conf.offCanvas;
        if (!e) {
            var n = "string" == typeof t.page.selector ? _(document.body, t.page.selector) : y(document.body, t.page.nodetype);
            if (n = n.filter((function(e) {
                return !e.matches(".mm-menu, .mm-wrapper__blocker")
            }
            )),
            t.page.noSelector.length && (n = n.filter((function(e) {
                return !e.matches(t.page.noSelector.join(", "))
            }
            ))),
            n.length > 1) {
                var i = g("div");
                n[0].before(i),
                n.forEach((function(e) {
                    i.append(e)
                }
                )),
                n = [i]
            }
            e = n[0]
        }
        e.classList.add("mm-page"),
        e.classList.add("mm-slideout"),
        e.id = e.id || l(),
        M.node.page = e,
        this.trigger("setPage:after", [e])
    }
    ;
    var j = function() {
        var e = this;
        H(document.body, "keydown.tabguard"),
        N(document.body, "keydown.tabguard", (function(t) {
            9 == t.keyCode && e.node.wrpr.matches(".mm-wrapper_opened") && t.preventDefault()
        }
        ))
    }
      , D = function() {
        var e = this;
        this.trigger("initBlocker:before");
        var t = this.opts.offCanvas
          , n = this.conf.offCanvas;
        if (t.blockUI) {
            if (!M.node.blck) {
                var i = g("div.mm-wrapper__blocker.mm-slideout");
                i.innerHTML = "<a></a>",
                document.querySelector(n.menu.insertSelector).append(i),
                M.node.blck = i
            }
            var s = function(t) {
                t.preventDefault(),
                t.stopPropagation(),
                e.node.wrpr.matches(".mm-wrapper_modal") || e.close()
            };
            M.node.blck.addEventListener("mousedown", s),
            M.node.blck.addEventListener("touchstart", s),
            M.node.blck.addEventListener("touchmove", s),
            this.trigger("initBlocker:after")
        }
    }
      , O = {
        aria: !0,
        text: !0
    };
    var I = {
        text: {
            closeMenu: "Close menu",
            closeSubmenu: "Close submenu",
            openSubmenu: "Open submenu",
            toggleSubmenu: "Toggle submenu"
        }
    }
      , q = {
        "Close menu": "بستن منو",
        "Close submenu": "بستن زیرمنو",
        "Open submenu": "بازکردن زیرمنو",
        "Toggle submenu": "سوییچ زیرمنو"
    }
      , B = {
        "Close menu": "Menü schließen",
        "Close submenu": "Untermenü schließen",
        "Open submenu": "Untermenü öffnen",
        "Toggle submenu": "Untermenü wechseln"
    }
      , z = {
        "Close menu": "Закрыть меню",
        "Close submenu": "Закрыть подменю",
        "Open submenu": "Открыть подменю",
        "Toggle submenu": "Переключить подменю"
    };
    f({
        "Close menu": "Menu sluiten",
        "Close submenu": "Submenu sluiten",
        "Open submenu": "Submenu openen",
        "Toggle submenu": "Submenu wisselen"
    }, "nl"),
    f(q, "fa"),
    f(B, "de"),
    f(z, "ru"),
    M.options.screenReader = O,
    M.configs.screenReader = I;
    var R;
    R = function(e, t, n) {
        e[t] = n,
        n ? e.setAttribute(t, n.toString()) : e.removeAttribute(t)
    }
    ,
    M.sr_aria = function(e, t, n) {
        R(e, "aria-" + t, n)
    }
    ,
    M.sr_role = function(e, t) {
        R(e, "role", t)
    }
    ,
    M.sr_text = function(e) {
        return '<span class="mm-sronly">' + e + "</span>"
    }
    ;
    var U = {
        fix: !0
    };
    var W = "ontouchstart"in window || !!navigator.msMaxTouchPoints || !1;
    M.options.scrollBugFix = U;
    var Y = {
        height: "default"
    };
    M.options.autoHeight = Y;
    var F = {
        close: !1,
        open: !1
    };
    M.options.backButton = F;
    var X = {
        add: !1,
        visible: {
            min: 1,
            max: 3
        }
    };
    M.options.columns = X;
    var V = {
        add: !1,
        addTo: "panels",
        count: !1
    };
    M.options.counters = V,
    M.configs.classNames.counters = {
        counter: "Counter"
    };
    var Z = {
        add: !1,
        addTo: "panels"
    };
    M.options.dividers = Z,
    M.configs.classNames.divider = "Divider";
    var G = {
        open: !1,
        node: null
    };
    var J = "ontouchstart"in window || !!navigator.msMaxTouchPoints || !1
      , K = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
      , Q = {
        start: 15,
        swipe: 15
    }
      , $ = {
        x: ["Right", "Left"],
        y: ["Down", "Up"]
    }
      , ee = 0
      , te = 1
      , ne = 2
      , ie = function(e, t) {
        return "string" == typeof e && "%" == e.slice(-1) && (e = t * ((e = parseInt(e.slice(0, -1), 10)) / 100)),
        e
    }
      , se = function() {
        function e(e, t, n) {
            this.surface = e,
            this.area = o(t, K),
            this.treshold = o(n, Q),
            this.surface.mmHasDragEvents || (this.surface.addEventListener(J ? "touchstart" : "mousedown", this.start.bind(this)),
            this.surface.addEventListener(J ? "touchend" : "mouseup", this.stop.bind(this)),
            this.surface.addEventListener(J ? "touchleave" : "mouseleave", this.stop.bind(this)),
            this.surface.addEventListener(J ? "touchmove" : "mousemove", this.move.bind(this))),
            this.surface.mmHasDragEvents = !0
        }
        return e.prototype.start = function(e) {
            this.currentPosition = {
                x: e.touches ? e.touches[0].pageX : e.pageX || 0,
                y: e.touches ? e.touches[0].pageY : e.pageY || 0
            };
            var t = this.surface.clientWidth
              , n = this.surface.clientHeight
              , i = ie(this.area.top, n);
            if (!("number" == typeof i && this.currentPosition.y < i)) {
                var s = ie(this.area.right, t);
                if (!("number" == typeof s && (s = t - s,
                this.currentPosition.x > s))) {
                    var a = ie(this.area.bottom, n);
                    if (!("number" == typeof a && (a = n - a,
                    this.currentPosition.y > a))) {
                        var o = ie(this.area.left, t);
                        "number" == typeof o && this.currentPosition.x < o || (this.startPosition = {
                            x: this.currentPosition.x,
                            y: this.currentPosition.y
                        },
                        this.state = te)
                    }
                }
            }
        }
        ,
        e.prototype.stop = function(e) {
            if (this.state == ne) {
                var t = this._dragDirection()
                  , n = this._eventDetail(t);
                if (this._dispatchEvents("drag*End", n),
                Math.abs(this.movement[this.axis]) > this.treshold.swipe) {
                    var i = this._swipeDirection();
                    n.direction = i,
                    this._dispatchEvents("swipe*", n)
                }
            }
            this.state = ee
        }
        ,
        e.prototype.move = function(e) {
            switch (this.state) {
            case te:
            case ne:
                var t = {
                    x: e.changedTouches ? e.touches[0].pageX : e.pageX || 0,
                    y: e.changedTouches ? e.touches[0].pageY : e.pageY || 0
                };
                this.movement = {
                    x: t.x - this.currentPosition.x,
                    y: t.y - this.currentPosition.y
                },
                this.distance = {
                    x: t.x - this.startPosition.x,
                    y: t.y - this.startPosition.y
                },
                this.currentPosition = {
                    x: t.x,
                    y: t.y
                },
                this.axis = Math.abs(this.distance.x) > Math.abs(this.distance.y) ? "x" : "y";
                var n = this._dragDirection()
                  , i = this._eventDetail(n);
                this.state == te && Math.abs(this.distance[this.axis]) > this.treshold.start && (this._dispatchEvents("drag*Start", i),
                this.state = ne),
                this.state == ne && this._dispatchEvents("drag*Move", i)
            }
        }
        ,
        e.prototype._eventDetail = function(e) {
            var t = this.distance.x
              , n = this.distance.y;
            return "x" == this.axis && (t -= t > 0 ? this.treshold.start : 0 - this.treshold.start),
            "y" == this.axis && (n -= n > 0 ? this.treshold.start : 0 - this.treshold.start),
            {
                axis: this.axis,
                direction: e,
                movementX: this.movement.x,
                movementY: this.movement.y,
                distanceX: t,
                distanceY: n
            }
        }
        ,
        e.prototype._dispatchEvents = function(e, t) {
            var n = new CustomEvent(e.replace("*", ""),{
                detail: t
            });
            this.surface.dispatchEvent(n);
            var i = new CustomEvent(e.replace("*", this.axis.toUpperCase()),{
                detail: t
            });
            this.surface.dispatchEvent(i);
            var s = new CustomEvent(e.replace("*", t.direction),{
                detail: t
            });
            this.surface.dispatchEvent(s)
        }
        ,
        e.prototype._dragDirection = function() {
            return $[this.axis][this.distance[this.axis] > 0 ? 0 : 1]
        }
        ,
        e.prototype._swipeDirection = function() {
            return $[this.axis][this.movement[this.axis] > 0 ? 0 : 1]
        }
        ,
        e
    }()
      , ae = null
      , oe = null
      , re = 0
      , ce = function(e) {
        var t = this
          , n = {}
          , i = !1
          , s = function() {
            var e = Object.keys(t.opts.extensions);
            e.length ? (k(e.join(", "), (function() {}
            ), (function() {
                n = me(n, [], t.node.menu)
            }
            )),
            e.forEach((function(e) {
                k(e, (function() {
                    n = me(n, t.opts.extensions[e], t.node.menu)
                }
                ), (function() {}
                ))
            }
            ))) : n = me(n, [], t.node.menu)
        };
        oe && (H(oe, "dragStart"),
        H(oe, "dragMove"),
        H(oe, "dragEnd")),
        ae = new se(oe = e),
        s(),
        s = function() {}
        ,
        oe && (N(oe, "dragStart", (function(e) {
            e.detail.direction == n.direction && (i = !0,
            t.node.wrpr.classList.add("mm-wrapper_dragging"),
            t._openSetup(),
            t.trigger("open:start"),
            re = t.node.menu["x" == n.axis ? "clientWidth" : "clientHeight"])
        }
        )),
        N(oe, "dragMove", (function(e) {
            if (e.detail.axis == n.axis && i) {
                var t = e.detail["distance" + n.axis.toUpperCase()];
                switch (n.position) {
                case "right":
                case "bottom":
                    t = Math.min(Math.max(t, -re), 0);
                    break;
                default:
                    t = Math.max(Math.min(t, re), 0)
                }
                if ("front" == n.zposition)
                    switch (n.position) {
                    case "right":
                    case "bottom":
                        t += re;
                        break;
                    default:
                        t -= re
                    }
                n.slideOutNodes.forEach((function(e) {
                    e.style.transform = "translate" + n.axis.toUpperCase() + "(" + t + "px)"
                }
                ))
            }
        }
        )),
        N(oe, "dragEnd", (function(e) {
            if (e.detail.axis == n.axis && i) {
                i = !1,
                t.node.wrpr.classList.remove("mm-wrapper_dragging"),
                n.slideOutNodes.forEach((function(e) {
                    e.style.transform = ""
                }
                ));
                var s = Math.abs(e.detail["distance" + n.axis.toUpperCase()]) >= .75 * re;
                if (!s) {
                    var a = e.detail["movement" + n.axis.toUpperCase()];
                    switch (n.position) {
                    case "right":
                    case "bottom":
                        s = a <= 0;
                        break;
                    default:
                        s = a >= 0
                    }
                }
                s ? t._openStart() : t.close()
            }
        }
        )))
    }
      , me = function(e, t, n) {
        switch (e.position = "left",
        e.zposition = "back",
        ["right", "top", "bottom"].forEach((function(n) {
            t.indexOf("position-" + n) > -1 && (e.position = n)
        }
        )),
        ["front", "top", "bottom"].forEach((function(n) {
            t.indexOf("position-" + n) > -1 && (e.zposition = "front")
        }
        )),
        ae.area = {
            top: "bottom" == e.position ? "75%" : 0,
            right: "left" == e.position ? "75%" : 0,
            bottom: "top" == e.position ? "75%" : 0,
            left: "right" == e.position ? "75%" : 0
        },
        e.position) {
        case "top":
        case "bottom":
            e.axis = "y";
            break;
        default:
            e.axis = "x"
        }
        switch (e.position) {
        case "top":
            e.direction = "Down";
            break;
        case "right":
            e.direction = "Left";
            break;
        case "bottom":
            e.direction = "Up";
            break;
        default:
            e.direction = "Right"
        }
        switch (e.zposition) {
        case "front":
            e.slideOutNodes = [n];
            break;
        default:
            e.slideOutNodes = _(document.body, ".mm-slideout")
        }
        return e
    };
    M.options.drag = G;
    var le = {
        drop: !1,
        fitViewport: !0,
        event: "click",
        position: {},
        tip: !0
    };
    var de = {
        offset: {
            button: {
                x: -5,
                y: 5
            },
            viewport: {
                x: 20,
                y: 20
            }
        },
        height: {
            max: 880
        },
        width: {
            max: 440
        }
    };
    M.options.dropdown = le,
    M.configs.dropdown = de;
    var pe = {
        insertMethod: "append",
        insertSelector: "body"
    };
    M.configs.fixedElements = pe,
    M.configs.classNames.fixedElements = {
        fixed: "Fixed"
    };
    var ue = {
        use: !1,
        top: [],
        bottom: [],
        position: "left",
        type: "default"
    };
    M.options.iconbar = ue;
    var fe = {
        add: !1,
        blockPanel: !0,
        hideDivider: !1,
        hideNavbar: !0,
        visible: 3
    };
    M.options.iconPanels = fe;
    var he = {
        enable: !1,
        enhance: !1
    };
    M.options.keyboardNavigation = he;
    var ve = function(e) {
        var t = this;
        H(document.body, "keydown.tabguard"),
        H(document.body, "focusin.tabguard"),
        N(document.body, "focusin.tabguard", (function(e) {
            if (t.node.wrpr.matches(".mm-wrapper_opened")) {
                var n = e.target;
                if (n.matches(".mm-tabend")) {
                    var i = void 0;
                    n.parentElement.matches(".mm-menu") && M.node.blck && (i = M.node.blck),
                    n.parentElement.matches(".mm-wrapper__blocker") && (i = _(document.body, ".mm-menu_offcanvas.mm-menu_opened")[0]),
                    i || (i = n.parentElement),
                    i && y(i, ".mm-tabstart")[0].focus()
                }
            }
        }
        )),
        H(document.body, "keydown.navigate"),
        N(document.body, "keydown.navigate", (function(t) {
            var n = t.target
              , i = n.closest(".mm-menu");
            if (i) {
                i.mmApi;
                if (!n.matches("input, textarea"))
                    switch (t.keyCode) {
                    case 13:
                        (n.matches(".mm-toggle") || n.matches(".mm-check")) && n.dispatchEvent(new Event("click"));
                        break;
                    case 32:
                    case 37:
                    case 38:
                    case 39:
                    case 40:
                        t.preventDefault()
                    }
                if (e)
                    if (n.matches("input"))
                        switch (t.keyCode) {
                        case 27:
                            n.value = ""
                        }
                    else {
                        var s = i.mmApi;
                        switch (t.keyCode) {
                        case 8:
                            var a = _(i, ".mm-panel_opened")[0].mmParent;
                            a && s.openPanel(a.closest(".mm-panel"));
                            break;
                        case 27:
                            i.matches(".mm-menu_offcanvas") && s.close()
                        }
                    }
            }
        }
        ))
    }
      , be = {
        load: !1
    };
    M.options.lazySubmenus = be;
    var ge = [];
    var _e = {
        breadcrumbs: {
            separator: "/",
            removeFirst: !1
        }
    };
    function ye() {
        var e = this
          , t = this.opts.navbars;
        if (void 0 !== t) {
            t instanceof Array || (t = [t]);
            var n = {};
            t.length && (t.forEach((function(t) {
                if (!(t = function(e) {
                    return "boolean" == typeof e && e && (e = {}),
                    "object" != typeof e && (e = {}),
                    void 0 === e.content && (e.content = ["prev", "title"]),
                    e.content instanceof Array || (e.content = [e.content]),
                    void 0 === e.use && (e.use = !0),
                    "boolean" == typeof e.use && e.use && (e.use = !0),
                    e
                }(t)).use)
                    return !1;
                var i = g("div.mm-navbar")
                  , s = t.position;
                "bottom" !== s && (s = "top"),
                n[s] || (n[s] = g("div.mm-navbars_" + s)),
                n[s].append(i);
                for (var a = 0, o = t.content.length; a < o; a++) {
                    var r, c = t.content[a];
                    if ("string" == typeof c)
                        if ("function" == typeof (r = ye.navbarContents[c]))
                            r.call(e, i);
                        else {
                            var m = g("span");
                            m.innerHTML = c;
                            var l = y(m);
                            1 == l.length && (m = l[0]),
                            i.append(m)
                        }
                    else
                        i.append(c)
                }
                "string" == typeof t.type && ("function" == typeof (r = ye.navbarTypes[t.type]) && r.call(e, i));
                "boolean" != typeof t.use && k(t.use, (function() {
                    i.classList.remove("mm-hidden"),
                    M.sr_aria(i, "hidden", !1)
                }
                ), (function() {
                    i.classList.add("mm-hidden"),
                    M.sr_aria(i, "hidden", !0)
                }
                ))
            }
            )),
            this.bind("initMenu:after", (function() {
                for (var t in n)
                    e.node.menu["bottom" == t ? "append" : "prepend"](n[t])
            }
            )))
        }
    }
    M.options.navbars = ge,
    M.configs.navbars = _e,
    M.configs.classNames.navbars = {
        panelPrev: "Prev",
        panelTitle: "Title"
    },
    ye.navbarContents = {
        breadcrumbs: function(e) {
            var t = this
              , n = g("div.mm-navbar__breadcrumbs");
            e.append(n),
            this.bind("initNavbar:after", (function(e) {
                if (!e.querySelector(".mm-navbar__breadcrumbs")) {
                    y(e, ".mm-navbar")[0].classList.add("mm-hidden");
                    for (var n = [], i = g("span.mm-navbar__breadcrumbs"), s = e, a = !0; s; ) {
                        if (!(s = s.closest(".mm-panel")).parentElement.matches(".mm-listitem_vertical")) {
                            var o = _(s, ".mm-navbar__title span")[0];
                            if (o) {
                                var r = o.textContent;
                                r.length && n.unshift(a ? "<span>" + r + "</span>" : '<a href="#' + s.id + '">' + r + "</a>")
                            }
                            a = !1
                        }
                        s = s.mmParent
                    }
                    t.conf.navbars.breadcrumbs.removeFirst && n.shift(),
                    i.innerHTML = n.join('<span class="mm-separator">' + t.conf.navbars.breadcrumbs.separator + "</span>"),
                    y(e, ".mm-navbar")[0].append(i)
                }
            }
            )),
            this.bind("openPanel:start", (function(e) {
                var t = e.querySelector(".mm-navbar__breadcrumbs");
                n.innerHTML = t ? t.innerHTML : ""
            }
            )),
            this.bind("initNavbar:after:sr-aria", (function(e) {
                _(e, ".mm-breadcrumbs a").forEach((function(e) {
                    M.sr_aria(e, "owns", e.getAttribute("href").slice(1))
                }
                ))
            }
            ))
        },
        close: function(e) {
            var t = this
              , n = g("a.mm-btn.mm-btn_close.mm-navbar__btn");
            e.append(n),
            this.bind("setPage:after", (function(e) {
                n.setAttribute("href", "#" + e.id)
            }
            )),
            this.bind("setPage:after:sr-text", (function() {
                n.innerHTML = M.sr_text(t.i18n(t.conf.screenReader.text.closeMenu))
            }
            ))
        },
        prev: function(e) {
            var t, n, i, s = this, a = g("a.mm-btn.mm-btn_prev.mm-navbar__btn");
            e.append(a),
            this.bind("initNavbar:after", (function(e) {
                y(e, ".mm-navbar")[0].classList.add("mm-hidden")
            }
            )),
            this.bind("openPanel:start", (function(e) {
                e.parentElement.matches(".mm-listitem_vertical") || ((t = e.querySelector("." + s.conf.classNames.navbars.panelPrev)) || (t = e.querySelector(".mm-navbar__btn.mm-btn_prev")),
                n = t ? t.getAttribute("href") : "",
                i = t ? t.innerHTML : "",
                n ? a.setAttribute("href", n) : a.removeAttribute("href"),
                a.classList[n || i ? "remove" : "add"]("mm-hidden"),
                a.innerHTML = i)
            }
            )),
            this.bind("initNavbar:after:sr-aria", (function(e) {
                M.sr_aria(e.querySelector(".mm-navbar"), "hidden", !0)
            }
            )),
            this.bind("openPanel:start:sr-aria", (function(e) {
                M.sr_aria(a, "hidden", a.matches(".mm-hidden")),
                M.sr_aria(a, "owns", (a.getAttribute("href") || "").slice(1))
            }
            ))
        },
        searchfield: function(e) {
            "object" != r(this.opts.searchfield) && (this.opts.searchfield = {});
            var t = g("div.mm-navbar__searchfield");
            e.append(t),
            this.opts.searchfield.add = !0,
            this.opts.searchfield.addTo = [t]
        },
        title: function(e) {
            var t, n, i, s, a = this, o = g("a.mm-navbar__title"), r = g("span");
            o.append(r),
            e.append(o),
            this.bind("openPanel:start", (function(e) {
                e.parentElement.matches(".mm-listitem_vertical") || ((i = e.querySelector("." + a.conf.classNames.navbars.panelTitle)) || (i = e.querySelector(".mm-navbar__title span")),
                (t = i && i.closest("a") ? i.closest("a").getAttribute("href") : "") ? o.setAttribute("href", t) : o.removeAttribute("href"),
                n = i ? i.innerHTML : "",
                r.innerHTML = n)
            }
            )),
            this.bind("openPanel:start:sr-aria", (function(e) {
                if (a.opts.screenReader.text) {
                    if (!s)
                        y(a.node.menu, ".mm-navbars_top, .mm-navbars_bottom").forEach((function(e) {
                            var t = e.querySelector(".mm-btn_prev");
                            t && (s = t)
                        }
                        ));
                    if (s) {
                        var t = !0;
                        "parent" == a.opts.navbar.titleLink && (t = !s.matches(".mm-hidden")),
                        M.sr_aria(o, "hidden", t)
                    }
                }
            }
            ))
        }
    },
    ye.navbarTypes = {
        tabs: function(e) {
            var t = this;
            e.classList.add("mm-navbar_tabs"),
            e.parentElement.classList.add("mm-navbars_has-tabs");
            var n = y(e, "a");
            e.addEventListener("click", (function(e) {
                var n = e.target;
                if (n.matches("a"))
                    if (n.matches(".mm-navbar__tab_selected"))
                        e.stopImmediatePropagation();
                    else
                        try {
                            t.openPanel(t.node.menu.querySelector(n.getAttribute("href")), !1),
                            e.stopImmediatePropagation()
                        } catch (e) {}
            }
            )),
            this.bind("openPanel:start", (function e(t) {
                n.forEach((function(e) {
                    e.classList.remove("mm-navbar__tab_selected")
                }
                ));
                var i = n.filter((function(e) {
                    return e.matches('[href="#' + t.id + '"]')
                }
                ))[0];
                if (i)
                    i.classList.add("mm-navbar__tab_selected");
                else {
                    var s = t.mmParent;
                    s && e.call(this, s.closest(".mm-panel"))
                }
            }
            ))
        }
    };
    var Le = {
        scroll: !1,
        update: !1
    };
    var we = {
        scrollOffset: 0,
        updateOffset: 50
    };
    M.options.pageScroll = Le,
    M.configs.pageScroll = we;
    var Ee = {
        add: !1,
        addTo: "panels",
        cancel: !1,
        noResults: "No results found.",
        placeholder: "Search",
        panel: {
            add: !1,
            dividers: !0,
            fx: "none",
            id: null,
            splash: null,
            title: "Search"
        },
        search: !0,
        showTextItems: !1,
        showSubPanels: !0
    };
    var xe = {
        clear: !1,
        form: !1,
        input: !1,
        submit: !1
    }
      , Pe = {
        Search: "جستجو",
        "No results found.": "نتیجه‌ای یافت نشد.",
        cancel: "انصراف"
    }
      , ke = {
        Search: "Suche",
        "No results found.": "Keine Ergebnisse gefunden.",
        cancel: "beenden"
    }
      , Se = {
        Search: "Найти",
        "No results found.": "Ничего не найдено.",
        cancel: "отменить"
    }
      , Me = function() {
        for (var e = 0, t = 0, n = arguments.length; t < n; t++)
            e += arguments[t].length;
        var i = Array(e)
          , s = 0;
        for (t = 0; t < n; t++)
            for (var a = arguments[t], o = 0, r = a.length; o < r; o++,
            s++)
                i[s] = a[o];
        return i
    };
    f({
        Search: "Zoeken",
        "No results found.": "Geen resultaten gevonden.",
        cancel: "annuleren"
    }, "nl"),
    f(Pe, "fa"),
    f(ke, "de"),
    f(Se, "ru"),
    M.options.searchfield = Ee,
    M.configs.searchfield = xe;
    var Ae = function() {
        var e = this.opts.searchfield
          , t = (this.conf.searchfield,
        y(this.node.pnls, ".mm-panel_search")[0]);
        if (t)
            return t;
        t = g("div.mm-panel.mm-panel_search.mm-hidden"),
        e.panel.id && (t.id = e.panel.id),
        e.panel.title && t.setAttribute("data-mm-title", e.panel.title);
        var n = g("ul");
        switch (t.append(n),
        this.node.pnls.append(t),
        this.initListview(n),
        this._initNavbar(t),
        e.panel.fx) {
        case !1:
            break;
        case "none":
            t.classList.add("mm-panel_noanimation");
            break;
        default:
            t.classList.add("mm-panel_fx-" + e.panel.fx)
        }
        if (e.panel.splash) {
            var i = g("div.mm-panel__content");
            i.innerHTML = e.panel.splash,
            t.append(i)
        }
        return t.classList.add("mm-panel"),
        t.classList.add("mm-hidden"),
        this.node.pnls.append(t),
        t
    }
      , Te = function(e) {
        var t = this.opts.searchfield
          , n = this.conf.searchfield;
        if (e.parentElement.matches(".mm-listitem_vertical"))
            return null;
        if (a = _(e, ".mm-searchfield")[0])
            return a;
        function i(e, t) {
            if (t)
                for (var n in t)
                    e.setAttribute(n, t[n])
        }
        var s, a = g((n.form ? "form" : "div") + ".mm-searchfield"), o = g("div.mm-searchfield__input"), r = g("input");
        (r.type = "text",
        r.autocomplete = "off",
        r.placeholder = this.i18n(t.placeholder),
        o.append(r),
        a.append(o),
        e.prepend(a),
        i(r, n.input),
        n.clear) && ((s = g("a.mm-btn.mm-btn_close.mm-searchfield__btn")).setAttribute("href", "#"),
        o.append(s));
        (i(a, n.form),
        n.form && n.submit && !n.clear) && ((s = g("a.mm-btn.mm-btn_next.mm-searchfield__btn")).setAttribute("href", "#"),
        o.append(s));
        t.cancel && ((s = g("a.mm-searchfield__cancel")).setAttribute("href", "#"),
        s.textContent = this.i18n("cancel"),
        a.append(s));
        return a
    }
      , Ce = function(e) {
        var t = this
          , n = this.opts.searchfield
          , i = (this.conf.searchfield,
        {});
        e.closest(".mm-panel_search") ? (i.panels = _(this.node.pnls, ".mm-panel"),
        i.noresults = [e.closest(".mm-panel")]) : e.closest(".mm-panel") ? (i.panels = [e.closest(".mm-panel")],
        i.noresults = i.panels) : (i.panels = _(this.node.pnls, ".mm-panel"),
        i.noresults = [this.node.menu]),
        i.panels = i.panels.filter((function(e) {
            return !e.matches(".mm-panel_search")
        }
        )),
        i.panels = i.panels.filter((function(e) {
            return !e.parentElement.matches(".mm-listitem_vertical")
        }
        )),
        i.listitems = [],
        i.dividers = [],
        i.panels.forEach((function(e) {
            var t, n;
            (t = i.listitems).push.apply(t, _(e, ".mm-listitem")),
            (n = i.dividers).push.apply(n, _(e, ".mm-divider"))
        }
        ));
        var s = y(this.node.pnls, ".mm-panel_search")[0]
          , a = _(e, "input")[0]
          , o = _(e, ".mm-searchfield__cancel")[0];
        a.mmSearchfield = i,
        n.panel.add && n.panel.splash && (H(a, "focus.splash"),
        N(a, "focus.splash", (function(e) {
            t.openPanel(s)
        }
        ))),
        n.cancel && (H(a, "focus.cancel"),
        N(a, "focus.cancel", (function(e) {
            o.classList.add("mm-searchfield__cancel-active")
        }
        )),
        H(o, "click.splash"),
        N(o, "click.splash", (function(e) {
            if (e.preventDefault(),
            o.classList.remove("mm-searchfield__cancel-active"),
            s.matches(".mm-panel_opened")) {
                var n = y(t.node.pnls, ".mm-panel_opened-parent");
                n.length && t.openPanel(n[n.length - 1])
            }
        }
        ))),
        n.panel.add && "panel" == n.addTo && this.bind("openPanel:finish", (function(e) {
            e === s && a.focus()
        }
        )),
        H(a, "input.search"),
        N(a, "input.search", (function(e) {
            switch (e.keyCode) {
            case 9:
            case 16:
            case 17:
            case 18:
            case 37:
            case 38:
            case 39:
            case 40:
                break;
            default:
                t.search(a)
            }
        }
        )),
        this.search(a)
    }
      , Ne = function(e) {
        if (e) {
            var t = this.opts.searchfield;
            this.conf.searchfield;
            if (e.closest(".mm-panel") || (e = y(this.node.pnls, ".mm-panel")[0]),
            !y(e, ".mm-panel__noresultsmsg").length) {
                var n = g("div.mm-panel__noresultsmsg.mm-hidden");
                n.innerHTML = this.i18n(t.noResults),
                e.append(n)
            }
        }
    };
    M.prototype.search = function(e, t) {
        var n, i = this, s = this.opts.searchfield;
        this.conf.searchfield;
        t = (t = t || "" + e.value).toLowerCase().trim();
        var a = e.mmSearchfield
          , o = _(e.closest(".mm-searchfield"), ".mm-btn")
          , r = y(this.node.pnls, ".mm-panel_search")[0]
          , c = a.panels
          , m = a.noresults
          , l = a.listitems
          , d = a.dividers;
        if (l.forEach((function(e) {
            e.classList.remove("mm-listitem_nosubitems"),
            e.classList.remove("mm-listitem_onlysubitems"),
            e.classList.remove("mm-hidden")
        }
        )),
        r && (y(r, ".mm-listview")[0].innerHTML = ""),
        c.forEach((function(e) {
            e.scrollTop = 0
        }
        )),
        t.length) {
            d.forEach((function(e) {
                e.classList.add("mm-hidden")
            }
            )),
            l.forEach((function(e) {
                var n, i = y(e, ".mm-listitem__text")[0], a = !1;
                i && (n = i,
                Array.prototype.slice.call(n.childNodes).filter((function(e) {
                    return 3 == e.nodeType
                }
                )).map((function(e) {
                    return e.textContent
                }
                )).join(" ")).toLowerCase().indexOf(t) > -1 && (i.matches(".mm-listitem__btn") ? s.showSubPanels && (a = !0) : (i.matches("a") || s.showTextItems) && (a = !0)),
                a || e.classList.add("mm-hidden")
            }
            ));
            var p = l.filter((function(e) {
                return !e.matches(".mm-hidden")
            }
            )).length;
            if (s.panel.add) {
                var u = [];
                c.forEach((function(e) {
                    var t = w(_(e, ".mm-listitem"));
                    if ((t = t.filter((function(e) {
                        return !e.matches(".mm-hidden")
                    }
                    ))).length) {
                        if (s.panel.dividers) {
                            var n = g("li.mm-divider")
                              , i = _(e, ".mm-navbar__title")[0];
                            i && (n.innerHTML = i.innerHTML,
                            u.push(n))
                        }
                        t.forEach((function(e) {
                            u.push(e.cloneNode(!0))
                        }
                        ))
                    }
                }
                )),
                u.forEach((function(e) {
                    e.querySelectorAll(".mm-toggle, .mm-check").forEach((function(e) {
                        e.remove()
                    }
                    ))
                }
                )),
                (n = y(r, ".mm-listview")[0]).append.apply(n, u),
                this.openPanel(r)
            } else
                s.showSubPanels && c.forEach((function(e) {
                    w(_(e, ".mm-listitem")).forEach((function(e) {
                        var t = e.mmChild;
                        t && _(t, ".mm-listitem").forEach((function(e) {
                            e.classList.remove("mm-hidden")
                        }
                        ))
                    }
                    ))
                }
                )),
                Me(c).reverse().forEach((function(t, n) {
                    var s = t.mmParent;
                    s && (w(_(t, ".mm-listitem")).length ? (s.matches(".mm-hidden") && s.classList.remove("mm-hidden"),
                    s.classList.add("mm-listitem_onlysubitems")) : e.closest(".mm-panel") || ((t.matches(".mm-panel_opened") || t.matches(".mm-panel_opened-parent")) && setTimeout((function() {
                        i.openPanel(s.closest(".mm-panel"))
                    }
                    ), (n + 1) * (1.5 * i.conf.openingInterval)),
                    s.classList.add("mm-listitem_nosubitems")))
                }
                )),
                c.forEach((function(e) {
                    w(_(e, ".mm-listitem")).forEach((function(e) {
                        L(e, ".mm-listitem_vertical").forEach((function(e) {
                            e.matches(".mm-hidden") && (e.classList.remove("mm-hidden"),
                            e.classList.add("mm-listitem_onlysubitems"))
                        }
                        ))
                    }
                    ))
                }
                )),
                c.forEach((function(e) {
                    w(_(e, ".mm-listitem")).forEach((function(e) {
                        var t = function(e, t) {
                            for (var n = [], i = e.previousElementSibling; i; )
                                t && !i.matches(t) || n.push(i),
                                i = i.previousElementSibling;
                            return n
                        }(e, ".mm-divider")[0];
                        t && t.classList.remove("mm-hidden")
                    }
                    ))
                }
                ));
            o.forEach((function(e) {
                return e.classList.remove("mm-hidden")
            }
            )),
            m.forEach((function(e) {
                _(e, ".mm-panel__noresultsmsg").forEach((function(e) {
                    return e.classList[p ? "add" : "remove"]("mm-hidden")
                }
                ))
            }
            )),
            s.panel.add && (s.panel.splash && _(r, ".mm-panel__content").forEach((function(e) {
                return e.classList.add("mm-hidden")
            }
            )),
            l.forEach((function(e) {
                return e.classList.remove("mm-hidden")
            }
            )),
            d.forEach((function(e) {
                return e.classList.remove("mm-hidden")
            }
            )))
        } else if (l.forEach((function(e) {
            return e.classList.remove("mm-hidden")
        }
        )),
        d.forEach((function(e) {
            return e.classList.remove("mm-hidden")
        }
        )),
        o.forEach((function(e) {
            return e.classList.add("mm-hidden")
        }
        )),
        m.forEach((function(e) {
            _(e, ".mm-panel__noresultsmsg").forEach((function(e) {
                return e.classList.add("mm-hidden")
            }
            ))
        }
        )),
        s.panel.add)
            if (s.panel.splash)
                _(r, ".mm-panel__content").forEach((function(e) {
                    return e.classList.remove("mm-hidden")
                }
                ));
            else if (!e.closest(".mm-panel_search")) {
                var f = y(this.node.pnls, ".mm-panel_opened-parent");
                this.openPanel(f.slice(-1)[0])
            }
        this.trigger("updateListview")
    }
    ;
    var He = {
        add: !1,
        addTo: "panels"
    };
    M.options.sectionIndexer = He;
    var je = {
        current: !0,
        hover: !1,
        parent: !1
    };
    M.options.setSelected = je;
    var De = {
        collapsed: {
            use: !1,
            blockMenu: !0,
            hideDivider: !1,
            hideNavbar: !0
        },
        expanded: {
            use: !1,
            initial: "open"
        }
    };
    M.options.sidebar = De;
    M.configs.classNames.toggles = {
        toggle: "Toggle",
        check: "Check"
    };
    /*!
 * mmenu.js
 * mmenujs.com
 *
 * Copyright (c) Fred Heusschen
 * frebsite.nl
 */
    M.addons = {
        offcanvas: function() {
            var e = this;
            if (this.opts.offCanvas) {
                var t = function(e) {
                    return "object" != typeof e && (e = {}),
                    e
                }(this.opts.offCanvas);
                this.opts.offCanvas = o(t, M.options.offCanvas);
                var n = this.conf.offCanvas;
                this._api.push("open", "close", "setPage"),
                this.vars.opened = !1,
                this.bind("initMenu:before", (function() {
                    n.clone && (e.node.menu = e.node.menu.cloneNode(!0),
                    e.node.menu.id && (e.node.menu.id = "mm-" + e.node.menu.id),
                    _(e.node.menu, "[id]").forEach((function(e) {
                        e.id = "mm-" + e.id
                    }
                    ))),
                    e.node.wrpr = document.body,
                    document.querySelector(n.menu.insertSelector)[n.menu.insertMethod](e.node.menu)
                }
                )),
                this.bind("initMenu:after", (function() {
                    D.call(e),
                    e.setPage(M.node.page),
                    j.call(e),
                    e.node.menu.classList.add("mm-menu_offcanvas");
                    var t = window.location.hash;
                    if (t) {
                        var n = p(e.node.menu.id);
                        n && n == t.slice(1) && setTimeout((function() {
                            e.open()
                        }
                        ), 1e3)
                    }
                }
                )),
                this.bind("setPage:after", (function(e) {
                    M.node.blck && y(M.node.blck, "a").forEach((function(t) {
                        t.setAttribute("href", "#" + e.id)
                    }
                    ))
                }
                )),
                this.bind("open:start:sr-aria", (function() {
                    M.sr_aria(e.node.menu, "hidden", !1)
                }
                )),
                this.bind("close:finish:sr-aria", (function() {
                    M.sr_aria(e.node.menu, "hidden", !0)
                }
                )),
                this.bind("initMenu:after:sr-aria", (function() {
                    M.sr_aria(e.node.menu, "hidden", !0)
                }
                )),
                this.bind("initBlocker:after:sr-text", (function() {
                    y(M.node.blck, "a").forEach((function(t) {
                        t.innerHTML = M.sr_text(e.i18n(e.conf.screenReader.text.closeMenu))
                    }
                    ))
                }
                )),
                this.clck.push((function(t, n) {
                    var i = p(e.node.menu.id);
                    if (i && t.matches('[href="#' + i + '"]')) {
                        if (n.inMenu)
                            return e.open(),
                            !0;
                        var s = t.closest(".mm-menu");
                        if (s) {
                            var a = s.mmApi;
                            if (a && a.close)
                                return a.close(),
                                m(s, (function() {
                                    e.open()
                                }
                                ), e.conf.transitionDuration),
                                !0
                        }
                        return e.open(),
                        !0
                    }
                    if ((i = M.node.page.id) && t.matches('[href="#' + i + '"]'))
                        return e.close(),
                        !0
                }
                ))
            }
        },
        screenReader: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && (e = {
                    aria: e,
                    text: e
                }),
                "object" != typeof e && (e = {}),
                e
            }(this.opts.screenReader);
            this.opts.screenReader = o(t, M.options.screenReader);
            var n = this.conf.screenReader;
            t.aria && (this.bind("initAddons:after", (function() {
                e.bind("initMenu:after", (function() {
                    this.trigger("initMenu:after:sr-aria", [].slice.call(arguments))
                }
                )),
                e.bind("initNavbar:after", (function() {
                    this.trigger("initNavbar:after:sr-aria", [].slice.call(arguments))
                }
                )),
                e.bind("openPanel:start", (function() {
                    this.trigger("openPanel:start:sr-aria", [].slice.call(arguments))
                }
                )),
                e.bind("close:start", (function() {
                    this.trigger("close:start:sr-aria", [].slice.call(arguments))
                }
                )),
                e.bind("close:finish", (function() {
                    this.trigger("close:finish:sr-aria", [].slice.call(arguments))
                }
                )),
                e.bind("open:start", (function() {
                    this.trigger("open:start:sr-aria", [].slice.call(arguments))
                }
                )),
                e.bind("initOpened:after", (function() {
                    this.trigger("initOpened:after:sr-aria", [].slice.call(arguments))
                }
                ))
            }
            )),
            this.bind("updateListview", (function() {
                e.node.pnls.querySelectorAll(".mm-listitem").forEach((function(e) {
                    M.sr_aria(e, "hidden", e.matches(".mm-hidden"))
                }
                ))
            }
            )),
            this.bind("openPanel:start", (function(t) {
                var n = _(e.node.pnls, ".mm-panel").filter((function(e) {
                    return e !== t
                }
                )).filter((function(e) {
                    return !e.parentElement.matches(".mm-panel")
                }
                ))
                  , i = [t];
                _(t, ".mm-listitem_vertical .mm-listitem_opened").forEach((function(e) {
                    i.push.apply(i, y(e, ".mm-panel"))
                }
                )),
                n.forEach((function(e) {
                    M.sr_aria(e, "hidden", !0)
                }
                )),
                i.forEach((function(e) {
                    M.sr_aria(e, "hidden", !1)
                }
                ))
            }
            )),
            this.bind("closePanel", (function(e) {
                M.sr_aria(e, "hidden", !0)
            }
            )),
            this.bind("initPanel:after", (function(e) {
                _(e, ".mm-btn").forEach((function(e) {
                    M.sr_aria(e, "haspopup", !0);
                    var t = e.getAttribute("href");
                    t && M.sr_aria(e, "owns", t.replace("#", ""))
                }
                ))
            }
            )),
            this.bind("initNavbar:after", (function(e) {
                var t = y(e, ".mm-navbar")[0]
                  , n = t.matches(".mm-hidden");
                M.sr_aria(t, "hidden", n)
            }
            )),
            t.text && "parent" == this.opts.navbar.titleLink && this.bind("initNavbar:after", (function(e) {
                var t = y(e, ".mm-navbar")[0]
                  , n = !!t.querySelector(".mm-btn_prev");
                M.sr_aria(_(t, ".mm-navbar__title")[0], "hidden", n)
            }
            ))),
            t.text && (this.bind("initAddons:after", (function() {
                e.bind("setPage:after", (function() {
                    this.trigger("setPage:after:sr-text", [].slice.call(arguments))
                }
                )),
                e.bind("initBlocker:after", (function() {
                    this.trigger("initBlocker:after:sr-text", [].slice.call(arguments))
                }
                ))
            }
            )),
            this.bind("initNavbar:after", (function(t) {
                var i = y(t, ".mm-navbar")[0];
                if (i) {
                    var s = y(i, ".mm-btn_prev")[0];
                    s && (s.innerHTML = M.sr_text(e.i18n(n.text.closeSubmenu)))
                }
            }
            )),
            this.bind("initListview:after", (function(t) {
                var i = t.closest(".mm-panel").mmParent;
                if (i) {
                    var s = y(i, ".mm-btn_next")[0];
                    if (s) {
                        var a = e.i18n(n.text[s.parentElement.matches(".mm-listitem_vertical") ? "toggleSubmenu" : "openSubmenu"]);
                        s.innerHTML += M.sr_text(a)
                    }
                }
            }
            )))
        },
        scrollBugFix: function() {
            var e = this;
            if (W && this.opts.offCanvas && this.opts.offCanvas.blockUI) {
                var t = function(e) {
                    return "boolean" == typeof e && (e = {
                        fix: e
                    }),
                    "object" != typeof e && (e = {}),
                    e
                }(this.opts.scrollBugFix);
                if (this.opts.scrollBugFix = o(t, M.options.scrollBugFix),
                t.fix) {
                    var n, i, s = (n = this.node.menu,
                    i = "",
                    n.addEventListener("touchmove", (function(e) {
                        i = "",
                        e.movementY > 0 ? i = "down" : e.movementY < 0 && (i = "up")
                    }
                    )),
                    {
                        get: function() {
                            return i
                        }
                    });
                    this.node.menu.addEventListener("scroll", a, {
                        passive: !1
                    }),
                    this.node.menu.addEventListener("touchmove", (function(e) {
                        var t = e.target.closest(".mm-panel, .mm-iconbar__top, .mm-iconbar__bottom");
                        t && t.closest(".mm-listitem_vertical") && (t = L(t, ".mm-panel").pop()),
                        t ? (t.scrollHeight === t.offsetHeight || 0 == t.scrollTop && "down" == s.get() || t.scrollHeight == t.scrollTop + t.offsetHeight && "up" == s.get()) && a(e) : a(e)
                    }
                    ), {
                        passive: !1
                    }),
                    this.bind("open:start", (function() {
                        var t = y(e.node.pnls, ".mm-panel_opened")[0];
                        t && (t.scrollTop = 0)
                    }
                    )),
                    window.addEventListener("orientationchange", (function(t) {
                        var n = y(e.node.pnls, ".mm-panel_opened")[0];
                        n && (n.scrollTop = 0,
                        n.style["-webkit-overflow-scrolling"] = "auto",
                        n.style["-webkit-overflow-scrolling"] = "touch")
                    }
                    ))
                }
            }
            function a(e) {
                e.preventDefault(),
                e.stopPropagation()
            }
        },
        autoHeight: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && e && (e = {
                    height: "auto"
                }),
                "string" == typeof e && (e = {
                    height: e
                }),
                "object" != typeof e && (e = {}),
                e
            }(this.opts.autoHeight);
            if (this.opts.autoHeight = o(t, M.options.autoHeight),
            "auto" == t.height || "highest" == t.height) {
                var n, i = (n = function(e) {
                    return e.parentElement.matches(".mm-listitem_vertical") && (e = L(e, ".mm-panel").filter((function(e) {
                        return !e.parentElement.matches(".mm-listitem_vertical")
                    }
                    ))[0]),
                    e
                }
                ,
                function() {
                    if (!e.opts.offCanvas || e.vars.opened) {
                        var i, s, a = 0, o = e.node.menu.offsetHeight - e.node.pnls.offsetHeight;
                        e.node.menu.classList.add("mm-menu_autoheight-measuring"),
                        "auto" == t.height ? ((s = y(e.node.pnls, ".mm-panel_opened")[0]) && (s = n(s)),
                        s || (s = y(e.node.pnls, ".mm-panel")[0]),
                        a = s.scrollHeight) : "highest" == t.height && (i = 0,
                        y(e.node.pnls, ".mm-panel").forEach((function(e) {
                            e = n(e),
                            i = Math.max(i, e.scrollHeight)
                        }
                        )),
                        a = i),
                        e.node.menu.style.height = a + o + "px",
                        e.node.menu.classList.remove("mm-menu_autoheight-measuring")
                    }
                }
                );
                this.bind("initMenu:after", (function() {
                    e.node.menu.classList.add("mm-menu_autoheight")
                }
                )),
                this.opts.offCanvas && this.bind("open:start", i),
                "highest" == t.height && this.bind("initPanels:after", i),
                "auto" == t.height && (this.bind("updateListview", i),
                this.bind("openPanel:start", i))
            }
        },
        backButton: function() {
            var e = this;
            if (this.opts.offCanvas) {
                var t = function(e) {
                    return "boolean" == typeof e && (e = {
                        close: e
                    }),
                    "object" != typeof e && (e = {}),
                    e
                }(this.opts.backButton);
                this.opts.backButton = o(t, M.options.backButton);
                var n = "#" + this.node.menu.id;
                if (t.close) {
                    var i = []
                      , s = function() {
                        i = [n],
                        y(e.node.pnls, ".mm-panel_opened, .mm-panel_opened-parent").forEach((function(e) {
                            i.push("#" + e.id)
                        }
                        ))
                    };
                    this.bind("open:finish", (function() {
                        history.pushState(null, document.title, n)
                    }
                    )),
                    this.bind("open:finish", s),
                    this.bind("openPanel:finish", s),
                    this.bind("close:finish", (function() {
                        i = [],
                        history.back(),
                        history.pushState(null, document.title, location.pathname + location.search)
                    }
                    )),
                    window.addEventListener("popstate", (function(t) {
                        if (e.vars.opened && i.length) {
                            var s = (i = i.slice(0, -1))[i.length - 1];
                            s == n ? e.close() : (e.openPanel(e.node.menu.querySelector(s)),
                            history.pushState(null, document.title, n))
                        }
                    }
                    ))
                }
                t.open && window.addEventListener("popstate", (function(t) {
                    e.vars.opened || location.hash != n || e.open()
                }
                ))
            }
        },
        columns: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && (e = {
                    add: e
                }),
                "number" == typeof e && (e = {
                    add: !0,
                    visible: e
                }),
                "object" != typeof e && (e = {}),
                "number" == typeof e.visible && (e.visible = {
                    min: e.visible,
                    max: e.visible
                }),
                e
            }(this.opts.columns);
            if (this.opts.columns = o(t, M.options.columns),
            t.add) {
                t.visible.min = Math.max(1, Math.min(6, t.visible.min)),
                t.visible.max = Math.max(t.visible.min, Math.min(6, t.visible.max));
                for (var n = [], i = [], s = ["mm-panel_opened", "mm-panel_opened-parent", "mm-panel_highest"], a = 0; a <= t.visible.max; a++)
                    n.push("mm-menu_columns-" + a),
                    i.push("mm-panel_columns-" + a);
                s.push.apply(s, i),
                this.bind("openPanel:before", (function(t) {
                    var n;
                    if (t && (n = t.mmParent),
                    n && !n.classList.contains("mm-listitem_vertical") && (n = n.closest(".mm-panel"))) {
                        var i = n.className;
                        if (i.length && (i = i.split("mm-panel_columns-")[1]))
                            for (var a = parseInt(i.split(" ")[0], 10) + 1; a > 0; ) {
                                if (!(t = y(e.node.pnls, ".mm-panel_columns-" + a)[0])) {
                                    a = -1;
                                    break
                                }
                                a++,
                                t.classList.add("mm-hidden"),
                                s.forEach((function(e) {
                                    t.classList.remove(e)
                                }
                                ))
                            }
                    }
                }
                )),
                this.bind("openPanel:start", (function(s) {
                    if (s) {
                        var a = s.mmParent;
                        if (a && a.classList.contains("mm-listitem_vertical"))
                            return
                    }
                    var o = y(e.node.pnls, ".mm-panel_opened-parent").length;
                    s.matches(".mm-panel_opened-parent") || o++,
                    o = Math.min(t.visible.max, Math.max(t.visible.min, o)),
                    n.forEach((function(t) {
                        e.node.menu.classList.remove(t)
                    }
                    )),
                    e.node.menu.classList.add("mm-menu_columns-" + o);
                    var r = [];
                    y(e.node.pnls, ".mm-panel").forEach((function(e) {
                        i.forEach((function(t) {
                            e.classList.remove(t)
                        }
                        )),
                        e.matches(".mm-panel_opened-parent") && r.push(e)
                    }
                    )),
                    r.push(s),
                    r.slice(-t.visible.max).forEach((function(e, t) {
                        e.classList.add("mm-panel_columns-" + t)
                    }
                    ))
                }
                ))
            }
        },
        counters: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && (e = {
                    add: e,
                    addTo: "panels",
                    count: e
                }),
                "object" != typeof e && (e = {}),
                "panels" == e.addTo && (e.addTo = ".mm-listview"),
                e
            }(this.opts.counters);
            if (this.opts.counters = o(t, M.options.counters),
            this.bind("initListview:after", (function(t) {
                var n = e.conf.classNames.counters.counter;
                _(t, "." + n).forEach((function(e) {
                    x(e, n, "mm-counter")
                }
                ))
            }
            )),
            t.add && this.bind("initListview:after", (function(e) {
                if (e.matches(t.addTo)) {
                    var n = e.closest(".mm-panel").mmParent;
                    if (n && !_(n, ".mm-counter").length) {
                        var i = y(n, ".mm-btn")[0];
                        i && i.prepend(g("span.mm-counter"))
                    }
                }
            }
            )),
            t.count) {
                var n = function(t) {
                    (t ? [t.closest(".mm-panel")] : y(e.node.pnls, ".mm-panel")).forEach((function(e) {
                        var t = e.mmParent;
                        if (t) {
                            var n = _(t, ".mm-counter")[0];
                            if (n) {
                                var i = [];
                                y(e, ".mm-listview").forEach((function(e) {
                                    i.push.apply(i, y(e))
                                }
                                )),
                                n.innerHTML = w(i).length.toString()
                            }
                        }
                    }
                    ))
                };
                this.bind("initListview:after", n),
                this.bind("updateListview", n)
            }
        },
        dividers: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && (e = {
                    add: e
                }),
                "object" != typeof e && (e = {}),
                "panels" == e.addTo && (e.addTo = ".mm-listview"),
                e
            }(this.opts.dividers);
            this.opts.dividers = o(t, M.options.dividers),
            this.bind("initListview:after", (function(t) {
                y(t).forEach((function(t) {
                    x(t, e.conf.classNames.divider, "mm-divider"),
                    t.matches(".mm-divider") && t.classList.remove("mm-listitem")
                }
                ))
            }
            )),
            t.add && this.bind("initListview:after", (function(e) {
                if (e.matches(t.addTo)) {
                    _(e, ".mm-divider").forEach((function(e) {
                        e.remove()
                    }
                    ));
                    var n = "";
                    w(y(e)).forEach((function(t) {
                        var i = y(t, ".mm-listitem__text")[0].textContent.trim().toLowerCase()[0];
                        if (i.length && i != n) {
                            n = i;
                            var s = g("li.mm-divider");
                            s.textContent = i,
                            e.insertBefore(s, t)
                        }
                    }
                    ))
                }
            }
            ))
        },
        drag: function() {
            var e = this;
            if (this.opts.offCanvas) {
                var t = function(e) {
                    return "boolean" == typeof e && (e = {
                        open: e
                    }),
                    "object" != typeof e && (e = {}),
                    e
                }(this.opts.drag);
                this.opts.drag = o(t, M.options.drag),
                t.open && this.bind("setPage:after", (function(n) {
                    ce.call(e, t.node || n)
                }
                ))
            }
        },
        dropdown: function() {
            var e = this;
            if (this.opts.offCanvas) {
                var t = function(e) {
                    return "boolean" == typeof e && e && (e = {
                        drop: e
                    }),
                    "object" != typeof e && (e = {}),
                    "string" == typeof e.position && (e.position = {
                        of: e.position
                    }),
                    e
                }(this.opts.dropdown);
                this.opts.dropdown = o(t, M.options.dropdown);
                var n = this.conf.dropdown;
                if (t.drop) {
                    var i;
                    this.bind("initMenu:after", (function() {
                        if (e.node.menu.classList.add("mm-menu_dropdown"),
                        "string" != typeof t.position.of) {
                            var n = p(e.node.menu.id);
                            n && (t.position.of = '[href="#' + n + '"]')
                        }
                        if ("string" == typeof t.position.of) {
                            i = _(document.body, t.position.of)[0];
                            var s = t.event.split(" ");
                            1 == s.length && (s[1] = s[0]),
                            "hover" == s[0] && i.addEventListener("mouseenter", (function() {
                                e.open()
                            }
                            ), {
                                passive: !0
                            }),
                            "hover" == s[1] && e.node.menu.addEventListener("mouseleave", (function() {
                                e.close()
                            }
                            ), {
                                passive: !0
                            })
                        }
                    }
                    )),
                    this.bind("open:start", (function() {
                        e.node.menu.mmStyle = e.node.menu.getAttribute("style"),
                        e.node.wrpr.classList.add("mm-wrapper_dropdown")
                    }
                    )),
                    this.bind("close:finish", (function() {
                        e.node.menu.setAttribute("style", e.node.menu.mmStyle),
                        e.node.wrpr.classList.remove("mm-wrapper_dropdown")
                    }
                    ));
                    var s = function(e, s) {
                        var a, o, r, c = s[0], m = s[1], l = "x" == e ? "offsetWidth" : "offsetHeight", d = "x" == e ? "left" : "top", p = "x" == e ? "right" : "bottom", u = "x" == e ? "width" : "height", f = "x" == e ? "innerWidth" : "innerHeight", h = "x" == e ? "maxWidth" : "maxHeight", v = null, b = (a = d,
                        i.getBoundingClientRect()[a] + document.body["left" === a ? "scrollLeft" : "scrollTop"]), g = b + i[l], _ = window[f], y = n.offset.button[e] + n.offset.viewport[e];
                        if (t.position[e])
                            switch (t.position[e]) {
                            case "left":
                            case "bottom":
                                v = "after";
                                break;
                            case "right":
                            case "top":
                                v = "before"
                            }
                        return null === v && (v = b + (g - b) / 2 < _ / 2 ? "after" : "before"),
                        "after" == v ? (r = _ - ((o = "x" == e ? b : g) + y),
                        c[d] = o + n.offset.button[e] + "px",
                        c[p] = "auto",
                        t.tip && m.push("mm-menu_tip-" + ("x" == e ? "left" : "top"))) : (r = (o = "x" == e ? g : b) - y,
                        c[p] = "calc( 100% - " + (o - n.offset.button[e]) + "px )",
                        c[d] = "auto",
                        t.tip && m.push("mm-menu_tip-" + ("x" == e ? "right" : "bottom"))),
                        t.fitViewport && (c[h] = Math.min(n[u].max, r) + "px"),
                        [c, m]
                    };
                    this.bind("open:start", a),
                    window.addEventListener("resize", (function(t) {
                        a.call(e)
                    }
                    ), {
                        passive: !0
                    }),
                    this.opts.offCanvas.blockUI || window.addEventListener("scroll", (function(t) {
                        a.call(e)
                    }
                    ), {
                        passive: !0
                    })
                }
            }
            function a() {
                var e = this;
                if (this.vars.opened) {
                    this.node.menu.setAttribute("style", this.node.menu.mmStyle);
                    var n = [{}, []];
                    for (var i in n = s.call(this, "y", n),
                    (n = s.call(this, "x", n))[0])
                        this.node.menu.style[i] = n[0][i];
                    if (t.tip) {
                        ["mm-menu_tip-left", "mm-menu_tip-right", "mm-menu_tip-top", "mm-menu_tip-bottom"].forEach((function(t) {
                            e.node.menu.classList.remove(t)
                        }
                        )),
                        n[1].forEach((function(t) {
                            e.node.menu.classList.add(t)
                        }
                        ))
                    }
                }
            }
        },
        fixedElements: function() {
            var e = this;
            if (this.opts.offCanvas) {
                var t, n, i = this.conf.fixedElements;
                this.bind("setPage:after", (function(s) {
                    t = e.conf.classNames.fixedElements.fixed,
                    n = _(document, i.insertSelector)[0],
                    _(s, "." + t).forEach((function(e) {
                        x(e, t, "mm-slideout"),
                        n[i.insertMethod](e)
                    }
                    ))
                }
                ))
            }
        },
        iconbar: function() {
            var e, t = this, n = function(e) {
                return "array" == r(e) && (e = {
                    use: !0,
                    top: e
                }),
                "object" != r(e) && (e = {}),
                void 0 === e.use && (e.use = !0),
                "boolean" == typeof e.use && e.use && (e.use = !0),
                e
            }(this.opts.iconbar);
            if ((this.opts.iconbar = o(n, M.options.iconbar),
            n.use) && (["top", "bottom"].forEach((function(t, i) {
                var s = n[t];
                "array" != r(s) && (s = [s]);
                for (var a = g("div.mm-iconbar__" + t), o = 0, c = s.length; o < c; o++)
                    "string" == typeof s[o] ? a.innerHTML += s[o] : a.append(s[o]);
                a.children.length && (e || (e = g("div.mm-iconbar")),
                e.append(a))
            }
            )),
            e)) {
                this.bind("initMenu:after", (function() {
                    t.node.menu.prepend(e)
                }
                ));
                var i = "mm-menu_iconbar-" + n.position
                  , s = function() {
                    t.node.menu.classList.add(i),
                    M.sr_aria(e, "hidden", !1)
                };
                if ("boolean" == typeof n.use ? this.bind("initMenu:after", s) : k(n.use, s, (function() {
                    t.node.menu.classList.remove(i),
                    M.sr_aria(e, "hidden", !0)
                }
                )),
                "tabs" == n.type) {
                    e.classList.add("mm-iconbar_tabs"),
                    e.addEventListener("click", (function(e) {
                        var n = e.target;
                        if (n.matches("a"))
                            if (n.matches(".mm-iconbar__tab_selected"))
                                e.stopImmediatePropagation();
                            else
                                try {
                                    var i = t.node.menu.querySelector(n.getAttribute("href"))[0];
                                    i && i.matches(".mm-panel") && (e.preventDefault(),
                                    e.stopImmediatePropagation(),
                                    t.openPanel(i, !1))
                                } catch (e) {}
                    }
                    ));
                    var a = function(t) {
                        _(e, "a").forEach((function(e) {
                            e.classList.remove("mm-iconbar__tab_selected")
                        }
                        ));
                        var n = _(e, '[href="#' + t.id + '"]')[0];
                        if (n)
                            n.classList.add("mm-iconbar__tab_selected");
                        else {
                            var i = t.mmParent;
                            i && a(i.closest(".mm-panel"))
                        }
                    };
                    this.bind("openPanel:start", a)
                }
            }
        },
        iconPanels: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && (e = {
                    add: e
                }),
                "number" != typeof e && "string" != typeof e || (e = {
                    add: !0,
                    visible: e
                }),
                "object" != typeof e && (e = {}),
                e
            }(this.opts.iconPanels);
            this.opts.iconPanels = o(t, M.options.iconPanels);
            var n = !1;
            if ("first" == t.visible && (n = !0,
            t.visible = 1),
            t.visible = Math.min(3, Math.max(1, t.visible)),
            t.visible++,
            t.add) {
                this.bind("initMenu:after", (function() {
                    var n = ["mm-menu_iconpanel"];
                    t.hideNavbar && n.push("mm-menu_hidenavbar"),
                    t.hideDivider && n.push("mm-menu_hidedivider"),
                    n.forEach((function(t) {
                        e.node.menu.classList.add(t)
                    }
                    ))
                }
                ));
                var i = [];
                if (!n)
                    for (var s = 0; s <= t.visible; s++)
                        i.push("mm-panel_iconpanel-" + s);
                this.bind("openPanel:start", (function(s) {
                    var a = y(e.node.pnls, ".mm-panel");
                    if (!(s = s || a[0]).parentElement.matches(".mm-listitem_vertical"))
                        if (n)
                            a.forEach((function(e, t) {
                                e.classList[0 == t ? "add" : "remove"]("mm-panel_iconpanel-first")
                            }
                            ));
                        else {
                            a.forEach((function(e) {
                                i.forEach((function(t) {
                                    e.classList.remove(t)
                                }
                                ))
                            }
                            )),
                            a = a.filter((function(e) {
                                return e.matches(".mm-panel_opened-parent")
                            }
                            ));
                            var o = !1;
                            a.forEach((function(e) {
                                s === e && (o = !0)
                            }
                            )),
                            o || a.push(s),
                            a.forEach((function(e) {
                                e.classList.remove("mm-hidden")
                            }
                            )),
                            (a = a.slice(-t.visible)).forEach((function(e, t) {
                                e.classList.add("mm-panel_iconpanel-" + t)
                            }
                            ))
                        }
                }
                )),
                this.bind("initPanel:after", (function(e) {
                    if (t.blockPanel && !e.parentElement.matches(".mm-listitem_vertical") && !y(e, ".mm-panel__blocker")[0]) {
                        var n = g("a.mm-panel__blocker");
                        n.setAttribute("href", "#" + e.closest(".mm-panel").id),
                        e.prepend(n)
                    }
                }
                ))
            }
        },
        keyboardNavigation: function() {
            var e = this;
            if (!W) {
                var t = function(e) {
                    return "boolean" != typeof e && "string" != typeof e || (e = {
                        enable: e
                    }),
                    "object" != typeof e && (e = {}),
                    e
                }(this.opts.keyboardNavigation);
                if (this.opts.keyboardNavigation = o(t, M.options.keyboardNavigation),
                t.enable) {
                    var n = g("button.mm-tabstart.mm-sronly")
                      , i = g("button.mm-tabend.mm-sronly")
                      , s = g("button.mm-tabend.mm-sronly");
                    this.bind("initMenu:after", (function() {
                        t.enhance && e.node.menu.classList.add("mm-menu_keyboardfocus"),
                        ve.call(e, t.enhance)
                    }
                    )),
                    this.bind("initOpened:before", (function() {
                        e.node.menu.prepend(n),
                        e.node.menu.append(i),
                        y(e.node.menu, ".mm-navbars-top, .mm-navbars-bottom").forEach((function(e) {
                            e.querySelectorAll(".mm-navbar__title").forEach((function(e) {
                                e.setAttribute("tabindex", "-1")
                            }
                            ))
                        }
                        ))
                    }
                    )),
                    this.bind("initBlocker:after", (function() {
                        M.node.blck.append(s),
                        y(M.node.blck, "a")[0].classList.add("mm-tabstart")
                    }
                    ));
                    var a = "input, select, textarea, button, label, a[href]"
                      , r = function(n) {
                        n = n || y(e.node.pnls, ".mm-panel_opened")[0];
                        var i = null
                          , s = document.activeElement.closest(".mm-navbar");
                        if (!s || s.closest(".mm-menu") != e.node.menu) {
                            if ("default" == t.enable && ((i = _(n, ".mm-listview a[href]:not(.mm-hidden)")[0]) || (i = _(n, a + ":not(.mm-hidden)")[0]),
                            !i)) {
                                var o = [];
                                y(e.node.menu, ".mm-navbars_top, .mm-navbars_bottom").forEach((function(e) {
                                    o.push.apply(o, _(e, a + ":not(.mm-hidden)"))
                                }
                                )),
                                i = o[0]
                            }
                            i || (i = y(e.node.menu, ".mm-tabstart")[0]),
                            i && i.focus()
                        }
                    };
                    this.bind("open:finish", r),
                    this.bind("openPanel:finish", r),
                    this.bind("initOpened:after:sr-aria", (function() {
                        [e.node.menu, M.node.blck].forEach((function(e) {
                            y(e, ".mm-tabstart, .mm-tabend").forEach((function(e) {
                                M.sr_aria(e, "hidden", !0),
                                M.sr_role(e, "presentation")
                            }
                            ))
                        }
                        ))
                    }
                    ))
                }
            }
        },
        lazySubmenus: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && (e = {
                    load: e
                }),
                "object" != typeof e && (e = {}),
                e
            }(this.opts.lazySubmenus);
            this.opts.lazySubmenus = o(t, M.options.lazySubmenus),
            t.load && (this.bind("initPanels:before", (function() {
                var t = [];
                _(e.node.pnls, "li").forEach((function(n) {
                    t.push.apply(t, y(n, e.conf.panelNodetype.join(", ")))
                }
                )),
                t.filter((function(e) {
                    return !e.matches(".mm-listview_inset")
                }
                )).filter((function(e) {
                    return !e.matches(".mm-nolistview")
                }
                )).filter((function(e) {
                    return !e.matches(".mm-nopanel")
                }
                )).forEach((function(e) {
                    ["mm-panel_lazysubmenu", "mm-nolistview", "mm-nopanel"].forEach((function(t) {
                        e.classList.add(t)
                    }
                    ))
                }
                ))
            }
            )),
            this.bind("initPanels:before", (function() {
                var t = [];
                _(e.node.pnls, "." + e.conf.classNames.selected).forEach((function(e) {
                    t.push.apply(t, L(e, ".mm-panel_lazysubmenu"))
                }
                )),
                t.length && t.forEach((function(e) {
                    console.log(e);
                    ["mm-panel_lazysubmenu", "mm-nolistview", "mm-nopanel"].forEach((function(t) {
                        e.classList.remove(t)
                    }
                    ))
                }
                ))
            }
            )),
            this.bind("openPanel:before", (function(t) {
                var n = _(t, ".mm-panel_lazysubmenu").filter((function(e) {
                    return !e.matches(".mm-panel_lazysubmenu .mm-panel_lazysubmenu")
                }
                ));
                t.matches(".mm-panel_lazysubmenu") && n.unshift(t),
                n.forEach((function(t) {
                    ["mm-panel_lazysubmenu", "mm-nolistview", "mm-nopanel"].forEach((function(e) {
                        t.classList.remove(e)
                    }
                    )),
                    e.initPanel(t)
                }
                ))
            }
            )))
        },
        navbars: ye,
        pageScroll: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && (e = {
                    scroll: e
                }),
                "object" != typeof e && (e = {}),
                e
            }(this.opts.pageScroll);
            this.opts.pageScroll = o(t, M.options.pageScroll);
            var n, i = this.conf.pageScroll;
            function s() {
                n && window.scrollTo({
                    top: n.getBoundingClientRect().top + document.scrollingElement.scrollTop - i.scrollOffset,
                    behavior: "smooth"
                }),
                n = null
            }
            function a(e) {
                try {
                    return "#" != e && "#" == e.slice(0, 1) ? M.node.page.querySelector(e) : null
                } catch (e) {
                    return null
                }
            }
            if (t.scroll && this.bind("close:finish", (function() {
                s()
            }
            )),
            this.opts.offCanvas && t.scroll && this.clck.push((function(t, i) {
                if (n = null,
                i.inMenu) {
                    var o = t.getAttribute("href");
                    if (n = a(o))
                        return e.node.menu.matches(".mm-menu_sidebar-expanded") && e.node.wrpr.matches(".mm-wrapper_sidebar-expanded") ? void s() : {
                            close: !0
                        }
                }
            }
            )),
            t.update) {
                var r = [];
                this.bind("initListview:after", (function(e) {
                    E(y(e, ".mm-listitem")).forEach((function(e) {
                        var t = a(e.getAttribute("href"));
                        t && r.unshift(t)
                    }
                    ))
                }
                ));
                var c = -1;
                window.addEventListener("scroll", (function(t) {
                    for (var n = window.scrollY, s = 0; s < r.length; s++)
                        if (r[s].offsetTop < n + i.updateOffset) {
                            if (c !== s) {
                                c = s;
                                var a = E(_(y(e.node.pnls, ".mm-panel_opened")[0], ".mm-listitem"));
                                (a = a.filter((function(e) {
                                    return e.matches('[href="#' + r[s].id + '"]')
                                }
                                ))).length && e.setSelected(a[0].parentElement)
                            }
                            break
                        }
                }
                ))
            }
        },
        searchfield: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && (e = {
                    add: e
                }),
                "object" != typeof e && (e = {}),
                "boolean" == typeof e.panel && (e.panel = {
                    add: e.panel
                }),
                "object" != typeof e.panel && (e.panel = {}),
                "panel" == e.addTo && (e.panel.add = !0),
                e.panel.add && (e.showSubPanels = !1,
                e.panel.splash && (e.cancel = !0)),
                e
            }(this.opts.searchfield);
            this.opts.searchfield = o(t, M.options.searchfield);
            this.conf.searchfield;
            t.add && (this.bind("close:start", (function() {
                _(e.node.menu, ".mm-searchfield").forEach((function(e) {
                    e.blur()
                }
                ))
            }
            )),
            this.bind("initPanel:after", (function(n) {
                var i = null;
                t.panel.add && (i = Ae.call(e));
                var s = null;
                switch (t.addTo) {
                case "panels":
                    s = [n];
                    break;
                case "panel":
                    s = [i];
                    break;
                default:
                    "string" == typeof t.addTo ? s = _(e.node.menu, t.addTo) : "array" == r(t.addTo) && (s = t.addTo)
                }
                s.forEach((function(n) {
                    n = Te.call(e, n),
                    t.search && n && Ce.call(e, n)
                }
                )),
                t.noResults && Ne.call(e, t.panel.add ? i : n)
            }
            )),
            this.clck.push((function(t, n) {
                if (n.inMenu && t.matches(".mm-searchfield__btn")) {
                    if (t.matches(".mm-btn_close")) {
                        var i = _(s = t.closest(".mm-searchfield"), "input")[0];
                        return i.value = "",
                        e.search(i),
                        !0
                    }
                    var s;
                    if (t.matches(".mm-btn_next"))
                        return (s = t.closest("form")) && s.submit(),
                        !0
                }
            }
            )))
        },
        sectionIndexer: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && (e = {
                    add: e
                }),
                "object" != typeof e && (e = {}),
                e
            }(this.opts.sectionIndexer);
            this.opts.sectionIndexer = o(t, M.options.sectionIndexer),
            t.add && this.bind("initPanels:after", (function() {
                if (!e.node.indx) {
                    var t = "";
                    "abcdefghijklmnopqrstuvwxyz".split("").forEach((function(e) {
                        t += '<a href="#">' + e + "</a>"
                    }
                    ));
                    var n = g("div.mm-sectionindexer");
                    n.innerHTML = t,
                    e.node.pnls.prepend(n),
                    e.node.indx = n,
                    e.node.indx.addEventListener("click", (function(e) {
                        e.target.matches("a") && e.preventDefault()
                    }
                    ));
                    var i = function(t) {
                        if (t.target.matches("a")) {
                            var n = t.target.textContent
                              , i = y(e.node.pnls, ".mm-panel_opened")[0]
                              , s = -1
                              , a = i.scrollTop;
                            i.scrollTop = 0,
                            _(i, ".mm-divider").filter((function(e) {
                                return !e.matches(".mm-hidden")
                            }
                            )).forEach((function(e) {
                                s < 0 && n == e.textContent.trim().slice(0, 1).toLowerCase() && (s = e.offsetTop)
                            }
                            )),
                            i.scrollTop = s > -1 ? s : a
                        }
                    };
                    W ? (e.node.indx.addEventListener("touchstart", i),
                    e.node.indx.addEventListener("touchmove", i)) : e.node.indx.addEventListener("mouseover", i)
                }
                e.bind("openPanel:start", (function(t) {
                    var n = _(t, ".mm-divider").filter((function(e) {
                        return !e.matches(".mm-hidden")
                    }
                    )).length;
                    e.node.indx.classList[n ? "add" : "remove"]("mm-sectionindexer_active")
                }
                ))
            }
            ))
        },
        setSelected: function() {
            var e = this
              , t = function(e) {
                return "boolean" == typeof e && (e = {
                    hover: e,
                    parent: e
                }),
                "object" != typeof e && (e = {}),
                e
            }(this.opts.setSelected);
            if (this.opts.setSelected = o(t, M.options.setSelected),
            "detect" == t.current) {
                var n = function(t) {
                    t = t.split("?")[0].split("#")[0];
                    var i = e.node.menu.querySelector('a[href="' + t + '"], a[href="' + t + '/"]');
                    if (i)
                        e.setSelected(i.parentElement);
                    else {
                        var s = t.split("/").slice(0, -1);
                        s.length && n(s.join("/"))
                    }
                };
                this.bind("initMenu:after", (function() {
                    n.call(e, window.location.href)
                }
                ))
            } else
                t.current || this.bind("initListview:after", (function(e) {
                    y(e, ".mm-listitem_selected").forEach((function(e) {
                        e.classList.remove("mm-listitem_selected")
                    }
                    ))
                }
                ));
            t.hover && this.bind("initMenu:after", (function() {
                e.node.menu.classList.add("mm-menu_selected-hover")
            }
            )),
            t.parent && (this.bind("openPanel:finish", (function(t) {
                _(e.node.pnls, ".mm-listitem_selected-parent").forEach((function(e) {
                    e.classList.remove("mm-listitem_selected-parent")
                }
                ));
                for (var n = t.mmParent; n; )
                    n.matches(".mm-listitem_vertical") || n.classList.add("mm-listitem_selected-parent"),
                    n = (n = n.closest(".mm-panel")).mmParent
            }
            )),
            this.bind("initMenu:after", (function() {
                e.node.menu.classList.add("mm-menu_selected-parent")
            }
            )))
        },
        sidebar: function() {
            var e = this;
            if (this.opts.offCanvas) {
                var t = function(e) {
                    return ("string" == typeof e || "boolean" == typeof e && e || "number" == typeof e) && (e = {
                        expanded: e
                    }),
                    "object" != typeof e && (e = {}),
                    "boolean" == typeof e.collapsed && e.collapsed && (e.collapsed = {
                        use: !0
                    }),
                    "string" != typeof e.collapsed && "number" != typeof e.collapsed || (e.collapsed = {
                        use: e.collapsed
                    }),
                    "object" != typeof e.collapsed && (e.collapsed = {}),
                    "boolean" == typeof e.expanded && e.expanded && (e.expanded = {
                        use: !0
                    }),
                    "string" != typeof e.expanded && "number" != typeof e.expanded || (e.expanded = {
                        use: e.expanded
                    }),
                    "object" != typeof e.expanded && (e.expanded = {}),
                    e
                }(this.opts.sidebar);
                if (this.opts.sidebar = o(t, M.options.sidebar),
                t.collapsed.use) {
                    this.bind("initMenu:after", (function() {
                        if (e.node.menu.classList.add("mm-menu_sidebar-collapsed"),
                        t.collapsed.blockMenu && e.opts.offCanvas && !y(e.node.menu, ".mm-menu__blocker")[0]) {
                            var n = g("a.mm-menu__blocker");
                            n.setAttribute("href", "#" + e.node.menu.id),
                            e.node.menu.prepend(n)
                        }
                        t.collapsed.hideNavbar && e.node.menu.classList.add("mm-menu_hidenavbar"),
                        t.collapsed.hideDivider && e.node.menu.classList.add("mm-menu_hidedivider")
                    }
                    ));
                    var n = function() {
                        e.node.wrpr.classList.add("mm-wrapper_sidebar-collapsed")
                    }
                      , i = function() {
                        e.node.wrpr.classList.remove("mm-wrapper_sidebar-collapsed")
                    };
                    "boolean" == typeof t.collapsed.use ? this.bind("initMenu:after", n) : k(t.collapsed.use, n, i)
                }
                if (t.expanded.use) {
                    this.bind("initMenu:after", (function() {
                        e.node.menu.classList.add("mm-menu_sidebar-expanded")
                    }
                    ));
                    n = function() {
                        e.node.wrpr.classList.add("mm-wrapper_sidebar-expanded"),
                        e.node.wrpr.matches(".mm-wrapper_sidebar-closed") || e.open()
                    }
                    ,
                    i = function() {
                        e.node.wrpr.classList.remove("mm-wrapper_sidebar-expanded"),
                        e.close()
                    }
                    ;
                    "boolean" == typeof t.expanded.use ? this.bind("initMenu:after", n) : k(t.expanded.use, n, i),
                    this.bind("close:start", (function() {
                        e.node.wrpr.matches(".mm-wrapper_sidebar-expanded") && (e.node.wrpr.classList.add("mm-wrapper_sidebar-closed"),
                        "remember" == t.expanded.initial && window.localStorage.setItem("mmenuExpandedState", "closed"))
                    }
                    )),
                    this.bind("open:start", (function() {
                        e.node.wrpr.matches(".mm-wrapper_sidebar-expanded") && (e.node.wrpr.classList.remove("mm-wrapper_sidebar-closed"),
                        "remember" == t.expanded.initial && window.localStorage.setItem("mmenuExpandedState", "open"))
                    }
                    ));
                    var s = t.expanded.initial;
                    if ("remember" == t.expanded.initial) {
                        var a = window.localStorage.getItem("mmenuExpandedState");
                        switch (a) {
                        case "open":
                        case "closed":
                            s = a
                        }
                    }
                    "closed" == s && this.bind("initMenu:after", (function() {
                        e.node.wrpr.classList.add("mm-wrapper_sidebar-closed")
                    }
                    )),
                    this.clck.push((function(n, i) {
                        if (i.inMenu && i.inListview && e.node.wrpr.matches(".mm-wrapper_sidebar-expanded"))
                            return {
                                close: "closed" == t.expanded.initial
                            }
                    }
                    ))
                }
            }
        },
        toggles: function() {
            var e = this;
            this.bind("initPanel:after", (function(t) {
                _(t, "input").forEach((function(t) {
                    x(t, e.conf.classNames.toggles.toggle, "mm-toggle"),
                    x(t, e.conf.classNames.toggles.check, "mm-check")
                }
                ))
            }
            ))
        }
    },
    M.wrappers = {
        angular: function() {
            this.opts.onClick = {
                close: !0,
                preventDefault: !1,
                setSelected: !0
            }
        },
        bootstrap: function() {
            var e = this;
            if (this.node.menu.matches(".navbar-collapse")) {
                this.conf.offCanvas && (this.conf.offCanvas.clone = !1);
                var t = g("nav")
                  , n = g("div");
                t.append(n),
                y(this.node.menu).forEach((function(t) {
                    switch (!0) {
                    case t.matches(".navbar-nav"):
                        n.append(function(e) {
                            var t = g("ul");
                            return _(e, ".nav-item").forEach((function(e) {
                                var n = g("li");
                                if (e.matches(".active") && n.classList.add("Selected"),
                                !e.matches(".nav-link")) {
                                    var i = y(e, ".dropdown-menu")[0];
                                    i && n.append(o(i)),
                                    e = y(e, ".nav-link")[0]
                                }
                                n.prepend(a(e)),
                                t.append(n)
                            }
                            )),
                            t
                        }(t));
                        break;
                    case t.matches(".dropdown-menu"):
                        n.append(o(t));
                        break;
                    case t.matches(".form-inline"):
                        e.conf.searchfield.form = {
                            action: t.getAttribute("action") || null,
                            method: t.getAttribute("method") || null
                        },
                        e.conf.searchfield.input = {
                            name: t.querySelector("input").getAttribute("name") || null
                        },
                        e.conf.searchfield.clear = !1,
                        e.conf.searchfield.submit = !0;
                        break;
                    default:
                        n.append(t.cloneNode(!0))
                    }
                }
                )),
                this.bind("initMenu:before", (function() {
                    document.body.prepend(t),
                    e.node.menu = t
                }
                ));
                var i = this.node.menu.parentElement;
                if (i) {
                    var s = i.querySelector(".navbar-toggler");
                    s && (s.removeAttribute("data-target"),
                    s.removeAttribute("aria-controls"),
                    s.outerHTML = s.outerHTML,
                    (s = i.querySelector(".navbar-toggler")).addEventListener("click", (function(t) {
                        t.preventDefault(),
                        t.stopImmediatePropagation(),
                        e[e.vars.opened ? "close" : "open"]()
                    }
                    )))
                }
            }
            function a(e) {
                for (var t = g(e.matches("a") ? "a" : "span"), n = ["href", "title", "target"], i = 0; i < n.length; i++)
                    e.getAttribute(n[i]) && t.setAttribute(n[i], e.getAttribute(n[i]));
                return t.innerHTML = e.innerHTML,
                _(t, ".sr-only").forEach((function(e) {
                    e.remove()
                }
                )),
                t
            }
            function o(e) {
                var t = g("ul");
                return y(e).forEach((function(e) {
                    var n = g("li");
                    e.matches(".dropdown-divider") ? n.classList.add("Divider") : e.matches(".dropdown-item") && n.append(a(e)),
                    t.append(n)
                }
                )),
                t
            }
        },
        olark: function() {
            this.conf.offCanvas.page.noSelector.push("#olark")
        },
        turbolinks: function() {
            var e;
            document.addEventListener("turbolinks:before-visit", (function(t) {
                e = document.querySelector(".mm-wrapper").className.split(" ").filter((function(e) {
                    return /mm-/.test(e)
                }
                ))
            }
            )),
            document.addEventListener("turbolinks:load", (function(t) {
                void 0 !== e && (document.querySelector(".mm-wrapper").className = e)
            }
            ))
        },
        wordpress: function() {
            this.conf.classNames.selected = "current-menu-item";
            var e = document.getElementById("wpadminbar");
            e && (e.style.position = "fixed",
            e.classList.add("mm-slideout"))
        }
    };
    var Oe;
    t.default = M;
    window && (window.Mmenu = M),
    (Oe = window.jQuery || window.Zepto || null) && (Oe.fn.mmenu = function(e, t) {
        var n = Oe();
        return this.each((function(i, s) {
            if (!s.mmApi) {
                var a = new M(s,e,t)
                  , o = Oe(a.node.menu);
                o.data("mmenu", a.API),
                n = n.add(o)
            }
        }
        )),
        n
    }
    )
}
]);
/*
* jquery-match-height 0.7.2 by @liabru
* http://brm.io/jquery-match-height/
* License MIT
*/
!function(t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], t) : "undefined" != typeof module && module.exports ? module.exports = t(require("jquery")) : t(jQuery)
}(function(t) {
    var e = -1
      , o = -1
      , n = function(t) {
        return parseFloat(t) || 0
    }
      , a = function(e) {
        var o = 1
          , a = t(e)
          , i = null
          , r = [];
        return a.each(function() {
            var e = t(this)
              , a = e.offset().top - n(e.css("margin-top"))
              , s = r.length > 0 ? r[r.length - 1] : null;
            null === s ? r.push(e) : Math.floor(Math.abs(i - a)) <= o ? r[r.length - 1] = s.add(e) : r.push(e),
            i = a
        }),
        r
    }
      , i = function(e) {
        var o = {
            byRow: !0,
            property: "height",
            target: null,
            remove: !1
        };
        return "object" == typeof e ? t.extend(o, e) : ("boolean" == typeof e ? o.byRow = e : "remove" === e && (o.remove = !0),
        o)
    }
      , r = t.fn.matchHeight = function(e) {
        var o = i(e);
        if (o.remove) {
            var n = this;
            return this.css(o.property, ""),
            t.each(r._groups, function(t, e) {
                e.elements = e.elements.not(n)
            }),
            this
        }
        return this.length <= 1 && !o.target ? this : (r._groups.push({
            elements: this,
            options: o
        }),
        r._apply(this, o),
        this)
    }
    ;
    r.version = "0.7.2",
    r._groups = [],
    r._throttle = 80,
    r._maintainScroll = !1,
    r._beforeUpdate = null,
    r._afterUpdate = null,
    r._rows = a,
    r._parse = n,
    r._parseOptions = i,
    r._apply = function(e, o) {
        var s = i(o)
          , h = t(e)
          , l = [h]
          , c = t(window).scrollTop()
          , p = t("html").outerHeight(!0)
          , u = h.parents().filter(":hidden");
        return u.each(function() {
            var e = t(this);
            e.data("style-cache", e.attr("style"))
        }),
        u.css("display", "block"),
        s.byRow && !s.target && (h.each(function() {
            var e = t(this)
              , o = e.css("display");
            "inline-block" !== o && "flex" !== o && "inline-flex" !== o && (o = "block"),
            e.data("style-cache", e.attr("style")),
            e.css({
                display: o,
                "padding-top": "0",
                "padding-bottom": "0",
                "margin-top": "0",
                "margin-bottom": "0",
                "border-top-width": "0",
                "border-bottom-width": "0",
                height: "100px",
                overflow: "hidden"
            })
        }),
        l = a(h),
        h.each(function() {
            var e = t(this);
            e.attr("style", e.data("style-cache") || "")
        })),
        t.each(l, function(e, o) {
            var a = t(o)
              , i = 0;
            if (s.target)
                i = s.target.outerHeight(!1);
            else {
                if (s.byRow && a.length <= 1)
                    return void a.css(s.property, "");
                a.each(function() {
                    var e = t(this)
                      , o = e.attr("style")
                      , n = e.css("display");
                    "inline-block" !== n && "flex" !== n && "inline-flex" !== n && (n = "block");
                    var a = {
                        display: n
                    };
                    a[s.property] = "",
                    e.css(a),
                    e.outerHeight(!1) > i && (i = e.outerHeight(!1)),
                    o ? e.attr("style", o) : e.css("display", "")
                })
            }
            a.each(function() {
                var e = t(this)
                  , o = 0;
                s.target && e.is(s.target) || ("border-box" !== e.css("box-sizing") && (o += n(e.css("border-top-width")) + n(e.css("border-bottom-width")),
                o += n(e.css("padding-top")) + n(e.css("padding-bottom"))),
                e.css(s.property, i - o + "px"))
            })
        }),
        u.each(function() {
            var e = t(this);
            e.attr("style", e.data("style-cache") || null)
        }),
        r._maintainScroll && t(window).scrollTop(c / p * t("html").outerHeight(!0)),
        this
    }
    ,
    r._applyDataApi = function() {
        var e = {};
        t("[data-match-height], [data-mh]").each(function() {
            var o = t(this)
              , n = o.attr("data-mh") || o.attr("data-match-height");
            n in e ? e[n] = e[n].add(o) : e[n] = o
        }),
        t.each(e, function() {
            this.matchHeight(!0)
        })
    }
    ;
    var s = function(e) {
        r._beforeUpdate && r._beforeUpdate(e, r._groups),
        t.each(r._groups, function() {
            r._apply(this.elements, this.options)
        }),
        r._afterUpdate && r._afterUpdate(e, r._groups)
    };
    r._update = function(n, a) {
        if (a && "resize" === a.type) {
            var i = t(window).width();
            if (i === e)
                return;
            e = i;
        }
        n ? o === -1 && (o = setTimeout(function() {
            s(a),
            o = -1
        }, r._throttle)) : s(a)
    }
    ,
    t(r._applyDataApi);
    var h = t.fn.on ? "on" : "bind";
    t(window)[h]("load", function(t) {
        r._update(!1, t)
    }),
    t(window)[h]("resize orientationchange", function(t) {
        r._update(!0, t)
    })
});
/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */
!function(n) {
    "function" == typeof define && define.amd ? define(["jquery"], n) : "object" == typeof module && module.exports ? module.exports = function(e, t) {
        return void 0 === t && (t = "undefined" != typeof window ? require("jquery") : require("jquery")(e)),
        n(t),
        t
    }
    : n(jQuery)
}(function(t) {
    var e, n, s, p, r, o, h, f, g, m, y, v, i, a, _, s = (t && t.fn && t.fn.select2 && t.fn.select2.amd && (u = t.fn.select2.amd),
    u && u.requirejs || (u ? n = u : u = {},
    g = {},
    m = {},
    y = {},
    v = {},
    i = Object.prototype.hasOwnProperty,
    a = [].slice,
    _ = /\.js$/,
    h = function(e, t) {
        var n, s, i = c(e), r = i[0], t = t[1];
        return e = i[1],
        r && (n = x(r = l(r, t))),
        r ? e = n && n.normalize ? n.normalize(e, (s = t,
        function(e) {
            return l(e, s)
        }
        )) : l(e, t) : (r = (i = c(e = l(e, t)))[0],
        e = i[1],
        r && (n = x(r))),
        {
            f: r ? r + "!" + e : e,
            n: e,
            pr: r,
            p: n
        }
    }
    ,
    f = {
        require: function(e) {
            return w(e)
        },
        exports: function(e) {
            var t = g[e];
            return void 0 !== t ? t : g[e] = {}
        },
        module: function(e) {
            return {
                id: e,
                uri: "",
                exports: g[e],
                config: (t = e,
                function() {
                    return y && y.config && y.config[t] || {}
                }
                )
            };
            var t
        }
    },
    r = function(e, t, n, s) {
        var i, r, o, a, l, c = [], u = typeof n, d = A(s = s || e);
        if ("undefined" == u || "function" == u) {
            for (t = !t.length && n.length ? ["require", "exports", "module"] : t,
            a = 0; a < t.length; a += 1)
                if ("require" === (r = (o = h(t[a], d)).f))
                    c[a] = f.require(e);
                else if ("exports" === r)
                    c[a] = f.exports(e),
                    l = !0;
                else if ("module" === r)
                    i = c[a] = f.module(e);
                else if (b(g, r) || b(m, r) || b(v, r))
                    c[a] = x(r);
                else {
                    if (!o.p)
                        throw new Error(e + " missing " + r);
                    o.p.load(o.n, w(s, !0), function(t) {
                        return function(e) {
                            g[t] = e
                        }
                    }(r), {}),
                    c[a] = g[r]
                }
            u = n ? n.apply(g[e], c) : void 0,
            e && (i && i.exports !== p && i.exports !== g[e] ? g[e] = i.exports : u === p && l || (g[e] = u))
        } else
            e && (g[e] = n)
    }
    ,
    e = n = o = function(e, t, n, s, i) {
        if ("string" == typeof e)
            return f[e] ? f[e](t) : x(h(e, A(t)).f);
        if (!e.splice) {
            if ((y = e).deps && o(y.deps, y.callback),
            !t)
                return;
            t.splice ? (e = t,
            t = n,
            n = null) : e = p
        }
        return t = t || function() {}
        ,
        "function" == typeof n && (n = s,
        s = i),
        s ? r(p, e, t, n) : setTimeout(function() {
            r(p, e, t, n)
        }, 4),
        o
    }
    ,
    o.config = function(e) {
        return o(e)
    }
    ,
    e._defined = g,
    (s = function(e, t, n) {
        if ("string" != typeof e)
            throw new Error("See almond README: incorrect module build, no module name");
        t.splice || (n = t,
        t = []),
        b(g, e) || b(m, e) || (m[e] = [e, t, n])
    }
    ).amd = {
        jQuery: !0
    },
    u.requirejs = e,
    u.require = n,
    u.define = s),
    u.define("almond", function() {}),
    u.define("jquery", [], function() {
        var e = t || $;
        return null == e && console && console.error && console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),
        e
    }),
    u.define("select2/utils", ["jquery"], function(r) {
        var s = {};
        function c(e) {
            var t, n = e.prototype, s = [];
            for (t in n)
                "function" == typeof n[t] && "constructor" !== t && s.push(t);
            return s
        }
        s.Extend = function(e, t) {
            var n, s = {}.hasOwnProperty;
            function i() {
                this.constructor = e
            }
            for (n in t)
                s.call(t, n) && (e[n] = t[n]);
            return i.prototype = t.prototype,
            e.prototype = new i,
            e.__super__ = t.prototype,
            e
        }
        ,
        s.Decorate = function(s, i) {
            var e = c(i)
              , t = c(s);
            function r() {
                var e = Array.prototype.unshift
                  , t = i.prototype.constructor.length
                  , n = s.prototype.constructor;
                0 < t && (e.call(arguments, s.prototype.constructor),
                n = i.prototype.constructor),
                n.apply(this, arguments)
            }
            i.displayName = s.displayName,
            r.prototype = new function() {
                this.constructor = r
            }
            ;
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                r.prototype[o] = s.prototype[o]
            }
            for (var a = 0; a < e.length; a++) {
                var l = e[a];
                r.prototype[l] = function(e) {
                    var t = function() {};
                    e in r.prototype && (t = r.prototype[e]);
                    var n = i.prototype[e];
                    return function() {
                        return Array.prototype.unshift.call(arguments, t),
                        n.apply(this, arguments)
                    }
                }(l)
            }
            return r
        }
        ;
        function e() {
            this.listeners = {}
        }
        e.prototype.on = function(e, t) {
            this.listeners = this.listeners || {},
            e in this.listeners ? this.listeners[e].push(t) : this.listeners[e] = [t]
        }
        ,
        e.prototype.trigger = function(e) {
            var t = Array.prototype.slice
              , n = t.call(arguments, 1);
            this.listeners = this.listeners || {},
            null == n && (n = []),
            0 === n.length && n.push({}),
            (n[0]._type = e)in this.listeners && this.invoke(this.listeners[e], t.call(arguments, 1)),
            "*"in this.listeners && this.invoke(this.listeners["*"], arguments)
        }
        ,
        e.prototype.invoke = function(e, t) {
            for (var n = 0, s = e.length; n < s; n++)
                e[n].apply(this, t)
        }
        ,
        s.Observable = e,
        s.generateChars = function(e) {
            for (var t = "", n = 0; n < e; n++)
                t += Math.floor(36 * Math.random()).toString(36);
            return t
        }
        ,
        s.bind = function(e, t) {
            return function() {
                e.apply(t, arguments)
            }
        }
        ,
        s._convertData = function(e) {
            for (var t in e) {
                var n = t.split("-")
                  , s = e;
                if (1 !== n.length) {
                    for (var i = 0; i < n.length; i++) {
                        var r = n[i];
                        (r = r.substring(0, 1).toLowerCase() + r.substring(1))in s || (s[r] = {}),
                        i == n.length - 1 && (s[r] = e[t]),
                        s = s[r]
                    }
                    delete e[t]
                }
            }
            return e
        }
        ,
        s.hasScroll = function(e, t) {
            var n = r(t)
              , s = t.style.overflowX
              , i = t.style.overflowY;
            return (s !== i || "hidden" !== i && "visible" !== i) && ("scroll" === s || "scroll" === i || (n.innerHeight() < t.scrollHeight || n.innerWidth() < t.scrollWidth))
        }
        ,
        s.escapeMarkup = function(e) {
            var t = {
                "\\": "&#92;",
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "/": "&#47;"
            };
            return "string" != typeof e ? e : String(e).replace(/[&<>"'\/\\]/g, function(e) {
                return t[e]
            })
        }
        ,
        s.__cache = {};
        var n = 0;
        return s.GetUniqueElementId = function(e) {
            var t = e.getAttribute("data-select2-id");
            return null != t || (t = e.id ? "select2-data-" + e.id : "select2-data-" + (++n).toString() + "-" + s.generateChars(4),
            e.setAttribute("data-select2-id", t)),
            t
        }
        ,
        s.StoreData = function(e, t, n) {
            e = s.GetUniqueElementId(e);
            s.__cache[e] || (s.__cache[e] = {}),
            s.__cache[e][t] = n
        }
        ,
        s.GetData = function(e, t) {
            var n = s.GetUniqueElementId(e);
            return t ? s.__cache[n] && null != s.__cache[n][t] ? s.__cache[n][t] : r(e).data(t) : s.__cache[n]
        }
        ,
        s.RemoveData = function(e) {
            var t = s.GetUniqueElementId(e);
            null != s.__cache[t] && delete s.__cache[t],
            e.removeAttribute("data-select2-id")
        }
        ,
        s.copyNonInternalCssClasses = function(e, t) {
            var n = (n = e.getAttribute("class").trim().split(/\s+/)).filter(function(e) {
                return 0 === e.indexOf("select2-")
            })
              , t = (t = t.getAttribute("class").trim().split(/\s+/)).filter(function(e) {
                return 0 !== e.indexOf("select2-")
            })
              , t = n.concat(t);
            e.setAttribute("class", t.join(" "))
        }
        ,
        s
    }),
    u.define("select2/results", ["jquery", "./utils"], function(d, p) {
        function s(e, t, n) {
            this.$element = e,
            this.data = n,
            this.options = t,
            s.__super__.constructor.call(this)
        }
        return p.Extend(s, p.Observable),
        s.prototype.render = function() {
            var e = d('<ul class="select2-results__options" role="listbox"></ul>');
            return this.options.get("multiple") && e.attr("aria-multiselectable", "true"),
            this.$results = e
        }
        ,
        s.prototype.clear = function() {
            this.$results.empty()
        }
        ,
        s.prototype.displayMessage = function(e) {
            var t = this.options.get("escapeMarkup");
            this.clear(),
            this.hideLoading();
            var n = d('<li role="alert" aria-live="assertive" class="select2-results__option"></li>')
              , s = this.options.get("translations").get(e.message);
            n.append(t(s(e.args))),
            n[0].className += " select2-results__message",
            this.$results.append(n)
        }
        ,
        s.prototype.hideMessages = function() {
            this.$results.find(".select2-results__message").remove()
        }
        ,
        s.prototype.append = function(e) {
            this.hideLoading();
            var t = [];
            if (null != e.results && 0 !== e.results.length) {
                e.results = this.sort(e.results);
                for (var n = 0; n < e.results.length; n++) {
                    var s = e.results[n]
                      , s = this.option(s);
                    t.push(s)
                }
                this.$results.append(t)
            } else
                0 === this.$results.children().length && this.trigger("results:message", {
                    message: "noResults"
                })
        }
        ,
        s.prototype.position = function(e, t) {
            t.find(".select2-results").append(e)
        }
        ,
        s.prototype.sort = function(e) {
            return this.options.get("sorter")(e)
        }
        ,
        s.prototype.highlightFirstItem = function() {
            var e = this.$results.find(".select2-results__option--selectable")
              , t = e.filter(".select2-results__option--selected");
            (0 < t.length ? t : e).first().trigger("mouseenter"),
            this.ensureHighlightVisible()
        }
        ,
        s.prototype.setClasses = function() {
            var t = this;
            this.data.current(function(e) {
                var s = e.map(function(e) {
                    return e.id.toString()
                });
                t.$results.find(".select2-results__option--selectable").each(function() {
                    var e = d(this)
                      , t = p.GetData(this, "data")
                      , n = "" + t.id;
                    null != t.element && t.element.selected || null == t.element && -1 < s.indexOf(n) ? (this.classList.add("select2-results__option--selected"),
                    e.attr("aria-selected", "true")) : (this.classList.remove("select2-results__option--selected"),
                    e.attr("aria-selected", "false"))
                })
            })
        }
        ,
        s.prototype.showLoading = function(e) {
            this.hideLoading();
            e = {
                disabled: !0,
                loading: !0,
                text: this.options.get("translations").get("searching")(e)
            },
            e = this.option(e);
            e.className += " loading-results",
            this.$results.prepend(e)
        }
        ,
        s.prototype.hideLoading = function() {
            this.$results.find(".loading-results").remove()
        }
        ,
        s.prototype.option = function(e) {
            var t = document.createElement("li");
            t.classList.add("select2-results__option"),
            t.classList.add("select2-results__option--selectable");
            var n, s = {
                role: "option"
            }, i = window.Element.prototype.matches || window.Element.prototype.msMatchesSelector || window.Element.prototype.webkitMatchesSelector;
            for (n in (null != e.element && i.call(e.element, ":disabled") || null == e.element && e.disabled) && (s["aria-disabled"] = "true",
            t.classList.remove("select2-results__option--selectable"),
            t.classList.add("select2-results__option--disabled")),
            null == e.id && t.classList.remove("select2-results__option--selectable"),
            null != e._resultId && (t.id = e._resultId),
            e.title && (t.title = e.title),
            e.children && (s.role = "group",
            s["aria-label"] = e.text,
            t.classList.remove("select2-results__option--selectable"),
            t.classList.add("select2-results__option--group")),
            s) {
                var r = s[n];
                t.setAttribute(n, r)
            }
            if (e.children) {
                var o = d(t)
                  , a = document.createElement("strong");
                a.className = "select2-results__group",
                this.template(e, a);
                for (var l = [], c = 0; c < e.children.length; c++) {
                    var u = e.children[c]
                      , u = this.option(u);
                    l.push(u)
                }
                i = d("<ul></ul>", {
                    class: "select2-results__options select2-results__options--nested",
                    role: "none"
                });
                i.append(l),
                o.append(a),
                o.append(i)
            } else
                this.template(e, t);
            return p.StoreData(t, "data", e),
            t
        }
        ,
        s.prototype.bind = function(t, e) {
            var i = this
              , n = t.id + "-results";
            this.$results.attr("id", n),
            t.on("results:all", function(e) {
                i.clear(),
                i.append(e.data),
                t.isOpen() && (i.setClasses(),
                i.highlightFirstItem())
            }),
            t.on("results:append", function(e) {
                i.append(e.data),
                t.isOpen() && i.setClasses()
            }),
            t.on("query", function(e) {
                i.hideMessages(),
                i.showLoading(e)
            }),
            t.on("select", function() {
                t.isOpen() && (i.setClasses(),
                i.options.get("scrollAfterSelect") && i.highlightFirstItem())
            }),
            t.on("unselect", function() {
                t.isOpen() && (i.setClasses(),
                i.options.get("scrollAfterSelect") && i.highlightFirstItem())
            }),
            t.on("open", function() {
                i.$results.attr("aria-expanded", "true"),
                i.$results.attr("aria-hidden", "false"),
                i.setClasses(),
                i.ensureHighlightVisible()
            }),
            t.on("close", function() {
                i.$results.attr("aria-expanded", "false"),
                i.$results.attr("aria-hidden", "true"),
                i.$results.removeAttr("aria-activedescendant")
            }),
            t.on("results:toggle", function() {
                var e = i.getHighlightedResults();
                0 !== e.length && e.trigger("mouseup")
            }),
            t.on("results:select", function() {
                var e, t = i.getHighlightedResults();
                0 !== t.length && (e = p.GetData(t[0], "data"),
                t.hasClass("select2-results__option--selected") ? i.trigger("close", {}) : i.trigger("select", {
                    data: e
                }))
            }),
            t.on("results:previous", function() {
                var e, t = i.getHighlightedResults(), n = i.$results.find(".select2-results__option--selectable"), s = n.index(t);
                s <= 0 || (e = s - 1,
                0 === t.length && (e = 0),
                (s = n.eq(e)).trigger("mouseenter"),
                t = i.$results.offset().top,
                n = s.offset().top,
                s = i.$results.scrollTop() + (n - t),
                0 === e ? i.$results.scrollTop(0) : n - t < 0 && i.$results.scrollTop(s))
            }),
            t.on("results:next", function() {
                var e, t = i.getHighlightedResults(), n = i.$results.find(".select2-results__option--selectable"), s = n.index(t) + 1;
                s >= n.length || ((e = n.eq(s)).trigger("mouseenter"),
                t = i.$results.offset().top + i.$results.outerHeight(!1),
                n = e.offset().top + e.outerHeight(!1),
                e = i.$results.scrollTop() + n - t,
                0 === s ? i.$results.scrollTop(0) : t < n && i.$results.scrollTop(e))
            }),
            t.on("results:focus", function(e) {
                e.element[0].classList.add("select2-results__option--highlighted"),
                e.element[0].setAttribute("aria-selected", "true")
            }),
            t.on("results:message", function(e) {
                i.displayMessage(e)
            }),
            d.fn.mousewheel && this.$results.on("mousewheel", function(e) {
                var t = i.$results.scrollTop()
                  , n = i.$results.get(0).scrollHeight - t + e.deltaY
                  , t = 0 < e.deltaY && t - e.deltaY <= 0
                  , n = e.deltaY < 0 && n <= i.$results.height();
                t ? (i.$results.scrollTop(0),
                e.preventDefault(),
                e.stopPropagation()) : n && (i.$results.scrollTop(i.$results.get(0).scrollHeight - i.$results.height()),
                e.preventDefault(),
                e.stopPropagation())
            }),
            this.$results.on("mouseup", ".select2-results__option--selectable", function(e) {
                var t = d(this)
                  , n = p.GetData(this, "data");
                t.hasClass("select2-results__option--selected") ? i.options.get("multiple") ? i.trigger("unselect", {
                    originalEvent: e,
                    data: n
                }) : i.trigger("close", {}) : i.trigger("select", {
                    originalEvent: e,
                    data: n
                })
            }),
            this.$results.on("mouseenter", ".select2-results__option--selectable", function(e) {
                var t = p.GetData(this, "data");
                i.getHighlightedResults().removeClass("select2-results__option--highlighted").attr("aria-selected", "false"),
                i.trigger("results:focus", {
                    data: t,
                    element: d(this)
                })
            })
        }
        ,
        s.prototype.getHighlightedResults = function() {
            return this.$results.find(".select2-results__option--highlighted")
        }
        ,
        s.prototype.destroy = function() {
            this.$results.remove()
        }
        ,
        s.prototype.ensureHighlightVisible = function() {
            var e, t, n, s, i = this.getHighlightedResults();
            0 !== i.length && (e = this.$results.find(".select2-results__option--selectable").index(i),
            s = this.$results.offset().top,
            t = i.offset().top,
            n = this.$results.scrollTop() + (t - s),
            s = t - s,
            n -= 2 * i.outerHeight(!1),
            e <= 2 ? this.$results.scrollTop(0) : (s > this.$results.outerHeight() || s < 0) && this.$results.scrollTop(n))
        }
        ,
        s.prototype.template = function(e, t) {
            var n = this.options.get("templateResult")
              , s = this.options.get("escapeMarkup")
              , e = n(e, t);
            null == e ? t.style.display = "none" : "string" == typeof e ? t.innerHTML = s(e) : d(t).append(e)
        }
        ,
        s
    }),
    u.define("select2/keys", [], function() {
        return {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DELETE: 46
        }
    }),
    u.define("select2/selection/base", ["jquery", "../utils", "../keys"], function(n, s, i) {
        function r(e, t) {
            this.$element = e,
            this.options = t,
            r.__super__.constructor.call(this)
        }
        return s.Extend(r, s.Observable),
        r.prototype.render = function() {
            var e = n('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');
            return this._tabindex = 0,
            null != s.GetData(this.$element[0], "old-tabindex") ? this._tabindex = s.GetData(this.$element[0], "old-tabindex") : null != this.$element.attr("tabindex") && (this._tabindex = this.$element.attr("tabindex")),
            e.attr("title", this.$element.attr("title")),
            e.attr("tabindex", this._tabindex),
            e.attr("aria-disabled", "false"),
            this.$selection = e
        }
        ,
        r.prototype.bind = function(e, t) {
            var n = this
              , s = e.id + "-results";
            this.container = e,
            this.$selection.on("focus", function(e) {
                n.trigger("focus", e)
            }),
            this.$selection.on("blur", function(e) {
                n._handleBlur(e)
            }),
            this.$selection.on("keydown", function(e) {
                n.trigger("keypress", e),
                e.which === i.SPACE && e.preventDefault()
            }),
            e.on("results:focus", function(e) {
                n.$selection.attr("aria-activedescendant", e.data._resultId)
            }),
            e.on("selection:update", function(e) {
                n.update(e.data)
            }),
            e.on("open", function() {
                n.$selection.attr("aria-expanded", "true"),
                n.$selection.attr("aria-owns", s),
                n._attachCloseHandler(e)
            }),
            e.on("close", function() {
                n.$selection.attr("aria-expanded", "false"),
                n.$selection.removeAttr("aria-activedescendant"),
                n.$selection.removeAttr("aria-owns"),
                n.$selection.trigger("focus"),
                n._detachCloseHandler(e)
            }),
            e.on("enable", function() {
                n.$selection.attr("tabindex", n._tabindex),
                n.$selection.attr("aria-disabled", "false")
            }),
            e.on("disable", function() {
                n.$selection.attr("tabindex", "-1"),
                n.$selection.attr("aria-disabled", "true")
            })
        }
        ,
        r.prototype._handleBlur = function(e) {
            var t = this;
            window.setTimeout(function() {
                document.activeElement == t.$selection[0] || n.contains(t.$selection[0], document.activeElement) || t.trigger("blur", e)
            }, 1)
        }
        ,
        r.prototype._attachCloseHandler = function(e) {
            n(document.body).on("mousedown.select2." + e.id, function(e) {
                var t = n(e.target).closest(".select2");
                n(".select2.select2-container--open").each(function() {
                    this != t[0] && s.GetData(this, "element").select2("close")
                })
            })
        }
        ,
        r.prototype._detachCloseHandler = function(e) {
            n(document.body).off("mousedown.select2." + e.id)
        }
        ,
        r.prototype.position = function(e, t) {
            t.find(".selection").append(e)
        }
        ,
        r.prototype.destroy = function() {
            this._detachCloseHandler(this.container)
        }
        ,
        r.prototype.update = function(e) {
            throw new Error("The `update` method must be defined in child classes.")
        }
        ,
        r.prototype.isEnabled = function() {
            return !this.isDisabled()
        }
        ,
        r.prototype.isDisabled = function() {
            return this.options.get("disabled")
        }
        ,
        r
    }),
    u.define("select2/selection/single", ["jquery", "./base", "../utils", "../keys"], function(e, t, n, s) {
        function i() {
            i.__super__.constructor.apply(this, arguments)
        }
        return n.Extend(i, t),
        i.prototype.render = function() {
            var e = i.__super__.render.call(this);
            return e[0].classList.add("select2-selection--single"),
            e.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),
            e
        }
        ,
        i.prototype.bind = function(t, e) {
            var n = this;
            i.__super__.bind.apply(this, arguments);
            var s = t.id + "-container";
            this.$selection.find(".select2-selection__rendered").attr("id", s).attr("role", "textbox").attr("aria-readonly", "true"),
            this.$selection.attr("aria-labelledby", s),
            this.$selection.attr("aria-controls", s),
            this.$selection.on("mousedown", function(e) {
                1 === e.which && n.trigger("toggle", {
                    originalEvent: e
                })
            }),
            this.$selection.on("focus", function(e) {}),
            this.$selection.on("blur", function(e) {}),
            t.on("focus", function(e) {
                t.isOpen() || n.$selection.trigger("focus")
            })
        }
        ,
        i.prototype.clear = function() {
            var e = this.$selection.find(".select2-selection__rendered");
            e.empty(),
            e.removeAttr("title")
        }
        ,
        i.prototype.display = function(e, t) {
            var n = this.options.get("templateSelection");
            return this.options.get("escapeMarkup")(n(e, t))
        }
        ,
        i.prototype.selectionContainer = function() {
            return e("<span></span>")
        }
        ,
        i.prototype.update = function(e) {
            var t, n;
            0 !== e.length ? (n = e[0],
            t = this.$selection.find(".select2-selection__rendered"),
            e = this.display(n, t),
            t.empty().append(e),
            (n = n.title || n.text) ? t.attr("title", n) : t.removeAttr("title")) : this.clear()
        }
        ,
        i
    }),
    u.define("select2/selection/multiple", ["jquery", "./base", "../utils"], function(i, e, c) {
        function r(e, t) {
            r.__super__.constructor.apply(this, arguments)
        }
        return c.Extend(r, e),
        r.prototype.render = function() {
            var e = r.__super__.render.call(this);
            return e[0].classList.add("select2-selection--multiple"),
            e.html('<ul class="select2-selection__rendered"></ul>'),
            e
        }
        ,
        r.prototype.bind = function(e, t) {
            var n = this;
            r.__super__.bind.apply(this, arguments);
            var s = e.id + "-container";
            this.$selection.find(".select2-selection__rendered").attr("id", s),
            this.$selection.on("click", function(e) {
                n.trigger("toggle", {
                    originalEvent: e
                })
            }),
            this.$selection.on("click", ".select2-selection__choice__remove", function(e) {
                var t;
                n.isDisabled() || (t = i(this).parent(),
                t = c.GetData(t[0], "data"),
                n.trigger("unselect", {
                    originalEvent: e,
                    data: t
                }))
            }),
            this.$selection.on("keydown", ".select2-selection__choice__remove", function(e) {
                n.isDisabled() || e.stopPropagation()
            })
        }
        ,
        r.prototype.clear = function() {
            var e = this.$selection.find(".select2-selection__rendered");
            e.empty(),
            e.removeAttr("title")
        }
        ,
        r.prototype.display = function(e, t) {
            var n = this.options.get("templateSelection");
            return this.options.get("escapeMarkup")(n(e, t))
        }
        ,
        r.prototype.selectionContainer = function() {
            return i('<li class="select2-selection__choice"><button type="button" class="select2-selection__choice__remove" tabindex="-1"><span aria-hidden="true">&times;</span></button><span class="select2-selection__choice__display"></span></li>')
        }
        ,
        r.prototype.update = function(e) {
            if (this.clear(),
            0 !== e.length) {
                for (var t = [], n = this.$selection.find(".select2-selection__rendered").attr("id") + "-choice-", s = 0; s < e.length; s++) {
                    var i = e[s]
                      , r = this.selectionContainer()
                      , o = this.display(i, r)
                      , a = n + c.generateChars(4) + "-";
                    i.id ? a += i.id : a += c.generateChars(4),
                    r.find(".select2-selection__choice__display").append(o).attr("id", a);
                    var l = i.title || i.text;
                    l && r.attr("title", l);
                    o = this.options.get("translations").get("removeItem"),
                    l = r.find(".select2-selection__choice__remove");
                    l.attr("title", o()),
                    l.attr("aria-label", o()),
                    l.attr("aria-describedby", a),
                    c.StoreData(r[0], "data", i),
                    t.push(r)
                }
                this.$selection.find(".select2-selection__rendered").append(t)
            }
        }
        ,
        r
    }),
    u.define("select2/selection/placeholder", [], function() {
        function e(e, t, n) {
            this.placeholder = this.normalizePlaceholder(n.get("placeholder")),
            e.call(this, t, n)
        }
        return e.prototype.normalizePlaceholder = function(e, t) {
            return "string" == typeof t && (t = {
                id: "",
                text: t
            }),
            t
        }
        ,
        e.prototype.createPlaceholder = function(e, t) {
            var n = this.selectionContainer();
            n.html(this.display(t)),
            n[0].classList.add("select2-selection__placeholder"),
            n[0].classList.remove("select2-selection__choice");
            t = t.title || t.text || n.text();
            return this.$selection.find(".select2-selection__rendered").attr("title", t),
            n
        }
        ,
        e.prototype.update = function(e, t) {
            var n = 1 == t.length && t[0].id != this.placeholder.id;
            if (1 < t.length || n)
                return e.call(this, t);
            this.clear();
            t = this.createPlaceholder(this.placeholder);
            this.$selection.find(".select2-selection__rendered").append(t)
        }
        ,
        e
    }),
    u.define("select2/selection/allowClear", ["jquery", "../keys", "../utils"], function(i, s, a) {
        function e() {}
        return e.prototype.bind = function(e, t, n) {
            var s = this;
            e.call(this, t, n),
            null == this.placeholder && this.options.get("debug") && window.console && console.error && console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),
            this.$selection.on("mousedown", ".select2-selection__clear", function(e) {
                s._handleClear(e)
            }),
            t.on("keypress", function(e) {
                s._handleKeyboardClear(e, t)
            })
        }
        ,
        e.prototype._handleClear = function(e, t) {
            if (!this.isDisabled()) {
                var n = this.$selection.find(".select2-selection__clear");
                if (0 !== n.length) {
                    t.stopPropagation();
                    var s = a.GetData(n[0], "data")
                      , i = this.$element.val();
                    this.$element.val(this.placeholder.id);
                    var r = {
                        data: s
                    };
                    if (this.trigger("clear", r),
                    r.prevented)
                        this.$element.val(i);
                    else {
                        for (var o = 0; o < s.length; o++)
                            if (r = {
                                data: s[o]
                            },
                            this.trigger("unselect", r),
                            r.prevented)
                                return void this.$element.val(i);
                        this.$element.trigger("input").trigger("change"),
                        this.trigger("toggle", {})
                    }
                }
            }
        }
        ,
        e.prototype._handleKeyboardClear = function(e, t, n) {
            n.isOpen() || t.which != s.DELETE && t.which != s.BACKSPACE || this._handleClear(t)
        }
        ,
        e.prototype.update = function(e, t) {
            var n, s;
            e.call(this, t),
            this.$selection.find(".select2-selection__clear").remove(),
            this.$selection[0].classList.remove("select2-selection--clearable"),
            0 < this.$selection.find(".select2-selection__placeholder").length || 0 === t.length || (n = this.$selection.find(".select2-selection__rendered").attr("id"),
            s = this.options.get("translations").get("removeAllItems"),
            (e = i('<button type="button" class="select2-selection__clear" tabindex="-1"><span aria-hidden="true">&times;</span></button>')).attr("title", s()),
            e.attr("aria-label", s()),
            e.attr("aria-describedby", n),
            a.StoreData(e[0], "data", t),
            this.$selection.prepend(e),
            this.$selection[0].classList.add("select2-selection--clearable"))
        }
        ,
        e
    }),
    u.define("select2/selection/search", ["jquery", "../utils", "../keys"], function(s, a, l) {
        function e(e, t, n) {
            e.call(this, t, n)
        }
        return e.prototype.render = function(e) {
            var t = this.options.get("translations").get("search")
              , n = s('<span class="select2-search select2-search--inline"><textarea class="select2-search__field" type="search" tabindex="-1" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" ></textarea></span>');
            this.$searchContainer = n,
            this.$search = n.find("textarea"),
            this.$search.prop("autocomplete", this.options.get("autocomplete")),
            this.$search.attr("aria-label", t());
            e = e.call(this);
            return this._transferTabIndex(),
            e.append(this.$searchContainer),
            e
        }
        ,
        e.prototype.bind = function(e, t, n) {
            var s = this
              , i = t.id + "-results"
              , r = t.id + "-container";
            e.call(this, t, n),
            s.$search.attr("aria-describedby", r),
            t.on("open", function() {
                s.$search.attr("aria-controls", i),
                s.$search.trigger("focus")
            }),
            t.on("close", function() {
                s.$search.val(""),
                s.resizeSearch(),
                s.$search.removeAttr("aria-controls"),
                s.$search.removeAttr("aria-activedescendant"),
                s.$search.trigger("focus")
            }),
            t.on("enable", function() {
                s.$search.prop("disabled", !1),
                s._transferTabIndex()
            }),
            t.on("disable", function() {
                s.$search.prop("disabled", !0)
            }),
            t.on("focus", function(e) {
                s.$search.trigger("focus")
            }),
            t.on("results:focus", function(e) {
                e.data._resultId ? s.$search.attr("aria-activedescendant", e.data._resultId) : s.$search.removeAttr("aria-activedescendant")
            }),
            this.$selection.on("focusin", ".select2-search--inline", function(e) {
                s.trigger("focus", e)
            }),
            this.$selection.on("focusout", ".select2-search--inline", function(e) {
                s._handleBlur(e)
            }),
            this.$selection.on("keydown", ".select2-search--inline", function(e) {
                var t;
                e.stopPropagation(),
                s.trigger("keypress", e),
                s._keyUpPrevented = e.isDefaultPrevented(),
                e.which !== l.BACKSPACE || "" !== s.$search.val() || 0 < (t = s.$selection.find(".select2-selection__choice").last()).length && (t = a.GetData(t[0], "data"),
                s.searchRemoveChoice(t),
                e.preventDefault())
            }),
            this.$selection.on("click", ".select2-search--inline", function(e) {
                s.$search.val() && e.stopPropagation()
            });
            var t = document.documentMode
              , o = t && t <= 11;
            this.$selection.on("input.searchcheck", ".select2-search--inline", function(e) {
                o ? s.$selection.off("input.search input.searchcheck") : s.$selection.off("keyup.search")
            }),
            this.$selection.on("keyup.search input.search", ".select2-search--inline", function(e) {
                var t;
                o && "input" === e.type ? s.$selection.off("input.search input.searchcheck") : (t = e.which) != l.SHIFT && t != l.CTRL && t != l.ALT && t != l.TAB && s.handleSearch(e)
            })
        }
        ,
        e.prototype._transferTabIndex = function(e) {
            this.$search.attr("tabindex", this.$selection.attr("tabindex")),
            this.$selection.attr("tabindex", "-1")
        }
        ,
        e.prototype.createPlaceholder = function(e, t) {
            this.$search.attr("placeholder", t.text)
        }
        ,
        e.prototype.update = function(e, t) {
            var n = this.$search[0] == document.activeElement;
            this.$search.attr("placeholder", ""),
            e.call(this, t),
            this.resizeSearch(),
            n && this.$search.trigger("focus")
        }
        ,
        e.prototype.handleSearch = function() {
            var e;
            this.resizeSearch(),
            this._keyUpPrevented || (e = this.$search.val(),
            this.trigger("query", {
                term: e
            })),
            this._keyUpPrevented = !1
        }
        ,
        e.prototype.searchRemoveChoice = function(e, t) {
            this.trigger("unselect", {
                data: t
            }),
            this.$search.val(t.text),
            this.handleSearch()
        }
        ,
        e.prototype.resizeSearch = function() {
            this.$search.css("width", "25px");
            var e = "100%";
            "" === this.$search.attr("placeholder") && (e = .75 * (this.$search.val().length + 1) + "em"),
            this.$search.css("width", e)
        }
        ,
        e
    }),
    u.define("select2/selection/selectionCss", ["../utils"], function(n) {
        function e() {}
        return e.prototype.render = function(e) {
            var t = e.call(this)
              , e = this.options.get("selectionCssClass") || "";
            return -1 !== e.indexOf(":all:") && (e = e.replace(":all:", ""),
            n.copyNonInternalCssClasses(t[0], this.$element[0])),
            t.addClass(e),
            t
        }
        ,
        e
    }),
    u.define("select2/selection/eventRelay", ["jquery"], function(o) {
        function e() {}
        return e.prototype.bind = function(e, t, n) {
            var s = this
              , i = ["open", "opening", "close", "closing", "select", "selecting", "unselect", "unselecting", "clear", "clearing"]
              , r = ["opening", "closing", "selecting", "unselecting", "clearing"];
            e.call(this, t, n),
            t.on("*", function(e, t) {
                var n;
                -1 !== i.indexOf(e) && (t = t || {},
                n = o.Event("select2:" + e, {
                    params: t
                }),
                s.$element.trigger(n),
                -1 !== r.indexOf(e) && (t.prevented = n.isDefaultPrevented()))
            })
        }
        ,
        e
    }),
    u.define("select2/translation", ["jquery", "require"], function(t, n) {
        function s(e) {
            this.dict = e || {}
        }
        return s.prototype.all = function() {
            return this.dict
        }
        ,
        s.prototype.get = function(e) {
            return this.dict[e]
        }
        ,
        s.prototype.extend = function(e) {
            this.dict = t.extend({}, e.all(), this.dict)
        }
        ,
        s._cache = {},
        s.loadPath = function(e) {
            var t;
            return e in s._cache || (t = n(e),
            s._cache[e] = t),
            new s(s._cache[e])
        }
        ,
        s
    }),
    u.define("select2/diacritics", [], function() {
        return {
            "Ⓐ": "A",
            "Ａ": "A",
            "À": "A",
            "Á": "A",
            "Â": "A",
            "Ầ": "A",
            "Ấ": "A",
            "Ẫ": "A",
            "Ẩ": "A",
            "Ã": "A",
            "Ā": "A",
            "Ă": "A",
            "Ằ": "A",
            "Ắ": "A",
            "Ẵ": "A",
            "Ẳ": "A",
            "Ȧ": "A",
            "Ǡ": "A",
            "Ä": "A",
            "Ǟ": "A",
            "Ả": "A",
            "Å": "A",
            "Ǻ": "A",
            "Ǎ": "A",
            "Ȁ": "A",
            "Ȃ": "A",
            "Ạ": "A",
            "Ậ": "A",
            "Ặ": "A",
            "Ḁ": "A",
            "Ą": "A",
            "Ⱥ": "A",
            "Ɐ": "A",
            "Ꜳ": "AA",
            "Æ": "AE",
            "Ǽ": "AE",
            "Ǣ": "AE",
            "Ꜵ": "AO",
            "Ꜷ": "AU",
            "Ꜹ": "AV",
            "Ꜻ": "AV",
            "Ꜽ": "AY",
            "Ⓑ": "B",
            "Ｂ": "B",
            "Ḃ": "B",
            "Ḅ": "B",
            "Ḇ": "B",
            "Ƀ": "B",
            "Ƃ": "B",
            "Ɓ": "B",
            "Ⓒ": "C",
            "Ｃ": "C",
            "Ć": "C",
            "Ĉ": "C",
            "Ċ": "C",
            "Č": "C",
            "Ç": "C",
            "Ḉ": "C",
            "Ƈ": "C",
            "Ȼ": "C",
            "Ꜿ": "C",
            "Ⓓ": "D",
            "Ｄ": "D",
            "Ḋ": "D",
            "Ď": "D",
            "Ḍ": "D",
            "Ḑ": "D",
            "Ḓ": "D",
            "Ḏ": "D",
            "Đ": "D",
            "Ƌ": "D",
            "Ɗ": "D",
            "Ɖ": "D",
            "Ꝺ": "D",
            "Ǳ": "DZ",
            "Ǆ": "DZ",
            "ǲ": "Dz",
            "ǅ": "Dz",
            "Ⓔ": "E",
            "Ｅ": "E",
            "È": "E",
            "É": "E",
            "Ê": "E",
            "Ề": "E",
            "Ế": "E",
            "Ễ": "E",
            "Ể": "E",
            "Ẽ": "E",
            "Ē": "E",
            "Ḕ": "E",
            "Ḗ": "E",
            "Ĕ": "E",
            "Ė": "E",
            "Ë": "E",
            "Ẻ": "E",
            "Ě": "E",
            "Ȅ": "E",
            "Ȇ": "E",
            "Ẹ": "E",
            "Ệ": "E",
            "Ȩ": "E",
            "Ḝ": "E",
            "Ę": "E",
            "Ḙ": "E",
            "Ḛ": "E",
            "Ɛ": "E",
            "Ǝ": "E",
            "Ⓕ": "F",
            "Ｆ": "F",
            "Ḟ": "F",
            "Ƒ": "F",
            "Ꝼ": "F",
            "Ⓖ": "G",
            "Ｇ": "G",
            "Ǵ": "G",
            "Ĝ": "G",
            "Ḡ": "G",
            "Ğ": "G",
            "Ġ": "G",
            "Ǧ": "G",
            "Ģ": "G",
            "Ǥ": "G",
            "Ɠ": "G",
            "Ꞡ": "G",
            "Ᵹ": "G",
            "Ꝿ": "G",
            "Ⓗ": "H",
            "Ｈ": "H",
            "Ĥ": "H",
            "Ḣ": "H",
            "Ḧ": "H",
            "Ȟ": "H",
            "Ḥ": "H",
            "Ḩ": "H",
            "Ḫ": "H",
            "Ħ": "H",
            "Ⱨ": "H",
            "Ⱶ": "H",
            "Ɥ": "H",
            "Ⓘ": "I",
            "Ｉ": "I",
            "Ì": "I",
            "Í": "I",
            "Î": "I",
            "Ĩ": "I",
            "Ī": "I",
            "Ĭ": "I",
            "İ": "I",
            "Ï": "I",
            "Ḯ": "I",
            "Ỉ": "I",
            "Ǐ": "I",
            "Ȉ": "I",
            "Ȋ": "I",
            "Ị": "I",
            "Į": "I",
            "Ḭ": "I",
            "Ɨ": "I",
            "Ⓙ": "J",
            "Ｊ": "J",
            "Ĵ": "J",
            "Ɉ": "J",
            "Ⓚ": "K",
            "Ｋ": "K",
            "Ḱ": "K",
            "Ǩ": "K",
            "Ḳ": "K",
            "Ķ": "K",
            "Ḵ": "K",
            "Ƙ": "K",
            "Ⱪ": "K",
            "Ꝁ": "K",
            "Ꝃ": "K",
            "Ꝅ": "K",
            "Ꞣ": "K",
            "Ⓛ": "L",
            "Ｌ": "L",
            "Ŀ": "L",
            "Ĺ": "L",
            "Ľ": "L",
            "Ḷ": "L",
            "Ḹ": "L",
            "Ļ": "L",
            "Ḽ": "L",
            "Ḻ": "L",
            "Ł": "L",
            "Ƚ": "L",
            "Ɫ": "L",
            "Ⱡ": "L",
            "Ꝉ": "L",
            "Ꝇ": "L",
            "Ꞁ": "L",
            "Ǉ": "LJ",
            "ǈ": "Lj",
            "Ⓜ": "M",
            "Ｍ": "M",
            "Ḿ": "M",
            "Ṁ": "M",
            "Ṃ": "M",
            "Ɱ": "M",
            "Ɯ": "M",
            "Ⓝ": "N",
            "Ｎ": "N",
            "Ǹ": "N",
            "Ń": "N",
            "Ñ": "N",
            "Ṅ": "N",
            "Ň": "N",
            "Ṇ": "N",
            "Ņ": "N",
            "Ṋ": "N",
            "Ṉ": "N",
            "Ƞ": "N",
            "Ɲ": "N",
            "Ꞑ": "N",
            "Ꞥ": "N",
            "Ǌ": "NJ",
            "ǋ": "Nj",
            "Ⓞ": "O",
            "Ｏ": "O",
            "Ò": "O",
            "Ó": "O",
            "Ô": "O",
            "Ồ": "O",
            "Ố": "O",
            "Ỗ": "O",
            "Ổ": "O",
            "Õ": "O",
            "Ṍ": "O",
            "Ȭ": "O",
            "Ṏ": "O",
            "Ō": "O",
            "Ṑ": "O",
            "Ṓ": "O",
            "Ŏ": "O",
            "Ȯ": "O",
            "Ȱ": "O",
            "Ö": "O",
            "Ȫ": "O",
            "Ỏ": "O",
            "Ő": "O",
            "Ǒ": "O",
            "Ȍ": "O",
            "Ȏ": "O",
            "Ơ": "O",
            "Ờ": "O",
            "Ớ": "O",
            "Ỡ": "O",
            "Ở": "O",
            "Ợ": "O",
            "Ọ": "O",
            "Ộ": "O",
            "Ǫ": "O",
            "Ǭ": "O",
            "Ø": "O",
            "Ǿ": "O",
            "Ɔ": "O",
            "Ɵ": "O",
            "Ꝋ": "O",
            "Ꝍ": "O",
            "Œ": "OE",
            "Ƣ": "OI",
            "Ꝏ": "OO",
            "Ȣ": "OU",
            "Ⓟ": "P",
            "Ｐ": "P",
            "Ṕ": "P",
            "Ṗ": "P",
            "Ƥ": "P",
            "Ᵽ": "P",
            "Ꝑ": "P",
            "Ꝓ": "P",
            "Ꝕ": "P",
            "Ⓠ": "Q",
            "Ｑ": "Q",
            "Ꝗ": "Q",
            "Ꝙ": "Q",
            "Ɋ": "Q",
            "Ⓡ": "R",
            "Ｒ": "R",
            "Ŕ": "R",
            "Ṙ": "R",
            "Ř": "R",
            "Ȑ": "R",
            "Ȓ": "R",
            "Ṛ": "R",
            "Ṝ": "R",
            "Ŗ": "R",
            "Ṟ": "R",
            "Ɍ": "R",
            "Ɽ": "R",
            "Ꝛ": "R",
            "Ꞧ": "R",
            "Ꞃ": "R",
            "Ⓢ": "S",
            "Ｓ": "S",
            "ẞ": "S",
            "Ś": "S",
            "Ṥ": "S",
            "Ŝ": "S",
            "Ṡ": "S",
            "Š": "S",
            "Ṧ": "S",
            "Ṣ": "S",
            "Ṩ": "S",
            "Ș": "S",
            "Ş": "S",
            "Ȿ": "S",
            "Ꞩ": "S",
            "Ꞅ": "S",
            "Ⓣ": "T",
            "Ｔ": "T",
            "Ṫ": "T",
            "Ť": "T",
            "Ṭ": "T",
            "Ț": "T",
            "Ţ": "T",
            "Ṱ": "T",
            "Ṯ": "T",
            "Ŧ": "T",
            "Ƭ": "T",
            "Ʈ": "T",
            "Ⱦ": "T",
            "Ꞇ": "T",
            "Ꜩ": "TZ",
            "Ⓤ": "U",
            "Ｕ": "U",
            "Ù": "U",
            "Ú": "U",
            "Û": "U",
            "Ũ": "U",
            "Ṹ": "U",
            "Ū": "U",
            "Ṻ": "U",
            "Ŭ": "U",
            "Ü": "U",
            "Ǜ": "U",
            "Ǘ": "U",
            "Ǖ": "U",
            "Ǚ": "U",
            "Ủ": "U",
            "Ů": "U",
            "Ű": "U",
            "Ǔ": "U",
            "Ȕ": "U",
            "Ȗ": "U",
            "Ư": "U",
            "Ừ": "U",
            "Ứ": "U",
            "Ữ": "U",
            "Ử": "U",
            "Ự": "U",
            "Ụ": "U",
            "Ṳ": "U",
            "Ų": "U",
            "Ṷ": "U",
            "Ṵ": "U",
            "Ʉ": "U",
            "Ⓥ": "V",
            "Ｖ": "V",
            "Ṽ": "V",
            "Ṿ": "V",
            "Ʋ": "V",
            "Ꝟ": "V",
            "Ʌ": "V",
            "Ꝡ": "VY",
            "Ⓦ": "W",
            "Ｗ": "W",
            "Ẁ": "W",
            "Ẃ": "W",
            "Ŵ": "W",
            "Ẇ": "W",
            "Ẅ": "W",
            "Ẉ": "W",
            "Ⱳ": "W",
            "Ⓧ": "X",
            "Ｘ": "X",
            "Ẋ": "X",
            "Ẍ": "X",
            "Ⓨ": "Y",
            "Ｙ": "Y",
            "Ỳ": "Y",
            "Ý": "Y",
            "Ŷ": "Y",
            "Ỹ": "Y",
            "Ȳ": "Y",
            "Ẏ": "Y",
            "Ÿ": "Y",
            "Ỷ": "Y",
            "Ỵ": "Y",
            "Ƴ": "Y",
            "Ɏ": "Y",
            "Ỿ": "Y",
            "Ⓩ": "Z",
            "Ｚ": "Z",
            "Ź": "Z",
            "Ẑ": "Z",
            "Ż": "Z",
            "Ž": "Z",
            "Ẓ": "Z",
            "Ẕ": "Z",
            "Ƶ": "Z",
            "Ȥ": "Z",
            "Ɀ": "Z",
            "Ⱬ": "Z",
            "Ꝣ": "Z",
            "ⓐ": "a",
            "ａ": "a",
            "ẚ": "a",
            "à": "a",
            "á": "a",
            "â": "a",
            "ầ": "a",
            "ấ": "a",
            "ẫ": "a",
            "ẩ": "a",
            "ã": "a",
            "ā": "a",
            "ă": "a",
            "ằ": "a",
            "ắ": "a",
            "ẵ": "a",
            "ẳ": "a",
            "ȧ": "a",
            "ǡ": "a",
            "ä": "a",
            "ǟ": "a",
            "ả": "a",
            "å": "a",
            "ǻ": "a",
            "ǎ": "a",
            "ȁ": "a",
            "ȃ": "a",
            "ạ": "a",
            "ậ": "a",
            "ặ": "a",
            "ḁ": "a",
            "ą": "a",
            "ⱥ": "a",
            "ɐ": "a",
            "ꜳ": "aa",
            "æ": "ae",
            "ǽ": "ae",
            "ǣ": "ae",
            "ꜵ": "ao",
            "ꜷ": "au",
            "ꜹ": "av",
            "ꜻ": "av",
            "ꜽ": "ay",
            "ⓑ": "b",
            "ｂ": "b",
            "ḃ": "b",
            "ḅ": "b",
            "ḇ": "b",
            "ƀ": "b",
            "ƃ": "b",
            "ɓ": "b",
            "ⓒ": "c",
            "ｃ": "c",
            "ć": "c",
            "ĉ": "c",
            "ċ": "c",
            "č": "c",
            "ç": "c",
            "ḉ": "c",
            "ƈ": "c",
            "ȼ": "c",
            "ꜿ": "c",
            "ↄ": "c",
            "ⓓ": "d",
            "ｄ": "d",
            "ḋ": "d",
            "ď": "d",
            "ḍ": "d",
            "ḑ": "d",
            "ḓ": "d",
            "ḏ": "d",
            "đ": "d",
            "ƌ": "d",
            "ɖ": "d",
            "ɗ": "d",
            "ꝺ": "d",
            "ǳ": "dz",
            "ǆ": "dz",
            "ⓔ": "e",
            "ｅ": "e",
            "è": "e",
            "é": "e",
            "ê": "e",
            "ề": "e",
            "ế": "e",
            "ễ": "e",
            "ể": "e",
            "ẽ": "e",
            "ē": "e",
            "ḕ": "e",
            "ḗ": "e",
            "ĕ": "e",
            "ė": "e",
            "ë": "e",
            "ẻ": "e",
            "ě": "e",
            "ȅ": "e",
            "ȇ": "e",
            "ẹ": "e",
            "ệ": "e",
            "ȩ": "e",
            "ḝ": "e",
            "ę": "e",
            "ḙ": "e",
            "ḛ": "e",
            "ɇ": "e",
            "ɛ": "e",
            "ǝ": "e",
            "ⓕ": "f",
            "ｆ": "f",
            "ḟ": "f",
            "ƒ": "f",
            "ꝼ": "f",
            "ⓖ": "g",
            "ｇ": "g",
            "ǵ": "g",
            "ĝ": "g",
            "ḡ": "g",
            "ğ": "g",
            "ġ": "g",
            "ǧ": "g",
            "ģ": "g",
            "ǥ": "g",
            "ɠ": "g",
            "ꞡ": "g",
            "ᵹ": "g",
            "ꝿ": "g",
            "ⓗ": "h",
            "ｈ": "h",
            "ĥ": "h",
            "ḣ": "h",
            "ḧ": "h",
            "ȟ": "h",
            "ḥ": "h",
            "ḩ": "h",
            "ḫ": "h",
            "ẖ": "h",
            "ħ": "h",
            "ⱨ": "h",
            "ⱶ": "h",
            "ɥ": "h",
            "ƕ": "hv",
            "ⓘ": "i",
            "ｉ": "i",
            "ì": "i",
            "í": "i",
            "î": "i",
            "ĩ": "i",
            "ī": "i",
            "ĭ": "i",
            "ï": "i",
            "ḯ": "i",
            "ỉ": "i",
            "ǐ": "i",
            "ȉ": "i",
            "ȋ": "i",
            "ị": "i",
            "į": "i",
            "ḭ": "i",
            "ɨ": "i",
            "ı": "i",
            "ⓙ": "j",
            "ｊ": "j",
            "ĵ": "j",
            "ǰ": "j",
            "ɉ": "j",
            "ⓚ": "k",
            "ｋ": "k",
            "ḱ": "k",
            "ǩ": "k",
            "ḳ": "k",
            "ķ": "k",
            "ḵ": "k",
            "ƙ": "k",
            "ⱪ": "k",
            "ꝁ": "k",
            "ꝃ": "k",
            "ꝅ": "k",
            "ꞣ": "k",
            "ⓛ": "l",
            "ｌ": "l",
            "ŀ": "l",
            "ĺ": "l",
            "ľ": "l",
            "ḷ": "l",
            "ḹ": "l",
            "ļ": "l",
            "ḽ": "l",
            "ḻ": "l",
            "ſ": "l",
            "ł": "l",
            "ƚ": "l",
            "ɫ": "l",
            "ⱡ": "l",
            "ꝉ": "l",
            "ꞁ": "l",
            "ꝇ": "l",
            "ǉ": "lj",
            "ⓜ": "m",
            "ｍ": "m",
            "ḿ": "m",
            "ṁ": "m",
            "ṃ": "m",
            "ɱ": "m",
            "ɯ": "m",
            "ⓝ": "n",
            "ｎ": "n",
            "ǹ": "n",
            "ń": "n",
            "ñ": "n",
            "ṅ": "n",
            "ň": "n",
            "ṇ": "n",
            "ņ": "n",
            "ṋ": "n",
            "ṉ": "n",
            "ƞ": "n",
            "ɲ": "n",
            "ŉ": "n",
            "ꞑ": "n",
            "ꞥ": "n",
            "ǌ": "nj",
            "ⓞ": "o",
            "ｏ": "o",
            "ò": "o",
            "ó": "o",
            "ô": "o",
            "ồ": "o",
            "ố": "o",
            "ỗ": "o",
            "ổ": "o",
            "õ": "o",
            "ṍ": "o",
            "ȭ": "o",
            "ṏ": "o",
            "ō": "o",
            "ṑ": "o",
            "ṓ": "o",
            "ŏ": "o",
            "ȯ": "o",
            "ȱ": "o",
            "ö": "o",
            "ȫ": "o",
            "ỏ": "o",
            "ő": "o",
            "ǒ": "o",
            "ȍ": "o",
            "ȏ": "o",
            "ơ": "o",
            "ờ": "o",
            "ớ": "o",
            "ỡ": "o",
            "ở": "o",
            "ợ": "o",
            "ọ": "o",
            "ộ": "o",
            "ǫ": "o",
            "ǭ": "o",
            "ø": "o",
            "ǿ": "o",
            "ɔ": "o",
            "ꝋ": "o",
            "ꝍ": "o",
            "ɵ": "o",
            "œ": "oe",
            "ƣ": "oi",
            "ȣ": "ou",
            "ꝏ": "oo",
            "ⓟ": "p",
            "ｐ": "p",
            "ṕ": "p",
            "ṗ": "p",
            "ƥ": "p",
            "ᵽ": "p",
            "ꝑ": "p",
            "ꝓ": "p",
            "ꝕ": "p",
            "ⓠ": "q",
            "ｑ": "q",
            "ɋ": "q",
            "ꝗ": "q",
            "ꝙ": "q",
            "ⓡ": "r",
            "ｒ": "r",
            "ŕ": "r",
            "ṙ": "r",
            "ř": "r",
            "ȑ": "r",
            "ȓ": "r",
            "ṛ": "r",
            "ṝ": "r",
            "ŗ": "r",
            "ṟ": "r",
            "ɍ": "r",
            "ɽ": "r",
            "ꝛ": "r",
            "ꞧ": "r",
            "ꞃ": "r",
            "ⓢ": "s",
            "ｓ": "s",
            "ß": "s",
            "ś": "s",
            "ṥ": "s",
            "ŝ": "s",
            "ṡ": "s",
            "š": "s",
            "ṧ": "s",
            "ṣ": "s",
            "ṩ": "s",
            "ș": "s",
            "ş": "s",
            "ȿ": "s",
            "ꞩ": "s",
            "ꞅ": "s",
            "ẛ": "s",
            "ⓣ": "t",
            "ｔ": "t",
            "ṫ": "t",
            "ẗ": "t",
            "ť": "t",
            "ṭ": "t",
            "ț": "t",
            "ţ": "t",
            "ṱ": "t",
            "ṯ": "t",
            "ŧ": "t",
            "ƭ": "t",
            "ʈ": "t",
            "ⱦ": "t",
            "ꞇ": "t",
            "ꜩ": "tz",
            "ⓤ": "u",
            "ｕ": "u",
            "ù": "u",
            "ú": "u",
            "û": "u",
            "ũ": "u",
            "ṹ": "u",
            "ū": "u",
            "ṻ": "u",
            "ŭ": "u",
            "ü": "u",
            "ǜ": "u",
            "ǘ": "u",
            "ǖ": "u",
            "ǚ": "u",
            "ủ": "u",
            "ů": "u",
            "ű": "u",
            "ǔ": "u",
            "ȕ": "u",
            "ȗ": "u",
            "ư": "u",
            "ừ": "u",
            "ứ": "u",
            "ữ": "u",
            "ử": "u",
            "ự": "u",
            "ụ": "u",
            "ṳ": "u",
            "ų": "u",
            "ṷ": "u",
            "ṵ": "u",
            "ʉ": "u",
            "ⓥ": "v",
            "ｖ": "v",
            "ṽ": "v",
            "ṿ": "v",
            "ʋ": "v",
            "ꝟ": "v",
            "ʌ": "v",
            "ꝡ": "vy",
            "ⓦ": "w",
            "ｗ": "w",
            "ẁ": "w",
            "ẃ": "w",
            "ŵ": "w",
            "ẇ": "w",
            "ẅ": "w",
            "ẘ": "w",
            "ẉ": "w",
            "ⱳ": "w",
            "ⓧ": "x",
            "ｘ": "x",
            "ẋ": "x",
            "ẍ": "x",
            "ⓨ": "y",
            "ｙ": "y",
            "ỳ": "y",
            "ý": "y",
            "ŷ": "y",
            "ỹ": "y",
            "ȳ": "y",
            "ẏ": "y",
            "ÿ": "y",
            "ỷ": "y",
            "ẙ": "y",
            "ỵ": "y",
            "ƴ": "y",
            "ɏ": "y",
            "ỿ": "y",
            "ⓩ": "z",
            "ｚ": "z",
            "ź": "z",
            "ẑ": "z",
            "ż": "z",
            "ž": "z",
            "ẓ": "z",
            "ẕ": "z",
            "ƶ": "z",
            "ȥ": "z",
            "ɀ": "z",
            "ⱬ": "z",
            "ꝣ": "z",
            "Ά": "Α",
            "Έ": "Ε",
            "Ή": "Η",
            "Ί": "Ι",
            "Ϊ": "Ι",
            "Ό": "Ο",
            "Ύ": "Υ",
            "Ϋ": "Υ",
            "Ώ": "Ω",
            "ά": "α",
            "έ": "ε",
            "ή": "η",
            "ί": "ι",
            "ϊ": "ι",
            "ΐ": "ι",
            "ό": "ο",
            "ύ": "υ",
            "ϋ": "υ",
            "ΰ": "υ",
            "ώ": "ω",
            "ς": "σ",
            "’": "'"
        }
    }),
    u.define("select2/data/base", ["../utils"], function(n) {
        function s(e, t) {
            s.__super__.constructor.call(this)
        }
        return n.Extend(s, n.Observable),
        s.prototype.current = function(e) {
            throw new Error("The `current` method must be defined in child classes.")
        }
        ,
        s.prototype.query = function(e, t) {
            throw new Error("The `query` method must be defined in child classes.")
        }
        ,
        s.prototype.bind = function(e, t) {}
        ,
        s.prototype.destroy = function() {}
        ,
        s.prototype.generateResultId = function(e, t) {
            e = e.id + "-result-";
            return e += n.generateChars(4),
            null != t.id ? e += "-" + t.id.toString() : e += "-" + n.generateChars(4),
            e
        }
        ,
        s
    }),
    u.define("select2/data/select", ["./base", "../utils", "jquery"], function(e, a, l) {
        function n(e, t) {
            this.$element = e,
            this.options = t,
            n.__super__.constructor.call(this)
        }
        return a.Extend(n, e),
        n.prototype.current = function(e) {
            var t = this;
            e(Array.prototype.map.call(this.$element[0].querySelectorAll(":checked"), function(e) {
                return t.item(l(e))
            }))
        }
        ,
        n.prototype.select = function(i) {
            var e, r = this;
            if (i.selected = !0,
            null != i.element && "option" === i.element.tagName.toLowerCase())
                return i.element.selected = !0,
                void this.$element.trigger("input").trigger("change");
            this.$element.prop("multiple") ? this.current(function(e) {
                var t = [];
                (i = [i]).push.apply(i, e);
                for (var n = 0; n < i.length; n++) {
                    var s = i[n].id;
                    -1 === t.indexOf(s) && t.push(s)
                }
                r.$element.val(t),
                r.$element.trigger("input").trigger("change")
            }) : (e = i.id,
            this.$element.val(e),
            this.$element.trigger("input").trigger("change"))
        }
        ,
        n.prototype.unselect = function(i) {
            var r = this;
            if (this.$element.prop("multiple")) {
                if (i.selected = !1,
                null != i.element && "option" === i.element.tagName.toLowerCase())
                    return i.element.selected = !1,
                    void this.$element.trigger("input").trigger("change");
                this.current(function(e) {
                    for (var t = [], n = 0; n < e.length; n++) {
                        var s = e[n].id;
                        s !== i.id && -1 === t.indexOf(s) && t.push(s)
                    }
                    r.$element.val(t),
                    r.$element.trigger("input").trigger("change")
                })
            }
        }
        ,
        n.prototype.bind = function(e, t) {
            var n = this;
            (this.container = e).on("select", function(e) {
                n.select(e.data)
            }),
            e.on("unselect", function(e) {
                n.unselect(e.data)
            })
        }
        ,
        n.prototype.destroy = function() {
            this.$element.find("*").each(function() {
                a.RemoveData(this)
            })
        }
        ,
        n.prototype.query = function(t, e) {
            var n = []
              , s = this;
            this.$element.children().each(function() {
                var e;
                "option" !== this.tagName.toLowerCase() && "optgroup" !== this.tagName.toLowerCase() || (e = l(this),
                e = s.item(e),
                null !== (e = s.matches(t, e)) && n.push(e))
            }),
            e({
                results: n
            })
        }
        ,
        n.prototype.addOptions = function(e) {
            this.$element.append(e)
        }
        ,
        n.prototype.option = function(e) {
            var t;
            e.children ? (t = document.createElement("optgroup")).label = e.text : void 0 !== (t = document.createElement("option")).textContent ? t.textContent = e.text : t.innerText = e.text,
            void 0 !== e.id && (t.value = e.id),
            e.disabled && (t.disabled = !0),
            e.selected && (t.selected = !0),
            e.title && (t.title = e.title);
            e = this._normalizeItem(e);
            return e.element = t,
            a.StoreData(t, "data", e),
            l(t)
        }
        ,
        n.prototype.item = function(e) {
            var t = {};
            if (null != (t = a.GetData(e[0], "data")))
                return t;
            var n = e[0];
            if ("option" === n.tagName.toLowerCase())
                t = {
                    id: e.val(),
                    text: e.text(),
                    disabled: e.prop("disabled"),
                    selected: e.prop("selected"),
                    title: e.prop("title")
                };
            else if ("optgroup" === n.tagName.toLowerCase()) {
                t = {
                    text: e.prop("label"),
                    children: [],
                    title: e.prop("title")
                };
                for (var s = e.children("option"), i = [], r = 0; r < s.length; r++) {
                    var o = l(s[r])
                      , o = this.item(o);
                    i.push(o)
                }
                t.children = i
            }
            return (t = this._normalizeItem(t)).element = e[0],
            a.StoreData(e[0], "data", t),
            t
        }
        ,
        n.prototype._normalizeItem = function(e) {
            e !== Object(e) && (e = {
                id: e,
                text: e
            });
            return null != (e = l.extend({}, {
                text: ""
            }, e)).id && (e.id = e.id.toString()),
            null != e.text && (e.text = e.text.toString()),
            null == e._resultId && e.id && null != this.container && (e._resultId = this.generateResultId(this.container, e)),
            l.extend({}, {
                selected: !1,
                disabled: !1
            }, e)
        }
        ,
        n.prototype.matches = function(e, t) {
            return this.options.get("matcher")(e, t)
        }
        ,
        n
    }),
    u.define("select2/data/array", ["./select", "../utils", "jquery"], function(e, t, c) {
        function s(e, t) {
            this._dataToConvert = t.get("data") || [],
            s.__super__.constructor.call(this, e, t)
        }
        return t.Extend(s, e),
        s.prototype.bind = function(e, t) {
            s.__super__.bind.call(this, e, t),
            this.addOptions(this.convertToOptions(this._dataToConvert))
        }
        ,
        s.prototype.select = function(n) {
            var e = this.$element.find("option").filter(function(e, t) {
                return t.value == n.id.toString()
            });
            0 === e.length && (e = this.option(n),
            this.addOptions(e)),
            s.__super__.select.call(this, n)
        }
        ,
        s.prototype.convertToOptions = function(e) {
            var t = this
              , n = this.$element.find("option")
              , s = n.map(function() {
                return t.item(c(this)).id
            }).get()
              , i = [];
            for (var r = 0; r < e.length; r++) {
                var o, a, l = this._normalizeItem(e[r]);
                0 <= s.indexOf(l.id) ? (o = n.filter(function(e) {
                    return function() {
                        return c(this).val() == e.id
                    }
                }(l)),
                a = this.item(o),
                a = c.extend(!0, {}, l, a),
                a = this.option(a),
                o.replaceWith(a)) : (a = this.option(l),
                l.children && (l = this.convertToOptions(l.children),
                a.append(l)),
                i.push(a))
            }
            return i
        }
        ,
        s
    }),
    u.define("select2/data/ajax", ["./array", "../utils", "jquery"], function(e, t, r) {
        function n(e, t) {
            this.ajaxOptions = this._applyDefaults(t.get("ajax")),
            null != this.ajaxOptions.processResults && (this.processResults = this.ajaxOptions.processResults),
            n.__super__.constructor.call(this, e, t)
        }
        return t.Extend(n, e),
        n.prototype._applyDefaults = function(e) {
            var t = {
                data: function(e) {
                    return r.extend({}, e, {
                        q: e.term
                    })
                },
                transport: function(e, t, n) {
                    e = r.ajax(e);
                    return e.then(t),
                    e.fail(n),
                    e
                }
            };
            return r.extend({}, t, e, !0)
        }
        ,
        n.prototype.processResults = function(e) {
            return e
        }
        ,
        n.prototype.query = function(t, n) {
            var s = this;
            null != this._request && ("function" == typeof this._request.abort && this._request.abort(),
            this._request = null);
            var i = r.extend({
                type: "GET"
            }, this.ajaxOptions);
            function e() {
                var e = i.transport(i, function(e) {
                    e = s.processResults(e, t);
                    s.options.get("debug") && window.console && console.error && (e && e.results && Array.isArray(e.results) || console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),
                    n(e)
                }, function() {
                    "status"in e && (0 === e.status || "0" === e.status) || s.trigger("results:message", {
                        message: "errorLoading"
                    })
                });
                s._request = e
            }
            "function" == typeof i.url && (i.url = i.url.call(this.$element, t)),
            "function" == typeof i.data && (i.data = i.data.call(this.$element, t)),
            this.ajaxOptions.delay && null != t.term ? (this._queryTimeout && window.clearTimeout(this._queryTimeout),
            this._queryTimeout = window.setTimeout(e, this.ajaxOptions.delay)) : e()
        }
        ,
        n
    }),
    u.define("select2/data/tags", ["jquery"], function(t) {
        function e(e, t, n) {
            var s = n.get("tags")
              , i = n.get("createTag");
            void 0 !== i && (this.createTag = i);
            i = n.get("insertTag");
            if (void 0 !== i && (this.insertTag = i),
            e.call(this, t, n),
            Array.isArray(s))
                for (var r = 0; r < s.length; r++) {
                    var o = s[r]
                      , o = this._normalizeItem(o)
                      , o = this.option(o);
                    this.$element.append(o)
                }
        }
        return e.prototype.query = function(e, c, u) {
            var d = this;
            this._removeOldTags(),
            null != c.term && null == c.page ? e.call(this, c, function e(t, n) {
                for (var s = t.results, i = 0; i < s.length; i++) {
                    var r = s[i]
                      , o = null != r.children && !e({
                        results: r.children
                    }, !0);
                    if ((r.text || "").toUpperCase() === (c.term || "").toUpperCase() || o)
                        return !n && (t.data = s,
                        void u(t))
                }
                if (n)
                    return !0;
                var a, l = d.createTag(c);
                null != l && ((a = d.option(l)).attr("data-select2-tag", "true"),
                d.addOptions([a]),
                d.insertTag(s, l)),
                t.results = s,
                u(t)
            }) : e.call(this, c, u)
        }
        ,
        e.prototype.createTag = function(e, t) {
            if (null == t.term)
                return null;
            t = t.term.trim();
            return "" === t ? null : {
                id: t,
                text: t
            }
        }
        ,
        e.prototype.insertTag = function(e, t, n) {
            t.unshift(n)
        }
        ,
        e.prototype._removeOldTags = function(e) {
            this.$element.find("option[data-select2-tag]").each(function() {
                this.selected || t(this).remove()
            })
        }
        ,
        e
    }),
    u.define("select2/data/tokenizer", ["jquery"], function(c) {
        function e(e, t, n) {
            var s = n.get("tokenizer");
            void 0 !== s && (this.tokenizer = s),
            e.call(this, t, n)
        }
        return e.prototype.bind = function(e, t, n) {
            e.call(this, t, n),
            this.$search = t.dropdown.$search || t.selection.$search || n.find(".select2-search__field")
        }
        ,
        e.prototype.query = function(e, t, n) {
            var s = this;
            t.term = t.term || "";
            var i = this.tokenizer(t, this.options, function(e) {
                var t, n = s._normalizeItem(e);
                s.$element.find("option").filter(function() {
                    return c(this).val() === n.id
                }).length || ((t = s.option(n)).attr("data-select2-tag", !0),
                s._removeOldTags(),
                s.addOptions([t])),
                t = n,
                s.trigger("select", {
                    data: t
                })
            });
            i.term !== t.term && (this.$search.length && (this.$search.val(i.term),
            this.$search.trigger("focus")),
            t.term = i.term),
            e.call(this, t, n)
        }
        ,
        e.prototype.tokenizer = function(e, t, n, s) {
            for (var i = n.get("tokenSeparators") || [], r = t.term, o = 0, a = this.createTag || function(e) {
                return {
                    id: e.term,
                    text: e.term
                }
            }
            ; o < r.length; ) {
                var l = r[o];
                -1 !== i.indexOf(l) ? (l = r.substr(0, o),
                null != (l = a(c.extend({}, t, {
                    term: l
                }))) ? (s(l),
                r = r.substr(o + 1) || "",
                o = 0) : o++) : o++
            }
            return {
                term: r
            }
        }
        ,
        e
    }),
    u.define("select2/data/minimumInputLength", [], function() {
        function e(e, t, n) {
            this.minimumInputLength = n.get("minimumInputLength"),
            e.call(this, t, n)
        }
        return e.prototype.query = function(e, t, n) {
            t.term = t.term || "",
            t.term.length < this.minimumInputLength ? this.trigger("results:message", {
                message: "inputTooShort",
                args: {
                    minimum: this.minimumInputLength,
                    input: t.term,
                    params: t
                }
            }) : e.call(this, t, n)
        }
        ,
        e
    }),
    u.define("select2/data/maximumInputLength", [], function() {
        function e(e, t, n) {
            this.maximumInputLength = n.get("maximumInputLength"),
            e.call(this, t, n)
        }
        return e.prototype.query = function(e, t, n) {
            t.term = t.term || "",
            0 < this.maximumInputLength && t.term.length > this.maximumInputLength ? this.trigger("results:message", {
                message: "inputTooLong",
                args: {
                    maximum: this.maximumInputLength,
                    input: t.term,
                    params: t
                }
            }) : e.call(this, t, n)
        }
        ,
        e
    }),
    u.define("select2/data/maximumSelectionLength", [], function() {
        function e(e, t, n) {
            this.maximumSelectionLength = n.get("maximumSelectionLength"),
            e.call(this, t, n)
        }
        return e.prototype.bind = function(e, t, n) {
            var s = this;
            e.call(this, t, n),
            t.on("select", function() {
                s._checkIfMaximumSelected()
            })
        }
        ,
        e.prototype.query = function(e, t, n) {
            var s = this;
            this._checkIfMaximumSelected(function() {
                e.call(s, t, n)
            })
        }
        ,
        e.prototype._checkIfMaximumSelected = function(e, t) {
            var n = this;
            this.current(function(e) {
                e = null != e ? e.length : 0;
                0 < n.maximumSelectionLength && e >= n.maximumSelectionLength ? n.trigger("results:message", {
                    message: "maximumSelected",
                    args: {
                        maximum: n.maximumSelectionLength
                    }
                }) : t && t()
            })
        }
        ,
        e
    }),
    u.define("select2/dropdown", ["jquery", "./utils"], function(t, e) {
        function n(e, t) {
            this.$element = e,
            this.options = t,
            n.__super__.constructor.call(this)
        }
        return e.Extend(n, e.Observable),
        n.prototype.render = function() {
            var e = t('<span class="select2-dropdown"><span class="select2-results"></span></span>');
            return e.attr("dir", this.options.get("dir")),
            this.$dropdown = e
        }
        ,
        n.prototype.bind = function() {}
        ,
        n.prototype.position = function(e, t) {}
        ,
        n.prototype.destroy = function() {
            this.$dropdown.remove()
        }
        ,
        n
    }),
    u.define("select2/dropdown/search", ["jquery"], function(r) {
        function e() {}
        return e.prototype.render = function(e) {
            var t = e.call(this)
              , n = this.options.get("translations").get("search")
              , e = r('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></span>');
            return this.$searchContainer = e,
            this.$search = e.find("input"),
            this.$search.prop("autocomplete", this.options.get("autocomplete")),
            this.$search.attr("aria-label", n()),
            t.prepend(e),
            t
        }
        ,
        e.prototype.bind = function(e, t, n) {
            var s = this
              , i = t.id + "-results";
            e.call(this, t, n),
            this.$search.on("keydown", function(e) {
                s.trigger("keypress", e),
                s._keyUpPrevented = e.isDefaultPrevented()
            }),
            this.$search.on("input", function(e) {
                r(this).off("keyup")
            }),
            this.$search.on("keyup input", function(e) {
                s.handleSearch(e)
            }),
            t.on("open", function() {
                s.$search.attr("tabindex", 0),
                s.$search.attr("aria-controls", i),
                s.$search.trigger("focus"),
                window.setTimeout(function() {
                    s.$search.trigger("focus")
                }, 0)
            }),
            t.on("close", function() {
                s.$search.attr("tabindex", -1),
                s.$search.removeAttr("aria-controls"),
                s.$search.removeAttr("aria-activedescendant"),
                s.$search.val(""),
                s.$search.trigger("blur")
            }),
            t.on("focus", function() {
                t.isOpen() || s.$search.trigger("focus")
            }),
            t.on("results:all", function(e) {
                null != e.query.term && "" !== e.query.term || (s.showSearch(e) ? s.$searchContainer[0].classList.remove("select2-search--hide") : s.$searchContainer[0].classList.add("select2-search--hide"))
            }),
            t.on("results:focus", function(e) {
                e.data._resultId ? s.$search.attr("aria-activedescendant", e.data._resultId) : s.$search.removeAttr("aria-activedescendant")
            })
        }
        ,
        e.prototype.handleSearch = function(e) {
            var t;
            this._keyUpPrevented || (t = this.$search.val(),
            this.trigger("query", {
                term: t
            })),
            this._keyUpPrevented = !1
        }
        ,
        e.prototype.showSearch = function(e, t) {
            return !0
        }
        ,
        e
    }),
    u.define("select2/dropdown/hidePlaceholder", [], function() {
        function e(e, t, n, s) {
            this.placeholder = this.normalizePlaceholder(n.get("placeholder")),
            e.call(this, t, n, s)
        }
        return e.prototype.append = function(e, t) {
            t.results = this.removePlaceholder(t.results),
            e.call(this, t)
        }
        ,
        e.prototype.normalizePlaceholder = function(e, t) {
            return "string" == typeof t && (t = {
                id: "",
                text: t
            }),
            t
        }
        ,
        e.prototype.removePlaceholder = function(e, t) {
            for (var n = t.slice(0), s = t.length - 1; 0 <= s; s--) {
                var i = t[s];
                this.placeholder.id === i.id && n.splice(s, 1)
            }
            return n
        }
        ,
        e
    }),
    u.define("select2/dropdown/infiniteScroll", ["jquery"], function(n) {
        function e(e, t, n, s) {
            this.lastParams = {},
            e.call(this, t, n, s),
            this.$loadingMore = this.createLoadingMore(),
            this.loading = !1
        }
        return e.prototype.append = function(e, t) {
            this.$loadingMore.remove(),
            this.loading = !1,
            e.call(this, t),
            this.showLoadingMore(t) && (this.$results.append(this.$loadingMore),
            this.loadMoreIfNeeded())
        }
        ,
        e.prototype.bind = function(e, t, n) {
            var s = this;
            e.call(this, t, n),
            t.on("query", function(e) {
                s.lastParams = e,
                s.loading = !0
            }),
            t.on("query:append", function(e) {
                s.lastParams = e,
                s.loading = !0
            }),
            this.$results.on("scroll", this.loadMoreIfNeeded.bind(this))
        }
        ,
        e.prototype.loadMoreIfNeeded = function() {
            var e = n.contains(document.documentElement, this.$loadingMore[0]);
            !this.loading && e && (e = this.$results.offset().top + this.$results.outerHeight(!1),
            this.$loadingMore.offset().top + this.$loadingMore.outerHeight(!1) <= e + 50 && this.loadMore())
        }
        ,
        e.prototype.loadMore = function() {
            this.loading = !0;
            var e = n.extend({}, {
                page: 1
            }, this.lastParams);
            e.page++,
            this.trigger("query:append", e)
        }
        ,
        e.prototype.showLoadingMore = function(e, t) {
            return t.pagination && t.pagination.more
        }
        ,
        e.prototype.createLoadingMore = function() {
            var e = n('<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>')
              , t = this.options.get("translations").get("loadingMore");
            return e.html(t(this.lastParams)),
            e
        }
        ,
        e
    }),
    u.define("select2/dropdown/attachBody", ["jquery", "../utils"], function(u, o) {
        function e(e, t, n) {
            this.$dropdownParent = u(n.get("dropdownParent") || document.body),
            e.call(this, t, n)
        }
        return e.prototype.bind = function(e, t, n) {
            var s = this;
            e.call(this, t, n),
            t.on("open", function() {
                s._showDropdown(),
                s._attachPositioningHandler(t),
                s._bindContainerResultHandlers(t)
            }),
            t.on("close", function() {
                s._hideDropdown(),
                s._detachPositioningHandler(t)
            }),
            this.$dropdownContainer.on("mousedown", function(e) {
                e.stopPropagation()
            })
        }
        ,
        e.prototype.destroy = function(e) {
            e.call(this),
            this.$dropdownContainer.remove()
        }
        ,
        e.prototype.position = function(e, t, n) {
            t.attr("class", n.attr("class")),
            t[0].classList.remove("select2"),
            t[0].classList.add("select2-container--open"),
            t.css({
                position: "absolute",
                top: -999999
            }),
            this.$container = n
        }
        ,
        e.prototype.render = function(e) {
            var t = u("<span></span>")
              , e = e.call(this);
            return t.append(e),
            this.$dropdownContainer = t
        }
        ,
        e.prototype._hideDropdown = function(e) {
            this.$dropdownContainer.detach()
        }
        ,
        e.prototype._bindContainerResultHandlers = function(e, t) {
            var n;
            this._containerResultsHandlersBound || (n = this,
            t.on("results:all", function() {
                n._positionDropdown(),
                n._resizeDropdown()
            }),
            t.on("results:append", function() {
                n._positionDropdown(),
                n._resizeDropdown()
            }),
            t.on("results:message", function() {
                n._positionDropdown(),
                n._resizeDropdown()
            }),
            t.on("select", function() {
                n._positionDropdown(),
                n._resizeDropdown()
            }),
            t.on("unselect", function() {
                n._positionDropdown(),
                n._resizeDropdown()
            }),
            this._containerResultsHandlersBound = !0)
        }
        ,
        e.prototype._attachPositioningHandler = function(e, t) {
            var n = this
              , s = "scroll.select2." + t.id
              , i = "resize.select2." + t.id
              , r = "orientationchange.select2." + t.id
              , t = this.$container.parents().filter(o.hasScroll);
            t.each(function() {
                o.StoreData(this, "select2-scroll-position", {
                    x: u(this).scrollLeft(),
                    y: u(this).scrollTop()
                })
            }),
            t.on(s, function(e) {
                var t = o.GetData(this, "select2-scroll-position");
                u(this).scrollTop(t.y)
            }),
            u(window).on(s + " " + i + " " + r, function(e) {
                n._positionDropdown(),
                n._resizeDropdown()
            })
        }
        ,
        e.prototype._detachPositioningHandler = function(e, t) {
            var n = "scroll.select2." + t.id
              , s = "resize.select2." + t.id
              , t = "orientationchange.select2." + t.id;
            this.$container.parents().filter(o.hasScroll).off(n),
            u(window).off(n + " " + s + " " + t)
        }
        ,
        e.prototype._positionDropdown = function() {
            var e = u(window)
              , t = this.$dropdown[0].classList.contains("select2-dropdown--above")
              , n = this.$dropdown[0].classList.contains("select2-dropdown--below")
              , s = null
              , i = this.$container.offset();
            i.bottom = i.top + this.$container.outerHeight(!1);
            var r = {
                height: this.$container.outerHeight(!1)
            };
            r.top = i.top,
            r.bottom = i.top + r.height;
            var o = this.$dropdown.outerHeight(!1)
              , a = e.scrollTop()
              , l = e.scrollTop() + e.height()
              , c = a < i.top - o
              , e = l > i.bottom + o
              , a = {
                left: i.left,
                top: r.bottom
            }
              , l = this.$dropdownParent;
            "static" === l.css("position") && (l = l.offsetParent());
            i = {
                top: 0,
                left: 0
            };
            (u.contains(document.body, l[0]) || l[0].isConnected) && (i = l.offset()),
            a.top -= i.top,
            a.left -= i.left,
            t || n || (s = "below"),
            e || !c || t ? !c && e && t && (s = "below") : s = "above",
            ("above" == s || t && "below" !== s) && (a.top = r.top - i.top - o),
            null != s && (this.$dropdown[0].classList.remove("select2-dropdown--below"),
            this.$dropdown[0].classList.remove("select2-dropdown--above"),
            this.$dropdown[0].classList.add("select2-dropdown--" + s),
            this.$container[0].classList.remove("select2-container--below"),
            this.$container[0].classList.remove("select2-container--above"),
            this.$container[0].classList.add("select2-container--" + s)),
            this.$dropdownContainer.css(a)
        }
        ,
        e.prototype._resizeDropdown = function() {
            var e = {
                width: this.$container.outerWidth(!1) + "px"
            };
            this.options.get("dropdownAutoWidth") && (e.minWidth = e.width,
            e.position = "relative",
            e.width = "auto"),
            this.$dropdown.css(e)
        }
        ,
        e.prototype._showDropdown = function(e) {
            this.$dropdownContainer.appendTo(this.$dropdownParent),
            this._positionDropdown(),
            this._resizeDropdown()
        }
        ,
        e
    }),
    u.define("select2/dropdown/minimumResultsForSearch", [], function() {
        function e(e, t, n, s) {
            this.minimumResultsForSearch = n.get("minimumResultsForSearch"),
            this.minimumResultsForSearch < 0 && (this.minimumResultsForSearch = 1 / 0),
            e.call(this, t, n, s)
        }
        return e.prototype.showSearch = function(e, t) {
            return !(function e(t) {
                for (var n = 0, s = 0; s < t.length; s++) {
                    var i = t[s];
                    i.children ? n += e(i.children) : n++
                }
                return n
            }(t.data.results) < this.minimumResultsForSearch) && e.call(this, t)
        }
        ,
        e
    }),
    u.define("select2/dropdown/selectOnClose", ["../utils"], function(s) {
        function e() {}
        return e.prototype.bind = function(e, t, n) {
            var s = this;
            e.call(this, t, n),
            t.on("close", function(e) {
                s._handleSelectOnClose(e)
            })
        }
        ,
        e.prototype._handleSelectOnClose = function(e, t) {
            if (t && null != t.originalSelect2Event) {
                var n = t.originalSelect2Event;
                if ("select" === n._type || "unselect" === n._type)
                    return
            }
            n = this.getHighlightedResults();
            n.length < 1 || (null != (n = s.GetData(n[0], "data")).element && n.element.selected || null == n.element && n.selected || this.trigger("select", {
                data: n
            }))
        }
        ,
        e
    }),
    u.define("select2/dropdown/closeOnSelect", [], function() {
        function e() {}
        return e.prototype.bind = function(e, t, n) {
            var s = this;
            e.call(this, t, n),
            t.on("select", function(e) {
                s._selectTriggered(e)
            }),
            t.on("unselect", function(e) {
                s._selectTriggered(e)
            })
        }
        ,
        e.prototype._selectTriggered = function(e, t) {
            var n = t.originalEvent;
            n && (n.ctrlKey || n.metaKey) || this.trigger("close", {
                originalEvent: n,
                originalSelect2Event: t
            })
        }
        ,
        e
    }),
    u.define("select2/dropdown/dropdownCss", ["../utils"], function(n) {
        function e() {}
        return e.prototype.render = function(e) {
            var t = e.call(this)
              , e = this.options.get("dropdownCssClass") || "";
            return -1 !== e.indexOf(":all:") && (e = e.replace(":all:", ""),
            n.copyNonInternalCssClasses(t[0], this.$element[0])),
            t.addClass(e),
            t
        }
        ,
        e
    }),
    u.define("select2/dropdown/tagsSearchHighlight", ["../utils"], function(s) {
        function e() {}
        return e.prototype.highlightFirstItem = function(e) {
            var t = this.$results.find(".select2-results__option--selectable:not(.select2-results__option--selected)");
            if (0 < t.length) {
                var n = t.first()
                  , t = s.GetData(n[0], "data").element;
                if (t && t.getAttribute && "true" === t.getAttribute("data-select2-tag"))
                    return void n.trigger("mouseenter")
            }
            e.call(this)
        }
        ,
        e
    }),
    u.define("select2/i18n/en", [], function() {
        return {
            errorLoading: function() {
                return "The results could not be loaded."
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum
                  , e = "Please delete " + t + " character";
                return 1 != t && (e += "s"),
                e
            },
            inputTooShort: function(e) {
                return "Please enter " + (e.minimum - e.input.length) + " or more characters"
            },
            loadingMore: function() {
                return "Loading more results…"
            },
            maximumSelected: function(e) {
                var t = "You can only select " + e.maximum + " item";
                return 1 != e.maximum && (t += "s"),
                t
            },
            noResults: function() {
                return "No results found"
            },
            searching: function() {
                return "Searching…"
            },
            removeAllItems: function() {
                return "Remove all items"
            },
            removeItem: function() {
                return "Remove item"
            },
            search: function() {
                return "Search"
            }
        }
    }),
    u.define("select2/defaults", ["jquery", "./results", "./selection/single", "./selection/multiple", "./selection/placeholder", "./selection/allowClear", "./selection/search", "./selection/selectionCss", "./selection/eventRelay", "./utils", "./translation", "./diacritics", "./data/select", "./data/array", "./data/ajax", "./data/tags", "./data/tokenizer", "./data/minimumInputLength", "./data/maximumInputLength", "./data/maximumSelectionLength", "./dropdown", "./dropdown/search", "./dropdown/hidePlaceholder", "./dropdown/infiniteScroll", "./dropdown/attachBody", "./dropdown/minimumResultsForSearch", "./dropdown/selectOnClose", "./dropdown/closeOnSelect", "./dropdown/dropdownCss", "./dropdown/tagsSearchHighlight", "./i18n/en"], function(l, r, o, a, c, u, d, p, h, f, g, t, m, y, v, _, b, $, w, x, A, D, S, E, O, C, L, T, q, I, e) {
        function n() {
            this.reset()
        }
        return n.prototype.apply = function(e) {
            var t;
            null == (e = l.extend(!0, {}, this.defaults, e)).dataAdapter && (null != e.ajax ? e.dataAdapter = v : null != e.data ? e.dataAdapter = y : e.dataAdapter = m,
            0 < e.minimumInputLength && (e.dataAdapter = f.Decorate(e.dataAdapter, $)),
            0 < e.maximumInputLength && (e.dataAdapter = f.Decorate(e.dataAdapter, w)),
            0 < e.maximumSelectionLength && (e.dataAdapter = f.Decorate(e.dataAdapter, x)),
            e.tags && (e.dataAdapter = f.Decorate(e.dataAdapter, _)),
            null == e.tokenSeparators && null == e.tokenizer || (e.dataAdapter = f.Decorate(e.dataAdapter, b))),
            null == e.resultsAdapter && (e.resultsAdapter = r,
            null != e.ajax && (e.resultsAdapter = f.Decorate(e.resultsAdapter, E)),
            null != e.placeholder && (e.resultsAdapter = f.Decorate(e.resultsAdapter, S)),
            e.selectOnClose && (e.resultsAdapter = f.Decorate(e.resultsAdapter, L)),
            e.tags && (e.resultsAdapter = f.Decorate(e.resultsAdapter, I))),
            null == e.dropdownAdapter && (e.multiple ? e.dropdownAdapter = A : (t = f.Decorate(A, D),
            e.dropdownAdapter = t),
            0 !== e.minimumResultsForSearch && (e.dropdownAdapter = f.Decorate(e.dropdownAdapter, C)),
            e.closeOnSelect && (e.dropdownAdapter = f.Decorate(e.dropdownAdapter, T)),
            null != e.dropdownCssClass && (e.dropdownAdapter = f.Decorate(e.dropdownAdapter, q)),
            e.dropdownAdapter = f.Decorate(e.dropdownAdapter, O)),
            null == e.selectionAdapter && (e.multiple ? e.selectionAdapter = a : e.selectionAdapter = o,
            null != e.placeholder && (e.selectionAdapter = f.Decorate(e.selectionAdapter, c)),
            e.allowClear && (e.selectionAdapter = f.Decorate(e.selectionAdapter, u)),
            e.multiple && (e.selectionAdapter = f.Decorate(e.selectionAdapter, d)),
            null != e.selectionCssClass && (e.selectionAdapter = f.Decorate(e.selectionAdapter, p)),
            e.selectionAdapter = f.Decorate(e.selectionAdapter, h)),
            e.language = this._resolveLanguage(e.language),
            e.language.push("en");
            for (var n = [], s = 0; s < e.language.length; s++) {
                var i = e.language[s];
                -1 === n.indexOf(i) && n.push(i)
            }
            return e.language = n,
            e.translations = this._processTranslations(e.language, e.debug),
            e
        }
        ,
        n.prototype.reset = function() {
            function a(e) {
                return e.replace(/[^\u0000-\u007E]/g, function(e) {
                    return t[e] || e
                })
            }
            this.defaults = {
                amdLanguageBase: "./i18n/",
                autocomplete: "off",
                closeOnSelect: !0,
                debug: !1,
                dropdownAutoWidth: !1,
                escapeMarkup: f.escapeMarkup,
                language: {},
                matcher: function e(t, n) {
                    if (null == t.term || "" === t.term.trim())
                        return n;
                    if (n.children && 0 < n.children.length) {
                        for (var s = l.extend(!0, {}, n), i = n.children.length - 1; 0 <= i; i--)
                            null == e(t, n.children[i]) && s.children.splice(i, 1);
                        return 0 < s.children.length ? s : e(t, s)
                    }
                    var r = a(n.text).toUpperCase()
                      , o = a(t.term).toUpperCase();
                    return -1 < r.indexOf(o) ? n : null
                },
                minimumInputLength: 0,
                maximumInputLength: 0,
                maximumSelectionLength: 0,
                minimumResultsForSearch: 0,
                selectOnClose: !1,
                scrollAfterSelect: !1,
                sorter: function(e) {
                    return e
                },
                templateResult: function(e) {
                    return e.text
                },
                templateSelection: function(e) {
                    return e.text
                },
                theme: "default",
                width: "resolve"
            }
        }
        ,
        n.prototype.applyFromElement = function(e, t) {
            var n = e.language
              , s = this.defaults.language
              , i = t.prop("lang")
              , t = t.closest("[lang]").prop("lang")
              , t = Array.prototype.concat.call(this._resolveLanguage(i), this._resolveLanguage(n), this._resolveLanguage(s), this._resolveLanguage(t));
            return e.language = t,
            e
        }
        ,
        n.prototype._resolveLanguage = function(e) {
            if (!e)
                return [];
            if (l.isEmptyObject(e))
                return [];
            if (l.isPlainObject(e))
                return [e];
            for (var t, n = Array.isArray(e) ? e : [e], s = [], i = 0; i < n.length; i++)
                s.push(n[i]),
                "string" == typeof n[i] && 0 < n[i].indexOf("-") && (t = n[i].split("-")[0],
                s.push(t));
            return s
        }
        ,
        n.prototype._processTranslations = function(e, t) {
            for (var n = new g, s = 0; s < e.length; s++) {
                var i = new g
                  , r = e[s];
                if ("string" == typeof r)
                    try {
                        i = g.loadPath(r)
                    } catch (e) {
                        try {
                            r = this.defaults.amdLanguageBase + r,
                            i = g.loadPath(r)
                        } catch (e) {
                            t && window.console && console.warn && console.warn('Select2: The language file for "' + r + '" could not be automatically loaded. A fallback will be used instead.')
                        }
                    }
                else
                    i = l.isPlainObject(r) ? new g(r) : r;
                n.extend(i)
            }
            return n
        }
        ,
        n.prototype.set = function(e, t) {
            var n = {};
            n[l.camelCase(e)] = t;
            n = f._convertData(n);
            l.extend(!0, this.defaults, n)
        }
        ,
        new n
    }),
    u.define("select2/options", ["jquery", "./defaults", "./utils"], function(c, n, u) {
        function e(e, t) {
            this.options = e,
            null != t && this.fromElement(t),
            null != t && (this.options = n.applyFromElement(this.options, t)),
            this.options = n.apply(this.options)
        }
        return e.prototype.fromElement = function(e) {
            var t = ["select2"];
            null == this.options.multiple && (this.options.multiple = e.prop("multiple")),
            null == this.options.disabled && (this.options.disabled = e.prop("disabled")),
            null == this.options.autocomplete && e.prop("autocomplete") && (this.options.autocomplete = e.prop("autocomplete")),
            null == this.options.dir && (e.prop("dir") ? this.options.dir = e.prop("dir") : e.closest("[dir]").prop("dir") ? this.options.dir = e.closest("[dir]").prop("dir") : this.options.dir = "ltr"),
            e.prop("disabled", this.options.disabled),
            e.prop("multiple", this.options.multiple),
            u.GetData(e[0], "select2Tags") && (this.options.debug && window.console && console.warn && console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),
            u.StoreData(e[0], "data", u.GetData(e[0], "select2Tags")),
            u.StoreData(e[0], "tags", !0)),
            u.GetData(e[0], "ajaxUrl") && (this.options.debug && window.console && console.warn && console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),
            e.attr("ajax--url", u.GetData(e[0], "ajaxUrl")),
            u.StoreData(e[0], "ajax-Url", u.GetData(e[0], "ajaxUrl")));
            var n = {};
            function s(e, t) {
                return t.toUpperCase()
            }
            for (var i = 0; i < e[0].attributes.length; i++) {
                var r = e[0].attributes[i].name
                  , o = "data-";
                r.substr(0, o.length) == o && (r = r.substring(o.length),
                o = u.GetData(e[0], r),
                n[r.replace(/-([a-z])/g, s)] = o)
            }
            c.fn.jquery && "1." == c.fn.jquery.substr(0, 2) && e[0].dataset && (n = c.extend(!0, {}, e[0].dataset, n));
            var a, l = c.extend(!0, {}, u.GetData(e[0]), n);
            for (a in l = u._convertData(l))
                -1 < t.indexOf(a) || (c.isPlainObject(this.options[a]) ? c.extend(this.options[a], l[a]) : this.options[a] = l[a]);
            return this
        }
        ,
        e.prototype.get = function(e) {
            return this.options[e]
        }
        ,
        e.prototype.set = function(e, t) {
            this.options[e] = t
        }
        ,
        e
    }),
    u.define("select2/core", ["jquery", "./options", "./utils", "./keys"], function(t, i, r, s) {
        var o = function(e, t) {
            null != r.GetData(e[0], "select2") && r.GetData(e[0], "select2").destroy(),
            this.$element = e,
            this.id = this._generateId(e),
            t = t || {},
            this.options = new i(t,e),
            o.__super__.constructor.call(this);
            var n = e.attr("tabindex") || 0;
            r.StoreData(e[0], "old-tabindex", n),
            e.attr("tabindex", "-1");
            t = this.options.get("dataAdapter");
            this.dataAdapter = new t(e,this.options);
            n = this.render();
            this._placeContainer(n);
            t = this.options.get("selectionAdapter");
            this.selection = new t(e,this.options),
            this.$selection = this.selection.render(),
            this.selection.position(this.$selection, n);
            t = this.options.get("dropdownAdapter");
            this.dropdown = new t(e,this.options),
            this.$dropdown = this.dropdown.render(),
            this.dropdown.position(this.$dropdown, n);
            n = this.options.get("resultsAdapter");
            this.results = new n(e,this.options,this.dataAdapter),
            this.$results = this.results.render(),
            this.results.position(this.$results, this.$dropdown);
            var s = this;
            this._bindAdapters(),
            this._registerDomEvents(),
            this._registerDataEvents(),
            this._registerSelectionEvents(),
            this._registerDropdownEvents(),
            this._registerResultsEvents(),
            this._registerEvents(),
            this.dataAdapter.current(function(e) {
                s.trigger("selection:update", {
                    data: e
                })
            }),
            e[0].classList.add("select2-hidden-accessible"),
            e.attr("aria-hidden", "true"),
            this._syncAttributes(),
            r.StoreData(e[0], "select2", this),
            e.data("select2", this)
        };
        return r.Extend(o, r.Observable),
        o.prototype._generateId = function(e) {
            return "select2-" + (null != e.attr("id") ? e.attr("id") : null != e.attr("name") ? e.attr("name") + "-" + r.generateChars(2) : r.generateChars(4)).replace(/(:|\.|\[|\]|,)/g, "")
        }
        ,
        o.prototype._placeContainer = function(e) {
            e.insertAfter(this.$element);
            var t = this._resolveWidth(this.$element, this.options.get("width"));
            null != t && e.css("width", t)
        }
        ,
        o.prototype._resolveWidth = function(e, t) {
            var n = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
            if ("resolve" == t) {
                var s = this._resolveWidth(e, "style");
                return null != s ? s : this._resolveWidth(e, "element")
            }
            if ("element" == t) {
                s = e.outerWidth(!1);
                return s <= 0 ? "auto" : s + "px"
            }
            if ("style" != t)
                return "computedstyle" != t ? t : window.getComputedStyle(e[0]).width;
            e = e.attr("style");
            if ("string" != typeof e)
                return null;
            for (var i = e.split(";"), r = 0, o = i.length; r < o; r += 1) {
                var a = i[r].replace(/\s/g, "").match(n);
                if (null !== a && 1 <= a.length)
                    return a[1]
            }
            return null
        }
        ,
        o.prototype._bindAdapters = function() {
            this.dataAdapter.bind(this, this.$container),
            this.selection.bind(this, this.$container),
            this.dropdown.bind(this, this.$container),
            this.results.bind(this, this.$container)
        }
        ,
        o.prototype._registerDomEvents = function() {
            var t = this;
            this.$element.on("change.select2", function() {
                t.dataAdapter.current(function(e) {
                    t.trigger("selection:update", {
                        data: e
                    })
                })
            }),
            this.$element.on("focus.select2", function(e) {
                t.trigger("focus", e)
            }),
            this._syncA = r.bind(this._syncAttributes, this),
            this._syncS = r.bind(this._syncSubtree, this),
            this._observer = new window.MutationObserver(function(e) {
                t._syncA(),
                t._syncS(e)
            }
            ),
            this._observer.observe(this.$element[0], {
                attributes: !0,
                childList: !0,
                subtree: !1
            })
        }
        ,
        o.prototype._registerDataEvents = function() {
            var n = this;
            this.dataAdapter.on("*", function(e, t) {
                n.trigger(e, t)
            })
        }
        ,
        o.prototype._registerSelectionEvents = function() {
            var n = this
              , s = ["toggle", "focus"];
            this.selection.on("toggle", function() {
                n.toggleDropdown()
            }),
            this.selection.on("focus", function(e) {
                n.focus(e)
            }),
            this.selection.on("*", function(e, t) {
                -1 === s.indexOf(e) && n.trigger(e, t)
            })
        }
        ,
        o.prototype._registerDropdownEvents = function() {
            var n = this;
            this.dropdown.on("*", function(e, t) {
                n.trigger(e, t)
            })
        }
        ,
        o.prototype._registerResultsEvents = function() {
            var n = this;
            this.results.on("*", function(e, t) {
                n.trigger(e, t)
            })
        }
        ,
        o.prototype._registerEvents = function() {
            var n = this;
            this.on("open", function() {
                n.$container[0].classList.add("select2-container--open")
            }),
            this.on("close", function() {
                n.$container[0].classList.remove("select2-container--open")
            }),
            this.on("enable", function() {
                n.$container[0].classList.remove("select2-container--disabled")
            }),
            this.on("disable", function() {
                n.$container[0].classList.add("select2-container--disabled")
            }),
            this.on("blur", function() {
                n.$container[0].classList.remove("select2-container--focus")
            }),
            this.on("query", function(t) {
                n.isOpen() || n.trigger("open", {}),
                this.dataAdapter.query(t, function(e) {
                    n.trigger("results:all", {
                        data: e,
                        query: t
                    })
                })
            }),
            this.on("query:append", function(t) {
                this.dataAdapter.query(t, function(e) {
                    n.trigger("results:append", {
                        data: e,
                        query: t
                    })
                })
            }),
            this.on("keypress", function(e) {
                var t = e.which;
                n.isOpen() ? t === s.ESC || t === s.UP && e.altKey ? (n.close(e),
                e.preventDefault()) : t === s.ENTER || t === s.TAB ? (n.trigger("results:select", {}),
                e.preventDefault()) : t === s.SPACE && e.ctrlKey ? (n.trigger("results:toggle", {}),
                e.preventDefault()) : t === s.UP ? (n.trigger("results:previous", {}),
                e.preventDefault()) : t === s.DOWN && (n.trigger("results:next", {}),
                e.preventDefault()) : (t === s.ENTER || t === s.SPACE || t === s.DOWN && e.altKey) && (n.open(),
                e.preventDefault())
            })
        }
        ,
        o.prototype._syncAttributes = function() {
            this.options.set("disabled", this.$element.prop("disabled")),
            this.isDisabled() ? (this.isOpen() && this.close(),
            this.trigger("disable", {})) : this.trigger("enable", {})
        }
        ,
        o.prototype._isChangeMutation = function(e) {
            var t = this;
            if (e.addedNodes && 0 < e.addedNodes.length) {
                for (var n = 0; n < e.addedNodes.length; n++)
                    if (e.addedNodes[n].selected)
                        return !0
            } else {
                if (e.removedNodes && 0 < e.removedNodes.length)
                    return !0;
                if (Array.isArray(e))
                    return e.some(function(e) {
                        return t._isChangeMutation(e)
                    })
            }
            return !1
        }
        ,
        o.prototype._syncSubtree = function(e) {
            var e = this._isChangeMutation(e)
              , t = this;
            e && this.dataAdapter.current(function(e) {
                t.trigger("selection:update", {
                    data: e
                })
            })
        }
        ,
        o.prototype.trigger = function(e, t) {
            var n = o.__super__.trigger
              , s = {
                open: "opening",
                close: "closing",
                select: "selecting",
                unselect: "unselecting",
                clear: "clearing"
            };
            if (void 0 === t && (t = {}),
            e in s) {
                var i = s[e]
                  , s = {
                    prevented: !1,
                    name: e,
                    args: t
                };
                if (n.call(this, i, s),
                s.prevented)
                    return void (t.prevented = !0)
            }
            n.call(this, e, t)
        }
        ,
        o.prototype.toggleDropdown = function() {
            this.isDisabled() || (this.isOpen() ? this.close() : this.open())
        }
        ,
        o.prototype.open = function() {
            this.isOpen() || this.isDisabled() || this.trigger("query", {})
        }
        ,
        o.prototype.close = function(e) {
            this.isOpen() && this.trigger("close", {
                originalEvent: e
            })
        }
        ,
        o.prototype.isEnabled = function() {
            return !this.isDisabled()
        }
        ,
        o.prototype.isDisabled = function() {
            return this.options.get("disabled")
        }
        ,
        o.prototype.isOpen = function() {
            return this.$container[0].classList.contains("select2-container--open")
        }
        ,
        o.prototype.hasFocus = function() {
            return this.$container[0].classList.contains("select2-container--focus")
        }
        ,
        o.prototype.focus = function(e) {
            this.hasFocus() || (this.$container[0].classList.add("select2-container--focus"),
            this.trigger("focus", {}))
        }
        ,
        o.prototype.enable = function(e) {
            this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),
            null != e && 0 !== e.length || (e = [!0]);
            e = !e[0];
            this.$element.prop("disabled", e)
        }
        ,
        o.prototype.data = function() {
            this.options.get("debug") && 0 < arguments.length && window.console && console.warn && console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');
            var t = [];
            return this.dataAdapter.current(function(e) {
                t = e
            }),
            t
        }
        ,
        o.prototype.val = function(e) {
            if (this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),
            null == e || 0 === e.length)
                return this.$element.val();
            e = e[0];
            Array.isArray(e) && (e = e.map(function(e) {
                return e.toString()
            })),
            this.$element.val(e).trigger("input").trigger("change")
        }
        ,
        o.prototype.destroy = function() {
            r.RemoveData(this.$container[0]),
            this.$container.remove(),
            this._observer.disconnect(),
            this._observer = null,
            this._syncA = null,
            this._syncS = null,
            this.$element.off(".select2"),
            this.$element.attr("tabindex", r.GetData(this.$element[0], "old-tabindex")),
            this.$element[0].classList.remove("select2-hidden-accessible"),
            this.$element.attr("aria-hidden", "false"),
            r.RemoveData(this.$element[0]),
            this.$element.removeData("select2"),
            this.dataAdapter.destroy(),
            this.selection.destroy(),
            this.dropdown.destroy(),
            this.results.destroy(),
            this.dataAdapter = null,
            this.selection = null,
            this.dropdown = null,
            this.results = null
        }
        ,
        o.prototype.render = function() {
            var e = t('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');
            return e.attr("dir", this.options.get("dir")),
            this.$container = e,
            this.$container[0].classList.add("select2-container--" + this.options.get("theme")),
            r.StoreData(e[0], "element", this.$element),
            e
        }
        ,
        o
    }),
    u.define("jquery-mousewheel", ["jquery"], function(e) {
        return e
    }),
    u.define("jquery.select2", ["jquery", "jquery-mousewheel", "./select2/core", "./select2/defaults", "./select2/utils"], function(i, e, r, t, o) {
        var a;
        return null == i.fn.select2 && (a = ["open", "close", "destroy"],
        i.fn.select2 = function(t) {
            if ("object" == typeof (t = t || {}))
                return this.each(function() {
                    var e = i.extend(!0, {}, t);
                    new r(i(this),e)
                }),
                this;
            if ("string" != typeof t)
                throw new Error("Invalid arguments for Select2: " + t);
            var n, s = Array.prototype.slice.call(arguments, 1);
            return this.each(function() {
                var e = o.GetData(this, "select2");
                null == e && window.console && console.error && console.error("The select2('" + t + "') method was called on an element that is not using Select2."),
                n = e[t].apply(e, s)
            }),
            -1 < a.indexOf(t) ? this : n
        }
        ),
        null == i.fn.select2.defaults && (i.fn.select2.defaults = t),
        r
    }),
    {
        define: u.define,
        require: u.require
    });
    function b(e, t) {
        return i.call(e, t)
    }
    function l(e, t) {
        var n, s, i, r, o, a, l, c, u, d, p = t && t.split("/"), h = y.map, f = h && h["*"] || {};
        if (e) {
            for (t = (e = e.split("/")).length - 1,
            y.nodeIdCompat && _.test(e[t]) && (e[t] = e[t].replace(_, "")),
            "." === e[0].charAt(0) && p && (e = p.slice(0, p.length - 1).concat(e)),
            c = 0; c < e.length; c++)
                "." === (d = e[c]) ? (e.splice(c, 1),
                --c) : ".." === d && (0 === c || 1 === c && ".." === e[2] || ".." === e[c - 1] || 0 < c && (e.splice(c - 1, 2),
                c -= 2));
            e = e.join("/")
        }
        if ((p || f) && h) {
            for (c = (n = e.split("/")).length; 0 < c; --c) {
                if (s = n.slice(0, c).join("/"),
                p)
                    for (u = p.length; 0 < u; --u)
                        if (i = h[p.slice(0, u).join("/")],
                        i = i && i[s]) {
                            r = i,
                            o = c;
                            break
                        }
                if (r)
                    break;
                !a && f && f[s] && (a = f[s],
                l = c)
            }
            !r && a && (r = a,
            o = l),
            r && (n.splice(0, o, r),
            e = n.join("/"))
        }
        return e
    }
    function w(t, n) {
        return function() {
            var e = a.call(arguments, 0);
            return "string" != typeof e[0] && 1 === e.length && e.push(null),
            o.apply(p, e.concat([t, n]))
        }
    }
    function x(e) {
        var t;
        if (b(m, e) && (t = m[e],
        delete m[e],
        v[e] = !0,
        r.apply(p, t)),
        !b(g, e) && !b(v, e))
            throw new Error("No " + e);
        return g[e]
    }
    function c(e) {
        var t, n = e ? e.indexOf("!") : -1;
        return -1 < n && (t = e.substring(0, n),
        e = e.substring(n + 1, e.length)),
        [t, e]
    }
    function A(e) {
        return e ? c(e) : []
    }
    var u = s.require("jquery.select2");
    return t.fn.select2.amd = s,
    u
});
!function(i) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery)
}(function(i) {
    "use strict";
    var e = window.Slick || {};
    (e = function() {
        var e = 0;
        return function(t, o) {
            var s, n = this;
            n.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: i(t),
                appendDots: i(t),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(e, t) {
                    return i('<button type="button" />').text(t + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                focusOnChange: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            },
            n.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: !1,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                swiping: !1,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            },
            i.extend(n, n.initials),
            n.activeBreakpoint = null,
            n.animType = null,
            n.animProp = null,
            n.breakpoints = [],
            n.breakpointSettings = [],
            n.cssTransitions = !1,
            n.focussed = !1,
            n.interrupted = !1,
            n.hidden = "hidden",
            n.paused = !0,
            n.positionProp = null,
            n.respondTo = null,
            n.rowCount = 1,
            n.shouldClick = !0,
            n.$slider = i(t),
            n.$slidesCache = null,
            n.transformType = null,
            n.transitionType = null,
            n.visibilityChange = "visibilitychange",
            n.windowWidth = 0,
            n.windowTimer = null,
            s = i(t).data("slick") || {},
            n.options = i.extend({}, n.defaults, o, s),
            n.currentSlide = n.options.initialSlide,
            n.originalSettings = n.options,
            void 0 !== document.mozHidden ? (n.hidden = "mozHidden",
            n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden",
            n.visibilityChange = "webkitvisibilitychange"),
            n.autoPlay = i.proxy(n.autoPlay, n),
            n.autoPlayClear = i.proxy(n.autoPlayClear, n),
            n.autoPlayIterator = i.proxy(n.autoPlayIterator, n),
            n.changeSlide = i.proxy(n.changeSlide, n),
            n.clickHandler = i.proxy(n.clickHandler, n),
            n.selectHandler = i.proxy(n.selectHandler, n),
            n.setPosition = i.proxy(n.setPosition, n),
            n.swipeHandler = i.proxy(n.swipeHandler, n),
            n.dragHandler = i.proxy(n.dragHandler, n),
            n.keyHandler = i.proxy(n.keyHandler, n),
            n.instanceUid = e++,
            n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/,
            n.registerBreakpoints(),
            n.init(!0)
        }
    }()).prototype.activateADA = function() {
        this.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        })
    }
    ,
    e.prototype.addSlide = e.prototype.slickAdd = function(e, t, o) {
        var s = this;
        if ("boolean" == typeof t)
            o = t,
            t = null;
        else if (t < 0 || t >= s.slideCount)
            return !1;
        s.unload(),
        "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : !0 === o ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack),
        s.$slides = s.$slideTrack.children(this.options.slide),
        s.$slideTrack.children(this.options.slide).detach(),
        s.$slideTrack.append(s.$slides),
        s.$slides.each(function(e, t) {
            i(t).attr("data-slick-index", e)
        }),
        s.$slidesCache = s.$slides,
        s.reinit()
    }
    ,
    e.prototype.animateHeight = function() {
        var i = this;
        if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.animate({
                height: e
            }, i.options.speed)
        }
    }
    ,
    e.prototype.animateSlide = function(e, t) {
        var o = {}
          , s = this;
        s.animateHeight(),
        !0 === s.options.rtl && !1 === s.options.vertical && (e = -e),
        !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({
            left: e
        }, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({
            top: e
        }, s.options.speed, s.options.easing, t) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft),
        i({
            animStart: s.currentLeft
        }).animate({
            animStart: e
        }, {
            duration: s.options.speed,
            easing: s.options.easing,
            step: function(i) {
                i = Math.ceil(i),
                !1 === s.options.vertical ? (o[s.animType] = "translate(" + i + "px, 0px)",
                s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)",
                s.$slideTrack.css(o))
            },
            complete: function() {
                t && t.call()
            }
        })) : (s.applyTransition(),
        e = Math.ceil(e),
        !1 === s.options.vertical ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)",
        s.$slideTrack.css(o),
        t && setTimeout(function() {
            s.disableTransition(),
            t.call()
        }, s.options.speed))
    }
    ,
    e.prototype.getNavTarget = function() {
        var e = this
          , t = e.options.asNavFor;
        return t && null !== t && (t = i(t).not(e.$slider)),
        t
    }
    ,
    e.prototype.asNavFor = function(e) {
        var t = this.getNavTarget();
        null !== t && "object" == typeof t && t.each(function() {
            var t = i(this).slick("getSlick");
            t.unslicked || t.slideHandler(e, !0)
        })
    }
    ,
    e.prototype.applyTransition = function(i) {
        var e = this
          , t = {};
        !1 === e.options.fade ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase,
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    }
    ,
    e.prototype.autoPlay = function() {
        var i = this;
        i.autoPlayClear(),
        i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed))
    }
    ,
    e.prototype.autoPlayClear = function() {
        var i = this;
        i.autoPlayTimer && clearInterval(i.autoPlayTimer)
    }
    ,
    e.prototype.autoPlayIterator = function() {
        var i = this
          , e = i.currentSlide + i.options.slidesToScroll;
        i.paused || i.interrupted || i.focussed || (!1 === i.options.infinite && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll,
        i.currentSlide - 1 == 0 && (i.direction = 1))),
        i.slideHandler(e))
    }
    ,
    e.prototype.buildArrows = function() {
        var e = this;
        !0 === e.options.arrows && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"),
        e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"),
        e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows),
        e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows),
        !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }
    ,
    e.prototype.buildDots = function() {
        var e, t, o = this;
        if (!0 === o.options.dots) {
            for (o.$slider.addClass("slick-dotted"),
            t = i("<ul />").addClass(o.options.dotsClass),
            e = 0; e <= o.getDotCount(); e += 1)
                t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
            o.$dots = t.appendTo(o.options.appendDots),
            o.$dots.find("li").first().addClass("slick-active")
        }
    }
    ,
    e.prototype.buildOut = function() {
        var e = this;
        e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"),
        e.slideCount = e.$slides.length,
        e.$slides.each(function(e, t) {
            i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "")
        }),
        e.$slider.addClass("slick-slider"),
        e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(),
        e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(),
        e.$slideTrack.css("opacity", 0),
        !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1),
        i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
        e.setupInfinite(),
        e.buildArrows(),
        e.buildDots(),
        e.updateDots(),
        e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0),
        !0 === e.options.draggable && e.$list.addClass("draggable")
    }
    ,
    e.prototype.buildRows = function() {
        var i, e, t, o, s, n, r, l = this;
        if (o = document.createDocumentFragment(),
        n = l.$slider.children(),
        l.options.rows > 1) {
            for (r = l.options.slidesPerRow * l.options.rows,
            s = Math.ceil(n.length / r),
            i = 0; i < s; i++) {
                var d = document.createElement("div");
                for (e = 0; e < l.options.rows; e++) {
                    var a = document.createElement("div");
                    for (t = 0; t < l.options.slidesPerRow; t++) {
                        var c = i * r + (e * l.options.slidesPerRow + t);
                        n.get(c) && a.appendChild(n.get(c))
                    }
                    d.appendChild(a)
                }
                o.appendChild(d)
            }
            l.$slider.empty().append(o),
            l.$slider.children().children().children().css({
                width: 100 / l.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }
    ,
    e.prototype.checkResponsive = function(e, t) {
        var o, s, n, r = this, l = !1, d = r.$slider.width(), a = window.innerWidth || i(window).width();
        if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)),
        r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
            s = null;
            for (o in r.breakpoints)
                r.breakpoints.hasOwnProperty(o) && (!1 === r.originalSettings.mobileFirst ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
            null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s,
            "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]),
            !0 === e && (r.currentSlide = r.options.initialSlide),
            r.refresh(e)),
            l = s) : (r.activeBreakpoint = s,
            "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]),
            !0 === e && (r.currentSlide = r.options.initialSlide),
            r.refresh(e)),
            l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null,
            r.options = r.originalSettings,
            !0 === e && (r.currentSlide = r.options.initialSlide),
            r.refresh(e),
            l = s),
            e || !1 === l || r.$slider.trigger("breakpoint", [r, l])
        }
    }
    ,
    e.prototype.changeSlide = function(e, t) {
        var o, s, n, r = this, l = i(e.currentTarget);
        switch (l.is("a") && e.preventDefault(),
        l.is("li") || (l = l.closest("li")),
        n = r.slideCount % r.options.slidesToScroll != 0,
        o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll,
        e.data.message) {
        case "previous":
            s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o,
            r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
            break;
        case "next":
            s = 0 === o ? r.options.slidesToScroll : o,
            r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
            break;
        case "index":
            var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
            r.slideHandler(r.checkNavigable(d), !1, t),
            l.children().trigger("focus");
            break;
        default:
            return
        }
    }
    ,
    e.prototype.checkNavigable = function(i) {
        var e, t;
        if (e = this.getNavigableIndexes(),
        t = 0,
        i > e[e.length - 1])
            i = e[e.length - 1];
        else
            for (var o in e) {
                if (i < e[o]) {
                    i = t;
                    break
                }
                t = e[o]
            }
        return i
    }
    ,
    e.prototype.cleanUpEvents = function() {
        var e = this;
        e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)),
        !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)),
        e.$slider.off("focus.slick blur.slick"),
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide),
        e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide),
        !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler),
        e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))),
        e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
        e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
        e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
        e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
        e.$list.off("click.slick", e.clickHandler),
        i(document).off(e.visibilityChange, e.visibility),
        e.cleanUpSlideEvents(),
        !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect && i(e.$slideTrack).children().off("click.slick", e.selectHandler),
        i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange),
        i(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
        i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault),
        i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition)
    }
    ,
    e.prototype.cleanUpSlideEvents = function() {
        var e = this;
        e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    }
    ,
    e.prototype.cleanUpRows = function() {
        var i, e = this;
        e.options.rows > 1 && ((i = e.$slides.children().children()).removeAttr("style"),
        e.$slider.empty().append(i))
    }
    ,
    e.prototype.clickHandler = function(i) {
        !1 === this.shouldClick && (i.stopImmediatePropagation(),
        i.stopPropagation(),
        i.preventDefault())
    }
    ,
    e.prototype.destroy = function(e) {
        var t = this;
        t.autoPlayClear(),
        t.touchObject = {},
        t.cleanUpEvents(),
        i(".slick-cloned", t.$slider).detach(),
        t.$dots && t.$dots.remove(),
        t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
        t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
        t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            i(this).attr("style", i(this).data("originalStyling"))
        }),
        t.$slideTrack.children(this.options.slide).detach(),
        t.$slideTrack.detach(),
        t.$list.detach(),
        t.$slider.append(t.$slides)),
        t.cleanUpRows(),
        t.$slider.removeClass("slick-slider"),
        t.$slider.removeClass("slick-initialized"),
        t.$slider.removeClass("slick-dotted"),
        t.unslicked = !0,
        e || t.$slider.trigger("destroy", [t])
    }
    ,
    e.prototype.disableTransition = function(i) {
        var e = this
          , t = {};
        t[e.transitionType] = "",
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    }
    ,
    e.prototype.fadeSlide = function(i, e) {
        var t = this;
        !1 === t.cssTransitions ? (t.$slides.eq(i).css({
            zIndex: t.options.zIndex
        }),
        t.$slides.eq(i).animate({
            opacity: 1
        }, t.options.speed, t.options.easing, e)) : (t.applyTransition(i),
        t.$slides.eq(i).css({
            opacity: 1,
            zIndex: t.options.zIndex
        }),
        e && setTimeout(function() {
            t.disableTransition(i),
            e.call()
        }, t.options.speed))
    }
    ,
    e.prototype.fadeSlideOut = function(i) {
        var e = this;
        !1 === e.cssTransitions ? e.$slides.eq(i).animate({
            opacity: 0,
            zIndex: e.options.zIndex - 2
        }, e.options.speed, e.options.easing) : (e.applyTransition(i),
        e.$slides.eq(i).css({
            opacity: 0,
            zIndex: e.options.zIndex - 2
        }))
    }
    ,
    e.prototype.filterSlides = e.prototype.slickFilter = function(i) {
        var e = this;
        null !== i && (e.$slidesCache = e.$slides,
        e.unload(),
        e.$slideTrack.children(this.options.slide).detach(),
        e.$slidesCache.filter(i).appendTo(e.$slideTrack),
        e.reinit())
    }
    ,
    e.prototype.focusHandler = function() {
        var e = this;
        e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function(t) {
            t.stopImmediatePropagation();
            var o = i(this);
            setTimeout(function() {
                e.options.pauseOnFocus && (e.focussed = o.is(":focus"),
                e.autoPlay())
            }, 0)
        })
    }
    ,
    e.prototype.getCurrent = e.prototype.slickCurrentSlide = function() {
        return this.currentSlide
    }
    ,
    e.prototype.getDotCount = function() {
        var i = this
          , e = 0
          , t = 0
          , o = 0;
        if (!0 === i.options.infinite)
            if (i.slideCount <= i.options.slidesToShow)
                ++o;
            else
                for (; e < i.slideCount; )
                    ++o,
                    e = t + i.options.slidesToScroll,
                    t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        else if (!0 === i.options.centerMode)
            o = i.slideCount;
        else if (i.options.asNavFor)
            for (; e < i.slideCount; )
                ++o,
                e = t + i.options.slidesToScroll,
                t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        else
            o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
        return o - 1
    }
    ,
    e.prototype.getLeft = function(i) {
        var e, t, o, s, n = this, r = 0;
        return n.slideOffset = 0,
        t = n.$slides.first().outerHeight(!0),
        !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1,
        s = -1,
        !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)),
        r = t * n.options.slidesToShow * s),
        n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1,
        r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1,
        r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth,
        r = (i + n.options.slidesToShow - n.slideCount) * t),
        n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0,
        r = 0),
        !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0,
        n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)),
        e = !1 === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r,
        !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow),
        e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0,
        !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1),
        e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0,
        e += (n.$list.width() - o.outerWidth()) / 2)),
        e
    }
    ,
    e.prototype.getOption = e.prototype.slickGetOption = function(i) {
        return this.options[i]
    }
    ,
    e.prototype.getNavigableIndexes = function() {
        var i, e = this, t = 0, o = 0, s = [];
        for (!1 === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll,
        o = -1 * e.options.slidesToScroll,
        i = 2 * e.slideCount); t < i; )
            s.push(t),
            t = o + e.options.slidesToScroll,
            o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        return s
    }
    ,
    e.prototype.getSlick = function() {
        return this
    }
    ,
    e.prototype.getSlideCount = function() {
        var e, t, o = this;
        return t = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0,
        !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each(function(s, n) {
            if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft)
                return e = n,
                !1
        }),
        Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll
    }
    ,
    e.prototype.goTo = e.prototype.slickGoTo = function(i, e) {
        this.changeSlide({
            data: {
                message: "index",
                index: parseInt(i)
            }
        }, e)
    }
    ,
    e.prototype.init = function(e) {
        var t = this;
        i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"),
        t.buildRows(),
        t.buildOut(),
        t.setProps(),
        t.startLoad(),
        t.loadSlider(),
        t.initializeEvents(),
        t.updateArrows(),
        t.updateDots(),
        t.checkResponsive(!0),
        t.focusHandler()),
        e && t.$slider.trigger("init", [t]),
        !0 === t.options.accessibility && t.initADA(),
        t.options.autoplay && (t.paused = !1,
        t.autoPlay())
    }
    ,
    e.prototype.initADA = function() {
        var e = this
          , t = Math.ceil(e.slideCount / e.options.slidesToShow)
          , o = e.getNavigableIndexes().filter(function(i) {
            return i >= 0 && i < e.slideCount
        });
        e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }),
        null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t) {
            var s = o.indexOf(t);
            i(this).attr({
                role: "tabpanel",
                id: "slick-slide" + e.instanceUid + t,
                tabindex: -1
            }),
            -1 !== s && i(this).attr({
                "aria-describedby": "slick-slide-control" + e.instanceUid + s
            })
        }),
        e.$dots.attr("role", "tablist").find("li").each(function(s) {
            var n = o[s];
            i(this).attr({
                role: "presentation"
            }),
            i(this).find("button").first().attr({
                role: "tab",
                id: "slick-slide-control" + e.instanceUid + s,
                "aria-controls": "slick-slide" + e.instanceUid + n,
                "aria-label": s + 1 + " of " + t,
                "aria-selected": null,
                tabindex: "-1"
            })
        }).eq(e.currentSlide).find("button").attr({
            "aria-selected": "true",
            tabindex: "0"
        }).end());
        for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++)
            e.$slides.eq(s).attr("tabindex", 0);
        e.activateADA()
    }
    ,
    e.prototype.initArrowEvents = function() {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, i.changeSlide),
        i.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, i.changeSlide),
        !0 === i.options.accessibility && (i.$prevArrow.on("keydown.slick", i.keyHandler),
        i.$nextArrow.on("keydown.slick", i.keyHandler)))
    }
    ,
    e.prototype.initDotEvents = function() {
        var e = this;
        !0 === e.options.dots && (i("li", e.$dots).on("click.slick", {
            message: "index"
        }, e.changeSlide),
        !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)),
        !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    }
    ,
    e.prototype.initSlideEvents = function() {
        var e = this;
        e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)))
    }
    ,
    e.prototype.initializeEvents = function() {
        var e = this;
        e.initArrowEvents(),
        e.initDotEvents(),
        e.initSlideEvents(),
        e.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, e.swipeHandler),
        e.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, e.swipeHandler),
        e.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, e.swipeHandler),
        e.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, e.swipeHandler),
        e.$list.on("click.slick", e.clickHandler),
        i(document).on(e.visibilityChange, i.proxy(e.visibility, e)),
        !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)),
        i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)),
        i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault),
        i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
        i(e.setPosition)
    }
    ,
    e.prototype.initUI = function() {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(),
        i.$nextArrow.show()),
        !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.show()
    }
    ,
    e.prototype.keyHandler = function(i) {
        var e = this;
        i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && !0 === e.options.accessibility ? e.changeSlide({
            data: {
                message: !0 === e.options.rtl ? "next" : "previous"
            }
        }) : 39 === i.keyCode && !0 === e.options.accessibility && e.changeSlide({
            data: {
                message: !0 === e.options.rtl ? "previous" : "next"
            }
        }))
    }
    ,
    e.prototype.lazyLoad = function() {
        function e(e) {
            i("img[data-lazy]", e).each(function() {
                var e = i(this)
                  , t = i(this).attr("data-lazy")
                  , o = i(this).attr("data-srcset")
                  , s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes")
                  , r = document.createElement("img");
                r.onload = function() {
                    e.animate({
                        opacity: 0
                    }, 100, function() {
                        o && (e.attr("srcset", o),
                        s && e.attr("sizes", s)),
                        e.attr("src", t).animate({
                            opacity: 1
                        }, 200, function() {
                            e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        }),
                        n.$slider.trigger("lazyLoaded", [n, e, t])
                    })
                }
                ,
                r.onerror = function() {
                    e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                    n.$slider.trigger("lazyLoadError", [n, e, t])
                }
                ,
                r.src = t
            })
        }
        var t, o, s, n = this;
        if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)),
        s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide,
        s = Math.ceil(o + n.options.slidesToShow),
        !0 === n.options.fade && (o > 0 && o--,
        s <= n.slideCount && s++)),
        t = n.$slider.find(".slick-slide").slice(o, s),
        "anticipated" === n.options.lazyLoad)
            for (var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0; a < n.options.slidesToScroll; a++)
                r < 0 && (r = n.slideCount - 1),
                t = (t = t.add(d.eq(r))).add(d.eq(l)),
                r--,
                l++;
        e(t),
        n.slideCount <= n.options.slidesToShow ? e(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow))
    }
    ,
    e.prototype.loadSlider = function() {
        var i = this;
        i.setPosition(),
        i.$slideTrack.css({
            opacity: 1
        }),
        i.$slider.removeClass("slick-loading"),
        i.initUI(),
        "progressive" === i.options.lazyLoad && i.progressiveLazyLoad()
    }
    ,
    e.prototype.next = e.prototype.slickNext = function() {
        this.changeSlide({
            data: {
                message: "next"
            }
        })
    }
    ,
    e.prototype.orientationChange = function() {
        var i = this;
        i.checkResponsive(),
        i.setPosition()
    }
    ,
    e.prototype.pause = e.prototype.slickPause = function() {
        var i = this;
        i.autoPlayClear(),
        i.paused = !0
    }
    ,
    e.prototype.play = e.prototype.slickPlay = function() {
        var i = this;
        i.autoPlay(),
        i.options.autoplay = !0,
        i.paused = !1,
        i.focussed = !1,
        i.interrupted = !1
    }
    ,
    e.prototype.postSlide = function(e) {
        var t = this;
        t.unslicked || (t.$slider.trigger("afterChange", [t, e]),
        t.animating = !1,
        t.slideCount > t.options.slidesToShow && t.setPosition(),
        t.swipeLeft = null,
        t.options.autoplay && t.autoPlay(),
        !0 === t.options.accessibility && (t.initADA(),
        t.options.focusOnChange && i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()))
    }
    ,
    e.prototype.prev = e.prototype.slickPrev = function() {
        this.changeSlide({
            data: {
                message: "previous"
            }
        })
    }
    ,
    e.prototype.preventDefault = function(i) {
        i.preventDefault()
    }
    ,
    e.prototype.progressiveLazyLoad = function(e) {
        e = e || 1;
        var t, o, s, n, r, l = this, d = i("img[data-lazy]", l.$slider);
        d.length ? (t = d.first(),
        o = t.attr("data-lazy"),
        s = t.attr("data-srcset"),
        n = t.attr("data-sizes") || l.$slider.attr("data-sizes"),
        (r = document.createElement("img")).onload = function() {
            s && (t.attr("srcset", s),
            n && t.attr("sizes", n)),
            t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),
            !0 === l.options.adaptiveHeight && l.setPosition(),
            l.$slider.trigger("lazyLoaded", [l, t, o]),
            l.progressiveLazyLoad()
        }
        ,
        r.onerror = function() {
            e < 3 ? setTimeout(function() {
                l.progressiveLazyLoad(e + 1)
            }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
            l.$slider.trigger("lazyLoadError", [l, t, o]),
            l.progressiveLazyLoad())
        }
        ,
        r.src = o) : l.$slider.trigger("allImagesLoaded", [l])
    }
    ,
    e.prototype.refresh = function(e) {
        var t, o, s = this;
        o = s.slideCount - s.options.slidesToShow,
        !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
        s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
        t = s.currentSlide,
        s.destroy(!0),
        i.extend(s, s.initials, {
            currentSlide: t
        }),
        s.init(),
        e || s.changeSlide({
            data: {
                message: "index",
                index: t
            }
        }, !1)
    }
    ,
    e.prototype.registerBreakpoints = function() {
        var e, t, o, s = this, n = s.options.responsive || null;
        if ("array" === i.type(n) && n.length) {
            s.respondTo = s.options.respondTo || "window";
            for (e in n)
                if (o = s.breakpoints.length - 1,
                n.hasOwnProperty(e)) {
                    for (t = n[e].breakpoint; o >= 0; )
                        s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1),
                        o--;
                    s.breakpoints.push(t),
                    s.breakpointSettings[t] = n[e].settings
                }
            s.breakpoints.sort(function(i, e) {
                return s.options.mobileFirst ? i - e : e - i
            })
        }
    }
    ,
    e.prototype.reinit = function() {
        var e = this;
        e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"),
        e.slideCount = e.$slides.length,
        e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
        e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
        e.registerBreakpoints(),
        e.setProps(),
        e.setupInfinite(),
        e.buildArrows(),
        e.updateArrows(),
        e.initArrowEvents(),
        e.buildDots(),
        e.updateDots(),
        e.initDotEvents(),
        e.cleanUpSlideEvents(),
        e.initSlideEvents(),
        e.checkResponsive(!1, !0),
        !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0),
        e.setPosition(),
        e.focusHandler(),
        e.paused = !e.options.autoplay,
        e.autoPlay(),
        e.$slider.trigger("reInit", [e])
    }
    ,
    e.prototype.resize = function() {
        var e = this;
        i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay),
        e.windowDelay = window.setTimeout(function() {
            e.windowWidth = i(window).width(),
            e.checkResponsive(),
            e.unslicked || e.setPosition()
        }, 50))
    }
    ,
    e.prototype.removeSlide = e.prototype.slickRemove = function(i, e, t) {
        var o = this;
        if (i = "boolean" == typeof i ? !0 === (e = i) ? 0 : o.slideCount - 1 : !0 === e ? --i : i,
        o.slideCount < 1 || i < 0 || i > o.slideCount - 1)
            return !1;
        o.unload(),
        !0 === t ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(),
        o.$slides = o.$slideTrack.children(this.options.slide),
        o.$slideTrack.children(this.options.slide).detach(),
        o.$slideTrack.append(o.$slides),
        o.$slidesCache = o.$slides,
        o.reinit()
    }
    ,
    e.prototype.setCSS = function(i) {
        var e, t, o = this, s = {};
        !0 === o.options.rtl && (i = -i),
        e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px",
        t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px",
        s[o.positionProp] = i,
        !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {},
        !1 === o.cssTransitions ? (s[o.animType] = "translate(" + e + ", " + t + ")",
        o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)",
        o.$slideTrack.css(s)))
    }
    ,
    e.prototype.setDimensions = function() {
        var i = this;
        !1 === i.options.vertical ? !0 === i.options.centerMode && i.$list.css({
            padding: "0px " + i.options.centerPadding
        }) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow),
        !0 === i.options.centerMode && i.$list.css({
            padding: i.options.centerPadding + " 0px"
        })),
        i.listWidth = i.$list.width(),
        i.listHeight = i.$list.height(),
        !1 === i.options.vertical && !1 === i.options.variableWidth ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow),
        i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : !0 === i.options.variableWidth ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth),
        i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
        var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
        !1 === i.options.variableWidth && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e)
    }
    ,
    e.prototype.setFade = function() {
        var e, t = this;
        t.$slides.each(function(o, s) {
            e = t.slideWidth * o * -1,
            !0 === t.options.rtl ? i(s).css({
                position: "relative",
                right: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0
            }) : i(s).css({
                position: "relative",
                left: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0
            })
        }),
        t.$slides.eq(t.currentSlide).css({
            zIndex: t.options.zIndex - 1,
            opacity: 1
        })
    }
    ,
    e.prototype.setHeight = function() {
        var i = this;
        if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.css("height", e)
        }
    }
    ,
    e.prototype.setOption = e.prototype.slickSetOption = function() {
        var e, t, o, s, n, r = this, l = !1;
        if ("object" === i.type(arguments[0]) ? (o = arguments[0],
        l = arguments[1],
        n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0],
        s = arguments[1],
        l = arguments[2],
        "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")),
        "single" === n)
            r.options[o] = s;
        else if ("multiple" === n)
            i.each(o, function(i, e) {
                r.options[i] = e
            });
        else if ("responsive" === n)
            for (t in s)
                if ("array" !== i.type(r.options.responsive))
                    r.options.responsive = [s[t]];
                else {
                    for (e = r.options.responsive.length - 1; e >= 0; )
                        r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1),
                        e--;
                    r.options.responsive.push(s[t])
                }
        l && (r.unload(),
        r.reinit())
    }
    ,
    e.prototype.setPosition = function() {
        var i = this;
        i.setDimensions(),
        i.setHeight(),
        !1 === i.options.fade ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(),
        i.$slider.trigger("setPosition", [i])
    }
    ,
    e.prototype.setProps = function() {
        var i = this
          , e = document.body.style;
        i.positionProp = !0 === i.options.vertical ? "top" : "left",
        "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"),
        void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || !0 === i.options.useCSS && (i.cssTransitions = !0),
        i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex),
        void 0 !== e.OTransform && (i.animType = "OTransform",
        i.transformType = "-o-transform",
        i.transitionType = "OTransition",
        void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)),
        void 0 !== e.MozTransform && (i.animType = "MozTransform",
        i.transformType = "-moz-transform",
        i.transitionType = "MozTransition",
        void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)),
        void 0 !== e.webkitTransform && (i.animType = "webkitTransform",
        i.transformType = "-webkit-transform",
        i.transitionType = "webkitTransition",
        void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)),
        void 0 !== e.msTransform && (i.animType = "msTransform",
        i.transformType = "-ms-transform",
        i.transitionType = "msTransition",
        void 0 === e.msTransform && (i.animType = !1)),
        void 0 !== e.transform && !1 !== i.animType && (i.animType = "transform",
        i.transformType = "transform",
        i.transitionType = "transition"),
        i.transformsEnabled = i.options.useTransform && null !== i.animType && !1 !== i.animType
    }
    ,
    e.prototype.setSlideClasses = function(i) {
        var e, t, o, s, n = this;
        if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"),
        n.$slides.eq(i).addClass("slick-current"),
        !0 === n.options.centerMode) {
            var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
            e = Math.floor(n.options.slidesToShow / 2),
            !0 === n.options.infinite && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i,
            t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")),
            0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")),
            n.$slides.eq(i).addClass("slick-center")
        } else
            i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow,
            o = !0 === n.options.infinite ? n.options.slidesToShow + i : i,
            n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
        "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad()
    }
    ,
    e.prototype.setupInfinite = function() {
        var e, t, o, s = this;
        if (!0 === s.options.fade && (s.options.centerMode = !1),
        !0 === s.options.infinite && !1 === s.options.fade && (t = null,
        s.slideCount > s.options.slidesToShow)) {
            for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow,
            e = s.slideCount; e > s.slideCount - o; e -= 1)
                t = e - 1,
                i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
            for (e = 0; e < o + s.slideCount; e += 1)
                t = e,
                i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
            s.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                i(this).attr("id", "")
            })
        }
    }
    ,
    e.prototype.interrupt = function(i) {
        var e = this;
        i || e.autoPlay(),
        e.interrupted = i
    }
    ,
    e.prototype.selectHandler = function(e) {
        var t = this
          , o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide")
          , s = parseInt(o.attr("data-slick-index"));
        s || (s = 0),
        t.slideCount <= t.options.slidesToShow ? t.slideHandler(s, !1, !0) : t.slideHandler(s)
    }
    ,
    e.prototype.slideHandler = function(i, e, t) {
        var o, s, n, r, l, d = null, a = this;
        if (e = e || !1,
        !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === i))
            if (!1 === e && a.asNavFor(i),
            o = i,
            d = a.getLeft(o),
            r = a.getLeft(a.currentSlide),
            a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft,
            !1 === a.options.infinite && !1 === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll))
                !1 === a.options.fade && (o = a.currentSlide,
                !0 !== t ? a.animateSlide(r, function() {
                    a.postSlide(o)
                }) : a.postSlide(o));
            else if (!1 === a.options.infinite && !0 === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll))
                !1 === a.options.fade && (o = a.currentSlide,
                !0 !== t ? a.animateSlide(r, function() {
                    a.postSlide(o)
                }) : a.postSlide(o));
            else {
                if (a.options.autoplay && clearInterval(a.autoPlayTimer),
                s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o,
                a.animating = !0,
                a.$slider.trigger("beforeChange", [a, a.currentSlide, s]),
                n = a.currentSlide,
                a.currentSlide = s,
                a.setSlideClasses(a.currentSlide),
                a.options.asNavFor && (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide),
                a.updateDots(),
                a.updateArrows(),
                !0 === a.options.fade)
                    return !0 !== t ? (a.fadeSlideOut(n),
                    a.fadeSlide(s, function() {
                        a.postSlide(s)
                    })) : a.postSlide(s),
                    void a.animateHeight();
                !0 !== t ? a.animateSlide(d, function() {
                    a.postSlide(s)
                }) : a.postSlide(s)
            }
    }
    ,
    e.prototype.startLoad = function() {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(),
        i.$nextArrow.hide()),
        !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.hide(),
        i.$slider.addClass("slick-loading")
    }
    ,
    e.prototype.swipeDirection = function() {
        var i, e, t, o, s = this;
        return i = s.touchObject.startX - s.touchObject.curX,
        e = s.touchObject.startY - s.touchObject.curY,
        t = Math.atan2(e, i),
        (o = Math.round(180 * t / Math.PI)) < 0 && (o = 360 - Math.abs(o)),
        o <= 45 && o >= 0 ? !1 === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical"
    }
    ,
    e.prototype.swipeEnd = function(i) {
        var e, t, o = this;
        if (o.dragging = !1,
        o.swiping = !1,
        o.scrolling)
            return o.scrolling = !1,
            !1;
        if (o.interrupted = !1,
        o.shouldClick = !(o.touchObject.swipeLength > 10),
        void 0 === o.touchObject.curX)
            return !1;
        if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]),
        o.touchObject.swipeLength >= o.touchObject.minSwipe) {
            switch (t = o.swipeDirection()) {
            case "left":
            case "down":
                e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(),
                o.currentDirection = 0;
                break;
            case "right":
            case "up":
                e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(),
                o.currentDirection = 1
            }
            "vertical" != t && (o.slideHandler(e),
            o.touchObject = {},
            o.$slider.trigger("swipe", [o, t]))
        } else
            o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide),
            o.touchObject = {})
    }
    ,
    e.prototype.swipeHandler = function(i) {
        var e = this;
        if (!(!1 === e.options.swipe || "ontouchend"in document && !1 === e.options.swipe || !1 === e.options.draggable && -1 !== i.type.indexOf("mouse")))
            switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1,
            e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold,
            !0 === e.options.verticalSwiping && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold),
            i.data.action) {
            case "start":
                e.swipeStart(i);
                break;
            case "move":
                e.swipeMove(i);
                break;
            case "end":
                e.swipeEnd(i)
            }
    }
    ,
    e.prototype.swipeMove = function(i) {
        var e, t, o, s, n, r, l = this;
        return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null,
        !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide),
        l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX,
        l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY,
        l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))),
        r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))),
        !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0,
        !1) : (!0 === l.options.verticalSwiping && (l.touchObject.swipeLength = r),
        t = l.swipeDirection(),
        void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0,
        i.preventDefault()),
        s = (!1 === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1),
        !0 === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1),
        o = l.touchObject.swipeLength,
        l.touchObject.edgeHit = !1,
        !1 === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction,
        l.touchObject.edgeHit = !0),
        !1 === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s,
        !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s),
        !0 !== l.options.fade && !1 !== l.options.touchMove && (!0 === l.animating ? (l.swipeLeft = null,
        !1) : void l.setCSS(l.swipeLeft))))
    }
    ,
    e.prototype.swipeStart = function(i) {
        var e, t = this;
        if (t.interrupted = !0,
        1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow)
            return t.touchObject = {},
            !1;
        void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]),
        t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX,
        t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY,
        t.dragging = !0
    }
    ,
    e.prototype.unfilterSlides = e.prototype.slickUnfilter = function() {
        var i = this;
        null !== i.$slidesCache && (i.unload(),
        i.$slideTrack.children(this.options.slide).detach(),
        i.$slidesCache.appendTo(i.$slideTrack),
        i.reinit())
    }
    ,
    e.prototype.unload = function() {
        var e = this;
        i(".slick-cloned", e.$slider).remove(),
        e.$dots && e.$dots.remove(),
        e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(),
        e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(),
        e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }
    ,
    e.prototype.unslick = function(i) {
        var e = this;
        e.$slider.trigger("unslick", [e, i]),
        e.destroy()
    }
    ,
    e.prototype.updateArrows = function() {
        var i = this;
        Math.floor(i.options.slidesToShow / 2),
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite && (i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        0 === i.currentSlide ? (i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - i.options.slidesToShow && !1 === i.options.centerMode ? (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - 1 && !0 === i.options.centerMode && (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }
    ,
    e.prototype.updateDots = function() {
        var i = this;
        null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(),
        i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"))
    }
    ,
    e.prototype.visibility = function() {
        var i = this;
        i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1)
    }
    ,
    i.fn.slick = function() {
        var i, t, o = this, s = arguments[0], n = Array.prototype.slice.call(arguments, 1), r = o.length;
        for (i = 0; i < r; i++)
            if ("object" == typeof s || void 0 === s ? o[i].slick = new e(o[i],s) : t = o[i].slick[s].apply(o[i].slick, n),
            void 0 !== t)
                return t;
        return o
    }
});

(function() {
    var t, n, r, e, i, a, f = {}.hasOwnProperty, l = [].slice;
    this.OverlappingMarkerSpiderfier = function() {
        var c, g, t, r, h, u, e, p;
        for (t = 0,
        r = (e = [i, u = i.prototype]).length; t < r; t++)
            e[t].VERSION = "1.0.3";
        function i(t, r) {
            var e, i, s, n, a, o, l;
            for (e in this.map = t,
            null == r && (r = {}),
            null == this.constructor.hasInitialized && (this.constructor.hasInitialized = !0,
            g = google.maps,
            c = g.event,
            h = g.MapTypeId,
            u.keepSpiderfied = !1,
            u.ignoreMapClick = !1,
            u.markersWontHide = !1,
            u.markersWontMove = !1,
            u.basicFormatEvents = !1,
            u.nearbyDistance = 20,
            u.circleSpiralSwitchover = 9,
            u.circleFootSeparation = 23,
            u.circleStartAngle = p / 12,
            u.spiralFootSeparation = 26,
            u.spiralLengthStart = 11,
            u.spiralLengthFactor = 4,
            u.spiderfiedZIndex = g.Marker.MAX_ZINDEX + 2e4,
            u.highlightedLegZIndex = g.Marker.MAX_ZINDEX + 1e4,
            u.usualLegZIndex = g.Marker.MAX_ZINDEX + 1,
            u.legWeight = 1.5,
            u.legColors = {
                usual: {},
                highlighted: {}
            },
            s = u.legColors.usual,
            i = u.legColors.highlighted,
            s[h.HYBRID] = s[h.SATELLITE] = "#fff",
            i[h.HYBRID] = i[h.SATELLITE] = "#f00",
            s[h.TERRAIN] = s[h.ROADMAP] = "#444",
            i[h.TERRAIN] = i[h.ROADMAP] = "#f00",
            this.constructor.ProjHelper = function(t) {
                return this.setMap(t)
            }
            ,
            this.constructor.ProjHelper.prototype = new g.OverlayView,
            this.constructor.ProjHelper.prototype.draw = function() {}
            ),
            r)
                f.call(r, e) && (n = r[e],
                this[e] = n);
            this.projHelper = new this.constructor.ProjHelper(this.map),
            this.initMarkerArrays(),
            this.listeners = {},
            this.formatIdleListener = this.formatTimeoutId = null,
            this.addListener("click", function(t, r) {
                return c.trigger(t, "spider_click", r)
            }),
            this.addListener("format", function(t, r) {
                return c.trigger(t, "spider_format", r)
            }),
            this.ignoreMapClick || c.addListener(this.map, "click", (a = this,
            function() {
                return a.unspiderfy()
            }
            )),
            c.addListener(this.map, "maptypeid_changed", (o = this,
            function() {
                return o.unspiderfy()
            }
            )),
            c.addListener(this.map, "zoom_changed", (l = this,
            function() {
                if (l.unspiderfy(),
                !l.basicFormatEvents)
                    return l.formatMarkers()
            }
            ))
        }
        return p = 2 * Math.PI,
        g = c = h = null,
        i.markerStatus = {
            SPIDERFIED: "SPIDERFIED",
            SPIDERFIABLE: "SPIDERFIABLE",
            UNSPIDERFIABLE: "UNSPIDERFIABLE",
            UNSPIDERFIED: "UNSPIDERFIED"
        },
        u.initMarkerArrays = function() {
            return this.markers = [],
            this.markerListenerRefs = []
        }
        ,
        u.addMarker = function(t, r) {
            return t.setMap(this.map),
            this.trackMarker(t, r)
        }
        ,
        u.trackMarker = function(r, t) {
            var e, i, s, n;
            return null != r._oms || (r._oms = !0,
            e = [c.addListener(r, "click", (i = this,
            function(t) {
                return i.spiderListener(r, t)
            }
            ))],
            this.markersWontHide || e.push(c.addListener(r, "visible_changed", (s = this,
            function() {
                return s.markerChangeListener(r, !1)
            }
            ))),
            this.markersWontMove || e.push(c.addListener(r, "position_changed", (n = this,
            function() {
                return n.markerChangeListener(r, !0)
            }
            ))),
            null != t && e.push(c.addListener(r, "spider_click", t)),
            this.markerListenerRefs.push(e),
            this.markers.push(r),
            this.basicFormatEvents ? this.trigger("format", r, this.constructor.markerStatus.UNSPIDERFIED) : (this.trigger("format", r, this.constructor.markerStatus.UNSPIDERFIABLE),
            this.formatMarkers())),
            this
        }
        ,
        u.markerChangeListener = function(t, r) {
            if (!this.spiderfying && !this.unspiderfying)
                return null == t._omsData || !r && t.getVisible() || this.unspiderfy(r ? t : null),
                this.formatMarkers()
        }
        ,
        u.getMarkers = function() {
            return this.markers.slice(0)
        }
        ,
        u.removeMarker = function(t) {
            return this.forgetMarker(t),
            t.setMap(null)
        }
        ,
        u.forgetMarker = function(t) {
            var r, e, i, s, n;
            if (null != t._omsData && this.unspiderfy(),
            (r = this.arrIndexOf(this.markers, t)) < 0)
                return this;
            for (e = 0,
            i = (n = this.markerListenerRefs.splice(r, 1)[0]).length; e < i; e++)
                s = n[e],
                c.removeListener(s);
            return delete t._oms,
            this.markers.splice(r, 1),
            this.formatMarkers(),
            this
        }
        ,
        u.removeAllMarkers = u.clearMarkers = function() {
            var t, r, e;
            for (e = this.getMarkers(),
            this.forgetAllMarkers(),
            t = 0,
            r = e.length; t < r; t++)
                e[t].setMap(null);
            return this
        }
        ,
        u.forgetAllMarkers = function() {
            var t, r, e, i, s, n, a, o, l;
            for (this.unspiderfy(),
            t = r = 0,
            e = (l = this.markers).length; r < e; t = ++r) {
                for (a = l[t],
                o = 0,
                i = (n = this.markerListenerRefs[t]).length; o < i; o++)
                    s = n[o],
                    c.removeListener(s);
                delete a._oms
            }
            return this.initMarkerArrays(),
            this
        }
        ,
        u.addListener = function(t, r) {
            var e;
            return (null != (e = this.listeners)[t] ? e[t] : e[t] = []).push(r),
            this
        }
        ,
        u.removeListener = function(t, r) {
            var e;
            return (e = this.arrIndexOf(this.listeners[t], r)) < 0 || this.listeners[t].splice(e, 1),
            this
        }
        ,
        u.clearListeners = function(t) {
            return this.listeners[t] = [],
            this
        }
        ,
        u.trigger = function() {
            var t, r, e, i, s, n, a, o;
            for (r = arguments[0],
            t = 2 <= arguments.length ? l.call(arguments, 1) : [],
            o = [],
            i = 0,
            s = (a = null != (n = this.listeners[r]) ? n : []).length; i < s; i++)
                e = a[i],
                o.push(e.apply(null, t));
            return o
        }
        ,
        u.generatePtsCircle = function(t, r) {
            var e, i, s, n, a, o, l;
            for (a = this.circleFootSeparation * (2 + t) / p,
            i = p / t,
            l = [],
            s = n = 0,
            o = t; 0 <= o ? n < o : o < n; s = 0 <= o ? ++n : --n)
                e = this.circleStartAngle + s * i,
                l.push(new g.Point(r.x + a * Math.cos(e),r.y + a * Math.sin(e)));
            return l
        }
        ,
        u.generatePtsSpiral = function(t, r) {
            var e, i, s, n, a, o, l;
            for (n = this.spiralLengthStart,
            l = [],
            i = s = e = 0,
            o = t; 0 <= o ? s < o : o < s; i = 0 <= o ? ++s : --s)
                e += this.spiralFootSeparation / n + 5e-4 * i,
                a = new g.Point(r.x + n * Math.cos(e),r.y + n * Math.sin(e)),
                n += p * this.spiralLengthFactor / e,
                l.push(a);
            return l
        }
        ,
        u.spiderListener = function(t, r) {
            var e, i, s, n, a, o, l, h, u, p, f;
            if ((o = null != t._omsData) && this.keepSpiderfied || this.unspiderfy(),
            o || this.map.getStreetView().getVisible() || "GoogleEarthAPI" === this.map.getMapTypeId())
                return this.trigger("click", t, r);
            for (h = [],
            u = [],
            p = (l = this.nearbyDistance) * l,
            a = this.llToPt(t.position),
            e = 0,
            i = (f = this.markers).length; e < i; e++)
                null != (s = f[e]).map && s.getVisible() && (n = this.llToPt(s.position),
                this.ptDistanceSq(n, a) < p ? h.push({
                    marker: s,
                    markerPt: n
                }) : u.push(s));
            return 1 === h.length ? this.trigger("click", t, r) : this.spiderfy(h, u)
        }
        ,
        u.markersNearMarker = function(t, r) {
            var e, i, s, n, a, o, l, h, u, p, f;
            if (null == r && (r = !1),
            null == this.projHelper.getProjection())
                throw "Must wait for 'idle' event on map before calling markersNearMarker";
            for (h = (l = this.nearbyDistance) * l,
            a = this.llToPt(t.position),
            o = [],
            e = 0,
            i = (u = this.markers).length; e < i && !((s = u[e]) !== t && null != s.map && s.getVisible() && (n = this.llToPt(null != (p = null != (f = s._omsData) ? f.usualPosition : void 0) ? p : s.position),
            this.ptDistanceSq(n, a) < h && (o.push(s),
            r))); e++)
                ;
            return o
        }
        ,
        u.markerProximityData = function() {
            var t, r, e, i, s, a, n, o, l, h, u, p, f, c, g, m;
            if (null == this.projHelper.getProjection())
                throw "Must wait for 'idle' event on map before calling markersNearAnyOtherMarker";
            for (c = (f = this.nearbyDistance) * f,
            u = function() {
                var t, r, e, i, s, n;
                for (n = [],
                t = 0,
                r = (e = this.markers).length; t < r; t++)
                    a = e[t],
                    n.push({
                        pt: this.llToPt(null != (i = null != (s = a._omsData) ? s.usualPosition : void 0) ? i : a.position),
                        willSpiderfy: !1
                    });
                return n
            }
            .call(this),
            t = e = 0,
            i = (g = this.markers).length; e < i; t = ++e)
                if (null != (n = g[t]).getMap() && n.getVisible() && !(o = u[t]).willSpiderfy)
                    for (r = p = 0,
                    s = (m = this.markers).length; p < s; r = ++p)
                        if (l = m[r],
                        r !== t && null != l.getMap() && l.getVisible() && (h = u[r],
                        (!(r < t) || h.willSpiderfy) && this.ptDistanceSq(o.pt, h.pt) < c)) {
                            o.willSpiderfy = h.willSpiderfy = !0;
                            break
                        }
            return u
        }
        ,
        u.markersNearAnyOtherMarker = function() {
            var t, r, e, i, s, n, a;
            for (s = this.markerProximityData(),
            a = [],
            t = r = 0,
            e = (n = this.markers).length; r < e; t = ++r)
                i = n[t],
                s[t].willSpiderfy && a.push(i);
            return a
        }
        ,
        u.setImmediate = function(t) {
            return window.setTimeout(t, 0)
        }
        ,
        u.formatMarkers = function() {
            var t;
            if (!this.basicFormatEvents && null == this.formatTimeoutId)
                return this.formatTimeoutId = this.setImmediate((t = this,
                function() {
                    return (t.formatTimeoutId = null) != t.projHelper.getProjection() ? t._formatMarkers() : null == t.formatIdleListener ? t.formatIdleListener = c.addListenerOnce(t.map, "idle", function() {
                        return t._formatMarkers()
                    }) : void 0
                }
                ))
        }
        ,
        u._formatMarkers = function() {
            var t, r, e, i, s, n, a, o, l, h, u;
            if (this.basicFormatEvents) {
                for (l = [],
                r = 0,
                e = markers.length; r < e; r++)
                    u = null != (s = markers[r])._omsData ? "SPIDERFIED" : "UNSPIDERFIED",
                    l.push(this.trigger("format", s, this.constructor.markerStatus[u]));
                return l
            }
            for (a = this.markerProximityData(),
            h = [],
            t = n = 0,
            i = (o = this.markers).length; n < i; t = ++n)
                u = null != (s = o[t])._omsData ? "SPIDERFIED" : a[t].willSpiderfy ? "SPIDERFIABLE" : "UNSPIDERFIABLE",
                h.push(this.trigger("format", s, this.constructor.markerStatus[u]));
            return h
        }
        ,
        u.makeHighlightListenerFuncs = function(t) {
            return {
                highlight: (e = this,
                function() {
                    return t._omsData.leg.setOptions({
                        strokeColor: e.legColors.highlighted[e.map.mapTypeId],
                        zIndex: e.highlightedLegZIndex
                    })
                }
                ),
                unhighlight: (r = this,
                function() {
                    return t._omsData.leg.setOptions({
                        strokeColor: r.legColors.usual[r.map.mapTypeId],
                        zIndex: r.usualLegZIndex
                    })
                }
                )
            };
            var r, e
        }
        ,
        u.spiderfy = function(i, t) {
            var r, s, n, a, o, l, h, u, p, e, f;
            return this.spiderfying = !0,
            e = i.length,
            r = this.ptAverage(function() {
                var t, r, e;
                for (e = [],
                t = 0,
                r = i.length; t < r; t++)
                    u = i[t],
                    e.push(u.markerPt);
                return e
            }()),
            a = e >= this.circleSpiralSwitchover ? this.generatePtsSpiral(e, r).reverse() : this.generatePtsCircle(e, r),
            f = function() {
                var t, r, e;
                for (e = [],
                t = 0,
                r = a.length; t < r; t++)
                    n = a[t],
                    s = this.ptToLl(n),
                    p = this.minExtract(i, function(r) {
                        return function(t) {
                            return r.ptDistanceSq(t.markerPt, n)
                        }
                    }(this)),
                    h = p.marker,
                    l = new g.Polyline({
                        map: this.map,
                        path: [h.position, s],
                        strokeColor: this.legColors.usual[this.map.mapTypeId],
                        strokeWeight: this.legWeight,
                        zIndex: this.usualLegZIndex
                    }),
                    h._omsData = {
                        usualPosition: h.getPosition(),
                        usualZIndex: h.getZIndex(),
                        leg: l
                    },
                    this.legColors.highlighted[this.map.mapTypeId] !== this.legColors.usual[this.map.mapTypeId] && (o = this.makeHighlightListenerFuncs(h),
                    h._omsData.hightlightListeners = {
                        highlight: c.addListener(h, "mouseover", o.highlight),
                        unhighlight: c.addListener(h, "mouseout", o.unhighlight)
                    }),
                    this.trigger("format", h, this.constructor.markerStatus.SPIDERFIED),
                    h.setPosition(s),
                    h.setZIndex(Math.round(this.spiderfiedZIndex + n.y)),
                    e.push(h);
                return e
            }
            .call(this),
            delete this.spiderfying,
            this.spiderfied = !0,
            this.trigger("spiderfy", f, t)
        }
        ,
        u.unspiderfy = function(t) {
            var r, e, i, s, n, a, o, l;
            if (null == t && (t = null),
            null == this.spiderfied)
                return this;
            for (this.unspiderfying = !0,
            l = [],
            n = [],
            r = 0,
            e = (a = this.markers).length; r < e; r++)
                null != (s = a[r])._omsData ? (s._omsData.leg.setMap(null),
                s !== t && s.setPosition(s._omsData.usualPosition),
                s.setZIndex(s._omsData.usualZIndex),
                null != (i = s._omsData.hightlightListeners) && (c.removeListener(i.highlight),
                c.removeListener(i.unhighlight)),
                delete s._omsData,
                s !== t && (o = this.basicFormatEvents ? "UNSPIDERFIED" : "SPIDERFIABLE",
                this.trigger("format", s, this.constructor.markerStatus[o])),
                l.push(s)) : n.push(s);
            return delete this.unspiderfying,
            delete this.spiderfied,
            this.trigger("unspiderfy", l, n),
            this
        }
        ,
        u.ptDistanceSq = function(t, r) {
            var e, i;
            return (e = t.x - r.x) * e + (i = t.y - r.y) * i
        }
        ,
        u.ptAverage = function(t) {
            var r, e, i, s, n, a;
            for (n = a = 0,
            r = 0,
            e = t.length; r < e; r++)
                n += (s = t[r]).x,
                a += s.y;
            return i = t.length,
            new g.Point(n / i,a / i)
        }
        ,
        u.llToPt = function(t) {
            return this.projHelper.getProjection().fromLatLngToDivPixel(t)
        }
        ,
        u.ptToLl = function(t) {
            return this.projHelper.getProjection().fromDivPixelToLatLng(t)
        }
        ,
        u.minExtract = function(t, r) {
            var e, i, s, n, a, o;
            for (s = n = 0,
            a = t.length; n < a; s = ++n)
                o = r(t[s]),
                (null == e || o < i) && (i = o,
                e = s);
            return t.splice(e, 1)[0]
        }
        ,
        u.arrIndexOf = function(t, r) {
            var e, i, s;
            if (null != t.indexOf)
                return t.indexOf(r);
            for (e = i = 0,
            s = t.length; i < s; e = ++i)
                if (t[e] === r)
                    return e;
            return -1
        }
        ,
        i
    }(),
    n = /(\?.*(&|&amp;)|\?)spiderfier_callback=(\w+)/,
    null == (i = document.currentScript) && (i = function() {
        var t, r, e, i, s;
        for (s = [],
        t = 0,
        r = (e = document.getElementsByTagName("script")).length; t < r; t++)
            (null != (i = (a = e[t]).getAttribute("src")) ? i.match(n) : void 0) && s.push(a);
        return s
    }()[0]),
    null != i && (t = null != (r = i.getAttribute("src")) && null != (e = r.match(n)) ? e[3] : void 0) && "function" == typeof window[t] && window[t](),
    "function" == typeof window.spiderfier_callback && window.spiderfier_callback()
}
).call(this);
var MarkerClusterer = function() {
    "use strict";
    function e(e, t) {
        if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function")
    }
    function t(e, t) {
        for (var i = 0; i < t.length; i++) {
            var s = t[i];
            s.enumerable = s.enumerable || !1,
            s.configurable = !0,
            "value"in s && (s.writable = !0),
            Object.defineProperty(e, s.key, s)
        }
    }
    function i(e, i, s) {
        return i && t(e.prototype, i),
        s && t(e, s),
        e
    }
    function s(e, t) {
        if ("function" != typeof t && null !== t)
            throw new TypeError("Super expression must either be null or a function");
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                writable: !0,
                configurable: !0
            }
        }),
        t && r(e, t)
    }
    function n(e) {
        return (n = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
            return e.__proto__ || Object.getPrototypeOf(e)
        }
        )(e)
    }
    function r(e, t) {
        return (r = Object.setPrototypeOf || function(e, t) {
            return e.__proto__ = t,
            e
        }
        )(e, t)
    }
    function a(e, t) {
        return !t || "object" != typeof t && "function" != typeof t ? function(e) {
            if (void 0 === e)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e
        }(e) : t
    }
    function o(e, t) {
        return function(e) {
            if (Array.isArray(e))
                return e
        }(e) || function(e, t) {
            if (!(Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)))
                return;
            var i = []
              , s = !0
              , n = !1
              , r = void 0;
            try {
                for (var a, o = e[Symbol.iterator](); !(s = (a = o.next()).done) && (i.push(a.value),
                !t || i.length !== t); s = !0)
                    ;
            } catch (e) {
                n = !0,
                r = e
            } finally {
                try {
                    s || null == o.return || o.return()
                } finally {
                    if (n)
                        throw r
                }
            }
            return i
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }()
    }
    var l = function t() {
        e(this, t),
        function(e, t) {
            for (var i in t.prototype)
                e.prototype[i] = t.prototype[i]
        }(t, google.maps.OverlayView)
    }
      , u = function(t) {
        function r(t, i) {
            var s;
            return e(this, r),
            (s = a(this, n(r).call(this))).cluster_ = t,
            s.styles_ = i,
            s.className_ = s.cluster_.getMarkerClusterer().getClusterClass(),
            s.center_ = null,
            s.div_ = null,
            s.sums_ = null,
            s.visible_ = !1,
            s.setMap(t.getMap()),
            s
        }
        return s(r, t),
        i(r, [{
            key: "onAdd",
            value: function() {
                var e, t, i = this, s = this.cluster_.getMarkerClusterer(), n = o(google.maps.version.split("."), 2), r = n[0], a = n[1], l = 100 * parseInt(r, 10) + parseInt(a, 10);
                this.div_ = document.createElement("div"),
                this.div_.className = this.className_,
                this.visible_ && this.show(),
                this.getPanes().overlayMouseTarget.appendChild(this.div_),
                this.boundsChangedListener_ = google.maps.event.addListener(this.getMap(), "bounds_changed", (function() {
                    t = e
                }
                )),
                google.maps.event.addDomListener(this.div_, "mousedown", (function() {
                    e = !0,
                    t = !1
                }
                )),
                l >= 332 && google.maps.event.addDomListener(this.div_, "touchstart", (function(e) {
                    e.stopPropagation()
                }
                )),
                google.maps.event.addDomListener(this.div_, "click", (function(n) {
                    if (e = !1,
                    !t) {
                        if (google.maps.event.trigger(s, "click", i.cluster_),
                        google.maps.event.trigger(s, "clusterclick", i.cluster_),
                        s.getZoomOnClick()) {
                            var r = s.getMaxZoom()
                              , a = i.cluster_.getBounds();
                            s.getMap().fitBounds(a),
                            setTimeout((function() {
                                s.getMap().fitBounds(a),
                                null !== r && s.getMap().getZoom() > r && s.getMap().setZoom(r + 1)
                            }
                            ), 100)
                        }
                        n.cancelBubble = !0,
                        n.stopPropagation && n.stopPropagation()
                    }
                }
                )),
                google.maps.event.addDomListener(this.div_, "mouseover", (function() {
                    google.maps.event.trigger(s, "mouseover", i.cluster_)
                }
                )),
                google.maps.event.addDomListener(this.div_, "mouseout", (function() {
                    google.maps.event.trigger(s, "mouseout", i.cluster_)
                }
                ))
            }
        }, {
            key: "onRemove",
            value: function() {
                this.div_ && this.div_.parentNode && (this.hide(),
                google.maps.event.removeListener(this.boundsChangedListener_),
                google.maps.event.clearInstanceListeners(this.div_),
                this.div_.parentNode.removeChild(this.div_),
                this.div_ = null)
            }
        }, {
            key: "draw",
            value: function() {
                if (this.visible_) {
                    var e = this.getPosFromLatLng_(this.center_);
                    this.div_.style.top = e.y + "px",
                    this.div_.style.left = e.x + "px"
                }
            }
        }, {
            key: "hide",
            value: function() {
                this.div_ && (this.div_.style.display = "none"),
                this.visible_ = !1
            }
        }, {
            key: "show",
            value: function() {
                if (this.div_) {
                    var e = this.cluster_.getMarkerClusterer().ariaLabelFn(this.sums_.text)
                      , t = this.backgroundPosition_.split(" ")
                      , i = parseInt(t[0].replace(/^\s+|\s+$/g, ""), 10)
                      , s = parseInt(t[1].replace(/^\s+|\s+$/g, ""), 10);
                    this.div_.style.cssText = this.createCss_(this.getPosFromLatLng_(this.center_));
                    var n = "";
                    if (this.cluster_.getMarkerClusterer().getEnableRetinaIcons())
                        n = "width: ".concat(this.width_, "px; height: ").concat(this.height_, "px");
                    else {
                        var r = -1 * s
                          , a = -1 * i + this.width_
                          , o = -1 * s + this.height_
                          , l = -1 * i;
                        n = "clip: rect(".concat(r, "px, ").concat(a, "px, ").concat(o, "px, ").concat(l, "px)")
                    }
                    var u = ["position: absolute", "top: ".concat(s, "px"), "left: ".concat(i, "px"), n].join(";")
                      , h = ["position: absolute", "top: ".concat(this.anchorText_[0], "px"), "left: ".concat(this.anchorText_[1], "px"), "color: ".concat(this.textColor_), "font-size: ".concat(this.textSize_, "px"), "font-family: ".concat(this.fontFamily_), "font-weight: ".concat(this.fontWeight_), "font-style: ".concat(this.fontStyle_), "text-decoration: ".concat(this.textDecoration_), "text-align: center", "width: ".concat(this.width_, "px"), "line-height: ".concat(this.height_, "px")].join(";");
                    this.div_.innerHTML = "\n<img alt='".concat(this.sums_.text, '\' aria-hidden="true" src="').concat(this.url_, '" style="').concat(u, '"/>\n<div aria-label="').concat(e, '" tabindex="0" style="').concat(h, '">\n  <span aria-hidden="true">').concat(this.sums_.text, "</span>\n</div>\n"),
                    void 0 === this.sums_.title || "" === this.sums_.title ? this.div_.title = this.cluster_.getMarkerClusterer().getTitle() : this.div_.title = this.sums_.title,
                    this.div_.style.display = ""
                }
                this.visible_ = !0
            }
        }, {
            key: "useStyle",
            value: function(e) {
                this.sums_ = e;
                var t = Math.max(0, e.index - 1);
                t = Math.min(this.styles_.length - 1, t);
                var i = this.styles_[t];
                this.url_ = i.url,
                this.height_ = i.height,
                this.width_ = i.width,
                this.anchorText_ = i.anchorText || [0, 0],
                this.anchorIcon_ = i.anchorIcon || [Math.floor(this.height_ / 2), Math.floor(this.width_ / 2)],
                this.textColor_ = i.textColor || "black",
                this.textSize_ = i.textSize || 11,
                this.textDecoration_ = i.textDecoration || "none",
                this.fontWeight_ = i.fontWeight || "bold",
                this.fontStyle_ = i.fontStyle || "normal",
                this.fontFamily_ = i.fontFamily || "Arial,sans-serif",
                this.backgroundPosition_ = i.backgroundPosition || "0 0"
            }
        }, {
            key: "setCenter",
            value: function(e) {
                this.center_ = e
            }
        }, {
            key: "createCss_",
            value: function(e) {
                return ["z-index: ".concat(this.cluster_.getMarkerClusterer().getZIndex()), "cursor: pointer", "position: absolute; top: ".concat(e.y, "px; left: ").concat(e.x, "px"), "width: ".concat(this.width_, "px; height: ").concat(this.height_, "px"), "-webkit-user-select: none", "-khtml-user-select: none", "-moz-user-select: none", "-o-user-select: none", "user-select: none"].join(";")
            }
        }, {
            key: "getPosFromLatLng_",
            value: function(e) {
                var t = this.getProjection().fromLatLngToDivPixel(e);
                return t.x = Math.floor(t.x - this.anchorIcon_[1]),
                t.y = Math.floor(t.y - this.anchorIcon_[0]),
                t
            }
        }]),
        r
    }(l)
      , h = function() {
        function t(i) {
            e(this, t),
            this.markerClusterer_ = i,
            this.map_ = this.markerClusterer_.getMap(),
            this.minClusterSize_ = this.markerClusterer_.getMinimumClusterSize(),
            this.averageCenter_ = this.markerClusterer_.getAverageCenter(),
            this.markers_ = [],
            this.center_ = null,
            this.bounds_ = null,
            this.clusterIcon_ = new u(this,this.markerClusterer_.getStyles())
        }
        return i(t, [{
            key: "getSize",
            value: function() {
                return this.markers_.length
            }
        }, {
            key: "getMarkers",
            value: function() {
                return this.markers_
            }
        }, {
            key: "getCenter",
            value: function() {
                return this.center_
            }
        }, {
            key: "getMap",
            value: function() {
                return this.map_
            }
        }, {
            key: "getMarkerClusterer",
            value: function() {
                return this.markerClusterer_
            }
        }, {
            key: "getBounds",
            value: function() {
                for (var e = new google.maps.LatLngBounds(this.center_,this.center_), t = this.getMarkers(), i = 0; i < t.length; i++)
                    e.extend(t[i].getPosition());
                return e
            }
        }, {
            key: "remove",
            value: function() {
                this.clusterIcon_.setMap(null),
                this.markers_ = [],
                delete this.markers_
            }
        }, {
            key: "addMarker",
            value: function(e) {
                if (this.isMarkerAlreadyAdded_(e))
                    return !1;
                if (this.center_) {
                    if (this.averageCenter_) {
                        var t = this.markers_.length + 1
                          , i = (this.center_.lat() * (t - 1) + e.getPosition().lat()) / t
                          , s = (this.center_.lng() * (t - 1) + e.getPosition().lng()) / t;
                        this.center_ = new google.maps.LatLng(i,s),
                        this.calculateBounds_()
                    }
                } else
                    this.center_ = e.getPosition(),
                    this.calculateBounds_();
                e.isAdded = !0,
                this.markers_.push(e);
                var n = this.markers_.length
                  , r = this.markerClusterer_.getMaxZoom();
                if (null !== r && this.map_.getZoom() > r)
                    e.getMap() !== this.map_ && e.setMap(this.map_);
                else if (n < this.minClusterSize_)
                    e.getMap() !== this.map_ && e.setMap(this.map_);
                else if (n === this.minClusterSize_)
                    for (var a = 0; a < n; a++)
                        this.markers_[a].setMap(null);
                else
                    e.setMap(null);
                return this.updateIcon_(),
                !0
            }
        }, {
            key: "isMarkerInClusterBounds",
            value: function(e) {
                return this.bounds_.contains(e.getPosition())
            }
        }, {
            key: "calculateBounds_",
            value: function() {
                var e = new google.maps.LatLngBounds(this.center_,this.center_);
                this.bounds_ = this.markerClusterer_.getExtendedBounds(e)
            }
        }, {
            key: "updateIcon_",
            value: function() {
                var e = this.markers_.length
                  , t = this.markerClusterer_.getMaxZoom();
                if (null !== t && this.map_.getZoom() > t)
                    this.clusterIcon_.hide();
                else if (e < this.minClusterSize_)
                    this.clusterIcon_.hide();
                else {
                    var i = this.markerClusterer_.getStyles().length
                      , s = this.markerClusterer_.getCalculator()(this.markers_, i);
                    this.clusterIcon_.setCenter(this.center_),
                    this.clusterIcon_.useStyle(s),
                    this.clusterIcon_.show()
                }
            }
        }, {
            key: "isMarkerAlreadyAdded_",
            value: function(e) {
                if (this.markers_.indexOf)
                    return -1 !== this.markers_.indexOf(e);
                for (var t = 0; t < this.markers_.length; t++)
                    if (e === this.markers_[t])
                        return !0;
                return !1
            }
        }]),
        t
    }()
      , c = function(e, t, i) {
        return void 0 !== e[t] ? e[t] : i
    }
      , _ = function(t) {
        function r(t) {
            var i, s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [], o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
            return e(this, r),
            (i = a(this, n(r).call(this))).options = o,
            i.markers_ = [],
            i.clusters_ = [],
            i.listeners_ = [],
            i.activeMap_ = null,
            i.ready_ = !1,
            i.ariaLabelFn = i.options.ariaLabelFn || function() {
                return ""
            }
            ,
            i.zIndex_ = i.options.zIndex || google.maps.Marker.MAX_ZINDEX + 1,
            i.gridSize_ = i.options.gridSize || 60,
            i.minClusterSize_ = i.options.minimumClusterSize || 2,
            i.maxZoom_ = i.options.maxZoom || null,
            i.styles_ = i.options.styles || [],
            i.title_ = i.options.title || "",
            i.zoomOnClick_ = c(i.options, "zoomOnClick", !0),
            i.averageCenter_ = c(i.options, "averageCenter", !1),
            i.ignoreHidden_ = c(i.options, "ignoreHidden", !1),
            i.enableRetinaIcons_ = c(i.options, "enableRetinaIcons", !1),
            i.imagePath_ = i.options.imagePath || r.IMAGE_PATH,
            i.imageExtension_ = i.options.imageExtension || r.IMAGE_EXTENSION,
            i.imageSizes_ = i.options.imageSizes || r.IMAGE_SIZES,
            i.calculator_ = i.options.calculator || r.CALCULATOR,
            i.batchSize_ = i.options.batchSize || r.BATCH_SIZE,
            i.batchSizeIE_ = i.options.batchSizeIE || r.BATCH_SIZE_IE,
            i.clusterClass_ = i.options.clusterClass || "cluster",
            -1 !== navigator.userAgent.toLowerCase().indexOf("msie") && (i.batchSize_ = i.batchSizeIE_),
            i.setupStyles_(),
            i.addMarkers(s, !0),
            i.setMap(t),
            i
        }
        return s(r, t),
        i(r, [{
            key: "onAdd",
            value: function() {
                var e = this;
                this.activeMap_ = this.getMap(),
                this.ready_ = !0,
                this.repaint(),
                this.prevZoom_ = this.getMap().getZoom(),
                this.listeners_ = [google.maps.event.addListener(this.getMap(), "zoom_changed", (function() {
                    var t = e.getMap()
                      , i = t.minZoom || 0
                      , s = Math.min(t.maxZoom || 100, t.mapTypes[t.getMapTypeId()].maxZoom)
                      , n = Math.min(Math.max(e.getMap().getZoom(), i), s);
                    e.prevZoom_ != n && (e.prevZoom_ = n,
                    e.resetViewport_(!1))
                }
                )), google.maps.event.addListener(this.getMap(), "idle", (function() {
                    e.redraw_()
                }
                ))]
            }
        }, {
            key: "onRemove",
            value: function() {
                for (var e = 0; e < this.markers_.length; e++)
                    this.markers_[e].getMap() !== this.activeMap_ && this.markers_[e].setMap(this.activeMap_);
                for (var t = 0; t < this.clusters_.length; t++)
                    this.clusters_[t].remove();
                this.clusters_ = [];
                for (var i = 0; i < this.listeners_.length; i++)
                    google.maps.event.removeListener(this.listeners_[i]);
                this.listeners_ = [],
                this.activeMap_ = null,
                this.ready_ = !1
            }
        }, {
            key: "draw",
            value: function() {}
        }, {
            key: "setupStyles_",
            value: function() {
                if (!(this.styles_.length > 0))
                    for (var e = 0; e < this.imageSizes_.length; e++) {
                        var t = this.imageSizes_[e];
                        this.styles_.push({
                            url: this.imagePath_ + (e + 1) + "." + this.imageExtension_,
                            height: t,
                            width: t
                        })
                    }
            }
        }, {
            key: "fitMapToMarkers",
            value: function() {
                for (var e = this.getMarkers(), t = new google.maps.LatLngBounds, i = 0; i < e.length; i++)
                    !e[i].getVisible() && this.getIgnoreHidden() || t.extend(e[i].getPosition());
                this.getMap().fitBounds(t)
            }
        }, {
            key: "getGridSize",
            value: function() {
                return this.gridSize_
            }
        }, {
            key: "setGridSize",
            value: function(e) {
                this.gridSize_ = e
            }
        }, {
            key: "getMinimumClusterSize",
            value: function() {
                return this.minClusterSize_
            }
        }, {
            key: "setMinimumClusterSize",
            value: function(e) {
                this.minClusterSize_ = e
            }
        }, {
            key: "getMaxZoom",
            value: function() {
                return this.maxZoom_
            }
        }, {
            key: "setMaxZoom",
            value: function(e) {
                this.maxZoom_ = e
            }
        }, {
            key: "getZIndex",
            value: function() {
                return this.zIndex_
            }
        }, {
            key: "setZIndex",
            value: function(e) {
                this.zIndex_ = e
            }
        }, {
            key: "getStyles",
            value: function() {
                return this.styles_
            }
        }, {
            key: "setStyles",
            value: function(e) {
                this.styles_ = e
            }
        }, {
            key: "getTitle",
            value: function() {
                return this.title_
            }
        }, {
            key: "setTitle",
            value: function(e) {
                this.title_ = e
            }
        }, {
            key: "getZoomOnClick",
            value: function() {
                return this.zoomOnClick_
            }
        }, {
            key: "setZoomOnClick",
            value: function(e) {
                this.zoomOnClick_ = e
            }
        }, {
            key: "getAverageCenter",
            value: function() {
                return this.averageCenter_
            }
        }, {
            key: "setAverageCenter",
            value: function(e) {
                this.averageCenter_ = e
            }
        }, {
            key: "getIgnoreHidden",
            value: function() {
                return this.ignoreHidden_
            }
        }, {
            key: "setIgnoreHidden",
            value: function(e) {
                this.ignoreHidden_ = e
            }
        }, {
            key: "getEnableRetinaIcons",
            value: function() {
                return this.enableRetinaIcons_
            }
        }, {
            key: "setEnableRetinaIcons",
            value: function(e) {
                this.enableRetinaIcons_ = e
            }
        }, {
            key: "getImageExtension",
            value: function() {
                return this.imageExtension_
            }
        }, {
            key: "setImageExtension",
            value: function(e) {
                this.imageExtension_ = e
            }
        }, {
            key: "getImagePath",
            value: function() {
                return this.imagePath_
            }
        }, {
            key: "setImagePath",
            value: function(e) {
                this.imagePath_ = e
            }
        }, {
            key: "getImageSizes",
            value: function() {
                return this.imageSizes_
            }
        }, {
            key: "setImageSizes",
            value: function(e) {
                this.imageSizes_ = e
            }
        }, {
            key: "getCalculator",
            value: function() {
                return this.calculator_
            }
        }, {
            key: "setCalculator",
            value: function(e) {
                this.calculator_ = e
            }
        }, {
            key: "getBatchSizeIE",
            value: function() {
                return this.batchSizeIE_
            }
        }, {
            key: "setBatchSizeIE",
            value: function(e) {
                this.batchSizeIE_ = e
            }
        }, {
            key: "getClusterClass",
            value: function() {
                return this.clusterClass_
            }
        }, {
            key: "setClusterClass",
            value: function(e) {
                this.clusterClass_ = e
            }
        }, {
            key: "getMarkers",
            value: function() {
                return this.markers_
            }
        }, {
            key: "getTotalMarkers",
            value: function() {
                return this.markers_.length
            }
        }, {
            key: "getClusters",
            value: function() {
                return this.clusters_
            }
        }, {
            key: "getTotalClusters",
            value: function() {
                return this.clusters_.length
            }
        }, {
            key: "addMarker",
            value: function(e, t) {
                this.pushMarkerTo_(e),
                t || this.redraw_()
            }
        }, {
            key: "addMarkers",
            value: function(e, t) {
                for (var i in e)
                    Object.prototype.hasOwnProperty.call(e, i) && this.pushMarkerTo_(e[i]);
                t || this.redraw_()
            }
        }, {
            key: "pushMarkerTo_",
            value: function(e) {
                var t = this;
                e.getDraggable() && google.maps.event.addListener(e, "dragend", (function() {
                    t.ready_ && (e.isAdded = !1,
                    t.repaint())
                }
                )),
                e.isAdded = !1,
                this.markers_.push(e)
            }
        }, {
            key: "removeMarker",
            value: function(e, t) {
                var i = this.removeMarker_(e);
                return !t && i && this.repaint(),
                i
            }
        }, {
            key: "removeMarkers",
            value: function(e, t) {
                for (var i = !1, s = 0; s < e.length; s++) {
                    var n = this.removeMarker_(e[s]);
                    i = i || n
                }
                return !t && i && this.repaint(),
                i
            }
        }, {
            key: "removeMarker_",
            value: function(e) {
                var t = -1;
                if (this.markers_.indexOf)
                    t = this.markers_.indexOf(e);
                else
                    for (var i = 0; i < this.markers_.length; i++)
                        if (e === this.markers_[i]) {
                            t = i;
                            break
                        }
                return -1 !== t && (e.setMap(null),
                this.markers_.splice(t, 1),
                !0)
            }
        }, {
            key: "clearMarkers",
            value: function() {
                this.resetViewport_(!0),
                this.markers_ = []
            }
        }, {
            key: "repaint",
            value: function() {
                var e = this.clusters_.slice();
                this.clusters_ = [],
                this.resetViewport_(!1),
                this.redraw_(),
                setTimeout((function() {
                    for (var t = 0; t < e.length; t++)
                        e[t].remove()
                }
                ), 0)
            }
        }, {
            key: "getExtendedBounds",
            value: function(e) {
                var t = this.getProjection()
                  , i = new google.maps.LatLng(e.getNorthEast().lat(),e.getNorthEast().lng())
                  , s = new google.maps.LatLng(e.getSouthWest().lat(),e.getSouthWest().lng())
                  , n = t.fromLatLngToDivPixel(i);
                n.x += this.gridSize_,
                n.y -= this.gridSize_;
                var r = t.fromLatLngToDivPixel(s);
                r.x -= this.gridSize_,
                r.y += this.gridSize_;
                var a = t.fromDivPixelToLatLng(n)
                  , o = t.fromDivPixelToLatLng(r);
                return e.extend(a),
                e.extend(o),
                e
            }
        }, {
            key: "redraw_",
            value: function() {
                this.createClusters_(0)
            }
        }, {
            key: "resetViewport_",
            value: function(e) {
                for (var t = 0; t < this.clusters_.length; t++)
                    this.clusters_[t].remove();
                this.clusters_ = [];
                for (var i = 0; i < this.markers_.length; i++) {
                    var s = this.markers_[i];
                    s.isAdded = !1,
                    e && s.setMap(null)
                }
            }
        }, {
            key: "distanceBetweenPoints_",
            value: function(e, t) {
                var i = (t.lat() - e.lat()) * Math.PI / 180
                  , s = (t.lng() - e.lng()) * Math.PI / 180
                  , n = Math.sin(i / 2) * Math.sin(i / 2) + Math.cos(e.lat() * Math.PI / 180) * Math.cos(t.lat() * Math.PI / 180) * Math.sin(s / 2) * Math.sin(s / 2);
                return 6371 * (2 * Math.atan2(Math.sqrt(n), Math.sqrt(1 - n)))
            }
        }, {
            key: "isMarkerInBounds_",
            value: function(e, t) {
                return t.contains(e.getPosition())
            }
        }, {
            key: "addToClosestCluster_",
            value: function(e) {
                for (var t = 4e4, i = null, s = 0; s < this.clusters_.length; s++) {
                    var n = this.clusters_[s]
                      , r = n.getCenter();
                    if (r) {
                        var a = this.distanceBetweenPoints_(r, e.getPosition());
                        a < t && (t = a,
                        i = n)
                    }
                }
                if (i && i.isMarkerInClusterBounds(e))
                    i.addMarker(e);
                else {
                    var o = new h(this);
                    o.addMarker(e),
                    this.clusters_.push(o)
                }
            }
        }, {
            key: "createClusters_",
            value: function(e) {
                var t = this;
                if (this.ready_) {
                    var i;
                    0 === e && (google.maps.event.trigger(this, "clusteringbegin", this),
                    void 0 !== this.timerRefStatic && (clearTimeout(this.timerRefStatic),
                    delete this.timerRefStatic)),
                    i = this.getMap().getZoom() > 3 ? new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(),this.getMap().getBounds().getNorthEast()) : new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472,-178.48388434375),new google.maps.LatLng(-85.08136444384544,178.00048865625));
                    for (var s = this.getExtendedBounds(i), n = Math.min(e + this.batchSize_, this.markers_.length), r = e; r < n; r++) {
                        var a = this.markers_[r];
                        !a.isAdded && this.isMarkerInBounds_(a, s) && (!this.ignoreHidden_ || this.ignoreHidden_ && a.getVisible()) && this.addToClosestCluster_(a)
                    }
                    n < this.markers_.length ? this.timerRefStatic = window.setTimeout((function() {
                        t.createClusters_(n)
                    }
                    ), 0) : (delete this.timerRefStatic,
                    google.maps.event.trigger(this, "clusteringend", this))
                }
            }
        }], [{
            key: "CALCULATOR",
            value: function(e, t) {
                for (var i = 0, s = e.length, n = s; 0 !== n; )
                    n = Math.floor(n / 10),
                    i++;
                return i = Math.min(i, t),
                {
                    text: s.toString(),
                    index: i,
                    title: ""
                }
            }
        }]),
        r
    }(l);
    return _.BATCH_SIZE = 2e3,
    _.BATCH_SIZE_IE = 500,
    _.IMAGE_PATH = "../images/m",
    _.IMAGE_EXTENSION = "png",
    _.IMAGE_SIZES = [53, 56, 66, 78, 90],
    _
}();
//# sourceMappingURL=markerclustererplus.min.js.map
function InfoBox() {
    google.maps.OverlayView.call(this)
}
InfoBox.prototype = new google.maps.OverlayView,
InfoBox.prototype.open = function(t) {
    this.latlng_ = t.latlng,
    this.map_ = t.map,
    this.html_ = t.html,
    this.offsetVertical_ = -240,
    this.offsetHorizontal_ = -35,
    this.height_ = 228,
    this.width_ = 227,
    this.number = t.number || !1,
    this.show = t.show || !1;
    var e = this;
    this.boundsChangedListener_ = google.maps.event.addListener(this.map_, "bounds_changed", function() {
        return e.panMap.apply(e)
    }),
    this.setMap(this.map_)
}
,
InfoBox.prototype.remove = function() {
    this.div_ && (this.div_.parentNode.removeChild(this.div_),
    this.div_ = null)
}
,
InfoBox.prototype.draw = function() {
    if (this.createElement(),
    this.div_) {
        var t = this.getProjection().fromLatLngToDivPixel(this.latlng_);
        t && (this.div_.style.width = this.width_ + "px",
        this.div_.style.left = t.x + this.offsetHorizontal_ + "px",
        this.div_.style.height = this.height_ + "px",
        this.div_.style.top = t.y + this.offsetVertical_ + "px",
        this.div_.style.display = "block",
        this.div_.className = "infoWindowWebcam",
        this.number && (this.span_.style.left = t.x + this.offsetHorizontal_ + 28 + "px",
        this.span_.style.top = t.y + this.offsetVertical_ + 212 + "px",
        this.span_.style.display = "block",
        this.span_.style.position = "absolute",
        this.span_.style.color = "#ffffff",
        this.span_.style.width = "15px",
        this.span_.style.height = "15px",
        this.span_.className = "number",
        this.span_.style.textAlign = "center"))
    }
}
,
InfoBox.prototype.createElement = function() {
    var t, e = this.getPanes(), s = this.div_, i = this.span_;
    this.number && (i || ((i = this.span_ = document.createElement("span")).innerHTML = "0",
    i.className = "number",
    e.floatPane.appendChild(i)));
    if (s)
        s.parentNode != e.floatPane && (s.parentNode.removeChild(s),
        e.floatPane.appendChild(s));
    else {
        (s = this.div_ = document.createElement("div")).style.border = "0px none",
        s.style.position = "absolute",
        s.style.width = this.width_ + "px",
        s.style.height = this.height_ + "px";
        var n = document.createElement("div");
        n.className = "inner",
        n.innerHTML = this.html_;
        var o = document.createElement("img");
        o.style.width = "32px",
        o.style.height = "32px",
        o.style.cursor = "pointer",
        o.style.position = "absolute",
        o.style.right = "7px",
        o.style.top = "2px",
        o.src = "http://gmaps-samples.googlecode.com/svn/trunk/images/closebigger.gif",
        n.appendChild(o),
        google.maps.event.addDomListener(o, "click", (t = this,
        function() {
            t.setMap(null)
        }
        )),
        s.appendChild(n),
        s.style.display = "none",
        e.floatPane.appendChild(s),
        this.panMap()
    }
}
,
InfoBox.prototype.panMap = function() {
    var t = this.map_
      , e = t.getBounds();
    if (e) {
        var s = this.latlng_
          , i = this.width_
          , n = this.height_
          , o = this.offsetHorizontal_
          , a = this.offsetVertical_
          , h = t.getDiv()
          , l = h.offsetWidth
          , p = h.offsetHeight
          , r = e.toSpan()
          , d = r.lng() / l
          , g = r.lat() / p
          , f = e.getSouthWest().lng()
          , _ = e.getNorthEast().lng()
          , m = e.getNorthEast().lat()
          , c = e.getSouthWest().lat()
          , y = s.lng() + (o - 0) * d
          , u = s.lng() + (o + i + 0) * d
          , v = s.lat() - (a - 0) * g
          , x = s.lat() - (a + n + 0) * g
          , b = (y < f ? f - y : 0) + (_ < u ? _ - u : 0)
          , w = (m < v ? m - v : 0) + (x < c ? c - x : 0)
          , C = t.getCenter()
          , L = C.lng() - b
          , N = C.lat() - w;
        t.setCenter(new google.maps.LatLng(N,L)),
        google.maps.event.removeListener(this.boundsChangedListener_),
        this.boundsChangedListener_ = null
    }
}
;
function createMap(r, e, n, o, a) {
    return new google.maps.Map(document.getElementById(r),{
        center: new google.maps.LatLng(e,n),
        zoom: o,
        mapTypeId: a
    })
}
function createMarker(r, e, n, o, a, t) {
    var i = customIcons[o] || {}
      , s = new google.maps.LatLng(r,e);
    if (marker = new google.maps.Marker({
        position: s,
        map: n,
        draggable: !1,
        icon: i.icon
    }),
    "" != a && bindInfoWindow(marker, n, infoWindow, a),
    addMarker(marker, o),
    "" != a) {
        new google.maps.InfoWindow;
        google.maps.event.addListener(marker, "spider_format", function(r) {
            r == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED && infoWindow.close()
        }),
        google.maps.event.addListener(marker, "spider_click", function(r) {})
    }
    t.addMarker(marker),
    bounds.extend(s)
}
function createCustomMarker(r, e, n, o, a, t) {
    var i = customIcons[o] || {}
      , s = new google.maps.LatLng(r,e);
    marker = new google.maps.Marker({
        position: s,
        map: n,
        draggable: !1,
        icon: i.icon
    }),
    "" != a && customInfoWindow(marker, n, a, t),
    addMarker(marker, o),
    bounds.extend(s)
}
function openMarker(r, e, n) {
    infoBox.open({
        latlng: r.getPosition(),
        map: e,
        html: n,
        number: !1,
        show: !0
    })
}
function customInfoWindow(r, e, n, o) {
    google.maps.event.addListener(r, "click", function() {
        infoBox.open({
            latlng: r.getPosition(),
            map: e,
            html: n,
            number: !1,
            show: o
        })
    })
}
function bindInfoWindow(r, e, n, o) {
    google.maps.event.addListener(r, "click", function() {
        n.setContent(o),
        n.open(e, r)
    })
}
function hideMarkers(r) {
    if (infoWindow && infoWindow.close(),
    markersArray)
        for (i = 0; i < markersArray.length; i++)
            markersArray[i].type == r && markersArray[i].marker.setVisible(!1)
}
function showMarkers(r, e) {
    if (markersArray)
        for (i = 0; i < markersArray.length; i++)
            markersArray[i].type == r && markersArray[i].marker.setVisible(!0)
}
function addMarker(r, e) {
    if (markersArray) {
        var n = new Object;
        n.marker = r,
        n.type = e,
        markersArray.push(n),
        markersClu.push(r)
    }
}
function initialize(r, e, n, o, a) {
    var t = {
        zoom: n,
        center: new google.maps.LatLng(r,e),
        mapTypeId: o
    };
    return map = new google.maps.Map(document.getElementById(a),t)
}
function readOptions(jsonStr) {
    var jsonObj = eval("(" + jsonStr + ")");
    return {
        zoom: parseInt(jsonObj.zoom),
        center: new google.maps.LatLng(jsonObj.lat,jsonObj.lng),
        mapTypeId: jsonObj.mapTypeId,
        scrollwheel: !1
    }
}
var map = null
  , infoWindow = new google.maps.InfoWindow
  , infoBox = new InfoBox
  , markersArray = new Array
  , markersClu = new Array
  , bounds = new google.maps.LatLngBounds;
function craeteGMap(googleMapId, startPoint, contacts, showInfoWindow, defaultMarker, markerClusterer) {
    var showInfoWindow = void 0 === showInfoWindow || showInfoWindow
      , defaultMarker = void 0 === defaultMarker || defaultMarker
      , markerClusterer = void 0 !== markerClusterer && markerClusterer;
    bounds = new google.maps.LatLngBounds,
    markersClu = new Array;
    var mapOptions = readOptions(startPoint)
      , map = new google.maps.Map(document.getElementById(googleMapId),mapOptions)
      , oms = new OverlappingMarkerSpiderfier(map,{
        keepSpiderfied: !0,
        circleFootSeparation: 50,
        markersWontMove: !0,
        markersWontHide: !0,
        basicFormatEvents: !0
    });
    isBrowserMobile() && (showInfowindow = !1);
    for (var i = 0; i < contacts.length; i++)
        jsonStr = contacts[i].jsonStr,
        jsonObj = eval("(" + jsonStr + ")"),
        html = showInfoWindow ? contacts[i].html : "",
        defaultMarker ? createMarker(jsonObj.lat, jsonObj.lng, map, contacts[i].icon, html, oms) : createCustomMarker(jsonObj.lat, jsonObj.lng, map, contacts[i].icon, html, showInfoWindow);
    if (1 < contacts.length && map.fitBounds(bounds),
    markerClusterer)
        var markerClusterer = new MarkerClusterer(map,markersClu,mcOptions)
}
function readGoogleMapPoint(r) {
    if (returnStr = "{",
    0 <= r.indexOf("http")) {
        for (aString = r.split("/"),
        i = 0; i < aString.length; i++) {
            if (0 <= aString[i].indexOf("@")) {
                var e = aString[i].replace("@", "").replace("z", "").split(",");
                1 < e.length && (returnStr += '"lat":"' + e[0] + '",',
                returnStr += '"lng":"' + e[1] + '",'),
                2 < e.length && (returnStr += '"zoom":"' + e[2] + '",')
            }
            0 <= aString[i].indexOf("place") && (returnStr += '"address":"' + aString[i + 1].replace("+", "") + '",')
        }
        return returnStr += '"mapTypeId":"roadmap"}',
        returnStr
    }
    return r
}
/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
!function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
}(function(a) {
    var b, c, d, e, f, g, h = "Close", i = "BeforeClose", j = "AfterClose", k = "BeforeAppend", l = "MarkupParse", m = "Open", n = "Change", o = "mfp", p = "." + o, q = "mfp-ready", r = "mfp-removing", s = "mfp-prevent-close", t = function() {}, u = !!window.jQuery, v = a(window), w = function(a, c) {
        b.ev.on(o + a + p, c)
    }, x = function(b, c, d, e) {
        var f = document.createElement("div");
        return f.className = "mfp-" + b,
        d && (f.innerHTML = d),
        e ? c && c.appendChild(f) : (f = a(f),
        c && f.appendTo(c)),
        f
    }, y = function(c, d) {
        b.ev.triggerHandler(o + c, d),
        b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1),
        b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d]))
    }, z = function(c) {
        return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)),
        g = c),
        b.currTemplate.closeBtn
    }, A = function() {
        a.magnificPopup.instance || (b = new t,
        b.init(),
        a.magnificPopup.instance = b)
    }, B = function() {
        var a = document.createElement("p").style
          , b = ["ms", "O", "Moz", "Webkit"];
        if (void 0 !== a.transition)
            return !0;
        for (; b.length; )
            if (b.pop() + "Transition"in a)
                return !0;
        return !1
    };
    t.prototype = {
        constructor: t,
        init: function() {
            var c = navigator.appVersion;
            b.isLowIE = b.isIE8 = document.all && !document.addEventListener,
            b.isAndroid = /android/gi.test(c),
            b.isIOS = /iphone|ipad|ipod/gi.test(c),
            b.supportsTransition = B(),
            b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),
            d = a(document),
            b.popupsCache = {}
        },
        open: function(c) {
            var e;
            if (c.isObj === !1) {
                b.items = c.items.toArray(),
                b.index = 0;
                var g, h = c.items;
                for (e = 0; e < h.length; e++)
                    if (g = h[e],
                    g.parsed && (g = g.el[0]),
                    g === c.el[0]) {
                        b.index = e;
                        break
                    }
            } else
                b.items = a.isArray(c.items) ? c.items : [c.items],
                b.index = c.index || 0;
            if (b.isOpen)
                return void b.updateItemHTML();
            b.types = [],
            f = "",
            c.mainEl && c.mainEl.length ? b.ev = c.mainEl.eq(0) : b.ev = d,
            c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}),
            b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {},
            b.st = a.extend(!0, {}, a.magnificPopup.defaults, c),
            b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos,
            b.st.modal && (b.st.closeOnContentClick = !1,
            b.st.closeOnBgClick = !1,
            b.st.showCloseBtn = !1,
            b.st.enableEscapeKey = !1),
            b.bgOverlay || (b.bgOverlay = x("bg").on("click" + p, function() {
                b.close()
            }),
            b.wrap = x("wrap").attr("tabindex", -1).on("click" + p, function(a) {
                b._checkIfClose(a.target) && b.close()
            }),
            b.container = x("container", b.wrap)),
            b.contentContainer = x("content"),
            b.st.preloader && (b.preloader = x("preloader", b.container, b.st.tLoading));
            var i = a.magnificPopup.modules;
            for (e = 0; e < i.length; e++) {
                var j = i[e];
                j = j.charAt(0).toUpperCase() + j.slice(1),
                b["init" + j].call(b)
            }
            y("BeforeOpen"),
            b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, function(a, b, c, d) {
                c.close_replaceWith = z(d.type)
            }),
            f += " mfp-close-btn-in") : b.wrap.append(z())),
            b.st.alignTop && (f += " mfp-align-top"),
            b.fixedContentPos ? b.wrap.css({
                overflow: b.st.overflowY,
                overflowX: "hidden",
                overflowY: b.st.overflowY
            }) : b.wrap.css({
                top: v.scrollTop(),
                position: "absolute"
            }),
            (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({
                height: d.height(),
                position: "absolute"
            }),
            b.st.enableEscapeKey && d.on("keyup" + p, function(a) {
                27 === a.keyCode && b.close()
            }),
            v.on("resize" + p, function() {
                b.updateSize()
            }),
            b.st.closeOnContentClick || (f += " mfp-auto-cursor"),
            f && b.wrap.addClass(f);
            var k = b.wH = v.height()
              , n = {};
            if (b.fixedContentPos && b._hasScrollBar(k)) {
                var o = b._getScrollbarSize();
                o && (n.marginRight = o)
            }
            b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : n.overflow = "hidden");
            var r = b.st.mainClass;
            return b.isIE7 && (r += " mfp-ie7"),
            r && b._addClassToMFP(r),
            b.updateItemHTML(),
            y("BuildControls"),
            a("html").css(n),
            b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)),
            b._lastFocusedEl = document.activeElement,
            setTimeout(function() {
                b.content ? (b._addClassToMFP(q),
                b._setFocus()) : b.bgOverlay.addClass(q),
                d.on("focusin" + p, b._onFocusIn)
            }, 16),
            b.isOpen = !0,
            b.updateSize(k),
            y(m),
            c
        },
        close: function() {
            b.isOpen && (y(i),
            b.isOpen = !1,
            b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r),
            setTimeout(function() {
                b._close()
            }, b.st.removalDelay)) : b._close())
        },
        _close: function() {
            y(h);
            var c = r + " " + q + " ";
            if (b.bgOverlay.detach(),
            b.wrap.detach(),
            b.container.empty(),
            b.st.mainClass && (c += b.st.mainClass + " "),
            b._removeClassFromMFP(c),
            b.fixedContentPos) {
                var e = {
                    marginRight: ""
                };
                b.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "",
                a("html").css(e)
            }
            d.off("keyup" + p + " focusin" + p),
            b.ev.off(p),
            b.wrap.attr("class", "mfp-wrap").removeAttr("style"),
            b.bgOverlay.attr("class", "mfp-bg"),
            b.container.attr("class", "mfp-container"),
            !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(),
            b.st.autoFocusLast && b._lastFocusedEl && a(b._lastFocusedEl).focus(),
            b.currItem = null,
            b.content = null,
            b.currTemplate = null,
            b.prevHeight = 0,
            y(j)
        },
        updateSize: function(a) {
            if (b.isIOS) {
                var c = document.documentElement.clientWidth / window.innerWidth
                  , d = window.innerHeight * c;
                b.wrap.css("height", d),
                b.wH = d
            } else
                b.wH = a || v.height();
            b.fixedContentPos || b.wrap.css("height", b.wH),
            y("Resize")
        },
        updateItemHTML: function() {
            var c = b.items[b.index];
            b.contentContainer.detach(),
            b.content && b.content.detach(),
            c.parsed || (c = b.parseEl(b.index));
            var d = c.type;
            if (y("BeforeChange", [b.currItem ? b.currItem.type : "", d]),
            b.currItem = c,
            !b.currTemplate[d]) {
                var f = b.st[d] ? b.st[d].markup : !1;
                y("FirstMarkupParse", f),
                f ? b.currTemplate[d] = a(f) : b.currTemplate[d] = !0
            }
            e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder");
            var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]);
            b.appendContent(g, d),
            c.preloaded = !0,
            y(n, c),
            e = c.type,
            b.container.prepend(b.contentContainer),
            y("AfterChange")
        },
        appendContent: function(a, c) {
            b.content = a,
            a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find(".mfp-close").length || b.content.append(z()) : b.content = a : b.content = "",
            y(k),
            b.container.addClass("mfp-" + c + "-holder"),
            b.contentContainer.append(b.content)
        },
        parseEl: function(c) {
            var d, e = b.items[c];
            if (e.tagName ? e = {
                el: a(e)
            } : (d = e.type,
            e = {
                data: e,
                src: e.src
            }),
            e.el) {
                for (var f = b.types, g = 0; g < f.length; g++)
                    if (e.el.hasClass("mfp-" + f[g])) {
                        d = f[g];
                        break
                    }
                e.src = e.el.attr("data-mfp-src"),
                e.src || (e.src = e.el.attr("href"))
            }
            return e.type = d || b.st.type || "inline",
            e.index = c,
            e.parsed = !0,
            b.items[c] = e,
            y("ElementParse", e),
            b.items[c]
        },
        addGroup: function(a, c) {
            var d = function(d) {
                d.mfpEl = this,
                b._openClick(d, a, c)
            };
            c || (c = {});
            var e = "click.magnificPopup";
            c.mainEl = a,
            c.items ? (c.isObj = !0,
            a.off(e).on(e, d)) : (c.isObj = !1,
            c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a,
            a.off(e).on(e, d)))
        },
        _openClick: function(c, d, e) {
            var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
            if (f || !(2 === c.which || c.ctrlKey || c.metaKey || c.altKey || c.shiftKey)) {
                var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn;
                if (g)
                    if (a.isFunction(g)) {
                        if (!g.call(b))
                            return !0
                    } else if (v.width() < g)
                        return !0;
                c.type && (c.preventDefault(),
                b.isOpen && c.stopPropagation()),
                e.el = a(c.mfpEl),
                e.delegate && (e.items = d.find(e.delegate)),
                b.open(e)
            }
        },
        updateStatus: function(a, d) {
            if (b.preloader) {
                c !== a && b.container.removeClass("mfp-s-" + c),
                d || "loading" !== a || (d = b.st.tLoading);
                var e = {
                    status: a,
                    text: d
                };
                y("UpdateStatus", e),
                a = e.status,
                d = e.text,
                b.preloader.html(d),
                b.preloader.find("a").on("click", function(a) {
                    a.stopImmediatePropagation()
                }),
                b.container.addClass("mfp-s-" + a),
                c = a
            }
        },
        _checkIfClose: function(c) {
            if (!a(c).hasClass(s)) {
                var d = b.st.closeOnContentClick
                  , e = b.st.closeOnBgClick;
                if (d && e)
                    return !0;
                if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[0])
                    return !0;
                if (c === b.content[0] || a.contains(b.content[0], c)) {
                    if (d)
                        return !0
                } else if (e && a.contains(document, c))
                    return !0;
                return !1
            }
        },
        _addClassToMFP: function(a) {
            b.bgOverlay.addClass(a),
            b.wrap.addClass(a)
        },
        _removeClassFromMFP: function(a) {
            this.bgOverlay.removeClass(a),
            b.wrap.removeClass(a)
        },
        _hasScrollBar: function(a) {
            return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height())
        },
        _setFocus: function() {
            (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus()
        },
        _onFocusIn: function(c) {
            return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (b._setFocus(),
            !1)
        },
        _parseMarkup: function(b, c, d) {
            var e;
            d.data && (c = a.extend(d.data, c)),
            y(l, [b, c, d]),
            a.each(c, function(c, d) {
                if (void 0 === d || d === !1)
                    return !0;
                if (e = c.split("_"),
                e.length > 1) {
                    var f = b.find(p + "-" + e[0]);
                    if (f.length > 0) {
                        var g = e[1];
                        "replaceWith" === g ? f[0] !== d[0] && f.replaceWith(d) : "img" === g ? f.is("img") ? f.attr("src", d) : f.replaceWith(a("<img>").attr("src", d).attr("class", f.attr("class"))) : f.attr(e[1], d)
                    }
                } else
                    b.find(p + "-" + c).html(d)
            })
        },
        _getScrollbarSize: function() {
            if (void 0 === b.scrollbarSize) {
                var a = document.createElement("div");
                a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",
                document.body.appendChild(a),
                b.scrollbarSize = a.offsetWidth - a.clientWidth,
                document.body.removeChild(a)
            }
            return b.scrollbarSize
        }
    },
    a.magnificPopup = {
        instance: null,
        proto: t.prototype,
        modules: [],
        open: function(b, c) {
            return A(),
            b = b ? a.extend(!0, {}, b) : {},
            b.isObj = !0,
            b.index = c || 0,
            this.instance.open(b)
        },
        close: function() {
            return a.magnificPopup.instance && a.magnificPopup.instance.close()
        },
        registerModule: function(b, c) {
            c.options && (a.magnificPopup.defaults[b] = c.options),
            a.extend(this.proto, c.proto),
            this.modules.push(b)
        },
        defaults: {
            disableOn: 0,
            key: null,
            midClick: !1,
            mainClass: "",
            preloader: !0,
            focus: "",
            closeOnContentClick: !1,
            closeOnBgClick: !0,
            closeBtnInside: !0,
            showCloseBtn: !0,
            enableEscapeKey: !0,
            modal: !1,
            alignTop: !1,
            removalDelay: 0,
            prependTo: null,
            fixedContentPos: "auto",
            fixedBgPos: "auto",
            overflowY: "auto",
            closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
            tClose: "Close (Esc)",
            tLoading: "Loading...",
            autoFocusLast: !0
        }
    },
    a.fn.magnificPopup = function(c) {
        A();
        var d = a(this);
        if ("string" == typeof c)
            if ("open" === c) {
                var e, f = u ? d.data("magnificPopup") : d[0].magnificPopup, g = parseInt(arguments[1], 10) || 0;
                f.items ? e = f.items[g] : (e = d,
                f.delegate && (e = e.find(f.delegate)),
                e = e.eq(g)),
                b._openClick({
                    mfpEl: e
                }, d, f)
            } else
                b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1));
        else
            c = a.extend(!0, {}, c),
            u ? d.data("magnificPopup", c) : d[0].magnificPopup = c,
            b.addGroup(d, c);
        return d
    }
    ;
    var C, D, E, F = "inline", G = function() {
        E && (D.after(E.addClass(C)).detach(),
        E = null)
    };
    a.magnificPopup.registerModule(F, {
        options: {
            hiddenClass: "hide",
            markup: "",
            tNotFound: "Content not found"
        },
        proto: {
            initInline: function() {
                b.types.push(F),
                w(h + "." + F, function() {
                    G()
                })
            },
            getInline: function(c, d) {
                if (G(),
                c.src) {
                    var e = b.st.inline
                      , f = a(c.src);
                    if (f.length) {
                        var g = f[0].parentNode;
                        g && g.tagName && (D || (C = e.hiddenClass,
                        D = x(C),
                        C = "mfp-" + C),
                        E = f.after(D).detach().removeClass(C)),
                        b.updateStatus("ready")
                    } else
                        b.updateStatus("error", e.tNotFound),
                        f = a("<div>");
                    return c.inlineElement = f,
                    f
                }
                return b.updateStatus("ready"),
                b._parseMarkup(d, {}, c),
                d
            }
        }
    });
    var H, I = "ajax", J = function() {
        H && a(document.body).removeClass(H)
    }, K = function() {
        J(),
        b.req && b.req.abort()
    };
    a.magnificPopup.registerModule(I, {
        options: {
            settings: null,
            cursor: "mfp-ajax-cur",
            tError: '<a href="%url%">The content</a> could not be loaded.'
        },
        proto: {
            initAjax: function() {
                b.types.push(I),
                H = b.st.ajax.cursor,
                w(h + "." + I, K),
                w("BeforeChange." + I, K)
            },
            getAjax: function(c) {
                H && a(document.body).addClass(H),
                b.updateStatus("loading");
                var d = a.extend({
                    url: c.src,
                    success: function(d, e, f) {
                        var g = {
                            data: d,
                            xhr: f
                        };
                        y("ParseAjax", g),
                        b.appendContent(a(g.data), I),
                        c.finished = !0,
                        J(),
                        b._setFocus(),
                        setTimeout(function() {
                            b.wrap.addClass(q)
                        }, 16),
                        b.updateStatus("ready"),
                        y("AjaxContentAdded")
                    },
                    error: function() {
                        J(),
                        c.finished = c.loadError = !0,
                        b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src))
                    }
                }, b.st.ajax.settings);
                return b.req = a.ajax(d),
                ""
            }
        }
    });
    var L, M = function(c) {
        if (c.data && void 0 !== c.data.title)
            return c.data.title;
        var d = b.st.image.titleSrc;
        if (d) {
            if (a.isFunction(d))
                return d.call(b, c);
            if (c.el)
                return c.el.attr(d) || ""
        }
        return ""
    };
    a.magnificPopup.registerModule("image", {
        options: {
            markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
            cursor: "mfp-zoom-out-cur",
            titleSrc: "title",
            verticalFit: !0,
            tError: '<a href="%url%">The image</a> could not be loaded.'
        },
        proto: {
            initImage: function() {
                var c = b.st.image
                  , d = ".image";
                b.types.push("image"),
                w(m + d, function() {
                    "image" === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor)
                }),
                w(h + d, function() {
                    c.cursor && a(document.body).removeClass(c.cursor),
                    v.off("resize" + p)
                }),
                w("Resize" + d, b.resizeImage),
                b.isLowIE && w("AfterChange", b.resizeImage)
            },
            resizeImage: function() {
                var a = b.currItem;
                if (a && a.img && b.st.image.verticalFit) {
                    var c = 0;
                    b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)),
                    a.img.css("max-height", b.wH - c)
                }
            },
            _onImageHasSize: function(a) {
                a.img && (a.hasSize = !0,
                L && clearInterval(L),
                a.isCheckingImgSize = !1,
                y("ImageHasSize", a),
                a.imgHidden && (b.content && b.content.removeClass("mfp-loading"),
                a.imgHidden = !1))
            },
            findImageSize: function(a) {
                var c = 0
                  , d = a.img[0]
                  , e = function(f) {
                    L && clearInterval(L),
                    L = setInterval(function() {
                        return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L),
                        c++,
                        void (3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500)))
                    }, f)
                };
                e(1)
            },
            getImage: function(c, d) {
                var e = 0
                  , f = function() {
                    c && (c.img[0].complete ? (c.img.off(".mfploader"),
                    c === b.currItem && (b._onImageHasSize(c),
                    b.updateStatus("ready")),
                    c.hasSize = !0,
                    c.loaded = !0,
                    y("ImageLoadComplete")) : (e++,
                    200 > e ? setTimeout(f, 100) : g()))
                }
                  , g = function() {
                    c && (c.img.off(".mfploader"),
                    c === b.currItem && (b._onImageHasSize(c),
                    b.updateStatus("error", h.tError.replace("%url%", c.src))),
                    c.hasSize = !0,
                    c.loaded = !0,
                    c.loadError = !0)
                }
                  , h = b.st.image
                  , i = d.find(".mfp-img");
                if (i.length) {
                    var j = document.createElement("img");
                    j.className = "mfp-img",
                    c.el && c.el.find("img").length && (j.alt = c.el.find("img").attr("alt")),
                    c.img = a(j).on("load.mfploader", f).on("error.mfploader", g),
                    j.src = c.src,
                    i.is("img") && (c.img = c.img.clone()),
                    j = c.img[0],
                    j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1)
                }
                return b._parseMarkup(d, {
                    title: M(c),
                    img_replaceWith: c.img
                }, c),
                b.resizeImage(),
                c.hasSize ? (L && clearInterval(L),
                c.loadError ? (d.addClass("mfp-loading"),
                b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"),
                b.updateStatus("ready")),
                d) : (b.updateStatus("loading"),
                c.loading = !0,
                c.hasSize || (c.imgHidden = !0,
                d.addClass("mfp-loading"),
                b.findImageSize(c)),
                d)
            }
        }
    });
    var N, O = function() {
        return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform),
        N
    };
    a.magnificPopup.registerModule("zoom", {
        options: {
            enabled: !1,
            easing: "ease-in-out",
            duration: 300,
            opener: function(a) {
                return a.is("img") ? a : a.find("img")
            }
        },
        proto: {
            initZoom: function() {
                var a, c = b.st.zoom, d = ".zoom";
                if (c.enabled && b.supportsTransition) {
                    var e, f, g = c.duration, j = function(a) {
                        var b = a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image")
                          , d = "all " + c.duration / 1e3 + "s " + c.easing
                          , e = {
                            position: "fixed",
                            zIndex: 9999,
                            left: 0,
                            top: 0,
                            "-webkit-backface-visibility": "hidden"
                        }
                          , f = "transition";
                        return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d,
                        b.css(e),
                        b
                    }, k = function() {
                        b.content.css("visibility", "visible")
                    };
                    w("BuildControls" + d, function() {
                        if (b._allowZoom()) {
                            if (clearTimeout(e),
                            b.content.css("visibility", "hidden"),
                            a = b._getItemToZoom(),
                            !a)
                                return void k();
                            f = j(a),
                            f.css(b._getOffset()),
                            b.wrap.append(f),
                            e = setTimeout(function() {
                                f.css(b._getOffset(!0)),
                                e = setTimeout(function() {
                                    k(),
                                    setTimeout(function() {
                                        f.remove(),
                                        a = f = null,
                                        y("ZoomAnimationEnded")
                                    }, 16)
                                }, g)
                            }, 16)
                        }
                    }),
                    w(i + d, function() {
                        if (b._allowZoom()) {
                            if (clearTimeout(e),
                            b.st.removalDelay = g,
                            !a) {
                                if (a = b._getItemToZoom(),
                                !a)
                                    return;
                                f = j(a)
                            }
                            f.css(b._getOffset(!0)),
                            b.wrap.append(f),
                            b.content.css("visibility", "hidden"),
                            setTimeout(function() {
                                f.css(b._getOffset())
                            }, 16)
                        }
                    }),
                    w(h + d, function() {
                        b._allowZoom() && (k(),
                        f && f.remove(),
                        a = null)
                    })
                }
            },
            _allowZoom: function() {
                return "image" === b.currItem.type
            },
            _getItemToZoom: function() {
                return b.currItem.hasSize ? b.currItem.img : !1
            },
            _getOffset: function(c) {
                var d;
                d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
                var e = d.offset()
                  , f = parseInt(d.css("padding-top"), 10)
                  , g = parseInt(d.css("padding-bottom"), 10);
                e.top -= a(window).scrollTop() - f;
                var h = {
                    width: d.width(),
                    height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f
                };
                return O() ? h["-moz-transform"] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left,
                h.top = e.top),
                h
            }
        }
    });
    var P = "iframe"
      , Q = "//about:blank"
      , R = function(a) {
        if (b.currTemplate[P]) {
            var c = b.currTemplate[P].find("iframe");
            c.length && (a || (c[0].src = Q),
            b.isIE8 && c.css("display", a ? "block" : "none"))
        }
    };
    a.magnificPopup.registerModule(P, {
        options: {
            markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
            srcAction: "iframe_src",
            patterns: {
                youtube: {
                    index: "youtube.com",
                    id: "v=",
                    src: "//www.youtube.com/embed/%id%?autoplay=1"
                },
                vimeo: {
                    index: "vimeo.com/",
                    id: "/",
                    src: "//player.vimeo.com/video/%id%?autoplay=1"
                },
                gmaps: {
                    index: "//maps.google.",
                    src: "%id%&output=embed"
                }
            }
        },
        proto: {
            initIframe: function() {
                b.types.push(P),
                w("BeforeChange", function(a, b, c) {
                    b !== c && (b === P ? R() : c === P && R(!0))
                }),
                w(h + "." + P, function() {
                    R()
                })
            },
            getIframe: function(c, d) {
                var e = c.src
                  , f = b.st.iframe;
                a.each(f.patterns, function() {
                    return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)),
                    e = this.src.replace("%id%", e),
                    !1) : void 0
                });
                var g = {};
                return f.srcAction && (g[f.srcAction] = e),
                b._parseMarkup(d, g, c),
                b.updateStatus("ready"),
                d
            }
        }
    });
    var S = function(a) {
        var c = b.items.length;
        return a > c - 1 ? a - c : 0 > a ? c + a : a
    }
      , T = function(a, b, c) {
        return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c)
    };
    a.magnificPopup.registerModule("gallery", {
        options: {
            enabled: !1,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            preload: [0, 2],
            navigateByImgClick: !0,
            arrows: !0,
            tPrev: "Previous (Left arrow key)",
            tNext: "Next (Right arrow key)",
            tCounter: "%curr% of %total%"
        },
        proto: {
            initGallery: function() {
                var c = b.st.gallery
                  , e = ".mfp-gallery";
                return b.direction = !0,
                c && c.enabled ? (f += " mfp-gallery",
                w(m + e, function() {
                    c.navigateByImgClick && b.wrap.on("click" + e, ".mfp-img", function() {
                        return b.items.length > 1 ? (b.next(),
                        !1) : void 0
                    }),
                    d.on("keydown" + e, function(a) {
                        37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next()
                    })
                }),
                w("UpdateStatus" + e, function(a, c) {
                    c.text && (c.text = T(c.text, b.currItem.index, b.items.length))
                }),
                w(l + e, function(a, d, e, f) {
                    var g = b.items.length;
                    e.counter = g > 1 ? T(c.tCounter, f.index, g) : ""
                }),
                w("BuildControls" + e, function() {
                    if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
                        var d = c.arrowMarkup
                          , e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(s)
                          , f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(s);
                        e.click(function() {
                            b.prev()
                        }),
                        f.click(function() {
                            b.next()
                        }),
                        b.container.append(e.add(f))
                    }
                }),
                w(n + e, function() {
                    b._preloadTimeout && clearTimeout(b._preloadTimeout),
                    b._preloadTimeout = setTimeout(function() {
                        b.preloadNearbyImages(),
                        b._preloadTimeout = null
                    }, 16)
                }),
                void w(h + e, function() {
                    d.off(e),
                    b.wrap.off("click" + e),
                    b.arrowRight = b.arrowLeft = null
                })) : !1
            },
            next: function() {
                b.direction = !0,
                b.index = S(b.index + 1),
                b.updateItemHTML()
            },
            prev: function() {
                b.direction = !1,
                b.index = S(b.index - 1),
                b.updateItemHTML()
            },
            goTo: function(a) {
                b.direction = a >= b.index,
                b.index = a,
                b.updateItemHTML()
            },
            preloadNearbyImages: function() {
                var a, c = b.st.gallery.preload, d = Math.min(c[0], b.items.length), e = Math.min(c[1], b.items.length);
                for (a = 1; a <= (b.direction ? e : d); a++)
                    b._preloadItem(b.index + a);
                for (a = 1; a <= (b.direction ? d : e); a++)
                    b._preloadItem(b.index - a)
            },
            _preloadItem: function(c) {
                if (c = S(c),
                !b.items[c].preloaded) {
                    var d = b.items[c];
                    d.parsed || (d = b.parseEl(c)),
                    y("LazyLoad", d),
                    "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", function() {
                        d.hasSize = !0
                    }).on("error.mfploader", function() {
                        d.hasSize = !0,
                        d.loadError = !0,
                        y("LazyLoadError", d)
                    }).attr("src", d.src)),
                    d.preloaded = !0
                }
            }
        }
    });
    var U = "retina";
    a.magnificPopup.registerModule(U, {
        options: {
            replaceSrc: function(a) {
                return a.src.replace(/\.\w+$/, function(a) {
                    return "@2x" + a
                })
            },
            ratio: 1
        },
        proto: {
            initRetina: function() {
                if (window.devicePixelRatio > 1) {
                    var a = b.st.retina
                      , c = a.ratio;
                    c = isNaN(c) ? c() : c,
                    c > 1 && (w("ImageHasSize." + U, function(a, b) {
                        b.img.css({
                            "max-width": b.img[0].naturalWidth / c,
                            width: "100%"
                        })
                    }),
                    w("ElementParse." + U, function(b, d) {
                        d.src = a.replaceSrc(d, c)
                    }))
                }
            }
        }
    }),
    A()
});
!function(t, e, i) {
    function n(t) {
        return t.replace(/\s*$/, "")
    }
    function s(t, e) {
        if (t.innerText)
            t.innerText = e;
        else if (t.nodeValue)
            t.nodeValue = e;
        else {
            if (!t.textContent)
                return !1;
            t.textContent = e
        }
    }
    function o(t, e, i, n) {
        var o, h = t.parent();
        t.remove();
        var r = i ? i.length : 0;
        if (h.contents().length > r)
            return o = h.contents().eq(-1 - r),
            a(o, e, i, n);
        var l = h.prev();
        return o = l.contents().eq(-1),
        !!o.length && (s(o[0], o.text() + n.ellipsis),
        h.remove(),
        i.length && l.append(i),
        !0)
    }
    function h(t, e, i, h) {
        for (var r, l, a = t[0], p = t.text(), d = "", c = 0, u = p.length; c <= u; )
            r = c + (u - c >> 1),
            l = h.ellipsis + n(p.substr(r - 1, p.length)),
            s(a, l),
            e.height() > h.maxHeight ? c = r + 1 : (u = r - 1,
            d = d.length > l.length ? d : l);
        return d.length > 0 ? (s(a, d),
        !0) : o(t, e, i, h)
    }
    function r(t, e, i, h) {
        for (var r, l, a = t[0], p = t.text(), d = "", c = 0, u = p.length; c <= u; )
            r = c + (u - c >> 1),
            l = n(p.substr(0, r + 1)) + h.ellipsis,
            s(a, l),
            e.height() > h.maxHeight ? u = r - 1 : (c = r + 1,
            d = d.length > l.length ? d : l);
        return d.length > 0 ? (s(a, d),
        !0) : o(t, e, i, h)
    }
    function l(t, e, i, h) {
        for (var r, l, a = t[0], p = t.text(), d = "", c = 0, u = p.length, g = u >> 1; c <= g; )
            r = c + (g - c >> 1),
            l = n(p.substr(0, r)) + h.ellipsis + p.substr(u - r, u - r),
            s(a, l),
            e.height() > h.maxHeight ? g = r - 1 : (c = r + 1,
            d = d.length > l.length ? d : l);
        return d.length > 0 ? (s(a, d),
        !0) : o(t, e, i, h)
    }
    function a(t, e, i, n) {
        return "end" === n.position ? r(t, e, i, n) : "start" === n.position ? h(t, e, i, n) : l(t, e, i, n)
    }
    function p(t, i, n, s) {
        var o, h, r = t[0], l = t.contents(), p = l.length, d = p - 1, u = !1;
        for (t.empty(); d >= 0 && !u; d--)
            o = l.eq(d),
            h = o[0],
            8 !== h.nodeType && (r.insertBefore(h, r.firstChild),
            n.length && (e.inArray(r.tagName.toLowerCase(), g) >= 0 ? t.after(n) : t.append(n)),
            i.height() > s.maxHeight && (u = 3 === h.nodeType ? a(o, i, n, s) : c(o, i, n, s)),
            !u && n.length && n.remove());
        return u
    }
    function d(t, i, n, s) {
        var o, h, r = t[0], l = t.contents(), p = 0, d = l.length, u = !1;
        for (t.empty(); p < d && !u; p++)
            o = l.eq(p),
            h = o[0],
            8 !== h.nodeType && (r.appendChild(h),
            n.length && (e.inArray(r.tagName.toLowerCase(), g) >= 0 ? t.after(n) : t.append(n)),
            i.height() > s.maxHeight && (u = 3 === h.nodeType ? a(o, i, n, s) : c(o, i, n, s)),
            !u && n.length && n.remove());
        return u
    }
    function c(t, e, i, n) {
        return "end" === n.position ? d(t, e, i, n) : "start" === n.position ? p(t, e, i, n) : d(t, e, i, n)
    }
    function u(t, i) {
        this.element = t,
        this.$element = e(t),
        this._name = "truncate",
        this._defaults = {
            lines: 1,
            ellipsis: "…",
            showMore: "",
            showLess: "",
            position: "end",
            lineHeight: "auto"
        },
        this.config(i),
        this.original = this.cached = t.innerHTML,
        this.isTruncated = !1,
        this.isCollapsed = !0,
        this.update()
    }
    var g = ["table", "thead", "tbody", "tfoot", "tr", "col", "colgroup", "object", "embed", "param", "ol", "ul", "dl", "blockquote", "select", "optgroup", "option", "textarea", "script", "style"];
    u.prototype = {
        config: function(t) {
            if (this.options = e.extend({}, this._defaults, t),
            "auto" === this.options.lineHeight) {
                var n = this.$element.css("line-height")
                  , s = 18;
                "normal" !== n && (s = parseInt(n, 10)),
                this.options.lineHeight = s
            }
            this.options.maxHeight === i && (this.options.maxHeight = parseInt(this.options.lines, 10) * parseInt(this.options.lineHeight, 10)),
            "start" !== this.options.position && "middle" !== this.options.position && "end" !== this.options.position && (this.options.position = "end"),
            this.$clipNode = e(e.parseHTML(this.options.showMore), this.$element),
            this.original && this.update()
        },
        update: function(t) {
            var e = !this.isCollapsed;
            "undefined" != typeof t ? this.original = this.element.innerHTML = t : this.isCollapsed && this.element.innerHTML === this.cached && (this.element.innerHTML = this.original);
            var i = this.$element.wrapInner("<div/>").children();
            i.css({
                border: "none",
                margin: 0,
                padding: 0,
                width: "auto",
                height: "auto",
                "word-wrap": "break-word"
            }),
            this.isTruncated = !1,
            i.height() > this.options.maxHeight ? (this.isTruncated = c(i, i, this.$clipNode, this.options),
            this.isExplicitlyCollapsed && (this.isCollapsed = !0,
            e = !1)) : this.isCollapsed = !1,
            i.replaceWith(i.contents()),
            this.cached = this.element.innerHTML,
            e && (this.element.innerHTML = this.original)
        },
        expand: function() {
            var t = !0;
            this.isExplicitlyCollapsed && (this.isExplicitlyCollapsed = !1,
            t = !1),
            this.isCollapsed && (this.isCollapsed = !1,
            this.element.innerHTML = this.isTruncated ? this.original + (t ? this.options.showLess : "") : this.original)
        },
        collapse: function(t) {
            this.isExplicitlyCollapsed = !0,
            this.isCollapsed || (this.isCollapsed = !0,
            t = t || !1,
            t ? this.update() : this.element.innerHTML = this.cached)
        }
    },
    e.fn.truncate = function(t) {
        var i = e.makeArray(arguments).slice(1);
        return this.each(function() {
            var n = e.data(this, "jquery-truncate");
            n ? "function" == typeof n[t] && n[t].apply(n, i) : e.data(this, "jquery-truncate", new u(this,t))
        })
    }
    ,
    t.Truncate = u
}(this, jQuery);
/*! lazysizes - v5.3.2 */

!function(e, t) {
    var r;
    e && (r = function() {
        t(e.lazySizes),
        e.removeEventListener("lazyunveilread", r, !0)
    }
    ,
    t = t.bind(null, e, e.document),
    "object" == typeof module && module.exports ? t(require("lazysizes")) : "function" == typeof define && define.amd ? define(["lazysizes"], t) : e.lazySizes ? r() : e.addEventListener("lazyunveilread", r, !0))
}("undefined" != typeof window ? window : 0, function(d, n, p) {
    "use strict";
    var i, a, s, l, t, r, f, o, c, m, u, y = p.cfg, e = n.createElement("img"), g = "sizes"in e && "srcset"in e, h = /\s+\d+h/g, z = (a = /\s+(\d+)(w|h)\s+(\d+)(w|h)/,
    s = Array.prototype.forEach,
    function() {
        function r(e) {
            var t, r, i = e.getAttribute(y.srcsetAttr);
            i && (r = i.match(a)) && ((t = "w" == r[2] ? r[1] / r[3] : r[3] / r[1]) && e.setAttribute("data-aspectratio", t),
            e.setAttribute(y.srcsetAttr, i.replace(h, "")))
        }
        function e(e) {
            var t;
            e.detail.instance == p && ((t = e.target.parentNode) && "PICTURE" == t.nodeName && s.call(t.getElementsByTagName("source"), r),
            r(e.target))
        }
        function t() {
            i.currentSrc && n.removeEventListener("lazybeforeunveil", e)
        }
        var i = n.createElement("img");
        n.addEventListener("lazybeforeunveil", e),
        i.onload = t,
        i.onerror = t,
        i.srcset = "data:,a 1w 1h",
        i.complete && t()
    }
    );
    function v(e, t) {
        return e.w - t.w
    }
    function w(e, t, r, i) {
        l.push({
            c: t,
            u: r,
            w: +i
        })
    }
    function b(e, t) {
        var r, i = e.getAttribute("srcset") || e.getAttribute(y.srcsetAttr);
        !i && t && (i = e._lazypolyfill ? e._lazypolyfill._set : e.getAttribute(y.srcAttr) || e.getAttribute("src")),
        e._lazypolyfill && e._lazypolyfill._set == i || (r = o(i || ""),
        t && e.parentNode && (r.isPicture = "PICTURE" == e.parentNode.nodeName.toUpperCase(),
        r.isPicture && d.matchMedia && (p.aC(e, "lazymatchmedia"),
        c())),
        r._set = i,
        Object.defineProperty(e, "_lazypolyfill", {
            value: r,
            writable: !0
        }))
    }
    function A(e) {
        var t, r, i, n, a, s, l, o, c, u = e;
        if (b(u, !0),
        (n = u._lazypolyfill).isPicture)
            for (r = 0,
            i = (t = e.parentNode.getElementsByTagName("source")).length; r < i; r++)
                if (y.supportsType(t[r].getAttribute("type"), e) && m(t[r].getAttribute("media"))) {
                    u = t[r],
                    b(u),
                    n = u._lazypolyfill;
                    break
                }
        return 1 < n.length ? (s = u.getAttribute("sizes") || "",
        s = f.test(s) && parseInt(s, 10) || p.gW(e, e.parentNode),
        n.d = (l = e,
        o = d.devicePixelRatio || 1,
        c = p.getX && p.getX(l),
        Math.min(c || o, 2.5, o)),
        !n.src || !n.w || n.w < s ? (n.w = s,
        a = function(e) {
            for (var t, r, i = e.length, n = e[i - 1], a = 0; a < i; a++)
                if ((n = e[a]).d = n.w / e.w,
                n.d >= e.d) {
                    !n.cached && (t = e[a - 1]) && t.d > e.d - .13 * Math.pow(e.d, 2.2) && (r = Math.pow(t.d - .6, 1.6),
                    t.cached && (t.d += .15 * r),
                    t.d + (n.d - e.d) * r > e.d && (n = t));
                    break
                }
            return n
        }(n.sort(v)),
        n.src = a) : a = n.src) : a = n[0],
        a
    }
    function E(e) {
        var t;
        g && e.parentNode && "PICTURE" != e.parentNode.nodeName.toUpperCase() || (t = A(e)) && t.u && e._lazypolyfill.cur != t.u && (e._lazypolyfill.cur = t.u,
        t.cached = !0,
        e.setAttribute(y.srcAttr, t.u),
        e.setAttribute("src", t.u))
    }
    y.supportsType || (y.supportsType = function(e) {
        return !e
    }
    ),
    d.HTMLPictureElement && g ? !p.hasHDescriptorFix && n.msElementsFromPoint && (p.hasHDescriptorFix = !0,
    z()) : d.picturefill || y.pf || (y.pf = function(e) {
        var t, r;
        if (!d.picturefill)
            for (t = 0,
            r = e.elements.length; t < r; t++)
                i(e.elements[t])
    }
    ,
    f = /^\s*\d+\.*\d*px\s*$/,
    t = /(([^,\s].[^\s]+)\s+(\d+)w)/g,
    r = /\s/,
    c = function() {
        var e, r;
        function t() {
            for (var e = 0, t = r.length; e < t; e++)
                i(r[e])
        }
        c.init || (c.init = !0,
        addEventListener("resize", (r = n.getElementsByClassName("lazymatchmedia"),
        function() {
            clearTimeout(e),
            e = setTimeout(t, 66)
        }
        )))
    }
    ,
    m = function(e) {
        return d.matchMedia ? (m = function(e) {
            return !e || (matchMedia(e) || {}).matches
        }
        )(e) : !e
    }
    ,
    E.parse = o = function(e) {
        return l = [],
        (e = e.trim()).replace(h, "").replace(t, w),
        l.length || !e || r.test(e) || l.push({
            c: e,
            u: e,
            w: 99
        }),
        l
    }
    ,
    i = E,
    y.loadedClass && y.loadingClass && (u = [],
    ['img[sizes$="px"][srcset].', "picture > img:not([srcset])."].forEach(function(e) {
        u.push(e + y.loadedClass),
        u.push(e + y.loadingClass)
    }),
    y.pf({
        elements: n.querySelectorAll(u.join(", "))
    })))
});
/*! lazysizes - v5.3.2 */

!function(e, t) {
    var a = function() {
        t(e.lazySizes),
        e.removeEventListener("lazyunveilread", a, !0)
    };
    t = t.bind(null, e, e.document),
    "object" == typeof module && module.exports ? t(require("lazysizes")) : "function" == typeof define && define.amd ? define(["lazysizes"], t) : e.lazySizes ? a() : e.addEventListener("lazyunveilread", a, !0)
}(window, function(e, z, c) {
    "use strict";
    var g, y, b, f, r, l, s, v, m;
    e.addEventListener && (g = c.cfg,
    y = /\s+/g,
    b = /\s*\|\s+|\s+\|\s*/g,
    f = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/,
    r = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/,
    l = /\(|\)|'/,
    s = {
        contain: 1,
        cover: 1
    },
    v = function(e, t) {
        var a;
        t && ((a = t.match(r)) && a[1] ? e.setAttribute("type", a[1]) : e.setAttribute("media", g.customMedia[t] || t))
    }
    ,
    m = function(e) {
        var t, a, r, i, s;
        e.target._lazybgset && (a = (t = e.target)._lazybgset,
        (r = t.currentSrc || t.src) && (i = l.test(r) ? JSON.stringify(r) : r,
        (s = c.fire(a, "bgsetproxy", {
            src: r,
            useSrc: i,
            fullSrc: null
        })).defaultPrevented || (a.style.backgroundImage = s.detail.fullSrc || "url(" + s.detail.useSrc + ")")),
        t._lazybgsetLoading && (c.fire(a, "_lazyloaded", {}, !1, !0),
        delete t._lazybgsetLoading))
    }
    ,
    addEventListener("lazybeforeunveil", function(e) {
        var t, a, r, i, s, l, n, d, u, o;
        !e.defaultPrevented && (t = e.target.getAttribute("data-bgset")) && (u = e.target,
        (o = z.createElement("img")).alt = "",
        o._lazybgsetLoading = !0,
        e.detail.firesLoad = !0,
        a = t,
        r = u,
        i = o,
        s = z.createElement("picture"),
        l = r.getAttribute(g.sizesAttr),
        n = r.getAttribute("data-ratio"),
        d = r.getAttribute("data-optimumx"),
        r._lazybgset && r._lazybgset.parentNode == r && r.removeChild(r._lazybgset),
        Object.defineProperty(i, "_lazybgset", {
            value: r,
            writable: !0
        }),
        Object.defineProperty(r, "_lazybgset", {
            value: s,
            writable: !0
        }),
        a = a.replace(y, " ").split(b),
        s.style.display = "none",
        i.className = g.lazyClass,
        1 != a.length || l || (l = "auto"),
        a.forEach(function(e) {
            var t, a = z.createElement("source");
            l && "auto" != l && a.setAttribute("sizes", l),
            (t = e.match(f)) ? (a.setAttribute(g.srcsetAttr, t[1]),
            v(a, t[2]),
            v(a, t[3])) : a.setAttribute(g.srcsetAttr, e),
            s.appendChild(a)
        }),
        l && (i.setAttribute(g.sizesAttr, l),
        r.removeAttribute(g.sizesAttr),
        r.removeAttribute("sizes")),
        d && i.setAttribute("data-optimumx", d),
        n && i.setAttribute("data-ratio", n),
        s.appendChild(i),
        r.appendChild(s),
        setTimeout(function() {
            c.loader.unveil(o),
            c.rAF(function() {
                c.fire(o, "_lazyloaded", {}, !0, !0),
                o.complete && m({
                    target: o
                })
            })
        }))
    }),
    z.addEventListener("load", m, !0),
    e.addEventListener("lazybeforesizes", function(e) {
        var t, a, r, i;
        e.detail.instance == c && e.target._lazybgset && e.detail.dataAttr && (t = e.target._lazybgset,
        r = t,
        i = (getComputedStyle(r) || {
            getPropertyValue: function() {}
        }).getPropertyValue("background-size"),
        !s[i] && s[r.style.backgroundSize] && (i = r.style.backgroundSize),
        s[a = i] && (e.target._lazysizesParentFit = a,
        c.rAF(function() {
            e.target.setAttribute("data-parent-fit", a),
            e.target._lazysizesParentFit && delete e.target._lazysizesParentFit
        })))
    }, !0),
    z.documentElement.addEventListener("lazybeforesizes", function(e) {
        var t, a;
        !e.defaultPrevented && e.target._lazybgset && e.detail.instance == c && (e.detail.width = (t = e.target._lazybgset,
        a = c.gW(t, t.parentNode),
        (!t._lazysizesWidth || a > t._lazysizesWidth) && (t._lazysizesWidth = a),
        t._lazysizesWidth))
    }))
});
/*! lazysizes - v5.3.2 */

!function(e) {
    var t = function(u, D, f) {
        "use strict";
        var k, H;
        if (function() {
            var e;
            var t = {
                lazyClass: "lazyload",
                loadedClass: "lazyloaded",
                loadingClass: "lazyloading",
                preloadClass: "lazypreload",
                errorClass: "lazyerror",
                autosizesClass: "lazyautosizes",
                fastLoadedClass: "ls-is-cached",
                iframeLoadMode: 0,
                srcAttr: "data-src",
                srcsetAttr: "data-srcset",
                sizesAttr: "data-sizes",
                minSize: 40,
                customMedia: {},
                init: true,
                expFactor: 1.5,
                hFac: .8,
                loadMode: 2,
                loadHidden: true,
                ricTimeout: 0,
                throttleDelay: 125
            };
            H = u.lazySizesConfig || u.lazysizesConfig || {};
            for (e in t) {
                if (!(e in H)) {
                    H[e] = t[e]
                }
            }
        }(),
        !D || !D.getElementsByClassName) {
            return {
                init: function() {},
                cfg: H,
                noSupport: true
            }
        }
        var O = D.documentElement
          , i = u.HTMLPictureElement
          , P = "addEventListener"
          , $ = "getAttribute"
          , q = u[P].bind(u)
          , I = u.setTimeout
          , U = u.requestAnimationFrame || I
          , o = u.requestIdleCallback
          , j = /^picture$/i
          , r = ["load", "error", "lazyincluded", "_lazyloaded"]
          , a = {}
          , G = Array.prototype.forEach
          , J = function(e, t) {
            if (!a[t]) {
                a[t] = new RegExp("(\\s|^)" + t + "(\\s|$)")
            }
            return a[t].test(e[$]("class") || "") && a[t]
        }
          , K = function(e, t) {
            if (!J(e, t)) {
                e.setAttribute("class", (e[$]("class") || "").trim() + " " + t)
            }
        }
          , Q = function(e, t) {
            var a;
            if (a = J(e, t)) {
                e.setAttribute("class", (e[$]("class") || "").replace(a, " "))
            }
        }
          , V = function(t, a, e) {
            var i = e ? P : "removeEventListener";
            if (e) {
                V(t, a)
            }
            r.forEach(function(e) {
                t[i](e, a)
            })
        }
          , X = function(e, t, a, i, r) {
            var n = D.createEvent("Event");
            if (!a) {
                a = {}
            }
            a.instance = k;
            n.initEvent(t, !i, !r);
            n.detail = a;
            e.dispatchEvent(n);
            return n
        }
          , Y = function(e, t) {
            var a;
            if (!i && (a = u.picturefill || H.pf)) {
                if (t && t.src && !e[$]("srcset")) {
                    e.setAttribute("srcset", t.src)
                }
                a({
                    reevaluate: true,
                    elements: [e]
                })
            } else if (t && t.src) {
                e.src = t.src
            }
        }
          , Z = function(e, t) {
            return (getComputedStyle(e, null) || {})[t]
        }
          , s = function(e, t, a) {
            a = a || e.offsetWidth;
            while (a < H.minSize && t && !e._lazysizesWidth) {
                a = t.offsetWidth;
                t = t.parentNode
            }
            return a
        }
          , ee = function() {
            var a, i;
            var t = [];
            var r = [];
            var n = t;
            var s = function() {
                var e = n;
                n = t.length ? r : t;
                a = true;
                i = false;
                while (e.length) {
                    e.shift()()
                }
                a = false
            };
            var e = function(e, t) {
                if (a && !t) {
                    e.apply(this, arguments)
                } else {
                    n.push(e);
                    if (!i) {
                        i = true;
                        (D.hidden ? I : U)(s)
                    }
                }
            };
            e._lsFlush = s;
            return e
        }()
          , te = function(a, e) {
            return e ? function() {
                ee(a)
            }
            : function() {
                var e = this;
                var t = arguments;
                ee(function() {
                    a.apply(e, t)
                })
            }
        }
          , ae = function(e) {
            var a;
            var i = 0;
            var r = H.throttleDelay;
            var n = H.ricTimeout;
            var t = function() {
                a = false;
                i = f.now();
                e()
            };
            var s = o && n > 49 ? function() {
                o(t, {
                    timeout: n
                });
                if (n !== H.ricTimeout) {
                    n = H.ricTimeout
                }
            }
            : te(function() {
                I(t)
            }, true);
            return function(e) {
                var t;
                if (e = e === true) {
                    n = 33
                }
                if (a) {
                    return
                }
                a = true;
                t = r - (f.now() - i);
                if (t < 0) {
                    t = 0
                }
                if (e || t < 9) {
                    s()
                } else {
                    I(s, t)
                }
            }
        }
          , ie = function(e) {
            var t, a;
            var i = 99;
            var r = function() {
                t = null;
                e()
            };
            var n = function() {
                var e = f.now() - a;
                if (e < i) {
                    I(n, i - e)
                } else {
                    (o || r)(r)
                }
            };
            return function() {
                a = f.now();
                if (!t) {
                    t = I(n, i)
                }
            }
        }
          , e = function() {
            var v, m, c, h, e;
            var y, z, g, p, C, b, A;
            var n = /^img$/i;
            var d = /^iframe$/i;
            var E = "onscroll"in u && !/(gle|ing)bot/.test(navigator.userAgent);
            var _ = 0;
            var w = 0;
            var M = 0;
            var N = -1;
            var L = function(e) {
                M--;
                if (!e || M < 0 || !e.target) {
                    M = 0
                }
            };
            var x = function(e) {
                if (A == null) {
                    A = Z(D.body, "visibility") == "hidden"
                }
                return A || !(Z(e.parentNode, "visibility") == "hidden" && Z(e, "visibility") == "hidden")
            };
            var W = function(e, t) {
                var a;
                var i = e;
                var r = x(e);
                g -= t;
                b += t;
                p -= t;
                C += t;
                while (r && (i = i.offsetParent) && i != D.body && i != O) {
                    r = (Z(i, "opacity") || 1) > 0;
                    if (r && Z(i, "overflow") != "visible") {
                        a = i.getBoundingClientRect();
                        r = C > a.left && p < a.right && b > a.top - 1 && g < a.bottom + 1
                    }
                }
                return r
            };
            var t = function() {
                var e, t, a, i, r, n, s, o, l, u, f, c;
                var d = k.elements;
                if ((h = H.loadMode) && M < 8 && (e = d.length)) {
                    t = 0;
                    N++;
                    for (; t < e; t++) {
                        if (!d[t] || d[t]._lazyRace) {
                            continue
                        }
                        if (!E || k.prematureUnveil && k.prematureUnveil(d[t])) {
                            R(d[t]);
                            continue
                        }
                        if (!(o = d[t][$]("data-expand")) || !(n = o * 1)) {
                            n = w
                        }
                        if (!u) {
                            u = !H.expand || H.expand < 1 ? O.clientHeight > 500 && O.clientWidth > 500 ? 500 : 370 : H.expand;
                            k._defEx = u;
                            f = u * H.expFactor;
                            c = H.hFac;
                            A = null;
                            if (w < f && M < 1 && N > 2 && h > 2 && !D.hidden) {
                                w = f;
                                N = 0
                            } else if (h > 1 && N > 1 && M < 6) {
                                w = u
                            } else {
                                w = _
                            }
                        }
                        if (l !== n) {
                            y = innerWidth + n * c;
                            z = innerHeight + n;
                            s = n * -1;
                            l = n
                        }
                        a = d[t].getBoundingClientRect();
                        if ((b = a.bottom) >= s && (g = a.top) <= z && (C = a.right) >= s * c && (p = a.left) <= y && (b || C || p || g) && (H.loadHidden || x(d[t])) && (m && M < 3 && !o && (h < 3 || N < 4) || W(d[t], n))) {
                            R(d[t]);
                            r = true;
                            if (M > 9) {
                                break
                            }
                        } else if (!r && m && !i && M < 4 && N < 4 && h > 2 && (v[0] || H.preloadAfterLoad) && (v[0] || !o && (b || C || p || g || d[t][$](H.sizesAttr) != "auto"))) {
                            i = v[0] || d[t]
                        }
                    }
                    if (i && !r) {
                        R(i)
                    }
                }
            };
            var a = ae(t);
            var S = function(e) {
                var t = e.target;
                if (t._lazyCache) {
                    delete t._lazyCache;
                    return
                }
                L(e);
                K(t, H.loadedClass);
                Q(t, H.loadingClass);
                V(t, B);
                X(t, "lazyloaded")
            };
            var i = te(S);
            var B = function(e) {
                i({
                    target: e.target
                })
            };
            var T = function(e, t) {
                var a = e.getAttribute("data-load-mode") || H.iframeLoadMode;
                if (a == 0) {
                    e.contentWindow.location.replace(t)
                } else if (a == 1) {
                    e.src = t
                }
            };
            var F = function(e) {
                var t;
                var a = e[$](H.srcsetAttr);
                if (t = H.customMedia[e[$]("data-media") || e[$]("media")]) {
                    e.setAttribute("media", t)
                }
                if (a) {
                    e.setAttribute("srcset", a)
                }
            };
            var s = te(function(t, e, a, i, r) {
                var n, s, o, l, u, f;
                if (!(u = X(t, "lazybeforeunveil", e)).defaultPrevented) {
                    if (i) {
                        if (a) {
                            K(t, H.autosizesClass)
                        } else {
                            t.setAttribute("sizes", i)
                        }
                    }
                    s = t[$](H.srcsetAttr);
                    n = t[$](H.srcAttr);
                    if (r) {
                        o = t.parentNode;
                        l = o && j.test(o.nodeName || "")
                    }
                    f = e.firesLoad || "src"in t && (s || n || l);
                    u = {
                        target: t
                    };
                    K(t, H.loadingClass);
                    if (f) {
                        clearTimeout(c);
                        c = I(L, 2500);
                        V(t, B, true)
                    }
                    if (l) {
                        G.call(o.getElementsByTagName("source"), F)
                    }
                    if (s) {
                        t.setAttribute("srcset", s)
                    } else if (n && !l) {
                        if (d.test(t.nodeName)) {
                            T(t, n)
                        } else {
                            t.src = n
                        }
                    }
                    if (r && (s || l)) {
                        Y(t, {
                            src: n
                        })
                    }
                }
                if (t._lazyRace) {
                    delete t._lazyRace
                }
                Q(t, H.lazyClass);
                ee(function() {
                    var e = t.complete && t.naturalWidth > 1;
                    if (!f || e) {
                        if (e) {
                            K(t, H.fastLoadedClass)
                        }
                        S(u);
                        t._lazyCache = true;
                        I(function() {
                            if ("_lazyCache"in t) {
                                delete t._lazyCache
                            }
                        }, 9)
                    }
                    if (t.loading == "lazy") {
                        M--
                    }
                }, true)
            });
            var R = function(e) {
                if (e._lazyRace) {
                    return
                }
                var t;
                var a = n.test(e.nodeName);
                var i = a && (e[$](H.sizesAttr) || e[$]("sizes"));
                var r = i == "auto";
                if ((r || !m) && a && (e[$]("src") || e.srcset) && !e.complete && !J(e, H.errorClass) && J(e, H.lazyClass)) {
                    return
                }
                t = X(e, "lazyunveilread").detail;
                if (r) {
                    re.updateElem(e, true, e.offsetWidth)
                }
                e._lazyRace = true;
                M++;
                s(e, t, r, i, a)
            };
            var r = ie(function() {
                H.loadMode = 3;
                a()
            });
            var o = function() {
                if (H.loadMode == 3) {
                    H.loadMode = 2
                }
                r()
            };
            var l = function() {
                if (m) {
                    return
                }
                if (f.now() - e < 999) {
                    I(l, 999);
                    return
                }
                m = true;
                H.loadMode = 3;
                a();
                q("scroll", o, true)
            };
            return {
                _: function() {
                    e = f.now();
                    k.elements = D.getElementsByClassName(H.lazyClass);
                    v = D.getElementsByClassName(H.lazyClass + " " + H.preloadClass);
                    q("scroll", a, true);
                    q("resize", a, true);
                    q("pageshow", function(e) {
                        if (e.persisted) {
                            var t = D.querySelectorAll("." + H.loadingClass);
                            if (t.length && t.forEach) {
                                U(function() {
                                    t.forEach(function(e) {
                                        if (e.complete) {
                                            R(e)
                                        }
                                    })
                                })
                            }
                        }
                    });
                    if (u.MutationObserver) {
                        new MutationObserver(a).observe(O, {
                            childList: true,
                            subtree: true,
                            attributes: true
                        })
                    } else {
                        O[P]("DOMNodeInserted", a, true);
                        O[P]("DOMAttrModified", a, true);
                        setInterval(a, 999)
                    }
                    q("hashchange", a, true);
                    ["focus", "mouseover", "click", "load", "transitionend", "animationend"].forEach(function(e) {
                        D[P](e, a, true)
                    });
                    if (/d$|^c/.test(D.readyState)) {
                        l()
                    } else {
                        q("load", l);
                        D[P]("DOMContentLoaded", a);
                        I(l, 2e4)
                    }
                    if (k.elements.length) {
                        t();
                        ee._lsFlush()
                    } else {
                        a()
                    }
                },
                checkElems: a,
                unveil: R,
                _aLSL: o
            }
        }()
          , re = function() {
            var a;
            var n = te(function(e, t, a, i) {
                var r, n, s;
                e._lazysizesWidth = i;
                i += "px";
                e.setAttribute("sizes", i);
                if (j.test(t.nodeName || "")) {
                    r = t.getElementsByTagName("source");
                    for (n = 0,
                    s = r.length; n < s; n++) {
                        r[n].setAttribute("sizes", i)
                    }
                }
                if (!a.detail.dataAttr) {
                    Y(e, a.detail)
                }
            });
            var i = function(e, t, a) {
                var i;
                var r = e.parentNode;
                if (r) {
                    a = s(e, r, a);
                    i = X(e, "lazybeforesizes", {
                        width: a,
                        dataAttr: !!t
                    });
                    if (!i.defaultPrevented) {
                        a = i.detail.width;
                        if (a && a !== e._lazysizesWidth) {
                            n(e, r, i, a)
                        }
                    }
                }
            };
            var e = function() {
                var e;
                var t = a.length;
                if (t) {
                    e = 0;
                    for (; e < t; e++) {
                        i(a[e])
                    }
                }
            };
            var t = ie(e);
            return {
                _: function() {
                    a = D.getElementsByClassName(H.autosizesClass);
                    q("resize", t)
                },
                checkElems: t,
                updateElem: i
            }
        }()
          , t = function() {
            if (!t.i && D.getElementsByClassName) {
                t.i = true;
                re._();
                e._()
            }
        };
        return I(function() {
            H.init && t()
        }),
        k = {
            cfg: H,
            autoSizer: re,
            loader: e,
            init: t,
            uP: Y,
            aC: K,
            rC: Q,
            hC: J,
            fire: X,
            gW: s,
            rAF: ee
        }
    }(e, e.document, Date);
    e.lazySizes = t,
    "object" == typeof module && module.exports && (module.exports = t)
}("undefined" != typeof window ? window : {});
/**
 * Swiper 8.1.0
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2022 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: April 8, 2022
 */

!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Swiper = t()
}(this, (function() {
    "use strict";
    function e(e) {
        return null !== e && "object" == typeof e && "constructor"in e && e.constructor === Object
    }
    function t(s, a) {
        void 0 === s && (s = {}),
        void 0 === a && (a = {}),
        Object.keys(a).forEach((i=>{
            void 0 === s[i] ? s[i] = a[i] : e(a[i]) && e(s[i]) && Object.keys(a[i]).length > 0 && t(s[i], a[i])
        }
        ))
    }
    const s = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector: ()=>null,
        querySelectorAll: ()=>[],
        getElementById: ()=>null,
        createEvent: ()=>({
            initEvent() {}
        }),
        createElement: ()=>({
            children: [],
            childNodes: [],
            style: {},
            setAttribute() {},
            getElementsByTagName: ()=>[]
        }),
        createElementNS: ()=>({}),
        importNode: ()=>null,
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function a() {
        const e = "undefined" != typeof document ? document : {};
        return t(e, s),
        e
    }
    const i = {
        document: s,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function() {
            return this
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle: ()=>({
            getPropertyValue: ()=>""
        }),
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia: ()=>({}),
        requestAnimationFrame: e=>"undefined" == typeof setTimeout ? (e(),
        null) : setTimeout(e, 0),
        cancelAnimationFrame(e) {
            "undefined" != typeof setTimeout && clearTimeout(e)
        }
    };
    function r() {
        const e = "undefined" != typeof window ? window : {};
        return t(e, i),
        e
    }
    class n extends Array {
        constructor(e) {
            "number" == typeof e ? super(e) : (super(...e || []),
            function(e) {
                const t = e.__proto__;
                Object.defineProperty(e, "__proto__", {
                    get: ()=>t,
                    set(e) {
                        t.__proto__ = e
                    }
                })
            }(this))
        }
    }
    function l(e) {
        void 0 === e && (e = []);
        const t = [];
        return e.forEach((e=>{
            Array.isArray(e) ? t.push(...l(e)) : t.push(e)
        }
        )),
        t
    }
    function o(e, t) {
        return Array.prototype.filter.call(e, t)
    }
    function d(e, t) {
        const s = r()
          , i = a();
        let l = [];
        if (!t && e instanceof n)
            return e;
        if (!e)
            return new n(l);
        if ("string" == typeof e) {
            const s = e.trim();
            if (s.indexOf("<") >= 0 && s.indexOf(">") >= 0) {
                let e = "div";
                0 === s.indexOf("<li") && (e = "ul"),
                0 === s.indexOf("<tr") && (e = "tbody"),
                0 !== s.indexOf("<td") && 0 !== s.indexOf("<th") || (e = "tr"),
                0 === s.indexOf("<tbody") && (e = "table"),
                0 === s.indexOf("<option") && (e = "select");
                const t = i.createElement(e);
                t.innerHTML = s;
                for (let e = 0; e < t.childNodes.length; e += 1)
                    l.push(t.childNodes[e])
            } else
                l = function(e, t) {
                    if ("string" != typeof e)
                        return [e];
                    const s = []
                      , a = t.querySelectorAll(e);
                    for (let e = 0; e < a.length; e += 1)
                        s.push(a[e]);
                    return s
                }(e.trim(), t || i)
        } else if (e.nodeType || e === s || e === i)
            l.push(e);
        else if (Array.isArray(e)) {
            if (e instanceof n)
                return e;
            l = e
        }
        return new n(function(e) {
            const t = [];
            for (let s = 0; s < e.length; s += 1)
                -1 === t.indexOf(e[s]) && t.push(e[s]);
            return t
        }(l))
    }
    d.fn = n.prototype;
    const c = {
        addClass: function() {
            for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
                t[s] = arguments[s];
            const a = l(t.map((e=>e.split(" "))));
            return this.forEach((e=>{
                e.classList.add(...a)
            }
            )),
            this
        },
        removeClass: function() {
            for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
                t[s] = arguments[s];
            const a = l(t.map((e=>e.split(" "))));
            return this.forEach((e=>{
                e.classList.remove(...a)
            }
            )),
            this
        },
        hasClass: function() {
            for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
                t[s] = arguments[s];
            const a = l(t.map((e=>e.split(" "))));
            return o(this, (e=>a.filter((t=>e.classList.contains(t))).length > 0)).length > 0
        },
        toggleClass: function() {
            for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
                t[s] = arguments[s];
            const a = l(t.map((e=>e.split(" "))));
            this.forEach((e=>{
                a.forEach((t=>{
                    e.classList.toggle(t)
                }
                ))
            }
            ))
        },
        attr: function(e, t) {
            if (1 === arguments.length && "string" == typeof e)
                return this[0] ? this[0].getAttribute(e) : void 0;
            for (let s = 0; s < this.length; s += 1)
                if (2 === arguments.length)
                    this[s].setAttribute(e, t);
                else
                    for (const t in e)
                        this[s][t] = e[t],
                        this[s].setAttribute(t, e[t]);
            return this
        },
        removeAttr: function(e) {
            for (let t = 0; t < this.length; t += 1)
                this[t].removeAttribute(e);
            return this
        },
        transform: function(e) {
            for (let t = 0; t < this.length; t += 1)
                this[t].style.transform = e;
            return this
        },
        transition: function(e) {
            for (let t = 0; t < this.length; t += 1)
                this[t].style.transitionDuration = "string" != typeof e ? `${e}ms` : e;
            return this
        },
        on: function() {
            for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
                t[s] = arguments[s];
            let[a,i,r,n] = t;
            function l(e) {
                const t = e.target;
                if (!t)
                    return;
                const s = e.target.dom7EventData || [];
                if (s.indexOf(e) < 0 && s.unshift(e),
                d(t).is(i))
                    r.apply(t, s);
                else {
                    const e = d(t).parents();
                    for (let t = 0; t < e.length; t += 1)
                        d(e[t]).is(i) && r.apply(e[t], s)
                }
            }
            function o(e) {
                const t = e && e.target && e.target.dom7EventData || [];
                t.indexOf(e) < 0 && t.unshift(e),
                r.apply(this, t)
            }
            "function" == typeof t[1] && ([a,r,n] = t,
            i = void 0),
            n || (n = !1);
            const c = a.split(" ");
            let p;
            for (let e = 0; e < this.length; e += 1) {
                const t = this[e];
                if (i)
                    for (p = 0; p < c.length; p += 1) {
                        const e = c[p];
                        t.dom7LiveListeners || (t.dom7LiveListeners = {}),
                        t.dom7LiveListeners[e] || (t.dom7LiveListeners[e] = []),
                        t.dom7LiveListeners[e].push({
                            listener: r,
                            proxyListener: l
                        }),
                        t.addEventListener(e, l, n)
                    }
                else
                    for (p = 0; p < c.length; p += 1) {
                        const e = c[p];
                        t.dom7Listeners || (t.dom7Listeners = {}),
                        t.dom7Listeners[e] || (t.dom7Listeners[e] = []),
                        t.dom7Listeners[e].push({
                            listener: r,
                            proxyListener: o
                        }),
                        t.addEventListener(e, o, n)
                    }
            }
            return this
        },
        off: function() {
            for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
                t[s] = arguments[s];
            let[a,i,r,n] = t;
            "function" == typeof t[1] && ([a,r,n] = t,
            i = void 0),
            n || (n = !1);
            const l = a.split(" ");
            for (let e = 0; e < l.length; e += 1) {
                const t = l[e];
                for (let e = 0; e < this.length; e += 1) {
                    const s = this[e];
                    let a;
                    if (!i && s.dom7Listeners ? a = s.dom7Listeners[t] : i && s.dom7LiveListeners && (a = s.dom7LiveListeners[t]),
                    a && a.length)
                        for (let e = a.length - 1; e >= 0; e -= 1) {
                            const i = a[e];
                            r && i.listener === r || r && i.listener && i.listener.dom7proxy && i.listener.dom7proxy === r ? (s.removeEventListener(t, i.proxyListener, n),
                            a.splice(e, 1)) : r || (s.removeEventListener(t, i.proxyListener, n),
                            a.splice(e, 1))
                        }
                }
            }
            return this
        },
        trigger: function() {
            const e = r();
            for (var t = arguments.length, s = new Array(t), a = 0; a < t; a++)
                s[a] = arguments[a];
            const i = s[0].split(" ")
              , n = s[1];
            for (let t = 0; t < i.length; t += 1) {
                const a = i[t];
                for (let t = 0; t < this.length; t += 1) {
                    const i = this[t];
                    if (e.CustomEvent) {
                        const t = new e.CustomEvent(a,{
                            detail: n,
                            bubbles: !0,
                            cancelable: !0
                        });
                        i.dom7EventData = s.filter(((e,t)=>t > 0)),
                        i.dispatchEvent(t),
                        i.dom7EventData = [],
                        delete i.dom7EventData
                    }
                }
            }
            return this
        },
        transitionEnd: function(e) {
            const t = this;
            return e && t.on("transitionend", (function s(a) {
                a.target === this && (e.call(this, a),
                t.off("transitionend", s))
            }
            )),
            this
        },
        outerWidth: function(e) {
            if (this.length > 0) {
                if (e) {
                    const e = this.styles();
                    return this[0].offsetWidth + parseFloat(e.getPropertyValue("margin-right")) + parseFloat(e.getPropertyValue("margin-left"))
                }
                return this[0].offsetWidth
            }
            return null
        },
        outerHeight: function(e) {
            if (this.length > 0) {
                if (e) {
                    const e = this.styles();
                    return this[0].offsetHeight + parseFloat(e.getPropertyValue("margin-top")) + parseFloat(e.getPropertyValue("margin-bottom"))
                }
                return this[0].offsetHeight
            }
            return null
        },
        styles: function() {
            const e = r();
            return this[0] ? e.getComputedStyle(this[0], null) : {}
        },
        offset: function() {
            if (this.length > 0) {
                const e = r()
                  , t = a()
                  , s = this[0]
                  , i = s.getBoundingClientRect()
                  , n = t.body
                  , l = s.clientTop || n.clientTop || 0
                  , o = s.clientLeft || n.clientLeft || 0
                  , d = s === e ? e.scrollY : s.scrollTop
                  , c = s === e ? e.scrollX : s.scrollLeft;
                return {
                    top: i.top + d - l,
                    left: i.left + c - o
                }
            }
            return null
        },
        css: function(e, t) {
            const s = r();
            let a;
            if (1 === arguments.length) {
                if ("string" != typeof e) {
                    for (a = 0; a < this.length; a += 1)
                        for (const t in e)
                            this[a].style[t] = e[t];
                    return this
                }
                if (this[0])
                    return s.getComputedStyle(this[0], null).getPropertyValue(e)
            }
            if (2 === arguments.length && "string" == typeof e) {
                for (a = 0; a < this.length; a += 1)
                    this[a].style[e] = t;
                return this
            }
            return this
        },
        each: function(e) {
            return e ? (this.forEach(((t,s)=>{
                e.apply(t, [t, s])
            }
            )),
            this) : this
        },
        html: function(e) {
            if (void 0 === e)
                return this[0] ? this[0].innerHTML : null;
            for (let t = 0; t < this.length; t += 1)
                this[t].innerHTML = e;
            return this
        },
        text: function(e) {
            if (void 0 === e)
                return this[0] ? this[0].textContent.trim() : null;
            for (let t = 0; t < this.length; t += 1)
                this[t].textContent = e;
            return this
        },
        is: function(e) {
            const t = r()
              , s = a()
              , i = this[0];
            let l, o;
            if (!i || void 0 === e)
                return !1;
            if ("string" == typeof e) {
                if (i.matches)
                    return i.matches(e);
                if (i.webkitMatchesSelector)
                    return i.webkitMatchesSelector(e);
                if (i.msMatchesSelector)
                    return i.msMatchesSelector(e);
                for (l = d(e),
                o = 0; o < l.length; o += 1)
                    if (l[o] === i)
                        return !0;
                return !1
            }
            if (e === s)
                return i === s;
            if (e === t)
                return i === t;
            if (e.nodeType || e instanceof n) {
                for (l = e.nodeType ? [e] : e,
                o = 0; o < l.length; o += 1)
                    if (l[o] === i)
                        return !0;
                return !1
            }
            return !1
        },
        index: function() {
            let e, t = this[0];
            if (t) {
                for (e = 0; null !== (t = t.previousSibling); )
                    1 === t.nodeType && (e += 1);
                return e
            }
        },
        eq: function(e) {
            if (void 0 === e)
                return this;
            const t = this.length;
            if (e > t - 1)
                return d([]);
            if (e < 0) {
                const s = t + e;
                return d(s < 0 ? [] : [this[s]])
            }
            return d([this[e]])
        },
        append: function() {
            let e;
            const t = a();
            for (let s = 0; s < arguments.length; s += 1) {
                e = s < 0 || arguments.length <= s ? void 0 : arguments[s];
                for (let s = 0; s < this.length; s += 1)
                    if ("string" == typeof e) {
                        const a = t.createElement("div");
                        for (a.innerHTML = e; a.firstChild; )
                            this[s].appendChild(a.firstChild)
                    } else if (e instanceof n)
                        for (let t = 0; t < e.length; t += 1)
                            this[s].appendChild(e[t]);
                    else
                        this[s].appendChild(e)
            }
            return this
        },
        prepend: function(e) {
            const t = a();
            let s, i;
            for (s = 0; s < this.length; s += 1)
                if ("string" == typeof e) {
                    const a = t.createElement("div");
                    for (a.innerHTML = e,
                    i = a.childNodes.length - 1; i >= 0; i -= 1)
                        this[s].insertBefore(a.childNodes[i], this[s].childNodes[0])
                } else if (e instanceof n)
                    for (i = 0; i < e.length; i += 1)
                        this[s].insertBefore(e[i], this[s].childNodes[0]);
                else
                    this[s].insertBefore(e, this[s].childNodes[0]);
            return this
        },
        next: function(e) {
            return this.length > 0 ? e ? this[0].nextElementSibling && d(this[0].nextElementSibling).is(e) ? d([this[0].nextElementSibling]) : d([]) : this[0].nextElementSibling ? d([this[0].nextElementSibling]) : d([]) : d([])
        },
        nextAll: function(e) {
            const t = [];
            let s = this[0];
            if (!s)
                return d([]);
            for (; s.nextElementSibling; ) {
                const a = s.nextElementSibling;
                e ? d(a).is(e) && t.push(a) : t.push(a),
                s = a
            }
            return d(t)
        },
        prev: function(e) {
            if (this.length > 0) {
                const t = this[0];
                return e ? t.previousElementSibling && d(t.previousElementSibling).is(e) ? d([t.previousElementSibling]) : d([]) : t.previousElementSibling ? d([t.previousElementSibling]) : d([])
            }
            return d([])
        },
        prevAll: function(e) {
            const t = [];
            let s = this[0];
            if (!s)
                return d([]);
            for (; s.previousElementSibling; ) {
                const a = s.previousElementSibling;
                e ? d(a).is(e) && t.push(a) : t.push(a),
                s = a
            }
            return d(t)
        },
        parent: function(e) {
            const t = [];
            for (let s = 0; s < this.length; s += 1)
                null !== this[s].parentNode && (e ? d(this[s].parentNode).is(e) && t.push(this[s].parentNode) : t.push(this[s].parentNode));
            return d(t)
        },
        parents: function(e) {
            const t = [];
            for (let s = 0; s < this.length; s += 1) {
                let a = this[s].parentNode;
                for (; a; )
                    e ? d(a).is(e) && t.push(a) : t.push(a),
                    a = a.parentNode
            }
            return d(t)
        },
        closest: function(e) {
            let t = this;
            return void 0 === e ? d([]) : (t.is(e) || (t = t.parents(e).eq(0)),
            t)
        },
        find: function(e) {
            const t = [];
            for (let s = 0; s < this.length; s += 1) {
                const a = this[s].querySelectorAll(e);
                for (let e = 0; e < a.length; e += 1)
                    t.push(a[e])
            }
            return d(t)
        },
        children: function(e) {
            const t = [];
            for (let s = 0; s < this.length; s += 1) {
                const a = this[s].children;
                for (let s = 0; s < a.length; s += 1)
                    e && !d(a[s]).is(e) || t.push(a[s])
            }
            return d(t)
        },
        filter: function(e) {
            return d(o(this, e))
        },
        remove: function() {
            for (let e = 0; e < this.length; e += 1)
                this[e].parentNode && this[e].parentNode.removeChild(this[e]);
            return this
        }
    };
    function p(e, t) {
        return void 0 === t && (t = 0),
        setTimeout(e, t)
    }
    function u() {
        return Date.now()
    }
    function h(e, t) {
        void 0 === t && (t = "x");
        const s = r();
        let a, i, n;
        const l = function(e) {
            const t = r();
            let s;
            return t.getComputedStyle && (s = t.getComputedStyle(e, null)),
            !s && e.currentStyle && (s = e.currentStyle),
            s || (s = e.style),
            s
        }(e);
        return s.WebKitCSSMatrix ? (i = l.transform || l.webkitTransform,
        i.split(",").length > 6 && (i = i.split(", ").map((e=>e.replace(",", "."))).join(", ")),
        n = new s.WebKitCSSMatrix("none" === i ? "" : i)) : (n = l.MozTransform || l.OTransform || l.MsTransform || l.msTransform || l.transform || l.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"),
        a = n.toString().split(",")),
        "x" === t && (i = s.WebKitCSSMatrix ? n.m41 : 16 === a.length ? parseFloat(a[12]) : parseFloat(a[4])),
        "y" === t && (i = s.WebKitCSSMatrix ? n.m42 : 16 === a.length ? parseFloat(a[13]) : parseFloat(a[5])),
        i || 0
    }
    function m(e) {
        return "object" == typeof e && null !== e && e.constructor && "Object" === Object.prototype.toString.call(e).slice(8, -1)
    }
    function f(e) {
        return "undefined" != typeof window && void 0 !== window.HTMLElement ? e instanceof HTMLElement : e && (1 === e.nodeType || 11 === e.nodeType)
    }
    function g() {
        const e = Object(arguments.length <= 0 ? void 0 : arguments[0])
          , t = ["__proto__", "constructor", "prototype"];
        for (let s = 1; s < arguments.length; s += 1) {
            const a = s < 0 || arguments.length <= s ? void 0 : arguments[s];
            if (null != a && !f(a)) {
                const s = Object.keys(Object(a)).filter((e=>t.indexOf(e) < 0));
                for (let t = 0, i = s.length; t < i; t += 1) {
                    const i = s[t]
                      , r = Object.getOwnPropertyDescriptor(a, i);
                    void 0 !== r && r.enumerable && (m(e[i]) && m(a[i]) ? a[i].__swiper__ ? e[i] = a[i] : g(e[i], a[i]) : !m(e[i]) && m(a[i]) ? (e[i] = {},
                    a[i].__swiper__ ? e[i] = a[i] : g(e[i], a[i])) : e[i] = a[i])
                }
            }
        }
        return e
    }
    function v(e, t, s) {
        e.style.setProperty(t, s)
    }
    function w(e) {
        let {swiper: t, targetPosition: s, side: a} = e;
        const i = r()
          , n = -t.translate;
        let l, o = null;
        const d = t.params.speed;
        t.wrapperEl.style.scrollSnapType = "none",
        i.cancelAnimationFrame(t.cssModeFrameID);
        const c = s > n ? "next" : "prev"
          , p = (e,t)=>"next" === c && e >= t || "prev" === c && e <= t
          , u = ()=>{
            l = (new Date).getTime(),
            null === o && (o = l);
            const e = Math.max(Math.min((l - o) / d, 1), 0)
              , r = .5 - Math.cos(e * Math.PI) / 2;
            let c = n + r * (s - n);
            if (p(c, s) && (c = s),
            t.wrapperEl.scrollTo({
                [a]: c
            }),
            p(c, s))
                return t.wrapperEl.style.overflow = "hidden",
                t.wrapperEl.style.scrollSnapType = "",
                setTimeout((()=>{
                    t.wrapperEl.style.overflow = "",
                    t.wrapperEl.scrollTo({
                        [a]: c
                    })
                }
                )),
                void i.cancelAnimationFrame(t.cssModeFrameID);
            t.cssModeFrameID = i.requestAnimationFrame(u)
        }
        ;
        u()
    }
    let b, x, y;
    function E() {
        return b || (b = function() {
            const e = r()
              , t = a();
            return {
                smoothScroll: t.documentElement && "scrollBehavior"in t.documentElement.style,
                touch: !!("ontouchstart"in e || e.DocumentTouch && t instanceof e.DocumentTouch),
                passiveListener: function() {
                    let t = !1;
                    try {
                        const s = Object.defineProperty({}, "passive", {
                            get() {
                                t = !0
                            }
                        });
                        e.addEventListener("testPassiveListener", null, s)
                    } catch (e) {}
                    return t
                }(),
                gestures: "ongesturestart"in e
            }
        }()),
        b
    }
    function T(e) {
        return void 0 === e && (e = {}),
        x || (x = function(e) {
            let {userAgent: t} = void 0 === e ? {} : e;
            const s = E()
              , a = r()
              , i = a.navigator.platform
              , n = t || a.navigator.userAgent
              , l = {
                ios: !1,
                android: !1
            }
              , o = a.screen.width
              , d = a.screen.height
              , c = n.match(/(Android);?[\s\/]+([\d.]+)?/);
            let p = n.match(/(iPad).*OS\s([\d_]+)/);
            const u = n.match(/(iPod)(.*OS\s([\d_]+))?/)
              , h = !p && n.match(/(iPhone\sOS|iOS)\s([\d_]+)/)
              , m = "Win32" === i;
            let f = "MacIntel" === i;
            return !p && f && s.touch && ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"].indexOf(`${o}x${d}`) >= 0 && (p = n.match(/(Version)\/([\d.]+)/),
            p || (p = [0, 1, "13_0_0"]),
            f = !1),
            c && !m && (l.os = "android",
            l.android = !0),
            (p || h || u) && (l.os = "ios",
            l.ios = !0),
            l
        }(e)),
        x
    }
    function C() {
        return y || (y = function() {
            const e = r();
            return {
                isSafari: function() {
                    const t = e.navigator.userAgent.toLowerCase();
                    return t.indexOf("safari") >= 0 && t.indexOf("chrome") < 0 && t.indexOf("android") < 0
                }(),
                isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent)
            }
        }()),
        y
    }
    Object.keys(c).forEach((e=>{
        Object.defineProperty(d.fn, e, {
            value: c[e],
            writable: !0
        })
    }
    ));
    var $ = {
        on(e, t, s) {
            const a = this;
            if ("function" != typeof t)
                return a;
            const i = s ? "unshift" : "push";
            return e.split(" ").forEach((e=>{
                a.eventsListeners[e] || (a.eventsListeners[e] = []),
                a.eventsListeners[e][i](t)
            }
            )),
            a
        },
        once(e, t, s) {
            const a = this;
            if ("function" != typeof t)
                return a;
            function i() {
                a.off(e, i),
                i.__emitterProxy && delete i.__emitterProxy;
                for (var s = arguments.length, r = new Array(s), n = 0; n < s; n++)
                    r[n] = arguments[n];
                t.apply(a, r)
            }
            return i.__emitterProxy = t,
            a.on(e, i, s)
        },
        onAny(e, t) {
            const s = this;
            if ("function" != typeof e)
                return s;
            const a = t ? "unshift" : "push";
            return s.eventsAnyListeners.indexOf(e) < 0 && s.eventsAnyListeners[a](e),
            s
        },
        offAny(e) {
            const t = this;
            if (!t.eventsAnyListeners)
                return t;
            const s = t.eventsAnyListeners.indexOf(e);
            return s >= 0 && t.eventsAnyListeners.splice(s, 1),
            t
        },
        off(e, t) {
            const s = this;
            return s.eventsListeners ? (e.split(" ").forEach((e=>{
                void 0 === t ? s.eventsListeners[e] = [] : s.eventsListeners[e] && s.eventsListeners[e].forEach(((a,i)=>{
                    (a === t || a.__emitterProxy && a.__emitterProxy === t) && s.eventsListeners[e].splice(i, 1)
                }
                ))
            }
            )),
            s) : s
        },
        emit() {
            const e = this;
            if (!e.eventsListeners)
                return e;
            let t, s, a;
            for (var i = arguments.length, r = new Array(i), n = 0; n < i; n++)
                r[n] = arguments[n];
            "string" == typeof r[0] || Array.isArray(r[0]) ? (t = r[0],
            s = r.slice(1, r.length),
            a = e) : (t = r[0].events,
            s = r[0].data,
            a = r[0].context || e),
            s.unshift(a);
            return (Array.isArray(t) ? t : t.split(" ")).forEach((t=>{
                e.eventsAnyListeners && e.eventsAnyListeners.length && e.eventsAnyListeners.forEach((e=>{
                    e.apply(a, [t, ...s])
                }
                )),
                e.eventsListeners && e.eventsListeners[t] && e.eventsListeners[t].forEach((e=>{
                    e.apply(a, s)
                }
                ))
            }
            )),
            e
        }
    };
    var S = {
        updateSize: function() {
            const e = this;
            let t, s;
            const a = e.$el;
            t = void 0 !== e.params.width && null !== e.params.width ? e.params.width : a[0].clientWidth,
            s = void 0 !== e.params.height && null !== e.params.height ? e.params.height : a[0].clientHeight,
            0 === t && e.isHorizontal() || 0 === s && e.isVertical() || (t = t - parseInt(a.css("padding-left") || 0, 10) - parseInt(a.css("padding-right") || 0, 10),
            s = s - parseInt(a.css("padding-top") || 0, 10) - parseInt(a.css("padding-bottom") || 0, 10),
            Number.isNaN(t) && (t = 0),
            Number.isNaN(s) && (s = 0),
            Object.assign(e, {
                width: t,
                height: s,
                size: e.isHorizontal() ? t : s
            }))
        },
        updateSlides: function() {
            const e = this;
            function t(t) {
                return e.isHorizontal() ? t : {
                    width: "height",
                    "margin-top": "margin-left",
                    "margin-bottom ": "margin-right",
                    "margin-left": "margin-top",
                    "margin-right": "margin-bottom",
                    "padding-left": "padding-top",
                    "padding-right": "padding-bottom",
                    marginRight: "marginBottom"
                }[t]
            }
            function s(e, s) {
                return parseFloat(e.getPropertyValue(t(s)) || 0)
            }
            const a = e.params
              , {$wrapperEl: i, size: r, rtlTranslate: n, wrongRTL: l} = e
              , o = e.virtual && a.virtual.enabled
              , d = o ? e.virtual.slides.length : e.slides.length
              , c = i.children(`.${e.params.slideClass}`)
              , p = o ? e.virtual.slides.length : c.length;
            let u = [];
            const h = []
              , m = [];
            let f = a.slidesOffsetBefore;
            "function" == typeof f && (f = a.slidesOffsetBefore.call(e));
            let g = a.slidesOffsetAfter;
            "function" == typeof g && (g = a.slidesOffsetAfter.call(e));
            const w = e.snapGrid.length
              , b = e.slidesGrid.length;
            let x = a.spaceBetween
              , y = -f
              , E = 0
              , T = 0;
            if (void 0 === r)
                return;
            "string" == typeof x && x.indexOf("%") >= 0 && (x = parseFloat(x.replace("%", "")) / 100 * r),
            e.virtualSize = -x,
            n ? c.css({
                marginLeft: "",
                marginBottom: "",
                marginTop: ""
            }) : c.css({
                marginRight: "",
                marginBottom: "",
                marginTop: ""
            }),
            a.centeredSlides && a.cssMode && (v(e.wrapperEl, "--swiper-centered-offset-before", ""),
            v(e.wrapperEl, "--swiper-centered-offset-after", ""));
            const C = a.grid && a.grid.rows > 1 && e.grid;
            let$;
            C && e.grid.initSlides(p);
            const S = "auto" === a.slidesPerView && a.breakpoints && Object.keys(a.breakpoints).filter((e=>void 0 !== a.breakpoints[e].slidesPerView)).length > 0;
            for (let i = 0; i < p; i += 1) {
                $ = 0;
                const n = c.eq(i);
                if (C && e.grid.updateSlide(i, n, p, t),
                "none" !== n.css("display")) {
                    if ("auto" === a.slidesPerView) {
                        S && (c[i].style[t("width")] = "");
                        const r = getComputedStyle(n[0])
                          , l = n[0].style.transform
                          , o = n[0].style.webkitTransform;
                        if (l && (n[0].style.transform = "none"),
                        o && (n[0].style.webkitTransform = "none"),
                        a.roundLengths)
                            $ = e.isHorizontal() ? n.outerWidth(!0) : n.outerHeight(!0);
                        else {
                            const e = s(r, "width")
                              , t = s(r, "padding-left")
                              , a = s(r, "padding-right")
                              , i = s(r, "margin-left")
                              , l = s(r, "margin-right")
                              , o = r.getPropertyValue("box-sizing");
                            if (o && "border-box" === o)
                                $ = e + i + l;
                            else {
                                const {clientWidth: s, offsetWidth: r} = n[0];
                                $ = e + t + a + i + l + (r - s)
                            }
                        }
                        l && (n[0].style.transform = l),
                        o && (n[0].style.webkitTransform = o),
                        a.roundLengths && ($ = Math.floor($))
                    } else
                        $ = (r - (a.slidesPerView - 1) * x) / a.slidesPerView,
                        a.roundLengths && ($ = Math.floor($)),
                        c[i] && (c[i].style[t("width")] = `${$}px`);
                    c[i] && (c[i].swiperSlideSize = $),
                    m.push($),
                    a.centeredSlides ? (y = y + $ / 2 + E / 2 + x,
                    0 === E && 0 !== i && (y = y - r / 2 - x),
                    0 === i && (y = y - r / 2 - x),
                    Math.abs(y) < .001 && (y = 0),
                    a.roundLengths && (y = Math.floor(y)),
                    T % a.slidesPerGroup == 0 && u.push(y),
                    h.push(y)) : (a.roundLengths && (y = Math.floor(y)),
                    (T - Math.min(e.params.slidesPerGroupSkip, T)) % e.params.slidesPerGroup == 0 && u.push(y),
                    h.push(y),
                    y = y + $ + x),
                    e.virtualSize += $ + x,
                    E = $,
                    T += 1
                }
            }
            if (e.virtualSize = Math.max(e.virtualSize, r) + g,
            n && l && ("slide" === a.effect || "coverflow" === a.effect) && i.css({
                width: `${e.virtualSize + a.spaceBetween}px`
            }),
            a.setWrapperSize && i.css({
                [t("width")]: `${e.virtualSize + a.spaceBetween}px`
            }),
            C && e.grid.updateWrapperSize($, u, t),
            !a.centeredSlides) {
                const t = [];
                for (let s = 0; s < u.length; s += 1) {
                    let i = u[s];
                    a.roundLengths && (i = Math.floor(i)),
                    u[s] <= e.virtualSize - r && t.push(i)
                }
                u = t,
                Math.floor(e.virtualSize - r) - Math.floor(u[u.length - 1]) > 1 && u.push(e.virtualSize - r)
            }
            if (0 === u.length && (u = [0]),
            0 !== a.spaceBetween) {
                const s = e.isHorizontal() && n ? "marginLeft" : t("marginRight");
                c.filter(((e,t)=>!a.cssMode || t !== c.length - 1)).css({
                    [s]: `${x}px`
                })
            }
            if (a.centeredSlides && a.centeredSlidesBounds) {
                let e = 0;
                m.forEach((t=>{
                    e += t + (a.spaceBetween ? a.spaceBetween : 0)
                }
                )),
                e -= a.spaceBetween;
                const t = e - r;
                u = u.map((e=>e < 0 ? -f : e > t ? t + g : e))
            }
            if (a.centerInsufficientSlides) {
                let e = 0;
                if (m.forEach((t=>{
                    e += t + (a.spaceBetween ? a.spaceBetween : 0)
                }
                )),
                e -= a.spaceBetween,
                e < r) {
                    const t = (r - e) / 2;
                    u.forEach(((e,s)=>{
                        u[s] = e - t
                    }
                    )),
                    h.forEach(((e,s)=>{
                        h[s] = e + t
                    }
                    ))
                }
            }
            if (Object.assign(e, {
                slides: c,
                snapGrid: u,
                slidesGrid: h,
                slidesSizesGrid: m
            }),
            a.centeredSlides && a.cssMode && !a.centeredSlidesBounds) {
                v(e.wrapperEl, "--swiper-centered-offset-before", -u[0] + "px"),
                v(e.wrapperEl, "--swiper-centered-offset-after", e.size / 2 - m[m.length - 1] / 2 + "px");
                const t = -e.snapGrid[0]
                  , s = -e.slidesGrid[0];
                e.snapGrid = e.snapGrid.map((e=>e + t)),
                e.slidesGrid = e.slidesGrid.map((e=>e + s))
            }
            if (p !== d && e.emit("slidesLengthChange"),
            u.length !== w && (e.params.watchOverflow && e.checkOverflow(),
            e.emit("snapGridLengthChange")),
            h.length !== b && e.emit("slidesGridLengthChange"),
            a.watchSlidesProgress && e.updateSlidesOffset(),
            !(o || a.cssMode || "slide" !== a.effect && "fade" !== a.effect)) {
                const t = `${a.containerModifierClass}backface-hidden`
                  , s = e.$el.hasClass(t);
                p <= a.maxBackfaceHiddenSlides ? s || e.$el.addClass(t) : s && e.$el.removeClass(t)
            }
        },
        updateAutoHeight: function(e) {
            const t = this
              , s = []
              , a = t.virtual && t.params.virtual.enabled;
            let i, r = 0;
            "number" == typeof e ? t.setTransition(e) : !0 === e && t.setTransition(t.params.speed);
            const n = e=>a ? t.slides.filter((t=>parseInt(t.getAttribute("data-swiper-slide-index"), 10) === e))[0] : t.slides.eq(e)[0];
            if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1)
                if (t.params.centeredSlides)
                    t.visibleSlides.each((e=>{
                        s.push(e)
                    }
                    ));
                else
                    for (i = 0; i < Math.ceil(t.params.slidesPerView); i += 1) {
                        const e = t.activeIndex + i;
                        if (e > t.slides.length && !a)
                            break;
                        s.push(n(e))
                    }
            else
                s.push(n(t.activeIndex));
            for (i = 0; i < s.length; i += 1)
                if (void 0 !== s[i]) {
                    const e = s[i].offsetHeight;
                    r = e > r ? e : r
                }
            (r || 0 === r) && t.$wrapperEl.css("height", `${r}px`)
        },
        updateSlidesOffset: function() {
            const e = this
              , t = e.slides;
            for (let s = 0; s < t.length; s += 1)
                t[s].swiperSlideOffset = e.isHorizontal() ? t[s].offsetLeft : t[s].offsetTop
        },
        updateSlidesProgress: function(e) {
            void 0 === e && (e = this && this.translate || 0);
            const t = this
              , s = t.params
              , {slides: a, rtlTranslate: i, snapGrid: r} = t;
            if (0 === a.length)
                return;
            void 0 === a[0].swiperSlideOffset && t.updateSlidesOffset();
            let n = -e;
            i && (n = e),
            a.removeClass(s.slideVisibleClass),
            t.visibleSlidesIndexes = [],
            t.visibleSlides = [];
            for (let e = 0; e < a.length; e += 1) {
                const l = a[e];
                let o = l.swiperSlideOffset;
                s.cssMode && s.centeredSlides && (o -= a[0].swiperSlideOffset);
                const d = (n + (s.centeredSlides ? t.minTranslate() : 0) - o) / (l.swiperSlideSize + s.spaceBetween)
                  , c = (n - r[0] + (s.centeredSlides ? t.minTranslate() : 0) - o) / (l.swiperSlideSize + s.spaceBetween)
                  , p = -(n - o)
                  , u = p + t.slidesSizesGrid[e];
                (p >= 0 && p < t.size - 1 || u > 1 && u <= t.size || p <= 0 && u >= t.size) && (t.visibleSlides.push(l),
                t.visibleSlidesIndexes.push(e),
                a.eq(e).addClass(s.slideVisibleClass)),
                l.progress = i ? -d : d,
                l.originalProgress = i ? -c : c
            }
            t.visibleSlides = d(t.visibleSlides)
        },
        updateProgress: function(e) {
            const t = this;
            if (void 0 === e) {
                const s = t.rtlTranslate ? -1 : 1;
                e = t && t.translate && t.translate * s || 0
            }
            const s = t.params
              , a = t.maxTranslate() - t.minTranslate();
            let {progress: i, isBeginning: r, isEnd: n} = t;
            const l = r
              , o = n;
            0 === a ? (i = 0,
            r = !0,
            n = !0) : (i = (e - t.minTranslate()) / a,
            r = i <= 0,
            n = i >= 1),
            Object.assign(t, {
                progress: i,
                isBeginning: r,
                isEnd: n
            }),
            (s.watchSlidesProgress || s.centeredSlides && s.autoHeight) && t.updateSlidesProgress(e),
            r && !l && t.emit("reachBeginning toEdge"),
            n && !o && t.emit("reachEnd toEdge"),
            (l && !r || o && !n) && t.emit("fromEdge"),
            t.emit("progress", i)
        },
        updateSlidesClasses: function() {
            const e = this
              , {slides: t, params: s, $wrapperEl: a, activeIndex: i, realIndex: r} = e
              , n = e.virtual && s.virtual.enabled;
            let l;
            t.removeClass(`${s.slideActiveClass} ${s.slideNextClass} ${s.slidePrevClass} ${s.slideDuplicateActiveClass} ${s.slideDuplicateNextClass} ${s.slideDuplicatePrevClass}`),
            l = n ? e.$wrapperEl.find(`.${s.slideClass}[data-swiper-slide-index="${i}"]`) : t.eq(i),
            l.addClass(s.slideActiveClass),
            s.loop && (l.hasClass(s.slideDuplicateClass) ? a.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${r}"]`).addClass(s.slideDuplicateActiveClass) : a.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${r}"]`).addClass(s.slideDuplicateActiveClass));
            let o = l.nextAll(`.${s.slideClass}`).eq(0).addClass(s.slideNextClass);
            s.loop && 0 === o.length && (o = t.eq(0),
            o.addClass(s.slideNextClass));
            let d = l.prevAll(`.${s.slideClass}`).eq(0).addClass(s.slidePrevClass);
            s.loop && 0 === d.length && (d = t.eq(-1),
            d.addClass(s.slidePrevClass)),
            s.loop && (o.hasClass(s.slideDuplicateClass) ? a.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicateNextClass) : a.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicateNextClass),
            d.hasClass(s.slideDuplicateClass) ? a.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${d.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicatePrevClass) : a.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${d.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicatePrevClass)),
            e.emitSlidesClasses()
        },
        updateActiveIndex: function(e) {
            const t = this
              , s = t.rtlTranslate ? t.translate : -t.translate
              , {slidesGrid: a, snapGrid: i, params: r, activeIndex: n, realIndex: l, snapIndex: o} = t;
            let d, c = e;
            if (void 0 === c) {
                for (let e = 0; e < a.length; e += 1)
                    void 0 !== a[e + 1] ? s >= a[e] && s < a[e + 1] - (a[e + 1] - a[e]) / 2 ? c = e : s >= a[e] && s < a[e + 1] && (c = e + 1) : s >= a[e] && (c = e);
                r.normalizeSlideIndex && (c < 0 || void 0 === c) && (c = 0)
            }
            if (i.indexOf(s) >= 0)
                d = i.indexOf(s);
            else {
                const e = Math.min(r.slidesPerGroupSkip, c);
                d = e + Math.floor((c - e) / r.slidesPerGroup)
            }
            if (d >= i.length && (d = i.length - 1),
            c === n)
                return void (d !== o && (t.snapIndex = d,
                t.emit("snapIndexChange")));
            const p = parseInt(t.slides.eq(c).attr("data-swiper-slide-index") || c, 10);
            Object.assign(t, {
                snapIndex: d,
                realIndex: p,
                previousIndex: n,
                activeIndex: c
            }),
            t.emit("activeIndexChange"),
            t.emit("snapIndexChange"),
            l !== p && t.emit("realIndexChange"),
            (t.initialized || t.params.runCallbacksOnInit) && t.emit("slideChange")
        },
        updateClickedSlide: function(e) {
            const t = this
              , s = t.params
              , a = d(e).closest(`.${s.slideClass}`)[0];
            let i, r = !1;
            if (a)
                for (let e = 0; e < t.slides.length; e += 1)
                    if (t.slides[e] === a) {
                        r = !0,
                        i = e;
                        break
                    }
            if (!a || !r)
                return t.clickedSlide = void 0,
                void (t.clickedIndex = void 0);
            t.clickedSlide = a,
            t.virtual && t.params.virtual.enabled ? t.clickedIndex = parseInt(d(a).attr("data-swiper-slide-index"), 10) : t.clickedIndex = i,
            s.slideToClickedSlide && void 0 !== t.clickedIndex && t.clickedIndex !== t.activeIndex && t.slideToClickedSlide()
        }
    };
    var M = {
        getTranslate: function(e) {
            void 0 === e && (e = this.isHorizontal() ? "x" : "y");
            const {params: t, rtlTranslate: s, translate: a, $wrapperEl: i} = this;
            if (t.virtualTranslate)
                return s ? -a : a;
            if (t.cssMode)
                return a;
            let r = h(i[0], e);
            return s && (r = -r),
            r || 0
        },
        setTranslate: function(e, t) {
            const s = this
              , {rtlTranslate: a, params: i, $wrapperEl: r, wrapperEl: n, progress: l} = s;
            let o, d = 0, c = 0;
            s.isHorizontal() ? d = a ? -e : e : c = e,
            i.roundLengths && (d = Math.floor(d),
            c = Math.floor(c)),
            i.cssMode ? n[s.isHorizontal() ? "scrollLeft" : "scrollTop"] = s.isHorizontal() ? -d : -c : i.virtualTranslate || r.transform(`translate3d(${d}px, ${c}px, 0px)`),
            s.previousTranslate = s.translate,
            s.translate = s.isHorizontal() ? d : c;
            const p = s.maxTranslate() - s.minTranslate();
            o = 0 === p ? 0 : (e - s.minTranslate()) / p,
            o !== l && s.updateProgress(e),
            s.emit("setTranslate", s.translate, t)
        },
        minTranslate: function() {
            return -this.snapGrid[0]
        },
        maxTranslate: function() {
            return -this.snapGrid[this.snapGrid.length - 1]
        },
        translateTo: function(e, t, s, a, i) {
            void 0 === e && (e = 0),
            void 0 === t && (t = this.params.speed),
            void 0 === s && (s = !0),
            void 0 === a && (a = !0);
            const r = this
              , {params: n, wrapperEl: l} = r;
            if (r.animating && n.preventInteractionOnTransition)
                return !1;
            const o = r.minTranslate()
              , d = r.maxTranslate();
            let c;
            if (c = a && e > o ? o : a && e < d ? d : e,
            r.updateProgress(c),
            n.cssMode) {
                const e = r.isHorizontal();
                if (0 === t)
                    l[e ? "scrollLeft" : "scrollTop"] = -c;
                else {
                    if (!r.support.smoothScroll)
                        return w({
                            swiper: r,
                            targetPosition: -c,
                            side: e ? "left" : "top"
                        }),
                        !0;
                    l.scrollTo({
                        [e ? "left" : "top"]: -c,
                        behavior: "smooth"
                    })
                }
                return !0
            }
            return 0 === t ? (r.setTransition(0),
            r.setTranslate(c),
            s && (r.emit("beforeTransitionStart", t, i),
            r.emit("transitionEnd"))) : (r.setTransition(t),
            r.setTranslate(c),
            s && (r.emit("beforeTransitionStart", t, i),
            r.emit("transitionStart")),
            r.animating || (r.animating = !0,
            r.onTranslateToWrapperTransitionEnd || (r.onTranslateToWrapperTransitionEnd = function(e) {
                r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onTranslateToWrapperTransitionEnd),
                r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onTranslateToWrapperTransitionEnd),
                r.onTranslateToWrapperTransitionEnd = null,
                delete r.onTranslateToWrapperTransitionEnd,
                s && r.emit("transitionEnd"))
            }
            ),
            r.$wrapperEl[0].addEventListener("transitionend", r.onTranslateToWrapperTransitionEnd),
            r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onTranslateToWrapperTransitionEnd))),
            !0
        }
    };
    function P(e) {
        let {swiper: t, runCallbacks: s, direction: a, step: i} = e;
        const {activeIndex: r, previousIndex: n} = t;
        let l = a;
        if (l || (l = r > n ? "next" : r < n ? "prev" : "reset"),
        t.emit(`transition${i}`),
        s && r !== n) {
            if ("reset" === l)
                return void t.emit(`slideResetTransition${i}`);
            t.emit(`slideChangeTransition${i}`),
            "next" === l ? t.emit(`slideNextTransition${i}`) : t.emit(`slidePrevTransition${i}`)
        }
    }
    var k = {
        slideTo: function(e, t, s, a, i) {
            if (void 0 === e && (e = 0),
            void 0 === t && (t = this.params.speed),
            void 0 === s && (s = !0),
            "number" != typeof e && "string" != typeof e)
                throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof e}] given.`);
            if ("string" == typeof e) {
                const t = parseInt(e, 10);
                if (!isFinite(t))
                    throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${e}] given.`);
                e = t
            }
            const r = this;
            let n = e;
            n < 0 && (n = 0);
            const {params: l, snapGrid: o, slidesGrid: d, previousIndex: c, activeIndex: p, rtlTranslate: u, wrapperEl: h, enabled: m} = r;
            if (r.animating && l.preventInteractionOnTransition || !m && !a && !i)
                return !1;
            const f = Math.min(r.params.slidesPerGroupSkip, n);
            let g = f + Math.floor((n - f) / r.params.slidesPerGroup);
            g >= o.length && (g = o.length - 1),
            (p || l.initialSlide || 0) === (c || 0) && s && r.emit("beforeSlideChangeStart");
            const v = -o[g];
            if (r.updateProgress(v),
            l.normalizeSlideIndex)
                for (let e = 0; e < d.length; e += 1) {
                    const t = -Math.floor(100 * v)
                      , s = Math.floor(100 * d[e])
                      , a = Math.floor(100 * d[e + 1]);
                    void 0 !== d[e + 1] ? t >= s && t < a - (a - s) / 2 ? n = e : t >= s && t < a && (n = e + 1) : t >= s && (n = e)
                }
            if (r.initialized && n !== p) {
                if (!r.allowSlideNext && v < r.translate && v < r.minTranslate())
                    return !1;
                if (!r.allowSlidePrev && v > r.translate && v > r.maxTranslate() && (p || 0) !== n)
                    return !1
            }
            let b;
            if (b = n > p ? "next" : n < p ? "prev" : "reset",
            u && -v === r.translate || !u && v === r.translate)
                return r.updateActiveIndex(n),
                l.autoHeight && r.updateAutoHeight(),
                r.updateSlidesClasses(),
                "slide" !== l.effect && r.setTranslate(v),
                "reset" !== b && (r.transitionStart(s, b),
                r.transitionEnd(s, b)),
                !1;
            if (l.cssMode) {
                const e = r.isHorizontal()
                  , s = u ? v : -v;
                if (0 === t) {
                    const t = r.virtual && r.params.virtual.enabled;
                    t && (r.wrapperEl.style.scrollSnapType = "none",
                    r._immediateVirtual = !0),
                    h[e ? "scrollLeft" : "scrollTop"] = s,
                    t && requestAnimationFrame((()=>{
                        r.wrapperEl.style.scrollSnapType = "",
                        r._swiperImmediateVirtual = !1
                    }
                    ))
                } else {
                    if (!r.support.smoothScroll)
                        return w({
                            swiper: r,
                            targetPosition: s,
                            side: e ? "left" : "top"
                        }),
                        !0;
                    h.scrollTo({
                        [e ? "left" : "top"]: s,
                        behavior: "smooth"
                    })
                }
                return !0
            }
            return r.setTransition(t),
            r.setTranslate(v),
            r.updateActiveIndex(n),
            r.updateSlidesClasses(),
            r.emit("beforeTransitionStart", t, a),
            r.transitionStart(s, b),
            0 === t ? r.transitionEnd(s, b) : r.animating || (r.animating = !0,
            r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd = function(e) {
                r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd),
                r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd),
                r.onSlideToWrapperTransitionEnd = null,
                delete r.onSlideToWrapperTransitionEnd,
                r.transitionEnd(s, b))
            }
            ),
            r.$wrapperEl[0].addEventListener("transitionend", r.onSlideToWrapperTransitionEnd),
            r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd)),
            !0
        },
        slideToLoop: function(e, t, s, a) {
            void 0 === e && (e = 0),
            void 0 === t && (t = this.params.speed),
            void 0 === s && (s = !0);
            const i = this;
            let r = e;
            return i.params.loop && (r += i.loopedSlides),
            i.slideTo(r, t, s, a)
        },
        slideNext: function(e, t, s) {
            void 0 === e && (e = this.params.speed),
            void 0 === t && (t = !0);
            const a = this
              , {animating: i, enabled: r, params: n} = a;
            if (!r)
                return a;
            let l = n.slidesPerGroup;
            "auto" === n.slidesPerView && 1 === n.slidesPerGroup && n.slidesPerGroupAuto && (l = Math.max(a.slidesPerViewDynamic("current", !0), 1));
            const o = a.activeIndex < n.slidesPerGroupSkip ? 1 : l;
            if (n.loop) {
                if (i && n.loopPreventsSlide)
                    return !1;
                a.loopFix(),
                a._clientLeft = a.$wrapperEl[0].clientLeft
            }
            return n.rewind && a.isEnd ? a.slideTo(0, e, t, s) : a.slideTo(a.activeIndex + o, e, t, s)
        },
        slidePrev: function(e, t, s) {
            void 0 === e && (e = this.params.speed),
            void 0 === t && (t = !0);
            const a = this
              , {params: i, animating: r, snapGrid: n, slidesGrid: l, rtlTranslate: o, enabled: d} = a;
            if (!d)
                return a;
            if (i.loop) {
                if (r && i.loopPreventsSlide)
                    return !1;
                a.loopFix(),
                a._clientLeft = a.$wrapperEl[0].clientLeft
            }
            function c(e) {
                return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e)
            }
            const p = c(o ? a.translate : -a.translate)
              , u = n.map((e=>c(e)));
            let h = n[u.indexOf(p) - 1];
            if (void 0 === h && i.cssMode) {
                let e;
                n.forEach(((t,s)=>{
                    p >= t && (e = s)
                }
                )),
                void 0 !== e && (h = n[e > 0 ? e - 1 : e])
            }
            let m = 0;
            if (void 0 !== h && (m = l.indexOf(h),
            m < 0 && (m = a.activeIndex - 1),
            "auto" === i.slidesPerView && 1 === i.slidesPerGroup && i.slidesPerGroupAuto && (m = m - a.slidesPerViewDynamic("previous", !0) + 1,
            m = Math.max(m, 0))),
            i.rewind && a.isBeginning) {
                const i = a.params.virtual && a.params.virtual.enabled && a.virtual ? a.virtual.slides.length - 1 : a.slides.length - 1;
                return a.slideTo(i, e, t, s)
            }
            return a.slideTo(m, e, t, s)
        },
        slideReset: function(e, t, s) {
            return void 0 === e && (e = this.params.speed),
            void 0 === t && (t = !0),
            this.slideTo(this.activeIndex, e, t, s)
        },
        slideToClosest: function(e, t, s, a) {
            void 0 === e && (e = this.params.speed),
            void 0 === t && (t = !0),
            void 0 === a && (a = .5);
            const i = this;
            let r = i.activeIndex;
            const n = Math.min(i.params.slidesPerGroupSkip, r)
              , l = n + Math.floor((r - n) / i.params.slidesPerGroup)
              , o = i.rtlTranslate ? i.translate : -i.translate;
            if (o >= i.snapGrid[l]) {
                const e = i.snapGrid[l];
                o - e > (i.snapGrid[l + 1] - e) * a && (r += i.params.slidesPerGroup)
            } else {
                const e = i.snapGrid[l - 1];
                o - e <= (i.snapGrid[l] - e) * a && (r -= i.params.slidesPerGroup)
            }
            return r = Math.max(r, 0),
            r = Math.min(r, i.slidesGrid.length - 1),
            i.slideTo(r, e, t, s)
        },
        slideToClickedSlide: function() {
            const e = this
              , {params: t, $wrapperEl: s} = e
              , a = "auto" === t.slidesPerView ? e.slidesPerViewDynamic() : t.slidesPerView;
            let i, r = e.clickedIndex;
            if (t.loop) {
                if (e.animating)
                    return;
                i = parseInt(d(e.clickedSlide).attr("data-swiper-slide-index"), 10),
                t.centeredSlides ? r < e.loopedSlides - a / 2 || r > e.slides.length - e.loopedSlides + a / 2 ? (e.loopFix(),
                r = s.children(`.${t.slideClass}[data-swiper-slide-index="${i}"]:not(.${t.slideDuplicateClass})`).eq(0).index(),
                p((()=>{
                    e.slideTo(r)
                }
                ))) : e.slideTo(r) : r > e.slides.length - a ? (e.loopFix(),
                r = s.children(`.${t.slideClass}[data-swiper-slide-index="${i}"]:not(.${t.slideDuplicateClass})`).eq(0).index(),
                p((()=>{
                    e.slideTo(r)
                }
                ))) : e.slideTo(r)
            } else
                e.slideTo(r)
        }
    };
    var z = {
        loopCreate: function() {
            const e = this
              , t = a()
              , {params: s, $wrapperEl: i} = e
              , r = i.children().length > 0 ? d(i.children()[0].parentNode) : i;
            r.children(`.${s.slideClass}.${s.slideDuplicateClass}`).remove();
            let n = r.children(`.${s.slideClass}`);
            if (s.loopFillGroupWithBlank) {
                const e = s.slidesPerGroup - n.length % s.slidesPerGroup;
                if (e !== s.slidesPerGroup) {
                    for (let a = 0; a < e; a += 1) {
                        const e = d(t.createElement("div")).addClass(`${s.slideClass} ${s.slideBlankClass}`);
                        r.append(e)
                    }
                    n = r.children(`.${s.slideClass}`)
                }
            }
            "auto" !== s.slidesPerView || s.loopedSlides || (s.loopedSlides = n.length),
            e.loopedSlides = Math.ceil(parseFloat(s.loopedSlides || s.slidesPerView, 10)),
            e.loopedSlides += s.loopAdditionalSlides,
            e.loopedSlides > n.length && (e.loopedSlides = n.length);
            const l = []
              , o = [];
            n.each(((t,s)=>{
                const a = d(t);
                s < e.loopedSlides && o.push(t),
                s < n.length && s >= n.length - e.loopedSlides && l.push(t),
                a.attr("data-swiper-slide-index", s)
            }
            ));
            for (let e = 0; e < o.length; e += 1)
                r.append(d(o[e].cloneNode(!0)).addClass(s.slideDuplicateClass));
            for (let e = l.length - 1; e >= 0; e -= 1)
                r.prepend(d(l[e].cloneNode(!0)).addClass(s.slideDuplicateClass))
        },
        loopFix: function() {
            const e = this;
            e.emit("beforeLoopFix");
            const {activeIndex: t, slides: s, loopedSlides: a, allowSlidePrev: i, allowSlideNext: r, snapGrid: n, rtlTranslate: l} = e;
            let o;
            e.allowSlidePrev = !0,
            e.allowSlideNext = !0;
            const d = -n[t] - e.getTranslate();
            if (t < a) {
                o = s.length - 3 * a + t,
                o += a;
                e.slideTo(o, 0, !1, !0) && 0 !== d && e.setTranslate((l ? -e.translate : e.translate) - d)
            } else if (t >= s.length - a) {
                o = -s.length + t + a,
                o += a;
                e.slideTo(o, 0, !1, !0) && 0 !== d && e.setTranslate((l ? -e.translate : e.translate) - d)
            }
            e.allowSlidePrev = i,
            e.allowSlideNext = r,
            e.emit("loopFix")
        },
        loopDestroy: function() {
            const {$wrapperEl: e, params: t, slides: s} = this;
            e.children(`.${t.slideClass}.${t.slideDuplicateClass},.${t.slideClass}.${t.slideBlankClass}`).remove(),
            s.removeAttr("data-swiper-slide-index")
        }
    };
    function O(e) {
        const t = this
          , s = a()
          , i = r()
          , n = t.touchEventsData
          , {params: l, touches: o, enabled: c} = t;
        if (!c)
            return;
        if (t.animating && l.preventInteractionOnTransition)
            return;
        !t.animating && l.cssMode && l.loop && t.loopFix();
        let p = e;
        p.originalEvent && (p = p.originalEvent);
        let h = d(p.target);
        if ("wrapper" === l.touchEventsTarget && !h.closest(t.wrapperEl).length)
            return;
        if (n.isTouchEvent = "touchstart" === p.type,
        !n.isTouchEvent && "which"in p && 3 === p.which)
            return;
        if (!n.isTouchEvent && "button"in p && p.button > 0)
            return;
        if (n.isTouched && n.isMoved)
            return;
        !!l.noSwipingClass && "" !== l.noSwipingClass && p.target && p.target.shadowRoot && e.path && e.path[0] && (h = d(e.path[0]));
        const m = l.noSwipingSelector ? l.noSwipingSelector : `.${l.noSwipingClass}`
          , f = !(!p.target || !p.target.shadowRoot);
        if (l.noSwiping && (f ? function(e, t) {
            return void 0 === t && (t = this),
            function t(s) {
                return s && s !== a() && s !== r() ? (s.assignedSlot && (s = s.assignedSlot),
                s.closest(e) || t(s.getRootNode().host)) : null
            }(t)
        }(m, p.target) : h.closest(m)[0]))
            return void (t.allowClick = !0);
        if (l.swipeHandler && !h.closest(l.swipeHandler)[0])
            return;
        o.currentX = "touchstart" === p.type ? p.targetTouches[0].pageX : p.pageX,
        o.currentY = "touchstart" === p.type ? p.targetTouches[0].pageY : p.pageY;
        const g = o.currentX
          , v = o.currentY
          , w = l.edgeSwipeDetection || l.iOSEdgeSwipeDetection
          , b = l.edgeSwipeThreshold || l.iOSEdgeSwipeThreshold;
        if (w && (g <= b || g >= i.innerWidth - b)) {
            if ("prevent" !== w)
                return;
            e.preventDefault()
        }
        if (Object.assign(n, {
            isTouched: !0,
            isMoved: !1,
            allowTouchCallbacks: !0,
            isScrolling: void 0,
            startMoving: void 0
        }),
        o.startX = g,
        o.startY = v,
        n.touchStartTime = u(),
        t.allowClick = !0,
        t.updateSize(),
        t.swipeDirection = void 0,
        l.threshold > 0 && (n.allowThresholdMove = !1),
        "touchstart" !== p.type) {
            let e = !0;
            h.is(n.focusableElements) && (e = !1,
            "SELECT" === h[0].nodeName && (n.isTouched = !1)),
            s.activeElement && d(s.activeElement).is(n.focusableElements) && s.activeElement !== h[0] && s.activeElement.blur();
            const a = e && t.allowTouchMove && l.touchStartPreventDefault;
            !l.touchStartForcePreventDefault && !a || h[0].isContentEditable || p.preventDefault()
        }
        t.params.freeMode && t.params.freeMode.enabled && t.freeMode && t.animating && !l.cssMode && t.freeMode.onTouchStart(),
        t.emit("touchStart", p)
    }
    function I(e) {
        const t = a()
          , s = this
          , i = s.touchEventsData
          , {params: r, touches: n, rtlTranslate: l, enabled: o} = s;
        if (!o)
            return;
        let c = e;
        if (c.originalEvent && (c = c.originalEvent),
        !i.isTouched)
            return void (i.startMoving && i.isScrolling && s.emit("touchMoveOpposite", c));
        if (i.isTouchEvent && "touchmove" !== c.type)
            return;
        const p = "touchmove" === c.type && c.targetTouches && (c.targetTouches[0] || c.changedTouches[0])
          , h = "touchmove" === c.type ? p.pageX : c.pageX
          , m = "touchmove" === c.type ? p.pageY : c.pageY;
        if (c.preventedByNestedSwiper)
            return n.startX = h,
            void (n.startY = m);
        if (!s.allowTouchMove)
            return d(c.target).is(i.focusableElements) || (s.allowClick = !1),
            void (i.isTouched && (Object.assign(n, {
                startX: h,
                startY: m,
                currentX: h,
                currentY: m
            }),
            i.touchStartTime = u()));
        if (i.isTouchEvent && r.touchReleaseOnEdges && !r.loop)
            if (s.isVertical()) {
                if (m < n.startY && s.translate <= s.maxTranslate() || m > n.startY && s.translate >= s.minTranslate())
                    return i.isTouched = !1,
                    void (i.isMoved = !1)
            } else if (h < n.startX && s.translate <= s.maxTranslate() || h > n.startX && s.translate >= s.minTranslate())
                return;
        if (i.isTouchEvent && t.activeElement && c.target === t.activeElement && d(c.target).is(i.focusableElements))
            return i.isMoved = !0,
            void (s.allowClick = !1);
        if (i.allowTouchCallbacks && s.emit("touchMove", c),
        c.targetTouches && c.targetTouches.length > 1)
            return;
        n.currentX = h,
        n.currentY = m;
        const f = n.currentX - n.startX
          , g = n.currentY - n.startY;
        if (s.params.threshold && Math.sqrt(f ** 2 + g ** 2) < s.params.threshold)
            return;
        if (void 0 === i.isScrolling) {
            let e;
            s.isHorizontal() && n.currentY === n.startY || s.isVertical() && n.currentX === n.startX ? i.isScrolling = !1 : f * f + g * g >= 25 && (e = 180 * Math.atan2(Math.abs(g), Math.abs(f)) / Math.PI,
            i.isScrolling = s.isHorizontal() ? e > r.touchAngle : 90 - e > r.touchAngle)
        }
        if (i.isScrolling && s.emit("touchMoveOpposite", c),
        void 0 === i.startMoving && (n.currentX === n.startX && n.currentY === n.startY || (i.startMoving = !0)),
        i.isScrolling)
            return void (i.isTouched = !1);
        if (!i.startMoving)
            return;
        s.allowClick = !1,
        !r.cssMode && c.cancelable && c.preventDefault(),
        r.touchMoveStopPropagation && !r.nested && c.stopPropagation(),
        i.isMoved || (r.loop && !r.cssMode && s.loopFix(),
        i.startTranslate = s.getTranslate(),
        s.setTransition(0),
        s.animating && s.$wrapperEl.trigger("webkitTransitionEnd transitionend"),
        i.allowMomentumBounce = !1,
        !r.grabCursor || !0 !== s.allowSlideNext && !0 !== s.allowSlidePrev || s.setGrabCursor(!0),
        s.emit("sliderFirstMove", c)),
        s.emit("sliderMove", c),
        i.isMoved = !0;
        let v = s.isHorizontal() ? f : g;
        n.diff = v,
        v *= r.touchRatio,
        l && (v = -v),
        s.swipeDirection = v > 0 ? "prev" : "next",
        i.currentTranslate = v + i.startTranslate;
        let w = !0
          , b = r.resistanceRatio;
        if (r.touchReleaseOnEdges && (b = 0),
        v > 0 && i.currentTranslate > s.minTranslate() ? (w = !1,
        r.resistance && (i.currentTranslate = s.minTranslate() - 1 + (-s.minTranslate() + i.startTranslate + v) ** b)) : v < 0 && i.currentTranslate < s.maxTranslate() && (w = !1,
        r.resistance && (i.currentTranslate = s.maxTranslate() + 1 - (s.maxTranslate() - i.startTranslate - v) ** b)),
        w && (c.preventedByNestedSwiper = !0),
        !s.allowSlideNext && "next" === s.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate),
        !s.allowSlidePrev && "prev" === s.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate),
        s.allowSlidePrev || s.allowSlideNext || (i.currentTranslate = i.startTranslate),
        r.threshold > 0) {
            if (!(Math.abs(v) > r.threshold || i.allowThresholdMove))
                return void (i.currentTranslate = i.startTranslate);
            if (!i.allowThresholdMove)
                return i.allowThresholdMove = !0,
                n.startX = n.currentX,
                n.startY = n.currentY,
                i.currentTranslate = i.startTranslate,
                void (n.diff = s.isHorizontal() ? n.currentX - n.startX : n.currentY - n.startY)
        }
        r.followFinger && !r.cssMode && ((r.freeMode && r.freeMode.enabled && s.freeMode || r.watchSlidesProgress) && (s.updateActiveIndex(),
        s.updateSlidesClasses()),
        s.params.freeMode && r.freeMode.enabled && s.freeMode && s.freeMode.onTouchMove(),
        s.updateProgress(i.currentTranslate),
        s.setTranslate(i.currentTranslate))
    }
    function L(e) {
        const t = this
          , s = t.touchEventsData
          , {params: a, touches: i, rtlTranslate: r, slidesGrid: n, enabled: l} = t;
        if (!l)
            return;
        let o = e;
        if (o.originalEvent && (o = o.originalEvent),
        s.allowTouchCallbacks && t.emit("touchEnd", o),
        s.allowTouchCallbacks = !1,
        !s.isTouched)
            return s.isMoved && a.grabCursor && t.setGrabCursor(!1),
            s.isMoved = !1,
            void (s.startMoving = !1);
        a.grabCursor && s.isMoved && s.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
        const d = u()
          , c = d - s.touchStartTime;
        if (t.allowClick) {
            const e = o.path || o.composedPath && o.composedPath();
            t.updateClickedSlide(e && e[0] || o.target),
            t.emit("tap click", o),
            c < 300 && d - s.lastClickTime < 300 && t.emit("doubleTap doubleClick", o)
        }
        if (s.lastClickTime = u(),
        p((()=>{
            t.destroyed || (t.allowClick = !0)
        }
        )),
        !s.isTouched || !s.isMoved || !t.swipeDirection || 0 === i.diff || s.currentTranslate === s.startTranslate)
            return s.isTouched = !1,
            s.isMoved = !1,
            void (s.startMoving = !1);
        let h;
        if (s.isTouched = !1,
        s.isMoved = !1,
        s.startMoving = !1,
        h = a.followFinger ? r ? t.translate : -t.translate : -s.currentTranslate,
        a.cssMode)
            return;
        if (t.params.freeMode && a.freeMode.enabled)
            return void t.freeMode.onTouchEnd({
                currentPos: h
            });
        let m = 0
          , f = t.slidesSizesGrid[0];
        for (let e = 0; e < n.length; e += e < a.slidesPerGroupSkip ? 1 : a.slidesPerGroup) {
            const t = e < a.slidesPerGroupSkip - 1 ? 1 : a.slidesPerGroup;
            void 0 !== n[e + t] ? h >= n[e] && h < n[e + t] && (m = e,
            f = n[e + t] - n[e]) : h >= n[e] && (m = e,
            f = n[n.length - 1] - n[n.length - 2])
        }
        let g = null
          , v = null;
        a.rewind && (t.isBeginning ? v = t.params.virtual && t.params.virtual.enabled && t.virtual ? t.virtual.slides.length - 1 : t.slides.length - 1 : t.isEnd && (g = 0));
        const w = (h - n[m]) / f
          , b = m < a.slidesPerGroupSkip - 1 ? 1 : a.slidesPerGroup;
        if (c > a.longSwipesMs) {
            if (!a.longSwipes)
                return void t.slideTo(t.activeIndex);
            "next" === t.swipeDirection && (w >= a.longSwipesRatio ? t.slideTo(a.rewind && t.isEnd ? g : m + b) : t.slideTo(m)),
            "prev" === t.swipeDirection && (w > 1 - a.longSwipesRatio ? t.slideTo(m + b) : null !== v && w < 0 && Math.abs(w) > a.longSwipesRatio ? t.slideTo(v) : t.slideTo(m))
        } else {
            if (!a.shortSwipes)
                return void t.slideTo(t.activeIndex);
            t.navigation && (o.target === t.navigation.nextEl || o.target === t.navigation.prevEl) ? o.target === t.navigation.nextEl ? t.slideTo(m + b) : t.slideTo(m) : ("next" === t.swipeDirection && t.slideTo(null !== g ? g : m + b),
            "prev" === t.swipeDirection && t.slideTo(null !== v ? v : m))
        }
    }
    function A() {
        const e = this
          , {params: t, el: s} = e;
        if (s && 0 === s.offsetWidth)
            return;
        t.breakpoints && e.setBreakpoint();
        const {allowSlideNext: a, allowSlidePrev: i, snapGrid: r} = e;
        e.allowSlideNext = !0,
        e.allowSlidePrev = !0,
        e.updateSize(),
        e.updateSlides(),
        e.updateSlidesClasses(),
        ("auto" === t.slidesPerView || t.slidesPerView > 1) && e.isEnd && !e.isBeginning && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0),
        e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.run(),
        e.allowSlidePrev = i,
        e.allowSlideNext = a,
        e.params.watchOverflow && r !== e.snapGrid && e.checkOverflow()
    }
    function D(e) {
        const t = this;
        t.enabled && (t.allowClick || (t.params.preventClicks && e.preventDefault(),
        t.params.preventClicksPropagation && t.animating && (e.stopPropagation(),
        e.stopImmediatePropagation())))
    }
    function G() {
        const e = this
          , {wrapperEl: t, rtlTranslate: s, enabled: a} = e;
        if (!a)
            return;
        let i;
        e.previousTranslate = e.translate,
        e.isHorizontal() ? e.translate = -t.scrollLeft : e.translate = -t.scrollTop,
        0 === e.translate && (e.translate = 0),
        e.updateActiveIndex(),
        e.updateSlidesClasses();
        const r = e.maxTranslate() - e.minTranslate();
        i = 0 === r ? 0 : (e.translate - e.minTranslate()) / r,
        i !== e.progress && e.updateProgress(s ? -e.translate : e.translate),
        e.emit("setTranslate", e.translate, !1)
    }
    let B = !1;
    function N() {}
    const H = (e,t)=>{
        const s = a()
          , {params: i, touchEvents: r, el: n, wrapperEl: l, device: o, support: d} = e
          , c = !!i.nested
          , p = "on" === t ? "addEventListener" : "removeEventListener"
          , u = t;
        if (d.touch) {
            const t = !("touchstart" !== r.start || !d.passiveListener || !i.passiveListeners) && {
                passive: !0,
                capture: !1
            };
            n[p](r.start, e.onTouchStart, t),
            n[p](r.move, e.onTouchMove, d.passiveListener ? {
                passive: !1,
                capture: c
            } : c),
            n[p](r.end, e.onTouchEnd, t),
            r.cancel && n[p](r.cancel, e.onTouchEnd, t)
        } else
            n[p](r.start, e.onTouchStart, !1),
            s[p](r.move, e.onTouchMove, c),
            s[p](r.end, e.onTouchEnd, !1);
        (i.preventClicks || i.preventClicksPropagation) && n[p]("click", e.onClick, !0),
        i.cssMode && l[p]("scroll", e.onScroll),
        i.updateOnWindowResize ? e[u](o.ios || o.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", A, !0) : e[u]("observerUpdate", A, !0)
    }
    ;
    var X = {
        attachEvents: function() {
            const e = this
              , t = a()
              , {params: s, support: i} = e;
            e.onTouchStart = O.bind(e),
            e.onTouchMove = I.bind(e),
            e.onTouchEnd = L.bind(e),
            s.cssMode && (e.onScroll = G.bind(e)),
            e.onClick = D.bind(e),
            i.touch && !B && (t.addEventListener("touchstart", N),
            B = !0),
            H(e, "on")
        },
        detachEvents: function() {
            H(this, "off")
        }
    };
    const Y = (e,t)=>e.grid && t.grid && t.grid.rows > 1;
    var R = {
        addClasses: function() {
            const e = this
              , {classNames: t, params: s, rtl: a, $el: i, device: r, support: n} = e
              , l = function(e, t) {
                const s = [];
                return e.forEach((e=>{
                    "object" == typeof e ? Object.keys(e).forEach((a=>{
                        e[a] && s.push(t + a)
                    }
                    )) : "string" == typeof e && s.push(t + e)
                }
                )),
                s
            }(["initialized", s.direction, {
                "pointer-events": !n.touch
            }, {
                "free-mode": e.params.freeMode && s.freeMode.enabled
            }, {
                autoheight: s.autoHeight
            }, {
                rtl: a
            }, {
                grid: s.grid && s.grid.rows > 1
            }, {
                "grid-column": s.grid && s.grid.rows > 1 && "column" === s.grid.fill
            }, {
                android: r.android
            }, {
                ios: r.ios
            }, {
                "css-mode": s.cssMode
            }, {
                centered: s.cssMode && s.centeredSlides
            }], s.containerModifierClass);
            t.push(...l),
            i.addClass([...t].join(" ")),
            e.emitContainerClasses()
        },
        removeClasses: function() {
            const {$el: e, classNames: t} = this;
            e.removeClass(t.join(" ")),
            this.emitContainerClasses()
        }
    };
    var W = {
        init: !0,
        direction: "horizontal",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: !1,
        updateOnWindowResize: !0,
        resizeObserver: !0,
        nested: !1,
        createElements: !1,
        enabled: !0,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: !1,
        userAgent: null,
        url: null,
        edgeSwipeDetection: !1,
        edgeSwipeThreshold: 20,
        autoHeight: !1,
        setWrapperSize: !1,
        virtualTranslate: !1,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: !1,
        centeredSlides: !1,
        centeredSlidesBounds: !1,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: !0,
        centerInsufficientSlides: !1,
        watchOverflow: !0,
        roundLengths: !1,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: !0,
        shortSwipes: !0,
        longSwipes: !0,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: !0,
        allowTouchMove: !0,
        threshold: 0,
        touchMoveStopPropagation: !1,
        touchStartPreventDefault: !0,
        touchStartForcePreventDefault: !1,
        touchReleaseOnEdges: !1,
        uniqueNavElements: !0,
        resistance: !0,
        resistanceRatio: .85,
        watchSlidesProgress: !1,
        grabCursor: !1,
        preventClicks: !0,
        preventClicksPropagation: !0,
        slideToClickedSlide: !1,
        preloadImages: !0,
        updateOnImagesReady: !0,
        loop: !1,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopFillGroupWithBlank: !1,
        loopPreventsSlide: !0,
        rewind: !1,
        allowSlidePrev: !0,
        allowSlideNext: !0,
        swipeHandler: null,
        noSwiping: !0,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: !0,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: !0,
        _emitClasses: !1
    };
    function j(e, t) {
        return function(s) {
            void 0 === s && (s = {});
            const a = Object.keys(s)[0]
              , i = s[a];
            "object" == typeof i && null !== i ? (["navigation", "pagination", "scrollbar"].indexOf(a) >= 0 && !0 === e[a] && (e[a] = {
                auto: !0
            }),
            a in e && "enabled"in i ? (!0 === e[a] && (e[a] = {
                enabled: !0
            }),
            "object" != typeof e[a] || "enabled"in e[a] || (e[a].enabled = !0),
            e[a] || (e[a] = {
                enabled: !1
            }),
            g(t, s)) : g(t, s)) : g(t, s)
        }
    }
    const _ = {
        eventsEmitter: $,
        update: S,
        translate: M,
        transition: {
            setTransition: function(e, t) {
                const s = this;
                s.params.cssMode || s.$wrapperEl.transition(e),
                s.emit("setTransition", e, t)
            },
            transitionStart: function(e, t) {
                void 0 === e && (e = !0);
                const s = this
                  , {params: a} = s;
                a.cssMode || (a.autoHeight && s.updateAutoHeight(),
                P({
                    swiper: s,
                    runCallbacks: e,
                    direction: t,
                    step: "Start"
                }))
            },
            transitionEnd: function(e, t) {
                void 0 === e && (e = !0);
                const s = this
                  , {params: a} = s;
                s.animating = !1,
                a.cssMode || (s.setTransition(0),
                P({
                    swiper: s,
                    runCallbacks: e,
                    direction: t,
                    step: "End"
                }))
            }
        },
        slide: k,
        loop: z,
        grabCursor: {
            setGrabCursor: function(e) {
                const t = this;
                if (t.support.touch || !t.params.simulateTouch || t.params.watchOverflow && t.isLocked || t.params.cssMode)
                    return;
                const s = "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
                s.style.cursor = "move",
                s.style.cursor = e ? "grabbing" : "grab"
            },
            unsetGrabCursor: function() {
                const e = this;
                e.support.touch || e.params.watchOverflow && e.isLocked || e.params.cssMode || (e["container" === e.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "")
            }
        },
        events: X,
        breakpoints: {
            setBreakpoint: function() {
                const e = this
                  , {activeIndex: t, initialized: s, loopedSlides: a=0, params: i, $el: r} = e
                  , n = i.breakpoints;
                if (!n || n && 0 === Object.keys(n).length)
                    return;
                const l = e.getBreakpoint(n, e.params.breakpointsBase, e.el);
                if (!l || e.currentBreakpoint === l)
                    return;
                const o = (l in n ? n[l] : void 0) || e.originalParams
                  , d = Y(e, i)
                  , c = Y(e, o)
                  , p = i.enabled;
                d && !c ? (r.removeClass(`${i.containerModifierClass}grid ${i.containerModifierClass}grid-column`),
                e.emitContainerClasses()) : !d && c && (r.addClass(`${i.containerModifierClass}grid`),
                (o.grid.fill && "column" === o.grid.fill || !o.grid.fill && "column" === i.grid.fill) && r.addClass(`${i.containerModifierClass}grid-column`),
                e.emitContainerClasses());
                const u = o.direction && o.direction !== i.direction
                  , h = i.loop && (o.slidesPerView !== i.slidesPerView || u);
                u && s && e.changeDirection(),
                g(e.params, o);
                const m = e.params.enabled;
                Object.assign(e, {
                    allowTouchMove: e.params.allowTouchMove,
                    allowSlideNext: e.params.allowSlideNext,
                    allowSlidePrev: e.params.allowSlidePrev
                }),
                p && !m ? e.disable() : !p && m && e.enable(),
                e.currentBreakpoint = l,
                e.emit("_beforeBreakpoint", o),
                h && s && (e.loopDestroy(),
                e.loopCreate(),
                e.updateSlides(),
                e.slideTo(t - a + e.loopedSlides, 0, !1)),
                e.emit("breakpoint", o)
            },
            getBreakpoint: function(e, t, s) {
                if (void 0 === t && (t = "window"),
                !e || "container" === t && !s)
                    return;
                let a = !1;
                const i = r()
                  , n = "window" === t ? i.innerHeight : s.clientHeight
                  , l = Object.keys(e).map((e=>{
                    if ("string" == typeof e && 0 === e.indexOf("@")) {
                        const t = parseFloat(e.substr(1));
                        return {
                            value: n * t,
                            point: e
                        }
                    }
                    return {
                        value: e,
                        point: e
                    }
                }
                ));
                l.sort(((e,t)=>parseInt(e.value, 10) - parseInt(t.value, 10)));
                for (let e = 0; e < l.length; e += 1) {
                    const {point: r, value: n} = l[e];
                    "window" === t ? i.matchMedia(`(min-width: ${n}px)`).matches && (a = r) : n <= s.clientWidth && (a = r)
                }
                return a || "max"
            }
        },
        checkOverflow: {
            checkOverflow: function() {
                const e = this
                  , {isLocked: t, params: s} = e
                  , {slidesOffsetBefore: a} = s;
                if (a) {
                    const t = e.slides.length - 1
                      , s = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * a;
                    e.isLocked = e.size > s
                } else
                    e.isLocked = 1 === e.snapGrid.length;
                !0 === s.allowSlideNext && (e.allowSlideNext = !e.isLocked),
                !0 === s.allowSlidePrev && (e.allowSlidePrev = !e.isLocked),
                t && t !== e.isLocked && (e.isEnd = !1),
                t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock")
            }
        },
        classes: R,
        images: {
            loadImage: function(e, t, s, a, i, n) {
                const l = r();
                let o;
                function c() {
                    n && n()
                }
                d(e).parent("picture")[0] || e.complete && i ? c() : t ? (o = new l.Image,
                o.onload = c,
                o.onerror = c,
                a && (o.sizes = a),
                s && (o.srcset = s),
                t && (o.src = t)) : c()
            },
            preloadImages: function() {
                const e = this;
                function t() {
                    null != e && e && !e.destroyed && (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1),
                    e.imagesLoaded === e.imagesToLoad.length && (e.params.updateOnImagesReady && e.update(),
                    e.emit("imagesReady")))
                }
                e.imagesToLoad = e.$el.find("img");
                for (let s = 0; s < e.imagesToLoad.length; s += 1) {
                    const a = e.imagesToLoad[s];
                    e.loadImage(a, a.currentSrc || a.getAttribute("src"), a.srcset || a.getAttribute("srcset"), a.sizes || a.getAttribute("sizes"), !0, t)
                }
            }
        }
    }
      , q = {};
    class V {
        constructor() {
            let e, t;
            for (var s = arguments.length, a = new Array(s), i = 0; i < s; i++)
                a[i] = arguments[i];
            if (1 === a.length && a[0].constructor && "Object" === Object.prototype.toString.call(a[0]).slice(8, -1) ? t = a[0] : [e,t] = a,
            t || (t = {}),
            t = g({}, t),
            e && !t.el && (t.el = e),
            t.el && d(t.el).length > 1) {
                const e = [];
                return d(t.el).each((s=>{
                    const a = g({}, t, {
                        el: s
                    });
                    e.push(new V(a))
                }
                )),
                e
            }
            const r = this;
            r.__swiper__ = !0,
            r.support = E(),
            r.device = T({
                userAgent: t.userAgent
            }),
            r.browser = C(),
            r.eventsListeners = {},
            r.eventsAnyListeners = [],
            r.modules = [...r.__modules__],
            t.modules && Array.isArray(t.modules) && r.modules.push(...t.modules);
            const n = {};
            r.modules.forEach((e=>{
                e({
                    swiper: r,
                    extendParams: j(t, n),
                    on: r.on.bind(r),
                    once: r.once.bind(r),
                    off: r.off.bind(r),
                    emit: r.emit.bind(r)
                })
            }
            ));
            const l = g({}, W, n);
            return r.params = g({}, l, q, t),
            r.originalParams = g({}, r.params),
            r.passedParams = g({}, t),
            r.params && r.params.on && Object.keys(r.params.on).forEach((e=>{
                r.on(e, r.params.on[e])
            }
            )),
            r.params && r.params.onAny && r.onAny(r.params.onAny),
            r.$ = d,
            Object.assign(r, {
                enabled: r.params.enabled,
                el: e,
                classNames: [],
                slides: d(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal: ()=>"horizontal" === r.params.direction,
                isVertical: ()=>"vertical" === r.params.direction,
                activeIndex: 0,
                realIndex: 0,
                isBeginning: !0,
                isEnd: !1,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: !1,
                allowSlideNext: r.params.allowSlideNext,
                allowSlidePrev: r.params.allowSlidePrev,
                touchEvents: function() {
                    const e = ["touchstart", "touchmove", "touchend", "touchcancel"]
                      , t = ["pointerdown", "pointermove", "pointerup"];
                    return r.touchEventsTouch = {
                        start: e[0],
                        move: e[1],
                        end: e[2],
                        cancel: e[3]
                    },
                    r.touchEventsDesktop = {
                        start: t[0],
                        move: t[1],
                        end: t[2]
                    },
                    r.support.touch || !r.params.simulateTouch ? r.touchEventsTouch : r.touchEventsDesktop
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: r.params.focusableElements,
                    lastClickTime: u(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: !0,
                allowTouchMove: r.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            }),
            r.emit("_swiper"),
            r.params.init && r.init(),
            r
        }
        enable() {
            const e = this;
            e.enabled || (e.enabled = !0,
            e.params.grabCursor && e.setGrabCursor(),
            e.emit("enable"))
        }
        disable() {
            const e = this;
            e.enabled && (e.enabled = !1,
            e.params.grabCursor && e.unsetGrabCursor(),
            e.emit("disable"))
        }
        setProgress(e, t) {
            const s = this;
            e = Math.min(Math.max(e, 0), 1);
            const a = s.minTranslate()
              , i = (s.maxTranslate() - a) * e + a;
            s.translateTo(i, void 0 === t ? 0 : t),
            s.updateActiveIndex(),
            s.updateSlidesClasses()
        }
        emitContainerClasses() {
            const e = this;
            if (!e.params._emitClasses || !e.el)
                return;
            const t = e.el.className.split(" ").filter((t=>0 === t.indexOf("swiper") || 0 === t.indexOf(e.params.containerModifierClass)));
            e.emit("_containerClasses", t.join(" "))
        }
        getSlideClasses(e) {
            const t = this;
            return e.className.split(" ").filter((e=>0 === e.indexOf("swiper-slide") || 0 === e.indexOf(t.params.slideClass))).join(" ")
        }
        emitSlidesClasses() {
            const e = this;
            if (!e.params._emitClasses || !e.el)
                return;
            const t = [];
            e.slides.each((s=>{
                const a = e.getSlideClasses(s);
                t.push({
                    slideEl: s,
                    classNames: a
                }),
                e.emit("_slideClass", s, a)
            }
            )),
            e.emit("_slideClasses", t)
        }
        slidesPerViewDynamic(e, t) {
            void 0 === e && (e = "current"),
            void 0 === t && (t = !1);
            const {params: s, slides: a, slidesGrid: i, slidesSizesGrid: r, size: n, activeIndex: l} = this;
            let o = 1;
            if (s.centeredSlides) {
                let e, t = a[l].swiperSlideSize;
                for (let s = l + 1; s < a.length; s += 1)
                    a[s] && !e && (t += a[s].swiperSlideSize,
                    o += 1,
                    t > n && (e = !0));
                for (let s = l - 1; s >= 0; s -= 1)
                    a[s] && !e && (t += a[s].swiperSlideSize,
                    o += 1,
                    t > n && (e = !0))
            } else if ("current" === e)
                for (let e = l + 1; e < a.length; e += 1) {
                    (t ? i[e] + r[e] - i[l] < n : i[e] - i[l] < n) && (o += 1)
                }
            else
                for (let e = l - 1; e >= 0; e -= 1) {
                    i[l] - i[e] < n && (o += 1)
                }
            return o
        }
        update() {
            const e = this;
            if (!e || e.destroyed)
                return;
            const {snapGrid: t, params: s} = e;
            function a() {
                const t = e.rtlTranslate ? -1 * e.translate : e.translate
                  , s = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
                e.setTranslate(s),
                e.updateActiveIndex(),
                e.updateSlidesClasses()
            }
            let i;
            s.breakpoints && e.setBreakpoint(),
            e.updateSize(),
            e.updateSlides(),
            e.updateProgress(),
            e.updateSlidesClasses(),
            e.params.freeMode && e.params.freeMode.enabled ? (a(),
            e.params.autoHeight && e.updateAutoHeight()) : (i = ("auto" === e.params.slidesPerView || e.params.slidesPerView > 1) && e.isEnd && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0),
            i || a()),
            s.watchOverflow && t !== e.snapGrid && e.checkOverflow(),
            e.emit("update")
        }
        changeDirection(e, t) {
            void 0 === t && (t = !0);
            const s = this
              , a = s.params.direction;
            return e || (e = "horizontal" === a ? "vertical" : "horizontal"),
            e === a || "horizontal" !== e && "vertical" !== e || (s.$el.removeClass(`${s.params.containerModifierClass}${a}`).addClass(`${s.params.containerModifierClass}${e}`),
            s.emitContainerClasses(),
            s.params.direction = e,
            s.slides.each((t=>{
                "vertical" === e ? t.style.width = "" : t.style.height = ""
            }
            )),
            s.emit("changeDirection"),
            t && s.update()),
            s
        }
        mount(e) {
            const t = this;
            if (t.mounted)
                return !0;
            const s = d(e || t.params.el);
            if (!(e = s[0]))
                return !1;
            e.swiper = t;
            const i = ()=>`.${(t.params.wrapperClass || "").trim().split(" ").join(".")}`;
            let r = (()=>{
                if (e && e.shadowRoot && e.shadowRoot.querySelector) {
                    const t = d(e.shadowRoot.querySelector(i()));
                    return t.children = e=>s.children(e),
                    t
                }
                return s.children(i())
            }
            )();
            if (0 === r.length && t.params.createElements) {
                const e = a().createElement("div");
                r = d(e),
                e.className = t.params.wrapperClass,
                s.append(e),
                s.children(`.${t.params.slideClass}`).each((e=>{
                    r.append(e)
                }
                ))
            }
            return Object.assign(t, {
                $el: s,
                el: e,
                $wrapperEl: r,
                wrapperEl: r[0],
                mounted: !0,
                rtl: "rtl" === e.dir.toLowerCase() || "rtl" === s.css("direction"),
                rtlTranslate: "horizontal" === t.params.direction && ("rtl" === e.dir.toLowerCase() || "rtl" === s.css("direction")),
                wrongRTL: "-webkit-box" === r.css("display")
            }),
            !0
        }
        init(e) {
            const t = this;
            if (t.initialized)
                return t;
            return !1 === t.mount(e) || (t.emit("beforeInit"),
            t.params.breakpoints && t.setBreakpoint(),
            t.addClasses(),
            t.params.loop && t.loopCreate(),
            t.updateSize(),
            t.updateSlides(),
            t.params.watchOverflow && t.checkOverflow(),
            t.params.grabCursor && t.enabled && t.setGrabCursor(),
            t.params.preloadImages && t.preloadImages(),
            t.params.loop ? t.slideTo(t.params.initialSlide + t.loopedSlides, 0, t.params.runCallbacksOnInit, !1, !0) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0),
            t.attachEvents(),
            t.initialized = !0,
            t.emit("init"),
            t.emit("afterInit")),
            t
        }
        destroy(e, t) {
            void 0 === e && (e = !0),
            void 0 === t && (t = !0);
            const s = this
              , {params: a, $el: i, $wrapperEl: r, slides: n} = s;
            return void 0 === s.params || s.destroyed || (s.emit("beforeDestroy"),
            s.initialized = !1,
            s.detachEvents(),
            a.loop && s.loopDestroy(),
            t && (s.removeClasses(),
            i.removeAttr("style"),
            r.removeAttr("style"),
            n && n.length && n.removeClass([a.slideVisibleClass, a.slideActiveClass, a.slideNextClass, a.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index")),
            s.emit("destroy"),
            Object.keys(s.eventsListeners).forEach((e=>{
                s.off(e)
            }
            )),
            !1 !== e && (s.$el[0].swiper = null,
            function(e) {
                const t = e;
                Object.keys(t).forEach((e=>{
                    try {
                        t[e] = null
                    } catch (e) {}
                    try {
                        delete t[e]
                    } catch (e) {}
                }
                ))
            }(s)),
            s.destroyed = !0),
            null
        }
        static extendDefaults(e) {
            g(q, e)
        }
        static get extendedDefaults() {
            return q
        }
        static get defaults() {
            return W
        }
        static installModule(e) {
            V.prototype.__modules__ || (V.prototype.__modules__ = []);
            const t = V.prototype.__modules__;
            "function" == typeof e && t.indexOf(e) < 0 && t.push(e)
        }
        static use(e) {
            return Array.isArray(e) ? (e.forEach((e=>V.installModule(e))),
            V) : (V.installModule(e),
            V)
        }
    }
    function F(e, t, s, i) {
        const r = a();
        return e.params.createElements && Object.keys(i).forEach((a=>{
            if (!s[a] && !0 === s.auto) {
                let n = e.$el.children(`.${i[a]}`)[0];
                n || (n = r.createElement("div"),
                n.className = i[a],
                e.$el.append(n)),
                s[a] = n,
                t[a] = n
            }
        }
        )),
        s
    }
    function U(e) {
        return void 0 === e && (e = ""),
        `.${e.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")}`
    }
    function K(e) {
        const t = this
          , {$wrapperEl: s, params: a} = t;
        if (a.loop && t.loopDestroy(),
        "object" == typeof e && "length"in e)
            for (let t = 0; t < e.length; t += 1)
                e[t] && s.append(e[t]);
        else
            s.append(e);
        a.loop && t.loopCreate(),
        a.observer || t.update()
    }
    function Z(e) {
        const t = this
          , {params: s, $wrapperEl: a, activeIndex: i} = t;
        s.loop && t.loopDestroy();
        let r = i + 1;
        if ("object" == typeof e && "length"in e) {
            for (let t = 0; t < e.length; t += 1)
                e[t] && a.prepend(e[t]);
            r = i + e.length
        } else
            a.prepend(e);
        s.loop && t.loopCreate(),
        s.observer || t.update(),
        t.slideTo(r, 0, !1)
    }
    function J(e, t) {
        const s = this
          , {$wrapperEl: a, params: i, activeIndex: r} = s;
        let n = r;
        i.loop && (n -= s.loopedSlides,
        s.loopDestroy(),
        s.slides = a.children(`.${i.slideClass}`));
        const l = s.slides.length;
        if (e <= 0)
            return void s.prependSlide(t);
        if (e >= l)
            return void s.appendSlide(t);
        let o = n > e ? n + 1 : n;
        const d = [];
        for (let t = l - 1; t >= e; t -= 1) {
            const e = s.slides.eq(t);
            e.remove(),
            d.unshift(e)
        }
        if ("object" == typeof t && "length"in t) {
            for (let e = 0; e < t.length; e += 1)
                t[e] && a.append(t[e]);
            o = n > e ? n + t.length : n
        } else
            a.append(t);
        for (let e = 0; e < d.length; e += 1)
            a.append(d[e]);
        i.loop && s.loopCreate(),
        i.observer || s.update(),
        i.loop ? s.slideTo(o + s.loopedSlides, 0, !1) : s.slideTo(o, 0, !1)
    }
    function Q(e) {
        const t = this
          , {params: s, $wrapperEl: a, activeIndex: i} = t;
        let r = i;
        s.loop && (r -= t.loopedSlides,
        t.loopDestroy(),
        t.slides = a.children(`.${s.slideClass}`));
        let n, l = r;
        if ("object" == typeof e && "length"in e) {
            for (let s = 0; s < e.length; s += 1)
                n = e[s],
                t.slides[n] && t.slides.eq(n).remove(),
                n < l && (l -= 1);
            l = Math.max(l, 0)
        } else
            n = e,
            t.slides[n] && t.slides.eq(n).remove(),
            n < l && (l -= 1),
            l = Math.max(l, 0);
        s.loop && t.loopCreate(),
        s.observer || t.update(),
        s.loop ? t.slideTo(l + t.loopedSlides, 0, !1) : t.slideTo(l, 0, !1)
    }
    function ee() {
        const e = this
          , t = [];
        for (let s = 0; s < e.slides.length; s += 1)
            t.push(s);
        e.removeSlide(t)
    }
    function te(e) {
        const {effect: t, swiper: s, on: a, setTranslate: i, setTransition: r, overwriteParams: n, perspective: l} = e;
        let o;
        a("beforeInit", (()=>{
            if (s.params.effect !== t)
                return;
            s.classNames.push(`${s.params.containerModifierClass}${t}`),
            l && l() && s.classNames.push(`${s.params.containerModifierClass}3d`);
            const e = n ? n() : {};
            Object.assign(s.params, e),
            Object.assign(s.originalParams, e)
        }
        )),
        a("setTranslate", (()=>{
            s.params.effect === t && i()
        }
        )),
        a("setTransition", ((e,a)=>{
            s.params.effect === t && r(a)
        }
        )),
        a("virtualUpdate", (()=>{
            s.slides.length || (o = !0),
            requestAnimationFrame((()=>{
                o && s.slides && s.slides.length && (i(),
                o = !1)
            }
            ))
        }
        ))
    }
    function se(e, t) {
        return e.transformEl ? t.find(e.transformEl).css({
            "backface-visibility": "hidden",
            "-webkit-backface-visibility": "hidden"
        }) : t
    }
    function ae(e) {
        let {swiper: t, duration: s, transformEl: a, allSlides: i} = e;
        const {slides: r, activeIndex: n, $wrapperEl: l} = t;
        if (t.params.virtualTranslate && 0 !== s) {
            let e, s = !1;
            e = i ? a ? r.find(a) : r : a ? r.eq(n).find(a) : r.eq(n),
            e.transitionEnd((()=>{
                if (s)
                    return;
                if (!t || t.destroyed)
                    return;
                s = !0,
                t.animating = !1;
                const e = ["webkitTransitionEnd", "transitionend"];
                for (let t = 0; t < e.length; t += 1)
                    l.trigger(e[t])
            }
            ))
        }
    }
    function ie(e, t, s) {
        const a = "swiper-slide-shadow" + (s ? `-${s}` : "")
          , i = e.transformEl ? t.find(e.transformEl) : t;
        let r = i.children(`.${a}`);
        return r.length || (r = d(`<div class="swiper-slide-shadow${s ? `-${s}` : ""}"></div>`),
        i.append(r)),
        r
    }
    Object.keys(_).forEach((e=>{
        Object.keys(_[e]).forEach((t=>{
            V.prototype[t] = _[e][t]
        }
        ))
    }
    )),
    V.use([function(e) {
        let {swiper: t, on: s, emit: a} = e;
        const i = r();
        let n = null
          , l = null;
        const o = ()=>{
            t && !t.destroyed && t.initialized && (a("beforeResize"),
            a("resize"))
        }
          , d = ()=>{
            t && !t.destroyed && t.initialized && a("orientationchange")
        }
        ;
        s("init", (()=>{
            t.params.resizeObserver && void 0 !== i.ResizeObserver ? t && !t.destroyed && t.initialized && (n = new ResizeObserver((e=>{
                l = i.requestAnimationFrame((()=>{
                    const {width: s, height: a} = t;
                    let i = s
                      , r = a;
                    e.forEach((e=>{
                        let {contentBoxSize: s, contentRect: a, target: n} = e;
                        n && n !== t.el || (i = a ? a.width : (s[0] || s).inlineSize,
                        r = a ? a.height : (s[0] || s).blockSize)
                    }
                    )),
                    i === s && r === a || o()
                }
                ))
            }
            )),
            n.observe(t.el)) : (i.addEventListener("resize", o),
            i.addEventListener("orientationchange", d))
        }
        )),
        s("destroy", (()=>{
            l && i.cancelAnimationFrame(l),
            n && n.unobserve && t.el && (n.unobserve(t.el),
            n = null),
            i.removeEventListener("resize", o),
            i.removeEventListener("orientationchange", d)
        }
        ))
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a, emit: i} = e;
        const n = []
          , l = r()
          , o = function(e, t) {
            void 0 === t && (t = {});
            const s = new (l.MutationObserver || l.WebkitMutationObserver)((e=>{
                if (1 === e.length)
                    return void i("observerUpdate", e[0]);
                const t = function() {
                    i("observerUpdate", e[0])
                };
                l.requestAnimationFrame ? l.requestAnimationFrame(t) : l.setTimeout(t, 0)
            }
            ));
            s.observe(e, {
                attributes: void 0 === t.attributes || t.attributes,
                childList: void 0 === t.childList || t.childList,
                characterData: void 0 === t.characterData || t.characterData
            }),
            n.push(s)
        };
        s({
            observer: !1,
            observeParents: !1,
            observeSlideChildren: !1
        }),
        a("init", (()=>{
            if (t.params.observer) {
                if (t.params.observeParents) {
                    const e = t.$el.parents();
                    for (let t = 0; t < e.length; t += 1)
                        o(e[t])
                }
                o(t.$el[0], {
                    childList: t.params.observeSlideChildren
                }),
                o(t.$wrapperEl[0], {
                    attributes: !1
                })
            }
        }
        )),
        a("destroy", (()=>{
            n.forEach((e=>{
                e.disconnect()
            }
            )),
            n.splice(0, n.length)
        }
        ))
    }
    ]);
    const re = [function(e) {
        let t, {swiper: s, extendParams: a, on: i, emit: r} = e;
        function n(e, t) {
            const a = s.params.virtual;
            if (a.cache && s.virtual.cache[t])
                return s.virtual.cache[t];
            const i = a.renderSlide ? d(a.renderSlide.call(s, e, t)) : d(`<div class="${s.params.slideClass}" data-swiper-slide-index="${t}">${e}</div>`);
            return i.attr("data-swiper-slide-index") || i.attr("data-swiper-slide-index", t),
            a.cache && (s.virtual.cache[t] = i),
            i
        }
        function l(e) {
            const {slidesPerView: t, slidesPerGroup: a, centeredSlides: i} = s.params
              , {addSlidesBefore: l, addSlidesAfter: o} = s.params.virtual
              , {from: d, to: c, slides: p, slidesGrid: u, offset: h} = s.virtual;
            s.params.cssMode || s.updateActiveIndex();
            const m = s.activeIndex || 0;
            let f, g, v;
            f = s.rtlTranslate ? "right" : s.isHorizontal() ? "left" : "top",
            i ? (g = Math.floor(t / 2) + a + o,
            v = Math.floor(t / 2) + a + l) : (g = t + (a - 1) + o,
            v = a + l);
            const w = Math.max((m || 0) - v, 0)
              , b = Math.min((m || 0) + g, p.length - 1)
              , x = (s.slidesGrid[w] || 0) - (s.slidesGrid[0] || 0);
            function y() {
                s.updateSlides(),
                s.updateProgress(),
                s.updateSlidesClasses(),
                s.lazy && s.params.lazy.enabled && s.lazy.load(),
                r("virtualUpdate")
            }
            if (Object.assign(s.virtual, {
                from: w,
                to: b,
                offset: x,
                slidesGrid: s.slidesGrid
            }),
            d === w && c === b && !e)
                return s.slidesGrid !== u && x !== h && s.slides.css(f, `${x}px`),
                s.updateProgress(),
                void r("virtualUpdate");
            if (s.params.virtual.renderExternal)
                return s.params.virtual.renderExternal.call(s, {
                    offset: x,
                    from: w,
                    to: b,
                    slides: function() {
                        const e = [];
                        for (let t = w; t <= b; t += 1)
                            e.push(p[t]);
                        return e
                    }()
                }),
                void (s.params.virtual.renderExternalUpdate ? y() : r("virtualUpdate"));
            const E = []
              , T = [];
            if (e)
                s.$wrapperEl.find(`.${s.params.slideClass}`).remove();
            else
                for (let e = d; e <= c; e += 1)
                    (e < w || e > b) && s.$wrapperEl.find(`.${s.params.slideClass}[data-swiper-slide-index="${e}"]`).remove();
            for (let t = 0; t < p.length; t += 1)
                t >= w && t <= b && (void 0 === c || e ? T.push(t) : (t > c && T.push(t),
                t < d && E.push(t)));
            T.forEach((e=>{
                s.$wrapperEl.append(n(p[e], e))
            }
            )),
            E.sort(((e,t)=>t - e)).forEach((e=>{
                s.$wrapperEl.prepend(n(p[e], e))
            }
            )),
            s.$wrapperEl.children(".swiper-slide").css(f, `${x}px`),
            y()
        }
        a({
            virtual: {
                enabled: !1,
                slides: [],
                cache: !0,
                renderSlide: null,
                renderExternal: null,
                renderExternalUpdate: !0,
                addSlidesBefore: 0,
                addSlidesAfter: 0
            }
        }),
        s.virtual = {
            cache: {},
            from: void 0,
            to: void 0,
            slides: [],
            offset: 0,
            slidesGrid: []
        },
        i("beforeInit", (()=>{
            s.params.virtual.enabled && (s.virtual.slides = s.params.virtual.slides,
            s.classNames.push(`${s.params.containerModifierClass}virtual`),
            s.params.watchSlidesProgress = !0,
            s.originalParams.watchSlidesProgress = !0,
            s.params.initialSlide || l())
        }
        )),
        i("setTranslate", (()=>{
            s.params.virtual.enabled && (s.params.cssMode && !s._immediateVirtual ? (clearTimeout(t),
            t = setTimeout((()=>{
                l()
            }
            ), 100)) : l())
        }
        )),
        i("init update resize", (()=>{
            s.params.virtual.enabled && s.params.cssMode && v(s.wrapperEl, "--swiper-virtual-size", `${s.virtualSize}px`)
        }
        )),
        Object.assign(s.virtual, {
            appendSlide: function(e) {
                if ("object" == typeof e && "length"in e)
                    for (let t = 0; t < e.length; t += 1)
                        e[t] && s.virtual.slides.push(e[t]);
                else
                    s.virtual.slides.push(e);
                l(!0)
            },
            prependSlide: function(e) {
                const t = s.activeIndex;
                let a = t + 1
                  , i = 1;
                if (Array.isArray(e)) {
                    for (let t = 0; t < e.length; t += 1)
                        e[t] && s.virtual.slides.unshift(e[t]);
                    a = t + e.length,
                    i = e.length
                } else
                    s.virtual.slides.unshift(e);
                if (s.params.virtual.cache) {
                    const e = s.virtual.cache
                      , t = {};
                    Object.keys(e).forEach((s=>{
                        const a = e[s]
                          , r = a.attr("data-swiper-slide-index");
                        r && a.attr("data-swiper-slide-index", parseInt(r, 10) + i),
                        t[parseInt(s, 10) + i] = a
                    }
                    )),
                    s.virtual.cache = t
                }
                l(!0),
                s.slideTo(a, 0)
            },
            removeSlide: function(e) {
                if (null == e)
                    return;
                let t = s.activeIndex;
                if (Array.isArray(e))
                    for (let a = e.length - 1; a >= 0; a -= 1)
                        s.virtual.slides.splice(e[a], 1),
                        s.params.virtual.cache && delete s.virtual.cache[e[a]],
                        e[a] < t && (t -= 1),
                        t = Math.max(t, 0);
                else
                    s.virtual.slides.splice(e, 1),
                    s.params.virtual.cache && delete s.virtual.cache[e],
                    e < t && (t -= 1),
                    t = Math.max(t, 0);
                l(!0),
                s.slideTo(t, 0)
            },
            removeAllSlides: function() {
                s.virtual.slides = [],
                s.params.virtual.cache && (s.virtual.cache = {}),
                l(!0),
                s.slideTo(0, 0)
            },
            update: l
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: i, emit: n} = e;
        const l = a()
          , o = r();
        function c(e) {
            if (!t.enabled)
                return;
            const {rtlTranslate: s} = t;
            let a = e;
            a.originalEvent && (a = a.originalEvent);
            const i = a.keyCode || a.charCode
              , r = t.params.keyboard.pageUpDown
              , d = r && 33 === i
              , c = r && 34 === i
              , p = 37 === i
              , u = 39 === i
              , h = 38 === i
              , m = 40 === i;
            if (!t.allowSlideNext && (t.isHorizontal() && u || t.isVertical() && m || c))
                return !1;
            if (!t.allowSlidePrev && (t.isHorizontal() && p || t.isVertical() && h || d))
                return !1;
            if (!(a.shiftKey || a.altKey || a.ctrlKey || a.metaKey || l.activeElement && l.activeElement.nodeName && ("input" === l.activeElement.nodeName.toLowerCase() || "textarea" === l.activeElement.nodeName.toLowerCase()))) {
                if (t.params.keyboard.onlyInViewport && (d || c || p || u || h || m)) {
                    let e = !1;
                    if (t.$el.parents(`.${t.params.slideClass}`).length > 0 && 0 === t.$el.parents(`.${t.params.slideActiveClass}`).length)
                        return;
                    const a = t.$el
                      , i = a[0].clientWidth
                      , r = a[0].clientHeight
                      , n = o.innerWidth
                      , l = o.innerHeight
                      , d = t.$el.offset();
                    s && (d.left -= t.$el[0].scrollLeft);
                    const c = [[d.left, d.top], [d.left + i, d.top], [d.left, d.top + r], [d.left + i, d.top + r]];
                    for (let t = 0; t < c.length; t += 1) {
                        const s = c[t];
                        if (s[0] >= 0 && s[0] <= n && s[1] >= 0 && s[1] <= l) {
                            if (0 === s[0] && 0 === s[1])
                                continue;
                            e = !0
                        }
                    }
                    if (!e)
                        return
                }
                t.isHorizontal() ? ((d || c || p || u) && (a.preventDefault ? a.preventDefault() : a.returnValue = !1),
                ((c || u) && !s || (d || p) && s) && t.slideNext(),
                ((d || p) && !s || (c || u) && s) && t.slidePrev()) : ((d || c || h || m) && (a.preventDefault ? a.preventDefault() : a.returnValue = !1),
                (c || m) && t.slideNext(),
                (d || h) && t.slidePrev()),
                n("keyPress", i)
            }
        }
        function p() {
            t.keyboard.enabled || (d(l).on("keydown", c),
            t.keyboard.enabled = !0)
        }
        function u() {
            t.keyboard.enabled && (d(l).off("keydown", c),
            t.keyboard.enabled = !1)
        }
        t.keyboard = {
            enabled: !1
        },
        s({
            keyboard: {
                enabled: !1,
                onlyInViewport: !0,
                pageUpDown: !0
            }
        }),
        i("init", (()=>{
            t.params.keyboard.enabled && p()
        }
        )),
        i("destroy", (()=>{
            t.keyboard.enabled && u()
        }
        )),
        Object.assign(t.keyboard, {
            enable: p,
            disable: u
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a, emit: i} = e;
        const n = r();
        let l;
        s({
            mousewheel: {
                enabled: !1,
                releaseOnEdges: !1,
                invert: !1,
                forceToAxis: !1,
                sensitivity: 1,
                eventsTarget: "container",
                thresholdDelta: null,
                thresholdTime: null
            }
        }),
        t.mousewheel = {
            enabled: !1
        };
        let o, c = u();
        const h = [];
        function m() {
            t.enabled && (t.mouseEntered = !0)
        }
        function f() {
            t.enabled && (t.mouseEntered = !1)
        }
        function g(e) {
            return !(t.params.mousewheel.thresholdDelta && e.delta < t.params.mousewheel.thresholdDelta) && (!(t.params.mousewheel.thresholdTime && u() - c < t.params.mousewheel.thresholdTime) && (e.delta >= 6 && u() - c < 60 || (e.direction < 0 ? t.isEnd && !t.params.loop || t.animating || (t.slideNext(),
            i("scroll", e.raw)) : t.isBeginning && !t.params.loop || t.animating || (t.slidePrev(),
            i("scroll", e.raw)),
            c = (new n.Date).getTime(),
            !1)))
        }
        function v(e) {
            let s = e
              , a = !0;
            if (!t.enabled)
                return;
            const r = t.params.mousewheel;
            t.params.cssMode && s.preventDefault();
            let n = t.$el;
            if ("container" !== t.params.mousewheel.eventsTarget && (n = d(t.params.mousewheel.eventsTarget)),
            !t.mouseEntered && !n[0].contains(s.target) && !r.releaseOnEdges)
                return !0;
            s.originalEvent && (s = s.originalEvent);
            let c = 0;
            const m = t.rtlTranslate ? -1 : 1
              , f = function(e) {
                let t = 0
                  , s = 0
                  , a = 0
                  , i = 0;
                return "detail"in e && (s = e.detail),
                "wheelDelta"in e && (s = -e.wheelDelta / 120),
                "wheelDeltaY"in e && (s = -e.wheelDeltaY / 120),
                "wheelDeltaX"in e && (t = -e.wheelDeltaX / 120),
                "axis"in e && e.axis === e.HORIZONTAL_AXIS && (t = s,
                s = 0),
                a = 10 * t,
                i = 10 * s,
                "deltaY"in e && (i = e.deltaY),
                "deltaX"in e && (a = e.deltaX),
                e.shiftKey && !a && (a = i,
                i = 0),
                (a || i) && e.deltaMode && (1 === e.deltaMode ? (a *= 40,
                i *= 40) : (a *= 800,
                i *= 800)),
                a && !t && (t = a < 1 ? -1 : 1),
                i && !s && (s = i < 1 ? -1 : 1),
                {
                    spinX: t,
                    spinY: s,
                    pixelX: a,
                    pixelY: i
                }
            }(s);
            if (r.forceToAxis)
                if (t.isHorizontal()) {
                    if (!(Math.abs(f.pixelX) > Math.abs(f.pixelY)))
                        return !0;
                    c = -f.pixelX * m
                } else {
                    if (!(Math.abs(f.pixelY) > Math.abs(f.pixelX)))
                        return !0;
                    c = -f.pixelY
                }
            else
                c = Math.abs(f.pixelX) > Math.abs(f.pixelY) ? -f.pixelX * m : -f.pixelY;
            if (0 === c)
                return !0;
            r.invert && (c = -c);
            let v = t.getTranslate() + c * r.sensitivity;
            if (v >= t.minTranslate() && (v = t.minTranslate()),
            v <= t.maxTranslate() && (v = t.maxTranslate()),
            a = !!t.params.loop || !(v === t.minTranslate() || v === t.maxTranslate()),
            a && t.params.nested && s.stopPropagation(),
            t.params.freeMode && t.params.freeMode.enabled) {
                const e = {
                    time: u(),
                    delta: Math.abs(c),
                    direction: Math.sign(c)
                }
                  , a = o && e.time < o.time + 500 && e.delta <= o.delta && e.direction === o.direction;
                if (!a) {
                    o = void 0,
                    t.params.loop && t.loopFix();
                    let n = t.getTranslate() + c * r.sensitivity;
                    const d = t.isBeginning
                      , u = t.isEnd;
                    if (n >= t.minTranslate() && (n = t.minTranslate()),
                    n <= t.maxTranslate() && (n = t.maxTranslate()),
                    t.setTransition(0),
                    t.setTranslate(n),
                    t.updateProgress(),
                    t.updateActiveIndex(),
                    t.updateSlidesClasses(),
                    (!d && t.isBeginning || !u && t.isEnd) && t.updateSlidesClasses(),
                    t.params.freeMode.sticky) {
                        clearTimeout(l),
                        l = void 0,
                        h.length >= 15 && h.shift();
                        const s = h.length ? h[h.length - 1] : void 0
                          , a = h[0];
                        if (h.push(e),
                        s && (e.delta > s.delta || e.direction !== s.direction))
                            h.splice(0);
                        else if (h.length >= 15 && e.time - a.time < 500 && a.delta - e.delta >= 1 && e.delta <= 6) {
                            const s = c > 0 ? .8 : .2;
                            o = e,
                            h.splice(0),
                            l = p((()=>{
                                t.slideToClosest(t.params.speed, !0, void 0, s)
                            }
                            ), 0)
                        }
                        l || (l = p((()=>{
                            o = e,
                            h.splice(0),
                            t.slideToClosest(t.params.speed, !0, void 0, .5)
                        }
                        ), 500))
                    }
                    if (a || i("scroll", s),
                    t.params.autoplay && t.params.autoplayDisableOnInteraction && t.autoplay.stop(),
                    n === t.minTranslate() || n === t.maxTranslate())
                        return !0
                }
            } else {
                const s = {
                    time: u(),
                    delta: Math.abs(c),
                    direction: Math.sign(c),
                    raw: e
                };
                h.length >= 2 && h.shift();
                const a = h.length ? h[h.length - 1] : void 0;
                if (h.push(s),
                a ? (s.direction !== a.direction || s.delta > a.delta || s.time > a.time + 150) && g(s) : g(s),
                function(e) {
                    const s = t.params.mousewheel;
                    if (e.direction < 0) {
                        if (t.isEnd && !t.params.loop && s.releaseOnEdges)
                            return !0
                    } else if (t.isBeginning && !t.params.loop && s.releaseOnEdges)
                        return !0;
                    return !1
                }(s))
                    return !0
            }
            return s.preventDefault ? s.preventDefault() : s.returnValue = !1,
            !1
        }
        function w(e) {
            let s = t.$el;
            "container" !== t.params.mousewheel.eventsTarget && (s = d(t.params.mousewheel.eventsTarget)),
            s[e]("mouseenter", m),
            s[e]("mouseleave", f),
            s[e]("wheel", v)
        }
        function b() {
            return t.params.cssMode ? (t.wrapperEl.removeEventListener("wheel", v),
            !0) : !t.mousewheel.enabled && (w("on"),
            t.mousewheel.enabled = !0,
            !0)
        }
        function x() {
            return t.params.cssMode ? (t.wrapperEl.addEventListener(event, v),
            !0) : !!t.mousewheel.enabled && (w("off"),
            t.mousewheel.enabled = !1,
            !0)
        }
        a("init", (()=>{
            !t.params.mousewheel.enabled && t.params.cssMode && x(),
            t.params.mousewheel.enabled && b()
        }
        )),
        a("destroy", (()=>{
            t.params.cssMode && b(),
            t.mousewheel.enabled && x()
        }
        )),
        Object.assign(t.mousewheel, {
            enable: b,
            disable: x
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a, emit: i} = e;
        function r(e) {
            let s;
            return e && (s = d(e),
            t.params.uniqueNavElements && "string" == typeof e && s.length > 1 && 1 === t.$el.find(e).length && (s = t.$el.find(e))),
            s
        }
        function n(e, s) {
            const a = t.params.navigation;
            e && e.length > 0 && (e[s ? "addClass" : "removeClass"](a.disabledClass),
            e[0] && "BUTTON" === e[0].tagName && (e[0].disabled = s),
            t.params.watchOverflow && t.enabled && e[t.isLocked ? "addClass" : "removeClass"](a.lockClass))
        }
        function l() {
            if (t.params.loop)
                return;
            const {$nextEl: e, $prevEl: s} = t.navigation;
            n(s, t.isBeginning && !t.params.rewind),
            n(e, t.isEnd && !t.params.rewind)
        }
        function o(e) {
            e.preventDefault(),
            (!t.isBeginning || t.params.loop || t.params.rewind) && t.slidePrev()
        }
        function c(e) {
            e.preventDefault(),
            (!t.isEnd || t.params.loop || t.params.rewind) && t.slideNext()
        }
        function p() {
            const e = t.params.navigation;
            if (t.params.navigation = F(t, t.originalParams.navigation, t.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            }),
            !e.nextEl && !e.prevEl)
                return;
            const s = r(e.nextEl)
              , a = r(e.prevEl);
            s && s.length > 0 && s.on("click", c),
            a && a.length > 0 && a.on("click", o),
            Object.assign(t.navigation, {
                $nextEl: s,
                nextEl: s && s[0],
                $prevEl: a,
                prevEl: a && a[0]
            }),
            t.enabled || (s && s.addClass(e.lockClass),
            a && a.addClass(e.lockClass))
        }
        function u() {
            const {$nextEl: e, $prevEl: s} = t.navigation;
            e && e.length && (e.off("click", c),
            e.removeClass(t.params.navigation.disabledClass)),
            s && s.length && (s.off("click", o),
            s.removeClass(t.params.navigation.disabledClass))
        }
        s({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: !1,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock"
            }
        }),
        t.navigation = {
            nextEl: null,
            $nextEl: null,
            prevEl: null,
            $prevEl: null
        },
        a("init", (()=>{
            p(),
            l()
        }
        )),
        a("toEdge fromEdge lock unlock", (()=>{
            l()
        }
        )),
        a("destroy", (()=>{
            u()
        }
        )),
        a("enable disable", (()=>{
            const {$nextEl: e, $prevEl: s} = t.navigation;
            e && e[t.enabled ? "removeClass" : "addClass"](t.params.navigation.lockClass),
            s && s[t.enabled ? "removeClass" : "addClass"](t.params.navigation.lockClass)
        }
        )),
        a("click", ((e,s)=>{
            const {$nextEl: a, $prevEl: r} = t.navigation
              , n = s.target;
            if (t.params.navigation.hideOnClick && !d(n).is(r) && !d(n).is(a)) {
                if (t.pagination && t.params.pagination && t.params.pagination.clickable && (t.pagination.el === n || t.pagination.el.contains(n)))
                    return;
                let e;
                a ? e = a.hasClass(t.params.navigation.hiddenClass) : r && (e = r.hasClass(t.params.navigation.hiddenClass)),
                i(!0 === e ? "navigationShow" : "navigationHide"),
                a && a.toggleClass(t.params.navigation.hiddenClass),
                r && r.toggleClass(t.params.navigation.hiddenClass)
            }
        }
        )),
        Object.assign(t.navigation, {
            update: l,
            init: p,
            destroy: u
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a, emit: i} = e;
        const r = "swiper-pagination";
        let n;
        s({
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: !1,
                hideOnClick: !1,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: !1,
                type: "bullets",
                dynamicBullets: !1,
                dynamicMainBullets: 1,
                formatFractionCurrent: e=>e,
                formatFractionTotal: e=>e,
                bulletClass: `${r}-bullet`,
                bulletActiveClass: `${r}-bullet-active`,
                modifierClass: `${r}-`,
                currentClass: `${r}-current`,
                totalClass: `${r}-total`,
                hiddenClass: `${r}-hidden`,
                progressbarFillClass: `${r}-progressbar-fill`,
                progressbarOppositeClass: `${r}-progressbar-opposite`,
                clickableClass: `${r}-clickable`,
                lockClass: `${r}-lock`,
                horizontalClass: `${r}-horizontal`,
                verticalClass: `${r}-vertical`
            }
        }),
        t.pagination = {
            el: null,
            $el: null,
            bullets: []
        };
        let l = 0;
        function o() {
            return !t.params.pagination.el || !t.pagination.el || !t.pagination.$el || 0 === t.pagination.$el.length
        }
        function c(e, s) {
            const {bulletActiveClass: a} = t.params.pagination;
            e[s]().addClass(`${a}-${s}`)[s]().addClass(`${a}-${s}-${s}`)
        }
        function p() {
            const e = t.rtl
              , s = t.params.pagination;
            if (o())
                return;
            const a = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length
              , r = t.pagination.$el;
            let p;
            const u = t.params.loop ? Math.ceil((a - 2 * t.loopedSlides) / t.params.slidesPerGroup) : t.snapGrid.length;
            if (t.params.loop ? (p = Math.ceil((t.activeIndex - t.loopedSlides) / t.params.slidesPerGroup),
            p > a - 1 - 2 * t.loopedSlides && (p -= a - 2 * t.loopedSlides),
            p > u - 1 && (p -= u),
            p < 0 && "bullets" !== t.params.paginationType && (p = u + p)) : p = void 0 !== t.snapIndex ? t.snapIndex : t.activeIndex || 0,
            "bullets" === s.type && t.pagination.bullets && t.pagination.bullets.length > 0) {
                const a = t.pagination.bullets;
                let i, o, u;
                if (s.dynamicBullets && (n = a.eq(0)[t.isHorizontal() ? "outerWidth" : "outerHeight"](!0),
                r.css(t.isHorizontal() ? "width" : "height", n * (s.dynamicMainBullets + 4) + "px"),
                s.dynamicMainBullets > 1 && void 0 !== t.previousIndex && (l += p - (t.previousIndex - t.loopedSlides || 0),
                l > s.dynamicMainBullets - 1 ? l = s.dynamicMainBullets - 1 : l < 0 && (l = 0)),
                i = Math.max(p - l, 0),
                o = i + (Math.min(a.length, s.dynamicMainBullets) - 1),
                u = (o + i) / 2),
                a.removeClass(["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((e=>`${s.bulletActiveClass}${e}`)).join(" ")),
                r.length > 1)
                    a.each((e=>{
                        const t = d(e)
                          , a = t.index();
                        a === p && t.addClass(s.bulletActiveClass),
                        s.dynamicBullets && (a >= i && a <= o && t.addClass(`${s.bulletActiveClass}-main`),
                        a === i && c(t, "prev"),
                        a === o && c(t, "next"))
                    }
                    ));
                else {
                    const e = a.eq(p)
                      , r = e.index();
                    if (e.addClass(s.bulletActiveClass),
                    s.dynamicBullets) {
                        const e = a.eq(i)
                          , n = a.eq(o);
                        for (let e = i; e <= o; e += 1)
                            a.eq(e).addClass(`${s.bulletActiveClass}-main`);
                        if (t.params.loop)
                            if (r >= a.length) {
                                for (let e = s.dynamicMainBullets; e >= 0; e -= 1)
                                    a.eq(a.length - e).addClass(`${s.bulletActiveClass}-main`);
                                a.eq(a.length - s.dynamicMainBullets - 1).addClass(`${s.bulletActiveClass}-prev`)
                            } else
                                c(e, "prev"),
                                c(n, "next");
                        else
                            c(e, "prev"),
                            c(n, "next")
                    }
                }
                if (s.dynamicBullets) {
                    const i = Math.min(a.length, s.dynamicMainBullets + 4)
                      , r = (n * i - n) / 2 - u * n
                      , l = e ? "right" : "left";
                    a.css(t.isHorizontal() ? l : "top", `${r}px`)
                }
            }
            if ("fraction" === s.type && (r.find(U(s.currentClass)).text(s.formatFractionCurrent(p + 1)),
            r.find(U(s.totalClass)).text(s.formatFractionTotal(u))),
            "progressbar" === s.type) {
                let e;
                e = s.progressbarOpposite ? t.isHorizontal() ? "vertical" : "horizontal" : t.isHorizontal() ? "horizontal" : "vertical";
                const a = (p + 1) / u;
                let i = 1
                  , n = 1;
                "horizontal" === e ? i = a : n = a,
                r.find(U(s.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${i}) scaleY(${n})`).transition(t.params.speed)
            }
            "custom" === s.type && s.renderCustom ? (r.html(s.renderCustom(t, p + 1, u)),
            i("paginationRender", r[0])) : i("paginationUpdate", r[0]),
            t.params.watchOverflow && t.enabled && r[t.isLocked ? "addClass" : "removeClass"](s.lockClass)
        }
        function u() {
            const e = t.params.pagination;
            if (o())
                return;
            const s = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length
              , a = t.pagination.$el;
            let r = "";
            if ("bullets" === e.type) {
                let i = t.params.loop ? Math.ceil((s - 2 * t.loopedSlides) / t.params.slidesPerGroup) : t.snapGrid.length;
                t.params.freeMode && t.params.freeMode.enabled && !t.params.loop && i > s && (i = s);
                for (let s = 0; s < i; s += 1)
                    e.renderBullet ? r += e.renderBullet.call(t, s, e.bulletClass) : r += `<${e.bulletElement} class="${e.bulletClass}"></${e.bulletElement}>`;
                a.html(r),
                t.pagination.bullets = a.find(U(e.bulletClass))
            }
            "fraction" === e.type && (r = e.renderFraction ? e.renderFraction.call(t, e.currentClass, e.totalClass) : `<span class="${e.currentClass}"></span> / <span class="${e.totalClass}"></span>`,
            a.html(r)),
            "progressbar" === e.type && (r = e.renderProgressbar ? e.renderProgressbar.call(t, e.progressbarFillClass) : `<span class="${e.progressbarFillClass}"></span>`,
            a.html(r)),
            "custom" !== e.type && i("paginationRender", t.pagination.$el[0])
        }
        function h() {
            t.params.pagination = F(t, t.originalParams.pagination, t.params.pagination, {
                el: "swiper-pagination"
            });
            const e = t.params.pagination;
            if (!e.el)
                return;
            let s = d(e.el);
            0 !== s.length && (t.params.uniqueNavElements && "string" == typeof e.el && s.length > 1 && (s = t.$el.find(e.el),
            s.length > 1 && (s = s.filter((e=>d(e).parents(".swiper")[0] === t.el)))),
            "bullets" === e.type && e.clickable && s.addClass(e.clickableClass),
            s.addClass(e.modifierClass + e.type),
            s.addClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass),
            "bullets" === e.type && e.dynamicBullets && (s.addClass(`${e.modifierClass}${e.type}-dynamic`),
            l = 0,
            e.dynamicMainBullets < 1 && (e.dynamicMainBullets = 1)),
            "progressbar" === e.type && e.progressbarOpposite && s.addClass(e.progressbarOppositeClass),
            e.clickable && s.on("click", U(e.bulletClass), (function(e) {
                e.preventDefault();
                let s = d(this).index() * t.params.slidesPerGroup;
                t.params.loop && (s += t.loopedSlides),
                t.slideTo(s)
            }
            )),
            Object.assign(t.pagination, {
                $el: s,
                el: s[0]
            }),
            t.enabled || s.addClass(e.lockClass))
        }
        function m() {
            const e = t.params.pagination;
            if (o())
                return;
            const s = t.pagination.$el;
            s.removeClass(e.hiddenClass),
            s.removeClass(e.modifierClass + e.type),
            s.removeClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass),
            t.pagination.bullets && t.pagination.bullets.removeClass && t.pagination.bullets.removeClass(e.bulletActiveClass),
            e.clickable && s.off("click", U(e.bulletClass))
        }
        a("init", (()=>{
            h(),
            u(),
            p()
        }
        )),
        a("activeIndexChange", (()=>{
            (t.params.loop || void 0 === t.snapIndex) && p()
        }
        )),
        a("snapIndexChange", (()=>{
            t.params.loop || p()
        }
        )),
        a("slidesLengthChange", (()=>{
            t.params.loop && (u(),
            p())
        }
        )),
        a("snapGridLengthChange", (()=>{
            t.params.loop || (u(),
            p())
        }
        )),
        a("destroy", (()=>{
            m()
        }
        )),
        a("enable disable", (()=>{
            const {$el: e} = t.pagination;
            e && e[t.enabled ? "removeClass" : "addClass"](t.params.pagination.lockClass)
        }
        )),
        a("lock unlock", (()=>{
            p()
        }
        )),
        a("click", ((e,s)=>{
            const a = s.target
              , {$el: r} = t.pagination;
            if (t.params.pagination.el && t.params.pagination.hideOnClick && r.length > 0 && !d(a).hasClass(t.params.pagination.bulletClass)) {
                if (t.navigation && (t.navigation.nextEl && a === t.navigation.nextEl || t.navigation.prevEl && a === t.navigation.prevEl))
                    return;
                const e = r.hasClass(t.params.pagination.hiddenClass);
                i(!0 === e ? "paginationShow" : "paginationHide"),
                r.toggleClass(t.params.pagination.hiddenClass)
            }
        }
        )),
        Object.assign(t.pagination, {
            render: u,
            update: p,
            init: h,
            destroy: m
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: i, emit: r} = e;
        const n = a();
        let l, o, c, u, h = !1, m = null, f = null;
        function g() {
            if (!t.params.scrollbar.el || !t.scrollbar.el)
                return;
            const {scrollbar: e, rtlTranslate: s, progress: a} = t
              , {$dragEl: i, $el: r} = e
              , n = t.params.scrollbar;
            let l = o
              , d = (c - o) * a;
            s ? (d = -d,
            d > 0 ? (l = o - d,
            d = 0) : -d + o > c && (l = c + d)) : d < 0 ? (l = o + d,
            d = 0) : d + o > c && (l = c - d),
            t.isHorizontal() ? (i.transform(`translate3d(${d}px, 0, 0)`),
            i[0].style.width = `${l}px`) : (i.transform(`translate3d(0px, ${d}px, 0)`),
            i[0].style.height = `${l}px`),
            n.hide && (clearTimeout(m),
            r[0].style.opacity = 1,
            m = setTimeout((()=>{
                r[0].style.opacity = 0,
                r.transition(400)
            }
            ), 1e3))
        }
        function v() {
            if (!t.params.scrollbar.el || !t.scrollbar.el)
                return;
            const {scrollbar: e} = t
              , {$dragEl: s, $el: a} = e;
            s[0].style.width = "",
            s[0].style.height = "",
            c = t.isHorizontal() ? a[0].offsetWidth : a[0].offsetHeight,
            u = t.size / (t.virtualSize + t.params.slidesOffsetBefore - (t.params.centeredSlides ? t.snapGrid[0] : 0)),
            o = "auto" === t.params.scrollbar.dragSize ? c * u : parseInt(t.params.scrollbar.dragSize, 10),
            t.isHorizontal() ? s[0].style.width = `${o}px` : s[0].style.height = `${o}px`,
            a[0].style.display = u >= 1 ? "none" : "",
            t.params.scrollbar.hide && (a[0].style.opacity = 0),
            t.params.watchOverflow && t.enabled && e.$el[t.isLocked ? "addClass" : "removeClass"](t.params.scrollbar.lockClass)
        }
        function w(e) {
            return t.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientX : e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientY : e.clientY
        }
        function b(e) {
            const {scrollbar: s, rtlTranslate: a} = t
              , {$el: i} = s;
            let r;
            r = (w(e) - i.offset()[t.isHorizontal() ? "left" : "top"] - (null !== l ? l : o / 2)) / (c - o),
            r = Math.max(Math.min(r, 1), 0),
            a && (r = 1 - r);
            const n = t.minTranslate() + (t.maxTranslate() - t.minTranslate()) * r;
            t.updateProgress(n),
            t.setTranslate(n),
            t.updateActiveIndex(),
            t.updateSlidesClasses()
        }
        function x(e) {
            const s = t.params.scrollbar
              , {scrollbar: a, $wrapperEl: i} = t
              , {$el: n, $dragEl: o} = a;
            h = !0,
            l = e.target === o[0] || e.target === o ? w(e) - e.target.getBoundingClientRect()[t.isHorizontal() ? "left" : "top"] : null,
            e.preventDefault(),
            e.stopPropagation(),
            i.transition(100),
            o.transition(100),
            b(e),
            clearTimeout(f),
            n.transition(0),
            s.hide && n.css("opacity", 1),
            t.params.cssMode && t.$wrapperEl.css("scroll-snap-type", "none"),
            r("scrollbarDragStart", e)
        }
        function y(e) {
            const {scrollbar: s, $wrapperEl: a} = t
              , {$el: i, $dragEl: n} = s;
            h && (e.preventDefault ? e.preventDefault() : e.returnValue = !1,
            b(e),
            a.transition(0),
            i.transition(0),
            n.transition(0),
            r("scrollbarDragMove", e))
        }
        function E(e) {
            const s = t.params.scrollbar
              , {scrollbar: a, $wrapperEl: i} = t
              , {$el: n} = a;
            h && (h = !1,
            t.params.cssMode && (t.$wrapperEl.css("scroll-snap-type", ""),
            i.transition("")),
            s.hide && (clearTimeout(f),
            f = p((()=>{
                n.css("opacity", 0),
                n.transition(400)
            }
            ), 1e3)),
            r("scrollbarDragEnd", e),
            s.snapOnRelease && t.slideToClosest())
        }
        function T(e) {
            const {scrollbar: s, touchEventsTouch: a, touchEventsDesktop: i, params: r, support: l} = t
              , o = s.$el[0]
              , d = !(!l.passiveListener || !r.passiveListeners) && {
                passive: !1,
                capture: !1
            }
              , c = !(!l.passiveListener || !r.passiveListeners) && {
                passive: !0,
                capture: !1
            };
            if (!o)
                return;
            const p = "on" === e ? "addEventListener" : "removeEventListener";
            l.touch ? (o[p](a.start, x, d),
            o[p](a.move, y, d),
            o[p](a.end, E, c)) : (o[p](i.start, x, d),
            n[p](i.move, y, d),
            n[p](i.end, E, c))
        }
        function C() {
            const {scrollbar: e, $el: s} = t;
            t.params.scrollbar = F(t, t.originalParams.scrollbar, t.params.scrollbar, {
                el: "swiper-scrollbar"
            });
            const a = t.params.scrollbar;
            if (!a.el)
                return;
            let i = d(a.el);
            t.params.uniqueNavElements && "string" == typeof a.el && i.length > 1 && 1 === s.find(a.el).length && (i = s.find(a.el));
            let r = i.find(`.${t.params.scrollbar.dragClass}`);
            0 === r.length && (r = d(`<div class="${t.params.scrollbar.dragClass}"></div>`),
            i.append(r)),
            Object.assign(e, {
                $el: i,
                el: i[0],
                $dragEl: r,
                dragEl: r[0]
            }),
            a.draggable && t.params.scrollbar.el && T("on"),
            i && i[t.enabled ? "removeClass" : "addClass"](t.params.scrollbar.lockClass)
        }
        function $() {
            t.params.scrollbar.el && T("off")
        }
        s({
            scrollbar: {
                el: null,
                dragSize: "auto",
                hide: !1,
                draggable: !1,
                snapOnRelease: !0,
                lockClass: "swiper-scrollbar-lock",
                dragClass: "swiper-scrollbar-drag"
            }
        }),
        t.scrollbar = {
            el: null,
            dragEl: null,
            $el: null,
            $dragEl: null
        },
        i("init", (()=>{
            C(),
            v(),
            g()
        }
        )),
        i("update resize observerUpdate lock unlock", (()=>{
            v()
        }
        )),
        i("setTranslate", (()=>{
            g()
        }
        )),
        i("setTransition", ((e,s)=>{
            !function(e) {
                t.params.scrollbar.el && t.scrollbar.el && t.scrollbar.$dragEl.transition(e)
            }(s)
        }
        )),
        i("enable disable", (()=>{
            const {$el: e} = t.scrollbar;
            e && e[t.enabled ? "removeClass" : "addClass"](t.params.scrollbar.lockClass)
        }
        )),
        i("destroy", (()=>{
            $()
        }
        )),
        Object.assign(t.scrollbar, {
            updateSize: v,
            setTranslate: g,
            init: C,
            destroy: $
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        s({
            parallax: {
                enabled: !1
            }
        });
        const i = (e,s)=>{
            const {rtl: a} = t
              , i = d(e)
              , r = a ? -1 : 1
              , n = i.attr("data-swiper-parallax") || "0";
            let l = i.attr("data-swiper-parallax-x")
              , o = i.attr("data-swiper-parallax-y");
            const c = i.attr("data-swiper-parallax-scale")
              , p = i.attr("data-swiper-parallax-opacity");
            if (l || o ? (l = l || "0",
            o = o || "0") : t.isHorizontal() ? (l = n,
            o = "0") : (o = n,
            l = "0"),
            l = l.indexOf("%") >= 0 ? parseInt(l, 10) * s * r + "%" : l * s * r + "px",
            o = o.indexOf("%") >= 0 ? parseInt(o, 10) * s + "%" : o * s + "px",
            null != p) {
                const e = p - (p - 1) * (1 - Math.abs(s));
                i[0].style.opacity = e
            }
            if (null == c)
                i.transform(`translate3d(${l}, ${o}, 0px)`);
            else {
                const e = c - (c - 1) * (1 - Math.abs(s));
                i.transform(`translate3d(${l}, ${o}, 0px) scale(${e})`)
            }
        }
          , r = ()=>{
            const {$el: e, slides: s, progress: a, snapGrid: r} = t;
            e.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((e=>{
                i(e, a)
            }
            )),
            s.each(((e,s)=>{
                let n = e.progress;
                t.params.slidesPerGroup > 1 && "auto" !== t.params.slidesPerView && (n += Math.ceil(s / 2) - a * (r.length - 1)),
                n = Math.min(Math.max(n, -1), 1),
                d(e).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((e=>{
                    i(e, n)
                }
                ))
            }
            ))
        }
        ;
        a("beforeInit", (()=>{
            t.params.parallax.enabled && (t.params.watchSlidesProgress = !0,
            t.originalParams.watchSlidesProgress = !0)
        }
        )),
        a("init", (()=>{
            t.params.parallax.enabled && r()
        }
        )),
        a("setTranslate", (()=>{
            t.params.parallax.enabled && r()
        }
        )),
        a("setTransition", ((e,s)=>{
            t.params.parallax.enabled && function(e) {
                void 0 === e && (e = t.params.speed);
                const {$el: s} = t;
                s.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((t=>{
                    const s = d(t);
                    let a = parseInt(s.attr("data-swiper-parallax-duration"), 10) || e;
                    0 === e && (a = 0),
                    s.transition(a)
                }
                ))
            }(s)
        }
        ))
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a, emit: i} = e;
        const n = r();
        s({
            zoom: {
                enabled: !1,
                maxRatio: 3,
                minRatio: 1,
                toggle: !0,
                containerClass: "swiper-zoom-container",
                zoomedSlideClass: "swiper-slide-zoomed"
            }
        }),
        t.zoom = {
            enabled: !1
        };
        let l, o, c, p = 1, u = !1;
        const m = {
            $slideEl: void 0,
            slideWidth: void 0,
            slideHeight: void 0,
            $imageEl: void 0,
            $imageWrapEl: void 0,
            maxRatio: 3
        }
          , f = {
            isTouched: void 0,
            isMoved: void 0,
            currentX: void 0,
            currentY: void 0,
            minX: void 0,
            minY: void 0,
            maxX: void 0,
            maxY: void 0,
            width: void 0,
            height: void 0,
            startX: void 0,
            startY: void 0,
            touchesStart: {},
            touchesCurrent: {}
        }
          , g = {
            x: void 0,
            y: void 0,
            prevPositionX: void 0,
            prevPositionY: void 0,
            prevTime: void 0
        };
        let v = 1;
        function w(e) {
            if (e.targetTouches.length < 2)
                return 1;
            const t = e.targetTouches[0].pageX
              , s = e.targetTouches[0].pageY
              , a = e.targetTouches[1].pageX
              , i = e.targetTouches[1].pageY;
            return Math.sqrt((a - t) ** 2 + (i - s) ** 2)
        }
        function b(e) {
            const s = t.support
              , a = t.params.zoom;
            if (o = !1,
            c = !1,
            !s.gestures) {
                if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2)
                    return;
                o = !0,
                m.scaleStart = w(e)
            }
            m.$slideEl && m.$slideEl.length || (m.$slideEl = d(e.target).closest(`.${t.params.slideClass}`),
            0 === m.$slideEl.length && (m.$slideEl = t.slides.eq(t.activeIndex)),
            m.$imageEl = m.$slideEl.find(`.${a.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0),
            m.$imageWrapEl = m.$imageEl.parent(`.${a.containerClass}`),
            m.maxRatio = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio,
            0 !== m.$imageWrapEl.length) ? (m.$imageEl && m.$imageEl.transition(0),
            u = !0) : m.$imageEl = void 0
        }
        function x(e) {
            const s = t.support
              , a = t.params.zoom
              , i = t.zoom;
            if (!s.gestures) {
                if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2)
                    return;
                c = !0,
                m.scaleMove = w(e)
            }
            m.$imageEl && 0 !== m.$imageEl.length ? (s.gestures ? i.scale = e.scale * p : i.scale = m.scaleMove / m.scaleStart * p,
            i.scale > m.maxRatio && (i.scale = m.maxRatio - 1 + (i.scale - m.maxRatio + 1) ** .5),
            i.scale < a.minRatio && (i.scale = a.minRatio + 1 - (a.minRatio - i.scale + 1) ** .5),
            m.$imageEl.transform(`translate3d(0,0,0) scale(${i.scale})`)) : "gesturechange" === e.type && b(e)
        }
        function y(e) {
            const s = t.device
              , a = t.support
              , i = t.params.zoom
              , r = t.zoom;
            if (!a.gestures) {
                if (!o || !c)
                    return;
                if ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2 && !s.android)
                    return;
                o = !1,
                c = !1
            }
            m.$imageEl && 0 !== m.$imageEl.length && (r.scale = Math.max(Math.min(r.scale, m.maxRatio), i.minRatio),
            m.$imageEl.transition(t.params.speed).transform(`translate3d(0,0,0) scale(${r.scale})`),
            p = r.scale,
            u = !1,
            1 === r.scale && (m.$slideEl = void 0))
        }
        function E(e) {
            const s = t.zoom;
            if (!m.$imageEl || 0 === m.$imageEl.length)
                return;
            if (t.allowClick = !1,
            !f.isTouched || !m.$slideEl)
                return;
            f.isMoved || (f.width = m.$imageEl[0].offsetWidth,
            f.height = m.$imageEl[0].offsetHeight,
            f.startX = h(m.$imageWrapEl[0], "x") || 0,
            f.startY = h(m.$imageWrapEl[0], "y") || 0,
            m.slideWidth = m.$slideEl[0].offsetWidth,
            m.slideHeight = m.$slideEl[0].offsetHeight,
            m.$imageWrapEl.transition(0));
            const a = f.width * s.scale
              , i = f.height * s.scale;
            if (!(a < m.slideWidth && i < m.slideHeight)) {
                if (f.minX = Math.min(m.slideWidth / 2 - a / 2, 0),
                f.maxX = -f.minX,
                f.minY = Math.min(m.slideHeight / 2 - i / 2, 0),
                f.maxY = -f.minY,
                f.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                f.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY,
                !f.isMoved && !u) {
                    if (t.isHorizontal() && (Math.floor(f.minX) === Math.floor(f.startX) && f.touchesCurrent.x < f.touchesStart.x || Math.floor(f.maxX) === Math.floor(f.startX) && f.touchesCurrent.x > f.touchesStart.x))
                        return void (f.isTouched = !1);
                    if (!t.isHorizontal() && (Math.floor(f.minY) === Math.floor(f.startY) && f.touchesCurrent.y < f.touchesStart.y || Math.floor(f.maxY) === Math.floor(f.startY) && f.touchesCurrent.y > f.touchesStart.y))
                        return void (f.isTouched = !1)
                }
                e.cancelable && e.preventDefault(),
                e.stopPropagation(),
                f.isMoved = !0,
                f.currentX = f.touchesCurrent.x - f.touchesStart.x + f.startX,
                f.currentY = f.touchesCurrent.y - f.touchesStart.y + f.startY,
                f.currentX < f.minX && (f.currentX = f.minX + 1 - (f.minX - f.currentX + 1) ** .8),
                f.currentX > f.maxX && (f.currentX = f.maxX - 1 + (f.currentX - f.maxX + 1) ** .8),
                f.currentY < f.minY && (f.currentY = f.minY + 1 - (f.minY - f.currentY + 1) ** .8),
                f.currentY > f.maxY && (f.currentY = f.maxY - 1 + (f.currentY - f.maxY + 1) ** .8),
                g.prevPositionX || (g.prevPositionX = f.touchesCurrent.x),
                g.prevPositionY || (g.prevPositionY = f.touchesCurrent.y),
                g.prevTime || (g.prevTime = Date.now()),
                g.x = (f.touchesCurrent.x - g.prevPositionX) / (Date.now() - g.prevTime) / 2,
                g.y = (f.touchesCurrent.y - g.prevPositionY) / (Date.now() - g.prevTime) / 2,
                Math.abs(f.touchesCurrent.x - g.prevPositionX) < 2 && (g.x = 0),
                Math.abs(f.touchesCurrent.y - g.prevPositionY) < 2 && (g.y = 0),
                g.prevPositionX = f.touchesCurrent.x,
                g.prevPositionY = f.touchesCurrent.y,
                g.prevTime = Date.now(),
                m.$imageWrapEl.transform(`translate3d(${f.currentX}px, ${f.currentY}px,0)`)
            }
        }
        function T() {
            const e = t.zoom;
            m.$slideEl && t.previousIndex !== t.activeIndex && (m.$imageEl && m.$imageEl.transform("translate3d(0,0,0) scale(1)"),
            m.$imageWrapEl && m.$imageWrapEl.transform("translate3d(0,0,0)"),
            e.scale = 1,
            p = 1,
            m.$slideEl = void 0,
            m.$imageEl = void 0,
            m.$imageWrapEl = void 0)
        }
        function C(e) {
            const s = t.zoom
              , a = t.params.zoom;
            if (m.$slideEl || (e && e.target && (m.$slideEl = d(e.target).closest(`.${t.params.slideClass}`)),
            m.$slideEl || (t.params.virtual && t.params.virtual.enabled && t.virtual ? m.$slideEl = t.$wrapperEl.children(`.${t.params.slideActiveClass}`) : m.$slideEl = t.slides.eq(t.activeIndex)),
            m.$imageEl = m.$slideEl.find(`.${a.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0),
            m.$imageWrapEl = m.$imageEl.parent(`.${a.containerClass}`)),
            !m.$imageEl || 0 === m.$imageEl.length || !m.$imageWrapEl || 0 === m.$imageWrapEl.length)
                return;
            let i, r, l, o, c, u, h, g, v, w, b, x, y, E, T, C, $, S;
            t.params.cssMode && (t.wrapperEl.style.overflow = "hidden",
            t.wrapperEl.style.touchAction = "none"),
            m.$slideEl.addClass(`${a.zoomedSlideClass}`),
            void 0 === f.touchesStart.x && e ? (i = "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX,
            r = "touchend" === e.type ? e.changedTouches[0].pageY : e.pageY) : (i = f.touchesStart.x,
            r = f.touchesStart.y),
            s.scale = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio,
            p = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio,
            e ? ($ = m.$slideEl[0].offsetWidth,
            S = m.$slideEl[0].offsetHeight,
            l = m.$slideEl.offset().left + n.scrollX,
            o = m.$slideEl.offset().top + n.scrollY,
            c = l + $ / 2 - i,
            u = o + S / 2 - r,
            v = m.$imageEl[0].offsetWidth,
            w = m.$imageEl[0].offsetHeight,
            b = v * s.scale,
            x = w * s.scale,
            y = Math.min($ / 2 - b / 2, 0),
            E = Math.min(S / 2 - x / 2, 0),
            T = -y,
            C = -E,
            h = c * s.scale,
            g = u * s.scale,
            h < y && (h = y),
            h > T && (h = T),
            g < E && (g = E),
            g > C && (g = C)) : (h = 0,
            g = 0),
            m.$imageWrapEl.transition(300).transform(`translate3d(${h}px, ${g}px,0)`),
            m.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${s.scale})`)
        }
        function $() {
            const e = t.zoom
              , s = t.params.zoom;
            m.$slideEl || (t.params.virtual && t.params.virtual.enabled && t.virtual ? m.$slideEl = t.$wrapperEl.children(`.${t.params.slideActiveClass}`) : m.$slideEl = t.slides.eq(t.activeIndex),
            m.$imageEl = m.$slideEl.find(`.${s.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0),
            m.$imageWrapEl = m.$imageEl.parent(`.${s.containerClass}`)),
            m.$imageEl && 0 !== m.$imageEl.length && m.$imageWrapEl && 0 !== m.$imageWrapEl.length && (t.params.cssMode && (t.wrapperEl.style.overflow = "",
            t.wrapperEl.style.touchAction = ""),
            e.scale = 1,
            p = 1,
            m.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"),
            m.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"),
            m.$slideEl.removeClass(`${s.zoomedSlideClass}`),
            m.$slideEl = void 0)
        }
        function S(e) {
            const s = t.zoom;
            s.scale && 1 !== s.scale ? $() : C(e)
        }
        function M() {
            const e = t.support;
            return {
                passiveListener: !("touchstart" !== t.touchEvents.start || !e.passiveListener || !t.params.passiveListeners) && {
                    passive: !0,
                    capture: !1
                },
                activeListenerWithCapture: !e.passiveListener || {
                    passive: !1,
                    capture: !0
                }
            }
        }
        function P() {
            return `.${t.params.slideClass}`
        }
        function k(e) {
            const {passiveListener: s} = M()
              , a = P();
            t.$wrapperEl[e]("gesturestart", a, b, s),
            t.$wrapperEl[e]("gesturechange", a, x, s),
            t.$wrapperEl[e]("gestureend", a, y, s)
        }
        function z() {
            l || (l = !0,
            k("on"))
        }
        function O() {
            l && (l = !1,
            k("off"))
        }
        function I() {
            const e = t.zoom;
            if (e.enabled)
                return;
            e.enabled = !0;
            const s = t.support
              , {passiveListener: a, activeListenerWithCapture: i} = M()
              , r = P();
            s.gestures ? (t.$wrapperEl.on(t.touchEvents.start, z, a),
            t.$wrapperEl.on(t.touchEvents.end, O, a)) : "touchstart" === t.touchEvents.start && (t.$wrapperEl.on(t.touchEvents.start, r, b, a),
            t.$wrapperEl.on(t.touchEvents.move, r, x, i),
            t.$wrapperEl.on(t.touchEvents.end, r, y, a),
            t.touchEvents.cancel && t.$wrapperEl.on(t.touchEvents.cancel, r, y, a)),
            t.$wrapperEl.on(t.touchEvents.move, `.${t.params.zoom.containerClass}`, E, i)
        }
        function L() {
            const e = t.zoom;
            if (!e.enabled)
                return;
            const s = t.support;
            e.enabled = !1;
            const {passiveListener: a, activeListenerWithCapture: i} = M()
              , r = P();
            s.gestures ? (t.$wrapperEl.off(t.touchEvents.start, z, a),
            t.$wrapperEl.off(t.touchEvents.end, O, a)) : "touchstart" === t.touchEvents.start && (t.$wrapperEl.off(t.touchEvents.start, r, b, a),
            t.$wrapperEl.off(t.touchEvents.move, r, x, i),
            t.$wrapperEl.off(t.touchEvents.end, r, y, a),
            t.touchEvents.cancel && t.$wrapperEl.off(t.touchEvents.cancel, r, y, a)),
            t.$wrapperEl.off(t.touchEvents.move, `.${t.params.zoom.containerClass}`, E, i)
        }
        Object.defineProperty(t.zoom, "scale", {
            get: ()=>v,
            set(e) {
                if (v !== e) {
                    const t = m.$imageEl ? m.$imageEl[0] : void 0
                      , s = m.$slideEl ? m.$slideEl[0] : void 0;
                    i("zoomChange", e, t, s)
                }
                v = e
            }
        }),
        a("init", (()=>{
            t.params.zoom.enabled && I()
        }
        )),
        a("destroy", (()=>{
            L()
        }
        )),
        a("touchStart", ((e,s)=>{
            t.zoom.enabled && function(e) {
                const s = t.device;
                m.$imageEl && 0 !== m.$imageEl.length && (f.isTouched || (s.android && e.cancelable && e.preventDefault(),
                f.isTouched = !0,
                f.touchesStart.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX,
                f.touchesStart.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY))
            }(s)
        }
        )),
        a("touchEnd", ((e,s)=>{
            t.zoom.enabled && function() {
                const e = t.zoom;
                if (!m.$imageEl || 0 === m.$imageEl.length)
                    return;
                if (!f.isTouched || !f.isMoved)
                    return f.isTouched = !1,
                    void (f.isMoved = !1);
                f.isTouched = !1,
                f.isMoved = !1;
                let s = 300
                  , a = 300;
                const i = g.x * s
                  , r = f.currentX + i
                  , n = g.y * a
                  , l = f.currentY + n;
                0 !== g.x && (s = Math.abs((r - f.currentX) / g.x)),
                0 !== g.y && (a = Math.abs((l - f.currentY) / g.y));
                const o = Math.max(s, a);
                f.currentX = r,
                f.currentY = l;
                const d = f.width * e.scale
                  , c = f.height * e.scale;
                f.minX = Math.min(m.slideWidth / 2 - d / 2, 0),
                f.maxX = -f.minX,
                f.minY = Math.min(m.slideHeight / 2 - c / 2, 0),
                f.maxY = -f.minY,
                f.currentX = Math.max(Math.min(f.currentX, f.maxX), f.minX),
                f.currentY = Math.max(Math.min(f.currentY, f.maxY), f.minY),
                m.$imageWrapEl.transition(o).transform(`translate3d(${f.currentX}px, ${f.currentY}px,0)`)
            }()
        }
        )),
        a("doubleTap", ((e,s)=>{
            !t.animating && t.params.zoom.enabled && t.zoom.enabled && t.params.zoom.toggle && S(s)
        }
        )),
        a("transitionEnd", (()=>{
            t.zoom.enabled && t.params.zoom.enabled && T()
        }
        )),
        a("slideChange", (()=>{
            t.zoom.enabled && t.params.zoom.enabled && t.params.cssMode && T()
        }
        )),
        Object.assign(t.zoom, {
            enable: I,
            disable: L,
            in: C,
            out: $,
            toggle: S
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a, emit: i} = e;
        s({
            lazy: {
                checkInView: !1,
                enabled: !1,
                loadPrevNext: !1,
                loadPrevNextAmount: 1,
                loadOnTransitionStart: !1,
                scrollingElement: "",
                elementClass: "swiper-lazy",
                loadingClass: "swiper-lazy-loading",
                loadedClass: "swiper-lazy-loaded",
                preloaderClass: "swiper-lazy-preloader"
            }
        }),
        t.lazy = {};
        let n = !1
          , l = !1;
        function o(e, s) {
            void 0 === s && (s = !0);
            const a = t.params.lazy;
            if (void 0 === e)
                return;
            if (0 === t.slides.length)
                return;
            const r = t.virtual && t.params.virtual.enabled ? t.$wrapperEl.children(`.${t.params.slideClass}[data-swiper-slide-index="${e}"]`) : t.slides.eq(e)
              , n = r.find(`.${a.elementClass}:not(.${a.loadedClass}):not(.${a.loadingClass})`);
            !r.hasClass(a.elementClass) || r.hasClass(a.loadedClass) || r.hasClass(a.loadingClass) || n.push(r[0]),
            0 !== n.length && n.each((e=>{
                const n = d(e);
                n.addClass(a.loadingClass);
                const l = n.attr("data-background")
                  , c = n.attr("data-src")
                  , p = n.attr("data-srcset")
                  , u = n.attr("data-sizes")
                  , h = n.parent("picture");
                t.loadImage(n[0], c || l, p, u, !1, (()=>{
                    if (null != t && t && (!t || t.params) && !t.destroyed) {
                        if (l ? (n.css("background-image", `url("${l}")`),
                        n.removeAttr("data-background")) : (p && (n.attr("srcset", p),
                        n.removeAttr("data-srcset")),
                        u && (n.attr("sizes", u),
                        n.removeAttr("data-sizes")),
                        h.length && h.children("source").each((e=>{
                            const t = d(e);
                            t.attr("data-srcset") && (t.attr("srcset", t.attr("data-srcset")),
                            t.removeAttr("data-srcset"))
                        }
                        )),
                        c && (n.attr("src", c),
                        n.removeAttr("data-src"))),
                        n.addClass(a.loadedClass).removeClass(a.loadingClass),
                        r.find(`.${a.preloaderClass}`).remove(),
                        t.params.loop && s) {
                            const e = r.attr("data-swiper-slide-index");
                            if (r.hasClass(t.params.slideDuplicateClass)) {
                                o(t.$wrapperEl.children(`[data-swiper-slide-index="${e}"]:not(.${t.params.slideDuplicateClass})`).index(), !1)
                            } else {
                                o(t.$wrapperEl.children(`.${t.params.slideDuplicateClass}[data-swiper-slide-index="${e}"]`).index(), !1)
                            }
                        }
                        i("lazyImageReady", r[0], n[0]),
                        t.params.autoHeight && t.updateAutoHeight()
                    }
                }
                )),
                i("lazyImageLoad", r[0], n[0])
            }
            ))
        }
        function c() {
            const {$wrapperEl: e, params: s, slides: a, activeIndex: i} = t
              , r = t.virtual && s.virtual.enabled
              , n = s.lazy;
            let c = s.slidesPerView;
            function p(t) {
                if (r) {
                    if (e.children(`.${s.slideClass}[data-swiper-slide-index="${t}"]`).length)
                        return !0
                } else if (a[t])
                    return !0;
                return !1
            }
            function u(e) {
                return r ? d(e).attr("data-swiper-slide-index") : d(e).index()
            }
            if ("auto" === c && (c = 0),
            l || (l = !0),
            t.params.watchSlidesProgress)
                e.children(`.${s.slideVisibleClass}`).each((e=>{
                    o(r ? d(e).attr("data-swiper-slide-index") : d(e).index())
                }
                ));
            else if (c > 1)
                for (let e = i; e < i + c; e += 1)
                    p(e) && o(e);
            else
                o(i);
            if (n.loadPrevNext)
                if (c > 1 || n.loadPrevNextAmount && n.loadPrevNextAmount > 1) {
                    const e = n.loadPrevNextAmount
                      , t = c
                      , s = Math.min(i + t + Math.max(e, t), a.length)
                      , r = Math.max(i - Math.max(t, e), 0);
                    for (let e = i + c; e < s; e += 1)
                        p(e) && o(e);
                    for (let e = r; e < i; e += 1)
                        p(e) && o(e)
                } else {
                    const t = e.children(`.${s.slideNextClass}`);
                    t.length > 0 && o(u(t));
                    const a = e.children(`.${s.slidePrevClass}`);
                    a.length > 0 && o(u(a))
                }
        }
        function p() {
            const e = r();
            if (!t || t.destroyed)
                return;
            const s = t.params.lazy.scrollingElement ? d(t.params.lazy.scrollingElement) : d(e)
              , a = s[0] === e
              , i = a ? e.innerWidth : s[0].offsetWidth
              , l = a ? e.innerHeight : s[0].offsetHeight
              , o = t.$el.offset()
              , {rtlTranslate: u} = t;
            let h = !1;
            u && (o.left -= t.$el[0].scrollLeft);
            const m = [[o.left, o.top], [o.left + t.width, o.top], [o.left, o.top + t.height], [o.left + t.width, o.top + t.height]];
            for (let e = 0; e < m.length; e += 1) {
                const t = m[e];
                if (t[0] >= 0 && t[0] <= i && t[1] >= 0 && t[1] <= l) {
                    if (0 === t[0] && 0 === t[1])
                        continue;
                    h = !0
                }
            }
            const f = !("touchstart" !== t.touchEvents.start || !t.support.passiveListener || !t.params.passiveListeners) && {
                passive: !0,
                capture: !1
            };
            h ? (c(),
            s.off("scroll", p, f)) : n || (n = !0,
            s.on("scroll", p, f))
        }
        a("beforeInit", (()=>{
            t.params.lazy.enabled && t.params.preloadImages && (t.params.preloadImages = !1)
        }
        )),
        a("init", (()=>{
            t.params.lazy.enabled && (t.params.lazy.checkInView ? p() : c())
        }
        )),
        a("scroll", (()=>{
            t.params.freeMode && t.params.freeMode.enabled && !t.params.freeMode.sticky && c()
        }
        )),
        a("scrollbarDragMove resize _freeModeNoMomentumRelease", (()=>{
            t.params.lazy.enabled && (t.params.lazy.checkInView ? p() : c())
        }
        )),
        a("transitionStart", (()=>{
            t.params.lazy.enabled && (t.params.lazy.loadOnTransitionStart || !t.params.lazy.loadOnTransitionStart && !l) && (t.params.lazy.checkInView ? p() : c())
        }
        )),
        a("transitionEnd", (()=>{
            t.params.lazy.enabled && !t.params.lazy.loadOnTransitionStart && (t.params.lazy.checkInView ? p() : c())
        }
        )),
        a("slideChange", (()=>{
            const {lazy: e, cssMode: s, watchSlidesProgress: a, touchReleaseOnEdges: i, resistanceRatio: r} = t.params;
            e.enabled && (s || a && (i || 0 === r)) && c()
        }
        )),
        Object.assign(t.lazy, {
            load: c,
            loadInSlide: o
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        function i(e, t) {
            const s = function() {
                let e, t, s;
                return (a,i)=>{
                    for (t = -1,
                    e = a.length; e - t > 1; )
                        s = e + t >> 1,
                        a[s] <= i ? t = s : e = s;
                    return e
                }
            }();
            let a, i;
            return this.x = e,
            this.y = t,
            this.lastIndex = e.length - 1,
            this.interpolate = function(e) {
                return e ? (i = s(this.x, e),
                a = i - 1,
                (e - this.x[a]) * (this.y[i] - this.y[a]) / (this.x[i] - this.x[a]) + this.y[a]) : 0
            }
            ,
            this
        }
        function r() {
            t.controller.control && t.controller.spline && (t.controller.spline = void 0,
            delete t.controller.spline)
        }
        s({
            controller: {
                control: void 0,
                inverse: !1,
                by: "slide"
            }
        }),
        t.controller = {
            control: void 0
        },
        a("beforeInit", (()=>{
            t.controller.control = t.params.controller.control
        }
        )),
        a("update", (()=>{
            r()
        }
        )),
        a("resize", (()=>{
            r()
        }
        )),
        a("observerUpdate", (()=>{
            r()
        }
        )),
        a("setTranslate", ((e,s,a)=>{
            t.controller.control && t.controller.setTranslate(s, a)
        }
        )),
        a("setTransition", ((e,s,a)=>{
            t.controller.control && t.controller.setTransition(s, a)
        }
        )),
        Object.assign(t.controller, {
            setTranslate: function(e, s) {
                const a = t.controller.control;
                let r, n;
                const l = t.constructor;
                function o(e) {
                    const s = t.rtlTranslate ? -t.translate : t.translate;
                    "slide" === t.params.controller.by && (!function(e) {
                        t.controller.spline || (t.controller.spline = t.params.loop ? new i(t.slidesGrid,e.slidesGrid) : new i(t.snapGrid,e.snapGrid))
                    }(e),
                    n = -t.controller.spline.interpolate(-s)),
                    n && "container" !== t.params.controller.by || (r = (e.maxTranslate() - e.minTranslate()) / (t.maxTranslate() - t.minTranslate()),
                    n = (s - t.minTranslate()) * r + e.minTranslate()),
                    t.params.controller.inverse && (n = e.maxTranslate() - n),
                    e.updateProgress(n),
                    e.setTranslate(n, t),
                    e.updateActiveIndex(),
                    e.updateSlidesClasses()
                }
                if (Array.isArray(a))
                    for (let e = 0; e < a.length; e += 1)
                        a[e] !== s && a[e]instanceof l && o(a[e]);
                else
                    a instanceof l && s !== a && o(a)
            },
            setTransition: function(e, s) {
                const a = t.constructor
                  , i = t.controller.control;
                let r;
                function n(s) {
                    s.setTransition(e, t),
                    0 !== e && (s.transitionStart(),
                    s.params.autoHeight && p((()=>{
                        s.updateAutoHeight()
                    }
                    )),
                    s.$wrapperEl.transitionEnd((()=>{
                        i && (s.params.loop && "slide" === t.params.controller.by && s.loopFix(),
                        s.transitionEnd())
                    }
                    )))
                }
                if (Array.isArray(i))
                    for (r = 0; r < i.length; r += 1)
                        i[r] !== s && i[r]instanceof a && n(i[r]);
                else
                    i instanceof a && s !== i && n(i)
            }
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        s({
            a11y: {
                enabled: !0,
                notificationClass: "swiper-notification",
                prevSlideMessage: "Previous slide",
                nextSlideMessage: "Next slide",
                firstSlideMessage: "This is the first slide",
                lastSlideMessage: "This is the last slide",
                paginationBulletMessage: "Go to slide {{index}}",
                slideLabelMessage: "{{index}} / {{slidesLength}}",
                containerMessage: null,
                containerRoleDescriptionMessage: null,
                itemRoleDescriptionMessage: null,
                slideRole: "group",
                id: null
            }
        });
        let i = null;
        function r(e) {
            const t = i;
            0 !== t.length && (t.html(""),
            t.html(e))
        }
        function n(e) {
            e.attr("tabIndex", "0")
        }
        function l(e) {
            e.attr("tabIndex", "-1")
        }
        function o(e, t) {
            e.attr("role", t)
        }
        function c(e, t) {
            e.attr("aria-roledescription", t)
        }
        function p(e, t) {
            e.attr("aria-label", t)
        }
        function u(e) {
            e.attr("aria-disabled", !0)
        }
        function h(e) {
            e.attr("aria-disabled", !1)
        }
        function m(e) {
            if (13 !== e.keyCode && 32 !== e.keyCode)
                return;
            const s = t.params.a11y
              , a = d(e.target);
            t.navigation && t.navigation.$nextEl && a.is(t.navigation.$nextEl) && (t.isEnd && !t.params.loop || t.slideNext(),
            t.isEnd ? r(s.lastSlideMessage) : r(s.nextSlideMessage)),
            t.navigation && t.navigation.$prevEl && a.is(t.navigation.$prevEl) && (t.isBeginning && !t.params.loop || t.slidePrev(),
            t.isBeginning ? r(s.firstSlideMessage) : r(s.prevSlideMessage)),
            t.pagination && a.is(U(t.params.pagination.bulletClass)) && a[0].click()
        }
        function f() {
            return t.pagination && t.pagination.bullets && t.pagination.bullets.length
        }
        function g() {
            return f() && t.params.pagination.clickable
        }
        const v = (e,t,s)=>{
            n(e),
            "BUTTON" !== e[0].tagName && (o(e, "button"),
            e.on("keydown", m)),
            p(e, s),
            function(e, t) {
                e.attr("aria-controls", t)
            }(e, t)
        }
          , w = e=>{
            const s = e.target.closest(`.${t.params.slideClass}`);
            if (!s || !t.slides.includes(s))
                return;
            const a = t.slides.indexOf(s) === t.activeIndex
              , i = t.params.watchSlidesProgress && t.visibleSlides && t.visibleSlides.includes(s);
            a || i || t.slideTo(t.slides.indexOf(s), 0)
        }
        ;
        function b() {
            const e = t.params.a11y;
            t.$el.append(i);
            const s = t.$el;
            e.containerRoleDescriptionMessage && c(s, e.containerRoleDescriptionMessage),
            e.containerMessage && p(s, e.containerMessage);
            const a = t.$wrapperEl
              , r = e.id || a.attr("id") || `swiper-wrapper-${n = 16,
            void 0 === n && (n = 16),
            "x".repeat(n).replace(/x/g, (()=>Math.round(16 * Math.random()).toString(16)))}`;
            var n;
            const l = t.params.autoplay && t.params.autoplay.enabled ? "off" : "polite";
            var u;
            u = r,
            a.attr("id", u),
            function(e, t) {
                e.attr("aria-live", t)
            }(a, l),
            e.itemRoleDescriptionMessage && c(d(t.slides), e.itemRoleDescriptionMessage),
            o(d(t.slides), e.slideRole);
            const h = t.params.loop ? t.slides.filter((e=>!e.classList.contains(t.params.slideDuplicateClass))).length : t.slides.length;
            let f, b;
            t.slides.each(((s,a)=>{
                const i = d(s)
                  , r = t.params.loop ? parseInt(i.attr("data-swiper-slide-index"), 10) : a;
                p(i, e.slideLabelMessage.replace(/\{\{index\}\}/, r + 1).replace(/\{\{slidesLength\}\}/, h))
            }
            )),
            t.navigation && t.navigation.$nextEl && (f = t.navigation.$nextEl),
            t.navigation && t.navigation.$prevEl && (b = t.navigation.$prevEl),
            f && f.length && v(f, r, e.nextSlideMessage),
            b && b.length && v(b, r, e.prevSlideMessage),
            g() && t.pagination.$el.on("keydown", U(t.params.pagination.bulletClass), m),
            t.$el.on("focus", w, !0)
        }
        a("beforeInit", (()=>{
            i = d(`<span class="${t.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`)
        }
        )),
        a("afterInit", (()=>{
            t.params.a11y.enabled && b()
        }
        )),
        a("fromEdge toEdge afterInit lock unlock", (()=>{
            t.params.a11y.enabled && function() {
                if (t.params.loop || t.params.rewind || !t.navigation)
                    return;
                const {$nextEl: e, $prevEl: s} = t.navigation;
                s && s.length > 0 && (t.isBeginning ? (u(s),
                l(s)) : (h(s),
                n(s))),
                e && e.length > 0 && (t.isEnd ? (u(e),
                l(e)) : (h(e),
                n(e)))
            }()
        }
        )),
        a("paginationUpdate", (()=>{
            t.params.a11y.enabled && function() {
                const e = t.params.a11y;
                f() && t.pagination.bullets.each((s=>{
                    const a = d(s);
                    t.params.pagination.clickable && (n(a),
                    t.params.pagination.renderBullet || (o(a, "button"),
                    p(a, e.paginationBulletMessage.replace(/\{\{index\}\}/, a.index() + 1)))),
                    a.is(`.${t.params.pagination.bulletActiveClass}`) ? a.attr("aria-current", "true") : a.removeAttr("aria-current")
                }
                ))
            }()
        }
        )),
        a("destroy", (()=>{
            t.params.a11y.enabled && function() {
                let e, s;
                i && i.length > 0 && i.remove(),
                t.navigation && t.navigation.$nextEl && (e = t.navigation.$nextEl),
                t.navigation && t.navigation.$prevEl && (s = t.navigation.$prevEl),
                e && e.off("keydown", m),
                s && s.off("keydown", m),
                g() && t.pagination.$el.off("keydown", U(t.params.pagination.bulletClass), m),
                t.$el.off("focus", w, !0)
            }()
        }
        ))
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        s({
            history: {
                enabled: !1,
                root: "",
                replaceState: !1,
                key: "slides"
            }
        });
        let i = !1
          , n = {};
        const l = e=>e.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "")
          , o = e=>{
            const t = r();
            let s;
            s = e ? new URL(e) : t.location;
            const a = s.pathname.slice(1).split("/").filter((e=>"" !== e))
              , i = a.length;
            return {
                key: a[i - 2],
                value: a[i - 1]
            }
        }
          , d = (e,s)=>{
            const a = r();
            if (!i || !t.params.history.enabled)
                return;
            let n;
            n = t.params.url ? new URL(t.params.url) : a.location;
            const o = t.slides.eq(s);
            let d = l(o.attr("data-history"));
            if (t.params.history.root.length > 0) {
                let s = t.params.history.root;
                "/" === s[s.length - 1] && (s = s.slice(0, s.length - 1)),
                d = `${s}/${e}/${d}`
            } else
                n.pathname.includes(e) || (d = `${e}/${d}`);
            const c = a.history.state;
            c && c.value === d || (t.params.history.replaceState ? a.history.replaceState({
                value: d
            }, null, d) : a.history.pushState({
                value: d
            }, null, d))
        }
          , c = (e,s,a)=>{
            if (s)
                for (let i = 0, r = t.slides.length; i < r; i += 1) {
                    const r = t.slides.eq(i);
                    if (l(r.attr("data-history")) === s && !r.hasClass(t.params.slideDuplicateClass)) {
                        const s = r.index();
                        t.slideTo(s, e, a)
                    }
                }
            else
                t.slideTo(0, e, a)
        }
          , p = ()=>{
            n = o(t.params.url),
            c(t.params.speed, t.paths.value, !1)
        }
        ;
        a("init", (()=>{
            t.params.history.enabled && (()=>{
                const e = r();
                if (t.params.history) {
                    if (!e.history || !e.history.pushState)
                        return t.params.history.enabled = !1,
                        void (t.params.hashNavigation.enabled = !0);
                    i = !0,
                    n = o(t.params.url),
                    (n.key || n.value) && (c(0, n.value, t.params.runCallbacksOnInit),
                    t.params.history.replaceState || e.addEventListener("popstate", p))
                }
            }
            )()
        }
        )),
        a("destroy", (()=>{
            t.params.history.enabled && (()=>{
                const e = r();
                t.params.history.replaceState || e.removeEventListener("popstate", p)
            }
            )()
        }
        )),
        a("transitionEnd _freeModeNoMomentumRelease", (()=>{
            i && d(t.params.history.key, t.activeIndex)
        }
        )),
        a("slideChange", (()=>{
            i && t.params.cssMode && d(t.params.history.key, t.activeIndex)
        }
        ))
    }
    , function(e) {
        let {swiper: t, extendParams: s, emit: i, on: n} = e
          , l = !1;
        const o = a()
          , c = r();
        s({
            hashNavigation: {
                enabled: !1,
                replaceState: !1,
                watchState: !1
            }
        });
        const p = ()=>{
            i("hashChange");
            const e = o.location.hash.replace("#", "");
            if (e !== t.slides.eq(t.activeIndex).attr("data-hash")) {
                const s = t.$wrapperEl.children(`.${t.params.slideClass}[data-hash="${e}"]`).index();
                if (void 0 === s)
                    return;
                t.slideTo(s)
            }
        }
          , u = ()=>{
            if (l && t.params.hashNavigation.enabled)
                if (t.params.hashNavigation.replaceState && c.history && c.history.replaceState)
                    c.history.replaceState(null, null, `#${t.slides.eq(t.activeIndex).attr("data-hash")}` || ""),
                    i("hashSet");
                else {
                    const e = t.slides.eq(t.activeIndex)
                      , s = e.attr("data-hash") || e.attr("data-history");
                    o.location.hash = s || "",
                    i("hashSet")
                }
        }
        ;
        n("init", (()=>{
            t.params.hashNavigation.enabled && (()=>{
                if (!t.params.hashNavigation.enabled || t.params.history && t.params.history.enabled)
                    return;
                l = !0;
                const e = o.location.hash.replace("#", "");
                if (e) {
                    const s = 0;
                    for (let a = 0, i = t.slides.length; a < i; a += 1) {
                        const i = t.slides.eq(a);
                        if ((i.attr("data-hash") || i.attr("data-history")) === e && !i.hasClass(t.params.slideDuplicateClass)) {
                            const e = i.index();
                            t.slideTo(e, s, t.params.runCallbacksOnInit, !0)
                        }
                    }
                }
                t.params.hashNavigation.watchState && d(c).on("hashchange", p)
            }
            )()
        }
        )),
        n("destroy", (()=>{
            t.params.hashNavigation.enabled && t.params.hashNavigation.watchState && d(c).off("hashchange", p)
        }
        )),
        n("transitionEnd _freeModeNoMomentumRelease", (()=>{
            l && u()
        }
        )),
        n("slideChange", (()=>{
            l && t.params.cssMode && u()
        }
        ))
    }
    , function(e) {
        let t, {swiper: s, extendParams: i, on: r, emit: n} = e;
        function l() {
            const e = s.slides.eq(s.activeIndex);
            let a = s.params.autoplay.delay;
            e.attr("data-swiper-autoplay") && (a = e.attr("data-swiper-autoplay") || s.params.autoplay.delay),
            clearTimeout(t),
            t = p((()=>{
                let e;
                s.params.autoplay.reverseDirection ? s.params.loop ? (s.loopFix(),
                e = s.slidePrev(s.params.speed, !0, !0),
                n("autoplay")) : s.isBeginning ? s.params.autoplay.stopOnLastSlide ? d() : (e = s.slideTo(s.slides.length - 1, s.params.speed, !0, !0),
                n("autoplay")) : (e = s.slidePrev(s.params.speed, !0, !0),
                n("autoplay")) : s.params.loop ? (s.loopFix(),
                e = s.slideNext(s.params.speed, !0, !0),
                n("autoplay")) : s.isEnd ? s.params.autoplay.stopOnLastSlide ? d() : (e = s.slideTo(0, s.params.speed, !0, !0),
                n("autoplay")) : (e = s.slideNext(s.params.speed, !0, !0),
                n("autoplay")),
                (s.params.cssMode && s.autoplay.running || !1 === e) && l()
            }
            ), a)
        }
        function o() {
            return void 0 === t && (!s.autoplay.running && (s.autoplay.running = !0,
            n("autoplayStart"),
            l(),
            !0))
        }
        function d() {
            return !!s.autoplay.running && (void 0 !== t && (t && (clearTimeout(t),
            t = void 0),
            s.autoplay.running = !1,
            n("autoplayStop"),
            !0))
        }
        function c(e) {
            s.autoplay.running && (s.autoplay.paused || (t && clearTimeout(t),
            s.autoplay.paused = !0,
            0 !== e && s.params.autoplay.waitForTransition ? ["transitionend", "webkitTransitionEnd"].forEach((e=>{
                s.$wrapperEl[0].addEventListener(e, h)
            }
            )) : (s.autoplay.paused = !1,
            l())))
        }
        function u() {
            const e = a();
            "hidden" === e.visibilityState && s.autoplay.running && c(),
            "visible" === e.visibilityState && s.autoplay.paused && (l(),
            s.autoplay.paused = !1)
        }
        function h(e) {
            s && !s.destroyed && s.$wrapperEl && e.target === s.$wrapperEl[0] && (["transitionend", "webkitTransitionEnd"].forEach((e=>{
                s.$wrapperEl[0].removeEventListener(e, h)
            }
            )),
            s.autoplay.paused = !1,
            s.autoplay.running ? l() : d())
        }
        function m() {
            s.params.autoplay.disableOnInteraction ? d() : (n("autoplayPause"),
            c()),
            ["transitionend", "webkitTransitionEnd"].forEach((e=>{
                s.$wrapperEl[0].removeEventListener(e, h)
            }
            ))
        }
        function f() {
            s.params.autoplay.disableOnInteraction || (s.autoplay.paused = !1,
            n("autoplayResume"),
            l())
        }
        s.autoplay = {
            running: !1,
            paused: !1
        },
        i({
            autoplay: {
                enabled: !1,
                delay: 3e3,
                waitForTransition: !0,
                disableOnInteraction: !0,
                stopOnLastSlide: !1,
                reverseDirection: !1,
                pauseOnMouseEnter: !1
            }
        }),
        r("init", (()=>{
            if (s.params.autoplay.enabled) {
                o();
                a().addEventListener("visibilitychange", u),
                s.params.autoplay.pauseOnMouseEnter && (s.$el.on("mouseenter", m),
                s.$el.on("mouseleave", f))
            }
        }
        )),
        r("beforeTransitionStart", ((e,t,a)=>{
            s.autoplay.running && (a || !s.params.autoplay.disableOnInteraction ? s.autoplay.pause(t) : d())
        }
        )),
        r("sliderFirstMove", (()=>{
            s.autoplay.running && (s.params.autoplay.disableOnInteraction ? d() : c())
        }
        )),
        r("touchEnd", (()=>{
            s.params.cssMode && s.autoplay.paused && !s.params.autoplay.disableOnInteraction && l()
        }
        )),
        r("destroy", (()=>{
            s.$el.off("mouseenter", m),
            s.$el.off("mouseleave", f),
            s.autoplay.running && d();
            a().removeEventListener("visibilitychange", u)
        }
        )),
        Object.assign(s.autoplay, {
            pause: c,
            run: l,
            start: o,
            stop: d
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        s({
            thumbs: {
                swiper: null,
                multipleActiveThumbs: !0,
                autoScrollOffset: 0,
                slideThumbActiveClass: "swiper-slide-thumb-active",
                thumbsContainerClass: "swiper-thumbs"
            }
        });
        let i = !1
          , r = !1;
        function n() {
            const e = t.thumbs.swiper;
            if (!e || e.destroyed)
                return;
            const s = e.clickedIndex
              , a = e.clickedSlide;
            if (a && d(a).hasClass(t.params.thumbs.slideThumbActiveClass))
                return;
            if (null == s)
                return;
            let i;
            if (i = e.params.loop ? parseInt(d(e.clickedSlide).attr("data-swiper-slide-index"), 10) : s,
            t.params.loop) {
                let e = t.activeIndex;
                t.slides.eq(e).hasClass(t.params.slideDuplicateClass) && (t.loopFix(),
                t._clientLeft = t.$wrapperEl[0].clientLeft,
                e = t.activeIndex);
                const s = t.slides.eq(e).prevAll(`[data-swiper-slide-index="${i}"]`).eq(0).index()
                  , a = t.slides.eq(e).nextAll(`[data-swiper-slide-index="${i}"]`).eq(0).index();
                i = void 0 === s ? a : void 0 === a ? s : a - e < e - s ? a : s
            }
            t.slideTo(i)
        }
        function l() {
            const {thumbs: e} = t.params;
            if (i)
                return !1;
            i = !0;
            const s = t.constructor;
            if (e.swiper instanceof s)
                t.thumbs.swiper = e.swiper,
                Object.assign(t.thumbs.swiper.originalParams, {
                    watchSlidesProgress: !0,
                    slideToClickedSlide: !1
                }),
                Object.assign(t.thumbs.swiper.params, {
                    watchSlidesProgress: !0,
                    slideToClickedSlide: !1
                });
            else if (m(e.swiper)) {
                const a = Object.assign({}, e.swiper);
                Object.assign(a, {
                    watchSlidesProgress: !0,
                    slideToClickedSlide: !1
                }),
                t.thumbs.swiper = new s(a),
                r = !0
            }
            return t.thumbs.swiper.$el.addClass(t.params.thumbs.thumbsContainerClass),
            t.thumbs.swiper.on("tap", n),
            !0
        }
        function o(e) {
            const s = t.thumbs.swiper;
            if (!s || s.destroyed)
                return;
            const a = "auto" === s.params.slidesPerView ? s.slidesPerViewDynamic() : s.params.slidesPerView
              , i = t.params.thumbs.autoScrollOffset
              , r = i && !s.params.loop;
            if (t.realIndex !== s.realIndex || r) {
                let n, l, o = s.activeIndex;
                if (s.params.loop) {
                    s.slides.eq(o).hasClass(s.params.slideDuplicateClass) && (s.loopFix(),
                    s._clientLeft = s.$wrapperEl[0].clientLeft,
                    o = s.activeIndex);
                    const e = s.slides.eq(o).prevAll(`[data-swiper-slide-index="${t.realIndex}"]`).eq(0).index()
                      , a = s.slides.eq(o).nextAll(`[data-swiper-slide-index="${t.realIndex}"]`).eq(0).index();
                    n = void 0 === e ? a : void 0 === a ? e : a - o == o - e ? s.params.slidesPerGroup > 1 ? a : o : a - o < o - e ? a : e,
                    l = t.activeIndex > t.previousIndex ? "next" : "prev"
                } else
                    n = t.realIndex,
                    l = n > t.previousIndex ? "next" : "prev";
                r && (n += "next" === l ? i : -1 * i),
                s.visibleSlidesIndexes && s.visibleSlidesIndexes.indexOf(n) < 0 && (s.params.centeredSlides ? n = n > o ? n - Math.floor(a / 2) + 1 : n + Math.floor(a / 2) - 1 : n > o && s.params.slidesPerGroup,
                s.slideTo(n, e ? 0 : void 0))
            }
            let n = 1;
            const l = t.params.thumbs.slideThumbActiveClass;
            if (t.params.slidesPerView > 1 && !t.params.centeredSlides && (n = t.params.slidesPerView),
            t.params.thumbs.multipleActiveThumbs || (n = 1),
            n = Math.floor(n),
            s.slides.removeClass(l),
            s.params.loop || s.params.virtual && s.params.virtual.enabled)
                for (let e = 0; e < n; e += 1)
                    s.$wrapperEl.children(`[data-swiper-slide-index="${t.realIndex + e}"]`).addClass(l);
            else
                for (let e = 0; e < n; e += 1)
                    s.slides.eq(t.realIndex + e).addClass(l)
        }
        t.thumbs = {
            swiper: null
        },
        a("beforeInit", (()=>{
            const {thumbs: e} = t.params;
            e && e.swiper && (l(),
            o(!0))
        }
        )),
        a("slideChange update resize observerUpdate", (()=>{
            o()
        }
        )),
        a("setTransition", ((e,s)=>{
            const a = t.thumbs.swiper;
            a && !a.destroyed && a.setTransition(s)
        }
        )),
        a("beforeDestroy", (()=>{
            const e = t.thumbs.swiper;
            e && !e.destroyed && r && e.destroy()
        }
        )),
        Object.assign(t.thumbs, {
            init: l,
            update: o
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, emit: a, once: i} = e;
        s({
            freeMode: {
                enabled: !1,
                momentum: !0,
                momentumRatio: 1,
                momentumBounce: !0,
                momentumBounceRatio: 1,
                momentumVelocityRatio: 1,
                sticky: !1,
                minimumVelocity: .02
            }
        }),
        Object.assign(t, {
            freeMode: {
                onTouchStart: function() {
                    const e = t.getTranslate();
                    t.setTranslate(e),
                    t.setTransition(0),
                    t.touchEventsData.velocities.length = 0,
                    t.freeMode.onTouchEnd({
                        currentPos: t.rtl ? t.translate : -t.translate
                    })
                },
                onTouchMove: function() {
                    const {touchEventsData: e, touches: s} = t;
                    0 === e.velocities.length && e.velocities.push({
                        position: s[t.isHorizontal() ? "startX" : "startY"],
                        time: e.touchStartTime
                    }),
                    e.velocities.push({
                        position: s[t.isHorizontal() ? "currentX" : "currentY"],
                        time: u()
                    })
                },
                onTouchEnd: function(e) {
                    let {currentPos: s} = e;
                    const {params: r, $wrapperEl: n, rtlTranslate: l, snapGrid: o, touchEventsData: d} = t
                      , c = u() - d.touchStartTime;
                    if (s < -t.minTranslate())
                        t.slideTo(t.activeIndex);
                    else if (s > -t.maxTranslate())
                        t.slides.length < o.length ? t.slideTo(o.length - 1) : t.slideTo(t.slides.length - 1);
                    else {
                        if (r.freeMode.momentum) {
                            if (d.velocities.length > 1) {
                                const e = d.velocities.pop()
                                  , s = d.velocities.pop()
                                  , a = e.position - s.position
                                  , i = e.time - s.time;
                                t.velocity = a / i,
                                t.velocity /= 2,
                                Math.abs(t.velocity) < r.freeMode.minimumVelocity && (t.velocity = 0),
                                (i > 150 || u() - e.time > 300) && (t.velocity = 0)
                            } else
                                t.velocity = 0;
                            t.velocity *= r.freeMode.momentumVelocityRatio,
                            d.velocities.length = 0;
                            let e = 1e3 * r.freeMode.momentumRatio;
                            const s = t.velocity * e;
                            let c = t.translate + s;
                            l && (c = -c);
                            let p, h = !1;
                            const m = 20 * Math.abs(t.velocity) * r.freeMode.momentumBounceRatio;
                            let f;
                            if (c < t.maxTranslate())
                                r.freeMode.momentumBounce ? (c + t.maxTranslate() < -m && (c = t.maxTranslate() - m),
                                p = t.maxTranslate(),
                                h = !0,
                                d.allowMomentumBounce = !0) : c = t.maxTranslate(),
                                r.loop && r.centeredSlides && (f = !0);
                            else if (c > t.minTranslate())
                                r.freeMode.momentumBounce ? (c - t.minTranslate() > m && (c = t.minTranslate() + m),
                                p = t.minTranslate(),
                                h = !0,
                                d.allowMomentumBounce = !0) : c = t.minTranslate(),
                                r.loop && r.centeredSlides && (f = !0);
                            else if (r.freeMode.sticky) {
                                let e;
                                for (let t = 0; t < o.length; t += 1)
                                    if (o[t] > -c) {
                                        e = t;
                                        break
                                    }
                                c = Math.abs(o[e] - c) < Math.abs(o[e - 1] - c) || "next" === t.swipeDirection ? o[e] : o[e - 1],
                                c = -c
                            }
                            if (f && i("transitionEnd", (()=>{
                                t.loopFix()
                            }
                            )),
                            0 !== t.velocity) {
                                if (e = l ? Math.abs((-c - t.translate) / t.velocity) : Math.abs((c - t.translate) / t.velocity),
                                r.freeMode.sticky) {
                                    const s = Math.abs((l ? -c : c) - t.translate)
                                      , a = t.slidesSizesGrid[t.activeIndex];
                                    e = s < a ? r.speed : s < 2 * a ? 1.5 * r.speed : 2.5 * r.speed
                                }
                            } else if (r.freeMode.sticky)
                                return void t.slideToClosest();
                            r.freeMode.momentumBounce && h ? (t.updateProgress(p),
                            t.setTransition(e),
                            t.setTranslate(c),
                            t.transitionStart(!0, t.swipeDirection),
                            t.animating = !0,
                            n.transitionEnd((()=>{
                                t && !t.destroyed && d.allowMomentumBounce && (a("momentumBounce"),
                                t.setTransition(r.speed),
                                setTimeout((()=>{
                                    t.setTranslate(p),
                                    n.transitionEnd((()=>{
                                        t && !t.destroyed && t.transitionEnd()
                                    }
                                    ))
                                }
                                ), 0))
                            }
                            ))) : t.velocity ? (a("_freeModeNoMomentumRelease"),
                            t.updateProgress(c),
                            t.setTransition(e),
                            t.setTranslate(c),
                            t.transitionStart(!0, t.swipeDirection),
                            t.animating || (t.animating = !0,
                            n.transitionEnd((()=>{
                                t && !t.destroyed && t.transitionEnd()
                            }
                            )))) : t.updateProgress(c),
                            t.updateActiveIndex(),
                            t.updateSlidesClasses()
                        } else {
                            if (r.freeMode.sticky)
                                return void t.slideToClosest();
                            r.freeMode && a("_freeModeNoMomentumRelease")
                        }
                        (!r.freeMode.momentum || c >= r.longSwipesMs) && (t.updateProgress(),
                        t.updateActiveIndex(),
                        t.updateSlidesClasses())
                    }
                }
            }
        })
    }
    , function(e) {
        let t, s, a, {swiper: i, extendParams: r} = e;
        r({
            grid: {
                rows: 1,
                fill: "column"
            }
        }),
        i.grid = {
            initSlides: e=>{
                const {slidesPerView: r} = i.params
                  , {rows: n, fill: l} = i.params.grid;
                s = t / n,
                a = Math.floor(e / n),
                t = Math.floor(e / n) === e / n ? e : Math.ceil(e / n) * n,
                "auto" !== r && "row" === l && (t = Math.max(t, r * n))
            }
            ,
            updateSlide: (e,r,n,l)=>{
                const {slidesPerGroup: o, spaceBetween: d} = i.params
                  , {rows: c, fill: p} = i.params.grid;
                let u, h, m;
                if ("row" === p && o > 1) {
                    const s = Math.floor(e / (o * c))
                      , a = e - c * o * s
                      , i = 0 === s ? o : Math.min(Math.ceil((n - s * c * o) / c), o);
                    m = Math.floor(a / i),
                    h = a - m * i + s * o,
                    u = h + m * t / c,
                    r.css({
                        "-webkit-order": u,
                        order: u
                    })
                } else
                    "column" === p ? (h = Math.floor(e / c),
                    m = e - h * c,
                    (h > a || h === a && m === c - 1) && (m += 1,
                    m >= c && (m = 0,
                    h += 1))) : (m = Math.floor(e / s),
                    h = e - m * s);
                r.css(l("margin-top"), 0 !== m ? d && `${d}px` : "")
            }
            ,
            updateWrapperSize: (e,s,a)=>{
                const {spaceBetween: r, centeredSlides: n, roundLengths: l} = i.params
                  , {rows: o} = i.params.grid;
                if (i.virtualSize = (e + r) * t,
                i.virtualSize = Math.ceil(i.virtualSize / o) - r,
                i.$wrapperEl.css({
                    [a("width")]: `${i.virtualSize + r}px`
                }),
                n) {
                    s.splice(0, s.length);
                    const e = [];
                    for (let t = 0; t < s.length; t += 1) {
                        let a = s[t];
                        l && (a = Math.floor(a)),
                        s[t] < i.virtualSize + s[0] && e.push(a)
                    }
                    s.push(...e)
                }
            }
        }
    }
    , function(e) {
        let {swiper: t} = e;
        Object.assign(t, {
            appendSlide: K.bind(t),
            prependSlide: Z.bind(t),
            addSlide: J.bind(t),
            removeSlide: Q.bind(t),
            removeAllSlides: ee.bind(t)
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        s({
            fadeEffect: {
                crossFade: !1,
                transformEl: null
            }
        }),
        te({
            effect: "fade",
            swiper: t,
            on: a,
            setTranslate: ()=>{
                const {slides: e} = t
                  , s = t.params.fadeEffect;
                for (let a = 0; a < e.length; a += 1) {
                    const e = t.slides.eq(a);
                    let i = -e[0].swiperSlideOffset;
                    t.params.virtualTranslate || (i -= t.translate);
                    let r = 0;
                    t.isHorizontal() || (r = i,
                    i = 0);
                    const n = t.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(e[0].progress), 0) : 1 + Math.min(Math.max(e[0].progress, -1), 0);
                    se(s, e).css({
                        opacity: n
                    }).transform(`translate3d(${i}px, ${r}px, 0px)`)
                }
            }
            ,
            setTransition: e=>{
                const {transformEl: s} = t.params.fadeEffect;
                (s ? t.slides.find(s) : t.slides).transition(e),
                ae({
                    swiper: t,
                    duration: e,
                    transformEl: s,
                    allSlides: !0
                })
            }
            ,
            overwriteParams: ()=>({
                slidesPerView: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: !0,
                spaceBetween: 0,
                virtualTranslate: !t.params.cssMode
            })
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        s({
            cubeEffect: {
                slideShadows: !0,
                shadow: !0,
                shadowOffset: 20,
                shadowScale: .94
            }
        }),
        te({
            effect: "cube",
            swiper: t,
            on: a,
            setTranslate: ()=>{
                const {$el: e, $wrapperEl: s, slides: a, width: i, height: r, rtlTranslate: n, size: l, browser: o} = t
                  , c = t.params.cubeEffect
                  , p = t.isHorizontal()
                  , u = t.virtual && t.params.virtual.enabled;
                let h, m = 0;
                c.shadow && (p ? (h = s.find(".swiper-cube-shadow"),
                0 === h.length && (h = d('<div class="swiper-cube-shadow"></div>'),
                s.append(h)),
                h.css({
                    height: `${i}px`
                })) : (h = e.find(".swiper-cube-shadow"),
                0 === h.length && (h = d('<div class="swiper-cube-shadow"></div>'),
                e.append(h))));
                for (let e = 0; e < a.length; e += 1) {
                    const t = a.eq(e);
                    let s = e;
                    u && (s = parseInt(t.attr("data-swiper-slide-index"), 10));
                    let i = 90 * s
                      , r = Math.floor(i / 360);
                    n && (i = -i,
                    r = Math.floor(-i / 360));
                    const o = Math.max(Math.min(t[0].progress, 1), -1);
                    let h = 0
                      , f = 0
                      , g = 0;
                    s % 4 == 0 ? (h = 4 * -r * l,
                    g = 0) : (s - 1) % 4 == 0 ? (h = 0,
                    g = 4 * -r * l) : (s - 2) % 4 == 0 ? (h = l + 4 * r * l,
                    g = l) : (s - 3) % 4 == 0 && (h = -l,
                    g = 3 * l + 4 * l * r),
                    n && (h = -h),
                    p || (f = h,
                    h = 0);
                    const v = `rotateX(${p ? 0 : -i}deg) rotateY(${p ? i : 0}deg) translate3d(${h}px, ${f}px, ${g}px)`;
                    if (o <= 1 && o > -1 && (m = 90 * s + 90 * o,
                    n && (m = 90 * -s - 90 * o)),
                    t.transform(v),
                    c.slideShadows) {
                        let e = p ? t.find(".swiper-slide-shadow-left") : t.find(".swiper-slide-shadow-top")
                          , s = p ? t.find(".swiper-slide-shadow-right") : t.find(".swiper-slide-shadow-bottom");
                        0 === e.length && (e = d(`<div class="swiper-slide-shadow-${p ? "left" : "top"}"></div>`),
                        t.append(e)),
                        0 === s.length && (s = d(`<div class="swiper-slide-shadow-${p ? "right" : "bottom"}"></div>`),
                        t.append(s)),
                        e.length && (e[0].style.opacity = Math.max(-o, 0)),
                        s.length && (s[0].style.opacity = Math.max(o, 0))
                    }
                }
                if (s.css({
                    "-webkit-transform-origin": `50% 50% -${l / 2}px`,
                    "transform-origin": `50% 50% -${l / 2}px`
                }),
                c.shadow)
                    if (p)
                        h.transform(`translate3d(0px, ${i / 2 + c.shadowOffset}px, ${-i / 2}px) rotateX(90deg) rotateZ(0deg) scale(${c.shadowScale})`);
                    else {
                        const e = Math.abs(m) - 90 * Math.floor(Math.abs(m) / 90)
                          , t = 1.5 - (Math.sin(2 * e * Math.PI / 360) / 2 + Math.cos(2 * e * Math.PI / 360) / 2)
                          , s = c.shadowScale
                          , a = c.shadowScale / t
                          , i = c.shadowOffset;
                        h.transform(`scale3d(${s}, 1, ${a}) translate3d(0px, ${r / 2 + i}px, ${-r / 2 / a}px) rotateX(-90deg)`)
                    }
                const f = o.isSafari || o.isWebView ? -l / 2 : 0;
                s.transform(`translate3d(0px,0,${f}px) rotateX(${t.isHorizontal() ? 0 : m}deg) rotateY(${t.isHorizontal() ? -m : 0}deg)`)
            }
            ,
            setTransition: e=>{
                const {$el: s, slides: a} = t;
                a.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
                t.params.cubeEffect.shadow && !t.isHorizontal() && s.find(".swiper-cube-shadow").transition(e)
            }
            ,
            perspective: ()=>!0,
            overwriteParams: ()=>({
                slidesPerView: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: !0,
                resistanceRatio: 0,
                spaceBetween: 0,
                centeredSlides: !1,
                virtualTranslate: !0
            })
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        s({
            flipEffect: {
                slideShadows: !0,
                limitRotation: !0,
                transformEl: null
            }
        }),
        te({
            effect: "flip",
            swiper: t,
            on: a,
            setTranslate: ()=>{
                const {slides: e, rtlTranslate: s} = t
                  , a = t.params.flipEffect;
                for (let i = 0; i < e.length; i += 1) {
                    const r = e.eq(i);
                    let n = r[0].progress;
                    t.params.flipEffect.limitRotation && (n = Math.max(Math.min(r[0].progress, 1), -1));
                    const l = r[0].swiperSlideOffset;
                    let o = -180 * n
                      , d = 0
                      , c = t.params.cssMode ? -l - t.translate : -l
                      , p = 0;
                    if (t.isHorizontal() ? s && (o = -o) : (p = c,
                    c = 0,
                    d = -o,
                    o = 0),
                    r[0].style.zIndex = -Math.abs(Math.round(n)) + e.length,
                    a.slideShadows) {
                        let e = t.isHorizontal() ? r.find(".swiper-slide-shadow-left") : r.find(".swiper-slide-shadow-top")
                          , s = t.isHorizontal() ? r.find(".swiper-slide-shadow-right") : r.find(".swiper-slide-shadow-bottom");
                        0 === e.length && (e = ie(a, r, t.isHorizontal() ? "left" : "top")),
                        0 === s.length && (s = ie(a, r, t.isHorizontal() ? "right" : "bottom")),
                        e.length && (e[0].style.opacity = Math.max(-n, 0)),
                        s.length && (s[0].style.opacity = Math.max(n, 0))
                    }
                    const u = `translate3d(${c}px, ${p}px, 0px) rotateX(${d}deg) rotateY(${o}deg)`;
                    se(a, r).transform(u)
                }
            }
            ,
            setTransition: e=>{
                const {transformEl: s} = t.params.flipEffect;
                (s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
                ae({
                    swiper: t,
                    duration: e,
                    transformEl: s
                })
            }
            ,
            perspective: ()=>!0,
            overwriteParams: ()=>({
                slidesPerView: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: !0,
                spaceBetween: 0,
                virtualTranslate: !t.params.cssMode
            })
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        s({
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                scale: 1,
                modifier: 1,
                slideShadows: !0,
                transformEl: null
            }
        }),
        te({
            effect: "coverflow",
            swiper: t,
            on: a,
            setTranslate: ()=>{
                const {width: e, height: s, slides: a, slidesSizesGrid: i} = t
                  , r = t.params.coverflowEffect
                  , n = t.isHorizontal()
                  , l = t.translate
                  , o = n ? e / 2 - l : s / 2 - l
                  , d = n ? r.rotate : -r.rotate
                  , c = r.depth;
                for (let e = 0, t = a.length; e < t; e += 1) {
                    const t = a.eq(e)
                      , s = i[e]
                      , l = (o - t[0].swiperSlideOffset - s / 2) / s
                      , p = "function" == typeof r.modifier ? r.modifier(l) : l * r.modifier;
                    let u = n ? d * p : 0
                      , h = n ? 0 : d * p
                      , m = -c * Math.abs(p)
                      , f = r.stretch;
                    "string" == typeof f && -1 !== f.indexOf("%") && (f = parseFloat(r.stretch) / 100 * s);
                    let g = n ? 0 : f * p
                      , v = n ? f * p : 0
                      , w = 1 - (1 - r.scale) * Math.abs(p);
                    Math.abs(v) < .001 && (v = 0),
                    Math.abs(g) < .001 && (g = 0),
                    Math.abs(m) < .001 && (m = 0),
                    Math.abs(u) < .001 && (u = 0),
                    Math.abs(h) < .001 && (h = 0),
                    Math.abs(w) < .001 && (w = 0);
                    const b = `translate3d(${v}px,${g}px,${m}px)  rotateX(${h}deg) rotateY(${u}deg) scale(${w})`;
                    if (se(r, t).transform(b),
                    t[0].style.zIndex = 1 - Math.abs(Math.round(p)),
                    r.slideShadows) {
                        let e = n ? t.find(".swiper-slide-shadow-left") : t.find(".swiper-slide-shadow-top")
                          , s = n ? t.find(".swiper-slide-shadow-right") : t.find(".swiper-slide-shadow-bottom");
                        0 === e.length && (e = ie(r, t, n ? "left" : "top")),
                        0 === s.length && (s = ie(r, t, n ? "right" : "bottom")),
                        e.length && (e[0].style.opacity = p > 0 ? p : 0),
                        s.length && (s[0].style.opacity = -p > 0 ? -p : 0)
                    }
                }
            }
            ,
            setTransition: e=>{
                const {transformEl: s} = t.params.coverflowEffect;
                (s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)
            }
            ,
            perspective: ()=>!0,
            overwriteParams: ()=>({
                watchSlidesProgress: !0
            })
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        s({
            creativeEffect: {
                transformEl: null,
                limitProgress: 1,
                shadowPerProgress: !1,
                progressMultiplier: 1,
                perspective: !0,
                prev: {
                    translate: [0, 0, 0],
                    rotate: [0, 0, 0],
                    opacity: 1,
                    scale: 1
                },
                next: {
                    translate: [0, 0, 0],
                    rotate: [0, 0, 0],
                    opacity: 1,
                    scale: 1
                }
            }
        });
        const i = e=>"string" == typeof e ? e : `${e}px`;
        te({
            effect: "creative",
            swiper: t,
            on: a,
            setTranslate: ()=>{
                const {slides: e, $wrapperEl: s, slidesSizesGrid: a} = t
                  , r = t.params.creativeEffect
                  , {progressMultiplier: n} = r
                  , l = t.params.centeredSlides;
                if (l) {
                    const e = a[0] / 2 - t.params.slidesOffsetBefore || 0;
                    s.transform(`translateX(calc(50% - ${e}px))`)
                }
                for (let s = 0; s < e.length; s += 1) {
                    const a = e.eq(s)
                      , o = a[0].progress
                      , d = Math.min(Math.max(a[0].progress, -r.limitProgress), r.limitProgress);
                    let c = d;
                    l || (c = Math.min(Math.max(a[0].originalProgress, -r.limitProgress), r.limitProgress));
                    const p = a[0].swiperSlideOffset
                      , u = [t.params.cssMode ? -p - t.translate : -p, 0, 0]
                      , h = [0, 0, 0];
                    let m = !1;
                    t.isHorizontal() || (u[1] = u[0],
                    u[0] = 0);
                    let f = {
                        translate: [0, 0, 0],
                        rotate: [0, 0, 0],
                        scale: 1,
                        opacity: 1
                    };
                    d < 0 ? (f = r.next,
                    m = !0) : d > 0 && (f = r.prev,
                    m = !0),
                    u.forEach(((e,t)=>{
                        u[t] = `calc(${e}px + (${i(f.translate[t])} * ${Math.abs(d * n)}))`
                    }
                    )),
                    h.forEach(((e,t)=>{
                        h[t] = f.rotate[t] * Math.abs(d * n)
                    }
                    )),
                    a[0].style.zIndex = -Math.abs(Math.round(o)) + e.length;
                    const g = u.join(", ")
                      , v = `rotateX(${h[0]}deg) rotateY(${h[1]}deg) rotateZ(${h[2]}deg)`
                      , w = c < 0 ? `scale(${1 + (1 - f.scale) * c * n})` : `scale(${1 - (1 - f.scale) * c * n})`
                      , b = c < 0 ? 1 + (1 - f.opacity) * c * n : 1 - (1 - f.opacity) * c * n
                      , x = `translate3d(${g}) ${v} ${w}`;
                    if (m && f.shadow || !m) {
                        let e = a.children(".swiper-slide-shadow");
                        if (0 === e.length && f.shadow && (e = ie(r, a)),
                        e.length) {
                            const t = r.shadowPerProgress ? d * (1 / r.limitProgress) : d;
                            e[0].style.opacity = Math.min(Math.max(Math.abs(t), 0), 1)
                        }
                    }
                    const y = se(r, a);
                    y.transform(x).css({
                        opacity: b
                    }),
                    f.origin && y.css("transform-origin", f.origin)
                }
            }
            ,
            setTransition: e=>{
                const {transformEl: s} = t.params.creativeEffect;
                (s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow").transition(e),
                ae({
                    swiper: t,
                    duration: e,
                    transformEl: s,
                    allSlides: !0
                })
            }
            ,
            perspective: ()=>t.params.creativeEffect.perspective,
            overwriteParams: ()=>({
                watchSlidesProgress: !0,
                virtualTranslate: !t.params.cssMode
            })
        })
    }
    , function(e) {
        let {swiper: t, extendParams: s, on: a} = e;
        s({
            cardsEffect: {
                slideShadows: !0,
                transformEl: null,
                rotate: !0
            }
        }),
        te({
            effect: "cards",
            swiper: t,
            on: a,
            setTranslate: ()=>{
                const {slides: e, activeIndex: s} = t
                  , a = t.params.cardsEffect
                  , {startTranslate: i, isTouched: r} = t.touchEventsData
                  , n = t.translate;
                for (let l = 0; l < e.length; l += 1) {
                    const o = e.eq(l)
                      , d = o[0].progress
                      , c = Math.min(Math.max(d, -4), 4);
                    let p = o[0].swiperSlideOffset;
                    t.params.centeredSlides && !t.params.cssMode && t.$wrapperEl.transform(`translateX(${t.minTranslate()}px)`),
                    t.params.centeredSlides && t.params.cssMode && (p -= e[0].swiperSlideOffset);
                    let u = t.params.cssMode ? -p - t.translate : -p
                      , h = 0;
                    const m = -100 * Math.abs(c);
                    let f = 1
                      , g = -2 * c
                      , v = 8 - .75 * Math.abs(c);
                    const w = t.virtual && t.params.virtual.enabled ? t.virtual.from + l : l
                      , b = (w === s || w === s - 1) && c > 0 && c < 1 && (r || t.params.cssMode) && n < i
                      , x = (w === s || w === s + 1) && c < 0 && c > -1 && (r || t.params.cssMode) && n > i;
                    if (b || x) {
                        const e = (1 - Math.abs((Math.abs(c) - .5) / .5)) ** .5;
                        g += -28 * c * e,
                        f += -.5 * e,
                        v += 96 * e,
                        h = -25 * e * Math.abs(c) + "%"
                    }
                    if (u = c < 0 ? `calc(${u}px + (${v * Math.abs(c)}%))` : c > 0 ? `calc(${u}px + (-${v * Math.abs(c)}%))` : `${u}px`,
                    !t.isHorizontal()) {
                        const e = h;
                        h = u,
                        u = e
                    }
                    const y = c < 0 ? "" + (1 + (1 - f) * c) : "" + (1 - (1 - f) * c)
                      , E = `\n        translate3d(${u}, ${h}, ${m}px)\n        rotateZ(${a.rotate ? g : 0}deg)\n        scale(${y})\n      `;
                    if (a.slideShadows) {
                        let e = o.find(".swiper-slide-shadow");
                        0 === e.length && (e = ie(a, o)),
                        e.length && (e[0].style.opacity = Math.min(Math.max((Math.abs(c) - .5) / .5, 0), 1))
                    }
                    o[0].style.zIndex = -Math.abs(Math.round(d)) + e.length;
                    se(a, o).transform(E)
                }
            }
            ,
            setTransition: e=>{
                const {transformEl: s} = t.params.cardsEffect;
                (s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow").transition(e),
                ae({
                    swiper: t,
                    duration: e,
                    transformEl: s
                })
            }
            ,
            perspective: ()=>!0,
            overwriteParams: ()=>({
                watchSlidesProgress: !0,
                virtualTranslate: !t.params.cssMode
            })
        })
    }
    ];
    return V.use(re),
    V
}
));
//# sourceMappingURL=swiper-bundle.min.js.map

/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.18
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
!function(factory) {
    "function" == typeof define && define.amd && define.amd.jQuery ? define(["jquery"], factory) : factory("undefined" != typeof module && module.exports ? require("jquery") : jQuery)
}(function($) {
    "use strict";
    function init(options) {
        return !options || void 0 !== options.allowPageScroll || void 0 === options.swipe && void 0 === options.swipeStatus || (options.allowPageScroll = NONE),
        void 0 !== options.click && void 0 === options.tap && (options.tap = options.click),
        options || (options = {}),
        options = $.extend({}, $.fn.swipe.defaults, options),
        this.each(function() {
            var $this = $(this)
              , plugin = $this.data(PLUGIN_NS);
            plugin || (plugin = new TouchSwipe(this,options),
            $this.data(PLUGIN_NS, plugin))
        })
    }
    function TouchSwipe(element, options) {
        function touchStart(jqEvent) {
            if (!(getTouchInProgress() || $(jqEvent.target).closest(options.excludedElements, $element).length > 0)) {
                var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
                if (!event.pointerType || "mouse" != event.pointerType || 0 != options.fallbackToMouseEvents) {
                    var ret, touches = event.touches, evt = touches ? touches[0] : event;
                    return phase = PHASE_START,
                    touches ? fingerCount = touches.length : options.preventDefaultEvents !== !1 && jqEvent.preventDefault(),
                    distance = 0,
                    direction = null,
                    currentDirection = null,
                    pinchDirection = null,
                    duration = 0,
                    startTouchesDistance = 0,
                    endTouchesDistance = 0,
                    pinchZoom = 1,
                    pinchDistance = 0,
                    maximumsMap = createMaximumsData(),
                    cancelMultiFingerRelease(),
                    createFingerData(0, evt),
                    !touches || fingerCount === options.fingers || options.fingers === ALL_FINGERS || hasPinches() ? (startTime = getTimeStamp(),
                    2 == fingerCount && (createFingerData(1, touches[1]),
                    startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start)),
                    (options.swipeStatus || options.pinchStatus) && (ret = triggerHandler(event, phase))) : ret = !1,
                    ret === !1 ? (phase = PHASE_CANCEL,
                    triggerHandler(event, phase),
                    ret) : (options.hold && (holdTimeout = setTimeout($.proxy(function() {
                        $element.trigger("hold", [event.target]),
                        options.hold && (ret = options.hold.call($element, event, event.target))
                    }, this), options.longTapThreshold)),
                    setTouchInProgress(!0),
                    null)
                }
            }
        }
        function touchMove(jqEvent) {
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
            if (phase !== PHASE_END && phase !== PHASE_CANCEL && !inMultiFingerRelease()) {
                var ret, touches = event.touches, evt = touches ? touches[0] : event, currentFinger = updateFingerData(evt);
                if (endTime = getTimeStamp(),
                touches && (fingerCount = touches.length),
                options.hold && clearTimeout(holdTimeout),
                phase = PHASE_MOVE,
                2 == fingerCount && (0 == startTouchesDistance ? (createFingerData(1, touches[1]),
                startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start)) : (updateFingerData(touches[1]),
                endTouchesDistance = calculateTouchesDistance(fingerData[0].end, fingerData[1].end),
                pinchDirection = calculatePinchDirection(fingerData[0].end, fingerData[1].end)),
                pinchZoom = calculatePinchZoom(startTouchesDistance, endTouchesDistance),
                pinchDistance = Math.abs(startTouchesDistance - endTouchesDistance)),
                fingerCount === options.fingers || options.fingers === ALL_FINGERS || !touches || hasPinches()) {
                    if (direction = calculateDirection(currentFinger.start, currentFinger.end),
                    currentDirection = calculateDirection(currentFinger.last, currentFinger.end),
                    validateDefaultEvent(jqEvent, currentDirection),
                    distance = calculateDistance(currentFinger.start, currentFinger.end),
                    duration = calculateDuration(),
                    setMaxDistance(direction, distance),
                    ret = triggerHandler(event, phase),
                    !options.triggerOnTouchEnd || options.triggerOnTouchLeave) {
                        var inBounds = !0;
                        if (options.triggerOnTouchLeave) {
                            var bounds = getbounds(this);
                            inBounds = isInBounds(currentFinger.end, bounds)
                        }
                        !options.triggerOnTouchEnd && inBounds ? phase = getNextPhase(PHASE_MOVE) : options.triggerOnTouchLeave && !inBounds && (phase = getNextPhase(PHASE_END)),
                        phase != PHASE_CANCEL && phase != PHASE_END || triggerHandler(event, phase)
                    }
                } else
                    phase = PHASE_CANCEL,
                    triggerHandler(event, phase);
                ret === !1 && (phase = PHASE_CANCEL,
                triggerHandler(event, phase))
            }
        }
        function touchEnd(jqEvent) {
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent
              , touches = event.touches;
            if (touches) {
                if (touches.length && !inMultiFingerRelease())
                    return startMultiFingerRelease(event),
                    !0;
                if (touches.length && inMultiFingerRelease())
                    return !0
            }
            return inMultiFingerRelease() && (fingerCount = fingerCountAtRelease),
            endTime = getTimeStamp(),
            duration = calculateDuration(),
            didSwipeBackToCancel() || !validateSwipeDistance() ? (phase = PHASE_CANCEL,
            triggerHandler(event, phase)) : options.triggerOnTouchEnd || options.triggerOnTouchEnd === !1 && phase === PHASE_MOVE ? (options.preventDefaultEvents !== !1 && jqEvent.cancelable !== !1 && jqEvent.preventDefault(),
            phase = PHASE_END,
            triggerHandler(event, phase)) : !options.triggerOnTouchEnd && hasTap() ? (phase = PHASE_END,
            triggerHandlerForGesture(event, phase, TAP)) : phase === PHASE_MOVE && (phase = PHASE_CANCEL,
            triggerHandler(event, phase)),
            setTouchInProgress(!1),
            null
        }
        function touchCancel() {
            fingerCount = 0,
            endTime = 0,
            startTime = 0,
            startTouchesDistance = 0,
            endTouchesDistance = 0,
            pinchZoom = 1,
            cancelMultiFingerRelease(),
            setTouchInProgress(!1)
        }
        function touchLeave(jqEvent) {
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
            options.triggerOnTouchLeave && (phase = getNextPhase(PHASE_END),
            triggerHandler(event, phase))
        }
        function removeListeners() {
            $element.off(START_EV, touchStart),
            $element.off(CANCEL_EV, touchCancel),
            $element.off(MOVE_EV, touchMove),
            $element.off(END_EV, touchEnd),
            LEAVE_EV && $element.off(LEAVE_EV, touchLeave),
            setTouchInProgress(!1)
        }
        function getNextPhase(currentPhase) {
            var nextPhase = currentPhase
              , validTime = validateSwipeTime()
              , validDistance = validateSwipeDistance()
              , didCancel = didSwipeBackToCancel();
            return !validTime || didCancel ? nextPhase = PHASE_CANCEL : !validDistance || currentPhase != PHASE_MOVE || options.triggerOnTouchEnd && !options.triggerOnTouchLeave ? !validDistance && currentPhase == PHASE_END && options.triggerOnTouchLeave && (nextPhase = PHASE_CANCEL) : nextPhase = PHASE_END,
            nextPhase
        }
        function triggerHandler(event, phase) {
            var ret, touches = event.touches;
            return (didSwipe() || hasSwipes()) && (ret = triggerHandlerForGesture(event, phase, SWIPE)),
            (didPinch() || hasPinches()) && ret !== !1 && (ret = triggerHandlerForGesture(event, phase, PINCH)),
            didDoubleTap() && ret !== !1 ? ret = triggerHandlerForGesture(event, phase, DOUBLE_TAP) : didLongTap() && ret !== !1 ? ret = triggerHandlerForGesture(event, phase, LONG_TAP) : didTap() && ret !== !1 && (ret = triggerHandlerForGesture(event, phase, TAP)),
            phase === PHASE_CANCEL && touchCancel(event),
            phase === PHASE_END && (touches ? touches.length || touchCancel(event) : touchCancel(event)),
            ret
        }
        function triggerHandlerForGesture(event, phase, gesture) {
            var ret;
            if (gesture == SWIPE) {
                if ($element.trigger("swipeStatus", [phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData, currentDirection]),
                options.swipeStatus && (ret = options.swipeStatus.call($element, event, phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData, currentDirection),
                ret === !1))
                    return !1;
                if (phase == PHASE_END && validateSwipe()) {
                    if (clearTimeout(singleTapTimeout),
                    clearTimeout(holdTimeout),
                    $element.trigger("swipe", [direction, distance, duration, fingerCount, fingerData, currentDirection]),
                    options.swipe && (ret = options.swipe.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection),
                    ret === !1))
                        return !1;
                    switch (direction) {
                    case LEFT:
                        $element.trigger("swipeLeft", [direction, distance, duration, fingerCount, fingerData, currentDirection]),
                        options.swipeLeft && (ret = options.swipeLeft.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
                        break;
                    case RIGHT:
                        $element.trigger("swipeRight", [direction, distance, duration, fingerCount, fingerData, currentDirection]),
                        options.swipeRight && (ret = options.swipeRight.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
                        break;
                    case UP:
                        $element.trigger("swipeUp", [direction, distance, duration, fingerCount, fingerData, currentDirection]),
                        options.swipeUp && (ret = options.swipeUp.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
                        break;
                    case DOWN:
                        $element.trigger("swipeDown", [direction, distance, duration, fingerCount, fingerData, currentDirection]),
                        options.swipeDown && (ret = options.swipeDown.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection))
                    }
                }
            }
            if (gesture == PINCH) {
                if ($element.trigger("pinchStatus", [phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]),
                options.pinchStatus && (ret = options.pinchStatus.call($element, event, phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData),
                ret === !1))
                    return !1;
                if (phase == PHASE_END && validatePinch())
                    switch (pinchDirection) {
                    case IN:
                        $element.trigger("pinchIn", [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]),
                        options.pinchIn && (ret = options.pinchIn.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData));
                        break;
                    case OUT:
                        $element.trigger("pinchOut", [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]),
                        options.pinchOut && (ret = options.pinchOut.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData))
                    }
            }
            return gesture == TAP ? phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout),
            clearTimeout(holdTimeout),
            hasDoubleTap() && !inDoubleTap() ? (doubleTapStartTime = getTimeStamp(),
            singleTapTimeout = setTimeout($.proxy(function() {
                doubleTapStartTime = null,
                $element.trigger("tap", [event.target]),
                options.tap && (ret = options.tap.call($element, event, event.target))
            }, this), options.doubleTapThreshold)) : (doubleTapStartTime = null,
            $element.trigger("tap", [event.target]),
            options.tap && (ret = options.tap.call($element, event, event.target)))) : gesture == DOUBLE_TAP ? phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout),
            clearTimeout(holdTimeout),
            doubleTapStartTime = null,
            $element.trigger("doubletap", [event.target]),
            options.doubleTap && (ret = options.doubleTap.call($element, event, event.target))) : gesture == LONG_TAP && (phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout),
            doubleTapStartTime = null,
            $element.trigger("longtap", [event.target]),
            options.longTap && (ret = options.longTap.call($element, event, event.target)))),
            ret
        }
        function validateSwipeDistance() {
            var valid = !0;
            return null !== options.threshold && (valid = distance >= options.threshold),
            valid
        }
        function didSwipeBackToCancel() {
            var cancelled = !1;
            return null !== options.cancelThreshold && null !== direction && (cancelled = getMaxDistance(direction) - distance >= options.cancelThreshold),
            cancelled
        }
        function validatePinchDistance() {
            return null !== options.pinchThreshold ? pinchDistance >= options.pinchThreshold : !0
        }
        function validateSwipeTime() {
            var result;
            return result = options.maxTimeThreshold ? !(duration >= options.maxTimeThreshold) : !0
        }
        function validateDefaultEvent(jqEvent, direction) {
            if (options.preventDefaultEvents !== !1)
                if (options.allowPageScroll === NONE)
                    jqEvent.preventDefault();
                else {
                    var auto = options.allowPageScroll === AUTO;
                    switch (direction) {
                    case LEFT:
                        (options.swipeLeft && auto || !auto && options.allowPageScroll != HORIZONTAL) && jqEvent.preventDefault();
                        break;
                    case RIGHT:
                        (options.swipeRight && auto || !auto && options.allowPageScroll != HORIZONTAL) && jqEvent.preventDefault();
                        break;
                    case UP:
                        (options.swipeUp && auto || !auto && options.allowPageScroll != VERTICAL) && jqEvent.preventDefault();
                        break;
                    case DOWN:
                        (options.swipeDown && auto || !auto && options.allowPageScroll != VERTICAL) && jqEvent.preventDefault();
                        break;
                    case NONE:
                    }
                }
        }
        function validatePinch() {
            var hasCorrectFingerCount = validateFingers()
              , hasEndPoint = validateEndPoint()
              , hasCorrectDistance = validatePinchDistance();
            return hasCorrectFingerCount && hasEndPoint && hasCorrectDistance
        }
        function hasPinches() {
            return !!(options.pinchStatus || options.pinchIn || options.pinchOut)
        }
        function didPinch() {
            return !(!validatePinch() || !hasPinches())
        }
        function validateSwipe() {
            var hasValidTime = validateSwipeTime()
              , hasValidDistance = validateSwipeDistance()
              , hasCorrectFingerCount = validateFingers()
              , hasEndPoint = validateEndPoint()
              , didCancel = didSwipeBackToCancel()
              , valid = !didCancel && hasEndPoint && hasCorrectFingerCount && hasValidDistance && hasValidTime;
            return valid
        }
        function hasSwipes() {
            return !!(options.swipe || options.swipeStatus || options.swipeLeft || options.swipeRight || options.swipeUp || options.swipeDown)
        }
        function didSwipe() {
            return !(!validateSwipe() || !hasSwipes())
        }
        function validateFingers() {
            return fingerCount === options.fingers || options.fingers === ALL_FINGERS || !SUPPORTS_TOUCH
        }
        function validateEndPoint() {
            return 0 !== fingerData[0].end.x
        }
        function hasTap() {
            return !!options.tap
        }
        function hasDoubleTap() {
            return !!options.doubleTap
        }
        function hasLongTap() {
            return !!options.longTap
        }
        function validateDoubleTap() {
            if (null == doubleTapStartTime)
                return !1;
            var now = getTimeStamp();
            return hasDoubleTap() && now - doubleTapStartTime <= options.doubleTapThreshold
        }
        function inDoubleTap() {
            return validateDoubleTap()
        }
        function validateTap() {
            return (1 === fingerCount || !SUPPORTS_TOUCH) && (isNaN(distance) || distance < options.threshold)
        }
        function validateLongTap() {
            return duration > options.longTapThreshold && DOUBLE_TAP_THRESHOLD > distance
        }
        function didTap() {
            return !(!validateTap() || !hasTap())
        }
        function didDoubleTap() {
            return !(!validateDoubleTap() || !hasDoubleTap())
        }
        function didLongTap() {
            return !(!validateLongTap() || !hasLongTap())
        }
        function startMultiFingerRelease(event) {
            previousTouchEndTime = getTimeStamp(),
            fingerCountAtRelease = event.touches.length + 1
        }
        function cancelMultiFingerRelease() {
            previousTouchEndTime = 0,
            fingerCountAtRelease = 0
        }
        function inMultiFingerRelease() {
            var withinThreshold = !1;
            if (previousTouchEndTime) {
                var diff = getTimeStamp() - previousTouchEndTime;
                diff <= options.fingerReleaseThreshold && (withinThreshold = !0)
            }
            return withinThreshold
        }
        function getTouchInProgress() {
            return !($element.data(PLUGIN_NS + "_intouch") !== !0)
        }
        function setTouchInProgress(val) {
            $element && (val === !0 ? ($element.on(MOVE_EV, touchMove),
            $element.on(END_EV, touchEnd),
            LEAVE_EV && $element.on(LEAVE_EV, touchLeave)) : ($element.off(MOVE_EV, touchMove, !1),
            $element.off(END_EV, touchEnd, !1),
            LEAVE_EV && $element.off(LEAVE_EV, touchLeave, !1)),
            $element.data(PLUGIN_NS + "_intouch", val === !0))
        }
        function createFingerData(id, evt) {
            var f = {
                start: {
                    x: 0,
                    y: 0
                },
                last: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: 0,
                    y: 0
                }
            };
            return f.start.x = f.last.x = f.end.x = evt.pageX || evt.clientX,
            f.start.y = f.last.y = f.end.y = evt.pageY || evt.clientY,
            fingerData[id] = f,
            f
        }
        function updateFingerData(evt) {
            var id = void 0 !== evt.identifier ? evt.identifier : 0
              , f = getFingerData(id);
            return null === f && (f = createFingerData(id, evt)),
            f.last.x = f.end.x,
            f.last.y = f.end.y,
            f.end.x = evt.pageX || evt.clientX,
            f.end.y = evt.pageY || evt.clientY,
            f
        }
        function getFingerData(id) {
            return fingerData[id] || null
        }
        function setMaxDistance(direction, distance) {
            direction != NONE && (distance = Math.max(distance, getMaxDistance(direction)),
            maximumsMap[direction].distance = distance)
        }
        function getMaxDistance(direction) {
            return maximumsMap[direction] ? maximumsMap[direction].distance : void 0
        }
        function createMaximumsData() {
            var maxData = {};
            return maxData[LEFT] = createMaximumVO(LEFT),
            maxData[RIGHT] = createMaximumVO(RIGHT),
            maxData[UP] = createMaximumVO(UP),
            maxData[DOWN] = createMaximumVO(DOWN),
            maxData
        }
        function createMaximumVO(dir) {
            return {
                direction: dir,
                distance: 0
            }
        }
        function calculateDuration() {
            return endTime - startTime
        }
        function calculateTouchesDistance(startPoint, endPoint) {
            var diffX = Math.abs(startPoint.x - endPoint.x)
              , diffY = Math.abs(startPoint.y - endPoint.y);
            return Math.round(Math.sqrt(diffX * diffX + diffY * diffY))
        }
        function calculatePinchZoom(startDistance, endDistance) {
            var percent = endDistance / startDistance * 1;
            return percent.toFixed(2)
        }
        function calculatePinchDirection() {
            return 1 > pinchZoom ? OUT : IN
        }
        function calculateDistance(startPoint, endPoint) {
            return Math.round(Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)))
        }
        function calculateAngle(startPoint, endPoint) {
            var x = startPoint.x - endPoint.x
              , y = endPoint.y - startPoint.y
              , r = Math.atan2(y, x)
              , angle = Math.round(180 * r / Math.PI);
            return 0 > angle && (angle = 360 - Math.abs(angle)),
            angle
        }
        function calculateDirection(startPoint, endPoint) {
            if (comparePoints(startPoint, endPoint))
                return NONE;
            var angle = calculateAngle(startPoint, endPoint);
            return 45 >= angle && angle >= 0 ? LEFT : 360 >= angle && angle >= 315 ? LEFT : angle >= 135 && 225 >= angle ? RIGHT : angle > 45 && 135 > angle ? DOWN : UP
        }
        function getTimeStamp() {
            var now = new Date;
            return now.getTime()
        }
        function getbounds(el) {
            el = $(el);
            var offset = el.offset()
              , bounds = {
                left: offset.left,
                right: offset.left + el.outerWidth(),
                top: offset.top,
                bottom: offset.top + el.outerHeight()
            };
            return bounds
        }
        function isInBounds(point, bounds) {
            return point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom
        }
        function comparePoints(pointA, pointB) {
            return pointA.x == pointB.x && pointA.y == pointB.y
        }
        var options = $.extend({}, options)
          , useTouchEvents = SUPPORTS_TOUCH || SUPPORTS_POINTER || !options.fallbackToMouseEvents
          , START_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerDown" : "pointerdown" : "touchstart" : "mousedown"
          , MOVE_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerMove" : "pointermove" : "touchmove" : "mousemove"
          , END_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerUp" : "pointerup" : "touchend" : "mouseup"
          , LEAVE_EV = useTouchEvents ? SUPPORTS_POINTER ? "mouseleave" : null : "mouseleave"
          , CANCEL_EV = SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerCancel" : "pointercancel" : "touchcancel"
          , distance = 0
          , direction = null
          , currentDirection = null
          , duration = 0
          , startTouchesDistance = 0
          , endTouchesDistance = 0
          , pinchZoom = 1
          , pinchDistance = 0
          , pinchDirection = 0
          , maximumsMap = null
          , $element = $(element)
          , phase = "start"
          , fingerCount = 0
          , fingerData = {}
          , startTime = 0
          , endTime = 0
          , previousTouchEndTime = 0
          , fingerCountAtRelease = 0
          , doubleTapStartTime = 0
          , singleTapTimeout = null
          , holdTimeout = null;
        try {
            $element.on(START_EV, touchStart),
            $element.on(CANCEL_EV, touchCancel)
        } catch (e) {
            $.error("events not supported " + START_EV + "," + CANCEL_EV + " on jQuery.swipe")
        }
        this.enable = function() {
            return this.disable(),
            $element.on(START_EV, touchStart),
            $element.on(CANCEL_EV, touchCancel),
            $element
        }
        ,
        this.disable = function() {
            return removeListeners(),
            $element
        }
        ,
        this.destroy = function() {
            removeListeners(),
            $element.data(PLUGIN_NS, null),
            $element = null
        }
        ,
        this.option = function(property, value) {
            if ("object" == typeof property)
                options = $.extend(options, property);
            else if (void 0 !== options[property]) {
                if (void 0 === value)
                    return options[property];
                options[property] = value
            } else {
                if (!property)
                    return options;
                $.error("Option " + property + " does not exist on jQuery.swipe.options")
            }
            return null
        }
    }
    var VERSION = "1.6.18"
      , LEFT = "left"
      , RIGHT = "right"
      , UP = "up"
      , DOWN = "down"
      , IN = "in"
      , OUT = "out"
      , NONE = "none"
      , AUTO = "auto"
      , SWIPE = "swipe"
      , PINCH = "pinch"
      , TAP = "tap"
      , DOUBLE_TAP = "doubletap"
      , LONG_TAP = "longtap"
      , HORIZONTAL = "horizontal"
      , VERTICAL = "vertical"
      , ALL_FINGERS = "all"
      , DOUBLE_TAP_THRESHOLD = 10
      , PHASE_START = "start"
      , PHASE_MOVE = "move"
      , PHASE_END = "end"
      , PHASE_CANCEL = "cancel"
      , SUPPORTS_TOUCH = "ontouchstart"in window
      , SUPPORTS_POINTER_IE10 = window.navigator.msPointerEnabled && !window.PointerEvent && !SUPPORTS_TOUCH
      , SUPPORTS_POINTER = (window.PointerEvent || window.navigator.msPointerEnabled) && !SUPPORTS_TOUCH
      , PLUGIN_NS = "TouchSwipe"
      , defaults = {
        fingers: 1,
        threshold: 75,
        cancelThreshold: null,
        pinchThreshold: 20,
        maxTimeThreshold: null,
        fingerReleaseThreshold: 250,
        longTapThreshold: 500,
        doubleTapThreshold: 200,
        swipe: null,
        swipeLeft: null,
        swipeRight: null,
        swipeUp: null,
        swipeDown: null,
        swipeStatus: null,
        pinchIn: null,
        pinchOut: null,
        pinchStatus: null,
        click: null,
        tap: null,
        doubleTap: null,
        longTap: null,
        hold: null,
        triggerOnTouchEnd: !0,
        triggerOnTouchLeave: !1,
        allowPageScroll: "auto",
        fallbackToMouseEvents: !0,
        excludedElements: ".noSwipe",
        preventDefaultEvents: !0
    };
    $.fn.swipe = function(method) {
        var $this = $(this)
          , plugin = $this.data(PLUGIN_NS);
        if (plugin && "string" == typeof method) {
            if (plugin[method])
                return plugin[method].apply(plugin, Array.prototype.slice.call(arguments, 1));
            $.error("Method " + method + " does not exist on jQuery.swipe")
        } else if (plugin && "object" == typeof method)
            plugin.option.apply(plugin, arguments);
        else if (!(plugin || "object" != typeof method && method))
            return init.apply(this, arguments);
        return $this
    }
    ,
    $.fn.swipe.version = VERSION,
    $.fn.swipe.defaults = defaults,
    $.fn.swipe.phases = {
        PHASE_START: PHASE_START,
        PHASE_MOVE: PHASE_MOVE,
        PHASE_END: PHASE_END,
        PHASE_CANCEL: PHASE_CANCEL
    },
    $.fn.swipe.directions = {
        LEFT: LEFT,
        RIGHT: RIGHT,
        UP: UP,
        DOWN: DOWN,
        IN: IN,
        OUT: OUT
    },
    $.fn.swipe.pageScroll = {
        NONE: NONE,
        HORIZONTAL: HORIZONTAL,
        VERTICAL: VERTICAL,
        AUTO: AUTO
    },
    $.fn.swipe.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
        ALL: ALL_FINGERS
    }
});
function addSwipeTo(e) {
    $(e).swipe("destroy"),
    $(e).swipe({
        effect: "fade",
        swipe: function(e, o, n, t, i, a) {
            "left" == o && $(".mfp-arrow-right").trigger("click"),
            "right" == o && $(".mfp-arrow-left").trigger("click")
        }
    })
}
function truncate() {
    $(".truncate").each(function() {
        var e = $(this).text()
          , o = $(this).data("title")
          , n = $(this).data("line");
        n = parseInt(n);
        var t = $(this).data("min-width");
        t = parseInt(t),
        $(window).width() >= t ? o ? $(this).truncate("collapse") : ($(this).truncate({
            lines: n
        }),
        $(this).data("title", e)) : o && $(this).truncate("expand")
    })
}
function getCookie(e) {
    var o, n, t, i = document.cookie.split(";");
    for (o = 0; o < i.length; o++)
        if (n = i[o].substr(0, i[o].indexOf("=")),
        t = i[o].substr(i[o].indexOf("=") + 1),
        (n = n.replace(/^\s+|\s+$/g, "")) == e)
            return unescape(t)
}
function setCookie(e, o, n) {
    if (0 != n) {
        var t = new Date;
        t.setDate(t.getDate() + n);
        var i = escape(o) + (null == n ? "" : "; expires=" + t.toUTCString())
    } else
        i = escape(o);
    document.cookie = e + "=" + i + "; path=/"
}
function checkInfoCookie() {
    cookieAlert = getCookie("cookie-alert"),
    cookieAlert ? $(".cookie-alert").addClass("d-none") : $(".cookie-alert").removeClass("d-none")
}
!function(n) {
    n(".legal-message").length && n(document).on("click", ".legal-message > a.legal-accordion", function() {
        return n(this).parent().hasClass("open") ? (n(this).parent().removeClass("open"),
        n(this).parent().find("> div").slideUp(300)) : (n(this).parent().addClass("open"),
        n(this).parent().find("> div").slideDown(300)),
        !1
    }),
    n(document).on("click", ".show-more a", function() {
        var e = n(this).data("id");
        return n(this).parent().addClass("d-none"),
        n("#" + e).slideDown(300, function() {}),
        !1
    }),
    n(document).on("click", ".hide-text a", function() {
        var e = n(this).data("id");
        return n("#" + e).slideUp(300, function() {
            n(this).closest(".text-article").find(".show-more").removeClass("d-none")
        }),
        !1
    });
    var e, o = n(window).width(), t = (n(window).height(),
    n(".header").outerHeight()), i = n(window).scrollTop(), a = 0;
    if (t <= i ? n("body").addClass("header-scroll") : (changeHeader = 0,
    n("body").removeClass("header-scroll"),
    n("body").removeClass("up-scroll")),
    n(".article-bar").length && (c <= i ? n(".article-bar").addClass("active") : n(".article-bar").removeClass("active"),
    p = 100 / d * i,
    n(".article-bar .article-bar-progress span").css("width", p + "%")),
    n(window).scroll(function() {
        i = n(window).scrollTop(),
        t <= i ? n("body").addClass("header-scroll") : (n("body").removeClass("header-scroll"),
        n("body").removeClass("up-scroll")),
        a < i ? n("body").removeClass("up-scroll") : (n("header").addClass("header-animate"),
        n("body").addClass("up-scroll")),
        a = i,
        n(".article-bar").length && (c <= i ? n(".article-bar").addClass("active") : n(".article-bar").removeClass("active"),
        "90" < (p = 100 / d * i) && (p = "100"),
        n(".article-bar .article-bar-progress span").css("width", p + "%"))
    }),
    n(".article-bar").length) {
        var r = n(".content-article-head").outerHeight()
          , s = n(".content-article-head").outerHeight()
          , l = n(".content-article-head").offset()
          , c = l.top + r - s
          , d = n(".content-article").outerHeight() + l.top - s - n(".hero-main").outerHeight() - n(".footer").outerHeight()
          , p = 0;
        n(document).on("click", ".article-bar-content .article-bar-share > a", function() {
            return n(".article-bar-content").toggleClass("open-share"),
            !1
        })
    }
    if (n("#mobile-menu").length) {
        var u = n("#mobile-menu").attr("data-country")
          , m = n("#mobile-menu").attr("data-lang")
          , f = n("#mobile-menu").attr("data-meta-btn")
          , h = n("#mobile-menu").attr("data-meta-href")
          , b = new Array;
        if (b = "" != h ? ['<a href="#" class="mobile-group"><ul><li><i class="icon-efg-world"></i>' + u + "</li><li>" + m + "</li></ul></a>", '<a href="' + h + '" target="_blank" class="mobile-bank"><i class="icon-efg-bank"></i>' + f + "</a>"] : ['<a href="#" class="mobile-group"><ul><li><i class="icon-efg-world"></i>' + u + "</li><li>" + m + "</li></ul></a>"],
        n("#mobile-menu").length) {
            var v = new Mmenu("#mobile-menu",{
                extensions: ["position-front", "position-left", "fullscreen"],
                navbars: [{
                    content: b
                }]
            }).API;
            function g() {
                1200 <= n(window).width() && v.close()
            }
            g(),
            n(".mobile-menu-close").on("click", function() {
                return v.close(),
                !1
            }),
            n(".mobile-btn").on("click", function() {
                return setTimeout(function() {
                    n(window).trigger("resize"),
                    n("#mm-1 .mm-listview .mm-listitem:first-child .mm-listitem__text").text(n("#mm-1 .mm-listview .mm-listitem:first-child .mm-listitem__text").text())
                }, 1e3),
                !1
            }),
            setTimeout(function() {
                n(".group-layer-mobile").insertBefore("#mm-0")
            }, 1e3)
        }
    }
    if (n(".group-layer").length && (n(document).on("click", ".group-btn", function() {
        return n(".group-layer").toggleClass("open"),
        n("body").toggleClass("layer"),
        !1
    }),
    n(document).on("click", ".group-layer .group-layer-close", function() {
        return n(".group-layer").removeClass("open"),
        n("body").removeClass("layer"),
        !1
    })),
    n(".group-layer-mobile").length && (n(document).on("click", ".mobile-group", function() {
        return n(".group-layer-mobile").addClass("open"),
        !1
    }),
    n(document).on("click", ".group-layer-mobile .group-layer-close", function() {
        return n(".group-layer-mobile").removeClass("open"),
        !1
    })),
    n(".header-nav .submenu").length) {
        var w = 0;
        n(".header-nav .submenu").each(function() {
            0,
            n(this).find("> ul > li.sub").each(function(e) {
                n(this).attr("data-submenu", e)
            })
        }),
        n(document).on({
            mouseenter: function() {
                n(this).parent().hasClass("sub") ? (n(this).closest(".submenu").addClass("open"),
                n(".submenu > ul > li").removeClass("active"),
                n(".submenu > div > ul").removeClass("active"),
                w = n(this).parent().attr("data-submenu"),
                n(this).parent().addClass("active"),
                n(this).closest(".submenu").find("> div > ul").eq(w).addClass("active")) : (n(this).closest(".submenu").removeClass("open"),
                n(".submenu > ul > li").removeClass("active"),
                n(".submenu > div > ul").removeClass("active"))
            }
        }, ".header-nav .submenu > ul > li > a"),
        n(document).on({
            mouseleave: function() {
                n(this).removeClass("open"),
                n(".submenu > ul > li").removeClass("active"),
                n(".submenu > div > ul").removeClass("active")
            }
        }, ".header-nav .submenu"),
        n(document).on({
            mouseenter: function() {
                n(".group-layer").removeClass("open"),
                n("body").removeClass("layer")
            }
        }, ".header-nav > ul > li")
    }
    function C() {
        n(".info-box-wrapper").length && (n(document).off("click", ".info-box-wrapper > .info-box > a, .info-box-wrapper > .info-box > div"),
        n(document).off("mouseenter", ".info-box-wrapper > .info-box > a, .info-box-wrapper > .info-box > div").off("mouseleave", ".info-box-wrapper > .info-box > a, .info-box-wrapper > .info-box > div"),
        o < 1200 ? n(document).on("click", ".info-box-wrapper > .info-box > a, .info-box-wrapper > .info-box > div", function(e) {
            return n(this).parent().hasClass("open") ? (n(this).parent().removeClass("open"),
            n(this).find("p").stop().slideUp(400)) : (n(".info-box-wrapper > .info-box").removeClass("open"),
            n(".info-box-wrapper > .info-box p").stop().slideUp(400),
            n(this).parent().addClass("open"),
            n(this).find("p").stop().slideDown(400)),
            !1
        }) : (n(".info-box-wrapper > .info-box").removeClass("open"),
        n(".info-box-wrapper > .info-box p").stop().slideUp(400),
        n(document).on("mouseenter", ".info-box-wrapper > .info-box > a, .info-box-wrapper > .info-box > div", function() {
            n(this).parent().hasClass("open") ? (n(this).parent().removeClass("open"),
            n(this).find("p").stop().slideUp(400)) : (n(this).parent().addClass("open"),
            n(this).find("p").stop().slideDown(400))
        }).on("mouseleave", ".info-box-wrapper > .info-box > a, .info-box-wrapper > .info-box > div", function() {
            n(".info-box-wrapper > .info-box").removeClass("open"),
            n(".info-box-wrapper > .info-box p").stop().slideUp(400)
        })))
    }
    if (function() {
        if (n(".side-carousel").length) {
            var e = !1
              , o = n(".side-carousel").attr("data-time");
            0 < o && (e = !0),
            n(".side-carousel").hasClass("slick-initialized") || n(".side-carousel").slick({
                arrows: !0,
                prevArrow: '<button type="button" class="slick-prev"><i class="icon-efg-line-arrow-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next"><i class="icon-efg-line-arrow-right"></i></button>',
                infinite: !0,
                slidesToShow: 1,
                slidesToScroll: 1,
                swipe: !0,
                autoplay: e,
                autoplaySpeed: o,
                adaptiveHeight: !0
            })
        }
    }(),
    n(".news-slider").length && (n(".news-slider").hasClass("slick-initialized") || n(".news-slider").slick({
        dots: !0,
        appendDots: ".news-slider-pagination",
        arrows: !0,
        appendArrows: ".news-slider-nav",
        prevArrow: '<button type="button" class="slick-prev"><i class="icon-efg-line-arrow-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="icon-efg-line-arrow-right"></i></button>',
        infinite: !0,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: !0,
        adaptiveHeight: !0,
        fade: !0
    })),
    n(".form-field input").length && (n(".form-field:not(.checkbox, .radio, .select) input").each(function() {
        n(this).parent().append('<span class="clear"></span>')
    }),
    n(".form-field input").on("change keyup", function() {
        0 < n(this).val().length ? n(this).parent().addClass("filled") : n(this).parent().removeClass("filled")
    }),
    n(".form-field input").focusin(function() {
        n(this).parent().addClass("focus")
    }).focusout(function() {
        n(this).parent().removeClass("focus")
    }),
    n(document).on("click", ".form-field .clear", function() {
        return n(this).parent().find("input").val(""),
        n(this).parent().removeClass("filled"),
        !1
    })),
    n(".breadcrumb-mobile").length && (n(document).on("click", ".breadcrumb-mobile > a", function() {
        return n(".breadcrumb-mobile").toggleClass("open"),
        n("body").toggleClass("scroll-block"),
        !1
    }),
    n(document).on("click", ".breadcrumb-mobile > div .btn", function() {
        return n(".breadcrumb-mobile").removeClass("open"),
        n("body").removeClass("scroll-block"),
        !1
    }),
    n(document).bind("mouseup touchstart", function(e) {
        var o = n(".breadcrumb-mobile");
        o.is(e.target) || 0 !== o.has(e.target).length || (n(".breadcrumb-mobile").removeClass("open"),
        n("body").removeClass("scroll-block"))
    })),
    n(".table-download-mobile").length && n(".table-download-mobile > .table-download-component > div > .table-download-head").on("click", function() {
        return n(this).parent().hasClass("open") ? (n(this).parent().removeClass("open"),
        n(this).parent().find("> .table-download-content").slideUp(300)) : (n(this).parent().addClass("open"),
        n(this).parent().find("> .table-download-content").slideDown(300)),
        !1
    }),
    n(".info-accordion-wrapper").length && n(".info-accordion-wrapper .info-accordion > a").on("click", function() {
        return n(this).parent().hasClass("open") ? (n(this).parent().removeClass("open"),
        n(this).parent().find("> div").slideUp(300)) : (n(this).parent().addClass("open"),
        n(this).parent().find("> div").slideDown(300)),
        !1
    }),
    C(),
    n(".sm-hide").length && n(".sm-hide").parent().addClass("d-none d-md-block"),
    n(".bottom-btn.show").length && n(document).on("click", ".bottom-btn.show .btn", function(e) {
        return n(".sm-hide").parent().toggleClass("d-none"),
        n(this).parent().toggleClass("active"),
        !1
    }),
    n(".accordion-location").length && (n(".accordion-location > div.open > div").slideDown(300),
    n(".accordion-location > div > .accordion-location-head").on("click", function() {
        return n(this).parent().hasClass("open") ? (n(this).parent().removeClass("open"),
        n(this).parent().find("> .accordion-location-content").slideUp(300)) : (n(".accordion-location > div").removeClass("open"),
        n(".accordion-location > div > .accordion-location-content").slideUp(300),
        n(this).parent().addClass("open"),
        n(this).parent().find("> .accordion-location-content").slideDown(300)),
        !1
    })),
    n(".side-component-accordion").length && (n(".side-component-accordion > div.open > div").slideDown(300),
    n(".side-component-accordion > div > a").on("click", function() {
        return n(this).parent().hasClass("open") ? (n(this).parent().removeClass("open"),
        n(this).parent().find("> div").slideUp(300)) : (n(".side-component-accordion > div").removeClass("open"),
        n(".side-component-accordion > div > div").slideUp(300),
        n(this).parent().addClass("open"),
        n(this).parent().find("> div").slideDown(300)),
        !1
    })),
    n(".form-field.select > select, .search-filter-mobile > select, .content-filter-mobile > select").length) {
        n(".form-field.select > select, .search-filter-mobile > select, .content-filter-mobile > select").each(function() {
            var e = n(this).parent();
            n(this).select2({
                minimumResultsForSearch: 1 / 0,
                dropdownPosition: "below",
                dropdownParent: e
            })
        })
    }
    function k() {
        n(".teaser-wrapper").length && 768 <= o && n(".teaser-wrapper > div > .teaser:not(.podcast) > a > .content").matchHeight(),
        n(".teaser-wrapper.insights").length && 768 <= o && n(".teaser-wrapper.insights > div > .teaser").matchHeight(),
        n(".teaser-wrapper-block .teaser.above").length && 768 <= o && n(".teaser-wrapper-block > .teaser.above > a > .content").matchHeight(),
        n(".info-box-wrapper").length && n(".info-box-wrapper > .info-box > div, .info-box-wrapper > .info-box > a").matchHeight(),
        n(".location-link, .content-link").length && n(".location-link > li > a, .content-link > li > a").matchHeight(),
        n(".info-accordion").length && (n(".info-accordion > a").matchHeight(),
        n(".info-accordion > .text-article").matchHeight())
    }
    function x() {
        o = n(window).width(),
        n(window).height(),
        truncate(),
        g(),
        k(),
        C(),
        n(".group-layer").length && (n(".group-layer").removeClass("open"),
        n("body").removeClass("layer"))
    }
    n(".scrollbar-inner").length && n(".scrollbar-inner").scrollbar(),
    n("#videoModal").on("hidden.bs.modal", function(e) {
        n("#videoModal iframe").attr("src", n("#videoModal iframe").attr("src"))
    }),
    n(function() {
        "true" == !!navigator.userAgent.match(/Trident.*rv\:11\./) && n(".modal").removeClass("fade")
    }),
    n(document).on("click", ".teaser-wrapper.people article a, .modal-author", function() {
        var e = n(this).data("url");
        if (e) {
            n("body").addClass("panel-open"),
            n(".profile-panel-wrapper").addClass("open");
            var o = n("body").data("context-path");
            n("#profile-panel-user").html('<div class="text-center w-100 mb-5"><img src=' + o + '/.resources/efg-revamp/webresources/img/Spinner-1s-200px.gif" style="max-width: 200px;"></div>'),
            n.ajax({
                type: "GET",
                url: e,
                cache: !1,
                success: function(e) {
                    n("#profile-panel-user").html(e)
                }
            })
        }
        return !1
    }),
    n(document).on("click", ".profile-panel-wrapper .close", function() {
        return n("body").removeClass("panel-open"),
        n(".profile-panel-wrapper").removeClass("open"),
        !1
    }),
    n(document).on("click", ".profile-panel-wrapper > span", function() {
        return n("body").removeClass("panel-open"),
        n(".profile-panel-wrapper").removeClass("open"),
        !1
    }),
    n(document).on("click", ".form-panel-open", function() {
        n("#form-panel-page").attr("src", ""),
        n("body").addClass("panel-open"),
        n(".form-panel-wrapper").addClass("open");
        n("#form-panel-page").attr("src");
        var e = n(this).attr("href");
        return n("#form-panel-page").attr("src", e),
        iFrameResize({
            log: !1
        }, "#form-panel-page"),
        !1
    }),
    n(document).on("click", ".form-panel-wrapper .close", function() {
        return n("body").removeClass("panel-open"),
        n(".form-panel-wrapper").removeClass("open"),
        !1
    }),
    n(document).on("click", ".form-panel-wrapper > span", function() {
        return n("body").removeClass("panel-open"),
        n(".form-panel-wrapper").removeClass("open"),
        !1
    }),
    k(),
    truncate(),
    n(window).resize(function() {
        clearTimeout(e),
        e = setTimeout(x, 500)
    }),
    location.hash && 0 < n(location.hash).length && n("html, body").animate({
        scrollTop: n(location.hash).offset().top - n("header").outerHeight() - 30
    }, 300)
}(jQuery),
$(function() {
    $(".closeCookie").on("click", function() {
        return cookieAlert = getCookie("cookie-alert"),
        null != cookieAlert && "" != cookieAlert || setCookie("cookie-alert", "true", 365),
        $(".cookie-alert").addClass("d-none"),
        !1
    }),
    checkInfoCookie()
});
(function($) {

    var widthWithScrollBars = $(window).width();
    var windowHeight = $(window).height();

    // History slider

    function historySliderNav() {
        if ($('.history-slider-nav').length) {
            var bottomMargin = $('.history-slider-nav').closest('.section-headline').find('p').outerHeight();
            $('.history-slider-nav').css('margin-bottom', bottomMargin);
        }
    }

    function historySlider() {

        var historySlider = '';
        var historySliderMax = 0;

        if ($('.history-slider').length) {
            historySliderMax = $('.history-slider .swiper .swiper-slide').length - 1;
            console.log(historySliderMax);

            historySlider = new Swiper('.history-slider .swiper',{
                slidesPerView: 1.35,
                loop: false,
                speed: 400,
                navigation: {
                    nextEl: '.history-slider-nav .swiper-button-next.next',
                    prevEl: '.history-slider-nav .swiper-button-prev.prev',
                },
                breakpoints: {
                    576: {
                        slidesPerView: 1.65
                    },
                    768: {
                        slidesPerView: 3.15
                    },
                    992: {
                        slidesPerView: 5
                    }
                }
            });
        }

        $(document).on('click', '.history-slider-nav .swiper-button-next.last', function() {
            if (historySlider.activeIndex < (historySliderMax - 2)) {
                historySlider.slideTo(historySlider.activeIndex + 2);
            } else if (historySlider.activeIndex < (historySliderMax - 1)) {
                historySlider.slideTo(historySlider.activeIndex + 1);
            } else
                historySlider.slideTo(historySliderMax);
            return false;
        });
        $(document).on('click', '.history-slider-nav .swiper-button-prev.first', function() {
            if (historySlider.activeIndex > 1) {
                historySlider.slideTo(historySlider.activeIndex - 2);
            } else if (historySlider.activeIndex > 0) {
                historySlider.slideTo(historySlider.activeIndex - 1);
            } else
                historySlider.slideTo(0);
            return false;
        });
    }

    historySliderNav();
    historySlider();

    // Resize

    function doneResizing() {

        widthWithScrollBars = $(window).width();
        windowHeight = $(window).height();

        historySliderNav();
    }

    var resizeId;

    $(window).resize(function() {
        clearTimeout(resizeId);
        resizeId = setTimeout(doneResizing, 500);
    });

}
)(jQuery);
