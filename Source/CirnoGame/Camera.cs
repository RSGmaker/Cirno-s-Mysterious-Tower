using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class Camera
    {
        public bool instawarp = false;
        public Vector2 Position;
        public Vector2 TargetPosition;
        public Vector2 CenteredTargetPosition
        {
            set
            {
                TargetPosition = new Vector2(value.X - (CameraBounds.width / 2), value.Y - (CameraBounds.height / 2));
            }
        }

        //public float LinearPanSpeed = 1.6f;
        //public float LinearPanSpeed = 1.3f;
        public float LinearPanSpeed = 1.2f;
        public float LerpPanSpeed = 0.075f;
        //protected float _scale = 0.8f;
        protected float _scale = 1f;
        public float speedmod = 1;
        public float Scale
        {
            get
            {
                return _scale;
            }
            set
            {
                _scale = value;
                _invscale = 1 / _scale;
                UpdateCameraBounds();
            }
        }
        //protected float _invscale = 1.25f;
        protected float _invscale = 1.0f;
        public float InvScale
        {
            get
            {
                return _invscale;
            }
            set
            {
                _invscale = value;
                _scale = 1 / _invscale;
                UpdateCameraBounds();
            }
        }
        private Vector2 _center = new Vector2();
        public Vector2 Center
        {
            get
            {
                Rectangle R = CameraBounds;
                //return R.Center;
                R.GetCenter(_center);
                return _center;
            }
            set
            {
                Position.X = value.X - (CameraBounds.width / 2);
                Position.Y = value.Y - (CameraBounds.height / 2);
            }
        }
        public void ScaleToSize(float sizeInPixels)
        {
            Scale = sizeInPixels / App.Canvas.Width;
        }
        public float viewport_width = 1;
        public float viewport_height = 1;
        //camera hitbox
        public Rectangle CameraBounds;
        //area camera must be confined to.
        public Rectangle StageBounds;
        public Camera(float viewport_width = -1, float viewport_height = -1)
        {
            Position = new Vector2();
            TargetPosition = new Vector2();
            this.viewport_width = viewport_width;
            this.viewport_height = viewport_height;
            CameraBounds = new Rectangle(0, 0, viewport_width, viewport_height);
            _invscale = 1.0f / _scale;
            UpdateCameraBounds();
        }
        private void UpdateCameraBounds()
        {
            //CameraBounds.width = App.Canvas.Width * _invscale;
            //CameraBounds.height = App.Canvas.Height * _invscale;
            CameraBounds.width = viewport_width * _invscale;
            CameraBounds.height = viewport_height * _invscale;
        }
        private Vector2 tmp = new Vector2();
        public void Update()
        {
            if (Position.X != TargetPosition.X || Position.Y != TargetPosition.Y)
            {
                //float dist = (Position - TargetPosition).Length;
                float dist = Position.Distance(TargetPosition);
                float spd = LinearPanSpeed + (dist * LerpPanSpeed);
                spd *= speedmod;

                if (dist <= spd || instawarp)
                {
                    Position.X = TargetPosition.X;
                    Position.Y = TargetPosition.Y;
                    instawarp = false;
                    return;
                }
                else
                {
                    tmp.CopyFrom(Position);
                    tmp.Subtract(TargetPosition);
                    tmp.SetAsNormalize(spd);
                    //Vector2 V = (Position - TargetPosition).Normalize(spd);
                    Position.Subtract(tmp);
                }
                if (StageBounds != null)
                {
                    Position.X = MathHelper.Clamp(Position.X, StageBounds.left, StageBounds.right - CameraBounds.width);
                    Position.Y = MathHelper.Clamp(Position.Y, StageBounds.top, StageBounds.bottom - CameraBounds.height);

                    TargetPosition.X = MathHelper.Clamp(TargetPosition.X, StageBounds.left, StageBounds.right - CameraBounds.width);
                    TargetPosition.Y = MathHelper.Clamp(TargetPosition.Y, StageBounds.top, StageBounds.bottom - CameraBounds.height);
                }

            }
            CameraBounds.x = Position.X;
            CameraBounds.y = Position.Y;
        }
        public void Apply(CanvasRenderingContext2D g)
        {
            g.Scale(Scale, Scale);
            g.Translate(-Position.X, -Position.Y);
        }
    }
}
