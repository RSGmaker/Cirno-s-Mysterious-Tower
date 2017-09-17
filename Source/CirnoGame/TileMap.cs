using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class TileMap
    {
        public Vector2 position;
        public float tilesize;
        public int rows;
        public int columns;
        public TileData[,] data;
        public List<HTMLImageElement> tiles;
        public List<HTMLImageElement> cracks;

        public Game game;

        protected HTMLCanvasElement buffer;
        public CanvasRenderingContext2D bg;

        /// <summary>
        /// returns true if the rectangle has no empty spaces.
        /// </summary>
        /// <param name="sX"></param>
        /// <param name="sY"></param>
        /// <param name="eX"></param>
        /// <param name="eY"></param>
        /// <returns></returns>
        public bool IsRectSolid(int sX, int sY, int eX, int eY)
        {
            var X = sX;
            var Y = sY;
            while (Y < eY)
            {
                X = sY;
                while (X < eX)
                {
                    var T = data[X, Y];
                    if (!(T.enabled && T.topSolid))
                    {
                        return false;
                    }
                    X++;
                }
                Y++;
            }
            return true;
        }

        protected Random RND;
        public int Seed = 0;

        public void ForceRedraw()
        {
            needRedraw = true;
        }

        protected bool needRedraw;
        public bool AllowSkyBridge = false;
        public TileMap(Game game, int Seed = -1)
        {
            RND = new Random();
            //position = new Vector2(-576);
            ///position = new Vector2(-128);
            position = new Vector2();
            //tilesize = 48;
            tilesize = 16;
            //rows = 16;
            /*columns = 52;*/
            rows = (int)Math.Ceiling(((-position.Y * 2) + game.stageBounds.bottom) / tilesize);
            columns = (int)Math.Ceiling(((-position.X * 2) + game.stageBounds.right) / tilesize);
            data = new TileData[columns, rows];
            tiles = AnimationLoader.Get("images/land/brick");
            cracks = AnimationLoader.Get("images/land/cracks");
            this.game = game;

            buffer = new HTMLCanvasElement();
            bg = buffer.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
            if (Seed < 0)
            {
                this.Seed = RND.Next();
            }
            else
            {
                this.Seed = Seed;
            }
            //Randomize();
            Generate();
        }
        protected void Randomize()
        {
            int row = 0;
            int column = 0;
            while (row < rows)
            {
                while (column < columns)
                {
                    TileData T = new TileData();
                    T.row = row;
                    T.column = column;
                    T.texture = 1;
                    //T.enabled = (Math.Random() < 0.15) || (row>=rows-1);
                    T.enabled = (RND.NextDouble() < 0.15) || (row >= rows - 1);
                    T.topSolid = T.enabled;
                    if (T.enabled && (row >= rows - 1))
                    {
                        T.texture = 2;
                        T.solid = true;
                    }
                    else if (T.enabled)
                    {
                        if (RND.NextDouble() < 0.3)
                        {
                            T.solid = true;
                            T.texture = 0;
                            if (RND.NextDouble() < 0.5)
                            {
                                T.texture = 3;
                            }
                        }
                    }
                    T.visible = T.enabled;
                    T.map = this;
                    data[column, row] = T;
                    column++;
                }
                column = 0;
                row++;
            }
        }
        public void Generate()
        {
            RND = new Random(Seed);
            //Randomize();
            _Gen();
            needRedraw = true;
        }
        protected void _Gen()
        {
            int[] heightmap = new int[columns];
            //float entropy = 0.8f;
            //float entropy = 0.45f;
            float entropy = 0.60f;
            int max = (int)(rows * entropy);
            //int smoothnessSize = 12;
            int smoothnessSize = 8;
            int smoothnessStrength = 2;

            int X = 0;
            //randomizes the heightmap
            while (X < columns)
            {
                heightmap[X] = (int)(RND.NextDouble() * max);
                X += 1;
            }
            int s = 0;
            while (s < smoothnessStrength)
            {
                int[] oheightmap = heightmap;
                heightmap = new int[columns];
                X = 0;
                while (X < columns)
                {
                    heightmap[X] = blur(oheightmap, X, smoothnessSize);
                    X += 1;
                }

                X = 1;
                s++;
            }
            //removes bumps from heightmap
            while (X < columns - 1)
            {
                int A = heightmap[X - 1];
                int B = heightmap[X + 1];

                int H = heightmap[X];
                //if (A == B && Math.Abs(A- H)==1)
                if ((A > H) == (B > H) && H != A)
                {
                    heightmap[X] = (A + B) / 2;
                }
                X += 1;
            }



            int row = 0;
            int column = 0;
            TileData LT = null;
            float bridgeChance = 0.90f;
            int RNDbridge = 0;
            while (row < rows)
            {
                while (column < columns)
                {
                    int H = rows - heightmap[column];
                    bool fill = row >= H;
                    TileData T = new TileData();
                    T.row = row;
                    T.column = column;
                    T.texture = 1;
                    //T.enabled = (Math.Random() < 0.15) || (row >= rows - 1);
                    T.enabled = (fill) || (row >= rows - 1);
                    T.topSolid = T.enabled;
                    T.bottomSolid = T.enabled;
                    if (T.enabled && (row >= rows - 1))
                    {
                        T.texture = 2;
                        T.solid = true;
                    }
                    else if (T.enabled)
                    {
                        //if (Math.Random() < 0.3)
                        {
                            T.solid = true;
                            T.texture = 4;
                            T.CanSlope = true;
                            if (RND.NextDouble() < 0.5)
                            {
                                T.texture = 5;
                            }
                            if (row > H && RND.NextDouble() < 0.02)
                            {
                                T.texture = 6;
                            }
                        }
                    }
                    if (!T.enabled)
                    {
                        if ((AllowSkyBridge && row == 20 && RND.NextDouble() < 0.93) || (row + 4 >= H && row + 2 < H && RND.NextDouble() < 0.025) || (LT != null && LT.enabled && LT.texture == 1 && RND.NextDouble() < bridgeChance))
                        {
                            T.enabled = true;
                            T.topSolid = T.enabled;
                            bridgeChance -= 0.075f;
                        }
                        else
                        {
                            if (RNDbridge < 1 && RND.NextDouble() < 0.015)
                            {
                                RNDbridge = RND.Next(8);
                            }
                            if (RNDbridge > 0)
                            {
                                T.enabled = true;
                                T.topSolid = T.enabled;
                                RNDbridge--;
                                //}else if (RND.NextDouble() < 0.025)
                            }
                            else if (RND.NextDouble() < 0.035)
                            {
                                T.enabled = true;
                                T.topSolid = T.enabled;
                            }
                            else if (true)//debug fill thing
                            {
                                T.enabled = true;
                                T.topSolid = T.enabled;
                                T.CanSlope = Math.Random() < 0.5;
                            }
                        }
                    }
                    if (!T.enabled || T.texture != 1)
                    {
                        bridgeChance = 0.90f;
                    }
                    T.visible = T.enabled;
                    T.map = this;
                    T.solid = true;
                    data[column, row] = T;
                    LT = T;
                    column++;
                }
                column = 0;
                row++;
            }
        }
        public void _GenRect(int SX, int SY, int EX, int EY)
        {
            SX = (int)MathHelper.Clamp(SX, 0, columns - 1);
            SY = (int)MathHelper.Clamp(SY, 0, rows - 1);
            EX = (int)MathHelper.Clamp(EX, 0, columns - 1);
            EY = (int)MathHelper.Clamp(EY, 0, rows - 1);

            //float entropy = 0.8f;
            //float entropy = 0.45f;
            float entropy = 0.60f;
            int max = (int)(rows * entropy);
            //int smoothnessSize = 12;

            int X = 0;



            int row = SY;
            int column = SX;
            TileData LT = null;
            float bridgeChance = 0.90f;
            int RNDbridge = 0;

            while (row < EY)
            {
                while (column < EX)
                {
                    bool fill = false;
                    TileData T = new TileData();
                    T.row = row;
                    T.column = column;
                    T.texture = 1;
                    //T.enabled = (Math.Random() < 0.15) || (row >= rows - 1);
                    T.enabled = (fill) || (row >= rows - 1);
                    T.topSolid = T.enabled;
                    T.bottomSolid = T.enabled;
                    /*if (T.enabled && (row >= rows - 1))
                    {
                        T.texture = 2;
                        T.solid = true;
                    }
                    else if (T.enabled)
                    {
                        //if (Math.Random() < 0.3)
                        {
                            T.solid = true;
                            T.texture = 4;
                            T.CanSlope = true;
                            if (RND.NextDouble() < 0.5)
                            {
                                T.texture = 5;
                            }
                            if (false && RND.NextDouble() < 0.02)
                            {
                                T.texture = 6;
                            }
                        }
                    }*/
                    if (!T.enabled)
                    {
                        /*if ((AllowSkyBridge && row == 20 && RND.NextDouble() < 0.93) || (false && false && RND.NextDouble() < 0.025) || (LT != null && LT.enabled && LT.texture == 1 && RND.NextDouble() < bridgeChance))
                        {
                            T.enabled = true;
                            T.topSolid = T.enabled;
                            bridgeChance -= 0.075f;
                        }
                        else*/
                        {
                            if (RNDbridge < 1 && RND.NextDouble() < 0.015)
                            {
                                //RNDbridge = RND.Next(8);
                                RNDbridge = RND.Next(6);
                            }
                            if (RNDbridge > 0)
                            {
                                T.enabled = true;
                                T.topSolid = T.enabled;
                                RNDbridge--;
                                //}else if (RND.NextDouble() < 0.025)
                            }
                            //else if (RND.NextDouble() < 0.035)
                            //else if (RND.NextDouble() < 0.04)
                            else if (RND.NextDouble() < 0.045)
                            {
                                T.enabled = true;
                                T.topSolid = T.enabled;
                            }

                        }
                    }
                    if (!T.enabled || T.texture != 1)
                    {
                        bridgeChance = 0.90f;
                    }
                    T.visible = T.enabled;
                    T.map = this;
                    T.solid = true;
                    data[column, row] = T;
                    LT = T;
                    column++;
                }
                column = SX;
                row++;
            }
        }
        public void SetBreakableRect(int column, int row, int Width, int Height,bool breakable)
        {
            var SX = (int)(column);
            var SY = (int)(row);
            var EX = (int)(SX + Width);
            var EY = (int)(SY + Height);
            SX = (int)MathHelper.Clamp(SX, 0, columns - 1);
            SY = (int)MathHelper.Clamp(SY, 0, rows - 1);
            EX = (int)MathHelper.Clamp(EX, 0, columns - 1);
            EY = (int)MathHelper.Clamp(EY, 0, rows - 1);
            var X = SX;
            var Y = SY;
            TileData T = new TileData();
            T.row = Y;
            T.column = X;
            T.texture = 1;
            T.enabled = true;
            T.visible = true;
            T.map = this;
            T.solid = true;
            if (breakable)
            {
                T.texture = 1;
                if (Math.Random() < 0.02)
                {
                    T.texture = Math.Random() < 0.5 ? 5 : 6;
                }
                T.Breakable = true;
            }
            else
            {
                T.texture = 0;
                T.Breakable = false;
            }
            while (Y < EY)
            {
                X = SX;
                while (X < EX)
                {
                    /*var TT = T.Clone();
                    TT.column = X;
                    TT.row = Y;
                    data[X, Y] = TT;*/
                    var TT = data[X, Y];
                    if (TT == null)
                    {
                        TT = T.Clone();
                    }
                    if (T.solid)
                    {
                        TT.texture = T.texture;
                        TT.Breakable = T.Breakable;
                    }
                    X++;
                }
                Y++;
            }
        }
        public void FillRect(int column, int row, int Width, int Height)
        {
            var SX = (int)(column);
            var SY = (int)(row);
            var EX = (int)(SX + Width);
            var EY = (int)(SY + Height);
            SX = (int)MathHelper.Clamp(SX, 0, columns - 1);
            SY = (int)MathHelper.Clamp(SY, 0, rows - 1);
            EX = (int)MathHelper.Clamp(EX, 0, columns - 1);
            EY = (int)MathHelper.Clamp(EY, 0, rows - 1);
            var X = SX;
            var Y = SY;
            TileData T = new TileData();
            T.row = Y;
            T.column = X;
            T.texture = 1;
            T.enabled = true;
            T.visible = true;
            T.map = this;
            T.solid = true;
            while (Y < EY)
            {
                X = SX;
                while (X < EX)
                {
                    var TT = T.Clone();
                    TT.column = X;
                    TT.row = Y;
                    data[X, Y] = TT;
                    X++;
                }
                Y++;
            }
        }
        public void DrawRect(int column, int row, int Width, int Height)
        {
            var X = column;
            var Y = row;
            var TX = X;
            var TY = Y;
            var EX = X + Width;
            var EY = Y + Height;

            while (TX < EX)
            {
                TileData T = new TileData();
                T.row = TY;
                T.column = TX;
                T.texture = 1;
                T.enabled = true;
                T.visible = true;
                T.map = this;
                T.solid = true;
                SetTile(TX, TY, T);
                TX++;
            }
            TX = X;
            TY = EY;
            while (TX < EX)
            {
                TileData T = new TileData();
                T.row = TY;
                T.column = TX;
                T.texture = 1;
                T.enabled = true;
                T.visible = true;
                T.map = this;
                T.solid = true;
                SetTile(TX, TY, T);
                TX++;
            }

            TX = X;
            TY = Y;
            while (TY < EY)
            {
                TileData T = new TileData();
                T.row = TY;
                T.column = TX;
                T.texture = 1;
                T.enabled = true;
                T.visible = true;
                T.map = this;
                T.solid = true;
                SetTile(TX, TY, T);
                TY++;
            }
            TX = EX;
            TY = Y;
            while (TY < EY)
            {
                TileData T = new TileData();
                T.row = TY;
                T.column = TX;
                T.texture = 1;
                T.enabled = true;
                T.visible = true;
                T.map = this;
                T.solid = true;
                SetTile(TX, TY, T);
                TY++;
            }
        }
        public void DrawRect(Rectangle rect)
        {
            /*var PX = (int)((position.X - TP.X) / tilesize);
            var PY = (int)((position.Y - TP.Y) / tilesize);*/
            DrawRect((int)(rect.left / tilesize), (int)(rect.top / tilesize), (int)(rect.width / tilesize), (int)(rect.height / tilesize));
        }
        public void SetAll(TileData T)
        {
            var X = 0;
            var Y = 0;
            while (Y < rows)
            {
                X = 0;
                while (X < columns)
                {
                    var TD = T.Clone();
                    TD.column = X;
                    TD.row = Y;
                    data[X, Y] = T;
                    X++;
                }
                Y++;
            }
        }
        public void ClearOuterRect(int column, int row, int width, int height,bool bottom=true)
        {
            var SX = (int)(column);
            var SY = (int)(row);
            var EX = (int)(SX + width);
            var EY = (int)(SY + height);
            SX = (int)MathHelper.Clamp(SX, 0, columns - 1);
            SY = (int)MathHelper.Clamp(SY, 0, rows - 1);
            EX = (int)MathHelper.Clamp(EX, 0, columns - 1);
            EY = (int)MathHelper.Clamp(EY, 0, rows - 1);
            var X = SX;
            var Y = SY;
            var T = new TileData();
            T.map = this;
            T.visible = false;
            T.solid = false;
            var TX = X;
            var TY = Y;
            while (TX < EX-1)
            {
                var TT = T.Clone();
                TT.column = TX;
                TT.row = TY;
                SetTile(TX, TY, TT);
                TX++;
            }
            TX = X;
            TY = EY;
            if (bottom)
            {
                while (TX < EX)
                {
                    var TT = T.Clone();
                    TT.column = TX;
                    TT.row = TY;
                    SetTile(TX, TY, TT);
                    TX++;
                }
            }

            TX = X;
            TY = Y;
            while (TY < EY-1)
            {
                var TT = T.Clone();
                TT.column = TX;
                TT.row = TY;
                SetTile(TX, TY, TT);
                TY++;
            }
            TX = EX;
            TY = Y;
            while (TY < EY-1)
            {
                var TT = T.Clone();
                TT.column = TX;
                TT.row = TY;
                SetTile(TX, TY, TT);
                TY++;
            }
        }
        public void ClearRect(int column, int row, int width, int height)
        {
            var SX = (int)(column);
            var SY = (int)(row);
            var EX = (int)(SX + width);
            var EY = (int)(SY + height);
            SX = (int)MathHelper.Clamp(SX, 0, columns - 1);
            SY = (int)MathHelper.Clamp(SY, 0, rows - 1);
            EX = (int)MathHelper.Clamp(EX, 0, columns - 1);
            EY = (int)MathHelper.Clamp(EY, 0, rows - 1);
            var X = SX;
            var Y = SY;
            var T = new TileData();
            T.map = this;
            T.visible = false;
            T.solid = false;
            T.enabled = false;
            while (Y < EY)
            {
                X = SX;
                while (X < EX)
                {
                    var TT = T.Clone();
                    TT.column = X;
                    TT.row = Y;
                    data[X, Y] = TT;
                    X++;
                }
                Y++;
            }
        }
        public void ClearRect(Rectangle rect)
        {
            var SX = (int)(rect.left / tilesize);
            var SY = (int)(rect.top / tilesize);
            var EX = (int)(rect.right / tilesize);
            var EY = (int)(rect.height / tilesize);
            var X = SX;
            var Y = SY;
            var T = new TileData();
            T.map = this;
            T.visible = false;
            T.solid = false;
            while (Y < EY)
            {
                X = SX;
                while (X < EX)
                {
                    var TT = T.Clone();
                    TT.column = X;
                    TT.row = Y;
                    data[X, Y] = TT;
                    X++;
                }
                Y++;
            }
        }
        public void SetTile(int column, int row, TileData T)
        {
            if (column >= 0 && row >= 0 && column < data.GetLength(0) && row < data.GetLength(1))
                data[column, row] = T;
        }
        protected int blur(int[] array, int index, int blur = 1)
        {
            int total = 0;
            int ret = 0;
            int i = 0;
            int ind = index;
            if (ind >= 0 && ind < array.Length)
            {
                total++;
                ret += array[ind];
            }
            while (i < blur)
            {
                ind--;
                if (ind >= 0 && ind < array.Length)
                {
                    total++;
                    ret += array[ind];
                }
                i++;
            }
            i = 0;
            while (i < blur)
            {
                ind++;
                if (ind >= 0 && ind < array.Length)
                {
                    total++;
                    ret += array[ind];
                }
                i++;
            }
            return ret / total;
        }
        public TileData CheckForTile(Vector2 position)
        {
            /*position = position - this.position;
            position /= tilesize;
            if (position.X>=0 && position.X<columns && position.Y>=0 && position.Y<rows)
            {
                return data[(int)position.X, (int)position.Y];
            }*/
            var TP = this.position;
            var PX = (int)((position.X - TP.X) / tilesize);
            var PY = (int)((position.Y - TP.Y) / tilesize);
            if (PX >= 0 && PX < columns && PY >= 0 && PY < rows)
            {
                return data[PX, PY];
            }
            return null;
        }
        public TileData GetTile(int column, int row)
        {
            if (column >= 0 && row >= 0 && column < columns && row < rows)
            {
                return data[column, row];
            }
            return null;
        }
        protected void _Draw()
        {
            if (needRedraw/* && !AnimationLoader._this.IsLoading("Tile")*/)
            {
                int W = (int)Math.Ceiling(columns * tilesize);
                int H = (int)Math.Ceiling(rows * tilesize);

                if (buffer.Width != W || buffer.Height != H)
                {
                    buffer.Width = W;
                    buffer.Height = H;
                }
                else
                {
                    bg.ClearRect(0, 0, buffer.Width, buffer.Height);
                }

                Redraw(bg);
                needRedraw = false;
            }
        }
        private Rectangle rtmp = new Rectangle();
        public void Draw(CanvasRenderingContext2D g)
        {
            _Draw();
            //g.DrawImage(buffer, position.X, position.Y);
            rtmp.CopyFrom(game.camera.CameraBounds);
            //hide floating point seams.
            rtmp.x -= 1;
            rtmp.y -= 1;
            rtmp.width += 2;
            rtmp.height += 2;
            var CB = rtmp;
            //var CB = game.camera.CameraBounds;
            //g.DrawImage(buffer, CB.left-position.X, CB.top-position.Y, CB.width, CB.height, CB.left, CB.top, CB.width, CB.height);//draw map cropped to camera bounds
            g.DrawImage(buffer, CB.left - position.X, CB.top - position.Y, CB.width, CB.height, CB.left, CB.top, CB.width, CB.height);//draw map cropped to camera bounds
        }
        public void RedrawTile(int X, int Y, bool updateNeighbors = true)
        {
            if (updateNeighbors)
            {
                int TX = (X - 1) * (int)tilesize;
                int TY = (Y - 1) * (int)tilesize;
                bg.ClearRect(TX, TY, (int)tilesize * 3, (int)tilesize * 3);

                Redraw(bg, X - 1, Y - 1, 3, 3);
            }
            else
            {
                int TX = (X) * (int)tilesize;
                int TY = (Y) * (int)tilesize;
                bg.ClearRect(TX, TY, (int)tilesize, (int)tilesize);

                Redraw(bg, X, Y, 1, 1);
            }
        }

        public void Redraw(CanvasRenderingContext2D g, int SX = -1, int SY = -1, int W = -1, int H = -1)
        {
            float PX = position.X;
            float PY = position.Y;
            PX = 0;
            PY = 0;
            if (SX == -1)
            {
                SX = 0;
            }
            if (SY == -1)
            {
                SY = 0;
            }

            if (W == -1)
            {
                W = columns;
            }
            if (H == -1)
            {
                H = rows;
            }
            var EX = SX + W;
            var EY = SY + H;
            SX = (int)MathHelper.Clamp(SX, 0, columns);
            SY = (int)MathHelper.Clamp(SY, 0, rows);

            EX = (int)MathHelper.Clamp(EX, 0, columns);
            EY = (int)MathHelper.Clamp(EY, 0, rows);

            float X = PX + (SX * tilesize);
            float Y = PY + (SY * tilesize);
            int row = SY;
            int column = SX;
            var BG = tiles[2];
            var BG2 = tiles[3];
            var tilesC = tiles.Count;

            Rectangle R = new Rectangle();
            var doorroom = MapGenerator.doorroom;

            while (row < EY)
            {
                while (column < EX)
                {
                    //if (R.isTouching(new Rectangle(X, Y, tilesize, tilesize)))
                    {
                        TileData T = data[column, row];
                        var tex = Math.Min(tiles.Count - 1, T.texture);
                        if (T.enabled && tex >= 0 && tex < tilesC)
                        {
                            g.DrawImage(tiles[tex], X, Y);
                            if (T.Breakable && T.HP < T.maxHP)
                            {
                                int dmg = (int)Math.Max(1, Math.Min(Math.Round(T.maxHP - T.HP), 3)) - 1;
                                g.DrawImage(cracks[dmg], X, Y);
                            }
                            int sd = T.SlopeDirection;
                            if (sd != 0)
                            {
                                //object sg = g;
                                //Script.Write("sg.globalCompositeOperation = 'destination-out'");
                                g.GlobalCompositeOperation = CanvasTypes.CanvasCompositeOperationType.DestinationOut;
                                T.GetHitbox2(R);
                                R.x -= position.X;
                                R.y -= position.Y;
                                g.BeginPath();
                                g.MoveTo(R.left, R.top);
                                Vector2 P;
                                P = new Vector2(R.left + (R.width / 2f), R.top + (R.height / 2f));
                                if (sd > 0)
                                {
                                    g.LineTo(R.left, R.bottom);
                                }
                                else
                                {
                                    g.LineTo(R.right, R.bottom);
                                }

                                g.LineTo(R.right, R.top);

                                g.LineTo(R.left, R.top);

                                g.Fill();

                                g.GlobalCompositeOperation = CanvasTypes.CanvasCompositeOperationType.DestinationOver;
                                if (doorroom!=null && doorroom.ContainsTile(column, row))
                                {
                                    g.GlobalAlpha = 0.5f;
                                    g.FillStyle = "#000000";
                                    //g.FillRect(R.x.ToDynamic(), R.y.ToDynamic(), R.width.ToDynamic(), R.height.ToDynamic());
                                    g.FillRect(X.ToDynamic(), Y.ToDynamic(), tilesize.ToDynamic(), tilesize.ToDynamic());
                                    g.GlobalAlpha = 1f;
                                }
                                g.DrawImage(BG, X, Y);
                                g.GlobalCompositeOperation = CanvasTypes.CanvasCompositeOperationType.SourceOver;
                                
                            }

                        }
                        else
                        {
                            g.DrawImage(Math.Random() < 0.98 ? BG : BG2, X, Y);
                            if (doorroom != null && doorroom.ContainsTile(column, row))
                            {
                                /*T.GetHitbox2(R);
                                R.x -= position.X;
                                R.y -= position.Y;*/
                                g.GlobalAlpha = 0.5f;
                                g.FillStyle = "#000000";
                                g.FillRect(X.ToDynamic(), Y.ToDynamic(), tilesize.ToDynamic(), tilesize.ToDynamic());
                                g.GlobalAlpha = 1f;
                            }
                        }
                    }
                    column++;
                    X += tilesize;
                }
                X = PX + (SX * tilesize);
                Y += tilesize;
                column = SX;
                row++;
            }
        }
        public bool IsExposed(int X, int Y)
        {
            int row = Y - 2;
            int column = X - 2;

            while (row <= Y + 2)
            {
                while (column <= X + 2)
                {
                    /*var T = data[column, row];
                    T.texture = Math.Random() < 0.5 ? 0 : 1;*/
                    if (row >= 0 && column >= 0 && row < rows && column < columns)
                    {
                        var T = data[column, row];
                        if (!T.enabled || !T.solid)
                        {
                            return true;
                        }
                    }
                    column++;
                }
                row++;
                column = X - 2;
            }
            return false;
        }
        public void ApplyBreakableRect(int SX = -1, int SY = -1, int W = -1, int H = -1)
        {
            if (SX == -1)
            {
                SX = 0;
            }
            if (SY == -1)
            {
                SY = 0;
            }

            if (W == -1)
            {
                W = columns;
            }
            if (H == -1)
            {
                H = rows;
            }
            var EX = SX + W;
            var EY = SY + H;
            SX = (int)MathHelper.Clamp(SX, 0, columns);
            SY = (int)MathHelper.Clamp(SY, 0, rows);

            EX = (int)MathHelper.Clamp(EX, 0, columns);
            EY = (int)MathHelper.Clamp(EY, 0, rows);
            int row = SX;
            int column = SY;

            while (row < EY)
            {
                while (column < EX)
                {
                    /*var T = data[column, row];
                    T.texture = Math.Random() < 0.5 ? 0 : 1;*/
                    var T = data[column, row];
                    var TT = T.Clone();
                    TT.column = column;
                    TT.row = row;
                    data[column, row] = TT;
                    T = TT;
                    if (IsExposed(column, row))
                    {
                        T.texture = 1;
                        if (Math.Random() < 0.02)
                        {
                            T.texture = Math.Random() < 0.5 ? 5 : 6;
                        }
                        T.Breakable = true;
                    }
                    else
                    {
                        T.texture = 0;
                        T.Breakable = false;
                    }
                    column++;
                }
                row++;
                column = SX;
            }
            needRedraw = true;
        }
        public void ApplyBreakable()
        {
            int row = 0;
            int column = 0;

            while (row < rows)
            {
                while (column < columns)
                {
                    /*var T = data[column, row];
                    T.texture = Math.Random() < 0.5 ? 0 : 1;*/
                    var T = data[column, row];
                    var TT = T.Clone();
                    TT.column = column;
                    TT.row = row;
                    data[column, row] = TT;
                    T = TT;
                    if (IsExposed(column, row))
                    {
                        T.texture = 1;
                        if (Math.Random() < 0.02)
                        {
                            T.texture = Math.Random() < 0.5 ? 5 : 6;
                        }
                        T.Breakable = true;
                    }
                    else
                    {
                        T.texture = 0;
                        T.Breakable = false;
                    }
                    column++;
                }
                row++;
                column = 0;
            }
            needRedraw = true;
        }
        public void testTexture()
        {
            int row = 0;
            int column = 0;

            while (row < rows)
            {
                while (column < columns)
                {
                    var T = data[column, row];
                    T.texture = Math.Random() < 0.5 ? 0 : 1;
                    column++;
                }
                row++;
                column = 0;
            }
            needRedraw = true;
        }
    }
}
