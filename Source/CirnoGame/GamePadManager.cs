using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CirnoGame
{
    public class GamePadManager
    {
        public static GamePadManager _this;
        public GamePadManager()
        {
            gamepads = new List<GamePad>();
            Update();
        }
        public List<GamePad> activeGamepads
        {
            get
            {
                return new List<GamePad>(gamepads.Where(gamepad => gamepad.connected));
            }
        }
        public GamePad keyboard;
        public List<GamePad> gamepads;
        private dynamic tempgamepads;
        public void CallBackTest()
        {
            Global.Alert("Callback!");
        }
        public GamePad GetPad(string id)
        {
            List<GamePad> L = new List<GamePad>(gamepads.Where(gamepad => gamepad.id == id));
            if (L.Count > 0)
            {
                return L[0];
            }
            return null;
        }
        public void Update()
        {
            int i = 0;
            while (i < gamepads.Count)
            {
                gamepads[i].Update();
                i++;
            }
            i = 0;
            tempgamepads = Script.Write<object>("(navigator.getGamepads() || navigator.webkitGetGamepads() || [])");
            List<GamePad> pads = new List<GamePad>();
            while (i < tempgamepads.length)
            {
                if (tempgamepads[i] != null)
                {
                    GamePad pad = new GamePad(tempgamepads[i]);
                    _Update(pad);
                    pads.Add(pad);
                }
                i++;
            }
            i = 0;
            //Adds any newly found gamepads.
            while (i < pads.Count)
            {
                string id = pads[i].id;
                int j = 0;
                bool ok = true;
                while (j < gamepads.Count)
                {
                    if (gamepads[j].id == id)
                    {
                        ok = false;
                    }
                    j++;
                }
                if (ok)
                {
                    gamepads.Add(pads[i]);
                }
                i++;
            }

            /*Action F = CallBackTest;
            Script.Write("setTimeout(F, 3000);");*/
            //Global.SetTimeout()
        }
        private void _Update(GamePad pad)
        {
            int i = 0;
            while (i < gamepads.Count)
            {
                GamePad P = gamepads[i];
                if (P.id == pad.id)
                {
                    P.CombineData(pad);
                }
                i++;
            }
        }
    }
}
