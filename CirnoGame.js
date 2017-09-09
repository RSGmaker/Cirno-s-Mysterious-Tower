/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 16.2.0
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
                    return new (System.Collections.Generic.List$1(CirnoGame.GameMode))(System.Linq.Enumerable.from(CirnoGame.GameMode.gameModes).where(function (G) {
                            return G.ModeType === type;
                        }));
                },
                GetGameModeByName: function (name) {
                    var ret = new (System.Collections.Generic.List$1(CirnoGame.GameMode))(System.Linq.Enumerable.from(CirnoGame.GameMode.gameModes).where(function (G) {
                            return Bridge.referenceEquals(G.Name, name);
                        }));
                    if (ret.Count > 0) {
                        return ret.getItem(0);
                    }
                    return null;
                },
                init: function () {
                    if (CirnoGame.GameMode.TeamBattle == null) {
                        CirnoGame.GameMode.gameModes = new (System.Collections.Generic.List$1(CirnoGame.GameMode))();
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
                    console.log(System.String.concat("FN:", FN));
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
                    this.Images = new (System.Collections.Generic.List$1(HTMLImageElement))();
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
                var A = new (System.Collections.Generic.List$1(HTMLImageElement))();
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
            Bridge.global.setTimeout($asm.$.CirnoGame.App.f1, 5);

            var ok = false;
            var uptest = true;
            CirnoGame.JSONArchive.Open("Assets/Images.JSON", function (json) {
                CirnoGame.App.JSON = json;

                CirnoGame.App.JSON.PreloadImages(function () {
                    ok = true;
                    CirnoGame.App.Finish();
                });
            });

            // Create a new HTML Button
            /* var button = Document.CreateElement("button");

            // Set the Button text
            button.InnerHTML = "Click Me";

            // Add a Click event handler
            button.OnClick = (ev) =>
            {
               // Write a message to the Console
               //Console.WriteLine("Welcome to Bridge.NET");
               if (ok)
               {
                   HTMLDivElement div = new HTMLDivElement();
                   JSON.Images.Keys.ForEach(f =>
                   {
                       div.AppendChild(JSON.GetImage(f).CloneNode());
                   });
                   Document.Body.AppendChild(div);
               }
            };

            // Add the button to the document body
            Document.Body.AppendChild(button);*/

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
                    this.GameVersion = "0.1";
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
                    //Canv.Width = 200;
                    Canv.width = 1024;
                    //Canv.Width = 1280;
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
                    //var R = Window.InnerWidth / Window.InnerHeight;
                    var size = Math.ceil(window.innerHeight * (1 / CirnoGame.App.TargetAspect));
                    if (size !== CirnoGame.App._lSize) {
                        /* Canvas.Style.Width = size + "px";

                        Canvas.Style.Position = Position.Absolute;
                        Canvas.Style.Left = ((Window.InnerWidth / 2) - (size / 2)) + "px";*/
                        CirnoGame.App.Canvas.style.width = "100%";
                        CirnoGame.App.Div.style.width = System.Double.format(size) + "px";

                        //Div.Style.Position = Position.Absolute;
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

    Bridge.ns("CirnoGame.App", $asm.$);

    Bridge.apply($asm.$.CirnoGame.App, {
        f1: function () {
            CirnoGame.GamePadManager._this.Update();

            CirnoGame.App.IC = CirnoGame.InputControllerManager._this.Controllers.getItem(0);
            var IM = CirnoGame.InputControllerManager._this.Controllers.getItem(0).InputMapping.getItem(2);
            /* IM.map = 0;
            IM.controllerID = "Mouse";*/

            /* IM = InputControllerManager._this.Controllers[0].InputMapping[3];
            IM.map = 0;
            IM.controllerID = "Mouse";

            //pointer controls
            IM = InputControllerManager._this.Controllers[0].InputMapping[4];
            IM.map = 2;
            IM.controllerID = "Mouse";

            IM = InputControllerManager._this.Controllers[0].InputMapping[5];
            IM.map = 1;
            IM.controllerID = "Mouse";*/

            /* IM = InputControllerManager._this.Controllers[0].InputMapping[3];
            IM.map = 2;
            IM.controllerID = "Mouse";

            //pointer controls
            IM = InputControllerManager._this.Controllers[0].InputMapping[4];
            IM.map = 1;
            IM.controllerID = "Mouse";

            IM = InputControllerManager._this.Controllers[0].InputMapping[5];
            IM.map = 1;
            IM.controllerID = "Mouse";*/


        }
    });

    Bridge.define("CirnoGame.Audio", {
        fields: {
            _AM: null,
            _audio: null,
            _hasPlayed: false,
            _blast: null,
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

                this._blast = new (System.Collections.Generic.List$1(HTMLAudioElement))();
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
                if (!this.IsPlaying) {
                    this.Volume = volume;
                    this.Play();
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
                this.playing = new (System.Collections.Generic.List$1(CirnoGame.Audio))();
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
                CirnoGame.HelperExtensions.ForEach(Bridge.global.CirnoGame.Audio, this.data.getValues(), $asm.$.CirnoGame.AudioManager.f1);
            }
        }
    });

    Bridge.ns("CirnoGame.AudioManager", $asm.$);

    Bridge.apply($asm.$.CirnoGame.AudioManager, {
        f1: function (A) {
            A.Stop();
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
                this.rows = new (System.Collections.Generic.List$1(System.Collections.Generic.List$1(CirnoGame.ButtonSprite)))();
                this.MenuWidth = menuWidth;
                this.MenuHeight = menuHeight;
                this.FontSize = FontSize;
                this.SelectionMenu = selectionMenu;
                this.Self = this;
            }
        },
        methods: {
            GetAllButtons: function () {
                var all = new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite))();
                this.rows.forEach(function (R) {
                    all.addRange(R);
                });
                return all;
            },
            GetSpriteByData: function (data) {
                var all = new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite))(System.Linq.Enumerable.from(this.GetAllButtons()).where(function (B) {
                        return Bridge.referenceEquals(B.Data, data);
                    }));
                if (all.Count > 0) {
                    return all.getItem(0);
                }
                return null;
            },
            AddButtons: function (buttonText) {
                CirnoGame.HelperExtensions.ForEach(System.String, buttonText, Bridge.fn.bind(this, $asm.$.CirnoGame.ButtonMenu.f1));
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
                    this.rows.add(new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite))());
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
                var all = new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite))();
                this.rows.forEach(function (R) {
                    all.addRange(R);
                });

                this.rows = new (System.Collections.Generic.List$1(System.Collections.Generic.List$1(CirnoGame.ButtonSprite)))();
                this.rows.add(all);
            },
            addRow: function () {
                var ret = new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite))();
                this.rows.add(ret);
                return ret;
            },
            BreakUp: function (totalRows) {
                this.CombineRows();
                var all = this.rows.getItem(0);
                this.rows = new (System.Collections.Generic.List$1(System.Collections.Generic.List$1(CirnoGame.ButtonSprite)))();
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

    Bridge.ns("CirnoGame.ButtonMenu", $asm.$);

    Bridge.apply($asm.$.CirnoGame.ButtonMenu, {
        f1: function (T) {
            this.AddButton(T);
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
            LinearPanSpeed: 0,
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
                this.LinearPanSpeed = 1.2;
                this.LerpPanSpeed = 0.075;
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
            HandledLocally: false
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
                    this._behaviors = new (System.Collections.Generic.List$1(CirnoGame.EntityBehavior))();
                    this._behaviorTicks = new (System.Collections.Generic.List$1(System.Int32))();
                }
                this._behaviors.add(behavior);
                this._behaviorTicks.add(0);
            },
            AddBehavior$1: function (T) {
                if (this._behaviors == null) {
                    this._behaviors = new (System.Collections.Generic.List$1(CirnoGame.EntityBehavior))();
                    this._behaviorTicks = new (System.Collections.Generic.List$1(System.Int32))();
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
                    this._behaviors = new (System.Collections.Generic.List$1(CirnoGame.EntityBehavior))();
                    this._behaviorTicks = new (System.Collections.Generic.List$1(System.Int32))();
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
                var L = new (System.Collections.Generic.List$1(CirnoGame.EntityBehavior))(System.Linq.Enumerable.from(this._behaviors).where(function (behavior) {
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
                var L = new (System.Collections.Generic.List$1(CirnoGame.EntityBehavior))(System.Linq.Enumerable.from(this._behaviors).where(function (behavior) {
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
                if (Bridge.referenceEquals(this, combatant)) {
                    return true;
                }

                if (Bridge.is(this, CirnoGame.ICombatant) && Bridge.is(combatant, CirnoGame.ICombatant)) {
                    if (Bridge.cast(this, CirnoGame.ICombatant).CirnoGame$ICombatant$Team === Bridge.cast(combatant, CirnoGame.ICombatant).CirnoGame$ICombatant$Team) {
                        if (this.Game.GamePlaySettings.GameMode.Teams) {
                            //return ((ICombatant)this).Team != 0;
                            return true;
                        } else {
                            return Bridge.cast(this, CirnoGame.ICombatant).CirnoGame$ICombatant$Team === 0;
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
                    return new (System.Collections.Generic.List$1(CirnoGame.GamePad))(System.Linq.Enumerable.from(this.gamepads).where($asm.$.CirnoGame.GamePadManager.f1));
                }
            }
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.gamepads = new (System.Collections.Generic.List$1(CirnoGame.GamePad))();
                this.Update();
            }
        },
        methods: {
            CallBackTest: function () {
                Bridge.global.alert("Callback!");
            },
            GetPad: function (id) {
                var L = new (System.Collections.Generic.List$1(CirnoGame.GamePad))(System.Linq.Enumerable.from(this.gamepads).where(function (gamepad) {
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
                var pads = new (System.Collections.Generic.List$1(CirnoGame.GamePad))();
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

    Bridge.ns("CirnoGame.GamePadManager", $asm.$);

    Bridge.apply($asm.$.CirnoGame.GamePadManager, {
        f1: function (gamepad) {
            return gamepad.connected;
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
                    var L = new (System.Collections.Generic.List$1(T))();
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
                    var ret = new (System.Collections.Generic.List$1(T))();
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
                this.InputMapping = new (System.Collections.Generic.List$1(CirnoGame.InputMap))();

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
                        var GB = System.Linq.Enumerable.from(G.buttons).where($asm.$.CirnoGame.InputController.f1).toArray(CirnoGame.GamePadButton);
                        if (GB.length > 0) {
                            ret.axis = false;
                            var tmp = GB[System.Array.index(0, GB)];
                            ret.map = new (System.Collections.Generic.List$1(CirnoGame.GamePadButton))(G.buttons).indexOf(tmp);
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

    Bridge.ns("CirnoGame.InputController", $asm.$);

    Bridge.apply($asm.$.CirnoGame.InputController, {
        f1: function (B) {
            return B.pressed;
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
                this.Controllers = new (System.Collections.Generic.List$1(CirnoGame.InputController))();

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
                AllowRightClick: false,
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
            ctors: {
                init: function () {
                    this.AllowRightClick = false;
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
                    CirnoGame.KeyboardManager.__this.MouseDelta = 0;
                },
                NeverinBounds: function (evt) {
                    return CirnoGame.KeyboardManager.AllowRightClick || !CirnoGame.App.ScreenBounds.containsPoint$1(CirnoGame.KeyboardManager._this.CMouse.X, CirnoGame.KeyboardManager._this.CMouse.Y);
                },
                onKeyDown: function (evt) {
                    var keyCode = evt.keyCode;

                    if (!CirnoGame.HelperExtensions.ContainsB$1(System.Int32, CirnoGame.KeyboardManager.__this.PressedButtons, Bridge.box(keyCode, System.Int32))) {
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
                    if (CirnoGame.HelperExtensions.ContainsB$1(System.Int32, CirnoGame.KeyboardManager.__this.PressedButtons, Bridge.box(keyCode, System.Int32))) {
                        CirnoGame.KeyboardManager.__this.PressedButtons.remove(keyCode);
                    }
                },
                onMouseDown: function (evt) {
                    var btn = evt.button;
                    if (!CirnoGame.HelperExtensions.ContainsB$1(System.Int32, CirnoGame.KeyboardManager.__this.PressedMouseButtons, Bridge.box(btn, System.Int32))) {
                        CirnoGame.KeyboardManager.__this.PressedMouseButtons.add(btn);
                        CirnoGame.KeyboardManager.__this.TappedMouseButtons.add(btn);
                    }
                    return btn < 1;
                },
                onMouseUp: function (evt) {
                    var btn = evt.button;
                    if (CirnoGame.HelperExtensions.ContainsB$1(System.Int32, CirnoGame.KeyboardManager.__this.PressedMouseButtons, Bridge.box(btn, System.Int32))) {
                        CirnoGame.KeyboardManager.__this.PressedMouseButtons.remove(btn);
                    }
                    return btn < 1;
                },
                onMouseWheel: function (evt) {
                    CirnoGame.KeyboardManager._this.MouseDelta += evt.detail;
                    return true;
                },
                onMouseMove: function (evt) {
                    CirnoGame.KeyboardManager._this.MousePosition = new CirnoGame.Vector2(evt.clientX, evt.clientY);

                    //float left = float.Parse(App.Canvas.Style.Left.Replace("px", ""));
                    var left = { v : 0 };
                    if (!System.Single.tryParse(System.String.replaceAll(CirnoGame.App.Div.style.left, "px", ""), null, left)) {
                        return;
                    }
                    //float left = float.Parse(App.Div.Style.Left.Replace("px", ""));
                    var x = evt.clientX - left.v;
                    var y = evt.clientY;

                    //float scale = (App.Canvas.Width * 1.25f) / float.Parse(App.Canvas.Style.Width.Replace("px", ""));

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
            CMouse: null,
            MouseDelta: 0
        },
        ctors: {
            init: function () {
                this.MousePosition = new CirnoGame.Vector2();
                this.CMouse = new CirnoGame.Vector2();
                this.MouseDelta = 0;
            },
            ctor: function () {
                this.$initialize();
                this.PressedButtons = new (System.Collections.Generic.List$1(System.Int32))();
                this.TappedButtons = new (System.Collections.Generic.List$1(System.Int32))();
                this.PressedMouseButtons = new (System.Collections.Generic.List$1(System.Int32))();
                this.TappedMouseButtons = new (System.Collections.Generic.List$1(System.Int32))();

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


                var MW = CirnoGame.KeyboardManager.onMouseWheel;
                document.onmousewheel = MW;
                document.onDomMouseScroll = MW;

                window.addEventListener("mousewheel", $asm.$.CirnoGame.KeyboardManager.f1);
                window.addEventListener("DOMMouseScroll", $asm.$.CirnoGame.KeyboardManager.f1);

                document.onmousewheel = $asm.$.CirnoGame.KeyboardManager.f1;

                var NB = CirnoGame.KeyboardManager.NeverinBounds;
                document.oncontextmenu = NB;
            }
        }
    });

    Bridge.ns("CirnoGame.KeyboardManager", $asm.$);

    Bridge.apply($asm.$.CirnoGame.KeyboardManager, {
        f1: function (M) {
            CirnoGame.KeyboardManager.onMouseWheel(M);
        }
    });

    Bridge.define("CirnoGame.MapGenerator", {
        statics: {
            fields: {
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
                    CirnoGame.MapRoom.PlacedRooms = new (System.Collections.Generic.List$1(CirnoGame.MapRoom))();

                    var SX = (Bridge.Int.div(map.columns, 2)) | 0;
                    var SY = (Bridge.Int.div(map.rows, 3)) | 0;
                    var root = new CirnoGame.MapRoom();
                    root.SX = SX;
                    root.SY = SY;
                    root.EX = (((SX + 6) | 0) + Bridge.Int.clip32((Math.random() * 10))) | 0;
                    root.EY = (((SY + 6) | 0) + Bridge.Int.clip32((Math.random() * 10))) | 0;

                    root.game = game;

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
                    while (CirnoGame.MapRoom.PlacedRooms.Count < roomtotal && attempts > 0) {
                        var L = CirnoGame.HelperExtensions.Pick(Bridge.global.CirnoGame.MapRoom, CirnoGame.MapRoom.FindValidUnplacedRooms());
                        if (L.PlaceAndExpand()) {
                            //rooms++;
                        }
                        attempts = (attempts - 1) | 0;
                    }
                    var V = CirnoGame.MapGenerator.FindEmptySpace(game);
                    if (CirnoGame.Vector2.op_Inequality(V, null)) {
                        /* player.x = V.X;
                        player.y = V.Y;*/
                        game.Door.Position.CopyFrom(V);
                        game.Door.DropToGround();
                        var PC = player;
                        //PC.MoveToNewSpawn(V);
                        PC.MoveToNewSpawn(game.Door.Position);
                        console.log("spawning at:" + Bridge.Int.clip32(V.X) + "," + Bridge.Int.clip32(V.Y));
                    } else {
                        console.log("cannot locate a spawn point...");
                    }

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
                RNG: null
            },
            ctors: {
                init: function () {
                    this.PlacedRooms = new (System.Collections.Generic.List$1(CirnoGame.MapRoom))();
                    this.RNG = new System.Random.ctor();
                }
            },
            methods: {
                FindValidUnplacedRooms: function () {
                    var L = new (System.Collections.Generic.List$1(CirnoGame.MapRoom))();
                    var i = 0;
                    while (i < CirnoGame.MapRoom.PlacedRooms.Count) {
                        var P = CirnoGame.MapRoom.PlacedRooms.getItem(i);
                        L.addRange(System.Linq.Enumerable.from(P.ExitRooms).where($asm.$.CirnoGame.MapRoom.f1));
                        i = (i + 1) | 0;
                    }
                    return L;
                },
                FindAnyEmptySpot: function () {
                    if (CirnoGame.MapRoom.PlacedRooms.Count < 1) {
                        return null;
                    }
                    var i = 0;
                    while (i < 10) {
                        var ret = CirnoGame.HelperExtensions.Pick(Bridge.global.CirnoGame.MapRoom, CirnoGame.MapRoom.PlacedRooms, CirnoGame.MapRoom.RNG).FindEmptySpot();
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
            ExitRooms: null,
            parent: null,
            game: null
        },
        ctors: {
            init: function () {
                this.placed = false;
                this.ExitRooms = new (System.Collections.Generic.List$1(CirnoGame.MapRoom))();
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
            Place: function () {
                var TM = this.game.TM;
                TM.ClearRect$1(this.SX, this.SY, ((this.EX - this.SX) | 0), ((this.EY - this.SY) | 0));
                TM._GenRect(this.SX, this.SY, this.EX, this.EY);

                CirnoGame.MapRoom.PlacedRooms.add(this);
                this.placed = true;
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

    Bridge.ns("CirnoGame.MapRoom", $asm.$);

    Bridge.apply($asm.$.CirnoGame.MapRoom, {
        f1: function (F) {
            return F.CanBePlaced() && !F.placed;
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
            _hitbox: null
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
                } else {
                    this.map.RedrawTile(this.column, this.row, false);
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
                return new CirnoGame.Rectangle(pos.X + (this.column * tsz), pos.Y + (this.row * tsz), tsz, tsz);
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
                                } else if (this.RND.nextDouble() < 0.04) {
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

                while (row < EY) {
                    while (column < EX) {
                        //if (R.isTouching(new Rectangle(X, Y, tilesize, tilesize)))
                        {
                            var T = this.data.get([column, row]);
                            var tex = Math.min(((this.tiles.Count - 1) | 0), T.texture);
                            if (T.enabled && tex >= 0 && tex < this.tiles.Count) {
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
                                    var R = T.GetHitbox();
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
                                    g.drawImage(BG, X, Y);
                                    g.globalCompositeOperation = "source-over";
                                }

                            } else {
                                g.drawImage(Math.random() < 0.98 ? BG : BG2, X, Y);
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
                        /* if (!T.enabled || !T.visible)
                        {
                           T.enabled = true;
                           T.solid = false;
                           T.visible = true;
                           T.texture = 2;
                        }*/
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

    Bridge.define("CirnoGame.BoundsRestrictor", {
        inherits: [CirnoGame.EntityBehavior],
        fields: {
            bounds: null,
            bottom: false
        },
        ctors: {
            init: function () {
                this.bottom = false;
            },
            ctor: function (entity) {
                this.$initialize();
                CirnoGame.EntityBehavior.ctor.call(this, entity);
            }
        },
        methods: {
            Update: function () {
                CirnoGame.EntityBehavior.prototype.Update.call(this);
                var B = this.bounds;
                if (B == null) {
                    B = this.entity.Game.stageBounds;
                }
                var P = this.entity.Position;
                P.X = CirnoGame.MathHelper.Clamp$1(P.X, B.left, B.right);
                if (this.bottom) {
                    P.Y = CirnoGame.MathHelper.Clamp$1(P.Y, B.top, B.bottom);
                } else {
                    P.Y = Math.max(P.Y, B.top);
                }
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
                this.ColorSchemes = new (System.Collections.Generic.List$1(CirnoGame.ButtonSprite.ColorScheme))();
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
                grd.addColorStop(0.4, "white");
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
        props: {
            Opened: false
        },
        ctors: {
            ctor: function (game) {
                this.$initialize();
                CirnoGame.Entity.ctor.call(this, game);
                this.Ani = new CirnoGame.Animation(CirnoGame.AnimationLoader._this.GetAnimation("images/misc/chest"));
                this.Ani.ImageSpeed = 0;
            }
        },
        methods: {
            Update: function () {
                CirnoGame.Entity.prototype.Update.call(this);
                var F = this.GetFloor();
                if (F == null) {
                    this.Vspeed = 1;
                } else {
                    this.Vspeed = 0;
                    this.y = F.GetHitbox().top - this.Ani.CurrentImage.height;
                }
                var P = this.Game.player;
                if (!this.Opened && P.Position.EstimatedDistance(this.Position) < 16 && P.Controller[System.Array.index(2, P.Controller)] && P.keys > 0) {
                    P.keys = (P.keys - 1) | 0;
                    this.Open(P);
                    /* Ani.CurrentFrame = 1;
                    Ani.SetImage();
                    Ani.Update();*/
                }
            },
            Open: function (player) {
                if (!this.Opened) {
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
                        var common = System.Array.init(["point", "point", "point", "point", "point", "point", "heart", "heart", "tripleheart", "doubleorb"], System.String);
                        var rare = System.Array.init(["attackpower", "defensepower", "mining"], System.String);
                        var legendary = System.Array.init(["triplejump", "cheaperblocks", "invincibility"], System.String);



                        var R = Math.random();
                        var C;

                        if (picker == null || Math.random() < 0.2) {
                            if (R < 0.75) {
                                picker = common;
                                S = "common";
                                color = "#FFFFFF";
                            } else {
                                R = Math.random();
                                if (R < 0.85) {
                                    picker = rare;
                                    S = "rare";
                                    //color = "#FF9922";
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
                            case "doubleorb": 
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
                                CI = new CirnoGame.Orb(this.Game);
                                CI.Position.CopyFrom(this.Position);
                                CI.Vspeed = -2.0;
                                CI.Hspeed = 2.0;
                                CI.collectionDelay = 30;
                                this.Game.AddEntity(CI);
                                M = "Double Orb";
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
                                M = "invincibility extended";
                                break;
                            case "attackpower": 
                                player.attackpower += 1;
                                M = "Attack Power " + Bridge.Int.clip32((player.attackpower));
                                break;
                            case "defensepower": 
                                player.defensepower += 1;
                                M = "Defensive Power " + Bridge.Int.clip32((player.defensepower));
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
            collectionDelay: 0
        },
        ctors: {
            init: function () {
                this.floats = true;
                this.magnetDistance = 35;
                this.magnetSpeed = 8;
                this.maxFallSpeed = 2;
                this.fallaccel = 0.1;
                this.collectionDelay = 10;
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
                        this.PlaySound("powerup");
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
            alpha: 0
        },
        ctors: {
            init: function () {
                this.time = 30;
                this.alpha = 1;
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
            Update: function () {
                CirnoGame.Entity.prototype.Update.call(this);
                if (this.time > 0) {
                    this.time = (this.time - 1) | 0;
                    if (this.time < 1) {
                        //Alive = false;
                        this.alpha -= 0.05;
                        if (this.alpha <= 0) {
                            this.Alive = false;
                        }
                        this.time = 1;
                    }
                }
            },
            Draw: function (g) {
                //base.Draw(g);
                if (this.alpha < 1) {
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
                this.Ani = new CirnoGame.Animation(new (System.Collections.Generic.List$1(HTMLImageElement))(System.Array.init([image], HTMLImageElement)));
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
                var controller = this._platformer.Controller;
                if (controller[System.Array.index(0, controller)] && this._platformer.Hspeed > -this.maxSpeed) {
                    this._platformer.Hspeed = Math.max(this._platformer.Hspeed - (this.accel + this._platformer.friction), -this.maxSpeed);
                }
                if (controller[System.Array.index(1, controller)] && this._platformer.Hspeed < this.maxSpeed) {
                    this._platformer.Hspeed = Math.min(this._platformer.Hspeed + (this.accel + this._platformer.friction), this.maxSpeed);
                }
                var jumpbutton = 5;
                if (this._platformer.onGround) {
                    this.airJumps = 0;
                }
                if (this._platformer.Vspeed >= 0 && this._platformer.onGround) {
                    //if (controller[jumpbutton] && _platformer.Ceiling == null)
                    //if (controller[jumpbutton] && _platformer.onGround && _platformer.Ceiling == null)
                    if (this._platformer.Pressed(jumpbutton) && this._platformer.onGround && this._platformer.Ceiling == null) {
                        this._platformer.Vspeed = -this.jumpSpeed;
                        this.entity.PlaySound("jump");
                    }
                    /* else if (controller[3] && _platformer.Floor != null && _platformer.Floor.platform)
                    {
                       //platformer.y = groundY + 2;
                       _platformer.onGround = false;
                       _platformer.Floor = null;
                       _platformer.y += 2;
                    }*/
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

                this.hitEntities = new (System.Collections.Generic.List$1(CirnoGame.Entity))();
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
                    if (T.Breakable && this.attacksterrain) {
                        //T.Damage(_touchDamage * digpower);
                        this.PlaySound("hit");
                        T.Damage(this.digpower);
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
                this.Controls.Text = "Controls:\nLeft/Right=Move\nUp/Down=Aim(Up activates chests/doors)\nZ=Shoot\nX=Jump/Mid-air jump\nA=Place block below you(costs time)";
                this.Controls.ShadowColor = "#000000";
                this.Controls.ShadowOffset = new CirnoGame.Vector2(2, 2);
                this.Controls.ShadowBlur = 2;
                this.CenterTextWithFloats(this.Controls, 0.5, 0.4);
                this.Controls.Position.X = this.Desc.Position.X;

                this.menu = new CirnoGame.ButtonMenu(this.spriteBuffer.width * 0.8, this.spriteBuffer.height * 0.5, Bridge.Int.clip32(this.spriteBuffer.width * 0.05));
                var B = this.menu.AddButton("Start Game");
                B.OnClick = Bridge.fn.bind(this, $asm.$.CirnoGame.TitleScreen.f1);
                //menu.Finish();
                B.Position.X += this.spriteBuffer.width * 0.38;
                B.Position.Y = this.spriteBuffer.height * 0.7;

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

    Bridge.ns("CirnoGame.TitleScreen", $asm.$);

    Bridge.apply($asm.$.CirnoGame.TitleScreen, {
        f1: function () {
            this.game.Start();
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
            skiprender: false,
            ScoreSprite: null,
            EG: null,
            Door: null,
            Key: null,
            muted: false,
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
                this.skiprender = true;
                this.muted = false;
                this.ShowHitbox = false;
                this.freecam = false;
            },
            ctor: function () {
                this.$initialize();
                CirnoGame.GameSprite.ctor.call(this);
                this.GamePlaySettings = new CirnoGame.GamePlaySettings();
                this.Door = new CirnoGame.ExitDoor(this);
                this.player = new CirnoGame.PlayerCharacter(this);
                this.player.HP = 0;
                this.timeRemaining = this.defaultTimeRemaining;
                //timeRemaining *= 0.3334f * 0.25f;

                /* test.Ani = new Animation(AnimationLoader._this.Get("images/cirno/walk"));
                test.Ani.ImageSpeed = 0.1f;*/
                this.entities = new (System.Collections.Generic.List$1(CirnoGame.Entity))();
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
                this.camera.Scale = 4;

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
                    if (Bridge.referenceEquals(E, this.player) || Bridge.is(E, CirnoGame.ExitDoor)) {

                    } else {
                        E.Alive = false;
                        this.RemoveEntity(E);
                    }
                    i = (i + 1) | 0;
                }
            },
            StartNextLevel: function () {
                this.ClearEntities();
                this.level = (this.level + 1) | 0;
                var R = CirnoGame.Rectangle.op_Subtraction(this.stageBounds, this.TM.position);
                R.width -= this.TM.tilesize;
                R.height -= this.TM.tilesize;
                this.TM.Generate();
                CirnoGame.MapGenerator.BoxyGenerate(this);
                this.TM.DrawRect(R);
                this.TM.ApplyBreakable();



                var i = 0;
                //while (i < 110)
                while (i < 24) {
                    this.PlaceAndAddEntity(new CirnoGame.MRGhosty(this));
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
                while (Bridge.identity(i, (i = (i + 1) | 0)) <= 2) {
                    this.PlaceAndAddEntity(new CirnoGame.HealingItem(this));
                }

                this.PlaceAndAddEntity(new CirnoGame.DoorKey(this));
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
            Update: function () {
                CirnoGame.GameSprite.prototype.Update.call(this);
                if (this.playing && CirnoGame.KeyboardManager._this.TappedButtons.contains(13)) {
                    this.paused = !this.paused;
                    CirnoGame.KeyboardManager._this.TappedButtons.remove(13);
                }
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
                        this.level = (this.level - 1) | 0;
                        this.StartNextLevel();
                    }
                } else {
                    this.TimerSprite.Text = "Paused";
                }
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
                //timeRemaining -= 16.66667f;
                if (this.paused) {
                    this.TimerSprite.Text = "Paused";
                    return;
                }
                if (this.timeRemaining < 0) {
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
                this.TimerSprite.Text = S;
            },
            RestrictLength: function (s, length) {
                if (s.length > length) {
                    return s.substr(0, length);
                }
                return s;
            },
            UpdateCollisions: function () {
                var combatants = new (System.Collections.Generic.List$1(CirnoGame.Entity))(System.Linq.Enumerable.from(this.entities).where($asm.$.CirnoGame.Game.f1));
                var harmfulEntity = new (System.Collections.Generic.List$1(CirnoGame.Entity))(System.Linq.Enumerable.from(this.entities).where($asm.$.CirnoGame.Game.f2));
                var R2 = new CirnoGame.Rectangle();
                var OR2 = new CirnoGame.Rectangle();
                var i = 0;
                while (i < combatants.Count) {
                    var E = { v : combatants.getItem(i) };
                    if (Bridge.is(E.v, CirnoGame.ICombatant)) {
                        var EI = { v : Bridge.cast(E.v, CirnoGame.ICombatant) };
                        var R = E.v.GetHitbox();
                        var spd = CirnoGame.Vector2.op_Multiply(E.v.Speed, 0.5);
                        //Rectangle R2 = new Rectangle(R.x - (spd.X), R.y - (spd.Y), R.width, R.height);
                        R2.Set(R.x - (spd.X), R.y - (spd.Y), R.width, R.height);
                        //List<Entity> L = new List<Entity>(harmfulEntity.Where(entity => entity != E && entity.GetHitbox().isTouching(R)));
                        //List<Entity> L = new List<Entity>(harmfulEntity.Where(entity => entity != E && ((ICombatant)((IHarmfulEntity)entity).Attacker).Team != EI.Team));
                        var L = new (System.Collections.Generic.List$1(CirnoGame.Entity))(System.Linq.Enumerable.from(harmfulEntity).where((function ($me, E, EI) {
                                return function (entity) {
                                    return !Bridge.referenceEquals(entity, E.v) && !Bridge.cast(entity, CirnoGame.IHarmfulEntity).CirnoGame$IHarmfulEntity$Attacker.SameTeam(Bridge.cast(EI.v, CirnoGame.Entity));
                                };
                            })(this, E, EI)));
                        var j = 0;
                        while (j < L.Count) {
                            var tmp = L.getItem(j);
                            var HE = Bridge.cast(tmp, CirnoGame.IHarmfulEntity);
                            var OR = tmp.GetHitbox();
                            var spd2 = CirnoGame.Vector2.op_Multiply(tmp.Speed, 0.5);
                            //Rectangle OR2 = new Rectangle(OR.x - (spd2.X), OR.y - (spd2.Y), OR.width, OR.height);
                            OR2.Set(OR.x - (spd2.X), OR.y - (spd2.Y), OR.width, OR.height);
                            //if (EI.Team != ((ICombatant)HE.Attacker).Team)
                            if ((R.isTouching(OR) || R2.isTouching(OR2))) {
                                if (HE.CirnoGame$IHarmfulEntity$ontouchDamage(EI.v)) {
                                    var LHP = EI.v.CirnoGame$ICombatant$HP;
                                    EI.v.CirnoGame$ICombatant$onDamaged(HE, HE.CirnoGame$IHarmfulEntity$touchDamage);
                                    if (LHP > EI.v.CirnoGame$ICombatant$HP) {
                                        Bridge.cast(EI.v, CirnoGame.Entity).PlaySound("hit");
                                    }
                                    if (EI.v.CirnoGame$ICombatant$HP <= 0) {
                                        if (Bridge.cast(EI.v, CirnoGame.Entity).HandledLocally) {
                                            var D = { };
                                            D.I = Bridge.cast(EI.v, CirnoGame.Entity).ID;
                                            D.A = HE.CirnoGame$IHarmfulEntity$Attacker.ID;
                                            D.S = Bridge.cast(HE, CirnoGame.Entity).ID;
                                            this.SendEvent("Kill", D);
                                        }
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
                    Bridge.cast(target, CirnoGame.Entity).PlaySound("hit");
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
            },
            RemoveEntity: function (E) {
                E.onRemove();
                this.entities.remove(E);
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

    Bridge.ns("CirnoGame.Game", $asm.$);

    Bridge.apply($asm.$.CirnoGame.Game, {
        f1: function (entity) {
            return Bridge.is(entity, CirnoGame.ICombatant) && entity.Ani.CurrentImage != null && Bridge.cast(entity, CirnoGame.ICombatant).CirnoGame$ICombatant$HP > 0;
        },
        f2: function (entity) {
            return Bridge.is(entity, CirnoGame.IHarmfulEntity) && entity.Ani.CurrentImage != null;
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
                var unstuck = false;
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
                var time = 25000;
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
                    return 2;
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
                /* Ani.HueColor = "#FF0000";
                Ani.HueRecolorStrength = 1.0f;
                Ani.Shadow = 2;
                Ani.Shadowcolor = Ani.HueColor;*/
                //Ani.Shadowcolor = "#FF0000";
                this.AddBehavior(new CirnoGame.FlightControls(this));
                this.AddBehavior(new CirnoGame.RandomAI(this));
                //AddBehavior(new AimedShooter(this));
                this.attackpower = 1 + (this.Game.level * 0.334);
                this.defensepower = 1 + (this.Game.level * 0.334);
                if (this.Game.playing) {
                    this.AddBehavior$1(CirnoGame.AimedShooter);
                    this.GetBehavior(CirnoGame.AimedShooter).attackpower = this.attackpower;
                }
                //GetBehavior<FlightControls>().maxSpeed *= 0.75f;
                this.GetBehavior(CirnoGame.FlightControls).maxSpeed *= 0.5;




                this.GravityEnabled = false;
                this.Team = 2;
                this.HP = 2;
            }
        },
        methods: {
            Update: function () {
                CirnoGame.PlatformerEntity.prototype.Update.call(this);
                this.Ani.Flipped = !(this.Hspeed < 0); //sprite needs to be edited to face the right way...
                this.Ani.ImageSpeed = (Math.abs(this.Hspeed) + Math.abs(this.Vspeed)) * 0.125;

                //Ani.Shadow = Ani.Shadow==0 ? 2 : 0;

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
            invincibilitymod: 0
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
                this.blockprice = 9;
                this.invincibilitymod = 1.0;
            },
            ctor: function (game) {
                this.$initialize();
                CirnoGame.PlatformerEntity.ctor.call(this, game);
                this.ChangeAni("stand");
                this.AddBehavior(new CirnoGame.PlatformerControls(this));
                /* AddBehavior(new FlightControls(this));
                GravityEnabled = false;*/
                this.tapTimer = System.Array.init(this.Controller.length, 0, System.Int32);
                this.Team = 0;
                this.HP = this.maxHP;
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
                    var PB = new CirnoGame.PlayerBullet(this.Game, this, "Images/misc/crystal");
                    PB.Hspeed = this.Ani.Flipped ? -2.5 : 2.5;
                    PB.x = this.x + (this.Ani.Flipped ? -4 : 12);
                    PB.y = this.y + 10;
                    if (!this.Controller[System.Array.index(0, this.Controller)] && !this.Controller[System.Array.index(1, this.Controller)]) {
                        /* if (Controller[2])
                        {
                           PB.Vspeed = -(float)Math.Abs(PB.Hspeed);
                           PB.Hspeed = 0;
                        }else if (Controller[3])
                        {
                           PB.Vspeed = (float)Math.Abs(PB.Hspeed);
                           PB.Hspeed = 0;
                        }*/
                        /* if (Controller[2])
                        {
                           PB.Hspeed *= 0.8f;
                           PB.Vspeed = -(float)Math.Abs(PB.Hspeed);

                        }
                        else if (Controller[3])
                        {
                           PB.Hspeed *= 0.8f;
                           PB.Vspeed = (float)Math.Abs(PB.Hspeed);
                        }*/
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
                    PB.attacksterrain = true;
                    PB.digpower = this.digpower * 0.6667;
                    PB.touchDamage = this.attackpower;
                    this.Game.AddEntity(PB);
                    //shootRecharge = 12;
                    this.shootRecharge = 20;
                }
                this.shoottime = 50;
                this.turntime = 0;

            },
            Update: function () {
                CirnoGame.PlatformerEntity.prototype.Update.call(this);

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
                    this.Game.timeRemaining -= this.blockprice;
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
                    this.invincibilitytime = 45;
                }
            },
            onDeath: function (source) {
                //throw new NotImplementedException();

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDaXJub0dhbWUuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkdhbWVNb2RlLmNzIiwiRW50aXR5QmVoYXZpb3IuY3MiLCJBbmltYXRpb24uY3MiLCJBbmltYXRpb25Mb2FkZXIuY3MiLCJBcHAuY3MiLCJBdWRpby5jcyIsIkF1ZGlvTWFuYWdlci5jcyIsIkJ1dHRvbk1lbnUuY3MiLCJTcHJpdGUuY3MiLCJCdXR0b25TcHJpdGUuY3MiLCJDYW1lcmEuY3MiLCJFbnRpdHkuY3MiLCJHYW1lUGFkLmNzIiwiR2FtZVBhZEJ1dHRvbi5jcyIsIkdhbWVQYWRNYW5hZ2VyLmNzIiwiR2FtZVBsYXlTZXR0aW5ncy5jcyIsIkhlbHBlci5jcyIsIkhlbHBlckV4dGVuc2lvbnMuY3MiLCJJbnB1dENvbnRyb2xsZXIuY3MiLCJJbnB1dENvbnRyb2xsZXJNYW5hZ2VyLmNzIiwiSW5wdXRNYXAuY3MiLCJKU09OQXJjaGl2ZS5jcyIsIktleWJvYXJkTWFuYWdlci5jcyIsIk1hcEdlbmVyYXRvci5jcyIsIk1hcFJvb20uY3MiLCJNYXRoSGVscGVyLmNzIiwiUG9pbnQuY3MiLCJSZWN0YW5nbGUuY3MiLCJSZWN0YW5nbGVJLmNzIiwiUmVuZGVyZXIuY3MiLCJUaWxlRGF0YS5jcyIsIlRpbGVNYXAuY3MiLCJWZWN0b3IyLmNzIiwiQmVoYXZpb3JzL0FpbWVkU2hvb3Rlci5jcyIsIkJlaGF2aW9ycy9Cb3VuZHNSZXN0cmljdG9yLmNzIiwiQ2hlc3QuY3MiLCJDb2xsZWN0YWJsZUl0ZW0uY3MiLCJDb250cm9sbGFibGVFbnRpdHkuY3MiLCJFeGl0RG9vci5jcyIsIkJlaGF2aW9ycy9GbGlnaHRDb250cm9scy5jcyIsIkZsb2F0aW5nTWVzc2FnZS5jcyIsIlBhcnRpY2xlLmNzIiwiQmVoYXZpb3JzL1BsYXRmb3JtZXJDb250cm9scy5jcyIsIlBsYXllckJ1bGxldC5jcyIsIkJlaGF2aW9ycy9SYW5kb21BSS5jcyIsIlRleHRTcHJpdGUuY3MiLCJUaWxlLmNzIiwiVGl0bGVTY3JlZW4uY3MiLCJEb29yS2V5LmNzIiwiR2FtZS5jcyIsIkhlYWxpbmdJdGVtLmNzIiwiS2V5SXRlbS5jcyIsIlBsYXRmb3JtZXJFbnRpdHkuY3MiLCJPcmIuY3MiLCJQb2ludEl0ZW0uY3MiLCJFbmVtaWVzL01SR2hvc3R5LmNzIiwiUGxheWVyQ2hhcmFjdGVyLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OENBeUN3REE7b0JBRTVDQSxPQUFPQSxLQUFJQSx1REFBZUEsNEJBQXlEQSxvQ0FBVUEsQUFBd0RBO21DQUFLQSxlQUFjQTs7OzZDQUduSUE7b0JBRXJDQSxVQUFVQSxLQUFJQSx1REFBZUEsNEJBQXlEQSxvQ0FBVUEsQUFBd0RBO21DQUFLQSwrQkFBVUE7O29CQUN2S0EsSUFBSUE7d0JBRUFBLE9BQU9BOztvQkFFWEEsT0FBT0E7OztvQkEwQlBBLElBQUlBLGlDQUFjQTt3QkFFZEEsK0JBQVlBLEtBQUlBO3dCQUNoQkEsZ0NBQWFBLElBQUlBO3dCQUNqQkE7d0JBQ0FBLGdDQUFhQSxJQUFJQTt3QkFDakJBO3dCQUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBOUJXQTs7Z0JBRWZBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQSxZQUFPQTtnQkFDUEEsZ0JBQVdBO2dCQUNYQSxtQkFBY0EsaURBQTJCQTtnQkFDekNBO2dCQUNBQSxpQ0FBY0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJDckRJQTs7Z0JBRWxCQSxjQUFjQTtnQkFDZEEsSUFBSUEsaURBQXNCQSxxQkFBZ0JBO29CQUV0Q0EsV0FBZUE7b0JBQ2ZBLFNBQVNBO29CQUNUQSxZQUFXQSw0QkFBTUE7b0JBQ2pCQSxRQUFhQTtvQkFDYkEsb0JBQWVBLHFCQUFFQSxzQkFBRkE7Ozs7Ozs7Ozs7OzRCQVVFQTt1Q0FHR0EsS0FBWUE7O2dCQUVwQ0EsUUFBWUE7Z0JBQ1pBLE1BQU1BO2dCQUNOQSxNQUFNQTs7Z0JBRU5BLE1B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S0FBS0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0E7b0JBRTdCQTtvQkFDQUE7b0JBQ0FBO29CQUNBQTtvQkFDQUE7b0JBQ0FBLE9BQU9BO29CQUNQQSwyQkFBc0JBOzs7aUNBR1JBLFdBQWlCQTs7Z0JBRW5DQSxJQUFJQSx1Q0FBa0JBO29CQUVsQkE7O2dCQUVKQSxJQUFJQSxZQUFPQTtvQkFFUEEsV0FBTUEsSUFBSUEsb0JBQVVBLDhCQUFvQkEsc0NBQWtCQTs7b0JBRzFEQSx5QkFBb0JBLDhCQUFvQkEsc0NBQWtCQSxhQUFXQTs7Z0JBRXpFQSxJQUFJQTtvQkFFQUE7O2dCQUVKQSxpQkFBaUJBOzs7Z0JBSWpCQTtnQkFDQUE7Z0JBQ0FBLE9BQU9BLElBQUlBO29CQUVQQSxpQ0FBU0EsR0FBVEEsb0RBQVNBLEdBQVRBO29CQUNBQSxJQUFJQSxtQ0FBV0EsR0FBWEEscUJBQWlCQSxDQUFDQSxvQ0FBWUEsR0FBWkE7d0JBRWxCQSxpQ0FBU0EsR0FBVEE7d0JBQ0FBOztvQkFFSkEsb0NBQVlBLEdBQVpBLHFCQUFpQkEsbUNBQVdBLEdBQVhBO29CQUNqQkE7Ozs7Ozs7Z0JBT0pBLElBQUlBOzs7O2lDQU1jQSxRQUF1QkE7O2dCQUd6Q0EsSUFBSUE7b0JBRUFBLFdBQU1BLENBQUNBLFNBQVNBO29CQUNoQkE7OzsrQkFJWUE7OztnQkFJaEJBLElBQUlBLHlDQUFlQTtvQkFFZkEsSUFBSUE7d0JBRUFBLHVCQUFrQkE7d0JBQ2xCQSxVQUFLQTt3QkFDTEE7O3dCQUdBQTs7O29CQUlKQSx1QkFBa0JBO29CQUNsQkEsVUFBS0E7Ozs4QkFJTUE7Ozs7O2dCQU9mQSxJQUFJQSxZQUFPQSxRQUFRQSx5QkFBb0JBOzs7Ozs7O29CQVFuQ0EsT0FBT0EsSUFBSUEsb0JBQVVBLGFBQVFBLENBQUNBLG9DQUE2QkEsYUFBTUEsQ0FBQ0E7O2dCQUV0RUEsT0FBT0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgW1ByaW9yaXR5KDEpXVxyXG4gICAgcHVibGljIGNsYXNzIEdhbWVNb2RlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGVudW0gTW9kZVR5cGVzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyBTaW5nbGUgJiBNdWx0aXBsYXllciwganVzdCBhIGdlbmVyYWwgZ2FtZS5cclxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgU2tpcm1pc2gsXHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFNpbmdsZXBsYXllciwgZ2FtZXBsYXkgaXMgY2hhbmdlZCB1cCB3aXRoIGEgbW9kZSBzcGVjaWZpYyB0YXNrLlxyXG4gICAgICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICBDaGFsbGVuZ2UsXHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIExpa2UgY2hhbGxlbmdlLCBidXQgaXMgZGVzaWduZWQgZm9yIG11bHRpcGxlIGh1bWFuIHBsYXllcnMuXHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIENhbGxlbmdlQ29vcFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgVGVhbXMgeyBnZXQ7IHByb3RlY3RlZCBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IFN0YXJ0aW5nTGl2ZXMgeyBnZXQ7IHByb3RlY3RlZCBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBTdXJ2aXZhbCB7IGdldDsgcHJvdGVjdGVkIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIEFsbG93T25saW5lUGxheSB7IGdldDsgcHJvdGVjdGVkIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIEFsbG93Q2hhcmFjdGVyU2VsZWN0IHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBOdW1iZXJPZlBsYXllcnMgeyBnZXQ7IHByb3RlY3RlZCBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IFJlc3Bhd25UaW1lIHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBOYW1lIHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIE1vZGVUeXBlcyBNb2RlVHlwZSB7IGdldDsgcHJvdGVjdGVkIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIHVubG9ja2VkIHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBEZXNjcmlwdGlvbiB7IGdldDsgcHJvdGVjdGVkIHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8R2FtZU1vZGU+IEdldEdhbWVNb2Rlc09mVHlwZShNb2RlVHlwZXMgdHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGlzdDxHYW1lTW9kZT4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OkNpcm5vR2FtZS5HYW1lTW9kZT4oZ2FtZU1vZGVzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkdhbWVNb2RlLCBib29sPikoRyA9PiBHLk1vZGVUeXBlID09IHR5cGUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEdhbWVNb2RlIEdldEdhbWVNb2RlQnlOYW1lKHN0cmluZyBuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IG5ldyBMaXN0PEdhbWVNb2RlPihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6Q2lybm9HYW1lLkdhbWVNb2RlPihnYW1lTW9kZXMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpDaXJub0dhbWUuR2FtZU1vZGUsIGJvb2w+KShHID0+IEcuTmFtZSA9PSBuYW1lKSkpO1xyXG4gICAgICAgICAgICBpZiAocmV0LkNvdW50PjApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXRbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgR2FtZU1vZGUoc3RyaW5nIG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBUZWFtcyA9IHRydWU7XHJcbiAgICAgICAgICAgIFN0YXJ0aW5nTGl2ZXMgPSAzO1xyXG4gICAgICAgICAgICBTdXJ2aXZhbCA9IHRydWU7XHJcbiAgICAgICAgICAgIEFsbG93T25saW5lUGxheSA9IHRydWU7XHJcbiAgICAgICAgICAgIEFsbG93Q2hhcmFjdGVyU2VsZWN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgTnVtYmVyT2ZQbGF5ZXJzID0gNjtcclxuICAgICAgICAgICAgUmVzcGF3blRpbWUgPSAzOTA7XHJcbiAgICAgICAgICAgIE5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICBNb2RlVHlwZSA9IEdhbWVNb2RlLk1vZGVUeXBlcy5Ta2lybWlzaDtcclxuICAgICAgICAgICAgRGVzY3JpcHRpb24gPSBcIk1pc3NpbmcgZGVzY3JpcHRpb24gZm9yIFwiK25hbWU7XHJcbiAgICAgICAgICAgIHVubG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgZ2FtZU1vZGVzLkFkZCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBHYW1lTW9kZSBUZWFtQmF0dGxlO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR2FtZU1vZGUgRGVhdGhNYXRjaDtcclxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGljIExpc3Q8R2FtZU1vZGU+IGdhbWVNb2RlcztcclxuXHJcbiAgICAgICAgLy9bSW5pdF1cclxuICAgICAgICBbUmVhZHldXHJcbiAgICAgICAgcHJvdGVjdGVkIHN0YXRpYyB2b2lkIGluaXQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKFRlYW1CYXR0bGUgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZ2FtZU1vZGVzID0gbmV3IExpc3Q8R2FtZU1vZGU+KCk7XHJcbiAgICAgICAgICAgICAgICBUZWFtQmF0dGxlID0gbmV3IEdhbWVNb2RlKFwiVGVhbSBCYXR0bGVcIik7XHJcbiAgICAgICAgICAgICAgICBUZWFtQmF0dGxlLkRlc2NyaXB0aW9uID0gXCIyIHRlYW1zIGJhdHRsZSB3aXRoIGxpbWl0ZWQgbGl2ZXNcXG51bnRpbCBvbmx5IDEgdGVhbSByZW1haW5zLlwiO1xyXG4gICAgICAgICAgICAgICAgRGVhdGhNYXRjaCA9IG5ldyBHYW1lTW9kZShcIkRlYXRoIE1hdGNoXCIpO1xyXG4gICAgICAgICAgICAgICAgRGVhdGhNYXRjaC5EZXNjcmlwdGlvbiA9IFwiQSBmcmVlIGZvciBhbGwgbWF0Y2ggd2l0aFxcbmxpbWl0ZWQgbGl2ZXMuXCI7XHJcbiAgICAgICAgICAgICAgICBEZWF0aE1hdGNoLlRlYW1zID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEVudGl0eUJlaGF2aW9yXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGJvb2wgZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIGludCBGcmFtZXNQZXJUaWNrID0gMDtcclxuICAgICAgICBwdWJsaWMgRW50aXR5IGVudGl0eTtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIEJlaGF2aW9yTmFtZSB7IGdldDsgcHJvdGVjdGVkIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBFbnRpdHlCZWhhdmlvcihFbnRpdHkgZW50aXR5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XHJcbiAgICAgICAgICAgIGlmIChCZWhhdmlvck5hbWUgPT0gXCJcIiB8fCBCZWhhdmlvck5hbWUgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZHluYW1pYyB0ZXN0ID0gR2V0VHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIEZOID0gU2NyaXB0LldyaXRlPHN0cmluZz4oXCJ0ZXN0W1xcXCIkJGZ1bGxuYW1lXFxcIl1cIik7XHJcbiAgICAgICAgICAgICAgICBIZWxwZXIuTG9nKFwiRk46XCIrRk4pO1xyXG4gICAgICAgICAgICAgICAgc3RyaW5nW10gcyA9IEZOLlNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgICAgIEJlaGF2aW9yTmFtZSA9IHNbcy5MZW5ndGgtMV07XHJcbiAgICAgICAgICAgICAgICAvL0JlaGF2aW9yTmFtZSA9IEdldFR5cGUoKS5GdWxsTmFtZTtcclxuICAgICAgICAgICAgICAgIC8vR2V0VHlwZSgpLkdldENsYXNzTmFtZVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBEcmF3KENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgU2VuZEN1c3RvbUV2ZW50KGR5bmFtaWMgZXZ0LGJvb2wgdHJpZ2dlcmZsdXNoPWZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZHluYW1pYyBEID0gbmV3IG9iamVjdCgpO1xyXG4gICAgICAgICAgICBELkkgPSBlbnRpdHkuSUQ7XHJcbiAgICAgICAgICAgIEQuRCA9IGV2dDtcclxuICAgICAgICAgICAgLy9ELlQgPSB0aGlzLkdldFR5cGUoKS5GdWxsTmFtZTtcclxuICAgICAgICAgICAgRC5UID0gQmVoYXZpb3JOYW1lO1xyXG4gICAgICAgICAgICBlbnRpdHkuR2FtZS5TZW5kRXZlbnQoXCJDQkVcIiwgRCx0cmlnZ2VyZmx1c2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIEN1c3RvbUV2ZW50KGR5bmFtaWMgZXZ0KVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBbmltYXRpb25cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTGlzdDxIVE1MSW1hZ2VFbGVtZW50PiBJbWFnZXM7XHJcbiAgICAgICAgcHJvdGVjdGVkIEhUTUxJbWFnZUVsZW1lbnQgX2N1cnJlbnRJbWFnZTtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBDdXJyZW50SW1hZ2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2N1cnJlbnRJbWFnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9jdXJyZW50SW1hZ2UgIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQnVmZmVyTmVlZHNSZWRyYXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX2N1cnJlbnRJbWFnZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgQ3VycmVudEZyYW1lO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBJbWFnZVNwZWVkO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFBvc2l0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgQW5pbWF0aW9uVGltZUVsYXBzZWQ7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFhcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUG9zaXRpb24uWDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24uWCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uLlkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgU3RyZXRjaFdpZHRoID0gMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgU3RyZXRjaEhlaWdodCA9IDA7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFJvdGF0aW9uID0gMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgQWxwaGEgPSAxO1xyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBMb29waW5nID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgYm9vbCBMb29wZWQgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgYm9vbCBGcmFtZUNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgYm9vbCBGbGlwcGVkID0gZmFsc2U7XHJcbiAgICAgICAgcHJvdGVjdGVkIGJvb2wgX3RyYW5zZm9ybWVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBmbG9hdCBfc2hhZG93O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBTaGFkb3dcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9zaGFkb3cgIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3NoYWRvdyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIEJ1ZmZlck5lZWRzUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc3RyaW5nIF9zaGFkb3dDb2xvcjtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIFNoYWRvd2NvbG9yXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zaGFkb3dDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9zaGFkb3dDb2xvciAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfc2hhZG93Q29sb3IgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBCdWZmZXJOZWVkc1JlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBib29sIEJ1ZmZlck5lZWRzUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgICBwcm90ZWN0ZWQgc3RyaW5nIF9odWVDb2xvcjtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIEh1ZUNvbG9yXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9odWVDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9odWVDb2xvciAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBCdWZmZXJOZWVkc1JlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfaHVlQ29sb3IgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBmbG9hdCBfaHVlUmVjb2xvclN0cmVuZ3RoO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBIdWVSZWNvbG9yU3RyZW5ndGhcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2h1ZVJlY29sb3JTdHJlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9odWVSZWNvbG9yU3RyZW5ndGggIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQnVmZmVyTmVlZHNSZWRyYXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX2h1ZVJlY29sb3JTdHJlbmd0aCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgSFRNTENhbnZhc0VsZW1lbnQgX2J1ZmZlcjtcclxuICAgICAgICBwcm90ZWN0ZWQgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIF9iZztcclxuXHJcbiAgICAgICAgcHVibGljIEFuaW1hdGlvbihMaXN0PEhUTUxJbWFnZUVsZW1lbnQ+IGRhdGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBJbWFnZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICBpZiAoSW1hZ2VzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEltYWdlcyA9IG5ldyBMaXN0PEhUTUxJbWFnZUVsZW1lbnQ+KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgSW1hZ2VTcGVlZCA9IDFmO1xyXG4gICAgICAgICAgICBQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgICAgIEFuaW1hdGlvblRpbWVFbGFwc2VkID0gMDtcclxuICAgICAgICAgICAgU2hhZG93ID0gMDtcclxuICAgICAgICAgICAgU2hhZG93Y29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgSHVlQ29sb3IgPSBcIlwiO1xyXG4gICAgICAgICAgICBIdWVSZWNvbG9yU3RyZW5ndGggPSAwLjZmO1xyXG4gICAgICAgICAgICBfYnVmZmVyID0gbmV3IEhUTUxDYW52YXNFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIF9iZyA9IF9idWZmZXIuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIGlmIChJbWFnZXMuQ291bnQgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTZXRJbWFnZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBIVE1MSW1hZ2VFbGVtZW50IExJID0gQ3VycmVudEltYWdlO1xyXG4gICAgICAgICAgICBpbnQgbGFzdCA9IChpbnQpQ3VycmVudEZyYW1lO1xyXG4gICAgICAgICAgICBDdXJyZW50RnJhbWUgKz0gSW1hZ2VTcGVlZDtcclxuICAgICAgICAgICAgaW50IGN1cnJlbnQgPSAoaW50KUN1cnJlbnRGcmFtZTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnQgIT0gbGFzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEltYWdlcy5Db3VudCA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQgPj0gSW1hZ2VzLkNvdW50ICYmIGN1cnJlbnQ+MClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChMb29waW5nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50IC09IEltYWdlcy5Db3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEN1cnJlbnRGcmFtZSAtPSBJbWFnZXMuQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDdXJyZW50RnJhbWUgLT0gSW1hZ2VTcGVlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY3VycmVudCA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ICs9IEltYWdlcy5Db3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ3VycmVudEZyYW1lICs9IEltYWdlcy5Db3VudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBTZXRJbWFnZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBMb29wZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKExJICE9IEN1cnJlbnRJbWFnZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRnJhbWVDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICgoSW1hZ2VTcGVlZD4wICYmIGN1cnJlbnQgPT0gMCkgfHwgKChJbWFnZVNwZWVkIDwgMCAmJiBjdXJyZW50ID09IEltYWdlcy5Db3VudC0xKSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9vcGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZyYW1lQ2hhbmdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEFuaW1hdGlvblRpbWVFbGFwc2VkKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENoYW5nZUFuaW1hdGlvbihMaXN0PEhUTUxJbWFnZUVsZW1lbnQ+IGFuaSxib29sIHJlc2V0PXRydWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAocmVzZXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBBbmltYXRpb25UaW1lRWxhcHNlZCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgSW1hZ2VzID0gYW5pO1xyXG4gICAgICAgICAgICAvL0N1cnJlbnRJbWFnZSA9IEltYWdlc1soaW50KUN1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgIFNldEltYWdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNldEltYWdlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChJbWFnZXMuQ291bnQgPCAyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxuID0gSW1hZ2VzLkNvdW50O1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKEN1cnJlbnRGcmFtZSA8IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ3VycmVudEZyYW1lICs9IGxuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKEN1cnJlbnRGcmFtZSA+PSBsbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDdXJyZW50RnJhbWUgLT0gbG47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW50IGN1cnJlbnQgPSAoaW50KUN1cnJlbnRGcmFtZTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnQgPj0gMCAmJiBjdXJyZW50IDwgSW1hZ2VzLkNvdW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDdXJyZW50SW1hZ2UgPSBJbWFnZXNbY3VycmVudF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERyYXcoZywgUG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnLFZlY3RvcjIgcG9zaXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCB4ID0gcG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgeSA9IHBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGlmIChDdXJyZW50SW1hZ2UgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50IGN1cnJlbnQgPSAoaW50KUN1cnJlbnRGcmFtZTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID49IDAgJiYgY3VycmVudCA8IEltYWdlcy5Db3VudClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDdXJyZW50SW1hZ2UgPSBJbWFnZXNbY3VycmVudF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoQ3VycmVudEltYWdlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZsb2F0IFggPSB4O1xyXG4gICAgICAgICAgICBmbG9hdCBZID0geTtcclxuICAgICAgICAgICAgZmxvYXQgbGFzdGFscGhhID0gZy5HbG9iYWxBbHBoYTtcclxuICAgICAgICAgICAgYm9vbCBjZW50ZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBib29sIHVzZUJ1ZmZlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoSHVlQ29sb3IgIT0gXCJcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEJ1ZmZlck5lZWRzUmVkcmF3KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvb2wgYWR2ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBfYmcuR2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gQ2FudmFzVHlwZXMuQ2FudmFzQ29tcG9zaXRlT3BlcmF0aW9uVHlwZS5Tb3VyY2VPdmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIF9idWZmZXIuV2lkdGggPSBDdXJyZW50SW1hZ2UuV2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1ZmZlci5IZWlnaHQgPSBDdXJyZW50SW1hZ2UuSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5EcmF3SW1hZ2UoQ3VycmVudEltYWdlLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5HbG9iYWxBbHBoYSA9IEh1ZVJlY29sb3JTdHJlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBfYmcuR2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gQ2FudmFzVHlwZXMuQ2FudmFzQ29tcG9zaXRlT3BlcmF0aW9uVHlwZS5IdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgX2JnLkZpbGxTdHlsZSA9IEh1ZUNvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5GaWxsUmVjdCgwLCAwLCBfYnVmZmVyLldpZHRoLCBfYnVmZmVyLkhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhZHYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYmcuR2xvYmFsQWxwaGEgPSAoMSArIEh1ZVJlY29sb3JTdHJlbmd0aCkgLyAyZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2JnLkdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IENhbnZhc1R5cGVzLkNhbnZhc0NvbXBvc2l0ZU9wZXJhdGlvblR5cGUuU291cmNlT3ZlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2JnLkZpbGxSZWN0KDAsIDAsIF9idWZmZXIuV2lkdGgsIF9idWZmZXIuSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5HbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFkdilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iZy5HbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBDYW52YXNUeXBlcy5DYW52YXNDb21wb3NpdGVPcGVyYXRpb25UeXBlLkx1bWlub3NpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iZy5EcmF3SW1hZ2UoQ3VycmVudEltYWdlLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJ0aGlzLl9iZy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24taW4nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5EcmF3SW1hZ2UoQ3VycmVudEltYWdlLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhZHYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYmcuR2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gQ2FudmFzVHlwZXMuQ2FudmFzQ29tcG9zaXRlT3BlcmF0aW9uVHlwZS5IdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iZy5HbG9iYWxBbHBoYSA9IEh1ZVJlY29sb3JTdHJlbmd0aCAqIDAuNGY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iZy5EcmF3SW1hZ2UoQ3VycmVudEltYWdlLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHVzZUJ1ZmZlciA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKEFscGhhIDwgMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEFscGhhIDw9IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IGcuR2xvYmFsQWxwaGEgKiBBbHBoYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2lmIChyb3RhdGlvbiAhPSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCB4MiA9IEN1cnJlbnRJbWFnZS5XaWR0aCAvIDJmO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgeTIgPSBDdXJyZW50SW1hZ2UuSGVpZ2h0IC8gMmY7XHJcblxyXG4gICAgICAgICAgICAgICAgWCA9IC14MjtcclxuICAgICAgICAgICAgICAgIFkgPSAteTI7XHJcbiAgICAgICAgICAgICAgICBpZiAoIV90cmFuc2Zvcm1lZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBnLlNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZy5UcmFuc2xhdGUoeCArIHgyLCB5ICsgeTIpO1xyXG4gICAgICAgICAgICAgICAgY2VudGVyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZy5Sb3RhdGUoUm90YXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChGbGlwcGVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIV90cmFuc2Zvcm1lZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBnLlNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZy5TY2FsZSgtMSwgMSk7XHJcbiAgICAgICAgICAgICAgICAvL2Rvbid0IHRyYW5zbGF0ZSBpZiBpdCdzIGNlbnRlcmVkLlxyXG4gICAgICAgICAgICAgICAgaWYgKCFjZW50ZXJlZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBnLlRyYW5zbGF0ZShDdXJyZW50SW1hZ2UuV2lkdGgsIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChTaGFkb3c+MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZy5TaGFkb3dCbHVyID0gU2hhZG93O1xyXG4gICAgICAgICAgICAgICAgZy5TaGFkb3dDb2xvciA9IFNoYWRvd2NvbG9yO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF1c2VCdWZmZXIgJiYgQnVmZmVyTmVlZHNSZWRyYXcpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2JnLlNoYWRvd0JsdXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIF9idWZmZXIuV2lkdGggPSBDdXJyZW50SW1hZ2UuV2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1ZmZlci5IZWlnaHQgPSBDdXJyZW50SW1hZ2UuSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIF9iZy5EcmF3SW1hZ2UoQ3VycmVudEltYWdlLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZUJ1ZmZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9CdWZmZXJOZWVkc1JlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB1c2VCdWZmZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy9pZiAoKHVzZUJ1ZmZlciAmJiBCdWZmZXJOZWVkc1JlZHJhdykgfHwgUm90YXRpb24hPTAgfHwgdHJ1ZSlcclxuICAgICAgICAgICAgICAgIGlmIChCdWZmZXJOZWVkc1JlZHJhdylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBDID0gSGVscGVyLkNsb25lQ2FudmFzKF9idWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBDRyA9IEhlbHBlci5HZXRDb250ZXh0KEMpO1xyXG4gICAgICAgICAgICAgICAgICAgIF9idWZmZXIuV2lkdGggKz0gKGludCkoU2hhZG93ICogMik7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1ZmZlci5IZWlnaHQgKz0gKGludCkoU2hhZG93ICogMik7XHJcbiAgICAgICAgICAgICAgICAgICAgX2JnLlNoYWRvd0JsdXIgPSBTaGFkb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgX2JnLlNoYWRvd0NvbG9yID0gU2hhZG93Y29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd1dpdGhTaGFkb3dzKF9iZywgQywgU2hhZG93LCBTaGFkb3csIDAsIDAsIFNoYWRvdyAvIDNmKTtcclxuICAgICAgICAgICAgICAgICAgICB1c2VCdWZmZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgWCAtPSBTaGFkb3c7XHJcbiAgICAgICAgICAgICAgICBZIC09IFNoYWRvdztcclxuICAgICAgICAgICAgICAgIGcuU2hhZG93Qmx1ciA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChTdHJldGNoV2lkdGggPT0gMCAmJiBTdHJldGNoSGVpZ2h0ID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChTaGFkb3cgPiAwICYmIGZhbHNlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWMgSSA9IEN1cnJlbnRJbWFnZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlQnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBJID0gX2J1ZmZlcjtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3V2l0aFNoYWRvd3MoZywgSSwgWCwgWSwgMCwwLCBTaGFkb3cgLyAzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZUJ1ZmZlcilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGcuRHJhd0ltYWdlKEN1cnJlbnRJbWFnZSwgWCwgWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGcuRHJhd0ltYWdlKF9idWZmZXIsIFgsIFkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChTaGFkb3cgPiAwICYmIGZhbHNlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWMgSSA9IEN1cnJlbnRJbWFnZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlQnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBJID0gX2J1ZmZlcjtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3V2l0aFNoYWRvd3MoZywgSSwgWCwgWSwgU3RyZXRjaFdpZHRoLCBTdHJldGNoSGVpZ2h0LCBTaGFkb3cgLyAzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZUJ1ZmZlcilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGcuRHJhd0ltYWdlKEN1cnJlbnRJbWFnZSwgWCwgWSwgU3RyZXRjaFdpZHRoLCBTdHJldGNoSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZy5EcmF3SW1hZ2UoX2J1ZmZlciwgWCwgWSwgU3RyZXRjaFdpZHRoLCBTdHJldGNoSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF90cmFuc2Zvcm1lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZy5SZXN0b3JlKCk7XHJcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoU2hhZG93ID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZy5TaGFkb3dCbHVyID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQWxwaGEgPCAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gbGFzdGFscGhhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEJ1ZmZlck5lZWRzUmVkcmF3ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgdm9pZCBkcmF3V2l0aFNoYWRvd3MoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcsIGR5bmFtaWMgSSxmbG9hdCBYLGZsb2F0IFksZmxvYXQgVyxmbG9hdCBILGZsb2F0IHNpemUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVyA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXID0gSS53aWR0aDtcclxuICAgICAgICAgICAgICAgIEggPSBJLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnLlNoYWRvd09mZnNldFggPSAtc2l6ZTtcclxuICAgICAgICAgICAgZy5EcmF3SW1hZ2UoSSwgWCwgWSwgVywgSCk7XHJcbiAgICAgICAgICAgIGcuU2hhZG93T2Zmc2V0WCA9IHNpemU7XHJcbiAgICAgICAgICAgIGcuRHJhd0ltYWdlKEksIFgsIFksIFcsIEgpO1xyXG4gICAgICAgICAgICBnLlNoYWRvd09mZnNldFggPSAwO1xyXG4gICAgICAgICAgICBnLlNoYWRvd09mZnNldFkgPSAtc2l6ZTtcclxuICAgICAgICAgICAgZy5EcmF3SW1hZ2UoSSwgWCwgWSwgVywgSCk7XHJcbiAgICAgICAgICAgIGcuU2hhZG93T2Zmc2V0WSA9IHNpemU7XHJcbiAgICAgICAgICAgIGcuRHJhd0ltYWdlKEksIFgsIFksIFcsIEgpO1xyXG5cclxuICAgICAgICAgICAgZy5TaGFkb3dPZmZzZXRZID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBbmltYXRpb25Mb2FkZXJcclxuICAgIHtcclxuICAgICAgICBwcm90ZWN0ZWQgRGljdGlvbmFyeTxzdHJpbmcsIExpc3Q8SFRNTEltYWdlRWxlbWVudD4+IF9kYXRhO1xyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aWMgQW5pbWF0aW9uTG9hZGVyIF9fdGhpcztcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEFuaW1hdGlvbkxvYWRlciBfdGhpc1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfX3RoaXMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfX3RoaXMgPSBuZXcgQW5pbWF0aW9uTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIkFuaW1hdGlvbiBsb2FkZXIgbm90IGluaXRpYXRlZC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX190aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBKU09OQXJjaGl2ZSBBcmNoaXZlO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBJbml0KEpTT05BcmNoaXZlIEFyY2hpdmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfX3RoaXMgPSBuZXcgQW5pbWF0aW9uTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIF9fdGhpcy5BcmNoaXZlID0gQXJjaGl2ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBBbmltYXRpb25Mb2FkZXIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX2RhdGEgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIExpc3Q8SFRNTEltYWdlRWxlbWVudD4+KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTGlzdDxIVE1MSW1hZ2VFbGVtZW50PiBHZXQoc3RyaW5nIGFuaSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5HZXRBbmltYXRpb24oYW5pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIExpc3Q8SFRNTEltYWdlRWxlbWVudD4gR2V0QW5pbWF0aW9uKHN0cmluZyBhbmkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoX2RhdGEuQ29udGFpbnNLZXkoYW5pKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9kYXRhW2FuaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIEEgPSBuZXcgTGlzdDxIVE1MSW1hZ2VFbGVtZW50PigpO1xyXG4gICAgICAgICAgICB2YXIgSSA9IEFyY2hpdmUuR2V0SW1hZ2UoYW5pICsgXCIucG5nXCIpO1xyXG4gICAgICAgICAgICBpZiAoSSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBLkFkZChJKTtcclxuICAgICAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGogPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIFNhbmkgPSBhbmkgKyBcIl9cIjtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEkgPSBBcmNoaXZlLkdldEltYWdlKFNhbmkgKyAoaisrKSArIFwiLnBuZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoSSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEEuQWRkKEkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLypkb1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEkgPSBBcmNoaXZlLkdldEltYWdlKGFuaSArIFwiX1wiICsgaiArIFwiLnBuZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoSSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQS5BZGQoSSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoSSAhPSBudWxsKTsqL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF9kYXRhW2FuaV0gPSBBO1xyXG4gICAgICAgICAgICByZXR1cm4gQTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IEZyYW1lID0gMDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IERpdjtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENhbnZhcztcclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgZ3VpQ2FudmFzO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZ3VpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgUmVjdGFuZ2xlIFNjcmVlbkJvdW5kcztcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBKU09OQXJjaGl2ZSBKU09OO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIEc7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgVGFyZ2V0QXNwZWN0O1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBkb3VibGUgX2xTaXplID0gLTE7XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0YXRpYyBkb3VibGUgX21pc3NpbmdUaW1lID0gMDtcclxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGljIGRvdWJsZSBfbFRpbWUgPSAtMTtcclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIHN0YXRpYyBib29sIF9mcmFtZVJlbmRlcmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aWMgYm9vbCBfZ2FtZVJlbmRlcmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSW5wdXRDb250cm9sbGVyIElDO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR2FtZVNwcml0ZSBDdXJyZW50VmlldztcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgR2FtZU5hbWUgPSBcIkNpcm5vJ3MgTXlzdGVyaW91cyBUb3dlclwiO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nIEdhbWVWZXJzaW9uID0gXCIwLjFcIjtcclxuICAgICAgICAvKiNpZiBERUJVR1xyXG4gICAgICAgICAgICAgICAgcHVibGljIHN0YXRpYyBib29sIERFQlVHID0gdHJ1ZTtcclxuICAgICAgICAjZWxzZVxyXG4gICAgICAgICAgICAgICAgcHVibGljIHN0YXRpYyBib29sIERFQlVHID0gZmFsc2U7XHJcbiAgICAgICAgI2VuZGlmKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgREVCVUcgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL1VTRSBUSEUgSlNPTiBaSVAgQVJDSElWRSBGRUFUVVJFIEZST00gQk5URVNUIEZPUiBMT0FESU5HIElNQUdFUyBBTkQgRklMRVMuXHJcblxyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlLkNzc1RleHQgPSBcIm92ZXJmbG93OiBoaWRkZW47bWFyZ2luOiAwO3BhZGRpbmc6IDA7XCI7XHJcbiAgICAgICAgICAgIEdhbWVQYWRNYW5hZ2VyLl90aGlzID0gbmV3IEdhbWVQYWRNYW5hZ2VyKCk7XHJcbiAgICAgICAgICAgIEdhbWVQYWRNYW5hZ2VyLl90aGlzLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBHbG9iYWwuU2V0VGltZW91dCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBHYW1lUGFkTWFuYWdlci5fdGhpcy5VcGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBJQyA9IElucHV0Q29udHJvbGxlck1hbmFnZXIuX3RoaXMuQ29udHJvbGxlcnNbMF07XHJcbiAgICAgICAgICAgICAgICBJbnB1dE1hcCBJTSA9IElucHV0Q29udHJvbGxlck1hbmFnZXIuX3RoaXMuQ29udHJvbGxlcnNbMF0uSW5wdXRNYXBwaW5nWzJdO1xyXG4gICAgICAgICAgICAgICAgLypJTS5tYXAgPSAwO1xyXG4gICAgICAgICAgICAgICAgSU0uY29udHJvbGxlcklEID0gXCJNb3VzZVwiOyovXHJcblxyXG4gICAgICAgICAgICAgICAgLypJTSA9IElucHV0Q29udHJvbGxlck1hbmFnZXIuX3RoaXMuQ29udHJvbGxlcnNbMF0uSW5wdXRNYXBwaW5nWzNdO1xyXG4gICAgICAgICAgICAgICAgSU0ubWFwID0gMDtcclxuICAgICAgICAgICAgICAgIElNLmNvbnRyb2xsZXJJRCA9IFwiTW91c2VcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3BvaW50ZXIgY29udHJvbHNcclxuICAgICAgICAgICAgICAgIElNID0gSW5wdXRDb250cm9sbGVyTWFuYWdlci5fdGhpcy5Db250cm9sbGVyc1swXS5JbnB1dE1hcHBpbmdbNF07XHJcbiAgICAgICAgICAgICAgICBJTS5tYXAgPSAyO1xyXG4gICAgICAgICAgICAgICAgSU0uY29udHJvbGxlcklEID0gXCJNb3VzZVwiO1xyXG5cclxuICAgICAgICAgICAgICAgIElNID0gSW5wdXRDb250cm9sbGVyTWFuYWdlci5fdGhpcy5Db250cm9sbGVyc1swXS5JbnB1dE1hcHBpbmdbNV07XHJcbiAgICAgICAgICAgICAgICBJTS5tYXAgPSAxO1xyXG4gICAgICAgICAgICAgICAgSU0uY29udHJvbGxlcklEID0gXCJNb3VzZVwiOyovXHJcblxyXG4gICAgICAgICAgICAgICAgLypJTSA9IElucHV0Q29udHJvbGxlck1hbmFnZXIuX3RoaXMuQ29udHJvbGxlcnNbMF0uSW5wdXRNYXBwaW5nWzNdO1xyXG4gICAgICAgICAgICAgICAgSU0ubWFwID0gMjtcclxuICAgICAgICAgICAgICAgIElNLmNvbnRyb2xsZXJJRCA9IFwiTW91c2VcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3BvaW50ZXIgY29udHJvbHNcclxuICAgICAgICAgICAgICAgIElNID0gSW5wdXRDb250cm9sbGVyTWFuYWdlci5fdGhpcy5Db250cm9sbGVyc1swXS5JbnB1dE1hcHBpbmdbNF07XHJcbiAgICAgICAgICAgICAgICBJTS5tYXAgPSAxO1xyXG4gICAgICAgICAgICAgICAgSU0uY29udHJvbGxlcklEID0gXCJNb3VzZVwiO1xyXG5cclxuICAgICAgICAgICAgICAgIElNID0gSW5wdXRDb250cm9sbGVyTWFuYWdlci5fdGhpcy5Db250cm9sbGVyc1swXS5JbnB1dE1hcHBpbmdbNV07XHJcbiAgICAgICAgICAgICAgICBJTS5tYXAgPSAxO1xyXG4gICAgICAgICAgICAgICAgSU0uY29udHJvbGxlcklEID0gXCJNb3VzZVwiOyovXHJcblxyXG4gICAgICAgICAgICAgICAgLy8vQ3VycmVudFZpZXcgPSBuZXcgVGl0bGVTY3JlZW4oKTtcclxuXHJcbiAgICAgICAgICAgIH0pLCA1KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvayA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgdXB0ZXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgSlNPTkFyY2hpdmUuT3BlbihcIkFzc2V0cy9JbWFnZXMuSlNPTlwiLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6Q2lybm9HYW1lLkpTT05BcmNoaXZlPikoanNvbiA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBKU09OID0ganNvbjtcclxuXHJcbiAgICAgICAgICAgICAgICBKU09OLlByZWxvYWRJbWFnZXMoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgRmluaXNoKCk7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBIVE1MIEJ1dHRvblxyXG4gICAgICAgICAgICAvKnZhciBidXR0b24gPSBEb2N1bWVudC5DcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHRoZSBCdXR0b24gdGV4dFxyXG4gICAgICAgICAgICBidXR0b24uSW5uZXJIVE1MID0gXCJDbGljayBNZVwiO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGEgQ2xpY2sgZXZlbnQgaGFuZGxlclxyXG4gICAgICAgICAgICBidXR0b24uT25DbGljayA9IChldikgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gV3JpdGUgYSBtZXNzYWdlIHRvIHRoZSBDb25zb2xlXHJcbiAgICAgICAgICAgICAgICAvL0NvbnNvbGUuV3JpdGVMaW5lKFwiV2VsY29tZSB0byBCcmlkZ2UuTkVUXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9rKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IGRpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIEpTT04uSW1hZ2VzLktleXMuRm9yRWFjaChmID0+XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuQXBwZW5kQ2hpbGQoSlNPTi5HZXRJbWFnZShmKS5DbG9uZU5vZGUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChkaXYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHRoZSBidXR0b24gdG8gdGhlIGRvY3VtZW50IGJvZHlcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChidXR0b24pOyovXHJcblxyXG4gICAgICAgICAgICAvLyBBZnRlciBidWlsZGluZyAoQ3RybCArIFNoaWZ0ICsgQikgdGhpcyBwcm9qZWN0LCBcclxuICAgICAgICAgICAgLy8gYnJvd3NlIHRvIHRoZSAvYmluL0RlYnVnIG9yIC9iaW4vUmVsZWFzZSBmb2xkZXIuXHJcblxyXG4gICAgICAgICAgICAvLyBBIG5ldyBicmlkZ2UvIGZvbGRlciBpcyBjcmVhdGVkIGFuZCBjb250YWluc1xyXG4gICAgICAgICAgICAvLyB5b3VyIHByb2plY3RzIEphdmFTY3JpcHQgZmlsZXMuIFxyXG5cclxuICAgICAgICAgICAgLy8gT3BlbiB0aGUgYnJpZGdlL2luZGV4Lmh0bWwgZmlsZSBpbiBhIGJyb3dlciBieVxyXG4gICAgICAgICAgICAvLyBSaWdodC1DbGljayA+IE9wZW4gV2l0aC4uLiwgdGhlbiBjaG9vc2UgYVxyXG4gICAgICAgICAgICAvLyB3ZWIgYnJvd3NlciBmcm9tIHRoZSBsaXN0XHJcblxyXG4gICAgICAgICAgICAvLyBUaGlzIGFwcGxpY2F0aW9uIHdpbGwgdGhlbiBydW4gaW4gYSBicm93c2VyLlxyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRmluaXNoKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEFuaW1hdGlvbkxvYWRlci5Jbml0KEpTT04pO1xyXG4gICAgICAgICAgICB2YXIgTFQgPSBEb2N1bWVudC5HZXRFbGVtZW50QnlJZChcImxvYWR0ZXh0XCIpLkFzPEhUTUxQYXJhZ3JhcGhFbGVtZW50PigpO1xyXG4gICAgICAgICAgICBMVC5UZXh0Q29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuU3R5bGUuQ3Vyc29yID0gQ3Vyc29yLkF1dG87XHJcbiAgICAgICAgICAgIERvY3VtZW50LlRpdGxlID0gR2FtZU5hbWUgKyBcIiBcIiArIEdhbWVWZXJzaW9uICsgXCIgYnk6UlNHbWFrZXJcIjtcclxuICAgICAgICAgICAgLy92YXIgUiA9IG5ldyBSZW5kZXJlcigpO1xyXG4gICAgICAgICAgICAvL0RvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoUi52aWV3KTtcclxuXHJcbiAgICAgICAgICAgIERpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCgpO1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBDYW52ID0gbmV3IEhUTUxDYW52YXNFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIENhbnZhcyA9IENhbnY7XHJcbiAgICAgICAgICAgIFRhcmdldEFzcGVjdCA9IDAuNzU7XHJcbiAgICAgICAgICAgIC8vQ2Fudi5XaWR0aCA9IDIwMDtcclxuICAgICAgICAgICAgQ2Fudi5XaWR0aCA9IDEwMjQ7XHJcbiAgICAgICAgICAgIC8vQ2Fudi5XaWR0aCA9IDEyODA7XHJcbiAgICAgICAgICAgIENhbnYuSGVpZ2h0ID0gKGludCkoQ2Fudi5XaWR0aCAqIFRhcmdldEFzcGVjdCk7XHJcbiAgICAgICAgICAgIFNjcmVlbkJvdW5kcyA9IG5ldyBSZWN0YW5nbGUoMCwgMCwgQ2Fudi5XaWR0aCwgQ2Fudi5IZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgRGl2LkFwcGVuZENoaWxkKENhbnYpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKERpdik7XHJcbiAgICAgICAgICAgIC8vRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChDYW52KTtcclxuICAgICAgICAgICAgRyA9IENhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuXHJcbiAgICAgICAgICAgIEcuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIENhbnZhcy5TdHlsZS5JbWFnZVJlbmRlcmluZyA9IEltYWdlUmVuZGVyaW5nLlBpeGVsYXRlZDtcclxuICAgICAgICAgICAgdmFyIGdnID0gRztcclxuICAgICAgICAgICAgU2NyaXB0LldyaXRlKFwiZ2cud2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcIik7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcImdnLm1vekltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlXCIpO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIEtleWJvYXJkTWFuYWdlci5Jbml0KCk7XHJcblxyXG4gICAgICAgICAgICBDdXJyZW50VmlldyA9IG5ldyBHYW1lKCk7XHJcblxyXG4gICAgICAgICAgICBBY3Rpb24gT25GID0gUkFGO1xyXG4gICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoT25GKTtcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIHVwZGF0ZVdpbmRvdygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL3ZhciBSID0gV2luZG93LklubmVyV2lkdGggLyBXaW5kb3cuSW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgICAgIGRvdWJsZSBzaXplID0gTWF0aC5DZWlsaW5nKFdpbmRvdy5Jbm5lckhlaWdodCAqICgxIC8gVGFyZ2V0QXNwZWN0KSk7XHJcbiAgICAgICAgICAgIGlmIChzaXplICE9IF9sU2l6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLypDYW52YXMuU3R5bGUuV2lkdGggPSBzaXplICsgXCJweFwiO1xyXG5cclxuICAgICAgICAgICAgICAgIENhbnZhcy5TdHlsZS5Qb3NpdGlvbiA9IFBvc2l0aW9uLkFic29sdXRlO1xyXG4gICAgICAgICAgICAgICAgQ2FudmFzLlN0eWxlLkxlZnQgPSAoKFdpbmRvdy5Jbm5lcldpZHRoIC8gMikgLSAoc2l6ZSAvIDIpKSArIFwicHhcIjsqL1xyXG4gICAgICAgICAgICAgICAgQ2FudmFzLlN0eWxlLldpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgICAgICAgICBEaXYuU3R5bGUuV2lkdGggPSBzaXplICsgXCJweFwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vRGl2LlN0eWxlLlBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGU7XHJcbiAgICAgICAgICAgICAgICBEaXYuU3R5bGUuUG9zaXRpb24gPSBQb3NpdGlvbi5SZWxhdGl2ZTtcclxuICAgICAgICAgICAgICAgIERpdi5TdHlsZS5MZWZ0ID0gKChXaW5kb3cuSW5uZXJXaWR0aCAvIDIpIC0gKHNpemUgLyAyKSkgKyBcInB4XCI7XHJcbiAgICAgICAgICAgICAgICBzaXplID0gX2xTaXplO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aWMgdm9pZCBVcGRhdGVJbnB1dHMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKElDICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBMID0gSW5wdXRDb250cm9sbGVyTWFuYWdlci5fdGhpcy5Db250cm9sbGVycztcclxuICAgICAgICAgICAgICAgIGlmIChMLkNvdW50ID4gMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvKkxpc3Q8aW50PiBrZXlzID0gS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlRhcHBlZEJ1dHRvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleXMuQ29udGFpbnMoMTA3KSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludCBpbmRleCA9IEwuSW5kZXhPZihJQyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSBMLkNvdW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCAtPSBMLkNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIElDID0gTFtpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlzLkNvbnRhaW5zKDEwOSkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnQgaW5kZXggPSBMLkluZGV4T2YoSUMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCArPSBMLkNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIElDID0gTFtpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgS2V5Ym9hcmRNYW5hZ2VyLlVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGljIHZvaWQgVXBkYXRlKGRvdWJsZSB0aW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZG91YmxlIGRlbHRhID0gMDtcclxuICAgICAgICAgICAgaWYgKHRpbWUgPj0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9sVGltZSA8IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2xUaW1lID0gdGltZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL21pc3NpbmdUaW1lIC09IDE2LjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlbHRhID0gKHRpbWUgLSBfbFRpbWUpO1xyXG4gICAgICAgICAgICAgICAgX21pc3NpbmdUaW1lICs9IChkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoQ3VycmVudFZpZXcgaXMgR2FtZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgRyA9IChHYW1lKUN1cnJlbnRWaWV3O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChHLnJ1bm5pbmcpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBHLnRvdGFsVGltZSArPSAoZmxvYXQpZGVsdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChHLnRpbWVSZW1haW5pbmcgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRy50aW1lUmVtYWluaW5nIC09IChmbG9hdClkZWx0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEcudGltZVJlbWFpbmluZyA8PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRy50aW1lUmVtYWluaW5nID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdXBkYXRlV2luZG93KCk7XHJcbiAgICAgICAgICAgIC8qaWYgKGRlbHRhID4gMjIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIExhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICgvKnVzZVJBRiB8fCAqL19taXNzaW5nVGltZSA+IDEyLyogfHwgKF9mcmFtZVJlbmRlcmVkICYmIF9taXNzaW5nVGltZSA+IDApKi8pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChDdXJyZW50VmlldyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEN1cnJlbnRWaWV3LlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIF9taXNzaW5nVGltZSAtPSAxNi42NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njc7XHJcbiAgICAgICAgICAgICAgICBfZnJhbWVSZW5kZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgX2dhbWVSZW5kZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfbFRpbWUgPSB0aW1lO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aW1lID49IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfbWlzc2luZ1RpbWUgPj0gMzAwMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfbWlzc2luZ1RpbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKF9taXNzaW5nVGltZSA+PSAxMDAwMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0dhbWUgaXMgbGFnZ2luZyB0b28gbXVjaCB0byBwcm9wZXJseSBwbGF5IG11bHRpcGxheWVyLlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZG91YmxlIFQgPSAxNi42NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njc7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJ1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUICs9IDg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoX21pc3NpbmdUaW1lID49IFQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEN1cnJlbnRWaWV3ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDdXJyZW50Vmlldy5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgX21pc3NpbmdUaW1lIC09IDE2LjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLy9nYW1lLlJlbmRlcigpO1xyXG4gICAgICAgICAgICAvL2dhbWUuRHJhdyhnKTtcclxuICAgICAgICAgICAgX2xUaW1lID0gdGltZTtcclxuICAgICAgICAgICAgRnJhbWUrKztcclxuICAgICAgICAgICAgRy5DbGVhcigpO1xyXG4gICAgICAgICAgICBHYW1lUGFkTWFuYWdlci5fdGhpcy5VcGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKEN1cnJlbnRWaWV3ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgQ3VycmVudFZpZXcuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBDdXJyZW50Vmlldy5SZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIEcuRHJhd0ltYWdlKEN1cnJlbnRWaWV3LnNwcml0ZUJ1ZmZlciwgMGYsIDBmLENhbnZhcy5XaWR0aCxDYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL0cuRmlsbFN0eWxlID0gXCJcIitDb252ZXJ0LiBGcmFtZTtcclxuICAgICAgICAgICAgLy9HLkZpbGxTdHlsZSA9IFwiI1wiICsgRnJhbWUuVG9TdHJpbmcoXCJYNlwiKTtcclxuICAgICAgICAgICAgLypHLkZpbGxTdHlsZSA9IFwiI1wiICsgQ29sb3JGcm9tQWhzYigxLChGcmFtZS8yKSAlIDM2MCwwLjhmLDAuN2YpLlRvU3RyaW5nKFwiWDZcIik7XHJcbiAgICAgICAgICAgIEcuRmlsbFJlY3QoMCwgMCwgRy5DYW52YXMuV2lkdGgsIEcuQ2FudmFzLkhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICBHLkZpbGxTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgIHZhciB4ID0gKCgwICsgRnJhbWUgKiAzKSAlIChHLkNhbnZhcy5XaWR0aCArIDEwMCkpIC0gMTAwO1xyXG4gICAgICAgICAgICB2YXIgeSA9ICgoMCArIEZyYW1lKSAlIChHLkNhbnZhcy5IZWlnaHQgKyAxMDApKSAtIDEwMDtcclxuICAgICAgICAgICAgLy9HLkZpbGxSZWN0KHgsIHksIDEwMCwgMTAwKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBWID0gSlNPTi5JbWFnZXMuVmFsdWVzLlRvQXJyYXkoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbWcgPSBWWyhGcmFtZS8xMCkgJSBWLkxlbmd0aF07XHJcbiAgICAgICAgICAgIEcuRHJhd0ltYWdlKGltZywgeCwgeSxpbWcuV2lkdGgqNCxpbWcuSGVpZ2h0ICogNCk7Ki9cclxuICAgICAgICAgICAgVXBkYXRlSW5wdXRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgUkFGKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBBY3Rpb24gT25GID0gUkFGO1xyXG4gICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoT25GKTtcIik7XHJcbiAgICAgICAgICAgIGRvdWJsZSB0aW1lID0gR2xvYmFsLlBlcmZvcm1hbmNlLk5vdygpO1xyXG4gICAgICAgICAgICBVcGRhdGUodGltZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IENvbG9yRnJvbUFoc2IoaW50IGEsIGZsb2F0IGgsIGZsb2F0IHMsIGZsb2F0IGIpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgLyppZiAoMCA+IGEgfHwgMjU1IDwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUV4Y2VwdGlvbihcImFcIiwgYSxcclxuICAgICAgICAgICAgICAgICAgUHJvcGVydGllcy5SZXNvdXJjZXMuSW52YWxpZEFscGhhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoMGYgPiBoIHx8IDM2MGYgPCBoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXhjZXB0aW9uKFwiaFwiLCBoLFxyXG4gICAgICAgICAgICAgICAgICBQcm9wZXJ0aWVzLlJlc291cmNlcy5JbnZhbGlkSHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoMGYgPiBzIHx8IDFmIDwgcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUV4Y2VwdGlvbihcInNcIiwgcyxcclxuICAgICAgICAgICAgICAgICAgUHJvcGVydGllcy5SZXNvdXJjZXMuSW52YWxpZFNhdHVyYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgwZiA+IGIgfHwgMWYgPCBiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXhjZXB0aW9uKFwiYlwiLCBiLFxyXG4gICAgICAgICAgICAgICAgICBQcm9wZXJ0aWVzLlJlc291cmNlcy5JbnZhbGlkQnJpZ2h0bmVzcyk7XHJcbiAgICAgICAgICAgIH0qL1xyXG5cclxuICAgICAgICAgICAgaWYgKDAgPT0gcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gQ3JlYXRlU2hhZGUoYiAvIDI1NS4wKTtcclxuICAgICAgICAgICAgICAgIC8vcmV0dXJuIDB4ODA4MDgwO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNoYWRlID0gKGludCkoYiAvIDI1NS4wKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSR0JUb0ludChzaGFkZSxzaGFkZSxzaGFkZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZsb2F0IGZNYXgsIGZNaWQsIGZNaW47XHJcbiAgICAgICAgICAgIGludCBpU2V4dGFudCwgaU1heCwgaU1pZCwgaU1pbjtcclxuXHJcbiAgICAgICAgICAgIGlmICgwLjUgPCBiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmTWF4ID0gYiAtIChiICogcykgKyBzO1xyXG4gICAgICAgICAgICAgICAgZk1pbiA9IGIgKyAoYiAqIHMpIC0gcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZNYXggPSBiICsgKGIgKiBzKTtcclxuICAgICAgICAgICAgICAgIGZNaW4gPSBiIC0gKGIgKiBzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaVNleHRhbnQgPSAoaW50KU1hdGguRmxvb3IoaCAvIDYwZik7XHJcbiAgICAgICAgICAgIGlmICgzMDBmIDw9IGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGggLT0gMzYwZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBoIC89IDYwZjtcclxuICAgICAgICAgICAgaCAtPSAyZiAqIChmbG9hdClNYXRoLkZsb29yKCgoaVNleHRhbnQgKyAxZikgJSA2ZikgLyAyZik7XHJcbiAgICAgICAgICAgIGlmICgwID09IGlTZXh0YW50ICUgMilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZk1pZCA9IGggKiAoZk1heCAtIGZNaW4pICsgZk1pbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZNaWQgPSBmTWluIC0gaCAqIChmTWF4IC0gZk1pbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlNYXggPSBDb252ZXJ0LlRvSW50MzIoZk1heCAqIDI1NSk7XHJcbiAgICAgICAgICAgIGlNaWQgPSBDb252ZXJ0LlRvSW50MzIoZk1pZCAqIDI1NSk7XHJcbiAgICAgICAgICAgIGlNaW4gPSBDb252ZXJ0LlRvSW50MzIoZk1pbiAqIDI1NSk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGlTZXh0YW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJHQlRvSW50KGlNaWQsIGlNYXgsIGlNaW4pO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSR0JUb0ludChpTWluLCBpTWF4LCBpTWlkKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUkdCVG9JbnQoaU1pbiwgaU1pZCwgaU1heCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJHQlRvSW50KGlNaWQsIGlNaW4sIGlNYXgpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSR0JUb0ludChpTWF4LCBpTWluLCBpTWlkKTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJHQlRvSW50KGlNYXgsIGlNaWQsIGlNaW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IFJHQlRvSW50KGludCBSLGludCBHLGludCBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIFIgKyAoRyA8PCA4KSArIChCIDw8IDE2KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQXVkaW9cclxuICAgIHtcclxuICAgICAgICBwcm90ZWN0ZWQgQXVkaW9NYW5hZ2VyIF9BTTtcclxuICAgICAgICBwcm90ZWN0ZWQgSFRNTEF1ZGlvRWxlbWVudCBfYXVkaW87XHJcbiAgICAgICAgcHJvdGVjdGVkIGJvb2wgX2hhc1BsYXllZDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIElEIHsgZ2V0OyBwcm90ZWN0ZWQgc2V0OyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIExpc3Q8SFRNTEF1ZGlvRWxlbWVudD4gX2JsYXN0O1xyXG4gICAgICAgIHB1YmxpYyBib29sIElzUGxheWluZ1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhKCFfaGFzUGxheWVkIHx8IF9hdWRpby5QYXVzZWQgfHwgX2F1ZGlvLkN1cnJlbnRUaW1lPT0wLjApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGJvb2wgX2xvb3A7XHJcbiAgICAgICAgcHVibGljIGJvb2wgTG9vcFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vcmV0dXJuIF9hdWRpby5Mb29wO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9sb29wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL19hdWRpby5Mb29wID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBfbG9vcCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgLy9fYXVkaW8uTG9vcCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgQ3VycmVudFRpbWVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2F1ZGlvLkN1cnJlbnRUaW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfYXVkaW8uQ3VycmVudFRpbWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFZvbHVtZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfYXVkaW8uVm9sdW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfYXVkaW8uVm9sdW1lID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgUGxheSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIUlzUGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGFzdHRpbWUgPSBDdXJyZW50VGltZTtcclxuICAgICAgICAgICAgICAgIF9hdWRpby5QbGF5KCk7XHJcbiAgICAgICAgICAgICAgICBfaGFzUGxheWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgUGF1c2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKElzUGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX2F1ZGlvLlBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIFN0b3AoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKElzUGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX2F1ZGlvLlBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICBfYXVkaW8uQ3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgQWN0aW9uPEF1ZGlvPiBPblBsYXk7XHJcbiAgICAgICAgcHVibGljIEFjdGlvbjxBdWRpbz4gT25TdG9wO1xyXG4gICAgICAgIHB1YmxpYyBBdWRpbyhIVE1MQXVkaW9FbGVtZW50IGF1ZGlvLHN0cmluZyBJRCxBdWRpb01hbmFnZXIgQXVkaW9NYW5hZ2VyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX2F1ZGlvID0gYXVkaW87XHJcbiAgICAgICAgICAgIHRoaXMuSUQgPSBJRDtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBfQU0gPSBBdWRpb01hbmFnZXI7XHJcbiAgICAgICAgICAgIC8vb2JqZWN0IEEgPSAoKCkgPT4gc2VsZi5fT25QbGF5KTtcclxuICAgICAgICAgICAgLy9BY3Rpb24gQSA9IG5ldyBBY3Rpb24oKCkgPT4gc2VsZi5fT25QbGF5KCkpO1xyXG5cclxuICAgICAgICAgICAgX2F1ZGlvLk9uUGxheSA9IG5ldyBBY3Rpb24oKCkgPT4gc2VsZi5fT25QbGF5KCkpLlRvRHluYW1pYygpO1xyXG4gICAgICAgICAgICBfYXVkaW8uT25QYXVzZSA9IG5ldyBBY3Rpb24oKCkgPT4gc2VsZi5fT25TdG9wKCkpLlRvRHluYW1pYygpO1xyXG4gICAgICAgICAgICAvL19hdWRpby5PbkVuZGVkID0gbmV3IEFjdGlvbigoKSA9PiBzZWxmLl9PblN0b3AoKSkuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgIF9hdWRpby5PbkVuZGVkID0gbmV3IEFjdGlvbigoKSA9PiBzZWxmLl9PbkVuZCgpKS5Ub0R5bmFtaWMoKTtcclxuICAgICAgICAgICAgX2F1ZGlvLk9uVGltZVVwZGF0ZSA9IG5ldyBBY3Rpb24oKCkgPT4gc2VsZi5fT25VcGRhdGUoKSkuVG9EeW5hbWljKCk7XHJcblxyXG4gICAgICAgICAgICBfYmxhc3QgPSBuZXcgTGlzdDxIVE1MQXVkaW9FbGVtZW50PigpO1xyXG4gICAgICAgICAgICBpbnQgbWF4dm9pY2VzID0gNjtcclxuICAgICAgICAgICAgaW50IHZvaWNlcyA9IDE7XHJcbiAgICAgICAgICAgIHdoaWxlICh2b2ljZXM8bWF4dm9pY2VzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfYmxhc3QuQWRkKChIVE1MQXVkaW9FbGVtZW50KV9hdWRpby5DbG9uZU5vZGUoKSk7XHJcbiAgICAgICAgICAgICAgICB2b2ljZXMgKz0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKl9ibGFzdC5BZGQoKEF1ZGlvRWxlbWVudClfYXVkaW8uQ2xvbmVOb2RlKCkpO1xyXG4gICAgICAgICAgICBfYmxhc3QuQWRkKChBdWRpb0VsZW1lbnQpX2F1ZGlvLkNsb25lTm9kZSgpKTtcclxuICAgICAgICAgICAgX2JsYXN0LkFkZCgoQXVkaW9FbGVtZW50KV9hdWRpby5DbG9uZU5vZGUoKSk7XHJcbiAgICAgICAgICAgIF9ibGFzdC5BZGQoKEF1ZGlvRWxlbWVudClfYXVkaW8uQ2xvbmVOb2RlKCkpOyovXHJcbiAgICAgICAgICAgIC8qX2F1ZGlvLk9uUGxheSA9IFwic2VsZi5fT25QbGF5KClcIi5Ub0R5bmFtaWMoKTtcclxuICAgICAgICAgICAgX2F1ZGlvLk9uUGF1c2UgPSBcInNlbGYuX09uU3RvcCgpXCIuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgIF9hdWRpby5PbkVuZGVkID0gXCJzZWxmLl9PblN0b3AoKVwiLlRvRHluYW1pYygpOyovXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBCbGFzdChmbG9hdCB2b2x1bWU9MWYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIUlzUGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVm9sdW1lID0gdm9sdW1lO1xyXG4gICAgICAgICAgICAgICAgUGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8oKEF1ZGlvRWxlbWVudClfYXVkaW8uQ2xvbmVOb2RlKCkpLlBsYXkoKTtcclxuICAgICAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgX2JsYXN0LkNvdW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEhUTUxBdWRpb0VsZW1lbnQgQSA9IF9ibGFzdFtpXTtcclxuICAgICAgICAgICAgICAgICAgICAvL2lmIChBLlBhdXNlZCB8fCBBLkN1cnJlbnRUaW1lPDAuMTVmIHx8IEEuUGxheWVkLkxlbmd0aD09MClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQS5QYXVzZWQgfHwgQS5DdXJyZW50VGltZSA8IDAuMTBmIHx8IEEuUGxheWVkLkxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEEuUGF1c2VkIHx8IEEuQ3VycmVudFRpbWUgPT0gMC4wIHx8IEEuUGxheWVkLkxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBLlZvbHVtZSA9IHZvbHVtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEEuUGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IF9ibGFzdC5Db3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHByb3RlY3RlZCB2b2lkIF9PblBsYXkoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX0FNLk9uUGxheSh0aGlzKTtcclxuICAgICAgICAgICAgaWYgKE9uUGxheS5Ub0R5bmFtaWMoKSlcclxuICAgICAgICAgICAgICAgIE9uUGxheSh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgX09uU3RvcCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfQU0uT25TdG9wKHRoaXMpO1xyXG4gICAgICAgICAgICBpZiAoT25TdG9wLlRvRHluYW1pYygpKVxyXG4gICAgICAgICAgICAgICAgT25TdG9wKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdm9pZCBfT25FbmQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLyppZiAoX2xvb3ApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICAgICAgICAgIFBsYXkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlKi9cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX09uU3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBkb3VibGUgbGFzdHRpbWU9MDtcclxuICAgICAgICBwcm90ZWN0ZWQgdm9pZCBfT25VcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9sb29wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2lmICgoQ3VycmVudFRpbWUrMC4zNSkgPj0gX2F1ZGlvLkR1cmF0aW9uKVxyXG4gICAgICAgICAgICAgICAgaWYgKChDdXJyZW50VGltZSArICgoQ3VycmVudFRpbWUgLSBsYXN0dGltZSkqMC44KSkgPj0gX2F1ZGlvLkR1cmF0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBQbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0dGltZSA9IEN1cnJlbnRUaW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBdWRpb01hbmFnZXJcclxuICAgIHtcclxuICAgICAgICBwcm90ZWN0ZWQgRGljdGlvbmFyeTxzdHJpbmcsIEF1ZGlvPiBkYXRhO1xyXG4gICAgICAgIHByb3RlY3RlZCBMaXN0PEF1ZGlvPiBwbGF5aW5nO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nIERpcmVjdG9yeSA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBBdWRpb01hbmFnZXIgX190aGlzO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQXVkaW9NYW5hZ2VyIF90aGlzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9fdGhpcyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIF9fdGhpcyA9IG5ldyBBdWRpb01hbmFnZXIoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfX3RoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEluaXQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9fdGhpcyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgX190aGlzID0gbmV3IEF1ZGlvTWFuYWdlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgQXVkaW9NYW5hZ2VyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIEF1ZGlvPigpO1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gbmV3IExpc3Q8QXVkaW8+KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBBdWRpbyBHZXQoc3RyaW5nIHBhdGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwYXRoID0gRGlyZWN0b3J5ICsgcGF0aDtcclxuICAgICAgICAgICAgaWYgKGRhdGEuQ29udGFpbnNLZXkocGF0aCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhW3BhdGhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSFRNTEF1ZGlvRWxlbWVudCBBRSA9IG5ldyBIVE1MQXVkaW9FbGVtZW50KHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgQXVkaW8gQSA9IG5ldyBBdWRpbyhBRSwgcGF0aCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBkYXRhLkFkZChwYXRoLCBBKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBBdWRpbyBQbGF5KHN0cmluZyBwYXRoLGJvb2wgbG9vcD1mYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEF1ZGlvIEEgPSBHZXQocGF0aCk7XHJcbiAgICAgICAgICAgIEEuTG9vcCA9IGxvb3A7XHJcbiAgICAgICAgICAgIEEuUGxheSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gQTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQmxhc3Qoc3RyaW5nIHBhdGgsZmxvYXQgdm9sdW1lPTFmKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXVkaW8gQSA9IEdldChwYXRoKTtcclxuICAgICAgICAgICAgQS5CbGFzdCh2b2x1bWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKHN0cmluZyBwYXRoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXVkaW8gQSA9IEdldChwYXRoKTtcclxuICAgICAgICAgICAgQS5TdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFBhdXNlKHN0cmluZyBwYXRoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXVkaW8gQSA9IEdldChwYXRoKTtcclxuICAgICAgICAgICAgQS5QYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBPblBsYXkoQXVkaW8gYXVkaW8pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIXBsYXlpbmcuQ29udGFpbnMoYXVkaW8pKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwbGF5aW5nLkFkZChhdWRpbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgT25TdG9wKEF1ZGlvIGF1ZGlvKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHBsYXlpbmcuQ29udGFpbnMoYXVkaW8pKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwbGF5aW5nLlJlbW92ZShhdWRpbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RvcEFsbEZyb21EaXJlY3Rvcnkoc3RyaW5nIGRpcmVjdG9yeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpcmVjdG9yeSA9IERpcmVjdG9yeSArIGRpcmVjdG9yeTtcclxuQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuRm9yRWFjaDxnbG9iYWw6OkNpcm5vR2FtZS5BdWRpbz4oICAgICAgICAgICAgLyppbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIGRhdGFbXCJcIl0uSUQqL1xyXG4gICAgICAgICAgICAvL2RhdGEuRm9yRWFjaChBID0+IHsgaWYgKEEuSUQpfSlcclxuICAgICAgICAgICAgZGF0YS5WYWx1ZXMsKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkNpcm5vR2FtZS5BdWRpbz4pKEEgPT4geyBpZiAoQS5JRC5TdGFydHNXaXRoKGRpcmVjdG9yeSkpeyBBLlN0b3AoKTsgfSB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3BBbGwoKVxyXG4gICAgICAgIHtcclxuQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuRm9yRWFjaDxnbG9iYWw6OkNpcm5vR2FtZS5BdWRpbz4oICAgICAgICAgICAgLyppbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIGRhdGFbXCJcIl0uSUQqL1xyXG4gICAgICAgICAgICAvL2RhdGEuRm9yRWFjaChBID0+IHsgaWYgKEEuSUQpfSlcclxuICAgICAgICAgICAgZGF0YS5WYWx1ZXMsKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkNpcm5vR2FtZS5BdWRpbz4pKEEgPT4geyBBLlN0b3AoKTsgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQnV0dG9uTWVudVxyXG4gICAge1xyXG4gICAgICAgIC8vcHVibGljIExpc3Q8QnV0dG9uU3ByaXRlPiBidXR0b25zO1xyXG4gICAgICAgIHByb3RlY3RlZCBMaXN0PExpc3Q8QnV0dG9uU3ByaXRlPj4gcm93cztcclxuICAgICAgICBwdWJsaWMgZmxvYXQgTWVudVdpZHRoO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBNZW51SGVpZ2h0O1xyXG4gICAgICAgIHByb3RlY3RlZCBpbnQgRm9udFNpemU7XHJcbiAgICAgICAgcHVibGljIGJvb2wgU2VsZWN0aW9uTWVudTtcclxuICAgICAgICBwdWJsaWMgQnV0dG9uU3ByaXRlIFNlbGVjdGVkPW51bGw7XHJcbiAgICAgICAgcHVibGljIEJ1dHRvbk1lbnUgU2VsZjtcclxuICAgICAgICBwdWJsaWMgZHluYW1pYyBTZWxlY3RlZERhdGFcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoU2VsZi5TZWxlY3RlZCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTZWxmLlNlbGVjdGVkLkRhdGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIFNlbGVjdGVkVGV4dFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChTZWxmLlNlbGVjdGVkICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNlbGYuU2VsZWN0ZWQuQ29udGVudHMgaXMgVGV4dFNwcml0ZSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoKFRleHRTcHJpdGUpU2VsZi5TZWxlY3RlZC5Db250ZW50cykuVGV4dDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIEFjdGlvbiBPbkNob29zZTtcclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgUG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG5cclxuICAgICAgICBwdWJsaWMgQnV0dG9uTWVudShmbG9hdCBtZW51V2lkdGgsZmxvYXQgbWVudUhlaWdodCxpbnQgRm9udFNpemUsYm9vbCBzZWxlY3Rpb25NZW51PWZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcm93cyA9IG5ldyBMaXN0PExpc3Q8QnV0dG9uU3ByaXRlPj4oKTtcclxuICAgICAgICAgICAgdGhpcy5NZW51V2lkdGggPSBtZW51V2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuTWVudUhlaWdodCA9IG1lbnVIZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMuRm9udFNpemUgPSBGb250U2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3Rpb25NZW51ID0gc2VsZWN0aW9uTWVudTtcclxuICAgICAgICAgICAgU2VsZiA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBMaXN0PEJ1dHRvblNwcml0ZT4gR2V0QWxsQnV0dG9ucygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PEJ1dHRvblNwcml0ZT4gYWxsID0gbmV3IExpc3Q8QnV0dG9uU3ByaXRlPigpO1xyXG4gICAgICAgICAgICByb3dzLkZvckVhY2goKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OlN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLkxpc3Q8Z2xvYmFsOjpDaXJub0dhbWUuQnV0dG9uU3ByaXRlPj4pKFIgPT4gYWxsLkFkZFJhbmdlKFIpKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhbGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBCdXR0b25TcHJpdGUgR2V0U3ByaXRlQnlEYXRhKGR5bmFtaWMgZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8QnV0dG9uU3ByaXRlPiBhbGwgPSBuZXcgTGlzdDxCdXR0b25TcHJpdGU+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpDaXJub0dhbWUuQnV0dG9uU3ByaXRlPihHZXRBbGxCdXR0b25zKCksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpDaXJub0dhbWUuQnV0dG9uU3ByaXRlLCBib29sPikoQiA9PiBCLkRhdGEgPT0gZGF0YSkpKTtcclxuICAgICAgICAgICAgaWYgKGFsbC5Db3VudD4wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRCdXR0b25zKHN0cmluZ1tdIGJ1dHRvblRleHQpXHJcbiAgICAgICAge1xyXG5DaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Gb3JFYWNoPHN0cmluZz4oICAgICAgICAgICAgYnV0dG9uVGV4dCwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPHN0cmluZz4pKFQgPT4gQWRkQnV0dG9uKChzdHJpbmcpVCkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEJ1dHRvblNwcml0ZSBBZGRCdXR0b24oc3RyaW5nIGJ1dHRvblRleHQsIGludCByb3cgPSAtMSxkeW5hbWljIGRhdGE9bnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRleHRTcHJpdGUgVCA9IG5ldyBUZXh0U3ByaXRlKCk7XHJcbiAgICAgICAgICAgIFQuVGV4dCA9IGJ1dHRvblRleHQ7XHJcbiAgICAgICAgICAgIFQuRm9udFNpemUgPSBGb250U2l6ZTtcclxuICAgICAgICAgICAgLy9CdXR0b25TcHJpdGUgQiA9IG5ldyBCdXR0b25TcHJpdGUoVCwgKGludCkoRm9udFNpemUgKiAwLjA1KSk7XHJcbiAgICAgICAgICAgIEJ1dHRvblNwcml0ZSBCID0gbmV3IEJ1dHRvblNwcml0ZShULCAoaW50KShGb250U2l6ZSAqIDAuMSkpO1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCLkRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEFkZEJ1dHRvbihCLCByb3cpO1xyXG4gICAgICAgICAgICByZXR1cm4gQjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQnV0dG9uKEJ1dHRvblNwcml0ZSBidXR0b24saW50IHJvdz0tMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChyb3dzLkNvdW50ID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvd3MuQWRkKG5ldyBMaXN0PEJ1dHRvblNwcml0ZT4oKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJvdyA9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm93ID0gcm93cy5Db3VudCAtIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGJ1dHRvbiAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBidXR0b24uT25DbGljayA9ICgpID0+IHsgU2VsZi5TZWxlY3QoYnV0dG9uKTsgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByb3dzW3Jvd10uQWRkKGJ1dHRvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbGVjdChCdXR0b25TcHJpdGUgYnV0dG9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKFNlbGVjdGVkICE9IGJ1dHRvbiB8fCAhU2VsZWN0aW9uTWVudSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKFNlbGVjdGVkICE9IG51bGwgJiYgU2VsZWN0aW9uTWVudSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1NlbGVjdGVkLkJvcmRlckNvbG9yID0gXCIjMDBBQTMzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9TZWxlY3RlZC5CdXR0b25Db2xvciA9IFwiIzExQ0M1NVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGVkLlNldENvbG9yU2NoZW1lKDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgU2VsZWN0ZWQgPSBidXR0b247XHJcbiAgICAgICAgICAgICAgICB2YXIgT1NDID0gT25DaG9vc2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWVudSAmJiBTZWxlY3RlZCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vU2VsZWN0ZWQuQm9yZGVyQ29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgICAgICAgICAvL1NlbGVjdGVkLkJ1dHRvbkNvbG9yID0gXCIjRkYwMDAwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0ZWQuU2V0Q29sb3JTY2hlbWUoMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoU2VsZWN0ZWQgIT0gbnVsbCAmJiBTY3JpcHQuV3JpdGU8Ym9vbD4oXCJPU0NcIikpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5PbkNob29zZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENvbWJpbmVSb3dzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8QnV0dG9uU3ByaXRlPiBhbGwgPSBuZXcgTGlzdDxCdXR0b25TcHJpdGU+KCk7XHJcbiAgICAgICAgICAgIHJvd3MuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuTGlzdDxnbG9iYWw6OkNpcm5vR2FtZS5CdXR0b25TcHJpdGU+PikoUiA9PiBhbGwuQWRkUmFuZ2UoUikpKTtcclxuXHJcbiAgICAgICAgICAgIHJvd3MgPSBuZXcgTGlzdDxMaXN0PEJ1dHRvblNwcml0ZT4+KCk7XHJcbiAgICAgICAgICAgIHJvd3MuQWRkKGFsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBMaXN0PEJ1dHRvblNwcml0ZT4gYWRkUm93KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8QnV0dG9uU3ByaXRlPiByZXQgPSBuZXcgTGlzdDxCdXR0b25TcHJpdGU+KCk7XHJcbiAgICAgICAgICAgIHJvd3MuQWRkKHJldCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEJyZWFrVXAoaW50IHRvdGFsUm93cylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvbWJpbmVSb3dzKCk7XHJcbiAgICAgICAgICAgIExpc3Q8QnV0dG9uU3ByaXRlPiBhbGwgPSByb3dzWzBdO1xyXG4gICAgICAgICAgICByb3dzID0gbmV3IExpc3Q8TGlzdDxCdXR0b25TcHJpdGU+PigpO1xyXG4gICAgICAgICAgICBkb3VibGUgQyA9IE1hdGguQ2VpbGluZyhhbGwuQ291bnQgLyAoZG91YmxlKXRvdGFsUm93cyk7XHJcbiAgICAgICAgICAgIExpc3Q8QnV0dG9uU3ByaXRlPiByb3cgPSBhZGRSb3coKTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGFsbC5Db3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvdy5Db3VudD49IEMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gYWRkUm93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBBZGRCdXR0b24oYWxsW2ldKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdm9pZCBDZW50ZXJPbihTcHJpdGUgc3ByaXRlLFZlY3RvcjIgQ2VudGVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3ByaXRlLkRyYXcobnVsbCk7XHJcbiAgICAgICAgICAgIFZlY3RvcjIgUyA9IHNwcml0ZS5TaXplO1xyXG4gICAgICAgICAgICBWZWN0b3IyIFMyID0gUyAvIDJmO1xyXG4gICAgICAgICAgICBzcHJpdGUuUG9zaXRpb24gPSBDZW50ZXIgLSBTMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgVXBkYXRlUm93KGludCBpbmRleCxmbG9hdCB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxCdXR0b25TcHJpdGU+IHJvdyA9IHJvd3NbaW5kZXhdO1xyXG4gICAgICAgICAgICBmbG9hdCBYID0gKE1lbnVXaWR0aCAvIChyb3cuQ291bnQgKyAxLjBmKSk7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgQ1ggPSBYO1xyXG5cclxuICAgICAgICAgICAgQ1ggKz0gUG9zaXRpb24uWDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCByb3cuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJ1dHRvblNwcml0ZSBCID0gcm93W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKEIgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDZW50ZXJPbihCLCBuZXcgVmVjdG9yMihDWCwgeSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQ1ggKz0gWDtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBGaW5pc2goaW50IHRvdGFsUm93cyA9IC0xKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRvdGFsUm93cz4wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCcmVha1VwKHRvdGFsUm93cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmxvYXQgeSA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IENZID0gMDtcclxuICAgICAgICAgICAgaWYgKHRvdGFsUm93cyA+IDAgJiYgcm93cy5Db3VudCA8IHRvdGFsUm93cylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IChNZW51SGVpZ2h0IC8gKHJvd3MuQ291bnQgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICBDWSA9IHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0gKE1lbnVIZWlnaHQgLyAocm93cy5Db3VudCkpO1xyXG4gICAgICAgICAgICAgICAgQ1kgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBDWSArPSBQb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgcm93cy5Db3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVXBkYXRlUm93KGksIENZKTtcclxuICAgICAgICAgICAgICAgIENZICs9IHk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlKFZlY3RvcjIgbW91c2VQb3NpdGlvbj1udWxsLGJvb2wgY2xpY2tlZD10cnVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKG1vdXNlUG9zaXRpb24gPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbW91c2VQb3NpdGlvbiA9IEtleWJvYXJkTWFuYWdlci5fdGhpcy5DTW91c2U7XHJcbiAgICAgICAgICAgICAgICBjbGlja2VkID0gS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlRhcHBlZE1vdXNlQnV0dG9ucy5Db250YWlucygwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY2xpY2tlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm93cy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5MaXN0PGdsb2JhbDo6Q2lybm9HYW1lLkJ1dHRvblNwcml0ZT4+KShSID0+IFIuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6Q2lybm9HYW1lLkJ1dHRvblNwcml0ZT4pKEIgPT4geyBpZiAoQiAhPSBudWxsKSBCLkNoZWNrQ2xpY2sobW91c2VQb3NpdGlvbik7IH0pKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXcoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByb3dzLkZvckVhY2goKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OlN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLkxpc3Q8Z2xvYmFsOjpDaXJub0dhbWUuQnV0dG9uU3ByaXRlPj4pKFIgPT4gUi5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpDaXJub0dhbWUuQnV0dG9uU3ByaXRlPikoQiA9PiB7IGlmIChCICE9IG51bGwpIEIuRHJhdyhnKTsgfSkpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcHJpdGVcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBQb3NpdGlvbjtcclxuICAgICAgICBwdWJsaWMgSFRNTENhbnZhc0VsZW1lbnQgc3ByaXRlQnVmZmVyO1xyXG4gICAgICAgIHB1YmxpYyBib29sIFZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHByb3RlY3RlZCBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgc3ByaXRlR3JhcGhpY3M7XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgU2l6ZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihzcHJpdGVCdWZmZXIuV2lkdGgsIHNwcml0ZUJ1ZmZlci5IZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVCdWZmZXIuV2lkdGggPSAoaW50KXZhbHVlLlg7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVCdWZmZXIuSGVpZ2h0ID0gKGludCl2YWx1ZS5ZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBHZXRHcmFwaGljcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gc3ByaXRlR3JhcGhpY3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBTcHJpdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3ByaXRlQnVmZmVyID0gbmV3IEhUTUxDYW52YXNFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIHNwcml0ZUdyYXBoaWNzID0gc3ByaXRlQnVmZmVyLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBzcHJpdGVHcmFwaGljcy5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgUG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIE9uRnJhbWUoKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIHZvaWQgRHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghVmlzaWJsZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgZy5EcmF3SW1hZ2Uoc3ByaXRlQnVmZmVyLCBQb3NpdGlvbi5YLCBQb3NpdGlvbi5ZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgUmVjdGFuZ2xlIEdldEJvdW5kcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZShQb3NpdGlvbi5YLCBQb3NpdGlvbi5ZLCBzcHJpdGVCdWZmZXIuV2lkdGgsIHNwcml0ZUJ1ZmZlci5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQnV0dG9uU3ByaXRlOlNwcml0ZVxyXG4gICAge1xyXG4gICAgICAgIHByb3RlY3RlZCBib29sIF9idXR0b25OZWVkc1JlcmVuZGVyO1xyXG4gICAgICAgIHByb3RlY3RlZCBTcHJpdGUgX2J1dHRvbkJ1ZmZlcjtcclxuICAgICAgICBwcm90ZWN0ZWQgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIF9idXR0b25HcmFwaGljO1xyXG4gICAgICAgIHB1YmxpYyBkeW5hbWljIERhdGE7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBTcHJpdGUgX2NvbnRlbnRzO1xyXG4gICAgICAgIHB1YmxpYyBTcHJpdGUgQ29udGVudHNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRlbnRzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2NvbnRlbnRzICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9jb250ZW50cyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIF9idXR0b25OZWVkc1JlcmVuZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgaW50IF9ib3JkZXJTaXplO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgQm9yZGVyU2l6ZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfYm9yZGVyU2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9ib3JkZXJTaXplICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9ib3JkZXJTaXplID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1dHRvbk5lZWRzUmVyZW5kZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzdHJpbmcgX2JvcmRlckNvbG9yO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgQm9yZGVyQ29sb3JcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2JvcmRlckNvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2JvcmRlckNvbG9yICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9ib3JkZXJDb2xvciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIF9idXR0b25OZWVkc1JlcmVuZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIExvY2tlZENsaWNrU291bmQgPSBcImhpdFwiO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgQ2xpY2tTb3VuZCA9IFwic2VsZWN0XCI7XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0cmluZyBfYnV0dG9uQ29sb3I7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBCdXR0b25Db2xvclxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfYnV0dG9uQ29sb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfYnV0dG9uQ29sb3IgIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1dHRvbkNvbG9yID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgX2J1dHRvbk5lZWRzUmVyZW5kZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjbGFzcyBDb2xvclNjaGVtZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHVibGljIHN0cmluZyBCb3JkZXJDb2xvcjtcclxuICAgICAgICAgICAgcHVibGljIHN0cmluZyBCdXR0b25Db2xvcjtcclxuICAgICAgICAgICAgcHVibGljIENvbG9yU2NoZW1lKHN0cmluZyBib3JkZXJDb2xvciA9IFwiIzAwQUEzM1wiLCBzdHJpbmcgYnV0dG9uQ29sb3IgPSBcIiMxMUNDNTVcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Cb3JkZXJDb2xvciA9IGJvcmRlckNvbG9yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5CdXR0b25Db2xvciA9IGJ1dHRvbkNvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgTGlzdDxDb2xvclNjaGVtZT4gQ29sb3JTY2hlbWVzO1xyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBsb2NrZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIEFjdGlvbiBPbkNsaWNrO1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNldENvbG9yU2NoZW1lKENvbG9yU2NoZW1lIHNjaGVtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEJvcmRlckNvbG9yID0gc2NoZW1lLkJvcmRlckNvbG9yO1xyXG4gICAgICAgICAgICBCdXR0b25Db2xvciA9IHNjaGVtZS5CdXR0b25Db2xvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgU2V0Q29sb3JTY2hlbWUoaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ29sb3JTY2hlbWUgQyA9IENvbG9yU2NoZW1lc1tpbmRleF07XHJcbiAgICAgICAgICAgIFNldENvbG9yU2NoZW1lKEMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3B1YmxpYyBCdXR0b25TcHJpdGUoU3ByaXRlIGNvbnRlbnRzLGludCBib3JkZXJTaXplPTIsc3RyaW5nIGJvcmRlckNvbG9yPVwiIzc3Nzc3N1wiLHN0cmluZyBidXR0b25Db2xvcj1cIiNDQ0NDQ0NcIilcclxuICAgICAgICBwdWJsaWMgQnV0dG9uU3ByaXRlKFNwcml0ZSBjb250ZW50cywgaW50IGJvcmRlclNpemUgPSAyLCBzdHJpbmcgYm9yZGVyQ29sb3IgPSBcIiMwMEFBMzNcIiwgc3RyaW5nIGJ1dHRvbkNvbG9yID0gXCIjMTFDQzU1XCIsZHluYW1pYyBkYXRhPW51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLkNvbnRlbnRzID0gY29udGVudHM7XHJcbiAgICAgICAgICAgIHRoaXMuQm9yZGVyU2l6ZSA9IGJvcmRlclNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuQm9yZGVyQ29sb3IgPSBib3JkZXJDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5CdXR0b25Db2xvciA9IGJ1dHRvbkNvbG9yO1xyXG5cclxuICAgICAgICAgICAgX2J1dHRvbkJ1ZmZlciA9IG5ldyBTcHJpdGUoKTtcclxuICAgICAgICAgICAgX2J1dHRvbkJ1ZmZlci5TaXplID0gY29udGVudHMuU2l6ZTtcclxuICAgICAgICAgICAgX2J1dHRvbkdyYXBoaWMgPSBfYnV0dG9uQnVmZmVyLkdldEdyYXBoaWNzKCk7XHJcbiAgICAgICAgICAgIF9idXR0b25OZWVkc1JlcmVuZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgQ29sb3JTY2hlbWVzID0gbmV3IExpc3Q8Q29sb3JTY2hlbWU+KCk7XHJcbiAgICAgICAgICAgIENvbG9yU2NoZW1lcy5BZGQobmV3IENvbG9yU2NoZW1lKGJvcmRlckNvbG9yLCBidXR0b25Db2xvcikpO1xyXG4gICAgICAgICAgICBDb2xvclNjaGVtZXMuQWRkKG5ldyBDb2xvclNjaGVtZShcIiNGRkZGRkZcIiwgXCIjRkYwMDAwXCIpKTtcclxuICAgICAgICAgICAgQ29sb3JTY2hlbWVzLkFkZChuZXcgQ29sb3JTY2hlbWUoXCIjNzc3Nzc3XCIsIFwiI0NDQ0NDQ1wiKSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLkRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICBpZiAoZGF0YSA9PSBudWxsICYmIGNvbnRlbnRzIGlzIFRleHRTcHJpdGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERhdGEgPSAoKFRleHRTcHJpdGUpY29udGVudHMpLlRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIERyYXcobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2b2lkIGRyYXdCdXR0b24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcgPSBfYnV0dG9uR3JhcGhpYztcclxuICAgICAgICAgICAgaW50IHN6ID0gX2JvcmRlclNpemUgKyBfYm9yZGVyU2l6ZTtcclxuICAgICAgICAgICAgX2J1dHRvbkJ1ZmZlci5TaXplID0gQ29udGVudHMuU2l6ZSArIG5ldyBWZWN0b3IyKHN6LCBzeik7XHJcbiAgICAgICAgICAgIFZlY3RvcjIgc2l6ZSA9IF9idXR0b25CdWZmZXIuU2l6ZTtcclxuXHJcbiAgICAgICAgICAgIGcuRmlsbFN0eWxlID0gX2JvcmRlckNvbG9yO1xyXG4gICAgICAgICAgICBnLkZpbGxSZWN0KDAsIDAsIChpbnQpc2l6ZS5YLCAoaW50KXNpemUuWSk7XHJcblxyXG4gICAgICAgICAgICBnLkZpbGxTdHlsZSA9IEJ1dHRvbkNvbG9yO1xyXG4gICAgICAgICAgICBnLkZpbGxSZWN0KF9ib3JkZXJTaXplLCBfYm9yZGVyU2l6ZSwgKGludClzaXplLlgtIHN6LCAoaW50KXNpemUuWS0gc3opO1xyXG5cclxuICAgICAgICAgICAgc3RyaW5nIGNvbG9yID0gXCJyZ2JhKDI1NSwyNTUsMjU1LDApXCI7XHJcblxyXG4gICAgICAgICAgICBzdHJpbmcgd2h0ID0gXCJyZ2JhKDI1NSwyNTUsMjU1LDAuNylcIjtcclxuXHJcblxyXG4gICAgICAgICAgICAvLy9TY3JpcHQuV3JpdGUoXCJ2YXIgZ3JkID0gZy5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCBzaXplLnkpO2dyZC5hZGRDb2xvclN0b3AoMCwgY29sb3IpO2dyZC5hZGRDb2xvclN0b3AoMC40LCB3aHQpO2dyZC5hZGRDb2xvclN0b3AoMSwgY29sb3IpO2cuZmlsbFN0eWxlID0gZ3JkO1wiKTtcclxuICAgICAgICAgICAgdmFyIGdyZCA9IGcuQ3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgc2l6ZS5ZKTtcclxuICAgICAgICAgICAgZ3JkLkFkZENvbG9yU3RvcCgwLCBjb2xvcik7XHJcbiAgICAgICAgICAgIGdyZC5BZGRDb2xvclN0b3AoMC40LCBcIndoaXRlXCIpO1xyXG4gICAgICAgICAgICBncmQuQWRkQ29sb3JTdG9wKDEsIGNvbG9yKTtcclxuICAgICAgICAgICAgZy5GaWxsU3R5bGUgPSBncmQ7XHJcbiAgICAgICAgICAgIGcuRmlsbFJlY3QoMCwgMCwgKGludClfYnV0dG9uQnVmZmVyLlNpemUuWCwgKGludClfYnV0dG9uQnVmZmVyLlNpemUuWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIExvY2soYm9vbCBzZXRjb2xvcnNjaGVtZT10cnVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxvY2tlZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgbG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHNldGNvbG9yc2NoZW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTZXRDb2xvclNjaGVtZSgyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBVbmxvY2soYm9vbCBzZXRjb2xvcnNjaGVtZSA9IHRydWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIWxvY2tlZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgbG9ja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChzZXRjb2xvcnNjaGVtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU2V0Q29sb3JTY2hlbWUoMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIFZlY3RvcjIgTENvbnRlbnRTaXplID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICBwdWJsaWMgYm9vbCBDaGVja0NsaWNrKFZlY3RvcjIgbW91c2VQb3NpdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChWaXNpYmxlICYmIEdldEJvdW5kcygpLmNvbnRhaW5zUG9pbnQobW91c2VQb3NpdGlvbikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NrZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKExvY2tlZENsaWNrU291bmQgIT0gXCJcIiAmJiBMb2NrZWRDbGlja1NvdW5kICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIuX3RoaXMuQmxhc3QoXCJTRlgvXCIgKyBMb2NrZWRDbGlja1NvdW5kICsgXCIub2dnXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKENsaWNrU291bmQgIT0gXCJcIiAmJiBDbGlja1NvdW5kICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9BdWRpb01hbmFnZXIuX3RoaXMuR2V0KFwiU0ZYL1wiICsgQ2xpY2tTb3VuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLl90aGlzLkJsYXN0KFwiU0ZYL1wiICsgQ2xpY2tTb3VuZCtcIi5vZ2dcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHRtcCA9IE9uQ2xpY2s7XHJcbiAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlPGJvb2w+KFwidG1wXCIpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIE9uQ2xpY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgRHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vaWYgKF9jb250ZW50cy5TaXplICE9IExDb250ZW50U2l6ZSlcclxuICAgICAgICAgICAgaWYgKF9jb250ZW50cy5TaXplLlggIT0gTENvbnRlbnRTaXplLlggfHwgX2NvbnRlbnRzLlNpemUuWSAhPSBMQ29udGVudFNpemUuWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX2J1dHRvbk5lZWRzUmVyZW5kZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgTENvbnRlbnRTaXplID0gX2NvbnRlbnRzLlNpemUuQ2xvbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoX2J1dHRvbk5lZWRzUmVyZW5kZXIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRyYXdCdXR0b24oKTtcclxuICAgICAgICAgICAgICAgIF9idXR0b25OZWVkc1JlcmVuZGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU2l6ZSA9IF9idXR0b25CdWZmZXIuU2l6ZS5DbG9uZSgpO1xyXG4gICAgICAgICAgICAvL3Nwcml0ZUdyYXBoaWNzLkRyYXdJbWFnZShfYnUpXHJcbiAgICAgICAgICAgIF9idXR0b25CdWZmZXIuRHJhdyhzcHJpdGVHcmFwaGljcyk7XHJcbiAgICAgICAgICAgIENvbnRlbnRzLlBvc2l0aW9uID0gbmV3IFZlY3RvcjIoX2JvcmRlclNpemUsIF9ib3JkZXJTaXplKTtcclxuICAgICAgICAgICAgQ29udGVudHMuRHJhdyhzcHJpdGVHcmFwaGljcyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoZyAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBiYXNlLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENhbWVyYVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBib29sIGluc3Rhd2FycCA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFBvc2l0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFRhcmdldFBvc2l0aW9uO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIENlbnRlcmVkVGFyZ2V0UG9zaXRpb25cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUYXJnZXRQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKHZhbHVlLlgtKENhbWVyYUJvdW5kcy53aWR0aC8yKSwgdmFsdWUuWSAtIChDYW1lcmFCb3VuZHMuaGVpZ2h0IC8gMikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3B1YmxpYyBmbG9hdCBMaW5lYXJQYW5TcGVlZCA9IDEuNmY7XHJcbiAgICAgICAgLy9wdWJsaWMgZmxvYXQgTGluZWFyUGFuU3BlZWQgPSAxLjNmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBMaW5lYXJQYW5TcGVlZCA9IDEuMmY7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IExlcnBQYW5TcGVlZCA9IDAuMDc1ZjtcclxuICAgICAgICAvL3Byb3RlY3RlZCBmbG9hdCBfc2NhbGUgPSAwLjhmO1xyXG4gICAgICAgIHByb3RlY3RlZCBmbG9hdCBfc2NhbGUgPSAxZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgc3BlZWRtb2QgPSAxO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBTY2FsZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfc2NhbGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9zY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgX2ludnNjYWxlID0gMSAvIF9zY2FsZTtcclxuICAgICAgICAgICAgICAgIFVwZGF0ZUNhbWVyYUJvdW5kcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vcHJvdGVjdGVkIGZsb2F0IF9pbnZzY2FsZSA9IDEuMjVmO1xyXG4gICAgICAgIHByb3RlY3RlZCBmbG9hdCBfaW52c2NhbGUgPSAxLjBmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBJbnZTY2FsZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfaW52c2NhbGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9pbnZzY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgX3NjYWxlID0gMSAvIF9pbnZzY2FsZTtcclxuICAgICAgICAgICAgICAgIFVwZGF0ZUNhbWVyYUJvdW5kcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgVmVjdG9yMiBfY2VudGVyID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBDZW50ZXJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZWN0YW5nbGUgUiA9IENhbWVyYUJvdW5kcztcclxuICAgICAgICAgICAgICAgIC8vcmV0dXJuIFIuQ2VudGVyO1xyXG4gICAgICAgICAgICAgICAgUi5HZXRDZW50ZXIoX2NlbnRlcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2NlbnRlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24uWCA9IHZhbHVlLlggLSAoQ2FtZXJhQm91bmRzLndpZHRoIC8gMik7XHJcbiAgICAgICAgICAgICAgICBQb3NpdGlvbi5ZID0gdmFsdWUuWSAtIChDYW1lcmFCb3VuZHMuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgU2NhbGVUb1NpemUoZmxvYXQgc2l6ZUluUGl4ZWxzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU2NhbGUgPSBzaXplSW5QaXhlbHMgLyBBcHAuQ2FudmFzLldpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgdmlld3BvcnRfd2lkdGggPSAxO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB2aWV3cG9ydF9oZWlnaHQgPSAxO1xyXG4gICAgICAgIC8vY2FtZXJhIGhpdGJveFxyXG4gICAgICAgIHB1YmxpYyBSZWN0YW5nbGUgQ2FtZXJhQm91bmRzO1xyXG4gICAgICAgIC8vYXJlYSBjYW1lcmEgbXVzdCBiZSBjb25maW5lZCB0by5cclxuICAgICAgICBwdWJsaWMgUmVjdGFuZ2xlIFN0YWdlQm91bmRzO1xyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEoZmxvYXQgdmlld3BvcnRfd2lkdGg9LTEsIGZsb2F0IHZpZXdwb3J0X2hlaWdodD0tMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBvc2l0aW9uID0gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICAgICAgVGFyZ2V0UG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdwb3J0X3dpZHRoID0gdmlld3BvcnRfd2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMudmlld3BvcnRfaGVpZ2h0ID0gdmlld3BvcnRfaGVpZ2h0O1xyXG4gICAgICAgICAgICBDYW1lcmFCb3VuZHMgPSBuZXcgUmVjdGFuZ2xlKDAsIDAsIHZpZXdwb3J0X3dpZHRoLCB2aWV3cG9ydF9oZWlnaHQpO1xyXG4gICAgICAgICAgICBfaW52c2NhbGUgPSAxLjBmIC8gX3NjYWxlO1xyXG4gICAgICAgICAgICBVcGRhdGVDYW1lcmFCb3VuZHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFVwZGF0ZUNhbWVyYUJvdW5kcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL0NhbWVyYUJvdW5kcy53aWR0aCA9IEFwcC5DYW52YXMuV2lkdGggKiBfaW52c2NhbGU7XHJcbiAgICAgICAgICAgIC8vQ2FtZXJhQm91bmRzLmhlaWdodCA9IEFwcC5DYW52YXMuSGVpZ2h0ICogX2ludnNjYWxlO1xyXG4gICAgICAgICAgICBDYW1lcmFCb3VuZHMud2lkdGggPSB2aWV3cG9ydF93aWR0aCAqIF9pbnZzY2FsZTtcclxuICAgICAgICAgICAgQ2FtZXJhQm91bmRzLmhlaWdodCA9IHZpZXdwb3J0X2hlaWdodCAqIF9pbnZzY2FsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBWZWN0b3IyIHRtcCA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChQb3NpdGlvbi5YICE9IFRhcmdldFBvc2l0aW9uLlggfHwgUG9zaXRpb24uWSAhPSBUYXJnZXRQb3NpdGlvbi5ZKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2Zsb2F0IGRpc3QgPSAoUG9zaXRpb24gLSBUYXJnZXRQb3NpdGlvbikuTGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgZGlzdCA9IFBvc2l0aW9uLkRpc3RhbmNlKFRhcmdldFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIGZsb2F0IHNwZCA9IExpbmVhclBhblNwZWVkKyhkaXN0ICogTGVycFBhblNwZWVkKTtcclxuICAgICAgICAgICAgICAgIHNwZCAqPSBzcGVlZG1vZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlzdCA8PSBzcGQgfHwgaW5zdGF3YXJwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFBvc2l0aW9uLlggPSBUYXJnZXRQb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICAgICAgICAgIFBvc2l0aW9uLlkgPSBUYXJnZXRQb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3Rhd2FycCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0bXAuQ29weUZyb20oUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRtcC5TdWJ0cmFjdChUYXJnZXRQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdG1wLlNldEFzTm9ybWFsaXplKHNwZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9WZWN0b3IyIFYgPSAoUG9zaXRpb24gLSBUYXJnZXRQb3NpdGlvbikuTm9ybWFsaXplKHNwZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgUG9zaXRpb24uU3VidHJhY3QodG1wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChTdGFnZUJvdW5kcyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFBvc2l0aW9uLlggPSBNYXRoSGVscGVyLkNsYW1wKFBvc2l0aW9uLlgsIFN0YWdlQm91bmRzLmxlZnQsIFN0YWdlQm91bmRzLnJpZ2h0LSBDYW1lcmFCb3VuZHMud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFBvc2l0aW9uLlkgPSBNYXRoSGVscGVyLkNsYW1wKFBvc2l0aW9uLlksIFN0YWdlQm91bmRzLnRvcCwgU3RhZ2VCb3VuZHMuYm90dG9tLSBDYW1lcmFCb3VuZHMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgVGFyZ2V0UG9zaXRpb24uWCA9IE1hdGhIZWxwZXIuQ2xhbXAoVGFyZ2V0UG9zaXRpb24uWCwgU3RhZ2VCb3VuZHMubGVmdCwgU3RhZ2VCb3VuZHMucmlnaHQgLSBDYW1lcmFCb3VuZHMud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRhcmdldFBvc2l0aW9uLlkgPSBNYXRoSGVscGVyLkNsYW1wKFRhcmdldFBvc2l0aW9uLlksIFN0YWdlQm91bmRzLnRvcCwgU3RhZ2VCb3VuZHMuYm90dG9tIC0gQ2FtZXJhQm91bmRzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBDYW1lcmFCb3VuZHMueCA9IFBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIENhbWVyYUJvdW5kcy55ID0gUG9zaXRpb24uWTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQXBwbHkoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnLlNjYWxlKFNjYWxlLCBTY2FsZSk7XHJcbiAgICAgICAgICAgIGcuVHJhbnNsYXRlKC1Qb3NpdGlvbi5YLCAtUG9zaXRpb24uWSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBFbnRpdHlcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgQW5pbWF0aW9uIEFuaTtcclxuICAgICAgICBwdWJsaWMgYm9vbCBBbGl2ZSA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIGJvb2wgVmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgU3BlZWQgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHB1YmxpYyBHYW1lIEdhbWU7XHJcbiAgICAgICAgcHJvdGVjdGVkIExpc3Q8RW50aXR5QmVoYXZpb3I+IF9iZWhhdmlvcnM7XHJcbiAgICAgICAgcHJvdGVjdGVkIExpc3Q8aW50PiBfYmVoYXZpb3JUaWNrcztcclxuICAgICAgICBwdWJsaWMgaW50IFpPcmRlciA9IDA7XHJcbiAgICAgICAgLy9wdWJsaWMgZG91YmxlIElEO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgSUQ7XHJcbiAgICAgICAgcHVibGljIGJvb2wgSGlkZUhpdGJveDtcclxuICAgICAgICBwdWJsaWMgYm9vbCBIYW5kbGVkTG9jYWxseSA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IEhzcGVlZFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTcGVlZC5YO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTcGVlZC5YID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFZzcGVlZFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTcGVlZC5ZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTcGVlZC5ZID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFBvc2l0aW9uXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFuaS5Qb3NpdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQW5pLlBvc2l0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHhcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQW5pLlBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFuaS5Qb3NpdGlvbi5YID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQW5pLlBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFuaS5Qb3NpdGlvbi5ZID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBXaWR0aFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChBbmkuQ3VycmVudEltYWdlICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFuaS5DdXJyZW50SW1hZ2UuV2lkdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGZsb2F0IEhlaWdodFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChBbmkuQ3VycmVudEltYWdlICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFuaS5DdXJyZW50SW1hZ2UuSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEJlaGF2aW9yKEVudGl0eUJlaGF2aW9yIGJlaGF2aW9yKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9iZWhhdmlvcnMgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX2JlaGF2aW9ycyA9IG5ldyBMaXN0PEVudGl0eUJlaGF2aW9yPigpO1xyXG4gICAgICAgICAgICAgICAgX2JlaGF2aW9yVGlja3MgPSBuZXcgTGlzdDxpbnQ+KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX2JlaGF2aW9ycy5BZGQoYmVoYXZpb3IpO1xyXG4gICAgICAgICAgICBfYmVoYXZpb3JUaWNrcy5BZGQoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEJlaGF2aW9yPFQ+KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChfYmVoYXZpb3JzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9iZWhhdmlvcnMgPSBuZXcgTGlzdDxFbnRpdHlCZWhhdmlvcj4oKTtcclxuICAgICAgICAgICAgICAgIF9iZWhhdmlvclRpY2tzID0gbmV3IExpc3Q8aW50PigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBCID0gQWN0aXZhdG9yLkNyZWF0ZUluc3RhbmNlKHR5cGVvZihUKSwgdGhpcyk7XHJcbiAgICAgICAgICAgIF9iZWhhdmlvcnMuQWRkKChFbnRpdHlCZWhhdmlvcilCKTtcclxuICAgICAgICAgICAgX2JlaGF2aW9yVGlja3MuQWRkKDApO1xyXG4gICAgICAgICAgICAvKmlmIChCIGlzIEVudGl0eUJlaGF2aW9yKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfYmVoYXZpb3JzLkFkZCgoRW50aXR5QmVoYXZpb3IpQik7XHJcbiAgICAgICAgICAgICAgICBfYmVoYXZpb3JUaWNrcy5BZGQoMCk7XHJcbiAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJBdHRlbXB0ZWQgdG8gYWRkIGFuIGludmFsaWQgYmVoYXZpb3JcIik7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVCZWhhdmlvcihFbnRpdHlCZWhhdmlvciBiZWhhdmlvcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChfYmVoYXZpb3JzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9iZWhhdmlvcnMgPSBuZXcgTGlzdDxFbnRpdHlCZWhhdmlvcj4oKTtcclxuICAgICAgICAgICAgICAgIF9iZWhhdmlvclRpY2tzID0gbmV3IExpc3Q8aW50PigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfYmVoYXZpb3JzLkNvbnRhaW5zKGJlaGF2aW9yKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX2JlaGF2aW9yVGlja3MuUmVtb3ZlQXQoX2JlaGF2aW9ycy5JbmRleE9mKGJlaGF2aW9yKSk7XHJcbiAgICAgICAgICAgICAgICBfYmVoYXZpb3JzLlJlbW92ZShiZWhhdmlvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlQmVoYXZpb3I8VD4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9iZWhhdmlvcnMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgTGlzdDxFbnRpdHlCZWhhdmlvcj4gTCA9IG5ldyBMaXN0PEVudGl0eUJlaGF2aW9yPihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yPihfYmVoYXZpb3JzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yLCBib29sPikoYmVoYXZpb3IgPT4gYmVoYXZpb3IgaXMgVCkpKTtcclxuICAgICAgICAgICAgLyppZiAoTC5Db3VudCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJlbW92ZUJlaGF2aW9yKExbMF0pO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgZm9yZWFjaCAoRW50aXR5QmVoYXZpb3IgYmVoYXZpb3IgaW4gTClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVtb3ZlQmVoYXZpb3IoYmVoYXZpb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFQgR2V0QmVoYXZpb3I8VD4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9iZWhhdmlvcnMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0KFQpO1xyXG4gICAgICAgICAgICAvKkxpc3Q8RW50aXR5QmVoYXZpb3I+IEwgPSBuZXcgTGlzdDxFbnRpdHlCZWhhdmlvcj4oX2JlaGF2aW9ycy5XaGVyZShiZWhhdmlvciA9PiBiZWhhdmlvciBpcyBUKSk7XHJcbiAgICAgICAgICAgIGlmIChMLkNvdW50PjApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZHluYW1pYylMWzBdO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuRmlyc3Q8Z2xvYmFsOjpDaXJub0dhbWUuRW50aXR5QmVoYXZpb3I+KF9iZWhhdmlvcnMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpDaXJub0dhbWUuRW50aXR5QmVoYXZpb3IsIGJvb2w+KShiZWhhdmlvciA9PiBiZWhhdmlvciBpcyBUKSkuQ2FzdDxUPigpO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdChUKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9wdWJsaWMgVCBHZXRCZWhhdmlvcjxUPihGdW5jPEVudGl0eUJlaGF2aW9yLGJvb2w+IGZ1bmMpXHJcbiAgICAgICAgcHVibGljIFQgR2V0QmVoYXZpb3I8VD4oRnVuYzxULCBib29sPiBmdW5jKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxFbnRpdHlCZWhhdmlvcj4gTCA9IG5ldyBMaXN0PEVudGl0eUJlaGF2aW9yPihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yPihfYmVoYXZpb3JzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yLCBib29sPikoYmVoYXZpb3IgPT4gYmVoYXZpb3IgaXMgVCkpKTtcclxuICAgICAgICAgICAgRnVuYzxFbnRpdHlCZWhhdmlvciwgYm9vbD4gRiA9IGZ1bmMuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkZpcnN0PGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yPihMLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yLCBib29sPilGKS5DYXN0PFQ+KCk7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIEwuRmlyc3QoZnVuYykuQ2FzdDxUPigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIEdldFRlYW1Db2xvcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcyBpcyBJQ29tYmF0YW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoR2FtZS5HYW1lUGxheVNldHRpbmdzLkdhbWVNb2RlLlRlYW1zKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBHYW1lLkdldFRlYW1Db2xvcigoKElDb21iYXRhbnQpdGhpcykuVGVhbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT0gR2FtZS5wbGF5ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2FtZS5HZXRUZWFtQ29sb3IoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBHYW1lLkdldFRlYW1Db2xvcigyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIFNhbWVUZWFtKEVudGl0eSBjb21iYXRhbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcyA9PSBjb21iYXRhbnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcyBpcyBJQ29tYmF0YW50ICYmIGNvbWJhdGFudCBpcyBJQ29tYmF0YW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKChJQ29tYmF0YW50KXRoaXMpLlRlYW0gPT0gKChJQ29tYmF0YW50KWNvbWJhdGFudCkuVGVhbSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoR2FtZS5HYW1lUGxheVNldHRpbmdzLkdhbWVNb2RlLlRlYW1zKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gKChJQ29tYmF0YW50KXRoaXMpLlRlYW0gIT0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoKElDb21iYXRhbnQpdGhpcykuVGVhbSA9PSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBFbnRpdHlCZWhhdmlvciBHZXRCZWhhdmlvckZyb21OYW1lKHN0cmluZyBOYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKF9iZWhhdmlvcnMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAvL0xpc3Q8RW50aXR5QmVoYXZpb3I+IEwgPSBuZXcgTGlzdDxFbnRpdHlCZWhhdmlvcj4oX2JlaGF2aW9ycy5XaGVyZShiZWhhdmlvciA9PiBiZWhhdmlvci5HZXRUeXBlKCkuRnVsbE5hbWU9PXR5cGVGdWxsTmFtZSkpO1xyXG4gICAgICAgICAgICAvKkxpc3Q8RW50aXR5QmVoYXZpb3I+IEwgPSBuZXcgTGlzdDxFbnRpdHlCZWhhdmlvcj4oX2JlaGF2aW9ycy5XaGVyZShiZWhhdmlvciA9PiBiZWhhdmlvci5CZWhhdmlvck5hbWUgPT0gTmFtZSkpO1xyXG4gICAgICAgICAgICBpZiAoTC5Db3VudCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZHluYW1pYylMWzBdO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkZpcnN0PGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yPihfYmVoYXZpb3JzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eUJlaGF2aW9yLCBib29sPikoYmVoYXZpb3IgPT4gYmVoYXZpb3IuQmVoYXZpb3JOYW1lID09IE5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcIkJlaGF2aW9yIFwiICsgTmFtZSArIFwiIHdhcyBub3QgZm91bmQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKnB1YmxpYyB2aXJ0dWFsIGJvb2wgSGFuZGxlZExvY2FsbHlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gR2FtZS5Ib3N0ZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9Ki9cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIEN1c3RvbUV2ZW50KGR5bmFtaWMgZXZ0KVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qcHVibGljIHZvaWQgU2VuZEN1c3RvbUV2ZW50KGR5bmFtaWMgZXZ0LCBib29sIHRyaWdnZXJmbHVzaCA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZHluYW1pYyBEID0gbmV3IG9iamVjdCgpO1xyXG4gICAgICAgICAgICBELkkgPSBJRDtcclxuICAgICAgICAgICAgRC5EID0gZXZ0O1xyXG4gICAgICAgICAgICBHYW1lLlNlbmRFdmVudChcIkNFXCIsIEQsdHJpZ2dlcmZsdXNoKTtcclxuICAgICAgICB9Ki9cclxuICAgICAgICBwdWJsaWMgdm9pZCBQbGF5U291bmQoc3RyaW5nIHNvdW5kKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2FtZS5QbGF5U291bmRFZmZlY3QoZ2V0Q2VudGVyKCksIHNvdW5kKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIFZlY3RvcjIgZ2V0Q2VudGVyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIFBvc2l0aW9uICsgbmV3IFZlY3RvcjIoV2lkdGggLyAyLCBIZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgcmV0dXJuIFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBXaWR0aCAvIDIsIEhlaWdodCAvIDIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypwdWJsaWMgTGlnaHQgR2V0TGlnaHQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMgaXMgSUxpZ2h0U291cmNlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gR2FtZS5MaWdodHMuRmlyc3QobCA9PiBsLnNvdXJjZSA9PSB0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9Ki9cclxuXHJcbiAgICAgICAgcHVibGljIEVudGl0eShHYW1lIGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL0lEID0gTWF0aC5SYW5kb20oKTtcclxuICAgICAgICAgICAgSUQgPSBIZWxwZXIuR2V0UmFuZG9tU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHRoaXMuR2FtZSA9IGdhbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCBSZWN0YW5nbGUgR2V0SGl0Ym94KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChBbmkgIT0gbnVsbCAmJiBBbmkuQ3VycmVudEltYWdlICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKEFuaS5YLCBBbmkuWSwgQW5pLkN1cnJlbnRJbWFnZS5XaWR0aCwgQW5pLkN1cnJlbnRJbWFnZS5IZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQW5pLlBvc2l0aW9uICs9IFNwZWVkO1xyXG4gICAgICAgICAgICBBbmkuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChfYmVoYXZpb3JzICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgX2JlaGF2aW9ycy5Db3VudClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBFbnRpdHlCZWhhdmlvciBiZWhhdmlvciA9IF9iZWhhdmlvcnNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJlaGF2aW9yLmVuYWJsZWQgJiYgX2JlaGF2aW9yVGlja3NbaV0rKyA+PSBiZWhhdmlvci5GcmFtZXNQZXJUaWNrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2JlaGF2aW9yVGlja3NbaV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWhhdmlvci5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZnJlc2hCZWhhdmlvclRpY2s8VD4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRW50aXR5QmVoYXZpb3IgQiA9IEdldEJlaGF2aW9yPFQ+KCkuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgIGlmIChCICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBfYmVoYXZpb3JUaWNrc1tfYmVoYXZpb3JzLkluZGV4T2YoQildID0gQi5GcmFtZXNQZXJUaWNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBEcmF3KENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQW5pLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIGlmICghSGlkZUhpdGJveCAmJiBHYW1lLlNob3dIaXRib3gpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERyYXdIaXRib3goZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF9iZWhhdmlvcnMgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoRW50aXR5QmVoYXZpb3IgYmVoYXZpb3IgaW4gX2JlaGF2aW9ycylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvci5EcmF3KGcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXdIaXRib3goQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSZWN0YW5nbGUgUiA9IEdldEhpdGJveCgpO1xyXG4gICAgICAgICAgICBpZiAoUiAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBnLlN0cm9rZVN0eWxlID0gXCIjRkZGRjAwXCI7XHJcbiAgICAgICAgICAgICAgICBnLlN0cm9rZVJlY3QoKGludClSLngsIChpbnQpUi55LCAoaW50KVIud2lkdGgsIChpbnQpUi5oZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIG9uUmVtb3ZlKClcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVQYWRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbCBjb25uZWN0ZWQ7XHJcbiAgICAgICAgcHVibGljIGRvdWJsZVtdIGF4ZXM7XHJcbiAgICAgICAgcHVibGljIEdhbWVQYWRCdXR0b25bXSBidXR0b25zO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgaWQ7XHJcbiAgICAgICAgcHVibGljIGxvbmcgaW5kZXg7XHJcbiAgICAgICAgcHVibGljIEdhbWVQYWQoZHluYW1pYyBwYWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZCA9IHBhZC5pZDtcclxuICAgICAgICAgICAgaW5kZXggPSBwYWQuaW5kZXg7XHJcbiAgICAgICAgICAgIGNvbm5lY3RlZCA9IHBhZC5jb25uZWN0ZWQ7XHJcbiAgICAgICAgICAgIGF4ZXMgPSBwYWQuYXhlcztcclxuXHJcbiAgICAgICAgICAgIGludCBsZW5ndGggPSBwYWQuYnV0dG9ucy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBidXR0b25zID0gbmV3IEdhbWVQYWRCdXR0b25bbGVuZ3RoXTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaTxsZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnNbaV0gPSBwYWQuYnV0dG9uc1tpXTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGJ1dHRvbnMuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25zW2ldLnRhcHBlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENvbWJpbmVEYXRhKEdhbWVQYWQgcGFkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGlkID09IHBhZC5pZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29ubmVjdGVkID0gcGFkLmNvbm5lY3RlZDtcclxuICAgICAgICAgICAgICAgIGF4ZXMgPSBwYWQuYXhlcztcclxuICAgICAgICAgICAgICAgIC8vYnV0dG9ucyA9IHBhZC5idXR0b25zO1xyXG4gICAgICAgICAgICAgICAgQ29tYmluZUJ1dHRvbkRhdGEocGFkLmJ1dHRvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2b2lkIENvbWJpbmVCdXR0b25EYXRhKEdhbWVQYWRCdXR0b25bXSBidXR0b25zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2FtZVBhZEJ1dHRvbltdIExiID0gYnV0dG9ucztcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zID0gYnV0dG9ucztcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGJ1dHRvbnMuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnV0dG9uc1tpXS5wcmVzc2VkICYmICFMYltpXS5wcmVzc2VkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnNbaV0udGFwcGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lUGFkQnV0dG9uXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGJvb2wgdGFwcGVkO1xyXG4gICAgICAgIHB1YmxpYyBib29sIHByZXNzZWQ7XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSB2YWx1ZTtcclxuICAgICAgICBwdWJsaWMgR2FtZVBhZEJ1dHRvbihkeW5hbWljIGJ1dHRvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByZXNzZWQgPSBidXR0b24ucHJlc3NlZDtcclxuICAgICAgICAgICAgdmFsdWUgPSBidXR0b24udmFsdWU7XHJcbiAgICAgICAgICAgIHRhcHBlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lUGFkTWFuYWdlclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR2FtZVBhZE1hbmFnZXIgX3RoaXM7XHJcbiAgICAgICAgcHVibGljIEdhbWVQYWRNYW5hZ2VyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdhbWVwYWRzID0gbmV3IExpc3Q8R2FtZVBhZD4oKTtcclxuICAgICAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBMaXN0PEdhbWVQYWQ+IGFjdGl2ZUdhbWVwYWRzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMaXN0PEdhbWVQYWQ+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpDaXJub0dhbWUuR2FtZVBhZD4oZ2FtZXBhZHMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpDaXJub0dhbWUuR2FtZVBhZCwgYm9vbD4pKGdhbWVwYWQgPT4gZ2FtZXBhZC5jb25uZWN0ZWQpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEdhbWVQYWQga2V5Ym9hcmQ7XHJcbiAgICAgICAgcHVibGljIExpc3Q8R2FtZVBhZD4gZ2FtZXBhZHM7XHJcbiAgICAgICAgcHJpdmF0ZSBkeW5hbWljIHRlbXBnYW1lcGFkcztcclxuICAgICAgICBwdWJsaWMgdm9pZCBDYWxsQmFja1Rlc3QoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiQ2FsbGJhY2shXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgR2FtZVBhZCBHZXRQYWQoc3RyaW5nIGlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxHYW1lUGFkPiBMID0gbmV3IExpc3Q8R2FtZVBhZD4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OkNpcm5vR2FtZS5HYW1lUGFkPihnYW1lcGFkcywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkNpcm5vR2FtZS5HYW1lUGFkLCBib29sPikoZ2FtZXBhZCA9PiBnYW1lcGFkLmlkID09IGlkKSkpO1xyXG4gICAgICAgICAgICBpZiAoTC5Db3VudD4wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTFswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBnYW1lcGFkcy5Db3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZ2FtZXBhZHNbaV0uVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgIHRlbXBnYW1lcGFkcyA9IFNjcmlwdC5Xcml0ZTxvYmplY3Q+KFwiKG5hdmlnYXRvci5nZXRHYW1lcGFkcygpIHx8IG5hdmlnYXRvci53ZWJraXRHZXRHYW1lcGFkcygpIHx8IFtdKVwiKTtcclxuICAgICAgICAgICAgTGlzdDxHYW1lUGFkPiBwYWRzID0gbmV3IExpc3Q8R2FtZVBhZD4oKTtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCB0ZW1wZ2FtZXBhZHMubGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGVtcGdhbWVwYWRzW2ldICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgR2FtZVBhZCBwYWQgPSBuZXcgR2FtZVBhZCh0ZW1wZ2FtZXBhZHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIF9VcGRhdGUocGFkKTtcclxuICAgICAgICAgICAgICAgICAgICBwYWRzLkFkZChwYWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICAvL0FkZHMgYW55IG5ld2x5IGZvdW5kIGdhbWVwYWRzLlxyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IHBhZHMuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN0cmluZyBpZCA9IHBhZHNbaV0uaWQ7XHJcbiAgICAgICAgICAgICAgICBpbnQgaiA9IDA7XHJcbiAgICAgICAgICAgICAgICBib29sIG9rID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChqPGdhbWVwYWRzLkNvdW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnYW1lcGFkc1tqXS5pZCA9PSBpZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGorKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvaylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBnYW1lcGFkcy5BZGQocGFkc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qQWN0aW9uIEYgPSBDYWxsQmFja1Rlc3Q7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcInNldFRpbWVvdXQoRiwgMzAwMCk7XCIpOyovXHJcbiAgICAgICAgICAgIC8vR2xvYmFsLlNldFRpbWVvdXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZvaWQgX1VwZGF0ZShHYW1lUGFkIHBhZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBnYW1lcGFkcy5Db3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgR2FtZVBhZCBQID0gZ2FtZXBhZHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoUC5pZCA9PSBwYWQuaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUC5Db21iaW5lRGF0YShwYWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVQbGF5U2V0dGluZ3NcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbCBPbmxpbmU9ZmFsc2U7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBNeUNoYXJhY3Rlcj1cIlJlaXNlblwiO1xyXG4gICAgICAgIHB1YmxpYyBHYW1lTW9kZSBHYW1lTW9kZTtcclxuICAgICAgICBwdWJsaWMgaW50IE15VGVhbT0xO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgQmx1ZU5QQ3MgPSAzO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgUmVkTlBDcyA9IDI7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBSb29tSUQgPSBcIlwiO1xyXG4gICAgICAgIC8vL3B1YmxpYyBOZXRQbGF5IEhvc3ROUE91dDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgQ29tcHV0ZXJBSU1vZGlmaWVyID0gMWY7XHJcbiAgICAgICAgcHVibGljIEdhbWVQbGF5U2V0dGluZ3MoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9HYW1lTW9kZSA9IG5ldyBHYW1lTW9kZSgpO1xyXG4gICAgICAgICAgICAvL0dhbWVNb2RlID0gR2FtZU1vZGUuRGVhdGhNYXRjaDtcclxuICAgICAgICAgICAgR2FtZU1vZGUgPSBHYW1lTW9kZS5UZWFtQmF0dGxlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgSGVscGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgR2V0UmFuZG9tU3RyaW5nKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIChNYXRoLlJhbmRvbSgpICogbmV3IERhdGUoKS5HZXRUaW1lKCkpLlRvU3RyaW5nKDM2KS5SZXBsYWNlKFwiL1xcXFwuLyBnLCAnLSdcIixudWxsKTtcclxuICAgICAgICAgICAgLy9yZXR1cm4gKE1hdGguUmFuZG9tKCkgKiBuZXcgRGF0ZSgpLkdldFRpbWUoKSkuVG9TdHJpbmcoMzYpLlJlcGxhY2UobmV3IEJyaWRnZS5UZXh0LlJlZ3VsYXJFeHByZXNzaW9ucy5SZWdleChcIlwiLCBudWxsKTtcclxuICAgICAgICAgICAgLy9yZXR1cm4gU2NyaXB0LldyaXRlPHN0cmluZz4oXCIoTWF0aC5yYW5kb20oKSAqIG5ldyBEYXRlKCkuZ2V0VGltZSgpKS50b1N0cmluZygzNikucmVwbGFjZSgvXFxcXC4vIGcsICctJylcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBTY3JpcHQuV3JpdGU8c3RyaW5nPihcIihNYXRoLnJhbmRvbSgpICogbmV3IERhdGUoKS5nZXRUaW1lKCkpLnRvU3RyaW5nKDM2KVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0YXRpYyBEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBfbmFtZXNwYWNlcyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PigpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVHlwZSBHZXRUeXBlKHN0cmluZyBGdWxsTmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0cmluZyBuYW1lID0gRnVsbE5hbWU7XHJcbiAgICAgICAgICAgIGlmIChuYW1lID09IFwiXCIgfHwgbmFtZSA9PSBudWxsIHx8ICFuYW1lLkNvbnRhaW5zKFwiLlwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBzdHJpbmdbXSBzID0gbmFtZS5TcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgIC8vc3RyaW5nIG5tID0gR2V0VHlwZSgpLkZ1bGxOYW1lLlNwbGl0KFwiLlwiKVswXTtcclxuICAgICAgICAgICAgaW50IGkgPSAxO1xyXG4gICAgICAgICAgICAvKmlmIChzWzBdICE9IG5tKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7Ki9cclxuXHJcbiAgICAgICAgICAgIC8vZHluYW1pYyBvYmogPSBTY3JpcHQuV3JpdGU8b2JqZWN0PihubSk7XHJcblxyXG4gICAgICAgICAgICAvL0dldCBuYW1lc3BhY2VcclxuICAgICAgICAgICAgZHluYW1pYyBvYmo7XHJcbiAgICAgICAgICAgIGlmIChfbmFtZXNwYWNlcy5Db250YWluc0tleShzWzBdKSlcclxuICAgICAgICAgICAgICAgIG9iaiA9IF9uYW1lc3BhY2VzW3NbMF1dO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IEdsb2JhbC5FdmFsPG9iamVjdD4oc1swXSk7XHJcbiAgICAgICAgICAgICAgICBfbmFtZXNwYWNlc1tzWzBdXSA9IG9iajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBzLkxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9QYXJzZSB0aHJvdWdoIG9iamVjdCBoaWVyYXJjaHkuXHJcbiAgICAgICAgICAgICAgICBpZiAoIVNjcmlwdC5Xcml0ZTxib29sPihcIm9ialwiKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIG9iaiA9IG9ialtzW2ldXTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgQWRkTXVsdGlwbGU8VD4oVFtdIGFycmF5LFQgaXRlbSxpbnQgbnVtYmVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgd2hpbGUgKG51bWJlcj4wKVxyXG4gICAgICAgICAgICB7XHJcbkNpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLlB1c2g8VD4oICAgICAgICAgICAgICAgIGFycmF5LGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgUmVwZWF0KHN0cmluZyBzLGludCBudW1iZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobnVtYmVyPDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0cmluZyByZXQgPSBzO1xyXG4gICAgICAgICAgICBpbnQgaSA9IG51bWJlci0xO1xyXG4gICAgICAgICAgICB3aGlsZSAoaT4wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBzO1xyXG4gICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ2xvbmVDYW52YXMoSFRNTENhbnZhc0VsZW1lbnQgQylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IHJldCA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICByZXQuV2lkdGggPSBDLldpZHRoO1xyXG4gICAgICAgICAgICByZXQuSGVpZ2h0ID0gQy5IZWlnaHQ7XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnID0gcmV0LkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBnLkRyYXdJbWFnZShDLCAwZiwgMGYpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBHZXRDb250ZXh0KEhUTUxDYW52YXNFbGVtZW50IEMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gQy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkeW5hbWljIEdldEZpZWxkKGR5bmFtaWMgdGFyZ2V0LHN0cmluZyBmaWVsZE5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkeW5hbWljIE8gPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIC8vaWYgKE9bZmllbGROYW1lXSlcclxuICAgICAgICAgICAgaWYgKEhhcyhPLGZpZWxkTmFtZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPW2ZpZWxkTmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKE9bXCJnZXRcIiArIGZpZWxkTmFtZV0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPW1wiZ2V0XCIgKyBmaWVsZE5hbWVdKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyaW5nIHMgPSBcIlwiO1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcyA9IFwiSGVscGVyIGdldCBmaWVsZDogRmllbGQgXFxcIlwiICsgZmllbGROYW1lICsgXCJcXFwiIHdhcyBub3QgaW4gXCIgKyB0YXJnZXQuR2V0VHlwZSgpLkZ1bGxOYW1lICsgXCIuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2hcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcyA9IFwiSGVscGVyIGdldCBmaWVsZDogRmllbGQgXFxcIlwiICsgZmllbGROYW1lICsgXCJcXFwiIHdhcyBub3QgaW4gXCIgKyB0YXJnZXQrIFwiLlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL0NvbnNvbGUuV3JpdGVMaW5lKHMpO1xyXG4gICAgICAgICAgICBMb2cocyk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGljIGJvb2wgSGFzKGR5bmFtaWMgdGFyZ2V0LHN0cmluZyBmaWVsZE5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvKmlmIChPW2ZpZWxkTmFtZV0gfHwgKChzdHJpbmcpTykgPT0gXCJmYWxzZVwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIHJldHVybiBTY3JpcHQuV3JpdGU8Ym9vbD4oXCJ0eXBlb2YgdGFyZ2V0W2ZpZWxkTmFtZV0gIT0gJ3VuZGVmaW5lZCdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBSZWxvYWRQYWdlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhdGlvbi5IcmVmID0gV2luZG93LkxvY2F0aW9uLkhyZWY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTZXRGaWVsZChkeW5hbWljIHRhcmdldCxzdHJpbmcgZmllbGROYW1lLCBkeW5hbWljIGRhdGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkeW5hbWljIE8gPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIC8vaWYgKE9bZmllbGROYW1lXSlcclxuICAgICAgICAgICAgaWYgKEhhcyhPLGZpZWxkTmFtZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE9bZmllbGROYW1lXSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKE9bXCJzZXRcIiArIGZpZWxkTmFtZV0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE9bXCJzZXRcIiArIGZpZWxkTmFtZV0oZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyaW5nIHMgPSBcIlwiO1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcyA9IFwiSGVscGVyIHNldCBmaWVsZDogRmllbGQgXFxcIlwiICsgZmllbGROYW1lICsgXCJcXFwiIHdhcyBub3QgaW4gXCIgKyB0YXJnZXQuR2V0VHlwZSgpLkZ1bGxOYW1lICsgXCIuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2hcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcyA9IFwiSGVscGVyIHNldCBmaWVsZDogRmllbGQgXFxcIlwiICsgZmllbGROYW1lICsgXCJcXFwiIHdhcyBub3QgaW4gXCIgKyB0YXJnZXQgKyBcIi5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL0NvbnNvbGUuV3JpdGVMaW5lKHMpO1xyXG4gICAgICAgICAgICBMb2cocyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFtUZW1wbGF0ZShcImNvbnNvbGUubG9nKHttZXNzYWdlfSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIExvZyhzdHJpbmcgbWVzc2FnZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJvb2wgYj1TY3JpcHQuV3JpdGU8Ym9vbD4oXCJjb25zb2xlLmxvZyhtZXNzYWdlKVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIENvcHlGaWVsZHMoZHluYW1pYyBzb3VyY2UsZHluYW1pYyB0YXJnZXQsc3RyaW5nW10gRmllbGRzPW51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoRmllbGRzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZpZWxkcyA9IE9iamVjdC5LZXlzKHNvdXJjZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IEZpZWxkcy5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN0cmluZyBmID0gRmllbGRzW2ldO1xyXG4gICAgICAgICAgICAgICAgU2V0RmllbGQodGFyZ2V0LCBmLCBHZXRGaWVsZChzb3VyY2UsIGYpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN0cmluZyBLZXlDb2RlVG9TdHJpbmcoaW50IGtleWNvZGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmdbXSBjb2RlbmFtZXMgPSBuZXcgc3RyaW5nW10geyBcIlwiLCAvLyBbMF1cclxuICBcIlwiLCAvLyBbMV1cclxuICBcIlwiLCAvLyBbMl1cclxuICBcIkNBTkNFTFwiLCAvLyBbM11cclxuICBcIlwiLCAvLyBbNF1cclxuICBcIlwiLCAvLyBbNV1cclxuICBcIkhFTFBcIiwgLy8gWzZdXHJcbiAgXCJcIiwgLy8gWzddXHJcbiAgXCJCQUNLX1NQQUNFXCIsIC8vIFs4XVxyXG4gIFwiVEFCXCIsIC8vIFs5XVxyXG4gIFwiXCIsIC8vIFsxMF1cclxuICBcIlwiLCAvLyBbMTFdXHJcbiAgXCJDTEVBUlwiLCAvLyBbMTJdXHJcbiAgXCJFTlRFUlwiLCAvLyBbMTNdXHJcbiAgXCJFTlRFUl9TUEVDSUFMXCIsIC8vIFsxNF1cclxuICBcIlwiLCAvLyBbMTVdXHJcbiAgXCJTSElGVFwiLCAvLyBbMTZdXHJcbiAgXCJDT05UUk9MXCIsIC8vIFsxN11cclxuICBcIkFMVFwiLCAvLyBbMThdXHJcbiAgXCJQQVVTRVwiLCAvLyBbMTldXHJcbiAgXCJDQVBTX0xPQ0tcIiwgLy8gWzIwXVxyXG4gIFwiS0FOQVwiLCAvLyBbMjFdXHJcbiAgXCJFSVNVXCIsIC8vIFsyMl1cclxuICBcIkpVTkpBXCIsIC8vIFsyM11cclxuICBcIkZJTkFMXCIsIC8vIFsyNF1cclxuICBcIkhBTkpBXCIsIC8vIFsyNV1cclxuICBcIlwiLCAvLyBbMjZdXHJcbiAgXCJFU0NBUEVcIiwgLy8gWzI3XVxyXG4gIFwiQ09OVkVSVFwiLCAvLyBbMjhdXHJcbiAgXCJOT05DT05WRVJUXCIsIC8vIFsyOV1cclxuICBcIkFDQ0VQVFwiLCAvLyBbMzBdXHJcbiAgXCJNT0RFQ0hBTkdFXCIsIC8vIFszMV1cclxuICBcIlNQQUNFXCIsIC8vIFszMl1cclxuICBcIlBBR0VfVVBcIiwgLy8gWzMzXVxyXG4gIFwiUEFHRV9ET1dOXCIsIC8vIFszNF1cclxuICBcIkVORFwiLCAvLyBbMzVdXHJcbiAgXCJIT01FXCIsIC8vIFszNl1cclxuICBcIkxFRlRcIiwgLy8gWzM3XVxyXG4gIFwiVVBcIiwgLy8gWzM4XVxyXG4gIFwiUklHSFRcIiwgLy8gWzM5XVxyXG4gIFwiRE9XTlwiLCAvLyBbNDBdXHJcbiAgXCJTRUxFQ1RcIiwgLy8gWzQxXVxyXG4gIFwiUFJJTlRcIiwgLy8gWzQyXVxyXG4gIFwiRVhFQ1VURVwiLCAvLyBbNDNdXHJcbiAgXCJQUklOVFNDUkVFTlwiLCAvLyBbNDRdXHJcbiAgXCJJTlNFUlRcIiwgLy8gWzQ1XVxyXG4gIFwiREVMRVRFXCIsIC8vIFs0Nl1cclxuICBcIlwiLCAvLyBbNDddXHJcbiAgXCIwXCIsIC8vIFs0OF1cclxuICBcIjFcIiwgLy8gWzQ5XVxyXG4gIFwiMlwiLCAvLyBbNTBdXHJcbiAgXCIzXCIsIC8vIFs1MV1cclxuICBcIjRcIiwgLy8gWzUyXVxyXG4gIFwiNVwiLCAvLyBbNTNdXHJcbiAgXCI2XCIsIC8vIFs1NF1cclxuICBcIjdcIiwgLy8gWzU1XVxyXG4gIFwiOFwiLCAvLyBbNTZdXHJcbiAgXCI5XCIsIC8vIFs1N11cclxuICBcIkNPTE9OXCIsIC8vIFs1OF1cclxuICBcIlNFTUlDT0xPTlwiLCAvLyBbNTldXHJcbiAgXCJMRVNTX1RIQU5cIiwgLy8gWzYwXVxyXG4gIFwiRVFVQUxTXCIsIC8vIFs2MV1cclxuICBcIkdSRUFURVJfVEhBTlwiLCAvLyBbNjJdXHJcbiAgXCJRVUVTVElPTl9NQVJLXCIsIC8vIFs2M11cclxuICBcIkFUXCIsIC8vIFs2NF1cclxuICBcIkFcIiwgLy8gWzY1XVxyXG4gIFwiQlwiLCAvLyBbNjZdXHJcbiAgXCJDXCIsIC8vIFs2N11cclxuICBcIkRcIiwgLy8gWzY4XVxyXG4gIFwiRVwiLCAvLyBbNjldXHJcbiAgXCJGXCIsIC8vIFs3MF1cclxuICBcIkdcIiwgLy8gWzcxXVxyXG4gIFwiSFwiLCAvLyBbNzJdXHJcbiAgXCJJXCIsIC8vIFs3M11cclxuICBcIkpcIiwgLy8gWzc0XVxyXG4gIFwiS1wiLCAvLyBbNzVdXHJcbiAgXCJMXCIsIC8vIFs3Nl1cclxuICBcIk1cIiwgLy8gWzc3XVxyXG4gIFwiTlwiLCAvLyBbNzhdXHJcbiAgXCJPXCIsIC8vIFs3OV1cclxuICBcIlBcIiwgLy8gWzgwXVxyXG4gIFwiUVwiLCAvLyBbODFdXHJcbiAgXCJSXCIsIC8vIFs4Ml1cclxuICBcIlNcIiwgLy8gWzgzXVxyXG4gIFwiVFwiLCAvLyBbODRdXHJcbiAgXCJVXCIsIC8vIFs4NV1cclxuICBcIlZcIiwgLy8gWzg2XVxyXG4gIFwiV1wiLCAvLyBbODddXHJcbiAgXCJYXCIsIC8vIFs4OF1cclxuICBcIllcIiwgLy8gWzg5XVxyXG4gIFwiWlwiLCAvLyBbOTBdXHJcbiAgXCJPU19LRVlcIiwgLy8gWzkxXSBXaW5kb3dzIEtleSAoV2luZG93cykgb3IgQ29tbWFuZCBLZXkgKE1hYylcclxuICBcIlwiLCAvLyBbOTJdXHJcbiAgXCJDT05URVhUX01FTlVcIiwgLy8gWzkzXVxyXG4gIFwiXCIsIC8vIFs5NF1cclxuICBcIlNMRUVQXCIsIC8vIFs5NV1cclxuICBcIk5VTVBBRDBcIiwgLy8gWzk2XVxyXG4gIFwiTlVNUEFEMVwiLCAvLyBbOTddXHJcbiAgXCJOVU1QQUQyXCIsIC8vIFs5OF1cclxuICBcIk5VTVBBRDNcIiwgLy8gWzk5XVxyXG4gIFwiTlVNUEFENFwiLCAvLyBbMTAwXVxyXG4gIFwiTlVNUEFENVwiLCAvLyBbMTAxXVxyXG4gIFwiTlVNUEFENlwiLCAvLyBbMTAyXVxyXG4gIFwiTlVNUEFEN1wiLCAvLyBbMTAzXVxyXG4gIFwiTlVNUEFEOFwiLCAvLyBbMTA0XVxyXG4gIFwiTlVNUEFEOVwiLCAvLyBbMTA1XVxyXG4gIFwiTVVMVElQTFlcIiwgLy8gWzEwNl1cclxuICBcIkFERFwiLCAvLyBbMTA3XVxyXG4gIFwiU0VQQVJBVE9SXCIsIC8vIFsxMDhdXHJcbiAgXCJTVUJUUkFDVFwiLCAvLyBbMTA5XVxyXG4gIFwiREVDSU1BTFwiLCAvLyBbMTEwXVxyXG4gIFwiRElWSURFXCIsIC8vIFsxMTFdXHJcbiAgXCJGMVwiLCAvLyBbMTEyXVxyXG4gIFwiRjJcIiwgLy8gWzExM11cclxuICBcIkYzXCIsIC8vIFsxMTRdXHJcbiAgXCJGNFwiLCAvLyBbMTE1XVxyXG4gIFwiRjVcIiwgLy8gWzExNl1cclxuICBcIkY2XCIsIC8vIFsxMTddXHJcbiAgXCJGN1wiLCAvLyBbMTE4XVxyXG4gIFwiRjhcIiwgLy8gWzExOV1cclxuICBcIkY5XCIsIC8vIFsxMjBdXHJcbiAgXCJGMTBcIiwgLy8gWzEyMV1cclxuICBcIkYxMVwiLCAvLyBbMTIyXVxyXG4gIFwiRjEyXCIsIC8vIFsxMjNdXHJcbiAgXCJGMTNcIiwgLy8gWzEyNF1cclxuICBcIkYxNFwiLCAvLyBbMTI1XVxyXG4gIFwiRjE1XCIsIC8vIFsxMjZdXHJcbiAgXCJGMTZcIiwgLy8gWzEyN11cclxuICBcIkYxN1wiLCAvLyBbMTI4XVxyXG4gIFwiRjE4XCIsIC8vIFsxMjldXHJcbiAgXCJGMTlcIiwgLy8gWzEzMF1cclxuICBcIkYyMFwiLCAvLyBbMTMxXVxyXG4gIFwiRjIxXCIsIC8vIFsxMzJdXHJcbiAgXCJGMjJcIiwgLy8gWzEzM11cclxuICBcIkYyM1wiLCAvLyBbMTM0XVxyXG4gIFwiRjI0XCIsIC8vIFsxMzVdXHJcbiAgXCJcIiwgLy8gWzEzNl1cclxuICBcIlwiLCAvLyBbMTM3XVxyXG4gIFwiXCIsIC8vIFsxMzhdXHJcbiAgXCJcIiwgLy8gWzEzOV1cclxuICBcIlwiLCAvLyBbMTQwXVxyXG4gIFwiXCIsIC8vIFsxNDFdXHJcbiAgXCJcIiwgLy8gWzE0Ml1cclxuICBcIlwiLCAvLyBbMTQzXVxyXG4gIFwiTlVNX0xPQ0tcIiwgLy8gWzE0NF1cclxuICBcIlNDUk9MTF9MT0NLXCIsIC8vIFsxNDVdXHJcbiAgXCJXSU5fT0VNX0ZKX0pJU0hPXCIsIC8vIFsxNDZdXHJcbiAgXCJXSU5fT0VNX0ZKX01BU1NIT1VcIiwgLy8gWzE0N11cclxuICBcIldJTl9PRU1fRkpfVE9VUk9LVVwiLCAvLyBbMTQ4XVxyXG4gIFwiV0lOX09FTV9GSl9MT1lBXCIsIC8vIFsxNDldXHJcbiAgXCJXSU5fT0VNX0ZKX1JPWUFcIiwgLy8gWzE1MF1cclxuICBcIlwiLCAvLyBbMTUxXVxyXG4gIFwiXCIsIC8vIFsxNTJdXHJcbiAgXCJcIiwgLy8gWzE1M11cclxuICBcIlwiLCAvLyBbMTU0XVxyXG4gIFwiXCIsIC8vIFsxNTVdXHJcbiAgXCJcIiwgLy8gWzE1Nl1cclxuICBcIlwiLCAvLyBbMTU3XVxyXG4gIFwiXCIsIC8vIFsxNThdXHJcbiAgXCJcIiwgLy8gWzE1OV1cclxuICBcIkNJUkNVTUZMRVhcIiwgLy8gWzE2MF1cclxuICBcIkVYQ0xBTUFUSU9OXCIsIC8vIFsxNjFdXHJcbiAgXCJET1VCTEVfUVVPVEVcIiwgLy8gWzE2Ml1cclxuICBcIkhBU0hcIiwgLy8gWzE2M11cclxuICBcIkRPTExBUlwiLCAvLyBbMTY0XVxyXG4gIFwiUEVSQ0VOVFwiLCAvLyBbMTY1XVxyXG4gIFwiQU1QRVJTQU5EXCIsIC8vIFsxNjZdXHJcbiAgXCJVTkRFUlNDT1JFXCIsIC8vIFsxNjddXHJcbiAgXCJPUEVOX1BBUkVOXCIsIC8vIFsxNjhdXHJcbiAgXCJDTE9TRV9QQVJFTlwiLCAvLyBbMTY5XVxyXG4gIFwiQVNURVJJU0tcIiwgLy8gWzE3MF1cclxuICBcIlBMVVNcIiwgLy8gWzE3MV1cclxuICBcIlBJUEVcIiwgLy8gWzE3Ml1cclxuICBcIkhZUEhFTl9NSU5VU1wiLCAvLyBbMTczXVxyXG4gIFwiT1BFTl9DVVJMWV9CUkFDS0VUXCIsIC8vIFsxNzRdXHJcbiAgXCJDTE9TRV9DVVJMWV9CUkFDS0VUXCIsIC8vIFsxNzVdXHJcbiAgXCJUSUxERVwiLCAvLyBbMTc2XVxyXG4gIFwiXCIsIC8vIFsxNzddXHJcbiAgXCJcIiwgLy8gWzE3OF1cclxuICBcIlwiLCAvLyBbMTc5XVxyXG4gIFwiXCIsIC8vIFsxODBdXHJcbiAgXCJWT0xVTUVfTVVURVwiLCAvLyBbMTgxXVxyXG4gIFwiVk9MVU1FX0RPV05cIiwgLy8gWzE4Ml1cclxuICBcIlZPTFVNRV9VUFwiLCAvLyBbMTgzXVxyXG4gIFwiXCIsIC8vIFsxODRdXHJcbiAgXCJcIiwgLy8gWzE4NV1cclxuICBcIlNFTUlDT0xPTlwiLCAvLyBbMTg2XVxyXG4gIFwiRVFVQUxTXCIsIC8vIFsxODddXHJcbiAgXCJDT01NQVwiLCAvLyBbMTg4XVxyXG4gIFwiTUlOVVNcIiwgLy8gWzE4OV1cclxuICBcIlBFUklPRFwiLCAvLyBbMTkwXVxyXG4gIFwiU0xBU0hcIiwgLy8gWzE5MV1cclxuICBcIkJBQ0tfUVVPVEVcIiwgLy8gWzE5Ml1cclxuICBcIlwiLCAvLyBbMTkzXVxyXG4gIFwiXCIsIC8vIFsxOTRdXHJcbiAgXCJcIiwgLy8gWzE5NV1cclxuICBcIlwiLCAvLyBbMTk2XVxyXG4gIFwiXCIsIC8vIFsxOTddXHJcbiAgXCJcIiwgLy8gWzE5OF1cclxuICBcIlwiLCAvLyBbMTk5XVxyXG4gIFwiXCIsIC8vIFsyMDBdXHJcbiAgXCJcIiwgLy8gWzIwMV1cclxuICBcIlwiLCAvLyBbMjAyXVxyXG4gIFwiXCIsIC8vIFsyMDNdXHJcbiAgXCJcIiwgLy8gWzIwNF1cclxuICBcIlwiLCAvLyBbMjA1XVxyXG4gIFwiXCIsIC8vIFsyMDZdXHJcbiAgXCJcIiwgLy8gWzIwN11cclxuICBcIlwiLCAvLyBbMjA4XVxyXG4gIFwiXCIsIC8vIFsyMDldXHJcbiAgXCJcIiwgLy8gWzIxMF1cclxuICBcIlwiLCAvLyBbMjExXVxyXG4gIFwiXCIsIC8vIFsyMTJdXHJcbiAgXCJcIiwgLy8gWzIxM11cclxuICBcIlwiLCAvLyBbMjE0XVxyXG4gIFwiXCIsIC8vIFsyMTVdXHJcbiAgXCJcIiwgLy8gWzIxNl1cclxuICBcIlwiLCAvLyBbMjE3XVxyXG4gIFwiXCIsIC8vIFsyMThdXHJcbiAgXCJPUEVOX0JSQUNLRVRcIiwgLy8gWzIxOV1cclxuICBcIkJBQ0tfU0xBU0hcIiwgLy8gWzIyMF1cclxuICBcIkNMT1NFX0JSQUNLRVRcIiwgLy8gWzIyMV1cclxuICBcIlFVT1RFXCIsIC8vIFsyMjJdXHJcbiAgXCJcIiwgLy8gWzIyM11cclxuICBcIk1FVEFcIiwgLy8gWzIyNF1cclxuICBcIkFMVEdSXCIsIC8vIFsyMjVdXHJcbiAgXCJcIiwgLy8gWzIyNl1cclxuICBcIldJTl9JQ09fSEVMUFwiLCAvLyBbMjI3XVxyXG4gIFwiV0lOX0lDT18wMFwiLCAvLyBbMjI4XVxyXG4gIFwiXCIsIC8vIFsyMjldXHJcbiAgXCJXSU5fSUNPX0NMRUFSXCIsIC8vIFsyMzBdXHJcbiAgXCJcIiwgLy8gWzIzMV1cclxuICBcIlwiLCAvLyBbMjMyXVxyXG4gIFwiV0lOX09FTV9SRVNFVFwiLCAvLyBbMjMzXVxyXG4gIFwiV0lOX09FTV9KVU1QXCIsIC8vIFsyMzRdXHJcbiAgXCJXSU5fT0VNX1BBMVwiLCAvLyBbMjM1XVxyXG4gIFwiV0lOX09FTV9QQTJcIiwgLy8gWzIzNl1cclxuICBcIldJTl9PRU1fUEEzXCIsIC8vIFsyMzddXHJcbiAgXCJXSU5fT0VNX1dTQ1RSTFwiLCAvLyBbMjM4XVxyXG4gIFwiV0lOX09FTV9DVVNFTFwiLCAvLyBbMjM5XVxyXG4gIFwiV0lOX09FTV9BVFROXCIsIC8vIFsyNDBdXHJcbiAgXCJXSU5fT0VNX0ZJTklTSFwiLCAvLyBbMjQxXVxyXG4gIFwiV0lOX09FTV9DT1BZXCIsIC8vIFsyNDJdXHJcbiAgXCJXSU5fT0VNX0FVVE9cIiwgLy8gWzI0M11cclxuICBcIldJTl9PRU1fRU5MV1wiLCAvLyBbMjQ0XVxyXG4gIFwiV0lOX09FTV9CQUNLVEFCXCIsIC8vIFsyNDVdXHJcbiAgXCJBVFROXCIsIC8vIFsyNDZdXHJcbiAgXCJDUlNFTFwiLCAvLyBbMjQ3XVxyXG4gIFwiRVhTRUxcIiwgLy8gWzI0OF1cclxuICBcIkVSRU9GXCIsIC8vIFsyNDldXHJcbiAgXCJQTEFZXCIsIC8vIFsyNTBdXHJcbiAgXCJaT09NXCIsIC8vIFsyNTFdXHJcbiAgXCJcIiwgLy8gWzI1Ml1cclxuICBcIlBBMVwiLCAvLyBbMjUzXVxyXG4gIFwiV0lOX09FTV9DTEVBUlwiLCAvLyBbMjU0XVxyXG4gIFwiXCIgLy8gWzI1NV1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGtleWNvZGU+PTAgJiYga2V5Y29kZTwgY29kZW5hbWVzLkxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvZGVuYW1lc1trZXljb2RlXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIga2MgPSBrZXljb2RlO1xyXG4gICAgICAgICAgICByZXR1cm4gU2NyaXB0LldyaXRlPHN0cmluZz4oXCJTdHJpbmcuRnJvbUNoYXJDb2RlKGtjKVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkeW5hbWljIE1ha2VTaGFsbG93Q29weShkeW5hbWljIHNvdXJjZSxzdHJpbmdbXSBmaWVsZE5hbWVzPW51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkeW5hbWljIHRhcmdldCA9IG5ldyBvYmplY3QoKTtcclxuICAgICAgICAgICAgc3RyaW5nW10gRmllbGRzID0gZmllbGROYW1lcztcclxuICAgICAgICAgICAgaWYgKEZpZWxkcyA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBGaWVsZHMgPSBPYmplY3QuS2V5cyhzb3VyY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBGaWVsZHMuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzdHJpbmcgZiA9IEZpZWxkc1tpXTtcclxuICAgICAgICAgICAgICAgIHRhcmdldFtmXSA9IEdldEZpZWxkKHNvdXJjZSwgZik7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEJyaWRnZTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBIZWxwZXJFeHRlbnNpb25zXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUIFBpY2s8VD4odGhpcyBJRW51bWVyYWJsZTxUPiBsaXN0LCBSYW5kb20gUk5EPW51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoUk5EID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJORCA9IG5ldyBSYW5kb20oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBMaXN0PFQ+IEwgPSBuZXcgTGlzdDxUPigpO1xyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgaXRlbSBpbiBsaXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBMLkFkZChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gTFtSTkQuTmV4dChMLkNvdW50KV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBGb3JFYWNoPFQ+KHRoaXMgSUVudW1lcmFibGU8VD4gbGlzdCwgQWN0aW9uPFQ+IGFjdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKHZhciBpdGVtIGluIGxpc3QpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbihpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRm9yRWFjaDxUPih0aGlzIElFbnVtZXJhYmxlPFQ+IGxpc3QsIHN0cmluZyBtZXRob2ROYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAodmFyIGl0ZW0gaW4gbGlzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQWN0aW9uIEEgPSBpdGVtW21ldGhvZE5hbWVdLkFzPEFjdGlvbj4oKTtcclxuICAgICAgICAgICAgICAgIEEoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgQWRkSWZOZXc8VD4odGhpcyBMaXN0PFQ+IGxpc3QsIFQgaXRlbSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgdmFyIGxuID0gbGlzdC5Db3VudDtcclxuICAgICAgICAgICAgb2JqZWN0IEEgPSBpdGVtO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGxuKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QgQiA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlPGJvb2w+KFwiQSA9PSBCXCIpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsaXN0LkFkZChpdGVtKTtcclxuICAgICAgICAgICAgLyppZiAoIWxpc3QuQ29udGFpbnMoaXRlbSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxpc3QuQWRkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIHZvaWQgUmVtb3ZlQWxsPFQ+KHRoaXMgSUVudW1lcmFibGU8VD4gbGlzdCwgQWN0aW9uPFQ+IGFjdGlvbilcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUmVtb3ZlQWxsPFQ+KHRoaXMgTGlzdDxUPiBsaXN0LCBGdW5jPFQsYm9vbD4gcHJlZGljYXRlKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIC8vZm9yZWFjaCAodmFyIGl0ZW0gaW4gbGlzdClcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGxpc3QuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIC8vYWN0aW9uKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2xpc3QucmVtXHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5SZW1vdmUoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBbVGVtcGxhdGUoXCJ7Kmxpc3R9LnB1c2goeyp2YWx9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUHVzaDxUPih0aGlzIFRbXSBsaXN0LFQgdmFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU2NyaXB0LldyaXRlKFwibGlzdC5wdXNoKHZhbClcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUHVzaElmTmV3PFQ+KHRoaXMgVFtdIGxpc3QsIFQgdmFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFDaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Db250YWluc0I8VD4obGlzdCx2YWwpKVxyXG4gICAgICAgICAgICB7XHJcbkNpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLlB1c2g8VD4oICAgICAgICAgICAgICAgIGxpc3QsdmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFB1c2hSYW5nZTxUPih0aGlzIFRbXSBsaXN0LCBwYXJhbXMgVFtdIHZhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCB2YWwuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbkNpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLlB1c2g8VD4oICAgICAgICAgICAgICAgIGxpc3QsdmFsW2ldKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgW1RlbXBsYXRlKFwieypsaXN0fS5wb3AoKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFQgUG9wPFQ+KHRoaXMgVFtdIGxpc3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gU2NyaXB0LldyaXRlPFQ+KFwibGlzdC5wb3AoKVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBDbGVhcjxUPih0aGlzIFRbXSBsaXN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGkgPSBsaXN0Lkxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGktLT4wKVxyXG4gICAgICAgICAgICAgICAgbGlzdC5Qb3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBSZXBsYWNlQWxsPFQ+KHRoaXMgVFtdIGxpc3QsIFRbXSBTb3VyY2UsIFRbXSBEZXN0aW5hdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpID0gLTE7XHJcbiAgICAgICAgICAgIGkgPSBJbmRleE9mPFQ+KGxpc3QsIFNvdXJjZSwgaSsxLDMpO1xyXG4gICAgICAgICAgICB2YXIgbG4gPSBTb3VyY2UuTGVuZ3RoO1xyXG4gICAgICAgICAgICB3aGlsZSAoaT49MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGogPSAwO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IGxuKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RbaSArIGpdID0gRGVzdGluYXRpb25bal07XHJcbiAgICAgICAgICAgICAgICAgICAgaisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSA9IEluZGV4T2Y8VD4obGlzdCwgU291cmNlLCBpKzEsMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUW10gV2hlcmVCPFQ+KHRoaXMgVFtdIGxpc3QsIEZ1bmM8VCwgYm9vbD4gcHJlZGljYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgb2JqZWN0W10gcmV0ID0gbmV3IG9iamVjdFswXTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICBpbnQgbG4gPSBsaXN0Lkxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGk8bG4pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbkNpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLlB1c2g8b2JqZWN0PiggICAgICAgICAgICAgICAgICAgIHJldCxpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldC5BczxUW10+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgQ29udGFpbnNCPFQ+KHRoaXMgTGlzdDxUPiBsaXN0LCBvYmplY3QgVmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBUW10gTCA9IGxpc3RbXCJpdGVtc1wiXS5BczxUW10+KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBDb250YWluc0I8VD4oTCxWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgQ29udGFpbnNCPFQ+KHRoaXMgVFtdIGxpc3Qsb2JqZWN0IFZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICBpbnQgbG4gPSBsaXN0Lkxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0IE8gPSBsaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZTxib29sPihcIk8gPT0gVmFsdWVcIikpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgSW5kZXhPZjxUPih0aGlzIFRbXSBsaXN0LFRbXSBWYWx1ZSxpbnQgaW5kZXg9MCxpbnQgc3RydWN0dXJlU2l6ZT0xKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGkgPSBpbmRleDtcclxuICAgICAgICAgICAgdmFyIGxuID0gbGlzdC5MZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciB2bG4gPSBWYWx1ZS5MZW5ndGg7XHJcbiAgICAgICAgICAgIG9iamVjdCBPID0gVmFsdWVbMF07XHJcbiAgICAgICAgICAgIG9iamVjdCBBO1xyXG4gICAgICAgICAgICBvYmplY3QgQjtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsbiAmJiBpPj0wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvKnZhciBjID0gaSsxO1xyXG4gICAgICAgICAgICAgICAgaSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgQiA9IFZhbHVlWzBdO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGMgPCBsaXN0Lkxlbmd0aCAmJiBpPT0tMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBBID0gbGlzdFtjXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQSA9PSBCKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGMrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpID09IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAgICAgaSA9IGxpc3QuSW5kZXhPZihPLkFzPHN0cmluZz4oKSxpKzEpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGk+PTAgJiYgaSAlIHN0cnVjdHVyZVNpemUgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGkgPSBsaXN0LkluZGV4T2YoTy5BczxzdHJpbmc+KCksIGkgKyAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpID09IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBrID0gMTtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gaSsxO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IGxuICYmIGkgPj0gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBib29sIG9rID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAob2sgJiYgayA8IHZsbilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEEgPSBsaXN0W2xdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCID0gVmFsdWVba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBICE9IEIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvaylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBJZGVudGljYWw8VD4odGhpcyBUW10gbGlzdCwgVFtdIGxpc3QyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxpc3QgPT0gbGlzdDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsaXN0ID09IG51bGwgfHwgbGlzdDIgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBsbiA9IGxpc3QuTGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAobG4gPT0gbGlzdDIuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgbG4pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0IEEgPSBsaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdCBCID0gbGlzdDJbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEEgIT0gQilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUmV2ZXJzZU9yZGVyV2l0aFN0cnVjdHVyZTxUPih0aGlzIFRbXSBsaXN0LCBpbnQgc2l6ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vVFtdIHJldCA9IG5ldyBUWzBdO1xyXG4gICAgICAgICAgICBMaXN0PFQ+IHJldCA9IG5ldyBMaXN0PFQ+KCk7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgaW50IGxuID0gbGlzdC5MZW5ndGg7XHJcbiAgICAgICAgICAgIHdoaWxlIChpPGxuKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgaiA9IDA7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoajxzaXplKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcmV0LlB1c2gobGlzdFtqXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0Lkluc2VydCgwLCBsaXN0WyhzaXplIC0gMSkgLSBqXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSs9c2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgQ2xlYXIodGhpcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgRylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBDID0gRy5DYW52YXM7XHJcbiAgICAgICAgICAgIEcuQ2xlYXJSZWN0KDAsIDAsIEMuV2lkdGgsIEMuSGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBub3QgeWV0IHRlc3RlZCB3aXRoIGRlZXAgaW5oZXJpdGVuY2UuLi5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cIlRcIj48L3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImluc3RhbmNlXCI+PC9wYXJhbT5cclxuICAgICAgICAvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBJc0luc3RhbmNlT2ZUeXBlRmFzdCh0aGlzIFR5cGUgVCxvYmplY3QgaW5zdGFuY2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgQyA9IGluc3RhbmNlLkFzPGR5bmFtaWM+KCkuY3RvcjtcclxuICAgICAgICAgICAgb2JqZWN0W10gQSA9IFRbXCIkJGluaGVyaXRvcnNcIl0uQXM8ZHluYW1pYz4oKTsvL2xpc3Qgb2YgYWxsIHR5cGVzIHRoYXQgaW5oZXJpdCBmcm9tIHRoaXMgdHlwZVxyXG4gICAgICAgICAgICByZXR1cm4gKEMgPT0gVCB8fCAoQSAhPSBudWxsICYmIEEuSW5kZXhPZihDKSA+PSAwKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBJbnB1dENvbnRyb2xsZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBOdW1iZXJPZkFjdGlvbnMgPSA4O1xyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aWMgR2FtZVBhZE1hbmFnZXIgR007XHJcbiAgICAgICAgcHVibGljIExpc3Q8SW5wdXRNYXA+IElucHV0TWFwcGluZztcclxuXHJcbiAgICAgICAgcHVibGljIHN0cmluZyBpZCB7IGdldDsgcHJvdGVjdGVkIHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSW5wdXRDb250cm9sbGVyKHN0cmluZyBpZD1cIktleWJvYXJkXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIElucHV0TWFwcGluZyA9IG5ldyBMaXN0PElucHV0TWFwPigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkID09IFwiS2V5Ym9hcmRcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW5pdGtleWJvYXJkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbml0Z2FtZXBhZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChHTSA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoR2FtZVBhZE1hbmFnZXIuX3RoaXMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBHYW1lUGFkTWFuYWdlci5fdGhpcyA9IG5ldyBHYW1lUGFkTWFuYWdlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgR00gPSBHYW1lUGFkTWFuYWdlci5fdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZHluYW1pYyBDb3B5TWFwKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8qZHluYW1pYyBEID0gbmV3IG9iamVjdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gRDsqL1xyXG4gICAgICAgICAgICBzdHJpbmdbXSBmaWVsZHMgPSBuZXcgc3RyaW5nW10geyBcIm1hcFwiLFwiYW50aW1hcFwiLFwibmFtZVwiLFwiYXhpc1wiLFwiY29udHJvbGxlcklEXCJ9O1xyXG4gICAgICAgICAgICBkeW5hbWljW10gcmV0ID0gbmV3IGR5bmFtaWNbSW5wdXRNYXBwaW5nLkNvdW50XTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IHJldC5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldFtpXSA9IEhlbHBlci5NYWtlU2hhbGxvd0NvcHkoSW5wdXRNYXBwaW5nW2ldLCBmaWVsZHMpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENvcHlGcm9tTWFwKGR5bmFtaWNbXSBNYXApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmdbXSBmaWVsZHMgPSBuZXcgc3RyaW5nW10geyBcIm1hcFwiLCBcImFudGltYXBcIiwgXCJuYW1lXCIsIFwiYXhpc1wiLCBcImNvbnRyb2xsZXJJRFwiIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgTWFwLkxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGk+PSBJbnB1dE1hcHBpbmcuQ291bnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgSW5wdXRNYXBwaW5nLkFkZChuZXcgSW5wdXRNYXAoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBJbnB1dE1hcCBJTSA9IElucHV0TWFwcGluZ1tpXTtcclxuICAgICAgICAgICAgICAgIEhlbHBlci5Db3B5RmllbGRzKE1hcFtpXSwgSU0sZmllbGRzKTtcclxuICAgICAgICAgICAgICAgIC8vcmV0W2ldID0gSGVscGVyLk1ha2VTaGFsbG93Q29weShJbnB1dE1hcHBpbmdbaV0sIGZpZWxkcyk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgaW5pdGtleWJvYXJkKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBOdW1iZXJPZkFjdGlvbnMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIElucHV0TWFwIG1hcCA9IG5ldyBJbnB1dE1hcCgtMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5tYXAgPSAzOTtcclxuICAgICAgICAgICAgICAgICAgICBtYXAuYW50aW1hcCA9IDM3O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKm1hcC5tYXAgPSA2ODtcclxuICAgICAgICAgICAgICAgICAgICBtYXAuYW50aW1hcD0gNjU7Ki9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpID09IDEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLm1hcCA9IDQwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5hbnRpbWFwID0gMzg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qbWFwLm1hcCA9IDgzO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5hbnRpbWFwID0gODc7Ki9cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAyKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vbWFwLm1hcCA9IDMyO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5tYXAgPSA5MDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpID09IDMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLm1hcCA9IDg4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gNClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXAubWFwID0gNjU7Ly9hXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSA1KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5tYXAgPSAxMzsvL2VudGVyXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBJbnB1dE1hcHBpbmcuQWRkKG1hcCk7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgaW5pdGdhbWVwYWQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IE51bWJlck9mQWN0aW9ucylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSW5wdXRNYXAgbWFwID0gbmV3IElucHV0TWFwKC0xKTtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLm1hcCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLmF4aXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXAubWFwID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBtYXAuYXhpcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAxKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5tYXAgPSBpIC0gMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIElucHV0TWFwcGluZy5BZGQobWFwKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgZ2V0U3RhdGUoaW50IGFjdGlvbixJbnB1dE1hcCBtYXA9bnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChtYXAgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIG1hcCA9IElucHV0TWFwcGluZ1thY3Rpb25dO1xyXG4gICAgICAgICAgICAvKklucHV0Q29udHJvbGxlciBJQyA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmIChtYXAuY29udHJvbGxlciAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBJQyA9IG1hcC5jb250cm9sbGVyO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgc3RyaW5nIFRJRCA9IGlkO1xyXG4gICAgICAgICAgICBpZiAobWFwLmNvbnRyb2xsZXJJRCE9XCJcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVElEID0gbWFwLmNvbnRyb2xsZXJJRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKFRJRCA9PSBcIktleWJvYXJkXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRLZXlib2FyZE1hcFN0YXRlKG1hcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoVElEID09IFwiTW91c2VcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldE1vdXNlTWFwU3RhdGUobWFwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRHYW1lcGFkTWFwU3RhdGUobWFwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgZ2V0UHJlc3NlZChpbnQgYWN0aW9uLElucHV0TWFwIG1hcD1udWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldFN0YXRlKGFjdGlvbixtYXApID49IDAuN2Y7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBJbnB1dE1hcCBGaW5kQW55UHJlc3NlZEdhbWVQYWRJbnB1dCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBJbnB1dE1hcCByZXQgPSBuZXcgSW5wdXRNYXAoKTtcclxuICAgICAgICAgICAgTGlzdDxHYW1lUGFkPiBMID0gR2FtZVBhZE1hbmFnZXIuX3RoaXMuYWN0aXZlR2FtZXBhZHM7XHJcbiAgICAgICAgICAgIEwuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6Q2lybm9HYW1lLkdhbWVQYWQ+KShHID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXQubWFwID09IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC5jb250cm9sbGVySUQgPSBHLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIEdhbWVQYWRCdXR0b25bXSBHQiA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpDaXJub0dhbWUuR2FtZVBhZEJ1dHRvbj4oRy5idXR0b25zLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkdhbWVQYWRCdXR0b24sIGJvb2w+KShCID0+IEIucHJlc3NlZCkpLlRvQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoR0IuTGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldC5heGlzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEdhbWVQYWRCdXR0b24gdG1wID0gR0JbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldC5tYXAgPSBuZXcgTGlzdDxHYW1lUGFkQnV0dG9uPihHLmJ1dHRvbnMpLkluZGV4T2YodG1wKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaSA8IEcuYXhlcy5MZW5ndGggJiYgcmV0Lm1hcCA9PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKEcuYXhlc1tpXSk+MC43ICYmIE1hdGguQWJzKEcuYXhlc1tpXSkgPCAyLjApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LmF4aXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldC5tYXAgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChHLmF4ZXNbaV0gPCAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0Lm5hbWUgPSBcImFudGlcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LmFudGltYXAgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4pICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmIChyZXQubWFwIT0tMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBnZXRNYXBDb250cm9sbGVySUQoSW5wdXRNYXAgbWFwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKG1hcC5jb250cm9sbGVySUQgIT0gXCJcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcC5jb250cm9sbGVySUQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBnZXRNYXBDb250cm9sbGVySUQoaW50IGFjdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRNYXBDb250cm9sbGVySUQoSW5wdXRNYXBwaW5nW2FjdGlvbl0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZmxvYXQgZ2V0R2FtZXBhZE1hcFN0YXRlKElucHV0TWFwIG1hcClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0cmluZyBUSUQgPSBpZDtcclxuICAgICAgICAgICAgaWYgKG1hcC5jb250cm9sbGVySUQgIT0gXCJcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVElEID0gbWFwLmNvbnRyb2xsZXJJRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBHYW1lUGFkIFAgPSBHYW1lUGFkTWFuYWdlci5fdGhpcy5HZXRQYWQoVElEKTtcclxuICAgICAgICAgICAgaWYgKFAgPT0gbnVsbCB8fCAhUC5jb25uZWN0ZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghbWFwLmF4aXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChQLmJ1dHRvbnNbbWFwLm1hcF0ucHJlc3NlZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1hcC5hbnRpbWFwPj0wICYmIFAuYnV0dG9uc1ttYXAuYW50aW1hcF0ucHJlc3NlZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZmxvYXQpUC5heGVzW21hcC5tYXBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBmbG9hdCBnZXRLZXlib2FyZE1hcFN0YXRlKElucHV0TWFwIG1hcClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8aW50PiBMID0gS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlByZXNzZWRCdXR0b25zO1xyXG4gICAgICAgICAgICBpZiAoTC5Db250YWlucyhtYXAubWFwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDFmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKEwuQ29udGFpbnMobWFwLmFudGltYXApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTFmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZmxvYXQgZ2V0TW91c2VNYXBTdGF0ZShJbnB1dE1hcCBtYXApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PGludD4gTCA9IEtleWJvYXJkTWFuYWdlci5fdGhpcy5QcmVzc2VkTW91c2VCdXR0b25zO1xyXG4gICAgICAgICAgICBpZiAoTC5Db250YWlucyhtYXAubWFwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDFmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKEwuQ29udGFpbnMobWFwLmFudGltYXApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTFmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIElucHV0Q29udHJvbGxlck1hbmFnZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTGlzdDxJbnB1dENvbnRyb2xsZXI+IENvbnRyb2xsZXJzO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSW5wdXRDb250cm9sbGVyTWFuYWdlciBfdGhpc1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfX3RoaXMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfX3RoaXMgPSBuZXcgSW5wdXRDb250cm9sbGVyTWFuYWdlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgSW5pdCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoX190aGlzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9fdGhpcyA9IG5ldyBJbnB1dENvbnRyb2xsZXJNYW5hZ2VyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0YXRpYyBJbnB1dENvbnRyb2xsZXJNYW5hZ2VyIF9fdGhpcztcclxuICAgICAgICBwcm90ZWN0ZWQgSW5wdXRDb250cm9sbGVyTWFuYWdlcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDb250cm9sbGVycyA9IG5ldyBMaXN0PElucHV0Q29udHJvbGxlcj4oKTtcclxuXHJcbiAgICAgICAgICAgIENvbnRyb2xsZXJzLkFkZChuZXcgSW5wdXRDb250cm9sbGVyKCkpO1xyXG4gICAgICAgICAgICBMaXN0PEdhbWVQYWQ+IGdhbWVwYWRzID0gR2FtZVBhZE1hbmFnZXIuX3RoaXMuYWN0aXZlR2FtZXBhZHM7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBnYW1lcGFkcy5Db3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbGxlcnMuQWRkKG5ldyBJbnB1dENvbnRyb2xsZXIoZ2FtZXBhZHNbaV0uaWQpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBJbnB1dE1hcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBpbnQgbWFwPS0xO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgYW50aW1hcCA9IC0xO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgbmFtZT1cIlwiO1xyXG4gICAgICAgIHB1YmxpYyBib29sIGF4aXM9ZmFsc2U7XHJcbiAgICAgICAgLy9wdWJsaWMgSW5wdXRDb250cm9sbGVyIGNvbnRyb2xsZXI7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjb250cm9sbGVySUQ9XCJcIjtcclxuICAgICAgICBwdWJsaWMgSW5wdXRNYXAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYXhpcyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgSW5wdXRNYXAoaW50IG1hcCxpbnQgYW50aW1hcD0tMSxib29sIGF4aXM9ZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLm1hcCA9IG1hcDtcclxuICAgICAgICAgICAgdGhpcy5hbnRpbWFwID0gYW50aW1hcDtcclxuICAgICAgICAgICAgdGhpcy5heGlzID0gYXhpcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEpTT05BcmNoaXZlXHJcbiAgICB7XHJcbiAgICAgICAgLy91c2UgRm9sZGVyMkpTT04gdG8gY3JlYXRlIHRoZSBhcmNoaXZlLlxyXG5cclxuICAgICAgICAvL3B1YmxpYyBzdHJpbmcgQXJjaGl2ZTtcclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxzdHJpbmcsIHN0cmluZz4gRGF0YSA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgc3RyaW5nPigpO1xyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PHN0cmluZywgSFRNTEltYWdlRWxlbWVudD4gSW1hZ2VzID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBIVE1MSW1hZ2VFbGVtZW50PigpO1xyXG4gICAgICAgIHB1YmxpYyBKU09OQXJjaGl2ZShzdHJpbmcgQXJjaGl2ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5BcmNoaXZlID0gQXJjaGl2ZTtcclxuICAgICAgICAgICAgc3RyaW5nW11bXSBEID0gU2NyaXB0LldyaXRlPGR5bmFtaWM+KFwiSlNPTi5wYXJzZShBcmNoaXZlKVwiKTtcclxuICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbG4gPSBELkxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIEEgPSBEW2krK107XHJcbiAgICAgICAgICAgICAgICBEYXRhW0FbMF0uVG9Mb3dlcigpXSA9IEFbMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE9wZW4oc3RyaW5nIEFyY2hpdmVGaWxlLEFjdGlvbjxKU09OQXJjaGl2ZT4gYWN0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgWE1MSHR0cFJlcXVlc3QgWEhSID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIC8vWEhSLlJlc3BvbnNlVHlwZSA9IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlLkJsb2I7XHJcbiAgICAgICAgICAgIFhIUi5PbkxvYWQgPSBFdnQgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uKG5ldyBKU09OQXJjaGl2ZShYSFIuUmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFhIUi5PcGVuKFwiR0VUXCIsIEFyY2hpdmVGaWxlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIFhIUi5TZW5kKCk7XHJcbiAgICAgICAgICAgIC8vaWYgKFhIUi5TdGF0dXMpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBQcmVsb2FkSW1hZ2VzKEFjdGlvbiBhY3Rpb24saW50IGRlbGF5PTEwMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBLID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Ub0FycmF5PHN0cmluZz4oRGF0YS5LZXlzKTtcclxuICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IERhdGEuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBBID0gS1tpXTtcclxuICAgICAgICAgICAgICAgIEdldEltYWdlKEEpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEdsb2JhbC5TZXRUaW1lb3V0KChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pYWN0aW9uLCBkZWxheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgR2V0RGF0YShzdHJpbmcgZmlsZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBmID0gZmlsZS5Ub0xvd2VyKCk7XHJcbiAgICAgICAgICAgIGlmIChEYXRhLkNvbnRhaW5zS2V5KGYpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRGF0YVtmXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEhUTUxJbWFnZUVsZW1lbnQgR2V0SW1hZ2Uoc3RyaW5nIGZpbGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZiA9IGZpbGUuVG9Mb3dlcigpO1xyXG4gICAgICAgICAgICBpZiAoSW1hZ2VzLkNvbnRhaW5zS2V5KGYpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSW1hZ2VzW2ZdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBEID0gR2V0RGF0YShmKTtcclxuICAgICAgICAgICAgaWYgKEQgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJldCA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIHJldC5PbkxvYWQgPSBFID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhlbHBlci5Mb2coXCJsb2FkZWQgXCIgKyBmICsgXCIgZnJvbSBKU09OIVwiKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0LlNyYyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgRDtcclxuICAgICAgICAgICAgSW1hZ2VzW2ZdID0gcmV0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgS2V5Ym9hcmRNYW5hZ2VyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIExpc3Q8aW50PiBQcmVzc2VkQnV0dG9ucztcclxuICAgICAgICBwdWJsaWMgTGlzdDxpbnQ+IFRhcHBlZEJ1dHRvbnM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBMaXN0PGludD4gUHJlc3NlZE1vdXNlQnV0dG9ucztcclxuICAgICAgICBwdWJsaWMgTGlzdDxpbnQ+IFRhcHBlZE1vdXNlQnV0dG9ucztcclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgTW91c2VQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgQ01vdXNlID0gbmV3IFZlY3RvcjIoKTtcclxuXHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBNb3VzZURlbHRhID0gMDtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIEFsbG93UmlnaHRDbGljayA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEtleWJvYXJkTWFuYWdlciBfdGhpc1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfX3RoaXMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfX3RoaXMgPSBuZXcgS2V5Ym9hcmRNYW5hZ2VyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX190aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBJbml0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChfX3RoaXMgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX190aGlzID0gbmV3IEtleWJvYXJkTWFuYWdlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aWMgS2V5Ym9hcmRNYW5hZ2VyIF9fdGhpcztcclxuICAgICAgICBwcm90ZWN0ZWQgS2V5Ym9hcmRNYW5hZ2VyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFByZXNzZWRCdXR0b25zID0gbmV3IExpc3Q8aW50PigpO1xyXG4gICAgICAgICAgICBUYXBwZWRCdXR0b25zID0gbmV3IExpc3Q8aW50PigpO1xyXG4gICAgICAgICAgICBQcmVzc2VkTW91c2VCdXR0b25zID0gbmV3IExpc3Q8aW50PigpO1xyXG4gICAgICAgICAgICBUYXBwZWRNb3VzZUJ1dHRvbnMgPSBuZXcgTGlzdDxpbnQ+KCk7XHJcblxyXG4gICAgICAgICAgICBQcmVkaWNhdGU8S2V5Ym9hcmRFdmVudD4gS0QgPSBvbktleURvd247XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcImRvY3VtZW50Lm9ua2V5ZG93biA9IEtEO1wiKTtcclxuXHJcbiAgICAgICAgICAgIEFjdGlvbjxLZXlib2FyZEV2ZW50PiBLVSA9IG9uS2V5VXA7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcImRvY3VtZW50Lm9ua2V5dXAgPSBLVTtcIik7XHJcblxyXG4gICAgICAgICAgICBBY3Rpb248TW91c2VFdmVudD4gTU0gPSBvbk1vdXNlTW92ZTtcclxuICAgICAgICAgICAgU2NyaXB0LldyaXRlKFwiZG9jdW1lbnQub25tb3VzZW1vdmUgPSBNTTtcIik7XHJcblxyXG4gICAgICAgICAgICBQcmVkaWNhdGU8TW91c2VFdmVudD4gTUQgPSBvbk1vdXNlRG93bjtcclxuICAgICAgICAgICAgU2NyaXB0LldyaXRlKFwiZG9jdW1lbnQub25tb3VzZWRvd24gPSBNRDtcIik7XHJcblxyXG4gICAgICAgICAgICBQcmVkaWNhdGU8TW91c2VFdmVudD4gTVUgPSBvbk1vdXNlVXA7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcImRvY3VtZW50Lm9ubW91c2V1cCA9IE1VO1wiKTtcclxuXHJcblxyXG4gICAgICAgICAgICBQcmVkaWNhdGU8TW91c2VFdmVudD4gTVcgPSBvbk1vdXNlV2hlZWw7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcImRvY3VtZW50Lm9ubW91c2V3aGVlbCA9IE1XO1wiKTtcclxuICAgICAgICAgICAgU2NyaXB0LldyaXRlKFwiZG9jdW1lbnQub25Eb21Nb3VzZVNjcm9sbCA9IE1XO1wiKTtcclxuXHJcbiAgICAgICAgICAgIFdpbmRvdy5BZGRFdmVudExpc3RlbmVyKFwibW91c2V3aGVlbFwiLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PikoTSA9PiBvbk1vdXNlV2hlZWwoTS5BczxNb3VzZUV2ZW50PigpKSkpO1xyXG4gICAgICAgICAgICBXaW5kb3cuQWRkRXZlbnRMaXN0ZW5lcihcIkRPTU1vdXNlU2Nyb2xsXCIsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KShNID0+IG9uTW91c2VXaGVlbChNLkFzPE1vdXNlRXZlbnQ+KCkpKSk7XHJcblxyXG4gICAgICAgICAgICBEb2N1bWVudC5Pbk1vdXNlV2hlZWwgPSBNID0+IG9uTW91c2VXaGVlbChNKTtcclxuXHJcbiAgICAgICAgICAgIFByZWRpY2F0ZTxNb3VzZUV2ZW50PiBOQiA9IE5ldmVyaW5Cb3VuZHM7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcImRvY3VtZW50Lm9uY29udGV4dG1lbnUgPSBOQlwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9fdGhpcy5UYXBwZWRCdXR0b25zLkNsZWFyKCk7XHJcbiAgICAgICAgICAgIF9fdGhpcy5UYXBwZWRNb3VzZUJ1dHRvbnMuQ2xlYXIoKTtcclxuICAgICAgICAgICAgX190aGlzLk1vdXNlRGVsdGEgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIE5ldmVyaW5Cb3VuZHMoTW91c2VFdmVudCBldnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gQWxsb3dSaWdodENsaWNrIHx8ICFBcHAuU2NyZWVuQm91bmRzLmNvbnRhaW5zUG9pbnQoX3RoaXMuQ01vdXNlLlgsIF90aGlzLkNNb3VzZS5ZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBvbktleURvd24oS2V5Ym9hcmRFdmVudCBldnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQga2V5Q29kZSA9IGV2dC5LZXlDb2RlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFDaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Db250YWluc0I8aW50PihfX3RoaXMuUHJlc3NlZEJ1dHRvbnMsa2V5Q29kZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9fdGhpcy5QcmVzc2VkQnV0dG9ucy5BZGQoa2V5Q29kZSk7XHJcbiAgICAgICAgICAgICAgICBfX3RoaXMuVGFwcGVkQnV0dG9ucy5BZGQoa2V5Q29kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKChrZXlDb2RlID49IDM3ICYmIGtleUNvZGUgPD0gNDApIHx8IGtleUNvZGUgPT0gMzIgfHwga2V5Q29kZSA9PSAxMTIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBvbktleVVwKEtleWJvYXJkRXZlbnQgZXZ0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGtleUNvZGUgPSBldnQuS2V5Q29kZTtcclxuICAgICAgICAgICAgaWYgKENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkNvbnRhaW5zQjxpbnQ+KF9fdGhpcy5QcmVzc2VkQnV0dG9ucyxrZXlDb2RlKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgX190aGlzLlByZXNzZWRCdXR0b25zLlJlbW92ZShrZXlDb2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgb25Nb3VzZURvd24oTW91c2VFdmVudCBldnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgYnRuID0gZXZ0LkJ1dHRvbjtcclxuICAgICAgICAgICAgaWYgKCFDaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Db250YWluc0I8aW50PihfX3RoaXMuUHJlc3NlZE1vdXNlQnV0dG9ucyxidG4pKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfX3RoaXMuUHJlc3NlZE1vdXNlQnV0dG9ucy5BZGQoYnRuKTtcclxuICAgICAgICAgICAgICAgIF9fdGhpcy5UYXBwZWRNb3VzZUJ1dHRvbnMuQWRkKGJ0bik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJ0biA8IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBvbk1vdXNlVXAoTW91c2VFdmVudCBldnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgYnRuID0gZXZ0LkJ1dHRvbjtcclxuICAgICAgICAgICAgaWYgKENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkNvbnRhaW5zQjxpbnQ+KF9fdGhpcy5QcmVzc2VkTW91c2VCdXR0b25zLGJ0bikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9fdGhpcy5QcmVzc2VkTW91c2VCdXR0b25zLlJlbW92ZShidG4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBidG4gPCAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgb25Nb3VzZVdoZWVsKE1vdXNlRXZlbnQgZXZ0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX3RoaXMuTW91c2VEZWx0YSArPSBldnQuRGV0YWlsO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIG9uTW91c2VNb3ZlKE1vdXNlRXZlbnQgZXZ0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX3RoaXMuTW91c2VQb3NpdGlvbiA9IG5ldyBWZWN0b3IyKGV2dC5DbGllbnRYLCBldnQuQ2xpZW50WSk7XHJcblxyXG4gICAgICAgICAgICAvL2Zsb2F0IGxlZnQgPSBmbG9hdC5QYXJzZShBcHAuQ2FudmFzLlN0eWxlLkxlZnQuUmVwbGFjZShcInB4XCIsIFwiXCIpKTtcclxuICAgICAgICAgICAgZmxvYXQgbGVmdCA9IDA7XHJcbiAgICAgICAgICAgIGlmICghZmxvYXQuVHJ5UGFyc2UoQXBwLkRpdi5TdHlsZS5MZWZ0LlJlcGxhY2UoXCJweFwiLCBcIlwiKSwgb3V0IGxlZnQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9mbG9hdCBsZWZ0ID0gZmxvYXQuUGFyc2UoQXBwLkRpdi5TdHlsZS5MZWZ0LlJlcGxhY2UoXCJweFwiLCBcIlwiKSk7XHJcbiAgICAgICAgICAgIGZsb2F0IHggPSBldnQuQ2xpZW50WCAtIGxlZnQ7XHJcbiAgICAgICAgICAgIGZsb2F0IHkgPSBldnQuQ2xpZW50WTtcclxuXHJcbiAgICAgICAgICAgIC8vZmxvYXQgc2NhbGUgPSAoQXBwLkNhbnZhcy5XaWR0aCAqIDEuMjVmKSAvIGZsb2F0LlBhcnNlKEFwcC5DYW52YXMuU3R5bGUuV2lkdGguUmVwbGFjZShcInB4XCIsIFwiXCIpKTtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHNjYWxlID0gKEFwcC5DYW52YXMuV2lkdGgpIC8gZmxvYXQuUGFyc2UoQXBwLkRpdi5TdHlsZS5XaWR0aC5SZXBsYWNlKFwicHhcIiwgXCJcIikpO1xyXG4gICAgICAgICAgICBfdGhpcy5DTW91c2UgPSBuZXcgVmVjdG9yMih4ICogc2NhbGUsIHkgKiBzY2FsZSk7XHJcbiAgICAgICAgICAgIC8vQ29uc29sZS5Xcml0ZUxpbmUoXCJteDpcIitfdGhpcy5DTW91c2UueCArIFwiIG15OlwiICsgX3RoaXMuQ01vdXNlLnkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNYXBHZW5lcmF0b3JcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgR2VuZXJhdGUoR2FtZSBnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHBsYXllciA9IGdhbWUucGxheWVyOy8vcGxheWVyIGNoYXJhY3RlclxyXG4gICAgICAgICAgICB2YXIgbWFwID0gZ2FtZS5UTTsvL3RoZSB0aWxlbWFwIHRvIGdlbmVyYXRlXHJcbiAgICAgICAgICAgIHZhciBib3VuZHMgPSBnYW1lLnN0YWdlQm91bmRzOy8vdGhlIGJvdW5kcyB0byBzdGF5IHdpdGhpblxyXG5cclxuICAgICAgICAgICAgLy9MaXN0PFJlY3RhbmdsZT4gcm9vbXMgPSBuZXcgTGlzdDxSZWN0YW5nbGU+KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgWCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBZID0gMDtcclxuICAgICAgICAgICAgaWYgKE1hdGguUmFuZG9tKCkgPCAwLjUpXHJcbiAgICAgICAgICAgICAgICBYID0gTWF0aC5SYW5kb20oKSA8IDAuNSA/IC0xIDogMTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgWSA9IE1hdGguUmFuZG9tKCkgPCAwLjUgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBuZXcgVGlsZURhdGEoKTtcclxuICAgICAgICAgICAgVC50ZXh0dXJlID0gMTtcclxuICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgVC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgVC5tYXAgPSBtYXA7XHJcbiAgICAgICAgICAgIFQuc29saWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBULnRvcFNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy9tYXAuU2V0QWxsKFQpO1xyXG4gICAgICAgICAgICBwbGF5ZXIueCA9IChib3VuZHMubGVmdCArIGJvdW5kcy5yaWdodCkgLyAyO1xyXG4gICAgICAgICAgICBwbGF5ZXIueSA9IChib3VuZHMudG9wICsgYm91bmRzLmJvdHRvbSkgLyAyO1xyXG4gICAgICAgICAgICAvL3BhdGhNaW5lcihnYW1lLG1hcC5jb2x1bW5zLzIsbWFwLnJvd3MvMixYLFksMjApO1xyXG4gICAgICAgICAgICBwYXRoTWluZXIoZ2FtZSwgbWFwLmNvbHVtbnMgLyAyLCBtYXAucm93cyAvIDQsIFgsIFksIDMwKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBWID0gRmluZEVtcHR5U3BhY2UoZ2FtZSk7XHJcbiAgICAgICAgICAgIGlmIChWIT1udWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIueCA9IFYuWDtcclxuICAgICAgICAgICAgICAgIHBsYXllci55ID0gVi5ZO1xyXG4gICAgICAgICAgICAgICAgSGVscGVyLkxvZyhcInNwYXduaW5nIGF0OlwiKyhpbnQpVi5YK1wiLFwiKyhpbnQpVi5ZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhlbHBlci5Mb2coXCJjYW5ub3QgbG9jYXRlIGEgc3Bhd24gcG9pbnQuLi5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEJveHlHZW5lcmF0ZShHYW1lIGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBIZWxwZXIuTG9nKFwiYm94eSBnZW5lcmF0ZVwiKTtcclxuICAgICAgICAgICAgdmFyIHBsYXllciA9IGdhbWUucGxheWVyOy8vcGxheWVyIGNoYXJhY3RlclxyXG4gICAgICAgICAgICB2YXIgbWFwID0gZ2FtZS5UTTsvL3RoZSB0aWxlbWFwIHRvIGdlbmVyYXRlXHJcbiAgICAgICAgICAgIHZhciBib3VuZHMgPSBnYW1lLnN0YWdlQm91bmRzOy8vdGhlIGJvdW5kcyB0byBzdGF5IHdpdGhpblxyXG4gICAgICAgICAgICBNYXBSb29tLlBsYWNlZFJvb21zID0gbmV3IExpc3Q8TWFwUm9vbT4oKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBTWCA9IG1hcC5jb2x1bW5zIC8gMjtcclxuICAgICAgICAgICAgdmFyIFNZID0gbWFwLnJvd3MgLyAzO1xyXG4gICAgICAgICAgICB2YXIgcm9vdCA9IG5ldyBNYXBSb29tKCk7XHJcbiAgICAgICAgICAgIHJvb3QuU1ggPSBTWDtcclxuICAgICAgICAgICAgcm9vdC5TWSA9IFNZO1xyXG4gICAgICAgICAgICByb290LkVYID0gU1ggKyA2ICsgKGludCkoTWF0aC5SYW5kb20oKSAqIDEwKTtcclxuICAgICAgICAgICAgcm9vdC5FWSA9IFNZICsgNiArIChpbnQpKE1hdGguUmFuZG9tKCkgKiAxMCk7XHJcblxyXG4gICAgICAgICAgICByb290LmdhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICAgICAgLy92YXIgcm9vbXRvdGFsID0gMTIrKGludCkoTWF0aC5SYW5kb20oKSAqIDEwKTtcclxuICAgICAgICAgICAgLy92YXIgcm9vbXRvdGFsID0gMTYgKyAoaW50KShNYXRoLlJhbmRvbSgpICogMTYpO1xyXG4gICAgICAgICAgICB2YXIgcm9vbXRvdGFsID0gMTYgKyAoaW50KShNYXRoLlJhbmRvbSgpICogMTgpO1xyXG4gICAgICAgICAgICAvL3ZhciByb29tcyA9IDA7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXR0ZW1wdHMgPSA0MDA7XHJcbiAgICAgICAgICAgIHZhciBSID0gcm9vdDtcclxuICAgICAgICAgICAgaWYgKCFyb290LlBsYWNlQW5kRXhwYW5kKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhlbHBlci5Mb2coXCJDb3VsZG4ndCBnZW5lcmF0ZSByb290IHJvb20uXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlIChNYXBSb29tLlBsYWNlZFJvb21zLkNvdW50IDwgcm9vbXRvdGFsICYmIGF0dGVtcHRzPjApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBMID0gQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuUGljazxnbG9iYWw6OkNpcm5vR2FtZS5NYXBSb29tPihNYXBSb29tLkZpbmRWYWxpZFVucGxhY2VkUm9vbXMoKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTC5QbGFjZUFuZEV4cGFuZCgpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcm9vbXMrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGF0dGVtcHRzLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIFYgPSBGaW5kRW1wdHlTcGFjZShnYW1lKTtcclxuICAgICAgICAgICAgaWYgKFYgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLypwbGF5ZXIueCA9IFYuWDtcclxuICAgICAgICAgICAgICAgIHBsYXllci55ID0gVi5ZOyovXHJcbiAgICAgICAgICAgICAgICBnYW1lLkRvb3IuUG9zaXRpb24uQ29weUZyb20oVik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLkRvb3IuRHJvcFRvR3JvdW5kKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgUEMgPSAoUGxheWVyQ2hhcmFjdGVyKXBsYXllcjtcclxuICAgICAgICAgICAgICAgIC8vUEMuTW92ZVRvTmV3U3Bhd24oVik7XHJcbiAgICAgICAgICAgICAgICBQQy5Nb3ZlVG9OZXdTcGF3bihnYW1lLkRvb3IuUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgSGVscGVyLkxvZyhcInNwYXduaW5nIGF0OlwiICsgKGludClWLlggKyBcIixcIiArIChpbnQpVi5ZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhlbHBlci5Mb2coXCJjYW5ub3QgbG9jYXRlIGEgc3Bhd24gcG9pbnQuLi5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVmVjdG9yMiBGaW5kRW1wdHlTcGFjZShHYW1lIGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbWFwID0gZ2FtZS5UTTtcclxuICAgICAgICAgICAgdmFyIGJvdW5kcyA9IGdhbWUuc3RhZ2VCb3VuZHM7Ly90aGUgYm91bmRzIHRvIHN0YXkgd2l0aGluXHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgdmFyIHJldCA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgICAgIHZhciB0bXAgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IDIwMDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldC5YID0gKGZsb2F0KShib3VuZHMubGVmdCArIChNYXRoLlJhbmRvbSgpICogKGJvdW5kcy53aWR0aC1tYXAudGlsZXNpemUpKSk7XHJcbiAgICAgICAgICAgICAgICByZXQuWSA9IChmbG9hdCkoYm91bmRzLnRvcCArIChNYXRoLlJhbmRvbSgpICogKGJvdW5kcy5ib3R0b20tbWFwLnRpbGVzaXplKSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFtYXAuQ2hlY2tGb3JUaWxlKHJldCkudmlzaWJsZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0bXAuWCA9IHJldC5YO1xyXG4gICAgICAgICAgICAgICAgICAgIHRtcC5ZID0gcmV0LlkgLSBtYXAudGlsZXNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXAuQ2hlY2tGb3JUaWxlKHJldCkudmlzaWJsZSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vY3JlYXRlIHR1bm5lbHMgaGFsbHdheXMgZXRjXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBwYXRoTWluZXIoR2FtZSBnYW1lLGludCBYLGludCBZLGludCBYZGlyLGludCBZRGlyLGludCBsaW1pdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsaW1pdCA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHBsYXllciA9IGdhbWUucGxheWVyOy8vcGxheWVyIGNoYXJhY3RlclxyXG4gICAgICAgICAgICB2YXIgbWFwID0gZ2FtZS5UTTsvL3RoZSB0aWxlbWFwIHRvIGdlbmVyYXRlXHJcbiAgICAgICAgICAgIHZhciBib3VuZHMgPSBnYW1lLnN0YWdlQm91bmRzOy8vdGhlIGJvdW5kcyB0byBzdGF5IHdpdGhpblxyXG5cclxuICAgICAgICAgICAgdmFyIGRpc3QgPSAwO1xyXG4gICAgICAgICAgICB2YXIgcG93ID0gMTtcclxuICAgICAgICAgICAgaWYgKFlEaXIgIT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcG93ID0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAoZGlzdDw3ICYmIE1hdGguUmFuZG9tKCkgPCAoTWF0aC5Qb3coMC45NSxwb3cpKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWCArPSBYZGlyO1xyXG4gICAgICAgICAgICAgICAgWSArPSBZRGlyO1xyXG4gICAgICAgICAgICAgICAgRXJhc2UobWFwLCBYLCBZLCAzKTtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLlJhbmRvbSgpIDwgKDAuMipwb3cpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChYZGlyID09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFggKz0gTWF0aC5SYW5kb20oKSA8IDAuNSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFkgKz0gTWF0aC5SYW5kb20oKSA8IDAuNSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmIChNYXRoLlJhbmRvbSgpPCgwLjAyKnBvdykgJiYgbGltaXQ+NClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW1pdCA9IGxpbWl0IC8gMjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgWEQgPSBNYXRoLlJhbmRvbSgpIDwgMC41ID8gWURpciA6IC1ZRGlyO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBZRCA9IE1hdGguUmFuZG9tKCkgPCAwLjUgPyBYZGlyIDogLVhkaXI7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aE1pbmVyKGdhbWUsIFgsIFksIFhELCBZRCwgbGltaXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpbWl0LS07XHJcbiAgICAgICAgICAgIGlmIChsaW1pdCA+IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvb21NaW5lcihnYW1lLCBYLCBZLCBYZGlyLCBZRGlyLCBsaW1pdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgcm9vbU1pbmVyKEdhbWUgZ2FtZSwgaW50IFgsIGludCBZLCBpbnQgWGRpciwgaW50IFlEaXIsIGludCBsaW1pdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsaW1pdCA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBTWiA9IChpbnQpKDQgKyAoTWF0aC5SYW5kb20oKSAqIDQpKTtcclxuICAgICAgICAgICAgWCArPSBYZGlyICogKFNaIC8gMik7XHJcbiAgICAgICAgICAgIFkgKz0gWURpciAqIChTWiAvIDIpO1xyXG5cclxuICAgICAgICAgICAgLy9FcmFzZShnYW1lLlRNLCBYLCBZLCAoU1ogKiAyKSsyKTtcclxuICAgICAgICAgICAgRXJhc2VBbmRSYW5kbyhnYW1lLlRNLCBYLCBZLCAoU1ogKiAyKSArIDIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIFhEID0gWGRpcjtcclxuICAgICAgICAgICAgdmFyIFlEID0gWURpcjtcclxuICAgICAgICAgICAgaWYgKE1hdGguUmFuZG9tKCk8MC4yMCB8fCAoWUQgIT0gMCAmJiBNYXRoLlJhbmRvbSgpIDwgMC42NSkgfHwgWUQ8MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWEQgPSBNYXRoLlJhbmRvbSgpPDAuNSA/IFlEaXIgOiAtWURpcjtcclxuICAgICAgICAgICAgICAgIFlEID0gTWF0aC5SYW5kb20oKSA8IDAuNSA/IFhkaXIgOiAtWGRpcjtcclxuICAgICAgICAgICAgICAgIGlmIChZRCA8IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgWUQgPSAtWUQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgWGRpciA9IFhEO1xyXG4gICAgICAgICAgICBZRGlyID0gWUQ7XHJcblxyXG4gICAgICAgICAgICBYICs9IFhkaXIgKiAoU1ogLyAyKTtcclxuICAgICAgICAgICAgWSArPSBZRGlyICogKFNaIC8gMik7XHJcblxyXG4gICAgICAgICAgICBsaW1pdC0tO1xyXG4gICAgICAgICAgICBwYXRoTWluZXIoZ2FtZSxYLCBZLCBYZGlyLCBZRGlyLCBsaW1pdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIFRpbGVEYXRhIGJsYW5rID0gbmV3IFRpbGVEYXRhKCk7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBFcmFzZShUaWxlTWFwIFRNLGludCBjb2x1bW4saW50IHJvdyxpbnQgc2l6ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRNLkNsZWFyUmVjdChjb2x1bW4gLSAoc2l6ZS8yKSwgcm93IC0gKHNpemUvMiksIChzaXplKSwgKHNpemUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBFcmFzZUFuZFJhbmRvKFRpbGVNYXAgVE0sIGludCBjb2x1bW4sIGludCByb3csIGludCBzaXplKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFNYID0gY29sdW1uIC0gKHNpemUgLyAyKTtcclxuICAgICAgICAgICAgdmFyIFNZID0gcm93IC0gKHNpemUgLyAyKTtcclxuICAgICAgICAgICAgVE0uQ2xlYXJSZWN0KFNYLCBTWSwgKHNpemUpLCAoc2l6ZSkpO1xyXG4gICAgICAgICAgICBUTS5fR2VuUmVjdChTWCwgU1ksIFNYKyhzaXplKSwgU1krKHNpemUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9wcml2YXRlIHZvaWQgR3Jvd1Jvb21zKExpc3Q8UmVjdGFuZ2xlPiByb29tcywpXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTWFwUm9vbVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBpbnQgU1g7XHJcbiAgICAgICAgcHVibGljIGludCBTWTtcclxuICAgICAgICBwdWJsaWMgaW50IEVYO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgRVk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIHBsYWNlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL3B1YmxpYyBQb2ludFtdIEV4aXRzO1xyXG4gICAgICAgIHB1YmxpYyBMaXN0PE1hcFJvb20+IEV4aXRSb29tcyA9IG5ldyBMaXN0PE1hcFJvb20+KCk7Ly9jb25uZWN0ZWQgcm9vbXNcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBMaXN0PE1hcFJvb20+IFBsYWNlZFJvb21zID0gbmV3IExpc3Q8TWFwUm9vbT4oKTtcclxuICAgICAgICBwdWJsaWMgTWFwUm9vbSBwYXJlbnQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyBHYW1lIGdhbWU7XHJcbiAgICAgICAgcHVibGljIGJvb2wgSXNWYWxpZCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbWFwID0gZ2FtZS5UTTtcclxuICAgICAgICAgICAgaWYgKFNYPj0wICYmIFNZPj0wICYmIEVYPG1hcC5jb2x1bW5zICYmIEVZIDwgbWFwLnJvd3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vaW4gYm91bmRzXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIENhbkJlUGxhY2VkKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBtYXAgPSBnYW1lLlRNO1xyXG4gICAgICAgICAgICBpZiAoSXNWYWxpZCgpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWFwLklzUmVjdFNvbGlkKFNYLCBTWSwgRVgsIEVZKSkvL3Jvb20gaGFzIG5vIGludGVyc2VjdGluZyBnYXBzLlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdlbmVyYXRlQWRqYWNlbnRSb29tcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgTSA9IEdlbmVyYXRlQWRqYWNlbnRSb29tKC0xLCAwKTtcclxuICAgICAgICAgICAgaWYgKE0hPW51bGwpXHJcbiAgICAgICAgICAgICAgICBFeGl0Um9vbXMuQWRkKE0pO1xyXG4gICAgICAgICAgICBNID0gR2VuZXJhdGVBZGphY2VudFJvb20oMSwgMCk7XHJcbiAgICAgICAgICAgIGlmIChNICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBFeGl0Um9vbXMuQWRkKE0pO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5SYW5kb20oKSA8IDAuNSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgTSA9IEdlbmVyYXRlQWRqYWNlbnRSb29tKDAsIC0xKTtcclxuICAgICAgICAgICAgICAgIGlmIChNICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgRXhpdFJvb21zLkFkZChNKTtcclxuICAgICAgICAgICAgICAgIE0gPSBHZW5lcmF0ZUFkamFjZW50Um9vbSgwLCAxKTtcclxuICAgICAgICAgICAgICAgIGlmIChNICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgRXhpdFJvb21zLkFkZChNKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIE1hcFJvb20gR2VuZXJhdGVBZGphY2VudFJvb20oaW50IFhkaXIsaW50IFlkaXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvKnZhciBtaW4gPSA2O1xyXG4gICAgICAgICAgICB2YXIgbWF4ID0gMTg7Ki9cclxuICAgICAgICAgICAgdmFyIG1pbiA9IDU7XHJcbiAgICAgICAgICAgIHZhciBtYXggPSAxMztcclxuICAgICAgICAgICAgdmFyIGRpZiA9IChtYXggLSBtaW4pO1xyXG4gICAgICAgICAgICBpbnQgVyA9IChpbnQpKG1pbiArIChNYXRoLlJhbmRvbSgpICogZGlmKSk7XHJcbiAgICAgICAgICAgIGludCBIID0gKGludCkobWluICsgKE1hdGguUmFuZG9tKCkgKiBkaWYpKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBYID0gLTE7XHJcbiAgICAgICAgICAgIHZhciBZID0gLTE7XHJcbiAgICAgICAgICAgIGlmIChYZGlyICE9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFkgPSAoaW50KShTWSArIChNYXRoLlJhbmRvbSgpICogKEVZIC0gU1kpKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoWGRpciA8IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgWCA9IFNYIC0gVztcclxuICAgICAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgWCA9IEVYO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKFlkaXIgIT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWCA9IChpbnQpKFNYICsgTWF0aC5SYW5kb20oKSAqICgoRVggLSBTWCkpKTtcclxuICAgICAgICAgICAgICAgIGlmIChZZGlyIDwgMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBZID0gU1kgLSBIO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFkgPSBFWTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFggPj0gMCAmJiBZID49IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBNID0gbmV3IE1hcFJvb20oKTtcclxuICAgICAgICAgICAgICAgIE0uU1ggPSBYO1xyXG4gICAgICAgICAgICAgICAgTS5TWSA9IFk7XHJcbiAgICAgICAgICAgICAgICBNLkVYID0gWCArIFc7XHJcbiAgICAgICAgICAgICAgICBNLkVZID0gWSArIEg7XHJcbiAgICAgICAgICAgICAgICBNLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBNLmdhbWUgPSBnYW1lO1xyXG4gICAgICAgICAgICAgICAgaWYgKE0uQ2FuQmVQbGFjZWQoKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBMaXN0PE1hcFJvb20+IEZpbmRWYWxpZFVucGxhY2VkUm9vbXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIEwgPSBuZXcgTGlzdDxNYXBSb29tPigpO1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlKGkgPCBQbGFjZWRSb29tcy5Db3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIFAgPSBQbGFjZWRSb29tc1tpXTtcclxuICAgICAgICAgICAgICAgIEwuQWRkUmFuZ2UoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OkNpcm5vR2FtZS5NYXBSb29tPihQLkV4aXRSb29tcywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkNpcm5vR2FtZS5NYXBSb29tLCBib29sPikoRiA9PiBGLkNhbkJlUGxhY2VkKCkgJiYgIUYucGxhY2VkKSkpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBMO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIGNsZWFycyBvdXQgdGhlIHJvb20ncyBhcmVhLCBhbmQgYXR0ZW1wdHMgdG8gZ2VuZXJhdGUgZXhpdHJvb21zLlxyXG4gICAgICAgIC8vLyBJZiB0aGUgcm9vbSBpcyBpbnZhbGlkIGl0IGRvZXMgbm90aGluZywgYW5kIHJlbW92ZXMgaXRzZWxmIGZyb20gaXQncyBwYXJlbnQgbGlzdC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIC8vLyA8cmV0dXJucz5yZXR1cm5zIHRydWUgaWYgaXQgd2FzIHZhbGlkIGFuZCB3YXMgcGxhY2VkLjwvcmV0dXJucz5cclxuICAgICAgICBwdWJsaWMgYm9vbCBQbGFjZUFuZEV4cGFuZCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoRXhpdFJvb21zLkNvdW50IDwgMSAmJiAhcGxhY2VkICYmIENhbkJlUGxhY2VkKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBsYWNlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxhY2VkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEdlbmVyYXRlQWRqYWNlbnRSb29tcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYWNlZDtcclxuICAgICAgICAgICAgfWVsc2UgaWYgKCFwbGFjZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuQ29udGFpbnNCPGdsb2JhbDo6Q2lybm9HYW1lLk1hcFJvb20+KHBhcmVudC5FeGl0Um9vbXMsdGhpcykpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQuRXhpdFJvb21zLlJlbW92ZSh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZvaWQgUGxhY2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFRNID0gZ2FtZS5UTTtcclxuICAgICAgICAgICAgVE0uQ2xlYXJSZWN0KFNYLCBTWSwgRVggLSBTWCwgRVkgLSBTWSk7XHJcbiAgICAgICAgICAgIFRNLl9HZW5SZWN0KFNYLCBTWSwgRVgsIEVZKTtcclxuXHJcbiAgICAgICAgICAgIFBsYWNlZFJvb21zLkFkZCh0aGlzKTtcclxuICAgICAgICAgICAgcGxhY2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIEZpbmRBbnlFbXB0eVNwb3QoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKFBsYWNlZFJvb21zLkNvdW50IDwgMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgMTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSBDaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5QaWNrPGdsb2JhbDo6Q2lybm9HYW1lLk1hcFJvb20+KFBsYWNlZFJvb21zLFJORykuRmluZEVtcHR5U3BvdCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJldCE9bnVsbClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBSYW5kb20gUk5HID0gbmV3IFJhbmRvbSgpO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIEZpbmRFbXB0eVNwb3QoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFcgPSBFWCAtIFNYO1xyXG4gICAgICAgICAgICB2YXIgSCA9IEVZIC0gU1k7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgdmFyIG1hcCA9IGdhbWUuVE07XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgNTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBYID0gKGludCkoU1ggKyBNYXRoLlJhbmRvbSgpICogVyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgWSA9IChpbnQpKFNZICsgTWF0aC5SYW5kb20oKSAqIEgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIFQgPSBtYXAuR2V0VGlsZShYLFkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKFQgIT0gbnVsbCAmJiAoIVQuZW5hYmxlZCB8fCAhVC5zb2xpZCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVCA9IG1hcC5HZXRUaWxlKFgsIFktMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFQgIT0gbnVsbCAmJiAoIVQuZW5hYmxlZCB8fCAhVC5zb2xpZCkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIobWFwLnBvc2l0aW9uLlggKyAoWCAqIG1hcC50aWxlc2l6ZSksIG1hcC5wb3NpdGlvbi5ZICsgKFkgKiBtYXAudGlsZXNpemUpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qcHJpdmF0ZSBzdGF0aWMgVGlsZURhdGEgYmxhbmsgPSBuZXcgVGlsZURhdGEoKTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB2b2lkIEVyYXNlKFRpbGVNYXAgVE0sIGludCBjb2x1bW4sIGludCByb3csIGludCBzaXplKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVE0uQ2xlYXJSZWN0KGNvbHVtbiAtIChzaXplIC8gMiksIHJvdyAtIChzaXplIC8gMiksIChzaXplKSwgKHNpemUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBFcmFzZUFuZFJhbmRvKFRpbGVNYXAgVE0sIGludCBjb2x1bW4sIGludCByb3csIGludCBzaXplKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFNYID0gY29sdW1uIC0gKHNpemUgLyAyKTtcclxuICAgICAgICAgICAgdmFyIFNZID0gcm93IC0gKHNpemUgLyAyKTtcclxuICAgICAgICAgICAgVE0uQ2xlYXJSZWN0KFNYLCBTWSwgKHNpemUpLCAoc2l6ZSkpO1xyXG4gICAgICAgICAgICBUTS5fR2VuUmVjdChTWCwgU1ksIFNYICsgKHNpemUpLCBTWSArIChzaXplKSk7XHJcbiAgICAgICAgfSovXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE1hdGhIZWxwZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5MjY1MzU5ZjtcclxuICAgICAgICBwdWJsaWMgY29uc3QgZmxvYXQgUEkyID0gNi4yODMxODUzMDcxOGY7XHJcblxyXG4gICAgICAgIHB1YmxpYyBjb25zdCBmbG9hdCBQSU92ZXIyID0gMS41NzA3OTYzMjY3OTVmO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGZsb2F0IERpc3RhbmNlQmV0d2VlblBvaW50cyhWZWN0b3IyIEEsIFZlY3RvcjIgQilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBEaXN0YW5jZUJldHdlZW5Qb2ludHMoQS5YLCBBLlksIEIuWCwgQi5ZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBmbG9hdCBEaXN0YW5jZUJldHdlZW5Qb2ludHMoZmxvYXQgeDEsZmxvYXQgeTEsZmxvYXQgeDIsZmxvYXQgeTIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gKGZsb2F0KU1hdGguU3FydCgoTWF0aC5Qb3coeDEgLSB4MiwgMikgKyBNYXRoLlBvdyh5MSAtIHkyLCAyKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGZsb2F0IENsYW1wKGZsb2F0IHZhbHVlLGZsb2F0IG1pbixmbG9hdCBtYXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gKGZsb2F0KU1hdGguTWluKG1heCxNYXRoLk1heChtaW4sIHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIENsYW1wKGRvdWJsZSB2YWx1ZSwgZG91YmxlIG1pbj0wLCBkb3VibGUgbWF4PTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5NaW4obWF4LCBNYXRoLk1heChtaW4sIHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmxvYXQgTGVycChmbG9hdCB2YWx1ZTEsZmxvYXQgdmFsdWUyLGZsb2F0IGFtb3VudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTEgKyAoKHZhbHVlMiAtIHZhbHVlMSkgKiBhbW91bnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGZsb2F0IERlZ3JlZXNUb1JhZGlhbnMoZmxvYXQgZGVncmVlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWdyZWVzICogMC4wMTc0NTMyOTI1MWY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmxvYXQgUmFkaWFuc1RvRGVncmVlcyhmbG9hdCByYWRpYW5zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJhZGlhbnMgKiA1Ny4yOTU3Nzk1NDU3ZjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBmbG9hdCBHZXRBbmdsZShWZWN0b3IyIGEsIFZlY3RvcjIgYilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlID0gKGZsb2F0KShNYXRoLkF0YW4yKGIuWSAtIGEuWSwgYi5YIC0gYS5YKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhbmdsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBmbG9hdCBHZXRBbmdsZShWZWN0b3IyIGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IChmbG9hdCkoTWF0aC5BdGFuMihhLlksIGEuWCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYW5nbGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmxvYXQgUm91Z2hEaXN0YW5jZUJldHdlZW5Qb2ludHMoVmVjdG9yMiBhLCBWZWN0b3IyIGIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL3JldHVybiAoZmxvYXQpKE1hdGguQWJzKGEueCAtIGIueCkgKyBNYXRoLkFicyhhLnkgLSBiLnkpKTtcclxuICAgICAgICAgICAgcmV0dXJuIChhIC0gYikuUm91Z2hMZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmxvYXQgTWFnbml0dWRlT2ZSZWN0YW5nbGUoUmVjdGFuZ2xlIFIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gUi53aWR0aCArIFIuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGZsb2F0IFdyYXBSYWRpYW5zKGZsb2F0IHJhZGlhbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHdoaWxlIChyYWRpYW48LVBJKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByYWRpYW4gKz0gUEkyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlIChyYWRpYW4gPj0gUEkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJhZGlhbiAtPSBQSTI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJhZGlhbjtcclxuICAgICAgICAgICAgLy9yZXR1cm4gcmFkaWFuICUgUEkyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgaW5jcmVtZW50VG93YXJkcyhkb3VibGUgY3VycmVudCxkb3VibGUgZGVzdGluYXRpb24sZG91YmxlIHNwZWVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnQgPCBkZXN0aW5hdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudCArPSBzcGVlZDtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID4gZGVzdGluYXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50ID4gZGVzdGluYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQgLT0gc3BlZWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA8IGRlc3RpbmF0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIGluY3JlbWVudFRvd2FyZHMoZG91YmxlIGN1cnJlbnQsIGRvdWJsZSBkZXN0aW5hdGlvbiwgZG91YmxlIGluY3NwZWVkLCBkb3VibGUgZGVjc3BlZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudCA8IGRlc3RpbmF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50ICs9IGluY3NwZWVkO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPiBkZXN0aW5hdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gZGVzdGluYXRpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnQgPiBkZXN0aW5hdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudCAtPSBkZWNzcGVlZDtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50IDwgZGVzdGluYXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIFJhZGlhblRvVmVjdG9yKGZsb2F0IHJhZGlhbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigoZmxvYXQpTWF0aC5Db3MocmFkaWFuKSwgKGZsb2F0KU1hdGguU2luKHJhZGlhbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBMZXJwKGRvdWJsZSBEMSxkb3VibGUgRDIsZG91YmxlIGxlcnApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXJwID0gTWF0aEhlbHBlci5DbGFtcChsZXJwKTtcclxuICAgICAgICAgICAgcmV0dXJuIChEMSAqICgxIC0gbGVycCkpICsgKEQyICogbGVycCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBXaXRoaW4oZG91YmxlIHZhbCxkb3VibGUgbWluLGRvdWJsZSBtYXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsID49IG1pbiAmJiB2YWwgPD0gbWF4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBNZWFuKHBhcmFtcyBkb3VibGVbXSB2YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkb3VibGUgcmV0ID0gMDtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IHZhbC5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSB2YWxbaV07XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0IC89IHZhbC5MZW5ndGg7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIERlY2VsZXJhdGUoZG91YmxlIG1vbWVudHVtLGRvdWJsZSBkZWNlbGVyYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGlyID0gbW9tZW50dW0gPj0gMDtcclxuICAgICAgICAgICAgbW9tZW50dW0gPSAoZGlyID8gbW9tZW50dW0gOiAtbW9tZW50dW0pIC0gZGVjZWxlcmF0aW9uO1xyXG4gICAgICAgICAgICBpZiAobW9tZW50dW0gPCAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIHJldHVybiBkaXIgPyBtb21lbnR1bSA6IC1tb21lbnR1bTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUG9pbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50IFg7XHJcbiAgICAgICAgcHVibGljIGludCBZO1xyXG4gICAgICAgIHB1YmxpYyBQb2ludChpbnQgeCA9IDAsIGludCB5ID0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuWCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMuWSA9IHk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFJlY3RhbmdsZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4ID0gMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeSA9IDA7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHdpZHRoID0gMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgaGVpZ2h0ID0gMDtcclxuXHJcbiAgICAgICAgcHVibGljIGZsb2F0IGxlZnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB0b3BcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCByaWdodFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4ICsgd2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gdmFsdWUgLSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBib3R0b21cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geSArIGhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gdmFsdWUgLSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdFtdIHBvaW50c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0W10gcmV0ID0gbmV3IGZsb2F0WzhdO1xyXG4gICAgICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSB4O1xyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSB5O1xyXG5cclxuICAgICAgICAgICAgICAgIHJldFtpKytdID0gcmlnaHQ7XHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IHk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSByaWdodDtcclxuICAgICAgICAgICAgICAgIHJldFtpKytdID0gYm90dG9tO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldFtpKytdID0geDtcclxuICAgICAgICAgICAgICAgIHJldFtpKytdID0gYm90dG9tO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgQ2VudGVyXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKGxlZnQgKyAod2lkdGggLyAyKSwgdG9wICsgKGhlaWdodCAvIDIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDb3B5RnJvbShSZWN0YW5nbGUgUilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHggPSBSLng7XHJcbiAgICAgICAgICAgIHkgPSBSLnk7XHJcbiAgICAgICAgICAgIHdpZHRoID0gUi53aWR0aDtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gUi5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEdldENlbnRlcihWZWN0b3IyIE9VVClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIE9VVC5YID0gbGVmdCArICh3aWR0aCAvIDIpO1xyXG4gICAgICAgICAgICBPVVQuWSA9IHRvcCArIChoZWlnaHQgLyAyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgTWluXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHgsIHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB4ID0gdmFsdWUuWDtcclxuICAgICAgICAgICAgICAgIHkgPSB2YWx1ZS5ZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIE1heFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihyaWdodCwgYm90dG9tKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSB2YWx1ZS5YO1xyXG4gICAgICAgICAgICAgICAgYm90dG9tID0gdmFsdWUuWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBjb250YWluc1BvaW50KGZsb2F0IHgsZmxvYXQgeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh4Pj10aGlzLnggJiYgeT49dGhpcy55ICYmIHg8PXJpZ2h0ICYmIHk8PWJvdHRvbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBjb250YWluc1BvaW50KFZlY3RvcjIgcG9pbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAocG9pbnQuWCA+PSB0aGlzLnggJiYgcG9pbnQuWSA+PSB0aGlzLnkgJiYgcG9pbnQuWCA8PSByaWdodCAmJiBwb2ludC5ZIDw9IGJvdHRvbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBpbnRlcnNlY3RzKFJlY3RhbmdsZSBSKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXRbXSBwID0gUi5wb2ludHM7XHJcbiAgICAgICAgICAgIGJvb2wgY29udGFpbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBib29sIG91dHNpZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IHAuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbnNQb2ludChwW2krK10sIHBbaSsrXSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0c2lkZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW4gJiYgb3V0c2lkZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKFIubGVmdCA8IGxlZnQgJiYgUi5yaWdodCA+IHJpZ2h0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2lmICgodG9wIDw9IFIudG9wICYmIGJvdHRvbSA8PSBSLnRvcCkgfHwgKHRvcCA8PSBSLmJvdHRvbSAmJiBib3R0b20gPD0gUi5ib3R0b20pKVxyXG4gICAgICAgICAgICAgICAgaWYgKCh0b3AgPD0gUi50b3AgJiYgYm90dG9tID49IFIudG9wKSB8fCAodG9wIDw9IFIuYm90dG9tICYmIGJvdHRvbSA+PSBSLmJvdHRvbSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKFIudG9wIDwgdG9wICYmIFIuYm90dG9tID4gYm90dG9tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGxlZnQgPD0gUi5sZWZ0ICYmIHJpZ2h0ID49IFIubGVmdCkgfHwgKGxlZnQgPD0gUi5yaWdodCAmJiByaWdodCA+PSBSLnJpZ2h0KSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKmlmIChSLmxlZnQgPCBsZWZ0ICYmIFIucmlnaHQgPiByaWdodClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKCh0b3AgPD0gUi50b3AgJiYgYm90dG9tIDw9IFIudG9wKSB8fCAodG9wIDw9IFIuYm90dG9tICYmIGJvdHRvbSA8PSBSLmJvdHRvbSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKFIudG9wIDwgdG9wICYmIFIuYm90dG9tID4gYm90dG9tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGxlZnQgPD0gUi5sZWZ0ICYmIHJpZ2h0IDw9IFIubGVmdCkgfHwgKGxlZnQgPD0gUi5yaWdodCAmJiByaWdodCA8PSBSLnJpZ2h0KSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgaXNUb3VjaGluZyhSZWN0YW5nbGUgUilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChSID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmbG9hdFtdIHAgPSBSLnBvaW50cztcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IHAuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbnNQb2ludChwW2krK10sIHBbaSsrXSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGludGVyc2VjdHMoUikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qaWYgKFIubGVmdCA8IGxlZnQgJiYgUi5yaWdodCA+IHJpZ2h0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHRvcDw9Ui50b3AgJiYgYm90dG9tPD1SLnRvcCkgfHwgKHRvcCA8PSBSLmJvdHRvbSAmJiBib3R0b20gPD0gUi5ib3R0b20pKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChSLnRvcCA8IHRvcCAmJiBSLmJvdHRvbSA+IGJvdHRvbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKChsZWZ0IDw9IFIubGVmdCAmJiByaWdodCA8PSBSLmxlZnQpIHx8IChsZWZ0IDw9IFIucmlnaHQgJiYgcmlnaHQgPD0gUi5yaWdodCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBSZWN0YW5nbGUoZmxvYXQgeD0wLGZsb2F0IHk9MCxmbG9hdCB3aWR0aD0wLGZsb2F0IGhlaWdodD0wKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgU2V0KGZsb2F0IHggPSAwLCBmbG9hdCB5ID0gMCwgZmxvYXQgd2lkdGggPSAwLCBmbG9hdCBoZWlnaHQgPSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBSZWN0YW5nbGUgb3BlcmF0b3IgKyhSZWN0YW5nbGUgQSwgVmVjdG9yMiBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUoQS54K0IuWCxBLnkrQi5ZLEEud2lkdGgsQS5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFJlY3RhbmdsZSBvcGVyYXRvciAtKFJlY3RhbmdsZSBBLCBWZWN0b3IyIEIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZShBLnggLSBCLlgsIEEueSAtIEIuWSwgQS53aWR0aCwgQS5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBSZWN0YW5nbGVJXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGludCB4ID0gMDtcclxuICAgICAgICBwdWJsaWMgaW50IHkgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgd2lkdGggPSAwO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgaGVpZ2h0ID0gMDtcclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBpbnQgbGVmdFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGludCB0b3BcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgcmlnaHRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geCArIHdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aCA9IHZhbHVlIC0geDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaW50IGJvdHRvbVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB5ICsgaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSB2YWx1ZSAtIHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGludFtdIHBvaW50c1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGludFtdIHJldCA9IG5ldyBpbnRbOF07XHJcbiAgICAgICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IHg7XHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IHk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSByaWdodDtcclxuICAgICAgICAgICAgICAgIHJldFtpKytdID0geTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXRbaSsrXSA9IHJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSBib3R0b207XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSB4O1xyXG4gICAgICAgICAgICAgICAgcmV0W2krK10gPSBib3R0b207XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgUG9pbnQgQ2VudGVyXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludChsZWZ0ICsgKHdpZHRoIC8gMiksIHRvcCArIChoZWlnaHQgLyAyKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFBvaW50IE1pblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHggPSB2YWx1ZS5YO1xyXG4gICAgICAgICAgICAgICAgeSA9IHZhbHVlLlk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFBvaW50IE1heFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUG9pbnQocmlnaHQsIGJvdHRvbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHJpZ2h0ID0gdmFsdWUuWDtcclxuICAgICAgICAgICAgICAgIGJvdHRvbSA9IHZhbHVlLlk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgY29udGFpbnNQb2ludChpbnQgeCwgaW50IHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoeCA+PSB0aGlzLnggJiYgeSA+PSB0aGlzLnkgJiYgeCA8PSByaWdodCAmJiB5IDw9IGJvdHRvbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBjb250YWluc1BvaW50KFBvaW50IHBvaW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHBvaW50LlggPj0gdGhpcy54ICYmIHBvaW50LlkgPj0gdGhpcy55ICYmIHBvaW50LlggPD0gcmlnaHQgJiYgcG9pbnQuWSA8PSBib3R0b20pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgaW50ZXJzZWN0cyhSZWN0YW5nbGVJIFIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnRbXSBwID0gUi5wb2ludHM7XHJcbiAgICAgICAgICAgIGJvb2wgY29udGFpbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBib29sIG91dHNpZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IHAuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbnNQb2ludChwW2krK10sIHBbaSsrXSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0c2lkZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW4gJiYgb3V0c2lkZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKFIubGVmdCA8IGxlZnQgJiYgUi5yaWdodCA+IHJpZ2h0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL2lmICgodG9wIDw9IFIudG9wICYmIGJvdHRvbSA8PSBSLnRvcCkgfHwgKHRvcCA8PSBSLmJvdHRvbSAmJiBib3R0b20gPD0gUi5ib3R0b20pKVxyXG4gICAgICAgICAgICAgICAgaWYgKCh0b3AgPD0gUi50b3AgJiYgYm90dG9tID49IFIudG9wKSB8fCAodG9wIDw9IFIuYm90dG9tICYmIGJvdHRvbSA+PSBSLmJvdHRvbSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKFIudG9wIDwgdG9wICYmIFIuYm90dG9tID4gYm90dG9tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGxlZnQgPD0gUi5sZWZ0ICYmIHJpZ2h0ID49IFIubGVmdCkgfHwgKGxlZnQgPD0gUi5yaWdodCAmJiByaWdodCA+PSBSLnJpZ2h0KSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKmlmIChSLmxlZnQgPCBsZWZ0ICYmIFIucmlnaHQgPiByaWdodClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKCh0b3AgPD0gUi50b3AgJiYgYm90dG9tIDw9IFIudG9wKSB8fCAodG9wIDw9IFIuYm90dG9tICYmIGJvdHRvbSA8PSBSLmJvdHRvbSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKFIudG9wIDwgdG9wICYmIFIuYm90dG9tID4gYm90dG9tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGxlZnQgPD0gUi5sZWZ0ICYmIHJpZ2h0IDw9IFIubGVmdCkgfHwgKGxlZnQgPD0gUi5yaWdodCAmJiByaWdodCA8PSBSLnJpZ2h0KSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgaXNUb3VjaGluZyhSZWN0YW5nbGVJIFIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoUiA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW50W10gcCA9IFIucG9pbnRzO1xyXG4gICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgcC5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb250YWluc1BvaW50KHBbaSsrXSwgcFtpKytdKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW50ZXJzZWN0cyhSKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgUmVjdGFuZ2xlSShpbnQgeCA9IDAsIGludCB5ID0gMCwgaW50IHdpZHRoID0gMCwgaW50IGhlaWdodCA9IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFJlY3RhbmdsZUkgb3BlcmF0b3IgKyhSZWN0YW5nbGVJIEEsIFBvaW50IEIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZUkoQS54ICsgQi5YLCBBLnkgKyBCLlksIEEud2lkdGgsIEEuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBSZWN0YW5nbGVJIG9wZXJhdG9yIC0oUmVjdGFuZ2xlSSBBLCBQb2ludCBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGVJKEEueCAtIEIuWCwgQS55IC0gQi5ZLCBBLndpZHRoLCBBLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBSZW5kZXJlclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MRWxlbWVudCB2aWV3O1xyXG4gICAgICAgIHB1YmxpYyBSZW5kZXJlcihpbnQgd2lkdGg9ODAwLGludCBoZWlnaHQ9NjAwLGludCBiYWNrZ3JvdW5kQ29sb3I9IDB4MTA5OWJiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLyp2YXIgd2lkdGggPSA4MDA7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSA2MDA7XHJcbiAgICAgICAgICAgIHZhciBiYWNrZ3JvdW5kQ29sb3IgPSAweDEwOTliYjsqL1xyXG4gICAgICAgICAgICB2aWV3ID0gU2NyaXB0LldyaXRlPGR5bmFtaWM+KFwibmV3IFBJWEkuQXBwbGljYXRpb24od2lkdGgsIGhlaWdodCwge2JhY2tncm91bmRDb2xvciA6IGJhY2tncm91bmRDb2xvcn0pXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVGlsZURhdGFcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50IHRleHR1cmU7XHJcbiAgICAgICAgcHVibGljIGludCByb3c7XHJcbiAgICAgICAgcHVibGljIGludCBjb2x1bW47XHJcbiAgICAgICAgcHVibGljIGJvb2wgZW5hYmxlZDtcclxuICAgICAgICBwdWJsaWMgVGlsZU1hcCBtYXA7XHJcbiAgICAgICAgcHVibGljIGJvb2wgdmlzaWJsZTtcclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgdG9wU29saWQ7XHJcbiAgICAgICAgcHVibGljIGJvb2wgcmlnaHRTb2xpZDtcclxuICAgICAgICBwdWJsaWMgYm9vbCBsZWZ0U29saWQ7XHJcbiAgICAgICAgcHVibGljIGJvb2wgYm90dG9tU29saWQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIENhblNsb3BlO1xyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBCcmVha2FibGUgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgSFAgPSA0O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBtYXhIUCA9IDQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUgUmVjdGFuZ2xlIF9oaXRib3g7XHJcblxyXG4gICAgICAgIHB1YmxpYyBUaWxlRGF0YSBDbG9uZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICBULnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gICAgICAgICAgICBULmVuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICAgICAgICBULm1hcCA9IG1hcDtcclxuICAgICAgICAgICAgVC52aXNpYmxlID0gdmlzaWJsZTtcclxuICAgICAgICAgICAgVC50b3BTb2xpZCA9IHRvcFNvbGlkO1xyXG4gICAgICAgICAgICBULnJpZ2h0U29saWQgPSByaWdodFNvbGlkO1xyXG4gICAgICAgICAgICBULmxlZnRTb2xpZCA9IGxlZnRTb2xpZDtcclxuICAgICAgICAgICAgVC5ib3R0b21Tb2xpZCA9IGJvdHRvbVNvbGlkO1xyXG4gICAgICAgICAgICBULkNhblNsb3BlID0gQ2FuU2xvcGU7XHJcbiAgICAgICAgICAgIHJldHVybiBUO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRGFtYWdlKGZsb2F0IGRhbWFnZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhQIC09IGRhbWFnZTtcclxuICAgICAgICAgICAgaWYgKEhQPD0wICYmIHRvcFNvbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzb2xpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLyplbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGV4dHVyZSA9IDI7Ki9cclxuICAgICAgICAgICAgICAgIC8qbWFwLkZvcmNlUmVkcmF3KCk7Ki9cclxuICAgICAgICAgICAgICAgIFVwZGF0ZVRpbGUoKTtcclxuICAgICAgICAgICAgICAgIFNwYXduUGFydGljbGVzKCk7XHJcbiAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1hcC5SZWRyYXdUaWxlKGNvbHVtbiwgcm93LGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGVUaWxlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG1hcC5SZWRyYXdUaWxlKGNvbHVtbiwgcm93KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFNwYXduUGFydGljbGVzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0eCA9IChpbnQpTWF0aEhlbHBlci5DbGFtcCh0ZXh0dXJlLCAwLCBtYXAudGlsZXMuQ291bnQgLSAxKTtcclxuICAgICAgICAgICAgdmFyIFQgPSBtYXAudGlsZXNbdHhdO1xyXG5cclxuICAgICAgICAgICAgdmFyIHN6ID0gKGludCkobWFwLnRpbGVzaXplIC8gMik7XHJcbiAgICAgICAgICAgIHZhciBHID0gbWFwLmdhbWU7XHJcbiAgICAgICAgICAgIHZhciBIQiA9IEdldEhpdGJveCgpO1xyXG4gICAgICAgICAgICAvL3ZhciBzcGQgPSAxLjVmO1xyXG4gICAgICAgICAgICB2YXIgc3BkID0gMTtcclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgQyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBDLldpZHRoID0gc3o7XHJcbiAgICAgICAgICAgIEMuSGVpZ2h0ID0gc3o7XHJcbiAgICAgICAgICAgIHZhciBnID0gSGVscGVyLkdldENvbnRleHQoQyk7XHJcblxyXG4gICAgICAgICAgICBnLkRyYXdJbWFnZShULCAwLCAwLCBzeiwgc3osIDAsIDAsIHN6LCBzeik7XHJcbiAgICAgICAgICAgIHZhciBQID0gbmV3IFBhcnRpY2xlKEcsIEMuQXM8SFRNTEltYWdlRWxlbWVudD4oKSk7XHJcbiAgICAgICAgICAgIFAuSHNwZWVkID0gLXNwZDtcclxuICAgICAgICAgICAgUC5Wc3BlZWQgPSAtc3BkO1xyXG4gICAgICAgICAgICBQLnggPSBIQi5sZWZ0O1xyXG4gICAgICAgICAgICBQLnkgPSBIQi50b3A7XHJcbiAgICAgICAgICAgIEcuQWRkRW50aXR5KFApO1xyXG5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgQyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBDLldpZHRoID0gc3o7XHJcbiAgICAgICAgICAgIEMuSGVpZ2h0ID0gc3o7XHJcbiAgICAgICAgICAgIGcgPSBIZWxwZXIuR2V0Q29udGV4dChDKTtcclxuXHJcbiAgICAgICAgICAgIGcuRHJhd0ltYWdlKFQsIHN6LCAwLCBzeiwgc3osIDAsIDAsIHN6LCBzeik7XHJcbiAgICAgICAgICAgIFAgPSBuZXcgUGFydGljbGUoRywgQy5BczxIVE1MSW1hZ2VFbGVtZW50PigpKTtcclxuICAgICAgICAgICAgUC5Ic3BlZWQgPSBzcGQ7XHJcbiAgICAgICAgICAgIFAuVnNwZWVkID0gLXNwZDtcclxuICAgICAgICAgICAgUC54ID0gSEIubGVmdCtzejtcclxuICAgICAgICAgICAgUC55ID0gSEIudG9wO1xyXG4gICAgICAgICAgICBHLkFkZEVudGl0eShQKTtcclxuXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIEMgPSBuZXcgSFRNTENhbnZhc0VsZW1lbnQoKTtcclxuICAgICAgICAgICAgQy5XaWR0aCA9IHN6O1xyXG4gICAgICAgICAgICBDLkhlaWdodCA9IHN6O1xyXG4gICAgICAgICAgICBnID0gSGVscGVyLkdldENvbnRleHQoQyk7XHJcblxyXG4gICAgICAgICAgICBnLkRyYXdJbWFnZShULCAwLCBzeiwgc3osIHN6LCAwLCAwLCBzeiwgc3opO1xyXG4gICAgICAgICAgICBQID0gbmV3IFBhcnRpY2xlKEcsIEMuQXM8SFRNTEltYWdlRWxlbWVudD4oKSk7XHJcbiAgICAgICAgICAgIFAuSHNwZWVkID0gLXNwZDtcclxuICAgICAgICAgICAgUC5Wc3BlZWQgPSBzcGQ7XHJcbiAgICAgICAgICAgIFAueCA9IEhCLmxlZnQ7XHJcbiAgICAgICAgICAgIFAueSA9IEhCLnRvcCArIHN6O1xyXG4gICAgICAgICAgICBHLkFkZEVudGl0eShQKTtcclxuXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIEMgPSBuZXcgSFRNTENhbnZhc0VsZW1lbnQoKTtcclxuICAgICAgICAgICAgQy5XaWR0aCA9IHN6O1xyXG4gICAgICAgICAgICBDLkhlaWdodCA9IHN6O1xyXG4gICAgICAgICAgICBnID0gSGVscGVyLkdldENvbnRleHQoQyk7XHJcblxyXG4gICAgICAgICAgICBnLkRyYXdJbWFnZShULCBzeiwgc3osIHN6LCBzeiwgMCwgMCwgc3osIHN6KTtcclxuICAgICAgICAgICAgUCA9IG5ldyBQYXJ0aWNsZShHLCBDLkFzPEhUTUxJbWFnZUVsZW1lbnQ+KCkpO1xyXG4gICAgICAgICAgICBQLkhzcGVlZCA9IHNwZDtcclxuICAgICAgICAgICAgUC5Wc3BlZWQgPSBzcGQ7XHJcbiAgICAgICAgICAgIFAueCA9IEhCLmxlZnQgKyBzejtcclxuICAgICAgICAgICAgUC55ID0gSEIudG9wICsgc3o7XHJcbiAgICAgICAgICAgIEcuQWRkRW50aXR5KFApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgc29saWRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9wU29saWQgJiYgcmlnaHRTb2xpZCAmJiBsZWZ0U29saWQgJiYgYm90dG9tU29saWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRvcFNvbGlkID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBsZWZ0U29saWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJpZ2h0U29saWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJvdHRvbVNvbGlkID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFJlY3RhbmdsZSBHZXRIaXRib3goKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLyppZiAoX2hpdGJveCA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHN6ID0gbWFwLnRpbGVzaXplO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IG1hcC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIF9oaXRib3ggPSBuZXcgUmVjdGFuZ2xlKHBvcy5YICsgKGNvbHVtbiAqIHRzeiksIHBvcy5ZICsgKHJvdyAqIHRzeiksIHRzeiwgdHN6KTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIHZhciB0c3ogPSBtYXAudGlsZXNpemU7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBtYXAucG9zaXRpb247XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHBvcy5YICsgKGNvbHVtbiAqIHRzeiksIHBvcy5ZICsgKHJvdyAqIHRzeiksIHRzeiwgdHN6KTtcclxuICAgICAgICAgICAgLy9yZXR1cm4gX2hpdGJveDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgcGxhdGZvcm1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9wU29saWQgJiYgIXJpZ2h0U29saWQgJiYgIWxlZnRTb2xpZCAmJiAhYm90dG9tU29saWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFRpbGVEYXRhIEdldFRpbGVEYXRhKGludCByZWxhdGl2ZVgsaW50IHJlbGF0aXZlWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXAuR2V0VGlsZShjb2x1bW4gKyByZWxhdGl2ZVgsIHJvdyArIHJlbGF0aXZlWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIHNvbGlkVG9TcGVlZChWZWN0b3IyIGFuZ2xlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFlbmFibGVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoYW5nbGUuUm91Z2hMZW5ndGg9PTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzb2xpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgoYW5nbGUuWD4wICYmIGxlZnRTb2xpZCkgfHwgKGFuZ2xlLlggPCAwICYmIHJpZ2h0U29saWQpIHx8IChhbmdsZS5ZID4gMCAmJiB0b3BTb2xpZCkgfHwgKGFuZ2xlLlkgPiAwICYmIGJvdHRvbVNvbGlkKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBHZXRUb3AoVmVjdG9yMiBwb3NpdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvKlRpbGVEYXRhIExlZnQgPSBHZXRUaWxlRGF0YSgtMSwgMCk7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFJpZ2h0ID0gR2V0VGlsZURhdGEoMSwgMCk7XHJcbiAgICAgICAgICAgIGJvb2wgTHNvbGlkID0gTGVmdCAhPSBudWxsICYmIExlZnQuZW5hYmxlZCAmJiBMZWZ0LnNvbGlkO1xyXG4gICAgICAgICAgICBib29sIFJzb2xpZCA9IFJpZ2h0ICE9IG51bGwgJiYgUmlnaHQuZW5hYmxlZCAmJiBSaWdodC5zb2xpZDsqL1xyXG4gICAgICAgICAgICBpbnQgZGlyZWN0aW9uID0gU2xvcGVEaXJlY3Rpb247XHJcbiAgICAgICAgICAgIC8vaWYgKCFDYW5TbG9wZSB8fCAhc29saWQgfHwgKExzb2xpZCAmJiBSc29saWQpKVxyXG4gICAgICAgICAgICB2YXIgdHN6ID0gbWFwLnRpbGVzaXplO1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uPT0wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL3JldHVybiBSLnRvcDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IG1hcC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb3MuWSArIChyb3cgKiB0c3opO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVjdGFuZ2xlIFIgPSBHZXRIaXRib3goKTtcclxuICAgICAgICAgICAgICAgIGZsb2F0IFkgPSAoKFIucmlnaHQgLSBwb3NpdGlvbi5YKSAvIFIud2lkdGgpICogdHN6O1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbj4wKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFkgPSAodHN6IC0gWSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL1kgKj0gMS4wZjtcclxuICAgICAgICAgICAgICAgIFkgPSAoZmxvYXQpTWF0aC5NaW4odHN6LCBNYXRoLk1heCgwLCBZKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUi5ib3R0b20gLSBZO1xyXG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gKGZsb2F0KU1hdGguTWluKFIudG9wLCBNYXRoLk1heChSLmJvdHRvbSwoKFIucmlnaHQgLSBwb3NpdGlvbi5YKSAvIFIud2lkdGgpICogUi5oZWlnaHQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBJc1Nsb3BlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFNsb3BlRGlyZWN0aW9uICE9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGludCBTbG9wZURpcmVjdGlvblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICghQ2FuU2xvcGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBUaWxlRGF0YSBCb3R0b20gPSBHZXRUaWxlRGF0YSgwLCAxKTtcclxuICAgICAgICAgICAgICAgIGlmICghKEJvdHRvbSE9bnVsbCAmJiBCb3R0b20uZW5hYmxlZCAmJiBCb3R0b20uc29saWQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgTGVmdCA9IEdldFRpbGVEYXRhKC0xLCAwKTtcclxuICAgICAgICAgICAgICAgIFRpbGVEYXRhIFJpZ2h0ID0gR2V0VGlsZURhdGEoMSwgMCk7XHJcbiAgICAgICAgICAgICAgICBib29sIExzb2xpZCA9IExlZnQgIT0gbnVsbCAmJiBMZWZ0LmVuYWJsZWQgJiYgTGVmdC5zb2xpZDtcclxuICAgICAgICAgICAgICAgIGJvb2wgUnNvbGlkID0gUmlnaHQgIT0gbnVsbCAmJiBSaWdodC5lbmFibGVkICYmIFJpZ2h0LnNvbGlkO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFDYW5TbG9wZSB8fCAhc29saWQgfHwgKExzb2xpZCAmJiBSc29saWQpIHx8ICghUnNvbGlkICYmICFMc29saWQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgVG9wID0gR2V0VGlsZURhdGEoMCwgLTEpO1xyXG4gICAgICAgICAgICAgICAgYm9vbCBUc29saWQgPSBUb3AgIT0gbnVsbCAmJiBUb3AuZW5hYmxlZCAmJiBUb3Auc29saWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoVHNvbGlkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKFJzb2xpZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFRpbGVNYXBcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgdGlsZXNpemU7XHJcbiAgICAgICAgcHVibGljIGludCByb3dzO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgY29sdW1ucztcclxuICAgICAgICBwdWJsaWMgVGlsZURhdGFbLF0gZGF0YTtcclxuICAgICAgICBwdWJsaWMgTGlzdDxIVE1MSW1hZ2VFbGVtZW50PiB0aWxlcztcclxuICAgICAgICBwdWJsaWMgTGlzdDxIVE1MSW1hZ2VFbGVtZW50PiBjcmFja3M7XHJcblxyXG4gICAgICAgIHB1YmxpYyBHYW1lIGdhbWU7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBIVE1MQ2FudmFzRWxlbWVudCBidWZmZXI7XHJcbiAgICAgICAgcHJvdGVjdGVkIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBiZztcclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyByZXR1cm5zIHRydWUgaWYgdGhlIHJlY3RhbmdsZSBoYXMgbm8gZW1wdHkgc3BhY2VzLlxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic1hcIj48L3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInNZXCI+PC9wYXJhbT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJlWFwiPjwvcGFyYW0+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZVlcIj48L3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbiAgICAgICAgcHVibGljIGJvb2wgSXNSZWN0U29saWQoaW50IHNYLCBpbnQgc1ksIGludCBlWCwgaW50IGVZKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFggPSBzWDtcclxuICAgICAgICAgICAgdmFyIFkgPSBzWTtcclxuICAgICAgICAgICAgd2hpbGUgKFkgPCBlWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWCA9IHNZO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKFggPCBlWClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgVCA9IGRhdGFbWCwgWV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBYKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBZKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgUmFuZG9tIFJORDtcclxuICAgICAgICBwdWJsaWMgaW50IFNlZWQgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBGb3JjZVJlZHJhdygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZWVkUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBib29sIG5lZWRSZWRyYXc7XHJcbiAgICAgICAgcHVibGljIGJvb2wgQWxsb3dTa3lCcmlkZ2UgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgVGlsZU1hcChHYW1lIGdhbWUsaW50IFNlZWQ9LTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSTkQgPSBuZXcgUmFuZG9tKCk7XHJcbiAgICAgICAgICAgIC8vcG9zaXRpb24gPSBuZXcgVmVjdG9yMigtNTc2KTtcclxuICAgICAgICAgICAgLy8vcG9zaXRpb24gPSBuZXcgVmVjdG9yMigtMTI4KTtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgICAgICAvL3RpbGVzaXplID0gNDg7XHJcbiAgICAgICAgICAgIHRpbGVzaXplID0gMTY7XHJcbiAgICAgICAgICAgIC8vcm93cyA9IDE2O1xyXG4gICAgICAgICAgICAvKmNvbHVtbnMgPSA1MjsqL1xyXG4gICAgICAgICAgICByb3dzID0gKGludClNYXRoLkNlaWxpbmcoKCgtcG9zaXRpb24uWSAqIDIpICsgZ2FtZS5zdGFnZUJvdW5kcy5ib3R0b20pIC8gdGlsZXNpemUpO1xyXG4gICAgICAgICAgICBjb2x1bW5zID0gKGludClNYXRoLkNlaWxpbmcoKCgtcG9zaXRpb24uWCAqIDIpICsgZ2FtZS5zdGFnZUJvdW5kcy5yaWdodCkgLyB0aWxlc2l6ZSk7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgVGlsZURhdGFbY29sdW1ucywgcm93c107XHJcbiAgICAgICAgICAgIHRpbGVzID0gQW5pbWF0aW9uTG9hZGVyLkdldChcImltYWdlcy9sYW5kL2JyaWNrXCIpO1xyXG4gICAgICAgICAgICBjcmFja3MgPSBBbmltYXRpb25Mb2FkZXIuR2V0KFwiaW1hZ2VzL2xhbmQvY3JhY2tzXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICAgICAgYnVmZmVyID0gbmV3IEhUTUxDYW52YXNFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGJnID0gYnVmZmVyLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBpZiAoU2VlZCA8MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TZWVkID0gUk5ELk5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuU2VlZCA9IFNlZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9SYW5kb21pemUoKTtcclxuICAgICAgICAgICAgR2VuZXJhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgUmFuZG9taXplKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCByb3cgPSAwO1xyXG4gICAgICAgICAgICBpbnQgY29sdW1uID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKHJvdyA8IHJvd3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjb2x1bW4gPCBjb2x1bW5zKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBuZXcgVGlsZURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICBULnJvdyA9IHJvdztcclxuICAgICAgICAgICAgICAgICAgICBULmNvbHVtbiA9IGNvbHVtbjtcclxuICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVC5lbmFibGVkID0gKE1hdGguUmFuZG9tKCkgPCAwLjE1KSB8fCAocm93Pj1yb3dzLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIFQuZW5hYmxlZCA9IChSTkQuTmV4dERvdWJsZSgpIDwgMC4xNSkgfHwgKHJvdyA+PSByb3dzIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVC50b3BTb2xpZCA9IFQuZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoVC5lbmFibGVkICYmIChyb3cgPj0gcm93cyAtIDEpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVC5zb2xpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKFQuZW5hYmxlZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChSTkQuTmV4dERvdWJsZSgpIDwgMC4zKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUk5ELk5leHREb3VibGUoKSA8IDAuNSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IFQuZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtjb2x1bW4sIHJvd10gPSBUO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29sdW1uID0gMDtcclxuICAgICAgICAgICAgICAgIHJvdysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEdlbmVyYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJORCA9IG5ldyBSYW5kb20oU2VlZCk7XHJcbiAgICAgICAgICAgIC8vUmFuZG9taXplKCk7XHJcbiAgICAgICAgICAgIF9HZW4oKTtcclxuICAgICAgICAgICAgbmVlZFJlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2b2lkIF9HZW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50W10gaGVpZ2h0bWFwID0gbmV3IGludFtjb2x1bW5zXTtcclxuICAgICAgICAgICAgLy9mbG9hdCBlbnRyb3B5ID0gMC44ZjtcclxuICAgICAgICAgICAgLy9mbG9hdCBlbnRyb3B5ID0gMC40NWY7XHJcbiAgICAgICAgICAgIGZsb2F0IGVudHJvcHkgPSAwLjYwZjtcclxuICAgICAgICAgICAgaW50IG1heCA9IChpbnQpKHJvd3MgKiBlbnRyb3B5KTtcclxuICAgICAgICAgICAgLy9pbnQgc21vb3RobmVzc1NpemUgPSAxMjtcclxuICAgICAgICAgICAgaW50IHNtb290aG5lc3NTaXplID0gODtcclxuICAgICAgICAgICAgaW50IHNtb290aG5lc3NTdHJlbmd0aCA9IDI7XHJcblxyXG4gICAgICAgICAgICBpbnQgWCA9IDA7XHJcbiAgICAgICAgICAgIC8vcmFuZG9taXplcyB0aGUgaGVpZ2h0bWFwXHJcbiAgICAgICAgICAgIHdoaWxlIChYIDwgY29sdW1ucylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0bWFwW1hdID0gKGludCkoUk5ELk5leHREb3VibGUoKSAqIG1heCk7XHJcbiAgICAgICAgICAgICAgICBYICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW50IHMgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAocyA8IHNtb290aG5lc3NTdHJlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50W10gb2hlaWdodG1hcCA9IGhlaWdodG1hcDtcclxuICAgICAgICAgICAgICAgIGhlaWdodG1hcCA9IG5ldyBpbnRbY29sdW1uc107XHJcbiAgICAgICAgICAgICAgICBYID0gMDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChYIDwgY29sdW1ucylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHRtYXBbWF0gPSBibHVyKG9oZWlnaHRtYXAsIFgsIHNtb290aG5lc3NTaXplKTtcclxuICAgICAgICAgICAgICAgICAgICBYICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgWCA9IDE7XHJcbiAgICAgICAgICAgICAgICBzKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9yZW1vdmVzIGJ1bXBzIGZyb20gaGVpZ2h0bWFwXHJcbiAgICAgICAgICAgIHdoaWxlIChYIDwgY29sdW1ucy0xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgQSA9IGhlaWdodG1hcFtYIC0gMV07XHJcbiAgICAgICAgICAgICAgICBpbnQgQiA9IGhlaWdodG1hcFtYICsgMV07XHJcblxyXG4gICAgICAgICAgICAgICAgaW50IEggPSBoZWlnaHRtYXBbWF07XHJcbiAgICAgICAgICAgICAgICAvL2lmIChBID09IEIgJiYgTWF0aC5BYnMoQS0gSCk9PTEpXHJcbiAgICAgICAgICAgICAgICBpZiAoKEE+SCkgPT0gKEI+SCkgJiYgSCE9QSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHRtYXBbWF0gPSAoQSArIEIpLzI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBYICs9MTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBpbnQgcm93ID0gMDtcclxuICAgICAgICAgICAgaW50IGNvbHVtbiA9IDA7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIExUID0gbnVsbDtcclxuICAgICAgICAgICAgZmxvYXQgYnJpZGdlQ2hhbmNlID0gMC45MGY7XHJcbiAgICAgICAgICAgIGludCBSTkRicmlkZ2UgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAocm93IDwgcm93cylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbHVtbiA8IGNvbHVtbnMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IEggPSByb3dzLWhlaWdodG1hcFtjb2x1bW5dO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvb2wgZmlsbCA9IHJvdyA+PSBIO1xyXG4gICAgICAgICAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBuZXcgVGlsZURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICBULnJvdyA9IHJvdztcclxuICAgICAgICAgICAgICAgICAgICBULmNvbHVtbiA9IGNvbHVtbjtcclxuICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVC5lbmFibGVkID0gKE1hdGguUmFuZG9tKCkgPCAwLjE1KSB8fCAocm93ID49IHJvd3MgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICBULmVuYWJsZWQgPSAoZmlsbCkgfHwgKHJvdyA+PSByb3dzIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgVC50b3BTb2xpZCA9IFQuZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICBULmJvdHRvbVNvbGlkID0gVC5lbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChULmVuYWJsZWQgJiYgKHJvdyA+PSByb3dzIC0gMSkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoVC5lbmFibGVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiAoTWF0aC5SYW5kb20oKSA8IDAuMylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVC5zb2xpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSA0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVC5DYW5TbG9wZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUk5ELk5leHREb3VibGUoKSA8IDAuNSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSA1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdz5IICYmIFJORC5OZXh0RG91YmxlKCkgPCAwLjAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFULmVuYWJsZWQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKEFsbG93U2t5QnJpZGdlICYmIHJvdyA9PSAyMCAmJiBSTkQuTmV4dERvdWJsZSgpIDwgMC45MykgfHwgKHJvdys0ID49IEggJiYgcm93ICsgMiA8IEggJiYgUk5ELk5leHREb3VibGUoKSA8IDAuMDI1KSB8fCAoTFQgIT0gbnVsbCAmJiBMVC5lbmFibGVkICYmIExULnRleHR1cmUgPT0gMSAmJiBSTkQuTmV4dERvdWJsZSgpIDwgYnJpZGdlQ2hhbmNlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudG9wU29saWQgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmlkZ2VDaGFuY2UgLT0gMC4wNzVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJORGJyaWRnZSA8IDEgJiYgUk5ELk5leHREb3VibGUoKSA8IDAuMDE1KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJORGJyaWRnZSA9IFJORC5OZXh0KDgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJORGJyaWRnZSA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnRvcFNvbGlkID0gVC5lbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJORGJyaWRnZS0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vfWVsc2UgaWYgKFJORC5OZXh0RG91YmxlKCkgPCAwLjAyNSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKFJORC5OZXh0RG91YmxlKCkgPCAwLjAzNSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudG9wU29saWQgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZiAodHJ1ZSkvL2RlYnVnIGZpbGwgdGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudG9wU29saWQgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVC5DYW5TbG9wZSA9IE1hdGguUmFuZG9tKCk8MC41O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghVC5lbmFibGVkIHx8IFQudGV4dHVyZSAhPSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlQ2hhbmNlID0gMC45MGY7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IFQuZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgVC5zb2xpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtjb2x1bW4sIHJvd10gPSBUO1xyXG4gICAgICAgICAgICAgICAgICAgIExUID0gVDtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IDA7XHJcbiAgICAgICAgICAgICAgICByb3crKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBfR2VuUmVjdChpbnQgU1gsaW50IFNZLGludCBFWCxpbnQgRVkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTWCA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChTWCwgMCwgY29sdW1ucyAtIDEpO1xyXG4gICAgICAgICAgICBTWSA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChTWSwgMCwgcm93cyAtIDEpO1xyXG4gICAgICAgICAgICBFWCA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChFWCwgMCwgY29sdW1ucyAtIDEpO1xyXG4gICAgICAgICAgICBFWSA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChFWSwgMCwgcm93cyAtIDEpO1xyXG5cclxuICAgICAgICAgICAgLy9mbG9hdCBlbnRyb3B5ID0gMC44ZjtcclxuICAgICAgICAgICAgLy9mbG9hdCBlbnRyb3B5ID0gMC40NWY7XHJcbiAgICAgICAgICAgIGZsb2F0IGVudHJvcHkgPSAwLjYwZjtcclxuICAgICAgICAgICAgaW50IG1heCA9IChpbnQpKHJvd3MgKiBlbnRyb3B5KTtcclxuICAgICAgICAgICAgLy9pbnQgc21vb3RobmVzc1NpemUgPSAxMjtcclxuXHJcbiAgICAgICAgICAgIGludCBYID0gMDtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgaW50IHJvdyA9IFNZO1xyXG4gICAgICAgICAgICBpbnQgY29sdW1uID0gU1g7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIExUID0gbnVsbDtcclxuICAgICAgICAgICAgZmxvYXQgYnJpZGdlQ2hhbmNlID0gMC45MGY7XHJcbiAgICAgICAgICAgIGludCBSTkRicmlkZ2UgPSAwO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKHJvdyA8IEVZKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY29sdW1uIDwgRVgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9vbCBmaWxsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFQucm93ID0gcm93O1xyXG4gICAgICAgICAgICAgICAgICAgIFQuY29sdW1uID0gY29sdW1uO1xyXG4gICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9ULmVuYWJsZWQgPSAoTWF0aC5SYW5kb20oKSA8IDAuMTUpIHx8IChyb3cgPj0gcm93cyAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIFQuZW5hYmxlZCA9IChmaWxsKSB8fCAocm93ID49IHJvd3MgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICBULnRvcFNvbGlkID0gVC5lbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIFQuYm90dG9tU29saWQgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLyppZiAoVC5lbmFibGVkICYmIChyb3cgPj0gcm93cyAtIDEpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVC5zb2xpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKFQuZW5hYmxlZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgKE1hdGguUmFuZG9tKCkgPCAwLjMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQuc29saWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQuQ2FuU2xvcGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJORC5OZXh0RG91YmxlKCkgPCAwLjUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gNTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmYWxzZSAmJiBSTkQuTmV4dERvdWJsZSgpIDwgMC4wMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSA2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFULmVuYWJsZWQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKmlmICgoQWxsb3dTa3lCcmlkZ2UgJiYgcm93ID09IDIwICYmIFJORC5OZXh0RG91YmxlKCkgPCAwLjkzKSB8fCAoZmFsc2UgJiYgZmFsc2UgJiYgUk5ELk5leHREb3VibGUoKSA8IDAuMDI1KSB8fCAoTFQgIT0gbnVsbCAmJiBMVC5lbmFibGVkICYmIExULnRleHR1cmUgPT0gMSAmJiBSTkQuTmV4dERvdWJsZSgpIDwgYnJpZGdlQ2hhbmNlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudG9wU29saWQgPSBULmVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmlkZ2VDaGFuY2UgLT0gMC4wNzVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUk5EYnJpZGdlIDwgMSAmJiBSTkQuTmV4dERvdWJsZSgpIDwgMC4wMTUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9STkRicmlkZ2UgPSBSTkQuTmV4dCg4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSTkRicmlkZ2UgPSBSTkQuTmV4dCg2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChSTkRicmlkZ2UgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVC50b3BTb2xpZCA9IFQuZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSTkRicmlkZ2UtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL31lbHNlIGlmIChSTkQuTmV4dERvdWJsZSgpIDwgMC4wMjUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKFJORC5OZXh0RG91YmxlKCkgPCAwLjAzNSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKFJORC5OZXh0RG91YmxlKCkgPCAwLjA0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVC50b3BTb2xpZCA9IFQuZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghVC5lbmFibGVkIHx8IFQudGV4dHVyZSAhPSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlQ2hhbmNlID0gMC45MGY7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IFQuZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgVC5zb2xpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtjb2x1bW4sIHJvd10gPSBUO1xyXG4gICAgICAgICAgICAgICAgICAgIExUID0gVDtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IFNYO1xyXG4gICAgICAgICAgICAgICAgcm93Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJhd1JlY3QoaW50IGNvbHVtbixpbnQgcm93LGludCBXaWR0aCxpbnQgSGVpZ2h0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIFggPSBjb2x1bW47XHJcbiAgICAgICAgICAgIHZhciBZID0gcm93O1xyXG4gICAgICAgICAgICB2YXIgVFggPSBYO1xyXG4gICAgICAgICAgICB2YXIgVFkgPSBZO1xyXG4gICAgICAgICAgICB2YXIgRVggPSBYICsgV2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBFWSA9IFkgKyBIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoVFggPCBFWClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgVC5yb3cgPSBUWTtcclxuICAgICAgICAgICAgICAgIFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFNldFRpbGUoVFgsIFRZLCBUKTtcclxuICAgICAgICAgICAgICAgIFRYKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVFggPSBYO1xyXG4gICAgICAgICAgICBUWSA9IEVZO1xyXG4gICAgICAgICAgICB3aGlsZSAoVFggPCBFWClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgVC5yb3cgPSBUWTtcclxuICAgICAgICAgICAgICAgIFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFNldFRpbGUoVFgsIFRZLCBUKTtcclxuICAgICAgICAgICAgICAgIFRYKys7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFRYID0gWDtcclxuICAgICAgICAgICAgVFkgPSBZO1xyXG4gICAgICAgICAgICB3aGlsZSAoVFkgPCBFWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgVC5yb3cgPSBUWTtcclxuICAgICAgICAgICAgICAgIFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFNldFRpbGUoVFgsIFRZLCBUKTtcclxuICAgICAgICAgICAgICAgIFRZKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVFggPSBFWDtcclxuICAgICAgICAgICAgVFkgPSBZO1xyXG4gICAgICAgICAgICB3aGlsZSAoVFkgPCBFWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IG5ldyBUaWxlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgVC5yb3cgPSBUWTtcclxuICAgICAgICAgICAgICAgIFQuY29sdW1uID0gVFg7XHJcbiAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFQudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBULm1hcCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBULnNvbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFNldFRpbGUoVFgsIFRZLCBUKTtcclxuICAgICAgICAgICAgICAgIFRZKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJhd1JlY3QoUmVjdGFuZ2xlIHJlY3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvKnZhciBQWCA9IChpbnQpKChwb3NpdGlvbi5YIC0gVFAuWCkgLyB0aWxlc2l6ZSk7XHJcbiAgICAgICAgICAgIHZhciBQWSA9IChpbnQpKChwb3NpdGlvbi5ZIC0gVFAuWSkgLyB0aWxlc2l6ZSk7Ki9cclxuICAgICAgICAgICAgRHJhd1JlY3QoKGludCkocmVjdC5sZWZ0IC8gdGlsZXNpemUpLCAoaW50KShyZWN0LnRvcCAvIHRpbGVzaXplKSwgKGludCkocmVjdC53aWR0aCAvIHRpbGVzaXplKSwgKGludCkocmVjdC5oZWlnaHQgLyB0aWxlc2l6ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRBbGwoVGlsZURhdGEgVClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBYID0gMDtcclxuICAgICAgICAgICAgdmFyIFkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoWSA8IHJvd3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFggPSAwO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUoWCA8IGNvbHVtbnMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIFREID0gVC5DbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRELmNvbHVtbiA9IFg7XHJcbiAgICAgICAgICAgICAgICAgICAgVEQucm93ID0gWTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhW1gsIFldID0gVDtcclxuICAgICAgICAgICAgICAgICAgICBYKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBZKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ2xlYXJSZWN0KGludCBjb2x1bW4saW50IHJvdyxpbnQgd2lkdGgsaW50IGhlaWdodClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBTWCA9IChpbnQpKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHZhciBTWSA9IChpbnQpKHJvdyk7XHJcbiAgICAgICAgICAgIHZhciBFWCA9IChpbnQpKFNYK3dpZHRoKTtcclxuICAgICAgICAgICAgdmFyIEVZID0gKGludCkoU1kraGVpZ2h0KTtcclxuICAgICAgICAgICAgU1ggPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoU1gsMCwgY29sdW1ucy0xKTtcclxuICAgICAgICAgICAgU1kgPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoU1ksIDAsIHJvd3MtMSk7XHJcbiAgICAgICAgICAgIEVYID0gKGludClNYXRoSGVscGVyLkNsYW1wKEVYLCAwLCBjb2x1bW5zLTEpO1xyXG4gICAgICAgICAgICBFWSA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChFWSwgMCwgcm93cy0xKTtcclxuICAgICAgICAgICAgdmFyIFggPSBTWDtcclxuICAgICAgICAgICAgdmFyIFkgPSBTWTtcclxuICAgICAgICAgICAgdmFyIFQgPSBuZXcgVGlsZURhdGEoKTtcclxuICAgICAgICAgICAgVC5tYXAgPSB0aGlzO1xyXG4gICAgICAgICAgICBULnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgVC5zb2xpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB3aGlsZSAoWSA8IEVZKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBYID0gU1g7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoWCA8IEVYKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBUVCA9IFQuQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBUVC5jb2x1bW4gPSBYO1xyXG4gICAgICAgICAgICAgICAgICAgIFRULnJvdyA9IFk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtYLCBZXSA9IFRUO1xyXG4gICAgICAgICAgICAgICAgICAgIFgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDbGVhclJlY3QoUmVjdGFuZ2xlIHJlY3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgU1ggPSAoaW50KShyZWN0LmxlZnQgLyB0aWxlc2l6ZSk7XHJcbiAgICAgICAgICAgIHZhciBTWSA9IChpbnQpKHJlY3QudG9wIC8gdGlsZXNpemUpO1xyXG4gICAgICAgICAgICB2YXIgRVggPSAoaW50KShyZWN0LnJpZ2h0IC8gdGlsZXNpemUpO1xyXG4gICAgICAgICAgICB2YXIgRVkgPSAoaW50KShyZWN0LmhlaWdodCAvIHRpbGVzaXplKTtcclxuICAgICAgICAgICAgdmFyIFggPSBTWDtcclxuICAgICAgICAgICAgdmFyIFkgPSBTWTtcclxuICAgICAgICAgICAgdmFyIFQgPSBuZXcgVGlsZURhdGEoKTtcclxuICAgICAgICAgICAgVC5tYXAgPSB0aGlzO1xyXG4gICAgICAgICAgICBULnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgVC5zb2xpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB3aGlsZSAoWSA8IEVZKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBYID0gU1g7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoWCA8IEVYKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBUVCA9IFQuQ2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBUVC5jb2x1bW4gPSBYO1xyXG4gICAgICAgICAgICAgICAgICAgIFRULnJvdyA9IFk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtYLCBZXSA9IFRUO1xyXG4gICAgICAgICAgICAgICAgICAgIFgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRUaWxlKGludCBjb2x1bW4saW50IHJvdyxUaWxlRGF0YSBUKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGNvbHVtbj49MCAmJiByb3c+PTAgJiYgY29sdW1uPGRhdGEuR2V0TGVuZ3RoKDApICYmIHJvdzxkYXRhLkdldExlbmd0aCgxKSlcclxuICAgICAgICAgICAgICAgIGRhdGFbY29sdW1uLCByb3ddID0gVDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGludCBibHVyKGludFtdIGFycmF5LGludCBpbmRleCxpbnQgYmx1cj0xKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IHRvdGFsID0gMDtcclxuICAgICAgICAgICAgaW50IHJldCA9IDA7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgaW50IGluZCA9IGluZGV4O1xyXG4gICAgICAgICAgICBpZiAoaW5kID49IDAgJiYgaW5kIDwgYXJyYXkuTGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbCsrO1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IGFycmF5W2luZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBibHVyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbmQtLTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmQ+PTAgJiYgaW5kIDwgYXJyYXkuTGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsKys7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGFycmF5W2luZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgYmx1cilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW5kKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kID49IDAgJiYgaW5kIDwgYXJyYXkuTGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsKys7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGFycmF5W2luZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldCAvIHRvdGFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVGlsZURhdGEgQ2hlY2tGb3JUaWxlKFZlY3RvcjIgcG9zaXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvKnBvc2l0aW9uID0gcG9zaXRpb24gLSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBwb3NpdGlvbiAvPSB0aWxlc2l6ZTtcclxuICAgICAgICAgICAgaWYgKHBvc2l0aW9uLlg+PTAgJiYgcG9zaXRpb24uWDxjb2x1bW5zICYmIHBvc2l0aW9uLlk+PTAgJiYgcG9zaXRpb24uWTxyb3dzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVsoaW50KXBvc2l0aW9uLlgsIChpbnQpcG9zaXRpb24uWV07XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICB2YXIgVFAgPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICB2YXIgUFggPSAoaW50KSgocG9zaXRpb24uWCAtIFRQLlgpIC8gdGlsZXNpemUpO1xyXG4gICAgICAgICAgICB2YXIgUFkgPSAoaW50KSgocG9zaXRpb24uWSAtIFRQLlkpIC8gdGlsZXNpemUpO1xyXG4gICAgICAgICAgICBpZiAoUFggPj0gMCAmJiBQWCA8IGNvbHVtbnMgJiYgUFkgPj0gMCAmJiBQWSA8IHJvd3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhW1BYLCBQWV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBUaWxlRGF0YSBHZXRUaWxlKGludCBjb2x1bW4saW50IHJvdylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChjb2x1bW4+PTAgJiYgcm93Pj0wICYmIGNvbHVtbjxjb2x1bW5zICYmIHJvdyA8IHJvd3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhW2NvbHVtbiwgcm93XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgX0RyYXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKG5lZWRSZWRyYXcvKiAmJiAhQW5pbWF0aW9uTG9hZGVyLl90aGlzLklzTG9hZGluZyhcIlRpbGVcIikqLylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50IFcgPSAoaW50KU1hdGguQ2VpbGluZyhjb2x1bW5zICogdGlsZXNpemUpO1xyXG4gICAgICAgICAgICAgICAgaW50IEggPSAoaW50KU1hdGguQ2VpbGluZyhyb3dzICogdGlsZXNpemUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChidWZmZXIuV2lkdGggIT0gVyB8fCBidWZmZXIuSGVpZ2h0ICE9IEgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLldpZHRoID0gVztcclxuICAgICAgICAgICAgICAgICAgICBidWZmZXIuSGVpZ2h0ID0gSDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBiZy5DbGVhclJlY3QoMCwgMCwgYnVmZmVyLldpZHRoLCBidWZmZXIuSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBSZWRyYXcoYmcpO1xyXG4gICAgICAgICAgICAgICAgbmVlZFJlZHJhdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgUmVjdGFuZ2xlIHJ0bXAgPSBuZXcgUmVjdGFuZ2xlKCk7XHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9EcmF3KCk7XHJcbiAgICAgICAgICAgIC8vZy5EcmF3SW1hZ2UoYnVmZmVyLCBwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZKTtcclxuICAgICAgICAgICAgcnRtcC5Db3B5RnJvbShnYW1lLmNhbWVyYS5DYW1lcmFCb3VuZHMpO1xyXG4gICAgICAgICAgICAvL2hpZGUgZmxvYXRpbmcgcG9pbnQgc2VhbXMuXHJcbiAgICAgICAgICAgIHJ0bXAueCAtPSAxO1xyXG4gICAgICAgICAgICBydG1wLnkgLT0gMTtcclxuICAgICAgICAgICAgcnRtcC53aWR0aCArPSAyO1xyXG4gICAgICAgICAgICBydG1wLmhlaWdodCArPSAyO1xyXG4gICAgICAgICAgICB2YXIgQ0IgPSBydG1wO1xyXG4gICAgICAgICAgICAvL3ZhciBDQiA9IGdhbWUuY2FtZXJhLkNhbWVyYUJvdW5kcztcclxuICAgICAgICAgICAgLy9nLkRyYXdJbWFnZShidWZmZXIsIENCLmxlZnQtcG9zaXRpb24uWCwgQ0IudG9wLXBvc2l0aW9uLlksIENCLndpZHRoLCBDQi5oZWlnaHQsIENCLmxlZnQsIENCLnRvcCwgQ0Iud2lkdGgsIENCLmhlaWdodCk7Ly9kcmF3IG1hcCBjcm9wcGVkIHRvIGNhbWVyYSBib3VuZHNcclxuICAgICAgICAgICAgZy5EcmF3SW1hZ2UoYnVmZmVyLCBDQi5sZWZ0IC0gcG9zaXRpb24uWCwgQ0IudG9wIC0gcG9zaXRpb24uWSwgQ0Iud2lkdGgsIENCLmhlaWdodCwgQ0IubGVmdCwgQ0IudG9wLCBDQi53aWR0aCwgQ0IuaGVpZ2h0KTsvL2RyYXcgbWFwIGNyb3BwZWQgdG8gY2FtZXJhIGJvdW5kc1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZWRyYXdUaWxlKGludCBYLCBpbnQgWSwgYm9vbCB1cGRhdGVOZWlnaGJvcnMgPSB0cnVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHVwZGF0ZU5laWdoYm9ycylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50IFRYID0gKFggLSAxKSAqIChpbnQpdGlsZXNpemU7XHJcbiAgICAgICAgICAgICAgICBpbnQgVFkgPSAoWSAtIDEpICogKGludCl0aWxlc2l6ZTtcclxuICAgICAgICAgICAgICAgIGJnLkNsZWFyUmVjdChUWCwgVFksIChpbnQpdGlsZXNpemUgKiAzLCAoaW50KXRpbGVzaXplICogMyk7XHJcblxyXG4gICAgICAgICAgICAgICAgUmVkcmF3KGJnLCBYIC0gMSwgWSAtIDEsIDMsIDMpO1xyXG4gICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgVFggPSAoWCkgKiAoaW50KXRpbGVzaXplO1xyXG4gICAgICAgICAgICAgICAgaW50IFRZID0gKFkpICogKGludCl0aWxlc2l6ZTtcclxuICAgICAgICAgICAgICAgIGJnLkNsZWFyUmVjdChUWCwgVFksIChpbnQpdGlsZXNpemUsIChpbnQpdGlsZXNpemUpO1xyXG5cclxuICAgICAgICAgICAgICAgIFJlZHJhdyhiZywgWCwgWSwgMSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCB2b2lkIFJlZHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZyxpbnQgU1g9LTEsIGludCBTWSA9IC0xLGludCBXPS0xLGludCBIPS0xKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgUFggPSBwb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBQWSA9IHBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIFBYID0gMDtcclxuICAgICAgICAgICAgUFkgPSAwO1xyXG4gICAgICAgICAgICBpZiAoU1ggPT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNYID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoU1kgPT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNZID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKFcgPT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFcgPSBjb2x1bW5zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChIID09IC0xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIID0gcm93cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgRVggPSBTWCArIFc7XHJcbiAgICAgICAgICAgIHZhciBFWSA9IFNZICsgSDtcclxuICAgICAgICAgICAgU1ggPSAoaW50KU1hdGhIZWxwZXIuQ2xhbXAoU1gsIDAsIGNvbHVtbnMpO1xyXG4gICAgICAgICAgICBTWSA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChTWSwgMCwgcm93cyk7XHJcblxyXG4gICAgICAgICAgICBFWCA9IChpbnQpTWF0aEhlbHBlci5DbGFtcChFWCwgMCwgY29sdW1ucyk7XHJcbiAgICAgICAgICAgIEVZID0gKGludClNYXRoSGVscGVyLkNsYW1wKEVZLCAwLCByb3dzKTtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IFggPSBQWCArIChTWCAqIHRpbGVzaXplKTtcclxuICAgICAgICAgICAgZmxvYXQgWSA9IFBZICsgKFNZICogdGlsZXNpemUpO1xyXG4gICAgICAgICAgICBpbnQgcm93ID0gU1k7XHJcbiAgICAgICAgICAgIGludCBjb2x1bW4gPSBTWDtcclxuICAgICAgICAgICAgdmFyIEJHID0gdGlsZXNbMl07XHJcbiAgICAgICAgICAgIHZhciBCRzIgPSB0aWxlc1szXTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChyb3cgPCBFWSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbHVtbiA8IEVYKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgKFIuaXNUb3VjaGluZyhuZXcgUmVjdGFuZ2xlKFgsIFksIHRpbGVzaXplLCB0aWxlc2l6ZSkpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVGlsZURhdGEgVCA9IGRhdGFbY29sdW1uLCByb3ddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4ID0gTWF0aC5NaW4odGlsZXMuQ291bnQtMSwgVC50ZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFQuZW5hYmxlZCAmJiB0ZXggPj0gMCAmJiB0ZXggPCB0aWxlcy5Db3VudClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5EcmF3SW1hZ2UodGlsZXNbdGV4XSwgWCwgWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVC5CcmVha2FibGUgJiYgVC5IUCA8IFQubWF4SFApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50IGRtZyA9IChpbnQpTWF0aC5NYXgoMSxNYXRoLk1pbihNYXRoLlJvdW5kKFQubWF4SFAgLSBULkhQKSwzKSktMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkRyYXdJbWFnZShjcmFja3NbZG1nXSwgWCwgWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnQgc2QgPSBULlNsb3BlRGlyZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNkICE9IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vYmplY3Qgc2cgPSBnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2NyaXB0LldyaXRlKFwic2cuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW91dCdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5HbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBDYW52YXNUeXBlcy5DYW52YXNDb21wb3NpdGVPcGVyYXRpb25UeXBlLkRlc3RpbmF0aW9uT3V0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlY3RhbmdsZSBSID0gVC5HZXRIaXRib3goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSLnggLT0gcG9zaXRpb24uWDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSLnkgLT0gcG9zaXRpb24uWTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuTW92ZVRvKFIubGVmdCwgUi50b3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlY3RvcjIgUDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQID0gbmV3IFZlY3RvcjIoUi5sZWZ0ICsgKFIud2lkdGggLyAyZiksIFIudG9wICsgKFIuaGVpZ2h0IC8gMmYpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2QgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5MaW5lVG8oUi5sZWZ0LCBSLmJvdHRvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuTGluZVRvKFIucmlnaHQsIFIuYm90dG9tKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5MaW5lVG8oUi5yaWdodCwgUi50b3ApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkxpbmVUbyhSLmxlZnQsIFIudG9wKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5GaWxsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuR2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gQ2FudmFzVHlwZXMuQ2FudmFzQ29tcG9zaXRlT3BlcmF0aW9uVHlwZS5EZXN0aW5hdGlvbk92ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5EcmF3SW1hZ2UoQkcsIFgsIFkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuR2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gQ2FudmFzVHlwZXMuQ2FudmFzQ29tcG9zaXRlT3BlcmF0aW9uVHlwZS5Tb3VyY2VPdmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLkRyYXdJbWFnZShNYXRoLlJhbmRvbSgpPDAuOTggPyBCRyA6IEJHMiwgWCwgWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uKys7XHJcbiAgICAgICAgICAgICAgICAgICAgWCArPSB0aWxlc2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFggPSBQWCArIChTWCAqIHRpbGVzaXplKTtcclxuICAgICAgICAgICAgICAgIFkgKz0gdGlsZXNpemU7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW4gPSBTWDtcclxuICAgICAgICAgICAgICAgIHJvdysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIElzRXhwb3NlZChpbnQgWCxpbnQgWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCByb3cgPSBZIC0gMjtcclxuICAgICAgICAgICAgaW50IGNvbHVtbiA9IFggLSAyO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKHJvdyA8PSBZKzIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjb2x1bW4gPD0gWCsyKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qdmFyIFQgPSBkYXRhW2NvbHVtbiwgcm93XTtcclxuICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSBNYXRoLlJhbmRvbSgpIDwgMC41ID8gMCA6IDE7Ki9cclxuICAgICAgICAgICAgICAgICAgICBpZiAocm93Pj0wICYmIGNvbHVtbj49MCAmJiByb3c8cm93cyAmJiBjb2x1bW4gPCBjb2x1bW5zKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFQgPSBkYXRhW2NvbHVtbiwgcm93XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFULmVuYWJsZWQgfHwgIVQuc29saWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcm93Kys7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW4gPSBYLTI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBBcHBseUJyZWFrYWJsZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgcm93ID0gMDtcclxuICAgICAgICAgICAgaW50IGNvbHVtbiA9IDA7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAocm93IDwgcm93cylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbHVtbiA8IGNvbHVtbnMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyp2YXIgVCA9IGRhdGFbY29sdW1uLCByb3ddO1xyXG4gICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IE1hdGguUmFuZG9tKCkgPCAwLjUgPyAwIDogMTsqL1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBUID0gZGF0YVtjb2x1bW4sIHJvd107XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIFRUID0gVC5DbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFRULmNvbHVtbiA9IGNvbHVtbjtcclxuICAgICAgICAgICAgICAgICAgICBUVC5yb3cgPSByb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtjb2x1bW4sIHJvd10gPSBUVDtcclxuICAgICAgICAgICAgICAgICAgICBUID0gVFQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKElzRXhwb3NlZChjb2x1bW4sIHJvdykpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5SYW5kb20oKSA8IDAuMDIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IE1hdGguUmFuZG9tKCkgPCAwLjUgPyA1IDogNjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBULkJyZWFrYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQuQnJlYWthYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qaWYgKCFULmVuYWJsZWQgfHwgIVQudmlzaWJsZSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFQuc29saWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVC50ZXh0dXJlID0gMjtcclxuICAgICAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJvdysrO1xyXG4gICAgICAgICAgICAgICAgY29sdW1uID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZWVkUmVkcmF3ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgdGVzdFRleHR1cmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IHJvdyA9IDA7XHJcbiAgICAgICAgICAgIGludCBjb2x1bW4gPSAwO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKHJvdyA8IHJvd3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjb2x1bW4gPCBjb2x1bW5zKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBUID0gZGF0YVtjb2x1bW4scm93XTtcclxuICAgICAgICAgICAgICAgICAgICBULnRleHR1cmUgPSBNYXRoLlJhbmRvbSgpIDwgMC41ID8gMCA6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByb3crKztcclxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmVlZFJlZHJhdyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgTGVuZ3RoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChmbG9hdClNYXRoLlNxcnQoKFggKiBYKSArIChZICogWSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBEaXN0YW5jZShWZWN0b3IyIFApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgWFggPSBYIC0gUC5YO1xyXG4gICAgICAgICAgICB2YXIgWVkgPSBZIC0gUC5ZO1xyXG4gICAgICAgICAgICByZXR1cm4gKGZsb2F0KU1hdGguU3FydCgoWFggKiBYWCkgKyAoWVkgKiBZWSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFJldHVybnMgYSByb3VnaCBlc3RpbWF0ZSBvZiB0aGUgdmVjdG9yJ3MgbGVuZ3RoLlxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHVibGljIGZsb2F0IEVzdGltYXRlZExlbmd0aFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBBID0gTWF0aC5BYnMoWCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgQiA9IE1hdGguQWJzKFkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEI+QSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG1wID0gQTtcclxuICAgICAgICAgICAgICAgICAgICBBID0gQjtcclxuICAgICAgICAgICAgICAgICAgICBCID0gdG1wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQiAqPSAwLjM0O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChmbG9hdCkoQSArIEIpO1xyXG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gKGZsb2F0KShNYXRoLkFicyhYKSArIE1hdGguQWJzKFkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFJldHVybnMgYSByb3VnaCBlc3RpbWF0ZSBvZiB0aGUgdmVjdG9yJ3MgbGVuZ3RoLlxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHVibGljIGZsb2F0IEVzdGltYXRlZERpc3RhbmNlKFZlY3RvcjIgUClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgQSA9IE1hdGguQWJzKFgtUC5YKTtcclxuICAgICAgICAgICAgICAgIHZhciBCID0gTWF0aC5BYnMoWS1QLlkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEIgPiBBKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0bXAgPSBBO1xyXG4gICAgICAgICAgICAgICAgICAgIEEgPSBCO1xyXG4gICAgICAgICAgICAgICAgICAgIEIgPSB0bXA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBCICo9IDAuMzQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGZsb2F0KShBICsgQik7XHJcbiAgICAgICAgICAgICAgICAvL3JldHVybiAoZmxvYXQpKE1hdGguQWJzKFgpICsgTWF0aC5BYnMoWSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFJldHVybnMgdGhlIHN1bSBvZiBpdHMgYWJzb2x1dGUgcGFydHMuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgUm91Z2hMZW5ndGhcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGZsb2F0KShNYXRoLkFicyhYKSArIE1hdGguQWJzKFkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMihmbG9hdCB4PTAsZmxvYXQgeT0wKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5YID0geDtcclxuICAgICAgICAgICAgdGhpcy5ZID0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgTXVsdGlwbHkoZmxvYXQgZilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFggKj0gZjtcclxuICAgICAgICAgICAgWSAqPSBmO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBSb3VnaE5vcm1hbGl6ZShmbG9hdCBsZW5ndGg9MSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0IEQgPSBMZW5ndGggLyBsZW5ndGg7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihYIC8gRCwgWSAvIEQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBOb3JtYWxpemUoZmxvYXQgbGVuZ3RoID0gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0IGRpc3RhbmNlID0gTWF0aC5TcXJ0KFggKiBYICsgWSAqIFkpLkFzPGZsb2F0PigpO1xyXG4gICAgICAgICAgICBWZWN0b3IyIFYgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgICAgICBWLlggPSBYIC8gZGlzdGFuY2U7XHJcbiAgICAgICAgICAgIFYuWSA9IFkgLyBkaXN0YW5jZTtcclxuICAgICAgICAgICAgVi5YICo9IGxlbmd0aDtcclxuICAgICAgICAgICAgVi5ZICo9IGxlbmd0aDtcclxuICAgICAgICAgICAgcmV0dXJuIFY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNldEFzTm9ybWFsaXplKGZsb2F0IGxlbmd0aCA9IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCBkaXN0YW5jZSA9IE1hdGguU3FydChYICogWCArIFkgKiBZKS5BczxmbG9hdD4oKTtcclxuICAgICAgICAgICAgWCA9IFggLyBkaXN0YW5jZTtcclxuICAgICAgICAgICAgWSA9IFkgLyBkaXN0YW5jZTtcclxuICAgICAgICAgICAgWCAqPSBsZW5ndGg7XHJcbiAgICAgICAgICAgIFkgKj0gbGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBUb0NhcmRpbmFsKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gWDtcclxuICAgICAgICAgICAgdmFyIHkgPSBZO1xyXG4gICAgICAgICAgICB2YXIgQSA9IE1hdGguQWJzKFgpO1xyXG4gICAgICAgICAgICB2YXIgQiA9IE1hdGguQWJzKFkpO1xyXG4gICAgICAgICAgICBpZiAoQiA+IEEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKEEgPiBCKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoeCwgeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIEVxdWFscyhWZWN0b3IyIG8pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBWZWN0b3IyIEIgPSAoVmVjdG9yMilvO1xyXG4gICAgICAgICAgICBpZiAodGhpcyAhPSBCICYmIEIgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCLlggPT0gWCAmJiBCLlkgPT0gWTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGJvb2wgRXF1YWxzKG9iamVjdCBvKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKG8gaXMgVmVjdG9yMilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVmVjdG9yMiBCID0gKFZlY3RvcjIpbztcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzICE9IEIgJiYgQiA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBCLlggPT0gWCAmJiBCLlkgPT0gWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmFzZS5FcXVhbHMobyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBvcGVyYXRvciA9PShWZWN0b3IyIEEsVmVjdG9yMiBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgb2JqZWN0IE9BID0gQTtcclxuICAgICAgICAgICAgb2JqZWN0IE9CID0gQjtcclxuICAgICAgICAgICAgaWYgKChPQSA9PSBudWxsIHx8IE9CID09IG51bGwpICYmIChPQSE9bnVsbCB8fCBPQiE9bnVsbCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoT0EgPT0gbnVsbCAmJiBPQiA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQS5YID09IEIuWCAmJiBBLlkgPT0gQi5ZO1xyXG4gICAgICAgICAgICAvL3JldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKCgoT2JqZWN0KUEpICE9ICgoT2JqZWN0KUIpICYmIChBPT1udWxsIHx8IEI9PW51bGwpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChBLlggPT0gQi5YICYmIEEuWSA9PSBCLlkpO1xyXG4gICAgICAgICAgICByZXR1cm4gKCgoT2JqZWN0KUEpICE9ICgoT2JqZWN0KUIpKSB8fCAoQS5YID09IEIuWCAmJiBBLlkgPT0gQi5ZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIG9wZXJhdG9yICE9KFZlY3RvcjIgQSwgVmVjdG9yMiBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuICEoQSA9PSBCKTtcclxuICAgICAgICAgICAgaWYgKCgoT2JqZWN0KUEpICE9ICgoT2JqZWN0KUIpICYmIChBID09IG51bGwgfHwgQiA9PSBudWxsKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICEoQS5YID09IEIuWCAmJiBBLlkgPT0gQi5ZKTtcclxuICAgICAgICAgICAgcmV0dXJuICEoKCgoT2JqZWN0KUEpICE9ICgoT2JqZWN0KUIpKSB8fCAoQS5YID09IEIuWCAmJiBBLlkgPT0gQi5ZKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVmVjdG9yMiBvcGVyYXRvciAqKFZlY3RvcjIgQSwgZmxvYXQgc2NhbGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoQS5YICogc2NhbGUsQS5ZICogc2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFZlY3RvcjIgb3BlcmF0b3IgLyhWZWN0b3IyIEEsIGZsb2F0IHNjYWxlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKEEuWCAvIHNjYWxlLCBBLlkgLyBzY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVmVjdG9yMiBvcGVyYXRvciArKFZlY3RvcjIgQSwgVmVjdG9yMiBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKEEuWCArIEIuWCwgQS5ZICsgQi5ZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIG9wZXJhdG9yIC0oVmVjdG9yMiBBLCBWZWN0b3IyIEIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoQS5YIC0gQi5YLCBBLlkgLSBCLlkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFZlY3RvcjIgRW1wdHlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgVG9BbmdsZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aEhlbHBlci5XcmFwUmFkaWFucyhNYXRoSGVscGVyLkdldEFuZ2xlKHRoaXMpKTtcclxuICAgICAgICAgICAgLy9yZXR1cm4gTWF0aEhlbHBlci5XcmFwUmFkaWFucyhNYXRoSGVscGVyLkdldEFuZ2xlKG5ldyBWZWN0b3IyKCksIHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIEZyb21SYWRpYW4oZmxvYXQgcmFkaWFuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGhIZWxwZXIuUmFkaWFuVG9WZWN0b3IocmFkaWFuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgQ2xvbmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKFgsIFkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDb3B5RnJvbShWZWN0b3IyIFYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoViA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBYID0gVi5YO1xyXG4gICAgICAgICAgICBZID0gVi5ZO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBSb3RhdGUoZmxvYXQgcmFkaWFuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGUgPSBUb0FuZ2xlKCkgKyByYWRpYW47XHJcbiAgICAgICAgICAgIHJldHVybiBGcm9tUmFkaWFuKGFuZ2xlKS5Ob3JtYWxpemUoTGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIEFkZChWZWN0b3IyIEEsVmVjdG9yMiBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKEEuWCArIEIuWCwgQS5ZICsgQi5ZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIEFkZChWZWN0b3IyIEEsIGZsb2F0IFgsZmxvYXQgWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihBLlggKyBYLCBBLlkgKyBZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIFN1YnRyYWN0KFZlY3RvcjIgQSwgVmVjdG9yMiBCKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKEEuWCAtIEIuWCwgQS5ZIC0gQi5ZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBWZWN0b3IyIFN1YnRyYWN0KFZlY3RvcjIgQSwgZmxvYXQgWCwgZmxvYXQgWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihBLlggLSBYLCBBLlkgLSBZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKFZlY3RvcjIgVilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFggKz0gVi5YO1xyXG4gICAgICAgICAgICBZICs9IFYuWTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgU3VidHJhY3QoVmVjdG9yMiBWKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgWCAtPSBWLlg7XHJcbiAgICAgICAgICAgIFkgLT0gVi5ZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBaW1lZFNob290ZXIgOiBFbnRpdHlCZWhhdmlvclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgaW50IHRpbWUgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgbWF4dGltZSA9IDYwICogODtcclxuICAgICAgICBwdWJsaWMgRW50aXR5IFRhcmdldDtcclxuICAgICAgICAvL3B1YmxpYyBmbG9hdCBtYXhEaXN0YW5jZSA9IDEyMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgbWF4RGlzdGFuY2UgPSAxMzA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBhdHRhY2twb3dlciA9IDE7XHJcbiAgICAgICAgcHVibGljIEFpbWVkU2hvb3RlcihFbnRpdHkgZW50aXR5KSA6IGJhc2UoZW50aXR5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLyplbnRpdHkuQW5pLkh1ZUNvbG9yID0gXCIjRkYwMDAwXCI7XHJcbiAgICAgICAgICAgIGVudGl0eS5BbmkuSHVlUmVjb2xvclN0cmVuZ3RoID0gMi4wZjsqL1xyXG4gICAgICAgICAgICBlbnRpdHkuQW5pLlNoYWRvd2NvbG9yID0gXCIjRkYwMDAwXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBVcGRhdGVUYXJnZXQoKTtcclxuICAgICAgICAgICAgdmFyIEEgPSBlbnRpdHkuQW5pO1xyXG5cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBpZiAoVGFyZ2V0ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aW1lIDwgNjApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9pZiAoKHRpbWUgJiA0KSA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0EuU2hhZG93ID0gNi0odGltZSAqIDAuMWYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBLlNoYWRvdyA9IDU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEEuU2hhZG93ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQS5TaGFkb3cgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGltZS0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRpbWUgPD0gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBSZXNldFRpbWVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgU2hvb3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQS5TaGFkb3cgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qQS5TaGFkb3djb2xvciA9IEEuSHVlQ29sb3I7XHJcbiAgICAgICAgICAgIEEuU2hhZG93ID0gQS5TaGFkb3djb2xvciAhPSBcIlwiID8gMCA6IDM7XHJcbiAgICAgICAgICAgIEEuSHVlQ29sb3IgPSBcIiNGRjAwMDBcIjtcclxuICAgICAgICAgICAgQS5IdWVSZWNvbG9yU3RyZW5ndGggPSAyLjBmOyovXHJcbiAgICAgICAgICAgIC8vQS5VcGRhdGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBVcGRhdGVUYXJnZXQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKFRhcmdldCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVGFyZ2V0LlBvc2l0aW9uLkVzdGltYXRlZERpc3RhbmNlKGVudGl0eS5Qb3NpdGlvbikgPiBtYXhEaXN0YW5jZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUYXJnZXQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIFQgPSBlbnRpdHkuR2FtZS5wbGF5ZXI7XHJcbiAgICAgICAgICAgIGlmIChULlBvc2l0aW9uLkVzdGltYXRlZERpc3RhbmNlKGVudGl0eS5Qb3NpdGlvbik8bWF4RGlzdGFuY2Upe1xyXG4gICAgICAgICAgICAgICAgVGFyZ2V0ID0gVDtcclxuICAgICAgICAgICAgICAgIFJlc2V0VGltZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZvaWQgUmVzZXRUaW1lcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aW1lID0gKG1heHRpbWUvMik7XHJcbiAgICAgICAgICAgIHRpbWUgKz0gKGludClNYXRoLlJvdW5kKHRpbWUgKiBNYXRoLlJhbmRvbSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFNob290KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChUYXJnZXQgPT0gbnVsbCB8fCAoKElDb21iYXRhbnQpVGFyZ2V0KS5IUDw9MClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIFAgPSBuZXcgUGxheWVyQnVsbGV0KGVudGl0eS5HYW1lLCBlbnRpdHksIFwiaW1hZ2VzL21pc2MvZWJ1bGxldFwiKTtcclxuICAgICAgICAgICAgUC5Qb3NpdGlvbi5Db3B5RnJvbShlbnRpdHkuZ2V0Q2VudGVyKCkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIEQgPSAoVGFyZ2V0LmdldENlbnRlcigpIC0gUC5Qb3NpdGlvbik7XHJcbiAgICAgICAgICAgIEQuU2V0QXNOb3JtYWxpemUoMC41Zik7XHJcbiAgICAgICAgICAgIFAuSHNwZWVkID0gRC5YO1xyXG4gICAgICAgICAgICBQLlZzcGVlZCA9IEQuWTtcclxuICAgICAgICAgICAgUC50b3VjaERhbWFnZSA9IGF0dGFja3Bvd2VyO1xyXG4gICAgICAgICAgICBlbnRpdHkuR2FtZS5BZGRFbnRpdHkoUCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEJvdW5kc1Jlc3RyaWN0b3IgOiBFbnRpdHlCZWhhdmlvclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBSZWN0YW5nbGUgYm91bmRzO1xyXG4gICAgICAgIHB1YmxpYyBib29sIGJvdHRvbSA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBCb3VuZHNSZXN0cmljdG9yKEVudGl0eSBlbnRpdHkpIDogYmFzZShlbnRpdHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgdmFyIEIgPSBib3VuZHM7XHJcbiAgICAgICAgICAgIGlmIChCID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEIgPSBlbnRpdHkuR2FtZS5zdGFnZUJvdW5kcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgUCA9IGVudGl0eS5Qb3NpdGlvbjtcclxuICAgICAgICAgICAgUC5YID0gTWF0aEhlbHBlci5DbGFtcChQLlgsIEIubGVmdCwgQi5yaWdodCk7XHJcbiAgICAgICAgICAgIGlmIChib3R0b20pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFAuWSA9IE1hdGhIZWxwZXIuQ2xhbXAoUC5ZLCBCLnRvcCwgQi5ib3R0b20pO1xyXG4gICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBQLlkgPSBNYXRoLk1heChQLlksIEIudG9wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDaGVzdCA6IEVudGl0eVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBDaGVzdChHYW1lIGdhbWUpIDogYmFzZShnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQW5pID0gbmV3IEFuaW1hdGlvbihBbmltYXRpb25Mb2FkZXIuX3RoaXMuR2V0QW5pbWF0aW9uKFwiaW1hZ2VzL21pc2MvY2hlc3RcIikpO1xyXG4gICAgICAgICAgICBBbmkuSW1hZ2VTcGVlZCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIE9wZW5lZCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgdmFyIEYgPSBHZXRGbG9vcigpO1xyXG4gICAgICAgICAgICBpZiAoRiA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBWc3BlZWQgPSAxO1xyXG4gICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBWc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgeSA9IEYuR2V0SGl0Ym94KCkudG9wIC0gQW5pLkN1cnJlbnRJbWFnZS5IZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIFAgPSAoUGxheWVyQ2hhcmFjdGVyKUdhbWUucGxheWVyO1xyXG4gICAgICAgICAgICBpZiAoIU9wZW5lZCAmJiBQLlBvc2l0aW9uLkVzdGltYXRlZERpc3RhbmNlKFBvc2l0aW9uKSA8IDE2ICYmIFAuQ29udHJvbGxlclsyXSAmJiBQLmtleXM+MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUC5rZXlzLS07XHJcbiAgICAgICAgICAgICAgICBPcGVuKFApO1xyXG4gICAgICAgICAgICAgICAgLypBbmkuQ3VycmVudEZyYW1lID0gMTtcclxuICAgICAgICAgICAgICAgIEFuaS5TZXRJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgQW5pLlVwZGF0ZSgpOyovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIE9wZW4oUGxheWVyQ2hhcmFjdGVyIHBsYXllcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghT3BlbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBbmkuQ3VycmVudEZyYW1lID0gMTtcclxuICAgICAgICAgICAgICAgIEFuaS5TZXRJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgQW5pLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgT3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIC8vVE9ETzpnaXZlIHBsYXllciBhIHBlcm1hbmVudCB1cGdyYWRlLCBhbmQgZGlzcGxheSB0ZXh0IGFib3ZlIHRoZSBjaGVzdCB0ZWxsaW5nIHRoZSBwbGF5ZXIgd2hhdCB0aGV5IGp1c3QgZ290XHJcbiAgICAgICAgICAgICAgICB2YXIgTSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIFMgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gXCIjRkZGRkZGXCI7XHJcbiAgICAgICAgICAgICAgICBzdHJpbmdbXSBwaWNrZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG9rKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21tb24gPSBuZXcgc3RyaW5nW10geyBcInBvaW50XCIsIFwicG9pbnRcIiwgXCJwb2ludFwiLCBcInBvaW50XCIsIFwicG9pbnRcIiwgXCJwb2ludFwiLCBcImhlYXJ0XCIsIFwiaGVhcnRcIiwgXCJ0cmlwbGVoZWFydFwiLCBcImRvdWJsZW9yYlwiIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJhcmUgPSBuZXcgc3RyaW5nW10geyBcImF0dGFja3Bvd2VyXCIsXCJkZWZlbnNlcG93ZXJcIixcIm1pbmluZ1wiIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlZ2VuZGFyeSA9IG5ldyBzdHJpbmdbXSB7IFwidHJpcGxlanVtcFwiLFwiY2hlYXBlcmJsb2Nrc1wiLFwiaW52aW5jaWJpbGl0eVwiIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgUiA9IE1hdGguUmFuZG9tKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nIEM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwaWNrZXIgPT0gbnVsbCB8fCBNYXRoLlJhbmRvbSgpIDwgMC4yKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFIgPCAwLjc1KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrZXIgPSBjb21tb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTID0gXCJjb21tb25cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0gXCIjRkZGRkZGXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSID0gTWF0aC5SYW5kb20oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChSIDwgMC44NSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrZXIgPSByYXJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFMgPSBcInJhcmVcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbG9yID0gXCIjRkY5OTIyXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBcIiNGRkJCMzNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrZXIgPSBsZWdlbmRhcnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUyA9IFwibGVnZW5kYXJ5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBcIiNGRjU1RkZcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBDID0gQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuUGljazxzdHJpbmc+KHBpY2tlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgb2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBDb2xsZWN0YWJsZUl0ZW0gQ0k7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChDKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwb2ludFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFAgPSBuZXcgUG9pbnRJdGVtKEdhbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5Qb3NpdGlvbi5Db3B5RnJvbShQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQLlZzcGVlZCA9IC0yZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFAuSHNwZWVkID0gLTJmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5jb2xsZWN0aW9uRGVsYXkgPSAzMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWUuQWRkRW50aXR5KFApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFAgPSBuZXcgUG9pbnRJdGVtKEdhbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5Qb3NpdGlvbi5Db3B5RnJvbShQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQLlZzcGVlZCA9IC0yZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFAuSHNwZWVkID0gMmY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQLmNvbGxlY3Rpb25EZWxheSA9IDMwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR2FtZS5BZGRFbnRpdHkoUCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTSA9IFwiUG9pbnRzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaGVhcnRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuSFAgPj0gcGxheWVyLm1heEhQKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBIID0gbmV3IEhlYWxpbmdJdGVtKEdhbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSC5Qb3NpdGlvbi5Db3B5RnJvbShQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBILlZzcGVlZCA9IC0yZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEguY29sbGVjdGlvbkRlbGF5ID0gMzA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHYW1lLkFkZEVudGl0eShIKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE0gPSBcIkhlYWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidHJpcGxlaGVhcnRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuSFAgPiBwbGF5ZXIubWF4SFAvMylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgSDEgPSBuZXcgSGVhbGluZ0l0ZW0oR2FtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIMS5Qb3NpdGlvbi5Db3B5RnJvbShQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIMS5Wc3BlZWQgPSAtMmY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIMS5Ic3BlZWQgPSAtMmY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIMS5jb2xsZWN0aW9uRGVsYXkgPSAzMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWUuQWRkRW50aXR5KEgxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIMSA9IG5ldyBIZWFsaW5nSXRlbShHYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLlBvc2l0aW9uLkNvcHlGcm9tKFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLlZzcGVlZCA9IC0yZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLkhzcGVlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIMS5jb2xsZWN0aW9uRGVsYXkgPSAzMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWUuQWRkRW50aXR5KEgxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIMSA9IG5ldyBIZWFsaW5nSXRlbShHYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLlBvc2l0aW9uLkNvcHlGcm9tKFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLlZzcGVlZCA9IC0yZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEgxLkhzcGVlZCA9IDJmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSDEuY29sbGVjdGlvbkRlbGF5ID0gMzA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHYW1lLkFkZEVudGl0eShIMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNID0gXCJIZWFsIHgzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRvdWJsZW9yYlwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEdhbWUudGltZVJlbWFpbmluZyA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0kgPSBuZXcgT3JiKEdhbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0kuUG9zaXRpb24uQ29weUZyb20oUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0kuVnNwZWVkID0gLTJmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0kuSHNwZWVkID0gLTJmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0kuY29sbGVjdGlvbkRlbGF5ID0gMzA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHYW1lLkFkZEVudGl0eShDSSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0kgPSBuZXcgT3JiKEdhbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0kuUG9zaXRpb24uQ29weUZyb20oUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0kuVnNwZWVkID0gLTJmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0kuSHNwZWVkID0gMmY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDSS5jb2xsZWN0aW9uRGVsYXkgPSAzMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWUuQWRkRW50aXR5KENJKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNID0gXCJEb3VibGUgT3JiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm1pbmluZ1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBsYXllci5kaWdwb3dlciA8IDIuMGYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmRpZ3Bvd2VyICs9IDAuNWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE0gPSBcIk1pbmluZyBQb3dlciBcIisocGxheWVyLmRpZ3Bvd2VyKStcInhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidHJpcGxlanVtcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFBDID0gcGxheWVyLkdldEJlaGF2aW9yPFBsYXRmb3JtZXJDb250cm9scz4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQQy5tYXhBaXJKdW1wcyA8IDIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUEMubWF4QWlySnVtcHMgPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNID0gXCJUcmlwbGUgSnVtcFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjaGVhcGVyYmxvY2tzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGxheWVyLmJsb2NrcHJpY2UgIT0gOSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYmxvY2twcmljZSA9IDY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNID0gXCJCbG9ja3MgYXJlIGNoZWFwZXIgbm93XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImludmluY2liaWxpdHlcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuaW52aW5jaWJpbGl0eW1vZCAhPSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5pbnZpbmNpYmlsaXR5bW9kID0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE0gPSBcImludmluY2liaWxpdHkgZXh0ZW5kZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhdHRhY2twb3dlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmF0dGFja3Bvd2VyICs9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNID0gXCJBdHRhY2sgUG93ZXIgXCIgKyAoaW50KShwbGF5ZXIuYXR0YWNrcG93ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJkZWZlbnNlcG93ZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5kZWZlbnNlcG93ZXIgKz0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE0gPSBcIkRlZmVuc2l2ZSBQb3dlciBcIiArIChpbnQpKHBsYXllci5kZWZlbnNlcG93ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9rICYmIE0hPVwiXCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgRmxvYXRpbmdNZXNzYWdlIEZNID0gbmV3IEZsb2F0aW5nTWVzc2FnZShHYW1lLCBNKTtcclxuICAgICAgICAgICAgICAgICAgICBGTS5UZXh0LlRleHRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vRk0uUG9zaXRpb24gPSBuZXcgVmVjdG9yMih4IC0gOCwgeSAtIDIwKTtcclxuICAgICAgICAgICAgICAgICAgICBGTS5Qb3NpdGlvbiA9IG5ldyBWZWN0b3IyKHggKyA4LCB5IC0gMjApO1xyXG4gICAgICAgICAgICAgICAgICAgIEdhbWUuQWRkRW50aXR5KEZNKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoUyE9XCJcIiAmJiBTICE9IFwiY29tbW9uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQbGF5U291bmQoXCJvazJCXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQbGF5U291bmQoXCJqdW1wXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgVGlsZURhdGEgR2V0Rmxvb3IoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVGlsZURhdGEgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZsb2F0IFcgPSBXaWR0aCAvIDM7XHJcbiAgICAgICAgICAgIGZsb2F0IFkgPSBIZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgV2lkdGggLyAyLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBXLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBXaWR0aCAtIFcsIFkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgQ29sbGVjdGFibGVJdGVtOiBFbnRpdHlcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbCBmbG9hdHMgPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBtYWduZXREaXN0YW5jZSA9IDM1O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBtYWduZXRTcGVlZCA9IDg7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IG1heEZhbGxTcGVlZCA9IDI7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGZhbGxhY2NlbCA9IDAuMWY7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBpdGVtTmFtZTtcclxuICAgICAgICBwdWJsaWMgaW50IGNvbGxlY3Rpb25EZWxheSA9IDEwO1xyXG4gICAgICAgIHB1YmxpYyBDb2xsZWN0YWJsZUl0ZW0oR2FtZSBnYW1lLHN0cmluZyBpdGVtTmFtZSkgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5HZXQoXCJpbWFnZXMvaXRlbXMvXCIraXRlbU5hbWUpKTtcclxuICAgICAgICAgICAgQW5pLlNldEltYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbU5hbWUgPSBpdGVtTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIGJvb2wgQ2FuQ29sbGVjdChQbGF5ZXJDaGFyYWN0ZXIgcGxheWVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb25EZWxheSA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb25EZWxheS0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFZlY3RvcjIgQztcclxuICAgICAgICAgICAgdmFyIHBsYXllciA9IEdhbWUucGxheWVyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb25EZWxheTw9MCAmJiBDYW5Db2xsZWN0KHBsYXllcikgJiYgKChDID0gcGxheWVyLmdldENlbnRlcigpKS5Fc3RpbWF0ZWREaXN0YW5jZShQb3NpdGlvbikgPCBtYWduZXREaXN0YW5jZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBDMiA9IGdldENlbnRlcigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIFAgPSBDIC0gQzI7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG4gPSBQLkxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciBzcGQgPSBtYWduZXRTcGVlZDtcclxuICAgICAgICAgICAgICAgIHZhciBmc3BkID0gc3BkIC8gTWF0aC5NYXgoMSwgbG4pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxuIDw9IGZzcGQvKiAmJiBDYW5Db2xsZWN0KEdhbWUucGxheWVyKSovKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vKChQbGF5ZXJDaGFyYWN0ZXIpR2FtZS5wbGF5ZXIpLm9uQ29sbGVjdEl0ZW0odGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBIc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIFZzcGVlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgUG9zaXRpb24uQ29weUZyb20oR2FtZS5wbGF5ZXIuUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIG9uQ29sbGVjdGVkKCgoUGxheWVyQ2hhcmFjdGVyKUdhbWUucGxheWVyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgUGxheVNvdW5kKFwicG93ZXJ1cFwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBQID0gUC5Ob3JtYWxpemUoZnNwZCk7XHJcbiAgICAgICAgICAgICAgICAvKnggKz0gUC5YO1xyXG4gICAgICAgICAgICAgICAgeSArPSBQLlk7Ki9cclxuICAgICAgICAgICAgICAgIEhzcGVlZCA9IFAuWDtcclxuICAgICAgICAgICAgICAgIFZzcGVlZCA9IFAuWTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy9Wc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCFmbG9hdHMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBGID0gR2V0Rmxvb3IoKTtcclxuICAgICAgICAgICAgICAgIGlmIChGID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFZzcGVlZCA8IG1heEZhbGxTcGVlZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFZzcGVlZCA9IE1hdGguTWluKFZzcGVlZCArIGZhbGxhY2NlbCwgbWF4RmFsbFNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVnNwZWVkID0gbWF4RmFsbFNwZWVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBWc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHkgPSBGLkdldEhpdGJveCgpLnRvcCAtIEFuaS5DdXJyZW50SW1hZ2UuSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9Ic3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgSHNwZWVkID0gKGZsb2F0KU1hdGhIZWxwZXIuRGVjZWxlcmF0ZShIc3BlZWQsIDAuMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL0hzcGVlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAvL1ZzcGVlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICBIc3BlZWQgPSAoZmxvYXQpTWF0aEhlbHBlci5EZWNlbGVyYXRlKEhzcGVlZCwgMC4xKTtcclxuICAgICAgICAgICAgICAgIFZzcGVlZCA9IChmbG9hdClNYXRoSGVscGVyLkRlY2VsZXJhdGUoVnNwZWVkLCAwLjEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBUaWxlRGF0YSBHZXRGbG9vcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBUaWxlRGF0YSBUID0gbnVsbDtcclxuICAgICAgICAgICAgZmxvYXQgVyA9IFdpZHRoIC8gMztcclxuICAgICAgICAgICAgZmxvYXQgWSA9IEhlaWdodDtcclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBXaWR0aCAvIDIsIFkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoVmVjdG9yMi5BZGQoUG9zaXRpb24sIFcsIFkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoVmVjdG9yMi5BZGQoUG9zaXRpb24sIFdpZHRoIC0gVywgWSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBUO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhYnN0cmFjdCBwdWJsaWMgdm9pZCBvbkNvbGxlY3RlZChQbGF5ZXJDaGFyYWN0ZXIgcGxheWVyKTtcclxuICAgICAgICAvKnB1YmxpYyB2aXJ0dWFsIHZvaWQgb25Db2xsZWN0ZWQoUGxheWVyQ2hhcmFjdGVyIHBsYXllcilcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIH0qL1xyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENvbnRyb2xsYWJsZUVudGl0eTpFbnRpdHlcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYm9vbFtdIENvbnRyb2xsZXI7XHJcbiAgICAgICAgcHVibGljIGJvb2xbXSBMQ29udHJvbGxlcjtcclxuICAgICAgICBwdWJsaWMgQ29udHJvbGxhYmxlRW50aXR5KEdhbWUgZ2FtZSk6YmFzZShnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ29udHJvbGxlciA9IG5ldyBib29sWzddO1xyXG4gICAgICAgICAgICBMQ29udHJvbGxlciA9IG5ldyBib29sW0NvbnRyb2xsZXIuTGVuZ3RoXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyByZXR1cm5zIHRydWUgaWYgdGhlIGJ1dHRvbiB3YXMganVzdCBwcmVzc2VkLlxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiYnV0dG9uXCI+PC9wYXJhbT5cclxuICAgICAgICAvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG4gICAgICAgIHB1YmxpYyBib29sIFByZXNzZWQoaW50IGJ1dHRvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAoQ29udHJvbGxlcltidXR0b25dICE9IExDb250cm9sbGVyW2J1dHRvbl0gJiYgQ29udHJvbGxlcltidXR0b25dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyByZXR1cm5zIHRydWUgaWYganVzdCByZWxlYXNlZC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImJ1dHRvblwiPjwvcGFyYW0+XHJcbiAgICAgICAgLy8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuICAgICAgICBwdWJsaWMgYm9vbCBSZWxlYXNlZChpbnQgYnV0dG9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIChDb250cm9sbGVyW2J1dHRvbl0gIT0gTENvbnRyb2xsZXJbYnV0dG9uXSAmJiAhQ29udHJvbGxlcltidXR0b25dKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRXhpdERvb3IgOiBFbnRpdHlcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIGludCByZXNldCA9IDA7XHJcbiAgICAgICAgcHJpdmF0ZSBUaWxlRGF0YSBSVDtcclxuICAgICAgICBwcml2YXRlIGJvb2wgX09wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBib29sIE9wZW5lZFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfT3BlbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfT3BlbmVkID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoX09wZW5lZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBBbmkuQ3VycmVudEZyYW1lID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBBbmkuU2V0SW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQW5pLkN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgQW5pLlNldEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEV4aXREb29yKEdhbWUgZ2FtZSkgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5HZXQoXCJpbWFnZXMvbWlzYy9kb29yXCIpKTtcclxuICAgICAgICAgICAgQW5pLkltYWdlU3BlZWQgPSAwO1xyXG4gICAgICAgICAgICBBbmkuU2V0SW1hZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJvcFRvR3JvdW5kKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHdoaWxlIChHZXRGbG9vcigpID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHkgKz0gMTY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIEYgPSBHZXRGbG9vcigpO1xyXG4gICAgICAgICAgICAvL0YuQnJlYWthYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBGQiA9IEYuR2V0SGl0Ym94KCk7XHJcbiAgICAgICAgICAgIHggPSBGQi5sZWZ0O1xyXG4gICAgICAgICAgICB5ID0gRkIudG9wIC0gMzI7XHJcbiAgICAgICAgICAgIHZhciBUID0gR2FtZS5UTS5HZXRUaWxlKEYuY29sdW1uLCBGLnJvdyAtIDEpO1xyXG4gICAgICAgICAgICBpZiAoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5IC09IDE2O1xyXG4gICAgICAgICAgICAgICAgRiA9IFQ7XHJcbiAgICAgICAgICAgICAgICBIZWxwZXIuTG9nKFwiZHVnIGRvb3Igb3V0IG9mIHRoZSBncm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBSVCA9IEY7XHJcbiAgICAgICAgICAgIC8qRi5CcmVha2FibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgRi50ZXh0dXJlID0gMDtcclxuXHJcbiAgICAgICAgICAgIEdhbWUuVE0uUmVkcmF3VGlsZShGLmNvbHVtbiwgRi5yb3cpOyovXHJcbiAgICAgICAgICAgIHJlc2V0ID0gMDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAoIV9PcGVuZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8qdmFyIEYgPSBHZXRGbG9vcigpO1xyXG4gICAgICAgICAgICBpZiAoRiA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBWc3BlZWQgPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVnNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgIHkgPSBGLkdldEhpdGJveCgpLnRvcCAtIEFuaS5DdXJyZW50SW1hZ2UuSGVpZ2h0O1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgdmFyIFAgPSAoUGxheWVyQ2hhcmFjdGVyKUdhbWUucGxheWVyO1xyXG4gICAgICAgICAgICBpZiAoUC5Qb3NpdGlvbi5Fc3RpbWF0ZWREaXN0YW5jZShQb3NpdGlvbikgPCAyMCAmJiBQLkNvbnRyb2xsZXJbMl0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgUC5zY29yZSArPSAoR2FtZS5sZXZlbCAqIDEwKTtcclxuICAgICAgICAgICAgICAgIEdhbWUuU3RhcnROZXh0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLypQLmtleXMtLTtcclxuICAgICAgICAgICAgICAgIE9wZW4oUCk7Ki9cclxuICAgICAgICAgICAgICAgIC8qQW5pLkN1cnJlbnRGcmFtZSA9IDE7XHJcbiAgICAgICAgICAgICAgICBBbmkuU2V0SW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIEFuaS5VcGRhdGUoKTsqL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXNldDwyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXNldCsrO1xyXG4gICAgICAgICAgICAgICAgLy9yZXNldCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLy92YXIgRiA9IEdldEZsb29yKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgRiA9IFJUO1xyXG4gICAgICAgICAgICAgICAgaWYgKEYgIT0gbnVsbCAmJiByZXNldD09MilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBGLkJyZWFrYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIEYudGV4dHVyZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgR2FtZS5UTS5SZWRyYXdUaWxlKEYuY29sdW1uLCBGLnJvdyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIFRpbGVEYXRhIEdldEZsb29yKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBudWxsO1xyXG4gICAgICAgICAgICBmbG9hdCBXID0gV2lkdGggLyAzO1xyXG4gICAgICAgICAgICBmbG9hdCBZID0gSGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoVmVjdG9yMi5BZGQoUG9zaXRpb24sIFdpZHRoIC8gMiwgWSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgVywgWSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC50b3BTb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbiwgV2lkdGggLSBXLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEZsaWdodENvbnRyb2xzIDogRW50aXR5QmVoYXZpb3JcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYWNjZWwgPSAwLjM1ZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgbWF4U3BlZWQgPSAxLjVmO1xyXG4gICAgICAgIFBsYXRmb3JtZXJFbnRpdHkgX3BsYXRmb3JtZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBGbGlnaHRDb250cm9scyhQbGF0Zm9ybWVyRW50aXR5IGVudGl0eSkgOiBiYXNlKGVudGl0eSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9wbGF0Zm9ybWVyID0gZW50aXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYm9vbFtdIGNvbnRyb2xsZXIgPSBfcGxhdGZvcm1lci5Db250cm9sbGVyO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclswXSAmJiBfcGxhdGZvcm1lci5Ic3BlZWQgPiAtbWF4U3BlZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLkhzcGVlZCA9IChmbG9hdClNYXRoLk1heChfcGxhdGZvcm1lci5Ic3BlZWQgLSAoYWNjZWwgKyBfcGxhdGZvcm1lci5mcmljdGlvbiksIC1tYXhTcGVlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJbMV0gJiYgX3BsYXRmb3JtZXIuSHNwZWVkIDwgbWF4U3BlZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLkhzcGVlZCA9IChmbG9hdClNYXRoLk1pbihfcGxhdGZvcm1lci5Ic3BlZWQgKyAoYWNjZWwgKyBfcGxhdGZvcm1lci5mcmljdGlvbiksIG1heFNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclsyXSAmJiBfcGxhdGZvcm1lci5Wc3BlZWQgPiAtbWF4U3BlZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLlZzcGVlZCA9IChmbG9hdClNYXRoLk1heChfcGxhdGZvcm1lci5Wc3BlZWQgLSAoYWNjZWwgKyBfcGxhdGZvcm1lci5mcmljdGlvbiksIC1tYXhTcGVlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJbM10gJiYgX3BsYXRmb3JtZXIuVnNwZWVkIDwgbWF4U3BlZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLlZzcGVlZCA9IChmbG9hdClNYXRoLk1pbihfcGxhdGZvcm1lci5Wc3BlZWQgKyAoYWNjZWwgKyBfcGxhdGZvcm1lci5mcmljdGlvbiksIG1heFNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKnZhciBqdW1wYnV0dG9uID0gNTtcclxuICAgICAgICAgICAgaWYgKF9wbGF0Zm9ybWVyLlZzcGVlZCA+PSAwICYmIF9wbGF0Zm9ybWVyLm9uR3JvdW5kKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3BsYXRmb3JtZXIuUHJlc3NlZChqdW1wYnV0dG9uKSAmJiBfcGxhdGZvcm1lci5vbkdyb3VuZCAmJiBfcGxhdGZvcm1lci5DZWlsaW5nID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3BsYXRmb3JtZXIuVnNwZWVkID0gLWp1bXBTcGVlZDtcclxuICAgICAgICAgICAgICAgICAgICAvLy9lbnRpdHkuUGxheVNvdW5kKFwianVtcFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChhaXJKdW1wcyA8IG1heEFpckp1bXBzICYmIF9wbGF0Zm9ybWVyLlByZXNzZWQoanVtcGJ1dHRvbikgJiYgX3BsYXRmb3JtZXIuQ2VpbGluZyA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci5Wc3BlZWQgPSAtKGp1bXBTcGVlZCAqIGFpcmp1bXBwb3dlcik7XHJcbiAgICAgICAgICAgICAgICBhaXJKdW1wcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfcGxhdGZvcm1lci5Wc3BlZWQgPCAwICYmICFjb250cm9sbGVyW2p1bXBidXR0b25dKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci5Wc3BlZWQgKz0gKF9wbGF0Zm9ybWVyLmdyYXZpdHkgKiAyKTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRmxvYXRpbmdNZXNzYWdlIDogRW50aXR5XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGludCB0aW1lID0gMzA7XHJcbiAgICAgICAgcHVibGljIFRleHRTcHJpdGUgVGV4dDtcclxuICAgICAgICBmbG9hdCBhbHBoYSA9IDE7XHJcbiAgICAgICAgcHVibGljIEZsb2F0aW5nTWVzc2FnZShHYW1lIGdhbWUsc3RyaW5nIHRleHQpIDogYmFzZShnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQW5pID0gbmV3IEFuaW1hdGlvbihudWxsKTtcclxuICAgICAgICAgICAgVGV4dCA9IG5ldyBUZXh0U3ByaXRlKCk7XHJcbiAgICAgICAgICAgIFRleHQuVGV4dCA9IHRleHQ7XHJcbiAgICAgICAgICAgIFRleHQuVGV4dENvbG9yID0gXCIjRkZGRkZGXCI7XHJcbiAgICAgICAgICAgIFRleHQuU2hhZG93Q29sb3IgPSBcIiMwMDAwMDBcIjtcclxuICAgICAgICAgICAgVGV4dC5TaGFkb3dPZmZzZXQgPSBuZXcgVmVjdG9yMigyLCAyKTtcclxuICAgICAgICAgICAgVGV4dC5TaGFkb3dCbHVyID0gMTtcclxuICAgICAgICAgICAgVGV4dC5Gb250U2l6ZSA9IDE0O1xyXG4gICAgICAgICAgICB0aW1lID0gMzArKHRleHQuTGVuZ3RoICogMjApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKHRpbWUgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aW1lLS07XHJcbiAgICAgICAgICAgICAgICBpZiAodGltZSA8IDEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9BbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGFscGhhIC09IDAuMDVmO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbHBoYSA8PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgRHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vYmFzZS5EcmF3KGcpO1xyXG4gICAgICAgICAgICBpZiAoYWxwaGEgPCAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gYWxwaGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9UZXh0LlBvc2l0aW9uLkNvcHlGcm9tKFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgVGV4dC5Gb3JjZVVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBUZXh0LlBvc2l0aW9uLlggPSAoaW50KVBvc2l0aW9uLlgtKFRleHQuc3ByaXRlQnVmZmVyLldpZHRoLzIpO1xyXG4gICAgICAgICAgICBUZXh0LlBvc2l0aW9uLlkgPSAoaW50KVBvc2l0aW9uLlktKFRleHQuc3ByaXRlQnVmZmVyLkhlaWdodC8yKTtcclxuICAgICAgICAgICAgVGV4dC5EcmF3KGcpO1xyXG4gICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gMWY7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBQYXJ0aWNsZTpFbnRpdHlcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50IEhQID0gMTI7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGFscGhhdGltZSA9IDAuMmY7XHJcblxyXG4gICAgICAgIHB1YmxpYyBQYXJ0aWNsZShHYW1lIGdhbWUsSFRNTEltYWdlRWxlbWVudCBpbWFnZSkgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBbmkgPSBuZXcgQW5pbWF0aW9uKG5ldyBMaXN0PEhUTUxJbWFnZUVsZW1lbnQ+KG5ldyBIVE1MSW1hZ2VFbGVtZW50W10geyBpbWFnZSB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBIUC0tO1xyXG4gICAgICAgICAgICBpZiAoSFAgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKChBbmkuQWxwaGEgLT0gYWxwaGF0aW1lKSA8PSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvKmlmIChhbHBoYXRpbWUgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGFscGhhIC09IGFscGhhdGltZTtcclxuICAgICAgICAgICAgICAgICAgICBBbmkuQWxwaGEgPSBhbHBoYTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWxwaGEgPD0gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBiYXNlLlVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBQbGF0Zm9ybWVyQ29udHJvbHM6IEVudGl0eUJlaGF2aW9yXHJcbiAgICB7XHJcbiAgICAgICAgUGxhdGZvcm1lckVudGl0eSBfcGxhdGZvcm1lcjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYWNjZWwgPSAwLjM1ZjtcclxuICAgICAgICAvL3B1YmxpYyBmbG9hdCBqdW1wU3BlZWQgPSAxOGY7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGp1bXBTcGVlZCA9IDIuMjVmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBtYXhTcGVlZCA9IDEuNWY7XHJcbiAgICAgICAgcHVibGljIGludCBtYXhBaXJKdW1wcyA9IDE7XHJcbiAgICAgICAgcHVibGljIGludCBhaXJKdW1wcyA9IDA7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGFpcmp1bXBwb3dlciA9IDAuODE1ZjtcclxuICAgICAgICBwdWJsaWMgUGxhdGZvcm1lckNvbnRyb2xzKFBsYXRmb3JtZXJFbnRpdHkgZW50aXR5KTpiYXNlKGVudGl0eSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9wbGF0Zm9ybWVyID0gZW50aXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYm9vbFtdIGNvbnRyb2xsZXIgPSBfcGxhdGZvcm1lci5Db250cm9sbGVyO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbGxlclswXSAmJiBfcGxhdGZvcm1lci5Ic3BlZWQgPiAtbWF4U3BlZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLkhzcGVlZCA9IChmbG9hdClNYXRoLk1heChfcGxhdGZvcm1lci5Ic3BlZWQgLSAoYWNjZWwgKyBfcGxhdGZvcm1lci5mcmljdGlvbiksIC1tYXhTcGVlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXJbMV0gJiYgX3BsYXRmb3JtZXIuSHNwZWVkIDwgbWF4U3BlZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLkhzcGVlZCA9IChmbG9hdClNYXRoLk1pbihfcGxhdGZvcm1lci5Ic3BlZWQgKyAoYWNjZWwgKyBfcGxhdGZvcm1lci5mcmljdGlvbiksIG1heFNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIganVtcGJ1dHRvbiA9IDU7XHJcbiAgICAgICAgICAgIGlmIChfcGxhdGZvcm1lci5vbkdyb3VuZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWlySnVtcHMgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfcGxhdGZvcm1lci5Wc3BlZWQgPj0gMCAmJiBfcGxhdGZvcm1lci5vbkdyb3VuZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9pZiAoY29udHJvbGxlcltqdW1wYnV0dG9uXSAmJiBfcGxhdGZvcm1lci5DZWlsaW5nID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAvL2lmIChjb250cm9sbGVyW2p1bXBidXR0b25dICYmIF9wbGF0Zm9ybWVyLm9uR3JvdW5kICYmIF9wbGF0Zm9ybWVyLkNlaWxpbmcgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGlmIChfcGxhdGZvcm1lci5QcmVzc2VkKGp1bXBidXR0b24pICYmIF9wbGF0Zm9ybWVyLm9uR3JvdW5kICYmIF9wbGF0Zm9ybWVyLkNlaWxpbmcgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci5Wc3BlZWQgPSAtanVtcFNwZWVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS5QbGF5U291bmQoXCJqdW1wXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vL2VudGl0eS5QbGF5U291bmQoXCJqdW1wXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLyplbHNlIGlmIChjb250cm9sbGVyWzNdICYmIF9wbGF0Zm9ybWVyLkZsb29yICE9IG51bGwgJiYgX3BsYXRmb3JtZXIuRmxvb3IucGxhdGZvcm0pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9wbGF0Zm9ybWVyLnkgPSBncm91bmRZICsgMjtcclxuICAgICAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci5vbkdyb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLkZsb29yID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBfcGxhdGZvcm1lci55ICs9IDI7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChhaXJKdW1wcyA8IG1heEFpckp1bXBzICYmIF9wbGF0Zm9ybWVyLlByZXNzZWQoanVtcGJ1dHRvbikgJiYgX3BsYXRmb3JtZXIuQ2VpbGluZyA9PSBudWxsKXtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLlZzcGVlZCA9IC0oanVtcFNwZWVkICogYWlyanVtcHBvd2VyKTtcclxuICAgICAgICAgICAgICAgIGFpckp1bXBzKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF9wbGF0Zm9ybWVyLlZzcGVlZCA8IDAgJiYgIWNvbnRyb2xsZXJbanVtcGJ1dHRvbl0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9wbGF0Zm9ybWVyLlZzcGVlZCArPSAoX3BsYXRmb3JtZXIuZ3Jhdml0eSAqIDIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBQbGF5ZXJCdWxsZXQ6IEVudGl0eSwgSUhhcm1mdWxFbnRpdHksIElMaWdodFNvdXJjZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBFbnRpdHkgc2hvb3RlcjtcclxuICAgICAgICBwdWJsaWMgaW50IER1cmF0aW9uID0gMDtcclxuICAgICAgICBwcm90ZWN0ZWQgTGlzdDxFbnRpdHk+IGhpdEVudGl0aWVzO1xyXG4gICAgICAgIHB1YmxpYyBib29sIHBpZXJjaW5nO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBzcGlucmF0ZSA9IDA7XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgR3Jhdml0eSA9IG5ldyBWZWN0b3IyKCk7XHJcbiAgICAgICAgcHVibGljIGJvb2wgQm91bmNlcztcclxuICAgICAgICBwdWJsaWMgYm9vbCBhdHRhY2tzdGVycmFpbiA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBkaWdwb3dlciA9IDAuNWY7XHJcbiAgICAgICAgcHVibGljIFBsYXllckJ1bGxldChHYW1lIGdhbWUsRW50aXR5IHNob290ZXIsc3RyaW5nIGdyYXBoaWM9XCJSZWlzZW5idWxsZXRcIikgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5fdGhpcy5HZXRBbmltYXRpb24oZ3JhcGhpYykpO1xyXG4gICAgICAgICAgICB0aGlzLnNob290ZXIgPSBzaG9vdGVyO1xyXG5cclxuICAgICAgICAgICAgLy9BbmkuSHVlQ29sb3IgPSBHYW1lLkdldFRlYW1Db2xvcigoKElDb21iYXRhbnQpc2hvb3RlcikuVGVhbSk7XHJcbiAgICAgICAgICAgIC8vL0FuaS5IdWVDb2xvciA9IHNob290ZXIuR2V0VGVhbUNvbG9yKCk7XHJcbiAgICAgICAgICAgIC8vL0FuaS5IdWVSZWNvbG9yU3RyZW5ndGggPSAxO1xyXG4gICAgICAgICAgICBwaWVyY2luZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaGl0RW50aXRpZXMgPSBuZXcgTGlzdDxFbnRpdHk+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgRW50aXR5IEF0dGFja2VyXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNob290ZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIElzSGFybWZ1bFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBsaWdodEZsaWNrZXJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIGxpZ2h0UG9zaXRpb25cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBmbG9hdCBfbWF4TGlnaHRSYWRpdXM9MS41ZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgbWF4TGlnaHRSYWRpdXNcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQW5pLkFscGhhPj0xID8gX21heExpZ2h0UmFkaXVzIDogMGY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF9tYXhMaWdodFJhZGl1cyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBSZWN0YW5nbGUgR2V0SGl0Ym94KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChBbmkgIT0gbnVsbCAmJiBBbmkuQ3VycmVudEltYWdlICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vZmxvYXQgcyA9IE1hdGguTWF4KEFuaS5DdXJyZW50SW1hZ2UuV2lkdGgsIEFuaS5DdXJyZW50SW1hZ2UuSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIC8vZmxvYXQgcyA9IEFuaS5DdXJyZW50SW1hZ2UuSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgcyA9IEFuaS5DdXJyZW50SW1hZ2UuSGVpZ2h0ICogMS41ZjtcclxuICAgICAgICAgICAgICAgIC8vZmxvYXQgczIgPSBzIC8gMmY7XHJcbiAgICAgICAgICAgICAgICAvL1ZlY3RvcjIgViA9IEFuaS5Qb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIGZsb2F0IHNvMiA9IHMgLyAyO1xyXG4gICAgICAgICAgICAgICAgLy9WZWN0b3IyIFYgPSBnZXRDZW50ZXIoKSAtIG5ldyBWZWN0b3IyKHNvMixzbzIpO1xyXG4gICAgICAgICAgICAgICAgVmVjdG9yMiBWID0gVmVjdG9yMi5TdWJ0cmFjdChnZXRDZW50ZXIoKSwgc28yLCBzbzIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUoVi5YLCBWLlksIHMsIHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIGZsb2F0IF90b3VjaERhbWFnZSA9IDFmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB0b3VjaERhbWFnZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdG91Y2hEYW1hZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIF90b3VjaERhbWFnZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBvbnRvdWNoRGFtYWdlKElDb21iYXRhbnQgdGFyZ2V0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFwaWVyY2luZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYm9vbCBvayA9ICFoaXRFbnRpdGllcy5Db250YWlucygoRW50aXR5KXRhcmdldCk7XHJcbiAgICAgICAgICAgIGlmIChvaylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaGl0RW50aXRpZXMuQWRkKChFbnRpdHkpdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBiYXNlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAoc3BpbnJhdGUgIT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQW5pLlJvdGF0aW9uICs9IHNwaW5yYXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChHcmF2aXR5LlJvdWdoTGVuZ3RoICE9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNwZWVkICs9IEdyYXZpdHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9pZiAoIUFwcC5zY3JlZW5ib3VuZHMuaXNUb3VjaGluZyhHZXRIaXRib3goKSkpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL2lmICghR2FtZS5zdGFnZUJvdW5kcy5pc1RvdWNoaW5nKEdldEhpdGJveCgpKSlcclxuICAgICAgICAgICAgaWYgKCFHYW1lLnN0YWdlQm91bmRzLmNvbnRhaW5zUG9pbnQoUG9zaXRpb24pKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKEFuaS5YPjAgPT0gSHNwZWVkPjAgfHwgQW5pLlggPCAwID09IEhzcGVlZCA8IDApIHx8IChBbmkuWSA+IDAgPT0gVnNwZWVkID4gMCB8fCBBbmkuWSA8IDAgPT0gVnNwZWVkIDwgMCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL1ZlY3RvcjIgY2VudGVyID0gZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgICAgIFZlY3RvcjIgY2VudGVyID0gVmVjdG9yMi5BZGQoUG9zaXRpb24sOCwwKTtcclxuICAgICAgICAgICAgVGlsZURhdGEgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICghQm91bmNlcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKG5ldyBWZWN0b3IyKGNlbnRlci5YLHkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnNvbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVC5CcmVha2FibGUgJiYgYXR0YWNrc3RlcnJhaW4pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9ULkRhbWFnZShfdG91Y2hEYW1hZ2UgKiBkaWdwb3dlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgUGxheVNvdW5kKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFQuRGFtYWdlKGRpZ3Bvd2VyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoQm91bmNlcylcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShjZW50ZXIgKyBuZXcgVmVjdG9yMihTcGVlZC5YKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnNvbGlkVG9TcGVlZChTcGVlZC5Ub0NhcmRpbmFsKCkpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFNwZWVkLlggPSAtU3BlZWQuWDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoY2VudGVyICsgbmV3IFZlY3RvcjIoMCxTcGVlZC5ZKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnNvbGlkVG9TcGVlZChTcGVlZC5Ub0NhcmRpbmFsKCkpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFNwZWVkLlkgPSAtU3BlZWQuWTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoY2VudGVyICsgU3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC5zb2xpZFRvU3BlZWQoU3BlZWQuVG9DYXJkaW5hbCgpKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBTcGVlZC5YID0gLVNwZWVkLlg7XHJcbiAgICAgICAgICAgICAgICAgICAgU3BlZWQuWSA9IC1TcGVlZC5ZO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChEdXJhdGlvbj4wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvbi0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKER1cmF0aW9uPD0wKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIER1cmF0aW9uID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBBbmkuQWxwaGEgLT0gMC4yZjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQW5pLkFscGhhPD0wKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUmFuZG9tQUkgOiBFbnRpdHlCZWhhdmlvclxyXG4gICAge1xyXG4gICAgICAgIENvbnRyb2xsYWJsZUVudGl0eSBDRTtcclxuICAgICAgICBwdWJsaWMgUmFuZG9tQUkoQ29udHJvbGxhYmxlRW50aXR5IGVudGl0eSkgOiBiYXNlKGVudGl0eSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENFID0gZW50aXR5O1xyXG4gICAgICAgICAgICB0aGlzLkZyYW1lc1BlclRpY2sgPSAxNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLlJhbmRvbSgpIDwgMC4xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgQ29udHJvbGxlciA9IENFLkNvbnRyb2xsZXI7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sbGVyWzBdID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sbGVyWzFdID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sbGVyWzJdID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sbGVyWzNdID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguUmFuZG9tKCkgPCAwLjUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29udHJvbGxlclswXSA9IE1hdGguUmFuZG9tKCkgPCAwLjU7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29udHJvbGxlclsxXSA9ICFDb250cm9sbGVyWzBdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLlJhbmRvbSgpIDwgMC41KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENvbnRyb2xsZXJbMl0gPSBNYXRoLlJhbmRvbSgpIDwgMC41O1xyXG4gICAgICAgICAgICAgICAgICAgIENvbnRyb2xsZXJbM10gPSAhQ29udHJvbGxlclsyXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVGV4dFNwcml0ZTogU3ByaXRlXHJcbiAgICB7XHJcbiAgICAgICAgcHJvdGVjdGVkIHN0cmluZyBfVGV4dDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIFRleHRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX1RleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfVGV4dCAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfVGV4dCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qUmVkcmF3QmFzZVRleHRJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFJlbmRlclRleHRJbWFnZSgpOyovXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dEludmFsbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9pbWFnZUludmFsbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGJvb2wgdGV4dEludmFsbGlkYXRlZDtcclxuICAgICAgICBwcm90ZWN0ZWQgYm9vbCBpbWFnZUludmFsbGlkYXRlZDtcclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIEhUTUxDYW52YXNFbGVtZW50IFRleHRJbWFnZTtcclxuICAgICAgICBwcm90ZWN0ZWQgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIFRleHRHcmFwaGljO1xyXG4gICAgICAgIHByb3RlY3RlZCBzdHJpbmcgX1RleHRDb2xvcjtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIFRleHRDb2xvclxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfVGV4dENvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX1RleHRDb2xvciAhPSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBfVGV4dENvbG9yID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9SZW5kZXJUZXh0SW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0SW52YWxsaWRhdGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9pbWFnZUludmFsbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBzdHJpbmcgX0ZvbnRXZWlnaHQgPSBcIm5vcm1hbFwiO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgRm9udFdlaWdodFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfRm9udFdlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9Gb250V2VpZ2h0ICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9Gb250V2VpZ2h0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgVXBkYXRlRm9udCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgc3RyaW5nIF9Gb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBGb250RmFtaWx5XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9Gb250RmFtaWx5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX0ZvbnRGYW1pbHkgIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX0ZvbnRGYW1pbHkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBVcGRhdGVGb250KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBpbnQgX0ZvbnRTaXplID0gMTA7XHJcbiAgICAgICAgcHVibGljIGludCBGb250U2l6ZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfRm9udFNpemU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfRm9udFNpemUgIT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgX0ZvbnRTaXplID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgVXBkYXRlRm9udCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgZmxvYXQgX3NoYWRvd0JsdXIgPSAwZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgU2hhZG93Qmx1clxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfc2hhZG93Qmx1cjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9zaGFkb3dCbHVyICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9zaGFkb3dCbHVyID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VJbnZhbGxpZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBWZWN0b3IyIF9zaGFkb3dPZmZzZXQgPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFNoYWRvd09mZnNldFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfc2hhZG93T2Zmc2V0LkNsb25lKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChfc2hhZG93T2Zmc2V0ICE9IHZhbHVlICYmIHZhbHVlLlggIT0gX3NoYWRvd09mZnNldC5YICYmIHZhbHVlLlkgIT0gX3NoYWRvd09mZnNldC5ZKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9zaGFkb3dPZmZzZXQgPSB2YWx1ZS5DbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlSW52YWxsaWRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc3RyaW5nIF9zaGFkb3dDb2xvciA9IFwiIzAwMDAwMFwiO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgU2hhZG93Q29sb3JcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3NoYWRvd0NvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3NoYWRvd0NvbG9yICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIF9zaGFkb3dDb2xvciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlSW52YWxsaWRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgVXBkYXRlRm9udCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBUZXh0R3JhcGhpYy5Gb250ID0gX0ZvbnRXZWlnaHQrXCIgXCIrX0ZvbnRTaXplICsgXCJweCBcIitfRm9udEZhbWlseTtcclxuICAgICAgICAgICAgdGV4dEludmFsbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGltYWdlSW52YWxsaWRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgVGV4dEdyYXBoaWMuRmlsbFN0eWxlID0gX1RleHRDb2xvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qcHJvdGVjdGVkIHN0cmluZyBGb250XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFRleHRHcmFwaGljLkZvbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChUZXh0R3JhcGhpYy5Gb250ICE9IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFRleHRHcmFwaGljLkZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0SW52YWxsaWRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZUludmFsbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHB1YmxpYyBUZXh0U3ByaXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRleHRJbWFnZSA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBUZXh0R3JhcGhpYyA9IFRleHRJbWFnZS5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgVGV4dEdyYXBoaWMuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vVGV4dEdyYXBoaWMuRm9udC5cclxuICAgICAgICAgICAgVGV4dEltYWdlLlN0eWxlLkltYWdlUmVuZGVyaW5nID0gSW1hZ2VSZW5kZXJpbmcuUGl4ZWxhdGVkO1xyXG4gICAgICAgICAgICBUZXh0R3JhcGhpYy5GaWxsU3R5bGUgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgUmVkcmF3QmFzZVRleHRJbWFnZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBVcGRhdGVGb250KCk7XHJcbiAgICAgICAgICAgIHN0cmluZ1tdIGxpbmVzID0gX1RleHQuU3BsaXQoJ1xcbicpO1xyXG4gICAgICAgICAgICBmbG9hdCBIID0gRm9udFNpemUgKiAxZjtcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBpbnQgVyA9IDA7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsaW5lcy5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRleHRNZXRyaWNzIFRNID0gVGV4dEdyYXBoaWMuTWVhc3VyZVRleHQobGluZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgVyA9IE1hdGguTWF4KFcsKGludClNYXRoLkNlaWxpbmcoVE0uV2lkdGgpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL1RleHRJbWFnZS5IZWlnaHQgPSAoaW50KShIICogKGxpbmVzLkxlbmd0aCswLjVmKSk7XHJcbiAgICAgICAgICAgIFRleHRJbWFnZS5IZWlnaHQgPSAoaW50KShIICogKGxpbmVzLkxlbmd0aCArIDAuMjVmKSk7XHJcbiAgICAgICAgICAgIFRleHRJbWFnZS5XaWR0aCA9IFc7XHJcbiAgICAgICAgICAgIFVwZGF0ZUZvbnQoKTtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IFkgPSAwO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsaW5lcy5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRleHRHcmFwaGljLkZpbGxUZXh0KGxpbmVzW2ldLCAwLCAoaW50KShGb250U2l6ZStZKSk7XHJcbiAgICAgICAgICAgICAgICBZICs9IEg7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRleHRJbnZhbGxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaW1hZ2VJbnZhbGxpZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdm9pZCBSZW5kZXJUZXh0SW1hZ2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChfc2hhZG93Qmx1ciA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVCdWZmZXIuV2lkdGggPSBUZXh0SW1hZ2UuV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVCdWZmZXIuSGVpZ2h0ID0gVGV4dEltYWdlLkhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGludCBTID0gKGludClNYXRoLkNlaWxpbmcoX3NoYWRvd0JsdXIgKyBfc2hhZG93Qmx1cik7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVCdWZmZXIuV2lkdGggPSBUZXh0SW1hZ2UuV2lkdGggKyBTO1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlQnVmZmVyLkhlaWdodCA9IFRleHRJbWFnZS5IZWlnaHQgKyBTO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwcml0ZUdyYXBoaWNzLlNoYWRvd0JsdXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgc3ByaXRlR3JhcGhpY3MuR2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gQ2FudmFzVHlwZXMuQ2FudmFzQ29tcG9zaXRlT3BlcmF0aW9uVHlwZS5Tb3VyY2VPdmVyO1xyXG4gICAgICAgICAgICAvKnNwcml0ZUdyYXBoaWNzLkZpbGxTdHlsZSA9IF9UZXh0Q29sb3I7XHJcbiAgICAgICAgICAgIHNwcml0ZUdyYXBoaWNzLkZpbGxSZWN0KDAsIDAsIHNwcml0ZUJ1ZmZlci5XaWR0aCwgc3ByaXRlQnVmZmVyLkhlaWdodCk7XHJcbiAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcInRoaXMuc3ByaXRlR3JhcGhpY3MuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLWluJ1wiKTsqL1xyXG4gICAgICAgICAgICBpZiAoX3NoYWRvd0JsdXIgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlR3JhcGhpY3MuRHJhd0ltYWdlKFRleHRJbWFnZSwgMGYsIDBmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNwcml0ZUdyYXBoaWNzLkRyYXdJbWFnZShUZXh0SW1hZ2UsIF9zaGFkb3dCbHVyLCBfc2hhZG93Qmx1cik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChfc2hhZG93Qmx1cj4wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLy9zcHJpdGVHcmFwaGljcy5HbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBDYW52YXNUeXBlcy5DYW52YXNDb21wb3NpdGVPcGVyYXRpb25UeXBlLlNvdXJjZU92ZXI7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVHcmFwaGljcy5TaGFkb3dCbHVyID0gX3NoYWRvd0JsdXI7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVHcmFwaGljcy5TaGFkb3dDb2xvciA9IF9zaGFkb3dDb2xvcjtcclxuICAgICAgICAgICAgICAgIHNwcml0ZUdyYXBoaWNzLlNoYWRvd09mZnNldFggPSBfc2hhZG93T2Zmc2V0Llg7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVHcmFwaGljcy5TaGFkb3dPZmZzZXRZID0gX3NoYWRvd09mZnNldC5ZO1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlR3JhcGhpY3MuRHJhd0ltYWdlKHNwcml0ZUJ1ZmZlciwgMGYsIDBmKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBpbWFnZUludmFsbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBGb3JjZVVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGV4dEludmFsbGlkYXRlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVkcmF3QmFzZVRleHRJbWFnZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbWFnZUludmFsbGlkYXRlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVuZGVyVGV4dEltYWdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgRHJhdyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEZvcmNlVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGJhc2UuRHJhdyhnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVGlsZTogRW50aXR5XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGludCB0aWxlO1xyXG4gICAgICAgIHB1YmxpYyBUaWxlKEdhbWUgZ2FtZSxpbnQgdGlsZSk6YmFzZShnYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy50aWxlID0gdGlsZTtcclxuICAgICAgICAgICAgQW5pID0gbmV3IEFuaW1hdGlvbihBbmltYXRpb25Mb2FkZXIuR2V0KFwiaW1hZ2VzL2xhbmQvYnJpY2tcIikpO1xyXG4gICAgICAgICAgICBBbmkuQ3VycmVudEZyYW1lID0gdGlsZTtcclxuICAgICAgICAgICAgQW5pLkltYWdlU3BlZWQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBEcmF3KENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLyppZiAodGlsZT49MCAmJiB0aWxlIDwgYW5pLmltYWdlcy5Db3VudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYW5pLmN1cnJlbnRGcmFtZSA9IHRpbGU7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBiYXNlLkRyYXcoZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUaXRsZVNjcmVlbjpTcHJpdGVcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVGV4dFNwcml0ZSBUaXRsZTtcclxuXHJcbiAgICAgICAgcHVibGljIFRleHRTcHJpdGUgVmVyc2lvbjtcclxuXHJcbiAgICAgICAgcHVibGljIFRleHRTcHJpdGUgRGVzYztcclxuXHJcbiAgICAgICAgcHVibGljIFRleHRTcHJpdGUgQ29udHJvbHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBUZXh0U3ByaXRlIENyZWRpdHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBCdXR0b25NZW51IG1lbnU7XHJcbiAgICAgICAgcHVibGljIEdhbWUgZ2FtZTtcclxuICAgICAgICBwdWJsaWMgVGl0bGVTY3JlZW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3ByaXRlQnVmZmVyLldpZHRoID0gQXBwLkNhbnZhcy5XaWR0aDtcclxuICAgICAgICAgICAgc3ByaXRlQnVmZmVyLkhlaWdodCA9IChpbnQpKHNwcml0ZUJ1ZmZlci5XaWR0aCAqIEFwcC5UYXJnZXRBc3BlY3QpO1xyXG4gICAgICAgICAgICBUaXRsZSA9IG5ldyBUZXh0U3ByaXRlKCk7XHJcbiAgICAgICAgICAgIFRpdGxlLkZvbnRTaXplID0gKGludCkoc3ByaXRlQnVmZmVyLldpZHRoICogMC4wNmYpO1xyXG4gICAgICAgICAgICAvL1RpdGxlLlRleHQgPSBcIkNpcm5vIGFuZCB0aGUgbXlzdGVyaW91cyB0b3dlclwiO1xyXG4gICAgICAgICAgICBUaXRsZS5UZXh0ID0gQXBwLkdhbWVOYW1lO1xyXG4gICAgICAgICAgICBUaXRsZS5UZXh0Q29sb3IgPSBcIiM3N0ZGRkZcIjtcclxuICAgICAgICAgICAgVGl0bGUuU2hhZG93Q29sb3IgPSBcIiMwMDAwMDBcIjtcclxuICAgICAgICAgICAgVGl0bGUuU2hhZG93T2Zmc2V0ID0gbmV3IFZlY3RvcjIoMiwgMik7XHJcbiAgICAgICAgICAgIFRpdGxlLlNoYWRvd0JsdXIgPSAyO1xyXG5cclxuICAgICAgICAgICAgQ2VudGVyVGV4dFdpdGhGbG9hdHMoVGl0bGUsIDAuNWYsIDAuMDZmKTtcclxuXHJcbiAgICAgICAgICAgIFZlcnNpb24gPSBuZXcgVGV4dFNwcml0ZSgpO1xyXG4gICAgICAgICAgICBWZXJzaW9uLkZvbnRTaXplID0gKGludCkoc3ByaXRlQnVmZmVyLldpZHRoICogMC4wMTZmKTtcclxuICAgICAgICAgICAgVmVyc2lvbi5UZXh0ID0gXCJWZXJzaW9uOlwiK0FwcC5HYW1lVmVyc2lvbjtcclxuICAgICAgICAgICAgVmVyc2lvbi5UZXh0Q29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgVmVyc2lvbi5TaGFkb3dDb2xvciA9IFwiIzAwMDAwMFwiO1xyXG4gICAgICAgICAgICBWZXJzaW9uLlNoYWRvd09mZnNldCA9IG5ldyBWZWN0b3IyKDIsIDIpO1xyXG4gICAgICAgICAgICBWZXJzaW9uLlNoYWRvd0JsdXIgPSAyO1xyXG5cclxuICAgICAgICAgICAgQ2VudGVyVGV4dFdpdGhGbG9hdHMoVmVyc2lvbiwgMC43NWYsIDAuMTFmKTtcclxuXHJcbiAgICAgICAgICAgIC8qVGl0bGUuRm9yY2VVcGRhdGUoKTtcclxuICAgICAgICAgICAgVGl0bGUuUG9zaXRpb24uWSA9IHNwcml0ZUJ1ZmZlci5IZWlnaHQgKiAwLjAxZjtcclxuICAgICAgICAgICAgVGl0bGUuUG9zaXRpb24uWCA9IChzcHJpdGVCdWZmZXIuV2lkdGggLyAyKSAtIChUaXRsZS5zcHJpdGVCdWZmZXIuV2lkdGggLyAyKTsqL1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBEZXNjID0gbmV3IFRleHRTcHJpdGUoKTtcclxuICAgICAgICAgICAgRGVzYy5Gb250U2l6ZSA9IChpbnQpKHNwcml0ZUJ1ZmZlci5XaWR0aCAqIDAuMDMwZik7XHJcbiAgICAgICAgICAgIERlc2MuVGV4dENvbG9yID0gXCIjRkZGRkZGXCI7XHJcbiAgICAgICAgICAgIC8vRGVzYy5UZXh0ID0gXCJDaXJubyBoYXMgZm91bmQgaGVyc2VsZiBpbiBhIHN0cmFuZ2UgZHVuZ2VvbiBmaWxsZWQgd2l0aCBnaG9zdHMhXFxuSGVyIGVuZXJneSBoYXMgYmVlbiBzdG9sZW4sIHJlY2xhaW0gdGhlIGVuZXJneSBvcmJzIHRvIGV4dGVuZCB5b3VyIHRpbWUuXFxuRmluZCB0aGUgYmlnIGtleSB0byB1bmxvY2sgdGhlIGRvb3IuXCI7XHJcbiAgICAgICAgICAgIC8vRGVzYy5UZXh0ID0gXCJDaXJubyBoYXMgZm91bmQgaGVyc2VsZiBpbiBhIHN0cmFuZ2UgZHVuZ2VvbiBmaWxsZWQgd2l0aCBnaG9zdHMhXFxuUmVjbGFpbSB5b3VyIHN0b2xlbiBlbmVyZ3kgc2VhbGVkIGluc2lkZSB0aGUgb3JicyB0byBleHRlbmQgeW91ciB0aW1lLlxcbkZpbmQgdGhlIGdvbGQga2V5IHRvIHVubG9jayB0aGUgZG9vci5cIjtcclxuICAgICAgICAgICAgRGVzYy5UZXh0ID0gXCJDaXJubyBoYXMgZm91bmQgaGVyc2VsZiBpbiBhIHN0cmFuZ2UgdG93ZXIgZmlsbGVkIHdpdGggZ2hvc3RzIVxcblJlY2xhaW0geW91ciBzdG9sZW4gZW5lcmd5IHNlYWxlZCBpbnNpZGUgdGhlIG9yYnMgdG8gZXh0ZW5kIHlvdXIgdGltZS5cXG5SZW1lbWJlciB0aGUgZG9vcidzIGxvY2F0aW9uIGFuZCBzZWFyY2ggZm9yIHRoZSBnb2xkIGtleS5cIjtcclxuICAgICAgICAgICAgRGVzYy5TaGFkb3dDb2xvciA9IFwiIzAwMDAwMFwiO1xyXG4gICAgICAgICAgICBEZXNjLlNoYWRvd09mZnNldCA9IG5ldyBWZWN0b3IyKDIsIDIpO1xyXG4gICAgICAgICAgICBEZXNjLlNoYWRvd0JsdXIgPSAyO1xyXG4gICAgICAgICAgICBDZW50ZXJUZXh0V2l0aEZsb2F0cyhEZXNjLCAwLjVmLCAwLjJmKTtcclxuXHJcbiAgICAgICAgICAgIENvbnRyb2xzID0gbmV3IFRleHRTcHJpdGUoKTtcclxuICAgICAgICAgICAgQ29udHJvbHMuRm9udFNpemUgPSAoaW50KShzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjAyNWYpO1xyXG4gICAgICAgICAgICBDb250cm9scy5UZXh0Q29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgQ29udHJvbHMuVGV4dCA9IFwiQ29udHJvbHM6XFxuTGVmdC9SaWdodD1Nb3ZlXFxuVXAvRG93bj1BaW0oVXAgYWN0aXZhdGVzIGNoZXN0cy9kb29ycylcXG5aPVNob290XFxuWD1KdW1wL01pZC1haXIganVtcFxcbkE9UGxhY2UgYmxvY2sgYmVsb3cgeW91KGNvc3RzIHRpbWUpXCI7XHJcbiAgICAgICAgICAgIENvbnRyb2xzLlNoYWRvd0NvbG9yID0gXCIjMDAwMDAwXCI7XHJcbiAgICAgICAgICAgIENvbnRyb2xzLlNoYWRvd09mZnNldCA9IG5ldyBWZWN0b3IyKDIsIDIpO1xyXG4gICAgICAgICAgICBDb250cm9scy5TaGFkb3dCbHVyID0gMjtcclxuICAgICAgICAgICAgQ2VudGVyVGV4dFdpdGhGbG9hdHMoQ29udHJvbHMsIDAuNWYsIDAuNGYpO1xyXG4gICAgICAgICAgICBDb250cm9scy5Qb3NpdGlvbi5YID0gRGVzYy5Qb3NpdGlvbi5YO1xyXG5cclxuICAgICAgICAgICAgbWVudSA9IG5ldyBCdXR0b25NZW51KHNwcml0ZUJ1ZmZlci5XaWR0aCAqIDAuOGYsIHNwcml0ZUJ1ZmZlci5IZWlnaHQgKiAwLjVmLCAoaW50KShzcHJpdGVCdWZmZXIuV2lkdGgqMC4wNWYpKTtcclxuICAgICAgICAgICAgdmFyIEIgPSBtZW51LkFkZEJ1dHRvbihcIlN0YXJ0IEdhbWVcIik7XHJcbiAgICAgICAgICAgIEIuT25DbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdhbWUuU3RhcnQoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy9tZW51LkZpbmlzaCgpO1xyXG4gICAgICAgICAgICBCLlBvc2l0aW9uLlggKz0gc3ByaXRlQnVmZmVyLldpZHRoICogMC4zOGY7XHJcbiAgICAgICAgICAgIEIuUG9zaXRpb24uWSA9IHNwcml0ZUJ1ZmZlci5IZWlnaHQgKiAwLjdmO1xyXG5cclxuICAgICAgICAgICAgQ3JlZGl0cyA9IG5ldyBUZXh0U3ByaXRlKCk7XHJcbiAgICAgICAgICAgIENyZWRpdHMuRm9udFNpemUgPSAoaW50KShzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjAxNWYpO1xyXG4gICAgICAgICAgICBDcmVkaXRzLlRleHRDb2xvciA9IFwiIzc3RkZGRlwiO1xyXG4gICAgICAgICAgICAvL0NyZWRpdHMuVGV4dCA9IFwiTWFkZSBieTpSU0dtYWtlciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvdWhvdSBQcm9qZWN0IGFuZCBpdCdzIGNoYXJhY3RlcnMgYXJlIG93bmVkIGJ5IFpVTlwiO1xyXG4gICAgICAgICAgICBDcmVkaXRzLlRleHQgPSBcIk1hZGUgYnk6UlNHbWFrZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvdWhvdSBQcm9qZWN0IGFuZCBpdCdzIGNoYXJhY3RlcnMgYXJlIG93bmVkIGJ5IFpVTlwiO1xyXG4gICAgICAgICAgICBDcmVkaXRzLlNoYWRvd0NvbG9yID0gXCIjMDAwMDAwXCI7XHJcbiAgICAgICAgICAgIENyZWRpdHMuU2hhZG93T2Zmc2V0ID0gbmV3IFZlY3RvcjIoMiwgMik7XHJcbiAgICAgICAgICAgIENyZWRpdHMuU2hhZG93Qmx1ciA9IDI7XHJcbiAgICAgICAgICAgIENlbnRlclRleHRXaXRoRmxvYXRzKENyZWRpdHMsIDAuNWYsIDAuOThmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ2VudGVyVGV4dFdpdGhGbG9hdHMoVGV4dFNwcml0ZSBULGZsb2F0IFgsZmxvYXQgWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENlbnRlclRleHQoVCwgbmV3IFZlY3RvcjIoc3ByaXRlQnVmZmVyLldpZHRoICogWCwgc3ByaXRlQnVmZmVyLkhlaWdodCAqIFkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ2VudGVyVGV4dChUZXh0U3ByaXRlIFQsVmVjdG9yMiBMb2NhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFQuRm9yY2VVcGRhdGUoKTtcclxuICAgICAgICAgICAgVC5Qb3NpdGlvbi5YID0gTG9jYXRpb24uWCAtIChULnNwcml0ZUJ1ZmZlci5XaWR0aCAvIDIpO1xyXG4gICAgICAgICAgICBULlBvc2l0aW9uLlkgPSBMb2NhdGlvbi5ZIC0gKFQuc3ByaXRlQnVmZmVyLkhlaWdodCAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBEcmF3KENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5EcmF3KGcpO1xyXG4gICAgICAgICAgICBUaXRsZS5EcmF3KGcpO1xyXG4gICAgICAgICAgICBWZXJzaW9uLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIERlc2MuRHJhdyhnKTtcclxuICAgICAgICAgICAgQ29udHJvbHMuRHJhdyhnKTtcclxuICAgICAgICAgICAgbWVudS5EcmF3KGcpO1xyXG4gICAgICAgICAgICBtZW51LlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBDcmVkaXRzLkRyYXcoZyk7XHJcblxyXG4gICAgICAgICAgICAvL3ZhciBNID0gS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLk1vdXNlUG9zaXRpb24uQ2xvbmUoKTtcclxuICAgICAgICAgICAgdmFyIE0gPSBLZXlib2FyZE1hbmFnZXIuX3RoaXMuQ01vdXNlLkNsb25lKCk7XHJcbiAgICAgICAgICAgIGlmICghQXBwLkRpdi5TdHlsZS5MZWZ0LkNvbnRhaW5zKFwicHhcIikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKk0uWCAtPSBmbG9hdC5QYXJzZShBcHAuRGl2LlN0eWxlLkxlZnQuUmVwbGFjZShcInB4XCIsIFwiXCIpKTsqL1xyXG4gICAgICAgICAgICAvL0NyZWRpdHMuVGV4dCA9IFwiWDpcIiArIE0uWCtcIi9cIisoc3ByaXRlQnVmZmVyLldpZHRoICogMC4xKSArXCIgWTpcIitNLlkrXCIvXCIrKHNwcml0ZUJ1ZmZlci5IZWlnaHQgKiAwLjk2KTtcclxuICAgICAgICAgICAgaWYgKE0uWDxzcHJpdGVCdWZmZXIuV2lkdGgqMC4xNyAmJiBNLlkgPj0gc3ByaXRlQnVmZmVyLkhlaWdodCAqIDAuOTYpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFwcC5EaXYuU3R5bGUuQ3Vyc29yID0gQ3Vyc29yLlBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICBpZiAoS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlRhcHBlZE1vdXNlQnV0dG9ucy5Db250YWlucygwKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBHbG9iYWwuTG9jYXRpb24uSHJlZiA9IFwiaHR0cHM6Ly9yc2dtYWtlci5kZXZpYW50YXJ0LmNvbVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBcHAuRGl2LlN0eWxlLkN1cnNvciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRG9vcktleSA6IENvbGxlY3RhYmxlSXRlbVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBEb29yS2V5KEdhbWUgZ2FtZSkgOiBiYXNlKGdhbWUsIFwiYmlna2V5XCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgbWFnbmV0RGlzdGFuY2UgPSAyMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIG9uQ29sbGVjdGVkKFBsYXllckNoYXJhY3RlciBwbGF5ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL3Rocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICBHYW1lLkRvb3IuT3BlbmVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIEZsb2F0aW5nTWVzc2FnZSBGTSA9IG5ldyBGbG9hdGluZ01lc3NhZ2UoR2FtZSwgXCJEb29yIFVubG9ja2VkIVwiKTtcclxuICAgICAgICAgICAgRk0uVGV4dC5UZXh0Q29sb3IgPSBcIiM3N0ZGRkZcIjtcclxuICAgICAgICAgICAgRk0uUG9zaXRpb24gPSBuZXcgVmVjdG9yMih4ICsgOCwgeSAtIDIwKTtcclxuICAgICAgICAgICAgR2FtZS5BZGRFbnRpdHkoRk0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgR2FtZTpHYW1lU3ByaXRlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFBsYXllckNoYXJhY3RlciBwbGF5ZXI7XHJcbiAgICAgICAgcHVibGljIExpc3Q8RW50aXR5PiBlbnRpdGllcztcclxuICAgICAgICBwdWJsaWMgQ2FtZXJhIGNhbWVyYTtcclxuICAgICAgICBwdWJsaWMgUmVjdGFuZ2xlIHN0YWdlQm91bmRzO1xyXG4gICAgICAgIHB1YmxpYyBUaWxlTWFwIFRNO1xyXG4gICAgICAgIHB1YmxpYyBHYW1lUGxheVNldHRpbmdzIEdhbWVQbGF5U2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHB1YmxpYyBUZXh0U3ByaXRlIFRpbWVyU3ByaXRlO1xyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgZGVmYXVsdFRpbWVSZW1haW5pbmcgPSAxMDAwICogNjAgKiAzOy8vMyBtaW51dGVzXHJcbiAgICAgICAgcHVibGljIGZsb2F0IG1heFRpbWVSZW1haW5pbmcgPSAxMDAwICogNjAgKiA1Oy8vMyBtaW51dGVzXHJcbiAgICAgICAgcHVibGljIGZsb2F0IHRpbWVSZW1haW5pbmc7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHRvdGFsVGltZSA9IDA7XHJcbiAgICAgICAgcHVibGljIGludCBsZXZlbCA9IDA7XHJcbiAgICAgICAgcHVibGljIGJvb2wgcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBib29sIHBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIGNhbWVyYVdhbmRlclBvaW50O1xyXG4gICAgICAgIHB1YmxpYyBUaXRsZVNjcmVlbiBUUztcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgYm9vbCBydW5uaW5nXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYXlpbmcgJiYgIXBhdXNlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBza2lwcmVuZGVyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcHVibGljIFRleHRTcHJpdGUgU2NvcmVTcHJpdGU7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgRUc7XHJcblxyXG4gICAgICAgIHB1YmxpYyBFeGl0RG9vciBEb29yO1xyXG5cclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBLZXk7XHJcbiAgICAgICAgcHVibGljIEdhbWUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2FtZVBsYXlTZXR0aW5ncyA9IG5ldyBHYW1lUGxheVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgIERvb3IgPSBuZXcgRXhpdERvb3IodGhpcyk7XHJcbiAgICAgICAgICAgIHBsYXllciA9IG5ldyBQbGF5ZXJDaGFyYWN0ZXIodGhpcyk7XHJcbiAgICAgICAgICAgIHBsYXllci5IUCA9IDA7XHJcbiAgICAgICAgICAgIHRpbWVSZW1haW5pbmcgPSBkZWZhdWx0VGltZVJlbWFpbmluZztcclxuICAgICAgICAgICAgLy90aW1lUmVtYWluaW5nICo9IDAuMzMzNGYgKiAwLjI1ZjtcclxuXHJcbiAgICAgICAgICAgIC8qdGVzdC5BbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5fdGhpcy5HZXQoXCJpbWFnZXMvY2lybm8vd2Fsa1wiKSk7XHJcbiAgICAgICAgICAgIHRlc3QuQW5pLkltYWdlU3BlZWQgPSAwLjFmOyovXHJcbiAgICAgICAgICAgIGVudGl0aWVzID0gbmV3IExpc3Q8RW50aXR5PigpO1xyXG4gICAgICAgICAgICAvL3N0YWdlQm91bmRzID0gbmV3IFJlY3RhbmdsZSgwLCAwLCA4MDAwLCAzMDAwKTtcclxuICAgICAgICAgICAgLy9zdGFnZUJvdW5kcyA9IG5ldyBSZWN0YW5nbGUoMCwgMCwgNjAwMCwgNDAwMCk7XHJcbiAgICAgICAgICAgIC8vc3RhZ2VCb3VuZHMgPSBuZXcgUmVjdGFuZ2xlKDAsIDAsIDIwMDAsIDE1MDApO1xyXG4gICAgICAgICAgICAvL3N0YWdlQm91bmRzID0gbmV3IFJlY3RhbmdsZSgwLCAwLCAxMDAwLCA3NTApO1xyXG4gICAgICAgICAgICAvL3N0YWdlQm91bmRzID0gbmV3IFJlY3RhbmdsZSgwLCAwLCAyMDAwLCAxMDAwKTtcclxuICAgICAgICAgICAgc3RhZ2VCb3VuZHMgPSBuZXcgUmVjdGFuZ2xlKDAsIDAsIDQwMDAsIDIwMDApO1xyXG4gICAgICAgICAgICBUTSA9IG5ldyBUaWxlTWFwKHRoaXMpO1xyXG4gICAgICAgICAgICBUTS5TZWVkID0gKGludCkoTWF0aC5SYW5kb20oKSAqIDk5OTk5OTk5OTkpO1xyXG4gICAgICAgICAgICAvLy9UTS5HZW5lcmF0ZSgpO1xyXG4gICAgICAgICAgICBUTS5wb3NpdGlvbi5ZID0gMDtcclxuICAgICAgICAgICAgdmFyIFIgPSBzdGFnZUJvdW5kcyAtIFRNLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBSLndpZHRoIC09IFRNLnRpbGVzaXplO1xyXG4gICAgICAgICAgICBSLmhlaWdodCAtPSBUTS50aWxlc2l6ZTtcclxuICAgICAgICAgICAgLy9UTS5EcmF3UmVjdChSKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgcGxheWVyLlBvc2l0aW9uLlkgPSBzdGFnZUJvdW5kcy5oZWlnaHQgLyAzO1xyXG4gICAgICAgICAgICBwbGF5ZXIuUG9zaXRpb24uWCA9IHN0YWdlQm91bmRzLndpZHRoIC8gMjtcclxuXHJcbiAgICAgICAgICAgIEVHID0gSGVscGVyLkdldENvbnRleHQobmV3IEhUTUxDYW52YXNFbGVtZW50KCkpO1xyXG4gICAgICAgICAgICAvL01hcEdlbmVyYXRvci5HZW5lcmF0ZSh0aGlzKTtcclxuICAgICAgICAgICAgLypNYXBHZW5lcmF0b3IuQm94eUdlbmVyYXRlKHRoaXMpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBUTS5EcmF3UmVjdChSKTtcclxuICAgICAgICAgICAgLy9UTS50ZXN0VGV4dHVyZSgpO1xyXG4gICAgICAgICAgICBUTS5BcHBseUJyZWFrYWJsZSgpOyovXHJcbiAgICAgICAgICAgIC8qdmFyIEUgPSBuZXcgRW50aXR5KHRoaXMpO1xyXG4gICAgICAgICAgICBFLkFuaSA9IG5ldyBBbmltYXRpb24oQW5pbWF0aW9uTG9hZGVyLkdldChcIkltYWdlcy9sYW5kL2JyaWNrXCIpKTtcclxuICAgICAgICAgICAgRS55ICs9IDI0O1xyXG4gICAgICAgICAgICBlbnRpdGllcy5BZGQoRSk7XHJcbiAgICAgICAgICAgIHZhciBsbiA9IDEwO1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbG4pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEUgPSBuZXcgRW50aXR5KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgRS5BbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5HZXQoXCJJbWFnZXMvbGFuZC9icmlja1wiKSk7XHJcbiAgICAgICAgICAgICAgICBFLnkgKz0gMjQ7XHJcbiAgICAgICAgICAgICAgICBFLnggKz0gMTYgKiAoaSsxKTtcclxuICAgICAgICAgICAgICAgIGVudGl0aWVzLkFkZChFKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRSA9IG5ldyBFbnRpdHkodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBFLkFuaSA9IG5ldyBBbmltYXRpb24oQW5pbWF0aW9uTG9hZGVyLkdldChcIkltYWdlcy9sYW5kL2JyaWNrXCIpKTtcclxuICAgICAgICAgICAgICAgIEUueSArPSAyNDtcclxuICAgICAgICAgICAgICAgIEUueCArPSAxNiAqIC0oaSArIDEpO1xyXG4gICAgICAgICAgICAgICAgZW50aXRpZXMuQWRkKEUpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9Ki9cclxuXHJcblxyXG4gICAgICAgICAgICAvL2VudGl0aWVzLkFkZCh0ZXN0KTtcclxuICAgICAgICAgICAgQWRkRW50aXR5KERvb3IpO1xyXG4gICAgICAgICAgICAvLy9BZGRFbnRpdHkocGxheWVyKTtcclxuXHJcblxyXG4gICAgICAgICAgICAvL3Nwcml0ZUJ1ZmZlci5XaWR0aCA9IDIwMDtcclxuICAgICAgICAgICAgc3ByaXRlQnVmZmVyLldpZHRoID0gQXBwLkNhbnZhcy5XaWR0aDtcclxuICAgICAgICAgICAgc3ByaXRlQnVmZmVyLkhlaWdodCA9IChpbnQpKHNwcml0ZUJ1ZmZlci5XaWR0aCAqIEFwcC5UYXJnZXRBc3BlY3QpO1xyXG4gICAgICAgICAgICAvKmNhbWVyYS52aWV3cG9ydF93aWR0aCA9IHNwcml0ZUJ1ZmZlci5XaWR0aDtcclxuICAgICAgICAgICAgY2FtZXJhLnZpZXdwb3J0X2hlaWdodCA9IHNwcml0ZUJ1ZmZlci5IZWlnaHQ7Ki9cclxuICAgICAgICAgICAgY2FtZXJhID0gbmV3IENhbWVyYShzcHJpdGVCdWZmZXIuV2lkdGgsIHNwcml0ZUJ1ZmZlci5IZWlnaHQpO1xyXG4gICAgICAgICAgICAvL2NhbWVyYS5TY2FsZSA9IDY7XHJcbiAgICAgICAgICAgIC8vL2NhbWVyYS5TY2FsZSA9IDU7XHJcbiAgICAgICAgICAgIGNhbWVyYS5TY2FsZSA9IDQ7XHJcblxyXG4gICAgICAgICAgICAvL2NhbWVyYS5TY2FsZSA9IDFmO1xyXG4gICAgICAgICAgICBjYW1lcmEuU3RhZ2VCb3VuZHMgPSBzdGFnZUJvdW5kcztcclxuICAgICAgICAgICAgY2FtZXJhLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBjYW1lcmEuaW5zdGF3YXJwID0gdHJ1ZTtcclxuICAgICAgICAgICAgLypzcHJpdGVCdWZmZXIuV2lkdGggPSBBcHAuQ2FudmFzLldpZHRoO1xyXG4gICAgICAgICAgICBzcHJpdGVCdWZmZXIuSGVpZ2h0ID0gQXBwLkNhbnZhcy5IZWlnaHQ7Ki9cclxuICAgICAgICAgICAgc3ByaXRlR3JhcGhpY3MuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvKlBsYWNlQW5kQWRkRW50aXR5KG5ldyBEb29yS2V5KHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgLy93aGlsZSAoaSA8IDExMClcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCAyNClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUGxhY2VBbmRBZGRFbnRpdHkobmV3IE1SR2hvc3R5KHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkrKyA8PSA2KVxyXG4gICAgICAgICAgICAgICAgUGxhY2VBbmRBZGRFbnRpdHkobmV3IE9yYih0aGlzKSk7XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSsrIDw9IDMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBDaGVzdCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICBQbGFjZUFuZEFkZEVudGl0eShuZXcgS2V5SXRlbSh0aGlzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpKysgPD0gMilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUGxhY2VBbmRBZGRFbnRpdHkobmV3IEhlYWxpbmdJdGVtKHRoaXMpKTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIFN0YXJ0TmV4dExldmVsKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgVGltZXJTcHJpdGUgPSBuZXcgVGV4dFNwcml0ZSgpO1xyXG4gICAgICAgICAgICBUaW1lclNwcml0ZS5Gb250U2l6ZSA9IHNwcml0ZUJ1ZmZlci5IZWlnaHQgLyAyNDtcclxuICAgICAgICAgICAgVGltZXJTcHJpdGUuVGV4dCA9IFwiMzowMFwiO1xyXG4gICAgICAgICAgICBUaW1lclNwcml0ZS5UZXh0Q29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgVGltZXJTcHJpdGUuU2hhZG93Q29sb3IgPSBcIiMwMDAwMDBcIjtcclxuICAgICAgICAgICAgVGltZXJTcHJpdGUuU2hhZG93T2Zmc2V0ID0gbmV3IFZlY3RvcjIoMywgMyk7XHJcbiAgICAgICAgICAgIFRpbWVyU3ByaXRlLlNoYWRvd0JsdXIgPSAxO1xyXG5cclxuICAgICAgICAgICAgVGltZXJTcHJpdGUuUG9zaXRpb24uWCA9IHNwcml0ZUJ1ZmZlci5XaWR0aCAqIDAuNDdmO1xyXG4gICAgICAgICAgICBUaW1lclNwcml0ZS5Qb3NpdGlvbi5ZID0gLVRpbWVyU3ByaXRlLkZvbnRTaXplIC8gODtcclxuXHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlID0gbmV3IFRleHRTcHJpdGUoKTtcclxuICAgICAgICAgICAgLy9TY29yZVNwcml0ZS5Gb250U2l6ZSA9IHNwcml0ZUJ1ZmZlci5IZWlnaHQgLyAyNDtcclxuICAgICAgICAgICAgU2NvcmVTcHJpdGUuRm9udFNpemUgPSBzcHJpdGVCdWZmZXIuSGVpZ2h0IC8gMjg7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLlRleHQgPSBcIkxldmVsOjEgU2NvcmU6MFwiO1xyXG4gICAgICAgICAgICBTY29yZVNwcml0ZS5UZXh0Q29sb3IgPSBcIiNGRkZGRkZcIjtcclxuICAgICAgICAgICAgU2NvcmVTcHJpdGUuU2hhZG93Q29sb3IgPSBcIiMwMDAwMDBcIjtcclxuICAgICAgICAgICAgU2NvcmVTcHJpdGUuU2hhZG93T2Zmc2V0ID0gbmV3IFZlY3RvcjIoMywgMyk7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLlNoYWRvd0JsdXIgPSAxO1xyXG5cclxuICAgICAgICAgICAgLy9TY29yZVNwcml0ZS5Qb3NpdGlvbi5YID0gc3ByaXRlQnVmZmVyLldpZHRoICogMC43ZjtcclxuICAgICAgICAgICAgU2NvcmVTcHJpdGUuRm9yY2VVcGRhdGUoKTtcclxuICAgICAgICAgICAgU2NvcmVTcHJpdGUuUG9zaXRpb24uWCA9IChzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjk4ZikgLSBTY29yZVNwcml0ZS5zcHJpdGVCdWZmZXIuV2lkdGg7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLlBvc2l0aW9uLlkgPSAtU2NvcmVTcHJpdGUuRm9udFNpemUgLyA4O1xyXG5cclxuICAgICAgICAgICAgS2V5ID0gQW5pbWF0aW9uTG9hZGVyLkdldChcImltYWdlcy9pdGVtcy9rZXlcIilbMF07XHJcblxyXG4gICAgICAgICAgICBUUyA9IG5ldyBUaXRsZVNjcmVlbigpO1xyXG4gICAgICAgICAgICBUUy5nYW1lID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vUGxheU11c2ljKFwidGhlbWUyXCIpO1xyXG4gICAgICAgICAgICBTZXRNdXNpYygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDbGVhckVudGl0aWVzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBMID0gZW50aXRpZXMuVG9BcnJheSgpO1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgTC5MZW5ndGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBFID0gTFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChFID09IHBsYXllciB8fCBFIGlzIEV4aXREb29yKVxyXG4gICAgICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBFLkFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgUmVtb3ZlRW50aXR5KEUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0TmV4dExldmVsKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENsZWFyRW50aXRpZXMoKTtcclxuICAgICAgICAgICAgbGV2ZWwgKz0gMTtcclxuICAgICAgICAgICAgdmFyIFIgPSBzdGFnZUJvdW5kcyAtIFRNLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBSLndpZHRoIC09IFRNLnRpbGVzaXplO1xyXG4gICAgICAgICAgICBSLmhlaWdodCAtPSBUTS50aWxlc2l6ZTtcclxuICAgICAgICAgICAgVE0uR2VuZXJhdGUoKTtcclxuICAgICAgICAgICAgTWFwR2VuZXJhdG9yLkJveHlHZW5lcmF0ZSh0aGlzKTtcclxuICAgICAgICAgICAgVE0uRHJhd1JlY3QoUik7XHJcbiAgICAgICAgICAgIFRNLkFwcGx5QnJlYWthYmxlKCk7XHJcblxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgLy93aGlsZSAoaSA8IDExMClcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCAyNClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUGxhY2VBbmRBZGRFbnRpdHkobmV3IE1SR2hvc3R5KHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgLy93aGlsZSAoaSsrIDw9IDYpXHJcbiAgICAgICAgICAgIHdoaWxlIChpKysgPD0gNClcclxuICAgICAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBPcmIodGhpcykpO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkrKyA8PSAzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBQbGFjZUFuZEFkZEVudGl0eShuZXcgQ2hlc3QodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgUGxhY2VBbmRBZGRFbnRpdHkobmV3IEtleUl0ZW0odGhpcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSsrIDw9IDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBIZWFsaW5nSXRlbSh0aGlzKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBEb29yS2V5KHRoaXMpKTtcclxuICAgICAgICAgICAgLypQbGFjZUFuZEFkZEVudGl0eShuZXcgRG9vcktleSh0aGlzKSk7XHJcbiAgICAgICAgICAgIFBsYWNlQW5kQWRkRW50aXR5KG5ldyBEb29yS2V5KHRoaXMpKTtcclxuICAgICAgICAgICAgUGxhY2VBbmRBZGRFbnRpdHkobmV3IERvb3JLZXkodGhpcykpO1xyXG4gICAgICAgICAgICBQbGFjZUFuZEFkZEVudGl0eShuZXcgRG9vcktleSh0aGlzKSk7Ki9cclxuXHJcbiAgICAgICAgICAgIHBsYXllci5pbnZpbmNpYmlsaXR5dGltZSA9IDE4MDtcclxuICAgICAgICAgICAgY2FtZXJhLmluc3Rhd2FycCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNraXByZW5kZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAocGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU2V0TXVzaWMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRNdXNpYygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIXBsYXlpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBsYXlNdXNpYyhcInRoZW1lMlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc29uZ3MgPSAyO1xyXG4gICAgICAgICAgICB2YXIgbGV2ZWxzcGVyc29uZyA9IDU7XHJcbiAgICAgICAgICAgIHZhciBTID0gKGludCkobGV2ZWwgLyBsZXZlbHNwZXJzb25nKTtcclxuICAgICAgICAgICAgUyA9IFMgJSBzb25ncztcclxuICAgICAgICAgICAgUGxheU11c2ljKFwidGhlbWVcIiArIChTKzEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgUGxhY2VBbmRBZGRFbnRpdHkoRW50aXR5IEUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBFLlBvc2l0aW9uLkNvcHlGcm9tKE1hcFJvb20uRmluZEFueUVtcHR5U3BvdCgpKTtcclxuICAgICAgICAgICAgQWRkRW50aXR5KEUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN0cmluZyBHZXRUZWFtQ29sb3IoaW50IHRlYW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGVhbSA9PSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIjRkYwMDAwXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGVhbSA9PSAyIHx8IHRlYW0gPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiIzAwMDBGRlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRlYW0gPT0gMylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiI0ZGRkYwMFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBcIiMwMDAwMDBcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgbXV0ZWQgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYmFzZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKHBsYXlpbmcgJiYgS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlRhcHBlZEJ1dHRvbnMuQ29udGFpbnMoMTMpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwYXVzZWQgPSAhcGF1c2VkO1xyXG4gICAgICAgICAgICAgICAgS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlRhcHBlZEJ1dHRvbnMuUmVtb3ZlKDEzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGxheWluZyAmJiBLZXlib2FyZE1hbmFnZXIuX3RoaXMuVGFwcGVkQnV0dG9ucy5Db250YWlucyg3NykpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5fdGhpcy5TdG9wQWxsKCk7XHJcbiAgICAgICAgICAgICAgICBtdXRlZCA9ICFtdXRlZDtcclxuICAgICAgICAgICAgICAgIGlmICghbXV0ZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgU2V0TXVzaWMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEtleWJvYXJkTWFuYWdlci5fdGhpcy5UYXBwZWRCdXR0b25zLlJlbW92ZSg3Nyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwYXVzZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFVwZGF0ZUNvbnRyb2xzKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGkgPCBlbnRpdGllcy5Db3VudClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgRSA9IGVudGl0aWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChFLkFsaXZlKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFFLkFsaXZlKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVtb3ZlRW50aXR5KEUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFVwZGF0ZUNvbGxpc2lvbnMoKTtcclxuICAgICAgICAgICAgICAgIFVwZGF0ZVRpbWUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChwbGF5aW5nICYmIHBsYXllci55IDwgMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3BsYXllciBnbGl0Y2hlZCBvdXQgc29tZWhvdyBtYWtlIGEgbmV3IGxldmVsLlxyXG4gICAgICAgICAgICAgICAgICAgIGxldmVsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgU3RhcnROZXh0TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGltZXJTcHJpdGUuVGV4dCA9IFwiUGF1c2VkXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgRG9HYW1lT3ZlcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIXBsYXlpbmcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChlbnRpdGllcy5Db250YWlucyhwbGF5ZXIpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZW1vdmVFbnRpdHkocGxheWVyKTtcclxuICAgICAgICAgICAgICAgIC8vRG9HYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgU3RhcnROZXh0TGV2ZWwoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZVRpbWUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy90aW1lUmVtYWluaW5nIC09IDE2LjY2NjY3ZjtcclxuICAgICAgICAgICAgaWYgKHBhdXNlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGltZXJTcHJpdGUuVGV4dCA9IFwiUGF1c2VkXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRpbWVSZW1haW5pbmcgPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aW1lUmVtYWluaW5nID0gMDtcclxuICAgICAgICAgICAgICAgIFRpbWVyU3ByaXRlLlRleHQgPSBcIjBcIjtcclxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuSFAgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5IUCAtPSAwLjAwNGY7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIERvR2FtZU92ZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgdG90YWxzZWNvbmRzID0gdGltZVJlbWFpbmluZyAvIDEwMDBmO1xyXG4gICAgICAgICAgICB2YXIgdG90YWxtaW51dGVzID0gdG90YWxzZWNvbmRzIC8gNjA7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWludXRlcyA9IChpbnQpTWF0aC5GbG9vcih0b3RhbG1pbnV0ZXMpO1xyXG4gICAgICAgICAgICB2YXIgc2Vjb25kcyA9ICh0b3RhbHNlY29uZHMgLSAobWludXRlcyAqIDYwKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgUyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChtaW51dGVzID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUyA9IFwiXCIgKyBtaW51dGVzICsgXCI6XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHByZWZpeCA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHByZWZpeCA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvdGFsc2Vjb25kcyA8IDEwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZWZpeCA9IFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFMgPSBTICsgUmVzdHJpY3RMZW5ndGgocHJlZml4K01hdGguTWF4KDAsIHNlY29uZHMpLDQpO1xyXG4gICAgICAgICAgICBUaW1lclNwcml0ZS5UZXh0ID0gUztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBSZXN0cmljdExlbmd0aChzdHJpbmcgcyxpbnQgbGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHMuTGVuZ3RoID4gbGVuZ3RoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcy5TdWJzdHIoMCwgbGVuZ3RoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlQ29sbGlzaW9ucygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PEVudGl0eT4gY29tYmF0YW50cyA9IG5ldyBMaXN0PEVudGl0eT4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OkNpcm5vR2FtZS5FbnRpdHk+KGVudGl0aWVzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eSwgYm9vbD4pKGVudGl0eSA9PiBlbnRpdHkgaXMgSUNvbWJhdGFudCAmJiBlbnRpdHkuQW5pLkN1cnJlbnRJbWFnZSAhPSBudWxsICYmICgoSUNvbWJhdGFudCllbnRpdHkpLkhQID4gMCkpKTtcclxuICAgICAgICAgICAgTGlzdDxFbnRpdHk+IGhhcm1mdWxFbnRpdHkgPSBuZXcgTGlzdDxFbnRpdHk+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpDaXJub0dhbWUuRW50aXR5PihlbnRpdGllcywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OkNpcm5vR2FtZS5FbnRpdHksIGJvb2w+KShlbnRpdHkgPT4gZW50aXR5IGlzIElIYXJtZnVsRW50aXR5ICYmIGVudGl0eS5BbmkuQ3VycmVudEltYWdlICE9IG51bGwpKSk7XHJcbiAgICAgICAgICAgIHZhciBSMiA9IG5ldyBSZWN0YW5nbGUoKTtcclxuICAgICAgICAgICAgdmFyIE9SMiA9IG5ldyBSZWN0YW5nbGUoKTtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGNvbWJhdGFudHMuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEVudGl0eSBFID0gY29tYmF0YW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChFIGlzIElDb21iYXRhbnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgSUNvbWJhdGFudCBFSSA9IChJQ29tYmF0YW50KUU7XHJcbiAgICAgICAgICAgICAgICAgICAgUmVjdGFuZ2xlIFIgPSBFLkdldEhpdGJveCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFZlY3RvcjIgc3BkID0gRS5TcGVlZCAqIDAuNWY7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9SZWN0YW5nbGUgUjIgPSBuZXcgUmVjdGFuZ2xlKFIueCAtIChzcGQuWCksIFIueSAtIChzcGQuWSksIFIud2lkdGgsIFIuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBSMi5TZXQoUi54IC0gKHNwZC5YKSwgUi55IC0gKHNwZC5ZKSwgUi53aWR0aCwgUi5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vTGlzdDxFbnRpdHk+IEwgPSBuZXcgTGlzdDxFbnRpdHk+KGhhcm1mdWxFbnRpdHkuV2hlcmUoZW50aXR5ID0+IGVudGl0eSAhPSBFICYmIGVudGl0eS5HZXRIaXRib3goKS5pc1RvdWNoaW5nKFIpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9MaXN0PEVudGl0eT4gTCA9IG5ldyBMaXN0PEVudGl0eT4oaGFybWZ1bEVudGl0eS5XaGVyZShlbnRpdHkgPT4gZW50aXR5ICE9IEUgJiYgKChJQ29tYmF0YW50KSgoSUhhcm1mdWxFbnRpdHkpZW50aXR5KS5BdHRhY2tlcikuVGVhbSAhPSBFSS5UZWFtKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgTGlzdDxFbnRpdHk+IEwgPSBuZXcgTGlzdDxFbnRpdHk+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpDaXJub0dhbWUuRW50aXR5PihoYXJtZnVsRW50aXR5LChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6Q2lybm9HYW1lLkVudGl0eSwgYm9vbD4pKGVudGl0eSA9PiBlbnRpdHkgIT0gRSAmJiAhKChJSGFybWZ1bEVudGl0eSllbnRpdHkpLkF0dGFja2VyLlNhbWVUZWFtKChFbnRpdHkpRUkpKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGludCBqID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IEwuQ291bnQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBFbnRpdHkgdG1wID0gTFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgSUhhcm1mdWxFbnRpdHkgSEUgPSAoSUhhcm1mdWxFbnRpdHkpdG1wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWN0YW5nbGUgT1IgPSB0bXAuR2V0SGl0Ym94KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFZlY3RvcjIgc3BkMiA9IHRtcC5TcGVlZCAqIDAuNWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vUmVjdGFuZ2xlIE9SMiA9IG5ldyBSZWN0YW5nbGUoT1IueCAtIChzcGQyLlgpLCBPUi55IC0gKHNwZDIuWSksIE9SLndpZHRoLCBPUi5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPUjIuU2V0KE9SLnggLSAoc3BkMi5YKSwgT1IueSAtIChzcGQyLlkpLCBPUi53aWR0aCwgT1IuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiAoRUkuVGVhbSAhPSAoKElDb21iYXRhbnQpSEUuQXR0YWNrZXIpLlRlYW0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoUi5pc1RvdWNoaW5nKE9SKSB8fCBSMi5pc1RvdWNoaW5nKE9SMikpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEhFLm9udG91Y2hEYW1hZ2UoRUkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgTEhQID0gRUkuSFA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVJLm9uRGFtYWdlZChIRSxIRS50b3VjaERhbWFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKExIUCA+IEVJLkhQKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChFbnRpdHkpRUkpLlBsYXlTb3VuZChcImhpdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChFSS5IUDw9MClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCgoRW50aXR5KUVJKS5IYW5kbGVkTG9jYWxseSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkeW5hbWljIEQgPSBuZXcgb2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRC5JID0gKChFbnRpdHkpRUkpLklEO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEQuQSA9ICgoRW50aXR5KUhFLkF0dGFja2VyKS5JRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBELlMgPSAoKEVudGl0eSlIRSkuSUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VuZEV2ZW50KFwiS2lsbFwiLCBEKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEF0dGFjaygoSUNvbWJhdGFudClFSSwgKElIYXJtZnVsRW50aXR5KUhFKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qTGlzdDxFbnRpdHk+IEwgPSBuZXcgTGlzdDxFbnRpdHk+KGNvbWJhdGFudHMuV2hlcmUoZW50aXR5ID0+IGVudGl0eSAhPSBFICYmIGVudGl0eSBpcyBJQ29tYmF0YW50ICYmIGVudGl0eS5HZXRIaXRib3goKS5pbnRlcnNlY3RzKFIpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IGogPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgTC5Db3VudClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBqKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQXR0YWNrKElDb21iYXRhbnQgdGFyZ2V0LCBJSGFybWZ1bEVudGl0eSBzb3VyY2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0LkhQID4gMCAmJiBzb3VyY2Uub250b3VjaERhbWFnZSh0YXJnZXQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQub25EYW1hZ2VkKHNvdXJjZSwgc291cmNlLnRvdWNoRGFtYWdlKTtcclxuICAgICAgICAgICAgICAgICgoRW50aXR5KXRhcmdldCkuUGxheVNvdW5kKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5IUCA8PSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoKEVudGl0eSl0YXJnZXQpLkhhbmRsZWRMb2NhbGx5KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHluYW1pYyBEID0gbmV3IG9iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBELkkgPSAoKEVudGl0eSl0YXJnZXQpLklEO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBELkEgPSAoKEVudGl0eSlzb3VyY2UuQXR0YWNrZXIpLklEO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBELlMgPSAoKEVudGl0eSlzb3VyY2UpLklEO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTZW5kRXZlbnQoXCJLaWxsXCIsIEQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBQbGF5U291bmRFZmZlY3QoVmVjdG9yMiBzb3VyY2UsIHN0cmluZyBzb3VuZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChtdXRlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZsb2F0IHZvbCA9IDFmO1xyXG4gICAgICAgICAgICAvKmZsb2F0IG1pbiA9IDY0MDtcclxuICAgICAgICAgICAgZmxvYXQgbWF4TGVuZ3RoID0gMzIwOyovXHJcbiAgICAgICAgICAgIC8vZmxvYXQgbWluID0gNzAwO1xyXG4gICAgICAgICAgICBmbG9hdCBtaW4gPSA1MDtcclxuICAgICAgICAgICAgZmxvYXQgbWF4TGVuZ3RoID0gMjAwO1xyXG4gICAgICAgICAgICBpZiAoc291cmNlICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vZmxvYXQgZGlzdCA9IChjYW1lcmEuQ2VudGVyIC0gc291cmNlKS5Sb3VnaExlbmd0aDtcclxuICAgICAgICAgICAgICAgIC8vZmxvYXQgZGlzdCA9IChjYW1lcmEuQ2VudGVyIC0gc291cmNlKS5MZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBkaXN0ID0gY2FtZXJhLkNlbnRlci5Fc3RpbWF0ZWREaXN0YW5jZShzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgZGlzdCAtPSBtaW47XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlzdCA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3QgPj0gbWF4TGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy92b2x1bWUgb2YgMCwganVzdCBkb24ndCBwbGF5IGl0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZvbCA9IDFmIC0gKGRpc3QgLyBtYXhMZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuX3RoaXMuQmxhc3QoXCJTRlgvXCIgKyBzb3VuZCArIFwiLm9nZ1wiLCB2b2wpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkRW50aXR5KEVudGl0eSBFKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZW50aXRpZXMuQWRkKEUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVFbnRpdHkoRW50aXR5IEUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBFLm9uUmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIGVudGl0aWVzLlJlbW92ZShFKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgUmVuZGVyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuUmVuZGVyKCk7XHJcblxyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZyA9IHNwcml0ZUdyYXBoaWNzO1xyXG4gICAgICAgICAgICBpZiAoc2tpcHJlbmRlcilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZyA9IEVHO1xyXG4gICAgICAgICAgICAgICAgc2tpcHJlbmRlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFVwZGF0ZUNhbWVyYSgpO1xyXG4gICAgICAgICAgICBEcmF3QmFja2dyb3VuZChnKTtcclxuXHJcbiAgICAgICAgICAgIGcuU2F2ZSgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FtZXJhLkFwcGx5KGcpO1xyXG4gICAgICAgICAgICAvL1RNLnBvc2l0aW9uLlkgPSAtMjAwO1xyXG4gICAgICAgICAgICBUTS5EcmF3KGcpO1xyXG4gICAgICAgICAgICBlbnRpdGllcy5Gb3JFYWNoKChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpDaXJub0dhbWUuRW50aXR5PikoRSA9PiB7IGlmIChFLkFsaXZlICYmIEUuVmlzaWJsZSkgeyBFLkRyYXcoZyk7IH0gfSkpO1xyXG5cclxuICAgICAgICAgICAgZy5SZXN0b3JlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVuZGVyR1VJKGcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IDAuM2Y7XHJcbiAgICAgICAgICAgICAgICBnLkZpbGxTdHlsZSA9IFwiIzAwMDAwMFwiO1xyXG4gICAgICAgICAgICAgICAgZy5GaWxsUmVjdCgwLCAwLCBzcHJpdGVCdWZmZXIuV2lkdGgsIHNwcml0ZUJ1ZmZlci5IZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IDFmO1xyXG4gICAgICAgICAgICAgICAgVFMuRHJhdyhnKTtcclxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuc2NvcmUgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFNjb3JlU3ByaXRlLlRleHQgPSBcIkxldmVsOlwiICsgbGV2ZWwgKyBcIiBTY29yZTpcIiArIHBsYXllci5zY29yZTtcclxuICAgICAgICAgICAgICAgICAgICBTY29yZVNwcml0ZS5Gb3JjZVVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNjb3JlU3ByaXRlLlBvc2l0aW9uLlggPSAoc3ByaXRlQnVmZmVyLldpZHRoICogMC45OGYpIC0gU2NvcmVTcHJpdGUuc3ByaXRlQnVmZmVyLldpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIFNjb3JlU3ByaXRlLkRyYXcoZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChlbnRpdGllcy5Db250YWlucyhwbGF5ZXIpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZW1vdmVFbnRpdHkocGxheWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbGF5ZXIgPSBuZXcgUGxheWVyQ2hhcmFjdGVyKHRoaXMpO1xyXG4gICAgICAgICAgICBBZGRFbnRpdHkocGxheWVyKTtcclxuICAgICAgICAgICAgcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGxldmVsID0gMDtcclxuICAgICAgICAgICAgU3RhcnROZXh0TGV2ZWwoKTtcclxuICAgICAgICAgICAgQXBwLkRpdi5TdHlsZS5DdXJzb3IgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdG90YWxUaW1lID0gMDtcclxuICAgICAgICAgICAgdGltZVJlbWFpbmluZyA9IGRlZmF1bHRUaW1lUmVtYWluaW5nO1xyXG4gICAgICAgICAgICAvL3RpbWVSZW1haW5pbmcgKj0gMC4zMzM0ZiAqIDAuMjVmO1xyXG4gICAgICAgICAgICAvKnRpbWVSZW1haW5pbmcgKj0gMC4zMzM0ZiAqIDAuMDVmO1xyXG4gICAgICAgICAgICBwbGF5ZXIuSFAgPSA1OyovXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBQbGF5TXVzaWMoc3RyaW5nIHNvbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobXV0ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIEF1ZGlvIE0gPSBBdWRpb01hbmFnZXIuX3RoaXMuR2V0KFwiQkdNL1wiICsgc29uZyArIFwiLm9nZ1wiKTtcclxuICAgICAgICAgICAgaWYgKCFNLklzUGxheWluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLl90aGlzLlN0b3BBbGxGcm9tRGlyZWN0b3J5KFwiQkdNL1wiKTtcclxuICAgICAgICAgICAgICAgIC8vTS5Wb2x1bWUgPSAwLjM1O1xyXG4gICAgICAgICAgICAgICAgTS5Wb2x1bWUgPSAwLjM1O1xyXG4gICAgICAgICAgICAgICAgTS5Mb29wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIE0uUGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlbmRlckdVSShDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBQQyA9IChQbGF5ZXJDaGFyYWN0ZXIpcGxheWVyO1xyXG4gICAgICAgICAgICB2YXIgY29sb3IgPSBcIiMwMEREMDBcIjtcclxuICAgICAgICAgICAgaWYgKHRpbWVSZW1haW5pbmcgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBcIiNGRjAwMDBcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IDAuOGY7XHJcbiAgICAgICAgICAgIERyYXdHYXVnZShnLCBuZXcgVmVjdG9yMigwLCAwKSwgbmV3IFZlY3RvcjIoc3ByaXRlQnVmZmVyLldpZHRoIC8gNCwgc3ByaXRlQnVmZmVyLkhlaWdodCAvIDIwKSwgNSwgUEMuSFAgLyBQQy5tYXhIUCwgY29sb3IpO1xyXG4gICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gMTtcclxuXHJcbiAgICAgICAgICAgIFRpbWVyU3ByaXRlLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLlRleHQgPSBcIkxldmVsOlwiICsgbGV2ZWwgKyBcIiBTY29yZTpcIiArIHBsYXllci5zY29yZTtcclxuICAgICAgICAgICAgU2NvcmVTcHJpdGUuRm9yY2VVcGRhdGUoKTtcclxuICAgICAgICAgICAgU2NvcmVTcHJpdGUuUG9zaXRpb24uWCA9IChzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjk4ZikgLSBTY29yZVNwcml0ZS5zcHJpdGVCdWZmZXIuV2lkdGg7XHJcbiAgICAgICAgICAgIFNjb3JlU3ByaXRlLkRyYXcoZyk7XHJcbiAgICAgICAgICAgIFJlbmRlckljb25zKGcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW5kZXJJY29ucyhDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBSID0gS2V5LkhlaWdodCAvIEtleS5XaWR0aDtcclxuICAgICAgICAgICAgdmFyIFcgPSBzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjAyZjtcclxuICAgICAgICAgICAgdmFyIEggPSBzcHJpdGVCdWZmZXIuSGVpZ2h0ICogMC4wNTVmO1xyXG5cclxuICAgICAgICAgICAgdmFyIFkgPSBIO1xyXG4gICAgICAgICAgICB2YXIgWCA9IFcgLyAyO1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIC8vdmFyIHN6ID0gc3ByaXRlQnVmZmVyLldpZHRoICogMC4wMTVmO1xyXG4gICAgICAgICAgICB2YXIgc3ogPSBzcHJpdGVCdWZmZXIuV2lkdGggKiAwLjAxMTVmO1xyXG4gICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gMC44ZjtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBwbGF5ZXIua2V5cylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZy5EcmF3SW1hZ2UoS2V5LCBYLCBZLCBzeiwgc3ogKiBSKTtcclxuICAgICAgICAgICAgICAgIFggKz0gVztcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gMWY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXdHYXVnZShDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgZywgVmVjdG9yMiBwb3NpdGlvbiwgVmVjdG9yMiBzaXplLCBpbnQgYm9yZGVyLCBmbG9hdCBwcm9ncmVzcywgc3RyaW5nIGNvbG9yLCBib29sIGRyYXdib3JkZXIgPSB0cnVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGFscGhhID0gZy5HbG9iYWxBbHBoYTtcclxuICAgICAgICAgICAgaWYgKGRyYXdib3JkZXIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGcuR2xvYmFsQWxwaGEgPSAwLjZmICogYWxwaGE7XHJcbiAgICAgICAgICAgICAgICBnLkZpbGxTdHlsZSA9IFwiIzAwMDAwMFwiO1xyXG5cclxuICAgICAgICAgICAgICAgIGcuRmlsbFJlY3QoKGludClwb3NpdGlvbi5YLCAoaW50KXBvc2l0aW9uLlksIChpbnQpc2l6ZS5YLCAoaW50KXNpemUuWSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGcuRmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgICAgIGcuR2xvYmFsQWxwaGEgPSAxLjBmICogYWxwaGE7XHJcbiAgICAgICAgICAgIGcuRmlsbFJlY3QoKGludClwb3NpdGlvbi5YICsgYm9yZGVyLCAoaW50KXBvc2l0aW9uLlkgKyBib3JkZXIsIChpbnQpKChzaXplLlggLSAoYm9yZGVyICsgYm9yZGVyKSkgKiBwcm9ncmVzcyksIChpbnQpc2l6ZS5ZIC0gKGJvcmRlciArIGJvcmRlcikpO1xyXG5cclxuICAgICAgICAgICAgZy5HbG9iYWxBbHBoYSA9IDAuNWYgKiBhbHBoYTtcclxuICAgICAgICAgICAgLy9TY3JpcHQuV3JpdGUoXCJ2YXIgZ3JkID0gZy5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCBzaXplLnkpO2dyZC5hZGRDb2xvclN0b3AoMCwgY29sb3IpO2dyZC5hZGRDb2xvclN0b3AoMC40LCBcXFwid2hpdGVcXFwiKTtncmQuYWRkQ29sb3JTdG9wKDEsIGNvbG9yKTtnLmZpbGxTdHlsZSA9IGdyZDtcIik7XHJcbiAgICAgICAgICAgIHZhciBncmQgPSBnLkNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHNpemUuWSk7XHJcbiAgICAgICAgICAgIGdyZC5BZGRDb2xvclN0b3AoMCwgY29sb3IpO1xyXG4gICAgICAgICAgICBncmQuQWRkQ29sb3JTdG9wKDAuNCwgXCJ3aGl0ZVwiKTtcclxuICAgICAgICAgICAgZ3JkLkFkZENvbG9yU3RvcCgxLCBjb2xvcik7XHJcbiAgICAgICAgICAgIGcuRmlsbFN0eWxlID0gZ3JkO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGcuRmlsbFJlY3QoKGludClwb3NpdGlvbi5YICsgYm9yZGVyLCAoaW50KXBvc2l0aW9uLlkgKyBib3JkZXIsIChpbnQpKChzaXplLlggLSAoYm9yZGVyICsgYm9yZGVyKSkgKiBwcm9ncmVzcyksIChpbnQpc2l6ZS5ZIC0gKGJvcmRlciArIGJvcmRlcikpO1xyXG4gICAgICAgICAgICBnLkdsb2JhbEFscGhhID0gYWxwaGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIFNob3dIaXRib3ggPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgdm9pZCBTZW5kRXZlbnQoc3RyaW5nIGV2ZW50TmFtZSwgZHluYW1pYyBkYXRhLCBib29sIHRyaWdnZXJmbHVzaCA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZHluYW1pYyBEID0gbmV3IG9iamVjdCgpO1xyXG4gICAgICAgICAgICBELkUgPSBldmVudE5hbWU7XHJcbiAgICAgICAgICAgIEQuRCA9IGRhdGE7XHJcbiAgICAgICAgICAgIC8qTmV0UGxheVVzZXIgTlUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoT25saW5lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBOUC5TZW5kKEQpO1xyXG4gICAgICAgICAgICAgICAgTlUgPSBOUC5NZTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIC8vUHJvY2Vzc0V2ZW50KEQsIE5VLCAwKTtcclxuICAgICAgICAgICAgUHJvY2Vzc0V2ZW50KEQpO1xyXG4gICAgICAgICAgICAvKmlmICh0cmlnZ2VyZmx1c2gpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIE5ldFBsYXlOZWVkc0ZsdXNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFByb2Nlc3NFdmVudChkeW5hbWljIG1zZywgLypOZXRQbGF5VXNlciovb2JqZWN0IHVzZXI9bnVsbCwgZmxvYXQgbGF0ZW5jeT0wKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZHluYW1pYyBEID0gbXNnLkQ7XHJcbiAgICAgICAgICAgIC8qTGlzdDxQbGF5ZXI+IExQID0gbmV3IExpc3Q8UGxheWVyPihwbGF5ZXJzLldoZXJlKHBsYXllciA9PiB1c2VyICE9IG51bGwgJiYgcGxheWVyLk5ldHdvcmtJRCA9PSB1c2VyLnVzZXJJRCkpO1xyXG4gICAgICAgICAgICBQbGF5ZXIgUCA9IG51bGw7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBib29sIGhhc2NoYXJhY3RlciA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChMUC5Db3VudCA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoUCA9PSBudWxsICYmIHVzZXIgPT0gbnVsbCAmJiAhT25saW5lKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFAgPSBsb2NhbHBsYXllcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlci5Jc01lKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxwbGF5ZXIuTmV0d29ya0lEID0gdXNlci51c2VySUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFAgPSBsb2NhbHBsYXllcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzY2hhcmFjdGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUCA9IExQWzBdO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgc3RyaW5nIGV2dCA9IG1zZy5FO1xyXG4gICAgICAgICAgICAvKmlmICh1c2VyICE9IG51bGwgJiYgIXVzZXIuSXNNZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRGxhdGVuY3kgKz0gbGF0ZW5jeTtcclxuICAgICAgICAgICAgICAgIC8vbGF0ZW5jeSAqPSAwLjk5ZjtcclxuICAgICAgICAgICAgICAgIERsYXRlbmN5ICo9ICgxIC0gKDEgLyBsYXRlbmN5TSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vaWYgKG1zZy5FID09IFwiSW5pdFwiICYmICFQLmxvY2FsKVxyXG4gICAgICAgICAgICBpZiAoZXZ0ID09IFwiSW5pdFwiICYmIFAgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNjaGFyYWN0ZXIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUCA9IG5ldyBQbGF5ZXIoZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBQLk5ldHdvcmtJRCA9IHVzZXIudXNlcklEO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vUGxheWVyQ2hhcmFjdGVyIFBDID0gbmV3IFBsYXllckNoYXJhY3Rlcih0aGlzLCBQLCBcIlJlaXNlblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBQbGF5ZXJDaGFyYWN0ZXIgUEMgPSBuZXcgUGxheWVyQ2hhcmFjdGVyKHRoaXMsIFAsIEQuQyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9QQy5UZWFtID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBQQy5UZWFtID0gRC5UO1xyXG4gICAgICAgICAgICAgICAgICAgIFBDLnggPSA3MDA7XHJcbiAgICAgICAgICAgICAgICAgICAgUEMueSA9IDI0MDtcclxuICAgICAgICAgICAgICAgICAgICBQQy5JRCA9IEQuSTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJzLkFkZChQKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRFbnRpdHkoUEMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChIb3N0ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTZW5kRXZlbnQoXCJNYXBTZWVkXCIsIFRNLlNlZWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgTGlzdDxFbnRpdHk+IEwgPSBuZXcgTGlzdDxFbnRpdHk+KGVudGl0aWVzLldoZXJlKEUgPT4gRSBpcyBNYWRuZXNzT3JiIHx8IChFIGlzIFBsYXllckNoYXJhY3RlciAmJiAoKFBsYXllckNoYXJhY3RlcilFKS5wbGF5ZXIuQ1BVKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnQgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgTC5Db3VudClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VuZEVudGl0eVNwYXduQ2hlY2soTFtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJVc2VyOlwiICsgUC5OZXR3b3JrSUQgKyBcIiBoYXMgam9pbmVkIVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXZ0ID09IFwiU3Bhd25cIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRW50aXR5IEUgPSBFbnRpdHlGcm9tSUQoRC5JKTtcclxuICAgICAgICAgICAgICAgIGlmIChFID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVHlwZSBUID0gSGVscGVyLkdldFR5cGUoRC5UKTtcclxuICAgICAgICAgICAgICAgICAgICBFID0gQWN0aXZhdG9yLkNyZWF0ZUluc3RhbmNlKFQsIHRoaXMpLlRvRHluYW1pYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIEUuSUQgPSBELkk7XHJcbiAgICAgICAgICAgICAgICAgICAgRS54ID0gRC5YO1xyXG4gICAgICAgICAgICAgICAgICAgIEUueSA9IEQuWTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEQuRClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEhlbHBlci5Db3B5RmllbGRzKEQuRCwgRSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEFkZEVudGl0eShFKTtcclxuICAgICAgICAgICAgICAgICAgICBDYXRjaHVwRW50aXR5KEUsIGxhdGVuY3kpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQWN0aXZhdG9yLkNyZWF0ZUluc3RhbmNlKClcclxuICAgICAgICAgICAgICAgICAgICAvL1N5c3RlbS5SZWZsZWN0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vVHlwZSBUID0gVHlwZS5HZXRUeXBlKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQgPT0gXCJVbnBhdXNlXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJHYW1lIHVucGF1c2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgU2VuZEluaXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXZ0ID09IFwiTWFwU2VlZFwiICYmICFIb3N0ZXIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChUTS5TZWVkICE9IEQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVE0uU2VlZCA9IEQ7XHJcbiAgICAgICAgICAgICAgICAgICAgVE0uR2VuZXJhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NsZWFuIHVwIGxvY2FsIGNsaWVudCBlbnRpdGllcy5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbm5lY3RlZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGkgPCBlbnRpdGllcy5Db3VudClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVudGl0aWVzW2ldIGlzIE1hZG5lc3NPcmIgfHwgKGVudGl0aWVzW2ldIGlzIFBsYXllckNoYXJhY3RlciAmJiAoKFBsYXllckNoYXJhY3RlcillbnRpdGllc1tpXSkucGxheWVyLkNQVSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVtb3ZlRW50aXR5KGVudGl0aWVzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQgPT0gXCJDRVwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBFbnRpdHkgZW50aXR5ID0gRW50aXR5RnJvbUlEKEQuSSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LkN1c3RvbUV2ZW50KEQuRCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGV2dCA9PSBcIkNCRVwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBFbnRpdHkgZW50aXR5ID0gRW50aXR5RnJvbUlEKEQuSSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgRW50aXR5QmVoYXZpb3IgYiA9IGVudGl0eS5HZXRCZWhhdmlvckZyb21OYW1lKEQuVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYi5DdXN0b21FdmVudChELkQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZW50aXR5LkN1c3RvbUV2ZW50KEQuRCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBpZiAoZXZ0ID09IFwiS2lsbFwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBFbnRpdHkgZW50aXR5ID0gRW50aXR5RnJvbUlEKEQuSSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgRW50aXR5IGF0dGFja2VyID0gRW50aXR5RnJvbUlEKEQuQSk7XHJcbiAgICAgICAgICAgICAgICAgICAgKChJQ29tYmF0YW50KWVudGl0eSkub25EZWF0aChFbnRpdHlGcm9tSUQoRC5TKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGFja2VyICE9IG51bGwgJiYgYXR0YWNrZXIgaXMgUGxheWVyQ2hhcmFjdGVyKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGxheWVyQ2hhcmFjdGVyIFBDID0gKFBsYXllckNoYXJhY3RlcilhdHRhY2tlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9QQy5wbGF5ZXIuU2NvcmUgKz0gKChJQ29tYmF0YW50KWVudGl0eSkuUG9pbnRzRm9yS2lsbGluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEMuc2NvcmUgKz0gKChJQ29tYmF0YW50KWVudGl0eSkuUG9pbnRzRm9yS2lsbGluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEMub25LaWxsKCgoSUNvbWJhdGFudCllbnRpdHkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEVudGl0eSBFbnRpdHlGcm9tSUQoc3RyaW5nIElEKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGVudGl0aWVzLkNvdW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBFbnRpdHkgRSA9IGVudGl0aWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKEUuSUQgPT0gSUQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIGZyZWVjYW0gPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGVDYW1lcmEoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9mbG9hdCBEID0gdGVzdC5Ic3BlZWQgKiAxODtcclxuICAgICAgICAgICAgLy9mbG9hdCBEID0gKGZsb2F0KU1hdGguQWJzKHRlc3QuSHNwZWVkKSAqIDk7XHJcbiAgICAgICAgICAgIC8vdmFyIGZyZWVjYW0gPSB0cnVlO1xyXG4gICAgICAgICAgICBjYW1lcmEuc3BlZWRtb2QgPSAxZjtcclxuXHJcbiAgICAgICAgICAgIC8qaWYgKEtleWJvYXJkTWFuYWdlci5fdGhpcy5UYXBwZWRCdXR0b25zLkNvbnRhaW5zQig2NykgJiYgQXBwLkRFQlVHKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmcmVlY2FtID0gIWZyZWVjYW07XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBpZiAoZnJlZWNhbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwZCA9IDE2IC8gY2FtZXJhLlNjYWxlO1xyXG4gICAgICAgICAgICAgICAgdmFyIFBCID0gS2V5Ym9hcmRNYW5hZ2VyLl90aGlzLlByZXNzZWRCdXR0b25zO1xyXG4gICAgICAgICAgICAgICAgLy9udW1wYWQgcGFubmluZ1xyXG4gICAgICAgICAgICAgICAgaWYgKENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkNvbnRhaW5zQjxpbnQ+KFBCLDEwMCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLlRhcmdldFBvc2l0aW9uLlggLT0gc3BkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkNvbnRhaW5zQjxpbnQ+KFBCLDEwMikpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLlRhcmdldFBvc2l0aW9uLlggKz0gc3BkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChDaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Db250YWluc0I8aW50PihQQiwxMDQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5UYXJnZXRQb3NpdGlvbi5ZIC09IHNwZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChDaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Db250YWluc0I8aW50PihQQiw5OCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLlRhcmdldFBvc2l0aW9uLlkgKz0gc3BkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkNvbnRhaW5zQjxpbnQ+KFBCLDEwNykpLy9udW1wYWQrXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIENDID0gY2FtZXJhLkNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBjYW1lcmEuU2NhbGUgKj0gMS4wMWY7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLkNlbnRlciA9IENDO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5UYXJnZXRQb3NpdGlvbi5YID0gY2FtZXJhLlBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLlRhcmdldFBvc2l0aW9uLlkgPSBjYW1lcmEuUG9zaXRpb24uWTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChDaXJub0dhbWUuSGVscGVyRXh0ZW5zaW9ucy5Db250YWluc0I8aW50PihQQiwxMDkpKS8vbnVtcGFkLVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBDQyA9IGNhbWVyYS5DZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLlNjYWxlICo9IDAuOTlmO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5DZW50ZXIgPSBDQztcclxuICAgICAgICAgICAgICAgICAgICBjYW1lcmEuVGFyZ2V0UG9zaXRpb24uWCA9IGNhbWVyYS5Qb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5UYXJnZXRQb3NpdGlvbi5ZID0gY2FtZXJhLlBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoQ2lybm9HYW1lLkhlbHBlckV4dGVuc2lvbnMuQ29udGFpbnNCPGludD4oUEIsMzYpKS8vaG9tZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5DZW50ZXJlZFRhcmdldFBvc2l0aW9uID0gcGxheWVyLlBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKENpcm5vR2FtZS5IZWxwZXJFeHRlbnNpb25zLkNvbnRhaW5zQjxpbnQ+KFBCLDEzKSkvL2VudGVyXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLlBvc2l0aW9uLlggPSBjYW1lcmEuQ2VudGVyLlg7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLlBvc2l0aW9uLlkgPSBjYW1lcmEuQ2VudGVyLlk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwbGF5aW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEuc3BlZWRtb2QgPSAwLjA1ZjtcclxuICAgICAgICAgICAgICAgIGlmIChjYW1lcmEuVGFyZ2V0UG9zaXRpb249PW51bGwgfHwgY2FtZXJhLlBvc2l0aW9uLkVzdGltYXRlZERpc3RhbmNlKGNhbWVyYS5UYXJnZXRQb3NpdGlvbikgPCA0MClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5SYW5kb20oKSA8IDAuMDAzNSB8fCBjYW1lcmEuaW5zdGF3YXJwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FtZXJhLkNlbnRlcmVkVGFyZ2V0UG9zaXRpb24gPSBNYXBSb29tLkZpbmRBbnlFbXB0eVNwb3QoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvKmNhbWVyYS5UYXJnZXRQb3NpdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FtZXJhV2FuZGVyUG9pbnQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYW1lcmFXYW5kZXJQb2ludCA9IE1hcFJvb20uRmluZEFueUVtcHR5U3BvdCgpO1xyXG4gICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgICAgICBjYW1lcmEuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBsYXllci5IUCA8IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGZsb2F0IEQgPSAoZmxvYXQpcGxheWVyLkhzcGVlZCAqIDMyO1xyXG4gICAgICAgICAgICB2YXIgSCA9IGNhbWVyYS5DYW1lcmFCb3VuZHMud2lkdGggLyA4O1xyXG4gICAgICAgICAgICBEICs9ICFwbGF5ZXIuQW5pLkZsaXBwZWQgPyBIIDogLUg7XHJcbiAgICAgICAgICAgIHZhciBDID0gQXBwLkNhbnZhcztcclxuICAgICAgICAgICAgdmFyIElTID0gY2FtZXJhLkludlNjYWxlO1xyXG4gICAgICAgICAgICBmbG9hdCBWID0gTWF0aC5NYXgoMCxwbGF5ZXIuVnNwZWVkICogMzApO1xyXG4gICAgICAgICAgICBpZiAocGxheWVyLkNvbnRyb2xsZXJbMl0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFYgLT0gY2FtZXJhLkNhbWVyYUJvdW5kcy5oZWlnaHQgLyA0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBsYXllci5Db250cm9sbGVyWzNdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBWICs9IGNhbWVyYS5DYW1lcmFCb3VuZHMuaGVpZ2h0IC8gNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwbGF5ZXIub25Hcm91bmQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vViAtPSBjYW1lcmEuQ2FtZXJhQm91bmRzLmhlaWdodCAvIDg7XHJcbiAgICAgICAgICAgICAgICBWIC09IGNhbWVyYS5DYW1lcmFCb3VuZHMuaGVpZ2h0IC8gMTA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBWICs9IGNhbWVyYS5DYW1lcmFCb3VuZHMuaGVpZ2h0IC8gMTI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBUUCA9IGNhbWVyYS5UYXJnZXRQb3NpdGlvbjtcclxuICAgICAgICAgICAgLypUUC5YID0gKHRlc3QueCArIEQpIC0gKChDLldpZHRoIC8gMikgKiBJUyk7XHJcbiAgICAgICAgICAgIFRQLlkgPSAoZmxvYXQpTWF0aC5NYXgoMCwgKHRlc3QueSArIFYpIC0gKChDLkhlaWdodCAvIDIpICogSVMpKTsqL1xyXG4gICAgICAgICAgICAvKlRQLlggPSB0ZXN0Lng7XHJcbiAgICAgICAgICAgIFRQLlkgPSB0ZXN0Lnk7Ki9cclxuICAgICAgICAgICAgdmFyIFggPSBwbGF5ZXIueCArIChwbGF5ZXIuV2lkdGggLyAyKSArIEQ7XHJcbiAgICAgICAgICAgIHZhciBZID0gcGxheWVyLnkgKyAocGxheWVyLkhlaWdodCAvIDIpICsgVjtcclxuICAgICAgICAgICAgY2FtZXJhLkNlbnRlcmVkVGFyZ2V0UG9zaXRpb24gPSBuZXcgVmVjdG9yMihYLFkpO1xyXG4gICAgICAgICAgICBjYW1lcmEuVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXdCYWNrZ3JvdW5kKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBnKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZy5GaWxsU3R5bGUgPSBcIiM3N0FBRkZcIjtcclxuICAgICAgICAgICAgZy5GaWxsUmVjdCgwLCAwLCBBcHAuQ2FudmFzLldpZHRoLCBBcHAuQ2FudmFzLkhlaWdodCk7XHJcbiAgICAgICAgICAgIC8qaWYgKEJHIDwgMCB8fCBCRyA+PSBCR3MuQ291bnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGcuRmlsbFN0eWxlID0gXCIjNzdBQUZGXCI7XHJcbiAgICAgICAgICAgICAgICBnLkZpbGxSZWN0KDAsIDAsIEFwcC5DYW52YXMuV2lkdGgsIEFwcC5DYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGcuRHJhd0ltYWdlKEJHc1tCR10sIChmbG9hdCkwLCAoZmxvYXQpMCk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGVDb250cm9scygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIFBDID0gcGxheWVyO1xyXG4gICAgICAgICAgICBmbG9hdCB0aHJlc2hob2xkID0gMC43ZjtcclxuICAgICAgICAgICAgYm9vbFtdIEMgPSBQQy5Db250cm9sbGVyO1xyXG4gICAgICAgICAgICB2YXIgSUMgPSBBcHAuSUM7XHJcblxyXG4gICAgICAgICAgICBpZiAoSUMgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZsb2F0IHggPSBJQy5nZXRTdGF0ZSgwKTtcclxuICAgICAgICAgICAgZmxvYXQgeSA9IElDLmdldFN0YXRlKDEpO1xyXG4gICAgICAgICAgICBDWzBdID0geCA8PSAtdGhyZXNoaG9sZDtcclxuICAgICAgICAgICAgQ1sxXSA9IHggPj0gdGhyZXNoaG9sZDtcclxuICAgICAgICAgICAgQ1syXSA9IHkgPD0gLXRocmVzaGhvbGQ7XHJcbiAgICAgICAgICAgIENbM10gPSB5ID49IHRocmVzaGhvbGQ7XHJcblxyXG4gICAgICAgICAgICBzdHJpbmcgY2lkID0gSUMuZ2V0TWFwQ29udHJvbGxlcklEKDUpO1xyXG4gICAgICAgICAgICBpZiAoY2lkID09IFwiS2V5Ym9hcmRcIiB8fCBjaWQgPT0gXCJNb3VzZVwiKVxyXG4gICAgICAgICAgICAvL2lmIChJQy5pZCA9PSBcIktleWJvYXJkXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vLy9QQy5BaW1BdChHZXRNb3VzZSgpKTtcclxuICAgICAgICAgICAgICAgIC8qQ1s0XSA9IEtleWJvYXJkTWFuYWdlci5fdGhpcy5QcmVzc2VkTW91c2VCdXR0b25zLkNvbnRhaW5zKDApO1xyXG4gICAgICAgICAgICAgICAgQ1s1XSA9IEtleWJvYXJkTWFuYWdlci5fdGhpcy5QcmVzc2VkTW91c2VCdXR0b25zLkNvbnRhaW5zKDIpOyovXHJcbiAgICAgICAgICAgICAgICBDWzRdID0gSUMuZ2V0UHJlc3NlZCgyKTtcclxuICAgICAgICAgICAgICAgIENbNV0gPSBJQy5nZXRQcmVzc2VkKDMpO1xyXG4gICAgICAgICAgICAgICAgQ1s2XSA9IElDLmdldFByZXNzZWQoNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvKkdhbWVQYWQgUCA9IEdhbWVQYWRNYW5hZ2VyLl90aGlzLkdldFBhZChJQy5pZCk7XHJcbiAgICAgICAgICAgICAgICBQQy5haW1BbmdsZSA9IG5ldyBWZWN0b3IyKChmbG9hdClQLmF4ZXNbMl0sIChmbG9hdClQLmF4ZXNbM10pLlRvQW5nbGUoKTsqL1xyXG4gICAgICAgICAgICAgICAgVmVjdG9yMiBhaW0gPSBuZXcgVmVjdG9yMihJQy5nZXRTdGF0ZSg0KSwgSUMuZ2V0U3RhdGUoNSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFpbS5Sb3VnaExlbmd0aCA+IDAuNSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLy8vUEMuYWltQW5nbGUgPSBhaW0uVG9BbmdsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQ1s0XSA9IElDLmdldFByZXNzZWQoMik7XHJcbiAgICAgICAgICAgIENbNV0gPSBJQy5nZXRQcmVzc2VkKDMpO1xyXG4gICAgICAgICAgICBDWzZdID0gSUMuZ2V0UHJlc3NlZCg0KTtcclxuICAgICAgICAgICAgLypDWzRdID0gSUMuZ2V0UHJlc3NlZCgzKTtcclxuICAgICAgICAgICAgQ1s1XSA9IElDLmdldFByZXNzZWQoNCk7Ki9cclxuXHJcbiAgICAgICAgICAgIG9iamVjdCBvID0gbmV3IG9iamVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ2lybm9HYW1lXHJcbntcclxuICAgIGNsYXNzIEhlYWxpbmdJdGVtIDogQ29sbGVjdGFibGVJdGVtXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEhlYWxpbmdJdGVtKEdhbWUgZ2FtZSkgOiBiYXNlKGdhbWUsIFwiaGVhcnRcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBtYWduZXREaXN0YW5jZSA9IDIwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYm9vbCBDYW5Db2xsZWN0KFBsYXllckNoYXJhY3RlciBwbGF5ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gcGxheWVyLkhQIDwgcGxheWVyLm1heEhQO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgb25Db2xsZWN0ZWQoUGxheWVyQ2hhcmFjdGVyIHBsYXllcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsYXllci5IUCA9IE1hdGguTWluKHBsYXllci5IUCArIDEsIHBsYXllci5tYXhIUCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEtleUl0ZW0gOiBDb2xsZWN0YWJsZUl0ZW1cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgS2V5SXRlbShHYW1lIGdhbWUpIDogYmFzZShnYW1lLCBcImtleVwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXRzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG1hZ25ldERpc3RhbmNlID0gMjA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBib29sIENhbkNvbGxlY3QoUGxheWVyQ2hhcmFjdGVyIHBsYXllcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBwbGF5ZXIua2V5cyA8IDU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBvbkNvbGxlY3RlZChQbGF5ZXJDaGFyYWN0ZXIgcGxheWVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGxheWVyLmtleXMrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUGxhdGZvcm1lckVudGl0eTogQ29udHJvbGxhYmxlRW50aXR5XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGZyaWN0aW9uID0gMC41ZjtcclxuICAgICAgICBwdWJsaWMgYm9vbCBvbkdyb3VuZDtcclxuICAgICAgICBwdWJsaWMgYm9vbCBHcmF2aXR5RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgLy9wdWJsaWMgZmxvYXQgZ3Jhdml0eSA9IDEuNmY7XHJcbiAgICAgICAgLy9wdWJsaWMgZmxvYXQgZ3Jhdml0eSA9IDAuOWY7XHJcbiAgICAgICAgLy9wdWJsaWMgZmxvYXQgZ3Jhdml0eSA9IDAuMDE3NWY7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGdyYXZpdHkgPSAwLjAyZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgbWF4RmFsbFNwZWVkID0gMi4wZjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgZmVldHBvc2l0aW9uID0gMjM7XHJcbiAgICAgICAgLy9wdWJsaWMgZmxvYXQgaGVhZHBvc2l0aW9uID0gNDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgaGVhZHBvc2l0aW9uID0gNztcclxuXHJcbiAgICAgICAgcHVibGljIFRpbGVEYXRhIEZsb29yO1xyXG4gICAgICAgIHB1YmxpYyBUaWxlRGF0YSBDZWlsaW5nO1xyXG5cclxuICAgICAgICBwdWJsaWMgVGlsZURhdGEgTGVmdFdhbGw7XHJcbiAgICAgICAgcHVibGljIFRpbGVEYXRhIFJpZ2h0V2FsbDtcclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBQbGF0Zm9ybWVyRW50aXR5KEdhbWUgZ2FtZSkgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChHcmF2aXR5RW5hYmxlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKFZzcGVlZCA8IG1heEZhbGxTcGVlZCAmJiBHcmF2aXR5RW5hYmxlZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBWc3BlZWQgPSAoZmxvYXQpTWF0aC5NaW4oVnNwZWVkICsgZ3Jhdml0eSwgbWF4RmFsbFNwZWVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKmlmICh5ID4gMCAmJiBWc3BlZWQ+PTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHkgPSAwO1xyXG4gICAgICAgICAgICAgICAgVnNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgIG9uR3JvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeSA8IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG9uR3JvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBBcHBseUZyaWN0aW9uKCk7XHJcbiAgICAgICAgICAgIFVwZGF0ZVRlcnJhaW5Db2xsaXNpb24oKTtcclxuXHJcbiAgICAgICAgICAgIG9uR3JvdW5kID0gKEZsb29yICE9IG51bGwgJiYgVnNwZWVkPj0wKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChvbkdyb3VuZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgWSA9IEZsb29yLkdldFRvcChnZXRDZW50ZXIoKSkgLSBmZWV0cG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAvKmlmICh5IDwgWSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBvbkdyb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIEZsb29yID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UqL1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8veSA9ICgoRmxvb3Iucm93ICogR2FtZS5UTS50aWxlc2l6ZSkgKyBHYW1lLlRNLnBvc2l0aW9uLlkpIC0gZmVldHBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHkgPSBZO1xyXG4gICAgICAgICAgICAgICAgICAgIFZzcGVlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgb25Hcm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChDZWlsaW5nICE9IG51bGwgJiYgVnNwZWVkPDAvKiAmJiAhQ2VpbGluZy5wbGF0Zm9ybSovKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBWc3BlZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgeSA9ICgoQ2VpbGluZy5yb3cgKiBHYW1lLlRNLnRpbGVzaXplKSArIEdhbWUuVE0ucG9zaXRpb24uWSkgKyBHYW1lLlRNLnRpbGVzaXplIC0gaGVhZHBvc2l0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChMZWZ0V2FsbCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIc3BlZWQgPSBNYXRoLk1heCgwLCBIc3BlZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChSaWdodFdhbGwgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSHNwZWVkID0gTWF0aC5NaW4oMCwgSHNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBBcHBseUZyaWN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhzcGVlZCA9IChmbG9hdClNYXRoSGVscGVyLkRlY2VsZXJhdGUoSHNwZWVkLCBmcmljdGlvbik7XHJcbiAgICAgICAgICAgIGlmICghR3Jhdml0eUVuYWJsZWQpXHJcbiAgICAgICAgICAgICAgICBWc3BlZWQgPSAoZmxvYXQpTWF0aEhlbHBlci5EZWNlbGVyYXRlKFZzcGVlZCwgZnJpY3Rpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIFRpbGVEYXRhIEdldEZsb29yKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBudWxsO1xyXG4gICAgICAgICAgICBmbG9hdCBXID0gV2lkdGggLyAzO1xyXG4gICAgICAgICAgICBmbG9hdCBZID0gSGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoVmVjdG9yMi5BZGQoUG9zaXRpb24sV2lkdGggLyAyLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLFcsIFkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQudG9wU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoVmVjdG9yMi5BZGQoUG9zaXRpb24sV2lkdGggLSBXLCBZKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiBULnRvcFNvbGlkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBUaWxlRGF0YSBHZXRDZWlsaW5nKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRpbGVEYXRhIFQgPSBudWxsO1xyXG4gICAgICAgICAgICBmbG9hdCBXID0gV2lkdGggLyAzO1xyXG4gICAgICAgICAgICAvL2Zsb2F0IFkgPSAxNjtcclxuICAgICAgICAgICAgZmxvYXQgWSA9IDAraGVhZHBvc2l0aW9uO1xyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQuYm90dG9tU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoVmVjdG9yMi5BZGQoUG9zaXRpb24sVywgWSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgVC5ib3R0b21Tb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbixXaWR0aCAtIFcsIFkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIShUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQuYm90dG9tU29saWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIFRpbGVEYXRhIENoZWNrV2FsbChmbG9hdCBYKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVGlsZURhdGEgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIC8qaWYgKCEoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiAoKFQubGVmdFNvbGlkICYmIFggPiAwKSB8fCAoVC5yaWdodFNvbGlkICYmIFggPCAwKSkpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoUG9zaXRpb24gKyBuZXcgVmVjdG9yMihYLCAoSGVpZ2h0IC8gMiktMikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgKChULmxlZnRTb2xpZCAmJiBYID4gMCkgfHwgKFQucmlnaHRTb2xpZCAmJiBYIDwgMCkpKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFBvc2l0aW9uICsgbmV3IFZlY3RvcjIoWCwgSGVpZ2h0LTIpKTtcclxuICAgICAgICAgICAgICAgIGlmIChUICE9IG51bGwgJiYgVC5Jc1Nsb3BlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKFQgIT0gbnVsbCAmJiBULmVuYWJsZWQgJiYgKChULmxlZnRTb2xpZCAmJiBYID4gMCkgfHwgKFQucmlnaHRTb2xpZCAmJiBYIDwgMCkpKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICBpZiAoIUlzVGlsZU9ic3RhY2xlKFQsIFgpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUID0gR2FtZS5UTS5DaGVja0ZvclRpbGUoVmVjdG9yMi5BZGQoUG9zaXRpb24sWCwgKEhlaWdodCAvIDIpIC0gMikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghSXNUaWxlT2JzdGFjbGUoVCwgWCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQgPSBHYW1lLlRNLkNoZWNrRm9yVGlsZShWZWN0b3IyLkFkZChQb3NpdGlvbixYLCBIZWlnaHQgLSAyKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFJc1RpbGVPYnN0YWNsZShULCBYKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBib29sIElzVGlsZU9ic3RhY2xlKFRpbGVEYXRhIFQsIGZsb2F0IFgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVCAhPSBudWxsICYmIFQuZW5hYmxlZCAmJiAoKFQubGVmdFNvbGlkICYmIFggPiAwKSB8fCAoVC5yaWdodFNvbGlkICYmIFggPCAwKSkgJiYgKEZsb29yID09IG51bGwgfHwgVC5yb3cgPCBGbG9vci5yb3cpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBZID0geSArIEhlaWdodDtcclxuICAgICAgICAgICAgICAgIC8vaWYgKFQuR2V0SGl0Ym94KCkueSA8IFktMjgpXHJcbiAgICAgICAgICAgICAgICAvL2lmIChULkdldEhpdGJveCgpLnkgPCBZIC0gOClcclxuICAgICAgICAgICAgICAgIC8vaWYgKFQuR2V0SGl0Ym94KCkueSA8IFkgLSA0KVxyXG4gICAgICAgICAgICAgICAgaWYgKFQuR2V0SGl0Ym94KCkueSA8IFkgLSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhVC5Jc1Nsb3BlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZvaWQgVXBkYXRlVGVycmFpbkNvbGxpc2lvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBGbG9vciA9IEdldEZsb29yKCk7XHJcbiAgICAgICAgICAgIENlaWxpbmcgPSBHZXRDZWlsaW5nKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKFZzcGVlZCA8IG1heEZhbGxTcGVlZCAmJiBHcmF2aXR5RW5hYmxlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVnNwZWVkID0gKGZsb2F0KU1hdGguTWluKFZzcGVlZCArIGdyYXZpdHksIG1heEZhbGxTcGVlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYm9vbCB1bnN0dWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGJvb2wgc3R1Y2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKEZsb29yICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJvb2wgYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoYylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUaWxlRGF0YSBUID0gRmxvb3IuR2V0VGlsZURhdGEoMCwgLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChUICE9IG51bGwgJiYgVC5lbmFibGVkICYmIFQuc29saWQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGbG9vciA9IFQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0dWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHVjayA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvbkdyb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoRmxvb3IgIT0gbnVsbCAmJiBWc3BlZWQgPj0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9mbG9hdCBZID0gRmxvb3IuR2V0SGl0Ym94KCkudG9wIC0gSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgWSA9IEZsb29yLkdldFRvcChnZXRDZW50ZXIoKSkgLSBIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAvL2lmICghRmxvb3IucGxhdGZvcm0gfHwgeSA8PSBZICsgVnNwZWVkKVxyXG4gICAgICAgICAgICAgICAgLy9pZiAoIUZsb29yLnBsYXRmb3JtIHx8IHkrVnNwZWVkPj1ZKVxyXG4gICAgICAgICAgICAgICAgaWYgKCghRmxvb3IucGxhdGZvcm0gfHwgeSA8PSBZICsgVnNwZWVkKSAmJiB5ICsgKFZzcGVlZCArIDEwKSA+PSBZKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChWc3BlZWQgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVnNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25Hcm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB5ID0gWTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoSHNwZWVkICE9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRpbGVEYXRhIHdhbGwgPSBIc3BlZWQgPiAwID8gUmlnaHRXYWxsIDogTGVmdFdhbGw7XHJcbiAgICAgICAgICAgICAgICBpZiAod2FsbCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEhzcGVlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmxvYXQgVyA9IFdpZHRoIC8gMztcclxuICAgICAgICAgICAgZmxvYXQgWCA9IChmbG9hdClNYXRoLkFicyhIc3BlZWQpO1xyXG4gICAgICAgICAgICBpZiAoSHNwZWVkIDwgMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWCAtPSAyIC0gVztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFggKz0gKFdpZHRoIC0gVykgKyAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFJpZ2h0V2FsbCA9IENoZWNrV2FsbChYKTtcclxuXHJcbiAgICAgICAgICAgIFggPSAoZmxvYXQpLU1hdGguQWJzKEhzcGVlZCk7XHJcbiAgICAgICAgICAgIGlmIChIc3BlZWQgPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBYIC09IDIgLSBXO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgWCArPSAoV2lkdGggLSBXKSArIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTGVmdFdhbGwgPSBDaGVja1dhbGwoWCk7XHJcbiAgICAgICAgICAgIGlmIChMZWZ0V2FsbCAhPSBudWxsICYmIExlZnRXYWxsID09IFJpZ2h0V2FsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVjdGFuZ2xlIFIgPSBMZWZ0V2FsbC5HZXRIaXRib3goKTtcclxuICAgICAgICAgICAgICAgIFZlY3RvcjIgViA9IFIuQ2VudGVyO1xyXG4gICAgICAgICAgICAgICAgaWYgKChWIC0gUG9zaXRpb24pLlggPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHggKz0gMTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoSHNwZWVkIDwgMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEhzcGVlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHggLT0gMTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoSHNwZWVkID4gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEhzcGVlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdHVjaylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVXBkYXRlVGVycmFpbkNvbGxpc2lvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIE9yYiA6IENvbGxlY3RhYmxlSXRlbVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBPcmIoR2FtZSBnYW1lKSA6IGJhc2UoZ2FtZSwgXCJvcmJcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vQW5pID0gbmV3IEFuaW1hdGlvbihBbmltYXRpb25Mb2FkZXIuR2V0KFwiaW1hZ2VzL21pc2Mvb3JiXCIpKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIG9uQ29sbGVjdGVkKFBsYXllckNoYXJhY3RlciBwbGF5ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL3Rocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB2YXIgdGltZSA9ICgxMDAwKSAqIDI1O1xyXG4gICAgICAgICAgICBpZiAoR2FtZS50aW1lUmVtYWluaW5nID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgR2FtZS50aW1lUmVtYWluaW5nICs9IHRpbWU7XHJcbiAgICAgICAgICAgICAgICBHYW1lLnRpbWVSZW1haW5pbmcgPSBNYXRoLk1pbihHYW1lLm1heFRpbWVSZW1haW5pbmcsIEdhbWUudGltZVJlbWFpbmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBHYW1lLnRpbWVSZW1haW5pbmcgKz0gdGltZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvKnB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoR2FtZS5wbGF5ZXIuUG9zaXRpb24uRXN0aW1hdGVkRGlzdGFuY2UoUG9zaXRpb24pIDwgMzUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBQID0gR2FtZS5wbGF5ZXIuUG9zaXRpb24gLSBQb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIHZhciBsbiA9IFAuTGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwZCA9IDg7XHJcbiAgICAgICAgICAgICAgICBQID0gUC5Ob3JtYWxpemUoc3BkIC8gTWF0aC5NYXgoMSxsbikpO1xyXG4gICAgICAgICAgICAgICAgeCArPSBQLlg7XHJcbiAgICAgICAgICAgICAgICB5ICs9IFAuWTtcclxuICAgICAgICAgICAgICAgIGlmIChsbiA8PSBzcGQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBiYXNlLlVwZGF0ZSgpO1xyXG4gICAgICAgIH0qL1xyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFBvaW50SXRlbSA6IENvbGxlY3RhYmxlSXRlbVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBQb2ludEl0ZW0oR2FtZSBnYW1lKSA6IGJhc2UoZ2FtZSwgXCJwb2ludFwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXRzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vbWFnbmV0RGlzdGFuY2UgPSAxMDA7XHJcbiAgICAgICAgICAgIG1hZ25ldERpc3RhbmNlID0gNzA7XHJcbiAgICAgICAgICAgIG1hZ25ldFNwZWVkICo9IDg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIG9uQ29sbGVjdGVkKFBsYXllckNoYXJhY3RlciBwbGF5ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbGF5ZXIuc2NvcmUgKz0gNTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIENpcm5vR2FtZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTVJHaG9zdHkgOiBQbGF0Zm9ybWVyRW50aXR5LCBJQ29tYmF0YW50LCBJSGFybWZ1bEVudGl0eVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgYW5pbWF0aW9uID0gXCI/Pz9cIjtcclxuXHJcbiAgICAgICAgcHVibGljIGludCBUZWFtIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIGZsb2F0IEhQIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIGludCBQb2ludHNGb3JLaWxsaW5nXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBUYXJnZXRQcmlvcml0eVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwLjVmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBJc0hhcm1mdWxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIEVudGl0eSBBdHRhY2tlclxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgdG91Y2hEYW1hZ2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgYXR0YWNrcG93ZXIgPSAxO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBkZWZlbnNlcG93ZXIgPSAxO1xyXG5cclxuICAgICAgICBwdWJsaWMgTVJHaG9zdHkoR2FtZSBnYW1lKSA6IGJhc2UoZ2FtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENoYW5nZUFuaShcIlwiKTtcclxuICAgICAgICAgICAgLypBbmkuSHVlQ29sb3IgPSBcIiNGRjAwMDBcIjtcclxuICAgICAgICAgICAgQW5pLkh1ZVJlY29sb3JTdHJlbmd0aCA9IDEuMGY7XHJcbiAgICAgICAgICAgIEFuaS5TaGFkb3cgPSAyO1xyXG4gICAgICAgICAgICBBbmkuU2hhZG93Y29sb3IgPSBBbmkuSHVlQ29sb3I7Ki9cclxuICAgICAgICAgICAgLy9BbmkuU2hhZG93Y29sb3IgPSBcIiNGRjAwMDBcIjtcclxuICAgICAgICAgICAgQWRkQmVoYXZpb3IobmV3IEZsaWdodENvbnRyb2xzKHRoaXMpKTtcclxuICAgICAgICAgICAgQWRkQmVoYXZpb3IobmV3IFJhbmRvbUFJKHRoaXMpKTtcclxuICAgICAgICAgICAgLy9BZGRCZWhhdmlvcihuZXcgQWltZWRTaG9vdGVyKHRoaXMpKTtcclxuICAgICAgICAgICAgYXR0YWNrcG93ZXIgPSAxICsgKEdhbWUubGV2ZWwgKiAwLjMzNGYpO1xyXG4gICAgICAgICAgICBkZWZlbnNlcG93ZXIgPSAxICsgKEdhbWUubGV2ZWwgKiAwLjMzNGYpO1xyXG4gICAgICAgICAgICBpZiAoR2FtZS5wbGF5aW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBZGRCZWhhdmlvcjxBaW1lZFNob290ZXI+KCk7XHJcbiAgICAgICAgICAgICAgICBHZXRCZWhhdmlvcjxBaW1lZFNob290ZXI+KCkuYXR0YWNrcG93ZXIgPSBhdHRhY2twb3dlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL0dldEJlaGF2aW9yPEZsaWdodENvbnRyb2xzPigpLm1heFNwZWVkICo9IDAuNzVmO1xyXG4gICAgICAgICAgICBHZXRCZWhhdmlvcjxGbGlnaHRDb250cm9scz4oKS5tYXhTcGVlZCAqPSAwLjVmO1xyXG5cclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgR3Jhdml0eUVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgVGVhbSA9IDI7XHJcbiAgICAgICAgICAgIEhQID0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIEFuaS5GbGlwcGVkID0gIShIc3BlZWQgPCAwKTsvL3Nwcml0ZSBuZWVkcyB0byBiZSBlZGl0ZWQgdG8gZmFjZSB0aGUgcmlnaHQgd2F5Li4uXHJcbiAgICAgICAgICAgIEFuaS5JbWFnZVNwZWVkID0gKGZsb2F0KSgoTWF0aC5BYnMoSHNwZWVkKSArIE1hdGguQWJzKFZzcGVlZCkpICogMC4xMjUpO1xyXG5cclxuICAgICAgICAgICAgLy9BbmkuU2hhZG93ID0gQW5pLlNoYWRvdz09MCA/IDIgOiAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENoYW5nZUFuaShzdHJpbmcgYW5pbWF0aW9uLCBib29sIHJlc2V0ID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb24gPT0gYW5pbWF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKEFuaSA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5HZXQoXCJpbWFnZXMvZW5lbWllcy9tcmdob3N0XCIgKyBhbmltYXRpb24pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFuaS5DaGFuZ2VBbmltYXRpb24oQW5pbWF0aW9uTG9hZGVyLkdldChcImltYWdlcy9lbmVtaWVzL21yZ2hvc3RcIiArIGFuaW1hdGlvbiksIHJlc2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IGFuaW1hdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIG9uRGFtYWdlZChJSGFybWZ1bEVudGl0eSBzb3VyY2UsIGZsb2F0IGFtb3VudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIC8vaWYgKCEoc291cmNlIGlzIE1SR2hvc3R5KSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSFAgLT0gKGFtb3VudCAvIGRlZmVuc2Vwb3dlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyplbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhlbHBlci5Mb2coXCJnaG9zdHMgYXJlIGFsbGVyZ2ljIHRvIHRoZW1zZWx2ZXM/Pz9cIik7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgb25EZWF0aChJSGFybWZ1bEVudGl0eSBzb3VyY2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL3Rocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICBBbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgUCA9IG5ldyBQb2ludEl0ZW0oR2FtZSk7XHJcbiAgICAgICAgICAgIFAuUG9zaXRpb24uQ29weUZyb20oUG9zaXRpb24pO1xyXG4gICAgICAgICAgICBQLmNvbGxlY3Rpb25EZWxheSAvPSAyO1xyXG4gICAgICAgICAgICBHYW1lLkFkZEVudGl0eShQKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIG9uS2lsbChJQ29tYmF0YW50IGNvbWJhdGFudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBvbnRvdWNoRGFtYWdlKElDb21iYXRhbnQgdGFyZ2V0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy90aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDaXJub0dhbWVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFBsYXllckNoYXJhY3RlciA6IFBsYXRmb3JtZXJFbnRpdHksIElDb21iYXRhbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIGFuaW1hdGlvbj1cIj8/P1wiO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgc2hvb3R0aW1lID0gMDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHByZWZpeCA9IFwiXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBib29sIG5ld0lucHV0O1xyXG4gICAgICAgIHB1YmxpYyBpbnRbXSB0YXBUaW1lcjtcclxuICAgICAgICBwdWJsaWMgaW50IHNob290UmVjaGFyZ2UgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgdHVybnRpbWUgPSAwOy8vdGhlIGFtb3VudCBvZiB0aW1lIHRoZSB1c2VyIGhhcyBiZWVuIG1vdmluZyBub3JtYWxseS9zdGFuZGluZyBzdGlsbCwgaWYgbG9uZyBlbm91Z2ggdGhlIGNoYXJhY3RlciB3aWxsIHR1cm4gbm9ybWFsbHkuXHJcbiAgICAgICAgcHVibGljIGludCBzY29yZSA9IDA7XHJcbiAgICAgICAgcHVibGljIGludCBvcmJzID0gMDtcclxuICAgICAgICBwdWJsaWMgaW50IGtleXMgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgaW50IFRlYW0geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgbWF4SFAgPSAyMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgSFAgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIFNwYXduTG9jYXRpb24gPSBuZXcgVmVjdG9yMigpO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgbGl2ZXMgPSAzO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgZnJhbWUgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgZGlncG93ZXIgPSAxLjBmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBhdHRhY2twb3dlciA9IDFmO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBkZWZlbnNlcG93ZXIgPSAxZjtcclxuXHJcbiAgICAgICAgcHVibGljIGZsb2F0IGludmluY2liaWxpdHl0aW1lID0gMDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYmxvY2twcmljZSA9IDk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBpbnZpbmNpYmlsaXR5bW9kID0gMWY7XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbnQgUG9pbnRzRm9yS2lsbGluZ1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAzMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBUYXJnZXRQcmlvcml0eVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwLjdmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVUb05ld1NwYXduKFZlY3RvcjIgTmV3U3Bhd25Mb2NhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNwYXduTG9jYXRpb24uQ29weUZyb20oTmV3U3Bhd25Mb2NhdGlvbik7XHJcbiAgICAgICAgICAgIFBvc2l0aW9uLkNvcHlGcm9tKFNwYXduTG9jYXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgc2hvb3QoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHNob290dGltZSA8IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHByZWZpeCA9IFwic1wiO1xyXG4gICAgICAgICAgICAgICAgQ2hhbmdlQW5pKHByZWZpeCArIGFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNob290UmVjaGFyZ2UgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIFBCID0gbmV3IFBsYXllckJ1bGxldChHYW1lLCB0aGlzLCBcIkltYWdlcy9taXNjL2NyeXN0YWxcIik7XHJcbiAgICAgICAgICAgICAgICBQQi5Ic3BlZWQgPSBBbmkuRmxpcHBlZCA/IC0yLjVmIDogMi41ZjtcclxuICAgICAgICAgICAgICAgIFBCLnggPSB4ICsgKEFuaS5GbGlwcGVkID8gLTQgOiAxMik7XHJcbiAgICAgICAgICAgICAgICBQQi55ID0geSArIDEwO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFDb250cm9sbGVyWzBdICYmICFDb250cm9sbGVyWzFdKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qaWYgKENvbnRyb2xsZXJbMl0pXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQQi5Wc3BlZWQgPSAtKGZsb2F0KU1hdGguQWJzKFBCLkhzcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBCLkhzcGVlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYgKENvbnRyb2xsZXJbM10pXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQQi5Wc3BlZWQgPSAoZmxvYXQpTWF0aC5BYnMoUEIuSHNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEIuSHNwZWVkID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgICAgICAgICAvKmlmIChDb250cm9sbGVyWzJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEIuSHNwZWVkICo9IDAuOGY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBCLlZzcGVlZCA9IC0oZmxvYXQpTWF0aC5BYnMoUEIuSHNwZWVkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKENvbnRyb2xsZXJbM10pXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQQi5Ic3BlZWQgKj0gMC44ZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEIuVnNwZWVkID0gKGZsb2F0KU1hdGguQWJzKFBCLkhzcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKENvbnRyb2xsZXJbMl0pXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQQi5Ic3BlZWQgKj0gMC44ZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEIuVnNwZWVkID0gLShmbG9hdClNYXRoLkFicyhQQi5Ic3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQQi5Ic3BlZWQgKj0gMC42ZjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoQ29udHJvbGxlclszXSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBCLkhzcGVlZCAqPSAwLjhmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQQi5Wc3BlZWQgPSAoZmxvYXQpTWF0aC5BYnMoUEIuSHNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEIuSHNwZWVkICo9IDAuNmY7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChDb250cm9sbGVyWzJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEIuSHNwZWVkICo9IDAuOWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBCLlZzcGVlZCA9IC0oZmxvYXQpTWF0aC5BYnMoUEIuSHNwZWVkICogMC43KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKENvbnRyb2xsZXJbM10pXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQQi5Ic3BlZWQgKj0gMC45ZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEIuVnNwZWVkID0gKGZsb2F0KU1hdGguQWJzKFBCLkhzcGVlZCAqIDAuNyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgUEIueCAtPSBQQi5Ic3BlZWQ7XHJcbiAgICAgICAgICAgICAgICBQQi55IC09IFBCLlZzcGVlZDtcclxuICAgICAgICAgICAgICAgIFBCLmF0dGFja3N0ZXJyYWluID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFBCLmRpZ3Bvd2VyID0gZGlncG93ZXIgKiAwLjY2NjdmO1xyXG4gICAgICAgICAgICAgICAgUEIudG91Y2hEYW1hZ2UgPSBhdHRhY2twb3dlcjtcclxuICAgICAgICAgICAgICAgIEdhbWUuQWRkRW50aXR5KFBCKTtcclxuICAgICAgICAgICAgICAgIC8vc2hvb3RSZWNoYXJnZSA9IDEyO1xyXG4gICAgICAgICAgICAgICAgc2hvb3RSZWNoYXJnZSA9IDIwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNob290dGltZSA9IDUwO1xyXG4gICAgICAgICAgICB0dXJudGltZSA9IDA7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgUGxheWVyQ2hhcmFjdGVyKEdhbWUgZ2FtZSkgOiBiYXNlKGdhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDaGFuZ2VBbmkoXCJzdGFuZFwiKTtcclxuICAgICAgICAgICAgQWRkQmVoYXZpb3IobmV3IFBsYXRmb3JtZXJDb250cm9scyh0aGlzKSk7XHJcbiAgICAgICAgICAgIC8qQWRkQmVoYXZpb3IobmV3IEZsaWdodENvbnRyb2xzKHRoaXMpKTtcclxuICAgICAgICAgICAgR3Jhdml0eUVuYWJsZWQgPSBmYWxzZTsqL1xyXG4gICAgICAgICAgICB0YXBUaW1lciA9IG5ldyBpbnRbQ29udHJvbGxlci5MZW5ndGhdO1xyXG4gICAgICAgICAgICBUZWFtID0gMDtcclxuICAgICAgICAgICAgSFAgPSBtYXhIUDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJhc2UuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoc2hvb3R0aW1lID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2hvb3R0aW1lLS07XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hvb3R0aW1lIDwgMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJcIiArIGFuaW1hdGlvblswXSA9PSBwcmVmaXgpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDaGFuZ2VBbmkoYW5pbWF0aW9uLlN1YnN0cmluZygxKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByZWZpeCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNob290UmVjaGFyZ2UgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzaG9vdFJlY2hhcmdlLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9uR3JvdW5kKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoSHNwZWVkICE9IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2hhbmdlQW5pKHByZWZpeCArIFwid2Fsa1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLy9BbmkuRmxpcHBlZCA9IEhzcGVlZCA8IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2hhbmdlQW5pKHByZWZpeCArIFwic3RhbmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBBbmkuSW1hZ2VTcGVlZCA9IChmbG9hdClNYXRoLkFicyhIc3BlZWQgKiAwLjEyNSk7XHJcbiAgICAgICAgICAgICAgICAvL0FuaS5JbWFnZVNwZWVkID0gQW5pLkZsaXBwZWQgPyBIc3BlZWQgKiAwLjEyNWYgOiAtSHNwZWVkICogMC4xMjVmO1xyXG4gICAgICAgICAgICAgICAgLy9BbmkuSW1hZ2VTcGVlZCA9IChBbmkuRmxpcHBlZCA/IC1Ic3BlZWQgOiBIc3BlZWQpICogMC4xMjVmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2hhbmdlQW5pKHByZWZpeCArIFwianVtcFwiKTtcclxuICAgICAgICAgICAgICAgIC8vQW5pLkltYWdlU3BlZWQgPSAoZmxvYXQpTWF0aC5BYnMoVnNwZWVkICogMC4xMjUpO1xyXG4gICAgICAgICAgICAgICAgQW5pLkltYWdlU3BlZWQgPSAwLjE1ZisoZmxvYXQpKChNYXRoLkFicyhIc3BlZWQpICsgTWF0aC5BYnMoVnNwZWVkKSkgKiAwLjcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChBbmkuRmxpcHBlZCAhPSBIc3BlZWQgPCAwIHx8IChIc3BlZWQgPT0gMCAmJiBvbkdyb3VuZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR1cm50aW1lKys7XHJcbiAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR1cm50aW1lID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9pZiAoTENvbnRyb2xsZXJbM10gIT0gQ29udHJvbGxlclszXSAmJiBDb250cm9sbGVyWzNdKVxyXG4gICAgICAgICAgICAvKmlmIChQcmVzc2VkKDMpIHx8IFByZXNzZWQoNCkgfHwgUHJlc3NlZCg1KSB8fCBQcmVzc2VkKDYpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzaG9vdCgpO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgaWYgKENvbnRyb2xsZXJbNF0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR1cm50aW1lID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoUHJlc3NlZCg0KSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2hvb3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoUHJlc3NlZCg2KSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUGxhY2VCbG9jaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFVwZGF0ZUNvbnRyb2xsZXIoKTtcclxuICAgICAgICAgICAgLy9pZiAodHVybnRpbWUgPiAyMiAmJiBIc3BlZWQgIT0gMClcclxuICAgICAgICAgICAgLy9pZiAodHVybnRpbWUgPiAxOCAmJiBIc3BlZWQgIT0gMClcclxuICAgICAgICAgICAgaWYgKHR1cm50aW1lID4gMTQgJiYgSHNwZWVkICE9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEFuaS5GbGlwcGVkID0gSHNwZWVkIDwgMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW52aW5jaWJpbGl0eXRpbWUgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL0FuaS5BbHBoYSA9IEFuaS5BbHBoYSA9PSAwID8gMSA6IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGZyYW1lICYgMSkgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIFZpc2libGUgPSAhVmlzaWJsZTtcclxuICAgICAgICAgICAgICAgIGludmluY2liaWxpdHl0aW1lLT0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnJhbWUrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgUGxhY2VCbG9jaygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcHJpY2UgPSAxMDAwICogYmxvY2twcmljZTtcclxuICAgICAgICAgICAgaWYgKEdhbWUudGltZVJlbWFpbmluZyA8IGJsb2NrcHJpY2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmbG9hdCBXID0gV2lkdGggLyAzO1xyXG4gICAgICAgICAgICBmbG9hdCBZID0gSGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgVCA9IEdhbWUuVE0uQ2hlY2tGb3JUaWxlKFZlY3RvcjIuQWRkKFBvc2l0aW9uLCBXaWR0aCAvIDIsIFkpKTtcclxuICAgICAgICAgICAgaWYgKFQgIT0gbnVsbCAmJiAoIVQuZW5hYmxlZCB8fCAhVC5zb2xpZCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFQuc29saWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgVC5CcmVha2FibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgVC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFQudGV4dHVyZSA9IDQ7XHJcbiAgICAgICAgICAgICAgICBULlVwZGF0ZVRpbGUoKTtcclxuICAgICAgICAgICAgICAgIFQuSFAgPSBULm1heEhQICogMjtcclxuICAgICAgICAgICAgICAgIEdhbWUudGltZVJlbWFpbmluZyAtPSBibG9ja3ByaWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENoYW5nZUFuaShzdHJpbmcgYW5pbWF0aW9uLGJvb2wgcmVzZXQ9ZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb24gPT0gYW5pbWF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKEFuaSA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBbmkgPSBuZXcgQW5pbWF0aW9uKEFuaW1hdGlvbkxvYWRlci5HZXQoXCJpbWFnZXMvY2lybm8vXCIgKyBhbmltYXRpb24pKTtcclxuICAgICAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQW5pLkNoYW5nZUFuaW1hdGlvbihBbmltYXRpb25Mb2FkZXIuR2V0KFwiaW1hZ2VzL2Npcm5vL1wiICsgYW5pbWF0aW9uKSxyZXNldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uICE9IFwic3RhbmRcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHVybnRpbWUgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGVDb250cm9sbGVyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5ld0lucHV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGludCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBDb250cm9sbGVyLkxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGFwVGltZXJbaV0rKztcclxuICAgICAgICAgICAgICAgIGlmIChDb250cm9sbGVyW2ldICYmICFMQ29udHJvbGxlcltpXSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXBUaW1lcltpXSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgTENvbnRyb2xsZXJbaV0gPSBDb250cm9sbGVyW2ldO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qaWYgKF9sQWltQW5nbGUgIT0gX2FpbUFuZ2xlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuZXdJbnB1dCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX2xBaW1BbmdsZSA9IF9haW1BbmdsZTsqL1xyXG4gICAgICAgICAgICBpZiAobmV3SW5wdXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vR2V0QmVoYXZpb3I8TmV0d29ya1N5bmM+KCkuU3luYygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBvbkRhbWFnZWQoSUhhcm1mdWxFbnRpdHkgc291cmNlLCBmbG9hdCBhbW91bnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL3Rocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAoaW52aW5jaWJpbGl0eXRpbWUgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSFAgLT0gKGFtb3VudCAvIGRlZmVuc2Vwb3dlcik7XHJcbiAgICAgICAgICAgICAgICBpbnZpbmNpYmlsaXR5dGltZSA9IDQ1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBvbkRlYXRoKElIYXJtZnVsRW50aXR5IHNvdXJjZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoR2FtZS5wbGF5ZXIgPT0gdGhpcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEdhbWUudGltZVJlbWFpbmluZyA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUG9zaXRpb24uQ29weUZyb20oU3Bhd25Mb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgSFAgPSBtYXhIUDtcclxuICAgICAgICAgICAgICAgICAgICBHYW1lLnRpbWVSZW1haW5pbmcgKj0gMC42NjY3ZjtcclxuICAgICAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgR2FtZS5Eb0dhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uLkNvcHlGcm9tKFNwYXduTG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgSFAgPSBtYXhIUDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgb25LaWxsKElDb21iYXRhbnQgY29tYmF0YW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy90aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFeGNlcHRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFJlY3RhbmdsZSBHZXRIaXRib3goKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9yZXR1cm4gYmFzZS5HZXRIaXRib3goKTtcclxuICAgICAgICAgICAgaWYgKEFuaSAhPSBudWxsICYmIEFuaS5DdXJyZW50SW1hZ2UgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLyp2YXIgc2l6ZSA9IDQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgVyA9IEFuaS5DdXJyZW50SW1hZ2UuV2lkdGggLyBzaXplO1xyXG4gICAgICAgICAgICAgICAgdmFyIEggPSBBbmkuQ3VycmVudEltYWdlLkhlaWdodCAvIHNpemU7XHJcbiAgICAgICAgICAgICAgICB2YXIgVzQgPSAoQW5pLkN1cnJlbnRJbWFnZS5XaWR0aCAvIDIpIC0gKFcgLyAyKTtcclxuICAgICAgICAgICAgICAgIHZhciBINCA9IChBbmkuQ3VycmVudEltYWdlLkhlaWdodCAvIDIpIC0gKEggLyAyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKEFuaS5YK1c0LCBBbmkuWStINCwgVywgSCk7Ki9cclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKEFuaS5YICsgKEFuaS5DdXJyZW50SW1hZ2UuV2lkdGggLyAyZiksQW5pLlkrKEFuaS5DdXJyZW50SW1hZ2UuSGVpZ2h0IC8gMmYpLCAxLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl0KfQo=
