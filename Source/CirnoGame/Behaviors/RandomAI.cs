using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class RandomAI : EntityBehavior
    {
        ControllableEntity CE;
        public RandomAI(ControllableEntity entity) : base(entity)
        {
            CE = entity;
            this.FramesPerTick = 15;
        }
        public override void Update()
        {
            base.Update();
            if (Math.Random() < 0.1)
            {
                var Controller = CE.Controller;
                Controller[0] = false;
                Controller[1] = false;
                Controller[2] = false;
                Controller[3] = false;

                if (Math.Random() < 0.5)
                {
                    Controller[0] = Math.Random() < 0.5;
                    Controller[1] = !Controller[0];
                }

                if (Math.Random() < 0.5)
                {
                    Controller[2] = Math.Random() < 0.5;
                    Controller[3] = !Controller[2];
                }
            }
        }
    }
}
