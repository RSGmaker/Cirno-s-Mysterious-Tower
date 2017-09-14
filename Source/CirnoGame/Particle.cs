using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class Particle : Entity
    {
        public int HP = 12;
        public float alphatime = 0.2f;

        public Particle(Game game, HTMLImageElement image) : base(game)
        {
            Ani = new Animation(new List<HTMLImageElement>(new HTMLImageElement[] { image }));
        }
        public override void Update()
        {
            HP--;
            if (HP <= 0)
            {
                if ((Ani.Alpha -= alphatime) <= 0)
                {
                    Alive = false;
                }
                /*if (alphatime > 0)
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
            base.Update();
        }
    }
}
