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
                return 2;
            }
        }
        public float attackpower = 1;
        public float defensepower = 1;

        public MRGhosty(Game game) : base(game)
        {
            ChangeAni("");
            /*Ani.HueColor = "#FF0000";
            Ani.HueRecolorStrength = 1.0f;
            Ani.Shadow = 2;
            Ani.Shadowcolor = Ani.HueColor;*/
            //Ani.Shadowcolor = "#FF0000";
            AddBehavior(new FlightControls(this));
            AddBehavior(new RandomAI(this));
            //AddBehavior(new AimedShooter(this));
            attackpower = 1 + (Game.level * 0.334f);
            defensepower = 1 + (Game.level * 0.334f);
            if (Game.playing)
            {
                AddBehavior<AimedShooter>();
                GetBehavior<AimedShooter>().attackpower = attackpower;
            }
            //GetBehavior<FlightControls>().maxSpeed *= 0.75f;
            GetBehavior<FlightControls>().maxSpeed *= 0.5f;




            GravityEnabled = false;
            Team = 2;
            HP = 2;
        }
        public override void Update()
        {
            base.Update();
            Ani.Flipped = !(Hspeed < 0);//sprite needs to be edited to face the right way...
            Ani.ImageSpeed = (float)((Math.Abs(Hspeed) + Math.Abs(Vspeed)) * 0.125);

            //Ani.Shadow = Ani.Shadow==0 ? 2 : 0;

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
                HP -= (amount / defensepower);
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
            var P = new PointItem(Game);
            P.Position.CopyFrom(Position);
            P.collectionDelay /= 2;
            Game.AddEntity(P);
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
