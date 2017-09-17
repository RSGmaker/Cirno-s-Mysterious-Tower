using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge.Html5;

namespace CirnoGame
{
    public class FloatingMessage : Entity
    {
        public int time = 30;
        public TextSprite Text;
        float alpha = 1;
        public bool autokill = true;
        public FloatingMessage(Game game, string text) : base(game)
        {
            Ani = new Animation(null);
            Text = new TextSprite();
            Text.Text = text;
            Text.TextColor = "#FFFFFF";
            Text.ShadowColor = "#000000";
            Text.ShadowOffset = new Vector2(2, 2);
            Text.ShadowBlur = 1;
            Text.FontSize = 14;
            time = 30 + (text.Length * 20);
        }
        public void ChangeText(string text,string color=null)
        {
            Text.Text = text;
            time = 30 + (text.Length * 20);
            alpha = 1;
            if (color != null)
            {
                Text.TextColor = color;
            }
        }
        public override void Update()
        {
            base.Update();
            if (time > 0)
            {
                time--;
                if (time < 1 && alpha>0)
                {
                    //Alive = false;
                    alpha -= 0.05f;
                    if (alpha <= 0)
                    {
                        alpha = 0;
                        if (autokill)
                        {
                            Alive = false;
                        }
                    }
                    time = 1;
                }
            }
        }
        public override void Draw(CanvasRenderingContext2D g)
        {
            //base.Draw(g);
            if (alpha < 1)
            {
                if (alpha <= 0)
                {
                    return;
                }
                g.GlobalAlpha = alpha;
            }
            //Text.Position.CopyFrom(Position);
            Text.ForceUpdate();
            Text.Position.X = (int)Position.X - (Text.spriteBuffer.Width / 2);
            Text.Position.Y = (int)Position.Y - (Text.spriteBuffer.Height / 2);
            Text.Draw(g);
            g.GlobalAlpha = 1f;
        }
    }
}
