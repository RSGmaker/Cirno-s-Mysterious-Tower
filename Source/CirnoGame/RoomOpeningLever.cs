using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class RoomOpeningLever : Entity
    {
        public static RoomOpeningLever TEST;
        public RoomOpeningLever(Game game, Point Tile, MapRoom Target, bool flipped=false) : base(game)
        {
            Ani = new Animation(AnimationLoader._this.GetAnimation("images/misc/lever"));
            Ani.ImageSpeed = 0;
            Block = Tile;
            var T = game.TM.GetTile(Tile.X, Tile.Y);
            TEST = this;
            if (T != null && T.solid)
            {
                if (Target != null)
                {
                    this.Room = Target;
                }
                T.Breakable = false;
                T.CanSlope = false;
                var R = T.GetHitbox();
                if (flipped)
                {
                    Ani.Position.X = R.left - 16;
                    Ani.Flipped = true;
                }
                else
                {
                    Ani.Position.X = R.right;
                }
                Ani.Position.Y = R.top;
            }
            else
            {
                Alive = false;
            }
        }
        public MapRoom Room;
        public Point Block;
        public bool Activated { get; private set; }
        public override void Update()
        {
            base.Update();
            var T = Game.TM.GetTile(Block.X, Block.X);
            if (T != null && T.enabled && T.solid)
            {
                T.Breakable = false;
                T.CanSlope = false;
            }
            else
            {
                Alive = false;
                if (Room != null)
                {
                    Room.ClearRoom();
                    Room.GeneratePlatforms();
                    Room.ApplyBreakable();//attempt to remove seams
                    Room.ForceRedraw();
                }
                //Helper.Log("Removing broken lever...");
            }
            var P = (PlayerCharacter)Game.player;
            if (!Activated && P.Position.EstimatedDistance(Position) < 16 && P.Controller[2])
            {
                Activate();
            }
        }
        public void Activate()
        {
            if (!Activated)
            {
                Activated = true;
                PlaySound("open2");//sounds better than the electronic switch.
                Ani.CurrentFrame = 1;
                Ani.SetImage();
                Ani.Update();
                Room.UnleashSecret();
            }
        }
        public static RoomOpeningLever FindAndPlaceOnWall(Game game,Vector2 P, MapRoom Target)
        {
            var T = game.TM.CheckForTile(P);
            if (T != null)
            {
                var X = T.column;
                var Y = T.row;

                var XD = Math.Random() < 0.5 ? -1 : 1;
                while (true)
                {
                    X += XD;
                    var T2 = game.TM.GetTile(X, Y);
                    if (T2 != null)
                    {
                        if (T2.enabled && T2.solid)
                        {
                            var T3 = game.TM.GetTile(X-XD, Y+1);
                            if (!(T3 != null && T3.enabled && T3.solid))//too close to the floor, the lever could become obscured...
                            {
                                var ret = new RoomOpeningLever(game, new Point(X, Y), Target, XD == 1);
                                return ret.Alive ? ret : null;
                            }
                            else
                            {
                                return null;
                            }
                        }
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            return null;
        }
    }
}
