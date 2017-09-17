using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class EntityBehavior
    {
        public bool enabled = true;
        public int FramesPerTick = 0;
        public Entity entity;
        public string BehaviorName { get; protected set; }
        public EntityBehavior(Entity entity)
        {
            this.entity = entity;
            if (BehaviorName == "" || BehaviorName == null)
            {
                dynamic test = GetType();
                var FN = Script.Write<string>("test[\"$$fullname\"]");
                //Helper.Log("FN:" + FN);
                string[] s = FN.Split(".");
                BehaviorName = s[s.Length - 1];
                //BehaviorName = GetType().FullName;
                //GetType().GetClassName

            }
        }
        public virtual void Update()
        {

        }
        public virtual void Draw(CanvasRenderingContext2D g)
        {
        }
        public void SendCustomEvent(dynamic evt, bool triggerflush = false)
        {
            dynamic D = new object();
            D.I = entity.ID;
            D.D = evt;
            //D.T = this.GetType().FullName;
            D.T = BehaviorName;
            entity.Game.SendEvent("CBE", D, triggerflush);
        }
        public virtual void CustomEvent(dynamic evt)
        {

        }
    }
}
