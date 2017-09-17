using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class PlayerBullet : Entity, IHarmfulEntity, ILightSource
    {
        public Entity shooter;
        public int Duration = 0;
        protected List<Entity> hitEntities;
        public bool piercing;
        public float spinrate = 0;
        public Vector2 Gravity = new Vector2();
        public bool Bounces;
        public bool attacksterrain = false;
        public float digpower = 0.5f;
        public PlayerBullet(Game game, Entity shooter, string graphic = "Reisenbullet") : base(game)
        {
            Ani = new Animation(AnimationLoader._this.GetAnimation(graphic));
            this.shooter = shooter;

            //Ani.HueColor = Game.GetTeamColor(((ICombatant)shooter).Team);
            ///Ani.HueColor = shooter.GetTeamColor();
            ///Ani.HueRecolorStrength = 1;
            piercing = false;

            hitEntities = new List<Entity>();
        }

        public Entity Attacker
        {
            get
            {
                return shooter;
            }
        }

        public bool IsHarmful
        {
            get
            {
                return true;
            }
        }

        public bool lightFlicker
        {
            get
            {
                return false;
            }
        }

        public Vector2 lightPosition
        {
            get
            {
                return getCenter();
            }
        }

        protected float _maxLightRadius = 1.5f;
        public float maxLightRadius
        {
            get
            {
                return Ani.Alpha >= 1 ? _maxLightRadius : 0f;
            }
            set
            {
                _maxLightRadius = value;
            }
        }
        public override Rectangle GetHitbox()
        {
            if (Ani != null && Ani.CurrentImage != null)
            {
                //float s = Math.Max(Ani.CurrentImage.Width, Ani.CurrentImage.Height);
                //float s = Ani.CurrentImage.Height;
                float s = Ani.CurrentImage.Height * 1.5f;
                //float s2 = s / 2f;
                //Vector2 V = Ani.Position;
                float so2 = s / 2;
                //Vector2 V = getCenter() - new Vector2(so2,so2);
                Vector2 V = Vector2.Subtract(getCenter(), so2, so2);
                return new Rectangle(V.X, V.Y, s, s);
            }
            return null;
        }

        protected float _touchDamage = 1f;
        public float touchDamage
        {
            get
            {
                return _touchDamage;
            }
            set
            {
                _touchDamage = value;
            }
        }

        public bool ontouchDamage(ICombatant target)
        {
            if (!piercing)
            {
                Alive = false;
            }

            bool ok = !hitEntities.Contains((Entity)target);
            if (ok)
            {
                hitEntities.Add((Entity)target);
                return true;
            }
            return false;
        }

        public override void Update()
        {
            base.Update();
            if (spinrate != 0)
            {
                Ani.Rotation += spinrate;
            }
            if (Gravity.RoughLength != 0)
            {
                Speed += Gravity;
            }
            //if (!App.screenbounds.isTouching(GetHitbox()))

            //if (!Game.stageBounds.isTouching(GetHitbox()))
            if (!Game.stageBounds.containsPoint(Position))
            {
                if ((Ani.X > 0 == Hspeed > 0 || Ani.X < 0 == Hspeed < 0) || (Ani.Y > 0 == Vspeed > 0 || Ani.Y < 0 == Vspeed < 0))
                {
                    Alive = false;
                }
            }
            //Vector2 center = getCenter();
            Vector2 center = Vector2.Add(Position, 8, 0);
            TileData T = null;
            if (!Bounces)
            {
                T = Game.TM.CheckForTile(new Vector2(center.X, y));
            }
            if (T != null && T.enabled && T.solid)
            {
                if (attacksterrain)
                {
                    if (T.Breakable)
                    {
                        //T.Damage(_touchDamage * digpower);
                        if (T.Damage(digpower))
                            PlaySound("thunk4");
                        else
                            PlaySound("thunk");
                    }
                    else
                        PlaySound("plink");
                }
                Alive = false;
            }
            else if (Bounces)
            {

                T = Game.TM.CheckForTile(center + new Vector2(Speed.X));
                if (T != null && T.enabled && T.solidToSpeed(Speed.ToCardinal()))
                {
                    Speed.X = -Speed.X;
                }

                T = Game.TM.CheckForTile(center + new Vector2(0, Speed.Y));
                if (T != null && T.enabled && T.solidToSpeed(Speed.ToCardinal()))
                {
                    Speed.Y = -Speed.Y;
                }

                T = Game.TM.CheckForTile(center + Speed);
                if (T != null && T.enabled && T.solidToSpeed(Speed.ToCardinal()))
                {
                    Speed.X = -Speed.X;
                    Speed.Y = -Speed.Y;
                }
            }
            if (Duration > 0)
            {
                Duration--;
                if (Duration <= 0)
                {
                    Duration = 1;
                    Ani.Alpha -= 0.2f;
                    if (Ani.Alpha <= 0)
                    {
                        Alive = false;
                    }
                }
            }
        }
    }
}
