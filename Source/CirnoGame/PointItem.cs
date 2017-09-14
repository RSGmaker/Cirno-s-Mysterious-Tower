using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class PointItem : CollectableItem
    {
        public PointItem(Game game) : base(game, "point")
        {
            floats = false;
            //magnetDistance = 100;
            magnetDistance = 70;
            magnetSpeed *= 8;
        }
        public override void onCollected(PlayerCharacter player)
        {
            player.score += 5;
        }
    }
}
