using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    class HealingItem : CollectableItem
    {
        public float healingPower = 1.5f;
        public HealingItem(Game game) : base(game, "heart")
        {
            floats = false;
            magnetDistance = 20;
            sound = "ok";
        }
        public override bool CanCollect(PlayerCharacter player)
        {
            return player.HP < player.maxHP;
        }

        public override void onCollected(PlayerCharacter player)
        {
            player.HP = Math.Min(player.HP + healingPower, player.maxHP);
        }
    }
}
