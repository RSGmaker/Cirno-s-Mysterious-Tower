using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using System.Linq;
using System;

namespace CirnoGame
{
    public class App
    {
        public static int Frame = 0;
        public static HTMLDivElement Div;
        public static HTMLCanvasElement Canvas;
        //public static HTMLCanvasElement guiCanvas;
        //public static CanvasRenderingContext2D gui;
        public static Rectangle ScreenBounds;

        public static JSONArchive JSON;
        public static CanvasRenderingContext2D G;
        public static double TargetAspect;

        private static double _lSize = -1;
        protected static double _missingTime = 0;
        protected static double _lTime = -1;

        protected static bool _frameRendered = false;

        protected static bool _gameRendered = false;

        public static InputController IC;
        public static GameSprite CurrentView;

        public static string GameName = "Cirno's Mysterious Tower";
        public static string GameVersion = "0.1";
        /*#if DEBUG
                public static bool DEBUG = true;
        #else
                public static bool DEBUG = false;
        #endif*/
        public static bool DEBUG = false;
        public static void Main()
        {
            //USE THE JSON ZIP ARCHIVE FEATURE FROM BNTEST FOR LOADING IMAGES AND FILES.

            Document.Body.Style.CssText = "overflow: hidden;margin: 0;padding: 0;";
            GamePadManager._this = new GamePadManager();
            GamePadManager._this.Update();
            Global.SetTimeout((global::System.Action)(() => {
                GamePadManager._this.Update();

                IC = InputControllerManager._this.Controllers[0];
                InputMap IM = InputControllerManager._this.Controllers[0].InputMapping[2];
                /*IM.map = 0;
                IM.controllerID = "Mouse";*/

                /*IM = InputControllerManager._this.Controllers[0].InputMapping[3];
                IM.map = 0;
                IM.controllerID = "Mouse";

                //pointer controls
                IM = InputControllerManager._this.Controllers[0].InputMapping[4];
                IM.map = 2;
                IM.controllerID = "Mouse";

                IM = InputControllerManager._this.Controllers[0].InputMapping[5];
                IM.map = 1;
                IM.controllerID = "Mouse";*/

                /*IM = InputControllerManager._this.Controllers[0].InputMapping[3];
                IM.map = 2;
                IM.controllerID = "Mouse";

                //pointer controls
                IM = InputControllerManager._this.Controllers[0].InputMapping[4];
                IM.map = 1;
                IM.controllerID = "Mouse";

                IM = InputControllerManager._this.Controllers[0].InputMapping[5];
                IM.map = 1;
                IM.controllerID = "Mouse";*/

                ///CurrentView = new TitleScreen();

            }), 5);

            var ok = false;
            var uptest = true;
            JSONArchive.Open("Assets/Images.JSON", (global::System.Action<global::CirnoGame.JSONArchive>)(json =>
            {
                JSON = json;

                JSON.PreloadImages((global::System.Action)(() =>
                {
                    ok = true;
                    Finish();
                }));
            }));

            // Create a new HTML Button
            /*var button = Document.CreateElement("button");

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


        }

        public static void Finish()
        {
            AnimationLoader.Init(JSON);
            var LT = Document.GetElementById("loadtext").As<HTMLParagraphElement>();
            LT.TextContent = "";
            Document.Body.Style.Cursor = Cursor.Auto;
            Document.Title = GameName + " " + GameVersion + " by:RSGmaker";
            //var R = new Renderer();
            //Document.Body.AppendChild(R.view);

            Div = new HTMLDivElement();
            HTMLCanvasElement Canv = new HTMLCanvasElement();
            Canvas = Canv;
            TargetAspect = 0.75;
            //Canv.Width = 200;
            Canv.Width = 1024;
            //Canv.Width = 1280;
            Canv.Height = (int)(Canv.Width * TargetAspect);
            ScreenBounds = new Rectangle(0, 0, Canv.Width, Canv.Height);

            Div.AppendChild(Canv);
            Document.Body.AppendChild(Div);
            //Document.Body.AppendChild(Canv);
            G = Canvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);

            G.ImageSmoothingEnabled = false;
            Canvas.Style.ImageRendering = ImageRendering.Pixelated;
            var gg = G;
            Script.Write("gg.webkitImageSmoothingEnabled = false");
            Script.Write("gg.mozImageSmoothingEnabled = false");


            KeyboardManager.Init();

            CurrentView = new Game();

            Action OnF = RAF;
            Script.Write("requestAnimationFrame(OnF);");
        }

        private static void updateWindow()
        {
            //var R = Window.InnerWidth / Window.InnerHeight;
            double size = Math.Ceiling(Window.InnerHeight * (1 / TargetAspect));
            if (size != _lSize)
            {
                /*Canvas.Style.Width = size + "px";

                Canvas.Style.Position = Position.Absolute;
                Canvas.Style.Left = ((Window.InnerWidth / 2) - (size / 2)) + "px";*/
                Canvas.Style.Width = "100%";
                Div.Style.Width = size + "px";

                //Div.Style.Position = Position.Absolute;
                Div.Style.Position = Position.Relative;
                Div.Style.Left = ((Window.InnerWidth / 2) - (size / 2)) + "px";
                size = _lSize;
            }
        }
        protected static void UpdateInputs()
        {
            if (IC != null)
            {
                var L = InputControllerManager._this.Controllers;
                if (L.Count > 1)
                {
                    /*List<int> keys = KeyboardManager._this.TappedButtons;
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
            KeyboardManager.Update();
        }
        protected static void Update(double time)
        {
            double delta = 0;
            if (time >= 0)
            {
                if (_lTime < 0)
                {
                    _lTime = time;
                }
                else
                {
                    //missingTime -= 16.666666666666666666666666666667;
                }
                delta = (time - _lTime);
                _missingTime += (delta);
                if (CurrentView is Game)
                {
                    var G = (Game)CurrentView;
                    if (G.running)
                    {
                        G.totalTime += (float)delta;
                        if (G.timeRemaining > 0)
                            G.timeRemaining -= (float)delta;
                        if (G.timeRemaining <= 0)
                            G.timeRemaining = 0;
                    }
                }
            }
            updateWindow();
            /*if (delta > 22)
            {
                Lagging = true;
            }*/

            if (/*useRAF || */_missingTime > 12/* || (_frameRendered && _missingTime > 0)*/)
            {
                if (CurrentView != null)
                {
                    CurrentView.Update();
                }

                _missingTime -= 16.666666666666666666666666666667;
                _frameRendered = false;
                _gameRendered = false;

            }
            else
            {
                _lTime = time;
                return;
            }
            if (time >= 0)
            {
                if (_missingTime >= 3000)
                {
                    _missingTime = 0;
                }
                if (_missingTime >= 10000)
                {
                    //Game is lagging too much to properly play multiplayer.
                }
                double T = 16.666666666666666666666666666667;
                if (true)
                {
                    T += 8;
                }
                while (_missingTime >= T)
                {
                    if (CurrentView != null)
                    {
                        CurrentView.Update();
                    }
                    _missingTime -= 16.666666666666666666666666666667;
                }
            }
            ///game.Render();
            //game.Draw(g);
            _lTime = time;
            Frame++;
            G.Clear();
            GamePadManager._this.Update();
            if (CurrentView != null)
            {

                CurrentView.Update();
                CurrentView.Render();
                G.DrawImage(CurrentView.spriteBuffer, 0f, 0f, Canvas.Width, Canvas.Height);
            }
            //G.FillStyle = ""+Convert. Frame;
            //G.FillStyle = "#" + Frame.ToString("X6");
            /*G.FillStyle = "#" + ColorFromAhsb(1,(Frame/2) % 360,0.8f,0.7f).ToString("X6");
            G.FillRect(0, 0, G.Canvas.Width, G.Canvas.Height);

            G.FillStyle = "red";
            var x = ((0 + Frame * 3) % (G.Canvas.Width + 100)) - 100;
            var y = ((0 + Frame) % (G.Canvas.Height + 100)) - 100;
            //G.FillRect(x, y, 100, 100);

            var V = JSON.Images.Values.ToArray();

            var img = V[(Frame/10) % V.Length];
            G.DrawImage(img, x, y,img.Width*4,img.Height * 4);*/
            UpdateInputs();
        }
        private static void RAF()
        {

            Action OnF = RAF;
            Script.Write("requestAnimationFrame(OnF);");
            double time = Global.Performance.Now();
            Update(time);
        }
        public static int ColorFromAhsb(int a, float h, float s, float b)
        {

            /*if (0 > a || 255 < a)
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

            if (0 == s)
            {
                //return CreateShade(b / 255.0);
                //return 0x808080;
                var shade = (int)(b / 255.0);
                return RGBToInt(shade, shade, shade);
            }

            float fMax, fMid, fMin;
            int iSextant, iMax, iMid, iMin;

            if (0.5 < b)
            {
                fMax = b - (b * s) + s;
                fMin = b + (b * s) - s;
            }
            else
            {
                fMax = b + (b * s);
                fMin = b - (b * s);
            }

            iSextant = (int)Math.Floor(h / 60f);
            if (300f <= h)
            {
                h -= 360f;
            }
            h /= 60f;
            h -= 2f * (float)Math.Floor(((iSextant + 1f) % 6f) / 2f);
            if (0 == iSextant % 2)
            {
                fMid = h * (fMax - fMin) + fMin;
            }
            else
            {
                fMid = fMin - h * (fMax - fMin);
            }

            iMax = Convert.ToInt32(fMax * 255);
            iMid = Convert.ToInt32(fMid * 255);
            iMin = Convert.ToInt32(fMin * 255);

            switch (iSextant)
            {
                case 1:
                    return RGBToInt(iMid, iMax, iMin);
                case 2:
                    return RGBToInt(iMin, iMax, iMid);
                case 3:
                    return RGBToInt(iMin, iMid, iMax);
                case 4:
                    return RGBToInt(iMid, iMin, iMax);
                case 5:
                    return RGBToInt(iMax, iMin, iMid);
                default:
                    return RGBToInt(iMax, iMid, iMin);
            }
        }
        public static int RGBToInt(int R, int G, int B)
        {
            return R + (G << 8) + (B << 16);
        }
    }
}