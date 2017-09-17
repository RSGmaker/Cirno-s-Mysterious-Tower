using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class PlayerCharacter : PlatformerEntity, ICombatant
    {
        public string animation = "???";
        public int shoottime = 0;
        public string prefix = "";
        private bool newInput;
        public int[] tapTimer;
        public int shootRecharge = 0;
        public int turntime = 0;//the amount of time the user has been moving normally/standing still, if long enough the character will turn normally.
        public int score = 0;
        public int orbs = 0;
        public int keys = 0;

        public int Team { get; set; }

        public float maxHP = 20;
        public float HP { get; set; }
        public Vector2 SpawnLocation = new Vector2();
        public int lives = 3;
        public int frame = 0;

        public float digpower = 1.0f;
        public float attackpower = 1f;
        public float defensepower = 1f;

        public float invincibilitytime = 0;
        public float blockprice = 9f;

        public float invincibilitymod = 1f;

        public int currentshot = 0;
        public int shotdelay = 5;
        public int currentshotdelay = 0;
        public int totalshots = 1;//number of shots per command

        public FloatingMessage MSG;


        public int PointsForKilling
        {
            get
            {
                return 300;
            }
        }

        public float TargetPriority
        {
            get
            {
                return 0.7f;
            }
        }
        public void MoveToNewSpawn(Vector2 NewSpawnLocation)
        {
            SpawnLocation.CopyFrom(NewSpawnLocation);
            Position.CopyFrom(SpawnLocation);
        }

        public void shoot()
        {
            if (shoottime < 1)
            {
                prefix = "s";
                ChangeAni(prefix + animation);
            }
            if (shootRecharge <= 0)
            {
                currentshot = 1;
                DoShot();
                //shootRecharge = 12;
                
                currentshotdelay = 0;
                shootRecharge = 20;
                
            }
            shoottime = 50;
            turntime = 0;

        }
        void DoShot()
        {
            var PB = new PlayerBullet(Game, this, "Images/misc/crystal");
            PB.Hspeed = Ani.Flipped ? -2.5f : 2.5f;
            PB.x = x + (Ani.Flipped ? -4 : 12);
            PB.y = y + 10;
            if (!Controller[0] && !Controller[1])
            {
                if (Controller[2])
                {
                    PB.Hspeed *= 0.8f;
                    PB.Vspeed = -(float)Math.Abs(PB.Hspeed);
                    PB.Hspeed *= 0.6f;
                }
                else if (Controller[3])
                {
                    PB.Hspeed *= 0.8f;
                    PB.Vspeed = (float)Math.Abs(PB.Hspeed);
                    PB.Hspeed *= 0.6f;
                }
            }
            else
            {
                if (Controller[2])
                {
                    PB.Hspeed *= 0.9f;
                    PB.Vspeed = -(float)Math.Abs(PB.Hspeed * 0.7);

                }
                else if (Controller[3])
                {
                    PB.Hspeed *= 0.9f;
                    PB.Vspeed = (float)Math.Abs(PB.Hspeed * 0.7);
                }
            }
            PB.x -= PB.Hspeed;
            PB.y -= PB.Vspeed;
            PB.attacksterrain = currentshot==1;
            PB.digpower = (digpower) * 0.6667f;
            PB.touchDamage = attackpower / (((totalshots-1f)/2f)+1f);
            Game.AddEntity(PB);
        }
        public PlayerCharacter(Game game) : base(game)
        {
            ChangeAni("stand");
            AddBehavior(new PlatformerControls(this));
            tapTimer = new int[Controller.Length];
            Team = 0;
            HP = maxHP;
            MSG = new FloatingMessage(game, "");
            MSG.Text.TextColor = "#FFFFFF";
            //MSG.ChangeText("hello world");
            MSG.autokill = false;
            game.AddEntity(MSG);
            MSG.RemovedOnLevelEnd = false;
            RemovedOnLevelEnd = false;
        }
        public override void Update()
        {
            base.Update();
            MSG.Position.X = Position.X;
            MSG.Position.Y = Position.Y-10;

            if (shoottime > 0)
            {
                shoottime--;
                if (shoottime < 1)
                {
                    if ("" + animation[0] == prefix)
                    {
                        ChangeAni(animation.Substring(1));
                    }
                    prefix = "";
                }
            }
            if (shootRecharge > 0)
            {
                shootRecharge--;
            }
            if (onGround)
            {
                if (Hspeed != 0)
                {
                    ChangeAni(prefix + "walk");
                    ///Ani.Flipped = Hspeed < 0;
                }
                else
                {
                    ChangeAni(prefix + "stand");
                }
                Ani.ImageSpeed = (float)Math.Abs(Hspeed * 0.125);
                //Ani.ImageSpeed = Ani.Flipped ? Hspeed * 0.125f : -Hspeed * 0.125f;
                //Ani.ImageSpeed = (Ani.Flipped ? -Hspeed : Hspeed) * 0.125f;
            }
            else
            {
                ChangeAni(prefix + "jump");
                //Ani.ImageSpeed = (float)Math.Abs(Vspeed * 0.125);
                Ani.ImageSpeed = 0.15f + (float)((Math.Abs(Hspeed) + Math.Abs(Vspeed)) * 0.7);
            }
            if (Ani.Flipped != Hspeed < 0 || (Hspeed == 0 && onGround))
            {
                turntime++;
            }
            else
            {
                turntime = 0;
            }

            //if (LController[3] != Controller[3] && Controller[3])
            /*if (Pressed(3) || Pressed(4) || Pressed(5) || Pressed(6))
            {
                shoot();
            }*/
            if (currentshot < totalshots)
            {
                currentshotdelay++;
                if (currentshotdelay >= shotdelay)
                {
                    currentshotdelay = 0;
                    currentshot++;
                    DoShot();
                }
            }
            if (Controller[4])
            {
                turntime = 0;
            }
            if (Pressed(4))
            {
                shoot();
            }
            if (Pressed(6))
            {
                PlaceBlock();
            }
            
            UpdateController();
            //if (turntime > 22 && Hspeed != 0)
            //if (turntime > 18 && Hspeed != 0)
            if (turntime > 14 && Hspeed != 0)
            {
                Ani.Flipped = Hspeed < 0;
            }
            if (invincibilitytime > 0)
            {
                //Ani.Alpha = Ani.Alpha == 0 ? 1 : 0;
                if ((frame & 1) > 0)
                    Visible = !Visible;
                invincibilitytime -= 1;
            }
            else
            {
                Visible = true;
            }
            frame++;
        }
        public void PlaceBlock()
        {
            var price = 1000 * blockprice;
            if (Game.timeRemaining < blockprice)
            {
                return;
            }
            float W = Width / 3;
            float Y = Height;
            var T = Game.TM.CheckForTile(Vector2.Add(Position, Width / 2, Y));
            if (T != null && (!T.enabled || !T.solid))
            {
                T.solid = true;
                T.Breakable = true;
                T.enabled = true;
                T.texture = 4;
                T.UpdateTile();
                T.HP = T.maxHP * 2;
                Game.timeRemaining -= price;
            }
        }
        public void ChangeAni(string animation, bool reset = false)
        {
            if (this.animation == animation)
            {
                return;
            }
            if (Ani == null)
            {
                Ani = new Animation(AnimationLoader.Get("images/cirno/" + animation));
            }
            else
            {
                Ani.ChangeAnimation(AnimationLoader.Get("images/cirno/" + animation), reset);
            }
            if (this.animation != "stand")
            {
                turntime = 0;
            }
            this.animation = animation;
        }
        public void UpdateController()
        {
            newInput = false;
            int i = 0;
            while (i < Controller.Length)
            {
                tapTimer[i]++;
                if (Controller[i] && !LController[i])
                {
                    tapTimer[i] = 0;
                    newInput = true;
                }
                LController[i] = Controller[i];
                i++;
            }
            /*if (_lAimAngle != _aimAngle)
            {
                newInput = true;
            }
            _lAimAngle = _aimAngle;*/
            if (newInput)
            {
                //GetBehavior<NetworkSync>().Sync();
            }
        }

        public void onDamaged(IHarmfulEntity source, float amount)
        {
            //throw new NotImplementedException();
            if (invincibilitytime <= 0)
            {
                HP -= (amount / defensepower);
                invincibilitytime = 45*invincibilitymod;
            }
        }
        public override void onRemove()
        {
            base.onRemove();
            Game.RemoveEntity(MSG);
        }

        public void onDeath(IHarmfulEntity source)
        {
            //throw new NotImplementedException();
            invincibilitytime *= 3f;

            if (Game.player == this)
            {
                if (Game.timeRemaining > 0)
                {
                    Position.CopyFrom(SpawnLocation);
                    HP = maxHP;
                    Game.timeRemaining *= 0.6667f;
                }
                else
                {
                    Game.DoGameOver();
                }
            }
            else
            {
                Position.CopyFrom(SpawnLocation);
                HP = maxHP;
            }
        }

        public void onKill(ICombatant combatant)
        {
            //throw new NotImplementedException();
        }
        public override Rectangle GetHitbox()
        {
            //return base.GetHitbox();
            if (Ani != null && Ani.CurrentImage != null)
            {
                /*var size = 4;
                var W = Ani.CurrentImage.Width / size;
                var H = Ani.CurrentImage.Height / size;
                var W4 = (Ani.CurrentImage.Width / 2) - (W / 2);
                var H4 = (Ani.CurrentImage.Height / 2) - (H / 2);
                return new Rectangle(Ani.X+W4, Ani.Y+H4, W, H);*/
                return new Rectangle(Ani.X + (Ani.CurrentImage.Width / 2f), Ani.Y + (Ani.CurrentImage.Height / 2f), 1, 1);
            }
            return null;
        }
    }
}
