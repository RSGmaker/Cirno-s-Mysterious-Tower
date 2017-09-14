using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class Animation
    {
        public List<HTMLImageElement> Images;
        protected HTMLImageElement _currentImage;
        public HTMLImageElement CurrentImage
        {
            get
            {
                return _currentImage;
            }
            set
            {
                if (_currentImage != value)
                {
                    BufferNeedsRedraw = true;
                }
                _currentImage = value;

            }
        }
        public float CurrentFrame;
        public float ImageSpeed;
        public Vector2 Position;
        public int AnimationTimeElapsed;
        public float X
        {
            get
            {
                return Position.X;
            }
            set
            {
                Position.X = value;
            }
        }
        public float Y
        {
            get
            {
                return Position.Y;
            }
            set
            {
                Position.Y = value;
            }
        }
        public float StretchWidth = 0;
        public float StretchHeight = 0;
        public float Rotation = 0;
        public float Alpha = 1;

        public bool Looping = true;
        public bool Looped = false;
        public bool FrameChanged = false;
        public bool Flipped = false;
        protected bool _transformed = false;

        protected float _shadow;
        public float Shadow
        {
            get
            {
                return _shadow;
            }
            set
            {
                if (_shadow != value)
                {
                    _shadow = value;
                    BufferNeedsRedraw = true;
                }
            }
        }
        protected string _shadowColor;
        public string Shadowcolor
        {
            get
            {
                return _shadowColor;
            }
            set
            {
                if (_shadowColor != value)
                {
                    _shadowColor = value;
                    BufferNeedsRedraw = true;
                }
            }
        }

        protected bool BufferNeedsRedraw = true;
        protected string _hueColor;
        public string HueColor
        {
            get
            {
                return _hueColor;
            }
            set
            {
                if (_hueColor != value)
                {
                    BufferNeedsRedraw = true;
                }
                _hueColor = value;

            }
        }
        protected float _hueRecolorStrength;
        public float HueRecolorStrength
        {
            get
            {
                return _hueRecolorStrength;
            }
            set
            {
                if (_hueRecolorStrength != value)
                {
                    BufferNeedsRedraw = true;
                }
                _hueRecolorStrength = value;
            }
        }

        protected HTMLCanvasElement _buffer;
        protected CanvasRenderingContext2D _bg;

        public Animation(List<HTMLImageElement> data)
        {
            Images = data;
            if (Images == null)
            {
                Images = new List<HTMLImageElement>();
            }
            ImageSpeed = 1f;
            Position = new Vector2();
            AnimationTimeElapsed = 0;
            Shadow = 0;
            Shadowcolor = "#FFFFFF";
            HueColor = "";
            HueRecolorStrength = 0.6f;
            _buffer = new HTMLCanvasElement();
            _bg = _buffer.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
            if (Images.Count > 0)
            {
                SetImage();
            }
        }
        public void Update()
        {
            HTMLImageElement LI = CurrentImage;
            int last = (int)CurrentFrame;
            CurrentFrame += ImageSpeed;
            int current = (int)CurrentFrame;
            if (current != last)
            {
                if (Images.Count > 0)
                {
                    while (current >= Images.Count && current > 0)
                    {
                        if (Looping)
                        {
                            current -= Images.Count;
                            CurrentFrame -= Images.Count;
                        }
                        else
                        {
                            CurrentFrame -= ImageSpeed;
                        }
                    }
                    while (current < 0)
                    {
                        current += Images.Count;
                        CurrentFrame += Images.Count;
                    }
                }
                SetImage();
            }

            Looped = false;
            if (LI != CurrentImage)
            {
                FrameChanged = true;
                if ((ImageSpeed > 0 && current == 0) || ((ImageSpeed < 0 && current == Images.Count - 1)))
                {
                    Looped = true;
                }
            }
            else
            {
                FrameChanged = false;
            }
            AnimationTimeElapsed++;
        }
        public void ChangeAnimation(List<HTMLImageElement> ani, bool reset = true)
        {
            if (reset)
            {
                CurrentFrame = 0;
                AnimationTimeElapsed = 0;
            }
            Images = ani;
            //CurrentImage = Images[(int)CurrentFrame];
            SetImage();
        }
        public void SetImage()
        {
            if (Images.Count < 2)
            {
                CurrentFrame = 0;
            }
            else
            {
                var ln = Images.Count;
                while (CurrentFrame < 0)
                {
                    CurrentFrame += ln;
                }
                while (CurrentFrame >= ln)
                {
                    CurrentFrame -= ln;
                }
            }
            int current = (int)CurrentFrame;
            if (current >= 0 && current < Images.Count)
            {
                CurrentImage = Images[current];
            }
        }
        public void Draw(CanvasRenderingContext2D g)
        {
            Draw(g, Position);
        }
        public void Draw(CanvasRenderingContext2D g, Vector2 position)
        {
            float x = position.X;
            float y = position.Y;
            if (CurrentImage == null)
            {
                int current = (int)CurrentFrame;
                if (current >= 0 && current < Images.Count)
                {
                    CurrentImage = Images[current];
                }
                if (CurrentImage == null)
                {
                    return;
                }
            }
            float X = x;
            float Y = y;
            float lastalpha = g.GlobalAlpha;
            bool centered = false;
            bool useBuffer = false;
            if (HueColor != "")
            {
                if (BufferNeedsRedraw)
                {
                    bool adv = true;
                    _bg.GlobalCompositeOperation = CanvasTypes.CanvasCompositeOperationType.SourceOver;
                    _buffer.Width = CurrentImage.Width;
                    _buffer.Height = CurrentImage.Height;
                    _bg.DrawImage(CurrentImage, 0f, 0f);
                    _bg.GlobalAlpha = HueRecolorStrength;
                    _bg.GlobalCompositeOperation = CanvasTypes.CanvasCompositeOperationType.Hue;
                    _bg.FillStyle = HueColor;
                    _bg.FillRect(0, 0, _buffer.Width, _buffer.Height);

                    if (adv)
                    {
                        _bg.GlobalAlpha = (1 + HueRecolorStrength) / 2f;
                        _bg.GlobalCompositeOperation = CanvasTypes.CanvasCompositeOperationType.SourceOver;
                        _bg.FillRect(0, 0, _buffer.Width, _buffer.Height);
                    }

                    _bg.GlobalAlpha = 1;
                    if (adv)
                    {
                        _bg.GlobalCompositeOperation = CanvasTypes.CanvasCompositeOperationType.Luminosity;
                        _bg.DrawImage(CurrentImage, 0f, 0f);
                    }
                    Script.Write("this._bg.globalCompositeOperation = 'destination-in'");
                    _bg.DrawImage(CurrentImage, 0f, 0f);
                    if (adv)
                    {
                        _bg.GlobalCompositeOperation = CanvasTypes.CanvasCompositeOperationType.Hue;
                        _bg.GlobalAlpha = HueRecolorStrength * 0.4f;
                        _bg.DrawImage(CurrentImage, 0f, 0f);
                    }

                }
                useBuffer = true;
            }
            if (Alpha < 1)
            {
                if (Alpha <= 0)
                {
                    return;
                }
                g.GlobalAlpha = g.GlobalAlpha * Alpha;
            }
            //if (rotation != 0)
            {
                float x2 = CurrentImage.Width / 2f;
                float y2 = CurrentImage.Height / 2f;

                X = -x2;
                Y = -y2;
                if (!_transformed)
                {
                    g.Save();
                    _transformed = true;
                }
                g.Translate(x + x2, y + y2);
                centered = true;
                g.Rotate(Rotation);
            }
            if (Flipped)
            {
                if (!_transformed)
                {
                    g.Save();
                    _transformed = true;
                }
                g.Scale(-1, 1);
                //don't translate if it's centered.
                if (!centered)
                {
                    g.Translate(CurrentImage.Width, 0);
                }
            }
            if (Shadow > 0)
            {
                g.ShadowBlur = Shadow;
                g.ShadowColor = Shadowcolor;
                if (!useBuffer && BufferNeedsRedraw)
                {
                    _bg.ShadowBlur = 0;
                    _buffer.Width = CurrentImage.Width;
                    _buffer.Height = CurrentImage.Height;
                    _bg.DrawImage(CurrentImage, 0f, 0f);
                    useBuffer = true;
                    //BufferNeedsRedraw = true;
                }
                useBuffer = true;
                //if ((useBuffer && BufferNeedsRedraw) || Rotation!=0 || true)
                if (BufferNeedsRedraw)
                {
                    HTMLCanvasElement C = Helper.CloneCanvas(_buffer);
                    CanvasRenderingContext2D CG = Helper.GetContext(C);
                    _buffer.Width += (int)(Shadow * 2);
                    _buffer.Height += (int)(Shadow * 2);
                    _bg.ShadowBlur = Shadow;
                    _bg.ShadowColor = Shadowcolor;
                    drawWithShadows(_bg, C, Shadow, Shadow, 0, 0, Shadow / 3f);
                    useBuffer = true;
                }
                X -= Shadow;
                Y -= Shadow;
                g.ShadowBlur = 0;
            }

            if (StretchWidth == 0 && StretchHeight == 0)
            {
                if (Shadow > 0 && false)
                {
                    dynamic I = CurrentImage;
                    if (useBuffer)
                        I = _buffer;
                    drawWithShadows(g, I, X, Y, 0, 0, Shadow / 3);
                }
                else
                {
                    if (!useBuffer)
                    {
                        g.DrawImage(CurrentImage, X, Y);
                    }
                    else
                    {
                        g.DrawImage(_buffer, X, Y);
                    }
                }
            }
            else
            {
                if (Shadow > 0 && false)
                {
                    dynamic I = CurrentImage;
                    if (useBuffer)
                        I = _buffer;
                    drawWithShadows(g, I, X, Y, StretchWidth, StretchHeight, Shadow / 3);
                }
                else
                {
                    if (!useBuffer)
                    {
                        g.DrawImage(CurrentImage, X, Y, StretchWidth, StretchHeight);
                    }
                    else
                    {
                        g.DrawImage(_buffer, X, Y, StretchWidth, StretchHeight);
                    }
                }
            }
            if (_transformed)
            {
                g.Restore();
                _transformed = false;
            }
            if (Shadow > 0)
            {
                g.ShadowBlur = 0;
            }
            if (Alpha < 1)
            {
                g.GlobalAlpha = lastalpha;
            }
            BufferNeedsRedraw = false;
        }

        protected void drawWithShadows(CanvasRenderingContext2D g, dynamic I, float X, float Y, float W, float H, float size)
        {
            if (W == 0)
            {
                W = I.width;
                H = I.height;
            }
            g.ShadowOffsetX = -size;
            g.DrawImage(I, X, Y, W, H);
            g.ShadowOffsetX = size;
            g.DrawImage(I, X, Y, W, H);
            g.ShadowOffsetX = 0;
            g.ShadowOffsetY = -size;
            g.DrawImage(I, X, Y, W, H);
            g.ShadowOffsetY = size;
            g.DrawImage(I, X, Y, W, H);

            g.ShadowOffsetY = 0;
        }


    }
}
