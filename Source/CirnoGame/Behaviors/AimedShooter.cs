using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class AimedShooter : EntityBehavior
    {
        private int time = 0;
        public int maxtime = 60 * 8;
        public Entity Target;
        //public float maxDistance = 120;
        public float maxDistance = 130;

        public float attackpower = 1;
        public AimedShooter(Entity entity) : base(entity)
        {
            /*entity.Ani.HueColor = "#FF0000";
            entity.Ani.HueRecolorStrength = 2.0f;*/
            entity.Ani.Shadowcolor = "#FF0000";
        }
        public override void Update()
        {
            base.Update();
            UpdateTarget();
            var A = entity.Ani;

            

            if (Target != null)
            {
                if (time < 60)
                {
                    //if ((time & 4) > 0)
                    if (true)
                    {
                        //A.Shadow = 6-(time * 0.1f);
                        A.Shadow = 5;
                    }
                    else
                    {
                        A.Shadow = 0;
                    }
                }
                else
                {
                    A.Shadow = 0;
                }
                time--;
                if (time <= 0)
                {
                    ResetTimer();
                    Shoot();
                }
            }else
            {
                A.Shadow = 0;
            }
            /*A.Shadowcolor = A.HueColor;
            A.Shadow = A.Shadowcolor != "" ? 0 : 3;
            A.HueColor = "#FF0000";
            A.HueRecolorStrength = 2.0f;*/
            //A.Update();

        }
        private void UpdateTarget()
        {
            if (Target != null)
            {
                if (Target.Position.EstimatedDistance(entity.Position) > maxDistance)
                {
                    Target = null;
                }else
                {
                    return;
                }
            }
            var T = entity.Game.player;
            if (T.Position.EstimatedDistance(entity.Position)<maxDistance){
                Target = T;
                ResetTimer();
            }
        }
        private void ResetTimer()
        {
            time = (maxtime/2);
            time += (int)Math.Round(time * Math.Random());
        }
        private void Shoot()
        {
            if (Target == null || ((ICombatant)Target).HP<=0)
                return;
            var P = new PlayerBullet(entity.Game, entity, "images/misc/ebullet");
            P.Position.CopyFrom(entity.getCenter());
            
            var D = (Target.getCenter() - P.Position);
            D.SetAsNormalize(0.5f);
            P.Hspeed = D.X;
            P.Vspeed = D.Y;
            P.touchDamage = attackpower;
            entity.Game.AddEntity(P);
        }
    }
}
