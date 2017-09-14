using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class Game : GameSprite
    {
        public PlayerCharacter player;
        public List<Entity> entities;
        public Camera camera;
        public Rectangle stageBounds;
        public TileMap TM;
        public GamePlaySettings GamePlaySettings;

        public TextSprite TimerSprite;

        public float defaultTimeRemaining = 1000 * 60 * 3;//3 minutes
        public float maxTimeRemaining = 1000 * 60 * 5;//3 minutes
        public float timeRemaining;
        public float totalTime = 0;
        public int level = 0;
        public bool playing = false;
        public bool paused = false;
        public Vector2 cameraWanderPoint;
        public TitleScreen TS;

        public bool running
        {
            get
            {
                return playing && !paused;
            }
        }
        public bool skiprender = true;

        public TextSprite ScoreSprite;

        public CanvasRenderingContext2D EG;

        public ExitDoor Door;

        public HTMLImageElement Key;
        public Game()
        {
            GamePlaySettings = new GamePlaySettings();
            Door = new ExitDoor(this);
            player = new PlayerCharacter(this);
            player.HP = 0;
            timeRemaining = defaultTimeRemaining;
            //timeRemaining *= 0.3334f * 0.25f;

            /*test.Ani = new Animation(AnimationLoader._this.Get("images/cirno/walk"));
            test.Ani.ImageSpeed = 0.1f;*/
            entities = new List<Entity>();
            //stageBounds = new Rectangle(0, 0, 8000, 3000);
            //stageBounds = new Rectangle(0, 0, 6000, 4000);
            //stageBounds = new Rectangle(0, 0, 2000, 1500);
            //stageBounds = new Rectangle(0, 0, 1000, 750);
            //stageBounds = new Rectangle(0, 0, 2000, 1000);
            stageBounds = new Rectangle(0, 0, 4000, 2000);
            TM = new TileMap(this);
            TM.Seed = (int)(Math.Random() * 9999999999);
            ///TM.Generate();
            TM.position.Y = 0;
            var R = stageBounds - TM.position;
            R.width -= TM.tilesize;
            R.height -= TM.tilesize;
            //TM.DrawRect(R);



            player.Position.Y = stageBounds.height / 3;
            player.Position.X = stageBounds.width / 2;

            EG = Helper.GetContext(new HTMLCanvasElement());
            //MapGenerator.Generate(this);
            /*MapGenerator.BoxyGenerate(this);            
            TM.DrawRect(R);
            //TM.testTexture();
            TM.ApplyBreakable();*/
            /*var E = new Entity(this);
            E.Ani = new Animation(AnimationLoader.Get("Images/land/brick"));
            E.y += 24;
            entities.Add(E);
            var ln = 10;
            var i = 0;
            while (i < ln)
            {
                E = new Entity(this);
                E.Ani = new Animation(AnimationLoader.Get("Images/land/brick"));
                E.y += 24;
                E.x += 16 * (i+1);
                entities.Add(E);
                i++;
            }
            i = 0;
            while (i < ln)
            {
                E = new Entity(this);
                E.Ani = new Animation(AnimationLoader.Get("Images/land/brick"));
                E.y += 24;
                E.x += 16 * -(i + 1);
                entities.Add(E);
                i++;
            }*/


            //entities.Add(test);
            AddEntity(Door);
            ///AddEntity(player);


            //spriteBuffer.Width = 200;
            spriteBuffer.Width = App.Canvas.Width;
            spriteBuffer.Height = (int)(spriteBuffer.Width * App.TargetAspect);
            /*camera.viewport_width = spriteBuffer.Width;
            camera.viewport_height = spriteBuffer.Height;*/
            camera = new Camera(spriteBuffer.Width, spriteBuffer.Height);
            //camera.Scale = 6;
            ///camera.Scale = 5;
            camera.Scale = 4;

            //camera.Scale = 1f;
            camera.StageBounds = stageBounds;
            camera.Update();
            camera.instawarp = true;
            /*spriteBuffer.Width = App.Canvas.Width;
            spriteBuffer.Height = App.Canvas.Height;*/
            spriteGraphics.ImageSmoothingEnabled = false;

            /*PlaceAndAddEntity(new DoorKey(this));

            var i = 0;
            //while (i < 110)
            while (i < 24)
            {
                PlaceAndAddEntity(new MRGhosty(this));
                i++;
            }
            i = 0;
            while (i++ <= 6)
                PlaceAndAddEntity(new Orb(this));
            i = 0;
            while (i++ <= 3)
            {
                PlaceAndAddEntity(new Chest(this));
                PlaceAndAddEntity(new KeyItem(this));
            }
            i = 0;
            while (i++ <= 2)
            {
                PlaceAndAddEntity(new HealingItem(this));
            }*/
            StartNextLevel();


            TimerSprite = new TextSprite();
            TimerSprite.FontSize = spriteBuffer.Height / 24;
            TimerSprite.Text = "3:00";
            TimerSprite.TextColor = "#FFFFFF";
            TimerSprite.ShadowColor = "#000000";
            TimerSprite.ShadowOffset = new Vector2(3, 3);
            TimerSprite.ShadowBlur = 1;

            TimerSprite.Position.X = spriteBuffer.Width * 0.47f;
            TimerSprite.Position.Y = -TimerSprite.FontSize / 8;

            ScoreSprite = new TextSprite();
            //ScoreSprite.FontSize = spriteBuffer.Height / 24;
            ScoreSprite.FontSize = spriteBuffer.Height / 28;
            ScoreSprite.Text = "Level:1 Score:0";
            ScoreSprite.TextColor = "#FFFFFF";
            ScoreSprite.ShadowColor = "#000000";
            ScoreSprite.ShadowOffset = new Vector2(3, 3);
            ScoreSprite.ShadowBlur = 1;

            //ScoreSprite.Position.X = spriteBuffer.Width * 0.7f;
            ScoreSprite.ForceUpdate();
            ScoreSprite.Position.X = (spriteBuffer.Width * 0.98f) - ScoreSprite.spriteBuffer.Width;
            ScoreSprite.Position.Y = -ScoreSprite.FontSize / 8;

            Key = AnimationLoader.Get("images/items/key")[0];

            TS = new TitleScreen();
            TS.game = this;

            //PlayMusic("theme2");
            SetMusic();
        }
        public void ClearEntities()
        {
            var L = entities.ToArray();
            var i = 0;
            while (i < L.Length)
            {
                var E = L[i];
                if (E == player || E is ExitDoor)
                {

                }
                else
                {
                    E.Alive = false;
                    RemoveEntity(E);
                }
                i++;
            }
        }
        public void StartNextLevel()
        {
            ClearEntities();
            level += 1;
            var R = stageBounds - TM.position;
            R.width -= TM.tilesize;
            R.height -= TM.tilesize;
            TM.Generate();
            MapGenerator.BoxyGenerate(this);
            TM.DrawRect(R);
            TM.ApplyBreakable();



            var i = 0;
            //while (i < 110)
            while (i < 24)
            {
                PlaceAndAddEntity(new MRGhosty(this));
                i++;
            }
            i = 0;
            //while (i++ <= 6)
            while (i++ <= 4)
                PlaceAndAddEntity(new Orb(this));
            i = 0;
            while (i++ <= 3)
            {
                PlaceAndAddEntity(new Chest(this));
                PlaceAndAddEntity(new KeyItem(this));
            }
            i = 0;
            while (i++ <= 2)
            {
                PlaceAndAddEntity(new HealingItem(this));
            }

            PlaceAndAddEntity(new DoorKey(this));
            /*PlaceAndAddEntity(new DoorKey(this));
            PlaceAndAddEntity(new DoorKey(this));
            PlaceAndAddEntity(new DoorKey(this));
            PlaceAndAddEntity(new DoorKey(this));*/

            player.invincibilitytime = 180;
            camera.instawarp = true;
            skiprender = true;
            if (playing)
            {
                SetMusic();
            }
        }
        public void SetMusic()
        {
            if (!playing)
            {
                PlayMusic("theme2");
                return;
            }
            var songs = 2;
            var levelspersong = 5;
            var S = (int)(level / levelspersong);
            S = S % songs;
            PlayMusic("theme" + (S + 1));
        }
        public void PlaceAndAddEntity(Entity E)
        {
            E.Position.CopyFrom(MapRoom.FindAnyEmptySpot());
            AddEntity(E);
        }
        public static string GetTeamColor(int team)
        {
            if (team == 1)
            {
                return "#FF0000";
            }
            else if (team == 2 || team == 0)
            {
                return "#0000FF";
            }
            else if (team == 3)
            {
                return "#FFFF00";
            }
            return "#000000";
        }
        public bool muted = false;
        public override void Update()
        {
            base.Update();
            if (playing && KeyboardManager._this.TappedButtons.Contains(13))
            {
                paused = !paused;
                KeyboardManager._this.TappedButtons.Remove(13);
            }
            if (playing && KeyboardManager._this.TappedButtons.Contains(77))
            {
                AudioManager._this.StopAll();
                muted = !muted;
                if (!muted)
                {
                    SetMusic();
                }
                KeyboardManager._this.TappedButtons.Remove(77);
            }
            if (!paused)
            {
                UpdateControls();

                var i = 0;
                while (i < entities.Count)
                {
                    var E = entities[i];
                    if (E.Alive)
                    {
                        E.Update();
                    }
                    if (!E.Alive)
                    {
                        RemoveEntity(E);
                        i--;
                    }
                    i++;
                }
                UpdateCollisions();
                UpdateTime();
                if (playing && player.y < 0)
                {
                    //player glitched out somehow make a new level.
                    level--;
                    StartNextLevel();
                }
            }
            else
            {
                TimerSprite.Text = "Paused";
            }
        }
        public void DoGameOver()
        {
            if (!playing)
                return;
            if (entities.Contains(player))
            {
                RemoveEntity(player);
                //DoGameOver();
            }
            playing = false;
            StartNextLevel();

        }
        public void UpdateTime()
        {
            //timeRemaining -= 16.66667f;
            if (paused)
            {
                TimerSprite.Text = "Paused";
                return;
            }
            if (timeRemaining < 0)
            {
                timeRemaining = 0;
                TimerSprite.Text = "0";
                if (player.HP > 0)
                {
                    player.HP -= 0.004f;
                }
                else
                {
                    DoGameOver();
                }
                return;
            }
            var totalseconds = timeRemaining / 1000f;
            var totalminutes = totalseconds / 60;

            var minutes = (int)Math.Floor(totalminutes);
            var seconds = (totalseconds - (minutes * 60));

            var S = "";
            if (minutes > 0)
            {
                S = "" + minutes + ":";
            }
            var prefix = "";
            if (seconds < 10)
            {
                prefix = "0";
                if (totalseconds < 10)
                {
                    prefix = " ";
                }
            }
            S = S + RestrictLength(prefix + Math.Max(0, seconds), 4);
            TimerSprite.Text = S;
        }
        public string RestrictLength(string s, int length)
        {
            if (s.Length > length)
            {
                return s.Substr(0, length);
            }
            return s;
        }
        public void UpdateCollisions()
        {
            //List<Entity> combatants = new List<Entity>(System.Linq.Enumerable.Where<global::CirnoGame.Entity>(entities, (global::System.Func<global::CirnoGame.Entity, bool>)(entity => entity is ICombatant && entity.Ani.CurrentImage != null && ((ICombatant)entity).HP > 0)));
            //List<Entity> harmfulEntity = new List<Entity>(System.Linq.Enumerable.Where<global::CirnoGame.Entity>(entities, (global::System.Func<global::CirnoGame.Entity, bool>)(entity => entity is IHarmfulEntity && entity.Ani.CurrentImage != null)));
            List<Entity> combatants = new List<Entity>(entities.Where(entity => entity is ICombatant && entity.Ani.CurrentImage != null && ((ICombatant)entity).HP > 0));
            List<Entity> harmfulEntity = new List<Entity>(entities.Where(entity => entity is IHarmfulEntity && entity.Ani.CurrentImage != null));
            var R2 = new Rectangle();
            var OR2 = new Rectangle();
            int i = 0;
            while (i < combatants.Count)
            {
                Entity E = combatants[i];
                if (E is ICombatant)
                {
                    ICombatant EI = (ICombatant)E;
                    Rectangle R = E.GetHitbox();
                    Vector2 spd = E.Speed * 0.5f;
                    //Rectangle R2 = new Rectangle(R.x - (spd.X), R.y - (spd.Y), R.width, R.height);
                    R2.Set(R.x - (spd.X), R.y - (spd.Y), R.width, R.height);
                    //List<Entity> L = new List<Entity>(harmfulEntity.Where(entity => entity != E && entity.GetHitbox().isTouching(R)));
                    //List<Entity> L = new List<Entity>(harmfulEntity.Where(entity => entity != E && ((ICombatant)((IHarmfulEntity)entity).Attacker).Team != EI.Team));
                    //List<Entity> L = new List<Entity>(System.Linq.Enumerable.Where<global::CirnoGame.Entity>(harmfulEntity, (global::System.Func<global::CirnoGame.Entity, bool>)(entity => entity != E && !((IHarmfulEntity)entity).Attacker.SameTeam((Entity)EI))));
                    List<Entity> L = new List<Entity>(harmfulEntity.Where(entity => entity != E && !((IHarmfulEntity)entity).Attacker.SameTeam((Entity)EI)));
                    int j = 0;
                    while (j < L.Count)
                    {
                        Entity tmp = L[j];
                        IHarmfulEntity HE = (IHarmfulEntity)tmp;
                        Rectangle OR = tmp.GetHitbox();
                        Vector2 spd2 = tmp.Speed * 0.5f;
                        //Rectangle OR2 = new Rectangle(OR.x - (spd2.X), OR.y - (spd2.Y), OR.width, OR.height);
                        OR2.Set(OR.x - (spd2.X), OR.y - (spd2.Y), OR.width, OR.height);
                        //if (EI.Team != ((ICombatant)HE.Attacker).Team)
                        if ((R.isTouching(OR) || R2.isTouching(OR2)))
                        {
                            if (HE.ontouchDamage(EI))
                            {
                                var LHP = EI.HP;
                                EI.onDamaged(HE, HE.touchDamage);
                                if (LHP > EI.HP)
                                {
                                    ((Entity)EI).PlaySound("hit");
                                }
                                if (EI.HP <= 0)
                                {
                                    if (((Entity)EI).HandledLocally)
                                    {
                                        dynamic D = new object();
                                        D.I = ((Entity)EI).ID;
                                        D.A = ((Entity)HE.Attacker).ID;
                                        D.S = ((Entity)HE).ID;
                                        SendEvent("Kill", D);
                                    }
                                }
                            }
                            Attack((ICombatant)EI, (IHarmfulEntity)HE);
                        }
                        j++;
                    }
                    /*List<Entity> L = new List<Entity>(combatants.Where(entity => entity != E && entity is ICombatant && entity.GetHitbox().intersects(R)));
                    int j = 0;
                    while (j < L.Count)
                    {

                        j++;
                    }*/
                }
                i++;
            }
        }
        public void Attack(ICombatant target, IHarmfulEntity source)
        {
            if (target.HP > 0 && source.ontouchDamage(target))
            {
                target.onDamaged(source, source.touchDamage);
                ((Entity)target).PlaySound("hit");
                if (target.HP <= 0)
                {
                    if (((Entity)target).HandledLocally)
                    {
                        dynamic D = new object();
                        D.I = ((Entity)target).ID;
                        D.A = ((Entity)source.Attacker).ID;
                        D.S = ((Entity)source).ID;
                        SendEvent("Kill", D);
                    }
                }
            }
        }
        public void PlaySoundEffect(Vector2 source, string sound)
        {
            if (muted)
            {
                return;
            }
            float vol = 1f;
            /*float min = 640;
            float maxLength = 320;*/
            //float min = 700;
            float min = 50;
            float maxLength = 200;
            if (source != null)
            {
                //float dist = (camera.Center - source).RoughLength;
                //float dist = (camera.Center - source).Length;
                float dist = camera.Center.EstimatedDistance(source);
                dist -= min;
                if (dist > 0)
                {
                    if (dist >= maxLength)
                    {
                        //volume of 0, just don't play it.
                        return;
                    }
                    else
                    {
                        vol = 1f - (dist / maxLength);
                    }
                }
            }
            AudioManager._this.Blast("SFX/" + sound + ".ogg", vol);
        }

        public void AddEntity(Entity E)
        {
            entities.Add(E);
        }
        public void RemoveEntity(Entity E)
        {
            E.onRemove();
            entities.Remove(E);
        }
        public override void Render()
        {
            base.Render();

            CanvasRenderingContext2D g = spriteGraphics;
            if (skiprender)
            {
                g = EG;
                skiprender = false;
            }
            UpdateCamera();
            DrawBackground(g);

            g.Save();

            camera.Apply(g);
            //TM.position.Y = -200;
            TM.Draw(g);
            entities.ForEach((global::System.Action<global::CirnoGame.Entity>)(E => { if (E.Alive && E.Visible) { E.Draw(g); } }));

            g.Restore();

            if (playing)
            {
                RenderGUI(g);
            }
            else
            {
                g.GlobalAlpha = 0.3f;
                g.FillStyle = "#000000";
                g.FillRect(0, 0, spriteBuffer.Width, spriteBuffer.Height);
                g.GlobalAlpha = 1f;
                TS.Draw(g);
                if (player.score > 0)
                {
                    ScoreSprite.Text = "Level:" + level + " Score:" + player.score;
                    ScoreSprite.ForceUpdate();
                    ScoreSprite.Position.X = (spriteBuffer.Width * 0.98f) - ScoreSprite.spriteBuffer.Width;
                    ScoreSprite.Draw(g);
                }
            }

        }
        public void Start()
        {
            if (entities.Contains(player))
            {
                RemoveEntity(player);
            }
            player = new PlayerCharacter(this);
            AddEntity(player);
            playing = true;
            level = 0;
            StartNextLevel();
            App.Div.Style.Cursor = null;

            totalTime = 0;
            timeRemaining = defaultTimeRemaining;
            //timeRemaining *= 0.3334f * 0.25f;
            /*timeRemaining *= 0.3334f * 0.05f;
            player.HP = 5;*/
        }

        public void PlayMusic(string song)
        {
            if (muted)
                return;
            Audio M = AudioManager._this.Get("BGM/" + song + ".ogg");
            if (!M.IsPlaying)
            {
                AudioManager._this.StopAllFromDirectory("BGM/");
                //M.Volume = 0.35;
                M.Volume = 0.35;
                M.Loop = true;
                M.Play();
            }
        }
        public void RenderGUI(CanvasRenderingContext2D g)
        {
            var PC = (PlayerCharacter)player;
            var color = "#00DD00";
            if (timeRemaining <= 0)
            {
                color = "#FF0000";
            }

            g.GlobalAlpha = 0.8f;
            DrawGauge(g, new Vector2(0, 0), new Vector2(spriteBuffer.Width / 4, spriteBuffer.Height / 20), 5, PC.HP / PC.maxHP, color);
            g.GlobalAlpha = 1;

            TimerSprite.Draw(g);
            ScoreSprite.Text = "Level:" + level + " Score:" + player.score;
            ScoreSprite.ForceUpdate();
            ScoreSprite.Position.X = (spriteBuffer.Width * 0.98f) - ScoreSprite.spriteBuffer.Width;
            ScoreSprite.Draw(g);
            RenderIcons(g);
        }
        public void RenderIcons(CanvasRenderingContext2D g)
        {
            var R = Key.Height / Key.Width;
            var W = spriteBuffer.Width * 0.02f;
            var H = spriteBuffer.Height * 0.055f;

            var Y = H;
            var X = W / 2;
            var i = 0;
            //var sz = spriteBuffer.Width * 0.015f;
            var sz = spriteBuffer.Width * 0.0115f;
            g.GlobalAlpha = 0.8f;
            while (i < player.keys)
            {
                g.DrawImage(Key, X, Y, sz, sz * R);
                X += W;
                i++;
            }
            g.GlobalAlpha = 1f;
        }
        public void DrawGauge(CanvasRenderingContext2D g, Vector2 position, Vector2 size, int border, float progress, string color, bool drawborder = true)
        {
            var alpha = g.GlobalAlpha;
            if (drawborder)
            {
                g.GlobalAlpha = 0.6f * alpha;
                g.FillStyle = "#000000";

                g.FillRect((int)position.X, (int)position.Y, (int)size.X, (int)size.Y);
            }

            g.FillStyle = color;
            g.GlobalAlpha = 1.0f * alpha;
            g.FillRect((int)position.X + border, (int)position.Y + border, (int)((size.X - (border + border)) * progress), (int)size.Y - (border + border));

            g.GlobalAlpha = 0.5f * alpha;
            //Script.Write("var grd = g.createLinearGradient(0, 0, 0, size.y);grd.addColorStop(0, color);grd.addColorStop(0.4, \"white\");grd.addColorStop(1, color);g.fillStyle = grd;");
            var grd = g.CreateLinearGradient(0, 0, 0, size.Y);
            grd.AddColorStop(0, color);
            grd.AddColorStop(0.4, "white");
            grd.AddColorStop(1, color);
            g.FillStyle = grd;


            g.FillRect((int)position.X + border, (int)position.Y + border, (int)((size.X - (border + border)) * progress), (int)size.Y - (border + border));
            g.GlobalAlpha = alpha;
        }
        public bool ShowHitbox = false;
        public void SendEvent(string eventName, dynamic data, bool triggerflush = false)
        {
            dynamic D = new object();
            D.E = eventName;
            D.D = data;
            /*NetPlayUser NU = null;
            if (Online)
            {
                NP.Send(D);
                NU = NP.Me;
            }*/
            //ProcessEvent(D, NU, 0);
            ProcessEvent(D);
            /*if (triggerflush)
            {
                NetPlayNeedsFlush = true;
            }*/
        }
        public void ProcessEvent(dynamic msg, /*NetPlayUser*/object user = null, float latency = 0)
        {
            dynamic D = msg.D;
            /*List<Player> LP = new List<Player>(players.Where(player => user != null && player.NetworkID == user.userID));
            Player P = null;
            
            bool hascharacter = true;
            if (LP.Count <= 0)
            {
                if (P == null && user == null && !Online)
                {
                    P = localplayer;
                }
                else
                {
                    if (user.IsMe)
                    {
                        localplayer.NetworkID = user.userID;
                        P = localplayer;
                    }
                    else
                    {
                        hascharacter = false;
                    }
                }
            }
            else
            {
                P = LP[0];
            }*/
            string evt = msg.E;
            /*if (user != null && !user.IsMe)
            {
                Dlatency += latency;
                //latency *= 0.99f;
                Dlatency *= (1 - (1 / latencyM));
            }
            //if (msg.E == "Init" && !P.local)
            if (evt == "Init" && P == null)
            {
                if (!hascharacter)
                {
                    P = new Player(false, false);
                    P.NetworkID = user.userID;
                    //PlayerCharacter PC = new PlayerCharacter(this, P, "Reisen");
                    PlayerCharacter PC = new PlayerCharacter(this, P, D.C);
                    //PC.Team = 1;
                    PC.Team = D.T;
                    PC.x = 700;
                    PC.y = 240;
                    PC.ID = D.I;
                    players.Add(P);
                    AddEntity(PC);
                    if (Hoster)
                    {
                        SendEvent("MapSeed", TM.Seed);

                        List<Entity> L = new List<Entity>(entities.Where(E => E is MadnessOrb || (E is PlayerCharacter && ((PlayerCharacter)E).player.CPU)));
                        int i = 0;
                        while (i < L.Count)
                        {
                            SendEntitySpawnCheck(L[i]);
                            i++;
                        }
                    }
                    Console.WriteLine("User:" + P.NetworkID + " has joined!");
                }
            }
            if (evt == "Spawn")
            {
                Entity E = EntityFromID(D.I);
                if (E == null)
                {
                    Type T = Helper.GetType(D.T);
                    E = Activator.CreateInstance(T, this).ToDynamic();
                    E.ID = D.I;
                    E.x = D.X;
                    E.y = D.Y;

                    if (D.D)
                    {
                        Helper.CopyFields(D.D, E);
                    }
                    AddEntity(E);
                    CatchupEntity(E, latency);
                    //Activator.CreateInstance()
                    //System.Reflection.
                    //Type T = Type.GetType("");
                }
            }
            if (evt == "Unpause")
            {
                paused = false;
                Console.WriteLine("Game unpaused");
                SendInit();
            }
            if (evt == "MapSeed" && !Hoster)
            {
                if (TM.Seed != D)
                {
                    TM.Seed = D;
                    TM.Generate();
                    //clean up local client entities.
                    if (!connected)
                    {
                        int i = 0;
                        while (i < entities.Count)
                        {
                            if (entities[i] is MadnessOrb || (entities[i] is PlayerCharacter && ((PlayerCharacter)entities[i]).player.CPU))
                            {
                                RemoveEntity(entities[i]);
                                i--;
                            }
                            i++;
                        }
                        connected = true;
                    }
                }

            }
            if (evt == "CE")
            {
                Entity entity = EntityFromID(D.I);
                if (entity != null)
                {
                    entity.CustomEvent(D.D);
                }
            }
            if (evt == "CBE")
            {
                Entity entity = EntityFromID(D.I);
                if (entity != null)
                {
                    EntityBehavior b = entity.GetBehaviorFromName(D.T);
                    b.CustomEvent(D.D);
                    //entity.CustomEvent(D.D);
                }
            }*/
            if (evt == "Kill")
            {
                Entity entity = EntityFromID(D.I);
                if (entity != null)
                {
                    Entity attacker = EntityFromID(D.A);
                    ((ICombatant)entity).onDeath(EntityFromID(D.S));
                    if (attacker != null && attacker is PlayerCharacter)
                    {
                        PlayerCharacter PC = (PlayerCharacter)attacker;
                        //PC.player.Score += ((ICombatant)entity).PointsForKilling;
                        PC.score += ((ICombatant)entity).PointsForKilling;
                        PC.onKill(((ICombatant)entity));
                    }
                }
            }
        }
        public Entity EntityFromID(string ID)
        {
            int i = 0;
            while (i < entities.Count)
            {
                Entity E = entities[i];
                if (E.ID == ID)
                {
                    return E;
                }
                i++;
            }
            return null;
        }
        public bool freecam = false;
        public void UpdateCamera()
        {
            //float D = test.Hspeed * 18;
            //float D = (float)Math.Abs(test.Hspeed) * 9;
            //var freecam = true;
            camera.speedmod = 1f;

            /*if (KeyboardManager._this.TappedButtons.ContainsB(67) && App.DEBUG)
            {
                freecam = !freecam;
            }*/
            if (freecam)
            {
                var spd = 16 / camera.Scale;
                var PB = KeyboardManager._this.PressedButtons;
                //numpad panning
                if (CirnoGame.HelperExtensions.ContainsB<int>(PB, 100))
                {
                    camera.TargetPosition.X -= spd;
                }
                if (CirnoGame.HelperExtensions.ContainsB<int>(PB, 102))
                {
                    camera.TargetPosition.X += spd;
                }

                if (CirnoGame.HelperExtensions.ContainsB<int>(PB, 104))
                {
                    camera.TargetPosition.Y -= spd;
                }
                if (CirnoGame.HelperExtensions.ContainsB<int>(PB, 98))
                {
                    camera.TargetPosition.Y += spd;
                }
                if (CirnoGame.HelperExtensions.ContainsB<int>(PB, 107))//numpad+
                {
                    var CC = camera.Center;
                    camera.Scale *= 1.01f;
                    camera.Center = CC;
                    camera.TargetPosition.X = camera.Position.X;
                    camera.TargetPosition.Y = camera.Position.Y;
                }
                if (CirnoGame.HelperExtensions.ContainsB<int>(PB, 109))//numpad-
                {
                    var CC = camera.Center;
                    camera.Scale *= 0.99f;
                    camera.Center = CC;
                    camera.TargetPosition.X = camera.Position.X;
                    camera.TargetPosition.Y = camera.Position.Y;
                }
                if (CirnoGame.HelperExtensions.ContainsB<int>(PB, 36))//home
                {
                    camera.CenteredTargetPosition = player.Position;
                }
                if (CirnoGame.HelperExtensions.ContainsB<int>(PB, 13))//enter
                {
                    player.Position.X = camera.Center.X;
                    player.Position.Y = camera.Center.Y;
                }
                camera.Update();
                return;
            }
            if (!playing)
            {
                camera.speedmod = 0.05f;
                if (camera.TargetPosition == null || camera.Position.EstimatedDistance(camera.TargetPosition) < 40)
                {
                    if (Math.Random() < 0.0035 || camera.instawarp)
                    {
                        camera.CenteredTargetPosition = MapRoom.FindAnyEmptySpot();
                    }
                }
                /*camera.TargetPosition = null;
                if (cameraWanderPoint == null)
                {
                    cameraWanderPoint = MapRoom.FindAnyEmptySpot();
                }*/
                camera.Update();
                return;
            }
            if (player.HP < 0)
                return;
            float D = (float)player.Hspeed * 32;
            var H = camera.CameraBounds.width / 8;
            D += !player.Ani.Flipped ? H : -H;
            var C = App.Canvas;
            var IS = camera.InvScale;
            float V = Math.Max(0, player.Vspeed * 30);
            if (player.Controller[2])
            {
                V -= camera.CameraBounds.height / 4;
            }
            else if (player.Controller[3])
            {
                V += camera.CameraBounds.height / 4;
            }
            else if (player.onGround)
            {
                //V -= camera.CameraBounds.height / 8;
                V -= camera.CameraBounds.height / 10;
            }
            else
            {
                V += camera.CameraBounds.height / 12;
            }

            var TP = camera.TargetPosition;
            /*TP.X = (test.x + D) - ((C.Width / 2) * IS);
            TP.Y = (float)Math.Max(0, (test.y + V) - ((C.Height / 2) * IS));*/
            /*TP.X = test.x;
            TP.Y = test.y;*/
            var X = player.x + (player.Width / 2) + D;
            var Y = player.y + (player.Height / 2) + V;
            camera.CenteredTargetPosition = new Vector2(X, Y);
            camera.Update();
        }
        public void DrawBackground(CanvasRenderingContext2D g)
        {
            g.FillStyle = "#77AAFF";
            g.FillRect(0, 0, App.Canvas.Width, App.Canvas.Height);
            /*if (BG < 0 || BG >= BGs.Count)
            {
                g.FillStyle = "#77AAFF";
                g.FillRect(0, 0, App.Canvas.Width, App.Canvas.Height);
            }
            else
            {
                g.DrawImage(BGs[BG], (float)0, (float)0);
            }*/
        }
        public void UpdateControls()
        {

            var PC = player;
            float threshhold = 0.7f;
            bool[] C = PC.Controller;
            var IC = App.IC;

            if (IC == null)
            {
                return;
            }
            float x = IC.getState(0);
            float y = IC.getState(1);
            C[0] = x <= -threshhold;
            C[1] = x >= threshhold;
            C[2] = y <= -threshhold;
            C[3] = y >= threshhold;

            string cid = IC.getMapControllerID(5);
            if (cid == "Keyboard" || cid == "Mouse")
            //if (IC.id == "Keyboard")
            {
                ////PC.AimAt(GetMouse());
                /*C[4] = KeyboardManager._this.PressedMouseButtons.Contains(0);
                C[5] = KeyboardManager._this.PressedMouseButtons.Contains(2);*/
                C[4] = IC.getPressed(2);
                C[5] = IC.getPressed(3);
                C[6] = IC.getPressed(4);
            }
            else
            {
                /*GamePad P = GamePadManager._this.GetPad(IC.id);
                PC.aimAngle = new Vector2((float)P.axes[2], (float)P.axes[3]).ToAngle();*/
                Vector2 aim = new Vector2(IC.getState(4), IC.getState(5));
                if (aim.RoughLength > 0.5)
                {
                    ////PC.aimAngle = aim.ToAngle();
                }


            }
            C[4] = IC.getPressed(2);
            C[5] = IC.getPressed(3);
            C[6] = IC.getPressed(4);
            /*C[4] = IC.getPressed(3);
            C[5] = IC.getPressed(4);*/

            object o = new object();
        }
    }
}
