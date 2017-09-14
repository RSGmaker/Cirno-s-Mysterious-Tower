using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class Sprite
    {
        public Vector2 Position;
        public HTMLCanvasElement spriteBuffer;
        public bool Visible = true;
        protected CanvasRenderingContext2D spriteGraphics;
        public Vector2 Size
        {
            get
            {
                return new Vector2(spriteBuffer.Width, spriteBuffer.Height);
            }
            set
            {
                if (value == null)
                    value = new Vector2();
                spriteBuffer.Width = (int)value.X;
                spriteBuffer.Height = (int)value.Y;
            }
        }
        public virtual CanvasRenderingContext2D GetGraphics()
        {
            return spriteGraphics;
        }
        public Sprite()
        {
            spriteBuffer = new HTMLCanvasElement();
            spriteGraphics = spriteBuffer.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
            spriteGraphics.ImageSmoothingEnabled = false;
            Position = new Vector2();
        }
        public virtual void OnFrame()
        {

        }
        public virtual void Draw(CanvasRenderingContext2D g)
        {
            if (!Visible)
                return;
            g.DrawImage(spriteBuffer, Position.X, Position.Y);
        }
        public virtual Rectangle GetBounds()
        {
            return new Rectangle(Position.X, Position.Y, spriteBuffer.Width, spriteBuffer.Height);
        }
    }
}
