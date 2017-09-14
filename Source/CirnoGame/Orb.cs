using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class Orb : CollectableItem
    {
        public Orb(Game game) : base(game, "orb")
        {
            //Ani = new Animation(AnimationLoader.Get("images/misc/orb"));

        }
        public override void onCollected(PlayerCharacter player)
        {
            //throw new NotImplementedException();
            var time = (1000) * 25;
            if (Game.timeRemaining > 0)
            {
                Game.timeRemaining += time;
                Game.timeRemaining = Math.Min(Game.maxTimeRemaining, Game.timeRemaining);
            }
            else
            {
                Game.timeRemaining += time;
            }
        }
        /*public override void Update()
        {
            if (Game.player.Position.EstimatedDistance(Position) < 35)
            {
                var P = Game.player.Position - Position;
                var ln = P.Length;
                var spd = 8;
                P = P.Normalize(spd / Math.Max(1,ln));
                x += P.X;
                y += P.Y;
                if (ln <= spd)
                {
                    Alive = false;
                }
            }
            base.Update();
        }*/
    }
}
