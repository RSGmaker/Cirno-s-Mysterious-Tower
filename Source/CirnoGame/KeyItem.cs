using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class KeyItem : CollectableItem
    {
        public KeyItem(Game game) : base(game, "key")
        {
            floats = false;
            magnetDistance = 20;
            sound = "smallkey";
        }
        public override bool CanCollect(PlayerCharacter player)
        {
            return player.keys < 5;
        }

        public override void onCollected(PlayerCharacter player)
        {
            player.keys++;
        }
    }
}
