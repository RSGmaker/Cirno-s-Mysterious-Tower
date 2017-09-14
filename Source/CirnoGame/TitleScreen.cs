using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class TitleScreen : Sprite
    {
        public TextSprite Title;

        public TextSprite Version;

        public TextSprite Desc;

        public TextSprite Controls;

        public TextSprite Credits;

        public ButtonMenu menu;
        public Game game;
        public TitleScreen()
        {
            spriteBuffer.Width = App.Canvas.Width;
            spriteBuffer.Height = (int)(spriteBuffer.Width * App.TargetAspect);
            Title = new TextSprite();
            Title.FontSize = (int)(spriteBuffer.Width * 0.06f);
            //Title.Text = "Cirno and the mysterious tower";
            Title.Text = App.GameName;
            Title.TextColor = "#77FFFF";
            Title.ShadowColor = "#000000";
            Title.ShadowOffset = new Vector2(2, 2);
            Title.ShadowBlur = 2;

            CenterTextWithFloats(Title, 0.5f, 0.06f);

            Version = new TextSprite();
            Version.FontSize = (int)(spriteBuffer.Width * 0.016f);
            Version.Text = "Version:" + App.GameVersion;
            Version.TextColor = "#FFFFFF";
            Version.ShadowColor = "#000000";
            Version.ShadowOffset = new Vector2(2, 2);
            Version.ShadowBlur = 2;

            CenterTextWithFloats(Version, 0.75f, 0.11f);

            /*Title.ForceUpdate();
            Title.Position.Y = spriteBuffer.Height * 0.01f;
            Title.Position.X = (spriteBuffer.Width / 2) - (Title.spriteBuffer.Width / 2);*/



            Desc = new TextSprite();
            Desc.FontSize = (int)(spriteBuffer.Width * 0.030f);
            Desc.TextColor = "#FFFFFF";
            //Desc.Text = "Cirno has found herself in a strange dungeon filled with ghosts!\nHer energy has been stolen, reclaim the energy orbs to extend your time.\nFind the big key to unlock the door.";
            //Desc.Text = "Cirno has found herself in a strange dungeon filled with ghosts!\nReclaim your stolen energy sealed inside the orbs to extend your time.\nFind the gold key to unlock the door.";
            Desc.Text = "Cirno has found herself in a strange tower filled with ghosts!\nReclaim your stolen energy sealed inside the orbs to extend your time.\nRemember the door's location and search for the gold key.";
            Desc.ShadowColor = "#000000";
            Desc.ShadowOffset = new Vector2(2, 2);
            Desc.ShadowBlur = 2;
            CenterTextWithFloats(Desc, 0.5f, 0.2f);

            Controls = new TextSprite();
            Controls.FontSize = (int)(spriteBuffer.Width * 0.025f);
            Controls.TextColor = "#FFFFFF";
            Controls.Text = "Controls:\nLeft/Right=Move\nUp/Down=Aim(Up activates chests/doors)\nZ=Shoot\nX=Jump/Mid-air jump\nA=Place block below you(costs time)\nEnter=Pause\nM=Toggle mute";
            Controls.ShadowColor = "#000000";
            Controls.ShadowOffset = new Vector2(2, 2);
            Controls.ShadowBlur = 2;
            CenterTextWithFloats(Controls, 0.5f, 0.4f);
            Controls.Position.X = Desc.Position.X;

            menu = new ButtonMenu(spriteBuffer.Width * 0.8f, spriteBuffer.Height * 0.5f, (int)(spriteBuffer.Width * 0.05f));
            var B = menu.AddButton("Start Game");
            B.OnClick = () => {
                game.Start();
            };
            //menu.Finish();
            B.Position.X += spriteBuffer.Width * 0.38f;
            B.Position.Y = spriteBuffer.Height * 0.7f;

            Credits = new TextSprite();
            Credits.FontSize = (int)(spriteBuffer.Width * 0.015f);
            Credits.TextColor = "#77FFFF";
            //Credits.Text = "Made by:RSGmaker                                                                                                                     Touhou Project and it's characters are owned by ZUN";
            Credits.Text = "Made by:RSGmaker                                                                                                           Touhou Project and it's characters are owned by ZUN";
            Credits.ShadowColor = "#000000";
            Credits.ShadowOffset = new Vector2(2, 2);
            Credits.ShadowBlur = 2;
            CenterTextWithFloats(Credits, 0.5f, 0.98f);
        }
        public void CenterTextWithFloats(TextSprite T, float X, float Y)
        {
            CenterText(T, new Vector2(spriteBuffer.Width * X, spriteBuffer.Height * Y));
        }
        public void CenterText(TextSprite T, Vector2 Location)
        {
            T.ForceUpdate();
            T.Position.X = Location.X - (T.spriteBuffer.Width / 2);
            T.Position.Y = Location.Y - (T.spriteBuffer.Height / 2);
        }
        public override void Draw(CanvasRenderingContext2D g)
        {
            base.Draw(g);
            Title.Draw(g);
            Version.Draw(g);
            Desc.Draw(g);
            Controls.Draw(g);
            menu.Draw(g);
            menu.Update();
            Credits.Draw(g);

            //var M = KeyboardManager._this.MousePosition.Clone();
            var M = KeyboardManager._this.CMouse.Clone();
            if (!App.Div.Style.Left.Contains("px"))
            {
                return;
            }
            /*M.X -= float.Parse(App.Div.Style.Left.Replace("px", ""));*/
            //Credits.Text = "X:" + M.X+"/"+(spriteBuffer.Width * 0.1) +" Y:"+M.Y+"/"+(spriteBuffer.Height * 0.96);
            if (M.X < spriteBuffer.Width * 0.17 && M.Y >= spriteBuffer.Height * 0.96)
            {
                App.Div.Style.Cursor = Cursor.Pointer;
                if (KeyboardManager._this.TappedMouseButtons.Contains(0))
                {
                    Global.Location.Href = "https://rsgmaker.deviantart.com";
                }
            }
            else
            {
                App.Div.Style.Cursor = null;
            }
        }
    }
}
