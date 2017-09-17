using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class InputController
    {
        public static int NumberOfActions = 8;
        protected static GamePadManager GM;
        public List<InputMap> InputMapping;

        public string id { get; protected set; }

        public InputController(string id = "Keyboard")
        {
            this.id = id;
            InputMapping = new List<InputMap>();

            if (id == "Keyboard")
            {
                initkeyboard();
            }
            else
            {
                initgamepad();
            }
            if (GM == null)
            {
                if (GamePadManager._this == null)
                {
                    GamePadManager._this = new GamePadManager();
                }
                GM = GamePadManager._this;
            }
        }
        public dynamic CopyMap()
        {
            /*dynamic D = new object();
            return D;*/
            string[] fields = new string[] { "map", "antimap", "name", "axis", "controllerID" };
            dynamic[] ret = new dynamic[InputMapping.Count];
            int i = 0;
            while (i < ret.Length)
            {
                ret[i] = Helper.MakeShallowCopy(InputMapping[i], fields);
                i++;
            }
            return ret;
        }
        public void CopyFromMap(dynamic[] Map)
        {
            string[] fields = new string[] { "map", "antimap", "name", "axis", "controllerID" };

            int i = 0;
            while (i < Map.Length)
            {
                if (i >= InputMapping.Count)
                {
                    InputMapping.Add(new InputMap());
                }
                InputMap IM = InputMapping[i];
                Helper.CopyFields(Map[i], IM, fields);
                //ret[i] = Helper.MakeShallowCopy(InputMapping[i], fields);
                i++;
            }
        }
        protected void initkeyboard()
        {
            int i = 0;
            while (i < NumberOfActions)
            {
                InputMap map = new InputMap(-1);
                if (i == 0)
                {
                    map.map = 39;
                    map.antimap = 37;

                    /*map.map = 68;
                    map.antimap= 65;*/
                }
                if (i == 1)
                {
                    map.map = 40;
                    map.antimap = 38;

                    /*map.map = 83;
                    map.antimap = 87;*/
                }

                if (i == 2)
                {
                    //map.map = 32;
                    map.map = 90;
                }
                if (i == 3)
                {
                    map.map = 88;
                }
                if (i == 4)
                {
                    map.map = 65;//a
                }
                if (i == 5)
                {
                    map.map = 13;//enter
                }
                InputMapping.Add(map);
                i++;
            }
        }
        protected void initgamepad()
        {
            int i = 0;
            while (i < NumberOfActions)
            {
                InputMap map = new InputMap(-1);
                if (i == 0)
                {
                    map.map = 0;
                    map.axis = true;
                }
                if (i == 1)
                {
                    map.map = 1;
                    map.axis = true;
                }

                if (i > 1)
                {
                    map.map = i - 2;
                }
                InputMapping.Add(map);
                i++;
            }
        }
        public float getState(int action, InputMap map = null)
        {
            if (map == null)
                map = InputMapping[action];
            /*InputController IC = this;
            if (map.controller != null)
            {
                IC = map.controller;
            }*/
            string TID = id;
            if (map.controllerID != "")
            {
                TID = map.controllerID;
            }

            if (TID == "Keyboard")
            {
                return getKeyboardMapState(map);
            }
            else if (TID == "Mouse")
            {
                return getMouseMapState(map);
            }
            else
            {
                return getGamepadMapState(map);
            }
            return 0;
        }
        public bool getPressed(int action, InputMap map = null)
        {
            return getState(action, map) >= 0.7f;
        }
        public InputMap FindAnyPressedGamePadInput()
        {
            InputMap ret = new InputMap();
            List<GamePad> L = GamePadManager._this.activeGamepads;
            L.ForEach(G =>
            {
                if (ret.map == -1)
                {
                    ret.controllerID = G.id;
                    GamePadButton[] GB = G.buttons.Where(B => B.pressed).ToArray();
                    if (GB.Length > 0)
                    {
                        ret.axis = false;
                        GamePadButton tmp = GB[0];
                        ret.map = new List<GamePadButton>(G.buttons).IndexOf(tmp);
                    }
                    else
                    {
                        int i = 0;
                        while (i < G.axes.Length && ret.map == -1)
                        {
                            if (Math.Abs(G.axes[i]) > 0.7 && Math.Abs(G.axes[i]) < 2.0)
                            {
                                ret.axis = true;
                                ret.map = i;
                                if (G.axes[i] < 0)
                                {
                                    ret.name = "anti";
                                    ret.antimap = i;
                                }
                            }
                            i++;
                        }
                    }
                }
            }
                );
            if (ret.map != -1)
            {
                return ret;
            }
            return null;
        }
        public string getMapControllerID(InputMap map)
        {
            if (map.controllerID != "")
            {
                return map.controllerID;
            }
            else
            {
                return id;
            }
        }
        public string getMapControllerID(int action)
        {
            return getMapControllerID(InputMapping[action]);
        }
        protected float getGamepadMapState(InputMap map)
        {
            string TID = id;
            if (map.controllerID != "")
            {
                TID = map.controllerID;
            }
            GamePad P = GamePadManager._this.GetPad(TID);
            if (P == null || !P.connected)
            {
                return 0;
            }
            if (!map.axis)
            {
                if (P.buttons[map.map].pressed)
                {
                    return 1;
                }
                else if (map.antimap >= 0 && P.buttons[map.antimap].pressed)
                {
                    return -1;
                }
                return 0;
            }
            else
            {
                return (float)P.axes[map.map];
            }
        }
        protected float getKeyboardMapState(InputMap map)
        {
            List<int> L = KeyboardManager._this.PressedButtons;
            if (L.Contains(map.map))
            {
                return 1f;
            }
            else if (L.Contains(map.antimap))
            {
                return -1f;
            }
            return 0;
        }
        protected float getMouseMapState(InputMap map)
        {
            List<int> L = KeyboardManager._this.PressedMouseButtons;
            if (L.Contains(map.map))
            {
                return 1f;
            }
            else if (L.Contains(map.antimap))
            {
                return -1f;
            }
            return 0;
        }


    }
}
