using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class ExitDoor : Entity
    {
        private int reset = 0;
        private TileData RT;
        private bool _Opened = false;
        public bool Opened
        {
            get
            {
                return _Opened;
            }
            set
            {
                _Opened = value;
                if (_Opened)
                {
                    Ani.CurrentFrame = 1;
                    Ani.SetImage();
                }
                else
                {
                    Ani.CurrentFrame = 0;
                    Ani.SetImage();
                }
            }
        }
        public ExitDoor(Game game) : base(game)
        {
            Ani = new Animation(AnimationLoader.Get("images/misc/door"));
            Ani.ImageSpeed = 0;
            Ani.SetImage();
            RemovedOnLevelEnd = false;
        }
        public void DropToGround()
        {
            while (GetFloor() == null)
            {
                y += 16;
            }
            var F = GetFloor();
            //F.Breakable = false;
            var FB = F.GetHitbox();
            x = FB.left;
            y = FB.top - 32;
            var T = Game.TM.GetTile(F.column, F.row - 1);
            if (T != null && T.enabled && T.topSolid)
            {
                y -= 16;
                F = T;
                Helper.Log("dug door out of the ground");

            }
            RT = F;
            /*F.Breakable = false;
            F.texture = 0;

            Game.TM.RedrawTile(F.column, F.row);*/
            reset = 0;

        }
        public override void Update()
        {
            base.Update();
            if (!_Opened)
                return;
            /*var F = GetFloor();
            if (F == null)
            {
                Vspeed = 1;
            }
            else
            {
                Vspeed = 0;
                y = F.GetHitbox().top - Ani.CurrentImage.Height;
            }*/
            var P = (PlayerCharacter)Game.player;
            if (P.Position.EstimatedDistance(Position) < 20 && P.Controller[2])
            {
                Opened = false;
                P.score += (Game.level * 10);

                var time = (1000) * 13;
                if (Game.timeRemaining > 0)
                {
                    Game.timeRemaining += time;
                    Game.timeRemaining = Math.Min(Game.defaultTimeRemaining, Game.timeRemaining);
                }
                else
                {
                    Game.timeRemaining += time;
                }
                Game.StartNextLevel();

                /*P.keys--;
                Open(P);*/
                /*Ani.CurrentFrame = 1;
                Ani.SetImage();
                Ani.Update();*/
            }
            if (reset < 2)
            {
                reset++;
                //reset = false;
                //var F = GetFloor();
                var F = RT;
                if (F != null && reset == 2)
                {
                    F.Breakable = false;
                    F.texture = 0;
                    Game.TM.RedrawTile(F.column, F.row);
                }
            }
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
    }
}
