using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class KeyboardManager
    {
        public List<int> PressedButtons;
        public List<int> TappedButtons;

        public List<int> PressedMouseButtons;
        public List<int> TappedMouseButtons;

        public Vector2 MousePosition = new Vector2();
        public Vector2 CMouse = new Vector2();

        public static KeyboardManager _this
        {
            get
            {
                if (__this == null)
                {
                    __this = new KeyboardManager();
                }
                return __this;
            }
        }
        public static void Init()
        {
            if (__this == null)
            {
                __this = new KeyboardManager();
            }
        }
        protected static KeyboardManager __this;
        protected KeyboardManager()
        {
            PressedButtons = new List<int>();
            TappedButtons = new List<int>();
            PressedMouseButtons = new List<int>();
            TappedMouseButtons = new List<int>();

            Predicate<KeyboardEvent> KD = onKeyDown;
            Script.Write("document.onkeydown = KD;");

            Action<KeyboardEvent> KU = onKeyUp;
            Script.Write("document.onkeyup = KU;");

            Action<MouseEvent> MM = onMouseMove;
            Script.Write("document.onmousemove = MM;");

            Predicate<MouseEvent> MD = onMouseDown;
            Script.Write("document.onmousedown = MD;");

            Predicate<MouseEvent> MU = onMouseUp;
            Script.Write("document.onmouseup = MU;");

            Predicate<MouseEvent> NB = NeverinBounds;
            Script.Write("document.oncontextmenu = NB");
        }


        public static void Update()
        {
            __this.TappedButtons.Clear();
            __this.TappedMouseButtons.Clear();
        }

        public static bool NeverinBounds(MouseEvent evt)
        {
            return !App.ScreenBounds.containsPoint(_this.CMouse.X, _this.CMouse.Y);
        }

        public static bool onKeyDown(KeyboardEvent evt)
        {
            int keyCode = evt.KeyCode;

            if (!__this.PressedButtons.Contains(keyCode))
            {
                __this.PressedButtons.Add(keyCode);
                __this.TappedButtons.Add(keyCode);
            }
            if ((keyCode >= 37 && keyCode <= 40) || keyCode == 32 || keyCode == 112)
            {
                return false;
            }
            return true;
        }

        public static void onKeyUp(KeyboardEvent evt)
        {
            int keyCode = evt.KeyCode;

            if (__this.PressedButtons.Contains(keyCode))
            {
                __this.PressedButtons.Remove(keyCode);
            }
        }
        public static bool onMouseDown(MouseEvent evt)
        {
            int btn = evt.Button;
            if (!__this.PressedMouseButtons.Contains(btn))
            {
                __this.PressedMouseButtons.Add(btn);
                __this.TappedMouseButtons.Add(btn);
            }
            return btn < 1;
        }
        public static bool onMouseUp(MouseEvent evt)
        {
            int btn = evt.Button;
            if (__this.PressedMouseButtons.Contains(btn))
            {
                __this.PressedMouseButtons.Remove(btn);
            }
            return btn < 1;
        }
        public static void onMouseMove(MouseEvent evt)
        {
            _this.MousePosition = new Vector2(evt.ClientX, evt.ClientY);

            //float left = float.Parse(App.Canvas.Style.Left.Replace("px", ""));
            float left = float.Parse(App.Div.Style.Left.Replace("px", ""));
            float x = evt.ClientX - left;
            float y = evt.ClientY;

            //float scale = (App.Canvas.Width * 1.25f) / float.Parse(App.Canvas.Style.Width.Replace("px", ""));

            //float scale = (App.Canvas.Width) / float.Parse(App.Canvas.Style.Width.Replace("px", ""));
            float scale = (App.Canvas.Width) / float.Parse(App.Div.Style.Width.Replace("px", ""));
            _this.CMouse = new Vector2(x * scale, y * scale);
            //Console.WriteLine("mx:"+_this.CMouse.x + " my:" + _this.CMouse.y);
        }
    }
}
