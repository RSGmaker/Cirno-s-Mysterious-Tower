using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class ConveyorBelt : Entity
    {
        public TileData TTD;

        public ConveyorBelt(Game game) : base(game)
        {
            Ani = new Animation(AnimationLoader._this.GetAnimation("images/misc/conveyor"));
            Ani.ImageSpeed = 0.15f;
            Ani.SetImage();
        }

        public void SetDown()
        {
            var TM = Game.TM;
            var TZ = TM.tilesize;
            var TD = TM.CheckForTile(Position);
            var attempts = 0;
            var direction = TZ;
            while (!(TD != null && TD.solid && TD.visible) && attempts < 20)
            {
                y += direction;
                TD = TM.CheckForTile(Position);
            }
            //bring above the tile
            //y -= direction;
            if (attempts >= 20)
            {
                Alive = false;
                return;
            }
            else
            {
                x = (TD.column * TZ) + TM.position.X;
                y = ((TD.row-1) * TZ) + TM.position.Y;
                //TD.HP = TD.maxHP * 2;
            }
            TTD = TD;
            //Ani.Flipped = Math.Random() < 0.5;

            //this method will allow adjacent ConveyorBelts to flow in the same direction.
            Ani.Flipped = (TD.row & 4) > 0;

            if (!Ani.Flipped)
            {
                TTD.SteppedOn = E =>
                {
                    /*if (E.LeftWall == null)
                    {
                        E.x -= 0.5f;
                    }*/
                    E.Hspeed -= 0.36f;
                };
            }
            else
            {
                TTD.SteppedOn = E =>
                {
                    /*if (E.RightWall == null)
                    {
                        E.x += 0.5f;
                    }*/
                    E.Hspeed += 0.36f;
                };
            }


            
        }
        Vector2 tmp = new Vector2();

        public override void Update()
        {
            var Pos = Ani.Position;
            var TM = Game.TM;
            tmp.X = Pos.X;
            tmp.Y = Pos.Y + TM.tilesize;
            var TD = TM.CheckForTile(tmp);
            if (TD != TTD && Alive)
            {
                TTD.SteppedOn = null;
                Alive = false;
                return;
            }
            if (TD != null && TD.solid && TD.visible && TD.opaque)
            {
                if (TD.HP < 3.25 && Ani.ImageSpeed > 0)
                {
                    //break conveyer belt
                    Ani.ImageSpeed = 0;
                    TTD.SteppedOn = null;
                }
            }
            else if (Alive)
            {
                Alive = false;
                TTD.SteppedOn = null;
                return;
            }
            if (TD.CanSlope)
            {
                var redraw = false;
                if (TD.SlopeDirection != 0)
                {
                    redraw = true;
                }
                TD.CanSlope = false;
                if (redraw)
                {
                    TD.UpdateTile();
                }
            }
            base.Update();

        }
    }
}
