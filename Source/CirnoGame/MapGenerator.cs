﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class MapGenerator
    {
        public static void Generate(Game game)
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
        }
        public static void BoxyGenerate(Game game)
        {
            Helper.Log("boxy generate");
            var player = game.player;//player character
            var map = game.TM;//the tilemap to generate
            var bounds = game.stageBounds;//the bounds to stay within
            MapRoom.PlacedRooms = new List<MapRoom>();

            var SX = map.columns / 2;
            var SY = map.rows / 3;
            var root = new MapRoom();
            root.SX = SX;
            root.SY = SY;
            root.EX = SX + 6 + (int)(Math.Random() * 10);
            root.EY = SY + 6 + (int)(Math.Random() * 10);

            root.game = game;

            //var roomtotal = 12+(int)(Math.Random() * 10);
            //var roomtotal = 16 + (int)(Math.Random() * 16);
            var roomtotal = 16 + (int)(Math.Random() * 18);
            //var rooms = 0;

            var attempts = 400;
            var R = root;
            if (!root.PlaceAndExpand())
            {
                Helper.Log("Couldn't generate root room.");
                return;
            }
            while (MapRoom.PlacedRooms.Count < roomtotal && attempts > 0)
            {
                var L = CirnoGame.HelperExtensions.Pick<global::CirnoGame.MapRoom>(MapRoom.FindValidUnplacedRooms());
                if (L.PlaceAndExpand())
                {
                    //rooms++;
                }
                attempts--;
            }
            var V = FindEmptySpace(game);
            if (V != null)
            {
                /*player.x = V.X;
                player.y = V.Y;*/
                game.Door.Position.CopyFrom(V);
                game.Door.DropToGround();
                var PC = (PlayerCharacter)player;
                //PC.MoveToNewSpawn(V);
                PC.MoveToNewSpawn(game.Door.Position);
                Helper.Log("spawning at:" + (int)V.X + "," + (int)V.Y);
            }
            else
            {
                Helper.Log("cannot locate a spawn point...");
            }

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