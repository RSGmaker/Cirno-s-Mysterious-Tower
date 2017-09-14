using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class PlatformerEntity : ControllableEntity
    {
        public float friction = 0.5f;
        public bool onGround;
        public bool GravityEnabled = true;
        //public float gravity = 1.6f;
        //public float gravity = 0.9f;
        //public float gravity = 0.0175f;
        public float gravity = 0.02f;
        public float maxFallSpeed = 2.0f;
        public float feetposition = 23;
        //public float headposition = 4;
        public float headposition = 7;

        public TileData Floor;
        public TileData Ceiling;

        public TileData LeftWall;
        public TileData RightWall;


        public PlatformerEntity(Game game) : base(game)
        {

        }
        public override void Update()
        {
            base.Update();
            if (GravityEnabled)
            {
                if (Vspeed < maxFallSpeed && GravityEnabled)
                {
                    Vspeed = (float)Math.Min(Vspeed + gravity, maxFallSpeed);
                }
            }
            /*if (y > 0 && Vspeed>=0)
            {
                y = 0;
                Vspeed = 0;
                onGround = true;
            }
            if (y < 0)
            {
                onGround = false;
            }*/
            ApplyFriction();
            UpdateTerrainCollision();

            onGround = (Floor != null && Vspeed >= 0);

            if (onGround)
            {
                float Y = Floor.GetTop(getCenter()) - feetposition;
                /*if (y < Y)
                {
                    onGround = false;
                    Floor = null;
                }
                else*/
                {
                    //y = ((Floor.row * Game.TM.tilesize) + Game.TM.position.Y) - feetposition;
                    y = Y;
                    Vspeed = 0;
                    onGround = true;
                }
            }
            if (Ceiling != null && Vspeed < 0/* && !Ceiling.platform*/)
            {
                Vspeed = 0;
                y = ((Ceiling.row * Game.TM.tilesize) + Game.TM.position.Y) + Game.TM.tilesize - headposition;
            }
            if (LeftWall != null)
            {
                Hspeed = Math.Max(0, Hspeed);
            }
            if (RightWall != null)
            {
                Hspeed = Math.Min(0, Hspeed);
            }
        }
        public void ApplyFriction()
        {
            Hspeed = (float)MathHelper.Decelerate(Hspeed, friction);
            if (!GravityEnabled)
                Vspeed = (float)MathHelper.Decelerate(Vspeed, friction);
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
        protected TileData GetCeiling()
        {
            TileData T = null;
            float W = Width / 3;
            //float Y = 16;
            float Y = 0 + headposition;
            if (!(T != null && T.enabled && T.bottomSolid))
            {
                T = Game.TM.CheckForTile(Vector2.Add(Position, W, Y));
            }
            if (!(T != null && T.enabled && T.bottomSolid))
            {
                T = Game.TM.CheckForTile(Vector2.Add(Position, Width - W, Y));
            }
            if (!(T != null && T.enabled && T.bottomSolid))
            {
                T = null;
            }
            return T;
        }
        protected TileData CheckWall(float X)
        {
            TileData T = null;
            /*if (!(T != null && T.enabled && ((T.leftSolid && X > 0) || (T.rightSolid && X < 0))))
            {
                T = Game.TM.CheckForTile(Position + new Vector2(X, (Height / 2)-2));
            }
            if (!(T != null && T.enabled && ((T.leftSolid && X > 0) || (T.rightSolid && X < 0))))
            {
                T = Game.TM.CheckForTile(Position + new Vector2(X, Height-2));
                if (T != null && T.IsSlope)
                {
                    T = null;
                }
            }
            if (!(T != null && T.enabled && ((T.leftSolid && X > 0) || (T.rightSolid && X < 0))))
            {
                T = null;
            }*/
            if (!IsTileObstacle(T, X))
            {
                T = Game.TM.CheckForTile(Vector2.Add(Position, X, (Height / 2) - 2));
            }
            if (!IsTileObstacle(T, X))
            {
                T = Game.TM.CheckForTile(Vector2.Add(Position, X, Height - 2));
            }
            if (!IsTileObstacle(T, X))
            {
                T = null;
            }
            return T;
        }
        protected bool IsTileObstacle(TileData T, float X)
        {
            if (T != null && T.enabled && ((T.leftSolid && X > 0) || (T.rightSolid && X < 0)) && (Floor == null || T.row < Floor.row))
            {
                float Y = y + Height;
                //if (T.GetHitbox().y < Y-28)
                //if (T.GetHitbox().y < Y - 8)
                //if (T.GetHitbox().y < Y - 4)
                if (T.GetHitbox().y < Y - 0)
                {
                    return !T.IsSlope;
                }
            }
            return false;
        }
        protected void UpdateTerrainCollision()
        {
            Floor = GetFloor();
            Ceiling = GetCeiling();


            if (Vspeed < maxFallSpeed && GravityEnabled)
            {
                Vspeed = (float)Math.Min(Vspeed + gravity, maxFallSpeed);
            }
            bool unstuck = false;
            bool stuck = false;
            if (Floor != null)
            {
                bool c = true;
                while (c)
                {
                    TileData T = Floor.GetTileData(0, -1);
                    if (T != null && T.enabled && T.solid)
                    {
                        Floor = T;
                        stuck = true;
                    }
                    else
                    {
                        c = false;
                    }
                }
            }
            stuck = false;
            onGround = false;
            if (Floor != null && Vspeed >= 0)
            {
                //float Y = Floor.GetHitbox().top - Height;
                float Y = Floor.GetTop(getCenter()) - Height;
                //if (!Floor.platform || y <= Y + Vspeed)
                //if (!Floor.platform || y+Vspeed>=Y)
                if ((!Floor.platform || y <= Y + Vspeed) && y + (Vspeed + 10) >= Y)
                {
                    if (Vspeed > 0)
                    {
                        Vspeed = 0;
                        onGround = true;
                    }
                    y = Y;
                }
            }
            if (Hspeed != 0)
            {
                TileData wall = Hspeed > 0 ? RightWall : LeftWall;
                if (wall != null)
                {
                    Hspeed = 0;
                }
            }
            float W = Width / 3;
            float X = (float)Math.Abs(Hspeed);
            if (Hspeed < 0)
            {
                X -= 2 - W;
            }
            else
            {
                X += (Width - W) + 2;
            }
            RightWall = CheckWall(X);

            X = (float)-Math.Abs(Hspeed);
            if (Hspeed < 0)
            {
                X -= 2 - W;
            }
            else
            {
                X += (Width - W) + 2;
            }
            LeftWall = CheckWall(X);
            if (LeftWall != null && LeftWall == RightWall)
            {
                Rectangle R = LeftWall.GetHitbox();
                Vector2 V = R.Center;
                if ((V - Position).X > 0)
                {
                    x += 1;
                    if (Hspeed < 0)
                    {
                        Hspeed = 0;
                    }
                }
                else
                {
                    x -= 1;
                    if (Hspeed > 0)
                    {
                        Hspeed = 0;
                    }
                }
            }
            if (stuck)
            {
                UpdateTerrainCollision();
            }
        }
    }
}
