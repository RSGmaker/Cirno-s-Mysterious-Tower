using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class TileData
    {
        public int texture;
        public int row;
        public int column;
        public bool enabled;
        public TileMap map;
        public bool visible;

        public bool topSolid;
        public bool rightSolid;
        public bool leftSolid;
        public bool bottomSolid;

        public bool CanSlope;

        public bool Breakable = false;
        public float HP = 4;
        public float maxHP = 4;
        public bool opaque = true;

        private Rectangle _hitbox;

        public Action<PlatformerEntity> SteppedOn;

        public TileData Clone()
        {
            var T = new TileData();
            T.texture = texture;
            T.enabled = enabled;
            T.map = map;
            T.visible = visible;
            T.topSolid = topSolid;
            T.rightSolid = rightSolid;
            T.leftSolid = leftSolid;
            T.bottomSolid = bottomSolid;
            T.CanSlope = CanSlope;
            return T;
        }

        public bool Damage(float damage)
        {
            HP -= damage;
            if (HP <= 0 && topSolid)
            {
                solid = false;
                visible = false;
                enabled = false;
                /*enabled = true;
                visible = true;
                texture = 2;*/
                /*map.ForceRedraw();*/
                UpdateTile();
                SpawnParticles();
                return true;
            }
            else
            {
                map.RedrawTile(column, row, false);
                return false;
            }
        }
        public void UpdateTile()
        {
            map.RedrawTile(column, row);
        }
        private void SpawnParticles()
        {
            var tx = (int)MathHelper.Clamp(texture, 0, map.tiles.Count - 1);
            var T = map.tiles[tx];

            var sz = (int)(map.tilesize / 2);
            var G = map.game;
            var HB = GetHitbox();
            //var spd = 1.5f;
            var spd = 1;


            var C = new HTMLCanvasElement();
            C.Width = sz;
            C.Height = sz;
            var g = Helper.GetContext(C);

            g.DrawImage(T, 0, 0, sz, sz, 0, 0, sz, sz);
            var P = new Particle(G, C.As<HTMLImageElement>());
            P.Hspeed = -spd;
            P.Vspeed = -spd;
            P.x = HB.left;
            P.y = HB.top;
            G.AddEntity(P);

            //
            C = new HTMLCanvasElement();
            C.Width = sz;
            C.Height = sz;
            g = Helper.GetContext(C);

            g.DrawImage(T, sz, 0, sz, sz, 0, 0, sz, sz);
            P = new Particle(G, C.As<HTMLImageElement>());
            P.Hspeed = spd;
            P.Vspeed = -spd;
            P.x = HB.left + sz;
            P.y = HB.top;
            G.AddEntity(P);

            //
            C = new HTMLCanvasElement();
            C.Width = sz;
            C.Height = sz;
            g = Helper.GetContext(C);

            g.DrawImage(T, 0, sz, sz, sz, 0, 0, sz, sz);
            P = new Particle(G, C.As<HTMLImageElement>());
            P.Hspeed = -spd;
            P.Vspeed = spd;
            P.x = HB.left;
            P.y = HB.top + sz;
            G.AddEntity(P);

            //
            C = new HTMLCanvasElement();
            C.Width = sz;
            C.Height = sz;
            g = Helper.GetContext(C);

            g.DrawImage(T, sz, sz, sz, sz, 0, 0, sz, sz);
            P = new Particle(G, C.As<HTMLImageElement>());
            P.Hspeed = spd;
            P.Vspeed = spd;
            P.x = HB.left + sz;
            P.y = HB.top + sz;
            G.AddEntity(P);
        }

        public bool solid
        {
            get
            {
                return topSolid && rightSolid && leftSolid && bottomSolid;
            }
            set
            {
                topSolid = value;
                leftSolid = value;
                rightSolid = value;
                bottomSolid = value;
            }
        }
        Rectangle HR = new Rectangle();
        public Rectangle GetHitbox()
        {
            /*if (_hitbox == null)
            {
                var tsz = map.tilesize;
                var pos = map.position;
                _hitbox = new Rectangle(pos.X + (column * tsz), pos.Y + (row * tsz), tsz, tsz);
            }*/
            var tsz = map.tilesize;
            var pos = map.position;
            HR.Set(pos.X + (column * tsz), pos.Y + (row * tsz), tsz, tsz);
            return HR;
            //return new Rectangle(pos.X + (column * tsz), pos.Y + (row * tsz), tsz, tsz);
            //return _hitbox;
        }
        public void GetHitbox2(Rectangle OUT)
        {
            /*if (_hitbox == null)
            {
                var tsz = map.tilesize;
                var pos = map.position;
                _hitbox = new Rectangle(pos.X + (column * tsz), pos.Y + (row * tsz), tsz, tsz);
            }*/
            var tsz = map.tilesize;
            var pos = map.position;
            OUT.x = pos.X + (column * tsz);
            OUT.y = pos.Y + (row * tsz);
            OUT.width = tsz;
            OUT.height = tsz;
            //return _hitbox;
        }
        public bool platform
        {
            get
            {
                return topSolid && !rightSolid && !leftSolid && !bottomSolid;
            }
        }
        public TileData GetTileData(int relativeX, int relativeY)
        {
            return map.GetTile(column + relativeX, row + relativeY);
        }
        public bool solidToSpeed(Vector2 angle)
        {
            if (!enabled)
                return false;
            if (angle.RoughLength == 0)
            {
                return solid;
            }
            else
            {
                if ((angle.X > 0 && leftSolid) || (angle.X < 0 && rightSolid) || (angle.Y > 0 && topSolid) || (angle.Y > 0 && bottomSolid))
                {
                    return true;
                }
            }
            return false;
        }
        public float GetTop(Vector2 position)
        {

            /*TileData Left = GetTileData(-1, 0);
            TileData Right = GetTileData(1, 0);
            bool Lsolid = Left != null && Left.enabled && Left.solid;
            bool Rsolid = Right != null && Right.enabled && Right.solid;*/
            int direction = SlopeDirection;
            //if (!CanSlope || !solid || (Lsolid && Rsolid))
            var tsz = map.tilesize;
            if (direction == 0)
            {
                //return R.top;

                var pos = map.position;
                return pos.Y + (row * tsz);
            }
            else
            {
                Rectangle R = GetHitbox();
                float Y = ((R.right - position.X) / R.width) * tsz;
                if (direction > 0)
                {
                    Y = (tsz - Y);
                }
                //Y *= 1.0f;
                Y = (float)Math.Min(tsz, Math.Max(0, Y));
                return R.bottom - Y;
                //return (float)Math.Min(R.top, Math.Max(R.bottom,((R.right - position.X) / R.width) * R.height));
            }
        }
        public bool IsSlope
        {
            get
            {
                return SlopeDirection != 0;
            }
        }
        public int SlopeDirection
        {
            get
            {
                if (!CanSlope)
                {
                    return 0;
                }
                TileData Bottom = GetTileData(0, 1);
                if (!(Bottom != null && Bottom.enabled && Bottom.solid))
                {
                    return 0;
                }
                TileData Left = GetTileData(-1, 0);
                TileData Right = GetTileData(1, 0);
                bool Lsolid = Left != null && Left.enabled && Left.solid;
                bool Rsolid = Right != null && Right.enabled && Right.solid;
                if (!CanSlope || !solid || (Lsolid && Rsolid) || (!Rsolid && !Lsolid))
                {
                    return 0;
                }
                TileData Top = GetTileData(0, -1);
                bool Tsolid = Top != null && Top.enabled && Top.solid;
                if (Tsolid)
                {
                    return 0;
                }
                if (Rsolid)
                {
                    return 1;
                }
                else
                {
                    return -1;
                }
            }
        }
    }
}
