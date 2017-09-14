using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    [Priority(1)]
    public class GameMode
    {
        public enum ModeTypes
        {
            /// <summary>
            /// Single & Multiplayer, just a general game.
            /// </summary>
            Skirmish,
            /// <summary>
            /// Singleplayer, gameplay is changed up with a mode specific task.
            /// </summary>
            Challenge,
            /// <summary>
            /// Like challenge, but is designed for multiple human players.
            /// </summary>
            CallengeCoop
        }

        public bool Teams { get; protected set; }
        public int StartingLives { get; protected set; }
        public bool Survival { get; protected set; }
        public bool AllowOnlinePlay { get; protected set; }
        public bool AllowCharacterSelect { get; protected set; }
        public int NumberOfPlayers { get; protected set; }
        public int RespawnTime { get; protected set; }
        public string Name { get; protected set; }
        public ModeTypes ModeType { get; protected set; }
        public bool unlocked { get; protected set; }
        public string Description { get; protected set; }

        public static List<GameMode> GetGameModesOfType(ModeTypes type)
        {
            return new List<GameMode>(System.Linq.Enumerable.Where<global::CirnoGame.GameMode>(gameModes, (global::System.Func<global::CirnoGame.GameMode, bool>)(G => G.ModeType == type)));
        }

        public static GameMode GetGameModeByName(string name)
        {
            var ret = new List<GameMode>(System.Linq.Enumerable.Where<global::CirnoGame.GameMode>(gameModes, (global::System.Func<global::CirnoGame.GameMode, bool>)(G => G.Name == name)));
            if (ret.Count > 0)
            {
                return ret[0];
            }
            return null;
        }

        protected GameMode(string name)
        {
            Teams = true;
            StartingLives = 3;
            Survival = true;
            AllowOnlinePlay = true;
            AllowCharacterSelect = true;
            NumberOfPlayers = 6;
            RespawnTime = 390;
            Name = name;
            ModeType = GameMode.ModeTypes.Skirmish;
            Description = "Missing description for " + name;
            unlocked = true;
            gameModes.Add(this);
        }
        public static GameMode TeamBattle;
        public static GameMode DeathMatch;
        protected static List<GameMode> gameModes;

        //[Init]
        [Ready]
        protected static void init()
        {
            if (TeamBattle == null)
            {
                gameModes = new List<GameMode>();
                TeamBattle = new GameMode("Team Battle");
                TeamBattle.Description = "2 teams battle with limited lives\nuntil only 1 team remains.";
                DeathMatch = new GameMode("Death Match");
                DeathMatch.Description = "A free for all match with\nlimited lives.";
                DeathMatch.Teams = false;
            }
        }
    }
}
