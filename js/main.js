(window.webpackJsonp = window.webpackJsonp || []).push([[2], {
    0: function(n, l) {},
    1: function(n, l, e) {
        n.exports = e("zUnb")
    },
    2: function(n, l) {},
    crnd: function(n, l) {
        function e(n) {
            return Promise.resolve().then(function() {
                var l = new Error("Cannot find module '" + n + "'");
                throw l.code = "MODULE_NOT_FOUND",
                l
            })
        }
        e.keys = function() {
            return []
        }
        ,
        e.resolve = e,
        n.exports = e,
        e.id = "crnd"
    },
    zUnb: function(n, l, e) {
        "use strict";
        e.r(l);
        var t = e("CcnG")
          , o = function() {
            function n() {}
            return n.prototype.ngOnInit = function() {}
            ,
            n
        }()
          , i = e("NPBP")
          , a = function() {
            function n(n, l, e) {
                this.router = n,
                this.route = l,
                this.logger = e
            }
            return n.prototype.ngOnInit = function() {
                var n = this;
                this.routeParamSubscription = this.route.params.subscribe(function(l) {
                    n.id = isNaN(l.fileId) ? 0 : +l.fileId;
                    var e = "/api/" + n.id + "/1/overview";
                    n.logger.debug("drupalrouter: navigate to " + e),
                    n.router.navigateByUrl(e)
                })
            }
            ,
            n.prototype.ngOnDestroy = function() {
                this.routeParamSubscription && this.routeParamSubscription.unsubscribe()
            }
            ,
            n
        }()
          , u = e("mrSG")
          , r = function(n) {
            function l() {
                return null !== n && n.apply(this, arguments) || this
            }
            return u.d(l, n),
            l
        }(Window)
          , c = function(n) {
            function l() {
                return null !== n && n.apply(this, arguments) || this
            }
            return u.d(l, n),
            l
        }(Document)
          , d = function() {
            return window
        }
          , s = function() {
            return document
        }
          , b = function() {
            return function(n) {
                var l = n.config.filter(function(n) {
                    return "docs/:apiId/:versionId" === n.path
                });
                n.config.push({
                    path: "**",
                    component: o
                }),
                l[0].path = "api/:apiId/:versionId"
            }
        }()
          , p = function(n) {
            return n[n.MESSAGE = 0] = "MESSAGE",
            n[n.ERROR = 1] = "ERROR",
            n
        }({})
          , h = function() {
            function n() {
                this.onNew = new t.m
            }
            return n.prototype.sendError = function(n, l) {
                void 0 === l && (l = 5e3),
                this.onNew.next({
                    category: p.ERROR,
                    message: n,
                    duration: l
                })
            }
            ,
            n.prototype.sendMessage = function(n, l) {
                void 0 === l && (l = 5e3),
                this.onNew.next({
                    category: p.MESSAGE,
                    message: n,
                    duration: l
                })
            }
            ,
            n
        }()
          , m = function() {
            function n(n, l) {
                this.snackBarRef = n,
                this.data = l,
                this.NotificationTypes = p
            }
            return n.prototype.ngOnInit = function() {
                this.className = this.data.category === p.MESSAGE ? "message" : "error"
            }
            ,
            n
        }()
          , f = e("ZYCi")
          , g = e("VnD/")
          , B = function() {
            function n() {}
            return n.getApiIdFromUrl = function(n) {
                return n.split("/")[2]
            }
            ,
            n
        }()
          , _ = e("6blF")
          , y = function() {
            function n(n) {
                this.logger = n
            }
            return n.prototype.getSpec = function(n) {
                var l = this;
                return _.a.create(function(e) {
                    var t, o = l.logger;
                    return function l(i) {
                        if (o.debug("retry #: " + i),
                        0 === i)
                            return o.debug("giving up after 15"),
                            void e.complete();
                        t = setTimeout(function() {
                            var t = JSON.parse(sessionStorage.getItem("specs") || "{}");
                            o.debug("parsing spec id " + n);
                            var a = t[n];
                            void 0 !== a ? (o.debug("parsing " + n),
                            e.next(a),
                            e.complete()) : (o.debug("spec " + n + " not found in session storage."),
                            l(--i))
                        }, 100)
                    }(15),
                    {
                        unsubscribe: function() {
                            clearTimeout(t)
                        }
                    }
                })
            }
            ,
            n
        }()
          , v = function() {
            function n(n) {
                this.window = n,
                this.currentPath = null,
                this.currentContext = null,
                this.onLoad = null,
                this.onUnload = null
            }
            return n.prototype.checkForEventListeners = function() {
                var n = this.window.portal && this.window.portal.pageEventListeners;
                null != n && (this.onLoad = n.onLoad,
                this.onUnload = n.onUnload)
            }
            ,
            n.prototype.onPageLoad = function() {
                var n = this.window.location.pathname;
                this.currentPath !== n && (null != this.currentPath && null != this.onUnload && (this.onUnload(this.currentPath, this.currentContext),
                this.currentContext = null),
                null != this.onLoad && (this.currentContext = this.onLoad(n)),
                this.currentPath = n)
            }
            ,
            n
        }()
          , C = function() {
            function n(n, l, e, t, o, i) {
                this.site = n,
                this.notifications = l,
                this.pageEvents = e,
                this.snackBar = t,
                this.router = o,
                this.window = i,
                this.title = "SmartDocs"
            }
            return n.prototype.ngOnInit = function() {
                var n = this;
                this.notifications.onNew.subscribe(function(l) {
                    return n.showNotification(l)
                }),
                this.currentUrl = this.router.url,
                this.router.events.pipe(Object(g.a)(function(n) {
                    return n instanceof f.d
                })).subscribe(function(l) {
                    var e = l.urlAfterRedirects;
                    n.site.getSpec(B.getApiIdFromUrl(e)).subscribe(function() {
                        n.window.setTimeout(function() {
                            return n.pageEvents.onPageLoad()
                        }, 100)
                    }),
                    n.currentUrl = e
                })
            }
            ,
            n.prototype.showNotification = function(n) {
                this.snackBar.openFromComponent(m, {
                    panelClass: ["notification-bar-container"],
                    data: n,
                    duration: n.duration
                })
            }
            ,
            n
        }()
          , w = e("t68o")
          , S = e("gIcY")
          , k = e("dJrM")
          , q = e("seP3")
          , z = e("Wf4p")
          , I = e("Fzqc")
          , P = e("dWZg")
          , T = e("wFw1")
          , A = e("b716")
          , F = e("/VYK")
          , O = e("bujt")
          , M = e("UodH")
          , x = e("lLAP")
          , E = e("Ip0R")
          , N = function() {
            function n(n, l, e) {
                this.username = n,
                this.password = l,
                this.securityScheme = e
            }
            return n.prototype.attachToRequest = function(n) {
                var l = btoa(this.username + ":" + this.password);
                n.headers.append("Authorization", "Basic " + l)
            }
            ,
            n
        }()
          , L = function() {
            function n() {
                this.onSave = new t.m
            }
            return n.prototype.ngOnInit = function() {
                this.initializeState()
            }
            ,
            n.prototype.initializeState = function() {
                this.editing = null == this.cachedToken,
                this.username = this.cachedToken && this.cachedToken.username || "",
                this.password = this.cachedToken && this.cachedToken.password || ""
            }
            ,
            n.prototype.save = function() {
                this.cachedToken = new N(this.username,this.password,this.securityScheme),
                this.onSave.emit(this.cachedToken),
                this.editing = !1
            }
            ,
            n.prototype.edit = function() {
                this.editing = !0
            }
            ,
            n.prototype.clear = function() {
                this.cachedToken = null,
                this.onSave.emit(null),
                this.initializeState()
            }
            ,
            n
        }()
          , H = t.pb({
            encapsulation: 0,
            styles: [[".auth-section[_ngcontent-%COMP%]   .auth-creds-edit[_ngcontent-%COMP%]{margin-right:10px}.auth-section[_ngcontent-%COMP%]   .auth-button[_ngcontent-%COMP%]{text-transform:uppercase}"]],
            data: {}
        });
        function U(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 45, "form", [["class", "auth-edit-form"], ["novalidate", ""]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngSubmit"], [null, "submit"], [null, "reset"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "submit" === l && (o = !1 !== t.Bb(n, 2).onSubmit(e) && o),
                "reset" === l && (o = !1 !== t.Bb(n, 2).onReset() && o),
                "ngSubmit" === l && (o = !1 !== i.save() && o),
                o
            }, null, null)), t.qb(1, 16384, null, 0, S.y, [], null, null), t.qb(2, 4210688, [["basicAuthForm", 4]], 0, S.q, [[8, null], [8, null]], null, {
                ngSubmit: "ngSubmit"
            }), t.Gb(2048, null, S.c, null, [S.q]), t.qb(4, 16384, null, 0, S.p, [[4, S.c]], null, null), (n()(),
            t.rb(5, 0, null, null, 18, "mat-form-field", [["class", "mat-form-field"]], [[2, "mat-form-field-appearance-standard", null], [2, "mat-form-field-appearance-fill", null], [2, "mat-form-field-appearance-outline", null], [2, "mat-form-field-appearance-legacy", null], [2, "mat-form-field-invalid", null], [2, "mat-form-field-can-float", null], [2, "mat-form-field-should-float", null], [2, "mat-form-field-hide-placeholder", null], [2, "mat-form-field-disabled", null], [2, "mat-form-field-autofilled", null], [2, "mat-focused", null], [2, "mat-accent", null], [2, "mat-warn", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null], [2, "_mat-animation-noopable", null]], null, null, k.b, k.a)), t.qb(6, 7389184, null, 7, q.b, [t.k, t.h, [2, z.h], [2, I.b], [2, q.a], P.a, t.A, [2, T.a]], null, null), t.Hb(335544320, 1, {
                _control: 0
            }), t.Hb(335544320, 2, {
                _placeholderChild: 0
            }), t.Hb(335544320, 3, {
                _labelChild: 0
            }), t.Hb(603979776, 4, {
                _errorChildren: 1
            }), t.Hb(603979776, 5, {
                _hintChildren: 1
            }), t.Hb(603979776, 6, {
                _prefixChildren: 1
            }), t.Hb(603979776, 7, {
                _suffixChildren: 1
            }), (n()(),
            t.rb(14, 0, null, 1, 9, "input", [["autocomplete", "username"], ["class", "basic-auth-username-input mat-input-element mat-form-field-autofill-control"], ["id", "username"], ["matInput", ""], ["name", "username"], ["placeholder", "Username"], ["required", ""]], [[1, "required", 0], [2, "mat-input-server", null], [1, "id", 0], [1, "placeholder", 0], [8, "disabled", 0], [8, "required", 0], [1, "readonly", 0], [1, "aria-describedby", 0], [1, "aria-invalid", 0], [1, "aria-required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"], [null, "focus"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "input" === l && (o = !1 !== t.Bb(n, 17)._handleInput(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 17).onTouched() && o),
                "compositionstart" === l && (o = !1 !== t.Bb(n, 17)._compositionStart() && o),
                "compositionend" === l && (o = !1 !== t.Bb(n, 17)._compositionEnd(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 21)._focusChanged(!1) && o),
                "focus" === l && (o = !1 !== t.Bb(n, 21)._focusChanged(!0) && o),
                "input" === l && (o = !1 !== t.Bb(n, 21)._onInput() && o),
                "ngModelChange" === l && (o = !1 !== (i.username = e) && o),
                o
            }, null, null)), t.qb(15, 16384, null, 0, S.u, [], {
                required: [0, "required"]
            }, null), t.Gb(1024, null, S.l, function(n) {
                return [n]
            }, [S.u]), t.qb(17, 16384, null, 0, S.d, [t.F, t.k, [2, S.a]], null, null), t.Gb(1024, null, S.m, function(n) {
                return [n]
            }, [S.d]), t.qb(19, 671744, null, 0, S.r, [[2, S.c], [6, S.l], [8, null], [6, S.m]], {
                name: [0, "name"],
                model: [1, "model"]
            }, {
                update: "ngModelChange"
            }), t.Gb(2048, null, S.n, null, [S.r]), t.qb(21, 999424, null, 0, A.a, [t.k, P.a, [6, S.n], [2, S.q], [2, S.j], z.b, [8, null], F.a, t.A], {
                id: [0, "id"],
                placeholder: [1, "placeholder"],
                required: [2, "required"]
            }, null), t.qb(22, 16384, null, 0, S.o, [[4, S.n]], null, null), t.Gb(2048, [[1, 4]], q.c, null, [A.a]), (n()(),
            t.rb(24, 0, null, null, 18, "mat-form-field", [["class", "mat-form-field"]], [[2, "mat-form-field-appearance-standard", null], [2, "mat-form-field-appearance-fill", null], [2, "mat-form-field-appearance-outline", null], [2, "mat-form-field-appearance-legacy", null], [2, "mat-form-field-invalid", null], [2, "mat-form-field-can-float", null], [2, "mat-form-field-should-float", null], [2, "mat-form-field-hide-placeholder", null], [2, "mat-form-field-disabled", null], [2, "mat-form-field-autofilled", null], [2, "mat-focused", null], [2, "mat-accent", null], [2, "mat-warn", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null], [2, "_mat-animation-noopable", null]], null, null, k.b, k.a)), t.qb(25, 7389184, null, 7, q.b, [t.k, t.h, [2, z.h], [2, I.b], [2, q.a], P.a, t.A, [2, T.a]], null, null), t.Hb(335544320, 8, {
                _control: 0
            }), t.Hb(335544320, 9, {
                _placeholderChild: 0
            }), t.Hb(335544320, 10, {
                _labelChild: 0
            }), t.Hb(603979776, 11, {
                _errorChildren: 1
            }), t.Hb(603979776, 12, {
                _hintChildren: 1
            }), t.Hb(603979776, 13, {
                _prefixChildren: 1
            }), t.Hb(603979776, 14, {
                _suffixChildren: 1
            }), (n()(),
            t.rb(33, 0, null, 1, 9, "input", [["autocomplete", "current-password"], ["class", "basic-auth-password-input mat-input-element mat-form-field-autofill-control"], ["id", "password"], ["matInput", ""], ["name", "password"], ["placeholder", "Password"], ["required", ""], ["type", "password"]], [[1, "required", 0], [2, "mat-input-server", null], [1, "id", 0], [1, "placeholder", 0], [8, "disabled", 0], [8, "required", 0], [1, "readonly", 0], [1, "aria-describedby", 0], [1, "aria-invalid", 0], [1, "aria-required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"], [null, "focus"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "input" === l && (o = !1 !== t.Bb(n, 36)._handleInput(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 36).onTouched() && o),
                "compositionstart" === l && (o = !1 !== t.Bb(n, 36)._compositionStart() && o),
                "compositionend" === l && (o = !1 !== t.Bb(n, 36)._compositionEnd(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 40)._focusChanged(!1) && o),
                "focus" === l && (o = !1 !== t.Bb(n, 40)._focusChanged(!0) && o),
                "input" === l && (o = !1 !== t.Bb(n, 40)._onInput() && o),
                "ngModelChange" === l && (o = !1 !== (i.password = e) && o),
                o
            }, null, null)), t.qb(34, 16384, null, 0, S.u, [], {
                required: [0, "required"]
            }, null), t.Gb(1024, null, S.l, function(n) {
                return [n]
            }, [S.u]), t.qb(36, 16384, null, 0, S.d, [t.F, t.k, [2, S.a]], null, null), t.Gb(1024, null, S.m, function(n) {
                return [n]
            }, [S.d]), t.qb(38, 671744, null, 0, S.r, [[2, S.c], [6, S.l], [8, null], [6, S.m]], {
                name: [0, "name"],
                model: [1, "model"]
            }, {
                update: "ngModelChange"
            }), t.Gb(2048, null, S.n, null, [S.r]), t.qb(40, 999424, null, 0, A.a, [t.k, P.a, [6, S.n], [2, S.q], [2, S.j], z.b, [8, null], F.a, t.A], {
                id: [0, "id"],
                placeholder: [1, "placeholder"],
                required: [2, "required"],
                type: [3, "type"]
            }, null), t.qb(41, 16384, null, 0, S.o, [[4, S.n]], null, null), t.Gb(2048, [[8, 4]], q.c, null, [A.a]), (n()(),
            t.rb(43, 0, null, null, 2, "button", [["class", "auth-button auth-submit"], ["color", "primary"], ["mat-raised-button", ""], ["type", "submit"]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], null, null, O.d, O.b)), t.qb(44, 180224, null, 0, M.b, [t.k, P.a, x.f, [2, T.a]], {
                disabled: [0, "disabled"],
                color: [1, "color"]
            }, null), (n()(),
            t.Jb(-1, 0, [" Authorize "]))], function(n, l) {
                var e = l.component;
                n(l, 15, 0, ""),
                n(l, 19, 0, "username", e.username),
                n(l, 21, 0, "username", "Username", ""),
                n(l, 34, 0, ""),
                n(l, 38, 0, "password", e.password),
                n(l, 40, 0, "password", "Password", "", "password"),
                n(l, 44, 0, !t.Bb(l, 2).form.valid, "primary")
            }, function(n, l) {
                n(l, 0, 0, t.Bb(l, 4).ngClassUntouched, t.Bb(l, 4).ngClassTouched, t.Bb(l, 4).ngClassPristine, t.Bb(l, 4).ngClassDirty, t.Bb(l, 4).ngClassValid, t.Bb(l, 4).ngClassInvalid, t.Bb(l, 4).ngClassPending),
                n(l, 5, 1, ["standard" == t.Bb(l, 6).appearance, "fill" == t.Bb(l, 6).appearance, "outline" == t.Bb(l, 6).appearance, "legacy" == t.Bb(l, 6).appearance, t.Bb(l, 6)._control.errorState, t.Bb(l, 6)._canLabelFloat, t.Bb(l, 6)._shouldLabelFloat(), t.Bb(l, 6)._hideControlPlaceholder(), t.Bb(l, 6)._control.disabled, t.Bb(l, 6)._control.autofilled, t.Bb(l, 6)._control.focused, "accent" == t.Bb(l, 6).color, "warn" == t.Bb(l, 6).color, t.Bb(l, 6)._shouldForward("untouched"), t.Bb(l, 6)._shouldForward("touched"), t.Bb(l, 6)._shouldForward("pristine"), t.Bb(l, 6)._shouldForward("dirty"), t.Bb(l, 6)._shouldForward("valid"), t.Bb(l, 6)._shouldForward("invalid"), t.Bb(l, 6)._shouldForward("pending"), !t.Bb(l, 6)._animationsEnabled]),
                n(l, 14, 1, [t.Bb(l, 15).required ? "" : null, t.Bb(l, 21)._isServer, t.Bb(l, 21).id, t.Bb(l, 21).placeholder, t.Bb(l, 21).disabled, t.Bb(l, 21).required, t.Bb(l, 21).readonly && !t.Bb(l, 21)._isNativeSelect || null, t.Bb(l, 21)._ariaDescribedby || null, t.Bb(l, 21).errorState, t.Bb(l, 21).required.toString(), t.Bb(l, 22).ngClassUntouched, t.Bb(l, 22).ngClassTouched, t.Bb(l, 22).ngClassPristine, t.Bb(l, 22).ngClassDirty, t.Bb(l, 22).ngClassValid, t.Bb(l, 22).ngClassInvalid, t.Bb(l, 22).ngClassPending]),
                n(l, 24, 1, ["standard" == t.Bb(l, 25).appearance, "fill" == t.Bb(l, 25).appearance, "outline" == t.Bb(l, 25).appearance, "legacy" == t.Bb(l, 25).appearance, t.Bb(l, 25)._control.errorState, t.Bb(l, 25)._canLabelFloat, t.Bb(l, 25)._shouldLabelFloat(), t.Bb(l, 25)._hideControlPlaceholder(), t.Bb(l, 25)._control.disabled, t.Bb(l, 25)._control.autofilled, t.Bb(l, 25)._control.focused, "accent" == t.Bb(l, 25).color, "warn" == t.Bb(l, 25).color, t.Bb(l, 25)._shouldForward("untouched"), t.Bb(l, 25)._shouldForward("touched"), t.Bb(l, 25)._shouldForward("pristine"), t.Bb(l, 25)._shouldForward("dirty"), t.Bb(l, 25)._shouldForward("valid"), t.Bb(l, 25)._shouldForward("invalid"), t.Bb(l, 25)._shouldForward("pending"), !t.Bb(l, 25)._animationsEnabled]),
                n(l, 33, 1, [t.Bb(l, 34).required ? "" : null, t.Bb(l, 40)._isServer, t.Bb(l, 40).id, t.Bb(l, 40).placeholder, t.Bb(l, 40).disabled, t.Bb(l, 40).required, t.Bb(l, 40).readonly && !t.Bb(l, 40)._isNativeSelect || null, t.Bb(l, 40)._ariaDescribedby || null, t.Bb(l, 40).errorState, t.Bb(l, 40).required.toString(), t.Bb(l, 41).ngClassUntouched, t.Bb(l, 41).ngClassTouched, t.Bb(l, 41).ngClassPristine, t.Bb(l, 41).ngClassDirty, t.Bb(l, 41).ngClassValid, t.Bb(l, 41).ngClassInvalid, t.Bb(l, 41).ngClassPending]),
                n(l, 43, 0, t.Bb(l, 44).disabled || null, "NoopAnimations" === t.Bb(l, 44)._animationMode)
            })
        }
        function R(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 11, null, null, null, null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 4, "p", [["class", "auth-creds-message"]], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, [" Credentials entered for username "])), (n()(),
            t.rb(3, 0, null, null, 1, "span", [["class", "auth-creds-message-username"]], null, null, null, null, null)), (n()(),
            t.Jb(4, null, [" ", " "])), (n()(),
            t.Jb(-1, null, [". "])), (n()(),
            t.rb(6, 0, null, null, 2, "button", [["class", "auth-button auth-creds-edit"], ["color", "primary"], ["mat-raised-button", ""]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], [[null, "click"]], function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.edit() && t),
                t
            }, O.d, O.b)), t.qb(7, 180224, null, 0, M.b, [t.k, P.a, x.f, [2, T.a]], {
                color: [0, "color"]
            }, null), (n()(),
            t.Jb(-1, 0, [" Edit "])), (n()(),
            t.rb(9, 0, null, null, 2, "button", [["class", "auth-button auth-creds-clear"], ["color", "primary"], ["mat-raised-button", ""]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], [[null, "click"]], function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.clear() && t),
                t
            }, O.d, O.b)), t.qb(10, 180224, null, 0, M.b, [t.k, P.a, x.f, [2, T.a]], {
                color: [0, "color"]
            }, null), (n()(),
            t.Jb(-1, 0, [" Clear "]))], function(n, l) {
                n(l, 7, 0, "primary"),
                n(l, 10, 0, "primary")
            }, function(n, l) {
                n(l, 4, 0, l.component.cachedToken.username),
                n(l, 6, 0, t.Bb(l, 7).disabled || null, "NoopAnimations" === t.Bb(l, 7)._animationMode),
                n(l, 9, 0, t.Bb(l, 10).disabled || null, "NoopAnimations" === t.Bb(l, 10)._animationMode)
            })
        }
        function D(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 6, "div", [["class", "auth-section basic-auth"]], [[8, "id", 0]], null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 1, "p", [["class", "auth-name"]], null, null, null, null, null)), (n()(),
            t.Jb(2, null, [" Basic Auth: ", " "])), (n()(),
            t.ib(16777216, null, null, 1, null, U)), t.qb(4, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, R)), t.qb(6, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null)], function(n, l) {
                var e = l.component;
                n(l, 4, 0, e.editing),
                n(l, 6, 0, !e.editing)
            }, function(n, l) {
                var e = l.component;
                n(l, 0, 0, t.tb(1, "basic-auth-", e.name, "")),
                n(l, 2, 0, e.name)
            })
        }
        var J = function() {
            function n(n, l) {
                this.apiKey = n,
                this.securityScheme = l
            }
            return n.prototype.attachToRequest = function(n) {
                "header" === this.securityScheme.in ? n.headers.append(this.securityScheme.name, this.apiKey) : "query" === this.securityScheme.in ? n.params.append(this.securityScheme.name, this.apiKey) : "cookie" === this.securityScheme.in && console.warn("API key in cookie not supported.")
            }
            ,
            n
        }()
          , G = function() {
            function n() {
                this.onSave = new t.m
            }
            return n.prototype.ngOnInit = function() {
                this.initializeState()
            }
            ,
            n.prototype.initializeState = function() {
                this.editing = null == this.cachedToken,
                this.apiKey = this.cachedToken && this.cachedToken.apiKey || ""
            }
            ,
            n.prototype.edit = function() {
                this.editing = !0
            }
            ,
            n.prototype.clear = function() {
                this.cachedToken = null,
                this.onSave.emit(null),
                this.initializeState()
            }
            ,
            n.prototype.save = function() {
                this.cachedToken = new J(this.apiKey,this.securityScheme),
                this.onSave.emit(this.cachedToken),
                this.editing = !1
            }
            ,
            n
        }()
          , j = t.pb({
            encapsulation: 2,
            styles: [],
            data: {}
        });
        function K(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "div", [["class", "auth-section api-key-auth not-supported"]], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, ["\n  API Keys in cookie are not supported!\n"]))], null, null)
        }
        function Q(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 12, null, null, null, null, null, null, null)), (n()(),
            t.Jb(-1, null, ["\n    "])), (n()(),
            t.rb(2, 0, null, null, 1, "p", [["class", "auth-creds-message"]], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, ["\n      API Key credentials entered.\n    "])), (n()(),
            t.Jb(-1, null, ["\n    "])), (n()(),
            t.rb(5, 0, null, null, 2, "button", [["class", "auth-creds-edit"], ["color", "primary"], ["mat-raised-button", ""]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], [[null, "click"]], function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.edit() && t),
                t
            }, O.d, O.b)), t.qb(6, 180224, null, 0, M.b, [t.k, P.a, x.f, [2, T.a]], {
                color: [0, "color"]
            }, null), (n()(),
            t.Jb(-1, 0, ["\n      EDIT\n    "])), (n()(),
            t.Jb(-1, null, ["\n    "])), (n()(),
            t.rb(9, 0, null, null, 2, "button", [["class", "auth-creds-clear"], ["color", "primary"], ["mat-raised-button", ""]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], [[null, "click"]], function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.clear() && t),
                t
            }, O.d, O.b)), t.qb(10, 180224, null, 0, M.b, [t.k, P.a, x.f, [2, T.a]], {
                color: [0, "color"]
            }, null), (n()(),
            t.Jb(-1, 0, ["\n      CLEAR\n    "])), (n()(),
            t.Jb(-1, null, ["\n  "]))], function(n, l) {
                n(l, 6, 0, "primary"),
                n(l, 10, 0, "primary")
            }, function(n, l) {
                n(l, 5, 0, t.Bb(l, 6).disabled || null, "NoopAnimations" === t.Bb(l, 6)._animationMode),
                n(l, 9, 0, t.Bb(l, 10).disabled || null, "NoopAnimations" === t.Bb(l, 10)._animationMode)
            })
        }
        function V(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 44, "form", [["class", "auth-edit-form"], ["novalidate", ""]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngSubmit"], [null, "submit"], [null, "reset"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "submit" === l && (o = !1 !== t.Bb(n, 2).onSubmit(e) && o),
                "reset" === l && (o = !1 !== t.Bb(n, 2).onReset() && o),
                "ngSubmit" === l && (o = !1 !== i.save() && o),
                o
            }, null, null)), t.qb(1, 16384, null, 0, S.y, [], null, null), t.qb(2, 4210688, [["apiKeyForm", 4]], 0, S.q, [[8, null], [8, null]], null, {
                ngSubmit: "ngSubmit"
            }), t.Gb(2048, null, S.c, null, [S.q]), t.qb(4, 16384, null, 0, S.p, [[4, S.c]], null, null), (n()(),
            t.Jb(-1, null, ["\n\n    "])), (n()(),
            t.rb(6, 0, null, null, 13, "mat-form-field", [["class", "api-key-scheme-name-field mat-form-field"]], [[2, "mat-form-field-appearance-standard", null], [2, "mat-form-field-appearance-fill", null], [2, "mat-form-field-appearance-outline", null], [2, "mat-form-field-appearance-legacy", null], [2, "mat-form-field-invalid", null], [2, "mat-form-field-can-float", null], [2, "mat-form-field-should-float", null], [2, "mat-form-field-hide-placeholder", null], [2, "mat-form-field-disabled", null], [2, "mat-form-field-autofilled", null], [2, "mat-focused", null], [2, "mat-accent", null], [2, "mat-warn", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null], [2, "_mat-animation-noopable", null]], null, null, k.b, k.a)), t.qb(7, 7389184, null, 7, q.b, [t.k, t.h, [2, z.h], [2, I.b], [2, q.a], P.a, t.A, [2, T.a]], null, null), t.Hb(335544320, 1, {
                _control: 0
            }), t.Hb(335544320, 2, {
                _placeholderChild: 0
            }), t.Hb(335544320, 3, {
                _labelChild: 0
            }), t.Hb(603979776, 4, {
                _errorChildren: 1
            }), t.Hb(603979776, 5, {
                _hintChildren: 1
            }), t.Hb(603979776, 6, {
                _prefixChildren: 1
            }), t.Hb(603979776, 7, {
                _suffixChildren: 1
            }), (n()(),
            t.Jb(-1, 1, ["\n      "])), (n()(),
            t.rb(16, 0, null, 1, 2, "input", [["class", "api-key-scheme-name-input mat-input-element mat-form-field-autofill-control"], ["matInput", ""]], [[2, "mat-input-server", null], [1, "id", 0], [1, "placeholder", 0], [8, "disabled", 0], [8, "required", 0], [1, "readonly", 0], [1, "aria-describedby", 0], [1, "aria-invalid", 0], [1, "aria-required", 0]], [[null, "blur"], [null, "focus"], [null, "input"]], function(n, l, e) {
                var o = !0;
                return "blur" === l && (o = !1 !== t.Bb(n, 17)._focusChanged(!1) && o),
                "focus" === l && (o = !1 !== t.Bb(n, 17)._focusChanged(!0) && o),
                "input" === l && (o = !1 !== t.Bb(n, 17)._onInput() && o),
                o
            }, null, null)), t.qb(17, 999424, null, 0, A.a, [t.k, P.a, [8, null], [2, S.q], [2, S.j], z.b, [8, null], F.a, t.A], {
                disabled: [0, "disabled"],
                placeholder: [1, "placeholder"],
                value: [2, "value"]
            }, null), t.Gb(2048, [[1, 4]], q.c, null, [A.a]), (n()(),
            t.Jb(-1, 1, ["\n    "])), (n()(),
            t.Jb(-1, null, ["\n\n    "])), (n()(),
            t.rb(21, 0, null, null, 18, "mat-form-field", [["class", "api-key-auth-key-field mat-form-field"]], [[2, "mat-form-field-appearance-standard", null], [2, "mat-form-field-appearance-fill", null], [2, "mat-form-field-appearance-outline", null], [2, "mat-form-field-appearance-legacy", null], [2, "mat-form-field-invalid", null], [2, "mat-form-field-can-float", null], [2, "mat-form-field-should-float", null], [2, "mat-form-field-hide-placeholder", null], [2, "mat-form-field-disabled", null], [2, "mat-form-field-autofilled", null], [2, "mat-focused", null], [2, "mat-accent", null], [2, "mat-warn", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null], [2, "_mat-animation-noopable", null]], null, null, k.b, k.a)), t.qb(22, 7389184, null, 7, q.b, [t.k, t.h, [2, z.h], [2, I.b], [2, q.a], P.a, t.A, [2, T.a]], null, null), t.Hb(335544320, 8, {
                _control: 0
            }), t.Hb(335544320, 9, {
                _placeholderChild: 0
            }), t.Hb(335544320, 10, {
                _labelChild: 0
            }), t.Hb(603979776, 11, {
                _errorChildren: 1
            }), t.Hb(603979776, 12, {
                _hintChildren: 1
            }), t.Hb(603979776, 13, {
                _prefixChildren: 1
            }), t.Hb(603979776, 14, {
                _suffixChildren: 1
            }), (n()(),
            t.Jb(-1, 1, ["\n      "])), (n()(),
            t.rb(31, 0, null, 1, 7, "input", [["class", "api-key-auth-key-input mat-input-element mat-form-field-autofill-control"], ["matInput", ""], ["name", "apiKey"], ["placeholder", "Key"]], [[2, "mat-input-server", null], [1, "id", 0], [1, "placeholder", 0], [8, "disabled", 0], [8, "required", 0], [1, "readonly", 0], [1, "aria-describedby", 0], [1, "aria-invalid", 0], [1, "aria-required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"], [null, "focus"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "input" === l && (o = !1 !== t.Bb(n, 32)._handleInput(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 32).onTouched() && o),
                "compositionstart" === l && (o = !1 !== t.Bb(n, 32)._compositionStart() && o),
                "compositionend" === l && (o = !1 !== t.Bb(n, 32)._compositionEnd(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 36)._focusChanged(!1) && o),
                "focus" === l && (o = !1 !== t.Bb(n, 36)._focusChanged(!0) && o),
                "input" === l && (o = !1 !== t.Bb(n, 36)._onInput() && o),
                "ngModelChange" === l && (o = !1 !== (i.apiKey = e) && o),
                o
            }, null, null)), t.qb(32, 16384, null, 0, S.d, [t.F, t.k, [2, S.a]], null, null), t.Gb(1024, null, S.m, function(n) {
                return [n]
            }, [S.d]), t.qb(34, 671744, null, 0, S.r, [[2, S.c], [8, null], [8, null], [6, S.m]], {
                name: [0, "name"],
                model: [1, "model"]
            }, {
                update: "ngModelChange"
            }), t.Gb(2048, null, S.n, null, [S.r]), t.qb(36, 999424, null, 0, A.a, [t.k, P.a, [6, S.n], [2, S.q], [2, S.j], z.b, [8, null], F.a, t.A], {
                placeholder: [0, "placeholder"]
            }, null), t.qb(37, 16384, null, 0, S.o, [[4, S.n]], null, null), t.Gb(2048, [[8, 4]], q.c, null, [A.a]), (n()(),
            t.Jb(-1, 1, ["\n    "])), (n()(),
            t.Jb(-1, null, ["\n\n    "])), (n()(),
            t.rb(41, 0, null, null, 2, "button", [["class", "auth-submit"], ["color", "primary"], ["mat-raised-button", ""], ["type", "submit"]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], null, null, O.d, O.b)), t.qb(42, 180224, null, 0, M.b, [t.k, P.a, x.f, [2, T.a]], {
                disabled: [0, "disabled"],
                color: [1, "color"]
            }, null), (n()(),
            t.Jb(-1, 0, ["\n      AUTHORIZE\n    "])), (n()(),
            t.Jb(-1, null, ["\n\n  "]))], function(n, l) {
                var e = l.component;
                n(l, 17, 0, !0, e.securityScheme.in, e.securityScheme.name),
                n(l, 34, 0, "apiKey", e.apiKey),
                n(l, 36, 0, "Key"),
                n(l, 42, 0, 0 == e.apiKey.length, "primary")
            }, function(n, l) {
                n(l, 0, 0, t.Bb(l, 4).ngClassUntouched, t.Bb(l, 4).ngClassTouched, t.Bb(l, 4).ngClassPristine, t.Bb(l, 4).ngClassDirty, t.Bb(l, 4).ngClassValid, t.Bb(l, 4).ngClassInvalid, t.Bb(l, 4).ngClassPending),
                n(l, 6, 1, ["standard" == t.Bb(l, 7).appearance, "fill" == t.Bb(l, 7).appearance, "outline" == t.Bb(l, 7).appearance, "legacy" == t.Bb(l, 7).appearance, t.Bb(l, 7)._control.errorState, t.Bb(l, 7)._canLabelFloat, t.Bb(l, 7)._shouldLabelFloat(), t.Bb(l, 7)._hideControlPlaceholder(), t.Bb(l, 7)._control.disabled, t.Bb(l, 7)._control.autofilled, t.Bb(l, 7)._control.focused, "accent" == t.Bb(l, 7).color, "warn" == t.Bb(l, 7).color, t.Bb(l, 7)._shouldForward("untouched"), t.Bb(l, 7)._shouldForward("touched"), t.Bb(l, 7)._shouldForward("pristine"), t.Bb(l, 7)._shouldForward("dirty"), t.Bb(l, 7)._shouldForward("valid"), t.Bb(l, 7)._shouldForward("invalid"), t.Bb(l, 7)._shouldForward("pending"), !t.Bb(l, 7)._animationsEnabled]),
                n(l, 16, 0, t.Bb(l, 17)._isServer, t.Bb(l, 17).id, t.Bb(l, 17).placeholder, t.Bb(l, 17).disabled, t.Bb(l, 17).required, t.Bb(l, 17).readonly && !t.Bb(l, 17)._isNativeSelect || null, t.Bb(l, 17)._ariaDescribedby || null, t.Bb(l, 17).errorState, t.Bb(l, 17).required.toString()),
                n(l, 21, 1, ["standard" == t.Bb(l, 22).appearance, "fill" == t.Bb(l, 22).appearance, "outline" == t.Bb(l, 22).appearance, "legacy" == t.Bb(l, 22).appearance, t.Bb(l, 22)._control.errorState, t.Bb(l, 22)._canLabelFloat, t.Bb(l, 22)._shouldLabelFloat(), t.Bb(l, 22)._hideControlPlaceholder(), t.Bb(l, 22)._control.disabled, t.Bb(l, 22)._control.autofilled, t.Bb(l, 22)._control.focused, "accent" == t.Bb(l, 22).color, "warn" == t.Bb(l, 22).color, t.Bb(l, 22)._shouldForward("untouched"), t.Bb(l, 22)._shouldForward("touched"), t.Bb(l, 22)._shouldForward("pristine"), t.Bb(l, 22)._shouldForward("dirty"), t.Bb(l, 22)._shouldForward("valid"), t.Bb(l, 22)._shouldForward("invalid"), t.Bb(l, 22)._shouldForward("pending"), !t.Bb(l, 22)._animationsEnabled]),
                n(l, 31, 1, [t.Bb(l, 36)._isServer, t.Bb(l, 36).id, t.Bb(l, 36).placeholder, t.Bb(l, 36).disabled, t.Bb(l, 36).required, t.Bb(l, 36).readonly && !t.Bb(l, 36)._isNativeSelect || null, t.Bb(l, 36)._ariaDescribedby || null, t.Bb(l, 36).errorState, t.Bb(l, 36).required.toString(), t.Bb(l, 37).ngClassUntouched, t.Bb(l, 37).ngClassTouched, t.Bb(l, 37).ngClassPristine, t.Bb(l, 37).ngClassDirty, t.Bb(l, 37).ngClassValid, t.Bb(l, 37).ngClassInvalid, t.Bb(l, 37).ngClassPending]),
                n(l, 41, 0, t.Bb(l, 42).disabled || null, "NoopAnimations" === t.Bb(l, 42)._animationMode)
            })
        }
        function W(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 10, "div", [["class", "auth-section api-key-auth"]], [[8, "id", 0]], null, null, null, null)), (n()(),
            t.Jb(-1, null, ["\n  "])), (n()(),
            t.rb(2, 0, null, null, 1, "p", [["class", "auth-name"]], null, null, null, null, null)), (n()(),
            t.Jb(3, null, ["\n    Api Key Auth: ", "\n  "])), (n()(),
            t.Jb(-1, null, ["\n\n  "])), (n()(),
            t.ib(16777216, null, null, 1, null, Q)), t.qb(6, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.Jb(-1, null, ["\n\n  "])), (n()(),
            t.ib(16777216, null, null, 1, null, V)), t.qb(9, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.Jb(-1, null, ["\n\n"]))], function(n, l) {
                var e = l.component;
                n(l, 6, 0, !1 === e.editing),
                n(l, 9, 0, e.editing)
            }, function(n, l) {
                var e = l.component;
                n(l, 0, 0, t.tb(1, "api-key-auth-", e.name, "")),
                n(l, 3, 0, e.name)
            })
        }
        function X(n) {
            return t.Lb(0, [(n()(),
            t.ib(16777216, null, null, 1, null, K)), t.qb(1, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.Jb(-1, null, ["\n\n"])), (n()(),
            t.ib(16777216, null, null, 1, null, W)), t.qb(4, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.Jb(-1, null, ["\n"]))], function(n, l) {
                var e = l.component;
                n(l, 1, 0, "cookie" === e.securityScheme.in),
                n(l, 4, 0, "cookie" !== e.securityScheme.in)
            }, null)
        }
        var Y, $ = e("MlvX"), Z = e("NvT6"), nn = e("Blfk"), ln = e("Azqq"), en = e("uGex"), tn = e("qAlS"), on = e("sE5F"), an = function() {
            function n(n, l) {
                this.flow = n,
                this.schemeName = l,
                this.securityScheme = null,
                this.expired = !0
            }
            return n.prototype.attachToRequest = function(n) {
                console.warn("Token expired for " + this.schemeName + ", skipping")
            }
            ,
            n.prototype.clear = function() {}
            ,
            n
        }(), un = e("t/Na"), rn = function() {
            function n(n, l, e, t, o, i, a, u, r, c, d, s) {
                if (this.token = n,
                this.securityScheme = l,
                this.flow = e,
                this.apiId = t,
                this.schemeName = o,
                this.authTokenCacheService = i,
                this.notificationService = a,
                this.window = u,
                this.http = r,
                this.clientId = c,
                this.clientSecret = d,
                this.logger = s,
                this.expired = !1,
                this.token && this.token.token_type && "BearerToken" === this.token.token_type && this.logger.warn('The Apigee OAuthV2 policy returns "token_type":"BearerToken", where the RFC-compliant response is "token_type":"Bearer". You most likely will not be able to authenticate against this endpoint using other OAuth tools. For details on this non-compliant response and how to fixit, see https://docs.apigee.com/api-platform/reference/policies/oauthv2-policy#non-rfc-compliant-behavior'),
                this.token && this.token.refresh_token) {
                    var b = this.securityScheme.flows[this.flow];
                    this.refreshUrl = b.refreshUrl || b.tokenUrl,
                    this.setRefreshTimeout()
                } else
                    this.setExpireTimeout()
            }
            return n.prototype.attachToRequest = function(n) {
                n.headers.append("Authorization", this.token.token_type + " " + this.token.access_token)
            }
            ,
            n.prototype.setExpireTimeout = function() {
                var n = this
                  , l = 1e3 * this.token.expires_in;
                l < 2147483648 && (this.timeout = this.window.setTimeout(function() {
                    return n.expire()
                }, l))
            }
            ,
            n.prototype.expire = function() {
                this.timeout = null,
                this.notificationService.sendMessage("OAuth token expired for " + this.apiId);
                var n = new an(this.flow,this.schemeName);
                this.authTokenCacheService.putToken(this.apiId, this.schemeName, n)
            }
            ,
            n.prototype.setRefreshTimeout = function() {
                var n = this
                  , l = Math.floor(1e3 * this.token.expires_in * .75);
                this.timeout = this.window.setTimeout(function() {
                    return n.refresh()
                }, l)
            }
            ,
            n.prototype.refresh = function() {
                var n = this
                  , l = new on.j;
                l.set("grant_type", "refresh_token"),
                l.set("refresh_token", this.token.refresh_token);
                var e = btoa(this.clientId + ":" + this.clientSecret)
                  , t = (new un.g).set("Authorization", "Basic " + e).set("Content-Type", "application/x-www-form-urlencoded");
                this.http.post(this.refreshUrl, l.toString(), {
                    headers: t
                }, !1).subscribe(function(l) {
                    n.token = l,
                    n.setRefreshTimeout()
                }, function() {
                    n.expire()
                })
            }
            ,
            n.prototype.clear = function() {
                this.window.clearTimeout(this.timeout),
                this.timeout = null
            }
            ,
            n
        }(), cn = e("88/t"), dn = (e("BuZO"),
        e("PG31"),
        e("6UzD"),
        function() {
            function n(n) {
                this.http = n
            }
            return n.prototype.get = function(l, e) {
                return void 0 === e && (e = {}),
                n.addXRequestedWithHeader(e),
                this.http.get(l, u.a({}, e, {
                    responseType: "json"
                })).map(function(l) {
                    return n.extractData(l)
                }).catch(function(l) {
                    return n.handleError(l)
                })
            }
            ,
            n.prototype.getRawText = function(l, e) {
                return void 0 === e && (e = {}),
                n.addXRequestedWithHeader(e),
                this.http.get(l, u.a({}, e, {
                    responseType: "text"
                })).catch(function(l) {
                    return n.handleError(l)
                })
            }
            ,
            n.prototype.delete = function(l, e) {
                return void 0 === e && (e = {}),
                n.addXRequestedWithHeader(e),
                this.http.delete(l, u.a({}, e, {
                    responseType: "json"
                })).map(function(l) {
                    return n.extractData(l)
                }).catch(function(l) {
                    return n.handleError(l)
                })
            }
            ,
            n.prototype.post = function(l, e, t, o) {
                return void 0 === t && (t = {}),
                void 0 === o && (o = !0),
                o && n.addXRequestedWithHeader(t),
                this.http.post(l, e, u.a({}, t, {
                    responseType: "json"
                })).map(function(l) {
                    return n.extractData(l)
                }).catch(function(l) {
                    return n.handleError(l)
                })
            }
            ,
            n.prototype.put = function(l, e, t) {
                return void 0 === t && (t = {}),
                n.addXRequestedWithHeader(t),
                this.http.put(l, e, u.a({}, t, {
                    responseType: "json"
                })).map(function(l) {
                    return n.extractData(l)
                }).catch(function(l) {
                    return n.handleError(l)
                })
            }
            ,
            n.extractData = function(n) {
                return n.data || n || {}
            }
            ,
            n.handleError = function(l) {
                return console.error(n.errorFromResponse(l)),
                cn.a.throw(l)
            }
            ,
            n.errorFromResponse = function(n) {
                return n.status + " (" + (n.statusText || "") + "): " + (n.message || "")
            }
            ,
            n.addXRequestedWithHeader = function(n) {
                null == n.headers && (n.headers = new un.g),
                n.headers = n.headers.set("X-Requested-With", "XMLHttpRequest")
            }
            ,
            n
        }()), sn = function() {
            function n() {
                this.cache = {}
            }
            return n.prototype.initializeForSpec = function(l, e) {
                return this.cache[l] || (this.cache[l] = n.initializeEmptyCache(e)),
                this.cache[l]
            }
            ,
            n.prototype.putToken = function(n, l, e) {
                this.cache[n][l] = e
            }
            ,
            n.prototype.getTokenFromCache = function(n, l) {
                return this.cache[n] && this.cache[n][l] || null
            }
            ,
            n.initializeEmptyCache = function(n) {
                var l = {}
                  , e = n.apiSpec.components && n.apiSpec.components.securitySchemes;
                if (!e)
                    return l;
                for (var t = 0, o = Object.keys(e); t < o.length; t++)
                    l[o[t]] = null;
                return l
            }
            ,
            n
        }();
        !function(n) {
            n.AUTHORIZATION_CODE = "authorizationCode",
            n.IMPLICIT = "implicit",
            n.PASSWORD = "password",
            n.CLIENT_CREDENTIALS = "clientCredentials"
        }(Y || (Y = {}));
        var bn = function() {
            function n(n, l, e, o, i, a) {
                this.window = n,
                this.document = l,
                this.http = e,
                this.notificationService = o,
                this.authTokenCacheService = i,
                this.logger = a,
                this.onSave = new t.m,
                this.OAuthFlowName = Y,
                this.awaitingXhr = !1,
                this.popup = null,
                this.popupUrlPollInterval = null
            }
            return n.prototype.ngOnInit = function() {
                this.redirectUri = this.window.location.origin + n.REDIRECT_PATH,
                this.initializeState()
            }
            ,
            n.prototype.ngOnDestroy = function() {
                this.closePopup()
            }
            ,
            n.prototype.ngOnChanges = function() {
                this.initializeState()
            }
            ,
            n.prototype.clear = function() {
                this.cachedToken.clear(),
                this.cachedToken = null,
                this.onSave.emit(null),
                this.initializeState()
            }
            ,
            n.prototype.authorize = function() {
                switch (this.selectedFlow) {
                case Y.AUTHORIZATION_CODE:
                case Y.IMPLICIT:
                    return void this.openPopup();
                case Y.CLIENT_CREDENTIALS:
                    return void this.getTokenClientCredentials();
                case Y.PASSWORD:
                    return void this.getTokenPassword();
                default:
                    throw new Error("Unknown flow type: " + this.selectedFlow)
                }
            }
            ,
            n.prototype.initializeState = function() {
                this.availableFlows = Object.keys(this.securityScheme.flows),
                this.editing = null == this.cachedToken || this.cachedToken.expired,
                this.selectedFlow = null == this.cachedToken ? this.availableFlows[0] : this.cachedToken.flow
            }
            ,
            n.prototype.openPopup = function() {
                var l = this
                  , e = this.getPopupUrl()
                  , t = n.getPopupOptions(this.window, this.document);
                this.popup = this.window.open(e, "Auth Popup", t),
                this.popupUrlPollInterval = this.window.setInterval(function() {
                    return l.checkPopupUrl()
                }, n.POPUP_INTERVAL)
            }
            ,
            n.prototype.closePopup = function() {
                this.popupUrlPollInterval && (this.window.clearInterval(this.popupUrlPollInterval),
                this.popupUrlPollInterval = null),
                this.popup && (this.popup.close(),
                this.popup = null)
            }
            ,
            n.prototype.checkPopupUrl = function() {
                if (this.popup.closed)
                    return this.closePopup(),
                    this.editing = !0,
                    void this.notificationService.sendError(n.AUTH_FAILED_MESSAGE);
                var l;
                if ("about:blank" !== this.popup.location.href) {
                    l = this.popup.location.hash && this.popup.location.hash.split("#")[1] || this.popup.location.search,
                    this.closePopup();
                    var e = new URLSearchParams(l);
                    (this.selectedFlow === Y.AUTHORIZATION_CODE ? this.getPopupInfoAuthorizationCode(e) : this.getPopupInfoImplicit(e)) || (this.editing = !0,
                    this.notificationService.sendError(n.AUTH_FAILED_MESSAGE))
                }
            }
            ,
            n.prototype.getPopupInfoAuthorizationCode = function(n) {
                var l = n.get("code");
                if (null == l)
                    return !1;
                var e = this.securityScheme.flows.authorizationCode.tokenUrl
                  , t = new URLSearchParams;
                return t.set("grant_type", "authorization_code"),
                t.set("redirect_uri", this.redirectUri),
                t.set("code", l),
                this.getTokenFromServer(e, t.toString()),
                !0
            }
            ,
            n.prototype.getPopupInfoImplicit = function(n) {
                var l = {
                    token_type: n.get("token_type"),
                    expires_in: +n.get("expires_in") || 0,
                    access_token: n.get("access_token")
                };
                return null != l.access_token && (this.loadToken(l),
                !0)
            }
            ,
            n.prototype.getTokenClientCredentials = function() {
                var n = this.securityScheme.flows.clientCredentials.tokenUrl
                  , l = new URLSearchParams;
                l.set("grant_type", "client_credentials"),
                this.getTokenFromServer(n, l.toString())
            }
            ,
            n.prototype.getTokenPassword = function() {
                var n = this.securityScheme.flows.password.tokenUrl
                  , l = new URLSearchParams;
                l.set("grant_type", "password"),
                l.set("username", this.username),
                l.set("password", this.password),
                this.getTokenFromServer(n, l.toString())
            }
            ,
            n.prototype.getTokenFromServer = function(l, e) {
                var t = this
                  , o = btoa(this.clientId + ":" + this.clientSecret)
                  , i = (new un.g).set("Authorization", "Basic " + o).set("Content-Type", "application/x-www-form-urlencoded")
                  , a = this.http.post(l, e, {
                    headers: i
                }, !1);
                this.awaitingXhr = !0,
                a.subscribe(function(n) {
                    t.awaitingXhr = !1,
                    t.loadToken(n)
                }, function() {
                    t.awaitingXhr = !1,
                    t.editing = !0,
                    t.notificationService.sendError(n.AUTH_FAILED_MESSAGE)
                })
            }
            ,
            n.prototype.getPopupUrl = function() {
                var n = this.securityScheme.flows[this.selectedFlow]
                  , l = this.selectedFlow === Y.AUTHORIZATION_CODE ? "code" : "token"
                  , e = new URLSearchParams;
                return e.set("client_id", this.clientId),
                e.set("response_type", l),
                e.set("redirect_uri", this.redirectUri),
                e.set("scope", Object.keys(n.scopes).join(" ")),
                n.authorizationUrl + "?" + e.toString()
            }
            ,
            n.prototype.loadToken = function(n) {
                this.cachedToken = new rn(n,this.securityScheme,this.selectedFlow,this.apiId,this.name,this.authTokenCacheService,this.notificationService,this.window,this.http,this.clientId,this.clientSecret,this.logger),
                this.onSave.emit(this.cachedToken),
                this.editing = !1
            }
            ,
            n.getPopupOptions = function(n, l) {
                var e = l.documentElement;
                return "width=600,height=600,left=" + ((n.innerWidth || e.clientWidth || n.screen.width) / 2 - 300 + (null != n.screenLeft ? n.screenLeft : n.screenX)) + ",top=" + ((n.innerHeight || e.clientHeight || n.screen.height) / 2 - 300 + (null != n.screenTop ? n.screenTop : n.screenY))
            }
            ,
            n.POPUP_INTERVAL = 100,
            n.REDIRECT_PATH = "/oauth_redirect",
            n.AUTH_FAILED_MESSAGE = "Authorization failed",
            n
        }()
          , pn = t.pb({
            encapsulation: 2,
            styles: [],
            data: {}
        });
        function hn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 5, null, null, null, null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 1, "p", [["class", "oauth-token-acquired"]], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, [" Access token acquired "])), (n()(),
            t.rb(3, 0, null, null, 2, "button", [["color", "primary"], ["mat-raised-button", ""]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], [[null, "click"]], function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.clear() && t),
                t
            }, O.d, O.b)), t.qb(4, 180224, null, 0, M.b, [t.k, P.a, x.f, [2, T.a]], {
                color: [0, "color"]
            }, null), (n()(),
            t.Jb(-1, 0, [" CLEAR "]))], function(n, l) {
                n(l, 4, 0, "primary")
            }, function(n, l) {
                n(l, 3, 0, t.Bb(l, 4).disabled || null, "NoopAnimations" === t.Bb(l, 4)._animationMode)
            })
        }
        function mn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "p", [["class", "oauth-expired-token"]], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, [" Your token has expired! Re-authorize to continue making calls to this API "]))], null, null)
        }
        function fn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 2, "mat-option", [["class", "mat-option"], ["role", "option"]], [[1, "tabindex", 0], [2, "mat-selected", null], [2, "mat-option-multiple", null], [2, "mat-active", null], [8, "id", 0], [1, "aria-selected", 0], [1, "aria-disabled", 0], [2, "mat-option-disabled", null]], [[null, "click"], [null, "keydown"]], function(n, l, e) {
                var o = !0;
                return "click" === l && (o = !1 !== t.Bb(n, 1)._selectViaInteraction() && o),
                "keydown" === l && (o = !1 !== t.Bb(n, 1)._handleKeydown(e) && o),
                o
            }, $.c, $.a)), t.qb(1, 8568832, [[8, 4]], 0, z.p, [t.k, t.h, [2, z.j], [2, z.o]], {
                value: [0, "value"]
            }, null), (n()(),
            t.Jb(2, 0, [" ", " "]))], function(n, l) {
                n(l, 1, 0, l.context.$implicit)
            }, function(n, l) {
                n(l, 0, 0, t.Bb(l, 1)._getTabIndex(), t.Bb(l, 1).selected, t.Bb(l, 1).multiple, t.Bb(l, 1).active, t.Bb(l, 1).id, t.Bb(l, 1).selected.toString(), t.Bb(l, 1).disabled.toString(), t.Bb(l, 1).disabled),
                n(l, 2, 0, l.context.$implicit)
            })
        }
        function gn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 4, "div", [["class", "oauth-waiting"]], null, null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 1, "mat-spinner", [["class", "process-spinner app-details mat-spinner mat-progress-spinner"], ["mode", "indeterminate"], ["role", "progressbar"]], [[2, "_mat-animation-noopable", null], [4, "width", "px"], [4, "height", "px"]], null, null, Z.b, Z.a)), t.qb(2, 49152, null, 0, nn.d, [t.k, P.a, [2, E.d], [2, T.a], nn.a], {
                diameter: [0, "diameter"],
                strokeWidth: [1, "strokeWidth"]
            }, null), (n()(),
            t.rb(3, 0, null, null, 1, "span", [], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, [" Waiting for authorization... "]))], function(n, l) {
                n(l, 2, 0, 32, 2.5)
            }, function(n, l) {
                n(l, 1, 0, t.Bb(l, 2)._noopAnimations, t.Bb(l, 2).diameter, t.Bb(l, 2).diameter)
            })
        }
        function Bn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 4, "div", [["class", "oauth-waiting"]], null, null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 1, "mat-spinner", [["class", "process-spinner app-details mat-spinner mat-progress-spinner"], ["mode", "indeterminate"], ["role", "progressbar"]], [[2, "_mat-animation-noopable", null], [4, "width", "px"], [4, "height", "px"]], null, null, Z.b, Z.a)), t.qb(2, 49152, null, 0, nn.d, [t.k, P.a, [2, E.d], [2, T.a], nn.a], {
                diameter: [0, "diameter"],
                strokeWidth: [1, "strokeWidth"]
            }, null), (n()(),
            t.rb(3, 0, null, null, 1, "span", [], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, [" Getting credentials from OAuth server "]))], function(n, l) {
                n(l, 2, 0, 32, 2.5)
            }, function(n, l) {
                n(l, 1, 0, t.Bb(l, 2)._noopAnimations, t.Bb(l, 2).diameter, t.Bb(l, 2).diameter)
            })
        }
        function _n(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 18, "mat-form-field", [["class", "mat-form-field"]], [[2, "mat-form-field-appearance-standard", null], [2, "mat-form-field-appearance-fill", null], [2, "mat-form-field-appearance-outline", null], [2, "mat-form-field-appearance-legacy", null], [2, "mat-form-field-invalid", null], [2, "mat-form-field-can-float", null], [2, "mat-form-field-should-float", null], [2, "mat-form-field-hide-placeholder", null], [2, "mat-form-field-disabled", null], [2, "mat-form-field-autofilled", null], [2, "mat-focused", null], [2, "mat-accent", null], [2, "mat-warn", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null], [2, "_mat-animation-noopable", null]], null, null, k.b, k.a)), t.qb(1, 7389184, null, 7, q.b, [t.k, t.h, [2, z.h], [2, I.b], [2, q.a], P.a, t.A, [2, T.a]], null, null), t.Hb(335544320, 18, {
                _control: 0
            }), t.Hb(335544320, 19, {
                _placeholderChild: 0
            }), t.Hb(335544320, 20, {
                _labelChild: 0
            }), t.Hb(603979776, 21, {
                _errorChildren: 1
            }), t.Hb(603979776, 22, {
                _hintChildren: 1
            }), t.Hb(603979776, 23, {
                _prefixChildren: 1
            }), t.Hb(603979776, 24, {
                _suffixChildren: 1
            }), (n()(),
            t.rb(9, 0, null, 1, 9, "input", [["class", "mat-input-element mat-form-field-autofill-control"], ["matInput", ""], ["name", "clientSecret"], ["placeholder", "Client Secret"], ["required", ""], ["type", "password"]], [[1, "required", 0], [2, "mat-input-server", null], [1, "id", 0], [1, "placeholder", 0], [8, "disabled", 0], [8, "required", 0], [1, "readonly", 0], [1, "aria-describedby", 0], [1, "aria-invalid", 0], [1, "aria-required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"], [null, "focus"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "input" === l && (o = !1 !== t.Bb(n, 12)._handleInput(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 12).onTouched() && o),
                "compositionstart" === l && (o = !1 !== t.Bb(n, 12)._compositionStart() && o),
                "compositionend" === l && (o = !1 !== t.Bb(n, 12)._compositionEnd(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 16)._focusChanged(!1) && o),
                "focus" === l && (o = !1 !== t.Bb(n, 16)._focusChanged(!0) && o),
                "input" === l && (o = !1 !== t.Bb(n, 16)._onInput() && o),
                "ngModelChange" === l && (o = !1 !== (i.clientSecret = e) && o),
                o
            }, null, null)), t.qb(10, 16384, null, 0, S.u, [], {
                required: [0, "required"]
            }, null), t.Gb(1024, null, S.l, function(n) {
                return [n]
            }, [S.u]), t.qb(12, 16384, null, 0, S.d, [t.F, t.k, [2, S.a]], null, null), t.Gb(1024, null, S.m, function(n) {
                return [n]
            }, [S.d]), t.qb(14, 671744, null, 0, S.r, [[2, S.c], [6, S.l], [8, null], [6, S.m]], {
                name: [0, "name"],
                model: [1, "model"]
            }, {
                update: "ngModelChange"
            }), t.Gb(2048, null, S.n, null, [S.r]), t.qb(16, 999424, null, 0, A.a, [t.k, P.a, [6, S.n], [2, S.q], [2, S.j], z.b, [8, null], F.a, t.A], {
                placeholder: [0, "placeholder"],
                required: [1, "required"],
                type: [2, "type"]
            }, null), t.qb(17, 16384, null, 0, S.o, [[4, S.n]], null, null), t.Gb(2048, [[18, 4]], q.c, null, [A.a])], function(n, l) {
                var e = l.component;
                n(l, 10, 0, ""),
                n(l, 14, 0, "clientSecret", e.clientSecret),
                n(l, 16, 0, "Client Secret", "", "password")
            }, function(n, l) {
                n(l, 0, 1, ["standard" == t.Bb(l, 1).appearance, "fill" == t.Bb(l, 1).appearance, "outline" == t.Bb(l, 1).appearance, "legacy" == t.Bb(l, 1).appearance, t.Bb(l, 1)._control.errorState, t.Bb(l, 1)._canLabelFloat, t.Bb(l, 1)._shouldLabelFloat(), t.Bb(l, 1)._hideControlPlaceholder(), t.Bb(l, 1)._control.disabled, t.Bb(l, 1)._control.autofilled, t.Bb(l, 1)._control.focused, "accent" == t.Bb(l, 1).color, "warn" == t.Bb(l, 1).color, t.Bb(l, 1)._shouldForward("untouched"), t.Bb(l, 1)._shouldForward("touched"), t.Bb(l, 1)._shouldForward("pristine"), t.Bb(l, 1)._shouldForward("dirty"), t.Bb(l, 1)._shouldForward("valid"), t.Bb(l, 1)._shouldForward("invalid"), t.Bb(l, 1)._shouldForward("pending"), !t.Bb(l, 1)._animationsEnabled]),
                n(l, 9, 1, [t.Bb(l, 10).required ? "" : null, t.Bb(l, 16)._isServer, t.Bb(l, 16).id, t.Bb(l, 16).placeholder, t.Bb(l, 16).disabled, t.Bb(l, 16).required, t.Bb(l, 16).readonly && !t.Bb(l, 16)._isNativeSelect || null, t.Bb(l, 16)._ariaDescribedby || null, t.Bb(l, 16).errorState, t.Bb(l, 16).required.toString(), t.Bb(l, 17).ngClassUntouched, t.Bb(l, 17).ngClassTouched, t.Bb(l, 17).ngClassPristine, t.Bb(l, 17).ngClassDirty, t.Bb(l, 17).ngClassValid, t.Bb(l, 17).ngClassInvalid, t.Bb(l, 17).ngClassPending])
            })
        }
        function yn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 38, "div", [], null, null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 18, "mat-form-field", [["class", "mat-form-field"]], [[2, "mat-form-field-appearance-standard", null], [2, "mat-form-field-appearance-fill", null], [2, "mat-form-field-appearance-outline", null], [2, "mat-form-field-appearance-legacy", null], [2, "mat-form-field-invalid", null], [2, "mat-form-field-can-float", null], [2, "mat-form-field-should-float", null], [2, "mat-form-field-hide-placeholder", null], [2, "mat-form-field-disabled", null], [2, "mat-form-field-autofilled", null], [2, "mat-focused", null], [2, "mat-accent", null], [2, "mat-warn", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null], [2, "_mat-animation-noopable", null]], null, null, k.b, k.a)), t.qb(2, 7389184, null, 7, q.b, [t.k, t.h, [2, z.h], [2, I.b], [2, q.a], P.a, t.A, [2, T.a]], null, null), t.Hb(335544320, 25, {
                _control: 0
            }), t.Hb(335544320, 26, {
                _placeholderChild: 0
            }), t.Hb(335544320, 27, {
                _labelChild: 0
            }), t.Hb(603979776, 28, {
                _errorChildren: 1
            }), t.Hb(603979776, 29, {
                _hintChildren: 1
            }), t.Hb(603979776, 30, {
                _prefixChildren: 1
            }), t.Hb(603979776, 31, {
                _suffixChildren: 1
            }), (n()(),
            t.rb(10, 0, null, 1, 9, "input", [["class", "mat-input-element mat-form-field-autofill-control"], ["matInput", ""], ["name", "username"], ["placeholder", "Username"], ["required", ""]], [[1, "required", 0], [2, "mat-input-server", null], [1, "id", 0], [1, "placeholder", 0], [8, "disabled", 0], [8, "required", 0], [1, "readonly", 0], [1, "aria-describedby", 0], [1, "aria-invalid", 0], [1, "aria-required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"], [null, "focus"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "input" === l && (o = !1 !== t.Bb(n, 13)._handleInput(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 13).onTouched() && o),
                "compositionstart" === l && (o = !1 !== t.Bb(n, 13)._compositionStart() && o),
                "compositionend" === l && (o = !1 !== t.Bb(n, 13)._compositionEnd(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 17)._focusChanged(!1) && o),
                "focus" === l && (o = !1 !== t.Bb(n, 17)._focusChanged(!0) && o),
                "input" === l && (o = !1 !== t.Bb(n, 17)._onInput() && o),
                "ngModelChange" === l && (o = !1 !== (i.username = e) && o),
                o
            }, null, null)), t.qb(11, 16384, null, 0, S.u, [], {
                required: [0, "required"]
            }, null), t.Gb(1024, null, S.l, function(n) {
                return [n]
            }, [S.u]), t.qb(13, 16384, null, 0, S.d, [t.F, t.k, [2, S.a]], null, null), t.Gb(1024, null, S.m, function(n) {
                return [n]
            }, [S.d]), t.qb(15, 671744, null, 0, S.r, [[2, S.c], [6, S.l], [8, null], [6, S.m]], {
                name: [0, "name"],
                model: [1, "model"]
            }, {
                update: "ngModelChange"
            }), t.Gb(2048, null, S.n, null, [S.r]), t.qb(17, 999424, null, 0, A.a, [t.k, P.a, [6, S.n], [2, S.q], [2, S.j], z.b, [8, null], F.a, t.A], {
                placeholder: [0, "placeholder"],
                required: [1, "required"]
            }, null), t.qb(18, 16384, null, 0, S.o, [[4, S.n]], null, null), t.Gb(2048, [[25, 4]], q.c, null, [A.a]), (n()(),
            t.rb(20, 0, null, null, 18, "mat-form-field", [["class", "mat-form-field"]], [[2, "mat-form-field-appearance-standard", null], [2, "mat-form-field-appearance-fill", null], [2, "mat-form-field-appearance-outline", null], [2, "mat-form-field-appearance-legacy", null], [2, "mat-form-field-invalid", null], [2, "mat-form-field-can-float", null], [2, "mat-form-field-should-float", null], [2, "mat-form-field-hide-placeholder", null], [2, "mat-form-field-disabled", null], [2, "mat-form-field-autofilled", null], [2, "mat-focused", null], [2, "mat-accent", null], [2, "mat-warn", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null], [2, "_mat-animation-noopable", null]], null, null, k.b, k.a)), t.qb(21, 7389184, null, 7, q.b, [t.k, t.h, [2, z.h], [2, I.b], [2, q.a], P.a, t.A, [2, T.a]], null, null), t.Hb(335544320, 32, {
                _control: 0
            }), t.Hb(335544320, 33, {
                _placeholderChild: 0
            }), t.Hb(335544320, 34, {
                _labelChild: 0
            }), t.Hb(603979776, 35, {
                _errorChildren: 1
            }), t.Hb(603979776, 36, {
                _hintChildren: 1
            }), t.Hb(603979776, 37, {
                _prefixChildren: 1
            }), t.Hb(603979776, 38, {
                _suffixChildren: 1
            }), (n()(),
            t.rb(29, 0, null, 1, 9, "input", [["class", "mat-input-element mat-form-field-autofill-control"], ["matInput", ""], ["name", "password"], ["placeholder", "Password"], ["required", ""], ["type", "password"]], [[1, "required", 0], [2, "mat-input-server", null], [1, "id", 0], [1, "placeholder", 0], [8, "disabled", 0], [8, "required", 0], [1, "readonly", 0], [1, "aria-describedby", 0], [1, "aria-invalid", 0], [1, "aria-required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"], [null, "focus"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "input" === l && (o = !1 !== t.Bb(n, 32)._handleInput(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 32).onTouched() && o),
                "compositionstart" === l && (o = !1 !== t.Bb(n, 32)._compositionStart() && o),
                "compositionend" === l && (o = !1 !== t.Bb(n, 32)._compositionEnd(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 36)._focusChanged(!1) && o),
                "focus" === l && (o = !1 !== t.Bb(n, 36)._focusChanged(!0) && o),
                "input" === l && (o = !1 !== t.Bb(n, 36)._onInput() && o),
                "ngModelChange" === l && (o = !1 !== (i.password = e) && o),
                o
            }, null, null)), t.qb(30, 16384, null, 0, S.u, [], {
                required: [0, "required"]
            }, null), t.Gb(1024, null, S.l, function(n) {
                return [n]
            }, [S.u]), t.qb(32, 16384, null, 0, S.d, [t.F, t.k, [2, S.a]], null, null), t.Gb(1024, null, S.m, function(n) {
                return [n]
            }, [S.d]), t.qb(34, 671744, null, 0, S.r, [[2, S.c], [6, S.l], [8, null], [6, S.m]], {
                name: [0, "name"],
                model: [1, "model"]
            }, {
                update: "ngModelChange"
            }), t.Gb(2048, null, S.n, null, [S.r]), t.qb(36, 999424, null, 0, A.a, [t.k, P.a, [6, S.n], [2, S.q], [2, S.j], z.b, [8, null], F.a, t.A], {
                placeholder: [0, "placeholder"],
                required: [1, "required"],
                type: [2, "type"]
            }, null), t.qb(37, 16384, null, 0, S.o, [[4, S.n]], null, null), t.Gb(2048, [[32, 4]], q.c, null, [A.a])], function(n, l) {
                var e = l.component;
                n(l, 11, 0, ""),
                n(l, 15, 0, "username", e.username),
                n(l, 17, 0, "Username", ""),
                n(l, 30, 0, ""),
                n(l, 34, 0, "password", e.password),
                n(l, 36, 0, "Password", "", "password")
            }, function(n, l) {
                n(l, 1, 1, ["standard" == t.Bb(l, 2).appearance, "fill" == t.Bb(l, 2).appearance, "outline" == t.Bb(l, 2).appearance, "legacy" == t.Bb(l, 2).appearance, t.Bb(l, 2)._control.errorState, t.Bb(l, 2)._canLabelFloat, t.Bb(l, 2)._shouldLabelFloat(), t.Bb(l, 2)._hideControlPlaceholder(), t.Bb(l, 2)._control.disabled, t.Bb(l, 2)._control.autofilled, t.Bb(l, 2)._control.focused, "accent" == t.Bb(l, 2).color, "warn" == t.Bb(l, 2).color, t.Bb(l, 2)._shouldForward("untouched"), t.Bb(l, 2)._shouldForward("touched"), t.Bb(l, 2)._shouldForward("pristine"), t.Bb(l, 2)._shouldForward("dirty"), t.Bb(l, 2)._shouldForward("valid"), t.Bb(l, 2)._shouldForward("invalid"), t.Bb(l, 2)._shouldForward("pending"), !t.Bb(l, 2)._animationsEnabled]),
                n(l, 10, 1, [t.Bb(l, 11).required ? "" : null, t.Bb(l, 17)._isServer, t.Bb(l, 17).id, t.Bb(l, 17).placeholder, t.Bb(l, 17).disabled, t.Bb(l, 17).required, t.Bb(l, 17).readonly && !t.Bb(l, 17)._isNativeSelect || null, t.Bb(l, 17)._ariaDescribedby || null, t.Bb(l, 17).errorState, t.Bb(l, 17).required.toString(), t.Bb(l, 18).ngClassUntouched, t.Bb(l, 18).ngClassTouched, t.Bb(l, 18).ngClassPristine, t.Bb(l, 18).ngClassDirty, t.Bb(l, 18).ngClassValid, t.Bb(l, 18).ngClassInvalid, t.Bb(l, 18).ngClassPending]),
                n(l, 20, 1, ["standard" == t.Bb(l, 21).appearance, "fill" == t.Bb(l, 21).appearance, "outline" == t.Bb(l, 21).appearance, "legacy" == t.Bb(l, 21).appearance, t.Bb(l, 21)._control.errorState, t.Bb(l, 21)._canLabelFloat, t.Bb(l, 21)._shouldLabelFloat(), t.Bb(l, 21)._hideControlPlaceholder(), t.Bb(l, 21)._control.disabled, t.Bb(l, 21)._control.autofilled, t.Bb(l, 21)._control.focused, "accent" == t.Bb(l, 21).color, "warn" == t.Bb(l, 21).color, t.Bb(l, 21)._shouldForward("untouched"), t.Bb(l, 21)._shouldForward("touched"), t.Bb(l, 21)._shouldForward("pristine"), t.Bb(l, 21)._shouldForward("dirty"), t.Bb(l, 21)._shouldForward("valid"), t.Bb(l, 21)._shouldForward("invalid"), t.Bb(l, 21)._shouldForward("pending"), !t.Bb(l, 21)._animationsEnabled]),
                n(l, 29, 1, [t.Bb(l, 30).required ? "" : null, t.Bb(l, 36)._isServer, t.Bb(l, 36).id, t.Bb(l, 36).placeholder, t.Bb(l, 36).disabled, t.Bb(l, 36).required, t.Bb(l, 36).readonly && !t.Bb(l, 36)._isNativeSelect || null, t.Bb(l, 36)._ariaDescribedby || null, t.Bb(l, 36).errorState, t.Bb(l, 36).required.toString(), t.Bb(l, 37).ngClassUntouched, t.Bb(l, 37).ngClassTouched, t.Bb(l, 37).ngClassPristine, t.Bb(l, 37).ngClassDirty, t.Bb(l, 37).ngClassValid, t.Bb(l, 37).ngClassInvalid, t.Bb(l, 37).ngClassPending])
            })
        }
        function vn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 28, null, null, null, null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 21, "div", [], null, null, null, null, null)), (n()(),
            t.rb(2, 0, null, null, 18, "mat-form-field", [["class", "mat-form-field"]], [[2, "mat-form-field-appearance-standard", null], [2, "mat-form-field-appearance-fill", null], [2, "mat-form-field-appearance-outline", null], [2, "mat-form-field-appearance-legacy", null], [2, "mat-form-field-invalid", null], [2, "mat-form-field-can-float", null], [2, "mat-form-field-should-float", null], [2, "mat-form-field-hide-placeholder", null], [2, "mat-form-field-disabled", null], [2, "mat-form-field-autofilled", null], [2, "mat-focused", null], [2, "mat-accent", null], [2, "mat-warn", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null], [2, "_mat-animation-noopable", null]], null, null, k.b, k.a)), t.qb(3, 7389184, null, 7, q.b, [t.k, t.h, [2, z.h], [2, I.b], [2, q.a], P.a, t.A, [2, T.a]], null, null), t.Hb(335544320, 11, {
                _control: 0
            }), t.Hb(335544320, 12, {
                _placeholderChild: 0
            }), t.Hb(335544320, 13, {
                _labelChild: 0
            }), t.Hb(603979776, 14, {
                _errorChildren: 1
            }), t.Hb(603979776, 15, {
                _hintChildren: 1
            }), t.Hb(603979776, 16, {
                _prefixChildren: 1
            }), t.Hb(603979776, 17, {
                _suffixChildren: 1
            }), (n()(),
            t.rb(11, 0, null, 1, 9, "input", [["class", "mat-input-element mat-form-field-autofill-control"], ["matInput", ""], ["name", "clientId"], ["placeholder", "Client ID"], ["required", ""]], [[1, "required", 0], [2, "mat-input-server", null], [1, "id", 0], [1, "placeholder", 0], [8, "disabled", 0], [8, "required", 0], [1, "readonly", 0], [1, "aria-describedby", 0], [1, "aria-invalid", 0], [1, "aria-required", 0], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"], [null, "focus"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "input" === l && (o = !1 !== t.Bb(n, 14)._handleInput(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 14).onTouched() && o),
                "compositionstart" === l && (o = !1 !== t.Bb(n, 14)._compositionStart() && o),
                "compositionend" === l && (o = !1 !== t.Bb(n, 14)._compositionEnd(e.target.value) && o),
                "blur" === l && (o = !1 !== t.Bb(n, 18)._focusChanged(!1) && o),
                "focus" === l && (o = !1 !== t.Bb(n, 18)._focusChanged(!0) && o),
                "input" === l && (o = !1 !== t.Bb(n, 18)._onInput() && o),
                "ngModelChange" === l && (o = !1 !== (i.clientId = e) && o),
                o
            }, null, null)), t.qb(12, 16384, null, 0, S.u, [], {
                required: [0, "required"]
            }, null), t.Gb(1024, null, S.l, function(n) {
                return [n]
            }, [S.u]), t.qb(14, 16384, null, 0, S.d, [t.F, t.k, [2, S.a]], null, null), t.Gb(1024, null, S.m, function(n) {
                return [n]
            }, [S.d]), t.qb(16, 671744, null, 0, S.r, [[2, S.c], [6, S.l], [8, null], [6, S.m]], {
                name: [0, "name"],
                model: [1, "model"]
            }, {
                update: "ngModelChange"
            }), t.Gb(2048, null, S.n, null, [S.r]), t.qb(18, 999424, null, 0, A.a, [t.k, P.a, [6, S.n], [2, S.q], [2, S.j], z.b, [8, null], F.a, t.A], {
                placeholder: [0, "placeholder"],
                required: [1, "required"]
            }, null), t.qb(19, 16384, null, 0, S.o, [[4, S.n]], null, null), t.Gb(2048, [[11, 4]], q.c, null, [A.a]), (n()(),
            t.ib(16777216, null, null, 1, null, _n)), t.qb(22, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, yn)), t.qb(24, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.rb(25, 0, null, null, 3, "div", [], null, null, null, null, null)), (n()(),
            t.rb(26, 0, null, null, 2, "button", [["color", "primary"], ["mat-raised-button", ""], ["type", "submit"]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], null, null, O.d, O.b)), t.qb(27, 180224, null, 0, M.b, [t.k, P.a, x.f, [2, T.a]], {
                disabled: [0, "disabled"],
                color: [1, "color"]
            }, null), (n()(),
            t.Jb(-1, 0, [" AUTHORIZE "]))], function(n, l) {
                var e = l.component;
                n(l, 12, 0, ""),
                n(l, 16, 0, "clientId", e.clientId),
                n(l, 18, 0, "Client ID", ""),
                n(l, 22, 0, e.selectedFlow != e.OAuthFlowName.IMPLICIT),
                n(l, 24, 0, e.selectedFlow === e.OAuthFlowName.PASSWORD),
                n(l, 27, 0, !t.Bb(l.parent, 2).form.valid, "primary")
            }, function(n, l) {
                n(l, 2, 1, ["standard" == t.Bb(l, 3).appearance, "fill" == t.Bb(l, 3).appearance, "outline" == t.Bb(l, 3).appearance, "legacy" == t.Bb(l, 3).appearance, t.Bb(l, 3)._control.errorState, t.Bb(l, 3)._canLabelFloat, t.Bb(l, 3)._shouldLabelFloat(), t.Bb(l, 3)._hideControlPlaceholder(), t.Bb(l, 3)._control.disabled, t.Bb(l, 3)._control.autofilled, t.Bb(l, 3)._control.focused, "accent" == t.Bb(l, 3).color, "warn" == t.Bb(l, 3).color, t.Bb(l, 3)._shouldForward("untouched"), t.Bb(l, 3)._shouldForward("touched"), t.Bb(l, 3)._shouldForward("pristine"), t.Bb(l, 3)._shouldForward("dirty"), t.Bb(l, 3)._shouldForward("valid"), t.Bb(l, 3)._shouldForward("invalid"), t.Bb(l, 3)._shouldForward("pending"), !t.Bb(l, 3)._animationsEnabled]),
                n(l, 11, 1, [t.Bb(l, 12).required ? "" : null, t.Bb(l, 18)._isServer, t.Bb(l, 18).id, t.Bb(l, 18).placeholder, t.Bb(l, 18).disabled, t.Bb(l, 18).required, t.Bb(l, 18).readonly && !t.Bb(l, 18)._isNativeSelect || null, t.Bb(l, 18)._ariaDescribedby || null, t.Bb(l, 18).errorState, t.Bb(l, 18).required.toString(), t.Bb(l, 19).ngClassUntouched, t.Bb(l, 19).ngClassTouched, t.Bb(l, 19).ngClassPristine, t.Bb(l, 19).ngClassDirty, t.Bb(l, 19).ngClassValid, t.Bb(l, 19).ngClassInvalid, t.Bb(l, 19).ngClassPending]),
                n(l, 26, 0, t.Bb(l, 27).disabled || null, "NoopAnimations" === t.Bb(l, 27)._animationMode)
            })
        }
        function Cn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 32, "form", [["novalidate", ""]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngSubmit"], [null, "submit"], [null, "reset"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "submit" === l && (o = !1 !== t.Bb(n, 2).onSubmit(e) && o),
                "reset" === l && (o = !1 !== t.Bb(n, 2).onReset() && o),
                "ngSubmit" === l && (o = !1 !== i.authorize() && o),
                o
            }, null, null)), t.qb(1, 16384, null, 0, S.y, [], null, null), t.qb(2, 4210688, [["oAuthForm", 4]], 0, S.q, [[8, null], [8, null]], null, {
                ngSubmit: "ngSubmit"
            }), t.Gb(2048, null, S.c, null, [S.q]), t.qb(4, 16384, null, 0, S.p, [[4, S.c]], null, null), (n()(),
            t.rb(5, 0, null, null, 21, "mat-form-field", [["class", "mat-form-field"]], [[2, "mat-form-field-appearance-standard", null], [2, "mat-form-field-appearance-fill", null], [2, "mat-form-field-appearance-outline", null], [2, "mat-form-field-appearance-legacy", null], [2, "mat-form-field-invalid", null], [2, "mat-form-field-can-float", null], [2, "mat-form-field-should-float", null], [2, "mat-form-field-hide-placeholder", null], [2, "mat-form-field-disabled", null], [2, "mat-form-field-autofilled", null], [2, "mat-focused", null], [2, "mat-accent", null], [2, "mat-warn", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null], [2, "_mat-animation-noopable", null]], null, null, k.b, k.a)), t.qb(6, 7389184, null, 7, q.b, [t.k, t.h, [2, z.h], [2, I.b], [2, q.a], P.a, t.A, [2, T.a]], null, null), t.Hb(335544320, 1, {
                _control: 0
            }), t.Hb(335544320, 2, {
                _placeholderChild: 0
            }), t.Hb(335544320, 3, {
                _labelChild: 0
            }), t.Hb(603979776, 4, {
                _errorChildren: 1
            }), t.Hb(603979776, 5, {
                _hintChildren: 1
            }), t.Hb(603979776, 6, {
                _prefixChildren: 1
            }), t.Hb(603979776, 7, {
                _suffixChildren: 1
            }), (n()(),
            t.rb(14, 0, null, 1, 12, "mat-select", [["class", "mat-select"], ["name", "selectedFlow"], ["placeholder", "Flow"], ["role", "listbox"]], [[1, "id", 0], [1, "tabindex", 0], [1, "aria-label", 0], [1, "aria-labelledby", 0], [1, "aria-required", 0], [1, "aria-disabled", 0], [1, "aria-invalid", 0], [1, "aria-owns", 0], [1, "aria-multiselectable", 0], [1, "aria-describedby", 0], [1, "aria-activedescendant", 0], [2, "mat-select-disabled", null], [2, "mat-select-invalid", null], [2, "mat-select-required", null], [2, "mat-select-empty", null], [2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "ngModelChange"], [null, "keydown"], [null, "focus"], [null, "blur"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "keydown" === l && (o = !1 !== t.Bb(n, 19)._handleKeydown(e) && o),
                "focus" === l && (o = !1 !== t.Bb(n, 19)._onFocus() && o),
                "blur" === l && (o = !1 !== t.Bb(n, 19)._onBlur() && o),
                "ngModelChange" === l && (o = !1 !== (i.selectedFlow = e) && o),
                o
            }, ln.b, ln.a)), t.Gb(6144, null, z.j, null, [en.c]), t.qb(16, 671744, null, 0, S.r, [[2, S.c], [8, null], [8, null], [8, null]], {
                name: [0, "name"],
                isDisabled: [1, "isDisabled"],
                model: [2, "model"],
                options: [3, "options"]
            }, {
                update: "ngModelChange"
            }), t.Eb(17, {
                standalone: 0
            }), t.Gb(2048, null, S.n, null, [S.r]), t.qb(19, 2080768, null, 3, en.c, [tn.e, t.h, t.A, z.b, t.k, [2, I.b], [2, S.q], [2, S.j], [2, q.b], [6, S.n], [8, null], en.a], {
                disabled: [0, "disabled"],
                placeholder: [1, "placeholder"]
            }, null), t.Hb(603979776, 8, {
                options: 1
            }), t.Hb(603979776, 9, {
                optionGroups: 1
            }), t.Hb(335544320, 10, {
                customTrigger: 0
            }), t.qb(23, 16384, null, 0, S.o, [[4, S.n]], null, null), t.Gb(2048, [[1, 4]], q.c, null, [en.c]), (n()(),
            t.ib(16777216, null, 1, 1, null, fn)), t.qb(26, 278528, null, 0, E.k, [t.Q, t.N, t.t], {
                ngForOf: [0, "ngForOf"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, gn)), t.qb(28, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, Bn)), t.qb(30, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, vn)), t.qb(32, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null)], function(n, l) {
                var e = l.component
                  , t = 1 === e.availableFlows.length
                  , o = e.selectedFlow
                  , i = n(l, 17, 0, !0);
                n(l, 16, 0, "selectedFlow", t, o, i),
                n(l, 19, 0, 1 === e.availableFlows.length, "Flow"),
                n(l, 26, 0, e.availableFlows),
                n(l, 28, 0, null != e.popup),
                n(l, 30, 0, e.awaitingXhr),
                n(l, 32, 0, null == e.popup && !e.awaitingXhr)
            }, function(n, l) {
                n(l, 0, 0, t.Bb(l, 4).ngClassUntouched, t.Bb(l, 4).ngClassTouched, t.Bb(l, 4).ngClassPristine, t.Bb(l, 4).ngClassDirty, t.Bb(l, 4).ngClassValid, t.Bb(l, 4).ngClassInvalid, t.Bb(l, 4).ngClassPending),
                n(l, 5, 1, ["standard" == t.Bb(l, 6).appearance, "fill" == t.Bb(l, 6).appearance, "outline" == t.Bb(l, 6).appearance, "legacy" == t.Bb(l, 6).appearance, t.Bb(l, 6)._control.errorState, t.Bb(l, 6)._canLabelFloat, t.Bb(l, 6)._shouldLabelFloat(), t.Bb(l, 6)._hideControlPlaceholder(), t.Bb(l, 6)._control.disabled, t.Bb(l, 6)._control.autofilled, t.Bb(l, 6)._control.focused, "accent" == t.Bb(l, 6).color, "warn" == t.Bb(l, 6).color, t.Bb(l, 6)._shouldForward("untouched"), t.Bb(l, 6)._shouldForward("touched"), t.Bb(l, 6)._shouldForward("pristine"), t.Bb(l, 6)._shouldForward("dirty"), t.Bb(l, 6)._shouldForward("valid"), t.Bb(l, 6)._shouldForward("invalid"), t.Bb(l, 6)._shouldForward("pending"), !t.Bb(l, 6)._animationsEnabled]),
                n(l, 14, 1, [t.Bb(l, 19).id, t.Bb(l, 19).tabIndex, t.Bb(l, 19)._getAriaLabel(), t.Bb(l, 19)._getAriaLabelledby(), t.Bb(l, 19).required.toString(), t.Bb(l, 19).disabled.toString(), t.Bb(l, 19).errorState, t.Bb(l, 19).panelOpen ? t.Bb(l, 19)._optionIds : null, t.Bb(l, 19).multiple, t.Bb(l, 19)._ariaDescribedby || null, t.Bb(l, 19)._getAriaActiveDescendant(), t.Bb(l, 19).disabled, t.Bb(l, 19).errorState, t.Bb(l, 19).required, t.Bb(l, 19).empty, t.Bb(l, 23).ngClassUntouched, t.Bb(l, 23).ngClassTouched, t.Bb(l, 23).ngClassPristine, t.Bb(l, 23).ngClassDirty, t.Bb(l, 23).ngClassValid, t.Bb(l, 23).ngClassInvalid, t.Bb(l, 23).ngClassPending])
            })
        }
        function wn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 8, "div", [["class", "auth-section oauth"]], [[8, "id", 0]], null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 1, "p", [["class", "auth-name"]], null, null, null, null, null)), (n()(),
            t.Jb(2, null, [" OAuth2: ", " "])), (n()(),
            t.ib(16777216, null, null, 1, null, hn)), t.qb(4, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, mn)), t.qb(6, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, Cn)), t.qb(8, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null)], function(n, l) {
                var e = l.component;
                n(l, 4, 0, !e.editing && e.cachedToken && !e.cachedToken.expired),
                n(l, 6, 0, e.cachedToken && e.cachedToken.expired),
                n(l, 8, 0, e.editing)
            }, function(n, l) {
                var e = l.component;
                n(l, 0, 0, t.tb(1, "oauth-", e.name, "")),
                n(l, 2, 0, e.name)
            })
        }
        var Sn = function() {
            return function() {}
        }()
          , kn = t.pb({
            encapsulation: 2,
            styles: [],
            data: {}
        });
        function qn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "div", [], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, [" The spec calls for OpenID Connect auth. This is not implemented yet.\n"]))], null, null)
        }
        var zn, In = e("Mr+X"), Pn = e("SMsm");
        !function(n) {
            n.BASIC = "http",
            n.API_KEY = "apiKey",
            n.OAUTH = "oauth2",
            n.OPENID_CONNECT = "openIdConnect"
        }(zn || (zn = {}));
        var Tn = function() {
            function n(n, l, e, t) {
                this.dialogRef = n,
                this.router = l,
                this.apiFetchService = e,
                this.authTokenCacheService = t,
                this.AUTH_TYPES = zn
            }
            return n.prototype.ngOnInit = function() {
                var n = this;
                this.apiId = B.getApiIdFromUrl(this.router.url),
                this.apiFetchService.fetch(this.apiId, null).then(function(l) {
                    return n.loadSchemesAndCache(l)
                }),
                this.dialogRef._overlayRef.overlayElement.classList.add("auth-dialog-container")
            }
            ,
            n.prototype.save = function(n, l) {
                this.authTokenCacheService.putToken(this.apiId, n, l)
            }
            ,
            n.prototype.dismiss = function() {
                this.dialogRef.close()
            }
            ,
            n.prototype.loadSchemesAndCache = function(n) {
                this.securitySchemes = n.apiSpec.components && n.apiSpec.components.securitySchemes,
                this.cachedTokens = this.authTokenCacheService.initializeForSpec(this.apiId, n),
                this.securitySchemeNames = Object.keys(this.cachedTokens),
                this.apiName = n.apiSpec.info.title
            }
            ,
            n
        }()
          , An = e("o3x0")
          , Fn = e("eq3H")
          , On = t.pb({
            encapsulation: 0,
            styles: [['.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]{max-height:calc(100vh - 300px);min-height:200px;overflow-y:scroll}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .auth-creds-message-username[_ngcontent-%COMP%], .auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .auth-dialog-body-description-api[_ngcontent-%COMP%]{font-weight:500}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .mat-form-field[_ngcontent-%COMP%]{font-weight:500;margin-right:18px}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .mat-radio-button[_ngcontent-%COMP%]{font-weight:500;margin-left:10px}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .api-key-auth-key-field[_ngcontent-%COMP%], .auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .api-key-scheme-name-field[_ngcontent-%COMP%]{display:block}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .oauth-waiting[_ngcontent-%COMP%]   .process-spinner[_ngcontent-%COMP%]{display:inline-block}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .oauth-waiting[_ngcontent-%COMP%]   .process-spinner[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%]{stroke:rgba(97,97,97,.87)}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .oauth-waiting[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{vertical-align:8px;color:rgba(97,97,97,.87)}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .auth-dialog-body-security-requirement[_ngcontent-%COMP%]{padding-top:10px;margin-top:20px;border-top:2px solid rgba(0,0,0,.12)}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-body[_ngcontent-%COMP%]   .auth-dialog-body-security-requirement[_ngcontent-%COMP%]   .auth-submit[_ngcontent-%COMP%]{display:block}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-header[_ngcontent-%COMP%], .auth-dialog-header[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;padding:12px;background-color:#607d8b;color:#fff}.auth-dialog-header-text[_ngcontent-%COMP%]{padding-left:8px;font:400 20px/32px "Playfair Display",sans-serif;margin:0}.auth-dialog-body[_ngcontent-%COMP%]{padding:18px}.auth-dialog[_ngcontent-%COMP%]   .auth-dialog-footer[_ngcontent-%COMP%]{padding:8px;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:end;justify-content:flex-end}.cdk-overlay-container[_ngcontent-%COMP%]   .mat-icon-button[_ngcontent-%COMP%], body[_ngcontent-%COMP%]   .cdk-overlay-container[_ngcontent-%COMP%]   .mat-fab[_ngcontent-%COMP%], body[_ngcontent-%COMP%]   .cdk-overlay-container[_ngcontent-%COMP%]   .mat-flat-button[_ngcontent-%COMP%], body[_ngcontent-%COMP%]   .cdk-overlay-container[_ngcontent-%COMP%]   .mat-mini-fab[_ngcontent-%COMP%], body[_ngcontent-%COMP%]   .cdk-overlay-container[_ngcontent-%COMP%]   .mat-stroked-button[_ngcontent-%COMP%]{font-family:Roboto,sans-serif;font-size:14px;font-weight:700}']],
            data: {}
        });
        function Mn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "basic-auth", [], null, [[null, "onSave"]], function(n, l, e) {
                var t = !0;
                return "onSave" === l && (t = !1 !== n.component.save(n.parent.context.$implicit, e) && t),
                t
            }, D, H)), t.qb(1, 114688, null, 0, L, [], {
                securityScheme: [0, "securityScheme"],
                cachedToken: [1, "cachedToken"],
                name: [2, "name"]
            }, {
                onSave: "onSave"
            })], function(n, l) {
                var e = l.component;
                n(l, 1, 0, e.securitySchemes[l.parent.context.$implicit], e.cachedTokens[l.parent.context.$implicit], l.parent.context.$implicit)
            }, null)
        }
        function xn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "app-api-key", [], null, [[null, "onSave"]], function(n, l, e) {
                var t = !0;
                return "onSave" === l && (t = !1 !== n.component.save(n.parent.context.$implicit, e) && t),
                t
            }, X, j)), t.qb(1, 114688, null, 0, G, [], {
                securityScheme: [0, "securityScheme"],
                cachedToken: [1, "cachedToken"],
                apiId: [2, "apiId"],
                name: [3, "name"]
            }, {
                onSave: "onSave"
            })], function(n, l) {
                var e = l.component;
                n(l, 1, 0, e.securitySchemes[l.parent.context.$implicit], e.cachedTokens[l.parent.context.$implicit], e.apiId, l.parent.context.$implicit)
            }, null)
        }
        function En(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "oauth", [], null, [[null, "onSave"]], function(n, l, e) {
                var t = !0;
                return "onSave" === l && (t = !1 !== n.component.save(n.parent.context.$implicit, e) && t),
                t
            }, wn, pn)), t.qb(1, 770048, null, 0, bn, [r, c, dn, h, sn, i.d], {
                securityScheme: [0, "securityScheme"],
                cachedToken: [1, "cachedToken"],
                name: [2, "name"],
                apiId: [3, "apiId"]
            }, {
                onSave: "onSave"
            })], function(n, l) {
                var e = l.component;
                n(l, 1, 0, e.securitySchemes[l.parent.context.$implicit], e.cachedTokens[l.parent.context.$implicit], l.parent.context.$implicit, e.apiId)
            }, null)
        }
        function Nn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "open-id-connect", [], null, null, null, qn, kn)), t.qb(1, 49152, null, 0, Sn, [], null, null)], null, null)
        }
        function Ln(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "div", [], null, null, null, null, null)), (n()(),
            t.Jb(1, null, [" The security scheme type ", " is not supported. "]))], null, function(n, l) {
                n(l, 1, 0, l.component.securitySchemes[l.parent.context.$implicit].type)
            })
        }
        function Hn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 12, "div", [["class", "auth-dialog-body-security-requirement"]], null, null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 11, "div", [], null, null, null, null, null)), t.qb(2, 16384, null, 0, E.o, [], {
                ngSwitch: [0, "ngSwitch"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, Mn)), t.qb(4, 278528, null, 0, E.p, [t.Q, t.N, E.o], {
                ngSwitchCase: [0, "ngSwitchCase"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, xn)), t.qb(6, 278528, null, 0, E.p, [t.Q, t.N, E.o], {
                ngSwitchCase: [0, "ngSwitchCase"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, En)), t.qb(8, 278528, null, 0, E.p, [t.Q, t.N, E.o], {
                ngSwitchCase: [0, "ngSwitchCase"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, Nn)), t.qb(10, 278528, null, 0, E.p, [t.Q, t.N, E.o], {
                ngSwitchCase: [0, "ngSwitchCase"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, Ln)), t.qb(12, 16384, null, 0, E.q, [t.Q, t.N, E.o], null, null)], function(n, l) {
                var e = l.component;
                n(l, 2, 0, e.securitySchemes[l.context.$implicit].type),
                n(l, 4, 0, e.AUTH_TYPES.BASIC),
                n(l, 6, 0, e.AUTH_TYPES.API_KEY),
                n(l, 8, 0, e.AUTH_TYPES.OAUTH),
                n(l, 10, 0, e.AUTH_TYPES.OPENID_CONNECT)
            }, null)
        }
        function Un(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 17, "div", [["class", "auth-dialog"]], null, null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 5, "div", [["class", "auth-dialog-header"]], null, null, null, null, null)), (n()(),
            t.rb(2, 0, null, null, 2, "mat-icon", [["class", "auth-dialog-header-icon mat-icon"], ["role", "img"]], [[2, "mat-icon-inline", null]], null, null, In.b, In.a)), t.qb(3, 9158656, null, 0, Pn.b, [t.k, Pn.d, [8, null], [2, Pn.a]], null, null), (n()(),
            t.Jb(-1, 0, [" vpn_key "])), (n()(),
            t.rb(5, 0, null, null, 1, "h2", [["class", "auth-dialog-header-text"]], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, [" Authorization "])), (n()(),
            t.rb(7, 0, null, null, 6, "div", [["class", "auth-dialog-body"]], null, null, null, null, null)), (n()(),
            t.rb(8, 0, null, null, 3, "p", [["class", "auth-dialog-body-description"]], null, null, null, null, null)), (n()(),
            t.rb(9, 0, null, null, 1, "span", [["class", "auth-dialog-body-description-api"]], null, null, null, null, null)), (n()(),
            t.Jb(10, null, [" ", " "])), (n()(),
            t.Jb(-1, null, [" requires authorization. Enter your credentials to make calls to this API. "])), (n()(),
            t.ib(16777216, null, null, 1, null, Hn)), t.qb(13, 278528, null, 0, E.k, [t.Q, t.N, t.t], {
                ngForOf: [0, "ngForOf"]
            }, null), (n()(),
            t.rb(14, 0, null, null, 3, "div", [["class", "auth-dialog-footer"]], null, null, null, null, null)), (n()(),
            t.rb(15, 0, null, null, 2, "button", [["class", "auth-dialog-dismiss-button"], ["color", "primary"], ["mat-button", ""]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], [[null, "click"]], function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.dismiss() && t),
                t
            }, O.d, O.b)), t.qb(16, 180224, null, 0, M.b, [t.k, P.a, x.f, [2, T.a]], {
                color: [0, "color"]
            }, null), (n()(),
            t.Jb(-1, 0, [" OK "]))], function(n, l) {
                var e = l.component;
                n(l, 3, 0),
                n(l, 13, 0, e.securitySchemeNames),
                n(l, 16, 0, "primary")
            }, function(n, l) {
                var e = l.component;
                n(l, 2, 0, t.Bb(l, 3).inline),
                n(l, 10, 0, e.apiName),
                n(l, 15, 0, t.Bb(l, 16).disabled || null, "NoopAnimations" === t.Bb(l, 16)._animationMode)
            })
        }
        function Rn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "ng-component", [], null, null, null, Un, On)), t.qb(1, 114688, null, 0, Tn, [An.j, f.l, Fn.b, sn], null, null)], function(n, l) {
                n(l, 1, 0)
            }, null)
        }
        var Dn = t.nb("ng-component", Tn, Rn, {}, {}, [])
          , Jn = e("pMnS")
          , Gn = t.pb({
            encapsulation: 2,
            styles: [],
            data: {}
        });
        function jn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, ["Loading..."]))], null, null)
        }
        function Kn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "app-drupal-router", [], null, null, null, jn, Gn)), t.qb(1, 245760, null, 0, a, [f.l, f.a, i.d], null, null)], function(n, l) {
                n(l, 1, 0)
            }, null)
        }
        var Qn = t.nb("app-drupal-router", a, Kn, {}, {}, [])
          , Vn = e("jTcg")
          , Wn = e("xYTU")
          , Xn = e("cPQy")
          , Yn = e("NcP4")
          , $n = t.pb({
            encapsulation: 0,
            styles: [[""]],
            data: {}
        });
        function Zn(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "h2", [], null, null, null, null, null)), (n()(),
            t.Jb(-1, null, ["Page not found"]))], null, null)
        }
        function nl(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "app-page-not-found", [], null, null, null, Zn, $n)), t.qb(1, 114688, null, 0, o, [], null, null)], function(n, l) {
                n(l, 1, 0)
            }, null)
        }
        var ll = t.nb("app-page-not-found", o, nl, {}, {}, [])
          , el = e("vARd")
          , tl = t.pb({
            encapsulation: 2,
            styles: [],
            data: {}
        });
        function ol(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 2, "mat-icon", [["class", "notification-bar-icon message-notification mat-icon"], ["role", "img"]], [[2, "mat-icon-inline", null]], null, null, In.b, In.a)), t.qb(1, 9158656, null, 0, Pn.b, [t.k, Pn.d, [8, null], [2, Pn.a]], null, null), (n()(),
            t.Jb(-1, 0, [" announcement "]))], function(n, l) {
                n(l, 1, 0)
            }, function(n, l) {
                n(l, 0, 0, t.Bb(l, 1).inline)
            })
        }
        function il(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 2, "mat-icon", [["class", "notification-bar-icon error-notification mat-icon"], ["role", "img"]], [[2, "mat-icon-inline", null]], null, null, In.b, In.a)), t.qb(1, 9158656, null, 0, Pn.b, [t.k, Pn.d, [8, null], [2, Pn.a]], null, null), (n()(),
            t.Jb(-1, 0, [" warning "]))], function(n, l) {
                n(l, 1, 0)
            }, function(n, l) {
                n(l, 0, 0, t.Bb(l, 1).inline)
            })
        }
        function al(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 10, "span", [], [[8, "className", 0]], null, null, null, null)), (n()(),
            t.ib(16777216, null, null, 1, null, ol)), t.qb(2, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.ib(16777216, null, null, 1, null, il)), t.qb(4, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            t.rb(5, 0, null, null, 1, "span", [["class", "notification-bar-text"]], null, null, null, null, null)), (n()(),
            t.Jb(6, null, [" ", " "])), (n()(),
            t.rb(7, 0, null, null, 0, "span", [["class", "notification-bar-spacer"]], null, null, null, null, null)), (n()(),
            t.rb(8, 0, null, null, 2, "button", [["class", "notification-bar-dismiss-button"], ["color", "accent"], ["mat-button", ""]], [[8, "disabled", 0], [2, "_mat-animation-noopable", null]], [[null, "click"]], function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.snackBarRef.dismiss() && t),
                t
            }, O.d, O.b)), t.qb(9, 180224, null, 0, M.b, [t.k, P.a, x.f, [2, T.a]], {
                color: [0, "color"]
            }, null), (n()(),
            t.Jb(-1, 0, [" DISMISS "]))], function(n, l) {
                var e = l.component;
                n(l, 2, 0, e.data.category === e.NotificationTypes.MESSAGE),
                n(l, 4, 0, e.data.category === e.NotificationTypes.ERROR),
                n(l, 9, 0, "accent")
            }, function(n, l) {
                var e = l.component;
                n(l, 0, 0, t.tb(1, "notification-bar ", e.className, "")),
                n(l, 6, 0, e.data.message),
                n(l, 8, 0, t.Bb(l, 9).disabled || null, "NoopAnimations" === t.Bb(l, 9)._animationMode)
            })
        }
        function ul(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "ng-component", [], null, null, null, al, tl)), t.qb(1, 114688, null, 0, m, [el.f, el.a], null, null)], function(n, l) {
                n(l, 1, 0)
            }, null)
        }
        var rl = t.nb("ng-component", m, ul, {}, {}, [])
          , cl = e("FbN9")
          , dl = e("8mMr")
          , sl = function() {
            function n(n, l) {
                this.apiKeysUiService = n,
                this.apiFetchService = l,
                this.showAuthorizeButton = !1
            }
            return Object.defineProperty(n.prototype, "currentUrl", {
                set: function(n) {
                    this.onCurrentUrlUpdate(n)
                },
                enumerable: !0,
                configurable: !0
            }),
            n.prototype.ngOnInit = function() {}
            ,
            n.prototype.openAuthorizeModal = function() {
                this.apiKeysUiService.showApiKeysUi()
            }
            ,
            n.prototype.onCurrentUrlUpdate = function(n) {
                var l = this
                  , e = B.getApiIdFromUrl(n);
                null != e && this.apiFetchService.fetch(e, null).then(function(n) {
                    var e = n.apiSpec.components && n.apiSpec.components.securitySchemes;
                    l.showAuthorizeButton = e && Object.keys(e).length > 0
                })
            }
            ,
            n
        }()
          , bl = t.pb({
            encapsulation: 0,
            styles: [[".context-bar-spacer[_ngcontent-%COMP%]{-webkit-box-flex:1;flex:1 1 auto}"]],
            data: {}
        });
        function pl(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 2, "a", [["class", "context-bar-button"], ["id", "context-bar-authorize"], ["mat-raised-button", ""]], [[1, "tabindex", 0], [1, "disabled", 0], [1, "aria-disabled", 0], [2, "_mat-animation-noopable", null]], [[null, "click"]], function(n, l, e) {
                var o = !0
                  , i = n.component;
                return "click" === l && (o = !1 !== t.Bb(n, 1)._haltDisabledEvents(e) && o),
                "click" === l && (o = !1 !== i.openAuthorizeModal() && o),
                o
            }, O.c, O.a)), t.qb(1, 180224, null, 0, M.a, [P.a, x.f, t.k, [2, T.a]], null, null), (n()(),
            t.Jb(-1, 0, [" AUTHORIZE "]))], null, function(n, l) {
                n(l, 0, 0, t.Bb(l, 1).disabled ? -1 : t.Bb(l, 1).tabIndex || 0, t.Bb(l, 1).disabled || null, t.Bb(l, 1).disabled.toString(), "NoopAnimations" === t.Bb(l, 1)._animationMode)
            })
        }
        function hl(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 5, "mat-toolbar", [["class", "context-bar mat-toolbar"], ["color", "primary"]], [[2, "mat-toolbar-multiple-rows", null], [2, "mat-toolbar-single-row", null]], null, null, cl.b, cl.a)), t.qb(1, 4243456, null, 1, dl.a, [t.k, P.a, E.d], {
                color: [0, "color"]
            }, null), t.Hb(603979776, 1, {
                _toolbarRows: 1
            }), (n()(),
            t.rb(3, 0, null, 0, 0, "div", [["class", "context-bar-spacer"]], null, null, null, null, null)), (n()(),
            t.ib(16777216, null, 0, 1, null, pl)), t.qb(5, 16384, null, 0, E.l, [t.Q, t.N], {
                ngIf: [0, "ngIf"]
            }, null)], function(n, l) {
                var e = l.component;
                n(l, 1, 0, "primary"),
                n(l, 5, 0, e.showAuthorizeButton)
            }, function(n, l) {
                n(l, 0, 0, t.Bb(l, 1)._toolbarRows.length > 0, 0 === t.Bb(l, 1)._toolbarRows.length)
            })
        }
        var ml = t.pb({
            encapsulation: 0,
            styles: [[""]],
            data: {}
        });
        function fl(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 4, "div", [["class", "main"], ["id", "docs"]], null, null, null, null, null)), (n()(),
            t.rb(1, 0, null, null, 1, "app-context-bar", [], null, null, null, hl, bl)), t.qb(2, 114688, null, 0, sl, [Fn.c, Fn.b], {
                currentUrl: [0, "currentUrl"]
            }, null), (n()(),
            t.rb(3, 16777216, null, null, 1, "router-outlet", [], null, null, null, null, null)), t.qb(4, 212992, null, 0, f.p, [f.b, t.Q, t.j, [8, null], t.h], null, null)], function(n, l) {
                n(l, 2, 0, l.component.currentUrl),
                n(l, 4, 0)
            }, null)
        }
        function gl(n) {
            return t.Lb(0, [(n()(),
            t.rb(0, 0, null, null, 1, "app-root", [], null, null, null, fl, ml)), t.qb(1, 114688, null, 0, C, [y, h, v, el.b, f.l, r], null, null)], function(n, l) {
                n(l, 1, 0)
            }, null)
        }
        var Bl = t.nb("app-root", C, gl, {}, {}, [])
          , _l = e("eDkP")
          , yl = e("M2Lx")
          , vl = e("ZYjt")
          , Cl = e("NSYL")
          , wl = function() {
            return function() {}
        }()
          , Sl = e("s4kO")
          , kl = e("yGWI")
          , ql = function() {
            function n(n, l, e) {
                this.site = n,
                this.router = l,
                this.logger = e,
                this.cache = {}
            }
            return n.prototype.fetch = function(l, e) {
                var t = this;
                return null == this.cache[l] && (this.cache[l] = this.site.getSpec(l).pipe(Object(Sl.a)(1), Object(kl.a)())),
                this.cache[l].toPromise().catch(function(n) {
                    return t.router.navigate(["/docs/not-found"]),
                    t.logger.error(n),
                    null
                }).then(function(l) {
                    return Fn.j.create(l || n.EMPTY_SPEC, n.METADATA, [n.SPEC_VERSION], n.USER_PERMISSIONS)
                })
            }
            ,
            n.prototype.fetchAllVersions = function(l) {
                return this.fetch(l, n.SPEC_VERSION).then(function(l) {
                    var e;
                    return (e = {})[n.SPEC_VERSION] = l,
                    e
                })
            }
            ,
            n.prototype.getApiWritePermission = function(n) {
                return Promise.resolve(!1)
            }
            ,
            n.SPEC_VERSION = "1",
            n.EMPTY_SPEC = {
                swagger: "2.0",
                info: {
                    title: "",
                    version: ""
                },
                paths: {}
            },
            n.METADATA = {
                api: {
                    bypassPermissionsChecks: !1,
                    customContentInfo: {
                        settings: {
                            gitUrl: null
                        },
                        nav: {
                            ordering: ["Resources", "Api reference"]
                        }
                    }
                },
                version: {
                    specType: Fn.d.OPEN_API
                }
            },
            n.USER_PERMISSIONS = {
                canWrite: !1,
                canRead: !0
            },
            n
        }()
          , zl = function() {
            function n() {}
            return n.prototype.canViewSite = function() {
                return !0
            }
            ,
            n.prototype.redirectToLogin = function() {
                throw new Error("Not implemented")
            }
            ,
            n
        }()
          , Il = function() {
            function n() {}
            return n.prototype.getCustomContent = function(n, l, e) {
                return Promise.reject("Invalid page")
            }
            ,
            n
        }()
          , Pl = function() {
            function n() {}
            return n.prototype.getImageSrc = function(n, l) {
                return Promise.resolve("")
            }
            ,
            n
        }()
          , Tl = function() {
            function n() {}
            return n.prototype.getRouteSecurityWarnings = function(n, l, e) {
                return []
            }
            ,
            n
        }()
          , Al = {}
          , Fl = function() {
            return function() {}
        }()
          , Ol = e("vGXY")
          , Ml = e("ihYY")
          , xl = e("wPnI")
          , El = function(n) {
            function l(l, e, t) {
                var o = n.call(this, l) || this;
                return o.authTokenCacheService = e,
                o.router = t,
                o
            }
            return u.d(l, n),
            Object.defineProperty(l.prototype, "proxyHost", {
                get: function() {
                    return null
                },
                set: function(n) {},
                enumerable: !0,
                configurable: !0
            }),
            l.prototype.addAuthToRequest = function(n, l, e) {
                var t = B.getApiIdFromUrl(this.router.url);
                l.headers.append("Content-Type", "application/json");
                for (var o = 0, i = Object.keys(e); o < i.length; o++) {
                    var a = i[o]
                      , u = this.authTokenCacheService.getTokenFromCache(t, a);
                    null != u ? u.attachToRequest(l) : console.warn("No settings for security definition " + a + ", skipping.")
                }
                return Promise.resolve()
            }
            ,
            l
        }(xl.e)
          , Nl = e("v9Dh")
          , Ll = e("4epT")
          , Hl = function() {
            function n(n) {
                this.dialog = n
            }
            return n.prototype.isApiKeyFeatureEnabled = function() {
                return !0
            }
            ,
            n.prototype.showApiKeysUi = function() {
                this.dialog.open(Tn)
            }
            ,
            n
        }()
          , Ul = e("4c35")
          , Rl = e("9It4")
          , Dl = function() {
            return function() {}
        }()
          , Jl = e("r43C")
          , Gl = e("Nsh5")
          , jl = e("FVSy")
          , Kl = e("de3e")
          , Ql = e("LC5p")
          , Vl = e("0/Q6")
          , Wl = e("La40")
          , Xl = t.ob(b, [C], function(n) {
            return t.yb([t.zb(512, t.j, t.db, [[8, [w.a, Dn, Jn.a, Qn, Vn.a, Vn.b, Vn.c, Vn.d, Vn.e, Vn.f, Vn.g, Vn.h, Vn.i, Vn.j, Vn.k, Wn.a, Wn.b, Xn.c, Xn.d, Yn.a, ll, rl, Bl]], [3, t.j], t.y]), t.zb(5120, t.v, t.mb, [[3, t.v]]), t.zb(4608, E.n, E.m, [t.v, [2, E.x]]), t.zb(4608, _l.c, _l.c, [_l.i, _l.e, t.j, _l.h, _l.f, t.r, t.A, E.d, I.b, [2, E.g]]), t.zb(5120, _l.j, _l.k, [_l.c]), t.zb(5120, An.b, An.c, [_l.c]), t.zb(135680, An.d, An.d, [_l.c, t.r, [2, E.g], [2, An.a], An.b, [3, An.d], _l.e]), t.zb(4608, yl.c, yl.c, []), t.zb(4608, z.b, z.b, []), t.zb(5120, en.a, en.b, [_l.c]), t.zb(4608, S.z, S.z, []), t.zb(5120, t.c, t.jb, []), t.zb(5120, t.t, t.kb, []), t.zb(5120, t.u, t.lb, []), t.zb(4608, vl.c, vl.l, [E.d]), t.zb(6144, t.I, null, [vl.c]), t.zb(4608, vl.f, z.c, [[2, z.g], [2, z.l]]), t.zb(5120, vl.d, function(n, l, e, t, o, i, a, u) {
                return [new vl.j(n,l,e), new vl.o(t), new vl.n(o,i,a,u)]
            }, [E.d, t.A, t.C, E.d, E.d, vl.f, t.eb, [2, vl.g]]), t.zb(4608, vl.e, vl.e, [vl.d, t.A]), t.zb(135680, vl.m, vl.m, [E.d]), t.zb(4608, vl.k, vl.k, [vl.e, vl.m]), t.zb(5120, Cl.a, T.e, []), t.zb(5120, Cl.c, T.f, []), t.zb(4608, Cl.b, T.d, [E.d, Cl.a, Cl.c]), t.zb(5120, t.G, T.g, [vl.k, Cl.b, t.A]), t.zb(6144, vl.p, null, [vl.m]), t.zb(4608, t.O, t.O, [t.A]), t.zb(5120, f.a, f.A, [f.l]), t.zb(4608, f.e, f.e, []), t.zb(6144, f.g, null, [f.e]), t.zb(135680, f.q, f.q, [f.l, t.x, t.i, t.r, f.g]), t.zb(4608, f.f, f.f, []), t.zb(5120, f.E, f.w, [f.l, E.t, f.h]), t.zb(5120, f.i, f.D, [f.B]), t.zb(5120, t.b, function(n) {
                return [n]
            }, [f.i]), t.zb(4608, un.m, un.m, []), t.zb(6144, un.k, null, [un.m]), t.zb(4608, un.i, un.i, [un.k]), t.zb(6144, un.b, null, [un.i]), t.zb(4608, un.f, un.l, [un.b, t.r]), t.zb(4608, un.c, un.c, [un.f]), t.zb(4608, i.e, i.e, [un.c]), t.zb(4608, i.d, i.d, [i.e, i.b, t.C]), t.zb(4608, y, y, [i.d]), t.zb(4608, Fn.b, ql, [y, f.l, i.d]), t.zb(4608, Fn.K, Fn.K, [Fn.b]), t.zb(4608, Fn.e, zl, []), t.zb(4608, Fn.L, Fn.L, [Fn.e]), t.zb(4608, Fn.O, Fn.O, []), t.zb(4608, Fn.h, Fn.h, []), t.zb(4608, Fn.J, Fn.J, [Ol.d]), t.zb(4608, Fn.i, Pl, []), t.zb(4608, Fn.cb, Fn.cb, [Fn.J, f.l, Fn.i]), t.zb(4608, on.c, on.c, []), t.zb(4608, on.i, on.b, []), t.zb(5120, on.l, on.m, []), t.zb(4608, on.k, on.k, [on.c, on.i, on.l]), t.zb(4608, on.h, on.a, []), t.zb(5120, on.e, on.n, [on.k, on.h]), t.zb(4608, S.f, S.f, []), t.zb(4608, Ml.b, T.c, [t.G, vl.b]), t.zb(4608, xl.m, xl.m, []), t.zb(4608, sn, sn, []), t.zb(4608, xl.e, El, [on.e, sn, f.l]), t.zb(6144, xl.d, null, [xl.e]), t.zb(4608, xl.b, xl.z, []), t.zb(4608, xl.t, xl.l, [xl.a]), t.zb(4608, xl.h, xl.A, []), t.zb(4608, xl.i, xl.j, []), t.zb(4608, un.j, un.p, [E.d, t.C, un.n]), t.zb(4608, un.q, un.q, [un.j, un.o]), t.zb(5120, un.a, function(n) {
                return [n]
            }, [un.q]), t.zb(5120, Nl.b, Nl.c, [_l.c]), t.zb(5120, Ll.c, Ll.a, [[3, Ll.c]]), t.zb(4608, Fn.c, Hl, [An.d]), t.zb(4608, Fn.f, Il, []), t.zb(4608, Fn.k, Tl, []), t.zb(4608, i.a, i.a, [i.e, t.C]), t.zb(4608, dn, dn, [un.c]), t.zb(5120, r, d, []), t.zb(5120, c, s, []), t.zb(4608, h, h, []), t.zb(4608, v, v, [r]), t.zb(1073742336, E.c, E.c, []), t.zb(1073742336, I.a, I.a, []), t.zb(1073742336, Ul.g, Ul.g, []), t.zb(1073742336, P.b, P.b, []), t.zb(1073742336, tn.c, tn.c, []), t.zb(1073742336, _l.g, _l.g, []), t.zb(1073742336, z.l, z.l, [[2, z.d], [2, vl.g]]), t.zb(1073742336, An.i, An.i, []), t.zb(1073742336, F.c, F.c, []), t.zb(1073742336, yl.d, yl.d, []), t.zb(1073742336, q.d, q.d, []), t.zb(1073742336, A.b, A.b, []), t.zb(1073742336, Pn.c, Pn.c, []), t.zb(1073742336, z.u, z.u, []), t.zb(1073742336, M.c, M.c, []), t.zb(1073742336, z.s, z.s, []), t.zb(1073742336, z.q, z.q, []), t.zb(1073742336, en.d, en.d, []), t.zb(1073742336, nn.c, nn.c, []), t.zb(1073742336, Rl.a, Rl.a, []), t.zb(1073742336, S.x, S.x, []), t.zb(1073742336, S.k, S.k, []), t.zb(1073742336, Dl, Dl, []), t.zb(1024, t.l, vl.q, []), t.zb(1024, t.z, function() {
                return [f.v()]
            }, []), t.zb(512, f.B, f.B, [t.r]), t.zb(1024, t.d, function(n, l) {
                return [vl.r(n), f.C(l)]
            }, [[2, t.z], f.B]), t.zb(512, t.e, t.e, [[2, t.d]]), t.zb(131584, t.g, t.g, [t.A, t.eb, t.r, t.l, t.j, t.e]), t.zb(1073742336, t.f, t.f, [t.g]), t.zb(1073742336, vl.a, vl.a, [[3, vl.a]]), t.zb(1024, f.u, f.y, [[3, f.l]]), t.zb(512, f.s, f.c, []), t.zb(512, f.b, f.b, []), t.zb(256, f.h, {}, []), t.zb(1024, E.h, f.x, [E.s, [2, E.a], f.h]), t.zb(512, E.g, E.g, [E.h]), t.zb(512, t.i, t.i, []), t.zb(512, t.x, t.L, [t.i, [2, t.M]]), t.zb(1024, f.j, function() {
                return [[{
                    path: "api/:fileId",
                    component: a
                }], [{
                    path: "docs/:apiId/:versionId",
                    component: Fn.I,
                    resolve: {
                        apiInfo: Fn.K
                    },
                    canActivate: [Fn.L],
                    data: {
                        isDocsRoute: !0
                    },
                    children: [{
                        path: "overview",
                        resolve: {
                            apiInfo: Fn.K
                        },
                        component: Fn.M
                    }, {
                        path: "search",
                        component: Fn.N,
                        canActivate: [Fn.O]
                    }, {
                        path: "routes",
                        resolve: {
                            apiInfo: Fn.K
                        },
                        children: [{
                            path: "**",
                            component: Fn.P
                        }]
                    }, {
                        path: "tag/:tagName",
                        resolve: {
                            apiInfo: Fn.K
                        },
                        component: Fn.Q
                    }, {
                        path: "types/:typeid",
                        resolve: {
                            apiInfo: Fn.K
                        },
                        component: Fn.R
                    }, {
                        path: "methods",
                        resolve: {
                            apiInfo: Fn.K
                        },
                        children: [{
                            path: "**",
                            component: Fn.S
                        }]
                    }, {
                        path: "messages",
                        resolve: {
                            apiInfo: Fn.K
                        },
                        children: [{
                            path: "**",
                            component: Fn.T
                        }]
                    }, {
                        path: "enums",
                        resolve: {
                            apiInfo: Fn.K
                        },
                        children: [{
                            path: "**",
                            component: Fn.U
                        }]
                    }, {
                        path: "introduction",
                        resolve: {
                            apiInfo: Fn.K
                        },
                        component: Fn.V
                    }, {
                        path: "c",
                        children: [{
                            path: "**",
                            resolve: {
                                apiInfo: Fn.K
                            },
                            component: Fn.W,
                            data: {
                                name: "CustomContent"
                            }
                        }]
                    }, {
                        path: "",
                        redirectTo: "introduction",
                        pathMatch: "full"
                    }]
                }]]
            }, []), t.zb(1024, f.l, f.z, [t.g, f.s, f.b, E.g, t.r, t.x, t.i, f.j, f.h, [2, f.r], [2, f.k]]), t.zb(1073742336, f.o, f.o, [[2, f.u], [2, f.l]]), t.zb(1073742336, wl, wl, []), t.zb(1073742336, Fn.l, Fn.l, []), t.zb(1073742336, Ol.c, Ol.c, []), t.zb(1073742336, Fn.Z, Fn.Z, []), t.zb(1073742336, Fn.ab, Fn.ab, []), t.zb(1073742336, Fn.Y, Fn.Y, []), t.zb(1073742336, Fn.X, Fn.X, []), t.zb(1073742336, on.f, on.f, []), t.zb(1073742336, z.m, z.m, []), t.zb(1073742336, Jl.b, Jl.b, []), t.zb(1073742336, Gl.h, Gl.h, []), t.zb(1073742336, Fn.o, Fn.o, []), t.zb(1073742336, jl.d, jl.d, []), t.zb(1073742336, Kl.c, Kl.c, []), t.zb(1073742336, Ql.a, Ql.a, []), t.zb(1073742336, Vl.c, Vl.c, []), t.zb(1073742336, x.a, x.a, []), t.zb(1073742336, Wl.k, Wl.k, []), t.zb(1073742336, S.t, S.t, []), t.zb(1073742336, el.e, el.e, []), t.zb(1073742336, xl.n, xl.n, []), t.zb(1073742336, T.b, T.b, []), t.zb(1073742336, xl.w, xl.w, []), t.zb(1073742336, xl.f, xl.f, []), t.zb(1073742336, Fn.t, Fn.t, []), t.zb(1073742336, Fn.s, Fn.s, []), t.zb(1073742336, Fn.r, Fn.r, []), t.zb(1073742336, un.e, un.e, []), t.zb(1073742336, un.d, un.d, []), t.zb(1073742336, Nl.e, Nl.e, []), t.zb(1073742336, Ll.d, Ll.d, []), t.zb(1073742336, Fn.H, Fn.H, []), t.zb(1073742336, Fn.g, Fn.g, []), t.zb(1073742336, dl.b, dl.b, []), t.zb(1073742336, Fl, Fl, []), t.zb(1073742336, i.c, i.c, []), t.zb(1073742336, b, b, [f.l]), t.zb(256, t.cb, !0, []), t.zb(256, i.b, {
                level: 7,
                serverLogLevel: 7
            }, []), t.zb(256, T.a, "BrowserAnimations", []), t.zb(256, xl.a, void 0, []), t.zb(256, xl.g, !1, []), t.zb(256, un.n, "XSRF-TOKEN", []), t.zb(256, un.o, "X-XSRF-TOKEN", []), t.zb(256, Fn.a, Al, [])])
        });
        Object(t.V)(),
        vl.i().bootstrapModuleFactory(Xl).catch(function(n) {
            return console.error(n)
        })
    }
}, [[1, 0, 5]]]);
;
