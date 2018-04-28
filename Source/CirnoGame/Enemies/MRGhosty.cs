using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class MRGhosty : PlatformerEntity, ICombatant, IHarmfulEntity
    {
        public string animation = "???";

        public int Team { get; set; }

        public float HP { get; set; }

        public int PointsForKilling
        {
            get
            {
                return 1;
            }
        }

        public float TargetPriority
        {
            get
            {
                return 0.5f;
            }
        }

        public bool IsHarmful
        {
            get
            {
                return true;
            }
        }

        public Entity Attacker
        {
            get
            {
                return this;
            }
        }

        public float touchDamage
        {
            get
            {
                return attackpower*1.5f;
            }
        }
        public float attackpower = 1;
        public float defensepower = 1;

        public MRGhosty(Game game) : base(game)
        {
            ChangeAni("");
            AddBehavior(new FlightControls(this));
            AddBehavior(new RandomAI(this));
            attackpower = 1 + (Game.level * 0.55f);
            defensepower = 1 + (Game.level * 0.55f);
            if (Game.playing)
            {
                AddBehavior<AimedShooter>();
                GetBehavior<AimedShooter>().attackpower = attackpower;
                GetBehavior<AimedShooter>().maxtime = Math.Max(480 - (Game.level * 10), 380);
            }
            GetBehavior<FlightControls>().maxSpeed *= 0.5f;

            GravityEnabled = false;
            Team = 2;
            HP = 2;
        }
        public override void Update()
        {
            base.Update();
            Ani.Flipped = (Hspeed < 0);
            Ani.ImageSpeed = (float)((Math.Abs(Hspeed) + Math.Abs(Vspeed)) * 0.125);
        }

        public void ChangeAni(string animation, bool reset = false)
        {
            if (this.animation == animation)
            {
                return;
            }
            if (Ani == null)
            {
                Ani = new Animation(AnimationLoader.Get("images/enemies/mrghost" + animation));
            }
            else
            {
                Ani.ChangeAnimation(AnimationLoader.Get("images/enemies/mrghost" + animation), reset);
            }
            this.animation = animation;
        }

        public void onDamaged(IHarmfulEntity source, float amount)
        {
            //throw new NotImplementedException();
            //if (!(source is MRGhosty))
            {
                //HP -= (amount / defensepower);
                HP -= Game.calcdamage(amount, defensepower);
            }
            /*else
            {
                Helper.Log("ghosts are allergic to themselves???");
            }*/
        }

        public void onDeath(IHarmfulEntity source)
        {
            //throw new NotImplementedException();
            Alive = false;
            CollectableItem P = new PointItem(Game);
            P.Position.CopyFrom(Position);
            P.collectionDelay /= 2;
            Game.AddEntity(P);
            if (Math.Random() < 0.15)
            {
                P = new HealingItem(Game);
                P.Position.CopyFrom(Position);
                P.Vspeed = -2;
                P.collectionDelay /= 2;
                this.Game.AddEntity(P);
             }
        }

        public void onKill(ICombatant combatant)
        {
            //throw new NotImplementedException();
        }

        public bool ontouchDamage(ICombatant target)
        {
            //throw new NotImplementedException();
            return true;
        }
    }
}
