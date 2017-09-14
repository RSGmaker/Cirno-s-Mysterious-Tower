using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class GamePlaySettings
    {
        public bool Online = false;
        public string MyCharacter = "Reisen";
        public GameMode GameMode;
        public int MyTeam = 1;
        public int BlueNPCs = 3;
        public int RedNPCs = 2;
        public string RoomID = "";
        ///public NetPlay HostNPOut;
        public float ComputerAIModifier = 1f;
        public GamePlaySettings()
        {
            //GameMode = new GameMode();
            //GameMode = GameMode.DeathMatch;
            GameMode = GameMode.TeamBattle;
        }
    }
}
