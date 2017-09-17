/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 16.3.0
 */
Bridge.assembly("CirnoGame", function ($asm, globals) {
    "use strict";

    Bridge.define("CirnoGame.GameMode", {
        statics: {
            fields: {
                TeamBattle: null,
                DeathMatch: null,
                gameModes: null
            },
            ctors: {
                init: function () {
                    Bridge.ready(this.init);
                }
            },
            methods: {
                GetGameModesOfType: function (type) {
                    return new (System.Collections.Generic.List$1(CirnoGame.GameMode)).$ctor1(System.Linq.Enumerable.from(CirnoGame.GameMode.gameModes).where(function (G) {
                            return G.ModeType === type;
                        }));
                },
                GetGameModeByName: function (name) {
                    var ret = new (System.Collections.Generic.List$1(CirnoGame.GameMode)).$ctor1(System.Linq.Enumerable.from(CirnoGame.GameMode.gameModes).where(function (G) {
                            return Bridge.referenceEquals(G.Name, name);
                        }));
                    if (ret.Count > 0) {
                        return ret.getItem(0);
                    }
                    return null;
                },
                init: function () {
                    if (CirnoGame.GameMode.TeamBattle == null) {
                        CirnoGame.GameMode.gameModes = new (System.Collections.Generic.List$1(CirnoGame.GameMode)).ctor();
                        CirnoGame.GameMode.TeamBattle = new CirnoGame.GameMode("Team Battle");
                        CirnoGame.GameMode.TeamBattle.Description = "2 teams battle with limited lives\nuntil only 1 team remains.";
                        CirnoGame.GameMode.DeathMatch = new CirnoGame.GameMode("Death Match");
                        CirnoGame.GameMode.DeathMatch.Description = "A free for all match with\nlimited lives.";
                        CirnoGame.GameMode.DeathMatch.Teams = false;
                    }
                }
            }
        },
        $entryPoint: true,
        props: {
            Teams: false,
            StartingLives: 0,
            Survival: false,
            AllowOnlinePlay: false,
            AllowCharacterSelect: false,
            NumberOfPlayers: 0,
            RespawnTime: 0,
            Name: null,
            ModeType: 0,
            unlocked: false,
            Description: null
        },
        ctors: {
            ctor: function (name) {
                this.$initialize();
                this.Teams = true;
                this.StartingLives = 3;
                this.Survival = true;
                this.AllowOnlinePlay = true;
                this.AllowCharacterSelect = true;
                this.NumberOfPlayers = 6;
                this.RespawnTime = 390;
                this.Name = name;
                this.ModeType = CirnoGame.GameMode.ModeTypes.Skirmish;
                this.Description = System.String.concat("Missing description for ", name);
                this.unlocked = true;
                CirnoGame.GameMode.gameModes.add(this);
            }
        }
    });

    Bridge.define("CirnoGame.EntityBehavior", {
        fields: {
            enabled: false,
            FramesPerTick: 0,
            entity: null
        },
        props: {
            BehaviorName: null
        },
        ctors: {
            init: function () {
                this.enabled = true;
                this.FramesPerTick = 0;
            },
            ctor: function (entity) {
                this.$initialize();
                this.entity = entity;
                if (Bridge.referenceEquals(this.BehaviorName, "") || this.BehaviorName == null) {
                    var test = Bridge.getType(this);
                    var FN = test["$$fullname"];
                    //Helper.Log("FN:" + FN);
                    var s = FN.split(".");
                    this.BehaviorName = s[System.Array.index(((s.length - 1) | 0), s)];
                    //BehaviorName = GetType().FullName;
                    //GetType().GetClassName

                }
            }
        },
        methods: {
            Update: function () {

            },
            Draw: function (g) { },
            SendCustomEvent: function (evt, triggerflush) {
                if (triggerflush === void 0) { triggerflush = false; }
                var D = { };
                D.I = this.entity.ID;
                D.D = evt;
                //D.T = this.GetType().FullName;
                D.T = this.BehaviorName;
                this.entity.Game.SendEvent("CBE", D, triggerflush);
            },
            CustomEvent: function (evt) {

            }
        }
    });

    Bridge.define("CirnoGame.Animation", {
        fields: {
            Images: null,
            _currentImage: null,
            CurrentFrame: 0,
            ImageSpeed: 0,
            Position: null,
            AnimationTimeElapsed: 0,
            StretchWidth: 0,
            StretchHeight: 0,
            Rotation: 0,
            Alpha: 0,
            Looping: false,
            Looped: false,
            FrameChanged: false,
            Flipped: false,
            _transformed: false,
            _shadow: 0,
            _shadowColor: null,
            BufferNeedsRedraw: false,
            _hueColor: null,
            _hueRecolorStrength: 0,
            _buffer: null,
            _bg: null
        },
        props: {
            CurrentImage: {
                get: function () {
                    return this._currentImage;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._currentImage, value)) {
                        this.BufferNeedsRedraw = true;
                    }
                    this._currentImage = value;

                }
            },
            X: {
                get: function () {
                    return this.Position.X;
                },
                set: function (value) {
                    this.Position.X = value;
                }
            },
            Y: {
                get: function () {
                    return this.Position.Y;
                },
                set: function (value) {
                    this.Position.Y = value;
                }
            },
            Shadow: {
                get: function () {
                    return this._shadow;
                },
                set: function (value) {
                    if (this._shadow !== value) {
                        this._shadow = value;
                        this.BufferNeedsRedraw = true;
                    }
                }
            },
            Shadowcolor: {
                get: function () {
                    return this._shadowColor;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._shadowColor, value)) {
                        this._shadowColor = value;
                        this.BufferNeedsRedraw = true;
                    }
                }
            },
            HueColor: {
                get: function () {
                    return this._hueColor;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._hueColor, value)) {
                        this.BufferNeedsRedraw = true;
                    }
                    this._hueColor = value;

                }
            },
            HueRecolorStrength: {
                get: function () {
                    return this._hueRecolorStrength;
                },
                set: function (value) {
                    if (this._hueRecolorStrength !== value) {
                        this.BufferNeedsRedraw = true;
                    }
                    this._hueRecolorStrength = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.StretchWidth = 0;
                this.StretchHeight = 0;
                this.Rotation = 0;
                this.Alpha = 1;
                this.Looping = true;
                this.Looped = false;
                this.FrameChanged = false;
                this.Flipped = false;
                this._transformed = false;
                this.BufferNeedsRedraw = true;
            },
            ctor: function (data) {
                this.$initialize();
                this.Images = data;
                if (this.Images == null) {
                    this.Images = new (System.Collections.Generic.List$1(HTMLImageElement)).ctor();
                }
                this.ImageSpeed = 1.0;
                this.Position = new CirnoGame.Vector2();
                this.AnimationTimeElapsed = 0;
                this.Shadow = 0;
                this.Shadowcolor = "#FFFFFF";
                this.HueColor = "";
                this.HueRecolorStrength = 0.6;
                this._buffer = document.createElement("canvas");
                this._bg = this._buffer.getContext("2d");
                if (this.Images.Count > 0) {
                    this.SetImage();
                }
            }
        },
        methods: {
            Update: function () {
                var LI = this.CurrentImage;
                var last = Bridge.Int.clip32(this.CurrentFrame);
                this.CurrentFrame += this.ImageSpeed;
                var current = Bridge.Int.clip32(this.CurrentFrame);
                if (current !== last) {
                    if (this.Images.Count > 0) {
                        while (current >= this.Images.Count && current > 0) {
                            if (this.Looping) {
                                current = (current - this.Images.Count) | 0;
                                this.CurrentFrame -= this.Images.Count;
                            } else {
                                this.CurrentFrame -= this.ImageSpeed;
                            }
                        }
                        while (current < 0) {
                            current = (current + this.Images.Count) | 0;
                            this.CurrentFrame += this.Images.Count;
                        }
                    }
                    this.SetImage();
                }

                this.Looped = false;
                if (!Bridge.referenceEquals(LI, this.CurrentImage)) {
                    this.FrameChanged = true;
                    if ((this.ImageSpeed > 0 && current === 0) || ((this.ImageSpeed < 0 && current === ((this.Images.Count - 1) | 0)))) {
                        this.Looped = true;
                    }
                } else {
                    this.FrameChanged = false;
                }
                this.AnimationTimeElapsed = (this.AnimationTimeElapsed + 1) | 0;
            },
            ChangeAnimation: function (ani, reset) {
                if (reset === void 0) { reset = true; }
                if (reset) {
                    this.CurrentFrame = 0;
                    this.AnimationTimeElapsed = 0;
                }
                this.Images = ani;
                //CurrentImage = Images[(int)CurrentFrame];
                this.SetImage();
            },
            SetImage: function () {
                if (this.Images.Count < 2) {
                    this.CurrentFrame = 0;
                } else {
                    var ln = this.Images.Count;
                    while (this.CurrentFrame < 0) {
                        this.CurrentFrame += ln;
                    }
                    while (this.CurrentFrame >= ln) {
                        this.CurrentFrame -= ln;
                    }
                }
                var current = Bridge.Int.clip32(this.CurrentFrame);
                if (current >= 0 && current < this.Images.Count) {
                    this.CurrentImage = this.Images.getItem(current);
                }
            },
            Draw: function (g) {
                this.Draw$1(g, this.Position);
            },
            Draw$1: function (g, position) {
                var x = position.X;
                var y = position.Y;
                if (this.CurrentImage == null) {
                    var current = Bridge.Int.clip32(this.CurrentFrame);
                    if (current >= 0 && current < this.Images.Count) {
                        this.CurrentImage = this.Images.getItem(current);
                    }
                    if (this.CurrentImage == null) {
                        return;
                    }
                }
                var X = x;
                var Y = y;
                var lastalpha = g.globalAlpha;
                var centered = false;
                var useBuffer = false;
                if (!Bridge.referenceEquals(this.HueColor, "")) {
                    if (this.BufferNeedsRedraw) {
                        var adv = true;
                        this._bg.globalCompositeOperation = "source-over";
                        this._buffer.width = this.CurrentImage.width;
                        this._buffer.height = this.CurrentImage.height;
                        this._bg.drawImage(this.CurrentImage, 0.0, 0.0);
                        this._bg.globalAlpha = this.HueRecolorStrength;
                        this._bg.globalCompositeOperation = "hue";
                        this._bg.fillStyle = this.HueColor;
                        this._bg.fillRect(0, 0, this._buffer.width, this._buffer.height);

                        if (adv) {
                            this._bg.globalAlpha = (1 + this.HueRecolorStrength) / 2.0;
                            this._bg.globalCompositeOperation = "source-over";
                            this._bg.fillRect(0, 0, this._buffer.width, this._buffer.height);
                        }

                        this._bg.globalAlpha = 1;
                        if (adv) {
                            this._bg.globalCompositeOperation = "luminosity";
                            this._bg.drawImage(this.CurrentImage, 0.0, 0.0);
                        }
                        this._bg.globalCompositeOperation = 'destination-in';
                        this._bg.drawImage(this.CurrentImage, 0.0, 0.0);
                        if (adv) {
                            this._bg.globalCompositeOperation = "hue";
                            this._bg.globalAlpha = this.HueRecolorStrength * 0.4;
                            this._bg.drawImage(this.CurrentImage, 0.0, 0.0);
                        }

                    }
                    useBuffer = true;
                }
                if (this.Alpha < 1) {
                    if (this.Alpha <= 0) {
                        return;
                    }
                    g.globalAlpha = g.globalAlpha * this.Alpha;
                }
                //if (rotation != 0)
                {
                    var x2 = this.CurrentImage.width / 2.0;
                    var y2 = this.CurrentImage.height / 2.0;

                    X = -x2;
                    Y = -y2;
                    if (!this._transformed) {
                        g.save();
                        this._transformed = true;
                    }
                    g.translate(x + x2, y + y2);
                    centered = true;
                    g.rotate(this.Rotation);
                }
                if (this.Flipped) {
                    if (!this._transformed) {
                        g.save();
                        this._transformed = true;
                    }
                    g.scale(-1, 1);
                    //don't translate if it's centered.
                    if (!centered) {
                        g.translate(this.CurrentImage.width, 0);
                    }
                }
                if (this.Shadow > 0) {
                    g.shadowBlur = this.Shadow;
                    g.shadowColor = this.Shadowcolor;
                    if (!useBuffer && this.BufferNeedsRedraw) {
                        this._bg.shadowBlur = 0;
                        this._buffer.width = this.CurrentImage.width;
                        this._buffer.height = this.CurrentImage.height;
                        this._bg.drawImage(this.CurrentImage, 0.0, 0.0);
                        useBuffer = true;
                        //BufferNeedsRedraw = true;
                    }
                    useBuffer = true;
                    //if ((useBuffer && BufferNeedsRedraw) || Rotation!=0 || true)
                    if (this.BufferNeedsRedraw) {
                        var C = CirnoGame.Helper.CloneCanvas(this._buffer);
                        var CG = CirnoGame.Helper.GetContext(C);
                        this._buffer.width = (this._buffer.width + Bridge.Int.clip32(this.Shadow * 2)) | 0;
                        this._buffer.height = (this._buffer.height + Bridge.Int.clip32(this.Shadow * 2)) | 0;
                        this._bg.shadowBlur = this.Shadow;
                        this._bg.shadowColor = this.Shadowcolor;
                        this.drawWithShadows(this._bg, C, this.Shadow, this.Shadow, 0, 0, this.Shadow / 3.0);
                        useBuffer = true;
                    }
                    X -= this.Shadow;
                    Y -= this.Shadow;
                    g.shadowBlur = 0;
                }

                if (this.StretchWidth === 0 && this.StretchHeight === 0) {
                    if (this.Shadow > 0 && false) {
                        var I = this.CurrentImage;
                        if (useBuffer) {
                            I = this._buffer;
                        }
                        this.drawWithShadows(g, I, X, Y, 0, 0, this.Shadow / 3);
                    } else {
                        if (!useBuffer) {
                            g.drawImage(this.CurrentImage, X, Y);
                        } else {
                            g.drawImage(this._buffer, X, Y);
                        }
                    }
                } else {
                    if (this.Shadow > 0 && false) {
                        var I1 = this.CurrentImage;
                        if (useBuffer) {
                            I1 = this._buffer;
                        }
                        this.drawWithShadows(g, I1, X, Y, this.StretchWidth, this.StretchHeight, this.Shadow / 3);
                    } else {
                        if (!useBuffer) {
                            g.drawImage(this.CurrentImage, X, Y, this.StretchWidth, this.StretchHeight);
                        } else {
                            g.drawImage(this._buffer, X, Y, this.StretchWidth, this.StretchHeight);
                        }
                    }
                }
                if (this._transformed) {
                    g.restore();
                    this._transformed = false;
                }
                if (this.Shadow > 0) {
                    g.shadowBlur = 0;
                }
                if (this.Alpha < 1) {
                    g.globalAlpha = lastalpha;
                }
                this.BufferNeedsRedraw = false;
            },
            drawWithShadows: function (g, I, X, Y, W, H, size) {
                if (W === 0) {
                    W = I.width;
                    H = I.height;
                }
                g.shadowOffsetX = -size;
                g.drawImage(I, X, Y, W, H);
                g.shadowOffsetX = size;
                g.drawImage(I, X, Y, W, H);
                g.shadowOffsetX = 0;
                g.shadowOffsetY = -size;
                g.drawImage(I, X, Y, W, H);
                g.shadowOffsetY = size;
                g.drawImage(I, X, Y, W, H);

                g.shadowOffsetY = 0;
            }
        }
    });

    Bridge.define("CirnoGame.AnimationLoader", {
        statics: {
            fields: {
                __this: null
            },
            props: {
                _this: {
                    get: function () {
                        if (CirnoGame.AnimationLoader.__this == null) {
                            CirnoGame.AnimationLoader.__this = new CirnoGame.AnimationLoader();
                            throw new System.Exception("Animation loader not initiated.");
                        }
                        return CirnoGame.AnimationLoader.__this;
                    }
                }
            },
            methods: {
                Init: function (Archive) {
                    CirnoGame.AnimationLoader.__this = new CirnoGame.AnimationLoader();
                    CirnoGame.AnimationLoader.__this.Archive = Archive;
                },
                Get: function (ani) {
                    return CirnoGame.AnimationLoader._this.GetAnimation(ani);
                }
            }
        },
        fields: {
            _data: null,
            Archive: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this._data = new (System.Collections.Generic.Dictionary$2(System.String,System.Collections.Generic.List$1(HTMLImageElement)))();
            }
        },
        methods: {
            GetAnimation: function (ani) {
                if (this._data.containsKey(ani)) {
                    return this._data.get(ani);
                }
                var A = new (System.Collections.Generic.List$1(HTMLImageElement)).ctor();
                var I = this.Archive.GetImage(System.String.concat(ani, ".png"));
                if (I != null) {
                    A.add(I);
                } else {
                    var j = 0;
                    var Sani = System.String.concat(ani, "_");
                    while (true) {
                        I = this.Archive.GetImage(System.String.concat(Sani, (Bridge.identity(j, (j = (j + 1) | 0))), ".png"));
                        if (I == null) {
                            break;
                        } else {
                            A.add(I);
                        }
                    }
                    /* do
                    {
                       I = Archive.GetImage(ani + "_" + j + ".png");
                       if (I != null)
                       {
                           A.Add(I);
                       }
                    } while (I != null);*/
                }
                this._data.set(ani, A);
                return A;
            }
        }
    });

    Bridge.define("CirnoGame.App", {
        main: function Main () {
            //USE THE JSON ZIP ARCHIVE FEATURE FROM BNTEST FOR LOADING IMAGES AND FILES.

            document.body.style.cssText = "overflow: hidden;margin: 0;padding: 0;";
            CirnoGame.GamePadManager._this = new CirnoGame.GamePadManager();
            CirnoGame.GamePadManager._this.Update();
            Bridge.global.setTimeout(function () {
                CirnoGame.GamePadManager._this.Update();

                CirnoGame.App.IC = CirnoGame.InputControllerManager._this.Controllers.getItem(0);
                var IM = CirnoGame.InputControllerManager._this.Controllers.getItem(0).InputMapping.getItem(2);

            }, 5);

            var ok = false;
            var uptest = true;
            CirnoGame.JSONArchive.Open("Assets/Images.JSON", function (json) {
                CirnoGame.App.JSON = json;

                CirnoGame.App.JSON.PreloadImages(function () {
                    ok = true;
                    CirnoGame.App.Finish();
                });
            });

            // After building (Ctrl + Shift + B) this project, 
            // browse to the /bin/Debug or /bin/Release folder.

            // A new bridge/ folder is created and contains
            // your projects JavaScript files. 

            // Open the bridge/index.html file in a brower by
            // Right-Click > Open With..., then choose a
            // web browser from the list

            // This application will then run in a browser.


        },
        statics: {
            fields: {
                Frame: 0,
                Div: null,
                Canvas: null,
                ScreenBounds: null,
                JSON: null,
                G: null,
                TargetAspect: 0,
                _lSize: 0,
                _missingTime: 0,
                _lTime: 0,
                totalTime: 0,
                _frameRendered: false,
                _gameRendered: false,
                IC: null,
                CurrentView: null,
                GameName: null,
                GameVersion: null,
                DEBUG: false
            },
            ctors: {
                init: function () {
                    this.Frame = 0;
                    this._lSize = -1;
                    this._missingTime = 0;
                    this._lTime = -1;
                    this._frameRendered = false;
                    this._gameRendered = false;
                    this.GameName = "Cirno's Mysterious Tower";
                    this.GameVersion = "0.2";
                    this.DEBUG = false;
                }
            },
            methods: {
                Finish: function () {
                    CirnoGame.AnimationLoader.Init(CirnoGame.App.JSON);
                    var LT = document.getElementById("loadtext");
                    LT.textContent = "";
                    document.body.style.cursor = "auto";
                    document.title = System.String.concat(CirnoGame.App.GameName, " ", CirnoGame.App.GameVersion, " by:RSGmaker");
                    //var R = new Renderer();
                    //Document.Body.AppendChild(R.view);

                    CirnoGame.App.Div = document.createElement("div");
                    var Canv = document.createElement("canvas");
                    CirnoGame.App.Canvas = Canv;
                    CirnoGame.App.TargetAspect = 0.75;
                    Canv.width = 1024;
                    Canv.height = Bridge.Int.clip32(Canv.width * CirnoGame.App.TargetAspect);
                    CirnoGame.App.ScreenBounds = new CirnoGame.Rectangle(0, 0, Canv.width, Canv.height);

                    CirnoGame.App.Div.appendChild(Canv);
                    document.body.appendChild(CirnoGame.App.Div);
                    //Document.Body.AppendChild(Canv);
                    CirnoGame.App.G = CirnoGame.App.Canvas.getContext("2d");

                    CirnoGame.App.G.imageSmoothingEnabled = false;
                    CirnoGame.App.Canvas.style.imageRendering = "pixelated";
                    var gg = CirnoGame.App.G;
                    gg.webkitImageSmoothingEnabled = false;
                    gg.mozImageSmoothingEnabled = false;


                    CirnoGame.KeyboardManager.Init();

                    CirnoGame.App.CurrentView = new CirnoGame.Game();

                    var OnF = CirnoGame.App.RAF;
                    requestAnimationFrame(OnF);
                },
                updateWindow: function () {
                    var size = Math.ceil(window.innerHeight * (1 / CirnoGame.App.TargetAspect));
                    if (size !== CirnoGame.App._lSize) {
                        CirnoGame.App.Canvas.style.width = "100%";
                        CirnoGame.App.Div.style.width = System.Double.format(size) + "px";

                        CirnoGame.App.Div.style.position = "relative";
                        CirnoGame.App.Div.style.left = System.Double.format(((((Bridge.Int.div(window.innerWidth, 2)) | 0)) - (size / 2))) + "px";
                        size = CirnoGame.App._lSize;
                    }
                },
                UpdateInputs: function () {
                    if (CirnoGame.App.IC != null) {
                        var L = CirnoGame.InputControllerManager._this.Controllers;
                        if (L.Count > 1) {
                            /* List<int> keys = KeyboardManager._this.TappedButtons;
                            if (keys.Contains(107))
                            {
                               int index = L.IndexOf(IC);
                               index++;
                               if (index >= L.Count)
                               {
                                   index -= L.Count;
                               }
                               IC = L[index];
                            }
                            if (keys.Contains(109))
                            {
                               int index = L.IndexOf(IC);
                               index--;
                               if (index < 0)
                               {
                                   index += L.Count;
                               }
                               IC = L[index];
                            }*/
                        }
                    }
                    CirnoGame.KeyboardManager.Update();
                },
                Update: function (time) {
                    var delta = 0;
                    CirnoGame.App.totalTime = time;
                    if (time >= 0) {
                        if (CirnoGame.App._lTime < 0) {
                            CirnoGame.App._lTime = time;
                        } else {
                            //missingTime -= 16.666666666666666666666666666667;
                        }
                        delta = (time - CirnoGame.App._lTime);
                        CirnoGame.App._missingTime += (delta);
                        if (Bridge.is(CirnoGame.App.CurrentView, CirnoGame.Game)) {
                            var G = Bridge.cast(CirnoGame.App.CurrentView, CirnoGame.Game);
                            if (G.running) {
                                G.totalTime += delta;
                                if (G.timeRemaining > 0) {
                                    G.timeRemaining -= delta;
                                }
                                if (G.timeRemaining <= 0) {
                                    G.timeRemaining = 0;
                                }
                            }
                        }
                    }
                    CirnoGame.App.updateWindow();
                    /* if (delta > 22)
                    {
                       Lagging = true;
                    }*/

                    if (CirnoGame.App._missingTime > 12) {
                        if (CirnoGame.App.CurrentView != null) {
                            CirnoGame.App.CurrentView.Update();
                        }

                        CirnoGame.App._missingTime -= 16.666666666666668;
                        CirnoGame.App._frameRendered = false;
                        CirnoGame.App._gameRendered = false;

                    } else {
                        CirnoGame.App._lTime = time;
                        return;
                    }
                    if (time >= 0) {
                        if (CirnoGame.App._missingTime >= 3000) {
                            CirnoGame.App._missingTime = 0;
                        }
                        if (CirnoGame.App._missingTime >= 10000) {
                            //Game is lagging too much to properly play multiplayer.
                        }
                        var T = 16.666666666666668;
                        if (true) {
                            T += 8;
                        }
                        while (CirnoGame.App._missingTime >= T) {
                            if (CirnoGame.App.CurrentView != null) {
                                CirnoGame.App.CurrentView.Update();
                            }
                            CirnoGame.App._missingTime -= 16.666666666666668;
                        }
                    }
                    //game.Draw(g);
                    CirnoGame.App._lTime = time;
                    CirnoGame.App.Frame = (CirnoGame.App.Frame + 1) | 0;
                    CirnoGame.HelperExtensions.Clear(CirnoGame.App.G);
                    CirnoGame.GamePadManager._this.Update();
                    if (CirnoGame.App.CurrentView != null) {

                        CirnoGame.App.CurrentView.Update();
                        CirnoGame.App.CurrentView.Render();
                        CirnoGame.App.G.drawImage(CirnoGame.App.CurrentView.spriteBuffer, 0.0, 0.0, CirnoGame.App.Canvas.width, CirnoGame.App.Canvas.height);
                    }
                    //G.FillStyle = ""+Convert. Frame;
                    //G.FillStyle = "#" + Frame.ToString("X6");
                    /* G.FillStyle = "#" + ColorFromAhsb(1,(Frame/2) % 360,0.8f,0.7f).ToString("X6");
                    G.FillRect(0, 0, G.Canvas.Width, G.Canvas.Height);

                    G.FillStyle = "red";
                    var x = ((0 + Frame * 3) % (G.Canvas.Width + 100)) - 100;
                    var y = ((0 + Frame) % (G.Canvas.Height + 100)) - 100;
                    //G.FillRect(x, y, 100, 100);

                    var V = JSON.Images.Values.ToArray();

                    var img = V[(Frame/10) % V.Length];
                    G.DrawImage(img, x, y,img.Width*4,img.Height * 4);*/
                    CirnoGame.App.UpdateInputs();
                },
                RAF: function () {

                    var OnF = CirnoGame.App.RAF;
                    requestAnimationFrame(OnF);
                    var time = Bridge.global.performance.now();
                    CirnoGame.App.Update(time);
                },
                ColorFromAhsb: function (a, h, s, b) {

                    /* if (0 > a || 255 < a)
                    {
                       throw new ArgumentOutOfRangeException("a", a,
                         Properties.Resources.InvalidAlpha);
                    }
                    if (0f > h || 360f < h)
                    {
                       throw new ArgumentOutOfRangeException("h", h,
                         Properties.Resources.InvalidHue);
                    }
                    if (0f > s || 1f < s)
                    {
                       throw new ArgumentOutOfRangeException("s", s,
                         Properties.Resources.InvalidSaturation);
                    }
                    if (0f > b || 1f < b)
                    {
                       throw new ArgumentOutOfRangeException("b", b,
                         Properties.Resources.InvalidBrightness);
                    }*/

                    if (0 === s) {
                        //return CreateShade(b / 255.0);
                        //return 0x808080;
                        var shade = Bridge.Int.clip32(b / 255.0);
                        return CirnoGame.App.RGBToInt(shade, shade, shade);
                    }

                    var fMax, fMid, fMin;
                    var iSextant, iMax, iMid, iMin;

                    if (0.5 < b) {
                        fMax = b - (b * s) + s;
                        fMin = b + (b * s) - s;
                    } else {
                        fMax = b + (b * s);
                        fMin = b - (b * s);
                    }

                    iSextant = Bridge.Int.clip32(Math.floor(h / 60.0));
                    if (300.0 <= h) {
                        h -= 360.0;
                    }
                    h /= 60.0;
                    h -= 2.0 * Math.floor(((iSextant + 1.0) % 6.0) / 2.0);
                    if (0 === iSextant % 2) {
                        fMid = h * (fMax - fMin) + fMin;
                    } else {
                        fMid = fMin - h * (fMax - fMin);
                    }

                    iMax = System.Convert.toInt32(Bridge.box(fMax * 255, System.Single, System.Single.format, System.Single.getHashCode));
                    iMid = System.Convert.toInt32(Bridge.box(fMid * 255, System.Single, System.Single.format, System.Single.getHashCode));
                    iMin = System.Convert.toInt32(Bridge.box(fMin * 255, System.Single, System.Single.format, System.Single.getHashCode));

                    switch (iSextant) {
                        case 1: 
                            return CirnoGame.App.RGBToInt(iMid, iMax, iMin);
                        case 2: 
                            return CirnoGame.App.RGBToInt(iMin, iMax, iMid);
                        case 3: 
                            return CirnoGame.App.RGBToInt(iMin, iMid, iMax);
                        case 4: 
                            return CirnoGame.App.RGBToInt(iMid, iMin, iMax);
                        case 5: 
                            return CirnoGame.App.RGBToInt(iMax, iMin, iMid);
                        default: 
                            return CirnoGame.App.RGBToInt(iMax, iMid, iMin);
                    }
                },
                RGBToInt: function (R, G, B) {
                    return ((((R + (G << 8)) | 0) + (B << 16)) | 0);
                }
            }
        }
    });

    Bridge.define("CirnoGame.Audio", {
        fields: {
            _AM: null,
            _audio: null,
            _hasPlayed: false,
            _blast: null,
            lastplayed: 0,
            _loop: false,
            OnPlay: null,
            OnStop: null,
            lasttime: 0
        },
        props: {
            ID: null,
            IsPlaying: {
                get: function () {
                    return !(!this._hasPlayed || this._audio.paused || this._audio.currentTime === 0.0);
                },
                set: function (value) {
                    if (value) {
                        this.Play();
                    } else {
                        this.Pause();
                    }
                }
            },
            Loop: {
                get: function () {
                    //return _audio.Loop;
                    return this._loop;
                },
                set: function (value) {
                    //_audio.Loop = value;
                    this._loop = value;
                    //_audio.Loop = value;
                }
            },
            CurrentTime: {
                get: function () {
                    return this._audio.currentTime;
                },
                set: function (value) {
                    this._audio.currentTime = value;
                }
            },
            Volume: {
                get: function () {
                    return this._audio.volume;
                },
                set: function (value) {
                    this._audio.volume = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.lastplayed = Number.NEGATIVE_INFINITY;
                this.lasttime = 0;
            },
            ctor: function (audio, ID, AudioManager) {
                this.$initialize();
                this._audio = audio;
                this.ID = ID;
                var self = this;
                this._AM = AudioManager;
                //object A = (() => self._OnPlay);
                //Action A = new Action(() => self._OnPlay());

                this._audio.onplay = function () {
                    self._OnPlay();
                };
                this._audio.onpause = function () {
                    self._OnStop();
                };
                //_audio.OnEnded = new Action(() => self._OnStop()).ToDynamic();
                this._audio.onended = function () {
                    self._OnEnd();
                };
                this._audio.ontimeupdate = function () {
                    self._OnUpdate();
                };

                this._blast = new (System.Collections.Generic.List$1(HTMLAudioElement)).ctor();
                var maxvoices = 6;
                var voices = 1;
                while (voices < maxvoices) {
                    this._blast.add(Bridge.cast(this._audio.cloneNode(), HTMLAudioElement));
                    voices = (voices + 1) | 0;
                }
                /* _blast.Add((AudioElement)_audio.CloneNode());
                _blast.Add((AudioElement)_audio.CloneNode());
                _blast.Add((AudioElement)_audio.CloneNode());
                _blast.Add((AudioElement)_audio.CloneNode());*/
                /* _audio.OnPlay = "self._OnPlay()".ToDynamic();
                _audio.OnPause = "self._OnStop()".ToDynamic();
                _audio.OnEnded = "self._OnStop()".ToDynamic();*/
            }
        },
        methods: {
            Play: function () {
                if (!this.IsPlaying) {
                    this.lasttime = this.CurrentTime;
                    this._audio.play();
                    this._hasPlayed = true;
                    return true;
                }
                return false;
            },
            Pause: function () {
                if (this.IsPlaying) {
                    this._audio.pause();
                    return true;
                }
                return false;
            },
            Stop: function () {
                if (this.IsPlaying) {
                    this._audio.pause();
                    this._audio.currentTime = 0;
                    return true;
                }
                return false;
            },
            Blast: function (volume) {
                if (volume === void 0) { volume = 1.0; }
                var T = CirnoGame.App.totalTime;
                if (T - this.lasttime < 150) {
                    return; //prevent audio spam.
                }
                if (!this.IsPlaying) {
                    this.Volume = volume;
                    this.Play();
                    this.lasttime = T;
                } else {
                    //((AudioElement)_audio.CloneNode()).Play();
                    var i = 0;
                    while (i < this._blast.Count) {
                        var A = this._blast.getItem(i);
                        //if (A.Paused || A.CurrentTime<0.15f || A.Played.Length==0)
                        if (A.paused || A.currentTime < 0.1 || A.played.length === 0) {
                            if (A.paused || A.currentTime === 0.0 || A.played.length === 0) {
                                A.volume = volume;
                                A.play();
                                i = this._blast.Count;
                                this.lasttime = T;
                            }
                        }
                        i = (i + 1) | 0;
                    }
                }
            },
            _OnPlay: function () {
                this._AM.OnPlay(this);
                if (this.OnPlay) {
                    this.OnPlay(this);
                }
            },
            _OnStop: function () {
                this._AM.OnStop(this);
                if (this.OnStop) {
                    this.OnStop(this);
                }
            },
            _OnEnd: function () {
                /* if (_loop)
                {
                   CurrentTime = 0;
                   Play();
                }
                else*/
                {
                    this._OnStop();
                }
            },
            _OnUpdate: function () {
                if (this._loop) {
                    //if ((CurrentTime+0.35) >= _audio.Duration)
                    if ((this.CurrentTime + ((this.CurrentTime - this.lasttime) * 0.8)) >= this._audio.duration) {
                        this.CurrentTime = 0;
                        this.Play();
                    }
                    this.lasttime = this.CurrentTime;
                }
            }
        }
    });

    Bridge.define("CirnoGame.AudioManager", {
        statics: {
            fields: {
                Directory: null,
                __this: null
            },
            props: {
                _this: {
                    get: function () {
                        if (CirnoGame.AudioManager.__this == null) {
                            CirnoGame.AudioManager.__this = new CirnoGame.AudioManager();
                        }
                        return CirnoGame.AudioManager.__this;
                    }
                }
            },
            ctors: {
                init: function () {
                    this.Directory = "";
                }
            },
            methods: {
                Init: function () {
                    if (CirnoGame.AudioManager.__this == null) {
                        CirnoGame.AudioManager.__this = new CirnoGame.AudioManager();
                    }
                }
            }
        },
        fields: {
            data: null,
            playing: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.data = new (System.Collections.Generic.Dictionary$2(System.String,CirnoGame.Audio))();
                this.playing = new (System.Collections.Generic.List$1(CirnoGame.Audio)).ctor();
            }
        },
        methods: {
            Get: function (path) {
                path = System.String.concat(CirnoGame.AudioManager.Directory, path);
                if (this.data.containsKey(path)) {
                    return this.data.get(path);
                } else {
                    var AE = new Audio(path);
                    var A = new CirnoGame.Audio(AE, path, this);
                    this.data.add(path, A);
                    return A;
                }
            },
            Play: function (path, loop) {
                if (loop === void 0) { loop = false; }
                var A = this.Get(path);
                A.Loop = loop;
                A.Play();
                return A;
            },
            Blast: function (path, volume) {
                if (volume === void 0) { volume = 1.0; }
                var A = this.Get(path);
                A.Blast(volume);
            },
            Stop: function (path) {
                var A = this.Get(path);
                A.Stop();
            },
            Pause: function (path) {
                var A = this.Get(path);
                A.Pause();
            },
            OnPlay: function (audio) {
                if (!this.playing.contains(audio)) {
                    this.playing.add(audio);
                }
            },
            OnStop: function (audio) {
                if (this.playing.contains(audio)) {
                    this.playing.remove(audio);
                }
            },
            StopAllFromDirectory: function (directory) {
                directory = System.String.concat(CirnoGame.AudioManager.Directory, directory);
                CirnoGame.HelperExtensions.ForEach(Bridge.global.CirnoGame.Audio, this.data.getValues(), function (A) {
                    if (System.String.startsWith(A.ID, directory)) {
                        A.Stop();
                    }
                });
            },
            StopAll: function () {
                CirnoGame.HelperExtensions.ForEach(Bridge.global.CirnoGame.Audio, this.data.getValues(), function (A) {
                    A.Stop();
                });
            }
        }
    });

    Bridge.define("CirnoGame.ButtonMenu", {
        fields: {
            rows: null,
            MenuWidth: 0,
            MenuHeight: 0,
            FontSize: 0,
            SelectionMenu: false,
            Selected: null,
            Self: null,
            OnChoose: null,
            Position: null
        },
        props: {
            SelectedData: {
                get: function () {
                    if (this.Self.Selected != null) {
                        return this.Self.Selected.Data;
                    }
                    return null;
                }
            },
            SelectedText: {
                get: function () {
                    if (this.Self.Selected != null) {
                        if (Bridge.is(this.Self.Selected.Contents, CirnoGame.TextSprite)) {
                            return Bridge.cast(this.Self.Selected.Contents, CirnoGame.TextSprite).Text;
                        }
                    }
                    return null;
                }
            }
        },
        ctors: {
            init: function () {
                this.Position = new CirnoGame.Vector2();
            },
            ctor: function (menuWidth, menuHeight, FontSize, selectionMenu) {
                if (selectionMenu === void 0) { selectionMenu = false; }

                this.$initialize();
                this.rows = new (System.Collections.Generic.List$1(System.Collections.Generic.List$1(CirnoGame.ButtonSprite))).ctor();
                this.MenuWidth = menuWidth;
                this.MenuHeight = menuHeight;
                this.FontSize = FontSize;
                this.SelectionMenu = selectionMenu;
                this.Self = this;
            }
        },
        methods: {
            GetAllButtons: function () {
                var all = new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite)).ctor();
                this.rows.forEach(function (R) {
                    all.addRange(R);
                });
                return all;
            },
            GetSpriteByData: function (data) {
                var all = new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite)).$ctor1(System.Linq.Enumerable.from(this.GetAllButtons()).where(function (B) {
                        return Bridge.referenceEquals(B.Data, data);
                    }));
                if (all.Count > 0) {
                    return all.getItem(0);
                }
                return null;
            },
            AddButtons: function (buttonText) {
                CirnoGame.HelperExtensions.ForEach(System.String, buttonText, Bridge.fn.bind(this, function (T) {
                    this.AddButton(T);
                }));
            },
            AddButton: function (buttonText, row, data) {
                if (row === void 0) { row = -1; }
                if (data === void 0) { data = null; }
                var T = new CirnoGame.TextSprite();
                T.Text = buttonText;
                T.FontSize = this.FontSize;
                //ButtonSprite B = new ButtonSprite(T, (int)(FontSize * 0.05));
                var B = new CirnoGame.ButtonSprite(T, Bridge.Int.clip32(this.FontSize * 0.1));
                if (data != null) {
                    B.Data = data;
                }
                this.AddButton$1(B, row);
                return B;
            },
            AddButton$1: function (button, row) {
                if (row === void 0) { row = -1; }
                if (this.rows.Count === 0) {
                    this.rows.add(new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite)).ctor());
                }
                if (row === -1) {
                    row = (this.rows.Count - 1) | 0;
                }
                if (button != null) {
                    button.OnClick = Bridge.fn.bind(this, function () {
                        this.Self.Select(button);
                    });
                }
                this.rows.getItem(row).add(button);
            },
            Select: function (button) {
                if (!Bridge.referenceEquals(this.Selected, button) || !this.SelectionMenu) {
                    if (this.Selected != null && this.SelectionMenu) {
                        //Selected.BorderColor = "#00AA33";
                        //Selected.ButtonColor = "#11CC55";
                        this.Selected.SetColorScheme$1(0);
                    }
                    this.Selected = button;
                    var OSC = this.OnChoose;
                    var self = this;
                    if (this.SelectionMenu && this.Selected != null) {
                        //Selected.BorderColor = "#FFFFFF";
                        //Selected.ButtonColor = "#FF0000";
                        this.Selected.SetColorScheme$1(1);
                    }
                    if (this.Selected != null && OSC) {
                        self.OnChoose();
                    }
                }
            },
            CombineRows: function () {
                var all = new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite)).ctor();
                this.rows.forEach(function (R) {
                    all.addRange(R);
                });

                this.rows = new (System.Collections.Generic.List$1(System.Collections.Generic.List$1(CirnoGame.ButtonSprite))).ctor();
                this.rows.add(all);
            },
            addRow: function () {
                var ret = new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite)).ctor();
                this.rows.add(ret);
                return ret;
            },
            BreakUp: function (totalRows) {
                this.CombineRows();
                var all = this.rows.getItem(0);
                this.rows = new (System.Collections.Generic.List$1(System.Collections.Generic.List$1(CirnoGame.ButtonSprite))).ctor();
                var C = Math.ceil(all.Count / totalRows);
                var row = this.addRow();
                var i = 0;
                while (i < all.Count) {
                    if (row.Count >= C) {
                        row = this.addRow();
                    }
                    this.AddButton$1(all.getItem(i));
                    i = (i + 1) | 0;
                }
            },
            CenterOn: function (sprite, Center) {
                sprite.Draw(null);
                var S = sprite.Size;
                var S2 = CirnoGame.Vector2.op_Division(S, 2.0);
                sprite.Position = CirnoGame.Vector2.op_Subtraction(Center, S2);
            },
            UpdateRow: function (index, y) {
                var row = this.rows.getItem(index);
                var X = (this.MenuWidth / (row.Count + 1.0));
                var i = 0;
                var CX = X;

                CX += this.Position.X;
                while (i < row.Count) {
                    var B = row.getItem(i);
                    if (B != null) {
                        this.CenterOn(B, new CirnoGame.Vector2(CX, y));
                    }
                    CX += X;
                    i = (i + 1) | 0;
                }
            },
            Finish: function (totalRows) {
                if (totalRows === void 0) { totalRows = -1; }
                if (totalRows > 0) {
                    this.BreakUp(totalRows);
                }
                var y = 0;
                var CY = 0;
                if (totalRows > 0 && this.rows.Count < totalRows) {
                    y = (this.MenuHeight / (((this.rows.Count + 1) | 0)));
                    CY = y;
                } else {
                    y = (this.MenuHeight / (this.rows.Count));
                    CY = 0;
                }

                CY += this.Position.Y;
                var i = 0;
                while (i < this.rows.Count) {
                    this.UpdateRow(i, CY);
                    CY += y;
                    i = (i + 1) | 0;
                }
            },
            Update: function (mousePosition, clicked) {
                if (mousePosition === void 0) { mousePosition = null; }
                if (clicked === void 0) { clicked = true; }
                if (CirnoGame.Vector2.op_Equality(mousePosition, null)) {
                    mousePosition = CirnoGame.KeyboardManager._this.CMouse;
                    clicked = CirnoGame.KeyboardManager._this.TappedMouseButtons.contains(0);
                }
                if (clicked) {
                    this.rows.forEach(function (R) {
                        R.forEach(function (B) {
                            if (B != null) {
                                B.CheckClick(mousePosition);
                            }
                        });
                    });
                }
            },
            Draw: function (g) {
                this.rows.forEach(function (R) {
                    R.forEach(function (B) {
                        if (B != null) {
                            B.Draw(g);
                        }
                    });
                });
            }
        }
    });

    Bridge.define("CirnoGame.Sprite", {
        fields: {
            Position: null,
            spriteBuffer: null,
            Visible: false,
            spriteGraphics: null
        },
        props: {
            Size: {
                get: function () {
                    return new CirnoGame.Vector2(this.spriteBuffer.width, this.spriteBuffer.height);
                },
                set: function (value) {
                    if (CirnoGame.Vector2.op_Equality(value, null)) {
                        value = new CirnoGame.Vector2();
                    }
                    this.spriteBuffer.width = Bridge.Int.clip32(value.X);
                    this.spriteBuffer.height = Bridge.Int.clip32(value.Y);
                }
            }
        },
        ctors: {
            init: function () {
                this.Visible = true;
            },
            ctor: function () {
                this.$initialize();
                this.spriteBuffer = document.createElement("canvas");
                this.spriteGraphics = this.spriteBuffer.getContext("2d");
                this.spriteGraphics.imageSmoothingEnabled = false;
                this.Position = new CirnoGame.Vector2();
            }
        },
        methods: {
            GetGraphics: function () {
                return this.spriteGraphics;
            },
            OnFrame: function () {

            },
            Draw: function (g) {
                if (!this.Visible) {
                    return;
                }
                g.drawImage(this.spriteBuffer, this.Position.X, this.Position.Y);
            },
            GetBounds: function () {
                return new CirnoGame.Rectangle(this.Position.X, this.Position.Y, this.spriteBuffer.width, this.spriteBuffer.height);
            }
        }
    });

    Bridge.define("CirnoGame.ButtonSprite.ColorScheme", {
        fields: {
            BorderColor: null,
            ButtonColor: null
        },
        ctors: {
            ctor: function (borderColor, buttonColor) {
                if (borderColor === void 0) { borderColor = "#00AA33"; }
                if (buttonColor === void 0) { buttonColor = "#11CC55"; }

                this.$initialize();
                this.BorderColor = borderColor;
                this.ButtonColor = buttonColor;
            }
        }
    });

    Bridge.define("CirnoGame.Camera", {
        fields: {
            instawarp: false,
            Position: null,
            TargetPosition: null,
            /**
             * @instance
             * @public
             * @memberof CirnoGame.Camera
             * @default 0.8
             * @type number
             */
            LinearPanSpeed: 0,
            /**
             * @instance
             * @public
             * @memberof CirnoGame.Camera
             * @default 0.07
             * @type number
             */
            LerpPanSpeed: 0,
            _scale: 0,
            speedmod: 0,
            _invscale: 0,
            _center: null,
            viewport_width: 0,
            viewport_height: 0,
            CameraBounds: null,
            StageBounds: null,
            tmp: null
        },
        props: {
            CenteredTargetPosition: {
                set: function (value) {
                    this.TargetPosition = new CirnoGame.Vector2(value.X - (this.CameraBounds.width / 2), value.Y - (this.CameraBounds.height / 2));
                }
            },
            Scale: {
                get: function () {
                    return this._scale;
                },
                set: function (value) {
                    this._scale = value;
                    this._invscale = 1 / this._scale;
                    this.UpdateCameraBounds();
                }
            },
            InvScale: {
                get: function () {
                    return this._invscale;
                },
                set: function (value) {
                    this._invscale = value;
                    this._scale = 1 / this._invscale;
                    this.UpdateCameraBounds();
                }
            },
            Center: {
                get: function () {
                    var R = this.CameraBounds;
                    //return R.Center;
                    R.GetCenter(this._center);
                    return this._center;
                },
                set: function (value) {
                    this.Position.X = value.X - (this.CameraBounds.width / 2);
                    this.Position.Y = value.Y - (this.CameraBounds.height / 2);
                }
            }
        },
        ctors: {
            init: function () {
                this.instawarp = false;
                this.LinearPanSpeed = 0.8;
                this.LerpPanSpeed = 0.07;
                this._scale = 1.0;
                this.speedmod = 1;
                this._invscale = 1.0;
                this._center = new CirnoGame.Vector2();
                this.viewport_width = 1;
                this.viewport_height = 1;
                this.tmp = new CirnoGame.Vector2();
            },
            ctor: function (viewport_width, viewport_height) {
                if (viewport_width === void 0) { viewport_width = -1.0; }
                if (viewport_height === void 0) { viewport_height = -1.0; }

                this.$initialize();
                this.Position = new CirnoGame.Vector2();
                this.TargetPosition = new CirnoGame.Vector2();
                this.viewport_width = viewport_width;
                this.viewport_height = viewport_height;
                this.CameraBounds = new CirnoGame.Rectangle(0, 0, viewport_width, viewport_height);
                this._invscale = 1.0 / this._scale;
                this.UpdateCameraBounds();
            }
        },
        methods: {
            ScaleToSize: function (sizeInPixels) {
                this.Scale = sizeInPixels / CirnoGame.App.Canvas.width;
            },
            UpdateCameraBounds: function () {
                //CameraBounds.width = App.Canvas.Width * _invscale;
                //CameraBounds.height = App.Canvas.Height * _invscale;
                this.CameraBounds.width = this.viewport_width * this._invscale;
                this.CameraBounds.height = this.viewport_height * this._invscale;
            },
            Update: function () {
                if (this.Position.X !== this.TargetPosition.X || this.Position.Y !== this.TargetPosition.Y) {
                    //float dist = (Position - TargetPosition).Length;
                    var dist = this.Position.Distance(this.TargetPosition);
                    var spd = this.LinearPanSpeed + (dist * this.LerpPanSpeed);
                    spd *= this.speedmod;

                    if (dist <= spd || this.instawarp) {
                        this.Position.X = this.TargetPosition.X;
                        this.Position.Y = this.TargetPosition.Y;
                        this.instawarp = false;
                        return;
                    } else {
                        this.tmp.CopyFrom(this.Position);
                        this.tmp.Subtract(this.TargetPosition);
                        this.tmp.SetAsNormalize(spd);
                        //Vector2 V = (Position - TargetPosition).Normalize(spd);
                        this.Position.Subtract(this.tmp);
                    }
                    if (this.StageBounds != null) {
                        this.Position.X = CirnoGame.MathHelper.Clamp$1(this.Position.X, this.StageBounds.left, this.StageBounds.right - this.CameraBounds.width);
                        this.Position.Y = CirnoGame.MathHelper.Clamp$1(this.Position.Y, this.StageBounds.top, this.StageBounds.bottom - this.CameraBounds.height);

                        this.TargetPosition.X = CirnoGame.MathHelper.Clamp$1(this.TargetPosition.X, this.StageBounds.left, this.StageBounds.right - this.CameraBounds.width);
                        this.TargetPosition.Y = CirnoGame.MathHelper.Clamp$1(this.TargetPosition.Y, this.StageBounds.top, this.StageBounds.bottom - this.CameraBounds.height);
                    }

                }
                this.CameraBounds.x = this.Position.X;
                this.CameraBounds.y = this.Position.Y;
            },
            Apply: function (g) {
                g.scale(this.Scale, this.Scale);
                g.translate(-this.Position.X, -this.Position.Y);
            }
        }
    });

    Bridge.define("CirnoGame.Entity", {
        fields: {
            Ani: null,
            Alive: false,
            Visible: false,
            Speed: null,
            Game: null,
            _behaviors: null,
            _behaviorTicks: null,
            ZOrder: 0,
            ID: null,
            HideHitbox: false,
            HandledLocally: false,
            RemovedOnLevelEnd: false
        },
        props: {
            Hspeed: {
                get: function () {
                    return this.Speed.X;
                },
                set: function (value) {
                    this.Speed.X = value;
                }
            },
            Vspeed: {
                get: function () {
                    return this.Speed.Y;
                },
                set: function (value) {
                    this.Speed.Y = value;
                }
            },
            Position: {
                get: function () {
                    return this.Ani.Position;
                },
                set: function (value) {
                    this.Ani.Position = value;
                }
            },
            x: {
                get: function () {
                    return this.Ani.Position.X;
                },
                set: function (value) {
                    this.Ani.Position.X = value;
                }
            },
            y: {
                get: function () {
                    return this.Ani.Position.Y;
                },
                set: function (value) {
                    this.Ani.Position.Y = value;
                }
            },
            Width: {
                get: function () {
                    if (this.Ani.CurrentImage != null) {
                        return this.Ani.CurrentImage.width;
                    }
                    return 0;
                }
            },
            Height: {
                get: function () {
                    if (this.Ani.CurrentImage != null) {
                        return this.Ani.CurrentImage.height;
                    }
                    return 0;
                }
            }
        },
        ctors: {
            init: function () {
                this.Alive = true;
                this.Visible = true;
                this.Speed = new CirnoGame.Vector2();
                this.ZOrder = 0;
                this.HandledLocally = true;
                this.RemovedOnLevelEnd = true;
            },
            ctor: function (game) {
                this.$initialize();
                //ID = Math.Random();
                this.ID = CirnoGame.Helper.GetRandomString();
                this.Game = game;
            }
        },
        methods: {
            AddBehavior: function (behavior) {
                if (this._behaviors == null) {
                    this._behaviors = new (System.Collections.Generic.List$1(CirnoGame.EntityBehavior)).ctor();
                    this._behaviorTicks = new (System.Collections.Generic.List$1(System.Int32)).ctor();
                }
                this._behaviors.add(behavior);
                this._behaviorTicks.add(0);
            },
            AddBehavior$1: function (T) {
                if (this._behaviors == null) {
                    this._behaviors = new (System.Collections.Generic.List$1(CirnoGame.EntityBehavior)).ctor();
                    this._behaviorTicks = new (System.Collections.Generic.List$1(System.Int32)).ctor();
                }
                var B = Bridge.createInstance(T, [this]);
                this._behaviors.add(Bridge.cast(B, CirnoGame.EntityBehavior));
                this._behaviorTicks.add(0);
                /* if (B is EntityBehavior)
                {
                   _behaviors.Add((EntityBehavior)B);
                   _behaviorTicks.Add(0);
                }else
                {
                   throw new Exception("Attempted to add an invalid behavior");
                }*/
            },
            RemoveBehavior: function (behavior) {
                if (this._behaviors == null) {
                    this._behaviors = new (System.Collections.Generic.List$1(CirnoGame.EntityBehavior)).ctor();
                    this._behaviorTicks = new (System.Collections.Generic.List$1(System.Int32)).ctor();
                }
                if (this._behaviors.contains(behavior)) {
                    this._behaviorTicks.removeAt(this._behaviors.indexOf(behavior));
                    this._behaviors.remove(behavior);
                }
            },
            RemoveBehavior$1: function (T) {
                var $t;
                if (this._behaviors == null) {
                    return;
                }
                var L = new (System.Collections.Generic.List$1(CirnoGame.EntityBehavior)).$ctor1(System.Linq.Enumerable.from(this._behaviors).where(function (behavior) {
                        return Bridge.is(behavior, T);
                    }));
                /* if (L.Count > 0)
                {
                   RemoveBehavior(L[0]);
                }*/
                $t = Bridge.getEnumerator(L);
                try {
                    while ($t.moveNext()) {
                        var behavior = $t.Current;
                        this.RemoveBehavior(behavior);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }return;
            },
            GetBehavior: function (T) {
                if (this._behaviors == null) {
                    return Bridge.getDefaultValue(T);
                }
                /* List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior is T));
                if (L.Count>0)
                {
                   return (dynamic)L[0];
                }*/
                return Bridge.cast(System.Linq.Enumerable.from(this._behaviors).first(function (behavior) {
                        return Bridge.is(behavior, T);
                    }), T);
            },
            GetBehavior$1: function (T, func) {
                var L = new (System.Collections.Generic.List$1(CirnoGame.EntityBehavior)).$ctor1(System.Linq.Enumerable.from(this._behaviors).where(function (behavior) {
                        return Bridge.is(behavior, T);
                    }));
                var F = func;
                return Bridge.cast(System.Linq.Enumerable.from(L).first(F), T);
                //return L.First(func).Cast<T>();
            },
            GetTeamColor: function () {
                if (Bridge.is(this, CirnoGame.ICombatant)) {
                    if (this.Game.GamePlaySettings.GameMode.Teams) {
                        return CirnoGame.Game.GetTeamColor(Bridge.cast(this, CirnoGame.ICombatant).CirnoGame$ICombatant$Team);
                    } else {
                        if (Bridge.referenceEquals(this, this.Game.player)) {
                            return CirnoGame.Game.GetTeamColor(1);
                        } else {
                            return CirnoGame.Game.GetTeamColor(2);
                        }
                    }
                }
                return "";
            },
            SameTeam: function (combatant) {
                if (this == combatant) {
                    return true;
                }
                var A = this;
                var B = combatant;

                if (A.PointsForKilling && B.PointsForKilling) {
                    var AA = A;
                    var BB = B;
                    if (AA.Team == BB.Team) {
                        if (this.Game.Teams) {
                            //return ((ICombatant)this).Team != 0;
                            return true;
                        } else {
                            return AA.Team == 0;
                        }
                    }
                }
                return false;
            },
            GetBehaviorFromName: function (Name) {
                if (this._behaviors == null) {
                    return null;
                }
                //List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior.GetType().FullName==typeFullName));
                /* List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior.BehaviorName == Name));
                if (L.Count > 0)
                {
                   return (dynamic)L[0];
                }*/
                try {
                    return System.Linq.Enumerable.from(this._behaviors).first(function (behavior) {
                            return Bridge.referenceEquals(behavior.BehaviorName, Name);
                        });
                }
                catch ($e1) {
                    $e1 = System.Exception.create($e1);
                    System.Console.WriteLine(System.String.concat("Behavior ", Name, " was not found."));
                }
                return null;
            },
            CustomEvent: function (evt) {

            },
            PlaySound: function (sound) {
                this.Game.PlaySoundEffect(this.getCenter(), sound);
            },
            getCenter: function () {
                //return Position + new Vector2(Width / 2, Height / 2);
                return CirnoGame.Vector2.Add$1(this.Position, this.Width / 2, this.Height / 2);
            },
            GetHitbox: function () {
                if (this.Ani != null && this.Ani.CurrentImage != null) {
                    return new CirnoGame.Rectangle(this.Ani.X, this.Ani.Y, this.Ani.CurrentImage.width, this.Ani.CurrentImage.height);
                }
                return null;
            },
            Update: function () {
                var $t;
                this.Ani.Position = CirnoGame.Vector2.op_Addition(this.Ani.Position, this.Speed);
                this.Ani.Update();
                if (this._behaviors != null) {
                    var i = 0;
                    while (i < this._behaviors.Count) {
                        var behavior = this._behaviors.getItem(i);
                        if (behavior.enabled && Bridge.identity(this._behaviorTicks.getItem(i), ($t = (this._behaviorTicks.getItem(i) + 1) | 0, this._behaviorTicks.setItem(i, $t), $t)) >= behavior.FramesPerTick) {
                            this._behaviorTicks.setItem(i, 0);
                            behavior.Update();
                        }
                        i = (i + 1) | 0;
                    }
                }
            },
            RefreshBehaviorTick: function (T) {
                var B = this.GetBehavior(T);
                if (B != null) {
                    this._behaviorTicks.setItem(this._behaviors.indexOf(B), B.FramesPerTick);
                }
            },
            Draw: function (g) {
                var $t;
                this.Ani.Draw(g);
                if (!this.HideHitbox && this.Game.ShowHitbox) {
                    this.DrawHitbox(g);
                }
                if (this._behaviors != null) {
                    $t = Bridge.getEnumerator(this._behaviors);
                    try {
                        while ($t.moveNext()) {
                            var behavior = $t.Current;
                            behavior.Draw(g);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }}
            },
            DrawHitbox: function (g) {
                var R = this.GetHitbox();
                if (R != null) {
                    g.strokeStyle = "#FFFF00";
                    g.strokeRect(R.x, R.y, R.width, R.height);
                }
            },
            onRemove: function () {

            }
        }
    });

    Bridge.define("CirnoGame.GameMode.ModeTypes", {
        $kind: "enum",
        statics: {
            fields: {
                
                Skirmish: 0,
                /**
                 * Singleplayer, gameplay is changed up with a mode specific task.
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 1
                 * @type number
                 */
                Challenge: 1,
                /**
                 * Like challenge, but is designed for multiple human players.
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 2
                 * @type number
                 */
                CallengeCoop: 2
            }
        }
    });

    Bridge.define("CirnoGame.GamePad", {
        fields: {
            connected: false,
            axes: null,
            buttons: null,
            id: null,
            index: System.Int64(0)
        },
        ctors: {
            ctor: function (pad) {
                this.$initialize();
                this.id = pad.id;
                this.index = System.Int64(pad.index);
                this.connected = pad.connected;
                this.axes = pad.axes;

                var length = pad.buttons.length;

                this.buttons = System.Array.init(length, null, CirnoGame.GamePadButton);
                var i = 0;
                while (i < length) {
                    this.buttons[System.Array.index(i, this.buttons)] = pad.buttons[i];
                    i = (i + 1) | 0;
                }
            }
        },
        methods: {
            Update: function () {
                var i = 0;
                while (i < this.buttons.length) {
                    this.buttons[System.Array.index(i, this.buttons)].tapped = false;
                    i = (i + 1) | 0;
                }
            },
            CombineData: function (pad) {
                if (Bridge.referenceEquals(this.id, pad.id)) {
                    this.connected = pad.connected;
                    this.axes = pad.axes;
                    //buttons = pad.buttons;
                    this.CombineButtonData(pad.buttons);
                }
            },
            CombineButtonData: function (buttons) {
                var Lb = buttons;
                this.buttons = buttons;
                var i = 0;
                while (i < buttons.length) {
                    if (buttons[System.Array.index(i, buttons)].pressed && !Lb[System.Array.index(i, Lb)].pressed) {
                        buttons[System.Array.index(i, buttons)].tapped = true;
                    }
                    i = (i + 1) | 0;
                }
            }
        }
    });

    Bridge.define("CirnoGame.GamePadButton", {
        fields: {
            tapped: false,
            pressed: false,
            value: 0
        },
        ctors: {
            ctor: function (button) {
                this.$initialize();
                this.pressed = button.pressed;
                this.value = button.value;
                this.tapped = false;
            }
        }
    });

    Bridge.define("CirnoGame.GamePadManager", {
        statics: {
            fields: {
                _this: null
            }
        },
        fields: {
            keyboard: null,
            gamepads: null,
            tempgamepads: null
        },
        props: {
            activeGamepads: {
                get: function () {
                    return new (System.Collections.Generic.List$1(CirnoGame.GamePad)).$ctor1(System.Linq.Enumerable.from(this.gamepads).where(function (gamepad) {
                            return gamepad.connected;
                        }));
                }
            }
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.gamepads = new (System.Collections.Generic.List$1(CirnoGame.GamePad)).ctor();
                this.Update();
            }
        },
        methods: {
            CallBackTest: function () {
                Bridge.global.alert("Callback!");
            },
            GetPad: function (id) {
                var L = new (System.Collections.Generic.List$1(CirnoGame.GamePad)).$ctor1(System.Linq.Enumerable.from(this.gamepads).where(function (gamepad) {
                        return Bridge.referenceEquals(gamepad.id, id);
                    }));
                if (L.Count > 0) {
                    return L.getItem(0);
                }
                return null;
            },
            Update: function () {
                var i = 0;
                while (i < this.gamepads.Count) {
                    this.gamepads.getItem(i).Update();
                    i = (i + 1) | 0;
                }
                i = 0;
                this.tempgamepads = (navigator.getGamepads() || navigator.webkitGetGamepads() || []);
                var pads = new (System.Collections.Generic.List$1(CirnoGame.GamePad)).ctor();
                while (i < this.tempgamepads.length) {
                    if (this.tempgamepads[i] != null) {
                        var pad = new CirnoGame.GamePad(this.tempgamepads[i]);
                        this._Update(pad);
                        pads.add(pad);
                    }
                    i = (i + 1) | 0;
                }
                i = 0;
                //Adds any newly found gamepads.
                while (i < pads.Count) {
                    var id = pads.getItem(i).id;
                    var j = 0;
                    var ok = true;
                    while (j < this.gamepads.Count) {
                        if (Bridge.referenceEquals(this.gamepads.getItem(j).id, id)) {
                            ok = false;
                        }
                        j = (j + 1) | 0;
                    }
                    if (ok) {
                        this.gamepads.add(pads.getItem(i));
                    }
                    i = (i + 1) | 0;
                }

                /* Action F = CallBackTest;
                Script.Write("setTimeout(F, 3000);");*/
                //Global.SetTimeout()
            },
            _Update: function (pad) {
                var i = 0;
                while (i < this.gamepads.Count) {
                    var P = this.gamepads.getItem(i);
                    if (Bridge.referenceEquals(P.id, pad.id)) {
                        P.CombineData(pad);
                    }
                    i = (i + 1) | 0;
                }
            }
        }
    });

    Bridge.define("CirnoGame.GamePlaySettings", {
        fields: {
            Online: false,
            MyCharacter: null,
            GameMode: null,
            MyTeam: 0,
            BlueNPCs: 0,
            RedNPCs: 0,
            RoomID: null,
            /**
             * @instance
             * @public
             * @memberof CirnoGame.GamePlaySettings
             * @default 1.0
             * @type number
             */
            ComputerAIModifier: 0
        },
        ctors: {
            init: function () {
                this.Online = false;
                this.MyCharacter = "Reisen";
                this.MyTeam = 1;
                this.BlueNPCs = 3;
                this.RedNPCs = 2;
                this.RoomID = "";
                this.ComputerAIModifier = 1.0;
            },
            ctor: function () {
                this.$initialize();
                //GameMode = new GameMode();
                //GameMode = GameMode.DeathMatch;
                this.GameMode = CirnoGame.GameMode.TeamBattle;
            }
        }
    });

    Bridge.define("CirnoGame.Helper", {
        statics: {
            fields: {
                _namespaces: null
            },
            ctors: {
                init: function () {
                    this._namespaces = new (System.Collections.Generic.Dictionary$2(System.String,System.Object))();
                }
            },
            methods: {
                GetRandomString: function () {
                    //return (Math.Random() * new Date().GetTime()).ToString(36).Replace("/\\./ g, '-'",null);
                    //return (Math.Random() * new Date().GetTime()).ToString(36).Replace(new Bridge.Text.RegularExpressions.Regex("", null);
                    //return Script.Write<string>("(Math.random() * new Date().getTime()).toString(36).replace(/\\./ g, '-')");
                    return (Math.random() * new Date().getTime()).toString(36);
                },
                GetType: function (FullName) {
                    var name = FullName;
                    if (Bridge.referenceEquals(name, "") || name == null || !System.String.contains(name,".")) {
                        return null;
                    }
                    var s = name.split(".");
                    //string nm = GetType().FullName.Split(".")[0];
                    var i = 1;
                    /* if (s[0] != nm)
                       return null;*/

                    //dynamic obj = Script.Write<object>(nm);

                    //Get namespace
                    var obj;
                    if (CirnoGame.Helper._namespaces.containsKey(s[System.Array.index(0, s)])) {
                        obj = CirnoGame.Helper._namespaces.get(s[System.Array.index(0, s)]);
                    } else {
                        obj = eval(s[System.Array.index(0, s)]);
                        CirnoGame.Helper._namespaces.set(s[System.Array.index(0, s)], obj);
                    }

                    while (i < s.length) {
                        //Parse through object hierarchy.
                        if (!obj) {
                            return null;
                        }
                        obj = obj[s[System.Array.index(i, s)]];
                        i = (i + 1) | 0;
                    }
                    return obj;
                },
                AddMultiple: function (T, array, item, number) {
                    while (number > 0) {
                        array.push(item);
                        number = (number - 1) | 0;
                    }
                },
                Repeat: function (s, number) {
                    if (number < 1) {
                        return "";
                    }
                    var ret = s;
                    var i = (number - 1) | 0;
                    while (i > 0) {
                        ret = System.String.concat(ret, s);
                        i = (i - 1) | 0;
                    }
                    return ret;
                },
                CloneCanvas: function (C) {
                    var ret = document.createElement("canvas");
                    ret.width = C.width;
                    ret.height = C.height;
                    var g = ret.getContext("2d");
                    g.drawImage(C, 0.0, 0.0);
                    return ret;
                },
                GetContext: function (C) {
                    return C.getContext("2d");
                },
                GetField: function (target, fieldName) {
                    var O = target;
                    //if (O[fieldName])
                    if (CirnoGame.Helper.Has(O, fieldName)) {
                        return O[fieldName];
                    }
                    if (O[System.String.concat("get", fieldName)]) {
                        return O[System.String.concat("get", fieldName)]();
                    }
                    var s = "";
                    try {
                        s = System.String.concat("Helper get field: Field \"", fieldName, "\" was not in " + target.GetType().FullName, ".");
                    }
                    catch ($e1) {
                        $e1 = System.Exception.create($e1);
                        s = System.String.concat("Helper get field: Field \"", fieldName, "\" was not in " + target, ".");
                    }

                    //Console.WriteLine(s);
                    console.log(s);
                    return null;
                },
                Has: function (target, fieldName) {
                    /* if (O[fieldName] || ((string)O) == "false")
                    {
                       return true;
                    }*/
                    return typeof target[fieldName] != 'undefined';
                },
                ReloadPage: function () {
                    window.location.href = window.location.href;
                },
                SetField: function (target, fieldName, data) {
                    var O = target;
                    //if (O[fieldName])
                    if (CirnoGame.Helper.Has(O, fieldName)) {
                        O[fieldName] = data;
                        return;
                    }
                    if (O[System.String.concat("set", fieldName)]) {
                        O[System.String.concat("set", fieldName)](data);
                        return;
                    }
                    var s = "";
                    try {
                        s = System.String.concat("Helper set field: Field \"", fieldName, "\" was not in " + target.GetType().FullName, ".");
                    }
                    catch ($e1) {
                        $e1 = System.Exception.create($e1);
                        s = System.String.concat("Helper set field: Field \"", fieldName, "\" was not in " + target, ".");
                    }
                    //Console.WriteLine(s);
                    console.log(s);
                },
                CopyFields: function (source, target, Fields) {
                    if (Fields === void 0) { Fields = null; }
                    if (Fields == null) {
                        Fields = Object.keys(source);
                    }
                    var i = 0;
                    while (i < Fields.length) {
                        var f = Fields[System.Array.index(i, Fields)];
                        CirnoGame.Helper.SetField(target, f, CirnoGame.Helper.GetField(source, f));
                        i = (i + 1) | 0;
                    }
                },
                KeyCodeToString: function (keycode) {
                    var codenames = System.Array.init(["", "", "", "CANCEL", "", "", "HELP", "", "BACK_SPACE", "TAB", "", "", "CLEAR", "ENTER", "ENTER_SPECIAL", "", "SHIFT", "CONTROL", "ALT", "PAUSE", "CAPS_LOCK", "KANA", "EISU", "JUNJA", "FINAL", "HANJA", "", "ESCAPE", "CONVERT", "NONCONVERT", "ACCEPT", "MODECHANGE", "SPACE", "PAGE_UP", "PAGE_DOWN", "END", "HOME", "LEFT", "UP", "RIGHT", "DOWN", "SELECT", "PRINT", "EXECUTE", "PRINTSCREEN", "INSERT", "DELETE", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "COLON", "SEMICOLON", "LESS_THAN", "EQUALS", "GREATER_THAN", "QUESTION_MARK", "AT", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "OS_KEY", "", "CONTEXT_MENU", "", "SLEEP", "NUMPAD0", "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9", "MULTIPLY", "ADD", "SEPARATOR", "SUBTRACT", "DECIMAL", "DIVIDE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "", "", "", "", "", "NUM_LOCK", "SCROLL_LOCK", "WIN_OEM_FJ_JISHO", "WIN_OEM_FJ_MASSHOU", "WIN_OEM_FJ_TOUROKU", "WIN_OEM_FJ_LOYA", "WIN_OEM_FJ_ROYA", "", "", "", "", "", "", "", "", "", "CIRCUMFLEX", "EXCLAMATION", "DOUBLE_QUOTE", "HASH", "DOLLAR", "PERCENT", "AMPERSAND", "UNDERSCORE", "OPEN_PAREN", "CLOSE_PAREN", "ASTERISK", "PLUS", "PIPE", "HYPHEN_MINUS", "OPEN_CURLY_BRACKET", "CLOSE_CURLY_BRACKET", "TILDE", "", "", "", "", "VOLUME_MUTE", "VOLUME_DOWN", "VOLUME_UP", "", "", "SEMICOLON", "EQUALS", "COMMA", "MINUS", "PERIOD", "SLASH", "BACK_QUOTE", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "OPEN_BRACKET", "BACK_SLASH", "CLOSE_BRACKET", "QUOTE", "", "META", "ALTGR", "", "WIN_ICO_HELP", "WIN_ICO_00", "", "WIN_ICO_CLEAR", "", "", "WIN_OEM_RESET", "WIN_OEM_JUMP", "WIN_OEM_PA1", "WIN_OEM_PA2", "WIN_OEM_PA3", "WIN_OEM_WSCTRL", "WIN_OEM_CUSEL", "WIN_OEM_ATTN", "WIN_OEM_FINISH", "WIN_OEM_COPY", "WIN_OEM_AUTO", "WIN_OEM_ENLW", "WIN_OEM_BACKTAB", "ATTN", "CRSEL", "EXSEL", "EREOF", "PLAY", "ZOOM", "", "PA1", "WIN_OEM_CLEAR", ""], System.String);
                    if (keycode >= 0 && keycode < codenames.length) {
                        return codenames[System.Array.index(keycode, codenames)];
                    }
                    var kc = keycode;
                    return String.FromCharCode(kc);
                },
                MakeShallowCopy: function (source, fieldNames) {
                    if (fieldNames === void 0) { fieldNames = null; }
                    var target = { };
                    var Fields = fieldNames;
                    if (Fields == null) {
                        Fields = Object.keys(source);
                    }
                    var i = 0;
                    while (i < Fields.length) {
                        var f = Fields[System.Array.index(i, Fields)];
                        target[f] = CirnoGame.Helper.GetField(source, f);
                        i = (i + 1) | 0;
                    }
                    return target;
                }
            }
        }
    });

    Bridge.define("CirnoGame.HelperExtensions", {
        statics: {
            methods: {
                Pick: function (T, list, RND) {
                    var $t;
                    if (RND === void 0) { RND = null; }
                    if (RND == null) {
                        RND = new System.Random.ctor();
                    }
                    var L = new (System.Collections.Generic.List$1(T)).ctor();
                    $t = Bridge.getEnumerator(list, T);
                    try {
                        while ($t.moveNext()) {
                            var item = $t.Current;
                            L.add(item);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }return L.getItem(RND.next$1(L.Count));
                },
                ForEach: function (T, list, action) {
                    var $t;
                    $t = Bridge.getEnumerator(list, T);
                    try {
                        while ($t.moveNext()) {
                            var item = $t.Current;
                            action(item);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }},
                ForEach$1: function (T, list, methodName) {
                    var $t;
                    $t = Bridge.getEnumerator(list, T);
                    try {
                        while ($t.moveNext()) {
                            var item = $t.Current;
                            var A = Bridge.unbox(item[methodName]);
                            A();
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }},
                AddIfNew: function (T, list, item) {
                    var i = 0;
                    var ln = list.Count;
                    var A = item;
                    while (i < ln) {
                        var B = list.getItem(i);
                        if (A == B) {
                            return;
                        }
                        i = (i + 1) | 0;
                    }
                    list.add(item);
                    /* if (!list.Contains(item))
                    {
                       list.Add(item);
                    }*/
                },
                RemoveAll: function (T, list, predicate) {

                    //foreach (var item in list)
                    var i = 0;
                    while (i < list.Count) {
                        var item = list.getItem(i);
                        //action(item);
                        if (predicate(item)) {
                            //list.rem
                            list.remove(item);
                            i = (i - 1) | 0;
                        }
                        i = (i + 1) | 0;
                    }
                },
                PushIfNew: function (T, list, val) {
                    if (!CirnoGame.HelperExtensions.ContainsB(T, list, val)) {
                        list.push(val);
                    }
                },
                PushRange: function (T, list, val) {
                    if (val === void 0) { val = []; }
                    var i = 0;
                    while (i < val.length) {
                        list.push(val[System.Array.index(i, val)]);
                        i = (i + 1) | 0;
                    }
                },
                Clear$1: function (T, list) {
                    var i = list.length;
                    while (Bridge.identity(i, (i = (i - 1) | 0)) > 0) {
                        list.pop();
                    }
                },
                Clear: function (G) {
                    var C = G.canvas;
                    G.clearRect(0, 0, C.width, C.height);
                },
                ReplaceAll: function (T, list, Source, Destination) {
                    var i = -1;
                    i = CirnoGame.HelperExtensions.IndexOf(T, list, Source, ((i + 1) | 0), 3);
                    var ln = Source.length;
                    while (i >= 0) {
                        var j = 0;

                        while (j < ln) {
                            list[System.Array.index(((i + j) | 0), list)] = Destination[System.Array.index(j, Destination)];
                            j = (j + 1) | 0;
                        }
                        i = CirnoGame.HelperExtensions.IndexOf(T, list, Source, ((i + 1) | 0), 3);
                    }
                },
                WhereB: function (T, list, predicate) {
                    var ret = System.Array.init(0, null, System.Object);
                    var i = 0;
                    var ln = list.length;
                    while (i < ln) {
                        var item = list[System.Array.index(i, list)];
                        if (predicate(item)) {
                            ret.push(item);
                        }
                        i = (i + 1) | 0;
                    }

                    return Bridge.unbox(ret);
                },
                ContainsB$1: function (T, list, Value) {
                    var L = Bridge.unbox(list.items);
                    return CirnoGame.HelperExtensions.ContainsB(T, L, Value);
                },
                ContainsB: function (T, list, Value) {
                    var i = 0;
                    var ln = list.length;
                    while (i < ln) {
                        var O = list[System.Array.index(i, list)];
                        if (O == Value) {
                            return true;
                        }
                        i = (i + 1) | 0;
                    }
                    return false;
                },
                IndexOf: function (T, list, Value, index, structureSize) {
                    if (index === void 0) { index = 0; }
                    if (structureSize === void 0) { structureSize = 1; }
                    var i = index;
                    var ln = list.length;
                    var vln = Value.length;
                    var O = Value[System.Array.index(0, Value)];
                    var A;
                    var B;
                    while (i < ln && i >= 0) {
                        /* var c = i+1;
                        i = -1;
                        B = Value[0];
                        while (c < list.Length && i==-1)
                        {
                           A = list[c];
                           if (A == B)
                           {
                               i = c;
                           }
                           c++;
                        }
                        if (i == -1)
                        {
                           return -1;
                        }*/
                        i = list.indexOf(Bridge.unbox(O), ((i + 1) | 0));
                        while (i >= 0 && i % structureSize > 0) {
                            i = list.indexOf(Bridge.unbox(O), ((i + 1) | 0));
                        }
                        if (i === -1) {
                            return -1;
                        }
                        var k = 1;
                        var l = (i + 1) | 0;

                        if (i < ln && i >= 0) {
                            var ok = true;
                            while (ok && k < vln) {
                                A = list[System.Array.index(l, list)];
                                B = Value[System.Array.index(k, Value)];
                                if (!Bridge.referenceEquals(A, B)) {
                                    ok = false;
                                }
                                k = (k + 1) | 0;
                                l = (l + 1) | 0;
                            }
                            if (ok) {
                                return i;
                            }
                        }
                    }
                    return -1;
                },
                Identical: function (T, list, list2) {
                    if (Bridge.referenceEquals(list, list2)) {
                        return true;
                    }
                    if (list == null || list2 == null) {
                        return false;
                    }
                    var ln = list.length;
                    if (ln === list2.length) {
                        var i = 0;

                        while (i < ln) {
                            var A = list[System.Array.index(i, list)];
                            var B = list2[System.Array.index(i, list2)];
                            if (!Bridge.referenceEquals(A, B)) {
                                return false;
                            }
                            i = (i + 1) | 0;
                        }
                        return true;
                    }
                    return false;
                },
                ReverseOrderWithStructure: function (T, list, size) {
                    //T[] ret = new T[0];
                    var ret = new (System.Collections.Generic.List$1(T)).ctor();
                    var i = 0;
                    var ln = list.length;
                    while (i < ln) {
                        var j = 0;
                        while (j < size) {
                            //ret.Push(list[j]);
                            ret.insert(0, list[System.Array.index((((((size - 1) | 0)) - j) | 0), list)]);
                            j = (j + 1) | 0;
                        }
                        i = (i + size) | 0;
                    }
                },
                /**
                 * not yet tested with deep inheritence...
                 *
                 * @static
                 * @public
                 * @this CirnoGame.HelperExtensions
                 * @memberof CirnoGame.HelperExtensions
                 * @param   {Function}         T           
                 * @param   {System.Object}    instance
                 * @return  {boolean}
                 */
                IsInstanceOfTypeFast: function (T, instance) {
                    var C = Bridge.unbox(instance).ctor;
                    var A = Bridge.unbox(T.$$inheritors); //list of all types that inherit from this type
                    return (Bridge.referenceEquals(C, T) || (A != null && A.indexOf(C) >= 0));
                }
            }
        }
    });

    Bridge.define("CirnoGame.ICombatant", {
        $kind: "interface"
    });

    Bridge.define("CirnoGame.IHarmfulEntity", {
        $kind: "interface"
    });

    Bridge.define("CirnoGame.ILightProducer", {
        $kind: "interface"
    });

    Bridge.define("CirnoGame.ILightSource", {
        $kind: "interface"
    });

    Bridge.define("CirnoGame.InputController", {
        statics: {
            fields: {
                NumberOfActions: 0,
                GM: null
            },
            ctors: {
                init: function () {
                    this.NumberOfActions = 8;
                }
            }
        },
        fields: {
            InputMapping: null
        },
        props: {
            id: null
        },
        ctors: {
            ctor: function (id) {
                if (id === void 0) { id = "Keyboard"; }

                this.$initialize();
                this.id = id;
                this.InputMapping = new (System.Collections.Generic.List$1(CirnoGame.InputMap)).ctor();

                if (Bridge.referenceEquals(id, "Keyboard")) {
                    this.initkeyboard();
                } else {
                    this.initgamepad();
                }
                if (CirnoGame.InputController.GM == null) {
                    if (CirnoGame.GamePadManager._this == null) {
                        CirnoGame.GamePadManager._this = new CirnoGame.GamePadManager();
                    }
                    CirnoGame.InputController.GM = CirnoGame.GamePadManager._this;
                }
            }
        },
        methods: {
            CopyMap: function () {
                /* dynamic D = new object();
                return D;*/
                var fields = System.Array.init(["map", "antimap", "name", "axis", "controllerID"], System.String);
                var ret = System.Array.init(this.InputMapping.Count, null, System.Object);
                var i = 0;
                while (i < ret.length) {
                    ret[System.Array.index(i, ret)] = CirnoGame.Helper.MakeShallowCopy(this.InputMapping.getItem(i), fields);
                    i = (i + 1) | 0;
                }
                return ret;
            },
            CopyFromMap: function (Map) {
                var fields = System.Array.init(["map", "antimap", "name", "axis", "controllerID"], System.String);

                var i = 0;
                while (i < Map.length) {
                    if (i >= this.InputMapping.Count) {
                        this.InputMapping.add(new CirnoGame.InputMap.ctor());
                    }
                    var IM = this.InputMapping.getItem(i);
                    CirnoGame.Helper.CopyFields(Map[System.Array.index(i, Map)], IM, fields);
                    //ret[i] = Helper.MakeShallowCopy(InputMapping[i], fields);
                    i = (i + 1) | 0;
                }
            },
            initkeyboard: function () {
                var i = 0;
                while (i < CirnoGame.InputController.NumberOfActions) {
                    var map = new CirnoGame.InputMap.$ctor1(-1);
                    if (i === 0) {
                        map.map = 39;
                        map.antimap = 37;

                        /* map.map = 68;
                        map.antimap= 65;*/
                    }
                    if (i === 1) {
                        map.map = 40;
                        map.antimap = 38;

                        /* map.map = 83;
                        map.antimap = 87;*/
                    }

                    if (i === 2) {
                        //map.map = 32;
                        map.map = 90;
                    }
                    if (i === 3) {
                        map.map = 88;
                    }
                    if (i === 4) {
                        map.map = 65; //a
                    }
                    if (i === 5) {
                        map.map = 13; //enter
                    }
                    this.InputMapping.add(map);
                    i = (i + 1) | 0;
                }
            },
            initgamepad: function () {
                var i = 0;
                while (i < CirnoGame.InputController.NumberOfActions) {
                    var map = new CirnoGame.InputMap.$ctor1(-1);
                    if (i === 0) {
                        map.map = 0;
                        map.axis = true;
                    }
                    if (i === 1) {
                        map.map = 1;
                        map.axis = true;
                    }

                    if (i > 1) {
                        map.map = (i - 2) | 0;
                    }
                    this.InputMapping.add(map);
                    i = (i + 1) | 0;
                }
            },
            getState: function (action, map) {
                if (map === void 0) { map = null; }
                if (map == null) {
                    map = this.InputMapping.getItem(action);
                }
                /* InputController IC = this;
                if (map.controller != null)
                {
                   IC = map.controller;
                }*/
                var TID = this.id;
                if (!Bridge.referenceEquals(map.controllerID, "")) {
                    TID = map.controllerID;
                }

                if (Bridge.referenceEquals(TID, "Keyboard")) {
                    return this.getKeyboardMapState(map);
                } else if (Bridge.referenceEquals(TID, "Mouse")) {
                    return this.getMouseMapState(map);
                } else {
                    return this.getGamepadMapState(map);
                }
            },
            getPressed: function (action, map) {
                if (map === void 0) { map = null; }
                return this.getState(action, map) >= 0.7;
            },
            FindAnyPressedGamePadInput: function () {
                var ret = new CirnoGame.InputMap.ctor();
                var L = CirnoGame.GamePadManager._this.activeGamepads;
                L.forEach(function (G) {
                    if (ret.map === -1) {
                        ret.controllerID = G.id;
                        var GB = System.Linq.Enumerable.from(G.buttons).where(function (B) {
                                return B.pressed;
                            }).toArray(CirnoGame.GamePadButton);
                        if (GB.length > 0) {
                            ret.axis = false;
                            var tmp = GB[System.Array.index(0, GB)];
                            ret.map = new (System.Collections.Generic.List$1(CirnoGame.GamePadButton)).$ctor1(G.buttons).indexOf(tmp);
                        } else {
                            var i = 0;
                            while (i < G.axes.length && ret.map === -1) {
                                if (Math.abs(G.axes[System.Array.index(i, G.axes)]) > 0.7 && Math.abs(G.axes[System.Array.index(i, G.axes)]) < 2.0) {
                                    ret.axis = true;
                                    ret.map = i;
                                    if (G.axes[System.Array.index(i, G.axes)] < 0) {
                                        ret.name = "anti";
                                        ret.antimap = i;
                                    }
                                }
                                i = (i + 1) | 0;
                            }
                        }
                    }
                });
                if (ret.map !== -1) {
                    return ret;
                }
                return null;
            },
            getMapControllerID: function (map) {
                if (!Bridge.referenceEquals(map.controllerID, "")) {
                    return map.controllerID;
                } else {
                    return this.id;
                }
            },
            getMapControllerID$1: function (action) {
                return this.getMapControllerID(this.InputMapping.getItem(action));
            },
            getGamepadMapState: function (map) {
                var TID = this.id;
                if (!Bridge.referenceEquals(map.controllerID, "")) {
                    TID = map.controllerID;
                }
                var P = CirnoGame.GamePadManager._this.GetPad(TID);
                if (P == null || !P.connected) {
                    return 0;
                }
                if (!map.axis) {
                    if (P.buttons[System.Array.index(map.map, P.buttons)].pressed) {
                        return 1;
                    } else if (map.antimap >= 0 && P.buttons[System.Array.index(map.antimap, P.buttons)].pressed) {
                        return -1;
                    }
                    return 0;
                } else {
                    return P.axes[System.Array.index(map.map, P.axes)];
                }
            },
            getKeyboardMapState: function (map) {
                var L = CirnoGame.KeyboardManager._this.PressedButtons;
                if (L.contains(map.map)) {
                    return 1.0;
                } else if (L.contains(map.antimap)) {
                    return -1.0;
                }
                return 0;
            },
            getMouseMapState: function (map) {
                var L = CirnoGame.KeyboardManager._this.PressedMouseButtons;
                if (L.contains(map.map)) {
                    return 1.0;
                } else if (L.contains(map.antimap)) {
                    return -1.0;
                }
                return 0;
            }
        }
    });

    Bridge.define("CirnoGame.InputControllerManager", {
        statics: {
            fields: {
                __this: null
            },
            props: {
                _this: {
                    get: function () {
                        if (CirnoGame.InputControllerManager.__this == null) {
                            CirnoGame.InputControllerManager.__this = new CirnoGame.InputControllerManager();
                        }
                        return CirnoGame.InputControllerManager.__this;
                    }
                }
            },
            methods: {
                Init: function () {
                    if (CirnoGame.InputControllerManager.__this == null) {
                        CirnoGame.InputControllerManager.__this = new CirnoGame.InputControllerManager();
                    }
                }
            }
        },
        fields: {
            Controllers: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.Controllers = new (System.Collections.Generic.List$1(CirnoGame.InputController)).ctor();

                this.Controllers.add(new CirnoGame.InputController());
                var gamepads = CirnoGame.GamePadManager._this.activeGamepads;
                var i = 0;
                while (i < gamepads.Count) {
                    this.Controllers.add(new CirnoGame.InputController(gamepads.getItem(i).id));
                    i = (i + 1) | 0;
                }
            }
        }
    });

    Bridge.define("CirnoGame.InputMap", {
        fields: {
            map: 0,
            antimap: 0,
            name: null,
            axis: false,
            controllerID: null
        },
        ctors: {
            init: function () {
                this.map = -1;
                this.antimap = -1;
                this.name = "";
                this.axis = false;
                this.controllerID = "";
            },
            ctor: function () {
                this.$initialize();
                this.axis = false;
            },
            $ctor1: function (map, antimap, axis) {
                if (antimap === void 0) { antimap = -1; }
                if (axis === void 0) { axis = false; }

                this.$initialize();
                this.map = map;
                this.antimap = antimap;
                this.axis = axis;
            }
        }
    });

    Bridge.define("CirnoGame.JSONArchive", {
        statics: {
            methods: {
                Open: function (ArchiveFile, action) {
                    var XHR = new XMLHttpRequest();
                    //XHR.ResponseType = XMLHttpRequestResponseType.Blob;
                    XHR.onload = function (Evt) {
                        action(new CirnoGame.JSONArchive(XHR.responseText));
                    };
                    XHR.open("GET", ArchiveFile, false);
                    XHR.send();
                    //if (XHR.Status)

                }
            }
        },
        fields: {
            Data: null,
            Images: null
        },
        ctors: {
            init: function () {
                this.Data = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();
                this.Images = new (System.Collections.Generic.Dictionary$2(System.String,HTMLImageElement))();
            },
            ctor: function (Archive) {
                this.$initialize();
                //this.Archive = Archive;
                var D = JSON.parse(Archive);
                var i = 0;
                var ln = D.length;
                while (i < ln) {
                    var A = D[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), D)];
                    this.Data.set(A[System.Array.index(0, A)].toLowerCase(), A[System.Array.index(1, A)]);
                }
            }
        },
        methods: {
            PreloadImages: function (action, delay) {
                if (delay === void 0) { delay = 100; }
                var K = System.Linq.Enumerable.from(this.Data.getKeys()).toArray();
                var i = 0;
                while (i < this.Data.count) {
                    var A = K[System.Array.index(i, K)];
                    this.GetImage(A);
                    i = (i + 1) | 0;
                }
                Bridge.global.setTimeout(action, delay);
            },
            GetData: function (file) {
                var f = file.toLowerCase();
                if (this.Data.containsKey(f)) {
                    return this.Data.get(f);
                }
                return null;
            },
            GetImage: function (file) {
                var f = file.toLowerCase();
                if (this.Images.containsKey(f)) {
                    return this.Images.get(f);
                }
                var D = this.GetData(f);
                if (D == null) {
                    return null;
                }
                var ret = new Image();
                ret.onload = function (E) {
                    console.log(System.String.concat("loaded ", f, " from JSON!"));
                };
                ret.src = System.String.concat("data:image/png;base64,", D);
                this.Images.set(f, ret);
                return ret;
            }
        }
    });

    Bridge.define("CirnoGame.KeyboardManager", {
        statics: {
            fields: {
                __this: null
            },
            props: {
                _this: {
                    get: function () {
                        if (CirnoGame.KeyboardManager.__this == null) {
                            CirnoGame.KeyboardManager.__this = new CirnoGame.KeyboardManager();
                        }
                        return CirnoGame.KeyboardManager.__this;
                    }
                }
            },
            methods: {
                Init: function () {
                    if (CirnoGame.KeyboardManager.__this == null) {
                        CirnoGame.KeyboardManager.__this = new CirnoGame.KeyboardManager();
                    }
                },
                Update: function () {
                    CirnoGame.KeyboardManager.__this.TappedButtons.clear();
                    CirnoGame.KeyboardManager.__this.TappedMouseButtons.clear();
                },
                NeverinBounds: function (evt) {
                    return !CirnoGame.App.ScreenBounds.containsPoint$1(CirnoGame.KeyboardManager._this.CMouse.X, CirnoGame.KeyboardManager._this.CMouse.Y);
                },
                onKeyDown: function (evt) {
                    var keyCode = evt.keyCode;

                    if (!CirnoGame.KeyboardManager.__this.PressedButtons.contains(keyCode)) {
                        CirnoGame.KeyboardManager.__this.PressedButtons.add(keyCode);
                        CirnoGame.KeyboardManager.__this.TappedButtons.add(keyCode);
                    }
                    if ((keyCode >= 37 && keyCode <= 40) || keyCode === 32 || keyCode === 112) {
                        return false;
                    }
                    return true;
                },
                onKeyUp: function (evt) {
                    var keyCode = evt.keyCode;

                    if (CirnoGame.KeyboardManager.__this.PressedButtons.contains(keyCode)) {
                        CirnoGame.KeyboardManager.__this.PressedButtons.remove(keyCode);
                    }
                },
                onMouseDown: function (evt) {
                    var btn = evt.button;
                    if (!CirnoGame.KeyboardManager.__this.PressedMouseButtons.contains(btn)) {
                        CirnoGame.KeyboardManager.__this.PressedMouseButtons.add(btn);
                        CirnoGame.KeyboardManager.__this.TappedMouseButtons.add(btn);
                    }
                    return btn < 1;
                },
                onMouseUp: function (evt) {
                    var btn = evt.button;
                    if (CirnoGame.KeyboardManager.__this.PressedMouseButtons.contains(btn)) {
                        CirnoGame.KeyboardManager.__this.PressedMouseButtons.remove(btn);
                    }
                    return btn < 1;
                },
                onMouseMove: function (evt) {
                    CirnoGame.KeyboardManager._this.MousePosition = new CirnoGame.Vector2(evt.clientX, evt.clientY);

                    //float left = float.Parse(App.Canvas.Style.Left.Replace("px", ""));
                    if (System.String.indexOf(CirnoGame.App.Div.style.left, "px") < 0) {
                        return;
                    }
                    var left = System.Single.parse(System.String.replaceAll(CirnoGame.App.Div.style.left, "px", ""));
                    var x = evt.clientX - left;
                    var y = evt.clientY;

                    //float scale = (App.Canvas.Width * 1.25f) / float.Parse(App.Canvas.Style.Width.Replace("px", ""));

                    //float scale = (App.Canvas.Width) / float.Parse(App.Canvas.Style.Width.Replace("px", ""));
                    var scale = (CirnoGame.App.Canvas.width) / System.Single.parse(System.String.replaceAll(CirnoGame.App.Div.style.width, "px", ""));
                    CirnoGame.KeyboardManager._this.CMouse = new CirnoGame.Vector2(x * scale, y * scale);
                    //Console.WriteLine("mx:"+_this.CMouse.x + " my:" + _this.CMouse.y);
                }
            }
        },
        fields: {
            PressedButtons: null,
            TappedButtons: null,
            PressedMouseButtons: null,
            TappedMouseButtons: null,
            MousePosition: null,
            CMouse: null
        },
        ctors: {
            init: function () {
                this.MousePosition = new CirnoGame.Vector2();
                this.CMouse = new CirnoGame.Vector2();
            },
            ctor: function () {
                this.$initialize();
                this.PressedButtons = new (System.Collections.Generic.List$1(System.Int32)).ctor();
                this.TappedButtons = new (System.Collections.Generic.List$1(System.Int32)).ctor();
                this.PressedMouseButtons = new (System.Collections.Generic.List$1(System.Int32)).ctor();
                this.TappedMouseButtons = new (System.Collections.Generic.List$1(System.Int32)).ctor();

                var KD = CirnoGame.KeyboardManager.onKeyDown;
                document.onkeydown = KD;

                var KU = CirnoGame.KeyboardManager.onKeyUp;
                document.onkeyup = KU;

                var MM = CirnoGame.KeyboardManager.onMouseMove;
                document.onmousemove = MM;

                var MD = CirnoGame.KeyboardManager.onMouseDown;
                document.onmousedown = MD;

                var MU = CirnoGame.KeyboardManager.onMouseUp;
                document.onmouseup = MU;

                var NB = CirnoGame.KeyboardManager.NeverinBounds;
                document.oncontextmenu = NB;
            }
        }
    });

    Bridge.define("CirnoGame.MapGenerator", {
        statics: {
            fields: {
                rootroom: null,
                doorroom: null,
                blank: null
            },
            ctors: {
                init: function () {
                    this.blank = new CirnoGame.TileData();
                }
            },
            methods: {
                Generate: function (game) {
                    var player = game.player; //player character
                    var map = game.TM; //the tilemap to generate
                    var bounds = game.stageBounds; //the bounds to stay within

                    //List<Rectangle> rooms = new List<Rectangle>();

                    var X = 0;
                    var Y = 0;
                    if (Math.random() < 0.5) {
                        X = Math.random() < 0.5 ? -1 : 1;
                    } else {
                        Y = Math.random() < 0.5 ? -1 : 1;
                    }
                    var T = new CirnoGame.TileData();
                    T.texture = 1;
                    T.enabled = true;
                    T.visible = true;
                    T.map = map;
                    T.solid = true;
                    T.topSolid = true;
                    //map.SetAll(T);
                    player.x = (bounds.left + bounds.right) / 2;
                    player.y = (bounds.top + bounds.bottom) / 2;
                    //pathMiner(game,map.columns/2,map.rows/2,X,Y,20);
                    CirnoGame.MapGenerator.pathMiner(game, ((Bridge.Int.div(map.columns, 2)) | 0), ((Bridge.Int.div(map.rows, 4)) | 0), X, Y, 30);

                    var V = CirnoGame.MapGenerator.FindEmptySpace(game);
                    if (CirnoGame.Vector2.op_Inequality(V, null)) {
                        player.x = V.X;
                        player.y = V.Y;
                        console.log("spawning at:" + Bridge.Int.clip32(V.X) + "," + Bridge.Int.clip32(V.Y));
                    } else {
                        console.log("cannot locate a spawn point...");
                    }
                },
                BoxyGenerate: function (game) {
                    console.log("boxy generate");
                    var player = game.player; //player character
                    var map = game.TM; //the tilemap to generate
                    var bounds = game.stageBounds; //the bounds to stay within
                    CirnoGame.MapRoom.PlacedRooms = new (System.Collections.Generic.List$1(CirnoGame.MapRoom)).ctor();
                    CirnoGame.MapRoom.OpenRooms = new (System.Collections.Generic.List$1(CirnoGame.MapRoom)).ctor();

                    var SX = (Bridge.Int.div(map.columns, 2)) | 0;
                    var SY = (Bridge.Int.div(map.rows, 3)) | 0;
                    var root = new CirnoGame.MapRoom();
                    root.SX = SX;
                    root.SY = SY;
                    root.EX = (((SX + 6) | 0) + Bridge.Int.clip32((Math.random() * 10))) | 0;
                    root.EY = (((SY + 6) | 0) + Bridge.Int.clip32((Math.random() * 10))) | 0;

                    root.game = game;
                    CirnoGame.MapGenerator.rootroom = root;

                    //var roomtotal = 12+(int)(Math.Random() * 10);
                    //var roomtotal = 16 + (int)(Math.Random() * 16);
                    var roomtotal = (16 + Bridge.Int.clip32((Math.random() * 18))) | 0;
                    //var rooms = 0;

                    var attempts = 400;
                    var R = root;
                    if (!root.PlaceAndExpand()) {
                        console.log("Couldn't generate root room.");
                        return;
                    }
                    while (CirnoGame.MapRoom.OpenRooms.Count < roomtotal && attempts > 0) {
                        var L = CirnoGame.HelperExtensions.Pick(Bridge.global.CirnoGame.MapRoom, CirnoGame.MapRoom.FindValidUnplacedRooms());
                        if (L.PlaceAndExpand()) {
                            //rooms++;
                        }
                        attempts = (attempts - 1) | 0;
                    }
                    var RR = CirnoGame.Rectangle.op_Subtraction(game.stageBounds, game.TM.position);
                    RR.width -= game.TM.tilesize;
                    RR.height -= game.TM.tilesize;
                    game.TM.DrawRect(RR);
                    game.TM.ApplyBreakable();
                    var secrets = Math.random() < 0.3 ? 1 : 0;
                    if (secrets > 0 && Math.random() < 0.3) {
                        secrets = (secrets + 1) | 0;
                    }
                    while (secrets > 0) {
                        var L1 = CirnoGame.HelperExtensions.Pick(Bridge.global.CirnoGame.MapRoom, CirnoGame.MapRoom.FindValidUnplacedRooms());
                        if (L1.PlaceAndExpand()) {
                            L1.MakeSecret();
                            var lever = CirnoGame.MapGenerator.AttemptCreateLever(game, L1);
                            game.AddEntity(lever);
                            console.log("Placed secret room at:" + L1.SX + "," + L1.SY);
                        }
                        secrets = (secrets - 1) | 0;
                    }
                    var V = CirnoGame.MapGenerator.FindEmptySpace(game);
                    if (CirnoGame.Vector2.op_Inequality(V, null)) {
                        /* player.x = V.X;
                        player.y = V.Y;*/
                        game.Door.Position.CopyFrom(V);
                        game.Door.DropToGround();
                        CirnoGame.MapGenerator.doorroom = CirnoGame.MapRoom.FindRoom(game.Door.Position);
                        if (CirnoGame.MapGenerator.doorroom == null) {
                            console.log("Door room could not be determined...");
                        }

                        var PC = player;
                        //PC.MoveToNewSpawn(V);
                        PC.MoveToNewSpawn(game.Door.Position);
                        console.log("spawning at:" + Bridge.Int.clip32(V.X) + "," + Bridge.Int.clip32(V.Y));
                    } else {
                        console.log("cannot locate a spawn point...");
                    }

                },
                AttemptCreateLever: function (game, Target) {
                    var i = 0;
                    while (i < 20) {
                        var lever = CirnoGame.RoomOpeningLever.FindAndPlaceOnWall(game, CirnoGame.MapRoom.FindAnyEmptySpot(), Target);
                        if (lever != null) {
                            return lever;
                        }
                    }
                    return null;
                },
                FindEmptySpace: function (game) {
                    var map = game.TM;
                    var bounds = game.stageBounds; //the bounds to stay within
                    var i = 0;
                    var ret = new CirnoGame.Vector2();
                    var tmp = new CirnoGame.Vector2();
                    while (i < 2000) {
                        ret.X = bounds.left + (Math.random() * (bounds.width - map.tilesize));
                        ret.Y = bounds.top + (Math.random() * (bounds.bottom - map.tilesize));
                        if (!map.CheckForTile(ret).visible) {
                            tmp.X = ret.X;
                            tmp.Y = ret.Y - map.tilesize;
                            if (!map.CheckForTile(ret).visible) {
                                return ret;
                            }
                        }
                        i = (i + 1) | 0;
                    }
                    //return ret;
                    return null;
                },
                pathMiner: function (game, X, Y, Xdir, YDir, limit) {
                    if (limit <= 0) {
                        return;
                    }
                    var player = game.player; //player character
                    var map = game.TM; //the tilemap to generate
                    var bounds = game.stageBounds; //the bounds to stay within

                    var dist = 0;
                    var pow = 1;
                    if (YDir !== 0) {
                        pow = 2;
                    }
                    while (dist < 7 && Math.random() < (Math.pow(0.95, pow))) {
                        X = (X + Xdir) | 0;
                        Y = (Y + YDir) | 0;
                        CirnoGame.MapGenerator.Erase(map, X, Y, 3);
                        if (Math.random() < (0.2 * pow)) {
                            if (Xdir === 0) {
                                X = (X + (Math.random() < 0.5 ? 1 : -1)) | 0;
                            } else {
                                Y = (Y + (Math.random() < 0.5 ? 1 : -1)) | 0;
                            }
                        } else if (Math.random() < (0.02 * pow) && limit > 4) {
                            limit = (Bridge.Int.div(limit, 2)) | 0;
                            var XD = Math.random() < 0.5 ? YDir : ((-YDir) | 0);
                            var YD = Math.random() < 0.5 ? Xdir : ((-Xdir) | 0);
                            CirnoGame.MapGenerator.pathMiner(game, X, Y, XD, YD, limit);
                        }
                    }
                    limit = (limit - 1) | 0;
                    if (limit > 1) {
                        CirnoGame.MapGenerator.roomMiner(game, X, Y, Xdir, YDir, limit);
                    }

                },
                roomMiner: function (game, X, Y, Xdir, YDir, limit) {
                    if (limit <= 0) {
                        return;
                    }

                    var SZ = Bridge.Int.clip32(4 + (Math.random() * 4));
                    X = (X + (Bridge.Int.mul(Xdir, (((Bridge.Int.div(SZ, 2)) | 0))))) | 0;
                    Y = (Y + (Bridge.Int.mul(YDir, (((Bridge.Int.div(SZ, 2)) | 0))))) | 0;

                    //Erase(game.TM, X, Y, (SZ * 2)+2);
                    CirnoGame.MapGenerator.EraseAndRando(game.TM, X, Y, (((Bridge.Int.mul(SZ, 2)) + 2) | 0));

                    var XD = Xdir;
                    var YD = YDir;
                    if (Math.random() < 0.2 || (YD !== 0 && Math.random() < 0.65) || YD < 0) {
                        XD = Math.random() < 0.5 ? YDir : ((-YDir) | 0);
                        YD = Math.random() < 0.5 ? Xdir : ((-Xdir) | 0);
                        if (YD < 0) {
                            YD = (-YD) | 0;
                        }
                    }
                    Xdir = XD;
                    YDir = YD;

                    X = (X + (Bridge.Int.mul(Xdir, (((Bridge.Int.div(SZ, 2)) | 0))))) | 0;
                    Y = (Y + (Bridge.Int.mul(YDir, (((Bridge.Int.div(SZ, 2)) | 0))))) | 0;

                    limit = (limit - 1) | 0;
                    CirnoGame.MapGenerator.pathMiner(game, X, Y, Xdir, YDir, limit);
                },
                Erase: function (TM, column, row, size) {
                    TM.ClearRect$1(((column - (((Bridge.Int.div(size, 2)) | 0))) | 0), ((row - (((Bridge.Int.div(size, 2)) | 0))) | 0), (size), (size));
                },
                EraseAndRando: function (TM, column, row, size) {
                    var SX = (column - (((Bridge.Int.div(size, 2)) | 0))) | 0;
                    var SY = (row - (((Bridge.Int.div(size, 2)) | 0))) | 0;
                    TM.ClearRect$1(SX, SY, (size), (size));
                    TM._GenRect(SX, SY, ((SX + (size)) | 0), ((SY + (size)) | 0));
                }
            }
        }
    });

    Bridge.define("CirnoGame.MapRoom", {
        statics: {
            fields: {
                PlacedRooms: null,
                OpenRooms: null,
                RNG: null
            },
            ctors: {
                init: function () {
                    this.PlacedRooms = new (System.Collections.Generic.List$1(CirnoGame.MapRoom)).ctor();
                    this.OpenRooms = new (System.Collections.Generic.List$1(CirnoGame.MapRoom)).ctor();
                    this.RNG = new System.Random.ctor();
                }
            },
            methods: {
                FindValidUnplacedRooms: function () {
                    var L = new (System.Collections.Generic.List$1(CirnoGame.MapRoom)).ctor();
                    var i = 0;
                    var ln = CirnoGame.MapRoom.OpenRooms.Count;
                    while (i < ln) {
                        var P = CirnoGame.MapRoom.OpenRooms.getItem(i);
                        L.addRange(System.Linq.Enumerable.from(P.ExitRooms).where(function (F) {
                                return F.CanBePlaced() && !F.placed;
                            }));
                        i = (i + 1) | 0;
                    }
                    return L;
                },
                FindRoom: function (V) {
                    var L = System.Linq.Enumerable.from(CirnoGame.MapRoom.OpenRooms).where(function (R) {
                            return R.ContainsPosition(V);
                        }).toArray(CirnoGame.MapRoom);
                    if (L.length > 0) {
                        return L[System.Array.index(0, L)];
                    }
                    return null;
                },
                FindAnyEmptySpot: function () {
                    if (CirnoGame.MapRoom.OpenRooms.Count < 1) {
                        return null;
                    }
                    var i = 0;
                    while (i < 10) {
                        var ret = CirnoGame.HelperExtensions.Pick(Bridge.global.CirnoGame.MapRoom, CirnoGame.MapRoom.OpenRooms, CirnoGame.MapRoom.RNG).FindEmptySpot();
                        if (CirnoGame.Vector2.op_Inequality(ret, null)) {
                            return ret;
                        }
                        i = (i + 1) | 0;
                    }
                    return null;
                }
            }
        },
        fields: {
            SX: 0,
            SY: 0,
            EX: 0,
            EY: 0,
            placed: false,
            secret: false,
            ExitRooms: null,
            parent: null,
            goldchests: null,
            game: null
        },
        ctors: {
            init: function () {
                this.placed = false;
                this.secret = false;
                this.ExitRooms = new (System.Collections.Generic.List$1(CirnoGame.MapRoom)).ctor();
                this.goldchests = System.Array.init(0, null, CirnoGame.Chest);
            }
        },
        methods: {
            IsValid: function () {
                var map = this.game.TM;
                if (this.SX >= 0 && this.SY >= 0 && this.EX < map.columns && this.EY < map.rows) {
                    //in bounds
                    return true;
                }
                return false;
            },
            CanBePlaced: function () {
                var map = this.game.TM;
                if (this.IsValid()) {
                    if (map.IsRectSolid(this.SX, this.SY, this.EX, this.EY)) {
                        return true;
                    }
                }
                return false;
            },
            GenerateAdjacentRooms: function () {
                var M = this.GenerateAdjacentRoom(-1, 0);
                if (M != null) {
                    this.ExitRooms.add(M);
                }
                M = this.GenerateAdjacentRoom(1, 0);
                if (M != null) {
                    this.ExitRooms.add(M);
                }
                if (Math.random() < 0.5) {
                    M = this.GenerateAdjacentRoom(0, -1);
                    if (M != null) {
                        this.ExitRooms.add(M);
                    }
                    M = this.GenerateAdjacentRoom(0, 1);
                    if (M != null) {
                        this.ExitRooms.add(M);
                    }
                }
            },
            GenerateAdjacentRoom: function (Xdir, Ydir) {
                /* var min = 6;
                var max = 18;*/
                var min = 5;
                var max = 13;
                var dif = (((max - min) | 0));
                var W = Bridge.Int.clip32(min + (Math.random() * dif));
                var H = Bridge.Int.clip32(min + (Math.random() * dif));

                var X = -1;
                var Y = -1;
                if (Xdir !== 0) {
                    Y = Bridge.Int.clip32(this.SY + (Math.random() * (((this.EY - this.SY) | 0))));
                    if (Xdir < 0) {
                        X = (this.SX - W) | 0;
                    } else {
                        X = this.EX;
                    }
                } else if (Ydir !== 0) {
                    X = Bridge.Int.clip32(this.SX + Math.random() * ((((this.EX - this.SX) | 0))));
                    if (Ydir < 0) {
                        Y = (this.SY - H) | 0;
                    } else {
                        Y = this.EY;
                    }
                }

                if (X >= 0 && Y >= 0) {
                    var M = new CirnoGame.MapRoom();
                    M.SX = X;
                    M.SY = Y;
                    M.EX = (X + W) | 0;
                    M.EY = (Y + H) | 0;
                    M.parent = this;
                    M.game = this.game;
                    if (M.CanBePlaced()) {
                        return M;
                    }
                }
                return null;
            },
            ContainsTile: function (X, Y) {
                return X >= this.SX && Y >= this.SY && X < this.EX && Y < this.EY;
            },
            ContainsPosition: function (V) {
                var X = Bridge.Int.clip32((V.X - this.game.TM.position.X) / this.game.TM.tilesize);
                var Y = Bridge.Int.clip32((V.Y - this.game.TM.position.Y) / this.game.TM.tilesize);
                return X >= this.SX && Y >= this.SY && X < this.EX && Y < this.EY;
            },
            /**
             * clears out the room's area, and attempts to generate exitrooms.
             If the room is invalid it does nothing, and removes itself from it's parent list.
             *
             * @instance
             * @public
             * @this CirnoGame.MapRoom
             * @memberof CirnoGame.MapRoom
             * @return  {boolean}        returns true if it was valid and was placed.
             */
            PlaceAndExpand: function () {
                if (this.ExitRooms.Count < 1 && !this.placed && this.CanBePlaced()) {
                    this.Place();
                    if (this.placed) {
                        this.GenerateAdjacentRooms();
                    }
                    return this.placed;
                } else if (!this.placed) {
                    if (this.parent != null) {
                        if (CirnoGame.HelperExtensions.ContainsB$1(Bridge.global.CirnoGame.MapRoom, this.parent.ExitRooms, this)) {
                            this.parent.ExitRooms.remove(this);
                        }
                    }
                }
                return false;
            },
            GenerateGoldChests: function () {
                var locked = !CirnoGame.MapRoom.OpenRooms.contains(this);

                var V = this.FindEmptySpot();
                var chest = new CirnoGame.Chest(this.game);
                this.goldchests.push(chest);
                chest.ForceLocked = locked;
                chest.Position.CopyFrom(V);
                chest.Goldify();
                this.game.AddEntity(chest);

                var V2 = this.FindEmptySpot();
                var attempts = 0;
                while (Bridge.identity(attempts, (attempts = (attempts + 1) | 0)) < 5 && (CirnoGame.Vector2.op_Equality(V2, null) || Math.abs(V2.X - V.X) < 16)) {
                    V2 = this.FindEmptySpot();
                }

                if (CirnoGame.Vector2.op_Inequality(V2, null) && Math.abs(V2.X - V.X) > 16) {
                    chest = new CirnoGame.Chest(this.game);
                    this.goldchests.push(chest);
                    chest.Position.CopyFrom(V2);
                    chest.ForceLocked = locked;
                    chest.Goldify();
                    this.game.AddEntity(chest);
                }
            },
            NMakeSecret: function () {
                var TM = this.game.TM;
                var W = (this.EX - this.SX) | 0;
                var H = (this.EY - this.SY) | 0;
                //TM.FillRect(SX, SY, W, H);
                //ClearRoom();
                TM.DrawRect$1(this.SX, this.SY, W, H);
                TM.SetBreakableRect(this.SX, this.SY, W, H, false);
                TM.ClearRect$1(((this.SX + 1) | 0), ((this.SY + 1) | 0), ((W - 2) | 0), ((H - 2) | 0));

                if (CirnoGame.MapRoom.OpenRooms.contains(this)) {
                    CirnoGame.MapRoom.OpenRooms.remove(this);
                }
                this.secret = true;

                this.GenerateGoldChests();

                this.ForceRedraw();
            },
            MakeSecret: function () {
                var TM = this.game.TM;
                var W = (this.EX - this.SX) | 0;
                var H = (this.EY - this.SY) | 0;
                TM.FillRect(this.SX, this.SY, W, H);
                TM.SetBreakableRect(this.SX, this.SY, W, H, false);
                TM.SetBreakableRect(((this.SX + 1) | 0), ((this.SY + 1) | 0), ((W - 2) | 0), ((H - 2) | 0), true);
                if (CirnoGame.MapRoom.OpenRooms.contains(this)) {
                    CirnoGame.MapRoom.OpenRooms.remove(this);
                }
                this.secret = true;
            },
            NUnleashSecret: function () {
                var TM = this.game.TM;

                TM.ClearOuterRect(this.SX, this.SY, (((this.EX - this.SX) | 0)), (((this.EY - this.SY) | 0)), false);
                //TM.ClearRect(SX+1, SY+1, (EX - SX)-2, (EY - SY)-2);
                //TM._GenRect(SX, SY, EX, EY);

                CirnoGame.MapRoom.OpenRooms.add(this);
                CirnoGame.HelperExtensions.ForEach(Bridge.global.CirnoGame.Chest, this.goldchests, function (C) {
                    C.ForceLocked = false;
                });

                this.ForceRedraw();
            },
            UnleashSecret: function () {
                var TM = this.game.TM;

                TM.ClearRect$1(((this.SX + 1) | 0), ((this.SY + 1) | 0), (((((this.EX - this.SX) | 0)) - 2) | 0), (((((this.EY - this.SY) | 0)) - 2) | 0));
                TM._GenRect(this.SX, this.SY, this.EX, this.EY);

                CirnoGame.MapRoom.OpenRooms.add(this);

                this.GenerateGoldChests();
                this.ForceRedraw();
            },
            ClearRoom: function () {
                var TM = this.game.TM;

                TM.ClearRect$1(this.SX, this.SY, ((this.EX - this.SX) | 0), ((this.EY - this.SY) | 0));
            },
            GeneratePlatforms: function () {
                var TM = this.game.TM;
                TM._GenRect(this.SX, this.SY, this.EX, this.EY);
            },
            Place: function () {
                var TM = this.game.TM;
                TM.ClearRect$1(this.SX, this.SY, ((this.EX - this.SX) | 0), ((this.EY - this.SY) | 0));
                TM._GenRect(this.SX, this.SY, this.EX, this.EY);

                CirnoGame.MapRoom.PlacedRooms.add(this);
                CirnoGame.MapRoom.OpenRooms.add(this);
                this.placed = true;
            },
            ApplyBreakable: function () {
                var TM = this.game.TM;
                TM.ApplyBreakableRect(((this.SX - 2) | 0), ((this.SY - 2) | 0), (((((this.EX - this.SX) | 0)) + 4) | 0), (((((this.EY - this.SY) | 0)) + 4) | 0));
            },
            ForceRedraw: function () {
                var TM = this.game.TM;
                var X = (this.SX - 2) | 0;
                var Y = (this.SY - 2) | 0;
                var W = ((((this.EX - this.SX) | 0)) + 4) | 0;
                var H = ((((this.EY - this.SY) | 0)) + 4) | 0;
                TM.bg.clearRect(Bridge.Int.mul(Bridge.Int.clip32(TM.tilesize), X), Bridge.Int.mul(Bridge.Int.clip32(TM.tilesize), Y), Bridge.Int.mul(Bridge.Int.clip32(TM.tilesize), W), Bridge.Int.mul(Bridge.Int.clip32(TM.tilesize), H));

                TM.Redraw(TM.bg, X, Y, W, H);
            },
            FindEmptySpot: function () {
                var W = (this.EX - this.SX) | 0;
                var H = (this.EY - this.SY) | 0;
                var i = 0;
                var map = this.game.TM;
                while (i < 50) {
                    var X = Bridge.Int.clip32(this.SX + Math.random() * W);
                    var Y = Bridge.Int.clip32(this.SY + Math.random() * H);
                    var T = map.GetTile(X, Y);
                    if (T != null && (!T.enabled || !T.solid)) {
                        T = map.GetTile(X, ((Y - 1) | 0));
                        if (T != null && (!T.enabled || !T.solid)) {
                            return new CirnoGame.Vector2(map.position.X + (X * map.tilesize), map.position.Y + (Y * map.tilesize));
                        }
                    }
                    i = (i + 1) | 0;
                }
                return null;
            }
        }
    });

    Bridge.define("CirnoGame.MathHelper", {
        statics: {
            fields: {
                PI: 0,
                PI2: 0,
                PIOver2: 0
            },
            ctors: {
                init: function () {
                    this.PI = 3.14159274;
                    this.PI2 = 6.28318548;
                    this.PIOver2 = 1.57079637;
                }
            },
            methods: {
                DistanceBetweenPoints: function (A, B) {
                    return CirnoGame.MathHelper.DistanceBetweenPoints$1(A.X, A.Y, B.X, B.Y);
                },
                DistanceBetweenPoints$1: function (x1, y1, x2, y2) {
                    return Math.sqrt((Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
                },
                Clamp$1: function (value, min, max) {
                    return Math.min(max, Math.max(min, value));
                },
                Clamp: function (value, min, max) {
                    if (min === void 0) { min = 0.0; }
                    if (max === void 0) { max = 1.0; }
                    return Math.min(max, Math.max(min, value));
                },
                Lerp$1: function (value1, value2, amount) {
                    return value1 + ((value2 - value1) * amount);
                },
                Lerp: function (D1, D2, lerp) {
                    lerp = CirnoGame.MathHelper.Clamp(lerp);
                    return (D1 * (1 - lerp)) + (D2 * lerp);
                },
                DegreesToRadians: function (degrees) {
                    return degrees * 0.0174532924;
                },
                RadiansToDegrees: function (radians) {
                    return radians * 57.29578;
                },
                GetAngle$1: function (a, b) {
                    var angle = Math.atan2(b.Y - a.Y, b.X - a.X);
                    return angle;
                },
                GetAngle: function (a) {
                    var angle = Math.atan2(a.Y, a.X);
                    return angle;
                },
                RoughDistanceBetweenPoints: function (a, b) {
                    //return (float)(Math.Abs(a.x - b.x) + Math.Abs(a.y - b.y));
                    return (CirnoGame.Vector2.op_Subtraction(a, b)).RoughLength;
                },
                MagnitudeOfRectangle: function (R) {
                    return R.width + R.height;
                },
                WrapRadians: function (radian) {
                    while (radian < -3.14159274) {
                        radian += CirnoGame.MathHelper.PI2;
                    }
                    while (radian >= CirnoGame.MathHelper.PI) {
                        radian -= CirnoGame.MathHelper.PI2;
                    }
                    return radian;
                    //return radian % PI2;
                },
                incrementTowards: function (current, destination, speed) {
                    if (current < destination) {
                        current += speed;
                        if (current > destination) {
                            current = destination;
                        }
                    }
                    if (current > destination) {
                        current -= speed;
                        if (current < destination) {
                            current = destination;
                        }
                    }
                    return current;
                },
                incrementTowards$1: function (current, destination, incspeed, decspeed) {
                    if (current < destination) {
                        current += incspeed;
                        if (current > destination) {
                            current = destination;
                        }
                    }
                    if (current > destination) {
                        current -= decspeed;
                        if (current < destination) {
                            current = destination;
                        }
                    }
                    return current;
                },
                RadianToVector: function (radian) {
                    return new CirnoGame.Vector2(Math.cos(radian), Math.sin(radian));
                },
                Within: function (val, min, max) {
                    return val >= min && val <= max;
                },
                Mean: function (val) {
                    if (val === void 0) { val = []; }
                    var ret = 0;
                    var i = 0;
                    while (i < val.length) {
                        ret += val[System.Array.index(i, val)];
                        i = (i + 1) | 0;
                    }
                    ret /= val.length;
                    return ret;
                },
                Decelerate: function (momentum, deceleration) {
                    var dir = momentum >= 0;
                    momentum = (dir ? momentum : -momentum) - deceleration;
                    if (momentum < 0) {
                        return 0;
                    }
                    return dir ? momentum : -momentum;
                }
            }
        }
    });

    Bridge.define("CirnoGame.Point", {
        fields: {
            X: 0,
            Y: 0
        },
        ctors: {
            ctor: function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }

                this.$initialize();
                this.X = x;
                this.Y = y;
            }
        }
    });

    Bridge.define("CirnoGame.Rectangle", {
        statics: {
            methods: {
                op_Addition: function (A, B) {
                    return new CirnoGame.Rectangle(A.x + B.X, A.y + B.Y, A.width, A.height);
                },
                op_Subtraction: function (A, B) {
                    return new CirnoGame.Rectangle(A.x - B.X, A.y - B.Y, A.width, A.height);
                }
            }
        },
        fields: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },
        props: {
            left: {
                get: function () {
                    return this.x;
                },
                set: function (value) {
                    this.x = value;
                }
            },
            top: {
                get: function () {
                    return this.y;
                },
                set: function (value) {
                    this.y = value;
                }
            },
            right: {
                get: function () {
                    return this.x + this.width;
                },
                set: function (value) {
                    this.width = value - this.x;
                }
            },
            bottom: {
                get: function () {
                    return this.y + this.height;
                },
                set: function (value) {
                    this.height = value - this.y;
                }
            },
            points: {
                get: function () {
                    var ret = System.Array.init(8, 0, System.Single);
                    var i = 0;
                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.x;
                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.y;

                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.right;
                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.y;

                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.right;
                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.bottom;

                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.x;
                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.bottom;

                    return ret;
                }
            },
            Center: {
                get: function () {
                    return new CirnoGame.Vector2(this.left + (this.width / 2), this.top + (this.height / 2));
                }
            },
            Min: {
                get: function () {
                    return new CirnoGame.Vector2(this.x, this.y);
                },
                set: function (value) {
                    if (CirnoGame.Vector2.op_Equality(value, null)) {
                        return;
                    }
                    this.x = value.X;
                    this.y = value.Y;
                }
            },
            Max: {
                get: function () {
                    return new CirnoGame.Vector2(this.right, this.bottom);
                },
                set: function (value) {
                    if (CirnoGame.Vector2.op_Equality(value, null)) {
                        return;
                    }
                    this.right = value.X;
                    this.bottom = value.Y;
                }
            }
        },
        ctors: {
            init: function () {
                this.x = 0;
                this.y = 0;
                this.width = 0;
                this.height = 0;
            },
            ctor: function (x, y, width, height) {
                if (x === void 0) { x = 0.0; }
                if (y === void 0) { y = 0.0; }
                if (width === void 0) { width = 0.0; }
                if (height === void 0) { height = 0.0; }

                this.$initialize();
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
        },
        methods: {
            CopyFrom: function (R) {
                this.x = R.x;
                this.y = R.y;
                this.width = R.width;
                this.height = R.height;
            },
            GetCenter: function (OUT) {
                OUT.X = this.left + (this.width / 2);
                OUT.Y = this.top + (this.height / 2);
            },
            containsPoint$1: function (x, y) {
                if (x >= this.x && y >= this.y && x <= this.right && y <= this.bottom) {
                    return true;
                }
                return false;
            },
            containsPoint: function (point) {
                if (point.X >= this.x && point.Y >= this.y && point.X <= this.right && point.Y <= this.bottom) {
                    return true;
                }
                return false;
            },
            intersects: function (R) {
                var p = R.points;
                var contain = false;
                var outside = false;
                var i = 0;
                while (i < p.length) {
                    if (this.containsPoint$1(p[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), p)], p[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), p)])) {
                        contain = true;
                    } else {
                        outside = true;
                    }
                }
                if (contain && outside) {
                    return true;
                }
                if (R.left < this.left && R.right > this.right) {
                    //if ((top <= R.top && bottom <= R.top) || (top <= R.bottom && bottom <= R.bottom))
                    if ((this.top <= R.top && this.bottom >= R.top) || (this.top <= R.bottom && this.bottom >= R.bottom)) {
                        return true;
                    }
                }
                if (R.top < this.top && R.bottom > this.bottom) {
                    if ((this.left <= R.left && this.right >= R.left) || (this.left <= R.right && this.right >= R.right)) {
                        return true;
                    }
                }
                /* if (R.left < left && R.right > right)
                {
                   if ((top <= R.top && bottom <= R.top) || (top <= R.bottom && bottom <= R.bottom))
                   {
                       return true;
                   }
                }
                if (R.top < top && R.bottom > bottom)
                {
                   if ((left <= R.left && right <= R.left) || (left <= R.right && right <= R.right))
                   {
                       return true;
                   }
                }*/
                return false;
            },
            isTouching: function (R) {
                if (R == null) {
                    return false;
                }
                var p = R.points;
                var i = 0;
                while (i < p.length) {
                    if (this.containsPoint$1(p[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), p)], p[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), p)])) {
                        return true;
                    }
                }
                if (this.intersects(R)) {
                    return true;
                }
                /* if (R.left < left && R.right > right)
                {
                   if ((top<=R.top && bottom<=R.top) || (top <= R.bottom && bottom <= R.bottom))
                   {
                       return true;
                   }
                }
                if (R.top < top && R.bottom > bottom)
                {
                   if ((left <= R.left && right <= R.left) || (left <= R.right && right <= R.right))
                   {
                       return true;
                   }
                }*/
                return false;
            },
            Set: function (x, y, width, height) {
                if (x === void 0) { x = 0.0; }
                if (y === void 0) { y = 0.0; }
                if (width === void 0) { width = 0.0; }
                if (height === void 0) { height = 0.0; }
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
        }
    });

    Bridge.define("CirnoGame.RectangleI", {
        statics: {
            methods: {
                op_Addition: function (A, B) {
                    return new CirnoGame.RectangleI(((A.x + B.X) | 0), ((A.y + B.Y) | 0), A.width, A.height);
                },
                op_Subtraction: function (A, B) {
                    return new CirnoGame.RectangleI(((A.x - B.X) | 0), ((A.y - B.Y) | 0), A.width, A.height);
                }
            }
        },
        fields: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },
        props: {
            left: {
                get: function () {
                    return this.x;
                },
                set: function (value) {
                    this.x = value;
                }
            },
            top: {
                get: function () {
                    return this.y;
                },
                set: function (value) {
                    this.y = value;
                }
            },
            right: {
                get: function () {
                    return ((this.x + this.width) | 0);
                },
                set: function (value) {
                    this.width = (value - this.x) | 0;
                }
            },
            bottom: {
                get: function () {
                    return ((this.y + this.height) | 0);
                },
                set: function (value) {
                    this.height = (value - this.y) | 0;
                }
            },
            points: {
                get: function () {
                    var ret = System.Array.init(8, 0, System.Int32);
                    var i = 0;
                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.x;
                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.y;

                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.right;
                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.y;

                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.right;
                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.bottom;

                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.x;
                    ret[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), ret)] = this.bottom;

                    return ret;
                }
            },
            Center: {
                get: function () {
                    return new CirnoGame.Point(((this.left + (((Bridge.Int.div(this.width, 2)) | 0))) | 0), ((this.top + (((Bridge.Int.div(this.height, 2)) | 0))) | 0));
                }
            },
            Min: {
                get: function () {
                    return new CirnoGame.Point(this.x, this.y);
                },
                set: function (value) {
                    if (value == null) {
                        return;
                    }
                    this.x = value.X;
                    this.y = value.Y;
                }
            },
            Max: {
                get: function () {
                    return new CirnoGame.Point(this.right, this.bottom);
                },
                set: function (value) {
                    if (value == null) {
                        return;
                    }
                    this.right = value.X;
                    this.bottom = value.Y;
                }
            }
        },
        ctors: {
            init: function () {
                this.x = 0;
                this.y = 0;
                this.width = 0;
                this.height = 0;
            },
            ctor: function (x, y, width, height) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }

                this.$initialize();
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
        },
        methods: {
            containsPoint$1: function (x, y) {
                if (x >= this.x && y >= this.y && x <= this.right && y <= this.bottom) {
                    return true;
                }
                return false;
            },
            containsPoint: function (point) {
                if (point.X >= this.x && point.Y >= this.y && point.X <= this.right && point.Y <= this.bottom) {
                    return true;
                }
                return false;
            },
            intersects: function (R) {
                var p = R.points;
                var contain = false;
                var outside = false;
                var i = 0;
                while (i < p.length) {
                    if (this.containsPoint$1(p[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), p)], p[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), p)])) {
                        contain = true;
                    } else {
                        outside = true;
                    }
                }
                if (contain && outside) {
                    return true;
                }
                if (R.left < this.left && R.right > this.right) {
                    //if ((top <= R.top && bottom <= R.top) || (top <= R.bottom && bottom <= R.bottom))
                    if ((this.top <= R.top && this.bottom >= R.top) || (this.top <= R.bottom && this.bottom >= R.bottom)) {
                        return true;
                    }
                }
                if (R.top < this.top && R.bottom > this.bottom) {
                    if ((this.left <= R.left && this.right >= R.left) || (this.left <= R.right && this.right >= R.right)) {
                        return true;
                    }
                }
                /* if (R.left < left && R.right > right)
                {
                   if ((top <= R.top && bottom <= R.top) || (top <= R.bottom && bottom <= R.bottom))
                   {
                       return true;
                   }
                }
                if (R.top < top && R.bottom > bottom)
                {
                   if ((left <= R.left && right <= R.left) || (left <= R.right && right <= R.right))
                   {
                       return true;
                   }
                }*/
                return false;
            },
            isTouching: function (R) {
                if (R == null) {
                    return false;
                }
                var p = R.points;
                var i = 0;
                while (i < p.length) {
                    if (this.containsPoint$1(p[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), p)], p[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), p)])) {
                        return true;
                    }
                }
                if (this.intersects(R)) {
                    return true;
                }
                return false;
            }
        }
    });

    Bridge.define("CirnoGame.Renderer", {
        fields: {
            view: null
        },
        ctors: {
            ctor: function (width, height, backgroundColor) {
                if (width === void 0) { width = 800; }
                if (height === void 0) { height = 600; }
                if (backgroundColor === void 0) { backgroundColor = 1087931; }

                this.$initialize();
                /* var width = 800;
                var height = 600;
                var backgroundColor = 0x1099bb;*/
                this.view = new PIXI.Application(width, height, {backgroundColor : backgroundColor});
            }
        }
    });

    Bridge.define("CirnoGame.TileData", {
        fields: {
            texture: 0,
            row: 0,
            column: 0,
            enabled: false,
            map: null,
            visible: false,
            topSolid: false,
            rightSolid: false,
            leftSolid: false,
            bottomSolid: false,
            CanSlope: false,
            Breakable: false,
            HP: 0,
            maxHP: 0,
            _hitbox: null,
            HR: null
        },
        props: {
            solid: {
                get: function () {
                    return this.topSolid && this.rightSolid && this.leftSolid && this.bottomSolid;
                },
                set: function (value) {
                    this.topSolid = value;
                    this.leftSolid = value;
                    this.rightSolid = value;
                    this.bottomSolid = value;
                }
            },
            platform: {
                get: function () {
                    return this.topSolid && !this.rightSolid && !this.leftSolid && !this.bottomSolid;
                }
            },
            IsSlope: {
                get: function () {
                    return this.SlopeDirection !== 0;
                }
            },
            SlopeDirection: {
                get: function () {
                    if (!this.CanSlope) {
                        return 0;
                    }
                    var Bottom = this.GetTileData(0, 1);
                    if (!(Bottom != null && Bottom.enabled && Bottom.solid)) {
                        return 0;
                    }
                    var Left = this.GetTileData(-1, 0);
                    var Right = this.GetTileData(1, 0);
                    var Lsolid = Left != null && Left.enabled && Left.solid;
                    var Rsolid = Right != null && Right.enabled && Right.solid;
                    if (!this.CanSlope || !this.solid || (Lsolid && Rsolid) || (!Rsolid && !Lsolid)) {
                        return 0;
                    }
                    var Top = this.GetTileData(0, -1);
                    var Tsolid = Top != null && Top.enabled && Top.solid;
                    if (Tsolid) {
                        return 0;
                    }
                    if (Rsolid) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            }
        },
        ctors: {
            init: function () {
                this.Breakable = false;
                this.HP = 4;
                this.maxHP = 4;
                this.HR = new CirnoGame.Rectangle();
            }
        },
        methods: {
            Clone: function () {
                var T = new CirnoGame.TileData();
                T.texture = this.texture;
                T.enabled = this.enabled;
                T.map = this.map;
                T.visible = this.visible;
                T.topSolid = this.topSolid;
                T.rightSolid = this.rightSolid;
                T.leftSolid = this.leftSolid;
                T.bottomSolid = this.bottomSolid;
                T.CanSlope = this.CanSlope;
                return T;
            },
            Damage: function (damage) {
                this.HP -= damage;
                if (this.HP <= 0 && this.topSolid) {
                    this.solid = false;
                    this.visible = false;
                    this.enabled = false;
                    /* enabled = true;
                    visible = true;
                    texture = 2;*/
                    /* map.ForceRedraw();*/
                    this.UpdateTile();
                    this.SpawnParticles();
                    return true;
                } else {
                    this.map.RedrawTile(this.column, this.row, false);
                    return false;
                }
            },
            UpdateTile: function () {
                this.map.RedrawTile(this.column, this.row);
            },
            SpawnParticles: function () {
                var tx = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(this.texture, 0, ((this.map.tiles.Count - 1) | 0)));
                var T = this.map.tiles.getItem(tx);

                var sz = Bridge.Int.clip32(this.map.tilesize / 2);
                var G = this.map.game;
                var HB = this.GetHitbox();
                //var spd = 1.5f;
                var spd = 1;


                var C = document.createElement("canvas");
                C.width = sz;
                C.height = sz;
                var g = CirnoGame.Helper.GetContext(C);

                g.drawImage(T, 0, 0, sz, sz, 0, 0, sz, sz);
                var P = new CirnoGame.Particle(G, C);
                P.Hspeed = (-spd) | 0;
                P.Vspeed = (-spd) | 0;
                P.x = HB.left;
                P.y = HB.top;
                G.AddEntity(P);

                //
                C = document.createElement("canvas");
                C.width = sz;
                C.height = sz;
                g = CirnoGame.Helper.GetContext(C);

                g.drawImage(T, sz, 0, sz, sz, 0, 0, sz, sz);
                P = new CirnoGame.Particle(G, C);
                P.Hspeed = spd;
                P.Vspeed = (-spd) | 0;
                P.x = HB.left + sz;
                P.y = HB.top;
                G.AddEntity(P);

                //
                C = document.createElement("canvas");
                C.width = sz;
                C.height = sz;
                g = CirnoGame.Helper.GetContext(C);

                g.drawImage(T, 0, sz, sz, sz, 0, 0, sz, sz);
                P = new CirnoGame.Particle(G, C);
                P.Hspeed = (-spd) | 0;
                P.Vspeed = spd;
                P.x = HB.left;
                P.y = HB.top + sz;
                G.AddEntity(P);

                //
                C = document.createElement("canvas");
                C.width = sz;
                C.height = sz;
                g = CirnoGame.Helper.GetContext(C);

                g.drawImage(T, sz, sz, sz, sz, 0, 0, sz, sz);
                P = new CirnoGame.Particle(G, C);
                P.Hspeed = spd;
                P.Vspeed = spd;
                P.x = HB.left + sz;
                P.y = HB.top + sz;
                G.AddEntity(P);
            },
            GetHitbox: function () {
                /* if (_hitbox == null)
                {
                   var tsz = map.tilesize;
                   var pos = map.position;
                   _hitbox = new Rectangle(pos.X + (column * tsz), pos.Y + (row * tsz), tsz, tsz);
                }*/
                var tsz = this.map.tilesize;
                var pos = this.map.position;
                this.HR.Set(pos.X + (this.column * tsz), pos.Y + (this.row * tsz), tsz, tsz);
                return this.HR;
                //return new Rectangle(pos.X + (column * tsz), pos.Y + (row * tsz), tsz, tsz);
                //return _hitbox;
            },
            GetHitbox2: function (OUT) {
                /* if (_hitbox == null)
                {
                   var tsz = map.tilesize;
                   var pos = map.position;
                   _hitbox = new Rectangle(pos.X + (column * tsz), pos.Y + (row * tsz), tsz, tsz);
                }*/
                var tsz = this.map.tilesize;
                var pos = this.map.position;
                OUT.x = pos.X + (this.column * tsz);
                OUT.y = pos.Y + (this.row * tsz);
                OUT.width = tsz;
                OUT.height = tsz;
                //return _hitbox;
            },
            GetTileData: function (relativeX, relativeY) {
                return this.map.GetTile(((this.column + relativeX) | 0), ((this.row + relativeY) | 0));
            },
            solidToSpeed: function (angle) {
                if (!this.enabled) {
                    return false;
                }
                if (angle.RoughLength === 0) {
                    return this.solid;
                } else {
                    if ((angle.X > 0 && this.leftSolid) || (angle.X < 0 && this.rightSolid) || (angle.Y > 0 && this.topSolid) || (angle.Y > 0 && this.bottomSolid)) {
                        return true;
                    }
                }
                return false;
            },
            GetTop: function (position) {

                /* TileData Left = GetTileData(-1, 0);
                TileData Right = GetTileData(1, 0);
                bool Lsolid = Left != null && Left.enabled && Left.solid;
                bool Rsolid = Right != null && Right.enabled && Right.solid;*/
                var direction = this.SlopeDirection;
                //if (!CanSlope || !solid || (Lsolid && Rsolid))
                var tsz = this.map.tilesize;
                if (direction === 0) {
                    //return R.top;

                    var pos = this.map.position;
                    return pos.Y + (this.row * tsz);
                } else {
                    var R = this.GetHitbox();
                    var Y = ((R.right - position.X) / R.width) * tsz;
                    if (direction > 0) {
                        Y = (tsz - Y);
                    }
                    //Y *= 1.0f;
                    Y = Math.min(tsz, Math.max(0, Y));
                    return R.bottom - Y;
                    //return (float)Math.Min(R.top, Math.Max(R.bottom,((R.right - position.X) / R.width) * R.height));
                }
            }
        }
    });

    Bridge.define("CirnoGame.TileMap", {
        fields: {
            position: null,
            tilesize: 0,
            rows: 0,
            columns: 0,
            data: null,
            tiles: null,
            cracks: null,
            game: null,
            buffer: null,
            bg: null,
            RND: null,
            Seed: 0,
            needRedraw: false,
            AllowSkyBridge: false,
            rtmp: null
        },
        ctors: {
            init: function () {
                this.Seed = 0;
                this.AllowSkyBridge = false;
                this.rtmp = new CirnoGame.Rectangle();
            },
            ctor: function (game, Seed) {
                if (Seed === void 0) { Seed = -1; }

                this.$initialize();
                this.RND = new System.Random.ctor();
                //position = new Vector2(-576);
                this.position = new CirnoGame.Vector2();
                //tilesize = 48;
                this.tilesize = 16;
                //rows = 16;
                /* columns = 52;*/
                this.rows = Bridge.Int.clip32(Math.ceil(((-this.position.Y * 2) + game.stageBounds.bottom) / this.tilesize));
                this.columns = Bridge.Int.clip32(Math.ceil(((-this.position.X * 2) + game.stageBounds.right) / this.tilesize));
                this.data = System.Array.create(null, null, CirnoGame.TileData, this.columns, this.rows);
                this.tiles = CirnoGame.AnimationLoader.Get("images/land/brick");
                this.cracks = CirnoGame.AnimationLoader.Get("images/land/cracks");
                this.game = game;

                this.buffer = document.createElement("canvas");
                this.bg = this.buffer.getContext("2d");
                if (Seed < 0) {
                    this.Seed = this.RND.next();
                } else {
                    this.Seed = Seed;
                }
                //Randomize();
                this.Generate();
            }
        },
        methods: {
            /**
             * returns true if the rectangle has no empty spaces.
             *
             * @instance
             * @public
             * @this CirnoGame.TileMap
             * @memberof CirnoGame.TileMap
             * @param   {number}     sX    
             * @param   {number}     sY    
             * @param   {number}     eX    
             * @param   {number}     eY
             * @return  {boolean}
             */
            IsRectSolid: function (sX, sY, eX, eY) {
                var X = sX;
                var Y = sY;
                while (Y < eY) {
                    X = sY;
                    while (X < eX) {
                        var T = this.data.get([X, Y]);
                        if (!(T.enabled && T.topSolid)) {
                            return false;
                        }
                        X = (X + 1) | 0;
                    }
                    Y = (Y + 1) | 0;
                }
                return true;
            },
            ForceRedraw: function () {
                this.needRedraw = true;
            },
            Randomize: function () {
                var row = 0;
                var column = 0;
                while (row < this.rows) {
                    while (column < this.columns) {
                        var T = new CirnoGame.TileData();
                        T.row = row;
                        T.column = column;
                        T.texture = 1;
                        //T.enabled = (Math.Random() < 0.15) || (row>=rows-1);
                        T.enabled = (this.RND.nextDouble() < 0.15) || (row >= ((this.rows - 1) | 0));
                        T.topSolid = T.enabled;
                        if (T.enabled && (row >= ((this.rows - 1) | 0))) {
                            T.texture = 2;
                            T.solid = true;
                        } else if (T.enabled) {
                            if (this.RND.nextDouble() < 0.3) {
                                T.solid = true;
                                T.texture = 0;
                                if (this.RND.nextDouble() < 0.5) {
                                    T.texture = 3;
                                }
                            }
                        }
                        T.visible = T.enabled;
                        T.map = this;
                        this.data.set([column, row], T);
                        column = (column + 1) | 0;
                    }
                    column = 0;
                    row = (row + 1) | 0;
                }
            },
            Generate: function () {
                this.RND = new System.Random.$ctor1(this.Seed);
                //Randomize();
                this._Gen();
                this.needRedraw = true;
            },
            _Gen: function () {
                var heightmap = System.Array.init(this.columns, 0, System.Int32);
                //float entropy = 0.8f;
                //float entropy = 0.45f;
                var entropy = 0.6;
                var max = Bridge.Int.clip32(this.rows * entropy);
                //int smoothnessSize = 12;
                var smoothnessSize = 8;
                var smoothnessStrength = 2;

                var X = 0;
                //randomizes the heightmap
                while (X < this.columns) {
                    heightmap[System.Array.index(X, heightmap)] = Bridge.Int.clip32(this.RND.nextDouble() * max);
                    X = (X + 1) | 0;
                }
                var s = 0;
                while (s < smoothnessStrength) {
                    var oheightmap = heightmap;
                    heightmap = System.Array.init(this.columns, 0, System.Int32);
                    X = 0;
                    while (X < this.columns) {
                        heightmap[System.Array.index(X, heightmap)] = this.blur(oheightmap, X, smoothnessSize);
                        X = (X + 1) | 0;
                    }

                    X = 1;
                    s = (s + 1) | 0;
                }
                //removes bumps from heightmap
                while (X < ((this.columns - 1) | 0)) {
                    var A = heightmap[System.Array.index(((X - 1) | 0), heightmap)];
                    var B = heightmap[System.Array.index(((X + 1) | 0), heightmap)];

                    var H = heightmap[System.Array.index(X, heightmap)];
                    //if (A == B && Math.Abs(A- H)==1)
                    if ((A > H) === (B > H) && H !== A) {
                        heightmap[System.Array.index(X, heightmap)] = (Bridge.Int.div((((A + B) | 0)), 2)) | 0;
                    }
                    X = (X + 1) | 0;
                }



                var row = 0;
                var column = 0;
                var LT = null;
                var bridgeChance = 0.9;
                var RNDbridge = 0;
                while (row < this.rows) {
                    while (column < this.columns) {
                        var H1 = (this.rows - heightmap[System.Array.index(column, heightmap)]) | 0;
                        var fill = row >= H1;
                        var T = new CirnoGame.TileData();
                        T.row = row;
                        T.column = column;
                        T.texture = 1;
                        //T.enabled = (Math.Random() < 0.15) || (row >= rows - 1);
                        T.enabled = (fill) || (row >= ((this.rows - 1) | 0));
                        T.topSolid = T.enabled;
                        T.bottomSolid = T.enabled;
                        if (T.enabled && (row >= ((this.rows - 1) | 0))) {
                            T.texture = 2;
                            T.solid = true;
                        } else if (T.enabled) {
                            //if (Math.Random() < 0.3)
                            {
                                T.solid = true;
                                T.texture = 4;
                                T.CanSlope = true;
                                if (this.RND.nextDouble() < 0.5) {
                                    T.texture = 5;
                                }
                                if (row > H1 && this.RND.nextDouble() < 0.02) {
                                    T.texture = 6;
                                }
                            }
                        }
                        if (!T.enabled) {
                            if ((this.AllowSkyBridge && row === 20 && this.RND.nextDouble() < 0.93) || (((row + 4) | 0) >= H1 && ((row + 2) | 0) < H1 && this.RND.nextDouble() < 0.025) || (LT != null && LT.enabled && LT.texture === 1 && this.RND.nextDouble() < bridgeChance)) {
                                T.enabled = true;
                                T.topSolid = T.enabled;
                                bridgeChance -= 0.075;
                            } else {
                                if (RNDbridge < 1 && this.RND.nextDouble() < 0.015) {
                                    RNDbridge = this.RND.next$1(8);
                                }
                                if (RNDbridge > 0) {
                                    T.enabled = true;
                                    T.topSolid = T.enabled;
                                    RNDbridge = (RNDbridge - 1) | 0;
                                    //}else if (RND.NextDouble() < 0.025)
                                } else if (this.RND.nextDouble() < 0.035) {
                                    T.enabled = true;
                                    T.topSolid = T.enabled;
                                } else if (true) {
                                    T.enabled = true;
                                    T.topSolid = T.enabled;
                                    T.CanSlope = Math.random() < 0.5;
                                }
                            }
                        }
                        if (!T.enabled || T.texture !== 1) {
                            bridgeChance = 0.9;
                        }
                        T.visible = T.enabled;
                        T.map = this;
                        T.solid = true;
                        this.data.set([column, row], T);
                        LT = T;
                        column = (column + 1) | 0;
                    }
                    column = 0;
                    row = (row + 1) | 0;
                }
            },
            _GenRect: function (SX, SY, EX, EY) {
                SX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SX, 0, ((this.columns - 1) | 0)));
                SY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SY, 0, ((this.rows - 1) | 0)));
                EX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EX, 0, ((this.columns - 1) | 0)));
                EY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EY, 0, ((this.rows - 1) | 0)));

                //float entropy = 0.8f;
                //float entropy = 0.45f;
                var entropy = 0.6;
                var max = Bridge.Int.clip32(this.rows * entropy);
                //int smoothnessSize = 12;

                var X = 0;



                var row = SY;
                var column = SX;
                var LT = null;
                var bridgeChance = 0.9;
                var RNDbridge = 0;

                while (row < EY) {
                    while (column < EX) {
                        var fill = false;
                        var T = new CirnoGame.TileData();
                        T.row = row;
                        T.column = column;
                        T.texture = 1;
                        //T.enabled = (Math.Random() < 0.15) || (row >= rows - 1);
                        T.enabled = (fill) || (row >= ((this.rows - 1) | 0));
                        T.topSolid = T.enabled;
                        T.bottomSolid = T.enabled;
                        /* if (T.enabled && (row >= rows - 1))
                        {
                           T.texture = 2;
                           T.solid = true;
                        }
                        else if (T.enabled)
                        {
                           //if (Math.Random() < 0.3)
                           {
                               T.solid = true;
                               T.texture = 4;
                               T.CanSlope = true;
                               if (RND.NextDouble() < 0.5)
                               {
                                   T.texture = 5;
                               }
                               if (false && RND.NextDouble() < 0.02)
                               {
                                   T.texture = 6;
                               }
                           }
                        }*/
                        if (!T.enabled) {
                            /* if ((AllowSkyBridge && row == 20 && RND.NextDouble() < 0.93) || (false && false && RND.NextDouble() < 0.025) || (LT != null && LT.enabled && LT.texture == 1 && RND.NextDouble() < bridgeChance))
                            {
                               T.enabled = true;
                               T.topSolid = T.enabled;
                               bridgeChance -= 0.075f;
                            }
                            else*/
                            {
                                if (RNDbridge < 1 && this.RND.nextDouble() < 0.015) {
                                    //RNDbridge = RND.Next(8);
                                    RNDbridge = this.RND.next$1(6);
                                }
                                if (RNDbridge > 0) {
                                    T.enabled = true;
                                    T.topSolid = T.enabled;
                                    RNDbridge = (RNDbridge - 1) | 0;
                                    //}else if (RND.NextDouble() < 0.025)
                                } else if (this.RND.nextDouble() < 0.045) {
                                    T.enabled = true;
                                    T.topSolid = T.enabled;
                                }

                            }
                        }
                        if (!T.enabled || T.texture !== 1) {
                            bridgeChance = 0.9;
                        }
                        T.visible = T.enabled;
                        T.map = this;
                        T.solid = true;
                        this.data.set([column, row], T);
                        LT = T;
                        column = (column + 1) | 0;
                    }
                    column = SX;
                    row = (row + 1) | 0;
                }
            },
            SetBreakableRect: function (column, row, Width, Height, breakable) {
                var SX = column;
                var SY = row;
                var EX = ((SX + Width) | 0);
                var EY = ((SY + Height) | 0);
                SX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SX, 0, ((this.columns - 1) | 0)));
                SY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SY, 0, ((this.rows - 1) | 0)));
                EX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EX, 0, ((this.columns - 1) | 0)));
                EY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EY, 0, ((this.rows - 1) | 0)));
                var X = SX;
                var Y = SY;
                var T = new CirnoGame.TileData();
                T.row = Y;
                T.column = X;
                T.texture = 1;
                T.enabled = true;
                T.visible = true;
                T.map = this;
                T.solid = true;
                if (breakable) {
                    T.texture = 1;
                    if (Math.random() < 0.02) {
                        T.texture = Math.random() < 0.5 ? 5 : 6;
                    }
                    T.Breakable = true;
                } else {
                    T.texture = 0;
                    T.Breakable = false;
                }
                while (Y < EY) {
                    X = SX;
                    while (X < EX) {
                        /* var TT = T.Clone();
                        TT.column = X;
                        TT.row = Y;
                        data[X, Y] = TT;*/
                        var TT = this.data.get([X, Y]);
                        if (TT == null) {
                            TT = T.Clone();
                        }
                        if (T.solid) {
                            TT.texture = T.texture;
                            TT.Breakable = T.Breakable;
                        }
                        X = (X + 1) | 0;
                    }
                    Y = (Y + 1) | 0;
                }
            },
            FillRect: function (column, row, Width, Height) {
                var SX = column;
                var SY = row;
                var EX = ((SX + Width) | 0);
                var EY = ((SY + Height) | 0);
                SX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SX, 0, ((this.columns - 1) | 0)));
                SY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SY, 0, ((this.rows - 1) | 0)));
                EX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EX, 0, ((this.columns - 1) | 0)));
                EY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EY, 0, ((this.rows - 1) | 0)));
                var X = SX;
                var Y = SY;
                var T = new CirnoGame.TileData();
                T.row = Y;
                T.column = X;
                T.texture = 1;
                T.enabled = true;
                T.visible = true;
                T.map = this;
                T.solid = true;
                while (Y < EY) {
                    X = SX;
                    while (X < EX) {
                        var TT = T.Clone();
                        TT.column = X;
                        TT.row = Y;
                        this.data.set([X, Y], TT);
                        X = (X + 1) | 0;
                    }
                    Y = (Y + 1) | 0;
                }
            },
            DrawRect$1: function (column, row, Width, Height) {
                var X = column;
                var Y = row;
                var TX = X;
                var TY = Y;
                var EX = (X + Width) | 0;
                var EY = (Y + Height) | 0;

                while (TX < EX) {
                    var T = new CirnoGame.TileData();
                    T.row = TY;
                    T.column = TX;
                    T.texture = 1;
                    T.enabled = true;
                    T.visible = true;
                    T.map = this;
                    T.solid = true;
                    this.SetTile(TX, TY, T);
                    TX = (TX + 1) | 0;
                }
                TX = X;
                TY = EY;
                while (TX < EX) {
                    var T1 = new CirnoGame.TileData();
                    T1.row = TY;
                    T1.column = TX;
                    T1.texture = 1;
                    T1.enabled = true;
                    T1.visible = true;
                    T1.map = this;
                    T1.solid = true;
                    this.SetTile(TX, TY, T1);
                    TX = (TX + 1) | 0;
                }

                TX = X;
                TY = Y;
                while (TY < EY) {
                    var T2 = new CirnoGame.TileData();
                    T2.row = TY;
                    T2.column = TX;
                    T2.texture = 1;
                    T2.enabled = true;
                    T2.visible = true;
                    T2.map = this;
                    T2.solid = true;
                    this.SetTile(TX, TY, T2);
                    TY = (TY + 1) | 0;
                }
                TX = EX;
                TY = Y;
                while (TY < EY) {
                    var T3 = new CirnoGame.TileData();
                    T3.row = TY;
                    T3.column = TX;
                    T3.texture = 1;
                    T3.enabled = true;
                    T3.visible = true;
                    T3.map = this;
                    T3.solid = true;
                    this.SetTile(TX, TY, T3);
                    TY = (TY + 1) | 0;
                }
            },
            DrawRect: function (rect) {
                /* var PX = (int)((position.X - TP.X) / tilesize);
                var PY = (int)((position.Y - TP.Y) / tilesize);*/
                this.DrawRect$1(Bridge.Int.clip32(rect.left / this.tilesize), Bridge.Int.clip32(rect.top / this.tilesize), Bridge.Int.clip32(rect.width / this.tilesize), Bridge.Int.clip32(rect.height / this.tilesize));
            },
            SetAll: function (T) {
                var X = 0;
                var Y = 0;
                while (Y < this.rows) {
                    X = 0;
                    while (X < this.columns) {
                        var TD = T.Clone();
                        TD.column = X;
                        TD.row = Y;
                        this.data.set([X, Y], T);
                        X = (X + 1) | 0;
                    }
                    Y = (Y + 1) | 0;
                }
            },
            ClearOuterRect: function (column, row, width, height, bottom) {
                if (bottom === void 0) { bottom = true; }
                var SX = column;
                var SY = row;
                var EX = ((SX + width) | 0);
                var EY = ((SY + height) | 0);
                SX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SX, 0, ((this.columns - 1) | 0)));
                SY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SY, 0, ((this.rows - 1) | 0)));
                EX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EX, 0, ((this.columns - 1) | 0)));
                EY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EY, 0, ((this.rows - 1) | 0)));
                var X = SX;
                var Y = SY;
                var T = new CirnoGame.TileData();
                T.map = this;
                T.visible = false;
                T.solid = false;
                var TX = X;
                var TY = Y;
                while (TX < ((EX - 1) | 0)) {
                    var TT = T.Clone();
                    TT.column = TX;
                    TT.row = TY;
                    this.SetTile(TX, TY, TT);
                    TX = (TX + 1) | 0;
                }
                TX = X;
                TY = EY;
                if (bottom) {
                    while (TX < EX) {
                        var TT1 = T.Clone();
                        TT1.column = TX;
                        TT1.row = TY;
                        this.SetTile(TX, TY, TT1);
                        TX = (TX + 1) | 0;
                    }
                }

                TX = X;
                TY = Y;
                while (TY < ((EY - 1) | 0)) {
                    var TT2 = T.Clone();
                    TT2.column = TX;
                    TT2.row = TY;
                    this.SetTile(TX, TY, TT2);
                    TY = (TY + 1) | 0;
                }
                TX = EX;
                TY = Y;
                while (TY < ((EY - 1) | 0)) {
                    var TT3 = T.Clone();
                    TT3.column = TX;
                    TT3.row = TY;
                    this.SetTile(TX, TY, TT3);
                    TY = (TY + 1) | 0;
                }
            },
            ClearRect$1: function (column, row, width, height) {
                var SX = column;
                var SY = row;
                var EX = ((SX + width) | 0);
                var EY = ((SY + height) | 0);
                SX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SX, 0, ((this.columns - 1) | 0)));
                SY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SY, 0, ((this.rows - 1) | 0)));
                EX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EX, 0, ((this.columns - 1) | 0)));
                EY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EY, 0, ((this.rows - 1) | 0)));
                var X = SX;
                var Y = SY;
                var T = new CirnoGame.TileData();
                T.map = this;
                T.visible = false;
                T.solid = false;
                T.enabled = false;
                while (Y < EY) {
                    X = SX;
                    while (X < EX) {
                        var TT = T.Clone();
                        TT.column = X;
                        TT.row = Y;
                        this.data.set([X, Y], TT);
                        X = (X + 1) | 0;
                    }
                    Y = (Y + 1) | 0;
                }
            },
            ClearRect: function (rect) {
                var SX = Bridge.Int.clip32(rect.left / this.tilesize);
                var SY = Bridge.Int.clip32(rect.top / this.tilesize);
                var EX = Bridge.Int.clip32(rect.right / this.tilesize);
                var EY = Bridge.Int.clip32(rect.height / this.tilesize);
                var X = SX;
                var Y = SY;
                var T = new CirnoGame.TileData();
                T.map = this;
                T.visible = false;
                T.solid = false;
                while (Y < EY) {
                    X = SX;
                    while (X < EX) {
                        var TT = T.Clone();
                        TT.column = X;
                        TT.row = Y;
                        this.data.set([X, Y], TT);
                        X = (X + 1) | 0;
                    }
                    Y = (Y + 1) | 0;
                }
            },
            SetTile: function (column, row, T) {
                if (column >= 0 && row >= 0 && column < System.Array.getLength(this.data, 0) && row < System.Array.getLength(this.data, 1)) {
                    this.data.set([column, row], T);
                }
            },
            blur: function (array, index, blur) {
                if (blur === void 0) { blur = 1; }
                var total = 0;
                var ret = 0;
                var i = 0;
                var ind = index;
                if (ind >= 0 && ind < array.length) {
                    total = (total + 1) | 0;
                    ret = (ret + array[System.Array.index(ind, array)]) | 0;
                }
                while (i < blur) {
                    ind = (ind - 1) | 0;
                    if (ind >= 0 && ind < array.length) {
                        total = (total + 1) | 0;
                        ret = (ret + array[System.Array.index(ind, array)]) | 0;
                    }
                    i = (i + 1) | 0;
                }
                i = 0;
                while (i < blur) {
                    ind = (ind + 1) | 0;
                    if (ind >= 0 && ind < array.length) {
                        total = (total + 1) | 0;
                        ret = (ret + array[System.Array.index(ind, array)]) | 0;
                    }
                    i = (i + 1) | 0;
                }
                return ((Bridge.Int.div(ret, total)) | 0);
            },
            CheckForTile: function (position) {
                /* position = position - this.position;
                position /= tilesize;
                if (position.X>=0 && position.X<columns && position.Y>=0 && position.Y<rows)
                {
                   return data[(int)position.X, (int)position.Y];
                }*/
                var TP = this.position;
                var PX = Bridge.Int.clip32((position.X - TP.X) / this.tilesize);
                var PY = Bridge.Int.clip32((position.Y - TP.Y) / this.tilesize);
                if (PX >= 0 && PX < this.columns && PY >= 0 && PY < this.rows) {
                    return this.data.get([PX, PY]);
                }
                return null;
            },
            GetTile: function (column, row) {
                if (column >= 0 && row >= 0 && column < this.columns && row < this.rows) {
                    return this.data.get([column, row]);
                }
                return null;
            },
            _Draw: function () {
                if (this.needRedraw) {
                    var W = Bridge.Int.clip32(Math.ceil(this.columns * this.tilesize));
                    var H = Bridge.Int.clip32(Math.ceil(this.rows * this.tilesize));

                    if (this.buffer.width !== W || this.buffer.height !== H) {
                        this.buffer.width = W;
                        this.buffer.height = H;
                    } else {
                        this.bg.clearRect(0, 0, this.buffer.width, this.buffer.height);
                    }

                    this.Redraw(this.bg);
                    this.needRedraw = false;
                }
            },
            Draw: function (g) {
                this._Draw();
                //g.DrawImage(buffer, position.X, position.Y);
                this.rtmp.CopyFrom(this.game.camera.CameraBounds);
                //hide floating point seams.
                this.rtmp.x -= 1;
                this.rtmp.y -= 1;
                this.rtmp.width += 2;
                this.rtmp.height += 2;
                var CB = this.rtmp;
                //var CB = game.camera.CameraBounds;
                //g.DrawImage(buffer, CB.left-position.X, CB.top-position.Y, CB.width, CB.height, CB.left, CB.top, CB.width, CB.height);//draw map cropped to camera bounds
                g.drawImage(this.buffer, CB.left - this.position.X, CB.top - this.position.Y, CB.width, CB.height, CB.left, CB.top, CB.width, CB.height); //draw map cropped to camera bounds
            },
            RedrawTile: function (X, Y, updateNeighbors) {
                if (updateNeighbors === void 0) { updateNeighbors = true; }
                if (updateNeighbors) {
                    var TX = Bridge.Int.mul((((X - 1) | 0)), Bridge.Int.clip32(this.tilesize));
                    var TY = Bridge.Int.mul((((Y - 1) | 0)), Bridge.Int.clip32(this.tilesize));
                    this.bg.clearRect(TX, TY, Bridge.Int.mul(Bridge.Int.clip32(this.tilesize), 3), Bridge.Int.mul(Bridge.Int.clip32(this.tilesize), 3));

                    this.Redraw(this.bg, ((X - 1) | 0), ((Y - 1) | 0), 3, 3);
                } else {
                    var TX1 = Bridge.Int.mul((X), Bridge.Int.clip32(this.tilesize));
                    var TY1 = Bridge.Int.mul((Y), Bridge.Int.clip32(this.tilesize));
                    this.bg.clearRect(TX1, TY1, this.tilesize, this.tilesize);

                    this.Redraw(this.bg, X, Y, 1, 1);
                }
            },
            Redraw: function (g, SX, SY, W, H) {
                if (SX === void 0) { SX = -1; }
                if (SY === void 0) { SY = -1; }
                if (W === void 0) { W = -1; }
                if (H === void 0) { H = -1; }
                var PX = this.position.X;
                var PY = this.position.Y;
                PX = 0;
                PY = 0;
                if (SX === -1) {
                    SX = 0;
                }
                if (SY === -1) {
                    SY = 0;
                }

                if (W === -1) {
                    W = this.columns;
                }
                if (H === -1) {
                    H = this.rows;
                }
                var EX = (SX + W) | 0;
                var EY = (SY + H) | 0;
                SX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SX, 0, this.columns));
                SY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SY, 0, this.rows));

                EX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EX, 0, this.columns));
                EY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EY, 0, this.rows));

                var X = PX + (SX * this.tilesize);
                var Y = PY + (SY * this.tilesize);
                var row = SY;
                var column = SX;
                var BG = this.tiles.getItem(2);
                var BG2 = this.tiles.getItem(3);
                var tilesC = this.tiles.Count;

                var R = new CirnoGame.Rectangle();
                var doorroom = CirnoGame.MapGenerator.doorroom;

                while (row < EY) {
                    while (column < EX) {
                        //if (R.isTouching(new Rectangle(X, Y, tilesize, tilesize)))
                        {
                            var T = this.data.get([column, row]);
                            var tex = Math.min(((this.tiles.Count - 1) | 0), T.texture);
                            if (T.enabled && tex >= 0 && tex < tilesC) {
                                g.drawImage(this.tiles.getItem(tex), X, Y);
                                if (T.Breakable && T.HP < T.maxHP) {
                                    var dmg = (Bridge.Int.clip32(Math.max(1, Math.min(Bridge.Math.round(T.maxHP - T.HP, 0, 6), 3))) - 1) | 0;
                                    g.drawImage(this.cracks.getItem(dmg), X, Y);
                                }
                                var sd = T.SlopeDirection;
                                if (sd !== 0) {
                                    //object sg = g;
                                    //Script.Write("sg.globalCompositeOperation = 'destination-out'");
                                    g.globalCompositeOperation = "destination-out";
                                    T.GetHitbox2(R);
                                    R.x -= this.position.X;
                                    R.y -= this.position.Y;
                                    g.beginPath();
                                    g.moveTo(R.left, R.top);
                                    var P;
                                    P = new CirnoGame.Vector2(R.left + (R.width / 2.0), R.top + (R.height / 2.0));
                                    if (sd > 0) {
                                        g.lineTo(R.left, R.bottom);
                                    } else {
                                        g.lineTo(R.right, R.bottom);
                                    }

                                    g.lineTo(R.right, R.top);

                                    g.lineTo(R.left, R.top);

                                    g.fill();

                                    g.globalCompositeOperation = "destination-over";
                                    if (doorroom != null && doorroom.ContainsTile(column, row)) {
                                        g.globalAlpha = 0.5;
                                        g.fillStyle = "#000000";
                                        //g.FillRect(R.x.ToDynamic(), R.y.ToDynamic(), R.width.ToDynamic(), R.height.ToDynamic());
                                        g.fillRect(X, Y, this.tilesize, this.tilesize);
                                        g.globalAlpha = 1.0;
                                    }
                                    g.drawImage(BG, X, Y);
                                    g.globalCompositeOperation = "source-over";

                                }

                            } else {
                                g.drawImage(Math.random() < 0.98 ? BG : BG2, X, Y);
                                if (doorroom != null && doorroom.ContainsTile(column, row)) {
                                    /* T.GetHitbox2(R);
                                    R.x -= position.X;
                                    R.y -= position.Y;*/
                                    g.globalAlpha = 0.5;
                                    g.fillStyle = "#000000";
                                    g.fillRect(X, Y, this.tilesize, this.tilesize);
                                    g.globalAlpha = 1.0;
                                }
                            }
                        }
                        column = (column + 1) | 0;
                        X += this.tilesize;
                    }
                    X = PX + (SX * this.tilesize);
                    Y += this.tilesize;
                    column = SX;
                    row = (row + 1) | 0;
                }
            },
            IsExposed: function (X, Y) {
                var row = (Y - 2) | 0;
                var column = (X - 2) | 0;

                while (row <= ((Y + 2) | 0)) {
                    while (column <= ((X + 2) | 0)) {
                        /* var T = data[column, row];
                        T.texture = Math.Random() < 0.5 ? 0 : 1;*/
                        if (row >= 0 && column >= 0 && row < this.rows && column < this.columns) {
                            var T = this.data.get([column, row]);
                            if (!T.enabled || !T.solid) {
                                return true;
                            }
                        }
                        column = (column + 1) | 0;
                    }
                    row = (row + 1) | 0;
                    column = (X - 2) | 0;
                }
                return false;
            },
            ApplyBreakableRect: function (SX, SY, W, H) {
                if (SX === void 0) { SX = -1; }
                if (SY === void 0) { SY = -1; }
                if (W === void 0) { W = -1; }
                if (H === void 0) { H = -1; }
                if (SX === -1) {
                    SX = 0;
                }
                if (SY === -1) {
                    SY = 0;
                }

                if (W === -1) {
                    W = this.columns;
                }
                if (H === -1) {
                    H = this.rows;
                }
                var EX = (SX + W) | 0;
                var EY = (SY + H) | 0;
                SX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SX, 0, this.columns));
                SY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(SY, 0, this.rows));

                EX = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EX, 0, this.columns));
                EY = Bridge.Int.clip32(CirnoGame.MathHelper.Clamp$1(EY, 0, this.rows));
                var row = SX;
                var column = SY;

                while (row < EY) {
                    while (column < EX) {
                        /* var T = data[column, row];
                        T.texture = Math.Random() < 0.5 ? 0 : 1;*/
                        var T = this.data.get([column, row]);
                        var TT = T.Clone();
                        TT.column = column;
                        TT.row = row;
                        this.data.set([column, row], TT);
                        T = TT;
                        if (this.IsExposed(column, row)) {
                            T.texture = 1;
                            if (Math.random() < 0.02) {
                                T.texture = Math.random() < 0.5 ? 5 : 6;
                            }
                            T.Breakable = true;
                        } else {
                            T.texture = 0;
                            T.Breakable = false;
                        }
                        column = (column + 1) | 0;
                    }
                    row = (row + 1) | 0;
                    column = SX;
                }
                this.needRedraw = true;
            },
            ApplyBreakable: function () {
                var row = 0;
                var column = 0;

                while (row < this.rows) {
                    while (column < this.columns) {
                        /* var T = data[column, row];
                        T.texture = Math.Random() < 0.5 ? 0 : 1;*/
                        var T = this.data.get([column, row]);
                        var TT = T.Clone();
                        TT.column = column;
                        TT.row = row;
                        this.data.set([column, row], TT);
                        T = TT;
                        if (this.IsExposed(column, row)) {
                            T.texture = 1;
                            if (Math.random() < 0.02) {
                                T.texture = Math.random() < 0.5 ? 5 : 6;
                            }
                            T.Breakable = true;
                        } else {
                            T.texture = 0;
                            T.Breakable = false;
                        }
                        column = (column + 1) | 0;
                    }
                    row = (row + 1) | 0;
                    column = 0;
                }
                this.needRedraw = true;
            },
            testTexture: function () {
                var row = 0;
                var column = 0;

                while (row < this.rows) {
                    while (column < this.columns) {
                        var T = this.data.get([column, row]);
                        T.texture = Math.random() < 0.5 ? 0 : 1;
                        column = (column + 1) | 0;
                    }
                    row = (row + 1) | 0;
                    column = 0;
                }
                this.needRedraw = true;
            }
        }
    });

    Bridge.define("CirnoGame.Vector2", {
        statics: {
            props: {
                Empty: {
                    get: function () {
                        return new CirnoGame.Vector2();
                    }
                }
            },
            methods: {
                FromRadian: function (radian) {
                    return CirnoGame.MathHelper.RadianToVector(radian);
                },
                Add: function (A, B) {
                    return new CirnoGame.Vector2(A.X + B.X, A.Y + B.Y);
                },
                Add$1: function (A, X, Y) {
                    return new CirnoGame.Vector2(A.X + X, A.Y + Y);
                },
                Subtract: function (A, B) {
                    return new CirnoGame.Vector2(A.X - B.X, A.Y - B.Y);
                },
                Subtract$1: function (A, X, Y) {
                    return new CirnoGame.Vector2(A.X - X, A.Y - Y);
                },
                op_Equality: function (A, B) {
                    var OA = A;
                    var OB = B;
                    if ((OA == null || OB == null) && (OA != null || OB != null)) {
                        return false;
                    }
                    if (OA == null && OB == null) {
                        return true;
                    }
                    return A.X === B.X && A.Y === B.Y;
                    //return false;
                },
                op_Inequality: function (A, B) {
                    return !(CirnoGame.Vector2.op_Equality(A, B));
                },
                op_Multiply: function (A, scale) {
                    return new CirnoGame.Vector2(A.X * scale, A.Y * scale);
                },
                op_Division: function (A, scale) {
                    return new CirnoGame.Vector2(A.X / scale, A.Y / scale);
                },
                op_Addition: function (A, B) {
                    return new CirnoGame.Vector2(A.X + B.X, A.Y + B.Y);
                },
                op_Subtraction: function (A, B) {
                    return new CirnoGame.Vector2(A.X - B.X, A.Y - B.Y);
                }
            }
        },
        fields: {
            X: 0,
            Y: 0
        },
        props: {
            Length: {
                get: function () {
                    return Math.sqrt((this.X * this.X) + (this.Y * this.Y));
                }
            },
            /**
             * Returns a rough estimate of the vector's length.
             *
             * @instance
             * @public
             * @readonly
             * @memberof CirnoGame.Vector2
             * @function EstimatedLength
             * @type number
             */
            EstimatedLength: {
                get: function () {
                    var A = Math.abs(this.X);
                    var B = Math.abs(this.Y);
                    if (B > A) {
                        var tmp = A;
                        A = B;
                        B = tmp;
                    }
                    B *= 0.34;
                    return A + B;
                    //return (float)(Math.Abs(X) + Math.Abs(Y));
                }
            },
            /**
             * Returns the sum of its absolute parts.
             *
             * @instance
             * @public
             * @readonly
             * @memberof CirnoGame.Vector2
             * @function RoughLength
             * @type number
             */
            RoughLength: {
                get: function () {
                    return Math.abs(this.X) + Math.abs(this.Y);
                }
            }
        },
        ctors: {
            ctor: function (x, y) {
                if (x === void 0) { x = 0.0; }
                if (y === void 0) { y = 0.0; }

                this.$initialize();
                this.X = x;
                this.Y = y;
            }
        },
        methods: {
            Distance: function (P) {
                var XX = this.X - P.X;
                var YY = this.Y - P.Y;
                return Math.sqrt((XX * XX) + (YY * YY));
            },
            /**
             * Returns a rough estimate of the vector's length.
             *
             * @instance
             * @public
             * @this CirnoGame.Vector2
             * @memberof CirnoGame.Vector2
             * @param   {CirnoGame.Vector2}    P
             * @return  {number}
             */
            EstimatedDistance: function (P) {
                var A = Math.abs(this.X - P.X);
                var B = Math.abs(this.Y - P.Y);
                if (B > A) {
                    var tmp = A;
                    A = B;
                    B = tmp;
                }
                B *= 0.34;
                return A + B;
                //return (float)(Math.Abs(X) + Math.Abs(Y));
            },
            Multiply: function (f) {
                this.X *= f;
                this.Y *= f;
            },
            RoughNormalize: function (length) {
                if (length === void 0) { length = 1.0; }
                var D = this.Length / length;
                return new CirnoGame.Vector2(this.X / D, this.Y / D);
            },
            Normalize: function (length) {
                if (length === void 0) { length = 1.0; }
                var distance = Math.sqrt(this.X * this.X + this.Y * this.Y);
                var V = new CirnoGame.Vector2();
                V.X = this.X / distance;
                V.Y = this.Y / distance;
                V.X *= length;
                V.Y *= length;
                return V;
            },
            SetAsNormalize: function (length) {
                if (length === void 0) { length = 1.0; }
                var distance = Math.sqrt(this.X * this.X + this.Y * this.Y);
                this.X = this.X / distance;
                this.Y = this.Y / distance;
                this.X *= length;
                this.Y *= length;
            },
            ToCardinal: function () {
                var x = this.X;
                var y = this.Y;
                var A = Math.abs(this.X);
                var B = Math.abs(this.Y);
                if (B > A) {
                    x = 0;
                } else if (A > B) {
                    y = 0;
                }
                return new CirnoGame.Vector2(x, y);
            },
            Equals: function (o) {
                var B = o;
                if (CirnoGame.Vector2.op_Inequality(this, B) && CirnoGame.Vector2.op_Equality(B, null)) {
                    return false;
                }
                return B.X === this.X && B.Y === this.Y;
            },
            equals: function (o) {
                if (Bridge.is(o, CirnoGame.Vector2)) {
                    var B = Bridge.cast(o, CirnoGame.Vector2);
                    if (CirnoGame.Vector2.op_Inequality(this, B) && CirnoGame.Vector2.op_Equality(B, null)) {
                        return false;
                    }
                    return B.X === this.X && B.Y === this.Y;
                }
                return Bridge.equals(this, o);
            },
            ToAngle: function () {
                return CirnoGame.MathHelper.WrapRadians(CirnoGame.MathHelper.GetAngle(this));
                //return MathHelper.WrapRadians(MathHelper.GetAngle(new Vector2(), this));
            },
            Clone: function () {
                return new CirnoGame.Vector2(this.X, this.Y);
            },
            CopyFrom: function (V) {
                if (CirnoGame.Vector2.op_Equality(V, null)) {
                    return;
                }
                this.X = V.X;
                this.Y = V.Y;
            },
            Rotate: function (radian) {
                var angle = this.ToAngle() + radian;
                return CirnoGame.Vector2.FromRadian(angle).Normalize(this.Length);
            },
            Add: function (V) {
                this.X += V.X;
                this.Y += V.Y;
            },
            Subtract: function (V) {
                this.X -= V.X;
                this.Y -= V.Y;
            }
        }
    });

    Bridge.define("CirnoGame.AimedShooter", {
        inherits: [CirnoGame.EntityBehavior],
        fields: {
            time: 0,
            maxtime: 0,
            Target: null,
            maxDistance: 0,
            attackpower: 0
        },
        ctors: {
            init: function () {
                this.time = 0;
                this.maxtime = 480;
                this.maxDistance = 130;
                this.attackpower = 1;
            },
            ctor: function (entity) {
                this.$initialize();
                CirnoGame.EntityBehavior.ctor.call(this, entity);
                /* entity.Ani.HueColor = "#FF0000";
                entity.Ani.HueRecolorStrength = 2.0f;*/
                entity.Ani.Shadowcolor = "#FF0000";
            }
        },
        methods: {
            Update: function () {
                CirnoGame.EntityBehavior.prototype.Update.call(this);
                this.UpdateTarget();
                var A = this.entity.Ani;



                if (this.Target != null) {
                    if (this.time < 60) {
                        //if ((time & 4) > 0)
                        if (true) {
                            //A.Shadow = 6-(time * 0.1f);
                            A.Shadow = 5;
                        } else {
                            A.Shadow = 0;
                        }
                    } else {
                        A.Shadow = 0;
                    }
                    this.time = (this.time - 1) | 0;
                    if (this.time <= 0) {
                        this.ResetTimer();
                        this.Shoot();
                    }
                } else {
                    A.Shadow = 0;
                }
                /* A.Shadowcolor = A.HueColor;
                A.Shadow = A.Shadowcolor != "" ? 0 : 3;
                A.HueColor = "#FF0000";
                A.HueRecolorStrength = 2.0f;*/
                //A.Update();

            },
            UpdateTarget: function () {
                if (this.Target != null) {
                    if (this.Target.Position.EstimatedDistance(this.entity.Position) > this.maxDistance) {
                        this.Target = null;
                    } else {
                        return;
                    }
                }
                var T = this.entity.Game.player;
                if (T.Position.EstimatedDistance(this.entity.Position) < this.maxDistance) {
                    this.Target = T;
                    this.ResetTimer();
                }
            },
            ResetTimer: function () {
                this.time = (((Bridge.Int.div(this.maxtime, 2)) | 0));
                this.time = (this.time + Bridge.Int.clip32(Bridge.Math.round(this.time * Math.random(), 0, 6))) | 0;
            },
            Shoot: function () {
                if (this.Target == null || Bridge.cast(this.Target, CirnoGame.ICombatant).CirnoGame$ICombatant$HP <= 0) {
                    return;
                }
                var P = new CirnoGame.PlayerBullet(this.entity.Game, this.entity, "images/misc/ebullet");
                P.Position.CopyFrom(this.entity.getCenter());

                var D = (CirnoGame.Vector2.op_Subtraction(this.Target.getCenter(), P.Position));
                D.SetAsNormalize(0.5);
                P.Hspeed = D.X;
                P.Vspeed = D.Y;
                P.touchDamage = this.attackpower;
                this.entity.Game.AddEntity(P);
            }
        }
    });

    Bridge.define("CirnoGame.ButtonSprite", {
        inherits: [CirnoGame.Sprite],
        fields: {
            _buttonNeedsRerender: false,
            _buttonBuffer: null,
            _buttonGraphic: null,
            Data: null,
            _contents: null,
            _borderSize: 0,
            _borderColor: null,
            LockedClickSound: null,
            ClickSound: null,
            _buttonColor: null,
            ColorSchemes: null,
            locked: false,
            OnClick: null,
            LContentSize: null
        },
        props: {
            Contents: {
                get: function () {
                    return this._contents;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._contents, value)) {
                        this._contents = value;
                        this._buttonNeedsRerender = true;
                    }
                }
            },
            BorderSize: {
                get: function () {
                    return this._borderSize;
                },
                set: function (value) {
                    if (this._borderSize !== value) {
                        this._borderSize = value;
                        this._buttonNeedsRerender = true;
                    }
                }
            },
            BorderColor: {
                get: function () {
                    return this._borderColor;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._borderColor, value)) {
                        this._borderColor = value;
                        this._buttonNeedsRerender = true;
                    }
                }
            },
            ButtonColor: {
                get: function () {
                    return this._buttonColor;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._buttonColor, value)) {
                        this._buttonColor = value;
                        this._buttonNeedsRerender = true;
                    }
                }
            }
        },
        ctors: {
            init: function () {
                this.LockedClickSound = "hit";
                this.ClickSound = "select";
                this.locked = false;
                this.LContentSize = new CirnoGame.Vector2();
            },
            ctor: function (contents, borderSize, borderColor, buttonColor, data) {
                if (borderSize === void 0) { borderSize = 2; }
                if (borderColor === void 0) { borderColor = "#00AA33"; }
                if (buttonColor === void 0) { buttonColor = "#11CC55"; }
                if (data === void 0) { data = null; }

                this.$initialize();
                CirnoGame.Sprite.ctor.call(this);
                this.Contents = contents;
                this.BorderSize = borderSize;
                this.BorderColor = borderColor;
                this.ButtonColor = buttonColor;

                this._buttonBuffer = new CirnoGame.Sprite();
                this._buttonBuffer.Size = contents.Size;
                this._buttonGraphic = this._buttonBuffer.GetGraphics();
                this._buttonNeedsRerender = true;
                this.ColorSchemes = new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite.ColorScheme)).ctor();
                this.ColorSchemes.add(new CirnoGame.ButtonSprite.ColorScheme(borderColor, buttonColor));
                this.ColorSchemes.add(new CirnoGame.ButtonSprite.ColorScheme("#FFFFFF", "#FF0000"));
                this.ColorSchemes.add(new CirnoGame.ButtonSprite.ColorScheme("#777777", "#CCCCCC"));

                this.Data = data;
                if (data == null && Bridge.is(contents, CirnoGame.TextSprite)) {
                    this.Data = Bridge.cast(contents, CirnoGame.TextSprite).Text;
                }

                this.Draw(null);
            }
        },
        methods: {
            SetColorScheme: function (scheme) {
                this.BorderColor = scheme.BorderColor;
                this.ButtonColor = scheme.ButtonColor;
            },
            SetColorScheme$1: function (index) {
                var C = this.ColorSchemes.getItem(index);
                this.SetColorScheme(C);
            },
            drawButton: function () {
                var g = this._buttonGraphic;
                var sz = (this._borderSize + this._borderSize) | 0;
                this._buttonBuffer.Size = CirnoGame.Vector2.op_Addition(this.Contents.Size, new CirnoGame.Vector2(sz, sz));
                var size = this._buttonBuffer.Size;

                g.fillStyle = this._borderColor;
                g.fillRect(0, 0, size.X, size.Y);

                g.fillStyle = this.ButtonColor;
                g.fillRect(this._borderSize, this._borderSize, ((Bridge.Int.clip32(size.X) - sz) | 0), ((Bridge.Int.clip32(size.Y) - sz) | 0));

                var color = "rgba(255,255,255,0)";

                var wht = "rgba(255,255,255,0.7)";


                var grd = g.createLinearGradient(0, 0, 0, size.Y);
                grd.addColorStop(0, color);
                grd.addColorStop(0.4, wht);
                grd.addColorStop(1, color);
                g.fillStyle = grd;
                g.fillRect(0, 0, this._buttonBuffer.Size.X, this._buttonBuffer.Size.Y);
            },
            Lock: function (setcolorscheme) {
                if (setcolorscheme === void 0) { setcolorscheme = true; }
                if (this.locked) {
                    return;
                }
                this.locked = true;
                if (setcolorscheme) {
                    this.SetColorScheme$1(2);
                }
            },
            Unlock: function (setcolorscheme) {
                if (setcolorscheme === void 0) { setcolorscheme = true; }
                if (!this.locked) {
                    return;
                }
                this.locked = false;
                if (setcolorscheme) {
                    this.SetColorScheme$1(0);
                }
            },
            CheckClick: function (mousePosition) {
                if (this.Visible && this.GetBounds().containsPoint(mousePosition)) {
                    if (this.locked) {
                        if (!Bridge.referenceEquals(this.LockedClickSound, "") && this.LockedClickSound != null) {
                            CirnoGame.AudioManager._this.Blast(System.String.concat("SFX/", this.LockedClickSound, ".ogg"));
                        }
                        return false;
                    }

                    if (!Bridge.referenceEquals(this.ClickSound, "") && this.ClickSound != null) {
                        //AudioManager._this.Get("SFX/" + ClickSound);
                        CirnoGame.AudioManager._this.Blast(System.String.concat("SFX/", this.ClickSound, ".ogg"));

                    }
                    var tmp = this.OnClick;
                    if (tmp) {
                        this.OnClick();
                    }
                    return true;
                }
                return false;
            },
            Draw: function (g) {
                //if (_contents.Size != LContentSize)
                if (this._contents.Size.X !== this.LContentSize.X || this._contents.Size.Y !== this.LContentSize.Y) {
                    this._buttonNeedsRerender = true;
                    this.LContentSize = this._contents.Size.Clone();
                }
                if (this._buttonNeedsRerender) {
                    this.drawButton();
                    this._buttonNeedsRerender = false;
                }
                this.Size = this._buttonBuffer.Size.Clone();
                //spriteGraphics.DrawImage(_bu)
                this._buttonBuffer.Draw(this.spriteGraphics);
                this.Contents.Position = new CirnoGame.Vector2(this._borderSize, this._borderSize);
                this.Contents.Draw(this.spriteGraphics);

                if (g != null) {
                    CirnoGame.Sprite.prototype.Draw.call(this, g);
                }
            }
        }
    });

    Bridge.define("CirnoGame.Chest", {
        inherits: [CirnoGame.Entity],
        fields: {
            ForceLocked: false,
            TupleNames: null
        },
        props: {
            Golden: false,
            Opened: false
        },
        ctors: {
            init: function () {
                this.ForceLocked = false;
                this.TupleNames = System.Array.init(["Null", "Single", "Double", "Triple", "Quadruple", "Quintuple", "Sextuple", "Septuple", "Octuple", "Nonuple", "Decuple"], System.String);
            },
            ctor: function (game) {
                this.$initialize();
                CirnoGame.Entity.ctor.call(this, game);
                this.Ani = new CirnoGame.Animation(CirnoGame.AnimationLoader._this.GetAnimation("images/misc/chest"));
                this.Ani.ImageSpeed = 0;
            }
        },
        methods: {
            Goldify: function () {
                var P = this.Ani.Position;
                this.Ani = new CirnoGame.Animation(CirnoGame.AnimationLoader._this.GetAnimation("images/misc/goldchest"));
                this.Ani.ImageSpeed = 0;
                this.Ani.Position.CopyFrom(P);
                this.Golden = true;
            },
            Update: function () {
                CirnoGame.Entity.prototype.Update.call(this);
                var F = this.GetFloor();
                if (F == null) {
                    this.Vspeed = 2;
                } else {
                    this.Vspeed = 0;
                    this.y = F.GetHitbox().top - this.Ani.CurrentImage.height;
                }
                var P = this.Game.player;
                if (P.Position.EstimatedDistance(this.Position) < 16) {
                    if (!this.ForceLocked) {
                        if (!this.Opened && P.Controller[System.Array.index(2, P.Controller)] && (P.keys > 0 || this.Golden)) {
                            if (!this.Golden) {
                                P.keys = (P.keys - 1) | 0;
                            }
                            this.Open(P);
                        }
                    } else if (P.Controller[System.Array.index(2, P.Controller)]) {
                        P.MSG.ChangeText("It's sealed with magic...");
                    }
                }
            },
            Open: function (player) {
                if (!this.Opened) {
                    this.PlaySound("chestopen");
                    this.Ani.CurrentFrame = 1;
                    this.Ani.SetImage();
                    this.Ani.Update();
                    this.Opened = true;
                    //TODO:give player a permanent upgrade, and display text above the chest telling the player what they just got
                    var M = "";
                    var ok = true;
                    var S = "";
                    var color = "#FFFFFF";
                    var picker = null;
                    while (ok) {
                        var common = System.Array.init(["point", "point", "point", "point", "point", "point", "heart", "heart", "tripleheart", "singleorb"], System.String);
                        var rare = System.Array.init(["attackpower", "defensepower", "mining"], System.String);
                        var legendary = System.Array.init(["triplejump", "cheaperblocks", "invincibility", "repeater"], System.String);



                        var R = Math.random();
                        var C;

                        if (picker == null || Math.random() < 0.2) {
                            if (R < 0.7 && !this.Golden) {
                                picker = common;
                                S = "common";
                                color = "#FFFFFF";
                            } else {
                                R = Math.random();
                                if (R < 0.91) {
                                    picker = rare;
                                    S = "rare";
                                    color = "#FFBB33";
                                } else {
                                    picker = legendary;
                                    S = "legendary";
                                    color = "#FF55FF";
                                }
                            }
                        }
                        C = CirnoGame.HelperExtensions.Pick(System.String, picker);
                        ok = false;
                        var CI;
                        switch (C) {
                            case "point": 
                                var P = new CirnoGame.PointItem(this.Game);
                                P.Position.CopyFrom(this.Position);
                                P.Vspeed = -2.0;
                                P.Hspeed = -2.0;
                                P.collectionDelay = 30;
                                this.Game.AddEntity(P);
                                P = new CirnoGame.PointItem(this.Game);
                                P.Position.CopyFrom(this.Position);
                                P.Vspeed = -2.0;
                                P.Hspeed = 2.0;
                                P.collectionDelay = 30;
                                this.Game.AddEntity(P);
                                M = "Points";
                                break;
                            case "heart": 
                                if (player.HP >= player.maxHP) {
                                    ok = true;
                                    break;
                                }
                                var H = new CirnoGame.HealingItem(this.Game);
                                H.Position.CopyFrom(this.Position);
                                H.Vspeed = -2.0;
                                H.collectionDelay = 30;
                                this.Game.AddEntity(H);
                                M = "Heal";
                                break;
                            case "tripleheart": 
                                if (player.HP > player.maxHP / 3) {
                                    ok = true;
                                    break;
                                }
                                var H1 = new CirnoGame.HealingItem(this.Game);
                                H1.Position.CopyFrom(this.Position);
                                H1.Vspeed = -2.0;
                                H1.Hspeed = -2.0;
                                H1.collectionDelay = 30;
                                this.Game.AddEntity(H1);
                                H1 = new CirnoGame.HealingItem(this.Game);
                                H1.Position.CopyFrom(this.Position);
                                H1.Vspeed = -2.0;
                                H1.Hspeed = 0;
                                H1.collectionDelay = 30;
                                this.Game.AddEntity(H1);
                                H1 = new CirnoGame.HealingItem(this.Game);
                                H1.Position.CopyFrom(this.Position);
                                H1.Vspeed = -2.0;
                                H1.Hspeed = 2.0;
                                H1.collectionDelay = 30;
                                this.Game.AddEntity(H1);
                                M = "Heal x3";
                                break;
                            case "singleorb": 
                                if (this.Game.timeRemaining > 0) {
                                    ok = true;
                                    break;
                                }
                                CI = new CirnoGame.Orb(this.Game);
                                CI.Position.CopyFrom(this.Position);
                                CI.Vspeed = -2.0;
                                CI.Hspeed = -2.0;
                                CI.collectionDelay = 30;
                                this.Game.AddEntity(CI);
                                /* CI = new Orb(Game);
                                CI.Position.CopyFrom(Position);
                                CI.Vspeed = -2f;
                                CI.Hspeed = 2f;
                                CI.collectionDelay = 30;
                                Game.AddEntity(CI);*/
                                M = "Orb";
                                break;
                            case "mining": 
                                if (player.digpower < 2.0) {
                                    player.digpower += 0.5;
                                } else {
                                    ok = true;
                                }
                                M = "Mining Power " + System.Single.format((player.digpower)) + "x";
                                break;
                            case "triplejump": 
                                var PC = player.GetBehavior(CirnoGame.PlatformerControls);
                                if (PC.maxAirJumps < 2) {
                                    PC.maxAirJumps = 2;
                                } else {
                                    ok = true;
                                }
                                M = "Triple Jump";
                                break;
                            case "cheaperblocks": 
                                if (player.blockprice !== 9) {
                                    ok = true;
                                    break;
                                }
                                player.blockprice = 6;
                                M = "Blocks are cheaper now";
                                break;
                            case "invincibility": 
                                if (player.invincibilitymod !== 1) {
                                    ok = true;
                                    break;
                                }
                                player.invincibilitymod = 2;
                                M = "Invincibility extended";
                                break;
                            case "attackpower": 
                                player.attackpower += 1;
                                M = "Attack Power " + Bridge.Int.clip32((player.attackpower));
                                break;
                            case "defensepower": 
                                player.defensepower += 1;
                                M = "Defensive Power " + Bridge.Int.clip32((player.defensepower));
                                break;
                            case "repeater": 
                                if (player.totalshots > 2) {
                                    ok = true;
                                    break;
                                }
                                player.totalshots = (player.totalshots + 1) | 0;
                                M = System.String.concat(this.TupleNames[System.Array.index(player.totalshots, this.TupleNames)], " shot");
                                break;
                            default: 
                                ok = true;
                                break;
                        }

                    }
                    if (!ok && !Bridge.referenceEquals(M, "")) {
                        var FM = new CirnoGame.FloatingMessage(this.Game, M);
                        FM.Text.TextColor = color;
                        //FM.Position = new Vector2(x - 8, y - 20);
                        FM.Position = new CirnoGame.Vector2(this.x + 8, this.y - 20);
                        this.Game.AddEntity(FM);
                        if (!Bridge.referenceEquals(S, "") && !Bridge.referenceEquals(S, "common")) {
                            this.PlaySound("ok2B");
                        } else {
                            this.PlaySound("jump");
                        }
                    }
                }
            },
            GetFloor: function () {
                var T = null;
                var W = this.Width / 3;
                var Y = this.Height;
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, this.Width / 2, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, W, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, this.Width - W, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = null;
                }
                return T;
            }
        }
    });

    Bridge.define("CirnoGame.CollectableItem", {
        inherits: [CirnoGame.Entity],
        fields: {
            floats: false,
            magnetDistance: 0,
            magnetSpeed: 0,
            maxFallSpeed: 0,
            fallaccel: 0,
            itemName: null,
            collectionDelay: 0,
            sound: null
        },
        ctors: {
            init: function () {
                this.floats = true;
                this.magnetDistance = 35;
                this.magnetSpeed = 8;
                this.maxFallSpeed = 2;
                this.fallaccel = 0.1;
                this.collectionDelay = 10;
                this.sound = "powerup";
            },
            ctor: function (game, itemName) {
                this.$initialize();
                CirnoGame.Entity.ctor.call(this, game);
                this.Ani = new CirnoGame.Animation(CirnoGame.AnimationLoader.Get(System.String.concat("images/items/", itemName)));
                this.Ani.SetImage();
                this.itemName = itemName;
            }
        },
        methods: {
            CanCollect: function (player) {
                return true;
            },
            Update: function () {
                if (this.collectionDelay > 0) {
                    this.collectionDelay = (this.collectionDelay - 1) | 0;
                }
                var C;
                var player = this.Game.player;

                if (this.collectionDelay <= 0 && this.CanCollect(player) && (((C = player.getCenter())).EstimatedDistance(this.Position) < this.magnetDistance)) {
                    var C2 = this.getCenter();
                    var P = CirnoGame.Vector2.op_Subtraction(C, C2);
                    var ln = P.Length;
                    var spd = this.magnetSpeed;
                    var fspd = spd / Math.max(1, ln);
                    if (ln <= fspd) {
                        //((PlayerCharacter)Game.player).onCollectItem(this);
                        this.Alive = false;
                        this.Hspeed = 0;
                        this.Vspeed = 0;
                        this.Position.CopyFrom(this.Game.player.Position);
                        this.onCollected(this.Game.player);
                        this.PlaySound(this.sound);
                        return;

                    }
                    P = P.Normalize(fspd);
                    /* x += P.X;
                    y += P.Y;*/
                    this.Hspeed = P.X;
                    this.Vspeed = P.Y;

                    //Vspeed = 0;
                } else if (!this.floats) {
                    var F = this.GetFloor();
                    if (F == null) {
                        if (this.Vspeed < this.maxFallSpeed) {
                            this.Vspeed = Math.min(this.Vspeed + this.fallaccel, this.maxFallSpeed);
                        } else {
                            this.Vspeed = this.maxFallSpeed;
                        }
                    } else {
                        this.Vspeed = 0;
                        this.y = F.GetHitbox().top - this.Ani.CurrentImage.height;
                    }
                    //Hspeed = 0;
                    this.Hspeed = CirnoGame.MathHelper.Decelerate(this.Hspeed, 0.1);
                } else {
                    //Hspeed = 0;
                    //Vspeed = 0;
                    this.Hspeed = CirnoGame.MathHelper.Decelerate(this.Hspeed, 0.1);
                    this.Vspeed = CirnoGame.MathHelper.Decelerate(this.Vspeed, 0.1);
                }
                CirnoGame.Entity.prototype.Update.call(this);
            },
            GetFloor: function () {
                var T = null;
                var W = this.Width / 3;
                var Y = this.Height;
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, this.Width / 2, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, W, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, this.Width - W, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = null;
                }
                return T;
            }
        }
    });

    Bridge.define("CirnoGame.ControllableEntity", {
        inherits: [CirnoGame.Entity],
        fields: {
            Controller: null,
            LController: null
        },
        ctors: {
            ctor: function (game) {
                this.$initialize();
                CirnoGame.Entity.ctor.call(this, game);
                this.Controller = System.Array.init(7, false, System.Boolean);
                this.LController = System.Array.init(this.Controller.length, false, System.Boolean);
            }
        },
        methods: {
            /**
             * returns true if the button was just pressed.
             *
             * @instance
             * @public
             * @this CirnoGame.ControllableEntity
             * @memberof CirnoGame.ControllableEntity
             * @param   {number}     button
             * @return  {boolean}
             */
            Pressed: function (button) {
                return (this.Controller[System.Array.index(button, this.Controller)] !== this.LController[System.Array.index(button, this.LController)] && this.Controller[System.Array.index(button, this.Controller)]);
            },
            /**
             * returns true if just released.
             *
             * @instance
             * @public
             * @this CirnoGame.ControllableEntity
             * @memberof CirnoGame.ControllableEntity
             * @param   {number}     button
             * @return  {boolean}
             */
            Released: function (button) {
                return (this.Controller[System.Array.index(button, this.Controller)] !== this.LController[System.Array.index(button, this.LController)] && !this.Controller[System.Array.index(button, this.Controller)]);
            }
        }
    });

    Bridge.define("CirnoGame.ExitDoor", {
        inherits: [CirnoGame.Entity],
        fields: {
            reset: 0,
            RT: null,
            _Opened: false
        },
        props: {
            Opened: {
                get: function () {
                    return this._Opened;
                },
                set: function (value) {
                    this._Opened = value;
                    if (this._Opened) {
                        this.Ani.CurrentFrame = 1;
                        this.Ani.SetImage();
                    } else {
                        this.Ani.CurrentFrame = 0;
                        this.Ani.SetImage();
                    }
                }
            }
        },
        ctors: {
            init: function () {
                this.reset = 0;
                this._Opened = false;
            },
            ctor: function (game) {
                this.$initialize();
                CirnoGame.Entity.ctor.call(this, game);
                this.Ani = new CirnoGame.Animation(CirnoGame.AnimationLoader.Get("images/misc/door"));
                this.Ani.ImageSpeed = 0;
                this.Ani.SetImage();
                this.RemovedOnLevelEnd = false;
            }
        },
        methods: {
            DropToGround: function () {
                while (this.GetFloor() == null) {
                    this.y += 16;
                }
                var F = this.GetFloor();
                //F.Breakable = false;
                var FB = F.GetHitbox();
                this.x = FB.left;
                this.y = FB.top - 32;
                var T = this.Game.TM.GetTile(F.column, ((F.row - 1) | 0));
                if (T != null && T.enabled && T.topSolid) {
                    this.y -= 16;
                    F = T;
                    console.log("dug door out of the ground");

                }
                this.RT = F;
                /* F.Breakable = false;
                F.texture = 0;

                Game.TM.RedrawTile(F.column, F.row);*/
                this.reset = 0;

            },
            Update: function () {
                CirnoGame.Entity.prototype.Update.call(this);
                if (!this._Opened) {
                    return;
                }
                /* var F = GetFloor();
                if (F == null)
                {
                   Vspeed = 1;
                }
                else
                {
                   Vspeed = 0;
                   y = F.GetHitbox().top - Ani.CurrentImage.Height;
                }*/
                var P = this.Game.player;
                if (P.Position.EstimatedDistance(this.Position) < 20 && P.Controller[System.Array.index(2, P.Controller)]) {
                    this.Opened = false;
                    P.score = (P.score + (Bridge.Int.mul(this.Game.level, 10))) | 0;
                    this.Game.StartNextLevel();

                    /* P.keys--;
                    Open(P);*/
                    /* Ani.CurrentFrame = 1;
                    Ani.SetImage();
                    Ani.Update();*/
                }
                if (this.reset < 2) {
                    this.reset = (this.reset + 1) | 0;
                    //reset = false;
                    //var F = GetFloor();
                    var F = this.RT;
                    if (F != null && this.reset === 2) {
                        F.Breakable = false;
                        F.texture = 0;
                        this.Game.TM.RedrawTile(F.column, F.row);
                    }
                }
            },
            GetFloor: function () {
                var T = null;
                var W = this.Width / 3;
                var Y = this.Height;
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, this.Width / 2, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, W, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, this.Width - W, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = null;
                }
                return T;
            }
        }
    });

    Bridge.define("CirnoGame.FlightControls", {
        inherits: [CirnoGame.EntityBehavior],
        fields: {
            accel: 0,
            maxSpeed: 0,
            _platformer: null
        },
        ctors: {
            init: function () {
                this.accel = 0.35;
                this.maxSpeed = 1.5;
            },
            ctor: function (entity) {
                this.$initialize();
                CirnoGame.EntityBehavior.ctor.call(this, entity);
                this._platformer = entity;
            }
        },
        methods: {
            Update: function () {
                var controller = this._platformer.Controller;
                if (controller[System.Array.index(0, controller)] && this._platformer.Hspeed > -this.maxSpeed) {
                    this._platformer.Hspeed = Math.max(this._platformer.Hspeed - (this.accel + this._platformer.friction), -this.maxSpeed);
                }
                if (controller[System.Array.index(1, controller)] && this._platformer.Hspeed < this.maxSpeed) {
                    this._platformer.Hspeed = Math.min(this._platformer.Hspeed + (this.accel + this._platformer.friction), this.maxSpeed);
                }
                if (controller[System.Array.index(2, controller)] && this._platformer.Vspeed > -this.maxSpeed) {
                    this._platformer.Vspeed = Math.max(this._platformer.Vspeed - (this.accel + this._platformer.friction), -this.maxSpeed);
                }
                if (controller[System.Array.index(3, controller)] && this._platformer.Vspeed < this.maxSpeed) {
                    this._platformer.Vspeed = Math.min(this._platformer.Vspeed + (this.accel + this._platformer.friction), this.maxSpeed);
                }
                /* var jumpbutton = 5;
                if (_platformer.Vspeed >= 0 && _platformer.onGround)
                {
                   if (_platformer.Pressed(jumpbutton) && _platformer.onGround && _platformer.Ceiling == null)
                   {
                       _platformer.Vspeed = -jumpSpeed;
                       ///entity.PlaySound("jump");
                   }
                }
                else if (airJumps < maxAirJumps && _platformer.Pressed(jumpbutton) && _platformer.Ceiling == null)
                {
                   _platformer.Vspeed = -(jumpSpeed * airjumppower);
                   airJumps++;
                }
                if (_platformer.Vspeed < 0 && !controller[jumpbutton])
                {
                   _platformer.Vspeed += (_platformer.gravity * 2);
                }*/
                CirnoGame.EntityBehavior.prototype.Update.call(this);
            }
        }
    });

    Bridge.define("CirnoGame.FloatingMessage", {
        inherits: [CirnoGame.Entity],
        fields: {
            time: 0,
            Text: null,
            alpha: 0,
            autokill: false
        },
        ctors: {
            init: function () {
                this.time = 30;
                this.alpha = 1;
                this.autokill = true;
            },
            ctor: function (game, text) {
                this.$initialize();
                CirnoGame.Entity.ctor.call(this, game);
                this.Ani = new CirnoGame.Animation(null);
                this.Text = new CirnoGame.TextSprite();
                this.Text.Text = text;
                this.Text.TextColor = "#FFFFFF";
                this.Text.ShadowColor = "#000000";
                this.Text.ShadowOffset = new CirnoGame.Vector2(2, 2);
                this.Text.ShadowBlur = 1;
                this.Text.FontSize = 14;
                this.time = (30 + (Bridge.Int.mul(text.length, 20))) | 0;
            }
        },
        methods: {
            ChangeText: function (text, color) {
                if (color === void 0) { color = null; }
                this.Text.Text = text;
                this.time = (30 + (Bridge.Int.mul(text.length, 20))) | 0;
                this.alpha = 1;
                if (color != null) {
                    this.Text.TextColor = color;
                }
            },
            Update: function () {
                CirnoGame.Entity.prototype.Update.call(this);
                if (this.time > 0) {
                    this.time = (this.time - 1) | 0;
                    if (this.time < 1 && this.alpha > 0) {
                        //Alive = false;
                        this.alpha -= 0.05;
                        if (this.alpha <= 0) {
                            this.alpha = 0;
                            if (this.autokill) {
                                this.Alive = false;
                            }
                        }
                        this.time = 1;
                    }
                }
            },
            Draw: function (g) {
                //base.Draw(g);
                if (this.alpha < 1) {
                    if (this.alpha <= 0) {
                        return;
                    }
                    g.globalAlpha = this.alpha;
                }
                //Text.Position.CopyFrom(Position);
                this.Text.ForceUpdate();
                this.Text.Position.X = (Bridge.Int.clip32(this.Position.X) - (((Bridge.Int.div(this.Text.spriteBuffer.width, 2)) | 0))) | 0;
                this.Text.Position.Y = (Bridge.Int.clip32(this.Position.Y) - (((Bridge.Int.div(this.Text.spriteBuffer.height, 2)) | 0))) | 0;
                this.Text.Draw(g);
                g.globalAlpha = 1.0;
            }
        }
    });

    Bridge.define("CirnoGame.GameSprite", {
        inherits: [CirnoGame.Sprite],
        ctors: {
            ctor: function () {
                this.$initialize();
                CirnoGame.Sprite.ctor.call(this);

            }
        },
        methods: {
            Update: function () {

            },
            Render: function () {

            }
        }
    });

    Bridge.define("CirnoGame.Particle", {
        inherits: [CirnoGame.Entity],
        fields: {
            HP: 0,
            alphatime: 0
        },
        ctors: {
            init: function () {
                this.HP = 12;
                this.alphatime = 0.2;
            },
            ctor: function (game, image) {
                this.$initialize();
                CirnoGame.Entity.ctor.call(this, game);
                this.Ani = new CirnoGame.Animation(new (System.Collections.Generic.List$1(HTMLImageElement)).$ctor1(System.Array.init([image], HTMLImageElement)));
            }
        },
        methods: {
            Update: function () {
                var $t;
                this.HP = (this.HP - 1) | 0;
                if (this.HP <= 0) {
                    if ((($t = this.Ani.Alpha - this.alphatime, this.Ani.Alpha = $t, $t)) <= 0) {
                        this.Alive = false;
                    }
                    /* if (alphatime > 0)
                    {
                       alpha -= alphatime;
                       Ani.Alpha = alpha;
                       if (alpha <= 0)
                       {
                           Alive = false;
                       }
                    }
                    else
                    {
                       Alive = false;
                    }*/
                }
                CirnoGame.Entity.prototype.Update.call(this);
            }
        }
    });

    Bridge.define("CirnoGame.PlatformerControls", {
        inherits: [CirnoGame.EntityBehavior],
        fields: {
            _platformer: null,
            accel: 0,
            jumpSpeed: 0,
            maxSpeed: 0,
            maxAirJumps: 0,
            airJumps: 0,
            airjumppower: 0
        },
        ctors: {
            init: function () {
                this.accel = 0.35;
                this.jumpSpeed = 2.25;
                this.maxSpeed = 1.5;
                this.maxAirJumps = 1;
                this.airJumps = 0;
                this.airjumppower = 0.815;
            },
            ctor: function (entity) {
                this.$initialize();
                CirnoGame.EntityBehavior.ctor.call(this, entity);
                this._platformer = entity;
            }
        },
        methods: {
            Update: function () {
                var againstwall = false;
                var controller = this._platformer.Controller;
                var X = 0;
                if (controller[System.Array.index(0, controller)] && !controller[System.Array.index(1, controller)] && this._platformer.Hspeed > -this.maxSpeed) {
                    this._platformer.Hspeed = Math.max(this._platformer.Hspeed - (this.accel + this._platformer.friction), -this.maxSpeed);
                    X = -1;
                    if (this._platformer.RightWall != null) {
                        againstwall = true;
                    }
                }
                if (controller[System.Array.index(1, controller)] && !controller[System.Array.index(0, controller)] && this._platformer.Hspeed < this.maxSpeed) {
                    this._platformer.Hspeed = Math.min(this._platformer.Hspeed + (this.accel + this._platformer.friction), this.maxSpeed);
                    X = 1;
                    if (this._platformer.LeftWall != null) {
                        againstwall = true;
                    }
                }
                var jumpbutton = 5;
                if (this._platformer.onGround) {
                    this.airJumps = 0;
                }
                if (this._platformer.Vspeed >= 0 && this._platformer.onGround) {
                    if (this._platformer.Pressed(jumpbutton) && this._platformer.onGround && this._platformer.Ceiling == null) {
                        this._platformer.Vspeed = -this.jumpSpeed;
                        this.entity.PlaySound("jump");
                    }
                } else if (this.airJumps < this.maxAirJumps && this._platformer.Pressed(jumpbutton) && this._platformer.Ceiling == null) {
                    this._platformer.Vspeed = -(this.jumpSpeed * this.airjumppower);
                    this.airJumps = (this.airJumps + 1) | 0;
                }
                if (this._platformer.Vspeed < 0 && !controller[System.Array.index(jumpbutton, controller)]) {
                    this._platformer.Vspeed += (this._platformer.gravity * 2);
                }
                CirnoGame.EntityBehavior.prototype.Update.call(this);
            }
        }
    });

    Bridge.define("CirnoGame.PlayerBullet", {
        inherits: [CirnoGame.Entity,CirnoGame.IHarmfulEntity,CirnoGame.ILightSource],
        fields: {
            shooter: null,
            Duration: 0,
            hitEntities: null,
            piercing: false,
            spinrate: 0,
            Gravity: null,
            Bounces: false,
            attacksterrain: false,
            digpower: 0,
            _maxLightRadius: 0,
            _touchDamage: 0
        },
        props: {
            Attacker: {
                get: function () {
                    return this.shooter;
                }
            },
            IsHarmful: {
                get: function () {
                    return true;
                }
            },
            lightFlicker: {
                get: function () {
                    return false;
                }
            },
            lightPosition: {
                get: function () {
                    return this.getCenter();
                }
            },
            maxLightRadius: {
                get: function () {
                    return this.Ani.Alpha >= 1 ? this._maxLightRadius : 0.0;
                },
                set: function (value) {
                    this._maxLightRadius = value;
                }
            },
            touchDamage: {
                get: function () {
                    return this._touchDamage;
                },
                set: function (value) {
                    this._touchDamage = value;
                }
            }
        },
        alias: [
            "Attacker", "CirnoGame$IHarmfulEntity$Attacker",
            "IsHarmful", "CirnoGame$IHarmfulEntity$IsHarmful",
            "lightFlicker", "CirnoGame$ILightSource$lightFlicker",
            "lightPosition", "CirnoGame$ILightSource$lightPosition",
            "maxLightRadius", "CirnoGame$ILightSource$maxLightRadius",
            "touchDamage", "CirnoGame$IHarmfulEntity$touchDamage",
            "ontouchDamage", "CirnoGame$IHarmfulEntity$ontouchDamage"
        ],
        ctors: {
            init: function () {
                this.Duration = 0;
                this.spinrate = 0;
                this.Gravity = new CirnoGame.Vector2();
                this.attacksterrain = false;
                this.digpower = 0.5;
                this._maxLightRadius = 1.5;
                this._touchDamage = 1.0;
            },
            ctor: function (game, shooter, graphic) {
                if (graphic === void 0) { graphic = "Reisenbullet"; }

                this.$initialize();
                CirnoGame.Entity.ctor.call(this, game);
                this.Ani = new CirnoGame.Animation(CirnoGame.AnimationLoader._this.GetAnimation(graphic));
                this.shooter = shooter;

                //Ani.HueColor = Game.GetTeamColor(((ICombatant)shooter).Team);
                this.piercing = false;

                this.hitEntities = new (System.Collections.Generic.List$1(CirnoGame.Entity)).ctor();
            }
        },
        methods: {
            GetHitbox: function () {
                if (this.Ani != null && this.Ani.CurrentImage != null) {
                    //float s = Math.Max(Ani.CurrentImage.Width, Ani.CurrentImage.Height);
                    //float s = Ani.CurrentImage.Height;
                    var s = this.Ani.CurrentImage.height * 1.5;
                    //float s2 = s / 2f;
                    //Vector2 V = Ani.Position;
                    var so2 = s / 2;
                    //Vector2 V = getCenter() - new Vector2(so2,so2);
                    var V = CirnoGame.Vector2.Subtract$1(this.getCenter(), so2, so2);
                    return new CirnoGame.Rectangle(V.X, V.Y, s, s);
                }
                return null;
            },
            ontouchDamage: function (target) {
                if (!this.piercing) {
                    this.Alive = false;
                }

                var ok = !this.hitEntities.contains(Bridge.cast(target, CirnoGame.Entity));
                if (ok) {
                    this.hitEntities.add(Bridge.cast(target, CirnoGame.Entity));
                    return true;
                }
                return false;
            },
            Update: function () {
                CirnoGame.Entity.prototype.Update.call(this);
                if (this.spinrate !== 0) {
                    this.Ani.Rotation += this.spinrate;
                }
                if (this.Gravity.RoughLength !== 0) {
                    this.Speed = CirnoGame.Vector2.op_Addition(this.Speed, this.Gravity);
                }
                //if (!App.screenbounds.isTouching(GetHitbox()))

                //if (!Game.stageBounds.isTouching(GetHitbox()))
                if (!this.Game.stageBounds.containsPoint(this.Position)) {
                    if ((this.Ani.X > 0 === this.Hspeed > 0 || this.Ani.X < 0 === this.Hspeed < 0) || (this.Ani.Y > 0 === this.Vspeed > 0 || this.Ani.Y < 0 === this.Vspeed < 0)) {
                        this.Alive = false;
                    }
                }
                //Vector2 center = getCenter();
                var center = CirnoGame.Vector2.Add$1(this.Position, 8, 0);
                var T = null;
                if (!this.Bounces) {
                    T = this.Game.TM.CheckForTile(new CirnoGame.Vector2(center.X, this.y));
                }
                if (T != null && T.enabled && T.solid) {
                    if (this.attacksterrain) {
                        if (T.Breakable) {
                            //T.Damage(_touchDamage * digpower);
                            if (T.Damage(this.digpower)) {
                                this.PlaySound("thunk4");
                            } else {
                                this.PlaySound("thunk");
                            }
                        } else {
                            this.PlaySound("plink");
                        }
                    }
                    this.Alive = false;
                } else if (this.Bounces) {

                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.op_Addition(center, new CirnoGame.Vector2(this.Speed.X)));
                    if (T != null && T.enabled && T.solidToSpeed(this.Speed.ToCardinal())) {
                        this.Speed.X = -this.Speed.X;
                    }

                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.op_Addition(center, new CirnoGame.Vector2(0, this.Speed.Y)));
                    if (T != null && T.enabled && T.solidToSpeed(this.Speed.ToCardinal())) {
                        this.Speed.Y = -this.Speed.Y;
                    }

                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.op_Addition(center, this.Speed));
                    if (T != null && T.enabled && T.solidToSpeed(this.Speed.ToCardinal())) {
                        this.Speed.X = -this.Speed.X;
                        this.Speed.Y = -this.Speed.Y;
                    }
                }
                if (this.Duration > 0) {
                    this.Duration = (this.Duration - 1) | 0;
                    if (this.Duration <= 0) {
                        this.Duration = 1;
                        this.Ani.Alpha -= 0.2;
                        if (this.Ani.Alpha <= 0) {
                            this.Alive = false;
                        }
                    }
                }
            }
        }
    });

    Bridge.define("CirnoGame.RandomAI", {
        inherits: [CirnoGame.EntityBehavior],
        fields: {
            CE: null
        },
        ctors: {
            ctor: function (entity) {
                this.$initialize();
                CirnoGame.EntityBehavior.ctor.call(this, entity);
                this.CE = entity;
                this.FramesPerTick = 15;
            }
        },
        methods: {
            Update: function () {
                CirnoGame.EntityBehavior.prototype.Update.call(this);
                if (Math.random() < 0.1) {
                    var Controller = this.CE.Controller;
                    Controller[System.Array.index(0, Controller)] = false;
                    Controller[System.Array.index(1, Controller)] = false;
                    Controller[System.Array.index(2, Controller)] = false;
                    Controller[System.Array.index(3, Controller)] = false;

                    if (Math.random() < 0.5) {
                        Controller[System.Array.index(0, Controller)] = Math.random() < 0.5;
                        Controller[System.Array.index(1, Controller)] = !Controller[System.Array.index(0, Controller)];
                    }

                    if (Math.random() < 0.5) {
                        Controller[System.Array.index(2, Controller)] = Math.random() < 0.5;
                        Controller[System.Array.index(3, Controller)] = !Controller[System.Array.index(2, Controller)];
                    }
                }
            }
        }
    });

    Bridge.define("CirnoGame.RoomOpeningLever", {
        inherits: [CirnoGame.Entity],
        statics: {
            fields: {
                TEST: null
            },
            methods: {
                FindAndPlaceOnWall: function (game, P, Target) {
                    var T = game.TM.CheckForTile(P);
                    if (T != null) {
                        var X = T.column;
                        var Y = T.row;

                        var XD = Math.random() < 0.5 ? -1 : 1;
                        while (true) {
                            X = (X + XD) | 0;
                            var T2 = game.TM.GetTile(X, Y);
                            if (T2 != null) {
                                if (T2.enabled && T2.solid) {
                                    var T3 = game.TM.GetTile(((X - XD) | 0), ((Y + 1) | 0));
                                    if (!(T3 != null && T3.enabled && T3.solid)) {
                                        var ret = new CirnoGame.RoomOpeningLever(game, new CirnoGame.Point(X, Y), Target, XD === 1);
                                        return ret.Alive ? ret : null;
                                    } else {
                                        return null;
                                    }
                                }
                            } else {
                                return null;
                            }
                        }
                    }
                    return null;
                }
            }
        },
        fields: {
            Room: null,
            Block: null
        },
        props: {
            Activated: false
        },
        ctors: {
            ctor: function (game, Tile, Target, flipped) {
                if (flipped === void 0) { flipped = false; }

                this.$initialize();
                CirnoGame.Entity.ctor.call(this, game);
                this.Ani = new CirnoGame.Animation(CirnoGame.AnimationLoader._this.GetAnimation("images/misc/lever"));
                this.Ani.ImageSpeed = 0;
                this.Block = Tile;
                var T = game.TM.GetTile(Tile.X, Tile.Y);
                CirnoGame.RoomOpeningLever.TEST = this;
                if (T != null && T.solid) {
                    if (Target != null) {
                        this.Room = Target;
                    }
                    T.Breakable = false;
                    T.CanSlope = false;
                    var R = T.GetHitbox();
                    if (flipped) {
                        this.Ani.Position.X = R.left - 16;
                        this.Ani.Flipped = true;
                    } else {
                        this.Ani.Position.X = R.right;
                    }
                    this.Ani.Position.Y = R.top;
                } else {
                    this.Alive = false;
                }
            }
        },
        methods: {
            Update: function () {
                CirnoGame.Entity.prototype.Update.call(this);
                var T = this.Game.TM.GetTile(this.Block.X, this.Block.X);
                if (T != null && T.enabled && T.solid) {
                    T.Breakable = false;
                    T.CanSlope = false;
                } else {
                    this.Alive = false;
                    if (this.Room != null) {
                        this.Room.ClearRoom();
                        this.Room.GeneratePlatforms();
                        this.Room.ApplyBreakable(); //attempt to remove seams
                        this.Room.ForceRedraw();
                    }
                    //Helper.Log("Removing broken lever...");
                }
                var P = this.Game.player;
                if (!this.Activated && P.Position.EstimatedDistance(this.Position) < 16 && P.Controller[System.Array.index(2, P.Controller)]) {
                    this.Activate();
                }
            },
            Activate: function () {
                if (!this.Activated) {
                    this.Activated = true;
                    this.PlaySound("open2"); //sounds better than the electronic switch.
                    this.Ani.CurrentFrame = 1;
                    this.Ani.SetImage();
                    this.Ani.Update();
                    this.Room.UnleashSecret();
                }
            }
        }
    });

    Bridge.define("CirnoGame.TextSprite", {
        inherits: [CirnoGame.Sprite],
        fields: {
            _Text: null,
            textInvallidated: false,
            imageInvallidated: false,
            TextImage: null,
            TextGraphic: null,
            _TextColor: null,
            _FontWeight: null,
            _FontFamily: null,
            _FontSize: 0,
            _shadowBlur: 0,
            _shadowOffset: null,
            _shadowColor: null
        },
        props: {
            Text: {
                get: function () {
                    return this._Text;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._Text, value)) {
                        this._Text = value;
                        /* RedrawBaseTextImage();
                        RenderTextImage();*/
                        this.textInvallidated = true;
                        //imageInvallidated = true;
                    }
                }
            },
            TextColor: {
                get: function () {
                    return this._TextColor;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._TextColor, value)) {
                        this._TextColor = value;
                        //RenderTextImage();
                        this.textInvallidated = true;

                        //imageInvallidated = true;
                    }
                }
            },
            FontWeight: {
                get: function () {
                    return this._FontWeight;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._FontWeight, value)) {
                        this._FontWeight = value;
                        this.UpdateFont();
                    }
                }
            },
            FontFamily: {
                get: function () {
                    return this._FontFamily;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._FontFamily, value)) {
                        this._FontFamily = value;
                        this.UpdateFont();
                    }
                }
            },
            FontSize: {
                get: function () {
                    return this._FontSize;
                },
                set: function (value) {
                    if (this._FontSize !== value) {
                        this._FontSize = value;
                        this.UpdateFont();
                    }
                }
            },
            ShadowBlur: {
                get: function () {
                    return this._shadowBlur;
                },
                set: function (value) {
                    if (this._shadowBlur !== value) {
                        this._shadowBlur = value;
                        this.imageInvallidated = true;
                    }
                }
            },
            ShadowOffset: {
                get: function () {
                    return this._shadowOffset.Clone();
                },
                set: function (value) {
                    if (CirnoGame.Vector2.op_Inequality(this._shadowOffset, value) && value.X !== this._shadowOffset.X && value.Y !== this._shadowOffset.Y) {
                        this._shadowOffset = value.Clone();
                        this.imageInvallidated = true;
                    }
                }
            },
            ShadowColor: {
                get: function () {
                    return this._shadowColor;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._shadowColor, value)) {
                        this._shadowColor = value;
                        this.imageInvallidated = true;
                    }
                }
            }
        },
        ctors: {
            init: function () {
                this._FontWeight = "normal";
                this._FontFamily = "sans-serif";
                this._FontSize = 10;
                this._shadowBlur = 0.0;
                this._shadowOffset = new CirnoGame.Vector2();
                this._shadowColor = "#000000";
            },
            ctor: function () {
                this.$initialize();
                CirnoGame.Sprite.ctor.call(this);
                this.TextImage = document.createElement("canvas");
                this.TextGraphic = this.TextImage.getContext("2d");
                this.TextGraphic.imageSmoothingEnabled = false;
                //TextGraphic.Font.
                this.TextImage.style.imageRendering = "pixelated";
                this.TextGraphic.fillStyle = "#FFFFFF";
            }
        },
        methods: {
            UpdateFont: function () {
                this.TextGraphic.font = System.String.concat(this._FontWeight, " ", this._FontSize, "px ", this._FontFamily);
                this.textInvallidated = true;
                this.imageInvallidated = true;
                this.TextGraphic.fillStyle = this._TextColor;
            },
            RedrawBaseTextImage: function () {
                this.UpdateFont();
                var lines = System.String.split(this._Text, [10].map(function(i) {{ return String.fromCharCode(i); }}));
                var H = this.FontSize * 1.0;


                var W = 0;
                var i = 0;
                while (i < lines.length) {
                    var TM = this.TextGraphic.measureText(lines[System.Array.index(i, lines)]);
                    W = Math.max(W, Bridge.Int.clip32(Math.ceil(TM.width)));
                    i = (i + 1) | 0;
                }
                //TextImage.Height = (int)(H * (lines.Length+0.5f));
                this.TextImage.height = Bridge.Int.clip32(H * (lines.length + 0.25));
                this.TextImage.width = W;
                this.UpdateFont();

                var Y = 0;
                i = 0;
                while (i < lines.length) {
                    this.TextGraphic.fillText(lines[System.Array.index(i, lines)], 0, this.FontSize + Y);
                    Y += H;
                    i = (i + 1) | 0;
                }

                this.textInvallidated = false;
                this.imageInvallidated = true;
            },
            RenderTextImage: function () {

                if (this._shadowBlur <= 0) {
                    this.spriteBuffer.width = this.TextImage.width;
                    this.spriteBuffer.height = this.TextImage.height;
                } else {
                    var S = Bridge.Int.clip32(Math.ceil(this._shadowBlur + this._shadowBlur));
                    this.spriteBuffer.width = (this.TextImage.width + S) | 0;
                    this.spriteBuffer.height = (this.TextImage.height + S) | 0;
                }
                this.spriteGraphics.shadowBlur = 0;

                this.spriteGraphics.globalCompositeOperation = "source-over";
                /* spriteGraphics.FillStyle = _TextColor;
                spriteGraphics.FillRect(0, 0, spriteBuffer.Width, spriteBuffer.Height);
                Script.Write("this.spriteGraphics.globalCompositeOperation = 'destination-in'");*/
                if (this._shadowBlur <= 0) {
                    this.spriteGraphics.drawImage(this.TextImage, 0.0, 0.0);
                } else {
                    this.spriteGraphics.drawImage(this.TextImage, this._shadowBlur, this._shadowBlur);
                }

                if (this._shadowBlur > 0) {
                    this.spriteGraphics.shadowBlur = this._shadowBlur;
                    this.spriteGraphics.shadowColor = this._shadowColor;
                    this.spriteGraphics.shadowOffsetX = this._shadowOffset.X;
                    this.spriteGraphics.shadowOffsetY = this._shadowOffset.Y;
                    this.spriteGraphics.drawImage(this.spriteBuffer, 0.0, 0.0);
                }



                this.imageInvallidated = false;
            },
            ForceUpdate: function () {
                if (this.textInvallidated) {
                    this.RedrawBaseTextImage();
                }
                if (this.imageInvallidated) {
                    this.RenderTextImage();
                }
            },
            Draw: function (g) {
                this.ForceUpdate();
                CirnoGame.Sprite.prototype.Draw.call(this, g);
            }
        }
    });

    Bridge.define("CirnoGame.Tile", {
        inherits: [CirnoGame.Entity],
        fields: {
            tile: 0
        },
        ctors: {
            ctor: function (game, tile) {
                this.$initialize();
                CirnoGame.Entity.ctor.call(this, game);
                this.tile = tile;
                this.Ani = new CirnoGame.Animation(CirnoGame.AnimationLoader.Get("images/land/brick"));
                this.Ani.CurrentFrame = tile;
                this.Ani.ImageSpeed = 0;
            }
        },
        methods: {
            Draw: function (g) {
                /* if (tile>=0 && tile < ani.images.Count)
                {
                   ani.currentFrame = tile;
                }*/
                CirnoGame.Entity.prototype.Draw.call(this, g);
            }
        }
    });

    Bridge.define("CirnoGame.TitleScreen", {
        inherits: [CirnoGame.Sprite],
        fields: {
            Title: null,
            Version: null,
            Desc: null,
            Controls: null,
            Credits: null,
            menu: null,
            Controller: null,
            game: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                CirnoGame.Sprite.ctor.call(this);
                this.spriteBuffer.width = CirnoGame.App.Canvas.width;
                this.spriteBuffer.height = Bridge.Int.clip32(this.spriteBuffer.width * CirnoGame.App.TargetAspect);
                this.Title = new CirnoGame.TextSprite();
                this.Title.FontSize = Bridge.Int.clip32(this.spriteBuffer.width * 0.06);
                //Title.Text = "Cirno and the mysterious tower";
                this.Title.Text = CirnoGame.App.GameName;
                this.Title.TextColor = "#77FFFF";
                this.Title.ShadowColor = "#000000";
                this.Title.ShadowOffset = new CirnoGame.Vector2(2, 2);
                this.Title.ShadowBlur = 2;

                this.CenterTextWithFloats(this.Title, 0.5, 0.06);

                this.Version = new CirnoGame.TextSprite();
                this.Version.FontSize = Bridge.Int.clip32(this.spriteBuffer.width * 0.016);
                this.Version.Text = System.String.concat("Version:", CirnoGame.App.GameVersion);
                this.Version.TextColor = "#FFFFFF";
                this.Version.ShadowColor = "#000000";
                this.Version.ShadowOffset = new CirnoGame.Vector2(2, 2);
                this.Version.ShadowBlur = 2;

                this.CenterTextWithFloats(this.Version, 0.75, 0.11);

                /* Title.ForceUpdate();
                Title.Position.Y = spriteBuffer.Height * 0.01f;
                Title.Position.X = (spriteBuffer.Width / 2) - (Title.spriteBuffer.Width / 2);*/



                this.Desc = new CirnoGame.TextSprite();
                this.Desc.FontSize = Bridge.Int.clip32(this.spriteBuffer.width * 0.03);
                this.Desc.TextColor = "#FFFFFF";
                //Desc.Text = "Cirno has found herself in a strange dungeon filled with ghosts!\nHer energy has been stolen, reclaim the energy orbs to extend your time.\nFind the big key to unlock the door.";
                //Desc.Text = "Cirno has found herself in a strange dungeon filled with ghosts!\nReclaim your stolen energy sealed inside the orbs to extend your time.\nFind the gold key to unlock the door.";
                this.Desc.Text = "Cirno has found herself in a strange tower filled with ghosts!\nReclaim your stolen energy sealed inside the orbs to extend your time.\nRemember the door's location and search for the gold key.";
                this.Desc.ShadowColor = "#000000";
                this.Desc.ShadowOffset = new CirnoGame.Vector2(2, 2);
                this.Desc.ShadowBlur = 2;
                this.CenterTextWithFloats(this.Desc, 0.5, 0.2);

                this.Controls = new CirnoGame.TextSprite();
                this.Controls.FontSize = Bridge.Int.clip32(this.spriteBuffer.width * 0.025);
                this.Controls.TextColor = "#FFFFFF";
                this.Controls.Text = "Keyboard Controls:\nLeft/Right=Move\nUp/Down=Aim(Up activates chests/doors)\nZ=Shoot\nX=Jump/Mid-air jump\nA=Place block below you(costs time)\nEnter=Pause\nM=Toggle mute";
                this.Controls.ShadowColor = "#000000";
                this.Controls.ShadowOffset = new CirnoGame.Vector2(2, 2);
                this.Controls.ShadowBlur = 2;
                this.CenterTextWithFloats(this.Controls, 0.5, 0.4);
                this.Controls.Position.X = this.Desc.Position.X;

                this.menu = new CirnoGame.ButtonMenu(this.spriteBuffer.width * 0.8, this.spriteBuffer.height * 0.5, Bridge.Int.clip32(this.spriteBuffer.width * 0.05));
                var B = this.menu.AddButton("Start Game");
                B.OnClick = Bridge.fn.bind(this, function () {
                    this.game.Start();
                });
                //menu.Finish();
                B.Position.X += this.spriteBuffer.width * 0.38;
                B.Position.Y = this.spriteBuffer.height * 0.7;

                //var CB = menu.AddButton("Controller:"+InputControllerManager._this.Controllers[0].id);
                var CB = this.menu.AddButton(System.String.concat("Controller:", CirnoGame.App.IC.id));
                this.Controller = CB;
                CB.OnClick = function () {
                    var ind = CirnoGame.InputControllerManager._this.Controllers.indexOf(CirnoGame.App.IC);
                    ind = (ind + 1) | 0;
                    if (ind >= CirnoGame.InputControllerManager._this.Controllers.Count) {
                        ind = (ind - CirnoGame.InputControllerManager._this.Controllers.Count) | 0;
                    }
                    CirnoGame.App.IC = CirnoGame.InputControllerManager._this.Controllers.getItem(ind);
                    var TS = CB.Contents;
                    var W = TS.spriteBuffer.width;
                    TS.Text = System.String.concat("Controller:", CirnoGame.App.IC.id);
                    TS.ForceUpdate();
                    CB.Position.X -= ((((Bridge.Int.div((((TS.spriteBuffer.width - W) | 0)), 2)) | 0))) | 0;
                };
                CB.Position.X += this.spriteBuffer.width * 0.38;
                ;
                CB.Position.Y = B.Position.Y + (this.spriteBuffer.height * 0.15);
                //CB.Visible = false;
                CB.Lock();

                this.Credits = new CirnoGame.TextSprite();
                this.Credits.FontSize = Bridge.Int.clip32(this.spriteBuffer.width * 0.015);
                this.Credits.TextColor = "#77FFFF";
                //Credits.Text = "Made by:RSGmaker                                                                                                                     Touhou Project and it's characters are owned by ZUN";
                this.Credits.Text = "Made by:RSGmaker                                                                                                           Touhou Project and it's characters are owned by ZUN";
                this.Credits.ShadowColor = "#000000";
                this.Credits.ShadowOffset = new CirnoGame.Vector2(2, 2);
                this.Credits.ShadowBlur = 2;
                this.CenterTextWithFloats(this.Credits, 0.5, 0.98);
            }
        },
        methods: {
            CenterTextWithFloats: function (T, X, Y) {
                this.CenterText(T, new CirnoGame.Vector2(this.spriteBuffer.width * X, this.spriteBuffer.height * Y));
            },
            CenterText: function (T, Location) {
                T.ForceUpdate();
                T.Position.X = Location.X - (((Bridge.Int.div(T.spriteBuffer.width, 2)) | 0));
                T.Position.Y = Location.Y - (((Bridge.Int.div(T.spriteBuffer.height, 2)) | 0));
            },
            Draw: function (g) {
                CirnoGame.Sprite.prototype.Draw.call(this, g);
                if (this.Controller.locked && CirnoGame.InputControllerManager._this.Controllers.Count > 1) {
                    this.Controller.Unlock();
                }

                this.Title.Draw(g);
                this.Version.Draw(g);
                this.Desc.Draw(g);
                this.Controls.Draw(g);
                this.menu.Draw(g);
                this.menu.Update();
                this.Credits.Draw(g);

                //var M = KeyboardManager._this.MousePosition.Clone();
                var M = CirnoGame.KeyboardManager._this.CMouse.Clone();
                if (!System.String.contains(CirnoGame.App.Div.style.left,"px")) {
                    return;
                }
                /* M.X -= float.Parse(App.Div.Style.Left.Replace("px", ""));*/
                //Credits.Text = "X:" + M.X+"/"+(spriteBuffer.Width * 0.1) +" Y:"+M.Y+"/"+(spriteBuffer.Height * 0.96);
                if (M.X < this.spriteBuffer.width * 0.17 && M.Y >= this.spriteBuffer.height * 0.96) {
                    CirnoGame.App.Div.style.cursor = "pointer";
                    if (CirnoGame.KeyboardManager._this.TappedMouseButtons.contains(0)) {
                        Bridge.global.location.href = "https://rsgmaker.deviantart.com";
                    }
                } else {
                    CirnoGame.App.Div.style.cursor = null;
                }
            }
        }
    });

    Bridge.define("CirnoGame.DoorKey", {
        inherits: [CirnoGame.CollectableItem],
        ctors: {
            ctor: function (game) {
                this.$initialize();
                CirnoGame.CollectableItem.ctor.call(this, game, "bigkey");
                this.floats = false;
                this.magnetDistance = 20;
                this.sound = "key";
            }
        },
        methods: {
            onCollected: function (player) {
                //throw new NotImplementedException();
                this.Game.Door.Opened = true;

                var FM = new CirnoGame.FloatingMessage(this.Game, "Door Unlocked!");
                FM.Text.TextColor = "#77FFFF";
                FM.Position = new CirnoGame.Vector2(this.x + 8, this.y - 20);
                this.Game.AddEntity(FM);
            },
            Update: function () {
                CirnoGame.CollectableItem.prototype.Update.call(this);
                if (this.y <= 0) {
                    this.Game.LevelRestart();
                }
            }
        }
    });

    Bridge.define("CirnoGame.Game", {
        inherits: [CirnoGame.GameSprite],
        statics: {
            methods: {
                GetTeamColor: function (team) {
                    if (team === 1) {
                        return "#FF0000";
                    } else if (team === 2 || team === 0) {
                        return "#0000FF";
                    } else if (team === 3) {
                        return "#FFFF00";
                    }
                    return "#000000";
                }
            }
        },
        fields: {
            player: null,
            entities: null,
            harmful: null,
            combatants: null,
            camera: null,
            stageBounds: null,
            TM: null,
            GamePlaySettings: null,
            TimerSprite: null,
            defaultTimeRemaining: 0,
            maxTimeRemaining: 0,
            timeRemaining: 0,
            totalTime: 0,
            level: 0,
            playing: false,
            paused: false,
            cameraWanderPoint: null,
            TS: null,
            Teams: false,
            skiprender: false,
            ScoreSprite: null,
            EG: null,
            Door: null,
            Key: null,
            BigKey: null,
            muted: false,
            lastPauseButtonState: false,
            ShowHitbox: false,
            freecam: false
        },
        props: {
            running: {
                get: function () {
                    return this.playing && !this.paused;
                }
            }
        },
        ctors: {
            init: function () {
                this.defaultTimeRemaining = 180000;
                this.maxTimeRemaining = 300000;
                this.totalTime = 0;
                this.level = 0;
                this.playing = false;
                this.paused = false;
                this.Teams = true;
                this.skiprender = true;
                this.muted = false;
                this.lastPauseButtonState = false;
                this.ShowHitbox = false;
                this.freecam = false;
            },
            ctor: function () {
                this.$initialize();
                CirnoGame.GameSprite.ctor.call(this);
                this.GamePlaySettings = new CirnoGame.GamePlaySettings();
                this.Door = new CirnoGame.ExitDoor(this);
                this.entities = new (System.Collections.Generic.List$1(CirnoGame.Entity)).ctor();
                this.combatants = new (System.Collections.Generic.List$1(CirnoGame.Entity)).ctor();
                this.harmful = new (System.Collections.Generic.List$1(CirnoGame.Entity)).ctor();

                this.player = new CirnoGame.PlayerCharacter(this);
                this.player.HP = 0;
                this.timeRemaining = this.defaultTimeRemaining;
                //timeRemaining *= 0.3334f * 0.25f;

                /* test.Ani = new Animation(AnimationLoader._this.Get("images/cirno/walk"));
                test.Ani.ImageSpeed = 0.1f;*/

                //stageBounds = new Rectangle(0, 0, 8000, 3000);
                //stageBounds = new Rectangle(0, 0, 6000, 4000);
                //stageBounds = new Rectangle(0, 0, 2000, 1500);
                //stageBounds = new Rectangle(0, 0, 1000, 750);
                //stageBounds = new Rectangle(0, 0, 2000, 1000);
                this.stageBounds = new CirnoGame.Rectangle(0, 0, 4000, 2000);
                this.TM = new CirnoGame.TileMap(this);
                this.TM.Seed = Bridge.Int.clip32(Math.random() * System.Int64([1410065407,2]));
                this.TM.position.Y = 0;
                var R = CirnoGame.Rectangle.op_Subtraction(this.stageBounds, this.TM.position);
                R.width -= this.TM.tilesize;
                R.height -= this.TM.tilesize;
                //TM.DrawRect(R);



                this.player.Position.Y = this.stageBounds.height / 3;
                this.player.Position.X = this.stageBounds.width / 2;

                this.EG = CirnoGame.Helper.GetContext(document.createElement("canvas"));
                //MapGenerator.Generate(this);
                /* MapGenerator.BoxyGenerate(this);            
                TM.DrawRect(R);
                //TM.testTexture();
                TM.ApplyBreakable();*/
                /* var E = new Entity(this);
                E.Ani = new Animation(AnimationLoader.Get("Images/land/brick"));
                E.y += 24;
                entities.Add(E);
                var ln = 10;
                var i = 0;
                while (i < ln)
                {
                   E = new Entity(this);
                   E.Ani = new Animation(AnimationLoader.Get("Images/land/brick"));
                   E.y += 24;
                   E.x += 16 * (i+1);
                   entities.Add(E);
                   i++;
                }
                i = 0;
                while (i < ln)
                {
                   E = new Entity(this);
                   E.Ani = new Animation(AnimationLoader.Get("Images/land/brick"));
                   E.y += 24;
                   E.x += 16 * -(i + 1);
                   entities.Add(E);
                   i++;
                }*/


                //entities.Add(test);
                this.AddEntity(this.Door);


                //spriteBuffer.Width = 200;
                this.spriteBuffer.width = CirnoGame.App.Canvas.width;
                this.spriteBuffer.height = Bridge.Int.clip32(this.spriteBuffer.width * CirnoGame.App.TargetAspect);
                /* camera.viewport_width = spriteBuffer.Width;
                camera.viewport_height = spriteBuffer.Height;*/
                this.camera = new CirnoGame.Camera(this.spriteBuffer.width, this.spriteBuffer.height);
                //camera.Scale = 6;
                //camera.Scale = 4;
                //camera.Scale = 3.5f;
                this.camera.Scale = 3.75;

                //camera.Scale = 1f;
                this.camera.StageBounds = this.stageBounds;
                this.camera.Update();
                this.camera.instawarp = true;
                /* spriteBuffer.Width = App.Canvas.Width;
                spriteBuffer.Height = App.Canvas.Height;*/
                this.spriteGraphics.imageSmoothingEnabled = false;

                /* PlaceAndAddEntity(new DoorKey(this));

                var i = 0;
                //while (i < 110)
                while (i < 24)
                {
                   PlaceAndAddEntity(new MRGhosty(this));
                   i++;
                }
                i = 0;
                while (i++ <= 6)
                   PlaceAndAddEntity(new Orb(this));
                i = 0;
                while (i++ <= 3)
                {
                   PlaceAndAddEntity(new Chest(this));
                   PlaceAndAddEntity(new KeyItem(this));
                }
                i = 0;
                while (i++ <= 2)
                {
                   PlaceAndAddEntity(new HealingItem(this));
                }*/
                this.StartNextLevel();


                this.TimerSprite = new CirnoGame.TextSprite();
                this.TimerSprite.FontSize = (Bridge.Int.div(this.spriteBuffer.height, 24)) | 0;
                this.TimerSprite.Text = "3:00";
                this.TimerSprite.TextColor = "#FFFFFF";
                this.TimerSprite.ShadowColor = "#000000";
                this.TimerSprite.ShadowOffset = new CirnoGame.Vector2(3, 3);
                this.TimerSprite.ShadowBlur = 1;

                this.TimerSprite.Position.X = this.spriteBuffer.width * 0.47;
                this.TimerSprite.Position.Y = (Bridge.Int.div(((-this.TimerSprite.FontSize) | 0), 8)) | 0;

                this.ScoreSprite = new CirnoGame.TextSprite();
                //ScoreSprite.FontSize = spriteBuffer.Height / 24;
                this.ScoreSprite.FontSize = (Bridge.Int.div(this.spriteBuffer.height, 28)) | 0;
                this.ScoreSprite.Text = "Level:1 Score:0";
                this.ScoreSprite.TextColor = "#FFFFFF";
                this.ScoreSprite.ShadowColor = "#000000";
                this.ScoreSprite.ShadowOffset = new CirnoGame.Vector2(3, 3);
                this.ScoreSprite.ShadowBlur = 1;

                //ScoreSprite.Position.X = spriteBuffer.Width * 0.7f;
                this.ScoreSprite.ForceUpdate();
                this.ScoreSprite.Position.X = (this.spriteBuffer.width * 0.98) - this.ScoreSprite.spriteBuffer.width;
                this.ScoreSprite.Position.Y = (Bridge.Int.div(((-this.ScoreSprite.FontSize) | 0), 8)) | 0;

                this.Key = CirnoGame.AnimationLoader.Get("images/items/key").getItem(0);
                this.BigKey = CirnoGame.AnimationLoader.Get("images/items/bigkey").getItem(0);

                this.TS = new CirnoGame.TitleScreen();
                this.TS.game = this;

                //PlayMusic("theme2");
                this.SetMusic();
            }
        },
        methods: {
            ClearEntities: function () {
                var L = this.entities.toArray();
                var i = 0;
                while (i < L.length) {
                    var E = L[System.Array.index(i, L)];
                    //if (!(E == player || E is ExitDoor))
                    if (E.RemovedOnLevelEnd) {
                        E.Alive = false;
                        this.RemoveEntity(E);
                    }
                    i = (i + 1) | 0;
                }
            },
            StartNextLevel: function () {
                this.ClearEntities();
                CirnoGame.RoomOpeningLever.TEST = null;
                this.level = (this.level + 1) | 0;
                var R = CirnoGame.Rectangle.op_Subtraction(this.stageBounds, this.TM.position);
                R.width -= this.TM.tilesize;
                R.height -= this.TM.tilesize;
                this.TM.Generate();
                CirnoGame.MapGenerator.BoxyGenerate(this);
                //TM.DrawRect(R);
                //TM.ApplyBreakable();


                var ghosts = Math.min(((18 + Bridge.Int.mul(this.level, 2)) | 0), 28);
                var i = 0;
                //while (i < 110)
                while (i < ghosts) {
                    this.PlaceAndAddEnemy(new CirnoGame.MRGhosty(this));
                    i = (i + 1) | 0;
                }
                i = 0;
                //while (i++ <= 6)
                while (Bridge.identity(i, (i = (i + 1) | 0)) <= 4) {
                    this.PlaceAndAddEntity(new CirnoGame.Orb(this));
                }
                i = 0;
                while (Bridge.identity(i, (i = (i + 1) | 0)) <= 3) {
                    this.PlaceAndAddEntity(new CirnoGame.Chest(this));
                    this.PlaceAndAddEntity(new CirnoGame.KeyItem(this));
                }
                i = 0;
                while (Bridge.identity(i, (i = (i + 1) | 0)) <= 1) {
                    this.PlaceAndAddEntity(new CirnoGame.HealingItem(this));
                }

                var key = new CirnoGame.DoorKey(this);
                var attempts = 0;

                this.PlaceAndAddEntity(key);
                while (Math.abs(key.x - this.player.x) < 70 && attempts < 5) { //attempt to prevent key from spawning too close
                    console.log("Door key is too close, repositioning key...");

                    key.Position.CopyFrom(CirnoGame.MapRoom.FindAnyEmptySpot());
                    attempts = (attempts + 1) | 0;
                }

                /* PlaceAndAddEntity(new DoorKey(this));
                PlaceAndAddEntity(new DoorKey(this));
                PlaceAndAddEntity(new DoorKey(this));
                PlaceAndAddEntity(new DoorKey(this));*/

                this.player.invincibilitytime = 180;
                this.camera.instawarp = true;
                this.skiprender = true;
                if (this.playing) {
                    this.SetMusic();
                }
            },
            SetMusic: function () {
                if (!this.playing) {
                    this.PlayMusic("theme2");
                    return;
                }
                var songs = 2;
                var levelspersong = 5;
                var S = ((Bridge.Int.div(this.level, levelspersong)) | 0);
                S = S % songs;
                this.PlayMusic("theme" + (((S + 1) | 0)));
            },
            PlaceAndAddEntity: function (E) {
                E.Position.CopyFrom(CirnoGame.MapRoom.FindAnyEmptySpot());
                this.AddEntity(E);
            },
            PlaceAndAddEnemy: function (E) {
                E.Position.CopyFrom(CirnoGame.MapRoom.FindAnyEmptySpot());
                var attempts = 1;
                while (E.Position.EstimatedDistance(this.player.Position) < 128 && attempts < 5) {
                    console.log("Enemy spawned too close, repositioning enemy...");

                    E.Position.CopyFrom(CirnoGame.MapRoom.FindAnyEmptySpot());
                    attempts = (attempts + 1) | 0;
                }
                this.AddEntity(E);
                this.AddEntity(E);
            },
            Update: function () {
                CirnoGame.GameSprite.prototype.Update.call(this);
                this.Teams = this.GamePlaySettings.GameMode.Teams;
                //if (playing && KeyboardManager._this.TappedButtons.Contains(13))
                if (this.playing && CirnoGame.App.IC.getPressed(5) && !this.lastPauseButtonState) {
                    this.paused = !this.paused;
                }
                this.lastPauseButtonState = CirnoGame.App.IC.getPressed(5);
                if (this.playing && CirnoGame.KeyboardManager._this.TappedButtons.contains(77)) {
                    CirnoGame.AudioManager._this.StopAll();
                    this.muted = !this.muted;
                    if (!this.muted) {
                        this.SetMusic();
                    }
                    CirnoGame.KeyboardManager._this.TappedButtons.remove(77);
                }
                if (!this.paused) {
                    this.UpdateControls();

                    var i = 0;
                    while (i < this.entities.Count) {
                        var E = this.entities.getItem(i);
                        if (E.Alive) {
                            E.Update();
                        }
                        if (!E.Alive) {
                            this.RemoveEntity(E);
                            i = (i - 1) | 0;
                        }
                        i = (i + 1) | 0;
                    }
                    this.UpdateCollisions();
                    this.UpdateTime();
                    if (this.playing && this.player.y < 0) {
                        //player glitched out somehow make a new level.
                        this.LevelRestart();
                    }
                } else {
                    this.TimerSprite.Text = "Paused";
                }
            },
            LevelRestart: function () {
                this.level = (this.level - 1) | 0;
                this.StartNextLevel();
            },
            DoGameOver: function () {
                if (!this.playing) {
                    return;
                }
                if (this.entities.contains(this.player)) {
                    this.RemoveEntity(this.player);
                    //DoGameOver();
                }
                this.playing = false;
                this.StartNextLevel();

            },
            UpdateTime: function () {
                var $t;
                //timeRemaining -= 16.66667f;
                if (this.paused) {
                    this.TimerSprite.Text = "Paused";
                    return;
                }
                if (this.timeRemaining <= 0) {
                    this.timeRemaining = 0;
                    this.TimerSprite.Text = "0";
                    if (this.player.HP > 0) {
                        this.player.HP -= 0.004;
                    } else {
                        this.DoGameOver();
                    }
                    return;
                }
                var totalseconds = this.timeRemaining / 1000.0;
                var totalminutes = totalseconds / 60;

                var minutes = Bridge.Int.clip32(Math.floor(totalminutes));
                var seconds = (totalseconds - (Bridge.Int.mul(minutes, 60)));

                var S = "";
                if (minutes > 0) {
                    S = "" + minutes + ":";
                }
                var prefix = "";
                if (seconds < 10) {
                    prefix = "0";
                    if (totalseconds < 10) {
                        prefix = " ";
                    }
                }
                S = System.String.concat(S, this.RestrictLength(System.String.concat(prefix, System.Single.format(Math.max(0, seconds))), 4));
                if (totalseconds >= 60) {
                    if (System.String.indexOf(S, ".") >= 0) {
                        S = ($t = S.split("."))[System.Array.index(0, $t)];
                    }
                }
                this.TimerSprite.Text = S;
            },
            RestrictLength: function (s, length) {
                if (s.length > length) {
                    return s.substr(0, length);
                }
                return s;
            },
            UpdateCollisions: function () {
                //List<Entity> combatants = new List<Entity>(System.Linq.Enumerable.Where<global::CirnoGame.Entity>(entities, (global::System.Func<global::CirnoGame.Entity, bool>)(entity => entity is ICombatant && entity.Ani.CurrentImage != null && ((ICombatant)entity).HP > 0)));
                //List<Entity> harmfulEntity = new List<Entity>(System.Linq.Enumerable.Where<global::CirnoGame.Entity>(entities, (global::System.Func<global::CirnoGame.Entity, bool>)(entity => entity is IHarmfulEntity && entity.Ani.CurrentImage != null)));
                var combatants = new (System.Collections.Generic.List$1(CirnoGame.Entity)).$ctor1(System.Linq.Enumerable.from(this.combatants).where(function (entity) {
                        return entity.Ani.CurrentImage != null && (entity).CirnoGame$ICombatant$HP > 0;
                    }));
                var harmfulEntity = new (System.Collections.Generic.List$1(CirnoGame.Entity)).$ctor1(System.Linq.Enumerable.from(this.harmful).where(function (entity) {
                        return entity.Ani.CurrentImage != null;
                    }));
                var R2 = new CirnoGame.Rectangle();
                var OR2 = new CirnoGame.Rectangle();
                var i = 0;
                var count = combatants.Count;
                while (i < count) {
                    var E = { v : combatants.getItem(i) };
                    //if (E is ICombatant)
                    {
                        var EI = { v : E.v };
                        var R = E.v.GetHitbox();
                        var spd = CirnoGame.Vector2.op_Multiply(E.v.Speed, 0.5);
                        //Rectangle R2 = new Rectangle(R.x - (spd.X), R.y - (spd.Y), R.width, R.height);
                        R2.Set(R.x - (spd.X), R.y - (spd.Y), R.width, R.height);
                        //List<Entity> L = new List<Entity>(harmfulEntity.Where(entity => entity != E && entity.GetHitbox().isTouching(R)));
                        //List<Entity> L = new List<Entity>(harmfulEntity.Where(entity => entity != E && ((ICombatant)((IHarmfulEntity)entity).Attacker).Team != EI.Team));
                        //List<Entity> L = new List<Entity>(System.Linq.Enumerable.Where<global::CirnoGame.Entity>(harmfulEntity, (global::System.Func<global::CirnoGame.Entity, bool>)(entity => entity != E && !((IHarmfulEntity)entity).Attacker.SameTeam((Entity)EI))));
                        var L = new (System.Collections.Generic.List$1(CirnoGame.Entity)).$ctor1(System.Linq.Enumerable.from(harmfulEntity).where((function ($me, E, EI) {
                                return function (entity) {
                                    return !Bridge.referenceEquals(entity, E.v) && !(entity).CirnoGame$IHarmfulEntity$Attacker.SameTeam(EI.v);
                                };
                            })(this, E, EI)));
                        var j = 0;
                        var ln = L.Count;
                        while (j < ln) {
                            var tmp = L.getItem(j);
                            var HE = tmp;
                            var OR = tmp.GetHitbox();
                            var spd2 = CirnoGame.Vector2.op_Multiply(tmp.Speed, 0.5);
                            //Rectangle OR2 = new Rectangle(OR.x - (spd2.X), OR.y - (spd2.Y), OR.width, OR.height);
                            OR2.Set(OR.x - (spd2.X), OR.y - (spd2.Y), OR.width, OR.height);
                            //if (EI.Team != ((ICombatant)HE.Attacker).Team)
                            if ((R.isTouching(OR) || R2.isTouching(OR2))) {
                                if (HE.CirnoGame$IHarmfulEntity$ontouchDamage(EI.v)) {
                                    var LHP = EI.v.CirnoGame$ICombatant$HP;
                                    EI.v.CirnoGame$ICombatant$onDamaged(HE, HE.CirnoGame$IHarmfulEntity$touchDamage);
                                    var damaged = LHP > EI.v.CirnoGame$ICombatant$HP;

                                    if (damaged) {
                                        if (Bridge.referenceEquals(EI.v, this.player)) {
                                            EI.v.PlaySound("damaged");
                                        } else {
                                            EI.v.PlaySound("hit");
                                        }
                                    }

                                    if (EI.v.CirnoGame$ICombatant$HP <= 0) {
                                        if (EI.v.HandledLocally) {
                                            var D = { };
                                            D.I = EI.v.ID;
                                            D.A = HE.CirnoGame$IHarmfulEntity$Attacker.ID;
                                            D.S = HE.ID;
                                            this.SendEvent("Kill", D);
                                        }
                                        /* if (damaged)
                                        {
                                           EI.As<Entity>().PlaySound("kill");
                                        }*/
                                    } else {
                                        /* if (damaged)
                                        {
                                           EI.As<Entity>().PlaySound("hit");
                                        }*/
                                    }
                                }
                                this.Attack(EI.v, HE);
                            }
                            j = (j + 1) | 0;
                        }
                        /* List<Entity> L = new List<Entity>(combatants.Where(entity => entity != E && entity is ICombatant && entity.GetHitbox().intersects(R)));
                        int j = 0;
                        while (j < L.Count)
                        {

                           j++;
                        }*/
                    }
                    i = (i + 1) | 0;
                }
            },
            Attack: function (target, source) {
                if (target.CirnoGame$ICombatant$HP > 0 && source.CirnoGame$IHarmfulEntity$ontouchDamage(target)) {
                    target.CirnoGame$ICombatant$onDamaged(source, source.CirnoGame$IHarmfulEntity$touchDamage);
                    //((Entity)target).PlaySound("hit");
                    if (target.CirnoGame$ICombatant$HP <= 0) {
                        if (Bridge.cast(target, CirnoGame.Entity).HandledLocally) {
                            var D = { };
                            D.I = Bridge.cast(target, CirnoGame.Entity).ID;
                            D.A = source.CirnoGame$IHarmfulEntity$Attacker.ID;
                            D.S = Bridge.cast(source, CirnoGame.Entity).ID;
                            this.SendEvent("Kill", D);
                        }
                    }
                }
            },
            PlaySoundEffect: function (source, sound) {
                if (this.muted) {
                    return;
                }
                var vol = 1.0;
                /* float min = 640;
                float maxLength = 320;*/
                //float min = 700;
                var min = 50;
                var maxLength = 200;
                if (CirnoGame.Vector2.op_Inequality(source, null)) {
                    //float dist = (camera.Center - source).RoughLength;
                    //float dist = (camera.Center - source).Length;
                    var dist = this.camera.Center.EstimatedDistance(source);
                    dist -= min;
                    if (dist > 0) {
                        if (dist >= maxLength) {
                            //volume of 0, just don't play it.
                            return;
                        } else {
                            vol = 1.0 - (dist / maxLength);
                        }
                    }
                }
                CirnoGame.AudioManager._this.Blast(System.String.concat("SFX/", sound, ".ogg"), vol);
            },
            AddEntity: function (E) {
                this.entities.add(E);
                if (Bridge.is(E, CirnoGame.ICombatant)) {
                    this.combatants.add(E);
                }
                if (Bridge.is(E, CirnoGame.IHarmfulEntity)) {
                    this.harmful.add(E);
                }
            },
            RemoveEntity: function (E) {
                E.onRemove();
                this.entities.remove(E);
                if (Bridge.is(E, CirnoGame.ICombatant)) {
                    this.combatants.remove(E);
                }
                if (Bridge.is(E, CirnoGame.IHarmfulEntity)) {
                    this.harmful.remove(E);
                }
            },
            Render: function () {
                CirnoGame.GameSprite.prototype.Render.call(this);

                var g = this.spriteGraphics;
                if (this.skiprender) {
                    g = this.EG;
                    this.skiprender = false;
                }
                this.UpdateCamera();
                this.DrawBackground(g);

                g.save();

                this.camera.Apply(g);
                //TM.position.Y = -200;
                this.TM.Draw(g);
                this.entities.forEach(function (E) {
                    if (E.Alive && E.Visible) {
                        E.Draw(g);
                    }
                });

                g.restore();

                if (this.playing) {
                    this.RenderGUI(g);
                } else {
                    g.globalAlpha = 0.3;
                    g.fillStyle = "#000000";
                    g.fillRect(0, 0, this.spriteBuffer.width, this.spriteBuffer.height);
                    g.globalAlpha = 1.0;
                    this.TS.Draw(g);
                    if (this.player.score > 0) {
                        this.ScoreSprite.Text = "Level:" + this.level + " Score:" + this.player.score;
                        this.ScoreSprite.ForceUpdate();
                        this.ScoreSprite.Position.X = (this.spriteBuffer.width * 0.98) - this.ScoreSprite.spriteBuffer.width;
                        this.ScoreSprite.Draw(g);
                    }
                }

            },
            Start: function () {
                if (this.entities.contains(this.player)) {
                    this.RemoveEntity(this.player);
                }
                this.player = new CirnoGame.PlayerCharacter(this);
                this.AddEntity(this.player);
                this.playing = true;
                this.level = 0;
                this.StartNextLevel();
                CirnoGame.App.Div.style.cursor = null;

                this.totalTime = 0;
                this.timeRemaining = this.defaultTimeRemaining;
                //timeRemaining *= 0.3334f * 0.25f;
                /* timeRemaining *= 0.3334f * 0.05f;
                player.HP = 5;*/
            },
            PlayMusic: function (song) {
                if (this.muted) {
                    return;
                }
                var M = CirnoGame.AudioManager._this.Get(System.String.concat("BGM/", song, ".ogg"));
                if (!M.IsPlaying) {
                    CirnoGame.AudioManager._this.StopAllFromDirectory("BGM/");
                    //M.Volume = 0.35;
                    M.Volume = 0.35;
                    M.Loop = true;
                    M.Play();
                }
            },
            RenderGUI: function (g) {
                var PC = this.player;
                var color = "#00DD00";
                if (this.timeRemaining <= 0) {
                    color = "#FF0000";
                }

                g.globalAlpha = 0.8;
                this.DrawGauge(g, new CirnoGame.Vector2(0, 0), new CirnoGame.Vector2(((Bridge.Int.div(this.spriteBuffer.width, 4)) | 0), ((Bridge.Int.div(this.spriteBuffer.height, 20)) | 0)), 5, PC.HP / PC.maxHP, color);
                g.globalAlpha = 1;

                this.TimerSprite.Draw(g);
                this.ScoreSprite.Text = "Level:" + this.level + " Score:" + this.player.score;
                this.ScoreSprite.ForceUpdate();
                this.ScoreSprite.Position.X = (this.spriteBuffer.width * 0.98) - this.ScoreSprite.spriteBuffer.width;
                this.ScoreSprite.Draw(g);
                this.RenderIcons(g);
            },
            RenderIcons: function (g) {
                var R = (Bridge.Int.div(this.Key.height, this.Key.width)) | 0;
                var W = this.spriteBuffer.width * 0.02;
                var H = this.spriteBuffer.height * 0.055;

                var Y = H;
                var X = W / 2;
                var i = 0;

                //var sz = spriteBuffer.Width * 0.015f;
                var sz = this.spriteBuffer.width * 0.0115;
                g.globalAlpha = 0.8;
                if (this.Door.Opened) {
                    var DA = this.BigKey;
                    //var Dsz = spriteBuffer.Width * 0.018f;
                    var Dsz = sz * 1.5;
                    var DR = (Bridge.Int.div(DA.height, DA.width)) | 0;

                    g.drawImage(DA, X, Y, Dsz, Dsz * R);
                    X += W;
                }
                while (i < this.player.keys) {
                    g.drawImage(this.Key, X, Y, sz, sz * R);
                    X += W;
                    i = (i + 1) | 0;
                }
                g.globalAlpha = 1.0;
            },
            DrawGauge: function (g, position, size, border, progress, color, drawborder) {
                if (drawborder === void 0) { drawborder = true; }
                var alpha = g.globalAlpha;
                if (drawborder) {
                    g.globalAlpha = 0.6 * alpha;
                    g.fillStyle = "#000000";

                    g.fillRect(position.X, position.Y, size.X, size.Y);
                }

                g.fillStyle = color;
                g.globalAlpha = 1.0 * alpha;
                g.fillRect(((Bridge.Int.clip32(position.X) + border) | 0), ((Bridge.Int.clip32(position.Y) + border) | 0), (size.X - (((border + border) | 0))) * progress, ((Bridge.Int.clip32(size.Y) - (((border + border) | 0))) | 0));

                g.globalAlpha = 0.5 * alpha;
                //Script.Write("var grd = g.createLinearGradient(0, 0, 0, size.y);grd.addColorStop(0, color);grd.addColorStop(0.4, \"white\");grd.addColorStop(1, color);g.fillStyle = grd;");
                var grd = g.createLinearGradient(0, 0, 0, size.Y);
                grd.addColorStop(0, color);
                grd.addColorStop(0.4, "white");
                grd.addColorStop(1, color);
                g.fillStyle = grd;


                g.fillRect(((Bridge.Int.clip32(position.X) + border) | 0), ((Bridge.Int.clip32(position.Y) + border) | 0), (size.X - (((border + border) | 0))) * progress, ((Bridge.Int.clip32(size.Y) - (((border + border) | 0))) | 0));
                g.globalAlpha = alpha;
            },
            SendEvent: function (eventName, data, triggerflush) {
                if (triggerflush === void 0) { triggerflush = false; }
                var D = { };
                D.E = eventName;
                D.D = data;
                /* NetPlayUser NU = null;
                if (Online)
                {
                   NP.Send(D);
                   NU = NP.Me;
                }*/
                //ProcessEvent(D, NU, 0);
                this.ProcessEvent(D);
                /* if (triggerflush)
                {
                   NetPlayNeedsFlush = true;
                }*/
            },
            ProcessEvent: function (msg, user, latency) {
                if (user === void 0) { user = null; }
                if (latency === void 0) { latency = 0.0; }
                var D = msg.D;
                /* List<Player> LP = new List<Player>(players.Where(player => user != null && player.NetworkID == user.userID));
                Player P = null;

                bool hascharacter = true;
                if (LP.Count <= 0)
                {
                   if (P == null && user == null && !Online)
                   {
                       P = localplayer;
                   }
                   else
                   {
                       if (user.IsMe)
                       {
                           localplayer.NetworkID = user.userID;
                           P = localplayer;
                       }
                       else
                       {
                           hascharacter = false;
                       }
                   }
                }
                else
                {
                   P = LP[0];
                }*/
                var evt = msg.E;
                /* if (user != null && !user.IsMe)
                {
                   Dlatency += latency;
                   //latency *= 0.99f;
                   Dlatency *= (1 - (1 / latencyM));
                }
                //if (msg.E == "Init" && !P.local)
                if (evt == "Init" && P == null)
                {
                   if (!hascharacter)
                   {
                       P = new Player(false, false);
                       P.NetworkID = user.userID;
                       //PlayerCharacter PC = new PlayerCharacter(this, P, "Reisen");
                       PlayerCharacter PC = new PlayerCharacter(this, P, D.C);
                       //PC.Team = 1;
                       PC.Team = D.T;
                       PC.x = 700;
                       PC.y = 240;
                       PC.ID = D.I;
                       players.Add(P);
                       AddEntity(PC);
                       if (Hoster)
                       {
                           SendEvent("MapSeed", TM.Seed);

                           List<Entity> L = new List<Entity>(entities.Where(E => E is MadnessOrb || (E is PlayerCharacter && ((PlayerCharacter)E).player.CPU)));
                           int i = 0;
                           while (i < L.Count)
                           {
                               SendEntitySpawnCheck(L[i]);
                               i++;
                           }
                       }
                       Console.WriteLine("User:" + P.NetworkID + " has joined!");
                   }
                }
                if (evt == "Spawn")
                {
                   Entity E = EntityFromID(D.I);
                   if (E == null)
                   {
                       Type T = Helper.GetType(D.T);
                       E = Activator.CreateInstance(T, this).ToDynamic();
                       E.ID = D.I;
                       E.x = D.X;
                       E.y = D.Y;

                       if (D.D)
                       {
                           Helper.CopyFields(D.D, E);
                       }
                       AddEntity(E);
                       CatchupEntity(E, latency);
                       //Activator.CreateInstance()
                       //System.Reflection.
                       //Type T = Type.GetType("");
                   }
                }
                if (evt == "Unpause")
                {
                   paused = false;
                   Console.WriteLine("Game unpaused");
                   SendInit();
                }
                if (evt == "MapSeed" && !Hoster)
                {
                   if (TM.Seed != D)
                   {
                       TM.Seed = D;
                       TM.Generate();
                       //clean up local client entities.
                       if (!connected)
                       {
                           int i = 0;
                           while (i < entities.Count)
                           {
                               if (entities[i] is MadnessOrb || (entities[i] is PlayerCharacter && ((PlayerCharacter)entities[i]).player.CPU))
                               {
                                   RemoveEntity(entities[i]);
                                   i--;
                               }
                               i++;
                           }
                           connected = true;
                       }
                   }

                }
                if (evt == "CE")
                {
                   Entity entity = EntityFromID(D.I);
                   if (entity != null)
                   {
                       entity.CustomEvent(D.D);
                   }
                }
                if (evt == "CBE")
                {
                   Entity entity = EntityFromID(D.I);
                   if (entity != null)
                   {
                       EntityBehavior b = entity.GetBehaviorFromName(D.T);
                       b.CustomEvent(D.D);
                       //entity.CustomEvent(D.D);
                   }
                }*/
                if (Bridge.referenceEquals(evt, "Kill")) {
                    var entity = this.EntityFromID(D.I);
                    if (entity != null) {
                        var attacker = this.EntityFromID(D.A);
                        Bridge.cast(entity, CirnoGame.ICombatant).CirnoGame$ICombatant$onDeath(this.EntityFromID(D.S));
                        if (attacker != null && Bridge.is(attacker, CirnoGame.PlayerCharacter)) {
                            var PC = Bridge.cast(attacker, CirnoGame.PlayerCharacter);
                            //PC.player.Score += ((ICombatant)entity).PointsForKilling;
                            PC.score = (PC.score + Bridge.cast(entity, CirnoGame.ICombatant).CirnoGame$ICombatant$PointsForKilling) | 0;
                            PC.onKill(Bridge.cast(entity, CirnoGame.ICombatant));
                        }
                    }
                }
            },
            EntityFromID: function (ID) {
                var i = 0;
                while (i < this.entities.Count) {
                    var E = this.entities.getItem(i);
                    if (Bridge.referenceEquals(E.ID, ID)) {
                        return E;
                    }
                    i = (i + 1) | 0;
                }
                return null;
            },
            UpdateCamera: function () {
                var $t, $t1;
                //float D = test.Hspeed * 18;
                //float D = (float)Math.Abs(test.Hspeed) * 9;
                //var freecam = true;
                this.camera.speedmod = 1.0;

                /* if (KeyboardManager._this.TappedButtons.ContainsB(67) && App.DEBUG)
                {
                   freecam = !freecam;
                }*/
                if (this.freecam) {
                    var spd = 16 / this.camera.Scale;
                    var PB = CirnoGame.KeyboardManager._this.PressedButtons;
                    //numpad panning
                    if (CirnoGame.HelperExtensions.ContainsB$1(System.Int32, PB, Bridge.box(100, System.Int32))) {
                        this.camera.TargetPosition.X -= spd;
                    }
                    if (CirnoGame.HelperExtensions.ContainsB$1(System.Int32, PB, Bridge.box(102, System.Int32))) {
                        this.camera.TargetPosition.X += spd;
                    }

                    if (CirnoGame.HelperExtensions.ContainsB$1(System.Int32, PB, Bridge.box(104, System.Int32))) {
                        this.camera.TargetPosition.Y -= spd;
                    }
                    if (CirnoGame.HelperExtensions.ContainsB$1(System.Int32, PB, Bridge.box(98, System.Int32))) {
                        this.camera.TargetPosition.Y += spd;
                    }
                    if (CirnoGame.HelperExtensions.ContainsB$1(System.Int32, PB, Bridge.box(107, System.Int32))) {
                        var CC = this.camera.Center;
                        this.camera.Scale *= 1.01;
                        this.camera.Center = CC;
                        this.camera.TargetPosition.X = this.camera.Position.X;
                        this.camera.TargetPosition.Y = this.camera.Position.Y;
                    }
                    if (CirnoGame.HelperExtensions.ContainsB$1(System.Int32, PB, Bridge.box(109, System.Int32))) {
                        var CC1 = this.camera.Center;
                        this.camera.Scale *= 0.99;
                        this.camera.Center = CC1;
                        this.camera.TargetPosition.X = this.camera.Position.X;
                        this.camera.TargetPosition.Y = this.camera.Position.Y;
                    }
                    if (CirnoGame.HelperExtensions.ContainsB$1(System.Int32, PB, Bridge.box(36, System.Int32))) {
                        this.camera.CenteredTargetPosition = this.player.Position;
                    }
                    if (CirnoGame.HelperExtensions.ContainsB$1(System.Int32, PB, Bridge.box(13, System.Int32))) {
                        this.player.Position.X = this.camera.Center.X;
                        this.player.Position.Y = this.camera.Center.Y;
                    }
                    this.camera.Update();
                    return;
                }
                if (!this.playing) {
                    this.camera.speedmod = 0.05;
                    if (CirnoGame.Vector2.op_Equality(this.camera.TargetPosition, null) || this.camera.Position.EstimatedDistance(this.camera.TargetPosition) < 40) {
                        if (Math.random() < 0.0035 || this.camera.instawarp) {
                            this.camera.CenteredTargetPosition = CirnoGame.MapRoom.FindAnyEmptySpot();
                        }
                    }
                    /* camera.TargetPosition = null;
                    if (cameraWanderPoint == null)
                    {
                       cameraWanderPoint = MapRoom.FindAnyEmptySpot();
                    }*/
                    this.camera.Update();
                    return;
                }

                if (this.freecam) {
                    if (CirnoGame.KeyboardManager._this.PressedButtons.contains(101) || CirnoGame.KeyboardManager._this.PressedButtons.contains(111)) {
                        var TEST = CirnoGame.RoomOpeningLever.TEST;
                        if (CirnoGame.KeyboardManager._this.PressedButtons.contains(106) && !TEST.Activated) {
                            TEST.Activate();
                        }
                        if (TEST != null) {
                            if (!TEST.Activated && !CirnoGame.KeyboardManager._this.PressedButtons.contains(111)) {
                                this.camera.CenteredTargetPosition = TEST.Position;
                            } else {
                                var T = this.TM.GetTile(TEST.Room.SX, TEST.Room.SY);
                                var HB = T.GetHitbox();
                                this.camera.CenteredTargetPosition = new CirnoGame.Vector2(HB.left, HB.top);
                            }
                            if (CirnoGame.KeyboardManager._this.TappedButtons.contains(32)) {
                                this.player.Position.X = this.camera.Center.X;
                                this.player.Position.Y = this.camera.Center.Y;
                            }
                            this.camera.Update();
                            return;
                        } else {
                            this.player.MSG.ChangeText("No lever on map");
                        }
                    }
                }
                if (this.player.HP < 0) {
                    return;
                }
                var D = this.player.Hspeed * 32;
                var H = this.camera.CameraBounds.width / 8;
                D += !this.player.Ani.Flipped ? H : -H;
                var C = CirnoGame.App.Canvas;
                var IS = this.camera.InvScale;
                var V = Math.max(0, this.player.Vspeed * 30);
                if (($t = this.player.Controller)[System.Array.index(2, $t)]) {
                    V -= this.camera.CameraBounds.height / 4;
                } else if (($t1 = this.player.Controller)[System.Array.index(3, $t1)]) {
                    V += this.camera.CameraBounds.height / 4;
                } else if (this.player.onGround) {
                    //V -= camera.CameraBounds.height / 8;
                    V -= this.camera.CameraBounds.height / 10;
                } else {
                    V += this.camera.CameraBounds.height / 12;
                }

                var TP = this.camera.TargetPosition;
                /* TP.X = (test.x + D) - ((C.Width / 2) * IS);
                TP.Y = (float)Math.Max(0, (test.y + V) - ((C.Height / 2) * IS));*/
                /* TP.X = test.x;
                TP.Y = test.y;*/
                var X = this.player.x + (this.player.Width / 2) + D;
                var Y = this.player.y + (this.player.Height / 2) + V;
                this.camera.CenteredTargetPosition = new CirnoGame.Vector2(X, Y);
                this.camera.Update();
            },
            DrawBackground: function (g) {
                g.fillStyle = "#77AAFF";
                g.fillRect(0, 0, CirnoGame.App.Canvas.width, CirnoGame.App.Canvas.height);
                /* if (BG < 0 || BG >= BGs.Count)
                {
                   g.FillStyle = "#77AAFF";
                   g.FillRect(0, 0, App.Canvas.Width, App.Canvas.Height);
                }
                else
                {
                   g.DrawImage(BGs[BG], (float)0, (float)0);
                }*/
            },
            UpdateControls: function () {

                var PC = this.player;
                var threshhold = 0.7;
                var C = PC.Controller;
                var IC = CirnoGame.App.IC;

                if (IC == null) {
                    return;
                }
                var x = IC.getState(0);
                var y = IC.getState(1);
                C[System.Array.index(0, C)] = x <= -threshhold;
                C[System.Array.index(1, C)] = x >= threshhold;
                C[System.Array.index(2, C)] = y <= -threshhold;
                C[System.Array.index(3, C)] = y >= threshhold;

                var cid = IC.getMapControllerID$1(5);
                if (Bridge.referenceEquals(cid, "Keyboard") || Bridge.referenceEquals(cid, "Mouse")) {
                    /* C[4] = KeyboardManager._this.PressedMouseButtons.Contains(0);
                    C[5] = KeyboardManager._this.PressedMouseButtons.Contains(2);*/
                    C[System.Array.index(4, C)] = IC.getPressed(2);
                    C[System.Array.index(5, C)] = IC.getPressed(3);
                    C[System.Array.index(6, C)] = IC.getPressed(4);
                } else {
                    /* GamePad P = GamePadManager._this.GetPad(IC.id);
                    PC.aimAngle = new Vector2((float)P.axes[2], (float)P.axes[3]).ToAngle();*/
                    var aim = new CirnoGame.Vector2(IC.getState(4), IC.getState(5));
                    if (aim.RoughLength > 0.5) {
                    }


                }
                C[System.Array.index(4, C)] = IC.getPressed(2);
                C[System.Array.index(5, C)] = IC.getPressed(3);
                C[System.Array.index(6, C)] = IC.getPressed(4);
                /* C[4] = IC.getPressed(3);
                C[5] = IC.getPressed(4);*/

                var o = { };
            }
        }
    });

    Bridge.define("CirnoGame.HealingItem", {
        inherits: [CirnoGame.CollectableItem],
        ctors: {
            ctor: function (game) {
                this.$initialize();
                CirnoGame.CollectableItem.ctor.call(this, game, "heart");
                this.floats = false;
                this.magnetDistance = 20;
                this.sound = "ok";
            }
        },
        methods: {
            CanCollect: function (player) {
                return player.HP < player.maxHP;
            },
            onCollected: function (player) {
                player.HP = Math.min(player.HP + 1, player.maxHP);
            }
        }
    });

    Bridge.define("CirnoGame.KeyItem", {
        inherits: [CirnoGame.CollectableItem],
        ctors: {
            ctor: function (game) {
                this.$initialize();
                CirnoGame.CollectableItem.ctor.call(this, game, "key");
                this.floats = false;
                this.magnetDistance = 20;
            }
        },
        methods: {
            CanCollect: function (player) {
                return player.keys < 5;
            },
            onCollected: function (player) {
                player.keys = (player.keys + 1) | 0;
            }
        }
    });

    Bridge.define("CirnoGame.PlatformerEntity", {
        inherits: [CirnoGame.ControllableEntity],
        fields: {
            friction: 0,
            onGround: false,
            GravityEnabled: false,
            gravity: 0,
            maxFallSpeed: 0,
            feetposition: 0,
            headposition: 0,
            Floor: null,
            Ceiling: null,
            LeftWall: null,
            RightWall: null
        },
        ctors: {
            init: function () {
                this.friction = 0.5;
                this.GravityEnabled = true;
                this.gravity = 0.02;
                this.maxFallSpeed = 2.0;
                this.feetposition = 23;
                this.headposition = 7;
            },
            ctor: function (game) {
                this.$initialize();
                CirnoGame.ControllableEntity.ctor.call(this, game);

            }
        },
        methods: {
            Update: function () {
                CirnoGame.ControllableEntity.prototype.Update.call(this);
                if (this.GravityEnabled) {
                    if (this.Vspeed < this.maxFallSpeed && this.GravityEnabled) {
                        this.Vspeed = Math.min(this.Vspeed + this.gravity, this.maxFallSpeed);
                    }
                }
                /* if (y > 0 && Vspeed>=0)
                {
                   y = 0;
                   Vspeed = 0;
                   onGround = true;
                }
                if (y < 0)
                {
                   onGround = false;
                }*/
                this.ApplyFriction();
                this.UpdateTerrainCollision();

                this.onGround = (this.Floor != null && this.Vspeed >= 0);

                if (this.onGround) {
                    var Y = this.Floor.GetTop(this.getCenter()) - this.feetposition;
                    /* if (y < Y)
                    {
                       onGround = false;
                       Floor = null;
                    }
                    else*/
                    {
                        //y = ((Floor.row * Game.TM.tilesize) + Game.TM.position.Y) - feetposition;
                        this.y = Y;
                        this.Vspeed = 0;
                        this.onGround = true;
                    }
                }
                if (this.Ceiling != null && this.Vspeed < 0) {
                    this.Vspeed = 0;
                    this.y = ((this.Ceiling.row * this.Game.TM.tilesize) + this.Game.TM.position.Y) + this.Game.TM.tilesize - this.headposition;
                }
                if (this.LeftWall != null) {
                    this.Hspeed = Math.max(0, this.Hspeed);
                }
                if (this.RightWall != null) {
                    this.Hspeed = Math.min(0, this.Hspeed);
                }
            },
            ApplyFriction: function () {
                this.Hspeed = CirnoGame.MathHelper.Decelerate(this.Hspeed, this.friction);
                if (!this.GravityEnabled) {
                    this.Vspeed = CirnoGame.MathHelper.Decelerate(this.Vspeed, this.friction);
                }
            },
            GetFloor: function () {
                var T = null;
                var W = this.Width / 3;
                var Y = this.Height;
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, this.Width / 2, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, W, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, this.Width - W, Y));
                }
                if (!(T != null && T.enabled && T.topSolid)) {
                    T = null;
                }
                return T;
            },
            GetCeiling: function () {
                var T = null;
                var W = this.Width / 3;
                //float Y = 16;
                var Y = 0 + this.headposition;
                if (!(T != null && T.enabled && T.bottomSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, W, Y));
                }
                if (!(T != null && T.enabled && T.bottomSolid)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, this.Width - W, Y));
                }
                if (!(T != null && T.enabled && T.bottomSolid)) {
                    T = null;
                }
                return T;
            },
            CheckWall: function (X) {
                var T = null;
                /* if (!(T != null && T.enabled && ((T.leftSolid && X > 0) || (T.rightSolid && X < 0))))
                {
                   T = Game.TM.CheckForTile(Position + new Vector2(X, (Height / 2)-2));
                }
                if (!(T != null && T.enabled && ((T.leftSolid && X > 0) || (T.rightSolid && X < 0))))
                {
                   T = Game.TM.CheckForTile(Position + new Vector2(X, Height-2));
                   if (T != null && T.IsSlope)
                   {
                       T = null;
                   }
                }
                if (!(T != null && T.enabled && ((T.leftSolid && X > 0) || (T.rightSolid && X < 0))))
                {
                   T = null;
                }*/
                if (!this.IsTileObstacle(T, X)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, X, (this.Height / 2) - 2));
                }
                if (!this.IsTileObstacle(T, X)) {
                    T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, X, this.Height - 2));
                }
                if (!this.IsTileObstacle(T, X)) {
                    T = null;
                }
                return T;
            },
            IsTileObstacle: function (T, X) {
                if (T != null && T.enabled && ((T.leftSolid && X > 0) || (T.rightSolid && X < 0)) && (this.Floor == null || T.row < this.Floor.row)) {
                    var Y = this.y + this.Height;
                    //if (T.GetHitbox().y < Y-28)
                    //if (T.GetHitbox().y < Y - 8)
                    //if (T.GetHitbox().y < Y - 4)
                    if (T.GetHitbox().y < Y - 0) {
                        return !T.IsSlope;
                    }
                }
                return false;
            },
            UpdateTerrainCollision: function () {
                this.Floor = this.GetFloor();
                this.Ceiling = this.GetCeiling();


                if (this.Vspeed < this.maxFallSpeed && this.GravityEnabled) {
                    this.Vspeed = Math.min(this.Vspeed + this.gravity, this.maxFallSpeed);
                }
                var stuck = false;
                if (this.Floor != null) {
                    var c = true;
                    while (c) {
                        var T = this.Floor.GetTileData(0, -1);
                        if (T != null && T.enabled && T.solid) {
                            this.Floor = T;
                            stuck = true;
                        } else {
                            c = false;
                        }
                    }
                }
                stuck = false;
                this.onGround = false;
                if (this.Floor != null && this.Vspeed >= 0) {
                    //float Y = Floor.GetHitbox().top - Height;
                    var Y = this.Floor.GetTop(this.getCenter()) - this.Height;
                    //if (!Floor.platform || y <= Y + Vspeed)
                    //if (!Floor.platform || y+Vspeed>=Y)
                    if ((!this.Floor.platform || this.y <= Y + this.Vspeed) && this.y + (this.Vspeed + 10) >= Y) {
                        if (this.Vspeed > 0) {
                            this.Vspeed = 0;
                            this.onGround = true;
                        }
                        this.y = Y;
                    }
                }
                if (this.Hspeed !== 0) {
                    var wall = this.Hspeed > 0 ? this.RightWall : this.LeftWall;
                    if (wall != null) {
                        this.Hspeed = 0;
                    }
                }
                var W = this.Width / 3;
                var X = Math.abs(this.Hspeed);
                if (this.Hspeed < 0) {
                    X -= 2 - W;
                } else {
                    X += (this.Width - W) + 2;
                }
                this.RightWall = this.CheckWall(X);

                X = -Math.abs(this.Hspeed);
                if (this.Hspeed < 0) {
                    X -= 2 - W;
                } else {
                    X += (this.Width - W) + 2;
                }
                this.LeftWall = this.CheckWall(X);
                if (this.LeftWall != null && Bridge.referenceEquals(this.LeftWall, this.RightWall)) {
                    var R = this.LeftWall.GetHitbox();
                    var V = R.Center;
                    if ((CirnoGame.Vector2.op_Subtraction(V, this.Position)).X > 0) {
                        this.x += 1;
                        if (this.Hspeed < 0) {
                            this.Hspeed = 0;
                        }
                    } else {
                        this.x -= 1;
                        if (this.Hspeed > 0) {
                            this.Hspeed = 0;
                        }
                    }
                }
                if (stuck) {
                    this.UpdateTerrainCollision();
                }
            }
        }
    });

    Bridge.define("CirnoGame.Orb", {
        inherits: [CirnoGame.CollectableItem],
        ctors: {
            ctor: function (game) {
                this.$initialize();
                CirnoGame.CollectableItem.ctor.call(this, game, "orb");
                //Ani = new Animation(AnimationLoader.Get("images/misc/orb"));

            }
        },
        methods: {
            onCollected: function (player) {
                //throw new NotImplementedException();
                var time = 20000;
                if (this.Game.timeRemaining > 0) {
                    this.Game.timeRemaining += time;
                    this.Game.timeRemaining = Math.min(this.Game.maxTimeRemaining, this.Game.timeRemaining);
                } else {
                    this.Game.timeRemaining += time;
                }
            }
        }
    });

    Bridge.define("CirnoGame.PointItem", {
        inherits: [CirnoGame.CollectableItem],
        ctors: {
            ctor: function (game) {
                this.$initialize();
                CirnoGame.CollectableItem.ctor.call(this, game, "point");
                this.floats = false;
                //magnetDistance = 100;
                this.magnetDistance = 70;
                this.magnetSpeed *= 8;
            }
        },
        methods: {
            onCollected: function (player) {
                player.score = (player.score + 5) | 0;
            }
        }
    });

    Bridge.define("CirnoGame.MRGhosty", {
        inherits: [CirnoGame.PlatformerEntity,CirnoGame.ICombatant,CirnoGame.IHarmfulEntity],
        fields: {
            animation: null,
            attackpower: 0,
            defensepower: 0
        },
        props: {
            Team: 0,
            HP: 0,
            PointsForKilling: {
                get: function () {
                    return 1;
                }
            },
            TargetPriority: {
                get: function () {
                    return 0.5;
                }
            },
            IsHarmful: {
                get: function () {
                    return true;
                }
            },
            Attacker: {
                get: function () {
                    return this;
                }
            },
            touchDamage: {
                get: function () {
                    return this.attackpower * 1.5;
                }
            }
        },
        alias: [
            "Team", "CirnoGame$ICombatant$Team",
            "HP", "CirnoGame$ICombatant$HP",
            "PointsForKilling", "CirnoGame$ICombatant$PointsForKilling",
            "TargetPriority", "CirnoGame$ICombatant$TargetPriority",
            "IsHarmful", "CirnoGame$IHarmfulEntity$IsHarmful",
            "Attacker", "CirnoGame$IHarmfulEntity$Attacker",
            "touchDamage", "CirnoGame$IHarmfulEntity$touchDamage",
            "onDamaged", "CirnoGame$ICombatant$onDamaged",
            "onDeath", "CirnoGame$ICombatant$onDeath",
            "onKill", "CirnoGame$ICombatant$onKill",
            "ontouchDamage", "CirnoGame$IHarmfulEntity$ontouchDamage"
        ],
        ctors: {
            init: function () {
                this.animation = "???";
                this.attackpower = 1;
                this.defensepower = 1;
            },
            ctor: function (game) {
                this.$initialize();
                CirnoGame.PlatformerEntity.ctor.call(this, game);
                this.ChangeAni("");
                this.AddBehavior(new CirnoGame.FlightControls(this));
                this.AddBehavior(new CirnoGame.RandomAI(this));
                this.attackpower = 1 + (this.Game.level * 0.5);
                this.defensepower = 1 + (this.Game.level * 0.5);
                if (this.Game.playing) {
                    this.AddBehavior$1(CirnoGame.AimedShooter);
                    this.GetBehavior(CirnoGame.AimedShooter).attackpower = this.attackpower;
                    this.GetBehavior(CirnoGame.AimedShooter).maxtime = Math.max(((480 - (Bridge.Int.mul(this.Game.level, 10))) | 0), 380);
                }
                this.GetBehavior(CirnoGame.FlightControls).maxSpeed *= 0.5;

                this.GravityEnabled = false;
                this.Team = 2;
                this.HP = 2;
            }
        },
        methods: {
            Update: function () {
                CirnoGame.PlatformerEntity.prototype.Update.call(this);
                this.Ani.Flipped = (this.Hspeed < 0);
                this.Ani.ImageSpeed = (Math.abs(this.Hspeed) + Math.abs(this.Vspeed)) * 0.125;
            },
            ChangeAni: function (animation, reset) {
                if (reset === void 0) { reset = false; }
                if (Bridge.referenceEquals(this.animation, animation)) {
                    return;
                }
                if (this.Ani == null) {
                    this.Ani = new CirnoGame.Animation(CirnoGame.AnimationLoader.Get(System.String.concat("images/enemies/mrghost", animation)));
                } else {
                    this.Ani.ChangeAnimation(CirnoGame.AnimationLoader.Get(System.String.concat("images/enemies/mrghost", animation)), reset);
                }
                this.animation = animation;
            },
            onDamaged: function (source, amount) {
                //throw new NotImplementedException();
                //if (!(source is MRGhosty))
                {
                    this.HP -= (amount / this.defensepower);
                }
                /* else
                {
                   Helper.Log("ghosts are allergic to themselves???");
                }*/
            },
            onDeath: function (source) {
                //throw new NotImplementedException();
                this.Alive = false;
                var P = new CirnoGame.PointItem(this.Game);
                P.Position.CopyFrom(this.Position);
                P.collectionDelay = (Bridge.Int.div(P.collectionDelay, 2)) | 0;
                this.Game.AddEntity(P);
                if (Math.random() < 0.15) {
                    P = new CirnoGame.HealingItem(this.Game);
                    P.Position.CopyFrom(this.Position);
                    P.Vspeed = -2;
                    P.collectionDelay = (Bridge.Int.div(P.collectionDelay, 2)) | 0;
                    this.Game.AddEntity(P);
                }
            },
            onKill: function (combatant) {
                //throw new NotImplementedException();
            },
            ontouchDamage: function (target) {
                //throw new NotImplementedException();
                return true;
            }
        }
    });

    Bridge.define("CirnoGame.PlayerCharacter", {
        inherits: [CirnoGame.PlatformerEntity,CirnoGame.ICombatant],
        fields: {
            animation: null,
            shoottime: 0,
            prefix: null,
            newInput: false,
            tapTimer: null,
            shootRecharge: 0,
            turntime: 0,
            score: 0,
            orbs: 0,
            keys: 0,
            maxHP: 0,
            SpawnLocation: null,
            lives: 0,
            frame: 0,
            digpower: 0,
            attackpower: 0,
            defensepower: 0,
            invincibilitytime: 0,
            blockprice: 0,
            invincibilitymod: 0,
            currentshot: 0,
            shotdelay: 0,
            currentshotdelay: 0,
            totalshots: 0,
            MSG: null
        },
        props: {
            Team: 0,
            HP: 0,
            PointsForKilling: {
                get: function () {
                    return 300;
                }
            },
            TargetPriority: {
                get: function () {
                    return 0.7;
                }
            }
        },
        alias: [
            "Team", "CirnoGame$ICombatant$Team",
            "HP", "CirnoGame$ICombatant$HP",
            "PointsForKilling", "CirnoGame$ICombatant$PointsForKilling",
            "TargetPriority", "CirnoGame$ICombatant$TargetPriority",
            "onDamaged", "CirnoGame$ICombatant$onDamaged",
            "onDeath", "CirnoGame$ICombatant$onDeath",
            "onKill", "CirnoGame$ICombatant$onKill"
        ],
        ctors: {
            init: function () {
                this.animation = "???";
                this.shoottime = 0;
                this.prefix = "";
                this.shootRecharge = 0;
                this.turntime = 0;
                this.score = 0;
                this.orbs = 0;
                this.keys = 0;
                this.maxHP = 20;
                this.SpawnLocation = new CirnoGame.Vector2();
                this.lives = 3;
                this.frame = 0;
                this.digpower = 1.0;
                this.attackpower = 1.0;
                this.defensepower = 1.0;
                this.invincibilitytime = 0;
                this.blockprice = 9.0;
                this.invincibilitymod = 1.0;
                this.currentshot = 0;
                this.shotdelay = 5;
                this.currentshotdelay = 0;
                this.totalshots = 1;
            },
            ctor: function (game) {
                this.$initialize();
                CirnoGame.PlatformerEntity.ctor.call(this, game);
                this.ChangeAni("stand");
                this.AddBehavior(new CirnoGame.PlatformerControls(this));
                this.tapTimer = System.Array.init(this.Controller.length, 0, System.Int32);
                this.Team = 0;
                this.HP = this.maxHP;
                this.MSG = new CirnoGame.FloatingMessage(game, "");
                this.MSG.Text.TextColor = "#FFFFFF";
                //MSG.ChangeText("hello world");
                this.MSG.autokill = false;
                game.AddEntity(this.MSG);
                this.MSG.RemovedOnLevelEnd = false;
                this.RemovedOnLevelEnd = false;
            }
        },
        methods: {
            MoveToNewSpawn: function (NewSpawnLocation) {
                this.SpawnLocation.CopyFrom(NewSpawnLocation);
                this.Position.CopyFrom(this.SpawnLocation);
            },
            shoot: function () {
                if (this.shoottime < 1) {
                    this.prefix = "s";
                    this.ChangeAni(System.String.concat(this.prefix, this.animation));
                }
                if (this.shootRecharge <= 0) {
                    this.currentshot = 1;
                    this.DoShot();
                    //shootRecharge = 12;

                    this.currentshotdelay = 0;
                    this.shootRecharge = 20;

                }
                this.shoottime = 50;
                this.turntime = 0;

            },
            DoShot: function () {
                var PB = new CirnoGame.PlayerBullet(this.Game, this, "Images/misc/crystal");
                PB.Hspeed = this.Ani.Flipped ? -2.5 : 2.5;
                PB.x = this.x + (this.Ani.Flipped ? -4 : 12);
                PB.y = this.y + 10;
                if (!this.Controller[System.Array.index(0, this.Controller)] && !this.Controller[System.Array.index(1, this.Controller)]) {
                    if (this.Controller[System.Array.index(2, this.Controller)]) {
                        PB.Hspeed *= 0.8;
                        PB.Vspeed = -Math.abs(PB.Hspeed);
                        PB.Hspeed *= 0.6;
                    } else if (this.Controller[System.Array.index(3, this.Controller)]) {
                        PB.Hspeed *= 0.8;
                        PB.Vspeed = Math.abs(PB.Hspeed);
                        PB.Hspeed *= 0.6;
                    }
                } else {
                    if (this.Controller[System.Array.index(2, this.Controller)]) {
                        PB.Hspeed *= 0.9;
                        PB.Vspeed = -Math.abs(PB.Hspeed * 0.7);

                    } else if (this.Controller[System.Array.index(3, this.Controller)]) {
                        PB.Hspeed *= 0.9;
                        PB.Vspeed = Math.abs(PB.Hspeed * 0.7);
                    }
                }
                PB.x -= PB.Hspeed;
                PB.y -= PB.Vspeed;
                PB.attacksterrain = this.currentshot === 1;
                PB.digpower = (this.digpower) * 0.6667;
                PB.touchDamage = this.attackpower / (((this.totalshots - 1.0) / 2.0) + 1.0);
                this.Game.AddEntity(PB);
            },
            Update: function () {
                CirnoGame.PlatformerEntity.prototype.Update.call(this);
                this.MSG.Position.X = this.Position.X;
                this.MSG.Position.Y = this.Position.Y - 10;

                if (this.shoottime > 0) {
                    this.shoottime = (this.shoottime - 1) | 0;
                    if (this.shoottime < 1) {
                        if (Bridge.referenceEquals("" + String.fromCharCode(this.animation.charCodeAt(0)), this.prefix)) {
                            this.ChangeAni(this.animation.substr(1));
                        }
                        this.prefix = "";
                    }
                }
                if (this.shootRecharge > 0) {
                    this.shootRecharge = (this.shootRecharge - 1) | 0;
                }
                if (this.onGround) {
                    if (this.Hspeed !== 0) {
                        this.ChangeAni(System.String.concat(this.prefix, "walk"));
                    } else {
                        this.ChangeAni(System.String.concat(this.prefix, "stand"));
                    }
                    this.Ani.ImageSpeed = Math.abs(this.Hspeed * 0.125);
                    //Ani.ImageSpeed = Ani.Flipped ? Hspeed * 0.125f : -Hspeed * 0.125f;
                    //Ani.ImageSpeed = (Ani.Flipped ? -Hspeed : Hspeed) * 0.125f;
                } else {
                    this.ChangeAni(System.String.concat(this.prefix, "jump"));
                    //Ani.ImageSpeed = (float)Math.Abs(Vspeed * 0.125);
                    this.Ani.ImageSpeed = 0.15 + ((Math.abs(this.Hspeed) + Math.abs(this.Vspeed)) * 0.7);
                }
                if (this.Ani.Flipped !== this.Hspeed < 0 || (this.Hspeed === 0 && this.onGround)) {
                    this.turntime = (this.turntime + 1) | 0;
                } else {
                    this.turntime = 0;
                }

                //if (LController[3] != Controller[3] && Controller[3])
                /* if (Pressed(3) || Pressed(4) || Pressed(5) || Pressed(6))
                {
                   shoot();
                }*/
                if (this.currentshot < this.totalshots) {
                    this.currentshotdelay = (this.currentshotdelay + 1) | 0;
                    if (this.currentshotdelay >= this.shotdelay) {
                        this.currentshotdelay = 0;
                        this.currentshot = (this.currentshot + 1) | 0;
                        this.DoShot();
                    }
                }
                if (this.Controller[System.Array.index(4, this.Controller)]) {
                    this.turntime = 0;
                }
                if (this.Pressed(4)) {
                    this.shoot();
                }
                if (this.Pressed(6)) {
                    this.PlaceBlock();
                }

                this.UpdateController();
                //if (turntime > 22 && Hspeed != 0)
                //if (turntime > 18 && Hspeed != 0)
                if (this.turntime > 14 && this.Hspeed !== 0) {
                    this.Ani.Flipped = this.Hspeed < 0;
                }
                if (this.invincibilitytime > 0) {
                    //Ani.Alpha = Ani.Alpha == 0 ? 1 : 0;
                    if ((this.frame & 1) > 0) {
                        this.Visible = !this.Visible;
                    }
                    this.invincibilitytime -= 1;
                } else {
                    this.Visible = true;
                }
                this.frame = (this.frame + 1) | 0;
            },
            PlaceBlock: function () {
                var price = 1000 * this.blockprice;
                if (this.Game.timeRemaining < this.blockprice) {
                    return;
                }
                var W = this.Width / 3;
                var Y = this.Height;
                var T = this.Game.TM.CheckForTile(CirnoGame.Vector2.Add$1(this.Position, this.Width / 2, Y));
                if (T != null && (!T.enabled || !T.solid)) {
                    T.solid = true;
                    T.Breakable = true;
                    T.enabled = true;
                    T.texture = 4;
                    T.UpdateTile();
                    T.HP = T.maxHP * 2;
                    this.Game.timeRemaining -= price;
                }
            },
            ChangeAni: function (animation, reset) {
                if (reset === void 0) { reset = false; }
                if (Bridge.referenceEquals(this.animation, animation)) {
                    return;
                }
                if (this.Ani == null) {
                    this.Ani = new CirnoGame.Animation(CirnoGame.AnimationLoader.Get(System.String.concat("images/cirno/", animation)));
                } else {
                    this.Ani.ChangeAnimation(CirnoGame.AnimationLoader.Get(System.String.concat("images/cirno/", animation)), reset);
                }
                if (!Bridge.referenceEquals(this.animation, "stand")) {
                    this.turntime = 0;
                }
                this.animation = animation;
            },
            UpdateController: function () {
                this.newInput = false;
                var i = 0;
                while (i < this.Controller.length) {
                    this.tapTimer[System.Array.index(i, this.tapTimer)] = (this.tapTimer[System.Array.index(i, this.tapTimer)] + 1) | 0;
                    if (this.Controller[System.Array.index(i, this.Controller)] && !this.LController[System.Array.index(i, this.LController)]) {
                        this.tapTimer[System.Array.index(i, this.tapTimer)] = 0;
                        this.newInput = true;
                    }
                    this.LController[System.Array.index(i, this.LController)] = this.Controller[System.Array.index(i, this.Controller)];
                    i = (i + 1) | 0;
                }
                /* if (_lAimAngle != _aimAngle)
                {
                   newInput = true;
                }
                _lAimAngle = _aimAngle;*/
                if (this.newInput) {
                    //GetBehavior<NetworkSync>().Sync();
                }
            },
            onDamaged: function (source, amount) {
                //throw new NotImplementedException();
                if (this.invincibilitytime <= 0) {
                    this.HP -= (amount / this.defensepower);
                    this.invincibilitytime = 45 * this.invincibilitymod;
                }
            },
            onRemove: function () {
                CirnoGame.PlatformerEntity.prototype.onRemove.call(this);
                this.Game.RemoveEntity(this.MSG);
            },
            onDeath: function (source) {
                //throw new NotImplementedException();
                this.invincibilitytime *= 3.0;

                if (Bridge.referenceEquals(this.Game.player, this)) {
                    if (this.Game.timeRemaining > 0) {
                        this.Position.CopyFrom(this.SpawnLocation);
                        this.HP = this.maxHP;
                        this.Game.timeRemaining *= 0.6667;
                    } else {
                        this.Game.DoGameOver();
                    }
                } else {
                    this.Position.CopyFrom(this.SpawnLocation);
                    this.HP = this.maxHP;
                }
            },
            onKill: function (combatant) {
                //throw new NotImplementedException();
            },
            GetHitbox: function () {
                //return base.GetHitbox();
                if (this.Ani != null && this.Ani.CurrentImage != null) {
                    /* var size = 4;
                    var W = Ani.CurrentImage.Width / size;
                    var H = Ani.CurrentImage.Height / size;
                    var W4 = (Ani.CurrentImage.Width / 2) - (W / 2);
                    var H4 = (Ani.CurrentImage.Height / 2) - (H / 2);
                    return new Rectangle(Ani.X+W4, Ani.Y+H4, W, H);*/
                    return new CirnoGame.Rectangle(this.Ani.X + (this.Ani.CurrentImage.width / 2.0), this.Ani.Y + (this.Ani.CurrentImage.height / 2.0), 1, 1);
                }
                return null;
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDaXJub0dhbWUuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkdhbWVNb2RlLmNzIiwiRW50aXR5QmVoYXZpb3IuY3MiLCJBbmltYXRpb24uY3MiLCJBbmltYXRpb25Mb2FkZXIuY3MiLCJBcHAuY3MiLCJBdWRpby5jcyIsIkF1ZGlvTWFuYWdlci5jcyIsIkJ1dHRvbk1lbnUuY3MiLCJTcHJpdGUuY3MiLCJCdXR0b25TcHJpdGUuY3MiLCJDYW1lcmEuY3MiLCJFbnRpdHkuY3MiLCJHYW1lcGFkLmNzIiwiR2FtZVBhZEJ1dHRvbi5jcyIsIkdhbWVQYWRNYW5hZ2VyLmNzIiwiR2FtZVBsYXlTZXR0aW5ncy5jcyIsIkhlbHBlci5jcyIsIkhlbHBlckV4dGVuc2lvbnMuY3MiLCJJbnB1dENvbnRyb2xsZXJzLmNzIiwiSW5wdXRDb250cm9sbGVyTWFuYWdlci5jcyIsIklucHV0TWFwLmNzIiwiSlNPTkFyY2hpdmUuY3MiLCJLZXlib2FyZE1hbmFnZXIuY3MiLCJNYXBHZW5lcmF0b3IuY3MiLCJNYXBSb29tLmNzIiwiTWF0aEhlbHBlci5jcyIsIlBvaW50LmNzIiwiUmVjdGFuZ2xlLmNzIiwiUmVjdGFuZ2xlSS5jcyIsIlJlbmRlcmVyLmNzIiwiVGlsZURhdGEuY3MiLCJUaWxlTWFwLmNzIiwiVmVjdG9yMi5jcyIsIkJlaGF2aW9ycy9BaW1lZFNob290ZXIuY3MiLCJDaGVzdC5jcyIsIkNvbGxlY3RhYmxlSXRlbS5jcyIsIkNvbnRyb2xsYWJsZUVudGl0eS5jcyIsIkV4aXREb29yLmNzIiwiQmVoYXZpb3JzL0ZsaWdodENvbnRyb2xzLmNzIiwiRmxvYXRpbmdNZXNzYWdlLmNzIiwiUGFydGljbGUuY3MiLCJCZWhhdmlvcnMvUGxhdGZvcm1lckNvbnRyb2xzLmNzIiwiUGxheWVyQnVsbGV0LmNzIiwiQmVoYXZpb3JzL1JhbmRvbUFJLmNzIiwiUm9vbU9wZW5pbmdMZXZlci5jcyIsIlRleHRTcHJpdGUuY3MiLCJUaWxlLmNzIiwiVGl0bGVTY3JlZW4uY3MiLCJEb29yS2V5LmNzIiwiR2FtZS5jcyIsIkhlYWxpbmdJdGVtLmNzIiwiS2V5SXRlbS5jcyIsIlBsYXRmb3JtZXJFbnRpdHkuY3MiLCJPcmIuY3MiLCJQb2ludEl0ZW0uY3MiLCJFbmVtaWVzL01SR2hvc3R5LmNzIiwiUGxheWVyQ2hhcmFjdGVyLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OENBeUN3REE7b0JBRTVDQSxPQUFPQSxLQUFJQSw4REFBZUEsNEJBQXlEQSxvQ0FBVUEsQUFBd0RBO21DQUFLQSxlQUFjQTs7OzZDQUduSUE7b0JBRXJDQSxVQUFVQSxLQUFJQSw4REFBZUEsNEJBQXlEQSxvQ0FBVUEsQUFBd0RBO21DQUFLQSwrQkFBVUE7O29CQUN2S0EsSUFBSUE7d0JBQ0FBLE9BQU9BOztvQkFDWEEsT0FBT0E7OztvQkEwQlBBLElBQUlBLGlDQUFjQTt3QkFFZEEsK0JBQVlBLEtBQUlBO3dCQUNoQkEsZ0NBQWFBLElBQUlBO3dCQUNqQkE7d0JBQ0FBLGdDQUFhQSxJQUFJQTt3QkFDakJBO3dCQUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBOUJXQTs7Z0JBRWZBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQSxZQUFPQTtnQkFDUEEsZ0JBQVdBO2dCQUNYQSxtQkFBY0EsaURBQTZCQTtnQkFDM0NBO2dCQUNBQSxpQ0FBY0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJDbkRJQTs7Z0JBRWxCQSxjQUFjQTtnQkFDZEEsSUFBSUEsaURBQXNCQSxxQkFBZ0JBO29CQUV0Q0EsV0FBZUE7b0JBQ2ZBLFNBQVNBOztvQkFFVEEsUUFBYUE7b0JBQ2JBLG9CQUFlQSxxQkFBRUEsc0JBQUZBOzs7Ozs7Ozs7Ozs0QkFVRUE7dUNBR0dBLEtBQWFBOztnQkFFckNBLFFBQVlBO2dCQUNaQSxNQUFNQTtnQkFDTkEsTUFBTUE7O2dCQUVOQSxNQUFNQTtnQkFDTkEsa0NBQTZCQSxHQUFHQTs7bUNB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QUFrQkE7O2dCQUVwQ0EsSUFBSUEsdUNBQWtCQTtvQkFFbEJBOztnQkFFSkEsSUFBSUEsWUFBT0E7b0JBRVBBLFdBQU1BLElBQUlBLG9CQUFVQSw4QkFBb0JBLHNDQUFrQkE7O29CQUkxREEseUJBQW9CQSw4QkFBb0JBLHNDQUFrQkEsYUFBWUE7O2dCQUUxRUEsSUFBSUE7b0JBRUFBOztnQkFFSkEsaUJBQWlCQTs7O2dCQUlqQkE7Z0JBQ0FBO2dCQUNBQSxPQUFPQSxJQUFJQTtvQkFFUEEsaUNBQVNBLEdBQVRBLG9EQUFTQSxHQUFUQTtvQkFDQUEsSUFBSUEsbUNBQVdBLEdBQVhBLHFCQUFpQkEsQ0FBQ0Esb0NBQVlBLEdBQVpBO3dCQUVsQkEsaUNBQVNBLEdBQVRBO3dCQUNBQTs7b0JBRUpBLG9DQUFZQSxHQUFaQSxxQkFBaUJBLG1DQUFXQSxHQUFYQTtvQkFDakJBOzs7Ozs7O2dCQU9KQSxJQUFJQTs7OztpQ0FNY0EsUUFBdUJBOztnQkFHekNBLElBQUlBO29CQUVBQSxXQUFNQSxDQUFDQSxTQUFTQTtvQkFDaEJBLHlCQUFvQkEsS0FBR0E7Ozs7Z0JBSzNCQTtnQkFDQUEsdUJBQWtCQTs7K0JBR0ZBOztnQkFHaEJBOztnQkFFQUEsSUFBSUEseUNBQWVBO29CQUVmQSxJQUFJQTt3QkFFQUEsdUJBQWtCQTt3QkFDbEJBLFVBQUtBO3dCQUNMQTs7d0JBSUFBOzs7b0JBS0pBLHVCQUFrQkE7b0JBQ2xCQSxVQUFLQTs7OzhCQUlNQTs7Ozs7Z0JBT2ZBLElBQUlBLFlBQU9BLFFBQVFBLHlCQUFvQkE7Ozs7Ozs7b0JBUW5DQSxPQUFPQSxJQUFJQSxvQkFBVUEsYUFBUUEsQ0FBQ0Esb0NBQThCQSxhQUFRQSxDQUFDQTs7Z0JBRXpFQSxPQUFPQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBbUHJpb3JpdHkoMSldXHJcbiAgICBwdWJsaWMgY2xhc3MgR2FtZU1vZGVcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZW51bSBNb2RlVHlwZXNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFNpbmdsZSAmIE11bHRpcGxheWVyLCBqdXN0IGEgZ2VuZXJhbCBnYW1lLlxyXG4gICAgICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICBTa2lybWlzaCxcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gU2luZ2xlcGxheWVyLCBnYW1lcGxheSBpcyBjaGFuZ2VkIHVwIHdpdGggYSBtb2RlIHNwZWNpZmljIHRhc2suXHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIENoYWxsZW5nZSxcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gTGlrZSBjaGFsbGVuZ2UsIGJ1dCBpcyBkZXNpZ25lZCBmb3IgbXVsdGlwbGUgaHVtYW4gcGxheWVycy5cclxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgQ2FsbGVuZ2VDb29wXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBUZWFtcyB7IGdldDsgcHJvdGVjdGVkIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgU3RhcnRpbmdMaXZlcyB7IGdldDsgcHJvdGVjdGVkIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIFN1cnZpdmFsIHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgQWxsb3dPbmxpbmVQbGF5IHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgQWxsb3dDaGFyYWN0ZXJTZWxlY3QgeyBnZXQ7IHByb3RlY3RlZCBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IE51bWJlck9mUGxheWVycyB7IGdldDsgcHJvdGVjdGVkIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgUmVzcGF3blRpbWUgeyBnZXQ7IHByb3RlY3RlZCBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIE5hbWUgeyBnZXQ7IHByb3RlY3RlZCBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgTW9kZVR5cGVzIE1vZGVUeXBlIHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgdW5sb2NrZWQgeyBnZXQ7IHByb3RlY3RlZCBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIERlc2NyaXB0aW9uIHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTGlzdDxHYW1lTW9kZT4gR2V0R2FtZU1vZGVzT2ZUeXBlKE1vZGVUeXBlcyB0eXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBMaXN0PEdhbWVNb2RlPihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6Q2lybm9HYW1lLkdhbWVNb2RlPihnYW1lTW9kZXMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpDaXJub0dhbWUuR2FtZU1vZGUsIGJvb2w+KShHID0+IEcuTW9kZVR5cGUgPT0gdHlwZSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR2FtZU1vZGUgR2V0R2FtZU1vZGVCeU5hbWUoc3RyaW5nIG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gbmV3IExpc3Q8R2FtZU1vZGU+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpDaXJub0dhbWUuR2FtZU1vZGU+KGdhbWVNb2RlcywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkNpcm5vR2FtZS5HYW1lTW9kZSwgYm9vbD4pKEcgPT4gRy5OYW1lID09IG5hbWUpKSk7XHJcbiAgICAgICAgICAgIGlmIChyZXQuQ291bnQgPiAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldFswXTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgR2FtZU1vZGUoc3RyaW5nIG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBUZWFtcyA9IHRydWU7XHJcbiAgICAgICAgICAgIFN0YXJ0aW5nTGl2ZXMgPSAzO1xyXG4gICAgICAgICAgICBTdXJ2aXZhbCA9IHRydWU7XHJcbiAgICAgICAgICAgIEFsbG93T25saW5lUGxheSA9IHRydWU7XHJcbiAgICAgICAgICAgIEFsbG93Q2hhcmFjdGVyU2VsZWN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgTnVtYmVyT2ZQbGF5ZXJzID0gNjtcclxuICAgICAgICAgICAgUmVzcGF3blRpbWUgPSAzOTA7XHJcbiAgICAgICAgICAgIE5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICBNb2RlVHlwZSA9IEdhbWVNb2RlLk1vZGVUeXBlcy5Ta2lybWlzaDtcclxuICAgICAgICAgICAgRGVzY3JpcHRpb24gPSBcIk1pc3NpbmcgZGVzY3JpcHRpb24gZm9yIFwiICsgbmFtZTtcclxuICAgICAgICAgICAgdW5sb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBnYW1lTW9kZXMuQWRkKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEdhbWVNb2RlIFRlYW1CYXR0bGU7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBHYW1lTW9kZSBEZWF0aE1hdGNoO1xyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aWMgTGlzdDxHYW1lTW9kZT4gZ2FtZU1vZGVzO1xyXG5cclxuICAgICAgICAvL1tJbml0XVxyXG4gICAgICAgIFtSZWFkeV1cclxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGljIHZvaWQgaW5pdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVGVhbUJhdHRsZSA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBnYW1lTW9kZXMgPSBuZXcgTGlzdDxHYW1lTW9kZT4oKTtcclxuICAgICAgICAgICAgICAgIFRlYW1CYXR0bGUgPSBuZXcgR2FtZU1vZGUoXCJUZWFtIEJhdHRsZVwiKTtcclxuICAgICAgICAgICAgICAgIFRlYW1CYXR0bGUuRGVzY3JpcHRpb24gPSBcIjIgdGVhbXMgYmF0dGxlIHdpdGggbGltaXRlZCBsaXZlc1xcbnVudGlsIG9ubHkgMSB0ZWFtIHJlbWFpbnMuXCI7XHJcbiAgICAgICAgICAgICAgICBEZWF0aE1hdGNoID0gbmV3IEdhbWVNb2RlKFwiRGVhdGggTWF0Y2hcIik7XHJcbiAgICAgICAgICAgICAgICBEZWF0aE1hdGNoLkRlc2NyaXB0aW9uID0gXCJBIGZyZWUgZm9yIGFsbCBtYXRjaCB3aXRoXFxubGltaXRlZCBsaXZlcy5cIjtcclxuICAgICAgICAgICAgICAgIERlYXRoTWF0Y2guVGVhbXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRW50aXR5QmVoYXZpb3JcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbCBlbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgaW50IEZyYW1lc1BlclRpY2sgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBFbnRpdHkgZW50aXR5O1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgQmVoYXZpb3JOYW1lIHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIEVudGl0eUJlaGF2aW9yKEVudGl0eSBlbnRpdHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcclxuICAgICAgICAgICAgaWYgKEJlaGF2aW9yTmFtZSA9PSBcIlwiIHx8IEJlaGF2aW9yTmFtZSA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkeW5hbWljIHRlc3QgPSBHZXRUeXBlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgRk4gPSBTY3JpcHQuV3JpdGU8c3RyaW5nPihcInRlc3RbXFxcIiQkZnVsbG5hbWVcXFwiXVwiKTtcclxuICAgICAgICAgICAgICAgIC8vSGVscGVyLkxvZyhcIkZOOlwiICsgRk4pO1xyXG4gICAgICAgICAgICAgICAgc3RyaW5nW10gcyA9IEZOLlNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgICAgIEJlaGF2aW9yTmFtZSA9IHNbcy5MZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIC8vQmVoYXZpb3JOYW1lID0gR2V0VHlwZSgpLkZ1bGxOYW1lO1xyXG4gICAgICAgICAgICAgICAgLy9HZXRUeXBlKCkuR2V0Q2xhc3NOYW1lXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIERyYXcoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcpXHJcbiAgICAgICAge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZW5kQ3VzdG9tRXZlbnQoZHluYW1pYyBldnQsIGJvb2wgdHJpZ2dlcmZsdXNoID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkeW5hbWljIEQgPSBuZXcgb2JqZWN0KCk7XHJcbiAgICAgICAgICAgIEQuSSA9IGVudGl0eS5JRDtcclxuICAgICAgICAgICAgRC5EID0gZXZ0O1xyXG4gICAgICAgICAgICAvL0QuVCA9IHRoaXMuR2V0VHlwZSgpLkZ1bGxOYW1lO1xyXG4gICAgICAgICAgICBELlQgPSBCZWhhdmlvck5hbWU7XHJcbiAgICAgICAgICAgIGVudGl0eS5HYW1lLlNlbmRFdmVudChcIkNCRVwiLCBELCB0cmlnZ2VyZmx1c2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIEN1c3RvbUV2ZW50KGR5bmFtaWMgZXZ0KVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBbmltYXRpb25cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTGlzdDxIVE1MSW1hZ2VFbGVtZW50PiBJbWFnZXM7XHJcbiAgICAgICAgcHJvdGVjdGVkIEhUTUxJbWFnZUVsZW1lbnQgX2N1cnJlbnRJbWFnZTtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBDdXJyZW50SW1hZ2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2N1cnJlbnRJbWFnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9jdXJyZW50SW1hZ2UgIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQnVmZmVyTmVlZHNSZWRyYXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX2N1cnJlbnRJbWFnZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgQ3VycmVudEZyYW1lO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBJbWFnZVNwZWVkO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFBvc2l0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgQW5pbWF0aW9uVGltZUVsYXBzZWQ7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFhcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUG9zaXRpb24uWDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24uWCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uLlkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgU3RyZXRjaFdpZHRoID0gMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgU3RyZXRjaEhlaWdodCA9IDA7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFJvdGF0aW9uID0gMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgQWxwaGEgPSAxO1xyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBMb29waW5nID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgYm9vbCBMb29wZWQgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgYm9vbCBGcmFtZUNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgYm9vbCBGbGlwcGVkID0gZmFsc2U7XHJcbiAgICAgICAgcHJvdGVjdGVkIGJvb2wgX3RyYW5zZm9ybWVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBmbG9hdCBfc2hhZG93O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBTaGFkb3dcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9zaGFkb3cgIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3NoYWRvdyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIEJ1ZmZlck5lZWRzUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc3RyaW5nIF9zaGFkb3dDb2xvcjtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIFNoYWRvd2NvbG9yXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zaGFkb3dDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9zaGFkb3dDb2xvciAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfc2hhZG93Q29sb3IgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBCdWZmZXJOZWVkc1JlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBib29sIEJ1ZmZlck5lZWRzUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgICBwcm90ZWN0ZWQgc3RyaW5nIF9odWVDb2xvcjtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIEh1ZUNvbG9yXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9odWVDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9odWVDb2xvciAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBCdWZmZXJOZWVkc1JlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfaHVlQ29sb3IgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGZsb2F0IF9odWVSZWNvbG9yU3RyZW5ndGg7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IEh1ZVJlY29sb3JTdHJlbmd0aFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfaHVlUmVjb2xvclN0cmVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2h1ZVJlY29sb3JTdHJlbmd0aCAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBCdWZmZXJOZWVkc1JlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfaHVlUmVjb2xvclN0cmVuZ3RoID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBIVE1MQ2FudmFzRWxlbWVudCBfYnVmZmVyO1xyXG4gICAgICAgIHByb3RlY3RlZCBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgX2JnO1xyXG5cclxuICAgICAgICBwdWJsaWMgQW5pbWF0aW9uKExpc3Q8SFRNTEltYWdlRWxlbWVudD4gZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEltYWdlcyA9IGRhdGE7XHJcbiAgICAgICAgICAgIGlmIChJbWFnZXMgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSW1hZ2VzID0gbmV3IExpc3Q8SFRNTEltYWdlRWxlbWVudD4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBJbWFnZVNwZWVkID0gMWY7XHJcbiAgICAgICAgICAgIFBvc2l0aW9uID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICAgICAgQW5pbWF0aW9uVGltZUVsYXBzZWQgPSAwO1xyXG4gICAgICAgICAgICBTaGFkb3cgPSAwO1xyXG4gICAgICAgICAgICBTaGFkb3djb2xvciA9IFwiI0ZGRkZGRlwiO1xyXG4gICAgICAgICAgICBIdWVDb2xvciA9IFwiXCI7XHJcbiAgICAgICAgICAgIEh1ZVJlY29sb3JTdHJlbmd0aCA9IDAuNmY7XHJcbiAgICAgICAgICAgIF9idWZmZXIgPSBuZXcgSFRNTENhbnZhc0VsZW1lbnQoKTtcclxuICAgICAgICAgICAgX2JnID0gX2J1ZmZlci5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgaWYgKEltYWdlcy5Db3VudCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNldEltYWdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhUTUxJbWFnZUVsZW1lbnQgTEkgPSBDdXJyZW50SW1hZ2U7XHJcbiAgICAgICAgICAgIGludCBsYXN0ID0gKGludClDdXJyZW50RnJhbWU7XHJcbiAgICAgICAgICAgIEN1cnJlbnRGcmFtZSArPSBJbWFnZVNwZWVkO1xyXG4gICAgICAgICAgICBpbnQgY3VycmVudCA9IChpbnQpQ3VycmVudEZyYW1lO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudCAhPSBsYXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoSW1hZ2VzLkNvdW50ID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY3VycmVudCA+PSBJbWFnZXMuQ291bnQgJiYgY3VycmVudCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTG9vcGluZylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCAtPSBJbWFnZXMuQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDdXJyZW50RnJhbWUgLT0gSW1hZ2VzLkNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3VycmVudEZyYW1lIC09IEltYWdlU3BlZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCArPSBJbWFnZXMuQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEN1cnJlbnRGcmFtZSArPSBJbWFnZXMuQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgU2V0SW1hZ2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTG9vcGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChMSSAhPSBDdXJyZW50SW1hZ2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZyYW1lQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoKEltYWdlU3BlZWQgPiAwICYmIGN1cnJlbnQgPT0gMCkgfHwgKChJbWFnZVNwZWVkIDwgMCAmJiBjdXJyZW50ID09IEltYWdlcy5Db3VudCAtIDEpKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBMb29wZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRnJhbWVDaGFuZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQW5pbWF0aW9uVGltZUVsYXBzZWQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ2hhbmdlQW5pbWF0aW9uKExpc3Q8SFRNTEltYWdlRWxlbWVudD4gYW5pLCBib29sIHJlc2V0ID0gdHJ1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChyZXNldClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ3VycmVudEZyYW1lID0gMDtcclxuICAgICAgICAgICAgICAgIEFuaW1hdGlvblRpbWVFbGFwc2VkID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBJbWFnZXMgPSBhbmk7XHJcbiAgICAgICAgICAgIC8vQ3VycmVudEltYWdlID0gSW1hZ2VzWyhpbnQpQ3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgU2V0SW1hZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgU2V0SW1hZ2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKEltYWdlcy5Db3VudCA8IDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG4gPSBJbWFnZXMuQ291bnQ7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoQ3VycmVudEZyYW1lIDwgMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDdXJyZW50RnJhbWUgKz0gbG47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoQ3VycmVudEZyYW1lID49IGxuKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEN1cnJlbnRGcmFtZSAtPSBsbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbnQgY3VycmVudCA9IChpbnQpQ3VycmVudEZyYW1lO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudCA+PSAwICYmIGN1cnJlbnQgPCBJbWFnZXMuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEN1cnJlbnRJbWFnZSA9IEltYWdlc1tjdXJyZW50XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRHJhdyhnLCBQb3NpdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXcoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcsIFZlY3RvcjIgcG9zaXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCB4ID0gcG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgeSA9IHBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGlmIChDdXJyZW50SW1hZ2UgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50IGN1cnJlbnQgPSAoaW50KUN1cnJlbnRGcmFtZTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID49IDAgJiYgY3VycmVudCA8IEltYWdlcy5Db3VudClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDdXJyZW50SW1hZ2UgPSBJbWFnZXNbY3VycmVudF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoQ3VycmVudEltYWdlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZsb2F0IFggPSB4O1xyXG4gICAgICAgICAgICBmbG9hdCBZID0geTtcclxuICAgICAgICAgICAgZmxvYXQgbGFzdGFscGhhID0gZy5HbG9iYWxBbHBoYTtcclxuICAgICAgICAgICAgYm9vbCBjZW50ZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBib29sIHVzZUJ1ZmZlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoSHVlQ29sb3IgIT0gXCJcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEJ1ZmZlck5lZWRzUmVkcmF3KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvb2wgYWR2ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBfYmcuR2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gQ2FudmFzVHlwZXMuQ2FudmFzQ29tcG9zaXRlT3BlcmF0aW9uVHlwZS5Tb3VyY2VPdmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIF9idWZmZXIuV2lkdGggPSBDdXJyZW50SW1hZ2UuV2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1ZmZlci5IZWlnaHQgPSBDdXJyZW50SW1hZ2UuSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5EcmF3SW1hZ2UoQ3VycmVudEltYWdlLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5HbG9iYWxBbHBoYSA9IEh1ZVJlY29sb3JTdHJlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBfYmcuR2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gQ2FudmFzVHlwZXMuQ2FudmFzQ29tcG9zaXRlT3BlcmF0aW9uVHlwZS5IdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgX2JnLkZpbGxTdHlsZSA9IEh1ZUNvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5GaWxsUmVjdCgwLCAwLCBfYnVmZmVyLldpZHRoLCBfYnVmZmVyLkhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhZHYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYmcuR2xvYmFsQWxwaGEgPSAoMSArIEh1ZVJlY29sb3JTdHJlbmd0aCkgLyAyZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2JnLkdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IENhbnZhc1R5cGVzLkNhbnZhc0NvbXBvc2l0ZU9wZXJhdGlvblR5cGUuU291cmNlT3ZlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2JnLkZpbGxSZWN0KDAsIDAsIF9idWZmZXIuV2lkdGgsIF9idWZmZXIuSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5HbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFkdilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iZy5HbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBDYW52YXNUeXBlcy5DYW52YXNDb21wb3NpdGVPcGVyYXRpb25UeXBlLkx1bWlub3NpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iZy5EcmF3SW1hZ2UoQ3VycmVudEltYWdlLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJ0aGlzLl9iZy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24taW4nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5EcmF3SW1hZ2UoQ3VycmVudEltYWdlLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhZHYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYmcuR2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gQ2FudmFzVHlwZXMuQ2FudmFzQ29tcG9zaXRlT3BlcmF0aW9uVHlwZS5IdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iZy5HbG9iYWxBbHBoYSA9IEh1ZVJlY29sb3JTdHJlbmd0aCAqIDAuNGY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iZy5EcmF3SW1hZ2UoQ3VycmVudEltYWdlLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB1c2VCdWZmZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChBbHBoYSA8IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChBbHBoYSA8PSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGcuR2xvYmFsQWxwaGEgPSBnLkdsb2JhbEFscGhhICogQWxwaGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9pZiAocm90YXRpb24gIT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgeDIgPSBDdXJyZW50SW1hZ2UuV2lkdGggLyAyZjtcclxuICAgICAgICAgICAgICAgIGZsb2F0IHkyID0gQ3VycmVudEltYWdlLkhlaWdodCAvIDJmO1xyXG5cclxuICAgICAgICAgICAgICAgIFggPSAteDI7XHJcbiAgICAgICAgICAgICAgICBZID0gLXkyO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFfdHJhbnNmb3JtZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZy5TYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RyYW5zZm9ybWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGcuVHJhbnNsYXRlKHggKyB4MiwgeSArIHkyKTtcclxuICAgICAgICAgICAgICAgIGNlbnRlcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGcuUm90YXRlKFJvdGF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoRmxpcHBlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFfdHJhbnNmb3JtZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZy5TYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RyYW5zZm9ybWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGcuU2NhbGUoLTEsIDEpO1xyXG4gICAgICAgICAgICAgICAgLy9kb24ndCB0cmFuc2xhdGUgaWYgaXQncyBjZW50ZXJlZC5cclxuICAgICAgICAgICAgICAgIGlmICghY2VudGVyZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZy5UcmFuc2xhdGUoQ3VycmVudEltYWdlLldpZHRoLCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoU2hhZG93ID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZy5TaGFkb3dCbHVyID0gU2hhZG93O1xyXG4gICAgICAgICAgICAgICAgZy5TaGFkb3dDb2xvciA9IFNoYWRvd2NvbG9yO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF1c2VCdWZmZXIgJiYgQnVmZmVyTmVlZHNSZWRyYXcpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2JnLlNoYWRvd0JsdXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIF9idWZmZXIuV2lkdGggPSBDdXJyZW50SW1hZ2UuV2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1ZmZlci5IZWlnaHQgPSBDdXJyZW50SW1hZ2UuSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5EcmF3SW1hZ2UoQ3VycmVudEltYWdlLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZUJ1ZmZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9CdWZmZXJOZWVkc1JlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB1c2VCdWZmZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy9pZiAoKHVzZUJ1ZmZlciAmJiBCdWZmZXJOZWVkc1JlZHJhdykgfHwgUm90YXRpb24hPTAgfHwgdHJ1ZSlcclxuICAgICAgICAgICAgICAgIGlmIChCdWZmZXJOZWVkc1JlZHJhdylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBDID0gSGVscGVyLkNsb25lQ2FudmFzKF9idWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBDRyA9IEhlbHBlci5HZXRDb250ZXh0KEMpO1xyXG4gICAgICAgICAgICAgICAgICAgIF9idWZmZXIuV2lkdGggKz0gKGludCkoU2hhZG93ICogMik7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1ZmZlci5IZWlnaHQgKz0gKGludCkoU2hhZG93ICogMik7XHJcbiAgICAgICAgICAgICAgICAgICAgX2JnLlNoYWRvd0JsdXIgPSBTaGFkb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgX2JnLlNoYWRvd0NvbG9yID0gU2hhZG93Y29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd1dpdGhTaGFkb3dzKF9iZywgQywgU2hhZG93LCBTaGFkb3csIDAsIDAsIFNoYWRvdyAvIDNmKTtcclxuICAgICAgICAgICAgICAgICAgICB1c2VCdWZmZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgWCAtPSBTaGFkb3c7XHJcbiAgICAgICAgICAgICAgICBZIC09IFNoYWRvdztcclxuICAgICAgICAgICAgICAgIGcuU2hhZG93Qmx1ciA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChTdHJldGNoV2lkdGggPT0gMCAmJiBTdHJldGNoSGVpZ2h0ID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChTaGFkb3cgPiAwICYmIGZhbHNlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWMgSSA9IEN1cnJlbnRJbWFnZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlQnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBJID0gX2J1ZmZlcjtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3V2l0aFNoYWRvd3MoZywgSSwgWCwgWSwgMCwgMCwgU2hhZG93IC8gMyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnLkRyYXdJbWFnZShDdXJyZW50SW1hZ2UsIFgsIFkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnLkRyYXdJbWFnZShfYnVmZmVyLCBYLCBZKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoU2hhZG93ID4gMCAmJiBmYWxzZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkeW5hbWljIEkgPSBDdXJyZW50SW1hZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZUJ1ZmZlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgSSA9IF9idWZmZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd1dpdGhTaGFkb3dzKGcsIEksIFgsIFksIFN0cmV0Y2hXaWR0aCwgU3RyZXRjaEhlaWdodCwgU2hhZG93IC8gMyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnLkRyYXdJbWFnZShDdXJyZW50SW1hZ2UsIFgsIFksIFN0cmV0Y2hXaWR0aCwgU3RyZXRjaEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGcuRHJhd0ltYWdlKF9idWZmZXIsIFgsIFksIFN0cmV0Y2hXaWR0aCwgU3RyZXRjaEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfdHJhbnNmb3JtZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGcuUmVzdG9yZSgpO1xyXG4gICAgICAgICAgICAgICAgX3RyYW5zZm9ybWVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKFNoYWRvdyA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGcuU2hhZG93Qmx1ciA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKEFscGhhIDwgMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IGxhc3RhbHBoYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBCdWZmZXJOZWVkc1JlZHJhdyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgZHJhd1dpdGhTaGFkb3dzKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnLCBkeW5hbWljIEksIGZsb2F0IFgsIGZsb2F0IFksIGZsb2F0IFcsIGZsb2F0IEgsIGZsb2F0IHNpemUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVyA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXID0gSS53aWR0aDtcclxuICAgICAgICAgICAgICAgIEggPSBJLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnLlNoYWRvd09mZnNldFggPSAtc2l6ZTtcclxuICAgICAgICAgICAgZy5EcmF3SW1hZ2UoSSwgWCwgWSwgVywgSCk7XHJcbiAgICAgICAgICAgIGcuU2hhZG93T2Zmc2V0WCA9IHNpemU7XHJcbiAgICAgICAgICAgIGcuRHJhd0ltYWdlKEksIFgsIFksIFcsIEgpO1xyXG4gICAgICAgICAgICBnLlNoYWRvd09mZnNldFggPSAwO1xyXG4gICAgICAgICAgICBnLlNoYWRvd09mZnNldFkgPSAtc2l6ZTtcclxuICAgICAgICAgICAgZy5EcmF3SW1hZ2UoSSwgWCwgWSwgVywgSCk7XHJcbiAgICAgICAgICAgIGcuU2hhZG93T2Zmc2V0WSA9IHNpemU7XHJcbiAgICAgICAgICAgIGcuRHJhd0ltYWdlKEksIFgsIFksIFcsIEgpO1xyXG5cclxuICAgICAgICAgICAgZy5TaGFkb3dPZmZzZXRZID0gMDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQW5pbWF0aW9uTG9hZGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHJvdGVjdGVkIERpY3Rpb25hcnk8c3RyaW5nLCBMaXN0PEhUTUxJbWFnZUVsZW1lbnQ+PiBfZGF0YTtcclxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGljIEFuaW1hdGlvbkxvYWRlciBfX3RoaXM7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBBbmltYXRpb25Mb2FkZXIgX3RoaXNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX190aGlzID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX190aGlzID0gbmV3IEFuaW1hdGlvbkxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJBbmltYXRpb24gbG9hZGVyIG5vdCBpbml0aWF0ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgSlNPTkFyY2hpdmUgQXJjaGl2ZTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgSW5pdChKU09OQXJjaGl2ZSBBcmNoaXZlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX190aGlzID0gbmV3IEFuaW1hdGlvbkxvYWRlcigpO1xyXG4gICAgICAgICAgICBfX3RoaXMuQXJjaGl2ZSA9IEFyY2hpdmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQW5pbWF0aW9uTG9hZGVyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9kYXRhID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBMaXN0PEhUTUxJbWFnZUVsZW1lbnQ+PigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8SFRNTEltYWdlRWxlbWVudD4gR2V0KHN0cmluZyBhbmkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuR2V0QW5pbWF0aW9uKGFuaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBMaXN0PEhUTUxJbWFnZUVsZW1lbnQ+IEdldEFuaW1hdGlvbihzdHJpbmcgYW5pKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9kYXRhLkNvbnRhaW5zS2V5KGFuaSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfZGF0YVthbmldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBBID0gbmV3IExpc3Q8SFRNTEltYWdlRWxlbWVudD4oKTtcclxuICAgICAgICAgICAgdmFyIEkgPSBBcmNoaXZlLkdldEltYWdlKGFuaSArIFwiLnBuZ1wiKTtcclxuICAgICAgICAgICAgaWYgKEkgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQS5BZGQoSSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgU2FuaSA9IGFuaSArIFwiX1wiO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgSSA9IEFyY2hpdmUuR2V0SW1hZ2UoU2FuaSArIChqKyspICsgXCIucG5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChJID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgQS5BZGQoSSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvKmRvXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgSSA9IEFyY2hpdmUuR2V0SW1hZ2UoYW5pICsgXCJfXCIgKyBqICsgXCIucG5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChJICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBLkFkZChJKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChJICE9IG51bGwpOyovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX2RhdGFbYW5pXSA9IEE7XHJcbiAgICAgICAgICAgIHJldHVybiBBO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQXBwXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgRnJhbWUgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgRGl2O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ2FudmFzO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBndWlDYW52YXM7XHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBndWk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBSZWN0YW5nbGUgU2NyZWVuQm91bmRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEpTT05BcmNoaXZlIEpTT047XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgRztcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBUYXJnZXRBc3BlY3Q7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGRvdWJsZSBfbFNpemUgPSAtMTtcclxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGljIGRvdWJsZSBfbWlzc2luZ1RpbWUgPSAwO1xyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aWMgZG91YmxlIF9sVGltZSA9IC0xO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIHRvdGFsVGltZTtcclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIHN0YXRpYyBib29sIF9mcmFtZVJlbmRlcmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aWMgYm9vbCBfZ2FtZVJlbmRlcmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSW5wdXRDb250cm9sbGVyIElDO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR2FtZVNwcml0ZSBDdXJyZW50VmlldztcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgR2FtZU5hbWUgPSBcIkNpcm5vJ3MgTXlzdGVyaW91cyBUb3dlclwiO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nIEdhbWVWZXJzaW9uID0gXCIwLjJcIjtcclxuICAgICAgICAvKiNpZiBERUJVR1xyXG4gICAgICAgICAgICAgICAgcHVibGljIHN0YXRpYyBib29sIERFQlVHID0gdHJ1ZTtcclxuICAgICAgICAjZWxzZVxyXG4gICAgICAgICAgICAgICAgcHVibGljIHN0YXRpYyBib29sIERFQlVHID0gZmFsc2U7XHJcbiAgICAgICAgI2VuZGlmKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgREVCVUcgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL1VTRSBUSEUgSlNPTiBaSVAgQVJDSElWRSBGRUFUVVJFIEZST00gQk5URVNUIEZPUiBMT0FESU5HIElNQUdFUyBBTkQgRklMRVMuXHJcblxyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlLkNzc1RleHQgPSBcIm92ZXJmbG93OiBoaWRkZW47bWFyZ2luOiAwO3BhZGRpbmc6IDA7XCI7XHJcbiAgICAgICAgICAgIEdhbWVQYWRNYW5hZ2VyLl90aGlzID0gbmV3IEdhbWVQYWRNYW5hZ2VyKCk7XHJcbiAgICAgICAgICAgIEdhbWVQYWRNYW5hZ2VyLl90aGlzLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBHbG9iYWwuU2V0VGltZW91dCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBHYW1lUGFkTWFuYWdlci5fdGhpcy5VcGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBJQyA9IElucHV0Q29udHJvbGxlck1hbmFnZXIuX3RoaXMuQ29udHJvbGxlcnNbMF07XHJcbiAgICAgICAgICAgICAgICBJbnB1dE1hcCBJTSA9IElucHV0Q29udHJvbGxlck1hbmFnZXIuX3RoaXMuQ29udHJvbGxlcnNbMF0uSW5wdXRNYXBwaW5nWzJdO1xyXG5cclxuICAgICAgICAgICAgfSksIDUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG9rID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciB1cHRlc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICBKU09OQXJjaGl2ZS5PcGVuKFwiQXNzZXRzL0ltYWdlcy5KU09OXCIsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpDaXJub0dhbWUuSlNPTkFyY2hpdmU+KShqc29uID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEpTT04gPSBqc29uO1xyXG5cclxuICAgICAgICAgICAgICAgIEpTT04uUHJlbG9hZEltYWdlcygoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG9rID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBGaW5pc2goKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWZ0ZXIgYnVpbGRpbmcgKEN0cmwgKyBTaGlmdCArIEIpIHRoaXMgcHJvamVjdCwgXHJcbiAgICAgICAgICAgIC8vIGJyb3dzZSB0byB0aGUgL2Jpbi9EZWJ1ZyBvciAvYmluL1JlbGVhc2UgZm9sZGVyLlxyXG5cclxuICAgICAgICAgICAgLy8gQSBuZXcgYnJpZGdlLyBmb2xkZXIgaXMgY3JlYXRlZCBhbmQgY29udGFpbnNcclxuICAgICAgICAgICAgLy8geW91ciBwcm9qZWN0cyBKYXZhU2NyaXB0IGZpbGVzLiBcclxuXHJcbiAgICAgICAgICAgIC8vIE9wZW4gdGhlIGJyaWRnZS9pbmRleC5odG1sIGZpbGUgaW4gYSBicm93ZXIgYnlcclxuICAgICAgICAgICAgLy8gUmlnaHQtQ2xpY2sgPiBPcGVuIFdpdGguLi4sIHRoZW4gY2hvb3NlIGFcclxuICAgICAgICAgICAgLy8gd2ViIGJyb3dzZXIgZnJvbSB0aGUgbGlzdFxyXG5cclxuICAgICAgICAgICAgLy8gVGhpcyBhcHBsaWNhdGlvbiB3aWxsIHRoZW4gcnVuIGluIGEgYnJvd3Nlci5cclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEZpbmlzaCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBbmltYXRpb25Mb2FkZXIuSW5pdChKU09OKTtcclxuICAgICAgICAgICAgdmFyIExUID0gRG9jdW1lbnQuR2V0RWxlbWVudEJ5SWQoXCJsb2FkdGV4dFwiKS5BczxIVE1MUGFyYWdyYXBoRWxlbWVudD4oKTtcclxuICAgICAgICAgICAgTFQuVGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlLkN1cnNvciA9IEN1cnNvci5BdXRvO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5UaXRsZSA9IEdhbWVOYW1lICsgXCIgXCIgKyBHYW1lVmVyc2lvbiArIFwiIGJ5OlJTR21ha2VyXCI7XHJcbiAgICAgICAgICAgIC8vdmFyIFIgPSBuZXcgUmVuZGVyZXIoKTtcclxuICAgICAgICAgICAgLy9Eb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKFIudmlldyk7XHJcblxyXG4gICAgICAgICAgICBEaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQoKTtcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgQ2FudiA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBDYW52YXMgPSBDYW52O1xyXG4gICAgICAgICAgICBUYXJnZXRBc3BlY3QgPSAwLjc1O1xyXG4gICAgICAgICAgICBDYW52LldpZHRoID0gMTAyNDtcclxuICAgICAgICAgICAgQ2Fudi5IZWlnaHQgPSAoaW50KShDYW52LldpZHRoICogVGFyZ2V0QXNwZWN0KTtcclxuICAgICAgICAgICAgU2NyZWVuQm91bmRzID0gbmV3IFJlY3RhbmdsZSgwLCAwLCBDYW52LldpZHRoLCBDYW52LkhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICBEaXYuQXBwZW5kQ2hpbGQoQ2Fudik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoRGl2KTtcclxuICAgICAgICAgICAgLy9Eb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKENhbnYpO1xyXG4gICAgICAgICAgICBHID0gQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG5cclxuICAgICAgICAgICAgRy5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgQ2FudmFzLlN0eWxlLkltYWdlUmVuZGVyaW5nID0gSW1hZ2VSZW5kZXJpbmcuUGl4ZWxhdGVkO1xyXG4gICAgICAgICAgICB2YXIgZ2cgPSBHO1xyXG4gICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJnZy53ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZVwiKTtcclxuICAgICAgICAgICAgU2NyaXB0LldyaXRlKFwiZ2cubW96SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcIik7XHJcblxyXG5cclxuICAgICAgICAgICAgS2V5Ym9hcmRNYW5hZ2VyLkluaXQoKTtcclxuXHJcbiAgICAgICAgICAgIEN1cnJlbnRWaWV3ID0gbmV3IEdhbWUoKTtcclxuXHJcbiAgICAgICAgICAgIEFjdGlvbiBPbkYgPSBSQUY7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcInJlcXVlc3RBbmltYXRpb25GcmFtZShPbkYpO1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgdXBkYXRlV2luZG93KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRvdWJsZSBzaXplID0gTWF0aC5DZWlsaW5nKFdpbmRvdy5Jbm5lckhlaWdodCAqICgxIC8gVGFyZ2V0QXNwZWN0KSk7XHJcbiAgICAgICAgICAgIGlmIChzaXplICE9IF9sU2l6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2FudmFzLlN0eWxlLldpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgICAgICAgICBEaXYuU3R5bGUuV2lkdGggPSBzaXplICsgXCJweFwiO1xyXG5cclxuICAgICAgICAgICAgICAgIERpdi5TdHlsZS5Qb3NpdGlvbiA9IFBvc2l0aW9uLlJlbGF0aXZlO1xyXG4gICAgICAgICAgICAgICAgRGl2LlN0eWxlLkxlZnQgPSAoKFdpbmRvdy5Jbm5lcldpZHRoIC8gMikgLSAoc2l6ZSAvIDIpKSArIFwicHhcIjtcclxuICAgICAgICAgICAgICAgIHNpemUgPSBfbFNpemU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0YXRpYyB2b2lkIFVwZGF0ZUlucHV0cygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoSUMgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIEwgPSBJbnB1dENvbnRyb2xsZXJNYW5hZ2VyLl90aGlzLkNvbnRyb2xsZXJzO1xyXG4gICAgICAgICAgICAgICAgaWYgKEwuQ291bnQgPiAxKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qTGlzdDxpbnQ+IGtleXMgPSBLZXlib2FyZE1hbmFnZXIuX3RoaXMuVGFwcGVkQnV0dG9ucztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5cy5Db250YWlucygxMDcpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50IGluZGV4ID0gTC5JbmRleE9mKElDKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IEwuQ291bnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4IC09IEwuQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgSUMgPSBMW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleXMuQ29udGFpbnMoMTA5KSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludCBpbmRleCA9IEwuSW5kZXhPZihJQyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ICs9IEwuQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgSUMgPSBMW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBLZXlib2FyZE1hbmFnZXIuVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aWMgdm9pZCBVcGRhdGUoZG91YmxlIHRpbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkb3VibGUgZGVsdGEgPSAwO1xyXG4gICAgICAgICAgICB0b3RhbFRpbWUgPSB0aW1lO1xyXG4gICAgICAgICAgICBpZiAodGltZSA+PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2xUaW1lIDwgMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfbFRpbWUgPSB0aW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vbWlzc2luZ1RpbWUgLT0gMTYuNjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGVsdGEgPSAodGltZSAtIF9sVGltZSk7XHJcbiAgICAgICAgICAgICAgICBfbWlzc2luZ1RpbWUgKz0gKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgIGlmIChDdXJyZW50VmlldyBpcyBHYW1lKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBHID0gKEdhbWUpQ3VycmVudFZpZXc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEcucnVubmluZylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEcudG90YWxUaW1lICs9IChmbG9hdClkZWx0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEcudGltZVJlbWFpbmluZyA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHLnRpbWVSZW1haW5pbmcgLT0gKGZsb2F0KWRlbHRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRy50aW1lUmVtYWluaW5nIDw9IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHLnRpbWVSZW1haW5pbmcgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1cGRhdGVXaW5kb3coKTtcclxuICAgICAgICAgICAgLyppZiAoZGVsdGEgPiAyMilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgTGFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH0qL1xyXG5cclxuICAgICAgICAgICAgaWYgKC8qdXNlUkFGIHx8ICovX21pc3NpbmdUaW1lID4gMTIvKiB8fCAoX2ZyYW1lUmVuZGVyZWQgJiYgX21pc3NpbmdUaW1lID4gMCkqLylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEN1cnJlbnRWaWV3ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ3VycmVudFZpZXcuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgX21pc3NpbmdUaW1lIC09IDE2LjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NztcclxuICAgICAgICAgICAgICAgIF9mcmFtZVJlbmRlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBfZ2FtZVJlbmRlcmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX2xUaW1lID0gdGltZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGltZSA+PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX21pc3NpbmdUaW1lID49IDMwMDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX21pc3NpbmdUaW1lID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChfbWlzc2luZ1RpbWUgPj0gMTAwMDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9HYW1lIGlzIGxhZ2dpbmcgdG9vIG11Y2ggdG8gcHJvcGVybHkgcGxheSBtdWx0aXBsYXllci5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRvdWJsZSBUID0gMTYuNjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRydWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVCArPSA4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKF9taXNzaW5nVGltZSA+PSBUKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChDdXJyZW50VmlldyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ3VycmVudFZpZXcuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF9taXNzaW5nVGltZSAtPSAxNi42NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8vZ2FtZS5SZW5kZXIoKTtcclxuICAgICAgICAgICAgLy9nYW1lLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIF9sVGltZSA9IHRpbWU7XHJcbiAgICAgICAgICAgIEZyYW1lKys7XHJcbiAgICAgICAgICAgIEcuQ2xlYXIoKTtcclxuICAgICAgICAgICAgR2FtZVBhZE1hbmFnZXIuX3RoaXMuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChDdXJyZW50VmlldyAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgQ3VycmVudFZpZXcuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBDdXJyZW50Vmlldy5SZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIEcuRHJhd0ltYWdlKEN1cnJlbnRWaWV3LnNwcml0ZUJ1ZmZlciwgMGYsIDBmLCBDYW52YXMuV2lkdGgsIENhbnZhcy5IZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vRy5GaWxsU3R5bGUgPSBcIlwiK0NvbnZlcnQuIEZyYW1lO1xyXG4gICAgICAgICAgICAvL0cuRmlsbFN0eWxlID0gXCIjXCIgKyBGcmFtZS5Ub1N0cmluZyhcIlg2XCIpO1xyXG4gICAgICAgICAgICAvKkcuRmlsbFN0eWxlID0gXCIjXCIgKyBDb2xvckZyb21BaHNiKDEsKEZyYW1lLzIpICUgMzYwLDAuOGYsMC43ZikuVG9TdHJpbmcoXCJYNlwiKTtcclxuICAgICAgICAgICAgRy5GaWxsUmVjdCgwLCAwLCBHLkNhbnZhcy5XaWR0aCwgRy5DYW52YXMuSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIEcuRmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICAgICAgdmFyIHggPSAoKDAgKyBGcmFtZSAqIDMpICUgKEcuQ2FudmFzLldpZHRoICsgMTAwKSkgLSAxMDA7XHJcbiAgICAgICAgICAgIHZhciB5ID0gKCgwICsgRnJhbWUpICUgKEcuQ2FudmFzLkhlaWdodCArIDEwMCkpIC0gMTAwO1xyXG4gICAgICAgICAgICAvL0cuRmlsbFJlY3QoeCwgeSwgMTAwLCAxMDApO1xyXG5cclxuICAgICAgICAgICAgdmFyIFYgPSBKU09OLkltYWdlcy5WYWx1ZXMuVG9BcnJheSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGltZyA9IFZbKEZyYW1lLzEwKSAlIFYuTGVuZ3RoXTtcclxuICAgICAgICAgICAgRy5EcmF3SW1hZ2UoaW1nLCB4LCB5LGltZy5XaWR0aCo0LGltZy5IZWlnaHQgKiA0KTsqL1xyXG4gICAgICAgICAgICBVcGRhdGVJbnB1dHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBSQUYoKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIEFjdGlvbiBPbkYgPSBSQUY7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcInJlcXVlc3RBbmltYXRpb25GcmFtZShPbkYpO1wiKTtcclxuICAgICAgICAgICAgZG91YmxlIHRpbWUgPSBHbG9iYWwuUGVyZm9ybWFuY2UuTm93KCk7XHJcbiAgICAgICAgICAgIFVwZGF0ZSh0aW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgQ29sb3JGcm9tQWhzYihpbnQgYSwgZmxvYXQgaCwgZmxvYXQgcywgZmxvYXQgYilcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAvKmlmICgwID4gYSB8fCAyNTUgPCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXhjZXB0aW9uKFwiYVwiLCBhLFxyXG4gICAgICAgICAgICAgICAgICBQcm9wZXJ0aWVzLlJlc291cmNlcy5JbnZhbGlkQWxwaGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgwZiA+IGggfHwgMzYwZiA8IGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFeGNlcHRpb24oXCJoXCIsIGgsXHJcbiAgICAgICAgICAgICAgICAgIFByb3BlcnRpZXMuUmVzb3VyY2VzLkludmFsaWRIdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgwZiA+IHMgfHwgMWYgPCBzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXhjZXB0aW9uKFwic1wiLCBzLFxyXG4gICAgICAgICAgICAgICAgICBQcm9wZXJ0aWVzLlJlc291cmNlcy5JbnZhbGlkU2F0dXJhdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKDBmID4gYiB8fCAxZiA8IGIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFeGNlcHRpb24oXCJiXCIsIGIsXHJcbiAgICAgICAgICAgICAgICAgIFByb3BlcnRpZXMuUmVzb3VyY2VzLkludmFsaWRCcmlnaHRuZXNzKTtcclxuICAgICAgICAgICAgfSovXHJcblxyXG4gICAgICAgICAgICBpZiAoMCA9PSBzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL3JldHVybiBDcmVhdGVTaGFkZShiIC8gMjU1LjApO1xyXG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gMHg4MDgwODA7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2hhZGUgPSAoaW50KShiIC8gMjU1LjApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJHQlRvSW50KHNoYWRlLCBzaGFkZSwgc2hhZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBmTWF4LCBmTWlkLCBmTWluO1xyXG4gICAgICAgICAgICBpbnQgaVNleHRhbnQsIGlNYXgsIGlNaWQsIGlNaW47XHJcblxyXG4gICAgICAgICAgICBpZiAoMC41IDwgYilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZk1heCA9IGIgLSAoYiAqIHMpICsgcztcclxuICAgICAgICAgICAgICAgIGZNaW4gPSBiICsgKGIgKiBzKSAtIHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmTWF4ID0gYiArIChiICogcyk7XHJcbiAgICAgICAgICAgICAgICBmTWluID0gYiAtIChiICogcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlTZXh0YW50ID0gKGludClNYXRoLkZsb29yKGggLyA2MGYpO1xyXG4gICAgICAgICAgICBpZiAoMzAwZiA8PSBoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBoIC09IDM2MGY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaCAvPSA2MGY7XHJcbiAgICAgICAgICAgIGggLT0gMmYgKiAoZmxvYXQpTWF0aC5GbG9vcigoKGlTZXh0YW50ICsgMWYpICUgNmYpIC8gMmYpO1xyXG4gICAgICAgICAgICBpZiAoMCA9PSBpU2V4dGFudCAlIDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZNaWQgPSBoICogKGZNYXggLSBmTWluKSArIGZNaW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmTWlkID0gZk1pbiAtIGggKiAoZk1heCAtIGZNaW4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpTWF4ID0gQ29udmVydC5Ub0ludDMyKGZNYXggKiAyNTUpO1xyXG4gICAgICAgICAgICBpTWlkID0gQ29udmVydC5Ub0ludDMyKGZNaWQgKiAyNTUpO1xyXG4gICAgICAgICAgICBpTWluID0gQ29udmVydC5Ub0ludDMyKGZNaW4gKiAyNTUpO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChpU2V4dGFudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSR0JUb0ludChpTWlkLCBpTWF4LCBpTWluKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUkdCVG9JbnQoaU1pbiwgaU1heCwgaU1pZCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJHQlRvSW50KGlNaW4sIGlNaWQsIGlNYXgpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSR0JUb0ludChpTWlkLCBpTWluLCBpTWF4KTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUkdCVG9JbnQoaU1heCwgaU1pbiwgaU1pZCk7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSR0JUb0ludChpTWF4LCBpTWlkLCBpTWluKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBSR0JUb0ludChpbnQgUiwgaW50IEcsIGludCBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIFIgKyAoRyA8PCA4KSArIChCIDw8IDE2KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQXVkaW9cclxuICAgIHtcclxuICAgICAgICBwcm90ZWN0ZWQgQXVkaW9NYW5hZ2VyIF9BTTtcclxuICAgICAgICBwcm90ZWN0ZWQgSFRNTEF1ZGlvRWxlbWVudCBfYXVkaW87XHJcbiAgICAgICAgcHJvdGVjdGVkIGJvb2wgX2hhc1BsYXllZDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIElEIHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIExpc3Q8SFRNTEF1ZGlvRWxlbWVudD4gX2JsYXN0O1xyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgbGFzdHBsYXllZCA9IGRvdWJsZS5OZWdhdGl2ZUluZmluaXR5O1xyXG4gICAgICAgIHB1YmxpYyBib29sIElzUGxheWluZ1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhKCFfaGFzUGxheWVkIHx8IF9hdWRpby5QYXVzZWQgfHwgX2F1ZGlvLkN1cnJlbnRUaW1lID09IDAuMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBQbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgYm9vbCBfbG9vcDtcclxuICAgICAgICBwdWJsaWMgYm9vbCBMb29wXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gX2F1ZGlvLkxvb3A7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2xvb3A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vX2F1ZGlvLkxvb3AgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIF9sb29wID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAvL19hdWRpby5Mb29wID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBDdXJyZW50VGltZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfYXVkaW8uQ3VycmVudFRpbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9hdWRpby5DdXJyZW50VGltZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgVm9sdW1lXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9hdWRpby5Wb2x1bWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9hdWRpby5Wb2x1bWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBQbGF5KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghSXNQbGF5aW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsYXN0dGltZSA9IEN1cnJlbnRUaW1lO1xyXG4gICAgICAgICAgICAgICAgX2F1ZGlvLlBsYXkoKTtcclxuICAgICAgICAgICAgICAgIF9oYXNQbGF5ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBQYXVzZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoSXNQbGF5aW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfYXVkaW8uUGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgU3RvcCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoSXNQbGF5aW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfYXVkaW8uUGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIF9hdWRpby5DdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBBY3Rpb248QXVkaW8+IE9uUGxheTtcclxuICAgICAgICBwdWJsaWMgQWN0aW9uPEF1ZGlvPiBPblN0b3A7XHJcbiAgICAgICAgcHVibGljIEF1ZGlvKEhUTUxBdWRpb0VsZW1lbnQgYXVkaW8sIHN0cmluZyBJRCwgQXVkaW9NYW5hZ2VyIEF1ZGlvTWFuYWdlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9hdWRpbyA9IGF1ZGlvO1xyXG4gICAgICAgICAgICB0aGlzLklEID0gSUQ7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgX0FNID0gQXVkaW9NYW5hZ2VyO1xyXG4gICAgICAgICAgICAvL29iamVjdCBBID0gKCgpID0+IHNlbGYuX09uUGxheSk7XHJcbiAgICAgICAgICAgIC8vQWN0aW9uIEEgPSBuZXcgQWN0aW9uKCgpID0+IHNlbGYuX09uUGxheSgpKTtcclxuXHJcbiAgICAgICAgICAgIF9hdWRpby5PblBsYXkgPSBuZXcgQWN0aW9uKCgpID0+IHNlbGYuX09uUGxheSgpKS5Ub0R5bmFtaWMoKTtcclxuICAgICAgICAgICAgX2F1ZGlvLk9uUGF1c2UgPSBuZXcgQWN0aW9uKCgpID0+IHNlbGYuX09uU3RvcCgpKS5Ub0R5bmFtaWMoKTtcclxuICAgICAgICAgICAgLy9fYXVkaW8uT25FbmRlZCA9IG5ldyBBY3Rpb24oKCkgPT4gc2VsZi5fT25TdG9wKCkpLlRvRHluYW1pYygpO1xyXG4gICAgICAgICAgICBfYXVkaW8uT25FbmRlZCA9IG5ldyBBY3Rpb24oKCkgPT4gc2VsZi5fT25FbmQoKSkuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgIF9hdWRpby5PblRpbWVVcGRhdGUgPSBuZXcgQWN0aW9uKCgpID0+IHNlbGYuX09uVXBkYXRlKCkpLlRvRHluYW1pYygpO1xyXG5cclxuICAgICAgICAgICAgX2JsYXN0ID0gbmV3IExpc3Q8SFRNTEF1ZGlvRWxlbWVudD4oKTtcclxuICAgICAgICAgICAgaW50IG1heHZvaWNlcyA9IDY7XHJcbiAgICAgICAgICAgIGludCB2b2ljZXMgPSAxO1xyXG4gICAgICAgICAgICB3aGlsZSAodm9pY2VzIDwgbWF4dm9pY2VzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfYmxhc3QuQWRkKChIVE1MQXVkaW9FbGVtZW50KV9hdWRpby5DbG9uZU5vZGUoKSk7XHJcbiAgICAgICAgICAgICAgICB2b2ljZXMgKz0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKl9ibGFzdC5BZGQoKEF1ZGlvRWxlbWVudClfYXVkaW8uQ2xvbmVOb2RlKCkpO1xyXG4gICAgICAgICAgICBfYmxhc3QuQWRkKChBdWRpb0VsZW1lbnQpX2F1ZGlvLkNsb25lTm9kZSgpKTtcclxuICAgICAgICAgICAgX2JsYXN0LkFkZCgoQXVkaW9FbGVtZW50KV9hdWRpby5DbG9uZU5vZGUoKSk7XHJcbiAgICAgICAgICAgIF9ibGFzdC5BZGQoKEF1ZGlvRWxlbWVudClfYXVkaW8uQ2xvbmVOb2RlKCkpOyovXHJcbiAgICAgICAgICAgIC8qX2F1ZGlvLk9uUGxheSA9IFwic2VsZi5fT25QbGF5KClcIi5Ub0R5bmFtaWMoKTtcclxuICAgICAgICAgICAgX2F1ZGlvLk9uUGF1c2UgPSBcInNlbGYuX09uU3RvcCgpXCIuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgIF9hdWRpby5PbkVuZGVkID0gXCJzZWxmLl9PblN0b3AoKVwiLlRvRHluYW1pYygpOyovXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQmxhc3QoZmxvYXQgdm9sdW1lID0gMWYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgVCA9IEFwcC50b3RhbFRpbWU7XHJcbiAgICAgICAgICAgIGlmIChUIC0gbGFzdHRpbWUgPCAxNTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjsvL3ByZXZlbnQgYXVkaW8gc3BhbS5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIUlzUGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVm9sdW1lID0gdm9sdW1lO1xyXG4gICAgICAgICAgICAgICAgUGxheSgpO1xyXG4gICAgICAgICAgICAgICAgbGFzdHRpbWUgPSBUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8oKEF1ZGlvRWxlbWVudClfYXVkaW8uQ2xvbmVOb2RlKCkpLlBsYXkoKTtcclxuICAgICAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgX2JsYXN0LkNvdW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEhUTUxBdWRpb0VsZW1lbnQgQSA9IF9ibGFzdFtpXTtcclxuICAgICAgICAgICAgICAgICAgICAvL2lmIChBLlBhdXNlZCB8fCBBLkN1cnJlbnRUaW1lPDAuMTVmIHx8IEEuUGxheWVkLkxlbmd0aD09MClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQS5QYXVzZWQgfHwgQS5DdXJyZW50VGltZSA8IDAuMTBmIHx8IEEuUGxheWVkLkxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEEuUGF1c2VkIHx8IEEuQ3VycmVudFRpbWUgPT0gMC4wIHx8IEEuUGxheWVkLkxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBLlZvbHVtZSA9IHZvbHVtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEEuUGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IF9ibGFzdC5Db3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3R0aW1lID0gVDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgdm9pZCBfT25QbGF5KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9BTS5PblBsYXkodGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChPblBsYXkuVG9EeW5hbWljKCkpXHJcbiAgICAgICAgICAgICAgICBPblBsYXkodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2b2lkIF9PblN0b3AoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX0FNLk9uU3RvcCh0aGlzKTtcclxuICAgICAgICAgICAgaWYgKE9uU3RvcC5Ub0R5bmFtaWMoKSlcclxuICAgICAgICAgICAgICAgIE9uU3RvcCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgX09uRW5kKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8qaWYgKF9sb29wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBQbGF5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSovXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9PblN0b3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZG91YmxlIGxhc3R0aW1lID0gMDtcclxuICAgICAgICBwcm90ZWN0ZWQgdm9pZCBfT25VcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9sb29wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2lmICgoQ3VycmVudFRpbWUrMC4zNSkgPj0gX2F1ZGlvLkR1cmF0aW9uKVxyXG4gICAgICAgICAgICAgICAgaWYgKChDdXJyZW50VGltZSArICgoQ3VycmVudFRpbWUgLSBsYXN0dGltZSkgKiAwLjgpKSA+PSBfYXVkaW8uRHVyYXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIFBsYXkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxhc3R0aW1lID0gQ3VycmVudFRpbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEF1ZGlvTWFuYWdlclxyXG4gICAge1xyXG4gICAgICAgIHByb3RlY3RlZCBEaWN0aW9uYXJ5PHN0cmluZywgQXVkaW8+IGRhdGE7XHJcbiAgICAgICAgcHJvdGVjdGVkIExpc3Q8QXVkaW8+IHBsYXlpbmc7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgRGlyZWN0b3J5ID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEF1ZGlvTWFuYWdlciBfX3RoaXM7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBBdWRpb01hbmFnZXIgX3RoaXNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX190aGlzID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgX190aGlzID0gbmV3IEF1ZGlvTWFuYWdlcigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgSW5pdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoX190aGlzID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBfX3RoaXMgPSBuZXcgQXVkaW9NYW5hZ2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBBdWRpb01hbmFnZXIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQXVkaW8+KCk7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSBuZXcgTGlzdDxBdWRpbz4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEF1ZGlvIEdldChzdHJpbmcgcGF0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBhdGggPSBEaXJlY3RvcnkgKyBwYXRoO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5Db250YWluc0tleShwYXRoKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFbcGF0aF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIVE1MQXVkaW9FbGVtZW50IEFFID0gbmV3IEhUTUxBdWRpb0VsZW1lbnQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBBdWRpbyBBID0gbmV3IEF1ZGlvKEFFLCBwYXRoLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIGRhdGEuQWRkKHBhdGgsIEEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEF1ZGlvIFBsYXkoc3RyaW5nIHBhdGgsIGJvb2wgbG9vcCA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXVkaW8gQSA9IEdldChwYXRoKTtcclxuICAgICAgICAgICAgQS5Mb29wID0gbG9vcDtcclxuICAgICAgICAgICAgQS5QbGF5KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBBO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBCbGFzdChzdHJpbmcgcGF0aCwgZmxvYXQgdm9sdW1lID0gMWYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBdWRpbyBBID0gR2V0KHBhdGgpO1xyXG4gICAgICAgICAgICBBLkJsYXN0KHZvbHVtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3Aoc3RyaW5nIHBhdGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBdWRpbyBBID0gR2V0KHBhdGgpO1xyXG4gICAgICAgICAgICBBLlN0b3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgUGF1c2Uoc3RyaW5nIHBhdGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBdWRpbyBBID0gR2V0KHBhdGgpO1xyXG4gICAgICAgICAgICBBLlBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE9uUGxheShBdWRpbyBhdWRpbylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZy5Db250YWlucyhhdWRpbykpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBsYXlpbmcuQWRkKGF1ZGlvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBPblN0b3AoQXVkaW8gYXVkaW8pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAocGxheWluZy5Db250YWlucyhhdWRpbykpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBsYXlpbmcuUmVtb3ZlKGF1ZGlvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wQWxsRnJvbURpcmVjdG9yeShzdHJpbmcgZGlyZWN0b3J5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGlyZWN0b3J5ID0gRGlyZWN0b3J5ICsgZGlyZWN0b3J5O1xyXG5DaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Gb3JFYWNoPGdsb2JhbDo6Q2lybm9HYW1lLkF1ZGlvPiggICAgICAgICAgICBkYXRhLlZhbHVlcywoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6Q2lybm9HYW1lLkF1ZGlvPikoQSA9PiB7IGlmIChBLklELlN0YXJ0c1dpdGgoZGlyZWN0b3J5KSkgeyBBLlN0b3AoKTsgfSB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3BBbGwoKVxyXG4gICAgICAgIHtcclxuQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuRm9yRWFjaDxnbG9iYWw6OkNpcm5vR2FtZS5BdWRpbz4oICAgICAgICAgICAgZGF0YS5WYWx1ZXMsKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkNpcm5vR2FtZS5BdWRpbz4pKEEgPT4geyBBLlN0b3AoKTsgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQnV0dG9uTWVudVxyXG4gICAge1xyXG4gICAgICAgIC8vcHVibGljIExpc3Q8QnV0dG9uU3ByaXRlPiBidXR0b25zO1xyXG4gICAgICAgIHByb3RlY3RlZCBMaXN0PExpc3Q8QnV0dG9uU3ByaXRlPj4gcm93cztcclxuICAgICAgICBwdWJsaWMgZmxvYXQgTWVudVdpZHRoO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBNZW51SGVpZ2h0O1xyXG4gICAgICAgIHByb3RlY3RlZCBpbnQgRm9udFNpemU7XHJcbiAgICAgICAgcHVibGljIGJvb2wgU2VsZWN0aW9uTWVudTtcclxuICAgICAgICBwdWJsaWMgQnV0dG9uU3ByaXRlIFNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgQnV0dG9uTWVudSBTZWxmO1xyXG4gICAgICAgIHB1YmxpYyBkeW5hbWljIFNlbGVjdGVkRGF0YVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChTZWxmLlNlbGVjdGVkICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNlbGYuU2VsZWN0ZWQuRGF0YTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgU2VsZWN0ZWRUZXh0XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKFNlbGYuU2VsZWN0ZWQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoU2VsZi5TZWxlY3RlZC5Db250ZW50cyBpcyBUZXh0U3ByaXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgoVGV4dFNwcml0ZSlTZWxmLlNlbGVjdGVkLkNvbnRlbnRzKS5UZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQWN0aW9uIE9uQ2hvb3NlO1xyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBCdXR0b25NZW51KGZsb2F0IG1lbnVXaWR0aCwgZmxvYXQgbWVudUhlaWdodCwgaW50IEZvbnRTaXplLCBib29sIHNlbGVjdGlvbk1lbnUgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJvd3MgPSBuZXcgTGlzdDxMaXN0PEJ1dHRvblNwcml0ZT4+KCk7XHJcbiAgICAgICAgICAgIHRoaXMuTWVudVdpZHRoID0gbWVudVdpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLk1lbnVIZWlnaHQgPSBtZW51SGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLkZvbnRTaXplID0gRm9udFNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0aW9uTWVudSA9IHNlbGVjdGlvbk1lbnU7XHJcbiAgICAgICAgICAgIFNlbGYgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgTGlzdDxCdXR0b25TcHJpdGU+IEdldEFsbEJ1dHRvbnMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxCdXR0b25TcHJpdGU+IGFsbCA9IG5ldyBMaXN0PEJ1dHRvblNwcml0ZT4oKTtcclxuICAgICAgICAgICAgcm93cy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5MaXN0PGdsb2JhbDo6Q2lybm9HYW1lLkJ1dHRvblNwcml0ZT4+KShSID0+IGFsbC5BZGRSYW5nZShSKSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgQnV0dG9uU3ByaXRlIEdldFNwcml0ZUJ5RGF0YShkeW5hbWljIGRhdGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PEJ1dHRvblNwcml0ZT4gYWxsID0gbmV3IExpc3Q8QnV0dG9uU3ByaXRlPihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6Q2lybm9HYW1lLkJ1dHRvblNwcml0ZT4oR2V0QWxsQnV0dG9ucygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkJ1dHRvblNwcml0ZSwgYm9vbD4pKEIgPT4gQi5EYXRhID09IGRhdGEpKSk7XHJcbiAgICAgICAgICAgIGlmIChhbGwuQ291bnQgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRCdXR0b25zKHN0cmluZ1tdIGJ1dHRvblRleHQpXHJcbiAgICAgICAge1xyXG5DaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Gb3JFYWNoPHN0cmluZz4oICAgICAgICAgICAgYnV0dG9uVGV4dCwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPHN0cmluZz4pKFQgPT4gQWRkQnV0dG9uKChzdHJpbmcpVCkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEJ1dHRvblNwcml0ZSBBZGRCdXR0b24oc3RyaW5nIGJ1dHRvblRleHQsIGludCByb3cgPSAtMSwgZHluYW1pYyBkYXRhID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRleHRTcHJpdGUgVCA9IG5ldyBUZXh0U3ByaXRlKCk7XHJcbiAgICAgICAgICAgIFQuVGV4dCA9IGJ1dHRvblRleHQ7XHJcbiAgICAgICAgICAgIFQuRm9udFNpemUgPSBGb250U2l6ZTtcclxuICAgICAgICAgICAgLy9CdXR0b25TcHJpdGUgQiA9IG5ldyBCdXR0b25TcHJpdGUoVCwgKGludCkoRm9udFNpemUgKiAwLjA1KSk7XHJcbiAgICAgICAgICAgIEJ1dHRvblNwcml0ZSBCID0gbmV3IEJ1dHRvblNwcml0ZShULCAoaW50KShGb250U2l6ZSAqIDAuMSkpO1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCLkRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEFkZEJ1dHRvbihCLCByb3cpO1xyXG4gICAgICAgICAgICByZXR1cm4gQjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQnV0dG9uKEJ1dHRvblNwcml0ZSBidXR0b24sIGludCByb3cgPSAtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChyb3dzLkNvdW50ID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvd3MuQWRkKG5ldyBMaXN0PEJ1dHRvblNwcml0ZT4oKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJvdyA9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm93ID0gcm93cy5Db3VudCAtIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGJ1dHRvbiAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBidXR0b24uT25DbGljayA9ICgpID0+IHsgU2VsZi5TZWxlY3QoYnV0dG9uKTsgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByb3dzW3Jvd10uQWRkKGJ1dHRvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbGVjdChCdXR0b25TcHJpdGUgYnV0dG9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKFNlbGVjdGVkICE9IGJ1dHRvbiB8fCAhU2VsZWN0aW9uTWVudSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKFNlbGVjdGVkICE9IG51bGwgJiYgU2VsZWN0aW9uTWVudSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1NlbGVjdGVkLkJvcmRlckNvbG9yID0gXCIjMDBBQTMzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9TZWxlY3RlZC5CdXR0b25Db2xvciA9IFwiIzExQ0M1NVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGVkLlNldENvbG9yU2NoZW1lKDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgU2VsZWN0ZWQgPSBidXR0b247XHJcbiAgICAgICAgICAgICAgICB2YXIgT1NDID0gT25DaG9vc2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWVudSAmJiBTZWxlY3RlZCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vU2VsZWN0ZWQuQm9yZGVyQ29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgICAgICAgICAvL1NlbGVjdGVkLkJ1dHRvbkNvbG9yID0gXCIjRkYwMDAwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0ZWQuU2V0Q29sb3JTY2hlbWUoMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoU2VsZWN0ZWQgIT0gbnVsbCAmJiBTY3JpcHQuV3JpdGU8Ym9vbD4oXCJPU0NcIikpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5PbkNob29zZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENvbWJpbmVSb3dzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8QnV0dG9uU3ByaXRlPiBhbGwgPSBuZXcgTGlzdDxCdXR0b25TcHJpdGU+KCk7XHJcbiAgICAgICAgICAgIHJvd3MuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuTGlzdDxnbG9iYWw6OkNpcm5vR2FtZS5CdXR0b25TcHJpdGU+PikoUiA9PiBhbGwuQWRkUmFuZ2UoUikpKTtcclxuXHJcbiAgICAgICAgICAgIHJvd3MgPSBuZXcgTGlzdDxMaXN0PEJ1dHRvblNwcml0ZT4+KCk7XHJcbiAgICAgICAgICAgIHJvd3MuQWRkKGFsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBMaXN0PEJ1dHRvblNwcml0ZT4gYWRkUm93KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8QnV0dG9uU3ByaXRlPiByZXQgPSBuZXcgTGlzdDxCdXR0b25TcHJpdGU+KCk7XHJcbiAgICAgICAgICAgIHJvd3MuQWRkKHJldCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEJyZWFrVXAoaW50IHRvdGFsUm93cylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvbWJpbmVSb3dzKCk7XHJcbiAgICAgICAgICAgIExpc3Q8QnV0dG9uU3ByaXRlPiBhbGwgPSByb3dzWzBdO1xyXG4gICAgICAgICAgICByb3dzID0gbmV3IExpc3Q8TGlzdDxCdXR0b25TcHJpdGU+PigpO1xyXG4gICAgICAgICAgICBkb3VibGUgQyA9IE1hdGguQ2VpbGluZyhhbGwuQ291bnQgLyAoZG91YmxlKXRvdGFsUm93cyk7XHJcbiAgICAgICAgICAgIExpc3Q8QnV0dG9uU3ByaXRlPiByb3cgPSBhZGRSb3coKTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGFsbC5Db3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvdy5Db3VudCA+PSBDKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdyA9IGFkZFJvdygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQWRkQnV0dG9uKGFsbFtpXSk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgQ2VudGVyT24oU3ByaXRlIHNwcml0ZSwgVmVjdG9yMiBDZW50ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzcHJpdGUuRHJhdyhudWxsKTtcclxuICAgICAgICAgICAgVmVjdG9yMiBTID0gc3ByaXRlLlNpemU7XHJcbiAgICAgICAgICAgIFZlY3RvcjIgUzIgPSBTIC8gMmY7XHJcbiAgICAgICAgICAgIHNwcml0ZS5Qb3NpdGlvbiA9IENlbnRlciAtIFMyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdm9pZCBVcGRhdGVSb3coaW50IGluZGV4LCBmbG9hdCB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxCdXR0b25TcHJpdGU+IHJvdyA9IHJvd3NbaW5kZXhdO1xyXG4gICAgICAgICAgICBmbG9hdCBYID0gKE1lbnVXaWR0aCAvIChyb3cuQ291bnQgKyAxLjBmKSk7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgQ1ggPSBYO1xyXG5cclxuICAgICAgICAgICAgQ1ggKz0gUG9zaXRpb24uWDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCByb3cuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJ1dHRvblNwcml0ZSBCID0gcm93W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKEIgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDZW50ZXJPbihCLCBuZXcgVmVjdG9yMihDWCwgeSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQ1ggKz0gWDtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBGaW5pc2goaW50IHRvdGFsUm93cyA9IC0xKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRvdGFsUm93cyA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJyZWFrVXAodG90YWxSb3dzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmbG9hdCB5ID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgQ1kgPSAwO1xyXG4gICAgICAgICAgICBpZiAodG90YWxSb3dzID4gMCAmJiByb3dzLkNvdW50IDwgdG90YWxSb3dzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0gKE1lbnVIZWlnaHQgLyAocm93cy5Db3VudCArIDEpKTtcclxuICAgICAgICAgICAgICAgIENZID0geTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHkgPSAoTWVudUhlaWdodCAvIChyb3dzLkNvdW50KSk7XHJcbiAgICAgICAgICAgICAgICBDWSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIENZICs9IFBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCByb3dzLkNvdW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBVcGRhdGVSb3coaSwgQ1kpO1xyXG4gICAgICAgICAgICAgICAgQ1kgKz0geTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGUoVmVjdG9yMiBtb3VzZVBvc2l0aW9uID0gbnVsbCwgYm9vbCBjbGlja2VkID0gdHJ1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChtb3VzZVBvc2l0aW9uID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1vdXNlUG9zaXRpb24gPSBLZXlib2FyZE1hbmFnZXIuX3RoaXMuQ01vdXNlO1xyXG4gICAgICAgICAgICAgICAgY2xpY2tlZCA9IEtleWJvYXJkTWFuYWdlci5fdGhpcy5UYXBwZWRNb3VzZUJ1dHRvbnMuQ29udGFpbnMoMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNsaWNrZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvd3MuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuTGlzdDxnbG9iYWw6OkNpcm5vR2FtZS5CdXR0b25TcHJpdGU+PikoUiA9PiBSLkZvckVhY2goKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkNpcm5vR2FtZS5CdXR0b25TcHJpdGU+KShCID0+IHsgaWYgKEIgIT0gbnVsbCkgQi5DaGVja0NsaWNrKG1vdXNlUG9zaXRpb24pOyB9KSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcm93cy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5MaXN0PGdsb2JhbDo6Q2lybm9HYW1lLkJ1dHRvblNwcml0ZT4+KShSID0+IFIuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6Q2lybm9HYW1lLkJ1dHRvblNwcml0ZT4pKEIgPT4geyBpZiAoQiAhPSBudWxsKSBCLkRyYXcoZyk7IH0pKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3ByaXRlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgUG9zaXRpb247XHJcbiAgICAgICAgcHVibGljIEhUTUxDYW52YXNFbGVtZW50IHNwcml0ZUJ1ZmZlcjtcclxuICAgICAgICBwdWJsaWMgYm9vbCBWaXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBwcm90ZWN0ZWQgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHNwcml0ZUdyYXBoaWNzO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFNpemVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoc3ByaXRlQnVmZmVyLldpZHRoLCBzcHJpdGVCdWZmZXIuSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlQnVmZmVyLldpZHRoID0gKGludCl2YWx1ZS5YO1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlQnVmZmVyLkhlaWdodCA9IChpbnQpdmFsdWUuWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgR2V0R3JhcGhpY3MoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNwcml0ZUdyYXBoaWNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgU3ByaXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNwcml0ZUJ1ZmZlciA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBzcHJpdGVHcmFwaGljcyA9IHNwcml0ZUJ1ZmZlci5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgc3ByaXRlR3JhcGhpY3MuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFBvc2l0aW9uID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBPbkZyYW1lKClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIERyYXcoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIVZpc2libGUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGcuRHJhd0ltYWdlKHNwcml0ZUJ1ZmZlciwgUG9zaXRpb24uWCwgUG9zaXRpb24uWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIFJlY3RhbmdsZSBHZXRCb3VuZHMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUoUG9zaXRpb24uWCwgUG9zaXRpb24uWSwgc3ByaXRlQnVmZmVyLldpZHRoLCBzcHJpdGVCdWZmZXIuSGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEJ1dHRvblNwcml0ZSA6IFNwcml0ZVxyXG4gICAge1xyXG4gICAgICAgIHByb3RlY3RlZCBib29sIF9idXR0b25OZWVkc1JlcmVuZGVyO1xyXG4gICAgICAgIHByb3RlY3RlZCBTcHJpdGUgX2J1dHRvbkJ1ZmZlcjtcclxuICAgICAgICBwcm90ZWN0ZWQgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIF9idXR0b25HcmFwaGljO1xyXG4gICAgICAgIHB1YmxpYyBkeW5hbWljIERhdGE7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBTcHJpdGUgX2NvbnRlbnRzO1xyXG4gICAgICAgIHB1YmxpYyBTcHJpdGUgQ29udGVudHNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRlbnRzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2NvbnRlbnRzICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9jb250ZW50cyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIF9idXR0b25OZWVkc1JlcmVuZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgaW50IF9ib3JkZXJTaXplO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgQm9yZGVyU2l6ZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfYm9yZGVyU2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9ib3JkZXJTaXplICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9ib3JkZXJTaXplID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1dHRvbk5lZWRzUmVyZW5kZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzdHJpbmcgX2JvcmRlckNvbG9yO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgQm9yZGVyQ29sb3JcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2JvcmRlckNvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2JvcmRlckNvbG9yICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9ib3JkZXJDb2xvciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIF9idXR0b25OZWVkc1JlcmVuZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIExvY2tlZENsaWNrU291bmQgPSBcImhpdFwiO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgQ2xpY2tTb3VuZCA9IFwic2VsZWN0XCI7XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0cmluZyBfYnV0dG9uQ29sb3I7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBCdXR0b25Db2xvclxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfYnV0dG9uQ29sb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfYnV0dG9uQ29sb3IgIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1dHRvbkNvbG9yID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1dHRvbk5lZWRzUmVyZW5kZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjbGFzcyBDb2xvclNjaGVtZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHVibGljIHN0cmluZyBCb3JkZXJDb2xvcjtcclxuICAgICAgICAgICAgcHVibGljIHN0cmluZyBCdXR0b25Db2xvcjtcclxuICAgICAgICAgICAgcHVibGljIENvbG9yU2NoZW1lKHN0cmluZyBib3JkZXJDb2xvciA9IFwiIzAwQUEzM1wiLCBzdHJpbmcgYnV0dG9uQ29sb3IgPSBcIiMxMUNDNTVcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Cb3JkZXJDb2xvciA9IGJvcmRlckNvbG9yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5CdXR0b25Db2xvciA9IGJ1dHRvbkNvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgTGlzdDxDb2xvclNjaGVtZT4gQ29sb3JTY2hlbWVzO1xyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBsb2NrZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIEFjdGlvbiBPbkNsaWNrO1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNldENvbG9yU2NoZW1lKENvbG9yU2NoZW1lIHNjaGVtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEJvcmRlckNvbG9yID0gc2NoZW1lLkJvcmRlckNvbG9yO1xyXG4gICAgICAgICAgICBCdXR0b25Db2xvciA9IHNjaGVtZS5CdXR0b25Db2xvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgU2V0Q29sb3JTY2hlbWUoaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ29sb3JTY2hlbWUgQyA9IENvbG9yU2NoZW1lc1tpbmRleF07XHJcbiAgICAgICAgICAgIFNldENvbG9yU2NoZW1lKEMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3B1YmxpYyBCdXR0b25TcHJpdGUoU3ByaXRlIGNvbnRlbnRzLGludCBib3JkZXJTaXplPTIsc3RyaW5nIGJvcmRlckNvbG9yPVwiIzc3Nzc3N1wiLHN0cmluZyBidXR0b25Db2xvcj1cIiNDQ0NDQ0NcIilcclxuICAgICAgICBwdWJsaWMgQnV0dG9uU3ByaXRlKFNwcml0ZSBjb250ZW50cywgaW50IGJvcmRlclNpemUgPSAyLCBzdHJpbmcgYm9yZGVyQ29sb3IgPSBcIiMwMEFBMzNcIiwgc3RyaW5nIGJ1dHRvbkNvbG9yID0gXCIjMTFDQzU1XCIsIGR5bmFtaWMgZGF0YSA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLkNvbnRlbnRzID0gY29udGVudHM7XHJcbiAgICAgICAgICAgIHRoaXMuQm9yZGVyU2l6ZSA9IGJvcmRlclNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuQm9yZGVyQ29sb3IgPSBib3JkZXJDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5CdXR0b25Db2xvciA9IGJ1dHRvbkNvbG9yO1xyXG5cclxuICAgICAgICAgICAgX2J1dHRvbkJ1ZmZlciA9IG5ldyBTcHJpdGUoKTtcclxuICAgICAgICAgICAgX2J1dHRvbkJ1ZmZlci5TaXplID0gY29udGVudHMuU2l6ZTtcclxuICAgICAgICAgICAgX2J1dHRvbkdyYXBoaWMgPSBfYnV0dG9uQnVmZmVyLkdldEdyYXBoaWNzKCk7XHJcbiAgICAgICAgICAgIF9idXR0b25OZWVkc1JlcmVuZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgQ29sb3JTY2hlbWVzID0gbmV3IExpc3Q8Q29sb3JTY2hlbWU+KCk7XHJcbiAgICAgICAgICAgIENvbG9yU2NoZW1lcy5BZGQobmV3IENvbG9yU2NoZW1lKGJvcmRlckNvbG9yLCBidXR0b25Db2xvcikpO1xyXG4gICAgICAgICAgICBDb2xvclNjaGVtZXMuQWRkKG5ldyBDb2xvclNjaGVtZShcIiNGRkZGRkZcIiwgXCIjRkYwMDAwXCIpKTtcclxuICAgICAgICAgICAgQ29sb3JTY2hlbWVzLkFkZChuZXcgQ29sb3JTY2hlbWUoXCIjNzc3Nzc3XCIsIFwiI0NDQ0NDQ1wiKSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLkRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICBpZiAoZGF0YSA9PSBudWxsICYmIGNvbnRlbnRzIGlzIFRleHRTcHJpdGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERhdGEgPSAoKFRleHRTcHJpdGUpY29udGVudHMpLlRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIERyYXcobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2b2lkIGRyYXdCdXR0b24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcgPSBfYnV0dG9uR3JhcGhpYztcclxuICAgICAgICAgICAgaW50IHN6ID0gX2JvcmRlclNpemUgKyBfYm9yZGVyU2l6ZTtcclxuICAgICAgICAgICAgX2J1dHRvbkJ1ZmZlci5TaXplID0gQ29udGVudHMuU2l6ZSArIG5ldyBWZWN0b3IyKHN6LCBzeik7XHJcbiAgICAgICAgICAgIFZlY3RvcjIgc2l6ZSA9IF9idXR0b25CdWZmZXIuU2l6ZTtcclxuXHJcbiAgICAgICAgICAgIGcuRmlsbFN0eWxlID0gX2JvcmRlckNvbG9yO1xyXG4gICAgICAgICAgICBnLkZpbGxSZWN0KDAsIDAsIChpbnQpc2l6ZS5YLCAoaW50KXNpemUuWSk7XHJcblxyXG4gICAgICAgICAgICBnLkZpbGxTdHlsZSA9IEJ1dHRvbkNvbG9yO1xyXG4gICAgICAgICAgICBnLkZpbGxSZWN0KF9ib3JkZXJTaXplLCBfYm9yZGVyU2l6ZSwgKGludClzaXplLlggLSBzeiwgKGludClzaXplLlkgLSBzeik7XHJcblxyXG4gICAgICAgICAgICBzdHJpbmcgY29sb3IgPSBcInJnYmEoMjU1LDI1NSwyNTUsMClcIjtcclxuXHJcbiAgICAgICAgICAgIHN0cmluZyB3aHQgPSBcInJnYmEoMjU1LDI1NSwyNTUsMC43KVwiO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vL1NjcmlwdC5Xcml0ZShcInZhciBncmQgPSBnLmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHNpemUueSk7Z3JkLmFkZENvbG9yU3RvcCgwLCBjb2xvcik7Z3JkLmFkZENvbG9yU3RvcCgwLjQsIHdodCk7Z3JkLmFkZENvbG9yU3RvcCgxLCBjb2xvcik7Zy5maWxsU3R5bGUgPSBncmQ7XCIpO1xyXG4gICAgICAgICAgICB2YXIgZ3JkID0gZy5DcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCBzaXplLlkpO1xyXG4gICAgICAgICAgICBncmQuQWRkQ29sb3JTdG9wKDAsIGNvbG9yKTtcclxuICAgICAgICAgICAgZ3JkLkFkZENvbG9yU3RvcCgwLjQsIHdodCk7XHJcbiAgICAgICAgICAgIGdyZC5BZGRDb2xvclN0b3AoMSwgY29sb3IpO1xyXG4gICAgICAgICAgICBnLkZpbGxTdHlsZSA9IGdyZDtcclxuICAgICAgICAgICAgZy5GaWxsUmVjdCgwLCAwLCAoaW50KV9idXR0b25CdWZmZXIuU2l6ZS5YLCAoaW50KV9idXR0b25CdWZmZXIuU2l6ZS5ZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgTG9jayhib29sIHNldGNvbG9yc2NoZW1lID0gdHJ1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsb2NrZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChzZXRjb2xvcnNjaGVtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU2V0Q29sb3JTY2hlbWUoMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgVW5sb2NrKGJvb2wgc2V0Y29sb3JzY2hlbWUgPSB0cnVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFsb2NrZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoc2V0Y29sb3JzY2hlbWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNldENvbG9yU2NoZW1lKDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBWZWN0b3IyIExDb250ZW50U2l6ZSA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgcHVibGljIGJvb2wgQ2hlY2tDbGljayhWZWN0b3IyIG1vdXNlUG9zaXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVmlzaWJsZSAmJiBHZXRCb3VuZHMoKS5jb250YWluc1BvaW50KG1vdXNlUG9zaXRpb24pKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9ja2VkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChMb2NrZWRDbGlja1NvdW5kICE9IFwiXCIgJiYgTG9ja2VkQ2xpY2tTb3VuZCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLl90aGlzLkJsYXN0KFwiU0ZYL1wiICsgTG9ja2VkQ2xpY2tTb3VuZCArIFwiLm9nZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChDbGlja1NvdW5kICE9IFwiXCIgJiYgQ2xpY2tTb3VuZCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQXVkaW9NYW5hZ2VyLl90aGlzLkdldChcIlNGWC9cIiArIENsaWNrU291bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5fdGhpcy5CbGFzdChcIlNGWC9cIiArIENsaWNrU291bmQgKyBcIi5vZ2dcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHRtcCA9IE9uQ2xpY2s7XHJcbiAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlPGJvb2w+KFwidG1wXCIpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIE9uQ2xpY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgRHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vaWYgKF9jb250ZW50cy5TaXplICE9IExDb250ZW50U2l6ZSlcclxuICAgICAgICAgICAgaWYgKF9jb250ZW50cy5TaXplLlggIT0gTENvbnRlbnRTaXplLlggfHwgX2NvbnRlbnRzLlNpemUuWSAhPSBMQ29udGVudFNpemUuWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX2J1dHRvbk5lZWRzUmVyZW5kZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgTENvbnRlbnRTaXplID0gX2NvbnRlbnRzLlNpemUuQ2xvbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoX2J1dHRvbk5lZWRzUmVyZW5kZXIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRyYXdCdXR0b24oKTtcclxuICAgICAgICAgICAgICAgIF9idXR0b25OZWVkc1JlcmVuZGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU2l6ZSA9IF9idXR0b25CdWZmZXIuU2l6ZS5DbG9uZSgpO1xyXG4gICAgICAgICAgICAvL3Nwcml0ZUdyYXBoaWNzLkRyYXdJbWFnZShfYnUpXHJcbiAgICAgICAgICAgIF9idXR0b25CdWZmZXIuRHJhdyhzcHJpdGVHcmFwaGljcyk7XHJcbiAgICAgICAgICAgIENvbnRlbnRzLlBvc2l0aW9uID0gbmV3IFZlY3RvcjIoX2JvcmRlclNpemUsIF9ib3JkZXJTaXplKTtcclxuICAgICAgICAgICAgQ29udGVudHMuRHJhdyhzcHJpdGVHcmFwaGljcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZyAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBiYXNlLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENhbWVyYVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBib29sIGluc3Rhd2FycCA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFBvc2l0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFRhcmdldFBvc2l0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIENlbnRlcmVkVGFyZ2V0UG9zaXRpb25cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUYXJnZXRQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKHZhbHVlLlggLSAoQ2FtZXJhQm91bmRzLndpZHRoIC8gMiksIHZhbHVlLlkgLSAoQ2FtZXJhQm91bmRzLmhlaWdodCAvIDIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZmxvYXQgTGluZWFyUGFuU3BlZWQgPSAxLjZmO1xyXG4gICAgICAgIC8vcHVibGljIGZsb2F0IExpbmVhclBhblNwZWVkID0gMS4zZjtcclxuICAgICAgICAvLy9wdWJsaWMgZmxvYXQgTGluZWFyUGFuU3BlZWQgPSAxLjJmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBMaW5lYXJQYW5TcGVlZCA9IDAuOGY7XHJcbiAgICAgICAgLy8vcHVibGljIGZsb2F0IExlcnBQYW5TcGVlZCA9IDAuMDc1ZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgTGVycFBhblNwZWVkID0gMC4wNzBmO1xyXG4gICAgICAgIC8vcHJvdGVjdGVkIGZsb2F0IF9zY2FsZSA9IDAuOGY7XHJcbiAgICAgICAgcHJvdGVjdGVkIGZsb2F0IF9zY2FsZSA9IDFmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBzcGVlZG1vZCA9IDE7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFNjYWxlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zY2FsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX3NjYWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBfaW52c2NhbGUgPSAxIC8gX3NjYWxlO1xyXG4gICAgICAgICAgICAgICAgVXBkYXRlQ2FtZXJhQm91bmRzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9wcm90ZWN0ZWQgZmxvYXQgX2ludnNjYWxlID0gMS4yNWY7XHJcbiAgICAgICAgcHJvdGVjdGVkIGZsb2F0IF9pbnZzY2FsZSA9IDEuMGY7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IEludlNjYWxlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9pbnZzY2FsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX2ludnNjYWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBfc2NhbGUgPSAxIC8gX2ludnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgVXBkYXRlQ2FtZXJhQm91bmRzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBWZWN0b3IyIF9jZW50ZXIgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIENlbnRlclxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlY3RhbmdsZSBSID0gQ2FtZXJhQm91bmRzO1xyXG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gUi5DZW50ZXI7XHJcbiAgICAgICAgICAgICAgICBSLkdldENlbnRlcihfY2VudGVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfY2VudGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBQb3NpdGlvbi5YID0gdmFsdWUuWCAtIChDYW1lcmFCb3VuZHMud2lkdGggLyAyKTtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uLlkgPSB2YWx1ZS5ZIC0gKENhbWVyYUJvdW5kcy5oZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTY2FsZVRvU2l6ZShmbG9hdCBzaXplSW5QaXhlbHMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTY2FsZSA9IHNpemVJblBpeGVscyAvIEFwcC5DYW52YXMuV2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB2aWV3cG9ydF93aWR0aCA9IDE7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHZpZXdwb3J0X2hlaWdodCA9IDE7XHJcbiAgICAgICAgLy9jYW1lcmEgaGl0Ym94XHJcbiAgICAgICAgcHVibGljIFJlY3RhbmdsZSBDYW1lcmFCb3VuZHM7XHJcbiAgICAgICAgLy9hcmVhIGNhbWVyYSBtdXN0IGJlIGNvbmZpbmVkIHRvLlxyXG4gICAgICAgIHB1YmxpYyBSZWN0YW5nbGUgU3RhZ2VCb3VuZHM7XHJcbiAgICAgICAgcHVibGljIENhbWVyYShmbG9hdCB2aWV3cG9ydF93aWR0aCA9IC0xLCBmbG9hdCB2aWV3cG9ydF9oZWlnaHQgPSAtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBvc2l0aW9uID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICAgICAgVGFyZ2V0UG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdwb3J0X3dpZHRoID0gdmlld3BvcnRfd2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMudmlld3BvcnRfaGVpZ2h0ID0gdmlld3BvcnRfaGVpZ2h0O1xyXG4gICAgICAgICAgICBDYW1lcmFCb3VuZHMgPSBuZXcgUmVjdGFuZ2xlKDAsIDAsIHZpZXdwb3J0X3dpZHRoLCB2aWV3cG9ydF9oZWlnaHQpO1xyXG4gICAgICAgICAgICBfaW52c2NhbGUgPSAxLjBmIC8gX3NjYWxlO1xyXG4gICAgICAgICAgICBVcGRhdGVDYW1lcmFCb3VuZHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFVwZGF0ZUNhbWVyYUJvdW5kcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL0NhbWVyYUJvdW5kcy53aWR0aCA9IEFwcC5DYW52YXMuV2lkdGggKiBfaW52c2NhbGU7XHJcbiAgICAgICAgICAgIC8vQ2FtZXJhQm91bmRzLmhlaWdodCA9IEFwcC5DYW52YXMuSGVpZ2h0ICogX2ludnNjYWxlO1xyXG4gICAgICAgICAgICBDYW1lcmFCb3VuZHMud2lkdGggPSB2aWV3cG9ydF93aWR0aCAqIF9pbnZzY2FsZTtcclxuICAgICAgICAgICAgQ2FtZXJhQm91bmRzLmhlaWdodCA9IHZpZXdwb3J0X2hlaWdodCAqIF9pbnZzY2FsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBWZWN0b3IyIHRtcCA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChQb3NpdGlvbi5YICE9IFRhcmdldFBvc2l0aW9uLlggfHwgUG9zaXRpb24uWSAhPSBUYXJnZXRQb3NpdGlvbi5ZKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2Zsb2F0IGRpc3QgPSAoUG9zaXRpb24gLSBUYXJnZXRQb3NpdGlvbikuTGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgZGlzdCA9IFBvc2l0aW9uLkRpc3RhbmNlKFRhcmdldFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIGZsb2F0IHNwZCA9IExpbmVhclBhblNwZWVkICsgKGRpc3QgKiBMZXJwUGFuU3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgc3BkICo9IHNwZWVkbW9kO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkaXN0IDw9IHNwZCB8fCBpbnN0YXdhcnApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUG9zaXRpb24uWCA9IFRhcmdldFBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgICAgICAgICAgUG9zaXRpb24uWSA9IFRhcmdldFBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGF3YXJwID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRtcC5Db3B5RnJvbShQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdG1wLlN1YnRyYWN0KFRhcmdldFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB0bXAuU2V0QXNOb3JtYWxpemUoc3BkKTtcclxuICAgICAgICAgICAgICAgICAgICAvL1ZlY3RvcjIgViA9IChQb3NpdGlvbiAtIFRhcmdldFBvc2l0aW9uKS5Ob3JtYWxpemUoc3BkKTtcclxuICAgICAgICAgICAgICAgICAgICBQb3NpdGlvbi5TdWJ0cmFjdCh0bXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKFN0YWdlQm91bmRzICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUG9zaXRpb24uWCA9IE1hdGhIZWxwZXIuQ2xhbXAoUG9zaXRpb24uWCwgU3RhZ2VCb3VuZHMubGVmdCwgU3RhZ2VCb3VuZHMucmlnaHQgLSBDYW1lcmFCb3VuZHMud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFBvc2l0aW9uLlkgPSBNYXRoSGVscGVyLkNsYW1wKFBvc2l0aW9uLlksIFN0YWdlQm91bmRzLnRvcCwgU3RhZ2VCb3VuZHMuYm90dG9tIC0gQ2FtZXJhQm91bmRzLmhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFRhcmdldFBvc2l0aW9uLlggPSBNYXRoSGVscGVyLkNsYW1wKFRhcmdldFBvc2l0aW9uLlgsIFN0YWdlQm91bmRzLmxlZnQsIFN0YWdlQm91bmRzLnJpZ2h0IC0gQ2FtZXJhQm91bmRzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICBUYXJnZXRQb3NpdGlvbi5ZID0gTWF0aEhlbHBlci5DbGFtcChUYXJnZXRQb3NpdGlvbi5ZLCBTdGFnZUJvdW5kcy50b3AsIFN0YWdlQm91bmRzLmJvdHRvbSAtIENhbWVyYUJvdW5kcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBDYW1lcmFCb3VuZHMueCA9IFBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIENhbWVyYUJvdW5kcy55ID0gUG9zaXRpb24uWTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQXBwbHkoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnLlNjYWxlKFNjYWxlLCBTY2FsZSk7XHJcbiAgICAgICAgICAgIGcuVHJhbnNsYXRlKC1Qb3NpdGlvbi5YLCAtUG9zaXRpb24uWSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBFbnRpdHlcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgQW5pbWF0aW9uIEFuaTtcclxuICAgICAgICBwdWJsaWMgYm9vbCBBbGl2ZSA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIGJvb2wgVmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgU3BlZWQgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHB1YmxpYyBHYW1lIEdhbWU7XHJcbiAgICAgICAgcHJvdGVjdGVkIExpc3Q8RW50aXR5QmVoYXZpb3I+IF9iZWhhdmlvcnM7XHJcbiAgICAgICAgcHJvdGVjdGVkIExpc3Q8aW50PiBfYmVoYXZpb3JUaWNrcztcclxuICAgICAgICBwdWJsaWMgaW50IFpPcmRlciA9IDA7XHJcbiAgICAgICAgLy9wdWJsaWMgZG91YmxlIElEO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgSUQ7XHJcbiAgICAgICAgcHVibGljIGJvb2wgSGlkZUhpdGJveDtcclxuICAgICAgICBwdWJsaWMgYm9vbCBIYW5kbGVkTG9jYWxseSA9IHRydWU7XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIFJlbW92ZWRPbkxldmVsRW5kID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgSHNwZWVkXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFNwZWVkLlg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNwZWVkLlggPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgVnNwZWVkXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFNwZWVkLlk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNwZWVkLlkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFBvc2l0aW9uXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFuaS5Qb3NpdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQW5pLlBvc2l0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHhcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQW5pLlBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFuaS5Qb3NpdGlvbi5YID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQW5pLlBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFuaS5Qb3NpdGlvbi5ZID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBXaWR0aFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChBbmkuQ3VycmVudEltYWdlICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFuaS5DdXJyZW50SW1hZ2UuV2lkdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGZsb2F0IEhlaWdodFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChBbmkuQ3VycmVudEltYWdlICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFuaS5DdXJyZW50SW1hZ2UuSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEJlaGF2aW9yKEVudGl0eUJlaGF2aW9yIGJlaGF2aW9yKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9iZWhhdmlvcnMgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX2JlaGF2aW9ycyA9IG5ldyBMaXN0PEVudGl0eUJlaGF2aW9yPigpO1xyXG4gICAgICAgICAgICAgICAgX2JlaGF2aW9yVGlja3MgPSBuZXcgTGlzdDxpbnQ+KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX2JlaGF2aW9ycy5BZGQoYmVoYXZpb3IpO1xyXG4gICAgICAgICAgICBfYmVoYXZpb3JUaWNrcy5BZGQoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEJlaGF2aW9yPFQ+KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChfYmVoYXZpb3JzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9iZWhhdmlvcnMgPSBuZXcgTGlzdDxFbnRpdHlCZWhhdmlvcj4oKTtcclxuICAgICAgICAgICAgICAgIF9iZWhhdmlvclRpY2tzID0gbmV3IExpc3Q8aW50PigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBCID0gQWN0aXZhdG9yLkNyZWF0ZUluc3RhbmNlKHR5cGVvZihUKSwgdGhpcyk7XHJcbiAgICAgICAgICAgIF9iZWhhdmlvcnMuQWRkKChFbnRpdHlCZWhhdmlvcilCKTtcclxuICAgICAgICAgICAgX2JlaGF2aW9yVGlja3MuQWRkKDApO1xyXG4gICAgICAgICAgICAvKmlmIChCIGlzIEVudGl0eUJlaGF2aW9yKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfYmVoYXZpb3JzLkFkZCgoRW50aXR5QmVoYXZpb3IpQik7XHJcbiAgICAgICAgICAgICAgICBfYmVoYXZpb3JUaWNrcy5BZGQoMCk7XHJcbiAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJBdHRlbXB0ZWQgdG8gYWRkIGFuIGludmFsaWQgYmVoYXZpb3JcIik7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVCZWhhdmlvcihFbnRpdHlCZWhhdmlvciBiZWhhdmlvcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChfYmVoYXZpb3JzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9iZWhhdmlvcnMgPSBuZXcgTGlzdDxFbnRpdHlCZWhhdmlvcj4oKTtcclxuICAgICAgICAgICAgICAgIF9iZWhhdmlvclRpY2tzID0gbmV3IExpc3Q8aW50PigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfYmVoYXZpb3JzLkNvbnRhaW5zKGJlaGF2aW9yKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX2JlaGF2aW9yVGlja3MuUmVtb3ZlQXQoX2JlaGF2aW9ycy5JbmRleE9mKGJlaGF2aW9yKSk7XHJcbiAgICAgICAgICAgICAgICBfYmVoYXZpb3JzLlJlbW92ZShiZWhhdmlvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlQmVoYXZpb3I8VD4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9iZWhhdmlvcnMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgTGlzdDxFbnRpdHlCZWhhdmlvcj4gTCA9IG5ldyBMaXN0PEVudGl0eUJlaGF2aW9yPihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yPihfYmVoYXZpb3JzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yLCBib29sPikoYmVoYXZpb3IgPT4gYmVoYXZpb3IgaXMgVCkpKTtcclxuICAgICAgICAgICAgLyppZiAoTC5Db3VudCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlbW92ZUJlaGF2aW9yKExbMF0pO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgZm9yZWFjaCAoRW50aXR5QmVoYXZpb3IgYmVoYXZpb3IgaW4gTClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVtb3ZlQmVoYXZpb3IoYmVoYXZpb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFQgR2V0QmVoYXZpb3I8VD4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9iZWhhdmlvcnMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0KFQpO1xyXG4gICAgICAgICAgICAvKkxpc3Q8RW50aXR5QmVoYXZpb3I+IEwgPSBuZXcgTGlzdDxFbnRpdHlCZWhhdmlvcj4oX2JlaGF2aW9ycy5XaGVyZShiZWhhdmlvciA9PiBiZWhhdmlvciBpcyBUKSk7XHJcbiAgICAgICAgICAgIGlmIChMLkNvdW50PjApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZHluYW1pYylMWzBdO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuRmlyc3Q8Z2xvYmFsOjpDaXJub0dhbWUuRW50aXR5QmVoYXZpb3I+KF9iZWhhdmlvcnMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpDaXJub0dhbWUuRW50aXR5QmVoYXZpb3IsIGJvb2w+KShiZWhhdmlvciA9PiBiZWhhdmlvciBpcyBUKSkuQ2FzdDxUPigpO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdChUKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9wdWJsaWMgVCBHZXRCZWhhdmlvcjxUPihGdW5jPEVudGl0eUJlaGF2aW9yLGJvb2w+IGZ1bmMpXHJcbiAgICAgICAgcHVibGljIFQgR2V0QmVoYXZpb3I8VD4oRnVuYzxULCBib29sPiBmdW5jKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxFbnRpdHlCZWhhdmlvcj4gTCA9IG5ldyBMaXN0PEVudGl0eUJlaGF2aW9yPihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yPihfYmVoYXZpb3JzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yLCBib29sPikoYmVoYXZpb3IgPT4gYmVoYXZpb3IgaXMgVCkpKTtcclxuICAgICAgICAgICAgRnVuYzxFbnRpdHlCZWhhdmlvciwgYm9vbD4gRiA9IGZ1bmMuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkZpcnN0PGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yPihMLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yLCBib29sPilGKS5DYXN0PFQ+KCk7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIEwuRmlyc3QoZnVuYykuQ2FzdDxUPigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIEdldFRlYW1Db2xvcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcyBpcyBJQ29tYmF0YW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoR2FtZS5HYW1lUGxheVNldHRpbmdzLkdhbWVNb2RlLlRlYW1zKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBHYW1lLkdldFRlYW1Db2xvcigoKElDb21iYXRhbnQpdGhpcykuVGVhbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5wbGF5ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2FtZS5HZXRUZWFtQ29sb3IoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBHYW1lLkdldFRlYW1Db2xvcigyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIFNhbWVUZWFtKEVudGl0eSBjb21iYXRhbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlPGJvb2w+KFwidGhpcyA9PSBjb21iYXRhbnRcIikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGR5bmFtaWMgQSA9IHRoaXMuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgIGR5bmFtaWMgQiA9IGNvbWJhdGFudC5Ub0R5bmFtaWMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChBLlBvaW50c0ZvcktpbGxpbmcgJiYgQi5Qb2ludHNGb3JLaWxsaW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBJQ29tYmF0YW50IEFBID0gQTtcclxuICAgICAgICAgICAgICAgIElDb21iYXRhbnQgQkIgPSBCO1xyXG4gICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZTxib29sPihcIkFBLlRlYW0gPT0gQkIuVGVhbVwiKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoR2FtZS5UZWFtcylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuICgoSUNvbWJhdGFudCl0aGlzKS5UZWFtICE9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2NyaXB0LldyaXRlPGJvb2w+KFwiQUEuVGVhbSA9PSAwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBFbnRpdHlCZWhhdmlvciBHZXRCZWhhdmlvckZyb21OYW1lKHN0cmluZyBOYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9iZWhhdmlvcnMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAvL0xpc3Q8RW50aXR5QmVoYXZpb3I+IEwgPSBuZXcgTGlzdDxFbnRpdHlCZWhhdmlvcj4oX2JlaGF2aW9ycy5XaGVyZShiZWhhdmlvciA9PiBiZWhhdmlvci5HZXRUeXBlKCkuRnVsbE5hbWU9PXR5cGVGdWxsTmFtZSkpO1xyXG4gICAgICAgICAgICAvKkxpc3Q8RW50aXR5QmVoYXZpb3I+IEwgPSBuZXcgTGlzdDxFbnRpdHlCZWhhdmlvcj4oX2JlaGF2aW9ycy5XaGVyZShiZWhhdmlvciA9PiBiZWhhdmlvci5CZWhhdmlvck5hbWUgPT0gTmFtZSkpO1xyXG4gICAgICAgICAgICBpZiAoTC5Db3VudCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZHluYW1pYylMWzBdO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkZpcnN0PGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yPihfYmVoYXZpb3JzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yLCBib29sPikoYmVoYXZpb3IgPT4gYmVoYXZpb3IuQmVoYXZpb3JOYW1lID09IE5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcIkJlaGF2aW9yIFwiICsgTmFtZSArIFwiIHdhcyBub3QgZm91bmQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKnB1YmxpYyB2aXJ0dWFsIGJvb2wgSGFuZGxlZExvY2FsbHlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gR2FtZS5Ib3N0ZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9Ki9cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIEN1c3RvbUV2ZW50KGR5bmFtaWMgZXZ0KVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qcHVibGljIHZvaWQgU2VuZEN1c3RvbUV2ZW50KGR5bmFtaWMgZXZ0LCBib29sIHRyaWdnZXJmbHVzaCA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZHluYW1pYyBEID0gbmV3IG9iamVjdCgpO1xyXG4gICAgICAgICAgICBELkkgPSBJRDtcclxuICAgICAgICAgICAgRC5EID0gZXZ0O1xyXG4gICAgICAgICAgICBHYW1lLlNlbmRFdmVudChcIkNFXCIsIEQsdHJpZ2dlcmZsdXNoKTtcclxuICAgICAgICB9Ki9cclxuICAgICAgICBwdWJsaWMgdm9pZCBQbGF5U291bmQoc3RyaW5nIHNvdW5kKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2FtZS5QbGF5U291bmRFZmZlY3QoZ2V0Q2VudGVyKCksIHNvdW5kKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIFZlY3RvcjIgZ2V0Q2VudGVyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIFBvc2l0aW9uICsgbmV3IFZlY3RvcjIoV2lkdGggLyAyLCBIZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgcmV0dXJuIFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBXaWR0aCAvIDIsIEhlaWdodCAvIDIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypwdWJsaWMgTGlnaHQgR2V0TGlnaHQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMgaXMgSUxpZ2h0U291cmNlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gR2FtZS5MaWdodHMuRmlyc3QobCA9PiBsLnNvdXJjZSA9PSB0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9Ki9cclxuXHJcbiAgICAgICAgcHVibGljIEVudGl0eShHYW1lIGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL0lEID0gTWF0aC5SYW5kb20oKTtcclxuICAgICAgICAgICAgSUQgPSBIZWxwZXIuR2V0UmFuZG9tU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHRoaXMuR2FtZSA9IGdhbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCBSZWN0YW5nbGUgR2V0SGl0Ym94KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChBbmkgIT0gbnVsbCAmJiBBbmkuQ3VycmVudEltYWdlICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKEFuaS5YLCBBbmkuWSwgQW5pLkN1cnJlbnRJbWFnZS5XaWR0aCwgQW5pLkN1cnJlbnRJbWFnZS5IZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQW5pLlBvc2l0aW9uICs9IFNwZWVkO1xyXG4gICAgICAgICAgICBBbmkuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChfYmVoYXZpb3JzICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgX2JlaGF2aW9ycy5Db3VudClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBFbnRpdHlCZWhhdmlvciBiZWhhdmlvciA9IF9iZWhhdmlvcnNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJlaGF2aW9yLmVuYWJsZWQgJiYgX2JlaGF2aW9yVGlja3NbaV0rKyA+PSBiZWhhdmlvci5GcmFtZXNQZXJUaWNrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2JlaGF2aW9yVGlja3NbaV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWhhdmlvci5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZnJlc2hCZWhhdmlvclRpY2s8VD4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRW50aXR5QmVoYXZpb3IgQiA9IEdldEJlaGF2aW9yPFQ+KCkuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgIGlmIChCICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBfYmVoYXZpb3JUaWNrc1tfYmVoYXZpb3JzLkluZGV4T2YoQildID0gQi5GcmFtZXNQZXJUaWNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBEcmF3KENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQW5pLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIGlmICghSGlkZUhpdGJveCAmJiBHYW1lLlNob3dIaXRib3gpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERyYXdIaXRib3goZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF9iZWhhdmlvcnMgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoRW50aXR5QmVoYXZpb3IgYmVoYXZpb3IgaW4gX2JlaGF2aW9ycylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvci5EcmF3KGcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXdIaXRib3goQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSZWN0YW5nbGUgUiA9IEdldEhpdGJveCgpO1xyXG4gICAgICAgICAgICBpZiAoUiAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBnLlN0cm9rZVN0eWxlID0gXCIjRkZGRjAwXCI7XHJcbiAgICAgICAgICAgICAgICBnLlN0cm9rZVJlY3QoKGludClSLngsIChpbnQpUi55LCAoaW50KVIud2lkdGgsIChpbnQpUi5oZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIG9uUmVtb3ZlKClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVQYWRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbCBjb25uZWN0ZWQ7XHJcbiAgICAgICAgcHVibGljIGRvdWJsZVtdIGF4ZXM7XHJcbiAgICAgICAgcHVibGljIEdhbWVQYWRCdXR0b25bXSBidXR0b25zO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgaWQ7XHJcbiAgICAgICAgcHVibGljIGxvbmcgaW5kZXg7XHJcbiAgICAgICAgcHVibGljIEdhbWVQYWQoZHluYW1pYyBwYWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZCA9IHBhZC5pZDtcclxuICAgICAgICAgICAgaW5kZXggPSBwYWQuaW5kZXg7XHJcbiAgICAgICAgICAgIGNvbm5lY3RlZCA9IHBhZC5jb25uZWN0ZWQ7XHJcbiAgICAgICAgICAgIGF4ZXMgPSBwYWQuYXhlcztcclxuXHJcbiAgICAgICAgICAgIGludCBsZW5ndGggPSBwYWQuYnV0dG9ucy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBidXR0b25zID0gbmV3IEdhbWVQYWRCdXR0b25bbGVuZ3RoXTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uc1tpXSA9IHBhZC5idXR0b25zW2ldO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgYnV0dG9ucy5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnNbaV0udGFwcGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ29tYmluZURhdGEoR2FtZVBhZCBwYWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoaWQgPT0gcGFkLmlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0ZWQgPSBwYWQuY29ubmVjdGVkO1xyXG4gICAgICAgICAgICAgICAgYXhlcyA9IHBhZC5heGVzO1xyXG4gICAgICAgICAgICAgICAgLy9idXR0b25zID0gcGFkLmJ1dHRvbnM7XHJcbiAgICAgICAgICAgICAgICBDb21iaW5lQnV0dG9uRGF0YShwYWQuYnV0dG9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgQ29tYmluZUJ1dHRvbkRhdGEoR2FtZVBhZEJ1dHRvbltdIGJ1dHRvbnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBHYW1lUGFkQnV0dG9uW10gTGIgPSBidXR0b25zO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnMgPSBidXR0b25zO1xyXG4gICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgYnV0dG9ucy5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChidXR0b25zW2ldLnByZXNzZWQgJiYgIUxiW2ldLnByZXNzZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uc1tpXS50YXBwZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVQYWRCdXR0b25cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbCB0YXBwZWQ7XHJcbiAgICAgICAgcHVibGljIGJvb2wgcHJlc3NlZDtcclxuICAgICAgICBwdWJsaWMgZG91YmxlIHZhbHVlO1xyXG4gICAgICAgIHB1YmxpYyBHYW1lUGFkQnV0dG9uKGR5bmFtaWMgYnV0dG9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJlc3NlZCA9IGJ1dHRvbi5wcmVzc2VkO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGJ1dHRvbi52YWx1ZTtcclxuICAgICAgICAgICAgdGFwcGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVQYWRNYW5hZ2VyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBHYW1lUGFkTWFuYWdlciBfdGhpcztcclxuICAgICAgICBwdWJsaWMgR2FtZVBhZE1hbmFnZXIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2FtZXBhZHMgPSBuZXcgTGlzdDxHYW1lUGFkPigpO1xyXG4gICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIExpc3Q8R2FtZVBhZD4gYWN0aXZlR2FtZXBhZHNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExpc3Q8R2FtZVBhZD4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OkNpcm5vR2FtZS5HYW1lUGFkPihnYW1lcGFkcywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkNpcm5vR2FtZS5HYW1lUGFkLCBib29sPikoZ2FtZXBhZCA9PiBnYW1lcGFkLmNvbm5lY3RlZCkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgR2FtZVBhZCBrZXlib2FyZDtcclxuICAgICAgICBwdWJsaWMgTGlzdDxHYW1lUGFkPiBnYW1lcGFkcztcclxuICAgICAgICBwcml2YXRlIGR5bmFtaWMgdGVtcGdhbWVwYWRzO1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIENhbGxCYWNrVGVzdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJDYWxsYmFjayFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBHYW1lUGFkIEdldFBhZChzdHJpbmcgaWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PEdhbWVQYWQ+IEwgPSBuZXcgTGlzdDxHYW1lUGFkPihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6Q2lybm9HYW1lLkdhbWVQYWQ+KGdhbWVwYWRzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkdhbWVQYWQsIGJvb2w+KShnYW1lcGFkID0+IGdhbWVwYWQuaWQgPT0gaWQpKSk7XHJcbiAgICAgICAgICAgIGlmIChMLkNvdW50ID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIExbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgZ2FtZXBhZHMuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGdhbWVwYWRzW2ldLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB0ZW1wZ2FtZXBhZHMgPSBTY3JpcHQuV3JpdGU8b2JqZWN0PihcIihuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMoKSB8fCBuYXZpZ2F0b3Iud2Via2l0R2V0R2FtZXBhZHMoKSB8fCBbXSlcIik7XHJcbiAgICAgICAgICAgIExpc3Q8R2FtZVBhZD4gcGFkcyA9IG5ldyBMaXN0PEdhbWVQYWQ+KCk7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgdGVtcGdhbWVwYWRzLmxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlbXBnYW1lcGFkc1tpXSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEdhbWVQYWQgcGFkID0gbmV3IEdhbWVQYWQodGVtcGdhbWVwYWRzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBfVXBkYXRlKHBhZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkcy5BZGQocGFkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgLy9BZGRzIGFueSBuZXdseSBmb3VuZCBnYW1lcGFkcy5cclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBwYWRzLkNvdW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzdHJpbmcgaWQgPSBwYWRzW2ldLmlkO1xyXG4gICAgICAgICAgICAgICAgaW50IGogPSAwO1xyXG4gICAgICAgICAgICAgICAgYm9vbCBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IGdhbWVwYWRzLkNvdW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnYW1lcGFkc1tqXS5pZCA9PSBpZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGorKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvaylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lcGFkcy5BZGQocGFkc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qQWN0aW9uIEYgPSBDYWxsQmFja1Rlc3Q7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcInNldFRpbWVvdXQoRiwgMzAwMCk7XCIpOyovXHJcbiAgICAgICAgICAgIC8vR2xvYmFsLlNldFRpbWVvdXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZvaWQgX1VwZGF0ZShHYW1lUGFkIHBhZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBnYW1lcGFkcy5Db3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgR2FtZVBhZCBQID0gZ2FtZXBhZHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoUC5pZCA9PSBwYWQuaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUC5Db21iaW5lRGF0YShwYWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVQbGF5U2V0dGluZ3NcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbCBPbmxpbmUgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIE15Q2hhcmFjdGVyID0gXCJSZWlzZW5cIjtcclxuICAgICAgICBwdWJsaWMgR2FtZU1vZGUgR2FtZU1vZGU7XHJcbiAgICAgICAgcHVibGljIGludCBNeVRlYW0gPSAxO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgQmx1ZU5QQ3MgPSAzO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgUmVkTlBDcyA9IDI7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBSb29tSUQgPSBcIlwiO1xyXG4gICAgICAgIC8vL3B1YmxpYyBOZXRQbGF5IEhvc3ROUE91dDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgQ29tcHV0ZXJBSU1vZGlmaWVyID0gMWY7XHJcbiAgICAgICAgcHVibGljIEdhbWVQbGF5U2V0dGluZ3MoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9HYW1lTW9kZSA9IG5ldyBHYW1lTW9kZSgpO1xyXG4gICAgICAgICAgICAvL0dhbWVNb2RlID0gR2FtZU1vZGUuRGVhdGhNYXRjaDtcclxuICAgICAgICAgICAgR2FtZU1vZGUgPSBHYW1lTW9kZS5UZWFtQmF0dGxlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgSGVscGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgR2V0UmFuZG9tU3RyaW5nKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIChNYXRoLlJhbmRvbSgpICogbmV3IERhdGUoKS5HZXRUaW1lKCkpLlRvU3RyaW5nKDM2KS5SZXBsYWNlKFwiL1xcXFwuLyBnLCAnLSdcIixudWxsKTtcclxuICAgICAgICAgICAgLy9yZXR1cm4gKE1hdGguUmFuZG9tKCkgKiBuZXcgRGF0ZSgpLkdldFRpbWUoKSkuVG9TdHJpbmcoMzYpLlJlcGxhY2UobmV3IEJyaWRnZS5UZXh0LlJlZ3VsYXJFeHByZXNzaW9ucy5SZWdleChcIlwiLCBudWxsKTtcclxuICAgICAgICAgICAgLy9yZXR1cm4gU2NyaXB0LldyaXRlPHN0cmluZz4oXCIoTWF0aC5yYW5kb20oKSAqIG5ldyBEYXRlKCkuZ2V0VGltZSgpKS50b1N0cmluZygzNikucmVwbGFjZSgvXFxcXC4vIGcsICctJylcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBTY3JpcHQuV3JpdGU8c3RyaW5nPihcIihNYXRoLnJhbmRvbSgpICogbmV3IERhdGUoKS5nZXRUaW1lKCkpLnRvU3RyaW5nKDM2KVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0YXRpYyBEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBfbmFtZXNwYWNlcyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PigpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVHlwZSBHZXRUeXBlKHN0cmluZyBGdWxsTmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0cmluZyBuYW1lID0gRnVsbE5hbWU7XHJcbiAgICAgICAgICAgIGlmIChuYW1lID09IFwiXCIgfHwgbmFtZSA9PSBudWxsIHx8ICFuYW1lLkNvbnRhaW5zKFwiLlwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBzdHJpbmdbXSBzID0gbmFtZS5TcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgIC8vc3RyaW5nIG5tID0gR2V0VHlwZSgpLkZ1bGxOYW1lLlNwbGl0KFwiLlwiKVswXTtcclxuICAgICAgICAgICAgaW50IGkgPSAxO1xyXG4gICAgICAgICAgICAvKmlmIChzWzBdICE9IG5tKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7Ki9cclxuXHJcbiAgICAgICAgICAgIC8vZHluYW1pYyBvYmogPSBTY3JpcHQuV3JpdGU8b2JqZWN0PihubSk7XHJcblxyXG4gICAgICAgICAgICAvL0dldCBuYW1lc3BhY2VcclxuICAgICAgICAgICAgZHluYW1pYyBvYmo7XHJcbiAgICAgICAgICAgIGlmIChfbmFtZXNwYWNlcy5Db250YWluc0tleShzWzBdKSlcclxuICAgICAgICAgICAgICAgIG9iaiA9IF9uYW1lc3BhY2VzW3NbMF1dO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IEdsb2JhbC5FdmFsPG9iamVjdD4oc1swXSk7XHJcbiAgICAgICAgICAgICAgICBfbmFtZXNwYWNlc1tzWzBdXSA9IG9iajtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBzLkxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9QYXJzZSB0aHJvdWdoIG9iamVjdCBoaWVyYXJjaHkuXHJcbiAgICAgICAgICAgICAgICBpZiAoIVNjcmlwdC5Xcml0ZTxib29sPihcIm9ialwiKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIG9iaiA9IG9ialtzW2ldXTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgQWRkTXVsdGlwbGU8VD4oVFtdIGFycmF5LCBUIGl0ZW0sIGludCBudW1iZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB3aGlsZSAobnVtYmVyID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuUHVzaDxUPihhcnJheSwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICBudW1iZXItLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN0cmluZyBSZXBlYXQoc3RyaW5nIHMsIGludCBudW1iZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobnVtYmVyIDwgMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyaW5nIHJldCA9IHM7XHJcbiAgICAgICAgICAgIGludCBpID0gbnVtYmVyIC0gMTtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBzO1xyXG4gICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ2xvbmVDYW52YXMoSFRNTENhbnZhc0VsZW1lbnQgQylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IHJldCA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICByZXQuV2lkdGggPSBDLldpZHRoO1xyXG4gICAgICAgICAgICByZXQuSGVpZ2h0ID0gQy5IZWlnaHQ7XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnID0gcmV0LkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBnLkRyYXdJbWFnZShDLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBHZXRDb250ZXh0KEhUTUxDYW52YXNFbGVtZW50IEMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gQy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkeW5hbWljIEdldEZpZWxkKGR5bmFtaWMgdGFyZ2V0LCBzdHJpbmcgZmllbGROYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZHluYW1pYyBPID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICAvL2lmIChPW2ZpZWxkTmFtZV0pXHJcbiAgICAgICAgICAgIGlmIChIYXMoTywgZmllbGROYW1lKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9bZmllbGROYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoT1tcImdldFwiICsgZmllbGROYW1lXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9bXCJnZXRcIiArIGZpZWxkTmFtZV0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHJpbmcgcyA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzID0gXCJIZWxwZXIgZ2V0IGZpZWxkOiBGaWVsZCBcXFwiXCIgKyBmaWVsZE5hbWUgKyBcIlxcXCIgd2FzIG5vdCBpbiBcIiArIHRhcmdldC5HZXRUeXBlKCkuRnVsbE5hbWUgKyBcIi5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzID0gXCJIZWxwZXIgZ2V0IGZpZWxkOiBGaWVsZCBcXFwiXCIgKyBmaWVsZE5hbWUgKyBcIlxcXCIgd2FzIG5vdCBpbiBcIiArIHRhcmdldCArIFwiLlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL0NvbnNvbGUuV3JpdGVMaW5lKHMpO1xyXG4gICAgICAgICAgICBMb2cocyk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGljIGJvb2wgSGFzKGR5bmFtaWMgdGFyZ2V0LCBzdHJpbmcgZmllbGROYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLyppZiAoT1tmaWVsZE5hbWVdIHx8ICgoc3RyaW5nKU8pID09IFwiZmFsc2VcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICByZXR1cm4gU2NyaXB0LldyaXRlPGJvb2w+KFwidHlwZW9mIHRhcmdldFtmaWVsZE5hbWVdICE9ICd1bmRlZmluZWQnXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUmVsb2FkUGFnZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYXRpb24uSHJlZiA9IFdpbmRvdy5Mb2NhdGlvbi5IcmVmO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2V0RmllbGQoZHluYW1pYyB0YXJnZXQsIHN0cmluZyBmaWVsZE5hbWUsIGR5bmFtaWMgZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGR5bmFtaWMgTyA9IHRhcmdldDtcclxuICAgICAgICAgICAgLy9pZiAoT1tmaWVsZE5hbWVdKVxyXG4gICAgICAgICAgICBpZiAoSGFzKE8sIGZpZWxkTmFtZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE9bZmllbGROYW1lXSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKE9bXCJzZXRcIiArIGZpZWxkTmFtZV0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE9bXCJzZXRcIiArIGZpZWxkTmFtZV0oZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyaW5nIHMgPSBcIlwiO1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcyA9IFwiSGVscGVyIHNldCBmaWVsZDogRmllbGQgXFxcIlwiICsgZmllbGROYW1lICsgXCJcXFwiIHdhcyBub3QgaW4gXCIgKyB0YXJnZXQuR2V0VHlwZSgpLkZ1bGxOYW1lICsgXCIuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2hcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcyA9IFwiSGVscGVyIHNldCBmaWVsZDogRmllbGQgXFxcIlwiICsgZmllbGROYW1lICsgXCJcXFwiIHdhcyBub3QgaW4gXCIgKyB0YXJnZXQgKyBcIi5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL0NvbnNvbGUuV3JpdGVMaW5lKHMpO1xyXG4gICAgICAgICAgICBMb2cocyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFtUZW1wbGF0ZShcImNvbnNvbGUubG9nKHttZXNzYWdlfSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIExvZyhzdHJpbmcgbWVzc2FnZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJvb2wgYiA9IFNjcmlwdC5Xcml0ZTxib29sPihcImNvbnNvbGUubG9nKG1lc3NhZ2UpXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgQ29weUZpZWxkcyhkeW5hbWljIHNvdXJjZSwgZHluYW1pYyB0YXJnZXQsIHN0cmluZ1tdIEZpZWxkcyA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoRmllbGRzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZpZWxkcyA9IE9iamVjdC5LZXlzKHNvdXJjZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IEZpZWxkcy5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN0cmluZyBmID0gRmllbGRzW2ldO1xyXG4gICAgICAgICAgICAgICAgU2V0RmllbGQodGFyZ2V0LCBmLCBHZXRGaWVsZChzb3VyY2UsIGYpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN0cmluZyBLZXlDb2RlVG9TdHJpbmcoaW50IGtleWNvZGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmdbXSBjb2RlbmFtZXMgPSBuZXcgc3RyaW5nW10geyBcIlwiLCAvLyBbMF1cclxuICBcIlwiLCAvLyBbMV1cclxuICBcIlwiLCAvLyBbMl1cclxuICBcIkNBTkNFTFwiLCAvLyBbM11cclxuICBcIlwiLCAvLyBbNF1cclxuICBcIlwiLCAvLyBbNV1cclxuICBcIkhFTFBcIiwgLy8gWzZdXHJcbiAgXCJcIiwgLy8gWzddXHJcbiAgXCJCQUNLX1NQQUNFXCIsIC8vIFs4XVxyXG4gIFwiVEFCXCIsIC8vIFs5XVxyXG4gIFwiXCIsIC8vIFsxMF1cclxuICBcIlwiLCAvLyBbMTFdXHJcbiAgXCJDTEVBUlwiLCAvLyBbMTJdXHJcbiAgXCJFTlRFUlwiLCAvLyBbMTNdXHJcbiAgXCJFTlRFUl9TUEVDSUFMXCIsIC8vIFsxNF1cclxuICBcIlwiLCAvLyBbMTVdXHJcbiAgXCJTSElGVFwiLCAvLyBbMTZdXHJcbiAgXCJDT05UUk9MXCIsIC8vIFsxN11cclxuICBcIkFMVFwiLCAvLyBbMThdXHJcbiAgXCJQQVVTRVwiLCAvLyBbMTldXHJcbiAgXCJDQVBTX0xPQ0tcIiwgLy8gWzIwXVxyXG4gIFwiS0FOQVwiLCAvLyBbMjFdXHJcbiAgXCJFSVNVXCIsIC8vIFsyMl1cclxuICBcIkpVTkpBXCIsIC8vIFsyM11cclxuICBcIkZJTkFMXCIsIC8vIFsyNF1cclxuICBcIkhBTkpBXCIsIC8vIFsyNV1cclxuICBcIlwiLCAvLyBbMjZdXHJcbiAgXCJFU0NBUEVcIiwgLy8gWzI3XVxyXG4gIFwiQ09OVkVSVFwiLCAvLyBbMjhdXHJcbiAgXCJOT05DT05WRVJUXCIsIC8vIFsyOV1cclxuICBcIkFDQ0VQVFwiLCAvLyBbMzBdXHJcbiAgXCJNT0RFQ0hBTkdFXCIsIC8vIFszMV1cclxuICBcIlNQQUNFXCIsIC8vIFszMl1cclxuICBcIlBBR0VfVVBcIiwgLy8gWzMzXVxyXG4gIFwiUEFHRV9ET1dOXCIsIC8vIFszNF1cclxuICBcIkVORFwiLCAvLyBbMzVdXHJcbiAgXCJIT01FXCIsIC8vIFszNl1cclxuICBcIkxFRlRcIiwgLy8gWzM3XVxyXG4gIFwiVVBcIiwgLy8gWzM4XVxyXG4gIFwiUklHSFRcIiwgLy8gWzM5XVxyXG4gIFwiRE9XTlwiLCAvLyBbNDBdXHJcbiAgXCJTRUxFQ1RcIiwgLy8gWzQxXVxyXG4gIFwiUFJJTlRcIiwgLy8gWzQyXVxyXG4gIFwiRVhFQ1VURVwiLCAvLyBbNDNdXHJcbiAgXCJQUklOVFNDUkVFTlwiLCAvLyBbNDRdXHJcbiAgXCJJTlNFUlRcIiwgLy8gWzQ1XVxyXG4gIFwiREVMRVRFXCIsIC8vIFs0Nl1cclxuICBcIlwiLCAvLyBbNDddXHJcbiAgXCIwXCIsIC8vIFs0OF1cclxuICBcIjFcIiwgLy8gWzQ5XVxyXG4gIFwiMlwiLCAvLyBbNTBdXHJcbiAgXCIzXCIsIC8vIFs1MV1cclxuICBcIjRcIiwgLy8gWzUyXVxyXG4gIFwiNVwiLCAvLyBbNTNdXHJcbiAgXCI2XCIsIC8vIFs1NF1cclxuICBcIjdcIiwgLy8gWzU1XVxyXG4gIFwiOFwiLCAvLyBbNTZdXHJcbiAgXCI5XCIsIC8vIFs1N11cclxuICBcIkNPTE9OXCIsIC8vIFs1OF1cclxuICBcIlNFTUlDT0xPTlwiLCAvLyBbNTldXHJcbiAgXCJMRVNTX1RIQU5cIiwgLy8gWzYwXVxyXG4gIFwiRVFVQUxTXCIsIC8vIFs2MV1cclxuICBcIkdSRUFURVJfVEhBTlwiLCAvLyBbNjJdXHJcbiAgXCJRVUVTVElPTl9NQVJLXCIsIC8vIFs2M11cclxuICBcIkFUXCIsIC8vIFs2NF1cclxuICBcIkFcIiwgLy8gWzY1XVxyXG4gIFwiQlwiLCAvLyBbNjZdXHJcbiAgXCJDXCIsIC8vIFs2N11cclxuICBcIkRcIiwgLy8gWzY4XVxyXG4gIFwiRVwiLCAvLyBbNjldXHJcbiAgXCJGXCIsIC8vIFs3MF1cclxuICBcIkdcIiwgLy8gWzcxXVxyXG4gIFwiSFwiLCAvLyBbNzJdXHJcbiAgXCJJXCIsIC8vIFs3M11cclxuICBcIkpcIiwgLy8gWzc0XVxyXG4gIFwiS1wiLCAvLyBbNzVdXHJcbiAgXCJMXCIsIC8vIFs3Nl1cclxuICBcIk1cIiwgLy8gWzc3XVxyXG4gIFwiTlwiLCAvLyBbNzhdXHJcbiAgXCJPXCIsIC8vIFs3OV1cclxuICBcIlBcIiwgLy8gWzgwXVxyXG4gIFwiUVwiLCAvLyBbODFdXHJcbiAgXCJSXCIsIC8vIFs4Ml1cclxuICBcIlNcIiwgLy8gWzgzXVxyXG4gIFwiVFwiLCAvLyBbODRdXHJcbiAgXCJVXCIsIC8vIFs4NV1cclxuICBcIlZcIiwgLy8gWzg2XVxyXG4gIFwiV1wiLCAvLyBbODddXHJcbiAgXCJYXCIsIC8vIFs4OF1cclxuICBcIllcIiwgLy8gWzg5XVxyXG4gIFwiWlwiLCAvLyBbOTBdXHJcbiAgXCJPU19LRVlcIiwgLy8gWzkxXSBXaW5kb3dzIEtleSAoV2luZG93cykgb3IgQ29tbWFuZCBLZXkgKE1hYylcclxuICBcIlwiLCAvLyBbOTJdXHJcbiAgXCJDT05URVhUX01FTlVcIiwgLy8gWzkzXVxyXG4gIFwiXCIsIC8vIFs5NF1cclxuICBcIlNMRUVQXCIsIC8vIFs5NV1cclxuICBcIk5VTVBBRDBcIiwgLy8gWzk2XVxyXG4gIFwiTlVNUEFEMVwiLCAvLyBbOTddXHJcbiAgXCJOVU1QQUQyXCIsIC8vIFs5OF1cclxuICBcIk5VTVBBRDNcIiwgLy8gWzk5XVxyXG4gIFwiTlVNUEFENFwiLCAvLyBbMTAwXVxyXG4gIFwiTlVNUEFENVwiLCAvLyBbMTAxXVxyXG4gIFwiTlVNUEFENlwiLCAvLyBbMTAyXVxyXG4gIFwiTlVNUEFEN1wiLCAvLyBbMTAzXVxyXG4gIFwiTlVNUEFEOFwiLCAvLyBbMTA0XVxyXG4gIFwiTlVNUEFEOVwiLCAvLyBbMTA1XVxyXG4gIFwiTVVMVElQTFlcIiwgLy8gWzEwNl1cclxuICBcIkFERFwiLCAvLyBbMTA3XVxyXG4gIFwiU0VQQVJBVE9SXCIsIC8vIFsxMDhdXHJcbiAgXCJTVUJUUkFDVFwiLCAvLyBbMTA5XVxyXG4gIFwiREVDSU1BTFwiLCAvLyBbMTEwXVxyXG4gIFwiRElWSURFXCIsIC8vIFsxMTFdXHJcbiAgXCJGMVwiLCAvLyBbMTEyXVxyXG4gIFwiRjJcIiwgLy8gWzExM11cclxuICBcIkYzXCIsIC8vIFsxMTRdXHJcbiAgXCJGNFwiLCAvLyBbMTE1XVxyXG4gIFwiRjVcIiwgLy8gWzExNl1cclxuICBcIkY2XCIsIC8vIFsxMTddXHJcbiAgXCJGN1wiLCAvLyBbMTE4XVxyXG4gIFwiRjhcIiwgLy8gWzExOV1cclxuICBcIkY5XCIsIC8vIFsxMjBdXHJcbiAgXCJGMTBcIiwgLy8gWzEyMV1cclxuICBcIkYxMVwiLCAvLyBbMTIyXVxyXG4gIFwiRjEyXCIsIC8vIFsxMjNdXHJcbiAgXCJGMTNcIiwgLy8gWzEyNF1cclxuICBcIkYxNFwiLCAvLyBbMTI1XVxyXG4gIFwiRjE1XCIsIC8vIFsxMjZdXHJcbiAgXCJGMTZcIiwgLy8gWzEyN11cclxuICBcIkYxN1wiLCAvLyBbMTI4XVxyXG4gIFwiRjE4XCIsIC8vIFsxMjldXHJcbiAgXCJGMTlcIiwgLy8gWzEzMF1cclxuICBcIkYyMFwiLCAvLyBbMTMxXVxyXG4gIFwiRjIxXCIsIC8vIFsxMzJdXHJcbiAgXCJGMjJcIiwgLy8gWzEzM11cclxuICBcIkYyM1wiLCAvLyBbMTM0XVxyXG4gIFwiRjI0XCIsIC8vIFsxMzVdXHJcbiAgXCJcIiwgLy8gWzEzNl1cclxuICBcIlwiLCAvLyBbMTM3XVxyXG4gIFwiXCIsIC8vIFsxMzhdXHJcbiAgXCJcIiwgLy8gWzEzOV1cclxuICBcIlwiLCAvLyBbMTQwXVxyXG4gIFwiXCIsIC8vIFsxNDFdXHJcbiAgXCJcIiwgLy8gWzE0Ml1cclxuICBcIlwiLCAvLyBbMTQzXVxyXG4gIFwiTlVNX0xPQ0tcIiwgLy8gWzE0NF1cclxuICBcIlNDUk9MTF9MT0NLXCIsIC8vIFsxNDVdXHJcbiAgXCJXSU5fT0VNX0ZKX0pJU0hPXCIsIC8vIFsxNDZdXHJcbiAgXCJXSU5fT0VNX0ZKX01BU1NIT1VcIiwgLy8gWzE0N11cclxuICBcIldJTl9PRU1fRkpfVE9VUk9LVVwiLCAvLyBbMTQ4XVxyXG4gIFwiV0lOX09FTV9GSl9MT1lBXCIsIC8vIFsxNDldXHJcbiAgXCJXSU5fT0VNX0ZKX1JPWUFcIiwgLy8gWzE1MF1cclxuICBcIlwiLCAvLyBbMTUxXVxyXG4gIFwiXCIsIC8vIFsxNTJdXHJcbiAgXCJcIiwgLy8gWzE1M11cclxuICBcIlwiLCAvLyBbMTU0XVxyXG4gIFwiXCIsIC8vIFsxNTVdXHJcbiAgXCJcIiwgLy8gWzE1Nl1cclxuICBcIlwiLCAvLyBbMTU3XVxyXG4gIFwiXCIsIC8vIFsxNThdXHJcbiAgXCJcIiwgLy8gWzE1OV1cclxuICBcIkNJUkNVTUZMRVhcIiwgLy8gWzE2MF1cclxuICBcIkVYQ0xBTUFUSU9OXCIsIC8vIFsxNjFdXHJcbiAgXCJET1VCTEVfUVVPVEVcIiwgLy8gWzE2Ml1cclxuICBcIkhBU0hcIiwgLy8gWzE2M11cclxuICBcIkRPTExBUlwiLCAvLyBbMTY0XVxyXG4gIFwiUEVSQ0VOVFwiLCAvLyBbMTY1XVxyXG4gIFwiQU1QRVJTQU5EXCIsIC8vIFsxNjZdXHJcbiAgXCJVTkRFUlNDT1JFXCIsIC8vIFsxNjddXHJcbiAgXCJPUEVOX1BBUkVOXCIsIC8vIFsxNjhdXHJcbiAgXCJDTE9TRV9QQVJFTlwiLCAvLyBbMTY5XVxyXG4gIFwiQVNURVJJU0tcIiwgLy8gWzE3MF1cclxuICBcIlBMVVNcIiwgLy8gWzE3MV1cclxuICBcIlBJUEVcIiwgLy8gWzE3Ml1cclxuICBcIkhZUEhFTl9NSU5VU1wiLCAvLyBbMTczXVxyXG4gIFwiT1BFTl9DVVJMWV9CUkFDS0VUXCIsIC8vIFsxNzRdXHJcbiAgXCJDTE9TRV9DVVJMWV9CUkFDS0VUXCIsIC8vIFsxNzVdXHJcbiAgXCJUSUxERVwiLCAvLyBbMTc2XVxyXG4gIFwiXCIsIC8vIFsxNzddXHJcbiAgXCJcIiwgLy8gWzE3OF1cclxuICBcIlwiLCAvLyBbMTc5XVxyXG4gIFwiXCIsIC8vIFsxODBdXHJcbiAgXCJWT0xVTUVfTVVURVwiLCAvLyBbMTgxXVxyXG4gIFwiVk9MVU1FX0RPV05cIiwgLy8gWzE4Ml1cclxuICBcIlZPTFVNRV9VUFwiLCAvLyBbMTgzXVxyXG4gIFwiXCIsIC8vIFsxODRdXHJcbiAgXCJcIiwgLy8gWzE4NV1cclxuICBcIlNFTUlDT0xPTlwiLCAvLyBbMTg2XVxyXG4gIFwiRVFVQUxTXCIsIC8vIFsxODddXHJcbiAgXCJDT01NQVwiLCAvLyBbMTg4XVxyXG4gIFwiTUlOVVNcIiwgLy8gWzE4OV1cclxuICBcIlBFUklPRFwiLCAvLyBbMTkwXVxyXG4gIFwiU0xBU0hcIiwgLy8gWzE5MV1cclxuICBcIkJBQ0tfUVVPVEVcIiwgLy8gWzE5Ml1cclxuICBcIlwiLCAvLyBbMTkzXVxyXG4gIFwiXCIsIC8vIFsxOTRdXHJcbiAgXCJcIiwgLy8gWzE5NV1cclxuICBcIlwiLCAvLyBbMTk2XVxyXG4gIFwiXCIsIC8vIFsxOTddXHJcbiAgXCJcIiwgLy8gWzE5OF1cclxuICBcIlwiLCAvLyBbMTk5XVxyXG4gIFwiXCIsIC8vIFsyMDBdXHJcbiAgXCJcIiwgLy8gWzIwMV1cclxuICBcIlwiLCAvLyBbMjAyXVxyXG4gIFwiXCIsIC8vIFsyMDNdXHJcbiAgXCJcIiwgLy8gWzIwNF1cclxuICBcIlwiLCAvLyBbMjA1XVxyXG4gIFwiXCIsIC8vIFsyMDZdXHJcbiAgXCJcIiwgLy8gWzIwN11cclxuICBcIlwiLCAvLyBbMjA4XVxyXG4gIFwiXCIsIC8vIFsyMDldXHJcbiAgXCJcIiwgLy8gWzIxMF1cclxuICBcIlwiLCAvLyBbMjExXVxyXG4gIFwiXCIsIC8vIFsyMTJdXHJcbiAgXCJcIiwgLy8gWzIxM11cclxuICBcIlwiLCAvLyBbMjE0XVxyXG4gIFwiXCIsIC8vIFsyMTVdXHJcbiAgXCJcIiwgLy8gWzIxNl1cclxuICBcIlwiLCAvLyBbMjE3XVxyXG4gIFwiXCIsIC8vIFsyMThdXHJcbiAgXCJPUEVOX0JSQUNLRVRcIiwgLy8gWzIxOV1cclxuICBcIkJBQ0tfU0xBU0hcIiwgLy8gWzIyMF1cclxuICBcIkNMT1NFX0JSQUNLRVRcIiwgLy8gWzIyMV1cclxuICBcIlFVT1RFXCIsIC8vIFsyMjJdXHJcbiAgXCJcIiwgLy8gWzIyM11cclxuICBcIk1FVEFcIiwgLy8gWzIyNF1cclxuICBcIkFMVEdSXCIsIC8vIFsyMjVdXHJcbiAgXCJcIiwgLy8gWzIyNl1cclxuICBcIldJTl9JQ09fSEVMUFwiLCAvLyBbMjI3XVxyXG4gIFwiV0lOX0lDT18wMFwiLCAvLyBbMjI4XVxyXG4gIFwiXCIsIC8vIFsyMjldXHJcbiAgXCJXSU5fSUNPX0NMRUFSXCIsIC8vIFsyMzBdXHJcbiAgXCJcIiwgLy8gWzIzMV1cclxuICBcIlwiLCAvLyBbMjMyXVxyXG4gIFwiV0lOX09FTV9SRVNFVFwiLCAvLyBbMjMzXVxyXG4gIFwiV0lOX09FTV9KVU1QXCIsIC8vIFsyMzRdXHJcbiAgXCJXSU5fT0VNX1BBMVwiLCAvLyBbMjM1XVxyXG4gIFwiV0lOX09FTV9QQTJcIiwgLy8gWzIzNl1cclxuICBcIldJTl9PRU1fUEEzXCIsIC8vIFsyMzddXHJcbiAgXCJXSU5fT0VNX1dTQ1RSTFwiLCAvLyBbMjM4XVxyXG4gIFwiV0lOX09FTV9DVVNFTFwiLCAvLyBbMjM5XVxyXG4gIFwiV0lOX09FTV9BVFROXCIsIC8vIFsyNDBdXHJcbiAgXCJXSU5fT0VNX0ZJTklTSFwiLCAvLyBbMjQxXVxyXG4gIFwiV0lOX09FTV9DT1BZXCIsIC8vIFsyNDJdXHJcbiAgXCJXSU5fT0VNX0FVVE9cIiwgLy8gWzI0M11cclxuICBcIldJTl9PRU1fRU5MV1wiLCAvLyBbMjQ0XVxyXG4gIFwiV0lOX09FTV9CQUNLVEFCXCIsIC8vIFsyNDVdXHJcbiAgXCJBVFROXCIsIC8vIFsyNDZdXHJcbiAgXCJDUlNFTFwiLCAvLyBbMjQ3XVxyXG4gIFwiRVhTRUxcIiwgLy8gWzI0OF1cclxuICBcIkVSRU9GXCIsIC8vIFsyNDldXHJcbiAgXCJQTEFZXCIsIC8vIFsyNTBdXHJcbiAgXCJaT09NXCIsIC8vIFsyNTFdXHJcbiAgXCJcIiwgLy8gWzI1Ml1cclxuICBcIlBBMVwiLCAvLyBbMjUzXVxyXG4gIFwiV0lOX09FTV9DTEVBUlwiLCAvLyBbMjU0XVxyXG4gIFwiXCIgLy8gWzI1NV1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGtleWNvZGUgPj0gMCAmJiBrZXljb2RlIDwgY29kZW5hbWVzLkxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvZGVuYW1lc1trZXljb2RlXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIga2MgPSBrZXljb2RlO1xyXG4gICAgICAgICAgICByZXR1cm4gU2NyaXB0LldyaXRlPHN0cmluZz4oXCJTdHJpbmcuRnJvbUNoYXJDb2RlKGtjKVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkeW5hbWljIE1ha2VTaGFsbG93Q29weShkeW5hbWljIHNvdXJjZSwgc3RyaW5nW10gZmllbGROYW1lcyA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkeW5hbWljIHRhcmdldCA9IG5ldyBvYmplY3QoKTtcclxuICAgICAgICAgICAgc3RyaW5nW10gRmllbGRzID0gZmllbGROYW1lcztcclxuICAgICAgICAgICAgaWYgKEZpZWxkcyA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBGaWVsZHMgPSBPYmplY3QuS2V5cyhzb3VyY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBGaWVsZHMuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzdHJpbmcgZiA9IEZpZWxkc1tpXTtcclxuICAgICAgICAgICAgICAgIHRhcmdldFtmXSA9IEdldEZpZWxkKHNvdXJjZSwgZik7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEJyaWRnZTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBIZWxwZXJFeHRlbnNpb25zXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUIFBpY2s8VD4odGhpcyBJRW51bWVyYWJsZTxUPiBsaXN0LCBSYW5kb20gUk5EID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChSTkQgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUk5EID0gbmV3IFJhbmRvbSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIExpc3Q8VD4gTCA9IG5ldyBMaXN0PFQ+KCk7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKHZhciBpdGVtIGluIGxpc3QpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEwuQWRkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBMW1JORC5OZXh0KEwuQ291bnQpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEZvckVhY2g8VD4odGhpcyBJRW51bWVyYWJsZTxUPiBsaXN0LCBBY3Rpb248VD4gYWN0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAodmFyIGl0ZW0gaW4gbGlzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBGb3JFYWNoPFQ+KHRoaXMgSUVudW1lcmFibGU8VD4gbGlzdCwgc3RyaW5nIG1ldGhvZE5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgaXRlbSBpbiBsaXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBY3Rpb24gQSA9IGl0ZW1bbWV0aG9kTmFtZV0uQXM8QWN0aW9uPigpO1xyXG4gICAgICAgICAgICAgICAgQSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBBZGRJZk5ldzxUPih0aGlzIExpc3Q8VD4gbGlzdCwgVCBpdGVtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbG4gPSBsaXN0LkNvdW50O1xyXG4gICAgICAgICAgICBvYmplY3QgQSA9IGl0ZW07XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbG4pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdCBCID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGU8Ym9vbD4oXCJBID09IEJcIikpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpc3QuQWRkKGl0ZW0pO1xyXG4gICAgICAgICAgICAvKmlmICghbGlzdC5Db250YWlucyhpdGVtKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5BZGQoaXRlbSk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgdm9pZCBSZW1vdmVBbGw8VD4odGhpcyBJRW51bWVyYWJsZTxUPiBsaXN0LCBBY3Rpb248VD4gYWN0aW9uKVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBSZW1vdmVBbGw8VD4odGhpcyBMaXN0PFQ+IGxpc3QsIEZ1bmM8VCwgYm9vbD4gcHJlZGljYXRlKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIC8vZm9yZWFjaCAodmFyIGl0ZW0gaW4gbGlzdClcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGxpc3QuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIC8vYWN0aW9uKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2xpc3QucmVtXHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5SZW1vdmUoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBbVGVtcGxhdGUoXCJ7Kmxpc3R9LnB1c2goeyp2YWx9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUHVzaDxUPih0aGlzIFRbXSBsaXN0LCBUIHZhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcImxpc3QucHVzaCh2YWwpXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFB1c2hJZk5ldzxUPih0aGlzIFRbXSBsaXN0LCBUIHZhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghQ29udGFpbnNCPFQ+KGxpc3QsIHZhbCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFB1c2g8VD4obGlzdCwgdmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFB1c2hSYW5nZTxUPih0aGlzIFRbXSBsaXN0LCBwYXJhbXMgVFtdIHZhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCB2YWwuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBQdXNoPFQ+KGxpc3QsIHZhbFtpXSk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFtUZW1wbGF0ZShcInsqbGlzdH0ucG9wKClcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUIFBvcDxUPih0aGlzIFRbXSBsaXN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNjcmlwdC5Xcml0ZTxUPihcImxpc3QucG9wKClcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgQ2xlYXI8VD4odGhpcyBUW10gbGlzdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpID0gbGlzdC5MZW5ndGg7XHJcbiAgICAgICAgICAgIHdoaWxlIChpLS0gPiAwKVxyXG4gICAgICAgICAgICAgICAgbGlzdC5Qb3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBSZXBsYWNlQWxsPFQ+KHRoaXMgVFtdIGxpc3QsIFRbXSBTb3VyY2UsIFRbXSBEZXN0aW5hdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpID0gLTE7XHJcbiAgICAgICAgICAgIGkgPSBJbmRleE9mPFQ+KGxpc3QsIFNvdXJjZSwgaSArIDEsIDMpO1xyXG4gICAgICAgICAgICB2YXIgbG4gPSBTb3VyY2UuTGVuZ3RoO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA+PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGogPCBsbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0W2kgKyBqXSA9IERlc3RpbmF0aW9uW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIGorKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGkgPSBJbmRleE9mPFQ+KGxpc3QsIFNvdXJjZSwgaSArIDEsIDMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVFtdIFdoZXJlQjxUPih0aGlzIFRbXSBsaXN0LCBGdW5jPFQsIGJvb2w+IHByZWRpY2F0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG9iamVjdFtdIHJldCA9IG5ldyBvYmplY3RbMF07XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgaW50IGxuID0gbGlzdC5MZW5ndGg7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbG4pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuUHVzaDxvYmplY3Q+KHJldCwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXQuQXM8VFtdPigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIENvbnRhaW5zQjxUPih0aGlzIExpc3Q8VD4gbGlzdCwgb2JqZWN0IFZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVFtdIEwgPSBsaXN0W1wiaXRlbXNcIl0uQXM8VFtdPigpO1xyXG4gICAgICAgICAgICByZXR1cm4gQ29udGFpbnNCPFQ+KEwsIFZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBDb250YWluc0I8VD4odGhpcyBUW10gbGlzdCwgb2JqZWN0IFZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICBpbnQgbG4gPSBsaXN0Lkxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0IE8gPSBsaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZTxib29sPihcIk8gPT0gVmFsdWVcIikpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgSW5kZXhPZjxUPih0aGlzIFRbXSBsaXN0LCBUW10gVmFsdWUsIGludCBpbmRleCA9IDAsIGludCBzdHJ1Y3R1cmVTaXplID0gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpID0gaW5kZXg7XHJcbiAgICAgICAgICAgIHZhciBsbiA9IGxpc3QuTGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgdmxuID0gVmFsdWUuTGVuZ3RoO1xyXG4gICAgICAgICAgICBvYmplY3QgTyA9IFZhbHVlWzBdO1xyXG4gICAgICAgICAgICBvYmplY3QgQTtcclxuICAgICAgICAgICAgb2JqZWN0IEI7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbG4gJiYgaSA+PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvKnZhciBjID0gaSsxO1xyXG4gICAgICAgICAgICAgICAgaSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgQiA9IFZhbHVlWzBdO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGMgPCBsaXN0Lkxlbmd0aCAmJiBpPT0tMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBBID0gbGlzdFtjXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQSA9PSBCKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGMrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpID09IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAgICAgaSA9IGxpc3QuSW5kZXhPZihPLkFzPHN0cmluZz4oKSwgaSArIDEpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGkgPj0gMCAmJiBpICUgc3RydWN0dXJlU2l6ZSA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IGxpc3QuSW5kZXhPZihPLkFzPHN0cmluZz4oKSwgaSArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGsgPSAxO1xyXG4gICAgICAgICAgICAgICAgdmFyIGwgPSBpICsgMTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IGxuICYmIGkgPj0gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBib29sIG9rID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAob2sgJiYgayA8IHZsbilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEEgPSBsaXN0W2xdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCID0gVmFsdWVba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBICE9IEIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvaylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBJZGVudGljYWw8VD4odGhpcyBUW10gbGlzdCwgVFtdIGxpc3QyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxpc3QgPT0gbGlzdDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsaXN0ID09IG51bGwgfHwgbGlzdDIgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBsbiA9IGxpc3QuTGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAobG4gPT0gbGlzdDIuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgaSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGkgPCBsbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3QgQSA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0IEIgPSBsaXN0MltpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQSAhPSBCKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBSZXZlcnNlT3JkZXJXaXRoU3RydWN0dXJlPFQ+KHRoaXMgVFtdIGxpc3QsIGludCBzaXplKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9UW10gcmV0ID0gbmV3IFRbMF07XHJcbiAgICAgICAgICAgIExpc3Q8VD4gcmV0ID0gbmV3IExpc3Q8VD4oKTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICBpbnQgbG4gPSBsaXN0Lkxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50IGogPSAwO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGogPCBzaXplKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcmV0LlB1c2gobGlzdFtqXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0Lkluc2VydCgwLCBsaXN0WyhzaXplIC0gMSkgLSBqXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSArPSBzaXplO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBDbGVhcih0aGlzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBHKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIEMgPSBHLkNhbnZhcztcclxuICAgICAgICAgICAgRy5DbGVhclJlY3QoMCwgMCwgQy5XaWR0aCwgQy5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIG5vdCB5ZXQgdGVzdGVkIHdpdGggZGVlcCBpbmhlcml0ZW5jZS4uLlxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiVFwiPjwvcGFyYW0+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiaW5zdGFuY2VcIj48L3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIElzSW5zdGFuY2VPZlR5cGVGYXN0KHRoaXMgVHlwZSBULCBvYmplY3QgaW5zdGFuY2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgQyA9IGluc3RhbmNlLkFzPGR5bmFtaWM+KCkuY3RvcjtcclxuICAgICAgICAgICAgb2JqZWN0W10gQSA9IFRbXCIkJGluaGVyaXRvcnNcIl0uQXM8ZHluYW1pYz4oKTsvL2xpc3Qgb2YgYWxsIHR5cGVzIHRoYXQgaW5oZXJpdCBmcm9tIHRoaXMgdHlwZVxyXG4gICAgICAgICAgICByZXR1cm4gKEMgPT0gVCB8fCAoQSAhPSBudWxsICYmIEEuSW5kZXhPZihDKSA+PSAwKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBJbnB1dENvbnRyb2xsZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBOdW1iZXJPZkFjdGlvbnMgPSA4O1xyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aWMgR2FtZVBhZE1hbmFnZXIgR007XHJcbiAgICAgICAgcHVibGljIExpc3Q8SW5wdXRNYXA+IElucHV0TWFwcGluZztcclxuXHJcbiAgICAgICAgcHVibGljIHN0cmluZyBpZCB7IGdldDsgcHJvdGVjdGVkIHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSW5wdXRDb250cm9sbGVyKHN0cmluZyBpZCA9IFwiS2V5Ym9hcmRcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICAgICAgSW5wdXRNYXBwaW5nID0gbmV3IExpc3Q8SW5wdXRNYXA+KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQgPT0gXCJLZXlib2FyZFwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbml0a2V5Ym9hcmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGluaXRnYW1lcGFkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKEdNID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChHYW1lUGFkTWFuYWdlci5fdGhpcyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEdhbWVQYWRNYW5hZ2VyLl90aGlzID0gbmV3IEdhbWVQYWRNYW5hZ2VyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBHTSA9IEdhbWVQYWRNYW5hZ2VyLl90aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBkeW5hbWljIENvcHlNYXAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLypkeW5hbWljIEQgPSBuZXcgb2JqZWN0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBEOyovXHJcbiAgICAgICAgICAgIHN0cmluZ1tdIGZpZWxkcyA9IG5ldyBzdHJpbmdbXSB7IFwibWFwXCIsIFwiYW50aW1hcFwiLCBcIm5hbWVcIiwgXCJheGlzXCIsIFwiY29udHJvbGxlcklEXCIgfTtcclxuICAgICAgICAgICAgZHluYW1pY1tdIHJldCA9IG5ldyBkeW5hbWljW0lucHV0TWFwcGluZy5Db3VudF07XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCByZXQuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXRbaV0gPSBIZWxwZXIuTWFrZVNoYWxsb3dDb3B5KElucHV0TWFwcGluZ1tpXSwgZmllbGRzKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDb3B5RnJvbU1hcChkeW5hbWljW10gTWFwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RyaW5nW10gZmllbGRzID0gbmV3IHN0cmluZ1tdIHsgXCJtYXBcIiwgXCJhbnRpbWFwXCIsIFwibmFtZVwiLCBcImF4aXNcIiwgXCJjb250cm9sbGVySURcIiB9O1xyXG5cclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IE1hcC5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID49IElucHV0TWFwcGluZy5Db3VudClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBJbnB1dE1hcHBpbmcuQWRkKG5ldyBJbnB1dE1hcCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIElucHV0TWFwIElNID0gSW5wdXRNYXBwaW5nW2ldO1xyXG4gICAgICAgICAgICAgICAgSGVscGVyLkNvcHlGaWVsZHMoTWFwW2ldLCBJTSwgZmllbGRzKTtcclxuICAgICAgICAgICAgICAgIC8vcmV0W2ldID0gSGVscGVyLk1ha2VTaGFsbG93Q29weShJbnB1dE1hcHBpbmdbaV0sIGZpZWxkcyk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgaW5pdGtleWJvYXJkKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBOdW1iZXJPZkFjdGlvbnMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIElucHV0TWFwIG1hcCA9IG5ldyBJbnB1dE1hcCgtMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5tYXAgPSAzOTtcclxuICAgICAgICAgICAgICAgICAgICBtYXAuYW50aW1hcCA9IDM3O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKm1hcC5tYXAgPSA2ODtcclxuICAgICAgICAgICAgICAgICAgICBtYXAuYW50aW1hcD0gNjU7Ki9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpID09IDEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLm1hcCA9IDQwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5hbnRpbWFwID0gMzg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qbWFwLm1hcCA9IDgzO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5hbnRpbWFwID0gODc7Ki9cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAyKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vbWFwLm1hcCA9IDMyO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5tYXAgPSA5MDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpID09IDMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLm1hcCA9IDg4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gNClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXAubWFwID0gNjU7Ly9hXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSA1KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5tYXAgPSAxMzsvL2VudGVyXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBJbnB1dE1hcHBpbmcuQWRkKG1hcCk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgaW5pdGdhbWVwYWQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IE51bWJlck9mQWN0aW9ucylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSW5wdXRNYXAgbWFwID0gbmV3IElucHV0TWFwKC0xKTtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLm1hcCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLmF4aXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXAubWFwID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBtYXAuYXhpcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAxKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5tYXAgPSBpIC0gMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIElucHV0TWFwcGluZy5BZGQobWFwKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgZ2V0U3RhdGUoaW50IGFjdGlvbiwgSW5wdXRNYXAgbWFwID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChtYXAgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIG1hcCA9IElucHV0TWFwcGluZ1thY3Rpb25dO1xyXG4gICAgICAgICAgICAvKklucHV0Q29udHJvbGxlciBJQyA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmIChtYXAuY29udHJvbGxlciAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBJQyA9IG1hcC5jb250cm9sbGVyO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgc3RyaW5nIFRJRCA9IGlkO1xyXG4gICAgICAgICAgICBpZiAobWFwLmNvbnRyb2xsZXJJRCAhPSBcIlwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUSUQgPSBtYXAuY29udHJvbGxlcklEO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoVElEID09IFwiS2V5Ym9hcmRcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEtleWJvYXJkTWFwU3RhdGUobWFwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChUSUQgPT0gXCJNb3VzZVwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0TW91c2VNYXBTdGF0ZShtYXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEdhbWVwYWRNYXBTdGF0ZShtYXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBnZXRQcmVzc2VkKGludCBhY3Rpb24sIElucHV0TWFwIG1hcCA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0U3RhdGUoYWN0aW9uLCBtYXApID49IDAuN2Y7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBJbnB1dE1hcCBGaW5kQW55UHJlc3NlZEdhbWVQYWRJbnB1dCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBJbnB1dE1hcCByZXQgPSBuZXcgSW5wdXRNYXAoKTtcclxuICAgICAgICAgICAgTGlzdDxHYW1lUGFkPiBMID0gR2FtZVBhZE1hbmFnZXIuX3RoaXMuYWN0aXZlR2FtZXBhZHM7XHJcbiAgICAgICAgICAgIEwuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6Q2lybm9HYW1lLkdhbWVQYWQ+KShHID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXQubWFwID09IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC5jb250cm9sbGVySUQgPSBHLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIEdhbWVQYWRCdXR0b25bXSBHQiA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpDaXJub0dhbWUuR2FtZVBhZEJ1dHRvbj4oRy5idXR0b25zLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkdhbWVQYWRCdXR0b24sIGJvb2w+KShCID0+IEIucHJlc3NlZCkpLlRvQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoR0IuTGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldC5heGlzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEdhbWVQYWRCdXR0b24gdG1wID0gR0JbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldC5tYXAgPSBuZXcgTGlzdDxHYW1lUGFkQnV0dG9uPihHLmJ1dHRvbnMpLkluZGV4T2YodG1wKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaSA8IEcuYXhlcy5MZW5ndGggJiYgcmV0Lm1hcCA9PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKEcuYXhlc1tpXSkgPiAwLjcgJiYgTWF0aC5BYnMoRy5heGVzW2ldKSA8IDIuMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQuYXhpcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0Lm1hcCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEcuYXhlc1tpXSA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQubmFtZSA9IFwiYW50aVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQuYW50aW1hcCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbikgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKHJldC5tYXAgIT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgZ2V0TWFwQ29udHJvbGxlcklEKElucHV0TWFwIG1hcClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChtYXAuY29udHJvbGxlcklEICE9IFwiXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXAuY29udHJvbGxlcklEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgZ2V0TWFwQ29udHJvbGxlcklEKGludCBhY3Rpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0TWFwQ29udHJvbGxlcklEKElucHV0TWFwcGluZ1thY3Rpb25dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGZsb2F0IGdldEdhbWVwYWRNYXBTdGF0ZShJbnB1dE1hcCBtYXApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmcgVElEID0gaWQ7XHJcbiAgICAgICAgICAgIGlmIChtYXAuY29udHJvbGxlcklEICE9IFwiXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRJRCA9IG1hcC5jb250cm9sbGVySUQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgR2FtZVBhZCBQID0gR2FtZVBhZE1hbmFnZXIuX3RoaXMuR2V0UGFkKFRJRCk7XHJcbiAgICAgICAgICAgIGlmIChQID09IG51bGwgfHwgIVAuY29ubmVjdGVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIW1hcC5heGlzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoUC5idXR0b25zW21hcC5tYXBdLnByZXNzZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtYXAuYW50aW1hcCA+PSAwICYmIFAuYnV0dG9uc1ttYXAuYW50aW1hcF0ucHJlc3NlZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZmxvYXQpUC5heGVzW21hcC5tYXBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBmbG9hdCBnZXRLZXlib2FyZE1hcFN0YXRlKElucHV0TWFwIG1hcClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8aW50PiBMID0gS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlByZXNzZWRCdXR0b25zO1xyXG4gICAgICAgICAgICBpZiAoTC5Db250YWlucyhtYXAubWFwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDFmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKEwuQ29udGFpbnMobWFwLmFudGltYXApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTFmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZmxvYXQgZ2V0TW91c2VNYXBTdGF0ZShJbnB1dE1hcCBtYXApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PGludD4gTCA9IEtleWJvYXJkTWFuYWdlci5fdGhpcy5QcmVzc2VkTW91c2VCdXR0b25zO1xyXG4gICAgICAgICAgICBpZiAoTC5Db250YWlucyhtYXAubWFwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDFmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKEwuQ29udGFpbnMobWFwLmFudGltYXApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTFmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIElucHV0Q29udHJvbGxlck1hbmFnZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTGlzdDxJbnB1dENvbnRyb2xsZXI+IENvbnRyb2xsZXJzO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSW5wdXRDb250cm9sbGVyTWFuYWdlciBfdGhpc1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfX3RoaXMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfX3RoaXMgPSBuZXcgSW5wdXRDb250cm9sbGVyTWFuYWdlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgSW5pdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoX190aGlzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9fdGhpcyA9IG5ldyBJbnB1dENvbnRyb2xsZXJNYW5hZ2VyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0YXRpYyBJbnB1dENvbnRyb2xsZXJNYW5hZ2VyIF9fdGhpcztcclxuICAgICAgICBwcm90ZWN0ZWQgSW5wdXRDb250cm9sbGVyTWFuYWdlcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDb250cm9sbGVycyA9IG5ldyBMaXN0PElucHV0Q29udHJvbGxlcj4oKTtcclxuXHJcbiAgICAgICAgICAgIENvbnRyb2xsZXJzLkFkZChuZXcgSW5wdXRDb250cm9sbGVyKCkpO1xyXG4gICAgICAgICAgICBMaXN0PEdhbWVQYWQ+IGdhbWVwYWRzID0gR2FtZVBhZE1hbmFnZXIuX3RoaXMuYWN0aXZlR2FtZXBhZHM7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBnYW1lcGFkcy5Db3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbGxlcnMuQWRkKG5ldyBJbnB1dENvbnRyb2xsZXIoZ2FtZXBhZHNbaV0uaWQpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBJbnB1dE1hcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBpbnQgbWFwID0gLTE7XHJcbiAgICAgICAgcHVibGljIGludCBhbnRpbWFwID0gLTE7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBuYW1lID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgYm9vbCBheGlzID0gZmFsc2U7XHJcbiAgICAgICAgLy9wdWJsaWMgSW5wdXRDb250cm9sbGVyIGNvbnRyb2xsZXI7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjb250cm9sbGVySUQgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBJbnB1dE1hcCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBheGlzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBJbnB1dE1hcChpbnQgbWFwLCBpbnQgYW50aW1hcCA9IC0xLCBib29sIGF4aXMgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubWFwID0gbWFwO1xyXG4gICAgICAgICAgICB0aGlzLmFudGltYXAgPSBhbnRpbWFwO1xyXG4gICAgICAgICAgICB0aGlzLmF4aXMgPSBheGlzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgSlNPTkFyY2hpdmVcclxuICAgIHtcclxuICAgICAgICAvL3VzZSBGb2xkZXIySlNPTiB0byBjcmVhdGUgdGhlIGFyY2hpdmUuXHJcblxyXG4gICAgICAgIC8vcHVibGljIHN0cmluZyBBcmNoaXZlO1xyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PHN0cmluZywgc3RyaW5nPiBEYXRhID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBzdHJpbmc+KCk7XHJcbiAgICAgICAgcHVibGljIERpY3Rpb25hcnk8c3RyaW5nLCBIVE1MSW1hZ2VFbGVtZW50PiBJbWFnZXMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIEhUTUxJbWFnZUVsZW1lbnQ+KCk7XHJcbiAgICAgICAgcHVibGljIEpTT05BcmNoaXZlKHN0cmluZyBBcmNoaXZlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy90aGlzLkFyY2hpdmUgPSBBcmNoaXZlO1xyXG4gICAgICAgICAgICBzdHJpbmdbXVtdIEQgPSBTY3JpcHQuV3JpdGU8ZHluYW1pYz4oXCJKU09OLnBhcnNlKEFyY2hpdmUpXCIpO1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIHZhciBsbiA9IEQuTGVuZ3RoO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGxuKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgQSA9IERbaSsrXTtcclxuICAgICAgICAgICAgICAgIERhdGFbQVswXS5Ub0xvd2VyKCldID0gQVsxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgT3BlbihzdHJpbmcgQXJjaGl2ZUZpbGUsIEFjdGlvbjxKU09OQXJjaGl2ZT4gYWN0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgWE1MSHR0cFJlcXVlc3QgWEhSID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIC8vWEhSLlJlc3BvbnNlVHlwZSA9IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlLkJsb2I7XHJcbiAgICAgICAgICAgIFhIUi5PbkxvYWQgPSBFdnQgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uKG5ldyBKU09OQXJjaGl2ZShYSFIuUmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFhIUi5PcGVuKFwiR0VUXCIsIEFyY2hpdmVGaWxlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIFhIUi5TZW5kKCk7XHJcbiAgICAgICAgICAgIC8vaWYgKFhIUi5TdGF0dXMpXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBQcmVsb2FkSW1hZ2VzKEFjdGlvbiBhY3Rpb24sIGludCBkZWxheSA9IDEwMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBLID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Ub0FycmF5PHN0cmluZz4oRGF0YS5LZXlzKTtcclxuICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IERhdGEuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBBID0gS1tpXTtcclxuICAgICAgICAgICAgICAgIEdldEltYWdlKEEpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEdsb2JhbC5TZXRUaW1lb3V0KChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pYWN0aW9uLCBkZWxheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgR2V0RGF0YShzdHJpbmcgZmlsZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBmID0gZmlsZS5Ub0xvd2VyKCk7XHJcbiAgICAgICAgICAgIGlmIChEYXRhLkNvbnRhaW5zS2V5KGYpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRGF0YVtmXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEhUTUxJbWFnZUVsZW1lbnQgR2V0SW1hZ2Uoc3RyaW5nIGZpbGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZiA9IGZpbGUuVG9Mb3dlcigpO1xyXG4gICAgICAgICAgICBpZiAoSW1hZ2VzLkNvbnRhaW5zS2V5KGYpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSW1hZ2VzW2ZdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBEID0gR2V0RGF0YShmKTtcclxuICAgICAgICAgICAgaWYgKEQgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJldCA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIHJldC5PbkxvYWQgPSBFID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhlbHBlci5Mb2coXCJsb2FkZWQgXCIgKyBmICsgXCIgZnJvbSBKU09OIVwiKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0LlNyYyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgRDtcclxuICAgICAgICAgICAgSW1hZ2VzW2ZdID0gcmV0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgS2V5Ym9hcmRNYW5hZ2VyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIExpc3Q8aW50PiBQcmVzc2VkQnV0dG9ucztcclxuICAgICAgICBwdWJsaWMgTGlzdDxpbnQ+IFRhcHBlZEJ1dHRvbnM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBMaXN0PGludD4gUHJlc3NlZE1vdXNlQnV0dG9ucztcclxuICAgICAgICBwdWJsaWMgTGlzdDxpbnQ+IFRhcHBlZE1vdXNlQnV0dG9ucztcclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgTW91c2VQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgQ01vdXNlID0gbmV3IFZlY3RvcjIoKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBLZXlib2FyZE1hbmFnZXIgX3RoaXNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX190aGlzID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX190aGlzID0gbmV3IEtleWJvYXJkTWFuYWdlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgSW5pdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoX190aGlzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9fdGhpcyA9IG5ldyBLZXlib2FyZE1hbmFnZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGljIEtleWJvYXJkTWFuYWdlciBfX3RoaXM7XHJcbiAgICAgICAgcHJvdGVjdGVkIEtleWJvYXJkTWFuYWdlcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBQcmVzc2VkQnV0dG9ucyA9IG5ldyBMaXN0PGludD4oKTtcclxuICAgICAgICAgICAgVGFwcGVkQnV0dG9ucyA9IG5ldyBMaXN0PGludD4oKTtcclxuICAgICAgICAgICAgUHJlc3NlZE1vdXNlQnV0dG9ucyA9IG5ldyBMaXN0PGludD4oKTtcclxuICAgICAgICAgICAgVGFwcGVkTW91c2VCdXR0b25zID0gbmV3IExpc3Q8aW50PigpO1xyXG5cclxuICAgICAgICAgICAgUHJlZGljYXRlPEtleWJvYXJkRXZlbnQ+IEtEID0gb25LZXlEb3duO1xyXG4gICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJkb2N1bWVudC5vbmtleWRvd24gPSBLRDtcIik7XHJcblxyXG4gICAgICAgICAgICBBY3Rpb248S2V5Ym9hcmRFdmVudD4gS1UgPSBvbktleVVwO1xyXG4gICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJkb2N1bWVudC5vbmtleXVwID0gS1U7XCIpO1xyXG5cclxuICAgICAgICAgICAgQWN0aW9uPE1vdXNlRXZlbnQ+IE1NID0gb25Nb3VzZU1vdmU7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcImRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gTU07XCIpO1xyXG5cclxuICAgICAgICAgICAgUHJlZGljYXRlPE1vdXNlRXZlbnQ+IE1EID0gb25Nb3VzZURvd247XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcImRvY3VtZW50Lm9ubW91c2Vkb3duID0gTUQ7XCIpO1xyXG5cclxuICAgICAgICAgICAgUHJlZGljYXRlPE1vdXNlRXZlbnQ+IE1VID0gb25Nb3VzZVVwO1xyXG4gICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJkb2N1bWVudC5vbm1vdXNldXAgPSBNVTtcIik7XHJcblxyXG4gICAgICAgICAgICBQcmVkaWNhdGU8TW91c2VFdmVudD4gTkIgPSBOZXZlcmluQm91bmRzO1xyXG4gICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJkb2N1bWVudC5vbmNvbnRleHRtZW51ID0gTkJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfX3RoaXMuVGFwcGVkQnV0dG9ucy5DbGVhcigpO1xyXG4gICAgICAgICAgICBfX3RoaXMuVGFwcGVkTW91c2VCdXR0b25zLkNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgTmV2ZXJpbkJvdW5kcyhNb3VzZUV2ZW50IGV2dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAhQXBwLlNjcmVlbkJvdW5kcy5jb250YWluc1BvaW50KF90aGlzLkNNb3VzZS5YLCBfdGhpcy5DTW91c2UuWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgb25LZXlEb3duKEtleWJvYXJkRXZlbnQgZXZ0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGtleUNvZGUgPSBldnQuS2V5Q29kZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghX190aGlzLlByZXNzZWRCdXR0b25zLkNvbnRhaW5zKGtleUNvZGUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfX3RoaXMuUHJlc3NlZEJ1dHRvbnMuQWRkKGtleUNvZGUpO1xyXG4gICAgICAgICAgICAgICAgX190aGlzLlRhcHBlZEJ1dHRvbnMuQWRkKGtleUNvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgoa2V5Q29kZSA+PSAzNyAmJiBrZXlDb2RlIDw9IDQwKSB8fCBrZXlDb2RlID09IDMyIHx8IGtleUNvZGUgPT0gMTEyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgb25LZXlVcChLZXlib2FyZEV2ZW50IGV2dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBrZXlDb2RlID0gZXZ0LktleUNvZGU7XHJcblxyXG4gICAgICAgICAgICBpZiAoX190aGlzLlByZXNzZWRCdXR0b25zLkNvbnRhaW5zKGtleUNvZGUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfX3RoaXMuUHJlc3NlZEJ1dHRvbnMuUmVtb3ZlKGtleUNvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBvbk1vdXNlRG93bihNb3VzZUV2ZW50IGV2dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBidG4gPSBldnQuQnV0dG9uO1xyXG4gICAgICAgICAgICBpZiAoIV9fdGhpcy5QcmVzc2VkTW91c2VCdXR0b25zLkNvbnRhaW5zKGJ0bikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9fdGhpcy5QcmVzc2VkTW91c2VCdXR0b25zLkFkZChidG4pO1xyXG4gICAgICAgICAgICAgICAgX190aGlzLlRhcHBlZE1vdXNlQnV0dG9ucy5BZGQoYnRuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYnRuIDwgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIG9uTW91c2VVcChNb3VzZUV2ZW50IGV2dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBidG4gPSBldnQuQnV0dG9uO1xyXG4gICAgICAgICAgICBpZiAoX190aGlzLlByZXNzZWRNb3VzZUJ1dHRvbnMuQ29udGFpbnMoYnRuKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX190aGlzLlByZXNzZWRNb3VzZUJ1dHRvbnMuUmVtb3ZlKGJ0bik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJ0biA8IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBvbk1vdXNlTW92ZShNb3VzZUV2ZW50IGV2dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF90aGlzLk1vdXNlUG9zaXRpb24gPSBuZXcgVmVjdG9yMihldnQuQ2xpZW50WCwgZXZ0LkNsaWVudFkpO1xyXG5cclxuICAgICAgICAgICAgLy9mbG9hdCBsZWZ0ID0gZmxvYXQuUGFyc2UoQXBwLkNhbnZhcy5TdHlsZS5MZWZ0LlJlcGxhY2UoXCJweFwiLCBcIlwiKSk7XHJcbiAgICAgICAgICAgIGlmIChBcHAuRGl2LlN0eWxlLkxlZnQuSW5kZXhPZihcInB4XCIpPDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGZsb2F0IGxlZnQgPSBmbG9hdC5QYXJzZShBcHAuRGl2LlN0eWxlLkxlZnQuUmVwbGFjZShcInB4XCIsIFwiXCIpKTtcclxuICAgICAgICAgICAgZmxvYXQgeCA9IGV2dC5DbGllbnRYIC0gbGVmdDtcclxuICAgICAgICAgICAgZmxvYXQgeSA9IGV2dC5DbGllbnRZO1xyXG5cclxuICAgICAgICAgICAgLy9mbG9hdCBzY2FsZSA9IChBcHAuQ2FudmFzLldpZHRoICogMS4yNWYpIC8gZmxvYXQuUGFyc2UoQXBwLkNhbnZhcy5TdHlsZS5XaWR0aC5SZXBsYWNlKFwicHhcIiwgXCJcIikpO1xyXG5cclxuICAgICAgICAgICAgLy9mbG9hdCBzY2FsZSA9IChBcHAuQ2FudmFzLldpZHRoKSAvIGZsb2F0LlBhcnNlKEFwcC5DYW52YXMuU3R5bGUuV2lkdGguUmVwbGFjZShcInB4XCIsIFwiXCIpKTtcclxuICAgICAgICAgICAgZmxvYXQgc2NhbGUgPSAoQXBwLkNhbnZhcy5XaWR0aCkgLyBmbG9hdC5QYXJzZShBcHAuRGl2LlN0eWxlLldpZHRoLlJlcGxhY2UoXCJweFwiLCBcIlwiKSk7XHJcbiAgICAgICAgICAgIF90aGlzLkNNb3VzZSA9IG5ldyBWZWN0b3IyKHggKiBzY2FsZSwgeSAqIHNjYWxlKTtcclxuICAgICAgICAgICAgLy9Db25zb2xlLldyaXRlTGluZShcIm14OlwiK190aGlzLkNNb3VzZS54ICsgXCIgbXk6XCIgKyBfdGhpcy5DTW91c2UueSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIE1hcEdlbmVyYXRvclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTWFwUm9vbSByb290cm9vbTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIE1hcFJvb20gZG9vcnJvb207XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEdlbmVyYXRlKEdhbWUgZ2FtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBwbGF5ZXIgPSBnYW1lLnBsYXllcjsvL3BsYXllciBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgdmFyIG1hcCA9IGdhbWUuVE07Ly90aGUgdGlsZW1hcCB0byBnZW5lcmF0ZVxyXG4gICAgICAgICAgICB2YXIgYm91bmRzID0gZ2FtZS5zdGFnZUJvdW5kczsvL3RoZSBib3VuZHMgdG8gc3RheSB3aXRoaW5cclxuXHJcbiAgICAgICAgICAgIC8vTGlzdDxSZWN0YW5nbGU+IHJvb21zID0gbmV3IExpc3Q8UmVjdGFuZ2xlPigpO1xyXG5cclxuICAgICAgICAgICAgdmFyIFggPSAwO1xyXG4gICAgICAgICAgICB2YXIgWSA9IDA7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLlJhbmRvbSgpIDwgMC41KVxyXG4gICAgICAgICAgICAgICAgWCA9IE1hdGguUmFuZG9tKCkgPCAwLjUgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIFkgPSBNYXRoLlJhbmRvbSgpIDwgMC41ID8gLTEgOiAxO1xyXG4gICAgICAgICAgICBUaWxlRGF0YSBUID0gbmV3IFRpbGVEYXRhKCk7XHJcbiAgICAgICAgICAgIFQudGV4dHVyZSA9IDE7XHJcbiAgICAgICAgICAgIFQuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIFQudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIFQubWFwID0gbWFwO1xyXG4gICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgVC50b3BTb2xpZCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vbWFwLlNldEFsbChUKTtcclxuICAgICAgICAgICAgcGxheWVyLnggPSAoYm91bmRzLmxlZnQgKyBib3VuZHMucmlnaHQpIC8gMjtcclxuICAgICAgICAgICAgcGxheWVyLnkgPSAoYm91bmRzLnRvcCArIGJvdW5kcy5ib3R0b20pIC8gMjtcclxuICAgICAgICAgICAgLy9wYXRoTWluZXIoZ2FtZSxtYXAuY29sdW1ucy8yLG1hcC5yb3dzLzIsWCxZLDIwKTtcclxuICAgICAgICAgICAgcGF0aE1pbmVyKGdhbWUsIG1hcC5jb2x1bW5zIC8gMiwgbWFwLnJvd3MgLyA0LCBYLCBZLCAzMCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgViA9IEZpbmRFbXB0eVNwYWNlKGdhbWUpO1xyXG4gICAgICAgICAgICBpZiAoViAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIueCA9IFYuWDtcclxuICAgICAgICAgICAgICAgIHBsYXllci55ID0gVi5ZO1xyXG4gICAgICAgICAgICAgICAgSGVscGVyLkxvZyhcInNwYXduaW5nIGF0OlwiICsgKGludClWLlggKyBcIixcIiArIChpbnQpVi5ZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhlbHBlci5Mb2coXCJjYW5ub3QgbG9jYXRlIGEgc3Bhd24gcG9pbnQuLi5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEJveHlHZW5lcmF0ZShHYW1lIGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBIZWxwZXIuTG9nKFwiYm94eSBnZW5lcmF0ZVwiKTtcclxuICAgICAgICAgICAgdmFyIHBsYXllciA9IGdhbWUucGxheWVyOy8vcGxheWVyIGNoYXJhY3RlclxyXG4gICAgICAgICAgICB2YXIgbWFwID0gZ2FtZS5UTTsvL3RoZSB0aWxlbWFwIHRvIGdlbmVyYXRlXHJcbiAgICAgICAgICAgIHZhciBib3VuZHMgPSBnYW1lLnN0YWdlQm91bmRzOy8vdGhlIGJvdW5kcyB0byBzdGF5IHdpdGhpblxyXG4gICAgICAgICAgICBNYXBSb29tLlBsYWNlZFJvb21zID0gbmV3IExpc3Q8TWFwUm9vbT4oKTtcclxuICAgICAgICAgICAgTWFwUm9vbS5PcGVuUm9vbXMgPSBuZXcgTGlzdDxNYXBSb29tPigpO1xyXG5cclxuICAgICAgICAgICAgdmFyIFNYID0gbWFwLmNvbHVtbnMgLyAyO1xyXG4gICAgICAgICAgICB2YXIgU1kgPSBtYXAucm93cyAvIDM7XHJcbiAgICAgICAgICAgIHZhciByb290ID0gbmV3IE1hcFJvb20oKTtcclxuICAgICAgICAgICAgcm9vdC5TWCA9IFNYO1xyXG4gICAgICAgICAgICByb290LlNZID0gU1k7XHJcbiAgICAgICAgICAgIHJvb3QuRVggPSBTWCArIDYgKyAoaW50KShNYXRoLlJhbmRvbSgpICogMTApO1xyXG4gICAgICAgICAgICByb290LkVZID0gU1kgKyA2ICsgKGludCkoTWF0aC5SYW5kb20oKSAqIDEwKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgICAgIHJvb3Ryb29tID0gcm9vdDtcclxuXHJcbiAgICAgICAgICAgIC8vdmFyIHJvb210b3RhbCA9IDEyKyhpbnQpKE1hdGguUmFuZG9tKCkgKiAxMCk7XHJcbiAgICAgICAgICAgIC8vdmFyIHJvb210b3RhbCA9IDE2ICsgKGludCkoTWF0aC5SYW5kb20oKSAqIDE2KTtcclxuICAgICAgICAgICAgdmFyIHJvb210b3RhbCA9IDE2ICsgKGludCkoTWF0aC5SYW5kb20oKSAqIDE4KTtcclxuICAgICAgICAgICAgLy92YXIgcm9vbXMgPSAwO1xyXG5cclxuICAgICAgICAgICAgdmFyIGF0dGVtcHRzID0gNDAwO1xyXG4gICAgICAgICAgICB2YXIgUiA9IHJvb3Q7XHJcbiAgICAgICAgICAgIGlmICghcm9vdC5QbGFjZUFuZEV4cGFuZCgpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIZWxwZXIuTG9nKFwiQ291bGRuJ3QgZ2VuZXJhdGUgcm9vdCByb29tLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAoTWFwUm9vbS5PcGVuUm9vbXMuQ291bnQgPCByb29tdG90YWwgJiYgYXR0ZW1wdHMgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgTCA9IENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLlBpY2s8Z2xvYmFsOjpDaXJub0dhbWUuTWFwUm9vbT4oTWFwUm9vbS5GaW5kVmFsaWRVbnBsYWNlZFJvb21zKCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEwuUGxhY2VBbmRFeHBhbmQoKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3Jvb21zKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhdHRlbXB0cy0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBSUiA9IGdhbWUuc3RhZ2VCb3VuZHMgLSBnYW1lLlRNLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBSUi53aWR0aCAtPSBnYW1lLlRNLnRpbGVzaXplO1xyXG4gICAgICAgICAgICBSUi5oZWlnaHQgLT0gZ2FtZS5UTS50aWxlc2l6ZTtcclxuICAgICAgICAgICAgZ2FtZS5UTS5EcmF3UmVjdChSUik7XHJcbiAgICAgICAgICAgIGdhbWUuVE0uQXBwbHlCcmVha2FibGUoKTtcclxuICAgICAgICAgICAgdmFyIHNlY3JldHMgPSBNYXRoLlJhbmRvbSgpPDAuMyA/IDEgOiAwO1xyXG4gICAgICAgICAgICBpZiAoc2VjcmV0cyA+IDAgJiYgTWF0aC5SYW5kb20oKSA8IDAuMylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VjcmV0cysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlIChzZWNyZXRzID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIEwgPSBDaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5QaWNrPGdsb2JhbDo6Q2lybm9HYW1lLk1hcFJvb20+KE1hcFJvb20uRmluZFZhbGlkVW5wbGFjZWRSb29tcygpKTtcclxuICAgICAgICAgICAgICAgIGlmIChMLlBsYWNlQW5kRXhwYW5kKCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgTC5NYWtlU2VjcmV0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxldmVyID0gQXR0ZW1wdENyZWF0ZUxldmVyKGdhbWUsIEwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdhbWUuQWRkRW50aXR5KGxldmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBIZWxwZXIuTG9nKFwiUGxhY2VkIHNlY3JldCByb29tIGF0OlwiICsgTC5TWCArIFwiLFwiICsgTC5TWSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzZWNyZXRzLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIFYgPSBGaW5kRW1wdHlTcGFjZShnYW1lKTtcclxuICAgICAgICAgICAgaWYgKFYgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLypwbGF5ZXIueCA9IFYuWDtcclxuICAgICAgICAgICAgICAgIHBsYXllci55ID0gVi5ZOyovXHJcbiAgICAgICAgICAgICAgICBnYW1lLkRvb3IuUG9zaXRpb24uQ29weUZyb20oVik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLkRvb3IuRHJvcFRvR3JvdW5kKCk7XHJcbiAgICAgICAgICAgICAgICBkb29ycm9vbSA9IE1hcFJvb20uRmluZFJvb20oZ2FtZS5Eb29yLlBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIGlmIChkb29ycm9vbSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEhlbHBlci5Mb2coXCJEb29yIHJvb20gY291bGQgbm90IGJlIGRldGVybWluZWQuLi5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBQQyA9IChQbGF5ZXJDaGFyYWN0ZXIpcGxheWVyO1xyXG4gICAgICAgICAgICAgICAgLy9QQy5Nb3ZlVG9OZXdTcGF3bihWKTtcclxuICAgICAgICAgICAgICAgIFBDLk1vdmVUb05ld1NwYXduKGdhbWUuRG9vci5Qb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICBIZWxwZXIuTG9nKFwic3Bhd25pbmcgYXQ6XCIgKyAoaW50KVYuWCArIFwiLFwiICsgKGludClWLlkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSGVscGVyLkxvZyhcImNhbm5vdCBsb2NhdGUgYSBzcGF3biBwb2ludC4uLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBSb29tT3BlbmluZ0xldmVyIEF0dGVtcHRDcmVhdGVMZXZlcihHYW1lIGdhbWUsTWFwUm9vbSBUYXJnZXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgMjApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBsZXZlciA9IFJvb21PcGVuaW5nTGV2ZXIuRmluZEFuZFBsYWNlT25XYWxsKGdhbWUsIE1hcFJvb20uRmluZEFueUVtcHR5U3BvdCgpLCBUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxldmVyICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxldmVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFZlY3RvcjIgRmluZEVtcHR5U3BhY2UoR2FtZSBnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIG1hcCA9IGdhbWUuVE07XHJcbiAgICAgICAgICAgIHZhciBib3VuZHMgPSBnYW1lLnN0YWdlQm91bmRzOy8vdGhlIGJvdW5kcyB0byBzdGF5IHdpdGhpblxyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIHZhciByZXQgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgICAgICB2YXIgdG1wID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCAyMDAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXQuWCA9IChmbG9hdCkoYm91bmRzLmxlZnQgKyAoTWF0aC5SYW5kb20oKSAqIChib3VuZHMud2lkdGggLSBtYXAudGlsZXNpemUpKSk7XHJcbiAgICAgICAgICAgICAgICByZXQuWSA9IChmbG9hdCkoYm91bmRzLnRvcCArIChNYXRoLlJhbmRvbSgpICogKGJvdW5kcy5ib3R0b20gLSBtYXAudGlsZXNpemUpKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW1hcC5DaGVja0ZvclRpbGUocmV0KS52aXNpYmxlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRtcC5YID0gcmV0Llg7XHJcbiAgICAgICAgICAgICAgICAgICAgdG1wLlkgPSByZXQuWSAtIG1hcC50aWxlc2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1hcC5DaGVja0ZvclRpbGUocmV0KS52aXNpYmxlKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9yZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jcmVhdGUgdHVubmVscyBoYWxsd2F5cyBldGNcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIHBhdGhNaW5lcihHYW1lIGdhbWUsIGludCBYLCBpbnQgWSwgaW50IFhkaXIsIGludCBZRGlyLCBpbnQgbGltaXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobGltaXQgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwbGF5ZXIgPSBnYW1lLnBsYXllcjsvL3BsYXllciBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgdmFyIG1hcCA9IGdhbWUuVE07Ly90aGUgdGlsZW1hcCB0byBnZW5lcmF0ZVxyXG4gICAgICAgICAgICB2YXIgYm91bmRzID0gZ2FtZS5zdGFnZUJvdW5kczsvL3RoZSBib3VuZHMgdG8gc3RheSB3aXRoaW5cclxuXHJcbiAgICAgICAgICAgIHZhciBkaXN0ID0gMDtcclxuICAgICAgICAgICAgdmFyIHBvdyA9IDE7XHJcbiAgICAgICAgICAgIGlmIChZRGlyICE9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBvdyA9IDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2hpbGUgKGRpc3QgPCA3ICYmIE1hdGguUmFuZG9tKCkgPCAoTWF0aC5Qb3coMC45NSwgcG93KSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFggKz0gWGRpcjtcclxuICAgICAgICAgICAgICAgIFkgKz0gWURpcjtcclxuICAgICAgICAgICAgICAgIEVyYXNlKG1hcCwgWCwgWSwgMyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5SYW5kb20oKSA8ICgwLjIgKiBwb3cpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChYZGlyID09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFggKz0gTWF0aC5SYW5kb20oKSA8IDAuNSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFkgKz0gTWF0aC5SYW5kb20oKSA8IDAuNSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKE1hdGguUmFuZG9tKCkgPCAoMC4wMiAqIHBvdykgJiYgbGltaXQgPiA0KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbWl0ID0gbGltaXQgLyAyO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBYRCA9IE1hdGguUmFuZG9tKCkgPCAwLjUgPyBZRGlyIDogLVlEaXI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIFlEID0gTWF0aC5SYW5kb20oKSA8IDAuNSA/IFhkaXIgOiAtWGRpcjtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoTWluZXIoZ2FtZSwgWCwgWSwgWEQsIFlELCBsaW1pdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGltaXQtLTtcclxuICAgICAgICAgICAgaWYgKGxpbWl0ID4gMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm9vbU1pbmVyKGdhbWUsIFgsIFksIFhkaXIsIFlEaXIsIGxpbWl0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCByb29tTWluZXIoR2FtZSBnYW1lLCBpbnQgWCwgaW50IFksIGludCBYZGlyLCBpbnQgWURpciwgaW50IGxpbWl0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxpbWl0IDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIFNaID0gKGludCkoNCArIChNYXRoLlJhbmRvbSgpICogNCkpO1xyXG4gICAgICAgICAgICBYICs9IFhkaXIgKiAoU1ogLyAyKTtcclxuICAgICAgICAgICAgWSArPSBZRGlyICogKFNaIC8gMik7XHJcblxyXG4gICAgICAgICAgICAvL0VyYXNlKGdhbWUuVE0sIFgsIFksIChTWiAqIDIpKzIpO1xyXG4gICAgICAgICAgICBFcmFzZUFuZFJhbmRvKGdhbWUuVE0sIFgsIFksIChTWiAqIDIpICsgMik7XHJcblxyXG4gICAgICAgICAgICB2YXIgWEQgPSBYZGlyO1xyXG4gICAgICAgICAgICB2YXIgWUQgPSBZRGlyO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5SYW5kb20oKSA8IDAuMjAgfHwgKFlEICE9IDAgJiYgTWF0aC5SYW5kb20oKSA8IDAuNjUpIHx8IFlEIDwgMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWEQgPSBNYXRoLlJhbmRvbSgpIDwgMC41ID8gWURpciA6IC1ZRGlyO1xyXG4gICAgICAgICAgICAgICAgWUQgPSBNYXRoLlJhbmRvbSgpIDwgMC41ID8gWGRpciA6IC1YZGlyO1xyXG4gICAgICAgICAgICAgICAgaWYgKFlEIDwgMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBZRCA9IC1ZRDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBYZGlyID0gWEQ7XHJcbiAgICAgICAgICAgIFlEaXIgPSBZRDtcclxuXHJcbiAgICAgICAgICAgIFggKz0gWGRpciAqIChTWiAvIDIpO1xyXG4gICAgICAgICAgICBZICs9IFlEaXIgKiAoU1ogLyAyKTtcclxuXHJcbiAgICAgICAgICAgIGxpbWl0LS07XHJcbiAgICAgICAgICAgIHBhdGhNaW5lcihnYW1lLCBYLCBZLCBYZGlyLCBZRGlyLCBsaW1pdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIFRpbGVEYXRhIGJsYW5rID0gbmV3IFRpbGVEYXRhKCk7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBFcmFzZShUaWxlTWFwIFRNLCBpbnQgY29sdW1uLCBpbnQgcm93LCBpbnQgc2l6ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRNLkNsZWFyUmVjdChjb2x1bW4gLSAoc2l6ZSAvIDIpLCByb3cgLSAoc2l6ZSAvIDIpLCAoc2l6ZSksIChzaXplKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgRXJhc2VBbmRSYW5kbyhUaWxlTWFwIFRNLCBpbnQgY29sdW1uLCBpbnQgcm93LCBpbnQgc2l6ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBTWCA9IGNvbHVtbiAtIChzaXplIC8gMik7XHJcbiAgICAgICAgICAgIHZhciBTWSA9IHJvdyAtIChzaXplIC8gMik7XHJcbiAgICAgICAgICAgIFRNLkNsZWFyUmVjdChTWCwgU1ksIChzaXplKSwgKHNpemUpKTtcclxuICAgICAgICAgICAgVE0uX0dlblJlY3QoU1gsIFNZLCBTWCArIChzaXplKSwgU1kgKyAoc2l6ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3ByaXZhdGUgdm9pZCBHcm93Um9vbXMoTGlzdDxSZWN0YW5nbGU+IHJvb21zLClcclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNYXBSb29tXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGludCBTWDtcclxuICAgICAgICBwdWJsaWMgaW50IFNZO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgRVg7XHJcbiAgICAgICAgcHVibGljIGludCBFWTtcclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgcGxhY2VkID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIGJvb2wgc2VjcmV0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vcHVibGljIFBvaW50W10gRXhpdHM7XHJcbiAgICAgICAgcHVibGljIExpc3Q8TWFwUm9vbT4gRXhpdFJvb21zID0gbmV3IExpc3Q8TWFwUm9vbT4oKTsvL2Nvbm5lY3RlZCByb29tc1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8TWFwUm9vbT4gUGxhY2VkUm9vbXMgPSBuZXcgTGlzdDxNYXBSb29tPigpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTGlzdDxNYXBSb29tPiBPcGVuUm9vbXMgPSBuZXcgTGlzdDxNYXBSb29tPigpO1xyXG4gICAgICAgIHB1YmxpYyBNYXBSb29tIHBhcmVudDtcclxuICAgICAgICBwdWJsaWMgQ2hlc3RbXSBnb2xkY2hlc3RzID0gbmV3IENoZXN0WzBdO1xyXG5cclxuICAgICAgICBwdWJsaWMgR2FtZSBnYW1lO1xyXG4gICAgICAgIHB1YmxpYyBib29sIElzVmFsaWQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIG1hcCA9IGdhbWUuVE07XHJcbiAgICAgICAgICAgIGlmIChTWCA+PSAwICYmIFNZID49IDAgJiYgRVggPCBtYXAuY29sdW1ucyAmJiBFWSA8IG1hcC5yb3dzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2luIGJvdW5kc1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBDYW5CZVBsYWNlZCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbWFwID0gZ2FtZS5UTTtcclxuICAgICAgICAgICAgaWYgKElzVmFsaWQoKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hcC5Jc1JlY3RTb2xpZChTWCwgU1ksIEVYLCBFWSkpLy9yb29tIGhhcyBubyBpbnRlcnNlY3RpbmcgZ2Fwcy5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBHZW5lcmF0ZUFkamFjZW50Um9vbXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIE0gPSBHZW5lcmF0ZUFkamFjZW50Um9vbSgtMSwgMCk7XHJcbiAgICAgICAgICAgIGlmIChNICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBFeGl0Um9vbXMuQWRkKE0pO1xyXG4gICAgICAgICAgICBNID0gR2VuZXJhdGVBZGphY2VudFJvb20oMSwgMCk7XHJcbiAgICAgICAgICAgIGlmIChNICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBFeGl0Um9vbXMuQWRkKE0pO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5SYW5kb20oKSA8IDAuNSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgTSA9IEdlbmVyYXRlQWRqYWNlbnRSb29tKDAsIC0xKTtcclxuICAgICAgICAgICAgICAgIGlmIChNICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgRXhpdFJvb21zLkFkZChNKTtcclxuICAgICAgICAgICAgICAgIE0gPSBHZW5lcmF0ZUFkamFjZW50Um9vbSgwLCAxKTtcclxuICAgICAgICAgICAgICAgIGlmIChNICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgRXhpdFJvb21zLkFkZChNKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIE1hcFJvb20gR2VuZXJhdGVBZGphY2VudFJvb20oaW50IFhkaXIsIGludCBZZGlyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLyp2YXIgbWluID0gNjtcclxuICAgICAgICAgICAgdmFyIG1heCA9IDE4OyovXHJcbiAgICAgICAgICAgIHZhciBtaW4gPSA1O1xyXG4gICAgICAgICAgICB2YXIgbWF4ID0gMTM7XHJcbiAgICAgICAgICAgIHZhciBkaWYgPSAobWF4IC0gbWluKTtcclxuICAgICAgICAgICAgaW50IFcgPSAoaW50KShtaW4gKyAoTWF0aC5SYW5kb20oKSAqIGRpZikpO1xyXG4gICAgICAgICAgICBpbnQgSCA9IChpbnQpKG1pbiArIChNYXRoLlJhbmRvbSgpICogZGlmKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgWCA9IC0xO1xyXG4gICAgICAgICAgICB2YXIgWSA9IC0xO1xyXG4gICAgICAgICAgICBpZiAoWGRpciAhPSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBZID0gKGludCkoU1kgKyAoTWF0aC5SYW5kb20oKSAqIChFWSAtIFNZKSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKFhkaXIgPCAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFggPSBTWCAtIFc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgWCA9IEVYO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKFlkaXIgIT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWCA9IChpbnQpKFNYICsgTWF0aC5SYW5kb20oKSAqICgoRVggLSBTWCkpKTtcclxuICAgICAgICAgICAgICAgIGlmIChZZGlyIDwgMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBZID0gU1kgLSBIO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFkgPSBFWTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFggPj0gMCAmJiBZID49IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBNID0gbmV3IE1hcFJvb20oKTtcclxuICAgICAgICAgICAgICAgIE0uU1ggPSBYO1xyXG4gICAgICAgICAgICAgICAgTS5TWSA9IFk7XHJcbiAgICAgICAgICAgICAgICBNLkVYID0gWCArIFc7XHJcbiAgICAgICAgICAgICAgICBNLkVZID0gWSArIEg7XHJcbiAgICAgICAgICAgICAgICBNLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBNLmdhbWUgPSBnYW1lO1xyXG4gICAgICAgICAgICAgICAgaWYgKE0uQ2FuQmVQbGFjZWQoKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBMaXN0PE1hcFJvb20+IEZpbmRWYWxpZFVucGxhY2VkUm9vbXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIEwgPSBuZXcgTGlzdDxNYXBSb29tPigpO1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIHZhciBsbiA9IE9wZW5Sb29tcy5Db3VudDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIFAgPSBPcGVuUm9vbXNbaV07XHJcbiAgICAgICAgICAgICAgICBMLkFkZFJhbmdlKFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpDaXJub0dhbWUuTWFwUm9vbT4oUC5FeGl0Um9vbXMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpDaXJub0dhbWUuTWFwUm9vbSwgYm9vbD4pKEYgPT4gRi5DYW5CZVBsYWNlZCgpICYmICFGLnBsYWNlZCkpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gTDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgQ29udGFpbnNUaWxlKGludCBYLGludCBZKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIFggPj0gU1ggJiYgWSA+PSBTWSAmJiBYIDwgRVggJiYgWSA8IEVZO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBDb250YWluc1Bvc2l0aW9uKFZlY3RvcjIgVilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBYID0gKGludCkoKFYuWCAtIGdhbWUuVE0ucG9zaXRpb24uWCkgLyBnYW1lLlRNLnRpbGVzaXplKTtcclxuICAgICAgICAgICAgaW50IFkgPSAoaW50KSgoVi5ZIC0gZ2FtZS5UTS5wb3NpdGlvbi5ZKSAvIGdhbWUuVE0udGlsZXNpemUpO1xyXG4gICAgICAgICAgICByZXR1cm4gWCA+PSBTWCAmJiBZID49IFNZICYmIFggPCBFWCAmJiBZIDwgRVk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTWFwUm9vbSBGaW5kUm9vbShWZWN0b3IyIFYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgTCA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpDaXJub0dhbWUuTWFwUm9vbT4oT3BlblJvb21zLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLk1hcFJvb20sIGJvb2w+KShSID0+IFIuQ29udGFpbnNQb3NpdGlvbihWKSkpLlRvQXJyYXkoKTtcclxuICAgICAgICAgICAgaWYgKEwuTGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHJldHVybiBMWzBdO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBjbGVhcnMgb3V0IHRoZSByb29tJ3MgYXJlYSwgYW5kIGF0dGVtcHRzIHRvIGdlbmVyYXRlIGV4aXRyb29tcy5cclxuICAgICAgICAvLy8gSWYgdGhlIHJvb20gaXMgaW52YWxpZCBpdCBkb2VzIG5vdGhpbmcsIGFuZCByZW1vdmVzIGl0c2VsZiBmcm9tIGl0J3MgcGFyZW50IGxpc3QuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAvLy8gPHJldHVybnM+cmV0dXJucyB0cnVlIGlmIGl0IHdhcyB2YWxpZCBhbmQgd2FzIHBsYWNlZC48L3JldHVybnM+XHJcbiAgICAgICAgcHVibGljIGJvb2wgUGxhY2VBbmRFeHBhbmQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKEV4aXRSb29tcy5Db3VudCA8IDEgJiYgIXBsYWNlZCAmJiBDYW5CZVBsYWNlZCgpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBQbGFjZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBHZW5lcmF0ZUFkamFjZW50Um9vbXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBwbGFjZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoIXBsYWNlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChDaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Db250YWluc0I8Z2xvYmFsOjpDaXJub0dhbWUuTWFwUm9vbT4ocGFyZW50LkV4aXRSb29tcyx0aGlzKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudC5FeGl0Um9vbXMuUmVtb3ZlKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZvaWQgR2VuZXJhdGVHb2xkQ2hlc3RzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsb2NrZWQgPSAhT3BlblJvb21zLkNvbnRhaW5zKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIFYgPSBGaW5kRW1wdHlTcG90KCk7XHJcbiAgICAgICAgICAgIHZhciBjaGVzdCA9IG5ldyBDaGVzdChnYW1lKTtcclxuQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuUHVzaDxnbG9iYWw6OkNpcm5vR2FtZS5DaGVzdD4oICAgICAgICAgICAgZ29sZGNoZXN0cyxjaGVzdCk7XHJcbiAgICAgICAgICAgIGNoZXN0LkZvcmNlTG9ja2VkID0gbG9ja2VkO1xyXG4gICAgICAgICAgICBjaGVzdC5Qb3NpdGlvbi5Db3B5RnJvbShWKTtcclxuICAgICAgICAgICAgY2hlc3QuR29sZGlmeSgpO1xyXG4gICAgICAgICAgICBnYW1lLkFkZEVudGl0eShjaGVzdCk7XHJcblxyXG4gICAgICAgICAgICBWZWN0b3IyIFYyID0gRmluZEVtcHR5U3BvdCgpO1xyXG4gICAgICAgICAgICB2YXIgYXR0ZW1wdHMgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoYXR0ZW1wdHMrKyA8IDUgJiYgKFYyID09IG51bGwgfHwgTWF0aC5BYnMoVjIuWCAtIFYuWCkgPCAxNikpIHsgVjIgPSBGaW5kRW1wdHlTcG90KCk7IH1cclxuXHJcbiAgICAgICAgICAgIGlmIChWMiAhPSBudWxsICYmIE1hdGguQWJzKFYyLlggLSBWLlgpID4gMTYpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNoZXN0ID0gbmV3IENoZXN0KGdhbWUpO1xyXG5DaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5QdXNoPGdsb2JhbDo6Q2lybm9HYW1lLkNoZXN0PiggICAgICAgICAgICAgICAgZ29sZGNoZXN0cyxjaGVzdCk7XHJcbiAgICAgICAgICAgICAgICBjaGVzdC5Qb3NpdGlvbi5Db3B5RnJvbShWMik7XHJcbiAgICAgICAgICAgICAgICBjaGVzdC5Gb3JjZUxvY2tlZCA9IGxvY2tlZDtcclxuICAgICAgICAgICAgICAgIGNoZXN0LkdvbGRpZnkoKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuQWRkRW50aXR5KGNoZXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBOTWFrZVNlY3JldCgpLy9icm9rZW5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBUTSA9IGdhbWUuVE07XHJcbiAgICAgICAgICAgIHZhciBXID0gRVggLSBTWDtcclxuICAgICAgICAgICAgdmFyIEggPSBFWSAtIFNZO1xyXG4gICAgICAgICAgICAvL1RNLkZpbGxSZWN0KFNYLCBTWSwgVywgSCk7XHJcbiAgICAgICAgICAgIC8vQ2xlYXJSb29tKCk7XHJcbiAgICAgICAgICAgIC8vL1RNLkNsZWFyUmVjdChTWCwgU1ksIFcsIEgpO1xyXG4gICAgICAgICAgICBUTS5EcmF3UmVjdChTWCwgU1ksIFcsIEgpO1xyXG4gICAgICAgICAgICBUTS5TZXRCcmVha2FibGVSZWN0KFNYLCBTWSwgVywgSCwgZmFsc2UpO1xyXG4gICAgICAgICAgICBUTS5DbGVhclJlY3QoU1ggKyAxLCBTWSArIDEsIFcgLSAyLCBIIC0gMik7XHJcblxyXG4gICAgICAgICAgICAvLy9UTS5fR2VuUmVjdChTWCwgU1ksIEVYLCBFWSk7XHJcbiAgICAgICAgICAgIC8vLy9UTS5TZXRCcmVha2FibGVSZWN0KFNYICsgMSwgU1kgKyAxLCBXIC0gMiwgSCAtIDIsIHRydWUpO1xyXG4gICAgICAgICAgICBpZiAoT3BlblJvb21zLkNvbnRhaW5zKHRoaXMpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBPcGVuUm9vbXMuUmVtb3ZlKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlY3JldCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBHZW5lcmF0ZUdvbGRDaGVzdHMoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEZvcmNlUmVkcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1ha2VTZWNyZXQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFRNID0gZ2FtZS5UTTtcclxuICAgICAgICAgICAgdmFyIFcgPSBFWCAtIFNYO1xyXG4gICAgICAgICAgICB2YXIgSCA9IEVZIC0gU1k7XHJcbiAgICAgICAgICAgIFRNLkZpbGxSZWN0KFNYLCBTWSwgVywgSCk7XHJcbiAgICAgICAgICAgIFRNLlNldEJyZWFrYWJsZVJlY3QoU1gsIFNZLCBXLCBILGZhbHNlKTtcclxuICAgICAgICAgICAgVE0uU2V0QnJlYWthYmxlUmVjdChTWCsxLCBTWSsxLCBXLTIsIEgtMiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmIChPcGVuUm9vbXMuQ29udGFpbnModGhpcykpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE9wZW5Sb29tcy5SZW1vdmUodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VjcmV0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgTlVubGVhc2hTZWNyZXQoKS8vYnJva2VuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgVE0gPSBnYW1lLlRNO1xyXG5cclxuICAgICAgICAgICAgVE0uQ2xlYXJPdXRlclJlY3QoU1gsIFNZLCAoRVggLSBTWCksIChFWSAtIFNZKSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAvL1RNLkNsZWFyUmVjdChTWCsxLCBTWSsxLCAoRVggLSBTWCktMiwgKEVZIC0gU1kpLTIpO1xyXG4gICAgICAgICAgICAvL1RNLl9HZW5SZWN0KFNYLCBTWSwgRVgsIEVZKTtcclxuXHJcbiAgICAgICAgICAgIE9wZW5Sb29tcy5BZGQodGhpcyk7XHJcbkNpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkZvckVhY2g8Z2xvYmFsOjpDaXJub0dhbWUuQ2hlc3Q+KCAgICAgICAgICAgIGdvbGRjaGVzdHMsKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkNpcm5vR2FtZS5DaGVzdD4pKEMgPT4gQy5Gb3JjZUxvY2tlZCA9IGZhbHNlKSk7XHJcblxyXG4gICAgICAgICAgICBGb3JjZVJlZHJhdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBVbmxlYXNoU2VjcmV0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBUTSA9IGdhbWUuVE07XHJcblxyXG4gICAgICAgICAgICBUTS5DbGVhclJlY3QoU1ggKyAxLCBTWSArIDEsIChFWCAtIFNYKSAtIDIsIChFWSAtIFNZKSAtIDIpO1xyXG4gICAgICAgICAgICBUTS5fR2VuUmVjdChTWCwgU1ksIEVYLCBFWSk7XHJcblxyXG4gICAgICAgICAgICBPcGVuUm9vbXMuQWRkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgR2VuZXJhdGVHb2xkQ2hlc3RzKCk7XHJcbiAgICAgICAgICAgIEZvcmNlUmVkcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENsZWFyUm9vbSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgVE0gPSBnYW1lLlRNO1xyXG5cclxuICAgICAgICAgICAgVE0uQ2xlYXJSZWN0KFNYLCBTWSwgRVggLSBTWCwgRVkgLSBTWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEdlbmVyYXRlUGxhdGZvcm1zKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBUTSA9IGdhbWUuVE07XHJcbiAgICAgICAgICAgIFRNLl9HZW5SZWN0KFNYLCBTWSwgRVgsIEVZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFBsYWNlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBUTSA9IGdhbWUuVE07XHJcbiAgICAgICAgICAgIFRNLkNsZWFyUmVjdChTWCwgU1ksIEVYIC0gU1gsIEVZIC0gU1kpO1xyXG4gICAgICAgICAgICBUTS5fR2VuUmVjdChTWCwgU1ksIEVYLCBFWSk7XHJcblxyXG4gICAgICAgICAgICBQbGFjZWRSb29tcy5BZGQodGhpcyk7XHJcbiAgICAgICAgICAgIE9wZW5Sb29tcy5BZGQodGhpcyk7XHJcbiAgICAgICAgICAgIHBsYWNlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFwcGx5QnJlYWthYmxlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBUTSA9IGdhbWUuVE07XHJcbiAgICAgICAgICAgIFRNLkFwcGx5QnJlYWthYmxlUmVjdChTWCAtIDIsIFNZIC0gMiwgKEVYIC0gU1gpICsgNCwgKEVZIC0gU1kpICsgNCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEZvcmNlUmVkcmF3KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBUTSA9IGdhbWUuVE07XHJcbiAgICAgICAgICAgIHZhciBYID0gU1ggLSAyO1xyXG4gICAgICAgICAgICB2YXIgWSA9IFNZIC0gMjtcclxuICAgICAgICAgICAgdmFyIFcgPSAoRVggLSBTWCkrNDtcclxuICAgICAgICAgICAgdmFyIEggPSAoRVkgLSBTWSkrNDtcclxuICAgICAgICAgICAgVE0uYmcuQ2xlYXJSZWN0KChpbnQpVE0udGlsZXNpemUgKiBYLCAoaW50KVRNLnRpbGVzaXplICogWSwgKGludClUTS50aWxlc2l6ZSAqIFcsIChpbnQpVE0udGlsZXNpemUgKiBIKTtcclxuXHJcbiAgICAgICAgICAgIFRNLlJlZHJhdyhUTS5iZywgWCwgWSwgVywgSCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVmVjdG9yMiBGaW5kQW55RW1wdHlTcG90KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChPcGVuUm9vbXMuQ291bnQgPCAxKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCAxMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLlBpY2s8Z2xvYmFsOjpDaXJub0dhbWUuTWFwUm9vbT4oT3BlblJvb21zLFJORykuRmluZEVtcHR5U3BvdCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJldCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIFJhbmRvbSBSTkcgPSBuZXcgUmFuZG9tKCk7XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgRmluZEVtcHR5U3BvdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgVyA9IEVYIC0gU1g7XHJcbiAgICAgICAgICAgIHZhciBIID0gRVkgLSBTWTtcclxuICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbWFwID0gZ2FtZS5UTTtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCA1MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIFggPSAoaW50KShTWCArIE1hdGguUmFuZG9tKCkgKiBXKTtcclxuICAgICAgICAgICAgICAgIHZhciBZID0gKGludCkoU1kgKyBNYXRoLlJhbmRvbSgpICogSCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgVCA9IG1hcC5HZXRUaWxlKFgsIFkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKFQgIT0gbnVsbCAmJiAoIVQuZW5hYmxlZCB8fCAhVC5zb2xpZCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVCA9IG1hcC5HZXRUaWxlKFgsIFkgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoVCAhPSBudWxsICYmICghVC5lbmFibGVkIHx8ICFULnNvbGlkKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihtYXAucG9zaXRpb24uWCArIChYICogbWFwLnRpbGVzaXplKSwgbWFwLnBvc2l0aW9uLlkgKyAoWSAqIG1hcC50aWxlc2l6ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLypwcml2YXRlIHN0YXRpYyBUaWxlRGF0YSBibGFuayA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgRXJhc2UoVGlsZU1hcCBUTSwgaW50IGNvbHVtbiwgaW50IHJvdywgaW50IHNpemUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBUTS5DbGVhclJlY3QoY29sdW1uIC0gKHNpemUgLyAyKSwgcm93IC0gKHNpemUgLyAyKSwgKHNpemUpLCAoc2l6ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIEVyYXNlQW5kUmFuZG8oVGlsZU1hcCBUTSwgaW50IGNvbHVtbiwgaW50IHJvdywgaW50IHNpemUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgU1ggPSBjb2x1bW4gLSAoc2l6ZSAvIDIpO1xyXG4gICAgICAgICAgICB2YXIgU1kgPSByb3cgLSAoc2l6ZSAvIDIpO1xyXG4gICAgICAgICAgICBUTS5DbGVhclJlY3QoU1gsIFNZLCAoc2l6ZSksIChzaXplKSk7XHJcbiAgICAgICAgICAgIFRNLl9HZW5SZWN0KFNYLCBTWSwgU1ggKyAoc2l6ZSksIFNZICsgKHNpemUpKTtcclxuICAgICAgICB9Ki9cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgTWF0aEhlbHBlclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBjb25zdCBmbG9hdCBQSSA9IDMuMTQxNTkyNjUzNTlmO1xyXG4gICAgICAgIHB1YmxpYyBjb25zdCBmbG9hdCBQSTIgPSA2LjI4MzE4NTMwNzE4ZjtcclxuXHJcbiAgICAgICAgcHVibGljIGNvbnN0IGZsb2F0IFBJT3ZlcjIgPSAxLjU3MDc5NjMyNjc5NWY7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmxvYXQgRGlzdGFuY2VCZXR3ZWVuUG9pbnRzKFZlY3RvcjIgQSwgVmVjdG9yMiBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIERpc3RhbmNlQmV0d2VlblBvaW50cyhBLlgsIEEuWSwgQi5YLCBCLlkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGZsb2F0IERpc3RhbmNlQmV0d2VlblBvaW50cyhmbG9hdCB4MSwgZmxvYXQgeTEsIGZsb2F0IHgyLCBmbG9hdCB5MilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAoZmxvYXQpTWF0aC5TcXJ0KChNYXRoLlBvdyh4MSAtIHgyLCAyKSArIE1hdGguUG93KHkxIC0geTIsIDIpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmxvYXQgQ2xhbXAoZmxvYXQgdmFsdWUsIGZsb2F0IG1pbiwgZmxvYXQgbWF4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIChmbG9hdClNYXRoLk1pbihtYXgsIE1hdGguTWF4KG1pbiwgdmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgQ2xhbXAoZG91YmxlIHZhbHVlLCBkb3VibGUgbWluID0gMCwgZG91YmxlIG1heCA9IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5NaW4obWF4LCBNYXRoLk1heChtaW4sIHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmxvYXQgTGVycChmbG9hdCB2YWx1ZTEsIGZsb2F0IHZhbHVlMiwgZmxvYXQgYW1vdW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlMSArICgodmFsdWUyIC0gdmFsdWUxKSAqIGFtb3VudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmxvYXQgRGVncmVlc1RvUmFkaWFucyhmbG9hdCBkZWdyZWVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZ3JlZXMgKiAwLjAxNzQ1MzI5MjUxZjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBmbG9hdCBSYWRpYW5zVG9EZWdyZWVzKGZsb2F0IHJhZGlhbnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gcmFkaWFucyAqIDU3LjI5NTc3OTU0NTdmO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGZsb2F0IEdldEFuZ2xlKFZlY3RvcjIgYSwgVmVjdG9yMiBiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGUgPSAoZmxvYXQpKE1hdGguQXRhbjIoYi5ZIC0gYS5ZLCBiLlggLSBhLlgpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGFuZ2xlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGZsb2F0IEdldEFuZ2xlKFZlY3RvcjIgYSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlID0gKGZsb2F0KShNYXRoLkF0YW4yKGEuWSwgYS5YKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhbmdsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBmbG9hdCBSb3VnaERpc3RhbmNlQmV0d2VlblBvaW50cyhWZWN0b3IyIGEsIFZlY3RvcjIgYilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIChmbG9hdCkoTWF0aC5BYnMoYS54IC0gYi54KSArIE1hdGguQWJzKGEueSAtIGIueSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gKGEgLSBiKS5Sb3VnaExlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBmbG9hdCBNYWduaXR1ZGVPZlJlY3RhbmdsZShSZWN0YW5nbGUgUilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBSLndpZHRoICsgUi5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmxvYXQgV3JhcFJhZGlhbnMoZmxvYXQgcmFkaWFuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgd2hpbGUgKHJhZGlhbiA8IC1QSSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmFkaWFuICs9IFBJMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAocmFkaWFuID49IFBJKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByYWRpYW4gLT0gUEkyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByYWRpYW47XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIHJhZGlhbiAlIFBJMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIGluY3JlbWVudFRvd2FyZHMoZG91YmxlIGN1cnJlbnQsIGRvdWJsZSBkZXN0aW5hdGlvbiwgZG91YmxlIHNwZWVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnQgPCBkZXN0aW5hdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudCArPSBzcGVlZDtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID4gZGVzdGluYXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50ID4gZGVzdGluYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQgLT0gc3BlZWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA8IGRlc3RpbmF0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIGluY3JlbWVudFRvd2FyZHMoZG91YmxlIGN1cnJlbnQsIGRvdWJsZSBkZXN0aW5hdGlvbiwgZG91YmxlIGluY3NwZWVkLCBkb3VibGUgZGVjc3BlZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudCA8IGRlc3RpbmF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50ICs9IGluY3NwZWVkO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPiBkZXN0aW5hdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gZGVzdGluYXRpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnQgPiBkZXN0aW5hdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudCAtPSBkZWNzcGVlZDtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50IDwgZGVzdGluYXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIFJhZGlhblRvVmVjdG9yKGZsb2F0IHJhZGlhbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigoZmxvYXQpTWF0aC5Db3MocmFkaWFuKSwgKGZsb2F0KU1hdGguU2luKHJhZGlhbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBMZXJwKGRvdWJsZSBEMSwgZG91YmxlIEQyLCBkb3VibGUgbGVycClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlcnAgPSBNYXRoSGVscGVyLkNsYW1wKGxlcnApO1xyXG4gICAgICAgICAgICByZXR1cm4gKEQxICogKDEgLSBsZXJwKSkgKyAoRDIgKiBsZXJwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIFdpdGhpbihkb3VibGUgdmFsLCBkb3VibGUgbWluLCBkb3VibGUgbWF4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbCA+PSBtaW4gJiYgdmFsIDw9IG1heDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgTWVhbihwYXJhbXMgZG91YmxlW10gdmFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZG91YmxlIHJldCA9IDA7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCB2YWwuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gdmFsW2ldO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldCAvPSB2YWwuTGVuZ3RoO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBEZWNlbGVyYXRlKGRvdWJsZSBtb21lbnR1bSwgZG91YmxlIGRlY2VsZXJhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkaXIgPSBtb21lbnR1bSA+PSAwO1xyXG4gICAgICAgICAgICBtb21lbnR1bSA9IChkaXIgPyBtb21lbnR1bSA6IC1tb21lbnR1bSkgLSBkZWNlbGVyYXRpb247XHJcbiAgICAgICAgICAgIGlmIChtb21lbnR1bSA8IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgcmV0dXJuIGRpciA/IG1vbWVudHVtIDogLW1vbWVudHVtO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBQb2ludFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBpbnQgWDtcclxuICAgICAgICBwdWJsaWMgaW50IFk7XHJcbiAgICAgICAgcHVibGljIFBvaW50KGludCB4ID0gMCwgaW50IHkgPSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5YID0geDtcclxuICAgICAgICAgICAgdGhpcy5ZID0geTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUmVjdGFuZ2xlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHggPSAwO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5ID0gMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgd2lkdGggPSAwO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBoZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgbGVmdFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHRvcFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHJpZ2h0XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHggKyB3aWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2lkdGggPSB2YWx1ZSAtIHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGJvdHRvbVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB5ICsgaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSB2YWx1ZSAtIHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0W10gcG9pbnRzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZmxvYXRbXSByZXQgPSBuZXcgZmxvYXRbOF07XHJcbiAgICAgICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IHg7XHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IHk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSByaWdodDtcclxuICAgICAgICAgICAgICAgIHJldFtpKytdID0geTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IHJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSBib3R0b207XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSB4O1xyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSBib3R0b207XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBDZW50ZXJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIobGVmdCArICh3aWR0aCAvIDIpLCB0b3AgKyAoaGVpZ2h0IC8gMikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENvcHlGcm9tKFJlY3RhbmdsZSBSKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeCA9IFIueDtcclxuICAgICAgICAgICAgeSA9IFIueTtcclxuICAgICAgICAgICAgd2lkdGggPSBSLndpZHRoO1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBSLmhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgR2V0Q2VudGVyKFZlY3RvcjIgT1VUKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgT1VULlggPSBsZWZ0ICsgKHdpZHRoIC8gMik7XHJcbiAgICAgICAgICAgIE9VVC5ZID0gdG9wICsgKGhlaWdodCAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBNaW5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoeCwgeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHggPSB2YWx1ZS5YO1xyXG4gICAgICAgICAgICAgICAgeSA9IHZhbHVlLlk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgTWF4XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHJpZ2h0LCBib3R0b20pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICByaWdodCA9IHZhbHVlLlg7XHJcbiAgICAgICAgICAgICAgICBib3R0b20gPSB2YWx1ZS5ZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIGNvbnRhaW5zUG9pbnQoZmxvYXQgeCwgZmxvYXQgeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh4ID49IHRoaXMueCAmJiB5ID49IHRoaXMueSAmJiB4IDw9IHJpZ2h0ICYmIHkgPD0gYm90dG9tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIGNvbnRhaW5zUG9pbnQoVmVjdG9yMiBwb2ludClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChwb2ludC5YID49IHRoaXMueCAmJiBwb2ludC5ZID49IHRoaXMueSAmJiBwb2ludC5YIDw9IHJpZ2h0ICYmIHBvaW50LlkgPD0gYm90dG9tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIGludGVyc2VjdHMoUmVjdGFuZ2xlIFIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdFtdIHAgPSBSLnBvaW50cztcclxuICAgICAgICAgICAgYm9vbCBjb250YWluID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGJvb2wgb3V0c2lkZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgcC5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb250YWluc1BvaW50KHBbaSsrXSwgcFtpKytdKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRzaWRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udGFpbiAmJiBvdXRzaWRlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoUi5sZWZ0IDwgbGVmdCAmJiBSLnJpZ2h0ID4gcmlnaHQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vaWYgKCh0b3AgPD0gUi50b3AgJiYgYm90dG9tIDw9IFIudG9wKSB8fCAodG9wIDw9IFIuYm90dG9tICYmIGJvdHRvbSA8PSBSLmJvdHRvbSkpXHJcbiAgICAgICAgICAgICAgICBpZiAoKHRvcCA8PSBSLnRvcCAmJiBib3R0b20gPj0gUi50b3ApIHx8ICh0b3AgPD0gUi5ib3R0b20gJiYgYm90dG9tID49IFIuYm90dG9tKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoUi50b3AgPCB0b3AgJiYgUi5ib3R0b20gPiBib3R0b20pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgobGVmdCA8PSBSLmxlZnQgJiYgcmlnaHQgPj0gUi5sZWZ0KSB8fCAobGVmdCA8PSBSLnJpZ2h0ICYmIHJpZ2h0ID49IFIucmlnaHQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qaWYgKFIubGVmdCA8IGxlZnQgJiYgUi5yaWdodCA+IHJpZ2h0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHRvcCA8PSBSLnRvcCAmJiBib3R0b20gPD0gUi50b3ApIHx8ICh0b3AgPD0gUi5ib3R0b20gJiYgYm90dG9tIDw9IFIuYm90dG9tKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoUi50b3AgPCB0b3AgJiYgUi5ib3R0b20gPiBib3R0b20pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgobGVmdCA8PSBSLmxlZnQgJiYgcmlnaHQgPD0gUi5sZWZ0KSB8fCAobGVmdCA8PSBSLnJpZ2h0ICYmIHJpZ2h0IDw9IFIucmlnaHQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBpc1RvdWNoaW5nKFJlY3RhbmdsZSBSKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKFIgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZsb2F0W10gcCA9IFIucG9pbnRzO1xyXG4gICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgcC5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb250YWluc1BvaW50KHBbaSsrXSwgcFtpKytdKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW50ZXJzZWN0cyhSKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyppZiAoUi5sZWZ0IDwgbGVmdCAmJiBSLnJpZ2h0ID4gcmlnaHQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgodG9wPD1SLnRvcCAmJiBib3R0b208PVIudG9wKSB8fCAodG9wIDw9IFIuYm90dG9tICYmIGJvdHRvbSA8PSBSLmJvdHRvbSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKFIudG9wIDwgdG9wICYmIFIuYm90dG9tID4gYm90dG9tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGxlZnQgPD0gUi5sZWZ0ICYmIHJpZ2h0IDw9IFIubGVmdCkgfHwgKGxlZnQgPD0gUi5yaWdodCAmJiByaWdodCA8PSBSLnJpZ2h0KSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFJlY3RhbmdsZShmbG9hdCB4ID0gMCwgZmxvYXQgeSA9IDAsIGZsb2F0IHdpZHRoID0gMCwgZmxvYXQgaGVpZ2h0ID0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNldChmbG9hdCB4ID0gMCwgZmxvYXQgeSA9IDAsIGZsb2F0IHdpZHRoID0gMCwgZmxvYXQgaGVpZ2h0ID0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgUmVjdGFuZ2xlIG9wZXJhdG9yICsoUmVjdGFuZ2xlIEEsIFZlY3RvcjIgQilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKEEueCArIEIuWCwgQS55ICsgQi5ZLCBBLndpZHRoLCBBLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgUmVjdGFuZ2xlIG9wZXJhdG9yIC0oUmVjdGFuZ2xlIEEsIFZlY3RvcjIgQilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKEEueCAtIEIuWCwgQS55IC0gQi5ZLCBBLndpZHRoLCBBLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFJlY3RhbmdsZUlcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50IHggPSAwO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgeSA9IDA7XHJcbiAgICAgICAgcHVibGljIGludCB3aWR0aCA9IDA7XHJcbiAgICAgICAgcHVibGljIGludCBoZWlnaHQgPSAwO1xyXG5cclxuXHJcbiAgICAgICAgcHVibGljIGludCBsZWZ0XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHggPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaW50IHRvcFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGludCByaWdodFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgd2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gdmFsdWUgLSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgYm90dG9tXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHkgKyBoZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9IHZhbHVlIC0geTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaW50W10gcG9pbnRzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50W10gcmV0ID0gbmV3IGludFs4XTtcclxuICAgICAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgICAgIHJldFtpKytdID0geDtcclxuICAgICAgICAgICAgICAgIHJldFtpKytdID0geTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IHJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSB5O1xyXG5cclxuICAgICAgICAgICAgICAgIHJldFtpKytdID0gcmlnaHQ7XHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IGJvdHRvbTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IHg7XHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IGJvdHRvbTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBQb2ludCBDZW50ZXJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFBvaW50KGxlZnQgKyAod2lkdGggLyAyKSwgdG9wICsgKGhlaWdodCAvIDIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgUG9pbnQgTWluXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh4LCB5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgeCA9IHZhbHVlLlg7XHJcbiAgICAgICAgICAgICAgICB5ID0gdmFsdWUuWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgUG9pbnQgTWF4XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludChyaWdodCwgYm90dG9tKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSB2YWx1ZS5YO1xyXG4gICAgICAgICAgICAgICAgYm90dG9tID0gdmFsdWUuWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBjb250YWluc1BvaW50KGludCB4LCBpbnQgeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh4ID49IHRoaXMueCAmJiB5ID49IHRoaXMueSAmJiB4IDw9IHJpZ2h0ICYmIHkgPD0gYm90dG9tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIGNvbnRhaW5zUG9pbnQoUG9pbnQgcG9pbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAocG9pbnQuWCA+PSB0aGlzLnggJiYgcG9pbnQuWSA+PSB0aGlzLnkgJiYgcG9pbnQuWCA8PSByaWdodCAmJiBwb2ludC5ZIDw9IGJvdHRvbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBpbnRlcnNlY3RzKFJlY3RhbmdsZUkgUilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludFtdIHAgPSBSLnBvaW50cztcclxuICAgICAgICAgICAgYm9vbCBjb250YWluID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGJvb2wgb3V0c2lkZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgcC5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb250YWluc1BvaW50KHBbaSsrXSwgcFtpKytdKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRzaWRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udGFpbiAmJiBvdXRzaWRlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoUi5sZWZ0IDwgbGVmdCAmJiBSLnJpZ2h0ID4gcmlnaHQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vaWYgKCh0b3AgPD0gUi50b3AgJiYgYm90dG9tIDw9IFIudG9wKSB8fCAodG9wIDw9IFIuYm90dG9tICYmIGJvdHRvbSA8PSBSLmJvdHRvbSkpXHJcbiAgICAgICAgICAgICAgICBpZiAoKHRvcCA8PSBSLnRvcCAmJiBib3R0b20gPj0gUi50b3ApIHx8ICh0b3AgPD0gUi5ib3R0b20gJiYgYm90dG9tID49IFIuYm90dG9tKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoUi50b3AgPCB0b3AgJiYgUi5ib3R0b20gPiBib3R0b20pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgobGVmdCA8PSBSLmxlZnQgJiYgcmlnaHQgPj0gUi5sZWZ0KSB8fCAobGVmdCA8PSBSLnJpZ2h0ICYmIHJpZ2h0ID49IFIucmlnaHQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qaWYgKFIubGVmdCA8IGxlZnQgJiYgUi5yaWdodCA+IHJpZ2h0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHRvcCA8PSBSLnRvcCAmJiBib3R0b20gPD0gUi50b3ApIHx8ICh0b3AgPD0gUi5ib3R0b20gJiYgYm90dG9tIDw9IFIuYm90dG9tKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoUi50b3AgPCB0b3AgJiYgUi5ib3R0b20gPiBib3R0b20pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgobGVmdCA8PSBSLmxlZnQgJiYgcmlnaHQgPD0gUi5sZWZ0KSB8fCAobGVmdCA8PSBSLnJpZ2h0ICYmIHJpZ2h0IDw9IFIucmlnaHQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBpc1RvdWNoaW5nKFJlY3RhbmdsZUkgUilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChSID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbnRbXSBwID0gUi5wb2ludHM7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBwLkxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zUG9pbnQocFtpKytdLCBwW2krK10pKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbnRlcnNlY3RzKFIpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBSZWN0YW5nbGVJKGludCB4ID0gMCwgaW50IHkgPSAwLCBpbnQgd2lkdGggPSAwLCBpbnQgaGVpZ2h0ID0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgUmVjdGFuZ2xlSSBvcGVyYXRvciArKFJlY3RhbmdsZUkgQSwgUG9pbnQgQilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlSShBLnggKyBCLlgsIEEueSArIEIuWSwgQS53aWR0aCwgQS5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFJlY3RhbmdsZUkgb3BlcmF0b3IgLShSZWN0YW5nbGVJIEEsIFBvaW50IEIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZUkoQS54IC0gQi5YLCBBLnkgLSBCLlksIEEud2lkdGgsIEEuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFJlbmRlcmVyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEhUTUxFbGVtZW50IHZpZXc7XHJcbiAgICAgICAgcHVibGljIFJlbmRlcmVyKGludCB3aWR0aCA9IDgwMCwgaW50IGhlaWdodCA9IDYwMCwgaW50IGJhY2tncm91bmRDb2xvciA9IDB4MTA5OWJiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLyp2YXIgd2lkdGggPSA4MDA7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSA2MDA7XHJcbiAgICAgICAgICAgIHZhciBiYWNrZ3JvdW5kQ29sb3IgPSAweDEwOTliYjsqL1xyXG4gICAgICAgICAgICB2aWV3ID0gU2NyaXB0LldyaXRlPGR5bmFtaWM+KFwibmV3IFBJWEkuQXBwbGljYXRpb24od2lkdGgsIGhlaWdodCwge2JhY2tncm91bmRDb2xvciA6IGJhY2tncm91bmRDb2xvcn0pXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVGlsZURhdGFcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50IHRleHR1cmU7XHJcbiAgICAgICAgcHVibGljIGludCByb3c7XHJcbiAgICAgICAgcHVibGljIGludCBjb2x1bW47XHJcbiAgICAgICAgcHVibGljIGJvb2wgZW5hYmxlZDtcclxuICAgICAgICBwdWJsaWMgVGlsZU1hcCBtYXA7XHJcbiAgICAgICAgcHVibGljIGJvb2wgdmlzaWJsZTtcclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgdG9wU29saWQ7XHJcbiAgICAgICAgcHVibGljIGJvb2wgcmlnaHRTb2xpZDtcclxuICAgICAgICBwdWJsaWMgYm9vbCBsZWZ0U29saWQ7XHJcbiAgICAgICAgcHVibGljIGJvb2wgYm90dG9tU29saWQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIENhblNsb3BlO1xyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBCcmVha2FibGUgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgSFAgPSA0O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBtYXhIUCA9IDQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUgUmVjdGFuZ2xlIF9oaXRib3g7XHJcblxyXG4gICAgICAgIHB1YmxpYyBUaWxlRGF0YSBDbG9uZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICBULnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gICAgICAgICAgICBULmVuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICAgICAgICBULm1hcCA9IG1hcDtcclxuICAgICAgICAgICAgVC52aXNpYmxlID0gdmlzaWJsZTtcclxuICAgICAgICAgICAgVC50b3BTb2xpZCA9IHRvcFNvbGlkO1xyXG4gICAgICAgICAgICBULnJpZ2h0U29saWQgPSByaWdodFNvbGlkO1xyXG4gICAgICAgICAgICBULmxlZnRTb2xpZCA9IGxlZnRTb2xpZDtcclxuICAgICAgICAgICAgVC5ib3R0b21Tb2xpZCA9IGJvdHRvbVNvbGlkO1xyXG4gICAgICAgICAgICBULkNhblNsb3BlID0gQ2FuU2xvcGU7XHJcbiAgICAgICAgICAgIHJldHVybiBUO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgRGFtYWdlKGZsb2F0IGRhbWFnZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhQIC09IGRhbWFnZTtcclxuICAgICAgICAgICAgaWYgKEhQIDw9IDAgJiYgdG9wU29saWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNvbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB2aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBlbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAvKmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlID0gMjsqL1xyXG4gICAgICAgICAgICAgICAgLyptYXAuRm9yY2VSZWRyYXcoKTsqL1xyXG4gICAgICAgICAgICAgICAgVXBkYXRlVGlsZSgpO1xyXG4gICAgICAgICAgICAgICAgU3Bhd25QYXJ0aWNsZXMoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWFwLlJlZHJhd1RpbGUoY29sdW1uLCByb3csIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGVUaWxlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG1hcC5SZWRyYXdUaWxlKGNvbHVtbiwgcm93KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFNwYXduUGFydGljbGVzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0eCA9IChpbnQpTWF0aEhlbHBlci5DbGFtcCh0ZXh0dXJlLCAwLCBtYXAudGlsZXMuQ291bnQgLSAxKTtcclxuICAgICAgICAgICAgdmFyIFQgPSBtYXAudGlsZXNbdHhdO1xyXG5cclxuICAgICAgICAgICAgdmFyIHN6ID0gKGludCkobWFwLnRpbGVzaXplIC8gMik7XHJcbiAgICAgICAgICAgIHZhciBHID0gbWFwLmdhbWU7XHJcbiAgICAgICAgICAgIHZhciBIQiA9IEdldEhpdGJveCgpO1xyXG4gICAgICAgICAgICAvL3ZhciBzcGQgPSAxLjVmO1xyXG4gICAgICAgICAgICB2YXIgc3BkID0gMTtcclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgQyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBDLldpZHRoID0gc3o7XHJcbiAgICAgICAgICAgIEMuSGVpZ2h0ID0gc3o7XHJcbiAgICAgICAgICAgIHZhciBnID0gSGVscGVyLkdldENvbnRleHQoQyk7XHJcblxyXG4gICAgICAgICAgICBnLkRyYXdJbWFnZShULCAwLCAwLCBzeiwgc3osIDAsIDAsIHN6LCBzeik7XHJcbiAgICAgICAgICAgIHZhciBQID0gbmV3IFBhcnRpY2xlKEcsIEMuQXM8SFRNTEltYWdlRWxlbWVudD4oKSk7XHJcbiAgICAgICAgICAgIFAuSHNwZWVkID0gLXNwZDtcclxuICAgICAgICAgICAgUC5Wc3BlZWQgPSAtc3BkO1xyXG4gICAgICAgICAgICBQLnggPSBIQi5sZWZ0O1xyXG4gICAgICAgICAgICBQLnkgPSBIQi50b3A7XHJcbiAgICAgICAgICAgIEcuQWRkRW50aXR5KFApO1xyXG5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgQyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBDLldpZHRoID0gc3o7XHJcbiAgICAgICAgICAgIEMuSGVpZ2h0ID0gc3o7XHJcbiAgICAgICAgICAgIGcgPSBIZWxwZXIuR2V0Q29udGV4dChDKTtcclxuXHJcbiAgICAgICAgICAgIGcuRHJhd0ltYWdlKFQsIHN6LCAwLCBzeiwgc3osIDAsIDAsIHN6LCBzeik7XHJcbiAgICAgICAgICAgIFAgPSBuZXcgUGFydGljbGUoRywgQy5BczxIVE1MSW1hZ2VFbGVtZW50PigpKTtcclxuICAgICAgICAgICAgUC5Ic3BlZWQgPSBzcGQ7XHJcbiAgICAgICAgICAgIFAuVnNwZWVkID0gLXNwZDtcclxuICAgICAgICAgICAgUC54ID0gSEIubGVmdCArIHN6O1xyXG4gICAgICAgICAgICBQLnkgPSBIQi50b3A7XHJcbiAgICAgICAgICAgIEcuQWRkRW50aXR5KFApO1xyXG5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgQyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBDLldpZHRoID0gc3o7XHJcbiAgICAgICAgICAgIEMuSGVpZ2h0ID0gc3o7XHJcbiAgICAgICAgICAgIGcgPSBIZWxwZXIuR2V0Q29udGV4dChDKTtcclxuXHJcbiAgICAgICAgICAgIGcuRHJhd0ltYWdlKFQsIDAsIHN6LCBzeiwgc3osIDAsIDAsIHN6LCBzeik7XHJcbiAgICAgICAgICAgIFAgPSBuZXcgUGFydGljbGUoRywgQy5BczxIVE1MSW1hZ2VFbGVtZW50PigpKTtcclxuICAgICAgICAgICAgUC5Ic3BlZWQgPSAtc3BkO1xyXG4gICAgICAgICAgICBQLlZzcGVlZCA9IHNwZDtcclxuICAgICAgICAgICAgUC54ID0gSEIubGVmdDtcclxuICAgICAgICAgICAgUC55ID0gSEIudG9wICsgc3o7XHJcbiAgICAgICAgICAgIEcuQWRkRW50aXR5KFApO1xyXG5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgQyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBDLldpZHRoID0gc3o7XHJcbiAgICAgICAgICAgIEMuSGVpZ2h0ID0gc3o7XHJcbiAgICAgICAgICAgIGcgPSBIZWxwZXIuR2V0Q29udGV4dChDKTtcclxuXHJcbiAgICAgICAgICAgIGcuRHJhd0ltYWdlKFQsIHN6LCBzeiwgc3osIHN6LCAwLCAwLCBzeiwgc3opO1xyXG4gICAgICAgICAgICBQID0gbmV3IFBhcnRpY2xlKEcsIEMuQXM8SFRNTEltYWdlRWxlbWVudD4oKSk7XHJcbiAgICAgICAgICAgIFAuSHNwZWVkID0gc3BkO1xyXG4gICAgICAgICAgICBQLlZzcGVlZCA9IHNwZDtcclxuICAgICAgICAgICAgUC54ID0gSEIubGVmdCArIHN6O1xyXG4gICAgICAgICAgICBQLnkgPSBIQi50b3AgKyBzejtcclxuICAgICAgICAgICAgRy5BZGRFbnRpdHkoUCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBzb2xpZFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b3BTb2xpZCAmJiByaWdodFNvbGlkICYmIGxlZnRTb2xpZCAmJiBib3R0b21Tb2xpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdG9wU29saWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGxlZnRTb2xpZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmlnaHRTb2xpZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYm90dG9tU29saWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBSZWN0YW5nbGUgSFIgPSBuZXcgUmVjdGFuZ2xlKCk7XHJcbiAgICAgICAgcHVibGljIFJlY3RhbmdsZSBHZXRIaXRib3goKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLyppZiAoX2hpdGJveCA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHN6ID0gbWFwLnRpbGVzaXplO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IG1hcC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIF9oaXRib3ggPSBuZXcgUmVjdGFuZ2xlKHBvcy5YICsgKGNvbHVtbiAqIHRzeiksIHBvcy5ZICsgKHJvdyAqIHRzeiksIHRzeiwgdHN6KTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIHZhciB0c3ogPSBtYXAudGlsZXNpemU7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBtYXAucG9zaXRpb247XHJcbiAgICAgICAgICAgIEhSLlNldChwb3MuWCArIChjb2x1bW4gKiB0c3opLCBwb3MuWSArIChyb3cgKiB0c3opLCB0c3osIHRzeik7XHJcbiAgICAgICAgICAgIHJldHVybiBIUjtcclxuICAgICAgICAgICAgLy9yZXR1cm4gbmV3IFJlY3RhbmdsZShwb3MuWCArIChjb2x1bW4gKiB0c3opLCBwb3MuWSArIChyb3cgKiB0c3opLCB0c3osIHRzeik7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIF9oaXRib3g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEdldEhpdGJveDIoUmVjdGFuZ2xlIE9VVClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8qaWYgKF9oaXRib3ggPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRzeiA9IG1hcC50aWxlc2l6ZTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBtYXAucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICBfaGl0Ym94ID0gbmV3IFJlY3RhbmdsZShwb3MuWCArIChjb2x1bW4gKiB0c3opLCBwb3MuWSArIChyb3cgKiB0c3opLCB0c3osIHRzeik7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICB2YXIgdHN6ID0gbWFwLnRpbGVzaXplO1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbWFwLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBPVVQueCA9IHBvcy5YICsgKGNvbHVtbiAqIHRzeik7XHJcbiAgICAgICAgICAgIE9VVC55ID0gcG9zLlkgKyAocm93ICogdHN6KTtcclxuICAgICAgICAgICAgT1VULndpZHRoID0gdHN6O1xyXG4gICAgICAgICAgICBPVVQuaGVpZ2h0ID0gdHN6O1xyXG4gICAgICAgICAgICAvL3JldHVybiBfaGl0Ym94O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBwbGF0Zm9ybVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b3BTb2xpZCAmJiAhcmlnaHRTb2xpZCAmJiAhbGVmdFNvbGlkICYmICFib3R0b21Tb2xpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVGlsZURhdGEgR2V0VGlsZURhdGEoaW50IHJlbGF0aXZlWCwgaW50IHJlbGF0aXZlWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXAuR2V0VGlsZShjb2x1bW4gKyByZWxhdGl2ZVgsIHJvdyArIHJlbGF0aXZlWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIHNvbGlkVG9TcGVlZChWZWN0b3IyIGFuZ2xlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFlbmFibGVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoYW5nbGUuUm91Z2hMZW5ndGggPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvbGlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKChhbmdsZS5YID4gMCAmJiBsZWZ0U29saWQpIHx8IChhbmdsZS5YIDwgMCAmJiByaWdodFNvbGlkKSB8fCAoYW5nbGUuWSA+IDAgJiYgdG9wU29saWQpIHx8IChhbmdsZS5ZID4gMCAmJiBib3R0b21Tb2xpZCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgR2V0VG9wKFZlY3RvcjIgcG9zaXRpb24pXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgLypUaWxlRGF0YSBMZWZ0ID0gR2V0VGlsZURhdGEoLTEsIDApO1xyXG4gICAgICAgICAgICBUaWxlRGF0YSBSaWdodCA9IEdldFRpbGVEYXRhKDEsIDApO1xyXG4gICAgICAgICAgICBib29sIExzb2xpZCA9IExlZnQgIT0gbnVsbCAmJiBMZWZ0LmVuYWJsZWQgJiYgTGVmdC5zb2xpZDtcclxuICAgICAgICAgICAgYm9vbCBSc29saWQgPSBSaWdodCAhPSBudWxsICYmIFJpZ2h0LmVuYWJsZWQgJiYgUmlnaHQuc29saWQ7Ki9cclxuICAgICAgICAgICAgaW50IGRpcmVjdGlvbiA9IFNsb3BlRGlyZWN0aW9uO1xyXG4gICAgICAgICAgICAvL2lmICghQ2FuU2xvcGUgfHwgIXNvbGlkIHx8IChMc29saWQgJiYgUnNvbGlkKSlcclxuICAgICAgICAgICAgdmFyIHRzeiA9IG1hcC50aWxlc2l6ZTtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL3JldHVybiBSLnRvcDtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gbWFwLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvcy5ZICsgKHJvdyAqIHRzeik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZWN0YW5nbGUgUiA9IEdldEhpdGJveCgpO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgWSA9ICgoUi5yaWdodCAtIHBvc2l0aW9uLlgpIC8gUi53aWR0aCkgKiB0c3o7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBZID0gKHRzeiAtIFkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9ZICo9IDEuMGY7XHJcbiAgICAgICAgICAgICAgICBZID0gKGZsb2F0KU1hdGguTWluKHRzeiwgTWF0aC5NYXgoMCwgWSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFIuYm90dG9tIC0gWTtcclxuICAgICAgICAgICAgICAgIC8vcmV0dXJuIChmbG9hdClNYXRoLk1pbihSLnRvcCwgTWF0aC5NYXgoUi5ib3R0b20sKChSLnJpZ2h0IC0gcG9zaXRpb24uWCkgLyBSLndpZHRoKSAqIFIuaGVpZ2h0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgSXNTbG9wZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTbG9wZURpcmVjdGlvbiAhPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgU2xvcGVEaXJlY3Rpb25cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUNhblNsb3BlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgQm90dG9tID0gR2V0VGlsZURhdGEoMCwgMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShCb3R0b20gIT0gbnVsbCAmJiBCb3R0b20uZW5hYmxlZCAmJiBCb3R0b20uc29saWQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgTGVmdCA9IEdldFRpbGVEYXRhKC0xLCAwKTtcclxuICAgICAgICAgICAgICAgIFRpbGVEYXRhIFJpZ2h0ID0gR2V0VGlsZURhdGEoMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBib29sIExzb2xpZCA9IExlZnQgIT0gbnVsbCAmJiBMZWZ0LmVuYWJsZWQgJiYgTGVmdC5zb2xpZDtcclxuICAgICAgICAgICAgICAgIGJvb2wgUnNvbGlkID0gUmlnaHQgIT0gbnVsbCAmJiBSaWdodC5lbmFibGVkICYmIFJpZ2h0LnNvbGlkO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFDYW5TbG9wZSB8fCAhc29saWQgfHwgKExzb2xpZCAmJiBSc29saWQpIHx8ICghUnNvbGlkICYmICFMc29saWQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgVG9wID0gR2V0VGlsZURhdGEoMCwgLTEpO1xyXG4gICAgICAgICAgICAgICAgYm9vbCBUc29saWQgPSBUb3AgIT0gbnVsbCAmJiBUb3AuZW5hYmxlZCAmJiBUb3Auc29saWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoVHNvbGlkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKFJzb2xpZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFRpbGVNYXBcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgdGlsZXNpemU7XHJcbiAgICAgICAgcHVibGljIGludCByb3dzO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgY29sdW1ucztcclxuICAgICAgICBwdWJsaWMgVGlsZURhdGFbLF0gZGF0YTtcclxuICAgICAgICBwdWJsaWMgTGlzdDxIVE1MSW1hZ2VFbGVtZW50PiB0aWxlcztcclxuICAgICAgICBwdWJsaWMgTGlzdDxIVE1MSW1hZ2VFbGVtZW50PiBjcmFja3M7XHJcblxyXG4gICAgICAgIHB1YmxpYyBHYW1lIGdhbWU7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBIVE1MQ2FudmFzRWxlbWVudCBidWZmZXI7XHJcbiAgICAgICAgcHVibGljIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBiZztcclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyByZXR1cm5zIHRydWUgaWYgdGhlIHJlY3RhbmdsZSBoYXMgbm8gZW1wdHkgc3BhY2VzLlxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic1hcIj48L3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInNZXCI+PC9wYXJhbT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJlWFwiPjwvcGFyYW0+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZVlcIj48L3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbiAgICAgICAgcHVibGljIGJvb2wgSXNSZWN0U29saWQoaW50IHNYLCBpbnQgc1ksIGludCBlWCwgaW50IGVZKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFggPSBzWDtcclxuICAgICAgICAgICAgdmFyIFkgPSBzWTtcclxuICAgICAgICAgICAgd2hpbGUgKFkgPCBlWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWCA9IHNZO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKFggPCBlWClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgVCA9IGRhdGFbWCwgWV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBYKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBZKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgUmFuZG9tIFJORDtcclxuICAgICAgICBwdWJsaWMgaW50IFNlZWQgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBGb3JjZVJlZHJhdygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZWVkUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBib29sIG5lZWRSZWRyYXc7XHJcbiAgICAgICAgcHVibGljIGJvb2wgQWxsb3dTa3lCcmlkZ2UgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgVGlsZU1hcChHYW1lIGdhbWUsIGludCBTZWVkID0gLTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSTkQgPSBuZXcgUmFuZG9tKCk7XHJcbiAgICAgICAgICAgIC8vcG9zaXRpb24gPSBuZXcgVmVjdG9yMigtNTc2KTtcclxuICAgICAgICAgICAgLy8vcG9zaXRpb24gPSBuZXcgVmVjdG9yMigtMTI4KTtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgICAgICAvL3RpbGVzaXplID0gNDg7XHJcbiAgICAgICAgICAgIHRpbGVzaXplID0gMTY7XHJcbiAgICAgICAgICAgIC8vcm93cyA9IDE2O1xyXG4gICAgICAgICAgICAvKmNvbHVtbnMgPSA1MjsqL1xyXG4gICAgICAgICAgICByb3dzID0gKGludClNYXRoLkNlaWxpbmcoKCgtcG9zaXRpb24uWSAqIDIpICsgZ2FtZS5zdGFnZUJvdW5kcy5ib3R0b20pIC8gdGlsZXNpemUpO1xyXG4gICAgICAgICAgICBjb2x1bW5zID0gKGludClNYXRoLkNlaWxpbmcoKCgtcG9zaXRpb24uWCAqIDIpICsgZ2FtZS5zdGFnZUJvdW5kcy5yaWdodCkgLyB0aWxlc2l6ZSk7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgVGlsZURhdGFbY29sdW1ucywgcm93c107XHJcbiAgICAgICAgICAgIHRpbGVzID0gQW5pbWF0aW9uTG9hZGVyLkdldChcImltYWdlcy9sYW5kL2JyaWNrXCIpO1xyXG4gICAgICAgICAgICBjcmFja3MgPSBBbmltYXRpb25Mb2FkZXIuR2V0KFwiaW1hZ2VzL2xhbmQvY3JhY2tzXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICAgICAgYnVmZmVyID0gbmV3IEhUTUxDYW52YXNFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGJnID0gYnVmZmVyLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBpZiAoU2VlZCA8IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuU2VlZCA9IFJORC5OZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlNlZWQgPSBTZWVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vUmFuZG9taXplKCk7XHJcbiAgICAgICAgICAgIEdlbmVyYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2b2lkIFJhbmRvbWl6ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgcm93ID0gMDtcclxuICAgICAgICAgICAgaW50IGNvbHVtbiA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChyb3cgPCByb3dzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY29sdW1uIDwgY29sdW1ucylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUaWxlRGF0YSBUID0gbmV3IFRpbGVEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVC5yb3cgPSByb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgVC5jb2x1bW4gPSBjb2x1bW47XHJcbiAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAvL1QuZW5hYmxlZCA9IChNYXRoLlJhbmRvbSgpIDwgMC4xNSkgfHwgKHJvdz49cm93cy0xKTtcclxuICAgICAgICAgICAgICAgICAgICBULmVuYWJsZWQgPSAoUk5ELk5leHREb3VibGUoKSA8IDAuMTUpIHx8IChyb3cgPj0gcm93cyAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIFQudG9wU29saWQgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFQuZW5hYmxlZCAmJiAocm93ID49IHJvd3MgLSAxKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQuc29saWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChULmVuYWJsZWQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoUk5ELk5leHREb3VibGUoKSA8IDAuMylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVC5zb2xpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJORC5OZXh0RG91YmxlKCkgPCAwLjUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gMztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBULnZpc2libGUgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgVC5tYXAgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbY29sdW1uLCByb3ddID0gVDtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IDA7XHJcbiAgICAgICAgICAgICAgICByb3crKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBHZW5lcmF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSTkQgPSBuZXcgUmFuZG9tKFNlZWQpO1xyXG4gICAgICAgICAgICAvL1JhbmRvbWl6ZSgpO1xyXG4gICAgICAgICAgICBfR2VuKCk7XHJcbiAgICAgICAgICAgIG5lZWRSZWRyYXcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdm9pZCBfR2VuKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludFtdIGhlaWdodG1hcCA9IG5ldyBpbnRbY29sdW1uc107XHJcbiAgICAgICAgICAgIC8vZmxvYXQgZW50cm9weSA9IDAuOGY7XHJcbiAgICAgICAgICAgIC8vZmxvYXQgZW50cm9weSA9IDAuNDVmO1xyXG4gICAgICAgICAgICBmbG9hdCBlbnRyb3B5ID0gMC42MGY7XHJcbiAgICAgICAgICAgIGludCBtYXggPSAoaW50KShyb3dzICogZW50cm9weSk7XHJcbiAgICAgICAgICAgIC8vaW50IHNtb290aG5lc3NTaXplID0gMTI7XHJcbiAgICAgICAgICAgIGludCBzbW9vdGhuZXNzU2l6ZSA9IDg7XHJcbiAgICAgICAgICAgIGludCBzbW9vdGhuZXNzU3RyZW5ndGggPSAyO1xyXG5cclxuICAgICAgICAgICAgaW50IFggPSAwO1xyXG4gICAgICAgICAgICAvL3JhbmRvbWl6ZXMgdGhlIGhlaWdodG1hcFxyXG4gICAgICAgICAgICB3aGlsZSAoWCA8IGNvbHVtbnMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGhlaWdodG1hcFtYXSA9IChpbnQpKFJORC5OZXh0RG91YmxlKCkgKiBtYXgpO1xyXG4gICAgICAgICAgICAgICAgWCArPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGludCBzID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKHMgPCBzbW9vdGhuZXNzU3RyZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGludFtdIG9oZWlnaHRtYXAgPSBoZWlnaHRtYXA7XHJcbiAgICAgICAgICAgICAgICBoZWlnaHRtYXAgPSBuZXcgaW50W2NvbHVtbnNdO1xyXG4gICAgICAgICAgICAgICAgWCA9IDA7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoWCA8IGNvbHVtbnMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0bWFwW1hdID0gYmx1cihvaGVpZ2h0bWFwLCBYLCBzbW9vdGhuZXNzU2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgWCArPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIFggPSAxO1xyXG4gICAgICAgICAgICAgICAgcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vcmVtb3ZlcyBidW1wcyBmcm9tIGhlaWdodG1hcFxyXG4gICAgICAgICAgICB3aGlsZSAoWCA8IGNvbHVtbnMgLSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgQSA9IGhlaWdodG1hcFtYIC0gMV07XHJcbiAgICAgICAgICAgICAgICBpbnQgQiA9IGhlaWdodG1hcFtYICsgMV07XHJcblxyXG4gICAgICAgICAgICAgICAgaW50IEggPSBoZWlnaHRtYXBbWF07XHJcbiAgICAgICAgICAgICAgICAvL2lmIChBID09IEIgJiYgTWF0aC5BYnMoQS0gSCk9PTEpXHJcbiAgICAgICAgICAgICAgICBpZiAoKEEgPiBIKSA9PSAoQiA+IEgpICYmIEggIT0gQSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHRtYXBbWF0gPSAoQSArIEIpIC8gMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFggKz0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBpbnQgcm93ID0gMDtcclxuICAgICAgICAgICAgaW50IGNvbHVtbiA9IDA7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIExUID0gbnVsbDtcclxuICAgICAgICAgICAgZmxvYXQgYnJpZGdlQ2hhbmNlID0gMC45MGY7XHJcbiAgICAgICAgICAgIGludCBSTkRicmlkZ2UgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAocm93IDwgcm93cylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbHVtbiA8IGNvbHVtbnMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IEggPSByb3dzIC0gaGVpZ2h0bWFwW2NvbHVtbl07XHJcbiAgICAgICAgICAgICAgICAgICAgYm9vbCBmaWxsID0gcm93ID49IEg7XHJcbiAgICAgICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFQucm93ID0gcm93O1xyXG4gICAgICAgICAgICAgICAgICAgIFQuY29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9ULmVuYWJsZWQgPSAoTWF0aC5SYW5kb20oKSA8IDAuMTUpIHx8IChyb3cgPj0gcm93cyAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIFQuZW5hYmxlZCA9IChmaWxsKSB8fCAocm93ID49IHJvd3MgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICBULnRvcFNvbGlkID0gVC5lbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIFQuYm90dG9tU29saWQgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFQuZW5hYmxlZCAmJiAocm93ID49IHJvd3MgLSAxKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQuc29saWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChULmVuYWJsZWQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2lmIChNYXRoLlJhbmRvbSgpIDwgMC4zKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBULkNhblNsb3BlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChSTkQuTmV4dERvdWJsZSgpIDwgMC41KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93ID4gSCAmJiBSTkQuTmV4dERvdWJsZSgpIDwgMC4wMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSA2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghVC5lbmFibGVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChBbGxvd1NreUJyaWRnZSAmJiByb3cgPT0gMjAgJiYgUk5ELk5leHREb3VibGUoKSA8IDAuOTMpIHx8IChyb3cgKyA0ID49IEggJiYgcm93ICsgMiA8IEggJiYgUk5ELk5leHREb3VibGUoKSA8IDAuMDI1KSB8fCAoTFQgIT0gbnVsbCAmJiBMVC5lbmFibGVkICYmIExULnRleHR1cmUgPT0gMSAmJiBSTkQuTmV4dERvdWJsZSgpIDwgYnJpZGdlQ2hhbmNlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudG9wU29saWQgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmlkZ2VDaGFuY2UgLT0gMC4wNzVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJORGJyaWRnZSA8IDEgJiYgUk5ELk5leHREb3VibGUoKSA8IDAuMDE1KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJORGJyaWRnZSA9IFJORC5OZXh0KDgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJORGJyaWRnZSA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnRvcFNvbGlkID0gVC5lbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJORGJyaWRnZS0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vfWVsc2UgaWYgKFJORC5OZXh0RG91YmxlKCkgPCAwLjAyNSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKFJORC5OZXh0RG91YmxlKCkgPCAwLjAzNSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudG9wU29saWQgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0cnVlKS8vZGVidWcgZmlsbCB0aGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVC50b3BTb2xpZCA9IFQuZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULkNhblNsb3BlID0gTWF0aC5SYW5kb20oKSA8IDAuNTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIVQuZW5hYmxlZCB8fCBULnRleHR1cmUgIT0gMSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyaWRnZUNoYW5jZSA9IDAuOTBmO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBULnZpc2libGUgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgVC5tYXAgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIFQuc29saWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbY29sdW1uLCByb3ddID0gVDtcclxuICAgICAgICAgICAgICAgICAgICBMVCA9IFQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb2x1bW4gPSAwO1xyXG4gICAgICAgICAgICAgICAgcm93Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgX0dlblJlY3QoaW50IFNYLCBpbnQgU1ksIGludCBFWCwgaW50IEVZKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU1ggPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoU1gsIDAsIGNvbHVtbnMgLSAxKTtcclxuICAgICAgICAgICAgU1kgPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoU1ksIDAsIHJvd3MgLSAxKTtcclxuICAgICAgICAgICAgRVggPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoRVgsIDAsIGNvbHVtbnMgLSAxKTtcclxuICAgICAgICAgICAgRVkgPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoRVksIDAsIHJvd3MgLSAxKTtcclxuXHJcbiAgICAgICAgICAgIC8vZmxvYXQgZW50cm9weSA9IDAuOGY7XHJcbiAgICAgICAgICAgIC8vZmxvYXQgZW50cm9weSA9IDAuNDVmO1xyXG4gICAgICAgICAgICBmbG9hdCBlbnRyb3B5ID0gMC42MGY7XHJcbiAgICAgICAgICAgIGludCBtYXggPSAoaW50KShyb3dzICogZW50cm9weSk7XHJcbiAgICAgICAgICAgIC8vaW50IHNtb290aG5lc3NTaXplID0gMTI7XHJcblxyXG4gICAgICAgICAgICBpbnQgWCA9IDA7XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIGludCByb3cgPSBTWTtcclxuICAgICAgICAgICAgaW50IGNvbHVtbiA9IFNYO1xyXG4gICAgICAgICAgICBUaWxlRGF0YSBMVCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZsb2F0IGJyaWRnZUNoYW5jZSA9IDAuOTBmO1xyXG4gICAgICAgICAgICBpbnQgUk5EYnJpZGdlID0gMDtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChyb3cgPCBFWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbHVtbiA8IEVYKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvb2wgZmlsbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBuZXcgVGlsZURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICBULnJvdyA9IHJvdztcclxuICAgICAgICAgICAgICAgICAgICBULmNvbHVtbiA9IGNvbHVtbjtcclxuICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVC5lbmFibGVkID0gKE1hdGguUmFuZG9tKCkgPCAwLjE1KSB8fCAocm93ID49IHJvd3MgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICBULmVuYWJsZWQgPSAoZmlsbCkgfHwgKHJvdyA+PSByb3dzIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVC50b3BTb2xpZCA9IFQuZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICBULmJvdHRvbVNvbGlkID0gVC5lbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qaWYgKFQuZW5hYmxlZCAmJiAocm93ID49IHJvd3MgLSAxKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQuc29saWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChULmVuYWJsZWQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2lmIChNYXRoLlJhbmRvbSgpIDwgMC4zKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBULkNhblNsb3BlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChSTkQuTmV4dERvdWJsZSgpIDwgMC41KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmFsc2UgJiYgUk5ELk5leHREb3VibGUoKSA8IDAuMDIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gNjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghVC5lbmFibGVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyppZiAoKEFsbG93U2t5QnJpZGdlICYmIHJvdyA9PSAyMCAmJiBSTkQuTmV4dERvdWJsZSgpIDwgMC45MykgfHwgKGZhbHNlICYmIGZhbHNlICYmIFJORC5OZXh0RG91YmxlKCkgPCAwLjAyNSkgfHwgKExUICE9IG51bGwgJiYgTFQuZW5hYmxlZCAmJiBMVC50ZXh0dXJlID09IDEgJiYgUk5ELk5leHREb3VibGUoKSA8IGJyaWRnZUNoYW5jZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnRvcFNvbGlkID0gVC5lbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlQ2hhbmNlIC09IDAuMDc1ZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJORGJyaWRnZSA8IDEgJiYgUk5ELk5leHREb3VibGUoKSA8IDAuMDE1KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUk5EYnJpZGdlID0gUk5ELk5leHQoOCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUk5EYnJpZGdlID0gUk5ELk5leHQoNik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUk5EYnJpZGdlID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudG9wU29saWQgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUk5EYnJpZGdlLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99ZWxzZSBpZiAoUk5ELk5leHREb3VibGUoKSA8IDAuMDI1KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9lbHNlIGlmIChSTkQuTmV4dERvdWJsZSgpIDwgMC4wMzUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKFJORC5OZXh0RG91YmxlKCkgPCAwLjA0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoUk5ELk5leHREb3VibGUoKSA8IDAuMDQ1KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVC50b3BTb2xpZCA9IFQuZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFULmVuYWJsZWQgfHwgVC50ZXh0dXJlICE9IDEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmlkZ2VDaGFuY2UgPSAwLjkwZjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgVC52aXNpYmxlID0gVC5lbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIFQubWFwID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhW2NvbHVtbiwgcm93XSA9IFQ7XHJcbiAgICAgICAgICAgICAgICAgICAgTFQgPSBUO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29sdW1uID0gU1g7XHJcbiAgICAgICAgICAgICAgICByb3crKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRCcmVha2FibGVSZWN0KGludCBjb2x1bW4sIGludCByb3csIGludCBXaWR0aCwgaW50IEhlaWdodCxib29sIGJyZWFrYWJsZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBTWCA9IChpbnQpKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHZhciBTWSA9IChpbnQpKHJvdyk7XHJcbiAgICAgICAgICAgIHZhciBFWCA9IChpbnQpKFNYICsgV2lkdGgpO1xyXG4gICAgICAgICAgICB2YXIgRVkgPSAoaW50KShTWSArIEhlaWdodCk7XHJcbiAgICAgICAgICAgIFNYID0gKGludClNYXRoSGVscGVyLkNsYW1wKFNYLCAwLCBjb2x1bW5zIC0gMSk7XHJcbiAgICAgICAgICAgIFNZID0gKGludClNYXRoSGVscGVyLkNsYW1wKFNZLCAwLCByb3dzIC0gMSk7XHJcbiAgICAgICAgICAgIEVYID0gKGludClNYXRoSGVscGVyLkNsYW1wKEVYLCAwLCBjb2x1bW5zIC0gMSk7XHJcbiAgICAgICAgICAgIEVZID0gKGludClNYXRoSGVscGVyLkNsYW1wKEVZLCAwLCByb3dzIC0gMSk7XHJcbiAgICAgICAgICAgIHZhciBYID0gU1g7XHJcbiAgICAgICAgICAgIHZhciBZID0gU1k7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBuZXcgVGlsZURhdGEoKTtcclxuICAgICAgICAgICAgVC5yb3cgPSBZO1xyXG4gICAgICAgICAgICBULmNvbHVtbiA9IFg7XHJcbiAgICAgICAgICAgIFQudGV4dHVyZSA9IDE7XHJcbiAgICAgICAgICAgIFQuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIFQudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIFQubWFwID0gdGhpcztcclxuICAgICAgICAgICAgVC5zb2xpZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChicmVha2FibGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDE7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5SYW5kb20oKSA8IDAuMDIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gTWF0aC5SYW5kb20oKSA8IDAuNSA/IDUgOiA2O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgVC5CcmVha2FibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gMDtcclxuICAgICAgICAgICAgICAgIFQuQnJlYWthYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2hpbGUgKFkgPCBFWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWCA9IFNYO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKFggPCBFWClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvKnZhciBUVCA9IFQuQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBUVC5jb2x1bW4gPSBYO1xyXG4gICAgICAgICAgICAgICAgICAgIFRULnJvdyA9IFk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtYLCBZXSA9IFRUOyovXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIFRUID0gZGF0YVtYLCBZXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoVFQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRUID0gVC5DbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoVC5zb2xpZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRULnRleHR1cmUgPSBULnRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRULkJyZWFrYWJsZSA9IFQuQnJlYWthYmxlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBYKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBZKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgRmlsbFJlY3QoaW50IGNvbHVtbiwgaW50IHJvdywgaW50IFdpZHRoLCBpbnQgSGVpZ2h0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFNYID0gKGludCkoY29sdW1uKTtcclxuICAgICAgICAgICAgdmFyIFNZID0gKGludCkocm93KTtcclxuICAgICAgICAgICAgdmFyIEVYID0gKGludCkoU1ggKyBXaWR0aCk7XHJcbiAgICAgICAgICAgIHZhciBFWSA9IChpbnQpKFNZICsgSGVpZ2h0KTtcclxuICAgICAgICAgICAgU1ggPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoU1gsIDAsIGNvbHVtbnMgLSAxKTtcclxuICAgICAgICAgICAgU1kgPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoU1ksIDAsIHJvd3MgLSAxKTtcclxuICAgICAgICAgICAgRVggPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoRVgsIDAsIGNvbHVtbnMgLSAxKTtcclxuICAgICAgICAgICAgRVkgPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoRVksIDAsIHJvd3MgLSAxKTtcclxuICAgICAgICAgICAgdmFyIFggPSBTWDtcclxuICAgICAgICAgICAgdmFyIFkgPSBTWTtcclxuICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICBULnJvdyA9IFk7XHJcbiAgICAgICAgICAgIFQuY29sdW1uID0gWDtcclxuICAgICAgICAgICAgVC50ZXh0dXJlID0gMTtcclxuICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgVC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgVC5tYXAgPSB0aGlzO1xyXG4gICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgd2hpbGUgKFkgPCBFWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWCA9IFNYO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKFggPCBFWClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgVFQgPSBULkNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVFQuY29sdW1uID0gWDtcclxuICAgICAgICAgICAgICAgICAgICBUVC5yb3cgPSBZO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbWCwgWV0gPSBUVDtcclxuICAgICAgICAgICAgICAgICAgICBYKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBZKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJhd1JlY3QoaW50IGNvbHVtbiwgaW50IHJvdywgaW50IFdpZHRoLCBpbnQgSGVpZ2h0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFggPSBjb2x1bW47XHJcbiAgICAgICAgICAgIHZhciBZID0gcm93O1xyXG4gICAgICAgICAgICB2YXIgVFggPSBYO1xyXG4gICAgICAgICAgICB2YXIgVFkgPSBZO1xyXG4gICAgICAgICAgICB2YXIgRVggPSBYICsgV2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBFWSA9IFkgKyBIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoVFggPCBFWClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgVC5yb3cgPSBUWTtcclxuICAgICAgICAgICAgICAgIFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFNldFRpbGUoVFgsIFRZLCBUKTtcclxuICAgICAgICAgICAgICAgIFRYKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVFggPSBYO1xyXG4gICAgICAgICAgICBUWSA9IEVZO1xyXG4gICAgICAgICAgICB3aGlsZSAoVFggPCBFWClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgVC5yb3cgPSBUWTtcclxuICAgICAgICAgICAgICAgIFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFNldFRpbGUoVFgsIFRZLCBUKTtcclxuICAgICAgICAgICAgICAgIFRYKys7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFRYID0gWDtcclxuICAgICAgICAgICAgVFkgPSBZO1xyXG4gICAgICAgICAgICB3aGlsZSAoVFkgPCBFWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgVC5yb3cgPSBUWTtcclxuICAgICAgICAgICAgICAgIFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFNldFRpbGUoVFgsIFRZLCBUKTtcclxuICAgICAgICAgICAgICAgIFRZKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVFggPSBFWDtcclxuICAgICAgICAgICAgVFkgPSBZO1xyXG4gICAgICAgICAgICB3aGlsZSAoVFkgPCBFWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgVC5yb3cgPSBUWTtcclxuICAgICAgICAgICAgICAgIFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFNldFRpbGUoVFgsIFRZLCBUKTtcclxuICAgICAgICAgICAgICAgIFRZKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJhd1JlY3QoUmVjdGFuZ2xlIHJlY3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvKnZhciBQWCA9IChpbnQpKChwb3NpdGlvbi5YIC0gVFAuWCkgLyB0aWxlc2l6ZSk7XHJcbiAgICAgICAgICAgIHZhciBQWSA9IChpbnQpKChwb3NpdGlvbi5ZIC0gVFAuWSkgLyB0aWxlc2l6ZSk7Ki9cclxuICAgICAgICAgICAgRHJhd1JlY3QoKGludCkocmVjdC5sZWZ0IC8gdGlsZXNpemUpLCAoaW50KShyZWN0LnRvcCAvIHRpbGVzaXplKSwgKGludCkocmVjdC53aWR0aCAvIHRpbGVzaXplKSwgKGludCkocmVjdC5oZWlnaHQgLyB0aWxlc2l6ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRBbGwoVGlsZURhdGEgVClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBYID0gMDtcclxuICAgICAgICAgICAgdmFyIFkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoWSA8IHJvd3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFggPSAwO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKFggPCBjb2x1bW5zKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBURCA9IFQuQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBURC5jb2x1bW4gPSBYO1xyXG4gICAgICAgICAgICAgICAgICAgIFRELnJvdyA9IFk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtYLCBZXSA9IFQ7XHJcbiAgICAgICAgICAgICAgICAgICAgWCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgWSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENsZWFyT3V0ZXJSZWN0KGludCBjb2x1bW4sIGludCByb3csIGludCB3aWR0aCwgaW50IGhlaWdodCxib29sIGJvdHRvbT10cnVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFNYID0gKGludCkoY29sdW1uKTtcclxuICAgICAgICAgICAgdmFyIFNZID0gKGludCkocm93KTtcclxuICAgICAgICAgICAgdmFyIEVYID0gKGludCkoU1ggKyB3aWR0aCk7XHJcbiAgICAgICAgICAgIHZhciBFWSA9IChpbnQpKFNZICsgaGVpZ2h0KTtcclxuICAgICAgICAgICAgU1ggPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoU1gsIDAsIGNvbHVtbnMgLSAxKTtcclxuICAgICAgICAgICAgU1kgPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoU1ksIDAsIHJvd3MgLSAxKTtcclxuICAgICAgICAgICAgRVggPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoRVgsIDAsIGNvbHVtbnMgLSAxKTtcclxuICAgICAgICAgICAgRVkgPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoRVksIDAsIHJvd3MgLSAxKTtcclxuICAgICAgICAgICAgdmFyIFggPSBTWDtcclxuICAgICAgICAgICAgdmFyIFkgPSBTWTtcclxuICAgICAgICAgICAgdmFyIFQgPSBuZXcgVGlsZURhdGEoKTtcclxuICAgICAgICAgICAgVC5tYXAgPSB0aGlzO1xyXG4gICAgICAgICAgICBULnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgVC5zb2xpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgVFggPSBYO1xyXG4gICAgICAgICAgICB2YXIgVFkgPSBZO1xyXG4gICAgICAgICAgICB3aGlsZSAoVFggPCBFWC0xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgVFQgPSBULkNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICBUVC5jb2x1bW4gPSBUWDtcclxuICAgICAgICAgICAgICAgIFRULnJvdyA9IFRZO1xyXG4gICAgICAgICAgICAgICAgU2V0VGlsZShUWCwgVFksIFRUKTtcclxuICAgICAgICAgICAgICAgIFRYKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVFggPSBYO1xyXG4gICAgICAgICAgICBUWSA9IEVZO1xyXG4gICAgICAgICAgICBpZiAoYm90dG9tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoVFggPCBFWClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgVFQgPSBULkNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICAgICAgVFQucm93ID0gVFk7XHJcbiAgICAgICAgICAgICAgICAgICAgU2V0VGlsZShUWCwgVFksIFRUKTtcclxuICAgICAgICAgICAgICAgICAgICBUWCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBUWCA9IFg7XHJcbiAgICAgICAgICAgIFRZID0gWTtcclxuICAgICAgICAgICAgd2hpbGUgKFRZIDwgRVktMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIFRUID0gVC5DbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgVFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICBUVC5yb3cgPSBUWTtcclxuICAgICAgICAgICAgICAgIFNldFRpbGUoVFgsIFRZLCBUVCk7XHJcbiAgICAgICAgICAgICAgICBUWSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFRYID0gRVg7XHJcbiAgICAgICAgICAgIFRZID0gWTtcclxuICAgICAgICAgICAgd2hpbGUgKFRZIDwgRVktMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIFRUID0gVC5DbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgVFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICBUVC5yb3cgPSBUWTtcclxuICAgICAgICAgICAgICAgIFNldFRpbGUoVFgsIFRZLCBUVCk7XHJcbiAgICAgICAgICAgICAgICBUWSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENsZWFyUmVjdChpbnQgY29sdW1uLCBpbnQgcm93LCBpbnQgd2lkdGgsIGludCBoZWlnaHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgU1ggPSAoaW50KShjb2x1bW4pO1xyXG4gICAgICAgICAgICB2YXIgU1kgPSAoaW50KShyb3cpO1xyXG4gICAgICAgICAgICB2YXIgRVggPSAoaW50KShTWCArIHdpZHRoKTtcclxuICAgICAgICAgICAgdmFyIEVZID0gKGludCkoU1kgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICBTWCA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChTWCwgMCwgY29sdW1ucyAtIDEpO1xyXG4gICAgICAgICAgICBTWSA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChTWSwgMCwgcm93cyAtIDEpO1xyXG4gICAgICAgICAgICBFWCA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChFWCwgMCwgY29sdW1ucyAtIDEpO1xyXG4gICAgICAgICAgICBFWSA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChFWSwgMCwgcm93cyAtIDEpO1xyXG4gICAgICAgICAgICB2YXIgWCA9IFNYO1xyXG4gICAgICAgICAgICB2YXIgWSA9IFNZO1xyXG4gICAgICAgICAgICB2YXIgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgIFQudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBULnNvbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFQuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB3aGlsZSAoWSA8IEVZKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBYID0gU1g7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoWCA8IEVYKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBUVCA9IFQuQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBUVC5jb2x1bW4gPSBYO1xyXG4gICAgICAgICAgICAgICAgICAgIFRULnJvdyA9IFk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtYLCBZXSA9IFRUO1xyXG4gICAgICAgICAgICAgICAgICAgIFgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDbGVhclJlY3QoUmVjdGFuZ2xlIHJlY3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgU1ggPSAoaW50KShyZWN0LmxlZnQgLyB0aWxlc2l6ZSk7XHJcbiAgICAgICAgICAgIHZhciBTWSA9IChpbnQpKHJlY3QudG9wIC8gdGlsZXNpemUpO1xyXG4gICAgICAgICAgICB2YXIgRVggPSAoaW50KShyZWN0LnJpZ2h0IC8gdGlsZXNpemUpO1xyXG4gICAgICAgICAgICB2YXIgRVkgPSAoaW50KShyZWN0LmhlaWdodCAvIHRpbGVzaXplKTtcclxuICAgICAgICAgICAgdmFyIFggPSBTWDtcclxuICAgICAgICAgICAgdmFyIFkgPSBTWTtcclxuICAgICAgICAgICAgdmFyIFQgPSBuZXcgVGlsZURhdGEoKTtcclxuICAgICAgICAgICAgVC5tYXAgPSB0aGlzO1xyXG4gICAgICAgICAgICBULnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgVC5zb2xpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB3aGlsZSAoWSA8IEVZKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBYID0gU1g7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoWCA8IEVYKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBUVCA9IFQuQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBUVC5jb2x1bW4gPSBYO1xyXG4gICAgICAgICAgICAgICAgICAgIFRULnJvdyA9IFk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtYLCBZXSA9IFRUO1xyXG4gICAgICAgICAgICAgICAgICAgIFgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRUaWxlKGludCBjb2x1bW4sIGludCByb3csIFRpbGVEYXRhIFQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY29sdW1uID49IDAgJiYgcm93ID49IDAgJiYgY29sdW1uIDwgZGF0YS5HZXRMZW5ndGgoMCkgJiYgcm93IDwgZGF0YS5HZXRMZW5ndGgoMSkpXHJcbiAgICAgICAgICAgICAgICBkYXRhW2NvbHVtbiwgcm93XSA9IFQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBpbnQgYmx1cihpbnRbXSBhcnJheSwgaW50IGluZGV4LCBpbnQgYmx1ciA9IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgdG90YWwgPSAwO1xyXG4gICAgICAgICAgICBpbnQgcmV0ID0gMDtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICBpbnQgaW5kID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGlmIChpbmQgPj0gMCAmJiBpbmQgPCBhcnJheS5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsKys7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gYXJyYXlbaW5kXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGJsdXIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGluZC0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZCA+PSAwICYmIGluZCA8IGFycmF5Lkxlbmd0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBhcnJheVtpbmRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGJsdXIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGluZCsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZCA+PSAwICYmIGluZCA8IGFycmF5Lkxlbmd0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBhcnJheVtpbmRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQgLyB0b3RhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFRpbGVEYXRhIENoZWNrRm9yVGlsZShWZWN0b3IyIHBvc2l0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLypwb3NpdGlvbiA9IHBvc2l0aW9uIC0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICAgICAgcG9zaXRpb24gLz0gdGlsZXNpemU7XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5YPj0wICYmIHBvc2l0aW9uLlg8Y29sdW1ucyAmJiBwb3NpdGlvbi5ZPj0wICYmIHBvc2l0aW9uLlk8cm93cylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFbKGludClwb3NpdGlvbi5YLCAoaW50KXBvc2l0aW9uLlldO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgdmFyIFRQID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICAgICAgdmFyIFBYID0gKGludCkoKHBvc2l0aW9uLlggLSBUUC5YKSAvIHRpbGVzaXplKTtcclxuICAgICAgICAgICAgdmFyIFBZID0gKGludCkoKHBvc2l0aW9uLlkgLSBUUC5ZKSAvIHRpbGVzaXplKTtcclxuICAgICAgICAgICAgaWYgKFBYID49IDAgJiYgUFggPCBjb2x1bW5zICYmIFBZID49IDAgJiYgUFkgPCByb3dzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVtQWCwgUFldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVGlsZURhdGEgR2V0VGlsZShpbnQgY29sdW1uLCBpbnQgcm93KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGNvbHVtbiA+PSAwICYmIHJvdyA+PSAwICYmIGNvbHVtbiA8IGNvbHVtbnMgJiYgcm93IDwgcm93cylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFbY29sdW1uLCByb3ddO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdm9pZCBfRHJhdygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobmVlZFJlZHJhdy8qICYmICFBbmltYXRpb25Mb2FkZXIuX3RoaXMuSXNMb2FkaW5nKFwiVGlsZVwiKSovKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgVyA9IChpbnQpTWF0aC5DZWlsaW5nKGNvbHVtbnMgKiB0aWxlc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICBpbnQgSCA9IChpbnQpTWF0aC5DZWlsaW5nKHJvd3MgKiB0aWxlc2l6ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJ1ZmZlci5XaWR0aCAhPSBXIHx8IGJ1ZmZlci5IZWlnaHQgIT0gSClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIuV2lkdGggPSBXO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5IZWlnaHQgPSBIO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJnLkNsZWFyUmVjdCgwLCAwLCBidWZmZXIuV2lkdGgsIGJ1ZmZlci5IZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIFJlZHJhdyhiZyk7XHJcbiAgICAgICAgICAgICAgICBuZWVkUmVkcmF3ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBSZWN0YW5nbGUgcnRtcCA9IG5ldyBSZWN0YW5nbGUoKTtcclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX0RyYXcoKTtcclxuICAgICAgICAgICAgLy9nLkRyYXdJbWFnZShidWZmZXIsIHBvc2l0aW9uLlgsIHBvc2l0aW9uLlkpO1xyXG4gICAgICAgICAgICBydG1wLkNvcHlGcm9tKGdhbWUuY2FtZXJhLkNhbWVyYUJvdW5kcyk7XHJcbiAgICAgICAgICAgIC8vaGlkZSBmbG9hdGluZyBwb2ludCBzZWFtcy5cclxuICAgICAgICAgICAgcnRtcC54IC09IDE7XHJcbiAgICAgICAgICAgIHJ0bXAueSAtPSAxO1xyXG4gICAgICAgICAgICBydG1wLndpZHRoICs9IDI7XHJcbiAgICAgICAgICAgIHJ0bXAuaGVpZ2h0ICs9IDI7XHJcbiAgICAgICAgICAgIHZhciBDQiA9IHJ0bXA7XHJcbiAgICAgICAgICAgIC8vdmFyIENCID0gZ2FtZS5jYW1lcmEuQ2FtZXJhQm91bmRzO1xyXG4gICAgICAgICAgICAvL2cuRHJhd0ltYWdlKGJ1ZmZlciwgQ0IubGVmdC1wb3NpdGlvbi5YLCBDQi50b3AtcG9zaXRpb24uWSwgQ0Iud2lkdGgsIENCLmhlaWdodCwgQ0IubGVmdCwgQ0IudG9wLCBDQi53aWR0aCwgQ0IuaGVpZ2h0KTsvL2RyYXcgbWFwIGNyb3BwZWQgdG8gY2FtZXJhIGJvdW5kc1xyXG4gICAgICAgICAgICBnLkRyYXdJbWFnZShidWZmZXIsIENCLmxlZnQgLSBwb3NpdGlvbi5YLCBDQi50b3AgLSBwb3NpdGlvbi5ZLCBDQi53aWR0aCwgQ0IuaGVpZ2h0LCBDQi5sZWZ0LCBDQi50b3AsIENCLndpZHRoLCBDQi5oZWlnaHQpOy8vZHJhdyBtYXAgY3JvcHBlZCB0byBjYW1lcmEgYm91bmRzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZHJhd1RpbGUoaW50IFgsIGludCBZLCBib29sIHVwZGF0ZU5laWdoYm9ycyA9IHRydWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodXBkYXRlTmVpZ2hib3JzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgVFggPSAoWCAtIDEpICogKGludCl0aWxlc2l6ZTtcclxuICAgICAgICAgICAgICAgIGludCBUWSA9IChZIC0gMSkgKiAoaW50KXRpbGVzaXplO1xyXG4gICAgICAgICAgICAgICAgYmcuQ2xlYXJSZWN0KFRYLCBUWSwgKGludCl0aWxlc2l6ZSAqIDMsIChpbnQpdGlsZXNpemUgKiAzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBSZWRyYXcoYmcsIFggLSAxLCBZIC0gMSwgMywgMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgVFggPSAoWCkgKiAoaW50KXRpbGVzaXplO1xyXG4gICAgICAgICAgICAgICAgaW50IFRZID0gKFkpICogKGludCl0aWxlc2l6ZTtcclxuICAgICAgICAgICAgICAgIGJnLkNsZWFyUmVjdChUWCwgVFksIChpbnQpdGlsZXNpemUsIChpbnQpdGlsZXNpemUpO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlZHJhdyhiZywgWCwgWSwgMSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZywgaW50IFNYID0gLTEsIGludCBTWSA9IC0xLCBpbnQgVyA9IC0xLCBpbnQgSCA9IC0xKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgUFggPSBwb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBQWSA9IHBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIFBYID0gMDtcclxuICAgICAgICAgICAgUFkgPSAwO1xyXG4gICAgICAgICAgICBpZiAoU1ggPT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNYID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoU1kgPT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNZID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFcgPT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFcgPSBjb2x1bW5zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChIID09IC0xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIID0gcm93cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgRVggPSBTWCArIFc7XHJcbiAgICAgICAgICAgIHZhciBFWSA9IFNZICsgSDtcclxuICAgICAgICAgICAgU1ggPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoU1gsIDAsIGNvbHVtbnMpO1xyXG4gICAgICAgICAgICBTWSA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChTWSwgMCwgcm93cyk7XHJcblxyXG4gICAgICAgICAgICBFWCA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChFWCwgMCwgY29sdW1ucyk7XHJcbiAgICAgICAgICAgIEVZID0gKGludClNYXRoSGVscGVyLkNsYW1wKEVZLCAwLCByb3dzKTtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IFggPSBQWCArIChTWCAqIHRpbGVzaXplKTtcclxuICAgICAgICAgICAgZmxvYXQgWSA9IFBZICsgKFNZICogdGlsZXNpemUpO1xyXG4gICAgICAgICAgICBpbnQgcm93ID0gU1k7XHJcbiAgICAgICAgICAgIGludCBjb2x1bW4gPSBTWDtcclxuICAgICAgICAgICAgdmFyIEJHID0gdGlsZXNbMl07XHJcbiAgICAgICAgICAgIHZhciBCRzIgPSB0aWxlc1szXTtcclxuICAgICAgICAgICAgdmFyIHRpbGVzQyA9IHRpbGVzLkNvdW50O1xyXG5cclxuICAgICAgICAgICAgUmVjdGFuZ2xlIFIgPSBuZXcgUmVjdGFuZ2xlKCk7XHJcbiAgICAgICAgICAgIHZhciBkb29ycm9vbSA9IE1hcEdlbmVyYXRvci5kb29ycm9vbTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChyb3cgPCBFWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbHVtbiA8IEVYKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgKFIuaXNUb3VjaGluZyhuZXcgUmVjdGFuZ2xlKFgsIFksIHRpbGVzaXplLCB0aWxlc2l6ZSkpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IGRhdGFbY29sdW1uLCByb3ddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4ID0gTWF0aC5NaW4odGlsZXMuQ291bnQgLSAxLCBULnRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVC5lbmFibGVkICYmIHRleCA+PSAwICYmIHRleCA8IHRpbGVzQylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5EcmF3SW1hZ2UodGlsZXNbdGV4XSwgWCwgWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVC5CcmVha2FibGUgJiYgVC5IUCA8IFQubWF4SFApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50IGRtZyA9IChpbnQpTWF0aC5NYXgoMSwgTWF0aC5NaW4oTWF0aC5Sb3VuZChULm1heEhQIC0gVC5IUCksIDMpKSAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5EcmF3SW1hZ2UoY3JhY2tzW2RtZ10sIFgsIFkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50IHNkID0gVC5TbG9wZURpcmVjdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZCAhPSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb2JqZWN0IHNnID0gZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1NjcmlwdC5Xcml0ZShcInNnLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdXQnXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuR2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gQ2FudmFzVHlwZXMuQ2FudmFzQ29tcG9zaXRlT3BlcmF0aW9uVHlwZS5EZXN0aW5hdGlvbk91dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULkdldEhpdGJveDIoUik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUi54IC09IHBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUi55IC09IHBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5CZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLk1vdmVUbyhSLmxlZnQsIFIudG9wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWN0b3IyIFA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUCA9IG5ldyBWZWN0b3IyKFIubGVmdCArIChSLndpZHRoIC8gMmYpLCBSLnRvcCArIChSLmhlaWdodCAvIDJmKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNkID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuTGluZVRvKFIubGVmdCwgUi5ib3R0b20pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkxpbmVUbyhSLnJpZ2h0LCBSLmJvdHRvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkxpbmVUbyhSLnJpZ2h0LCBSLnRvcCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuTGluZVRvKFIubGVmdCwgUi50b3ApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5HbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBDYW52YXNUeXBlcy5DYW52YXNDb21wb3NpdGVPcGVyYXRpb25UeXBlLkRlc3RpbmF0aW9uT3ZlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZG9vcnJvb20hPW51bGwgJiYgZG9vcnJvb20uQ29udGFpbnNUaWxlKGNvbHVtbiwgcm93KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuR2xvYmFsQWxwaGEgPSAwLjVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkZpbGxTdHlsZSA9IFwiIzAwMDAwMFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2cuRmlsbFJlY3QoUi54LlRvRHluYW1pYygpLCBSLnkuVG9EeW5hbWljKCksIFIud2lkdGguVG9EeW5hbWljKCksIFIuaGVpZ2h0LlRvRHluYW1pYygpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5GaWxsUmVjdChYLlRvRHluYW1pYygpLCBZLlRvRHluYW1pYygpLCB0aWxlc2l6ZS5Ub0R5bmFtaWMoKSwgdGlsZXNpemUuVG9EeW5hbWljKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gMWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuRHJhd0ltYWdlKEJHLCBYLCBZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IENhbnZhc1R5cGVzLkNhbnZhc0NvbXBvc2l0ZU9wZXJhdGlvblR5cGUuU291cmNlT3ZlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkRyYXdJbWFnZShNYXRoLlJhbmRvbSgpIDwgMC45OCA/IEJHIDogQkcyLCBYLCBZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkb29ycm9vbSAhPSBudWxsICYmIGRvb3Jyb29tLkNvbnRhaW5zVGlsZShjb2x1bW4sIHJvdykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLypULkdldEhpdGJveDIoUik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUi54IC09IHBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUi55IC09IHBvc2l0aW9uLlk7Ki9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gMC41ZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkZpbGxTdHlsZSA9IFwiIzAwMDAwMFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuRmlsbFJlY3QoWC5Ub0R5bmFtaWMoKSwgWS5Ub0R5bmFtaWMoKSwgdGlsZXNpemUuVG9EeW5hbWljKCksIHRpbGVzaXplLlRvRHluYW1pYygpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gMWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uKys7XHJcbiAgICAgICAgICAgICAgICAgICAgWCArPSB0aWxlc2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFggPSBQWCArIChTWCAqIHRpbGVzaXplKTtcclxuICAgICAgICAgICAgICAgIFkgKz0gdGlsZXNpemU7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW4gPSBTWDtcclxuICAgICAgICAgICAgICAgIHJvdysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIElzRXhwb3NlZChpbnQgWCwgaW50IFkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgcm93ID0gWSAtIDI7XHJcbiAgICAgICAgICAgIGludCBjb2x1bW4gPSBYIC0gMjtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChyb3cgPD0gWSArIDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjb2x1bW4gPD0gWCArIDIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyp2YXIgVCA9IGRhdGFbY29sdW1uLCByb3ddO1xyXG4gICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IE1hdGguUmFuZG9tKCkgPCAwLjUgPyAwIDogMTsqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cgPj0gMCAmJiBjb2x1bW4gPj0gMCAmJiByb3cgPCByb3dzICYmIGNvbHVtbiA8IGNvbHVtbnMpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgVCA9IGRhdGFbY29sdW1uLCByb3ddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIVQuZW5hYmxlZCB8fCAhVC5zb2xpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByb3crKztcclxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IFggLSAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQXBwbHlCcmVha2FibGVSZWN0KGludCBTWCA9IC0xLCBpbnQgU1kgPSAtMSwgaW50IFcgPSAtMSwgaW50IEggPSAtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChTWCA9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU1ggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChTWSA9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU1kgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoVyA9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVyA9IGNvbHVtbnM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKEggPT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEggPSByb3dzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBFWCA9IFNYICsgVztcclxuICAgICAgICAgICAgdmFyIEVZID0gU1kgKyBIO1xyXG4gICAgICAgICAgICBTWCA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChTWCwgMCwgY29sdW1ucyk7XHJcbiAgICAgICAgICAgIFNZID0gKGludClNYXRoSGVscGVyLkNsYW1wKFNZLCAwLCByb3dzKTtcclxuXHJcbiAgICAgICAgICAgIEVYID0gKGludClNYXRoSGVscGVyLkNsYW1wKEVYLCAwLCBjb2x1bW5zKTtcclxuICAgICAgICAgICAgRVkgPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoRVksIDAsIHJvd3MpO1xyXG4gICAgICAgICAgICBpbnQgcm93ID0gU1g7XHJcbiAgICAgICAgICAgIGludCBjb2x1bW4gPSBTWTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChyb3cgPCBFWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbHVtbiA8IEVYKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qdmFyIFQgPSBkYXRhW2NvbHVtbiwgcm93XTtcclxuICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSBNYXRoLlJhbmRvbSgpIDwgMC41ID8gMCA6IDE7Ki9cclxuICAgICAgICAgICAgICAgICAgICB2YXIgVCA9IGRhdGFbY29sdW1uLCByb3ddO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBUVCA9IFQuQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBUVC5jb2x1bW4gPSBjb2x1bW47XHJcbiAgICAgICAgICAgICAgICAgICAgVFQucm93ID0gcm93O1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbY29sdW1uLCByb3ddID0gVFQ7XHJcbiAgICAgICAgICAgICAgICAgICAgVCA9IFRUO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChJc0V4cG9zZWQoY29sdW1uLCByb3cpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguUmFuZG9tKCkgPCAwLjAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSBNYXRoLlJhbmRvbSgpIDwgMC41ID8gNSA6IDY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgVC5CcmVha2FibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBULkJyZWFrYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJvdysrO1xyXG4gICAgICAgICAgICAgICAgY29sdW1uID0gU1g7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmVlZFJlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFwcGx5QnJlYWthYmxlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCByb3cgPSAwO1xyXG4gICAgICAgICAgICBpbnQgY29sdW1uID0gMDtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChyb3cgPCByb3dzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY29sdW1uIDwgY29sdW1ucylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvKnZhciBUID0gZGF0YVtjb2x1bW4sIHJvd107XHJcbiAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gTWF0aC5SYW5kb20oKSA8IDAuNSA/IDAgOiAxOyovXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIFQgPSBkYXRhW2NvbHVtbiwgcm93XTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgVFQgPSBULkNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVFQuY29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgICAgICAgICAgICAgIFRULnJvdyA9IHJvdztcclxuICAgICAgICAgICAgICAgICAgICBkYXRhW2NvbHVtbiwgcm93XSA9IFRUO1xyXG4gICAgICAgICAgICAgICAgICAgIFQgPSBUVDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoSXNFeHBvc2VkKGNvbHVtbiwgcm93KSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLlJhbmRvbSgpIDwgMC4wMilcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gTWF0aC5SYW5kb20oKSA8IDAuNSA/IDUgOiA2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQuQnJlYWthYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVC5CcmVha2FibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByb3crKztcclxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmVlZFJlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHRlc3RUZXh0dXJlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCByb3cgPSAwO1xyXG4gICAgICAgICAgICBpbnQgY29sdW1uID0gMDtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChyb3cgPCByb3dzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY29sdW1uIDwgY29sdW1ucylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgVCA9IGRhdGFbY29sdW1uLCByb3ddO1xyXG4gICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IE1hdGguUmFuZG9tKCkgPCAwLjUgPyAwIDogMTtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJvdysrO1xyXG4gICAgICAgICAgICAgICAgY29sdW1uID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZWVkUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yMlxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBYO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBMZW5ndGhcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGZsb2F0KU1hdGguU3FydCgoWCAqIFgpICsgKFkgKiBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IERpc3RhbmNlKFZlY3RvcjIgUClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBYWCA9IFggLSBQLlg7XHJcbiAgICAgICAgICAgIHZhciBZWSA9IFkgLSBQLlk7XHJcbiAgICAgICAgICAgIHJldHVybiAoZmxvYXQpTWF0aC5TcXJ0KChYWCAqIFhYKSArIChZWSAqIFlZKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gUmV0dXJucyBhIHJvdWdoIGVzdGltYXRlIG9mIHRoZSB2ZWN0b3IncyBsZW5ndGguXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgRXN0aW1hdGVkTGVuZ3RoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIEEgPSBNYXRoLkFicyhYKTtcclxuICAgICAgICAgICAgICAgIHZhciBCID0gTWF0aC5BYnMoWSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoQiA+IEEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRtcCA9IEE7XHJcbiAgICAgICAgICAgICAgICAgICAgQSA9IEI7XHJcbiAgICAgICAgICAgICAgICAgICAgQiA9IHRtcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEIgKj0gMC4zNDtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZmxvYXQpKEEgKyBCKTtcclxuICAgICAgICAgICAgICAgIC8vcmV0dXJuIChmbG9hdCkoTWF0aC5BYnMoWCkgKyBNYXRoLkFicyhZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBSZXR1cm5zIGEgcm91Z2ggZXN0aW1hdGUgb2YgdGhlIHZlY3RvcidzIGxlbmd0aC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBFc3RpbWF0ZWREaXN0YW5jZShWZWN0b3IyIFApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgQSA9IE1hdGguQWJzKFggLSBQLlgpO1xyXG4gICAgICAgICAgICB2YXIgQiA9IE1hdGguQWJzKFkgLSBQLlkpO1xyXG4gICAgICAgICAgICBpZiAoQiA+IEEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB0bXAgPSBBO1xyXG4gICAgICAgICAgICAgICAgQSA9IEI7XHJcbiAgICAgICAgICAgICAgICBCID0gdG1wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEIgKj0gMC4zNDtcclxuICAgICAgICAgICAgcmV0dXJuIChmbG9hdCkoQSArIEIpO1xyXG4gICAgICAgICAgICAvL3JldHVybiAoZmxvYXQpKE1hdGguQWJzKFgpICsgTWF0aC5BYnMoWSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFJldHVybnMgdGhlIHN1bSBvZiBpdHMgYWJzb2x1dGUgcGFydHMuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgUm91Z2hMZW5ndGhcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGZsb2F0KShNYXRoLkFicyhYKSArIE1hdGguQWJzKFkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMihmbG9hdCB4ID0gMCwgZmxvYXQgeSA9IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlggPSB4O1xyXG4gICAgICAgICAgICB0aGlzLlkgPSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBNdWx0aXBseShmbG9hdCBmKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgWCAqPSBmO1xyXG4gICAgICAgICAgICBZICo9IGY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFJvdWdoTm9ybWFsaXplKGZsb2F0IGxlbmd0aCA9IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCBEID0gTGVuZ3RoIC8gbGVuZ3RoO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoWCAvIEQsIFkgLyBEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgTm9ybWFsaXplKGZsb2F0IGxlbmd0aCA9IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCBkaXN0YW5jZSA9IE1hdGguU3FydChYICogWCArIFkgKiBZKS5BczxmbG9hdD4oKTtcclxuICAgICAgICAgICAgVmVjdG9yMiBWID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICAgICAgVi5YID0gWCAvIGRpc3RhbmNlO1xyXG4gICAgICAgICAgICBWLlkgPSBZIC8gZGlzdGFuY2U7XHJcbiAgICAgICAgICAgIFYuWCAqPSBsZW5ndGg7XHJcbiAgICAgICAgICAgIFYuWSAqPSBsZW5ndGg7XHJcbiAgICAgICAgICAgIHJldHVybiBWO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRBc05vcm1hbGl6ZShmbG9hdCBsZW5ndGggPSAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgZGlzdGFuY2UgPSBNYXRoLlNxcnQoWCAqIFggKyBZICogWSkuQXM8ZmxvYXQ+KCk7XHJcbiAgICAgICAgICAgIFggPSBYIC8gZGlzdGFuY2U7XHJcbiAgICAgICAgICAgIFkgPSBZIC8gZGlzdGFuY2U7XHJcbiAgICAgICAgICAgIFggKj0gbGVuZ3RoO1xyXG4gICAgICAgICAgICBZICo9IGxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgVG9DYXJkaW5hbCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgeCA9IFg7XHJcbiAgICAgICAgICAgIHZhciB5ID0gWTtcclxuICAgICAgICAgICAgdmFyIEEgPSBNYXRoLkFicyhYKTtcclxuICAgICAgICAgICAgdmFyIEIgPSBNYXRoLkFicyhZKTtcclxuICAgICAgICAgICAgaWYgKEIgPiBBKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChBID4gQilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHgsIHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBFcXVhbHMoVmVjdG9yMiBvKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVmVjdG9yMiBCID0gKFZlY3RvcjIpbztcclxuICAgICAgICAgICAgaWYgKHRoaXMgIT0gQiAmJiBCID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQi5YID09IFggJiYgQi5ZID09IFk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBib29sIEVxdWFscyhvYmplY3QgbylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChvIGlzIFZlY3RvcjIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFZlY3RvcjIgQiA9IChWZWN0b3IyKW87XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcyAhPSBCICYmIEIgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQi5YID09IFggJiYgQi5ZID09IFk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJhc2UuRXF1YWxzKG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgb3BlcmF0b3IgPT0oVmVjdG9yMiBBLCBWZWN0b3IyIEIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBvYmplY3QgT0EgPSBBO1xyXG4gICAgICAgICAgICBvYmplY3QgT0IgPSBCO1xyXG4gICAgICAgICAgICBpZiAoKE9BID09IG51bGwgfHwgT0IgPT0gbnVsbCkgJiYgKE9BICE9IG51bGwgfHwgT0IgIT0gbnVsbCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoT0EgPT0gbnVsbCAmJiBPQiA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQS5YID09IEIuWCAmJiBBLlkgPT0gQi5ZO1xyXG4gICAgICAgICAgICAvL3JldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKCgoT2JqZWN0KUEpICE9ICgoT2JqZWN0KUIpICYmIChBID09IG51bGwgfHwgQiA9PSBudWxsKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAoQS5YID09IEIuWCAmJiBBLlkgPT0gQi5ZKTtcclxuICAgICAgICAgICAgcmV0dXJuICgoKE9iamVjdClBKSAhPSAoKE9iamVjdClCKSkgfHwgKEEuWCA9PSBCLlggJiYgQS5ZID09IEIuWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBvcGVyYXRvciAhPShWZWN0b3IyIEEsIFZlY3RvcjIgQilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAhKEEgPT0gQik7XHJcbiAgICAgICAgICAgIGlmICgoKE9iamVjdClBKSAhPSAoKE9iamVjdClCKSAmJiAoQSA9PSBudWxsIHx8IEIgPT0gbnVsbCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAhKEEuWCA9PSBCLlggJiYgQS5ZID09IEIuWSk7XHJcbiAgICAgICAgICAgIHJldHVybiAhKCgoKE9iamVjdClBKSAhPSAoKE9iamVjdClCKSkgfHwgKEEuWCA9PSBCLlggJiYgQS5ZID09IEIuWSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFZlY3RvcjIgb3BlcmF0b3IgKihWZWN0b3IyIEEsIGZsb2F0IHNjYWxlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKEEuWCAqIHNjYWxlLCBBLlkgKiBzY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVmVjdG9yMiBvcGVyYXRvciAvKFZlY3RvcjIgQSwgZmxvYXQgc2NhbGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoQS5YIC8gc2NhbGUsIEEuWSAvIHNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIG9wZXJhdG9yICsoVmVjdG9yMiBBLCBWZWN0b3IyIEIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoQS5YICsgQi5YLCBBLlkgKyBCLlkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFZlY3RvcjIgb3BlcmF0b3IgLShWZWN0b3IyIEEsIFZlY3RvcjIgQilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihBLlggLSBCLlgsIEEuWSAtIEIuWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVmVjdG9yMiBFbXB0eVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBUb0FuZ2xlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoSGVscGVyLldyYXBSYWRpYW5zKE1hdGhIZWxwZXIuR2V0QW5nbGUodGhpcykpO1xyXG4gICAgICAgICAgICAvL3JldHVybiBNYXRoSGVscGVyLldyYXBSYWRpYW5zKE1hdGhIZWxwZXIuR2V0QW5nbGUobmV3IFZlY3RvcjIoKSwgdGhpcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFZlY3RvcjIgRnJvbVJhZGlhbihmbG9hdCByYWRpYW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aEhlbHBlci5SYWRpYW5Ub1ZlY3RvcihyYWRpYW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBDbG9uZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoWCwgWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENvcHlGcm9tKFZlY3RvcjIgVilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChWID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIFggPSBWLlg7XHJcbiAgICAgICAgICAgIFkgPSBWLlk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFJvdGF0ZShmbG9hdCByYWRpYW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IFRvQW5nbGUoKSArIHJhZGlhbjtcclxuICAgICAgICAgICAgcmV0dXJuIEZyb21SYWRpYW4oYW5nbGUpLk5vcm1hbGl6ZShMZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFZlY3RvcjIgQWRkKFZlY3RvcjIgQSwgVmVjdG9yMiBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKEEuWCArIEIuWCwgQS5ZICsgQi5ZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIEFkZChWZWN0b3IyIEEsIGZsb2F0IFgsIGZsb2F0IFkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoQS5YICsgWCwgQS5ZICsgWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVmVjdG9yMiBTdWJ0cmFjdChWZWN0b3IyIEEsIFZlY3RvcjIgQilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihBLlggLSBCLlgsIEEuWSAtIEIuWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVmVjdG9yMiBTdWJ0cmFjdChWZWN0b3IyIEEsIGZsb2F0IFgsIGZsb2F0IFkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoQS5YIC0gWCwgQS5ZIC0gWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChWZWN0b3IyIFYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBYICs9IFYuWDtcclxuICAgICAgICAgICAgWSArPSBWLlk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN1YnRyYWN0KFZlY3RvcjIgVilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFggLT0gVi5YO1xyXG4gICAgICAgICAgICBZIC09IFYuWTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQWltZWRTaG9vdGVyIDogRW50aXR5QmVoYXZpb3JcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIGludCB0aW1lID0gMDtcclxuICAgICAgICBwdWJsaWMgaW50IG1heHRpbWUgPSA2MCAqIDg7XHJcbiAgICAgICAgcHVibGljIEVudGl0eSBUYXJnZXQ7XHJcbiAgICAgICAgLy9wdWJsaWMgZmxvYXQgbWF4RGlzdGFuY2UgPSAxMjA7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IG1heERpc3RhbmNlID0gMTMwO1xyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgYXR0YWNrcG93ZXIgPSAxO1xyXG4gICAgICAgIHB1YmxpYyBBaW1lZFNob290ZXIoRW50aXR5IGVudGl0eSkgOiBiYXNlKGVudGl0eSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8qZW50aXR5LkFuaS5IdWVDb2xvciA9IFwiI0ZGMDAwMFwiO1xyXG4gICAgICAgICAgICBlbnRpdHkuQW5pLkh1ZVJlY29sb3JTdHJlbmd0aCA9IDIuMGY7Ki9cclxuICAgICAgICAgICAgZW50aXR5LkFuaS5TaGFkb3djb2xvciA9IFwiI0ZGMDAwMFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgVXBkYXRlVGFyZ2V0KCk7XHJcbiAgICAgICAgICAgIHZhciBBID0gZW50aXR5LkFuaTtcclxuXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgaWYgKFRhcmdldCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGltZSA8IDYwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgKCh0aW1lICYgNCkgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9BLlNoYWRvdyA9IDYtKHRpbWUgKiAwLjFmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQS5TaGFkb3cgPSA1O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBLlNoYWRvdyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEEuU2hhZG93ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRpbWUtLTtcclxuICAgICAgICAgICAgICAgIGlmICh0aW1lIDw9IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUmVzZXRUaW1lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNob290KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEEuU2hhZG93ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKkEuU2hhZG93Y29sb3IgPSBBLkh1ZUNvbG9yO1xyXG4gICAgICAgICAgICBBLlNoYWRvdyA9IEEuU2hhZG93Y29sb3IgIT0gXCJcIiA/IDAgOiAzO1xyXG4gICAgICAgICAgICBBLkh1ZUNvbG9yID0gXCIjRkYwMDAwXCI7XHJcbiAgICAgICAgICAgIEEuSHVlUmVjb2xvclN0cmVuZ3RoID0gMi4wZjsqL1xyXG4gICAgICAgICAgICAvL0EuVXBkYXRlKCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZvaWQgVXBkYXRlVGFyZ2V0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChUYXJnZXQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKFRhcmdldC5Qb3NpdGlvbi5Fc3RpbWF0ZWREaXN0YW5jZShlbnRpdHkuUG9zaXRpb24pID4gbWF4RGlzdGFuY2UpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBUID0gZW50aXR5LkdhbWUucGxheWVyO1xyXG4gICAgICAgICAgICBpZiAoVC5Qb3NpdGlvbi5Fc3RpbWF0ZWREaXN0YW5jZShlbnRpdHkuUG9zaXRpb24pPG1heERpc3RhbmNlKXtcclxuICAgICAgICAgICAgICAgIFRhcmdldCA9IFQ7XHJcbiAgICAgICAgICAgICAgICBSZXNldFRpbWVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFJlc2V0VGltZXIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGltZSA9IChtYXh0aW1lLzIpO1xyXG4gICAgICAgICAgICB0aW1lICs9IChpbnQpTWF0aC5Sb3VuZCh0aW1lICogTWF0aC5SYW5kb20oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBTaG9vdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVGFyZ2V0ID09IG51bGwgfHwgKChJQ29tYmF0YW50KVRhcmdldCkuSFA8PTApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBQID0gbmV3IFBsYXllckJ1bGxldChlbnRpdHkuR2FtZSwgZW50aXR5LCBcImltYWdlcy9taXNjL2VidWxsZXRcIik7XHJcbiAgICAgICAgICAgIFAuUG9zaXRpb24uQ29weUZyb20oZW50aXR5LmdldENlbnRlcigpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBEID0gKFRhcmdldC5nZXRDZW50ZXIoKSAtIFAuUG9zaXRpb24pO1xyXG4gICAgICAgICAgICBELlNldEFzTm9ybWFsaXplKDAuNWYpO1xyXG4gICAgICAgICAgICBQLkhzcGVlZCA9IEQuWDtcclxuICAgICAgICAgICAgUC5Wc3BlZWQgPSBELlk7XHJcbiAgICAgICAgICAgIFAudG91Y2hEYW1hZ2UgPSBhdHRhY2twb3dlcjtcclxuICAgICAgICAgICAgZW50aXR5LkdhbWUuQWRkRW50aXR5KFApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDaGVzdCA6IEVudGl0eVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBDaGVzdChHYW1lIGdhbWUpIDogYmFzZShnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQW5pID0gbmV3IEFuaW1hdGlvbihBbmltYXRpb25Mb2FkZXIuX3RoaXMuR2V0QW5pbWF0aW9uKFwiaW1hZ2VzL21pc2MvY2hlc3RcIikpO1xyXG4gICAgICAgICAgICBBbmkuSW1hZ2VTcGVlZCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEdvbGRpZnkoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFAgPSBBbmkuUG9zaXRpb247XHJcbiAgICAgICAgICAgIEFuaSA9IG5ldyBBbmltYXRpb24oQW5pbWF0aW9uTG9hZGVyLl90aGlzLkdldEFuaW1hdGlvbihcImltYWdlcy9taXNjL2dvbGRjaGVzdFwiKSk7XHJcbiAgICAgICAgICAgIEFuaS5JbWFnZVNwZWVkID0gMDtcclxuICAgICAgICAgICAgQW5pLlBvc2l0aW9uLkNvcHlGcm9tKFApO1xyXG4gICAgICAgICAgICBHb2xkZW4gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBGb3JjZUxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBib29sIEdvbGRlbiB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBPcGVuZWQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBGID0gR2V0Rmxvb3IoKTtcclxuICAgICAgICAgICAgaWYgKEYgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVnNwZWVkID0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFZzcGVlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICB5ID0gRi5HZXRIaXRib3goKS50b3AgLSBBbmkuQ3VycmVudEltYWdlLkhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgUCA9IChQbGF5ZXJDaGFyYWN0ZXIpR2FtZS5wbGF5ZXI7XHJcbiAgICAgICAgICAgIGlmIChQLlBvc2l0aW9uLkVzdGltYXRlZERpc3RhbmNlKFBvc2l0aW9uKSA8IDE2KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUZvcmNlTG9ja2VkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghT3BlbmVkICYmIFAuQ29udHJvbGxlclsyXSAmJiAoUC5rZXlzID4gMCB8fCBHb2xkZW4pKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFHb2xkZW4pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFAua2V5cy0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9wZW4oUCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoUC5Db250cm9sbGVyWzJdKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFAuTVNHLkNoYW5nZVRleHQoXCJJdCdzIHNlYWxlZCB3aXRoIG1hZ2ljLi4uXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0cmluZ1tdIFR1cGxlTmFtZXMgPSBuZXcgc3RyaW5nW117XCJOdWxsXCIsXCJTaW5nbGVcIixcIkRvdWJsZVwiLFwiVHJpcGxlXCIsXCJRdWFkcnVwbGVcIixcIlF1aW50dXBsZVwiLFwiU2V4dHVwbGVcIixcIlNlcHR1cGxlXCIsXCJPY3R1cGxlXCIsIFwiTm9udXBsZVwiLFwiRGVjdXBsZVwifTtcclxuICAgICAgICBwcml2YXRlIHZvaWQgT3BlbihQbGF5ZXJDaGFyYWN0ZXIgcGxheWVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFPcGVuZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBsYXlTb3VuZChcImNoZXN0b3BlblwiKTtcclxuICAgICAgICAgICAgICAgIEFuaS5DdXJyZW50RnJhbWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgQW5pLlNldEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBBbmkuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBPcGVuZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPOmdpdmUgcGxheWVyIGEgcGVybWFuZW50IHVwZ3JhZGUsIGFuZCBkaXNwbGF5IHRleHQgYWJvdmUgdGhlIGNoZXN0IHRlbGxpbmcgdGhlIHBsYXllciB3aGF0IHRoZXkganVzdCBnb3RcclxuICAgICAgICAgICAgICAgIHZhciBNID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHZhciBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgUyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgICAgIHN0cmluZ1tdIHBpY2tlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAob2spXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1vbiA9IG5ldyBzdHJpbmdbXSB7IFwicG9pbnRcIiwgXCJwb2ludFwiLCBcInBvaW50XCIsIFwicG9pbnRcIiwgXCJwb2ludFwiLCBcInBvaW50XCIsIFwiaGVhcnRcIiwgXCJoZWFydFwiLCBcInRyaXBsZWhlYXJ0XCIsIFwic2luZ2xlb3JiXCIgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmFyZSA9IG5ldyBzdHJpbmdbXSB7IFwiYXR0YWNrcG93ZXJcIiwgXCJkZWZlbnNlcG93ZXJcIiwgXCJtaW5pbmdcIiB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsZWdlbmRhcnkgPSBuZXcgc3RyaW5nW10geyBcInRyaXBsZWp1bXBcIiwgXCJjaGVhcGVyYmxvY2tzXCIsIFwiaW52aW5jaWJpbGl0eVwiLCBcInJlcGVhdGVyXCIgfTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgUiA9IE1hdGguUmFuZG9tKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nIEM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwaWNrZXIgPT0gbnVsbCB8fCBNYXRoLlJhbmRvbSgpIDwgMC4yKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFIgPCAwLjcwICYmICFHb2xkZW4pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tlciA9IGNvbW1vbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFMgPSBcImNvbW1vblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFIgPSBNYXRoLlJhbmRvbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFIgPCAwLjkxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tlciA9IHJhcmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUyA9IFwicmFyZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0gXCIjRkZCQjMzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja2VyID0gbGVnZW5kYXJ5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFMgPSBcImxlZ2VuZGFyeVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0gXCIjRkY1NUZGXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgQyA9IENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLlBpY2s8c3RyaW5nPihwaWNrZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29sbGVjdGFibGVJdGVtIENJO1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoQylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicG9pbnRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBQID0gbmV3IFBvaW50SXRlbShHYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFAuUG9zaXRpb24uQ29weUZyb20oUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5Wc3BlZWQgPSAtMmY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQLkhzcGVlZCA9IC0yZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFAuY29sbGVjdGlvbkRlbGF5ID0gMzA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHYW1lLkFkZEVudGl0eShQKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQID0gbmV3IFBvaW50SXRlbShHYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFAuUG9zaXRpb24uQ29weUZyb20oUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5Wc3BlZWQgPSAtMmY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQLkhzcGVlZCA9IDJmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5jb2xsZWN0aW9uRGVsYXkgPSAzMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWUuQWRkRW50aXR5KFApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE0gPSBcIlBvaW50c1wiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaGVhcnRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuSFAgPj0gcGxheWVyLm1heEhQKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBIID0gbmV3IEhlYWxpbmdJdGVtKEdhbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSC5Qb3NpdGlvbi5Db3B5RnJvbShQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBILlZzcGVlZCA9IC0yZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEguY29sbGVjdGlvbkRlbGF5ID0gMzA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHYW1lLkFkZEVudGl0eShIKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE0gPSBcIkhlYWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidHJpcGxlaGVhcnRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuSFAgPiBwbGF5ZXIubWF4SFAgLyAzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBIMSA9IG5ldyBIZWFsaW5nSXRlbShHYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLlBvc2l0aW9uLkNvcHlGcm9tKFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLlZzcGVlZCA9IC0yZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLkhzcGVlZCA9IC0yZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLmNvbGxlY3Rpb25EZWxheSA9IDMwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR2FtZS5BZGRFbnRpdHkoSDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxID0gbmV3IEhlYWxpbmdJdGVtKEdhbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSDEuUG9zaXRpb24uQ29weUZyb20oUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSDEuVnNwZWVkID0gLTJmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSDEuSHNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLmNvbGxlY3Rpb25EZWxheSA9IDMwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR2FtZS5BZGRFbnRpdHkoSDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxID0gbmV3IEhlYWxpbmdJdGVtKEdhbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSDEuUG9zaXRpb24uQ29weUZyb20oUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSDEuVnNwZWVkID0gLTJmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSDEuSHNwZWVkID0gMmY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIMS5jb2xsZWN0aW9uRGVsYXkgPSAzMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWUuQWRkRW50aXR5KEgxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE0gPSBcIkhlYWwgeDNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2luZ2xlb3JiXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoR2FtZS50aW1lUmVtYWluaW5nID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDSSA9IG5ldyBPcmIoR2FtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDSS5Qb3NpdGlvbi5Db3B5RnJvbShQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDSS5Wc3BlZWQgPSAtMmY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDSS5Ic3BlZWQgPSAtMmY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDSS5jb2xsZWN0aW9uRGVsYXkgPSAzMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWUuQWRkRW50aXR5KENJKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKkNJID0gbmV3IE9yYihHYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENJLlBvc2l0aW9uLkNvcHlGcm9tKFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENJLlZzcGVlZCA9IC0yZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENJLkhzcGVlZCA9IDJmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0kuY29sbGVjdGlvbkRlbGF5ID0gMzA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHYW1lLkFkZEVudGl0eShDSSk7Ki9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNID0gXCJPcmJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibWluaW5nXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGxheWVyLmRpZ3Bvd2VyIDwgMi4wZilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZGlncG93ZXIgKz0gMC41ZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNID0gXCJNaW5pbmcgUG93ZXIgXCIgKyAocGxheWVyLmRpZ3Bvd2VyKSArIFwieFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0cmlwbGVqdW1wXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgUEMgPSBwbGF5ZXIuR2V0QmVoYXZpb3I8UGxhdGZvcm1lckNvbnRyb2xzPigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFBDLm1heEFpckp1bXBzIDwgMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQQy5tYXhBaXJKdW1wcyA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTSA9IFwiVHJpcGxlIEp1bXBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY2hlYXBlcmJsb2Nrc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBsYXllci5ibG9ja3ByaWNlICE9IDkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmJsb2NrcHJpY2UgPSA2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTSA9IFwiQmxvY2tzIGFyZSBjaGVhcGVyIG5vd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbnZpbmNpYmlsaXR5XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGxheWVyLmludmluY2liaWxpdHltb2QgIT0gMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuaW52aW5jaWJpbGl0eW1vZCA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNID0gXCJJbnZpbmNpYmlsaXR5IGV4dGVuZGVkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhdHRhY2twb3dlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmF0dGFja3Bvd2VyICs9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNID0gXCJBdHRhY2sgUG93ZXIgXCIgKyAoaW50KShwbGF5ZXIuYXR0YWNrcG93ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJkZWZlbnNlcG93ZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5kZWZlbnNlcG93ZXIgKz0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE0gPSBcIkRlZmVuc2l2ZSBQb3dlciBcIiArIChpbnQpKHBsYXllci5kZWZlbnNlcG93ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyZXBlYXRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBsYXllci50b3RhbHNob3RzID4gMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIudG90YWxzaG90cyArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTSA9IFR1cGxlTmFtZXNbcGxheWVyLnRvdGFsc2hvdHNdK1wiIHNob3RcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghb2sgJiYgTSAhPSBcIlwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEZsb2F0aW5nTWVzc2FnZSBGTSA9IG5ldyBGbG9hdGluZ01lc3NhZ2UoR2FtZSwgTSk7XHJcbiAgICAgICAgICAgICAgICAgICAgRk0uVGV4dC5UZXh0Q29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICAvL0ZNLlBvc2l0aW9uID0gbmV3IFZlY3RvcjIoeCAtIDgsIHkgLSAyMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgRk0uUG9zaXRpb24gPSBuZXcgVmVjdG9yMih4ICsgOCwgeSAtIDIwKTtcclxuICAgICAgICAgICAgICAgICAgICBHYW1lLkFkZEVudGl0eShGTSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFMgIT0gXCJcIiAmJiBTICE9IFwiY29tbW9uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQbGF5U291bmQoXCJvazJCXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQbGF5U291bmQoXCJqdW1wXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgVGlsZURhdGEgR2V0Rmxvb3IoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVGlsZURhdGEgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZsb2F0IFcgPSBXaWR0aCAvIDM7XHJcbiAgICAgICAgICAgIGZsb2F0IFkgPSBIZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgV2lkdGggLyAyLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBXLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBXaWR0aCAtIFcsIFkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgQ29sbGVjdGFibGVJdGVtIDogRW50aXR5XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGJvb2wgZmxvYXRzID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgbWFnbmV0RGlzdGFuY2UgPSAzNTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgbWFnbmV0U3BlZWQgPSA4O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBtYXhGYWxsU3BlZWQgPSAyO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBmYWxsYWNjZWwgPSAwLjFmO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgaXRlbU5hbWU7XHJcbiAgICAgICAgcHVibGljIGludCBjb2xsZWN0aW9uRGVsYXkgPSAxMDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHNvdW5kID0gXCJwb3dlcnVwXCI7XHJcbiAgICAgICAgcHVibGljIENvbGxlY3RhYmxlSXRlbShHYW1lIGdhbWUsIHN0cmluZyBpdGVtTmFtZSkgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5HZXQoXCJpbWFnZXMvaXRlbXMvXCIgKyBpdGVtTmFtZSkpO1xyXG4gICAgICAgICAgICBBbmkuU2V0SW1hZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5pdGVtTmFtZSA9IGl0ZW1OYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgYm9vbCBDYW5Db2xsZWN0KFBsYXllckNoYXJhY3RlciBwbGF5ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbkRlbGF5ID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbkRlbGF5LS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVmVjdG9yMiBDO1xyXG4gICAgICAgICAgICB2YXIgcGxheWVyID0gR2FtZS5wbGF5ZXI7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbkRlbGF5IDw9IDAgJiYgQ2FuQ29sbGVjdChwbGF5ZXIpICYmICgoQyA9IHBsYXllci5nZXRDZW50ZXIoKSkuRXN0aW1hdGVkRGlzdGFuY2UoUG9zaXRpb24pIDwgbWFnbmV0RGlzdGFuY2UpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgQzIgPSBnZXRDZW50ZXIoKTtcclxuICAgICAgICAgICAgICAgIHZhciBQID0gQyAtIEMyO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxuID0gUC5MZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3BkID0gbWFnbmV0U3BlZWQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgZnNwZCA9IHNwZCAvIE1hdGguTWF4KDEsIGxuKTtcclxuICAgICAgICAgICAgICAgIGlmIChsbiA8PSBmc3BkLyogJiYgQ2FuQ29sbGVjdChHYW1lLnBsYXllcikqLylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLygoUGxheWVyQ2hhcmFjdGVyKUdhbWUucGxheWVyKS5vbkNvbGxlY3RJdGVtKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgSHNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBWc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIFBvc2l0aW9uLkNvcHlGcm9tKEdhbWUucGxheWVyLlBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBvbkNvbGxlY3RlZCgoKFBsYXllckNoYXJhY3RlcilHYW1lLnBsYXllcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIFBsYXlTb3VuZChzb3VuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFAgPSBQLk5vcm1hbGl6ZShmc3BkKTtcclxuICAgICAgICAgICAgICAgIC8qeCArPSBQLlg7XHJcbiAgICAgICAgICAgICAgICB5ICs9IFAuWTsqL1xyXG4gICAgICAgICAgICAgICAgSHNwZWVkID0gUC5YO1xyXG4gICAgICAgICAgICAgICAgVnNwZWVkID0gUC5ZO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vVnNwZWVkID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICghZmxvYXRzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgRiA9IEdldEZsb29yKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoRiA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChWc3BlZWQgPCBtYXhGYWxsU3BlZWQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWc3BlZWQgPSBNYXRoLk1pbihWc3BlZWQgKyBmYWxsYWNjZWwsIG1heEZhbGxTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFZzcGVlZCA9IG1heEZhbGxTcGVlZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVnNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB5ID0gRi5HZXRIaXRib3goKS50b3AgLSBBbmkuQ3VycmVudEltYWdlLkhlaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vSHNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgIEhzcGVlZCA9IChmbG9hdClNYXRoSGVscGVyLkRlY2VsZXJhdGUoSHNwZWVkLCAwLjEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9Ic3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgLy9Wc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgSHNwZWVkID0gKGZsb2F0KU1hdGhIZWxwZXIuRGVjZWxlcmF0ZShIc3BlZWQsIDAuMSk7XHJcbiAgICAgICAgICAgICAgICBWc3BlZWQgPSAoZmxvYXQpTWF0aEhlbHBlci5EZWNlbGVyYXRlKFZzcGVlZCwgMC4xKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBiYXNlLlVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgVGlsZURhdGEgR2V0Rmxvb3IoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVGlsZURhdGEgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZsb2F0IFcgPSBXaWR0aCAvIDM7XHJcbiAgICAgICAgICAgIGZsb2F0IFkgPSBIZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgV2lkdGggLyAyLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBXLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBXaWR0aCAtIFcsIFkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVDtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWJzdHJhY3QgcHVibGljIHZvaWQgb25Db2xsZWN0ZWQoUGxheWVyQ2hhcmFjdGVyIHBsYXllcik7XHJcbiAgICAgICAgLypwdWJsaWMgdmlydHVhbCB2b2lkIG9uQ29sbGVjdGVkKFBsYXllckNoYXJhY3RlciBwbGF5ZXIpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICB9Ki9cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDb250cm9sbGFibGVFbnRpdHkgOiBFbnRpdHlcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbFtdIENvbnRyb2xsZXI7XHJcbiAgICAgICAgcHVibGljIGJvb2xbXSBMQ29udHJvbGxlcjtcclxuICAgICAgICBwdWJsaWMgQ29udHJvbGxhYmxlRW50aXR5KEdhbWUgZ2FtZSkgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDb250cm9sbGVyID0gbmV3IGJvb2xbN107XHJcbiAgICAgICAgICAgIExDb250cm9sbGVyID0gbmV3IGJvb2xbQ29udHJvbGxlci5MZW5ndGhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIHJldHVybnMgdHJ1ZSBpZiB0aGUgYnV0dG9uIHdhcyBqdXN0IHByZXNzZWQuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJidXR0b25cIj48L3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbiAgICAgICAgcHVibGljIGJvb2wgUHJlc3NlZChpbnQgYnV0dG9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIChDb250cm9sbGVyW2J1dHRvbl0gIT0gTENvbnRyb2xsZXJbYnV0dG9uXSAmJiBDb250cm9sbGVyW2J1dHRvbl0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIHJldHVybnMgdHJ1ZSBpZiBqdXN0IHJlbGVhc2VkLlxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiYnV0dG9uXCI+PC9wYXJhbT5cclxuICAgICAgICAvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG4gICAgICAgIHB1YmxpYyBib29sIFJlbGVhc2VkKGludCBidXR0b24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gKENvbnRyb2xsZXJbYnV0dG9uXSAhPSBMQ29udHJvbGxlcltidXR0b25dICYmICFDb250cm9sbGVyW2J1dHRvbl0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBFeGl0RG9vciA6IEVudGl0eVxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgaW50IHJlc2V0ID0gMDtcclxuICAgICAgICBwcml2YXRlIFRpbGVEYXRhIFJUO1xyXG4gICAgICAgIHByaXZhdGUgYm9vbCBfT3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIGJvb2wgT3BlbmVkXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9PcGVuZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9PcGVuZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChfT3BlbmVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEFuaS5DdXJyZW50RnJhbWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIEFuaS5TZXRJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEFuaS5DdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIEFuaS5TZXRJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBFeGl0RG9vcihHYW1lIGdhbWUpIDogYmFzZShnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQW5pID0gbmV3IEFuaW1hdGlvbihBbmltYXRpb25Mb2FkZXIuR2V0KFwiaW1hZ2VzL21pc2MvZG9vclwiKSk7XHJcbiAgICAgICAgICAgIEFuaS5JbWFnZVNwZWVkID0gMDtcclxuICAgICAgICAgICAgQW5pLlNldEltYWdlKCk7XHJcbiAgICAgICAgICAgIFJlbW92ZWRPbkxldmVsRW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyb3BUb0dyb3VuZCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB3aGlsZSAoR2V0Rmxvb3IoKSA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ICs9IDE2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBGID0gR2V0Rmxvb3IoKTtcclxuICAgICAgICAgICAgLy9GLkJyZWFrYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgRkIgPSBGLkdldEhpdGJveCgpO1xyXG4gICAgICAgICAgICB4ID0gRkIubGVmdDtcclxuICAgICAgICAgICAgeSA9IEZCLnRvcCAtIDMyO1xyXG4gICAgICAgICAgICB2YXIgVCA9IEdhbWUuVE0uR2V0VGlsZShGLmNvbHVtbiwgRi5yb3cgLSAxKTtcclxuICAgICAgICAgICAgaWYgKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSAtPSAxNjtcclxuICAgICAgICAgICAgICAgIEYgPSBUO1xyXG4gICAgICAgICAgICAgICAgSGVscGVyLkxvZyhcImR1ZyBkb29yIG91dCBvZiB0aGUgZ3JvdW5kXCIpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBSVCA9IEY7XHJcbiAgICAgICAgICAgIC8qRi5CcmVha2FibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgRi50ZXh0dXJlID0gMDtcclxuXHJcbiAgICAgICAgICAgIEdhbWUuVE0uUmVkcmF3VGlsZShGLmNvbHVtbiwgRi5yb3cpOyovXHJcbiAgICAgICAgICAgIHJlc2V0ID0gMDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAoIV9PcGVuZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8qdmFyIEYgPSBHZXRGbG9vcigpO1xyXG4gICAgICAgICAgICBpZiAoRiA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBWc3BlZWQgPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVnNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgIHkgPSBGLkdldEhpdGJveCgpLnRvcCAtIEFuaS5DdXJyZW50SW1hZ2UuSGVpZ2h0O1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgdmFyIFAgPSAoUGxheWVyQ2hhcmFjdGVyKUdhbWUucGxheWVyO1xyXG4gICAgICAgICAgICBpZiAoUC5Qb3NpdGlvbi5Fc3RpbWF0ZWREaXN0YW5jZShQb3NpdGlvbikgPCAyMCAmJiBQLkNvbnRyb2xsZXJbMl0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgUC5zY29yZSArPSAoR2FtZS5sZXZlbCAqIDEwKTtcclxuICAgICAgICAgICAgICAgIEdhbWUuU3RhcnROZXh0TGV2ZWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlAua2V5cy0tO1xyXG4gICAgICAgICAgICAgICAgT3BlbihQKTsqL1xyXG4gICAgICAgICAgICAgICAgLypBbmkuQ3VycmVudEZyYW1lID0gMTtcclxuICAgICAgICAgICAgICAgIEFuaS5TZXRJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgQW5pLlVwZGF0ZSgpOyovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc2V0IDwgMilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmVzZXQrKztcclxuICAgICAgICAgICAgICAgIC8vcmVzZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8vdmFyIEYgPSBHZXRGbG9vcigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIEYgPSBSVDtcclxuICAgICAgICAgICAgICAgIGlmIChGICE9IG51bGwgJiYgcmVzZXQgPT0gMilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBGLkJyZWFrYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIEYudGV4dHVyZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgR2FtZS5UTS5SZWRyYXdUaWxlKEYuY29sdW1uLCBGLnJvdyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIFRpbGVEYXRhIEdldEZsb29yKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBudWxsO1xyXG4gICAgICAgICAgICBmbG9hdCBXID0gV2lkdGggLyAzO1xyXG4gICAgICAgICAgICBmbG9hdCBZID0gSGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoVmVjdG9yMi5BZGQoUG9zaXRpb24sIFdpZHRoIC8gMiwgWSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgVywgWSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgV2lkdGggLSBXLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEZsaWdodENvbnRyb2xzIDogRW50aXR5QmVoYXZpb3JcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYWNjZWwgPSAwLjM1ZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgbWF4U3BlZWQgPSAxLjVmO1xyXG4gICAgICAgIFBsYXRmb3JtZXJFbnRpdHkgX3BsYXRmb3JtZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBGbGlnaHRDb250cm9scyhQbGF0Zm9ybWVyRW50aXR5IGVudGl0eSkgOiBiYXNlKGVudGl0eSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9wbGF0Zm9ybWVyID0gZW50aXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYm9vbFtdIGNvbnRyb2xsZXIgPSBfcGxhdGZvcm1lci5Db250cm9sbGVyO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclswXSAmJiBfcGxhdGZvcm1lci5Ic3BlZWQgPiAtbWF4U3BlZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLkhzcGVlZCA9IChmbG9hdClNYXRoLk1heChfcGxhdGZvcm1lci5Ic3BlZWQgLSAoYWNjZWwgKyBfcGxhdGZvcm1lci5mcmljdGlvbiksIC1tYXhTcGVlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJbMV0gJiYgX3BsYXRmb3JtZXIuSHNwZWVkIDwgbWF4U3BlZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLkhzcGVlZCA9IChmbG9hdClNYXRoLk1pbihfcGxhdGZvcm1lci5Ic3BlZWQgKyAoYWNjZWwgKyBfcGxhdGZvcm1lci5mcmljdGlvbiksIG1heFNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclsyXSAmJiBfcGxhdGZvcm1lci5Wc3BlZWQgPiAtbWF4U3BlZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLlZzcGVlZCA9IChmbG9hdClNYXRoLk1heChfcGxhdGZvcm1lci5Wc3BlZWQgLSAoYWNjZWwgKyBfcGxhdGZvcm1lci5mcmljdGlvbiksIC1tYXhTcGVlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJbM10gJiYgX3BsYXRmb3JtZXIuVnNwZWVkIDwgbWF4U3BlZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLlZzcGVlZCA9IChmbG9hdClNYXRoLk1pbihfcGxhdGZvcm1lci5Wc3BlZWQgKyAoYWNjZWwgKyBfcGxhdGZvcm1lci5mcmljdGlvbiksIG1heFNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKnZhciBqdW1wYnV0dG9uID0gNTtcclxuICAgICAgICAgICAgaWYgKF9wbGF0Zm9ybWVyLlZzcGVlZCA+PSAwICYmIF9wbGF0Zm9ybWVyLm9uR3JvdW5kKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3BsYXRmb3JtZXIuUHJlc3NlZChqdW1wYnV0dG9uKSAmJiBfcGxhdGZvcm1lci5vbkdyb3VuZCAmJiBfcGxhdGZvcm1lci5DZWlsaW5nID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3BsYXRmb3JtZXIuVnNwZWVkID0gLWp1bXBTcGVlZDtcclxuICAgICAgICAgICAgICAgICAgICAvLy9lbnRpdHkuUGxheVNvdW5kKFwianVtcFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChhaXJKdW1wcyA8IG1heEFpckp1bXBzICYmIF9wbGF0Zm9ybWVyLlByZXNzZWQoanVtcGJ1dHRvbikgJiYgX3BsYXRmb3JtZXIuQ2VpbGluZyA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci5Wc3BlZWQgPSAtKGp1bXBTcGVlZCAqIGFpcmp1bXBwb3dlcik7XHJcbiAgICAgICAgICAgICAgICBhaXJKdW1wcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfcGxhdGZvcm1lci5Wc3BlZWQgPCAwICYmICFjb250cm9sbGVyW2p1bXBidXR0b25dKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci5Wc3BlZWQgKz0gKF9wbGF0Zm9ybWVyLmdyYXZpdHkgKiAyKTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRmxvYXRpbmdNZXNzYWdlIDogRW50aXR5XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGludCB0aW1lID0gMzA7XHJcbiAgICAgICAgcHVibGljIFRleHRTcHJpdGUgVGV4dDtcclxuICAgICAgICBmbG9hdCBhbHBoYSA9IDE7XHJcbiAgICAgICAgcHVibGljIGJvb2wgYXV0b2tpbGwgPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyBGbG9hdGluZ01lc3NhZ2UoR2FtZSBnYW1lLCBzdHJpbmcgdGV4dCkgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBbmkgPSBuZXcgQW5pbWF0aW9uKG51bGwpO1xyXG4gICAgICAgICAgICBUZXh0ID0gbmV3IFRleHRTcHJpdGUoKTtcclxuICAgICAgICAgICAgVGV4dC5UZXh0ID0gdGV4dDtcclxuICAgICAgICAgICAgVGV4dC5UZXh0Q29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgVGV4dC5TaGFkb3dDb2xvciA9IFwiIzAwMDAwMFwiO1xyXG4gICAgICAgICAgICBUZXh0LlNoYWRvd09mZnNldCA9IG5ldyBWZWN0b3IyKDIsIDIpO1xyXG4gICAgICAgICAgICBUZXh0LlNoYWRvd0JsdXIgPSAxO1xyXG4gICAgICAgICAgICBUZXh0LkZvbnRTaXplID0gMTQ7XHJcbiAgICAgICAgICAgIHRpbWUgPSAzMCArICh0ZXh0Lkxlbmd0aCAqIDIwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ2hhbmdlVGV4dChzdHJpbmcgdGV4dCxzdHJpbmcgY29sb3I9bnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRleHQuVGV4dCA9IHRleHQ7XHJcbiAgICAgICAgICAgIHRpbWUgPSAzMCArICh0ZXh0Lkxlbmd0aCAqIDIwKTtcclxuICAgICAgICAgICAgYWxwaGEgPSAxO1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGV4dC5UZXh0Q29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKHRpbWUgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aW1lLS07XHJcbiAgICAgICAgICAgICAgICBpZiAodGltZSA8IDEgJiYgYWxwaGE+MClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0FsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxwaGEgLT0gMC4wNWY7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFscGhhIDw9IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbHBoYSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdXRva2lsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aW1lID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBEcmF3KENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9iYXNlLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIGlmIChhbHBoYSA8IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChhbHBoYSA8PSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGcuR2xvYmFsQWxwaGEgPSBhbHBoYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL1RleHQuUG9zaXRpb24uQ29weUZyb20oUG9zaXRpb24pO1xyXG4gICAgICAgICAgICBUZXh0LkZvcmNlVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIFRleHQuUG9zaXRpb24uWCA9IChpbnQpUG9zaXRpb24uWCAtIChUZXh0LnNwcml0ZUJ1ZmZlci5XaWR0aCAvIDIpO1xyXG4gICAgICAgICAgICBUZXh0LlBvc2l0aW9uLlkgPSAoaW50KVBvc2l0aW9uLlkgLSAoVGV4dC5zcHJpdGVCdWZmZXIuSGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgIFRleHQuRHJhdyhnKTtcclxuICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IDFmO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUGFydGljbGUgOiBFbnRpdHlcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50IEhQID0gMTI7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGFscGhhdGltZSA9IDAuMmY7XHJcblxyXG4gICAgICAgIHB1YmxpYyBQYXJ0aWNsZShHYW1lIGdhbWUsIEhUTUxJbWFnZUVsZW1lbnQgaW1hZ2UpIDogYmFzZShnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQW5pID0gbmV3IEFuaW1hdGlvbihuZXcgTGlzdDxIVE1MSW1hZ2VFbGVtZW50PihuZXcgSFRNTEltYWdlRWxlbWVudFtdIHsgaW1hZ2UgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgSFAtLTtcclxuICAgICAgICAgICAgaWYgKEhQIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgoQW5pLkFscGhhIC09IGFscGhhdGltZSkgPD0gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLyppZiAoYWxwaGF0aW1lID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhbHBoYSAtPSBhbHBoYXRpbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgQW5pLkFscGhhID0gYWxwaGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFscGhhIDw9IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUGxhdGZvcm1lckNvbnRyb2xzIDogRW50aXR5QmVoYXZpb3JcclxuICAgIHtcclxuICAgICAgICBQbGF0Zm9ybWVyRW50aXR5IF9wbGF0Zm9ybWVyO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBhY2NlbCA9IDAuMzVmO1xyXG4gICAgICAgIC8vcHVibGljIGZsb2F0IGp1bXBTcGVlZCA9IDE4ZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQganVtcFNwZWVkID0gMi4yNWY7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IG1heFNwZWVkID0gMS41ZjtcclxuICAgICAgICBwdWJsaWMgaW50IG1heEFpckp1bXBzID0gMTtcclxuICAgICAgICBwdWJsaWMgaW50IGFpckp1bXBzID0gMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYWlyanVtcHBvd2VyID0gMC44MTVmO1xyXG4gICAgICAgIHB1YmxpYyBQbGF0Zm9ybWVyQ29udHJvbHMoUGxhdGZvcm1lckVudGl0eSBlbnRpdHkpIDogYmFzZShlbnRpdHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfcGxhdGZvcm1lciA9IGVudGl0eTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBhZ2FpbnN0d2FsbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBib29sW10gY29udHJvbGxlciA9IF9wbGF0Zm9ybWVyLkNvbnRyb2xsZXI7XHJcbiAgICAgICAgICAgIHZhciBYID0gMDtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJbMF0gJiYgIWNvbnRyb2xsZXJbMV0gJiYgX3BsYXRmb3JtZXIuSHNwZWVkID4gLW1heFNwZWVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci5Ic3BlZWQgPSAoZmxvYXQpTWF0aC5NYXgoX3BsYXRmb3JtZXIuSHNwZWVkIC0gKGFjY2VsICsgX3BsYXRmb3JtZXIuZnJpY3Rpb24pLCAtbWF4U3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgWCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgaWYgKF9wbGF0Zm9ybWVyLlJpZ2h0V2FsbCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIGFnYWluc3R3YWxsID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclsxXSAmJiAhY29udHJvbGxlclswXSAmJiBfcGxhdGZvcm1lci5Ic3BlZWQgPCBtYXhTcGVlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX3BsYXRmb3JtZXIuSHNwZWVkID0gKGZsb2F0KU1hdGguTWluKF9wbGF0Zm9ybWVyLkhzcGVlZCArIChhY2NlbCArIF9wbGF0Zm9ybWVyLmZyaWN0aW9uKSwgbWF4U3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgWCA9IDE7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3BsYXRmb3JtZXIuTGVmdFdhbGwgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBhZ2FpbnN0d2FsbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGp1bXBidXR0b24gPSA1O1xyXG4gICAgICAgICAgICBpZiAoX3BsYXRmb3JtZXIub25Hcm91bmQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFpckp1bXBzID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoX3BsYXRmb3JtZXIuVnNwZWVkID49IDAgJiYgX3BsYXRmb3JtZXIub25Hcm91bmQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfcGxhdGZvcm1lci5QcmVzc2VkKGp1bXBidXR0b24pICYmIF9wbGF0Zm9ybWVyLm9uR3JvdW5kICYmIF9wbGF0Zm9ybWVyLkNlaWxpbmcgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci5Wc3BlZWQgPSAtanVtcFNwZWVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS5QbGF5U291bmQoXCJqdW1wXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qZWxzZSBpZiAoX3BsYXRmb3JtZXIuUHJlc3NlZChqdW1wYnV0dG9uKSAmJiBfcGxhdGZvcm1lci5DZWlsaW5nID09IG51bGwgJiYgYWdhaW5zdHdhbGwgJiYgX3BsYXRmb3JtZXIuVnNwZWVkID49IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vcGVyZm9ybSB3YWxsIGp1bXBcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLkhzcGVlZCA9IFggKiBtYXhTcGVlZDtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLlZzcGVlZCA9IC0oanVtcFNwZWVkICogKCgxICsgYWlyanVtcHBvd2VyKSAvIDJmKSk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBlbHNlIGlmIChhaXJKdW1wcyA8IG1heEFpckp1bXBzICYmIF9wbGF0Zm9ybWVyLlByZXNzZWQoanVtcGJ1dHRvbikgJiYgX3BsYXRmb3JtZXIuQ2VpbGluZyA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci5Wc3BlZWQgPSAtKGp1bXBTcGVlZCAqIGFpcmp1bXBwb3dlcik7XHJcbiAgICAgICAgICAgICAgICBhaXJKdW1wcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfcGxhdGZvcm1lci5Wc3BlZWQgPCAwICYmICFjb250cm9sbGVyW2p1bXBidXR0b25dKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci5Wc3BlZWQgKz0gKF9wbGF0Zm9ybWVyLmdyYXZpdHkgKiAyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBiYXNlLlVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUGxheWVyQnVsbGV0IDogRW50aXR5LCBJSGFybWZ1bEVudGl0eSwgSUxpZ2h0U291cmNlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEVudGl0eSBzaG9vdGVyO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgRHVyYXRpb24gPSAwO1xyXG4gICAgICAgIHByb3RlY3RlZCBMaXN0PEVudGl0eT4gaGl0RW50aXRpZXM7XHJcbiAgICAgICAgcHVibGljIGJvb2wgcGllcmNpbmc7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHNwaW5yYXRlID0gMDtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBHcmF2aXR5ID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICBwdWJsaWMgYm9vbCBCb3VuY2VzO1xyXG4gICAgICAgIHB1YmxpYyBib29sIGF0dGFja3N0ZXJyYWluID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGRpZ3Bvd2VyID0gMC41ZjtcclxuICAgICAgICBwdWJsaWMgUGxheWVyQnVsbGV0KEdhbWUgZ2FtZSwgRW50aXR5IHNob290ZXIsIHN0cmluZyBncmFwaGljID0gXCJSZWlzZW5idWxsZXRcIikgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5fdGhpcy5HZXRBbmltYXRpb24oZ3JhcGhpYykpO1xyXG4gICAgICAgICAgICB0aGlzLnNob290ZXIgPSBzaG9vdGVyO1xyXG5cclxuICAgICAgICAgICAgLy9BbmkuSHVlQ29sb3IgPSBHYW1lLkdldFRlYW1Db2xvcigoKElDb21iYXRhbnQpc2hvb3RlcikuVGVhbSk7XHJcbiAgICAgICAgICAgIC8vL0FuaS5IdWVDb2xvciA9IHNob290ZXIuR2V0VGVhbUNvbG9yKCk7XHJcbiAgICAgICAgICAgIC8vL0FuaS5IdWVSZWNvbG9yU3RyZW5ndGggPSAxO1xyXG4gICAgICAgICAgICBwaWVyY2luZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaGl0RW50aXRpZXMgPSBuZXcgTGlzdDxFbnRpdHk+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgRW50aXR5IEF0dGFja2VyXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNob290ZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIElzSGFybWZ1bFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBsaWdodEZsaWNrZXJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIGxpZ2h0UG9zaXRpb25cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBmbG9hdCBfbWF4TGlnaHRSYWRpdXMgPSAxLjVmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBtYXhMaWdodFJhZGl1c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBbmkuQWxwaGEgPj0gMSA/IF9tYXhMaWdodFJhZGl1cyA6IDBmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfbWF4TGlnaHRSYWRpdXMgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgUmVjdGFuZ2xlIEdldEhpdGJveCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoQW5pICE9IG51bGwgJiYgQW5pLkN1cnJlbnRJbWFnZSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2Zsb2F0IHMgPSBNYXRoLk1heChBbmkuQ3VycmVudEltYWdlLldpZHRoLCBBbmkuQ3VycmVudEltYWdlLkhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAvL2Zsb2F0IHMgPSBBbmkuQ3VycmVudEltYWdlLkhlaWdodDtcclxuICAgICAgICAgICAgICAgIGZsb2F0IHMgPSBBbmkuQ3VycmVudEltYWdlLkhlaWdodCAqIDEuNWY7XHJcbiAgICAgICAgICAgICAgICAvL2Zsb2F0IHMyID0gcyAvIDJmO1xyXG4gICAgICAgICAgICAgICAgLy9WZWN0b3IyIFYgPSBBbmkuUG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBzbzIgPSBzIC8gMjtcclxuICAgICAgICAgICAgICAgIC8vVmVjdG9yMiBWID0gZ2V0Q2VudGVyKCkgLSBuZXcgVmVjdG9yMihzbzIsc28yKTtcclxuICAgICAgICAgICAgICAgIFZlY3RvcjIgViA9IFZlY3RvcjIuU3VidHJhY3QoZ2V0Q2VudGVyKCksIHNvMiwgc28yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKFYuWCwgVi5ZLCBzLCBzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBmbG9hdCBfdG91Y2hEYW1hZ2UgPSAxZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgdG91Y2hEYW1hZ2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RvdWNoRGFtYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfdG91Y2hEYW1hZ2UgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgb250b3VjaERhbWFnZShJQ29tYmF0YW50IHRhcmdldClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGllcmNpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJvb2wgb2sgPSAhaGl0RW50aXRpZXMuQ29udGFpbnMoKEVudGl0eSl0YXJnZXQpO1xyXG4gICAgICAgICAgICBpZiAob2spXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGhpdEVudGl0aWVzLkFkZCgoRW50aXR5KXRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKHNwaW5yYXRlICE9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFuaS5Sb3RhdGlvbiArPSBzcGlucmF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoR3Jhdml0eS5Sb3VnaExlbmd0aCAhPSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTcGVlZCArPSBHcmF2aXR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vaWYgKCFBcHAuc2NyZWVuYm91bmRzLmlzVG91Y2hpbmcoR2V0SGl0Ym94KCkpKVxyXG5cclxuICAgICAgICAgICAgLy9pZiAoIUdhbWUuc3RhZ2VCb3VuZHMuaXNUb3VjaGluZyhHZXRIaXRib3goKSkpXHJcbiAgICAgICAgICAgIGlmICghR2FtZS5zdGFnZUJvdW5kcy5jb250YWluc1BvaW50KFBvc2l0aW9uKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKChBbmkuWCA+IDAgPT0gSHNwZWVkID4gMCB8fCBBbmkuWCA8IDAgPT0gSHNwZWVkIDwgMCkgfHwgKEFuaS5ZID4gMCA9PSBWc3BlZWQgPiAwIHx8IEFuaS5ZIDwgMCA9PSBWc3BlZWQgPCAwKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vVmVjdG9yMiBjZW50ZXIgPSBnZXRDZW50ZXIoKTtcclxuICAgICAgICAgICAgVmVjdG9yMiBjZW50ZXIgPSBWZWN0b3IyLkFkZChQb3NpdGlvbiwgOCwgMCk7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoIUJvdW5jZXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShuZXcgVmVjdG9yMihjZW50ZXIuWCwgeSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQuc29saWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdHRhY2tzdGVycmFpbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoVC5CcmVha2FibGUpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1QuRGFtYWdlKF90b3VjaERhbWFnZSAqIGRpZ3Bvd2VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFQuRGFtYWdlKGRpZ3Bvd2VyKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBsYXlTb3VuZChcInRodW5rNFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUGxheVNvdW5kKFwidGh1bmtcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGxheVNvdW5kKFwicGxpbmtcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBBbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKEJvdW5jZXMpXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoY2VudGVyICsgbmV3IFZlY3RvcjIoU3BlZWQuWCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC5zb2xpZFRvU3BlZWQoU3BlZWQuVG9DYXJkaW5hbCgpKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBTcGVlZC5YID0gLVNwZWVkLlg7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKGNlbnRlciArIG5ldyBWZWN0b3IyKDAsIFNwZWVkLlkpKTtcclxuICAgICAgICAgICAgICAgIGlmIChUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQuc29saWRUb1NwZWVkKFNwZWVkLlRvQ2FyZGluYWwoKSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgU3BlZWQuWSA9IC1TcGVlZC5ZO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShjZW50ZXIgKyBTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnNvbGlkVG9TcGVlZChTcGVlZC5Ub0NhcmRpbmFsKCkpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFNwZWVkLlggPSAtU3BlZWQuWDtcclxuICAgICAgICAgICAgICAgICAgICBTcGVlZC5ZID0gLVNwZWVkLlk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKER1cmF0aW9uID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRHVyYXRpb24tLTtcclxuICAgICAgICAgICAgICAgIGlmIChEdXJhdGlvbiA8PSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIER1cmF0aW9uID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBBbmkuQWxwaGEgLT0gMC4yZjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQW5pLkFscGhhIDw9IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBSYW5kb21BSSA6IEVudGl0eUJlaGF2aW9yXHJcbiAgICB7XHJcbiAgICAgICAgQ29udHJvbGxhYmxlRW50aXR5IENFO1xyXG4gICAgICAgIHB1YmxpYyBSYW5kb21BSShDb250cm9sbGFibGVFbnRpdHkgZW50aXR5KSA6IGJhc2UoZW50aXR5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ0UgPSBlbnRpdHk7XHJcbiAgICAgICAgICAgIHRoaXMuRnJhbWVzUGVyVGljayA9IDE1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKE1hdGguUmFuZG9tKCkgPCAwLjEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBDb250cm9sbGVyID0gQ0UuQ29udHJvbGxlcjtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xsZXJbMF0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xsZXJbMV0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xsZXJbMl0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xsZXJbM10gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5SYW5kb20oKSA8IDAuNSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDb250cm9sbGVyWzBdID0gTWF0aC5SYW5kb20oKSA8IDAuNTtcclxuICAgICAgICAgICAgICAgICAgICBDb250cm9sbGVyWzFdID0gIUNvbnRyb2xsZXJbMF07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguUmFuZG9tKCkgPCAwLjUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29udHJvbGxlclsyXSA9IE1hdGguUmFuZG9tKCkgPCAwLjU7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29udHJvbGxlclszXSA9ICFDb250cm9sbGVyWzJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFJvb21PcGVuaW5nTGV2ZXIgOiBFbnRpdHlcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFJvb21PcGVuaW5nTGV2ZXIgVEVTVDtcclxuICAgICAgICBwdWJsaWMgUm9vbU9wZW5pbmdMZXZlcihHYW1lIGdhbWUsIFBvaW50IFRpbGUsIE1hcFJvb20gVGFyZ2V0LCBib29sIGZsaXBwZWQ9ZmFsc2UpIDogYmFzZShnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQW5pID0gbmV3IEFuaW1hdGlvbihBbmltYXRpb25Mb2FkZXIuX3RoaXMuR2V0QW5pbWF0aW9uKFwiaW1hZ2VzL21pc2MvbGV2ZXJcIikpO1xyXG4gICAgICAgICAgICBBbmkuSW1hZ2VTcGVlZCA9IDA7XHJcbiAgICAgICAgICAgIEJsb2NrID0gVGlsZTtcclxuICAgICAgICAgICAgdmFyIFQgPSBnYW1lLlRNLkdldFRpbGUoVGlsZS5YLCBUaWxlLlkpO1xyXG4gICAgICAgICAgICBURVNUID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKFQgIT0gbnVsbCAmJiBULnNvbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVGFyZ2V0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb29tID0gVGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgVC5CcmVha2FibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFQuQ2FuU2xvcGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHZhciBSID0gVC5HZXRIaXRib3goKTtcclxuICAgICAgICAgICAgICAgIGlmIChmbGlwcGVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEFuaS5Qb3NpdGlvbi5YID0gUi5sZWZ0IC0gMTY7XHJcbiAgICAgICAgICAgICAgICAgICAgQW5pLkZsaXBwZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEFuaS5Qb3NpdGlvbi5YID0gUi5yaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEFuaS5Qb3NpdGlvbi5ZID0gUi50b3A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBNYXBSb29tIFJvb207XHJcbiAgICAgICAgcHVibGljIFBvaW50IEJsb2NrO1xyXG4gICAgICAgIHB1YmxpYyBib29sIEFjdGl2YXRlZCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgdmFyIFQgPSBHYW1lLlRNLkdldFRpbGUoQmxvY2suWCwgQmxvY2suWCk7XHJcbiAgICAgICAgICAgIGlmIChUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQuc29saWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQuQnJlYWthYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBULkNhblNsb3BlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKFJvb20gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBSb29tLkNsZWFyUm9vbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFJvb20uR2VuZXJhdGVQbGF0Zm9ybXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBSb29tLkFwcGx5QnJlYWthYmxlKCk7Ly9hdHRlbXB0IHRvIHJlbW92ZSBzZWFtc1xyXG4gICAgICAgICAgICAgICAgICAgIFJvb20uRm9yY2VSZWRyYXcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vSGVscGVyLkxvZyhcIlJlbW92aW5nIGJyb2tlbiBsZXZlci4uLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgUCA9IChQbGF5ZXJDaGFyYWN0ZXIpR2FtZS5wbGF5ZXI7XHJcbiAgICAgICAgICAgIGlmICghQWN0aXZhdGVkICYmIFAuUG9zaXRpb24uRXN0aW1hdGVkRGlzdGFuY2UoUG9zaXRpb24pIDwgMTYgJiYgUC5Db250cm9sbGVyWzJdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFjdGl2YXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghQWN0aXZhdGVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBY3RpdmF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgUGxheVNvdW5kKFwib3BlbjJcIik7Ly9zb3VuZHMgYmV0dGVyIHRoYW4gdGhlIGVsZWN0cm9uaWMgc3dpdGNoLlxyXG4gICAgICAgICAgICAgICAgQW5pLkN1cnJlbnRGcmFtZSA9IDE7XHJcbiAgICAgICAgICAgICAgICBBbmkuU2V0SW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIEFuaS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIFJvb20uVW5sZWFzaFNlY3JldCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgUm9vbU9wZW5pbmdMZXZlciBGaW5kQW5kUGxhY2VPbldhbGwoR2FtZSBnYW1lLFZlY3RvcjIgUCwgTWFwUm9vbSBUYXJnZXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgVCA9IGdhbWUuVE0uQ2hlY2tGb3JUaWxlKFApO1xyXG4gICAgICAgICAgICBpZiAoVCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgWCA9IFQuY29sdW1uO1xyXG4gICAgICAgICAgICAgICAgdmFyIFkgPSBULnJvdztcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgWEQgPSBNYXRoLlJhbmRvbSgpIDwgMC41ID8gLTEgOiAxO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgWCArPSBYRDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgVDIgPSBnYW1lLlRNLkdldFRpbGUoWCwgWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFQyICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVDIuZW5hYmxlZCAmJiBUMi5zb2xpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFQzID0gZ2FtZS5UTS5HZXRUaWxlKFgtWEQsIFkrMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShUMyAhPSBudWxsICYmIFQzLmVuYWJsZWQgJiYgVDMuc29saWQpKS8vdG9vIGNsb3NlIHRvIHRoZSBmbG9vciwgdGhlIGxldmVyIGNvdWxkIGJlY29tZSBvYnNjdXJlZC4uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSBuZXcgUm9vbU9wZW5pbmdMZXZlcihnYW1lLCBuZXcgUG9pbnQoWCwgWSksIFRhcmdldCwgWEQgPT0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldC5BbGl2ZSA/IHJldCA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVGV4dFNwcml0ZSA6IFNwcml0ZVxyXG4gICAge1xyXG4gICAgICAgIHByb3RlY3RlZCBzdHJpbmcgX1RleHQ7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBUZXh0XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9UZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX1RleHQgIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX1RleHQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAvKlJlZHJhd0Jhc2VUZXh0SW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBSZW5kZXJUZXh0SW1hZ2UoKTsqL1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRJbnZhbGxpZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vaW1hZ2VJbnZhbGxpZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBib29sIHRleHRJbnZhbGxpZGF0ZWQ7XHJcbiAgICAgICAgcHJvdGVjdGVkIGJvb2wgaW1hZ2VJbnZhbGxpZGF0ZWQ7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBIVE1MQ2FudmFzRWxlbWVudCBUZXh0SW1hZ2U7XHJcbiAgICAgICAgcHJvdGVjdGVkIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBUZXh0R3JhcGhpYztcclxuICAgICAgICBwcm90ZWN0ZWQgc3RyaW5nIF9UZXh0Q29sb3I7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBUZXh0Q29sb3JcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX1RleHRDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9UZXh0Q29sb3IgIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX1RleHRDb2xvciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vUmVuZGVyVGV4dEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dEludmFsbGlkYXRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vaW1hZ2VJbnZhbGxpZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgc3RyaW5nIF9Gb250V2VpZ2h0ID0gXCJub3JtYWxcIjtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIEZvbnRXZWlnaHRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX0ZvbnRXZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfRm9udFdlaWdodCAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfRm9udFdlaWdodCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIFVwZGF0ZUZvbnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIHN0cmluZyBfRm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgRm9udEZhbWlseVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfRm9udEZhbWlseTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9Gb250RmFtaWx5ICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9Gb250RmFtaWx5ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgVXBkYXRlRm9udCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgaW50IF9Gb250U2l6ZSA9IDEwO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgRm9udFNpemVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX0ZvbnRTaXplO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX0ZvbnRTaXplICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9Gb250U2l6ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIFVwZGF0ZUZvbnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIGZsb2F0IF9zaGFkb3dCbHVyID0gMGY7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFNoYWRvd0JsdXJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3NoYWRvd0JsdXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfc2hhZG93Qmx1ciAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfc2hhZG93Qmx1ciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlSW52YWxsaWRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgVmVjdG9yMiBfc2hhZG93T2Zmc2V0ID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBTaGFkb3dPZmZzZXRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3NoYWRvd09mZnNldC5DbG9uZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3NoYWRvd09mZnNldCAhPSB2YWx1ZSAmJiB2YWx1ZS5YICE9IF9zaGFkb3dPZmZzZXQuWCAmJiB2YWx1ZS5ZICE9IF9zaGFkb3dPZmZzZXQuWSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfc2hhZG93T2Zmc2V0ID0gdmFsdWUuQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZUludmFsbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0cmluZyBfc2hhZG93Q29sb3IgPSBcIiMwMDAwMDBcIjtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIFNoYWRvd0NvbG9yXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zaGFkb3dDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9zaGFkb3dDb2xvciAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfc2hhZG93Q29sb3IgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZUludmFsbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCB2b2lkIFVwZGF0ZUZvbnQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVGV4dEdyYXBoaWMuRm9udCA9IF9Gb250V2VpZ2h0ICsgXCIgXCIgKyBfRm9udFNpemUgKyBcInB4IFwiICsgX0ZvbnRGYW1pbHk7XHJcbiAgICAgICAgICAgIHRleHRJbnZhbGxpZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpbWFnZUludmFsbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIFRleHRHcmFwaGljLkZpbGxTdHlsZSA9IF9UZXh0Q29sb3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKnByb3RlY3RlZCBzdHJpbmcgRm9udFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBUZXh0R3JhcGhpYy5Gb250O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVGV4dEdyYXBoaWMuRm9udCAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUZXh0R3JhcGhpYy5Gb250ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dEludmFsbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VJbnZhbGxpZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9Ki9cclxuICAgICAgICBwdWJsaWMgVGV4dFNwcml0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBUZXh0SW1hZ2UgPSBuZXcgSFRNTENhbnZhc0VsZW1lbnQoKTtcclxuICAgICAgICAgICAgVGV4dEdyYXBoaWMgPSBUZXh0SW1hZ2UuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIFRleHRHcmFwaGljLkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAvL1RleHRHcmFwaGljLkZvbnQuXHJcbiAgICAgICAgICAgIFRleHRJbWFnZS5TdHlsZS5JbWFnZVJlbmRlcmluZyA9IEltYWdlUmVuZGVyaW5nLlBpeGVsYXRlZDtcclxuICAgICAgICAgICAgVGV4dEdyYXBoaWMuRmlsbFN0eWxlID0gXCIjRkZGRkZGXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2b2lkIFJlZHJhd0Jhc2VUZXh0SW1hZ2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVXBkYXRlRm9udCgpO1xyXG4gICAgICAgICAgICBzdHJpbmdbXSBsaW5lcyA9IF9UZXh0LlNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgZmxvYXQgSCA9IEZvbnRTaXplICogMWY7XHJcblxyXG5cclxuICAgICAgICAgICAgaW50IFcgPSAwO1xyXG4gICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbGluZXMuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUZXh0TWV0cmljcyBUTSA9IFRleHRHcmFwaGljLk1lYXN1cmVUZXh0KGxpbmVzW2ldKTtcclxuICAgICAgICAgICAgICAgIFcgPSBNYXRoLk1heChXLCAoaW50KU1hdGguQ2VpbGluZyhUTS5XaWR0aCkpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vVGV4dEltYWdlLkhlaWdodCA9IChpbnQpKEggKiAobGluZXMuTGVuZ3RoKzAuNWYpKTtcclxuICAgICAgICAgICAgVGV4dEltYWdlLkhlaWdodCA9IChpbnQpKEggKiAobGluZXMuTGVuZ3RoICsgMC4yNWYpKTtcclxuICAgICAgICAgICAgVGV4dEltYWdlLldpZHRoID0gVztcclxuICAgICAgICAgICAgVXBkYXRlRm9udCgpO1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgWSA9IDA7XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGxpbmVzLkxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGV4dEdyYXBoaWMuRmlsbFRleHQobGluZXNbaV0sIDAsIChpbnQpKEZvbnRTaXplICsgWSkpO1xyXG4gICAgICAgICAgICAgICAgWSArPSBIO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0ZXh0SW52YWxsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGltYWdlSW52YWxsaWRhdGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgUmVuZGVyVGV4dEltYWdlKClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICBpZiAoX3NoYWRvd0JsdXIgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlQnVmZmVyLldpZHRoID0gVGV4dEltYWdlLldpZHRoO1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlQnVmZmVyLkhlaWdodCA9IFRleHRJbWFnZS5IZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgUyA9IChpbnQpTWF0aC5DZWlsaW5nKF9zaGFkb3dCbHVyICsgX3NoYWRvd0JsdXIpO1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlQnVmZmVyLldpZHRoID0gVGV4dEltYWdlLldpZHRoICsgUztcclxuICAgICAgICAgICAgICAgIHNwcml0ZUJ1ZmZlci5IZWlnaHQgPSBUZXh0SW1hZ2UuSGVpZ2h0ICsgUztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcHJpdGVHcmFwaGljcy5TaGFkb3dCbHVyID0gMDtcclxuXHJcbiAgICAgICAgICAgIHNwcml0ZUdyYXBoaWNzLkdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IENhbnZhc1R5cGVzLkNhbnZhc0NvbXBvc2l0ZU9wZXJhdGlvblR5cGUuU291cmNlT3ZlcjtcclxuICAgICAgICAgICAgLypzcHJpdGVHcmFwaGljcy5GaWxsU3R5bGUgPSBfVGV4dENvbG9yO1xyXG4gICAgICAgICAgICBzcHJpdGVHcmFwaGljcy5GaWxsUmVjdCgwLCAwLCBzcHJpdGVCdWZmZXIuV2lkdGgsIHNwcml0ZUJ1ZmZlci5IZWlnaHQpO1xyXG4gICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJ0aGlzLnNwcml0ZUdyYXBoaWNzLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1pbidcIik7Ki9cclxuICAgICAgICAgICAgaWYgKF9zaGFkb3dCbHVyIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNwcml0ZUdyYXBoaWNzLkRyYXdJbWFnZShUZXh0SW1hZ2UsIDBmLCAwZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVHcmFwaGljcy5EcmF3SW1hZ2UoVGV4dEltYWdlLCBfc2hhZG93Qmx1ciwgX3NoYWRvd0JsdXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoX3NoYWRvd0JsdXIgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLy9zcHJpdGVHcmFwaGljcy5HbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBDYW52YXNUeXBlcy5DYW52YXNDb21wb3NpdGVPcGVyYXRpb25UeXBlLlNvdXJjZU92ZXI7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVHcmFwaGljcy5TaGFkb3dCbHVyID0gX3NoYWRvd0JsdXI7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVHcmFwaGljcy5TaGFkb3dDb2xvciA9IF9zaGFkb3dDb2xvcjtcclxuICAgICAgICAgICAgICAgIHNwcml0ZUdyYXBoaWNzLlNoYWRvd09mZnNldFggPSBfc2hhZG93T2Zmc2V0Llg7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVHcmFwaGljcy5TaGFkb3dPZmZzZXRZID0gX3NoYWRvd09mZnNldC5ZO1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlR3JhcGhpY3MuRHJhd0ltYWdlKHNwcml0ZUJ1ZmZlciwgMGYsIDBmKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBpbWFnZUludmFsbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBGb3JjZVVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGV4dEludmFsbGlkYXRlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVkcmF3QmFzZVRleHRJbWFnZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbWFnZUludmFsbGlkYXRlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVuZGVyVGV4dEltYWdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgRHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEZvcmNlVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGJhc2UuRHJhdyhnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVGlsZSA6IEVudGl0eVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBpbnQgdGlsZTtcclxuICAgICAgICBwdWJsaWMgVGlsZShHYW1lIGdhbWUsIGludCB0aWxlKSA6IGJhc2UoZ2FtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMudGlsZSA9IHRpbGU7XHJcbiAgICAgICAgICAgIEFuaSA9IG5ldyBBbmltYXRpb24oQW5pbWF0aW9uTG9hZGVyLkdldChcImltYWdlcy9sYW5kL2JyaWNrXCIpKTtcclxuICAgICAgICAgICAgQW5pLkN1cnJlbnRGcmFtZSA9IHRpbGU7XHJcbiAgICAgICAgICAgIEFuaS5JbWFnZVNwZWVkID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgRHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8qaWYgKHRpbGU+PTAgJiYgdGlsZSA8IGFuaS5pbWFnZXMuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFuaS5jdXJyZW50RnJhbWUgPSB0aWxlO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgYmFzZS5EcmF3KGcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVGl0bGVTY3JlZW4gOiBTcHJpdGVcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVGV4dFNwcml0ZSBUaXRsZTtcclxuXHJcbiAgICAgICAgcHVibGljIFRleHRTcHJpdGUgVmVyc2lvbjtcclxuXHJcbiAgICAgICAgcHVibGljIFRleHRTcHJpdGUgRGVzYztcclxuXHJcbiAgICAgICAgcHVibGljIFRleHRTcHJpdGUgQ29udHJvbHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBUZXh0U3ByaXRlIENyZWRpdHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBCdXR0b25NZW51IG1lbnU7XHJcbiAgICAgICAgQnV0dG9uU3ByaXRlIENvbnRyb2xsZXI7XHJcbiAgICAgICAgcHVibGljIEdhbWUgZ2FtZTtcclxuICAgICAgICBwdWJsaWMgVGl0bGVTY3JlZW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3ByaXRlQnVmZmVyLldpZHRoID0gQXBwLkNhbnZhcy5XaWR0aDtcclxuICAgICAgICAgICAgc3ByaXRlQnVmZmVyLkhlaWdodCA9IChpbnQpKHNwcml0ZUJ1ZmZlci5XaWR0aCAqIEFwcC5UYXJnZXRBc3BlY3QpO1xyXG4gICAgICAgICAgICBUaXRsZSA9IG5ldyBUZXh0U3ByaXRlKCk7XHJcbiAgICAgICAgICAgIFRpdGxlLkZvbnRTaXplID0gKGludCkoc3ByaXRlQnVmZmVyLldpZHRoICogMC4wNmYpO1xyXG4gICAgICAgICAgICAvL1RpdGxlLlRleHQgPSBcIkNpcm5vIGFuZCB0aGUgbXlzdGVyaW91cyB0b3dlclwiO1xyXG4gICAgICAgICAgICBUaXRsZS5UZXh0ID0gQXBwLkdhbWVOYW1lO1xyXG4gICAgICAgICAgICBUaXRsZS5UZXh0Q29sb3IgPSBcIiM3N0ZGRkZcIjtcclxuICAgICAgICAgICAgVGl0bGUuU2hhZG93Q29sb3IgPSBcIiMwMDAwMDBcIjtcclxuICAgICAgICAgICAgVGl0bGUuU2hhZG93T2Zmc2V0ID0gbmV3IFZlY3RvcjIoMiwgMik7XHJcbiAgICAgICAgICAgIFRpdGxlLlNoYWRvd0JsdXIgPSAyO1xyXG5cclxuICAgICAgICAgICAgQ2VudGVyVGV4dFdpdGhGbG9hdHMoVGl0bGUsIDAuNWYsIDAuMDZmKTtcclxuXHJcbiAgICAgICAgICAgIFZlcnNpb24gPSBuZXcgVGV4dFNwcml0ZSgpO1xyXG4gICAgICAgICAgICBWZXJzaW9uLkZvbnRTaXplID0gKGludCkoc3ByaXRlQnVmZmVyLldpZHRoICogMC4wMTZmKTtcclxuICAgICAgICAgICAgVmVyc2lvbi5UZXh0ID0gXCJWZXJzaW9uOlwiICsgQXBwLkdhbWVWZXJzaW9uO1xyXG4gICAgICAgICAgICBWZXJzaW9uLlRleHRDb2xvciA9IFwiI0ZGRkZGRlwiO1xyXG4gICAgICAgICAgICBWZXJzaW9uLlNoYWRvd0NvbG9yID0gXCIjMDAwMDAwXCI7XHJcbiAgICAgICAgICAgIFZlcnNpb24uU2hhZG93T2Zmc2V0ID0gbmV3IFZlY3RvcjIoMiwgMik7XHJcbiAgICAgICAgICAgIFZlcnNpb24uU2hhZG93Qmx1ciA9IDI7XHJcblxyXG4gICAgICAgICAgICBDZW50ZXJUZXh0V2l0aEZsb2F0cyhWZXJzaW9uLCAwLjc1ZiwgMC4xMWYpO1xyXG5cclxuICAgICAgICAgICAgLypUaXRsZS5Gb3JjZVVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBUaXRsZS5Qb3NpdGlvbi5ZID0gc3ByaXRlQnVmZmVyLkhlaWdodCAqIDAuMDFmO1xyXG4gICAgICAgICAgICBUaXRsZS5Qb3NpdGlvbi5YID0gKHNwcml0ZUJ1ZmZlci5XaWR0aCAvIDIpIC0gKFRpdGxlLnNwcml0ZUJ1ZmZlci5XaWR0aCAvIDIpOyovXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIERlc2MgPSBuZXcgVGV4dFNwcml0ZSgpO1xyXG4gICAgICAgICAgICBEZXNjLkZvbnRTaXplID0gKGludCkoc3ByaXRlQnVmZmVyLldpZHRoICogMC4wMzBmKTtcclxuICAgICAgICAgICAgRGVzYy5UZXh0Q29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgLy9EZXNjLlRleHQgPSBcIkNpcm5vIGhhcyBmb3VuZCBoZXJzZWxmIGluIGEgc3RyYW5nZSBkdW5nZW9uIGZpbGxlZCB3aXRoIGdob3N0cyFcXG5IZXIgZW5lcmd5IGhhcyBiZWVuIHN0b2xlbiwgcmVjbGFpbSB0aGUgZW5lcmd5IG9yYnMgdG8gZXh0ZW5kIHlvdXIgdGltZS5cXG5GaW5kIHRoZSBiaWcga2V5IHRvIHVubG9jayB0aGUgZG9vci5cIjtcclxuICAgICAgICAgICAgLy9EZXNjLlRleHQgPSBcIkNpcm5vIGhhcyBmb3VuZCBoZXJzZWxmIGluIGEgc3RyYW5nZSBkdW5nZW9uIGZpbGxlZCB3aXRoIGdob3N0cyFcXG5SZWNsYWltIHlvdXIgc3RvbGVuIGVuZXJneSBzZWFsZWQgaW5zaWRlIHRoZSBvcmJzIHRvIGV4dGVuZCB5b3VyIHRpbWUuXFxuRmluZCB0aGUgZ29sZCBrZXkgdG8gdW5sb2NrIHRoZSBkb29yLlwiO1xyXG4gICAgICAgICAgICBEZXNjLlRleHQgPSBcIkNpcm5vIGhhcyBmb3VuZCBoZXJzZWxmIGluIGEgc3RyYW5nZSB0b3dlciBmaWxsZWQgd2l0aCBnaG9zdHMhXFxuUmVjbGFpbSB5b3VyIHN0b2xlbiBlbmVyZ3kgc2VhbGVkIGluc2lkZSB0aGUgb3JicyB0byBleHRlbmQgeW91ciB0aW1lLlxcblJlbWVtYmVyIHRoZSBkb29yJ3MgbG9jYXRpb24gYW5kIHNlYXJjaCBmb3IgdGhlIGdvbGQga2V5LlwiO1xyXG4gICAgICAgICAgICBEZXNjLlNoYWRvd0NvbG9yID0gXCIjMDAwMDAwXCI7XHJcbiAgICAgICAgICAgIERlc2MuU2hhZG93T2Zmc2V0ID0gbmV3IFZlY3RvcjIoMiwgMik7XHJcbiAgICAgICAgICAgIERlc2MuU2hhZG93Qmx1ciA9IDI7XHJcbiAgICAgICAgICAgIENlbnRlclRleHRXaXRoRmxvYXRzKERlc2MsIDAuNWYsIDAuMmYpO1xyXG5cclxuICAgICAgICAgICAgQ29udHJvbHMgPSBuZXcgVGV4dFNwcml0ZSgpO1xyXG4gICAgICAgICAgICBDb250cm9scy5Gb250U2l6ZSA9IChpbnQpKHNwcml0ZUJ1ZmZlci5XaWR0aCAqIDAuMDI1Zik7XHJcbiAgICAgICAgICAgIENvbnRyb2xzLlRleHRDb2xvciA9IFwiI0ZGRkZGRlwiO1xyXG4gICAgICAgICAgICBDb250cm9scy5UZXh0ID0gXCJLZXlib2FyZCBDb250cm9sczpcXG5MZWZ0L1JpZ2h0PU1vdmVcXG5VcC9Eb3duPUFpbShVcCBhY3RpdmF0ZXMgY2hlc3RzL2Rvb3JzKVxcblo9U2hvb3RcXG5YPUp1bXAvTWlkLWFpciBqdW1wXFxuQT1QbGFjZSBibG9jayBiZWxvdyB5b3UoY29zdHMgdGltZSlcXG5FbnRlcj1QYXVzZVxcbk09VG9nZ2xlIG11dGVcIjtcclxuICAgICAgICAgICAgQ29udHJvbHMuU2hhZG93Q29sb3IgPSBcIiMwMDAwMDBcIjtcclxuICAgICAgICAgICAgQ29udHJvbHMuU2hhZG93T2Zmc2V0ID0gbmV3IFZlY3RvcjIoMiwgMik7XHJcbiAgICAgICAgICAgIENvbnRyb2xzLlNoYWRvd0JsdXIgPSAyO1xyXG4gICAgICAgICAgICBDZW50ZXJUZXh0V2l0aEZsb2F0cyhDb250cm9scywgMC41ZiwgMC40Zik7XHJcbiAgICAgICAgICAgIENvbnRyb2xzLlBvc2l0aW9uLlggPSBEZXNjLlBvc2l0aW9uLlg7XHJcblxyXG4gICAgICAgICAgICBtZW51ID0gbmV3IEJ1dHRvbk1lbnUoc3ByaXRlQnVmZmVyLldpZHRoICogMC44Ziwgc3ByaXRlQnVmZmVyLkhlaWdodCAqIDAuNWYsIChpbnQpKHNwcml0ZUJ1ZmZlci5XaWR0aCAqIDAuMDVmKSk7XHJcbiAgICAgICAgICAgIHZhciBCID0gbWVudS5BZGRCdXR0b24oXCJTdGFydCBHYW1lXCIpO1xyXG4gICAgICAgICAgICBCLk9uQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLlN0YXJ0KCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vbWVudS5GaW5pc2goKTtcclxuICAgICAgICAgICAgQi5Qb3NpdGlvbi5YICs9IHNwcml0ZUJ1ZmZlci5XaWR0aCAqIDAuMzhmO1xyXG4gICAgICAgICAgICBCLlBvc2l0aW9uLlkgPSBzcHJpdGVCdWZmZXIuSGVpZ2h0ICogMC43ZjtcclxuXHJcbiAgICAgICAgICAgIC8vdmFyIENCID0gbWVudS5BZGRCdXR0b24oXCJDb250cm9sbGVyOlwiK0lucHV0Q29udHJvbGxlck1hbmFnZXIuX3RoaXMuQ29udHJvbGxlcnNbMF0uaWQpO1xyXG4gICAgICAgICAgICB2YXIgQ0IgPSBtZW51LkFkZEJ1dHRvbihcIkNvbnRyb2xsZXI6XCIgKyBBcHAuSUMuaWQpO1xyXG4gICAgICAgICAgICBDb250cm9sbGVyID0gQ0I7XHJcbiAgICAgICAgICAgIENCLk9uQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kID0gSW5wdXRDb250cm9sbGVyTWFuYWdlci5fdGhpcy5Db250cm9sbGVycy5JbmRleE9mKEFwcC5JQyk7XHJcbiAgICAgICAgICAgICAgICBpbmQrKztcclxuICAgICAgICAgICAgICAgIGlmIChpbmQ+PSBJbnB1dENvbnRyb2xsZXJNYW5hZ2VyLl90aGlzLkNvbnRyb2xsZXJzLkNvdW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZCAtPSBJbnB1dENvbnRyb2xsZXJNYW5hZ2VyLl90aGlzLkNvbnRyb2xsZXJzLkNvdW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQXBwLklDID0gSW5wdXRDb250cm9sbGVyTWFuYWdlci5fdGhpcy5Db250cm9sbGVyc1tpbmRdO1xyXG4gICAgICAgICAgICAgICAgdmFyIFRTID0gQ0IuQ29udGVudHMuQXM8VGV4dFNwcml0ZT4oKTtcclxuICAgICAgICAgICAgICAgIHZhciBXID0gVFMuc3ByaXRlQnVmZmVyLldpZHRoO1xyXG4gICAgICAgICAgICAgICAgVFMuVGV4dCA9IFwiQ29udHJvbGxlcjpcIiArIEFwcC5JQy5pZDtcclxuICAgICAgICAgICAgICAgIFRTLkZvcmNlVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBDQi5Qb3NpdGlvbi5YIC09ICgoVFMuc3ByaXRlQnVmZmVyLldpZHRoIC0gVykgLyAyKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ0IuUG9zaXRpb24uWCArPSBzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjM4ZjsgO1xyXG4gICAgICAgICAgICBDQi5Qb3NpdGlvbi5ZID0gQi5Qb3NpdGlvbi5ZICsgKHNwcml0ZUJ1ZmZlci5IZWlnaHQgKiAwLjE1Zik7XHJcbiAgICAgICAgICAgIC8vQ0IuVmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBDQi5Mb2NrKCk7XHJcblxyXG4gICAgICAgICAgICBDcmVkaXRzID0gbmV3IFRleHRTcHJpdGUoKTtcclxuICAgICAgICAgICAgQ3JlZGl0cy5Gb250U2l6ZSA9IChpbnQpKHNwcml0ZUJ1ZmZlci5XaWR0aCAqIDAuMDE1Zik7XHJcbiAgICAgICAgICAgIENyZWRpdHMuVGV4dENvbG9yID0gXCIjNzdGRkZGXCI7XHJcbiAgICAgICAgICAgIC8vQ3JlZGl0cy5UZXh0ID0gXCJNYWRlIGJ5OlJTR21ha2VyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG91aG91IFByb2plY3QgYW5kIGl0J3MgY2hhcmFjdGVycyBhcmUgb3duZWQgYnkgWlVOXCI7XHJcbiAgICAgICAgICAgIENyZWRpdHMuVGV4dCA9IFwiTWFkZSBieTpSU0dtYWtlciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG91aG91IFByb2plY3QgYW5kIGl0J3MgY2hhcmFjdGVycyBhcmUgb3duZWQgYnkgWlVOXCI7XHJcbiAgICAgICAgICAgIENyZWRpdHMuU2hhZG93Q29sb3IgPSBcIiMwMDAwMDBcIjtcclxuICAgICAgICAgICAgQ3JlZGl0cy5TaGFkb3dPZmZzZXQgPSBuZXcgVmVjdG9yMigyLCAyKTtcclxuICAgICAgICAgICAgQ3JlZGl0cy5TaGFkb3dCbHVyID0gMjtcclxuICAgICAgICAgICAgQ2VudGVyVGV4dFdpdGhGbG9hdHMoQ3JlZGl0cywgMC41ZiwgMC45OGYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDZW50ZXJUZXh0V2l0aEZsb2F0cyhUZXh0U3ByaXRlIFQsIGZsb2F0IFgsIGZsb2F0IFkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDZW50ZXJUZXh0KFQsIG5ldyBWZWN0b3IyKHNwcml0ZUJ1ZmZlci5XaWR0aCAqIFgsIHNwcml0ZUJ1ZmZlci5IZWlnaHQgKiBZKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENlbnRlclRleHQoVGV4dFNwcml0ZSBULCBWZWN0b3IyIExvY2F0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVC5Gb3JjZVVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBULlBvc2l0aW9uLlggPSBMb2NhdGlvbi5YIC0gKFQuc3ByaXRlQnVmZmVyLldpZHRoIC8gMik7XHJcbiAgICAgICAgICAgIFQuUG9zaXRpb24uWSA9IExvY2F0aW9uLlkgLSAoVC5zcHJpdGVCdWZmZXIuSGVpZ2h0IC8gMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIERyYXcoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIGlmIChDb250cm9sbGVyLmxvY2tlZCAmJiBJbnB1dENvbnRyb2xsZXJNYW5hZ2VyLl90aGlzLkNvbnRyb2xsZXJzLkNvdW50ID4gMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbGxlci5VbmxvY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgVGl0bGUuRHJhdyhnKTtcclxuICAgICAgICAgICAgVmVyc2lvbi5EcmF3KGcpO1xyXG4gICAgICAgICAgICBEZXNjLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIENvbnRyb2xzLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIG1lbnUuRHJhdyhnKTtcclxuICAgICAgICAgICAgbWVudS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgQ3JlZGl0cy5EcmF3KGcpO1xyXG5cclxuICAgICAgICAgICAgLy92YXIgTSA9IEtleWJvYXJkTWFuYWdlci5fdGhpcy5Nb3VzZVBvc2l0aW9uLkNsb25lKCk7XHJcbiAgICAgICAgICAgIHZhciBNID0gS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLkNNb3VzZS5DbG9uZSgpO1xyXG4gICAgICAgICAgICBpZiAoIUFwcC5EaXYuU3R5bGUuTGVmdC5Db250YWlucyhcInB4XCIpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypNLlggLT0gZmxvYXQuUGFyc2UoQXBwLkRpdi5TdHlsZS5MZWZ0LlJlcGxhY2UoXCJweFwiLCBcIlwiKSk7Ki9cclxuICAgICAgICAgICAgLy9DcmVkaXRzLlRleHQgPSBcIlg6XCIgKyBNLlgrXCIvXCIrKHNwcml0ZUJ1ZmZlci5XaWR0aCAqIDAuMSkgK1wiIFk6XCIrTS5ZK1wiL1wiKyhzcHJpdGVCdWZmZXIuSGVpZ2h0ICogMC45Nik7XHJcbiAgICAgICAgICAgIGlmIChNLlggPCBzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjE3ICYmIE0uWSA+PSBzcHJpdGVCdWZmZXIuSGVpZ2h0ICogMC45NilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQXBwLkRpdi5TdHlsZS5DdXJzb3IgPSBDdXJzb3IuUG9pbnRlcjtcclxuICAgICAgICAgICAgICAgIGlmIChLZXlib2FyZE1hbmFnZXIuX3RoaXMuVGFwcGVkTW91c2VCdXR0b25zLkNvbnRhaW5zKDApKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5Mb2NhdGlvbi5IcmVmID0gXCJodHRwczovL3JzZ21ha2VyLmRldmlhbnRhcnQuY29tXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBcHAuRGl2LlN0eWxlLkN1cnNvciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRG9vcktleSA6IENvbGxlY3RhYmxlSXRlbVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBEb29yS2V5KEdhbWUgZ2FtZSkgOiBiYXNlKGdhbWUsIFwiYmlna2V5XCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgbWFnbmV0RGlzdGFuY2UgPSAyMDtcclxuICAgICAgICAgICAgc291bmQgPSBcImtleVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgb25Db2xsZWN0ZWQoUGxheWVyQ2hhcmFjdGVyIHBsYXllcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIEdhbWUuRG9vci5PcGVuZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgRmxvYXRpbmdNZXNzYWdlIEZNID0gbmV3IEZsb2F0aW5nTWVzc2FnZShHYW1lLCBcIkRvb3IgVW5sb2NrZWQhXCIpO1xyXG4gICAgICAgICAgICBGTS5UZXh0LlRleHRDb2xvciA9IFwiIzc3RkZGRlwiO1xyXG4gICAgICAgICAgICBGTS5Qb3NpdGlvbiA9IG5ldyBWZWN0b3IyKHggKyA4LCB5IC0gMjApO1xyXG4gICAgICAgICAgICBHYW1lLkFkZEVudGl0eShGTSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAoeSA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBHYW1lLkxldmVsUmVzdGFydCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lIDogR2FtZVNwcml0ZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBQbGF5ZXJDaGFyYWN0ZXIgcGxheWVyO1xyXG4gICAgICAgIHB1YmxpYyBMaXN0PEVudGl0eT4gZW50aXRpZXM7XHJcbiAgICAgICAgcHVibGljIExpc3Q8RW50aXR5PiBoYXJtZnVsO1xyXG4gICAgICAgIHB1YmxpYyBMaXN0PEVudGl0eT4gY29tYmF0YW50cztcclxuICAgICAgICBwdWJsaWMgQ2FtZXJhIGNhbWVyYTtcclxuICAgICAgICBwdWJsaWMgUmVjdGFuZ2xlIHN0YWdlQm91bmRzO1xyXG4gICAgICAgIHB1YmxpYyBUaWxlTWFwIFRNO1xyXG4gICAgICAgIHB1YmxpYyBHYW1lUGxheVNldHRpbmdzIEdhbWVQbGF5U2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHB1YmxpYyBUZXh0U3ByaXRlIFRpbWVyU3ByaXRlO1xyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgZGVmYXVsdFRpbWVSZW1haW5pbmcgPSAxMDAwICogNjAgKiAzOy8vMyBtaW51dGVzXHJcbiAgICAgICAgcHVibGljIGZsb2F0IG1heFRpbWVSZW1haW5pbmcgPSAxMDAwICogNjAgKiA1Oy8vMyBtaW51dGVzXHJcbiAgICAgICAgcHVibGljIGZsb2F0IHRpbWVSZW1haW5pbmc7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHRvdGFsVGltZSA9IDA7XHJcbiAgICAgICAgcHVibGljIGludCBsZXZlbCA9IDA7XHJcbiAgICAgICAgcHVibGljIGJvb2wgcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBib29sIHBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIGNhbWVyYVdhbmRlclBvaW50O1xyXG4gICAgICAgIHB1YmxpYyBUaXRsZVNjcmVlbiBUUztcclxuICAgICAgICBwdWJsaWMgYm9vbCBUZWFtcyA9IHRydWU7XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIHJ1bm5pbmdcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxheWluZyAmJiAhcGF1c2VkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIHNraXByZW5kZXIgPSB0cnVlO1xyXG5cclxuICAgICAgICBwdWJsaWMgVGV4dFNwcml0ZSBTY29yZVNwcml0ZTtcclxuXHJcbiAgICAgICAgcHVibGljIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBFRztcclxuXHJcbiAgICAgICAgcHVibGljIEV4aXREb29yIERvb3I7XHJcblxyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IEtleTtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBCaWdLZXk7XHJcbiAgICAgICAgcHVibGljIEdhbWUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2FtZVBsYXlTZXR0aW5ncyA9IG5ldyBHYW1lUGxheVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgIERvb3IgPSBuZXcgRXhpdERvb3IodGhpcyk7XHJcbiAgICAgICAgICAgIGVudGl0aWVzID0gbmV3IExpc3Q8RW50aXR5PigpO1xyXG4gICAgICAgICAgICBjb21iYXRhbnRzID0gbmV3IExpc3Q8RW50aXR5PigpO1xyXG4gICAgICAgICAgICBoYXJtZnVsID0gbmV3IExpc3Q8RW50aXR5PigpO1xyXG5cclxuICAgICAgICAgICAgcGxheWVyID0gbmV3IFBsYXllckNoYXJhY3Rlcih0aGlzKTtcclxuICAgICAgICAgICAgcGxheWVyLkhQID0gMDtcclxuICAgICAgICAgICAgdGltZVJlbWFpbmluZyA9IGRlZmF1bHRUaW1lUmVtYWluaW5nO1xyXG4gICAgICAgICAgICAvL3RpbWVSZW1haW5pbmcgKj0gMC4zMzM0ZiAqIDAuMjVmO1xyXG5cclxuICAgICAgICAgICAgLyp0ZXN0LkFuaSA9IG5ldyBBbmltYXRpb24oQW5pbWF0aW9uTG9hZGVyLl90aGlzLkdldChcImltYWdlcy9jaXJuby93YWxrXCIpKTtcclxuICAgICAgICAgICAgdGVzdC5BbmkuSW1hZ2VTcGVlZCA9IDAuMWY7Ki9cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vc3RhZ2VCb3VuZHMgPSBuZXcgUmVjdGFuZ2xlKDAsIDAsIDgwMDAsIDMwMDApO1xyXG4gICAgICAgICAgICAvL3N0YWdlQm91bmRzID0gbmV3IFJlY3RhbmdsZSgwLCAwLCA2MDAwLCA0MDAwKTtcclxuICAgICAgICAgICAgLy9zdGFnZUJvdW5kcyA9IG5ldyBSZWN0YW5nbGUoMCwgMCwgMjAwMCwgMTUwMCk7XHJcbiAgICAgICAgICAgIC8vc3RhZ2VCb3VuZHMgPSBuZXcgUmVjdGFuZ2xlKDAsIDAsIDEwMDAsIDc1MCk7XHJcbiAgICAgICAgICAgIC8vc3RhZ2VCb3VuZHMgPSBuZXcgUmVjdGFuZ2xlKDAsIDAsIDIwMDAsIDEwMDApO1xyXG4gICAgICAgICAgICBzdGFnZUJvdW5kcyA9IG5ldyBSZWN0YW5nbGUoMCwgMCwgNDAwMCwgMjAwMCk7XHJcbiAgICAgICAgICAgIFRNID0gbmV3IFRpbGVNYXAodGhpcyk7XHJcbiAgICAgICAgICAgIFRNLlNlZWQgPSAoaW50KShNYXRoLlJhbmRvbSgpICogOTk5OTk5OTk5OSk7XHJcbiAgICAgICAgICAgIC8vL1RNLkdlbmVyYXRlKCk7XHJcbiAgICAgICAgICAgIFRNLnBvc2l0aW9uLlkgPSAwO1xyXG4gICAgICAgICAgICB2YXIgUiA9IHN0YWdlQm91bmRzIC0gVE0ucG9zaXRpb247XHJcbiAgICAgICAgICAgIFIud2lkdGggLT0gVE0udGlsZXNpemU7XHJcbiAgICAgICAgICAgIFIuaGVpZ2h0IC09IFRNLnRpbGVzaXplO1xyXG4gICAgICAgICAgICAvL1RNLkRyYXdSZWN0KFIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIuUG9zaXRpb24uWSA9IHN0YWdlQm91bmRzLmhlaWdodCAvIDM7XHJcbiAgICAgICAgICAgIHBsYXllci5Qb3NpdGlvbi5YID0gc3RhZ2VCb3VuZHMud2lkdGggLyAyO1xyXG5cclxuICAgICAgICAgICAgRUcgPSBIZWxwZXIuR2V0Q29udGV4dChuZXcgSFRNTENhbnZhc0VsZW1lbnQoKSk7XHJcbiAgICAgICAgICAgIC8vTWFwR2VuZXJhdG9yLkdlbmVyYXRlKHRoaXMpO1xyXG4gICAgICAgICAgICAvKk1hcEdlbmVyYXRvci5Cb3h5R2VuZXJhdGUodGhpcyk7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFRNLkRyYXdSZWN0KFIpO1xyXG4gICAgICAgICAgICAvL1RNLnRlc3RUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgIFRNLkFwcGx5QnJlYWthYmxlKCk7Ki9cclxuICAgICAgICAgICAgLyp2YXIgRSA9IG5ldyBFbnRpdHkodGhpcyk7XHJcbiAgICAgICAgICAgIEUuQW5pID0gbmV3IEFuaW1hdGlvbihBbmltYXRpb25Mb2FkZXIuR2V0KFwiSW1hZ2VzL2xhbmQvYnJpY2tcIikpO1xyXG4gICAgICAgICAgICBFLnkgKz0gMjQ7XHJcbiAgICAgICAgICAgIGVudGl0aWVzLkFkZChFKTtcclxuICAgICAgICAgICAgdmFyIGxuID0gMTA7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRSA9IG5ldyBFbnRpdHkodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBFLkFuaSA9IG5ldyBBbmltYXRpb24oQW5pbWF0aW9uTG9hZGVyLkdldChcIkltYWdlcy9sYW5kL2JyaWNrXCIpKTtcclxuICAgICAgICAgICAgICAgIEUueSArPSAyNDtcclxuICAgICAgICAgICAgICAgIEUueCArPSAxNiAqIChpKzEpO1xyXG4gICAgICAgICAgICAgICAgZW50aXRpZXMuQWRkKEUpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGxuKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBFID0gbmV3IEVudGl0eSh0aGlzKTtcclxuICAgICAgICAgICAgICAgIEUuQW5pID0gbmV3IEFuaW1hdGlvbihBbmltYXRpb25Mb2FkZXIuR2V0KFwiSW1hZ2VzL2xhbmQvYnJpY2tcIikpO1xyXG4gICAgICAgICAgICAgICAgRS55ICs9IDI0O1xyXG4gICAgICAgICAgICAgICAgRS54ICs9IDE2ICogLShpICsgMSk7XHJcbiAgICAgICAgICAgICAgICBlbnRpdGllcy5BZGQoRSk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH0qL1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vZW50aXRpZXMuQWRkKHRlc3QpO1xyXG4gICAgICAgICAgICBBZGRFbnRpdHkoRG9vcik7XHJcbiAgICAgICAgICAgIC8vL0FkZEVudGl0eShwbGF5ZXIpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vc3ByaXRlQnVmZmVyLldpZHRoID0gMjAwO1xyXG4gICAgICAgICAgICBzcHJpdGVCdWZmZXIuV2lkdGggPSBBcHAuQ2FudmFzLldpZHRoO1xyXG4gICAgICAgICAgICBzcHJpdGVCdWZmZXIuSGVpZ2h0ID0gKGludCkoc3ByaXRlQnVmZmVyLldpZHRoICogQXBwLlRhcmdldEFzcGVjdCk7XHJcbiAgICAgICAgICAgIC8qY2FtZXJhLnZpZXdwb3J0X3dpZHRoID0gc3ByaXRlQnVmZmVyLldpZHRoO1xyXG4gICAgICAgICAgICBjYW1lcmEudmlld3BvcnRfaGVpZ2h0ID0gc3ByaXRlQnVmZmVyLkhlaWdodDsqL1xyXG4gICAgICAgICAgICBjYW1lcmEgPSBuZXcgQ2FtZXJhKHNwcml0ZUJ1ZmZlci5XaWR0aCwgc3ByaXRlQnVmZmVyLkhlaWdodCk7XHJcbiAgICAgICAgICAgIC8vY2FtZXJhLlNjYWxlID0gNjtcclxuICAgICAgICAgICAgLy8vY2FtZXJhLlNjYWxlID0gNTtcclxuICAgICAgICAgICAgLy9jYW1lcmEuU2NhbGUgPSA0O1xyXG4gICAgICAgICAgICAvL2NhbWVyYS5TY2FsZSA9IDMuNWY7XHJcbiAgICAgICAgICAgIGNhbWVyYS5TY2FsZSA9IDMuNzVmO1xyXG5cclxuICAgICAgICAgICAgLy9jYW1lcmEuU2NhbGUgPSAxZjtcclxuICAgICAgICAgICAgY2FtZXJhLlN0YWdlQm91bmRzID0gc3RhZ2VCb3VuZHM7XHJcbiAgICAgICAgICAgIGNhbWVyYS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgY2FtZXJhLmluc3Rhd2FycCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8qc3ByaXRlQnVmZmVyLldpZHRoID0gQXBwLkNhbnZhcy5XaWR0aDtcclxuICAgICAgICAgICAgc3ByaXRlQnVmZmVyLkhlaWdodCA9IEFwcC5DYW52YXMuSGVpZ2h0OyovXHJcbiAgICAgICAgICAgIHNwcml0ZUdyYXBoaWNzLkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLypQbGFjZUFuZEFkZEVudGl0eShuZXcgRG9vcktleSh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIC8vd2hpbGUgKGkgPCAxMTApXHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgMjQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBNUkdob3N0eSh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpKysgPD0gNilcclxuICAgICAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBPcmIodGhpcykpO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkrKyA8PSAzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBQbGFjZUFuZEFkZEVudGl0eShuZXcgQ2hlc3QodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgUGxhY2VBbmRBZGRFbnRpdHkobmV3IEtleUl0ZW0odGhpcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSsrIDw9IDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBIZWFsaW5nSXRlbSh0aGlzKSk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBTdGFydE5leHRMZXZlbCgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIFRpbWVyU3ByaXRlID0gbmV3IFRleHRTcHJpdGUoKTtcclxuICAgICAgICAgICAgVGltZXJTcHJpdGUuRm9udFNpemUgPSBzcHJpdGVCdWZmZXIuSGVpZ2h0IC8gMjQ7XHJcbiAgICAgICAgICAgIFRpbWVyU3ByaXRlLlRleHQgPSBcIjM6MDBcIjtcclxuICAgICAgICAgICAgVGltZXJTcHJpdGUuVGV4dENvbG9yID0gXCIjRkZGRkZGXCI7XHJcbiAgICAgICAgICAgIFRpbWVyU3ByaXRlLlNoYWRvd0NvbG9yID0gXCIjMDAwMDAwXCI7XHJcbiAgICAgICAgICAgIFRpbWVyU3ByaXRlLlNoYWRvd09mZnNldCA9IG5ldyBWZWN0b3IyKDMsIDMpO1xyXG4gICAgICAgICAgICBUaW1lclNwcml0ZS5TaGFkb3dCbHVyID0gMTtcclxuXHJcbiAgICAgICAgICAgIFRpbWVyU3ByaXRlLlBvc2l0aW9uLlggPSBzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjQ3ZjtcclxuICAgICAgICAgICAgVGltZXJTcHJpdGUuUG9zaXRpb24uWSA9IC1UaW1lclNwcml0ZS5Gb250U2l6ZSAvIDg7XHJcblxyXG4gICAgICAgICAgICBTY29yZVNwcml0ZSA9IG5ldyBUZXh0U3ByaXRlKCk7XHJcbiAgICAgICAgICAgIC8vU2NvcmVTcHJpdGUuRm9udFNpemUgPSBzcHJpdGVCdWZmZXIuSGVpZ2h0IC8gMjQ7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLkZvbnRTaXplID0gc3ByaXRlQnVmZmVyLkhlaWdodCAvIDI4O1xyXG4gICAgICAgICAgICBTY29yZVNwcml0ZS5UZXh0ID0gXCJMZXZlbDoxIFNjb3JlOjBcIjtcclxuICAgICAgICAgICAgU2NvcmVTcHJpdGUuVGV4dENvbG9yID0gXCIjRkZGRkZGXCI7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLlNoYWRvd0NvbG9yID0gXCIjMDAwMDAwXCI7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLlNoYWRvd09mZnNldCA9IG5ldyBWZWN0b3IyKDMsIDMpO1xyXG4gICAgICAgICAgICBTY29yZVNwcml0ZS5TaGFkb3dCbHVyID0gMTtcclxuXHJcbiAgICAgICAgICAgIC8vU2NvcmVTcHJpdGUuUG9zaXRpb24uWCA9IHNwcml0ZUJ1ZmZlci5XaWR0aCAqIDAuN2Y7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLkZvcmNlVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLlBvc2l0aW9uLlggPSAoc3ByaXRlQnVmZmVyLldpZHRoICogMC45OGYpIC0gU2NvcmVTcHJpdGUuc3ByaXRlQnVmZmVyLldpZHRoO1xyXG4gICAgICAgICAgICBTY29yZVNwcml0ZS5Qb3NpdGlvbi5ZID0gLVNjb3JlU3ByaXRlLkZvbnRTaXplIC8gODtcclxuXHJcbiAgICAgICAgICAgIEtleSA9IEFuaW1hdGlvbkxvYWRlci5HZXQoXCJpbWFnZXMvaXRlbXMva2V5XCIpWzBdO1xyXG4gICAgICAgICAgICBCaWdLZXkgPSBBbmltYXRpb25Mb2FkZXIuR2V0KFwiaW1hZ2VzL2l0ZW1zL2JpZ2tleVwiKVswXTtcclxuXHJcbiAgICAgICAgICAgIFRTID0gbmV3IFRpdGxlU2NyZWVuKCk7XHJcbiAgICAgICAgICAgIFRTLmdhbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgLy9QbGF5TXVzaWMoXCJ0aGVtZTJcIik7XHJcbiAgICAgICAgICAgIFNldE11c2ljKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENsZWFyRW50aXRpZXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIEwgPSBlbnRpdGllcy5Ub0FycmF5KCk7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBMLkxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIEUgPSBMW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9pZiAoIShFID09IHBsYXllciB8fCBFIGlzIEV4aXREb29yKSlcclxuICAgICAgICAgICAgICAgIGlmIChFLlJlbW92ZWRPbkxldmVsRW5kKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEUuQWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBSZW1vdmVFbnRpdHkoRSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnROZXh0TGV2ZWwoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2xlYXJFbnRpdGllcygpO1xyXG4gICAgICAgICAgICBSb29tT3BlbmluZ0xldmVyLlRFU1QgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXZlbCArPSAxO1xyXG4gICAgICAgICAgICB2YXIgUiA9IHN0YWdlQm91bmRzIC0gVE0ucG9zaXRpb247XHJcbiAgICAgICAgICAgIFIud2lkdGggLT0gVE0udGlsZXNpemU7XHJcbiAgICAgICAgICAgIFIuaGVpZ2h0IC09IFRNLnRpbGVzaXplO1xyXG4gICAgICAgICAgICBUTS5HZW5lcmF0ZSgpO1xyXG4gICAgICAgICAgICBNYXBHZW5lcmF0b3IuQm94eUdlbmVyYXRlKHRoaXMpO1xyXG4gICAgICAgICAgICAvL1RNLkRyYXdSZWN0KFIpO1xyXG4gICAgICAgICAgICAvL1RNLkFwcGx5QnJlYWthYmxlKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIGdob3N0cyA9IE1hdGguTWluKDE4ICsgbGV2ZWwgKiAyLCAyOCk7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgLy93aGlsZSAoaSA8IDExMClcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBnaG9zdHMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBsYWNlQW5kQWRkRW5lbXkobmV3IE1SR2hvc3R5KHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgLy93aGlsZSAoaSsrIDw9IDYpXHJcbiAgICAgICAgICAgIHdoaWxlIChpKysgPD0gNClcclxuICAgICAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBPcmIodGhpcykpO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkrKyA8PSAzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBQbGFjZUFuZEFkZEVudGl0eShuZXcgQ2hlc3QodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgUGxhY2VBbmRBZGRFbnRpdHkobmV3IEtleUl0ZW0odGhpcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSsrIDw9IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBIZWFsaW5nSXRlbSh0aGlzKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBuZXcgQ2lybm9HYW1lLkRvb3JLZXkodGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBhdHRlbXB0cyA9IDA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLlBsYWNlQW5kQWRkRW50aXR5KGtleSk7XHJcbiAgICAgICAgICAgIHdoaWxlIChNYXRoLkFicyhrZXkueCAtIHBsYXllci54KSA8IDcwICYmIGF0dGVtcHRzIDwgNSlcclxuICAgICAgICAgICAgey8vYXR0ZW1wdCB0byBwcmV2ZW50IGtleSBmcm9tIHNwYXduaW5nIHRvbyBjbG9zZVxyXG4gICAgICAgICAgICAgICAgSGVscGVyLkxvZyhcIkRvb3Iga2V5IGlzIHRvbyBjbG9zZSwgcmVwb3NpdGlvbmluZyBrZXkuLi5cIik7XHJcblxyXG4gICAgICAgICAgICAgICBrZXkuUG9zaXRpb24uQ29weUZyb20oTWFwUm9vbS5GaW5kQW55RW1wdHlTcG90KCkpO1xyXG4gICAgICAgICAgICAgICAgYXR0ZW1wdHMgKz0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8vUGxhY2VBbmRBZGRFbnRpdHkobmV3IERvb3JLZXkodGhpcykpO1xyXG4gICAgICAgICAgICAvKlBsYWNlQW5kQWRkRW50aXR5KG5ldyBEb29yS2V5KHRoaXMpKTtcclxuICAgICAgICAgICAgUGxhY2VBbmRBZGRFbnRpdHkobmV3IERvb3JLZXkodGhpcykpO1xyXG4gICAgICAgICAgICBQbGFjZUFuZEFkZEVudGl0eShuZXcgRG9vcktleSh0aGlzKSk7XHJcbiAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBEb29yS2V5KHRoaXMpKTsqL1xyXG5cclxuICAgICAgICAgICAgcGxheWVyLmludmluY2liaWxpdHl0aW1lID0gMTgwO1xyXG4gICAgICAgICAgICBjYW1lcmEuaW5zdGF3YXJwID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2tpcHJlbmRlciA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChwbGF5aW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTZXRNdXNpYygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNldE11c2ljKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUGxheU11c2ljKFwidGhlbWUyXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzb25ncyA9IDI7XHJcbiAgICAgICAgICAgIHZhciBsZXZlbHNwZXJzb25nID0gNTtcclxuICAgICAgICAgICAgdmFyIFMgPSAoaW50KShsZXZlbCAvIGxldmVsc3BlcnNvbmcpO1xyXG4gICAgICAgICAgICBTID0gUyAlIHNvbmdzO1xyXG4gICAgICAgICAgICBQbGF5TXVzaWMoXCJ0aGVtZVwiICsgKFMgKyAxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFBsYWNlQW5kQWRkRW50aXR5KEVudGl0eSBFKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRS5Qb3NpdGlvbi5Db3B5RnJvbShNYXBSb29tLkZpbmRBbnlFbXB0eVNwb3QoKSk7XHJcbiAgICAgICAgICAgIEFkZEVudGl0eShFKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgUGxhY2VBbmRBZGRFbmVteShFbnRpdHkgRSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEUuUG9zaXRpb24uQ29weUZyb20oTWFwUm9vbS5GaW5kQW55RW1wdHlTcG90KCkpO1xyXG4gICAgICAgICAgICB2YXIgYXR0ZW1wdHMgPSAxO1xyXG4gICAgICAgICAgICB3aGlsZSAoRS5Qb3NpdGlvbi5Fc3RpbWF0ZWREaXN0YW5jZSh0aGlzLnBsYXllci5Qb3NpdGlvbikgPCAxMjggJiYgYXR0ZW1wdHMgPCA1KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIZWxwZXIuTG9nKFwiRW5lbXkgc3Bhd25lZCB0b28gY2xvc2UsIHJlcG9zaXRpb25pbmcgZW5lbXkuLi5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgIEUuUG9zaXRpb24uQ29weUZyb20oTWFwUm9vbS5GaW5kQW55RW1wdHlTcG90KCkpO1xyXG4gICAgICAgICAgICAgICAgYXR0ZW1wdHMgKz0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLkFkZEVudGl0eShFKTtcclxuICAgICAgICAgICAgQWRkRW50aXR5KEUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN0cmluZyBHZXRUZWFtQ29sb3IoaW50IHRlYW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGVhbSA9PSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIjRkYwMDAwXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGVhbSA9PSAyIHx8IHRlYW0gPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiIzAwMDBGRlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRlYW0gPT0gMylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiI0ZGRkYwMFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBcIiMwMDAwMDBcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgbXV0ZWQgPSBmYWxzZTtcclxuICAgICAgICBib29sIGxhc3RQYXVzZUJ1dHRvblN0YXRlID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIFRlYW1zID0gR2FtZVBsYXlTZXR0aW5ncy5HYW1lTW9kZS5UZWFtcztcclxuICAgICAgICAgICAgLy9pZiAocGxheWluZyAmJiBLZXlib2FyZE1hbmFnZXIuX3RoaXMuVGFwcGVkQnV0dG9ucy5Db250YWlucygxMykpXHJcbiAgICAgICAgICAgIGlmIChwbGF5aW5nICYmIEFwcC5JQy5nZXRQcmVzc2VkKDUpICYmICFsYXN0UGF1c2VCdXR0b25TdGF0ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcGF1c2VkID0gIXBhdXNlZDtcclxuICAgICAgICAgICAgICAgIC8vL0tleWJvYXJkTWFuYWdlci5fdGhpcy5UYXBwZWRCdXR0b25zLlJlbW92ZSgxMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGFzdFBhdXNlQnV0dG9uU3RhdGUgPSBBcHAuSUMuZ2V0UHJlc3NlZCg1KTtcclxuICAgICAgICAgICAgaWYgKHBsYXlpbmcgJiYgS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlRhcHBlZEJ1dHRvbnMuQ29udGFpbnMoNzcpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIuX3RoaXMuU3RvcEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgbXV0ZWQgPSAhbXV0ZWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW11dGVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFNldE11c2ljKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBLZXlib2FyZE1hbmFnZXIuX3RoaXMuVGFwcGVkQnV0dG9ucy5SZW1vdmUoNzcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghcGF1c2VkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBVcGRhdGVDb250cm9scygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgZW50aXRpZXMuQ291bnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIEUgPSBlbnRpdGllc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRS5BbGl2ZSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEUuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghRS5BbGl2ZSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlbW92ZUVudGl0eShFKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBVcGRhdGVDb2xsaXNpb25zKCk7XHJcbiAgICAgICAgICAgICAgICBVcGRhdGVUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxheWluZyAmJiBwbGF5ZXIueSA8IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9wbGF5ZXIgZ2xpdGNoZWQgb3V0IHNvbWVob3cgbWFrZSBhIG5ldyBsZXZlbC5cclxuICAgICAgICAgICAgICAgICAgICBMZXZlbFJlc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRpbWVyU3ByaXRlLlRleHQgPSBcIlBhdXNlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIExldmVsUmVzdGFydCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXZlbC0tO1xyXG4gICAgICAgICAgICBTdGFydE5leHRMZXZlbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBEb0dhbWVPdmVyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGVudGl0aWVzLkNvbnRhaW5zKHBsYXllcikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlbW92ZUVudGl0eShwbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgLy9Eb0dhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBTdGFydE5leHRMZXZlbCgpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlVGltZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL3RpbWVSZW1haW5pbmcgLT0gMTYuNjY2NjdmO1xyXG4gICAgICAgICAgICBpZiAocGF1c2VkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUaW1lclNwcml0ZS5UZXh0ID0gXCJQYXVzZWRcIjtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGltZVJlbWFpbmluZyA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aW1lUmVtYWluaW5nID0gMDtcclxuICAgICAgICAgICAgICAgIFRpbWVyU3ByaXRlLlRleHQgPSBcIjBcIjtcclxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuSFAgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5IUCAtPSAwLjAwNGY7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgRG9HYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB0b3RhbHNlY29uZHMgPSB0aW1lUmVtYWluaW5nIC8gMTAwMGY7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbG1pbnV0ZXMgPSB0b3RhbHNlY29uZHMgLyA2MDtcclxuXHJcbiAgICAgICAgICAgIHZhciBtaW51dGVzID0gKGludClNYXRoLkZsb29yKHRvdGFsbWludXRlcyk7XHJcbiAgICAgICAgICAgIHZhciBzZWNvbmRzID0gKHRvdGFsc2Vjb25kcyAtIChtaW51dGVzICogNjApKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBTID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKG1pbnV0ZXMgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTID0gXCJcIiArIG1pbnV0ZXMgKyBcIjpcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcHJlZml4ID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHNlY29uZHMgPCAxMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcHJlZml4ID0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAodG90YWxzZWNvbmRzIDwgMTApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4ID0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgUyA9IFMgKyBSZXN0cmljdExlbmd0aChwcmVmaXggKyBNYXRoLk1heCgwLCBzZWNvbmRzKSwgNCk7XHJcbiAgICAgICAgICAgIGlmICh0b3RhbHNlY29uZHMgPj0gNjApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChTLkluZGV4T2YoXCIuXCIpID49IDApXHJcbiAgICAgICAgICAgICAgICAgICAgUyA9IFMuU3BsaXQoXCIuXCIpWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFRpbWVyU3ByaXRlLlRleHQgPSBTO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIFJlc3RyaWN0TGVuZ3RoKHN0cmluZyBzLCBpbnQgbGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHMuTGVuZ3RoID4gbGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcy5TdWJzdHIoMCwgbGVuZ3RoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlQ29sbGlzaW9ucygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL0xpc3Q8RW50aXR5PiBjb21iYXRhbnRzID0gbmV3IExpc3Q8RW50aXR5PihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eT4oZW50aXRpZXMsIChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eSwgYm9vbD4pKGVudGl0eSA9PiBlbnRpdHkgaXMgSUNvbWJhdGFudCAmJiBlbnRpdHkuQW5pLkN1cnJlbnRJbWFnZSAhPSBudWxsICYmICgoSUNvbWJhdGFudCllbnRpdHkpLkhQID4gMCkpKTtcclxuICAgICAgICAgICAgLy9MaXN0PEVudGl0eT4gaGFybWZ1bEVudGl0eSA9IG5ldyBMaXN0PEVudGl0eT4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OkNpcm5vR2FtZS5FbnRpdHk+KGVudGl0aWVzLCAoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkNpcm5vR2FtZS5FbnRpdHksIGJvb2w+KShlbnRpdHkgPT4gZW50aXR5IGlzIElIYXJtZnVsRW50aXR5ICYmIGVudGl0eS5BbmkuQ3VycmVudEltYWdlICE9IG51bGwpKSk7XHJcbiAgICAgICAgICAgIC8vL0xpc3Q8RW50aXR5PiBjb21iYXRhbnRzID0gbmV3IExpc3Q8RW50aXR5PihlbnRpdGllcy5XaGVyZShlbnRpdHkgPT4gZW50aXR5IGlzIElDb21iYXRhbnQgJiYgZW50aXR5LkFuaS5DdXJyZW50SW1hZ2UgIT0gbnVsbCAmJiAoKElDb21iYXRhbnQpZW50aXR5KS5IUCA+IDApKTtcclxuICAgICAgICAgICAgLy8vTGlzdDxFbnRpdHk+IGhhcm1mdWxFbnRpdHkgPSBuZXcgTGlzdDxFbnRpdHk+KGVudGl0aWVzLldoZXJlKGVudGl0eSA9PiBlbnRpdHkgaXMgSUhhcm1mdWxFbnRpdHkgJiYgZW50aXR5LkFuaS5DdXJyZW50SW1hZ2UgIT0gbnVsbCkpO1xyXG4gICAgICAgICAgICBMaXN0PEVudGl0eT4gY29tYmF0YW50cyA9IG5ldyBMaXN0PEVudGl0eT4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OkNpcm5vR2FtZS5FbnRpdHk+KHRoaXMuY29tYmF0YW50cywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkNpcm5vR2FtZS5FbnRpdHksIGJvb2w+KShlbnRpdHkgPT4gZW50aXR5LkFuaS5DdXJyZW50SW1hZ2UgIT0gbnVsbCAmJiAoZW50aXR5LkFzPElDb21iYXRhbnQ+KCkpLkhQID4gMCkpKTtcclxuICAgICAgICAgICAgTGlzdDxFbnRpdHk+IGhhcm1mdWxFbnRpdHkgPSBuZXcgTGlzdDxFbnRpdHk+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpDaXJub0dhbWUuRW50aXR5PihoYXJtZnVsLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eSwgYm9vbD4pKGVudGl0eSA9PiBlbnRpdHkuQW5pLkN1cnJlbnRJbWFnZSAhPSBudWxsKSkpO1xyXG4gICAgICAgICAgICB2YXIgUjIgPSBuZXcgUmVjdGFuZ2xlKCk7XHJcbiAgICAgICAgICAgIHZhciBPUjIgPSBuZXcgUmVjdGFuZ2xlKCk7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgdmFyIGNvdW50ID0gY29tYmF0YW50cy5Db3VudDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBjb3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRW50aXR5IEUgPSBjb21iYXRhbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9pZiAoRSBpcyBJQ29tYmF0YW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIElDb21iYXRhbnQgRUkgPSAoSUNvbWJhdGFudClFLkFzPElDb21iYXRhbnQ+KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgUmVjdGFuZ2xlIFIgPSBFLkdldEhpdGJveCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFZlY3RvcjIgc3BkID0gRS5TcGVlZCAqIDAuNWY7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9SZWN0YW5nbGUgUjIgPSBuZXcgUmVjdGFuZ2xlKFIueCAtIChzcGQuWCksIFIueSAtIChzcGQuWSksIFIud2lkdGgsIFIuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBSMi5TZXQoUi54IC0gKHNwZC5YKSwgUi55IC0gKHNwZC5ZKSwgUi53aWR0aCwgUi5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vTGlzdDxFbnRpdHk+IEwgPSBuZXcgTGlzdDxFbnRpdHk+KGhhcm1mdWxFbnRpdHkuV2hlcmUoZW50aXR5ID0+IGVudGl0eSAhPSBFICYmIGVudGl0eS5HZXRIaXRib3goKS5pc1RvdWNoaW5nKFIpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9MaXN0PEVudGl0eT4gTCA9IG5ldyBMaXN0PEVudGl0eT4oaGFybWZ1bEVudGl0eS5XaGVyZShlbnRpdHkgPT4gZW50aXR5ICE9IEUgJiYgKChJQ29tYmF0YW50KSgoSUhhcm1mdWxFbnRpdHkpZW50aXR5KS5BdHRhY2tlcikuVGVhbSAhPSBFSS5UZWFtKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9MaXN0PEVudGl0eT4gTCA9IG5ldyBMaXN0PEVudGl0eT4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OkNpcm5vR2FtZS5FbnRpdHk+KGhhcm1mdWxFbnRpdHksIChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eSwgYm9vbD4pKGVudGl0eSA9PiBlbnRpdHkgIT0gRSAmJiAhKChJSGFybWZ1bEVudGl0eSllbnRpdHkpLkF0dGFja2VyLlNhbWVUZWFtKChFbnRpdHkpRUkpKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIExpc3Q8RW50aXR5PiBMID0gbmV3IExpc3Q8RW50aXR5PihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eT4oaGFybWZ1bEVudGl0eSwoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkNpcm5vR2FtZS5FbnRpdHksIGJvb2w+KShlbnRpdHkgPT4gZW50aXR5ICE9IEUgJiYgIShlbnRpdHkuQXM8SUhhcm1mdWxFbnRpdHk+KCkpLkF0dGFja2VyLlNhbWVUZWFtKEVJLkFzPEVudGl0eT4oKSkpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IGogPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsbiA9IEwuQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPCBsbilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEVudGl0eSB0bXAgPSBMW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBJSGFybWZ1bEVudGl0eSBIRSA9IHRtcC5BczxJSGFybWZ1bEVudGl0eT4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVjdGFuZ2xlIE9SID0gdG1wLkdldEhpdGJveCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWN0b3IyIHNwZDIgPSB0bXAuU3BlZWQgKiAwLjVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1JlY3RhbmdsZSBPUjIgPSBuZXcgUmVjdGFuZ2xlKE9SLnggLSAoc3BkMi5YKSwgT1IueSAtIChzcGQyLlkpLCBPUi53aWR0aCwgT1IuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgT1IyLlNldChPUi54IC0gKHNwZDIuWCksIE9SLnkgLSAoc3BkMi5ZKSwgT1Iud2lkdGgsIE9SLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgKEVJLlRlYW0gIT0gKChJQ29tYmF0YW50KUhFLkF0dGFja2VyKS5UZWFtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKFIuaXNUb3VjaGluZyhPUikgfHwgUjIuaXNUb3VjaGluZyhPUjIpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEhFLm9udG91Y2hEYW1hZ2UoRUkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBMSFAgPSBFSS5IUDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFSS5vbkRhbWFnZWQoSEUsIEhFLnRvdWNoRGFtYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGFtYWdlZCA9IExIUCA+IEVJLkhQO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGFtYWdlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChFSSA9PSBwbGF5ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVJLkFzPEVudGl0eT4oKS5QbGF5U291bmQoXCJkYW1hZ2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRUkuQXM8RW50aXR5PigpLlBsYXlTb3VuZChcImhpdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEVJLkhQIDw9IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoRUkuQXM8RW50aXR5PigpLkhhbmRsZWRMb2NhbGx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkeW5hbWljIEQgPSBuZXcgb2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBELkkgPSBFSS5BczxFbnRpdHk+KCkuSUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBELkEgPSBIRS5BdHRhY2tlci5JRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEQuUyA9IEhFLkFzPEVudGl0eT4oKS5JRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlbmRFdmVudChcIktpbGxcIiwgRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyppZiAoZGFtYWdlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRUkuQXM8RW50aXR5PigpLlBsYXlTb3VuZChcImtpbGxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKmlmIChkYW1hZ2VkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFSS5BczxFbnRpdHk+KCkuUGxheVNvdW5kKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBdHRhY2soRUkuQXM8SUNvbWJhdGFudD4oKSwgSEUuQXM8SUhhcm1mdWxFbnRpdHk+KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGorKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLypMaXN0PEVudGl0eT4gTCA9IG5ldyBMaXN0PEVudGl0eT4oY29tYmF0YW50cy5XaGVyZShlbnRpdHkgPT4gZW50aXR5ICE9IEUgJiYgZW50aXR5IGlzIElDb21iYXRhbnQgJiYgZW50aXR5LkdldEhpdGJveCgpLmludGVyc2VjdHMoUikpKTtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgaiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPCBMLkNvdW50KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGorKztcclxuICAgICAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBBdHRhY2soSUNvbWJhdGFudCB0YXJnZXQsIElIYXJtZnVsRW50aXR5IHNvdXJjZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQuSFAgPiAwICYmIHNvdXJjZS5vbnRvdWNoRGFtYWdlKHRhcmdldCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5vbkRhbWFnZWQoc291cmNlLCBzb3VyY2UudG91Y2hEYW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgLy8oKEVudGl0eSl0YXJnZXQpLlBsYXlTb3VuZChcImhpdFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuSFAgPD0gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKChFbnRpdHkpdGFyZ2V0KS5IYW5kbGVkTG9jYWxseSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR5bmFtaWMgRCA9IG5ldyBvYmplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRC5JID0gKChFbnRpdHkpdGFyZ2V0KS5JRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRC5BID0gKChFbnRpdHkpc291cmNlLkF0dGFja2VyKS5JRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRC5TID0gKChFbnRpdHkpc291cmNlKS5JRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgU2VuZEV2ZW50KFwiS2lsbFwiLCBEKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgUGxheVNvdW5kRWZmZWN0KFZlY3RvcjIgc291cmNlLCBzdHJpbmcgc291bmQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobXV0ZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmbG9hdCB2b2wgPSAxZjtcclxuICAgICAgICAgICAgLypmbG9hdCBtaW4gPSA2NDA7XHJcbiAgICAgICAgICAgIGZsb2F0IG1heExlbmd0aCA9IDMyMDsqL1xyXG4gICAgICAgICAgICAvL2Zsb2F0IG1pbiA9IDcwMDtcclxuICAgICAgICAgICAgZmxvYXQgbWluID0gNTA7XHJcbiAgICAgICAgICAgIGZsb2F0IG1heExlbmd0aCA9IDIwMDtcclxuICAgICAgICAgICAgaWYgKHNvdXJjZSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2Zsb2F0IGRpc3QgPSAoY2FtZXJhLkNlbnRlciAtIHNvdXJjZSkuUm91Z2hMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAvL2Zsb2F0IGRpc3QgPSAoY2FtZXJhLkNlbnRlciAtIHNvdXJjZSkuTGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgZGlzdCA9IGNhbWVyYS5DZW50ZXIuRXN0aW1hdGVkRGlzdGFuY2Uoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGRpc3QgLT0gbWluO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0ID49IG1heExlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdm9sdW1lIG9mIDAsIGp1c3QgZG9uJ3QgcGxheSBpdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2b2wgPSAxZiAtIChkaXN0IC8gbWF4TGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLl90aGlzLkJsYXN0KFwiU0ZYL1wiICsgc291bmQgKyBcIi5vZ2dcIiwgdm9sKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEVudGl0eShFbnRpdHkgRSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGVudGl0aWVzLkFkZChFKTtcclxuICAgICAgICAgICAgaWYgKEUgaXMgSUNvbWJhdGFudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29tYmF0YW50cy5BZGQoRS5Ub0R5bmFtaWMoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKEUgaXMgSUhhcm1mdWxFbnRpdHkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGhhcm1mdWwuQWRkKEUuVG9EeW5hbWljKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlbW92ZUVudGl0eShFbnRpdHkgRSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEUub25SZW1vdmUoKTtcclxuICAgICAgICAgICAgZW50aXRpZXMuUmVtb3ZlKEUpO1xyXG4gICAgICAgICAgICBpZiAoRSBpcyBJQ29tYmF0YW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb21iYXRhbnRzLlJlbW92ZShFLlRvRHluYW1pYygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoRSBpcyBJSGFybWZ1bEVudGl0eSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaGFybWZ1bC5SZW1vdmUoRS5Ub0R5bmFtaWMoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgUmVuZGVyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuUmVuZGVyKCk7XHJcblxyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZyA9IHNwcml0ZUdyYXBoaWNzO1xyXG4gICAgICAgICAgICBpZiAoc2tpcHJlbmRlcilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZyA9IEVHO1xyXG4gICAgICAgICAgICAgICAgc2tpcHJlbmRlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFVwZGF0ZUNhbWVyYSgpO1xyXG4gICAgICAgICAgICBEcmF3QmFja2dyb3VuZChnKTtcclxuXHJcbiAgICAgICAgICAgIGcuU2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgY2FtZXJhLkFwcGx5KGcpO1xyXG4gICAgICAgICAgICAvL1RNLnBvc2l0aW9uLlkgPSAtMjAwO1xyXG4gICAgICAgICAgICBUTS5EcmF3KGcpO1xyXG4gICAgICAgICAgICBlbnRpdGllcy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpDaXJub0dhbWUuRW50aXR5PikoRSA9PiB7IGlmIChFLkFsaXZlICYmIEUuVmlzaWJsZSkgeyBFLkRyYXcoZyk7IH0gfSkpO1xyXG5cclxuICAgICAgICAgICAgZy5SZXN0b3JlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVuZGVyR1VJKGcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IDAuM2Y7XHJcbiAgICAgICAgICAgICAgICBnLkZpbGxTdHlsZSA9IFwiIzAwMDAwMFwiO1xyXG4gICAgICAgICAgICAgICAgZy5GaWxsUmVjdCgwLCAwLCBzcHJpdGVCdWZmZXIuV2lkdGgsIHNwcml0ZUJ1ZmZlci5IZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IDFmO1xyXG4gICAgICAgICAgICAgICAgVFMuRHJhdyhnKTtcclxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuc2NvcmUgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFNjb3JlU3ByaXRlLlRleHQgPSBcIkxldmVsOlwiICsgbGV2ZWwgKyBcIiBTY29yZTpcIiArIHBsYXllci5zY29yZTtcclxuICAgICAgICAgICAgICAgICAgICBTY29yZVNwcml0ZS5Gb3JjZVVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNjb3JlU3ByaXRlLlBvc2l0aW9uLlggPSAoc3ByaXRlQnVmZmVyLldpZHRoICogMC45OGYpIC0gU2NvcmVTcHJpdGUuc3ByaXRlQnVmZmVyLldpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIFNjb3JlU3ByaXRlLkRyYXcoZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChlbnRpdGllcy5Db250YWlucyhwbGF5ZXIpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZW1vdmVFbnRpdHkocGxheWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbGF5ZXIgPSBuZXcgUGxheWVyQ2hhcmFjdGVyKHRoaXMpO1xyXG4gICAgICAgICAgICBBZGRFbnRpdHkocGxheWVyKTtcclxuICAgICAgICAgICAgcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGxldmVsID0gMDtcclxuICAgICAgICAgICAgU3RhcnROZXh0TGV2ZWwoKTtcclxuICAgICAgICAgICAgQXBwLkRpdi5TdHlsZS5DdXJzb3IgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdG90YWxUaW1lID0gMDtcclxuICAgICAgICAgICAgdGltZVJlbWFpbmluZyA9IGRlZmF1bHRUaW1lUmVtYWluaW5nO1xyXG4gICAgICAgICAgICAvL3RpbWVSZW1haW5pbmcgKj0gMC4zMzM0ZiAqIDAuMjVmO1xyXG4gICAgICAgICAgICAvKnRpbWVSZW1haW5pbmcgKj0gMC4zMzM0ZiAqIDAuMDVmO1xyXG4gICAgICAgICAgICBwbGF5ZXIuSFAgPSA1OyovXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBQbGF5TXVzaWMoc3RyaW5nIHNvbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobXV0ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIEF1ZGlvIE0gPSBBdWRpb01hbmFnZXIuX3RoaXMuR2V0KFwiQkdNL1wiICsgc29uZyArIFwiLm9nZ1wiKTtcclxuICAgICAgICAgICAgaWYgKCFNLklzUGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLl90aGlzLlN0b3BBbGxGcm9tRGlyZWN0b3J5KFwiQkdNL1wiKTtcclxuICAgICAgICAgICAgICAgIC8vTS5Wb2x1bWUgPSAwLjM1O1xyXG4gICAgICAgICAgICAgICAgTS5Wb2x1bWUgPSAwLjM1O1xyXG4gICAgICAgICAgICAgICAgTS5Mb29wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIE0uUGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlbmRlckdVSShDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBQQyA9IChQbGF5ZXJDaGFyYWN0ZXIpcGxheWVyO1xyXG4gICAgICAgICAgICB2YXIgY29sb3IgPSBcIiMwMEREMDBcIjtcclxuICAgICAgICAgICAgaWYgKHRpbWVSZW1haW5pbmcgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBcIiNGRjAwMDBcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IDAuOGY7XHJcbiAgICAgICAgICAgIERyYXdHYXVnZShnLCBuZXcgVmVjdG9yMigwLCAwKSwgbmV3IFZlY3RvcjIoc3ByaXRlQnVmZmVyLldpZHRoIC8gNCwgc3ByaXRlQnVmZmVyLkhlaWdodCAvIDIwKSwgNSwgUEMuSFAgLyBQQy5tYXhIUCwgY29sb3IpO1xyXG4gICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gMTtcclxuXHJcbiAgICAgICAgICAgIFRpbWVyU3ByaXRlLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLlRleHQgPSBcIkxldmVsOlwiICsgbGV2ZWwgKyBcIiBTY29yZTpcIiArIHBsYXllci5zY29yZTtcclxuICAgICAgICAgICAgU2NvcmVTcHJpdGUuRm9yY2VVcGRhdGUoKTtcclxuICAgICAgICAgICAgU2NvcmVTcHJpdGUuUG9zaXRpb24uWCA9IChzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjk4ZikgLSBTY29yZVNwcml0ZS5zcHJpdGVCdWZmZXIuV2lkdGg7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIFJlbmRlckljb25zKGcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW5kZXJJY29ucyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBSID0gS2V5LkhlaWdodCAvIEtleS5XaWR0aDtcclxuICAgICAgICAgICAgdmFyIFcgPSBzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjAyZjtcclxuICAgICAgICAgICAgdmFyIEggPSBzcHJpdGVCdWZmZXIuSGVpZ2h0ICogMC4wNTVmO1xyXG5cclxuICAgICAgICAgICAgdmFyIFkgPSBIO1xyXG4gICAgICAgICAgICB2YXIgWCA9IFcgLyAyO1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL3ZhciBzeiA9IHNwcml0ZUJ1ZmZlci5XaWR0aCAqIDAuMDE1ZjtcclxuICAgICAgICAgICAgdmFyIHN6ID0gc3ByaXRlQnVmZmVyLldpZHRoICogMC4wMTE1ZjtcclxuICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IDAuOGY7XHJcbiAgICAgICAgICAgIGlmIChEb29yLk9wZW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIERBID0gQmlnS2V5O1xyXG4gICAgICAgICAgICAgICAgLy92YXIgRHN6ID0gc3ByaXRlQnVmZmVyLldpZHRoICogMC4wMThmO1xyXG4gICAgICAgICAgICAgICAgdmFyIERzeiA9IHN6ICogMS41ZjtcclxuICAgICAgICAgICAgICAgIHZhciBEUiA9IERBLkhlaWdodCAvIERBLldpZHRoO1xyXG5cclxuICAgICAgICAgICAgICAgIGcuRHJhd0ltYWdlKERBLCBYLCBZLCBEc3osIERzeiAqIFIpO1xyXG4gICAgICAgICAgICAgICAgWCArPSBXO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgcGxheWVyLmtleXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGcuRHJhd0ltYWdlKEtleSwgWCwgWSwgc3osIHN6ICogUik7XHJcbiAgICAgICAgICAgICAgICBYICs9IFc7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IDFmO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3R2F1Z2UoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcsIFZlY3RvcjIgcG9zaXRpb24sIFZlY3RvcjIgc2l6ZSwgaW50IGJvcmRlciwgZmxvYXQgcHJvZ3Jlc3MsIHN0cmluZyBjb2xvciwgYm9vbCBkcmF3Ym9yZGVyID0gdHJ1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBhbHBoYSA9IGcuR2xvYmFsQWxwaGE7XHJcbiAgICAgICAgICAgIGlmIChkcmF3Ym9yZGVyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gMC42ZiAqIGFscGhhO1xyXG4gICAgICAgICAgICAgICAgZy5GaWxsU3R5bGUgPSBcIiMwMDAwMDBcIjtcclxuXHJcbiAgICAgICAgICAgICAgICBnLkZpbGxSZWN0KChpbnQpcG9zaXRpb24uWCwgKGludClwb3NpdGlvbi5ZLCAoaW50KXNpemUuWCwgKGludClzaXplLlkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBnLkZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gMS4wZiAqIGFscGhhO1xyXG4gICAgICAgICAgICBnLkZpbGxSZWN0KChpbnQpcG9zaXRpb24uWCArIGJvcmRlciwgKGludClwb3NpdGlvbi5ZICsgYm9yZGVyLCAoaW50KSgoc2l6ZS5YIC0gKGJvcmRlciArIGJvcmRlcikpICogcHJvZ3Jlc3MpLCAoaW50KXNpemUuWSAtIChib3JkZXIgKyBib3JkZXIpKTtcclxuXHJcbiAgICAgICAgICAgIGcuR2xvYmFsQWxwaGEgPSAwLjVmICogYWxwaGE7XHJcbiAgICAgICAgICAgIC8vU2NyaXB0LldyaXRlKFwidmFyIGdyZCA9IGcuY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgc2l6ZS55KTtncmQuYWRkQ29sb3JTdG9wKDAsIGNvbG9yKTtncmQuYWRkQ29sb3JTdG9wKDAuNCwgXFxcIndoaXRlXFxcIik7Z3JkLmFkZENvbG9yU3RvcCgxLCBjb2xvcik7Zy5maWxsU3R5bGUgPSBncmQ7XCIpO1xyXG4gICAgICAgICAgICB2YXIgZ3JkID0gZy5DcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCBzaXplLlkpO1xyXG4gICAgICAgICAgICBncmQuQWRkQ29sb3JTdG9wKDAsIGNvbG9yKTtcclxuICAgICAgICAgICAgZ3JkLkFkZENvbG9yU3RvcCgwLjQsIFwid2hpdGVcIik7XHJcbiAgICAgICAgICAgIGdyZC5BZGRDb2xvclN0b3AoMSwgY29sb3IpO1xyXG4gICAgICAgICAgICBnLkZpbGxTdHlsZSA9IGdyZDtcclxuXHJcblxyXG4gICAgICAgICAgICBnLkZpbGxSZWN0KChpbnQpcG9zaXRpb24uWCArIGJvcmRlciwgKGludClwb3NpdGlvbi5ZICsgYm9yZGVyLCAoaW50KSgoc2l6ZS5YIC0gKGJvcmRlciArIGJvcmRlcikpICogcHJvZ3Jlc3MpLCAoaW50KXNpemUuWSAtIChib3JkZXIgKyBib3JkZXIpKTtcclxuICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IGFscGhhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBTaG93SGl0Ym94ID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIHZvaWQgU2VuZEV2ZW50KHN0cmluZyBldmVudE5hbWUsIGR5bmFtaWMgZGF0YSwgYm9vbCB0cmlnZ2VyZmx1c2ggPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGR5bmFtaWMgRCA9IG5ldyBvYmplY3QoKTtcclxuICAgICAgICAgICAgRC5FID0gZXZlbnROYW1lO1xyXG4gICAgICAgICAgICBELkQgPSBkYXRhO1xyXG4gICAgICAgICAgICAvKk5ldFBsYXlVc2VyIE5VID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKE9ubGluZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgTlAuU2VuZChEKTtcclxuICAgICAgICAgICAgICAgIE5VID0gTlAuTWU7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAvL1Byb2Nlc3NFdmVudChELCBOVSwgMCk7XHJcbiAgICAgICAgICAgIFByb2Nlc3NFdmVudChEKTtcclxuICAgICAgICAgICAgLyppZiAodHJpZ2dlcmZsdXNoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBOZXRQbGF5TmVlZHNGbHVzaCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBQcm9jZXNzRXZlbnQoZHluYW1pYyBtc2csIC8qTmV0UGxheVVzZXIqL29iamVjdCB1c2VyID0gbnVsbCwgZmxvYXQgbGF0ZW5jeSA9IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkeW5hbWljIEQgPSBtc2cuRDtcclxuICAgICAgICAgICAgLypMaXN0PFBsYXllcj4gTFAgPSBuZXcgTGlzdDxQbGF5ZXI+KHBsYXllcnMuV2hlcmUocGxheWVyID0+IHVzZXIgIT0gbnVsbCAmJiBwbGF5ZXIuTmV0d29ya0lEID09IHVzZXIudXNlcklEKSk7XHJcbiAgICAgICAgICAgIFBsYXllciBQID0gbnVsbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGJvb2wgaGFzY2hhcmFjdGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKExQLkNvdW50IDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChQID09IG51bGwgJiYgdXNlciA9PSBudWxsICYmICFPbmxpbmUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUCA9IGxvY2FscGxheWVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyLklzTWUpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbHBsYXllci5OZXR3b3JrSUQgPSB1c2VyLnVzZXJJRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUCA9IGxvY2FscGxheWVyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNjaGFyYWN0ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBQID0gTFBbMF07XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBzdHJpbmcgZXZ0ID0gbXNnLkU7XHJcbiAgICAgICAgICAgIC8qaWYgKHVzZXIgIT0gbnVsbCAmJiAhdXNlci5Jc01lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBEbGF0ZW5jeSArPSBsYXRlbmN5O1xyXG4gICAgICAgICAgICAgICAgLy9sYXRlbmN5ICo9IDAuOTlmO1xyXG4gICAgICAgICAgICAgICAgRGxhdGVuY3kgKj0gKDEgLSAoMSAvIGxhdGVuY3lNKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9pZiAobXNnLkUgPT0gXCJJbml0XCIgJiYgIVAubG9jYWwpXHJcbiAgICAgICAgICAgIGlmIChldnQgPT0gXCJJbml0XCIgJiYgUCA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhc2NoYXJhY3RlcilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBQID0gbmV3IFBsYXllcihmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIFAuTmV0d29ya0lEID0gdXNlci51c2VySUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9QbGF5ZXJDaGFyYWN0ZXIgUEMgPSBuZXcgUGxheWVyQ2hhcmFjdGVyKHRoaXMsIFAsIFwiUmVpc2VuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFBsYXllckNoYXJhY3RlciBQQyA9IG5ldyBQbGF5ZXJDaGFyYWN0ZXIodGhpcywgUCwgRC5DKTtcclxuICAgICAgICAgICAgICAgICAgICAvL1BDLlRlYW0gPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIFBDLlRlYW0gPSBELlQ7XHJcbiAgICAgICAgICAgICAgICAgICAgUEMueCA9IDcwMDtcclxuICAgICAgICAgICAgICAgICAgICBQQy55ID0gMjQwO1xyXG4gICAgICAgICAgICAgICAgICAgIFBDLklEID0gRC5JO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcnMuQWRkKFApO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZEVudGl0eShQQyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEhvc3RlcilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFNlbmRFdmVudChcIk1hcFNlZWRcIiwgVE0uU2VlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBMaXN0PEVudGl0eT4gTCA9IG5ldyBMaXN0PEVudGl0eT4oZW50aXRpZXMuV2hlcmUoRSA9PiBFIGlzIE1hZG5lc3NPcmIgfHwgKEUgaXMgUGxheWVyQ2hhcmFjdGVyICYmICgoUGxheWVyQ2hhcmFjdGVyKUUpLnBsYXllci5DUFUpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGkgPCBMLkNvdW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZW5kRW50aXR5U3Bhd25DaGVjayhMW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcIlVzZXI6XCIgKyBQLk5ldHdvcmtJRCArIFwiIGhhcyBqb2luZWQhXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQgPT0gXCJTcGF3blwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBFbnRpdHkgRSA9IEVudGl0eUZyb21JRChELkkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUeXBlIFQgPSBIZWxwZXIuR2V0VHlwZShELlQpO1xyXG4gICAgICAgICAgICAgICAgICAgIEUgPSBBY3RpdmF0b3IuQ3JlYXRlSW5zdGFuY2UoVCwgdGhpcykuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgRS5JRCA9IEQuSTtcclxuICAgICAgICAgICAgICAgICAgICBFLnggPSBELlg7XHJcbiAgICAgICAgICAgICAgICAgICAgRS55ID0gRC5ZO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoRC5EKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgSGVscGVyLkNvcHlGaWVsZHMoRC5ELCBFKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkRW50aXR5KEUpO1xyXG4gICAgICAgICAgICAgICAgICAgIENhdGNodXBFbnRpdHkoRSwgbGF0ZW5jeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9BY3RpdmF0b3IuQ3JlYXRlSW5zdGFuY2UoKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vU3lzdGVtLlJlZmxlY3Rpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgLy9UeXBlIFQgPSBUeXBlLkdldFR5cGUoXCJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGV2dCA9PSBcIlVucGF1c2VcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcIkdhbWUgdW5wYXVzZWRcIik7XHJcbiAgICAgICAgICAgICAgICBTZW5kSW5pdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQgPT0gXCJNYXBTZWVkXCIgJiYgIUhvc3RlcilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKFRNLlNlZWQgIT0gRClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUTS5TZWVkID0gRDtcclxuICAgICAgICAgICAgICAgICAgICBUTS5HZW5lcmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY2xlYW4gdXAgbG9jYWwgY2xpZW50IGVudGl0aWVzLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY29ubmVjdGVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaSA8IGVudGl0aWVzLkNvdW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW50aXRpZXNbaV0gaXMgTWFkbmVzc09yYiB8fCAoZW50aXRpZXNbaV0gaXMgUGxheWVyQ2hhcmFjdGVyICYmICgoUGxheWVyQ2hhcmFjdGVyKWVudGl0aWVzW2ldKS5wbGF5ZXIuQ1BVKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZW1vdmVFbnRpdHkoZW50aXRpZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGV2dCA9PSBcIkNFXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEVudGl0eSBlbnRpdHkgPSBFbnRpdHlGcm9tSUQoRC5JKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHkuQ3VzdG9tRXZlbnQoRC5EKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXZ0ID09IFwiQ0JFXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEVudGl0eSBlbnRpdHkgPSBFbnRpdHlGcm9tSUQoRC5JKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBFbnRpdHlCZWhhdmlvciBiID0gZW50aXR5LkdldEJlaGF2aW9yRnJvbU5hbWUoRC5UKTtcclxuICAgICAgICAgICAgICAgICAgICBiLkN1c3RvbUV2ZW50KEQuRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9lbnRpdHkuQ3VzdG9tRXZlbnQoRC5EKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIGlmIChldnQgPT0gXCJLaWxsXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEVudGl0eSBlbnRpdHkgPSBFbnRpdHlGcm9tSUQoRC5JKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBFbnRpdHkgYXR0YWNrZXIgPSBFbnRpdHlGcm9tSUQoRC5BKTtcclxuICAgICAgICAgICAgICAgICAgICAoKElDb21iYXRhbnQpZW50aXR5KS5vbkRlYXRoKEVudGl0eUZyb21JRChELlMpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0YWNrZXIgIT0gbnVsbCAmJiBhdHRhY2tlciBpcyBQbGF5ZXJDaGFyYWN0ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQbGF5ZXJDaGFyYWN0ZXIgUEMgPSAoUGxheWVyQ2hhcmFjdGVyKWF0dGFja2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1BDLnBsYXllci5TY29yZSArPSAoKElDb21iYXRhbnQpZW50aXR5KS5Qb2ludHNGb3JLaWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQQy5zY29yZSArPSAoKElDb21iYXRhbnQpZW50aXR5KS5Qb2ludHNGb3JLaWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQQy5vbktpbGwoKChJQ29tYmF0YW50KWVudGl0eSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgRW50aXR5IEVudGl0eUZyb21JRChzdHJpbmcgSUQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgZW50aXRpZXMuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEVudGl0eSBFID0gZW50aXRpZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoRS5JRCA9PSBJRClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgZnJlZWNhbSA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZUNhbWVyYSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL2Zsb2F0IEQgPSB0ZXN0LkhzcGVlZCAqIDE4O1xyXG4gICAgICAgICAgICAvL2Zsb2F0IEQgPSAoZmxvYXQpTWF0aC5BYnModGVzdC5Ic3BlZWQpICogOTtcclxuICAgICAgICAgICAgLy92YXIgZnJlZWNhbSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNhbWVyYS5zcGVlZG1vZCA9IDFmO1xyXG5cclxuICAgICAgICAgICAgLyppZiAoS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlRhcHBlZEJ1dHRvbnMuQ29udGFpbnNCKDY3KSAmJiBBcHAuREVCVUcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZyZWVjYW0gPSAhZnJlZWNhbTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIGlmIChmcmVlY2FtKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3BkID0gMTYgLyBjYW1lcmEuU2NhbGU7XHJcbiAgICAgICAgICAgICAgICB2YXIgUEIgPSBLZXlib2FyZE1hbmFnZXIuX3RoaXMuUHJlc3NlZEJ1dHRvbnM7XHJcbiAgICAgICAgICAgICAgICAvL251bXBhZCBwYW5uaW5nXHJcbiAgICAgICAgICAgICAgICBpZiAoQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuQ29udGFpbnNCPGludD4oUEIsIDEwMCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLlRhcmdldFBvc2l0aW9uLlggLT0gc3BkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkNvbnRhaW5zQjxpbnQ+KFBCLCAxMDIpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5UYXJnZXRQb3NpdGlvbi5YICs9IHNwZDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuQ29udGFpbnNCPGludD4oUEIsIDEwNCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLlRhcmdldFBvc2l0aW9uLlkgLT0gc3BkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkNvbnRhaW5zQjxpbnQ+KFBCLCA5OCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLlRhcmdldFBvc2l0aW9uLlkgKz0gc3BkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkNvbnRhaW5zQjxpbnQ+KFBCLCAxMDcpKS8vbnVtcGFkK1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBDQyA9IGNhbWVyYS5DZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLlNjYWxlICo9IDEuMDFmO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5DZW50ZXIgPSBDQztcclxuICAgICAgICAgICAgICAgICAgICBjYW1lcmEuVGFyZ2V0UG9zaXRpb24uWCA9IGNhbWVyYS5Qb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5UYXJnZXRQb3NpdGlvbi5ZID0gY2FtZXJhLlBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuQ29udGFpbnNCPGludD4oUEIsIDEwOSkpLy9udW1wYWQtXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIENDID0gY2FtZXJhLkNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBjYW1lcmEuU2NhbGUgKj0gMC45OWY7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLkNlbnRlciA9IENDO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5UYXJnZXRQb3NpdGlvbi5YID0gY2FtZXJhLlBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLlRhcmdldFBvc2l0aW9uLlkgPSBjYW1lcmEuUG9zaXRpb24uWTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChDaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Db250YWluc0I8aW50PihQQiwgMzYpKS8vaG9tZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5DZW50ZXJlZFRhcmdldFBvc2l0aW9uID0gcGxheWVyLlBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkNvbnRhaW5zQjxpbnQ+KFBCLCAxMykpLy9lbnRlclxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5Qb3NpdGlvbi5YID0gY2FtZXJhLkNlbnRlci5YO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5Qb3NpdGlvbi5ZID0gY2FtZXJhLkNlbnRlci5ZO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FtZXJhLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnNwZWVkbW9kID0gMC4wNWY7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FtZXJhLlRhcmdldFBvc2l0aW9uID09IG51bGwgfHwgY2FtZXJhLlBvc2l0aW9uLkVzdGltYXRlZERpc3RhbmNlKGNhbWVyYS5UYXJnZXRQb3NpdGlvbikgPCA0MClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5SYW5kb20oKSA8IDAuMDAzNSB8fCBjYW1lcmEuaW5zdGF3YXJwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FtZXJhLkNlbnRlcmVkVGFyZ2V0UG9zaXRpb24gPSBNYXBSb29tLkZpbmRBbnlFbXB0eVNwb3QoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvKmNhbWVyYS5UYXJnZXRQb3NpdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FtZXJhV2FuZGVyUG9pbnQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYW1lcmFXYW5kZXJQb2ludCA9IE1hcFJvb20uRmluZEFueUVtcHR5U3BvdCgpO1xyXG4gICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgICAgICBjYW1lcmEuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmcmVlY2FtKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlByZXNzZWRCdXR0b25zLkNvbnRhaW5zKDEwMSkgfHwgS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlByZXNzZWRCdXR0b25zLkNvbnRhaW5zKDExMSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIFRFU1QgPSBSb29tT3BlbmluZ0xldmVyLlRFU1Q7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEtleWJvYXJkTWFuYWdlci5fdGhpcy5QcmVzc2VkQnV0dG9ucy5Db250YWlucygxMDYpICYmICFURVNULkFjdGl2YXRlZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRFU1QuQWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFRFU1QgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghVEVTVC5BY3RpdmF0ZWQgJiYgIUtleWJvYXJkTWFuYWdlci5fdGhpcy5QcmVzc2VkQnV0dG9ucy5Db250YWlucygxMTEpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW1lcmEuQ2VudGVyZWRUYXJnZXRQb3NpdGlvbiA9IFRFU1QuUG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgVCA9IFRNLkdldFRpbGUoVEVTVC5Sb29tLlNYLCBURVNULlJvb20uU1kpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIEhCID0gVC5HZXRIaXRib3goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbWVyYS5DZW50ZXJlZFRhcmdldFBvc2l0aW9uID0gbmV3IFZlY3RvcjIoSEIubGVmdCwgSEIudG9wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlRhcHBlZEJ1dHRvbnMuQ29udGFpbnMoMzIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuUG9zaXRpb24uWCA9IGNhbWVyYS5DZW50ZXIuWDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5Qb3NpdGlvbi5ZID0gY2FtZXJhLkNlbnRlci5ZO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbWVyYS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuTVNHLkNoYW5nZVRleHQoXCJObyBsZXZlciBvbiBtYXBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwbGF5ZXIuSFAgPCAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBmbG9hdCBEID0gKGZsb2F0KXBsYXllci5Ic3BlZWQgKiAzMjtcclxuICAgICAgICAgICAgdmFyIEggPSBjYW1lcmEuQ2FtZXJhQm91bmRzLndpZHRoIC8gODtcclxuICAgICAgICAgICAgRCArPSAhcGxheWVyLkFuaS5GbGlwcGVkID8gSCA6IC1IO1xyXG4gICAgICAgICAgICB2YXIgQyA9IEFwcC5DYW52YXM7XHJcbiAgICAgICAgICAgIHZhciBJUyA9IGNhbWVyYS5JbnZTY2FsZTtcclxuICAgICAgICAgICAgZmxvYXQgViA9IE1hdGguTWF4KDAsIHBsYXllci5Wc3BlZWQgKiAzMCk7XHJcbiAgICAgICAgICAgIGlmIChwbGF5ZXIuQ29udHJvbGxlclsyXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgViAtPSBjYW1lcmEuQ2FtZXJhQm91bmRzLmhlaWdodCAvIDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocGxheWVyLkNvbnRyb2xsZXJbM10pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFYgKz0gY2FtZXJhLkNhbWVyYUJvdW5kcy5oZWlnaHQgLyA0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBsYXllci5vbkdyb3VuZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9WIC09IGNhbWVyYS5DYW1lcmFCb3VuZHMuaGVpZ2h0IC8gODtcclxuICAgICAgICAgICAgICAgIFYgLT0gY2FtZXJhLkNhbWVyYUJvdW5kcy5oZWlnaHQgLyAxMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFYgKz0gY2FtZXJhLkNhbWVyYUJvdW5kcy5oZWlnaHQgLyAxMjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIFRQID0gY2FtZXJhLlRhcmdldFBvc2l0aW9uO1xyXG4gICAgICAgICAgICAvKlRQLlggPSAodGVzdC54ICsgRCkgLSAoKEMuV2lkdGggLyAyKSAqIElTKTtcclxuICAgICAgICAgICAgVFAuWSA9IChmbG9hdClNYXRoLk1heCgwLCAodGVzdC55ICsgVikgLSAoKEMuSGVpZ2h0IC8gMikgKiBJUykpOyovXHJcbiAgICAgICAgICAgIC8qVFAuWCA9IHRlc3QueDtcclxuICAgICAgICAgICAgVFAuWSA9IHRlc3QueTsqL1xyXG4gICAgICAgICAgICB2YXIgWCA9IHBsYXllci54ICsgKHBsYXllci5XaWR0aCAvIDIpICsgRDtcclxuICAgICAgICAgICAgdmFyIFkgPSBwbGF5ZXIueSArIChwbGF5ZXIuSGVpZ2h0IC8gMikgKyBWO1xyXG4gICAgICAgICAgICBjYW1lcmEuQ2VudGVyZWRUYXJnZXRQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKFgsIFkpO1xyXG4gICAgICAgICAgICBjYW1lcmEuVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXdCYWNrZ3JvdW5kKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZy5GaWxsU3R5bGUgPSBcIiM3N0FBRkZcIjtcclxuICAgICAgICAgICAgZy5GaWxsUmVjdCgwLCAwLCBBcHAuQ2FudmFzLldpZHRoLCBBcHAuQ2FudmFzLkhlaWdodCk7XHJcbiAgICAgICAgICAgIC8qaWYgKEJHIDwgMCB8fCBCRyA+PSBCR3MuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGcuRmlsbFN0eWxlID0gXCIjNzdBQUZGXCI7XHJcbiAgICAgICAgICAgICAgICBnLkZpbGxSZWN0KDAsIDAsIEFwcC5DYW52YXMuV2lkdGgsIEFwcC5DYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGcuRHJhd0ltYWdlKEJHc1tCR10sIChmbG9hdCkwLCAoZmxvYXQpMCk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGVDb250cm9scygpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgdmFyIFBDID0gcGxheWVyO1xyXG4gICAgICAgICAgICBmbG9hdCB0aHJlc2hob2xkID0gMC43ZjtcclxuICAgICAgICAgICAgYm9vbFtdIEMgPSBQQy5Db250cm9sbGVyO1xyXG4gICAgICAgICAgICB2YXIgSUMgPSBBcHAuSUM7XHJcblxyXG4gICAgICAgICAgICBpZiAoSUMgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZsb2F0IHggPSBJQy5nZXRTdGF0ZSgwKTtcclxuICAgICAgICAgICAgZmxvYXQgeSA9IElDLmdldFN0YXRlKDEpO1xyXG4gICAgICAgICAgICBDWzBdID0geCA8PSAtdGhyZXNoaG9sZDtcclxuICAgICAgICAgICAgQ1sxXSA9IHggPj0gdGhyZXNoaG9sZDtcclxuICAgICAgICAgICAgQ1syXSA9IHkgPD0gLXRocmVzaGhvbGQ7XHJcbiAgICAgICAgICAgIENbM10gPSB5ID49IHRocmVzaGhvbGQ7XHJcblxyXG4gICAgICAgICAgICBzdHJpbmcgY2lkID0gSUMuZ2V0TWFwQ29udHJvbGxlcklEKDUpO1xyXG4gICAgICAgICAgICBpZiAoY2lkID09IFwiS2V5Ym9hcmRcIiB8fCBjaWQgPT0gXCJNb3VzZVwiKVxyXG4gICAgICAgICAgICAvL2lmIChJQy5pZCA9PSBcIktleWJvYXJkXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vLy9QQy5BaW1BdChHZXRNb3VzZSgpKTtcclxuICAgICAgICAgICAgICAgIC8qQ1s0XSA9IEtleWJvYXJkTWFuYWdlci5fdGhpcy5QcmVzc2VkTW91c2VCdXR0b25zLkNvbnRhaW5zKDApO1xyXG4gICAgICAgICAgICAgICAgQ1s1XSA9IEtleWJvYXJkTWFuYWdlci5fdGhpcy5QcmVzc2VkTW91c2VCdXR0b25zLkNvbnRhaW5zKDIpOyovXHJcbiAgICAgICAgICAgICAgICBDWzRdID0gSUMuZ2V0UHJlc3NlZCgyKTtcclxuICAgICAgICAgICAgICAgIENbNV0gPSBJQy5nZXRQcmVzc2VkKDMpO1xyXG4gICAgICAgICAgICAgICAgQ1s2XSA9IElDLmdldFByZXNzZWQoNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvKkdhbWVQYWQgUCA9IEdhbWVQYWRNYW5hZ2VyLl90aGlzLkdldFBhZChJQy5pZCk7XHJcbiAgICAgICAgICAgICAgICBQQy5haW1BbmdsZSA9IG5ldyBWZWN0b3IyKChmbG9hdClQLmF4ZXNbMl0sIChmbG9hdClQLmF4ZXNbM10pLlRvQW5nbGUoKTsqL1xyXG4gICAgICAgICAgICAgICAgVmVjdG9yMiBhaW0gPSBuZXcgVmVjdG9yMihJQy5nZXRTdGF0ZSg0KSwgSUMuZ2V0U3RhdGUoNSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFpbS5Sb3VnaExlbmd0aCA+IDAuNSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLy8vUEMuYWltQW5nbGUgPSBhaW0uVG9BbmdsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQ1s0XSA9IElDLmdldFByZXNzZWQoMik7XHJcbiAgICAgICAgICAgIENbNV0gPSBJQy5nZXRQcmVzc2VkKDMpO1xyXG4gICAgICAgICAgICBDWzZdID0gSUMuZ2V0UHJlc3NlZCg0KTtcclxuICAgICAgICAgICAgLypDWzRdID0gSUMuZ2V0UHJlc3NlZCgzKTtcclxuICAgICAgICAgICAgQ1s1XSA9IElDLmdldFByZXNzZWQoNCk7Ki9cclxuXHJcbiAgICAgICAgICAgIG9iamVjdCBvID0gbmV3IG9iamVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIGNsYXNzIEhlYWxpbmdJdGVtIDogQ29sbGVjdGFibGVJdGVtXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEhlYWxpbmdJdGVtKEdhbWUgZ2FtZSkgOiBiYXNlKGdhbWUsIFwiaGVhcnRcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBtYWduZXREaXN0YW5jZSA9IDIwO1xyXG4gICAgICAgICAgICBzb3VuZCA9IFwib2tcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGJvb2wgQ2FuQ29sbGVjdChQbGF5ZXJDaGFyYWN0ZXIgcGxheWVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBsYXllci5IUCA8IHBsYXllci5tYXhIUDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIG9uQ29sbGVjdGVkKFBsYXllckNoYXJhY3RlciBwbGF5ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbGF5ZXIuSFAgPSBNYXRoLk1pbihwbGF5ZXIuSFAgKyAxLCBwbGF5ZXIubWF4SFApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBLZXlJdGVtIDogQ29sbGVjdGFibGVJdGVtXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEtleUl0ZW0oR2FtZSBnYW1lKSA6IGJhc2UoZ2FtZSwgXCJrZXlcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBtYWduZXREaXN0YW5jZSA9IDIwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYm9vbCBDYW5Db2xsZWN0KFBsYXllckNoYXJhY3RlciBwbGF5ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gcGxheWVyLmtleXMgPCA1O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgb25Db2xsZWN0ZWQoUGxheWVyQ2hhcmFjdGVyIHBsYXllcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsYXllci5rZXlzKys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFBsYXRmb3JtZXJFbnRpdHkgOiBDb250cm9sbGFibGVFbnRpdHlcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgZnJpY3Rpb24gPSAwLjVmO1xyXG4gICAgICAgIHB1YmxpYyBib29sIG9uR3JvdW5kO1xyXG4gICAgICAgIHB1YmxpYyBib29sIEdyYXZpdHlFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAvL3B1YmxpYyBmbG9hdCBncmF2aXR5ID0gMS42ZjtcclxuICAgICAgICAvL3B1YmxpYyBmbG9hdCBncmF2aXR5ID0gMC45ZjtcclxuICAgICAgICAvL3B1YmxpYyBmbG9hdCBncmF2aXR5ID0gMC4wMTc1ZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgZ3Jhdml0eSA9IDAuMDJmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBtYXhGYWxsU3BlZWQgPSAyLjBmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBmZWV0cG9zaXRpb24gPSAyMztcclxuICAgICAgICAvL3B1YmxpYyBmbG9hdCBoZWFkcG9zaXRpb24gPSA0O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBoZWFkcG9zaXRpb24gPSA3O1xyXG5cclxuICAgICAgICBwdWJsaWMgVGlsZURhdGEgRmxvb3I7XHJcbiAgICAgICAgcHVibGljIFRpbGVEYXRhIENlaWxpbmc7XHJcblxyXG4gICAgICAgIHB1YmxpYyBUaWxlRGF0YSBMZWZ0V2FsbDtcclxuICAgICAgICBwdWJsaWMgVGlsZURhdGEgUmlnaHRXYWxsO1xyXG5cclxuXHJcbiAgICAgICAgcHVibGljIFBsYXRmb3JtZXJFbnRpdHkoR2FtZSBnYW1lKSA6IGJhc2UoZ2FtZSlcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKEdyYXZpdHlFbmFibGVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVnNwZWVkIDwgbWF4RmFsbFNwZWVkICYmIEdyYXZpdHlFbmFibGVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFZzcGVlZCA9IChmbG9hdClNYXRoLk1pbihWc3BlZWQgKyBncmF2aXR5LCBtYXhGYWxsU3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qaWYgKHkgPiAwICYmIFZzcGVlZD49MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IDA7XHJcbiAgICAgICAgICAgICAgICBWc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgb25Hcm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5IDwgMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb25Hcm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIEFwcGx5RnJpY3Rpb24oKTtcclxuICAgICAgICAgICAgVXBkYXRlVGVycmFpbkNvbGxpc2lvbigpO1xyXG5cclxuICAgICAgICAgICAgb25Hcm91bmQgPSAoRmxvb3IgIT0gbnVsbCAmJiBWc3BlZWQgPj0gMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAob25Hcm91bmQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0IFkgPSBGbG9vci5HZXRUb3AoZ2V0Q2VudGVyKCkpIC0gZmVldHBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgLyppZiAoeSA8IFkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25Hcm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBGbG9vciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlKi9cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3kgPSAoKEZsb29yLnJvdyAqIEdhbWUuVE0udGlsZXNpemUpICsgR2FtZS5UTS5wb3NpdGlvbi5ZKSAtIGZlZXRwb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB5ID0gWTtcclxuICAgICAgICAgICAgICAgICAgICBWc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG9uR3JvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQ2VpbGluZyAhPSBudWxsICYmIFZzcGVlZCA8IDAvKiAmJiAhQ2VpbGluZy5wbGF0Zm9ybSovKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBWc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgeSA9ICgoQ2VpbGluZy5yb3cgKiBHYW1lLlRNLnRpbGVzaXplKSArIEdhbWUuVE0ucG9zaXRpb24uWSkgKyBHYW1lLlRNLnRpbGVzaXplIC0gaGVhZHBvc2l0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChMZWZ0V2FsbCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIc3BlZWQgPSBNYXRoLk1heCgwLCBIc3BlZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChSaWdodFdhbGwgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSHNwZWVkID0gTWF0aC5NaW4oMCwgSHNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBBcHBseUZyaWN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhzcGVlZCA9IChmbG9hdClNYXRoSGVscGVyLkRlY2VsZXJhdGUoSHNwZWVkLCBmcmljdGlvbik7XHJcbiAgICAgICAgICAgIGlmICghR3Jhdml0eUVuYWJsZWQpXHJcbiAgICAgICAgICAgICAgICBWc3BlZWQgPSAoZmxvYXQpTWF0aEhlbHBlci5EZWNlbGVyYXRlKFZzcGVlZCwgZnJpY3Rpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIFRpbGVEYXRhIEdldEZsb29yKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBudWxsO1xyXG4gICAgICAgICAgICBmbG9hdCBXID0gV2lkdGggLyAzO1xyXG4gICAgICAgICAgICBmbG9hdCBZID0gSGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoVmVjdG9yMi5BZGQoUG9zaXRpb24sIFdpZHRoIC8gMiwgWSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgVywgWSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgV2lkdGggLSBXLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBUaWxlRGF0YSBHZXRDZWlsaW5nKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBudWxsO1xyXG4gICAgICAgICAgICBmbG9hdCBXID0gV2lkdGggLyAzO1xyXG4gICAgICAgICAgICAvL2Zsb2F0IFkgPSAxNjtcclxuICAgICAgICAgICAgZmxvYXQgWSA9IDAgKyBoZWFkcG9zaXRpb247XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC5ib3R0b21Tb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgVywgWSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC5ib3R0b21Tb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgV2lkdGggLSBXLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULmJvdHRvbVNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBUaWxlRGF0YSBDaGVja1dhbGwoZmxvYXQgWClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBudWxsO1xyXG4gICAgICAgICAgICAvKmlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgKChULmxlZnRTb2xpZCAmJiBYID4gMCkgfHwgKFQucmlnaHRTb2xpZCAmJiBYIDwgMCkpKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFBvc2l0aW9uICsgbmV3IFZlY3RvcjIoWCwgKEhlaWdodCAvIDIpLTIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmICgoVC5sZWZ0U29saWQgJiYgWCA+IDApIHx8IChULnJpZ2h0U29saWQgJiYgWCA8IDApKSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShQb3NpdGlvbiArIG5ldyBWZWN0b3IyKFgsIEhlaWdodC0yKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoVCAhPSBudWxsICYmIFQuSXNTbG9wZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmICgoVC5sZWZ0U29saWQgJiYgWCA+IDApIHx8IChULnJpZ2h0U29saWQgJiYgWCA8IDApKSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBudWxsO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgaWYgKCFJc1RpbGVPYnN0YWNsZShULCBYKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBYLCAoSGVpZ2h0IC8gMikgLSAyKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFJc1RpbGVPYnN0YWNsZShULCBYKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBYLCBIZWlnaHQgLSAyKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFJc1RpbGVPYnN0YWNsZShULCBYKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBib29sIElzVGlsZU9ic3RhY2xlKFRpbGVEYXRhIFQsIGZsb2F0IFgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiAoKFQubGVmdFNvbGlkICYmIFggPiAwKSB8fCAoVC5yaWdodFNvbGlkICYmIFggPCAwKSkgJiYgKEZsb29yID09IG51bGwgfHwgVC5yb3cgPCBGbG9vci5yb3cpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBZID0geSArIEhlaWdodDtcclxuICAgICAgICAgICAgICAgIC8vaWYgKFQuR2V0SGl0Ym94KCkueSA8IFktMjgpXHJcbiAgICAgICAgICAgICAgICAvL2lmIChULkdldEhpdGJveCgpLnkgPCBZIC0gOClcclxuICAgICAgICAgICAgICAgIC8vaWYgKFQuR2V0SGl0Ym94KCkueSA8IFkgLSA0KVxyXG4gICAgICAgICAgICAgICAgaWYgKFQuR2V0SGl0Ym94KCkueSA8IFkgLSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhVC5Jc1Nsb3BlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgVXBkYXRlVGVycmFpbkNvbGxpc2lvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBGbG9vciA9IEdldEZsb29yKCk7XHJcbiAgICAgICAgICAgIENlaWxpbmcgPSBHZXRDZWlsaW5nKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKFZzcGVlZCA8IG1heEZhbGxTcGVlZCAmJiBHcmF2aXR5RW5hYmxlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVnNwZWVkID0gKGZsb2F0KU1hdGguTWluKFZzcGVlZCArIGdyYXZpdHksIG1heEZhbGxTcGVlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYm9vbCBzdHVjayA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoRmxvb3IgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYm9vbCBjID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBGbG9vci5HZXRUaWxlRGF0YSgwLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC5zb2xpZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZsb29yID0gVDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R1Y2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0dWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG9uR3JvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChGbG9vciAhPSBudWxsICYmIFZzcGVlZCA+PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2Zsb2F0IFkgPSBGbG9vci5HZXRIaXRib3goKS50b3AgLSBIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBZID0gRmxvb3IuR2V0VG9wKGdldENlbnRlcigpKSAtIEhlaWdodDtcclxuICAgICAgICAgICAgICAgIC8vaWYgKCFGbG9vci5wbGF0Zm9ybSB8fCB5IDw9IFkgKyBWc3BlZWQpXHJcbiAgICAgICAgICAgICAgICAvL2lmICghRmxvb3IucGxhdGZvcm0gfHwgeStWc3BlZWQ+PVkpXHJcbiAgICAgICAgICAgICAgICBpZiAoKCFGbG9vci5wbGF0Zm9ybSB8fCB5IDw9IFkgKyBWc3BlZWQpICYmIHkgKyAoVnNwZWVkICsgMTApID49IFkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFZzcGVlZCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkdyb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHkgPSBZO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChIc3BlZWQgIT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgd2FsbCA9IEhzcGVlZCA+IDAgPyBSaWdodFdhbGwgOiBMZWZ0V2FsbDtcclxuICAgICAgICAgICAgICAgIGlmICh3YWxsICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgSHNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmbG9hdCBXID0gV2lkdGggLyAzO1xyXG4gICAgICAgICAgICBmbG9hdCBYID0gKGZsb2F0KU1hdGguQWJzKEhzcGVlZCk7XHJcbiAgICAgICAgICAgIGlmIChIc3BlZWQgPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBYIC09IDIgLSBXO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWCArPSAoV2lkdGggLSBXKSArIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgUmlnaHRXYWxsID0gQ2hlY2tXYWxsKFgpO1xyXG5cclxuICAgICAgICAgICAgWCA9IChmbG9hdCktTWF0aC5BYnMoSHNwZWVkKTtcclxuICAgICAgICAgICAgaWYgKEhzcGVlZCA8IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFggLT0gMiAtIFc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBYICs9IChXaWR0aCAtIFcpICsgMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBMZWZ0V2FsbCA9IENoZWNrV2FsbChYKTtcclxuICAgICAgICAgICAgaWYgKExlZnRXYWxsICE9IG51bGwgJiYgTGVmdFdhbGwgPT0gUmlnaHRXYWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZWN0YW5nbGUgUiA9IExlZnRXYWxsLkdldEhpdGJveCgpO1xyXG4gICAgICAgICAgICAgICAgVmVjdG9yMiBWID0gUi5DZW50ZXI7XHJcbiAgICAgICAgICAgICAgICBpZiAoKFYgLSBQb3NpdGlvbikuWCA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgeCArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChIc3BlZWQgPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgSHNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgeCAtPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChIc3BlZWQgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgSHNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHN0dWNrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBVcGRhdGVUZXJyYWluQ29sbGlzaW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgT3JiIDogQ29sbGVjdGFibGVJdGVtXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIE9yYihHYW1lIGdhbWUpIDogYmFzZShnYW1lLCBcIm9yYlwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9BbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5HZXQoXCJpbWFnZXMvbWlzYy9vcmJcIikpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgb25Db2xsZWN0ZWQoUGxheWVyQ2hhcmFjdGVyIHBsYXllcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIHZhciB0aW1lID0gKDEwMDApICogMjA7XHJcbiAgICAgICAgICAgIGlmIChHYW1lLnRpbWVSZW1haW5pbmcgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBHYW1lLnRpbWVSZW1haW5pbmcgKz0gdGltZTtcclxuICAgICAgICAgICAgICAgIEdhbWUudGltZVJlbWFpbmluZyA9IE1hdGguTWluKEdhbWUubWF4VGltZVJlbWFpbmluZywgR2FtZS50aW1lUmVtYWluaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEdhbWUudGltZVJlbWFpbmluZyArPSB0aW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qcHVibGljIG92ZXJyaWRlIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChHYW1lLnBsYXllci5Qb3NpdGlvbi5Fc3RpbWF0ZWREaXN0YW5jZShQb3NpdGlvbikgPCAzNSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIFAgPSBHYW1lLnBsYXllci5Qb3NpdGlvbiAtIFBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxuID0gUC5MZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3BkID0gODtcclxuICAgICAgICAgICAgICAgIFAgPSBQLk5vcm1hbGl6ZShzcGQgLyBNYXRoLk1heCgxLGxuKSk7XHJcbiAgICAgICAgICAgICAgICB4ICs9IFAuWDtcclxuICAgICAgICAgICAgICAgIHkgKz0gUC5ZO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxuIDw9IHNwZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgfSovXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUG9pbnRJdGVtIDogQ29sbGVjdGFibGVJdGVtXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFBvaW50SXRlbShHYW1lIGdhbWUpIDogYmFzZShnYW1lLCBcInBvaW50XCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgLy9tYWduZXREaXN0YW5jZSA9IDEwMDtcclxuICAgICAgICAgICAgbWFnbmV0RGlzdGFuY2UgPSA3MDtcclxuICAgICAgICAgICAgbWFnbmV0U3BlZWQgKj0gODtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgb25Db2xsZWN0ZWQoUGxheWVyQ2hhcmFjdGVyIHBsYXllcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsYXllci5zY29yZSArPSA1O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNUkdob3N0eSA6IFBsYXRmb3JtZXJFbnRpdHksIElDb21iYXRhbnQsIElIYXJtZnVsRW50aXR5XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBhbmltYXRpb24gPSBcIj8/P1wiO1xyXG5cclxuICAgICAgICBwdWJsaWMgaW50IFRlYW0geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgSFAgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaW50IFBvaW50c0ZvcktpbGxpbmdcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGZsb2F0IFRhcmdldFByaW9yaXR5XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIElzSGFybWZ1bFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgRW50aXR5IEF0dGFja2VyXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB0b3VjaERhbWFnZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhdHRhY2twb3dlcioxLjVmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBhdHRhY2twb3dlciA9IDE7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGRlZmVuc2Vwb3dlciA9IDE7XHJcblxyXG4gICAgICAgIHB1YmxpYyBNUkdob3N0eShHYW1lIGdhbWUpIDogYmFzZShnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2hhbmdlQW5pKFwiXCIpO1xyXG4gICAgICAgICAgICBBZGRCZWhhdmlvcihuZXcgRmxpZ2h0Q29udHJvbHModGhpcykpO1xyXG4gICAgICAgICAgICBBZGRCZWhhdmlvcihuZXcgUmFuZG9tQUkodGhpcykpO1xyXG4gICAgICAgICAgICBhdHRhY2twb3dlciA9IDEgKyAoR2FtZS5sZXZlbCAqIDAuNWYpO1xyXG4gICAgICAgICAgICBkZWZlbnNlcG93ZXIgPSAxICsgKEdhbWUubGV2ZWwgKiAwLjVmKTtcclxuICAgICAgICAgICAgaWYgKEdhbWUucGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQWRkQmVoYXZpb3I8QWltZWRTaG9vdGVyPigpO1xyXG4gICAgICAgICAgICAgICAgR2V0QmVoYXZpb3I8QWltZWRTaG9vdGVyPigpLmF0dGFja3Bvd2VyID0gYXR0YWNrcG93ZXI7XHJcbiAgICAgICAgICAgICAgICBHZXRCZWhhdmlvcjxBaW1lZFNob290ZXI+KCkubWF4dGltZSA9IE1hdGguTWF4KDQ4MCAtIChHYW1lLmxldmVsICogMTApLCAzODApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEdldEJlaGF2aW9yPEZsaWdodENvbnRyb2xzPigpLm1heFNwZWVkICo9IDAuNWY7XHJcblxyXG4gICAgICAgICAgICBHcmF2aXR5RW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBUZWFtID0gMjtcclxuICAgICAgICAgICAgSFAgPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgQW5pLkZsaXBwZWQgPSAoSHNwZWVkIDwgMCk7XHJcbiAgICAgICAgICAgIEFuaS5JbWFnZVNwZWVkID0gKGZsb2F0KSgoTWF0aC5BYnMoSHNwZWVkKSArIE1hdGguQWJzKFZzcGVlZCkpICogMC4xMjUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQ2hhbmdlQW5pKHN0cmluZyBhbmltYXRpb24sIGJvb2wgcmVzZXQgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGlvbiA9PSBhbmltYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQW5pID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFuaSA9IG5ldyBBbmltYXRpb24oQW5pbWF0aW9uTG9hZGVyLkdldChcImltYWdlcy9lbmVtaWVzL21yZ2hvc3RcIiArIGFuaW1hdGlvbikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQW5pLkNoYW5nZUFuaW1hdGlvbihBbmltYXRpb25Mb2FkZXIuR2V0KFwiaW1hZ2VzL2VuZW1pZXMvbXJnaG9zdFwiICsgYW5pbWF0aW9uKSwgcmVzZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgb25EYW1hZ2VkKElIYXJtZnVsRW50aXR5IHNvdXJjZSwgZmxvYXQgYW1vdW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy90aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgLy9pZiAoIShzb3VyY2UgaXMgTVJHaG9zdHkpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIUCAtPSAoYW1vdW50IC8gZGVmZW5zZXBvd2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKmVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSGVscGVyLkxvZyhcImdob3N0cyBhcmUgYWxsZXJnaWMgdG8gdGhlbXNlbHZlcz8/P1wiKTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBvbkRlYXRoKElIYXJtZnVsRW50aXR5IHNvdXJjZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIEFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIENvbGxlY3RhYmxlSXRlbSBQID0gbmV3IFBvaW50SXRlbShHYW1lKTtcclxuICAgICAgICAgICAgUC5Qb3NpdGlvbi5Db3B5RnJvbShQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIFAuY29sbGVjdGlvbkRlbGF5IC89IDI7XHJcbiAgICAgICAgICAgIEdhbWUuQWRkRW50aXR5KFApO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5SYW5kb20oKSA8IDAuMTUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFAgPSBuZXcgSGVhbGluZ0l0ZW0oR2FtZSk7XHJcbiAgICAgICAgICAgICAgICBQLlBvc2l0aW9uLkNvcHlGcm9tKFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIFAuVnNwZWVkID0gLTI7XHJcbiAgICAgICAgICAgICAgICBQLmNvbGxlY3Rpb25EZWxheSAvPSAyO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5HYW1lLkFkZEVudGl0eShQKTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIG9uS2lsbChJQ29tYmF0YW50IGNvbWJhdGFudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBvbnRvdWNoRGFtYWdlKElDb21iYXRhbnQgdGFyZ2V0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy90aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFBsYXllckNoYXJhY3RlciA6IFBsYXRmb3JtZXJFbnRpdHksIElDb21iYXRhbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIGFuaW1hdGlvbiA9IFwiPz8/XCI7XHJcbiAgICAgICAgcHVibGljIGludCBzaG9vdHRpbWUgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgcHJlZml4ID0gXCJcIjtcclxuICAgICAgICBwcml2YXRlIGJvb2wgbmV3SW5wdXQ7XHJcbiAgICAgICAgcHVibGljIGludFtdIHRhcFRpbWVyO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgc2hvb3RSZWNoYXJnZSA9IDA7XHJcbiAgICAgICAgcHVibGljIGludCB0dXJudGltZSA9IDA7Ly90aGUgYW1vdW50IG9mIHRpbWUgdGhlIHVzZXIgaGFzIGJlZW4gbW92aW5nIG5vcm1hbGx5L3N0YW5kaW5nIHN0aWxsLCBpZiBsb25nIGVub3VnaCB0aGUgY2hhcmFjdGVyIHdpbGwgdHVybiBub3JtYWxseS5cclxuICAgICAgICBwdWJsaWMgaW50IHNjb3JlID0gMDtcclxuICAgICAgICBwdWJsaWMgaW50IG9yYnMgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBpbnQga2V5cyA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbnQgVGVhbSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBtYXhIUCA9IDIwO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBIUCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgU3Bhd25Mb2NhdGlvbiA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgcHVibGljIGludCBsaXZlcyA9IDM7XHJcbiAgICAgICAgcHVibGljIGludCBmcmFtZSA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBkaWdwb3dlciA9IDEuMGY7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGF0dGFja3Bvd2VyID0gMWY7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGRlZmVuc2Vwb3dlciA9IDFmO1xyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgaW52aW5jaWJpbGl0eXRpbWUgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBibG9ja3ByaWNlID0gOWY7XHJcblxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBpbnZpbmNpYmlsaXR5bW9kID0gMWY7XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbnQgY3VycmVudHNob3QgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgc2hvdGRlbGF5ID0gNTtcclxuICAgICAgICBwdWJsaWMgaW50IGN1cnJlbnRzaG90ZGVsYXkgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgdG90YWxzaG90cyA9IDE7Ly9udW1iZXIgb2Ygc2hvdHMgcGVyIGNvbW1hbmRcclxuXHJcbiAgICAgICAgcHVibGljIEZsb2F0aW5nTWVzc2FnZSBNU0c7XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgaW50IFBvaW50c0ZvcktpbGxpbmdcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMzAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgVGFyZ2V0UHJpb3JpdHlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMC43ZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBNb3ZlVG9OZXdTcGF3bihWZWN0b3IyIE5ld1NwYXduTG9jYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTcGF3bkxvY2F0aW9uLkNvcHlGcm9tKE5ld1NwYXduTG9jYXRpb24pO1xyXG4gICAgICAgICAgICBQb3NpdGlvbi5Db3B5RnJvbShTcGF3bkxvY2F0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHNob290KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChzaG9vdHRpbWUgPCAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwcmVmaXggPSBcInNcIjtcclxuICAgICAgICAgICAgICAgIENoYW5nZUFuaShwcmVmaXggKyBhbmltYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzaG9vdFJlY2hhcmdlIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRzaG90ID0gMTtcclxuICAgICAgICAgICAgICAgIERvU2hvdCgpO1xyXG4gICAgICAgICAgICAgICAgLy9zaG9vdFJlY2hhcmdlID0gMTI7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRzaG90ZGVsYXkgPSAwO1xyXG4gICAgICAgICAgICAgICAgc2hvb3RSZWNoYXJnZSA9IDIwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2hvb3R0aW1lID0gNTA7XHJcbiAgICAgICAgICAgIHR1cm50aW1lID0gMDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZvaWQgRG9TaG90KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBQQiA9IG5ldyBQbGF5ZXJCdWxsZXQoR2FtZSwgdGhpcywgXCJJbWFnZXMvbWlzYy9jcnlzdGFsXCIpO1xyXG4gICAgICAgICAgICBQQi5Ic3BlZWQgPSBBbmkuRmxpcHBlZCA/IC0yLjVmIDogMi41ZjtcclxuICAgICAgICAgICAgUEIueCA9IHggKyAoQW5pLkZsaXBwZWQgPyAtNCA6IDEyKTtcclxuICAgICAgICAgICAgUEIueSA9IHkgKyAxMDtcclxuICAgICAgICAgICAgaWYgKCFDb250cm9sbGVyWzBdICYmICFDb250cm9sbGVyWzFdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoQ29udHJvbGxlclsyXSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBQQi5Ic3BlZWQgKj0gMC44ZjtcclxuICAgICAgICAgICAgICAgICAgICBQQi5Wc3BlZWQgPSAtKGZsb2F0KU1hdGguQWJzKFBCLkhzcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgUEIuSHNwZWVkICo9IDAuNmY7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChDb250cm9sbGVyWzNdKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFBCLkhzcGVlZCAqPSAwLjhmO1xyXG4gICAgICAgICAgICAgICAgICAgIFBCLlZzcGVlZCA9IChmbG9hdClNYXRoLkFicyhQQi5Ic3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIFBCLkhzcGVlZCAqPSAwLjZmO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKENvbnRyb2xsZXJbMl0pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUEIuSHNwZWVkICo9IDAuOWY7XHJcbiAgICAgICAgICAgICAgICAgICAgUEIuVnNwZWVkID0gLShmbG9hdClNYXRoLkFicyhQQi5Ic3BlZWQgKiAwLjcpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKENvbnRyb2xsZXJbM10pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUEIuSHNwZWVkICo9IDAuOWY7XHJcbiAgICAgICAgICAgICAgICAgICAgUEIuVnNwZWVkID0gKGZsb2F0KU1hdGguQWJzKFBCLkhzcGVlZCAqIDAuNyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgUEIueCAtPSBQQi5Ic3BlZWQ7XHJcbiAgICAgICAgICAgIFBCLnkgLT0gUEIuVnNwZWVkO1xyXG4gICAgICAgICAgICBQQi5hdHRhY2tzdGVycmFpbiA9IGN1cnJlbnRzaG90PT0xO1xyXG4gICAgICAgICAgICBQQi5kaWdwb3dlciA9IChkaWdwb3dlcikgKiAwLjY2NjdmO1xyXG4gICAgICAgICAgICBQQi50b3VjaERhbWFnZSA9IGF0dGFja3Bvd2VyIC8gKCgodG90YWxzaG90cy0xZikvMmYpKzFmKTtcclxuICAgICAgICAgICAgR2FtZS5BZGRFbnRpdHkoUEIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgUGxheWVyQ2hhcmFjdGVyKEdhbWUgZ2FtZSkgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFuZ2VBbmkoXCJzdGFuZFwiKTtcclxuICAgICAgICAgICAgQWRkQmVoYXZpb3IobmV3IFBsYXRmb3JtZXJDb250cm9scyh0aGlzKSk7XHJcbiAgICAgICAgICAgIHRhcFRpbWVyID0gbmV3IGludFtDb250cm9sbGVyLkxlbmd0aF07XHJcbiAgICAgICAgICAgIFRlYW0gPSAwO1xyXG4gICAgICAgICAgICBIUCA9IG1heEhQO1xyXG4gICAgICAgICAgICBNU0cgPSBuZXcgRmxvYXRpbmdNZXNzYWdlKGdhbWUsIFwiXCIpO1xyXG4gICAgICAgICAgICBNU0cuVGV4dC5UZXh0Q29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgLy9NU0cuQ2hhbmdlVGV4dChcImhlbGxvIHdvcmxkXCIpO1xyXG4gICAgICAgICAgICBNU0cuYXV0b2tpbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgZ2FtZS5BZGRFbnRpdHkoTVNHKTtcclxuICAgICAgICAgICAgTVNHLlJlbW92ZWRPbkxldmVsRW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFJlbW92ZWRPbkxldmVsRW5kID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBNU0cuUG9zaXRpb24uWCA9IFBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIE1TRy5Qb3NpdGlvbi5ZID0gUG9zaXRpb24uWS0xMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChzaG9vdHRpbWUgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzaG9vdHRpbWUtLTtcclxuICAgICAgICAgICAgICAgIGlmIChzaG9vdHRpbWUgPCAxKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcIlwiICsgYW5pbWF0aW9uWzBdID09IHByZWZpeClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENoYW5nZUFuaShhbmltYXRpb24uU3Vic3RyaW5nKDEpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2hvb3RSZWNoYXJnZSA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNob290UmVjaGFyZ2UtLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob25Hcm91bmQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChIc3BlZWQgIT0gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VBbmkocHJlZml4ICsgXCJ3YWxrXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vL0FuaS5GbGlwcGVkID0gSHNwZWVkIDwgMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VBbmkocHJlZml4ICsgXCJzdGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEFuaS5JbWFnZVNwZWVkID0gKGZsb2F0KU1hdGguQWJzKEhzcGVlZCAqIDAuMTI1KTtcclxuICAgICAgICAgICAgICAgIC8vQW5pLkltYWdlU3BlZWQgPSBBbmkuRmxpcHBlZCA/IEhzcGVlZCAqIDAuMTI1ZiA6IC1Ic3BlZWQgKiAwLjEyNWY7XHJcbiAgICAgICAgICAgICAgICAvL0FuaS5JbWFnZVNwZWVkID0gKEFuaS5GbGlwcGVkID8gLUhzcGVlZCA6IEhzcGVlZCkgKiAwLjEyNWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDaGFuZ2VBbmkocHJlZml4ICsgXCJqdW1wXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9BbmkuSW1hZ2VTcGVlZCA9IChmbG9hdClNYXRoLkFicyhWc3BlZWQgKiAwLjEyNSk7XHJcbiAgICAgICAgICAgICAgICBBbmkuSW1hZ2VTcGVlZCA9IDAuMTVmICsgKGZsb2F0KSgoTWF0aC5BYnMoSHNwZWVkKSArIE1hdGguQWJzKFZzcGVlZCkpICogMC43KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQW5pLkZsaXBwZWQgIT0gSHNwZWVkIDwgMCB8fCAoSHNwZWVkID09IDAgJiYgb25Hcm91bmQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0dXJudGltZSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHVybnRpbWUgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2lmIChMQ29udHJvbGxlclszXSAhPSBDb250cm9sbGVyWzNdICYmIENvbnRyb2xsZXJbM10pXHJcbiAgICAgICAgICAgIC8qaWYgKFByZXNzZWQoMykgfHwgUHJlc3NlZCg0KSB8fCBQcmVzc2VkKDUpIHx8IFByZXNzZWQoNikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNob290KCk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudHNob3QgPCB0b3RhbHNob3RzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50c2hvdGRlbGF5Kys7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudHNob3RkZWxheSA+PSBzaG90ZGVsYXkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudHNob3RkZWxheSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudHNob3QrKztcclxuICAgICAgICAgICAgICAgICAgICBEb1Nob3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQ29udHJvbGxlcls0XSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHVybnRpbWUgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChQcmVzc2VkKDQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzaG9vdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChQcmVzc2VkKDYpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBQbGFjZUJsb2NrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFVwZGF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgLy9pZiAodHVybnRpbWUgPiAyMiAmJiBIc3BlZWQgIT0gMClcclxuICAgICAgICAgICAgLy9pZiAodHVybnRpbWUgPiAxOCAmJiBIc3BlZWQgIT0gMClcclxuICAgICAgICAgICAgaWYgKHR1cm50aW1lID4gMTQgJiYgSHNwZWVkICE9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFuaS5GbGlwcGVkID0gSHNwZWVkIDwgMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW52aW5jaWJpbGl0eXRpbWUgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL0FuaS5BbHBoYSA9IEFuaS5BbHBoYSA9PSAwID8gMSA6IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGZyYW1lICYgMSkgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIFZpc2libGUgPSAhVmlzaWJsZTtcclxuICAgICAgICAgICAgICAgIGludmluY2liaWxpdHl0aW1lIC09IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBWaXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmcmFtZSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBQbGFjZUJsb2NrKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBwcmljZSA9IDEwMDAgKiBibG9ja3ByaWNlO1xyXG4gICAgICAgICAgICBpZiAoR2FtZS50aW1lUmVtYWluaW5nIDwgYmxvY2twcmljZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZsb2F0IFcgPSBXaWR0aCAvIDM7XHJcbiAgICAgICAgICAgIGZsb2F0IFkgPSBIZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoVmVjdG9yMi5BZGQoUG9zaXRpb24sIFdpZHRoIC8gMiwgWSkpO1xyXG4gICAgICAgICAgICBpZiAoVCAhPSBudWxsICYmICghVC5lbmFibGVkIHx8ICFULnNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVC5zb2xpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBULkJyZWFrYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBULmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gNDtcclxuICAgICAgICAgICAgICAgIFQuVXBkYXRlVGlsZSgpO1xyXG4gICAgICAgICAgICAgICAgVC5IUCA9IFQubWF4SFAgKiAyO1xyXG4gICAgICAgICAgICAgICAgR2FtZS50aW1lUmVtYWluaW5nIC09IHByaWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENoYW5nZUFuaShzdHJpbmcgYW5pbWF0aW9uLCBib29sIHJlc2V0ID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb24gPT0gYW5pbWF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKEFuaSA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5HZXQoXCJpbWFnZXMvY2lybm8vXCIgKyBhbmltYXRpb24pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFuaS5DaGFuZ2VBbmltYXRpb24oQW5pbWF0aW9uTG9hZGVyLkdldChcImltYWdlcy9jaXJuby9cIiArIGFuaW1hdGlvbiksIHJlc2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb24gIT0gXCJzdGFuZFwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0dXJudGltZSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSBhbmltYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZUNvbnRyb2xsZXIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmV3SW5wdXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IENvbnRyb2xsZXIuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0YXBUaW1lcltpXSsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKENvbnRyb2xsZXJbaV0gJiYgIUxDb250cm9sbGVyW2ldKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcFRpbWVyW2ldID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBuZXdJbnB1dCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBMQ29udHJvbGxlcltpXSA9IENvbnRyb2xsZXJbaV07XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyppZiAoX2xBaW1BbmdsZSAhPSBfYWltQW5nbGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5ld0lucHV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfbEFpbUFuZ2xlID0gX2FpbUFuZ2xlOyovXHJcbiAgICAgICAgICAgIGlmIChuZXdJbnB1dClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9HZXRCZWhhdmlvcjxOZXR3b3JrU3luYz4oKS5TeW5jKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIG9uRGFtYWdlZChJSGFybWZ1bEVudGl0eSBzb3VyY2UsIGZsb2F0IGFtb3VudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIGlmIChpbnZpbmNpYmlsaXR5dGltZSA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIUCAtPSAoYW1vdW50IC8gZGVmZW5zZXBvd2VyKTtcclxuICAgICAgICAgICAgICAgIGludmluY2liaWxpdHl0aW1lID0gNDUqaW52aW5jaWJpbGl0eW1vZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBvblJlbW92ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLm9uUmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIEdhbWUuUmVtb3ZlRW50aXR5KE1TRyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBvbkRlYXRoKElIYXJtZnVsRW50aXR5IHNvdXJjZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIGludmluY2liaWxpdHl0aW1lICo9IDNmO1xyXG5cclxuICAgICAgICAgICAgaWYgKEdhbWUucGxheWVyID09IHRoaXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChHYW1lLnRpbWVSZW1haW5pbmcgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFBvc2l0aW9uLkNvcHlGcm9tKFNwYXduTG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIEhQID0gbWF4SFA7XHJcbiAgICAgICAgICAgICAgICAgICAgR2FtZS50aW1lUmVtYWluaW5nICo9IDAuNjY2N2Y7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgR2FtZS5Eb0dhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBQb3NpdGlvbi5Db3B5RnJvbShTcGF3bkxvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgIEhQID0gbWF4SFA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIG9uS2lsbChJQ29tYmF0YW50IGNvbWJhdGFudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBSZWN0YW5nbGUgR2V0SGl0Ym94KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIGJhc2UuR2V0SGl0Ym94KCk7XHJcbiAgICAgICAgICAgIGlmIChBbmkgIT0gbnVsbCAmJiBBbmkuQ3VycmVudEltYWdlICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8qdmFyIHNpemUgPSA0O1xyXG4gICAgICAgICAgICAgICAgdmFyIFcgPSBBbmkuQ3VycmVudEltYWdlLldpZHRoIC8gc2l6ZTtcclxuICAgICAgICAgICAgICAgIHZhciBIID0gQW5pLkN1cnJlbnRJbWFnZS5IZWlnaHQgLyBzaXplO1xyXG4gICAgICAgICAgICAgICAgdmFyIFc0ID0gKEFuaS5DdXJyZW50SW1hZ2UuV2lkdGggLyAyKSAtIChXIC8gMik7XHJcbiAgICAgICAgICAgICAgICB2YXIgSDQgPSAoQW5pLkN1cnJlbnRJbWFnZS5IZWlnaHQgLyAyKSAtIChIIC8gMik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZShBbmkuWCtXNCwgQW5pLlkrSDQsIFcsIEgpOyovXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZShBbmkuWCArIChBbmkuQ3VycmVudEltYWdlLldpZHRoIC8gMmYpLCBBbmkuWSArIChBbmkuQ3VycmVudEltYWdlLkhlaWdodCAvIDJmKSwgMSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
