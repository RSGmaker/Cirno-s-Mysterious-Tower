using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class ButtonSprite : Sprite
    {
        protected bool _buttonNeedsRerender;
        protected Sprite _buttonBuffer;
        protected CanvasRenderingContext2D _buttonGraphic;
        public dynamic Data;

        protected Sprite _contents;
        public Sprite Contents
        {
            get
            {
                return _contents;
            }
            set
            {
                if (_contents != value)
                {
                    _contents = value;
                    _buttonNeedsRerender = true;
                }
            }
        }
        protected int _borderSize;
        public int BorderSize
        {
            get
            {
                return _borderSize;
            }
            set
            {
                if (_borderSize != value)
                {
                    _borderSize = value;
                    _buttonNeedsRerender = true;
                }
            }
        }
        protected string _borderColor;
        public string BorderColor
        {
            get
            {
                return _borderColor;
            }
            set
            {
                if (_borderColor != value)
                {
                    _borderColor = value;
                    _buttonNeedsRerender = true;
                }
            }
        }
        public string LockedClickSound = "hit";
        public string ClickSound = "select";
        protected string _buttonColor;
        public string ButtonColor
        {
            get
            {
                return _buttonColor;
            }
            set
            {
                if (_buttonColor != value)
                {
                    _buttonColor = value;
                    _buttonNeedsRerender = true;
                }
            }
        }
        public class ColorScheme
        {
            public string BorderColor;
            public string ButtonColor;
            public ColorScheme(string borderColor = "#00AA33", string buttonColor = "#11CC55")
            {
                this.BorderColor = borderColor;
                this.ButtonColor = buttonColor;
            }
        }

        public List<ColorScheme> ColorSchemes;

        public bool locked = false;

        public Action OnClick;
        public void SetColorScheme(ColorScheme scheme)
        {
            BorderColor = scheme.BorderColor;
            ButtonColor = scheme.ButtonColor;
        }
        public void SetColorScheme(int index)
        {
            ColorScheme C = ColorSchemes[index];
            SetColorScheme(C);
        }
        //public ButtonSprite(Sprite contents,int borderSize=2,string borderColor="#777777",string buttonColor="#CCCCCC")
        public ButtonSprite(Sprite contents, int borderSize = 2, string borderColor = "#00AA33", string buttonColor = "#11CC55", dynamic data = null)
        {
            this.Contents = contents;
            this.BorderSize = borderSize;
            this.BorderColor = borderColor;
            this.ButtonColor = buttonColor;

            _buttonBuffer = new Sprite();
            _buttonBuffer.Size = contents.Size;
            _buttonGraphic = _buttonBuffer.GetGraphics();
            _buttonNeedsRerender = true;
            ColorSchemes = new List<ColorScheme>();
            ColorSchemes.Add(new ColorScheme(borderColor, buttonColor));
            ColorSchemes.Add(new ColorScheme("#FFFFFF", "#FF0000"));
            ColorSchemes.Add(new ColorScheme("#777777", "#CCCCCC"));

            this.Data = data;
            if (data == null && contents is TextSprite)
            {
                Data = ((TextSprite)contents).Text;
            }

            Draw(null);
        }
        protected void drawButton()
        {
            CanvasRenderingContext2D g = _buttonGraphic;
            int sz = _borderSize + _borderSize;
            _buttonBuffer.Size = Contents.Size + new Vector2(sz, sz);
            Vector2 size = _buttonBuffer.Size;

            g.FillStyle = _borderColor;
            g.FillRect(0, 0, (int)size.X, (int)size.Y);

            g.FillStyle = ButtonColor;
            g.FillRect(_borderSize, _borderSize, (int)size.X - sz, (int)size.Y - sz);

            string color = "rgba(255,255,255,0)";

            string wht = "rgba(255,255,255,0.7)";


            ///Script.Write("var grd = g.createLinearGradient(0, 0, 0, size.y);grd.addColorStop(0, color);grd.addColorStop(0.4, wht);grd.addColorStop(1, color);g.fillStyle = grd;");
            var grd = g.CreateLinearGradient(0, 0, 0, size.Y);
            grd.AddColorStop(0, color);
            grd.AddColorStop(0.4, wht);
            grd.AddColorStop(1, color);
            g.FillStyle = grd;
            g.FillRect(0, 0, (int)_buttonBuffer.Size.X, (int)_buttonBuffer.Size.Y);
        }
        public void Lock(bool setcolorscheme = true)
        {
            if (locked)
                return;
            locked = true;
            if (setcolorscheme)
            {
                SetColorScheme(2);
            }
        }
        public void Unlock(bool setcolorscheme = true)
        {
            if (!locked)
                return;
            locked = false;
            if (setcolorscheme)
            {
                SetColorScheme(0);
            }
        }
        protected Vector2 LContentSize = new Vector2();
        public bool CheckClick(Vector2 mousePosition)
        {
            if (Visible && GetBounds().containsPoint(mousePosition))
            {
                if (locked)
                {
                    if (LockedClickSound != "" && LockedClickSound != null)
                    {
                        AudioManager._this.Blast("SFX/" + LockedClickSound + ".ogg");
                    }
                    return false;
                }

                if (ClickSound != "" && ClickSound != null)
                {
                    //AudioManager._this.Get("SFX/" + ClickSound);
                    AudioManager._this.Blast("SFX/" + ClickSound + ".ogg");

                }
                var tmp = OnClick;
                if (Script.Write<bool>("tmp"))
                {
                    OnClick();
                }
                return true;
            }
            return false;
        }
        public override void Draw(CanvasRenderingContext2D g)
        {
            //if (_contents.Size != LContentSize)
            if (_contents.Size.X != LContentSize.X || _contents.Size.Y != LContentSize.Y)
            {
                _buttonNeedsRerender = true;
                LContentSize = _contents.Size.Clone();
            }
            if (_buttonNeedsRerender)
            {
                drawButton();
                _buttonNeedsRerender = false;
            }
            Size = _buttonBuffer.Size.Clone();
            //spriteGraphics.DrawImage(_bu)
            _buttonBuffer.Draw(spriteGraphics);
            Contents.Position = new Vector2(_borderSize, _borderSize);
            Contents.Draw(spriteGraphics);

            if (g != null)
            {
                base.Draw(g);
            }
        }
    }
}
