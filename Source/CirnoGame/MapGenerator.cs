using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class MapGenerator
    {
        public static MapRoom rootroom;
        public static MapRoom doorroom;
        public static MapRoom keyroom;
        //old method
        /*public static void Generate(Game game)
        {
            var player = game.player;//player character
            var map = game.TM;//the tilemap to generate
            var bounds = game.stageBounds;//the bounds to stay within

            //List<Rectangle> rooms = new List<Rectangle>();

            var X = 0;
            var Y = 0;
            if (Math.Random() < 0.5)
                X = Math.Random() < 0.5 ? -1 : 1;
            else
                Y = Math.Random() < 0.5 ? -1 : 1;
            TileData T = new TileData();
            T.texture = 1;
            T.enabled = true;
            T.visible = true;
            T.map = map;
            T.solid = true;
            T.topSolid = true;
            //map.SetAll(T);
            player.x = (bounds.left + bounds.right) / 2;
            player.y = (bounds.top + bounds.bottom) / 2;
            //pathMiner(game,map.columns/2,map.rows/2,X,Y,20);
            pathMiner(game, map.columns / 2, map.rows / 4, X, Y, 30);

            var V = FindEmptySpace(game);
            if (V != null)
            {
                player.x = V.X;
                player.y = V.Y;
                Helper.Log("spawning at:" + (int)V.X + "," + (int)V.Y);
            }
            else
            {
                Helper.Log("cannot locate a spawn point...");
            }
        }*/
        public Game game;
        bool started = false;
        MapRoom root;
        int roomtotal;
        public bool generated = false;
        public bool finished = false;
        int attempts = 0;
        public void Generate(int rooms=1)
        {
            if (generated)
            {
                return;
            }
            //var player = game.player;//player character
            var map = game.TM;//the tilemap to generate
            var bounds = game.stageBounds;//the bounds to stay within
            

            var SX = map.columns / 2;
            var SY = map.rows / 3;
            if (!started)
            {
                Helper.Log("started boxy generate");

                root = new MapRoom();
                root.SX = SX;
                root.SY = SY;
                root.EX = SX + 6 + (int)(Math.Random() * 10);
                root.EY = SY + 6 + (int)(Math.Random() * 10);

                root.game = game;
                rootroom = root;

                MapRoom.PlacedRooms = new List<MapRoom>();
                MapRoom.OpenRooms = new List<MapRoom>();

                var roomMinimum = 10 + Math.Min(game.level, 4);
                roomtotal = roomMinimum + (int)(Math.Random() * (roomMinimum));

                if (!root.PlaceAndExpand())
                {
                    Helper.Log("Couldn't generate root room.");
                    generated = true;
                    return;
                }
                attempts = 400;

                started = true;
            }

            //var roomtotal = 12+(int)(Math.Random() * 10);
            //var roomtotal = 16 + (int)(Math.Random() * 16);

            //var roomMinimum = 16;
            
            //var rooms = 0;

            var R = root;

            //while (MapRoom.OpenRooms.Count < roomtotal && attempts > 0)
            if (MapRoom.OpenRooms.Count < roomtotal && attempts > 0)
            {
                //number of rooms to attempt to do per 
                while (rooms > 0 && (MapRoom.OpenRooms.Count < roomtotal && attempts > 0))
                {
                    var L = MapRoom.FindValidUnplacedRooms().Pick();
                    if (L.PlaceAndExpand())
                    {
                        //rooms++;
                    }
                    attempts--;
                    rooms--;
                }
            }
            else
            {
                //finishGeneration();
                generated = true;
                Helper.Log("basic generation completed");
            }
        }
        public void finishGeneration()
        {
            if (!generated)
            {
                Helper.Log("finishgeneration() was called before basic generation was completed, aborting...");
                return;
            }
            var player = game.player;//player character

            var RR = game.stageBounds - game.TM.position;
            RR.width -= game.TM.tilesize;
            RR.height -= game.TM.tilesize;
            game.TM.DrawRect(RR);
            game.TM.ApplyBreakable();
            var secrets = Math.Random() < 0.3 ? 1 : 0;
            if (secrets > 0 && Math.Random() < 0.3)
            {
                secrets++;
            }
            while (secrets > 0)
            {
                var L = MapRoom.FindValidUnplacedRooms().Pick();
                if (L.PlaceAndExpand())
                {
                    L.MakeSecret();
                    var lever = AttemptCreateLever(game, L);
                    game.AddEntity(lever);
                    Helper.Log("Placed secret room at:" + L.SX + "," + L.SY);
                }
                secrets--;
            }
            var V = FindEmptySpace(game);
            keyroom = null;
            if (V != null)
            {
                game.Door.Position.CopyFrom(V);
                game.Door.DropToGround();
                doorroom = MapRoom.FindRoom(game.Door.Position);
                if (doorroom == null)
                {
                    Helper.Log("Door room could not be determined...");
                }

                var PC = (PlayerCharacter)player;
                //PC.MoveToNewSpawn(V);
                PC.MoveToNewSpawn(game.Door.Position);
                Helper.Log("spawning at:" + (int)V.X + "," + (int)V.Y);
            }
            else
            {
                Helper.Log("cannot locate a spawn point...");
            }
            finished = true;
        }
        public void forceGeneration()
        {
            if (finished)
            {
                Helper.Log("cant force generate, an already generated map.");
                return;
            }
            if (!generated)
            {
                Generate(attempts+1);
            }
            finishGeneration();
        }
        /*public static void BoxyGenerate(Game game)
        {
            Helper.Log("boxy generate");
            var player = game.player;//player character
            var map = game.TM;//the tilemap to generate
            var bounds = game.stageBounds;//the bounds to stay within
            MapRoom.PlacedRooms = new List<MapRoom>();
            MapRoom.OpenRooms = new List<MapRoom>();

            var SX = map.columns / 2;
            var SY = map.rows / 3;
            var root = new MapRoom();
            root.SX = SX;
            root.SY = SY;
            root.EX = SX + 6 + (int)(Math.Random() * 10);
            root.EY = SY + 6 + (int)(Math.Random() * 10);

            root.game = game;
            rootroom = root;

            //var roomtotal = 12+(int)(Math.Random() * 10);
            //var roomtotal = 16 + (int)(Math.Random() * 16);

            //var roomMinimum = 16;
            var roomMinimum = 10+Math.Min(game.level,4);
            var roomtotal = roomMinimum + (int)(Math.Random() * (roomMinimum));
            //var rooms = 0;

            var attempts = 400;
            var R = root;
            if (!root.PlaceAndExpand())
            {
                Helper.Log("Couldn't generate root room.");
                return;
            }
            while (MapRoom.OpenRooms.Count < roomtotal && attempts > 0)
            {
                var L = MapRoom.FindValidUnplacedRooms().Pick();
                if (L.PlaceAndExpand())
                {
                    //rooms++;
                }
                attempts--;
            }
            var RR = game.stageBounds - game.TM.position;
            RR.width -= game.TM.tilesize;
            RR.height -= game.TM.tilesize;
            game.TM.DrawRect(RR);
            game.TM.ApplyBreakable();
            var secrets = Math.Random()<0.3 ? 1 : 0;
            if (secrets > 0 && Math.Random() < 0.3)
            {
                secrets++;
            }
            while (secrets > 0)
            {
                var L = MapRoom.FindValidUnplacedRooms().Pick();
                if (L.PlaceAndExpand())
                {
                    L.MakeSecret();
                    var lever = AttemptCreateLever(game, L);
                    game.AddEntity(lever);
                    Helper.Log("Placed secret room at:" + L.SX + "," + L.SY);
                }
                secrets--;
            }
            var V = FindEmptySpace(game);
            keyroom = null;
            if (V != null)
            {
                game.Door.Position.CopyFrom(V);
                game.Door.DropToGround();
                doorroom = MapRoom.FindRoom(game.Door.Position);
                if (doorroom == null)
                {
                    Helper.Log("Door room could not be determined...");
                }
                
                var PC = (PlayerCharacter)player;
                //PC.MoveToNewSpawn(V);
                PC.MoveToNewSpawn(game.Door.Position);
                Helper.Log("spawning at:" + (int)V.X + "," + (int)V.Y);
            }
            else
            {
                Helper.Log("cannot locate a spawn point...");
            }

        }*/
        public static RoomOpeningLever AttemptCreateLever(Game game,MapRoom Target)
        {
            var i = 0;
            while (i < 20)
            {
                var lever = RoomOpeningLever.FindAndPlaceOnWall(game, MapRoom.FindAnyEmptySpot(), Target);
                if (lever != null)
                {
                    return lever;
                }
            }
            return null;
        }
        public static Vector2 FindEmptySpace(Game game)
        {
            var map = game.TM;
            var bounds = game.stageBounds;//the bounds to stay within
            var i = 0;
            var ret = new Vector2();
            var tmp = new Vector2();
            while (i < 2000)
            {
                ret.X = (float)(bounds.left + (Math.Random() * (bounds.width - map.tilesize)));
                ret.Y = (float)(bounds.top + (Math.Random() * (bounds.bottom - map.tilesize)));
                if (!map.CheckForTile(ret).visible)
                {
                    tmp.X = ret.X;
                    tmp.Y = ret.Y - map.tilesize;
                    if (!map.CheckForTile(ret).visible)
                    {
                        return ret;
                    }
                }
                i++;
            }
            //return ret;
            return null;
        }
        //create tunnels hallways etc
        private static void pathMiner(Game game, int X, int Y, int Xdir, int YDir, int limit)
        {
            if (limit <= 0)
            {
                return;
            }
            var player = game.player;//player character
            var map = game.TM;//the tilemap to generate
            var bounds = game.stageBounds;//the bounds to stay within

            var dist = 0;
            var pow = 1;
            if (YDir != 0)
            {
                pow = 2;
            }
            while (dist < 7 && Math.Random() < (Math.Pow(0.95, pow)))
            {
                X += Xdir;
                Y += YDir;
                Erase(map, X, Y, 3);
                if (Math.Random() < (0.2 * pow))
                {
                    if (Xdir == 0)
                        X += Math.Random() < 0.5 ? 1 : -1;
                    else
                        Y += Math.Random() < 0.5 ? 1 : -1;
                }
                else if (Math.Random() < (0.02 * pow) && limit > 4)
                {
                    limit = limit / 2;
                    var XD = Math.Random() < 0.5 ? YDir : -YDir;
                    var YD = Math.Random() < 0.5 ? Xdir : -Xdir;
                    pathMiner(game, X, Y, XD, YD, limit);
                }
            }
            limit--;
            if (limit > 1)
            {
                roomMiner(game, X, Y, Xdir, YDir, limit);
            }

        }
        private static void roomMiner(Game game, int X, int Y, int Xdir, int YDir, int limit)
        {
            if (limit <= 0)
            {
                return;
            }

            var SZ = (int)(4 + (Math.Random() * 4));
            X += Xdir * (SZ / 2);
            Y += YDir * (SZ / 2);

            //Erase(game.TM, X, Y, (SZ * 2)+2);
            EraseAndRando(game.TM, X, Y, (SZ * 2) + 2);

            var XD = Xdir;
            var YD = YDir;
            if (Math.Random() < 0.20 || (YD != 0 && Math.Random() < 0.65) || YD < 0)
            {
                XD = Math.Random() < 0.5 ? YDir : -YDir;
                YD = Math.Random() < 0.5 ? Xdir : -Xdir;
                if (YD < 0)
                {
                    YD = -YD;
                }
            }
            Xdir = XD;
            YDir = YD;

            X += Xdir * (SZ / 2);
            Y += YDir * (SZ / 2);

            limit--;
            pathMiner(game, X, Y, Xdir, YDir, limit);
        }
        private static TileData blank = new TileData();
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
        }
        //private void GrowRooms(List<Rectangle> rooms,)
    }
}
