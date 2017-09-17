using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class Entity
    {
        public Animation Ani;
        public bool Alive = true;
        public bool Visible = true;
        public Vector2 Speed = new Vector2();
        public Game Game;
        protected List<EntityBehavior> _behaviors;
        protected List<int> _behaviorTicks;
        public int ZOrder = 0;
        //public double ID;
        public string ID;
        public bool HideHitbox;
        public bool HandledLocally = true;

        public bool RemovedOnLevelEnd = true;
        public float Hspeed
        {
            get
            {
                return Speed.X;
            }
            set
            {
                Speed.X = value;
            }
        }
        public float Vspeed
        {
            get
            {
                return Speed.Y;
            }
            set
            {
                Speed.Y = value;
            }
        }


        public Vector2 Position
        {
            get
            {
                return Ani.Position;
            }
            set
            {
                Ani.Position = value;
            }
        }
        public float x
        {
            get
            {
                return Ani.Position.X;
            }
            set
            {
                Ani.Position.X = value;
            }
        }
        public float y
        {
            get
            {
                return Ani.Position.Y;
            }
            set
            {
                Ani.Position.Y = value;
            }
        }

        public float Width
        {
            get
            {
                if (Ani.CurrentImage != null)
                {
                    return Ani.CurrentImage.Width;
                }
                return 0;
            }
        }

        public float Height
        {
            get
            {
                if (Ani.CurrentImage != null)
                {
                    return Ani.CurrentImage.Height;
                }
                return 0;
            }
        }

        public void AddBehavior(EntityBehavior behavior)
        {
            if (_behaviors == null)
            {
                _behaviors = new List<EntityBehavior>();
                _behaviorTicks = new List<int>();
            }
            _behaviors.Add(behavior);
            _behaviorTicks.Add(0);
        }
        public void AddBehavior<T>()
        {
            if (_behaviors == null)
            {
                _behaviors = new List<EntityBehavior>();
                _behaviorTicks = new List<int>();
            }
            var B = Activator.CreateInstance(typeof(T), this);
            _behaviors.Add((EntityBehavior)B);
            _behaviorTicks.Add(0);
            /*if (B is EntityBehavior)
            {
                _behaviors.Add((EntityBehavior)B);
                _behaviorTicks.Add(0);
            }else
            {
                throw new Exception("Attempted to add an invalid behavior");
            }*/
        }
        public void RemoveBehavior(EntityBehavior behavior)
        {
            if (_behaviors == null)
            {
                _behaviors = new List<EntityBehavior>();
                _behaviorTicks = new List<int>();
            }
            if (_behaviors.Contains(behavior))
            {
                _behaviorTicks.RemoveAt(_behaviors.IndexOf(behavior));
                _behaviors.Remove(behavior);
            }
        }
        public void RemoveBehavior<T>()
        {
            if (_behaviors == null)
                return;
            List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior is T));
            /*if (L.Count > 0)
            {
                RemoveBehavior(L[0]);
            }*/
            foreach (EntityBehavior behavior in L)
            {
                RemoveBehavior(behavior);
            }
            return;
        }
        public T GetBehavior<T>()
        {
            if (_behaviors == null)
                return default(T);
            /*List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior is T));
            if (L.Count>0)
            {
                return (dynamic)L[0];
            }*/
            return _behaviors.First(behavior => behavior is T).Cast<T>();
            return default(T);
        }
        //public T GetBehavior<T>(Func<EntityBehavior,bool> func)
        public T GetBehavior<T>(Func<T, bool> func)
        {
            List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior is T));
            Func<EntityBehavior, bool> F = func.ToDynamic();
            return L.First(F).Cast<T>();
            //return L.First(func).Cast<T>();
        }
        public string GetTeamColor()
        {
            if (this is ICombatant)
            {
                if (Game.GamePlaySettings.GameMode.Teams)
                {
                    return Game.GetTeamColor(((ICombatant)this).Team);
                }
                else
                {
                    if (this == Game.player)
                    {
                        return Game.GetTeamColor(1);
                    }
                    else
                    {
                        return Game.GetTeamColor(2);
                    }
                }
            }
            return "";
        }
        public bool SameTeam(Entity combatant)
        {
            if (Script.Write<bool>("this == combatant"))
            {
                return true;
            }
            dynamic A = this.ToDynamic();
            dynamic B = combatant.ToDynamic();

            if (A.PointsForKilling && B.PointsForKilling)
            {
                ICombatant AA = A;
                ICombatant BB = B;
                if (Script.Write<bool>("AA.Team == BB.Team"))
                {
                    if (Game.Teams)
                    {
                        //return ((ICombatant)this).Team != 0;
                        return true;
                    }
                    else
                    {
                        return Script.Write<bool>("AA.Team == 0");
                    }
                }
            }
            return false;
        }
        public EntityBehavior GetBehaviorFromName(string Name)
        {
            if (_behaviors == null)
                return null;
            //List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior.GetType().FullName==typeFullName));
            /*List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior.BehaviorName == Name));
            if (L.Count > 0)
            {
                return (dynamic)L[0];
            }*/
            try
            {
                return _behaviors.First(behavior => behavior.BehaviorName == Name);
            }
            catch
            {
                Console.WriteLine("Behavior " + Name + " was not found.");
            }
            return null;
        }
        /*public virtual bool HandledLocally
        {
            get
            {
                return Game.Hoster;
            }
        }*/
        public virtual void CustomEvent(dynamic evt)
        {

        }
        /*public void SendCustomEvent(dynamic evt, bool triggerflush = false)
        {
            dynamic D = new object();
            D.I = ID;
            D.D = evt;
            Game.SendEvent("CE", D,triggerflush);
        }*/
        public void PlaySound(string sound)
        {
            Game.PlaySoundEffect(getCenter(), sound);
        }

        public virtual Vector2 getCenter()
        {
            //return Position + new Vector2(Width / 2, Height / 2);
            return Vector2.Add(Position, Width / 2, Height / 2);
        }

        /*public Light GetLight()
        {
            if (this is ILightSource)
            {
                return Game.Lights.First(l => l.source == this);
            }
            return null;
        }*/

        public Entity(Game game)
        {
            //ID = Math.Random();
            ID = Helper.GetRandomString();
            this.Game = game;
        }

        public virtual Rectangle GetHitbox()
        {
            if (Ani != null && Ani.CurrentImage != null)
            {
                return new Rectangle(Ani.X, Ani.Y, Ani.CurrentImage.Width, Ani.CurrentImage.Height);
            }
            return null;
        }

        public virtual void Update()
        {
            Ani.Position += Speed;
            Ani.Update();
            if (_behaviors != null)
            {
                int i = 0;
                while (i < _behaviors.Count)
                {
                    EntityBehavior behavior = _behaviors[i];
                    if (behavior.enabled && _behaviorTicks[i]++ >= behavior.FramesPerTick)
                    {
                        _behaviorTicks[i] = 0;
                        behavior.Update();
                    }
                    i++;
                }
            }
        }
        public void RefreshBehaviorTick<T>()
        {
            EntityBehavior B = GetBehavior<T>().ToDynamic();
            if (B != null)
                _behaviorTicks[_behaviors.IndexOf(B)] = B.FramesPerTick;
        }

        public virtual void Draw(CanvasRenderingContext2D g)
        {
            Ani.Draw(g);
            if (!HideHitbox && Game.ShowHitbox)
            {
                DrawHitbox(g);
            }
            if (_behaviors != null)
            {
                foreach (EntityBehavior behavior in _behaviors)
                {
                    behavior.Draw(g);
                }
            }
        }
        public void DrawHitbox(CanvasRenderingContext2D g)
        {
            Rectangle R = GetHitbox();
            if (R != null)
            {
                g.StrokeStyle = "#FFFF00";
                g.StrokeRect((int)R.x, (int)R.y, (int)R.width, (int)R.height);
            }
        }

        public virtual void onRemove()
        {

        }

    }
}
