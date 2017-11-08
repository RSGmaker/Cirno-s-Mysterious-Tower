using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class Turret : Entity, ICombatant
    {
        public float attackpower = 1;
        //public float defensepower = 1;
        public Turret(Game game) : base(game)
        {
            Ani = new Animation(AnimationLoader._this.GetAnimation("images/enemies/turret"));
            Ani.ImageSpeed = 0;

            attackpower = 1 + (Game.level * 0.5f);
            attackpower *= 2;
            HP = 0;
            Team = 2;
            //defensepower = 1 + (Game.level * 0.5f);
            if (Game.playing)
            {
                var A = AddBehavior<AimedShooter>();
                A.attackpower = attackpower;
                A.maxtime = Math.Max(480 - (Game.level * 10), 380);
                //A.maxtime = (int)(A.maxtime*1.75f);
                A.maxtime = (int)(A.maxtime * 1.25f);
                A.ignoresterrain = true;
                A.maxDistance *= 1.3f;
                A.maxShadow = 1;
                A.bulletSpeed *= 0.80f;
                A.bulletDuration = 60 * 9;
                A.bulletgraphic = "turretbullet";
                A.attackTelegraphTime += A.attackTelegraphTime;
            }
        }

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

        public override Vector2 getCenter()
        {
            return Vector2.Add(Position, 5, 5);
        }

        public void onDamaged(IHarmfulEntity source, float amount)
        {
            //throw new NotImplementedException();
        }

        public void onDeath(IHarmfulEntity source)
        {
            //throw new NotImplementedException();
        }

        public void onKill(ICombatant combatant)
        {
            //throw new NotImplementedException();
        }
        public TileData TTD;

        public void SetDown(bool forcedown = false)
        {
            var TZ = Game.TM.tilesize;
            var TD = Game.TM.CheckForTile(Position);
            var attempts = 0;
            var direction = Math.Random() < 0.5 ? TZ : -TZ;
            if (forcedown)
            {
                direction = TZ;
            }
            while (!(TD != null && TD.solid && TD.visible) && attempts<20)
            {
                y += direction;
                TD = Game.TM.CheckForTile(Position);
            }
            if (attempts >= 20)
            {
                Alive = false;
                return;
            }
            else
            {
                x = (TD.column * TZ) + Game.TM.position.X;
                y = (TD.row * TZ) + Game.TM.position.Y;
                //TD.HP = TD.maxHP * 2;
            }
            TTD = TD;

        }

        public override void Update()
        {
            var TD = Game.TM.CheckForTile(Position);
            if (TD!=null && TD.solid && TD.visible && TD.opaque)
            {

            }
            else if (Alive)
            {
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
                    Game.AddEntity(P);
                }
                return;
            }
            if (TD.CanSlope)
            {
                var redraw = false;
                if (TD.SlopeDirection != 0)
                {
                    redraw = true;
                }
                TD.CanSlope = false;
                if (redraw)
                {
                    TD.UpdateTile();
                }
            }
            if (Ani.Shadow > 0)
            {
                Ani.ImageSpeed = 0.25f;
            }
            else if (Ani.ImageSpeed > 0)
            {
                Ani.ImageSpeed = 0;
                Ani.CurrentFrame = 0;
                Ani.SetImage();
            }
            base.Update();
            
        }
    }
}
