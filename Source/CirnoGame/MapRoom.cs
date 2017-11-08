using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class MapRoom
    {
        public int SX;
        public int SY;
        public int EX;
        public int EY;

        public bool placed = false;
        public bool secret = false;

        //public Point[] Exits;
        public List<MapRoom> ExitRooms = new List<MapRoom>();//connected rooms

        public static List<MapRoom> PlacedRooms = new List<MapRoom>();
        public static List<MapRoom> OpenRooms = new List<MapRoom>();
        public MapRoom parent;
        public Chest[] goldchests = new Chest[0];

        public Game game;
        public bool IsValid()
        {
            var map = game.TM;
            if (SX >= 0 && SY >= 0 && EX < map.columns && EY < map.rows)
            {
                //in bounds
                return true;
            }
            return false;
        }
        public bool CanBePlaced()
        {
            var map = game.TM;
            if (IsValid())
            {
                if (map.IsRectSolid(SX, SY, EX, EY))//room has no intersecting gaps.
                {
                    return true;
                }
            }
            return false;
        }
        private void GenerateAdjacentRooms()
        {
            var M = GenerateAdjacentRoom(-1, 0);
            if (M != null)
                ExitRooms.Add(M);
            M = GenerateAdjacentRoom(1, 0);
            if (M != null)
                ExitRooms.Add(M);
            if (Math.Random() < 0.5)
            {
                M = GenerateAdjacentRoom(0, -1);
                if (M != null)
                    ExitRooms.Add(M);
                M = GenerateAdjacentRoom(0, 1);
                if (M != null)
                    ExitRooms.Add(M);
            }
        }
        private MapRoom GenerateAdjacentRoom(int Xdir, int Ydir)
        {
            /*var min = 6;
            var max = 18;*/
            var min = 5;
            var max = 13;
            var dif = (max - min);
            int W = (int)(min + (Math.Random() * dif));

            //min += 1;
            min -= 1;
            max -= 3;
            dif = (max - min);
            int H = (int)(min + (Math.Random() * dif));

            var X = -1;
            var Y = -1;
            if (Xdir != 0)
            {
                Y = (int)(SY + (Math.Random() * (EY - SY)));
                if (Xdir < 0)
                {
                    X = SX - W;
                }
                else
                {
                    X = EX;
                }
            }
            else if (Ydir != 0)
            {
                X = (int)(SX + Math.Random() * ((EX - SX)));
                if (Ydir < 0)
                {
                    Y = SY - H;
                }
                else
                {
                    Y = EY;
                }
            }

            if (X >= 0 && Y >= 0)
            {
                var M = new MapRoom();
                M.SX = X;
                M.SY = Y;
                M.EX = X + W;
                M.EY = Y + H;
                M.parent = this;
                M.game = game;
                if (M.CanBePlaced())
                {
                    return M;
                }
            }
            return null;
        }
        public static List<MapRoom> FindValidUnplacedRooms()
        {
            var L = new List<MapRoom>();
            var i = 0;
            var ln = OpenRooms.Count;
            while (i < ln)
            {
                var P = OpenRooms[i];
                L.AddRange(P.ExitRooms.Where((F => F.CanBePlaced() && !F.placed)));
                i++;
            }
            return L;
        }
        public bool ContainsTile(int X,int Y)
        {
            return X >= SX && Y >= SY && X < EX && Y < EY;
        }
        public bool ContainsPosition(Vector2 V)
        {
            int X = (int)((V.X - game.TM.position.X) / game.TM.tilesize);
            int Y = (int)((V.Y - game.TM.position.Y) / game.TM.tilesize);
            return X >= SX && Y >= SY && X < EX && Y < EY;
        }
        public static MapRoom FindRoom(Vector2 V)
        {
            var L = OpenRooms.Where(R => R.ContainsPosition(V)).ToArray();
            if (L.Length > 0)
                return L[0];
            return null;
        }
        /// <summary>
        /// clears out the room's area, and attempts to generate exitrooms.
        /// If the room is invalid it does nothing, and removes itself from it's parent list.
        /// </summary>
        /// <returns>returns true if it was valid and was placed.</returns>
        public bool PlaceAndExpand()
        {
            if (ExitRooms.Count < 1 && !placed && CanBePlaced())
            {
                Place();
                if (placed)
                {
                    GenerateAdjacentRooms();
                }
                return placed;
            }
            else if (!placed)
            {
                if (parent != null)
                {
                    if (parent.ExitRooms.ContainsB(this))
                    {
                        parent.ExitRooms.Remove(this);
                    }
                }
            }
            return false;
        }
        void GenerateGoldChests()
        {
            var locked = !OpenRooms.Contains(this);

            var V = FindEmptySpot();
            var chest = new Chest(game);
            goldchests.Push(chest);
            chest.ForceLocked = locked;
            chest.Position.CopyFrom(V);
            chest.Goldify();
            game.AddEntity(chest);

            Vector2 V2 = FindEmptySpot();
            var attempts = 0;
            while (attempts++ < 5 && (V2 == null || Math.Abs(V2.X - V.X) < 16)) { V2 = FindEmptySpot(); }

            if (V2 != null && Math.Abs(V2.X - V.X) > 16)
            {
                chest = new Chest(game);
                goldchests.Push(chest);
                chest.Position.CopyFrom(V2);
                chest.ForceLocked = locked;
                chest.Goldify();
                game.AddEntity(chest);
            }
        }
        public void NMakeSecret()//broken
        {
            var TM = game.TM;
            var W = EX - SX;
            var H = EY - SY;
            //TM.FillRect(SX, SY, W, H);
            //ClearRoom();
            ///TM.ClearRect(SX, SY, W, H);
            TM.DrawRect(SX, SY, W, H);
            TM.SetBreakableRect(SX, SY, W, H, false);
            TM.ClearRect(SX + 1, SY + 1, W - 2, H - 2);

            ///TM._GenRect(SX, SY, EX, EY);
            ////TM.SetBreakableRect(SX + 1, SY + 1, W - 2, H - 2, true);
            if (OpenRooms.Contains(this))
            {
                OpenRooms.Remove(this);
            }
            secret = true;

            GenerateGoldChests();
            
            ForceRedraw();
        }
        public void MakeSecret()
        {
            var TM = game.TM;
            var W = EX - SX;
            var H = EY - SY;
            TM.FillRect(SX, SY, W, H);
            TM.SetBreakableRect(SX, SY, W, H,false);
            TM.SetBreakableRect(SX+1, SY+1, W-2, H-2, true);
            if (OpenRooms.Contains(this))
            {
                OpenRooms.Remove(this);
            }
            secret = true;
        }
        public void NUnleashSecret()//broken
        {
            var TM = game.TM;

            TM.ClearOuterRect(SX, SY, (EX - SX), (EY - SY), false);
            //TM.ClearRect(SX+1, SY+1, (EX - SX)-2, (EY - SY)-2);
            //TM._GenRect(SX, SY, EX, EY);

            OpenRooms.Add(this);
            goldchests.ForEach(C => C.ForceLocked = false);

            ForceRedraw();
        }
        public void UnleashSecret()
        {
            var TM = game.TM;

            TM.ClearRect(SX + 1, SY + 1, (EX - SX) - 2, (EY - SY) - 2);
            TM._GenRect(SX, SY, EX, EY);

            OpenRooms.Add(this);

            GenerateGoldChests();
            ForceRedraw();
        }
        public void ClearRoom()
        {
            var TM = game.TM;

            TM.ClearRect(SX, SY, EX - SX, EY - SY);
        }
        public void GeneratePlatforms()
        {
            var TM = game.TM;
            TM._GenRect(SX, SY, EX, EY);
        }
        private void Place()
        {
            var TM = game.TM;
            TM.ClearRect(SX, SY, EX - SX, EY - SY);
            TM._GenRect(SX, SY, EX, EY);

            PlacedRooms.Add(this);
            OpenRooms.Add(this);
            placed = true;
        }
        public void ApplyBreakable()
        {
            var TM = game.TM;
            TM.ApplyBreakableRect(SX - 2, SY - 2, (EX - SX) + 4, (EY - SY) + 4);
        }
        public void ForceRedraw()
        {
            var TM = game.TM;
            var X = SX - 2;
            var Y = SY - 2;
            var W = (EX - SX)+4;
            var H = (EY - SY)+4;
            TM.bg.ClearRect((int)TM.tilesize * X, (int)TM.tilesize * Y, (int)TM.tilesize * W, (int)TM.tilesize * H);

            TM.Redraw(TM.bg, X, Y, W, H);
        }
        public static Vector2 FindAnyEmptySpot()
        {
            if (OpenRooms.Count < 1)
                return null;
            var i = 0;
            while (i < 10)
            {
                var ret = OpenRooms.Pick(RNG).FindEmptySpot();
                if (ret != null)
                    return ret;
                i++;
            }
            return null;
        }
        private static Random RNG = new Random();
        public Vector2 FindEmptySpot()
        {
            var W = EX - SX;
            var H = EY - SY;
            var i = 0;
            var map = game.TM;
            while (i < 50)
            {
                var X = (int)(SX + Math.Random() * W);
                var Y = (int)(SY + Math.Random() * H);
                var T = map.GetTile(X, Y);
                if (T != null && (!T.enabled || !T.solid))
                {
                    T = map.GetTile(X, Y - 1);
                    if (T != null && (!T.enabled || !T.solid))
                    {
                        return new Vector2(map.position.X + (X * map.tilesize), map.position.Y + (Y * map.tilesize));
                    }
                }
                i++;
            }
            return null;
        }
        /*private static TileData blank = new TileData();
        private static void Erase(TileMap TM, int column, int row, int size)
        {
            TM.ClearRect(column - (size / 2), row - (size / 2), (size), (size));
        }
        private static void EraseAndRando(TileMap TM, int column, int row, int size)
        {
            var SX = column - (size / 2);
            var SY = row - (size / 2);
            TM.ClearRect(SX, SY, (size), (size));
            TM._GenRect(SX, SY, SX + (size), SY + (size));
        }*/
    }
}
