using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class ButtonMenu
    {
        //public List<ButtonSprite> buttons;
        protected List<List<ButtonSprite>> rows;
        public float MenuWidth;
        public float MenuHeight;
        protected int FontSize;
        public bool SelectionMenu;
        public ButtonSprite Selected = null;
        public ButtonMenu Self;
        public dynamic SelectedData
        {
            get
            {
                if (Self.Selected != null)
                {
                    return Self.Selected.Data;
                }
                return null;
            }
        }
        public string SelectedText
        {
            get
            {
                if (Self.Selected != null)
                {
                    if (Self.Selected.Contents is TextSprite)
                    {
                        return ((TextSprite)Self.Selected.Contents).Text;
                    }
                }
                return null;
            }
        }

        public Action OnChoose;

        public Vector2 Position = new Vector2();

        public ButtonMenu(float menuWidth, float menuHeight, int FontSize, bool selectionMenu = false)
        {
            rows = new List<List<ButtonSprite>>();
            this.MenuWidth = menuWidth;
            this.MenuHeight = menuHeight;
            this.FontSize = FontSize;
            this.SelectionMenu = selectionMenu;
            Self = this;
        }
        public List<ButtonSprite> GetAllButtons()
        {
            List<ButtonSprite> all = new List<ButtonSprite>();
            rows.ForEach((global::System.Action<global::System.Collections.Generic.List<global::CirnoGame.ButtonSprite>>)(R => all.AddRange(R)));
            return all;
        }
        public ButtonSprite GetSpriteByData(dynamic data)
        {
            List<ButtonSprite> all = new List<ButtonSprite>(System.Linq.Enumerable.Where<global::CirnoGame.ButtonSprite>(GetAllButtons(), (global::System.Func<global::CirnoGame.ButtonSprite, bool>)(B => B.Data == data)));
            if (all.Count > 0)
            {
                return all[0];
            }
            return null;
        }
        public void AddButtons(string[] buttonText)
        {
            CirnoGame.HelperExtensions.ForEach<string>(buttonText, (global::System.Action<string>)(T => AddButton((string)T)));
        }
        public ButtonSprite AddButton(string buttonText, int row = -1, dynamic data = null)
        {
            TextSprite T = new TextSprite();
            T.Text = buttonText;
            T.FontSize = FontSize;
            //ButtonSprite B = new ButtonSprite(T, (int)(FontSize * 0.05));
            ButtonSprite B = new ButtonSprite(T, (int)(FontSize * 0.1));
            if (data != null)
            {
                B.Data = data;
            }
            AddButton(B, row);
            return B;
        }
        public void AddButton(ButtonSprite button, int row = -1)
        {
            if (rows.Count == 0)
            {
                rows.Add(new List<ButtonSprite>());
            }
            if (row == -1)
            {
                row = rows.Count - 1;
            }
            if (button != null)
            {
                button.OnClick = () => { Self.Select(button); };
            }
            rows[row].Add(button);
        }
        public void Select(ButtonSprite button)
        {
            if (Selected != button || !SelectionMenu)
            {
                if (Selected != null && SelectionMenu)
                {
                    //Selected.BorderColor = "#00AA33";
                    //Selected.ButtonColor = "#11CC55";
                    Selected.SetColorScheme(0);
                }
                Selected = button;
                var OSC = OnChoose;
                var self = this;
                if (SelectionMenu && Selected != null)
                {
                    //Selected.BorderColor = "#FFFFFF";
                    //Selected.ButtonColor = "#FF0000";
                    Selected.SetColorScheme(1);
                }
                if (Selected != null && Script.Write<bool>("OSC"))
                {
                    self.OnChoose();
                }
            }
        }
        public void CombineRows()
        {
            List<ButtonSprite> all = new List<ButtonSprite>();
            rows.ForEach((global::System.Action<global::System.Collections.Generic.List<global::CirnoGame.ButtonSprite>>)(R => all.AddRange(R)));

            rows = new List<List<ButtonSprite>>();
            rows.Add(all);
        }
        protected List<ButtonSprite> addRow()
        {
            List<ButtonSprite> ret = new List<ButtonSprite>();
            rows.Add(ret);
            return ret;
        }
        public void BreakUp(int totalRows)
        {
            CombineRows();
            List<ButtonSprite> all = rows[0];
            rows = new List<List<ButtonSprite>>();
            double C = Math.Ceiling(all.Count / (double)totalRows);
            List<ButtonSprite> row = addRow();
            int i = 0;
            while (i < all.Count)
            {
                if (row.Count >= C)
                {
                    row = addRow();
                }
                AddButton(all[i]);
                i++;
            }
        }
        protected void CenterOn(Sprite sprite, Vector2 Center)
        {
            sprite.Draw(null);
            Vector2 S = sprite.Size;
            Vector2 S2 = S / 2f;
            sprite.Position = Center - S2;
        }
        protected void UpdateRow(int index, float y)
        {
            List<ButtonSprite> row = rows[index];
            float X = (MenuWidth / (row.Count + 1.0f));
            int i = 0;
            float CX = X;

            CX += Position.X;
            while (i < row.Count)
            {
                ButtonSprite B = row[i];
                if (B != null)
                {
                    CenterOn(B, new Vector2(CX, y));
                }
                CX += X;
                i++;
            }
        }
        public void Finish(int totalRows = -1)
        {
            if (totalRows > 0)
            {
                BreakUp(totalRows);
            }
            float y = 0;
            float CY = 0;
            if (totalRows > 0 && rows.Count < totalRows)
            {
                y = (MenuHeight / (rows.Count + 1));
                CY = y;
            }
            else
            {
                y = (MenuHeight / (rows.Count));
                CY = 0;
            }

            CY += Position.Y;
            var i = 0;
            while (i < rows.Count)
            {
                UpdateRow(i, CY);
                CY += y;
                i++;
            }
        }
        public void Update(Vector2 mousePosition = null, bool clicked = true)
        {
            if (mousePosition == null)
            {
                mousePosition = KeyboardManager._this.CMouse;
                clicked = KeyboardManager._this.TappedMouseButtons.Contains(0);
            }
            if (clicked)
            {
                rows.ForEach((global::System.Action<global::System.Collections.Generic.List<global::CirnoGame.ButtonSprite>>)(R => R.ForEach((global::System.Action<global::CirnoGame.ButtonSprite>)(B => { if (B != null) B.CheckClick(mousePosition); }))));
            }
        }
        public void Draw(CanvasRenderingContext2D g)
        {
            rows.ForEach((global::System.Action<global::System.Collections.Generic.List<global::CirnoGame.ButtonSprite>>)(R => R.ForEach((global::System.Action<global::CirnoGame.ButtonSprite>)(B => { if (B != null) B.Draw(g); }))));
        }
    }
}
