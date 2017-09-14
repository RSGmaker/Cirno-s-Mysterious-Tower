using Bridge;
using Bridge.Html5;
using System;

namespace CirnoGame
{
    public class GamePad
    {
        public bool connected;
        public double[] axes;
        public GamePadButton[] buttons;
        public string id;
        public long index;
        public GamePad(dynamic pad)
        {
            id = pad.id;
            index = pad.index;
            connected = pad.connected;
            axes = pad.axes;

            int length = pad.buttons.length;

            buttons = new GamePadButton[length];
            int i = 0;
            while (i < length)
            {
                buttons[i] = pad.buttons[i];
                i++;
            }
        }
        public void Update()
        {
            int i = 0;
            while (i < buttons.Length)
            {
                buttons[i].tapped = false;
                i++;
            }
        }
        public void CombineData(GamePad pad)
        {
            if (id == pad.id)
            {
                connected = pad.connected;
                axes = pad.axes;
                //buttons = pad.buttons;
                CombineButtonData(pad.buttons);
            }
        }
        protected void CombineButtonData(GamePadButton[] buttons)
        {
            GamePadButton[] Lb = buttons;
            this.buttons = buttons;
            int i = 0;
            while (i < buttons.Length)
            {
                if (buttons[i].pressed && !Lb[i].pressed)
                {
                    buttons[i].tapped = true;
                }
                i++;
            }
        }
    }
}
