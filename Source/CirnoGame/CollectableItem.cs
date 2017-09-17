using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public abstract class CollectableItem : Entity
    {
        public bool floats = true;
        public float magnetDistance = 35;
        public float magnetSpeed = 8;
        public float maxFallSpeed = 2;
        public float fallaccel = 0.1f;
        public string itemName;
        public int collectionDelay = 10;
        public string sound = "powerup";
        public CollectableItem(Game game, string itemName) : base(game)
        {
            Ani = new Animation(AnimationLoader.Get("images/items/" + itemName));
            Ani.SetImage();
            this.itemName = itemName;
        }

        public virtual bool CanCollect(PlayerCharacter player)
        {
            return true;
        }

        public override void Update()
        {
            if (collectionDelay > 0)
            {
                collectionDelay--;
            }
            Vector2 C;
            var player = Game.player;

            if (collectionDelay <= 0 && CanCollect(player) && ((C = player.getCenter()).EstimatedDistance(Position) < magnetDistance))
            {
                var C2 = getCenter();
                var P = C - C2;
                var ln = P.Length;
                var spd = magnetSpeed;
                var fspd = spd / Math.Max(1, ln);
                if (ln <= fspd/* && CanCollect(Game.player)*/)
                {
                    //((PlayerCharacter)Game.player).onCollectItem(this);
                    Alive = false;
                    Hspeed = 0;
                    Vspeed = 0;
                    Position.CopyFrom(Game.player.Position);
                    onCollected(((PlayerCharacter)Game.player));
                    PlaySound(sound);
                    return;

                }
                P = P.Normalize(fspd);
                /*x += P.X;
                y += P.Y;*/
                Hspeed = P.X;
                Vspeed = P.Y;

                //Vspeed = 0;
            }
            else if (!floats)
            {
                var F = GetFloor();
                if (F == null)
                {
                    if (Vspeed < maxFallSpeed)
                    {
                        Vspeed = Math.Min(Vspeed + fallaccel, maxFallSpeed);
                    }
                    else
                    {
                        Vspeed = maxFallSpeed;
                    }
                }
                else
                {
                    Vspeed = 0;
                    y = F.GetHitbox().top - Ani.CurrentImage.Height;
                }
                //Hspeed = 0;
                Hspeed = (float)MathHelper.Decelerate(Hspeed, 0.1);
            }
            else
            {
                //Hspeed = 0;
                //Vspeed = 0;
                Hspeed = (float)MathHelper.Decelerate(Hspeed, 0.1);
                Vspeed = (float)MathHelper.Decelerate(Vspeed, 0.1);
            }
            base.Update();
        }
        protected TileData GetFloor()
        {
            TileData T = null;
            float W = Width / 3;
            float Y = Height;
            if (!(T != null && T.enabled && T.topSolid))
            {
                T = Game.TM.CheckForTile(Vector2.Add(Position, Width / 2, Y));
            }
            if (!(T != null && T.enabled && T.topSolid))
            {
                T = Game.TM.CheckForTile(Vector2.Add(Position, W, Y));
            }
            if (!(T != null && T.enabled && T.topSolid))
            {
                T = Game.TM.CheckForTile(Vector2.Add(Position, Width - W, Y));
            }
            if (!(T != null && T.enabled && T.topSolid))
            {
                T = null;
            }
            return T;
        }
        abstract public void onCollected(PlayerCharacter player);
        /*public virtual void onCollected(PlayerCharacter player)
        {

        }*/
    }
}
