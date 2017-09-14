using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge.Html5;

namespace CirnoGame
{
    public class Tile : Entity
    {
        public int tile;
        public Tile(Game game, int tile) : base(game)
        {
            this.tile = tile;
            Ani = new Animation(AnimationLoader.Get("images/land/brick"));
            Ani.CurrentFrame = tile;
            Ani.ImageSpeed = 0;
        }
        public override void Draw(CanvasRenderingContext2D g)
        {
            /*if (tile>=0 && tile < ani.images.Count)
            {
                ani.currentFrame = tile;
            }*/
            base.Draw(g);
        }
    }
}
