using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class TextSprite : Sprite
    {
        protected string _Text;
        public string Text
        {
            get
            {
                return _Text;
            }
            set
            {
                if (_Text != value)
                {
                    _Text = value;
                    /*RedrawBaseTextImage();
                    RenderTextImage();*/
                    textInvallidated = true;
                    //imageInvallidated = true;
                }
            }
        }
        protected bool textInvallidated;
        protected bool imageInvallidated;

        protected HTMLCanvasElement TextImage;
        protected CanvasRenderingContext2D TextGraphic;
        protected string _TextColor;
        public string TextColor
        {
            get
            {
                return _TextColor;
            }
            set
            {
                if (_TextColor != value)
                {
                    _TextColor = value;
                    //RenderTextImage();
                    textInvallidated = true;

                    //imageInvallidated = true;
                }
            }
        }

        protected string _FontWeight = "normal";
        public string FontWeight
        {
            get
            {
                return _FontWeight;
            }
            set
            {
                if (_FontWeight != value)
                {
                    _FontWeight = value;
                    UpdateFont();
                }
            }
        }

        protected string _FontFamily = "sans-serif";
        public string FontFamily
        {
            get
            {
                return _FontFamily;
            }
            set
            {
                if (_FontFamily != value)
                {
                    _FontFamily = value;
                    UpdateFont();
                }
            }
        }

        protected int _FontSize = 10;
        public int FontSize
        {
            get
            {
                return _FontSize;
            }
            set
            {
                if (_FontSize != value)
                {
                    _FontSize = value;
                    UpdateFont();
                }
            }
        }

        protected float _shadowBlur = 0f;
        public float ShadowBlur
        {
            get
            {
                return _shadowBlur;
            }
            set
            {
                if (_shadowBlur != value)
                {
                    _shadowBlur = value;
                    imageInvallidated = true;
                }
            }
        }
        protected Vector2 _shadowOffset = new Vector2();
        public Vector2 ShadowOffset
        {
            get
            {
                return _shadowOffset.Clone();
            }
            set
            {
                if (_shadowOffset != value && value.X != _shadowOffset.X && value.Y != _shadowOffset.Y)
                {
                    _shadowOffset = value.Clone();
                    imageInvallidated = true;
                }
            }
        }
        protected string _shadowColor = "#000000";
        public string ShadowColor
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
                    imageInvallidated = true;
                }
            }
        }

        protected void UpdateFont()
        {
            TextGraphic.Font = _FontWeight + " " + _FontSize + "px " + _FontFamily;
            textInvallidated = true;
            imageInvallidated = true;
            TextGraphic.FillStyle = _TextColor;
        }

        /*protected string Font
        {
            get
            {
                return TextGraphic.Font;
            }
            set
            {
                if (TextGraphic.Font != value)
                {
                    TextGraphic.Font = value;
                    textInvallidated = true;
                    imageInvallidated = true;
                }
                
            }
        }*/
        public TextSprite()
        {
            TextImage = new HTMLCanvasElement();
            TextGraphic = TextImage.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
            TextGraphic.ImageSmoothingEnabled = false;
            //TextGraphic.Font.
            TextImage.Style.ImageRendering = ImageRendering.Pixelated;
            TextGraphic.FillStyle = "#FFFFFF";
        }
        protected void RedrawBaseTextImage()
        {
            UpdateFont();
            string[] lines = _Text.Split('\n');
            float H = FontSize * 1f;


            int W = 0;
            int i = 0;
            while (i < lines.Length)
            {
                TextMetrics TM = TextGraphic.MeasureText(lines[i]);
                W = Math.Max(W, (int)Math.Ceiling(TM.Width));
                i++;
            }
            //TextImage.Height = (int)(H * (lines.Length+0.5f));
            TextImage.Height = (int)(H * (lines.Length + 0.25f));
            TextImage.Width = W;
            UpdateFont();

            float Y = 0;
            i = 0;
            while (i < lines.Length)
            {
                TextGraphic.FillText(lines[i], 0, (int)(FontSize + Y));
                Y += H;
                i++;
            }

            textInvallidated = false;
            imageInvallidated = true;
        }
        protected void RenderTextImage()
        {

            if (_shadowBlur <= 0)
            {
                spriteBuffer.Width = TextImage.Width;
                spriteBuffer.Height = TextImage.Height;
            }
            else
            {
                int S = (int)Math.Ceiling(_shadowBlur + _shadowBlur);
                spriteBuffer.Width = TextImage.Width + S;
                spriteBuffer.Height = TextImage.Height + S;
            }
            spriteGraphics.ShadowBlur = 0;

            spriteGraphics.GlobalCompositeOperation = CanvasTypes.CanvasCompositeOperationType.SourceOver;
            /*spriteGraphics.FillStyle = _TextColor;
            spriteGraphics.FillRect(0, 0, spriteBuffer.Width, spriteBuffer.Height);
            Script.Write("this.spriteGraphics.globalCompositeOperation = 'destination-in'");*/
            if (_shadowBlur <= 0)
            {
                spriteGraphics.DrawImage(TextImage, 0f, 0f);
            }
            else
            {
                spriteGraphics.DrawImage(TextImage, _shadowBlur, _shadowBlur);
            }

            if (_shadowBlur > 0)
            {
                ///spriteGraphics.GlobalCompositeOperation = CanvasTypes.CanvasCompositeOperationType.SourceOver;
                spriteGraphics.ShadowBlur = _shadowBlur;
                spriteGraphics.ShadowColor = _shadowColor;
                spriteGraphics.ShadowOffsetX = _shadowOffset.X;
                spriteGraphics.ShadowOffsetY = _shadowOffset.Y;
                spriteGraphics.DrawImage(spriteBuffer, 0f, 0f);
            }



            imageInvallidated = false;
        }
        public void ForceUpdate()
        {
            if (textInvallidated)
            {
                RedrawBaseTextImage();
            }
            if (imageInvallidated)
            {
                RenderTextImage();
            }
        }
        public override void Draw(CanvasRenderingContext2D g)
        {
            ForceUpdate();
            base.Draw(g);
        }

    }
}
