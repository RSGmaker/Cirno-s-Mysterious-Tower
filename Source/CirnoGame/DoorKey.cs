using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class DoorKey : CollectableItem
    {
        public DoorKey(Game game) : base(game, "bigkey")
        {
            floats = false;
            magnetDistance = 20;
            sound = "key";
        }

        public override void onCollected(PlayerCharacter player)
        {
            //throw new NotImplementedException();
            Game.Door.Opened = true;

            FloatingMessage FM = new FloatingMessage(Game, "Door Unlocked!");
            FM.Text.TextColor = "#77FFFF";
            FM.Position = new Vector2(x + 8, y - 20);
            Game.AddEntity(FM);
        }
        public override void Update()
        {
            base.Update();
            if (y <= 0)
            {
                Game.LevelRestart();
            }
        }
    }
}
