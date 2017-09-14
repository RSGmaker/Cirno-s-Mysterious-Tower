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

        //public Point[] Exits;
        public List<MapRoom> ExitRooms = new List<MapRoom>();//connected rooms

        public static List<MapRoom> PlacedRooms = new List<MapRoom>();
        public MapRoom parent;

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
            while (i < PlacedRooms.Count)
            {
                var P = PlacedRooms[i];
                L.AddRange(System.Linq.Enumerable.Where<global::CirnoGame.MapRoom>(P.ExitRooms, (global::System.Func<global::CirnoGame.MapRoom, bool>)(F => F.CanBePlaced() && !F.placed)));
                i++;
            }
            return L;
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
                    if (CirnoGame.HelperExtensions.ContainsB<global::CirnoGame.MapRoom>(parent.ExitRooms, this))
                    {
                        parent.ExitRooms.Remove(this);
                    }
                }
            }
            return false;
        }
        private void Place()
        {
            var TM = game.TM;
            TM.ClearRect(SX, SY, EX - SX, EY - SY);
            TM._GenRect(SX, SY, EX, EY);

            PlacedRooms.Add(this);
            placed = true;
        }
        public static Vector2 FindAnyEmptySpot()
        {
            if (PlacedRooms.Count < 1)
                return null;
            var i = 0;
            while (i < 10)
            {
                var ret = CirnoGame.HelperExtensions.Pick<global::CirnoGame.MapRoom>(PlacedRooms, RNG).FindEmptySpot();
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
