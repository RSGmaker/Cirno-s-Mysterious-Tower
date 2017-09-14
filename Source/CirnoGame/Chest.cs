using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class Chest : Entity
    {
        public Chest(Game game) : base(game)
        {
            Ani = new Animation(AnimationLoader._this.GetAnimation("images/misc/chest"));
            Ani.ImageSpeed = 0;
        }
        public bool Opened { get; private set; }
        public override void Update()
        {
            base.Update();
            var F = GetFloor();
            if (F == null)
            {
                Vspeed = 1;
            }
            else
            {
                Vspeed = 0;
                y = F.GetHitbox().top - Ani.CurrentImage.Height;
            }
            var P = (PlayerCharacter)Game.player;
            if (!Opened && P.Position.EstimatedDistance(Position) < 16 && P.Controller[2] && P.keys > 0)
            {
                P.keys--;
                Open(P);
                /*Ani.CurrentFrame = 1;
                Ani.SetImage();
                Ani.Update();*/
            }
        }
        private void Open(PlayerCharacter player)
        {
            if (!Opened)
            {
                Ani.CurrentFrame = 1;
                Ani.SetImage();
                Ani.Update();
                Opened = true;
                //TODO:give player a permanent upgrade, and display text above the chest telling the player what they just got
                var M = "";
                var ok = true;
                var S = "";
                var color = "#FFFFFF";
                string[] picker = null;
                while (ok)
                {
                    var common = new string[] { "point", "point", "point", "point", "point", "point", "heart", "heart", "tripleheart", "singleorb" };
                    var rare = new string[] { "attackpower", "defensepower", "mining" };
                    var legendary = new string[] { "triplejump", "cheaperblocks", "invincibility" };



                    var R = Math.Random();
                    string C;

                    if (picker == null || Math.Random() < 0.2)
                    {
                        if (R < 0.70)
                        {
                            picker = common;
                            S = "common";
                            color = "#FFFFFF";
                        }
                        else
                        {
                            R = Math.Random();
                            if (R < 0.90)
                            {
                                picker = rare;
                                S = "rare";
                                //color = "#FF9922";
                                color = "#FFBB33";
                            }
                            else
                            {
                                picker = legendary;
                                S = "legendary";
                                color = "#FF55FF";
                            }
                        }
                    }
                    C = CirnoGame.HelperExtensions.Pick<string>(picker);
                    ok = false;
                    CollectableItem CI;
                    switch (C)
                    {

                        case "point":
                            var P = new PointItem(Game);
                            P.Position.CopyFrom(Position);
                            P.Vspeed = -2f;
                            P.Hspeed = -2f;
                            P.collectionDelay = 30;
                            Game.AddEntity(P);

                            P = new PointItem(Game);
                            P.Position.CopyFrom(Position);
                            P.Vspeed = -2f;
                            P.Hspeed = 2f;
                            P.collectionDelay = 30;
                            Game.AddEntity(P);

                            M = "Points";

                            break;
                        case "heart":
                            if (player.HP >= player.maxHP)
                            {
                                ok = true;
                                break;
                            }
                            var H = new HealingItem(Game);
                            H.Position.CopyFrom(Position);
                            H.Vspeed = -2f;
                            H.collectionDelay = 30;
                            Game.AddEntity(H);
                            M = "Heal";
                            break;
                        case "tripleheart":
                            if (player.HP > player.maxHP / 3)
                            {
                                ok = true;
                                break;
                            }
                            var H1 = new HealingItem(Game);
                            H1.Position.CopyFrom(Position);
                            H1.Vspeed = -2f;
                            H1.Hspeed = -2f;
                            H1.collectionDelay = 30;
                            Game.AddEntity(H1);

                            H1 = new HealingItem(Game);
                            H1.Position.CopyFrom(Position);
                            H1.Vspeed = -2f;
                            H1.Hspeed = 0;
                            H1.collectionDelay = 30;
                            Game.AddEntity(H1);

                            H1 = new HealingItem(Game);
                            H1.Position.CopyFrom(Position);
                            H1.Vspeed = -2f;
                            H1.Hspeed = 2f;
                            H1.collectionDelay = 30;
                            Game.AddEntity(H1);
                            M = "Heal x3";
                            break;
                        case "singleorb":
                            if (Game.timeRemaining > 0)
                            {
                                ok = true;
                                break;
                            }
                            CI = new Orb(Game);
                            CI.Position.CopyFrom(Position);
                            CI.Vspeed = -2f;
                            CI.Hspeed = -2f;
                            CI.collectionDelay = 30;
                            Game.AddEntity(CI);

                            /*CI = new Orb(Game);
                            CI.Position.CopyFrom(Position);
                            CI.Vspeed = -2f;
                            CI.Hspeed = 2f;
                            CI.collectionDelay = 30;
                            Game.AddEntity(CI);*/

                            M = "Orb";
                            break;
                        case "mining":
                            if (player.digpower < 2.0f)
                            {
                                player.digpower += 0.5f;
                            }
                            else
                            {
                                ok = true;
                            }
                            M = "Mining Power " + (player.digpower) + "x";
                            break;
                        case "triplejump":
                            var PC = player.GetBehavior<PlatformerControls>();
                            if (PC.maxAirJumps < 2)
                            {
                                PC.maxAirJumps = 2;
                            }
                            else
                            {
                                ok = true;
                            }
                            M = "Triple Jump";
                            break;
                        case "cheaperblocks":
                            if (player.blockprice != 9)
                            {
                                ok = true;
                                break;
                            }
                            player.blockprice = 6;
                            M = "Blocks are cheaper now";
                            break;
                        case "invincibility":
                            if (player.invincibilitymod != 1)
                            {
                                ok = true;
                                break;
                            }
                            player.invincibilitymod = 2;
                            M = "invincibility extended";
                            break;

                        case "attackpower":
                            player.attackpower += 1;
                            M = "Attack Power " + (int)(player.attackpower);
                            break;
                        case "defensepower":
                            player.defensepower += 1;
                            M = "Defensive Power " + (int)(player.defensepower);
                            break;
                        default:
                            ok = true;
                            break;
                    }

                }
                if (!ok && M != "")
                {
                    FloatingMessage FM = new FloatingMessage(Game, M);
                    FM.Text.TextColor = color;
                    //FM.Position = new Vector2(x - 8, y - 20);
                    FM.Position = new Vector2(x + 8, y - 20);
                    Game.AddEntity(FM);
                    if (S != "" && S != "common")
                    {
                        PlaySound("ok2B");
                    }
                    else
                    {
                        PlaySound("jump");
                    }
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
